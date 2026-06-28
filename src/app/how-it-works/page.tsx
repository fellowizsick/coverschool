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
    a: 'You submit monthly attendance records through our parent portal. We maintain the official records for your student.',
  },
  {
    q: 'Will you provide report cards and transcripts?',
    a: 'Yes. We issue official report cards at the end of each term and provide transcripts when needed for college applications, transfers, or other purposes.',
  },
  {
    q: 'Is this legal in my state?',
    a: 'We recommend checking our states page and consulting with HSLDA if you have specific questions about your state\'s requirements.',
  },
]

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900">
        How It Works
      </h1>
      <p className="mt-4 text-lg text-gray-600">
        Getting started with Larose Christian Academy is simple. Here&apos;s the process.
      </p>

      {/* Steps */}
      <div className="mt-12 space-y-8">
        {steps.map((step, i) => (
          <div key={i} className="flex items-start gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
              <step.icon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {step.title}
              </h3>
              <p className="mt-1 text-gray-600">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link href="/enroll">
          <Button size="lg">
            Enroll Now
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Quick FAQ */}
      <div className="mt-20">
        <h2 className="text-2xl font-bold text-gray-900">Quick Answers</h2>
        <div className="mt-6 space-y-4">
          {faqs.map((faq, i) => (
            <Card key={i}>
              <CardContent className="p-5">
                <h3 className="font-semibold text-gray-900">{faq.q}</h3>
                <p className="mt-1 text-gray-600">{faq.a}</p>
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
  )
}
