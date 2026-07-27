'use client'

import React, { useState, useEffect } from 'react'
import { Question } from '@/types/practice'
import { QuestionRenderer } from '../questions/QuestionRenderer'
import { usePracticeStore } from '@/stores/practiceStore'
import { Button } from '@/components/ui/Button'
import { ArrowRight, RotateCcw } from 'lucide-react'

interface Props {
  questions: Question[]
  onComplete: (score: number, total: number) => void
  title?: string
}

export const PracticeEngine: React.FC<Props> = ({ questions, onComplete, title = 'Practice Session' }) => {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [sessionScore, setSessionScore] = useState(0)
  const [answered, setAnswered] = useState(false)

  const { recordAttempt, startSession, completeSession } = usePracticeStore()
  const current = questions[currentIdx]
  const isLast = currentIdx === questions.length - 1

  useEffect(() => { startSession(questions) }, [])

  const handleAnswer = (answer: any, correct: boolean, attemptNumber: number) => {
    if (answered) return
    recordAttempt({
      questionId: current.id,
      skillIds: current.skillIds,
      answer,
      correct,
      attemptNumber,
      timestamp: new Date(),
      hintsUsed: attemptNumber > 1,
      solutionViewed: attemptNumber > 2,
    })
    if (correct) setSessionScore(p => p + (attemptNumber === 1 ? 1 : 0.5))
    setAnswered(true)
  }

  const handleNext = () => {
    if (isLast) {
      completeSession()
      onComplete(sessionScore, questions.length)
    } else {
      setCurrentIdx(p => p + 1)
      setAnswered(false)
    }
  }

  const handleRestart = () => {
    setCurrentIdx(0)
    setSessionScore(0)
    setAnswered(false)
    startSession(questions)
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Question {currentIdx + 1} of {questions.length}</span>
          <span>Score: {sessionScore.toFixed(1)} / {questions.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
          <div className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }} />
        </div>
      </div>

      <div className="mb-6">
        <QuestionRenderer question={current} onAnswer={handleAnswer} disabled={answered} />
      </div>

      <div className="flex justify-between">
        <Button onClick={handleRestart} variant="ghost" className="flex items-center gap-2">
          <RotateCcw size={16} /> Restart
        </Button>
        {answered && (
          <Button onClick={handleNext} variant="primary" className="flex items-center gap-2">
            {isLast ? 'See Results' : 'Next'} <ArrowRight size={16} />
          </Button>
        )}
      </div>
    </div>
  )
}
