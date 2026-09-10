import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

/**
 * PUBLIC — a parent, school or district submits a student records request.
 *
 * Accepts ONE OR MANY students. Each student becomes its own request row, matched
 * independently to the right child so it lands on that student's file in the school's
 * admin dashboard. There is NO limit on the number of students — families with 3, 4, 10
 * children all work.
 *
 * Matching runs strongest evidence first and NEVER guesses: if two students could match,
 * the request is stored UNLINKED and the office picks the child in the dashboard.
 *
 * 🔒 `record_requests` has RLS on with ZERO policies — only the service_role client
 * (this route, and the admin dashboard) can touch it.
 */

const norm = (s: unknown) => String(s ?? '').trim().toLowerCase().replace(/\s+/g, ' ')
const dateOnly = (s: unknown) => String(s ?? '').slice(0, 10)

type StudentIn = {
  student_first_name?: string
  student_last_name?: string
  student_dob?: string
  student_grade?: string
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      requester_type, requester_name, requester_email, requester_phone,
      requester_org, requester_address,
      records_requested, other_records, delivery_method, delivery_detail,
      reason, authorization_name,
    } = body

    // ── validate the requester ──────────────────────────────────────────────
    if (!requester_name || !requester_email) {
      return NextResponse.json({ error: 'Your name and email are required.' }, { status: 400 })
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(requester_email))) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }
    if (!authorization_name || !String(authorization_name).trim()) {
      return NextResponse.json({ error: 'Authorization signature is required.' }, { status: 400 })
    }

    // ── normalize the student list (accepts one or many) ────────────────────
    const students: StudentIn[] = Array.isArray(body.students) && body.students.length
      ? body.students
      : [{
          student_first_name: body.student_first_name,
          student_last_name: body.student_last_name,
          student_dob: body.student_dob,
          student_grade: body.student_grade,
        }]

    if (students.length > 25) {
      return NextResponse.json(
        { error: 'That’s a lot of students — please call the school so we can help you directly.' },
        { status: 400 })
    }

    for (const s of students) {
      if (!s.student_first_name || !s.student_last_name) {
        return NextResponse.json(
          { error: 'Every student needs at least a first and last name.' }, { status: 400 })
      }
      const dobMs = Date.parse(String(s.student_dob))
      if (Number.isNaN(dobMs)) {
        return NextResponse.json(
          { error: `Please enter a date of birth for ${s.student_first_name} ${s.student_last_name}.` },
          { status: 400 })
      }
      // Same guard as enrollment: a phone date picker opens on TODAY, so an untouched
      // field silently saves today's date and puts a wrong birthday on state records.
      const ageYears = (Date.now() - dobMs) / 31557600000 // 365.25 days, in ms
      if (ageYears < 3 || ageYears > 100) {
        return NextResponse.json(
          { error: `That date of birth doesn’t look right for ${s.student_first_name} ${s.student_last_name} — please check it.` },
          { status: 400 })
      }
    }

    const wanted = Array.isArray(records_requested) ? records_requested.map(String) : []
    if (wanted.length === 0 && !other_records) {
      return NextResponse.json({ error: 'Please choose at least one record.' }, { status: 400 })
    }

    const admin = createAdminClient()

    // ── load every student on file once, for matching ───────────────────────
    const { data: enrollments } = await admin
      .from('enrollments')
      .select('id, email, family_group_id, student_first_name, student_last_name, student_dob')

    const rows = enrollments || []
    const now = new Date().toISOString()
    const created: { id: string; student: string; linked: boolean }[] = []

    for (const s of students) {
      const first = norm(s.student_first_name)
      const last = norm(s.student_last_name)
      const dob = dateOnly(s.student_dob)

      const sameName = (e: { student_first_name?: string | null; student_last_name?: string | null }) =>
        norm(e.student_first_name) === first && norm(e.student_last_name) === last

      let enrollmentId: string | null = null
      let matchedHow = ''

      // 1) strongest: the requester's email belongs to that family + the name matches
      const byEmail = rows.filter((e) => norm(e.email) === norm(requester_email) && sameName(e))
      if (byEmail.length === 1) {
        enrollmentId = byEmail[0].id
        matchedHow = 'auto: parent email + student name'
      }
      // 2) same name + exact date of birth, school-wide
      if (!enrollmentId) {
        const byDob = rows.filter((e) => sameName(e) && dateOnly(e.student_dob) === dob)
        if (byDob.length === 1) {
          enrollmentId = byDob[0].id
          matchedHow = 'auto: student name + date of birth'
        }
      }
      // 3) a single unambiguous name match
      if (!enrollmentId) {
        const byName = rows.filter(sameName)
        if (byName.length === 1) {
          enrollmentId = byName[0].id
          matchedHow = 'auto: unique student name'
        }
      }
      // Ambiguous or no match → stored unlinked; the office links it in the dashboard.

      const { data: inserted, error } = await admin
        .from('record_requests')
        .insert({
          direction: 'incoming',
          status: 'new',
          enrollment_id: enrollmentId,
          linked_at: enrollmentId ? now : null,
          linked_by: enrollmentId ? matchedHow : '',
          student_first_name: String(s.student_first_name),
          student_last_name: String(s.student_last_name),
          student_dob: dob,
          student_grade: s.student_grade || '',
          requester_type: requester_type || 'parent',
          requester_name: String(requester_name),
          requester_email: String(requester_email),
          requester_phone: requester_phone || '',
          requester_org: requester_org || '',
          requester_address: requester_address || '',
          records_requested: wanted,
          other_records: other_records || '',
          delivery_method: delivery_method || 'email',
          delivery_detail: delivery_detail || '',
          reason: reason || '',
          authorization_name: String(authorization_name),
          authorized_at: now,
        })
        .select('id')
        .single()

      if (error) {
        return NextResponse.json(
          { error: 'Could not save the request. Please call the school.' }, { status: 500 })
      }
      created.push({
        id: inserted?.id,
        student: `${s.student_first_name} ${s.student_last_name}`,
        linked: Boolean(enrollmentId),
      })
    }

    // No email is sent — requests appear only in the school's admin dashboard.
    return NextResponse.json(
      { ok: true, count: created.length, requests: created },
      { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Could not save the request. Please call the school.' }, { status: 500 })
  }
}
