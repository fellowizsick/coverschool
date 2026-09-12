/**
 * Proves the LIVE site renders the RIGHT name for different students, correctly and undistorted.
 *
 * Jonathan, 2026-09-11: "It needs to make sure names are all even on the diploma aswell cannot
 * be distorted or misspelled words or names ... it has to be tested and verified working with
 * different names but it has to do it from the site"
 *
 * For each awkward name it creates a throwaway enrollment + diploma, renders the ACTUAL
 * deployed page as a signed-in admin, and checks the printed name. Real families are never
 * touched; everything it makes is deleted at the end.
 */
import { createClient } from '@supabase/supabase-js'
import { normalizeName, nameFontSize } from '../src/lib/diploma-name'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const svc = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY!

// TWO clients on purpose. `authDb` mints the admin session; `db` is used for data.
// Sharing one client was a real bug in this test: verifyOtp() signs the client in, after which
// every later request carries that user's JWT — so RLS started applying to the inserts and
// they failed with "new row violates row-level security policy". The service key was fine.
const authDb = createClient(url, svc, { auth: { persistSession: false } })
const db = createClient(url, svc, { auth: { persistSession: false, autoRefreshToken: false } })

// Names deliberately chosen to break a naive template. The first is WHAT THE DATABASE ALREADY
// HOLDS for a real student — trailing spaces and all.
const CASES: { label: string; first: string; last: string; expect: string }[] = [
  { label: 'trailing spaces (exactly what the DB holds now)', first: 'Richard ', last: 'Harrison ', expect: 'Richard Harrison' },
  { label: 'ALL CAPS', first: 'SUMMER', last: 'GRAHAM', expect: 'Summer Graham' },
  { label: 'all lowercase', first: 'ellis', last: 'graham', expect: 'Ellis Graham' },
  { label: 'double space inside', first: 'Blake', last: 'Graham  Smith', expect: 'Blake Graham Smith' },
  { label: 'hyphenated', first: 'mary-jane', last: "o'neill", expect: "Mary-Jane O'Neill" },
  { label: 'very long (must not overflow)', first: 'Alexandria Catherine', last: 'Montgomery-Wellington', expect: 'Alexandria Catherine Montgomery-Wellington' },
]

let pass = 0
let fail = 0
function check(label: string, ok: boolean, extra = '') {
  if (ok) { pass++; console.log(`  PASS  ${label}${extra ? ' — ' + extra : ''}`) }
  else { fail++; console.log(`  FAIL  ${label}${extra ? ' — ' + extra : ''}`) }
}

const created: string[] = []

async function main() {
  // ---- offline: the normaliser itself ----
  console.log('=== normaliser (the spelling/corruption guard) ===')
  for (const c of CASES) {
    const got = normalizeName(`${c.first} ${c.last}`)
    check(`${c.label}`, got === c.expect, `"${got}"`)
  }
  console.log('\n=== font sizing (the fit guard) ===')
  for (const c of CASES) {
    const n = normalizeName(`${c.first} ${c.last}`)
    const size = nameFontSize(n)
    check(`"${n.slice(0, 28)}${n.length > 28 ? '…' : ''}" sized to fit`, size <= 58 && size >= 26, `${size}px`)
  }
  const short = nameFontSize('Summer Graham')
  const long = nameFontSize('Alexandria Catherine Montgomery-Wellington')
  check('a long name is set smaller than a short one', long < short, `${long}px vs ${short}px`)

  // ---- live: the real deployed page, as an admin ----
  console.log('\n=== the LIVE SITE renders each name (admin session) ===')
  const { data: link } = await authDb.auth.admin.generateLink({ type: 'magiclink', email: '1990jonathanbbrown@gmail.com' })
  const hashed = (link as { properties?: { hashed_token?: string } })?.properties?.hashed_token
  const { data: sess } = await authDb.auth.verifyOtp({ type: 'magiclink', token_hash: hashed! })
  if (!sess?.session) throw new Error('could not sign in as admin for the live check')
  const ref = url.replace('https://', '').split('.')[0]
  const cookie = `sb-${ref}-auth-token=${encodeURIComponent(JSON.stringify(sess.session))}`

  for (const c of CASES) {
    const { data: enr, error: insErr } = await db.from('enrollments').insert({
      student_first_name: c.first, student_last_name: c.last, student_dob: '2008-01-01',
      student_grade: '12th Grade', parent_first_name: 'ZZNAME_TEST', parent_last_name: 'Test',
      email: `zzn_${Date.now()}_${Math.random().toString(36).slice(2, 7)}@example.invalid`,
      phone: '0000000000', address_line1: '1 Test St', city: 'Mobile', state: 'AL', zip: '36601',
      graduation_status: 'complete', status: 'approved', payment_status: 'paid',
    }).select('id').single()
    // Fail LOUDLY. A silently skipped case is how a test reports green with nothing tested.
    if (insErr || !enr) {
      check(`${c.label} (setup)`, false, `could not create test student: ${insErr?.message || 'no row'}`)
      continue
    }
    created.push(enr.id)

    await db.from('diplomas').insert({
      enrollment_id: enr.id, student_name: `${c.first} ${c.last}`,
      graduation_date: '2027-05-21', diploma_number: `LCA-TEST-${created.length}`,
      attested_by: 'test', format: 'digital',
    })

    const res = await fetch(`https://laroseca.org/print/diploma/${enr.id}`, {
      headers: { Cookie: cookie, 'User-Agent': 'Mozilla/5.0' },
    })
    const raw = await res.text()
    // React escapes apostrophes to &#x27; etc. Decode before comparing, or a correct name looks
    // like a failure — which is exactly what happened to "O'Neill" on the first run.
    const html = raw
      .replace(/&#x27;/g, "'")
      .replace(/&#39;/g, "'")
      .replace(/&apos;/g, "'")
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
    const ok = res.status === 200 && html.includes(`>${c.expect}<`)
    check(`${c.label}`, ok, ok ? `"${c.expect}" ✓` : `HTTP ${res.status}, expected "${c.expect}"`)
    // and prove the misfire is absent
    if (c.first !== c.first.trim()) {
      const bad = html.includes(`>${c.first} ${c.last}<`)
      check(`  no double-space version printed`, !bad)
    }
  }

  console.log(`\n===== ${pass} passed, ${fail} failed =====`)
}

async function cleanup() {
  for (const id of created) {
    await db.from('diplomas').delete().eq('enrollment_id', id)
    await db.from('enrollments').delete().eq('id', id)
  }
  const { count } = await db.from('enrollments').select('id', { count: 'exact', head: true }).eq('parent_first_name', 'ZZNAME_TEST')
  console.log(`  cleanup: ${count === 0 ? 'clean ✓' : 'LEFTOVER ✗'}`)
}

main().then(cleanup).then(() => process.exit(fail === 0 ? 0 : 1))
  .catch(async (e) => { console.error('TEST ERROR:', e); await cleanup(); process.exit(1) })
