'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import {
  FileText, AlertTriangle, Link2, CheckCircle, Clock, Inbox, Send, BarChart3,
} from 'lucide-react'

export type RecordRequest = {
  id: string
  direction: string
  status: string
  enrollment_id: string | null
  linked_at: string | null
  linked_by: string | null
  student_first_name: string | null
  student_last_name: string | null
  student_dob: string | null
  student_grade: string | null
  requester_type: string | null
  requester_name: string | null
  requester_email: string | null
  requester_phone: string | null
  requester_org: string | null
  requester_address: string | null
  records_requested: string[] | null
  other_records: string | null
  delivery_method: string | null
  delivery_detail: string | null
  reason: string | null
  authorization_name: string | null
  authorized_at: string | null
  notes: string | null
  staff_notes: string | null
  fulfilled_at: string | null
  fulfilled_by: string | null
  created_at: string
}

export type StudentOption = {
  id: string
  student_first_name: string | null
  student_last_name: string | null
  student_grade: string | null
  student_dob: string | null
  email: string | null
}

const STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
  new:         { label: 'New',         color: 'text-amber-700',   bg: 'bg-amber-500' },
  in_progress: { label: 'In progress', color: 'text-sky-700',     bg: 'bg-sky-500' },
  sent:        { label: 'Sent',        color: 'text-indigo-700',  bg: 'bg-indigo-500' },
  received:    { label: 'Received',    color: 'text-purple-700',  bg: 'bg-purple-500' },
  completed:   { label: 'Completed',   color: 'text-emerald-700', bg: 'bg-emerald-500' },
  denied:      { label: 'Denied',      color: 'text-red-700',     bg: 'bg-red-500' },
}
const STATUS_ORDER = ['new', 'in_progress', 'sent', 'received', 'completed', 'denied']

const RECORD_LABELS: Record<string, string> = {
  academic_transcript: 'Academic transcript',
  report_cards: 'Report cards',
  immunization: 'Immunization records',
  attendance: 'Attendance records',
  diploma: 'Diploma / graduation',
  enrollment_verification: 'Enrollment verification',
}

const fmtDate = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }) : '—'

const daysBetween = (a: string, b: string) =>
  Math.max(0, (new Date(b).getTime() - new Date(a).getTime()) / 86400000)

/** Horizontal bar list — the clearest way to show "which of these is biggest". */
function BarList({ rows, empty }: { rows: { label: string; value: number; color?: string }[]; empty: string }) {
  const max = Math.max(1, ...rows.map((r) => r.value))
  if (!rows.length || rows.every((r) => r.value === 0)) {
    return <p className="py-6 text-center text-sm text-gray-400">{empty}</p>
  }
  return (
    <div className="space-y-3">
      {rows.map((r) => (
        <div key={r.label}>
          <div className="mb-1 flex items-baseline justify-between gap-3">
            <span className="truncate text-sm text-gray-700">{r.label}</span>
            <span className="shrink-0 text-sm font-semibold text-gray-900">{r.value}</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className={`h-full rounded-full ${r.color || 'bg-emerald-500'}`}
              style={{ width: `${Math.round((r.value / max) * 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

/** Simple column chart for volume over time, drawn with plain divs (no chart dependency). */
function MonthColumns({ rows }: { rows: { label: string; value: number }[] }) {
  const max = Math.max(1, ...rows.map((r) => r.value))
  return (
    <div className="flex h-40 items-end justify-between gap-2">
      {rows.map((r) => (
        <div key={r.label} className="flex flex-1 flex-col items-center gap-2">
          <span className="text-xs font-semibold text-gray-700">{r.value || ''}</span>
          <div
            className={`w-full rounded-t-lg ${r.value ? 'bg-emerald-500' : 'bg-gray-100'}`}
            style={{ height: `${Math.max(r.value ? 6 : 2, (r.value / max) * 100)}%` }}
            title={`${r.label}: ${r.value}`}
          />
          <span className="text-[11px] text-gray-500">{r.label}</span>
        </div>
      ))}
    </div>
  )
}

function Stat({ icon, label, value, hint, tone = 'gray' }: {
  icon: React.ReactNode; label: string; value: string | number; hint?: string; tone?: string
}) {
  const tones: Record<string, string> = {
    gray: 'text-gray-900', amber: 'text-amber-600', emerald: 'text-emerald-600',
    sky: 'text-sky-600', red: 'text-red-600',
  }
  return (
    <Card>
      <CardContent className="pt-5">
        <div className="flex items-center gap-2 text-sm text-gray-500">{icon}{label}</div>
        <div className={`mt-2 text-3xl font-bold ${tones[tone] || tones.gray}`}>{value}</div>
        {hint && <div className="mt-1 text-xs text-gray-400">{hint}</div>}
      </CardContent>
    </Card>
  )
}

export default function RecordsRequestsView({
  initialRequests, students,
}: { initialRequests: RecordRequest[]; students: StudentOption[] }) {
  const [requests, setRequests] = useState(initialRequests)
  const [filter, setFilter] = useState('all')
  const [busy, setBusy] = useState<string | null>(null)
  const [openId, setOpenId] = useState<string | null>(null)
  const [noteDraft, setNoteDraft] = useState('')

  const studentLabel = (id: string | null) => {
    if (!id) return null
    const s = students.find((x) => x.id === id)
    return s ? `${s.student_first_name ?? ''} ${s.student_last_name ?? ''}`.trim() : null
  }

  // ── the numbers and the charts ─────────────────────────────────────────────
  const stats = useMemo(() => {
    const open = requests.filter((r) => r.status === 'new' || r.status === 'in_progress').length
    const done = requests.filter((r) => r.status === 'completed' || r.status === 'sent').length
    const unlinked = requests.filter((r) => !r.enrollment_id).length
    const fulfilled = requests.filter((r) => r.fulfilled_at)
    const avgDays = fulfilled.length
      ? fulfilled.reduce((sum, r) => sum + daysBetween(r.created_at, r.fulfilled_at as string), 0) / fulfilled.length
      : 0
    return { total: requests.length, open, done, unlinked, avgDays }
  }, [requests])

  const byStatus = useMemo(
    () => STATUS_ORDER.map((s) => ({
      label: STATUS_META[s].label,
      value: requests.filter((r) => r.status === s).length,
      color: STATUS_META[s].bg,
    })),
    [requests]
  )

  const byRecordType = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const r of requests) for (const t of r.records_requested || []) counts[t] = (counts[t] || 0) + 1
    return Object.entries(counts)
      .map(([k, v]) => ({ label: RECORD_LABELS[k] || k, value: v, color: 'bg-indigo-500' }))
      .sort((a, b) => b.value - a.value)
  }, [requests])

  const byMonth = useMemo(() => {
    const out: { label: string; value: number }[] = []
    const now = new Date()
    for (let i = 5; i >= 0; i--) {
      const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1))
      const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
      out.push({
        label: d.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' }),
        value: requests.filter((r) => String(r.created_at).slice(0, 7) === key).length,
      })
    }
    return out
  }, [requests])

  const visible = filter === 'all'
    ? requests
    : filter === 'unlinked'
      ? requests.filter((r) => !r.enrollment_id)
      : requests.filter((r) => r.status === filter)

  // ── actions ───────────────────────────────────────────────────────────────
  async function patch(id: string, body: Record<string, unknown>) {
    setBusy(id)
    try {
      const res = await fetch('/api/admin-record-requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...body }),
      })
      if (!res.ok) throw new Error('update failed')
      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, ...body } as RecordRequest : r)))
    } catch {
      alert('Could not save that change. Please try again.')
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
          <FileText className="h-5 w-5 text-emerald-600" /> Student Records Requests
        </h2>
        <p className="text-sm text-gray-500">
          Records in and out, each tied to the right child. 🔒 Visible to school admins only.
        </p>
      </div>

      {/* ── unlinked warning — the one thing that needs attention ─────────── */}
      {stats.unlinked > 0 && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div>
            <p className="text-sm font-semibold text-amber-800">
              {stats.unlinked} request{stats.unlinked === 1 ? '' : 's'} not linked to a student yet
            </p>
            <p className="mt-1 text-sm text-amber-700">
              We couldn’t match {stats.unlinked === 1 ? 'it' : 'them'} to a child on file automatically.
              Open the request and pick the student so it sits on the right file.
            </p>
            <button
              onClick={() => setFilter('unlinked')}
              className="mt-2 text-sm font-medium text-amber-800 underline"
            >
              Show just those →
            </button>
          </div>
        </div>
      )}

      {/* ── headline numbers ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat icon={<Inbox className="h-4 w-4" />} label="Total requests" value={stats.total} />
        <Stat icon={<Clock className="h-4 w-4" />} label="Still open" value={stats.open} tone="amber" hint="New + in progress" />
        <Stat icon={<CheckCircle className="h-4 w-4" />} label="Fulfilled" value={stats.done} tone="emerald" />
        <Stat
          icon={<BarChart3 className="h-4 w-4" />}
          label="Avg. turnaround"
          value={stats.avgDays ? `${stats.avgDays.toFixed(1)}d` : '—'}
          tone="sky"
          hint="Request → fulfilled"
        />
      </div>

      {/* ── charts ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Requests over time</CardTitle></CardHeader>
          <CardContent><MonthColumns rows={byMonth} /></CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Where they stand</CardTitle></CardHeader>
          <CardContent><BarList rows={byStatus} empty="No requests yet." /></CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>What gets requested most</CardTitle></CardHeader>
          <CardContent><BarList rows={byRecordType} empty="No record types requested yet." /></CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Direction</CardTitle></CardHeader>
          <CardContent>
            <BarList
              rows={[
                { label: 'Incoming (requested from us)', value: requests.filter((r) => r.direction === 'incoming').length, color: 'bg-emerald-500' },
                { label: 'Outgoing (we requested)', value: requests.filter((r) => r.direction === 'outgoing').length, color: 'bg-sky-500' },
              ]}
              empty="Nothing yet."
            />
          </CardContent>
        </Card>
      </div>

      {/* ── filters ───────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2">
        {[['all', `All (${requests.length})`],
          ['new', `New (${requests.filter((r) => r.status === 'new').length})`],
          ['in_progress', `In progress (${requests.filter((r) => r.status === 'in_progress').length})`],
          ['completed', `Completed (${requests.filter((r) => r.status === 'completed').length})`],
          ['unlinked', `⚠ Not linked (${stats.unlinked})`]].map(([val, label]) => (
          <button
            key={val}
            onClick={() => setFilter(val)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              filter === val
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── the requests ──────────────────────────────────────────────────── */}
      {visible.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-gray-400">
            No requests here yet. When a parent or another school submits the records form, it shows up in this list.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {visible.map((r) => {
            const meta = STATUS_META[r.status] || STATUS_META.new
            const student = `${r.student_first_name ?? ''} ${r.student_last_name ?? ''}`.trim()
            const linked = studentLabel(r.enrollment_id)
            const isOpen = openId === r.id
            return (
              <Card key={r.id}>
                <CardContent className="pt-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-base font-semibold text-gray-900">{student || 'Unnamed student'}</span>
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${meta.color} bg-gray-50`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${meta.bg}`} />
                          {meta.label}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                          {r.direction === 'outgoing' ? <><Send className="h-3 w-3" /> Outgoing</> : <><Inbox className="h-3 w-3" /> Incoming</>}
                        </span>
                        {!r.enrollment_id && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                            <AlertTriangle className="h-3 w-3" /> Not linked
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-sm text-gray-600">
                        {r.requester_name || '—'}
                        {r.requester_org ? ` · ${r.requester_org}` : ''} · {r.requester_email || '—'}
                        {r.requester_phone ? ` · ${r.requester_phone}` : ''}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        Submitted {fmtDate(r.created_at)}
                        {r.student_dob ? ` · DOB ${fmtDate(r.student_dob)}` : ''}
                        {r.student_grade ? ` · ${r.student_grade}` : ''}
                        {linked ? ` · ✅ linked to ${linked}` : ''}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Select
                        aria-label="Status"
                        value={r.status}
                        disabled={busy === r.id}
                        onChange={(e) => patch(r.id, { status: e.target.value })}
                        options={STATUS_ORDER.map((s) => ({ value: s, label: STATUS_META[s].label }))}
                        className="w-40"
                      />
                      <Button variant="outline" size="sm" onClick={() => { setOpenId(isOpen ? null : r.id); setNoteDraft(r.staff_notes || '') }}>
                        {isOpen ? 'Close' : 'Details'}
                      </Button>
                    </div>
                  </div>

                  {/* what they asked for */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {(r.records_requested || []).map((t) => (
                      <span key={t} className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
                        {RECORD_LABELS[t] || t}
                      </span>
                    ))}
                    {r.other_records && (
                      <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{r.other_records}</span>
                    )}
                  </div>

                  {isOpen && (
                    <div className="mt-5 space-y-4 border-t border-gray-100 pt-5">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <Select
                            id={`link_${r.id}`}
                            label="Link to the right student"
                            value={r.enrollment_id || ''}
                            options={[{ value: '', label: '— Not linked —' }].concat(
                              students.map((s) => ({
                                value: s.id,
                                label: `${s.student_first_name ?? ''} ${s.student_last_name ?? ''}`.trim() +
                                  (s.student_grade ? ` (${s.student_grade})` : '') +
                                  (s.email ? ` — ${s.email}` : '')
                              }))
                            )}
                            onChange={(e) => patch(r.id, { enrollment_id: e.target.value || null })}
                          />
                        </div>
                        <div>
                          <Select
                            id={`del_${r.id}`}
                            label="How to deliver"
                            value={r.delivery_method || 'email'}
                            options={[
                              { value: 'email', label: 'Email' },
                              { value: 'mail', label: 'Postal mail' },
                              { value: 'pickup', label: 'Pick up in person' },
                            ]}
                            onChange={(e) => patch(r.id, { delivery_method: e.target.value })}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Send to</label>
                        <Input
                          value={r.delivery_detail || ''}
                          placeholder={r.delivery_method === 'email' ? (r.requester_email || 'email address') : 'address or pickup note'}
                          onChange={(e) => setRequests((prev) => prev.map((x) => x.id === r.id ? { ...x, delivery_detail: e.target.value } : x))}
                          onBlur={(e) => patch(r.id, { delivery_detail: e.target.value })}
                        />
                      </div>

                      {r.reason && (
                        <p className="text-sm text-gray-600"><span className="font-medium">Reason given:</span> {r.reason}</p>
                      )}
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Authorized by:</span> {r.authorization_name || '—'}
                        {r.authorized_at ? ` on ${fmtDate(r.authorized_at)}` : ''}
                      </p>

                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Office notes</label>
                        <textarea
                          value={noteDraft}
                          onChange={(e) => setNoteDraft(e.target.value)}
                          rows={3}
                          placeholder="e.g. transcript printed, mailed 9/12"
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <Button
                          size="sm"
                          className="mt-2"
                          disabled={busy === r.id}
                          onClick={() => patch(r.id, { staff_notes: noteDraft })}
                        >
                          Save note
                        </Button>
                      </div>

                      {r.fulfilled_at && (
                        <p className="flex items-center gap-1.5 text-xs text-emerald-700">
                          <Link2 className="h-3 w-3" /> Fulfilled {fmtDate(r.fulfilled_at)} by {r.fulfilled_by || 'an admin'}
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
