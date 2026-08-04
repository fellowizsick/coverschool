import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ArrowRight, ShieldCheck, BookOpen, CalendarDays, FileText, ClipboardCheck, GraduationCap, UserCheck } from 'lucide-react'
import { STATE_LAWS, getStateLaw } from '@/lib/stateLaw'
import type { Metadata } from 'next'

export function generateStaticParams() {
  return STATE_LAWS.map((s) => ({ state: s.code.toLowerCase() }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>
}): Promise<Metadata> {
  const { state } = await params
  const law = getStateLaw(state)
  if (!law) return {}
  return {
    title: `${law.name} Homeschool Law Guide | Larose Christian Academy`,
    description: `Homeschooling in ${law.name}? Plain-English guide to ${law.name} homeschool law — compulsory ages, notification requirements, records, testing, and how a church school cover keeps your family legally covered.`,
  }
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex gap-4">
      <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">{label}</p>
        <p className="mt-1 text-gray-700">{value}</p>
      </div>
    </div>
  )
}

export default async function StateLawPage({
  params,
}: {
  params: Promise<{ state: string }>
}) {
  const { state } = await params
  const law = getStateLaw(state)
  if (!law) notFound()

  const rows = [
    { icon: <CalendarDays className="h-5 w-5" />, label: 'Compulsory Attendance', value: law.compulsoryAges },
    { icon: <FileText className="h-5 w-5" />, label: 'Notification / Registration', value: law.notification },
    { icon: <ShieldCheck className="h-5 w-5" />, label: 'How a Cover School Helps', value: law.coverSchoolRole },
    { icon: <BookOpen className="h-5 w-5" />, label: 'Curriculum', value: law.curriculum },
    { icon: <ClipboardCheck className="h-5 w-5" />, label: 'Attendance', value: law.attendance },
    { icon: <GraduationCap className="h-5 w-5" />, label: 'Records & Testing', value: `${law.records} ${law.testing}` },
    { icon: <UserCheck className="h-5 w-5" />, label: 'Teacher Requirements', value: law.teacherQuals },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600 px-4 py-16 sm:px-6 lg:px-8">
        <div className="absolute -left-10 top-8 h-36 w-36 animate-float rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -right-6 bottom-12 h-48 w-48 animate-float rounded-full bg-sky-300/15 blur-3xl [animation-delay:1s]" />
        <div className="mx-auto max-w-3xl text-center">
          <Link href="/homeschool-law" className="mb-4 inline-flex items-center gap-1 rounded-full bg-white/15 px-4 py-1 text-sm font-medium text-white backdrop-blur-sm hover:bg-white/25">
            ← All State Guides
          </Link>
          <span className="mb-3 block text-5xl">{law.flag}</span>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Homeschooling in {law.name}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-cyan-100">
            The {law.name} law, in plain English — and how Larose Christian Academy keeps your
            family covered.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
        {/* Summary card */}
        <Card fun="green" className="mb-10">
          <CardContent className="p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-900">📌 The short version</h2>
            <p className="mt-3 text-lg leading-relaxed text-gray-700">{law.summary}</p>
          </CardContent>
        </Card>

        {/* Requirements grid */}
        <div className="space-y-6">
          {rows.map((row) => (
            <Card key={row.label} fun="blue">
              <CardContent className="p-6">
                <InfoRow icon={row.icon} label={row.label} value={row.value} />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sources */}
        <div className="mt-10 rounded-2xl border border-gray-200 bg-gray-50 p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Official sources
          </h3>
          <ul className="mt-3 space-y-2">
            {law.sources.map((src) => (
              <li key={src.url}>
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-emerald-700 underline decoration-emerald-300 underline-offset-2 hover:text-emerald-800"
                >
                  {src.label} ↗
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-gray-500">
            Informational only — not legal advice. Laws change; confirm current requirements with
            your state\u2019s education department.
          </p>
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-3xl bg-gradient-to-br from-emerald-700 to-emerald-600 p-8 text-center">
          <h2 className="text-2xl font-bold text-white">
            Want {law.name} families to be legally covered — the easy way?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-emerald-100">
            Enroll with Larose Christian Academy. We handle the school-of-record side, file what
            needs filing, and issue official report cards and transcripts.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/enroll">
              <Button size="lg" className="bg-white text-emerald-800 hover:bg-emerald-50">
                Enroll Your Family
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white/60 bg-transparent text-white hover:bg-white/10">
                Ask a Question
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
