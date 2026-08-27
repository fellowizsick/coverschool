import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/server'
import { isAuthorizedAdmin } from '@/lib/adminAccess'
import { addCredit, setCreditVerification, refreshGraduationStatus } from '@/lib/graduation'

async function admin(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAuthorizedAdmin(user.email)) return null
  return user
}

// POST /api/graduation/credits  { enrollment_id, subject, course_name, credits, source, earned_date?, notes? }
// ADD a credit. LCA/testing auto-verify; transfer/prior_learning/dual_credit enter pending.
export async function POST(request: Request) {
  const user = await admin(request)
  if (!user) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  const body = await request.json().catch(() => ({}))
  const enrollmentId = String(body.enrollment_id || '')
  const subject = String(body.subject || '').trim()
  const course_name = String(body.course_name || '').trim()
  const credits = Number(body.credits || 0)
  if (!enrollmentId || !subject || !course_name || !(credits > 0)) {
    return NextResponse.json({ ok: false, error: 'Missing/invalid fields (enrollment_id, subject, course_name, credits>0).' }, { status: 400 })
  }
  const res = await addCredit(enrollmentId, {
    subject,
    course_name,
    credits,
    source: (body.source || 'lca'),
    earned_date: body.earned_date || null,
    notes: body.notes || null,
  })
  if (!res.ok) return NextResponse.json({ ok: false, error: res.error }, { status: 500 })
  await refreshGraduationStatus(enrollmentId)
  return NextResponse.json({ ok: true, id: res.id, verification: (body.source === 'lca' || body.source === 'testing') ? 'verified' : 'pending' })
}

// PATCH /api/graduation/credits  { id, verification: 'verified'|'rejected' }
// Verify or reject a pending (transfer/prior/dual) credit.
export async function PATCH(request: Request) {
  const user = await admin(request)
  if (!user) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  const body = await request.json().catch(() => ({}))
  const id = String(body.id || '')
  const verification = String(body.verification || '')
  if (!id || (verification !== 'verified' && verification !== 'rejected')) {
    return NextResponse.json({ ok: false, error: 'Missing id or invalid verification.' }, { status: 400 })
  }
  const adminClient = createAdminClient()
  const { data: credit } = await adminClient.from('student_credits').select('enrollment_id').eq('id', id).single()
  const res = await setCreditVerification(id, verification as any)
  if (!res.ok) return NextResponse.json({ ok: false, error: res.error }, { status: 500 })
  if (credit?.enrollment_id) await refreshGraduationStatus(credit.enrollment_id)
  return NextResponse.json({ ok: true })
}

// DELETE /api/graduation/credits?id=...
// Remove a credit row (undo a mistaken entry).
export async function DELETE(request: Request) {
  const user = await admin(request)
  if (!user) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  const url = new URL(request.url)
  const id = url.searchParams.get('id') || ''
  if (!id) return NextResponse.json({ ok: false, error: 'Missing id.' }, { status: 400 })
  const adminClient = createAdminClient()
  const { data: credit } = await adminClient.from('student_credits').select('enrollment_id').eq('id', id).single()
  const { error } = await adminClient.from('student_credits').delete().eq('id', id)
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  if (credit?.enrollment_id) await refreshGraduationStatus(credit.enrollment_id)
  return NextResponse.json({ ok: true })
}
