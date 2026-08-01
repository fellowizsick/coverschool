// @ts-nocheck
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

/**
 * GET /api/referral-code?enrollmentId=xxx
 * Returns the referral code for an enrollment (used by the enroll success page
 * to show the family their own referral link right after they enroll).
 * Only exposes the code — no personal data.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const enrollmentId = searchParams.get('enrollmentId')

    if (!enrollmentId) {
      return NextResponse.json({ error: 'Missing enrollmentId' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('enrollments')
      .select('referral_code')
      .eq('id', enrollmentId)
      .maybeSingle()

    if (error || !data) {
      return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 })
    }

    return NextResponse.json({ referralCode: data.referral_code || null })
  } catch (err) {
    console.error('Referral code lookup error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
