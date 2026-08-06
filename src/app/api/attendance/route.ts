import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { verifyFamilyAccess } from '@/lib/academic-verify'
import { getAttendance, summarizeAttendance, getAttendanceTarget } from '@/lib/academic'

const RATE_WINDOW_MS = 60 * 60 * 1000
const RATE_LIMIT = 30
const rateBuckets = new Map<string, number[]>()

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const hits = (rateBuckets.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS)
  if (hits.length >= RATE_LIMIT) {
    rateBuckets.set(ip, hits)
    return true
  }
  hits.push(now)
  rateBuckets.set(ip, hits)
  return false
}

// GET — summary + rows for the verified family's student
export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const q = url.searchParams.get('q') || ''
    let body: Record<string, unknown> = {}
    if (q) {
      try {
        body = JSON.parse(q)
      } catch {
        /* fall through */
      }
    }

    const verified = await verifyFamilyAccess({
      email: String(body.email || ''),
      studentFirstName: String(body.studentFirstName || ''),
      studentLastName: String(body.studentLastName || ''),
      pin: String(body.pin || ''),
    })
    if ('error' in verified) {
      return NextResponse.json({ ok: false, error: verified.error }, { status: verified.status })
    }
    const enrollment = verified.enrollment

    const rows = await getAttendance(enrollment.id)
    const summary = summarizeAttendance(rows)
    const target = getAttendanceTarget(enrollment.state || 'AL')

    return NextResponse.json({
      ok: true,
      enrollmentId: enrollment.id,
      student: `${enrollment.student_first_name} ${enrollment.student_last_name}`,
      rows,
      summary,
      target,
    })
  } catch (e) {
    console.error('attendance GET error:', e)
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 })
  }
}

// POST — log a school day (or edit hours for a date already logged)
export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    if (rateLimited(ip)) {
      return NextResponse.json({ ok: false, error: 'Too many requests. Please try again later.' }, { status: 429 })
    }

    const body = await request.json()
    const verified = await verifyFamilyAccess(body)
    if ('error' in verified) {
      return NextResponse.json({ ok: false, error: verified.error }, { status: verified.status })
    }
    const enrollment = verified.enrollment

    // Validate the date
    const dateStr = String(body.date || '').trim()
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return NextResponse.json({ ok: false, error: 'Please pick a date.' }, { status: 400 })
    }
    const date = new Date(dateStr + 'T00:00:00Z')
    if (isNaN(date.getTime())) {
      return NextResponse.json({ ok: false, error: 'Invalid date.' }, { status: 400 })
    }

    // Validate hours (optional; 0 = just "school today")
    const rawHours = String(body.hours ?? '').trim()
    let hours: number
    if (rawHours === '') {
      hours = 0
    } else {
      hours = parseFloat(rawHours)
      if (isNaN(hours)) {
        return NextResponse.json({ ok: false, error: 'Hours must be a number.' }, { status: 400 })
      }
    }
    if (hours < 0) {
      return NextResponse.json({ ok: false, error: 'Hours cannot be negative.' }, { status: 400 })
    }
    if (hours > 24) {
      return NextResponse.json({ ok: false, error: 'Hours must be between 0 and 24.' }, { status: 400 })
    }
    hours = Math.round(hours * 10) / 10

    // Future dates not allowed (can't log school days that haven't happened)
    const today = new Date()
    today.setUTCHours(0, 0, 0, 0)
    if (date > today) {
      return NextResponse.json({ ok: false, error: 'You can only log today and past school days.' }, { status: 400 })
    }

    const admin = await createAdminClient()
    // Upsert on (enrollment_id, date): re-logging the same day updates hours
    const { data, error } = await admin
      .from('attendance')
      .upsert(
        {
          enrollment_id: enrollment.id,
          date: dateStr,
          hours,
          note: String(body.note || '').trim().slice(0, 200) || null,
        },
        { onConflict: 'enrollment_id,date' }
      )
      .select('id, date, hours')
      .single()

    if (error) {
      console.error('attendance POST error:', error.message)
      return NextResponse.json({ ok: false, error: 'Could not save the day.' }, { status: 500 })
    }
    return NextResponse.json({ ok: true, row: data })
  } catch (e) {
    console.error('attendance POST error:', e)
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 })
  }
}

// DELETE — remove a logged day (idempotent; missing id = ok)
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get('id') || ''
    const body = await request.json().catch(() => ({}))

    const verified = await verifyFamilyAccess(body)
    if ('error' in verified) {
      return NextResponse.json({ ok: false, error: verified.error }, { status: verified.status })
    }
    if (!id) {
      return NextResponse.json({ ok: false, error: 'Missing record id.' }, { status: 400 })
    }

    const admin = await createAdminClient()
    // Only delete a row that belongs to THIS family's enrollment
    const { error } = await admin
      .from('attendance')
      .delete()
      .eq('id', id)
      .eq('enrollment_id', verified.enrollment.id)
    if (error) {
      console.error('attendance DELETE error:', error.message)
      return NextResponse.json({ ok: false, error: 'Could not delete.' }, { status: 500 })
    }
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('attendance DELETE error:', e)
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 })
  }
}
