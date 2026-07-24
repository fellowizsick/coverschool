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
  const studentName = searchParams.get('student') || ''

  const [submitted, setSubmitted] = useState(false)
  const [submittedId, setSubmittedId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const today = new Date().toISOString().split('T')[0]

  const [form, setForm] = useState({
    enrollment_id: enrollmentId || '',
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
            This form must be completed before your student can begin. Please fill it out
            accurately and submit within <strong>10 days</strong>.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        {!enrollmentId && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            ⚠️ You need an enrollment ID to fill this form. Please enroll your student first.
          </div>
        )}

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

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-500">
            <p className="flex items-center gap-2">
              <strong>⏰ Deadline:</strong> This form must be submitted within 10 days of enrollment.
              Your student cannot begin until this form is completed.
            </p>
          </div>

          <Button type="submit" variant="gold" size="lg" className="w-full text-base shadow-xl"
            disabled={loading || !enrollmentId}>
            {loading ? '⏳ Submitting...' : '📋 Submit Church Enrollment Form'}
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