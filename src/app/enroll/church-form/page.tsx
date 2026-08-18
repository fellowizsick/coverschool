'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { CheckCircle, FileText, Download, Printer } from 'lucide-react'

function ChurchFormContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const enrollmentId = searchParams.get('enrollment_id')
  const groupId = searchParams.get('group_id') || enrollmentId
  const studentName = searchParams.get('student') || ''
  const emailParam = searchParams.get('email') || ''
  const billingParam = searchParams.get('billing') || 'monthly'
  const parentParam = searchParams.get('parent') || ''
  const studentsParam = searchParams.get('students') || ''
  const alreadyPaid = searchParams.get('already_paid') === '1'

  // ⛔ CHURCH FORM GATE (2026-08-16): the enroll flow sends the full student list
  // here; each student needs their own completed form before payment is allowed.
  let studentsList: { id: string; name: string }[] = []
  try {
    studentsList = studentsParam ? (JSON.parse(studentsParam) as { id: string; name: string }[]) : []
  } catch {
    studentsList = []
  }
  const currentIdx = studentsList.findIndex((s) => s.id === enrollmentId)
  const next = studentsList[currentIdx + 1]

  const [submitted, setSubmitted] = useState(false)
  const [submittedId, setSubmittedId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const today = new Date().toISOString().split('T')[0]

  const [form, setForm] = useState({
    enrollment_id: enrollmentId || '',
    parent_email: '',
    school_year: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
    public_school_district: '',
    student_name: studentName,
    student_dob: '',
    grade: '',
    parent_name: '',
    home_phone: '',
    address: '',
    city: '',
    state: 'AL',
    zip: '',
    form_date: today,
    parent_signature: '',
    parent_signature_date: today,
    consent_date: today,
    consent_signature: '',
  })

  useEffect(() => {
    if (enrollmentId) {
      setForm(f => ({ ...f, enrollment_id: enrollmentId, student_name: studentName }))
    }
  }, [enrollmentId, studentName])

  function update(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  // ✅ Once every student's church form is done, this finishes the signup by
  // sending the family to Stripe. The backend also blocks payment if any
  // student's church form is still missing (create-checkout gate).
  async function goToPayment() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // 🔧 FIX 2026-08-18: send the REAL enrollment id, not the family
          // group id — create-checkout looks rows up by id (it now also
          // accepts family_group_id as a fallback). Before this, every fresh
          // signup hit "Enrollment not found" on this button.
          enrollmentId: enrollmentId || groupId || enrollmentId,
          email: emailParam,
          studentName: studentsList[0]?.name || studentName,
          parentName: parentParam,
          billing: billingParam,
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to start payment')
      }
      const { url } = await res.json()
      window.location.href = url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed')
      setLoading(false)
    }
  }

  // Multi-student: build the link to the next child's church form
  function nextUrl() {
    if (!next) return ''
    const qs = new URLSearchParams({
      enrollment_id: next.id,
      group_id: groupId || enrollmentId || '',
      student: next.name,
      email: emailParam,
      billing: billingParam,
      parent: parentParam,
      students: studentsParam,
    })
    return `/enroll/church-form?${qs.toString()}`
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.parent_signature || !form.consent_signature) {
      setError('Please sign both Part 1 and Part 3 before submitting.')
      return
    }
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/church-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to save')
      }
      const data = await res.json()
      setSubmittedId(data.id)
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white py-20">
        <div className="mx-auto max-w-lg px-4 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle className="h-10 w-10 text-emerald-600" />
          </div>
          <h1 className="mt-6 text-3xl font-bold text-gray-900">Form Submitted ✅</h1>
          <p className="mt-4 text-lg text-gray-600">
            Your Church/Home School Enrollment Form has been received.
          </p>
          {studentsList.length > 0 && (
            <p className="mt-2 text-sm font-medium text-emerald-700">
              {currentIdx + 1} of {studentsList.length} student{studentsList.length > 1 ? 's' : ''} completed
            </p>
          )}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row justify-center">
            <a href={`/enroll/church-form/${submittedId}`}>
              <Button variant="fun" className="w-full sm:w-auto">
                <FileText className="mr-2 h-4 w-4" />
                View / Print Your Form
              </Button>
            </a>
            <a href={`/api/church-form-pdf/${submittedId}`} target="_blank">
              <Button variant="sky" className="w-full sm:w-auto">
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </a>
          </div>

          {/* ⛔ CHURCH FORM GATE: step through each student, then hand off to payment.
              already_paid=1 (existing family) → no payment button, just done. */}
          {alreadyPaid ? (
            <div className="mt-8 rounded-xl border-2 border-emerald-200 bg-emerald-50 p-5 text-center">
              <p className="text-sm font-semibold text-emerald-800">
                ✅ Your enrollment file is now complete. Thank you!
              </p>
            </div>
          ) : next ? (
            <a href={nextUrl()} className="mt-8 block">
              <Button variant="fun" size="lg" className="w-full text-base shadow-xl">
                Next: {next.name} 📝 →
              </Button>
            </a>
          ) : (
            <Button
              variant="gold"
              size="lg"
              className="mt-8 w-full text-base shadow-xl"
              onClick={goToPayment}
              disabled={loading}
            >
              {loading ? '⏳ Opening payment...' : '✅ Continue to Payment'}
            </Button>
          )}
          {error && (
            <p className="mt-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
              ⚠️ {error}
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/30 via-white to-amber-50/20 pb-16">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-amber-900 py-16">
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-emerald-200 backdrop-blur-sm mb-4">
            <FileText className="h-4 w-4" />
            Required Document
          </div>
          <h1 className="text-4xl font-bold text-white font-heading sm:text-5xl">
            Church / Home School Enrollment 📋
          </h1>
          <p className="mt-4 text-lg text-emerald-100/80 max-w-xl mx-auto">
            This form must be completed before your enrollment can be finished. Please fill it out
            accurately and completely — payment is only available after it&apos;s done.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        {/* ⛔ REQUIRED STEP INDICATOR (2026-08-16, user directive): impossible to
            miss that this form blocks payment/continuation. */}
        <div className="mb-6 rounded-2xl border-2 border-red-300 bg-red-50 p-5">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⛔</span>
            <div>
              <p className="text-base font-bold text-red-800">
                Required Step — You Cannot Continue Without This
              </p>
              <p className="mt-1 text-sm text-red-700">
                This form must be <strong>fully completed</strong> before you can finish
                enrollment or go to payment. You cannot skip it.
                {studentName && (
                  <> Form for: <strong>{studentName}</strong>.</>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Step indicator: 1 Enrollment ✓ → 2 Church Form (required) → 3 Payment */}
        <div className="mb-6 grid grid-cols-3 gap-2 text-center text-xs font-medium">
          <div className="rounded-xl bg-emerald-100 border border-emerald-200 px-3 py-2.5 text-emerald-800">
            ✅ 1. Enrollment Form
            <br />
            <span className="text-emerald-600">Complete</span>
          </div>
          <div className="rounded-xl bg-red-100 border-2 border-red-300 px-3 py-2.5 text-red-800">
            📋 2. Church Form
            <br />
            <span className="font-bold text-red-600">You are here — Required</span>
          </div>
          <div className="rounded-xl bg-gray-100 border border-gray-200 px-3 py-2.5 text-gray-500">
            🔒 3. Payment
            <br />
            <span className="text-gray-400">Locked until step 2 is done</span>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ===== PART 1 ===== */}
          <Card fun="blue">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                📝 Part 1 — Parent / Guardian Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  id="school_year" label="School Year 🗓️" required
                  value={form.school_year}
                  onChange={e => update('school_year', e.target.value)}
                  placeholder="2026-2027"
                />
                <Input
                  id="public_school_district" label="Public School District 🏛️" required
                  value={form.public_school_district}
                  onChange={e => update('public_school_district', e.target.value)}
                  placeholder="e.g. Mobile County Public Schools"
                />
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-semibold text-gray-800 mb-3">Student Information</h3>
                <div className="grid gap-4 sm:grid-cols-3">
                  <Input id="student_name" label="Student's Full Name ✏️" required
                    value={form.student_name}
                    onChange={e => update('student_name', e.target.value)}
                    placeholder="John Smith" />
                  <Input id="student_dob" label="Date of Birth 🎂" type="date" required
                    value={form.student_dob}
                    onChange={e => update('student_dob', e.target.value)} />
                  <Input id="grade" label="Grade 🎯" required
                    value={form.grade}
                    onChange={e => update('grade', e.target.value)}
                    placeholder="e.g. 3rd Grade" />
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-semibold text-gray-800 mb-3">Parent / Guardian</h3>
                <Input id="parent_name" label="Parent or Guardian's Full Name ✏️" required
                  value={form.parent_name}
                  onChange={e => update('parent_name', e.target.value)}
                  placeholder="Jane Smith" />
                <div className="mt-2">
                  <Input id="parent_email" label="Parent Email 📧" type="email" required
                    value={form.parent_email}
                    onChange={e => update('parent_email', e.target.value)}
                    placeholder="parent@email.com" />
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Input id="home_phone" label="Home Phone 📞" type="tel" required
                    value={form.home_phone}
                    onChange={e => update('home_phone', e.target.value)}
                    placeholder="(251) 555-1234" />
                  <Input id="form_date" label="Date 📅" type="date" required
                    value={form.form_date}
                    onChange={e => update('form_date', e.target.value)} />
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-semibold text-gray-800 mb-3">Address</h3>
                <Input id="address" label="Street Address 🏠" required
                  value={form.address}
                  onChange={e => update('address', e.target.value)}
                  placeholder="123 Main Street" />
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <Input id="city" label="City 🏙️" required
                    value={form.city}
                    onChange={e => update('city', e.target.value)}
                    placeholder="Mobile" />
                  <Input id="state" label="State 🗺️" required
                    value={form.state}
                    onChange={e => update('state', e.target.value)}
                    placeholder="AL" />
                  <Input id="zip" label="ZIP Code 📬" required
                    value={form.zip}
                    onChange={e => update('zip', e.target.value)}
                    placeholder="36618" />
                </div>
              </div>

              {/* Signature */}
              <div className="border-t-2 border-gray-300 pt-4 mt-4">
                <h3 className="font-semibold text-gray-800 mb-2">Signature</h3>
                <p className="text-sm text-gray-500 mb-3">
                  Type your full name as your electronic signature. By signing, you confirm
                  that all information provided is accurate.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Signature of Parent or Guardian ✍️
                    </label>
                    <input
                      type="text"
                      required
                      value={form.parent_signature}
                      onChange={e => update('parent_signature', e.target.value)}
                      className="mt-1 flex h-12 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-lg font-[cursive] transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Type your full name"
                    />
                  </div>
                  <Input id="parent_signature_date" label="Date 📅" type="date" required
                    value={form.parent_signature_date}
                    onChange={e => update('parent_signature_date', e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ===== PART 3 — Consent ===== */}
          <Card fun="amber">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                ✅ Part 3 — Consent of Notification of Student Withdrawal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800 mb-4">
                <p className="font-medium">I hereby give prior consent to the Church School Administrator
                to notify the Public School Superintendent MCPSS Attendance Department P.O. Box 180069
                Mobile Al 36618 should the above named Student cease attendance at said Church School.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Signature of Parent or Guardian ✍️
                  </label>
                  <input
                    type="text"
                    required
                    value={form.consent_signature}
                    onChange={e => update('consent_signature', e.target.value)}
                    className="mt-1 flex h-12 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-lg font-[cursive] transition-all focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Type your full name"
                  />
                </div>
                <Input id="consent_date" label="Date 📅" type="date" required
                  value={form.consent_date}
                  onChange={e => update('consent_date', e.target.value)} />
              </div>
            </CardContent>
          </Card>

          <div className="rounded-xl border-2 border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p className="flex items-center gap-2">
              <strong>⛔ Cannot continue until this is done:</strong> All fields and both
              signatures are required. After you submit, you'll continue to payment.
            </p>
          </div>

          <Button type="submit" variant="gold" size="lg" className="w-full text-base shadow-xl"
            disabled={loading}>
            {loading ? '⏳ Submitting...' : '📋 Submit Form & Continue'}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default function ChurchEnrollmentFormPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading form...</p>
      </div>
    }>
      <ChurchFormContent />
    </Suspense>
  )
}