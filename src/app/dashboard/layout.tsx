import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { isAuthorizedAdmin } from '@/lib/adminAccess'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import BeachBackdrop from '@/components/BeachBackdrop'

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

  // ⛔ HARD LOCK: only Batman (Jonathan) and Mom (Anne) reach the dashboard.
  if (!isAuthorizedAdmin(user.email)) {
    redirect('/')
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const isAdmin = profile?.role === 'admin'

  return (
    <>
      {/* The beach scene. Rendered only here, and only admins reach this layout, so it is
          admin-dashboard-only by construction. */}
      <BeachBackdrop />
      <div className="mx-auto max-w-[90rem] px-4 pt-24 pb-8 sm:px-6 lg:px-8">
      {/* Everything sits on a near-opaque white panel. The beach is the frame; this is the
          page. Readability must not depend on what part of the scene happens to be behind a
          heading. */}
      <div className="rounded-3xl border border-sky-100 bg-white/95 p-6 shadow-xl shadow-sky-900/5 backdrop-blur-sm sm:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {isAdmin ? 'Admin Portal' : 'Parent Portal'}
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

      <nav className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-gray-200 pb-4">
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
            <Link
              href="/dashboard/graduation"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Graduation
            </Link>
            <Link
              href="/dashboard/diplomas"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Diplomas
            </Link>
            <Link
              href="/dashboard/podcast"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Podcast
            </Link>
            <Link
              href="/dashboard/cash-enroll"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Cash Enroll
            </Link>
            <Link
              href="/dashboard/cash-payments"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Cash Links
            </Link>
            <Link
              href="/dashboard/cash-ledger"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Cash Ledger
            </Link>
            <Link
              href="/dashboard/records-requests"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Records Requests
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/parent"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              My Child&apos;s Dashboard
            </Link>
          </>
        )}
      </nav>

      <div className="mt-8">{children}</div>
      </div>
      </div>
    </>
  )
}
