export interface SubjectSkill {
  learningObjectives: string
  keySkills: string[]
  sampleLessons: string[]
  endOfYearExpectation: string
}

export interface GradeData {
  slug: string
  label: string
  ageRange: string
  totalLessons: number
  heroTagline: string
  milestones: string[]
  subjects: {
    math: SubjectSkill
    english: SubjectSkill
    science: SubjectSkill
    history: SubjectSkill
    bible: SubjectSkill
    electives: SubjectSkill
  }
  color: string
  icon: string
}

export const GRADES_K3: GradeData[] = [
  // ── KINDERGARTEN ──
  {
    slug: 'k',
    label: 'Kindergarten',
    ageRange: '5-6',
    totalLessons: 180,
    heroTagline: 'Watch Your Child Discover Learning!',
    milestones: [
      'Read 25+ sight words and sound out simple books',
      'Write letters, numbers, and complete sentences about their day',
      'Add and subtract numbers up to 10 using manipulatives',
      'Discover how God designed the world through hands-on science',
    ],
    subjects: {
      math: {
        learningObjectives: 'Build number sense, basic operations, and mathematical thinking through play and exploration.',
        keySkills: [
          'Count confidently from 1–100',
          'Recognize and write numbers 0–20',
          'Understand "more than," "less than," and "equal to"',
          'Add and subtract within 10 using objects, fingers, and pictures',
          'Identify and create patterns (red, blue, red, blue...)',
          'Recognize basic shapes and describe their properties',
          'Tell time to the hour and understand yesterday/today/tomorrow',
          'Sort objects by size, color, and other attributes',
        ],
        sampleLessons: [
          '"Counting Bears Adventure" — Learn numbers 1–10 with colorful manipulatives',
          '"Shape Detective" — Find circles, squares, and triangles in your home',
          '"Cookie Math" — Practice addition by "eating" math problems',
        ],
        endOfYearExpectation: 'Your child will solve simple word problems, recognize number patterns, and use math vocabulary confidently in daily life.',
      },
      english: {
        learningObjectives: 'Develop phonemic awareness, reading fluency, and writing expression through systematic phonics instruction.',
        keySkills: [
          'Identify all letter sounds and letter combinations (phonics)',
          'Blend sounds to read 3-letter words (cat, dog, sun)',
          'Recognize 25+ high-frequency sight words (the, and, is, you)',
          'Read simple sentences and short books independently',
          'Write uppercase and lowercase letters with proper formation',
          'Compose complete sentences using finger spaces and periods',
          'Retell favorite stories in correct sequence',
          'Listen to and discuss age-appropriate books',
        ],
        sampleLessons: [
          '"Letter Sound Safari" — Interactive games to master phonics',
          '"My Family Book" — Write and illustrate stories about your family',
          '"Sight Word Treasure Hunt" — Find common words everywhere you go',
        ],
        endOfYearExpectation: 'Your child will read simple chapter books, write 3–4 sentence stories, and express their thoughts clearly in conversation.',
      },
      science: {
        learningObjectives: "Explore God's creation through hands-on experiments and nature observation.",
        keySkills: [
          'Identify living vs. non-living things in nature',
          'Understand basic needs of plants and animals',
          'Observe weather patterns and seasons',
          "Explore the five senses through safe experiments",
          'Learn about day/night cycles and God\'s design',
          'Classify objects by properties (rough/smooth, hard/soft)',
          'Practice simple scientific observation and prediction',
          "Care for God's creation through environmental awareness",
        ],
        sampleLessons: [
          '"Plant a Prayer Garden" — Watch seeds grow while learning about God\'s design',
          '"Weather Detective" — Track daily weather and learn about seasons',
          '"Amazing Animals" — Discover how God designed animals for their homes',
        ],
        endOfYearExpectation: "Your child will ask scientific questions, make predictions, and see God's hand in the natural world around them.",
      },
      history: {
        learningObjectives: 'Understand family, community, and basic American symbols while developing timeline thinking.',
        keySkills: [
          'Create a personal timeline of their life',
          'Understand family roles and relationships',
          'Identify community helpers and their jobs',
          'Recognize American symbols (flag, eagle, Statue of Liberty)',
          'Learn about major holidays and their meanings',
          'Distinguish between past, present, and future',
          'Understand basic rules and why we need them',
          'Appreciate different family traditions and cultures',
        ],
        sampleLessons: [
          '"My Family Tree" — Explore family history and traditions',
          '"Community Helper Parade" — Learn about jobs that help our town',
          '"Holiday Celebrations" — Discover why we celebrate special days',
        ],
        endOfYearExpectation: 'Your child will understand their place in family and community, show respect for others, and demonstrate good citizenship.',
      },
      bible: {
        learningObjectives: "Introduce God's love through foundational Bible stories and character development.",
        keySkills: [
          'Know that God created everything and loves them personally',
          'Retell major Bible stories (Creation, Noah, Baby Jesus, Easter)',
          'Recite simple Bible verses about God\'s love',
          'Understand the difference between right and wrong choices',
          'Practice Christian character traits (kindness, sharing, honesty)',
          'Learn simple prayers for different occasions',
          'Recognize the Bible as God\'s special book',
          'Show love for God through worship and obedience',
        ],
        sampleLessons: [
          '"Creation Week" — Act out the seven days of creation',
          "\"Noah's Ark Animal Parade\" — Learn about God's protection",
          '"Baby Jesus" — Celebrate God\'s gift of Jesus at Christmas',
        ],
        endOfYearExpectation: 'Your child will have a foundation of God\'s love, know key Bible stories, and demonstrate Christian character in daily interactions.',
      },
      electives: {
        learningObjectives: 'Develop creativity, physical coordination, and practical life skills through structured play and exploration.',
        keySkills: [
          'Art: Use various art materials safely and creatively',
          'Music: Sing simple songs and recognize rhythm patterns',
          'Physical Education: Develop gross motor skills through games and movement',
          'Life Skills: Basic self-care, following directions, and classroom routines',
          'Technology: Introduction to educational apps and computer basics (optional)',
        ],
        sampleLessons: [
          '"Masterpiece Monday" — Create art inspired by famous artists',
          '"Movement & Music" — Dance and sing while learning academic concepts',
          '"Helper Skills" — Practice tying shoes, zipping coats, and organizing supplies',
        ],
        endOfYearExpectation: 'Your child will express creativity confidently, follow multi-step directions, and demonstrate age-appropriate independence.',
      },
    },
    color: 'emerald',
    icon: '🌱',
  },

  // ── 1ST GRADE ──
  {
    slug: '1',
    label: '1st Grade',
    ageRange: '6-7',
    totalLessons: 180,
    heroTagline: 'Building Blocks of Learning!',
    milestones: [
      'Reading takes flight — transitioning from letters to reading simple books independently',
      'Mathematical thinking — numbers become tools for solving real problems',
      'Independence emerges — taking ownership of daily learning routines',
      'World awareness expands — curiosity beyond home to community and God\'s bigger plan',
    ],
    subjects: {
      math: {
        learningObjectives: 'Master foundational number concepts, basic addition and subtraction, and measurement skills that form the cornerstone of all future mathematics.',
        keySkills: [
          'Count, read, and write numbers to 100',
          'Understand place value (tens and ones)',
          'Add and subtract within 20 fluently',
          'Solve word problems using addition and subtraction',
          'Recognize and extend patterns',
          'Identify 2D and 3D shapes and their attributes',
          'Tell time to the hour and half-hour',
          'Measure length using non-standard units',
          'Count coins (pennies, nickels, dimes, quarters)',
          'Compare and order numbers',
          'Understand "equal to," "less than," and "greater than"',
          'Create and interpret simple graphs',
        ],
        sampleLessons: [
          '"Number Bonds: Finding All the Ways to Make 10"',
          '"Shape Detectives: 3D Shapes in Our World"',
          '"Time Travelers: Learning to Read the Clock"',
        ],
        endOfYearExpectation: 'Your child will confidently solve addition and subtraction problems within 20, read numbers to 100, tell time to the half-hour, and apply mathematical thinking to solve everyday problems.',
      },
      english: {
        learningObjectives: 'Become a confident beginning reader who can decode simple texts, write complete sentences, and express ideas clearly through speaking and listening.',
        keySkills: [
          'Read grade-level texts with accuracy and comprehension',
          'Decode words using phonics rules and word families',
          'Recognize 100+ sight words automatically',
          'Write complete sentences with correct capitalization and punctuation',
          'Spell common words using phonetic knowledge',
          'Identify main idea and details in stories',
          'Retell stories with beginning, middle, and end',
          'Print all uppercase and lowercase letters legibly',
          'Participate in group discussions and presentations',
          'Use context clues to understand new vocabulary',
        ],
        sampleLessons: [
          '"Word Family Wall: Building Words with -at, -an, -it"',
          '"Story Sequencing: What Happened First, Next, Last?"',
          '"My First Book Report: Sharing What We Read"',
        ],
        endOfYearExpectation: 'Your child will read simple chapter books with comprehension, write multiple connected sentences about a single topic, and communicate ideas clearly in discussion.',
      },
      science: {
        learningObjectives: 'Investigate the natural world through observation, classification, and simple experiments while recognizing God as the Creator.',
        keySkills: [
          'Observe and describe plant and animal life cycles',
          'Understand basic needs of living things (food, water, shelter)',
          'Explore sound, light, and simple energy concepts',
          'Learn about the sun, moon, stars, and Earth\'s place in space',
          'Classify animals by type (mammals, birds, fish, reptiles)',
          'Investigate properties of air and water',
          'Track weather changes and seasons',
          'Practice using simple science tools (magnifying glass, ruler)',
          'Record observations in a science journal',
        ],
        sampleLessons: [
          '"Life Cycle of a Butterfly: Watching God\'s Transformation"',
          '"Sun and Moon Observation: God\'s Lights in the Sky"',
          '"Sink or Float? Exploring Properties of Matter"',
        ],
        endOfYearExpectation: 'Your child will observe and describe natural phenomena, understand basic life cycles, record simple scientific observations, and appreciate God\'s design in creation.',
      },
      history: {
        learningObjectives: 'Understand community, basic economics, and American traditions while developing a sense of time and place.',
        keySkills: [
          'Understand what a community is and how it functions',
          'Learn about different types of communities (urban, suburban, rural)',
          'Identify basic economic concepts (needs vs. wants, goods vs. services)',
          'Learn about American heroes and their contributions',
          'Study national symbols and patriotic traditions',
          'Understand calendar concepts (days, weeks, months, years)',
          'Explore maps and basic geography',
          'Understand rules and laws and why societies need them',
          'Learn about different cultures and traditions in America',
        ],
        sampleLessons: [
          '"Needs and Wants: Learning to Make Good Choices"',
          '"American Heroes: People Who Made a Difference"',
          '"Map Skills: Finding Your Way Around"',
        ],
        endOfYearExpectation: 'Your child will understand basic economic concepts, recognize national symbols and heroes, read simple maps, and appreciate the diversity of communities in America.',
      },
      bible: {
        learningObjectives: 'Deepen understanding of God\'s character through Old Testament stories while learning to apply biblical truths to everyday situations.',
        keySkills: [
          'Learn about God as Creator, Provider, and Protector',
          'Study the lives of Old Testament patriarchs (Abraham, Isaac, Jacob)',
          'Understand the story of Joseph and God\'s faithfulness',
          'Learn about Moses and the Exodus from Egypt',
          'Memorize key Bible verses about God\'s love and care',
          'Understand the concept of prayer and how to pray',
          'Practice forgiveness and kindness in daily life',
          'Learn the books of the Old Testament',
          'Apply Bible stories to real-life situations',
        ],
        sampleLessons: [
          '"Joseph\'s Journey: God Turns Bad into Good"',
          '"Moses and the Red Sea: God Makes a Way"',
          '"The Ten Commandments: God\'s Rules for Living"',
        ],
        endOfYearExpectation: 'Your child will know key Old Testament stories, understand God\'s faithfulness to His people, memorize several Bible verses, and apply biblical principles to daily choices.',
      },
      electives: {
        learningObjectives: 'develop creativity, physical skills, and practical abilities through structured activities and exploration.',
        keySkills: [
          'Art: Explore color theory and create artwork using various media',
          'Music: Learn rhythm, melody, and basic music appreciation',
          'Physical Education: Develop coordination through structured play and games',
          'Life Skills: Personal organization, responsibility, and basic chores',
          'Technology: Introduction to keyboarding and educational software',
        ],
        sampleLessons: [
          '"Color Wheel Exploration: Mixing Primary Colors"',
          '"Musical Instruments: Discovering Sounds and Rhythms"',
          '"My Responsibility Chart: Building Good Habits"',
        ],
        endOfYearExpectation: 'Your child will demonstrate creativity through art and music, show improved physical coordination, manage personal belongings independently, and exhibit responsibility in daily tasks.',
      },
    },
    color: 'sky',
    icon: '📖',
  },

  // ── 2ND GRADE ──
  {
    slug: '2',
    label: '2nd Grade',
    ageRange: '7-8',
    totalLessons: 190,
    heroTagline: 'Growing Skills, Confidence, and Curiosity!',
    milestones: [
      'Read chapter books fluently and discuss plot, characters, and themes',
      'Master addition and subtraction up to 1,000 with regrouping',
      'Write organized paragraphs with clear topic sentences and details',
      'Explore God\'s creation through hands-on experiments and nature study',
    ],
    subjects: {
      math: {
        learningObjectives: 'Master addition and subtraction with larger numbers, build multiplication foundations, and develop problem-solving strategies.',
        keySkills: [
          'Add and subtract within 1,000 using regrouping',
          'Skip-count by 2s, 5s, 10s, and 100s',
          'Understand place value to thousands',
          'Solve two-step word problems using various strategies',
          'Work with money including making change',
          'Tell time to the nearest five minutes',
          'Measure length, weight, and capacity in standard units',
          'Identify parallel and perpendicular lines',
          'Partition shapes into equal parts (halves, thirds, fourths)',
          'Interpret and create bar graphs and picture graphs',
          'Understand even and odd numbers',
        ],
        sampleLessons: [
          '"Regrouping Rally: Adding and Subtracting with Place Value"',
          '"Money Math: Running a Classroom Store"',
          '"Graphing Galore: Collecting and Displaying Data"',
        ],
        endOfYearExpectation: 'Your child will fluently add and subtract within 1,000, solve multi-step word problems, tell time confidently, and understand basic fractions and measurement.',
      },
      english: {
        learningObjectives: 'Develop reading fluency, comprehension strategies, and writing skills to express ideas clearly and creatively.',
        keySkills: [
          'Read grade-level chapter books with fluency and expression',
          'Identify story elements (characters, setting, plot)',
          'Write opinion pieces with reasons and supporting details',
          'Write informative/explanatory texts with facts and definitions',
          'Write narratives with a clear sequence of events',
          'Use correct grammar including verb tenses and subject-verb agreement',
          'Use commas in greetings, closings, and lists',
          'Build vocabulary through word study and context clues',
          'Read and understand poetry and nonfiction texts',
          'Give simple presentations with confidence',
        ],
        sampleLessons: [
          '"Chapter Book Club: Reading and Discussing Together"',
          '"How-To Writing: Teaching Others a Skill"',
          '"Poetry Party: Exploring Rhyme and Rhythm"',
        ],
        endOfYearExpectation: 'Your child will read grade-level chapter books fluently, write organized paragraphs with clear focus, use proper grammar and punctuation, and communicate ideas effectively.',
      },
      science: {
        learningObjectives: 'Explore the physical and natural world through investigation and experimentation, recognizing patterns in God\'s creation.',
        keySkills: [
          'Understand properties of matter (solids, liquids, gases)',
          'Explore force, motion, and simple machines',
          'Investigate plant growth and needs',
          'Learn about habitats and ecosystems',
          'Study dinosaurs and fossils through a biblical worldview',
          'Understand the water cycle and weather patterns',
          'Explore Earth\'s surface: landforms and bodies of water',
          'Learn about the human body and the five senses in depth',
          'Conduct simple experiments using the scientific method',
        ],
        sampleLessons: [
          '"Matter Matters: Exploring Solids, Liquids, and Gases"',
          '"Simple Machines Scavenger Hunt: God\'s Design in Action"',
          '"The Water Cycle: God\'s Recycling System"',
        ],
        endOfYearExpectation: 'Your child will understand basic physical science concepts, conduct simple experiments, record observations scientifically, and see God\'s design in the natural world.',
      },
      history: {
        learningObjectives: 'Explore American history and world cultures, developing map skills and understanding how people live in different times and places.',
        keySkills: [
          'Learn about early American history and native peoples',
          'Study the Pilgrims and early settlements',
          'Understand the founding of the United States',
          'Learn about significant historical figures',
          'Develop map skills (compass rose, map key, cardinal directions)',
          'Compare and contrast different cultures and traditions',
          'Understand timelines and chronological order',
          'Learn about different forms of government',
          'Explore how technology has changed daily life over time',
        ],
        sampleLessons: [
          '"The Pilgrims\' Journey: Thanksgiving and Gratitude"',
          '"Map Explorers: Reading Maps and Finding Places"',
          '"Then and Now: How Life Has Changed"',
        ],
        endOfYearExpectation: 'Your child will understand key events in early American history, read maps with confidence, appreciate cultural differences, and understand how communities change over time.',
      },
      bible: {
        learningObjectives: 'Study the life of Jesus and New Testament stories while developing personal faith and Christian character.',
        keySkills: [
          'Learn about the birth and early life of Jesus',
          'Study Jesus\' ministry, miracles, and teachings',
          'Understand parables and their meanings',
          'Learn about Jesus\' disciples and followers',
          'Study the events of Holy Week (Palm Sunday, Crucifixion, Resurrection)',
          'Learn about the early church in Acts',
          'Memorize key New Testament verses',
          'Practice Christian virtues (patience, kindness, self-control)',
          'Develop a personal prayer life',
          'Understand the fruit of the Spirit',
        ],
        sampleLessons: [
          '"Jesus\' Miracles: Signs of God\'s Power and Love"',
          '"The Good Samaritan: Loving Our Neighbors"',
          '"Easter Story: The Greatest Gift"',
        ],
        endOfYearExpectation: 'Your child will know the life and teachings of Jesus Christ, apply parables to daily life, demonstrate the fruit of the Spirit in relationships, and grow in personal faith.',
      },
      electives: {
        learningObjectives: 'Expand creative expression, develop physical fitness, and build practical life skills through diverse activities.',
        keySkills: [
          'Art: Explore different art styles and create more detailed artwork',
          'Music: Learn basic music notation and play simple instruments',
          'Physical Education: Develop sports skills and understand fitness basics',
          'Life Skills: Time management, organization, and basic cooking',
          'Technology: Keyboarding practice and digital storytelling',
        ],
        sampleLessons: [
          '"Art Styles Exploration: Learning from the Masters"',
          '"Recorder Music: Playing Your First Instrument"',
          '"My Daily Schedule: Managing Time Wisely"',
        ],
        endOfYearExpectation: 'Your child will express creativity through various art forms, demonstrate basic music skills, show improved physical coordination, and manage daily responsibilities independently.',
      },
    },
    color: 'blue',
    icon: '🌟',
  },

  // ── 3RD GRADE ──
  {
    slug: '3',
    label: '3rd Grade',
    ageRange: '8-9',
    totalLessons: 200,
    heroTagline: 'Independent Learning Takes Flight!',
    milestones: [
      'Read chapter books fluently and discuss complex themes',
      'Master multiplication tables and solve multi-step word problems',
      'Write organized paragraphs with topic sentences and supporting details',
      'Conduct science experiments and record detailed observations',
    ],
    subjects: {
      math: {
        learningObjectives: 'Master fundamental operations and develop problem-solving strategies for real-world applications.',
        keySkills: [
          'Multiply and divide numbers up to 12×12 fluently',
          'Add and subtract 3-digit numbers with regrouping',
          'Understand fractions as parts of a whole (1/2, 1/4, 3/4)',
          'Solve multi-step word problems using various strategies',
          'Measure length, weight, and capacity using standard units',
          'Tell time to the nearest minute and calculate elapsed time',
          'Identify and analyze patterns in number sequences',
          'Work with money (making change, calculating totals)',
          'Understand area and perimeter of rectangles',
          'Collect, organize, and interpret data in graphs',
        ],
        sampleLessons: [
          '"Multiplication Masters — Use arrays, skip counting, and games to memorize facts"',
          '"Fraction Pizza Party — Cut real pizzas to understand equal parts"',
          '"Time Management Challenge — Calculate how long daily activities take"',
        ],
        endOfYearExpectation: 'Your child will solve complex problems independently, explain their mathematical thinking clearly, and apply math skills to real-life situations.',
      },
      english: {
        learningObjectives: 'Develop fluent reading comprehension and structured writing while expanding vocabulary and communication skills.',
        keySkills: [
          'Read chapter books at grade level with fluency and expression',
          'Analyze character motivations and plot development',
          'Write multi-paragraph stories with clear beginning, middle, and end',
          'Use proper grammar including subject-verb agreement and verb tenses',
          'Expand vocabulary through context clues and word study',
          'Research topics using multiple sources and take notes',
          'Give oral presentations with confidence and organization',
          'Edit and revise writing for clarity and correctness',
          'Understand different text types (fiction, nonfiction, poetry)',
          'Apply reading strategies for comprehension',
        ],
        sampleLessons: [
          '"Character Study Detective — Analyze why characters make specific choices"',
          '"Research Reporter — Investigate topics and present findings to family"',
          '"Grammar Games — Master parts of speech through interactive activities"',
        ],
        endOfYearExpectation: 'Your child will read independently for pleasure and information, write organized multi-paragraph pieces, and communicate ideas effectively both verbally and in writing.',
      },
      science: {
        learningObjectives: 'Explore scientific concepts through hands-on investigation while understanding God as the Master Designer.',
        keySkills: [
          'Understand the scientific method and conduct controlled experiments',
          'Classify living things by characteristics and habitats',
          'Explore states of matter and simple chemical changes',
          'Study weather patterns, climate, and the water cycle',
          'Investigate forces and motion through experimentation',
          'Learn about ecosystems and food chains',
          'Understand basic human body systems',
          'Explore rocks, minerals, and Earth\'s layers',
          'Practice measurement, observation, and data recording',
          'Connect scientific discoveries to God\'s intelligent design',
        ],
        sampleLessons: [
          '"Kitchen Chemistry — Safe experiments with baking soda, vinegar, and more"',
          '"Backyard Ecosystem — Study the living community in your yard"',
          '"Weather Station — Track local weather patterns and make predictions"',
        ],
        endOfYearExpectation: 'Your child will think like a scientist, conduct experiments safely, record detailed observations, and see evidence of God\'s design in natural phenomena.',
      },
      history: {
        learningObjectives: 'Explore American history foundations and world cultures while developing research and critical thinking skills.',
        keySkills: [
          'Understand Native American cultures before European arrival',
          'Learn about early European exploration and colonization',
          'Study the founding of American colonies and reasons for settlement',
          'Explore daily life in colonial America',
          'Understand basic geography of North America',
          'Compare and contrast different historical time periods',
          'Use primary sources like letters, photographs, and artifacts',
          'Create timelines and understand cause-and-effect relationships',
          'Appreciate diverse cultures and their contributions',
          'Connect historical events to modern life',
        ],
        sampleLessons: [
          '"Colonial Day Experience — Live like a colonial family for a day"',
          '"Native American Cultures — Study diverse tribes and their traditions"',
          '"Explorer\'s Journal — Write diary entries from an explorer\'s perspective"',
        ],
        endOfYearExpectation: 'Your child will understand how America began, appreciate different cultures, think critically about historical events, and make connections between past and present.',
      },
      bible: {
        learningObjectives: "Deepen understanding of God's character through Old Testament stories while applying biblical principles to daily life.",
        keySkills: [
          'Study major Old Testament figures (Abraham, Moses, David, Daniel)',
          "Understand God's covenant relationship with His people",
          'Learn about the Ten Commandments and their relevance today',
          'Explore how God guides and protects His people',
          'Memorize key Bible verses about faith, courage, and obedience',
          'Apply biblical principles to real-life situations and decisions',
          'Understand prayer as communication with God',
          'Learn about different forms of worship and praise',
          'Practice Christian virtues like forgiveness, courage, and integrity',
          'See Jesus foreshadowed in Old Testament stories',
        ],
        sampleLessons: [
          '"Courage Like David — Learn to face fears with God\'s help"',
          '"Desert Journey — Follow the Israelites and learn about trusting God"',
          '"Wisdom from Proverbs — Apply biblical wisdom to childhood challenges"',
        ],
        endOfYearExpectation: "Your child will have a deeper relationship with God, understand His faithfulness throughout history, and confidently apply biblical principles to their daily choices and relationships.",
      },
      electives: {
        learningObjectives: 'Expand creativity, develop practical skills, and explore personal interests through structured activities.',
        keySkills: [
          'Art: Master various techniques including painting, drawing, and sculpture',
          'Music: Read basic musical notation and play simple instruments',
          'Physical Education: Develop coordination through sports and fitness activities',
          'Technology: Use computers for research, typing, and educational programs',
          'Life Skills: Organization, time management, and basic cooking/household tasks',
          'Foreign Language: Introduction to Spanish or another language (optional)',
        ],
        sampleLessons: [
          '"Art Through the Ages — Create masterpieces in different historical styles"',
          '"Fitness Challenge — Set and achieve personal physical goals"',
          '"Technology Projects — Create presentations and simple digital stories"',
        ],
        endOfYearExpectation: 'Your child will express creativity confidently, demonstrate improved physical coordination, use technology appropriately, and show increased independence in daily tasks.',
      },
    },
    color: 'amber',
    icon: '🚀',
  },
]

export const SUBJECT_INFO = {
  math: { label: 'Mathematics', icon: '🔢', description: 'Number sense through advanced concepts — counting to multiplication, with hands-on activities.' },
  english: { label: 'Language Arts', icon: '📖', description: 'Reading, writing, grammar, and composition. From phonics to multi-paragraph essays.' },
  science: { label: 'Science', icon: '🔬', description: "Exploring God's creation through observation, experiments, and scientific investigation." },
  history: { label: 'History & Geography', icon: '🌍', description: 'American and world history through a Christian lens, with geography woven in.' },
  bible: { label: 'Bible & Character', icon: '✝️', description: 'Scripture, theology, and character formation — the foundation of all learning.' },
  electives: { label: 'Electives', icon: '🎨', description: 'Art, music, PE, technology, and life skills to develop the whole child.' },
}

export const GRADE_BANDS = [
  {
    label: 'K–2nd: Foundations',
    range: 'Ages 5–8',
    description: 'Building the core skills of reading, writing, and arithmetic while nurturing curiosity, faith, and character.',
    grades: ['k', '1', '2'],
  },
  {
    label: '3rd: Independence',
    range: 'Ages 8–9',
    description: 'Transitioning from "learning to read" to "reading to learn." Multiplication, multi-paragraph writing, and scientific investigation.',
    grades: ['3'],
  },
]
