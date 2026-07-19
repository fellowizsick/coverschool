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
        {/* Animated background orbs — more colorful */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl animate-pulse-soft" />
          <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl animate-pulse-soft" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/3 h-60 w-60 rounded-full bg-emerald-600/5 blur-3xl animate-float" />
          {/* New colorful orbs */}
          <div className="absolute top-1/4 right-1/4 h-48 w-48 rounded-full bg-pink-500/10 blur-3xl animate-float-delayed" />
          <div className="absolute bottom-1/3 right-1/3 h-40 w-40 rounded-full bg-purple-500/8 blur-3xl animate-pulse-soft" style={{ animationDelay: '3s' }} />
          <div className="absolute top-1/3 left-1/4 h-32 w-32 rounded-full bg-sky-400/8 blur-3xl animate-float" style={{ animationDuration: '8s' }} />

          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 18c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm0 35c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pt-24 pb-20 sm:px-6 lg:px-8">
          {/* Floating fun particles layer */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {['📚','⭐','✏️','🌟','🎓','💡','🍎','☀️','💚','🙌'].map((e, i) => (
              <span
                key={i}
                className="absolute text-2xl opacity-70 animate-float"
                style={{
                  left: `${(i * 37 + 12) % 100}%`,
                  top: `${(i * 53 + 8) % 90}%`,
                  animationDuration: `${5 + (i % 5)}s`,
                  animationDelay: `${i * 0.4}s`,
                }}
              >
                {e}
              </span>
            ))}
          </div>

          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            {/* Left Column */}
            <div className="space-y-8">
              {/* Emoji badge instead of plain badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-300 backdrop-blur-sm animate-fade-in emoji-badge">
                <Shield className="h-3.5 w-3.5" />
                🙌 Alabama Church School • Est. 2024
              </div>

              <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl font-heading">
                Homeschool with{' '}
                <span className="gradient-text-rainbow">
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
                  <Button size="lg" variant="fun" className="w-full sm:w-auto shadow-xl shadow-purple-500/20 animate-bounce-soft">
                    ✨ Enroll Your Student
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/how-it-works">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto border-emerald-400/30 text-emerald-100 hover:bg-emerald-500/10 hover:border-emerald-400/50"
                  >
                    📖 How It Works
                  </Button>
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center gap-6 pt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-full border-2 border-emerald-800 bg-gradient-to-br from-emerald-600 to-emerald-500 flex items-center justify-center text-[10px] font-bold text-white animate-wiggle"
                      style={{ animationDelay: `${i * 0.3}s` }}
                    >
                      {['JM', 'SK', 'AL', 'RT'][i - 1]}
                    </div>
                  ))}
                </div>
                <div className="text-sm text-emerald-200/70">
                  <span className="font-semibold text-emerald-200">500+</span> families enrolled 🙏
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
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 shadow-lg animate-bounce-soft">
                        <GraduationCap className="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white font-heading">Your Homeschool Journey 🌟</h3>
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
                          <CheckCircle className={`h-4 w-4 ${i === 0 ? 'text-pink-400' : i === 1 ? 'text-purple-400' : i === 2 ? 'text-sky-400' : 'text-amber-400'}`} />
                          {item}
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-emerald-200/50">
                      <div className="h-px flex-1 bg-emerald-500/20" />
                      <span>$45/month Tuition</span>
                      <div className="h-px flex-1 bg-emerald-500/20" />
                    </div>

                    <p className="mt-2 text-xs text-emerald-300/50 text-center">
                      Tuition only — curriculum books purchased separately
                    </p>
                  </div>
                </div>

                {/* Floating decorative element */}
                <div className="absolute -top-6 -right-6 h-24 w-24 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-xl shadow-amber-500/20 flex items-center justify-center animate-float">
                  <span className="text-2xl font-bold text-amber-950">$45</span>
                </div>

                {/* Fun floating emoji decorations */}
                <div className="absolute -bottom-4 -left-6 text-2xl animate-bounce-soft" style={{ animationDelay: '1s' }}>
                  ✨
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rainbow divider at bottom of hero */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="divider-rainbow" />
        </div>
      </section>

      {/* ===== TRUSTED BY / STATS ===== */}
      <section className="relative -mt-16 z-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="glass rounded-2xl p-8 shadow-2xl shadow-emerald-900/10">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {stats.map((stat, i) => {
                const valueColors = ['text-pink-600', 'text-purple-600', 'text-sky-600', 'text-amber-600']
                const suffixColors = ['text-pink-400', 'text-purple-400', 'text-sky-400', 'text-amber-400']
                return (
                  <div key={stat.label} className={`text-center animate-on-scroll`} style={{ transitionDelay: `${i * 100}ms` }}>
                    <div className={`text-3xl font-bold font-heading md:text-4xl ${valueColors[i]}`}>
                      {stat.value}<span className={suffixColors[i]}>{stat.suffix}</span>
                    </div>
                    <div className="mt-1 text-sm font-medium text-gray-500 uppercase tracking-wide">
                      {stat.label}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center animate-on-scroll">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-50 via-purple-50 to-sky-50 px-4 py-1.5 text-sm font-medium text-purple-700 mb-4 emoji-badge">
              🌟 Why Choose Us
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 font-heading sm:text-4xl">
              Everything You Need to{' '}
              <span className="gradient-text-rainbow">Homeschool with Confidence</span>
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-gray-600">
              We handle the administrative burden so you can focus on what matters
              most — nurturing your children&apos;s minds and character. 💪
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {features.map((feature, i) => {
              const funVariants = ['green', 'blue', 'amber'] as const
              const emojis = ['🛡️', '📋', '💛']
              return (
                <Card key={feature.title} fun={funVariants[i]} className={`animate-on-scroll p-6`} style={{ transitionDelay: `${i * 150}ms` }}>
                  <CardContent className="p-0">
                    <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm animate-bounce-soft`}
                      style={{
                        background: feature.color === 'emerald' ? '#d1fae5' : feature.color === 'blue' ? '#dbeafe' : '#fef3c7',
                        color: feature.color === 'emerald' ? '#059669' : feature.color === 'blue' ? '#2563eb' : '#d97706',
                        animationDelay: `${i * 0.3}s`,
                      }}
                    >
                      <feature.icon className="h-7 w-7" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 font-heading">
                      {emojis[i]} {feature.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-gray-600">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Rainbow divider */}
        <div className="mx-auto max-w-4xl mt-20">
          <div className="divider-rainbow rounded-full" />
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-50/30 via-pink-50/20 to-white" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center animate-on-scroll">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-1.5 text-sm font-medium text-purple-700 mb-4 emoji-badge">
              🚀 Simple Process
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 font-heading sm:text-4xl">
              Get Started in{' '}
              <span className="gradient-text-rainbow">Three Simple Steps</span>
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-gray-600">
              Joining Larose Christian Academy is straightforward. We&apos;ve
              simplified the process so you can get covered and start homeschooling.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {steps.map((step, i) => {
              const gradients = [
                'from-pink-100 via-pink-200 to-rose-100',
                'from-purple-100 via-purple-200 to-violet-100',
                'from-sky-100 via-sky-200 to-blue-100',
              ]
              const textColors = ['text-pink-700', 'text-purple-700', 'text-sky-700']
              const shadowColors = ['shadow-pink-200/50', 'shadow-purple-200/50', 'shadow-sky-200/50']
              const emojis = ['📝', '✅', '🎉']
              return (
                <div key={step.step} className="relative animate-on-scroll" style={{ transitionDelay: `${i * 150}ms` }}>
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px bg-gradient-to-r from-purple-200 to-pink-100">
                      <div className="absolute right-0 top-1/2 -translate-y-1/2">
                        <ChevronRight className="h-4 w-4 text-purple-300" />
                      </div>
                    </div>
                  )}
                  <div className="text-center">
                    <div className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br ${gradients[i]} shadow-inner ${shadowColors[i]}`}>
                      <span className={`text-2xl font-bold font-heading ${textColors[i]}`}>
                        {emojis[i]}
                      </span>
                    </div>
                    <h3 className="mt-6 text-xl font-bold text-gray-900 font-heading">{step.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-gray-600">{step.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center animate-on-scroll">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-50 to-yellow-50 px-4 py-1.5 text-sm font-medium text-amber-700 mb-4 emoji-badge">
              💬 Testimonials
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 font-heading sm:text-4xl">
              What Families{' '}
              <span className="gradient-text-rainbow">Are Saying</span>
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-gray-600">
              Hear from families who have found peace of mind with our cover school services. ⭐
            </p>
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
                  <Card fun="amber" className="p-8">
                    <CardContent className="p-0">
                      <Quote className="h-8 w-8 text-amber-300/60 mb-4" />
                      <p className="text-lg leading-relaxed text-gray-700 italic">
                        &ldquo;{t.quote}&rdquo;
                      </p>
                      <div className="mt-6 flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">{t.author} 🙏</p>
                          <p className="text-sm text-gray-500">{t.role}</p>
                        </div>
                        <div className="flex gap-0.5">
                          {[...Array(t.rating)].map((_, i) => (
                            <Star key={i} className={`h-4 w-4 fill-amber-400 text-amber-400 ${i === 0 ? 'animate-wiggle' : ''} ${i === 4 ? 'animate-bounce-soft' : ''}`} />
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
                      ? 'w-8 bg-gradient-to-r from-pink-500 via-purple-500 to-sky-500'
                      : 'w-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Rainbow divider */}
        <div className="mx-auto max-w-4xl mt-20">
          <div className="divider-rainbow rounded-full" />
        </div>
      </section>

      {/* ===== STATE COVERAGE ===== */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-50/30 via-indigo-50/20 to-white" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-200 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center animate-on-scroll">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-50 to-indigo-50 px-4 py-1.5 text-sm font-medium text-sky-700 mb-4 emoji-badge">
              🗺️ Nationwide Coverage
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 font-heading sm:text-4xl">
              States We{' '}
              <span className="gradient-text-rainbow">Currently Serve</span>
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-gray-600">
              From our home in Alabama, we serve families across the country. 🇺🇸
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 max-w-3xl mx-auto animate-on-scroll">
            {COVERED_STATES.map((state, i) => {
              const stateColors = ['#d1fae5', '#fce7f3', '#ede9fe', '#e0f2fe', '#fef3c7', '#fce7f3', '#d1fae5', '#ede9fe', '#e0f2fe']
              const iconColors = ['text-emerald-500', 'text-pink-400', 'text-purple-400', 'text-sky-400', 'text-amber-400', 'text-rose-400', 'text-emerald-400', 'text-violet-400', 'text-blue-400']
              return (
                <div
                  key={state.code}
                  className="flex items-center gap-2 rounded-xl border border-gray-100 bg-white/80 px-4 py-3 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 animate-pop"
                  style={{ backgroundColor: stateColors[i % stateColors.length] + '80', transitionDelay: `${i * 50}ms` }}
                >
                  <CheckCircle className={`h-4 w-4 flex-shrink-0 ${iconColors[i % iconColors.length]}`} />
                  <div>
                    <span className="font-bold text-gray-900 text-sm">{state.code}</span>
                    <span className="ml-1 text-xs text-gray-500">{state.name}</span>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-8 text-center animate-on-scroll">
            <Link href="/states">
              <Button variant="sky" className="shadow-lg shadow-sky-500/20">
                🗺️ View Full Coverage Map
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
        {/* Colorful orbs instead of just emerald/amber */}
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl animate-float-delayed" />
        <div className="absolute top-1/3 right-1/4 h-48 w-48 rounded-full bg-pink-500/8 blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-1/3 left-1/4 h-36 w-36 rounded-full bg-purple-500/8 blur-3xl animate-float" style={{ animationDelay: '3s' }} />

        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <div className="animate-on-scroll space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-1.5 text-sm text-emerald-300 backdrop-blur-sm emoji-badge">
              <HeartHandshake className="h-3.5 w-3.5" />
              🌟 Start Your Journey Today
            </div>

            <h2 className="text-3xl font-bold text-white font-heading sm:text-4xl lg:text-5xl">
              Ready to Homeschool{' '}
              <span className="gradient-text-rainbow">
                with Confidence?
              </span>
            </h2>

            <p className="text-lg leading-relaxed text-emerald-100/70 max-w-xl mx-auto">
              Join hundreds of families who have found peace of mind through
              Larose Christian Academy. Tuition is just $45/month — curriculum
              books are purchased separately. 🙌
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/enroll">
                <Button size="lg" variant="fun" className="shadow-xl shadow-purple-500/20 text-base animate-bounce-soft">
                  ✨ Enroll Now — $45/mo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-emerald-400/30 text-emerald-100 hover:bg-emerald-500/10"
                >
                  💬 Questions? Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Rainbow divider at bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="divider-rainbow" />
        </div>
      </section>
    </>
  )
}
