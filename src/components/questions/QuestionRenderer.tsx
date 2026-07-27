'use client'

import React from 'react'
import { Question } from '@/types/practice'
import { FillBlankQuestion } from './FillBlankQuestion'
import { DragDropQuestion } from './DragDropQuestion'
import { NumberInputQuestion } from './NumberInputQuestion'

interface Props {
  question: Question
  onAnswer: (answer: any, correct: boolean, attemptNumber: number) => void
  disabled?: boolean
}

export const QuestionRenderer: React.FC<Props> = ({ question, onAnswer, disabled }) => {
  const shared = { question, onAnswer, disabled }

  switch (question.type) {
    case 'fill-blank': return <FillBlankQuestion {...shared} />
    case 'drag-drop': return <DragDropQuestion {...shared} />
    case 'number-input': return <NumberInputQuestion {...shared} />
    // Fall back to fill-blank for unknown types
    default: return <FillBlankQuestion {...shared} />
  }
}
