'use client'

import { useEffect, useState } from 'react'

type Student = {
  enrollmentId: string
  student: string
  grade: string
  email: string
  enrollStatus: string
  paymentStatus: string
  graduationStatus: string
  graduationDate: string | null
  earned: number
  totalRequired: number
  met: boolean
}

type Credit = {
  id: string
  subject: string
  course_name: string
  credits: number
  source: string
  verification_status: string
  earned_date: string | null
  notes: string | null
}

type Req = { id: string; subject: string; required_credits: number; display_order: number; active: boolean }

export default function GraduationPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [totalRequired, setTotalRequired] = useState(0)
  const [ready, setReady] = useState(0)
  const [graduated, setGraduated] = useState(0)
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Student | null>(null)
  const [ledger, setLedger] = useState<Credit[]>([])
  const [reqs, setReqs] = useState<Req[]>([])
  const [msg, setMsg] = useState('')

  async function load() {
    setLoading(true)
    const r = await fetch('/api/graduation/status')
    const d = await r.json()
    if (d.ok) {
      setStudents(d.students || [])
      setTotalRequired(d.totalRequired)
      setReady(d.ready)
      setGraduated(d.graduated)
    }
    const rr = await fetch('/api/graduation/requirements')
    const rd = await rr.json()
    if (rd.ok) setReqs(rd.requirements || [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  async function openStudent(s: Student) {
    setSelected(s)
    setMsg('')
    const r = await fetch(`/api/graduation/status?enrollment_id=${s.enrollmentId}`)
    const d = await r.json()
    if (d.ok) setLedger(d.ledger || [])
  }

  async function attest(id: string) {
    if (!confirm('Confirm graduation and issue diploma? This is a permanent record.')) return
    setMsg('Attesting…')
    const r = await fetch('/api/graduation/attest', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ enrollment_id: id }) })
    const d = await r.json()
    setMsg(d.ok ? `✅ Diploma issued for ${d.diploma.student_name}` : `⚠️ ${d.error || 'Failed'}`)
    await load()
  }

  async function addCredit(e: React.FormEvent) {
    e.preventDefault()
    if (!selected) return
    const f = new FormData(e.target as HTMLFormElement)
    const r = await fetch('/api/graduation/credits', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
      enrollment_id: selected.enrollmentId,
      subject: f.get('subject'),
      course_name: f.get('course_name'),
      credits: Number(f.get('credits')),
      source: f.get('source') || 'lca',
      earned_date: f.get('earned_date') || null,
    }) })
    const d = await r.json()
    setMsg(d.ok ? (d.verification === 'pending' ? '🕓 Added (pending verification)' : '✅ Credit added') : `⚠️ ${d.error}`)
    await openStudent(selected)
  }

  async function verifyCredit(id: string, v: 'verified' | 'rejected') {
    const r = await fetch('/api/graduation/credits', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, verification: v }) })
    const d = await r.json()
    setMsg(d.ok ? '✅ Updated' : `⚠️ ${d.error}`)
    if (selected) await openStudent(selected)
  }

  async function delCredit(id: string) {
    const r = await fetch(`/api/graduation/credits?id=${id}`, { method: 'DELETE' })
    const d = await r.json()
    setMsg(d.ok ? '🗑️ Removed' : `⚠️ ${d.error}`)
    if (selected) await openStudent(selected)
  }

  async function saveReqs() {
    const r = await fetch('/api/graduation/requirements', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ requirements: reqs }) })
    const d = await r.json()
    setMsg(d.ok ? '✅ Requirements saved' : `⚠️ ${d.error}`)
    await load()
  }

  if (loading) return <div className="p-8 text-gray-500">Loading graduation engine…</div>

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">🎓 Graduation Engine</h1>
        <p className="text-sm text-gray-500 mt-1">Credit-ledger graduation — {totalRequired} credits required.</p>
      </div>

      <div className="flex gap-4">
        <Card label="Ready to graduate" value={ready} color="text-green-700" />
        <Card label="Graduated" value={graduated} color="text-indigo-700" />
        <Card label="Total students" value={students.length} />
      </div>
      {msg && <div className="text-sm p-3 rounded-lg bg-gray-100 border border-gray-200">{msg}</div>}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Queue */}
        <div>
          <h2 className="font-semibold text-gray-900 mb-3">Graduation-ready queue (met requirements)</h2>
          {students.filter(s => s.met).length === 0 ? (
            <p className="text-sm text-gray-400">No students have met the requirements yet.</p>
          ) : (
            <div className="space-y-3">
              {students.filter(s => s.met).map(s => (
                <div key={s.enrollmentId} className="p-4 rounded-xl border border-green-200 bg-green-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-900">{s.student} <span className="text-xs text-gray-500">({s.grade})</span></div>
                      <div className="text-xs text-gray-500">{s.email} · {s.earned}/{s.totalRequired} credits</div>
                    </div>
                    <button onClick={() => attest(s.enrollmentId)} className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700">🎓 Confirm &amp; Issue</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <h2 className="font-semibold text-gray-900 mt-6 mb-3">All students</h2>
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left"><tr><th className="p-2">Student</th><th className="p-2">Grade</th><th className="p-2">Credits</th><th className="p-2">Status</th></tr></thead>
              <tbody>
                {students.map(s => (
                  <tr key={s.enrollmentId} className="border-t hover:bg-gray-50 cursor-pointer" onClick={() => openStudent(s)}>
                    <td className="p-2 font-medium">{s.student}</td>
                    <td className="p-2">{s.grade}</td>
                    <td className="p-2">{s.earned}/{s.totalRequired}</td>
                    <td className="p-2">{badge(s.graduationStatus, s.met)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected student + settings */}
        <div className="space-y-6">
          {selected ? (
            <div className="p-4 rounded-xl border bg-white">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-900">{selected.student} — Credit Ledger</h3>
                <button onClick={() => setSelected(null)} className="text-sm text-gray-400">✕</button>
              </div>
              <form onSubmit={addCredit} className="grid grid-cols-2 gap-2 mb-4">
                <input name="subject" placeholder="Subject" required className="p-2 border rounded text-sm" />
                <input name="course_name" placeholder="Course" required className="p-2 border rounded text-sm" />
                <input name="credits" type="number" step="0.5" min="0.5" placeholder="Credits" required className="p-2 border rounded text-sm" />
                <select name="source" className="p-2 border rounded text-sm">
                  <option value="lca">LCA course</option>
                  <option value="transfer">Transfer</option>
                  <option value="dual_credit">Dual credit</option>
                  <option value="prior_learning">Prior learning</option>
                  <option value="testing">Testing</option>
                </select>
                <input name="earned_date" type="date" className="p-2 border rounded text-sm col-span-2" />
                <button className="col-span-2 p-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700">Add credit</button>
              </form>
              {ledger.length === 0 ? <p className="text-xs text-gray-400">No credits yet.</p> : (
                <div className="space-y-2">
                  {ledger.map(c => (
                    <div key={c.id} className="flex items-center justify-between p-2 border-b text-sm">
                      <div>
                        <span className="font-medium">{c.subject}</span> — {c.course_name} <span className="text-gray-500">({c.credits} cr · {c.source})</span>
                        {c.verification_status !== 'verified' && <span className={`ml-1 text-xs ${c.verification_status === 'pending' ? 'text-amber-600' : 'text-red-600'}`}>[{c.verification_status}]</span>}
                      </div>
                      <div className="flex gap-2">
                        {c.verification_status !== 'verified' && <>
                          <button onClick={() => verifyCredit(c.id, 'verified')} className="text-xs text-green-700">verify</button>
                          <button onClick={() => verifyCredit(c.id, 'rejected')} className="text-xs text-red-600">reject</button>
                        </>}
                        <button onClick={() => delCredit(c.id)} className="text-xs text-gray-400">✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-dashed text-sm text-gray-400">Select a student to edit their credit ledger / add transfer credits.</div>
          )}

          <div className="p-4 rounded-xl border bg-white">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-900">Diploma requirements</h3>
              <button onClick={saveReqs} className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700">Save</button>
            </div>
            <div className="space-y-2">
              {reqs.map((r, i) => (
                <div key={r.id} className="flex items-center gap-2 text-sm">
                  <input value={r.subject} onChange={e => setReqs(reqs.map((x,j) => j===i?{...x,subject:e.target.value}:x))} className="flex-1 p-1.5 border rounded" />
                  <input type="number" step="0.5" value={r.required_credits} onChange={e => setReqs(reqs.map((x,j) => j===i?{...x,required_credits:Number(e.target.value)}:x))} className="w-16 p-1.5 border rounded" />
                  <label className="text-xs text-gray-500 flex items-center gap-1"><input type="checkbox" checked={r.active} onChange={e => setReqs(reqs.map((x,j) => j===i?{...x,active:e.target.checked}:x))} /> on</label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Card({ label, value, color }: { label: string; value: number; color?: string }) {
  return <div className="p-4 rounded-xl border bg-white flex-1"><div className={`text-2xl font-bold ${color || 'text-gray-900'}`}>{value}</div><div className="text-xs text-gray-500">{label}</div></div>
}

function badge(status: string, met: boolean) {
  if (status === 'graduated') return <span className="px-2 py-0.5 rounded-full text-xs bg-indigo-100 text-indigo-800">🎓 Graduated</span>
  if (met) return <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800">Ready</span>
  return <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">{status}</span>
}
