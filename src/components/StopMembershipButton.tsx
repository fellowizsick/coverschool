'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'

export default function StopMembershipButton({ enrollmentId, cancelled }: { enrollmentId: string; cancelled?: boolean }) {
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(cancelled || false)
  const [error, setError] = useState('')

  async function handleStop() {
    if (!confirm('Stop membership? Your card will no longer be charged. This cannot be undone from here.')) return
    setBusy(true)
    setError('')
    try {
      const res = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enrollmentId }),
      })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error || 'Failed to cancel')
      setDone(true)
    } catch (e: any) {
      setError(e.message || 'Something went wrong')
    } finally {
      setBusy(false)
    }
  }

  if (done) {
    return <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500">Membership stopped — no further charges</span>
  }

  return (
    <div className="pt-2">
      <Button variant="outline" size="sm" onClick={handleStop} disabled={busy} className="border-red-200 text-red-600 hover:bg-red-50">
        {busy ? 'Stopping…' : 'Stop Membership'}
      </Button>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}
