/**
 * What counts as "a student".
 *
 * A student joins the roster once the school has RECEIVED money — whether that came through
 * Stripe by card (`payment_status = 'paid'`) or in person in cash (`payment_status = 'cash'`).
 *
 * ⚠️ The cash feature (2026-09-09) introduced `'cash'` as its own status, deliberately distinct
 * from card `'paid'`. Any roster/stat query written before that only checked `'paid'`, which
 * silently hid every cash-enrolled student. Always use these helpers rather than comparing to
 * `'paid'` by hand.
 */

export const PAID_STATUSES = ['paid', 'cash'] as const

/** True when the family has paid by any method (card or cash). */
export function hasPaid(paymentStatus: string | null | undefined): boolean {
  return PAID_STATUSES.includes((paymentStatus ?? '') as (typeof PAID_STATUSES)[number])
}

/** True when money is still owed or the payment is unconfirmed. */
export function isUnpaid(paymentStatus: string | null | undefined): boolean {
  return paymentStatus === 'unpaid' || paymentStatus === 'pending'
}
