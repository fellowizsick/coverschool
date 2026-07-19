// Larose Christian Academy — ORIGINAL Curriculum, Grade 6 (part 2c)
// Same 6-subject structure. Etymology explicit in Spelling & Word Origins.

import type { GradeCurriculum } from './curriculum'

const g = (
  grade: string,
  gradeNum: number,
  age: string,
  tagline: string,
  subjects: any
): GradeCurriculum => ({ grade, gradeNum, age, tagline, subjects })

// ====================== 6TH GRADE ======================
export const G6: GradeCurriculum = g('6th Grade', 6, '11-12', 'Bridge to middle school — independence.',
  [
    { name: 'Mathematics', units: [
      { name: 'Q1 — Ratios & Rates', lessons: [
        { title: 'Ratios', summary: 'Compare two quantities.' },
        { title: 'Unit Rates', summary: 'Per 1 unit (miles per hour).' },
        { title: 'Percent', summary: 'Out of 100; to decimal.' },
      ], questions: [
        { id: '6-M-Q1-1', q: 'What is 50% as a decimal?', type: 'mc', options: ['0.5', '0.05', '5.0'], answer: 0 },
        { id: '6-M-Q1-2', q: 'Ratio 2:3 means for every 2 of A there are ___ of B.', type: 'short', answer: '3' },
      ]},
      { name: 'Q2 — Fractions/Decimals/Percent', lessons: [
        { title: 'Convert All Three', summary: 'Move between forms.' },
        { title: 'Percent Problems', summary: 'Find 20% of 80.' },
        { title: 'Real Life', summary: 'Discounts, tax.' },
      ], questions: [
        { id: '6-M-Q2-1', q: '20% of 80 = ?', type: 'mc', options: ['16', '20', '8'], answer: 0 },
        { id: '6-M-Q2-2', q: '1/4 = ___%', type: 'short', answer: '25' },
      ]},
      { name: 'Q3 — Integers', lessons: [
        { title: 'Negative Numbers', summary: 'Below zero on a line.' },
        { title: 'Add/Sub Integers', summary: 'Same and different signs.' },
        { title: 'Coordinate Plane', summary: 'Four quadrants.' },
      ], questions: [
        { id: '6-M-Q3-1', q: '-4 + 9 = ?', type: 'mc', options: ['5', '-5', '13'], answer: 0 },
        { id: '6-M-Q3-2', q: 'The coordinate plane has ___ quadrants.', type: 'mc', options: ['4', '2', '6'], answer: 0 },
      ]},
      { name: 'Q4 — Expressions', lessons: [
        { title: 'Variables', summary: 'Letters stand for numbers.' },
        { title: 'Order of Operations', summary: 'PEMDAS.' },
        { title: 'Simple Equations', summary: 'Solve for x.' },
      ], questions: [
        { id: '6-M-Q4-1', q: '3 + 4 × 2 = ? (order of operations)', type: 'mc', options: ['11', '14', '20'], answer: 0 },
        { id: '6-M-Q4-2', q: 'If x + 5 = 12, then x = ___', type: 'short', answer: '7' },
      ]},
    ]},
    { name: 'Language Arts', units: [
      { name: 'Q1 — Reading', lessons: [
        { title: 'Theme & Symbol', summary: 'Deeper meaning.' },
        { title: 'Text Evidence', summary: 'Back claims with quotes.' },
        { title: 'Compare Authors', summary: 'Different views, same topic.' },
      ], questions: [
        { id: '6-L-Q1-1', q: 'A symbol stands for ___', type: 'mc', options: ['an idea', 'a color', 'a number'], answer: 0 },
        { id: '6-L-Q1-2', q: 'Good answers use ___ from the text.', type: 'mc', options: ['evidence', 'guesses', 'opinion only'], answer: 0 },
      ]},
      { name: 'Q2 — Grammar', lessons: [
        { title: 'Parts of Speech Review', summary: 'All eight, deep.' },
        { title: 'Active/Passive', summary: 'Who does the action.' },
        { title: 'Sentence Types', summary: 'Declarative, interrogative, imperative, exclamatory.' },
      ], questions: [
        { id: '6-L-Q2-1', q: '"Close the door!" is ___', type: 'mc', options: ['imperative', 'question', 'statement'], answer: 0 },
        { id: '6-L-Q2-2', q: 'In "The ball was thrown by Sam", the voice is ___', type: 'mc', options: ['passive', 'active', 'none'], answer: 0 },
      ]},
      { name: 'Q3 — Writing', lessons: [
        { title: 'Essay Structure', summary: 'Thesis, body, conclusion.' },
        { title: 'Revise & Edit', summary: 'Make it clear and correct.' },
        { title: 'Research', summary: 'Note-taking and citing.' },
      ], questions: [
        { id: '6-L-Q3-1', q: 'A thesis is the essay’s ___', type: 'mc', options: ['main claim', 'title', 'conclusion'], answer: 0 },
        { id: '6-L-Q3-2', q: 'Write a thesis for an essay on why reading matters.', type: 'short', answer: 'open' },
      ]},
      { name: 'Q4 — Speaking', lessons: [
        { title: 'Oral Report', summary: 'Present with confidence.' },
        { title: 'Debate', summary: 'State and defend a view.' },
        { title: 'Listening', summary: 'Take notes from a talk.' },
      ], questions: [
        { id: '6-L-Q4-1', q: 'In a debate you ___ your view.', type: 'mc', options: ['defend', 'hide', 'drop'], answer: 0 },
        { id: '6-L-Q4-2', q: 'Good listening means ___', type: 'mc', options: ['paying attention', 'talking over', 'leaving'], answer: 0 },
      ]},
    ]},
    { name: 'Spelling & Word Origins', units: [
      { name: 'Q1 — Latin Roots 4', lessons: [
        { title: 'List 1: duct, form', summary: 'conduct, deduct, reform, format.' },
        { title: 'Root: duct = "lead"', summary: 'Latin "ducere".' },
        { title: 'Root: form = "shape"', summary: 'Latin "forma".' },
      ], questions: [
        { id: '6-SP-Q1-1', q: '"conduct" means to ___', type: 'mc', options: ['lead', 'shape', 'say'], answer: 0 },
        { id: '6-SP-Q1-2', q: '"reform" means to ___ again.', type: 'mc', options: ['shape/improve', 'lead', 'write'], answer: 0 },
      ]},
      { name: 'Q2 — Greek Roots 4', lessons: [
        { title: 'List 2: meter, scope', summary: 'thermometer, diameter, telescope, microscope.' },
        { title: 'Root: meter = "measure"', summary: 'Greek "metron".' },
        { title: 'Root: scope = "see/observe"', summary: 'Greek "skopein".' },
      ], questions: [
        { id: '6-SP-Q2-1', q: 'A "thermometer" measures ___', type: 'mc', options: ['heat', 'light', 'sound'], answer: 0 },
        { id: '6-SP-Q2-2', q: 'A "telescope" lets you ___ far away.', type: 'mc', options: ['see', 'measure', 'hear'], answer: 0 },
      ]},
      { name: 'Q3 — Prefixes 2', lessons: [
        { title: 'List 3: sub-, inter-, trans-', summary: 'subway, interact, transport.' },
        { title: 'Prefix: sub- = "under"', summary: 'Latin "sub".' },
        { title: 'Prefix: inter- = "between"', summary: 'Latin "inter".' },
      ], questions: [
        { id: '6-SP-Q3-1', q: '"subway" runs ___ the ground.', type: 'mc', options: ['under', 'over', 'around'], answer: 0 },
        { id: '6-SP-Q3-2', q: '"interact" means to act ___ people.', type: 'mc', options: ['between/with', 'against', 'without'], answer: 0 },
      ]},
      { name: 'Q4 — Review', lessons: [
        { title: 'Master List', summary: 'Spell all year words.' },
        { title: 'Root Map', summary: 'duct, form, meter, scope, sub-, inter-.' },
        { title: 'Decode Challenge', summary: 'New word from roots.' },
      ], questions: [
        { id: '6-SP-Q4-1', q: 'Write a word with root "meter".', type: 'short', answer: 'open' },
        { id: '6-SP-Q4-2', q: 'A prefix goes ___ the root.', type: 'mc', options: ['before', 'after', 'inside'], answer: 0 },
      ]},
    ]},
    { name: 'Science', units: [
      { name: 'Q1 — Cell Biology', lessons: [
        { title: 'Cell Parts', summary: 'Nucleus, mitochondria, etc.' },
        { title: 'Photosynthesis', summary: 'Plants make sugar.' },
        { title: 'Classification', summary: 'Kingdoms of life.' },
      ], questions: [
        { id: '6-SC-Q1-1', q: 'Photosynthesis happens in ___', type: 'mc', options: ['leaves', 'roots', 'stems'], answer: 0 },
        { id: '6-SC-Q1-2', q: 'The "powerhouse" of the cell is the ___', type: 'mc', options: ['mitochondria', 'nucleus', 'wall'], answer: 0 },
      ]},
      { name: 'Q2 — Earth', lessons: [
        { title: 'Rock Cycle', summary: 'Rocks change over time.' },
        { title: 'Fossils', summary: 'Records of the past.' },
        { title: 'Natural Resources', summary: 'Renewable vs not.' },
      ], questions: [
        { id: '6-SC-Q2-1', q: 'Fossils are ___ of past life.', type: 'mc', options: ['records', 'pictures', 'toys'], answer: 0 },
        { id: '6-SC-Q2-2', q: 'Solar power is ___', type: 'mc', options: ['renewable', 'nonrenewable', 'finite'], answer: 0 },
      ]},
      { name: 'Q3 — Space', lessons: [
        { title: 'Solar System', summary: 'Deep dive on planets.' },
        { title: 'Stars & Galaxies', summary: 'Beyond the sun.' },
        { title: 'Space Exploration', summary: 'Rovers, telescopes.' },
      ], questions: [
        { id: '6-SC-Q3-1', q: 'Our galaxy is the ___', type: 'mc', options: ['Milky Way', 'Andromeda', 'Pinwheel'], answer: 0 },
        { id: '6-SC-Q3-2', q: 'A rover explores ___', type: 'mc', options: ['planets', 'oceans', 'clouds'], answer: 0 },
      ]},
      { name: 'Q4 — Engineering', lessons: [
        { title: 'Design Process', summary: 'Ask, imagine, plan, build, test.' },
        { title: 'Bridges', summary: 'Forces in structures.' },
        { title: 'Green Tech', summary: 'Solving with care.' },
      ], questions: [
        { id: '6-SC-Q4-1', q: 'The design process ends with ___', type: 'mc', options: ['testing', 'guessing', 'stopping'], answer: 0 },
        { id: '6-SC-Q4-2', q: 'Engineers solve problems by ___', type: 'mc', options: ['building and testing', 'wishing', 'waiting'], answer: 0 },
      ]},
    ]},
    { name: 'History & Geography', units: [
      { name: 'Q1 — Ancient Civilizations', lessons: [
        { title: 'Mesopotamia', summary: 'First cities.' },
        { title: 'Egypt', summary: 'Nile and pyramids.' },
        { title: 'Greece', summary: 'Democracy’s start.' },
      ], questions: [
        { id: '6-H-Q1-1', q: 'Democracy began in ___', type: 'mc', options: ['Greece', 'Egypt', 'Rome'], answer: 0 },
        { id: '6-H-Q1-2', q: 'The Nile River is in ___', type: 'mc', options: ['Egypt', 'Greece', 'China'], answer: 0 },
      ]},
      { name: 'Q2 — Rome', lessons: [
        { title: 'Republic', summary: 'Representative rule.' },
        { title: 'Empire', summary: 'Growth and roads.' },
        { title: 'Fall & Legacy', summary: 'What lasted.' },
      ], questions: [
        { id: '6-H-Q2-1', q: 'Rome began as a ___', type: 'mc', options: ['republic', 'empire', 'kingdom'], answer: 0 },
        { id: '6-H-Q2-2', q: 'Roman ___ spread across the empire.', type: 'mc', options: ['roads', 'rivers', 'mountains'], answer: 0 },
      ]},
      { name: 'Q3 — World Geography', lessons: [
        { title: 'Continents & Oceans', summary: 'All seven and five.' },
        { title: 'Climate Zones', summary: 'Tropical to polar.' },
        { title: 'Culture Regions', summary: 'How people live worldwide.' },
      ], questions: [
        { id: '6-H-Q3-1', q: 'The largest ocean is the ___', type: 'mc', options: ['Pacific', 'Atlantic', 'Indian'], answer: 0 },
        { id: '6-H-Q3-2', q: 'Tropical climates are ___', type: 'mc', options: ['warm', 'cold', 'icy'], answer: 0 },
      ]},
      { name: 'Q4 — US Before 1800', lessons: [
        { title: 'Indigenous Nations', summary: 'Many peoples, many homes.' },
        { title: 'Colonies', summary: 'Life and conflict.' },
        { title: 'A New Nation', summary: '1787 to 1800.' },
      ], questions: [
        { id: '6-H-Q4-1', q: 'Before Europeans, America was home to ___', type: 'mc', options: ['indigenous nations', 'no one', 'one tribe'], answer: 0 },
        { id: '6-H-Q4-2', q: 'The Constitution was written in ___', type: 'short', answer: '1787' },
      ]},
    ]},
    { name: 'Bible & Character', units: [
      { name: 'Q1 — Genesis', lessons: [
        { title: 'Creation', summary: 'God made all good.' },
        { title: 'Fall', summary: 'Why the world is broken.' },
        { title: 'Promise', summary: 'A people chosen to bless the world.' },
      ], questions: [
        { id: '6-B-Q1-1', q: 'God made the world in ___ days.', type: 'mc', options: ['6', '7', '1'], answer: 0 },
        { id: '6-B-Q1-2', q: 'The promise was to ___ all nations.', type: 'mc', options: ['bless', 'rule', 'forget'], answer: 0 },
      ]},
      { name: 'Q2 — The Exile', lessons: [
        { title: 'Why Exile', summary: 'Turning from God.' },
        { title: 'Hope in Captivity', summary: 'God stays with His people.' },
        { title: 'Return', summary: 'Rebuilding.' },
      ], questions: [
        { id: '6-B-Q2-1', q: 'Even in exile, God ___ His people.', type: 'mc', options: ['stayed with', 'forgot', 'left'], answer: 0 },
        { id: '6-B-Q2-2', q: 'The people were sent away because they ___', type: 'mc', options: ['turned from God', 'built a wall', 'won a war'], answer: 0 },
      ]},
      { name: 'Q3 — The Gospels', lessons: [
        { title: 'Four Books', summary: 'Matthew, Mark, Luke, John.' },
        { title: 'Kingdom of God', summary: 'Upside-down greatness.' },
        { title: 'The Cross', summary: 'Love to the end.' },
      ], questions: [
        { id: '6-B-Q3-1', q: 'There are ___ Gospels.', type: 'mc', options: ['4', '3', '2'], answer: 0 },
        { id: '6-B-Q3-2', q: 'Jesus said the greatest is the ___', type: 'mc', options: ['servant', 'ruler', 'richest'], answer: 0 },
      ]},
      { name: 'Q4 — Character in Action', lessons: [
        { title: 'Integrity', summary: 'Do right when alone.' },
        { title: 'Humility', summary: 'Count others first.' },
        { title: 'Courage', summary: 'Stand for truth.' },
      ], questions: [
        { id: '6-B-Q4-1', q: 'Integrity means doing right ___', type: 'mc', options: ['even when alone', 'only when watched', 'never'], answer: 0 },
        { id: '6-B-Q4-2', q: 'Humility puts others ___', type: 'mc', options: ['first', 'last', 'out'], answer: 0 },
      ]},
    ]},
  ])

export const CURRICULUM_PART2c: GradeCurriculum[] = [G6]
