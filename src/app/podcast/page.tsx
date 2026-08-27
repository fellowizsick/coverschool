'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

type Pub = { id: string; student_name: string; title: string; description: string; reviewed_at: string | null; playbackUrl: string }

export default function PodcastPage() {
  const [items, setItems] = useState<Pub[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/podcast/published').then(r => r.json()).then(d => {
      setItems(d.ok ? d.submissions : [])
      setLoading(false)
    })
  }, [])

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🎙️ LCA Podcast</h1>
          <p className="text-sm text-gray-500">Student-created episodes, reviewed and approved by the school.</p>
        </div>
        <Link href="/podcast/submit" className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700">Record a video</Link>
      </div>

      {loading ? <p className="text-gray-400">Loading…</p> : items.length === 0 ? (
        <div className="p-8 text-center text-gray-400">No podcast episodes yet. New student videos appear here once approved.</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {items.map(p => (
            <div key={p.id} className="p-4 rounded-xl border bg-white">
              {p.playbackUrl ? <video src={p.playbackUrl} controls preload="metadata" className="w-full rounded-lg bg-black" style={{ maxHeight: 320 }} /> : null}
              <div className="mt-3 font-semibold text-gray-900">{p.title || 'Untitled'}</div>
              <div className="text-xs text-gray-500">{p.student_name}</div>
              {p.description && <p className="text-xs text-gray-600 mt-1">{p.description}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
