import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import KidsLearningDashboard from '@/components/KidsDashboard'

export default async function LearnPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirect=/learn')

  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('*')
    .eq('email', user.email)
    .order('created_at', { ascending: false })

  const kidName = enrollments?.[0]?.student_first_name || 'Learner'
  const kidGrade = enrollments?.[0]?.student_grade || 0

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-emerald-50 to-white">
      <KidsLearningDashboard
        childName={kidName}
        grade={kidGrade}
      />
    </div>
  )
}
