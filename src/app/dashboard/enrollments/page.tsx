import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { redirect } from 'next/navigation'

export default async function EnrollmentsPage() {
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
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          All Enrollments
        </h2>
        <span className="text-sm text-gray-500">
          {enrollments?.length || 0} total
        </span>
      </div>

      <Card className="mt-4">
        <CardContent className="p-0">
          {!enrollments || enrollments.length === 0 ? (
            <p className="p-6 text-sm text-gray-500">No enrollments yet.</p>
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
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Payment</th>
                    <th className="px-4 py-3 font-medium">Subscription</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
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
                      <td className="px-4 py-3">
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
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                            e.payment_status === 'paid'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {e.payment_status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {e.stripe_subscription_id ? (
                          <span className="text-xs text-gray-500 font-mono">
                            {e.stripe_subscription_id.substring(0, 14)}...
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(e.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <ApproveButton id={e.id} disabled={e.status !== 'pending'} />
                          <RejectButton id={e.id} disabled={e.status !== 'pending'} />
                        </div>
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

function ApproveButton({ id, disabled }: { id: string; disabled: boolean }) {
  return (
    <form
      action={async () => {
        'use server'
        const supabase = await createClient()
        await supabase
          .from('enrollments')
          .update({ status: 'approved' })
          .eq('id', id)
        redirect('/dashboard/enrollments')
      }}
    >
      <Button
        type="submit"
        size="sm"
        variant="primary"
        disabled={disabled}
        className="h-7 px-2 text-xs"
      >
        Approve
      </Button>
    </form>
  )
}

function RejectButton({ id, disabled }: { id: string; disabled: boolean }) {
  return (
    <form
      action={async () => {
        'use server'
        const supabase = await createClient()
        await supabase
          .from('enrollments')
          .update({ status: 'rejected' })
          .eq('id', id)
        redirect('/dashboard/enrollments')
      }}
    >
      <Button
        type="submit"
        size="sm"
        variant="outline"
        disabled={disabled}
        className="h-7 px-2 text-xs text-red-600 border-red-300 hover:bg-red-50"
      >
        Reject
      </Button>
    </form>
  )
}
