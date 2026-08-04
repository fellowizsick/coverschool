import Link from 'next/link'
import { CheckCircle, Heart, ArrowRight } from 'lucide-react'

export default function DonateSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/30 via-white to-rose-50/20 flex items-center justify-center px-4 pt-24 pb-16">
      <div className="max-w-lg mx-auto text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 via-emerald-50 to-rose-100 shadow-lg shadow-emerald-900/10 animate-bounce-soft">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-inner">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="mt-8 text-3xl font-bold text-gray-900 font-heading sm:text-4xl">
          Thank You for Your Gift! 🎉
        </h1>
        <p className="mt-4 text-lg text-gray-600 leading-relaxed">
          Your donation to Larose Christian Academy is truly appreciated. Your generosity helps
          families across America give their children the blessing of a homeschool education.
        </p>
        <div className="mt-8 rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-6 text-left">
          <div className="flex items-start gap-3">
            <Heart className="h-6 w-6 text-rose-500 mt-0.5 shrink-0" />
            <div>
              <h3 className="font-semibold text-emerald-900">What happens next?</h3>
              <ul className="mt-2 space-y-1.5 text-sm text-emerald-800">
                <li>• A receipt is sent to your email (if provided).</li>
                <li>• Your gift goes directly toward supporting homeschool families.</li>
                <li>• May God bless you for your kindness! 🙏</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/">
            <span className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-900/20 transition-all hover:shadow-xl hover:-translate-y-0.5">
              Back to Home <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
          <Link href="/enroll">
            <span className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 px-6 py-3 text-sm font-semibold text-amber-950 shadow-lg shadow-amber-500/30 transition-all hover:shadow-xl hover:-translate-y-0.5">
              Enroll Your Student 🎓
            </span>
          </Link>
        </div>
      </div>
    </div>
  )
}
