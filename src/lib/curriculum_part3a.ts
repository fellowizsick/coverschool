// Larose Christian Academy — ORIGINAL Curriculum, Grades 7-9 (part 3a)
// Same 6-subject structure. Etymology deepens (Latin/Greek roots across subjects).

import type { GradeCurriculum } from './curriculum'

const g = (
  grade: string,
  gradeNum: number,
  age: string,
  tagline: string,
  subjects: any
): GradeCurriculum => ({ grade, gradeNum, age, tagline, subjects })

// ====================== 7TH GRADE ======================
export const G7: GradeCurriculum = g('7th Grade', 7, '12-13', 'Pre-algebra, literature, and logic take root.',
  [
    { name: 'Mathematics', units: [
      { name: 'Q1 — Pre-Algebra', lessons: [
        { title: 'Integers & Absolute Value', summary: 'Order, compare, |x|.' },
        { title: 'Order of Operations', summary: 'PEMDAS with negatives.' },
        { title: 'Distributive Property', summary: 'a(b+c) = ab+ac.' },
      ], questions: [
        { id: '7-M-Q1-1', q: '|-7| = ?', type: 'mc', options: ['7', '-7', '0'], answer: 0 },
        { id: '7-M-Q1-2', q: '3(2+4) = ?', type: 'short', answer: '18' },
      ]},
      { name: 'Q2 — Expressions & Equations', lessons: [
        { title: 'One-Step Equations', summary: 'Undo with inverse.' },
        { title: 'Two-Step Equations', summary: 'Isolate the variable.' },
        { title: 'Inequalities', summary: '<, >, ≤, ≥ on a line.' },
      ], questions: [
        { id: '7-M-Q2-1', q: 'Solve: 2x = 14', type: 'short', answer: '7' },
        { id: '7-M-Q2-2', q: 'x + 3 < 8 means x < ___', type: 'short', answer: '5' },
      ]},
      { name: 'Q3 — Ratios & Proportion', lessons: [
        { title: 'Proportions', summary: 'Cross-multiply.' },
        { title: 'Similar Figures', summary: 'Scale and ratio.' },
        { title: 'Percent Applications', summary: 'Tax, tip, discount.' },
      ], questions: [
        { id: '7-M-Q3-1', q: 'If 2/3 = x/9, x = ?', type: 'mc', options: ['6', '4', '8'], answer: 0 },
        { id: '7-M-Q3-2', q: 'A 10% tip on $50 is $___', type: 'short', answer: '5' },
      ]},
      { name: 'Q4 — Geometry Basics', lessons: [
        { title: 'Angle Pairs', summary: 'Complementary, supplementary.' },
        { title: 'Triangles', summary: 'Sum of angles = 180.' },
        { title: 'Area & Circumference', summary: 'Circles: πr², 2πr.' },
      ], questions: [
        { id: '7-M-Q4-1', q: 'Two angles summing to 90° are ___', type: 'mc', options: ['complementary', 'supplementary', 'vertical'], answer: 0 },
        { id: '7-M-Q4-2', q: 'Area of circle r=3? (use 3.14)', type: 'short', answer: '28.26' },
      ]},
    ]},
    { name: 'Language Arts', units: [
      { name: 'Q1 — Literature', lessons: [
        { title: 'Genres Deep', summary: 'Novel, short story, poetry.' },
        { title: 'Character Analysis', summary: 'Motivation and change.' },
        { title: 'Setting & Mood', summary: 'Place shapes feeling.' },
      ], questions: [
        { id: '7-L-Q1-1', q: 'A character’s motivation is their ___', type: 'mc', options: ['reason for acting', 'name', 'age'], answer: 0 },
        { id: '7-L-Q1-2', q: 'Mood is the ___ the text creates.', type: 'mc', options: ['feeling', 'length', 'title'], answer: 0 },
      ]},
      { name: 'Q2 — Grammar & Usage', lessons: [
        { title: 'Phrases & Clauses', summary: 'Independent vs dependent.' },
        { title: 'Sentence Combining', summary: 'Smooth, varied writing.' },
        { title: 'Common Errors', summary: 'Who/whom, lie/lay.' },
      ], questions: [
        { id: '7-L-Q2-1', q: 'A dependent clause ___ stand alone.', type: 'mc', options: ['cannot', 'can', 'must'], answer: 0 },
        { id: '7-L-Q2-2', q: 'We ___ down when tired. (lie/lay)', type: 'mc', options: ['lie', 'lay', 'both'], answer: 0 },
      ]},
      { name: 'Q3 — Composition', lessons: [
        { title: 'Thesis & Support', summary: 'Claim + evidence.' },
        { title: 'Revision', summary: 'Clarity and flow.' },
        { title: 'Research Basics', summary: 'Source quality.' },
      ], questions: [
        { id: '7-L-Q3-1', q: 'A strong essay has a clear ___', type: 'mc', options: ['thesis', 'joke', 'list'], answer: 0 },
        { id: '7-L-Q3-2', q: 'Write a thesis on why reading builds character.', type: 'short', answer: 'open' },
      ]},
      { name: 'Q4 — Speaking & Listening', lessons: [
        { title: 'Oral Presentation', summary: 'Eye contact, pace.' },
        { title: 'Note-Taking', summary: 'Cornell method.' },
        { title: 'Discussion', summary: 'Build on others’ ideas.' },
      ], questions: [
        { id: '7-L-Q4-1', q: 'Good notes capture ___', type: 'mc', options: ['main ideas', 'every word', 'nothing'], answer: 0 },
        { id: '7-L-Q4-2', q: 'In discussion, we should ___ others.', type: 'mc', options: ['listen to', 'ignore', 'shout over'], answer: 0 },
      ]},
    ]},
    { name: 'Spelling & Word Origins', units: [
      { name: 'Q1 — Latin Roots 5', lessons: [
        { title: 'List 1: bene/mal, spec', summary: 'benefit, benign, malice, malicious, spectacle.' },
        { title: 'Root: bene = "good"', summary: 'Latin "bene".' },
        { title: 'Root: mal = "bad"', summary: 'Latin "malus".' },
      ], questions: [
        { id: '7-SP-Q1-1', q: '"benefit" does you ___', type: 'mc', options: ['good', 'harm', 'nothing'], answer: 0 },
        { id: '7-SP-Q1-2', q: '"malice" is ___ will.', type: 'mc', options: ['bad', 'good', 'strong'], answer: 0 },
      ]},
      { name: 'Q2 — Greek Roots 5', lessons: [
        { title: 'List 2: phob, phil', summary: 'phobia, philosophy, philanthropy.' },
        { title: 'Root: phob = "fear"', summary: 'Greek "phobos".' },
        { title: 'Root: phil = "love"', summary: 'Greek "philos".' },
      ], questions: [
        { id: '7-SP-Q2-1', q: 'A "phobia" is a ___', type: 'mc', options: ['fear', 'love', 'study'], answer: 0 },
        { id: '7-SP-Q2-2', q: '"philanthropy" is love of ___', type: 'mc', options: ['mankind', 'wisdom', 'words'], answer: 0 },
      ]},
      { name: 'Q3 — Roots in Science', lessons: [
        { title: 'List 3: hydro, therm', summary: 'hydrogen, hydrate, thermal, thermometer.' },
        { title: 'Root: hydro = "water"', summary: 'Greek "hydor".' },
        { title: 'Root: therm = "heat"', summary: 'Greek "therme".' },
      ], questions: [
        { id: '7-SP-Q3-1', q: '"hydrate" adds ___', type: 'mc', options: ['water', 'heat', 'light'], answer: 0 },
        { id: '7-SP-Q3-2', q: 'Write a word with root "therm".', type: 'short', answer: 'open' },
      ]},
      { name: 'Q4 — Review', lessons: [
        { title: 'Master List', summary: 'Spell all year words.' },
        { title: 'Root Map', summary: 'bene, mal, phob, phil, hydro, therm.' },
        { title: 'Decode', summary: 'New word from roots.' },
      ], questions: [
        { id: '7-SP-Q4-1', q: 'Write a word with root "phil".', type: 'short', answer: 'open' },
        { id: '7-SP-Q4-2', q: 'Roots unlock meaning of ___ words.', type: 'mc', options: ['unknown', 'short', 'easy'], answer: 0 },
      ]},
    ]},
    { name: 'Science', units: [
      { name: 'Q1 — Life Science', lessons: [
        { title: 'Cells & DNA', summary: 'Instructions for life.' },
        { title: 'Genetics', summary: 'Traits and inheritance.' },
        { title: 'Evolution', summary: 'Change over generations (age-fit).' },
      ], questions: [
        { id: '7-SC-Q1-1', q: 'DNA carries ___', type: 'mc', options: ['instructions', 'water', 'light'], answer: 0 },
        { id: '7-SC-Q1-2', q: 'Traits are passed from ___', type: 'mc', options: ['parents', 'friends', 'teachers'], answer: 0 },
      ]},
      { name: 'Q2 — Chemistry', lessons: [
        { title: 'Elements', summary: 'Periodic table intro.' },
        { title: 'Compounds', summary: 'Atoms bond.' },
        { title: 'Reactions', summary: 'Reactants to products.' },
      ], questions: [
        { id: '7-SC-Q2-1', q: 'The periodic table lists ___', type: 'mc', options: ['elements', 'rocks', 'stars'], answer: 0 },
        { id: '7-SC-Q2-2', q: 'When atoms bond they form ___', type: 'mc', options: ['compounds', 'gases', 'light'], answer: 0 },
      ]},
      { name: 'Q3 — Physics', lessons: [
        { title: 'Forces', summary: 'Net force, balanced.' },
        { title: 'Energy', summary: 'Types and conservation.' },
        { title: 'Waves', summary: 'Sound and light.' },
      ], questions: [
        { id: '7-SC-Q3-1', q: 'Energy cannot be created or ___', type: 'mc', options: ['destroyed', 'moved', 'seen'], answer: 0 },
        { id: '7-SC-Q3-2', q: 'Light travels as ___', type: 'mc', options: ['waves', 'solids', 'water'], answer: 0 },
      ]},
      { name: 'Q4 — Earth & Space', lessons: [
        { title: 'Geologic Time', summary: 'Deep history of Earth.' },
        { title: 'Climate', summary: 'Systems and change.' },
        { title: 'Universe', summary: 'Scale of space.' },
      ], questions: [
        { id: '7-SC-Q4-1', q: 'Earth is about ___ years old (billions).', type: 'mc', options: ['4.5', '1', '10'], answer: 0 },
        { id: '7-SC-Q4-2', q: 'Climate is the long-term ___', type: 'mc', options: ['weather', 'soil', 'rock'], answer: 0 },
      ]},
    ]},
    { name: 'History & Geography', units: [
      { name: 'Q1 — World History', lessons: [
        { title: 'Middle Ages', summary: 'Knights, castles, church.' },
        { title: 'Renaissance', summary: 'Rebirth of learning.' },
        { title: 'Exploration', summary: 'Worlds connect.' },
      ], questions: [
        { id: '7-H-Q1-1', q: 'The Renaissance began in ___', type: 'mc', options: ['Italy', 'France', 'England'], answer: 0 },
        { id: '7-H-Q1-2', q: 'Knights lived in the ___', type: 'mc', options: ['Middle Ages', 'Stone Age', 'future'], answer: 0 },
      ]},
      { name: 'Q2 — US History to 1865', lessons: [
        { title: 'Founding', summary: 'Constitution and early republic.' },
        { title: 'Expansion', summary: 'Growth and conflict.' },
        { title: 'Civil War', summary: 'Causes and meaning.' },
      ], questions: [
        { id: '7-H-Q2-1', q: 'The Civil War was fought over ___', type: 'mc', options: ['slavery and union', 'taxes only', 'land'], answer: 0 },
        { id: '7-H-Q2-2', q: 'The Constitution was signed in ___', type: 'short', answer: '1787' },
      ]},
      { name: 'Q3 — US History 1865-1945', lessons: [
        { title: 'Reconstruction', summary: 'Healing a divided nation.' },
        { title: 'Industrial Era', summary: 'Invention and cities.' },
        { title: 'World Wars', summary: 'America in the world.' },
      ], questions: [
        { id: '7-H-Q3-1', q: 'The Industrial Era brought ___', type: 'mc', options: ['factories', 'farms only', 'silence'], answer: 0 },
        { id: '7-H-Q3-2', q: 'The US entered World War II after ___', type: 'mc', options: ['Pearl Harbor', '9/11', 'the Civil War'], answer: 0 },
      ]},
      { name: 'Q4 — Civics', lessons: [
        { title: 'Branches', summary: 'How laws are made.' },
        { title: 'Rights', summary: 'Constitution protects.' },
        { title: 'Duties', summary: 'Citizen responsibility.' },
      ], questions: [
        { id: '7-H-Q4-1', q: 'Laws are made by the ___ branch.', type: 'mc', options: ['legislative', 'executive', 'judicial'], answer: 0 },
        { id: '7-H-Q4-2', q: 'Name one duty of a citizen.', type: 'short', answer: 'open' },
      ]},
    ]},
    { name: 'Bible & Character', units: [
      { name: 'Q1 — Old Testament Survey', lessons: [
        { title: 'Law & History', summary: 'The story of Israel.' },
        { title: 'Wisdom Books', summary: 'Living well.' },
        { title: 'Prophets', summary: 'Calling back to God.' },
      ], questions: [
        { id: '7-B-Q1-1', q: 'The first five books are the ___', type: 'mc', options: ['Law', 'Prophets', 'Gospels'], answer: 0 },
        { id: '7-B-Q1-2', q: 'The prophets called people back to ___', type: 'mc', options: ['God', 'war', 'gold'], answer: 0 },
      ]},
      { name: 'Q2 — Life of Christ', lessons: [
        { title: 'Miracles', summary: 'Power and mercy.' },
        { title: 'Parables', summary: 'Kingdom truths.' },
        { title: 'Death & Resurrection', summary: 'Victory over sin.' },
      ], questions: [
        { id: '7-B-Q2-1', q: 'Jesus rose from the ___', type: 'mc', options: ['dead', 'boat', 'town'], answer: 0 },
        { id: '7-B-Q2-2', q: 'The Resurrection shows Jesus has power over ___', type: 'mc', options: ['death', 'water', 'time'], answer: 0 },
      ]},
      { name: 'Q3 — Early Church', lessons: [
        { title: 'Acts', summary: 'The Spirit sends.' },
        { title: 'Epistles', summary: 'Letters to churches.' },
        { title: 'Persecution', summary: 'Faith under pressure.' },
      ], questions: [
        { id: '7-B-Q3-1', q: 'The book of Acts tells of the ___', type: 'mc', options: ['early church', 'creation', 'end times'], answer: 0 },
        { id: '7-B-Q3-2', q: 'The Holy Spirit ___ believers.', type: 'mc', options: ['empowers', 'ignores', 'leaves'], answer: 0 },
      ]},
      { name: 'Q4 — Worldview', lessons: [
        { title: 'Truth', summary: 'God is the standard.' },
        { title: 'Identity', summary: 'Made in His image.' },
        { title: 'Purpose', summary: 'Love God, love others.' },
      ], questions: [
        { id: '7-B-Q4-1', q: 'We are made in the image of ___', type: 'mc', options: ['God', 'animals', 'stone'], answer: 0 },
        { id: '7-B-Q4-2', q: 'Our purpose is to ___ God.', type: 'mc', options: ['love', 'ignore', 'fear'], answer: 0 },
      ]},
    ]},
  ])

// ====================== 8TH GRADE ======================
export const G8: GradeCurriculum = g('8th Grade', 8, '13-14', 'Algebra, argument, and independence.',
  [
    { name: 'Mathematics', units: [
      { name: 'Q1 — Linear Equations', lessons: [
        { title: 'Slope-Intercept', summary: 'y = mx + b.' },
        { title: 'Graphing Lines', summary: 'Plot and read.' },
        { title: 'Systems', summary: 'Two equations, one solution.' },
      ], questions: [
        { id: '8-M-Q1-1', q: 'In y=2x+3, the slope is ___', type: 'short', answer: '2' },
        { id: '8-M-Q1-2', q: 'A system may have ___ solution(s).', type: 'mc', options: ['one', 'zero', 'one, zero, or infinite'], answer: 2 },
      ]},
      { name: 'Q2 — Functions', lessons: [
        { title: 'What Is a Function', summary: 'One output per input.' },
        { title: 'Function Notation', summary: 'f(x).' },
        { title: 'Domain & Range', summary: 'Inputs and outputs.' },
      ], questions: [
        { id: '8-M-Q2-1', q: 'f(2) means plug ___ in for x.', type: 'short', answer: '2' },
        { id: '8-M-Q2-2', q: 'A function has ___ output per input.', type: 'mc', options: ['one', 'many', 'none'], answer: 0 },
      ]},
      { name: 'Q3 — Exponents & Roots', lessons: [
        { title: 'Laws of Exponents', summary: 'Multiply, divide, power.' },
        { title: 'Square Roots', summary: 'Inverse of squaring.' },
        { title: 'Scientific Notation', summary: 'Big and small numbers.' },
      ], questions: [
        { id: '8-M-Q3-1', q: 'x³ · x² = x^___', type: 'short', answer: '5' },
        { id: '8-M-Q3-2', q: '√49 = ___', type: 'short', answer: '7' },
      ]},
      { name: 'Q4 — Geometry & Stats', lessons: [
        { title: 'Pythagorean Theorem', summary: 'a² + b² = c².' },
        { title: 'Transformations', summary: 'Translate, rotate, reflect.' },
        { title: 'Scatter Plots', summary: 'See relationships.' },
      ], questions: [
        { id: '8-M-Q4-1', q: 'In a right triangle, a²+b² = ___', type: 'short', answer: 'c²' },
        { id: '8-M-Q4-2', q: 'A scatter plot shows ___ between two variables.', type: 'mc', options: ['relationships', 'colors', 'sounds'], answer: 0 },
      ]},
    ]},
    { name: 'Language Arts', units: [
      { name: 'Q1 — Argument', lessons: [
        { title: 'Claim & Evidence', summary: 'Build a case.' },
        { title: 'Logical Fallacies', summary: 'Spot bad reasoning.' },
        { title: 'Counterargument', summary: 'Address the other side.' },
      ], questions: [
        { id: '8-L-Q1-1', q: 'A fallacy is ___ reasoning.', type: 'mc', options: ['flawed', 'strong', 'new'], answer: 0 },
        { id: '8-L-Q1-2', q: 'A counterargument ___ the other view.', type: 'mc', options: ['addresses', 'hides', 'ignores'], answer: 0 },
      ]},
      { name: 'Q2 — Rhetoric', lessons: [
        { title: 'Ethos, Pathos, Logos', summary: 'Three appeals.' },
        { title: 'Audience', summary: 'Write for who reads.' },
        { title: 'Tone', summary: 'Voice matches purpose.' },
      ], questions: [
        { id: '8-L-Q2-1', q: 'Pathos appeals to ___', type: 'mc', options: ['emotion', 'logic', 'credibility'], answer: 0 },
        { id: '8-L-Q2-2', q: 'Ethos is an appeal to ___', type: 'mc', options: ['credibility', 'fear', 'humor'], answer: 0 },
      ]},
      { name: 'Q3 — Research', lessons: [
        { title: 'Source Evaluation', summary: 'Is it trustworthy?' },
        { title: 'Plagiarism', summary: 'Always cite.' },
        { title: 'Works Cited', summary: 'Format matters.' },
      ], questions: [
        { id: '8-L-Q3-1', q: 'Using someone’s words without credit is ___', type: 'mc', options: ['plagiarism', 'fair', 'smart'], answer: 0 },
        { id: '8-L-Q3-2', q: 'Always ___ your sources.', type: 'mc', options: ['cite', 'hide', 'forget'], answer: 0 },
      ]},
      { name: 'Q4 — Literary Analysis', lessons: [
        { title: 'Theme & Symbol', summary: 'Deeper reading.' },
        { title: 'Author’s Craft', summary: 'How style works.' },
        { title: 'Essay', summary: 'Argue from text.' },
      ], questions: [
        { id: '8-L-Q4-1', q: 'An essay should argue from ___', type: 'mc', options: ['the text', 'opinion only', 'guesses'], answer: 0 },
        { id: '8-L-Q4-2', q: 'Write one sentence on a book’s theme.', type: 'short', answer: 'open' },
      ]},
    ]},
    { name: 'Spelling & Word Origins', units: [
      { name: 'Q1 — Latin Roots 6', lessons: [
        { title: 'List 1: man,ject', summary: 'manual, manufacture, project, reject.' },
        { title: 'Root: man = "hand"', summary: 'Latin "manus".' },
        { title: 'Root: ject = "throw"', summary: 'Latin "jacere".' },
      ], questions: [
        { id: '8-SP-Q1-1', q: '"manual" is done by ___', type: 'mc', options: ['hand', 'machine', 'mind'], answer: 0 },
        { id: '8-SP-Q1-2', q: '"project" means to throw ___', type: 'mc', options: ['forward', 'away', 'down'], answer: 0 },
      ]},
      { name: 'Q2 — Greek Roots 6', lessons: [
        { title: 'List 2: auto, chron (review)', summary: 'automatic, autobiography, chronological.' },
        { title: 'Root: auto = "self"', summary: 'Greek "autos".' },
        { title: 'Root: chron = "time"', summary: 'review.' },
      ], questions: [
        { id: '8-SP-Q2-1', q: '"autobiography" is a life story written by ___', type: 'mc', options: ['self', 'another', 'no one'], answer: 0 },
        { id: '8-SP-Q2-2', q: 'Write a word with root "chron".', type: 'short', answer: 'open' },
      ]},
      { name: 'Q3 — Prefixes 3', lessons: [
        { title: 'List 3: anti-, de-, mis-', summary: 'antiwar, decode, mistake.' },
        { title: 'Prefix: anti- = "against"', summary: 'Greek "anti".' },
        { title: 'Prefix: de- = "down/remove"', summary: 'Latin "de".' },
      ], questions: [
        { id: '8-SP-Q3-1', q: '"antiwar" is ___ war.', type: 'mc', options: ['against', 'for', 'about'], answer: 0 },
        { id: '8-SP-Q3-2', q: '"decode" means to ___ a code.', type: 'mc', options: ['remove/undo', 'make', 'break'], answer: 0 },
      ]},
      { name: 'Q4 — Review', lessons: [
        { title: 'Master List', summary: 'Spell all year words.' },
        { title: 'Root Map', summary: 'man, ject, auto, anti-, de-, mis-.' },
        { title: 'Decode', summary: 'New word from roots.' },
      ], questions: [
        { id: '8-SP-Q4-1', q: 'Write a word with root "ject".', type: 'short', answer: 'open' },
        { id: '8-SP-Q4-2', q: 'Roots help you ___ new words.', type: 'mc', options: ['decode', 'ignore', 'misspell'], answer: 0 },
      ]},
    ]},
    { name: 'Science', units: [
      { name: 'Q1 — Chemistry', lessons: [
        { title: 'Atomic Structure', summary: 'Protons, neutrons, electrons.' },
        { title: 'Periodic Trends', summary: 'Groups and periods.' },
        { title: 'Chemical Bonds', summary: 'Ionic and covalent.' },
      ], questions: [
        { id: '8-SC-Q1-1', q: 'Electrons orbit the ___', type: 'mc', options: ['nucleus', 'moon', 'sun'], answer: 0 },
        { id: '8-SC-Q1-2', q: 'Atoms bond to become ___', type: 'mc', options: ['stable', 'bigger', 'hotter'], answer: 0 },
      ]},
      { name: 'Q2 — Physics', lessons: [
        { title: 'Motion Graphs', summary: 'Distance vs time.' },
        { title: 'Newton’s Laws', summary: 'All three.' },
        { title: 'Work & Power', summary: 'Force over distance.' },
      ], questions: [
        { id: '8-SC-Q2-1', q: 'F = ma is Newton’s ___ law.', type: 'mc', options: ['2nd', '1st', '3rd'], answer: 0 },
        { id: '8-SC-Q2-2', q: 'Work = force × ___', type: 'mc', options: ['distance', 'time', 'mass'], answer: 0 },
      ]},
      { name: 'Q3 — Earth', lessons: [
        { title: 'Weather Systems', summary: 'Fronts and storms.' },
        { title: 'Climate Change', summary: 'Evidence and debate.' },
        { title: 'Conservation', summary: 'Stewardship.' },
      ], questions: [
        { id: '8-SC-Q3-1', q: 'A front is where air masses ___', type: 'mc', options: ['meet', 'split', 'freeze'], answer: 0 },
        { id: '8-SC-Q3-2', q: 'We care for the earth as ___', type: 'mc', options: ['stewards', 'owners', 'rulers'], answer: 0 },
      ]},
      { name: 'Q4 — STEM Project', lessons: [
        { title: 'Define Problem', summary: 'Real need.' },
        { title: 'Design & Build', summary: 'Prototype.' },
        { title: 'Test & Improve', summary: 'Iterate.' },
      ], questions: [
        { id: '8-SC-Q4-1', q: 'Engineering starts with a ___', type: 'mc', options: ['problem', 'guess', 'joke'], answer: 0 },
        { id: '8-SC-Q4-2', q: 'A prototype is a ___ version.', type: 'mc', options: ['first', 'final', 'broken'], answer: 0 },
      ]},
    ]},
    { name: 'History & Geography', units: [
      { name: 'Q1 — US History 1945-2000', lessons: [
        { title: 'Cold War', summary: 'Rivalry and calm.' },
        { title: 'Civil Rights', summary: 'Justice for all.' },
        { title: 'Modern Era', summary: 'Tech and change.' },
      ], questions: [
        { id: '8-H-Q1-1', q: 'The Civil Rights movement sought ___', type: 'mc', options: ['justice', 'war', 'taxes'], answer: 0 },
        { id: '8-H-Q1-2', q: 'The Cold War was between the US and the ___', type: 'mc', options: ['Soviet Union', 'UK', 'France'], answer: 0 },
      ]},
      { name: 'Q2 — Geography', lessons: [
        { title: 'Human Geography', summary: 'Where people live.' },
        { title: 'Economics & Place', summary: 'Why cities grow.' },
        { title: 'Maps & Data', summary: 'Read thematic maps.' },
      ], questions: [
        { id: '8-H-Q2-1', q: 'Cities grow where there is ___', type: 'mc', options: ['work and water', 'only mountains', 'no land'], answer: 0 },
        { id: '8-H-Q2-2', q: 'A thematic map shows one ___', type: 'mc', options: ['theme', 'color', 'name'], answer: 0 },
      ]},
      { name: 'Q3 — Government', lessons: [
        { title: 'Constitution Deep', summary: 'Articles and amendments.' },
        { title: 'Court System', summary: 'How justice works.' },
        { title: 'State & Local', summary: 'Closer to home.' },
      ], questions: [
        { id: '8-H-Q3-1', q: 'The Supreme Court is the ___ branch.', type: 'mc', options: ['judicial', 'executive', 'legislative'], answer: 0 },
        { id: '8-H-Q3-2', q: 'The Constitution has ___ amendments.', type: 'mc', options: ['27', '10', '50'], answer: 0 },
      ]},
      { name: 'Q4 — Alabama & Civics', lessons: [
        { title: 'State Gov', summary: 'How Alabama runs.' },
        { title: 'Service', summary: 'Help your community.' },
        { title: 'Citizenship', summary: 'Rights and duties.' },
      ], questions: [
        { id: '8-H-Q4-1', q: 'Alabama’s governor leads the ___ branch.', type: 'mc', options: ['executive', 'judicial', 'legislative'], answer: 0 },
        { id: '8-H-Q4-2', q: 'Name one way to serve your community.', type: 'short', answer: 'open' },
      ]},
    ]},
    { name: 'Bible & Character', units: [
      { name: 'Q1 — Gospels', lessons: [
        { title: 'Four Accounts', summary: 'One life, four views.' },
        { title: 'Kingdom Parables', summary: 'Upside-down kingdom.' },
        { title: 'Sermon on Mount', summary: 'The beatitudes.' },
      ], questions: [
        { id: '8-B-Q1-1', q: 'The beatitudes describe ___', type: 'mc', options: ['blessed people', 'rich people', 'kings'], answer: 0 },
        { id: '8-B-Q1-2', q: 'The kingdom of God is ___', type: 'mc', options: ['upside-down', 'like the world', 'only future'], answer: 0 },
      ]},
      { name: 'Q2 — Doctrine', lessons: [
        { title: 'Who Is God', summary: 'Father, Son, Spirit.' },
        { title: 'Salvation', summary: 'Grace through faith.' },
        { title: 'The Church', summary: 'Body of Christ.' },
      ], questions: [
        { id: '8-B-Q2-1', q: 'Salvation is by ___ through faith.', type: 'mc', options: ['grace', 'works', 'money'], answer: 0 },
        { id: '8-B-Q2-2', q: 'God is ___ in three persons.', type: 'mc', options: ['one', 'three separate', 'many'], answer: 0 },
      ]},
      { name: 'Q3 — Ethics', lessons: [
        { title: 'Ten Commandments', summary: 'God’s moral law.' },
        { title: 'Love & Justice', summary: 'Right living.' },
        { title: 'Digital Life', summary: 'Wisdom online.' },
      ], questions: [
        { id: '8-B-Q3-1', q: 'The greatest command is to love ___', type: 'mc', options: ['God', 'money', 'self'], answer: 0 },
        { id: '8-B-Q3-2', q: 'Online, we should be ___', type: 'mc', options: ['wise', 'cruel', 'hidden'], answer: 0 },
      ]},
      { name: 'Q4 — Witness', lessons: [
        { title: 'Share Faith', summary: 'Gently and clearly.' },
        { title: 'Defend Hope', summary: 'Know why you believe.' },
        { title: 'Serve', summary: 'Faith in action.' },
      ], questions: [
        { id: '8-B-Q4-1', q: 'We share faith with ___', type: 'mc', options: ['gentleness', 'anger', 'force'], answer: 0 },
        { id: '8-B-Q4-2', q: 'Faith without action is ___', type: 'mc', options: ['dead', 'strong', 'enough'], answer: 0 },
      ]},
    ]},
  ])

export const CURRICULUM_PART3a: GradeCurriculum[] = [G7, G8]
