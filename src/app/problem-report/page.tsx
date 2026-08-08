'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { createClient } from '@/lib/supabase/client'
import { AlertTriangle, Upload, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react'

/**
 * /problem-report — parent support window.
 * Sends a problem description + screenshots to the school email.
 * Gated server-side: caller must be signed in AND have an approved
 * (paying) enrollment under their email, or be admin.
 */
export default function ProblemReportPage() {
  const [description, setDescription] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    setErrorMsg('')

    try {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session?.user) {
        setStatus('error')
        setErrorMsg('Please sign in first.')
        return
      }

      const form = new FormData()
      form.append('description', description)
      files.forEach((f) => form.append('screenshots', f))

      const res = await fetch('/api/problem-report', { method: 'POST', body: form })
      const data = await res.json().catch(() => ({ error: 'Unexpected response.' }))

      if (!res.ok) {
        setStatus('error')
        setErrorMsg(data.error || 'Something went wrong. Please try again.')
        return
      }

      setStatus('sent')
      setDescription('')
      setFiles([])
    } catch (err) {
      console.error(err)
      setStatus('error')
      setErrorMsg('Could not reach the server. Please try again.')
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link
        href="/parent"
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" /> Back to My Dashboard
      </Link>

      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <CardTitle>Report a Problem</CardTitle>
          <CardDescription>
            Found an error on the site or something not working right? Tell us what happened and
            attach a screenshot — we&apos;ll look into it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {status === 'sent' ? (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-6 text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />
              <h3 className="mt-3 text-lg font-bold text-emerald-900">Report sent — thank you!</h3>
              <p className="mt-1 text-sm text-emerald-800">
                We&apos;ve received your report and will follow up with you.
              </p>
              <Button className="mt-4" onClick={() => setStatus('idle')}>
                Report Another Issue
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {status === 'error' && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{errorMsg}</div>
              )}

              <div>
                <label htmlFor="description" className="mb-1 block text-sm font-medium text-gray-700">
                  What went wrong?
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={4}
                  placeholder="Describe the problem — what page, what you clicked, what happened..."
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label htmlFor="screenshots" className="mb-1 block text-sm font-medium text-gray-700">
                  Screenshots (optional, up to 4)
                </label>
                <input
                  id="screenshots"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  multiple
                  onChange={(e) => setFiles(Array.from(e.target.files || []).slice(0, 4))}
                  className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-amber-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-amber-800 hover:file:bg-amber-200"
                />
                {files.length > 0 && (
                  <p className="mt-1 text-xs text-gray-500">{files.length} screenshot(s) attached</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={status === 'sending'}>
                {status === 'sending' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" /> Send Report
                  </>
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
