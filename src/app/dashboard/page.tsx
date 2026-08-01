import { createClient } from '@/lib/supabase/server'

/** TEMP MINIMAL — isolating the dashboard crash. */
export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return (
    <div>
      <h1 className="text-xl font-bold">MINIMAL DASHBOARD OK</h1>
      <p>user: {user?.email}</p>
    </div>
  )
}
