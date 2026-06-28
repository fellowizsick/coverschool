// @ts-nocheck
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  const secretKey = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!secretKey || !webhookSecret) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
  }

  const Stripe = require('stripe')
  const stripe = new Stripe(secretKey)

  let event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Handle checkout.session.completed
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const enrollmentId = session.metadata?.enrollment_id

    if (!enrollmentId) {
      console.error('No enrollment_id in session metadata')
      return NextResponse.json({ error: 'Missing enrollment_id' }, { status: 400 })
    }

    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    // Auto-approve the enrollment and mark payment as paid
    const { error: updateError } = await supabase
      .from('enrollments')
      .update({
        status: 'approved',
        payment_status: 'paid',
        stripe_customer_id: session.customer,
        stripe_subscription_id: session.subscription,
      })
      .eq('id', enrollmentId)

    if (updateError) {
      console.error('Failed to update enrollment:', updateError)
      return NextResponse.json({ error: 'Update failed' }, { status: 500 })
    }

    // Also create a student record
    const { data: enrollment } = await supabase
      .from('enrollments')
      .select('*')
      .eq('id', enrollmentId)
      .single()

    if (enrollment) {
      const { error: studentError } = await supabase.from('students').insert({
        first_name: enrollment.student_first_name,
        last_name: enrollment.student_last_name,
        grade: enrollment.student_grade,
        dob: enrollment.student_dob,
        enrollment_id: enrollmentId,
        status: 'active',
      })

      if (studentError) {
        console.error('Failed to create student record:', studentError)
      }
    }

    console.log(`✅ Enrollment ${enrollmentId} approved via Stripe payment`)
  }

  // Handle subscription cancelled
  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object
    console.log(`❌ Subscription ${subscription.id} cancelled`)
  }

  return NextResponse.json({ received: true })
}
