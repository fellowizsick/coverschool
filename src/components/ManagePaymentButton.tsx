'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'

/**
 * "Manage Payment" button — opens THIS family's Stripe billing portal.
 * 🔒 The API derives the customer from the logged-in session (email-scoped),
 * so a parent can only ever see their own card/billing info. Stripe hosts
 * the page; our code never touches card data.
 */
export default function ManagePaymentButton({ className }: { className?: string }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function openPortal() {
    setBusy(true)
    setError('')
    try {
      const res = await fetch('/api/billing-portal', { method: 'POST' })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error || 'Could not open billing portal')
      window.location.href = d.url
    } catch (e: any) {
      setError(e.message || 'Something went wrong')
      setBusy(false)
    }
  }

  return (
    <div className={className}>
      <Button variant="outline" size="sm" onClick={openPortal} disabled={busy} className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
        {busy ? 'Opening…' : '💳 Manage Payment / Update Card'}
      </Button>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}
