import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { isAuthorizedAdmin } from '@/lib/adminAccess'

/**
 * ADMIN ONLY — flip a student between PAID and NOT PAID.
 *
 * Jonathan: "if somebody does pay cash, we can just approve them right there in that thing."
 *
 * Marking PAID records `payment_status = 'cash'` (money received in person). Cash is its own
 * status, deliberately distinct from a card payment — see src/lib/enrollment-status.ts, where
 * `paid` and `cash` both count as "has paid".
 *
 * Every flip writes payment_status_updated_at + payment_status_updated_by. This changes money
 * state, so it must be traceable.
 */
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email || !isAuthorizedAdmin(user.email)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  const { enrollmentId, paid } = body
  if (!enrollmentId || typeof paid !== 'boolean') {
    return NextResponse.json({ error: 'enrollmentId and paid are required' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { data: existing } = await admin
    .from('enrollments')
    .select('id, payment_status, payment_method, student_first_name, student_last_name')
    .eq('id', enrollmentId)
    .maybeSingle()

  if (!existing) return NextResponse.json({ error: 'not found' }, { status: 404 })

  const now = new Date().toISOString()
  // ⚠️ `enrollments_payment_status_check` allows ONLY: pending | paid | refunded | cancelled | cash.
  // 'unpaid' is NOT a legal value — setting it throws a check-constraint violation (HTTP 500).
  // "Not paid" is `pending` in this database.
  const patch: Record<string, unknown> = {
    payment_status: paid ? 'cash' : 'pending',
    payment_status_updated_at: now,
    payment_status_updated_by: user.email,
  }

  // Marking paid in person means the money was cash, and the student is fully enrolled.
  if (paid) {
    patch.payment_method = 'cash'
    patch.status = 'approved'
  }

  const { error } = await admin.from('enrollments').update(patch).eq('id', enrollmentId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // ⚠️ If this was a real card subscription, marking them unpaid does NOT cancel Stripe —
  // the card keeps being charged. Tell the UI so it can warn instead of silently misleading.
  const warning =
    !paid && existing.payment_method === 'card'
      ? 'This student pays by card. Their Stripe subscription is still active and will keep charging — cancel it in Stripe too.'
      : null

  return NextResponse.json({
    ok: true,
    enrollmentId,
    // 'pending' is this database's word for "not paid" — see the constraint note above.
    payment_status: paid ? 'cash' : 'pending',
    warning,
  })
}
