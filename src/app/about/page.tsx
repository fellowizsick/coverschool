import { SCHOOL_CONFIG } from '@/lib/constants'
import { Shield, Church, Heart } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* 🎨 Gradient Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-500 px-4 py-20 sm:px-6 lg:px-8">
        {/* Decorative floating shapes */}
        <div className="absolute -left-12 top-10 h-40 w-40 animate-float rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -right-8 bottom-10 h-56 w-56 animate-float rounded-full bg-pink-300/15 blur-3xl [animation-delay:1s]" />
        <div className="absolute left-1/3 top-5 h-24 w-24 animate-bounce-soft rounded-full bg-amber-200/10 blur-2xl [animation-delay:2s]" />
        <div className="mx-auto max-w-4xl text-center">
          <span className="mb-4 inline-block animate-pop rounded-full bg-white/20 px-4 py-1 text-sm font-medium text-white backdrop-blur-sm">
            📖 Learn About Us
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            About {SCHOOL_CONFIG.name}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-purple-100">
            An Alabama church school dedicated to serving homeschooling families.
          </p>
          {/* Decorative divider */}
          <div className="mx-auto mt-8 h-1 w-24 rounded-full bg-gradient-to-r from-pink-400 via-amber-300 to-emerald-300" />
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-12">
          {/* Our Mission 📍 */}
          <section className="animate-slide-up">
            <div className="mb-4 flex items-center gap-2">
              <span className="emoji-badge">📍</span>
              <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 p-8 shadow-sm ring-1 ring-indigo-100">
              <p className="leading-relaxed text-gray-700">
                {SCHOOL_CONFIG.name}{' '}exists to provide homeschooling families with the legal
                oversight, administrative support, and spiritual encouragement they need
                to successfully educate their children at home. We believe parents are
                their children&apos;s first and most important teachers, and we are here to
                come alongside them in that calling.
              </p>
            </div>
          </section>

          {/* What is a Cover School 🛡️ */}
          <section className="animate-slide-up [animation-delay:150ms]">
            <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 p-8 shadow-sm ring-1 ring-emerald-100">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-md shadow-emerald-200">
                  <Shield className="h-7 w-7" />
                </div>
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="emoji-badge">🛡️</span>
                    <h2 className="text-xl font-bold text-gray-900">
                      What is a Cover School?
                    </h2>
                  </div>
                  <p className="mt-3 leading-relaxed text-gray-700">
                    A cover school (also called an umbrella school or covering school) is
                    a private school that homeschooling families enroll in to meet state
                    legal requirements. The school &quot;covers&quot; the family by maintaining
                    enrollment records, attendance logs, and transcripts — while the
                    parents retain full control over curriculum, teaching methods, and
                    daily instruction.
                  </p>
                  <p className="mt-3 leading-relaxed text-gray-700">
                    In Alabama, cover schools operate as church schools under Alabama
                    Code §16-28-1. This model has been serving homeschool families
                    effectively for decades.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Church School Foundation ⛪ */}
          <section className="animate-slide-up [animation-delay:300ms]">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md shadow-amber-200">
                <Church className="h-7 w-7" />
              </div>
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="emoji-badge">⛪</span>
                  <h2 className="text-xl font-bold text-gray-900">
                    Church School Foundation
                  </h2>
                </div>
                <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-50 p-6 shadow-sm ring-1 ring-amber-100">
                  <p className="leading-relaxed text-gray-700">
                    {SCHOOL_CONFIG.name} operates as a church school under Alabama state law.
                    Our founder is an ordained minister, and the school operates under the
                    authority and covering of our ministry. This provides the strongest
                    possible legal foundation for the families we serve.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Our Heart 💖 */}
          <section className="animate-slide-up [animation-delay:450ms]">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 text-white shadow-md shadow-rose-200">
                <Heart className="h-7 w-7" />
              </div>
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="emoji-badge">💖</span>
                  <h2 className="text-xl font-bold text-gray-900">Our Heart</h2>
                </div>
                <div className="rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 p-6 shadow-sm ring-1 ring-rose-100">
                  <p className="leading-relaxed text-gray-700">
                    We believe homeschooling is not just an educational choice — it&apos;s a
                    calling. Our goal is to remove the administrative burden so families
                    can focus on what matters most: nurturing their children&apos;s minds,
                    character, and faith. We are honored to serve families in this journey.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
