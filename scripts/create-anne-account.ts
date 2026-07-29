import { createServerClient } from '@supabase/ssr'

const supabase = createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { cookies: { getAll() { return [] }, setAll() {} } }
)

async function main() {
  // Check if Anne already has an account
  const { data: users } = await supabase.auth.admin.listUsers()
  const anne = users?.users?.find(u => u.email === 'anneb7669@gmail.com')

  if (anne) {
    console.log('EXISTS|' + anne.email + '|' + anne.id)
    return
  }

  // Create account
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'anneb7669@gmail.com',
    password: process.argv[2] || '@Billie1218',
    email_confirm: true,
    user_metadata: { full_name: 'Anne Brown' }
  })

  if (error) {
    console.log('ERROR|' + error.message)
    return
  }

  console.log('CREATED|' + data.user.email + '|' + data.user.id)
}

main().catch(e => console.log('ERROR|' + e.message))
