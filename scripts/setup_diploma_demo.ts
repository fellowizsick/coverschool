/**
 * Sets up ONE throwaway diploma so the LIVE website can render a finished certificate that
 * Jonathan can look at. Prints the admin session link so a headless browser can open the real
 * page (the diploma route is admin-gated, as it should be).
 *
 * Everything it creates is tagged and removed by teardown_diploma_demo.ts.
 */
import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const svc = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY!
const db = createClient(url, svc, { auth: { persistSession: false } })

// A CURRENT student's name, so he sees it on a real name from the roster. This is a DETACHED
// demo record — it is not attached to that family's real enrollment and never touches it.
const FIRST = process.env.DEMO_FIRST || 'Summer'
const LAST = process.env.DEMO_LAST || 'Graham'
const TAG = 'ZZDEMO_DIPLOMA'

async function main() {
  const { data: enr, error } = await db.from('enrollments').insert({
    student_first_name: FIRST,
    student_last_name: LAST,
    student_dob: '2008-04-12',
    student_grade: '12th Grade',
    parent_first_name: TAG,
    parent_last_name: 'Demo',
    email: `${TAG.toLowerCase()}@example.invalid`,
    phone: '0000000000',
    address_line1: '1 Demo St',
    city: 'Mobile',
    state: 'AL',
    zip: '36601',
    graduation_status: 'complete',
    status: 'approved',
    payment_status: 'paid',
  }).select('id').single()
  if (error) throw new Error(error.message)

  const { error: e2 } = await db.from('diplomas').insert({
    enrollment_id: enr.id,
    student_name: `${FIRST} ${LAST}`,
    graduation_date: '2027-05-21',
    diploma_number: 'LCA-2027-0001',
    attested_by: '1990jonathanbbrown@gmail.com',
    format: 'digital',
  })
  if (e2) throw new Error(e2.message)

  console.log('ENROLLMENT_ID=' + enr.id)
  console.log('DEMO_URL=https://laroseca.org/print/diploma/' + enr.id)
}

main().catch((e) => { console.error(e); process.exit(1) })
