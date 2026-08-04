'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Upload, FileImage, CheckCircle2, Loader2, Trash2, X, Sparkles } from 'lucide-react'

interface ChildOption {
  id: string
  name: string
  grade: string
}

interface Snapshot {
  id: string
  enrollment_id: string
  file_name: string
  mime_type: string | null
  uploaded_at: string
  previewUrl: string | null
  extraction_status?: string
  extracted_json?: any
}

/**
 * Report Card Snapshot Uploader
 * - One student  -> uploads go straight to that student (no picker)
 * - Multiple kids -> parent picks which student (or adds a child via /enroll)
 * - Shows existing snapshots per student with previews
 */
export default function ReportCardUploader({
  children,
  isAdmin,
}: {
  children: ChildOption[]
  isAdmin: boolean
}) {
  const [selectedId, setSelectedId] = useState<string>(children[0]?.id || '')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [snapshots, setSnapshots] = useState<Snapshot[]>([])
  const [loadingSnaps, setLoadingSnaps] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const hasMultiple = children.length > 1

  // Auto-select: if only one child, it's already children[0]. If multiple, keep current.
  useEffect(() => {
    if (children.length === 1) setSelectedId(children[0].id)
  }, [children])

  const loadSnapshots = useCallback(async (enrollmentId: string) => {
    if (!enrollmentId) return
    setLoadingSnaps(true)
    try {
      const res = await fetch(`/api/report-card-snapshots?enrollmentId=${enrollmentId}`, {
        credentials: 'include',
      })
      if (res.ok) {
        const data = await res.json()
        setSnapshots(data.snapshots || [])
      } else {
        setSnapshots([])
      }
    } catch {
      setSnapshots([])
    } finally {
      setLoadingSnaps(false)
    }
  }, [])

  useEffect(() => {
    if (selectedId) loadSnapshots(selectedId)
  }, [selectedId, loadSnapshots])

  const handleFile = (f: File | null | undefined) => {
    if (!f) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(f.type)) {
      setError('Please choose a JPG, PNG, or WebP image.')
      setFile(null)
      setPreview(null)
      return
    }
    if (f.size > 10 * 1024 * 1024) {
      setError('Image is too large (max 10 MB).')
      setFile(null)
      setPreview(null)
      return
    }
    setError(null)
    setFile(f)
    const reader = new FileReader()
    reader.onload = () => setPreview(typeof reader.result === 'string' ? reader.result : null)
    reader.readAsDataURL(f)
  }

  const upload = async () => {
    if (!file) {
      setError('Choose a report card image first.')
      return
    }
    if (!selectedId) {
      setError('Please pick which student this report card belongs to.')
      return
    }
    setUploading(true)
    setMessage(null)
    setError(null)
    try {
      const base64 = preview?.split(',')[1] || ''
      const res = await fetch('/api/report-card-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enrollmentId: selectedId,
          fileName: file.name,
          mimeType: file.type,
          base64,
        }),
        credentials: 'include',
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Upload failed')
        return
      }
      setMessage('Report card uploaded! ✅')
      setFile(null)
      setPreview(null)
      if (fileRef.current) fileRef.current.value = ''
      await loadSnapshots(selectedId)
    } catch {
      setError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const selectedChild = children.find((c) => c.id === selectedId)

  return (
    <Card className="border-fuchsia-200">
      <CardContent className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-fuchsia-100 text-fuchsia-600">
            <FileImage className="h-5 w-5" />
          </span>
          <div>
            <h3 className="font-bold text-gray-900">Report Card Snapshots</h3>
            <p className="text-xs text-gray-500">
              Upload a photo of your report card — it&apos;s saved securely to your student&apos;s
              file.
            </p>
          </div>
        </div>

        {hasMultiple && (
          <div className="mb-4">
            <label className="mb-1 block text-sm font-semibold text-gray-700">
              Which student does this report card belong to?
            </label>
            <div className="flex flex-wrap gap-2">
              {children.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className={`rounded-xl border-2 px-3 py-2 text-sm font-semibold transition ${
                    selectedId === c.id
                      ? 'border-fuchsia-400 bg-fuchsia-50 text-fuchsia-700'
                      : 'border-gray-200 text-gray-500 hover:border-fuchsia-200'
                  }`}
                >
                  {c.name} <span className="font-normal text-gray-400">· {c.grade}</span>
                </button>
              ))}
            </div>
            {isAdmin && (
              <p className="mt-1 text-xs text-gray-400">Admin: pick any student to view/upload.</p>
            )}
          </div>
        )}

        {!hasMultiple && (
          <p className="mb-4 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {selectedChild ? `Uploading for ${selectedChild.name} (${selectedChild.grade}).` : 'One student on file.'}
          </p>
        )}

        {/* Upload zone */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault()
            handleFile(e.dataTransfer.files?.[0])
          }}
          className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-fuchsia-200 bg-fuchsia-50/40 p-6 text-center"
        >
          {preview ? (
            <div className="mb-3 max-h-48 overflow-hidden rounded-xl border border-gray-200 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Report card preview" className="max-h-48 w-auto object-contain" />
            </div>
          ) : (
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-fuchsia-100 text-fuchsia-500">
              <Upload className="h-6 w-6" />
            </div>
          )}
          <p className="text-sm text-gray-600">
            {preview ? file?.name : 'Drag a photo here, or'}
          </p>
          <div className="mt-2 flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => fileRef.current?.click()}
            >
              Choose Image
            </Button>
            {preview && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setFile(null)
                  setPreview(null)
                  if (fileRef.current) fileRef.current.value = ''
                }}
              >
                <X className="mr-1 h-4 w-4" /> Clear
              </Button>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              handleFile(e.target.files?.[0])
              e.target.value = ''
            }}
          />
          <p className="mt-2 text-xs text-gray-400">JPG, PNG, or WebP · up to 10 MB</p>
        </div>

        {error && <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-600">{error}</p>}
        {message && (
          <p className="mt-3 flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
            <CheckCircle2 className="h-4 w-4" /> {message}
          </p>
        )}

        <Button onClick={upload} disabled={!file || uploading} className="mt-4 w-full" variant="fun">
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading…
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" /> Upload Report Card
            </>
          )}
        </Button>

        {/* Existing snapshots */}
        {loadingSnaps ? (
          <p className="mt-4 text-sm text-gray-400">Loading saved snapshots…</p>
        ) : snapshots.length > 0 ? (
          <div className="mt-5">
            <h4 className="mb-2 text-sm font-semibold text-gray-700">
              Saved for {selectedChild?.name || 'this student'}
            </h4>

            {/* 🧠 Latest scanned grades — organized view */}
            {(() => {
              const latest = snapshots.find((s) => s.extraction_status === 'done' && s.extracted_json);
              if (!latest?.extracted_json?.subjects?.length) return null;
              const ex = latest.extracted_json;
              return (
                <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="flex items-center gap-1.5 text-sm font-bold text-emerald-800">
                      <Sparkles className="h-4 w-4" /> Scanned Grades
                    </p>
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                      {ex.term || 'Latest'} {ex.schoolYear || ''}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                    {ex.subjects.map((s: any, i: number) => (
                      <div key={i} className="flex items-center justify-between rounded-lg bg-white px-3 py-1.5 shadow-sm">
                        <span className="text-sm font-medium text-gray-700">{s.name}</span>
                        <span className="rounded-md bg-emerald-600 px-2 py-0.5 text-sm font-bold text-white">
                          {s.grade}
                        </span>
                      </div>
                    ))}
                  </div>
                  {(ex.gpa || ex.attendance) && (
                    <div className="mt-2 flex gap-4 border-t border-emerald-100 pt-2 text-sm text-gray-600">
                      {ex.gpa && <span><strong>GPA:</strong> {ex.gpa}</span>}
                      {ex.attendance && <span><strong>Attendance:</strong> {ex.attendance}</span>}
                    </div>
                  )}
                </div>
              );
            })()}

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {snapshots.map((s) => (
                <div key={s.id} className="group relative">
                  <a href={s.previewUrl || '#'} target="_blank" rel="noopener noreferrer">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={s.previewUrl || ''}
                      alt={s.file_name}
                      className="h-28 w-full rounded-xl border border-gray-200 object-cover shadow-sm transition group-hover:scale-[1.02]"
                    />
                  </a>
                  <div className="mt-1 flex items-center justify-between text-[10px] text-gray-400">
                    <span>{new Date(s.uploaded_at).toLocaleDateString()}</span>
                    {s.extraction_status === 'done' && (
                      <span className="inline-flex items-center gap-0.5 font-semibold text-emerald-600">
                        <CheckCircle2 className="h-3 w-3" /> scanned
                      </span>
                    )}
                    {s.extraction_status === 'failed' && (
                      <span className="font-semibold text-amber-500">scan failed</span>
                    )}
                    {s.extraction_status === 'pending' && (
                      <span className="font-semibold text-gray-400">scanning…</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="mt-4 text-xs text-gray-400">No snapshots saved yet for this student.</p>
        )}
      </CardContent>
    </Card>
  )
}
