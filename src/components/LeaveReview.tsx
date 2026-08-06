'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { CheckCircle2, Loader2, MessageSquareHeart, Star, X } from 'lucide-react'

interface ApprovedStudent {
  id: string
  name: string
}

interface LeaveReviewProps {
  /** Approved (paying) students — the review button only shows when non-empty. */
  approvedStudents?: ApprovedStudent[]
}

type Status = 'idle' | 'sending' | 'success' | 'error'

export default function LeaveReview({ approvedStudents }: LeaveReviewProps) {
  const [open, setOpen] = useState(false)
  // Verification: how we confirm this is a real enrolled family.
  const [email, setEmail] = useState('')
  const [studentFirst, setStudentFirst] = useState('')
  const [studentLast, setStudentLast] = useState('')
  const [pin, setPin] = useState('')
  // Review content
  const [name, setName] = useState('')
  const [state, setState] = useState('')
  const [rating, setRating] = useState(5)
  const [quote, setQuote] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  // If no approved students were passed (public page), still show the button —
  // families verify with email + name + PIN instead of a portal session.
  const hasApproved = (approvedStudents?.length ?? 0) > 0

  function reset() {
    setEmail('')
    setStudentFirst('')
    setStudentLast('')
    setPin('')
    setName('')
    setState('')
    setRating(5)
    setQuote('')
    setStatus('idle')
    setError('')
    setMessage('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (quote.trim().length < 20) {
      setError('Please write a short review (at least 20 characters).')
      return
    }
    setStatus('sending')
    setError('')
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          studentFirstName: studentFirst,
          studentLastName: studentLast,
          pin,
          name,
          state,
          rating,
          quote,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        setStatus('error')
        setError(data?.error || 'Something went wrong. Please try again.')
        return
      }
      setStatus('success')
      setMessage(data?.message || 'Thank you!')
    } catch {
      setStatus('error')
      setError('Network error. Please try again.')
    }
  }

  return (
    <>
      <Button size="sm" variant="amber" onClick={() => { reset(); setOpen(true) }}>
        <MessageSquareHeart className="mr-1 h-4 w-4" /> Leave a Review
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Leave a Review</h3>
              <button onClick={() => setOpen(false)} aria-label="Close" className="rounded-lg p-1 text-gray-500 hover:bg-gray-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            {status === 'success' ? (
              <div className="mt-6 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
                <p className="mt-3 font-semibold text-gray-900">{message}</p>
                <p className="mt-1 text-sm text-gray-500">We appreciate your family!</p>
                <Button className="mt-5" onClick={() => setOpen(false)}>Close</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                {!hasApproved && (
                  <div className="rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800">
                    To verify your enrollment, enter the email you used to sign up and the
                    student&apos;s name + PIN (last 4 of SSN) — same as the student login.
                  </div>
                )}

                {/* Verification fields (needed when not signed in via portal) */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-gray-700">Email used to enroll</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@email.com"
                      required
                      className="w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-900 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Student first name</label>
                    <input
                      value={studentFirst}
                      onChange={(e) => setStudentFirst(e.target.value)}
                      placeholder="First name"
                      required
                      className="w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-900 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Student last name</label>
                    <input
                      value={studentLast}
                      onChange={(e) => setStudentLast(e.target.value)}
                      placeholder="Last name"
                      required
                      className="w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-900 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-gray-700">PIN (last 4 of student&apos;s SSN)</label>
                    <input
                      value={pin}
                      onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="4 digits"
                      inputMode="numeric"
                      required
                      className="w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-900 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Show name as</label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Marie"
                      maxLength={60}
                      className="w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-900 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">State</label>
                    <input
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="e.g. Alabama"
                      maxLength={30}
                      className="w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-900 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Rating</label>
                  <div className="flex items-center gap-1 pt-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setRating(n)}
                        aria-label={`${n} stars`}
                        className={n <= rating ? 'text-amber-400' : 'text-gray-300'}
                      >
                        <Star className="h-6 w-6 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Your review</label>
                  <textarea
                    value={quote}
                    onChange={(e) => setQuote(e.target.value)}
                    rows={4}
                    maxLength={600}
                    placeholder="Share how LCA helped your family — what you value most..."
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-900 focus:border-amber-500 focus:outline-none"
                  />
                  <p className="mt-1 text-right text-xs text-gray-400">{quote.length}/600</p>
                </div>
                <p className="text-xs text-gray-500">
                  Please keep it respectful — reviews that aren&apos;t kind or appropriate won&apos;t be published.
                </p>
                {error && <p className="text-sm font-medium text-red-600">{error}</p>}
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={status === 'sending'}>
                    {status === 'sending' ? (
                      <>
                        <Loader2 className="mr-1 h-4 w-4 animate-spin" /> Submitting…
                      </>
                    ) : (
                      'Submit Review'
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
