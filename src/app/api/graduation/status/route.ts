import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/server'
import { isAuthorizedAdmin } from '@/lib/adminAccess'

// GET /api/graduation/status?enrollment_id=... | (no param = all students with computed status)
// Admin-only. Returns each student's credit-ledger graduation state.
export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAuthorizedAdmin(user.email)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }

  const url = new URL(request.url)
  const enrollmentId = url.searchParams.get('enrollment_id')
  const admin = createAdminClient()

  if (enrollmentId) {
    const { data: enroll } = await admin
      .from('enrollments')
      .select('*')
      .eq('id', enrollmentId)
      .single()
    if (!enroll) return NextResponse.json({ ok: false, error: 'not found' }, { status: 404 })
    const { data: reqs } = await admin.from('graduation_requirements').select('*').order('display_order')
    const { data: ledger } = await admin.from('student_credits').select('*').eq('enrollment_id', enrollmentId)
    return NextResponse.json({ ok: true, enrollment: enroll, requirements: reqs || [], ledger: ledger || [] })
  }

  // All enrollments + per-student status (for the graduation-ready queue)
  const { data: enrolls } = await admin
    .from('enrollments')
    .select('id, student_first_name, student_last_name, student_grade, email, status, payment_status, graduation_status, graduation_date, created_at, family_group_id')
    .order('created_at', { ascending: false })
  const { data: reqs } = await admin.from('graduation_requirements').select('*').order('display_order')
  const { data: ledgerRows } = await admin.from('student_credits').select('*')

  const activeReqs = (reqs || []).filter((r: any) => r.active)
  const totalRequired = activeReqs.reduce((s: number, r: any) => s + Number(r.required_credits || 0), 0)

  const byEnrollment: Record<string, { subject: string; credits: number }[]> = {}
  for (const row of ledgerRows || []) {
    if (row.verification_status !== 'verified') continue
    if (!byEnrollment[row.enrollment_id]) byEnrollment[row.enrollment_id] = []
    const arr = byEnrollment[row.enrollment_id]
    const ex = arr.find((e) => e.subject === row.subject)
    if (ex) ex.credits += Number(row.credits || 0)
    else arr.push({ subject: row.subject, credits: Number(row.credits || 0) })
  }

  const students = (enrolls || []).map((e: any) => {
    const earnedBySubject = byEnrollment[e.id] || []
    const metAll = activeReqs.length > 0 && activeReqs.every((r: any) =>
      (earnedBySubject.find((x) => x.subject === r.subject)?.credits || 0) >= Number(r.required_credits || 0))
    const earned = earnedBySubject.reduce((s, x) => s + x.credits, 0)
    const status = e.graduation_status || 'in_progress'
    return {
      enrollmentId: e.id,
      student: `${e.student_first_name} ${e.student_last_name}`,
      grade: e.student_grade,
      email: e.email,
      enrollStatus: e.status,
      paymentStatus: e.payment_status,
      graduationStatus: status,
      graduationDate: e.graduation_date,
      earned: Math.round(earned * 100) / 100,
      totalRequired,
      met: metAll && status !== 'graduated',
    }
  })

  const ready = students.filter((s) => s.met)
  const graduated = students.filter((s) => s.graduationStatus === 'graduated')

  return NextResponse.json({
    ok: true,
    totalRequired,
    students,
    ready: ready.length,
    graduated: graduated.length,
  })
}
