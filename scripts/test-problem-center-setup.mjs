/* eslint-disable no-console */
// One-shot test setup: creates a throwaway auth user + approved enrollment
// for end-to-end Problem Center verification. Run: node scripts/test-problem-center-setup.mjs
import { readFileSync } from 'fs'
import { createClient } from '@supabase/supabase-js'

const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => {
      const i = l.indexOf('=')
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()]
    })
)

const TEST_EMAIL = 'problem-center-test@example.com'
const TEST_PASS = 'TestPass2026!'
const TEST_NAME = 'Problem Center Test Student'

const admin = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

async function cleanupExisting() {
  // Remove any prior test rows (idempotent re-runs)
  const { data: users } = await admin.auth.admin.listUsers()
  const existing = users?.users?.filter((u) => u.email === TEST_EMAIL)
  for (const u of existing || []) {
    await admin.auth.admin.deleteUser(u.id)
  }
  const { data: enrollments } = await admin
    .from('enrollments')
    .select('id')
    .eq('email', TEST_EMAIL)
  for (const e of enrollments || []) {
    await admin.from('enrollments').delete().eq('id', e.id)
  }
  console.log('cleaned prior test rows')
}

async function main() {
  await cleanupExisting()

  // 1) Create the auth user (email confirmed so sign-in works)
  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email: TEST_EMAIL,
    password: TEST_PASS,
    email_confirm: true,
    user_metadata: { full_name: TEST_NAME },
  })
  if (createErr) throw new Error(`createUser: ${createErr.message}`)
  console.log('created auth user', created.user?.id)

  // 2) Insert an APPROVED (paying) enrollment for that email
  const { data: enrollment, error: insertErr } = await admin
    .from('enrollments')
    .insert({
      parent_first_name: 'Test',
      parent_last_name: 'Parent',
      email: TEST_EMAIL,
      phone: '2515550101',
      address_line1: '1 Test Way',
      city: 'Mobile',
      state: 'AL',
      zip: '36608',
      student_first_name: 'Problem',
      student_last_name: 'Center',
      student_grade: '1',
      student_dob: '2019-01-01',
      status: 'approved',
      payment_status: 'paid',
    })
    .select()
    .single()
  if (insertErr) throw new Error(`insert enrollment: ${insertErr.message}`)
  console.log('created approved enrollment', enrollment.id)

  console.log('READY')
}

main().catch((e) => {
  console.error('SETUP FAILED:', e)
  process.exit(1)
})
