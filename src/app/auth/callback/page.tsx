'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleAuth = async () => {
      const supabase = createClient()
      const { error } = await supabase.auth.getSession()
      if (error) {
        router.push('/login')
      } else {
        router.push('/dashboard')
      }
      router.refresh()
    }

    handleAuth()
  }, [router])

  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <p className="text-gray-600">Processing authentication...</p>
    </div>
  )
}
