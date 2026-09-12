'use client'

import { useCallback, useEffect, useState } from 'react'
import { GraduationCap, Loader2, Mail, Pencil, Plus, CheckCircle2, AlertCircle, X, Trash2, Eye } from 'lucide-react'

/**
 * Mom's Diplomas panel.
 *
 * Jonathan, 2026-09-11: "Mom also needs a part in her admin dashboard to send diplomas to
 * people that she adds there email in case someone earns it and she needs to send it to them
 * again or one or be able to easily make and edit her own in her dashboard I want her
 * dashboard to be super simple to use super easy to understand and everything clear look
 * organized"
 *
 * So: one list, plain words, one action per row. No jargon, no nested menus. The common job
 * (send another copy) is one click and one email box.
 */

type Diploma = {
  id: string
  enrollment_id: string
  student_name: string
  graduation_date: string | null
  diploma_number: string
  format: string
  email_sent_at: string | null
  student_first_name: string
  student_last_name: string
  student_grade: string
  family_email: string
}

/**
 * The shape /api/graduation/status actually returns. Verified live 2026-09-11 — it is NOT
 * id/student_first_name/student_last_name/student_grade, and assuming so rendered every option as
 * "undefined undefined — undefined" and made the picker value the literal string "undefined".
 */
type Student = {
  enrollmentId: string
  student: string
  grade: string
  email: string
}

export default function DiplomasPage() {
  const [rows, setRows] = useState<Diploma[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')

  // per-row send state
  const [sendFor, setSendFor] = useState<string | null>(null)
  const [sendTo, setSendTo] = useState('')
  const [sending, setSending] = useState(false)

  // create / edit
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<Diploma | null>(null)
  const [form, setForm] = useState({ enrollment_id: '', student_name: '', graduation_date: '', diploma_number: '' })
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const r = await fetch('/api/admin-diplomas')
      const d = await r.json()
      if (d.ok) setRows(d.diplomas || [])
    } catch { /* leave list as-is */ } finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    // students for the "new diploma" picker
    fetch('/api/graduation/status')
      .then((r) => r.json())
      .then((d) => { if (d.ok) setStudents(d.students || []) })
      .catch(() => {})
  }, [])

  async function doSend() {
    if (!sendFor) return
    setSending(true); setErr(''); setMsg('')
    try {
      const r = await fetch('/api/admin-diplomas', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send', id: sendFor, to: sendTo }),
      })
      const d = await r.json()
      if (!d.ok) { setErr(d.error || 'Could not send.'); return }
      setMsg(`Diploma sent to ${d.sentTo} ✅`)
      setSendFor(null); setSendTo('')
      await load()
    } catch { setErr('Network error.') } finally { setSending(false) }
  }

  async function save() {
    setSaving(true); setErr(''); setMsg('')
    try {
      const payload = editing
        ? { action: 'save', id: editing.id, ...form }
        : { action: 'save', ...form }
      const r = await fetch('/api/admin-diplomas', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const d = await r.json()
      if (!d.ok) { setErr(d.error || 'Could not save.'); return }
      setMsg(editing ? 'Diploma updated ✅' : 'Diploma created ✅')
      setCreating(false); setEditing(null)
      setForm({ enrollment_id: '', student_name: '', graduation_date: '', diploma_number: '' })
      await load()
    } catch { setErr('Network error.') } finally { setSaving(false) }
  }

  async function startCreate() {
    setCreating(true); setEditing(null); setErr(''); setMsg('')
    // Ask the server for the real next number. The first version used rows.length + 1, which
    // repeats a number as soon as a diploma is deleted and can collide with hand-made records.
    let number = ''
    try {
      const r = await fetch('/api/admin-diplomas', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'nextnumber' }),
      })
      const d = await r.json()
      if (d.ok) number = d.number
    } catch { /* fall through to a blank the server will validate */ }
    setForm({ enrollment_id: '', student_name: '', graduation_date: '', diploma_number: number })
  }

  async function remove(d: Diploma) {
    if (!confirm(`Delete the diploma for ${d.student_name}? This removes the school's record of it.`)) return
    setErr(''); setMsg('')
    try {
      const r = await fetch('/api/admin-diplomas', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id: d.id }),
      })
      const j = await r.json()
      if (!j.ok) { setErr(j.error || 'Could not delete.'); return }
      setMsg(`Removed the diploma for ${d.student_name}.`)
      await load()
    } catch { setErr('Network error.') }
  }

  function startEdit(d: Diploma) {
    setEditing(d); setCreating(false); setErr(''); setMsg('')
    setForm({
      enrollment_id: d.enrollment_id,
      student_name: d.student_name,
      graduation_date: d.graduation_date || '',
      diploma_number: d.diploma_number,
    })
  }

  const field = 'w-full rounded-xl border-2 border-sky-100 bg-white px-3 py-3 text-base text-gray-900 focus:border-sky-400 focus:outline-none'

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
            <GraduationCap className="h-6 w-6 text-sky-600" /> Diplomas
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Every diploma the school has issued. Send another copy any time — just add the email.
          </p>
        </div>
        <button
          onClick={startCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-3 font-bold text-white hover:bg-sky-700"
        >
          <Plus className="h-5 w-5" /> New diploma
        </button>
      </div>

      {/* Plain words, three steps, no jargon — so the page explains itself without a phone call. */}
      <div className="mt-5 rounded-2xl border border-sky-100 bg-sky-50/70 p-4">
        <p className="text-sm font-bold text-sky-900">How this works</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          <div className="rounded-xl bg-white/80 px-3 py-2">
            <p className="text-sm font-bold text-gray-800">1. Make the diploma</p>
            <p className="text-xs text-gray-600">Tap <strong>New diploma</strong>. Pick the student from the list — you have to pick one — then check the name as it will print. Add the date and the number.</p>
          </div>
          <div className="rounded-xl bg-white/80 px-3 py-2">
            <p className="text-sm font-bold text-gray-800">2. Look at it first</p>
            <p className="text-xs text-gray-600">Tap <strong>Preview</strong> to see the exact certificate. Nothing is sent until you send it.</p>
          </div>
          <div className="rounded-xl bg-white/80 px-3 py-2">
            <p className="text-sm font-bold text-gray-800">3. Send it</p>
            <p className="text-xs text-gray-600">Tap <strong>Send</strong>, type the email, and it goes from the school email <strong>with the diploma attached</strong>.</p>
          </div>
        </div>
        <p className="mt-2 text-xs text-gray-600">
          The certificate prints at 9&nbsp;&times;&nbsp;7&nbsp;inches. Only the name and the date change from student to
          student — everything else is the same every time, so it always looks right.
        </p>
      </div>

      {msg && <p className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800"><CheckCircle2 className="h-4 w-4 shrink-0" /> {msg}</p>}
      {err && <p className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"><AlertCircle className="h-4 w-4 shrink-0" /> {err}</p>}

      {/* ===== CREATE / EDIT ===== */}
      {(creating || editing) && (
        <div className="mt-5 rounded-2xl border-2 border-sky-100 bg-sky-50/60 p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900">{editing ? 'Edit this diploma' : 'Make a diploma'}</h3>
            <button onClick={() => { setCreating(false); setEditing(null) }} className="text-gray-400 hover:text-gray-600" aria-label="Close">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {!editing && (
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-sm font-bold text-gray-800">Which student? <span className="font-normal text-gray-500">(required — pick one)</span></span>
                <select
                  value={form.enrollment_id} className={field}
                  onChange={(e) => {
                    const s = students.find((x) => x.enrollmentId === e.target.value)
                    setForm((f) => ({
                      ...f,
                      enrollment_id: e.target.value,
                      student_name: s ? s.student : f.student_name,
                    }))
                  }}
                >
                  <option value="">Choose a student…</option>
                  {students.map((s) => (
                    <option key={s.enrollmentId} value={s.enrollmentId}>
                      {s.student}{s.grade ? ` — ${s.grade}` : ''}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <label className="block">
              <span className="mb-1.5 block text-sm font-bold text-gray-800">Student name on the diploma</span>
              <input value={form.student_name} className={field} placeholder="Summer Graham"
                onChange={(e) => setForm((f) => ({ ...f, student_name: e.target.value }))} />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-bold text-gray-800">Graduation date</span>
              <input type="date" value={form.graduation_date} className={field}
                onChange={(e) => setForm((f) => ({ ...f, graduation_date: e.target.value }))} />
            </label>

            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-sm font-bold text-gray-800">Diploma number</span>
              <input value={form.diploma_number} className={field} placeholder="LCA-2027-0001"
                onChange={(e) => setForm((f) => ({ ...f, diploma_number: e.target.value }))} />
              <span className="mt-1 block text-xs text-gray-500">This is printed on the certificate. Keep it unique.</span>
            </label>
          </div>

          <button onClick={save} disabled={saving}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-6 py-3.5 text-base font-bold text-white hover:bg-sky-700 disabled:opacity-60 sm:w-auto">
            {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle2 className="h-5 w-5" />}
            {saving ? 'Saving…' : editing ? 'Save changes' : 'Create diploma'}
          </button>
        </div>
      )}

      {/* ===== THE LIST ===== */}
      {loading ? (
        <p className="mt-8 flex items-center gap-2 text-sm text-gray-500"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</p>
      ) : rows.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-sky-200 bg-white/70 p-8 text-center">
          <p className="text-gray-600">No diplomas yet.</p>
          <p className="mt-1 text-sm text-gray-500">When a student finishes 12th grade, tap &ldquo;New diploma&rdquo; to create theirs.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {rows.map((d) => (
            <div key={d.id} className="rounded-2xl border border-gray-200 bg-white/95 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-bold text-gray-900">{d.student_name}</p>
                  <p className="text-sm text-gray-500">
                    {d.diploma_number}
                    {d.graduation_date ? ` · ${new Date(d.graduation_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}` : ''}
                    {d.student_grade ? ` · was ${d.student_grade}` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${d.email_sent_at ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'}`}>
                    {d.email_sent_at ? 'Sent' : 'Not sent yet'}
                  </span>
                  <button onClick={() => { setSendFor(d.id); setSendTo(d.family_email || ''); setErr(''); setMsg('') }}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-sky-600 px-3 py-2 text-sm font-bold text-white hover:bg-sky-700">
                    <Mail className="h-4 w-4" /> Send
                  </button>
                  <button onClick={() => startEdit(d)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                    <Pencil className="h-4 w-4" /> Edit
                  </button>
                  {/* Opens the exact PDF the email attaches, so she can check it before it goes out. */}
                  <a href={`/api/admin-diplomas/preview?id=${d.id}`} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                    <Eye className="h-4 w-4" /> Preview
                  </a>
                  <button onClick={() => remove(d)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" /> Delete
                  </button>
                </div>
              </div>

              {/* inline send box — one field, one button */}
              {sendFor === d.id && (
                <div className="mt-3 flex flex-wrap items-end gap-2 rounded-xl bg-sky-50 p-3">
                  <label className="min-w-[240px] flex-1">
                    <span className="mb-1 block text-xs font-bold text-gray-700">Send this diploma to:</span>
                    <input
                      type="email" value={sendTo} placeholder="parent@email.com"
                      className="w-full rounded-lg border-2 border-sky-200 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-sky-400 focus:outline-none"
                      onChange={(e) => setSendTo(e.target.value)}
                    />
                  </label>
                  <button onClick={doSend} disabled={sending}
                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-60">
                    {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                    {sending ? 'Sending…' : 'Send now'}
                  </button>
                  <button onClick={() => setSendFor(null)} className="rounded-lg px-3 py-2.5 text-sm font-semibold text-gray-500 hover:text-gray-800">
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
