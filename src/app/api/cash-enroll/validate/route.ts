// @ts-nocheck
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

// Public validator for the cash-enrollment link. Only returns NON-sensitive info
// (was the token pre-created, how many students, what amount) so the family's page
// can confirm the link is valid before showing the form. Never returns the token row id.
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token') || ''

    if (!token) {
      return NextResponse.json({ ok: false }, { status: 400 })
    }

    const admin = createAdminClient()
    const { data } = await admin
      .from('cash_enroll_tokens')
      .select('token, email, amount_paid_cents, student_count, used_at, expires_at')
      .eq('token', token)
      .maybeSingle()

    if (!data) {
      return NextResponse.json({ ok: false }, { status: 404 })
    }
    if (data.used_at) {
      return NextResponse.json({ ok: false, reason: 'used' }, { status: 410 })
    }
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return NextResponse.json({ ok: false, reason: 'expired' }, { status: 410 })
    }

    return NextResponse.json({
      ok: true,
      email: data.email,
      amountCents: data.amount_paid_cents,
      studentCount: data.student_count,
    })
  } catch (err) {
    console.error('Cash token validate error:', err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
