import { createClient } from '@/lib/supabase/server'
import { isAuthorizedAdmin } from '@/lib/adminAccess'
import { redirect } from 'next/navigation'
import AdminStudentsPage from './AdminStudentsPage'

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

  const churchByEnrollment: Record<string, (typeof churchForms)[number]> = {}
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
            Search, view, and manage every student enrolled at Larose Christian Academy.
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
    </div>
  )
}
