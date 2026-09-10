'use client'

import { useState } from 'react'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'

/**
 * Clickable PAID / NOT PAID pill.
 *
 * Jonathan: "They all need to have like paid and not paid next to them and like green and red…
 * we need to be able to click it… that way if somebody does pay cash, we can just approve them
 * right there."
 *
 * Green = money received (card OR cash). Red = not paid. Clicking flips it immediately, so the
 * office can mark a cash payment the moment it's handed over — no form, no reload.
 */
export default function PaidToggle({
  enrollmentId,
  paid,
  paymentMethod,
  onChanged,
  size = 'md',
}: {
  enrollmentId: string
  paid: boolean
  paymentMethod?: string | null
  onChanged?: (nowPaid: boolean) => void
  size?: 'sm' | 'md'
}) {
  const [isPaid, setIsPaid] = useState(paid)
  const [busy, setBusy] = useState(false)

  async function toggle() {
    const next = !isPaid

    // Turning OFF a real card subscription doesn't stop Stripe charging — make that explicit.
    if (!next && paymentMethod === 'card') {
      const go = window.confirm(
        'This student pays by CARD.\n\n' +
        'Marking them NOT PAID here does not cancel their Stripe subscription — the card will ' +
        'keep being charged.\n\nMark as not paid anyway?'
      )
      if (!go) return
    }

    setBusy(true)
    const prev = isPaid
    setIsPaid(next)                       // optimistic — feels instant
    try {
      const res = await fetch('/api/admin-set-paid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enrollmentId, paid: next }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Could not update')
      if (data.warning) window.alert(data.warning)
      onChanged?.(next)
    } catch {
      setIsPaid(prev)                     // put it back — never lie about money state
      window.alert('Could not save that change. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  const pad = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      title={isPaid ? 'Paid — click to mark NOT paid' : 'Not paid — click to mark PAID'}
      aria-pressed={isPaid}
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full font-semibold transition
        disabled:opacity-60 ${pad} ${
        isPaid
          ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
          : 'bg-red-100 text-red-700 hover:bg-red-200'
      }`}
    >
      {busy ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : isPaid ? (
        <CheckCircle2 className="h-3.5 w-3.5" />
      ) : (
        <XCircle className="h-3.5 w-3.5" />
      )}
      <span className="whitespace-nowrap">
        {isPaid ? (paymentMethod === 'cash' ? 'PAID · CASH' : 'PAID') : 'NOT PAID'}
      </span>
    </button>
  )
}
