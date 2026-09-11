/**
 * The missing wire between the gradebook and the credit ledger.
 *
 * WHY THIS EXISTS (2026-09-11)
 * The school had two academic systems that never spoke:
 *
 *   gradebook_entries  ← parents enter assignment grades here (via /records)
 *                      → read by the TRANSCRIPT and REPORT CARD. Works.
 *
 *   student_credits    ← the credit ledger
 *                      → read by the GRADUATION CHECK and the DIPLOMA GATE. Works.
 *
 * Nothing carried a completed course from the first into the second. A student could
 * finish four years of coursework with a complete transcript and still show ZERO credits
 * toward graduation — meaning the diploma gate was reading a ledger nobody ever fills.
 * In practice it required hand-entering every course twice.
 *
 * Jonathan: "all those curriculums are supposed to work together with this transcript page.
 * Is there any way you can get this to where it's working together in one full system and
 * where it's like guaranteed working?"
 *
 * WHAT THIS DOES
 * Derives one Carnegie-unit credit (1.0, the standard for a full-year course) for each
 * subject-year a student has actually been graded in, and writes it to `student_credits`
 * with source 'lca'. It is IDEMPOTENT — running it a hundred times produces the same
 * ledger — and it only ever touches rows it created itself, so a credit Anne added by
 * hand is never overwritten or deleted.
 *
 * It does NOT count a subject until MIN_ENTRIES grades exist, so one stray assignment
 * cannot mint a credit.
 */
import { createAdminClient } from '@/lib/supabase/server'
import { getGradebook, summarizeGradebook } from '@/lib/academic'
import { getGraduationRequirements, mapTransferSubject, type GraduationRequirement } from '@/lib/graduation'

/** A full-year course is one Carnegie unit — the same basis the state 24-credit model uses. */
const CREDIT_PER_COURSE_YEAR = 1.0

/** Grades needed in a subject-year before it can represent a completed course. */
const MIN_ENTRIES = 3

/** Passing average (D). Mirrors creditsFromTransferGrade's standard. */
const PASS_MARK = 60

/** Derive the school year a grade belongs to, e.g. 2026-08-14 -> "2026-27". */
function schoolYear(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00`)
  if (Number.isNaN(d.getTime())) return 'unknown'
  const y = d.getFullYear()
  // A US school year rolls over in July/August.
  const startYear = d.getMonth() >= 6 ? y : y - 1
  return `${startYear}-${String((startYear + 1) % 100).padStart(2, '0')}`
}

/** Stable key identifying a credit this module owns. */
function derivedCourseName(subject: string, year: string): string {
  return `[auto] ${subject} — ${year}`
}

export type SyncResult = {
  added: number
  updated: number
  removed: number
  subjects: string[]
  skipped: { subject: string; reason: string }[]
}

/**
 * Reconcile one enrollment's gradebook into its credit ledger.
 * Safe to call after every gradebook write.
 */
export async function syncGradebookToCredits(enrollmentId: string): Promise<SyncResult> {
  const supabase = createAdminClient()
  const result: SyncResult = { added: 0, updated: 0, removed: 0, subjects: [], skipped: [] }

  const [rows, reqs, existingResp] = await Promise.all([
    getGradebook(enrollmentId),
    getGraduationRequirements(),
    supabase.from('student_credits').select('*').eq('enrollment_id', enrollmentId).eq('source', 'lca'),
  ])

  const existing = (existingResp.data || []) as { id: string; course_name: string }[]
  const existingByName = new Map(existing.map((c) => [c.course_name, c.id]))

  // Nothing graded yet -> remove any stale derived credits, leave manual ones alone.
  const wanted = new Map<string, { subject: string; courseName: string; credits: number; earned: string; average: number }>()

  if (rows.length > 0) {
    const summaries = summarizeGradebook(rows)
    const reqSubjects = reqs.map((r: GraduationRequirement) => r.subject)

    // Bucket each subject's entries by school year.
    const buckets = new Map<string, { subject: string; year: string; grades: number[]; last: string }>()
    for (const s of summaries) {
      const mapped = mapTransferSubject(s.subject, reqSubjects)
      for (const e of s.entries) {
        const year = schoolYear(e.date)
        const key = `${mapped}||${year}`
        const b = buckets.get(key) || { subject: mapped, year, grades: [], last: e.date }
        b.grades.push(Number(e.grade) || 0)
        if (e.date > b.last) b.last = e.date
        buckets.set(key, b)
      }
    }

    for (const b of buckets.values()) {
      const courseName = derivedCourseName(b.subject, b.year)
      if (b.grades.length < MIN_ENTRIES) {
        result.skipped.push({ subject: courseName, reason: `only ${b.grades.length} grade(s); needs ${MIN_ENTRIES}` })
        continue
      }
      const avg = b.grades.reduce((a, c) => a + c, 0) / b.grades.length
      if (avg < PASS_MARK) {
        result.skipped.push({ subject: courseName, reason: `average ${avg.toFixed(1)} below pass mark ${PASS_MARK}` })
        continue
      }
      wanted.set(courseName, {
        subject: b.subject,
        courseName,
        credits: CREDIT_PER_COURSE_YEAR,
        earned: b.last,
        average: Math.round(avg * 10) / 10,
      })
    }
  }

  // Add what is missing.
  for (const [courseName, w] of wanted) {
    if (existingByName.has(courseName)) continue
    const { error } = await supabase.from('student_credits').insert({
      enrollment_id: enrollmentId,
      subject: w.subject,
      course_name: courseName,
      credits: w.credits,
      // 'lca' is auto-verified by design — this is the school's own coursework.
      source: 'lca',
      verification_status: 'verified',
      earned_date: w.earned,
      notes: `Auto-derived from gradebook (average ${w.average})`,
    })
    if (!error) result.added++
  }

  // Refresh the ones that exist (credits/average can change as more grades land).
  for (const [courseName, w] of wanted) {
    const id = existingByName.get(courseName)
    if (!id) continue
    await supabase
      .from('student_credits')
      .update({ credits: w.credits, earned_date: w.earned, subject: w.subject, notes: `Auto-derived from gradebook (average ${w.average})` })
      .eq('id', id)
    result.updated++
  }

  // Remove derived credits whose coursework no longer justifies them (grades deleted).
  // Only ever touches rows this module created — a hand-added credit is never in `existing`.
  for (const c of existing) {
    if (!wanted.has(c.course_name)) {
      await supabase.from('student_credits').delete().eq('id', c.id)
      result.removed++
    }
  }

  result.subjects = [...wanted.keys()]
  return result
}
