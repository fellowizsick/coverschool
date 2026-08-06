import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { verifyFamilyAccess } from '@/lib/academic-verify'

const RATE_WINDOW_MS = 60 * 60 * 1000
const RATE_LIMIT = 5
const rateBuckets = new Map<string, number[]>()

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const hits = (rateBuckets.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS)
  if (hits.length >= RATE_LIMIT) {
    rateBuckets.set(ip, hits)
    return true
  }
  hits.push(now)
  rateBuckets.set(ip, hits)
  return false
}

function passwordOk(pw: string): { ok: boolean; msg?: string } {
  if (pw.length < 8) return { ok: false, msg: 'Password must be at least 8 characters.' }
  if (pw.length > 72) return { ok: false, msg: 'Password is too long.' }
  return { ok: true }
}

/**
 * POST /api/recover — reset the portal password for a family who lost/stole
 * access. Identity is re-verified with email + student name + PIN (the same
 * proof they use everywhere), then the auth user's password is reset.
 * If no portal account exists yet, one is created with the new password.
 */
export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    if (rateLimited(ip)) {
      return NextResponse.json({ ok: false, error: 'Too many attempts. Please wait and try again.' }, { status: 429 })
    }

    const body = await request.json()
    const password = String(body.password || '')
    const pwCheck = passwordOk(password)
    if (!pwCheck.ok) {
      return NextResponse.json({ ok: false, error: pwCheck.msg }, { status: 400 })
    }

    // Verify identity with the enrollment facts (email + name + PIN)
    const verified = await verifyFamilyAccess(body)
    if ('error' in verified) {
      return NextResponse.json({ ok: false, error: verified.error }, { status: verified.status })
    }
    const email = verified.enrollment.email
    if (!email) {
      return NextResponse.json({ ok: false, error: 'No email on file for this family.' }, { status: 400 })
    }

    const admin = await createAdminClient()

    const { data: existing } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 })
    const user = existing?.users?.find((u) => u.email?.toLowerCase() === email.toLowerCase())

    if (user) {
      const { error: updErr } = await admin.auth.admin.updateUserById(user.id, { password })
      if (updErr) {
        console.error('recover update error:', updErr.message)
        return NextResponse.json({ ok: false, error: 'Could not reset the password.' }, { status: 500 })
      }
      return NextResponse.json({ ok: true, email, created: false })
    }

    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { family: true, source: 'portal-account-recovery' },
    })
    if (createErr) {
      console.error('recover create error:', createErr.message)
      return NextResponse.json({ ok: false, error: 'Could not recover the account.' }, { status: 500 })
    }
    return NextResponse.json({ ok: true, email, created: true })
  } catch (e) {
    console.error('recover POST error:', e)
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 })
  }
}
