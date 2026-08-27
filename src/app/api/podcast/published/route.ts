import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { createSignedGetUrl } from '@/lib/podcast'

// GET /api/podcast/published — PUBLIC. Returns ONLY approved submissions (with short-lived
// playback URLs). Nothing hidden or pending ever appears here.
export async function GET() {
  const admin = createAdminClient()
  const { data, error } = await admin
    .from('podcast_submissions')
    .select('*')
    .eq('status', 'approved')
    .order('reviewed_at', { ascending: false })
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  const out = []
  for (const row of data || []) {
    const signedUrl = await createSignedGetUrl(row.video_path, 60 * 60)
    if (signedUrl) out.push({
      id: row.id, student_name: row.student_name, title: row.title,
      description: row.description, reviewed_at: row.reviewed_at, playbackUrl: signedUrl,
    })
  }
  return NextResponse.json({ ok: true, submissions: out })
}
