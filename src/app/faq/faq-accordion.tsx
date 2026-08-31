'use client'

import { useState, useMemo } from 'react'
import { ChevronDown, Search } from 'lucide-react'

// FAQ content grouped by category so parents can jump straight to what they need.
const categories = [
  {
    name: 'Basics',
    emoji: '💡',
    items: [
      {
        q: 'What is a cover school?',
        a: 'A cover school is a private school that homeschooling families enroll in to meet state legal requirements. The school "covers" the family by maintaining official records while the parents retain full control over curriculum and teaching.',
      },
      {
        q: 'Is Larose Christian Academy a real school?',
        a: 'Yes. Larose Christian Academy operates as a church school under Alabama law (Alabama Code §16-28-1). We are a legitimate private school that provides educational oversight for homeschooling families.',
      },
      {
        q: 'How is Larose Christian Academy different from other cover schools?',
        a: 'We are founded by an ordained minister and operate as a church school under Alabama law. Our personal approach means we truly care about the families we serve — you can reach a real person, and we are committed to being there when you need us.',
      },
    ],
  },
  {
    name: 'Cost & Enrollment',
    emoji: '💰',
    items: [
      {
        q: 'How much does it cost?',
        a: 'Our school year runs August through May (10 months). Tuition is $45/month per student during the school year — no charges in June or July. Every new student also pays a one-time $75 registration fee (included in the first payment, so the first month is $120 per student: $75 registration + $45 tuition). After that it\'s just $45/month per student. Yearly option: $525/year per student ($450 tuition + $75 registration). Curriculum books are purchased separately. Cancel anytime.',
      },
      {
        q: 'Can I enroll multiple students from the same family?',
        a: 'Yes! Just click "Add Child" on the enrollment form to enroll all your children together in one submission. Billing is per student ($45/month or $450/year per child), so a family with two children pays for two. Each student gets their own records, report cards, and transcripts — view and print each one separately in the Parent Portal.',
      },
      {
        q: 'Do you provide curriculum or lesson plans?',
        a: 'No. Parents choose their own curriculum and teaching methods. Our role is administrative — we handle enrollment, attendance records, report cards, and transcripts. We do offer free curriculum guides to help you choose.',
      },
    ],
  },
  {
    name: 'Records & School Work',
    emoji: '📋',
    items: [
      {
        q: 'How do I submit attendance?',
        a: 'Log into the Parent Portal, open Student Records, and tap "Log School Day" — it takes about 10 seconds. You can log the date, hours, and a note. The portal tracks your running total against your state\'s requirement and keeps the official record for report cards and transcripts.',
      },
      {
        q: 'How do grades work?',
        a: 'You are the teacher, so you grade the work at home using the answer keys that come with your books (online platforms like Khan Academy score automatically). Then enter the grade in the Parent Portal — subject, assignment, score — about a minute per assignment. LCA turns those grades into official report cards and transcripts kept on file for you.',
      },
      {
        q: 'Can I upload photos of my child\'s schoolwork?',
        a: 'Yes. From the Parent Portal you can upload photos of graded work (up to 10MB per image) so your records have evidence behind them. It\'s a great way to keep a visual record of what your child accomplished.',
      },
      {
        q: 'Do you issue official report cards and transcripts?',
        a: 'Yes. We issue official report cards at the end of each term and provide transcripts for college applications or school transfers.',
      },
    ],
  },
  {
    name: 'Legality & States',
    emoji: '🏛️',
    items: [
      {
        q: 'Is this legal in my state?',
        a: 'We currently serve families in Alabama, Florida, Georgia, Indiana, Mississippi, Missouri, Oklahoma, South Carolina, and Texas. If you live in a state not on our list, please contact us to discuss your situation.',
      },
      {
        q: 'What if I move to a different state?',
        a: 'Contact us to discuss your situation. Students who move may be able to continue their enrollment depending on their new state\'s laws.',
      },
    ],
  },
  {
    name: 'Referrals & Support',
    emoji: '⭐',
    items: [
      {
        q: 'How does the referral program work?',
        a: 'Every enrolled family gets their own personal referral code (like LCA-XXXXX). When you share your link and a new family enrolls using it AND pays, you earn a reward automatically — one month free ($45 credit) on monthly plans, or $45 off your yearly payment. There is no limit: every paying referral stacks, so refer 3 families and get 3 months free. Your code lives in your Parent Portal, and it is also emailed to you in your welcome email.',
      },
      {
        q: 'How do I get help if I have a problem?',
        a: 'We are real people, not a robot. Call us or email us and a real person answers. If something on the site is not working, use the "Report a Problem" button in the Parent Portal — you can attach screenshots and it comes straight to us.',
      },
    ],
  },
]

export default function FAQAccordion() {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState<string | null>(null)

  const filtered = useMemo(() => {
    if (!query.trim()) return categories
    const q = query.toLowerCase()
    return categories
      .map((cat) => ({
        ...cat,
        items: cat.items.filter(
          (item) => item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q),
        ),
      }))
      .filter((cat) => cat.items.length > 0)
  }, [query])

  const totalQuestions = categories.reduce((n, c) => n + c.items.length, 0)

  const toggle = (id: string) => setOpen((prev) => (prev === id ? null : id))

  return (
    <div className="min-h-[100dvh]">
      {/* 🎨 Gradient Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800 px-4 py-16 sm:px-6 lg:px-8">
        <div className="absolute -left-10 top-8 h-36 w-36 animate-float rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -right-6 bottom-12 h-48 w-48 animate-float rounded-full bg-emerald-300/15 blur-3xl [animation-delay:1s]" />
        <div className="mx-auto max-w-3xl text-center">
          <span className="mb-4 inline-block animate-pop rounded-full bg-white/20 px-4 py-1 text-sm font-medium text-white backdrop-blur-sm">
            ❓ Got Questions?
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-emerald-100">
            {totalQuestions} quick answers — tap a question to see the answer.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        {/* 🔍 Search — find any answer instantly */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setOpen(null)
            }}
            placeholder="Search questions… (try “cost”, “attendance”, “legal”)"
            className="w-full rounded-2xl border border-gray-200 bg-white py-4 pl-12 pr-4 text-gray-900 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            aria-label="Search frequently asked questions"
          />
        </div>

        {/* Category quick-jump chips */}
        {!query && (
          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <a
                key={cat.name}
                href={`#${cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50"
              >
                {cat.emoji} {cat.name}
              </a>
            ))}
          </div>
        )}

        {/* Accordion by category */}
        <div className="mt-8 space-y-8">
          {filtered.map((cat) => (
            <section
              key={cat.name}
              id={cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
              className="scroll-mt-24"
            >
              <div className="mb-3 flex items-center gap-2">
                <span className="emoji-badge">{cat.emoji}</span>
                <h2 className="text-xl font-bold text-gray-900">{cat.name}</h2>
              </div>

              <div className="space-y-3">
                {cat.items.map((item, j) => {
                  const id = `${cat.name}-${j}`
                  const isOpen = open === id
                  return (
                    <div
                      key={id}
                      className={`overflow-hidden rounded-2xl border transition ${
                        isOpen
                          ? 'border-emerald-300 bg-white shadow-md'
                          : 'border-gray-200 bg-white shadow-sm hover:border-emerald-200'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggle(id)}
                        aria-expanded={isOpen}
                        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
                      >
                        <span className="font-semibold text-gray-900">{item.q}</span>
                        <ChevronDown
                          className={`h-5 w-5 flex-shrink-0 text-gray-400 transition-transform duration-200 ${
                            isOpen ? 'rotate-180 text-emerald-500' : ''
                          }`}
                        />
                      </button>
                      <div
                        className={`grid transition-all duration-200 ease-in-out ${
                          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                        }`}
                      >
                        <div className="overflow-hidden">
                          <p className="border-t border-gray-100 px-5 py-4 text-gray-600">{item.a}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          ))}

          {filtered.length === 0 && (
            <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
              <p className="text-lg text-gray-500">No answers match “{query}”.</p>
              <p className="mt-1 text-sm text-gray-400">
                Try a different word, or contact us — we&apos;re happy to help.
              </p>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="relative mt-12 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-8 text-center shadow-lg">
          <div className="absolute -right-8 -top-8 h-32 w-32 animate-float rounded-full bg-white/10 blur-2xl" />
          <div className="relative z-10">
            <span className="mb-3 inline-block text-3xl">💬</span>
            <h2 className="text-lg font-semibold text-white">Still have questions?</h2>
            <p className="mt-2 text-emerald-100">We&apos;re happy to help. Reach out and we&apos;ll get back to you.</p>
            <div className="mt-5">
              <a
                href="/contact"
                className="inline-block rounded-xl bg-amber-400 px-6 py-3 font-semibold text-emerald-900 shadow transition hover:bg-amber-300"
              >
                Contact Us →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
