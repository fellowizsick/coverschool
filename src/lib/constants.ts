import type { SchoolConfig, StateInfo } from './types'

export const SCHOOL_CONFIG: SchoolConfig = {
  name: 'Larose Christian Academy',
  tagline: 'Supporting Homeschool Families Across America',
  description:
    'Larose Christian Academy is an Alabama-based church school providing cover school services for homeschooling families. Founded by an ordained minister, we provide the legal oversight, record-keeping, and support families need to homeschool with confidence.',
  email: 'larosechristianacademy@gmail.com',
  phone: '251-201-9991',
  address: 'Mobile, AL',
  formspreeId: 'mykqplgw',
}

export const COVERED_STATES: StateInfo[] = [
  { code: 'AL', name: 'Alabama', status: 'available', notes: 'Home state — Alabama church school model.' },
  { code: 'FL', name: 'Florida', status: 'available', notes: 'Umbrella schools recognized by FL DOE.' },
  { code: 'GA', name: 'Georgia', status: 'available', notes: 'Cover schools widely recognized.' },
  { code: 'IN', name: 'Indiana', status: 'available', notes: 'No state regulation of non-accredited private schools.' },
  { code: 'MS', name: 'Mississippi', status: 'available', notes: 'Minimal requirements — recognized.' },
  { code: 'MO', name: 'Missouri', status: 'available', notes: 'Light regulation — cover schools accepted.' },
  { code: 'OK', name: 'Oklahoma', status: 'available', notes: 'No state oversight of private schools.' },
  { code: 'SC', name: 'South Carolina', status: 'available', notes: 'Cover schools widely recognized.' },
  { code: 'TX', name: 'Texas', status: 'available', notes: 'No state regulation of private schools.' },
]

export const ALL_STATES: StateInfo[] = [
  { code: 'AL', name: 'Alabama', status: 'available' },
  { code: 'AK', name: 'Alaska', status: 'unavailable' },
  { code: 'AZ', name: 'Arizona', status: 'unavailable' },
  { code: 'AR', name: 'Arkansas', status: 'unavailable' },
  { code: 'CA', name: 'California', status: 'unavailable' },
  { code: 'CO', name: 'Colorado', status: 'unavailable' },
  { code: 'CT', name: 'Connecticut', status: 'unavailable' },
  { code: 'DE', name: 'Delaware', status: 'unavailable' },
  { code: 'FL', name: 'Florida', status: 'available' },
  { code: 'GA', name: 'Georgia', status: 'available' },
  { code: 'HI', name: 'Hawaii', status: 'unavailable' },
  { code: 'ID', name: 'Idaho', status: 'unavailable' },
  { code: 'IL', name: 'Illinois', status: 'unavailable' },
  { code: 'IN', name: 'Indiana', status: 'available' },
  { code: 'IA', name: 'Iowa', status: 'unavailable' },
  { code: 'KS', name: 'Kansas', status: 'unavailable' },
  { code: 'KY', name: 'Kentucky', status: 'unavailable' },
  { code: 'LA', name: 'Louisiana', status: 'unavailable' },
  { code: 'ME', name: 'Maine', status: 'unavailable' },
  { code: 'MD', name: 'Maryland', status: 'unavailable' },
  { code: 'MA', name: 'Massachusetts', status: 'unavailable' },
  { code: 'MI', name: 'Michigan', status: 'unavailable' },
  { code: 'MN', name: 'Minnesota', status: 'unavailable' },
  { code: 'MS', name: 'Mississippi', status: 'available' },
  { code: 'MO', name: 'Missouri', status: 'available' },
  { code: 'MT', name: 'Montana', status: 'unavailable' },
  { code: 'NE', name: 'Nebraska', status: 'unavailable' },
  { code: 'NV', name: 'Nevada', status: 'unavailable' },
  { code: 'NH', name: 'New Hampshire', status: 'unavailable' },
  { code: 'NJ', name: 'New Jersey', status: 'unavailable' },
  { code: 'NM', name: 'New Mexico', status: 'unavailable' },
  { code: 'NY', name: 'New York', status: 'unavailable' },
  { code: 'NC', name: 'North Carolina', status: 'unavailable' },
  { code: 'ND', name: 'North Dakota', status: 'unavailable' },
  { code: 'OH', name: 'Ohio', status: 'unavailable' },
  { code: 'OK', name: 'Oklahoma', status: 'available' },
  { code: 'OR', name: 'Oregon', status: 'unavailable' },
  { code: 'PA', name: 'Pennsylvania', status: 'unavailable' },
  { code: 'RI', name: 'Rhode Island', status: 'unavailable' },
  { code: 'SC', name: 'South Carolina', status: 'available' },
  { code: 'SD', name: 'South Dakota', status: 'unavailable' },
  { code: 'TN', name: 'Tennessee', status: 'unavailable' },
  { code: 'TX', name: 'Texas', status: 'available' },
  { code: 'UT', name: 'Utah', status: 'unavailable' },
  { code: 'VT', name: 'Vermont', status: 'unavailable' },
  { code: 'VA', name: 'Virginia', status: 'unavailable' },
  { code: 'WA', name: 'Washington', status: 'unavailable' },
  { code: 'WV', name: 'West Virginia', status: 'unavailable' },
  { code: 'WI', name: 'Wisconsin', status: 'unavailable' },
  { code: 'WY', name: 'Wyoming', status: 'unavailable' },
]

export const GRADE_OPTIONS = [
  'Kindergarten',
  '1st Grade',
  '2nd Grade',
  '3rd Grade',
  '4th Grade',
  '5th Grade',
  '6th Grade',
  '7th Grade',
  '8th Grade',
  '9th Grade',
  '10th Grade',
  '11th Grade',
  '12th Grade',
]

export const ENROLLMENT_FEE = 0 // Free for initial launch — set later
export const ANNUAL_TUITION = 540 // $45/month

export const CURRICULUM_BOOKS_URL =
  'https://www.christianbook.com/page/homeschool/homeschool-curriculum/ace-paces'

export const PAPERWORK_FEE_AMOUNT = 75 // $75 one-time registration fee
export const PAPERWORK_FEE_NOTE =
  'A one-time $75 registration fee covers the setup of your student file, transcript initiation, record-keeping system configuration, and initial administrative processing.'

export const CURRICULUM_NOTE =
  '$45/month tuition covers administrative services, record-keeping, and legal oversight. Curriculum books are purchased separately.'

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'States', href: '/states' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Assessment', href: '/assessment' },
  { label: 'Contact', href: '/contact' },
  { label: 'Enroll', href: '/enroll', highlight: true },
]
