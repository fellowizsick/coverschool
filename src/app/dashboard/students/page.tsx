import { createClient } from '@/lib/supabase/server'
import { isAuthorizedAdmin } from '@/lib/adminAccess'
import { redirect } from 'next/navigation'
import AdminStudentsPage from './AdminStudentsPage'
import StudentPodcastCodes from '@/components/StudentPodcastCodes'

export default async function StudentsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !isAuthorizedAdmin(user.email)) {
    redirect('/')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user!.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/dashboard')
  }

  // ✅ CHANGE 2026-09-11 (Jonathan directive): show EVERY enrollment, paid or not.
  //
  // This page previously filtered to PAID_STATUSES so only paying students appeared on the
  // roster. Jonathan: "fix the non-paid enrollments problem to where they show up on her
  // dashboard as well, the non-paid people." Mom needs one place that lists every student,
  // including applicants who have not paid yet, with the payment state visible per row
  // (the green/red pill still flips them to paid in one click).
  //
  // Paid vs unpaid is now a FILTER on the page, not a hard exclusion, so she can narrow to
  // either group without losing sight of the rest.
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('*')
    .order('created_at', { ascending: false })

  // Also fetch curriculum progress for all students
  const { data: progressRows } = await supabase
    .from('curriculum_progress')
    .select('*')

  // 📋 Church enrollment forms — one per student (latest), so Mom can view/print
  // each student's form right from the Students list (user directive 2026-08-16).
  const { data: churchForms } = await supabase
    .from('church_enrollment_forms')
    .select('*')
    .order('created_at', { ascending: false })

  // `churchForms` is `any[] | null`, so `(typeof churchForms)[number]` is not indexable —
  // NonNullable unwraps the null first. Pre-existing type error, fixed while here.
  const churchByEnrollment: Record<string, NonNullable<typeof churchForms>[number]> = {}
  churchForms?.forEach((f) => {
    if (f.enrollment_id && !churchByEnrollment[f.enrollment_id]) {
      churchByEnrollment[f.enrollment_id] = f
    }
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">👩‍🏫 All Students</h1>
          <p className="text-sm text-gray-500 mt-1">
            Every enrollment at Larose Christian Academy — including families who have not
            paid yet. Use the filters to narrow the list, or click <strong>Edit</strong> on a
            row to change a student&apos;s details.
          </p>
        </div>
        <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full">
          Admin Access Only
        </span>
      </div>
      <AdminStudentsPage
        enrollments={enrollments || []}
        churchFormsByEnrollment={churchByEnrollment}
      />
      <StudentPodcastCodes />
    </div>
  )
}
