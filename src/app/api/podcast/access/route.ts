import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getEligibleEnrollment } from '@/lib/podcast'

// GET /api/podcast/access — can this logged-in family submit a podcast video?
// Gate: authenticated + enrollment status='approved' AND payment_status='paid'.
export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !user.email) {
    return NextResponse.json({ ok: true, canSubmit: false, reason: 'Please log in with the family account.' }, { status: 401 })
  }
  const eligible = await getEligibleEnrollment(user.email)
  if (!eligible.ok) {
    return NextResponse.json({ ok: true, canSubmit: false, reason: eligible.reason })
  }
  return NextResponse.json({
    ok: true, canSubmit: true,
    studentName: eligible.studentName, studentEmail: eligible.studentEmail,
  })
}
