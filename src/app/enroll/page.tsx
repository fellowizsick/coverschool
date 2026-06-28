'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { ALL_STATES, GRADE_OPTIONS } from '@/lib/constants'
import { CreditCard, CheckCircle } from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'

const stateOptions = ALL_STATES.filter((s) => s.status === 'available').map(
  (s) => ({ value: s.code, label: `${s.name} (${s.code})` })
)

const gradeOptions = GRADE_OPTIONS.map((g) => ({ value: g, label: g }))

export default function EnrollPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
      previous_school: (data.get('previous_school') as string) || '',
      notes: (data.get('notes') as string) || '',
    }

    try {
      // Step 1: Submit enrollment
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

      // Step 2: Create Stripe checkout session
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

      // Step 3: Redirect to Stripe Checkout
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
          Enrollment Submitted!
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Thank you for enrolling with Larose Christian Academy. We will review your
          application and send a confirmation email within 1-2 business days.
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900">
        Enroll Your Student
      </h1>
      <p className="mt-4 text-lg text-gray-600">
        Complete the form below and pay the $25/month tuition to enroll.
      </p>

      {/* Pricing summary */}
      <Card className="mt-6 border-emerald-200 bg-emerald-50">
        <CardContent className="flex items-center gap-4 p-5">
          <CreditCard className="h-8 w-8 text-emerald-600" />
          <div>
            <p className="font-semibold text-gray-900">$25/month per student</p>
            <p className="text-sm text-gray-600">
              Recurring monthly subscription. Cancel anytime. First payment due at
              enrollment.
            </p>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        {/* Parent/Guardian Information */}
        <Card>
          <CardHeader>
            <CardTitle>Parent / Guardian Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                id="parent_first_name"
                name="parent_first_name"
                label="First Name"
                required
                placeholder="Jane"
              />
              <Input
                id="parent_last_name"
                name="parent_last_name"
                label="Last Name"
                required
                placeholder="Smith"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                id="email"
                name="email"
                type="email"
                label="Email Address"
                required
                placeholder="jane@example.com"
              />
              <Input
                id="phone"
                name="phone"
                type="tel"
                label="Phone Number"
                required
                placeholder="(555) 123-4567"
              />
            </div>
            <Input
              id="address_line1"
              name="address_line1"
              label="Street Address"
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
                label="City"
                required
                placeholder="Birmingham"
              />
              <Select
                id="state"
                name="state"
                label="State"
                required
                options={stateOptions}
                placeholder="Select state"
              />
              <Input
                id="zip"
                name="zip"
                label="ZIP Code"
                required
                placeholder="35201"
              />
            </div>
          </CardContent>
        </Card>

        {/* Student Information */}
        <Card>
          <CardHeader>
            <CardTitle>Student Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                id="student_first_name"
                name="student_first_name"
                label="Student First Name"
                required
                placeholder="John"
              />
              <Input
                id="student_last_name"
                name="student_last_name"
                label="Student Last Name"
                required
                placeholder="Smith"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                id="student_grade"
                name="student_grade"
                label="Grade Level"
                required
                options={gradeOptions}
                placeholder="Select grade"
              />
              <Input
                id="student_dob"
                name="student_dob"
                type="date"
                label="Date of Birth"
                required
              />
            </div>
            <Input
              id="previous_school"
              name="previous_school"
              label="Previous School (if applicable)"
              placeholder="Name of previous school"
            />
          </CardContent>
        </Card>

        {/* Additional Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
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
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="Any questions or additional information..."
            />
          </CardContent>
        </Card>

        {/* Terms */}
        <Card>
          <CardContent className="p-6">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                name="agree_to_terms"
                required
                className="mt-1 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm text-gray-600">
                I confirm that the information provided is accurate. I understand
                that this enrollment is subject to review and approval by Larose
                Christian Academy after payment is processed. By enrolling, I agree
                to the $25/month subscription fee.
              </span>
            </label>
          </CardContent>
        </Card>

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? 'Processing...' : 'Enroll & Pay $25/month'}
        </Button>
      </form>
    </div>
  )
}
