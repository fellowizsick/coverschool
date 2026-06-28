import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Users, FileText, GraduationCap, Activity } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user!.id)
    .single()

  const isAdmin = profile?.role === 'admin'

  if (!isAdmin) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-emerald-600" />
              Your Enrollment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              View your student records and manage your account.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Admin stats
  const { count: pendingCount } = await supabase
    .from('enrollments')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')

  const { count: totalEnrollments } = await supabase
    .from('enrollments')
    .select('*', { count: 'exact', head: true })

  const { count: activeStudents } = await supabase
    .from('students')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')

  const { count: pendingPayments } = await supabase
    .from('enrollments')
    .select('*', { count: 'exact', head: true })
    .eq('payment_status', 'pending')

  const stats = [
    {
      label: 'Pending Enrollments',
      value: pendingCount ?? 0,
      icon: FileText,
      color: 'text-amber-600 bg-amber-100',
    },
    {
      label: 'Total Enrollments',
      value: totalEnrollments ?? 0,
      icon: Users,
      color: 'text-blue-600 bg-blue-100',
    },
    {
      label: 'Active Students',
      value: activeStudents ?? 0,
      icon: GraduationCap,
      color: 'text-emerald-600 bg-emerald-100',
    },
    {
      label: 'Pending Payments',
      value: pendingPayments ?? 0,
      icon: Activity,
      color: 'text-rose-600 bg-rose-100',
    },
  ]

  return (
    <div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`rounded-lg p-3 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent enrollments */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Recent Enrollments</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentEnrollmentsTable supabase={supabase} />
        </CardContent>
      </Card>
    </div>
  )
}

async function RecentEnrollmentsTable({ supabase }: { supabase: Awaited<ReturnType<typeof createClient>> }) {
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  if (!enrollments || enrollments.length === 0) {
    return <p className="text-sm text-gray-500">No enrollments yet.</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-gray-500">
            <th className="pb-2 pr-4 font-medium">Student</th>
            <th className="pb-2 pr-4 font-medium">Parent</th>
            <th className="pb-2 pr-4 font-medium">State</th>
            <th className="pb-2 pr-4 font-medium">Status</th>
            <th className="pb-2 font-medium">Date</th>
          </tr>
        </thead>
        <tbody>
          {enrollments.map((e) => (
            <tr key={e.id} className="border-b last:border-0">
              <td className="py-2 pr-4 font-medium text-gray-900">
                {e.student_first_name} {e.student_last_name}
              </td>
              <td className="py-2 pr-4 text-gray-600">
                {e.parent_first_name} {e.parent_last_name}
              </td>
              <td className="py-2 pr-4 text-gray-600">{e.state}</td>
              <td className="py-2 pr-4">
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                    e.status === 'approved'
                      ? 'bg-emerald-100 text-emerald-700'
                      : e.status === 'rejected'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {e.status}
                </span>
              </td>
              <td className="py-2 text-gray-500">
                {new Date(e.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
