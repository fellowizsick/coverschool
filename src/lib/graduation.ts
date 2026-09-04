// LCA Graduation Engine — credit-ledger core.
// Seamless: a student graduates the moment the credit ledger meets requirements,
// regardless of grade level or entry point (transfers, acceleration, prior learning).
// Admin attests; detection + diploma issuance are automatic.
import { createAdminClient } from '@/lib/supabase/server'

export type GraduationRequirement = {
  id: string
  subject: string
  required_credits: number
  display_order: number
  active: boolean
}

export type CreditRow = {
  id: string
  enrollment_id: string
  subject: string
  course_name: string
  credits: number
  source: 'lca' | 'transfer' | 'dual_credit' | 'prior_learning' | 'testing'
  verification_status: 'verified' | 'pending' | 'rejected'
  earned_date: string | null
  notes: string | null
}

export type GraduationStatus = 'in_progress' | 'complete' | 'graduated'

export type GraduationComputed = {
  earned: number
  totalRequired: number
  met: boolean
  completeBySubject: { subject: string; required: number; earned: number; met: boolean }[]
}

/** Total required credits from active requirements. */
export async function getGraduationRequirements(): Promise<GraduationRequirement[]> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('graduation_requirements')
    .select('*')
    .order('display_order', { ascending: true })
  if (error) {
    console.error('getGraduationRequirements error:', error.message)
    return []
  }
  return (data || []) as GraduationRequirement[]
}

/** The full credit ledger for one enrollment (newest first). */
export async function getCreditLedger(enrollmentId: string): Promise<CreditRow[]> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('student_credits')
    .select('*')
    .eq('enrollment_id', enrollmentId)
    .order('created_at', { ascending: false })
  if (error) {
    console.error('getCreditLedger error:', error.message)
    return []
  }
  return (data || []) as CreditRow[]
}

/** Sum verified credits only (pending/rejected never count). */
export function earnedBySubject(ledger: CreditRow[]): Record<string, number> {
  const out: Record<string, number> = {}
  for (const r of ledger) {
    if (r.verification_status !== 'verified') continue
    const key = r.subject.trim() || 'General'
    out[key] = (out[key] || 0) + Number(r.credits || 0)
  }
  return out
}

/** Compute graduation state: earned vs required, per-subject + total. */
export function computeGraduation(
  requirements: GraduationRequirement[],
  ledger: CreditRow[],
): GraduationComputed {
  const earned = earnedBySubject(ledger)
  const activeReqs = requirements.filter((r) => r.active)
  let totalRequired = 0
  let totalEarned = 0
  const completeBySubject = []
  for (const req of activeReqs) {
    totalRequired += Number(req.required_credits || 0)
  }
  for (const req of activeReqs) {
    const e = earned[req.subject] || 0
    const m = e >= Number(req.required_credits || 0)
    completeBySubject.push({
      subject: req.subject,
      required: Number(req.required_credits || 0),
      earned: Math.round(e * 100) / 100,
      met: m,
    })
    totalEarned += Math.min(e, Number(req.required_credits || 0)) // cap at required per subject
  }
  const met = activeReqs.length > 0 && completeBySubject.every((s) => s.met)
  return {
    earned: Math.round(totalEarned * 100) / 100,
    totalRequired: Math.round(totalRequired * 100) / 100,
    met,
    completeBySubject,
  }
}

/** Auto compute + return the resulting status string for an enrollment. */
export async function getGraduationStatus(requirement: GraduationRequirement[], ledger: CreditRow[]) {
  const computed = computeGraduation(requirement, ledger)
  return {
    status: computed.met ? 'complete' : 'in_progress',
    computed,
  }
}

/** Add a credit row. Transfer / prior-learning enters as 'pending' (needs Anne verify). */
export async function addCredit(
  enrollmentId: string,
  opts: {
    subject: string
    course_name: string
    credits: number
    source: CreditRow['source']
    earned_date?: string | null
    notes?: string | null
    verification_status?: CreditRow['verification_status']
  },
): Promise<{ ok: boolean; id?: string; error?: string }> {
  const supabase = createAdminClient()
  const autoVerified = opts.source === 'lca' || opts.source === 'testing'
  const verification_status =
    opts.verification_status ?? (autoVerified ? 'verified' : 'pending')
  const { data, error } = await supabase
    .from('student_credits')
    .insert({
      enrollment_id: enrollmentId,
      subject: opts.subject.trim(),
      course_name: opts.course_name.trim(),
      credits: Number(opts.credits || 0),
      source: opts.source,
      verification_status,
      earned_date: opts.earned_date || null,
      notes: opts.notes || null,
    })
    .select('id')
    .single()
  if (error) return { ok: false, error: error.message }
  return { ok: true, id: data.id }
}

/** Anne verifies (or rejects) a pending transfer credit. */
export async function setCreditVerification(
  creditId: string,
  verification: 'verified' | 'rejected',
): Promise<{ ok: boolean; error?: string }> {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('student_credits')
    .update({ verification_status: verification })
    .eq('id', creditId)
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

/** Auto-flip an enrollment to 'complete' when a ledger change meets requirements. */
export async function refreshGraduationStatus(enrollmentId: string): Promise<void> {
  const supabase = createAdminClient()
  const [reqs, ledger] = await Promise.all([
    getGraduationRequirements(),
    getCreditLedger(enrollmentId),
  ])
  const { status } = await getGraduationStatus(reqs, ledger)
  // Only auto-advance in_progress -> complete. Never auto-attest (graduated requires admin).
  if (status === 'complete') {
    const { data } = await supabase
      .from('enrollments')
      .select('graduation_status')
      .eq('id', enrollmentId)
      .single()
    const cur: string = data?.graduation_status || 'in_progress'
    if (cur === 'in_progress') {
      await supabase
        .from('enrollments')
        .update({ graduation_status: 'complete' })
        .eq('id', enrollmentId)
    }
  }
}

export function makeDiplomaNumber(gradYear: number, seq: number): string {
  const padded = String(seq).padStart(4, '0')
  return `LCA-${gradYear}-${padded}`
}

/** Map a parent's free-text transfer subject onto the school's graduation
 *  requirement subject names (so credits land in the right bucket). Falls back
 *  to the raw subject if no match. */
export function mapTransferSubject(subject: string, requirementSubjects: string[]): string {
  const s = (subject || '').trim().toLowerCase()
  if (!s) return 'Electives'
  const aliases: Record<string, string[]> = {
    English: ['english', 'language arts', 'language', 'reading', 'literature', 'grammar', 'writing', 'spelling'],
    Mathematics: ['math', 'mathematics', 'algebra', 'geometry', 'calculus', 'trigonometry', 'arithmetic'],
    Science: ['science', 'biology', 'chemistry', 'physics', 'earth science', 'anatomy'],
    'Social Studies': ['social studies', 'history', 'geography', 'government', 'civics', 'economics'],
    'Foreign Language': ['foreign language', 'spanish', 'french', 'german', 'latin', 'language 2'],
    'Fine Arts': ['fine arts', 'art', 'music', 'band', 'choir', 'drama', 'theater', 'drawing'],
    'Health / Physical Education': ['health', 'physical education', 'pe', 'phys ed', 'gym', 'health / physical education'],
    Electives: ['elective', 'computer', 'typing', 'keyboarding', 'home economics', 'shop', 'bible', 'technology'],
  }
  // Prefer a requirement-subject that IS one of the canonical names.
  const canonical = requirementSubjects.find((r) => r.trim().toLowerCase() === s)
  if (canonical) return canonical
  // Then match against the alias table.
  for (const [req, keys] of Object.entries(aliases)) {
    if (keys.some((k) => s === k || s.includes(k) || k.includes(s))) return req
  }
  return (subject || '').trim() || 'Electives'
}

/** A transfer grade earns credit if it's a passing mark (A/B/C/D or numeric >=60). */
export function creditsFromTransferGrade(grade: string): number {
  const g = (grade || '').trim().toUpperCase()
  if (/^[A-D][+-]?$/.test(g)) return 1.0
  const num = parseFloat(g)
  if (!isNaN(num)) return num >= 60 ? 1.0 : 0.0
  return 0.0
}

/**
 * Auto-pull a family's transfer grades into the graduation credit ledger.
 * - Creates a pending 'transfer' credit for each passing transfer grade,
 *   mapped onto a graduation requirement subject.
 * - IDEMPOTENT: links each credit to its transfer_grades row via
 *   transfer_grade_id, so re-saving never duplicates.
 * - RESPECTS SCHOOL EDITS: if the school has already verified or rejected a
 *   credit, this never overwrites it. If still pending, it re-syncs the
 *   subject/credits in case the parent corrected a typo.
 * - Removes auto-credits whose source grade was deleted.
 */
export async function syncTransferGradesToCredits(enrollmentId: string): Promise<void> {
  const supabase = createAdminClient()
  const [reqs, gradesRes] = await Promise.all([
    getGraduationRequirements(),
    supabase.from('transfer_grades').select('*').eq('enrollment_id', enrollmentId),
  ])
  const grades = (gradesRes.data || []) as any[]
  const reqSubjects = reqs.filter((r) => r.active).map((r) => r.subject)

  // Current auto credits (linked to a transfer grade) for this enrollment.
  const { data: existing } = await supabase
    .from('student_credits')
    .select('*')
    .eq('enrollment_id', enrollmentId)
    .eq('source', 'transfer')
    .not('transfer_grade_id', 'is', null)
  const existingByGrade = new Map<string, any>((existing || []).map((c: any) => [c.transfer_grade_id, c]))

  const liveGradeIds = new Set<string>()
  for (const g of grades) {
    liveGradeIds.add(g.id)
    const credits = creditsFromTransferGrade(g.grade_earned)
    const subject = mapTransferSubject(g.subject_name, reqSubjects)
    const courseName = (g.school_name || '').trim() || `${g.subject_name} (transfer)`
    const row = existingByGrade.get(g.id)
    if (row) {
      // Only refresh if the school hasn't made a call on it yet.
      if (row.verification_status === 'pending') {
        await supabase.from('student_credits').update({
          subject,
          course_name: courseName,
          credits,
          earned_date: g.year_completed || null,
        }).eq('id', row.id)
      }
    } else if (credits > 0) {
      await supabase.from('student_credits').insert({
        enrollment_id: enrollmentId,
        subject,
        course_name: courseName,
        credits,
        source: 'transfer',
        verification_status: 'pending',
        earned_date: g.year_completed || null,
        transfer_grade_id: g.id,
        notes: 'Auto-pulled from previous-school records.',
      })
    }
  }

  // Remove auto credits whose source grade was deleted.
  const orphans = (existing || []).filter((c: any) => !liveGradeIds.has(c.transfer_grade_id))
  for (const o of orphans) {
    await supabase.from('student_credits').delete().eq('id', o.id)
  }

  await refreshGraduationStatus(enrollmentId)
}
