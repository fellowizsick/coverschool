import { SCHOOL_CONFIG } from '@/lib/constants'
import { Shield } from 'lucide-react'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-white to-gray-50">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 to-emerald-800 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent" />
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-sm text-emerald-200 backdrop-blur-sm">
            <Shield className="h-4 w-4" />
            Legal
          </div>
          <h1 className="font-heading text-4xl font-bold text-white sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-lg text-emerald-100/80">
            How we collect, use, and protect your information
          </p>
          <p className="mt-2 text-sm text-emerald-300/60">Last updated: August 1, 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="prose prose-emerald max-w-none">
          <h2>Introduction</h2>
          <p>
            {SCHOOL_CONFIG.name} (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is committed to protecting
            the privacy of the families we serve. This Privacy Policy explains how we collect, use,
            disclose, and safeguard your information when you visit our website or enroll with us.
          </p>

          <h2>Information We Collect</h2>
          <h3>Personal Information</h3>
          <p>When you enroll with us, we collect:</p>
          <ul>
            <li>Parent/guardian name, email address, phone number, and mailing address</li>
            <li>Student name, grade level, date of birth, and previous school information</li>
            <li>Last four digits of the student&apos;s Social Security number (required by Alabama law for church school enrollment records)</li>
            <li>Payment information (processed securely through Stripe &mdash; we do not store credit card numbers)</li>
            <li>Referral code information (who referred you, if you used a referral code)</li>
          </ul>

          <h3>Children&apos;s Information (COPPA Notice)</h3>
          <p>
            Our services are for homeschool families, and the enrollment forms are completed by
            parents or legal guardians. When you enroll a student under the age of 13, we collect
            only the information you provide about your child (name, date of birth, grade level, and
            the last four digits of the student&apos;s Social Security number as required by Alabama
            law). We do not collect personal information directly from children, and we do not
            require children to provide any personal information to use our site. As a parent or
            guardian, you may review, correct, or request deletion of your child&apos;s information
            at any time by contacting us using the details below. We comply with the Children&apos;s
            Online Privacy Protection Act (COPPA) and never sell children&apos;s information.
          </p>

          <h3>Automatically Collected Information</h3>
          <p>When you visit our website, we may automatically collect:</p>
          <ul>
            <li>IP address and browser type</li>
            <li>Pages visited and time spent on our site</li>
            <li>Referring website or search terms</li>
            <li>Anonymous visit counts via GoatCounter (a privacy-friendly analytics service that does not use tracking cookies)</li>
          </ul>

          <h2>How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Process enrollments and maintain student records</li>
            <li>Communicate with you about your enrollment and account</li>
            <li>Generate official transcripts, report cards, and attendance records</li>
            <li>Improve our website and services</li>
            <li>Comply with legal obligations as an Alabama church school</li>
          </ul>

          <h2>Information Sharing</h2>
          <p>
            We do not sell, trade, or rent your personal information to third parties. We may share
            information only:
          </p>
          <ul>
            <li>With service providers who help us operate (e.g., Stripe for payment processing)</li>
            <li>When required by law or to protect our legal rights</li>
            <li>With your consent or at your direction</li>
          </ul>

          <h2>Data Security</h2>
          <p>
            We implement industry-standard security measures to protect your personal information,
            including encryption (SSL/TLS) for data transmission and secure storage for all records.
            However, no method of electronic storage is 100% secure.
          </p>

          <h2>Data Retention</h2>
          <p>
            We retain student enrollment records and transcripts as required by Alabama law. You may
            request deletion of your account information by contacting us, subject to legal retention
            requirements.
          </p>

          <h2>Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access the personal information we hold about you</li>
            <li>Request corrections to inaccurate information</li>
            <li>Request deletion of your information (subject to legal requirements)</li>
            <li>Withdraw consent for processing where applicable</li>
          </ul>

          <h2>Cookies</h2>
          <p>
            Our website uses essential cookies for authentication and basic functionality
            (such as keeping you logged in to the Parent Portal). We do not use advertising
            or tracking cookies. Our analytics service, GoatCounter, does not set cookies and
            does not track you across websites.
          </p>

          <h2>Third-Party Links</h2>
          <p>
            Our website may contain links to third-party sites. We are not responsible for the privacy
            practices of those sites and encourage you to review their policies.
          </p>

          <h2>Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Changes will be posted on this page
            with an updated &ldquo;Last updated&rdquo; date.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, please contact us at{' '}
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
