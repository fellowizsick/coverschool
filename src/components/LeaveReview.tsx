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
  approvedStudents: ApprovedStudent[]
}

type Status = 'idle' | 'sending' | 'success' | 'error'

export default function LeaveReview({ approvedStudents }: LeaveReviewProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [state, setState] = useState('')
  const [rating, setRating] = useState(5)
  const [quote, setQuote] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  if (approvedStudents.length === 0) return null

  function reset() {
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
        body: JSON.stringify({ name, state, rating, quote }),
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
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
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
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Your name (shown as First L.)</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Marie"
                    maxLength={60}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-900 focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
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
