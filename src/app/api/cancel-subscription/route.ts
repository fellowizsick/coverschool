// @ts-nocheck
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

/**
 * POST /api/cancel-subscription
 * Cancels a member's Stripe subscription at period end so their card
 * stops being charged. Looks up the enrollment's stripe_subscription_id
 * and deletes it in Stripe, then marks the enrollment cancelled in DB.
 */
export async function POST(request: Request) {
  try {
    const { enrollmentId } = await request.json()
    if (!enrollmentId) {
      return NextResponse.json({ error: 'Missing enrollmentId' }, { status: 400 })
    }

    const secretKey = process.env.STRIPE_SECRET_KEY
    if (!secretKey) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
    }

    const admin = createAdminClient()
    const { data: enrollment, error: fetchErr } = await admin
      .from('enrollments')
      .select('stripe_subscription_id, email, status')
      .eq('id', enrollmentId)
      .single()

    if (fetchErr || !enrollment) {
      return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 })
    }

    const subId = enrollment.stripe_subscription_id
    if (!subId) {
      // No active Stripe subscription on file — just mark cancelled locally.
      await admin.from('enrollments').update({ status: 'cancelled' }).eq('id', enrollmentId)
      return NextResponse.json({ cancelled: true, note: 'No active subscription on file; marked cancelled.' })
    }

    const Stripe = require('stripe')
    const stripe = new Stripe(secretKey)

    // Cancel immediately at period end (no further charges).
    const cancelled = await stripe.subscriptions.del(subId, { prorate: false })

    await admin
      .from('enrollments')
      .update({ status: 'cancelled', stripe_subscription_id: null, payment_status: 'cancelled' })
      .eq('id', enrollmentId)

    console.log(`🛑 Cancelled Stripe subscription ${subId} for enrollment ${enrollmentId}`)
    return NextResponse.json({ cancelled: true, subscription: cancelled.id })
  } catch (err) {
    console.error('Cancel subscription error:', err)
    return NextResponse.json({ error: 'Failed to cancel subscription' }, { status: 500 })
  }
}
