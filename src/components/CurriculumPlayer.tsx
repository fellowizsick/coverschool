'use client'

import { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import CompletionCertificate from '@/components/CompletionCertificate'
import type { GradeCurriculum } from '@/lib/curriculum'

type LessonRef = {
  subject: string
  unit: string
  lessonTitle: string
  summary: string
  qIndex: number
  isUnitTest: boolean
  isWeekTest: boolean
  /** Index of the lesson this question belongs to (for week tests) */
  lessonIndex?: number
}

// Flatten a grade into an ordered teaching sequence:
// for each subject -> each quarter -> for each lesson: lesson content, then week test,
// then the unit's check-in questions, then the end-of-unit test.
function buildSequence(grade: GradeCurriculum) {
  const seq: LessonRef[] = []
  grade.subjects.forEach((subj) => {
    subj.units.forEach((unit) => {
      unit.lessons.forEach((les, li) => {
        seq.push({
          subject: subj.name,
          unit: unit.name,
          lessonTitle: les.title,
          summary: les.summary,
          qIndex: -1,
          isUnitTest: false,
          isWeekTest: false,
        })
        // End-of-week test after each lesson
        if (les.weekTest && les.weekTest.length > 0) {
        les.weekTest.forEach((_q, wi) => {
          seq.push({
            subject: subj.name,
            unit: unit.name,
            lessonTitle: `Week ${li + 1} Test: ${les.title}`,
            summary: '',
            qIndex: wi,
            isUnitTest: false,
            isWeekTest: true,
            lessonIndex: li,
          })
          })
        }
      })
      // check-in questions follow the unit's lessons
      unit.questions.forEach((_q, i) => {
        seq.push({
          subject: subj.name,
          unit: unit.name,
          lessonTitle: `Check-in: ${unit.name}`,
          summary: '',
          qIndex: i,
          isUnitTest: false,
          isWeekTest: false,
        })
      })
      // end-of-unit test follows check-ins
      if (unit.unitTest && unit.unitTest.length > 0) {
        unit.unitTest.forEach((_q, i) => {
          seq.push({
            subject: subj.name,
            unit: unit.name,
            lessonTitle: `Unit Test: ${unit.name}`,
            summary: '',
            qIndex: i,
            isUnitTest: true,
            isWeekTest: false,
          })
        })
      }
    })
  })
  return seq
}

function progressKey(enrollmentId: string) {
  return `lca_curriculum_${enrollmentId}`
}

export default function CurriculumPlayer({
  grade,
  enrollmentId,
  studentName,
  gradeNum,
}: {
  grade: GradeCurriculum
  enrollmentId: string
  studentName: string
  gradeNum: number
}) {
  const sequence = useMemo(() => buildSequence(grade), [grade])
  const [done, setDone] = useState<boolean[]>([])
  const [current, setCurrent] = useState(0)
  const [celebrate, setCelebrate] = useState(false)
  const [answer, setAnswer] = useState<string | number | null>(null)
  const [answeredCorrect, setAnsweredCorrect] = useState<boolean | null>(null)
  const [streak, setStreak] = useState(0)
  const [stars, setStars] = useState(0)
  const [showStarsAnimation, setShowStarsAnimation] = useState(false)

  // Load progress: prefer Supabase (cross-device), fall back to localStorage
  useEffect(() => {
    let cancelled = false
    async function load() {
      // try Supabase first
      try {
        const res = await fetch(`/api/curriculum-progress?enrollmentId=${enrollmentId}`)
        const j = await res.json()
        if (Array.isArray(j.completed_steps) && j.completed_steps.length === sequence.length) {
          if (!cancelled) {
            setDone(j.completed_steps)
            const firstUndone = j.completed_steps.findIndex((d: boolean) => !d)
            setCurrent(firstUndone === -1 ? j.completed_steps.length - 1 : firstUndone)
          }
          return
        }
      } catch {
        /* offline — fall through to localStorage */
      }
      // fallback localStorage
      try {
        const raw = localStorage.getItem(progressKey(enrollmentId))
        if (raw) {
          const arr = JSON.parse(raw) as boolean[]
          if (!cancelled) {
            setDone(arr)
            const firstUndone = arr.findIndex((d) => !d)
            setCurrent(firstUndone === -1 ? arr.length - 1 : firstUndone)
          }
          return
        }
      } catch {
        /* ignore */
      }
      if (!cancelled) setDone(new Array(sequence.length).fill(false))
    }
    load()
    return () => {
      cancelled = true
    }
  }, [enrollmentId, sequence.length])

  async function persist(next: boolean[]) {
    setDone(next)
    // localStorage cache (instant + offline)
    try {
      localStorage.setItem(progressKey(enrollmentId), JSON.stringify(next))
    } catch {
      /* ignore */
    }
    // Supabase sync (cross-device) — fire and forget
    try {
      await fetch('/api/curriculum-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enrollmentId, completed_steps: next }),
      })
    } catch {
      /* offline — localStorage already saved */
    }
  }

  const node = sequence[current]
  const total = sequence.length
  const completedCount = done.filter(Boolean).length
  const pct = Math.round((completedCount / total) * 100)

  // Is this node a question node?
  const isQuestion = node.qIndex >= 0
  // find the actual question object
  let question: any = null
  if (isQuestion) {
    const subj = grade.subjects.find((s) => s.name === node.subject)!
    const unit = subj.units.find((u) => u.name === node.unit)!
    if (node.isWeekTest) {
      const les = unit.lessons[node.lessonIndex ?? 0]
      question = les.weekTest?.[node.qIndex] ?? null
    } else if (node.isUnitTest) {
      question = unit.unitTest?.[node.qIndex] ?? null
    } else {
      question = unit.questions[node.qIndex]
    }
  }

  function markComplete() {
    const next = [...done]
    next[current] = true
    persist(next)
    setCelebrate(true)
    setTimeout(() => {
      setCelebrate(false)
      if (current < total - 1) setCurrent(current + 1)
      setAnswer(null)
      setAnsweredCorrect(null)
    }, 2200)
  }

  function onAnswer(val: string | number) {
    setAnswer(val)
    const correct =
      question.type === 'mc'
        ? val === question.answer
        : String(val).trim().toLowerCase() === String(question.answer).trim().toLowerCase()
    setAnsweredCorrect(correct)
    if (correct) {
      const newStreak = streak + 1
      setStreak(newStreak)
      setStars(stars + 1)
      setShowStarsAnimation(true)
      setTimeout(() => setShowStarsAnimation(false), 1500)
      // correct -> celebrate + unlock
      setTimeout(() => {
        setCelebrate(true)
        setTimeout(() => {
          setCelebrate(false)
          if (current < total - 1) setCurrent(current + 1)
          setAnswer(null)
          setAnsweredCorrect(null)
        }, 2200)
      }, 500)
    } else {
      setStreak(0)
    }
  }

  const PRAISE = [
    '🌟 You got it!',
    '🎉 Amazing job!',
    '🔥 You are on fire!',
    '⭐ Brilliant!',
    '💡 That\u2019s right!',
    '🏆 Way to go!',
    '🌈 Super smart!',
    '💪 You\u2019re learning!',
  ]
  const STREAK_PRAISE = [
    '🔥🔥🔥 ON FIRE!',
    '⭐⭐⭐ STAR POWER!',
    '💪 UNSTOPPABLE!',
    '🏆 CRUSHING IT!',
    '🚀 ROCKET MODE!',
    '👑 ABSOLUTE LEGEND!',
  ]
  const praise = PRAISE[current % PRAISE.length]
  const streakPraise = STREAK_PRAISE[Math.min(streak - 1, STREAK_PRAISE.length - 1)]

  // Age-appropriate, fun visual theme for the STUDY screen.
  function playerTheme(num: number) {
    if (num <= 2)
      return {
        bg: 'from-pink-100 via-yellow-50 to-sky-100',
        orb: 'from-pink-400 to-yellow-400',
        chip: 'text-pink-600',
        particles: ['🎈', '⭐', '🌈', '🧸', '🍎', '🦄'],
        mascot: '🦄',
        font: "'Comic Sans MS', 'Trebuchet MS', sans-serif",
      }
    if (num <= 5)
      return {
        bg: 'from-violet-100 via-fuchsia-50 to-indigo-100',
        orb: 'from-violet-500 to-fuchsia-400',
        chip: 'text-violet-600',
        particles: ['🚀', '⭐', '🪐', '🌟', '💫', '🛸'],
        mascot: '🚀',
        font: "'Trebuchet MS', sans-serif",
      }
    if (num <= 8)
      return {
        bg: 'from-blue-50 via-cyan-50 to-emerald-100',
        orb: 'from-blue-500 to-emerald-400',
        chip: 'text-blue-600',
        particles: ['🌿', '💧', '🌟', '🍃', '⚡', '🌊'],
        mascot: '🌟',
        font: "'Georgia', serif",
      }
    return {
      bg: 'from-slate-100 via-indigo-50 to-purple-100',
      orb: 'from-indigo-600 to-purple-500',
      chip: 'text-indigo-700',
      particles: ['📚', '🧠', '⚡', '🌟', '💡', '🎯'],
      mascot: '🎯',
      font: "'Georgia', serif",
    }
  }
  const pt = playerTheme(gradeNum)

  return (
    <div
      className={`min-h-screen bg-gradient-to-b ${pt.bg} relative overflow-hidden`}
      style={{ fontFamily: pt.font }}
    >
      {/* Ambient floating particles (digital cool effect) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {pt.particles.map((p, i) => (
          <span
            key={i}
            className="absolute text-3xl float-particle opacity-70"
            style={{
              left: `${(i * 17) % 95}%`,
              top: `${(i * 23) % 90}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${6 + (i % 4)}s`,
            }}
          >
            {p}
          </span>
        ))}
      </div>

      {/* Progress bar */}
      <div className="sticky top-0 z-10 bg-white/70 backdrop-blur border-b border-white/60">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between text-sm text-slate-500 mb-1">
            <span>
              {grade.grade} · Step {current + 1} of {total}
            </span>
            <span>{pct}% complete</span>
          </div>
          <div className="h-2 rounded-full bg-white/60 overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${pt.orb} transition-all duration-500`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-8">
        {/* Subject chip */}
        <div className={`text-xs font-semibold uppercase tracking-wide ${pt.chip} mb-2`}>
          {node.subject} · {node.unit}
        </div>

        <Card className="backdrop-blur bg-white/80">
          <CardContent className="p-6">
            {!isQuestion ? (
              <>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl animate-bob">{pt.mascot}</span>
                  <h2 className="text-2xl font-bold text-slate-900">{node.lessonTitle}</h2>
                </div>
                <p className="text-lg text-slate-600 leading-relaxed mb-6">{node.summary}</p>
                <div className={`rounded-xl bg-white/70 p-4 ${pt.chip} text-sm border border-white`}>
                  Read this carefully. When you’re ready, tap “Mark as Done” to
                  unlock the next step. 📖
                </div>
                <div className="mt-6 flex gap-3">
                  <Button onClick={markComplete} variant="gold" size="lg" className="flex-1">
                    ✅ Mark as Done &amp; Continue
                  </Button>
                  {current > 0 && (
                    <Button onClick={() => setCurrent(current - 1)} variant="outline" size="lg">
                      ← Back
                    </Button>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl animate-bob">{pt.mascot}</span>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {node.isUnitTest ? '📋 End of Unit Test' : node.isWeekTest ? '📋 End of Week Test' : '📝 Check-in'}
                  </h2>
                </div>
                {node.isUnitTest && (
                  <div className="mb-4 rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm text-amber-700">
                    This test covers everything you learned in this section. Take your time!
                  </div>
                )}
                {node.isWeekTest && (
                  <div className="mb-4 rounded-lg bg-blue-50 border border-blue-200 p-3 text-sm text-blue-700">
                    End of week test — how well do you remember what you learned?
                  </div>
                )}
                <p className="text-lg text-slate-700 mb-6">{question.q}</p>
                {question.type === 'mc' ? (
                  <div className="grid gap-3">
                    {question.options.map((opt: string, i: number) => {
                      const chosen = answer === i
                      const showRight = answeredCorrect && chosen
                      const showWrong = answeredCorrect === false && chosen
                      return (
                        <button
                          key={i}
                          disabled={answeredCorrect !== null}
                          onClick={() => onAnswer(i)}
                          className={`text-left rounded-xl border-2 px-4 py-3 font-medium transition ${
                            showRight
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                              : showWrong
                              ? 'border-red-400 bg-red-50 text-red-700'
                              : 'border-slate-200 hover:border-indigo-400 hover:bg-indigo-50'
                          }`}
                        >
                          {String.fromCharCode(65 + i)}. {opt}
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <input
                      type="text"
                      disabled={answeredCorrect !== null}
                      value={answer as string}
                      onChange={(e) => setAnswer(e.target.value)}
                      placeholder="Type your answer…"
                      className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-lg focus:border-indigo-400 focus:outline-none"
                    />
                    <Button
                      onClick={() => onAnswer(answer as string)}
                      variant="gold"
                      size="lg"
                      disabled={answeredCorrect !== null || !answer}
                    >
                      Check Answer ✨
                    </Button>
                  </div>
                )}

                {answeredCorrect === false && (
                  <div className="mt-4 rounded-xl bg-red-50 border border-red-200 p-4 text-red-700 text-sm">
                    Not quite — read the lesson again and try! You’ve got this. 💪
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Completion banner + certificate */}
        {completedCount === total && (
          <CompletionCertificate
            studentName={studentName}
            grade={grade.grade}
            gradeNum={gradeNum}
            date={new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          />
        )}
      </div>

      {/* CELEBRATION OVERLAY */}
      {celebrate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="absolute inset-0 bg-emerald-400/10" />
          <div className="relative text-center animate-pop">
            <div className="text-7xl mb-2">🎉</div>
            <div className="text-3xl font-extrabold text-emerald-700 drop-shadow">
              {praise}
            </div>
            <div className="mt-2 text-2xl">⭐🌟✨</div>
          </div>
          {/* confetti */}
          <div className="absolute inset-0 overflow-hidden">
            {['🎊', '🌟', '✨', '💫', '🏆', '⭐'].map((e, i) => (
              <span
                key={i}
                className="absolute text-2xl animate-fall"
                style={{
                  left: `${10 + i * 14}%`,
                  top: '-10%',
                  animationDelay: `${i * 0.1}s`,
                }}
              >
                {e}
              </span>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes pop {
          0% { transform: scale(0.6); opacity: 0; }
          40% { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-pop { animation: pop 0.5s ease-out; }
        @keyframes fall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
        }
        .animate-fall { animation: fall 1.6s linear forwards; }
        @keyframes floatParticle {
          0% { transform: translateY(0) rotate(0deg); opacity: 0.25; }
          50% { transform: translateY(-26px) rotate(12deg); opacity: 0.85; }
          100% { transform: translateY(0) rotate(0deg); opacity: 0.25; }
        }
        .float-particle { animation: floatParticle 7s ease-in-out infinite; }
        @keyframes bob {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bob { animation: bob 2.2s ease-in-out infinite; display: inline-block; }
      `}</style>
    </div>
  )
}
