'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { ALL_STATES, GRADE_OPTIONS } from '@/lib/constants'
import { CheckCircle, FileText, Plus, Trash2, GraduationCap, UserPlus, Receipt, Lock } from 'lucide-react'

const stateOptions = ALL_STATES.filter((s) => s.status === 'available').map(
  (s) => ({ value: s.code, label: `${s.name} (${s.code})` })
)
const gradeOptions = GRADE_OPTIONS.map((g) => ({ value: g, label: g }))

type StudentForm = {
  id: string
  first: string
  last: string
  grade: string
  dob: string
  ssn: string
}

// A stable per-row id. Keying rows by array INDEX makes React reuse the wrong DOM nodes
// after a removal, so the values on screen stop matching the real state. Always key by id.
let rowSeq = 0
const newRowId = () => `st-${Date.now().toString(36)}-${++rowSeq}`
const emptyStudent = (): StudentForm => ({ id: newRowId(), first: '', last: '', grade: '', dob: '', ssn: '' })

export default function CashEnrollPage() {
  const [token, setToken] = useState('')
  const [valid, setValid] = useState<null | boolean>(null)         // null = loading
  const [tokInfo, setTokInfo] = useState<null | { email: string; amountCents: number; studentCount: number }>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [parent, setParent] = useState({ first: '', last: '', email: '', phone: '', line1: '', city: '', state: '', zip: '' })
  const [students, setStudents] = useState<StudentForm[]>([emptyStudent()])
  // Client-only "today" — used to block future birth dates at the picker level.
  const [todayISO, setTodayISO] = useState('')

  useEffect(() => {
    setTodayISO(new Date().toISOString().slice(0, 10))
    const params = new URLSearchParams(window.location.search)
    const t = params.get('token') || ''
    setToken(t)
    if (!t) { setValid(false); return }
    fetch(`/api/cash-enroll/validate?token=${encodeURIComponent(t)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) {
          setValid(true)
          setTokInfo({ email: d.email, amountCents: d.amountCents, studentCount: d.studentCount })
          // Pre-create one student row per student the school pre-authorized, so the
          // parent doesn't have to click "Add" once for every child.
          const n = Math.max(1, Number(d.studentCount) || 1)
          setStudents(Array.from({ length: n }, () => emptyStudent()))
        } else setValid(false)
      })
      .catch(() => setValid(false))
  }, [])

  function setStudent(i: number, patch: Partial<StudentForm>) {
    setStudents((prev) => prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s)))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    // Basic validation
    if (!parent.first || !parent.last || !parent.email || !parent.phone || !parent.line1 || !parent.city || !parent.state || !parent.zip) {
      setError('Please fill in all parent fields.'); return
    }
    if (students.some((s) => !s.first || !s.last || !s.grade || !s.dob || !/^\d{4}$/.test(s.ssn))) {
      setError('Please complete every student field, including the SSN last-4 (4 digits).'); return
    }
    // Date-of-birth sanity check. The phone date picker opens on TODAY, so an untouched
    // field silently saves today's date — that already happened once and put the wrong
    // birthday on a child's state records. Catch it here, loudly.
    const nowMs = Date.now()
    for (const s of students) {
      const who = s.first || 'this student'
      const t = Date.parse(s.dob)
      if (Number.isNaN(t)) { setError(`Please enter a valid date of birth for ${who}.`); return }
      if (t > nowMs) { setError(`The date of birth can’t be in the future — please check ${who}.`); return }
      const ageYears = (nowMs - t) / 31557600000 // 365.25 days, in ms
      if (ageYears < 3) {
        setError(`That birthday would make ${who} under 3 years old. Please pick the real date of birth.`); return
      }
      if (ageYears > 100) { setError(`That birth date doesn’t look right — please check ${who}.`); return }
    }
    setLoading(true)
    try {
      const res = await fetch('/api/cash-enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          parent_first_name: parent.first,
          parent_last_name: parent.last,
          email: parent.email,
          phone: parent.phone,
          address_line1: parent.line1,
          city: parent.city,
          state: parent.state,
          zip: parent.zip,
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
      if (!res.ok) throw new Error(data.error || 'Submission failed')
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed')
    } finally {
      setLoading(false)
    }
  }

  if (valid === null) {
    return (
      <div className="min-h-[100dvh] bg-gradient-to-b from-emerald-50 to-white py-24">
        <div className="mx-auto max-w-md px-4 text-center text-gray-500">Checking your enrollment link…</div>
      </div>
    )
  }

  if (!valid) {
    return (
      <div className="min-h-[100dvh] bg-gradient-to-b from-emerald-50 to-white py-24">
        <div className="mx-auto max-w-md px-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
            <Lock className="h-8 w-8 text-amber-600" />
          </div>
          <h1 className="mt-6 text-2xl font-bold text-gray-900">This link isn’t valid</h1>
          <p className="mt-3 text-gray-600">
            This enrollment link is not valid, expired, or already used. Please contact the school
            directly and we’ll get you set up.
          </p>
          <Link href="/" className="mt-6 inline-block text-sm font-medium text-emerald-600">← Back to school site</Link>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-[100dvh] bg-gradient-to-b from-emerald-50 to-white py-24">
        <div className="mx-auto max-w-lg px-4 text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-emerald-600" />
          <h1 className="mt-6 text-3xl font-bold text-gray-900">You’re all set! 🎉</h1>
          <p className="mt-4 text-lg text-gray-600">
            Your enrollment has been recorded. We’ve sent a <strong>payment receipt</strong> to{" "}
            <strong>{parent.email}</strong>.
          </p>
          <p className="mt-3 text-sm text-gray-500">
            If you don’t see it in a few minutes, check your spam folder. One of our team will be in
            touch to welcome your student(s).
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-emerald-50 to-white py-12">
      <div className="mx-auto max-w-2xl px-4">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-semibold text-emerald-700">
            <Receipt className="h-4 w-4" /> Enrollment &amp; Payment · {tokInfo?.amountCents ? `$${(tokInfo.amountCents / 100).toFixed(0)}` : ''} received
          </span>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Welcome to Larose Christian Academy</h1>
          <p className="mt-2 text-gray-600">
            Complete the enrollment below. Your {tokInfo?.studentCount || 1} student(s){/* */} have
            already been paid for — no card needed.
          </p>
        </div>

        <Card className="mt-8">
          <CardHeader><CardTitle>Parent / Guardian</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input id="parent_first" label="First Name" placeholder="e.g. Maria" value={parent.first} onChange={(e) => setParent({ ...parent, first: e.target.value })} />
              <Input id="parent_last" label="Last Name" placeholder="e.g. Garcia" value={parent.last} onChange={(e) => setParent({ ...parent, last: e.target.value })} />
              <Input id="parent_email" type="email" label="Email (your receipt is sent here)" placeholder="you@example.com" value={parent.email} onChange={(e) => setParent({ ...parent, email: e.target.value })} />
              <Input id="parent_phone" label="Phone Number" placeholder="(251) 555-0123" value={parent.phone} onChange={(e) => setParent({ ...parent, phone: e.target.value })} />
              <div className="sm:col-span-2"><Input id="parent_line1" label="Street Address" placeholder="123 Main St" value={parent.line1} onChange={(e) => setParent({ ...parent, line1: e.target.value })} /></div>
              <Input id="parent_city" label="City" placeholder="Mobile" value={parent.city} onChange={(e) => setParent({ ...parent, city: e.target.value })} />
              <div className="grid grid-cols-2 gap-4">
                <Select
                  id="parent_state"
                  label="State"
                  value={parent.state}
                  onChange={(e) => setParent({ ...parent, state: e.target.value })}
                  options={stateOptions}
                  placeholder="Select state"
                />
                <Input id="parent_zip" label="ZIP Code" placeholder="36601" value={parent.zip} onChange={(e) => setParent({ ...parent, zip: e.target.value })} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Students</CardTitle>
              {students.length < (tokInfo?.studentCount || 1) && (
                <Button type="button" variant="outline" size="sm" onClick={() => setStudents([...students, emptyStudent()])}>
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              )}
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Please enter each child’s <strong className="font-semibold text-gray-700">real date of birth</strong> — it is
              printed on their official state records. Don’t leave it on today’s date.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {students.map((s, i) => (
              <div key={s.id} className="rounded-lg border border-gray-200 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">
                    <UserPlus className="h-4 w-4 inline mr-1 text-emerald-600" /> Student {i + 1}
                  </span>
                  {students.length > 1 && (
                    <button type="button" onClick={() => setStudents((prev) => prev.filter((x) => x.id !== s.id))} className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-600">
                      <Trash2 className="h-3 w-3" /> Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Input id={`student_first_${i}`} label="Student First Name" placeholder="e.g. Ana" value={s.first} onChange={(e) => setStudent(i, { first: e.target.value })} />
                  <Input id={`student_last_${i}`} label="Student Last Name" placeholder="e.g. Garcia" value={s.last} onChange={(e) => setStudent(i, { last: e.target.value })} />
                  <Select
                    id={`student_grade_${i}`}
                    label="Grade Level"
                    value={s.grade}
                    onChange={(e) => setStudent(i, { grade: e.target.value })}
                    options={gradeOptions}
                    placeholder="Select grade"
                  />
                  <Input id={`student_dob_${i}`} type="date" label="Date of Birth" max={todayISO || undefined} value={s.dob} onChange={(e) => setStudent(i, { dob: e.target.value })} />
                  <Input id={`student_ssn_${i}`} label="SSN — Last 4 Digits" placeholder="1234" maxLength={4} inputMode="numeric" value={s.ssn} onChange={(e) => setStudent(i, { ssn: e.target.value.replace(/\D/g, '') })} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {error && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        <Button type="submit" size="lg" className="mt-6 w-full" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Submitting…' : <><GraduationCap className="h-5 w-5 mr-2" /> Submit Enrollment</>}
        </Button>
        <p className="mt-3 text-center text-xs text-gray-400">No card required — payment already received. A receipt will be emailed to you.</p>
      </div>
    </div>
  )
}
