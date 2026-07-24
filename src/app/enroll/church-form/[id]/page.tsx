'use client'

import { useState, useEffect, Suspense } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Printer, Download, ArrowLeft, FileText } from 'lucide-react'
import Link from 'next/link'

function ChurchFormViewContent() {
  const params = useParams()
  const [form, setForm] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/church-form?id=${params.id}`)
        if (!res.ok) throw new Error('Not found')
        setForm(await res.json())
      } catch (err) {
        setError('Form not found')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [params.id])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Loading form...</p>
    </div>
  )

  if (error || !form) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <h2 className="mt-4 text-xl font-semibold text-gray-700">Form Not Found</h2>
        <p className="mt-2 text-gray-500">This form doesn't exist or has been removed.</p>
        <Link href="/" className="mt-4 inline-block text-emerald-600 hover:underline">Go Home</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Toolbar */}
      <div className="sticky top-0 z-10 bg-white border-b shadow-sm print:hidden">
        <div className="mx-auto max-w-4xl px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Printer className="mr-1 h-4 w-4" /> Print
            </Button>
            <a href={`/api/church-form-pdf/${params.id}`} target="_blank">
              <Button size="sm">
                <Download className="mr-1 h-4 w-4" /> Download PDF
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Form Display */}
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div id="printable-form" className="bg-white shadow-lg rounded-xl p-8 md:p-12 print:shadow-none print:rounded-none print:p-6">
          {/* Header */}
          <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Church / Home School Enrollment Form</h1>
            <p className="text-sm text-gray-500 mt-1">Alabama Church School Model</p>
          </div>

          {/* School Year + District */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase">School Year</span>
              <p className="text-lg font-medium border-b border-gray-300 pb-1">{form.school_year}</p>
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase">Public School District</span>
              <p className="text-lg font-medium border-b border-gray-300 pb-1">{form.public_school_district || '—'}</p>
            </div>
          </div>

          {/* Part 1 */}
          <div className="border-2 border-blue-700 rounded-lg p-5 mb-6">
            <h2 className="text-lg font-bold text-blue-800 mb-4">Part 1 — To be completed by Parent or Guardian</h2>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <span className="text-xs font-semibold text-gray-500 uppercase">Student's Name</span>
                  <p className="text-base font-medium border-b border-gray-300 pb-1">{form.student_name}</p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-500 uppercase">Date of Birth</span>
                  <p className="text-base font-medium border-b border-gray-300 pb-1">{form.student_dob}</p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-500 uppercase">Grade</span>
                  <p className="text-base font-medium border-b border-gray-300 pb-1">{form.grade}</p>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase">Parent or Guardian's Name</span>
                <p className="text-base font-medium border-b border-gray-300 pb-1">{form.parent_name}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs font-semibold text-gray-500 uppercase">Home Phone</span>
                  <p className="text-base font-medium border-b border-gray-300 pb-1">{form.home_phone || '—'}</p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-500 uppercase">Date</span>
                  <p className="text-base font-medium border-b border-gray-300 pb-1">{form.form_date}</p>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase">Address</span>
                <p className="text-base font-medium border-b border-gray-300 pb-1">{form.address || '—'}</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <span className="text-xs font-semibold text-gray-500 uppercase">City</span>
                  <p className="text-base font-medium border-b border-gray-300 pb-1">{form.city || '—'}</p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-500 uppercase">State</span>
                  <p className="text-base font-medium border-b border-gray-300 pb-1">{form.state || '—'}</p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-500 uppercase">Zip</span>
                  <p className="text-base font-medium border-b border-gray-300 pb-1">{form.zip || '—'}</p>
                </div>
              </div>

              {/* Signature */}
              <div className="border-t-2 border-gray-300 pt-4 mt-4">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase">Signature of Parent or Guardian</span>
                    <p className="text-xl font-[cursive] text-gray-700 border-b border-gray-300 pb-1 mt-1">
                      {form.parent_signature}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase">Date</span>
                    <p className="text-base font-medium border-b border-gray-300 pb-1 mt-1">{form.parent_signature_date}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Part 2 - School Use */}
          <div className="border-2 border-green-700 rounded-lg p-5 mb-6 bg-green-50/30">
            <h2 className="text-lg font-bold text-green-800 mb-4">Part 2 — To be completed by Church School Administrator</h2>
            <div className="space-y-3 text-sm text-gray-500 italic">
              <p>This section is for school use only.</p>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase">Church School Name</span>
                <p className="text-base font-medium border-b border-gray-300 pb-1">Larose Christian Academy</p>
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase">School Phone</span>
                <p className="text-base font-medium border-b border-gray-300 pb-1">251-201-9991</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-3">
              <div className="col-span-2">
                <span className="text-xs font-semibold text-gray-500 uppercase">Address</span>
                <p className="text-base font-medium border-b border-gray-300 pb-1">Mobile, AL</p>
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase">Date of Enrollment</span>
                <p className="text-base font-medium border-b border-gray-300 pb-1">{form.created_at?.split('T')[0] || form.form_date}</p>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-xs font-semibold text-gray-500 uppercase">Signature of Church School Administrator</span>
              <p className="text-base font-medium border-b border-gray-300 pb-1 mt-1">________________________</p>
            </div>
          </div>

          {/* Part 3 - Consent */}
          <div className="border-2 border-amber-700 rounded-lg p-5 mb-6">
            <h2 className="text-lg font-bold text-amber-800 mb-4">Part 3 — Consent of Notification of Student Withdrawal</h2>
            <div className="bg-amber-50 border border-amber-200 rounded p-3 text-sm text-amber-900 mb-4">
              <p>I hereby give prior consent to the Church School Administrator to notify the Public School
              Superintendent MCPSS Attendance Department P.O. Box 180069 Mobile Al 36618 should the above
              named Student cease attendance at said Church School.</p>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase">Signature of Parent or Guardian</span>
                <p className="text-xl font-[cursive] text-gray-700 border-b border-gray-300 pb-1 mt-1">
                  {form.consent_signature}
                </p>
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase">Date</span>
                <p className="text-base font-medium border-b border-gray-300 pb-1 mt-1">{form.consent_date}</p>
              </div>
            </div>
          </div>

          {/* Distribution Footer */}
          <div className="border-t-2 border-gray-800 pt-4 mt-6">
            <h3 className="text-sm font-bold text-gray-700 mb-2">Distribution:</h3>
            <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
              <div className="border border-gray-300 rounded p-2 text-center font-medium">
                📋 Original to: MCPSS — Attendance Dept<br />
                <span className="text-gray-400">P.O. Box 180069, Mobile, AL 36618</span>
              </div>
              <div className="border border-gray-300 rounded p-2 text-center font-medium">
                📁 Copy 1 to: Church School Files<br />
                <span className="text-gray-400">Larose Christian Academy</span>
              </div>
              <div className="border border-gray-300 rounded p-2 text-center font-medium">
                👪 Copy 2 to: Parents
              </div>
            </div>
          </div>

          {/* Form ID */}
          <div className="mt-6 text-center text-[10px] text-gray-400">
            Form ID: {form.id} | Submitted: {new Date(form.created_at).toLocaleString()}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body { background: white !important; }
          .print\\:hidden { display: none !important; }
          #printable-form { box-shadow: none !important; padding: 0.5in !important; }
          @page { margin: 0.5in; }
        }
      `}</style>
    </div>
  )
}

export default function ChurchFormViewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">Loading...</p></div>}>
      <ChurchFormViewContent />
    </Suspense>
  )
}