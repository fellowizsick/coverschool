import { createClient, createAdminClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { isAuthorizedAdmin } from '@/lib/adminAccess'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { BookOpen, DollarSign, Users, Receipt, Link2, PenLine } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

// 📒 CASH LEDGER — every cash payment the school has received, whoever entered it.
// 🔒 Admin only (Mom + owner). The underlying `cash_payments` table has NO RLS
// policies at all, so this page (running as the server/service_role) is the ONLY
// way anyone can read it.
type CashPayment = {
  id: string
  receipt_number: string | null
  parent_first_name: string | null
  parent_last_name: string | null
  email: string
  phone: string | null
  amount_cents: number
  student_count: number
  students: { name?: string; grade?: string }[] | null
  method: string
  notes: string | null
  entered_by: string | null
  created_at: string
}

function fmtMoney(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}
function fmtDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
}

export default async function CashLedgerPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirect=/dashboard/cash-ledger')
  if (!isAuthorizedAdmin(user.email)) redirect('/')

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('cash_payments')
    .select('*')
    .order('created_at', { ascending: false })

  const payments: CashPayment[] = (data as CashPayment[]) ?? []

  const totalCents = payments.reduce((sum, p) => sum + (p.amount_cents || 0), 0)
  const totalStudents = payments.reduce((sum, p) => sum + (p.student_count || 0), 0)
  const viaLink = payments.filter((p) => p.method === 'link').length
  const viaDirect = payments.filter((p) => p.method !== 'link').length

  return (
    <div className="space-y-8">
      <div>
        <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
          <BookOpen className="h-5 w-5 text-emerald-600" /> Cash Payments Ledger
        </h2>
        <p className="text-sm text-gray-500">
          Every cash payment recorded — entered by you or completed by a family through a link.
          🔒 This record is visible to school admins only.
        </p>
      </div>

      {/* Totals */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-emerald-200 bg-emerald-50/40">
          <CardContent className="flex items-center gap-3 p-5">
            <DollarSign className="h-7 w-7 text-emerald-600" />
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Total Cash Collected</p>
              <p className="text-2xl font-bold text-emerald-800">{fmtMoney(totalCents)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <Receipt className="h-7 w-7 text-gray-500" />
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Payments</p>
              <p className="text-2xl font-bold text-gray-900">{payments.length}</p>
              <p className="text-xs text-gray-500">
                {viaDirect} entered by admin · {viaLink} via link
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <Users className="h-7 w-7 text-gray-500" />
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Students Enrolled</p>
              <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Could not load the ledger: {error.message}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Cash Payments</CardTitle>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <p className="p-6 text-center text-sm text-gray-500">
              No cash payments recorded yet. They appear here automatically — whether you enter
              them on the <strong>Cash Enroll</strong> page or a family completes a
              <strong> Cash Link</strong>.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50 text-left text-gray-500">
                    <th className="px-3 py-2 font-medium">Date</th>
                    <th className="px-3 py-2 font-medium">Receipt #</th>
                    <th className="px-3 py-2 font-medium">Parent</th>
                    <th className="px-3 py-2 font-medium">Email</th>
                    <th className="px-3 py-2 font-medium">Amount</th>
                    <th className="px-3 py-2 font-medium">Students</th>
                    <th className="px-3 py-2 font-medium">Entered</th>
                    <th className="px-3 py-2 font-medium">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p.id} className="border-b align-top last:border-0 hover:bg-gray-50">
                      <td className="whitespace-nowrap px-3 py-3 text-gray-500">{fmtDate(p.created_at)}</td>
                      <td className="whitespace-nowrap px-3 py-3">
                        <span className="font-mono text-xs text-gray-600">{p.receipt_number || '—'}</span>
                      </td>
                      <td className="px-3 py-3 text-gray-900">
                        {`${p.parent_first_name || ''} ${p.parent_last_name || ''}`.trim() || '—'}
                      </td>
                      <td className="px-3 py-3 text-gray-600">{p.email}</td>
                      <td className="whitespace-nowrap px-3 py-3 font-semibold text-emerald-700">
                        {fmtMoney(p.amount_cents)}
                      </td>
                      <td className="px-3 py-3 text-gray-700">
                        <span className="font-medium">{p.student_count}</span>
                        {Array.isArray(p.students) && p.students.length > 0 && (
                          <span className="block text-xs text-gray-500">
                            {p.students.map((s) => s.name).filter(Boolean).join(', ')}
                          </span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {p.method === 'link' ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-2 py-0.5 text-xs text-sky-700">
                            <Link2 className="h-3 w-3" /> Link
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">
                            <PenLine className="h-3 w-3" /> Admin
                          </span>
                        )}
                        <span className="mt-1 block text-xs text-gray-400">{p.entered_by || ''}</span>
                      </td>
                      <td className="max-w-[16rem] px-3 py-3 text-gray-600">{p.notes || '—'}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-200 bg-gray-50 font-semibold">
                    <td className="px-3 py-3 text-gray-700" colSpan={4}>Total</td>
                    <td className="px-3 py-3 text-emerald-800">{fmtMoney(totalCents)}</td>
                    <td className="px-3 py-3 text-gray-700">{totalStudents}</td>
                    <td className="px-3 py-3" colSpan={2}></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <p className="text-xs text-gray-400">
        <Link href="/dashboard" className="text-emerald-600 hover:underline">← Back to dashboard</Link>
      </p>
    </div>
  )
}
