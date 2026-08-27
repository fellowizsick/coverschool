import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/server'
import { isAuthorizedAdmin } from '@/lib/adminAccess'

// GET /api/graduation/requirements — list the active + all requirements
// PUT /api/graduation/requirements { requirements: [{id?, subject, required_credits, display_order, active}] }
//   Admin-only. Replace the school's diploma requirement set. Also requires recompute of
//   all enrollments' status (delegated to the caller/UI, or a light refresh endpoint).
export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAuthorizedAdmin(user.email)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }
  const admin = createAdminClient()
  const { data } = await admin.from('graduation_requirements').select('*').order('display_order')
  return NextResponse.json({ ok: true, requirements: data || [] })
}

export async function PUT(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAuthorizedAdmin(user.email)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }
  const body = await request.json().catch(() => ({}))
  const list = body.requirements
  if (!Array.isArray(list)) {
    return NextResponse.json({ ok: false, error: 'requirements must be an array.' }, { status: 400 })
  }
  const admin = createAdminClient()
  // Replace the whole set: delete existing, insert the new list.
  const { error: delErr } = await admin.from('graduation_requirements').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  if (delErr) return NextResponse.json({ ok: false, error: delErr.message }, { status: 500 })
  const rows = list.map((r: any, i: number) => ({
    subject: String(r.subject || '').trim(),
    required_credits: Number(r.required_credits || 0),
    display_order: Number(r.display_order ?? i),
    active: r.active !== false,
  })).filter((r: any) => r.subject)
  if (rows.length) {
    const { error: insErr } = await admin.from('graduation_requirements').insert(rows)
    if (insErr) return NextResponse.json({ ok: false, error: insErr.message }, { status: 500 })
  }
  return NextResponse.json({ ok: true, count: rows.length })
}
