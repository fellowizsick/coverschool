import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/server'
import { getEligibleEnrollment, notifyNewSubmission } from '@/lib/podcast'

// POST /api/podcast/register — after the browser uploaded the video, record the
// pending submission (HIDDEN until admin reviews) and notify Jonathan+Anne.
// Gate: authenticated + paid+approved.
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !user.email) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }
  const eligible = await getEligibleEnrollment(user.email)
  if (!eligible.ok) {
    return NextResponse.json({ ok: false, error: eligible.reason }, { status: 403 })
  }

  const body = await request.json().catch(() => ({}))
  const path = String(body.path || '')
  const title = String(body.title || '').trim().slice(0, 120)
  const description = String(body.description || '').trim().slice(0, 600)
  const consent = body.consent_ack === true
  const duration = Number(body.duration || 0) || null

  if (!path || !path.startsWith(`sub/${eligible.enrollmentId}/`)) {
    return NextResponse.json({ ok: false, error: 'Invalid upload path.' }, { status: 400 })
  }
  if (!consent) {
    return NextResponse.json({ ok: false, error: 'Parental consent must be acknowledged.' }, { status: 400 })
  }
  // Media type is encoded in the storage path; the client may also claim it,
  // but the path is authoritative. Validate it matches to avoid a mismatch.
  const mediaType = /\/a\//.test(path) ? 'audio' : 'video'
  if (body.media_type && (body.media_type === 'audio' || body.media_type === 'video') && body.media_type !== mediaType) {
    return NextResponse.json({ ok: false, error: 'Media type mismatch.' }, { status: 400 })
  }
  const admin = createAdminClient()
  const { data, error } = await admin.from('podcast_submissions').insert({
    enrollment_id: eligible.enrollmentId,
    student_name: eligible.studentName,
    student_email: eligible.studentEmail,
    title,
    description,
    video_path: path,
    status: 'pending',
    consent_ack: true,
    duration_seconds: duration,
  }).select('*').single()
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })

  await notifyNewSubmission({ id: data.id, student_name: data.student_name, title: data.title, enrollment_id: data.enrollment_id })

  return NextResponse.json({ ok: true, id: data.id, status: 'pending', message: 'Submitted! It will be reviewed before it appears on the podcast.' })
}
