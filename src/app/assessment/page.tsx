'use client'

import { useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  getAssessmentQuestions,
  getQuestionsByGrade,
  gradeLabelToNumber,
  scoreAssessment,
  isStateCovered,
  type Question,
  type AssessmentResult,
} from '@/lib/assessment'
import { COVERED_STATES, ALL_STATES, GRADE_OPTIONS } from '@/lib/constants'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Card, CardContent } from '@/components/ui/Card'
import {
  GraduationCap,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  RefreshCw,
  Loader2,
} from 'lucide-react'

type Step = 'info' | 'unavailable' | 'test' | 'results'

const stateOptions = ALL_STATES.map((s) => ({
  value: s.code,
  label: `${s.name} (${s.code})`,
}))

const gradeOptions = [
  { value: 'Kindergarten', label: 'Kindergarten' },
  ...GRADE_OPTIONS.map((g) => ({ value: g, label: g })),
]

// Fun color cycle for answer buttons
const ANSWER_COLORS = [
  'border-emerald-400 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-900',
  'border-sky-400 hover:border-sky-500 hover:bg-sky-50 hover:text-sky-900',
  'border-purple-400 hover:border-purple-500 hover:bg-purple-50 hover:text-purple-900',
  'border-amber-400 hover:border-amber-500 hover:bg-amber-50 hover:text-amber-900',
]

const ANSWER_BG_COLORS = [
  'bg-emerald-100 text-emerald-700 group-hover:bg-emerald-200',
  'bg-sky-100 text-sky-700 group-hover:bg-sky-200',
  'bg-purple-100 text-purple-700 group-hover:bg-purple-200',
  'bg-amber-100 text-amber-700 group-hover:bg-amber-200',
]

export default function AssessmentPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('info')
  const [studentName, setStudentName] = useState('')
  const [studentAge, setStudentAge] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [selectedGrade, setSelectedGrade] = useState('')
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<{ questionId: string; selectedIndex: number }[]>([])
  const [result, setResult] = useState<AssessmentResult | null>(null)
  const [error, setError] = useState('')

  // Step 1: Handle state check
  const handleStartTest = () => {
    if (!studentName.trim() || !selectedState) {
      setError('Please enter the student name and select a state.')
      return
    }
    if (!selectedGrade) {
      setError('Please select the student\'s current grade so we can match the test to their age.')
      return
    }
    setError('')

    if (!isStateCovered(selectedState)) {
      setStep('unavailable')
      return
    }

    // Generate age-appropriate test questions for the selected grade
    const gradeNum = gradeLabelToNumber(selectedGrade)
    const testQuestions = getQuestionsByGrade(gradeNum)
    setQuestions(testQuestions)
    setCurrentIndex(0)
    setAnswers([])
    setStep('test')
  }

  // Step 3: Answer a question
  const handleAnswer = useCallback(
    (selectedIndex: number) => {
      const currentQ = questions[currentIndex]
      if (!currentQ) return

      const newAnswers = [
        ...answers,
        { questionId: currentQ.id, selectedIndex },
      ]
      setAnswers(newAnswers)

      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1)
      } else {
        // Test done — score it
        const scored = scoreAssessment(newAnswers)
        setResult(scored)
        setStep('results')
      }
    },
    [questions, currentIndex, answers]
  )

  // Step 4: Proceed to enroll with recommended grade
  const handleEnroll = () => {
    if (!result) return
    // Store the grade in sessionStorage so enroll page can pre-fill it
    sessionStorage.setItem('recommendedGrade', result.recommendedGrade)
    sessionStorage.setItem('studentName', studentName)
    sessionStorage.setItem('studentState', selectedState)
    router.push(`/enroll?grade=${encodeURIComponent(result.recommendedGrade)}&name=${encodeURIComponent(studentName)}`)
  }

  // Reset
  const handleRetry = () => {
    setStep('info')
    setStudentName('')
    setStudentAge('')
    setSelectedState('')
    setSelectedGrade('')
    setQuestions([])
    setCurrentIndex(0)
    setAnswers([])
    setResult(null)
    setError('')
  }

  // Current question
  const currentQuestion = questions[currentIndex]
  const progress = questions.length > 0 ? ((currentIndex) / questions.length) * 100 : 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-sky-50">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-sky-800 py-16">
        {/* Floating emoji decorations */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <span className="absolute left-[10%] top-[15%] text-2xl animate-float opacity-30">🌟</span>
          <span className="absolute right-[15%] top-[10%] text-3xl animate-float opacity-25" style={{ animationDelay: '0.5s' }}>📚</span>
          <span className="absolute left-[20%] bottom-[20%] text-2xl animate-float opacity-20" style={{ animationDelay: '1s' }}>✏️</span>
          <span className="absolute right-[10%] bottom-[15%] text-2xl animate-float opacity-25" style={{ animationDelay: '1.5s' }}>🎯</span>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/10 via-sky-500/5 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-sky-500/10 via-transparent to-transparent" />
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-6 inline-flex animate-pop items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-sm text-emerald-200 backdrop-blur-sm ring-1 ring-white/20">
            <GraduationCap className="h-4 w-4" />
            <span className="gradient-text-rainbow font-semibold">🎯 Grade Placement Assessment</span>
          </div>
          <h1 className="font-heading text-4xl font-bold text-white sm:text-5xl">
            Find Your Student&apos;s Perfect Grade Level 🌟
          </h1>
          <p className="mt-4 text-lg text-emerald-100/80">
            Take our fun, free assessment to discover the right grade placement for your student.
            Covers Math and Reading for grades 1&ndash;9. Let&apos;s get started! 🚀
          </p>
        </div>
        {/* Bottom rainbow divider */}
        <div className="divider-rainbow absolute bottom-0 left-0 right-0 h-1.5" />
      </section>

      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        {/* ===== STEP 1: Student Info + State Check ===== */}
        {step === 'info' && (
          <Card fun="green">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-12 w-12 animate-bounce-soft items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-500 shadow-md shadow-emerald-200">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">📋 Student Information</h2>
                  <p className="text-sm text-gray-500">
                    Let&apos;s start with some basic info 🎉
                  </p>
                </div>
              </div>

              {error && (
                <div className="mb-4 animate-wiggle rounded-lg bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-200">
                  ⚠️ {error}
                </div>
              )}

              <div className="space-y-4">
                <Input
                  id="student_name"
                  label="🌟 Student's Full Name"
                  placeholder="e.g. John Smith"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  required
                />
                <Input
                  id="student_age"
                  label="🎂 Student's Age"
                  type="number"
                  placeholder="e.g. 8"
                  value={studentAge}
                  onChange={(e) => setStudentAge(e.target.value)}
                />
                <Select
                  id="state"
                  name="state"
                  label="🗺️ What state do you live in?"
                  required
                  options={stateOptions}
                  placeholder="Select your state"
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                />
                <Select
                  id="grade"
                  name="grade"
                  label="🎓 What grade is the student in?"
                  required
                  options={gradeOptions}
                  placeholder="Select their grade"
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                />
              </div>

              <div className="mt-6 rounded-xl bg-gradient-to-br from-emerald-50 to-sky-50 p-4 text-sm text-emerald-800 ring-1 ring-emerald-100">
                <p className="font-semibold">📝 What to expect:</p>
                <ul className="mt-2 space-y-1.5 text-emerald-700">
                  <li className="flex items-center gap-2">
                    <span className="emoji-badge">❓</span> Questions matched to {selectedGrade || 'the selected grade'} level
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="emoji-badge">🧮</span> Covers Math and Reading at their age
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="emoji-badge">⏱️</span> Takes about 10&ndash;15 minutes
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="emoji-badge">🏆</span> Results will recommend a grade placement
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="emoji-badge">🚀</span> You can enroll right after
                  </li>
                </ul>
              </div>

              <Button
                variant="fun"
                size="lg"
                className="mt-6 w-full animate-pop"
                onClick={handleStartTest}
              >
                🚀 Start Assessment
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* ===== STEP 2: State Not Available ===== */}
        {step === 'unavailable' && (
          <Card fun="rose">
            <CardContent className="p-6 text-center sm:p-8">
              <div className="mx-auto flex h-20 w-20 animate-wobble items-center justify-center rounded-full bg-gradient-to-br from-rose-100 to-pink-100 ring-2 ring-rose-200">
                <span className="text-3xl">😔</span>
              </div>
              <h2 className="mt-4 text-xl font-bold text-gray-900">
                We&apos;re Sorry! 💔
              </h2>
              <p className="mt-3 text-gray-700 leading-relaxed">
                Unfortunately, we are <strong>not currently serving families in your state</strong>.
                Larose Christian Academy operates under Alabama church school law, and our
                current legal coverage is limited to specific states.
              </p>

              <div className="mt-6 rounded-xl bg-white p-5 text-left ring-1 ring-gray-100 shadow-sm">
                <h3 className="font-semibold text-gray-900">🌟 States We Currently Serve:</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {COVERED_STATES.map((s) => (
                    <span
                      key={s.code}
                      className="inline-flex animate-pop items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-50 to-sky-50 px-3 py-1 text-sm font-medium text-emerald-800 ring-1 ring-emerald-200"
                    >
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                      {s.name} ({s.code})
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  We are actively working to expand into new states. If you&apos;d like
                  us to notify you when we become available in your area, please
                  <a href="/contact" className="font-medium text-emerald-600 underline hover:text-emerald-500">
                    {' '}contact us
                  </a>
                  . 💌
                </p>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button variant="outline" onClick={handleRetry}>
                  🔄 Try Again
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push('/')}
                >
                  🏠 Return Home
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ===== STEP 3: The Test ===== */}
        {step === 'test' && currentQuestion && (
          <div>
            {/* Progress */}
            <div className="mb-6 animate-slide-up">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span className="font-medium">
                  📝 Question {currentIndex + 1} of {questions.length}
                </span>
                <span
                  className={`inline-flex animate-pop items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium shadow-sm ${
                    currentQuestion.subject === 'math'
                      ? 'bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 ring-1 ring-emerald-200'
                      : 'bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 ring-1 ring-purple-200'
                  }`}
                >
                  {currentQuestion.subject === 'math' ? (
                    <>🔢 Math</>
                  ) : (
                    <>📖 Reading</>
                  )}
                </span>
              </div>
              <div className="mt-2 h-3 rounded-full bg-gray-100 ring-1 ring-gray-200 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-sky-500 transition-all duration-500 ease-out shadow-sm shadow-emerald-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              {/* Fun progress emojis */}
              <div className="mt-1 flex justify-between px-0.5 text-[10px] text-gray-400">
                <span>🏁</span>
                <span className={currentIndex >= questions.length / 2 ? 'animate-bounce-soft text-emerald-500' : ''}>
                  {currentIndex >= questions.length / 2 ? '🎯' : ''}
                </span>
                <span className={currentIndex === questions.length - 1 ? 'animate-tada' : ''}>
                  {currentIndex === questions.length - 1 ? '🏆' : '🎯'}
                </span>
              </div>
            </div>

            <Card fun="blue">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 animate-bounce-soft items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-blue-500 text-sm text-white shadow-sm">
                    {currentIndex + 1}
                  </span>
                  <h2 className="text-lg font-medium text-gray-900 leading-relaxed">
                    {currentQuestion.question}
                  </h2>
                </div>

                <div className="mt-6 space-y-3">
                  {currentQuestion.options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      className={`group w-full rounded-xl border-2 bg-white p-4 text-left text-sm text-gray-700 transition-all duration-200 ${ANSWER_COLORS[idx % ANSWER_COLORS.length]} hover:shadow-md active:scale-[0.98] hover:-translate-y-0.5`}
                    >
                      <span
                        className={`mr-3 inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all duration-200 group-hover:scale-110 ${ANSWER_BG_COLORS[idx % ANSWER_BG_COLORS.length]}`}
                      >
                        {String.fromCharCode(65 + idx)}
                      </span>
                      {option}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ===== STEP 4: Results ===== */}
        {step === 'results' && result && (
          <div className="animate-scale-in">
            <Card fun="purple">
              <CardContent className="p-6 text-center sm:p-8">
                <div className="mx-auto flex h-20 w-20 animate-tada items-center justify-center rounded-full bg-gradient-to-br from-amber-200 to-yellow-200 ring-2 ring-amber-300 shadow-lg shadow-amber-200/50">
                  <span className="text-3xl">🎉</span>
                </div>

                <h2 className="mt-4 text-2xl font-bold text-gray-900 gradient-text-rainbow">
                  Assessment Complete! 🏆
                </h2>
                <p className="mt-2 text-gray-600">
                  Here are <strong>{studentName}</strong>&apos;s results 🌟
                </p>

                {/* Score Overview */}
                <div className="mt-8 grid grid-cols-3 gap-4">
                  <div className="animate-slide-up rounded-xl bg-gradient-to-b from-emerald-50 to-emerald-100 p-4 ring-1 ring-emerald-200 shadow-sm" style={{ animationDelay: '0.1s' }}>
                    <div className="text-2xl font-bold text-emerald-700">
                      {result.score}%
                    </div>
                    <div className="mt-1 text-xs text-emerald-600 font-medium">📊 Overall</div>
                  </div>
                  <div className="animate-slide-up rounded-xl bg-gradient-to-b from-sky-50 to-sky-100 p-4 ring-1 ring-sky-200 shadow-sm" style={{ animationDelay: '0.2s' }}>
                    <div className="text-2xl font-bold text-sky-700">
                      {result.mathScore}%
                    </div>
                    <div className="mt-1 text-xs text-sky-600 font-medium">🔢 Math</div>
                  </div>
                  <div className="animate-slide-up rounded-xl bg-gradient-to-b from-purple-50 to-purple-100 p-4 ring-1 ring-purple-200 shadow-sm" style={{ animationDelay: '0.3s' }}>
                    <div className="text-2xl font-bold text-purple-700">
                      {result.readingScore}%
                    </div>
                    <div className="mt-1 text-xs text-purple-600 font-medium">📖 Reading</div>
                  </div>
                </div>

                {/* Recommended Grade */}
                <div className="mt-8 animate-pop rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-500 to-sky-500 p-6 text-white shadow-lg shadow-emerald-300/40 ring-1 ring-emerald-400/20">
                  <div className="flex items-center justify-center gap-2 text-sm text-emerald-100">
                    <span>🏆</span>
                    <span className="font-medium">Recommended Grade Level</span>
                    <span>🏆</span>
                  </div>
                  <p className="mt-1 text-3xl font-bold font-heading">
                    {result.recommendedGrade}
                  </p>
                  <p className="mt-2 text-sm text-emerald-100">
                    Based on {result.correctAnswers} of {result.totalQuestions} correct answers ✅
                  </p>
                </div>

                {/* Subject Breakdown */}
                <div className="mt-6 rounded-xl bg-gradient-to-br from-gray-50 to-white p-5 text-left ring-1 ring-gray-100 shadow-sm">
                  <h3 className="text-sm font-semibold text-gray-900">📋 Subject Breakdown</h3>
                  {result.breakdown.map((b, i) => (
                    <div
                      key={b.subject}
                      className={`mt-3 flex items-center justify-between rounded-lg p-3 ${
                        i % 2 === 0
                          ? 'bg-gradient-to-r from-emerald-50/50 to-transparent'
                          : 'bg-gradient-to-r from-purple-50/50 to-transparent'
                      }`}
                    >
                      <span className="text-sm font-medium capitalize text-gray-700">
                        {b.subject === 'math' ? '🔢 Mathematics' : '📖 Reading / Language Arts'}
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-sm font-semibold text-gray-900 ring-1 ring-gray-200">
                        {b.correct} / {b.total} ✅
                      </span>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button
                    variant="gold"
                    size="lg"
                    className="flex-1 animate-pop"
                    onClick={handleEnroll}
                  >
                    🚀 Enroll in {result.recommendedGrade}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    variant="sky"
                    size="lg"
                    onClick={handleRetry}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    🔄 Retake Test
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
