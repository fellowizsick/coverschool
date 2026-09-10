import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { isAuthorizedAdmin } from '@/lib/adminAccess'

/**
 * ADMIN ONLY — the school office manages student records requests.
 *
 * Readable and writable ONLY by the two allowlisted admins
 * (src/lib/adminAccess.ts: Mom + Jonathan). Parents, students and the public get
 * redirected by the dashboard layout and 401'd here.
 *
 * GET   → every request + the student list used to link a request to the right child
 * PATCH → link a request to a child / move its status / add office notes / record what was sent
 * POST  → log an OUTGOING request (we're asking a previous school for a transferring student)
 */

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email || !isAuthorizedAdmin(user.email)) return null
  return user
}

const STATUSES = ['new', 'in_progress', 'sent', 'received', 'completed', 'denied']

export async function GET() {
  const user = await requireAdmin()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const admin = createAdminClient()

  const { data: requests } = await admin
    .from('record_requests')
    .select('*')
    .order('created_at', { ascending: false })

  // The student list powers the "link to child" picker.
  const { data: students } = await admin
    .from('enrollments')
    .select('id, student_first_name, student_last_name, student_grade, student_dob, email, status, family_group_id')
    .order('student_last_name', { ascending: true })

  return NextResponse.json({ requests: requests || [], students: students || [] })
}

export async function PATCH(request: Request) {
  const user = await requireAdmin()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const body = await request.json()
  const { id } = body
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() }

  if ('status' in body) {
    if (!STATUSES.includes(String(body.status))) {
      return NextResponse.json({ error: 'invalid status' }, { status: 400 })
    }
    patch.status = String(body.status)
    if (body.status === 'completed' || body.status === 'sent') {
      patch.fulfilled_at = new Date().toISOString()
      patch.fulfilled_by = user.email
    }
  }

  // Link (or unlink) the request to the right child.
  if ('enrollment_id' in body) {
    const link = body.enrollment_id ? String(body.enrollment_id) : null
    patch.enrollment_id = link
    patch.linked_at = link ? new Date().toISOString() : null
    patch.linked_by = link ? String(user.email) : ''
  }

  // Where the record actually went (set explicitly, never inferred).
  if ('delivery_method' in body) patch.delivery_method = String(body.delivery_method || 'email')
  if ('delivery_detail' in body) patch.delivery_detail = String(body.delivery_detail || '')
  if ('staff_notes' in body) patch.staff_notes = String(body.staff_notes || '')
  if ('attachments' in body && Array.isArray(body.attachments)) patch.attachments = body.attachments

  const admin = createAdminClient()
  const { error } = await admin.from('record_requests').update(patch).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}

export async function POST(request: Request) {
  const user = await requireAdmin()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const body = await request.json()

  // Log a request WE are making to a student's previous school.
  const { data, error } = await (createAdminClient())
    .from('record_requests')
    .insert({
      direction: 'outgoing',
      status: 'in_progress',
      enrollment_id: body.enrollment_id || null,
      linked_at: body.enrollment_id ? new Date().toISOString() : null,
      linked_by: body.enrollment_id ? String(user.email) : '',
      student_first_name: String(body.student_first_name || ''),
      student_last_name: String(body.student_last_name || ''),
      student_dob: body.student_dob || null,
      student_grade: body.student_grade || '',
      requester_type: 'school',
      requester_name: String(body.requester_name || 'Larose Christian Academy'),
      requester_org: String(body.requester_org || ''),
      records_requested: Array.isArray(body.records_requested) ? body.records_requested : [],
      other_records: body.other_records || '',
      delivery_method: body.delivery_method || 'email',
      delivery_detail: body.delivery_detail || '',
      reason: body.reason || '',
      staff_notes: body.staff_notes || '',
      authorization_name: String(body.authorization_name || ''),
      notes: body.notes || '',
    })
    .select('id')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, id: data?.id }, { status: 201 })
}
