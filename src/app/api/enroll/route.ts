import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

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
      !previous_school ||
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
