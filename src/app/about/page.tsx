import { SCHOOL_CONFIG } from '@/lib/constants'
import { Shield, Church, Heart } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900">
        About {SCHOOL_CONFIG.name}
      </h1>
      <p className="mt-4 text-lg text-gray-600">
        An Alabama church school dedicated to serving homeschooling families.
      </p>

      <div className="mt-12 space-y-12">
        {/* Our Mission */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
          <p className="mt-4 text-gray-600 leading-relaxed">
            {SCHOOL_CONFIG.name} exists to provide homeschooling families with the legal
            oversight, administrative support, and spiritual encouragement they need
            to successfully educate their children at home. We believe parents are
            their children&apos;s first and most important teachers, and we are here to
            come alongside them in that calling.
          </p>
        </section>

        {/* What is a Cover School */}
        <section className="rounded-xl bg-emerald-50 p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                What is a Cover School?
              </h2>
              <p className="mt-3 text-gray-600 leading-relaxed">
                A cover school (also called an umbrella school or covering school) is
                a private school that homeschooling families enroll in to meet state
                legal requirements. The school &quot;covers&quot; the family by maintaining
                enrollment records, attendance logs, and transcripts — while the
                parents retain full control over curriculum, teaching methods, and
                daily instruction.
              </p>
              <p className="mt-3 text-gray-600 leading-relaxed">
                In Alabama, cover schools operate as church schools under Alabama
                Code §16-28-1. This model has been serving homeschool families
                effectively for decades.
              </p>
            </div>
          </div>
        </section>

        {/* Church School Foundation */}
        <section className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
            <Church className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Church School Foundation
            </h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              {SCHOOL_CONFIG.name} operates as a church school under Alabama state law.
              Our founder is an ordained minister, and the school operates under the
              authority and covering of our ministry. This provides the strongest
              possible legal foundation for the families we serve.
            </p>
          </div>
        </section>

        {/* Our Heart */}
        <section className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-rose-100 text-rose-600">
            <Heart className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Our Heart</h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              We believe homeschooling is not just an educational choice — it&apos;s a
              calling. Our goal is to remove the administrative burden so families
              can focus on what matters most: nurturing their children&apos;s minds,
              character, and faith. We are honored to serve families in this journey.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
