'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, BookOpen, ArrowRight, ShoppingCart, Sparkles, Heart, FileText, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { CURRICULUM_BOOKS_URL, PAPERWORK_FEE_NOTE } from '@/lib/constants'

export default function EnrollSuccessPage() {
  const [registrationStatus, setRegistrationStatus] = useState<'pending' | 'loading' | 'paid'>(
    // Check if they already paid via the URL param
    typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('paperwork') === 'paid'
      ? 'paid'
      : 'pending'
  )
  const [registrationError, setRegistrationError] = useState('')

  // Check if paperwork was paid on page load (from URL redirect back)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('paperwork') === 'paid') {
      setRegistrationStatus('paid')
      // Save to localStorage so it persists
      const eid = params.get('session_id') || 'enrollment_' + Date.now()
      try {
        localStorage.setItem('paperwork_paid_' + eid, 'true')
      } catch (e) {}
    }
  }, [])

  const handlePayRegistration = async () => {
    setRegistrationStatus('loading')
    setRegistrationError('')

    try {
      // Get session_id from URL
      const params = new URLSearchParams(window.location.search)
      const sessionId = params.get('session_id') || ''
      const enrollmentId = `enrollment_${Date.now()}` // fallback ID

      const res = await fetch('/api/pay-paperwork', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enrollmentId,
          email: '', // Will be populated from session
          studentName: 'Your Student',
          parentName: 'Family',
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Payment failed')
      }

      const { url } = await res.json()
      window.location.href = url
    } catch (err) {
      setRegistrationError(err instanceof Error ? err.message : 'Something went wrong')
      setRegistrationStatus('pending')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/30 via-white to-pink-50/20">
      {/* Confetti-like decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
        {['🟢', '🟡', '🟣', '🔵', '🟠', '💚', '💛', '💜', '💙', '🧡'].map((emoji, i) => (
          <span
            key={i}
            className="absolute text-2xl animate-float"
            style={{
              left: `${10 + i * 9}%`,
              top: `${10 + (i * 7) % 70}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${4 + (i % 3)}s`,
            }}
          >
            {emoji}
          </span>
        ))}
      </div>

      <div className="relative mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Welcome */}
        <div className="text-center animate-slide-up">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 via-emerald-50 to-amber-100 shadow-lg shadow-emerald-900/10 animate-bounce-soft">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-inner">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="mt-6 text-4xl font-bold text-gray-900 font-heading">
            Welcome to Larose Christian Academy! 🎉
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-md mx-auto">
            Your enrollment is confirmed and your $45/month tuition has been processed.
            You&apos;ll receive a confirmation email shortly. 📧
          </p>
          <div className="flex justify-center gap-1 mt-2">
            {['🌟', '✨', '🎓', '✨', '🌟'].map((s, i) => (
              <span key={i} className="text-sm animate-bounce-soft" style={{ animationDelay: `${i * 0.2}s` }}>
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* ===== REGISTRATION FEE CARD ===== */}
        <Card
          fun={registrationStatus === 'paid' ? 'green' : 'purple'}
          className={`mt-8 animate-on-scroll border-2 ${
            registrationStatus === 'paid'
              ? 'border-emerald-300'
              : 'border-purple-200'
          }`}
        >
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl shadow-sm animate-wiggle ${
                registrationStatus === 'paid'
                  ? 'bg-gradient-to-br from-emerald-200 to-emerald-100'
                  : 'bg-gradient-to-br from-purple-200 to-purple-100'
              }`}>
                <FileText className={`h-7 w-7 ${
                  registrationStatus === 'paid' ? 'text-emerald-700' : 'text-purple-700'
                }`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className={`text-lg font-semibold flex items-center gap-2 ${
                    registrationStatus === 'paid' ? 'text-emerald-900' : 'text-purple-900'
                  }`}>
                    📋 One-Time Registration Fee
                  </h2>
                  {registrationStatus === 'paid' && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-semibold text-emerald-700">
                      ✅ Paid
                    </span>
                  )}
                  {registrationStatus === 'pending' && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-0.5 text-xs font-semibold text-amber-700">
                      ⏳ Pending
                    </span>
                  )}
                </div>

                <div className="mt-3 text-sm leading-relaxed text-gray-700 space-y-2">
                  <p>
                    <strong>What is the registration fee?</strong> The one-time $75 registration fee
                    covers everything needed to set up your student&apos;s official file:
                  </p>
                  <ul className="space-y-1 text-gray-600 ml-2">
                    <li>📁 • Creating &amp; maintaining your student&apos;s permanent file</li>
                    <li>📄 • Initializing official transcript records</li>
                    <li>⚙️ • Configuring the record-keeping system for your family</li>
                    <li>🔍 • Administrative processing &amp; file verification</li>
                    <li>📬 • Mailing of enrollment confirmation packet</li>
                  </ul>
                  <p className="text-xs text-gray-500 mt-2 italic">
                    {PAPERWORK_FEE_NOTE}
                  </p>
                </div>

                <div className="mt-4">
                  {registrationStatus === 'paid' ? (
                    <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-800">
                      <p className="font-medium">✅ Registration fee paid!</p>
                      <p className="mt-1 text-emerald-700">Your student file is being set up. We&apos;ll notify you once everything is ready.</p>
                    </div>
                  ) : registrationStatus === 'loading' ? (
                    <Button disabled size="lg" variant="purple" className="w-full sm:w-auto">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <Button size="lg" variant="purple" onClick={handlePayRegistration}>
                        💳 Pay $75 Registration Fee Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                      <p className="text-xs text-gray-400">
                        One-time payment. You can also pay this later from the Parent Portal.
                      </p>
                      {registrationError && (
                        <p className="text-sm text-red-600 flex items-center gap-1 mt-2">
                          ⚠️ {registrationError}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ===== CHURCH ENROLLMENT FORM ===== */}
        <Card fun="amber" className="mt-6 animate-on-scroll border-2 border-amber-300">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-200 to-amber-100 shadow-sm animate-wiggle">
                <FileText className="h-7 w-7 text-amber-700" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-semibold text-amber-900 flex items-center gap-2">
                    📋 Church / Home School Enrollment Form
                  </h2>
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-0.5 text-xs font-semibold text-red-700 animate-pulse">
                    ⏰ Required
                  </span>
                </div>
                <p className="mt-2 text-sm text-amber-800 leading-relaxed">
                  <strong>This is a state-required form</strong> that must be completed before
                  your student can begin. It gives us permission to oversee your homeschool
                  records and notify the public school district if needed.
                </p>
                <div className="mt-3 rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
                  <p>⏱️ <strong>Due within 10 days</strong> of enrollment. Your student cannot
                  start until this form is submitted.</p>
                </div>
                <a
                  href="/enroll/church-form"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-500/30 transition-all hover:shadow-xl hover:shadow-amber-500/40 hover:-translate-y-0.5"
                >
                  📝 Fill Out Church Enrollment Form
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Curriculum Card */}
        <Card fun="amber" className="mt-6 animate-on-scroll">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-200 to-amber-100 shadow-sm animate-wiggle">
                <BookOpen className="h-7 w-7 text-amber-700" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-amber-900 flex items-center gap-2">
                  📚 Purchase Your Curriculum Books
                </h2>
                <p className="mt-2 text-sm text-amber-800 leading-relaxed">
                  Your $45/month tuition covers administrative services, record-keeping, and
                  legal oversight. <strong>Curriculum books are not included</strong> and need
                  to be purchased separately.
                </p>
                <p className="mt-2 text-sm text-amber-800 leading-relaxed">
                  We recommend <strong>ACE PACE</strong> curriculum sets from Christianbook.com.
                  Visit the link below to find the correct grade-level set for your student. 📖
                </p>
                <a
                  href={CURRICULUM_BOOKS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-500/30 transition-all hover:shadow-xl hover:shadow-amber-500/40 hover:-translate-y-0.5 active:translate-y-0"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Shop Curriculum Books
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <div className="mt-10 grid gap-4 sm:grid-cols-4 animate-on-scroll">
          {[
            { num: '📧', title: 'Check Email', desc: 'Look for your enrollment confirmation in your inbox' },
            { num: '📋', title: 'Reg Fee', desc: 'Complete the $75 registration fee', highlight: registrationStatus !== 'paid' },
            { num: '📝', title: 'Church Form', desc: 'Submit church enrollment form (required)', highlight: true },
            { num: '📚', title: 'Buy Books', desc: 'Purchase ACE PACE curriculum' },
          ].map((step, i) => (
            <div
              key={i}
              className={`rounded-2xl border p-5 text-center shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                step.highlight
                  ? 'border-purple-200 bg-gradient-to-b from-purple-50 to-white'
                  : 'border-gray-100 bg-white'
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <span className="text-3xl">{step.num}</span>
              <h3 className="mt-2 text-sm font-semibold text-gray-900">{step.title}</h3>
              <p className="mt-1 text-xs text-gray-500">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Login Link */}
        <div className="mt-10 text-center animate-on-scroll">
          <Link href="/login">
            <Button variant="fun" size="lg">
              <Sparkles className="mr-2 h-4 w-4" />
              Go to Parent Portal
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Encouraging message */}
        <div className="mt-12 text-center animate-on-scroll">
          <p className="text-sm text-gray-400 flex items-center justify-center gap-1">
            Made with <Heart className="h-3 w-3 text-red-400 fill-red-400/30" /> for your family&apos;s homeschool journey
          </p>
        </div>
      </div>
    </div>
  )
}
