/**
 * Makes ONE diploma for Jonathan himself and renders it from the LIVE site, so he can approve
 * the design before any student receives one.
 *
 * Leaves the record in place (it is his to keep) and writes the page HTML to a temp file for
 * screenshotting.
 */
import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'
import path from 'node:path'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const svc = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY!

// Separate clients: verifyOtp signs a client in, and then RLS would apply to its data calls.
const authDb = createClient(url, svc, { auth: { persistSession: false } })
const db = createClient(url, svc, { auth: { persistSession: false, autoRefreshToken: false } })

async function main() {
  // Reuse the existing demo student if it is still there; otherwise make one.
  let enrId: string | null = null
  const { data: existing } = await db
    .from('enrollments')
    .select('id')
    .eq('parent_first_name', 'ZZDEMO_DIPLOMA')
    .limit(1)
    .maybeSingle()
  enrId = existing?.id || null

  if (!enrId) {
    const { data: enr, error } = await db.from('enrollments').insert({
      student_first_name: 'Jonathan', student_last_name: 'Brown', student_dob: '1990-09-18',
      student_grade: '12th Grade', parent_first_name: 'ZZDEMO_DIPLOMA', parent_last_name: 'Demo',
      email: 'zzdemo_diploma@example.invalid', phone: '0000000000', address_line1: '1 Demo St',
      city: 'Mobile', state: 'AL', zip: '36601', graduation_status: 'complete',
      status: 'approved', payment_status: 'paid',
    }).select('id').single()
    if (error) throw new Error(error.message)
    enrId = enr.id
  }

  // One diploma record for him. NOTE: this must UPDATE if a record already exists. The first
  // version only inserted when missing, so a reused demo enrollment kept the demo student's name
  // and the certificate printed "Summer Graham" instead of his own — caught by looking at the
  // render, not by trusting the HTTP 200.
  const { data: dip } = await db.from('diplomas').select('id').eq('enrollment_id', enrId).maybeSingle()
  if (dip) {
    const { error } = await db
      .from('diplomas')
      .update({
        student_name: 'Jonathan Brown',
        graduation_date: '2027-05-21',
        diploma_number: 'LCA-2027-0001',
        attested_by: '1990jonathanbbrown@gmail.com',
      })
      .eq('id', dip.id)
    if (error) throw new Error(error.message)
    console.log('  updated existing diploma record to Jonathan Brown')
  } else {
    const { error } = await db.from('diplomas').insert({
      enrollment_id: enrId,
      student_name: 'Jonathan Brown',
      graduation_date: '2027-05-21',
      diploma_number: 'LCA-2027-0001',
      attested_by: '1990jonathanbbrown@gmail.com',
      format: 'digital',
    })
    if (error) throw new Error(error.message)
  }

  // Belt and braces: make sure the enrollment itself carries his name too, since the page falls
  // back to the enrollment when the diploma's own name is blank.
  await db.from('enrollments')
    .update({ student_first_name: 'Jonathan', student_last_name: 'Brown' })
    .eq('id', enrId)

  // Sign in as admin and fetch the REAL page.
  const { data: link } = await authDb.auth.admin.generateLink({ type: 'magiclink', email: '1990jonathanbbrown@gmail.com' })
  const hashed = (link as { properties?: { hashed_token?: string } })?.properties?.hashed_token
  const { data: sess } = await authDb.auth.verifyOtp({ type: 'magiclink', token_hash: hashed! })
  if (!sess?.session) throw new Error('could not sign in')
  const ref = url.replace('https://', '').split('.')[0]
  const cookie = `sb-${ref}-auth-token=${encodeURIComponent(JSON.stringify(sess.session))}`

  const res = await fetch(`https://laroseca.org/print/diploma/${enrId}`, {
    headers: { Cookie: cookie, 'User-Agent': 'Mozilla/5.0' },
  })
  const html = await res.text()
  console.log('  status:', res.status)
  console.log('  name on it:', html.includes('Jonathan Brown') ? 'Jonathan Brown ✓' : 'MISSING')
  if (!html.includes('This Certifies')) throw new Error('page did not render a diploma')

  const out = path.join(process.env.LOCALAPPDATA || '.', 'Temp', 'jonathan_diploma.html')
  fs.writeFileSync(out, html.replace('<head>', '<head><base href="https://laroseca.org/">'))
  console.log('  URL: https://laroseca.org/print/diploma/' + enrId)
  console.log('  wrote:', out)
}

main().catch((e) => { console.error('FAILED:', e.message); process.exit(1) })
