import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ClientPracticePage from './ClientPracticePage'

export default async function PracticePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirect=/practice')

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/curriculum" className="text-sm text-emerald-600 hover:underline mb-4 inline-block">
          ← Back to Curriculum
        </Link>
        <ClientPracticePage />
      </div>
    </div>
  )
}
