import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/Button'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/dashboard')
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const isAdmin = profile?.role === 'admin'

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {isAdmin ? 'Admin Dashboard' : 'Parent Portal'}
        </h1>
        <form
          action={async () => {
            'use server'
            const s = await createClient()
            await s.auth.signOut()
            redirect('/')
          }}
        >
          <Button type="submit" variant="ghost" size="sm">
            Sign Out
          </Button>
        </form>
      </div>

      <nav className="mt-6 flex gap-4 border-b border-gray-200 pb-4">
        {isAdmin ? (
          <>
            <Link
              href="/dashboard"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Overview
            </Link>
            <Link
              href="/dashboard/enrollments"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Enrollments
            </Link>
            <Link
              href="/dashboard/students"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Students
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/parent"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              My Students
            </Link>
          </>
        )}
      </nav>

      <div className="mt-8">{children}</div>
    </div>
  )
}
