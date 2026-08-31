'use client'

import Link from 'next/link'
import AcademicRecords from '@/components/AcademicRecords'

export default function RecordsPage() {
  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-emerald-50/60 to-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="mb-6 inline-block text-sm font-medium text-emerald-700 hover:text-emerald-800">
          ← Back to home
        </Link>
        <AcademicRecords />
        <p className="mt-8 text-center text-xs text-gray-400">
          Attendance and grades you log here become part of your student&apos;s official LCA records —
          used for report cards and transcripts.
        </p>
      </div>
    </div>
  )
}
