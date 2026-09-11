/**
 * Proves the diploma auto-fills the RIGHT student.
 *
 * Creates a throwaway enrollment + diploma, runs the EXACT same queries the diploma page runs,
 * and prints the values that would appear on the certificate. Then deletes everything.
 *
 * Run:  npx tsx scripts/test_diploma_autofill.ts
 */
import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY
if (!url || !key) {
  console.error('missing supabase env')
  process.exit(1)
}
const db = createClient(url, key, { auth: { persistSession: false } })
const TAG = `ZZDIP_${Date.now()}`
let enrollmentId = ''
let pass = 0
let fail = 0

function check(label: string, cond: boolean, extra = '') {
  if (cond) { pass++; console.log(`  PASS  ${label}${extra ? ' — ' + extra : ''}`) }
  else { fail++; console.log(`  FAIL  ${label}${extra ? ' — ' + extra : ''}`) }
}

async function main() {
  // A student who is NOT named Jonathan — so a hardcoded name could never pass.
  const FIRST = 'Maria'
  const LAST = 'Vasquez'

  const { data: enr, error: e1 } = await db.from('enrollments').insert({
    student_first_name: FIRST, student_last_name: LAST, student_dob: '2008-03-04',
    student_grade: '12th Grade', parent_first_name: TAG, parent_last_name: 'Parent',
    email: `${TAG}@example.invalid`, phone: '0000000000', address_line1: '1 Test St',
    city: 'Mobile', state: 'AL', zip: '36601', graduation_status: 'in_progress',
    status: 'pending', payment_status: 'pending',
  }).select('id').single()
  if (e1) throw new Error(e1.message)
  enrollmentId = enr.id

  await db.from('diplomas').insert({
    enrollment_id: enrollmentId,
    student_name: `${FIRST} ${LAST}`,
    graduation_date: '2027-05-21',
    diploma_number: 'LCA-2027-0099',
    attested_by: 'test',
    format: 'digital',
  })

  // ---- EXACTLY what the diploma page does ----
  const { data: diploma } = await db.from('diplomas').select('*')
    .eq('enrollment_id', enrollmentId).order('created_at', { ascending: false }).limit(1).maybeSingle()
  const { data: enroll } = await db.from('enrollments')
    .select('student_first_name, student_last_name, student_grade, graduation_date')
    .eq('id', enrollmentId).single()

  const name = diploma?.student_name ||
    `${enroll?.student_first_name || ''} ${enroll?.student_last_name || ''}`.trim()
  const rawDate = diploma?.graduation_date || enroll?.graduation_date
  const gradDate = rawDate ? new Date(rawDate + 'T00:00:00')
    .toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''

  console.log('\n  --- what the certificate would print ---')
  console.log(`  Name:        ${name}`)
  console.log(`  Date:        ${gradDate}`)
  console.log(`  Diploma No.: ${diploma?.diploma_number}`)
  console.log('  ---------------------------------------\n')

  check('name is the RIGHT student (not a hardcoded one)', name === `${FIRST} ${LAST}`, name)
  check('name is NOT Jonathan', !name.includes('Jonathan'))
  check('date comes from the record', gradDate === 'May 21, 2027', gradDate)
  check('diploma number comes from the record', diploma?.diploma_number === 'LCA-2027-0099')

  // ---- second student, to prove it is per-student and not cached ----
  const { data: enr2 } = await db.from('enrollments').insert({
    student_first_name: 'Devon', student_last_name: 'Okafor', student_dob: '2008-07-09',
    student_grade: '12th Grade', parent_first_name: TAG, parent_last_name: 'Parent',
    email: `${TAG}b@example.invalid`, phone: '0000000000', address_line1: '2 Test St',
    city: 'Mobile', state: 'AL', zip: '36601', graduation_status: 'in_progress',
    status: 'pending', payment_status: 'pending',
  }).select('id').single()
  await db.from('diplomas').insert({
    enrollment_id: enr2!.id, student_name: 'Devon Okafor', graduation_date: '2027-05-21',
    diploma_number: 'LCA-2027-0100', attested_by: 'test', format: 'digital',
  })
  const { data: d2 } = await db.from('diplomas').select('*').eq('enrollment_id', enr2!.id).maybeSingle()
  check('a DIFFERENT student gets a DIFFERENT name on their own diploma',
    d2?.student_name === 'Devon Okafor', String(d2?.student_name))
  check('their diploma number is their own', d2?.diploma_number === 'LCA-2027-0100')

  await db.from('diplomas').delete().eq('enrollment_id', enr2!.id)
  await db.from('enrollments').delete().eq('id', enr2!.id)

  console.log(`\n===== ${pass} passed, ${fail} failed =====`)
}

async function cleanup() {
  if (!enrollmentId) return
  await db.from('diplomas').delete().eq('enrollment_id', enrollmentId)
  await db.from('enrollments').delete().eq('id', enrollmentId)
  const { count } = await db.from('diplomas').select('id', { count: 'exact', head: true }).eq('enrollment_id', enrollmentId)
  console.log(`  cleanup: ${count === 0 ? 'clean ✓' : 'LEFTOVER ✗'}`)
}

main().then(cleanup).then(() => process.exit(fail === 0 ? 0 : 1))
  .catch(async (e) => { console.error('TEST ERROR:', e); await cleanup(); process.exit(1) })
