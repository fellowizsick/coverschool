'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Copy, Receipt, ExternalLink, CheckCircle, Users, Loader2 } from 'lucide-react'

type CashLink = {
  id: string
  token: string
  link: string
  email: string
  amountCents: number
  studentCount: number
  notes: string
  created_at: string
  used_at: string | null
}

// Mom/Batman-only cash-enrollment link generator. Cash is LOCAL-ONLY and never
// advertised on the public site — each link is generated here and handed to one
// family privately.
export default function CashPaymentsPage() {
  const [email, setEmail] = useState('')
  const [amount, setAmount] = useState('')
  const [count, setCount] = useState('1')
  const [notes, setNotes] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const [created, setCreated] = useState<CashLink | null>(null)
  const [copied, setCopied] = useState(false)
  const [links, setLinks] = useState<CashLink[]>([])

  async function loadLinks() {
    try {
      const r = await fetch('/api/admin-cash-token/list')
      const d = await r.json()
      if (d.ok) setLinks(d.links || [])
    } catch { /* ignore */ }
  }
  useEffect(() => { loadLinks() }, [])

  async function createLink() {
    setError(''); setCreated(null); setCopied(false)
    const amountCents = Math.round(parseFloat(amount) * 100)
    if (!email || !amountCents || amountCents <= 0) { setError('Enter the parent email and the cash amount.'); return }
    setCreating(true)
    try {
      const r = await fetch('/api/admin-cash-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, amountPaidCents: amountCents, studentCount: count, notes }),
      })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error || 'Failed to create link')
      setCreated(d)
      setEmail(''); setAmount(''); setNotes('')
      loadLinks()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create link')
    } finally {
      setCreating(false)
    }
  }

  function copyLink() {
    if (!created?.link) return
    navigator.clipboard.writeText(created.link).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2000)
    }).catch(() => {})
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Cash Enrollment &amp; Receipts</h2>
        <p className="text-sm text-gray-500">
          For families paying in person. Generate a link, send it to the parent — they enroll
          <strong> without a card</strong>, and a receipt is emailed automatically. Cash is
          never shown on the public site.
        </p>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Receipt className="h-5 w-5 text-emerald-600" /> Generate a Cash-Enrollment Link</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-gray-500">Parent email (receipt goes here)</label>
              <Input type="email" placeholder="parent@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">Cash amount received ($)</label>
              <Input type="number" placeholder="360.00" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">Number of students</label>
              <Input type="number" min="1" value={count} onChange={(e) => setCount(e.target.value)} className="mt-1" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-gray-500">Notes (optional)</label>
              <Input placeholder="e.g. Victoria Clark, 3 students, paid cash" value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-1" />
            </div>
          </div>
          {error && <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{error}</div>}
          <Button className="mt-4" onClick={createLink} disabled={creating}>
            {creating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Receipt className="h-4 w-4 mr-2" />}
            Generate Link
          </Button>

          {created && (
            <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
                <CheckCircle className="h-4 w-4" /> Link ready — send this to the parent
              </div>
              <div className="mt-2 flex items-center gap-2">
                <code className="flex-1 break-all rounded-lg bg-white px-3 py-2 text-xs text-gray-700">{created.link}</code>
                <Button size="sm" variant="outline" onClick={copyLink} className="shrink-0">
                  <Copy className="h-4 w-4 mr-1" /> {copied ? 'Copied' : 'Copy'}
                </Button>
              </div>
              <div className="mt-2 text-xs text-emerald-600">
                ${(created.amountCents / 100).toFixed(2)} · {created.studentCount} student(s) · {created.email}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-gray-600" /> Generated Links</CardTitle></CardHeader>
        <CardContent>
          {links.length === 0 ? (
            <p className="p-4 text-sm text-gray-500">No cash-enrollment links yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50 text-left text-gray-500">
                    <th className="px-3 py-2 font-medium">Email</th>
                    <th className="px-3 py-2 font-medium">Amount</th>
                    <th className="px-3 py-2 font-medium">Students</th>
                    <th className="px-3 py-2 font-medium">Created</th>
                    <th className="px-3 py-2 font-medium">Status</th>
                    <th className="px-3 py-2 font-medium">Link</th>
                  </tr>
                </thead>
                <tbody>
                  {links.map((l) => (
                    <tr key={l.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="px-3 py-2 text-gray-700">{l.email}</td>
                      <td className="px-3 py-2 text-gray-700">${(l.amountCents / 100).toFixed(2)}</td>
                      <td className="px-3 py-2 text-gray-700">{l.studentCount}</td>
                      <td className="px-3 py-2 text-gray-500">{new Date(l.created_at).toLocaleDateString()}</td>
                      <td className="px-3 py-2">
                        {l.used_at
                          ? <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">Used</span>
                          : <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">Open</span>}
                      </td>
                      <td className="px-3 py-2">
                        <a href={l.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-emerald-700 hover:underline">
                          <ExternalLink className="h-3.5 w-3.5" /> open
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <p className="text-xs text-gray-400">
        <Link href="/dashboard" className="text-emerald-600 hover:underline">← Back to dashboard</Link>
      </p>
    </div>
  )
}
