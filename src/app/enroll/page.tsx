'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { ALL_STATES, GRADE_OPTIONS } from '@/lib/constants'
import { CreditCard, CheckCircle, Sparkles, GraduationCap, FileText } from 'lucide-react'

const stateOptions = ALL_STATES.filter((s) => s.status === 'available').map(
  (s) => ({ value: s.code, label: `${s.name} (${s.code})` })
)

const gradeOptions = GRADE_OPTIONS.map((g) => ({ value: g, label: g }))

export default function EnrollPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [defaultGrade, setDefaultGrade] = useState('')

  // Read URL params for pre-filled values from assessment (client-side to avoid Suspense boundary)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const grade = params.get('grade')
    if (grade) setDefaultGrade(grade)
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const form = e.currentTarget
    const data = new FormData(form)

    const payload = {
      parent_first_name: data.get('parent_first_name') as string,
      parent_last_name: data.get('parent_last_name') as string,
      email: data.get('email') as string,
      phone: data.get('phone') as string,
      address_line1: data.get('address_line1') as string,
      address_line2: (data.get('address_line2') as string) || '',
      city: data.get('city') as string,
      state: data.get('state') as string,
      zip: data.get('zip') as string,
      student_first_name: data.get('student_first_name') as string,
      student_last_name: data.get('student_last_name') as string,
      student_grade: data.get('student_grade') as string,
      student_dob: data.get('student_dob') as string,
      previous_school: data.get('previous_school') as string,
      ssn_last_four: data.get('ssn_last_four') as string,
      notes: (data.get('notes') as string) || '',
    }

    try {
      const res = await fetch('/api/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Something went wrong')
      }

      const { id: enrollmentId } = await res.json()

      const checkoutRes = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enrollmentId,
          email: payload.email,
          studentName: `${payload.student_first_name} ${payload.student_last_name}`,
          parentName: `${payload.parent_first_name} ${payload.parent_last_name}`,
        }),
      })

      if (!checkoutRes.ok) {
        throw new Error('Failed to start payment')
      }

      const { url } = await checkoutRes.json()
      window.location.href = url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed')
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle className="h-8 w-8 text-emerald-600" />
        </div>
        <h1 className="mt-6 text-3xl font-bold text-gray-900">
          Enrollment Submitted! ✅
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Thank you for enrolling with Larose Christian Academy. Your application
          is being reviewed.
        </p>

        <div className="mt-8 rounded-xl border-2 border-amber-300 bg-amber-50 p-6 text-left">
          <div className="flex items-start gap-3">
            <span className="text-2xl">📋</span>
            <div>
              <h3 className="font-bold text-amber-900">One More Step Required!</h3>
              <p className="mt-2 text-sm text-amber-800">
                You must also complete the <strong>Church / Home School Enrollment Form</strong>
                before your student can begin. This is a state-required form that gives us
                permission to oversee your homeschool records.
              </p>
              <p className="mt-1 text-sm text-amber-700">
                ⏰ Please fill it out within <strong>10 days</strong>.
              </p>
              <a
                href={`/enroll/church-form?enrollment_id=${submitted}&student=${encodeURIComponent(submitted)}`}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all"
              >
                📝 Fill Out Church Enrollment Form
              </a>
            </div>
          </div>
        </div>

        <p className="mt-6 text-sm text-gray-400">
          A confirmation email will be sent within 1-2 business days.
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/30 via-white to-amber-50/20 pb-16">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-amber-900 py-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-emerald-200 backdrop-blur-sm mb-4">
            <GraduationCap className="h-4 w-4" />
            Start Your Journey
          </div>
          <h1 className="text-4xl font-bold text-white font-heading sm:text-5xl">
            Enroll Your Student 🎓
          </h1>
          <p className="mt-4 text-lg text-emerald-100/80 max-w-xl mx-auto">
            Join hundreds of families who homeschool with confidence through Larose Christian Academy.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <p className="mt-4 text-lg text-gray-600">
          Complete the form below to enroll. Your $45/month tuition covers administrative
          services, record-keeping, and legal oversight. Curriculum books are purchased
          separately.
        </p>

        {/* Pricing summary */}
        <Card fun="amber" className="mt-6">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-200 to-amber-100 shadow-sm">
              <CreditCard className="h-6 w-6 text-amber-700" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 flex items-center gap-1">
                $45/month per student — Tuition Only 💰
              </p>
              <p className="text-sm text-gray-600">
                Recurring monthly subscription. Cancel anytime. First payment due at
                enrollment.{' '}
                <strong className="text-amber-700">
                  Curriculum books are not included and must be purchased separately.
                </strong>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Registration Fee Notice */}
        <Card fun="purple" className="mt-4">
          <CardContent className="flex items-start gap-4 p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-200 to-purple-100 shadow-sm">
              <FileText className="h-6 w-6 text-purple-700" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 flex items-center gap-1 flex-wrap">
                📋 One-Time Registration Fee — $75
                <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-700">
                  Due at enrollment
                </span>
              </p>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                A one-time <strong>$75 registration fee</strong> covers the setup
                of your student&apos;s permanent file, official transcript initiation,
                record-keeping system configuration, and initial administrative processing.
                This is a <strong>separate one-time payment</strong> from the $45/month tuition.
                You&apos;ll be able to pay it after your tuition is processed. 💜
              </p>
            </div>
          </CardContent>
        </Card>

        {defaultGrade && (
          <div className="mt-4 rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 p-4 animate-slide-up">
            <p className="text-sm text-amber-800 flex items-center gap-2">
              <span className="text-lg">📋</span>
              <span><span className="font-semibold">Assessment Result:</span> Your student was
              assessed at <strong>{defaultGrade}</strong>. The grade is pre-selected below —
              you can change it if needed.</span>
            </p>
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700 flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-8">
          {/* Parent/Guardian Information */}
          <Card fun="blue">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                👨‍👩‍👧‍👦 Parent / Guardian Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  id="parent_first_name"
                  name="parent_first_name"
                  label="First Name ✏️"
                  required
                  placeholder="Jane"
                />
                <Input
                  id="parent_last_name"
                  name="parent_last_name"
                  label="Last Name ✏️"
                  required
                  placeholder="Smith"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  label="Email Address 📧"
                  required
                  placeholder="jane@example.com"
                />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  label="Phone Number 📞"
                  required
                  placeholder="(555) 123-4567"
                />
              </div>
              <Input
                id="address_line1"
                name="address_line1"
                label="Street Address 🏠"
                required
                placeholder="123 Main Street"
              />
              <Input
                id="address_line2"
                name="address_line2"
                label="Apt / Suite (Optional)"
                placeholder="Apt 4B"
              />
              <div className="grid gap-4 sm:grid-cols-3">
                <Input
                  id="city"
                  name="city"
                  label="City 🏙️"
                  required
                  placeholder="Mobile"
                />
                <Select
                  id="state"
                  name="state"
                  label="State 🗺️"
                  required
                  options={stateOptions}
                  placeholder="Select state"
                />
                <Input
                  id="zip"
                  name="zip"
                  label="ZIP Code 📬"
                  required
                  placeholder="35201"
                />
              </div>
            </CardContent>
          </Card>

          {/* Student Information */}
          <Card fun="green">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📚 Student Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  id="student_first_name"
                  name="student_first_name"
                  label="Student First Name ✏️"
                  required
                  placeholder="John"
                />
                <Input
                  id="student_last_name"
                  name="student_last_name"
                  label="Student Last Name ✏️"
                  required
                  placeholder="Smith"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Select
                  id="student_grade"
                  name="student_grade"
                  label="Grade Level 🎯"
                  required
                  options={gradeOptions}
                  placeholder="Select grade"
                  value={defaultGrade || ''}
                  onChange={(e) => setDefaultGrade(e.target.value)}
                />
                <Input
                  id="student_dob"
                  name="student_dob"
                  type="date"
                  label="Date of Birth 🎂"
                  required
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  id="previous_school"
                  name="previous_school"
                  label="Previous School 🏫"
                  required
                  placeholder="Name of previous school"
                />
                <Input
                  id="ssn_last_four"
                  name="ssn_last_four"
                  label="Last 4 of Student's SSN 🔒"
                  type="password"
                  required
                  maxLength={4}
                  pattern="[0-9]{4}"
                  placeholder="1234"
                />
              </div>
            </CardContent>
          </Card>

          {/* Additional Notes */}
          <Card fun="purple">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                💬 Additional Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700"
              >
                Notes or Questions (Optional)
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-all duration-200 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:shadow-lg focus:shadow-purple-500/10 hover:border-gray-400"
                placeholder="Any questions or additional information... 📝"
              />
            </CardContent>
          </Card>

          {/* Terms */}
          <Card fun="pink">
            <CardContent className="p-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="agree_to_terms"
                  required
                  className="mt-1 h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 transition-all duration-200"
                />
                <span className="text-sm text-gray-600 leading-relaxed">
                  ✅ I confirm that the information provided is accurate. I understand
                  that this enrollment is subject to review and approval by Larose
                  Christian Academy after payment is processed. By enrolling, I agree
                  to the $45/month tuition fee. I understand that curriculum books are not
                  included and must be purchased separately.
                </span>
              </label>
            </CardContent>
          </Card>

          <Button
            type="submit"
            size="lg"
            variant="gold"
            className="w-full text-base shadow-xl shadow-amber-500/20"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">⏳ Processing...</span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Enroll & Pay Tuition — $45/month
              </span>
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
