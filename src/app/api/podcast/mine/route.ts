import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { resolveSubmitter, createSignedGetUrl, mediaTypeFromPath } from '@/lib/podcast'

// GET /api/podcast/mine — the signed-in student's OWN submissions (all statuses),
// with a short-lived preview URL. Used so students can delete only what they made.
// Accepts EITHER a signed student cookie OR a logged-in family account.
export async function GET(request: Request) {
  const res = await resolveSubmitter(request)
  if (!res.ok) {
    return NextResponse.json({ ok: false, error: res.reason }, { status: res.status })
  }
  const eligible = res.eligible
  const admin = createAdminClient()
  const { data, error } = await admin
    .from('podcast_submissions')
    .select('*')
    .or(`enrollment_id.eq.${eligible.enrollmentId},student_email.eq.${eligible.studentEmail.toLowerCase().trim()}`)
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  const out = []
  for (const row of data || []) {
    const previewUrl = await createSignedGetUrl(row.video_path, 900)
    out.push({ ...row, previewUrl, media_type: mediaTypeFromPath(row.video_path || '') })
  }
  return NextResponse.json({ ok: true, submissions: out })
}
