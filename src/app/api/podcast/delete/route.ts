import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { isAuthorizedAdmin } from '@/lib/adminAccess'
import { resolveSubmitter, deleteStorageObject } from '@/lib/podcast'

// POST /api/podcast/delete  { id }
// - Admin (Jonathan/Anne): can delete ANY submission.
// - Student: can ONLY delete their OWN submission (enrollment_id matches their
//   paid+approved enrollment). They can never touch anyone else's.
// Deletes the storage object + the DB row. Applies to both video and audio.
export async function POST(request: Request) {
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

  // Resolve who's asking. If it's an admin family account, allow anything.
  let allowed = false
  let via: 'student' | 'family' | 'admin' | 'none' = 'none'

  const student = await (async () => {
    const { readStudentCookie } = await import('@/lib/studentAuth')
    return readStudentCookie(request)
  })()
  if (student) {
    const res = await resolveSubmitter(request)
    if (res.ok) {
      allowed = res.eligible.enrollmentId === sub.enrollment_id
      via = res.via
    }
  } else {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user?.email && isAuthorizedAdmin(user.email)) {
      allowed = true
      via = 'admin'
    } else if (user?.email) {
      const res = await resolveSubmitter(request)
      if (res.ok) {
        allowed = res.eligible.enrollmentId === sub.enrollment_id || res.eligible.studentEmail === user.email
        via = 'family'
      }
    }
  }

  if (!allowed) {
    return NextResponse.json({ ok: false, error: 'You may only delete your own submission.' }, { status: 403 })
  }

  // Remove the storage object first (best-effort), then the DB row.
  if (sub.video_path) await deleteStorageObject(sub.video_path)
  const { error } = await admin.from('podcast_submissions').delete().eq('id', id)
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, via })
}
