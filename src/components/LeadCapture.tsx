'use client'

import { useState } from 'react'
import { Download, CheckCircle2, Loader2 } from 'lucide-react'

/**
 * LeadCapture — "Download the [State] withdrawal checklist" email capture.
 * Saves the parent's email to Supabase (api/capture-lead) and reveals the
 * state withdrawal checklist inline on success. Built 2026-08-05 per Jonathan:
 * convert the law-guide readers we already get instead of chasing new traffic.
 * The checklist is REAL content (built from the state law data) — shown
 * instantly after the email is captured, no email-delivery dependency.
 */
export default function LeadCapture({
  stateName,
  stateCode,
  checklist,
}: {
  stateName: string
  stateCode: string
  checklist: { title: string; items: string[] }[]
}) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('loading')
    setError('')
    try {
      const res = await fetch('/api/capture-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), stateCode, source: 'homeschool-law' }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        setStatus('error')
        setError(data?.error || 'Something went wrong. Please try again.')
        return
      }
      setStatus('done')
    } catch {
      setStatus('error')
      setError('Network error. Please try again.')
    }
  }

  if (status === 'done') {
    return (
      <div className="rounded-3xl border-2 border-emerald-200 bg-emerald-50 p-8">
        <div className="flex items-start gap-4">
          <CheckCircle2 className="mt-1 h-8 w-8 shrink-0 text-emerald-600" />
          <div>
            <h3 className="text-xl font-bold text-emerald-900">
              Here's your {stateName} withdrawal checklist 📋
            </h3>
            <p className="mt-2 text-emerald-800">
              Print it or save it — this is the exact order of operations to switch your child
              to homeschooling in {stateName} without leaving a gap in legal coverage.
            </p>
          </div>
        </div>
        <div className="mt-6 space-y-5">
          {checklist.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold text-emerald-900">{section.title}</h4>
              <ul className="mt-2 space-y-2">
                {section.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-emerald-800">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                      {i + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => window.print()}
            className="rounded-xl bg-emerald-600 px-5 py-2.5 font-semibold text-white hover:bg-emerald-700"
          >
            Print Checklist
          </button>
          <a
            href="/enroll"
            className="rounded-xl border-2 border-emerald-600 px-5 py-2.5 font-semibold text-emerald-700 hover:bg-emerald-100"
          >
            See How Enrollment Works →
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-3xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-8">
      <div className="flex items-start gap-4">
        <div className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
          <Download className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            Free: the {stateName} Withdrawal Checklist
          </h3>
          <p className="mt-2 text-gray-700">
            Exactly what to do (and in what order) to switch your child to homeschooling in{' '}
            {stateName} — without accidentally creating an unexcused-absence problem. No spam,
            unsubscribe anytime.
          </p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
        />
        <button
          type="submit"
          disabled={status === 'loading' || !email.trim()}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-3 font-semibold text-white hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" /> Sending…
            </>
          ) : (
            <>
              Send Me the Checklist
            </>
          )}
        </button>
      </form>
      {status === 'error' && <p className="mt-3 text-sm font-medium text-red-600">{error}</p>}
      <p className="mt-3 text-xs text-gray-500">
        We'll email you the checklist once. Your email is only used for this — no spam.
      </p>
    </div>
  )
}
