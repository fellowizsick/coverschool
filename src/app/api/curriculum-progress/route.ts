import { NextResponse } from 'next/server'
import { createAdminClient, createClient } from '@/lib/supabase/server'

// GET /api/curriculum-progress?enrollmentId=xxx
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const enrollmentId = searchParams.get('enrollmentId')
  if (!enrollmentId) {
    return NextResponse.json({ error: 'enrollmentId required' }, { status: 400 })
  }

  // Auth check: verify user is logged in
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  // Verify the enrollment belongs to this user
  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('id')
    .eq('id', enrollmentId)
    .eq('email', user.email)
    .single()

  if (!enrollment) {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }

  try {
    const admin = createAdminClient()
    const { data, error } = await admin
      .from('curriculum_progress')
      .select('completed_steps')
      .eq('enrollment_id', enrollmentId)
      .single()
    if (error && error.code !== 'PGRST116') {
      console.error('progress GET error', error)
    }
    return NextResponse.json({ completed_steps: data?.completed_steps ?? [] })
  } catch (e) {
    console.error('progress GET server error', e)
    return NextResponse.json({ completed_steps: [] })
  }
}

// POST /api/curriculum-progress  body: { enrollmentId, completed_steps }
export async function POST(request: Request) {
  try {
    // Auth check: verify user is logged in
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }

    const { enrollmentId, completed_steps } = await request.json()
    if (!enrollmentId || !Array.isArray(completed_steps)) {
      return NextResponse.json({ error: 'invalid body' }, { status: 400 })
    }

    // Verify the enrollment belongs to this user
    const { data: enrollment } = await supabase
      .from('enrollments')
      .select('id')
      .eq('id', enrollmentId)
      .eq('email', user.email)
      .single()

    if (!enrollment) {
      return NextResponse.json({ error: 'not found' }, { status: 404 })
    }

    const admin = createAdminClient()
    const { error } = await admin
      .from('curriculum_progress')
      .upsert(
        {
          enrollment_id: enrollmentId,
          completed_steps,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'enrollment_id' }
      )
    if (error) {
      console.error('progress POST error', error)
      return NextResponse.json({ error: 'save failed' }, { status: 500 })
    }
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('progress POST server error', e)
    return NextResponse.json({ error: 'server error' }, { status: 500 })
  }
}
