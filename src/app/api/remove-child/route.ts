// @ts-nocheck
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

/**
 * POST /api/remove-child
 * Body: { enrollmentId }
 *
 * Removes ONE child from a family's membership:
 * - Monthly: deletes that child's line item from the Stripe subscription
 *   (next bill drops by $45; siblings keep paying their own line items)
 * - Yearly / no subscription: no Stripe change, just marks the child cancelled
 * - Last remaining child: cancels the whole subscription (family membership)
 *
 * Only the removed child's enrollment is marked cancelled — siblings stay active.
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

    // 1. Load the child to remove
    const { data: child, error: fetchErr } = await admin
      .from('enrollments')
      .select('*')
      .eq('id', enrollmentId)
      .maybeSingle()

    if (fetchErr || !child) {
      return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 })
    }

    // 2. Load ALL siblings in the same family group (including this child)
    let siblings: any[] = [child]
    if (child.family_group_id) {
      const { data: group } = await admin
        .from('enrollments')
        .select('*')
        .eq('family_group_id', child.family_group_id)
        .order('created_at', { ascending: true })
      if (group && group.length > 0) siblings = group
    }

    // Active siblings = everyone in the group still approved (not this child)
    const activeSiblings = siblings.filter(
      (s) => s.id !== child.id && s.status === 'approved' && s.payment_status === 'paid'
    )

    const Stripe = require('stripe')
    const stripe = new Stripe(secretKey)

    // 3. If this is the ONLY active member (or the last one) -> cancel whole sub
    if (activeSiblings.length === 0) {
      if (child.stripe_subscription_id) {
        await stripe.subscriptions.del(child.stripe_subscription_id, { prorate: false })
      }
      // Mark every enrollment in the group cancelled
      for (const s of siblings) {
        await admin
          .from('enrollments')
          .update({ status: 'cancelled', stripe_subscription_id: null, payment_status: 'cancelled' })
          .eq('id', s.id)
        // Deactivate the student record too
        await admin.from('students').update({ status: 'inactive' }).eq('enrollment_id', s.id)
      }
      return NextResponse.json({ removed: true, familyCancelled: true, note: 'Last child removed — family membership cancelled.' })
    }

    // 4. Multi-child family on a shared subscription: remove just this child's line item
    if (child.stripe_subscription_id) {
      const sub = await stripe.subscriptions.retrieve(child.stripe_subscription_id, {
        expand: ['items.data.price.product'],
      })

      const childName = `${child.student_first_name} ${child.student_last_name}`.trim()
      // Find the subscription item whose product description names this student
      const targetItem = (sub.items?.data || []).find((item) => {
        const prod = item.price?.product
        const desc = typeof prod === 'object' && prod ? prod.description || '' : ''
        return desc.includes(childName)
      })

      if (targetItem) {
        // Delete ONLY this child's item from the shared subscription
        await stripe.subscriptionItems.del(targetItem.id, { prorate: false })
        console.log(`🧒 Removed child ${childName} line item ${targetItem.id} from subscription ${child.stripe_subscription_id}`)
      } else {
        console.warn(`⚠️ Could not find subscription item for ${childName} — no Stripe change made (marked cancelled in DB only)`)
      }
    }

    // 5. Mark ONLY this child cancelled (siblings untouched)
    await admin
      .from('enrollments')
      .update({ status: 'cancelled', stripe_subscription_id: null, payment_status: 'cancelled' })
      .eq('id', child.id)

    // Deactivate just this child's student record
    await admin.from('students').update({ status: 'inactive' }).eq('enrollment_id', child.id)

    // 6. Confirmation email to the parent
    try {
      const { sendCancellationEmail } = await import('@/lib/email')
      await sendCancellationEmail({
        to: child.email,
        parentName: `${child.parent_first_name} ${child.parent_last_name}`,
        studentName: childName,
      })
    } catch (emailErr) {
      console.error('Remove-child email failed:', emailErr)
    }

    return NextResponse.json({
      removed: true,
      familyCancelled: false,
      remainingChildren: activeSiblings.length,
      note: `${childName} removed. ${activeSiblings.length} child(ren) still active.`,
    })
  } catch (err) {
    console.error('Remove child error:', err)
    return NextResponse.json({ error: 'Failed to remove child' }, { status: 500 })
  }
}
