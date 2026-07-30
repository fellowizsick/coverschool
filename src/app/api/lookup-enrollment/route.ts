// @ts-nocheck
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

/**
 * POST /api/lookup-enrollment
 * Looks up an active enrollment by email.
 * Returns minimal info: student name, email, enrollment ID.
 */
export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const admin = createAdminClient()
    const { data: enrollments, error } = await admin
      .from('enrollments')
      .select('id, student_first_name, student_last_name, email, status')
      .eq('email', email.toLowerCase().trim())
      .in('status', ['approved', 'pending'])
      .order('created_at', { ascending: false })
      .limit(1)

    if (error) {
      console.error('Lookup enrollment error:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    if (!enrollments || enrollments.length === 0) {
      return NextResponse.json(
        { error: 'No active enrollment found with this email address.' },
        { status: 404 }
      )
    }

    const enrollment = enrollments[0]
    return NextResponse.json({
      id: enrollment.id,
      student_first_name: enrollment.student_first_name,
      student_last_name: enrollment.student_last_name,
      email: enrollment.email,
      status: enrollment.status,
    })
  } catch (err) {
    console.error('Lookup enrollment error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
