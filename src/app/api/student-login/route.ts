import { NextResponse } from 'next/server'
import { getEligibleEnrollmentByPin } from '@/lib/podcast'
import { signStudentSession, studentCookieHeader } from '@/lib/studentAuth'

// POST /api/student-login  { pin }
// Verifies a school-issued student access code. On success, issues a signed,
// HttpOnly student cookie and redirects to /podcast/submit. This is a SEPARATE
// login from the family account — a child never needs (or sees) a password.
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const pin = String(body.pin || '').trim()
    if (!/^\d{4}$/.test(pin)) {
      return NextResponse.json({ ok: false, error: 'Enter the 4-digit code the school gave you.' }, { status: 400 })
    }

    const eligible = await getEligibleEnrollmentByPin(pin)
    if (!eligible.ok) {
      return NextResponse.json({ ok: false, error: eligible.reason }, { status: 403 })
    }

    const token = signStudentSession({
      enrollmentId: eligible.enrollmentId,
      studentName: eligible.studentName,
      email: eligible.studentEmail,
    })

    const res = NextResponse.json({ ok: true, studentName: eligible.studentName })
    res.headers.append('Set-Cookie', studentCookieHeader(token))
    return res
  } catch (e) {
    console.error('student-login error:', e)
    return NextResponse.json({ ok: false, error: 'Could not sign you in. Try again.' }, { status: 500 })
  }
}
