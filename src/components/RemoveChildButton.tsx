'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Trash2 } from 'lucide-react'

/**
 * Per-child "Remove Child" button shown in the Parent Portal.
 * Removes ONLY this child from the family's membership:
 * - drops their $45/mo line item from the shared Stripe subscription
 * - siblings keep their own line items and stay active
 */
export default function RemoveChildButton({
  enrollmentId,
  childName,
  alreadyCancelled,
}: {
  enrollmentId: string
  childName: string
  alreadyCancelled?: boolean
}) {
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(alreadyCancelled || false)
  const [error, setError] = useState('')

  async function handleRemove() {
    const ok = confirm(
      `Remove ${childName} from the membership?\n\n` +
      `• ${childName}'s $45/month charge stops\n` +
      `• Your other children stay enrolled and keep their own charges\n` +
      `• This can be undone by re-enrolling ${childName}.\n\n` +
      `Continue?`
    )
    if (!ok) return
    setBusy(true)
    setError('')
    try {
      const res = await fetch('/api/remove-child', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enrollmentId }),
      })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error || 'Failed to remove child')
      setDone(true)
    } catch (e: any) {
      setError(e.message || 'Something went wrong')
    } finally {
      setBusy(false)
    }
  }

  if (done) {
    return (
      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500">
        Child removed — no further charge for this student
      </span>
    )
  }

  return (
    <div className="pt-1">
      <Button
        variant="outline"
        size="sm"
        onClick={handleRemove}
        disabled={busy}
        className="border-red-200 text-red-600 hover:bg-red-50"
      >
        <Trash2 className="mr-1 h-3.5 w-3.5" />
        {busy ? 'Removing…' : 'Remove Child'}
      </Button>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}
