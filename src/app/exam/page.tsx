'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  DIPLOMA_QUESTIONS,
  DIPLOMA_SUBTESTS,
  DIPLOMA_ESSAY_PROMPTS,
  DIPLOMA_PASS_PER_SUBTEST,
  DIPLOMA_ESSAY_MIN_WORDS,
  scoreEssay,
  type DiplomaSubtest,
} from '@/lib/diplomaExam'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { GraduationCap, BookOpen, CheckCircle, CreditCard, Truck, Pencil } from 'lucide-react'

type Step = 'intro' | 'pay' | 'test' | 'essay' | 'result' | 'paper'
const SUBTEST_LABELS: Record<DiplomaSubtest, string> = {
  math: '🔢 Mathematics', reading: '📖 Reading', science: '🔬 Science',
  social_studies: '🌎 Social Studies', life_skills: '💡 Life & Work Skills',
}
function shuffled<T>(a: T[]) { const x=[...a]; for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]]} return x }

export default function ExamPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('intro')
  const [studentName, setStudentName] = useState('')
  const [email, setEmail] = useState('')
  const [isEnrolled, setIsEnrolled] = useState<boolean | null>(null)
  const [bySubtest, setBySubtest] = useState<Record<DiplomaSubtest, typeof DIPLOMA_QUESTIONS>>({} as any)
  const [order, setOrder] = useState<DiplomaSubtest[]>([])
  const [qIdx, setQIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [essayText, setEssayText] = useState('')
  const [essayPrompt, setEssayPrompt] = useState('')
  const [essayResult, setEssayResult] = useState<{ score: number; words: number; passed: boolean } | null>(null)
  const [subResults, setSubResults] = useState<Record<DiplomaSubtest, { correct: number; total: number; pct: number; passed: boolean }>>({} as any)
  const [passed, setPassed] = useState(false)
  const [examId, setExamId] = useState('')
  const [address, setAddress] = useState({ line1: '', city: '', state: '', zip: '' })
  const [busy, setBusy] = useState(false)

  const testFee = isEnrolled ? 50 : 200
  const allQs = order.flatMap((s) => bySubtest[s])
  const currentQ = allQs[qIdx]
  const totalQs = allQs.length

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('paid') === 'test_fee') {
      const saved = sessionStorage.getItem('diplomaExam')
      if (saved) {
        const d = JSON.parse(saved)
        setStudentName(d.studentName); setEmail(d.email); setIsEnrolled(d.isEnrolled)
        setExamId(d.examId); setBySubtest(d.bySubtest); setOrder(d.order)
        setStep('test'); window.history.replaceState({}, '', '/exam')
      }
    }
  }, [])

  async function handleBegin() {
    if (!studentName.trim() || !email.trim() || isEnrolled === null) return
    setBusy(true)
    // build per-subtest shuffled sets
    const bs: Record<string, any> = {}
    const ord: DiplomaSubtest[] = []
    for (const st of DIPLOMA_SUBTESTS) {
      const qs = shuffled(DIPLOMA_QUESTIONS.filter((q) => q.subtest === st.key)).slice(0, st.key === 'math' ? 18 : 13)
      bs[st.key] = qs
      ord.push(st.key)
    }
    setBySubtest(bs); setOrder(ord); setQIdx(0); setAnswers({})
    const res = await fetch('/api/diploma-create', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentName, email, isEnrolled, testFee: isEnrolled ? 5000 : 20000 }),
    })
    const data = await res.json()
    if (data.examId) {
      setExamId(data.examId)
      sessionStorage.setItem('diplomaExam', JSON.stringify({ studentName, email, isEnrolled, examId: data.examId, bySubtest: bs, order: ord }))
    }
    setBusy(false); setStep('pay')
  }

  async function handlePay(type: 'test_fee' | 'paper_fee') {
    setBusy(true)
    const res = await fetch('/api/diploma-checkout', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, email, studentName, isEnrolled, examId }),
    })
    const data = await res.json(); setBusy(false)
    if (data.url) window.location.href = data.url
  }

  function handleAnswer(sel: number) {
    const newAns = { ...answers, [currentQ.id]: sel }
    setAnswers(newAns)
    if (qIdx < totalQs - 1) { setQIdx(qIdx + 1) }
    else { finishMC(newAns) }
  }

  function finishMC(ans: Record<string, number>) {
    const results: any = {}
    let allPass = true
    for (const st of DIPLOMA_SUBTESTS) {
      const qs = bySubtest[st.key]
      let correct = 0
      for (const q of qs) if (ans[q.id] === q.correctIndex) correct++
      const pct = Math.round((correct / qs.length) * 100)
      const stPassed = pct >= DIPLOMA_PASS_PER_SUBTEST * 100
      if (!stPassed) allPass = false
      results[st.key] = { correct, total: qs.length, pct, passed: stPassed }
    }
    setSubResults(results)
    // move to essay (required component) regardless; essay pass required too
    setEssayPrompt(DIPLOMA_ESSAY_PROMPTS[Math.floor(Math.random() * DIPLOMA_ESSAY_PROMPTS.length)])
    setStep('essay')
  }

  function handleEssayDone() {
    const r = scoreEssay(essayText)
    setEssayResult(r)
    const mcPass = DIPLOMA_SUBTESTS.every((s) => subResults[s.key]?.passed)
    const didPass = mcPass && r.passed
    setPassed(didPass)
    fetch('/api/diploma-result', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ examId, score: r.words, passed: didPass, subResults, essayScore: r.score }),
    })
    setStep('result')
  }

  async function handleOrderPaper() {
    if (!address.line1.trim() || !address.city.trim() || !address.state.trim() || !address.zip.trim()) {
      alert('Please enter the full mailing address for the paper diploma.'); return
    }
    setBusy(true)
    await fetch('/api/diploma-address', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ examId, ...address }),
    })
    setBusy(false); handlePay('paper_fee')
  }

  // progress bar pct
  const progress = totalQs ? (qIdx / totalQs) * 100 : 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-sky-50">
      <section className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-sky-800 py-14 text-center">
        <div className="mx-auto max-w-3xl px-4">
          <div className="mb-4 inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-sm text-emerald-200 ring-1 ring-white/20">
            <GraduationCap className="h-4 w-4" />
            <span className="font-semibold">🎓 Larose Christian Academy — Adult Diploma Exam</span>
          </div>
          <h1 className="font-heading text-4xl font-bold text-white sm:text-5xl">Earn Your High School Diploma 🌟</h1>
          <p className="mt-4 text-lg text-emerald-100/80">
            A five-part examination: Mathematics, Reading, Science, Social Studies, and Life &amp; Work Skills — plus a required Writing sample.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-2xl px-4 py-12">
        {step === 'intro' && (
          <Card><CardContent className="p-6 sm:p-8 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">📋 Student Information</h2>
            <Input id="name" label="🌟 Full Name" placeholder="e.g. John Smith" value={studentName} onChange={(e) => setStudentName(e.target.value)} required />
            <Input id="email" label="✉️ Email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <div>
              <p className="mb-2 text-sm font-medium text-gray-700">🎓 Are you currently enrolled at Larose Christian Academy?</p>
              <div className="flex gap-3">
                <button onClick={() => setIsEnrolled(true)} className={`flex-1 rounded-xl border-2 p-4 text-sm font-medium ${isEnrolled === true ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-gray-200 text-gray-600'}`}>Yes — Enrolled ($50)</button>
                <button onClick={() => setIsEnrolled(false)} className={`flex-1 rounded-xl border-2 p-4 text-sm font-medium ${isEnrolled === false ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-gray-200 text-gray-600'}`}>No — Not Enrolled ($200)</button>
              </div>
            </div>
            <Button onClick={handleBegin} disabled={busy || !studentName.trim() || !email.trim() || isEnrolled === null} className="w-full">Continue to Payment →</Button>
            <p className="text-center text-xs text-gray-400">Test fee: {isEnrolled ? '$50 (enrolled)' : '$200 (not enrolled)'} · pass each subtest at 60% + writing sample</p>
          </CardContent></Card>
        )}

        {step === 'pay' && (
          <Card><CardContent className="p-6 sm:p-8 text-center space-y-4">
            <CreditCard className="mx-auto h-12 w-12 text-emerald-600" />
            <h2 className="text-xl font-bold text-gray-900">Pay the Diploma Test Fee</h2>
            <p className="text-gray-600">Student: <strong>{studentName}</strong></p>
            <p className="text-3xl font-bold text-emerald-700">${testFee}.00</p>
            <p className="text-sm text-gray-500">{isEnrolled ? 'Enrolled student rate' : 'Standard (not enrolled) rate'}</p>
            <Button onClick={() => handlePay('test_fee')} disabled={busy} className="w-full">{busy ? 'Redirecting…' : `Pay $${testFee} & Start Exam`}</Button>
          </CardContent></Card>
        )}

        {step === 'test' && currentQ && (
          <div>
            <div className="mb-2 flex justify-between text-sm text-gray-500"><span>📝 Question {qIdx + 1} of {totalQs}</span><span>{SUBTEST_LABELS[currentQ.subtest]}</span></div>
            <div className="mb-3 h-2 rounded-full bg-gray-100"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${progress}%` }} /></div>
            <Card><CardContent className="p-6 sm:p-8">
              <h2 className="mb-6 text-lg font-medium text-gray-900 leading-relaxed">{currentQ.question}</h2>
              <div className="space-y-3">
                {currentQ.options.map((opt, idx) => (
                  <button key={idx} onClick={() => handleAnswer(idx)} className="group w-full rounded-xl border-2 border-emerald-400 bg-white p-4 text-left text-sm text-gray-700 transition-all hover:bg-emerald-50 hover:text-emerald-900">
                    <span className="mr-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700 group-hover:bg-emerald-200">{String.fromCharCode(65 + idx)}</span>{opt}
                  </button>
                ))}
              </div>
            </CardContent></Card>
          </div>
        )}

        {step === 'essay' && (
          <Card><CardContent className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-emerald-700"><Pencil className="h-5 w-5" /><h2 className="text-lg font-semibold">✍️ Writing Sample (Required)</h2></div>
            <p className="text-sm text-gray-600">Minimum {DIPLOMA_ESSAY_MIN_WORDS} words. This is graded and required to earn the diploma.</p>
            <div className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-900 ring-1 ring-emerald-200">{essayPrompt}</div>
            <textarea value={essayText} onChange={(e) => setEssayText(e.target.value)} rows={10} className="w-full rounded-xl border-2 border-gray-200 p-3 text-sm" placeholder="Type your response here…" />
            <p className="text-xs text-gray-400">{essayText.trim().split(/\s+/).filter(Boolean).length} words</p>
            <Button onClick={handleEssayDone} disabled={essayText.trim().split(/\s+/).filter(Boolean).length < DIPLOMA_ESSAY_MIN_WORDS} className="w-full">Submit Exam</Button>
          </CardContent></Card>
        )}

        {step === 'result' && (
          <Card><CardContent className="p-6 sm:p-8 text-center space-y-4">
            {passed ? <CheckCircle className="mx-auto h-14 w-14 text-emerald-600" /> : <BookOpen className="mx-auto h-14 w-14 text-amber-500" />}
            <h2 className="text-2xl font-bold text-gray-900">{passed ? '🎉 You Passed!' : 'Not Passed Yet'}</h2>
            <div className="space-y-1 text-left text-sm">
              {DIPLOMA_SUBTESTS.map((s) => {
                const r = subResults[s.key]
                return <div key={s.key} className="flex justify-between border-b py-1"><span>{s.label}</span><span className={r?.passed ? 'text-emerald-700 font-semibold' : 'text-rose-600 font-semibold'}>{r?.pct}% {r?.passed ? '✓' : '✗'}</span></div>
              })}
              <div className="flex justify-between py-1"><span>✍️ Writing Sample</span><span className={essayResult?.passed ? 'text-emerald-700 font-semibold' : 'text-rose-600 font-semibold'}>{essayResult?.words} words {essayResult?.passed ? '✓' : '✗'}</span></div>
            </div>
            {passed ? (
              <>
                <p className="text-gray-600">Congratulations! You have earned your Larose Christian Academy diploma.</p>
                <div className="rounded-xl bg-emerald-50 p-4 text-left text-sm text-emerald-800 ring-1 ring-emerald-200">
                  <p className="font-semibold mb-1">📜 Official paper diploma:</p>
                  <p>A printed, signed diploma will be mailed to you for a <strong>$75</strong> printing &amp; mailing fee.</p>
                </div>
                <Button onClick={() => setStep('paper')} className="w-full"><Truck className="mr-2 h-4 w-4" /> Order Paper Diploma ($75)</Button>
              </>
            ) : (
              <p className="text-gray-600">You must pass every subtest at 60% and the writing sample to earn the diploma. You may retake the exam.</p>
            )}
            {!passed && <Button onClick={() => { setStep('intro'); setAnswers({}); setQIdx(0); setSubResults({} as any); setEssayText('') }} variant="outline" className="w-full">Retake Exam</Button>}
          </CardContent></Card>
        )}

        {step === 'paper' && (
          <Card><CardContent className="p-6 sm:p-8 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">📮 Paper Diploma Mailing Address</h2>
            <p className="text-sm text-gray-500">Printing + USPS mailing fee: <strong>$75.00</strong></p>
            <Input id="line1" label="🏠 Street Address" value={address.line1} onChange={(e) => setAddress({ ...address, line1: e.target.value })} required />
            <Input id="city" label="🏙️ City" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} required />
            <div className="grid grid-cols-2 gap-3"><Input id="state" label="🗺️ State" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} required /><Input id="zip" label="📮 ZIP" value={address.zip} onChange={(e) => setAddress({ ...address, zip: e.target.value })} required /></div>
            <Button onClick={handleOrderPaper} disabled={busy} className="w-full">{busy ? 'Redirecting…' : 'Pay $75 & Order Paper Diploma'}</Button>
          </CardContent></Card>
        )}
      </div>
    </div>
  )
}
