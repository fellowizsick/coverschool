'use client'

import { useState } from 'react'
import { X, Save, Loader2, AlertTriangle } from 'lucide-react'

export type EditableStudent = {
  id: string
  student_first_name: string
  student_last_name: string
  student_dob?: string | null
  student_grade?: string | null
  parent_first_name?: string | null
  parent_last_name?: string | null
  email?: string | null
  phone?: string | null
  address_line1?: string | null
  address_line2?: string | null
  city?: string | null
  state?: string | null
  zip?: string | null
  previous_school?: string | null
  notes?: string | null
}

/**
 * Fix a student's details (admin only).
 *
 * Built because there was NO way to correct an enrollment — so when three cash enrollments
 * captured today's date as the date of birth, the wrong data could never be repaired.
 */
export default function EditStudentPanel({
  student,
  onClose,
  onSaved,
}: {
  student: EditableStudent
  onClose: () => void
  onSaved: (updated: Partial<EditableStudent>) => void
}) {
  const [f, setF] = useState<Record<string, string>>({
    student_first_name: student.student_first_name ?? '',
    student_last_name: student.student_last_name ?? '',
    student_dob: (student.student_dob ?? '').slice(0, 10),
    student_grade: student.student_grade ?? '',
    parent_first_name: student.parent_first_name ?? '',
    parent_last_name: student.parent_last_name ?? '',
    email: student.email ?? '',
    phone: student.phone ?? '',
    address_line1: student.address_line1 ?? '',
    address_line2: student.address_line2 ?? '',
    city: student.city ?? '',
    state: student.state ?? '',
    zip: student.zip ?? '',
    previous_school: student.previous_school ?? '',
    notes: student.notes ?? '',
  })
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setF((p) => ({ ...p, [k]: e.target.value }))

  // Mirrors the server guard, so the admin sees the problem before hitting save.
  const dobWarning = (() => {
    const v = f.student_dob
    if (!v) return null
    const d = new Date(v + 'T00:00:00')
    if (isNaN(d.getTime())) return 'That is not a real date.'
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    if (d > today) return 'That date is in the future.'
    let age = today.getFullYear() - d.getFullYear()
    const m = today.getMonth() - d.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--
    if (age < 3) return `That would make them ${age} years old. Please double-check.`
    if (age > 100) return `That would make them ${age} years old. Please double-check.`
    return null
  })()

  async function save() {
    setBusy(true); setErr(null)
    try {
      const res = await fetch('/api/admin-update-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enrollmentId: student.id, fields: f }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Could not save')
      onSaved(data.student || f)
      onClose()
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Could not save')
    } finally {
      setBusy(false)
    }
  }

  const field = (label: string, key: string, type = 'text') => (
    <label className="block">
      <span className="block text-xs font-semibold text-gray-600 mb-1">{label}</span>
      <input
        type={type}
        value={f[key] ?? ''}
        onChange={set(key)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
      />
    </label>
  )

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/40 p-4 sm:p-8">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="font-bold text-gray-900">
            Edit {student.student_first_name} {student.student_last_name}
          </h2>
          <button onClick={onClose} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[70vh] space-y-5 overflow-y-auto px-5 py-5">
          <section>
            <h3 className="mb-2 text-sm font-bold text-gray-800">Student</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {field('First name', 'student_first_name')}
              {field('Last name', 'student_last_name')}
              {field('Date of birth', 'student_dob', 'date')}
              {field('Grade', 'student_grade')}
            </div>
            {dobWarning && (
              <p className="mt-2 flex items-start gap-1.5 rounded-lg bg-amber-50 p-2 text-xs text-amber-800">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>{dobWarning} The birthday on file is wrong for some cash enrollments because the old form had no date label — please enter the real one.</span>
              </p>
            )}
          </section>

          <section>
            <h3 className="mb-2 text-sm font-bold text-gray-800">Parent / Guardian</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {field('First name', 'parent_first_name')}
              {field('Last name', 'parent_last_name')}
              {field('Email', 'email', 'email')}
              {field('Phone', 'phone', 'tel')}
            </div>
          </section>

          <section>
            <h3 className="mb-2 text-sm font-bold text-gray-800">Address</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {field('Address line 1', 'address_line1')}
              {field('Address line 2', 'address_line2')}
              {field('City', 'city')}
              {field('State', 'state')}
              {field('ZIP', 'zip')}
              {field('Previous school', 'previous_school')}
            </div>
          </section>

          <section>
            <h3 className="mb-2 text-sm font-bold text-gray-800">Notes</h3>
            <textarea
              value={f.notes ?? ''}
              onChange={set('notes')}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
            />
          </section>

          {err && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{err}</p>}
          <p className="text-xs text-gray-500">
            Payment status is not editable here — use the green/red pill on the roster.
          </p>
        </div>

        <div className="flex justify-end gap-2 border-t px-5 py-4">
          <button onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100">
            Cancel
          </button>
          <button
            onClick={save}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save changes
          </button>
        </div>
      </div>
    </div>
  )
}
