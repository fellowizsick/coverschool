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

export async function POST(request: Request) {
  try {
    const body = await request.json()

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

    const supabase = createAdminClient()

    // Validate referral code if provided (must be an existing, non-self code)
    let normalizedReferral: string | null = null
    if (referred_by_code && referred_by_code.trim()) {
      const code = referred_by_code.trim().toUpperCase()
      const { data: referrer, error: refErr } = await supabase
        .from('enrollments')
        .select('id, email')
        .eq('referral_code', code)
        .single()

      if (refErr || !referrer) {
        return NextResponse.json(
          { error: 'That referral code is not valid. Please check it and try again, or leave it blank.' },
          { status: 400 }
        )
      }
      if (referrer.email.toLowerCase() === email.toLowerCase()) {
        return NextResponse.json(
          { error: 'You cannot use your own referral code.' },
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
