'use client'

import { useEffect, useRef, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

const MAX_SECONDS = 300 // 5 min cap for kids' safety + size

export default function PodcastSubmitPage() {
  const [access, setAccess] = useState<{ canSubmit: boolean; reason?: string; studentName?: string } | null>(null)
  const [consent, setConsent] = useState(false)
  const [recording, setRecording] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [done, setDone] = useState(false)
  const [mode, setMode] = useState<'video' | 'audio'>('video')
  const [error, setError] = useState('')
  const [title, setTitle] = useState('')
  const [previewStream, setPreviewStream] = useState<MediaStream | null>(null)
  const [mine, setMine] = useState<any[]>([])

  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    fetch('/api/podcast/access').then(r => r.json()).then(d => {
      setAccess(d)
      if (d.canSubmit) setTitle(`${d.studentName}'s podcast`)
    })
    refreshMine()
    return () => { streamRef.current?.getTracks().forEach(t => t.stop()) }
  }, [])

  async function refreshMine() {
    const r = await fetch('/api/podcast/mine').then(r => r.json())
    if (r.ok) setMine(r.submissions || [])
  }

  async function removeMine(id: string) {
    if (!confirm('Delete this submission? This cannot be undone.')) return
    const r = await fetch('/api/podcast/delete', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    const d = await r.json()
    if (d.ok) { setMine(m => m.filter(x => x.id !== id)) } else { alert(d.error || 'Could not delete.') }
  }

  async function startRecording() {
    setError('')
    try {
      const isAudio = mode === 'audio'
      const stream = isAudio
        ? await navigator.mediaDevices.getUserMedia({ audio: true })
        : await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: true })
      streamRef.current = stream
      setPreviewStream(stream)
      if (!isAudio && videoRef.current) videoRef.current.srcObject = stream
      const mime = isAudio
        ? ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'].find(m => MediaRecorder.isTypeSupported(m)) || ''
        : ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm', 'video/mp4'].find(m => MediaRecorder.isTypeSupported(m)) || ''
      const rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined)
      chunksRef.current = []
      rec.ondataavailable = (e) => { if (e.data.size) chunksRef.current.push(e.data) }
      rec.onstop = handleStop
      rec.start()
      recorderRef.current = rec
      setRecording(true)
      setElapsed(0)
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000)
      setTimeout(() => { if (rec.state === 'recording') rec.stop() }, MAX_SECONDS * 1000)
    } catch (e) {
      setError(mode === 'audio' ? 'Could not access microphone. Allow mic access and try again.' : 'Could not access camera/microphone. Allow camera + mic access and try again.')
    }
  }

  function stopRecording() {
    if (recorderRef.current && recorderRef.current.state !== 'inactive') recorderRef.current.stop()
    if (timerRef.current) clearInterval(timerRef.current)
    setRecording(false)
  }

  async function handleStop() {
    streamRef.current?.getTracks().forEach(t => t.stop())
    setPreviewStream(null)
    const blob = new Blob(chunksRef.current, { type: recorderRef.current?.mimeType || 'video/webm' })
    if (blob.size < 1000) { setError('Recording was empty. Try again.'); return }
    await upload(blob)
  }

  async function upload(blob: Blob) {
    setUploading(true); setError('')
    try {
      const u = await fetch('/api/podcast/upload-url', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ media_type: mode }) }).then(r => r.json())
      if (!u.ok) { setError(u.error || 'Could not start upload'); setUploading(false); return }
      const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
      const { error: upErr } = await supabase.storage.from('podcast-videos').uploadToSignedUrl(u.path, u.token, blob)
      if (upErr) { setError('Upload failed: ' + upErr.message); setUploading(false); return }
      const reg = await fetch('/api/podcast/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ path: u.path, title, consent_ack: true, duration: elapsed, media_type: mode }) }).then(r => r.json())
      if (reg.ok) { setDone(true) } else { setError(reg.error || 'Could not save.') }
    } catch {
      setError('Upload error. Try again.')
    }
    setUploading(false)
  }

  if (access === null) return <div className="px-8 pt-20 sm:pt-24 pb-8 text-gray-500">Checking eligibility…</div>

  if (!access.canSubmit) {
    return (
      <div className="px-8 pt-20 sm:pt-24 pb-8 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">🎬 Student Podcast</h1>
        <div className="p-4 rounded-xl border bg-amber-50 text-sm text-gray-700">{access.reason || 'You cannot submit right now.'}</div>
      </div>
    )
  }

  if (done) {
    return (
      <div className="px-8 pt-20 sm:pt-24 pb-8 max-w-lg mx-auto text-center">
        <div className="text-5xl mb-3">✅</div>
        <h1 className="text-2xl font-bold text-gray-900">Submitted!</h1>
        <p className="text-sm text-gray-600 mt-2">Your {mode === 'audio' ? 'audio' : 'video'} was sent to the school office for review. It will appear on the podcast once approved.</p>
      </div>
    )
  }

  return (
    <div className="px-6 pt-20 sm:pt-24 pb-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">🎬 Record a podcast {mode === 'audio' ? 'audio' : 'video'}</h1>
      <p className="text-sm text-gray-500 mb-4">Use your {mode === 'audio' ? 'microphone' : 'camera + microphone'} to record a short podcast clip. It stays private until the school reviews and approves it.</p>

      <div className="flex gap-2 mb-4">
        <button type="button" onClick={() => setMode('video')} disabled={recording} className={`flex-1 py-2 rounded-lg text-sm font-semibold border ${mode === 'video' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'} disabled:opacity-50`}>🎥 Video</button>
        <button type="button" onClick={() => setMode('audio')} disabled={recording} className={`flex-1 py-2 rounded-lg text-sm font-semibold border ${mode === 'audio' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'} disabled:opacity-50`}>🎙️ Audio</button>
      </div>

      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="w-full p-2 border rounded mb-3 text-sm" />

      <label className="flex items-start gap-2 mb-4 text-sm text-gray-700">
        <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} className="mt-1" />
        <span>I have my parent/guardian's permission to record and share this {mode === 'audio' ? 'audio' : 'video'} with the school for the podcast.</span>
      </label>

      {error && <div className="text-sm p-3 rounded-lg bg-red-50 text-red-700 border border-red-200 mb-3">{error}</div>}

      {mode === 'video' ? (
        <div className="rounded-xl border overflow-hidden bg-black aspect-video flex items-center justify-center mb-3">
          {previewStream ? <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" /> : <span className="text-gray-500 text-sm">Camera preview</span>}
        </div>
      ) : (
        <div className="rounded-xl border bg-emerald-50 flex items-center justify-center gap-2 mb-3 py-6 text-sm text-emerald-700">
          <span className="text-xl">🎙️</span> {recording ? 'Recording audio…' : 'Microphone only — no camera needed.'}
        </div>
      )}
      <div className="text-center text-sm font-mono text-gray-600 mb-3">{recording ? `● ${Math.floor(elapsed / 60)}:${String(elapsed % 60).padStart(2, '0')} (max 5:00)` : ''}</div>

      <div className="flex gap-3">
        {!recording ? (
          <button onClick={startRecording} disabled={!consent} className="flex-1 py-3 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 disabled:opacity-40">{mode === 'audio' ? '🎙️ Record' : '🎥 Record'}</button>
        ) : (
          <button onClick={stopRecording} className="flex-1 py-3 rounded-lg bg-gray-800 text-white font-semibold hover:bg-gray-900">⏹ Stop</button>
        )}
      </div>
      {!consent && <p className="text-xs text-gray-400 mt-2 text-center">Check the permission box to enable recording.</p>}
      {uploading && <p className="text-center text-sm text-gray-500 mt-3">Uploading…</p>}

      {mine.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">Your submissions</h2>
          <p className="text-xs text-gray-400 mb-3">You can delete your own {mine.length > 1 ? 'items' : 'item'} here anytime. The school reviews and approves before anything appears on the public podcast.</p>
          <div className="space-y-3">
            {mine.map(s => (
              <div key={s.id} className="p-3 rounded-xl border bg-gray-50 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-800 truncate">{s.title || 'Untitled'} {s.media_type === 'audio' ? <span className="text-[10px] font-semibold uppercase text-emerald-600">· Audio</span> : null}</div>
                  <div className="text-xs text-gray-500">
                    <span className={`capitalize ${s.status === 'approved' ? 'text-green-600' : s.status === 'rejected' ? 'text-red-600' : 'text-amber-600'}`}>{s.status}</span>
                    {s.previewUrl ? (
                      s.media_type === 'audio'
                        ? <audio src={s.previewUrl} controls preload="metadata" className="h-8 w-40 mt-1 block" />
                        : <video src={s.previewUrl} controls preload="metadata" className="w-40 h-24 object-cover rounded mt-1" />
                    ) : null}
                  </div>
                </div>
                <button onClick={() => removeMine(s.id)} className="shrink-0 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100">Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
