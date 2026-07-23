// @ts-nocheck
import { NextResponse } from 'next/server'

/**
 * POST /api/pay-paperwork
 * Creates a one-time Stripe checkout for paperwork fees
 */
export async function POST(request: Request) {
  try {
    const { enrollmentId, email, studentName, parentName } = await request.json()

    if (!enrollmentId || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Annual registration fee: $75 per school year
    const PAPERWORK_FEE_AMOUNT = 7500 // $75 in cents

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
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Larose Christian Academy — Annual Registration Fee',
              description: `Annual registration fee for: ${studentName} | Parent: ${parentName}. Covers enrollment file setup, transcript initiation, and record-keeping system configuration for the school year.`,
            },
            unit_amount: PAPERWORK_FEE_AMOUNT,
          },
          quantity: 1,
        },
      ],
      metadata: {
        enrollment_id: enrollmentId,
        type: 'annual_registration',
        student_name: studentName,
      },
      success_url: `${origin}/enroll/success?session_id={CHECKOUT_SESSION_ID}&paperwork=paid`,
      cancel_url: `${origin}/enroll/success?session_id={CHECKOUT_SESSION_ID}&paperwork=pending`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Paperwork fee checkout error:', err)
    return NextResponse.json(
      { error: 'Failed to create paperwork fee checkout' },
      { status: 500 }
    )
  }
}
