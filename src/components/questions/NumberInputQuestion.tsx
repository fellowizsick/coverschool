'use client'

import React, { useState } from 'react'
import { Question, NumberInputData } from '@/types/practice'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { CheckCircle, XCircle, Lightbulb, BookOpen } from 'lucide-react'

interface Props {
  question: Question
  onAnswer: (answer: any, correct: boolean, attemptNumber: number) => void
  disabled?: boolean
}

export const NumberInputQuestion: React.FC<Props> = ({ question, onAnswer, disabled = false }) => {
  const [answer, setAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [attemptCount, setAttemptCount] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'incorrect'; message: string } | null>(null)

  const data = question.data as NumberInputData

  const checkAnswer = () => {
    if (disabled || !answer.trim()) return
    const num = parseFloat(answer)
    if (isNaN(num)) return

    const tol = data.tolerance || 0
    const isCorrect = Math.abs(num - data.correct) <= tol
    const inBounds = (data.min === undefined || num >= data.min) && (data.max === undefined || num <= data.max)
    const finalCorrect = isCorrect && inBounds
    const n = attemptCount + 1
    setAttemptCount(n)
    setSubmitted(true)

    if (finalCorrect) {
      setFeedback({ type: 'correct', message: n === 1 ? 'Perfect! Nailed it! 🎉' : 'You got it! 💪' })
    } else {
      let msg = 'Not quite right.'
      if (!inBounds) {
        if (data.min !== undefined && num < data.min) msg += ` The number should be at least ${data.min}.`
        else if (data.max !== undefined && num > data.max) msg += ` The number should be at most ${data.max}.`
      }
      if (n === 1) {
        setFeedback({ type: 'incorrect', message: msg + ' Try again!' })
        setShowHint(true)
      } else {
        setFeedback({ type: 'incorrect', message: msg + ' Check the solution.' })
        setShowSolution(true)
      }
    }
    onAnswer(num, finalCorrect, n)
  }

  const tryAgain = () => { setAnswer(''); setSubmitted(false); setFeedback(null) }

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">{question.question}</h3>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            {data.unit?.startsWith('$') && <span className="text-lg text-gray-600">$</span>}
            <input type="number" value={answer} onChange={e => setAnswer(e.target.value)}
              disabled={disabled || submitted} min={data.min} max={data.max} step={data.tolerance || 0.01}
              className="border-2 border-gray-300 rounded-lg px-4 py-2 text-lg font-medium focus:border-blue-500 focus:outline-none text-center w-32"
              placeholder="0" onKeyDown={e => e.key === 'Enter' && checkAnswer()} />
            {data.unit && !data.unit.startsWith('$') && <span className="text-lg text-gray-600">{data.unit}</span>}
          </div>
          {(data.min !== undefined || data.max !== undefined) && (
            <p className="text-sm text-gray-500 mt-2">
              {data.min !== undefined && data.max !== undefined ? `Enter between ${data.min} and ${data.max}`
                : data.min !== undefined ? `Enter ≥ ${data.min}` : `Enter ≤ ${data.max}`}
            </p>
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
            <p className="text-sm text-blue-600 mt-2">Correct answer: <strong>{data.correct}{data.unit || ''}</strong></p>
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
