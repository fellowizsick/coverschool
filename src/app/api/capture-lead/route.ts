import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

// 🛡️ Simple in-memory rate limit: max 5 captures per IP per hour (lead capture
// is a light endpoint; 5/hr stops casual spam without hurting real parents).
const rateBuckets = new Map<string, number[]>()
const RATE_LIMIT = 5
const RATE_WINDOW_MS = 60 * 60 * 1000

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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email = String(body?.email || '').trim().toLowerCase()
    const stateCode = String(body?.stateCode || 'AL').trim().toUpperCase().slice(0, 2)
    const source = String(body?.source || 'homeschool-law').trim().slice(0, 60)

    // Validate
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ ok: false, error: 'Please enter a valid email address.' }, { status: 400 })
    }
    const VALID_STATES = ['AL', 'FL', 'GA', 'IN', 'MS', 'MO', 'OK', 'SC', 'TX']
    if (!VALID_STATES.includes(stateCode)) {
      return NextResponse.json({ ok: false, error: 'Unknown state.' }, { status: 400 })
    }

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      'unknown'
    if (rateLimited(ip)) {
      return NextResponse.json(
        { ok: false, error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const supabase = await createAdminClient()
    const { data, error } = await supabase
      .from('lead_captures')
      .upsert(
        { email, state_code: stateCode, source },
        { onConflict: 'email,state_code,source', ignoreDuplicates: false }
      )
      .select('id')
      .single()

    if (error) {
      console.error('capture-lead insert error:', error.message)
      return NextResponse.json({ ok: false, error: 'Could not save. Please try again.' }, { status: 500 })
    }

    return NextResponse.json({ ok: true, id: data?.id })
  } catch (e) {
    console.error('capture-lead error:', e)
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 })
  }
}
