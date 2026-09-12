// Shared family verification for the academic records endpoints.
// Accepts either (a) a signed-in Supabase session with an approved enrollment,
// or (b) email + student name + PIN — the same proof families use at the
// student login. Returns the approved enrollment or a typed error.
//
// (c) ADMIN acting on a named enrollment. Anne must be able to enter and correct records on a
// student's behalf — without this she had no way in, because her admin email matches no
// enrollment. Only an address in AUTHORIZED_ADMIN_EMAILS gets this path, and it requires an
// explicit enrollmentId, so it can never widen a family's own access.
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { isAuthorizedAdmin } from '@/lib/adminAccess'

export type VerifiedEnrollment = {
  id: string
  email: string
  student_first_name: string
  student_last_name: string
  status: string
  state: string | null
}

export type VerifyResult =
  | { enrollment: VerifiedEnrollment }
  | { error: string; status: number }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const SELECT = 'id, email, student_first_name, student_last_name, status, state'

export async function verifyFamilyAccess(body: {
  email?: string
  studentFirstName?: string
  studentLastName?: string
  pin?: string
  enrollmentId?: string
}): Promise<VerifyResult> {
  const admin = await createAdminClient()

  // Path 1: signed-in Supabase session (parent portal / admin)
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Path 1a: ADMIN acting on a specific student (the school entering records on a family's behalf)
  if (isAuthorizedAdmin(user?.email) && body?.enrollmentId) {
    const { data: byAdmin } = await admin
      .from('enrollments')
      .select(SELECT)
      .eq('id', String(body.enrollmentId))
      .maybeSingle()
    if (byAdmin) return { enrollment: byAdmin as VerifiedEnrollment }
    return { error: 'Student not found.', status: 404 }
  }

  if (user?.email) {
    const { data: byAuth } = await supabase
      .from('enrollments')
      .select(SELECT)
      .eq('email', user.email)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(1)
    if (byAuth?.[0]) {
      return { enrollment: byAuth[0] as VerifiedEnrollment }
    }
    return { error: 'Only enrolled LCA families can access records.', status: 403 }
  }

  // Path 2: name + PIN proof (same as student login)
  const firstName = String(body?.studentFirstName || '').trim()
  const lastName = String(body?.studentLastName || '').trim()
  const pin = String(body?.pin || '').trim()
  const email = String(body?.email || '').trim().toLowerCase()

  if (!firstName || !lastName || !/^\d{4}$/.test(pin)) {
    return { error: 'Student name and 4-digit PIN are required.', status: 400 }
  }
  if (!EMAIL_RE.test(email)) {
    return { error: 'Please enter the email address used to enroll.', status: 400 }
  }

  const { data: matches, error: matchErr } = await admin
    .from('enrollments')
    .select('id, email, student_first_name, student_last_name, status, state')
    .ilike('student_first_name', firstName)
    .ilike('student_last_name', lastName)
    .eq('ssn_last_four', pin)
    .eq('status', 'approved')
  if (matchErr) {
    return { error: 'Could not verify enrollment.', status: 500 }
  }
  const match = (matches || []).find((m) => String(m.email || '').toLowerCase() === email)
  if (!match) {
    return {
      error: "We couldn't verify that family. Please use the email you enrolled with and check the student name + PIN.",
      status: 403,
    }
  }
  return { enrollment: match }
}
