'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { COVERED_STATES } from '@/lib/constants'
import LeaveReview from '@/components/LeaveReview'
import {
  Shield,
  FileText,
  Users,
  ArrowRight,
  Star,
  GraduationCap,
  CheckCircle,
  Quote,
  BookOpen,
} from 'lucide-react'

const IMG_BASE = 'https://images.pexels.com/photos'

/* Verified Pexels homeschool-family photos (free license, from Pexels API) */
const IMAGES = {
  hero: `${IMG_BASE}/9872950/pexels-photo-9872950.jpeg?auto=compress&cs=tinysrgb&w=1400`, // family reading by window
  feature: `${IMG_BASE}/4260485/pexels-photo-4260485.jpeg?auto=compress&cs=tinysrgb&w=1200`, // mother helping daughter at home
}

const features = [
  {
    icon: Shield,
    title: 'Legal coverage, handled',
    description:
      'We file under Alabama church school law and handle every form, so your family stays compliant — without reading a single statute.',
  },
  {
    icon: FileText,
    title: 'Records, kept for you',
    description:
      'Attendance, report cards, and transcripts — maintained, organized, and ready whenever a school or state asks.',
  },
  {
    icon: Users,
    title: 'A community that cares',
    description:
      'Founded by an ordained minister. Guidance, prayer, and people who understand the homeschool calling.',
  },
]

const stats = [
  { value: '9', label: 'States served', suffix: '' },
  { value: '500', label: 'Families supported', suffix: '+' },
  { value: '99', label: 'Satisfaction', suffix: '%' },
  { value: '10', label: 'Years of service', suffix: '+' },
]

const testimonials = [
  {
    quote: "Larose Christian Academy took the stress out of paperwork so I could focus on what matters — teaching my children. Best decision we ever made for our homeschool.",
    author: 'Sarah M.',
    role: 'Homeschool Parent, Alabama',
    rating: 5,
  },
  {
    quote: "As a first-time homeschooler, I was overwhelmed by the legal requirements. Anne walked me through everything. I couldn't have done this without them.",
    author: 'Jennifer R.',
    role: 'Homeschool Parent, Florida',
    rating: 5,
  },
  {
    quote: "The record-keeping system is incredible. Report cards, transcripts — it's all handled. We finally have peace of mind about our homeschool documentation.",
    author: 'Michael T.',
    role: 'Homeschool Parent, Texas',
    rating: 5,
  },
]

const steps = [
  { step: '01', title: 'Enroll', description: 'Complete our simple online enrollment form. Tell us about your family and your student(s).' },
  { step: '02', title: 'Get covered', description: 'We handle all legal paperwork. Your family is immediately covered under our Alabama church school.' },
  { step: '03', title: 'Homeschool freely', description: 'Teach your way. We handle attendance, records, and transcripts — you focus on your children.' },
]

export default function HomePage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  // Real family reviews from the DB get appended to the static list.
  const [allTestimonials, setAllTestimonials] = useState(testimonials)

  useEffect(() => {
    // Load approved reviews from the API and append them to the rotation.
    fetch('/api/reviews')
      .then((r) => r.json())
      .then((data) => {
        if (data?.ok && Array.isArray(data.reviews) && data.reviews.length > 0) {
          const real = data.reviews.map((rv: { quote: string; author_name: string; role: string; rating: number }) => ({
            quote: rv.quote,
            author: rv.author_name,
            role: rv.role,
            rating: rv.rating,
          }))
          setAllTestimonials((prev) => {
            // Avoid duplicates if the API is called again.
            const existing = new Set(prev.map((t) => t.quote))
            const fresh = real.filter((t: { quote: string }) => !existing.has(t.quote))
            return fresh.length ? [...prev, ...fresh] : prev
          })
        }
      })
      .catch(() => {
        // Homepage must never break because reviews failed to load.
      })
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % allTestimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [allTestimonials.length])

  return (
    <>
      {/* ===== HERO — editorial, warm cream, one strong line ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-gray-950">
        <div className="mx-auto grid w-full min-w-0 max-w-[90rem] gap-12 px-4 pb-20 pt-28 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:pb-28 lg:pt-36">
          {/* Left — copy */}
          <div className="mx-auto min-w-0 max-w-xl text-center lg:mx-0 lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3.5 py-1.5 text-[13px] font-medium tracking-wide text-emerald-200">
              <Shield className="h-3.5 w-3.5" />
              🙌 Alabama Church School · Est. 2024
            </div>

            <h1 className="mt-6 font-heading text-[clamp(2.5rem,10vw,4rem)] font-bold leading-[1.05] tracking-tight text-white break-words">
              Homeschool with{' '}
              <span className="gradient-text-rainbow">Confidence</span>
            </h1>

            <p className="mt-7 max-w-lg text-[clamp(1.05rem,3.5vw,1.4rem)] leading-relaxed text-emerald-100/85">
              We provide the legal oversight, record-keeping, and support your family needs
              to homeschool with peace of mind. You teach — we handle the rest.
            </p>

            <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:gap-6">
              <Link href="/enroll">
                <Button size="lg" className="w-full lg:w-auto">
                  Enroll Your Student
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-emerald-400/30 text-emerald-100 hover:border-emerald-400/60 hover:bg-emerald-500/10 lg:w-auto"
                >
                  How it works
                </Button>
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 border-t border-emerald-400/15 pt-7 text-sm text-emerald-100/70 lg:justify-start">
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                {COVERED_STATES.length} states covered
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                $45/mo tuition
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                $75 annual reg fee
              </span>
            </div>
          </div>

          {/* Right — one warm editorial photo, framed */}
          <div className="relative min-w-0">
            <div className="overflow-hidden rounded-3xl shadow-[0_40px_90px_-40px_rgba(2,44,34,0.5)]">
              <Image
                src={IMAGES.hero}
                alt="A family reading together by a window at home"
                width={1400}
                height={1050}
                priority
                className="h-[440px] w-full object-cover sm:h-[520px] lg:h-[600px]"
              />
            </div>
            {/* Offset caption block — the "why" in one line */}
            <div className="absolute -bottom-8 -left-6 hidden max-w-[300px] rounded-2xl border border-emerald-100 bg-white p-6 shadow-[0_24px_60px_-24px_rgba(2,44,34,0.35)] lg:block">
              <p className="text-sm font-semibold text-emerald-950">One less thing to worry about</p>
              <p className="mt-2 text-sm leading-relaxed text-emerald-950/60">
                Every form, every deadline, every record — handled. So your family can simply learn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS — green confidence band with dividers ===== */}
      <section className="border-y border-emerald-100 bg-gradient-to-r from-emerald-50/60 via-white to-amber-50/40 py-14">
        <div className="mx-auto grid max-w-[90rem] grid-cols-2 gap-x-6 gap-y-10 px-4 sm:px-6 md:grid-cols-4 lg:px-8">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-emerald-100 bg-white px-4 py-6 text-center shadow-sm">
              <div className="font-heading text-4xl font-bold tracking-tight text-emerald-800 md:text-5xl">
                {stat.value}
                <span className="text-amber-500">{stat.suffix}</span>
              </div>
              <div className="mx-auto mt-3 h-px w-10 bg-gradient-to-r from-emerald-500 to-amber-400" />
              <div className="mt-3 text-[13px] font-medium uppercase tracking-[0.18em] text-emerald-950/50">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== WHY — feature cards ===== */}
      <section className="bg-emerald-50/40 py-24 md:py-32">
        <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
            {/* Copy side */}
            <div>
              <div className="mx-auto max-w-xl text-center lg:mx-0 lg:text-left">
              <p className="inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.22em] text-emerald-800">
                <span className="h-px w-8 bg-gradient-to-r from-emerald-600 to-amber-400" />
                Why LCA
              </p>
              <h2 className="mt-5 font-heading text-4xl font-bold leading-[1.1] tracking-tight text-emerald-950 sm:text-5xl">
                The support that makes{' '}
                <span className="bg-gradient-to-r from-emerald-700 to-emerald-500 bg-clip-text text-transparent">
                  homeschooling feel simple
                </span>
              </h2>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-emerald-950/65">
                Most families don&apos;t leave public school because they want less structure.
                They leave because they want more of what matters. We handle the legal and
                administrative side so you can give your children that.
                </p>
                </div>

                <div className="mt-10 space-y-4">
                {features.map((feature, i) => (
                  <div
                    key={feature.title}
                    className="group flex items-start gap-5 rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                  >
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white shadow-md ${
                        i % 2 === 0
                          ? 'bg-gradient-to-br from-emerald-600 to-emerald-500 shadow-emerald-900/20'
                          : 'bg-gradient-to-br from-amber-500 to-amber-400 shadow-amber-900/20'
                      }`}
                    >
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-heading text-lg font-bold text-emerald-950">{feature.title}</h3>
                      <p className="mt-1.5 max-w-md text-[15px] leading-relaxed text-emerald-950/60">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Photo side */}
            <div className="relative">
              <div className="overflow-hidden rounded-3xl shadow-[0_40px_90px_-40px_rgba(2,44,34,0.45)]">
                <Image
                  src={IMAGES.feature}
                  alt="A mother helping her daughter with schoolwork at home"
                  width={1200}
                  height={1500}
                  className="h-[560px] w-full object-cover"
                />
              </div>
              <div className="absolute right-6 top-6 rounded-full bg-white/90 px-4 py-2 text-xs font-medium text-emerald-950 shadow-lg backdrop-blur">
                <BookOpen className="mr-1.5 inline h-3.5 w-3.5 text-emerald-600" />
                Curriculum your way
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PROCESS — numbered cards ===== */}
      <section className="bg-white py-24 md:py-32">
        <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
            <p className="inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.22em] text-emerald-800">
              <span className="h-px w-8 bg-gradient-to-r from-emerald-600 to-amber-400" />
              Getting started
            </p>
            <h2 className="mt-5 font-heading text-4xl font-bold leading-[1.1] tracking-tight text-emerald-950 sm:text-5xl">
              Three steps to{' '}
              <span className="bg-gradient-to-r from-emerald-700 to-emerald-500 bg-clip-text text-transparent">
                homeschool freedom
              </span>
            </h2>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <div
                key={step.step}
                className="relative rounded-2xl border border-emerald-100 bg-gradient-to-b from-emerald-50/70 to-white p-8 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
              >
                {i < steps.length - 1 && (
                  <div className="absolute top-1/2 -right-4 hidden h-px w-8 bg-gradient-to-r from-emerald-300 to-amber-300 md:block" />
                )}
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-amber-500 font-heading text-lg font-bold text-white shadow-md shadow-emerald-900/20">
                  {step.step}
                </div>
                <h3 className="mt-6 font-heading text-xl font-bold text-emerald-950">{step.title}</h3>
                <p className="mt-3 max-w-xs text-[15px] leading-relaxed text-emerald-950/60">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="bg-emerald-50/40 py-24 md:py-32">
        <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
            <p className="inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.22em] text-emerald-700">
              <span className="h-px w-8 bg-gradient-to-r from-emerald-600 to-amber-400" />
              From our families
            </p>
            <h2 className="mt-5 font-heading text-4xl font-bold leading-[1.1] tracking-tight text-emerald-950 sm:text-5xl">
              Peace of mind,{' '}
              <span className="bg-gradient-to-r from-emerald-700 to-emerald-500 bg-clip-text text-transparent">
                in their words
              </span>
            </h2>
          </div>

          <div className="mt-14 max-w-3xl">
            <div key={activeTestimonial} className="animate-[fadeIn_0.5s_ease]">
              <blockquote className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-white p-10 shadow-[0_24px_60px_-36px_rgba(2,44,34,0.3)]">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-600 via-emerald-400 to-amber-400" />
                <Quote className="h-8 w-8 text-emerald-600" />
                <p className="mt-5 font-heading text-xl leading-relaxed text-emerald-950/85 sm:text-2xl">
                  &ldquo;{allTestimonials[activeTestimonial].quote}&rdquo;
                </p>
                <footer className="mt-8 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-emerald-500 text-sm font-bold text-white shadow-md shadow-emerald-900/20">
                      {allTestimonials[activeTestimonial].author.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-semibold text-emerald-950">{allTestimonials[activeTestimonial].author}</p>
                      <p className="text-sm text-gray-500">{allTestimonials[activeTestimonial].role}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(allTestimonials[activeTestimonial].rating)].map((_, s) => (
                      <Star key={s} className="h-5 w-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </footer>
              </blockquote>
            </div>

            <div className="mt-8 flex justify-center gap-2">
              {allTestimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  aria-label={`Show testimonial ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === activeTestimonial ? 'w-8 bg-emerald-600' : 'w-1.5 bg-emerald-950/15 hover:bg-emerald-950/30'
                  }`}
                />
              ))}
            </div>

            <div className="mt-10 text-center">
              <p className="text-sm text-emerald-950/50">
                Are you an LCA family? Share your experience — we&apos;d love to hear from you.
              </p>
              <div className="mt-4 flex justify-center">
                <LeaveReview />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="relative overflow-hidden bg-emerald-950 py-24 md:py-32">
        <div className="pointer-events-none absolute -top-40 right-1/4 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 left-1/4 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-[13px] font-semibold uppercase tracking-[0.22em] text-emerald-300">
            Start your journey
          </p>
          <h2 className="mt-5 font-heading text-4xl font-bold leading-tight text-white sm:text-5xl">
            Ready to homeschool{' '}
            <span className="gradient-text-rainbow">with Confidence?</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-emerald-100/70">
            Join hundreds of families who have found peace of mind through Larose
            Christian Academy. <strong className="text-white">$45/mo tuition</strong>{' '}
            (10 months) + $75 annual reg fee ={' '}
            <strong className="text-white">$525/year per student</strong>.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/enroll">
              <Button size="lg" className="w-full bg-amber-500 text-emerald-950 shadow-amber-500/30 hover:bg-amber-400 sm:w-auto">
                Enroll now — $45/mo
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-emerald-400/30 text-emerald-100 hover:border-emerald-400/60 hover:bg-emerald-500/10"
              >
                Questions? Contact us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}