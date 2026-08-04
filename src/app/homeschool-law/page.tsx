import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ArrowRight } from 'lucide-react'
import { STATE_LAWS } from '@/lib/stateLaw'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Homeschool Laws by State | Larose Christian Academy',
  description:
    'Plain-English guide to homeschool law in Alabama, Florida, Georgia, Indiana, Mississippi, Missouri, Oklahoma, South Carolina, and Texas — and how a church school cover keeps your family legally covered.',
}

const cardColors = ['blue', 'green', 'amber', 'purple', 'pink', 'sky', 'rose', 'amber', 'green'] as const

export default function HomeschoolLawHubPage() {
  return (
    <div className="min-h-screen">
      {/* Gradient Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600 px-4 py-20 sm:px-6 lg:px-8">
        <div className="absolute -left-10 top-8 h-36 w-36 animate-float rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -right-6 bottom-12 h-48 w-48 animate-float rounded-full bg-sky-300/15 blur-3xl [animation-delay:1s]" />
        <div className="absolute left-1/4 top-4 h-20 w-20 animate-bounce-soft rounded-full bg-teal-200/10 blur-2xl [animation-delay:2s]" />
        <div className="mx-auto max-w-3xl text-center">
          <span className="mb-4 inline-block animate-pop rounded-full bg-white/20 px-4 py-1 text-sm font-medium text-white backdrop-blur-sm">
            ⚖️ Know Before You Homeschool
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Homeschool Laws by State
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-cyan-100">
            Plain-English summaries of the legal requirements in every state we cover — and how a
            church school keeps your family protected.
          </p>
          <div className="mx-auto mt-8 h-1 w-24 rounded-full bg-gradient-to-r from-pink-400 via-amber-300 to-emerald-300" />
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <p className="text-sm font-medium text-amber-800">
            📌 <strong>Quick answer:</strong> in every state below, enrolling with a church school
            (like Larose Christian Academy) gives your family legal standing as private-school
            students — while you keep full control of curriculum and teaching. The school handles
            the paperwork, records, report cards, and transcripts.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {STATE_LAWS.map((state, i) => (
            <Link key={state.code} href={`/homeschool-law/${state.code.toLowerCase()}`} className="group">
              <Card fun={cardColors[i % cardColors.length]} className="h-full">
                <CardContent className="flex h-full flex-col p-6">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="text-3xl">{state.flag}</span>
                    <h2 className="text-xl font-bold text-gray-900">{state.name}</h2>
                  </div>
                  <p className="mb-4 text-sm text-gray-600 line-clamp-3">{state.summary}</p>
                  <div className="mt-auto flex items-center gap-2 pt-2 text-sm font-semibold text-emerald-700">
                    Read the state guide
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-16 rounded-3xl bg-gradient-to-br from-emerald-700 to-emerald-600 p-10 text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Not sure which path fits your family?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-emerald-100">
            Every family\u2019s situation is different. We\u2019ll walk you through your state\u2019s
            requirements and get you legally covered — no pressure, no jargon.
          </p>
          <div className="mt-6">
            <Link href="/enroll">
              <Button size="lg" className="bg-white text-emerald-800 hover:bg-emerald-50">
                Enroll Your Family
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
