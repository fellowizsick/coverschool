// @ts-nocheck
import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { isAuthorizedAdmin } from '@/lib/adminAccess'

// 🔒 List cash-enrollment tokens — admin only. Returns the link + status for each.
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user?.email || !isAuthorizedAdmin(user.email)) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 401 })
    }

    const admin = createAdminClient()
    const { data, error } = await admin
      .from('cash_enroll_tokens')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) {
      return NextResponse.json({ error: 'Failed to load links' }, { status: 500 })
    }

    const origin = process.env.NEXT_PUBLIC_SITE_URL || 'https://laroseca.org'
    const links = (data || []).map((t) => ({
      id: t.id,
      token: t.token,
      link: `${origin}/enroll/cash?token=${t.token}`,
      email: t.email,
      amountCents: t.amount_paid_cents,
      studentCount: t.student_count,
      notes: t.notes || '',
      created_at: t.created_at,
      used_at: t.used_at,
    }))

    return NextResponse.json({ ok: true, links })
  } catch (err) {
    console.error('Cash token list error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
