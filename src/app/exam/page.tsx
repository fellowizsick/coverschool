'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  DIPLOMA_QUESTIONS,
  DIPLOMA_PASS_THRESHOLD,
  type DiplomaQuestion,
  type DiplomaSubject,
} from '@/lib/diplomaExam'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { GraduationCap, BookOpen, CheckCircle, CreditCard, Truck } from 'lucide-react'

type Step = 'intro' | 'enroll-check' | 'pay' | 'test' | 'result' | 'paper'

const SUBJECT_LABELS: Record<DiplomaSubject, string> = {
  math: '🔢 Math',
  english: '📝 English',
  science: '🔬 Science',
  social_studies: '🌎 Social Studies',
  life_skills: '💡 Life Skills',
}

// Shuffle helper
function shuffled<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const TEST_LENGTH = 60 // 60 questions drawn from the 209 bank

export default function ExamPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('intro')
  const [studentName, setStudentName] = useState('')
  const [email, setEmail] = useState('')
  const [isEnrolled, setIsEnrolled] = useState<boolean | null>(null)
  const [questions, setQuestions] = useState<DiplomaQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<{ qid: string; sel: number }[]>([])
  const [score, setScore] = useState(0)
  const [passed, setPassed] = useState(false)
  const [examId, setExamId] = useState('')
  const [address, setAddress] = useState({ line1: '', city: '', state: '', zip: '' })
  const [busy, setBusy] = useState(false)

  const testFee = isEnrolled ? 50 : 200

  // Restore exam context after returning from Stripe checkout
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('paid') === 'test_fee') {
      const saved = sessionStorage.getItem('diplomaExam')
      if (saved) {
        const d = JSON.parse(saved)
        setStudentName(d.studentName)
        setEmail(d.email)
        setIsEnrolled(d.isEnrolled)
        setExamId(d.examId)
        setQuestions(d.questions)
        setStep('test')
        // clean url
        window.history.replaceState({}, '', '/exam')
      }
    }
  }, [])

  async function handleBegin() {
    if (!studentName.trim() || !email.trim() || isEnrolled === null) return
    setBusy(true)
    const testQuestions = shuffled(DIPLOMA_QUESTIONS).slice(0, TEST_LENGTH)
    setQuestions(testQuestions)
    const res = await fetch('/api/diploma-create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentName,
        email,
        isEnrolled,
        testFee: (isEnrolled ? 5000 : 20000),
      }),
    })
    const data = await res.json()
    if (data.examId) {
      setExamId(data.examId)
      // persist so we can resume after Stripe redirect
      sessionStorage.setItem('diplomaExam', JSON.stringify({
        studentName, email, isEnrolled, examId: data.examId, questions: testQuestions,
      }))
    }
    setBusy(false)
    setStep('pay')
  }

  async function handlePay(type: 'test_fee' | 'paper_fee') {
    setBusy(true)
    const res = await fetch('/api/diploma-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type,
        email,
        studentName,
        isEnrolled,
        examId,
      }),
    })
    const data = await res.json()
    setBusy(false)
    if (data.url) window.location.href = data.url
  }

  function handleAnswer(sel: number) {
    const newAnswers = [...answers, { qid: questions[currentIndex].id, sel }]
    setAnswers(newAnswers)
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      // grade
      let correct = 0
      for (const a of newAnswers) {
        const q = questions.find((x) => x.id === a.qid)
        if (q && q.correctIndex === a.sel) correct++
      }
      const pct = Math.round((correct / questions.length) * 100)
      const didPass = pct >= DIPLOMA_PASS_THRESHOLD * 100
      setScore(pct)
      setPassed(didPass)
      // save result
      fetch('/api/diploma-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ examId, score: pct, passed: didPass }),
      })
      setStep('result')
    }
  }

  async function handleOrderPaper() {
    // first ensure address captured, then pay $75
    if (!address.line1.trim() || !address.city.trim() || !address.state.trim() || !address.zip.trim()) {
      alert('Please enter the full mailing address for the paper diploma.')
      return
    }
    setBusy(true)
    await fetch('/api/diploma-address', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ examId, ...address }),
    })
    setBusy(false)
    handlePay('paper_fee')
  }

  const currentQ = questions[currentIndex]

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-sky-50">
      <section className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-sky-800 py-14 text-center">
        <div className="mx-auto max-w-3xl px-4">
          <div className="mb-4 inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-sm text-emerald-200 ring-1 ring-white/20">
            <GraduationCap className="h-4 w-4" />
            <span className="font-semibold">🎓 Larose Christian Academy — Diploma Exam</span>
          </div>
          <h1 className="font-heading text-4xl font-bold text-white sm:text-5xl">
            Earn Your High School Diploma 🌟
          </h1>
          <p className="mt-4 text-lg text-emerald-100/80">
            A comprehensive adult diploma assessment covering Math, English, Science, Social Studies, and Life Skills.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-2xl px-4 py-12">
        {/* INTRO */}
        {step === 'intro' && (
          <Card>
            <CardContent className="p-6 sm:p-8 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">📋 Student Information</h2>
              <Input id="name" label="🌟 Full Name" placeholder="e.g. John Smith" value={studentName} onChange={(e) => setStudentName(e.target.value)} required />
              <Input id="email" label="✉️ Email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <div>
                <p className="mb-2 text-sm font-medium text-gray-700">🎓 Are you currently enrolled at Larose Christian Academy?</p>
                <div className="flex gap-3">
                  <button onClick={() => setIsEnrolled(true)} className={`flex-1 rounded-xl border-2 p-4 text-sm font-medium ${isEnrolled === true ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-gray-200 text-gray-600'}`}>
                    Yes — Enrolled ($50 test fee)
                  </button>
                  <button onClick={() => setIsEnrolled(false)} className={`flex-1 rounded-xl border-2 p-4 text-sm font-medium ${isEnrolled === false ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-gray-200 text-gray-600'}`}>
                    No — Not Enrolled ($200 test fee)
                  </button>
                </div>
              </div>
              <Button onClick={handleBegin} disabled={busy || !studentName.trim() || !email.trim() || isEnrolled === null} className="w-full">
                Continue to Payment →
              </Button>
              <p className="text-center text-xs text-gray-400">Test fee: {isEnrolled ? '$50 (enrolled)' : '$200 (not enrolled)'} · 60 questions · 70% to pass</p>
            </CardContent>
          </Card>
        )}

        {/* PAY TEST FEE */}
        {step === 'pay' && (
          <Card>
            <CardContent className="p-6 sm:p-8 text-center space-y-4">
              <CreditCard className="mx-auto h-12 w-12 text-emerald-600" />
              <h2 className="text-xl font-bold text-gray-900">Pay the Diploma Test Fee</h2>
              <p className="text-gray-600">Student: <strong>{studentName}</strong></p>
              <p className="text-3xl font-bold text-emerald-700">${testFee}.00</p>
              <p className="text-sm text-gray-500">{isEnrolled ? 'Enrolled student rate' : 'Standard (not enrolled) rate'}</p>
              <Button onClick={() => handlePay('test_fee')} disabled={busy} className="w-full">
                {busy ? 'Redirecting…' : `Pay $${testFee} & Start Test`}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* TEST */}
        {step === 'test' && currentQ && (
          <div>
            <div className="mb-4 text-sm text-gray-500">
              📝 Question {currentIndex + 1} of {questions.length}
            </div>
            <div className="mb-2 h-2 rounded-full bg-gray-100">
              <div className="h-full rounded-full bg-emerald-500" style={{ width: `${(currentIndex / questions.length) * 100}%` }} />
            </div>
            <Card>
              <CardContent className="p-6 sm:p-8">
                <div className="mb-3 text-xs font-medium text-emerald-700">{SUBJECT_LABELS[currentQ.subject]}</div>
                <h2 className="mb-6 text-lg font-medium text-gray-900 leading-relaxed">{currentQ.question}</h2>
                <div className="space-y-3">
                  {currentQ.options.map((opt, idx) => (
                    <button key={idx} onClick={() => handleAnswer(idx)} className="group w-full rounded-xl border-2 border-emerald-400 bg-white p-4 text-left text-sm text-gray-700 transition-all hover:bg-emerald-50 hover:text-emerald-900">
                      <span className="mr-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700 group-hover:bg-emerald-200">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      {opt}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* RESULT */}
        {step === 'result' && (
          <Card>
            <CardContent className="p-6 sm:p-8 text-center space-y-4">
              {passed ? <CheckCircle className="mx-auto h-14 w-14 text-emerald-600" /> : <BookOpen className="mx-auto h-14 w-14 text-amber-500" />}
              <h2 className="text-2xl font-bold text-gray-900">{passed ? '🎉 You Passed!' : 'Not Passed Yet'}</h2>
              <p className="text-4xl font-bold text-emerald-700">{score}%</p>
              <p className="text-gray-600">{passed ? 'Congratulations! You have earned your Larose Christian Academy diploma.' : `You need ${DIPLOMA_PASS_THRESHOLD * 100}% to pass. You may retake the exam.`}</p>
              {passed && (
                <div className="rounded-xl bg-emerald-50 p-4 text-left text-sm text-emerald-800 ring-1 ring-emerald-200">
                  <p className="font-semibold mb-2">📜 Get your official paper diploma:</p>
                  <p>A printed, signed diploma will be mailed to you for a <strong>$75</strong> printing &amp; mailing fee.</p>
                </div>
              )}
              {passed ? (
                <Button onClick={() => setStep('paper')} className="w-full">
                  <Truck className="mr-2 h-4 w-4" /> Order Paper Diploma ($75)
                </Button>
              ) : (
                <Button onClick={() => { setStep('intro'); setAnswers([]); setCurrentIndex(0) }} variant="outline" className="w-full">
                  Retake Exam
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* PAPER ORDER */}
        {step === 'paper' && (
          <Card>
            <CardContent className="p-6 sm:p-8 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">📮 Paper Diploma Mailing Address</h2>
              <p className="text-sm text-gray-500">Printing + USPS mailing fee: <strong>$75.00</strong></p>
              <Input id="line1" label="🏠 Street Address" value={address.line1} onChange={(e) => setAddress({ ...address, line1: e.target.value })} required />
              <Input id="city" label="🏙️ City" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} required />
              <div className="grid grid-cols-2 gap-3">
                <Input id="state" label="🗺️ State" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} required />
                <Input id="zip" label="📮 ZIP" value={address.zip} onChange={(e) => setAddress({ ...address, zip: e.target.value })} required />
              </div>
              <Button onClick={handleOrderPaper} disabled={busy} className="w-full">
                {busy ? 'Redirecting…' : 'Pay $75 & Order Paper Diploma'}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
