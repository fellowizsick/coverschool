// @ts-nocheck
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

/**
 * GET /api/enrollments?email=xxx
 * Returns the enrollments for a parent email (most recent first).
 * Used by the enroll form pre-fill (returning parent) and the student-id page.
 * Only exposes fields safe for the requesting parent: no SSN, no Stripe IDs.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    if (!email) {
      return NextResponse.json({ error: 'Missing email' }, { status: 400 })
    }

    const admin = createAdminClient()
    const { data, error } = await admin
      .from('enrollments')
      .select(
        'id, parent_first_name, parent_last_name, email, phone, address_line1, city, state, zip, student_first_name, student_last_name, student_grade, status, created_at'
      )
      .eq('email', email.toLowerCase())
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Enrollments lookup error:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    return NextResponse.json({ enrollments: data || [] })
  } catch (err) {
    console.error('Enrollments lookup error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
