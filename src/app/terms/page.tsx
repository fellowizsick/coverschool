import { SCHOOL_CONFIG } from '@/lib/constants'
import { FileText } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 to-emerald-800 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent" />
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-sm text-emerald-200 backdrop-blur-sm">
            <FileText className="h-4 w-4" />
            Legal
          </div>
          <h1 className="font-heading text-4xl font-bold text-white sm:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-4 text-lg text-emerald-100/80">
            Terms governing enrollment and use of our services
          </p>
          <p className="mt-2 text-sm text-emerald-300/60">Last updated: June 28, 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="prose prose-emerald max-w-none">
          <h2>Acceptance of Terms</h2>
          <p>
            By enrolling with {SCHOOL_CONFIG.name} (&ldquo;the Academy,&rdquo; &ldquo;we,&rdquo; or
            &ldquo;us&rdquo;), you agree to be bound by these Terms of Service. If you do not agree,
            please do not enroll or use our services.
          </p>

          <h2>Description of Services</h2>
          <p>
            {SCHOOL_CONFIG.name} operates as an Alabama church school under Alabama Code §16-28-1,
            providing cover school (umbrella school) services to homeschooling families. Our services
            include:
          </p>
          <ul>
            <li>Legal oversight and enrollment under Alabama church school law</li>
            <li>Attendance tracking and record-keeping</li>
            <li>Official report cards and transcripts</li>
            <li>Administrative support for homeschooling families</li>
          </ul>

          <h2>Eligibility</h2>
          <p>
            Our services are available to families residing in states we currently serve. By
            enrolling, you certify that:
          </p>
          <ul>
            <li>You are the parent or legal guardian of the student(s) being enrolled</li>
            <li>The information provided in your enrollment is accurate and complete</li>
            <li>You understand that we provide administrative and legal oversight, not curriculum or instruction</li>
          </ul>

          <h2>Tuition and Payment</h2>
          <p>Enrollment is $45/month per student, billed monthly via subscription. This covers administrative services, record-keeping, and legal oversight. Curriculum books are not included and are purchased separately.</p>
          <ul>
            <li>Payments are processed securely through Stripe</li>
            <li>You may cancel your subscription at any time</li>
            <li>No refunds for partial months after cancellation</li>
            <li>Failure to pay may result in suspension of services</li>
          </ul>

          <h2>Parent Responsibilities</h2>
          <p>As an enrolled family, you agree to:</p>
          <ul>
            <li>Provide instruction in the required subjects for your state</li>
            <li>Maintain accurate attendance records as directed</li>
            <li>Notify us of any changes in contact information or address</li>
            <li>Comply with applicable state homeschool laws</li>
          </ul>

          <h2>Limitation of Liability</h2>
          <p>
            {SCHOOL_CONFIG.name} provides administrative and record-keeping services as an Alabama
            church school. We are not responsible for:
          </p>
          <ul>
            <li>The content or quality of curriculum chosen by parents</li>
            <li>Compliance with state laws outside our scope of service</li>
            <li>Any damages arising from the use or inability to use our services</li>
          </ul>
          <p>
            Our total liability for any claim arising from these services is limited to the amount
            paid by you in the twelve (12) months preceding the claim.
          </p>

          <h2>Cancellation</h2>
          <p>
            You may cancel your enrollment at any time by contacting us or through your account
            dashboard. Upon cancellation:
          </p>
          <ul>
            <li>Your subscription will be stopped at the end of the current billing period</li>
            <li>You will retain access to your records for download</li>
            <li>Official transcripts may be requested after cancellation</li>
          </ul>
          <p>
            We reserve the right to terminate services for violation of these terms or non-payment,
            with notice provided when possible.
          </p>

          <h2>Records and Transcripts</h2>
          <p>
            Student records, including attendance, report cards, and transcripts, are maintained by
            the Academy. Upon request, official transcripts will be provided in accordance with
            applicable policies and fees.
          </p>

          <h2>Modification of Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Changes will be communicated via
            email and posted on our website. Continued use of our services after changes constitutes
            acceptance of the new terms.
          </p>

          <h2>Governing Law</h2>
          <p>
            These terms are governed by the laws of the State of Alabama. Any disputes shall be
            resolved in the courts of Jefferson County, Alabama.
          </p>

          <h2>Contact</h2>
          <p>
            For questions about these terms, please contact us at{' '}
            <a href={`mailto:${SCHOOL_CONFIG.email}`} className="text-emerald-600 underline">
              {SCHOOL_CONFIG.email}
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  )
}
