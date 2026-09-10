import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { isAuthorizedAdmin } from '@/lib/adminAccess'

/**
 * ADMIN ONLY — correct a student's details.
 *
 * Motivating case: three cash-enrolled students got today's date as their date of birth because
 * the cash form's date field had no label (fixed 2026-09-10). The real birthdays were never
 * captured anywhere, so Mom has to get them from the family and type them in — and until now
 * there was NO way to edit an enrollment at all, so wrong data could never be corrected.
 *
 * Only a whitelist of family-information fields is writable. Payment/Stripe fields are NOT
 * (use /api/admin-set-paid for payment status) — we never hand-edit money state here.
 */

// Fields an admin may correct. Anything not on this list is ignored.
const EDITABLE = [
  'student_first_name', 'student_last_name', 'student_dob', 'student_grade',
  'parent_first_name', 'parent_last_name', 'email', 'phone',
  'address_line1', 'address_line2', 'city', 'state', 'zip',
  'previous_school', 'notes',
] as const

/** Same rule the enrollment forms enforce, so a bad date can't be typed in later either. */
function dobProblem(dob: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) return 'Date of birth must be a real date.'
  const d = new Date(dob + 'T00:00:00')
  if (isNaN(d.getTime())) return 'Date of birth must be a real date.'
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  if (d > today) return 'Date of birth cannot be in the future.'
  // Impossible-age guard: a student is not under 3 or over 100.
  let age = today.getFullYear() - d.getFullYear()
  const m = today.getMonth() - d.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--
  if (age < 3) return 'That date makes the student under 3 years old — please check it.'
  if (age > 100) return 'That date makes the student over 100 years old — please check it.'
  return null
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email || !isAuthorizedAdmin(user.email)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  const { enrollmentId, fields } = body
  if (!enrollmentId || !fields || typeof fields !== 'object') {
    return NextResponse.json({ error: 'enrollmentId and fields are required' }, { status: 400 })
  }

  const patch: Record<string, string> = {}
  for (const key of EDITABLE) {
    if (key in fields && fields[key] !== undefined && fields[key] !== null) {
      patch[key] = String(fields[key]).trim()
    }
  }
  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: 'no editable fields supplied' }, { status: 400 })
  }

  if (patch.student_dob !== undefined && patch.student_dob !== '') {
    const problem = dobProblem(patch.student_dob)
    if (problem) return NextResponse.json({ error: problem }, { status: 400 })
  }
  if (patch.student_first_name === '' || patch.student_last_name === '') {
    return NextResponse.json({ error: 'Student name cannot be empty.' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { error } = await admin.from('enrollments').update(patch).eq('id', enrollmentId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Re-read so the caller gets the authoritative stored values, not what we hoped to write.
  const { data: fresh } = await admin
    .from('enrollments')
    .select(EDITABLE.join(', '))
    .eq('id', enrollmentId)
    .maybeSingle()

  return NextResponse.json({ ok: true, enrollmentId, updated: patch, student: fresh })
}
