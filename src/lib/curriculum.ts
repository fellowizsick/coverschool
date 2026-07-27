// Larose Christian Academy — ORIGINAL K-12 Curriculum (authored for LCA)
// Each grade = a full academic year: 6 subjects, 4 quarters, lessons + assessments.
// Spelling & Word Origins are ONE class (spelling lists + etymology together).
// Content is original and age-appropriate. 12th grade = senior year -> diploma exam.

export type QType = 'mc' | 'short' | 'activity'
export interface CQuestion {
  id: string
  q: string
  type: QType
  options?: string[]
  answer?: number | string
}
export interface CLesson {
  title: string
  summary: string
  /** End-of-week test covering this lesson's content (3-5 questions) */
  weekTest?: CQuestion[]
}
export interface CUnit {
  name: string
  lessons: CLesson[]
  questions: CQuestion[]
  /** End-of-unit test covering all lessons in this unit (3-5 questions) */
  unitTest?: CQuestion[]
}
export interface CSubject {
  name: string
  units: CUnit[]
}
export interface GradeCurriculum {
  grade: string
  gradeNum: number
  age: string
  tagline: string
  subjects: CSubject[]
}

const g = (
  grade: string,
  gradeNum: number,
  age: string,
  tagline: string,
  subjects: CSubject[]
): GradeCurriculum => ({ grade, gradeNum, age, tagline, subjects })


export const K: GradeCurriculum = g('Kindergarten', 0, '5-6', 'Foundations in faith, number, and wonder.', [
  { name: 'Mathematics', units: [
    { name: 'Q1 - Numbers 1-5', lessons: [
      { title: 'Counting 1 to 3', summary: 'Learning to count 1, 2, 3 with fingers and objects', weekTest: [
        { id: 'K-M-W1-1', q: 'How many fingers are held up? 👆👆', type: 'mc', options: ['1', '2', '3'], answer: 1 },
        { id: 'K-M-W1-2', q: 'Count the dots: • • •', type: 'mc', options: ['2', '3', '4'], answer: 1 },
        { id: 'K-M-W1-3', q: 'Which number comes after 1?', type: 'mc', options: ['2', '3', '0'], answer: 0 },
      ] },
      { title: 'Numbers 4 and 5', summary: 'Learning numbers 4 and 5 with counting practice', weekTest: [
        { id: 'K-M-W2-1', q: 'Count the stars: ⭐⭐⭐⭐⭐', type: 'mc', options: ['4', '5', '6'], answer: 1 },
        { id: 'K-M-W2-2', q: 'You have 3 fingers up. Put up 1 more. How many now?', type: 'mc', options: ['3', '4', '5'], answer: 1 },
        { id: 'K-M-W2-3', q: 'Which is the number 5?', type: 'mc', options: ['3', '4', '5'], answer: 2 },
      ] },
      { title: 'Recognizing Numbers 1-5', summary: 'Looking at and naming numbers 1, 2, 3, 4, 5', weekTest: [
        { id: 'K-M-W3-1', q: 'Which number is this: 3', type: 'mc', options: ['two', 'three', 'four'], answer: 1 },
        { id: 'K-M-W3-2', q: 'Find the number 1', type: 'mc', options: ['1', '2', '5'], answer: 0 },
        { id: 'K-M-W3-3', q: 'Which number is 4?', type: 'mc', options: ['2', '3', '4'], answer: 2 },
      ] },
    ], questions: [
      { id: 'K-M-U1-1', q: 'Count: 🐸🐸🐸 How many frogs?', type: 'mc', options: ['2', '3', '4'], answer: 1 },
      { id: 'K-M-U1-2', q: 'What number is this: 2', type: 'mc', options: ['one', 'two', 'three'], answer: 1 },
    ], unitTest: [
      { id: 'K-M-UT1-1', q: 'Count the dots: • • • • • How many dots?', type: 'mc', options: ['4', '5', '6'], answer: 1 },
      { id: 'K-M-UT1-2', q: 'Count the apples: 🍎🍎🍎🍎', type: 'mc', options: ['3', '4', '5'], answer: 1 },
      { id: 'K-M-UT1-3', q: 'Count: 1, 2, 3, 4, ___ What comes next?', type: 'mc', options: ['3', '5', '6'], answer: 1 },
    ] },
    
    { name: 'Q2 - Numbers 1-10', lessons: [
      { title: 'Numbers 6 and 7', summary: 'Learning to count 6 and 7 objects', weekTest: [
        { id: 'K-M-W4-1', q: 'Count the hearts: ❤️❤️❤️❤️❤️❤️', type: 'mc', options: ['5', '6', '7'], answer: 1 },
        { id: 'K-M-W4-2', q: 'How many circles: ○○○○○○○', type: 'mc', options: ['6', '7', '8'], answer: 1 },
        { id: 'K-M-W4-3', q: 'Which is number 7?', type: 'mc', options: ['6', '7', '8'], answer: 1 },
      ] },
      { title: 'Numbers 8, 9, and 10', summary: 'Counting up to 10 with objects and fingers', weekTest: [
        { id: 'K-M-W5-1', q: 'Count the balls: ⚽⚽⚽⚽⚽⚽⚽⚽', type: 'mc', options: ['7', '8', '9'], answer: 1 },
        { id: 'K-M-W5-2', q: 'How many flowers: 🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸', type: 'mc', options: ['9', '10', '11'], answer: 1 },
        { id: 'K-M-W5-3', q: 'What number is this: 9', type: 'mc', options: ['eight', 'nine', 'ten'], answer: 1 },
      ] },
      { title: 'Counting to 10', summary: 'Practice counting from 1 to 10 in order', weekTest: [
        { id: 'K-M-W6-1', q: 'What comes after 8?', type: 'mc', options: ['7', '9', '10'], answer: 1 },
        { id: 'K-M-W6-2', q: 'Count with me: 1, 2, 3, 4, 5, 6, 7, 8, 9, ?', type: 'mc', options: ['8', '10', '11'], answer: 1 },
        { id: 'K-M-W6-3', q: 'How many toes do you have?', type: 'mc', options: ['8', '9', '10'], answer: 2 },
      ] },
    ], questions: [
      { id: 'K-M-U2-1', q: 'Count the cars: 🚗🚗🚗🚗🚗🚗🚗🚗', type: 'mc', options: ['7', '8', '9'], answer: 1 },
      { id: 'K-M-U2-2', q: 'Count with me: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10! What number comes after 7?', type: 'mc', options: ['6', '8', '10'], answer: 1 },
    ], unitTest: [
      { id: 'K-M-UT2-1', q: 'Which number is 8?', type: 'mc', options: ['6', '7', '8'], answer: 2 },
      { id: 'K-M-UT2-2', q: 'Count from 1 to 10. What is the last number?', type: 'mc', options: ['9', '10', '11'], answer: 1 },
      { id: 'K-M-UT2-3', q: 'How many: 🎈🎈🎈🎈🎈🎈🎈🎈🎈', type: 'mc', options: ['8', '9', '10'], answer: 1 },
    ] },
    
    { name: 'Q3 - Basic Shapes', lessons: [
      { title: 'Circles', summary: 'Finding and recognizing circles all around us', weekTest: [
        { id: 'K-M-W7-1', q: 'Which shape is a circle?', type: 'mc', options: ['○', '□', '△'], answer: 0 },
        { id: 'K-M-W7-2', q: 'A ball is shaped like a...', type: 'mc', options: ['square', 'circle', 'triangle'], answer: 1 },
        { id: 'K-M-W7-3', q: 'How many circles? ○○○', type: 'mc', options: ['2', '3', '4'], answer: 1 },
      ] },
      { title: 'Squares', summary: 'Learning about squares and their four sides', weekTest: [
        { id: 'K-M-W8-1', q: 'Which shape is a square?', type: 'mc', options: ['○', '□', '△'], answer: 1 },
        { id: 'K-M-W8-2', q: 'A window is shaped like a...', type: 'mc', options: ['circle', 'square', 'triangle'], answer: 1 },
        { id: 'K-M-W8-3', q: 'How many sides does a square have?', type: 'mc', options: ['3', '4', '5'], answer: 1 },
      ] },
      { title: 'Triangles', summary: 'Recognizing triangles and their three sides', weekTest: [
        { id: 'K-M-W9-1', q: 'Which shape is a triangle?', type: 'mc', options: ['○', '□', '△'], answer: 2 },
        { id: 'K-M-W9-2', q: 'How many sides does a triangle have?', type: 'mc', options: ['2', '3', '4'], answer: 1 },
        { id: 'K-M-W9-3', q: 'Find the triangle: ○□△', type: 'mc', options: ['first', 'second', 'third'], answer: 2 },
      ] },
    ], questions: [
      { id: 'K-M-U3-1', q: 'Which shapes have corners? □△○', type: 'mc', options: ['circle only', 'square and triangle', 'all of them'], answer: 1 },
      { id: 'K-M-U3-2', q: 'A pizza slice looks like a...', type: 'mc', options: ['circle', 'square', 'triangle'], answer: 2 },
    ], unitTest: [
      { id: 'K-M-UT3-1', q: 'Sort the shapes: Which is round?', type: 'mc', options: ['square', 'triangle', 'circle'], answer: 2 },
      { id: 'K-M-UT3-2', q: 'Count the triangles: △○□△', type: 'mc', options: ['2', '3', '4'], answer: 0 },
      { id: 'K-M-UT3-3', q: 'Which shape has 4 equal sides?', type: 'mc', options: ['circle', 'square', 'triangle'], answer: 1 },
    ] },
    
    { name: 'Q4 - Colors & Comparisons', lessons: [
      { title: 'Colors Red and Blue', summary: 'Learning to name and find red and blue colors', weekTest: [
        { id: 'K-M-W10-1', q: 'What color is an apple? 🍎', type: 'mc', options: ['red', 'blue', 'yellow'], answer: 0 },
        { id: 'K-M-W10-2', q: 'What color is the sky?', type: 'mc', options: ['red', 'blue', 'green'], answer: 1 },
        { id: 'K-M-W10-3', q: 'Find the red circle: 🔴🔵🟡', type: 'mc', options: ['first', 'second', 'third'], answer: 0 },
      ] },
      { title: 'Colors Yellow and Green', summary: 'Recognizing yellow and green in our world', weekTest: [
        { id: 'K-M-W11-1', q: 'What color is the sun? ☀️', type: 'mc', options: ['green', 'yellow', 'blue'], answer: 1 },
        { id: 'K-M-W11-2', q: 'What color is grass?', type: 'mc', options: ['yellow', 'red', 'green'], answer: 2 },
        { id: 'K-M-W11-3', q: 'A banana is what color? 🍌', type: 'mc', options: ['green', 'yellow', 'red'], answer: 1 },
      ] },
      { title: 'Big and Small, More and Less', summary: 'Comparing sizes and small amounts', weekTest: [
        { id: 'K-M-W12-1', q: 'Which is bigger: elephant or mouse?', type: 'mc', options: ['mouse', 'elephant', 'same size'], answer: 1 },
        { id: 'K-M-W12-2', q: 'Which group has more? ●● or ●●●', type: 'mc', options: ['first group', 'second group', 'same'], answer: 1 },
        { id: 'K-M-W12-3', q: 'Which is smaller: 🐁 or 🐘?', type: 'mc', options: ['mouse', 'elephant', 'same'], answer: 0 },
      ] },
    ], questions: [
      { id: 'K-M-U4-1', q: 'What are the four colors we learned?', type: 'mc', options: ['red, blue, yellow, green', 'black, white, pink, purple', 'orange, brown, gray, gold'], answer: 0 },
      { id: 'K-M-U4-2', q: 'Which has less? ⭐⭐⭐ or ⭐⭐', type: 'mc', options: ['first group', 'second group', 'same'], answer: 1 },
    ], unitTest: [
      { id: 'K-M-UT4-1', q: 'Fire trucks are what color?', type: 'mc', options: ['blue', 'red', 'green'], answer: 1 },
      { id: 'K-M-UT4-2', q: 'Which is big and which is small? 🐕🐕‍🦺', type: 'mc', options: ['both big', 'puppy small, dog big', 'both small'], answer: 1 },
      { id: 'K-M-UT4-3', q: 'Count and compare: 🍪🍪 or 🍪🍪🍪🍪', type: 'mc', options: ['first has more', 'second has more', 'same amount'], answer: 1 },
    ] },
  ]},

  { name: 'Language Arts', units: [
    { name: 'Q1 - The Alphabet', lessons: [
      { title: 'ABC Song and Letter A', summary: 'Learning the alphabet song and recognizing letter A', weekTest: [
        { id: 'K-LA-W1-1', q: 'Which letter is A?', type: 'mc', options: ['A', 'B', 'C'], answer: 0 },
        { id: 'K-LA-W1-2', q: 'What comes first in the alphabet?', type: 'mc', options: ['B', 'A', 'C'], answer: 1 },
        { id: 'K-LA-W1-3', q: 'Sing with me: A, B, C... What comes next?', type: 'mc', options: ['D', 'E', 'F'], answer: 0 },
      ] },
      { title: 'Letters B and C', summary: 'Learning to see and name letters B and C', weekTest: [
        { id: 'K-LA-W2-1', q: 'Which letter is B?', type: 'mc', options: ['A', 'B', 'D'], answer: 1 },
        { id: 'K-LA-W2-2', q: 'Find the letter C', type: 'mc', options: ['O', 'C', 'G'], answer: 1 },
        { id: 'K-LA-W2-3', q: 'Put in order: C, A, B', type: 'mc', options: ['C, A, B', 'A, B, C', 'B, C, A'], answer: 1 },
      ] },
      { title: 'Letter D and ABC Review', summary: 'Adding letter D and practicing A, B, C, D', weekTest: [
        { id: 'K-LA-W3-1', q: 'Which letter is D?', type: 'mc', options: ['B', 'P', 'D'], answer: 2 },
        { id: 'K-LA-W3-2', q: 'What comes after C?', type: 'mc', options: ['B', 'D', 'E'], answer: 1 },
        { id: 'K-LA-W3-3', q: 'Find letter A: B A D', type: 'mc', options: ['first', 'second', 'third'], answer: 1 },
      ] },
    ], questions: [
      { id: 'K-LA-U1-1', q: 'How does the alphabet song start?', type: 'mc', options: ['A, B, C', 'D, E, F', '1, 2, 3'], answer: 0 },
      { id: 'K-LA-U1-2', q: 'Which letters did we learn? A B C ?', type: 'mc', options: ['E', 'D', 'F'], answer: 1 },
    ], unitTest: [
      { id: 'K-LA-UT1-1', q: 'Find all the A\'s: A B A C A', type: 'mc', options: ['2 A\'s', '3 A\'s', '4 A\'s'], answer: 1 },
      { id: 'K-LA-UT1-2', q: 'Which letter comes between A and C?', type: 'mc', options: ['D', 'B', 'E'], answer: 1 },
      { id: 'K-LA-UT1-3', q: 'Letters are different from numbers. A is a...', type: 'mc', options: ['number', 'letter', 'shape'], answer: 1 },
    ] },
    
    { name: 'Q2 - More Letters', lessons: [
      { title: 'Letters E, F, G', summary: 'Learning to recognize letters E, F, and G', weekTest: [
        { id: 'K-LA-W4-1', q: 'Which letter is E?', type: 'mc', options: ['F', 'E', 'H'], answer: 1 },
        { id: 'K-LA-W4-2', q: 'Find letter F: E F G', type: 'mc', options: ['first', 'second', 'third'], answer: 1 },
        { id: 'K-LA-W4-3', q: 'Which letter is G?', type: 'mc', options: ['C', 'O', 'G'], answer: 2 },
      ] },
      { title: 'Letters H, I, J', summary: 'Adding letters H, I, and J to our collection', weekTest: [
        { id: 'K-LA-W5-1', q: 'Which letter is tall like a ladder? H', type: 'mc', options: ['G', 'H', 'I'], answer: 1 },
        { id: 'K-LA-W5-2', q: 'Find the letter I: H I J', type: 'mc', options: ['first', 'second', 'third'], answer: 1 },
        { id: 'K-LA-W5-3', q: 'Which letter looks like a hook? J', type: 'mc', options: ['I', 'L', 'J'], answer: 2 },
      ] },
      { title: 'Letters K and L', summary: 'Learning letters K and L to finish our first set', weekTest: [
        { id: 'K-LA-W6-1', q: 'Which letter is K?', type: 'mc', options: ['X', 'K', 'Y'], answer: 1 },
        { id: 'K-LA-W6-2', q: 'Find letter L: K L M', type: 'mc', options: ['first', 'second', 'third'], answer: 1 },
        { id: 'K-LA-W6-3', q: 'Count the letters we know: A B C D E F G H I J K L', type: 'mc', options: ['10', '11', '12'], answer: 2 },
      ] },
    ], questions: [
      { id: 'K-LA-U2-1', q: 'Which letter comes after J?', type: 'mc', options: ['I', 'K', 'L'], answer: 1 },
      { id: 'K-LA-U2-2', q: 'Letters have names. What is this letter\'s name? F', type: 'mc', options: ['E', 'F', 'G'], answer: 1 },
    ], unitTest: [
      { id: 'K-LA-UT2-1', q: 'Put in ABC order: L, H, E', type: 'mc', options: ['L, H, E', 'E, H, L', 'H, E, L'], answer: 1 },
      { id: 'K-LA-UT2-2', q: 'Find letter I in this word: BIG', type: 'mc', options: ['first letter', 'second letter', 'third letter'], answer: 1 },
      { id: 'K-LA-UT2-3', q: 'How many letters from A to L?', type: 'mc', options: ['11', '12', '13'], answer: 1 },
    ] },
    
    { name: 'Q3 - Letter Sounds', lessons: [
      { title: 'Letters Make Sounds', summary: 'Learning that letters make sounds like /b/ and /m/', weekTest: [
        { id: 'K-LA-W7-1', q: 'The letter B says "buh". What sound does B make?', type: 'mc', options: ['mmm', 'buh', 'sss'], answer: 1 },
        { id: 'K-LA-W7-2', q: 'Ball starts with B. B says...', type: 'mc', options: ['buh', 'mmm', 'aaa'], answer: 0 },
        { id: 'K-LA-W7-3', q: 'What letter makes the "buh" sound?', type: 'mc', options: ['M', 'B', 'S'], answer: 1 },
      ] },
      { title: 'M Says Mmm', summary: 'Learning that M makes the "mmm" sound', weekTest: [
        { id: 'K-LA-W8-1', q: 'The letter M says "mmm". What sound does M make?', type: 'mc', options: ['buh', 'mmm', 'sss'], answer: 1 },
        { id: 'K-LA-W8-2', q: 'Mom starts with M. M says...', type: 'mc', options: ['mmm', 'buh', 'aaa'], answer: 0 },
        { id: 'K-LA-W8-3', q: 'Which letter says "mmm"?', type: 'mc', options: ['B', 'M', 'S'], answer: 1 },
      ] },
      { title: 'S Says Sss', summary: 'Learning that S makes the "sss" sound like a snake', weekTest: [
        { id: 'K-LA-W9-1', q: 'The letter S says "sss" like a snake. What sound does S make?', type: 'mc', options: ['buh', 'mmm', 'sss'], answer: 2 },
        { id: 'K-LA-W9-2', q: 'Sun starts with S. S says...', type: 'mc', options: ['sss', 'mmm', 'buh'], answer: 0 },
        { id: 'K-LA-W9-3', q: 'Which letter sounds like a snake?', type: 'mc', options: ['B', 'M', 'S'], answer: 2 },
      ] },
    ], questions: [
      { id: 'K-LA-U3-1', q: 'What sound does the letter B make?', type: 'mc', options: ['buh', 'mmm', 'sss'], answer: 0 },
      { id: 'K-LA-U3-2', q: 'What do we call the sound a letter makes?', type: 'mc', options: ['letter sound', 'letter name', 'letter shape'], answer: 0 },
    ], unitTest: [
      { id: 'K-LA-UT3-1', q: 'Match the sound: "mmm" goes with which letter?', type: 'mc', options: ['B', 'M', 'S'], answer: 1 },
      { id: 'K-LA-UT3-2', q: 'Snake, sun, sit all start with...', type: 'mc', options: ['B sound', 'M sound', 'S sound'], answer: 2 },
      { id: 'K-LA-UT3-3', q: 'Ball, boy, big all start with...', type: 'mc', options: ['B sound', 'M sound', 'S sound'], answer: 0 },
    ] },
    
    { name: 'Q4 - Rhymes & Print', lessons: [
      { title: 'Words That Rhyme', summary: 'Learning that some words sound the same at the end', weekTest: [
        { id: 'K-LA-W10-1', q: 'Cat and hat rhyme. They sound the same at the...', type: 'mc', options: ['beginning', 'end', 'middle'], answer: 1 },
        { id: 'K-LA-W10-2', q: 'Which word rhymes with "dog"?', type: 'mc', options: ['cat', 'frog', 'bird'], answer: 1 },
        { id: 'K-LA-W10-3', q: 'Do "sun" and "fun" rhyme?', type: 'mc', options: ['yes', 'no', 'maybe'], answer: 0 },
      ] },
      { title: 'How to Hold a Book', summary: 'Learning the right way to hold and look at books', weekTest: [
        { id: 'K-LA-W11-1', q: 'Which way do we hold a book?', type: 'mc', options: ['upside down', 'right side up', 'sideways'], answer: 1 },
        { id: 'K-LA-W11-2', q: 'We start reading at the...', type: 'mc', options: ['back of book', 'front of book', 'middle'], answer: 1 },
        { id: 'K-LA-W11-3', q: 'Books have pages. We turn pages...', type: 'mc', options: ['carefully', 'fast', 'backwards'], answer: 0 },
      ] },
      { title: 'Reading Goes Left to Right', summary: 'Learning that we read from left side to right side', weekTest: [
        { id: 'K-LA-W12-1', q: 'We read words from left to right. Which way is left to right? →', type: 'mc', options: ['this way →', 'this way ←', 'up and down'], answer: 0 },
        { id: 'K-LA-W12-2', q: 'When we read "I see a dog", we start with...', type: 'mc', options: ['dog', 'I', 'see'], answer: 1 },
        { id: 'K-LA-W12-3', q: 'After we read one line, we go...', type: 'mc', options: ['back to left', 'to the right', 'to the top'], answer: 0 },
      ] },
    ], questions: [
      { id: 'K-LA-U4-1', q: 'Rhyming words sound the same at the end. "Bee" and "tree" are...', type: 'mc', options: ['rhyming words', 'different words', 'big words'], answer: 0 },
      { id: 'K-LA-U4-2', q: 'Books teach us things. How should we treat books?', type: 'mc', options: ['throw them', 'take care of them', 'hide them'], answer: 1 },
    ], unitTest: [
      { id: 'K-LA-UT4-1', q: 'Find the rhyming pair: cat, dog, bat', type: 'mc', options: ['cat and dog', 'dog and bat', 'cat and bat'], answer: 2 },
      { id: 'K-LA-UT4-2', q: 'When someone reads to you, you should...', type: 'mc', options: ['listen', 'talk loud', 'run away'], answer: 0 },
      { id: 'K-LA-UT4-3', q: 'Reading goes from left to right. The first word is on the...', type: 'mc', options: ['right side', 'left side', 'bottom'], answer: 1 },
    ] },
  ]},

  { name: 'Spelling & Word Origins', units: [
    { name: 'Q1 - First Sight Words', lessons: [
      { title: 'The Word "I"', summary: 'Learning to recognize the word "I" when we see it', weekTest: [
        { id: 'K-SW-W1-1', q: 'Find the word "I": I see you', type: 'mc', options: ['first word', 'second word', 'third word'], answer: 0 },
        { id: 'K-SW-W1-2', q: 'Which word is "I"?', type: 'mc', options: ['see', 'I', 'you'], answer: 1 },
        { id: 'K-SW-W1-3', q: 'When we talk about ourselves, we say...', type: 'mc', options: ['you', 'I', 'we'], answer: 1 },
      ] },
      { title: 'The Word "a"', summary: 'Recognizing the small word "a" in sentences', weekTest: [
        { id: 'K-SW-W2-1', q: 'Find the word "a": I see a cat', type: 'mc', options: ['I', 'see', 'a'], answer: 2 },
        { id: 'K-SW-W2-2', q: 'Which word is "a"?', type: 'mc', options: ['a', 'an', 'and'], answer: 0 },
        { id: 'K-SW-W2-3', q: '"I want a cookie" - find the word "a"', type: 'mc', options: ['want', 'a', 'cookie'], answer: 1 },
      ] },
      { title: 'The Word "the"', summary: 'Learning to spot the word "the" everywhere', weekTest: [
        { id: 'K-SW-W3-1', q: 'Find "the": I see the dog', type: 'mc', options: ['see', 'the', 'dog'], answer: 1 },
        { id: 'K-SW-W3-2', q: 'Which word is "the"?', type: 'mc', options: ['then', 'the', 'they'], answer: 1 },
        { id: 'K-SW-W3-3', q: 'How many times do you see "the"? The cat saw the bird.', type: 'mc', options: ['1', '2', '3'], answer: 1 },
      ] },
    ], questions: [
      { id: 'K-SW-U1-1', q: 'Sight words are words we know by looking. "I" is a...', type: 'mc', options: ['sight word', 'big word', 'new word'], answer: 0 },
      { id: 'K-SW-U1-2', q: 'We see these words a lot: I, a, the. They are...', type: 'mc', options: ['hard words', 'sight words', 'long words'], answer: 1 },
    ], unitTest: [
      { id: 'K-SW-UT1-1', q: 'How many times do you see "I"? I see I am I go', type: 'mc', options: ['1', '2', '3'], answer: 2 },
      { id: 'K-SW-UT1-2', q: 'Find "the" and "a": I see a big the dog', type: 'mc', options: ['see, big', 'a, the', 'I, dog'], answer: 1 },
      { id: 'K-SW-UT1-3', q: 'Which is a sight word we learned?', type: 'mc', options: ['elephant', 'the', 'beautiful'], answer: 1 },
    ] },
    
    { name: 'Q2 - More Sight Words', lessons: [
      { title: 'The Word "see"', summary: 'Learning to recognize "see" with our eyes', weekTest: [
        { id: 'K-SW-W4-1', q: 'Find "see": I can see you', type: 'mc', options: ['can', 'see', 'you'], answer: 1 },
        { id: 'K-SW-W4-2', q: 'Which word is "see"?', type: 'mc', options: ['bee', 'see', 'tree'], answer: 1 },
        { id: 'K-SW-W4-3', q: '"I see the ball" - what does "see" mean?', type: 'mc', options: ['look with eyes', 'throw', 'catch'], answer: 0 },
      ] },
      { title: 'The Word "and"', summary: 'Recognizing "and" when it connects things', weekTest: [
        { id: 'K-SW-W5-1', q: 'Find "and": cats and dogs', type: 'mc', options: ['cats', 'and', 'dogs'], answer: 1 },
        { id: 'K-SW-W5-2', q: 'Which word is "and"?', type: 'mc', options: ['end', 'and', 'ant'], answer: 1 },
        { id: 'K-SW-W5-3', q: '"I like cookies and milk" - find "and"', type: 'mc', options: ['cookies', 'and', 'milk'], answer: 1 },
      ] },
      { title: 'The Word "is"', summary: 'Learning to see the word "is" in sentences', weekTest: [
        { id: 'K-SW-W6-1', q: 'Find "is": The dog is big', type: 'mc', options: ['dog', 'is', 'big'], answer: 1 },
        { id: 'K-SW-W6-2', q: 'Which word is "is"?', type: 'mc', options: ['it', 'is', 'in'], answer: 1 },
        { id: 'K-SW-W6-3', q: '"My mom is nice" - find "is"', type: 'mc', options: ['mom', 'is', 'nice'], answer: 1 },
      ] },
    ], questions: [
      { id: 'K-SW-U2-1', q: 'Now we know six sight words: I, a, the, see, and, is. That\'s...', type: 'mc', options: ['5 words', '6 words', '7 words'], answer: 1 },
      { id: 'K-SW-U2-2', q: 'When we "see" something, we use our...', type: 'mc', options: ['ears', 'eyes', 'nose'], answer: 1 },
    ], unitTest: [
      { id: 'K-SW-UT2-1', q: 'Find "and": I see cats and dogs and birds', type: 'mc', options: ['1 time', '2 times', '3 times'], answer: 1 },
      { id: 'K-SW-UT2-2', q: 'Which sentence has "is"?', type: 'mc', options: ['I see you', 'The cat is soft', 'Dogs and cats'], answer: 1 },
      { id: 'K-SW-UT2-3', q: 'Count the sight words: I see a big dog and the cat is nice', type: 'mc', options: ['4', '5', '6'], answer: 2 },
    ] },
    
    { name: 'Q3 - Words Are Everywhere', lessons: [
      { title: 'Words in Books', summary: 'Finding words on pages and understanding they mean things', weekTest: [
        { id: 'K-SW-W7-1', q: 'Books have words. Words tell us...', type: 'mc', options: ['nothing', 'stories', 'colors'], answer: 1 },
        { id: 'K-SW-W7-2', q: 'When someone reads words to you, you hear...', type: 'mc', options: ['music', 'stories', 'numbers'], answer: 1 },
        { id: 'K-SW-W7-3', q: 'Words on a page can tell us about...', type: 'mc', options: ['anything', 'only animals', 'only colors'], answer: 0 },
      ] },
      { title: 'Words on Signs', summary: 'Noticing that signs have words that tell us things', weekTest: [
        { id: 'K-SW-W8-1', q: 'Stop signs have words. They tell us to...', type: 'mc', options: ['go', 'stop', 'turn'], answer: 1 },
        { id: 'K-SW-W8-2', q: 'Store signs tell us...', type: 'mc', options: ['what\'s inside', 'the weather', 'the time'], answer: 0 },
        { id: 'K-SW-W8-3', q: 'Words on signs help us...', type: 'mc', options: ['know things', 'play games', 'sleep'], answer: 0 },
      ] },
      { title: 'Pointing to Words', summary: 'Using our finger to point at words while someone reads', weekTest: [
        { id: 'K-SW-W9-1', q: 'When someone reads "I see a cat", how many words are there?', type: 'mc', options: ['3', '4', '5'], answer: 1 },
        { id: 'K-SW-W9-2', q: 'Following words with our eyes helps us...', type: 'mc', options: ['follow along', 'turn pages', 'close book'], answer: 0 },
        { id: 'K-SW-W9-3', q: 'Words are separated by...', type: 'mc', options: ['lines', 'spaces', 'dots'], answer: 1 },
      ] },
    ], questions: [
      { id: 'K-SW-U3-1', q: 'Words have meaning. The word "dog" means...', type: 'mc', options: ['an animal', 'a color', 'a number'], answer: 0 },
      { id: 'K-SW-U3-2', q: 'We can find words...', type: 'mc', options: ['only in books', 'everywhere', 'only at school'], answer: 1 },
    ], unitTest: [
      { id: 'K-SW-UT3-1', q: 'Words tell us things. A book about cats tells us about...', type: 'mc', options: ['dogs', 'cats', 'birds'], answer: 1 },
      { id: 'K-SW-UT3-2', q: 'When you see words, you can ask someone to...', type: 'mc', options: ['hide them', 'read them', 'erase them'], answer: 1 },
      { id: 'K-SW-UT3-3', q: 'Each word means something. "Happy" means...', type: 'mc', options: ['sad', 'glad', 'mad'], answer: 1 },
    ] },
    
    { name: 'Q4 - My First Words', lessons: [
      { title: 'Words and Pictures Match', summary: 'Learning that spoken words go with pictures', weekTest: [
        { id: 'K-SW-W10-1', q: 'When we say "cat" and see a cat picture, they...', type: 'mc', options: ['match', 'are different', 'don\'t go together'], answer: 0 },
        { id: 'K-SW-W10-2', q: 'The word "ball" goes with a picture of a...', type: 'mc', options: ['car', 'ball', 'house'], answer: 1 },
        { id: 'K-SW-W10-3', q: 'Pictures help us understand...', type: 'mc', options: ['words', 'nothing', 'colors only'], answer: 0 },
      ] },
      { title: 'Family Words', summary: 'Learning words for people in our family', weekTest: [
        { id: 'K-SW-W11-1', q: 'The word "mom" means your...', type: 'mc', options: ['mother', 'sister', 'friend'], answer: 0 },
        { id: 'K-SW-W11-2', q: 'The word "dad" means your...', type: 'mc', options: ['brother', 'father', 'cousin'], answer: 1 },
        { id: 'K-SW-W11-3', q: 'Family words are about people who...', type: 'mc', options: ['live far away', 'love us', 'we don\'t know'], answer: 1 },
      ] },
      { title: 'My Name is a Word', summary: 'Understanding that our name is a special word', weekTest: [
        { id: 'K-SW-W12-1', q: 'Your name is a special word that means...', type: 'mc', options: ['everyone', 'you', 'no one'], answer: 1 },
        { id: 'K-SW-W12-2', q: 'When someone says your name, they want...', type: 'mc', options: ['you', 'someone else', 'nobody'], answer: 0 },
        { id: 'K-SW-W12-3', q: 'Everyone has a name. Names are...', type: 'mc', options: ['special words', 'numbers', 'colors'], answer: 0 },
      ] },
    ], questions: [
      { id: 'K-SW-U4-1', q: 'Words we say can match pictures we see. This helps us...', type: 'mc', options: ['understand', 'forget', 'sleep'], answer: 0 },
      { id: 'K-SW-U4-2', q: 'The most important word to you is your...', type: 'mc', options: ['favorite color', 'name', 'age'], answer: 1 },
    ], unitTest: [
      { id: 'K-SW-UT4-1', q: 'When you hear the word "dog", you think of...', type: 'mc', options: ['a cat', 'a dog', 'a bird'], answer: 1 },
      { id: 'K-SW-UT4-2', q: 'Family words like "mom", "dad", "sister" are about...', type: 'mc', options: ['strangers', 'people we love', 'animals'], answer: 1 },
      { id: 'K-SW-UT4-3', q: 'Your name is important because it tells people...', type: 'mc', options: ['your age', 'who you are', 'where you live'], answer: 1 },
    ] },
  ]},

  { name: 'Science', units: [
    { name: 'Q1 - Animals', lessons: [
      { title: 'Farm Animals', summary: 'Learning about cows, pigs, and chickens on the farm', weekTest: [
        { id: 'K-S-W1-1', q: 'What sound does a cow make?', type: 'mc', options: ['oink', 'moo', 'cluck'], answer: 1 },
        { id: 'K-S-W1-2', q: 'Which animal gives us milk?', type: 'mc', options: ['pig', 'cow', 'chicken'], answer: 1 },
        { id: 'K-S-W1-3', q: 'Chickens lay...', type: 'mc', options: ['eggs', 'milk', 'cheese'], answer: 0 },
      ] },
      { title: 'Pet Animals', summary: 'Learning about dogs and cats as our animal friends', weekTest: [
        { id: 'K-S-W2-1', q: 'What sound does a dog make?', type: 'mc', options: ['meow', 'woof', 'moo'], answer: 1 },
        { id: 'K-S-W2-2', q: 'What sound does a cat make?', type: 'mc', options: ['meow', 'woof', 'oink'], answer: 0 },
        { id: 'K-S-W2-3', q: 'Dogs and cats can be our...', type: 'mc', options: ['food', 'pets', 'toys'], answer: 1 },
      ] },
      { title: 'Animal Sounds and Homes', summary: 'Reviewing animal sounds and where animals live', weekTest: [
        { id: 'K-S-W3-1', q: 'Pigs say "oink" and live on a...', type: 'mc', options: ['farm', 'house', 'tree'], answer: 0 },
        { id: 'K-S-W3-2', q: 'Dogs live with families in a...', type: 'mc', options: ['barn', 'house', 'pond'], answer: 1 },
        { id: 'K-S-W3-3', q: 'Which animals live on farms?', type: 'mc', options: ['dogs and cats', 'cows and pigs', 'fish and birds'], answer: 1 },
      ] },
    ], questions: [
      { id: 'K-S-U1-1', q: 'Animals make different sounds. A chicken says...', type: 'mc', options: ['cluck', 'moo', 'woof'], answer: 0 },
      { id: 'K-S-U1-2', q: 'Some animals live on farms, others are pets. Cats are usually...', type: 'mc', options: ['farm animals', 'pets', 'wild animals'], answer: 1 },
    ], unitTest: [
      { id: 'K-S-UT1-1', q: 'Match the animal to its sound: cow', type: 'mc', options: ['woof', 'moo', 'cluck'], answer: 1 },
      { id: 'K-S-UT1-2', q: 'Which animals would you find on a farm?', type: 'mc', options: ['cows, pigs, chickens', 'dogs, cats, fish', 'bears, lions, tigers'], answer: 0 },
      { id: 'K-S-UT1-3', q: 'Pets are animals that...', type: 'mc', options: ['live far away', 'live with families', 'live in zoos'], answer: 1 },
    ] },
    
    { name: 'Q2 - My Body', lessons: [
      { title: 'Body Parts We Can See', summary: 'Learning about head, arms, legs, hands, and feet', weekTest: [
        { id: 'K-S-W4-1', q: 'What is on top of your body?', type: 'mc', options: ['feet', 'head', 'hands'], answer: 1 },
        { id: 'K-S-W4-2', q: 'We walk with our...', type: 'mc', options: ['hands', 'head', 'feet'], answer: 2 },
        { id: 'K-S-W4-3', q: 'We wave hello with our...', type: 'mc', options: ['hands', 'feet', 'head'], answer: 0 },
      ] },
      { title: 'Five Senses', summary: 'Learning about eyes, ears, nose, mouth, and hands for senses', weekTest: [
        { id: 'K-S-W5-1', q: 'We see with our...', type: 'mc', options: ['ears', 'eyes', 'nose'], answer: 1 },
        { id: 'K-S-W5-2', q: 'We hear with our...', type: 'mc', options: ['eyes', 'ears', 'mouth'], answer: 1 },
        { id: 'K-S-W5-3', q: 'We smell with our...', type: 'mc', options: ['nose', 'ears', 'hands'], answer: 0 },
      ] },
      { title: 'Taking Care of Our Body', summary: 'Learning to wash hands, brush teeth, and eat good food', weekTest: [
        { id: 'K-S-W6-1', q: 'We should wash our hands to stay...', type: 'mc', options: ['dirty', 'clean', 'wet'], answer: 1 },
        { id: 'K-S-W6-2', q: 'We brush our teeth to keep them...', type: 'mc', options: ['dirty', 'clean', 'hidden'], answer: 1 },
        { id: 'K-S-W6-3', q: 'Good food helps our body...', type: 'mc', options: ['grow', 'shrink', 'sleep'], answer: 0 },
      ] },
    ], questions: [
      { id: 'K-S-U2-1', q: 'Our body has many parts. We taste with our...', type: 'mc', options: ['nose', 'mouth', 'ears'], answer: 1 },
      { id: 'K-S-U2-2', q: 'God gave us five senses to...', type: 'mc', options: ['learn about our world', 'make noise', 'hide'], answer: 0 },
    ], unitTest: [
      { id: 'K-S-UT2-1', q: 'Your nose helps you...', type: 'mc', options: ['see', 'smell', 'hear'], answer: 1 },
      { id: 'K-S-UT2-2', q: 'We touch things with our...', type: 'mc', options: ['eyes', 'hands', 'ears'], answer: 1 },
      { id: 'K-S-UT2-3', q: 'To stay healthy, we should...', type: 'mc', options: ['never wash', 'eat good food and stay clean', 'only sleep'], answer: 1 },
    ] },
    
    { name: 'Q3 - Weather & Seasons', lessons: [
      { title: 'Sunny and Rainy Days', summary: 'Learning about sunshine and rain from the sky', weekTest: [
        { id: 'K-S-W7-1', q: 'When it\'s sunny, we see the...', type: 'mc', options: ['moon', 'sun', 'stars'], answer: 1 },
        { id: 'K-S-W7-2', q: 'When it rains, water falls from...', type: 'mc', options: ['trees', 'houses', 'clouds'], answer: 2 },
        { id: 'K-S-W7-3', q: 'Plants need sun and rain to...', type: 'mc', options: ['grow', 'sleep', 'hide'], answer: 0 },
      ] },
      { title: 'Hot and Cold Weather', summary: 'Understanding when weather feels hot or cold', weekTest: [
        { id: 'K-S-W8-1', q: 'In hot weather, we might...', type: 'mc', options: ['wear coats', 'go swimming', 'build snowmen'], answer: 1 },
        { id: 'K-S-W8-2', q: 'In cold weather, we might...', type: 'mc', options: ['wear shorts', 'wear coats', 'go swimming'], answer: 1 },
        { id: 'K-S-W8-3', q: 'Ice is very...', type: 'mc', options: ['hot', 'cold', 'warm'], answer: 1 },
      ] },
      { title: 'Summer and Winter', summary: 'Learning about warm summer and cold winter seasons', weekTest: [
        { id: 'K-S-W9-1', q: 'Summer is usually...', type: 'mc', options: ['cold', 'hot', 'freezing'], answer: 1 },
        { id: 'K-S-W9-2', q: 'Winter is usually...', type: 'mc', options: ['hot', 'warm', 'cold'], answer: 2 },
        { id: 'K-S-W9-3', q: 'We might see snow in...', type: 'mc', options: ['summer', 'winter', 'never'], answer: 1 },
      ] },
    ], questions: [
      { id: 'K-S-U3-1', q: 'Weather changes. Sometimes it\'s sunny, sometimes it\'s...', type: 'mc', options: ['always the same', 'rainy', 'never different'], answer: 1 },
      { id: 'K-S-U3-2', q: 'Seasons are different times of year. Summer and winter are...', type: 'mc', options: ['the same', 'different seasons', 'not real'], answer: 1 },
    ], unitTest: [
      { id: 'K-S-UT3-1', q: 'What do you wear when it\'s cold outside?', type: 'mc', options: ['swimsuit', 'warm clothes', 'nothing'], answer: 1 },
      { id: 'K-S-UT3-2', q: 'Rain comes from...', type: 'mc', options: ['the ground', 'clouds in the sky', 'trees'], answer: 1 },
      { id: 'K-S-UT3-3', q: 'Which season is usually cold?', type: 'mc', options: ['summer', 'winter', 'both'], answer: 1 },
    ] },
    
    { name: 'Q4 - God\'s World', lessons: [
      { title: 'Day and Night', summary: 'Learning about daytime with sun and nighttime with moon', weekTest: [
        { id: 'K-S-W10-1', q: 'During the day, we see the...', type: 'mc', options: ['moon', 'sun', 'stars'], answer: 1 },
        { id: 'K-S-W10-2', q: 'During the night, we see the...', type: 'mc', options: ['sun', 'moon', 'clouds'], answer: 1 },
        { id: 'K-S-W10-3', q: 'When do we usually sleep?', type: 'mc', options: ['day', 'night', 'morning'], answer: 1 },
      ] },
      { title: 'Plants Grow', summary: 'Learning that plants need water and sun to grow big', weekTest: [
        { id: 'K-S-W11-1', q: 'Plants need water and sun to...', type: 'mc', options: ['sleep', 'grow', 'hide'], answer: 1 },
        { id: 'K-S-W11-2', q: 'Trees are very big...', type: 'mc', options: ['animals', 'plants', 'rocks'], answer: 1 },
        { id: 'K-S-W11-3', q: 'Flowers are...', type: 'mc', options: ['animals', 'pretty plants', 'rocks'], answer: 1 },
      ] },
      { title: 'God Made Everything', summary: 'Understanding that God created the sun, moon, plants, and animals', weekTest: [
        { id: 'K-S-W12-1', q: 'Who made the sun and moon?', type: 'mc', options: ['people', 'God', 'animals'], answer: 1 },
        { id: 'K-S-W12-2', q: 'Who made all the animals?', type: 'mc', options: ['God', 'people', 'plants'], answer: 0 },
        { id: 'K-S-W12-3', q: 'God made everything in the world because He...', type: 'mc', options: ['was bored', 'loves us', 'was tired'], answer: 1 },
      ] },
    ], questions: [
      { id: 'K-S-U4-1', q: 'Every day, the sun comes up and then goes down. This makes...', type: 'mc', options: ['day and night', 'hot and cold', 'big and small'], answer: 0 },
      { id: 'K-S-U4-2', q: 'All living things need care to grow. Plants need...', type: 'mc', options: ['toys', 'water and sun', 'cars'], answer: 1 },
    ], unitTest: [
      { id: 'K-S-UT4-1', q: 'When the sun goes down, it becomes...', type: 'mc', options: ['day', 'night', 'morning'], answer: 1 },
      { id: 'K-S-UT4-2', q: 'A little seed can grow into a big...', type: 'mc', options: ['rock', 'plant', 'toy'], answer: 1 },
      { id: 'K-S-UT4-3', q: 'Who created all the wonderful things we see?', type: 'mc', options: ['people', 'God', 'animals'], answer: 1 },
    ] },
  ]},

  { name: 'History & Geography', units: [
    { name: 'Q1 - My Family', lessons: [
      { title: 'Mom and Dad', summary: 'Learning about our parents who take care of us', weekTest: [
        { id: 'K-HG-W1-1', q: 'Who lives at your house with you?', type: 'mc', options: ['Your family', 'Strangers', 'Animals'], answer: 0 },
      ] },
      { title: 'Siblings and Me', summary: 'Learning about brothers, sisters, and ourselves' },
      { title: 'Our Home', summary: 'Learning that our home is a special place where we live' },
    ], questions: [
      { id: 'K-HG-U1-1', q: 'Homes keep us...', type: 'mc', options: ['safe and warm', 'cold and wet', 'scared'], answer: 0 },
      { id: 'K-HG-U1-2', q: 'Who is part of your family?', type: 'mc', options: ['Mom and Dad', 'Strangers', 'Teachers'], answer: 0 },
    ]},
    { name: 'Q2 - Community Helpers', lessons: [
      { title: 'Firefighters Help Us', summary: 'Firefighters put out fires and help keep us safe!' },
      { title: 'Doctors Make Us Well', summary: 'A doctor helps you when you feel sick. They give you medicine.' },
      { title: 'Teachers Help Us Learn', summary: 'A teacher helps you learn new things every day!' },
    ], questions: [
      { id: 'K-HG-Q2-1', q: 'Who puts out fires?', type: 'mc', options: ['Firefighter', 'Doctor', 'Teacher'], answer: 0 },
      { id: 'K-HG-Q2-2', q: 'Who helps you when you feel sick?', type: 'mc', options: ['Firefighter', 'Doctor', 'Teacher'], answer: 1 },
    ]},
    { name: 'Q3 - My World', lessons: [
      { title: 'Earth Is Round', summary: 'Our Earth is round like a ball! We live on Earth.' },
      { title: 'Maps Show Places', summary: 'A map is a picture that shows where things are.' },
      { title: 'Where I Live', summary: 'I live in a house in a town. My town has stores and schools.' },
    ], questions: [
      { id: 'K-HG-Q3-1', q: 'Earth is shaped like a...', type: 'mc', options: ['ball', 'box', 'flat plate'], answer: 0 },
      { id: 'K-HG-Q3-2', q: 'A map shows...', type: 'mc', options: ['where places are', 'what to eat', 'how to count'], answer: 0 },
    ]},
    { name: 'Q4 - Holidays', lessons: [
      { title: 'Christmas', summary: 'Christmas is Jesus birthday. We give gifts and love our family.' },
      { title: 'Thanksgiving', summary: 'On Thanksgiving we say thank you for all the good things we have!' },
      { title: 'My Birthday', summary: 'Your birthday is the day you were born. We celebrate with cake!' },
    ], questions: [
      { id: 'K-HG-Q4-1', q: 'Christmas celebrates the birthday of...', type: 'mc', options: ['Jesus', 'a teacher', 'a firefighter'], answer: 0 },
      { id: 'K-HG-Q4-2', q: 'On Thanksgiving we say...', type: 'mc', options: ['thank you', 'happy birthday', 'goodnight'], answer: 0 },
    ]},
  ]},
  { name: 'Bible & Character', units: [
    { name: 'Q1 - God Made Me', lessons: [
      { title: 'I Am Special', summary: 'God made you and you are very special! God loves you!' },
      { title: 'God Made the World', summary: 'God made the sun, the moon, the stars, and all the animals!' },
      { title: 'Thank You God', summary: 'We can say thank you to God for our family and our home.' },
    ], questions: [
      { id: 'K-B-Q1-1', q: 'Who made you?', type: 'mc', options: ['God', 'a robot', 'no one'], answer: 0 },
      { id: 'K-B-Q1-2', q: 'Who made the world?', type: 'mc', options: ['God', 'a man', 'an animal'], answer: 0 },
    ]},
    { name: 'Q2 - Jesus Loves Me', lessons: [
      { title: 'Baby Jesus', summary: 'Baby Jesus was born. God sent Jesus because He loves us!' },
      { title: 'Jesus Is My Friend', summary: 'Jesus loves you and is your best friend! You can talk to Him anytime.' },
      { title: 'Jesus Helps Us', summary: 'Jesus helps us when we are sad or scared. He gives us peace.' },
    ], questions: [
      { id: 'K-B-Q2-1', q: 'Jesus loves...', type: 'mc', options: ['you', 'no one', 'only grown-ups'], answer: 0 },
      { id: 'K-B-Q2-2', q: 'Jesus is our...', type: 'mc', options: ['friend', 'enemy', 'stranger'], answer: 0 },
    ]},
    { name: 'Q3 - Being Kind', lessons: [
      { title: 'Share with Others', summary: 'Sharing makes everyone happy! Can you share your toy?' },
      { title: 'Use Kind Words', summary: 'Please and thank you are kind words. Say them every day!' },
      { title: 'Be a Good Friend', summary: 'A good friend is kind, shares, and helps others.' },
    ], questions: [
      { id: 'K-B-Q3-1', q: 'When someone gives you something, say...', type: 'mc', options: ['thank you', 'no', 'go away'], answer: 0 },
      { id: 'K-B-Q3-2', q: 'A good friend is...', type: 'mc', options: ['kind', 'mean', 'loud'], answer: 0 },
    ]},
    { name: 'Q4 - Thankful Hearts', lessons: [
      { title: 'Thank You for Food', summary: 'Before we eat, we can thank God for our food.' },
      { title: 'Thank You for Family', summary: 'God gave you your family. They love you very much!' },
      { title: 'I Am Thankful', summary: 'What are you thankful for? Let us thank God for all our blessings!' },
    ], questions: [
      { id: 'K-B-Q4-1', q: 'Before we eat, we thank...', type: 'mc', options: ['God', 'the food', 'the table'], answer: 0 },
      { id: 'K-B-Q4-2', q: 'We say thank you for our...', type: 'mc', options: ['family', 'toys only', 'nothing'], answer: 0 },
    ]},
  ]},
])

// ====================== 1ST GRADE ======================
export const G1: GradeCurriculum = g('1st Grade', 1, '6-7', 'Building skill and confidence in every subject.',
  [
    { name: 'Mathematics', units: [
      { name: 'Q1 — Addition & Subtraction', lessons: [
        { title: 'Facts to 10', summary: 'Lets play with numbers! Show me 3 fingers, then add 2 more. How many do you have now? Find 5 toys and take away 2. Count whats left!' },
        { title: 'Word Problems', summary: 'Lets solve fun puzzles with numbers! I have 2 cookies and you give me 1 more. How many cookies do I have now? Count your toys and take some away to make your own puzzle!' },
        { title: 'Fact Families', summary: 'Lets play with number friends! The numbers 2, 3, and 5 are best buddies because 2+3=5 and 3+2=5. Find 5 toys and split them into two groups to make your own number family!' },
      ], questions: [
        { id: '1-M-Q1-1', q: '7 - 3 = ?', type: 'mc', options: ['3', '4', '10'], answer: 1 },
        { id: '1-M-Q1-2', q: 'There are 4 red and 3 blue blocks. How many total?', type: 'mc', options: ['6', '7', '8'], answer: 1 },
      ]},
      { name: 'Q2 — Place Value', lessons: [
        { title: 'Tens & Ones', summary: 'Lets make groups of ten! Grab some toys or snacks. Put ten in one pile and the rest in another pile. Count how many piles of ten you made!' },
        { title: 'Count to 100', summary: 'Lets count to 100 together! Start with 1, 2, 3 and keep going as high as you can. Count the steps as you walk around the house!' },
        { title: 'Compare Numbers', summary: 'Lets see which number is bigger! Look at 3 and 7. Which pile has more toys? Point to the bigger number and make a silly face!' },
      ], questions: [
        { id: '1-M-Q2-1', q: 'How many tens in 46?', type: 'mc', options: ['4', '6', '46'], answer: 0 },
        { id: '1-M-Q2-2', q: 'Is 32 < 45? (yes/no)', type: 'mc', options: ['yes', 'no'], answer: 0 },
      ]},
      { name: 'Q3 — Measurement', lessons: [
        { title: 'Short & Long', summary: 'Lets find short and long things! Look at your pencil, then look at your bed. Which one is longer? Now find something short and something long in your room!' },
        { title: 'Tell Time (Hour)', summary: 'Look at the clock! The short hand tells us what hour it is. Can you point to the numbers on a clock and count from 1 to 12?' },
        { title: 'Count Money', summary: 'Lets count money together! Look at these coins and count them one by one. Find some pennies around the house and put them in a pile to count!' },
      ], questions: [
        { id: '1-M-Q3-1', q: 'What coin is worth 25 cents?', type: 'mc', options: ['penny', 'quarter', 'dime'], answer: 1 },
        { id: '1-M-Q3-2', q: 'When the little hand points to 3, it is ___ o\'clock.', type: 'mc', options: ['2', '3', '4'], answer: 1 },
      ]},
      { name: 'Q4 — Geometry & Graphs', lessons: [
        { title: '2D & 3D Shapes', summary: 'Look around your room! Can you find something round like a circle? Now find something with corners like a square. Lets go on a shape hunt together!' },
        { title: 'Picture Graphs', summary: 'Look at this picture! We can count how many apples, cars, and stars we see. Lets make our own picture graph with your toys - put all the blocks in one row and all the balls in another row!' },
        { title: 'Fractions: Half', summary: 'Lets make half! Take a cookie and break it into two same-size pieces. Now you have half and half! Find something else to split in half.' },
      ], questions: [
        { id: '1-M-Q4-1', q: 'A rectangle has how many corners?', type: 'mc', options: ['3', '4', '5'], answer: 1 },
        { id: '1-M-Q4-2', q: 'Cut a sandwich in 2 equal parts = ___', type: 'mc', options: ['halves', 'thirds', 'quarters'], answer: 0 },
      ]},
    ]},
    { name: 'Language Arts', units: [
      { name: 'Q1 — Phonics', lessons: [
        { title: 'Short Vowels', summary: 'Lets play with short vowel sounds! Say "cat" and listen to the middle sound - thats short A! Now find three things that start with short A sounds like "apple."' },
        { title: 'Blends', summary: 'Lets play with letter friends! When two letters hold hands, they make new sounds together. Find things that start with "bl" like block or "st" like stick!' },
        { title: 'Sight Words List 1', summary: 'Lets learn special words! These words are everywhere - on signs, in books, and on TV. Point to any word you see and tell me what it says!' },
      ], questions: [
        { id: '1-L-Q1-1', q: 'Which is a CVC word?', type: 'mc', options: ['tree', 'cat', 'boat'], answer: 1 },
        { id: '1-L-Q1-2', q: 'The word "cat" starts with the sound ___', type: 'mc', options: ['/k/', '/s/', '/m/'], answer: 0 },
      ]},
      { name: 'Q2 — Reading', lessons: [
        { title: 'Read Simple Books', summary: 'Lets read a book together! Pick your favorite book and sit next to me. Point to each word as I read it out loud.' },
        { title: 'Story Order', summary: 'Stories have a beginning, middle, and end! First the cat wakes up, then it plays, last it sleeps. Can you tell me what you did first, next, and last today?' },
        { title: 'Main Character', summary: 'The main character is the most important person in the story! They are who the story is all about. Point to the main character on each page as we read together.' },
      ], questions: [
        { id: '1-L-Q2-1', q: 'The people or animals in a story are the ___', type: 'mc', options: ['characters', 'weather', 'title'], answer: 0 },
        { id: '1-L-Q2-2', q: 'What happens first in a story?', type: 'mc', options: ['the beginning', 'the end', 'the middle'], answer: 0 },
      ]},
      { name: 'Q3 — Writing', lessons: [
        { title: 'Write a Sentence', summary: 'Lets make a sentence! A sentence tells us something. Pick your favorite toy and tell me one thing about it, like "My bear is soft."' },
        { title: 'Stretch a Word', summary: 'Lets make words longer! Say "cat" really slowly: c-a-t. Now clap for each sound you hear!' },
        { title: 'My Opinion', summary: 'What do you like best? Ice cream or cake? Tell me why you picked that one! Draw a picture of your favorite and tell someone all about it.' },
      ], questions: [
        { id: '1-L-Q3-1', q: 'A sentence ends with a ___', type: 'mc', options: ['comma', 'period', 'space'], answer: 1 },
        { id: '1-L-Q3-2', q: 'What makes a good sentence about your favorite food?', type: 'mc', options: ['I like pizza because it tastes good.', 'Pizza good me like.', 'Food is.'], answer: 0 },
      ]},
      { name: 'Q4 — Grammar', lessons: [
        { title: 'Nouns', summary: 'A noun is a person, place, or thing! Look around your room. Can you point to three things and say their names out loud?' },
        { title: 'Verbs', summary: 'Action words are called verbs! You can run, jump, and clap. Lets play verb charades - act out sleeping, eating, or dancing while I guess what youre doing!' },
        { title: 'Capitalization', summary: 'Big letters start sentences and names! Your name starts with a big letter. Circle the big letters you can find in this book!' },
      ], questions: [
        { id: '1-L-Q4-1', q: 'Which is a verb?', type: 'mc', options: ['run', 'red', 'book'], answer: 0 },
        { id: '1-L-Q4-2', q: 'We always capitalize the word ___', type: 'mc', options: ['the', 'I', 'and'], answer: 1 },
      ]},
    ]},
    { name: 'Spelling & Word Origins', units: [
      { name: 'Q1 — Short Vowel Words', lessons: [
        { title: 'List 1: -at/-an', summary: 'Lets play with words that sound like "cat" and "can"! Say "bat, hat, mat" - do you hear the "at" sound? Now try "man, pan, ran" and listen for "an"! Activity: Clap your hands each time you hear an "at" or "an" word when I read a story to you.' },
        { title: 'List 2: -ig/-og', summary: 'Lets make -ig and -og words! Say "pig" and "dog" with me. Can you hop like a frog and oink like a pig?' },
        { title: 'Origin: "dog"', summary: 'Lets say "dog" together! Can you hear the "o" sound in the middle? Find three things in your room that rhyme with dog, like log or frog!' },
      ], questions: [
        { id: '1-SP-Q1-1', q: 'Spell: c-a-t', type: 'mc', options: ['cat', 'bat', 'hat'], answer: 0 },
        { id: '1-SP-Q1-2', q: '"dog" comes from an old word meaning ___', type: 'mc', options: ['a friendly animal', 'a toy', 'a food'], answer: 0 },
      ]},
      { name: 'Q2 — Long Vowels', lessons: [
        { title: 'List 3: -ake/-ite', summary: 'Lets make words that sound like "cake" and "kite"! Say "bake" and "bite" - do you hear how long those sounds are? Point to things around you that rhyme with cake or kite!' },
        { title: 'List 4: -oat/-ain', summary: 'Lets play with sounds! Say "goat" and "rain" - do you hear the long sounds? Find something that floats like a boat or falls like rain!' },
        { title: 'Origin: "cake"', summary: 'The word "cake" has a long A sound! Can you say "cake" and stretch out the A? Lets pretend to blow out birthday candles and say "caaake" each time you blow!' },
      ], questions: [
        { id: '1-SP-Q2-1', q: 'Which uses a long a sound?', type: 'mc', options: ['cap', 'cake', 'cat'], answer: 1 },
        { id: '1-SP-Q2-2', q: 'Which word rhymes with "boat"?', type: 'mc', options: ['coat', 'dog', 'tree'], answer: 0 },
      ]},
      { name: 'Q3 — Blends & Digraphs', lessons: [
        { title: 'List 5: st-/bl-', summary: 'Lets play with sounds! Say "st" like in "stop" and "bl" like in "blue." Can you stomp your feet and blow like the wind?' },
        { title: 'List 6: sh-/ch-', summary: 'Lets make sh and ch sounds! Say "shh" like youre being quiet. Now say "ch" like a train - choo choo! Point to your mouth when you hear sh or ch sounds.' },
        { title: 'Origin: "ship"', summary: 'Lets say "ship" together! Can you hear the "sh" sound at the start? Find three things in your room that start with "sh" like ship, shoe, or shirt!' },
      ], questions: [
        { id: '1-SP-Q3-1', q: 'Which starts with "sh"?', type: 'mc', options: ['shop', 'stop', 'block'], answer: 0 },
        { id: '1-SP-Q3-2', q: 'Which word starts with "bl"?', type: 'mc', options: ['blue', 'red', 'cat'], answer: 0 },
      ]},
      { name: 'Q4 — Review', lessons: [
        { title: 'Master List', summary: 'Lets make a master list together! We can write down all your favorite things. Draw pictures of your toys, foods, and friends on paper!' },
        { title: 'Word Stories Recap', summary: 'We learned so many fun word stories! Can you tell me about the three little pigs? Lets act out your favorite story together!' },
        { title: 'Dictation', summary: 'Lets play word writing! Ill say a word and you write the letters you hear. Can you write "cat" when I say it out loud?' },
      ], questions: [
        { id: '1-SP-Q4-1', q: 'Write the word: "make".', type: 'mc', options: ['make', 'take', 'cake'], answer: 0 },
        { id: '1-SP-Q4-2', q: 'A word’s "origin" is ___', type: 'mc', options: ['where it came from', 'how it sounds', 'its color'], answer: 0 },
      ]},
    ]},
    { name: 'Science', units: [
      { name: 'Q1 — Animals', lessons: [
        { title: 'Mammals & Birds', summary: 'Mammals have fur and feed milk to their babies. Birds have feathers and lay eggs. Lets pretend to be animals - crawl like a bear, then flap your arms like a bird!' },
        { title: 'Insects', summary: 'Bugs are everywhere! Lets look for tiny crawling friends in your yard or by a window. Can you find an ant, beetle, or butterfly today?' },
        { title: 'Habitats', summary: 'Animals live in different homes called habitats. Bears live in forests and fish live in water. Can you crawl like a bear or swim like a fish?' },
      ], questions: [
        { id: '1-SC-Q1-1', q: 'A fish breathes with ___', type: 'mc', options: ['gills', 'lungs', 'skin'], answer: 0 },
        { id: '1-SC-Q1-2', q: 'Bears live in the ___', type: 'mc', options: ['ocean', 'forest', 'sky'], answer: 1 },
      ]},
      { name: 'Q2 — Plants Grow', lessons: [
        { title: 'What Plants Need', summary: 'Plants need water, sun, and dirt to grow big and strong! Just like you need food and water every day. Lets give your plant a drink of water and watch it grow!' },
        { title: 'Life Cycle', summary: 'Plants start as tiny seeds! They grow bigger and bigger until they make new seeds. Lets plant a bean in a cup and watch it grow every day!' },
        { title: 'Trees', summary: 'Trees are big plants that grow tall! They have roots under the ground and leaves up high. Lets go outside and hug a tree to see how big around it is!' },
      ], questions: [
        { id: '1-SC-Q2-1', q: 'Plants need ___ to make food.', type: 'mc', options: ['sunlight', 'candy', 'music'], answer: 0 },
        { id: '1-SC-Q2-2', q: 'A tiny plant starts as a ___', type: 'mc', options: ['seed', 'rock', 'cloud'], answer: 0 },
      ]},
      { name: 'Q3 — Weather & Sky', lessons: [
        { title: 'Clouds & Rain', summary: 'Look up at the sky! See those fluffy white clouds? When clouds get heavy with water, they make rain fall down. Lets go outside and catch raindrops in your hands!' },
        { title: 'Stars & Moon', summary: 'Look up at the night sky! You can see the bright moon and tiny stars twinkling. Lets go outside tonight and point to all the stars you can find!' },
        { title: 'Seasons Change', summary: 'The weather changes all year long! In summer its hot and sunny. In winter it gets cold and snowy. Look outside your window and draw what you see today!' },
      ], questions: [
        { id: '1-SC-Q3-1', q: 'Rain comes from ___', type: 'mc', options: ['clouds', 'the ground', 'the sun'], answer: 0 },
        { id: '1-SC-Q3-2', q: 'The moon shines at ___', type: 'mc', options: ['night', 'noon', 'breakfast'], answer: 0 },
      ]},
      { name: 'Q4 — Matter', lessons: [
        { title: '3 States', summary: 'Water can be ice, water, or steam! Ice is hard, water flows, and steam floats in the air. Lets find ice cubes in the freezer and watch them melt in your hands!' },
        { title: 'Change It', summary: 'Lets change things! Put an ice cube in a cup and watch it melt into water. Now put the cup in the freezer and watch the water turn back to ice!' },
        { title: 'Recycle', summary: 'Lets help the Earth! Find something old that we can use again. Can you put this bottle in our recycle bin?' },
      ], questions: [
        { id: '1-SC-Q4-1', q: 'Ice is a ___', type: 'mc', options: ['solid', 'liquid', 'gas'], answer: 0 },
        { id: '1-SC-Q4-2', q: 'We recycle to help ___', type: 'mc', options: ['the earth', 'the moon', 'space'], answer: 0 },
      ]},
    ]},
    { name: 'History & Geography', units: [
      { name: 'Q1 — Communities', lessons: [
        { title: 'Rural, Urban, Suburban', summary: 'Lets look at where people live! Some people live in the city with tall buildings. Others live in the country with farms and trees. Look out your window - what do you see?' },
        { title: 'Community Jobs', summary: 'People in our town have special jobs to help us! Some are doctors, teachers, and firefighters. Can you walk around your house and pretend to be different workers?' },
        { title: 'Earning & Spending', summary: 'People work to earn money. We use money to buy things we need and want. Lets play store! You can be the cashier and Ill buy toys from you.' },
      ], questions: [
        { id: '1-H-Q1-1', q: 'A farmer works in a ___ community.', type: 'mc', options: ['rural', 'city', 'subway'], answer: 0 },
        { id: '1-H-Q1-2', q: 'Something you NEED is ___', type: 'mc', options: ['food', 'toy', 'candy'], answer: 0 },
      ]},
      { name: 'Q2 — Maps', lessons: [
        { title: 'Map Parts', summary: 'Maps have special parts to help us! Lets look at a map together and find the title at the top. Can you point to the compass that shows which way is north?' },
        { title: 'My State', summary: 'Lets find our state on a map! Can you point to where we live? Draw a circle around our state with your finger.' },
        { title: 'Continents', summary: 'Look at this big map with me! Can you find the seven big pieces of land called continents? Lets point to each one and say its name together.' },
      ], questions: [
        { id: '1-H-Q2-1', q: 'A map key tells you what ___ mean.', type: 'mc', options: ['symbols', 'clouds', 'stars'], answer: 0 },
        { id: '1-H-Q2-2', q: 'We live on the continent of ___', type: 'mc', options: ['Asia', 'North America', 'Antarctica'], answer: 1 },
      ]},
      { name: 'Q3 — Past to Present', lessons: [
        { title: 'Long Ago', summary: 'Long ago, your grandma was a little girl just like you! She played with toys and ate yummy food too. Draw a picture of what you think grandma looked like when she was little!' },
        { title: 'Famous Americans', summary: 'Long ago, there were brave people who helped make America special. George Washington was our first president! Abraham Lincoln was very tall and kind. Can you stand up tall like Lincoln and wave like a president?' },
        { title: 'Timelines', summary: 'Lets make a timeline of your day! First you woke up, then you ate breakfast, now youre learning. Draw three pictures showing morning, afternoon, and night on a long paper strip.' },
      ], questions: [
        { id: '1-H-Q3-1', q: 'A timeline shows events in ___', type: 'mc', options: ['order', 'color', 'size'], answer: 0 },
        { id: '1-H-Q3-2', q: 'People long ago did not have ___', type: 'mc', options: ['computers', 'families', 'food'], answer: 0 },
      ]},
      { name: 'Q4 — America', lessons: [
        { title: 'The Flag', summary: 'Look at our flag! It has red, white, and blue stripes and white stars. Can you find something red, something white, and something blue in your room?' },
        { title: 'Pledge & Anthem', summary: 'We say special words to show we love America! The Pledge and our song make us feel proud. Lets put your hand on your heart and say "I love my country" together!' },
        { title: 'Good Citizens', summary: 'Good citizens help others and follow rules. You can be a good citizen by being kind and sharing. Lets practice! Pick up one toy and put it where it belongs.' },
      ], questions: [
        { id: '1-H-Q4-1', q: 'The American flag has ___ colors.', type: 'mc', options: ['2', '3', '4'], answer: 1 },
        { id: '1-H-Q4-2', q: 'A good citizen ___', type: 'mc', options: ['follows rules', 'breaks rules', 'ignores others'], answer: 0 },
      ]},
    ]},
    { name: 'Bible & Character', units: [
      { name: 'Q1 — Noah & Friends', lessons: [
        { title: 'Noah’s Ark', summary: 'God told Noah to build a big boat. Noah put two of every animal inside to keep them safe. Can you walk around like different animals? Try being a lion, then a frog!' },
        { title: 'Abraham', summary: 'Abraham loved God very much. God told Abraham to move to a new home far away. Lets pack a pretend suitcase with your toys like Abraham packed for his big trip!' },
        { title: 'Trusting God', summary: 'God loves you so much! He takes care of you every day. Close your eyes and think of three people who help you - thats how God shows His love!' },
      ], questions: [
        { id: '1-B-Q1-1', q: 'Noah built a big ___', type: 'mc', options: ['ark', 'house', 'boat', 'tower'], answer: 0 },
        { id: '1-B-Q1-2', q: 'God always ___ us.', type: 'mc', options: ['cares for', 'forgets', 'ignores'], answer: 0 },
      ]},
      { name: 'Q2 — Jesus’ Life', lessons: [
        { title: 'Jesus Is Born', summary: 'Jesus was born as a tiny baby, just like you were! God sent Jesus to show everyone how much He loves us. Lets pretend to rock baby Jesus - hold your arms and gently sway back and forth like youre holding a baby.' },
        { title: 'Miracles', summary: 'Jesus did amazing things called miracles! He helped sick people feel better and made food for hungry families. Lets pretend to help someone today - give your teddy bear a pretend band-aid!' },
        { title: 'The Lost Sheep', summary: 'Jesus told a story about a little sheep who got lost. The shepherd looked everywhere until he found his sheep! Lets play hide and seek with your favorite stuffed animal.' },
      ], questions: [
        { id: '1-B-Q2-1', q: 'Jesus was born in a ___', type: 'mc', options: ['barn', 'palace', 'tent'], answer: 0 },
        { id: '1-B-Q2-2', q: 'The lost sheep was ___ by Jesus.', type: 'mc', options: ['found', 'forgotten', 'lost'], answer: 0 },
      ]},
      { name: 'Q3 — Fruits of the Spirit', lessons: [
        { title: 'Love & Joy', summary: 'God wants us to show love and joy every day! When we hug someone or smile big, we share Gods love. Lets practice giving the biggest, happiest hug to everyone in our family today!' },
        { title: 'Peace & Patience', summary: 'God wants us to be peaceful and patient. When we feel mad or want something right now, we can take deep breaths. Lets practice! Breathe in slowly through your nose, then out through your mouth like blowing bubbles.' },
        { title: 'Kindness', summary: 'Being kind means being nice to others. You can share your toys or give hugs. Lets practice! Give me the biggest, warmest hug you can and tell someone "I love you" today.' },
      ], questions: [
        { id: '1-B-Q3-1', q: 'The Bible says the fruit of the Spirit is love, joy, ___', type: 'mc', options: ['peace', 'anger', 'fear'], answer: 0 },
        { id: '1-B-Q3-2', q: 'Kindness means we ___ others.', type: 'mc', options: ['help', 'hurt', 'push'], answer: 0 },
      ]},
      { name: 'Q4 — Thankfulness', lessons: [
        { title: 'Giving Thanks', summary: 'Lets say thank you for good things! What makes you happy today? Draw a picture of something you love and tell me why it makes you smile.' },
        { title: 'Serving Others', summary: 'We can help others and that makes us happy! You can help Mommy or Daddy by putting your toys away. Lets pick up three toys right now and put them where they belong!' },
        { title: 'My Church', summary: 'God gave us our church family! We can say thank you for all the people who love us there. Lets draw a picture of your favorite person at church and give them a big hug next Sunday!' },
      ], questions: [
        { id: '1-B-Q4-1', q: 'We give thanks to ___', type: 'mc', options: ['God', 'no one', 'TV'], answer: 0 },
        { id: '1-B-Q4-2', q: 'How can you help at home?', type: 'mc', options: ['Clean your room', 'Make a mess', 'Hide from chores'], answer: 0 },
      ]},
    ]},
  ])

export const CURRICULUM_PART1: GradeCurriculum[] = [K, G1]
