/**
 * Mints a real admin session cookie so a local server can be driven as an admin.
 * Used only for reproducing the diploma 500 offline. Writes to %LOCALAPPDATA%\Temp\cookie.txt
 */
import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'
import path from 'node:path'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const svc = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY!
const db = createClient(url, svc, { auth: { persistSession: false } })

async function main() {
  const { data: link, error } = await db.auth.admin.generateLink({
    type: 'magiclink',
    email: '1990jonathanbbrown@gmail.com',
  })
  if (error) { console.error('generateLink failed:', error.message); process.exit(1) }
  const hashed = (link as { properties?: { hashed_token?: string } })?.properties?.hashed_token
  if (!hashed) { console.error('no hashed_token'); process.exit(1) }

  const { data: sess, error: e2 } = await db.auth.verifyOtp({ type: 'magiclink', token_hash: hashed })
  if (e2) { console.error('verifyOtp failed:', e2.message); process.exit(1) }

  const ref = url.replace('https://', '').split('.')[0]
  const cookie = `sb-${ref}-auth-token=${encodeURIComponent(JSON.stringify(sess!.session))}`
  const out = path.join(process.env.LOCALAPPDATA || '.', 'Temp', 'cookie.txt')
  fs.writeFileSync(out, cookie)
  console.log('  session cookie written for', sess!.user?.email)
}

main().catch((e) => { console.error('FAILED:', e.message); process.exit(1) })
