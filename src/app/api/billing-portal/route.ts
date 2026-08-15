// @ts-nocheck
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * POST /api/billing-portal
 * Creates a Stripe Customer Portal session for the LOGGED-IN parent ONLY.
 *
 * 🔒 ISOLATION RULE (2026-08-15, Jonathan directive):
 * A parent may only ever reach their OWN billing/card information. We NEVER
 * accept an enrollmentId or customer id from the client — the customer is
 * derived from the authenticated session's email, exactly like every other
 * parent-portal query on this site (.eq('email', user.email)).
 *
 * Stripe hosts the portal page — our code never sees or stores card data.
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user || !user.email) {
      return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
    }

    const secretKey = process.env.STRIPE_SECRET_KEY
    if (!secretKey) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
    }

    // 🔒 Fetch ONLY this user's enrollments — same isolation as /parent page.
    // If the email doesn't match, they get nothing. No ID from the request.
    const { data: enrollments } = await supabase
      .from('enrollments')
      .select('stripe_customer_id, email, status')
      .eq('email', user.email)
      .limit(10)

    const customerIds = [
      ...new Set(
        (enrollments || [])
          .filter((e) => e.status === 'approved' || e.status === 'pending')
          .map((e) => e.stripe_customer_id)
          .filter(Boolean)
      ),
    ]

    if (customerIds.length === 0) {
      return NextResponse.json(
        { error: 'No active billing account found for this family. Contact the school if you believe this is an error.' },
        { status: 404 }
      )
    }

    const Stripe = require('stripe')
    const stripe = new Stripe(secretKey)
    // Canonical domain — always laroseca.org, never the vercel.app URL (user rule).
    const origin = 'https://laroseca.org'

    // Create ONE portal session for this family's customer account.
    // If a family somehow has multiple customer ids (edge case), use the
    // most recently active subscription's customer — the first non-null.
    const session = await stripe.billingPortal.sessions.create({
      customer: customerIds[0],
      return_url: `${origin}/parent`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Billing portal error:', err)
    return NextResponse.json({ error: 'Failed to open billing portal' }, { status: 500 })
  }
}
