import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DiplomaManagementPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirect=/dashboard/diplomas')

  const { data: exams } = await supabase
    .from('diploma_exams')
    .select('*')
    .order('created_at', { ascending: false })

  function statusBadge(e: any) {
    if (e.passed) return <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Passed</span>
    if (e.status === 'created') return <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>
    return <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{e.status}</span>
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Diploma Exam Management</h1>
      {(!exams || exams.length === 0) ? (
        <p className="text-gray-500">No diploma exam records yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="p-3">Student</th>
                <th className="p-3">Email</th>
                <th className="p-3">Status</th>
                <th className="p-3">Score</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {exams.map((e: any) => (
                <tr key={e.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{e.student_name}</td>
                  <td className="p-3">{e.parent_email}</td>
                  <td className="p-3">{statusBadge(e)}</td>
                  <td className="p-3">{e.score != null ? e.score : '-'}</td>
                  <td className="p-3">{new Date(e.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
