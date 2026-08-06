'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function CallbackHandler() {
  const router = useRouter()
  const params = useSearchParams()
  const [error, setError] = useState('')

  useEffect(() => {
    const handleAuth = async () => {
      const supabase = createClient()
      const type = params.get('type')
      const email = params.get('email')
      const token = params.get('token')

      if (type === 'recovery' && email && token) {
        // Email-gated password reset: verify the OTP, establish the session,
        // then send them straight to the password change page.
        const { data, error: otpErr } = await supabase.auth.verifyOtp({
          type: 'recovery',
          email,
          token,
        })
        if (otpErr) {
          setError(otpErr.message || 'This link is invalid or has expired. Please request a new one.')
          return
        }
        router.push('/account?tab=reset')
        router.refresh()
        return
      }

      // Normal auth callback (login redirect, etc.)
      const { error: sessErr } = await supabase.auth.getSession()
      if (sessErr) {
        router.push('/login')
      } else {
        router.push('/dashboard')
      }
      router.refresh()
    }

    handleAuth()
  }, [params, router])

  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <p className="text-gray-600">Processing authentication...</p>
      {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {error && (
        <a href="/account?tab=change" className="mt-4 inline-block font-medium text-emerald-700 underline">
          Request a new link →
        </a>
      )}
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md px-4 py-20 text-center text-gray-600">Loading…</div>}>
      <CallbackHandler />
    </Suspense>
  )
}
