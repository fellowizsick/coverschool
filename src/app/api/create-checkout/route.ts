// @ts-nocheck
import { NextResponse } from 'next/server'

const REFERRAL_CREDIT_AMOUNT = 4500 // $45.00 in cents

export async function POST(request: Request) {
  try {
    const { enrollmentId, email, studentName, parentName, billing, assistance } = await request.json()
    const isYearly = billing === 'yearly'
    // 🆕 FAMILY ASSISTANCE (2026-08-15): optional — monthly plan only.
    // Half the first payment now ($60), other half on the month-2 invoice.
    // Full-pay families (assistance=false) are 100% unchanged.
    const isAssistance = !isYearly && assistance === true

    if (!enrollmentId || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const secretKey = process.env.STRIPE_SECRET_KEY
    if (!secretKey) {
      return NextResponse.json(
        { error: 'Stripe not configured' },
        { status: 500 }
      )
    }

    const Stripe = require('stripe')
    const stripe = new Stripe(secretKey)
    // Canonical domain — always laroseca.org, never the vercel.app URL (user rule).
    const origin = 'https://laroseca.org'

    const { createAdminClient } = await import('@/lib/supabase/server')
    const supabase = createAdminClient()

    // Look up this enrollment so we know which plan they're on and their email
    const { data: enrollment } = await supabase
      .from('enrollments')
      .select('*')
      .eq('id', enrollmentId)
      .maybeSingle()

    if (!enrollment) {
      return NextResponse.json(
        { error: 'Enrollment not found' },
        { status: 404 }
      )
    }

    // 👨‍👩‍👧‍👦 MULTI-CHILD: fetch ALL siblings in this family group so the
    // checkout charges per student, not per family. If this enrollment has no
    // family_group_id (legacy row), it's just the one student.
    let groupEnrollments = [enrollment]
    if (enrollment.family_group_id) {
      const { data: siblings } = await supabase
        .from('enrollments')
        .select('*')
        .eq('family_group_id', enrollment.family_group_id)
        .order('created_at', { ascending: true })
      if (siblings && siblings.length > 0) {
        groupEnrollments = siblings
      }
    }
    const groupIds = groupEnrollments.map((e) => e.id)
    const studentCount = groupEnrollments.length

    // 🎁 REFERRAL: if this family has awarded referral credits, apply them
    // (for yearly one-time payments we deduct $45 × count; for monthly the credit
    // is applied to their next subscription invoice via the webhook instead).
    let referralDiscount = null
    if (enrollment && isYearly) {
      const { data: credits } = await supabase
        .from('referral_credits')
        .select('*')
        .eq('referrer_email', enrollment.email)
        .eq('status', 'awarded')
        .is('applied_at', null)

      if (credits && credits.length > 0) {
        const totalOff = REFERRAL_CREDIT_AMOUNT * credits.length
        const coupon = await stripe.coupons.create({
          name: 'LCA Referral Reward',
          amount_off: totalOff,
          currency: 'usd',
          duration: 'once',
          max_redemptions: 1,
          metadata: { referral_credit_ids: credits.map((c) => c.id).join(',') },
        })
        referralDiscount = { coupon: coupon.id, creditIds: credits.map((c) => c.id) }
      }
    }

    // One line item PER STUDENT so the Stripe page shows each child's charge
    // clearly (per-student billing, never per-family). Every new student's FIRST
    // payment includes the one-time $75 registration fee + tuition, so the first
    // month totals $120/child ($75 + $45), then $45/mo per child after that.
    // 🆕 FAMILY ASSISTANCE: the first payment is split — $60 now (half) and the
    // other $60 on the month-2 invoice. With assistance the one-time reg fee line
    // is only $15 (the $45 first tuition makes the total $60), and the webhook
    // adds the remaining $60 as an invoice item on the next billing cycle.
    const REG_FEE_CENTS = 7500 // $75 per student, one-time
    const ASSISTANCE_REG_FEE_CENTS = 1500 // $15 now under assistance ($45 tuition brings first payment to $60)
    const ASSISTANCE_DEFERRED_CENTS = 6000 // $60 remaining half → month-2 invoice via webhook
    const lineItems = groupEnrollments.flatMap((e) => {
      const childName = `${e.student_first_name} ${e.student_last_name}`
      const parentLabel = parentName || enrollment.parent_first_name + ' ' + enrollment.parent_last_name
      // 🧾 One-time registration fee ($75 per student — or $15 now under Family
      // Assistance with the remaining $60 charged on the month-2 invoice)
      const regFeeItem = {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Larose Christian Academy — One-Time Registration Fee',
            description: `Registration fee for: ${childName} | Parent: ${parentLabel}. Covers student file setup, transcript initiation, and record-keeping configuration.`,
          },
          unit_amount: isAssistance ? ASSISTANCE_REG_FEE_CENTS : REG_FEE_CENTS,
        },
        quantity: 1,
      }
      if (isYearly) {
        // Annual: $450 tuition + $75 reg fee per student, one payment
        return [
          regFeeItem,
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Larose Christian Academy — Full Year Tuition',
                description: `Student: ${childName} | Parent: ${parentLabel} | School Year 2026-2027`,
              },
              unit_amount: 45000, // $450 per student
            },
            quantity: 1,
          },
        ]
      }
      // Monthly: $45/mo tuition per student + $75 one-time reg fee
      return [
        regFeeItem,
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Larose Christian Academy — Monthly Tuition (10-month school year)',
              description: `Student: ${childName} | Parent: ${parentLabel}`,
            },
            unit_amount: 4500,
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ]
    })

    const sessionData = {
      mode: isYearly ? 'payment' : 'subscription',
      payment_method_types: ['card'],
      customer_email: email,
      metadata: {
        enrollment_id: enrollmentId,
        // 👨‍👩‍👧‍👦 All sibling enrollment ids so the webhook approves every child
        enrollment_ids: groupIds.join(','),
        billing: isYearly ? 'yearly' : 'monthly',
        // 🆕 FAMILY ASSISTANCE: tells the webhook to defer the remaining $60
        assistance: isAssistance ? 'true' : 'false',
        referral_credit_ids: referralDiscount?.creditIds?.join(',') || '',
      },
      line_items: lineItems,
      success_url: `${origin}/enroll/success?session_id={CHECKOUT_SESSION_ID}&enrollment_id=${enrollmentId}`,
      cancel_url: `${origin}/enroll/cancel`,
    }

    // Apply the referral discount to yearly one-time payments ($450 → $405)
    if (referralDiscount) {
      sessionData.discounts = [{ coupon: referralDiscount.coupon }]
    }

    // For monthly, add auto-cancel after 10 months.
    // NOTE (2026-08-03): Stripe v22+ removed `cancel_at` from Checkout Session
    // subscription_data (parameter_unknown error). Auto-cancel is now applied in
    // the webhook after subscription creation via subscriptions.update(cancel_at).
    if (!isYearly) {
      sessionData.subscription_data = {
        metadata: {
          enrollment_id: enrollmentId,
          enrollment_ids: groupIds.join(','),
          type: 'school_year_tuition',
          auto_cancel_at: Math.floor(new Date('2027-06-01T00:00:00Z').getTime() / 1000),
        },
      }
    }

    const session = await stripe.checkout.sessions.create(sessionData)

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe checkout error:', err)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
