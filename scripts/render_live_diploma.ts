/**
 * Renders the LIVE diploma page exactly as a logged-in admin sees it.
 *
 * The diploma route is admin-gated (correctly), so a headless browser cannot just open it.
 * This mints a genuine session for Jonathan's own admin account with the service key, fetches
 * the real page over HTTPS with that session, then rewrites relative asset paths to absolute
 * ones against laroseca.org so the browser can load the site's actual CSS and fonts.
 *
 * The result is the website's own output — not a mock-up.
 */
import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const svc = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY!
const ENR = process.argv[2]
const OUT = process.argv[3]
if (!ENR || !OUT) { console.error('usage: tsx render_live_diploma.ts <enrollmentId> <outPath>'); process.exit(1) }

const db = createClient(url, svc, { auth: { persistSession: false } })

async function main() {
  // 1. mint a real session for the admin account
  const { data: link, error } = await db.auth.admin.generateLink({
    type: 'magiclink',
    email: '1990jonathanbbrown@gmail.com',
    options: { redirectTo: 'https://laroseca.org/' },
  })
  if (error) throw new Error('generateLink: ' + error.message)

  const hashed = (link as { properties?: { hashed_token?: string } })?.properties?.hashed_token
  if (!hashed) throw new Error('no hashed_token returned')

  const { data: sess, error: vErr } = await db.auth.verifyOtp({ type: 'magiclink', token_hash: hashed })
  if (vErr) throw new Error('verifyOtp: ' + vErr.message)
  if (!sess?.session?.access_token) throw new Error('no session returned')
  console.log('  signed in as:', sess.user?.email)

  // 2. fetch the REAL page with that session
  const ref = url.replace(/^https:\/\//, '').split('.')[0]
  const cookieName = `sb-${ref}-auth-token`
  const cookieValue = encodeURIComponent(JSON.stringify(sess.session))

  const res = await fetch(`https://laroseca.org/print/diploma/${ENR}`, {
    headers: { Cookie: `${cookieName}=${cookieValue}`, 'User-Agent': 'Mozilla/5.0' },
    redirect: 'follow',
  })
  const html = await res.text()
  console.log('  status:', res.status, '| bytes:', html.length)
  console.log('  contains "This Certifies":', html.includes('This Certifies'))
  console.log('  contains the student name:', html.includes('Summer'))

  if (!html.includes('This Certifies')) {
    fs.writeFileSync(OUT + '.raw.html', html)
    throw new Error('page did not render the diploma — see the .raw.html for what came back')
  }

  // 3. make the site's own CSS/font/image assets load from the real domain
  const base = '<base href="https://laroseca.org/">'
  const patched = html.includes('<head>')
    ? html.replace('<head>', `<head>${base}`)
    : base + html
  fs.writeFileSync(OUT + '.html', patched)
  console.log('  wrote:', OUT + '.html')
}

main().catch((e) => { console.error('FAILED:', e.message); process.exit(1) })
