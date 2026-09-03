import { NextResponse } from 'next/server'
import { resolveSubmitter } from '@/lib/podcast'

// GET /api/podcast/access — can this student submit a podcast video?
// Accepts EITHER a signed student cookie OR a logged-in family account.
// Gate (always re-checked server-side): enrollment status='approved' AND payment_status='paid'.
export async function GET(request: Request) {
  const res = await resolveSubmitter(request)
  if (!res.ok) {
    return NextResponse.json({ ok: true, canSubmit: false, reason: res.reason }, { status: res.status })
  }
  return NextResponse.json({
    ok: true,
    canSubmit: true,
    via: res.via,
    studentName: res.eligible.studentName,
    studentEmail: res.eligible.studentEmail,
  })
}
