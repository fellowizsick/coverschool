import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { GRADES_K3, SUBJECT_INFO } from '@/lib/curriculum_skills_data'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, ArrowRight, CheckCircle, Sparkles, GraduationCap } from 'lucide-react'

const COLOR_MAP: Record<string, { bg: string, light: string, text: string, border: string, badge: string }> = {
  emerald: { bg: 'from-emerald-950 via-emerald-900 to-gray-950', light: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200', badge: 'text-emerald-700 bg-emerald-100' },
  sky: { bg: 'from-sky-950 via-sky-900 to-gray-950', light: 'bg-sky-50', text: 'text-sky-800', border: 'border-sky-200', badge: 'text-sky-700 bg-sky-100' },
  blue: { bg: 'from-blue-950 via-blue-900 to-gray-950', light: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200', badge: 'text-blue-700 bg-blue-100' },
  amber: { bg: 'from-amber-950 via-amber-900 to-gray-950', light: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200', badge: 'text-amber-700 bg-amber-100' },
}

export async function generateStaticParams() {
  return GRADES_K3.map((g) => ({ grade: g.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ grade: string }> }) {
  const { grade } = await params
  const data = GRADES_K3.find((g) => g.slug === grade)
  if (!data) return { title: 'Grade Not Found' }
  return {
    title: `${data.label} Homeschool Curriculum | Larose Christian Academy`,
    description: `See exactly what your ${data.label.toLowerCase()} (age ${data.ageRange}) will learn. Complete skills breakdown for all 6 subjects. Christian homeschool curriculum included with membership.`,
  }
}

function SubjectSection({ subjectKey, data, colors }: {
  subjectKey: string
  data: { learningObjectives: string; keySkills: string[]; sampleLessons: string[]; endOfYearExpectation: string }
  colors: ReturnType<typeof getColors>
}) {
  const info = SUBJECT_INFO[subjectKey as keyof typeof SUBJECT_INFO] || { label: subjectKey, icon: '📚', description: '' }
  return (
    <Card className={`border-${colors.border} overflow-hidden`}>
      <div className={`${colors.light} px-6 py-4 border-b border-gray-100`}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{info.icon}</span>
          <div>
            <h3 className={`text-lg font-bold ${colors.text}`}>{info.label}</h3>
            <p className="text-sm text-gray-500">{info.description}</p>
          </div>
        </div>
      </div>
      <CardContent className="p-6 space-y-6">
        {/* Learning Objectives */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2">Learning Objective</h4>
          <p className="text-gray-600">{data.learningObjectives}</p>
        </div>

        {/* Key Skills */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Key Skills Your Child Will Master</h4>
          <div className="grid sm:grid-cols-2 gap-2">
            {data.keySkills.map((skill, i) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                <span className="text-sm text-gray-600">{skill}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sample Lessons */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Sample Lessons</h4>
          <div className="space-y-2">
            {data.sampleLessons.map((lesson, i) => (
              <div key={i} className={`rounded-xl border ${colors.border} ${colors.light} p-3 text-sm text-gray-700`}>
                {lesson}
              </div>
            ))}
          </div>
        </div>

        {/* End of Year */}
        <div className={`rounded-xl border ${colors.border} bg-white p-4`}>
          <div className="flex items-start gap-3">
            <GraduationCap className={`h-5 w-5 ${colors.text} shrink-0 mt-0.5`} />
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-1">End-of-Year Expectation</h4>
              <p className="text-sm text-gray-600">{data.endOfYearExpectation}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const SUBJECT_ORDER = ['math', 'english', 'science', 'history', 'bible', 'electives'] as const

export default async function GradePage({ params }: { params: Promise<{ grade: string }> }) {
  const { grade } = await params
  // Logged-in users should go to the real curriculum
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/curriculum')

  const data = GRADES_K3.find((g) => g.slug === grade)
  if (!data) notFound()

  const currentIndex = GRADES_K3.findIndex((g) => g.slug === grade)
  const prevGrade = currentIndex > 0 ? GRADES_K3[currentIndex - 1] : null
  const nextGrade = currentIndex < GRADES_K3.length - 1 ? GRADES_K3[currentIndex + 1] : null
  const colors = COLOR_MAP[data.color] || COLOR_MAP.emerald

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className={`bg-gradient-to-br ${colors.bg} text-white py-20`}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white/80 mb-4">
            <span className="text-lg">{data.icon}</span> Ages {data.ageRange} · {data.totalLessons}+ Lessons
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold font-heading mb-4">
            {data.label}: {data.heroTagline}
          </h1>
          <Link href="/curriculum-preview">
            <span className="text-sm text-white/60 hover:text-white underline inline-block mb-6">
              ← All Grades
            </span>
          </Link>

          {/* Milestones */}
          <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto mt-6">
            {data.milestones.map((m, i) => (
              <div key={i} className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <Sparkles className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                <span className="text-sm text-white/90 text-left">{m}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subject Sections */}
      <section className="max-w-4xl mx-auto px-4 py-16 space-y-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Complete {data.label} Curriculum</h2>
          <p className="text-gray-500 mt-2">6 core subjects — each designed to build knowledge, character, and faith.</p>
        </div>

        {SUBJECT_ORDER.map((key) => (
          <SubjectSection
            key={key}
            subjectKey={key}
            data={data.subjects[key]}
            colors={colors}
          />
        ))}

        {/* Grade Navigation */}
        <div className="flex items-center justify-between pt-8 border-t border-gray-200">
          <div>
            {prevGrade ? (
              <Link href={`/curriculum-preview/${prevGrade.slug}`}>
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  {prevGrade.label}
                </Button>
              </Link>
            ) : (
              <div />
            )}
          </div>
          <Link href={`/curriculum-preview`}>
            <Button variant="ghost">All Grades</Button>
          </Link>
          <div>
            {nextGrade ? (
              <Link href={`/curriculum-preview/${nextGrade.slug}`}>
                <Button variant="outline">
                  {nextGrade.label}
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center max-w-2xl mx-auto px-4">
        <GraduationCap className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to Start {data.label}?</h2>
        <p className="text-gray-500 mb-6">$45/month · $75 annual registration · All curriculum included</p>
        <Link href="/enroll">
          <Button className="bg-gradient-to-r from-amber-500 to-yellow-400 text-amber-950 text-lg px-10 py-4 rounded-xl font-semibold shadow-xl">
            ✨ Enroll Your Student
          </Button>
        </Link>
      </section>
    </div>
  )
}
