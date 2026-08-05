/* eslint-disable no-console */
// Negative-path tests for POST /api/problem-report
// 1) No cookie at all -> 401
// 2) Signed in but NO approved enrollment -> 403
// Run: node scripts/test-problem-center-negative.mjs
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

const BASE = process.env.BASE_URL || 'http://localhost:3000'

const anon = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)
const admin = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

function cookieFor(session) {
  const ref = env.NEXT_PUBLIC_SUPABASE_URL.match(/https:\/\/([^.]+)\./)?.[1]
  const cookieName = `sb-${ref}-auth-token`
  const cookieValue =
    'base64-' +
    Buffer.from(
      JSON.stringify({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        expires_in: 3600,
        token_type: 'bearer',
        user: session.user,
      })
    ).toString('base64')
  return `${cookieName}=${cookieValue}`
}

async function post(cookie) {
  const form = new FormData()
  form.set('description', 'Negative test report')
  form.append('screenshots', new Blob([readFileSync('scripts/test-screenshot.png')], { type: 'image/png' }), 's.png')
  const headers = cookie ? { Cookie: cookie } : {}
  const res = await fetch(`${BASE}/api/problem-report`, { method: 'POST', headers, body: form })
  return res.status
}

async function main() {
  // Case 1: no auth
  const noAuth = await post(null)
  console.log('no-auth ->', noAuth, noAuth === 401 ? 'PASS' : 'FAIL')
  if (noAuth !== 401) process.exitCode = 1

  // Case 2: signed in, no approved enrollment (fresh user)
  const { data: created } = await admin.auth.admin.createUser({
    email: 'problem-center-nopay@example.com',
    password: 'TestPass2026!',
    email_confirm: true,
  })
  const { data: session } = await anon.auth.signInWithPassword({
    email: 'problem-center-nopay@example.com',
    password: 'TestPass2026!',
  })
  const noPay = await post(cookieFor(session.session))
  console.log('no-approved-enrollment ->', noPay, noPay === 403 ? 'PASS' : 'FAIL')
  if (noPay !== 403) process.exitCode = 1

  // Cleanup the throwaway no-pay user
  if (created?.user) {
    await anon.auth.admin.deleteUser(created.user.id)
    console.log('cleaned up no-pay test user')
  }
}

main().catch((e) => {
  console.error('NEG TEST FAILED:', e.message)
  process.exit(1)
})
