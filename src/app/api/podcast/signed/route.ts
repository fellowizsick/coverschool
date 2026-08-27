import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/server'
import { isAuthorizedAdmin } from '@/lib/adminAccess'
import { createSignedGetUrl } from '@/lib/podcast'

// GET /api/podcast/signed?id=...  (admin) — a fresh signed GET URL for a submission video.
export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAuthorizedAdmin(user.email)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }
  const url = new URL(request.url)
  const id = url.searchParams.get('id') || ''
  if (!id) return NextResponse.json({ ok: false, error: 'Missing id.' }, { status: 400 })
  const admin = createAdminClient()
  const { data } = await admin.from('podcast_submissions').select('video_path, status, enrollment_id').eq('id', id).single()
  if (!data) return NextResponse.json({ ok: false, error: 'not found' }, { status: 404 })
  // Admin may view pending/rejected/approved. (Students/others cannot reach this route.)
  const signedUrl = await createSignedGetUrl(data.video_path, 900)
  if (!signedUrl) return NextResponse.json({ ok: false, error: 'Could not sign URL.' }, { status: 500 })
  return NextResponse.json({ ok: true, url: signedUrl, status: data.status, enrollmentId: data.enrollment_id })
}
