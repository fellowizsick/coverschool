'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { CheckCircle, FileText, GraduationCap, Lock, Plus, UserPlus, Trash2 } from 'lucide-react'

const requesterTypes = [
  { value: 'parent', label: 'Parent / Guardian' },
  { value: 'school', label: 'School' },
  { value: 'district', label: 'School District' },
  { value: 'other', label: 'Other' },
]

// Every option here is something the school can actually produce.
const RECORD_TYPES = [
  { value: 'academic_transcript', label: 'Official academic transcript' },
  { value: 'report_cards', label: 'Report cards' },
  { value: 'immunization', label: 'Immunization records' },
  { value: 'attendance', label: 'Attendance records' },
  { value: 'diploma', label: 'Diploma / graduation verification' },
  { value: 'enrollment_verification', label: 'Enrollment verification letter' },
]

const deliveryOptions = [
  { value: 'email', label: 'Email (fastest)' },
  { value: 'mail', label: 'Postal mail' },
  { value: 'pickup', label: 'Pick up in person' },
]

type StudentRow = { id: string; first: string; last: string; dob: string; grade: string }
// Stable per-row id — keying rows by array index makes React reuse the wrong DOM nodes
// after a removal, so the row you delete isn't the row that disappears from screen.
let rowSeq = 0
const newRowId = () => `sr-${Date.now().toString(36)}-${++rowSeq}`
const emptyStudent = (): StudentRow => ({ id: newRowId(), first: '', last: '', dob: '', grade: '' })

export default function RecordsRequestPage() {
  const [requesterType, setRequesterType] = useState('parent')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [org, setOrg] = useState('')
  const [address, setAddress] = useState('')

  // As many students as the family has — no limit.
  const [students, setStudents] = useState<StudentRow[]>([emptyStudent()])

  const [wanted, setWanted] = useState<string[]>(['academic_transcript'])
  const [otherRecords, setOtherRecords] = useState('')
  const [delivery, setDelivery] = useState('email')
  const [deliveryDetail, setDeliveryDetail] = useState('')
  const [reason, setReason] = useState('')

  const [authName, setAuthName] = useState('')
  const [agree, setAgree] = useState(false)

  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [doneCount, setDoneCount] = useState(0)
  const [doneLinked, setDoneLinked] = useState(0)

  const [todayISO, setTodayISO] = useState('')
  useEffect(() => {
    setTodayISO(new Date().toISOString().slice(0, 10))
  }, [])

  function setStudent(i: number, patch: Partial<StudentRow>) {
    setStudents((prev) => prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s)))
  }
  const addStudent = () => setStudents((prev) => [...prev, emptyStudent()])
  const removeStudent = (i: number) =>
    setStudents((prev) => (prev.length <= 1 ? prev : prev.filter((_, idx) => idx !== i)))

  function toggleRecord(v: string) {
    setWanted((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!name || !email) {
      setError('Please fill in your name and email address.'); return
    }
    if (requesterType !== 'parent' && !org) {
      setError('Please enter the school or district name.'); return
    }

    // Every student needs a name and a believable date of birth.
    for (let i = 0; i < students.length; i++) {
      const s = students[i]
      const who = students.length > 1 ? `Student ${i + 1}` : 'the student'
      if (!s.first || !s.last) {
        setError(`Please enter a first and last name for ${who}.`); return
      }
      const dobMs = Date.parse(s.dob)
      if (!s.dob || Number.isNaN(dobMs)) {
        setError(`Please enter a date of birth for ${who}.`); return
      }
      const ageYears = (Date.now() - dobMs) / 31557600000
      if (ageYears < 3 || ageYears > 100) {
        setError(`That date of birth doesn’t look right for ${who} — please check it.`); return
      }
    }

    if (wanted.length === 0 && !otherRecords) {
      setError('Please choose at least one record you need.'); return
    }
    if (!authName.trim()) {
      setError('Please type your name to authorize the release.'); return
    }
    if (!agree) {
      setError('Please check the authorization box.'); return
    }

    setSending(true)
    try {
      const res = await fetch('/api/records-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requester_type: requesterType,
          requester_name: name,
          requester_email: email,
          requester_phone: phone,
          requester_org: org,
          requester_address: address,
          students: students.map((s) => ({
            student_first_name: s.first,
            student_last_name: s.last,
            student_dob: s.dob,
            student_grade: s.grade,
          })),
          records_requested: wanted,
          other_records: otherRecords,
          delivery_method: delivery,
          delivery_detail: deliveryDetail,
          reason,
          authorization_name: authName,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Could not submit the request')
      setDoneCount(data.count || students.length)
      setDoneLinked((data.requests || []).filter((r: { linked: boolean }) => r.linked).length)
      setDone(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit the request')
    } finally {
      setSending(false)
    }
  }

  if (done) {
    return (
      <div className="min-h-[100dvh] bg-gradient-to-b from-emerald-50 to-white py-20">
        <div className="mx-auto max-w-lg px-4 text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-emerald-600" />
          <h1 className="mt-6 text-3xl font-bold text-gray-900">Request received ✅</h1>
          <p className="mt-4 text-gray-600">
            {doneCount === 1
              ? 'The school has your request for 1 student.'
              : `The school has your request for ${doneCount} students.`}{' '}
            We’ll send the records to{' '}
            <strong>{delivery === 'email' ? email : deliveryDetail || 'the address you gave us'}</strong>.
          </p>
          <p className="mt-3 text-sm text-gray-500">
            Please allow a few business days. If it’s urgent, call or text the school.
          </p>
          <Link href="/" className="mt-8 inline-block text-sm font-medium text-emerald-600">
            ← Back to the school site
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-emerald-50/60 to-white py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-semibold text-emerald-700">
            <FileText className="h-4 w-4" /> Student Records
          </span>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Request Student Records</h1>
          <p className="mt-2 text-gray-600">
            Parents, schools and districts can request a student’s official records here. We’ll send
            them using the delivery method you choose.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* ── who is asking ─────────────────────────────────────────────── */}
          <Card>
            <CardHeader><CardTitle>Who is requesting</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Select
                  id="r_type"
                  label="I am the…"
                  value={requesterType}
                  onChange={(e) => setRequesterType(e.target.value)}
                  options={requesterTypes}
                />
                <Input
                  id="r_name"
                  label="Your Full Name"
                  placeholder="e.g. Maria Garcia"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Input
                  id="r_email"
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  id="r_phone"
                  label="Phone Number"
                  placeholder="(251) 555-0123"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <Input
                  id="r_org"
                  label={requesterType === 'parent' ? 'School / District (optional)' : 'School or District Name'}
                  placeholder="e.g. Mobile County Schools"
                  value={org}
                  onChange={(e) => setOrg(e.target.value)}
                />
                <Input
                  id="r_addr"
                  label="Mailing Address (if we need to mail them)"
                  placeholder="123 Main St, Mobile, AL 36601"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* ── the students — as many as they have ───────────────────────── */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle>Which students</CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={addStudent}>
                  <Plus className="h-4 w-4 mr-1" /> Add Student
                </Button>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Add every child you need records for — there’s no limit. Please match the name and
                date of birth exactly as they appear on their records; that’s how we find the right file.
              </p>
            </CardHeader>
            <CardContent className="space-y-5">
              {students.map((s, i) => (
                <div key={s.id} className="rounded-lg border border-gray-200 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">
                      <UserPlus className="h-4 w-4 inline mr-1 text-emerald-600" /> Student {i + 1}
                    </span>
                    {students.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeStudent(i)}
                        className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-3 w-3" /> Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Input
                      id={`s_first_${i}`}
                      label="Student First Name"
                      placeholder="e.g. Ana"
                      value={s.first}
                      onChange={(e) => setStudent(i, { first: e.target.value })}
                    />
                    <Input
                      id={`s_last_${i}`}
                      label="Student Last Name"
                      placeholder="e.g. Garcia"
                      value={s.last}
                      onChange={(e) => setStudent(i, { last: e.target.value })}
                    />
                    <Input
                      id={`s_dob_${i}`}
                      label="Student Date of Birth"
                      type="date"
                      max={todayISO || undefined}
                      value={s.dob}
                      onChange={(e) => setStudent(i, { dob: e.target.value })}
                    />
                    <Input
                      id={`s_grade_${i}`}
                      label="Grade (if currently enrolled)"
                      placeholder="e.g. 5th Grade"
                      value={s.grade}
                      onChange={(e) => setStudent(i, { grade: e.target.value })}
                    />
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addStudent} className="w-full border-dashed">
                <Plus className="h-4 w-4 mr-2" /> Add another student
              </Button>
            </CardContent>
          </Card>

          {/* ── what they need ────────────────────────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Which records do you need</CardTitle>
              <p className="mt-1 text-sm text-gray-500">
                Choose everything that applies — this covers all the students above.
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {RECORD_TYPES.map((r) => (
                <label key={r.value} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-4 w-4 shrink-0"
                    checked={wanted.includes(r.value)}
                    onChange={() => toggleRecord(r.value)}
                  />
                  <span className="text-sm text-gray-700">{r.label}</span>
                </label>
              ))}
              <Input
                id="r_other"
                label="Anything else you need"
                placeholder="e.g. a letter confirming enrollment dates"
                value={otherRecords}
                onChange={(e) => setOtherRecords(e.target.value)}
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Select
                  id="r_delivery"
                  label="How should we send them"
                  value={delivery}
                  onChange={(e) => setDelivery(e.target.value)}
                  options={deliveryOptions}
                />
                <Input
                  id="r_delivery_detail"
                  label={delivery === 'email' ? 'Send to this email (leave blank to use the one above)' : 'Where exactly should we send them'}
                  placeholder={delivery === 'email' ? 'records@example.com' : 'Address or pickup details'}
                  value={deliveryDetail}
                  onChange={(e) => setDeliveryDetail(e.target.value)}
                />
              </div>
              <Input
                id="r_reason"
                label="Reason (optional)"
                placeholder="e.g. transferring to a new school"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </CardContent>
          </Card>

          {/* ── authorization ─────────────────────────────────────────────── */}
          <Card>
            <CardHeader><CardTitle>Authorization</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Input
                id="r_auth"
                label="Type Your Full Legal Name"
                placeholder="This counts as your signature"
                value={authName}
                onChange={(e) => setAuthName(e.target.value)}
              />
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 shrink-0"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                />
                <span className="text-sm text-gray-700">
                  I am authorized to request these records, and I release Larose Christian Academy
                  to send them to the person or school named above.
                </span>
              </label>
            </CardContent>
          </Card>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <Button type="submit" size="lg" className="w-full" disabled={sending}>
            {sending ? 'Sending…' : <><GraduationCap className="h-5 w-5 mr-2" /> Submit Records Request</>}
          </Button>
          <p className="flex items-center justify-center gap-2 pb-8 text-center text-xs text-gray-400">
            <Lock className="h-3 w-3" /> Your request goes only to the school office.
          </p>
        </form>
      </div>
    </div>
  )
}
