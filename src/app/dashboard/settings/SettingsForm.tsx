'use client'

/**
 * Anne's controls for the school's name and the emblem in the middle of the diploma.
 *
 * Jonathan, 2026-09-12: "I want mom to be able to edit the symbol in the middle to add a new one if
 * she would like it needs to be able to fit it to the size of the emblem now. she also needs to be
 * able to edit the name of the school if she needs to later."
 *
 * THE UPLOAD IS TRIMMED AND RE-FRAMED IN THE BROWSER. Whatever she picks — a logo with big empty
 * margins, a photo with a white background, something wider or taller than the current one — it is
 * cropped to its content and then fitted into exactly the same box the current emblem occupies. So a
 * new emblem always lands the same size and in the same place, and the diploma layout cannot shift.
 */
import { useRef, useState } from 'react'

// The bundled emblem's visible artwork, measured from the file: 333 x 407 px inside a 512 x 512
// canvas. A replacement is fitted into that same box, so it occupies the same space on the sheet.
const ART_W = 333
const ART_H = 407
const CANVAS = 512

type Props = {
  initialName: string
  initialEmblemUrl: string
  defaultEmblemUrl: string
  usingDefault: boolean
}

async function reframe(file: File): Promise<File> {
  const url = URL.createObjectURL(file)
  try {
    const img = await new Promise<HTMLImageElement>((res, rej) => {
      const i = new Image()
      i.onload = () => res(i)
      i.onerror = () => rej(new Error('could not read that image'))
      i.src = url
    })

    const src = document.createElement('canvas')
    src.width = img.naturalWidth
    src.height = img.naturalHeight
    const sctx = src.getContext('2d')!
    sctx.drawImage(img, 0, 0)
    const { data, width, height } = sctx.getImageData(0, 0, src.width, src.height)

    // the content box: anything that is not transparent and not near-white
    let minX = width, minY = height, maxX = -1, maxY = -1
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4
        const a = data[i + 3]
        if (a < 12) continue                                    // transparent
        const r = data[i], g = data[i + 1], b = data[i + 2]
        if (r > 244 && g > 244 && b > 244) continue             // white background
        if (x < minX) minX = x
        if (y < minY) minY = y
        if (x > maxX) maxX = x
        if (y > maxY) maxY = y
      }
    }
    // nothing solid found (a blank image) — keep the whole thing rather than uploading nothing
    if (maxX < 0) { minX = 0; minY = 0; maxX = width - 1; maxY = height - 1 }

    const cw = maxX - minX + 1
    const ch = maxY - minY + 1

    const out = document.createElement('canvas')
    out.width = CANVAS
    out.height = CANVAS
    const ctx = out.getContext('2d')!
    ctx.imageSmoothingQuality = 'high'
    // contain the trimmed artwork inside the SAME box the current emblem's artwork fills
    const scale = Math.min(ART_W / cw, ART_H / ch)
    const w = cw * scale
    const h = ch * scale
    ctx.drawImage(src, minX, minY, cw, ch, (CANVAS - w) / 2, (CANVAS - h) / 2, w, h)

    const blob: Blob | null = await new Promise((res) => out.toBlob(res, 'image/png'))
    if (!blob) throw new Error('could not process that image')
    const base = file.name.replace(/\.[^.]+$/, '') || 'emblem'
    return new File([blob], `${base}-prepared.png`, { type: 'image/png' })
  } finally {
    URL.revokeObjectURL(url)
  }
}

export default function SettingsForm({ initialName, initialEmblemUrl, defaultEmblemUrl, usingDefault }: Props) {
  const [name, setName] = useState(initialName)
  const [savedName, setSavedName] = useState(initialName)
  const [emblemUrl, setEmblemUrl] = useState(initialEmblemUrl)
  const [isDefault, setIsDefault] = useState(usingDefault)
  const [pending, setPending] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  async function saveName() {
    setBusy(true); setErr(''); setMsg('')
    try {
      const r = await fetch('/api/admin-settings', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'name', school_name: name }),
      })
      const d = await r.json()
      if (!d.ok) { setErr(d.error || 'Could not save the name.'); return }
      setSavedName(d.schoolName); setName(d.schoolName)
      setMsg('School name saved ✅')
    } catch { setErr('Network error.') } finally { setBusy(false) }
  }

  async function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setErr(''); setMsg('')
    try {
      const prepared = await reframe(f)
      setPending(prepared)
      setPreviewUrl(URL.createObjectURL(prepared))
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : 'Could not read that image.')
      setPending(null); setPreviewUrl(null)
    }
  }

  async function uploadEmblem() {
    if (!pending) return
    setBusy(true); setErr(''); setMsg('')
    try {
      const fd = new FormData()
      fd.append('emblem', pending)
      const r = await fetch('/api/admin-settings', { method: 'POST', body: fd })
      const d = await r.json()
      if (!d.ok) { setErr(d.error || 'Could not save the emblem.'); return }
      setEmblemUrl(d.emblemUrl); setIsDefault(false)
      setPending(null); setPreviewUrl(null)
      if (fileRef.current) fileRef.current.value = ''
      setMsg('Emblem saved ✅ It is on the diploma now.')
    } catch { setErr('Network error.') } finally { setBusy(false) }
  }

  async function useOriginal() {
    setBusy(true); setErr(''); setMsg('')
    try {
      const r = await fetch('/api/admin-settings', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset-emblem' }),
      })
      const d = await r.json()
      if (!d.ok) { setErr(d.error || 'Could not reset the emblem.'); return }
      setEmblemUrl(d.emblemUrl); setIsDefault(true)
      setPending(null); setPreviewUrl(null)
      setMsg('Back to the original emblem ✅')
    } catch { setErr('Network error.') } finally { setBusy(false) }
  }

  const shown = previewUrl || emblemUrl

  return (
    <div className="space-y-6">
      {msg && <div className="rounded-xl bg-emerald-50 px-4 py-3 font-semibold text-emerald-800">{msg}</div>}
      {err && <div className="rounded-xl bg-red-50 px-4 py-3 font-semibold text-red-800">⛔ {err}</div>}

      {/* ── the school name ── */}
      <section className="rounded-2xl bg-white/90 p-5 shadow">
        <h2 className="text-lg font-bold text-gray-800">1. The school name</h2>
        <p className="mt-1 text-sm text-gray-600">
          This is the arched name across the top of the diploma.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={60}
            className="min-w-[260px] flex-1 rounded-xl border-2 border-sky-100 bg-white px-3 py-3 text-base text-gray-900 focus:border-sky-400 focus:outline-none"
            placeholder="Larose Christian Academy"
          />
          <button
            onClick={saveName}
            disabled={busy || name.trim() === savedName}
            className="rounded-xl bg-sky-600 px-5 py-3 font-bold text-white hover:bg-sky-700 disabled:opacity-40"
          >
            Save name
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          A longer name is scaled down on the certificate so it always fits the arch.
        </p>
      </section>

      {/* ── the emblem ── */}
      <section className="rounded-2xl bg-white/90 p-5 shadow">
        <h2 className="text-lg font-bold text-gray-800">2. The emblem in the middle</h2>
        <p className="mt-1 text-sm text-gray-600">
          The round symbol between Mobile and Alabama. Pick your own and it is fitted to the same
          size and place as the current one — empty margins are trimmed off for you.
        </p>
        <div className="mt-4 flex flex-wrap items-start gap-6">
          <div className="text-center">
            {/* the emblem as it appears on the diploma, at the certificate's own scale */}
            <div className="flex h-[126px] w-[126px] items-center justify-center rounded-xl border-2 border-dashed border-sky-200 bg-[#f4efe2]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={shown} alt="emblem" style={{ width: 126, height: 126, objectFit: 'contain' }} />
            </div>
            <p className="mt-2 text-xs text-gray-500">
              {previewUrl ? 'preview — not saved yet' : isDefault ? 'the original emblem' : 'your emblem'}
            </p>
          </div>
          <div className="flex-1 space-y-3">
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={onPickFile}
              className="block w-full text-sm text-gray-700 file:mr-3 file:rounded-lg file:border-0 file:bg-sky-600 file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-sky-700"
            />
            <div className="flex flex-wrap gap-2">
              <button
                onClick={uploadEmblem}
                disabled={busy || !pending}
                className="rounded-xl bg-sky-600 px-5 py-3 font-bold text-white hover:bg-sky-700 disabled:opacity-40"
              >
                Use this emblem
              </button>
              <button
                onClick={useOriginal}
                disabled={busy || isDefault}
                className="rounded-xl bg-gray-200 px-5 py-3 font-bold text-gray-800 hover:bg-gray-300 disabled:opacity-40"
              >
                Back to the original
              </button>
            </div>
            <p className="text-xs text-gray-500">
              PNG, JPEG or WebP, up to 5 MB. A PNG with a transparent background looks best.
            </p>
          </div>
        </div>
      </section>

      <p className="text-xs text-gray-500">
        The school name and emblem appear on the diploma, the wallet card, and the copy families
        receive by email. Everything else on the site keeps the name it was built with.
      </p>
    </div>
  )
}
