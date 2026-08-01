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
    const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    const { createAdminClient } = await import('@/lib/supabase/server')
    const supabase = createAdminClient()

    // Look up this enrollment so we know which plan they're on and their email
    const { data: enrollment } = await supabase
      .from('enrollments')
      .select('*')
      .eq('id', enrollmentId)
      .maybeSingle()

    // 🎁 REFERRAL: if this family has awarded referral credits, apply them
    // (for yearly one-time payments we deduct $45; for monthly the credit is
    // applied to their next subscription invoice via the webhook instead).
    let referralDiscount = null
    if (enrollment && isYearly) {
      const { data: credits } = await supabase
        .from('referral_credits')
        .select('*')
        .eq('referrer_email', enrollment.email)
        .eq('status', 'awarded')
        .is('applied_at', null)
        .limit(1)

      if (credits && credits.length > 0) {
        const coupon = await stripe.coupons.create({
          name: 'LCA Referral Reward',
          amount_off: REFERRAL_CREDIT_AMOUNT,
          currency: 'usd',
          duration: 'once',
          max_redemptions: 1,
          metadata: { referral_credit_id: credits[0].id },
        })
        referralDiscount = { coupon: coupon.id, creditId: credits[0].id }
      }
    }

    const lineItems = []
    if (isYearly) {
      // Annual: one payment of $450 covers one school year
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Larose Christian Academy — Full Year Tuition',
            description: `Student: ${studentName} | Parent: ${parentName} | School Year 2026-2027`,
          },
          unit_amount: 45000, // $450
        },
        quantity: 1,
      })
    } else {
      // Monthly: $45/mo for 10-month school year
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Larose Christian Academy — Monthly Tuition (10-month school year)',
            description: `Student: ${studentName} | Parent: ${parentName}`,
          },
          unit_amount: 4500,
          recurring: {
            interval: 'month',
          },
        },
        quantity: 1,
      })
    }

    const sessionData = {
      mode: isYearly ? 'payment' : 'subscription',
      payment_method_types: ['card'],
      customer_email: email,
      metadata: {
        enrollment_id: enrollmentId,
        billing: isYearly ? 'yearly' : 'monthly',
        referral_credit_id: referralDiscount?.creditId || '',
      },
      line_items: lineItems,
      success_url: `${origin}/enroll/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/enroll/cancel`,
    }

    // Apply the referral discount to yearly one-time payments ($450 → $405)
    if (referralDiscount) {
      sessionData.discounts = [{ coupon: referralDiscount.coupon }]
    }

    // For monthly, add auto-cancel after 10 months
    if (!isYearly) {
      sessionData.subscription_data = {
        cancel_at: Math.floor(new Date('2027-06-01T00:00:00Z').getTime() / 1000),
        metadata: {
          enrollment_id: enrollmentId,
          type: 'school_year_tuition',
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
