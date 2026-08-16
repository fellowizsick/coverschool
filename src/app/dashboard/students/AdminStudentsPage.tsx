'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import {
  GraduationCap, Search, ChevronDown, ChevronUp,
  Mail, MapPin, User, BookOpen, CheckCircle,
  Clock, AlertCircle, FileText, Download
} from 'lucide-react'

type Enrollment = {
  id: string
  student_first_name: string
  student_last_name: string
  parent_first_name: string
  parent_last_name: string
  student_grade: string
  state: string
  city: string
  status: string
  payment_status: string
  email: string
  phone?: string
  created_at: string
}

type ProgressRow = {
  enrollment_id: string
  completed_steps: number[]
  updated_at: string
}

type ChurchFormRow = {
  id: string
  enrollment_id: string | null
  student_name: string
  church_form_status: string
  school_year: string
  parent_signature: string
  created_at: string
}

// Calculate total steps from grade
function getTotalSteps(grade: string): number {
  const base = grade === 'Kindergarten' ? 24 : grade.startsWith('1') || grade.startsWith('2') || grade.startsWith('3') ? 72 : 96
  return base
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    approved: 'bg-emerald-100 text-emerald-700',
    pending: 'bg-amber-100 text-amber-700',
    rejected: 'bg-red-100 text-red-700',
    cancelled: 'bg-gray-100 text-gray-500',
  }
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  )
}

function ProgressBar({ completed, total }: { completed: number; total: number }) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
      <span className="text-xs text-gray-500 w-12 text-right">{completed}/{total}</span>
    </div>
  )
}

export default function AdminStudentsPage({
  enrollments: initialEnrollments,
  churchFormsByEnrollment = {},
}: {
  enrollments: Enrollment[]
  churchFormsByEnrollment?: Record<string, ChurchFormRow>
}) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return initialEnrollments.filter((e) => {
      // Text search
      if (search) {
        const q = search.toLowerCase()
        const fullName = `${e.student_first_name} ${e.student_last_name}`.toLowerCase()
        const parentName = `${e.parent_first_name} ${e.parent_last_name}`.toLowerCase()
        if (
          !fullName.includes(q) &&
          !parentName.includes(q) &&
          !e.email.toLowerCase().includes(q) &&
          !e.student_grade.toLowerCase().includes(q) &&
          !e.state.toLowerCase().includes(q) &&
          !e.city.toLowerCase().includes(q)
        ) return false
      }
      // Status filter
      if (statusFilter !== 'all' && e.status !== statusFilter) return false
      return true
    })
  }, [initialEnrollments, search, statusFilter])

  const stats = useMemo(() => ({
    total: initialEnrollments.length,
    approved: initialEnrollments.filter(e => e.status === 'approved').length,
    pending: initialEnrollments.filter(e => e.status === 'pending').length,
    unpaid: initialEnrollments.filter(e => e.payment_status === 'unpaid').length,
  }), [initialEnrollments])

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-emerald-200 bg-emerald-50/30">
          <CardContent className="p-4 flex items-center gap-3">
            <GraduationCap className="h-8 w-8 text-emerald-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-xs text-gray-500">Total Students</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-emerald-200 bg-emerald-50/30">
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-emerald-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
              <p className="text-xs text-gray-500">Approved</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-amber-200 bg-amber-50/30">
          <CardContent className="p-4 flex items-center gap-3">
            <Clock className="h-8 w-8 text-amber-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              <p className="text-xs text-gray-500">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50/30">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertCircle className="h-8 w-8 text-red-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.unpaid}</p>
              <p className="text-xs text-gray-500">Unpaid</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by student name, parent, email, grade, or state..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {filtered.length} of {initialEnrollments.length} students
            {search && ` matching "${search}"`}
          </p>
        </CardContent>
      </Card>

      {/* Student List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Search className="mx-auto h-8 w-8 text-gray-300" />
              <p className="mt-3 text-sm text-gray-500">No students found</p>
            </CardContent>
          </Card>
        ) : (
          filtered.map((e) => (
            <Card
              key={e.id}
              className={`hover:shadow-md transition-all cursor-pointer ${
                expandedId === e.id ? 'ring-2 ring-emerald-400' : ''
              }`}
              onClick={() => setExpandedId(expandedId === e.id ? null : e.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {e.student_first_name[0]}{e.student_last_name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {e.student_first_name} {e.student_last_name}
                        </h3>
                        <StatusBadge status={e.status} />
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <GraduationCap className="h-3 w-3" /> {e.student_grade}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" /> {e.parent_first_name} {e.parent_last_name}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {e.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {e.city}, {e.state}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      e.payment_status === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                      e.payment_status === 'unpaid' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {e.payment_status || 'unknown'}
                    </span>
                    {expandedId === e.id ? (
                      <ChevronUp className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Student Details */}
                {expandedId === e.id && (
                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
                    {/* Progress Section */}
                    <div>
                      <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <BookOpen className="h-3.5 w-3.5 text-emerald-500" />
                        Curriculum Progress
                      </h4>
                      <ProgressBar completed={0} total={getTotalSteps(e.student_grade)} />
                      <p className="text-xs text-gray-400 mt-1">Last activity: —</p>
                    </div>

                    {/* Student Files */}
                    <div>
                      <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <FileText className="h-3.5 w-3.5 text-emerald-500" />
                        Student Files & Records
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        <a
                          href={`/print/enrollment/${e.id}?print=1`}
                          target="_blank"
                          className="block p-3 rounded-xl bg-gray-50 border border-gray-100 text-center hover:bg-emerald-50 hover:border-emerald-200 transition-colors cursor-pointer"
                        >
                          <FileText className="h-4 w-4 text-emerald-600 mx-auto mb-1" />
                          <p className="text-xs text-gray-600">📄 Enrollment Form</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">Click to print</p>
                        </a>
                        <a
                          href={`/print/report-card/${e.id}?print=1`}
                          target="_blank"
                          className="block p-3 rounded-xl bg-gray-50 border border-gray-100 text-center hover:bg-emerald-50 hover:border-emerald-200 transition-colors cursor-pointer"
                        >
                          <FileText className="h-4 w-4 text-emerald-600 mx-auto mb-1" />
                          <p className="text-xs text-gray-600">📊 Report Card</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">Click to print</p>
                        </a>
                        <a
                          href={`/print/transcript/${e.id}?print=1`}
                          target="_blank"
                          className="block p-3 rounded-xl bg-gray-50 border border-gray-100 text-center hover:bg-emerald-50 hover:border-emerald-200 transition-colors cursor-pointer"
                        >
                          <FileText className="h-4 w-4 text-emerald-600 mx-auto mb-1" />
                          <p className="text-xs text-gray-600">🎓 Transcript</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">Click to print</p>
                        </a>
                        {/* 📋 Church Enrollment Form — per student, view/print + PDF (admin only) */}
                        {(() => {
                          const cf = churchFormsByEnrollment?.[e.id]
                          return cf ? (
                            <a
                              href={`/enroll/church-form/${cf.id}`}
                              target="_blank"
                              className="block p-3 rounded-xl bg-gray-50 border border-gray-100 text-center hover:bg-emerald-50 hover:border-emerald-200 transition-colors cursor-pointer"
                            >
                              <FileText className="h-4 w-4 text-amber-600 mx-auto mb-1" />
                              <p className="text-xs text-gray-600">📋 Church Enrollment Form</p>
                              <p className="text-[10px] text-gray-400 mt-0.5">
                                Click to view / print · {new Date(cf.created_at).toLocaleDateString()}
                              </p>
                            </a>
                          ) : (
                            <div className="block p-3 rounded-xl bg-amber-50/60 border border-amber-100 text-center">
                              <FileText className="h-4 w-4 text-amber-400 mx-auto mb-1" />
                              <p className="text-xs text-gray-600">📋 Church Enrollment Form</p>
                              <p className="text-[10px] text-amber-600 mt-0.5">⚠️ Not submitted</p>
                            </div>
                          )
                        })()}
                      </div>
                    </div>

                    {/* Enrollment Info */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs text-gray-500">
                      <div>
                        <span className="block text-gray-400 font-medium">Enrolled</span>
                        {new Date(e.created_at).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="block text-gray-400 font-medium">Grade</span>
                        {e.student_grade}
                      </div>
                      <div>
                        <span className="block text-gray-400 font-medium">Status</span>
                        {e.status}
                      </div>
                      <div>
                        <span className="block text-gray-400 font-medium">Payment</span>
                        {e.payment_status || 'N/A'}
                      </div>
                      <div>
                        <span className="block text-gray-400 font-medium">Church Form</span>
                        {churchFormsByEnrollment?.[e.id] ? (
                          <span className="text-emerald-600 font-medium">✓ Submitted</span>
                        ) : (
                          <span className="text-amber-600 font-medium">⚠️ Pending</span>
                        )}
                      </div>
                    </div>

                    {/* Full profile (includes the full church form card) */}
                    <div className="pt-1">
                      <Link
                        href={`/dashboard/student/${e.id}`}
                        className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                      >
                        View Full Profile →
                      </Link>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
