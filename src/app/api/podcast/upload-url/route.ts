import { NextResponse } from 'next/server'
import { resolveSubmitter, createSignedUploadUrl, buildMediaPath } from '@/lib/podcast'

// POST /api/podcast/upload-url — returns a signed upload URL for the browser to
// upload the video DIRECTLY to private Supabase Storage (bypasses Vercel body limit).
// Gate: signed-in student (cookie) or paid+approved family account.
export async function POST(request: Request) {
  const res = await resolveSubmitter(request)
  if (!res.ok) {
    return NextResponse.json({ ok: false, error: res.reason }, { status: res.status })
  }
  const body = await request.json().catch(() => ({}))
  const mediaType = body.media_type === 'audio' ? 'audio' : 'video'
  const path = buildMediaPath(res.eligible.enrollmentId, mediaType)
  const signed = await createSignedUploadUrl(path, 300)
  if (!signed) {
    return NextResponse.json({ ok: false, error: 'Could not create upload URL. Try again.' }, { status: 500 })
  }
  return NextResponse.json({ ok: true, path: signed.path, url: signed.url, token: signed.token, media_type: mediaType })
}
