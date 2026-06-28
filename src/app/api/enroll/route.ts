import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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
      !student_dob
    ) {
      return NextResponse.json(
        { error: 'All required fields must be filled' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

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
        previous_school: previous_school || '',
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
