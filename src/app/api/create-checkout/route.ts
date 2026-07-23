// @ts-nocheck
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { enrollmentId, email, studentName, parentName } = await request.json()

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

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: email,
      subscription_data: {
        // Auto-cancel after 10 months (end of school year)
        cancel_at: Math.floor(new Date('2027-06-01T00:00:00Z').getTime() / 1000),
        metadata: {
          enrollment_id: enrollmentId,
          type: 'school_year_tuition',
        },
      },
      line_items: [
        {
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
        },
      ],
      metadata: {
        enrollment_id: enrollmentId,
      },
      success_url: `${origin}/enroll/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/enroll/cancel`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe checkout error:', err)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
