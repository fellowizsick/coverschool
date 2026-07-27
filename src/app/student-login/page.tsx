'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'

export default function StudentLoginPage() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [pin, setPin] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/student-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, pin }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Could not sign in')
        setLoading(false)
        return
      }

      // Redirect straight to their curriculum
      router.push(`/curriculum/${data.enrollmentId}`)
    } catch {
      setError('Something went wrong. Try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <span className="text-4xl">🎓</span>
          <h1 className="text-2xl font-bold text-emerald-900 mt-2">Student Login</h1>
          <p className="text-sm text-emerald-600">Enter your name and PIN to start learning</p>
        </div>

        <Card>
          <CardContent className="p-6">
            {error && (
              <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                id="firstName"
                label="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                placeholder="Your first name"
              />
              <Input
                id="lastName"
                label="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                placeholder="Your last name"
              />
              <Input
                id="pin"
                label="PIN (last 4 of SSN)"
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                required
                maxLength={4}
                placeholder="0000"
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing in...' : '🎮 Start Learning'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-gray-400 mt-6">
          Parent? <a href="/login" className="text-emerald-600 hover:underline">Sign in here</a>
        </p>
      </div>
    </div>
  )
}
