import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/server'
import { isAuthorizedAdmin } from '@/lib/adminAccess'
import { getEligibleEnrollment, deleteStorageObject } from '@/lib/podcast'

// POST /api/podcast/delete  { id }
// - Admin (Jonathan/Anne): can delete ANY submission.
// - Student: can ONLY delete their OWN submission (enrollment_id matches their
//   paid+approved enrollment AND student_email matches theirs). They can never
//   touch anyone else's, and never the public feed directly.
// Deletes the storage object + the DB row. Applies to both video and audio.
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !user.email) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }
  const body = await request.json().catch(() => ({}))
  const id = String(body.id || '')
  if (!id) return NextResponse.json({ ok: false, error: 'Missing id.' }, { status: 400 })

  const admin = createAdminClient()
  const { data: sub, error: fetchErr } = await admin
    .from('podcast_submissions')
    .select('id, enrollment_id, student_email, video_path')
    .eq('id', id)
    .single()
  if (fetchErr || !sub) return NextResponse.json({ ok: false, error: 'not found' }, { status: 404 })

  const isAdmin = isAuthorizedAdmin(user.email)
  if (!isAdmin) {
    const eligible = await getEligibleEnrollment(user.email)
    if (!eligible.ok) {
      return NextResponse.json({ ok: false, error: 'Not allowed.' }, { status: 403 })
    }
    // ONLY the student who owns this submission can delete it.
    const own = sub.enrollment_id === eligible.enrollmentId || sub.student_email === user.email
    if (!own) {
      return NextResponse.json({ ok: false, error: 'You may only delete your own submission.' }, { status: 403 })
    }
  }

  // Remove the storage object first (best-effort), then the DB row.
  if (sub.video_path) await deleteStorageObject(sub.video_path)
  const { error } = await admin.from('podcast_submissions').delete().eq('id', id)
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
