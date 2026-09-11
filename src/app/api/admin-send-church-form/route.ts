import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { isAuthorizedAdmin } from '@/lib/adminAccess'
import { churchFormUrl } from '@/lib/churchFormLink'
import { sendChurchFormRequestEmail } from '@/lib/email'

/**
 * ADMIN ONLY — send a family the link to their Church / Home School Enrollment Form.
 *
 * WHY THIS EXISTS (2026-09-11)
 * Jonathan: "Are the parents who enroll there students not getting the church enrollment form
 * and filling them out?" — and: "the people who pay cash still need to fill those forms out its
 * a must."
 *
 * The database agreed with him and it was bad news: 4 of 5 enrollments had NO form on file, and
 * 4 families had paid anyway. The form was only ever handed out IN FLOW on the website
 * (enroll -> form -> pay), so it never reached:
 *   * CASH families — `/api/cash-enroll` has zero form handling, so every cash family was
 *     enrolled with no legal coverage at all;
 *   * anyone who abandoned the flow, or who enrolled before the gate existed (2026-08-16).
 *
 * The fix is delivery, not enforcement. Mom may take cash when the parent is standing there or
 * hours before she next sits down; a hard block would leave her holding money with no way to
 * record it. So the rule is enforced by making the form IMPOSSIBLE TO MISS and ONE CLICK TO
 * SEND, and by keeping the student visibly incomplete until it is in.
 *
 * Body: { enrollmentId } (one student) or { enrollmentIds: [...] } (a whole family at once).
 * `already_paid=1` is appended to the link when money has changed hands, so the parent is not
 * sent on to a payment step they have already completed.
 */
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email || !isAuthorizedAdmin(user.email)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  const ids: string[] = Array.isArray(body?.enrollmentIds)
    ? body.enrollmentIds.filter((x: unknown) => typeof x === 'string')
    : (typeof body?.enrollmentId === 'string' ? [body.enrollmentId] : [])

  if (ids.length === 0) {
    return NextResponse.json({ error: 'enrollmentId is required' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { data: rows, error } = await admin
    .from('enrollments')
    .select('id, student_first_name, student_last_name, parent_first_name, parent_last_name, email, payment_status, church_form_status')
    .in('id', ids)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  if (!rows || rows.length === 0) {
    return NextResponse.json({ error: 'enrollment not found' }, { status: 404 })
  }

  const origin = new URL(request.url).origin
  const sent: string[] = []
  const failed: { student: string; reason: string }[] = []

  for (const r of rows) {
    const studentName = `${r.student_first_name ?? ''} ${r.student_last_name ?? ''}`.trim()
    const parentName = `${r.parent_first_name ?? ''} ${r.parent_last_name ?? ''}`.trim()
    const alreadyPaid = ['paid', 'cash'].includes(r.payment_status ?? '')

    if (!r.email) {
      failed.push({ student: studentName, reason: 'no parent email on file' })
      continue
    }

    const link = churchFormUrl(
      {
        enrollmentId: r.id,
        studentName,
        parentName,
        parentEmail: r.email,
        alreadyPaid,
      },
      origin,
    )

    const res = await sendChurchFormRequestEmail({
      to: r.email,
      parentName: parentName || 'Parent',
      studentNames: [studentName],
      link,
      alreadyPaid,
    })

    if (res.sent) sent.push(studentName)
    else failed.push({ student: studentName, reason: res.reason || 'send failed' })
  }

  return NextResponse.json({
    ok: failed.length === 0,
    sent,
    failed,
    // Handy for Mom when a family has no email on file: the caller can show it for copying
    // into a text message instead.
    link: rows.length === 1
      ? churchFormUrl(
          {
            enrollmentId: rows[0].id,
            studentName: `${rows[0].student_first_name ?? ''} ${rows[0].student_last_name ?? ''}`.trim(),
            parentName: `${rows[0].parent_first_name ?? ''} ${rows[0].parent_last_name ?? ''}`.trim(),
            alreadyPaid: ['paid', 'cash'].includes(rows[0].payment_status ?? ''),
          },
          origin,
        )
      : null,
  })
}
