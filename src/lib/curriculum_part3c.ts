// Larose Christian Academy — ORIGINAL Curriculum, Grades 11-12 (part 3c)
// 12th grade = senior year. Completing the full K-12 sequence feeds the diploma exam.

import type { GradeCurriculum } from './curriculum'

const g = (
  grade: string,
  gradeNum: number,
  age: string,
  tagline: string,
  subjects: any
): GradeCurriculum => ({ grade, gradeNum, age, tagline, subjects })

// ====================== 11TH GRADE ======================
export const G11: GradeCurriculum = g('11th Grade', 11, '16-17', 'Algebra II, British literature, precision.',
  [
    { name: 'Mathematics', units: [
      { name: 'Q1 — Functions', lessons: [
        { title: 'Polynomial Functions', summary: 'Degree and end behavior.' },
        { title: 'Rational Functions', summary: 'Fractions of polynomials.' },
        { title: 'Radical Functions', summary: 'Roots in functions.' },
      ], questions: [
        { id: '11-M-Q1-1', q: 'A polynomial’s highest power is its ___', type: 'mc', options: ['degree', 'root', 'sum'], answer: 0 },
        { id: '11-M-Q1-2', q: '√(x²) = ___', type: 'short', answer: '|x|' },
      ]},
      { name: 'Q2 — Exponents & Logs', lessons: [
        { title: 'Exponential', summary: 'Growth and decay.' },
        { title: 'Logarithms', summary: 'Inverse of exponential.' },
        { title: 'Solve Exp/Log', summary: 'Use properties.' },
      ], questions: [
        { id: '11-M-Q2-1', q: 'log₂(8) = ___', type: 'short', answer: '3' },
        { id: '11-M-Q2-2', q: 'A log is the ___ of an exponent.', type: 'mc', options: ['inverse', 'same', 'square'], answer: 0 },
      ]},
      { name: 'Q3 — Trig', lessons: [
        { title: 'Right Triangle', summary: 'sin, cos, tan.' },
        { title: 'Unit Circle', summary: 'Angles all around.' },
        { title: 'Graphs', summary: 'Periodic waves.' },
      ], questions: [
        { id: '11-M-Q3-1', q: 'sin(30°) = ___', type: 'mc', options: ['0.5', '0.707', '1'], answer: 0 },
        { id: '11-M-Q3-2', q: 'tan = sin / ___', type: 'short', answer: 'cos' },
      ]},
      { name: 'Q4 — Probability & Stats', lessons: [
        { title: 'Probability', summary: 'Likelihood.' },
        { title: 'Distributions', summary: 'Normal curve.' },
        { title: 'Regression', summary: 'Model data.' },
      ], questions: [
        { id: '11-M-Q4-1', q: 'Probability ranges from ___ to ___', type: 'mc', options: ['0 to 1', '0 to 100', '-1 to 1'], answer: 0 },
        { id: '11-M-Q4-2', q: 'The normal curve is ___', type: 'mc', options: ['bell-shaped', 'flat', 'square'], answer: 0 },
      ]},
    ]},
    { name: 'Language Arts', units: [
      { name: 'Q1 — British Literature', lessons: [
        { title: 'Beowulf & Epic', summary: 'Heroism old.' },
        { title: 'Shakespeare', summary: 'Language and stage.' },
        { title: 'Victorians', summary: 'Morality and change.' },
      ], questions: [
        { id: '11-L-Q1-1', q: 'Shakespeare wrote ___', type: 'mc', options: ['plays and poems', 'novels', 'essays'], answer: 0 },
        { id: '11-L-Q1-2', q: 'An epic celebrates ___', type: 'mc', options: ['heroes', 'cowards', 'kings only'], answer: 0 },
      ]},
      { name: 'Q2 — Analysis', lessons: [
        { title: 'Critical Reading', summary: 'Lens and layer.' },
        { title: 'Research Paper', summary: 'Long-form argument.' },
        { title: 'Revision', summary: 'Make it sharp.' },
      ], questions: [
        { id: '11-L-Q2-1', q: 'A research paper argues from ___', type: 'mc', options: ['evidence', 'opinion', 'guesses'], answer: 0 },
        { id: '11-L-Q2-2', q: 'Write a thesis on duty in a Shakespeare play.', type: 'short', answer: 'open' },
      ]},
      { name: 'Q3 — Rhetoric', lessons: [
        { title: 'Persuasion', summary: 'Audience and aim.' },
        { title: 'Fallacies', summary: 'Avoid bad logic.' },
        { title: 'Speech', summary: 'Deliver with care.' },
      ], questions: [
        { id: '11-L-Q3-1', q: 'A fallacy ___ the argument.', type: 'mc', options: ['weakens', 'proves', 'ignores'], answer: 0 },
        { id: '11-L-Q3-2', q: 'Good persuasion respects the ___', type: 'mc', options: ['audience', 'rules', 'joke'], answer: 0 },
      ]},
      { name: 'Q4 — Capstone', lessons: [
        { title: 'Portfolio', summary: 'Best work collected.' },
        { title: 'Defense', summary: 'Explain your choices.' },
        { title: 'Reflection', summary: 'How you grew.' },
      ], questions: [
        { id: '11-L-Q4-1', q: 'A portfolio shows your ___', type: 'mc', options: ['growth', 'age', 'grade only'], answer: 0 },
        { id: '11-L-Q4-2', q: 'Write one sentence on what you learned in English.', type: 'short', answer: 'open' },
      ]},
    ]},
    { name: 'Spelling & Word Origins', units: [
      { name: 'Q1 — Latin Roots 9', lessons: [
        { title: 'List 1: voc, sci', summary: 'vocabulary, vocal, science, conscious.' },
        { title: 'Root: voc = "call/voice"', summary: 'Latin "vox".' },
        { title: 'Root: sci = "know"', summary: 'Latin "scire".' },
      ], questions: [
        { id: '11-SP-Q1-1', q: '"vocabulary" is your ___ of words.', type: 'mc', options: ['store/voice', 'hand', 'foot'], answer: 0 },
        { id: '11-SP-Q1-2', q: '"science" is ___', type: 'mc', options: ['knowledge', 'sound', 'light'], answer: 0 },
      ]},
      { name: 'Q2 — Greek Roots 9', lessons: [
        { title: 'List 2: phan, the', summary: 'phantom, phenomenon, theology, theocracy.' },
        { title: 'Root: phan = "show"', summary: 'Greek "phainein".' },
        { title: 'Root: the = "God"', summary: 'Greek "theos".' },
      ], questions: [
        { id: '11-SP-Q2-1', q: 'A "phenomenon" is something that ___', type: 'mc', options: ['appears', 'hides', 'stays'], answer: 0 },
        { id: '11-SP-Q2-2', q: '"theology" is the study of ___', type: 'mc', options: ['God', 'earth', 'words'], answer: 0 },
      ]},
      { name: 'Q3 — Advanced Suffixes', lessons: [
        { title: 'List 3: -ology/-graphy', summary: 'biology, geology, geography, photography.' },
        { title: 'Suffix: -ology = "study of"', summary: 'Greek "-logia".' },
        { title: 'Suffix: -graphy = "writing/description"', summary: 'Greek "-graphia".' },
      ], questions: [
        { id: '11-SP-Q3-1', q: '"geology" is the study of the ___', type: 'mc', options: ['earth', 'life', 'words'], answer: 0 },
        { id: '11-SP-Q3-2', q: 'Write a word ending in "-ology".', type: 'short', answer: 'open' },
      ]},
      { name: 'Q4 — Review', lessons: [
        { title: 'Master List', summary: 'Spell all year words.' },
        { title: 'Root Map', summary: 'voc, sci, phan, the, -ology, -graphy.' },
        { title: 'Decode Mastery', summary: 'Any new word from roots.' },
      ], questions: [
        { id: '11-SP-Q4-1', q: 'Write a word with root "the".', type: 'short', answer: 'open' },
        { id: '11-SP-Q4-2', q: 'Roots let you read ___ words confidently.', type: 'mc', options: ['unknown', 'short', 'easy'], answer: 0 },
      ]},
    ]},
    { name: 'Science', units: [
      { name: 'Q1 — Physics III', lessons: [
        { title: 'Mechanics', summary: 'Deep kinematics.' },
        { title: 'Fields', summary: 'Gravity and EM.' },
        { title: 'Quantum Intro', summary: 'Small-scale weird.' },
      ], questions: [
        { id: '11-SC-Q1-1', q: 'Gravity is a ___', type: 'mc', options: ['field', 'solid', 'gas'], answer: 0 },
        { id: '11-SC-Q1-2', q: 'Quantum describes the very ___', type: 'mc', options: ['small', 'large', 'hot'], answer: 0 },
      ]},
      { name: 'Q2 — Chemistry III', lessons: [
        { title: 'Organic', summary: 'Carbon chains.' },
        { title: 'Biochem', summary: 'Chemistry of life.' },
        { title: 'Lab', summary: 'Safe experiment.' },
      ], questions: [
        { id: '11-SC-Q2-1', q: 'Life chemistry is built on ___', type: 'mc', options: ['carbon', 'iron', 'water'], answer: 0 },
        { id: '11-SC-Q2-2', q: 'Lab safety means ___', type: 'mc', options: ['following rules', 'rushing', 'guessing'], answer: 0 },
      ]},
      { name: 'Q3 — Biology III', lessons: [
        { title: 'Genomics', summary: 'The full code.' },
        { title: 'Biotech', summary: 'Tools and ethics.' },
        { title: 'Ecology', summary: 'Systems thinking.' },
      ], questions: [
        { id: '11-SC-Q3-1', q: 'The genome is the full ___', type: 'mc', options: ['DNA code', 'protein', 'cell'], answer: 0 },
        { id: '11-SC-Q3-2', q: 'Biotech must be used ___', type: 'mc', options: ['ethically', 'carelessly', 'secretly'], answer: 0 },
      ]},
      { name: 'Q4 — Elective: Computer Science', lessons: [
        { title: 'Logic', summary: 'How computers think.' },
        { title: 'Programming', summary: 'Make it do a task.' },
        { title: 'Stewardship', summary: 'Tech for good.' },
      ], questions: [
        { id: '11-SC-Q4-1', q: 'A program is a set of ___', type: 'mc', options: ['instructions', 'feelings', 'pictures'], answer: 0 },
        { id: '11-SC-Q4-2', q: 'Tech should serve ___', type: 'mc', options: ['people', 'pride', 'profit only'], answer: 0 },
      ]},
    ]},
    { name: 'History & Geography', units: [
      { name: 'Q1 — US History Capstone', lessons: [
        { title: 'Foundations', summary: 'Ideas that built.' },
        { title: 'Struggles', summary: 'Wars and rights.' },
        { title: 'Modern', summary: 'Today’s questions.' },
      ], questions: [
        { id: '11-H-Q1-1', q: 'The US was founded on ideas of ___', type: 'mc', options: ['liberty', 'war', 'silence'], answer: 0 },
        { id: '11-H-Q1-2', q: 'Rights are best protected by ___', type: 'mc', options: ['law and virtue', 'force', 'silence'], answer: 0 },
      ]},
      { name: 'Q2 — World History Capstone', lessons: [
        { title: 'Civilizations', summary: 'What rose and fell.' },
        { title: 'Ideas', summary: 'What moved the world.' },
        { title: 'Today', summary: 'A connected globe.' },
      ], questions: [
        { id: '11-H-Q2-1', q: 'Civilizations rise and ___', type: 'mc', options: ['fall', 'stay', 'freeze'], answer: 0 },
        { id: '11-H-Q2-2', q: 'Today’s world is ___', type: 'mc', options: ['connected', 'isolated', 'silent'], answer: 0 },
      ]},
      { name: 'Q3 — Government', lessons: [
        { title: 'Constitution', summary: 'The frame.' },
        { title: 'Rights & Duties', summary: 'Both ways.' },
        { title: 'Civic Action', summary: 'How to help.' },
      ], questions: [
        { id: '11-H-Q3-1', q: 'Rights come with ___', type: 'mc', options: ['duties', 'costs only', 'nothing'], answer: 0 },
        { id: '11-H-Q3-2', q: 'Good citizens ___', type: 'mc', options: ['engage', 'ignore', 'leave'], answer: 0 },
      ]},
      { name: 'Q4 — Economics', lessons: [
        { title: 'Markets', summary: 'How trade works.' },
        { title: 'Money', summary: 'Its real use.' },
        { title: 'Stewardship', summary: 'Biblical view.' },
      ], questions: [
        { id: '11-H-Q4-1', q: 'Trade helps both sides ___', type: 'mc', options: ['when free', 'never', 'only one'], answer: 0 },
        { id: '11-H-Q4-2', q: 'Money is a tool for ___', type: 'mc', options: ['stewardship', 'greed', 'pride'], answer: 0 },
      ]},
    ]},
    { name: 'Bible & Character', units: [
      { name: 'Q1 — Systematic Theology', lessons: [
        { title: 'God & Trinity', summary: 'One in three.' },
        { title: 'Humanity', summary: 'Made, fallen, redeemed.' },
        { title: 'Christ', summary: 'Fully God, fully man.' },
      ], questions: [
        { id: '11-B-Q1-1', q: 'Jesus is fully God and fully ___', type: 'mc', options: ['man', 'angel', 'king'], answer: 0 },
        { id: '11-B-Q1-2', q: 'We are made in God’s ___', type: 'mc', options: ['image', 'place', 'time'], answer: 0 },
      ]},
      { name: 'Q2 — Ethics', lessons: [
        { title: 'Moral Law', summary: 'God’s standard.' },
        { title: 'Conscience', summary: 'The inner guide.' },
        { title: 'Culture', summary: 'Engage, not hide.' },
      ], questions: [
        { id: '11-B-Q2-1', q: 'The moral law comes from ___', type: 'mc', options: ['God', 'man', 'chance'], answer: 0 },
        { id: '11-B-Q2-2', q: 'We engage culture with ___', type: 'mc', options: ['truth and love', 'anger', 'fear'], answer: 0 },
      ]},
      { name: 'Q3 — Apologetics', lessons: [
        { title: 'Evidence', summary: 'Why we believe.' },
        { title: 'Objections', summary: 'Answer gently.' },
        { title: 'Witness', summary: 'Live it.' },
      ], questions: [
        { id: '11-B-Q3-1', q: 'We give a reason for our hope with ___', type: 'mc', options: ['gentleness', 'shouting', 'force'], answer: 0 },
        { id: '11-B-Q3-2', q: 'Faith is strengthened by ___', type: 'mc', options: ['evidence and life', 'denial', 'silence'], answer: 0 },
      ]},
      { name: 'Q4 — Life', lessons: [
        { title: 'Calling', summary: 'His plan for you.' },
        { title: 'Purity', summary: 'Body and mind.' },
        { title: 'Service', summary: 'Lead by serving.' },
      ], questions: [
        { id: '11-B-Q4-1', q: 'Your calling is to ___ God.', type: 'mc', options: ['serve', 'ignore', 'flee'], answer: 0 },
        { id: '11-B-Q4-2', q: 'Purity guards the ___', type: 'mc', options: ['heart', 'wallet', 'clock'], answer: 0 },
      ]},
    ]},
  ])

// ====================== 12TH GRADE ======================
export const G12: GradeCurriculum = g('12th Grade', 12, '17-18', 'Senior year — capstone, then the diploma exam.',
  [
    { name: 'Mathematics', units: [
      { name: 'Q1 — Pre-Calculus', lessons: [
        { title: 'Functions Deep', summary: 'Composition and inverse.' },
        { title: 'Trig Identities', summary: 'Prove and use.' },
        { title: 'Sequences & Series', summary: 'Sums.' },
      ], questions: [
        { id: '12-M-Q1-1', q: 'sin²θ + cos²θ = ___', type: 'short', answer: '1' },
        { id: '12-M-Q1-2', q: 'f(f⁻¹(x)) = ___', type: 'short', answer: 'x' },
      ]},
      { name: 'Q2 — Limits', lessons: [
        { title: 'What Is a Limit', summary: 'Approaching a value.' },
        { title: 'Continuity', summary: 'No breaks.' },
        { title: 'Intro Derivatives', summary: 'Rate of change.' },
      ], questions: [
        { id: '12-M-Q2-1', q: 'A derivative measures ___', type: 'mc', options: ['rate of change', 'area', 'volume'], answer: 0 },
        { id: '12-M-Q2-2', q: 'A continuous graph has no ___', type: 'mc', options: ['breaks', 'points', 'lines'], answer: 0 },
      ]},
      { name: 'Q3 — Probability', lessons: [
        { title: 'Counting', summary: 'Permutations, combos.' },
        { title: 'Distributions', summary: 'Binomial, normal.' },
        { title: 'Expected Value', summary: 'Long-run average.' },
      ], questions: [
        { id: '12-M-Q3-1', q: 'Expected value is the ___ average.', type: 'mc', options: ['long-run', 'short', 'only'], answer: 0 },
        { id: '12-M-Q3-2', q: 'A combination counts ___ order.', type: 'mc', options: ['without', 'with', 'by'], answer: 0 },
      ]},
      { name: 'Q4 — Capstone Math', lessons: [
        { title: 'Model a Problem', summary: 'Math in real life.' },
        { title: 'Present', summary: 'Explain it.' },
        { title: 'Review', summary: 'Ready for the exam.' },
      ], questions: [
        { id: '12-M-Q4-1', q: 'Math models ___', type: 'mc', options: ['real problems', 'nothing', 'only school'], answer: 0 },
        { id: '12-M-Q4-2', q: 'Write one way you used math this year.', type: 'short', answer: 'open' },
      ]},
    ]},
    { name: 'Language Arts', units: [
      { name: 'Q1 — World Classics', lessons: [
        { title: 'Epic & Tragedy', summary: 'The human story.' },
        { title: 'Modern Voices', summary: 'Today’s writers.' },
        { title: 'The Essay', summary: 'Clear thought.' },
      ], questions: [
        { id: '12-L-Q1-1', q: 'A tragedy shows a ___ brought low.', type: 'mc', options: ['flawed hero', 'villain', 'child'], answer: 0 },
        { id: '12-L-Q1-2', q: 'The essay trains ___', type: 'mc', options: ['clear thought', 'guessing', 'anger'], answer: 0 },
      ]},
      { name: 'Q2 — Research Capstone', lessons: [
        { title: 'Thesis', summary: 'A clear claim.' },
        { title: 'Sources', summary: 'Strong and cited.' },
        { title: 'Draft & Defend', summary: 'Argue it.' },
      ], questions: [
        { id: '12-L-Q2-1', q: 'A capstone defends a ___', type: 'mc', options: ['thesis', 'joke', 'list'], answer: 0 },
        { id: '12-L-Q2-2', q: 'Write a one-sentence thesis on a book you studied.', type: 'short', answer: 'open' },
      ]},
      { name: 'Q3 — Rhetoric Capstone', lessons: [
        { title: 'Persuade', summary: 'With truth.' },
        { title: 'Speak', summary: 'With care.' },
        { title: 'Write', summary: 'With power.' },
      ], questions: [
        { id: '12-L-Q3-1', q: 'Persuasion with truth is ___', type: 'mc', options: ['honorable', 'manipulative', 'weak'], answer: 0 },
        { id: '12-L-Q3-2', q: 'Good writing respects the ___', type: 'mc', options: ['reader', 'rules', 'joke'], answer: 0 },
      ]},
      { name: 'Q4 — Senior Portfolio', lessons: [
        { title: 'Collect', summary: 'Best work.' },
        { title: 'Reflect', summary: 'How you grew.' },
        { title: 'Present', summary: 'To family.' },
      ], questions: [
        { id: '12-L-Q4-1', q: 'The portfolio shows ___', type: 'mc', options: ['growth', 'age', 'grade'], answer: 0 },
        { id: '12-L-Q4-2', q: 'Write one sentence on your senior year.', type: 'short', answer: 'open' },
      ]},
    ]},
    { name: 'Spelling & Word Origins', units: [
      { name: 'Q1 — Latin Roots 10', lessons: [
        { title: 'List 1: ver, fid', summary: 'verify, verdict, fidelity, confident.' },
        { title: 'Root: ver = "true"', summary: 'Latin "verus".' },
        { title: 'Root: fid = "faith"', summary: 'Latin "fides".' },
      ], questions: [
        { id: '12-SP-Q1-1', q: '"verify" means to check if ___', type: 'mc', options: ['true', 'false', 'old'], answer: 0 },
        { id: '12-SP-Q1-2', q: '"fidelity" is ___', type: 'mc', options: ['faithfulness', 'speed', 'size'], answer: 0 },
      ]},
      { name: 'Q2 — Greek Roots 10', lessons: [
        { title: 'List 2: cosm, anthrop', summary: 'cosmos, cosmology, anthropology, philanthropist.' },
        { title: 'Root: cosm = "order/world"', summary: 'Greek "kosmos".' },
        { title: 'Root: anthrop = "man"', summary: 'Greek "anthropos".' },
      ], questions: [
        { id: '12-SP-Q2-1', q: '"cosmos" is the ordered ___', type: 'mc', options: ['universe', 'mind', 'book'], answer: 0 },
        { id: '12-SP-Q2-2', q: '"anthropology" is the study of ___', type: 'mc', options: ['man', 'stars', 'words'], answer: 0 },
      ]},
      { name: 'Q3 — Mastery', lessons: [
        { title: 'All Roots Review', summary: 'K-11 roots, final pass.' },
        { title: 'Decode Anything', summary: 'Any new word.' },
        { title: 'Spelling Bee', summary: 'Prove the year list.' },
      ], questions: [
        { id: '12-SP-Q3-1', q: 'Write a word using any root you learned.', type: 'short', answer: 'open' },
        { id: '12-SP-Q3-2', q: 'Roots unlock ___ of the English language.', type: 'mc', options: ['most words', 'few words', 'no words'], answer: 0 },
      ]},
      { name: 'Q4 — Legacy', lessons: [
        { title: 'Word Journal', summary: 'Your collected words.' },
        { title: 'Teach a Word', summary: 'Pass it on.' },
        { title: 'Final', summary: 'Ready for diploma.' },
      ], questions: [
        { id: '12-SP-Q4-1', q: 'Write one word you will remember.', type: 'short', answer: 'open' },
        { id: '12-SP-Q4-2', q: 'Etymology helps you ___ words for life.', type: 'mc', options: ['own', 'forget', 'fear'], answer: 0 },
      ]},
    ]},
    { name: 'Science', units: [
      { name: 'Q1 — Senior Lab', lessons: [
        { title: 'Design', summary: 'A real question.' },
        { title: 'Experiment', summary: 'Careful method.' },
        { title: 'Report', summary: 'Clear findings.' },
      ], questions: [
        { id: '12-SC-Q1-1', q: 'A lab report states ___', type: 'mc', options: ['findings', 'guesses', 'jokes'], answer: 0 },
        { id: '12-SC-Q1-2', q: 'A good experiment changes one ___', type: 'mc', options: ['variable', 'result', 'tool'], answer: 0 },
      ]},
      { name: 'Q2 — Capstone Science', lessons: [
        { title: 'Pick a Field', summary: 'Your interest.' },
        { title: 'Go Deep', summary: 'Real study.' },
        { title: 'Present', summary: 'Teach it.' },
      ], questions: [
        { id: '12-SC-Q2-1', q: 'A capstone shows ___ study.', type: 'mc', options: ['deep', 'shallow', 'none'], answer: 0 },
        { id: '12-SC-Q2-2', q: 'Write one science topic you explored.', type: 'short', answer: 'open' },
      ]},
      { name: 'Q3 — Ethics of Science', lessons: [
        { title: 'Stewardship', summary: 'Care for creation.' },
        { title: 'Limits', summary: 'Wise bounds.' },
        { title: 'Purpose', summary: 'For human good.' },
      ], questions: [
        { id: '12-SC-Q3-1', q: 'Science should serve ___', type: 'mc', options: ['human good', 'pride', 'profit only'], answer: 0 },
        { id: '12-SC-Q3-2', q: 'We steward creation as ___', type: 'mc', options: ['God’s gift', 'ours', 'nothing'], answer: 0 },
      ]},
      { name: 'Q4 — Review', lessons: [
        { title: 'K-11 Recap', summary: 'The whole arc.' },
        { title: 'Exam Prep', summary: 'Ready for diploma.' },
        { title: 'Wonder', summary: 'God made it all.' },
      ], questions: [
        { id: '12-SC-Q4-1', q: 'All science points back to ___', type: 'mc', options: ['the Creator', 'chance', 'nothing'], answer: 0 },
        { id: '12-SC-Q4-2', q: 'Write one thing you learned in science.', type: 'short', answer: 'open' },
      ]},
    ]},
    { name: 'History & Geography', units: [
      { name: 'Q1 — American Ideas', lessons: [
        { title: 'Liberty', summary: 'The core idea.' },
        { title: 'Union', summary: 'One from many.' },
        { title: 'Justice', summary: 'For all.' },
      ], questions: [
        { id: '12-H-Q1-1', q: 'The US motto is "___ from many."', type: 'mc', options: ['one', 'two', 'none'], answer: 0 },
        { id: '12-H-Q1-2', q: 'Liberty means ___', type: 'mc', options: ['freedom under law', 'no rules', 'force'], answer: 0 },
      ]},
      { name: 'Q2 — World Ideas', lessons: [
        { title: 'Civilization', summary: 'What builds it.' },
        { title: 'Freedom', summary: 'Its cost.' },
        { title: 'Hope', summary: 'Where it rests.' },
      ], questions: [
        { id: '12-H-Q2-1', q: 'Freedom is preserved by ___', type: 'mc', options: ['virtue', 'force', 'silence'], answer: 0 },
        { id: '12-H-Q2-2', q: 'True hope rests in ___', type: 'mc', options: ['God', 'man', 'money'], answer: 0 },
      ]},
      { name: 'Q3 — Civics Capstone', lessons: [
        { title: 'Your Role', summary: 'A citizen.' },
        { title: 'Service', summary: 'Help your town.' },
        { title: 'Vote', summary: 'With wisdom.' },
      ], questions: [
        { id: '12-H-Q3-1', q: 'Voting is a ___', type: 'mc', options: ['duty', 'joke', 'burden only'], answer: 0 },
        { id: '12-H-Q3-2', q: 'Write one way you will serve.', type: 'short', answer: 'open' },
      ]},
      { name: 'Q4 — Senior Thesis', lessons: [
        { title: 'Choose', summary: 'A question that matters.' },
        { title: 'Argue', summary: 'With evidence.' },
        { title: 'Defend', summary: 'Before panel.' },
      ], questions: [
        { id: '12-H-Q4-1', q: 'A thesis argues a ___', type: 'mc', options: ['claim', 'fact', 'joke'], answer: 0 },
        { id: '12-H-Q4-2', q: 'Write your senior thesis claim.', type: 'short', answer: 'open' },
      ]},
    ]},
    { name: 'Bible & Character', units: [
      { name: 'Q1 — Whole Bible', lessons: [
        { title: 'One Story', summary: 'Creation to new earth.' },
        { title: 'Christ at Center', summary: 'The thread.' },
        { title: 'Promise Kept', summary: 'He came.' },
      ], questions: [
        { id: '12-B-Q1-1', q: 'The whole Bible points to ___', type: 'mc', options: ['Christ', 'a king', 'wealth'], answer: 0 },
        { id: '12-B-Q1-2', q: 'God’s promise was ___', type: 'mc', options: ['kept', 'broken', 'forgotten'], answer: 0 },
      ]},
      { name: 'Q2 — Life After', lessons: [
        { title: 'Calling', summary: 'His plan.' },
        { title: 'Purity', summary: 'Body and mind.' },
        { title: 'Work', summary: 'As worship.' },
      ], questions: [
        { id: '12-B-Q2-1', q: 'Work done well is ___', type: 'mc', options: ['worship', 'burden', 'chance'], answer: 0 },
        { id: '12-B-Q2-2', q: 'Purity guards the ___', type: 'mc', options: ['heart', 'wallet', 'watch'], answer: 0 },
      ]},
      { name: 'Q3 — Witness', lessons: [
        { title: 'Go', summary: 'Take the good news.' },
        { title: 'Live', summary: 'So they see.' },
        { title: 'Speak', summary: 'When asked.' },
      ], questions: [
        { id: '12-B-Q3-1', q: 'We witness by ___ and word.', type: 'mc', options: ['life', 'force', 'silence'], answer: 0 },
        { id: '12-B-Q3-2', q: 'We speak the truth with ___', type: 'mc', options: ['love', 'anger', 'pride'], answer: 0 },
      ]},
      { name: 'Q4 — Graduation', lessons: [
        { title: 'Review', summary: 'All you learned.' },
        { title: 'Charge', summary: 'Go and serve.' },
        { title: 'Diploma', summary: 'You are ready.' },
      ], questions: [
        { id: '12-B-Q4-1', q: 'Graduation means you are ___', type: 'mc', options: ['ready to serve', 'done learning', 'free'], answer: 0 },
        { id: '12-B-Q4-2', q: 'Write one thing you will carry forward.', type: 'short', answer: 'open' },
      ]},
    ]},
  ])

export const CURRICULUM_PART3c: GradeCurriculum[] = [G11, G12]
