import type { Metadata } from 'next'
import LandingClient from './LandingClient'
import { SCHOOL_CONFIG } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Homeschool Umbrella School in Alabama | Larose Christian Academy',
  description:
    'Larose Christian Academy is a registered Alabama church school providing legal cover, record-keeping, and transcripts for homeschool families in 9 states. Enroll online today.',
  alternates: { canonical: '/welcome' },
  openGraph: {
    title: 'Larose Christian Academy | Alabama Church School for Homeschool Families',
    description:
      'Legal coverage, record-keeping, and transcripts for homeschool families in Alabama, Florida, Georgia, Indiana, Mississippi, Missouri, Oklahoma, South Carolina, and Texas. $450/year.',
    type: 'website',
    url: 'https://laroseca.org/welcome',
    images: [{ url: 'https://laroseca.org/landing/outdoor-learning.jpg', width: 1600, height: 1200, alt: 'Homeschool family learning outdoors in Alabama' }],
    siteName: SCHOOL_CONFIG.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Larose Christian Academy | Alabama Church School',
    description:
      'Legal cover, record-keeping, and transcripts for homeschool families in 9 states. $450/year.',
    images: ['https://laroseca.org/landing/outdoor-learning.jpg'],
  },
}

const faqSchema = [
  {
    '@type': 'Question',
    name: 'What is a cover school?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'A cover school (also called an umbrella school or covering school) is a private school that homeschooling families enroll in to meet state legal requirements. The school covers the family by maintaining enrollment records, attendance logs, and transcripts, while parents keep full control over curriculum and daily instruction. In Alabama, cover schools operate as church schools under Alabama Code Section 16-28-1.',
    },
  },
  {
    '@type': 'Question',
    name: 'Do we have to use a specific curriculum?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'No. Parents retain full control over curriculum, teaching methods, and daily instruction. Larose Christian Academy handles the legal and administrative side so you can teach your children the way you believe is best.',
    },
  },
  {
    '@type': 'Question',
    name: 'Which states do you serve?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'We currently serve homeschool families in Alabama, Florida, Georgia, Indiana, Mississippi, Missouri, Oklahoma, South Carolina, and Texas.',
    },
  },
  {
    '@type': 'Question',
    name: 'How much does it cost?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'Tuition is $450 per year per student, or $45 per month for 10 school months, plus a $75 one-time annual registration fee. There are no application fees or hidden costs.',
    },
  },
  {
    '@type': 'Question',
    name: 'How fast can our family enroll?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'Online enrollment takes only a few minutes. Once the enrollment form and payment are complete, your family is immediately covered under our registered Alabama church school.',
    },
  },
  {
    '@type': 'Question',
    name: 'Do you handle transcripts and report cards?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'Yes. We maintain enrollment records, attendance tracking, report cards, and transcripts for your family, all organized and accessible through your parent portal.',
    },
  },
]

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: SCHOOL_CONFIG.name,
  url: 'https://laroseca.org',
  telephone: SCHOOL_CONFIG.phone,
  email: SCHOOL_CONFIG.email,
  description: SCHOOL_CONFIG.description,
  foundingDate: '2024',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Mobile',
    addressRegion: 'AL',
    addressCountry: 'US',
  },
  sameAs: ['https://www.facebook.com/profile.php?id=61592919564218'],
  department: { '@type': 'Organization', name: 'Larose Christian Academy' },
}

export default function WelcomePage() {
  const schema = JSON.stringify({ '@context': 'https://schema.org', '@graph': [organizationSchema, { '@type': 'FAQPage', mainEntity: faqSchema }] })
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
      <LandingClient />
    </>
  )
}
