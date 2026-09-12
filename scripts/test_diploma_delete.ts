/**
 * Proves Mom's delete actually removes a diploma and that the number sequence keeps counting.
 * Creates a throwaway diploma, deletes it THROUGH THE LIVE API as she would, and confirms the
 * record is gone. Uses a dummy student; never touches a real family.
 */
import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const svc = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY!
const authDb = createClient(url, svc, { auth: { persistSession: false } })
const db = createClient(url, svc, { auth: { persistSession: false, autoRefreshToken: false } })

const cookie = fs
  .readFileSync(path.join(process.env.LOCALAPPDATA || '.', 'Temp', 'cookie.txt'), 'utf8')
  .trim()

let pass = 0, fail = 0
const check = (l: string, ok: boolean, x = '') => {
  if (ok) { pass++; console.log(`  PASS  ${l}${x ? ' — ' + x : ''}`) }
  else { fail++; console.log(`  FAIL  ${l}${x ? ' — ' + x : ''}`) }
}

async function api(body: object) {
  const r = await fetch('https://laroseca.org/api/admin-diplomas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: cookie },
    body: JSON.stringify(body),
  })
  return { status: r.status, json: await r.json().catch(() => ({})) }
}

async function main() {
  // a throwaway student + diploma
  const { data: enr, error: e1 } = await db.from('enrollments').insert({
    student_first_name: 'ZZDelete', student_last_name: 'Test', student_dob: '2008-01-01',
    student_grade: '12th Grade', parent_first_name: 'ZZDELTEST', parent_last_name: 'Test',
    email: `zzdel_${Date.now()}@example.invalid`, phone: '0000000000', address_line1: '1 T',
    city: 'Mobile', state: 'AL', zip: '36601', graduation_status: 'complete',
    status: 'approved', payment_status: 'paid',
  }).select('id').single()
  if (e1 || !enr) throw new Error('setup failed: ' + e1?.message)

  const { data: dip, error: e2 } = await db.from('diplomas').insert({
    enrollment_id: enr.id, student_name: 'ZZDelete Test', graduation_date: '2027-05-21',
    diploma_number: 'LCA-ZZTEST-9999', attested_by: 'test', format: 'digital',
  }).select('id').single()
  if (e2 || !dip) throw new Error('diploma setup failed: ' + e2?.message)
  check('throwaway diploma created', true, dip.id.slice(0, 8))

  // it is really there
  const { data: before } = await db.from('diplomas').select('id').eq('id', dip.id).maybeSingle()
  check('it exists before delete', !!before)

  // delete THROUGH THE LIVE API, the way Mom's button does
  const res = await api({ action: 'delete', id: dip.id })
  check('live delete returned ok', res.status === 200 && res.json.ok === true, JSON.stringify(res.json).slice(0, 60))

  // and it is really gone
  const { data: after } = await db.from('diplomas').select('id').eq('id', dip.id).maybeSingle()
  check('it is GONE from the database', after === null)

  // nextnumber still counts sensibly
  const nn = await api({ action: 'nextnumber' })
  check('nextnumber still returns a number', nn.json.ok && /^LCA-\d{4}-\d{4}$/.test(nn.json.number || ''), nn.json.number)

  // cleanup
  await db.from('enrollments').delete().eq('id', enr.id)
  const { count } = await db.from('enrollments').select('id', { count: 'exact', head: true }).eq('parent_first_name', 'ZZDELTEST')
  check('cleanup left nothing behind', count === 0, `leftover=${count}`)

  console.log(`\n===== ${pass} passed, ${fail} failed =====`)
}

main().catch((e) => { console.error('ERROR:', e.message); process.exit(1) })
  .finally(() => process.exit(fail === 0 ? 0 : 1))
