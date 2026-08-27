import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/server'
import { getEligibleEnrollment, createSignedGetUrl, mediaTypeFromPath } from '@/lib/podcast'

// GET /api/podcast/mine — the logged-in student's OWN submissions (all statuses),
// with a short-lived preview URL. Used so students can delete only what they made.
export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !user.email) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }
  const eligible = await getEligibleEnrollment(user.email)
  if (!eligible.ok) {
    return NextResponse.json({ ok: false, error: eligible.reason }, { status: 403 })
  }
  const admin = createAdminClient()
  const { data, error } = await admin
    .from('podcast_submissions')
    .select('*')
    .or(`enrollment_id.eq.${eligible.enrollmentId},student_email.eq.${user.email.toLowerCase().trim()}`)
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  const out = []
  for (const row of data || []) {
    const previewUrl = await createSignedGetUrl(row.video_path, 900)
    out.push({ ...row, previewUrl, media_type: mediaTypeFromPath(row.video_path || '') })
  }
  return NextResponse.json({ ok: true, submissions: out })
}
