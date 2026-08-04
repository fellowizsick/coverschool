import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { randomUUID } from 'crypto'

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

type StudentInput = {
  student_first_name: string
  student_last_name: string
  student_grade: string
  student_dob: string
  ssn_last_four: string
  previous_school?: string
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
      students,
      // Legacy single-student fields (backward compatible)
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

    // Build the student list: new multi-child `students` array, or fall back to
    // the legacy single-student shape so old clients keep working.
    let studentList: StudentInput[] = []
    if (Array.isArray(students) && students.length > 0) {
      studentList = students.map((s: Record<string, unknown>) => ({
        student_first_name: String(s.student_first_name || ''),
        student_last_name: String(s.student_last_name || ''),
        student_grade: String(s.student_grade || ''),
        student_dob: String(s.student_dob || ''),
        ssn_last_four: String(s.ssn_last_four || ''),
        previous_school: s.previous_school ? String(s.previous_school) : '',
      }))
    } else {
      studentList = [
        {
          student_first_name: student_first_name || '',
          student_last_name: student_last_name || '',
          student_grade: student_grade || '',
          student_dob: student_dob || '',
          ssn_last_four: ssn_last_four || '',
          previous_school: previous_school || '',
        },
      ]
    }

    // Basic validation — parent info + EVERY student
    if (
      !parent_first_name ||
      !parent_last_name ||
      !email ||
      !phone ||
      !address_line1 ||
      !city ||
      !state ||
      !zip
    ) {
      return NextResponse.json(
        { error: 'All required fields must be filled' },
        { status: 400 }
      )
    }

    for (const s of studentList) {
      if (
        !s.student_first_name ||
        !s.student_last_name ||
        !s.student_grade ||
        !s.student_dob ||
        !s.ssn_last_four
      ) {
        return NextResponse.json(
          { error: 'Please fill in every student’s required fields' },
          { status: 400 }
        )
      }
      // Validate SSN last 4 format for each student
      if (!/^\d{4}$/.test(s.ssn_last_four)) {
        return NextResponse.json(
          { error: 'Each student’s SSN last 4 must be exactly 4 digits' },
          { status: 400 }
        )
      }
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

    // Generate a unique referral code for this family (one per submission —
    // siblings share the family link). Retry on collision.
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

    // One family_group_id links every child in this submission together.
    // 👨‍👩‍👧‍👦 RETURNING PARENT: if this email already has enrollments, reuse the
    // most recent family_group_id so the NEW children join the SAME family as
    // their siblings. This keeps billing (one subscription per family), the
    // remove-child logic, and referral handling consistent across re-enrolls.
    let familyGroupId = randomUUID()
    const { data: existingFamily } = await supabase
      .from('enrollments')
      .select('family_group_id')
      .eq('email', email.toLowerCase())
      .not('family_group_id', 'is', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    if (existingFamily?.family_group_id) {
      familyGroupId = existingFamily.family_group_id
    }

    const nowIso = new Date().toISOString()
    // ⚠️ referral_code has a UNIQUE constraint — only the PRIMARY row carries it.
    // Siblings get null (one referral code per family; no duplicate-key collision).
    // Note: for a RETURNING parent the primary row here still gets its own fresh
    // referral code — that's correct: each new child submission is a new referral
    // opportunity, but they share the family group for billing/records.
    const rows = studentList.map((s, idx) => ({
      parent_first_name,
      parent_last_name,
      email,
      phone,
      address_line1,
      address_line2: address_line2 || '',
      city,
      state,
      zip,
      student_first_name: s.student_first_name,
      student_last_name: s.student_last_name,
      student_grade: s.student_grade,
      student_dob: s.student_dob,
      previous_school: s.previous_school || '',
      ssn_last_four: s.ssn_last_four,
      notes: notes || '',
      status: 'pending',
      payment_status: 'pending',
      // One referral code + one referred_by_code live on the PRIMARY row only,
      // so a single family pays = exactly one referral credit (no farming).
      referral_code: idx === 0 ? referralCode : null,
      referred_by_code: idx === 0 ? normalizedReferral : null,
      family_group_id: familyGroupId,
      terms_accepted_at: nowIso,
      terms_ip: ip,
    }))

    const { data, error } = await supabase
      .from('enrollments')
      .insert(rows)
      .select('id')

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to submit enrollment. Please try again.' },
        { status: 500 }
      )
    }

    const ids = (data || []).map((r) => r.id)
    return NextResponse.json(
      {
        message: 'Enrollment submitted successfully',
        id: ids[0], // primary row = first child
        ids,
        family_group_id: familyGroupId,
      },
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
