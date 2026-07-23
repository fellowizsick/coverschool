'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { Plus, Trash2, Save, ArrowLeft, GraduationCap, BookOpen, Sparkles } from 'lucide-react'
import Link from 'next/link'

type GradeRow = {
  id?: string
  subject_name: string
  grade_earned: string
  year_completed: string
  school_name: string
}

const COMMON_SUBJECTS = ['Math', 'English', 'Science', 'History', 'Bible', 'Reading', 'Spelling', 'Art', 'Music', 'PE']

export default function TransferRecordsPage() {
  const params = useParams()
  const enrollmentId = params.enrollmentId as string
  const [grades, setGrades] = useState<GradeRow[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [showExamples, setShowExamples] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/transfer-grades?enrollmentId=${enrollmentId}`)
        const data = await res.json()
        if (data.grades && data.grades.length > 0) {
          setGrades(data.grades.map((g: any) => ({
            id: g.id,
            subject_name: g.subject_name,
            grade_earned: g.grade_earned,
            year_completed: g.year_completed,
            school_name: g.school_name || '',
          })))
        }
      } catch (e) {
        setError('Something went wrong loading your records. Please refresh the page.')
      }
      setLoading(false)
    }
    load()
  }, [enrollmentId])

  function addRow(subject = '') {
    setGrades([...grades, { subject_name: subject, grade_earned: '', year_completed: '', school_name: '' }])
  }

  function removeRow(i: number) {
    if (grades.length <= 1) return
    setGrades(grades.filter((_, idx) => idx !== i))
  }

  function updateRow(i: number, field: keyof GradeRow, value: string) {
    const updated = [...grades]
    updated[i] = { ...updated[i], [field]: value }
    setGrades(updated)
  }

  async function handleSave() {
    if (grades.length === 0) {
      setError('Please add at least one subject before saving.')
      return
    }
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/transfer-grades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enrollmentId, grades }),
      })
      if (!res.ok) throw new Error('Save failed')
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (e) {
      setError('Could not save. Please try again.')
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
        <p className="mt-4 text-gray-500">Loading your records...</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Back link */}
      <Link href="/parent" className="mb-6 inline-flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700">
        <ArrowLeft className="h-4 w-4" />
        ← Back to my dashboard
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Previous School Records</h1>
        <p className="mt-3 text-gray-600 leading-relaxed">
          If your student is coming from another school, listing what they studied helps us 
          place them in the right classes. Think of it like copying their last report card — 
          just the main subjects and the grades they earned.
        </p>
      </div>

      {/* Quick subject buttons — make it easy to start */}
      {grades.length === 0 && (
        <Card className="mb-8 border-emerald-100 bg-emerald-50/50">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Sparkles className="mt-0.5 h-5 w-5 text-emerald-500" />
              <div>
                <h3 className="font-medium text-emerald-800">Quick start — pick a subject</h3>
                <p className="mt-1 text-sm text-emerald-600">
                  Tap a subject below to add it, then fill in the grade. You can add more later.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {COMMON_SUBJECTS.map((subject) => (
                    <button
                      key={subject}
                      onClick={() => addRow(subject)}
                      className="rounded-full bg-white px-3 py-1.5 text-sm font-medium text-emerald-700 shadow-sm ring-1 ring-emerald-200 hover:bg-emerald-50 hover:ring-emerald-300 transition"
                    >
                      + {subject}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => addRow()}
                  className="mt-3 text-sm text-emerald-500 hover:text-emerald-700 underline"
                >
                  Or add a custom subject...
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Grade entry cards */}
      {grades.length > 0 && (
        <div className="space-y-3">
          {grades.map((grade, i) => (
            <Card key={i} className="border-gray-200">
              <CardContent className="p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-emerald-500" />
                    <span className="text-sm font-medium text-gray-700">Subject {i + 1}</span>
                  </div>
                  {grades.length > 1 && (
                    <button
                      onClick={() => removeRow(i)}
                      className="rounded p-1 text-gray-300 hover:bg-red-50 hover:text-red-500 transition"
                      title="Remove this subject"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="grid gap-3 sm:grid-cols-4">
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-medium text-gray-500">Subject</label>
                    <Input
                      value={grade.subject_name}
                      onChange={(e) => updateRow(i, 'subject_name', e.target.value)}
                      placeholder="e.g. Math, English, Science"
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">Grade</label>
                    <Input
                      value={grade.grade_earned}
                      onChange={(e) => updateRow(i, 'grade_earned', e.target.value)}
                      placeholder="e.g. A, B, 90%"
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">School Year</label>
                    <Input
                      value={grade.year_completed}
                      onChange={(e) => updateRow(i, 'year_completed', e.target.value)}
                      placeholder="e.g. 2025-2026"
                      className="text-sm"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button onClick={() => addRow()} variant="outline" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Another Subject
        </Button>
        {grades.length > 0 && (
          <Button onClick={handleSave} disabled={saving} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save All Records'}
          </Button>
        )}
        {saved && (
          <span className="flex items-center gap-1 text-sm text-emerald-600 font-medium">
            ✓ Saved!
          </span>
        )}
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>
      )}

      {/* Footer note */}
      <div className="mt-10 rounded-lg border border-gray-100 bg-gray-50/50 p-4">
        <div className="flex items-start gap-2 text-sm text-gray-500">
          <GraduationCap className="mt-0.5 h-4 w-4 text-gray-400" />
          <p>
            These records are used to place your student in the right grade level at Larose Christian Academy. 
            You can come back and update them anytime. If you have questions, <Link href="/contact" className="text-emerald-600 hover:underline">contact us</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}
