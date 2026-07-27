'use client'

import React, { useState } from 'react'
import { Question, FillBlankData } from '@/types/practice'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { CheckCircle, XCircle, Lightbulb, BookOpen } from 'lucide-react'

interface Props {
  question: Question
  onAnswer: (answer: any, correct: boolean, attemptNumber: number) => void
  disabled?: boolean
}

export const FillBlankQuestion: React.FC<Props> = ({ question, onAnswer, disabled = false }) => {
  const [answer, setAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [attemptCount, setAttemptCount] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'incorrect'; message: string } | null>(null)

  const data = question.data as FillBlankData

  const checkAnswer = () => {
    if (disabled || !answer.trim()) return
    const userAnswer = data.caseSensitive ? answer.trim() : answer.trim().toLowerCase()
    const correctAnswers = data.caseSensitive ? data.answers : data.answers.map(a => a.toLowerCase())
    const isCorrect = correctAnswers.includes(userAnswer)
    const n = attemptCount + 1
    setAttemptCount(n)
    setSubmitted(true)

    if (isCorrect) {
      setFeedback({ type: 'correct', message: n === 1 ? 'Perfect! You got it right first try! 🎉' : 'Great job figuring it out! 💪' })
    } else if (n === 1) {
      setFeedback({ type: 'incorrect', message: 'Not quite right. Think about it and try again!' })
      setShowHint(true)
    } else {
      setFeedback({ type: 'incorrect', message: n === 2 ? 'Keep trying! Check the solution below.' : "Don't worry — practice makes perfect!" })
      if (n >= 2) setShowSolution(true)
    }
    onAnswer(answer, isCorrect, n)
  }

  const tryAgain = () => {
    setAnswer('')
    setSubmitted(false)
    setFeedback(null)
  }

  const parts = data.template.split('___')

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">{question.question}</h3>

        <div className="text-center">
          {parts.length === 2 ? (
            <div className="text-lg flex items-center justify-center flex-wrap gap-2">
              <span>{parts[0]}</span>
              <input type="text" value={answer} onChange={e => setAnswer(e.target.value)}
                disabled={disabled || submitted}
                className="border-2 border-gray-300 rounded-lg px-3 py-1 text-lg font-medium focus:border-blue-500 focus:outline-none min-w-[120px] text-center"
                placeholder="?" onKeyDown={e => e.key === 'Enter' && checkAnswer()} />
              <span>{parts[1]}</span>
            </div>
          ) : (
            <div>
              <p className="mb-3">{question.question}</p>
              <input type="text" value={answer} onChange={e => setAnswer(e.target.value)}
                disabled={disabled || submitted}
                className="border-2 border-gray-300 rounded-lg px-4 py-2 text-lg font-medium focus:border-blue-500 focus:outline-none"
                placeholder="Type your answer..." onKeyDown={e => e.key === 'Enter' && checkAnswer()} />
            </div>
          )}
        </div>

        {feedback && (
          <div className={`flex items-center gap-2 p-3 rounded-lg ${feedback.type === 'correct' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {feedback.type === 'correct' ? <CheckCircle size={20} /> : <XCircle size={20} />}
            <span>{feedback.message}</span>
          </div>
        )}

        {showHint && question.hint && !showSolution && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
            <div className="flex items-center gap-2 text-yellow-800"><Lightbulb size={20} /><span className="font-medium">Hint:</span></div>
            <p className="text-yellow-700 mt-1">{question.hint}</p>
          </div>
        )}

        {showSolution && question.solution && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
            <div className="flex items-center gap-2 text-blue-800"><BookOpen size={20} /><span className="font-medium">Solution:</span></div>
            <p className="text-blue-700 mt-1">{question.solution}</p>
            <p className="text-sm text-blue-600 mt-2">Correct answer: <strong>{data.answers[0]}</strong></p>
          </div>
        )}

        <div className="flex gap-3 justify-center">
          {!submitted && <Button onClick={checkAnswer} disabled={disabled || !answer.trim()}>Submit Answer</Button>}
          {submitted && feedback?.type === 'incorrect' && attemptCount < 3 && (
            <Button onClick={tryAgain} variant="secondary">Try Again</Button>
          )}
        </div>
      </div>
    </Card>
  )
}
