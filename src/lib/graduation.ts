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
