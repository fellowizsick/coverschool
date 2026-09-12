/**
 * Prints a real magic-link URL that, when opened in a browser, signs that browser in as an
 * admin and lands on the diploma page. Used to screenshot the live page for approval.
 */
import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const svc = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY!
const db = createClient(url, svc, { auth: { persistSession: false } })
const ENR = '9b3fb69b-cb3b-4af2-97cd-acaafdc201be'

async function main() {
  const { data, error } = await db.auth.admin.generateLink({
    type: 'magiclink',
    email: '1990jonathanbbrown@gmail.com',
    options: { redirectTo: `https://laroseca.org/print/diploma/${ENR}` },
  })
  if (error) throw new Error(error.message)
  const props = (data as { properties?: { action_link?: string; hashed_token?: string } }).properties
  if (props?.action_link) {
    console.log('ACTION_LINK=' + props.action_link)
  } else {
    console.log('NO ACTION LINK; hashed token present:', !!props?.hashed_token)
  }
}

main().catch((e) => { console.error('FAILED:', e.message); process.exit(1) })
