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

    // 🎁 DONATION: sessions with type=donation have no enrollment — record + mark paid
    if (session.metadata?.type === 'donation') {
      const { createAdminClient } = await import('@/lib/supabase/server')
      const supabase = createAdminClient()
      await supabase
        .from('donations')
        .update({
          status: 'paid',
          stripe_payment_intent: session.payment_intent || null,
        })
        .eq('stripe_session_id', session.id)
      console.log(`🎗️ Donation recorded: $${(session.amount_total || 0) / 100} (session ${session.id})`)
      return NextResponse.json({ received: true })
    }

    const enrollmentId = session.metadata?.enrollment_id

    if (!enrollmentId) {
      console.error('No enrollment_id in session metadata')
      return NextResponse.json({ error: 'Missing enrollment_id' }, { status: 400 })
    }

    // Use admin client (service_role key) to bypass RLS for webhook operations
    const { createAdminClient } = await import('@/lib/supabase/server')
    const supabase = createAdminClient()

    // 👨‍👩‍👧‍👦 MULTI-CHILD: the session metadata carries ALL sibling enrollment ids
    // (comma-separated). Approve every child in the family — never just one.
    const enrollmentIds = (session.metadata?.enrollment_ids || enrollmentId)
      .split(',')
      .map((s: string) => s.trim())
      .filter(Boolean)

    // Auto-approve ALL enrollments in this family and mark payment as paid
    const { error: updateError } = await supabase
      .from('enrollments')
      .update({
        status: 'approved',
        payment_status: 'paid',
        stripe_customer_id: session.customer,
        stripe_subscription_id: session.subscription,
      })
      .in('id', enrollmentIds)

    if (updateError) {
      console.error('Failed to update enrollments:', updateError)
      return NextResponse.json({ error: 'Update failed' }, { status: 500 })
    }

    // ⏰ Monthly auto-cancel after 10 months (2026-08-03 fix; 2026-08-04 corrected)
    // Stripe v22+ removed `cancel_at` from Checkout Session subscription_data,
    // so create-checkout stores the target timestamp on the SUBSCRIPTION's
    // metadata (subscription_data.metadata). The webhook must read it from the
    // subscription itself — the session's own metadata never carries it.
    if (session.subscription) {
      try {
        const sub = await stripe.subscriptions.retrieve(session.subscription)
        const autoCancelAt = Number(sub.metadata?.auto_cancel_at)
        if (autoCancelAt > 0) {
          await stripe.subscriptions.update(session.subscription, {
            cancel_at: autoCancelAt,
            metadata: {
              enrollment_id: enrollmentId,
              enrollment_ids: enrollmentIds.join(','),
              type: 'school_year_tuition',
            },
          })
          console.log(`⏰ Auto-cancel set for subscription ${session.subscription} at ${autoCancelAt} (${new Date(autoCancelAt * 1000).toISOString()})`)
        } else {
          console.log(`⏰ No auto_cancel_at on subscription ${session.subscription} metadata — skipping auto-cancel`)
        }
      } catch (err) {
        console.error('Failed to set auto-cancel on subscription:', err)
        // Non-fatal: payment already succeeded, enrollment approved.
      }
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

    // Fetch ALL approved enrollments in this family
    const { data: enrollments } = await supabase
      .from('enrollments')
      .select('*')
      .in('id', enrollmentIds)
      .order('created_at', { ascending: true })

    if (enrollments && enrollments.length > 0) {
      // Create ONE student record per child
      for (const enrollment of enrollments) {
        const { error: studentError } = await supabase.from('students').insert({
          first_name: enrollment.student_first_name,
          last_name: enrollment.student_last_name,
          grade: enrollment.student_grade,
          dob: enrollment.student_dob,
          enrollment_id: enrollment.id,
          status: 'active',
        })

        if (studentError) {
          console.error(`Failed to create student record for ${enrollment.id}:`, studentError)
        }
      }

      // Send ONE enrollment confirmation email listing ALL children
      const parent = enrollments[0]
      const allChildren = enrollments
        .map((e) => `${e.student_first_name} ${e.student_last_name}`)
        .join(', ')
      const { sendEnrollmentEmail } = await import('@/lib/email')
      await sendEnrollmentEmail({
        to: parent.email,
        parentName: `${parent.parent_first_name} ${parent.parent_last_name}`,
        studentName: allChildren,
        grade: enrollments.map((e) => e.student_grade).join(', '),
      })

      // 🎁 REFERRAL AWARD: this new family paid, so credit their referrer.
      // Only the PRIMARY row carries referred_by_code → exactly one credit.
      const primary = enrollments.find((e) => e.id === enrollmentId) || enrollments[0]
      if (primary.referred_by_code) {
        await awardReferralCredit(supabase, stripe, primary)
      }
    }

    console.log(`✅ ${enrollments?.length || 1} enrollment(s) approved via Stripe payment [${enrollmentIds.join(', ')}]`)
  }

  // Handle subscription cancelled
  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object
    console.log(`❌ Subscription ${subscription.id} cancelled`)
    // Mark ALL matching enrollments cancelled in DB
    const { createAdminClient } = await import('@/lib/supabase/server')
    const admin = createAdminClient()
    const subMeta = subscription.metadata || {}
    if (subMeta.enrollment_ids) {
      const ids = subMeta.enrollment_ids.split(',').filter(Boolean)
      await admin
        .from('enrollments')
        .update({ status: 'cancelled', stripe_subscription_id: null, payment_status: 'cancelled' })
        .in('id', ids)
    } else {
      await admin
        .from('enrollments')
        .update({ status: 'cancelled', stripe_subscription_id: null, payment_status: 'cancelled' })
        .eq('stripe_subscription_id', subscription.id)
    }
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

    // Idempotency guard: only one credit per referred family. Check ALL rows of
    // the referred family's group so a multi-child family earns exactly one.
    const familyGroup = referredEnrollment.family_group_id
    let alreadyCredited = false
    if (familyGroup) {
      const { data: siblings } = await supabase
        .from('enrollments')
        .select('id')
        .eq('family_group_id', familyGroup)
      const siblingIds = (siblings || []).map((s) => s.id)
      if (siblingIds.length > 0) {
        const { data: existingCredits } = await supabase
          .from('referral_credits')
          .select('id')
          .in('referred_enrollment_id', siblingIds)
          .limit(1)
        alreadyCredited = (existingCredits || []).length > 0
      }
    }
    if (!alreadyCredited) {
      const { data: existing } = await supabase
        .from('referral_credits')
        .select('id')
        .eq('referred_enrollment_id', referredEnrollment.id)
        .maybeSingle()
      alreadyCredited = Boolean(existing)
    }
    if (alreadyCredited) {
      console.log('Referral: credit already awarded for family group', familyGroup || referredEnrollment.id)
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
