import { createClient } from '@/lib/supabase/server'
import { isAuthorizedAdmin } from '@/lib/adminAccess'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { redirect } from 'next/navigation'
import { GraduationCap, Truck, CreditCard, CheckCircle2, Clock, Inbox } from 'lucide-react'

export default async function DiplomasPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user || !isAuthorizedAdmin(user.email)) redirect('/')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user!.id)
    .single()
  if (profile?.role !== 'admin') redirect('/dashboard')

  const { data: rows } = await supabase
    .from('diploma_exams')
    .select('*')
    .order('created_at', { ascending: false })

  const exams = rows ?? []
  const toMail = exams.filter((e) => e.paper_fee_paid && e.status !== 'mailed')
  const passed = exams.filter((e) => e.passed)
  const unpaidTest = exams.filter((e) => !e.test_paid)
  const unpaidPaper = exams.filter((e) => e.passed && !e.paper_fee_paid)

  function Badge({ ok, label }: { ok: boolean; label: string }) {
    return (
      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${ok ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
        {ok ? 'YES' : label}
      </span>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Passed', value: passed.length, icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-100' },
          { label: 'Ready to Mail', value: toMail.length, icon: Truck, color: 'text-blue-600 bg-blue-100' },
          { label: 'Test Fee Unpaid', value: unpaidTest.length, icon: CreditCard, color: 'text-rose-600 bg-rose-100' },
          { label: 'Paper Fee Unpaid', value: unpaidPaper.length, icon: Clock, color: 'text-amber-600 bg-amber-100' },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{s.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{s.value}</p>
                </div>
                <div className={`rounded-lg p-3 ${s.color}`}>
                  <s.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* DIPLOMAS TO MAIL — the key section for Anne */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-blue-600" />
            Diplomas to Mail ({toMail.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {toMail.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 py-10 text-center">
              <Truck className="h-8 w-8 text-gray-300" />
              <p className="mt-2 text-sm text-gray-400">No diplomas awaiting mailing yet. When a student passes and pays the $75 paper fee, they appear here with their address.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-gray-500">
                    <th className="pb-2 pr-4 font-medium">Student</th>
                    <th className="pb-2 pr-4 font-medium">Email</th>
                    <th className="pb-2 pr-4 font-medium">Score</th>
                    <th className="pb-2 pr-4 font-medium">Mailing Address</th>
                    <th className="pb-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {toMail.map((e) => (
                    <tr key={e.id} className="border-b last:border-0">
                      <td className="py-2 pr-4 font-medium text-gray-900">{e.student_name}</td>
                      <td className="py-2 pr-4 text-gray-600">{e.parent_email}</td>
                      <td className="py-2 pr-4 text-gray-600">{e.score}%</td>
                      <td className="py-2 pr-4 text-gray-600">
                        {e.mailing_address}, {e.mailing_city}, {e.mailing_state} {e.mailing_zip}
                      </td>
                      <td className="py-2"><Badge ok={e.status === 'mailed'} label="TO MAIL" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ALL DIPLOMA EXAMS */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-emerald-600" />
            All Diploma Exams ({exams.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {exams.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 py-10 text-center">
              <Inbox className="h-8 w-8 text-gray-300" />
              <p className="mt-2 text-sm text-gray-400">No diploma exams taken yet. They'll appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-gray-500">
                    <th className="pb-2 pr-4 font-medium">Student</th>
                    <th className="pb-2 pr-4 font-medium">Enrolled?</th>
                    <th className="pb-2 pr-4 font-medium">Test Paid</th>
                    <th className="pb-2 pr-4 font-medium">Passed</th>
                    <th className="pb-2 pr-4 font-medium">Paper Paid</th>
                    <th className="pb-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {exams.map((e) => (
                    <tr key={e.id} className="border-b last:border-0">
                      <td className="py-2 pr-4 font-medium text-gray-900">{e.student_name}</td>
                      <td className="py-2 pr-4">{e.is_enrolled ? 'Yes' : 'No'}</td>
                      <td className="py-2 pr-4"><Badge ok={e.test_paid} label="UNPAID" /></td>
                      <td className="py-2 pr-4"><Badge ok={e.passed} label="NO" /></td>
                      <td className="py-2 pr-4"><Badge ok={e.paper_fee_paid} label="UNPAID" /></td>
                      <td className="py-2 text-gray-500">{e.status}</td>
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
