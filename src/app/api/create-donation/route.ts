// @ts-nocheck
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

/**
 * POST /api/create-donation
 * Body: { amount: number (in dollars, e.g. 50), email?, name?, message? }
 * Creates a Stripe Checkout session for a custom donation amount.
 * Same Stripe account as enrollment payments.
 */
export async function POST(request: Request) {
  try {
    const { amount, email, name, message } = await request.json()

    // Amount in dollars -> cents; validate sane range ($1 - $10,000)
    const dollars = Number(amount)
    if (!isFinite(dollars) || dollars < 1 || dollars > 10000) {
      return NextResponse.json(
        { error: 'Please choose an amount between $1 and $10,000.' },
        { status: 400 }
      )
    }
    const amountCents = Math.round(dollars * 100)

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

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: email || undefined,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Larose Christian Academy — Donation',
              description: message
                ? `Gift to Larose Christian Academy${name ? ` from ${name}` : ''}. "${message.slice(0, 200)}"`
                : `Gift to Larose Christian Academy${name ? ` from ${name}` : ''}. Thank you for supporting homeschool families!`,
            },
            unit_amount: amountCents,
          },
          quantity: 1,
        },
      ],
      metadata: {
        type: 'donation',
        amount_cents: String(amountCents),
        donor_name: name || '',
        donor_message: (message || '').slice(0, 500),
      },
      success_url: `${origin}/donate/success`,
      cancel_url: `${origin}/donate`,
    })

    // Store the pending donation row so the webhook can mark it paid
    const supabase = createAdminClient()
    await supabase.from('donations').insert({
      amount_cents: amountCents,
      email: email || null,
      name: name || null,
      message: message || null,
      stripe_session_id: session.id,
      status: 'pending',
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Donation checkout error:', err)
    return NextResponse.json(
      { error: 'Failed to create donation checkout' },
      { status: 500 }
    )
  }
}
