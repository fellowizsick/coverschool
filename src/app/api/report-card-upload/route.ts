// @ts-nocheck
import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

const MAX_BYTES = 10 * 1024 * 1024 // 10 MB
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp']

/**
 * POST /api/report-card-upload
 * Body: { enrollmentId, fileName, mimeType, base64 }
 * Uploads a report-card snapshot to the report-cards storage bucket and
 * records it against the given enrollment (student).
 *
 * Authorization: the logged-in parent must own the enrollment (or be admin).
 * Admin (Anne/Jonathan) may upload for any student.
 */
export async function POST(request: Request) {
  try {
    const { enrollmentId, fileName, mimeType, base64 } = await request.json()

    if (!enrollmentId || !fileName || !mimeType || !base64) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    if (!ALLOWED.includes(mimeType)) {
      return NextResponse.json({ error: 'Only JPG, PNG, or WebP images are allowed' }, { status: 400 })
    }

    const buf = Buffer.from(base64, 'base64')
    if (buf.length === 0 || buf.length > MAX_BYTES) {
      return NextResponse.json({ error: 'File too large (max 10 MB)' }, { status: 400 })
    }

    // Auth: current user
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user?.email) {
      return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
    }

    const admin = createAdminClient()

    // Load the enrollment + family group to verify ownership
    const { data: enrollment } = await admin
      .from('enrollments')
      .select('id, email, family_group_id')
      .eq('id', enrollmentId)
      .maybeSingle()

    if (!enrollment) {
      return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 })
    }

    const isAdmin = ['1990jonathanbbrown@gmail.com', 'anneb7669@gmail.com'].includes(
      user.email.toLowerCase().trim()
    )
    // Parent owns it if their email matches OR they're in the same family group
    const owns =
      enrollment.email?.toLowerCase() === user.email.toLowerCase() ||
      (enrollment.family_group_id != null &&
        (await admin
          .from('enrollments')
          .select('id')
          .eq('family_group_id', enrollment.family_group_id)
          .eq('email', user.email)
          .maybeSingle()).data != null)

    if (!isAdmin && !owns) {
      return NextResponse.json({ error: 'You can only upload for your own students' }, { status: 403 })
    }

    // Sanitize file name for storage path
    const safeName = fileName
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .slice(-80)
    const ext = mimeType === 'image/jpeg' ? 'jpg' : mimeType === 'image/png' ? 'png' : 'webp'
    const path = `${enrollmentId}/${Date.now()}_${safeName || 'report-card'}.${ext}`

    const { error: upErr } = await admin.storage.from('report-cards').upload(path, buf, {
      contentType: mimeType,
      upsert: false,
    })
    if (upErr) {
      console.error('Storage upload error:', upErr)
      return NextResponse.json({ error: 'Upload failed: ' + upErr.message }, { status: 500 })
    }

    const { data: row, error: insErr } = await admin
      .from('report_card_snapshots')
      .insert({
        enrollment_id: enrollmentId,
        file_path: path,
        file_name: fileName.slice(-80),
        mime_type: mimeType,
        uploaded_by: user.email,
      })
      .select()
      .single()

    if (insErr) {
      console.error('Snapshot insert error:', insErr)
      return NextResponse.json({ error: 'Failed to save record' }, { status: 500 })
    }

    // Signed URL valid 7 days for preview (private bucket)
    const { data: signed } = await admin.storage
      .from('report-cards')
      .createSignedUrl(path, 60 * 60 * 24 * 7)

    return NextResponse.json({ ok: true, id: row.id, previewUrl: signed?.signedUrl || null })
  } catch (err) {
    console.error('Report card upload error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
