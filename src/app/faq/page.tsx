import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const faqs = [
  {
    q: 'What is a cover school?',
    a: 'A cover school is a private school that homeschooling families enroll in to meet state legal requirements. The school "covers" the family by maintaining official records while the parents retain full control over curriculum and teaching.',
  },
  {
    q: 'Is Larose Christian Academy a real school?',
    a: 'Yes. Larose Christian Academy operates as a church school under Alabama law (Alabama Code §16-28-1). We are a legitimate private school that provides educational oversight for homeschooling families.',
  },
  {
    q: 'Do you provide curriculum or lesson plans?',
    a: 'No. Parents choose their own curriculum and teaching methods. Our role is administrative — we handle enrollment, attendance records, report cards, and transcripts.',
  },
  {
    q: 'How much does it cost?',
    a: 'Enrollment is $45/month per student for tuition. This covers all administrative services including record-keeping, report cards, and transcripts. Additionally, there is a one-time $75 registration fee to set up your student\'s permanent file and records. Curriculum books are purchased separately. Cancel tuition anytime.',
  },
  {
    q: 'Can I enroll multiple students from the same family?',
    a: 'Yes! Enroll all your children together. Each student will have their own records, report cards, and transcripts.',
  },
  {
    q: 'How do I submit attendance?',
    a: 'After enrollment, you will receive access to our parent portal where you can submit monthly attendance records.',
  },
  {
    q: 'Do you issue official report cards and transcripts?',
    a: 'Yes. We issue official report cards at the end of each term and provide transcripts for college applications or school transfers.',
  },
  {
    q: 'Is this legal in my state?',
    a: 'We currently serve families in Alabama, Florida, Georgia, Indiana, Mississippi, Missouri, Oklahoma, South Carolina, and Texas. If you live in a state not on our list, please contact us to discuss your situation.',
  },
  {
    q: 'What if I move to a different state?',
    a: "Contact us to discuss your situation. Students who move may be able to continue their enrollment depending on their new state's laws.",
  },
  {
    q: 'How is Larose Christian Academy different from other cover schools?',
    a: 'We are founded by an ordained minister and operate as a church school under Alabama law. Our personal approach means we truly care about the families we serve.',
  },
]

const cardColors = ['purple', 'blue', 'pink', 'green', 'amber', 'rose'] as const

export default function FAQPage() {
  return (
    <div className="min-h-screen">
      {/* 🎨 Gradient Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600 px-4 py-20 sm:px-6 lg:px-8">
        {/* Decorative floating shapes */}
        <div className="absolute -left-10 top-8 h-36 w-36 animate-float rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -right-6 bottom-12 h-48 w-48 animate-float rounded-full bg-sky-300/15 blur-3xl [animation-delay:1s]" />
        <div className="absolute left-1/4 top-4 h-20 w-20 animate-bounce-soft rounded-full bg-teal-200/10 blur-2xl [animation-delay:2s]" />
        <div className="mx-auto max-w-3xl text-center">
          <span className="mb-4 inline-block animate-pop rounded-full bg-white/20 px-4 py-1 text-sm font-medium text-white backdrop-blur-sm">
            ❓ Got Questions?
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-cyan-100">
            Everything you need to know about Larose Christian Academy.
          </p>
          <div className="mx-auto mt-8 h-1 w-24 rounded-full bg-gradient-to-r from-pink-400 via-amber-300 to-emerald-300" />
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <span className="emoji-badge">🔍</span>
          <p className="text-sm font-medium text-gray-500">Popular Questions</p>
          <div className="ml-auto flex gap-1">
            {['💬', '📋', '⭐'].map((emoji, i) => (
              <span key={i} className="animate-wiggle text-lg" style={{ animationDelay: `${i * 200}ms` }}>
                {emoji}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {faqs.map((faq, i) => (
            <Card key={i} fun={cardColors[i % cardColors.length]}>
              <CardContent className="p-5">
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 flex-shrink-0 text-lg">
                    {['💡', '✅', '📚', '💰', '👨‍👩‍👧‍👦', '📝', '🎓', '🌍', '🚚', '💎'][i]}
                  </span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{faq.q}</h3>
                    <p className="mt-2 text-gray-600">{faq.a}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="relative mt-12 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-8 text-center shadow-lg">
          {/* Decorative blobs */}
          <div className="absolute -right-8 -top-8 h-32 w-32 animate-float rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-6 -left-6 h-24 w-24 animate-bounce-soft rounded-full bg-emerald-200/15 blur-xl [animation-delay:1s]" />
          <div className="relative z-10">
            <span className="mb-3 inline-block text-3xl">💬</span>
            <h2 className="text-lg font-semibold text-white">
              Still have questions?
            </h2>
            <p className="mt-2 text-emerald-100">
              We&apos;re happy to help. Reach out and we&apos;ll get back to you.
            </p>
            <div className="mt-5">
              <Link href="/contact">
                <Button variant="gold">
                  Contact Us
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
