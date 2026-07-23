'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Plus, Trash2, Save, ArrowLeft, GraduationCap } from 'lucide-react'
import Link from 'next/link'

type GradeRow = {
  id?: string
  subject_name: string
  grade_earned: string
  year_completed: string
  school_name: string
}

export default function TransferRecordsPage() {
  const params = useParams()
  const enrollmentId = params.enrollmentId as string
  const [grades, setGrades] = useState<GradeRow[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/transfer-grades?enrollmentId=${enrollmentId}`)
        const data = await res.json()
        if (data.grades) {
          setGrades(data.grades.map((g: any) => ({
            id: g.id,
            subject_name: g.subject_name,
            grade_earned: g.grade_earned,
            year_completed: g.year_completed,
            school_name: g.school_name || '',
          })))
        }
      } catch (e) {
        setError('Failed to load records')
      }
      setLoading(false)
    }
    load()
  }, [enrollmentId])

  function addRow() {
    setGrades([...grades, { subject_name: '', grade_earned: '', year_completed: '', school_name: '' }])
  }

  function removeRow(i: number) {
    setGrades(grades.filter((_, idx) => idx !== i))
  }

  function updateRow(i: number, field: keyof GradeRow, value: string) {
    const updated = [...grades]
    updated[i] = { ...updated[i], [field]: value }
    setGrades(updated)
  }

  async function handleSave() {
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
      setError('Failed to save')
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/parent" className="mb-6 flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700">
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Previous School Records</h1>
        <p className="mt-2 text-gray-600">
          If your student is transferring from another school, enter the subjects and grades 
          they completed there. This helps us place them in the right grade level.
        </p>
      </div>

      {grades.length === 0 && !loading && (
        <Card className="mb-6">
          <CardContent className="p-12 text-center">
            <GraduationCap className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">No Records Yet</h3>
            <p className="mt-2 text-sm text-gray-500">
              Add the subjects and grades your student completed at their previous school.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {grades.map((grade, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Subject {i + 1}</span>
                <button
                  onClick={() => removeRow(i)}
                  className="rounded p-1 text-red-400 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Subject</label>
                  <Input
                    value={grade.subject_name}
                    onChange={(e) => updateRow(i, 'subject_name', e.target.value)}
                    placeholder="e.g. Math, English, Science"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Grade Earned</label>
                  <Input
                    value={grade.grade_earned}
                    onChange={(e) => updateRow(i, 'grade_earned', e.target.value)}
                    placeholder="e.g. A, B, 90%"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Year Completed</label>
                  <Input
                    value={grade.year_completed}
                    onChange={(e) => updateRow(i, 'year_completed', e.target.value)}
                    placeholder="e.g. 2025-2026"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Previous School</label>
                  <Input
                    value={grade.school_name}
                    onChange={(e) => updateRow(i, 'school_name', e.target.value)}
                    placeholder="School name (optional)"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-4">
        <Button onClick={addRow} variant="outline" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Subject
        </Button>
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          <Save className="h-4 w-4" />
          {saving ? 'Saving...' : 'Save Records'}
        </Button>
        {saved && (
          <span className="text-sm text-emerald-600">✓ Saved!</span>
        )}
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-600">{error}</p>
      )}

      <p className="mt-8 text-xs text-gray-400">
        These records are used for grade placement only. You can update them anytime.
      </p>
    </div>
  )
}
