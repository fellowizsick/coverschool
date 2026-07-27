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
        { title: 'Two-Digit Facts', summary: 'Lets add big numbers! Start with 20 + 30. Count by tens: 20, 30, 40, 50! Try adding 40 + 20 with your toys.' },
        { title: 'Word Problems', summary: 'Lets solve fun number stories! Sam has 25 stickers and gets 30 more. How many does he have now? Draw pictures to help you add and subtract.' },
        { title: 'Even & Odd', summary: 'Lets sort numbers into two groups! Even numbers can be split into pairs with no one left over. Odd numbers always have one left over. Try this: Count your toys and see if you have an even or odd number!' },
      ], questions: [
        { id: '2-M-Q1-1', q: '23 + 14 = ?', type: 'mc', options: ['37', '38', '36'], answer: 0 },
        { id: '2-M-Q1-2', q: 'Is 8 even or odd?', type: 'short', answer: 'even' },
      ]},
      { name: 'Q2 — Place Value & Money', lessons: [
        { title: 'Hundreds', summary: 'Lets count to one hundred! Stack up 100 pennies or blocks. Can you make 10 groups of 10? Count by tens: 10, 20, 30... all the way to 100!' },
        { title: 'Count Bills', summary: 'Lets count money! Put some dollar bills on the table. Count each bill: one, two, three! How many bills do you have?' },
        { title: 'Make Change', summary: 'You buy a toy for 3 cents. You pay with 5 cents. How much money do you get back? Practice with real pennies and nickels from a jar!' },
      ], questions: [
        { id: '2-M-Q2-1', q: 'Value of 5 in 352?', type: 'mc', options: ['5', '50', '500'], answer: 1 },
        { id: '2-M-Q2-2', q: 'How many quarters in $1?', type: 'short', answer: '4' },
      ]},
      { name: 'Q3 — Intro Multiplication', lessons: [
        { title: 'Equal Groups', summary: 'Lets make equal groups! Put 6 toys into 2 piles with the same amount in each pile. Count how many are in each group - they should match!' },
        { title: 'Times Tables 2,5,10', summary: 'Lets skip count together! Count by 2s: 2, 4, 6, 8, 10. Now try 5s: 5, 10, 15, 20! Find pairs of socks and count them by 2s.' },
        { title: 'Arrays', summary: 'Lets make rows with toys! Put 3 toys in a line. Now make 2 more rows with 3 toys each. Count all your toys!' },
      ], questions: [
        { id: '2-M-Q3-1', q: '3 × 4 = ?', type: 'mc', options: ['7', '12', '9'], answer: 1 },
        { id: '2-M-Q3-2', q: '5 × 10 = ?', type: 'short', answer: '50' },
      ]},
      { name: 'Q4 — Measurement & Fractions', lessons: [
        { title: 'Inches & Centimeters', summary: 'We can measure things with rulers! Find a crayon and measure how long it is. Is your crayon more inches or more centimeters long?' },
        { title: 'Tell Time (Half Hour)', summary: 'Look at the clock! When the big hand points to 6, it means half past the hour. Draw a clock showing 2:30 - put the little hand between 2 and 3, and the big hand on 6.' },
        { title: 'Halves & Fourths', summary: 'Lets cut a cookie in half! Draw a line down the middle of a circle. Now you have two equal pieces called halves!' },
      ], questions: [
        { id: '2-M-Q4-1', q: 'How many halves make a whole?', type: 'mc', options: ['2', '3', '4'], answer: 0 },
        { id: '2-M-Q4-2', q: 'A clock showing 3:30 is ___', type: 'mc', options: ['half past three', 'quarter to three', 'three o’clock'], answer: 0 },
      ]},
    ]},
    { name: 'Language Arts', units: [
      { name: 'Q1 — Reading Fluency', lessons: [
        { title: 'Chapter Books', summary: 'Chapter books have many pages. We can read a little bit each day. Lets find a chapter book and count how many chapters it has!' },
        { title: 'Main Idea & Details', summary: 'Stories have a big idea. The big idea is what the story is about. Find one thing that happens in your favorite book!' },
        { title: 'Sequencing', summary: 'First we wake up. Then we eat breakfast. Last we go to school. Can you put three pictures in the right order?' },
      ], questions: [
        { id: '2-L-Q1-1', q: 'The main idea is ___', type: 'mc', options: ['the most important point', 'the last word', 'a picture'], answer: 0 },
        { id: '2-L-Q1-2', q: 'What comes after "first"?', type: 'mc', options: ['last', 'next', 'never'], answer: 1 },
      ]},
      { name: 'Q2 — Grammar', lessons: [
        { title: 'Nouns & Pronouns', summary: 'A noun is a person, place, or thing. A pronoun takes the place of a noun, like "he" or "she." Point to things around you and say if they are nouns!' },
        { title: 'Verbs (Past/Tense)', summary: 'Yesterday I played with my toy. Today I play with my toy. Can you tell me what you did yesterday? Draw a picture of something fun you did!' },
        { title: 'Adjectives', summary: 'Adjectives tell us about things! The cat is fluffy. The ball is red. Look around and find something big, then find something small!' },
      ], questions: [
        { id: '2-L-Q2-1', q: 'Which is a pronoun?', type: 'mc', options: ['she', 'run', 'red'], answer: 0 },
        { id: '2-L-Q2-2', q: 'Past of "walk" is ___', type: 'short', answer: 'walked' },
      ]},
      { name: 'Q3 — Writing', lessons: [
        { title: 'Paragraphs', summary: 'A paragraph is a group of sentences about one thing. All the sentences talk about the same idea. Write three sentences about your pet or toy!' },
        { title: 'Narrative', summary: 'A story tells what happens to someone. You can write about your day or make up fun things! Draw a picture first, then write one sentence about it.' },
        { title: 'Friendly Letter', summary: 'Lets write a letter to a friend! Start with "Dear" and your friends name. Draw a picture and write one nice thing about them.' },
      ], questions: [
        { id: '2-L-Q3-1', q: 'A paragraph starts with a ___ sentence.', type: 'mc', options: ['topic', 'ending', 'question'], answer: 0 },
        { id: '2-L-Q3-2', q: 'Which is a proper greeting for a friendly letter?', type: 'mc', options: ['Dear Mom,', 'Hey you,', 'To whoever,'], answer: 0 },
      ]},
      { name: 'Q4 — Poetry & Drama', lessons: [
        { title: 'Rhyme & Rhythm', summary: 'Words can sound the same at the end! Cat and hat rhyme. Clap your hands while you say "hop, hop, hop" to make a beat!' },
        { title: 'Plays', summary: 'Plays are fun stories that people act out! You can pretend to be anyone you want. Lets act like a cat - get on your hands and knees and meow!' },
        { title: 'Book Report', summary: 'Lets tell friends about our favorite book! Draw a picture of the best part. Show your picture and say why you loved the book.' },
      ], questions: [
        { id: '2-L-Q4-1', q: 'A poem often has ___', type: 'mc', options: ['rhyme', 'only facts', 'no lines'], answer: 0 },
        { id: '2-L-Q4-2', q: "Who might be the author of a children's book?", type: 'mc', options: ['Dr. Seuss', 'Your teacher', 'The librarian', 'A famous chef'], answer: 0 },
      ]},
    ]},
    { name: 'Spelling & Word Origins', units: [
      { name: 'Q1 — Long Vowel Patterns', lessons: [
        { title: 'List 1: -ight/-ain', summary: 'Look at the bright light! Can you find words that sound like "night" and "rain"? Draw a picture of rain falling at night.' },
        { title: 'List 2: -oat/-eed', summary: 'Lets find words that end in -oat and -eed! A goat can float on a boat. We need to feed and weed the seed. Circle all the -oat and -eed words you can find in your favorite book!' },
        { title: 'Origin: "night"', summary: 'The word "night" came from long ago. People said it to mean dark time. Can you say "night" and listen to the long i sound? **Activity:** Look outside your window. Is it day or night right now?' },
      ], questions: [
        { id: '2-SP-Q1-1', q: 'Which word rhymes with "light"?', type: 'mc', options: ['night', 'dark', 'heavy'], answer: 0 },
        { id: '2-SP-Q1-2', q: '"night" is an ___ word.', type: 'mc', options: ['old English', 'French', 'Spanish'], answer: 0 },
      ]},
      { name: 'Q2 — R-Controlled & Digraphs', lessons: [
        { title: 'List 3: -ar/-or', summary: 'Lets find -ar and -or words! Look around your room for a jar, car toy, or fork. Can you make the "ar" and "or" sounds like a pirate? Arrr!' },
        { title: 'List 4: -th/-wh', summary: 'Lets find -th and -wh sounds! Say "thumb" and feel your tongue touch your teeth. Now say "when" and feel the air puff out. Draw a whale with a thick tail!' },
        { title: 'Origin: "star"', summary: 'Look up at the night sky! Can you see the bright stars? Draw a star and say "star" - do you hear the "ar" sound?' },
      ], questions: [
        { id: '2-SP-Q2-1', q: 'Which has r-controlled sound?', type: 'mc', options: ['car', 'cat', 'cap'], answer: 0 },
        { id: '2-SP-Q2-2', q: 'Which word starts with "wh"?', type: 'mc', options: ['what', 'hat', 'cat'], answer: 0 },
      ]},
      { name: 'Q3 — Compound Words', lessons: [
        { title: 'List 5: sunlight, rainbow, bedroom', summary: 'Compound words are two words stuck together! Sunlight is sun + light. Rainbow is rain + bow. Bedroom is bed + room. Draw a picture of sunlight in your bedroom window!' },
        { title: 'List 6: football, notebook, sunlight', summary: 'Lets make compound words! Put two small words together to make one big word. Football is foot + ball! Draw a picture of sunlight. Can you write sun + light under it?' },
        { title: 'Origin: "sun"', summary: 'The sun is bright and warm! We can make new words with "sun" like sunshine, sunset, and sunflower. Draw a big sun and write "sun" words around it like sunbeam and Sunday!' },
      ], questions: [
        { id: '2-SP-Q3-1', q: '"rainbow" is a ___ word.', type: 'mc', options: ['compound', 'short', 'foreign'], answer: 0 },
        { id: '2-SP-Q3-2', q: 'Which is a compound word?', type: 'mc', options: ['sunshine', 'happy', 'run'], answer: 0 },
      ]},
      { name: 'Q4 — Review', lessons: [
        { title: 'Master List', summary: 'Lets make a list of fun things! Write down your favorite toys. Can you add three more things you love?' },
        { title: 'Word Origins Recap', summary: 'Words come from many places! Some words are old and some are new. Draw a picture of your favorite word and tell someone where you think it came from!' },
        { title: 'Dictation', summary: 'Lets play dictation! I will say a word and you write it down. Can you write "cat" when I say it?' },
      ], questions: [
        { id: '2-SP-Q4-1', q: 'Write the word: "bright".', type: 'short', answer: 'bright' },
        { id: '2-SP-Q4-2', q: 'A compound word is made of ___', type: 'mc', options: ['two words', 'one letter', 'numbers'], answer: 0 },
      ]},
    ]},
    { name: 'Science', units: [
      { name: 'Q1 — Habitats', lessons: [
        { title: 'Forest & Rainforest', summary: 'Trees grow tall in forests. Animals like bears and birds live there. Draw your favorite forest animal on paper!' },
        { title: 'Ocean & Desert', summary: 'The ocean is wet and salty. The desert is hot and dry. Draw a fish in the ocean and a cactus in the desert!' },
        { title: 'Food Chains', summary: 'Animals eat other animals to stay alive. A mouse eats seeds, then a snake eats the mouse! Draw a line from grass to rabbit to fox.' },
      ], questions: [
        { id: '2-SC-Q1-1', q: 'A plant is a ___ in a food chain.', type: 'mc', options: ['producer', 'consumer', 'decomposer'], answer: 0 },
        { id: '2-SC-Q1-2', q: 'Fish live in the ___ habitat.', type: 'mc', options: ['ocean', 'desert', 'forest floor'], answer: 0 },
      ]},
      { name: 'Q2 — Matter & Energy', lessons: [
        { title: 'Properties of Matter', summary: 'Look around you! Everything you can touch is made of matter. Find something hard like a rock, then find something soft like a pillow.' },
        { title: 'Heat & Light', summary: 'The sun gives us heat and light. When you stand in the sun, you feel warm! Try this: Put one hand in the sun and one in shade. Which hand feels warmer?' },
        { title: 'Simple Machines', summary: 'Simple machines help us do work easier. A lever is like a seesaw that lifts things up. Find a spoon and use it to lift a toy - thats a lever too!' },
      ], questions: [
        { id: '2-SC-Q2-1', q: 'A lever helps us ___', type: 'mc', options: ['lift heavy things', 'sleep', 'eat'], answer: 0 },
        { id: '2-SC-Q2-2', q: 'The sun gives ___ and light.', type: 'short', answer: 'heat' },
      ]},
      { name: 'Q3 — Earth', lessons: [
        { title: 'Rocks & Soil', summary: 'Rocks are everywhere around us! Look outside and find three different rocks. Feel how some rocks are smooth and others are bumpy.' },
        { title: 'Water Cycle', summary: 'Water goes up to the clouds when the sun heats it. Then it falls back down as rain! Put a cup outside and see if rain fills it up.' },
        { title: 'Weather Tools', summary: 'Weather tools help us learn about the weather. A thermometer tells us if it is hot or cold. Go outside and feel if the air is warm or cool on your skin!' },
      ], questions: [
        { id: '2-SC-Q3-1', q: 'Clouds make rain through ___', type: 'mc', options: ['condensation', 'evaporation', 'melting'], answer: 0 },
        { id: '2-SC-Q3-2', q: 'We measure temperature with a ___', type: 'short', answer: 'thermometer' },
      ]},
      { name: 'Q4 — Space', lessons: [
        { title: 'The Solar System', summary: 'Our sun is a big bright star. Eight planets go around the sun in a circle. Lets spin around like a planet! Turn in a slow circle and count to ten.' },
        { title: 'Day & Night', summary: 'The sun makes day when it shines on us. When we cant see the sun, it gets dark and makes night. Get a flashlight and shine it on your toy - now you made day for your toy!' },
        { title: 'Seasons', summary: 'Earth moves around the sun in one year. This makes our seasons change! Draw a picture of your favorite season and show someone special.' },
      ], questions: [
        { id: '2-SC-Q4-1', q: 'How many planets orbit the sun?', type: 'mc', options: ['8', '9', '7'], answer: 0 },
        { id: '2-SC-Q4-2', q: 'Earth spins to make ___ and night.', type: 'short', answer: 'day' },
      ]},
    ]},
    { name: 'History & Geography', units: [
      { name: 'Q1 — Native Peoples', lessons: [
        { title: 'First Americans', summary: 'Long ago, people lived here first. They made homes and found food. Draw a picture of your home and the food you like to eat!' },
        { title: 'Map Skills', summary: 'Lets look at a map! Maps show us where places are. Find your home state on a map and point to it with your finger.' },
        { title: 'Regions of US', summary: 'Native people lived all over America. Some lived where it was hot. Some lived where it was cold. Draw a picture of your home and the weather outside today.' },
      ], questions: [
        { id: '2-H-Q1-1', q: 'The ___ were the first people in America.', type: 'mc', options: ['Native Americans', 'Europeans', 'Asians'], answer: 0 },
        { id: '2-H-Q1-2', q: 'Alabama is in the ___ region.', type: 'mc', options: ['South', 'West', 'Northeast'], answer: 0 },
      ]},
      { name: 'Q2 — Explorers', lessons: [
        { title: 'Early Explorers', summary: 'Long ago, brave people sailed on big boats to find new places. They were called explorers! Draw a map of your house and mark where you keep your favorite toy.' },
        { title: 'Colonies', summary: 'Lets play house far away! Long ago, people sailed across the ocean to start new homes. Can you build a tiny village with blocks or toys?' },
        { title: 'Thanksgiving', summary: 'Lets think about good things! What makes you happy today? Draw three things you love and share them with someone special.' },
      ], questions: [
        { id: '2-H-Q2-1', q: 'Explorers came looking for ___', type: 'mc', options: ['new lands and trade', 'the moon', 'gold only'], answer: 0 },
        { id: '2-H-Q2-2', q: 'The first Thanksgiving was shared by two peoples: ___', type: 'mc', options: ['settlers and Native Americans', 'two armies', 'kings'], answer: 0 },
      ]},
      { name: 'Q3 — Government', lessons: [
        { title: 'Community to Country', summary: 'Your family lives in a neighborhood. Many neighborhoods make a town. Many towns make our whole country! Draw a picture of your house, then your street, then your town.' },
        { title: 'Three Branches', summary: 'Our country has three groups that help make rules. They work together like a team! Draw three circles and put one person in each circle.' },
        { title: 'The Constitution', summary: 'The Constitution is like rules for our whole country. It tells grown-ups how to be fair leaders. Draw a picture of your familys rules at home!' },
      ], questions: [
        { id: '2-H-Q3-1', q: 'The President is part of the ___ branch.', type: 'mc', options: ['executive', 'judicial', 'legislative'], answer: 0 },
        { id: '2-H-Q3-2', q: 'Our country’s rule book is the ___', type: 'short', answer: 'Constitution' },
      ]},
      { name: 'Q4 — Alabama', lessons: [
        { title: 'Our State', summary: 'We live in Alabama! Alabama is our state. Draw a picture of your home and family in Alabama.' },
        { title: 'State History', summary: 'Alabama became a state long ago. Native Americans lived here first. Draw a picture of your family and where you live in Alabama today!' },
        { title: 'Good Citizens', summary: 'Good citizens help others and follow rules. They are kind to friends and family. Draw a picture of yourself helping someone you love.' },
      ], questions: [
        { id: '2-H-Q4-1', q: 'The capital of Alabama is ___', type: 'mc', options: ['Montgomery', 'Birmingham', 'Mobile'], answer: 0 },
        { id: '2-H-Q4-2', q: 'What is one way to be a good citizen?', type: 'mc', options: ['Follow the rules', 'Litter everywhere', 'Be mean to neighbors'], answer: 0 },
      ]},
    ]},
    { name: 'Bible & Character', units: [
      { name: 'Q1 — Old Testament Heroes', lessons: [
        { title: 'Moses', summary: 'Moses was a brave man who helped Gods people. God told Moses to lead them out of a bad place. Moses listened to God and helped many people get free. Activity: Find a stick outside. Hold it up high like Moses did with his special stick!' },
        { title: 'David', summary: 'David was a brave boy who loved God. He took care of sheep and played music. God chose David to be a great king! Activity: Pretend to be a shepherd like David! Walk around your room and count your stuffed animals like they are sheep.' },
        { title: 'Esther', summary: 'Esther was a brave queen who saved her people. She asked the king to help them. You can be brave like Esther! Draw a crown and wear it. Practice asking for help when you need it.' },
      ], questions: [
        { id: '2-B-Q1-1', q: 'David beat Goliath with a ___', type: 'mc', options: ['sling', 'sword', 'shield'], answer: 0 },
        { id: '2-B-Q1-2', q: 'Esther showed ___ for her people.', type: 'mc', options: ['courage', 'fear', 'anger'], answer: 0 },
      ]},
      { name: 'Q2 — The Psalms', lessons: [
        { title: 'Psalm 23', summary: 'God takes care of you like a shepherd takes care of sheep. You are safe with God! Draw a picture of yourself with Jesus as your good shepherd.' },
        { title: 'Praise Songs', summary: 'The book of Psalms has songs to God! King David wrote many happy songs. Lets clap our hands and sing a thank you song to God today!' },
        { title: 'Trust', summary: 'God loves you so much! You can trust Him like you trust Mom and Dad. Lets make a trust circle - hold hands with your family and say "I trust God!"' },
      ], questions: [
        { id: '2-B-Q2-1', q: 'Psalm 23 says "The Lord is my ___".', type: 'mc', options: ['shepherd', 'king', 'teacher'], answer: 0 },
        { id: '2-B-Q2-2', q: 'We praise God by ___', type: 'mc', options: ['singing', 'hiding', 'yelling'], answer: 0 },
      ]},
      { name: 'Q3 — Jesus’ Teachings', lessons: [
        { title: 'The Good Samaritan', summary: 'Jesus told a story about a kind man who helped someone who was hurt. The kind man was a good neighbor. You can be a good neighbor too by helping others. Activity: Draw a picture of yourself helping a friend. Show how you can be kind like the good man in Jesus story.' },
        { title: 'The Prodigal Son', summary: 'A son left home and spent all his money. When he came back, his dad hugged him tight! God loves us even when we make mistakes. **Activity:** Draw a picture of someone giving you a big hug!' },
        { title: 'The Sermon on the Mount', summary: 'Jesus sat on a hill and taught people how to be kind. He said to love others and share what you have. Jesus wants us to be good friends to everyone. **Activity:** Draw a picture of yourself being kind to a friend. Show yourself sharing a toy or giving a hug!' },
      ], questions: [
        { id: '2-B-Q3-1', q: 'The Good Samaritan taught us to love our ___', type: 'mc', options: ['neighbor', 'enemy only', 'self'], answer: 0 },
        { id: '2-B-Q3-2', q: 'The father welcomed his son with ___', type: 'mc', options: ['forgiveness', 'anger', 'silence'], answer: 0 },
      ]},
      { name: 'Q4 — Character', lessons: [
        { title: 'Honesty', summary: 'Being honest means telling the truth. When you break something, tell a grown-up right away. Try this: Tell someone one true thing about your day today.' },
        { title: 'Forgiveness', summary: 'When someone hurts your feelings, you can choose to forgive them. Forgiving means you dont stay mad. Try saying "I forgive you" to someone today.' },
        { title: 'Service', summary: 'Service means helping others. You can help at home by putting your toys away. Try helping someone today!' },
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
        { title: 'Tables 0-12', summary: 'Lets learn our times tables! Start with 2 times 2. Count by twos: 2, 4, 6, 8! Use your toy cars to make groups of two and count them all up.' },
        { title: 'Word Problems', summary: 'Lets solve fun stories with numbers! If you have 2 bags with 3 apples each, how many apples total? Draw the bags and count all the apples you drew.' },
        { title: 'Division Intro', summary: 'Lets share treats with friends! Put 8 cookies in groups of 2. How many groups did you make? Try it with toys too!' },
      ], questions: [
        { id: '3-M-Q1-1', q: '7 × 8 = ?', type: 'mc', options: ['54', '56', '49'], answer: 1 },
        { id: '3-M-Q1-2', q: '12 ÷ 3 = ?', type: 'short', answer: '4' },
      ]},
      { name: 'Q2 — Fractions', lessons: [
        { title: 'Numerator & Denominator', summary: 'A fraction has two parts! The top number is the numerator. The bottom number is the denominator. Draw a circle and cut it into 4 parts. Color 2 parts red. You made 2/4!' },
        { title: 'Equivalent Fractions', summary: 'Two pieces make one half. Four pieces make two halves. They are the same size! Cut a cookie in half, then cut each half again. You made fourths!' },
        { title: 'Compare & Add', summary: 'Lets play with pizza slices! Cut a paper circle in half. Now you have 2 pieces that are the same size. Put them back together to make one whole pizza!' },
      ], questions: [
        { id: '3-M-Q2-1', q: '1/2 + 1/4 = ?', type: 'mc', options: ['3/4', '2/6', '1'], answer: 0 },
        { id: '3-M-Q2-2', q: 'Which is bigger: 1/3 or 1/4?', type: 'mc', options: ['1/3', '1/4', 'equal'], answer: 0 },
      ]},
      { name: 'Q3 — Area & Perimeter', lessons: [
        { title: 'Perimeter', summary: 'Perimeter is going around the edge of something. Lets walk around your bed and count your steps. Try tracing around a book with your finger!' },
        { title: 'Area', summary: 'Area is how much space something takes up. Put your hand on this page. Your hand covers the area! Now try covering a book with small blocks to see its area.' },
        { title: 'Word Problems', summary: 'Lets solve fun puzzles with shapes! A garden is 4 steps long and 3 steps wide. Walk around your room and count your steps to find how far you went!' },
      ], questions: [
        { id: '3-M-Q3-1', q: 'Perimeter of 3×5 rectangle?', type: 'mc', options: ['16', '15', '8'], answer: 0 },
        { id: '3-M-Q3-2', q: 'Area of 3×5 rectangle?', type: 'short', answer: '15' },
      ]},
      { name: 'Q4 — Graphs & Time', lessons: [
        { title: 'Bar & Pictographs', summary: 'Lets make a graph with toys! Count your cars, dolls, and blocks. Draw a picture for each one in rows. Which row is longest?' },
        { title: 'Telling Time', summary: 'Look at the clock on the wall! The short hand shows the hour and the long hand shows the minutes. Draw a clock and put the hands where you want!' },
        { title: 'Elapsed Time', summary: 'Lets see how time passes! Look at a clock when you start playing. Look again when you stop. How long did you play?' },
      ], questions: [
        { id: '3-M-Q4-1', q: 'A bar graph shows ___', type: 'mc', options: ['amounts', 'colors', 'sounds'], answer: 0 },
        { id: '3-M-Q4-2', q: 'From 2:00 to 2:30 is ___ minutes.', type: 'short', answer: '30' },
      ]},
    ]},
    { name: 'Language Arts', units: [
      { name: 'Q1 — Reading', lessons: [
        { title: 'Genres', summary: 'Books come in different types! Some books tell made-up stories. Other books teach us real facts. Look around and find one story book and one fact book!' },
        { title: 'Context Clues', summary: 'When you see a new word, look at the other words around it. They can help you guess what it means! Circle the words that give you clues about the new word.' },
        { title: 'Summarize', summary: 'Lets tell the big ideas! Read a short story with me. Then we can tell someone what happened in just a few words. Draw your favorite part!' },
      ], questions: [
        { id: '3-L-Q1-1', q: 'A story about a real person’s life is a ___', type: 'mc', options: ['biography', 'fable', 'poem'], answer: 0 },
        { id: '3-L-Q1-2', q: 'Context clues help you ___', type: 'mc', options: ['guess a word’s meaning', 'spell', 'count'], answer: 0 },
      ]},
      { name: 'Q2 — Grammar', lessons: [
        { title: 'Plural Nouns', summary: 'One cat becomes two cats! We add an "s" to make more than one. Find three toys in your room and say their names with "s" at the end.' },
        { title: 'Verb Tenses', summary: 'Verbs are action words like run, jump, and eat! Yesterday I walked to school. Today I walk to school. Tomorrow I will walk to school. **Activity:** Act out three actions - one you did yesterday, one youre doing now, and one youll do tomorrow!' },
        { title: 'Comparatives', summary: 'A cat is big. An elephant is bigger! Find two toys. Which one is bigger?' },
      ], questions: [
        { id: '3-L-Q2-1', q: 'Plural of "child"?', type: 'mc', options: ['childs', 'children', 'childes'], answer: 1 },
        { id: '3-L-Q2-2', q: 'Comparative of "small" is ___', type: 'short', answer: 'smaller' },
      ]},
      { name: 'Q3 — Writing', lessons: [
        { title: 'Opinion Paragraph', summary: 'Tell everyone what you like best! Ice cream or cake? Dogs or cats? Write one sentence about your pick. Draw a picture to show why you love it most!' },
        { title: 'Informative', summary: 'Lets tell someone something new! Pick your favorite animal. Write two things about it that are true.' },
        { title: 'Narrative', summary: 'A story tells what happens to someone. You can write about your day or make up fun things! Draw a picture first, then write about what you see.' },
      ], questions: [
        { id: '3-L-Q3-1', q: 'An opinion paragraph needs ___', type: 'mc', options: ['reasons', 'no point', 'only facts'], answer: 0 },
        { id: '3-L-Q3-2', q: 'Which sentence states an opinion?', type: 'mc', options: ['I think pizza is the best food.', 'The sun is hot.', 'Birds can fly.'], answer: 0 },
      ]},
      { name: 'Q4 — Cursive & Research', lessons: [
        { title: 'Cursive Intro', summary: 'Lets learn cursive writing! Cursive letters connect together like holding hands. Try tracing the letter a in the air with your finger.' },
        { title: 'Dictionary Skills', summary: 'A dictionary helps us find words! Lets look up your name or a pets name. Can you find the first letter of your name in the dictionary?' },
        { title: 'Simple Report', summary: 'Lets write about your favorite animal! Pick one animal you love. Draw a picture and write three things about it.' },
      ], questions: [
        { id: '3-L-Q4-1', q: 'Guide words in a dictionary show the ___', type: 'mc', options: ['first and last words on page', 'meaning', 'spelling'], answer: 0 },
        { id: '3-L-Q4-2', q: 'Which is an example of a fact you might learn?', type: 'mc', options: ['The Earth is round.', 'I like ice cream.', 'Math is boring.'], answer: 0 },
      ]},
    ]},
    { name: 'Spelling & Word Origins', units: [
      { name: 'Q1 — Latin Roots Begin', lessons: [
        { title: 'List 1: -spect/-dict', summary: 'Lets look for word parts! The part "spect" means to look or see. The part "dict" means to say or tell. Can you find these parts in words around your house?' },
        { title: 'Root: spect = "look"', summary: 'The word part "spect" means "look." When you inspect a toy, you look at it closely. Lets play detective and inspect things around you! **Activity:** Pick up a toy or book. Inspect it by looking at every part. What colors and shapes do you see?' },
        { title: 'Root: dict = "say"', summary: 'The word part "dict" means "say." When you predict something, you say what might happen next. Lets play! Say three words that have "dict" in them like "predict."' },
      ], questions: [
        { id: '3-SP-Q1-1', q: '"inspect" means to look ___ something.', type: 'mc', options: ['at', 'for', 'under'], answer: 0 },
        { id: '3-SP-Q1-2', q: 'The root "dict" means ___', type: 'mc', options: ['say', 'look', 'write'], answer: 0 },
      ]},
      { name: 'Q2 — Greek Roots', lessons: [
        { title: 'List 2: -phone/-graph', summary: 'Lets find sounds and pictures! Look around your room for a phone or photo. Can you say "phone" and "graph" like in photograph? **Activity:** Draw a picture of yourself talking on a phone!' },
        { title: 'Root: phone = "sound"', summary: 'The word "phone" means sound! When you talk on a phone, you hear sounds. Can you make three different sounds with your mouth right now?' },
        { title: 'Root: graph = "write"', summary: 'The word "graph" means write. When you see "graph" in a word, it talks about writing! Lets draw a picture and write your name under it.' },
      ], questions: [
        { id: '3-SP-Q2-1', q: '"telephone" carries ___ far away.', type: 'mc', options: ['sound', 'light', 'water'], answer: 0 },
        { id: '3-SP-Q2-2', q: '"photograph" means writing with ___', type: 'mc', options: ['light', 'sound', 'hand'], answer: 0 },
      ]},
      { name: 'Q3 — Prefixes', lessons: [
        { title: 'List 3: un-, re-, pre-', summary: 'Lets play with word parts! The letters un-, re-, and pre- go at the start of words. Can you find three things to undo, redo, or prepare?' },
        { title: 'Prefix: un- = "not"', summary: 'The word "un" means "not." When you add "un" to "happy," it makes "unhappy," which means "not happy." Circle all the "un" words you can find in your favorite book!' },
        { title: 'Prefix: pre- = "before"', summary: 'The word part "pre" means before. When you preview a book, you look at it before reading it. Preschool comes before big kid school. Activity: Look around and find something that starts with "pre" like pretzel or present!' },
      ], questions: [
        { id: '3-SP-Q3-1', q: '"unhappy" means ___', type: 'mc', options: ['not happy', 'very happy', 'happy again'], answer: 0 },
        { id: '3-SP-Q3-2', q: '"preview" means to see it ___', type: 'mc', options: ['before', 'after', 'never'], answer: 0 },
      ]},
      { name: 'Q4 — Review', lessons: [
        { title: 'Master List', summary: 'Look at all the things you learned! Make a list of your favorite words. Draw pictures next to each word you write down.' },
        { title: 'Root Recap', summary: 'Lets hunt for word roots! Find a book and look for words that start the same way. Can you spot "un-" words like "unhappy" or "undo"?' },
        { title: 'Use Roots', summary: 'Lets find word roots! The word "play" is in "playing" and "played." Can you find the root word "jump" in "jumping"?' },
      ], questions: [
        { id: '3-SP-Q4-1', q: 'Which word contains the root "graph" (meaning write)?', type: 'mc', options: ['photograph', 'elephant', 'running'], answer: 0 },
        { id: '3-SP-Q4-2', q: 'Knowing roots helps you ___ new words.', type: 'mc', options: ['guess the meaning of', 'spell backwards', 'ignore'], answer: 0 },
      ]},
    ]},
    { name: 'Science', units: [
      { name: 'Q1 — Life Science', lessons: [
        { title: 'Plant Parts & Function', summary: 'Plants have parts just like you do! Roots drink water and leaves make food. Go outside and touch a trees bark, then find its leaves!' },
        { title: 'Animal Groups', summary: 'Animals live in groups! Some animals have families, just like you do. Look outside and count how many birds you see together.' },
        { title: 'Adaptations', summary: 'Animals have special parts that help them live. A bird has wings to fly and a fish has fins to swim. Look around your home and find three animals or bugs outside!' },
      ], questions: [
        { id: '3-SC-Q1-1', q: 'Leaves make food using ___', type: 'mc', options: ['sunlight', 'moonlight', 'noise'], answer: 0 },
        { id: '3-SC-Q1-2', q: 'A frog is a ___', type: 'mc', options: ['amphibian', 'mammal', 'bird'], answer: 0 },
      ]},
      { name: 'Q2 — Forces', lessons: [
        { title: 'Push, Pull, Friction', summary: 'Push a toy car across the floor. Does it roll far or stop quickly? Try pushing it on carpet, then on a smooth table!' },
        { title: 'Magnets', summary: 'Magnets stick to some things! Find a magnet and try it on a spoon, a toy, and a crayon. What sticks and what doesnt?' },
        { title: 'Gravity', summary: 'Gravity pulls things down to the ground. Drop a ball and watch it fall! Try dropping different toys and see what happens.' },
      ], questions: [
        { id: '3-SC-Q2-1', q: 'Gravity pulls things ___', type: 'mc', options: ['down', 'up', 'sideways'], answer: 0 },
        { id: '3-SC-Q2-2', q: 'Opposite magnet poles ___', type: 'mc', options: ['attract', 'repel', 'do nothing'], answer: 0 },
      ]},
      { name: 'Q3 — Weather', lessons: [
        { title: 'Cloud Types', summary: 'Look up at the sky! Clouds have different shapes. Some are fluffy like cotton balls and some are flat like pancakes. Go outside and point to the clouds you see!' },
        { title: 'Fronts', summary: 'A front is where warm air meets cold air. When they bump into each other, we get storms or new weather! Draw a line down your paper. Color one side red for warm and one side blue for cold.' },
        { title: 'Climate', summary: 'Climate is the weather that happens in a place for a long, long time. Some places are hot most days. Some places are cold most days. Draw a picture of your favorite weather to play in!' },
      ], questions: [
        { id: '3-SC-Q3-1', q: 'Cumulus clouds look like ___', type: 'mc', options: ['fluffy cotton', 'thin lines', 'flat gray'], answer: 0 },
        { id: '3-SC-Q3-2', q: 'Climate is weather over a ___ time.', type: 'mc', options: ['long', 'short', 'single day'], answer: 0 },
      ]},
      { name: 'Q4 — Solar System', lessons: [
        { title: 'Planets Order', summary: 'The planets go in a line around the sun. Mercury is first, then Venus, then Earth where we live! Lets make up a silly song to remember the planet order.' },
        { title: 'Moon Phases', summary: 'The moon changes shape in the sky! Sometimes it looks like a big circle. Sometimes it looks like a banana. Draw the moon you see tonight!' },
        { title: 'Stars', summary: 'Stars are big balls of hot light in the sky. At night, you can see lots of stars twinkling. Go outside tonight and count how many stars you can find!' },
      ], questions: [
        { id: '3-SC-Q4-1', q: 'The 3rd planet from the sun is ___', type: 'mc', options: ['Earth', 'Mars', 'Venus'], answer: 0 },
        { id: '3-SC-Q4-2', q: 'Our sun is a ___', type: 'mc', options: ['star', 'planet', 'moon'], answer: 0 },
      ]},
    ]},
    { name: 'History & Geography', units: [
      { name: 'Q1 — Colonies to Independence', lessons: [
        { title: '13 Colonies', summary: 'Long ago, people came to America. They made 13 new places to live called colonies. Lets count to 13 together and clap for each number!' },
        { title: 'Revolution', summary: 'The colonists got mad at the king. They wanted to be free! They fought a war to make their own country. Activity: March around your room like a brave soldier. Stomp your feet and wave a pretend flag!' },
        { title: 'Declaration', summary: 'America wrote a big letter to the king. The letter said "We want to be free!" Lets write your own freedom letter about something you want to do by yourself.' },
      ], questions: [
        { id: '3-H-Q1-1', q: 'The Declaration of Independence was in ___', type: 'mc', options: ['1776', '1492', '1865'], answer: 0 },
        { id: '3-H-Q1-2', q: 'The colonists wanted ___', type: 'mc', options: ['freedom', 'more taxes', 'a king'], answer: 0 },
      ]},
      { name: 'Q2 — Westward', lessons: [
        { title: 'Lewis & Clark', summary: 'Lewis and Clark were brave men. They walked far west to see new places. Lets pack a pretend bag for their trip! What would you bring?' },
        { title: 'Trail & Pioneers', summary: 'Long ago, brave families packed wagons and moved west. They walked on dusty trails for many days. Draw a picture of what you would pack in your wagon for a long trip!' },
        { title: 'Native Displacement', summary: 'Native people lived on the land first. New people came and wanted the same land. The Native people had to move away from their homes. Activity: Draw a picture of your home. How would you feel if you had to leave it?' },
      ], questions: [
        { id: '3-H-Q2-1', q: 'Lewis and Clark ___ the west.', type: 'mc', options: ['explored', 'ruled', 'sold'], answer: 0 },
        { id: '3-H-Q2-2', q: 'Pioneers moved ___', type: 'mc', options: ['west', 'east', 'north only'], answer: 0 },
      ]},
      { name: 'Q3 — Civil War', lessons: [
        { title: 'Causes', summary: 'Long ago, people in America had a big fight. Some states wanted one thing. Other states wanted something different. **Activity:** Draw two groups of people. Show them not agreeing about something you care about.' },
        { title: 'Key Figures', summary: 'Many brave people lived during the Civil War. Some were soldiers who fought in battles. Others helped keep families safe at home. **Activity:** Draw a picture of a brave person you know, like a parent, teacher, or friend!' },
        { title: 'Emancipation', summary: 'The Civil War helped free people who were slaves. Lincoln said all people should be free. Lets draw a picture of people holding hands together!' },
      ], questions: [
        { id: '3-H-Q3-1', q: 'Abraham Lincoln was the ___ president.', type: 'mc', options: ['16th', '1st', '20th'], answer: 0 },
        { id: '3-H-Q3-2', q: 'The Civil War ended ___', type: 'mc', options: ['slavery', 'taxes', 'war with France'], answer: 0 },
      ]},
      { name: 'Q4 — Maps & Globe Skills', lessons: [
        { title: 'Latitude/Longitude', summary: 'Lines on maps help us find places! Some lines go up and down. Some lines go left and right. Find a map and trace the lines with your finger!' },
        { title: 'Hemispheres', summary: 'Earth is like a big ball! We can cut it in half to make two parts. Find a ball at home and ask a grown-up to help you draw a line around the middle!' },
        { title: 'US Physical', summary: 'Look at a map of America! Can you find big mountains and long rivers? Point to the ocean on both sides of our country.' },
      ], questions: [
        { id: '3-H-Q4-1', q: 'Lines that run east-west are ___', type: 'mc', options: ['latitude', 'longitude', 'rivers'], answer: 0 },
        { id: '3-H-Q4-2', q: 'We are in the ___ hemisphere.', type: 'mc', options: ['Northern', 'Southern', 'Eastern'], answer: 0 },
      ]},
    ]},
    { name: 'Bible & Character', units: [
      { name: 'Q1 — Joseph', lessons: [
        { title: 'Sold & Sold Again', summary: 'Josephs brothers sold him to traders. The traders sold Joseph again in Egypt. Lets play store! Find three toys and "sell" them to someone in your family.' },
        { title: 'Forgives Brothers', summary: 'Josephs brothers were mean to him. But Joseph chose to forgive them and be kind. When someone hurts you, you can forgive too! Activity: Draw a happy face and a sad face. Practice changing from sad to happy when you forgive someone.' },
        { title: 'God’s Care', summary: 'God took care of Joseph when he was sad and scared. God takes care of you too! Draw a picture of someone who takes care of you every day.' },
      ], questions: [
        { id: '3-B-Q1-1', q: 'Joseph forgave his ___', type: 'mc', options: ['brothers', 'friends', 'king'], answer: 0 },
        { id: '3-B-Q1-2', q: 'God turned bad into ___', type: 'mc', options: ['good', 'nothing', 'worse'], answer: 0 },
      ]},
      { name: 'Q2 — Parables', lessons: [
        { title: 'Sower', summary: 'Jesus told a story about a man planting seeds. Some seeds grew big and strong! Lets plant bean seeds in a cup with dirt and watch them grow.' },
        { title: 'Talents', summary: 'Jesus told a story about a man who gave coins to his helpers. The helpers used their coins to make more coins! God gives you special gifts too. Lets find your gifts! Can you sing? Can you help? Can you share? Show someone what you do best today.' },
        { title: 'Mustard Seed', summary: 'Jesus told a story about a tiny mustard seed. It grows into a big tree! Gods love starts small but grows huge in your heart. Activity: Find the smallest thing in your room. Now find the biggest thing. God makes small things grow big!' },
      ], questions: [
        { id: '3-B-Q2-1', q: 'The man with many talents was ___', type: 'mc', options: ['praised', 'punished', 'ignored'], answer: 0 },
        { id: '3-B-Q2-2', q: 'A mustard seed is ___ but grows big.', type: 'mc', options: ['small', 'large', 'round'], answer: 0 },
      ]},
      { name: 'Q3 — Psalms & Proverbs', lessons: [
        { title: 'Proverbs on Words', summary: 'Words can help or hurt people. Kind words make friends happy. Mean words make friends sad. Lets practice saying nice things to each other today! **Activity:** Draw a happy face when you hear kind words. Draw a sad face when you hear mean words.' },
        { title: 'Fear the Lord', summary: 'God wants us to love and obey Him. When we fear the Lord, we show respect like we do for Mom and Dad. Lets bow our heads and whisper "I love You, God" three times.' },
        { title: 'Trust', summary: 'God loves you so much! You can trust Him with everything. He will always take care of you. Activity: Draw a picture of yourself with God. Show how safe you feel with Him!' },
      ], questions: [
        { id: '3-B-Q3-1', q: 'Wisdom begins with ___ the Lord.', type: 'mc', options: ['respecting', 'fearing', 'ignoring'], answer: 1 },
        { id: '3-B-Q3-2', q: 'Kind words are like a ___', type: 'mc', options: ['healing tree', 'stone', 'storm'], answer: 0 },
      ]},
      { name: 'Q4 — Missions', lessons: [
        { title: 'Tell Others', summary: 'Tell your friends about Jesus! You can share His love with everyone. Draw a picture of Jesus and give it to someone special today.' },
        { title: 'Help the Poor', summary: 'Jesus wants us to help people who need food and clothes. We can share our toys and snacks with friends who dont have much. Lets put coins in a jar to give to hungry families!' },
        { title: 'My Part', summary: 'God wants me to help tell others about Jesus. I can pray for people who need to know God loves them. Lets draw a picture of someone you want to pray for today!' },
      ], questions: [
        { id: '3-B-Q4-1', q: 'We share the good news by ___', type: 'mc', options: ['telling others', 'hiding', 'bragging'], answer: 0 },
        { id: '3-B-Q4-2', q: 'God cares especially for the ___', type: 'mc', options: ['needy', 'rich only', 'strong'], answer: 0 },
      ]},
    ]},
  ])

// 4th and 5th grades continue in curriculum_part2b.ts (kept lean for compile speed)
export const CURRICULUM_PART2: GradeCurriculum[] = [G2, G3]
