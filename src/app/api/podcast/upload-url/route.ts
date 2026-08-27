import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getEligibleEnrollment, createSignedUploadUrl } from '@/lib/podcast'
import { randomUUID } from 'crypto'

// POST /api/podcast/upload-url — returns a signed upload URL for the browser to
// upload the video DIRECTLY to private Supabase Storage (bypasses Vercel body limit).
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
  const now = new Date()
  const path = `sub/${eligible.enrollmentId}/${now.toISOString().slice(0, 10)}/${randomUUID()}.webm`
  const signed = await createSignedUploadUrl(path, 300)
  if (!signed) {
    return NextResponse.json({ ok: false, error: 'Could not create upload URL. Try again.' }, { status: 500 })
  }
  return NextResponse.json({ ok: true, path: signed.path, url: signed.url, token: signed.token })
}
