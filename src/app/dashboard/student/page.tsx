import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Search, Users, ArrowLeft, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default async function StudentSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const supabase = await createClient()

  if (!q || q.trim().length < 2) {
    return (
      <div className="text-center py-20">
        <Search className="mx-auto h-12 w-12 text-gray-300" />
        <h2 className="mt-4 text-lg font-semibold text-gray-700">Search for a Student</h2>
        <p className="mt-2 text-sm text-gray-500">Enter a student name above to find their profile.</p>
        <Link href="/dashboard">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to Dashboard
          </Button>
        </Link>
      </div>
    )
  }

  const searchTerm = q.trim()
  const { data: results } = await supabase
    .from('enrollments')
    .select('*')
    .or(`student_first_name.ilike.%${searchTerm}%,student_last_name.ilike.%${searchTerm}%`)
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Search Results: "{searchTerm}"
          </h2>
          <p className="text-sm text-gray-500">{results?.length || 0} student(s) found</p>
        </div>
        <Link href="/dashboard">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-1 h-4 w-4" /> Back
          </Button>
        </Link>
      </div>

      {!results || results.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="mx-auto h-10 w-10 text-gray-300" />
            <h3 className="mt-3 text-base font-semibold text-gray-700">No Students Found</h3>
            <p className="mt-1 text-sm text-gray-500">
              No students match "{searchTerm}". Try a different name.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {results.map((e) => (
            <Link key={e.id} href={`/dashboard/student/${e.id}`}>
              <Card className="hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-base">
                    <span>{e.student_first_name} {e.student_last_name}</span>
                    <ArrowRight className="h-4 w-4 text-emerald-600" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 text-sm text-gray-600">
                  <p>Grade: {e.student_grade} · {e.city}, {e.state}</p>
                  <p>Parent: {e.parent_first_name} {e.parent_last_name}</p>
                  <p>Status: {e.status} · Payment: {e.payment_status}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
