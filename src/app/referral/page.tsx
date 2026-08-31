import Link from 'next/link'
import { Gift, Users, CreditCard, CalendarCheck, Sparkles, ArrowRight, CheckCircle, DollarSign } from 'lucide-react'

export default function ReferralPage() {
  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-emerald-50/30 via-white to-amber-50/20">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-amber-900 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-emerald-200 backdrop-blur-sm mb-4">
            <Gift className="h-4 w-4" />
            Referral Program
          </div>
          <h1 className="font-heading text-4xl font-bold text-white sm:text-5xl">
            Refer a Family — Earn Free Tuition 🎁
          </h1>
          <p className="mt-4 text-lg text-emerald-100/80 max-w-xl mx-auto">
            Love homeschooling with Larose Christian Academy? Share it with a friend.
            When they enroll and pay, you earn <strong className="text-white">one month free</strong> —
            and they get a great start for their family.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/enroll">
              <span className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-500/30 transition-all hover:shadow-xl hover:-translate-y-0.5">
                <Sparkles className="h-4 w-4" /> Enroll Now
              </span>
            </Link>
            <Link href="/parent">
              <span className="inline-flex items-center gap-2 rounded-xl bg-white/10 border border-white/20 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20">
                Find My Referral Code
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold text-gray-900 font-heading">
          How It Works
        </h2>
        <p className="mt-2 text-center text-gray-500">
          Three simple steps. No codes to remember — just share your link.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: <Users className="h-6 w-6 text-emerald-700" />,
              step: '1',
              title: 'Get Your Link',
              desc: 'Log into the Parent Portal and copy your personal referral link (like laroseca.org/enroll?ref=LCA-XXXXX). Every family gets one automatically.',
              color: 'from-emerald-200 to-emerald-100',
            },
            {
              icon: <CreditCard className="h-6 w-6 text-amber-700" />,
              step: '2',
              title: 'Share It',
              desc: 'Send your link to friends, family, your church, or homeschool groups. They enter it (or it auto-fills) when they enroll.',
              color: 'from-amber-200 to-amber-100',
            },
            {
              icon: <CalendarCheck className="h-6 w-6 text-emerald-700" />,
              step: '3',
              title: 'Earn Free Tuition',
              desc: 'When their payment goes through, you get one month of tuition free — automatically applied to your next bill. No forms, no waiting.',
              color: 'from-emerald-100 to-emerald-50',
            },
          ].map((item) => (
            <div
              key={item.step}
              className="relative rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} shadow-sm`}>
                {item.icon}
              </div>
              <span className="absolute top-5 right-5 text-4xl font-black text-gray-100">
                {item.step}
              </span>
              <h3 className="mt-4 text-lg font-bold text-gray-900">{item.title}</h3>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Rewards */}
      <section className="bg-gradient-to-b from-white to-emerald-50/50 py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-gray-900 font-heading">
            Your Reward 🎉
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border-2 border-emerald-200 bg-white p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-200 to-emerald-100">
                  <CalendarCheck className="h-6 w-6 text-emerald-700" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Monthly Families</h3>
                  <p className="text-sm text-gray-500">One month free per referral</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                Paying $45/month? Each referral that pays earns you a <strong>$45 credit</strong> —
                your next month&apos;s bill is <strong>$0</strong>. Refer 10 families, get 10 months free.
              </p>
            </div>
            <div className="rounded-2xl border-2 border-amber-200 bg-white p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-200 to-amber-100">
                  <DollarSign className="h-6 w-6 text-amber-700" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Yearly Families</h3>
                  <p className="text-sm text-gray-500">$45 off per referral</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                Paid the $450/year plan? Each referral that pays takes <strong>$45 off</strong> your
                next yearly payment — <strong>$405 instead of $450</strong>. It stacks, so more
                referrals = bigger savings.
              </p>
            </div>
          </div>
          <div className="mt-6 rounded-xl bg-emerald-50 border border-emerald-200 p-5 text-center">
            <p className="text-sm text-emerald-800">
              <strong>No limit.</strong> Refer as many families as you like. Every family that pays
              earns you a reward — automatically.
            </p>
          </div>
        </div>
      </section>

      {/* How you get your reward */}
      <section className="mx-auto max-w-3xl px-4 pb-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold text-gray-900 font-heading">
          How Your Reward Shows Up 🎁
        </h2>
        <p className="mt-2 text-center text-gray-500">
          You don&apos;t have to do anything — no codes to enter, no emails to send. Here&apos;s
          exactly when you&apos;ll see it:
        </p>
        <div className="mt-8 space-y-4">
          <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-200 to-emerald-100">
                <CalendarCheck className="h-6 w-6 text-emerald-700" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">On a Monthly Plan</h3>
                <p className="text-sm text-gray-500">One month free, automatically</p>
              </div>
            </div>
            <ol className="mt-4 space-y-2 text-sm text-gray-600 leading-relaxed">
              <li className="flex gap-2"><span className="font-bold text-emerald-600">1.</span><span>Your friend enrolls with your link and pays.</span></li>
              <li className="flex gap-2"><span className="font-bold text-emerald-600">2.</span><span>We add a <strong>one-time $45 credit</strong> to your account instantly.</span></li>
              <li className="flex gap-2"><span className="font-bold text-emerald-600">3.</span><span>Your <strong>next monthly bill is $0</strong> — it shows up on your invoice automatically. No action needed.</span></li>
            </ol>
          </div>
          <div className="rounded-2xl border border-amber-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-200 to-amber-100">
                <DollarSign className="h-6 w-6 text-amber-700" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">On a Yearly Plan</h3>
                <p className="text-sm text-gray-500">$45 off your renewal, automatically</p>
              </div>
            </div>
            <ol className="mt-4 space-y-2 text-sm text-gray-600 leading-relaxed">
              <li className="flex gap-2"><span className="font-bold text-amber-600">1.</span><span>Your friend enrolls with your link and pays.</span></li>
              <li className="flex gap-2"><span className="font-bold text-amber-600">2.</span><span>We add a <strong>$45 credit</strong> to your account instantly.</span></li>
              <li className="flex gap-2"><span className="font-bold text-amber-600">3.</span><span>When you renew for the next year, the credit is <strong>taken off automatically</strong> at checkout — $405 instead of $450. No codes needed.</span></li>
            </ol>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-50">
                <Gift className="h-6 w-6 text-emerald-700" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Where to see it</h3>
                <p className="text-sm text-gray-500">Your credits, at a glance</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-600 leading-relaxed">
              Log into your <strong>Parent Portal</strong> anytime — your referral card shows how
              many credits you&apos;ve earned and how many you&apos;ve used. Multiple referrals
              stack, so the more families you refer, the more free months (or bigger yearly
              discount) you get.
            </p>
          </div>
        </div>
      </section>

      {/* Fine print */}
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="flex items-center gap-2 font-bold text-gray-900">
            <CheckCircle className="h-5 w-5 text-emerald-600" /> Good to Know
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-gray-600 leading-relaxed">
            <li className="flex gap-2">
              <span className="text-emerald-500">✓</span>
              <span><strong>Your reward is sent automatically.</strong> Once your friend&apos;s enrollment is complete, your credit shows up on your account right away — no forms, no waiting.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-500">✓</span>
              <span><strong>One reward per new family.</strong> Each paying enrollment earns one credit for the referrer.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-500">✓</span>
              <span><strong>Household rules.</strong> Referral codes can&apos;t be used by your own household — it&apos;s for new families, not extra discounts for yourself.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-500">✓</span>
              <span><strong>No cash value.</strong> Credits apply to tuition only, aren&apos;t transferable, and can&apos;t be combined with other discounts. Full terms in our <Link href="/terms" className="text-emerald-600 underline">Terms of Service</Link>.</span>
            </li>
          </ul>
          <div className="mt-6 border-t border-gray-100 pt-6 text-center">
            <p className="text-gray-500 text-sm mb-4">
              Ready to start? Get your code from the Parent Portal, or enroll now.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/parent">
                <span className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-700">
                  <Gift className="h-4 w-4" /> Get My Referral Code
                </span>
              </Link>
              <Link href="/enroll">
                <span className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-500/20 transition-all hover:bg-amber-600">
                  Enroll Now <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
