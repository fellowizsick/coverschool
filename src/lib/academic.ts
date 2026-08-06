// Shared data access + math for the attendance + gradebook system.
// Used by the portal components, the report-card printer, and the transcript
// printer so all three show the same data.
import { createAdminClient } from '@/lib/supabase/server'
import { getStateLaw } from '@/lib/stateLaw'

export type AttendanceRow = {
  id: string
  enrollment_id: string
  date: string
  hours: number
  note: string | null
  created_at: string
}

export type GradebookRow = {
  id: string
  enrollment_id: string
  subject_name: string
  assignment_name: string
  grade: number
  date: string
  notes: string | null
  created_at: string
}

export type SubjectSummary = {
  subject: string
  entries: GradebookRow[]
  average: number | null
  letter: string
}

/** State attendance targets for the progress bar (from the researched law data). */
export function getAttendanceTarget(stateCode: string): { label: string; days?: number; hours?: number } | null {
  const law = getStateLaw(stateCode)
  if (!law) return null
  const att = (law.attendance || '').toLowerCase()
  if (att.includes('180 days')) return { label: '180 days per year', days: 180 }
  if (att.includes('1,000 hours') || att.includes('1000 hours')) return { label: '1,000 hours per year', hours: 1000 }
  if (att.includes('900 hours')) return { label: '900 hours per year', hours: 900 }
  if (att.includes('regular')) return { label: 'Regular instruction (no set minimum)', days: 180 }
  return { label: 'State requirement — see guide', days: 180 }
}

/** Fetch attendance for one enrollment (newest first). */
export async function getAttendance(enrollmentId: string): Promise<AttendanceRow[]> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('attendance')
    .select('*')
    .eq('enrollment_id', enrollmentId)
    .order('date', { ascending: false })
  if (error) {
    console.error('getAttendance error:', error)
    return []
  }
  return (data || []) as AttendanceRow[]
}

/** Attendance summary: days logged, total hours, and the current school year. */
export function summarizeAttendance(rows: AttendanceRow[]): {
  days: number
  hours: number
  schoolYear: string
} {
  const days = rows.length
  const hours = rows.reduce((sum, r) => sum + (Number(r.hours) || 0), 0)
  // School year label: Aug 1 – Jul 31, e.g. "2026–2027"
  const now = new Date()
  const startYear = now.getMonth() >= 7 ? now.getFullYear() : now.getFullYear() - 1
  return { days, hours: Math.round(hours * 10) / 10, schoolYear: `${startYear}–${startYear + 1}` }
}

/** Fetch all gradebook entries for one enrollment (newest first). */
export async function getGradebook(enrollmentId: string): Promise<GradebookRow[]> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('gradebook_entries')
    .select('*')
    .eq('enrollment_id', enrollmentId)
    .order('date', { ascending: false })
  if (error) {
    console.error('getGradebook error:', error)
    return []
  }
  return (data || []) as GradebookRow[]
}

/** Numeric 0–100 → letter grade. */
export function gradeToLetter(avg: number): string {
  if (avg >= 90) return 'A'
  if (avg >= 80) return 'B'
  if (avg >= 70) return 'C'
  if (avg >= 60) return 'D'
  return 'F'
}

/** Letter → 4.0 points (matches transfer-grades.ts convention). */
export function letterToGpaPoints(letter: string): number {
  const map: Record<string, number> = {
    A: 4.0, B: 3.0, C: 2.0, D: 1.0, F: 0.0,
  }
  return map[letter] ?? 0
}

/** Group gradebook rows by subject, with per-subject average + letter. */
export function summarizeGradebook(rows: GradebookRow[]): SubjectSummary[] {
  const bySubject = new Map<string, GradebookRow[]>()
  for (const r of rows) {
    const key = (r.subject_name || 'General').trim() || 'General'
    if (!bySubject.has(key)) bySubject.set(key, [])
    bySubject.get(key)!.push(r)
  }
  const summaries: SubjectSummary[] = []
  for (const [subject, entries] of bySubject.entries()) {
    const nums = entries.map((e) => Number(e.grade) || 0)
    const average = nums.length ? Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 10) / 10 : null
    summaries.push({
      subject,
      entries: [...entries].sort((a, b) => (a.date < b.date ? 1 : -1)),
      average,
      letter: average !== null ? gradeToLetter(average) : '—',
    })
  }
  return summaries.sort((a, b) => a.subject.localeCompare(b.subject))
}

/** Cumulative GPA from the per-subject averages (simple 4.0, no credit weighting). */
export function computeGradebookGpa(summaries: SubjectSummary[]): number | null {
  const letters = summaries
    .map((s) => s.letter)
    .filter((l) => l !== '—')
  if (letters.length === 0) return null
  const total = letters.reduce((sum, l) => sum + letterToGpaPoints(l), 0)
  return Math.round((total / letters.length) * 100) / 100
}

export function formatGpa(gpa: number | null): string {
  if (gpa === null) return '—'
  return gpa.toFixed(2)
}
