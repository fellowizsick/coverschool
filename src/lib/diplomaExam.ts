/**
 * Larose Christian Academy — High School Diploma Exam
 * Standard 4-subject diploma test (Math, English, Science, History) at high-school-graduate level.
 * Multiple choice. Pass = 70% overall.
 */

export type DiplomaSubject = 'math' | 'english' | 'science' | 'history'

export interface DiplomaQuestion {
  id: string
  subject: DiplomaSubject
  question: string
  options: string[]
  correctIndex: number
}

export const DIPLOMA_SUBJECTS: { key: DiplomaSubject; label: string }[] = [
  { key: 'math', label: '🔢 Mathematics' },
  { key: 'english', label: '📖 English' },
  { key: 'science', label: '🔬 Science' },
  { key: 'history', label: '🌎 History & Social Studies' },
]

export const DIPLOMA_PASS_THRESHOLD = 0.7 // 70% to pass (normal diploma standard)

export const DIPLOMA_QUESTIONS: DiplomaQuestion[] = [
  { id: 'ma1', subject: 'math', question: "Solve for x: 2x + 5 = 17", options: ["5", "6", "7", "8"], correctIndex: 1 },
  { id: 'ma2', subject: 'math', question: "Factor: x\u00b2 - 9", options: ["(x-3)(x+3)", "(x-9)(x+1)", "(x+3)\u00b2", "(x-3)\u00b2"], correctIndex: 0 },
  { id: 'ma3', subject: 'math', question: "Find the slope of the line through (2,3) and (4,7)", options: ["1", "2", "3", "4"], correctIndex: 1 },
  { id: 'ma4', subject: 'math', question: "Area of a circle with radius 3", options: ["3\u03c0", "6\u03c0", "9\u03c0", "12\u03c0"], correctIndex: 2 },
  { id: 'ma5', subject: 'math', question: "Solve: 3x - 7 = 2x + 5", options: ["12", "10", "2", "-12"], correctIndex: 0 },
  { id: 'ma6', subject: 'math', question: "What is 15% of 80?", options: ["10", "12", "15", "18"], correctIndex: 1 },
  { id: 'ma7', subject: 'math', question: "A right triangle has legs 5 and 12. Find the hypotenuse", options: ["13", "17", "7", "15"], correctIndex: 0 },
  { id: 'ma8', subject: 'math', question: "Simplify (2\u00b3)\u00b2", options: ["12", "32", "64", "128"], correctIndex: 2 },
  { id: 'ma9', subject: 'math', question: "Solve: x\u00b2 = 49", options: ["7", "-7", "\u00b17", "49"], correctIndex: 2 },
  { id: 'ma10', subject: 'math', question: "Volume of a cube with side length 4", options: ["16", "32", "64", "256"], correctIndex: 2 },
  { id: 'ma11', subject: 'math', question: "Probability of flipping heads twice in a row", options: ["1/2", "1/4", "1/8", "1/3"], correctIndex: 1 },
  { id: 'ma12', subject: 'math', question: "Write 0.004 in scientific notation", options: ["4\u00d710\u00b3", "4\u00d710\u207b\u00b3", "0.4\u00d710\u207b\u00b2", "40\u00d710\u207b\u2074"], correctIndex: 1 },
  { id: 'ma13', subject: 'math', question: "If y = 2x + 1, what is y when x = 3?", options: ["5", "6", "7", "8"], correctIndex: 2 },
  { id: 'ma14', subject: 'math', question: "Area of a triangle with base 10 and height 6", options: ["16", "30", "60", "15"], correctIndex: 1 },
  { id: 'ma15', subject: 'math', question: "Solve the system: x + y = 10 and x - y = 4", options: ["x=7, y=3", "x=3, y=7", "x=6, y=4", "x=5, y=5"], correctIndex: 0 },
  { id: 'en16', subject: 'english', question: "Choose the synonym for 'benevolent'", options: ["kind", "cruel", "lazy", "smart"], correctIndex: 0 },
  { id: 'en17', subject: 'english', question: "What is the plural of 'child'?", options: ["childs", "children", "childes", "childer"], correctIndex: 1 },
  { id: 'en18', subject: 'english', question: "Which sentence is grammatically correct?", options: ["Him went to the store.", "He went to the store.", "He go to the store.", "Him go store."], correctIndex: 1 },
  { id: 'en19', subject: 'english', question: "Identify the verb: 'The dog barked loudly.'", options: ["dog", "loudly", "barked", "the"], correctIndex: 2 },
  { id: 'en20', subject: 'english', question: "Choose the correct word: 'They ___ going home.'", options: ["there", "their", "they're", "thier"], correctIndex: 2 },
  { id: 'en21', subject: 'english', question: "'Their going to the park' is incorrect because it should be:", options: ["a spelling error", "'they're'", "wrong verb tense", "missing period"], correctIndex: 1 },
  { id: 'en22', subject: 'english', question: "A metaphor is:", options: ["a literal comparison", "a figure of speech implying equality", "a type of question", "a list"], correctIndex: 1 },
  { id: 'en23', subject: 'english', question: "What is the past tense of 'write'?", options: ["writed", "wrote", "written", "writ"], correctIndex: 1 },
  { id: 'en24', subject: 'english', question: "Which is a proper noun?", options: ["city", "Amazon River", "dog", "happiness"], correctIndex: 1 },
  { id: 'en25', subject: 'english', question: "What is the antonym of 'expand'?", options: ["grow", "contract", "increase", "spread"], correctIndex: 1 },
  { id: 'en26', subject: 'english', question: "Which sentence uses a comma correctly?", options: ["John who is tall left.", "John, who is tall, left.", "John who is tall, left."], correctIndex: 1 },
  { id: 'en27', subject: 'english', question: "'It's' is a contraction of:", options: ["it is", "its", "it was", "it has"], correctIndex: 0 },
  { id: 'en28', subject: 'english', question: "What is the superlative form of 'good'?", options: ["gooder", "better", "best", "goodest"], correctIndex: 2 },
  { id: 'en29', subject: 'english', question: "The author's purpose in a recipe is to:", options: ["entertain", "instruct", "persuade", "confuse"], correctIndex: 1 },
  { id: 'en30', subject: 'english', question: "Which word is spelled correctly?", options: ["seperate", "separate", "seprate", "separete"], correctIndex: 1 },
  { id: 'sc31', subject: 'science', question: "What is the chemical symbol for water?", options: ["H\u2082O", "CO\u2082", "O\u2082", "NaCl"], correctIndex: 0 },
  { id: 'sc32', subject: 'science', question: "Which gas do plants absorb during photosynthesis?", options: ["oxygen", "carbon dioxide", "nitrogen", "helium"], correctIndex: 1 },
  { id: 'sc33', subject: 'science', question: "How many chambers does the human heart have?", options: ["2", "3", "4", "5"], correctIndex: 2 },
  { id: 'sc34', subject: 'science', question: "What is the 'powerhouse' of the cell?", options: ["nucleus", "mitochondria", "ribosome", "membrane"], correctIndex: 1 },
  { id: 'sc35', subject: 'science', question: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Mercury"], correctIndex: 1 },
  { id: 'sc36', subject: 'science', question: "Approximately how fast does light travel?", options: ["300 km/s", "300,000 km/s", "3,000 km/s", "30,000 km/s"], correctIndex: 1 },
  { id: 'sc37', subject: 'science', question: "What is the atomic number of hydrogen?", options: ["1", "2", "3", "0"], correctIndex: 0 },
  { id: 'sc38', subject: 'science', question: "Which blood cells fight infection?", options: ["red", "white", "platelets", "plasma"], correctIndex: 1 },
  { id: 'sc39', subject: 'science', question: "What is the boiling point of water at sea level (\u00b0C)?", options: ["90", "100", "110", "120"], correctIndex: 1 },
  { id: 'sc40', subject: 'science', question: "DNA stands for:", options: ["Deoxyribonucleic acid", "Dinucleic acid", "Dual nucleic acid", "None"], correctIndex: 0 },
  { id: 'sc41', subject: 'science', question: "What is the closest star to Earth?", options: ["Sirius", "the Sun", "Proxima Centauri", "Vega"], correctIndex: 1 },
  { id: 'sc42', subject: 'science', question: "Acids have a pH that is:", options: ["above 7", "below 7", "exactly 7", "above 14"], correctIndex: 1 },
  { id: 'sc43', subject: 'science', question: "What is the hardest known natural substance?", options: ["gold", "diamond", "iron", "quartz"], correctIndex: 1 },
  { id: 'sc44', subject: 'science', question: "Which of these is a renewable energy source?", options: ["coal", "solar", "oil", "natural gas"], correctIndex: 1 },
  { id: 'sc45', subject: 'science', question: "What force pulls objects toward Earth?", options: ["magnetism", "gravity", "friction", "inertia"], correctIndex: 1 },
  { id: 'hi46', subject: 'history', question: "Who was the first President of the United States?", options: ["Lincoln", "Washington", "Jefferson", "Adams"], correctIndex: 1 },
  { id: 'hi47', subject: 'history', question: "In what year was the Declaration of Independence signed?", options: ["1776", "1789", "1812", "1620"], correctIndex: 0 },
  { id: 'hi48', subject: 'history', question: "Which document begins with 'We the People'?", options: ["Bill of Rights", "Constitution", "Emancipation Proclamation", "Articles of Confederation"], correctIndex: 1 },
  { id: 'hi49', subject: 'history', question: "The American Civil War was fought mainly over:", options: ["taxes", "slavery", "land rights", "trade"], correctIndex: 1 },
  { id: 'hi50', subject: 'history', question: "Which amendment gave women the right to vote?", options: ["15th", "19th", "13th", "21st"], correctIndex: 1 },
  { id: 'hi51', subject: 'history', question: "What is the capital of the United States?", options: ["New York", "Washington D.C.", "Chicago", "Boston"], correctIndex: 1 },
  { id: 'hi52', subject: 'history', question: "How many stars are on the U.S. flag?", options: ["48", "50", "52", "51"], correctIndex: 1 },
  { id: 'hi53', subject: 'history', question: "In what year did the Great Depression begin?", options: ["1919", "1929", "1939", "1945"], correctIndex: 1 },
  { id: 'hi54', subject: 'history', question: "What are the three branches of the U.S. government?", options: ["President, Senate, House", "Executive, Legislative, Judicial", "Army, Navy, Air Force", "none of these"], correctIndex: 1 },
  { id: 'hi55', subject: 'history', question: "In what year did World War II end?", options: ["1943", "1945", "1950", "1939"], correctIndex: 1 },
  { id: 'hi56', subject: 'history', question: "In what year did humans first land on the moon?", options: ["1965", "1969", "1972", "1958"], correctIndex: 1 },
  { id: 'hi57', subject: 'history', question: "How many amendments are in the Bill of Rights?", options: ["10", "12", "15", "8"], correctIndex: 0 },
  { id: 'hi58', subject: 'history', question: "The Cold War was mainly between the U.S. and:", options: ["Britain", "the Soviet Union", "France", "China"], correctIndex: 1 },
  { id: 'hi59', subject: 'history', question: "What is the minimum voting age in the United States?", options: ["18", "21", "16", "25"], correctIndex: 0 },
  { id: 'hi60', subject: 'history', question: "Who wrote the Gettysburg Address?", options: ["Washington", "Lincoln", "Kennedy", "Roosevelt"], correctIndex: 1 },
]
