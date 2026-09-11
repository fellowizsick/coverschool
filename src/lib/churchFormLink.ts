/**
 * Build a Church / Home School Enrollment Form link for an EXISTING enrollment.
 *
 * WHY THIS EXISTS (2026-09-11)
 * Jonathan: "Are the parents who enroll there students not getting the church enrollment form
 * and filling them out?" — and the data said no. 4 of 5 enrollments had no form on file, and
 * 4 families had PAID without one.
 *
 * Reason: the form is handed out IN FLOW on the website (enroll -> church form -> pay), so it
 * only ever reached families who completed that browser journey. Two groups fell through:
 *
 *   1. CASH families. `/api/cash-enroll` (Mom entering a family who paid her in person) never
 *      mentioned the form at all — zero form handling. Every cash family was enrolled with no
 *      legal coverage.
 *   2. Anyone who abandoned the flow mid-way, or enrolled before the gate existed (Aug 16).
 *
 * The form page already understood `enrollment_id` and `already_paid=1`; nothing ever BUILT
 * such a link. This does. Mom can text or email it, the parent fills it at home, and
 * `/api/church-form` flips `church_form_status` to `submitted` exactly as the in-flow version
 * does.
 *
 * `already_paid=1` matters: a cash family has already paid, so the form must NOT send them on
 * to a payment step. The page shows "file complete" instead.
 */

export type ChurchFormLinkParts = {
  enrollmentId: string
  studentName?: string | null
  parentName?: string | null
  parentEmail?: string | null
  /** true when money has already changed hands (cash, or a card payment already taken). */
  alreadyPaid?: boolean
  /** 'cash' | 'monthly' | 'yearly' — only affects wording on the page. */
  billing?: string | null
}

/** Absolute URL for the fill-in form, safe to paste into a text message or email. */
export function churchFormUrl(parts: ChurchFormLinkParts, origin?: string): string {
  const base = (origin || process.env.NEXT_PUBLIC_SITE_URL || 'https://laroseca.org')
    .replace(/\/+$/, '')

  const p = [
    ['enrollment_id', parts.enrollmentId],
    ['group_id', parts.enrollmentId],
    ['student', parts.studentName || ''],
    ['parent', parts.parentName || ''],
    ['email', parts.parentEmail || ''],
    ['billing', parts.alreadyPaid ? 'cash' : (parts.billing || 'monthly')],
    ['already_paid', parts.alreadyPaid ? '1' : '0'],
  ]

  const qs = p
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
    .join('&')

  return `${base}/enroll/church-form?${qs}`
}

/** Shown to Mom so she can tell, at a glance, whether a family still owes the form. */
export function formOutstanding(churchFormStatus?: string | null): boolean {
  return (churchFormStatus ?? '') !== 'submitted'
}
