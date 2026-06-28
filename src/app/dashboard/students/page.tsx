import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { redirect } from 'next/navigation'

export default async function StudentsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

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
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Active Students</h2>
        <span className="text-sm text-gray-500">
          {enrollments?.length || 0} enrolled
        </span>
      </div>

      <Card className="mt-4">
        <CardContent className="p-0">
          {!enrollments || enrollments.length === 0 ? (
            <p className="p-6 text-sm text-gray-500">
              No approved enrollments yet. Approve enrollments first.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50 text-left text-gray-500">
                    <th className="px-4 py-3 font-medium">Student</th>
                    <th className="px-4 py-3 font-medium">Grade</th>
                    <th className="px-4 py-3 font-medium">Parent</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">State</th>
                    <th className="px-4 py-3 font-medium">Enrolled</th>
                  </tr>
                </thead>
                <tbody>
                  {enrollments.map((e) => (
                    <tr key={e.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {e.student_first_name} {e.student_last_name}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {e.student_grade}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {e.parent_first_name} {e.parent_last_name}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{e.email}</td>
                      <td className="px-4 py-3 text-gray-600">{e.state}</td>
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(e.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
