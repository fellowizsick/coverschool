'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'

/**
 * "Finish Enrollment" button — for families who completed the enrollment +
 * church form but never paid (or abandoned at checkout). Lets them resume
 * payment ANY time from the parent portal — no agent-issued links needed.
 * Calls the same create-checkout API as the enroll flow.
 */
export default function FinishPaymentButton({
  enrollmentId,
  email,
}: {
  enrollmentId: string
  email: string
}) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function pay(billing: 'monthly' | 'yearly') {
    setBusy(true)
    setError('')
    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enrollmentId, email, billing }),
      })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error || 'Could not start payment')
      window.location.href = d.url
    } catch (e: any) {
      setError(e.message || 'Something went wrong')
      setBusy(false)
    }
  }

  return (
    <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-3">
      <p className="mb-2 text-xs font-semibold text-amber-800">
        ⏳ Your enrollment is ready — just finish payment:
      </p>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="gold"
          size="sm"
          onClick={() => pay('monthly')}
          disabled={busy}
        >
          {busy ? 'Opening…' : '💳 Finish Enrollment — $45/mo'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => pay('yearly')}
          disabled={busy}
          className="border-amber-300 text-amber-700 hover:bg-amber-50"
        >
          $450/yr
        </Button>
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}
