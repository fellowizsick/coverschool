import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import {
  Users,
  CheckCircle2,
  CreditCard,
  AlertCircle,
  Clock,
  Inbox,
} from 'lucide-react'

type Enrollment = {
  id: string
  student_first_name: string
  student_last_name: string
  parent_first_name: string
  parent_last_name: string
  student_grade: string
  state: string
  city: string
  status: string
  payment_status: string
  email: string
  created_at: string
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    approved: 'bg-emerald-100 text-emerald-700',
    pending: 'bg-amber-100 text-amber-700',
    rejected: 'bg-red-100 text-red-700',
  }
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
        map[status] || 'bg-gray-100 text-gray-700'
      }`}
    >
      {status}
    </span>
  )
}

function PaymentBadge({ payment }: { payment: string }) {
  const map: Record<string, string> = {
    paid: 'bg-emerald-100 text-emerald-700',
    unpaid: 'bg-red-100 text-red-700',
    pending: 'bg-amber-100 text-amber-700',
  }
  const label: Record<string, string> = {
    paid: 'PAID',
    unpaid: 'UNPAID',
    pending: 'PENDING',
  }
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
        map[payment] || 'bg-gray-100 text-gray-700'
      }`}
    >
      {label[payment] || payment?.toUpperCase() || 'UNKNOWN'}
    </span>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 py-10 text-center">
      <Inbox className="h-8 w-8 text-gray-300" />
      <p className="mt-2 text-sm text-gray-400">{message}</p>
    </div>
  )
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile, error: profErr } = await supabase
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
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
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

  // Fetch ALL enrollments (admin sees everything)
  const { data: enrollmentsRaw } = await supabase
    .from('enrollments')
    .select('*')
    .order('created_at', { ascending: false })

  const enrollments: Enrollment[] = (enrollmentsRaw as Enrollment[]) ?? []

  const total = enrollments.length
  const active = enrollments.filter((e) => e.status === 'approved').length
  const paid = enrollments.filter((e) => e.payment_status === 'paid').length
  const unpaid = enrollments.filter(
    (e) => e.payment_status === 'unpaid' || e.payment_status === 'pending'
  ).length
  const pendingApproval = enrollments.filter((e) => e.status === 'pending').length

  const stats = [
    {
      label: 'Total Enrollments',
      value: total,
      icon: Users,
      color: 'text-blue-600 bg-blue-100',
    },
    {
      label: 'Active (Approved)',
      value: active,
      icon: CheckCircle2,
      color: 'text-emerald-600 bg-emerald-100',
    },
    {
      label: 'Paid',
      value: paid,
      icon: CreditCard,
      color: 'text-green-600 bg-green-100',
    },
    {
      label: 'Unpaid / Pending',
      value: unpaid,
      icon: AlertCircle,
      color: 'text-rose-600 bg-rose-100',
    },
  ]

  const needsApproval = enrollments.filter((e) => e.status === 'pending')
  const unpaidList = enrollments.filter(
    (e) => e.payment_status === 'unpaid' || e.payment_status === 'pending'
  )

  return (
    <div className="space-y-8">
      {/* STAT CARDS */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`rounded-lg p-3 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ALL ENROLLMENTS */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-gray-600" />
            All Enrollments
          </CardTitle>
        </CardHeader>
        <CardContent>
          {enrollments.length === 0 ? (
            <EmptyState message="No enrollments yet. When a parent enrolls a student, they'll appear in this list below." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-gray-500">
                    <th className="pb-2 pr-4 font-medium">Student</th>
                    <th className="pb-2 pr-4 font-medium">Parent</th>
                    <th className="pb-2 pr-4 font-medium">Grade</th>
                    <th className="pb-2 pr-4 font-medium">Location</th>
                    <th className="pb-2 pr-4 font-medium">Status</th>
                    <th className="pb-2 pr-4 font-medium">Payment</th>
                    <th className="pb-2 font-medium">Enrolled</th>
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
                      <td className="py-2 pr-4 text-gray-600">{e.student_grade}</td>
                      <td className="py-2 pr-4 text-gray-600">
                        {e.city}, {e.state}
                      </td>
                      <td className="py-2 pr-4">
                        <StatusBadge status={e.status} />
                      </td>
                      <td className="py-2 pr-4">
                        <PaymentBadge payment={e.payment_status} />
                      </td>
                      <td className="py-2 text-gray-500">
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

      {/* TWO-COLUMN: NEEDS APPROVAL + UNPAID */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-600" />
              Needs Approval ({pendingApproval})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {needsApproval.length === 0 ? (
              <EmptyState message="Nothing waiting. New enrollments pending your review show up here." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-gray-500">
                      <th className="pb-2 pr-4 font-medium">Student</th>
                      <th className="pb-2 pr-4 font-medium">Parent</th>
                      <th className="pb-2 font-medium">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {needsApproval.map((e) => (
                      <tr key={e.id} className="border-b last:border-0">
                        <td className="py-2 pr-4 font-medium text-gray-900">
                          {e.student_first_name} {e.student_last_name}
                        </td>
                        <td className="py-2 pr-4 text-gray-600">
                          {e.parent_first_name} {e.parent_last_name}
                        </td>
                        <td className="py-2 text-gray-600">{e.student_grade}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-rose-600" />
              Unpaid / Outstanding ({unpaidList.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {unpaidList.length === 0 ? (
              <EmptyState message="All accounts paid up. Unpaid or pending payments appear here." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-gray-500">
                      <th className="pb-2 pr-4 font-medium">Student</th>
                      <th className="pb-2 pr-4 font-medium">Parent</th>
                      <th className="pb-2 font-medium">Payment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {unpaidList.map((e) => (
                      <tr key={e.id} className="border-b last:border-0">
                        <td className="py-2 pr-4 font-medium text-gray-900">
                          {e.student_first_name} {e.student_last_name}
                        </td>
                        <td className="py-2 pr-4 text-gray-600">
                          {e.parent_first_name} {e.parent_last_name}
                        </td>
                        <td className="py-2">
                          <PaymentBadge payment={e.payment_status} />
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
    </div>
  )
}
