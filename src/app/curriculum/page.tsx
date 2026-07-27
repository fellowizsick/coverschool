import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { GraduationCap, Lock, CheckCircle, Shield } from 'lucide-react'
import { getGradeCurriculum } from '@/lib/curriculum_index'
import { gradeToNum } from '@/lib/gradeMap'
import { isAuthorizedAdmin } from '@/lib/adminAccess'

export default async function CurriculumPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/curriculum')
  }

  const isAdmin = isAuthorizedAdmin(user.email)

  // Enrolled children for this parent (matching logged-in email)
  // Admins see all grades for preview
  let enrollments: any[] = []
  if (!isAdmin) {
    const { data: e } = await supabase
      .from('enrollments')
      .select('*')
      .eq('email', user.email)
      .order('created_at', { ascending: false })
    enrollments = e || []
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-center text-sky-900 mb-2">
          📚 My Curriculum
        </h1>
        <p className="text-center text-slate-600 mb-8">
          Pick a student to open their grade. Each grade is a full year,
          unlocked by your monthly membership. Lessons unlock in order —
          one step at a time. 🌟
        </p>

        {!enrollments || enrollments.length === 0 ? (
          isAdmin ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Shield className="mx-auto h-12 w-12 text-emerald-500" />
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  Admin Preview — All Grades
                </h3>
                <p className="mt-2 text-sm text-gray-500 mb-6">
                  You are logged in as an administrator. All grades are unlocked for preview.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-xl mx-auto">
                  {['Kindergarten','1st','2nd','3rd','4th','5th','6th','7th','8th','9th','10th','11th','12th'].map(g => (
                    <Link key={g} href={`/curriculum/preview/${g.toLowerCase()}`}>
                      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 hover:shadow-md hover:border-emerald-400 transition-all cursor-pointer">
                        <div className="text-sm font-medium text-emerald-900">{g}</div>
                        <div className="text-xs text-emerald-600 mt-1">Click to view</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <GraduationCap className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                No students enrolled yet
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Enroll a student and your curriculum unlocks with the monthly
                membership.
              </p>
              <Link href="/enroll">
                <Button className="mt-4">Enroll Now</Button>
              </Link>
            </CardContent>
          </Card>
          )
        ) : (
          <div className="grid gap-5">
            {enrollments.map((e: any) => {
              const approved = e.status === 'approved'
              const gradeNum = gradeToNum(e.student_grade)
              const grade = getGradeCurriculum(gradeNum)
              const locked = !approved || !grade
              return (
                <Card key={e.id} className={locked ? 'opacity-70' : ''}>
                  <CardContent className="p-6 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-sky-600" />
                        <span className="text-lg font-semibold text-slate-900">
                          {e.student_first_name} {e.student_last_name}
                        </span>
                      </div>
                      <div className="text-sm text-slate-500 mt-1">
                        {e.student_grade}
                        {grade && ` · ${grade.subjects.length} subjects`}
                      </div>
                      <div
                        className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                          approved
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {approved ? '✓ Membership active' : '⏳ Pending approval'}
                      </div>
                    </div>

                    <div>
                      {locked ? (
                        <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-4 py-2 text-sm text-slate-500">
                          <Lock className="h-4 w-4" /> Locked
                        </span>
                      ) : (
                        <Link href={`/curriculum/${e.id}`}>
                          <Button variant="gold">▶ Start Learning</Button>
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        <p className="text-center text-xs text-slate-400 mt-10">
          Curriculum authored for Larose Christian Academy. Original content.
        </p>
      </div>
    </div>
  )
}
