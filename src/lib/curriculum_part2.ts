// Larose Christian Academy — ORIGINAL Curriculum, Grades 2-6 (part 2 of 3)
// Same structure as part 1: 6 subjects, 4 quarters, lessons + 2 questions each unit.
// Spelling & Word Origins = one class. Etymology from grade 3 up is explicit.

import type { GradeCurriculum } from './curriculum'

const g = (
  grade: string,
  gradeNum: number,
  age: string,
  tagline: string,
  subjects: any
): GradeCurriculum => ({ grade, gradeNum, age, tagline, subjects })

// ====================== 2ND GRADE ======================
export const G2: GradeCurriculum = g('2nd Grade', 2, '7-8', 'Independent reading, real arithmetic, God’s world.',
  [
    { name: 'Mathematics', units: [
      { name: 'Q1 — Add & Subtract to 100', lessons: [
        { title: 'Two-Digit Facts', summary: 'Add/subtract within 100 with regrouping.' },
        { title: 'Word Problems', summary: 'Multi-step stories with key words.' },
        { title: 'Even & Odd', summary: 'Recognize pairs and leftovers.' },
      ], questions: [
        { id: '2-M-Q1-1', q: '23 + 14 = ?', type: 'mc', options: ['37', '38', '36'], answer: 0 },
        { id: '2-M-Q1-2', q: 'Is 8 even or odd?', type: 'short', answer: 'even' },
      ]},
      { name: 'Q2 — Place Value & Money', lessons: [
        { title: 'Hundreds', summary: 'Read 3-digit numbers; value of each digit.' },
        { title: 'Count Bills', summary: 'Ones, fives, tens, twenties.' },
        { title: 'Make Change', summary: 'Simple change from a dollar.' },
      ], questions: [
        { id: '2-M-Q2-1', q: 'Value of 5 in 352?', type: 'mc', options: ['5', '50', '500'], answer: 1 },
        { id: '2-M-Q2-2', q: 'How many quarters in $1?', type: 'short', answer: '4' },
      ]},
      { name: 'Q3 — Intro Multiplication', lessons: [
        { title: 'Equal Groups', summary: '3 groups of 4 = 12.' },
        { title: 'Times Tables 2,5,10', summary: 'Memorize the easy facts.' },
        { title: 'Arrays', summary: 'Rows and columns show multiplication.' },
      ], questions: [
        { id: '2-M-Q3-1', q: '3 × 4 = ?', type: 'mc', options: ['7', '12', '9'], answer: 1 },
        { id: '2-M-Q3-2', q: '5 × 10 = ?', type: 'short', answer: '50' },
      ]},
      { name: 'Q4 — Measurement & Fractions', lessons: [
        { title: 'Inches & Centimeters', summary: 'Measure with a ruler.' },
        { title: 'Tell Time (Half Hour)', summary: 'Read analog to the half hour.' },
        { title: 'Halves & Fourths', summary: 'Partition shapes and sets.' },
      ], questions: [
        { id: '2-M-Q4-1', q: 'How many halves make a whole?', type: 'mc', options: ['2', '3', '4'], answer: 0 },
        { id: '2-M-Q4-2', q: 'A clock showing 3:30 is ___', type: 'mc', options: ['half past three', 'quarter to three', 'three o’clock'], answer: 0 },
      ]},
    ]},
    { name: 'Language Arts', units: [
      { name: 'Q1 — Reading Fluency', lessons: [
        { title: 'Chapter Books', summary: 'Read short illustrated chapters.' },
        { title: 'Main Idea & Details', summary: 'Find the big point and support.' },
        { title: 'Sequencing', summary: 'First, next, last in a passage.' },
      ], questions: [
        { id: '2-L-Q1-1', q: 'The main idea is ___', type: 'mc', options: ['the most important point', 'the last word', 'a picture'], answer: 0 },
        { id: '2-L-Q1-2', q: 'What comes after "first"?', type: 'mc', options: ['last', 'next', 'never'], answer: 1 },
      ]},
      { name: 'Q2 — Grammar', lessons: [
        { title: 'Nouns & Pronouns', summary: 'he/she/it replace names.' },
        { title: 'Verbs (Past/Tense)', summary: '-ed for past; irregulars (went, ate).' },
        { title: 'Adjectives', summary: 'Words that describe.' },
      ], questions: [
        { id: '2-L-Q2-1', q: 'Which is a pronoun?', type: 'mc', options: ['she', 'run', 'red'], answer: 0 },
        { id: '2-L-Q2-2', q: 'Past of "walk" is ___', type: 'short', answer: 'walked' },
      ]},
      { name: 'Q3 — Writing', lessons: [
        { title: 'Paragraphs', summary: 'Topic sentence + details.' },
        { title: 'Narrative', summary: 'Write a small story with beginning/middle/end.' },
        { title: 'Friendly Letter', summary: 'Date, greeting, body, closing.' },
      ], questions: [
        { id: '2-L-Q3-1', q: 'A paragraph starts with a ___ sentence.', type: 'mc', options: ['topic', 'ending', 'question'], answer: 0 },
        { id: '2-L-Q3-2', q: 'Write a friendly letter greeting (e.g. Dear ___).', type: 'short', answer: 'open' },
      ]},
      { name: 'Q4 — Poetry & Drama', lessons: [
        { title: 'Rhyme & Rhythm', summary: 'Read and write simple poems.' },
        { title: 'Plays', summary: 'Read a short script with roles.' },
        { title: 'Book Report', summary: 'State title, author, favorite part.' },
      ], questions: [
        { id: '2-L-Q4-1', q: 'A poem often has ___', type: 'mc', options: ['rhyme', 'only facts', 'no lines'], answer: 0 },
        { id: '2-L-Q4-2', q: 'Name the author of a book you read.', type: 'short', answer: 'open' },
      ]},
    ]},
    { name: 'Spelling & Word Origins', units: [
      { name: 'Q1 — Long Vowel Patterns', lessons: [
        { title: 'List 1: -ight/-ain', summary: 'light, night, bright, rain, main, pain.' },
        { title: 'List 2: -oat/-eed', summary: 'boat, coat, goat, seed, need, feed.' },
        { title: 'Origin: "night"', summary: 'Night is from old English "niht" — one of the most ancient words.' },
      ], questions: [
        { id: '2-SP-Q1-1', q: 'Write a word that rhymes with "light".', type: 'short', answer: 'open' },
        { id: '2-SP-Q1-2', q: '"night" is an ___ word.', type: 'mc', options: ['old English', 'French', 'Spanish'], answer: 0 },
      ]},
      { name: 'Q2 — R-Controlled & Digraphs', lessons: [
        { title: 'List 3: -ar/-or', summary: 'car, star, far, for, nor, corn.' },
        { title: 'List 4: -th/-wh', summary: 'this, that, thin, when, what, white.' },
        { title: 'Origin: "star"', summary: 'Star comes from old English "steorra", tied to the word for "stiff/fixed".' },
      ], questions: [
        { id: '2-SP-Q2-1', q: 'Which has r-controlled sound?', type: 'mc', options: ['car', 'cat', 'cap'], answer: 0 },
        { id: '2-SP-Q2-2', q: 'Write a word that starts with "wh".', type: 'short', answer: 'open' },
      ]},
      { name: 'Q3 — Compound Words', lessons: [
        { title: 'List 5: sunlight, rainbow, bedroom', summary: 'Two small words make one big word.' },
        { title: 'List 6: football, notebook, sunlight', summary: 'More compounds.' },
        { title: 'Origin: "sun"', summary: 'Sun is from old English "sunne" — a word older than written history.' },
      ], questions: [
        { id: '2-SP-Q3-1', q: '"rainbow" is a ___ word.', type: 'mc', options: ['compound', 'short', 'foreign'], answer: 0 },
        { id: '2-SP-Q3-2', q: 'Write a compound word (two words joined).', type: 'short', answer: 'open' },
      ]},
      { name: 'Q4 — Review', lessons: [
        { title: 'Master List', summary: 'Spell all 24 year words.' },
        { title: 'Word Origins Recap', summary: 'night, star, sun — ancient roots.' },
        { title: 'Dictation', summary: 'Teacher reads, student spells.' },
      ], questions: [
        { id: '2-SP-Q4-1', q: 'Write the word: "bright".', type: 'short', answer: 'bright' },
        { id: '2-SP-Q4-2', q: 'A compound word is made of ___', type: 'mc', options: ['two words', 'one letter', 'numbers'], answer: 0 },
      ]},
    ]},
    { name: 'Science', units: [
      { name: 'Q1 — Habitats', lessons: [
        { title: 'Forest & Rainforest', summary: 'Layers and creatures.' },
        { title: 'Ocean & Desert', summary: 'Adaptations to water/heat.' },
        { title: 'Food Chains', summary: 'Producer → consumer → decomposer.' },
      ], questions: [
        { id: '2-SC-Q1-1', q: 'A plant is a ___ in a food chain.', type: 'mc', options: ['producer', 'consumer', 'decomposer'], answer: 0 },
        { id: '2-SC-Q1-2', q: 'Fish live in the ___ habitat.', type: 'mc', options: ['ocean', 'desert', 'forest floor'], answer: 0 },
      ]},
      { name: 'Q2 — Matter & Energy', lessons: [
        { title: 'Properties of Matter', summary: 'Color, texture, mass, volume.' },
        { title: 'Heat & Light', summary: 'Sources and uses.' },
        { title: 'Simple Machines', summary: 'Lever, wheel, pulley intro.' },
      ], questions: [
        { id: '2-SC-Q2-1', q: 'A lever helps us ___', type: 'mc', options: ['lift heavy things', 'sleep', 'eat'], answer: 0 },
        { id: '2-SC-Q2-2', q: 'The sun gives ___ and light.', type: 'short', answer: 'heat' },
      ]},
      { name: 'Q3 — Earth', lessons: [
        { title: 'Rocks & Soil', summary: 'Types of rocks, how soil forms.' },
        { title: 'Water Cycle', summary: 'Evaporate, condense, precipitate.' },
        { title: 'Weather Tools', summary: 'Thermometer, rain gauge.' },
      ], questions: [
        { id: '2-SC-Q3-1', q: 'Clouds make rain through ___', type: 'mc', options: ['condensation', 'evaporation', 'melting'], answer: 0 },
        { id: '2-SC-Q3-2', q: 'We measure temperature with a ___', type: 'short', answer: 'thermometer' },
      ]},
      { name: 'Q4 — Space', lessons: [
        { title: 'The Solar System', summary: 'Sun, 8 planets, moon.' },
        { title: 'Day & Night', summary: 'Earth spins on its axis.' },
        { title: 'Seasons', summary: 'Tilt of Earth’s axis.' },
      ], questions: [
        { id: '2-SC-Q4-1', q: 'How many planets orbit the sun?', type: 'mc', options: ['8', '9', '7'], answer: 0 },
        { id: '2-SC-Q4-2', q: 'Earth spins to make ___ and night.', type: 'short', answer: 'day' },
      ]},
    ]},
    { name: 'History & Geography', units: [
      { name: 'Q1 — Native Peoples', lessons: [
        { title: 'First Americans', summary: 'Diverse nations and homes.' },
        { title: 'Map Skills', summary: 'Latitude/longitude intro, scale.' },
        { title: 'Regions of US', summary: 'Northeast, South, Midwest, West.' },
      ], questions: [
        { id: '2-H-Q1-1', q: 'The ___ were the first people in America.', type: 'mc', options: ['Native Americans', 'Europeans', 'Asians'], answer: 0 },
        { id: '2-H-Q1-2', q: 'Alabama is in the ___ region.', type: 'mc', options: ['South', 'West', 'Northeast'], answer: 0 },
      ]},
      { name: 'Q2 — Explorers', lessons: [
        { title: 'Early Explorers', summary: 'Why they came, what they found.' },
        { title: 'Colonies', summary: 'First settlements.' },
        { title: 'Thanksgiving', summary: 'Two peoples sharing.' },
      ], questions: [
        { id: '2-H-Q2-1', q: 'Explorers came looking for ___', type: 'mc', options: ['new lands and trade', 'the moon', 'gold only'], answer: 0 },
        { id: '2-H-Q2-2', q: 'The first Thanksgiving was shared by two peoples: ___', type: 'mc', options: ['settlers and Native Americans', 'two armies', 'kings'], answer: 0 },
      ]},
      { name: 'Q3 — Government', lessons: [
        { title: 'Community to Country', summary: 'Levels of government.' },
        { title: 'Three Branches', summary: 'Executive, legislative, judicial (intro).' },
        { title: 'The Constitution', summary: 'Our rule book, brief.' },
      ], questions: [
        { id: '2-H-Q3-1', q: 'The President is part of the ___ branch.', type: 'mc', options: ['executive', 'judicial', 'legislative'], answer: 0 },
        { id: '2-H-Q3-2', q: 'Our country’s rule book is the ___', type: 'short', answer: 'Constitution' },
      ]},
      { name: 'Q4 — Alabama', lessons: [
        { title: 'Our State', summary: 'Capital (Montgomery), symbols.' },
        { title: 'State History', summary: 'Founding and key moments.' },
        { title: 'Good Citizens', summary: 'How we help our state.' },
      ], questions: [
        { id: '2-H-Q4-1', q: 'The capital of Alabama is ___', type: 'mc', options: ['Montgomery', 'Birmingham', 'Mobile'], answer: 0 },
        { id: '2-H-Q4-2', q: 'Name one way to be a good citizen.', type: 'short', answer: 'open' },
      ]},
    ]},
    { name: 'Bible & Character', units: [
      { name: 'Q1 — Old Testament Heroes', lessons: [
        { title: 'Moses', summary: 'God frees His people.' },
        { title: 'David', summary: 'A boy with a brave heart.' },
        { title: 'Esther', summary: 'Courage for her people.' },
      ], questions: [
        { id: '2-B-Q1-1', q: 'David beat Goliath with a ___', type: 'mc', options: ['sling', 'sword', 'shield'], answer: 0 },
        { id: '2-B-Q1-2', q: 'Esther showed ___ for her people.', type: 'mc', options: ['courage', 'fear', 'anger'], answer: 0 },
      ]},
      { name: 'Q2 — The Psalms', lessons: [
        { title: 'Psalm 23', summary: 'The Lord is my shepherd.' },
        { title: 'Praise Songs', summary: 'Sing to God.' },
        { title: 'Trust', summary: 'God is near in hard times.' },
      ], questions: [
        { id: '2-B-Q2-1', q: 'Psalm 23 says "The Lord is my ___".', type: 'mc', options: ['shepherd', 'king', 'teacher'], answer: 0 },
        { id: '2-B-Q2-2', q: 'We praise God by ___', type: 'mc', options: ['singing', 'hiding', 'yelling'], answer: 0 },
      ]},
      { name: 'Q3 — Jesus’ Teachings', lessons: [
        { title: 'The Good Samaritan', summary: 'Love your neighbor.' },
        { title: 'The Prodigal Son', summary: 'Forgiveness and welcome.' },
        { title: 'The Sermon on the Mount', summary: 'Beatrix of blessing.' },
      ], questions: [
        { id: '2-B-Q3-1', q: 'The Good Samaritan taught us to love our ___', type: 'mc', options: ['neighbor', 'enemy only', 'self'], answer: 0 },
        { id: '2-B-Q3-2', q: 'The father welcomed his son with ___', type: 'mc', options: ['forgiveness', 'anger', 'silence'], answer: 0 },
      ]},
      { name: 'Q4 — Character', lessons: [
        { title: 'Honesty', summary: 'Tell the truth always.' },
        { title: 'Forgiveness', summary: 'Let go like God does.' },
        { title: 'Service', summary: 'Help at church and home.' },
      ], questions: [
        { id: '2-B-Q4-1', q: 'Honesty means ___', type: 'mc', options: ['telling the truth', 'hiding facts', 'bragging'], answer: 0 },
        { id: '2-B-Q4-2', q: 'When someone says sorry, we ___', type: 'mc', options: ['forgive', 'stay mad', 'tell others'], answer: 0 },
      ]},
    ]},
  ])

// ====================== 3RD GRADE (etymology explicit) ======================
export const G3: GradeCurriculum = g('3rd Grade', 3, '8-9', 'Roots of words and numbers take hold.',
  [
    { name: 'Mathematics', units: [
      { name: 'Q1 — Multiplication Mastery', lessons: [
        { title: 'Tables 0-12', summary: 'Memorize all facts.' },
        { title: 'Word Problems', summary: 'Recognize "groups of", "each".' },
        { title: 'Division Intro', summary: 'Sharing equally; inverse of ×.' },
      ], questions: [
        { id: '3-M-Q1-1', q: '7 × 8 = ?', type: 'mc', options: ['54', '56', '49'], answer: 1 },
        { id: '3-M-Q1-2', q: '12 ÷ 3 = ?', type: 'short', answer: '4' },
      ]},
      { name: 'Q2 — Fractions', lessons: [
        { title: 'Numerator & Denominator', summary: 'Parts of a whole.' },
        { title: 'Equivalent Fractions', summary: '1/2 = 2/4 = 3/6.' },
        { title: 'Compare & Add', summary: 'Same denominator work.' },
      ], questions: [
        { id: '3-M-Q2-1', q: '1/2 + 1/4 = ?', type: 'mc', options: ['3/4', '2/6', '1'], answer: 0 },
        { id: '3-M-Q2-2', q: 'Which is bigger: 1/3 or 1/4?', type: 'mc', options: ['1/3', '1/4', 'equal'], answer: 0 },
      ]},
      { name: 'Q3 — Area & Perimeter', lessons: [
        { title: 'Perimeter', summary: 'Add all sides.' },
        { title: 'Area', summary: 'Count squares; length × width.' },
        { title: 'Word Problems', summary: 'Real fence/garden tasks.' },
      ], questions: [
        { id: '3-M-Q3-1', q: 'Perimeter of 3×5 rectangle?', type: 'mc', options: ['16', '15', '8'], answer: 0 },
        { id: '3-M-Q3-2', q: 'Area of 3×5 rectangle?', type: 'short', answer: '15' },
      ]},
      { name: 'Q4 — Graphs & Time', lessons: [
        { title: 'Bar & Pictographs', summary: 'Read and make.' },
        { title: 'Telling Time', summary: 'To the minute.' },
        { title: 'Elapsed Time', summary: 'How much time passed.' },
      ], questions: [
        { id: '3-M-Q4-1', q: 'A bar graph shows ___', type: 'mc', options: ['amounts', 'colors', 'sounds'], answer: 0 },
        { id: '3-M-Q4-2', q: 'From 2:00 to 2:30 is ___ minutes.', type: 'short', answer: '30' },
      ]},
    ]},
    { name: 'Language Arts', units: [
      { name: 'Q1 — Reading', lessons: [
        { title: 'Genres', summary: 'Fiction, nonfiction, biography.' },
        { title: 'Context Clues', summary: 'Guess word meaning from sentence.' },
        { title: 'Summarize', summary: 'A few sentences capture the book.' },
      ], questions: [
        { id: '3-L-Q1-1', q: 'A story about a real person’s life is a ___', type: 'mc', options: ['biography', 'fable', 'poem'], answer: 0 },
        { id: '3-L-Q1-2', q: 'Context clues help you ___', type: 'mc', options: ['guess a word’s meaning', 'spell', 'count'], answer: 0 },
      ]},
      { name: 'Q2 — Grammar', lessons: [
        { title: 'Plural Nouns', summary: '-s, -es, irregular (children).' },
        { title: 'Verb Tenses', summary: 'Past, present, future.' },
        { title: 'Comparatives', summary: '-er, -est (big, bigger, biggest).' },
      ], questions: [
        { id: '3-L-Q2-1', q: 'Plural of "child"?', type: 'mc', options: ['childs', 'children', 'childes'], answer: 1 },
        { id: '3-L-Q2-2', q: 'Comparative of "small" is ___', type: 'short', answer: 'smaller' },
      ]},
      { name: 'Q3 — Writing', lessons: [
        { title: 'Opinion Paragraph', summary: 'State opinion + 2 reasons.' },
        { title: 'Informative', summary: 'Teach the reader a fact.' },
        { title: 'Narrative', summary: 'Show, don’t just tell.' },
      ], questions: [
        { id: '3-L-Q3-1', q: 'An opinion paragraph needs ___', type: 'mc', options: ['reasons', 'no point', 'only facts'], answer: 0 },
        { id: '3-L-Q3-2', q: 'Write one sentence stating an opinion.', type: 'short', answer: 'open' },
      ]},
      { name: 'Q4 — Cursive & Research', lessons: [
        { title: 'Cursive Intro', summary: 'Form a, c, d, g, o, q.' },
        { title: 'Dictionary Skills', summary: 'Guide words, order.' },
        { title: 'Simple Report', summary: '3 facts on a topic.' },
      ], questions: [
        { id: '3-L-Q4-1', q: 'Guide words in a dictionary show the ___', type: 'mc', options: ['first and last words on page', 'meaning', 'spelling'], answer: 0 },
        { id: '3-L-Q4-2', q: 'Write one fact you learned this year.', type: 'short', answer: 'open' },
      ]},
    ]},
    { name: 'Spelling & Word Origins', units: [
      { name: 'Q1 — Latin Roots Begin', lessons: [
        { title: 'List 1: -spect/-dict', summary: 'inspect, respect, predict, dictation.' },
        { title: 'Root: spect = "look"', summary: 'Spect comes from Latin "specere" (to look).' },
        { title: 'Root: dict = "say"', summary: 'Dict from Latin "dicere" (to say).' },
      ], questions: [
        { id: '3-SP-Q1-1', q: '"inspect" means to look ___ something.', type: 'mc', options: ['at', 'for', 'under'], answer: 0 },
        { id: '3-SP-Q1-2', q: 'The root "dict" means ___', type: 'mc', options: ['say', 'look', 'write'], answer: 0 },
      ]},
      { name: 'Q2 — Greek Roots', lessons: [
        { title: 'List 2: -phone/-graph', summary: 'telephone, phonics, photograph, paragraph.' },
        { title: 'Root: phone = "sound"', summary: 'From Greek "phonē".' },
        { title: 'Root: graph = "write"', summary: 'From Greek "graphein".' },
      ], questions: [
        { id: '3-SP-Q2-1', q: '"telephone" carries ___ far away.', type: 'mc', options: ['sound', 'light', 'water'], answer: 0 },
        { id: '3-SP-Q2-2', q: '"photograph" means writing with ___', type: 'mc', options: ['light', 'sound', 'hand'], answer: 0 },
      ]},
      { name: 'Q3 — Prefixes', lessons: [
        { title: 'List 3: un-, re-, pre-', summary: 'unhappy, reuse, preview.' },
        { title: 'Prefix: un- = "not"', summary: 'Stems from old English.' },
        { title: 'Prefix: pre- = "before"', summary: 'From Latin "prae".' },
      ], questions: [
        { id: '3-SP-Q3-1', q: '"unhappy" means ___', type: 'mc', options: ['not happy', 'very happy', 'happy again'], answer: 0 },
        { id: '3-SP-Q3-2', q: '"preview" means to see it ___', type: 'mc', options: ['before', 'after', 'never'], answer: 0 },
      ]},
      { name: 'Q4 — Review', lessons: [
        { title: 'Master List', summary: 'Spell all year words.' },
        { title: 'Root Recap', summary: 'spect, dict, phone, graph, un-, pre-.' },
        { title: 'Use Roots', summary: 'Guess a new word from its root.' },
      ], questions: [
        { id: '3-SP-Q4-1', q: 'Write a word with the root "graph".', type: 'short', answer: 'open' },
        { id: '3-SP-Q4-2', q: 'Knowing roots helps you ___ new words.', type: 'mc', options: ['guess the meaning of', 'spell backwards', 'ignore'], answer: 0 },
      ]},
    ]},
    { name: 'Science', units: [
      { name: 'Q1 — Life Science', lessons: [
        { title: 'Plant Parts & Function', summary: 'Roots drink, leaves make food.' },
        { title: 'Animal Groups', summary: 'Vertebrate classes.' },
        { title: 'Adaptations', summary: 'Body fits environment.' },
      ], questions: [
        { id: '3-SC-Q1-1', q: 'Leaves make food using ___', type: 'mc', options: ['sunlight', 'moonlight', 'noise'], answer: 0 },
        { id: '3-SC-Q1-2', q: 'A frog is a ___', type: 'mc', options: ['amphibian', 'mammal', 'bird'], answer: 0 },
      ]},
      { name: 'Q2 — Forces', lessons: [
        { title: 'Push, Pull, Friction', summary: 'Forces change motion.' },
        { title: 'Magnets', summary: 'Attract/repel, poles.' },
        { title: 'Gravity', summary: 'Pulls things down.' },
      ], questions: [
        { id: '3-SC-Q2-1', q: 'Gravity pulls things ___', type: 'mc', options: ['down', 'up', 'sideways'], answer: 0 },
        { id: '3-SC-Q2-2', q: 'Opposite magnet poles ___', type: 'mc', options: ['attract', 'repel', 'do nothing'], answer: 0 },
      ]},
      { name: 'Q3 — Weather', lessons: [
        { title: 'Cloud Types', summary: 'Cumulus, stratus, cirrus.' },
        { title: 'Fronts', summary: 'Where air masses meet.' },
        { title: 'Climate', summary: 'Long-term weather.' },
      ], questions: [
        { id: '3-SC-Q3-1', q: 'Cumulus clouds look like ___', type: 'mc', options: ['fluffy cotton', 'thin lines', 'flat gray'], answer: 0 },
        { id: '3-SC-Q3-2', q: 'Climate is weather over a ___ time.', type: 'mc', options: ['long', 'short', 'single day'], answer: 0 },
      ]},
      { name: 'Q4 — Solar System', lessons: [
        { title: 'Planets Order', summary: 'My Very Educated Mother Just Served Us Noodles.' },
        { title: 'Moon Phases', summary: 'New to full.' },
        { title: 'Stars', summary: 'Our sun is a star.' },
      ], questions: [
        { id: '3-SC-Q4-1', q: 'The 3rd planet from the sun is ___', type: 'mc', options: ['Earth', 'Mars', 'Venus'], answer: 0 },
        { id: '3-SC-Q4-2', q: 'Our sun is a ___', type: 'mc', options: ['star', 'planet', 'moon'], answer: 0 },
      ]},
    ]},
    { name: 'History & Geography', units: [
      { name: 'Q1 — Colonies to Independence', lessons: [
        { title: '13 Colonies', summary: 'Regions and life.' },
        { title: 'Revolution', summary: 'Why the colonists rebelled.' },
        { title: 'Declaration', summary: '1776, freedom stated.' },
      ], questions: [
        { id: '3-H-Q1-1', q: 'The Declaration of Independence was in ___', type: 'mc', options: ['1776', '1492', '1865'], answer: 0 },
        { id: '3-H-Q1-2', q: 'The colonists wanted ___', type: 'mc', options: ['freedom', 'more taxes', 'a king'], answer: 0 },
      ]},
      { name: 'Q2 — Westward', lessons: [
        { title: 'Lewis & Clark', summary: 'Explore the new land.' },
        { title: 'Trail & Pioneers', summary: 'Moving west.' },
        { title: 'Native Displacement', summary: 'Hard truth, age-fit.' },
      ], questions: [
        { id: '3-H-Q2-1', q: 'Lewis and Clark ___ the west.', type: 'mc', options: ['explored', 'ruled', 'sold'], answer: 0 },
        { id: '3-H-Q2-2', q: 'Pioneers moved ___', type: 'mc', options: ['west', 'east', 'north only'], answer: 0 },
      ]},
      { name: 'Q3 — Civil War', lessons: [
        { title: 'Causes', summary: 'Freedom and unity.' },
        { title: 'Key Figures', summary: 'Lincoln, Tubman, Davis (age-fit).' },
        { title: 'Emancipation', summary: 'Freedom for the enslaved.' },
      ], questions: [
        { id: '3-H-Q3-1', q: 'Abraham Lincoln was the ___ president.', type: 'mc', options: ['16th', '1st', '20th'], answer: 0 },
        { id: '3-H-Q3-2', q: 'The Civil War ended ___', type: 'mc', options: ['slavery', 'taxes', 'war with France'], answer: 0 },
      ]},
      { name: 'Q4 — Maps & Globe Skills', lessons: [
        { title: 'Latitude/Longitude', summary: 'Grid on the globe.' },
        { title: 'Hemispheres', summary: 'North/South, East/West.' },
        { title: 'US Physical', summary: 'Mountains, rivers, plains.' },
      ], questions: [
        { id: '3-H-Q4-1', q: 'Lines that run east-west are ___', type: 'mc', options: ['latitude', 'longitude', 'rivers'], answer: 0 },
        { id: '3-H-Q4-2', q: 'We are in the ___ hemisphere.', type: 'mc', options: ['Northern', 'Southern', 'Eastern'], answer: 0 },
      ]},
    ]},
    { name: 'Bible & Character', units: [
      { name: 'Q1 — Joseph', lessons: [
        { title: 'Sold & Sold Again', summary: 'God’s plan through trouble.' },
        { title: 'Forgives Brothers', summary: 'Kindness to those who hurt him.' },
        { title: 'God’s Care', summary: 'Even bad turns to good.' },
      ], questions: [
        { id: '3-B-Q1-1', q: 'Joseph forgave his ___', type: 'mc', options: ['brothers', 'friends', 'king'], answer: 0 },
        { id: '3-B-Q1-2', q: 'God turned bad into ___', type: 'mc', options: ['good', 'nothing', 'worse'], answer: 0 },
      ]},
      { name: 'Q2 — Parables', lessons: [
        { title: 'Sower', summary: 'Heart ready for truth.' },
        { title: 'Talents', summary: 'Use what God gave.' },
        { title: 'Mustard Seed', summary: 'Small faith grows.' },
      ], questions: [
        { id: '3-B-Q2-1', q: 'The man with many talents was ___', type: 'mc', options: ['praised', 'punished', 'ignored'], answer: 0 },
        { id: '3-B-Q2-2', q: 'A mustard seed is ___ but grows big.', type: 'mc', options: ['small', 'large', 'round'], answer: 0 },
      ]},
      { name: 'Q3 — Psalms & Proverbs', lessons: [
        { title: 'Proverbs on Words', summary: 'Kind words heal.' },
        { title: 'Fear the Lord', summary: 'Wisdom begins there.' },
        { title: 'Trust', summary: 'Lean not on own understanding.' },
      ], questions: [
        { id: '3-B-Q3-1', q: 'Wisdom begins with ___ the Lord.', type: 'mc', options: ['respecting', 'fearing', 'ignoring'], answer: 1 },
        { id: '3-B-Q3-2', q: 'Kind words are like a ___', type: 'mc', options: ['healing tree', 'stone', 'storm'], answer: 0 },
      ]},
      { name: 'Q4 — Missions', lessons: [
        { title: 'Tell Others', summary: 'Share the good news.' },
        { title: 'Help the Poor', summary: 'God loves the needy.' },
        { title: 'My Part', summary: 'Even a child can serve.' },
      ], questions: [
        { id: '3-B-Q4-1', q: 'We share the good news by ___', type: 'mc', options: ['telling others', 'hiding', 'bragging'], answer: 0 },
        { id: '3-B-Q4-2', q: 'God cares especially for the ___', type: 'mc', options: ['needy', 'rich only', 'strong'], answer: 0 },
      ]},
    ]},
  ])

// 4th and 5th grades continue in curriculum_part2b.ts (kept lean for compile speed)
export const CURRICULUM_PART2: GradeCurriculum[] = [G2, G3]
