import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const { firstName, lastName, pin } = await request.json()

    if (!firstName || !lastName || !pin) {
      return NextResponse.json(
        { error: 'Name and PIN are required' },
        { status: 400 }
      )
    }

    if (!/^\d{4}$/.test(pin)) {
      return NextResponse.json(
        { error: 'PIN must be 4 digits' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    const { data: enrollments, error } = await supabase
      .from('enrollments')
      .select('id, student_first_name, student_grade, status')
      .ilike('student_first_name', firstName)
      .ilike('student_last_name', lastName)
      .eq('ssn_last_four', pin)
      .eq('status', 'approved')

    if (error) {
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    if (!enrollments || enrollments.length === 0) {
      return NextResponse.json(
        { error: 'No student found. Check your name and PIN.' },
        { status: 404 }
      )
    }

    // If multiple matches (same name siblings), pick latest enrollment
    const enrollment = enrollments.sort(
      (a: any, b: any) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
    )[0]

    return NextResponse.json({
      enrollmentId: enrollment.id,
      name: enrollment.student_first_name,
      grade: enrollment.student_grade,
    })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
