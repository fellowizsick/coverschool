import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { isAuthorizedAdmin } from '@/lib/adminAccess'
import { generatePin } from '@/lib/studentAuth'

// Student podcast access codes — ADMIN ONLY (Jonathan / Anne).
// GET  /api/student-pins            -> list approved+paid students + their PINs
// POST /api/student-pins {id}       -> generate (or regenerate) a PIN for one enrollment
// POST /api/student-pins {id, pin}  -> set a specific PIN for one enrollment
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email || !isAuthorizedAdmin(user.email)) {
    return NextResponse.json({ ok: false, error: 'Not allowed.' }, { status: 403 })
  }
  const admin = createAdminClient()
  const { data, error } = await admin
    .from('enrollments')
    .select('id, student_first_name, student_last_name, email, status, payment_status, student_pin')
    .in('status', ['approved'])
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  return NextResponse.json({
    ok: true,
    students: (data || []).map((e: any) => ({
      id: e.id,
      name: `${e.student_first_name} ${e.student_last_name}`.trim(),
      email: e.email,
      status: e.status,
      payment_status: e.payment_status,
      pin: e.student_pin || null,
    })),
  })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email || !isAuthorizedAdmin(user.email)) {
    return NextResponse.json({ ok: false, error: 'Not allowed.' }, { status: 403 })
  }
  const body = await request.json().catch(() => ({}))
  const id = String(body.id || '')
  if (!id) return NextResponse.json({ ok: false, error: 'Missing id.' }, { status: 400 })

  // Ensure a unique PIN (regenerate if a collision).
  let pin = String(body.pin || '').trim()
  const admin = createAdminClient()
  if (!/^\d{4}$/.test(pin)) {
    let ok = false
    for (let attempt = 0; attempt < 5 && !ok; attempt++) {
      pin = generatePin()
      const { data: clash } = await admin.from('enrollments').select('id').eq('student_pin', pin).maybeSingle()
      ok = !clash
    }
    if (!ok) return NextResponse.json({ ok: false, error: 'Could not find a free code. Try again.' }, { status: 500 })
  }

  const { error } = await admin.from('enrollments').update({ student_pin: pin }).eq('id', id)
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, pin })
}
