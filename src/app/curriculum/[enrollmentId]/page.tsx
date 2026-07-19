import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { getGradeCurriculum } from '@/lib/curriculum_index'
import { gradeToNum } from '@/lib/gradeMap'
import CurriculumPlayer from '@/components/CurriculumPlayer'

export default async function ChildCurriculumPage({
  params,
}: {
  params: Promise<{ enrollmentId: string }>
}) {
  const { enrollmentId } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login?redirect=/curriculum')

  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('*')
    .eq('id', enrollmentId)
    .eq('email', user.email)
    .single()

  if (!enrollment) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Not found</h1>
        <p className="mt-2 text-gray-600">
          This student isn’t linked to your account.
        </p>
        <Link href="/curriculum">
          <Button className="mt-4">← Back to Curriculum</Button>
        </Link>
      </div>
    )
  }

  const approved = enrollment.status === 'approved'
  const gradeNum = gradeToNum(enrollment.student_grade)
  const grade = getGradeCurriculum(gradeNum)

  if (!approved || !grade) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-3">🔒</div>
        <h1 className="text-2xl font-bold text-gray-900">Locked</h1>
        <p className="mt-2 text-gray-600">
          {!grade
            ? `Grade “${enrollment.student_grade}” has no curriculum yet.`
            : 'This grade unlocks once the membership is active.'}
        </p>
        <Link href="/curriculum">
          <Button className="mt-4">← Back</Button>
        </Link>
      </div>
    )
  }

  return (
    <CurriculumPlayer
      grade={grade}
      enrollmentId={enrollmentId}
      studentName={`${enrollment.student_first_name} ${enrollment.student_last_name}`}
      gradeNum={gradeNum}
    />
  )
}
