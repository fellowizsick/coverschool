'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Gift, Copy, Check, Info } from 'lucide-react'

export default function ReferralCard({
  referralCodes,
  creditsEarned,
  creditsApplied,
  siteUrl,
}: {
  referralCodes: string[]
  creditsEarned: number
  creditsApplied: number
  siteUrl: string
}) {
  const [copied, setCopied] = useState<string | null>(null)

  async function copyCode(code: string) {
    const url = `${siteUrl}/enroll?ref=${encodeURIComponent(code)}`
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      // Fallback for older browsers
      const ta = document.createElement('textarea')
      ta.value = url
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(code)
    setTimeout(() => setCopied(null), 2000)
  }

  const available = creditsEarned - creditsApplied

  return (
    <div className="rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-400 shadow-sm">
          <Gift className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-900">Refer a Family — Earn Free Tuition 🎁</h3>
          <p className="text-sm text-gray-600">
            When someone enrolls using your link and pays, you get <strong>one month free</strong>{' '}
            (or <strong>$45 off your yearly payment</strong>).
          </p>
          <Link
            href="/referral"
            className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-amber-700 underline decoration-amber-300 underline-offset-2 hover:text-amber-800"
          >
            <Info className="h-3.5 w-3.5" /> How it works — full details
          </Link>
        </div>
      </div>

      {creditsEarned > 0 && (
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 font-medium text-emerald-700">
            ✅ {available > 0 ? `${available} month${available > 1 ? 's' : ''} of free tuition available` : 'All credits used'}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 font-medium text-amber-700">
            🎁 {creditsEarned} earned · {creditsApplied} used
          </span>
        </div>
      )}

      {referralCodes.length === 0 ? (
        <p className="mt-4 text-sm text-gray-500">
          Your referral code will appear here once your enrollment is submitted.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {referralCodes.map((code) => (
            <div
              key={code}
              className="flex items-center justify-between gap-3 rounded-xl border border-amber-200 bg-white px-4 py-3"
            >
              <div>
                <p className="text-xs text-gray-500">Your referral code</p>
                <p className="font-mono text-lg font-bold text-amber-700">{code}</p>
              </div>
              <button
                onClick={() => copyCode(code)}
                className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-amber-600 active:scale-95"
              >
                {copied === code ? (
                  <>
                    <Check className="h-4 w-4" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" /> Copy Link
                  </>
                )}
              </button>
            </div>
          ))}
          <p className="text-xs text-gray-500">
            Share your link with friends &amp; family. When they enroll and pay, you earn the reward automatically.{' '}
            <Link href="/referral" className="font-semibold text-amber-700 underline decoration-amber-300 underline-offset-2 hover:text-amber-800">
              See how it works
            </Link>
          </p>
        </div>
      )}
    </div>
  )
}
