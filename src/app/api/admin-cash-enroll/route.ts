// @ts-nocheck
// 🔒 ADMIN-ONLY: Mom/Batman directly enroll one or more cash students and record
// the cash payment. This is data entry (the family already paid in person) — the
// family never fills this; only Mom's dashboard does. Creates approved/paid rows
// and optionally emails a receipt.
import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { isAuthorizedAdmin } from '@/lib/adminAccess'
import { recordCashPayment } from '@/lib/cash-ledger'
import { randomUUID } from 'crypto'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user?.email || !isAuthorizedAdmin(user.email)) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      parent_first_name, parent_last_name, email, phone,
      address_line1, address_line2, city, state, zip,
      amountPaidCents, students, sendReceipt, notes,
    } = body

    // Validate
    if (!parent_first_name || !parent_last_name || !email) {
      return NextResponse.json({ error: 'Parent first name, last name, and email are required' }, { status: 400 })
    }
    const studentList = Array.isArray(students) ? students.filter((s) => s.student_first_name && s.student_last_name) : []
    if (studentList.length === 0) {
      return NextResponse.json({ error: 'Add at least one student' }, { status: 400 })
    }
    for (const s of studentList) {
      if (!s.student_grade || !s.student_dob || !/^\d{4}$/.test(String(s.ssn_last_four || ''))) {
        return NextResponse.json({ error: `Student ${s.student_first_name}: grade, DOB, and SSN last-4 (4 digits) are required` }, { status: 400 })
      }
      // A birth date must be a real past date in a plausible age range. The phone date
      // picker opens on TODAY, so an untouched field silently saves today's date — that
      // already put a wrong birthday on a child's state records once.
      const dobMs = Date.parse(String(s.student_dob))
      if (Number.isNaN(dobMs)) {
        return NextResponse.json({ error: `Student ${s.student_first_name}: enter a valid date of birth` }, { status: 400 })
      }
      const ageYears = (Date.now() - dobMs) / 31557600000 // 365.25 days, in ms
      if (ageYears < 3 || ageYears > 100) {
        return NextResponse.json(
          { error: `Please check Student ${s.student_first_name}'s date of birth — it must be their real birthday.` },
          { status: 400 })
      }
    }

    const admin = createAdminClient()
    const emailNorm = String(email).trim().toLowerCase()

    // Family group: reuse existing family_group for this parent email if present
    let familyGroupId = null
    const { data: existing } = await admin
      .from('enrollments')
      .select('family_group_id')
      .eq('email', emailNorm)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    if (existing?.family_group_id) familyGroupId = existing.family_group_id
    if (!familyGroupId) familyGroupId = randomUUID()

    const nowIso = new Date().toISOString()
    const rows = studentList.map((s) => ({
      parent_first_name, parent_last_name,
      email: emailNorm,
      phone: phone || '',
      address_line1: address_line1 || '',
      address_line2: address_line2 || '',
      city: city || '',
      state: state || '',
      zip: zip || '',
      student_first_name: s.student_first_name,
      student_last_name: s.student_last_name,
      student_grade: s.student_grade,
      student_dob: s.student_dob,
      previous_school: s.previous_school || '',
      ssn_last_four: s.ssn_last_four,
      notes: notes || '',
      status: 'approved',            // cash already collected in person
      payment_status: 'cash',        // distinct from card 'paid'
      payment_method: 'cash',
      amount_paid_cents: Math.round(Number(amountPaidCents) || 0),
      referral_code: null,
      referred_by_code: null,
      family_group_id: familyGroupId,
      terms_accepted_at: nowIso,
      terms_ip: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown',
    }))

    const { data: inserted, error } = await admin
      .from('enrollments')
      .insert(rows)
      .select('id, student_first_name, student_last_name')

    if (error) {
      console.error('Admin cash enroll error:', error)
      return NextResponse.json({ error: 'Failed to enroll. Check for duplicate/unique field errors.' }, { status: 500 })
    }

    // 📒 Ledger: permanent record of the cash received (admin-panel-only table).
    await recordCashPayment({
      parentFirstName: parent_first_name,
      parentLastName: parent_last_name,
      email: emailNorm,
      phone: phone || '',
      amountCents: Math.round(Number(amountPaidCents) || 0),
      students: studentList.map((s: any) => ({
        name: `${s.student_first_name} ${s.student_last_name}`.trim(),
        grade: s.student_grade || '',
      })),
      method: 'direct',
      familyGroupId,
      enrollmentIds: inserted.map((s: any) => s.id),
      notes: notes || '',
      enteredBy: user.email,
    })

    // Optional receipt
    let receiptSent = false
    if (sendReceipt) {
      try {
        const { sendCashReceiptEmail } = await import('@/lib/email')
        const r = await sendCashReceiptEmail({
          to: emailNorm,
          parentName: `${parent_first_name} ${parent_last_name}`,
          studentNames: inserted.map((s) => `${s.student_first_name} ${s.student_last_name}`),
          amountCents: Math.round(Number(amountPaidCents) || 0),
          receiptNumber: `ADM-${String(familyGroupId).slice(0, 6).toUpperCase()}`,
          method: 'cash',
        })
        receiptSent = r.sent
      } catch (err) {
        console.error('Admin cash receipt error:', err)
      }
    }

    return NextResponse.json({
      message: 'Cash enrollment added',
      ids: inserted.map((s) => s.id),
      family_group_id: familyGroupId,
      receipt_sent: receiptSent,
    }, { status: 201 })
  } catch (err) {
    console.error('Admin cash enroll server error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
