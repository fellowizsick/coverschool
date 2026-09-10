// @ts-nocheck
import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { randomBytes } from 'crypto'
import { isAuthorizedAdmin } from '@/lib/adminAccess'

// 🔒 GENERATE A CASH-ENROLLMENT TOKEN — admin only (Mom/Batman). Creates one
// unguessable token that lets a family enroll WITHOUT a card. The link is handed
// to the parent privately (cash is local-only, never advertised on the public site).
export async function POST(request: Request) {
  try {
    // Must be a logged-in admin (Mom or Batman).
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user?.email || !isAuthorizedAdmin(user.email)) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 401 })
    }

    const { email, amountPaidCents, studentCount, notes } = await request.json()
    if (!email || !amountPaidCents || amountPaidCents <= 0) {
      return NextResponse.json({ error: 'Email and amount are required' }, { status: 400 })
    }
    const count = Math.max(1, parseInt(studentCount, 10) || 1)

    const admin = createAdminClient()
    const token = randomBytes(24).toString('base64url')   // unguessable

    const { data, error } = await admin
      .from('cash_enroll_tokens')
      .insert({
        token,
        email: email.trim().toLowerCase(),
        amount_paid_cents: Math.round(amountPaidCents),
        student_count: count,
        notes: notes || '',
        created_by: user.email,
      })
      .select('id, token, email, amount_paid_cents, student_count')
      .single()

    if (error) {
      console.error('Cash token insert error:', error)
      return NextResponse.json({ error: 'Failed to create link' }, { status: 500 })
    }

    const origin = process.env.NEXT_PUBLIC_SITE_URL || 'https://laroseca.org'
    const link = `${origin}/enroll/cash?token=${token}`

    return NextResponse.json({
      ok: true,
      link,
      token: data.token,
      email: data.email,
      amountPaidCents: data.amount_paid_cents,
      studentCount: data.student_count,
    }, { status: 201 })
  } catch (err) {
    console.error('Cash token server error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
