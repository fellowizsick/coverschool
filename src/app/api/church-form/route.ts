// @ts-nocheck
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      school_year, public_school_district, student_name, student_dob,
      grade, parent_name, parent_email, home_phone, address, city, state, zip,
      form_date, parent_signature, parent_signature_date,
      consent_date, consent_signature, enrollment_id
    } = body

    if (!student_name || !parent_name) {
      return NextResponse.json({ error: 'Student name and parent name are required' }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('church_enrollment_forms')
      .insert({
        enrollment_id: enrollment_id || null,
        school_year, public_school_district, student_name,
        student_dob, grade, parent_name, parent_email,
        home_phone, address, city, state, zip,
        form_date, parent_signature, parent_signature_date,
        consent_date, consent_signature,
        church_form_status: 'submitted'
      })
      .select()
      .single()

    if (error) {
      console.error('Church form save error:', error)
      return NextResponse.json({ error: 'Failed to save form' }, { status: 500 })
    }

    // If linked to an enrollment, mark it
    if (enrollment_id) {
      await supabase
        .from('enrollments')
        .update({ church_form_status: 'submitted' })
        .eq('id', enrollment_id)
    }

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
  const parent_email = searchParams.get('parent_email')

  const supabase = createAdminClient()
  let query = supabase.from('church_enrollment_forms').select('*').order('created_at', { ascending: false })

  if (id) query = query.eq('id', id)
  else if (enrollment_id) query = query.eq('enrollment_id', enrollment_id)
  else if (parent_email) query = query.eq('parent_email', parent_email)
  else return NextResponse.json({ error: 'Specify id, enrollment_id, or parent_email' }, { status: 400 })

  if (id || enrollment_id) {
    const { data, error } = await query.single()
    if (error) return NextResponse.json({ error: 'Form not found' }, { status: 404 })
    return NextResponse.json(data)
  }

  // Return array for parent_email
  const { data, error } = await query
  if (error) return NextResponse.json({ error: 'Forms not found' }, { status: 404 })
  return NextResponse.json(data)
}
