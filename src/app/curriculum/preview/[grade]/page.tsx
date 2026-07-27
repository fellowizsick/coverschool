import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { isAuthorizedAdmin } from '@/lib/adminAccess'
import { getGradeCurriculum } from '@/lib/curriculum_index'
import { gradeToNum } from '@/lib/gradeMap'
import CurriculumPlayer from '@/components/CurriculumPlayer'
import { GraduationCap, Shield, Lock, CheckCircle } from 'lucide-react'
import Link from 'next/link'

const GRADE_NAMES: Record<string, string> = {
  kindergarten: 'Kindergarten', '1st': '1st Grade', '2nd': '2nd Grade',
  '3rd': '3rd Grade', '4th': '4th Grade', '5th': '5th Grade',
  '6th': '6th Grade', '7th': '7th Grade', '8th': '8th Grade',
  '9th': '9th Grade', '10th': '10th Grade', '11th': '11th Grade', '12th': '12th Grade'
}

export default async function AdminGradePreview({
  params,
}: {
  params: Promise<{ grade: string }>
}) {
  const { grade } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAuthorizedAdmin(user.email)) redirect('/')

  const gradeLabel = GRADE_NAMES[grade.toLowerCase()] || grade
  const gradeNum = gradeToNum(gradeLabel)
  const curriculum = getGradeCurriculum(gradeNum)

  if (!curriculum) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white p-8 text-center">
        <GraduationCap className="mx-auto h-12 w-12 text-gray-300" />
        <h2 className="mt-4 text-lg font-semibold text-gray-900">Grade not found</h2>
        <Link href="/curriculum" className="text-sm text-emerald-600 hover:underline mt-2 inline-block">← Back to curriculum</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Admin banner */}
      <div className="bg-amber-500/10 border-b border-amber-200">
        <div className="max-w-4xl mx-auto px-4 py-2 flex items-center gap-2 text-sm text-amber-700">
          <Shield className="h-4 w-4" />
          <span>Admin Preview — {gradeLabel} · You are viewing the full curriculum as an enrolled student would see it.</span>
          <Link href="/curriculum" className="ml-auto text-xs underline">← Back</Link>
        </div>
      </div>
      
      {/* Actual CurriculumPlayer - same component students use */}
      <CurriculumPlayer
        grade={curriculum}
        enrollmentId={`admin-preview-${grade.toLowerCase()}`}
        studentName={`Admin Preview`}
        gradeNum={gradeNum}
      />
    </div>
  )
}
