// @ts-nocheck
import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

/**
 * GET /api/report-card-snapshots
 * Query: ?enrollmentId=xxx (optional — omit to list all of the caller's children)
 * Returns the snapshot rows + 7-day signed preview URLs.
 * Parents only see their own children's snapshots; admins see all.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const enrollmentId = searchParams.get('enrollmentId')

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user?.email) {
      return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
    }

    const admin = createAdminClient()
    const isAdmin = ['1990jonathanbbrown@gmail.com', 'anneb7669@gmail.com'].includes(
      user.email.toLowerCase().trim()
    )

    // Determine which enrollments the caller may see
    let allowedIds: string[] = []
    if (isAdmin) {
      const { data: all } = await admin.from('enrollments').select('id')
      allowedIds = (all || []).map((r) => r.id)
    } else {
      const { data: mine } = await admin
        .from('enrollments')
        .select('id')
        .eq('email', user.email)
      allowedIds = (mine || []).map((r) => r.id)
    }

    let query = admin.from('report_card_snapshots').select('*').order('uploaded_at', { ascending: false })
    if (enrollmentId) {
      query = query.eq('enrollment_id', enrollmentId)
    } else {
      query = query.in('enrollment_id', allowedIds.length ? allowedIds : ['__none__'])
    }

    const { data: rows, error } = await query
    if (error) {
      console.error('Snapshot list error:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    // Build signed URLs
    const result = await Promise.all(
      (rows || []).map(async (r) => {
        const { data: signed } = await admin.storage
          .from('report-cards')
          .createSignedUrl(r.file_path, 60 * 60 * 24 * 7)
        return { ...r, previewUrl: signed?.signedUrl || null }
      })
    )

    return NextResponse.json({ snapshots: result })
  } catch (err) {
    console.error('Snapshot list error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
