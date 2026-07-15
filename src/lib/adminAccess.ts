import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

// ⛔ THE ONLY PEOPLE WHO MAY ACCESS THE ADMIN DASHBOARD ⛔
// Batman = Jonathan (owner), Mom = Anne. Robin (the agent) does NOT get a login
// account — it already holds the Supabase service_role key and reads/writes
// everything server-side. So the human allowlist is exactly these two.
export const AUTHORIZED_ADMIN_EMAILS = [
  '1990jonathanbbrown@gmail.com', // Batman
  'anneb7669@gmail.com', // Mom (Anne)
]

export function isAuthorizedAdmin(email?: string | null): boolean {
  if (!email) return false
  return AUTHORIZED_ADMIN_EMAILS.includes(email.toLowerCase().trim())
}

// Call at the top of any admin page. Redirects anyone not on the list.
export async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/dashboard')
  }
  if (!isAuthorizedAdmin(user.email)) {
    // Not Batman or Mom — bounce to the public home.
    redirect('/')
  }
  return supabase
}
