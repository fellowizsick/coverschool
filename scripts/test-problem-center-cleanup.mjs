/* eslint-disable no-console */
// One-off: find + delete any remaining problem-center test auth users.
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

const admin = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

async function main() {
  const { data: users, error } = await admin.auth.admin.listUsers()
  if (error) throw new Error(error.message)
  const testUsers = users?.users?.filter((u) => (u.email || '').includes('problem-center')) || []
  console.log('found problem-center users:', testUsers.length)
  for (const u of testUsers) {
    await admin.auth.admin.deleteUser(u.id)
    console.log('deleted', u.id, u.email)
  }
  const { data: after } = await admin.auth.admin.listUsers()
  const remain = after?.users?.filter((u) => (u.email || '').includes('problem-center')) || []
  console.log('remaining:', remain.length, remain.length === 0 ? 'CLEAN OK' : 'STILL PRESENT')
}

main().catch((e) => {
  console.error('FAILED:', e.message)
  process.exit(1)
})
