import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { GraduationCap, Mail, MapPin } from 'lucide-react'
import Link from 'next/link'
import { createServerClient } from '@supabase/ssr'
import { redirect } from 'next/navigation'

export default async function ParentPortalPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/parent')
  }

  // Get enrollments linked to this user's email
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('*')
    .eq('email', user.email)
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          My Child&apos;s Dashboard
        </h2>
        <Link href="/enroll">
          <Button size="sm">Enroll New Student</Button>
        </Link>
      </div>

      {!enrollments || enrollments.length === 0 ? (
        <Card className="mt-6">
          <CardContent className="p-12 text-center">
            <GraduationCap className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              No Students Yet
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Enroll your first student to get started with Larose Christian Academy.
            </p>
            <Link href="/enroll">
              <Button className="mt-4">Enroll Now</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {enrollments.map((e) => (
            <Card key={e.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>
                    {e.student_first_name} {e.student_last_name}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      e.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-700'
                        : e.status === 'rejected'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {e.status}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <GraduationCap className="h-4 w-4" />
                  Grade: {e.student_grade}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="h-4 w-4" />
                  {e.email}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  {e.city}, {e.state}
                </div>
                <div className="pt-2 text-xs text-gray-400">
                  Enrolled: {new Date(e.created_at).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
