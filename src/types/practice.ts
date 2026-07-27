export interface Skill {
  id: string
  name: string
  subject: string
  grade: number
  unit: number
  lesson: number
}

export interface Question {
  id: string
  skillIds: string[]
  type: 'multiple-choice' | 'fill-blank' | 'drag-drop' | 'number-input' | 'true-false' | 'multi-select'
  question: string
  data: QuestionData
  hint?: string
  solution?: string
}

export type QuestionData =
  | MultipleChoiceData
  | FillBlankData
  | DragDropData
  | NumberInputData
  | TrueFalseData
  | MultiSelectData

export interface MultipleChoiceData {
  options: string[]
  correct: number
}

export interface FillBlankData {
  template: string
  answers: string[]
  caseSensitive?: boolean
}

export interface DragDropData {
  type: 'matching' | 'ordering' | 'sorting'
  items: DragItem[]
  targets?: DragTarget[]
  correctOrder?: string[]
}

export interface DragItem {
  id: string
  content: string
  correctTarget?: string
  category?: string
}

export interface DragTarget {
  id: string
  label: string
  acceptsCategory?: string
}

export interface NumberInputData {
  correct: number
  tolerance?: number
  unit?: string
  min?: number
  max?: number
}

export interface TrueFalseData {
  correct: boolean
}

export interface MultiSelectData {
  options: string[]
  correct: number[]
  minSelections?: number
  maxSelections?: number
}

export interface Attempt {
  questionId: string
  skillIds: string[]
  answer: any
  correct: boolean
  attemptNumber: number
  timestamp: Date
  hintsUsed: boolean
  solutionViewed: boolean
}

export interface SkillMastery {
  skillId: string
  status: 'not-started' | 'practiced' | 'needs-help' | 'mastered'
  totalAttempts: number
  correctFirstTry: number
  sessionsWorkedOn: number
  lastPracticed?: Date
  masteredAt?: Date
}

export interface PracticeSession {
  id: string
  skillIds: string[]
  questions: Question[]
  startedAt: Date
  completedAt?: Date
  score: number
  totalQuestions: number
}
