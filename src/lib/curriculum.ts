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


// ====================== KINDERGARTEN ======================
export const K: GradeCurriculum = g('Kindergarten', 0, '5-6', 'Foundations in faith, number, and wonder.',
  [
    // MATHEMATICS – 4 units (Q1 Counting&Shapes, Q2 Numbers to 20, Q3 Sorting&Patterns, Q4 Easy Addition)
    { name: 'Mathematics', units: [
      { name: 'Q1 – Counting & Shapes', lessons: [
        // WEEK 1: Counting 1-10
        { title: 'Counting 1 to 10', summary: 'Lets count together! One, two, three, four, five! Can you count with me?', weekTest: [
          { id: 'K-M-W1-1', q: 'Count with me: 1, 2, 3... What comes next?', type: 'mc', options: ['4', '5', '6'], answer: 0 },
          { id: 'K-M-W1-2', q: 'Show me 3 fingers. How many fingers is that?', type: 'mc', options: ['2', '3', '4'], answer: 1 },
          { id: 'K-M-W1-3', q: 'Point to the number 5. Which one is 5?', type: 'mc', options: ['3', '5', '8'], answer: 1 },
          { id: 'K-M-W1-4', q: 'Count these dots: • • • How many dots?', type: 'mc', options: ['2', '3', '4'], answer: 1 },
        ] },
        // WEEK 2: Basic Shapes
        { title: 'Basic Shapes', summary: 'A circle is round like a ball. A square has four sides. A triangle has three sides.', weekTest: [
          { id: 'K-M-W2-1', q: 'Which shape is round like a ball?', type: 'mc', options: ['Circle', 'Square', 'Triangle'], answer: 0 },
          { id: 'K-M-W2-2', q: 'Which shape has three corners?', type: 'mc', options: ['Circle', 'Square', 'Triangle'], answer: 2 },
          { id: 'K-M-W2-3', q: 'Which shape has four sides that are all the same?', type: 'mc', options: ['Circle', 'Square', 'Triangle'], answer: 1 },
          { id: 'K-M-W2-4', q: 'What shape is a wheel?', type: 'mc', options: ['Circle', 'Square', 'Triangle'], answer: 0 },
        ] },
        // WEEK 3: More or Less
        { title: 'More or Less', summary: 'Which pile has more toys? Which has less? Lets count and see!', weekTest: [
          { id: 'K-M-W3-1', q: 'Here are 2 apples and 4 apples. Which group has more?', type: 'mc', options: ['2 apples', '4 apples', 'Same'], answer: 1 },
          { id: 'K-M-W3-2', q: 'Look at 5 toys and 3 toys. Which group has less?', type: 'mc', options: ['5 toys', '3 toys', 'Same'], answer: 1 },
          { id: 'K-M-W3-3', q: 'Point to the bigger group: 1 cookie or 3 cookies?', type: 'mc', options: ['1 cookie', '3 cookies', 'Same'], answer: 1 },
          { id: 'K-M-W3-4', q: 'Which has more: 2 birds or 2 cats?', type: 'mc', options: ['2 birds', '2 cats', 'Same'], answer: 2 },
        ] },
      ], questions: [
        { id: 'K-M-Q1-1', q: 'Count to 5 with me: 1, 2, 3, 4, __', type: 'mc', options: ['3', '5', '6'], answer: 1 },
        { id: 'K-M-Q1-2', q: 'Which shape is round?', type: 'mc', options: ['Square', 'Circle', 'Triangle'], answer: 1 },
      ], unitTest: [
        { id: 'K-M-U1-1', q: 'What comes after 4 when counting?', type: 'mc', options: ['3', '5', '6'], answer: 1 },
        { id: 'K-M-U1-2', q: 'Which shape has three sides?', type: 'mc', options: ['Circle', 'Square', 'Triangle'], answer: 2 },
        { id: 'K-M-U1-3', q: 'Which group has more: 1 toy or 3 toys?', type: 'mc', options: ['1 toy', '3 toys', 'Same'], answer: 1 },
      ]},
      // Q2: Numbers 11-20
      { name: 'Q2 – Numbers to 20', lessons: [
        { title: 'Counting 11-20', summary: 'Count with me! After 10 comes 11, 12, 13... all the way to 20!', weekTest: [
          { id: 'K-M-W4-1', q: 'What comes after 10?', type: 'mc', options: ['9', '11', '20'], answer: 1 },
          { id: 'K-M-W4-2', q: 'Count with me: 15, 16, 17, __', type: 'mc', options: ['16', '18', '19'], answer: 1 },
          { id: 'K-M-W4-3', q: 'Which number comes before 20?', type: 'mc', options: ['18', '19', '21'], answer: 1 },
          { id: 'K-M-W4-4', q: 'Show me the number 15', type: 'mc', options: ['12', '15', '18'], answer: 1 },
        ] },
        { title: 'Number Recognition', summary: 'Can you find the number 15? Point to 12! Lets find numbers together.', weekTest: [
          { id: 'K-M-W5-1', q: 'Point to the number 12', type: 'mc', options: ['10', '12', '20'], answer: 1 },
          { id: 'K-M-W5-2', q: 'Which number is this: 16?', type: 'mc', options: ['14', '16', '18'], answer: 1 },
          { id: 'K-M-W5-3', q: 'Find the number 13', type: 'mc', options: ['11', '13', '15'], answer: 1 },
          { id: 'K-M-W5-4', q: 'What number is this: 19?', type: 'mc', options: ['17', '19', '20'], answer: 1 },
        ] },
        { title: 'Counting Everyday Things', summary: 'Count your toys! Count your fingers! How many things can you count?', weekTest: [
          { id: 'K-M-W6-1', q: 'Count your fingers on both hands. How many?', type: 'mc', options: ['5', '10', '15'], answer: 1 },
          { id: 'K-M-W6-2', q: 'If you have 12 blocks, is that more than 10?', type: 'mc', options: ['Yes', 'No', 'Same'], answer: 0 },
          { id: 'K-M-W6-3', q: 'Count 14 dots. Is 14 more than 13?', type: 'mc', options: ['Yes', 'No', 'Same'], answer: 0 },
          { id: 'K-M-W6-4', q: 'Which is bigger: 11 or 9?', type: 'mc', options: ['11', '9', 'Same'], answer: 0 },
        ] },
      ], questions: [
        { id: 'K-M-Q2-1', q: 'What number comes after 15?', type: 'mc', options: ['14', '16', '17'], answer: 1 },
        { id: 'K-M-Q2-2', q: 'Point to the number 18', type: 'mc', options: ['16', '18', '20'], answer: 1 },
      ], unitTest: [
        { id: 'K-M-U2-1', q: 'Count to 20. What comes after 19?', type: 'mc', options: ['18', '20', '21'], answer: 1 },
        { id: 'K-M-U2-2', q: 'Find the number 14', type: 'mc', options: ['12', '14', '16'], answer: 1 },
        { id: 'K-M-U2-3', q: 'Which is more: 13 or 17?', type: 'mc', options: ['13', '17', 'Same'], answer: 1 },
      ]},
      // Q3: Sorting & Patterns
      { name: 'Q3 – Sorting & Patterns', lessons: [
        { title: 'Sort by Color', summary: 'Put all the red toys together! Now all the blue toys! Can you sort by color?', weekTest: [
          { id: 'K-M-W7-1', q: 'Where do red blocks go?', type: 'mc', options: ['With red things', 'With blue things', 'Anywhere'], answer: 0 },
          { id: 'K-M-W7-2', q: 'Sort these: red ball, blue ball, red car. Which go together?', type: 'mc', options: ['Both red', 'Both blue', 'Both balls'], answer: 0 },
          { id: 'K-M-W7-3', q: 'What color are these sorted items: all green toys?', type: 'mc', options: ['Red', 'Green', 'Blue'], answer: 1 },
          { id: 'K-M-W7-4', q: 'Put the yellow toys together. What color group is this?', type: 'mc', options: ['Red', 'Yellow', 'Blue'], answer: 1 },
        ] },
        { title: 'Make a Pattern', summary: 'Red, blue, red, blue! Can you make a pattern with your toys?', weekTest: [
          { id: 'K-M-W8-1', q: 'Red, blue, red, blue, red... What comes next?', type: 'mc', options: ['Red', 'Blue', 'Yellow'], answer: 1 },
          { id: 'K-M-W8-2', q: 'Circle, square, circle, square... What comes next?', type: 'mc', options: ['Circle', 'Square', 'Triangle'], answer: 0 },
          { id: 'K-M-W8-3', q: 'Clap, stomp, clap, stomp... What comes next?', type: 'mc', options: ['Clap', 'Stomp', 'Jump'], answer: 0 },
          { id: 'K-M-W8-4', q: 'Big, small, big, small... What comes next?', type: 'mc', options: ['Big', 'Small', 'Medium'], answer: 0 },
        ] },
        { title: 'Same and Different', summary: 'These two blocks are the same color! These two are different. Can you find things that are the same?', weekTest: [
          { id: 'K-M-W9-1', q: 'Are these the same: two red balls?', type: 'mc', options: ['Same', 'Different', 'Maybe'], answer: 0 },
          { id: 'K-M-W9-2', q: 'Are these different: red ball and blue ball?', type: 'mc', options: ['Same', 'Different', 'Maybe'], answer: 1 },
          { id: 'K-M-W9-3', q: 'Find two things that are the same color', type: 'mc', options: ['Two red cars', 'Red car, blue car', 'All cars'], answer: 0 },
          { id: 'K-M-W9-4', q: 'Which are the same shape: circle and circle?', type: 'mc', options: ['Same', 'Different', 'Maybe'], answer: 0 },
        ] },
      ], questions: [
        { id: 'K-M-Q3-1', q: 'Red, blue, red... What comes next in this pattern?', type: 'mc', options: ['Red', 'Blue', 'Yellow'], answer: 1 },
        { id: 'K-M-Q3-2', q: 'Sort by color: Where does the green toy go?', type: 'mc', options: ['With red toys', 'With green toys', 'Anywhere'], answer: 1 },
      ], unitTest: [
        { id: 'K-M-U3-1', q: 'Make a pattern: Circle, square, circle... What comes next?', type: 'mc', options: ['Circle', 'Square', 'Triangle'], answer: 1 },
        { id: 'K-M-U3-2', q: 'Are two blue blocks the same color?', type: 'mc', options: ['Yes', 'No', 'Maybe'], answer: 0 },
        { id: 'K-M-U3-3', q: 'Sort these toys by color. Where do yellow toys go?', type: 'mc', options: ['With red', 'With yellow', 'With blue'], answer: 1 },
      ]},
      // Q4: More/Less & Colors
      { name: 'Q4 – More, Less & Colors', lessons: [
        { title: 'Which Group Has More?', summary: 'Here are 2 cookies and here are 5 cookies. Which group has more? Point to the bigger group!', weekTest: [
          { id: 'K-M-W10-1', q: 'Which has more: 3 apples or 1 apple?', type: 'mc', options: ['3 apples', '1 apple', 'Same'], answer: 0 },
          { id: 'K-M-W10-2', q: 'Count and compare: 4 toys or 2 toys?', type: 'mc', options: ['4 toys', '2 toys', 'Same'], answer: 0 },
          { id: 'K-M-W10-3', q: 'Which group is bigger: 5 balls or 3 balls?', type: 'mc', options: ['5 balls', '3 balls', 'Same'], answer: 0 },
          { id: 'K-M-W10-4', q: 'More cookies: 6 cookies or 4 cookies?', type: 'mc', options: ['6 cookies', '4 cookies', 'Same'], answer: 0 },
        ] },
        { title: 'Find the Colors', summary: 'Point to something red! Now find something blue! Can you name these colors?', weekTest: [
          { id: 'K-M-W11-1', q: 'What color is the sun?', type: 'mc', options: ['Red', 'Yellow', 'Blue'], answer: 1 },
          { id: 'K-M-W11-2', q: 'What color is grass?', type: 'mc', options: ['Green', 'Purple', 'Orange'], answer: 0 },
          { id: 'K-M-W11-3', q: 'Point to the red toy. What color is it?', type: 'mc', options: ['Red', 'Blue', 'Green'], answer: 0 },
          { id: 'K-M-W11-4', q: 'What color do you see in the sky?', type: 'mc', options: ['Purple', 'Blue', 'Pink'], answer: 1 },
        ] },
        { title: 'Big and Small', summary: 'Look at these two toys. One is big and one is small. Can you find something big in your room?', weekTest: [
          { id: 'K-M-W12-1', q: 'Which is bigger: an elephant or a mouse?', type: 'mc', options: ['Elephant', 'Mouse', 'Same'], answer: 0 },
          { id: 'K-M-W12-2', q: 'Which is smaller: a car or a house?', type: 'mc', options: ['Car', 'House', 'Same'], answer: 0 },
          { id: 'K-M-W12-3', q: 'Point to the big ball. Which one is big?', type: 'mc', options: ['The big one', 'The small one', 'Both'], answer: 0 },
          { id: 'K-M-W12-4', q: 'Which is small: a grape or a watermelon?', type: 'mc', options: ['Grape', 'Watermelon', 'Same'], answer: 0 },
        ] },
      ], questions: [
        { id: 'K-M-Q4-1', q: 'Which has more: 7 toys or 5 toys?', type: 'mc', options: ['7 toys', '5 toys', 'Same'], answer: 0 },
        { id: 'K-M-Q4-2', q: 'What color is an apple usually?', type: 'mc', options: ['Blue', 'Red', 'Purple'], answer: 1 },
      ], unitTest: [
        { id: 'K-M-U4-1', q: 'Compare groups: 8 blocks or 6 blocks has more?', type: 'mc', options: ['8 blocks', '6 blocks', 'Same'], answer: 0 },
        { id: 'K-M-U4-2', q: 'Name this color: What color is snow?', type: 'mc', options: ['Black', 'White', 'Brown'], answer: 1 },
        { id: 'K-M-U4-3', q: 'Which is bigger: a book or a library?', type: 'mc', options: ['Book', 'Library', 'Same'], answer: 1 },
      ]},
    ]},

    // LANGUAGE ARTS – 4 units
    { name: 'Language Arts', units: [
      { name: 'Q1 – Alphabet', lessons: [
        { title: "Sing the ABC's", summary: "Let's sing the alphabet song together! A, B, C, D... Can you sing with me?", weekTest: [
          { id: 'K-L-W1-1', q: 'What comes after A in the alphabet?', type: 'mc', options: ['B', 'C', 'D'], answer: 0 },
          { id: 'K-L-W1-2', q: 'Sing with me: A, B, C... What comes next?', type: 'mc', options: ['B', 'D', 'E'], answer: 1 },
          { id: 'K-L-W1-3', q: 'What is the first letter of the alphabet?', type: 'mc', options: ['A', 'B', 'Z'], answer: 0 },
          { id: 'K-L-W1-4', q: 'Point to the letter that comes before C', type: 'mc', options: ['A', 'B', 'D'], answer: 1 },
        ] },
        { title: 'Find the Letter A', summary: 'A is the first letter! Can you find the letter A? Point to A when you see it!', weekTest: [
          { id: 'K-L-W2-1', q: 'Point to the letter A', type: 'mc', options: ['A', 'B', 'C'], answer: 0 },
          { id: 'K-L-W2-2', q: 'Which one is the letter A?', type: 'mc', options: ['A', 'H', 'T'], answer: 0 },
          { id: 'K-L-W2-3', q: 'Find A in this group: B, A, D', type: 'mc', options: ['B', 'A', 'D'], answer: 1 },
          { id: 'K-L-W2-4', q: 'A is the __ letter of the alphabet', type: 'mc', options: ['first', 'last', 'middle'], answer: 0 },
        ] },
        { title: 'Capital and Lowercase', summary: 'A is a big letter. a is a small letter. Can you find the big A?', weekTest: [
          { id: 'K-L-W3-1', q: 'Which is the big letter A?', type: 'mc', options: ['A', 'a', 'both'], answer: 0 },
          { id: 'K-L-W3-2', q: 'Which is the small letter a?', type: 'mc', options: ['A', 'a', 'both'], answer: 1 },
          { id: 'K-L-W3-3', q: 'Point to the capital letter: A or a?', type: 'mc', options: ['A', 'a', 'both'], answer: 0 },
          { id: 'K-L-W3-4', q: 'Find the lowercase letter: B or b?', type: 'mc', options: ['B', 'b', 'both'], answer: 1 },
        ] },
      ], questions: [
        { id: 'K-L-Q1-1', q: 'What is the first letter you sing in the ABC song?', type: 'mc', options: ['A', 'B', 'Z'], answer: 0 },
        { id: 'K-L-Q1-2', q: 'Which is the capital letter A?', type: 'mc', options: ['A', 'a', 'B'], answer: 0 },
      ], unitTest: [
        { id: 'K-L-U1-1', q: 'Sing the ABC song: A, B, C, D... What comes after D?', type: 'mc', options: ['C', 'E', 'F'], answer: 1 },
        { id: 'K-L-U1-2', q: 'Find the letter A in this word: CAT', type: 'mc', options: ['C', 'A', 'T'], answer: 1 },
        { id: 'K-L-U1-3', q: 'Which is bigger: A or a?', type: 'mc', options: ['A', 'a', 'same'], answer: 0 },
      ]},
      { name: 'Q2 – Letter Sounds', lessons: [
        { title: 'B says Buh', summary: "B says 'buh' like ball! Can you say 'buh' with me? What starts with B?", weekTest: [
          { id: 'K-L-W4-1', q: 'What sound does B make?', type: 'mc', options: ['buh', 'duh', 'guh'], answer: 0 },
          { id: 'K-L-W4-2', q: 'Which word starts with B?', type: 'mc', options: ['ball', 'cat', 'dog'], answer: 0 },
          { id: 'K-L-W4-3', q: 'B says "buh". What starts with "buh"?', type: 'mc', options: ['book', 'tree', 'sun'], answer: 0 },
          { id: 'K-L-W4-4', q: 'Say "buh" like the letter B. What else starts with buh?', type: 'mc', options: ['boy', 'girl', 'mom'], answer: 0 },
        ] },
        { title: 'M says Mmm', summary: "M says 'mmm' like mom! Say 'mmm' with me. Can you find something that starts with M?", weekTest: [
          { id: 'K-L-W5-1', q: 'What sound does M make?', type: 'mc', options: ['mmm', 'sss', 'bbb'], answer: 0 },
          { id: 'K-L-W5-2', q: 'Which word starts with M?', type: 'mc', options: ['mom', 'dad', 'cat'], answer: 0 },
          { id: 'K-L-W5-3', q: 'M says "mmm". What starts with "mmm"?', type: 'mc', options: ['milk', 'juice', 'water'], answer: 0 },
          { id: 'K-L-W5-4', q: 'Find the word that starts with M sound', type: 'mc', options: ['mouse', 'house', 'bird'], answer: 0 },
        ] },
        { title: 'S says Sss', summary: "S says 'sss' like sun! Say 'sss' with me. What starts with S?", weekTest: [
          { id: 'K-L-W6-1', q: 'What sound does S make?', type: 'mc', options: ['sss', 'mmm', 'bbb'], answer: 0 },
          { id: 'K-L-W6-2', q: 'Which word starts with S?', type: 'mc', options: ['sun', 'moon', 'tree'], answer: 0 },
          { id: 'K-L-W6-3', q: 'S says "sss". What starts with "sss"?', type: 'mc', options: ['snake', 'frog', 'bird'], answer: 0 },
          { id: 'K-L-W6-4', q: 'Find the S word: Which starts with "sss"?', type: 'mc', options: ['sock', 'hat', 'coat'], answer: 0 },
        ] },
      ], questions: [
        { id: 'K-L-Q2-1', q: 'What sound does the letter B make?', type: 'mc', options: ['buh', 'mmm', 'sss'], answer: 0 },
        { id: 'K-L-Q2-2', q: 'Which word starts with M sound?', type: 'mc', options: ['man', 'car', 'dog'], answer: 0 },
      ], unitTest: [
        { id: 'K-L-U2-1', q: 'Say the sound: What does S say?', type: 'mc', options: ['sss', 'bbb', 'mmm'], answer: 0 },
        { id: 'K-L-U2-2', q: 'Which starts with B sound: ball or tall?', type: 'mc', options: ['ball', 'tall', 'both'], answer: 0 },
        { id: 'K-L-U2-3', q: 'Find the M word that starts with "mmm"', type: 'mc', options: ['map', 'cat', 'dog'], answer: 0 },
      ]},
      { name: 'Q3 – Rhyming', lessons: [
        { title: 'Words That Rhyme', summary: 'Cat and hat sound the same at the end! They rhyme! Can you say cat and hat?', weekTest: [
          { id: 'K-L-W7-1', q: 'Do cat and hat rhyme?', type: 'mc', options: ['Yes', 'No', 'Maybe'], answer: 0 },
          { id: 'K-L-W7-2', q: 'Which word rhymes with cat?', type: 'mc', options: ['hat', 'dog', 'sun'], answer: 0 },
          { id: 'K-L-W7-3', q: 'Say cat and hat. Do they sound the same at the end?', type: 'mc', options: ['Yes', 'No', 'Maybe'], answer: 0 },
          { id: 'K-L-W7-4', q: 'Rhyming words sound the same at the __', type: 'mc', options: ['end', 'beginning', 'middle'], answer: 0 },
        ] },
        { title: 'Find the Rhyme', summary: 'Dog and log rhyme! Frog and jog rhyme! Can you think of a word that rhymes with dog?', weekTest: [
          { id: 'K-L-W8-1', q: 'Which word rhymes with dog?', type: 'mc', options: ['log', 'cat', 'ball'], answer: 0 },
          { id: 'K-L-W8-2', q: 'Find the rhyme for frog', type: 'mc', options: ['jog', 'bird', 'fish'], answer: 0 },
          { id: 'K-L-W8-3', q: 'Do dog and log rhyme?', type: 'mc', options: ['Yes', 'No', 'Maybe'], answer: 0 },
          { id: 'K-L-W8-4', q: 'Which rhymes with log: dog or cat?', type: 'mc', options: ['dog', 'cat', 'both'], answer: 0 },
        ] },
        { title: 'Our Favorite Rhymes', summary: "Let's say silly rhymes together! Big and pig! Red and bed!", weekTest: [
          { id: 'K-L-W9-1', q: 'Do big and pig rhyme?', type: 'mc', options: ['Yes', 'No', 'Maybe'], answer: 0 },
          { id: 'K-L-W9-2', q: 'Which word rhymes with red?', type: 'mc', options: ['bed', 'blue', 'green'], answer: 0 },
          { id: 'K-L-W9-3', q: 'Find the rhyme for big', type: 'mc', options: ['pig', 'cow', 'duck'], answer: 0 },
          { id: 'K-L-W9-4', q: 'Do red and bed sound the same at the end?', type: 'mc', options: ['Yes', 'No', 'Maybe'], answer: 0 },
        ] },
      ], questions: [
        { id: 'K-L-Q3-1', q: 'Which word rhymes with hat?', type: 'mc', options: ['cat', 'dog', 'tree'], answer: 0 },
        { id: 'K-L-Q3-2', q: 'Do pig and big rhyme?', type: 'mc', options: ['Yes', 'No', 'Maybe'], answer: 0 },
      ], unitTest: [
        { id: 'K-L-U3-1', q: 'Find two words that rhyme: cat, hat, dog', type: 'mc', options: ['cat and hat', 'cat and dog', 'hat and dog'], answer: 0 },
        { id: 'K-L-U3-2', q: 'Which rhymes with sun: fun or moon?', type: 'mc', options: ['fun', 'moon', 'both'], answer: 0 },
        { id: 'K-L-U3-3', q: 'Do log and frog rhyme?', type: 'mc', options: ['Yes', 'No', 'Maybe'], answer: 0 },
      ]},
      { name: 'Q4 – Books & Stories', lessons: [
        { title: 'How to Hold a Book', summary: "Hold your book nicely! The front has a picture. Can you point to the front of the book?", weekTest: [
          { id: 'K-L-W10-1', q: 'Where is the front of the book?', type: 'mc', options: ['Has the picture', 'Has no picture', 'In the middle'], answer: 0 },
          { id: 'K-L-W10-2', q: 'How do we hold a book?', type: 'mc', options: ['Nicely', 'Upside down', 'Backwards'], answer: 0 },
          { id: 'K-L-W10-3', q: 'What does the front cover have?', type: 'mc', options: ['A picture', 'Nothing', 'Words only'], answer: 0 },
          { id: 'K-L-W10-4', q: 'Point to the front. Where is it?', type: 'mc', options: ['Cover with picture', 'Back of book', 'Inside pages'], answer: 0 },
        ] },
        { title: 'We Read Left to Right', summary: 'We read words from left to right. Can you move your finger from left to right on the page?', weekTest: [
          { id: 'K-L-W11-1', q: 'Which way do we read words?', type: 'mc', options: ['Left to right', 'Right to left', 'Up and down'], answer: 0 },
          { id: 'K-L-W11-2', q: 'Move your finger to read. Which direction?', type: 'mc', options: ['This way →', 'This way ←', 'Up and down'], answer: 0 },
          { id: 'K-L-W11-3', q: 'Start reading here. Where do you start?', type: 'mc', options: ['Left side', 'Right side', 'Middle'], answer: 0 },
          { id: 'K-L-W11-4', q: 'We read from left to __', type: 'mc', options: ['right', 'left', 'up'], answer: 0 },
        ] },
        { title: 'What Is a Word?', summary: 'Words are made of letters! This word is CAT. C-A-T. Can you point to a word on this page?', weekTest: [
          { id: 'K-L-W12-1', q: 'What are words made of?', type: 'mc', options: ['Letters', 'Pictures', 'Numbers'], answer: 0 },
          { id: 'K-L-W12-2', q: 'CAT is made of which letters?', type: 'mc', options: ['C-A-T', 'D-O-G', 'B-O-Y'], answer: 0 },
          { id: 'K-L-W12-3', q: 'Point to a word. What do you point to?', type: 'mc', options: ['Letters together', 'Just one letter', 'A picture'], answer: 0 },
          { id: 'K-L-W12-4', q: 'Words have __ put together', type: 'mc', options: ['letters', 'pictures', 'numbers'], answer: 0 },
        ] },
      ], questions: [
        { id: 'K-L-Q4-1', q: 'Which way do we read?', type: 'mc', options: ['Left to right', 'Right to left', 'Any way'], answer: 0 },
        { id: 'K-L-Q4-2', q: 'What is a word made of?', type: 'mc', options: ['Letters', 'Pictures', 'Colors'], answer: 0 },
      ], unitTest: [
        { id: 'K-L-U4-1', q: 'Where is the front of a book?', type: 'mc', options: ['Cover with picture', 'Back cover', 'Inside'], answer: 0 },
        { id: 'K-L-U4-2', q: 'We read words from left to __', type: 'mc', options: ['right', 'up', 'down'], answer: 0 },
        { id: 'K-L-U4-3', q: 'The word DOG has how many letters?', type: 'mc', options: ['3', '2', '4'], answer: 0 },
      ]},
    ]},

    // SPELLING & WORD ORIGINS – 4 units (Pre-Reading focus)
    { name: 'Spelling & Word Origins', units: [
      { name: 'Q1 – Sight Words', lessons: [
        { title: "The Word 'the'", summary: "Look at this word: 'the'. Can you point to 'the'? Let's find it in our book!", weekTest: [
          { id: 'K-SP-W1-1', q: 'Point to the word "the"', type: 'mc', options: ['the', 'cat', 'dog'], answer: 0 },
          { id: 'K-SP-W1-2', q: 'Which word is "the"?', type: 'mc', options: ['the', 'see', 'run'], answer: 0 },
          { id: 'K-SP-W1-3', q: 'Find "the" in this sentence: The cat runs.', type: 'mc', options: ['The', 'cat', 'runs'], answer: 0 },
          { id: 'K-SP-W1-4', q: 'Can you see the word "the"?', type: 'mc', options: ['the', 'and', 'you'], answer: 0 },
        ] },
        { title: "The Word 'I'", summary: "I is a word for yourself! Point to yourself and say 'I'!", weekTest: [
          { id: 'K-SP-W2-1', q: 'Point to the word "I"', type: 'mc', options: ['I', 'a', 'we'], answer: 0 },
          { id: 'K-SP-W2-2', q: 'Which word means you? "I like toys."', type: 'mc', options: ['I', 'like', 'toys'], answer: 0 },
          { id: 'K-SP-W2-3', q: 'Find "I" in: I see a dog.', type: 'mc', options: ['I', 'see', 'dog'], answer: 0 },
          { id: 'K-SP-W2-4', q: '"I" is a word for __', type: 'mc', options: ['yourself', 'someone else', 'everyone'], answer: 0 },
        ] },
        { title: "The Word 'see'", summary: "See means look! Can you say 'see'? I see a tree! Point to something you see.", weekTest: [
          { id: 'K-SP-W3-1', q: 'Point to the word "see"', type: 'mc', options: ['see', 'look', 'run'], answer: 0 },
          { id: 'K-SP-W3-2', q: 'What does "see" mean?', type: 'mc', options: ['look', 'run', 'eat'], answer: 0 },
          { id: 'K-SP-W3-3', q: 'Find "see" in: I see you.', type: 'mc', options: ['I', 'see', 'you'], answer: 1 },
          { id: 'K-SP-W3-4', q: '"I see a ball." What does see mean?', type: 'mc', options: ['look at', 'throw', 'catch'], answer: 0 },
        ] },
      ], questions: [
        { id: 'K-SP-Q1-1', q: 'Which word is "the"?', type: 'mc', options: ['the', 'see', 'run'], answer: 0 },
        { id: 'K-SP-Q1-2', q: 'Point to "I" in: I like books.', type: 'mc', options: ['I', 'like', 'books'], answer: 0 },
      ], unitTest: [
        { id: 'K-SP-U1-1', q: 'Find the word "the"', type: 'mc', options: ['the', 'and', 'you'], answer: 0 },
        { id: 'K-SP-U1-2', q: 'Which word means yourself?', type: 'mc', options: ['I', 'you', 'we'], answer: 0 },
        { id: 'K-SP-U1-3', q: 'What does "see" mean?', type: 'mc', options: ['look', 'hear', 'touch'], answer: 0 },
      ]},
      { name: 'Q2 – Words & Pictures', lessons: [
        { title: 'Cat Is a Word', summary: "C-A-T spells cat! A cat is a furry animal that says meow. Can you say 'cat'?", weekTest: [
          { id: 'K-SP-W4-1', q: 'What letters spell "cat"?', type: 'mc', options: ['C-A-T', 'D-O-G', 'B-I-G'], answer: 0 },
          { id: 'K-SP-W4-2', q: 'What sound does a cat make?', type: 'mc', options: ['meow', 'woof', 'moo'], answer: 0 },
          { id: 'K-SP-W4-3', q: 'Point to the word that matches this picture of a cat', type: 'mc', options: ['cat', 'dog', 'bird'], answer: 0 },
          { id: 'K-SP-W4-4', q: 'A cat is __', type: 'mc', options: ['furry', 'feathery', 'scaly'], answer: 0 },
        ] },
        { title: 'Dog Is a Word', summary: "D-O-G spells dog! A dog says woof! Can you point to a picture of a dog?", weekTest: [
          { id: 'K-SP-W5-1', q: 'What letters spell "dog"?', type: 'mc', options: ['D-O-G', 'C-A-T', 'B-O-Y'], answer: 0 },
          { id: 'K-SP-W5-2', q: 'What sound does a dog make?', type: 'mc', options: ['woof', 'meow', 'chirp'], answer: 0 },
          { id: 'K-SP-W5-3', q: 'Match the word to the picture of a dog', type: 'mc', options: ['dog', 'cat', 'fish'], answer: 0 },
          { id: 'K-SP-W5-4', q: 'D-O-G spells __', type: 'mc', options: ['dog', 'dig', 'big'], answer: 0 },
        ] },
        { title: 'Sun Is a Word', summary: "S-U-N spells sun! The sun is bright and yellow in the sky. Point to the sun!", weekTest: [
          { id: 'K-SP-W6-1', q: 'What letters spell "sun"?', type: 'mc', options: ['S-U-N', 'M-O-N', 'R-U-N'], answer: 0 },
          { id: 'K-SP-W6-2', q: 'What color is the sun?', type: 'mc', options: ['yellow', 'blue', 'green'], answer: 0 },
          { id: 'K-SP-W6-3', q: 'Where is the sun?', type: 'mc', options: ['in the sky', 'on the ground', 'in water'], answer: 0 },
          { id: 'K-SP-W6-4', q: 'The sun is __', type: 'mc', options: ['bright', 'dark', 'cold'], answer: 0 },
        ] },
      ], questions: [
        { id: 'K-SP-Q2-1', q: 'C-A-T spells which word?', type: 'mc', options: ['cat', 'dog', 'sun'], answer: 0 },
        { id: 'K-SP-Q2-2', q: 'Match the word "dog" to its picture', type: 'mc', options: ['dog picture', 'cat picture', 'bird picture'], answer: 0 },
      ], unitTest: [
        { id: 'K-SP-U2-1', q: 'What word do these letters spell: S-U-N?', type: 'mc', options: ['sun', 'fun', 'run'], answer: 0 },
        { id: 'K-SP-U2-2', q: 'Which animal says "meow"?', type: 'mc', options: ['cat', 'dog', 'cow'], answer: 0 },
        { id: 'K-SP-U2-3', q: 'Point to the word that matches a yellow thing in the sky', type: 'mc', options: ['sun', 'moon', 'star'], answer: 0 },
      ]},
      { name: 'Q3 – Word Families', lessons: [
        { title: 'Words That End in AT', summary: "Bat, cat, hat all end with 'at'! Can you say 'at'? Bat! Cat! Hat!", weekTest: [
          { id: 'K-SP-W7-1', q: 'Which words all end with "at"?', type: 'mc', options: ['bat, cat, hat', 'dog, log, frog', 'big, pig, fig'], answer: 0 },
          { id: 'K-SP-W7-2', q: 'What do bat, cat, and hat have at the end?', type: 'mc', options: ['at', 'og', 'ig'], answer: 0 },
          { id: 'K-SP-W7-3', q: 'Which word belongs in the "at" family?', type: 'mc', options: ['rat', 'dog', 'sun'], answer: 0 },
          { id: 'K-SP-W7-4', q: 'Say the "at" words: bat, cat, __', type: 'mc', options: ['hat', 'dog', 'big'], answer: 0 },
        ] },
        { title: 'Words That End in OG', summary: "Dog, log, frog all end with 'og'! Can you hop like a frog?", weekTest: [
          { id: 'K-SP-W8-1', q: 'Which words all end with "og"?', type: 'mc', options: ['dog, log, frog', 'bat, cat, hat', 'big, pig, fig'], answer: 0 },
          { id: 'K-SP-W8-2', q: 'What sound do you hear at the end of "dog"?', type: 'mc', options: ['og', 'at', 'ig'], answer: 0 },
          { id: 'K-SP-W8-3', q: 'Which word belongs in the "og" family?', type: 'mc', options: ['frog', 'cat', 'sun'], answer: 0 },
          { id: 'K-SP-W8-4', q: 'Which word rhymes with "log"?', type: 'mc', options: ['frog', 'cat', 'sun'], answer: 0 },
        ] },
        { title: 'Fun with Family Words', summary: "Lets say word families together! Bat, cat, hat! Dog, log, frog!", weekTest: [
          { id: 'K-SP-W9-1', q: 'Which word belongs to the "at" family?', type: 'mc', options: ['bat', 'dog', 'sun'], answer: 0 },
          { id: 'K-SP-W9-2', q: 'Which word belongs to the "og" family?', type: 'mc', options: ['frog', 'hat', 'big'], answer: 0 },
          { id: 'K-SP-W9-3', q: 'Does "cat" end with "at" or "og"?', type: 'mc', options: ['at', 'og', 'neither'], answer: 0 },
          { id: 'K-SP-W9-4', q: 'Does "dog" end with "at" or "og"?', type: 'mc', options: ['at', 'og', 'neither'], answer: 1 },
        ] },
      ], questions: [
        { id: 'K-SP-Q3-1', q: 'Which ending sound do bat, cat, hat share?', type: 'mc', options: ['at', 'og', 'ig'], answer: 0 },
        { id: 'K-SP-Q3-2', q: 'Which ending sound do dog, log, frog share?', type: 'mc', options: ['at', 'og', 'ig'], answer: 1 },
      ]},
      { name: 'Q4 - Review', lessons: [
        { title: 'Words I Know', summary: 'Look at all the words we learned! Can you find "the"? You know so many words!' },
        { title: 'Letters I Know', summary: 'We learned letters A, B, C, M, S! Can you point to the letter A?' },
        { title: 'Let Us Read Together', summary: "Let's look at a book together! Point to a word you know!" },
      ], questions: [
        { id: 'K-SP-Q4-1', q: 'Point to the word "the". Which one is "the"?', type: 'mc', options: ['the', 'cat', 'dog'], answer: 0 },
        { id: 'K-SP-Q4-2', q: 'Which letter makes the "buh" sound?', type: 'mc', options: ['B', 'A', 'C'], answer: 0 },
      ]},
    ]},
    { name: 'Science', units: [
      { name: 'Q1 - Gods World', lessons: [
        { title: 'Day and Night', summary: 'God made the sun for daytime and the moon for nighttime.' },
        { title: 'The Sun and Moon', summary: 'The sun is bright and hot. The moon shines at night.' },
        { title: 'Weather', summary: 'Sometimes it is sunny. Sometimes it rains. What is the weather today?' },
      ], questions: [
        { id: 'K-SC-Q1-1', q: 'When the sun is out, it is ___', type: 'mc', options: ['daytime', 'nighttime', 'bedtime'], answer: 0 },
        { id: 'K-SC-Q1-2', q: 'The sun gives us ___', type: 'mc', options: ['light', 'rain', 'snow'], answer: 0 },
      ]},
      { name: 'Q2 - Animals', lessons: [
        { title: 'Farm Animals', summary: 'A cow says moo! A pig says oink! A chicken says cluck!' },
        { title: 'Pets', summary: 'A dog is a pet. A cat is a pet. Do you have a pet?' },
        { title: 'Animal Babies', summary: 'A baby dog is a puppy. A baby cat is a kitten.' },
      ], questions: [
        { id: 'K-SC-Q2-1', q: 'Which animal says "moo"?', type: 'mc', options: ['cow', 'dog', 'chicken'], answer: 0 },
        { id: 'K-SC-Q2-2', q: 'Which animal is a pet?', type: 'mc', options: ['dog', 'lion', 'bear'], answer: 0 },
      ]},
      { name: 'Q3 - My Body', lessons: [
        { title: 'My Body Parts', summary: 'You have eyes to see, ears to hear, and hands to touch!' },
        { title: 'My Five Senses', summary: 'We see with our eyes. We hear with our ears. We smell with our nose!' },
        { title: 'Staying Healthy', summary: 'We wash our hands. We brush our teeth. We eat good food!' },
      ], questions: [
        { id: 'K-SC-Q3-1', q: 'We see with our ___', type: 'mc', options: ['eyes', 'ears', 'nose'], answer: 0 },
        { id: 'K-SC-Q3-2', q: 'We hear with our ___', type: 'mc', options: ['eyes', 'ears', 'nose'], answer: 1 },
      ]},
      { name: 'Q4 - Seasons', lessons: [
        { title: 'Four Seasons', summary: 'God made four seasons! Spring, summer, fall, winter.' },
        { title: 'Summer and Winter', summary: 'Summer is hot! We wear shorts. Winter is cold! We wear coats.' },
        { title: 'Spring and Fall', summary: 'Spring has flowers! Fall has colorful leaves!' },
      ], questions: [
        { id: 'K-SC-Q4-1', q: 'In summer the weather is ___', type: 'mc', options: ['hot', 'cold', 'snowy'], answer: 0 },
        { id: 'K-SC-Q4-2', q: 'In winter the weather is ___', type: 'mc', options: ['hot', 'cold', 'rainy'], answer: 1 },
      ]},
    ]},
    { name: 'History & Geography', units: [
      { name: 'Q1 - My Family', lessons: [
        { title: 'People in My Family', summary: 'Every family is special! A mom and dad. Who is in your family?' },
        { title: 'My Home', summary: 'You live in a home with a kitchen, bedroom, and living room.' },
        { title: 'Taking Care of Each Other', summary: 'Families take care of each other! You can help by picking up your toys!' },
      ], questions: [
        { id: 'K-H-Q1-1', q: 'Who takes care of you at home?', type: 'mc', options: ['Mom and Dad', 'A stranger', 'No one'], answer: 0 },
        { id: 'K-H-Q1-2', q: 'You live in a ___', type: 'mc', options: ['home', 'store', 'school'], answer: 0 },
      ]},
      { name: 'Q2 - Community Helpers', lessons: [
        { title: 'Firefighters', summary: 'Firefighters put out fires and keep us safe!' },
        { title: 'Doctors and Teachers', summary: 'A doctor helps you when you are sick. A teacher helps you learn!' },
        { title: 'Helpers in Our Town', summary: 'The mailman brings letters. The farmer grows our food.' },
      ], questions: [
        { id: 'K-H-Q2-1', q: 'Who puts out fires?', type: 'mc', options: ['firefighter', 'teacher', 'baker'], answer: 0 },
        { id: 'K-H-Q2-2', q: 'Who helps you when you are sick?', type: 'mc', options: ['doctor', 'firefighter', 'mailman'], answer: 0 },
      ]},
      { name: 'Q3 - Our World', lessons: [
        { title: 'Earth Is Round', summary: 'Our Earth is round like a ball! We live on Earth.' },
        { title: 'Maps Show Places', summary: 'A map shows where places are in our town.' },
        { title: 'Where Do We Live?', summary: 'We live in a town with houses, stores, and schools.' },
      ], questions: [
        { id: 'K-H-Q3-1', q: 'Earth is shaped like a ___', type: 'mc', options: ['ball', 'box', 'plate'], answer: 0 },
        { id: 'K-H-Q3-2', q: 'A map shows ___', type: 'mc', options: ['places', 'food', 'toys'], answer: 0 },
      ]},
      { name: 'Q4 - Holidays', lessons: [
        { title: 'Christmas', summary: 'Christmas is when we celebrate Jesus birthday! We give gifts.' },
        { title: 'Thanksgiving', summary: 'On Thanksgiving we say thank you for all we have!' },
        { title: 'My Birthday', summary: 'Your birthday is the day you were born! We celebrate with cake!' },
      ], questions: [
        { id: 'K-H-Q4-1', q: 'At Christmas we celebrate ___ birthday', type: 'mc', options: ['Jesus', 'yours', 'no ones'], answer: 0 },
        { id: 'K-H-Q4-2', q: 'On Thanksgiving we say ___', type: 'mc', options: ['thank you', 'happy birthday', 'goodnight'], answer: 0 },
      ]},
    ]},
    { name: 'Bible & Character', units: [
      { name: 'Q1 - God Made Me', lessons: [
        { title: 'I Am Special', summary: 'God made you and you are special! Look in the mirror and smile!' },
        { title: 'God Made the World', summary: 'God made the sun, moon, stars, trees, and animals!' },
        { title: 'Thank You God', summary: "Let's say thank you to God for our family, our home, and our toys!" },
      ], questions: [
        { id: 'K-B-Q1-1', q: 'Who made you?', type: 'mc', options: ['God', 'a robot', 'no one'], answer: 0 },
        { id: 'K-B-Q1-2', q: 'Who made the sun and stars?', type: 'mc', options: ['God', 'a man', 'a bird'], answer: 0 },
      ]},
      { name: 'Q2 - Jesus Loves Me', lessons: [
        { title: 'Baby Jesus', summary: 'Baby Jesus was born. God sent Jesus because He loves us!' },
        { title: 'Jesus Is My Friend', summary: 'Jesus loves you and is your friend! You can talk to Jesus anytime.' },
        { title: 'Jesus Helps Us', summary: 'Jesus helps us when we are sad or scared.' },
      ], questions: [
        { id: 'K-B-Q2-1', q: 'Jesus loves ___', type: 'mc', options: ['you', 'no one', 'only grown-ups'], answer: 0 },
        { id: 'K-B-Q2-2', q: 'Jesus is our ___', type: 'mc', options: ['friend', 'enemy', 'stranger'], answer: 0 },
      ]},
      { name: 'Q3 - Being Kind', lessons: [
        { title: 'Share with Others', summary: 'Sharing makes everyone happy! Can you share your toy?' },
        { title: 'Use Kind Words', summary: 'Please and thank you are kind words! Can you say please?' },
        { title: 'Be a Good Friend', summary: 'A good friend shares, is kind, and helps others!' },
      ], questions: [
        { id: 'K-B-Q3-1', q: 'When someone gives you something, say ___', type: 'mc', options: ['thank you', 'no', 'go away'], answer: 0 },
        { id: 'K-B-Q3-2', q: 'A good friend is ___', type: 'mc', options: ['kind', 'mean', 'loud'], answer: 0 },
      ]},
      { name: 'Q4 - Thankful Hearts', lessons: [
        { title: 'Thank You for Food', summary: 'Before we eat, we thank God for this food!' },
        { title: 'Thank You for Family', summary: 'God gave you your family who love you!' },
        { title: 'I Am Thankful', summary: "What are you thankful for? Let's thank God for it!" },
      ], questions: [
        { id: 'K-B-Q4-1', q: 'Before we eat, we thank ___', type: 'mc', options: ['God', 'the food', 'the table'], answer: 0 },
        { id: 'K-B-Q4-2', q: 'We say thank you for our ___', type: 'mc', options: ['family', 'garbage', 'nothing'], answer: 0 },
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
        { id: '1-M-Q1-2', q: 'There are 4 red and 3 blue blocks. How many total?', type: 'short', answer: '7' },
      ]},
      { name: 'Q2 — Place Value', lessons: [
        { title: 'Tens & Ones', summary: 'Lets make groups of ten! Grab some toys or snacks. Put ten in one pile and the rest in another pile. Count how many piles of ten you made!' },
        { title: 'Count to 100', summary: 'Lets count to 100 together! Start with 1, 2, 3 and keep going as high as you can. Count the steps as you walk around the house!' },
        { title: 'Compare Numbers', summary: 'Lets see which number is bigger! Look at 3 and 7. Which pile has more toys? Point to the bigger number and make a silly face!' },
      ], questions: [
        { id: '1-M-Q2-1', q: 'How many tens in 46?', type: 'mc', options: ['4', '6', '46'], answer: 0 },
        { id: '1-M-Q2-2', q: 'Is 32 < 45? (yes/no)', type: 'short', answer: 'yes' },
      ]},
      { name: 'Q3 — Measurement', lessons: [
        { title: 'Short & Long', summary: 'Lets find short and long things! Look at your pencil, then look at your bed. Which one is longer? Now find something short and something long in your room!' },
        { title: 'Tell Time (Hour)', summary: 'Look at the clock! The short hand tells us what hour it is. Can you point to the numbers on a clock and count from 1 to 12?' },
        { title: 'Count Money', summary: 'Lets count money together! Look at these coins and count them one by one. Find some pennies around the house and put them in a pile to count!' },
      ], questions: [
        { id: '1-M-Q3-1', q: 'What coin is worth 25 cents?', type: 'mc', options: ['penny', 'quarter', 'dime'], answer: 1 },
        { id: '1-M-Q3-2', q: 'When the little hand points to 3, it is ___ o’clock.', type: 'short', answer: '3' },
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
        { id: '1-SP-Q1-1', q: 'Spell: c-a-t', type: 'short', answer: 'cat' },
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
        { id: '1-SP-Q4-1', q: 'Write the word: "make".', type: 'short', answer: 'make' },
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
