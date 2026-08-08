import type { Metadata } from 'next'
import FAQAccordion from './faq-accordion'

export const metadata: Metadata = {
  title: 'FAQ | Larose Christian Academy',
  description:
    'Frequently asked questions about Larose Christian Academy — what a cover school is, tuition ($45/month or $450/year per student + $75 registration), legal coverage in Alabama and 8 other states, report cards, transcripts, and more.',
  alternates: { canonical: '/faq' },
}

// FAQ schema for Google rich results (searchable, expandable Q&As).
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'What is a cover school?', acceptedAnswer: { '@type': 'Answer', text: 'A cover school is a private school that homeschooling families enroll in to meet state legal requirements. The school "covers" the family by maintaining official records while the parents retain full control over curriculum and teaching.' } },
    { '@type': 'Question', name: 'Is Larose Christian Academy a real school?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Larose Christian Academy operates as a church school under Alabama law (Alabama Code §16-28-1). We are a legitimate private school that provides educational oversight for homeschooling families.' } },
    { '@type': 'Question', name: 'How much does it cost?', acceptedAnswer: { '@type': 'Answer', text: 'Tuition is $45/month per student during the school year (August through May, no charges in June or July) plus a one-time $75 registration fee. Yearly option: $525/year per student ($450 tuition + $75 registration). Curriculum books are purchased separately. Cancel anytime.' } },
    { '@type': 'Question', name: 'How do grades work?', acceptedAnswer: { '@type': 'Answer', text: 'Parents grade the work at home using answer keys, then enter the grade in the Parent Portal. LCA turns those grades into official report cards and transcripts kept on file.' } },
    { '@type': 'Question', name: 'Is this legal in my state?', acceptedAnswer: { '@type': 'Answer', text: 'We currently serve families in Alabama, Florida, Georgia, Indiana, Mississippi, Missouri, Oklahoma, South Carolina, and Texas.' } },
    { '@type': 'Question', name: 'How does the referral program work?', acceptedAnswer: { '@type': 'Answer', text: 'Every enrolled family gets a personal referral code. When a new family enrolls using it AND pays, you earn one month free ($45 credit) on monthly plans, or $45 off your yearly payment. No limit.' } },
  ],
}

export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <FAQAccordion />
    </>
  )
}
