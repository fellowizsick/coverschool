import { Card, CardContent } from '@/components/ui/Card'
import { CalendarClock, CheckCircle2, Gift, AlertTriangle, CreditCard, Banknote } from 'lucide-react'
import type { BillingInfo } from '@/lib/billing'

// 💳 Parent-facing billing summary. Shows the ACCURATE next payment date,
// including any free months earned from referrals (Stripe discount).
function fmtDate(isoStr: string | null): string {
  if (!isoStr) return '—'
  const d = new Date(`${isoStr}T00:00:00Z`)
  return d.toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC',
  })
}
function fmtMoney(cents: number | null): string {
  if (cents === null) return ''
  return `$${(cents / 100).toFixed(2)}`
}

export default function NextPaymentCard({ billing }: { billing: BillingInfo | null }) {
  if (!billing) return null
  const { kind } = billing
  if (kind === 'none' || kind === 'unknown') return null

  // ── Cash family: no recurring charge at all ──────────────────────────────
  if (kind === 'cash') {
    return (
      <Card className="mt-6 border-emerald-200 bg-emerald-50/40">
        <CardContent className="flex items-center gap-3 p-5">
          <Banknote className="h-6 w-6 shrink-0 text-emerald-600" />
          <div>
            <p className="font-semibold text-gray-900">Paid in Cash</p>
            <p className="text-sm text-gray-600">
              No monthly payment is due — this family paid in person.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // ── Payment failed / owed now ────────────────────────────────────────────
  if (kind === 'past_due') {
    return (
      <Card className="mt-6 border-red-300 bg-red-50">
        <CardContent className="flex items-center gap-3 p-5">
          <AlertTriangle className="h-6 w-6 shrink-0 text-red-600" />
          <div>
            <p className="font-semibold text-red-900">Payment Due Now</p>
            <p className="text-sm text-red-800">
              Your last payment didn&apos;t go through. Please update your card below so your
              student stays enrolled.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // ── Canceled ─────────────────────────────────────────────────────────────
  if (kind === 'canceled') {
    return (
      <Card className="mt-6">
        <CardContent className="flex items-center gap-3 p-5">
          <CheckCircle2 className="h-6 w-6 shrink-0 text-gray-400" />
          <div>
            <p className="font-semibold text-gray-900">Membership Canceled</p>
            <p className="text-sm text-gray-600">No further payments are scheduled.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // ── Active card subscription ─────────────────────────────────────────────
  const hasCredit = billing.freeForever || billing.freeMonths > 0
  const amount = fmtMoney(billing.amountCents)

  return (
    <Card
      className={`mt-6 ${hasCredit ? 'border-emerald-300 bg-gradient-to-br from-emerald-50 to-white' : 'border-gray-200'}`}
    >
      <CardContent className="p-5">
        {/* Free-months banner (referral credit) */}
        {hasCredit && (
          <div className="mb-4 flex items-start gap-3 rounded-lg border border-emerald-300 bg-emerald-100/70 p-3">
            <Gift className="h-5 w-5 shrink-0 text-emerald-700 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-emerald-900">
                {billing.freeForever
                  ? 'You have free tuition — no payments due'
                  : `${billing.freeMonths} free month${billing.freeMonths === 1 ? '' : 's'} applied`}
              </p>
              <p className="text-emerald-800">
                {billing.freeForever
                  ? 'A referral credit covers all future months.'
                  : `Your referral credit runs through ${fmtDate(billing.freeUntil)}. You won't be charged until it ends.`}
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {billing.endsOn ? (
              <CheckCircle2 className="h-6 w-6 shrink-0 text-gray-400" />
            ) : (
              <CalendarClock className={`h-6 w-6 shrink-0 ${hasCredit ? 'text-emerald-600' : 'text-gray-500'}`} />
            )}
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                {billing.endsOn ? 'Membership Ends' : 'Next Payment Due'}
              </p>
              <p className={`text-lg font-semibold ${hasCredit ? 'text-emerald-800' : 'text-gray-900'}`}>
                {billing.endsOn ? fmtDate(billing.endsOn) : fmtDate(billing.nextPaymentDate)}
              </p>
            </div>
          </div>

          {!billing.endsOn && amount && (
            <div className="text-right">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Amount</p>
              <p className={`text-lg font-semibold ${hasCredit ? 'text-emerald-800' : 'text-gray-900'}`}>
                {amount}
                <span className="text-sm font-normal text-gray-500">
                  {' '}/ {billing.interval === 'year' ? 'year' : 'month'}
                </span>
              </p>
            </div>
          )}
        </div>

        {billing.endsOn && (
          <p className="mt-3 flex items-center gap-2 text-sm text-gray-600">
            <CreditCard className="h-4 w-4 text-gray-400" />
            Your membership is set to end on this date. You can restart anytime.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
