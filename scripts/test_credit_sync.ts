/**
 * End-to-end proof that the gradebook -> credit-ledger bridge actually works.
 *
 * Runs the REAL syncGradebookToCredits() against a THROWAWAY enrollment, checks the three
 * things that matter, then deletes everything it created. It never touches a real family.
 *
 * Run:  npx tsx scripts/test_credit_sync.ts
 */
import { createClient } from '@supabase/supabase-js'
import { syncGradebookToCredits } from '../src/lib/credit-sync'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY

if (!url || !key) {
  console.error('missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const db = createClient(url, key, { auth: { persistSession: false } })
const TAG = `ZZTEST_${Date.now()}`
let enrollmentId = ''
let pass = 0
let fail = 0

function check(label: string, cond: boolean, extra = '') {
  if (cond) {
    pass++
    console.log(`  PASS  ${label}${extra ? ' — ' + extra : ''}`)
  } else {
    fail++
    console.log(`  FAIL  ${label}${extra ? ' — ' + extra : ''}`)
  }
}

async function credits() {
  const { data } = await db.from('student_credits').select('*').eq('enrollment_id', enrollmentId)
  return data || []
}

async function main() {
  console.log('=== setting up a throwaway enrollment ===')
  const { data: enr, error: e1 } = await db
    .from('enrollments')
    .insert({
      student_first_name: TAG,
      student_last_name: 'Test',
      student_dob: '2010-01-01',
      student_grade: '9th Grade',
      parent_first_name: TAG,
      parent_last_name: 'Parent',
      email: `${TAG}@example.invalid`,
      phone: '0000000000',
      address_line1: '1 Test St',
      city: 'Mobile',
      state: 'AL',
      zip: '36601',
      graduation_status: 'in_progress',
      status: 'pending',
      payment_status: 'pending',
    })
    .select('id')
    .single()
  if (e1) throw new Error('could not create test enrollment: ' + e1.message)
  enrollmentId = enr.id
  console.log('  test enrollment:', enrollmentId)

  // ---- 1. below threshold: must NOT mint a credit -------------------------------
  console.log('\n=== 1. only 2 grades (below the 3-grade minimum) ===')
  await db.from('gradebook_entries').insert([
    { enrollment_id: enrollmentId, subject_name: 'Algebra I', assignment_name: 'Quiz 1', grade: 90, date: '2025-09-10' },
    { enrollment_id: enrollmentId, subject_name: 'Algebra I', assignment_name: 'Quiz 2', grade: 80, date: '2025-09-20' },
  ])
  let r = await syncGradebookToCredits(enrollmentId)
  check('no credit minted from a stray grade', (await credits()).length === 0, `added=${r.added}`)

  // ---- 2. crossing the threshold: credit appears --------------------------------
  console.log('\n=== 2. add a 3rd grade — course is now real ===')
  await db.from('gradebook_entries').insert([
    { enrollment_id: enrollmentId, subject_name: 'Algebra I', assignment_name: 'Ch 4 Test', grade: 85, date: '2025-10-01' },
  ])
  r = await syncGradebookToCredits(enrollmentId)
  let c = await credits()
  check('one credit created', c.length === 1, `count=${c.length}`)
  check('mapped to Mathematics (algebra -> Mathematics)', c[0]?.subject === 'Mathematics', `subject=${c[0]?.subject}`)
  check('worth a full Carnegie unit', Number(c[0]?.credits) === 1, `credits=${c[0]?.credits}`)
  check('marked verified (school coursework)', c[0]?.verification_status === 'verified')
  check('audit trail recorded in notes', String(c[0]?.notes || '').includes('Auto-derived'))

  // ---- 3. IDEMPOTENCY: running again must not double it -------------------------
  console.log('\n=== 3. run the sync four more times (the double-credit risk) ===')
  for (let i = 0; i < 4; i++) await syncGradebookToCredits(enrollmentId)
  c = await credits()
  check('still exactly one credit after 5 runs', c.length === 1, `count=${c.length}`)

  // ---- 4. a second subject in the same year -> a second credit ------------------
  console.log('\n=== 4. a different subject earns its own credit ===')
  await db.from('gradebook_entries').insert([
    { enrollment_id: enrollmentId, subject_name: 'Biology', assignment_name: 'Lab 1', grade: 88, date: '2025-09-15' },
    { enrollment_id: enrollmentId, subject_name: 'Biology', assignment_name: 'Lab 2', grade: 92, date: '2025-10-15' },
    { enrollment_id: enrollmentId, subject_name: 'Biology', assignment_name: 'Midterm', grade: 84, date: '2025-11-15' },
  ])
  await syncGradebookToCredits(enrollmentId)
  c = await credits()
  check('second credit created', c.length === 2, `count=${c.length}`)
  check('biology -> Science', c.some((x) => x.subject === 'Science'), `subjects=${c.map((x) => x.subject).join(', ')}`)

  // ---- 5. a manual credit must NEVER be touched --------------------------------
  console.log('\n=== 5. a hand-added credit (source != lca) is left alone ===')
  await db.from('student_credits').insert({
    enrollment_id: enrollmentId, subject: 'English', course_name: 'Hand added by Anne',
    credits: 1, source: 'transfer', verification_status: 'pending',
  })
  await syncGradebookToCredits(enrollmentId)
  c = await credits()
  const manual = c.find((x) => x.course_name === 'Hand added by Anne')
  check('manual credit survived', !!manual, `total=${c.length}`)
  check('manual credit not deleted by sync', !!manual)
  check('manual credit still pending (sync did not verify it)', manual?.verification_status === 'pending')

  // ---- 6. deleting grades must remove the derived credit ------------------------
  console.log('\n=== 6. delete the Biology grades — its credit must come back out ===')
  await db.from('gradebook_entries').delete().eq('enrollment_id', enrollmentId).eq('subject_name', 'Biology')
  const r6 = await syncGradebookToCredits(enrollmentId)
  c = await credits()
  check('biology credit removed', !c.some((x) => x.subject === 'Science'), `removed=${r6.removed}`)
  check('algebra credit kept', c.some((x) => x.subject === 'Mathematics'))
  check('manual credit STILL kept', !!c.find((x) => x.course_name === 'Hand added by Anne'))

  console.log(`\n===== ${pass} passed, ${fail} failed =====`)
}

async function cleanup() {
  if (!enrollmentId) return
  console.log('\n=== cleanup: deleting every test row created ===')
  await db.from('student_credits').delete().eq('enrollment_id', enrollmentId)
  await db.from('gradebook_entries').delete().eq('enrollment_id', enrollmentId)
  await db.from('enrollments').delete().eq('id', enrollmentId)
  const { count: cCount } = await db.from('student_credits').select('id', { count: 'exact', head: true }).eq('enrollment_id', enrollmentId)
  const { count: gCount } = await db.from('gradebook_entries').select('id', { count: 'exact', head: true }).eq('enrollment_id', enrollmentId)
  console.log(`  removed: credits=${cCount === 0 ? 'ok' : 'LEFTOVER'} grades=${gCount === 0 ? 'ok' : 'LEFTOVER'}`)
}

main()
  .then(cleanup)
  .then(() => process.exit(fail === 0 ? 0 : 1))
  .catch(async (e) => {
    console.error('TEST ERROR:', e)
    await cleanup()
    process.exit(1)
  })
