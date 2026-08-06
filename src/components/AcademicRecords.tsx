'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  AlertCircle, BookOpen, CalendarCheck2, CheckCircle2, GraduationCap,
  Loader2, Plus, Star, Trash2, X,
} from 'lucide-react'
import { SUBJECTS_BY_GRADE } from '@/lib/subjects'
import type {
  AttendanceRow, GradebookRow, SubjectSummary,
} from '@/lib/academic'

type Mode = 'verify' | 'loading' | 'ready' | 'error'

interface AttendanceResponse {
  ok: boolean
  rows?: AttendanceRow[]
  summary?: { days: number; hours: number; schoolYear: string }
  target?: { label: string; days?: number; hours?: number } | null
  error?: string
}

interface GradebookResponse {
  ok: boolean
  rows?: GradebookRow[]
  summaries?: SubjectSummary[]
  gpa?: number | null
  error?: string
}

/**
 * AcademicRecords — real attendance + gradebook tracking for enrolled families.
 * Verifies the family (email + student name + PIN, same as student login), then
 * lets them log school days, track progress vs the state requirement, and add
 * per-subject grades that flow into report cards + transcripts.
 */
export default function AcademicRecords() {
  const [mode, setMode] = useState<Mode>('verify')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  // Verification fields
  const [email, setEmail] = useState('')
  const [studentFirst, setStudentFirst] = useState('')
  const [studentLast, setStudentLast] = useState('')
  const [pin, setPin] = useState('')

  // Attendance
  const [attRows, setAttRows] = useState<AttendanceRow[]>([])
  const [attSummary, setAttSummary] = useState<{ days: number; hours: number; schoolYear: string } | null>(null)
  const [attTarget, setAttTarget] = useState<{ label: string; days?: number; hours?: number } | null>(null)
  const [logDate, setLogDate] = useState(new Date().toISOString().slice(0, 10))
  const [logHours, setLogHours] = useState('')
  const [logNote, setLogNote] = useState('')
  const [savingAtt, setSavingAtt] = useState(false)

  // Gradebook
  const [gbRows, setGbRows] = useState<GradebookRow[]>([])
  const [gbSummaries, setGbSummaries] = useState<SubjectSummary[]>([])
  const [gbGpa, setGbGpa] = useState<number | null>(null)
  const [gradeSubject, setGradeSubject] = useState('')
  const [gradeAssignment, setGradeAssignment] = useState('')
  const [gradeValue, setGradeValue] = useState('')
  const [gradeDate, setGradeDate] = useState(new Date().toISOString().slice(0, 10))
  const [savingGrade, setSavingGrade] = useState(false)
  const [studentName, setStudentName] = useState('')

  // Subject options come from the student's grade level — but we don't know the
  // grade until verified. We re-derive from a fixed union for the picker.
  const allSubjects = Array.from(new Set(Object.values(SUBJECTS_BY_GRADE).flat())).sort()

  const verifyBody = {
    email,
    studentFirstName: studentFirst,
    studentLastName: studentLast,
    pin,
  }

  async function verify() {
    if (!email.trim() || !studentFirst.trim() || !studentLast.trim() || !/^\d{4}$/.test(pin)) {
      setError('Please fill in email, student name, and the 4-digit PIN.')
      return
    }
    setMode('loading')
    setError('')
    // Verify once by loading attendance; if it 200s, the family is real.
    const q = encodeURIComponent(JSON.stringify(verifyBody))
    try {
      const res = await fetch(`/api/attendance?q=${q}`)
      const data: AttendanceResponse = await res.json()
      if (!res.ok || !data.ok) {
        setMode('verify')
        setError(data?.error || 'Could not verify. Please try again.')
        return
      }
      setAttRows(data.rows || [])
      setAttSummary(data.summary || null)
      setAttTarget(data.target || null)
      setStudentName(data.student || `${studentFirst} ${studentLast}`)
      // Now load gradebook
      const gq = encodeURIComponent(JSON.stringify(verifyBody))
      const gres = await fetch(`/api/gradebook?q=${gq}`)
      const gdata: GradebookResponse = await gres.json()
      if (gres.ok && gdata.ok) {
        setGbRows(gdata.rows || [])
        setGbSummaries(gdata.summaries || [])
        setGbGpa(gdata.gpa ?? null)
      }
      setMode('ready')
    } catch {
      setMode('verify')
      setError('Network error. Please try again.')
    }
  }

  const refreshAttendance = useCallback(async () => {
    const q = encodeURIComponent(JSON.stringify(verifyBody))
    const res = await fetch(`/api/attendance?q=${q}`)
    const data: AttendanceResponse = await res.json()
    if (data.ok) {
      setAttRows(data.rows || [])
      setAttSummary(data.summary || null)
      setAttTarget(data.target || null)
    }
  }, [email, studentFirst, studentLast, pin])

  const refreshGradebook = useCallback(async () => {
    const q = encodeURIComponent(JSON.stringify(verifyBody))
    const res = await fetch(`/api/gradebook?q=${q}`)
    const data: GradebookResponse = await res.json()
    if (data.ok) {
      setGbRows(data.rows || [])
      setGbSummaries(data.summaries || [])
      setGbGpa(data.gpa ?? null)
    }
  }, [email, studentFirst, studentLast, pin])

  async function logDay(e: React.FormEvent) {
    e.preventDefault()
    setSavingAtt(true)
    setError('')
    setNotice('')
    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...verifyBody, date: logDate, hours: logHours || 0, note: logNote }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        setError(data?.error || 'Could not save.')
        return
      }
      setNotice(data.row ? `Logged ${data.row.date}${data.row.hours ? ` — ${data.row.hours} hrs` : ''}` : 'Saved.')
      setLogHours('')
      setLogNote('')
      await refreshAttendance()
    } catch {
      setError('Network error.')
    } finally {
      setSavingAtt(false)
    }
  }

  async function deleteDay(id: string) {
    setError('')
    try {
      const res = await fetch(`/api/attendance?id=${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(verifyBody),
      })
      if (res.ok) {
        setNotice('Removed.')
        await refreshAttendance()
      } else {
        const d = await res.json()
        setError(d?.error || 'Could not delete.')
      }
    } catch {
      setError('Network error.')
    }
  }

  async function addGrade(e: React.FormEvent) {
    e.preventDefault()
    setSavingGrade(true)
    setError('')
    setNotice('')
    try {
      const res = await fetch('/api/gradebook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...verifyBody,
          subjectName: gradeSubject,
          assignmentName: gradeAssignment,
          grade: gradeValue,
          date: gradeDate,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        setError(data?.error || 'Could not save grade.')
        return
      }
      setNotice(`Added ${gradeAssignment} (${gradeValue}%)`)
      setGradeSubject('')
      setGradeAssignment('')
      setGradeValue('')
      await refreshGradebook()
    } catch {
      setError('Network error.')
    } finally {
      setSavingGrade(false)
    }
  }

  async function deleteGrade(id: string) {
    setError('')
    try {
      const res = await fetch(`/api/gradebook?id=${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(verifyBody),
      })
      if (res.ok) {
        setNotice('Removed.')
        await refreshGradebook()
      } else {
        const d = await res.json()
        setError(d?.error || 'Could not delete.')
      }
    } catch {
      setError('Network error.')
    }
  }

  // Progress toward state requirement
  const progressPct = (() => {
    if (!attTarget || !attSummary) return null
    if (attTarget.days) return Math.min(100, Math.round((attSummary.days / attTarget.days) * 100))
    if (attTarget.hours) return Math.min(100, Math.round((attSummary.hours / attTarget.hours) * 100))
    return null
  })()

  if (mode === 'verify' || mode === 'error') {
    return (
      <div className="mx-auto max-w-md rounded-3xl border-2 border-emerald-200 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-3">
          <GraduationCap className="h-8 w-8 text-emerald-600" />
          <h2 className="text-xl font-bold text-gray-900">Student Records</h2>
        </div>
        <p className="mt-2 text-sm text-gray-600">
          Log school days and add grades for your enrolled student. Verify with the email you
          enrolled with + the student&apos;s name and PIN (last 4 of SSN).
        </p>
        <div className="mt-6 space-y-3">
          <input
            type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="Email used to enroll" required
            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-900 focus:border-emerald-500 focus:outline-none"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              value={studentFirst} onChange={(e) => setStudentFirst(e.target.value)}
              placeholder="Student first name" required
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-900 focus:border-emerald-500 focus:outline-none"
            />
            <input
              value={studentLast} onChange={(e) => setStudentLast(e.target.value)}
              placeholder="Last name" required
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-900 focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <input
            value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
            placeholder="PIN (last 4 of SSN)" inputMode="numeric" required
            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-900 focus:border-emerald-500 focus:outline-none"
          />
          {error && (
            <div className="flex items-start gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
            </div>
          )}
          <button
            onClick={verify}
            className="w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white hover:bg-emerald-700"
          >
            Verify & Open Records
          </button>
        </div>
      </div>
    )
  }

  if (mode === 'loading') {
    return (
      <div className="flex items-center justify-center gap-2 py-20 text-emerald-600">
        <Loader2 className="h-6 w-6 animate-spin" /> Verifying your family…
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {notice && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">
          <CheckCircle2 className="h-4 w-4 shrink-0" /> {notice}
        </div>
      )}
      {error && (
        <div className="flex items-start gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{studentName}</h2>
          <p className="text-sm text-gray-500">
            School year {attSummary?.schoolYear || '2026–2027'} · {attSummary?.days || 0} days ·{' '}
            {attSummary?.hours || 0} hrs
          </p>
        </div>
        <div className="flex gap-2">
          <a href={`/print/report-card/${''}`} className="hidden">print</a>
        </div>
      </div>

      {/* ===== ATTENDANCE ===== */}
      <section className="rounded-3xl border border-gray-200 bg-white p-6">
        <div className="flex items-center gap-2">
          <CalendarCheck2 className="h-6 w-6 text-emerald-600" />
          <h3 className="text-lg font-bold text-gray-900">Attendance</h3>
        </div>
        {attTarget && (
          <p className="mt-1 text-xs text-gray-500">State target: {attTarget.label}</p>
        )}
        {progressPct !== null && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-600">
              <span>Progress this year</span>
              <span>{progressPct}%</span>
            </div>
            <div className="mt-1 h-2.5 w-full rounded-full bg-gray-100">
              <div
                className="h-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}

        <form onSubmit={logDay} className="mt-4 grid gap-3 sm:grid-cols-4">
          <input
            type="date" value={logDate} onChange={(e) => setLogDate(e.target.value)} required
            className="rounded-xl border border-gray-300 px-3 py-2 text-gray-900 focus:border-emerald-500 focus:outline-none"
          />
          <input
            type="number" min="0" max="24" step="0.5" value={logHours}
            onChange={(e) => setLogHours(e.target.value)}
            placeholder="Hours (optional)"
            className="rounded-xl border border-gray-300 px-3 py-2 text-gray-900 focus:border-emerald-500 focus:outline-none"
          />
          <input
            value={logNote} onChange={(e) => setLogNote(e.target.value)}
            placeholder="Note (optional)"
            className="rounded-xl border border-gray-300 px-3 py-2 text-gray-900 focus:border-emerald-500 focus:outline-none sm:col-span-1"
          />
          <button
            type="submit" disabled={savingAtt}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {savingAtt ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Log School Day
          </button>
        </form>

        {attRows.length > 0 ? (
          <div className="mt-5 max-h-72 overflow-y-auto rounded-xl border border-gray-100">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Hours</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Note</th>
                  <th className="px-4 py-2" />
                </tr>
              </thead>
              <tbody>
                {attRows.map((r) => (
                  <tr key={r.id} className="border-t border-gray-100">
                    <td className="px-4 py-2 text-gray-800">{r.date}</td>
                    <td className="px-4 py-2 text-gray-800">{r.hours ? `${r.hours} hrs` : '—'}</td>
                    <td className="px-4 py-2 text-gray-500">{r.note || '—'}</td>
                    <td className="px-2 py-2 text-right">
                      <button onClick={() => deleteDay(r.id)} className="text-red-400 hover:text-red-600" aria-label="Delete day">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-5 text-sm text-gray-500">
            No school days logged yet. Tap &quot;Log School Day&quot; on the days you teach — it takes 3 seconds.
          </p>
        )}
      </section>

      {/* ===== GRADEBOOK ===== */}
      <section className="rounded-3xl border border-gray-200 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-emerald-600" />
            <h3 className="text-lg font-bold text-gray-900">Gradebook</h3>
          </div>
          {gbGpa !== null && (
            <div className="rounded-xl bg-emerald-50 px-4 py-1.5 text-sm font-bold text-emerald-800">
              GPA: {gbGpa.toFixed(2)}
            </div>
          )}
        </div>

        <form onSubmit={addGrade} className="mt-4 grid gap-3 sm:grid-cols-6">
          <select
            value={gradeSubject} onChange={(e) => setGradeSubject(e.target.value)} required
            className="rounded-xl border border-gray-300 px-3 py-2 text-gray-900 focus:border-emerald-500 focus:outline-none sm:col-span-2"
          >
            <option value="">Subject…</option>
            {allSubjects.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <input
            value={gradeAssignment} onChange={(e) => setGradeAssignment(e.target.value)}
            placeholder="Assignment (e.g. Ch 4 Test)" required
            className="rounded-xl border border-gray-300 px-3 py-2 text-gray-900 focus:border-emerald-500 focus:outline-none sm:col-span-2"
          />
          <input
            type="number" min="0" max="100" step="0.5" value={gradeValue}
            onChange={(e) => setGradeValue(e.target.value)} placeholder="Grade %" required
            className="rounded-xl border border-gray-300 px-3 py-2 text-gray-900 focus:border-emerald-500 focus:outline-none"
          />
          <button
            type="submit" disabled={savingGrade}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {savingGrade ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Add
          </button>
        </form>

        {gbSummaries.length > 0 ? (
          <div className="mt-5 space-y-5">
            {gbSummaries.map((s) => (
              <div key={s.subject} className="rounded-xl border border-gray-100 p-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900">{s.subject}</h4>
                  <span className="text-sm font-bold text-emerald-700">
                    {s.average !== null ? `${s.average}% (${s.letter})` : '—'}
                  </span>
                </div>
                <ul className="mt-2 space-y-1">
                  {s.entries.map((e) => (
                    <li key={e.id} className="flex items-center justify-between text-sm text-gray-600">
                      <span>{e.assignment_name} <span className="text-xs text-gray-400">({e.date})</span></span>
                      <span className="flex items-center gap-2">
                        <span className="font-medium text-gray-800">{e.grade}%</span>
                        <button onClick={() => deleteGrade(e.id)} className="text-red-400 hover:text-red-600" aria-label="Delete grade">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-5 text-sm text-gray-500">
            No grades added yet. Add assignments per subject — report cards and transcripts update automatically.
          </p>
        )}
      </section>
    </div>
  )
}
