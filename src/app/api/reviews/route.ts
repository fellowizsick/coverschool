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

/**
 * Verify the submitter is a REAL enrolled family.
 * Families log in with student name + PIN (last 4 of SSN) — the same proof the
 * student-login endpoint uses. We also accept a Supabase session when present.
 * This makes sure only actual enrolled families can leave a review.
 */
async function verifyEnrolledFamily(body: {
  email?: string
  studentFirstName?: string
  studentLastName?: string
  pin?: string
}): Promise<{ enrollment: { id: string; email: string; student_first_name: string; student_last_name: string } } | { error: string; status: number }> {
  const admin = await createAdminClient()

  // Path 1: signed-in Supabase session (parent portal)
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (user?.email) {
    const { data: byAuth } = await supabase
      .from('enrollments')
      .select('id, email, student_first_name, student_last_name, status')
      .eq('email', user.email)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(1)
    if (byAuth?.[0]) {
      return { enrollment: byAuth[0] }
    }
    return { error: 'Only enrolled LCA families can leave a review.', status: 403 }
  }

  // Path 2: name + PIN proof (same as student login)
  const firstName = String(body?.studentFirstName || '').trim()
  const lastName = String(body?.studentLastName || '').trim()
  const pin = String(body?.pin || '').trim()
  const email = String(body?.email || '').trim().toLowerCase()

  if (!firstName || !lastName || !/^\d{4}$/.test(pin)) {
    return { error: 'Student name and 4-digit PIN are required to verify your enrollment.', status: 400 }
  }
  if (!EMAIL_RE.test(email)) {
    return { error: 'Please enter the email address used to enroll.', status: 400 }
  }

  const { data: matches, error: matchErr } = await admin
    .from('enrollments')
    .select('id, email, student_first_name, student_last_name, status')
    .ilike('student_first_name', firstName)
    .ilike('student_last_name', lastName)
    .eq('ssn_last_four', pin)
    .eq('status', 'approved')
  if (matchErr) {
    return { error: 'Could not verify enrollment.', status: 500 }
  }
  const match = (matches || []).find((m) => String(m.email || '').toLowerCase() === email)
  if (!match) {
    return { error: 'We couldn\'t verify that family. Please use the email address you enrolled with and check the student name + PIN.', status: 403 }
  }
  return { enrollment: match }
}

// POST — a real enrolled family leaves a review
export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    if (rateLimited(ip)) {
      return NextResponse.json(
        { ok: false, error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

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

    // Verify this is a real enrolled family
    const verified = await verifyEnrolledFamily(body)
    if ('error' in verified) {
      return NextResponse.json({ ok: false, error: verified.error }, { status: verified.status })
    }
    const enrollment = verified.enrollment

    // One review per enrollment (dedupe)
    const admin = await createAdminClient()
    const { data: existing } = await admin
      .from('reviews')
      .select('id')
      .eq('enrollment_id', enrollment.id)
      .maybeSingle()
    if (existing) {
      return NextResponse.json({ ok: false, error: 'Your family has already left a review. Thank you!' }, { status: 409 })
    }

    // Moderation filter — only good, respectful reviews publish
    const approvedStatus = isRespectfulReview(quote, rating) ? 'approved' : 'held'

    const { data, error } = await admin
      .from('reviews')
      .insert({
        author_name: safeDisplayName(rawName || `${enrollment.student_first_name} ${enrollment.student_last_name}`),
        quote,
        role: safeRole(rawState),
        rating,
        enrollment_id: enrollment.id,
        email: enrollment.email,
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
