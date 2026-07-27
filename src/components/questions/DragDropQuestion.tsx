'use client'

import React, { useState } from 'react'
import { Question, DragDropData } from '@/types/practice'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { CheckCircle, XCircle, Lightbulb, BookOpen } from 'lucide-react'

interface Props {
  question: Question
  onAnswer: (answer: any, correct: boolean, attemptNumber: number) => void
  disabled?: boolean
}

export const DragDropQuestion: React.FC<Props> = ({ question, onAnswer, disabled = false }) => {
  const data = question.data as DragDropData
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [droppedItems, setDroppedItems] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [attemptCount, setAttemptCount] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'incorrect'; message: string } | null>(null)

  const handleDragStart = (itemId: string) => setDraggedItem(itemId)
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move' }
  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    if (draggedItem) {
      setDroppedItems(p => ({ ...p, [targetId]: draggedItem }))
      setDraggedItem(null)
    }
  }
  const removeItem = (targetId: string) => {
    setDroppedItems(p => { const n = { ...p }; delete n[targetId]; return n })
  }

  const checkAnswer = () => {
    if (disabled) return
    const n = attemptCount + 1
    setAttemptCount(n)
    setSubmitted(true)

    let isCorrect = false
    if (data.type === 'matching') {
      isCorrect = data.items.every(item => {
        const t = Object.entries(droppedItems).find(([_, id]) => id === item.id)?.[0]
        return t === item.correctTarget
      })
    } else if (data.type === 'ordering') {
      const order = data.targets?.map(t => droppedItems[t.id]).filter(Boolean) || []
      isCorrect = JSON.stringify(order) === JSON.stringify(data.correctOrder)
    }

    if (isCorrect) {
      setFeedback({ type: 'correct', message: n === 1 ? 'Perfect! All correct! 🎉' : 'You got them all! 💪' })
    } else if (n === 1) {
      setFeedback({ type: 'incorrect', message: 'Not quite right. Look carefully and try again!' })
      setShowHint(true)
    } else {
      setFeedback({ type: 'incorrect', message: 'Check the solution to see the correct order.' })
      setShowSolution(true)
    }
    onAnswer(droppedItems, isCorrect, n)
  }

  const tryAgain = () => { setDroppedItems({}); setSubmitted(false); setFeedback(null) }

  const getAvailable = () => data.items.filter(item => !Object.values(droppedItems).includes(item.id))

  return (
    <Card className="p-6 max-w-4xl mx-auto">
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800">{question.question}</h3>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-700 mb-3">Drag these items:</h4>
          <div className="flex flex-wrap gap-2">
            {getAvailable().map(item => (
              <div key={item.id} draggable={!disabled && !submitted}
                onDragStart={() => handleDragStart(item.id)}
                className={`px-3 py-2 bg-white border-2 border-gray-300 rounded-lg cursor-move hover:border-blue-400 transition-colors ${draggedItem === item.id ? 'opacity-50' : ''} ${disabled || submitted ? 'cursor-not-allowed opacity-60' : ''}`}>
                {item.content}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-gray-700">Drop them here:</h4>
          <div className={`grid gap-3 ${data.type === 'ordering' ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-3'}`}>
            {data.targets?.map(target => {
              const droppedId = droppedItems[target.id]
              const dropped = data.items.find(i => i.id === droppedId)
              return (
                <div key={target.id} onDragOver={handleDragOver} onDrop={e => handleDrop(e, target.id)}
                  className="min-h-[80px] p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex flex-col items-center justify-center hover:border-blue-400 transition-colors">
                  <div className="text-sm text-gray-600 mb-2">{target.label}</div>
                  {dropped ? (
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded">{dropped.content}</span>
                      {!submitted && <button onClick={() => removeItem(target.id)} className="text-red-500 hover:text-red-700 text-lg leading-none">×</button>}
                    </div>
                  ) : <div className="text-gray-400 text-sm">Drop here</div>}
                </div>
              )
            })}
          </div>
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
          </div>
        )}

        <div className="flex gap-3 justify-center">
          {!submitted && (
            <Button onClick={checkAnswer} disabled={disabled || Object.keys(droppedItems).length !== data.targets?.length} variant="primary">
              Check Answer
            </Button>
          )}
          {submitted && feedback?.type === 'incorrect' && attemptCount < 3 && (
            <Button onClick={tryAgain} variant="secondary">Try Again</Button>
          )}
        </div>
      </div>
    </Card>
  )
}
