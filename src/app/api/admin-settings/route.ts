import { NextResponse, NextRequest } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { isAuthorizedAdmin } from '@/lib/adminAccess'
import { getSchoolSettings, emblemUrl, DEFAULT_EMBLEM_FILE } from '@/lib/school-settings'

export const dynamic = 'force-dynamic'

const BUCKET = 'school-assets'
const MAX_BYTES = 5 * 1024 * 1024
const ALLOWED = ['image/png', 'image/jpeg', 'image/webp']

async function requireAdminUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAuthorizedAdmin(user.email)) return null
  return user
}

/** GET — the current settings, so the page can show what is actually live. */
export async function GET() {
  const user = await requireAdminUser()
  if (!user) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })

  const s = await getSchoolSettings()
  return NextResponse.json({
    ok: true,
    schoolName: s.schoolName,
    emblemPath: s.emblemPath,
    emblemUrl: emblemUrl(s.emblemPath),
    usingDefaultEmblem: !s.emblemPath,
    defaultEmblemUrl: `/${DEFAULT_EMBLEM_FILE}`,
  })
}

/**
 * POST — save the school name, or upload a new emblem, or go back to the original emblem.
 *
 * Guarded twice on purpose: the dashboard can only be opened by an authorised admin anyway, and the
 * API refuses anyone else even if they call it directly.
 */
export async function POST(request: NextRequest) {
  const user = await requireAdminUser()
  if (!user) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })

  const admin = createAdminClient()
  const type = request.headers.get('content-type') || ''

  // ---- the school name ---------------------------------------------------
  if (type.includes('application/json')) {
    const body = await request.json().catch(() => ({}))
    const action = String(body.action || '')

    if (action === 'name') {
      const name = String(body.school_name || '').replace(/\s+/g, ' ').trim()
      if (!name) return NextResponse.json({ ok: false, error: 'The school name cannot be empty.' }, { status: 400 })
      if (name.length > 60) return NextResponse.json({ ok: false, error: 'That name is too long (60 characters max).' }, { status: 400 })
      const { error } = await admin.from('school_settings')
        .upsert({ id: 1, school_name: name, updated_at: new Date().toISOString() }, { onConflict: 'id' })
      if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
      return NextResponse.json({ ok: true, schoolName: name })
    }

    if (action === 'reset-emblem') {
      // school_name is NOT NULL, so any write must carry it. Read it and pass it through rather
      // than upserting a partial row — that failed with a constraint error on the first attempt.
      const cur = await getSchoolSettings()
      const { error } = await admin.from('school_settings')
        .upsert({ id: 1, school_name: cur.schoolName, emblem_path: null, updated_at: new Date().toISOString() },
                { onConflict: 'id' })
      if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
      return NextResponse.json({ ok: true, emblemUrl: `/${DEFAULT_EMBLEM_FILE}`, usingDefaultEmblem: true })
    }

    return NextResponse.json({ ok: false, error: 'unknown action' }, { status: 400 })
  }

  // ---- a new emblem ------------------------------------------------------
  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return NextResponse.json({ ok: false, error: 'Expected an image upload.' }, { status: 400 })
  }
  const file = form.get('emblem')
  if (!(file instanceof File)) return NextResponse.json({ ok: false, error: 'No image was sent.' }, { status: 400 })
  if (file.size === 0) return NextResponse.json({ ok: false, error: 'That file is empty.' }, { status: 400 })
  if (file.size > MAX_BYTES) return NextResponse.json({ ok: false, error: 'That image is over 5 MB.' }, { status: 400 })
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ ok: false, error: 'Use a PNG, JPEG or WebP image.' }, { status: 400 })
  }

  // The browser trims the empty margins off before upload, so a new logo fills the same space as the
  // one it replaces. If a caller skips that, it still works — it just keeps its own margins.
  const before = await getSchoolSettings()

  const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg'
  const objectPath = `emblem/emblem-${Date.now()}.${ext}`

  const bytes = new Uint8Array(await file.arrayBuffer())
  const { error: upErr } = await admin.storage.from(BUCKET).upload(objectPath, bytes, {
    contentType: file.type, upsert: true, cacheControl: '31536000',
  })
  if (upErr) return NextResponse.json({ ok: false, error: upErr.message }, { status: 500 })

  const { error: dbErr } = await admin.from('school_settings')
    .upsert({ id: 1, school_name: before.schoolName, emblem_path: objectPath, updated_at: new Date().toISOString() },
            { onConflict: 'id' })
  if (dbErr) {
    // do not leave an orphan in the bucket
    await admin.storage.from(BUCKET).remove([objectPath]).catch(() => {})
    return NextResponse.json({ ok: false, error: dbErr.message }, { status: 500 })
  }
  // clear the one it replaced, best effort
  if (before.emblemPath && before.emblemPath !== objectPath) {
    await admin.storage.from(BUCKET).remove([before.emblemPath]).catch(() => {})
  }

  return NextResponse.json({ ok: true, emblemPath: objectPath, emblemUrl: emblemUrl(objectPath), usingDefaultEmblem: false })
}
