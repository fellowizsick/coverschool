// @ts-nocheck
import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

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

    // 🔒 Ownership check: ONLY the enrolled parent may view their own code.
    // 🔒 FIX 2026-08-19 (Jonathan directive): admins are NO LONGER allowed to pull
    // any family's referral code through this API. Codes are the parents' private
    // share-links — admin staff see forms/records, never referral codes.
    const isOwner = data.email?.toLowerCase() === user.email.toLowerCase().trim()
    if (!isOwner) {
      return NextResponse.json({ error: 'You can only view your own referral code' }, { status: 403 })
    }

    return NextResponse.json({ referralCode: data.referral_code || null })
  } catch (err) {
    console.error('Referral code lookup error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
