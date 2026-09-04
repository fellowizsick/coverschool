import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { isAuthorizedAdmin } from '@/lib/adminAccess'
import { syncTransferGradesToCredits } from '@/lib/graduation'

/**
 * Parent previous-school (transfer) grades.
 * GET  ?enrollmentId=xxx — the owning parent's grades for one student
 * POST { enrollmentId, grades } — save grades; AUTO-PULLS passing grades into
 *      the graduation credit ledger (pending, school verifies/edits).
 *
 * Auth: the signed-in parent may only touch THEIR OWN children's grades
 * (email must match the enrollment), or an authorized admin. This closes a
 * prior hole where the POST route had NO auth check at all.
 */
async function requireOwner(request: Request, enrollmentId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !user.email) return { ok: false as const, reason: 'unauthorized', status: 401 }
  const admin = createAdminClient()
  const { data: enroll } = await admin.from('enrollments').select('email').eq('id', enrollmentId).single()
  if (!enroll) return { ok: false as const, reason: 'not found', status: 404 }
  const isAdmin = isAuthorizedAdmin(user.email)
  const owns = String(enroll.email || '').toLowerCase().trim() === String(user.email).toLowerCase().trim()
  if (!isAdmin && !owns) return { ok: false as const, reason: 'You may only manage your own children.', status: 403 }
  return { ok: true as const, email: user.email }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const enrollmentId = searchParams.get('enrollmentId')
  if (!enrollmentId) return NextResponse.json({ error: 'Missing enrollmentId' }, { status: 400 })

  const auth = await requireOwner(request, enrollmentId)
  if (!auth.ok) return NextResponse.json({ error: auth.reason }, { status: auth.status })

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

export async function POST(request: Request) {
  try {
    const { enrollmentId, grades } = await request.json()
    if (!enrollmentId || !grades) {
      return NextResponse.json({ error: 'Missing enrollmentId or grades' }, { status: 400 })
    }

    const auth = await requireOwner(request, enrollmentId)
    if (!auth.ok) return NextResponse.json({ error: auth.reason }, { status: auth.status })

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
    const incomingIds = grades.filter((g: any) => g.id).map((g: any) => g.id)
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
    const newGrades = grades.filter((g: any) => !g.id)
    if (newGrades.length > 0) {
      const inserts = newGrades.map((g: any) => ({
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

    // 🎓 Auto-pull passing transfer grades into the graduation credit ledger
    // (pending — the school verifies/edits). Idempotent, respects school edits.
    await syncTransferGradesToCredits(enrollmentId)

    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
