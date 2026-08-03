// @ts-nocheck
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

/**
 * GET /api/family-children?enrollmentId=xxx
 * Returns every child in the same family group as the given enrollment
 * (used by the enroll success page to show one church-form link per child).
 * Only exposes ids + names — no sensitive data.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const enrollmentId = searchParams.get('enrollmentId')

    if (!enrollmentId) {
      return NextResponse.json({ error: 'Missing enrollmentId' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const { data: enrollment, error: enrollErr } = await supabase
      .from('enrollments')
      .select('id, family_group_id, student_first_name, student_last_name, student_grade')
      .eq('id', enrollmentId)
      .maybeSingle()

    if (enrollErr || !enrollment) {
      return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 })
    }

    let children = [enrollment]
    if (enrollment.family_group_id) {
      const { data: siblings, error: sibErr } = await supabase
        .from('enrollments')
        .select('id, family_group_id, student_first_name, student_last_name, student_grade')
        .eq('family_group_id', enrollment.family_group_id)
        .order('created_at', { ascending: true })
      if (!sibErr && siblings && siblings.length > 0) {
        children = siblings
      }
    }

    return NextResponse.json({
      children: children.map((c) => ({
        id: c.id,
        name: `${c.student_first_name} ${c.student_last_name}`.trim(),
        grade: c.student_grade,
      })),
    })
  } catch (err) {
    console.error('Family children lookup error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
