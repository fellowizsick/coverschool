// @ts-nocheck
import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

const ADMIN_EMAILS = ['1990jonathanbbrown@gmail.com', 'anneb7669@gmail.com']

/**
 * GET /api/referral-code?enrollmentId=xxx
 * Returns the referral code for an enrollment (used by the enroll success page
 * to show the family their own referral link right after they enroll).
 * 🔒 SECURITY: requires login AND ownership — a parent can only see their OWN
 * family's referral code, never anyone else's. Admins may see any.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const enrollmentId = searchParams.get('enrollmentId')

    if (!enrollmentId) {
      return NextResponse.json({ error: 'Missing enrollmentId' }, { status: 400 })
    }

    // 🔒 Must be logged in
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user?.email) {
      return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
    }

    const admin = createAdminClient()
    const { data, error } = await admin
      .from('enrollments')
      .select('id, referral_code, email')
      .eq('id', enrollmentId)
      .maybeSingle()

    if (error || !data) {
      return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 })
    }

    // 🔒 Ownership check: the caller must be the enrolled parent, or an admin
    const isAdmin = ADMIN_EMAILS.includes(user.email.toLowerCase().trim())
    const isOwner = data.email?.toLowerCase() === user.email.toLowerCase().trim()
    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: 'You can only view your own referral code' }, { status: 403 })
    }

    return NextResponse.json({ referralCode: data.referral_code || null })
  } catch (err) {
    console.error('Referral code lookup error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
