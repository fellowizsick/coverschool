// @ts-nocheck
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { recordCashPayment } from '@/lib/cash-ledger'
import { randomUUID } from 'crypto'

// ⛔ CASH ENROLLMENT (local-only, token-gated). A family only reaches this via a
// Mom-generated token link. There is NO card / checkout step. It records the
// enrollment as payment_method='cash', status='approved' (cash already collected),
// marks the token used, and emails a digital receipt.
//
// This does NOT require the church-form gate (that's a separate legal form the
// family may complete independently) — cash families pay and enroll, then complete
// the church form normally. Cash is never advertised on the public site.

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { token, parent_first_name, parent_last_name, email, phone,
            address_line1, city, state, zip, students } = body

    // Validate required parent + student info same as /api/enroll.
    if (!token || !parent_first_name || !parent_last_name || !email || !phone ||
        !address_line1 || !city || !state || !zip) {
      return NextResponse.json({ error: 'All required fields must be filled' }, { status: 400 })
    }
    const studentList = Array.isArray(students) && students.length > 0 ? students : []
    if (studentList.length === 0) {
      return NextResponse.json({ error: 'Add at least one student' }, { status: 400 })
    }
    for (const s of studentList) {
      if (!s.student_first_name || !s.student_last_name || !s.student_grade ||
          !s.student_dob || !s.ssn_last_four) {
        return NextResponse.json({ error: 'Please fill in every student’s required fields' }, { status: 400 })
      }
      if (!/^\d{4}$/.test(String(s.ssn_last_four))) {
        return NextResponse.json({ error: 'Each student’s SSN last 4 must be exactly 4 digits' }, { status: 400 })
      }
      // A birth date must be a real past date in a plausible age range. The phone date
      // picker opens on TODAY, so an untouched field silently saves today's date — that
      // already put a wrong birthday on a child's state records once.
      const dobMs = Date.parse(String(s.student_dob))
      if (Number.isNaN(dobMs)) {
        return NextResponse.json({ error: 'Each student needs a valid date of birth' }, { status: 400 })
      }
      const ageYears = (Date.now() - dobMs) / 31557600000 // 365.25 days, in ms
      if (ageYears < 3 || ageYears > 100) {
        return NextResponse.json(
          { error: 'Please check each student’s date of birth — it must be their real birthday.' },
          { status: 400 })
      }
    }

    const supabase = createAdminClient()

    // ⛔ VALIDATE THE TOKEN — must exist, match this email, not used, not expired.
    const { data: tok } = await supabase
      .from('cash_enroll_tokens')
      .select('*')
      .eq('token', token)
      .maybeSingle()
    if (!tok) {
      return NextResponse.json({ error: 'This enrollment link is not valid.' }, { status: 400 })
    }
    if (tok.used_at) {
      return NextResponse.json({ error: 'This enrollment link has already been used.' }, { status: 400 })
    }
    if (tok.expires_at && new Date(tok.expires_at) < new Date()) {
      return NextResponse.json({ error: 'This enrollment link has expired.' }, { status: 400 })
    }
    if (tok.email && tok.email.toLowerCase() !== String(email).trim().toLowerCase()) {
      return NextResponse.json({ error: 'This link is for a different parent email.' }, { status: 400 })
    }
    // Token pre-authorizes a student count — don't let a family add extra kids unseen.
    if (studentList.length > tok.student_count) {
      return NextResponse.json(
        { error: `This link enrolls up to ${tok.student_count} student(s). Please contact the school.` },
        { status: 400 })
    }

    // One family_group_id links all children.
    const familyGroupId = randomUUID()

    const nowIso = new Date().toISOString()
    const rows = studentList.map((s, idx) => ({
      parent_first_name, parent_last_name,
      email: String(email).trim().toLowerCase(),
      phone, address_line1, address_line2: body.address_line2 || '',
      city, state, zip,
      student_first_name: s.student_first_name,
      student_last_name: s.student_last_name,
      student_grade: s.student_grade,
      student_dob: s.student_dob,
      previous_school: s.previous_school || '',
      ssn_last_four: s.ssn_last_four,
      notes: body.notes || '',
      status: 'approved',                 // cash already collected in person
      payment_status: 'cash',             // distinct from card 'paid'
      payment_method: 'cash',
      amount_paid_cents: tok.amount_paid_cents,   // total cash recorded on the token
      referral_code: null,
      referred_by_code: idx === 0 ? normalizeReferral(body.referred_by_code) : null,
      family_group_id: familyGroupId,
      terms_accepted_at: nowIso,
      terms_ip: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown',
    }))

    const { data: inserted, error } = await supabase
      .from('enrollments')
      .insert(rows)
      .select('id, student_first_name, student_last_name, student_grade')

    if (error) {
      console.error('Cash enroll DB error:', error)
      return NextResponse.json({ error: 'Failed to submit enrollment. Please try again.' }, { status: 500 })
    }

    // Mark the token used.
    await supabase
      .from('cash_enroll_tokens')
      .update({ used_at: nowIso })
      .eq('id', tok.id)

    // 📒 Ledger: permanent record of the cash received (admin-panel-only table).
    const receiptNumber = `LCA-${String(tok.id).slice(0, 6).toUpperCase()}`
    await recordCashPayment({
      parentFirstName: parent_first_name,
      parentLastName: parent_last_name,
      email: String(email).trim().toLowerCase(),
      phone: phone || '',
      amountCents: tok.amount_paid_cents,
      students: inserted.map((s) => ({
        name: `${s.student_first_name} ${s.student_last_name}`.trim(),
        grade: s.student_grade || '',
      })),
      method: 'link',
      familyGroupId,
      enrollmentIds: inserted.map((s) => s.id),
      tokenId: tok.id,
      notes: tok.notes || '',
      enteredBy: 'family (link)',
      receiptNumber,
    })

    // Send the digital receipt (best-effort — never fail the enrollment on email).
    try {
      const { sendCashReceiptEmail } = await import('@/lib/email')
      await sendCashReceiptEmail({
        to: String(email).trim().toLowerCase(),
        parentName: `${parent_first_name} ${parent_last_name}`,
        studentNames: inserted.map((s) => `${s.student_first_name} ${s.student_last_name}`),
        amountCents: tok.amount_paid_cents,
        receiptNumber: tok.notes ? `LCA-${String(tok.id).slice(0, 6).toUpperCase()}` : `LCA-${String(new Date().getFullYear())}`,
        method: 'cash',
      })
    } catch (emailErr) {
      console.error('Cash receipt email error:', emailErr)
    }

    return NextResponse.json({
      message: 'Cash enrollment submitted successfully',
      id: inserted[0]?.id,
      ids: inserted.map((s) => s.id),
      family_group_id: familyGroupId,
      receipt_sent: true,
    }, { status: 201 })
  } catch (err) {
    console.error('Cash enroll server error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function normalizeReferral(code) {
  return code && String(code).trim() ? String(code).trim().toUpperCase() : null
}
