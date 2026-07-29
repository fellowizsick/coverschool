import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { ArrowRight, ClipboardList, FileCheck, GraduationCap, Search } from 'lucide-react'

const steps = [
  {
    icon: Search,
    title: '1. Check Your State',
    description:
      'Review our state coverage page to confirm we serve families in your state. We currently cover 9 states through our Alabama church school.',
  },
  {
    icon: ClipboardList,
    title: '2. Submit Enrollment',
    description:
      'Fill out our online enrollment form with parent and student information. The process takes about 10 minutes.',
  },
  {
    icon: FileCheck,
    title: '3. Receive Confirmation',
    description:
      'We review your application and send an enrollment confirmation letter. You are now officially enrolled in Larose Christian Academy.',
  },
  {
    icon: GraduationCap,
    title: '4. Homeschool Freely',
    description:
      'Choose your own curriculum, set your own schedule, and teach your way. We handle record-keeping, attendance, and transcripts.',
  },
]

const faqs = [
  {
    q: 'Do I have to use a specific curriculum?',
    a: 'No. You retain full control over your curriculum, teaching methods, and daily schedule. We never dictate what or how you teach.',
  },
  {
    q: 'How does attendance tracking work?',
    a: 'We maintain official attendance records for your student. Attendance reporting details will be available through the parent portal soon.',
  },
  {
    q: 'Will you provide report cards and transcripts?',
    a: 'Yes. We issue official report cards at the end of each term and provide transcripts when needed for college applications, transfers, or other purposes.',
  },
  {
    q: 'Is this legal in my state?',
    a: "We recommend checking our states page and consulting with HSLDA if you have specific questions about your state's requirements.",
  },
]

const iconGradients = [
  'from-amber-400 to-orange-500',
  'from-sky-400 to-blue-500',
  'from-emerald-400 to-teal-500',
  'from-purple-400 to-violet-500',
]

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen">
      {/* 🎨 Gradient Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-500 via-orange-500 to-yellow-400 px-4 py-20 sm:px-6 lg:px-8">
        {/* Decorative floating shapes */}
        <div className="absolute -left-10 top-10 h-36 w-36 animate-float rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -right-6 bottom-10 h-44 w-44 animate-float rounded-full bg-amber-200/15 blur-3xl [animation-delay:1s]" />
        <div className="absolute left-1/3 top-6 h-24 w-24 animate-bounce-soft rounded-full bg-yellow-200/10 blur-2xl [animation-delay:2s]" />
        <div className="mx-auto max-w-4xl text-center">
          <span className="mb-4 inline-block animate-pop rounded-full bg-white/20 px-4 py-1 text-sm font-medium text-white backdrop-blur-sm">
            🚀 Getting Started Is Easy
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            How It Works
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-amber-100">
            Getting started with Larose Christian Academy is simple. Here&apos;s the process.
          </p>
          <div className="mx-auto mt-8 flex items-center justify-center gap-3">
            <div className="h-1 w-20 rounded-full bg-gradient-to-r from-amber-300 via-yellow-300 to-emerald-300" />
            <span className="animate-wiggle text-xl">✨</span>
            <div className="h-1 w-20 rounded-full bg-gradient-to-r from-emerald-300 via-yellow-300 to-amber-300" />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Steps */}
        <div className="relative">
          {/* Connection line */}
          <div className="absolute left-7 top-4 hidden h-[calc(100%-3rem)] w-0.5 bg-gradient-to-b from-amber-300 via-yellow-300 to-emerald-300 md:block" />

          <div className="space-y-8">
            {steps.map((step, i) => (
              <div key={i} className="animate-slide-up group flex items-start gap-5" style={{ animationDelay: `${i * 150}ms` }}>
                <div className={`relative z-10 flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${iconGradients[i]} text-white shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:shadow-xl`}>
                  <step.icon className="h-7 w-7" />
                </div>
                <div className="flex-1 rounded-2xl bg-gradient-to-br from-white to-gray-50/50 p-6 shadow-sm ring-1 ring-gray-100 transition-all duration-500 hover:shadow-lg hover:-translate-y-0.5">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <div className="mb-3 flex items-center justify-center gap-2">
            <span className="emoji-badge">🎯</span>
            <span className="text-sm font-medium text-gray-500">Ready to begin?</span>
          </div>
          <Link href="/enroll">
            <Button variant="gold" size="lg">
              Enroll Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Quick FAQ */}
        <div className="mt-20">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-400 to-indigo-500 text-white shadow-md">
              <span className="text-lg">💬</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Quick Answers</h2>
              <p className="text-sm text-gray-500">Common questions about our process</p>
            </div>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <Card key={i} fun={['purple', 'sky', 'green', 'amber'][i] as 'purple' | 'sky' | 'green' | 'amber'}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 flex-shrink-0 text-lg">
                      {['📖', '📊', '🎓', '🌍'][i]}
                    </span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{faq.q}</h3>
                      <p className="mt-1 text-gray-600">{faq.a}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/faq">
              <Button variant="outline">
                View Full FAQ
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
