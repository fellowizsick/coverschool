'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Shield, FileText, Users, BookOpen, ArrowRight, CheckCircle2, ChevronDown, GraduationCap, ScrollText, HeartHandshake } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { COVERED_STATES, SCHOOL_CONFIG } from '@/lib/constants'

const states = COVERED_STATES.map((s) => s.name).join(', ')

const steps = [
  {
    icon: GraduationCap,
    title: 'Enroll',
    body: 'Complete our simple online enrollment form. Tell us about your family and your students. It takes a few minutes.',
  },
  {
    icon: Shield,
    title: 'Get Covered',
    body: 'We handle all the legal paperwork. Your family is immediately covered under our registered Alabama church school.',
  },
  {
    icon: BookOpen,
    title: 'Homeschool Freely',
    body: 'Teach your way. We keep attendance, records, and transcripts, so you can focus on your children.',
  },
]

const faqs = [
  {
    q: 'What is a cover school?',
    a: 'A cover school (also called an umbrella school or covering school) is a private school that homeschooling families enroll in to meet state legal requirements. The school covers the family by maintaining enrollment records, attendance logs, and transcripts, while parents keep full control over curriculum and daily instruction. In Alabama, cover schools operate as church schools under Alabama Code Section 16-28-1.',
  },
  {
    q: 'Do we have to use a specific curriculum?',
    a: 'No. Parents retain full control over curriculum, teaching methods, and daily instruction. We handle the legal and administrative side so you can teach your children the way you believe is best.',
  },
  {
    q: 'Which states do you serve?',
    a: 'We currently serve homeschool families in Alabama, Florida, Georgia, Indiana, Mississippi, Missouri, Oklahoma, South Carolina, and Texas.',
  },
  {
    q: 'How much does it cost?',
    a: 'Tuition is $450 per year per student, or $45 per month for 10 school months, plus a $75 one-time annual registration fee. There are no application fees or hidden costs.',
  },
  {
    q: 'How fast can our family enroll?',
    a: 'Online enrollment takes only a few minutes. Once the enrollment form and payment are complete, your family is immediately covered under our registered Alabama church school.',
  },
  {
    q: 'Do you handle transcripts and report cards?',
    a: 'Yes. We maintain enrollment records, attendance tracking, report cards, and transcripts for your family, all organized and accessible through your parent portal.',
  },
]

export default function LandingClient() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  return (
    <div className="bg-white">
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-gray-950">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl animate-pulse-soft" />
          <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl animate-pulse-soft" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/3 left-1/4 h-40 w-40 rounded-full bg-pink-500/8 blur-3xl animate-float" />
        </div>

        <div className="relative mx-auto max-w-[90rem] px-4 pt-16 pb-20 sm:px-6 lg:px-8 lg:pt-24">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left: copy */}
            <div className="space-y-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-300">
                <Shield className="h-3.5 w-3.5" />
                Registered Alabama Church School
              </div>

              <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl font-heading">
                Homeschool with{' '}
                <span className="gradient-text-rainbow">Confidence</span>
              </h1>

              <p className="max-w-xl text-lg leading-relaxed text-emerald-100/80">
                Legal coverage, record-keeping, and transcripts. You teach your kids, your way.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/enroll">
                  <Button size="lg" variant="gold" className="w-full sm:w-auto shadow-xl shadow-amber-500/20 text-base">
                    Enroll Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#pricing">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-emerald-400/30 text-emerald-100 hover:bg-emerald-500/10 hover:border-emerald-400/50">
                    See Pricing
                  </Button>
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-sm text-emerald-200/70">
                <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Founded by an ordained minister</span>
                <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> No curriculum requirements</span>
              </div>
            </div>

            {/* Right: video */}
            <div className="relative mx-auto w-full max-w-xl">
              <div className="overflow-hidden rounded-3xl border border-emerald-500/20 bg-emerald-900/40 shadow-2xl shadow-emerald-950/50">
                <video
                  className="h-auto w-full"
                  src="/landing/lca-school-ad.mp4"
                  poster="/landing/playground-chapel.jpg"
                  autoPlay
                  muted
                  loop
                  playsInline
                  aria-label="A short video of Larose Christian Academy families learning and playing outdoors"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 hidden h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-xl shadow-amber-500/20 sm:flex">
                <span className="text-center">
                  <span className="block text-lg font-bold text-amber-950">$450</span>
                  <span className="-mt-1 block text-[9px] font-medium text-amber-800">/year</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATES BAND ===== */}
      <section className="border-b border-emerald-100 bg-emerald-50/60">
        <div className="mx-auto max-w-[90rem] px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-medium text-emerald-900">
            Serving homeschool families in {states}
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {COVERED_STATES.map((s) => (
              <span key={s.code} className="rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs font-semibold text-emerald-800">
                {s.code} · {s.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHAT'S INCLUDED (bento) ===== */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center animate-on-scroll">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 font-heading sm:text-4xl">
              Everything you need to homeschool with peace of mind
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-gray-600">
              We handle the administrative burden so you can focus on teaching and family.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {/* Image cell */}
            <div className="relative min-h-[280px] overflow-hidden rounded-3xl animate-on-scroll">
              <img src="/landing/outdoor-learning.jpg" alt="A mother and her children learning together at a picnic table under oak trees" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-emerald-950/20 to-transparent" />
              <div className="absolute bottom-0 p-7">
                <h3 className="text-xl font-bold text-white font-heading">The freedom of learning outdoors</h3>
                <p className="mt-2 text-sm text-emerald-100/90">Parents choose the curriculum. We cover the legal side.</p>
              </div>
            </div>

            {/* Content cell */}
            <div className="flex flex-col justify-center rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 p-8 ring-1 ring-emerald-100 animate-on-scroll">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-md shadow-emerald-200">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-gray-900 font-heading">Legal coverage that holds up</h3>
              <p className="mt-3 leading-relaxed text-gray-600">
                Enrollment is recognized under Alabama church school law. We keep the attendance records, filing deadlines, and compliance paperwork handled, so your family stays covered all year.
              </p>
            </div>

            {/* Content cell */}
            <div className="flex flex-col justify-center rounded-3xl bg-gradient-to-br from-amber-50 to-yellow-50 p-8 ring-1 ring-amber-100 animate-on-scroll">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md shadow-amber-200">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-gray-900 font-heading">Records, transcripts, and report cards</h3>
              <p className="mt-3 leading-relaxed text-gray-600">
                We maintain enrollment records, attendance tracking, report cards, and transcripts, all accessible through your parent portal. No spreadsheet chaos.
              </p>
            </div>

            {/* Image cell */}
            <div className="relative min-h-[280px] overflow-hidden rounded-3xl animate-on-scroll">
              <img src="/landing/campus-path.jpg" alt="Happy children walking together on a sunlit campus path" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-emerald-950/20 to-transparent" />
              <div className="absolute bottom-0 p-7">
                <h3 className="text-xl font-bold text-white font-heading">A community that supports you</h3>
                <p className="mt-2 text-sm text-emerald-100/90">Founded by an ordained minister, built for families.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/40 to-white py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center animate-on-scroll">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 font-heading sm:text-4xl">
              Enrolling takes minutes
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-gray-600">
              A simple process from first click to full coverage.
            </p>
          </div>

          <div className="mt-14 space-y-4">
            {steps.map((step, i) => (
              <div key={step.title} className="flex items-start gap-5 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-emerald-100 animate-on-scroll" style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-500 text-white shadow-md shadow-emerald-200">
                  <step.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{step.title}</h3>
                  <p className="mt-1 leading-relaxed text-gray-600">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section id="pricing" className="py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center animate-on-scroll">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 font-heading sm:text-4xl">
              Simple, honest tuition
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-gray-600">
              One flat rate per student. No application fees, no hidden costs.
            </p>
          </div>

          <div className="mt-12 overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 to-gray-900 shadow-2xl shadow-emerald-900/30 animate-on-scroll">
            <div className="p-8 sm:p-10">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-xl font-bold text-white font-heading">Annual tuition</h3>
                <span className="rounded-full bg-amber-400/20 px-3 py-1 text-xs font-semibold text-amber-300">Most families choose this</span>
              </div>
              <div className="mt-4 flex items-end gap-2">
                <span className="text-5xl font-bold text-white">$450</span>
                <span className="pb-1.5 text-emerald-200/70">per year, per student</span>
              </div>
              <ul className="mt-8 space-y-3">
                {[
                  'Full legal coverage as a registered church school',
                  'Attendance tracking, report cards, and transcripts',
                  'Parent portal with all records in one place',
                  'Support from a ministry founded by an ordained minister',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-emerald-100/90">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-400" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8 rounded-2xl bg-white/5 p-4 text-sm text-emerald-100/80">
                Prefer monthly? Pay <strong className="text-white">$45 per month</strong> for 10 school months instead. A one-time <strong className="text-white">$75 annual registration fee</strong> applies either way.
              </div>
              <div className="mt-8">
                <Link href="/enroll" className="block">
                  <Button size="lg" variant="gold" className="w-full text-base shadow-xl shadow-amber-500/20">
                    Enroll Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="bg-emerald-50/40 py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center animate-on-scroll">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 font-heading sm:text-4xl">
              Questions families ask us
            </h2>
          </div>

          <div className="mt-10 space-y-3">
            {faqs.map((faq, i) => (
              <div key={faq.q} className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-emerald-100">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  aria-expanded={openFaq === i}
                >
                  <span className="font-semibold text-gray-900">{faq.q}</span>
                  <ChevronDown className={`h-5 w-5 flex-shrink-0 text-emerald-600 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <div className={`grid transition-all duration-300 ${openFaq === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 leading-relaxed text-gray-600">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-gray-900 py-20 md:py-24">
        <div className="absolute -top-32 -right-32 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl animate-float" />
        <div className="absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl animate-float-delayed" />

        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <div className="animate-on-scroll space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-1.5 text-sm text-emerald-300">
              <HeartHandshake className="h-3.5 w-3.5" />
              Enrollment is open
            </div>
            <h2 className="text-3xl font-bold text-white font-heading sm:text-4xl lg:text-5xl">
              Ready to homeschool with <span className="gradient-text-rainbow">Confidence?</span>
            </h2>
            <p className="mx-auto max-w-xl text-lg leading-relaxed text-emerald-100/70">
              Join families across {states} who have found peace of mind with Larose Christian Academy.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/enroll">
                <Button size="lg" variant="gold" className="shadow-xl shadow-amber-500/20 text-base">
                  Enroll Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-emerald-400/30 text-emerald-100 hover:bg-emerald-500/10">
                  Questions? Contact Us
                </Button>
              </Link>
            </div>
            <p className="text-sm text-emerald-200/50">
              <ScrollText className="mr-1 inline h-4 w-4" />
              {SCHOOL_CONFIG.phone} · {SCHOOL_CONFIG.email}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
