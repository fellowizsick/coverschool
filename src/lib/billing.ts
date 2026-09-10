// 💳 ACCURATE "next payment due" for the parent portal.
//
// The ONLY source of truth for when a family is charged is STRIPE. We must never
// guess from the enrollment row: a referral credit (free months) is applied as a
// Stripe discount, and while that discount is active the upcoming invoices are
// $0. So the date a family ACTUALLY pays next = the first renewal that falls
// AFTER the discount's end date.
//
// Example (Marie Young): period ends 2026-10-04, discount ends 2026-12-09.
//   Oct 4 ≤ Dec 9 → $0 (covered)
//   Nov 4 ≤ Dec 9 → $0 (covered)
//   Dec 4 ≤ Dec 9 → $0 (covered)
//   Jan 4 >  Dec 9 → CHARGED  → next payment = 2027-01-04, 3 free months.
//
// Stripe API notes (2026 version, verified live):
//  • `current_period_end` lives on the subscription ITEM, not the root object.
//  • discounts arrive as a `discounts` ARRAY of IDs → must be expanded.
//  • a discount's `end` is a unix ts; the coupon duration lives on the coupon.

export type BillingKind =
  | 'card'      // active recurring subscription
  | 'cash'      // paid in person, no recurring charge
  | 'none'      // no subscription and not cash (nothing to show)
  | 'canceled'  // subscription canceled
  | 'past_due'  // a payment failed and is owed NOW
  | 'unknown'   // Stripe unreachable / not configured — fail quiet

export type BillingInfo = {
  kind: BillingKind
  nextPaymentDate: string | null   // ISO yyyy-mm-dd (UTC) of the next NON-ZERO charge
  amountCents: number | null
  freeMonths: number               // upcoming $0 invoices covered by a credit
  freeUntil: string | null         // ISO date the credit stops applying
  freeForever: boolean             // a forever-discount covers all future invoices
  endsOn: string | null            // subscription ends (cancel_at_period_end)
  interval: 'month' | 'year' | null
}

const EMPTY: BillingInfo = {
  kind: 'none',
  nextPaymentDate: null,
  amountCents: null,
  freeMonths: 0,
  freeUntil: null,
  freeForever: false,
  endsOn: null,
  interval: null,
}

// ── tiny cache so a page render doesn't hammer Stripe ────────────────────────
const CACHE_TTL_MS = 5 * 60 * 1000
const cache = new Map<string, { at: number; value: BillingInfo }>()

function iso(ms: number | null): string | null {
  if (ms === null) return null
  return new Date(ms).toISOString().slice(0, 10)
}

// Add N billing intervals, clamping the day for short months (Jan 31 + 1mo → Feb 28).
function addInterval(fromMs: number, interval: 'month' | 'year', n: number): number {
  const d = new Date(fromMs)
  if (interval === 'year') {
    d.setUTCFullYear(d.getUTCFullYear() + n)
    return d.getTime()
  }
  const day = d.getUTCDate()
  d.setUTCDate(1)
  d.setUTCMonth(d.getUTCMonth() + n)
  const lastDay = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate()
  d.setUTCDate(Math.min(day, lastDay))
  return d.getTime()
}

export async function getBillingInfo(opts: {
  email?: string | null
  customerId?: string | null
  subscriptionId?: string | null
}): Promise<BillingInfo> {
  const cacheKey = `${opts.subscriptionId || ''}|${opts.customerId || ''}|${(opts.email || '').toLowerCase()}`
  const hit = cache.get(cacheKey)
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) return hit.value

  const finish = (v: BillingInfo) => {
    cache.set(cacheKey, { at: Date.now(), value: v })
    return v
  }

  const key = process.env.STRIPE_SECRET_KEY
  if (!key) return finish({ ...EMPTY, kind: 'unknown' })

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Stripe = require('stripe')
    const stripe = new Stripe(key)

    // ── resolve the subscription (stored id → customer id → email) ──────────
    type Sub = any
    let sub: Sub | null = null
    const isLive = (s: Sub) =>
      ['active', 'trialing', 'past_due', 'unpaid'].includes(s?.status)

    if (opts.subscriptionId) {
      try {
        const s = await stripe.subscriptions.retrieve(opts.subscriptionId, { expand: ['discounts'] })
        if (isLive(s)) sub = s
        else sub = s // keep it so we can report 'canceled'
      } catch { /* fall through */ }
    }

    if (!sub) {
      let customerIds: string[] = []
      if (opts.customerId) customerIds = [opts.customerId]
      if (!customerIds.length && opts.email) {
        const found = await stripe.customers.list({ email: opts.email, limit: 3 })
        customerIds = found.data.map((c: Sub) => c.id)
      }
      for (const cid of customerIds) {
        const list = await stripe.subscriptions.list({
          customer: cid,
          status: 'all',
          limit: 5,
          expand: ['data.discounts'],
        })
        const live = list.data.find(isLive)
        if (live) { sub = live; break }
        if (!sub && list.data[0]) sub = list.data[0]
      }
    }

    if (!sub) return finish(EMPTY)

    // ── read the period end (ITEM level in this API version) ────────────────
    const item = sub.items?.data?.[0] ?? null
    const periodEndSec: number | null = item?.current_period_end ?? sub.current_period_end ?? null
    const interval: 'month' | 'year' | null =
      item?.price?.recurring?.interval === 'year' ? 'year'
      : item?.price?.recurring?.interval === 'month' ? 'month'
      : null
    const amountCents: number | null =
      typeof item?.price?.unit_amount === 'number'
        ? item.price.unit_amount * (item.quantity ?? 1)
        : null
    const endsOn = sub.cancel_at_period_end ? iso((periodEndSec ?? 0) * 1000) : null

    if (sub.status === 'past_due' || sub.status === 'unpaid') {
      return finish({ kind: 'past_due', nextPaymentDate: null, amountCents, freeMonths: 0, freeUntil: null, freeForever: false, endsOn, interval })
    }
    if (['canceled', 'incomplete_expired'].includes(sub.status)) {
      return finish({ kind: 'canceled', nextPaymentDate: null, amountCents, freeMonths: 0, freeUntil: null, freeForever: false, endsOn, interval })
    }

    // ── work out credit (free months) from the active discounts ──────────────
    const discounts: any[] = Array.isArray(sub.discounts) ? sub.discounts : []
    let maxEndMs: number | null = null
    let onceCount = 0
    let freeForever = false

    for (const d of discounts) {
      if (typeof d === 'string') continue // not expanded — skip rather than guess
      const endMs = typeof d?.end === 'number' ? d.end * 1000 : null
      if (endMs) {
        if (maxEndMs === null || endMs > maxEndMs) maxEndMs = endMs
        continue
      }
      // No end date → could be 'once' (1 invoice) or 'forever'. Ask the coupon.
      const couponRef = d?.source?.coupon ?? d?.coupon ?? null
      let duration: string | null = null
      if (typeof couponRef === 'string') {
        try {
          const c = await stripe.coupons.retrieve(couponRef)
          duration = c?.duration ?? null
        } catch { /* unknown duration */ }
      } else if (couponRef && typeof couponRef === 'object') {
        duration = couponRef.duration ?? null
      }
      if (duration === 'forever') freeForever = true
      else if (duration === 'once') onceCount += 1
    }

    // ── walk forward to the first invoice that is NOT covered ────────────────
    let cursorMs: number
    if (periodEndSec) cursorMs = periodEndSec * 1000
    else return finish({ ...EMPTY, kind: 'card', amountCents, freeMonths: 0, freeForever, endsOn, interval })

    if (freeForever) {
      return finish({ kind: 'card', nextPaymentDate: null, amountCents, freeMonths: 999, freeUntil: null, freeForever: true, endsOn, interval })
    }

    let freeMonths = 0
    const step = interval || 'month'
    let guard = 0
    for (let i = 0; i < onceCount && guard < 120; i++) { cursorMs = addInterval(cursorMs, step, 1); freeMonths++; guard++ }
    if (maxEndMs !== null) {
      while (cursorMs <= maxEndMs && guard < 120) {
        cursorMs = addInterval(cursorMs, step, 1)
        freeMonths++
        guard++
      }
    }

    return finish({
      kind: 'card',
      nextPaymentDate: endsOn ? null : iso(cursorMs),
      amountCents,
      freeMonths,
      freeUntil: maxEndMs !== null ? iso(maxEndMs) : null,
      freeForever: false,
      endsOn,
      interval,
    })
  } catch (err) {
    console.error('getBillingInfo error:', err)
    return finish({ ...EMPTY, kind: 'unknown' })
  }
}
