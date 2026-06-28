import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { COVERED_STATES } from '@/lib/constants'
import { CheckCircle, Shield, FileText, HeartHandshake, ArrowRight } from 'lucide-react'

const features = [
  {
    icon: Shield,
    title: 'Legal Coverage',
    description:
      'Our Alabama church school provides the legal oversight homeschooling families need to comply with state attendance requirements.',
  },
  {
    icon: FileText,
    title: 'Record Keeping',
    description:
      'We maintain enrollment records, attendance tracking, report cards, and transcripts so your family stays organized.',
  },
  {
    icon: HeartHandshake,
    title: 'Supportive Community',
    description:
      'Founded by an ordained minister, we offer support, guidance, and prayer for families on their homeschool journey.',
  },
]

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE4YzEuNjU3IDAgMy0xLjM0MyAzLTNzLTEuMzQzLTMtMy0zLTMgMS4zNDMtMyAzIDEuMzQzIDMgMyAzem0wIDM1YzEuNjU3IDAgMy0xLjM0MyAzLTNzLTEuMzQzLTMtMy0zLTMgMS4zNDMtMyAzIDEuMzQzIDMgMyAzeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-emerald-100 backdrop-blur">
              <Shield className="h-4 w-4" />
              Alabama Church School • Serving Families Nationwide
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Homeschool with Confidence
            </h1>
            <p className="mt-6 text-lg leading-8 text-emerald-100">
              Larose Christian Academy provides the legal oversight, record-keeping, and
              support your family needs to homeschool with peace of mind. Founded
              by an ordained minister under Alabama&apos;s church school law.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link href="/enroll">
                <Button size="lg" className="bg-white text-emerald-900 hover:bg-emerald-50">
                  Enroll Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  How It Works
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Why Choose Larose Christian Academy?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              We handle the paperwork so you can focus on teaching your children.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="border-0 bg-gray-50">
                <CardContent className="p-6 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* State Coverage */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              States We Serve
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Currently serving 9 states through our Alabama church school.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {COVERED_STATES.map((state) => (
              <div
                key={state.code}
                className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
              >
                <CheckCircle className="h-4 w-4 flex-shrink-0 text-emerald-500" />
                <span className="font-medium text-gray-900">{state.code}</span>
                <span className="text-gray-500">{state.name}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/states">
              <Button variant="outline">
                View Full Coverage Map
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Ready to Get Started?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Join the growing number of families who homeschool with confidence
              through Larose Christian Academy.
            </p>
            <div className="mt-8">
              <Link href="/enroll">
                <Button size="lg">
                  Enroll Your Student
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
