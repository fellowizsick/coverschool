// @ts-nocheck
import { NextResponse } from 'next/server'

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

    const lineItems = []
    if (isYearly) {
      // Annual: one payment of $450 for the full school year
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Larose Christian Academy — Full Year Tuition',
            description: `Student: ${studentName} | Parent: ${parentName} | School Year 2026-2027`,
          },
          unit_amount: 45000, // $450 = 10 months x $45
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
      },
      line_items: lineItems,
      success_url: `${origin}/enroll/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/enroll/cancel`,
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
