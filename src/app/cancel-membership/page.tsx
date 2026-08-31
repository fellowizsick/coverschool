'use client'

import { useState } from 'react'
import { Mail, GraduationCap, ArrowLeft, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'

export default function CancelMembershipPage() {
  const [step, setStep] = useState<'email' | 'confirm' | 'done' | 'error'>('email')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [enrollment, setEnrollment] = useState<any>(null)
  const [errorMsg, setErrorMsg] = useState('')

  async function lookupEnrollment() {
    if (!email.trim()) return
    setLoading(true)
    setErrorMsg('')
    try {
      const res = await fetch('/api/lookup-enrollment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Enrollment not found')
      setEnrollment(data)
      setStep('confirm')
    } catch (e: any) {
      setErrorMsg(e.message || 'Could not find an active enrollment with that email.')
    } finally {
      setLoading(false)
    }
  }

  async function handleCancel() {
    setLoading(true)
    setErrorMsg('')
    try {
      const res = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enrollmentId: enrollment.id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to cancel')
      setStep('done')
    } catch (e: any) {
      setErrorMsg(e.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <div className="mx-auto max-w-lg px-4 py-16 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        {step === 'email' && (
          <>
            <div className="text-center mb-8">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <Mail className="h-8 w-8 text-gray-600" />
              </div>
              <h1 className="mt-4 text-2xl font-bold text-gray-900 font-heading">
                Cancel Membership
              </h1>
              <p className="mt-2 text-gray-600">
                Enter the email address you used when enrolling. We&apos;ll look up your account.
              </p>
            </div>

            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && lookupEnrollment()}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-red-400 focus:ring-2 focus:ring-red-100 outline-none transition-all"
                    autoFocus
                  />
                </div>

                {errorMsg && (
                  <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                    <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <Button
                  size="lg"
                  className="w-full"
                  variant="outline"
                  onClick={lookupEnrollment}
                  disabled={loading || !email.trim()}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Looking up...
                    </>
                  ) : (
                    'Find My Membership'
                  )}
                </Button>
              </CardContent>
            </Card>
          </>
        )}

        {step === 'confirm' && enrollment && (
          <>
            <div className="text-center mb-8">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                <GraduationCap className="h-8 w-8 text-red-500" />
              </div>
              <h1 className="mt-4 text-2xl font-bold text-gray-900 font-heading">
                Confirm Cancellation
              </h1>
              <p className="mt-2 text-gray-600">
                We found your membership. Please review and confirm.
              </p>
            </div>

            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Student</span>
                    <span className="font-medium text-gray-900">
                      {enrollment.student_first_name} {enrollment.student_last_name}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Email</span>
                    <span className="font-medium text-gray-900">{enrollment.email}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Status</span>
                    <span className="inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                      Active
                    </span>
                  </div>
                </div>

                <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-800">
                  <p className="font-medium flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    This will cancel your membership immediately
                  </p>
                  <p className="mt-1 text-red-600">
                    Your card will not be charged again. You will keep access through the end
                    of your current billing period. This cannot be undone from this page.
                  </p>
                </div>

                {errorMsg && (
                  <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                    <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="lg"
                    className="flex-1"
                    onClick={() => setStep('email')}
                    disabled={loading}
                  >
                    Go Back
                  </Button>
                  <Button
                    size="lg"
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white border-red-600"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Cancelling...
                      </>
                    ) : (
                      'Cancel Membership'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {step === 'done' && (
          <div className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle className="h-10 w-10 text-emerald-600" />
            </div>
            <h1 className="mt-6 text-2xl font-bold text-gray-900 font-heading">
              Membership Cancelled
            </h1>
            <p className="mt-3 text-gray-600 max-w-sm mx-auto">
              Your membership has been cancelled and your card will not be charged again.
              You&apos;ll receive a confirmation email shortly.
            </p>
            <p className="mt-2 text-gray-500 text-sm max-w-sm mx-auto">
              You are always welcome back. If you ever want to re-enroll, the door is never closed.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link href="/">
                <Button>Return Home</Button>
              </Link>
              <Link href="/enroll">
                <Button variant="outline">Re-Enroll</Button>
              </Link>
            </div>
          </div>
        )}

        {step === 'error' && (
          <div className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-10 w-10 text-red-600" />
            </div>
            <h1 className="mt-6 text-2xl font-bold text-gray-900 font-heading">
              Something Went Wrong
            </h1>
            <p className="mt-3 text-gray-600">{errorMsg}</p>
            <div className="mt-8 flex justify-center gap-4">
              <Button onClick={() => { setStep('email'); setErrorMsg('') }}>
                Try Again
              </Button>
              <Link href="/">
                <Button variant="outline">Return Home</Button>
              </Link>
            </div>
          </div>
        )}

        {/* Footer note */}
        <p className="mt-12 text-center text-xs text-gray-400">
          You can also cancel from the Parent Portal after logging in.
        </p>
      </div>
    </div>
  )
}
