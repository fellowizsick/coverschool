'use client'

import { useCallback, useRef, useState, type ChangeEvent, type DragEvent } from 'react'
import { Button } from '@/components/ui/Button'
import {
  AlertCircle,
  Bug,
  CheckCircle2,
  ImagePlus,
  Loader2,
  Trash2,
  UploadCloud,
  X,
} from 'lucide-react'

const MAX_FILES = 4
const MAX_FILE_SIZE = 5 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

interface ApprovedStudent {
  id: string
  name: string
}

interface ProblemCenterProps {
  /** Approved (paying) students — the Problem Center only shows when this is non-empty. */
  approvedStudents: ApprovedStudent[]
}

type Status = 'idle' | 'sending' | 'success' | 'error'

export default function ProblemCenter({ approvedStudents }: ProblemCenterProps) {
  const [open, setOpen] = useState(false)
  const [description, setDescription] = useState('')
  const [studentId, setStudentId] = useState<string>(approvedStudents[0]?.id ?? '')
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [dragging, setDragging] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  if (approvedStudents.length === 0) return null

  const selectedStudent = approvedStudents.find((s) => s.id === studentId) || approvedStudents[0]

  const reset = useCallback(() => {
    setDescription('')
    setFiles([])
    setPreviews([])
    setStatus('idle')
    setError('')
  }, [])

  const close = useCallback(() => {
    setOpen(false)
    reset()
  }, [reset])

  const addFiles = useCallback((incoming: FileList | File[] | null) => {
    if (!incoming) return
    setError('')
    const list = Array.from(incoming)
    const remaining = MAX_FILES - files.length
    if (remaining <= 0) {
      setError(`You can attach up to ${MAX_FILES} screenshots.`)
      return
    }
    const accepted = list.slice(0, remaining)
    const rejected = list.slice(remaining)
    for (const f of accepted) {
      if (!ALLOWED_TYPES.includes(f.type)) {
        setError(`"${f.name}" is not a supported image (JPG, PNG, WebP, GIF).`)
        return
      }
      if (f.size > MAX_FILE_SIZE) {
        setError(`"${f.name}" is too large (max 5MB).`)
        return
      }
    }
    if (rejected.length > 0) {
      setError(`You can attach up to ${MAX_FILES} screenshots.`)
    }
    setFiles((prev) => [...prev, ...accepted])
    setPreviews((prev) => [
      ...prev,
      ...accepted.map((f) => URL.createObjectURL(f)),
    ])
  }, [files.length])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    addFiles(e.target.files)
    e.target.value = ''
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(false)
    addFiles(e.dataTransfer.files)
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index])
      return prev.filter((_, i) => i !== index)
    })
    setError('')
  }

  const submit = async () => {
    if (!description.trim()) {
      setError('Please describe what went wrong on the website.')
      return
    }
    if (files.length === 0) {
      setError('Please attach at least one screenshot of the problem.')
      return
    }

    setStatus('sending')
    setError('')

    const form = new FormData()
    form.set('description', description.trim())
    form.set('studentName', selectedStudent?.name ?? '')
    files.forEach((f) => form.append('screenshots', f))

    try {
      const res = await fetch('/api/problem-report', { method: 'POST', body: form })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setStatus('error')
        setError(data?.error || 'Could not send your report. Please try again.')
        return
      }
      setStatus('success')
    } catch {
      setStatus('error')
      setError('Network error — could not send your report. Please try again.')
    }
  }

  return (
    <>
      {/* Trigger button — sits quietly in the portal header */}
      <Button size="sm" variant="outline" onClick={() => { setOpen(true); reset() }}>
        <Bug className="mr-1 h-4 w-4" /> Problem Center
      </Button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label="Problem Center"
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-600 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 shadow-inner">
                  <Bug className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Problem Center</h2>
                  <p className="text-xs text-emerald-100">
                    Report a website bug — we&apos;ll fix it fast.
                  </p>
                </div>
              </div>
              <button
                onClick={close}
                className="rounded-lg p-1.5 text-emerald-100 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="space-y-4 px-6 py-5">
              {/* Scope note — so people know exactly what this is for */}
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 px-4 py-3">
                <p className="text-xs leading-relaxed text-emerald-800">
                  <strong className="font-semibold">This is for website problems only.</strong>{' '}
                  Something broken on the site — a page that won&apos;t load, a button that
                  doesn&apos;t work, something that looks wrong, or an error message. Attach a
                  screenshot so we can see it and fix it. For anything else, use the{' '}
                  <a href="/contact" className="font-semibold text-emerald-700 underline hover:text-emerald-900">
                    Contact page
                  </a>.
                </p>
              </div>
              {/* Student picker (only when more than one child) */}
              {approvedStudents.length > 1 && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Which student is reporting?
                  </label>
                  <select
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {approvedStudents.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Description */}
              <div>
                <label htmlFor="problem-desc" className="mb-1 block text-sm font-medium text-gray-700">
                  What went wrong on the website?
                </label>
                <textarea
                  id="problem-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Example: The login page won't load on my phone — I tap Sign In and nothing happens."
                  className="w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Screenshot upload */}
              <div>
                <span className="mb-1 block text-sm font-medium text-gray-700">
                  Screenshots of the problem
                </span>
                <div
                  onClick={() => inputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors ${
                    dragging
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-300 bg-gray-50 hover:border-emerald-400 hover:bg-emerald-50/50'
                  }`}
                >
                  <UploadCloud className="h-7 w-7 text-emerald-600" />
                  <p className="mt-2 text-sm font-medium text-gray-700">
                    Click to upload, or drag &amp; drop
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    JPG, PNG, WebP, or GIF · up to {MAX_FILES} images · 5MB each
                  </p>
                  <input
                    ref={inputRef}
                    type="file"
                    accept={ALLOWED_TYPES.join(',')}
                    multiple
                    className="hidden"
                    onChange={handleInputChange}
                  />
                </div>

                {/* Previews */}
                {previews.length > 0 && (
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {previews.map((src, i) => (
                      <div key={src} className="group relative overflow-hidden rounded-lg border border-gray-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={src}
                          alt={`Screenshot ${i + 1}`}
                          className="h-16 w-full object-cover"
                        />
                        <button
                          onClick={() => removeFile(i)}
                          className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                          aria-label={`Remove screenshot ${i + 1}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-1 py-0.5 text-center text-[10px] font-medium text-white">
                          {i + 1}/{previews.length}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Feedback */}
              {status === 'error' && (
                <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              {status === 'success' && (
                <div className="flex items-start gap-2 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    Your bug report was sent to the school. We&apos;ll take a look at the
                    screenshot and fix the problem. Thank you for helping make the site
                    better! 🙌
                  </span>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-4">
                <Button variant="ghost" size="sm" onClick={close} disabled={status === 'sending'}>
                  Cancel
                </Button>
                {status === 'success' ? (
                  <Button size="sm" onClick={close}>
                    Done
                  </Button>
                ) : (
                  <Button size="sm" onClick={submit} disabled={status === 'sending'}>
                    {status === 'sending' ? (
                      <>
                        <Loader2 className="mr-1 h-4 w-4 animate-spin" /> Sending…
                      </>
                    ) : (
                      <>
                        <ImagePlus className="mr-1 h-4 w-4" /> Send Report
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
