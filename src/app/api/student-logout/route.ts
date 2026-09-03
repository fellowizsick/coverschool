import { NextResponse } from 'next/server'
import { clearStudentCookieHeader } from '@/lib/studentAuth'

// POST /api/student-logout — clears the signed student cookie.
export async function POST() {
  const res = NextResponse.json({ ok: true })
  res.headers.append('Set-Cookie', clearStudentCookieHeader())
  return res
}
