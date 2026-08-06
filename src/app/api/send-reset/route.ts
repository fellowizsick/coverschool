import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { sendPasswordResetEmail } from '@/lib/email'

const RATE_WINDOW_MS = 60 * 60 * 1000
const RATE_LIMIT = 3 // 3 reset emails per hour per IP
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

function emailOk(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/**
 * POST /api/send-reset
 * Email-gated password reset: family enters the email they enrolled with.
 * We generate a recovery link (valid ~1h), email it to THAT address, and the
 * link lands on /auth/callback which verifies the OTP and routes them to the
 * password change page. The email IS the proof of identity — no one can change
 * a password without access to the enrolled email.
 */
export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    if (rateLimited(ip)) {
      return NextResponse.json({ ok: false, error: 'Too many requests. Please wait an hour.' }, { status: 429 })
    }

    const body = await request.json()
    const email = String(body.email || '').trim().toLowerCase()
    if (!emailOk(email)) {
      return NextResponse.json({ ok: false, error: 'Please enter a valid email address.' }, { status: 400 })
    }

    const admin = await createAdminClient()

    // Find the enrollment for this email — we only send to enrolled families
    const { data: enrollments } = await admin
      .from('enrollments')
      .select('id, email, parent_first_name, parent_last_name, status')
      .eq('email', email)
      .limit(5)

    const enrollment = (enrollments || []).find((e) => e.status === 'approved' || e.status === 'pending')
    const parentName = enrollment?.parent_first_name
      ? `${enrollment.parent_first_name}${enrollment.parent_last_name ? ' ' + enrollment.parent_last_name : ''}`
      : 'there'

    // Do we have an auth user for this email?
    const { data: existing } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 })
    const user = existing?.users?.find((u) => u.email?.toLowerCase() === email)

    if (!enrollment && !user) {
      // Never confirm whether an email is enrolled — generic reply
      return NextResponse.json({ ok: true, sent: false })
    }

    if (!user) {
      // Family is enrolled but has no portal account yet. Create one with a
      // random password, then the recovery link lets them set their real one.
      const random = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2) + 'Aa1!'
      const { data: created, error: createErr } = await admin.auth.admin.createUser({
        email,
        password: random,
        email_confirm: true,
        user_metadata: { family: true, source: 'send-reset' },
      })
      if (createErr) {
        console.error('send-reset create user error:', createErr.message)
        return NextResponse.json({ ok: false, error: 'Could not prepare the account.' }, { status: 500 })
      }
    }

    // Generate a recovery link. We use the 6-digit email OTP as the secret in
    // OUR link: the action_link token only works on Supabase's hosted page
    // (whose redirect_to falls back to an unconfigured localhost), while the
    // OTP verifies directly through the public verify endpoint. The link goes
    // straight to our /auth/callback, which exchanges the OTP for a session
    // and routes the family to the password change page.
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://laroseca.org'
    const callbackUrl = `${siteUrl}/auth/callback?type=recovery&email=${encodeURIComponent(email)}`
    const { data: linkData, error: linkErr } = await admin.auth.admin.generateLink({
      type: 'recovery',
      email,
      options: { redirectTo: callbackUrl },
    })
    if (linkErr || !linkData) {
      console.error('send-reset generate link error:', linkErr?.message)
      return NextResponse.json({ ok: false, error: 'Could not create the reset link.' }, { status: 500 })
    }

    // supabase-js nests these under properties; the raw API has them top-level
    const props = linkData.properties as Record<string, unknown> | undefined
    const otp = String(props?.email_otp || (linkData as unknown as Record<string, unknown>).email_otp || '')
    if (!otp) {
      console.error('send-reset: no OTP in link data', JSON.stringify(linkData).slice(0, 300))
      return NextResponse.json({ ok: false, error: 'Could not build the reset link.' }, { status: 500 })
    }

    const link = `${callbackUrl}&token=${encodeURIComponent(otp)}`

    // Email the link to the enrolled address
    try {
      await sendPasswordResetEmail({ to: email, parentName, link })
    } catch (e) {
      console.error('send-reset email error:', e)
      return NextResponse.json({ ok: false, error: 'Could not send the email.' }, { status: 500 })
    }

    return NextResponse.json({ ok: true, sent: true })
  } catch (e) {
    console.error('send-reset error:', e)
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 })
  }
}
