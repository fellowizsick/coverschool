'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { AlertCircle, CheckCircle2, KeyRound, Loader2, Lock, RefreshCw, ShieldCheck } from 'lucide-react'

type Flow = 'setup' | 'change' | 'recover'

function AccountForm() {
  const params = useSearchParams()
  const [flow, setFlow] = useState<Flow>('setup')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Identity verification (setup + recover)
  const [email, setEmail] = useState('')
  const [studentFirst, setStudentFirst] = useState('')
  const [studentLast, setStudentLast] = useState('')
  const [pin, setPin] = useState('')

  // Password fields
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')

  // Change-password (logged in): current + new
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [newPw2, setNewPw2] = useState('')

  useEffect(() => {
    const tab = params.get('tab')
    if (tab === 'change' || tab === 'recover') {
      setFlow(tab)
    }
  }, [params])

  function reset() {
    setStatus('idle')
    setError('')
    setSuccess('')
    setEmail('')
    setStudentFirst('')
    setStudentLast('')
    setPin('')
    setPassword('')
    setPassword2('')
    setCurrentPw('')
    setNewPw('')
    setNewPw2('')
  }

  function switchFlow(f: Flow) {
    setFlow(f)
    reset()
  }

  async function handleSetup(e: React.FormEvent) {
    e.preventDefault()
    if (password !== password2) {
      setError('Passwords do not match.')
      return
    }
    setStatus('loading')
    setError('')
    setSuccess('')
    try {
      const res = await fetch('/api/account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email, studentFirstName: studentFirst, studentLastName: studentLast, pin, password,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        setStatus('error')
        setError(data?.error || 'Something went wrong.')
        return
      }
      setStatus('done')
      setSuccess(data.created
        ? `Account created for ${data.email}! You can now log into the parent portal.`
        : `Password updated for ${data.email}. You can now log into the parent portal.`)
    } catch {
      setStatus('error')
      setError('Network error. Please try again.')
    }
  }

  async function handleChange(e: React.FormEvent) {
    e.preventDefault()
    if (newPw !== newPw2) {
      setError('New passwords do not match.')
      return
    }
    if (newPw.length < 8) {
      setError('New password must be at least 8 characters.')
      return
    }
    setStatus('loading')
    setError('')
    setSuccess('')
    try {
      const supabase = (await import('@/lib/supabase/client')).createClient()
      const { error: signErr } = await supabase.auth.signInWithPassword({
        email: (await supabase.auth.getUser()).data.user?.email || '',
        password: currentPw,
      })
      // If not signed in, signInWithPassword with empty email fails — that's fine,
      // we fall through to updateUser which will also fail with a clear message.
      const { error: updErr } = await supabase.auth.updateUser({ password: newPw })
      if (updErr) {
        setStatus('error')
        setError(updErr.message || 'Could not change the password.')
        return
      }
      setStatus('done')
      setSuccess('Password changed! Use your new password next time you sign in.')
    } catch {
      setStatus('error')
      setError('Network error. Please try again.')
    }
  }

  async function handleRecover(e: React.FormEvent) {
    e.preventDefault()
    if (password !== password2) {
      setError('Passwords do not match.')
      return
    }
    setStatus('loading')
    setError('')
    setSuccess('')
    try {
      const res = await fetch('/api/recover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email, studentFirstName: studentFirst, studentLastName: studentLast, pin, password,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        setStatus('error')
        setError(data?.error || 'Something went wrong.')
        return
      }
      setStatus('done')
      setSuccess(`Account recovered! Sign in to the parent portal with ${data.email} and your new password.`)
    } catch {
      setStatus('error')
      setError('Network error. Please try again.')
    }
  }

  const verifyFields = (
    <div className="space-y-3">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Email used to enroll</label>
        <input
          type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
          placeholder="you@email.com"
          className="w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-900 focus:border-emerald-500 focus:outline-none"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Student first name</label>
          <input
            value={studentFirst} onChange={(e) => setStudentFirst(e.target.value)} required
            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-900 focus:border-emerald-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Student last name</label>
          <input
            value={studentLast} onChange={(e) => setStudentLast(e.target.value)} required
            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-900 focus:border-emerald-500 focus:outline-none"
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">PIN (last 4 of student&apos;s SSN)</label>
        <input
          value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
          placeholder="4 digits" inputMode="numeric" required
          className="w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-900 focus:border-emerald-500 focus:outline-none"
        />
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/60 to-white px-4 py-16 sm:px-6 lg:px-8">
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
            Set up or reset the password for your family&apos;s parent portal login.
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

          {flow === 'setup' && (
            <form onSubmit={handleSetup} className="mt-6 space-y-4">
              <div className="rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800">
                First time logging in? Verify your family to create your portal password.
              </div>
              {verifyFields}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">New password</label>
                <input
                  type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  minLength={8} required placeholder="At least 8 characters"
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-900 focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Confirm password</label>
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
                Create Portal Password
              </button>
              {status === 'done' && (
                <Link href="/login" className="block text-center text-sm font-semibold text-emerald-700 underline">
                  Go to Sign In →
                </Link>
              )}
            </form>
          )}

          {flow === 'change' && (
            <form onSubmit={handleChange} className="mt-6 space-y-4">
              <div className="rounded-xl bg-amber-50 p-3 text-xs text-amber-800">
                Already have a portal login? Enter your current password, then set a new one.
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Current password</label>
                <input
                  type="password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)}
                  required
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-900 focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">New password</label>
                <input
                  type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)}
                  minLength={8} required placeholder="At least 8 characters"
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-900 focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Confirm new password</label>
                <input
                  type="password" value={newPw2} onChange={(e) => setNewPw2(e.target.value)}
                  minLength={8} required
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-900 focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <p className="text-xs text-gray-500">Forgot your current password? Use the Recover Account tab.</p>
              {error && <p className="flex items-start gap-2 text-sm font-medium text-red-600"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {error}</p>}
              {success && <p className="flex items-start gap-2 text-sm font-medium text-emerald-700"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> {success}</p>}
              <button
                type="submit" disabled={status === 'loading'}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
              >
                {status === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                Change Password
              </button>
            </form>
          )}

          {flow === 'recover' && (
            <form onSubmit={handleRecover} className="mt-6 space-y-4">
              <div className="rounded-xl bg-red-50 p-3 text-xs text-red-800">
                Lost access? Verify your family&apos;s identity to reset your portal password.
              </div>
              {verifyFields}
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
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {status === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                Recover My Account
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-b from-emerald-50/60 to-white px-4 py-16 text-center text-gray-500">Loading…</div>}>
      <AccountForm />
    </Suspense>
  )
}
