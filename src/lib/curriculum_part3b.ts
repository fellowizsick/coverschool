// Larose Christian Academy — ORIGINAL Curriculum, Grades 9-12 (part 3b)
// Same 6-subject structure. Etymology advanced (Latin/Greek roots in every subject).
// 12th grade = senior year; completion feeds the diploma exam (/exam).

import type { GradeCurriculum } from './curriculum'

const g = (
  grade: string,
  gradeNum: number,
  age: string,
  tagline: string,
  subjects: any
): GradeCurriculum => ({ grade, gradeNum, age, tagline, subjects })

// ====================== 9TH GRADE ======================
export const G9: GradeCurriculum = g('9th Grade', 9, '14-15', 'Algebra, world literature, and clear thinking.',
  [
    { name: 'Mathematics', units: [
      { name: 'Q1 — Algebra I', lessons: [
        { title: 'Linear Systems', summary: 'Solve by substitution/elimination.' },
        { title: 'Polynomials', summary: 'Add, subtract, multiply.' },
        { title: 'Factoring', summary: 'Greatest common, trinomials.' },
      ], questions: [
        { id: '9-M-Q1-1', q: 'Factor: x² - 9', type: 'short', answer: '(x-3)(x+3)' },
        { id: '9-M-Q1-2', q: 'Solve: x + y = 5, x - y = 1 → x = ?', type: 'short', answer: '3' },
      ]},
      { name: 'Q2 — Quadratics', lessons: [
        { title: 'Standard Form', summary: 'ax² + bx + c.' },
        { title: 'Solving', summary: 'Factor, complete square, formula.' },
        { title: 'Graphing', summary: 'Parabola, vertex.' },
      ], questions: [
        { id: '9-M-Q2-1', q: 'Quadratic formula has ___ in the radicand.', type: 'mc', options: ['b²-4ac', 'a+b', 'c²'], answer: 0 },
        { id: '9-M-Q2-2', q: 'The graph of a quadratic is a ___', type: 'mc', options: ['parabola', 'line', 'circle'], answer: 0 },
      ]},
      { name: 'Q3 — Exponents & Radicals', lessons: [
        { title: 'Laws', summary: 'All exponent rules.' },
        { title: 'Rational Exponents', summary: 'x^(1/2) = √x.' },
        { title: 'Simplify Radicals', summary: 'Pull squares.' },
      ], questions: [
        { id: '9-M-Q3-1', q: 'x^(1/2) = ___', type: 'mc', options: ['√x', 'x²', '1/x'], answer: 0 },
        { id: '9-M-Q3-2', q: 'Simplify √18 = ___', type: 'short', answer: '3√2' },
      ]},
      { name: 'Q4 — Intro Functions', lessons: [
        { title: 'Linear Functions', summary: 'Rate of change.' },
        { title: 'Exponential', summary: 'Growth and decay.' },
        { title: 'Sequences', summary: 'Arithmetic and geometric.' },
      ], questions: [
        { id: '9-M-Q4-1', q: 'A bank account with 3% interest grows ___', type: 'mc', options: ['exponentially', 'linearly', 'not at all'], answer: 0 },
        { id: '9-M-Q4-2', q: 'Arithmetic sequence adds the same ___', type: 'mc', options: ['difference', 'ratio', 'sum'], answer: 0 },
      ]},
    ]},
    { name: 'Language Arts', units: [
      { name: 'Q1 — World Literature', lessons: [
        { title: 'Epic & Myth', summary: 'Stories that shape cultures.' },
        { title: 'Short Fiction', summary: 'Craft of the story.' },
        { title: 'Poetry', summary: 'Form and voice.' },
      ], questions: [
        { id: '9-L-Q1-1', q: 'An epic is a long ___', type: 'mc', options: ['narrative poem', 'essay', 'letter'], answer: 0 },
        { id: '9-L-Q1-2', q: 'Poetry uses concentrated ___', type: 'mc', options: ['language', 'facts', 'numbers'], answer: 0 },
      ]},
      { name: 'Q2 — Rhetoric', lessons: [
        { title: 'Three Appeals', summary: 'Ethos, pathos, logos.' },
        { title: 'Argument Essay', summary: 'Thesis, evidence, counter.' },
        { title: 'Speech', summary: 'Persuade aloud.' },
      ], questions: [
        { id: '9-L-Q2-1', q: 'Logos appeals to ___', type: 'mc', options: ['logic', 'emotion', 'credibility'], answer: 0 },
        { id: '9-L-Q2-2', q: 'A good speech has a clear ___', type: 'mc', options: ['purpose', 'joke', 'list'], answer: 0 },
      ]},
      { name: 'Q3 — Research', lessons: [
        { title: 'Long Form', summary: 'Multi-source paper.' },
        { title: 'Citation', summary: 'MLA basics.' },
        { title: 'Bias', summary: 'Spot slant.' },
      ], questions: [
        { id: '9-L-Q3-1', q: 'MLA is a ___ style.', type: 'mc', options: ['citation', 'writing', 'reading'], answer: 0 },
        { id: '9-L-Q3-2', q: 'Always ___ borrowed ideas.', type: 'mc', options: ['cite', 'copy', 'hide'], answer: 0 },
      ]},
      { name: 'Q4 — Composition', lessons: [
        { title: 'Narrative', summary: 'True and crafted.' },
        { title: 'Expository', summary: 'Explain clearly.' },
        { title: 'Editorial', summary: 'Take a stand.' },
      ], questions: [
        { id: '9-L-Q4-1', q: 'Expository writing ___', type: 'mc', options: ['explains', 'argues', 'rhymes'], answer: 0 },
        { id: '9-L-Q4-2', q: 'Write one sentence stating your view on school uniforms.', type: 'short', answer: 'open' },
      ]},
    ]},
    { name: 'Spelling & Word Origins', units: [
      { name: 'Q1 — Latin Roots 7', lessons: [
        { title: 'List 1: dic, leg', summary: 'dictate, dictator, legal, legislate.' },
        { title: 'Root: dic = "say/declare"', summary: 'Latin "dicere".' },
        { title: 'Root: leg = "law"', summary: 'Latin "lex".' },
      ], questions: [
        { id: '9-SP-Q1-1', q: '"dictate" means to ___', type: 'mc', options: ['say/order', 'write', 'build'], answer: 0 },
        { id: '9-SP-Q1-2', q: '"legal" relates to ___', type: 'mc', options: ['law', 'speech', 'earth'], answer: 0 },
      ]},
      { name: 'Q2 — Greek Roots 7', lessons: [
        { title: 'List 2: syn, pan', summary: 'synonym, synthesis, panorama, pantheon.' },
        { title: 'Root: syn = "with/together"', summary: 'Greek "syn".' },
        { title: 'Root: pan = "all"', summary: 'Greek "pan".' },
      ], questions: [
        { id: '9-SP-Q2-1', q: 'A "synonym" has the ___ meaning.', type: 'mc', options: ['same', 'opposite', 'no'], answer: 0 },
        { id: '9-SP-Q2-2', q: '"panorama" shows ___', type: 'mc', options: ['everything', 'nothing', 'one thing'], answer: 0 },
      ]},
      { name: 'Q3 — Advanced Prefixes', lessons: [
        { title: 'List 3: epi-, cata-', summary: 'epidemic, episode, catastrophe, catalog.' },
        { title: 'Prefix: epi- = "upon/over"', summary: 'Greek "epi".' },
        { title: 'Prefix: cata- = "down"', summary: 'Greek "kata".' },
      ], questions: [
        { id: '9-SP-Q3-1', q: '"epidemic" is upon the ___', type: 'mc', options: ['people', 'earth', 'sky'], answer: 0 },
        { id: '9-SP-Q3-2', q: 'Write a word with prefix "cata-".', type: 'short', answer: 'open' },
      ]},
      { name: 'Q4 — Review', lessons: [
        { title: 'Master List', summary: 'Spell all year words.' },
        { title: 'Root Map', summary: 'dic, leg, syn, pan, epi-, cata-.' },
        { title: 'Decode', summary: 'New word from roots.' },
      ], questions: [
        { id: '9-SP-Q4-1', q: 'Write a word with root "leg".', type: 'short', answer: 'open' },
        { id: '9-SP-Q4-2', q: 'Roots help you read at the ___ level.', type: 'mc', options: ['college', 'baby', 'no'], answer: 0 },
      ]},
    ]},
    { name: 'Science', units: [
      { name: 'Q1 — Biology', lessons: [
        { title: 'Cell & Organelle', summary: 'Structure and job.' },
        { title: 'Genetics', summary: 'DNA, genes, inheritance.' },
        { title: 'Evolution', summary: 'Evidence and theory.' },
      ], questions: [
        { id: '9-SC-Q1-1', q: 'Genes are made of ___', type: 'mc', options: ['DNA', 'protein', 'sugar'], answer: 0 },
        { id: '9-SC-Q1-2', q: 'Mitochondria make ___', type: 'mc', options: ['energy', 'water', 'light'], answer: 0 },
      ]},
      { name: 'Q2 — Chemistry', lessons: [
        { title: 'Stoichiometry', summary: 'Math of reactions.' },
        { title: 'Acids & Bases', summary: 'pH scale.' },
        { title: 'Organic', summary: 'Carbon chemistry.' },
      ], questions: [
        { id: '9-SC-Q2-1', q: 'pH 7 is ___', type: 'mc', options: ['neutral', 'acid', 'base'], answer: 0 },
        { id: '9-SC-Q2-2', q: 'Organic chemistry is built on ___', type: 'mc', options: ['carbon', 'water', 'iron'], answer: 0 },
      ]},
      { name: 'Q3 — Physics', lessons: [
        { title: 'Motion', summary: 'Kinematics.' },
        { title: 'Energy', summary: 'Conservation.' },
        { title: 'Electricity', summary: 'Circuits and fields.' },
      ], questions: [
        { id: '9-SC-Q3-1', q: 'Energy is ___ (cannot be created/destroyed).', type: 'mc', options: ['conserved', 'lost', 'made'], answer: 0 },
        { id: '9-SC-Q3-2', q: 'Voltage is like ___ pressure.', type: 'mc', options: ['water', 'air', 'light'], answer: 0 },
      ]},
      { name: 'Q4 — Elective: Astronomy', lessons: [
        { title: 'Solar System', summary: 'Deep dive.' },
        { title: 'Stars', summary: 'Life and death.' },
        { title: 'Cosmology', summary: 'Origin questions.' },
      ], questions: [
        { id: '9-SC-Q4-1', q: 'Our sun will end as a ___', type: 'mc', options: ['white dwarf', 'black hole', 'supernova star'], answer: 0 },
        { id: '9-SC-Q4-2', q: 'The universe is ___', type: 'mc', options: ['expanding', 'shrinking', 'still'], answer: 0 },
      ]},
    ]},
    { name: 'History & Geography', units: [
      { name: 'Q1 — World History', lessons: [
        { title: 'Antiquity', summary: 'River civilizations.' },
        { title: 'Middle Ages', summary: 'Faith and feudalism.' },
        { title: 'Modern Era', summary: 'Revolution and industry.' },
      ], questions: [
        { id: '9-H-Q1-1', q: 'The Renaissance valued ___', type: 'mc', options: ['learning', 'war', 'silence'], answer: 0 },
        { id: '9-H-Q1-2', q: 'The Industrial Revolution began in ___', type: 'mc', options: ['Britain', 'China', 'Rome'], answer: 0 },
      ]},
      { name: 'Q2 — US History', lessons: [
        { title: 'Founding', summary: 'Ideas and documents.' },
        { title: 'Civil War & Reconstruction', summary: 'Union preserved.' },
        { title: '20th Century', summary: 'Wars and rights.' },
      ], questions: [
        { id: '9-H-Q2-1', q: 'The Declaration was signed in ___', type: 'short', answer: '1776' },
        { id: '9-H-Q2-2', q: 'Reconstruction aimed to ___ the South.', type: 'mc', options: ['rebuild', 'punish', 'leave'], answer: 0 },
      ]},
      { name: 'Q3 — Government', lessons: [
        { title: 'Constitution', summary: 'Structure and spirit.' },
        { title: 'Rights', summary: 'Bill of Rights.' },
        { title: 'Federalism', summary: 'State vs national.' },
      ], questions: [
        { id: '9-H-Q3-1', q: 'Federalism splits power between ___', type: 'mc', options: ['state and national', 'churches', 'courts'], answer: 0 },
        { id: '9-H-Q3-2', q: 'The 1st Amendment protects ___', type: 'mc', options: ['speech', 'guns', 'both'], answer: 2 },
      ]},
      { name: 'Q4 — Economics', lessons: [
        { title: 'Scarcity', summary: 'Choice and cost.' },
        { title: 'Markets', summary: 'Supply and demand.' },
        { title: 'Personal Finance', summary: 'Budget, save, give.' },
      ], questions: [
        { id: '9-H-Q4-1', q: 'Price is set by ___ and ___.', type: 'mc', options: ['supply and demand', 'luck', 'law'], answer: 0 },
        { id: '9-H-Q4-2', q: 'A budget helps you ___', type: 'mc', options: ['plan', 'waste', 'borrow'], answer: 0 },
      ]},
    ]},
    { name: 'Bible & Character', units: [
      { name: 'Q1 — Old Testament', lessons: [
        { title: 'Torah & History', summary: 'The covenant people.' },
        { title: 'Wisdom', summary: 'Proverbs and Job.' },
        { title: 'Prophets', summary: 'Hope and call.' },
      ], questions: [
        { id: '9-B-Q1-1', q: 'The Torah is the first ___ books.', type: 'mc', options: ['five', 'ten', 'two'], answer: 0 },
        { id: '9-B-Q1-2', q: 'Job shows faith in ___', type: 'mc', options: ['suffering', 'ease', 'riches'], answer: 0 },
      ]},
      { name: 'Q2 — New Testament', lessons: [
        { title: 'Gospels', summary: 'The good news.' },
        { title: 'Acts & Epistles', summary: 'The early church.' },
        { title: 'Revelation', summary: 'Hope fulfilled.' },
      ], questions: [
        { id: '9-B-Q2-1', q: 'The Gospels tell of ___', type: 'mc', options: ['Jesus', 'Moses', 'David'], answer: 0 },
        { id: '9-B-Q2-2', q: 'Revelation points to ___', type: 'mc', options: ['Christ’s return', 'nothing', 'war'], answer: 0 },
      ]},
      { name: 'Q3 — Theology', lessons: [
        { title: 'Attributes of God', summary: 'Holy, loving, just.' },
        { title: 'Salvation', summary: 'Grace alone.' },
        { title: 'Scripture', summary: 'God-breathed.' },
      ], questions: [
        { id: '9-B-Q3-1', q: 'Scripture is ___ by God.', type: 'mc', options: ['breathed', 'written', 'ignored'], answer: 0 },
        { id: '9-B-Q3-2', q: 'Salvation is a ___', type: 'mc', options: ['gift', 'wage', 'reward'], answer: 0 },
      ]},
      { name: 'Q4 — Worldview', lessons: [
        { title: 'Compare Worldviews', summary: 'Biblical vs others.' },
        { title: 'Apologetics', summary: 'Give a reason.' },
        { title: 'Life Calling', summary: 'Serve with your gifts.' },
      ], questions: [
        { id: '9-B-Q4-1', q: 'We defend our hope with ___', type: 'mc', options: ['gentleness', 'anger', 'force'], answer: 0 },
        { id: '9-B-Q4-2', q: 'Your gifts are for ___', type: 'mc', options: ['serving others', 'pride', 'hiding'], answer: 0 },
      ]},
    ]},
  ])

// ====================== 10TH GRADE ======================
export const G10: GradeCurriculum = g('10th Grade', 10, '15-16', 'Geometry, American literature, deeper roots.',
  [
    { name: 'Mathematics', units: [
      { name: 'Q1 — Euclidean Geometry', lessons: [
        { title: 'Points, Lines, Planes', summary: 'Building blocks.' },
        { title: 'Proofs', summary: 'Two-column logic.' },
        { title: 'Angles & Triangles', summary: 'Congruence.' },
      ], questions: [
        { id: '10-M-Q1-1', q: 'A triangle’s angles sum to ___°', type: 'short', answer: '180' },
        { id: '10-M-Q1-2', q: 'A two-column proof shows ___', type: 'mc', options: ['logic', 'guessing', 'art'], answer: 0 },
      ]},
      { name: 'Q2 — Congruence & Similarity', lessons: [
        { title: 'Triangle Theorems', summary: 'SSS, SAS, ASA.' },
        { title: 'Similar Figures', summary: 'Same shape, scale.' },
        { title: 'Right Triangles', summary: 'Pythagorean, trig intro.' },
      ], questions: [
        { id: '10-M-Q2-1', q: 'Pythagoras: a² + b² = ___', type: 'short', answer: 'c²' },
        { id: '10-M-Q2-2', q: 'Similar triangles have equal ___', type: 'mc', options: ['angles', 'sides', 'area'], answer: 0 },
      ]},
      { name: 'Q3 — Circles', lessons: [
        { title: 'Parts of a Circle', summary: 'Radius, chord, arc.' },
        { title: 'Angles in Circles', summary: 'Inscribed and central.' },
        { title: 'Area & Circumference', summary: 'πr², 2πr.' },
      ], questions: [
        { id: '10-M-Q3-1', q: 'Circumference = 2π___', type: 'short', answer: 'r' },
        { id: '10-M-Q3-2', q: 'A chord connects two points on the ___', type: 'mc', options: ['circle', 'line', 'square'], answer: 0 },
      ]},
      { name: 'Q4 — Coordinate Geometry', lessons: [
        { title: 'Distance Formula', summary: 'From Pythagorean.' },
        { title: 'Midpoint', summary: 'Average the points.' },
        { title: 'Parallel & Perpendicular', summary: 'Slopes.' },
      ], questions: [
        { id: '10-M-Q4-1', q: 'Midpoint averages the ___', type: 'mc', options: ['coordinates', 'slopes', 'areas'], answer: 0 },
        { id: '10-M-Q4-2', q: 'Perpendicular lines have ___ slopes.', type: 'mc', options: ['negative reciprocal', 'equal', 'zero'], answer: 0 },
      ]},
    ]},
    { name: 'Language Arts', units: [
      { name: 'Q1 — American Literature', lessons: [
        { title: 'Founding Era', summary: 'Letters and speeches.' },
        { title: 'Romanticism', summary: 'Nature and feeling.' },
        { title: 'Realism', summary: 'Life as it is.' },
      ], questions: [
        { id: '10-L-Q1-1', q: 'Realism shows life ___', type: 'mc', options: ['as it is', 'as fantasy', 'as myth'], answer: 0 },
        { id: '10-L-Q1-2', q: 'Early American writing valued ___', type: 'mc', options: ['liberty', 'silence', 'war'], answer: 0 },
      ]},
      { name: 'Q2 — Analysis', lessons: [
        { title: 'Close Reading', summary: 'Notice detail.' },
        { title: 'Historical Context', summary: 'When it was written.' },
        { title: 'Essay', summary: 'Argue with evidence.' },
      ], questions: [
        { id: '10-L-Q2-1', q: 'Close reading means ___', type: 'mc', options: ['noticing detail', 'skimming', 'guessing'], answer: 0 },
        { id: '10-L-Q2-2', q: 'Context helps you ___ a text.', type: 'mc', options: ['understand', 'ignore', 'fear'], answer: 0 },
      ]},
      { name: 'Q3 — Research', lessons: [
        { title: 'Synthesis', summary: 'Weave sources.' },
        { title: 'MLA', summary: 'Quotes and works cited.' },
        { title: 'Presentation', summary: 'Teach the class.' },
      ], questions: [
        { id: '10-L-Q3-1', q: 'Synthesis ___ sources into one point.', type: 'mc', options: ['weaves', 'copies', 'drops'], answer: 0 },
        { id: '10-L-Q3-2', q: 'Quote exactly and ___', type: 'mc', options: ['cite', 'forget', 'change'], answer: 0 },
      ]},
      { name: 'Q4 — Creative', lessons: [
        { title: 'Short Story', summary: 'Craft a tale.' },
        { title: 'Poetry', summary: 'Find your voice.' },
        { title: 'Drama', summary: 'Write for stage.' },
      ], questions: [
        { id: '10-L-Q4-1', q: 'A short story needs a ___', type: 'mc', options: ['conflict', 'list', 'joke'], answer: 0 },
        { id: '10-L-Q4-2', q: 'Write one line of original poetry.', type: 'short', answer: 'open' },
      ]},
    ]},
    { name: 'Spelling & Word Origins', units: [
      { name: 'Q1 — Latin Roots 8', lessons: [
        { title: 'List 1: cap, ped', summary: 'capture, capital, pedal, pedestrian.' },
        { title: 'Root: cap = "head/take"', summary: 'Latin "capere".' },
        { title: 'Root: ped = "foot"', summary: 'Latin "pes".' },
      ], questions: [
        { id: '10-SP-Q1-1', q: '"capital" relates to the ___', type: 'mc', options: ['head/city', 'foot', 'hand'], answer: 0 },
        { id: '10-SP-Q1-2', q: 'A "pedestrian" travels on ___', type: 'mc', options: ['foot', 'wheel', 'wing'], answer: 0 },
      ]},
      { name: 'Q2 — Greek Roots 8', lessons: [
        { title: 'List 2: cron, top', summary: 'chronicle, chronology, topic, topography.' },
        { title: 'Root: cron = "time" (var)', summary: 'Greek "chronos".' },
        { title: 'Root: top = "place"', summary: 'Greek "topos".' },
      ], questions: [
        { id: '10-SP-Q2-1', q: 'A "chronicle" records ___', type: 'mc', options: ['events in order', 'places', 'sounds'], answer: 0 },
        { id: '10-SP-Q2-2', q: '"topography" is the shape of ___', type: 'mc', options: ['place/land', 'time', 'sound'], answer: 0 },
      ]},
      { name: 'Q3 — Suffixes 3', lessons: [
        { title: 'List 3: -ity/-ness', summary: 'reality, ability, kindness, greatness.' },
        { title: 'Suffix: -ity = "state of"', summary: 'Latin "-itas".' },
        { title: 'Suffix: -ness = "quality"', summary: 'Old English.' },
      ], questions: [
        { id: '10-SP-Q3-1', q: '"ability" is the state of being ___', type: 'mc', options: ['able', 'kind', 'real'], answer: 0 },
        { id: '10-SP-Q3-2', q: 'Write a word ending in "-ness".', type: 'short', answer: 'open' },
      ]},
      { name: 'Q4 — Review', lessons: [
        { title: 'Master List', summary: 'Spell all year words.' },
        { title: 'Root Map', summary: 'cap, ped, cron, top, -ity, -ness.' },
        { title: 'Decode', summary: 'New word from roots.' },
      ], questions: [
        { id: '10-SP-Q4-1', q: 'Write a word with root "ped".', type: 'short', answer: 'open' },
        { id: '10-SP-Q4-2', q: 'Roots build ___ across subjects.', type: 'mc', options: ['vocabulary', 'nothing', 'confusion'], answer: 0 },
      ]},
    ]},
    { name: 'Science', units: [
      { name: 'Q1 — Biology II', lessons: [
        { title: 'Human Body', summary: 'Systems integrated.' },
        { title: 'Ecology', summary: 'Interdependence.' },
        { title: 'Biotech', summary: 'Tools of life.' },
      ], questions: [
        { id: '10-SC-Q1-1', q: 'The heart pumps ___', type: 'mc', options: ['blood', 'air', 'water'], answer: 0 },
        { id: '10-SC-Q1-2', q: 'Ecology studies how living things ___', type: 'mc', options: ['interact', 'separate', 'die'], answer: 0 },
      ]},
      { name: 'Q2 — Chemistry II', lessons: [
        { title: 'Thermo', summary: 'Heat in reactions.' },
        { title: 'Equilibrium', summary: 'Balance.' },
        { title: 'Nuclear', summary: 'Atoms split/join.' },
      ], questions: [
        { id: '10-SC-Q2-1', q: 'Nuclear fission ___ atoms.', type: 'mc', options: ['splits', 'joins', 'freezes'], answer: 0 },
        { id: '10-SC-Q2-2', q: 'Equilibrium is a ___', type: 'mc', options: ['balance', 'end', 'start'], answer: 0 },
      ]},
      { name: 'Q3 — Physics II', lessons: [
        { title: 'Momentum', summary: 'Mass × velocity.' },
        { title: 'Waves', summary: 'Sound, light, EM.' },
        { title: 'Modern', summary: 'Relativity intro.' },
      ], questions: [
        { id: '10-SC-Q3-1', q: 'Momentum = mass × ___', type: 'short', answer: 'velocity' },
        { id: '10-SC-Q3-2', q: 'Light is an EM ___', type: 'mc', options: ['wave', 'solid', 'gas'], answer: 0 },
      ]},
      { name: 'Q4 — Elective: Environmental', lessons: [
        { title: 'Ecosystems', summary: 'Balance and stress.' },
        { title: 'Energy Choices', summary: 'Costs and care.' },
        { title: 'Stewardship', summary: 'Biblical care.' },
      ], questions: [
        { id: '10-SC-Q4-1', q: 'We steward the earth because God ___ it.', type: 'mc', options: ['made', 'sold', 'forgot'], answer: 0 },
        { id: '10-SC-Q4-2', q: 'Wise energy use ___ the creation.', type: 'mc', options: ['cares for', 'wastes', 'harms'], answer: 0 },
      ]},
    ]},
    { name: 'History & Geography', units: [
      { name: 'Q1 — US History Deep', lessons: [
        { title: 'Constitutional Era', summary: 'Debates and compromise.' },
        { title: 'Expansion', summary: 'Land and conflict.' },
        { title: 'Civil War', summary: 'Cause and cost.' },
      ], questions: [
        { id: '10-H-Q1-1', q: 'The Constitution was a ___ of views.', type: 'mc', options: ['compromise', 'war', 'joke'], answer: 0 },
        { id: '10-H-Q1-2', q: 'The Civil War cost ___ lives.', type: 'mc', options: ['hundreds of thousands', 'none', 'few'], answer: 0 },
      ]},
      { name: 'Q2 — 20th Century', lessons: [
        { title: 'World War I & II', summary: 'Global conflict.' },
        { title: 'Cold War', summary: 'Standoff.' },
        { title: 'Civil Rights', summary: 'Justice.' },
      ], questions: [
        { id: '10-H-Q2-1', q: 'World War II ended in ___', type: 'mc', options: ['1945', '1918', '1969'], answer: 0 },
        { id: '10-H-Q2-2', q: 'Civil Rights sought ___ for all.', type: 'mc', options: ['equal dignity', 'war', 'taxes'], answer: 0 },
      ]},
      { name: 'Q3 — Geography', lessons: [
        { title: 'Physical', summary: 'Land, water, climate.' },
        { title: 'Human', summary: 'Where and why.' },
        { title: 'Geopolitics', summary: 'Place and power.' },
      ], questions: [
        { id: '10-H-Q3-1', q: 'Geopolitics links place and ___', type: 'mc', options: ['power', 'weather', 'art'], answer: 0 },
        { id: '10-H-Q3-2', q: 'People cluster near ___', type: 'mc', options: ['water and work', 'mountains', 'deserts'], answer: 0 },
      ]},
      { name: 'Q4 — Civics & Econ', lessons: [
        { title: 'How a Bill Becomes Law', summary: 'The process.' },
        { title: 'Court Cases', summary: 'Key decisions.' },
        { title: 'Personal Finance', summary: 'Stewardship.' },
      ], questions: [
        { id: '10-H-Q4-1', q: 'A bill needs the president’s ___ to become law.', type: 'mc', options: ['signature', 'ignore', 'veto only'], answer: 0 },
        { id: '10-H-Q4-2', q: 'Stewardship means ___ what God gave.', type: 'mc', options: ['managing', 'wasting', 'hiding'], answer: 0 },
      ]},
    ]},
    { name: 'Bible & Character', units: [
      { name: 'Q1 — Gospels', lessons: [
        { title: 'Synoptic Study', summary: 'Matthew, Mark, Luke.' },
        { title: 'John', summary: 'The Word made flesh.' },
        { title: 'Parables', summary: 'Kingdom truths.' },
      ], questions: [
        { id: '10-B-Q1-1', q: 'John calls Jesus the ___', type: 'mc', options: ['Word', 'king', 'prophet'], answer: 0 },
        { id: '10-B-Q1-2', q: 'The Synoptics are the first ___ Gospels.', type: 'mc', options: ['three', 'two', 'four'], answer: 0 },
      ]},
      { name: 'Q2 — Epistles', lessons: [
        { title: 'Paul', summary: 'Grace and unity.' },
        { title: 'General Epistles', summary: 'James, Peter, John.' },
        { title: 'Application', summary: 'Faith that works.' },
      ], questions: [
        { id: '10-B-Q2-1', q: 'James says faith without works is ___', type: 'mc', options: ['dead', 'strong', 'enough'], answer: 0 },
        { id: '10-B-Q2-2', q: 'Paul’s main theme is ___', type: 'mc', options: ['grace', 'law', 'wealth'], answer: 0 },
      ]},
      { name: 'Q3 — Ethics', lessons: [
        { title: 'Sexual Purity', summary: 'God’s design.' },
        { title: 'Honesty', summary: 'Truth in all.' },
        { title: 'Money', summary: 'Generous stewardship.' },
      ], questions: [
        { id: '10-B-Q3-1', q: 'We are to be ___ in all we do.', type: 'mc', options: ['honest', 'sly', 'silent'], answer: 0 },
        { id: '10-B-Q3-2', q: 'Money is a tool for ___', type: 'mc', options: ['stewardship', 'greed', 'pride'], answer: 0 },
      ]},
      { name: 'Q4 — Calling', lessons: [
        { title: 'Gifts', summary: 'Find and use them.' },
        { title: 'Vocation', summary: 'Work as worship.' },
        { title: 'Serve', summary: 'Lead by serving.' },
      ], questions: [
        { id: '10-B-Q4-1', q: 'Work done well is an act of ___', type: 'mc', options: ['worship', 'burden', 'chance'], answer: 0 },
        { id: '10-B-Q4-2', q: 'A leader should ___ others.', type: 'mc', options: ['serve', 'rule', 'use'], answer: 0 },
      ]},
    ]},
  ])

export const CURRICULUM_PART3b_9_10: GradeCurriculum[] = [G9, G10]
