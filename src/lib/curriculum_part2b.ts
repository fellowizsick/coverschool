// Larose Christian Academy — ORIGINAL Curriculum, Grades 4-6 (part 2b)
// Same 6-subject structure. Etymology explicit in Spelling & Word Origins.

import type { GradeCurriculum } from './curriculum'

const g = (
  grade: string,
  gradeNum: number,
  age: string,
  tagline: string,
  subjects: any
): GradeCurriculum => ({ grade, gradeNum, age, tagline, subjects })

// ====================== 4TH GRADE ======================
export const G4: GradeCurriculum = g('4th Grade', 4, '9-10', 'Multi-step thinking, deeper roots.',
  [
    { name: 'Mathematics', units: [
      { name: 'Q1 — Big Numbers', lessons: [
        { title: 'Numbers to 1,000,000', summary: 'Place value through millions.' },
        { title: 'Rounding', summary: 'To nearest 10, 100, 1000.' },
        { title: 'Multi-Step Problems', summary: 'More than one operation.' },
      ], questions: [
        { id: '4-M-Q1-1', q: 'Round 4,782 to nearest hundred.', type: 'mc', options: ['4,800', '4,700', '4,780'], answer: 0 },
        { id: '4-M-Q1-2', q: 'In 352,918, the 5 is in the ___ place.', type: 'mc', options: ['ten thousands', 'thousands', 'hundreds'], answer: 0 },
      ]},
      { name: 'Q2 — Fractions & Decimals', lessons: [
        { title: 'Add/Sub Fractions', summary: 'Common denominator.' },
        { title: 'Decimals to Tenths', summary: '0.1 = one tenth.' },
        { title: 'Fractions = Decimals', summary: '1/2 = 0.5.' },
      ], questions: [
        { id: '4-M-Q2-1', q: '0.5 = which fraction?', type: 'mc', options: ['1/2', '1/4', '1/10'], answer: 0 },
        { id: '4-M-Q2-2', q: '2/4 = ___ (simplified).', type: 'short', answer: '1/2' },
      ]},
      { name: 'Q3 — Geometry', lessons: [
        { title: 'Angles', summary: 'Acute, right, obtuse.' },
        { title: 'Lines & Symmetry', summary: 'Parallel, perpendicular, mirror.' },
        { title: 'Area & Perimeter', summary: 'Complex shapes.' },
      ], questions: [
        { id: '4-M-Q3-1', q: 'A right angle is ___ degrees.', type: 'mc', options: ['90', '45', '180'], answer: 0 },
        { id: '4-M-Q3-2', q: 'Parallel lines never ___', type: 'mc', options: ['meet', 'exist', 'bend'], answer: 0 },
      ]},
      { name: 'Q4 — Data', lessons: [
        { title: 'Line Plots', summary: 'Show data on a number line.' },
        { title: 'Mean & Mode', summary: 'Basic averages.' },
        { title: 'Probability', summary: 'Likely, unlikely, certain.' },
      ], questions: [
        { id: '4-M-Q4-1', q: 'The mean is the ___', type: 'mc', options: ['average', 'biggest', 'smallest'], answer: 0 },
        { id: '4-M-Q4-2', q: 'The sun rising tomorrow is ___', type: 'mc', options: ['certain', 'impossible', 'unlikely'], answer: 0 },
      ]},
    ]},
    { name: 'Language Arts', units: [
      { name: 'Q1 — Reading', lessons: [
        { title: 'Theme', summary: 'The message behind the story.' },
        { title: 'Inference', summary: 'Read between the lines.' },
        { title: 'Character Traits', summary: 'Show, don’t tell.' },
      ], questions: [
        { id: '4-L-Q1-1', q: 'Theme is the ___ of a story.', type: 'mc', options: ['message', 'title', 'length'], answer: 0 },
        { id: '4-L-Q1-2', q: 'An inference is a ___', type: 'mc', options: ['smart guess', 'fact', 'spelling'], answer: 0 },
      ]},
      { name: 'Q2 — Grammar', lessons: [
        { title: 'Prepositions', summary: 'Words showing position.' },
        { title: 'Conjunctions', summary: 'and, but, or, because.' },
        { title: 'Comma Rules', summary: 'Series, dates, addresses.' },
      ], questions: [
        { id: '4-L-Q2-1', q: 'Which is a conjunction?', type: 'mc', options: ['and', 'under', 'quickly'], answer: 0 },
        { id: '4-L-Q2-2', q: 'Use a comma between items in a ___', type: 'mc', options: ['list', 'sentence', 'word'], answer: 0 },
      ]},
      { name: 'Q3 — Writing', lessons: [
        { title: 'Five-Paragraph Essay', summary: 'Intro, 3 body, conclusion.' },
        { title: 'Research Report', summary: 'Gather facts, cite simply.' },
        { title: 'Narrative Voice', summary: 'First vs third person.' },
      ], questions: [
        { id: '4-L-Q3-1', q: 'A 5-paragraph essay has ___ body paragraphs.', type: 'mc', options: ['3', '5', '1'], answer: 0 },
        { id: '4-L-Q3-2', q: 'Write a strong opening sentence for a report on dogs.', type: 'short', answer: 'open' },
      ]},
      { name: 'Q4 — Poetry & Drama', lessons: [
        { title: 'Forms of Poems', summary: 'Haiku, cinquain, free verse.' },
        { title: 'Figurative Language', summary: 'Simile, metaphor, personification.' },
        { title: 'Perform a Play', summary: 'Read with expression.' },
      ], questions: [
        { id: '4-L-Q4-1', q: '"The wind whispered" is ___', type: 'mc', options: ['personification', 'simile', 'fact'], answer: 0 },
        { id: '4-L-Q4-2', q: 'A simile uses ___ or "as".', type: 'mc', options: ['like', 'is', 'was'], answer: 0 },
      ]},
    ]},
    { name: 'Spelling & Word Origins', units: [
      { name: 'Q1 — Greek Roots 2', lessons: [
        { title: 'List 1: chron, geo', summary: 'chronology, chronic, geography, geology.' },
        { title: 'Root: chron = "time"', summary: 'Greek "chronos".' },
        { title: 'Root: geo = "earth"', summary: 'Greek "ge".' },
      ], questions: [
        { id: '4-SP-Q1-1', q: '"chronology" is about ___', type: 'mc', options: ['time order', 'earth', 'sound'], answer: 0 },
        { id: '4-SP-Q1-2', q: '"geography" is about ___', type: 'mc', options: ['earth', 'time', 'writing'], answer: 0 },
      ]},
      { name: 'Q2 — Latin Roots 2', lessons: [
        { title: 'List 2: port, struct', summary: 'transport, export, construct, structure.' },
        { title: 'Root: port = "carry"', summary: 'Latin "portare".' },
        { title: 'Root: struct = "build"', summary: 'Latin "struere".' },
      ], questions: [
        { id: '4-SP-Q2-1', q: '"transport" means to ___ from place to place.', type: 'mc', options: ['carry', 'build', 'say'], answer: 0 },
        { id: '4-SP-Q2-2', q: '"construct" means to ___', type: 'mc', options: ['build', 'carry', 'write'], answer: 0 },
      ]},
      { name: 'Q3 — Suffixes', lessons: [
        { title: 'List 3: -tion/-able', summary: 'nation, action, readable, breakable.' },
        { title: 'Suffix: -tion = "act of"', summary: 'From Latin "-tio".' },
        { title: 'Suffix: -able = "can be"', summary: 'Old French "-able".' },
      ], questions: [
        { id: '4-SP-Q3-1', q: '"readable" means it can be ___', type: 'mc', options: ['read', 'written', 'built'], answer: 0 },
        { id: '4-SP-Q3-2', q: '"action" is the act of ___', type: 'mc', options: ['acting', 'building', 'carrying'], answer: 0 },
      ]},
      { name: 'Q4 — Review', lessons: [
        { title: 'Master List', summary: 'Spell all year words.' },
        { title: 'Root Map', summary: 'chron, geo, port, struct, -tion, -able.' },
        { title: 'Decode', summary: 'Break an unfamiliar word into root + affix.' },
      ], questions: [
        { id: '4-SP-Q4-1', q: 'Write a word with root "struct".', type: 'short', answer: 'open' },
        { id: '4-SP-Q4-2', q: 'Breaking words into roots helps you ___', type: 'mc', options: ['understand them', 'forget them', 'misspell'], answer: 0 },
      ]},
    ]},
    { name: 'Science', units: [
      { name: 'Q1 — Cells & Systems', lessons: [
        { title: 'Plant vs Animal Cells', summary: 'Parts and differences.' },
        { title: 'Body Systems', summary: 'Digestive, circulatory intro.' },
        { title: 'Healthy Body', summary: 'Nutrition and exercise.' },
      ], questions: [
        { id: '4-SC-Q1-1', q: 'The heart is part of the ___ system.', type: 'mc', options: ['circulatory', 'digestive', 'skeletal'], answer: 0 },
        { id: '4-SC-Q1-2', q: 'Animal cells have a ___ (plant cells also have walls).', type: 'mc', options: ['membrane', 'vacuum', 'core'], answer: 0 },
      ]},
      { name: 'Q2 — Energy', lessons: [
        { title: 'Forms of Energy', summary: 'Light, heat, sound, electrical.' },
        { title: 'Conductors/Insulators', summary: 'How heat/electricity move.' },
        { title: 'Circuits', summary: 'Closed loop lights a bulb.' },
      ], questions: [
        { id: '4-SC-Q2-1', q: 'A closed loop lets ___ flow.', type: 'mc', options: ['electricity', 'water', 'air'], answer: 0 },
        { id: '4-SC-Q2-2', q: 'Metal is a good ___ of heat.', type: 'mc', options: ['conductor', 'insulator', 'blocker'], answer: 0 },
      ]},
      { name: 'Q3 — Earth Systems', lessons: [
        { title: 'Plate Tectonics', summary: 'Moving crust, earthquakes.' },
        { title: 'Volcanoes', summary: 'Why they erupt.' },
        { title: 'Weathering', summary: 'Rocks break down over time.' },
      ], questions: [
        { id: '4-SC-Q3-1', q: 'Earth’s crust is broken into ___', type: 'mc', options: ['plates', 'balls', 'rings'], answer: 0 },
        { id: '4-SC-Q3-2', q: 'A volcano ___ lava.', type: 'mc', options: ['erupts', 'eats', 'freezes'], answer: 0 },
      ]},
      { name: 'Q4 — Space & Weather', lessons: [
        { title: 'Moon & Tides', summary: 'Moon pull affects oceans.' },
        { title: 'Eclipses', summary: 'Shadow play.' },
        { title: 'Severe Weather', summary: 'Storms and safety.' },
      ], questions: [
        { id: '4-SC-Q4-1', q: 'The moon’s pull helps make ___', type: 'mc', options: ['tides', 'rain', 'wind'], answer: 0 },
        { id: '4-SC-Q4-2', q: 'During a storm, stay ___', type: 'mc', options: ['indoors', 'outside', 'in water'], answer: 0 },
      ]},
    ]},
    { name: 'History & Geography', units: [
      { name: 'Q1 — Early People', lessons: [
        { title: 'Ancient Cultures', summary: 'Egypt, Mesopotamia intro.' },
        { title: 'Maps of Old World', summary: 'Where civilizations grew.' },
        { title: 'Inventions', summary: 'Writing, wheel, farming.' },
      ], questions: [
        { id: '4-H-Q1-1', q: 'The wheel was invented in ___ times.', type: 'mc', options: ['ancient', 'modern', 'future'], answer: 0 },
        { id: '4-H-Q1-2', q: 'Writing was first used to ___', type: 'mc', options: ['keep records', 'tell jokes', 'draw'], answer: 0 },
      ]},
      { name: 'Q2 — Exploration', lessons: [
        { title: 'Age of Exploration', summary: 'Ships cross oceans.' },
        { title: 'Columbus', summary: '1492 and its meaning.' },
        { title: 'Exchange of Worlds', summary: 'Plants, animals, ideas.' },
      ], questions: [
        { id: '4-H-Q2-1', q: 'Columbus sailed in ___', type: 'mc', options: ['1492', '1776', '1865'], answer: 0 },
        { id: '4-H-Q2-2', q: 'Exploration brought ___ between continents.', type: 'mc', options: ['exchange', 'silence', 'war only'], answer: 0 },
      ]},
      { name: 'Q3 — Government', lessons: [
        { title: 'Constitution', summary: 'The plan for our country.' },
        { title: 'Bill of Rights', summary: 'First 10 freedoms.' },
        { title: 'Elections', summary: 'How leaders are chosen.' },
      ], questions: [
        { id: '4-H-Q3-1', q: 'The Bill of Rights has ___ amendments.', type: 'mc', options: ['10', '5', '27'], answer: 0 },
        { id: '4-H-Q3-2', q: 'We choose leaders by ___', type: 'mc', options: ['voting', 'fighting', 'lottery'], answer: 0 },
      ]},
      { name: 'Q4 — Alabama History', lessons: [
        { title: 'State Symbols', summary: 'Camellia, yellowhammer.' },
        { title: 'Famous Alabamians', summary: 'Age-fit heroes.' },
        { title: 'Civic Duty', summary: 'How we serve our state.' },
      ], questions: [
        { id: '4-H-Q4-1', q: 'The state flower of Alabama is the ___', type: 'mc', options: ['camellia', 'rose', 'tulip'], answer: 0 },
        { id: '4-H-Q4-2', q: 'Name one way to serve your state.', type: 'short', answer: 'open' },
      ]},
    ]},
    { name: 'Bible & Character', units: [
      { name: 'Q1 — Exodus', lessons: [
        { title: 'Moses & Pharaoh', summary: 'God frees His people.' },
        { title: 'The Ten Commandments', summary: 'God’s good rules.' },
        { title: 'Wilderness', summary: 'Trust in the desert.' },
      ], questions: [
        { id: '4-B-Q1-1', q: 'God gave Moses the ___ commandments.', type: 'mc', options: ['10', '5', '12'], answer: 0 },
        { id: '4-B-Q1-2', q: 'The people were freed from ___', type: 'mc', options: ['slavery', 'school', 'hunger'], answer: 0 },
      ]},
      { name: 'Q2 — Wisdom Books', lessons: [
        { title: 'Proverbs', summary: 'Practical Godly wisdom.' },
        { title: 'Ecclesiastes', summary: 'Meaning beyond things.' },
        { title: 'Job', summary: 'Trust in suffering.' },
      ], questions: [
        { id: '4-B-Q2-1', q: 'Proverbs gives ___', type: 'mc', options: ['wisdom', 'jokes', 'maps'], answer: 0 },
        { id: '4-B-Q2-2', q: 'Even in pain, Job ___ God.', type: 'mc', options: ['trusted', 'left', 'hated'], answer: 0 },
      ]},
      { name: 'Q3 — Gospels', lessons: [
        { title: 'Birth & Ministry', summary: 'Jesus’ life on earth.' },
        { title: 'Miracles', summary: 'Power over nature, sickness.' },
        { title: 'Parables', summary: 'Truth in stories.' },
      ], questions: [
        { id: '4-B-Q3-1', q: 'Jesus’ teachings are called ___', type: 'mc', options: ['parables', 'laws', 'poems'], answer: 0 },
        { id: '4-B-Q3-2', q: 'Jesus healed the ___', type: 'mc', options: ['sick', 'rich only', 'kings'], answer: 0 },
      ]},
      { name: 'Q4 — Fruit of the Spirit', lessons: [
        { title: 'The Nine Fruits', summary: 'Love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, self-control.' },
        { title: 'Practice One', summary: 'Pick a fruit to grow.' },
        { title: 'By the Spirit', summary: 'God helps us change.' },
      ], questions: [
        { id: '4-B-Q4-1', q: 'Self-control is a fruit of the ___', type: 'mc', options: ['Spirit', 'body', 'school'], answer: 0 },
        { id: '4-B-Q4-2', q: 'Name one fruit of the Spirit.', type: 'short', answer: 'open' },
      ]},
    ]},
  ])

// ====================== 5TH GRADE ======================
export const G5: GradeCurriculum = g('5th Grade', 5, '10-11', 'Prepping for middle-school rigor.',
  [
    { name: 'Mathematics', units: [
      { name: 'Q1 — Decimals', lessons: [
        { title: 'To Hundredths', summary: '0.25, 1.50, etc.' },
        { title: 'Add/Sub Decimals', summary: 'Line up the point.' },
        { title: 'Multiply Decimals', summary: 'By whole numbers.' },
      ], questions: [
        { id: '5-M-Q1-1', q: '0.3 + 0.4 = ?', type: 'mc', options: ['0.7', '0.07', '7.0'], answer: 0 },
        { id: '5-M-Q1-2', q: '0.5 × 2 = ?', type: 'short', answer: '1.0' },
      ]},
      { name: 'Q2 — Fractions', lessons: [
        { title: 'Multiply Fractions', summary: 'Top×top, bottom×bottom.' },
        { title: 'Divide Fractions', summary: 'Flip and multiply.' },
        { title: 'Mixed Numbers', summary: 'Convert and compute.' },
      ], questions: [
        { id: '5-M-Q2-1', q: '1/2 × 1/3 = ?', type: 'mc', options: ['1/6', '1/5', '2/5'], answer: 0 },
        { id: '5-M-Q2-2', q: 'To divide fractions, ___ the second and multiply.', type: 'mc', options: ['flip', 'double', 'drop'], answer: 0 },
      ]},
      { name: 'Q3 — Volume', lessons: [
        { title: 'Cubic Units', summary: 'Length × width × height.' },
        { title: 'Rectangular Prisms', summary: 'Find the volume.' },
        { title: 'Word Problems', summary: 'Boxes and tanks.' },
      ], questions: [
        { id: '5-M-Q3-1', q: 'Volume of 2×3×4 prism?', type: 'mc', options: ['24', '18', '9'], answer: 0 },
        { id: '5-M-Q3-2', q: 'Volume measures ___ space.', type: 'mc', options: ['3D', 'flat', 'round'], answer: 0 },
      ]},
      { name: 'Q4 — Coordinate Plane', lessons: [
        { title: 'Ordered Pairs', summary: '(x, y) on a grid.' },
        { title: 'Graphing Points', summary: 'Plot and read.' },
        { title: 'Patterns', summary: 'Rules and sequences.' },
      ], questions: [
        { id: '5-M-Q4-1', q: 'The point (3, 2) is ___', type: 'mc', options: ['3 right, 2 up', '2 right, 3 up', '3 down'], answer: 0 },
        { id: '5-M-Q4-2', q: 'The first number in (x,y) is the ___', type: 'mc', options: ['x', 'y', 'z'], answer: 0 },
      ]},
    ]},
    { name: 'Language Arts', units: [
      { name: 'Q1 — Reading', lessons: [
        { title: 'Point of View', summary: 'Who is telling it.' },
        { title: 'Compare Texts', summary: 'Same topic, different angle.' },
        { title: 'Author’s Purpose', summary: 'P.I.E. — persuade, inform, entertain.' },
      ], questions: [
        { id: '5-L-Q1-1', q: 'P.I.E. stands for persuade, inform, ___', type: 'mc', options: ['entertain', 'explain', 'erase'], answer: 0 },
        { id: '5-L-Q1-2', q: '"I went to the store" is ___ person.', type: 'mc', options: ['first', 'second', 'third'], answer: 0 },
      ]},
      { name: 'Q2 — Grammar', lessons: [
        { title: 'Verb Tenses Deep', summary: 'Perfect tenses intro.' },
        { title: 'Relative Pronouns', summary: 'who, whom, which, that.' },
        { title: 'Quotation Marks', summary: 'Punctuate speech.' },
      ], questions: [
        { id: '5-L-Q2-1', q: 'Which is a relative pronoun?', type: 'mc', options: ['which', 'run', 'blue'], answer: 0 },
        { id: '5-L-Q2-2', q: 'Use ___ marks around spoken words.', type: 'mc', options: ['quotation', 'comma', 'dash'], answer: 0 },
      ]},
      { name: 'Q3 — Writing', lessons: [
        { title: 'Persuasive Essay', summary: 'Claim, evidence, counter.' },
        { title: 'Narrative Craft', summary: 'Dialogue, pacing.' },
        { title: 'Research Paper', summary: 'Thesis, sources, bibliography.' },
      ], questions: [
        { id: '5-L-Q3-1', q: 'A persuasive essay needs a ___', type: 'mc', options: ['claim', 'joke', 'list'], answer: 0 },
        { id: '5-L-Q3-2', q: 'Write one claim about why kids should read.', type: 'short', answer: 'open' },
      ]},
      { name: 'Q4 — Vocabulary', lessons: [
        { title: 'Synonyms/Antonyms', summary: 'Word relationships.' },
        { title: 'Homophones', summary: 'their/there/they’re.' },
        { title: 'Figures of Speech', summary: 'Idioms and meaning.' },
      ], questions: [
        { id: '5-L-Q4-1', q: '"Their", "there", "they’re" are ___', type: 'mc', options: ['homophones', 'synonyms', 'antonyms'], answer: 0 },
        { id: '5-L-Q4-2', q: 'An idiom’s meaning is ___', type: 'mc', options: ['not literal', 'always exact', 'a fact'], answer: 0 },
      ]},
    ]},
    { name: 'Spelling & Word Origins', units: [
      { name: 'Q1 — Latin Roots 3', lessons: [
        { title: 'List 1: cred, spect (review)', summary: 'credit, incredible, spectator, inspect.' },
        { title: 'Root: cred = "believe"', summary: 'Latin "credere".' },
        { title: 'Root review: spect', summary: 'Look (seen in 3rd).' },
      ], questions: [
        { id: '5-SP-Q1-1', q: '"incredible" means not ___', type: 'mc', options: ['believable', 'seeable', 'writable'], answer: 0 },
        { id: '5-SP-Q1-2', q: 'A "spectator" ___ something.', type: 'mc', options: ['watches', 'writes', 'sings'], answer: 0 },
      ]},
      { name: 'Q2 — Greek Roots 3', lessons: [
        { title: 'List 2: bio, log', summary: 'biology, biography, logic, dialogue.' },
        { title: 'Root: bio = "life"', summary: 'Greek "bios".' },
        { title: 'Root: log = "word/study"', summary: 'Greek "logos".' },
      ], questions: [
        { id: '5-SP-Q2-1', q: '"biology" is the study of ___', type: 'mc', options: ['life', 'words', 'earth'], answer: 0 },
        { id: '5-SP-Q2-2', q: '"dialogue" is a ___ of words.', type: 'mc', options: ['conversation', 'book', 'sound'], answer: 0 },
      ]},
      { name: 'Q3 — Suffixes 2', lessons: [
        { title: 'List 3: -ist/-ous', summary: 'scientist, artist, famous, generous.' },
        { title: 'Suffix: -ist = "one who"', summary: 'From Greek "-istes".' },
        { title: 'Suffix: -ous = "full of"', summary: 'Latin "-osus".' },
      ], questions: [
        { id: '5-SP-Q3-1', q: 'An "artist" is one who ___', type: 'mc', options: ['makes art', 'writes', 'builds'], answer: 0 },
        { id: '5-SP-Q3-2', q: '"famous" means full of ___', type: 'mc', options: ['fame', 'fear', 'food'], answer: 0 },
      ]},
      { name: 'Q4 — Review', lessons: [
        { title: 'Master List', summary: 'Spell all year words.' },
        { title: 'Root Map', summary: 'cred, bio, log, -ist, -ous.' },
        { title: 'Decode Challenge', summary: 'Guess meaning of a brand-new word.' },
      ], questions: [
        { id: '5-SP-Q4-1', q: 'Write a word with root "bio".', type: 'short', answer: 'open' },
        { id: '5-SP-Q4-2', q: 'Roots help you read ___ words.', type: 'mc', options: ['harder', 'shorter', 'fewer'], answer: 0 },
      ]},
    ]},
    { name: 'Science', units: [
      { name: 'Q1 — Matter', lessons: [
        { title: 'Atoms', summary: 'Tiny building blocks.' },
        { title: 'Mixtures', summary: 'Solutions and suspensions.' },
        { title: 'Physical/Chemical', summary: 'Change types.' },
      ], questions: [
        { id: '5-SC-Q1-1', q: 'Everything is made of ___', type: 'mc', options: ['atoms', 'air', 'water'], answer: 0 },
        { id: '5-SC-Q1-2', q: 'Sugar in water is a ___', type: 'mc', options: ['solution', 'solid', 'gas'], answer: 0 },
      ]},
      { name: 'Q2 — Ecosystems', lessons: [
        { title: 'Food Webs', summary: 'Connected chains.' },
        { title: 'Biomes', summary: 'Tundra, desert, forest, aquatic.' },
        { title: 'Human Impact', summary: 'Pollution and care.' },
      ], questions: [
        { id: '5-SC-Q2-1', q: 'A food ___ shows many linked chains.', type: 'mc', options: ['web', 'chain', 'circle'], answer: 0 },
        { id: '5-SC-Q2-2', q: 'We care for nature by ___', type: 'mc', options: ['reducing waste', 'burning more', 'ignoring it'], answer: 0 },
      ]},
      { name: 'Q3 — Motion', lessons: [
        { title: 'Speed & Distance', summary: 'Rate = distance ÷ time.' },
        { title: 'Newton’s Laws', summary: 'Intro to inertia, force.' },
        { title: 'Simple Machines', summary: 'All six.' },
      ], questions: [
        { id: '5-SC-Q3-1', q: 'An object at rest stays at rest = Newton’s ___ law.', type: 'mc', options: ['1st', '2nd', '3rd'], answer: 0 },
        { id: '5-SC-Q3-2', q: 'A ramp is a type of ___', type: 'mc', options: ['inclined plane', 'lever', 'pulley'], answer: 0 },
      ]},
      { name: 'Q4 — Human Body', lessons: [
        { title: 'Skeletal/Muscular', summary: 'Support and movement.' },
        { title: 'Respiratory/Circulatory', summary: 'Oxygen delivery.' },
        { title: 'Nervous', summary: 'Brain and signals.' },
      ], questions: [
        { id: '5-SC-Q4-1', q: 'The brain is part of the ___ system.', type: 'mc', options: ['nervous', 'digestive', 'skeletal'], answer: 0 },
        { id: '5-SC-Q4-2', q: 'Lungs put ___ into blood.', type: 'mc', options: ['oxygen', 'water', 'food'], answer: 0 },
      ]},
    ]},
    { name: 'History & Geography', units: [
      { name: 'Q1 — US Regions', lessons: [
        { title: 'Five Regions', summary: 'NE, SE, MW, SW, W.' },
        { title: 'Physical Features', summary: 'Rivers, mountains, plains.' },
        { title: 'Climate Zones', summary: 'Why regions differ.' },
      ], questions: [
        { id: '5-H-Q1-1', q: 'The Mississippi River is in the ___', type: 'mc', options: ['Midwest/South', 'West', 'Northeast'], answer: 0 },
        { id: '5-H-Q1-2', q: 'Climate is driven mostly by ___', type: 'mc', options: ['latitude', 'rivers', 'names'], answer: 0 },
      ]},
      { name: 'Q2 — Revolution to Constitution', lessons: [
        { title: 'Key Battles', summary: 'Lexington, Yorktown.' },
        { title: 'Founding Fathers', summary: 'Washington, Jefferson, Franklin.' },
        { title: 'Constitution', summary: 'Compromise and signing.' },
      ], questions: [
        { id: '5-H-Q2-1', q: 'The first president was ___', type: 'mc', options: ['Washington', 'Jefferson', 'Lincoln'], answer: 0 },
        { id: '5-H-Q2-2', q: 'The Constitution was signed in ___', type: 'mc', options: ['1787', '1776', '1865'], answer: 0 },
      ]},
      { name: 'Q3 — Westward & Reform', lessons: [
        { title: 'Louisiana Purchase', summary: 'Land doubled the country.' },
        { title: 'Trail of Tears', summary: 'Hard truth of removal.' },
        { title: 'Reformers', summary: 'Those who made things better.' },
      ], questions: [
        { id: '5-H-Q3-1', q: 'The Louisiana Purchase ___ the US.', type: 'mc', options: ['doubled', 'halved', 'ended'], answer: 0 },
        { id: '5-H-Q3-2', q: 'Reformers tried to make life ___', type: 'mc', options: ['better', 'worse', 'same'], answer: 0 },
      ]},
      { name: 'Q4 — Geography Skills', lessons: [
        { title: 'Resources', summary: 'Natural wealth of places.' },
        { title: 'Population', summary: 'Where people live and why.' },
        { title: 'Map Projections', summary: 'Globe to flat.' },
      ], questions: [
        { id: '5-H-Q4-1', q: 'People live where ___ is available.', type: 'mc', options: ['water and jobs', 'only mountains', 'no land'], answer: 0 },
        { id: '5-H-Q4-2', q: 'A map projection shows the ___ on flat paper.', type: 'mc', options: ['globe', 'moon', 'sky'], answer: 0 },
      ]},
    ]},
    { name: 'Bible & Character', units: [
      { name: 'Q1 — Joshua & Judges', lessons: [
        { title: 'Joshua’s Courage', summary: 'God commands strength.' },
        { title: 'Rahab’s Faith', summary: 'A helper in the wall.' },
        { title: 'Deborah', summary: 'A wise leader.' },
      ], questions: [
        { id: '5-B-Q1-1', q: 'God told Joshua to be ___', type: 'mc', options: ['strong and courageous', 'afraid', 'silent'], answer: 0 },
        { id: '5-B-Q1-2', q: 'Rahab helped God’s people because of her ___', type: 'mc', options: ['faith', 'fear', 'money'], answer: 0 },
      ]},
      { name: 'Q2 — Kings & Prophets', lessons: [
        { title: 'David & Solomon', summary: 'A golden age.' },
        { title: 'Prophets', summary: 'Those who called people back.' },
        { title: 'Exile & Return', summary: 'God keeps His promise.' },
      ], questions: [
        { id: '5-B-Q2-1', q: 'Solomon asked God for ___', type: 'mc', options: ['wisdom', 'riches', 'power'], answer: 0 },
        { id: '5-B-Q2-2', q: 'Prophets called people back to ___', type: 'mc', options: ['God', 'war', 'gold'], answer: 0 },
      ]},
      { name: 'Q3 — Life of Christ', lessons: [
        { title: 'Temptation', summary: 'Jesus stands firm.' },
        { title: 'Sermon on the Mount', summary: 'The Beatitudes.' },
        { title: 'The Cross & Resurrection', summary: 'Hope for all.' },
      ], questions: [
        { id: '5-B-Q3-1', q: 'Jesus rose from the ___', type: 'mc', options: ['dead', 'boat', 'town'], answer: 0 },
        { id: '5-B-Q3-2', q: 'The Beatitudes begin "Blessed are the ___"', type: 'mc', options: ['poor in spirit', 'rich', 'strong'], answer: 0 },
      ]},
      { name: 'Q4 — Epistles', lessons: [
        { title: 'Paul’s Letters', summary: 'Love, unity, service.' },
        { title: 'Fruit & Gifts', summary: 'God equips the church.' },
        { title: 'Living It', summary: 'Faith in daily life.' },
      ], questions: [
        { id: '5-B-Q4-1', q: 'Paul wrote ___ to churches.', type: 'mc', options: ['letters', 'poems', 'laws'], answer: 0 },
        { id: '5-B-Q4-2', q: 'Faith is shown by how we ___', type: 'mc', options: ['live', 'sleep', 'hide'], answer: 0 },
      ]},
    ]},
  ])

// 6th grade in curriculum_part2c.ts
export const CURRICULUM_PART2b: GradeCurriculum[] = [G4, G5]
