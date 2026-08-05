/* eslint-disable no-console */
// End-to-end test of POST /api/problem-report against the local dev server.
// Logs in as the throwaway approved parent, sends description + a real PNG,
// prints the HTTP result. Run: node scripts/test-problem-center-send.mjs
import { readFileSync, writeFileSync } from 'fs'
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
const TEST_EMAIL = 'problem-center-test@example.com'
const TEST_PASS = 'TestPass2026!'

const anon = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

// Build a tiny valid PNG (1x1 red pixel) to attach as the screenshot
function makePng() {
  // Base64 of a 1x1 PNG
  const b64 =
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='
  const buf = Buffer.from(b64, 'base64')
  const path = 'scripts/test-screenshot.png'
  writeFileSync(path, buf)
  return path
}

async function main() {
  // 1) Sign in as the test parent
  const { data: session, error: signInErr } = await anon.auth.signInWithPassword({
    email: TEST_EMAIL,
    password: TEST_PASS,
  })
  if (signInErr) throw new Error(`signIn: ${signInErr.message}`)
  if (!session.session) throw new Error('No session returned')
  console.log('signed in as', TEST_EMAIL)

  // 2) Reconstruct the Supabase auth cookie the SSR client expects.
  //    Cookie name format: sb-<ref>-auth-token
  const ref = env.NEXT_PUBLIC_SUPABASE_URL.match(/https:\/\/([^.]+)\./)?.[1]
  const cookieName = `sb-${ref}-auth-token`
  const cookieValue =
    'base64-' +
    Buffer.from(
      JSON.stringify({
        access_token: session.session.access_token,
        refresh_token: session.session.refresh_token,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        expires_in: 3600,
        token_type: 'bearer',
        user: session.session.user,
      })
    ).toString('base64')

  // 3) Build the multipart form
  const form = new FormData()
  form.set('description', 'TEST: The login page will not load on my phone. I tap Sign In and nothing happens. Please ignore this automated verification report.')
  form.set('studentName', 'Problem Center')
  form.append('screenshots', new Blob([readFileSync(makePng())], { type: 'image/png' }), 'test-screenshot.png')

  // 4) POST to the route with the session cookie
  const res = await fetch(`${BASE}/api/problem-report`, {
    method: 'POST',
    headers: { Cookie: `${cookieName}=${cookieValue}` },
    body: form,
  })
  const body = await res.json().catch(() => ({}))
  console.log('HTTP', res.status)
  console.log('RESPONSE', JSON.stringify(body))
  if (res.status === 200 && body.ok) {
    console.log('PASS: report accepted')
  } else {
    console.log('FAIL: unexpected response')
    process.exitCode = 1
  }
}

main().catch((e) => {
  console.error('TEST FAILED:', e.message)
  process.exit(1)
})
