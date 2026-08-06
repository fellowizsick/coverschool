import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { isRespectfulReview, safeDisplayName, safeRole } from '@/lib/reviewFilter'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const RATE_WINDOW_MS = 60 * 60 * 1000
const RATE_LIMIT = 3
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

// GET — public: approved reviews for the homepage rotation
export async function GET() {
  try {
    const admin = await createAdminClient()
    const { data, error } = await admin
      .from('reviews')
      .select('id, author_name, quote, role, rating, created_at')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(20)
    if (error) {
      return NextResponse.json({ ok: false, error: 'Could not load reviews.' }, { status: 500 })
    }
    return NextResponse.json({ ok: true, reviews: data || [] })
  } catch (e) {
    console.error('reviews GET error:', e)
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 })
  }
}

// POST — signed-in enrolled family leaves a review. Server-gated:
// only a logged-in user with an APPROVED enrollment can post.
export async function POST(request: Request) {
  try {
    // 1. Rate limit
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    if (rateLimited(ip)) {
      return NextResponse.json(
        { ok: false, error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    // 2. Must be signed in
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user?.email || !EMAIL_RE.test(user.email)) {
      return NextResponse.json({ ok: false, error: 'Please sign in to leave a review.' }, { status: 401 })
    }

    // 3. Must have an APPROVED enrollment under their email
    const { data: enrollments, error: enrollErr } = await supabase
      .from('enrollments')
      .select('id, student_first_name, student_last_name, status')
      .eq('email', user.email)
    if (enrollErr || !enrollments?.length) {
      return NextResponse.json({ ok: false, error: 'Only enrolled LCA families can leave a review.' }, { status: 403 })
    }
    const approved = enrollments.filter((e) => e.status === 'approved')
    if (!approved.length) {
      return NextResponse.json({ ok: false, error: 'Your enrollment is not active yet.' }, { status: 403 })
    }

    // 4. Parse + validate input
    const body = await request.json()
    const quote = String(body?.quote || '').trim()
    const rawName = String(body?.name || '').trim().slice(0, 60)
    const rawState = String(body?.state || '').trim().slice(0, 30)
    const rating = Math.min(5, Math.max(1, parseInt(body?.rating, 10) || 5))

    if (quote.length < 20) {
      return NextResponse.json({ ok: false, error: 'Please write a short review (at least 20 characters).' }, { status: 400 })
    }
    if (quote.length > 600) {
      return NextResponse.json({ ok: false, error: 'Please keep the review under 600 characters.' }, { status: 400 })
    }

    // 5. One review per enrollment (dedupe)
    const { data: existing } = await supabase
      .from('reviews')
      .select('id')
      .eq('enrollment_id', approved[0].id)
      .maybeSingle()
    if (existing) {
      return NextResponse.json({ ok: false, error: 'Your family has already left a review. Thank you!' }, { status: 409 })
    }

    // 6. Moderation filter — only good, respectful reviews publish
    const approvedStatus = isRespectfulReview(quote, rating) ? 'approved' : 'held'

    const admin = await createAdminClient()
    const { data, error } = await admin
      .from('reviews')
      .insert({
        author_name: safeDisplayName(rawName),
        quote,
        role: safeRole(rawState),
        rating,
        enrollment_id: approved[0].id,
        email: user.email,
        status: approvedStatus,
      })
      .select('id, status')
      .single()

    if (error) {
      console.error('reviews POST insert error:', error.message)
      return NextResponse.json({ ok: false, error: 'Could not save your review.' }, { status: 500 })
    }

    if (approvedStatus === 'approved') {
      return NextResponse.json({ ok: true, published: true, id: data.id, message: 'Thank you! Your review is live.' })
    }
    return NextResponse.json({
      ok: true,
      published: false,
      id: data.id,
      message: 'Thank you for your feedback! Our team will review it before publishing.',
    })
  } catch (e) {
    console.error('reviews POST error:', e)
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 })
  }
}
