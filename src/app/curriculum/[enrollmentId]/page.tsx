import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { getGradeCurriculum } from '@/lib/curriculum_index'
import { gradeToNum } from '@/lib/gradeMap'
import CurriculumPlayer from '@/components/CurriculumPlayer'

const SUBJECT_ICONS: Record<string, string> = {
  'Mathematics': '🔢',
  'Language Arts': '📖',
  'Spelling & Word Origins': '✏️',
  'Science': '🔬',
  'History & Geography': '🌍',
  'Bible & Character': '🙏',
}

const SUBJECT_COLORS: Record<string, string> = {
  'Mathematics': 'from-blue-500 to-indigo-600',
  'Language Arts': 'from-emerald-500 to-teal-600',
  'Spelling & Word Origins': 'from-amber-500 to-orange-600',
  'Science': 'from-violet-500 to-purple-600',
  'History & Geography': 'from-rose-500 to-pink-600',
  'Bible & Character': 'from-sky-500 to-cyan-600',
}

export default async function ChildCurriculumPage({
  params,
  searchParams,
}: {
  params: Promise<{ enrollmentId: string }>
  searchParams: Promise<{ subject?: string }>
}) {
  const { enrollmentId } = await params
  const { subject } = await searchParams
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
          This student isn&apos;t linked to your account.
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
            ? `Grade &ldquo;${enrollment.student_grade}&rdquo; has no curriculum yet.`
            : 'This grade unlocks once the membership is active.'}
        </p>
        <Link href="/curriculum">
          <Button className="mt-4">← Back</Button>
        </Link>
      </div>
    )
  }

  // If a subject is selected, filter and show the player
  if (subject) {
    const decodedSubject = decodeURIComponent(subject)
    const chosen = grade.subjects.find(s => s.name === decodedSubject)
    if (chosen) {
      const filteredGrade = { ...grade, subjects: [chosen] }
      return (
        <CurriculumPlayer
          grade={filteredGrade}
          enrollmentId={enrollmentId}
          studentName={`${enrollment.student_first_name} ${enrollment.student_last_name}`}
          gradeNum={gradeNum}
          backUrl={`/curriculum/${enrollmentId}`}
          subjectName={decodedSubject}
        />
      )
    }
  }

  const studentName = `${enrollment.student_first_name} ${enrollment.student_last_name}`

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Header bar */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-emerald-100">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-emerald-900">{studentName}&apos;s {grade.grade}</h1>
            <p className="text-sm text-emerald-600">Pick a subject to start learning</p>
          </div>
          <Link href="/curriculum">
            <Button variant="outline" size="sm">← All Students</Button>
          </Link>
        </div>
      </div>

      {/* Subject Grid */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {grade.subjects.map((subj) => {
            const totalLessons = subj.units.reduce((sum, u) => sum + u.lessons.length, 0)
            const totalUnits = subj.units.length
            const icon = SUBJECT_ICONS[subj.name] || '📚'
            const gradient = SUBJECT_COLORS[subj.name] || 'from-slate-500 to-slate-600'
            return (
              <Link
                key={subj.name}
                href={`/curriculum/${enrollmentId}?subject=${encodeURIComponent(subj.name)}`}
                className="group"
              >
                <div className="rounded-2xl bg-white border border-emerald-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
                  {/* Color bar */}
                  <div className={`h-2 bg-gradient-to-r ${gradient}`} />
                  <div className="p-5">
                    <span className="text-3xl block mb-3">{icon}</span>
                    <h3 className="font-bold text-gray-900 text-sm leading-tight">{subj.name}</h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {totalUnits} units &middot; {totalLessons} lessons
                    </p>
                    <span className="inline-block mt-3 text-xs font-medium text-emerald-600 group-hover:translate-x-1 transition-transform">
                      Start &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
