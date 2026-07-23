// @ts-nocheck
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

/**
 * GET /api/transfer-grades?enrollmentId=xxx
 * Returns all transfer grades for an enrollment
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const enrollmentId = searchParams.get('enrollmentId')
  
  if (!enrollmentId) {
    return NextResponse.json({ error: 'Missing enrollmentId' }, { status: 400 })
  }

  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('transfer_grades')
      .select('*')
      .eq('enrollment_id', enrollmentId)
      .order('created_at', { ascending: true })

    if (error) throw error
    return NextResponse.json({ grades: data || [] })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

/**
 * POST /api/transfer-grades
 * Body: { enrollmentId, grades: [{ subject_name, grade_earned, year_completed, school_name }] }
 * If grades have an id, they're updated. If no id, inserted. Missing ids are deleted.
 */
export async function POST(request: Request) {
  try {
    const { enrollmentId, grades } = await request.json()
    if (!enrollmentId || !grades) {
      return NextResponse.json({ error: 'Missing enrollmentId or grades' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Get student name from enrollment
    const { data: enrollment } = await supabase
      .from('enrollments')
      .select('student_first_name, student_last_name')
      .eq('id', enrollmentId)
      .single()

    const studentName = enrollment 
      ? `${enrollment.student_first_name} ${enrollment.student_last_name}`
      : 'Unknown'

    // Delete existing grades not in the new set
    const incomingIds = grades.filter(g => g.id).map(g => g.id)
    if (incomingIds.length > 0) {
      await supabase
        .from('transfer_grades')
        .delete()
        .eq('enrollment_id', enrollmentId)
        .not('id', 'in', `(${incomingIds.join(',')})`)
    } else {
      // No incoming IDs = delete all and re-insert
      await supabase
        .from('transfer_grades')
        .delete()
        .eq('enrollment_id', enrollmentId)
    }

    // Insert new grades (ones without id)
    const newGrades = grades.filter(g => !g.id)
    if (newGrades.length > 0) {
      const inserts = newGrades.map(g => ({
        enrollment_id: enrollmentId,
        student_name: studentName,
        subject_name: g.subject_name,
        grade_earned: g.grade_earned,
        year_completed: g.year_completed,
        school_name: g.school_name || '',
      }))
      const { error } = await supabase.from('transfer_grades').insert(inserts)
      if (error) throw error
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
