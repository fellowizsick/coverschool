import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { isAuthorizedAdmin } from '@/lib/adminAccess'
import { getGradeCurriculum } from '@/lib/curriculum_index'
import { gradeToNum } from '@/lib/gradeMap'
import { Card, CardContent } from '@/components/ui/Card'

const GRADE_NAMES: Record<string, string> = {
  kindergarten: 'Kindergarten', '1st': '1st Grade', '2nd': '2nd Grade',
  '3rd': '3rd Grade', '4th': '4th Grade', '5th': '5th Grade',
  '6th': '6th Grade', '7th': '7th Grade', '8th': '8th Grade',
  '9th': '9th Grade', '10th': '10th Grade', '11th': '11th Grade', '12th': '12th Grade'
}

export default async function AdminGradePreview({
  params,
}: {
  params: Promise<{ grade: string }>
}) {
  const { grade } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAuthorizedAdmin(user.email)) redirect('/')

  const gradeLabel = GRADE_NAMES[grade.toLowerCase()] || grade
  const gradeNum = gradeToNum(gradeLabel)
  const curriculum = getGradeCurriculum(gradeNum)

  if (!curriculum) {
    return <div className="p-8 text-center text-gray-500">Grade not found</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <a href="/curriculum" className="text-sm text-emerald-600 hover:underline mb-4 inline-block">← Back to curriculum</a>
        <h1 className="text-3xl font-bold text-sky-900 mb-2">{gradeLabel}</h1>
        <p className="text-slate-500 mb-8">{curriculum.age} · {curriculum.subjects.length} subjects · Admin Preview</p>

        {curriculum.subjects.map((subject: any) => (
          <Card key={subject.name} className="mb-6">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-sky-800 mb-4">{subject.name}</h2>
              {subject.units.map((unit: any) => (
                <div key={unit.name} className="mb-4">
                  <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">{unit.name}</h3>
                  <div className="space-y-2">
                    {unit.lessons.map((lesson: any, i: number) => (
                      <details key={i} className="rounded-lg border border-slate-200 overflow-hidden">
                        <summary className="px-4 py-2.5 bg-white hover:bg-slate-50 cursor-pointer text-sm font-medium text-slate-800">
                          {lesson.title}
                        </summary>
                        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200">
                          <p className="text-sm text-slate-600 leading-relaxed">{lesson.summary}</p>
                          {lesson.weekTest && lesson.weekTest.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-slate-200">
                              <p className="text-xs font-medium text-slate-500 mb-2">Week Test ({lesson.weekTest.length} questions)</p>
                              {lesson.weekTest.slice(0, 3).map((q: any) => (
                                <p key={q.id} className="text-xs text-slate-500 mb-1">• {q.q}</p>
                              ))}
                              {lesson.weekTest.length > 3 && <p className="text-xs text-slate-400">+{lesson.weekTest.length - 3} more...</p>}
                            </div>
                          )}
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
