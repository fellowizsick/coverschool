// @ts-nocheck
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { enrollment_id, school_year, public_school_district, student_name, student_dob,
      grade, parent_name, home_phone, address, city, state, zip, form_date,
      parent_signature, parent_signature_date, consent_date, consent_signature } = body

    if (!enrollment_id || !student_name || !student_dob || !grade || !parent_name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('church_enrollment_forms')
      .insert({
        enrollment_id, school_year, public_school_district, student_name,
        student_dob, grade, parent_name, home_phone, address, city, state, zip,
        form_date, parent_signature, parent_signature_date, consent_date,
        consent_signature, status: 'submitted'
      })
      .select()
      .single()

    if (error) {
      console.error('Church form save error:', error)
      return NextResponse.json({ error: 'Failed to save form' }, { status: 500 })
    }

    // Mark enrollment as having church form
    await supabase
      .from('enrollments')
      .update({ church_form_status: 'submitted' })
      .eq('id', enrollment_id)

    return NextResponse.json({ message: 'Form submitted', id: data.id }, { status: 201 })
  } catch (err) {
    console.error('Church form error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const enrollment_id = searchParams.get('enrollment_id')

  const supabase = createAdminClient()
  let query = supabase.from('church_enrollment_forms').select('*')

  if (id) query = query.eq('id', id)
  else if (enrollment_id) query = query.eq('enrollment_id', enrollment_id)
  else return NextResponse.json({ error: 'Specify id or enrollment_id' }, { status: 400 })

  const { data, error } = await query.single()
  if (error) return NextResponse.json({ error: 'Form not found' }, { status: 404 })
  return NextResponse.json(data)
}
