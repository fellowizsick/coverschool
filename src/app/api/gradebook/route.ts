import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { verifyFamilyAccess } from '@/lib/academic-verify'
import { getGradebook, summarizeGradebook, computeGradebookGpa } from '@/lib/academic'

const RATE_WINDOW_MS = 60 * 60 * 1000
const RATE_LIMIT = 40
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

// GET — gradebook for the verified family's student (per-subject summaries + GPA)
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

    const rows = await getGradebook(verified.enrollment.id)
    const summaries = summarizeGradebook(rows)
    const gpa = computeGradebookGpa(summaries)

    return NextResponse.json({
      ok: true,
      enrollmentId: verified.enrollment.id,
      student: `${verified.enrollment.student_first_name} ${verified.enrollment.student_last_name}`,
      rows,
      summaries,
      gpa,
    })
  } catch (e) {
    console.error('gradebook GET error:', e)
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 })
  }
}

// POST — add a grade entry
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

    const subject = String(body.subjectName || '').trim().slice(0, 80)
    const assignment = String(body.assignmentName || '').trim().slice(0, 120)
    let grade = parseFloat(body.grade)
    const dateStr = String(body.date || '').trim() || new Date().toISOString().slice(0, 10)

    if (!subject) {
      return NextResponse.json({ ok: false, error: 'Please choose a subject.' }, { status: 400 })
    }
    if (!assignment) {
      return NextResponse.json({ ok: false, error: 'Please name the assignment.' }, { status: 400 })
    }
    if (isNaN(grade) || grade < 0 || grade > 100) {
      return NextResponse.json({ ok: false, error: 'Grade must be between 0 and 100.' }, { status: 400 })
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return NextResponse.json({ ok: false, error: 'Invalid date.' }, { status: 400 })
    }
    grade = Math.round(grade * 10) / 10

    const admin = await createAdminClient()
    const { data, error } = await admin
      .from('gradebook_entries')
      .insert({
        enrollment_id: verified.enrollment.id,
        subject_name: subject,
        assignment_name: assignment,
        grade,
        date: dateStr,
        notes: String(body.notes || '').trim().slice(0, 300) || null,
      })
      .select('id')
      .single()

    if (error) {
      console.error('gradebook POST error:', error.message)
      return NextResponse.json({ ok: false, error: 'Could not save the grade.' }, { status: 500 })
    }
    return NextResponse.json({ ok: true, id: data.id })
  } catch (e) {
    console.error('gradebook POST error:', e)
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 })
  }
}

// DELETE — remove a grade entry (only if it belongs to this family's enrollment)
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
      return NextResponse.json({ ok: false, error: 'Missing entry id.' }, { status: 400 })
    }

    const admin = await createAdminClient()
    const { error } = await admin
      .from('gradebook_entries')
      .delete()
      .eq('id', id)
      .eq('enrollment_id', verified.enrollment.id)
    if (error) {
      console.error('gradebook DELETE error:', error.message)
      return NextResponse.json({ ok: false, error: 'Could not delete.' }, { status: 500 })
    }
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('gradebook DELETE error:', e)
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 })
  }
}
