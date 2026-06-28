'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { COVERED_STATES } from '@/lib/constants'
import {
  CheckCircle, Shield, FileText, HeartHandshake,
  ArrowRight, Star, Users, BookOpen, ScrollText,
  GraduationCap, ChevronRight, Quote
} from 'lucide-react'

const features = [
  {
    icon: Shield,
    title: 'Legal Coverage',
    description:
      'Full legal oversight under Alabama church school law. We handle the paperwork so your family stays compliant with state attendance requirements.',
    color: 'emerald',
  },
  {
    icon: FileText,
    title: 'Record Keeping',
    description:
      'We maintain enrollment records, attendance tracking, report cards, and transcripts — everything you need organized and accessible.',
    color: 'blue',
  },
  {
    icon: Users,
    title: 'Family Support',
    description:
      'Founded by an ordained minister, we offer guidance, prayer, and a welcoming community for families on their homeschool journey.',
    color: 'amber',
  },
]

const stats = [
  { value: '9', label: 'States Served', suffix: '+' },
  { value: '500', label: 'Families Supported', suffix: '+' },
  { value: '99', label: 'Satisfaction Rate', suffix: '%' },
  { value: '10', label: 'Years Experience', suffix: '+' },
]

const testimonials = [
  {
    quote: "Larose Christian Academy took the stress out of paperwork so I could focus on what matters — teaching my children. Best decision we ever made for our homeschool.",
    author: 'Sarah M.',
    role: 'Homeschool Parent, Alabama',
    rating: 5,
  },
  {
    quote: "As a first-time homeschooler, I was overwhelmed by the legal requirements. Sister Anne walked me through everything. I couldn't have done this without them.",
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
  { step: '02', title: 'Get Covered', description: 'We handle all legal paperwork. Your family is immediately covered under our Alabama church school.' },
  { step: '03', title: 'Homeschool Freely', description: 'Teach your way. We handle attendance, records, and transcripts — you focus on your children.' },
]

export default function HomePage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-gray-950">
        {/* Animated background orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl animate-pulse-soft" />
          <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl animate-pulse-soft" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/3 h-60 w-60 rounded-full bg-emerald-600/5 blur-3xl animate-float" />

          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 18c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm0 35c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pt-24 pb-20 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            {/* Left Column */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-300 backdrop-blur-sm animate-fade-in">
                <Shield className="h-3.5 w-3.5" />
                Alabama Church School • Est. 2024
              </div>

              <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl font-heading">
                Homeschool with{' '}
                <span className="bg-gradient-to-r from-emerald-300 via-emerald-200 to-amber-200 bg-clip-text text-transparent">
                  Confidence
                </span>
              </h1>

              <p className="text-lg leading-relaxed text-emerald-100/80 max-w-xl">
                We provide the legal oversight, record-keeping, and support your
                family needs to homeschool with peace of mind. Focus on teaching
                — we handle the rest.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/enroll">
                  <Button size="lg" className="w-full sm:w-auto shadow-xl shadow-emerald-900/30">
                    Enroll Your Student
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/how-it-works">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto border-emerald-400/30 text-emerald-100 hover:bg-emerald-500/10 hover:border-emerald-400/50"
                  >
                    How It Works
                  </Button>
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center gap-6 pt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-full border-2 border-emerald-800 bg-gradient-to-br from-emerald-600 to-emerald-500 flex items-center justify-center text-[10px] font-bold text-white"
                    >
                      {['JM', 'SK', 'AL', 'RT'][i - 1]}
                    </div>
                  ))}
                </div>
                <div className="text-sm text-emerald-200/70">
                  <span className="font-semibold text-emerald-200">500+</span> families enrolled
                </div>
              </div>
            </div>

            {/* Right Column - Visual */}
            <div className="hidden lg:flex lg:justify-center lg:items-center">
              <div className="relative">
                {/* Decorative card */}
                <div className="relative h-[400px] w-[380px] rounded-3xl border border-emerald-500/10 bg-gradient-to-br from-emerald-800/30 to-emerald-900/30 p-8 backdrop-blur-sm shadow-2xl shadow-emerald-950/50 animate-scale-in">
                  <div className="flex h-full flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg">
                        <GraduationCap className="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white font-heading">Your Homeschool Journey</h3>
                        <p className="mt-2 text-sm text-emerald-200/60">Starts Here</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {[
                        '✓ Full legal coverage',
                        '✓ Attendance tracking',
                        '✓ Transcripts & report cards',
                        '✓ Supportive community',
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-2.5 text-sm text-emerald-100">
                          <CheckCircle className="h-4 w-4 text-emerald-400" />
                          {item}
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-emerald-200/50">
                      <div className="h-px flex-1 bg-emerald-500/20" />
                      <span>$25/month</span>
                      <div className="h-px flex-1 bg-emerald-500/20" />
                    </div>
                  </div>
                </div>

                {/* Floating decorative element */}
                <div className="absolute -top-6 -right-6 h-24 w-24 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-xl shadow-amber-500/20 flex items-center justify-center animate-float">
                  <span className="text-2xl font-bold text-amber-950">$25</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRUSTED BY / STATS ===== */}
      <section className="relative -mt-16 z-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="glass rounded-2xl p-8 shadow-2xl shadow-emerald-900/10">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {stats.map((stat, i) => (
                <div key={stat.label} className={`text-center animate-on-scroll`} style={{ transitionDelay: `${i * 100}ms` }}>
                  <div className="text-3xl font-bold text-emerald-800 font-heading md:text-4xl">
                    {stat.value}<span className="text-emerald-500">{stat.suffix}</span>
                  </div>
                  <div className="mt-1 text-sm font-medium text-gray-500 uppercase tracking-wide">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center animate-on-scroll">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-700 mb-4">
              Why Choose Us
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 font-heading sm:text-4xl">
              Everything You Need to{' '}
              <span className="gradient-text">Homeschool with Confidence</span>
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-gray-600">
              We handle the administrative burden so you can focus on what matters
              most — nurturing your children&apos;s minds and character.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {features.map((feature, i) => (
              <Card key={feature.title} className={`animate-on-scroll p-6 hover:border-emerald-200`} style={{ transitionDelay: `${i * 150}ms` }}>
                <CardContent className="p-0">
                  <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-${feature.color}-100 text-${feature.color}-600 shadow-sm`}
                    style={{
                      background: feature.color === 'emerald' ? '#d1fae5' : feature.color === 'blue' ? '#dbeafe' : '#fef3c7',
                      color: feature.color === 'emerald' ? '#059669' : feature.color === 'blue' ? '#2563eb' : '#d97706',
                    }}
                  >
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 font-heading">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/50 to-white" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center animate-on-scroll">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-medium text-emerald-700 mb-4">
              Simple Process
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 font-heading sm:text-4xl">
              Get Started in{' '}
              <span className="gradient-text">Three Simple Steps</span>
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-gray-600">
              Joining Larose Christian Academy is straightforward. We&apos;ve
              simplified the process so you can get covered and start homeschooling.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <div key={step.step} className="relative animate-on-scroll" style={{ transitionDelay: `${i * 150}ms` }}>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px bg-gradient-to-r from-emerald-200 to-emerald-100">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2">
                      <ChevronRight className="h-4 w-4 text-emerald-300" />
                    </div>
                  </div>
                )}
                <div className="text-center">
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-50 to-emerald-100 shadow-inner">
                    <span className="text-2xl font-bold text-emerald-700 font-heading">{step.step}</span>
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-gray-900 font-heading">{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center animate-on-scroll">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-1.5 text-sm font-medium text-amber-700 mb-4">
              Testimonials
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 font-heading sm:text-4xl">
              What Families{' '}
              <span className="gradient-text">Are Saying</span>
            </h2>
          </div>

          <div className="mt-16 mx-auto max-w-3xl">
            <div className="relative min-h-[260px]">
              {testimonials.map((t, i) => (
                <div
                  key={i}
                  className={`absolute inset-0 transition-all duration-700 ease-out ${
                    i === activeTestimonial
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-4 pointer-events-none'
                  }`}
                >
                  <Card className="p-8 border-amber-100 bg-gradient-to-br from-amber-50/50 to-white">
                    <CardContent className="p-0">
                      <Quote className="h-8 w-8 text-amber-300/60 mb-4" />
                      <p className="text-lg leading-relaxed text-gray-700 italic">
                        &ldquo;{t.quote}&rdquo;
                      </p>
                      <div className="mt-6 flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">{t.author}</p>
                          <p className="text-sm text-gray-500">{t.role}</p>
                        </div>
                        <div className="flex gap-0.5">
                          {[...Array(t.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>

            {/* Dots */}
            <div className="mt-8 flex justify-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === activeTestimonial
                      ? 'w-8 bg-emerald-600'
                      : 'w-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATE COVERAGE ===== */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/50 to-white" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center animate-on-scroll">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-medium text-emerald-700 mb-4">
              Nationwide Coverage
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 font-heading sm:text-4xl">
              States We{' '}
              <span className="gradient-text">Currently Serve</span>
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-gray-600">
              From our home in Alabama, we serve families across the country.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 max-w-3xl mx-auto animate-on-scroll">
            {COVERED_STATES.map((state) => (
              <div
                key={state.code}
                className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-white/80 px-4 py-3 shadow-sm transition-all duration-300 hover:border-emerald-300 hover:shadow-md hover:-translate-y-0.5"
              >
                <CheckCircle className="h-4 w-4 flex-shrink-0 text-emerald-500" />
                <div>
                  <span className="font-bold text-gray-900 text-sm">{state.code}</span>
                  <span className="ml-1 text-xs text-gray-500">{state.name}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center animate-on-scroll">
            <Link href="/states">
              <Button variant="outline">
                View Full Coverage Map
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-emerald-800 to-gray-900" />
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 18c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm0 35c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl animate-float-delayed" />

        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <div className="animate-on-scroll space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-1.5 text-sm text-emerald-300 backdrop-blur-sm">
              <HeartHandshake className="h-3.5 w-3.5" />
              Start Your Journey Today
            </div>

            <h2 className="text-3xl font-bold text-white font-heading sm:text-4xl lg:text-5xl">
              Ready to Homeschool{' '}
              <span className="bg-gradient-to-r from-emerald-300 to-amber-200 bg-clip-text text-transparent">
                with Confidence?
              </span>
            </h2>

            <p className="text-lg leading-relaxed text-emerald-100/70 max-w-xl mx-auto">
              Join hundreds of families who have found peace of mind through
              Larose Christian Academy. Enroll today for just $25/month.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/enroll">
                <Button size="lg" variant="gold" className="shadow-xl shadow-amber-500/20 text-base">
                  Enroll Now — $25/mo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-emerald-400/30 text-emerald-100 hover:bg-emerald-500/10"
                >
                  Questions? Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
