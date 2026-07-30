import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import {
  GraduationCap, Mail, MapPin, BookOpen, CheckCircle, Clock,
  FileText, Printer, Download, User, Phone, ArrowLeft, CreditCard,
} from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function StudentProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch enrollment
  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('*')
    .eq('id', id)
    .single()

  if (!enrollment) notFound()

  // Fetch church form for this enrollment
  const { data: churchForms } = await supabase
    .from('church_enrollment_forms')
    .select('*')
    .eq('enrollment_id', id)
    .order('created_at', { ascending: false })
    .limit(1)

  const churchForm = churchForms?.[0] || null

  // Fetch curriculum progress
  const { data: progress } = await supabase
    .from('curriculum_progress')
    .select('*')
    .eq('enrollment_id', id)
    .single()

  const studentDisplay = `${enrollment.student_first_name} ${enrollment.student_last_name}`

  return (
    <div className="space-y-6">
      {/* Back + Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-1 h-4 w-4" /> Back
            </Button>
          </Link>
          <h2 className="text-xl font-bold text-gray-900">{studentDisplay}</h2>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
            enrollment.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
            enrollment.status === 'pending' ? 'bg-amber-100 text-amber-700' :
            'bg-red-100 text-red-700'
          }`}>{enrollment.status}</span>
        </div>
      </div>

      {/* Main Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5 text-emerald-600" />
            Student Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">Full Name</p>
              <p className="text-base font-medium">{studentDisplay}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">Grade</p>
              <p className="text-base font-medium">{enrollment.student_grade}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">Enrolled</p>
              <p className="text-base font-medium">{new Date(enrollment.created_at).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">City, State</p>
              <p className="text-base font-medium">{enrollment.city}, {enrollment.state}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">Payment Status</p>
              <p className={`text-base font-medium ${
                enrollment.payment_status === 'paid' ? 'text-emerald-600' :
                enrollment.payment_status === 'unpaid' ? 'text-red-600' : 'text-amber-600'
              }`}>{enrollment.payment_status}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Parent Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Mail className="h-5 w-5 text-blue-600" />
            Parent / Guardian
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">Name</p>
              <p className="text-base font-medium">{enrollment.parent_first_name} {enrollment.parent_last_name}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">Email</p>
              <p className="text-base font-medium">{enrollment.email || '—'}</p>
            </div>
            {enrollment.phone && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Phone</p>
                <p className="text-base font-medium">{enrollment.phone}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Church Enrollment Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5 text-amber-600" />
            Church Enrollment Form
          </CardTitle>
        </CardHeader>
        <CardContent>
          {churchForm ? (
            <div className="space-y-3">
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Status</p>
                  <p className="text-sm font-medium text-emerald-600">{churchForm.church_form_status || 'Submitted'} ✅</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Submitted</p>
                  <p className="text-sm font-medium">{new Date(churchForm.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Signed by</p>
                  <p className="text-sm font-medium">{churchForm.parent_signature}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">School Year</p>
                  <p className="text-sm font-medium">{churchForm.school_year}</p>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Link href={`/enroll/church-form/${churchForm.id}`}>
                  <Button size="sm" variant="outline">
                    <Printer className="mr-1 h-4 w-4" /> View / Print
                  </Button>
                </Link>
                <a href={`/api/church-form-pdf/${churchForm.id}`} target="_blank">
                  <Button size="sm" variant="outline">
                    <Download className="mr-1 h-4 w-4" /> Download PDF
                  </Button>
                </a>
              </div>
            </div>
          ) : (
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
              <p className="font-medium">⚠️ No church enrollment form submitted yet.</p>
              <p className="mt-1 text-amber-600">This student cannot begin until this form is completed.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Curriculum Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BookOpen className="h-5 w-5 text-indigo-600" />
            Curriculum Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          {progress ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Completed steps: {progress.completed_steps?.length || 0}
                </p>
                <Link href={`/curriculum/${enrollment.id}`}>
                  <Button size="sm" variant="outline">View Full Progress</Button>
                </Link>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No curriculum progress data yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
