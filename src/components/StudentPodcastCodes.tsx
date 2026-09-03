'use client'

import { useCallback, useEffect, useState } from 'react'

type Student = {
  id: string
  name: string
  email: string
  status: string
  payment_status: string
  pin: string | null
}

/** Admin-only panel to generate/copy the student podcast access codes that the
 *  school hands out. The student enters this 4-digit code at /student-login. */
export default function StudentPodcastCodes() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const r = await fetch('/api/student-pins')
      const d = await r.json()
      if (d.ok) setStudents(d.students || [])
    } catch {}
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function makePin(s: Student) {
    const r = await fetch('/api/student-pins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: s.id }),
    })
    const d = await r.json()
    if (d.ok) {
      setStudents((prev) => prev.map((x) => (x.id === s.id ? { ...x, pin: d.pin } : x)))
      setCopiedId(s.id)
      try { await navigator.clipboard.writeText(d.pin) } catch {}
    } else {
      alert(d.error || 'Could not generate a code.')
    }
  }

  async function copyPin(s: Student) {
    if (!s.pin) return
    try {
      await navigator.clipboard.writeText(s.pin)
      setCopiedId(s.id)
      setTimeout(() => setCopiedId(null), 1500)
    } catch {}
  }

  const eligible = students.filter((s) => s.status === 'approved' && s.payment_status === 'paid')

  return (
    <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-base font-bold text-gray-900">🎙️ Student Podcast Codes</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Give each student their 4-digit code to sign in and record a podcast. Codes only work for
            paid, active students.
          </p>
        </div>
        <button onClick={load} className="text-xs font-semibold text-emerald-700 hover:text-emerald-800">Refresh</button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400 py-4 text-center">Loading…</p>
      ) : eligible.length === 0 ? (
        <p className="text-sm text-gray-400 py-4 text-center">No paid, active students yet.</p>
      ) : (
        <div className="space-y-2">
          {eligible.map((s) => (
            <div key={s.id} className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-2.5">
              <div className="min-w-0">
                <div className="text-sm font-medium text-gray-800 truncate">{s.name}</div>
                <div className="text-xs text-gray-400 truncate">{s.email}</div>
              </div>
              {s.pin ? (
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-mono text-lg font-bold tracking-widest text-emerald-700">{s.pin}</span>
                  <button onClick={() => copyPin(s)} className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-100">
                    {copiedId === s.id ? '✓ Copied' : 'Copy'}
                  </button>
                  <button onClick={() => makePin(s)} className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700 hover:bg-emerald-100">
                    New
                  </button>
                </div>
              ) : (
                <button onClick={() => makePin(s)} className="shrink-0 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700">
                  Generate code
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
