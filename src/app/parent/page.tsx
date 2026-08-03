import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { GraduationCap, Mail, MapPin, BookOpen, CheckCircle, Clock, ArrowRight, FileText, Printer } from 'lucide-react'
import Link from 'next/link'
import StopMembershipButton from '@/components/StopMembershipButton'
import ReferralCard from '@/components/ReferralCard'
import { isAuthorizedAdmin } from '@/lib/adminAccess'

export default async function ParentPortalPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/parent')
  }

  const isAdmin = isAuthorizedAdmin(user.email)

  // Admin (Anne/Jonathan) sees ALL children; a parent sees only their own.
  let enrollmentsQuery = supabase
    .from('enrollments')
    .select('*')
    .order('created_at', { ascending: false })
  if (!isAdmin) {
    enrollmentsQuery = enrollmentsQuery.eq('email', user.email)
  }
  const { data: enrollments } = await enrollmentsQuery

  // Same for church enrollment forms
  let churchQuery = supabase
    .from('church_enrollment_forms')
    .select('*')
    .order('created_at', { ascending: false })
  if (!isAdmin) {
    churchQuery = churchQuery.eq('parent_email', user.email)
  }
  const { data: churchForms } = await churchQuery

  // 🎁 Referral program: this family's codes + credit ledger
  const referralCodes =
    enrollments
      ?.map((e) => e.referral_code)
      .filter((c): c is string => Boolean(c)) ?? []

  const { data: referralCredits } = await supabase
    .from('referral_credits')
    .select('*')
    .eq('referrer_email', user.email)

  const creditsEarned = referralCredits?.length ?? 0
  const creditsApplied =
    referralCredits?.filter((c) => c.status === 'applied').length ?? 0

  // Canonical domain — always laroseca.org, never the vercel.app URL (user rule).
  const siteUrl = 'https://laroseca.org'

  return (
    <div className="space-y-10 pt-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* 🎁 Referral Program */}
      <ReferralCard
        referralCodes={referralCodes}
        creditsEarned={creditsEarned}
        creditsApplied={creditsApplied}
        siteUrl={siteUrl}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          {isAdmin ? 'All Students' : 'My Children\'s Dashboard'}
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
          {enrollments.map((e) => {
            const approved = e.status === 'approved'
            const gradeNum = gradeToNum(e.student_grade)
            const grade = getGradeCurriculum(gradeNum)
            const progress = progressMap[e.id]
            const completed = progress?.completed_steps?.length ?? 0

            // Calculate total steps in this grade's curriculum
            let totalSteps = 0
            if (grade) {
              grade.subjects.forEach((subj) => {
                subj.units.forEach((unit) => {
                  unit.lessons.forEach((les) => {
                    totalSteps++ // lesson content
                    if (les.weekTest) totalSteps++ // week test
                  })
                  if (unit.unitTest) totalSteps++ // unit test
                })
              })
            }

            const progressPercent = totalSteps > 0 ? Math.round((completed / totalSteps) * 100) : 0

            return (
              <Card key={e.id} className={approved ? 'border-emerald-200' : ''}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-emerald-600" />
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
                    <BookOpen className="h-4 w-4" />
                    Grade: {e.student_grade} · {e.student_grade} years old
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="h-4 w-4" />
                    {e.email}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    {e.city}, {e.state}
                  </div>

                  {/* Progress Section */}
                  {approved && grade && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                          <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                          Curriculum Progress
                        </span>
                        <span className="text-xs text-gray-500">
                          {completed} / {totalSteps} steps
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-2 rounded-full transition-all"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-400">
                          {progressPercent}% complete
                        </span>
                        <Link
                          href={`/curriculum/${e.id}`}
                          className="text-xs text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
                        >
                          Continue Learning <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  )}

                  {!approved && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-xs text-amber-600">
                        <Clock className="h-3.5 w-3.5" />
                        Curriculum unlocks once enrollment is approved
                      </div>
                    </div>
                  )}

                  <div className="pt-2 text-xs text-gray-400">
                    Enrolled: {new Date(e.created_at).toLocaleDateString()}
                  </div>
                  {(e.status === 'approved' || e.status === 'pending') && (
                    <StopMembershipButton enrollmentId={e.id} cancelled={e.status === 'cancelled'} />
                  )}
                  <div className="pt-2">
                    <Link
                      href={`/parent/transfer-records/${e.id}`}
                      className="text-sm text-emerald-600 hover:text-emerald-700"
                    >
                      → Add previous school records
                    </Link>
                  </div>
                  {approved && (
                    <div className="pt-3 flex flex-wrap gap-2 border-t border-gray-100">
                      <Link href={`/print/report-card/${e.id}`} target="_blank">
                        <Button size="sm" variant="outline" className="flex items-center gap-1">
                          <Printer className="h-3.5 w-3.5" /> Print Report Card
                        </Button>
                      </Link>
                      <Link href={`/print/transcript/${e.id}`} target="_blank">
                        <Button size="sm" variant="outline" className="flex items-center gap-1">
                          <Printer className="h-3.5 w-3.5" /> Print Transcript
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

    {/* Church Enrollment Forms — only this parent's forms */}
    <div className="mt-10">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Church Enrollment Forms 📋
        </h2>
        <Link href="/enroll/church-form">
          <Button size="sm" variant="sky">Fill Out New Form</Button>
        </Link>
      </div>

      {!churchForms || churchForms.length === 0 ? (
        <Card className="mt-4">
          <CardContent className="p-8 text-center">
            <FileText className="mx-auto h-10 w-10 text-gray-300" />
            <h3 className="mt-3 text-base font-semibold text-gray-900">No Forms Yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Fill out a Church/Home School Enrollment Form to get started.
            </p>
            <Link href="/enroll/church-form">
              <Button className="mt-3">Fill Out Form</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {churchForms.map((f) => (
            <Card key={f.id} className="border-emerald-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-base">
                  <span className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-emerald-600" />
                    {f.student_name}
                  </span>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                    {f.church_form_status || 'submitted'}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-600">
                <p>Grade: {f.grade} · {f.school_year}</p>
                <p>Submitted: {new Date(f.created_at).toLocaleDateString()}</p>
                <div className="pt-2 flex gap-2">
                  <Link href={`/enroll/church-form/${f.id}`}>
                    <Button size="sm" variant="outline">
                      <Printer className="mr-1 h-3.5 w-3.5" /> View / Print
                    </Button>
                  </Link>
                  <a href={`/api/church-form-pdf/${f.id}`} target="_blank">
                    <Button size="sm" variant="outline">Download PDF</Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
    </div>
  )
}
