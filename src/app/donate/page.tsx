'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Heart, Sparkles, GraduationCap, BookOpen, ShieldCheck, Loader2, ArrowRight, Home, Users } from 'lucide-react'
import Link from 'next/link'

const PRESET_AMOUNTS = [25, 50, 100, 250]

export default function DonatePage() {
  const [amount, setAmount] = useState<number | ''>(50)
  const [custom, setCustom] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function selectPreset(value: number) {
    setAmount(value)
    setCustom('')
  }

  function handleCustom(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value.replace(/[^\d.]/g, '')
    setCustom(v)
    if (v) setAmount(parseFloat(v) || '')
  }

  async function handleDonate(e: React.FormEvent) {
    e.preventDefault()
    const amt = typeof amount === 'number' && amount > 0 ? amount : parseFloat(custom)
    if (!amt || amt < 1 || amt > 10000) {
      setError('Please choose an amount between $1 and $10,000.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/create-donation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amt, email: email || undefined, name: name || undefined, message: message || undefined }),
      })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error || 'Something went wrong')
      window.location.href = d.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start donation')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/30 via-white to-rose-50/20 pb-20">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-rose-900 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-rose-400/20 via-transparent to-transparent" />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-emerald-200 backdrop-blur-sm mb-5">
            <Heart className="h-4 w-4 text-rose-300" />
            Support Homeschool Families
          </div>
          <h1 className="text-4xl font-bold text-white font-heading sm:text-5xl md:text-6xl">
            Give the Gift of <span className="bg-gradient-to-r from-amber-300 via-rose-300 to-emerald-300 bg-clip-text text-transparent">Education</span> 🎓
          </h1>
          <p className="mt-5 text-lg text-emerald-100/85 max-w-2xl mx-auto leading-relaxed">
            Your donation helps Larose Christian Academy provide affordable legal oversight,
            record-keeping, and support so families can homeschool with confidence —
            regardless of their circumstances.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        {/* Impact cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card fun="green" className="shadow-xl shadow-emerald-900/5">
            <CardContent className="p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-200 to-emerald-100">
                <Home className="h-6 w-6 text-emerald-700" />
              </div>
              <h3 className="mt-3 font-semibold text-gray-900">Families Served</h3>
              <p className="mt-1 text-sm text-gray-500">Helping homeschool families in Alabama, Florida, Georgia, Indiana, Mississippi, Missouri, Oklahoma, South Carolina, and Texas stay compliant with church school law.</p>
            </CardContent>
          </Card>
          <Card fun="amber" className="shadow-xl shadow-amber-900/5">
            <CardContent className="p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-200 to-amber-100">
                <BookOpen className="h-6 w-6 text-amber-700" />
              </div>
              <h3 className="mt-3 font-semibold text-gray-900">Record-Keeping</h3>
              <p className="mt-1 text-sm text-gray-500">Official transcripts, report cards, and student files maintained with care.</p>
            </CardContent>
          </Card>
          <Card fun="rose" className="shadow-xl shadow-rose-900/5">
            <CardContent className="p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-200 to-rose-100">
                <ShieldCheck className="h-6 w-6 text-rose-700" />
              </div>
              <h3 className="mt-3 font-semibold text-gray-900">Legal Oversight</h3>
              <p className="mt-1 text-sm text-gray-500">Peace of mind for parents — the legal side handled so they can focus on teaching.</p>
            </CardContent>
          </Card>
        </div>

        {/* Donation form */}
        <Card className="mt-8 shadow-2xl shadow-emerald-900/10 border-2 border-emerald-100">
          <CardContent className="p-8 sm:p-10">
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-rose-100 to-emerald-100">
                <Heart className="h-7 w-7 text-rose-600" />
              </div>
              <h2 className="mt-4 text-2xl font-bold text-gray-900 font-heading">Make a Donation</h2>
              <p className="mt-2 text-gray-600">Every gift — no matter the size — makes a difference. 💚</p>
            </div>

            <form onSubmit={handleDonate} className="mt-8 space-y-6">
              {/* Preset amounts */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Choose an amount</label>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {PRESET_AMOUNTS.map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => selectPreset(a)}
                      className={`rounded-2xl border-2 py-4 text-lg font-bold transition-all duration-200 ${
                        amount === a
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-lg shadow-emerald-500/10 scale-[1.03]'
                          : 'border-gray-200 text-gray-700 hover:border-emerald-300 hover:bg-emerald-50/50'
                      }`}
                    >
                      ${a}
                    </button>
                  ))}
                </div>
                {/* Custom amount */}
                <div className="mt-3">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-gray-400">$</span>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={custom}
                      onChange={handleCustom}
                      placeholder="Custom amount"
                      className="w-full rounded-2xl border-2 border-gray-200 py-3.5 pl-9 pr-4 text-lg font-semibold text-gray-800 placeholder:font-normal placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Donor info */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="donor_name" className="block text-sm font-semibold text-gray-700 mb-1">Your Name (optional)</label>
                  <input
                    id="donor_name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="donor_email" className="block text-sm font-semibold text-gray-700 mb-1">Email (optional — for receipt)</label>
                  <input
                    id="donor_email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="donor_message" className="block text-sm font-semibold text-gray-700 mb-1">A note of encouragement (optional)</label>
                <textarea
                  id="donor_message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  maxLength={500}
                  placeholder="Tell us why you're supporting homeschool education..."
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700 flex items-center gap-2">
                  <span>⚠️</span> {error}
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                variant="gold"
                disabled={loading}
                className="w-full text-base shadow-xl shadow-amber-500/20"
              >
                {loading ? (
                  <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Opening secure checkout...</span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Donate {typeof amount === 'number' && amount > 0 ? `$${amount}` : ''}
                    <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>

              <p className="flex items-center justify-center gap-1.5 text-center text-xs text-gray-400">
                <Sparkles className="h-3.5 w-3.5" />
                Secure payment powered by Stripe. Larose Christian Academy is an Alabama church school (a 501(c)(3)-style ministry serving homeschool families).
              </p>
            </form>
          </CardContent>
        </Card>

        {/* Why donate */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 font-heading">Why Your Gift Matters</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Card>
              <CardContent className="p-6 text-left">
                <div className="flex items-center gap-3">
                  <GraduationCap className="h-6 w-6 text-emerald-600 shrink-0" />
                  <h3 className="font-semibold text-gray-900">Lower Tuition for Families</h3>
                </div>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  Donations help keep tuition affordable, so more families can give their children a
                  homeschool education without financial strain.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-left">
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-rose-600 shrink-0" />
                  <h3 className="font-semibold text-gray-900">Support for Every Family</h3>
                </div>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  Some families need extra help during hard seasons. Donations let us support them
                  so no child misses out on the blessing of homeschooling.
                </p>
              </CardContent>
            </Card>
          </div>

          <Link href="/" className="mt-10 inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
