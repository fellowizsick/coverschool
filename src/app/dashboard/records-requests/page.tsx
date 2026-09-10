import { createClient, createAdminClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { isAuthorizedAdmin } from '@/lib/adminAccess'
import RecordsRequestsView, { type RecordRequest, type StudentOption } from '@/components/RecordsRequestsView'

export const dynamic = 'force-dynamic'

// 📄 STUDENT RECORDS REQUESTS — records in and out, each tied to the right child.
// 🔒 Admin only (Mom + owner). `record_requests` has RLS enabled with ZERO policies,
// so this page (running server-side as service_role) is the ONLY way to read it.
export default async function RecordsRequestsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirect=/dashboard/records-requests')
  if (!isAuthorizedAdmin(user.email)) redirect('/')

  const admin = createAdminClient()

  const { data: requests } = await admin
    .from('record_requests')
    .select('*')
    .order('created_at', { ascending: false })

  const { data: students } = await admin
    .from('enrollments')
    .select('id, student_first_name, student_last_name, student_grade, student_dob, email')
    .order('student_last_name', { ascending: true })

  return (
    <RecordsRequestsView
      initialRequests={(requests as RecordRequest[]) ?? []}
      students={(students as StudentOption[]) ?? []}
    />
  )
}
