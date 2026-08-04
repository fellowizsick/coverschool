'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { ALL_STATES, GRADE_OPTIONS } from '@/lib/constants'
import { CreditCard, CheckCircle, Sparkles, GraduationCap, FileText, Plus, Trash2, UserPlus } from 'lucide-react'

const stateOptions = ALL_STATES.filter((s) => s.status === 'available').map(
  (s) => ({ value: s.code, label: `${s.name} (${s.code})` })
)

const gradeOptions = GRADE_OPTIONS.map((g) => ({ value: g, label: g }))

type StudentForm = {
  first: string
  last: string
  grade: string
  dob: string
  prevSchoolChoice: string
  prevSchoolName: string
  ssn: string
}

const emptyStudent = (): StudentForm => ({
  first: '',
  last: '',
  grade: '',
  dob: '',
  prevSchoolChoice: '',
  prevSchoolName: '',
  ssn: '',
})

export default function EnrollPage() {
  const [submitted, setSubmitted] = useState<string | null>(null)
  const [submittedStudents, setSubmittedStudents] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [defaultGrade, setDefaultGrade] = useState('')
  const [billingMode, setBillingMode] = useState('monthly')
  const [defaultReferral, setDefaultReferral] = useState('')
  const [students, setStudents] = useState<StudentForm[]>([emptyStudent()])

  // Read URL params for pre-filled grade + referral code (client-side to avoid Suspense boundary)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const grade = params.get('grade')
    if (grade) setDefaultGrade(grade)
    const ref = params.get('ref')
    if (ref) setDefaultReferral(ref.toUpperCase())
  }, [])

  // Apply the URL grade to the first student block once
  useEffect(() => {
    if (defaultGrade) {
      setStudents((prev) =>
        prev.map((s, i) => (i === 0 && !s.grade ? { ...s, grade: defaultGrade } : s))
      )
    }
  }, [defaultGrade])

  function updateStudent(index: number, field: keyof StudentForm, value: string) {
    setStudents((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)))
  }

  function addStudent() {
    setStudents((prev) => [...prev, emptyStudent()])
  }

  function removeStudent(index: number) {
    setStudents((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)))
  }

  const studentCount = students.length
  const perStudentPrice = billingMode === 'yearly' ? 525 : 120
  const totalDisplay = studentCount === 1
    ? `$${perStudentPrice}`
    : `$${perStudentPrice * studentCount} (${studentCount} children × $${perStudentPrice})`

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const form = e.currentTarget
    const data = new FormData(form)

    // Validate: every student block needs full info
    for (let i = 0; i < students.length; i++) {
      const s = students[i]
      if (!s.first || !s.last || !s.grade || !s.dob || !s.ssn) {
        setError(`Please fill in every field for child #${i + 1}.`)
        setLoading(false)
        return
      }
      if (!/^\d{4}$/.test(s.ssn)) {
        setError(`Child #${i + 1}: SSN last 4 must be exactly 4 digits.`)
        setLoading(false)
        return
      }
    }

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
      students: students.map((s) => ({
        student_first_name: s.first,
        student_last_name: s.last,
        student_grade: s.grade,
        student_dob: s.dob,
        previous_school:
          s.prevSchoolChoice === 'attended' ? s.prevSchoolName || '' : '',
        ssn_last_four: s.ssn,
      })),
      notes: (data.get('notes') as string) || '',
      referred_by_code: (data.get('referral_code') as string) || '',
      agree_to_terms: data.get('agree_to_terms') === 'on',
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

      const { id: enrollmentId, ids } = await res.json()

      const checkoutRes = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enrollmentId,
          email: payload.email,
          studentName: `${payload.students[0].student_first_name} ${payload.students[0].student_last_name}`,
          parentName: `${payload.parent_first_name} ${payload.parent_last_name}`,
          billing: billingMode,
        }),
      })

      if (!checkoutRes.ok) {
        throw new Error('Failed to start payment')
      }

      const { url } = await checkoutRes.json()

      // Remember who we enrolled so the success page can show per-child forms
      const enrolled = students.map((s, i) => ({
        id: ids?.[i] || enrollmentId,
        name: `${s.first} ${s.last}`,
      }))
      try {
        localStorage.setItem('lca_enrolled_children', JSON.stringify(enrolled))
      } catch (e) {}
      setSubmittedStudents(enrolled)

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
                for <strong>each student</strong> before they can begin. This is a state-required
                form that gives us permission to oversee your homeschool records.
              </p>
              <p className="mt-1 text-sm text-amber-700">
                ⏰ Please fill it out within <strong>10 days</strong>.
              </p>
              {submittedStudents.map((s) => (
                <a
                  key={s.id}
                  href={`/enroll/church-form?enrollment_id=${s.id}&student=${encodeURIComponent(s.name)}`}
                  className="mt-3 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all"
                >
                  📝 Church Form for {s.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-6 text-sm text-gray-400">
          A confirmation email will be sent after payment is processed.
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
        <div className="relative mx-auto max-w-[90rem] px-4 text-center sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-emerald-200 backdrop-blur-sm mb-4">
            <GraduationCap className="h-4 w-4" />
            Start Your Journey
          </div>
          <h1 className="text-4xl font-bold text-white font-heading sm:text-5xl">
            Enroll Your Student(s) 🎓
          </h1>
          <p className="mt-4 text-lg text-emerald-100/80 max-w-xl mx-auto">
            Join hundreds of families who homeschool with confidence through Larose Christian Academy.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 relative z-10">
        <p className="mt-4 text-lg text-gray-600">
          Complete the form below to enroll. Your $45/month tuition per student covers administrative
          services, record-keeping, and legal oversight. Free curriculum resources are included.
        </p>

        {/* Pricing summary */}
        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-3 mt-6 mb-2">
          <button
            type="button"
            onClick={() => setBillingMode('monthly')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              billingMode === 'monthly'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            $45/month
          </button>
          <button
            type="button"
            onClick={() => setBillingMode('yearly')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              billingMode === 'yearly'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            $450/year
          </button>
        </div>

        <Card fun="amber" className="mt-4">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-200 to-amber-100 shadow-sm">
              <CreditCard className="h-6 w-6 text-amber-700" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 flex items-center gap-1">
                {billingMode === 'yearly' ? '$525/year per student' : '$45/month per student'} — Tuition + Registration 💰
              </p>
              <p className="text-sm text-gray-600">
                {billingMode === 'yearly'
                  ? 'One payment of $525 covers the full school year ($450 tuition + $75 one-time registration fee). No recurring charges.'
                  : 'First payment: $120 per student ($75 one-time registration fee + $45 first month). Then $45/month per student. Cancel anytime.'}{' '}
                <strong className="text-amber-700">
                  Free curriculum resources included (Khan Academy, Discovery K12, and more).
                </strong>
              </p>
              <p className="mt-1 text-sm font-semibold text-emerald-700">
                Your total today: {studentCount === 1
                  ? (billingMode === 'yearly' ? '$525' : '$120')
                  : (billingMode === 'yearly'
                      ? `$${525 * studentCount} (${studentCount} children × $525)`
                      : `$${120 * studentCount} (${studentCount} children × $120)`)}{' '}
                {studentCount > 1 ? '— one charge per child' : ''}
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
                  Per student, first payment
                </span>
              </p>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                A one-time <strong>$75 registration fee per student</strong> covers the setup
                of each student&apos;s permanent file, official transcript initiation,
                record keeping system configuration, and initial administrative processing.
                It&apos;s included in your <strong>first payment</strong> — no separate checkout needed. 💜
              </p>
            </div>
          </CardContent>
        </Card>

        {/* No Refund Policy */}
        <p className="text-xs text-gray-400 text-center mt-4">
          No refunds. You can cancel your subscription at any time.
        </p>

        {/* Referral Code */}
        <Card fun="amber" className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🎁 Referral Code <span className="text-sm font-normal text-gray-400">(optional)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">
              Were you referred by a Larose Christian Academy family? Enter their
              referral code below. When your payment is processed, they&apos;ll earn
              <strong> one month of tuition free</strong> (or $45 off their yearly payment) —
              and you&apos;ll be all set to start! 🎉
            </p>
            <Input
              id="referral_code"
              name="referral_code"
              placeholder="e.g. LCA-K7X2Q"
              value={defaultReferral}
              onChange={(e) => setDefaultReferral(e.target.value.toUpperCase())}
              className="uppercase"
            />
          </CardContent>
        </Card>

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

          {/* Student(s) Information — one block per child */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                📚 Student Information
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                  {studentCount} {studentCount === 1 ? 'student' : 'students'}
                </span>
              </h2>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={addStudent}
                disabled={studentCount >= 6}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" /> Add Child
              </Button>
            </div>

            {students.map((s, i) => (
              <Card key={i} fun="green" className="relative">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <UserPlus className="h-5 w-5 text-emerald-600" />
                      Child #{i + 1}
                    </span>
                    {studentCount > 1 && (
                      <button
                        type="button"
                        onClick={() => removeStudent(i)}
                        className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Remove Child
                      </button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      id={`student_first_name_${i}`}
                      label="Student First Name ✏️"
                      required
                      placeholder="John"
                      value={s.first}
                      onChange={(e) => updateStudent(i, 'first', e.target.value)}
                    />
                    <Input
                      id={`student_last_name_${i}`}
                      label="Student Last Name ✏️"
                      required
                      placeholder="Smith"
                      value={s.last}
                      onChange={(e) => updateStudent(i, 'last', e.target.value)}
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Select
                      id={`student_grade_${i}`}
                      label="Grade Level 🎯"
                      required
                      options={gradeOptions}
                      placeholder="Select grade"
                      value={s.grade}
                      onChange={(e) => updateStudent(i, 'grade', e.target.value)}
                    />
                    <Input
                      id={`student_dob_${i}`}
                      type="date"
                      label="Date of Birth 🎂"
                      required
                      value={s.dob}
                      onChange={(e) => updateStudent(i, 'dob', e.target.value)}
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1">
                      <label htmlFor={`previous_school_${i}`} className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                        Previous School 🏫 <span className="text-gray-400 font-normal">(optional)</span>
                      </label>
                      <Select
                        id={`previous_school_${i}`}
                        placeholder="Select an option"
                        options={[
                          { value: 'none', label: 'No previous school (first-time homeschooler)' },
                          { value: 'attended', label: 'Attended another school' },
                        ]}
                        value={s.prevSchoolChoice}
                        onChange={(e) => updateStudent(i, 'prevSchoolChoice', e.target.value)}
                      />
                      {s.prevSchoolChoice === 'attended' && (
                        <Input
                          id={`previous_school_name_${i}`}
                          label="Name of previous school 🏫"
                          required
                          placeholder="Name of previous school"
                          className="mt-2"
                          value={s.prevSchoolName}
                          onChange={(e) => updateStudent(i, 'prevSchoolName', e.target.value)}
                        />
                      )}
                    </div>
                    <Input
                      id={`ssn_last_four_${i}`}
                      label={`Last 4 of ${s.first ? s.first + "'s" : "Student's"} SSN 🔒`}
                      type="password"
                      required
                      maxLength={4}
                      pattern="[0-9]{4}"
                      placeholder="1234"
                      value={s.ssn}
                      onChange={(e) => updateStudent(i, 'ssn', e.target.value.replace(/\D/g, ''))}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}

            {studentCount < 6 && (
              <Button
                type="button"
                variant="outline"
                onClick={addStudent}
                className="w-full py-6 border-dashed text-emerald-700 hover:bg-emerald-50 flex items-center justify-center gap-2"
              >
                <Plus className="h-5 w-5" /> Add Child
              </Button>
            )}
          </div>

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
                  to the $45/month tuition fee per student plus the $75 one-time
                  registration fee per student (included in the first payment).
                  Free curriculum resources are included with your membership.
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
                Enroll & Pay — {billingMode === 'yearly' ? '$525' : '$120'} per student ({totalDisplay})
              </span>
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
