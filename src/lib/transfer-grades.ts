// Shared data access for previous-school (transfer) grades.
// Used by the print report-card + transcript pages so both show the same data.
import { createAdminClient } from '@/lib/supabase/server'

export type TransferGrade = {
  id: string
  enrollment_id: string
  student_name: string | null
  subject_name: string
  grade_earned: string
  year_completed: string | null
  school_name: string | null
  created_at: string
}

/** Letter-to-grade-point map for a simple 4.0 GPA (honors/AP not distinguished). */
export function letterToPoints(grade: string): number | null {
  const g = (grade || '').trim().toUpperCase()
  const map: Record<string, number> = {
    'A+': 4.0, 'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0, 'D-': 0.7,
    'F': 0.0,
  }
  if (map[g] !== undefined) return map[g]
  // Numeric grades: 90+ = A, 80s = B, 70s = C, 60s = D, else F
  const num = parseFloat(g)
  if (!isNaN(num)) {
    if (num >= 90) return 4.0
    if (num >= 80) return 3.0
    if (num >= 70) return 2.0
    if (num >= 60) return 1.0
    return 0.0
  }
  return null
}

/** Fetch all transfer grades for one enrollment, newest school year first. */
export async function getTransferGrades(enrollmentId: string): Promise<TransferGrade[]> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('transfer_grades')
    .select('*')
    .eq('enrollment_id', enrollmentId)
    .order('year_completed', { ascending: false })
    .order('created_at', { ascending: true })

  if (error) {
    console.error('getTransferGrades error:', error)
    return []
  }
  return (data || []) as TransferGrade[]
}

/** Group transfer grades by school name, preserving school order (most recent first). */
export function groupBySchool(grades: TransferGrade[]): { school: string; rows: TransferGrade[] }[] {
  const order: string[] = []
  const map = new Map<string, TransferGrade[]>()
  for (const g of grades) {
    const school = (g.school_name || 'Previous School').trim() || 'Previous School'
    if (!map.has(school)) {
      map.set(school, [])
      order.push(school)
    }
    map.get(school)!.push(g)
  }
  return order.map((school) => ({ school, rows: map.get(school)! }))
}

/**
 * Group transfer grades by academic year (chronological, newest first) — the
 * standard layout for an official transcript. Each group carries the school name
 * for that year plus a per-year GPA.
 */
export function groupByYear(grades: TransferGrade[]): {
  year: string
  school: string
  rows: TransferGrade[]
  gpa: number | null
}[] {
  const order: string[] = []
  const map = new Map<string, TransferGrade[]>()
  const schoolByYear = new Map<string, string>()
  for (const g of grades) {
    const year = (g.year_completed || 'Unknown Year').trim() || 'Unknown Year'
    if (!map.has(year)) {
      map.set(year, [])
      order.push(year)
    }
    map.get(year)!.push(g)
    const school = (g.school_name || '').trim()
    if (school) schoolByYear.set(year, school)
  }
  // Newest first: 2024-2025 before 2023-2024; Unknown Year goes last.
  order.sort((a, b) => {
    if (a === 'Unknown Year') return 1
    if (b === 'Unknown Year') return -1
    return b.localeCompare(a)
  })
  return order.map((year) => ({
    year,
    school: schoolByYear.get(year) || 'Previous School',
    rows: map.get(year)!,
    gpa: computeGpa(map.get(year)!),
  }))
}

/** Compute a simple cumulative GPA from letter/numeric grades. Null if no gradeable rows. */
export function computeGpa(grades: TransferGrade[]): number | null {
  const points = grades
    .map((g) => letterToPoints(g.grade_earned))
    .filter((p): p is number => p !== null)
  if (points.length === 0) return null
  const avg = points.reduce((a, b) => a + b, 0) / points.length
  return Math.round(avg * 100) / 100
}

/** Format a GPA like 3.85 or 4.00 */
export function formatGpa(gpa: number | null): string {
  if (gpa === null) return '—'
  return gpa.toFixed(2)
}
