import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/server'
import { isAuthorizedAdmin } from '@/lib/adminAccess'
import { createSignedGetUrl } from '@/lib/podcast'

async function admin(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAuthorizedAdmin(user.email)) return null
  return user
}

// GET /api/podcast/review?status=pending  (admin) — list submissions with signed preview URLs.
export async function GET(request: Request) {
  const user = await admin(request)
  if (!user) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  const url = new URL(request.url)
  const status = (url.searchParams.get('status') || '').toLowerCase()
  const adminClient = createAdminClient()
  let q = adminClient.from('podcast_submissions').select('*').order('created_at', { ascending: false })
  if (status) q = q.eq('status', status)
  const { data, error } = await q
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  // generate short-lived signed preview URLs
  const out = []
  for (const row of data || []) {
    const signedUrl = await createSignedGetUrl(row.video_path, 900)
    out.push({ ...row, previewUrl: signedUrl })
  }
  return NextResponse.json({ ok: true, submissions: out })
}

// POST /api/podcast/review  { id, decision: 'approved'|'rejected' }  (admin)
export async function POST(request: Request) {
  const user = await admin(request)
  if (!user) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  const body = await request.json().catch(() => ({}))
  const id = String(body.id || '')
  const decision = String(body.decision || '')
  if (!id || (decision !== 'approved' && decision !== 'rejected')) {
    return NextResponse.json({ ok: false, error: 'Missing id or invalid decision.' }, { status: 400 })
  }
  const adminClient = createAdminClient()
  const { error } = await adminClient.from('podcast_submissions').update({
    status: decision,
    reviewed_by: user.email,
    reviewed_at: new Date().toISOString(),
  }).eq('id', id)
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, status: decision })
}
