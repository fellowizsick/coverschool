'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import {
  GraduationCap, Search, ChevronDown, ChevronUp,
  Mail, MapPin, User, BookOpen, CheckCircle,
  Clock, AlertCircle, FileText, Download, Pencil,
  CalendarDays, AlertTriangle
} from 'lucide-react'
import { hasPaid, isUnpaid } from '@/lib/enrollment-status'
import PaidToggle from '@/components/PaidToggle'
import EditStudentPanel, { type EditableStudent } from '@/components/EditStudentPanel'

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
  payment_method?: string | null
  email: string
  phone?: string
  created_at: string
  // Was missing, so the roster could not show it even though `select('*')` fetches it.
  // Mom's whole reason for coming here is to fix/add birthdays — she has to be able to
  // SEE which ones are wrong without opening every row.
  student_dob?: string | null
}

/**
 * How a student's date of birth looks to an admin.
 *
 * 'missing'  - no birthday on file.
 * 'wrong'    - looks like a placeholder rather than a real birthday. Cash enrollments taken
 *              before the form got real <label>s captured TODAY'S date as the DOB, so those
 *              rows hold the enrollment date. A school-age child cannot be under 3, and a
 *              birthday that equals the enrollment date is the signature of that bug.
 */
function dobStatus(e: Enrollment): 'ok' | 'missing' | 'wrong' {
  const raw = (e.student_dob ?? '').slice(0, 10)
  if (!raw) return 'missing'
  const d = new Date(raw + 'T00:00:00')
  if (isNaN(d.getTime())) return 'wrong'
  // birthday identical to the day they enrolled => almost certainly the old placeholder
  const created = (e.created_at ?? '').slice(0, 10)
  if (created && raw === created) return 'wrong'
  const now = new Date()
  let age = now.getFullYear() - d.getFullYear()
  const m = now.getMonth() - d.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--
  if (age < 3 || age > 100 || d > now) return 'wrong'
  return 'ok'
}

/** Show a plain, readable birthday (never a raw ISO string). */
function prettyDob(raw?: string | null): string {
  const s = (raw ?? '').slice(0, 10)
  if (!s) return '—'
  const d = new Date(s + 'T00:00:00')
  if (isNaN(d.getTime())) return s
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
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
  // Local copy so the PAID toggle updates a row instantly without a full reload.
  const [enrollments, setEnrollments] = useState<Enrollment[]>(initialEnrollments)
  // Which student's edit panel is open (null = closed)
  const [editing, setEditing] = useState<EditableStudent | null>(null)
  // Paid / not-paid view. The roster now includes EVERY enrollment (Jonathan, 2026-09-11), so
  // this lets Mom narrow to one group without the other disappearing from the page entirely.
  const [payFilter, setPayFilter] = useState<'all' | 'paid' | 'unpaid'>('all')
  // Which enrollments we just emailed the church form to, and any error, so the button can
  // report honestly instead of silently doing nothing.
  const [formSending, setFormSending] = useState<string | null>(null)
  const [formDone, setFormDone] = useState<Record<string, string>>({})
  const [formErr, setFormErr] = useState<Record<string, string>>({})

  /** Email this family their Church / Home School Enrollment Form link. */
  async function sendChurchForm(enrollmentId: string) {
    setFormSending(enrollmentId)
    setFormErr((p) => { const n = { ...p }; delete n[enrollmentId]; return n })
    try {
      const res = await fetch('/api/admin-send-church-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enrollmentId }),
      })
      const data = await res.json()
      if (data?.sent?.length) {
        setFormDone((p) => ({ ...p, [enrollmentId]: 'Sent ✓' }))
      } else {
        // Most common real case: no parent email on file. Fall back to the link so Mom can
        // text it instead — she should never be left with a dead end.
        const why = data?.failed?.[0]?.reason || data?.error || 'could not send'
        setFormErr((p) => ({ ...p, [enrollmentId]: why }))
        if (data?.link) {
          try { await navigator.clipboard.writeText(data.link) } catch { /* clipboard blocked */ }
        }
      }
    } catch (err) {
      setFormErr((p) => ({ ...p, [enrollmentId]: err instanceof Error ? err.message : 'failed' }))
    } finally {
      setFormSending(null)
    }
  }

  const filtered = useMemo(() => {
    return enrollments.filter((e) => {
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
      // Payment filter — hasPaid() counts card ('paid') AND cash ('cash').
      if (payFilter === 'paid' && !hasPaid(e.payment_status)) return false
      if (payFilter === 'unpaid' && hasPaid(e.payment_status)) return false
      return true
    })
  }, [enrollments, search, statusFilter, payFilter])

  const stats = useMemo(() => ({
    total: initialEnrollments.length,
    approved: initialEnrollments.filter(e => e.status === 'approved').length,
    pending: initialEnrollments.filter(e => e.status === 'pending').length,
    // BUG FIX (2026-09-11): this read payment_status === 'unpaid'. That value is ILLEGAL —
    // the DB check constraint allows only pending | paid | refunded | cancelled | cash — so
    // the tile was permanently 0. "Not paid" means 'pending'. Use the shared helper so this
    // can never drift again (same class of bug as the roster hiding every cash student).
    unpaid: initialEnrollments.filter(e => isUnpaid(e.payment_status)).length,
  }), [initialEnrollments])

  // How many students are missing a usable birthday. Drives the amber banner so Mom can see
  // there is work waiting without reading every row.
  const needsDobCount = useMemo(
    () => enrollments.filter((e) => dobStatus(e) !== 'ok').length,
    [enrollments]
  )

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
              value={payFilter}
              onChange={(e) => setPayFilter(e.target.value as 'all' | 'paid' | 'unpaid')}
              className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">Paid &amp; not paid</option>
              <option value="paid">Paid only</option>
              <option value="unpaid">Not paid yet</option>
            </select>
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

          {/* Plain-language help. Mom went looking for "how do I edit a student / add their
              date" and could not find it, so the page now says it outright instead of
              relying on her recognising a pencil icon. */}
          <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-900">
            <Pencil className="h-3.5 w-3.5 shrink-0" />
            <span>
              To change any student&apos;s information — including their{' '}
              <strong>date of birth</strong> — click the{' '}
              <strong>Edit</strong> button on their row.
            </span>
            {needsDobCount > 0 && (
              <span className="ml-auto flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 font-semibold text-amber-800">
                <AlertTriangle className="h-3 w-3" />
                {needsDobCount} student{needsDobCount === 1 ? '' : 's'} need a birthday
              </span>
            )}
          </div>
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
                        {/* Birthday right on the row: Mom needs to see at a glance whose date
                            is missing or wrong, not open every student to find out. */}
                        {(() => {
                          const s = dobStatus(e)
                          if (s === 'ok') {
                            return (
                              <span className="flex items-center gap-1" title="Date of birth">
                                <CalendarDays className="h-3 w-3" /> {prettyDob(e.student_dob)}
                              </span>
                            )
                          }
                          if (s === 'missing') {
                            return (
                              <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 font-semibold text-amber-800">
                                <AlertTriangle className="h-3 w-3" /> No birthday on file
                              </span>
                            )
                          }
                          return (
                            <span
                              className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 font-semibold text-red-700"
                              title={`Saved as ${prettyDob(e.student_dob)} — looks like a placeholder, not a real birthday`}
                            >
                              <AlertTriangle className="h-3 w-3" /> Birthday looks wrong
                              ({prettyDob(e.student_dob)})
                            </span>
                          )
                        })()}
                        {/* Missing church form, right on the row. It is the legal paperwork for
                            an Alabama church-school enrollment, and it used to be visible only
                            inside the expanded detail — so nobody noticed 4 of 5 families had
                            none. (2026-09-11) */}
                        {!churchFormsByEnrollment?.[e.id] && (
                          <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 font-semibold text-amber-800">
                            <FileText className="h-3 w-3" /> Church form needed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Clicking the pill flips PAID / NOT PAID — stopPropagation so it doesn't
                      also expand/collapse the row underneath. */}
                  <div className="flex items-center gap-2" onClick={(ev) => ev.stopPropagation()}>
                    <PaidToggle
                      enrollmentId={e.id}
                      paid={hasPaid(e.payment_status)}
                      paymentMethod={e.payment_method}
                      size="sm"
                      onChanged={(nowPaid) =>
                        setEnrollments((prev) =>
                          prev.map((x) =>
                            x.id === e.id
                              ? {
                                  ...x,
                                  payment_status: nowPaid ? 'cash' : 'pending',
                                  payment_method: nowPaid ? 'cash' : x.payment_method,
                                }
                              : x
                          )
                        )
                      }
                    />
                    {/* Correct the student's details (name, birthday, grade, contact…).
                        KNOWN PROBLEM this fixes (2026-09-11): this used to be a bare 16px
                        grey pencil icon (text-gray-400) with no label, so Mom could not find
                        how to edit a student at all — she said so directly. A tooltip was the
                        only hint, and tooltips need hovering (useless on a touchscreen).
                        Now: a real labelled button in a visible colour, and it spells out
                        that you can fix the birthday here. */}
                    <button
                      type="button"
                      onClick={() => setEditing(e as EditableStudent)}
                      title="Edit this student's details, including their date of birth"
                      aria-label={`Edit ${e.student_first_name} ${e.student_last_name}`}
                      className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                        dobStatus(e) === 'ok'
                          ? 'border-gray-300 text-gray-700 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700'
                          : 'border-emerald-500 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                      }`}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      {dobStatus(e) === 'ok' ? 'Edit' : 'Edit / add birthday'}
                    </button>
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
                      {/* The form is what makes the enrollment legal in Alabama, and it used to
                          only be handed out IN FLOW on the website — so cash families (entered
                          here) never saw it at all. 4 of 5 enrollments had none. Send it from
                          right here, one click. (2026-09-11) */}
                      {!churchFormsByEnrollment?.[e.id] && (
                        <div className="flex items-center gap-2">
                          {formDone[e.id] ? (
                            <span className="text-xs font-semibold text-emerald-600">
                              {formDone[e.id]}
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={(ev) => { ev.stopPropagation(); sendChurchForm(e.id) }}
                              disabled={formSending === e.id}
                              title="Email this family their Church / Home School Enrollment Form"
                              className="inline-flex items-center gap-1.5 rounded-lg border border-amber-400 bg-amber-50 px-2.5 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-100 disabled:opacity-60"
                            >
                              <Mail className="h-3.5 w-3.5" />
                              {formSending === e.id ? 'Sending…' : 'Send form'}
                            </button>
                          )}
                          {formErr[e.id] && (
                            <span className="text-xs text-red-600">
                              {formErr[e.id] === 'no parent email on file'
                                ? 'No email — link copied to clipboard'
                                : formErr[e.id]}
                            </span>
                          )}
                        </div>
                      )}
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

      {/* Correct a student's details (name, birthday, grade, contacts…). */}
      {editing && (
        <EditStudentPanel
          student={editing}
          onClose={() => setEditing(null)}
          onSaved={(updated) => {
            // Copy the fields the roster actually renders, one by one.
            // Spreading `{...x, ...updated}` widened the row's types (the panel's
            // EditableStudent allows `student_grade: string | null` where the roster
            // requires a non-null string), which tsc rejected. Being explicit keeps the
            // row type honest and makes it obvious what a save can change here.
            setEnrollments((prev) =>
              prev.map((x) => {
                if (x.id !== editing.id) return x
                const str = (v: string | null | undefined, fallback: string) =>
                  typeof v === 'string' && v.length > 0 ? v : fallback
                return {
                  ...x,
                  student_first_name: str(updated.student_first_name, x.student_first_name),
                  student_last_name: str(updated.student_last_name, x.student_last_name),
                  student_grade: str(updated.student_grade, x.student_grade),
                  parent_first_name: str(updated.parent_first_name, x.parent_first_name),
                  parent_last_name: str(updated.parent_last_name, x.parent_last_name),
                  email: str(updated.email, x.email),
                  phone: str(updated.phone, x.phone ?? ''),
                  city: str(updated.city, x.city),
                  state: str(updated.state, x.state),
                  // the one Mom actually came here for
                  student_dob: updated.student_dob ?? x.student_dob ?? null,
                }
              })
            )
          }}
        />
      )}
    </div>
  )
}
