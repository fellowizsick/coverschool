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
    a: 'Enrollment is $25/month per student. This covers all administrative services including record-keeping, report cards, and transcripts. Cancel anytime.',
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
    a: 'Contact us to discuss your situation. Students who move may be able to continue their enrollment depending on their new state\'s laws.',
  },
  {
    q: 'How is Larose Christian Academy different from other cover schools?',
    a: 'We are founded by an ordained minister and operate as a church school under Alabama law. Our personal approach means we truly care about the families we serve.',
  },
]

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900">
        Frequently Asked Questions
      </h1>
      <p className="mt-4 text-lg text-gray-600">
        Everything you need to know about Larose Christian Academy.
      </p>

      <div className="mt-10 space-y-4">
        {faqs.map((faq, i) => (
          <Card key={i}>
            <CardContent className="p-5">
              <h3 className="font-semibold text-gray-900">{faq.q}</h3>
              <p className="mt-2 text-gray-600">{faq.a}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-10 rounded-xl bg-emerald-50 p-8 text-center">
        <h2 className="text-lg font-semibold text-gray-900">
          Still have questions?
        </h2>
        <p className="mt-2 text-gray-600">
          We&apos;re happy to help. Reach out and we&apos;ll get back to you.
        </p>
        <div className="mt-4">
          <Link href="/contact">
            <Button>
              Contact Us
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
