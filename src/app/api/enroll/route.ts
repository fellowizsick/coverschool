import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

// Generate a short, unique, human-friendly referral code like LCA-K7X2Q
function generateReferralCode() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // no 0/O/1/I
  let code = ''
  for (let i = 0; i < 5; i++) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)]
  }
  return `LCA-${code}`
}

// 🛡️ Simple in-memory rate limit: max 10 enrollment submissions per IP per hour.
// (Vercel serverless is per-instance, so this is a soft limiter — enough to stop
// casual spam; a hard global limit would need a DB-backed counter.)
const rateBuckets = new Map<string, number[]>()
const RATE_LIMIT = 10
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

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // 🛡️ Rate limit by IP
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      'unknown'
    if (rateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many enrollment attempts. Please try again later.' },
        { status: 429 }
      )
    }

    const {
      parent_first_name,
      parent_last_name,
      email,
      phone,
      address_line1,
      address_line2,
      city,
      state,
      zip,
      student_first_name,
      student_last_name,
      student_grade,
      student_dob,
      previous_school,
      ssn_last_four,
      notes,
      referred_by_code,
      agree_to_terms,
    } = body

    // Basic validation
    if (
      !parent_first_name ||
      !parent_last_name ||
      !email ||
      !phone ||
      !address_line1 ||
      !city ||
      !state ||
      !zip ||
      !student_first_name ||
      !student_last_name ||
      !student_grade ||
      !student_dob ||
      !ssn_last_four
    ) {
      return NextResponse.json(
        { error: 'All required fields must be filled' },
        { status: 400 }
      )
    }

    // Validate SSN last 4 format
    if (!/^\d{4}$/.test(ssn_last_four)) {
      return NextResponse.json(
        { error: 'SSN last 4 must be exactly 4 digits' },
        { status: 400 }
      )
    }

    // 🛡️ Terms agreement must be accepted server-side (legal consent record)
    if (!agree_to_terms) {
      return NextResponse.json(
        { error: 'You must agree to the Terms of Service to enroll.' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Validate referral code if provided (must be an existing, non-self code)
    let normalizedReferral: string | null = null
    if (referred_by_code && referred_by_code.trim()) {
      const code = referred_by_code.trim().toUpperCase()
      const { data: referrer, error: refErr } = await supabase
        .from('enrollments')
        .select('id, email, phone, address_line1, city, state, zip')
        .eq('referral_code', code)
        .single()

      if (refErr || !referrer) {
        return NextResponse.json(
          { error: 'That referral code is not valid. Please check it and try again, or leave it blank.' },
          { status: 400 }
        )
      }
      // 🛡️ ANTI-EXPLOIT: block self-referral by email, phone, or address match.
      // Prevents one person enrolling multiple fake students with different emails
      // to farm referral credits.
      const sameEmail =
        referrer.email.toLowerCase() === (email || '').toLowerCase()
      const samePhone =
        referrer.phone &&
        (phone || '').replace(/\D/g, '') === referrer.phone.replace(/\D/g, '') &&
        (phone || '').replace(/\D/g, '').length >= 10
      const sameAddress =
        referrer.address_line1 &&
        referrer.address_line1.trim().toLowerCase() ===
          (address_line1 || '').trim().toLowerCase() &&
        referrer.city?.trim().toLowerCase() === (city || '').trim().toLowerCase()

      if (sameEmail || samePhone || sameAddress) {
        return NextResponse.json(
          { error: 'You cannot use a referral code from your own household.' },
          { status: 400 }
        )
      }
      normalizedReferral = code
    }

    // Generate a unique referral code for this new enrollment (retry on collision)
    let referralCode = generateReferralCode()
    let collision = true
    while (collision) {
      const { data: existing } = await supabase
        .from('enrollments')
        .select('id')
        .eq('referral_code', referralCode)
        .maybeSingle()
      if (existing) {
        referralCode = generateReferralCode()
      } else {
        collision = false
      }
    }

    const { data, error } = await supabase
      .from('enrollments')
      .insert({
        parent_first_name,
        parent_last_name,
        email,
        phone,
        address_line1,
        address_line2: address_line2 || '',
        city,
        state,
        zip,
        student_first_name,
        student_last_name,
        student_grade,
        student_dob,
        previous_school,
        ssn_last_four,
        notes: notes || '',
        status: 'pending',
        payment_status: 'pending',
        referral_code: referralCode,
        referred_by_code: normalizedReferral,
        terms_accepted_at: new Date().toISOString(),
        terms_ip: ip,
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to submit enrollment. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Enrollment submitted successfully', id: data.id },
      { status: 201 }
    )
  } catch (err) {
    console.error('Server error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
