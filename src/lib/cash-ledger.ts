// 📒 CASH LEDGER — the school's permanent record of every cash payment received,
// no matter how it was entered (Mom typing it into her dashboard, or a family
// completing a token link). One row per payment, not per student.
//
// Locked down at the DB level: `cash_payments` has NO RLS policies, so anon and
// authenticated roles get zero access. Only the server (service_role) touches it,
// and it is surfaced exclusively inside the admin dashboard.
//
// Recording is BEST-EFFORT: a ledger failure must never block a family's
// enrollment or a receipt. Errors are logged, not thrown.

import { createAdminClient } from '@/lib/supabase/server'

export type LedgerStudent = { name: string; grade?: string }

export type CashPaymentInput = {
  parentFirstName: string
  parentLastName: string
  email: string
  phone?: string
  amountCents: number
  students: LedgerStudent[]
  method: 'direct' | 'link'   // 'direct' = Mom typed it, 'link' = family self-served
  familyGroupId?: string | null
  enrollmentIds?: string[]
  tokenId?: string | null
  notes?: string
  enteredBy?: string
  receiptNumber?: string | null
}

// Human-readable, collision-resistant receipt number: CASH-YYYYMMDD-XXXXXX
export function makeCashReceiptNumber(): string {
  const d = new Date()
  const stamp = `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, '0')}${String(d.getUTCDate()).padStart(2, '0')}`
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // no 0/O/1/I
  let rand = ''
  for (let i = 0; i < 6; i++) rand += alphabet[Math.floor(Math.random() * alphabet.length)]
  return `CASH-${stamp}-${rand}`
}

export async function recordCashPayment(input: CashPaymentInput) {
  try {
    const admin = createAdminClient()
    const students = Array.isArray(input.students) ? input.students : []
    const { data, error } = await admin
      .from('cash_payments')
      .insert({
        receipt_number: input.receiptNumber ?? makeCashReceiptNumber(),
        parent_first_name: input.parentFirstName || '',
        parent_last_name: input.parentLastName || '',
        email: String(input.email || '').trim().toLowerCase(),
        phone: input.phone || '',
        amount_cents: Math.round(Number(input.amountCents) || 0),
        student_count: students.length,
        students,
        method: input.method,
        family_group_id: input.familyGroupId ?? null,
        enrollment_ids: input.enrollmentIds ?? [],
        token_id: input.tokenId ?? null,
        notes: input.notes || '',
        entered_by: input.enteredBy || '',
      })
      .select('id, receipt_number')
      .single()

    if (error) {
      // 23505 = receipt_number collision → retry once with a fresh number.
      if (error.code === '23505') {
        const retry = await admin
          .from('cash_payments')
          .insert({
            receipt_number: makeCashReceiptNumber(),
            parent_first_name: input.parentFirstName || '',
            parent_last_name: input.parentLastName || '',
            email: String(input.email || '').trim().toLowerCase(),
            phone: input.phone || '',
            amount_cents: Math.round(Number(input.amountCents) || 0),
            student_count: students.length,
            students,
            method: input.method,
            family_group_id: input.familyGroupId ?? null,
            enrollment_ids: input.enrollmentIds ?? [],
            token_id: input.tokenId ?? null,
            notes: input.notes || '',
            entered_by: input.enteredBy || '',
          })
          .select('id, receipt_number')
          .single()
        if (!retry.error) return retry.data
      }
      console.error('cash ledger insert failed:', error)
      return null
    }
    return data
  } catch (err) {
    console.error('cash ledger error:', err)
    return null
  }
}
