import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

// GET /api/curriculum-progress?enrollmentId=xxx
// Returns { completed_steps: boolean[] }
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const enrollmentId = searchParams.get('enrollmentId')
  if (!enrollmentId) {
    return NextResponse.json({ error: 'enrollmentId required' }, { status: 400 })
  }
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('curriculum_progress')
      .select('completed_steps')
      .eq('enrollment_id', enrollmentId)
      .single()
    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows yet, treat as empty
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
    const { enrollmentId, completed_steps } = await request.json()
    if (!enrollmentId || !Array.isArray(completed_steps)) {
      return NextResponse.json({ error: 'invalid body' }, { status: 400 })
    }
    const supabase = createAdminClient()
    const { error } = await supabase
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
