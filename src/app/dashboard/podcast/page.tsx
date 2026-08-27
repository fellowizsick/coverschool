'use client'

import { useEffect, useState } from 'react'

type Sub = {
  id: string
  student_name: string
  student_email: string
  title: string
  description: string
  status: string
  duration_seconds: number | null
  created_at: string
  reviewed_at: string | null
  reviewed_by: string | null
  previewUrl: string | null
  media_type?: 'video' | 'audio'
}

function isAudio(s: Sub): boolean {
  return s.media_type === 'audio'
}

export default function PodcastReviewPage() {
  const [tab, setTab] = useState('pending')
  const [subs, setSubs] = useState<Sub[]>([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')

  async function load(status: string) {
    setLoading(true)
    const r = await fetch(`/api/podcast/review?status=${status}`)
    const d = await r.json()
    if (d.ok) setSubs(d.submissions || [])
    else setMsg(d.error || 'Failed to load')
    setLoading(false)
  }
  useEffect(() => { load(tab) }, [tab])

  async function review(id: string, decision: 'approved' | 'rejected') {
    if (!confirm(decision === 'approved' ? 'Approve and publish this video to the podcast?' : 'Reject this video?')) return
    const r = await fetch('/api/podcast/review', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, decision }) })
    const d = await r.json()
    setMsg(d.ok ? `Done — ${decision}.` : d.error || 'Failed')
    await load(tab)
  }

  async function remove(id: string) {
    if (!confirm('Permanently delete this submission? This cannot be undone.')) return
    const r = await fetch('/api/podcast/delete', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    const d = await r.json()
    setMsg(d.ok ? 'Done — deleted.' : d.error || 'Failed')
    await load(tab)
  }

  const counts = { pending: 0, approved: 0, rejected: 0 }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">🎬 Podcast Review</h1>
        <p className="text-sm text-gray-500 mt-1">Review and approve student podcast videos. Nothing is public until you approve it.</p>
      </div>
      {msg && <div className="text-sm p-3 rounded-lg bg-gray-100 border border-gray-200">{msg}</div>}

      <div className="flex gap-2">
        {(['pending', 'approved', 'rejected'] as const).map(s => (
          <button key={s} onClick={() => setTab(s)} className={`px-4 py-2 rounded-lg text-sm font-semibold ${tab === s ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{s[0].toUpperCase() + s.slice(1)}</button>
        ))}
      </div>

      {loading ? <p className="text-gray-400">Loading…</p> : subs.length === 0 ? (
        <p className="text-gray-400">No {tab} videos.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {subs.map(s => (
            <div key={s.id} className="p-4 rounded-xl border bg-white">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-semibold text-gray-900">{s.title || 'Untitled'}</div>
                  <div className="text-xs text-gray-500">{s.student_name} · {s.student_email}{s.duration_seconds ? ` · ${Math.round(s.duration_seconds)}s` : ''}</div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs ${s.status==='approved'?'bg-green-100 text-green-800':s.status==='rejected'?'bg-red-100 text-red-800':'bg-amber-100 text-amber-800'}`}>{s.status}</span>
              </div>
              {s.description && <p className="text-xs text-gray-600 mb-2">{s.description}</p>}
              <div className="mb-2 text-[11px] text-gray-400">Submitted {new Date(s.created_at).toLocaleString()}</div>
              {s.previewUrl ? (
                isAudio(s) ? (
                  <audio src={s.previewUrl} controls preload="metadata" className="w-full" />
                ) : (
                  <video src={s.previewUrl} controls preload="metadata" className="w-full rounded-lg bg-black" style={{ maxHeight: 320 }} />
                )
              ) : <div className="text-xs text-gray-400">Preview unavailable</div>}
              <div className="flex gap-2 mt-3">
                <button onClick={() => review(s.id, 'approved')} className="flex-1 px-3 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700">✓ Approve</button>
                <button onClick={() => review(s.id, 'rejected')} className="flex-1 px-3 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700">✕ Reject</button>
                <button onClick={() => remove(s.id)} className="px-3 py-2 rounded-lg bg-gray-100 text-gray-600 text-sm font-semibold hover:bg-red-100 hover:text-red-600">🗑 Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
