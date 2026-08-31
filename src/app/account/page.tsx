'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { AlertCircle, CheckCircle2, KeyRound, Loader2, Lock, Mail, RefreshCw, ShieldCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Flow = 'setup' | 'change' | 'recover' | 'reset'

function AccountForm() {
  const params = useSearchParams()
  const router = useRouter()
  const [flow, setFlow] = useState<Flow>('setup')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Email for requesting the reset link
  const [email, setEmail] = useState('')

  // New password fields (reset flow — after clicking the emailed link)
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')

  useEffect(() => {
    const tab = params.get('tab')
    if (tab === 'change' || tab === 'recover' || tab === 'reset') {
      setFlow(tab)
    }
  }, [params])

  function reset() {
    setStatus('idle')
    setError('')
    setSuccess('')
    setEmail('')
    setPassword('')
    setPassword2('')
  }

  function switchFlow(f: Flow) {
    setFlow(f)
    reset()
  }

  // Step 1 (setup/change/recover): request the email link
  async function handleRequestLink(e: React.FormEvent) {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.')
      return
    }
    setStatus('loading')
    setError('')
    setSuccess('')
    try {
      const res = await fetch('/api/send-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        setStatus('error')
        setError(data?.error || 'Something went wrong.')
        return
      }
      setStatus('done')
      setSuccess(`If we have a family on file for ${email}, a secure link is on its way. Check your inbox (and spam folder) — it expires in 1 hour.`)
    } catch {
      setStatus('error')
      setError('Network error. Please try again.')
    }
  }

  // Step 2 (reset flow): set the new password with the verified session
  async function handleSetPassword(e: React.FormEvent) {
    e.preventDefault()
    if (password !== password2) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setStatus('loading')
    setError('')
    setSuccess('')
    try {
      const supabase = createClient()
      const { error: updErr } = await supabase.auth.updateUser({ password })
      if (updErr) {
        setStatus('error')
        setError(updErr.message || 'Could not update the password.')
        return
      }
      setStatus('done')
      setSuccess('Password updated! You can now sign in with your new password.')
    } catch {
      setStatus('error')
      setError('Network error. Please try again.')
    }
  }

  const requestLinkForm = (title: string, description: string, buttonLabel: string) => (
    <form onSubmit={handleRequestLink} className="mt-6 space-y-4">
      <div className="rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800">{description}</div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Email used to enroll</label>
        <input
          type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
          placeholder="you@email.com"
          className="w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-900 focus:border-emerald-500 focus:outline-none"
        />
      </div>
      {error && <p className="flex items-start gap-2 text-sm font-medium text-red-600"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {error}</p>}
      {success && <p className="flex items-start gap-2 text-sm font-medium text-emerald-700"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> {success}</p>}
      <button
        type="submit" disabled={status === 'loading'}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
      >
        {status === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
        {buttonLabel}
      </button>
    </form>
  )

  const resetForm = (
    <form onSubmit={handleSetPassword} className="mt-6 space-y-4">
      <div className="rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800">
        You clicked the secure link from your email — you&apos;re verified. Choose your new password.
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">New password</label>
        <input
          type="password" value={password} onChange={(e) => setPassword(e.target.value)}
          minLength={8} required placeholder="At least 8 characters"
          className="w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-900 focus:border-emerald-500 focus:outline-none"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Confirm new password</label>
        <input
          type="password" value={password2} onChange={(e) => setPassword2(e.target.value)}
          minLength={8} required
          className="w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-900 focus:border-emerald-500 focus:outline-none"
        />
      </div>
      {error && <p className="flex items-start gap-2 text-sm font-medium text-red-600"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {error}</p>}
      {success && <p className="flex items-start gap-2 text-sm font-medium text-emerald-700"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> {success}</p>}
      <button
        type="submit" disabled={status === 'loading'}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
      >
        {status === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
        Save New Password
      </button>
      {status === 'done' && (
        <button
          onClick={() => router.push('/login')}
          className="block w-full text-center text-sm font-semibold text-emerald-700 underline"
        >
          Go to Sign In →
        </button>
      )}
    </form>
  )

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-emerald-50/60 to-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md">
        <Link href="/" className="mb-6 inline-block text-sm font-medium text-emerald-700 hover:text-emerald-800">
          ← Back to home
        </Link>

        <div className="rounded-3xl border-2 border-emerald-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3">
            <KeyRound className="h-8 w-8 text-emerald-600" />
            <h1 className="text-2xl font-bold text-gray-900">Account Access</h1>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Set up or reset the password for your family&apos;s parent portal login. For security,
            we email you a secure link — the link is the only way to change your password.
          </p>

          {/* Flow tabs */}
          <div className="mt-6 grid grid-cols-3 gap-2 rounded-xl bg-gray-100 p-1">
            <button
              onClick={() => switchFlow('setup')}
              className={`rounded-lg px-2 py-2 text-xs font-semibold ${flow === 'setup' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Set Password
            </button>
            <button
              onClick={() => switchFlow('change')}
              className={`rounded-lg px-2 py-2 text-xs font-semibold ${flow === 'change' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Change Password
            </button>
            <button
              onClick={() => switchFlow('recover')}
              className={`rounded-lg px-2 py-2 text-xs font-semibold ${flow === 'recover' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Recover Account
            </button>
          </div>

          {flow === 'setup' && requestLinkForm(
            'Set Password',
            'First time logging in? Enter the email you enrolled with and we\'ll email you a secure link to create your portal password.',
            'Email Me a Link'
          )}

          {flow === 'change' && requestLinkForm(
            'Change Password',
            'Want to change your password? We\'ll email a secure link to your enrolled email — the link takes you to the password change page.',
            'Email Me a Link'
          )}

          {flow === 'recover' && requestLinkForm(
            'Recover Account',
            'Lost access? Enter your enrolled email and we\'ll email you a secure link to reset your password and get your account back.',
            'Email Me a Reset Link'
          )}

          {flow === 'reset' && resetForm}
        </div>
      </div>
    </div>
  )
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="min-h-[100dvh] bg-gradient-to-b from-emerald-50/60 to-white px-4 py-16 text-center text-gray-500">Loading…</div>}>
      <AccountForm />
    </Suspense>
  )
}
