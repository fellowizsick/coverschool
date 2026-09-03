'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'

function StudentLoginForm() {
  const [pin, setPin] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const r = await fetch('/api/student-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      })
      const d = await r.json()
      if (!r.ok || !d.ok) {
        setError(d.error || 'That code did not work. Try again.')
        setLoading(false)
        return
      }
      router.push('/podcast/submit')
      router.refresh()
    } catch {
      setError('Network error. Please try again.')
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>🎬 Student Sign In</CardTitle>
        <CardDescription>
          Enter the 4-digit code the school gave you to record a podcast.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-sm text-emerald-800">
          Your code was sent home with your family. If you don&apos;t have it, ask your
          parent or the school office.
        </div>
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            id="pin"
            type="text"
            inputMode="numeric"
            maxLength={4}
            label="Student Code"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
            required
            placeholder="e.g. 4321"
          />
          <Button type="submit" className="w-full" disabled={loading || pin.length !== 4}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
        <div className="mt-4 space-y-2 text-center text-sm">
          <p>
            <Link href="/login" className="font-medium text-emerald-700 hover:text-emerald-800">
              Parent? Sign in with the family account →
            </Link>
          </p>
          <p>
            <Link href="/podcast" className="font-medium text-gray-500 hover:text-gray-700">
              ← Back to the podcast
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default function StudentLoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-20">
      <StudentLoginForm />
    </div>
  )
}
