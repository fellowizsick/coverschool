// @ts-nocheck
import { NextResponse } from 'next/server'

const REFERRAL_CREDIT_AMOUNT = 4500 // $45.00 in cents

export async function POST(request: Request) {
  try {
    const { enrollmentId, email, studentName, parentName, billing } = await request.json()
    const isYearly = billing === 'yearly'

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
    // clearly (per-student billing, never per-family).
    const lineItems = groupEnrollments.map((e) => {
      const childName = `${e.student_first_name} ${e.student_last_name}`
      if (isYearly) {
        // Annual: $450 per student, one payment covers one school year
        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Larose Christian Academy — Full Year Tuition',
              description: `Student: ${childName} | Parent: ${parentName || enrollment.parent_first_name + ' ' + enrollment.parent_last_name} | School Year 2026-2027`,
            },
            unit_amount: 45000, // $450 per student
          },
          quantity: 1,
        }
      }
      // Monthly: $45/mo per student for 10-month school year
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Larose Christian Academy — Monthly Tuition (10-month school year)',
            description: `Student: ${childName} | Parent: ${parentName || enrollment.parent_first_name + ' ' + enrollment.parent_last_name}`,
          },
          unit_amount: 4500,
          recurring: {
            interval: 'month',
          },
        },
        quantity: 1,
      }
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
