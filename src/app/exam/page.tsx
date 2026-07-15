import { Card, CardContent } from '@/components/ui/Card'
import { GraduationCap, Lock } from 'lucide-react'

// NOTE: The full diploma exam (page.diploma.tsx) is disabled pending
// Larose Christian Academy's accreditation. Re-enable by renaming
// page.diploma.tsx -> page.tsx and adding the 'Diploma Exam' nav link
// in src/lib/constants.ts once accreditation is obtained.

export default function ExamPendingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-sky-50">
      <section className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-sky-800 py-20 text-center">
        <div className="mx-auto max-w-2xl px-4">
          <div className="mb-4 inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-sm text-emerald-200 ring-1 ring-white/20">
            <GraduationCap className="h-4 w-4" />
            <span className="font-semibold">🎓 Larose Christian Academy</span>
          </div>
          <h1 className="font-heading text-4xl font-bold text-white sm:text-5xl">High School Diploma Program</h1>
          <p className="mt-4 text-lg text-emerald-100/80">
            Coming soon — pending accreditation.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-2xl px-4 py-12">
        <Card>
          <CardContent className="p-8 text-center space-y-4">
            <Lock className="mx-auto h-12 w-12 text-emerald-600" />
            <h2 className="text-xl font-bold text-gray-900">📋 Currently Unavailable</h2>
            <p className="text-gray-600 leading-relaxed">
              Our diploma examination and certification program is being finalized
              alongside the academy&apos;s official accreditation. We are committed to
              offering a recognized, legitimate high school diploma — and we will
              launch the program as soon as accreditation is in place.
            </p>
            <p className="text-sm text-gray-500">
              Questions? Contact the academy and we&apos;ll let you know the moment
              the program opens.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
