'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { ALL_STATES, GRADE_OPTIONS } from '@/lib/constants'
import { UserPlus, Plus, Trash2, Receipt, CheckCircle, Loader2 } from 'lucide-react'

const stateOptions = ALL_STATES.filter((s) => s.status === 'available').map((s) => ({ value: s.code, label: `${s.name} (${s.code})` }))
const gradeOptions = GRADE_OPTIONS.map((g) => ({ value: g, label: g }))

type StudentForm = { first: string; last: string; grade: string; dob: string; ssn: string }
const emptyStudent = (): StudentForm => ({ first: '', last: '', grade: '', dob: '', ssn: '' })

export default function AdminCashEnrollPage() {
  const [parent, setParent] = useState({ first: '', last: '', email: '', phone: '', line1: '', city: '', state: '', zip: '' })
  const [amount, setAmount] = useState('')
  const [students, setStudents] = useState<StudentForm[]>([emptyStudent()])
  const [notes, setNotes] = useState('')
  const [sendReceipt, setSendReceipt] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<{ ids: string[]; receipt: boolean } | null>(null)

  function setStudent(i: number, patch: Partial<StudentForm>) {
    setStudents((prev) => prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s)))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(''); setResult(null)
    if (!parent.first || !parent.last || !parent.email) { setError('Enter the parent name and email.'); return }
    if (students.some((s) => !s.first || !s.last || !s.grade || !s.dob || !/^\d{4}$/.test(s.ssn))) {
      setError('Complete each student (grade, DOB, and SSN last-4 = 4 digits).'); return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/admin-cash-enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parent_first_name: parent.first,
          parent_last_name: parent.last,
          email: parent.email,
          phone: parent.phone,
          address_line1: parent.line1,
          city: parent.city,
          state: parent.state,
          zip: parent.zip,
          amountPaidCents: Math.round(parseFloat(amount || '0') * 100),
          sendReceipt,
          notes,
          students: students.map((s) => ({
            student_first_name: s.first,
            student_last_name: s.last,
            student_grade: s.grade,
            student_dob: s.dob,
            ssn_last_four: s.ssn,
          })),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to enroll')
      setResult({ ids: data.ids, receipt: data.receipt_sent })
      setParent({ first: '', last: '', email: '', phone: '', line1: '', city: '', state: '', zip: '' })
      setAmount(''); setStudents([emptyStudent()]); setNotes('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to enroll')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Add Cash Students</h2>
        <p className="text-sm text-gray-500">
          For families who paid in person. Enter the parent + students here. They enroll as{' '}
          <strong>approved + cash-paid</strong> (no card, no link). Cash is admin-only.
        </p>
      </div>

      {result && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
            <CheckCircle className="h-4 w-4" /> Enrolled — {result.ids.length} student(s) added
          </div>
          <p className="mt-1 text-xs text-emerald-600">
            {result.receipt ? 'Receipt emailed to the parent.' : 'No receipt sent (toggle on next time).'}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Parent / Guardian</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input placeholder="First name" value={parent.first} onChange={(e) => setParent({ ...parent, first: e.target.value })} />
              <Input placeholder="Last name" value={parent.last} onChange={(e) => setParent({ ...parent, last: e.target.value })} />
              <Input type="email" placeholder="Parent email" value={parent.email} onChange={(e) => setParent({ ...parent, email: e.target.value })} />
              <Input placeholder="Phone" value={parent.phone} onChange={(e) => setParent({ ...parent, phone: e.target.value })} />
              <div className="sm:col-span-2"><Input placeholder="Street address" value={parent.line1} onChange={(e) => setParent({ ...parent, line1: e.target.value })} /></div>
              <Input placeholder="City" value={parent.city} onChange={(e) => setParent({ ...parent, city: e.target.value })} />
              <div className="grid grid-cols-2 gap-4">
                <Select
                  value={parent.state}
                  onChange={(e) => setParent({ ...parent, state: e.target.value })}
                  options={stateOptions}
                  placeholder="State"
                />
                <Input placeholder="ZIP" value={parent.zip} onChange={(e) => setParent({ ...parent, zip: e.target.value })} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Students</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={() => setStudents([...students, emptyStudent()])}>
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {students.map((s, i) => (
              <div key={i} className="rounded-lg border border-gray-200 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700"><UserPlus className="h-4 w-4 inline mr-1 text-emerald-600" /> Student {i + 1}</span>
                  {students.length > 1 && <button type="button" onClick={() => setStudents(students.filter((_, x) => x !== i))} className="text-xs text-red-500">Remove</button>}
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Input placeholder="Student first name" value={s.first} onChange={(e) => setStudent(i, { first: e.target.value })} />
                  <Input placeholder="Student last name" value={s.last} onChange={(e) => setStudent(i, { last: e.target.value })} />
                  <Select
                    value={s.grade}
                    onChange={(e) => setStudent(i, { grade: e.target.value })}
                    options={gradeOptions}
                    placeholder="Grade"
                  />
                  <Input type="date" placeholder="DOB" value={s.dob} onChange={(e) => setStudent(i, { dob: e.target.value })} />
                  <Input placeholder="SSN last 4" maxLength={4} value={s.ssn} onChange={(e) => setStudent(i, { ssn: e.target.value.replace(/\D/g, '') })} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Cash Payment</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-gray-500">Cash amount received ($)</label>
                <Input type="number" placeholder="360.00" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1" />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input type="checkbox" checked={sendReceipt} onChange={(e) => setSendReceipt(e.target.checked)} className="h-4 w-4" />
                  Email the parent a receipt
                </label>
              </div>
            </div>
            <div className="mt-3">
              <label className="text-xs font-medium text-gray-500">Notes (optional)</label>
              <Input placeholder="e.g. 3 students, paid cash, enrolled by Mom" value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-1" />
            </div>
          </CardContent>
        </Card>

        {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        <Button type="submit" size="lg" disabled={loading}>
          {loading ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <Receipt className="h-5 w-5 mr-2" />}
          Enroll Students as Cash-Paid
        </Button>
        <p className="text-xs text-gray-400">
          <Link href="/dashboard/cash-payments" className="text-emerald-600 hover:underline">← To link generator</Link>
        </p>
      </form>
    </div>
  )
}
