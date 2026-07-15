export type Subject = 'math' | 'reading'

export interface Question {
  id: string
  subject: Subject
  question: string
  options: string[]
  correctIndex: number
  /** The grade level this question tests at */
  gradeLevel: number // 1-9
}

export interface AssessmentResult {
  totalQuestions: number
  correctAnswers: number
  score: number // percentage 0-100
  mathScore: number
  readingScore: number
  recommendedGrade: string
  recommendedGradeNum: number
  breakdown: { subject: Subject; correct: number; total: number }[]
}

// ===== QUESTION BANK =====
// Questions span grades 1-9. Each question maps to a grade level.
// The test adapts by having questions at various levels.

const mathQuestions: Question[] = [
  // Grade 1-2 level
  {
    id: 'm1',
    subject: 'math',
    question: 'What is 7 + 5?',
    options: ['11', '12', '13', '14'],
    correctIndex: 1,
    gradeLevel: 1,
  },
  {
    id: 'm2',
    subject: 'math',
    question: 'What is 20 - 8?',
    options: ['10', '11', '12', '13'],
    correctIndex: 2,
    gradeLevel: 1,
  },
  {
    id: 'm3',
    subject: 'math',
    question: 'Which shape has 4 equal sides?',
    options: ['Triangle', 'Rectangle', 'Square', 'Circle'],
    correctIndex: 2,
    gradeLevel: 1,
  },
  {
    id: 'm4',
    subject: 'math',
    question: 'What is 3 × 4?',
    options: ['7', '10', '12', '14'],
    correctIndex: 2,
    gradeLevel: 2,
  },
  {
    id: 'm5',
    subject: 'math',
    question: 'What fraction is shaded if a circle is divided into 4 equal parts and 1 is shaded?',
    options: ['1/2', '1/3', '1/4', '3/4'],
    correctIndex: 2,
    gradeLevel: 2,
  },
  {
    id: 'm6',
    subject: 'math',
    question: 'What is the value of the digit 5 in the number 352?',
    options: ['5', '50', '500', '5,000'],
    correctIndex: 1,
    gradeLevel: 2,
  },
  // Grade 3-4 level
  {
    id: 'm7',
    subject: 'math',
    question: 'What is 156 + 237?',
    options: ['383', '393', '403', '413'],
    correctIndex: 1,
    gradeLevel: 3,
  },
  {
    id: 'm8',
    subject: 'math',
    question: 'What is 7 × 8?',
    options: ['48', '54', '56', '64'],
    correctIndex: 2,
    gradeLevel: 3,
  },
  {
    id: 'm9',
    subject: 'math',
    question: 'What is the perimeter of a rectangle with length 8 and width 3?',
    options: ['11', '22', '24', '32'],
    correctIndex: 1,
    gradeLevel: 3,
  },
  {
    id: 'm10',
    subject: 'math',
    question: 'What is 3/4 as a decimal?',
    options: ['0.25', '0.5', '0.75', '0.8'],
    correctIndex: 2,
    gradeLevel: 4,
  },
  {
    id: 'm11',
    subject: 'math',
    question: 'What is 2,457 rounded to the nearest hundred?',
    options: ['2,400', '2,450', '2,460', '2,500'],
    correctIndex: 3,
    gradeLevel: 4,
  },
  {
    id: 'm12',
    subject: 'math',
    question: 'How many degrees are in a right angle?',
    options: ['45°', '90°', '180°', '360°'],
    correctIndex: 1,
    gradeLevel: 4,
  },
  // Grade 5-6 level
  {
    id: 'm13',
    subject: 'math',
    question: 'What is 5/6 × 3/5?',
    options: ['1/2', '2/3', '3/4', '1'],
    correctIndex: 0,
    gradeLevel: 5,
  },
  {
    id: 'm14',
    subject: 'math',
    question: 'What is the mean (average) of 12, 15, 18, and 11?',
    options: ['13', '14', '15', '16'],
    correctIndex: 1,
    gradeLevel: 5,
  },
  {
    id: 'm15',
    subject: 'math',
    question: 'What is 25% of 200?',
    options: ['25', '40', '50', '75'],
    correctIndex: 2,
    gradeLevel: 5,
  },
  {
    id: 'm16',
    subject: 'math',
    question: 'Solve: 3x + 7 = 22. What is x?',
    options: ['3', '5', '7', '15'],
    correctIndex: 1,
    gradeLevel: 6,
  },
  {
    id: 'm17',
    subject: 'math',
    question: 'What is the area of a triangle with base 10 and height 6?',
    options: ['16', '30', '60', '36'],
    correctIndex: 1,
    gradeLevel: 6,
  },
  {
    id: 'm18',
    subject: 'math',
    question: 'What is -8 + (-3)?',
    options: ['-11', '-5', '5', '11'],
    correctIndex: 0,
    gradeLevel: 6,
  },
  // Grade 7-8 level
  {
    id: 'm19',
    subject: 'math',
    question: 'Solve: 2(x - 4) = 12. What is x?',
    options: ['8', '10', '12', '14'],
    correctIndex: 1,
    gradeLevel: 7,
  },
  {
    id: 'm20',
    subject: 'math',
    question: 'What is the slope of the line y = 3x + 5?',
    options: ['3', '5', '3/5', '-3'],
    correctIndex: 0,
    gradeLevel: 7,
  },
  {
    id: 'm21',
    subject: 'math',
    question: 'If a triangle has angles of 45° and 75°, what is the third angle?',
    options: ['50°', '60°', '70°', '80°'],
    correctIndex: 1,
    gradeLevel: 7,
  },
  {
    id: 'm22',
    subject: 'math',
    question: 'Simplify: (x²)(x³)',
    options: ['x⁵', 'x⁶', '2x⁵', 'x²'],
    correctIndex: 0,
    gradeLevel: 8,
  },
  {
    id: 'm23',
    subject: 'math',
    question: 'What is the distance between points (2, 3) and (6, 6)?',
    options: ['3', '4', '5', '6'],
    correctIndex: 2,
    gradeLevel: 8,
  },
  {
    id: 'm24',
    subject: 'math',
    question: 'Solve: x² = 49. What is x?',
    options: ['±7', '7', '-7', '±9'],
    correctIndex: 0,
    gradeLevel: 8,
  },
  // Grade 9 level
  {
    id: 'm25',
    subject: 'math',
    question: 'Solve: 3x - 7 = 2x + 5. What is x?',
    options: ['10', '12', '14', '16'],
    correctIndex: 1,
    gradeLevel: 9,
  },
  {
    id: 'm26',
    subject: 'math',
    question: 'What is the y-intercept of y = 2x² + 3x - 5?',
    options: ['2', '3', '-5', '5'],
    correctIndex: 2,
    gradeLevel: 9,
  },
]

const readingQuestions: Question[] = [
  // Grade 1-2 level
  {
    id: 'r1',
    subject: 'reading',
    question: 'Which word is a noun?',
    options: ['Run', 'Happy', 'Dog', 'Quickly'],
    correctIndex: 2,
    gradeLevel: 1,
  },
  {
    id: 'r2',
    subject: 'reading',
    question: 'Which sentence has correct punctuation?',
    options: ['i like dogs', 'I like dogs', 'I like dogs.', 'I like dogs?'],
    correctIndex: 2,
    gradeLevel: 1,
  },
  {
    id: 'r3',
    subject: 'reading',
    question: 'What is the opposite of "big"?',
    options: ['Tall', 'Small', 'Wide', 'Heavy'],
    correctIndex: 1,
    gradeLevel: 1,
  },
  {
    id: 'r4',
    subject: 'reading',
    question: 'Which word is a verb?',
    options: ['Table', 'Beautiful', 'Jump', 'Slowly'],
    correctIndex: 2,
    gradeLevel: 2,
  },
  {
    id: 'r5',
    subject: 'reading',
    question: 'What does "happy" mean?',
    options: ['Sad', 'Angry', 'Joyful', 'Tired'],
    correctIndex: 2,
    gradeLevel: 2,
  },
  {
    id: 'r6',
    subject: 'reading',
    question: 'Which is a complete sentence?',
    options: ['The boy.', 'Running fast.', 'The boy ran fast.', 'Because he ran.'],
    correctIndex: 2,
    gradeLevel: 2,
  },
  // Grade 3-4 level
  {
    id: 'r7',
    subject: 'reading',
    question: 'What is the plural of "child"?',
    options: ['Childs', 'Childes', 'Children', 'Childrens'],
    correctIndex: 2,
    gradeLevel: 3,
  },
  {
    id: 'r8',
    subject: 'reading',
    question: 'Which word is an adjective in the sentence: "The blue car drove slowly."?',
    options: ['Car', 'Blue', 'Drove', 'Slowly'],
    correctIndex: 1,
    gradeLevel: 3,
  },
  {
    id: 'r9',
    subject: 'reading',
    question: '"The sun smiled down on us" is an example of:',
    options: ['Simile', 'Metaphor', 'Personification', 'Alliteration'],
    correctIndex: 2,
    gradeLevel: 3,
  },
  {
    id: 'r10',
    subject: 'reading',
    question: 'What is the main purpose of a topic sentence?',
    options: ['To end the paragraph', 'To introduce the main idea', 'To add details', 'To ask a question'],
    correctIndex: 1,
    gradeLevel: 4,
  },
  {
    id: 'r11',
    subject: 'reading',
    question: 'Which word is spelled correctly?',
    options: ['Recieve', 'Receive', 'Receeve', 'Reseive'],
    correctIndex: 1,
    gradeLevel: 4,
  },
  {
    id: 'r12',
    subject: 'reading',
    question: 'What does "courageous" mean?',
    options: ['Fearful', 'Brave', 'Kind', 'Strong'],
    correctIndex: 1,
    gradeLevel: 4,
  },
  // Grade 5-6 level
  {
    id: 'r13',
    subject: 'reading',
    question: '"He ran like the wind" is an example of:',
    options: ['Metaphor', 'Simile', 'Hyperbole', 'Onomatopoeia'],
    correctIndex: 1,
    gradeLevel: 5,
  },
  {
    id: 'r14',
    subject: 'reading',
    question: 'What is a synonym for "difficult"?',
    options: ['Easy', 'Simple', 'Challenging', 'Pleasant'],
    correctIndex: 2,
    gradeLevel: 5,
  },
  {
    id: 'r15',
    subject: 'reading',
    question: 'What is the prefix in the word "unhappiness"?',
    options: ['ness', 'happy', 'un', 'hap'],
    correctIndex: 2,
    gradeLevel: 5,
  },
  {
    id: 'r16',
    subject: 'reading',
    question: 'Which sentence uses correct subject-verb agreement?',
    options: ['The group of students are singing.', 'The group of students is singing.', 'The group of students am singing.', 'The group of students be singing.'],
    correctIndex: 1,
    gradeLevel: 6,
  },
  {
    id: 'r17',
    subject: 'reading',
    question: 'What is the theme of a story?',
    options: ['The setting', 'The main character', 'The central message or lesson', 'The plot twist'],
    correctIndex: 2,
    gradeLevel: 6,
  },
  {
    id: 'r18',
    subject: 'reading',
    question: 'Which is a complex sentence?',
    options: ['I went home.', 'I went home and ate dinner.', 'I went home because I was tired.', 'I went home, ate dinner, and slept.'],
    correctIndex: 2,
    gradeLevel: 6,
  },
  // Grade 7-8 level
  {
    id: 'r19',
    subject: 'reading',
    question: 'What is a logical fallacy?',
    options: ['A valid argument', 'An error in reasoning', 'A type of poem', 'A rhetorical question'],
    correctIndex: 1,
    gradeLevel: 7,
  },
  {
    id: 'r20',
    subject: 'reading',
    question: 'Which literary device repeats consonant sounds at the beginning of words?',
    options: ['Assonance', 'Alliteration', 'Consonance', 'Rhyme'],
    correctIndex: 1,
    gradeLevel: 7,
  },
  {
    id: 'r21',
    subject: 'reading',
    question: 'What is irony?',
    options: ['When events turn out opposite of expectations', 'A type of metaphor', 'A sad story', 'A humorous joke'],
    correctIndex: 0,
    gradeLevel: 7,
  },
  {
    id: 'r22',
    subject: 'reading',
    question: 'What is an independent clause?',
    options: ['A phrase that cannot stand alone', 'A group of words with a subject and verb that forms a complete thought', 'A dependent sentence fragment', 'A type of conjunction'],
    correctIndex: 1,
    gradeLevel: 8,
  },
  {
    id: 'r23',
    subject: 'reading',
    question: '"The thunder grumbled angrily" is an example of:',
    options: ['Simile', 'Metaphor', 'Personification', 'Hyperbole'],
    correctIndex: 2,
    gradeLevel: 8,
  },
  {
    id: 'r24',
    subject: 'reading',
    question: 'What does "ambiguous" mean?',
    options: ['Clear and certain', 'Open to multiple interpretations', 'Extremely difficult', 'Relating to ambition'],
    correctIndex: 1,
    gradeLevel: 8,
  },
  // Grade 9 level
  {
    id: 'r25',
    subject: 'reading',
    question: 'What is a subordinate clause?',
    options: ['A clause that can stand alone as a sentence', 'A clause that depends on the main clause', 'The main idea of a paragraph', 'A type of punctuation'],
    correctIndex: 1,
    gradeLevel: 9,
  },
  {
    id: 'r26',
    subject: 'reading',
    question: 'Which rhetorical appeal uses logic and reasoning?',
    options: ['Ethos', 'Pathos', 'Logos', 'Kairos'],
    correctIndex: 2,
    gradeLevel: 9,
  },
]

/** Combine all questions and shuffle to randomize subjects */
export function getAssessmentQuestions(): Question[] {
  const all = [...mathQuestions, ...readingQuestions]
  // Shuffle using Fisher-Yates
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[all[i], all[j]] = [all[j], all[i]]
  }
  return all
}

/**
 * Age-appropriate question picker.
 * Returns questions centered on the student's selected grade:
 *   - primary band = selected grade AND the year below (confirms prerequisite skills)
 *   - if that band is too small (<6), widen to include the year above as well
 * This keeps the test matched to the child's age/skill level instead of mixing
 * grades 1–9 together.
 */
export function getQuestionsByGrade(grade: number): Question[] {
  let pool = [...mathQuestions, ...readingQuestions].filter(
    (q) => q.gradeLevel >= grade - 1 && q.gradeLevel <= grade
  )
  if (pool.length < 6) {
    pool = [...mathQuestions, ...readingQuestions].filter(
      (q) => q.gradeLevel <= grade + 1
    )
  }
  // Shuffle using Fisher-Yates
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool
}

/** Convert a grade label (e.g. "Kindergarten", "3rd Grade") to a number (0–9) */
export function gradeLabelToNumber(label: string): number {
  if (!label) return 1
  if (label.toLowerCase().startsWith('k')) return 0
  const m = label.match(/\d+/)
  return m ? parseInt(m[0], 10) : 1
}

/**
 * Score the assessment and determine the recommended grade level.
 * Uses weighted scoring based on difficulty of questions answered correctly.
 */
export function scoreAssessment(answers: { questionId: string; selectedIndex: number }[]): AssessmentResult {
  // Get all questions
  const allQuestions = [...mathQuestions, ...readingQuestions]
  const questionMap = new Map(allQuestions.map((q) => [q.id, q]))

  let correct = 0
  let mathCorrect = 0
  let mathTotal = 0
  let readingCorrect = 0
  let readingTotal = 0
  let totalGradeLevelScore = 0
  let totalQuestionsAnswered = 0

  for (const answer of answers) {
    const q = questionMap.get(answer.questionId)
    if (!q) continue

    totalQuestionsAnswered++
    totalGradeLevelScore += q.gradeLevel

    if (q.subject === 'math') mathTotal++
    else readingTotal++

    if (answer.selectedIndex === q.correctIndex) {
      correct++
      if (q.subject === 'math') mathCorrect++
      else readingCorrect++
    }
  }

  const overallScore = totalQuestionsAnswered > 0 ? (correct / totalQuestionsAnswered) * 100 : 0
  const mathScore = mathTotal > 0 ? (mathCorrect / mathTotal) * 100 : 0
  const readingScore = readingTotal > 0 ? (readingCorrect / readingTotal) * 100 : 0

  // Determine recommended grade based on weighted score
  let recommendedGradeNum: number

  recommendedGradeNum = determineGradeFromScore(overallScore, mathScore, readingScore)

  return {
    totalQuestions: totalQuestionsAnswered,
    correctAnswers: correct,
    score: Math.round(overallScore),
    mathScore: Math.round(mathScore),
    readingScore: Math.round(readingScore),
    recommendedGrade: formatGrade(recommendedGradeNum),
    recommendedGradeNum,
    breakdown: [
      { subject: 'math', correct: mathCorrect, total: mathTotal },
      { subject: 'reading', correct: readingCorrect, total: readingTotal },
    ],
  }
}

function determineGradeFromScore(
  overall: number,
  mathScore: number,
  readingScore: number
): number {
  // Weighted score: combine overall, math, and reading
  const weightedScore = overall * 0.5 + mathScore * 0.25 + readingScore * 0.25

  if (weightedScore >= 92) return 9
  if (weightedScore >= 85) return 8
  if (weightedScore >= 78) return 7
  if (weightedScore >= 70) return 6
  if (weightedScore >= 62) return 5
  if (weightedScore >= 54) return 4
  if (weightedScore >= 45) return 3
  if (weightedScore >= 35) return 2
  return 1
}

function formatGrade(num: number): string {
  if (num === 1) return '1st Grade'
  if (num === 2) return '2nd Grade'
  if (num === 3) return '3rd Grade'
  return `${num}th Grade`
}

/** Check if a state code is in our covered states */
export function isStateCovered(stateCode: string): boolean {
  return COVERED_STATES.some((s) => s.code === stateCode)
}

const COVERED_STATES = [
  { code: 'AL', name: 'Alabama' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'IN', name: 'Indiana' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'TX', name: 'Texas' },
]
