import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import {
  ArrowRight, BookOpen, CheckCircle2, GraduationCap, Library,
  Sparkles, Calculator, Globe, ClipboardList, FileText, HeartHandshake,
} from 'lucide-react'
import { SUBJECTS_BY_GRADE } from '@/lib/subjects'

// ⚠️ ACCURACY CHECK (2026-08-05): This page is written to match EXACTLY what
// the enroll page and welcome emails promise:
//   - $45/mo tuition = administrative services, record-keeping, legal oversight
//   - Free curriculum resources INCLUDED with membership (Khan, Discovery K12, ...)
//   - Curriculum BOOKS are NOT included, purchased separately
//   - ACE PACE sets from Christianbook.com are the recommended structured option
// Do not change these claims without updating /enroll and src/lib/email.ts too.

const freeResources = [
  {
    icon: Calculator,
    name: 'Khan Academy',
    url: 'https://www.khanacademy.org',
    tagline: 'Free, self-paced online lessons',
    description:
      'Complete video lessons and practice exercises for math, science, history, and more — from kindergarten through early college. Free, no ads, works on any device.',
    howToUse:
      'Create a free account, pick your child\'s grade, and work through the lessons at your own pace. Perfect as your daily core instruction or to fill gaps in any subject.',
    bestFor: 'Daily math and science instruction, K–12',
  },
  {
    icon: Globe,
    name: 'Discovery K12',
    url: 'https://discoveryk12.com',
    tagline: 'Free, complete Pre-K to 12 curriculum',
    description:
      'A full online curriculum covering reading, writing, math, science, and social studies for every grade. Includes a printable daily schedule and progress tracking.',
    howToUse:
      'Use it as an all-in-one backbone: log in daily, follow the built-in schedule, and keep samples of your child\'s work for your LCA records.',
    bestFor: 'Families that want a ready-made daily structure',
  },
  {
    icon: Library,
    name: 'Christianbook.com — Homeschool',
    url: 'https://www.christianbook.com/page/homeschool',
    tagline: 'Faith-based textbooks and workbooks',
    description:
      'PreK–12 textbooks, workbooks, readers, and full curriculum sets — including the ACE PACE sets we recommend. Both print and digital options.',
    howToUse:
      'This is where you purchase your curriculum BOOKS (tuition does not include books). Our welcome email links you to the correct grade-level ACE set for your student.',
    bestFor: 'Families that prefer printed, faith-based curriculum',
  },
  {
    icon: ClipboardList,
    name: 'HomeTrail Planner',
    url: 'https://hometrail.net/free-homeschool-planner',
    tagline: 'Free digital lesson planner',
    description:
      'Plan lessons, track attendance, log progress, and manage multiple children in one place. Free digital homeschool planner.',
    howToUse:
      'Use it to keep your daily attendance log and lesson records — the same records LCA tracks for your student file. Export or keep a copy for your own records.',
    bestFor: 'Organized record-keeping for multiple kids',
  },
  {
    icon: GraduationCap,
    name: 'Sophia Learning',
    url: 'https://www.sophia.org/plans-and-pricing/',
    tagline: 'College credit for high schoolers',
    description:
      'Self-paced college-level courses. High school students can earn transferable college credits online with an affordable membership.',
    howToUse:
      'Use in high school for dual-credit style learning. LCA keeps the transcript so any credits earned are recorded on your student\'s official record.',
    bestFor: '9th–12th graders ready for college-level work',
  },
  {
    icon: Sparkles,
    name: 'ACT Test Prep',
    url: 'https://www.act.org/content/act/en/products-and-services/the-act/test-preparation.html',
    tagline: 'Free official ACT practice',
    description:
      'Free official ACT practice tests, question of the day, prep guides, and tutoring resources straight from ACT.org.',
    howToUse:
      'Have your high schooler take a practice test a few months before test day, then focus study on weak areas. LCA transcripts record the coursework that prepares them.',
    bestFor: 'Juniors and seniors preparing for the ACT',
  },
]

const gradeRows = Object.entries(SUBJECTS_BY_GRADE)

export default function CurriculumPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-gray-950 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white/80 mb-4">
            <span>📖</span> Curriculum & Learning
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-heading mb-4">
            How Curriculum Works at LCA
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            At Larose Christian Academy, <strong>you choose the curriculum and you teach</strong> —
            we handle the legal coverage, records, and transcripts. Here&apos;s exactly how the
            pieces fit together.
          </p>
        </div>
      </section>

      {/* How it works — the 3-part model */}
      <section className="max-w-4xl mx-auto px-4 py-14">
        <h2 className="text-2xl font-bold text-gray-900 font-heading text-center mb-2">
          The LCA Learning Model
        </h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto">
          Three simple pieces. You bring the teaching; we bring the coverage and support.
        </p>
        <div className="grid gap-6 mt-10 md:grid-cols-3">
          <Card fun="green">
            <CardContent className="p-6">
              <HeartHandshake className="h-8 w-8 text-emerald-600" />
              <h3 className="mt-3 font-bold text-gray-900">1. Legal Coverage & Records</h3>
              <p className="mt-2 text-sm text-gray-600">
                Your tuition covers administrative services, record-keeping, and legal oversight
                under our Alabama church school. We keep your student file, report cards, and
                transcripts.
              </p>
            </CardContent>
          </Card>
          <Card fun="amber">
            <CardContent className="p-6">
              <BookOpen className="h-8 w-8 text-amber-600" />
              <h3 className="mt-3 font-bold text-gray-900">2. Your Curriculum Choice</h3>
              <p className="mt-2 text-sm text-gray-600">
                You pick the materials and teach your way. Free online resources are included
                with membership; printed curriculum books are purchased separately.
              </p>
            </CardContent>
          </Card>
          <Card fun="blue">
            <CardContent className="p-6">
              <FileText className="h-8 w-8 text-blue-600" />
              <h3 className="mt-3 font-bold text-gray-900">3. Records That Follow</h3>
              <p className="mt-2 text-sm text-gray-600">
                Use the Parent Portal to track progress, upload report cards, and access your
                student&apos;s official records whenever you need them.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* The two curriculum paths */}
      <section className="max-w-4xl mx-auto px-4 pb-14">
        <h2 className="text-2xl font-bold text-gray-900 font-heading text-center mb-2">
          Two Ways to Build Your Curriculum
        </h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto">
          Both paths work with LCA. Choose the one that fits your family — you can mix them too.
        </p>
        <div className="grid gap-6 mt-10 md:grid-cols-2">
          <div className="rounded-3xl border-2 border-emerald-200 bg-emerald-50/60 p-7">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              <h3 className="text-lg font-bold text-emerald-900">Path A — Free Resources (included)</h3>
            </div>
            <p className="mt-3 text-sm text-emerald-900/80">
              Every LCA membership includes free curriculum resources — Khan Academy, Discovery K12,
              and the others below. No extra cost, no sign-up fees. Use one platform or combine several
              to cover every subject.
            </p>
            <p className="mt-3 text-sm font-semibold text-emerald-800">
              Cost: $0 — included with your tuition.
            </p>
            <Link href="#free-resources" className="mt-4 inline-block text-sm font-semibold text-emerald-700 underline decoration-emerald-300 underline-offset-2">
              See the free resources ↓
            </Link>
          </div>
          <div className="rounded-3xl border-2 border-amber-200 bg-amber-50/60 p-7">
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-amber-600" />
              <h3 className="text-lg font-bold text-amber-900">Path B — Structured Books (purchased)</h3>
            </div>
            <p className="mt-3 text-sm text-amber-900/80">
              For families that prefer printed, structured materials, we recommend ACE PACE
              curriculum sets from Christianbook.com — a complete grade-level set of workbooks
              and answer keys. Books are purchased separately (tuition does not include them).
            </p>
            <p className="mt-3 text-sm font-semibold text-amber-800">
              Cost: Books only — you buy the set for your child&apos;s grade.
            </p>
            <a
              href="https://www.christianbook.com/page/homeschool/ace"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-600"
            >
              Shop ACE PACE Sets →
            </a>
          </div>
        </div>
      </section>

      {/* Free resources */}
      <section id="free-resources" className="max-w-4xl mx-auto px-4 pb-14 scroll-mt-24">
        <div className="rounded-2xl border border-emerald-100 bg-white p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 font-heading">
            Free Resources Included With Your Membership
          </h2>
          <p className="mt-2 text-gray-600">
            These platforms are free and open to everyone — and they&apos;re already included in
            your LCA tuition. Use them alongside your enrollment to build a complete education plan.
          </p>
        </div>
        <div className="space-y-5">
          {freeResources.map((r) => (
            <Card key={r.name} fun="green" className="overflow-hidden">
              <CardContent className="p-6 sm:p-7">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                    <r.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-bold text-gray-900">{r.name}</h3>
                      <span className="rounded-full bg-emerald-50 px-3 py-0.5 text-xs font-medium text-emerald-700">
                        {r.tagline}
                      </span>
                    </div>
                    <p className="mt-2 text-gray-600">{r.description}</p>
                    <div className="mt-3 rounded-xl bg-emerald-50/70 p-3">
                      <p className="text-sm text-emerald-900">
                        <strong className="font-semibold">How to use it with LCA:</strong> {r.howToUse}
                      </p>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">Best for: {r.bestFor}</p>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                    >
                      Visit {r.name} <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Grade-by-grade subjects */}
      <section className="max-w-4xl mx-auto px-4 pb-14">
        <h2 className="text-2xl font-bold text-gray-900 font-heading text-center mb-2">
          What Each Grade Covers
        </h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto">
          The subject framework LCA tracks for each grade. Your curriculum (Path A or B) should
          cover these areas — we keep the records and transcripts.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {gradeRows.map(([grade, subjects]) => (
            <div key={grade} className="rounded-2xl border border-gray-200 bg-white p-5">
              <h3 className="font-bold text-gray-900">{grade}</h3>
              <ul className="mt-2 space-y-1">
                {subjects.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Getting started */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="rounded-3xl bg-gradient-to-br from-emerald-700 to-emerald-600 p-8 text-center">
          <h2 className="text-2xl font-bold text-white">Ready to build your plan?</h2>
          <p className="mx-auto mt-3 max-w-xl text-emerald-100">
            Not sure which path fits your family? We&apos;ll walk you through it — no pressure,
            no jargon. Your tuition covers the legal side; you pick the books.
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
        <p className="mt-6 text-center text-xs text-gray-500">
          Tuition covers administrative services, record-keeping, and legal oversight. Curriculum
          books are purchased separately. Free curriculum resources are included with membership.
        </p>
      </section>
    </div>
  )
}
