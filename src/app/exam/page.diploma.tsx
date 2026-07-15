'use client'

import { useState, useEffect } from 'react'
import {
  DIPLOMA_QUESTIONS,
  DIPLOMA_PASS_THRESHOLD,
  DIPLOMA_SUBJECTS,
  type DiplomaSubject,
} from '@/lib/diplomaExam'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { GraduationCap, CreditCard, CheckCircle, Truck } from 'lucide-react'

type Step = 'intro' | 'pay' | 'test' | 'result' | 'paper'
const SUBJECT_LABELS: Record<DiplomaSubject, string> = {
  math: '🔢 Mathematics', english: '📖 English', science: '🔬 Science', history: '🌎 History',
}
function shuffled<T>(a: T[]) { const x=[...a]; for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]]} return x }

const TEST_LENGTH = 40 // normal-length diploma test drawn from the 60-question bank

export default function ExamPage() {
  const [step, setStep] = useState<Step>('intro')
  const [studentName, setStudentName] = useState('')
  const [email, setEmail] = useState('')
  const [isEnrolled, setIsEnrolled] = useState<boolean | null>(null)
  const [questions, setQuestions] = useState<typeof DIPLOMA_QUESTIONS>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [score, setScore] = useState(0)
  const [passed, setPassed] = useState(false)
  const [examId, setExamId] = useState('')
  const [address, setAddress] = useState({ line1: '', city: '', state: '', zip: '' })
  const [busy, setBusy] = useState(false)

  const testFee = isEnrolled ? 175 : 450
  const currentQ = questions[currentIndex]

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('paid') === 'test_fee') {
      const saved = sessionStorage.getItem('diplomaExam')
      if (saved) {
        const d = JSON.parse(saved)
        setStudentName(d.studentName); setEmail(d.email); setIsEnrolled(d.isEnrolled)
        setExamId(d.examId); setQuestions(d.questions)
        setStep('test'); window.history.replaceState({}, '', '/exam')
      }
    }
  }, [])

  async function handleBegin() {
    if (!studentName.trim() || !email.trim() || isEnrolled === null) return
    setBusy(true)
    const qs = shuffled(DIPLOMA_QUESTIONS).slice(0, TEST_LENGTH)
    setQuestions(qs); setCurrentIndex(0); setAnswers({})
    const res = await fetch('/api/diploma-create', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentName, email, isEnrolled, testFee: isEnrolled ? 17500 : 45000 }),
    })
    const data = await res.json()
    if (data.examId) {
      setExamId(data.examId)
      sessionStorage.setItem('diplomaExam', JSON.stringify({ studentName, email, isEnrolled, examId: data.examId, questions: qs }))
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
    if (currentIndex < questions.length - 1) { setCurrentIndex(currentIndex + 1) }
    else { finish(newAns) }
  }

  function finish(ans: Record<string, number>) {
    let correct = 0
    for (const q of questions) if (ans[q.id] === q.correctIndex) correct++
    const pct = Math.round((correct / questions.length) * 100)
    const didPass = pct >= DIPLOMA_PASS_THRESHOLD * 100
    setScore(pct); setPassed(didPass)
    fetch('/api/diploma-result', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ examId, score: pct, passed: didPass }),
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-sky-50">
      <section className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-sky-800 py-14 text-center">
        <div className="mx-auto max-w-3xl px-4">
          <div className="mb-4 inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-sm text-emerald-200 ring-1 ring-white/20">
            <GraduationCap className="h-4 w-4" />
            <span className="font-semibold">🎓 Larose Christian Academy — High School Diploma Exam</span>
          </div>
          <h1 className="font-heading text-4xl font-bold text-white sm:text-5xl">High School Diploma Exam 🌟</h1>
          <p className="mt-4 text-lg text-emerald-100/80">Mathematics, English, Science, and History — a standard high-school diploma assessment.</p>
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
                <button onClick={() => setIsEnrolled(true)} className={`flex-1 rounded-xl border-2 p-4 text-sm font-medium ${isEnrolled === true ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-gray-200 text-gray-600'}`}>Yes — Member ($175)</button>
                <button onClick={() => setIsEnrolled(false)} className={`flex-1 rounded-xl border-2 p-4 text-sm font-medium ${isEnrolled === false ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-gray-200 text-gray-600'}`}>No — Not Enrolled ($450)</button>
              </div>
            </div>
            <Button onClick={handleBegin} disabled={busy || !studentName.trim() || !email.trim() || isEnrolled === null} className="w-full">Continue to Payment →</Button>
            <p className="text-center text-xs text-gray-400">Program fee: {isEnrolled ? '$175 (member — 1yr+ membership or completed 12th grade year)' : '$450 (non-member)'} · 40 questions · 70% to pass</p>
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
            <div className="mb-2 flex justify-between text-sm text-gray-500"><span>📝 Question {currentIndex + 1} of {questions.length}</span><span>{SUBJECT_LABELS[currentQ.subject]}</span></div>
            <div className="mb-3 h-2 rounded-full bg-gray-100"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${(currentIndex / questions.length) * 100}%` }} /></div>
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

        {step === 'result' && (
          <Card><CardContent className="p-6 sm:p-8 text-center space-y-4">
            {passed ? <CheckCircle className="mx-auto h-14 w-14 text-emerald-600" /> : <GraduationCap className="mx-auto h-14 w-14 text-amber-500" />}
            <h2 className="text-2xl font-bold text-gray-900">{passed ? '🎉 You Passed!' : 'Not Passed Yet'}</h2>
            <p className="text-4xl font-bold text-emerald-700">{score}%</p>
            <p className="text-gray-600">{passed ? 'Congratulations! You have earned your Larose Christian Academy diploma.' : `You need ${DIPLOMA_PASS_THRESHOLD * 100}% to pass. You may retake the exam.`}</p>
            {passed ? (
              <div className="rounded-xl bg-emerald-50 p-4 text-left text-sm text-emerald-800 ring-1 ring-emerald-200">
                <p className="font-semibold mb-1">📜 Official paper diploma:</p>
                <p>A printed, signed diploma will be mailed to you for a <strong>$75</strong> printing &amp; mailing fee.</p>
              </div>
            ) : null}
            {passed ? (
              <Button onClick={() => setStep('paper')} className="w-full"><Truck className="mr-2 h-4 w-4" /> Order Paper Diploma ($75)</Button>
            ) : (
              <Button onClick={() => { setStep('intro'); setAnswers({}); setCurrentIndex(0) }} variant="outline" className="w-full">Retake Exam</Button>
            )}
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
