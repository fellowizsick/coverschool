// @ts-nocheck
import { NextResponse } from 'next/server'

/**
 * POST /api/diploma-checkout
 * Creates a Stripe checkout session for a diploma exam fee.
 * type: 'test_fee'  -> amount depends on enrollment ($50 enrolled / $200 not)
 *        'paper_fee' -> $75 paper diploma + mailing
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, email, studentName, isEnrolled, examId } = body

    const secretKey = process.env.STRIPE_SECRET_KEY
    if (!secretKey) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
    }

    let amount = 0
    let productName = ''
    let description = ''

    if (type === 'test_fee') {
      amount = isEnrolled ? 5000 : 20000 // $50 enrolled / $200 not-enrolled
      productName = `Larose Christian Academy — Diploma Exam Fee (${isEnrolled ? 'Enrolled Student' : 'Non-Enrolled'})`
      description = `Diploma assessment test fee for ${studentName}. ${isEnrolled ? '$50 enrolled rate' : '$200 standard rate'}.`
    } else if (type === 'paper_fee') {
      amount = 7500 // $75 paper diploma + mailing
      productName = 'Larose Christian Academy — Paper Diploma & Mailing'
      description = `Printed, signed paper diploma plus USPS mailing for ${studentName}.`
    } else {
      return NextResponse.json({ error: 'Invalid fee type' }, { status: 400 })
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
            product_data: { name: productName, description },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        type: type,
        exam_id: examId || '',
        student_name: studentName || '',
        is_enrolled: String(!!isEnrolled),
      },
      success_url: `${origin}/exam?paid=${type}`,
      cancel_url: `${origin}/exam?canceled=true`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Diploma checkout error:', err)
    return NextResponse.json({ error: 'Failed to create diploma checkout' }, { status: 500 })
  }
}
