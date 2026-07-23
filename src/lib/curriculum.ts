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
    { name: 'Mathematics', units: [
      { name: 'Q1 — Counting & Shapes', lessons: [
        { title: 'Counting 1 to 10', summary: 'Recognize, say, and write numbers 1-10 using objects.', weekTest: [
          { id: 'K-M-W1-1', q: 'What number comes after 3?', type: 'mc', options: ['2', '4', '5'], answer: 1 },
          { id: 'K-M-W1-2', q: 'Count the number of fingers on one hand. Write the number.', type: 'short', answer: '5' },
        ] },
        { title: 'Basic Shapes', summary: 'Identify circle, square, triangle, rectangle in the world.', weekTest: [
          { id: 'K-M-W2-1', q: 'Which shape has 4 equal sides?', type: 'mc', options: ['circle', 'square', 'triangle'], answer: 1 },
          { id: 'K-M-W2-2', q: 'A pizza slice looks most like which shape?', type: 'mc', options: ['square', 'triangle', 'circle'], answer: 1 },
        ] },
        { title: 'More or Less', summary: 'Compare small groups and decide which has more.', weekTest: [
          { id: 'K-M-W3-1', q: 'Which is more: 2 cookies or 6 cookies?', type: 'mc', options: ['2', '6', 'they are the same'], answer: 1 },
          { id: 'K-M-W3-2', q: 'Draw 4 stars. Draw 2 circles. Which group has less?', type: 'activity' },
        ] },
      ], questions: [
        { id: 'K-M-Q1-1', q: 'How many sides does a triangle have?', type: 'mc', options: ['2', '3', '4', '5'], answer: 1 },
        { id: 'K-M-Q1-2', q: 'Which group has more: 3 apples or 5 apples?', type: 'mc', options: ['3 apples', '5 apples', 'they are equal'], answer: 1 },
      ], unitTest: [
        { id: 'K-M-Q1-U1', q: 'Count the sides: a square has ___ sides.', type: 'mc', options: ['2', '3', '4', '5'], answer: 2 },
        { id: 'K-M-Q1-U2', q: 'Which number comes right after 7?', type: 'mc', options: ['6', '7', '8', '9'], answer: 2 },
        { id: 'K-M-Q1-U3', q: 'A circle has how many sides?', type: 'mc', options: ['0', '1', '2', '3'], answer: 0 },
        { id: 'K-M-Q1-U4', q: 'Draw a square and a triangle. Color the shape with 3 sides.', type: 'activity' },
        { id: 'K-M-Q1-U5', q: 'Count from 1 to 10 out loud. Write the number 6.', type: 'short', answer: '6' },
      ]},
      { name: 'Q2 — Numbers to 20', lessons: [
        { title: 'Counting 11-20', summary: 'Extend counting and recognize teen numbers.' },
        { title: 'Writing Numerals', summary: 'Practice forming each numeral correctly.' },
        { title: 'One More, One Less', summary: 'Find the number just before and after.' },
      ], questions: [
        { id: 'K-M-Q2-1', q: 'What comes after 14?', type: 'mc', options: ['13', '15', '16', '4'], answer: 1 },
        { id: 'K-M-Q2-2', q: 'Write the number that is one less than 9.', type: 'short', answer: '8' },
      ]},
      { name: 'Q3 — Sorting & Patterns', lessons: [
        { title: 'Sort by Color & Size', summary: 'Group objects by attributes.' },
        { title: 'Make a Pattern', summary: 'Create and extend AB patterns (red, blue, red, blue).' },
        { title: 'Position Words', summary: 'Use above, below, next to, behind.' },
      ], questions: [
        { id: 'K-M-Q3-1', q: 'Continue the pattern: circle, square, circle, ___', type: 'mc', options: ['circle', 'square', 'triangle'], answer: 1 },
        { id: 'K-M-Q3-2', q: 'Which word means "on top of"?', type: 'mc', options: ['above', 'below', 'next to'], answer: 0 },
      ]},
      { name: 'Q4 — Easy Addition', lessons: [
        { title: 'Adding With Objects', summary: 'Join two small groups and count the total.' },
        { title: 'Plus One', summary: 'Know that +1 makes the next number.' },
        { title: 'Math All Around Us', summary: 'Find addition in daily life (snacks, toys).' },
      ], questions: [
        { id: 'K-M-Q4-1', q: 'If you have 2 blocks and get 1 more, how many now?', type: 'mc', options: ['2', '3', '4'], answer: 1 },
        { id: 'K-M-Q4-2', q: 'Show 1 + 1 = 2 with a drawing.', type: 'activity' },
      ]},
    ]},
    { name: 'Language Arts', units: [
      { name: 'Q1 — Letters & Sounds', lessons: [
        { title: 'Alphabet Song & Order', summary: 'Recite and recognize all 26 letters.' },
        { title: 'Letter Sounds (A-M)', summary: 'Learn beginning sounds for first half of alphabet.' },
        { title: 'Letter Sounds (N-Z)', summary: 'Learn beginning sounds for second half.' },
      ], questions: [
        { id: 'K-L-Q1-1', q: 'Which letter makes the "buh" sound?', type: 'mc', options: ['A', 'B', 'C'], answer: 1 },
        { id: 'K-L-Q1-2', q: 'What is the first letter of the alphabet?', type: 'short', answer: 'A' },
      ]},
      { name: 'Q2 — Rhyming & Print', lessons: [
        { title: 'Find the Rhyme', summary: 'Match words that sound alike (cat/hat).' },
        { title: 'Hold a Book', summary: 'Know front/back, left-to-right, top-to-bottom.' },
        { title: 'Sight Words (I, see, the)', summary: 'Recognize the first high-frequency words.' },
      ], questions: [
        { id: 'K-L-Q2-1', q: 'Which word rhymes with "hat"?', type: 'mc', options: ['cat', 'dog', 'sun'], answer: 0 },
        { id: 'K-L-Q2-2', q: 'We read words from ___ to right.', type: 'mc', options: ['bottom', 'left', 'back'], answer: 1 },
      ]},
      { name: 'Q3 — Name Writing', lessons: [
        { title: 'Write Your Name', summary: 'Form capital and lowercase letters of own name.' },
        { title: 'Trace & Copy', summary: 'Trace simple words and copy them.' },
        { title: 'Listening to Stories', summary: 'Retell a simple story in order.' },
      ], questions: [
        { id: 'K-L-Q3-1', q: 'Which is a capital letter?', type: 'mc', options: ['a', 'A', 'b'], answer: 1 },
        { id: 'K-L-Q3-2', q: 'Tell one thing that happened in a story you heard.', type: 'short', answer: 'open' },
      ]},
      { name: 'Q4 — Early Writing', lessons: [
        { title: 'Draw & Label', summary: 'Draw a picture and try to label it.' },
        { title: 'Sentence Starters', summary: 'Complete "I like ___" with a word.' },
        { title: 'Share a Story', summary: 'Dictate a sentence about a picture.' },
      ], questions: [
        { id: 'K-L-Q4-1', q: 'A sentence begins with a capital ___', type: 'mc', options: ['letter', 'period', 'number'], answer: 0 },
        { id: 'K-L-Q4-2', q: 'Finish: I like to ___ (write one word).', type: 'short', answer: 'open' },
      ]},
    ]},
    { name: 'Spelling & Word Origins', units: [
      { name: 'Q1 — First Words', lessons: [
        { title: 'Words I Know', summary: 'Spell own name and 5 family words.' },
        { title: 'CVC Words', summary: 'cat, hat, pin, top, sun — sound and spell.' },
        { title: 'Where Words Come From', summary: 'Intro: some words are very old (light touch).' },
      ], questions: [
        { id: 'K-SP-Q1-1', q: 'Spell the word: c-a-t. What is it?', type: 'mc', options: ['cat', 'cap', 'car'], answer: 0 },
        { id: 'K-SP-Q1-2', q: 'Write the first letter of your name.', type: 'short', answer: 'open' },
      ]},
      { name: 'Q2 — Sight Words', lessons: [
        { title: 'List 1', summary: 'I, see, the, a, to — spell and read.' },
        { title: 'List 2', summary: 'and, you, we, can, go.' },
        { title: 'Word Stories', summary: 'Learn that "dog" is an old word for the animal.' },
      ], questions: [
        { id: 'K-SP-Q2-1', q: 'Which is spelled correctly?', type: 'mc', options: ['teh', 'the', 'het'], answer: 1 },
        { id: 'K-SP-Q2-2', q: 'Write the word: "see".', type: 'short', answer: 'see' },
      ]},
      { name: 'Q3 — Word Families', lessons: [
        { title: '-at Family', summary: 'cat, hat, bat, mat, sat.' },
        { title: '-og Family', summary: 'dog, log, fog, hog.' },
        { title: 'Root Fun', summary: 'Words in a family share a sound — like a family shares a name.' },
      ], questions: [
        { id: 'K-SP-Q3-1', q: 'Which word is in the -at family?', type: 'mc', options: ['bat', 'big', 'sun'], answer: 0 },
        { id: 'K-SP-Q3-2', q: 'Write a word that rhymes with "log".', type: 'short', answer: 'open' },
      ]},
      { name: 'Q4 — Review & Pride', lessons: [
        { title: 'My Spelling Book', summary: 'Collect the year’s words into a book.' },
        { title: 'Word Origins Recap', summary: 'Some words are hundreds of years old.' },
        { title: 'Show & Tell', summary: 'Spell 10 learned words aloud.' },
      ], questions: [
        { id: 'K-SP-Q4-1', q: 'A word family shares the same ___ sound.', type: 'mc', options: ['ending', 'first', 'color'], answer: 0 },
        { id: 'K-SP-Q4-2', q: 'Write one word you learned this year.', type: 'short', answer: 'open' },
      ]},
    ]},
    { name: 'Science', units: [
      { name: 'Q1 — God Made the World', lessons: [
        { title: 'Day & Night', summary: 'Observe the sun, moon, and sky.' },
        { title: 'The Seasons', summary: 'Name the four seasons and their weather.' },
        { title: 'Weather Watch', summary: 'Describe sunny, rainy, cloudy, snowy.' },
      ], questions: [
        { id: 'K-SC-Q1-1', q: 'Which is NOT a season?', type: 'mc', options: ['spring', 'summer', 'Tuesday'], answer: 2 },
        { id: 'K-SC-Q1-2', q: 'The sun gives us ___', type: 'mc', options: ['light', 'rain', 'wind'], answer: 0 },
      ]},
      { name: 'Q2 — Plants & Animals', lessons: [
        { title: 'Parts of a Plant', summary: 'Name roots, stem, leaf, flower.' },
        { title: 'Living vs Nonliving', summary: 'Sort things that grow from things that do not.' },
        { title: 'Farm Animals', summary: 'Match animals to the sounds they make.' },
      ], questions: [
        { id: 'K-SC-Q2-1', q: 'Which is a living thing?', type: 'mc', options: ['rock', 'dog', 'cup'], answer: 1 },
        { id: 'K-SC-Q2-2', q: 'A plant drinks water through its ___', type: 'mc', options: ['leaves', 'roots', 'flower'], answer: 1 },
      ]},
      { name: 'Q3 — My Body', lessons: [
        { title: 'Five Senses', summary: 'Name see, hear, smell, taste, touch.' },
        { title: 'Healthy Habits', summary: 'Wash hands, eat good food, sleep.' },
        { title: 'Body Parts', summary: 'Name eyes, ears, hands, feet.' },
      ], questions: [
        { id: 'K-SC-Q3-1', q: 'Which sense do we use to smell a flower?', type: 'mc', options: ['sight', 'smell', 'touch'], answer: 1 },
        { id: 'K-SC-Q3-2', q: 'Name one way to stay healthy.', type: 'short', answer: 'open' },
      ]},
      { name: 'Q4 — Motion & Matter', lessons: [
        { title: 'Push & Pull', summary: 'Move objects by pushing and pulling.' },
        { title: 'Float or Sink', summary: 'Test objects in water.' },
        { title: 'Solids & Liquids', summary: 'Sort by shape and flow.' },
      ], questions: [
        { id: 'K-SC-Q4-1', q: 'To open a door you ___ it.', type: 'mc', options: ['push or pull', 'eat', 'sing'], answer: 0 },
        { id: 'K-SC-Q4-2', q: 'Water is a ___', type: 'mc', options: ['solid', 'liquid', 'gas'], answer: 1 },
      ]},
    ]},
    { name: 'History & Geography', units: [
      { name: 'Q1 — My Family', lessons: [
        { title: 'People in My Home', summary: 'Name family members and their roles.' },
        { title: 'Past & Present', summary: 'Compare now with when parents were little.' },
        { title: 'Family Stories', summary: 'Hear and retell a family story.' },
      ], questions: [
        { id: 'K-H-Q1-1', q: 'Who helps take care of you at home?', type: 'short', answer: 'open' },
        { id: 'K-H-Q1-2', q: 'A story from long ago is called the ___', type: 'mc', options: ['past', 'future', 'present'], answer: 0 },
      ]},
      { name: 'Q2 — Our Community', lessons: [
        { title: 'Helpers Around Us', summary: 'Meet police, fire, doctor, teacher.' },
        { title: 'Places in Town', summary: 'Name library, store, church, park.' },
        { title: 'Being a Good Neighbor', summary: 'Share and help others.' },
      ], questions: [
        { id: 'K-H-Q2-1', q: 'Who puts out fires?', type: 'mc', options: ['firefighter', 'baker', 'teacher'], answer: 0 },
        { id: 'K-H-Q2-2', q: 'A good neighbor ___', type: 'mc', options: ['shares', 'hides', 'yells'], answer: 0 },
      ]},
      { name: 'Q3 — Maps & Globe', lessons: [
        { title: 'The Big Round World', summary: 'Understand Earth is a ball (globe).' },
        { title: 'Map Symbols', summary: 'Match pictures to real places.' },
        { title: 'Where I Live', summary: 'State country, state, town.' },
      ], questions: [
        { id: 'K-H-Q3-1', q: 'Earth is shaped like a ___', type: 'mc', options: ['box', 'ball', 'flat plate'], answer: 1 },
        { id: 'K-H-Q3-2', q: 'We live in the country called ___', type: 'short', answer: 'open' },
      ]},
      { name: 'Q4 — Holidays & Heroes', lessons: [
        { title: 'American Holidays', summary: 'Learn Thanksgiving, July 4th, Memorial Day.' },
        { title: 'Brave People', summary: 'Hear of kind, brave helpers in history.' },
        { title: 'Thankfulness', summary: 'Name things to be grateful for.' },
      ], questions: [
        { id: 'K-H-Q4-1', q: 'On Thanksgiving we ___', type: 'mc', options: ['give thanks', 'trick-or-treat', 'sing carols'], answer: 0 },
        { id: 'K-H-Q4-2', q: 'Name one holiday we celebrate.', type: 'short', answer: 'open' },
      ]},
    ]},
    { name: 'Bible & Character', units: [
      { name: 'Q1 — God Made Me', lessons: [
        { title: 'I Am Special', summary: 'Understand God made each child on purpose.' },
        { title: 'Creation Week', summary: 'Hear the 7 days of creation.' },
        { title: 'Thank You, God', summary: 'Pray a simple prayer of thanks.' },
      ], questions: [
        { id: 'K-B-Q1-1', q: 'Who made you?', type: 'mc', options: ['God', 'a robot', 'no one'], answer: 0 },
        { id: 'K-B-Q1-2', q: 'On what day did God rest?', type: 'mc', options: ['the 1st', 'the 7th', 'never'], answer: 1 },
      ]},
      { name: 'Q2 — Jesus Loves Me', lessons: [
        { title: 'Baby Jesus', summary: 'Hear the Christmas story.' },
        { title: 'Jesus the Helper', summary: 'Learn of Jesus healing and helping.' },
        { title: 'My Friend Jesus', summary: 'Know we can talk to Jesus.' },
      ], questions: [
        { id: 'K-B-Q2-1', q: 'Where was baby Jesus born?', type: 'mc', options: ['a barn', 'a castle', 'a school'], answer: 0 },
        { id: 'K-B-Q2-2', q: 'Jesus is our ___', type: 'mc', options: ['friend', 'enemy', 'stranger'], answer: 0 },
      ]},
      { name: 'Q3 — Being Kind', lessons: [
        { title: 'Share Your Toys', summary: 'Practice sharing with friends.' },
        { title: 'Use Kind Words', summary: 'Speak gently, no hitting.' },
        { title: 'Obey Quickly', summary: 'Listen and obey parents.' },
      ], questions: [
        { id: 'K-B-Q3-1', q: 'When Mom says "no", we should ___', type: 'mc', options: ['obey', 'yell', 'hit'], answer: 0 },
        { id: 'K-B-Q3-2', q: 'Kind words make others feel ___', type: 'mc', options: ['happy', 'sad', 'angry'], answer: 0 },
      ]},
      { name: 'Q4 — Thankful Hearts', lessons: [
        { title: 'Count Your Blessings', summary: 'Name gifts from God.' },
        { title: 'Say Please & Thank You', summary: 'Use good manners.' },
        { title: 'Sing to God', summary: 'Learn a simple worship song.' },
      ], questions: [
        { id: 'K-B-Q4-1', q: 'We say "___" when given something.', type: 'mc', options: ['thank you', 'mine', 'no'], answer: 0 },
        { id: 'K-B-Q4-2', q: 'Name one thing God gave you.', type: 'short', answer: 'open' },
      ]},
    ]},
  ])

// ====================== 1ST GRADE ======================
export const G1: GradeCurriculum = g('1st Grade', 1, '6-7', 'Building skill and confidence in every subject.',
  [
    { name: 'Mathematics', units: [
      { name: 'Q1 — Addition & Subtraction', lessons: [
        { title: 'Facts to 10', summary: 'Master addition and subtraction within 10.' },
        { title: 'Word Problems', summary: 'Solve simple "how many in all / left" stories.' },
        { title: 'Fact Families', summary: 'See how 3+2 and 5-2 relate.' },
      ], questions: [
        { id: '1-M-Q1-1', q: '7 - 3 = ?', type: 'mc', options: ['3', '4', '10'], answer: 1 },
        { id: '1-M-Q1-2', q: 'There are 4 red and 3 blue blocks. How many total?', type: 'short', answer: '7' },
      ]},
      { name: 'Q2 — Place Value', lessons: [
        { title: 'Tens & Ones', summary: 'Understand 2-digit numbers as tens + ones.' },
        { title: 'Count to 100', summary: 'Count by 1s and 10s.' },
        { title: 'Compare Numbers', summary: 'Use <, >, = with 2-digit numbers.' },
      ], questions: [
        { id: '1-M-Q2-1', q: 'How many tens in 46?', type: 'mc', options: ['4', '6', '46'], answer: 0 },
        { id: '1-M-Q2-2', q: 'Is 32 < 45? (yes/no)', type: 'short', answer: 'yes' },
      ]},
      { name: 'Q3 — Measurement', lessons: [
        { title: 'Short & Long', summary: 'Compare length with non-standard units.' },
        { title: 'Tell Time (Hour)', summary: 'Read analog clock to the hour.' },
        { title: 'Count Money', summary: 'Identify penny, nickel, dime, quarter.' },
      ], questions: [
        { id: '1-M-Q3-1', q: 'What coin is worth 25 cents?', type: 'mc', options: ['penny', 'quarter', 'dime'], answer: 1 },
        { id: '1-M-Q3-2', q: 'When the little hand points to 3, it is ___ o’clock.', type: 'short', answer: '3' },
      ]},
      { name: 'Q4 — Geometry & Graphs', lessons: [
        { title: '2D & 3D Shapes', summary: 'Name and sort flat and solid shapes.' },
        { title: 'Picture Graphs', summary: 'Read a simple bar/picture graph.' },
        { title: 'Fractions: Half', summary: 'Understand one half of a shape or set.' },
      ], questions: [
        { id: '1-M-Q4-1', q: 'A rectangle has how many corners?', type: 'mc', options: ['3', '4', '5'], answer: 1 },
        { id: '1-M-Q4-2', q: 'Cut a sandwich in 2 equal parts = ___', type: 'mc', options: ['halves', 'thirds', 'quarters'], answer: 0 },
      ]},
    ]},
    { name: 'Language Arts', units: [
      { name: 'Q1 — Phonics', lessons: [
        { title: 'Short Vowels', summary: 'Read CVC words (cat, hit, hop).' },
        { title: 'Blends', summary: 'Sound out st, bl, tr, cr.' },
        { title: 'Sight Words List 1', summary: 'Read the, and, you, said, was.' },
      ], questions: [
        { id: '1-L-Q1-1', q: 'Which is a CVC word?', type: 'mc', options: ['tree', 'cat', 'boat'], answer: 1 },
        { id: '1-L-Q1-2', q: 'The word "cat" starts with the sound ___', type: 'mc', options: ['/k/', '/s/', '/m/'], answer: 0 },
      ]},
      { name: 'Q2 — Reading', lessons: [
        { title: 'Read Simple Books', summary: 'Read short decodable stories fluently.' },
        { title: 'Story Order', summary: 'Put events beginning, middle, end.' },
        { title: 'Main Character', summary: 'Name who a story is about.' },
      ], questions: [
        { id: '1-L-Q2-1', q: 'The people or animals in a story are the ___', type: 'mc', options: ['characters', 'weather', 'title'], answer: 0 },
        { id: '1-L-Q2-2', q: 'What happens first in a story?', type: 'mc', options: ['the beginning', 'the end', 'the middle'], answer: 0 },
      ]},
      { name: 'Q3 — Writing', lessons: [
        { title: 'Write a Sentence', summary: 'Capital letter, spaces, period.' },
        { title: 'Stretch a Word', summary: 'Sound out and spell simple words.' },
        { title: 'My Opinion', summary: 'Write "I like ___ because ___."' },
      ], questions: [
        { id: '1-L-Q3-1', q: 'A sentence ends with a ___', type: 'mc', options: ['comma', 'period', 'space'], answer: 1 },
        { id: '1-L-Q3-2', q: 'Write one sentence about your favorite food.', type: 'short', answer: 'open' },
      ]},
      { name: 'Q4 — Grammar', lessons: [
        { title: 'Nouns', summary: 'Person, place, thing.' },
        { title: 'Verbs', summary: 'Action words.' },
        { title: 'Capitalization', summary: 'Capitalize I, names, first word.' },
      ], questions: [
        { id: '1-L-Q4-1', q: 'Which is a verb?', type: 'mc', options: ['run', 'red', 'book'], answer: 0 },
        { id: '1-L-Q4-2', q: 'We always capitalize the word ___', type: 'mc', options: ['the', 'I', 'and'], answer: 1 },
      ]},
    ]},
    { name: 'Spelling & Word Origins', units: [
      { name: 'Q1 — Short Vowel Words', lessons: [
        { title: 'List 1: -at/-an', summary: 'cat, hat, bat, fan, man, can.' },
        { title: 'List 2: -ig/-og', summary: 'big, dig, pig, log, fog, dog.' },
        { title: 'Origin: "dog"', summary: 'Dog comes from an old English word "docga" — a friendly name for the animal.' },
      ], questions: [
        { id: '1-SP-Q1-1', q: 'Spell: c-a-t', type: 'short', answer: 'cat' },
        { id: '1-SP-Q1-2', q: '"dog" comes from an old word meaning ___', type: 'mc', options: ['a friendly animal', 'a toy', 'a food'], answer: 0 },
      ]},
      { name: 'Q2 — Long Vowels', lessons: [
        { title: 'List 3: -ake/-ite', summary: 'cake, bake, make, kite, bite, white.' },
        { title: 'List 4: -oat/-ain', summary: 'boat, coat, goat, rain, pain, main.' },
        { title: 'Origin: "cake"', summary: 'Cake traces to old Norse "kaka" — a small baked thing.' },
      ], questions: [
        { id: '1-SP-Q2-1', q: 'Which uses a long a sound?', type: 'mc', options: ['cap', 'cake', 'cat'], answer: 1 },
        { id: '1-SP-Q2-2', q: 'Write a word that rhymes with "boat".', type: 'short', answer: 'open' },
      ]},
      { name: 'Q3 — Blends & Digraphs', lessons: [
        { title: 'List 5: st-/bl-', summary: 'stop, step, blue, black, block.' },
        { title: 'List 6: sh-/ch-', summary: 'ship, shop, chip, chop, chat.' },
        { title: 'Origin: "ship"', summary: 'Ship is one of the oldest words in English, over 1,000 years old.' },
      ], questions: [
        { id: '1-SP-Q3-1', q: 'Which starts with "sh"?', type: 'mc', options: ['shop', 'stop', 'block'], answer: 0 },
        { id: '1-SP-Q3-2', q: 'Write a word that starts with "bl".', type: 'short', answer: 'open' },
      ]},
      { name: 'Q4 — Review', lessons: [
        { title: 'Master List', summary: 'Spell all 24 year words from memory.' },
        { title: 'Word Stories Recap', summary: 'dog, cake, ship — words with long histories.' },
        { title: 'Dictation', summary: 'Teacher reads, student spells aloud.' },
      ], questions: [
        { id: '1-SP-Q4-1', q: 'Write the word: "make".', type: 'short', answer: 'make' },
        { id: '1-SP-Q4-2', q: 'A word’s "origin" is ___', type: 'mc', options: ['where it came from', 'how it sounds', 'its color'], answer: 0 },
      ]},
    ]},
    { name: 'Science', units: [
      { name: 'Q1 — Animals', lessons: [
        { title: 'Mammals & Birds', summary: 'Sort by body covering and babies.' },
        { title: 'Insects', summary: 'Name parts and life cycle.' },
        { title: 'Habitats', summary: 'Forest, desert, ocean homes.' },
      ], questions: [
        { id: '1-SC-Q1-1', q: 'A fish breathes with ___', type: 'mc', options: ['gills', 'lungs', 'skin'], answer: 0 },
        { id: '1-SC-Q1-2', q: 'Bears live in the ___', type: 'mc', options: ['ocean', 'forest', 'sky'], answer: 1 },
      ]},
      { name: 'Q2 — Plants Grow', lessons: [
        { title: 'What Plants Need', summary: 'Sun, water, soil, air.' },
        { title: 'Life Cycle', summary: 'Seed to plant to flower.' },
        { title: 'Trees', summary: 'Deciduous vs evergreen.' },
      ], questions: [
        { id: '1-SC-Q2-1', q: 'Plants need ___ to make food.', type: 'mc', options: ['sunlight', 'candy', 'music'], answer: 0 },
        { id: '1-SC-Q2-2', q: 'A tiny plant starts as a ___', type: 'mc', options: ['seed', 'rock', 'cloud'], answer: 0 },
      ]},
      { name: 'Q3 — Weather & Sky', lessons: [
        { title: 'Clouds & Rain', summary: 'Water cycle in simple terms.' },
        { title: 'Stars & Moon', summary: 'Night sky observations.' },
        { title: 'Seasons Change', summary: 'How each season differs.' },
      ], questions: [
        { id: '1-SC-Q3-1', q: 'Rain comes from ___', type: 'mc', options: ['clouds', 'the ground', 'the sun'], answer: 0 },
        { id: '1-SC-Q3-2', q: 'The moon shines at ___', type: 'mc', options: ['night', 'noon', 'breakfast'], answer: 0 },
      ]},
      { name: 'Q4 — Matter', lessons: [
        { title: '3 States', summary: 'Solid, liquid, gas examples.' },
        { title: 'Change It', summary: 'Melt, freeze, mix.' },
        { title: 'Recycle', summary: 'Sort paper, plastic, metal.' },
      ], questions: [
        { id: '1-SC-Q4-1', q: 'Ice is a ___', type: 'mc', options: ['solid', 'liquid', 'gas'], answer: 0 },
        { id: '1-SC-Q4-2', q: 'We recycle to help ___', type: 'mc', options: ['the earth', 'the moon', 'space'], answer: 0 },
      ]},
    ]},
    { name: 'History & Geography', units: [
      { name: 'Q1 — Communities', lessons: [
        { title: 'Rural, Urban, Suburban', summary: 'Compare where people live.' },
        { title: 'Community Jobs', summary: 'Goods and services.' },
        { title: 'Earning & Spending', summary: 'Basic needs vs wants.' },
      ], questions: [
        { id: '1-H-Q1-1', q: 'A farmer works in a ___ community.', type: 'mc', options: ['rural', 'city', 'subway'], answer: 0 },
        { id: '1-H-Q1-2', q: 'Something you NEED is ___', type: 'mc', options: ['food', 'toy', 'candy'], answer: 0 },
      ]},
      { name: 'Q2 — Maps', lessons: [
        { title: 'Map Parts', summary: 'Title, key, compass rose.' },
        { title: 'My State', summary: 'Locate Alabama on a map.' },
        { title: 'Continents', summary: 'Name the 7 continents.' },
      ], questions: [
        { id: '1-H-Q2-1', q: 'A map key tells you what ___ mean.', type: 'mc', options: ['symbols', 'clouds', 'stars'], answer: 0 },
        { id: '1-H-Q2-2', q: 'We live on the continent of ___', type: 'mc', options: ['Asia', 'North America', 'Antarctica'], answer: 1 },
      ]},
      { name: 'Q3 — Past to Present', lessons: [
        { title: 'Long Ago', summary: 'Olden days vs today (toys, school).' },
        { title: 'Famous Americans', summary: 'Intro to a few heroes.' },
        { title: 'Timelines', summary: 'Put 3 events in order.' },
      ], questions: [
        { id: '1-H-Q3-1', q: 'A timeline shows events in ___', type: 'mc', options: ['order', 'color', 'size'], answer: 0 },
        { id: '1-H-Q3-2', q: 'People long ago did not have ___', type: 'mc', options: ['computers', 'families', 'food'], answer: 0 },
      ]},
      { name: 'Q4 — America', lessons: [
        { title: 'The Flag', summary: 'Colors and meaning of stars/stripes.' },
        { title: 'Pledge & Anthem', summary: 'Learn respect for national symbols.' },
        { title: 'Good Citizens', summary: 'Rights and responsibilities.' },
      ], questions: [
        { id: '1-H-Q4-1', q: 'The American flag has ___ colors.', type: 'mc', options: ['2', '3', '4'], answer: 1 },
        { id: '1-H-Q4-2', q: 'A good citizen ___', type: 'mc', options: ['follows rules', 'breaks rules', 'ignores others'], answer: 0 },
      ]},
    ]},
    { name: 'Bible & Character', units: [
      { name: 'Q1 — Noah & Friends', lessons: [
        { title: 'Noah’s Ark', summary: 'God kept Noah safe.' },
        { title: 'Abraham', summary: 'God’s promise to a friend.' },
        { title: 'Trusting God', summary: 'God cares for us.' },
      ], questions: [
        { id: '1-B-Q1-1', q: 'Noah built a big ___', type: 'mc', options: ['ark', 'house', 'boat', 'tower'], answer: 0 },
        { id: '1-B-Q1-2', q: 'God always ___ us.', type: 'mc', options: ['cares for', 'forgets', 'ignores'], answer: 0 },
      ]},
      { name: 'Q2 — Jesus’ Life', lessons: [
        { title: 'Jesus Is Born', summary: 'The Christmas story.' },
        { title: 'Miracles', summary: 'Jesus healed sick people.' },
        { title: 'The Lost Sheep', summary: 'Jesus looks for each one.' },
      ], questions: [
        { id: '1-B-Q2-1', q: 'Jesus was born in a ___', type: 'mc', options: ['barn', 'palace', 'tent'], answer: 0 },
        { id: '1-B-Q2-2', q: 'The lost sheep was ___ by Jesus.', type: 'mc', options: ['found', 'forgotten', 'lost'], answer: 0 },
      ]},
      { name: 'Q3 — Fruits of the Spirit', lessons: [
        { title: 'Love & Joy', summary: 'Show love to family.' },
        { title: 'Peace & Patience', summary: 'Wait without fussing.' },
        { title: 'Kindness', summary: 'Help someone small.' },
      ], questions: [
        { id: '1-B-Q3-1', q: 'The Bible says the fruit of the Spirit is love, joy, ___', type: 'mc', options: ['peace', 'anger', 'fear'], answer: 0 },
        { id: '1-B-Q3-2', q: 'Kindness means we ___ others.', type: 'mc', options: ['help', 'hurt', 'push'], answer: 0 },
      ]},
      { name: 'Q4 — Thankfulness', lessons: [
        { title: 'Giving Thanks', summary: 'Psalm 100 — shout for joy.' },
        { title: 'Serving Others', summary: 'Help at home and church.' },
        { title: 'My Church', summary: 'What we do on Sunday.' },
      ], questions: [
        { id: '1-B-Q4-1', q: 'We give thanks to ___', type: 'mc', options: ['God', 'no one', 'TV'], answer: 0 },
        { id: '1-B-Q4-2', q: 'Name one way you can help at home.', type: 'short', answer: 'open' },
      ]},
    ]},
  ])

export const CURRICULUM_PART1: GradeCurriculum[] = [K, G1]
