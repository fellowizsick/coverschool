// @ts-nocheck
import { NextResponse } from 'next/server'

const REFERRAL_CREDIT_AMOUNT = 4500 // $45.00 in cents

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  const secretKey = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!secretKey || !webhookSecret) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
  }

  const Stripe = require('stripe')
  const stripe = new Stripe(secretKey)

  let event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Handle checkout.session.completed
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const enrollmentId = session.metadata?.enrollment_id

    if (!enrollmentId) {
      console.error('No enrollment_id in session metadata')
      return NextResponse.json({ error: 'Missing enrollment_id' }, { status: 400 })
    }

    // Use admin client (service_role key) to bypass RLS for webhook operations
    const { createAdminClient } = await import('@/lib/supabase/server')
    const supabase = createAdminClient()

    // Auto-approve the enrollment and mark payment as paid
    const { error: updateError } = await supabase
      .from('enrollments')
      .update({
        status: 'approved',
        payment_status: 'paid',
        stripe_customer_id: session.customer,
        stripe_subscription_id: session.subscription,
      })
      .eq('id', enrollmentId)

    if (updateError) {
      console.error('Failed to update enrollment:', updateError)
      return NextResponse.json({ error: 'Update failed' }, { status: 500 })
    }

    // 🎁 If this session used yearly referral discounts, mark those credits applied
    const usedCreditIds = session.metadata?.referral_credit_ids
    if (usedCreditIds) {
      const ids = usedCreditIds.split(',').filter(Boolean)
      for (const id of ids) {
        await supabase
          .from('referral_credits')
          .update({ status: 'applied', applied_at: new Date().toISOString() })
          .eq('id', id)
      }
      console.log(`🎁 Yearly referral credits [${ids.join(', ')}] marked applied`)
    }

    // Also create a student record
    const { data: enrollment } = await supabase
      .from('enrollments')
      .select('*')
      .eq('id', enrollmentId)
      .single()

    if (enrollment) {
      const { error: studentError } = await supabase.from('students').insert({
        first_name: enrollment.student_first_name,
        last_name: enrollment.student_last_name,
        grade: enrollment.student_grade,
        dob: enrollment.student_dob,
        enrollment_id: enrollmentId,
        status: 'active',
      })

      if (studentError) {
        console.error('Failed to create student record:', studentError)
      }

      // Send enrollment confirmation email with curriculum book info
      const { sendEnrollmentEmail } = await import('@/lib/email')
      await sendEnrollmentEmail({
        to: enrollment.email,
        parentName: `${enrollment.parent_first_name} ${enrollment.parent_last_name}`,
        studentName: `${enrollment.student_first_name} ${enrollment.student_last_name}`,
        grade: enrollment.student_grade,
      })

      // 🎁 REFERRAL AWARD: this new family paid, so credit their referrer
      if (enrollment.referred_by_code) {
        await awardReferralCredit(supabase, stripe, enrollment)
      }
    }

    console.log(`✅ Enrollment ${enrollmentId} approved via Stripe payment`)
  }

  // Handle subscription cancelled
  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object
    console.log(`❌ Subscription ${subscription.id} cancelled`)
    // Mark the matching enrollment cancelled in DB
    const { createAdminClient } = await import('@/lib/supabase/server')
    const admin = createAdminClient()
    await admin
      .from('enrollments')
      .update({ status: 'cancelled', stripe_subscription_id: null, payment_status: 'cancelled' })
      .eq('stripe_subscription_id', subscription.id)
  }

  return NextResponse.json({ received: true })
}

/**
 * Award a $45 referral credit to the family whose code was used.
 * Monthly referrers get the credit applied to their next Stripe invoice
 * (one month free). Yearly referrers keep an 'awarded' credit that is
 * deducted from their next yearly checkout.
 */
async function awardReferralCredit(supabase, stripe, referredEnrollment) {
  try {
    const code = referredEnrollment.referred_by_code

    // Find the referrer's enrollment by code
    const { data: referrer, error: refErr } = await supabase
      .from('enrollments')
      .select('*')
      .eq('referral_code', code)
      .maybeSingle()

    if (refErr || !referrer) {
      console.error('Referral: referrer not found for code', code, refErr)
      return
    }

    // 🛡️ ANTI-EXPLOIT: only award credit if the referrer is a REAL paying customer.
    // Prevents farming credits with fake/pending enrollments.
    if (referrer.status !== 'approved' || referrer.payment_status !== 'paid') {
      console.log(`Referral: referrer ${referrer.email} not approved/paid — skipping credit`)
      return
    }

    // Idempotency guard: only one credit per referred enrollment
    const { data: existing } = await supabase
      .from('referral_credits')
      .select('id')
      .eq('referred_enrollment_id', referredEnrollment.id)
      .maybeSingle()
    if (existing) {
      console.log('Referral: credit already awarded for', referredEnrollment.id)
      return
    }

    // Insert the credit ledger row (status awarded)
    const { data: creditRow, error: insertErr } = await supabase
      .from('referral_credits')
      .insert({
        referrer_enrollment_id: referrer.id,
        referred_enrollment_id: referredEnrollment.id,
        referrer_email: referrer.email,
        amount: REFERRAL_CREDIT_AMOUNT / 100,
        status: 'awarded',
      })
      .select()
      .single()

    if (insertErr || !creditRow) {
      console.error('Referral: failed to insert credit', insertErr)
      return
    }

    // If the referrer pays monthly (has a subscription), attach the credit
    // to their subscription so the next invoice is $0 — one month free.
    // TIGHTENED: count how many free months were ALREADY consumed (open/paid
    // invoices carrying the LCA referral coupon) so a late-arriving referral
    // never re-grants months that were already billed. N unused credits = N
    // free months; the counter stays accurate.
    if (referrer.stripe_subscription_id) {
      // 1) Query the subscription's real invoice history for consumed months
      let consumedMonths = 0
      try {
        const invoices = await stripe.invoices.list({
          subscription: referrer.stripe_subscription_id,
          limit: 24,
        })
        consumedMonths = invoices.data.filter(
          (inv) =>
            (inv.status === 'open' || inv.status === 'paid') &&
            inv.discounts?.some(
              (d) => d.coupon?.name === 'LCA Referral Reward'
            )
        ).length
      } catch (invErr) {
        console.error('Referral: failed to list invoices', invErr)
      }

      // 2) Total credits ever awarded to this referrer (includes the new one)
      const { data: allCredits } = await supabase
        .from('referral_credits')
        .select('id, created_at, applied_at')
        .eq('referrer_enrollment_id', referrer.id)

      const totalCredits = allCredits?.length ?? 1
      const remaining = Math.max(0, totalCredits - consumedMonths)

      // 3) Mark the already-consumed credits as applied (oldest first, never
      //    the brand-new credit — it hasn't been billed yet)
      if (consumedMonths > 0) {
        const consumedCredits = (allCredits || [])
          .filter((c) => !c.applied_at && c.id !== creditRow.id)
          .sort((a, b) => (a.created_at > b.created_at ? 1 : -1))
          .slice(0, consumedMonths)
        for (const c of consumedCredits) {
          await supabase
            .from('referral_credits')
            .update({ status: 'applied', applied_at: new Date().toISOString() })
            .eq('id', c.id)
        }
      }

      // 4) Attach a repeating coupon only for the months still actually owed
      if (remaining > 0) {
        const coupon = await stripe.coupons.create({
          name: 'LCA Referral Reward',
          amount_off: REFERRAL_CREDIT_AMOUNT,
          currency: 'usd',
          duration: 'repeating',
          duration_in_months: remaining,
          max_redemptions: remaining,
          metadata: { referral_credit_id: creditRow.id },
        })

        await supabase
          .from('referral_credits')
          .update({ stripe_coupon_id: coupon.id })
          .eq('id', creditRow.id)

        try {
          await stripe.subscriptions.update(referrer.stripe_subscription_id, {
            coupon: coupon.id,
          })
          console.log(`🎁 Coupon (${remaining} free month${remaining > 1 ? 's' : ''}) attached to subscription ${referrer.stripe_subscription_id} (${consumedMonths} already consumed)`)
        } catch (subErr) {
          console.error('Referral: failed to attach coupon to subscription', subErr)
        }
      } else {
        console.log(`Referral: all ${totalCredits} credits already consumed — no new coupon`)
      }
    }

    console.log(`🎁 Referral credit $45 awarded to ${referrer.email} (referred by ${code})`)
  } catch (err) {
    console.error('Referral award error:', err)
  }
}
