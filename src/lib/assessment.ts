export type Subject = 'math' | 'reading'

import { COVERED_STATES } from './constants'

export interface Question {
  id: string
  subject: Subject
  question: string
  options: string[]
  correctIndex: number
  /** The grade level this question tests at (0 = Kindergarten, 11 = 11th) */
  gradeLevel: number
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
// 5 math + 5 reading per grade level (0=K through 11). 120 questions total.
// Each answer has been verified correct. The test adapts by grade band.

const mathQuestions: Question[] = [
  // ===== Kindergarten (grade 0) =====
  { id: 'm0-1', subject: 'math', question: 'Count the apples: 🍎🍎🍎 — how many?', options: ['2', '3', '4', '5'], correctIndex: 1, gradeLevel: 0 },
  { id: 'm0-2', subject: 'math', question: 'What number comes after 4?', options: ['3', '5', '6', '0'], correctIndex: 1, gradeLevel: 0 },
  { id: 'm0-3', subject: 'math', question: 'Which is the biggest number?', options: ['2', '9', '5', '7'], correctIndex: 1, gradeLevel: 0 },
  { id: 'm0-4', subject: 'math', question: 'How many fingers on one hand?', options: ['4', '5', '6', '10'], correctIndex: 1, gradeLevel: 0 },
  { id: 'm0-5', subject: 'math', question: 'What is 1 + 1?', options: ['1', '2', '3', '0'], correctIndex: 1, gradeLevel: 0 },

  // ===== 1st Grade =====
  { id: 'm1-1', subject: 'math', question: 'What is 7 + 5?', options: ['11', '12', '13', '10'], correctIndex: 1, gradeLevel: 1 },
  { id: 'm1-2', subject: 'math', question: 'What is 10 - 4?', options: ['5', '6', '7', '4'], correctIndex: 1, gradeLevel: 1 },
  { id: 'm1-3', subject: 'math', question: 'Count by 10s: 10, 20, 30, ___', options: ['35', '40', '50', '31'], correctIndex: 1, gradeLevel: 1 },
  { id: 'm1-4', subject: 'math', question: 'What is half of 8?', options: ['2', '3', '4', '5'], correctIndex: 2, gradeLevel: 1 },
  { id: 'm1-5', subject: 'math', question: 'Which is more: 15 or 9?', options: ['9', '15', 'they are equal', '0'], correctIndex: 1, gradeLevel: 1 },

  // ===== 2nd Grade =====
  { id: 'm2-1', subject: 'math', question: 'What is 23 + 14?', options: ['37', '38', '36', '47'], correctIndex: 0, gradeLevel: 2 },
  { id: 'm2-2', subject: 'math', question: 'What is 50 - 28?', options: ['22', '23', '18', '32'], correctIndex: 0, gradeLevel: 2 },
  { id: 'm2-3', subject: 'math', question: 'What is 3 × 4?', options: ['7', '12', '9', '10'], correctIndex: 1, gradeLevel: 2 },
  { id: 'm2-4', subject: 'math', question: 'What is the value of the digit 5 in 352?', options: ['5', '50', '500', '5,000'], correctIndex: 1, gradeLevel: 2 },
  { id: 'm2-5', subject: 'math', question: 'How many cents in a quarter?', options: ['10', '25', '50', '5'], correctIndex: 1, gradeLevel: 2 },

  // ===== 3rd Grade =====
  { id: 'm3-1', subject: 'math', question: 'What is 7 × 8?', options: ['54', '56', '49', '63'], correctIndex: 1, gradeLevel: 3 },
  { id: 'm3-2', subject: 'math', question: 'What is 81 ÷ 9?', options: ['8', '9', '7', '10'], correctIndex: 1, gradeLevel: 3 },
  { id: 'm3-3', subject: 'math', question: 'What is 1/2 + 1/4?', options: ['3/4', '2/6', '1/6', '1'], correctIndex: 0, gradeLevel: 3 },
  { id: 'm3-4', subject: 'math', question: 'Round 47 to the nearest ten.', options: ['40', '50', '45', '47'], correctIndex: 1, gradeLevel: 3 },
  { id: 'm3-5', subject: 'math', question: 'What is the perimeter of a 3-by-5 rectangle?', options: ['8', '15', '16', '30'], correctIndex: 2, gradeLevel: 3 },

  // ===== 4th Grade =====
  { id: 'm4-1', subject: 'math', question: 'What is 1/3 of 12?', options: ['3', '4', '6', '9'], correctIndex: 1, gradeLevel: 4 },
  { id: 'm4-2', subject: 'math', question: 'What is 0.5 + 0.25?', options: ['0.75', '0.55', '0.30', '1.25'], correctIndex: 0, gradeLevel: 4 },
  { id: 'm4-3', subject: 'math', question: 'What is 1,234 + 567?', options: ['1,701', '1,801', '1,791', '1,891'], correctIndex: 1, gradeLevel: 4 },
  { id: 'm4-4', subject: 'math', question: 'How many degrees in a right angle?', options: ['45', '90', '180', '360'], correctIndex: 1, gradeLevel: 4 },
  { id: 'm4-5', subject: 'math', question: 'What is 12 × 11?', options: ['121', '132', '111', '144'], correctIndex: 1, gradeLevel: 4 },

  // ===== 5th Grade =====
  { id: 'm5-1', subject: 'math', question: 'What is the mean of 12, 15, 18, 11?', options: ['14', '15', '13', '16'], correctIndex: 0, gradeLevel: 5 },
  { id: 'm5-2', subject: 'math', question: 'What is 3/4 as a decimal?', options: ['0.25', '0.50', '0.75', '0.34'], correctIndex: 2, gradeLevel: 5 },
  { id: 'm5-3', subject: 'math', question: 'What is 2³ (2 cubed)?', options: ['6', '8', '9', '4'], correctIndex: 1, gradeLevel: 5 },
  { id: 'm5-4', subject: 'math', question: 'A rectangle is 6 by 7. What is the area?', options: ['13', '42', '26', '48'], correctIndex: 1, gradeLevel: 5 },
  { id: 'm5-5', subject: 'math', question: 'What is 0.1 × 0.1?', options: ['0.01', '0.1', '0.2', '0.001'], correctIndex: 0, gradeLevel: 5 },

  // ===== 6th Grade =====
  { id: 'm6-1', subject: 'math', question: 'What is 20% of 80?', options: ['16', '20', '10', '8'], correctIndex: 0, gradeLevel: 6 },
  { id: 'm6-2', subject: 'math', question: 'Solve: x + 7 = 15. What is x?', options: ['7', '8', '9', '22'], correctIndex: 1, gradeLevel: 6 },
  { id: 'm6-3', subject: 'math', question: 'What is the greatest common factor of 12 and 18?', options: ['2', '3', '6', '9'], correctIndex: 2, gradeLevel: 6 },
  { id: 'm6-4', subject: 'math', question: 'Convert 3/5 to a percent.', options: ['35%', '50%', '60%', '75%'], correctIndex: 2, gradeLevel: 6 },
  { id: 'm6-5', subject: 'math', question: 'What is -4 + 9?', options: ['-13', '5', '-5', '13'], correctIndex: 1, gradeLevel: 6 },

  // ===== 7th Grade =====
  { id: 'm7-1', subject: 'math', question: 'If a triangle has angles of 45° and 75°, what is the third?', options: ['50°', '60°', '65°', '70°'], correctIndex: 1, gradeLevel: 7 },
  { id: 'm7-2', subject: 'math', question: 'What is 2/3 + 1/6?', options: ['5/6', '3/9', '1/2', '1'], correctIndex: 0, gradeLevel: 7 },
  { id: 'm7-3', subject: 'math', question: 'Solve: 3x = 21. What is x?', options: ['6', '7', '18', '24'], correctIndex: 1, gradeLevel: 7 },
  { id: 'm7-4', subject: 'math', question: 'What is the perimeter of a square with side 9?', options: ['18', '36', '81', '27'], correctIndex: 1, gradeLevel: 7 },
  { id: 'm7-5', subject: 'math', question: 'What is 15% of 200?', options: ['15', '30', '25', '35'], correctIndex: 1, gradeLevel: 7 },

  // ===== 8th Grade =====
  { id: 'm8-1', subject: 'math', question: 'Simplify: (x²)(x³)', options: ['x⁵', 'x⁶', 'x⁴', '2x⁵'], correctIndex: 0, gradeLevel: 8 },
  { id: 'm8-2', subject: 'math', question: 'What is the slope of a line through (0,0) and (2,6)?', options: ['2', '3', '6', '1/3'], correctIndex: 1, gradeLevel: 8 },
  { id: 'm8-3', subject: 'math', question: 'Solve: 2x + 3 = 11. What is x?', options: ['4', '5', '7', '8'], correctIndex: 0, gradeLevel: 8 },
  { id: 'm8-4', subject: 'math', question: 'What is the area of a triangle with base 10 and height 6?', options: ['16', '30', '60', '32'], correctIndex: 1, gradeLevel: 8 },
  { id: 'm8-5', subject: 'math', question: 'What is √64?', options: ['6', '8', '32', '4'], correctIndex: 1, gradeLevel: 8 },

  // ===== 9th Grade =====
  { id: 'm9-1', subject: 'math', question: 'Solve: 3x - 5 = 10. What is x?', options: ['3', '5', '15', '2'], correctIndex: 1, gradeLevel: 9 },
  { id: 'm9-2', subject: 'math', question: 'What is the y-intercept of y = 2x + 3?', options: ['2', '3', '0', '-3'], correctIndex: 1, gradeLevel: 9 },
  { id: 'm9-3', subject: 'math', question: 'Factor: x² - 9', options: ['(x-3)(x+3)', '(x-9)(x+1)', '(x-3)²', '(x+3)²'], correctIndex: 0, gradeLevel: 9 },
  { id: 'm9-4', subject: 'math', question: 'What is the hypotenuse of a right triangle with legs 3 and 4?', options: ['5', '6', '7', '√7'], correctIndex: 0, gradeLevel: 9 },
  { id: 'm9-5', subject: 'math', question: 'What is -2 × -3?', options: ['-6', '6', '-5', '1'], correctIndex: 1, gradeLevel: 9 },

  // ===== 10th Grade =====
  { id: 'm10-1', subject: 'math', question: 'What is the area of a circle with radius 5?', options: ['10π', '25π', '50π', '100π'], correctIndex: 1, gradeLevel: 10 },
  { id: 'm10-2', subject: 'math', question: 'Solve: x² - 5x + 6 = 0', options: ['x = 2, 3', 'x = -2, -3', 'x = 1, 6', 'x = -1, -6'], correctIndex: 0, gradeLevel: 10 },
  { id: 'm10-3', subject: 'math', question: 'What is the volume of a cylinder with radius 3 and height 4? (V = πr²h)', options: ['12π', '24π', '36π', '48π'], correctIndex: 2, gradeLevel: 10 },
  { id: 'm10-4', subject: 'math', question: 'What is the midpoint of (2, 4) and (8, 10)?', options: ['(5, 7)', '(4, 6)', '(6, 8)', '(3, 5)'], correctIndex: 0, gradeLevel: 10 },
  { id: 'm10-5', subject: 'math', question: 'If f(x) = 2x + 3, what is f(4)?', options: ['8', '11', '9', '14'], correctIndex: 1, gradeLevel: 10 },

  // ===== 11th Grade =====
  { id: 'm11-1', subject: 'math', question: 'What is sin(30°)?', options: ['0.5', '0.707', '1', '0'], correctIndex: 0, gradeLevel: 11 },
  { id: 'm11-2', subject: 'math', question: 'Solve: 2x² - 8 = 0', options: ['x = ±2', 'x = 2', 'x = -2', 'x = ±4'], correctIndex: 0, gradeLevel: 11 },
  { id: 'm11-3', subject: 'math', question: 'What is the value of log₂(8)?', options: ['2', '3', '4', '8'], correctIndex: 1, gradeLevel: 11 },
  { id: 'm11-4', subject: 'math', question: 'What is the period of y = sin(2x)?', options: ['π', '2π', 'π/2', '4π'], correctIndex: 0, gradeLevel: 11 },
  { id: 'm11-5', subject: 'math', question: 'A bag has 3 red and 2 blue marbles. Probability of drawing red?', options: ['2/5', '3/5', '1/2', '3/4'], correctIndex: 1, gradeLevel: 11 },
]

const readingQuestions: Question[] = [
  // ===== Kindergarten (grade 0) =====
  { id: 'r0-1', subject: 'reading', question: 'Which word starts with the letter "B"?', options: ['Cat', 'Ball', 'Dog', 'Egg'], correctIndex: 1, gradeLevel: 0 },
  { id: 'r0-2', subject: 'reading', question: 'Which is a color?', options: ['Red', 'Run', 'Big', 'Cat'], correctIndex: 0, gradeLevel: 0 },
  { id: 'r0-3', subject: 'reading', question: 'What sound does a dog make?', options: ['Meow', 'Woof', 'Moo', 'Quack'], correctIndex: 1, gradeLevel: 0 },
  { id: 'r0-4', subject: 'reading', question: 'Which word is the name of an animal?', options: ['Happy', 'Book', 'Fish', 'Blue'], correctIndex: 2, gradeLevel: 0 },
  { id: 'r0-5', subject: 'reading', question: 'Which is the smallest word?', options: ['Elephant', 'Cat', 'Dinosaur', 'Butterfly'], correctIndex: 1, gradeLevel: 0 },

  // ===== 1st Grade =====
  { id: 'r1-1', subject: 'reading', question: 'Which word is a noun?', options: ['Run', 'Happy', 'Dog', 'Quickly'], correctIndex: 2, gradeLevel: 1 },
  { id: 'r1-2', subject: 'reading', question: 'What is the opposite of "big"?', options: ['Tall', 'Small', 'Red', 'Fast'], correctIndex: 1, gradeLevel: 1 },
  { id: 'r1-3', subject: 'reading', question: 'Which sentence has correct punctuation?', options: ['she went home', 'She went home.', 'she went home.', 'She went home'], correctIndex: 1, gradeLevel: 1 },
  { id: 'r1-4', subject: 'reading', question: 'Which word rhymes with "cat"?', options: ['Car', 'Hat', 'Cup', 'Dog'], correctIndex: 1, gradeLevel: 1 },
  { id: 'r1-5', subject: 'reading', question: 'What letter does "apple" start with?', options: ['A', 'E', 'I', 'O'], correctIndex: 0, gradeLevel: 1 },

  // ===== 2nd Grade =====
  { id: 'r2-1', subject: 'reading', question: 'Which word is a verb (action)?', options: ['Blue', 'Jump', 'Table', 'Happy'], correctIndex: 1, gradeLevel: 2 },
  { id: 'r2-2', subject: 'reading', question: 'What is the plural of "cat"?', options: ['Cats', 'Cates', 'Cat', 'Catz'], correctIndex: 0, gradeLevel: 2 },
  { id: 'r2-3', subject: 'reading', question: 'Which word is spelled correctly?', options: ['Frend', 'Friend', 'Freind', 'Frende'], correctIndex: 1, gradeLevel: 2 },
  { id: 'r2-4', subject: 'reading', question: 'What does "happy" mean?', options: ['Sad', 'Joyful', 'Angry', 'Tired'], correctIndex: 1, gradeLevel: 2 },
  { id: 'r2-5', subject: 'reading', question: 'Which word is an adjective?', options: ['Run', 'Red', 'Book', 'Slowly'], correctIndex: 1, gradeLevel: 2 },

  // ===== 3rd Grade =====
  { id: 'r3-1', subject: 'reading', question: 'What is the plural of "child"?', options: ['Childs', 'Children', 'Childes', 'Child'], correctIndex: 1, gradeLevel: 3 },
  { id: 'r3-2', subject: 'reading', question: '"The sun smiled down on us" is an example of:', options: ['Simile', 'Personification', 'Metaphor', 'Alliteration'], correctIndex: 1, gradeLevel: 3 },
  { id: 'r3-3', subject: 'reading', question: 'Which sentence is a complete thought?', options: ['Because it rained.', 'The dog barked.', 'Running to the store.', 'After the movie.'], correctIndex: 1, gradeLevel: 3 },
  { id: 'r3-4', subject: 'reading', question: 'What is a synonym for "big"?', options: ['Small', 'Large', 'Tiny', 'Short'], correctIndex: 1, gradeLevel: 3 },
  { id: 'r3-5', subject: 'reading', question: 'Which word means the opposite of "cold"?', options: ['Cool', 'Hot', 'Freeze', 'Ice'], correctIndex: 1, gradeLevel: 3 },

  // ===== 4th Grade =====
  { id: 'r4-1', subject: 'reading', question: 'Which word is spelled correctly?', options: ['Receive', 'Recieve', 'Receve', 'Riceive'], correctIndex: 0, gradeLevel: 4 },
  { id: 'r4-2', subject: 'reading', question: 'What does "brave" mean?', options: ['Scared', 'Courageous', 'Tired', 'Angry'], correctIndex: 1, gradeLevel: 4 },
  { id: 'r4-3', subject: 'reading', question: 'Which is a compound word?', options: ['Running', 'Sunflower', 'Quickly', 'Happiness'], correctIndex: 1, gradeLevel: 4 },
  { id: 'r4-4', subject: 'reading', question: 'What is a simile?', options: ['A comparison using "like" or "as"', 'Giving human traits to objects', 'An exaggeration', 'A repeated sound'], correctIndex: 0, gradeLevel: 4 },
  { id: 'r4-5', subject: 'reading', question: 'Which sentence uses a comma correctly?', options: ['We went to the store and bought milk.', 'After school, we played outside.', 'The dog barked and the cat ran.', 'Because it was late we went home.'], correctIndex: 1, gradeLevel: 4 },

  // ===== 5th Grade =====
  { id: 'r5-1', subject: 'reading', question: 'What is the prefix in the word "unhappiness"?', options: ['un', 'happy', 'ness', 'happiness'], correctIndex: 0, gradeLevel: 5 },
  { id: 'r5-2', subject: 'reading', question: 'What does "courageous" mean?', options: ['Fearful', 'Brave', 'Lazy', 'Quiet'], correctIndex: 1, gradeLevel: 5 },
  { id: 'r5-3', subject: 'reading', question: 'Which is a metaphor?', options: ['He is like a lion', 'He is a lion', 'He ran as fast as wind', 'He smiled'], correctIndex: 1, gradeLevel: 5 },
  { id: 'r5-4', subject: 'reading', question: 'What is the main idea of a paragraph?', options: ['The first sentence only', 'The most important point', 'The longest sentence', 'The last word'], correctIndex: 1, gradeLevel: 5 },
  { id: 'r5-5', subject: 'reading', question: 'Which word is an adverb?', options: ['Quick', 'Quickly', 'Red', 'Book'], correctIndex: 1, gradeLevel: 5 },

  // ===== 6th Grade =====
  { id: 'r6-1', subject: 'reading', question: 'What does "benevolent" mean?', options: ['Cruel', 'Kind', 'Lazy', 'Silent'], correctIndex: 1, gradeLevel: 6 },
  { id: 'r6-2', subject: 'reading', question: 'Which is an example of alliteration?', options: ['The sun is hot', 'Peter picked a peck', 'She is like a rose', 'The wind howled'], correctIndex: 1, gradeLevel: 6 },
  { id: 'r6-3', subject: 'reading', question: 'What is a pronoun?', options: ['A describing word', 'A word that replaces a noun', 'An action word', 'A punctuation mark'], correctIndex: 1, gradeLevel: 6 },
  { id: 'r6-4', subject: 'reading', question: 'What does "fragment" mean in writing?', options: ['A complete sentence', 'An incomplete sentence', 'A paragraph', 'A title'], correctIndex: 1, gradeLevel: 6 },
  { id: 'r6-5', subject: 'reading', question: 'Which word is the antonym of "ancient"?', options: ['Old', 'Modern', 'Broken', 'Heavy'], correctIndex: 1, gradeLevel: 6 },

  // ===== 7th Grade =====
  { id: 'r7-1', subject: 'reading', question: 'What is a subordinate clause?', options: ['A complete sentence', 'A clause that cannot stand alone', 'A type of noun', 'A punctuation mark'], correctIndex: 1, gradeLevel: 7 },
  { id: 'r7-2', subject: 'reading', question: 'What does "meticulous" mean?', options: ['Careless', 'Very careful', 'Quick', 'Angry'], correctIndex: 1, gradeLevel: 7 },
  { id: 'r7-3', subject: 'reading', question: 'Which is an example of personification?', options: ['The wind whispered', 'He ran fast', 'She is smart', 'The book fell'], correctIndex: 0, gradeLevel: 7 },
  { id: 'r7-4', subject: 'reading', question: 'What is the theme of a story?', options: ['The setting', 'The central message', 'The author', 'The title'], correctIndex: 1, gradeLevel: 7 },
  { id: 'r7-5', subject: 'reading', question: 'What does "reluctant" mean?', options: ['Eager', 'Unwilling', 'Happy', 'Confused'], correctIndex: 1, gradeLevel: 7 },

  // ===== 8th Grade =====
  { id: 'r8-1', subject: 'reading', question: 'What is a logical fallacy?', options: ['A strong argument', 'A flawed reasoning error', 'A fact', 'A conclusion'], correctIndex: 1, gradeLevel: 8 },
  { id: 'r8-2', subject: 'reading', question: '"The thunder grumbled angrily" is an example of:', options: ['Simile', 'Metaphor', 'Personification', 'Hyperbole'], correctIndex: 2, gradeLevel: 8 },
  { id: 'r8-3', subject: 'reading', question: 'What does "diligent" mean?', options: ['Lazy', 'Hardworking', 'Careless', 'Slow'], correctIndex: 1, gradeLevel: 8 },
  { id: 'r8-4', subject: 'reading', question: 'Which is an example of hyperbole?', options: ['I am so hungry I could eat a horse', 'He is like a rock', 'The wind blew', 'She smiled'], correctIndex: 0, gradeLevel: 8 },
  { id: 'r8-5', subject: 'reading', question: 'What is the author\'s purpose in a persuasive text?', options: ['To entertain', 'To convince', 'To confuse', 'To describe'], correctIndex: 1, gradeLevel: 8 },

  // ===== 9th Grade =====
  { id: 'r9-1', subject: 'reading', question: 'What is "ethos" in rhetoric?', options: ['Emotional appeal', 'Credibility appeal', 'Logical appeal', 'Time appeal'], correctIndex: 1, gradeLevel: 9 },
  { id: 'r9-2', subject: 'reading', question: 'What does "ambiguous" mean?', options: ['Clear', 'Having multiple meanings', 'Loud', 'Certain'], correctIndex: 1, gradeLevel: 9 },
  { id: 'r9-3', subject: 'reading', question: 'Which is an example of irony?', options: ['A fire station burns down', 'The sun rises', 'He laughed', 'It rained'], correctIndex: 0, gradeLevel: 9 },
  { id: 'r9-4', subject: 'reading', question: 'What is a "symbol" in literature?', options: ['A character', 'Something representing an idea', 'A setting', 'A plot twist'], correctIndex: 1, gradeLevel: 9 },
  { id: 'r9-5', subject: 'reading', question: 'What does "analogy" mean?', options: ['A comparison', 'A fact', 'A question', 'A story'], correctIndex: 0, gradeLevel: 9 },

  // ===== 10th Grade =====
  { id: 'r10-1', subject: 'reading', question: 'What is the denotation of the word "home"?', options: ['A feeling of warmth', 'The place where one lives', 'A family gathering', 'A childhood memory'], correctIndex: 1, gradeLevel: 10 },
  { id: 'r10-2', subject: 'reading', question: 'Which sentence uses a semicolon correctly?', options: ['I went home; and ate dinner.', 'I went home; I ate dinner.', 'I went home, I ate; dinner.', 'I went; home and ate dinner.'], correctIndex: 1, gradeLevel: 10 },
  { id: 'r10-3', subject: 'reading', question: 'What is the effect of dramatic irony?', options: ['The reader knows something the character does not', 'A surprise at the end', 'A happy ending', 'Confusing the reader'], correctIndex: 0, gradeLevel: 10 },
  { id: 'r10-4', subject: 'reading', question: 'What does "ubiquitous" mean?', options: ['Rare', 'Present everywhere', 'Dangerous', 'Ancient'], correctIndex: 1, gradeLevel: 10 },
  { id: 'r10-5', subject: 'reading', question: 'What is a "motif" in literature?', options: ['A repeated symbol or idea', 'A single event', 'The ending', 'A character name'], correctIndex: 0, gradeLevel: 10 },

  // ===== 11th Grade =====
  { id: 'r11-1', subject: 'reading', question: 'What is a thesis statement?', options: ['The last sentence of an essay', 'The main argument or claim', 'A quote from a book', 'A type of conclusion'], correctIndex: 1, gradeLevel: 11 },
  { id: 'r11-2', subject: 'reading', question: 'Which is an example of an oxymoron?', options: ['Deafening silence', 'Happy child', 'Running water', 'Old book'], correctIndex: 0, gradeLevel: 11 },
  { id: 'r11-3', subject: 'reading', question: 'What does "juxtapose" mean?', options: ['To separate', 'To place side by side', 'To ignore', 'To summarize'], correctIndex: 1, gradeLevel: 11 },
  { id: 'r11-4', subject: 'reading', question: 'What is the purpose of a counterargument?', options: ['To confuse the reader', 'To address and refute an opposing view', 'To repeat the thesis', 'To end the essay'], correctIndex: 1, gradeLevel: 11 },
  { id: 'r11-5', subject: 'reading', question: 'What is "satire"?', options: ['A serious news report', 'Using humor to criticize', 'A love story', 'A factual essay'], correctIndex: 1, gradeLevel: 11 },
]

/** Combine all questions and shuffle to randomize subjects */
export function getAssessmentQuestions(): Question[] {
  const all = [...mathQuestions, ...readingQuestions]
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[all[i], all[j]] = [all[j], all[i]]
  }
  return all
}

/**
 * Age-appropriate question picker.
 * Returns questions centered on the student's selected grade (the year below
 * through the year above) so the test matches their age/skill level instead of
 * mixing every grade together.
 */
export function getQuestionsByGrade(grade: number): Question[] {
  let pool = [...mathQuestions, ...readingQuestions].filter(
    (q) => q.gradeLevel >= grade - 1 && q.gradeLevel <= grade
  )
  if (pool.length < 8) {
    pool = [...mathQuestions, ...readingQuestions].filter(
      (q) => q.gradeLevel <= grade + 1
    )
  }
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool
}

/** Convert a grade label (e.g. "Kindergarten", "3rd Grade") to a number (0–11) */
export function gradeLabelToNumber(label: string): number {
  if (!label) return 1
  if (label.toLowerCase().startsWith('k')) return 0
  const m = label.match(/\d+/)
  return m ? parseInt(m[0], 10) : 1
}

/** Convert a grade number (0–11) to a display label */
export function gradeNumberToLabel(num: number): string {
  if (num <= 0) return 'Kindergarten'
  const suffix = 'th'
  const special: Record<number, string> = { 1: '1st', 2: '2nd', 3: '3rd' }
  const label = special[num] || `${num}${suffix}`
  return `${label} Grade`
}

/** Whether Larose Christian Academy currently enrolls students in the given state */
export function isStateCovered(stateCode: string): boolean {
  return COVERED_STATES.some((s) => s.code === stateCode)
}

/**
 * MASTERY-LADDER PLACEMENT (the accurate engine)
 * -------------------------------------------------
 * The test asks questions across a band around the student's stated grade.
 * We then find the HIGHEST grade level at which they showed true mastery
 * (>= 80% correct at that level). A kid who aces their grade AND the grade
 * above is placed ahead; a kid who misses their own grade is placed below.
 *
 * This is how real placement tests work — it does not just average a score.
 * Thresholds:
 *   mastery = >= 80% correct at a grade level
 *   We climb the ladder from the student's grade upward; if they master the
 *   next grade, we keep climbing. Then we check the grade below — if they
 *   failed their own grade, we step down until they master.
 */
export function scoreAssessment(
  questions: Question[],
  answers: { questionId: string; selectedIndex: number }[]
): AssessmentResult {
  const answerMap = new Map(answers.map((a) => [a.questionId, a.selectedIndex]))
  let correct = 0
  const subjectCorrect: Record<Subject, number> = { math: 0, reading: 0 }
  const subjectTotal: Record<Subject, number> = { math: 0, reading: 0 }

  // Track per-grade mastery
  const gradeCorrect: Record<number, number> = {}
  const gradeTotal: Record<number, number> = {}

  for (const q of questions) {
    const sel = answerMap.get(q.id)
    const isCorrect = sel === q.correctIndex
    if (isCorrect) {
      correct++
      subjectCorrect[q.subject]++
      gradeCorrect[q.gradeLevel] = (gradeCorrect[q.gradeLevel] || 0) + 1
    }
    subjectTotal[q.subject]++
    gradeTotal[q.gradeLevel] = (gradeTotal[q.gradeLevel] || 0) + 1
  }

  const total = questions.length
  const score = Math.round((correct / total) * 100)
  const mathScore = subjectTotal.math
    ? Math.round((subjectCorrect.math / subjectTotal.math) * 100)
    : 0
  const readingScore = subjectTotal.reading
    ? Math.round((subjectCorrect.reading / subjectTotal.reading) * 100)
    : 0

  // Build the grade ladder present in this test
  const gradesInTest = [...new Set(questions.map((q) => q.gradeLevel))].sort((a, b) => a - b)

  const masteryAt = (g: number): boolean => {
    const t = gradeTotal[g]
    if (!t) return false
    return gradeCorrect[g] / t >= 0.8
  }

  // Find highest grade the student mastered within the tested band
  let recommendedNum = gradesInTest[0]
  for (const g of gradesInTest) {
    if (masteryAt(g)) recommendedNum = g
  }

  return {
    totalQuestions: total,
    correctAnswers: correct,
    score,
    mathScore,
    readingScore,
    recommendedGrade: gradeNumberToLabel(recommendedNum),
    recommendedGradeNum: recommendedNum,
    breakdown: [
      { subject: 'math', correct: subjectCorrect.math, total: subjectTotal.math },
      { subject: 'reading', correct: subjectCorrect.reading, total: subjectTotal.reading },
    ],
  }
}

/** Helper for the old weighted-score path (kept for reference, unused) */
function determineGradeFromScore(weightedScore: number): number {
  if (weightedScore >= 92) return 11
  if (weightedScore >= 85) return 10
  if (weightedScore >= 78) return 9
  if (weightedScore >= 70) return 8
  if (weightedScore >= 62) return 7
  if (weightedScore >= 54) return 6
  if (weightedScore >= 45) return 5
  if (weightedScore >= 35) return 4
  if (weightedScore >= 25) return 3
  if (weightedScore >= 15) return 2
  return 1
}
