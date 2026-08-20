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
    let { data: enrollment } = await supabase
      .from('enrollments')
      .select('*')
      .eq('id', enrollmentId)
      .maybeSingle()

    // 🔧 FIX 2026-08-18 (payment dead-end): the church-form "Continue to
    // Payment" button passes the family_group_id, not an enrollment id —
    // families finished the church form but got "Enrollment not found" and
    // never reached Stripe (Sherri Parker tried 3×). Fall back to the LATEST
    // enrollment in that family group so every path reaches checkout.
    if (!enrollment) {
      const { data: byFamily } = await supabase
        .from('enrollments')
        .select('*')
        .eq('family_group_id', enrollmentId)
        .order('created_at', { ascending: false })
        .limit(1)
      if (byFamily && byFamily.length > 0) {
        enrollment = byFamily[0]
      }
    }

    if (!enrollment) {
      return NextResponse.json(
        { error: 'Enrollment not found' },
        { status: 404 }
      )
    }

    // FIX 2026-08-20 (removed-child price bug): never open checkout from a
    // cancelled enrollment (removed child) — covers legacy rows with no
    // family_group_id that the group filter can't exclude.
    if (enrollment.status === 'cancelled') {
      return NextResponse.json(
        { error: 'This enrollment has been removed. Please contact the school if you need to re-enroll.' },
        { status: 400 }
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
        // FIX 2026-08-20 (removed-child price bug): exclude cancelled rows.
        // A removed child (remove-child marks status='cancelled') must NEVER be
        // charged again in a new checkout — previously a family that removed a
        // child then re-entered checkout would be billed for them again.
        .neq('status', 'cancelled')
        .order('created_at', { ascending: true })
      if (siblings && siblings.length > 0) {
        groupEnrollments = siblings
      }
    }
    const groupIds = groupEnrollments.map((e) => e.id)

    // ⛔ CHURCH FORM GATE (2026-08-16, user directive): payment cannot be
    // accepted until the Church / Home School Enrollment Form is completed for
    // EVERY student in the family. This blocks direct URL hits too.
    // FIX 2026-08-17: filter out duplicate enrollments for the same student
    // (same first+last name) — only check the LATEST one per student.
    const latestPerStudent = new Map()
    for (const e of groupEnrollments) {
      const key = `${(e.student_first_name || '').trim().toLowerCase()}|${(e.student_last_name || '').trim().toLowerCase()}`
      const existing = latestPerStudent.get(key)
      if (!existing || new Date(e.created_at) > new Date(existing.created_at)) {
        latestPerStudent.set(key, e)
      }
    }
    const dedupedEnrollments = Array.from(latestPerStudent.values())
    const missingChurchForm = dedupedEnrollments.filter((e) => e.church_form_status !== 'submitted')
    if (missingChurchForm.length > 0) {
      return NextResponse.json(
        { error: 'Please complete the Church / Home School Enrollment Form for every student before payment.' },
        { status: 400 }
      )
    }

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
    // FIX 2026-08-20 (double-charge bug, Sherri Bates): build line items from
    // dedupedEnrollments, NOT groupEnrollments — duplicate rows for the SAME
    // student (double-submit) previously charged the child twice on Stripe
    // ($240 instead of $120) and the parent abandoned checkout.
    const REG_FEE_CENTS = 7500 // $75 per student, one-time
    const lineItems = dedupedEnrollments.flatMap((e) => {
      const childName = `${e.student_first_name} ${e.student_last_name}`
      const parentLabel = parentName || enrollment.parent_first_name + ' ' + enrollment.parent_last_name
      // 🧾 One-time registration fee ($75 per student — included in the first payment)
      const regFeeItem = {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Larose Christian Academy — One-Time Registration Fee',
            description: `Registration fee for: ${childName} | Parent: ${parentLabel}. Covers student file setup, transcript initiation, and record-keeping configuration.`,
          },
          unit_amount: REG_FEE_CENTS,
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
