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
        { title: 'Counting 1 to 10', summary: 'Lets count together! One, two, three, four, five, six, seven, eight, nine, ten! Point to each number as you say it.', weekTest: [
          { id: 'K-M-W1-1', q: 'What number comes after 3?', type: 'mc', options: ['2', '4', '5'], answer: 1 },
          { id: 'K-M-W1-2', q: 'Count to 5. What number comes right before 5?', type: 'mc', options: ['3', '4', '6'], answer: 1 },
          { id: 'K-M-W1-3', q: 'How many toes are on one foot?', type: 'mc', options: ['4', '5', '10'], answer: 1 },
          { id: 'K-M-W1-4', q: 'What number is between 2 and 4?', type: 'mc', options: ['1', '3', '5'], answer: 1 },
          { id: 'K-M-W1-5', q: 'Point to something in your room that is shaped like a circle.', type: 'activity' },
          { id: 'K-M-W1-6', q: 'Count backward from 5: 5, 4, ___, 2, 1. What is missing?', type: 'mc', options: ['6', '3', '0'], answer: 1 },
          { id: 'K-M-W1-7', q: 'Which is bigger: 2 or 7?', type: 'mc', options: ['2', '7', 'they are the same'], answer: 1 },
          { id: 'K-M-W1-8', q: 'Write the number that comes after 9.', type: 'short', answer: '10' },
          { id: 'K-M-W1-9', q: 'Draw 3 stars. Now draw 2 more. How many stars total?', type: 'activity' },
          { id: 'K-M-W1-10', q: 'What is the first number we say when we count?', type: 'mc', options: ['0', '1', '2'], answer: 1 },
        ] },
        { title: 'Basic Shapes', summary: 'Can you find a circle? It is round like a ball. A square has four sides. A triangle has three sides. Point to shapes around you!', weekTest: [
          { id: 'K-M-W2-1', q: 'Which shape has 4 equal sides?', type: 'mc', options: ['circle', 'square', 'triangle'], answer: 1 },
          { id: 'K-M-W2-2', q: 'A pizza slice looks most like which shape?', type: 'mc', options: ['square', 'triangle', 'circle'], answer: 1 },
          { id: 'K-M-W2-3', q: 'How many sides does a triangle have?', type: 'mc', options: ['2', '3', '4'], answer: 1 },
          { id: 'K-M-W2-4', q: 'A dollar bill is shaped like a ___.', type: 'mc', options: ['circle', 'rectangle', 'triangle'], answer: 1 },
          { id: 'K-M-W2-5', q: 'Which shape has no sides at all?', type: 'mc', options: ['square', 'circle', 'triangle'], answer: 1 },
          { id: 'K-M-W2-6', q: 'A stop sign is shaped like an ___.', type: 'mc', options: ['octagon', 'circle', 'square'], answer: 0 },
          { id: 'K-M-W2-7', q: 'Draw a square and color it blue.', type: 'activity' },
          { id: 'K-M-W2-8', q: 'A rectangle has how many corners?', type: 'mc', options: ['3', '4', '6'], answer: 1 },
          { id: 'K-M-W2-9', q: 'Name one thing in your kitchen that is shaped like a rectangle.', type: 'short', answer: 'open' },
          { id: 'K-M-W2-10', q: 'Which shape can roll?', type: 'mc', options: ['square', 'circle', 'triangle'], answer: 1 },
        ] },
        { title: 'More or Less', summary: 'Which pile has more? Which has less? Count the toys and compare. The group with more things has a bigger number.', weekTest: [
          { id: 'K-M-W3-1', q: 'Which is more: 2 cookies or 6 cookies?', type: 'mc', options: ['2', '6', 'they are the same'], answer: 1 },
          { id: 'K-M-W3-2', q: 'You have 4 toys. Your friend has 7 toys. Who has less?', type: 'mc', options: ['you', 'your friend', 'same'], answer: 0 },
          { id: 'K-M-W3-3', q: 'Which is less: 8 or 3?', type: 'mc', options: ['8', '3', 'they are the same'], answer: 1 },
          { id: 'K-M-W3-4', q: 'Draw 4 stars. Draw 2 circles. Which group has less?', type: 'activity' },
          { id: 'K-M-W3-5', q: 'A tall glass has more water than a short glass. True or false?', type: 'mc', options: ['true', 'false'], answer: 0 },
          { id: 'K-M-W3-6', q: 'Which group has more: 1 bird or 10 birds?', type: 'mc', options: ['1 bird', '10 birds', 'same'], answer: 1 },
          { id: 'K-M-W3-7', q: 'There are 5 red blocks and 3 blue blocks. Which color has less?', type: 'mc', options: ['red', 'blue', 'same'], answer: 1 },
          { id: 'K-M-W3-8', q: 'Give an example of something you can have "more" of.', type: 'short', answer: 'open' },
          { id: 'K-M-W3-9', q: 'Which plate has less food: one with 2 crackers or one with 9 crackers?', type: 'mc', options: ['2 crackers', '9 crackers', 'same'], answer: 0 },
          { id: 'K-M-W3-10', q: 'A group of 3 is less than a group of ___.', type: 'mc', options: ['2', '3', '5'], answer: 2 },
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
        { title: 'Counting 11-20', summary: 'Lets count higher! After 10 comes 11, 12, 13, all the way to 20. Practice counting with your fingers and toes!' },
        { title: 'Writing Numerals', summary: 'Lets practice writing numbers! Trace a 1, then a 2, then a 3. Keep going until you can write all your numbers.' },
        { title: 'One More, One Less', summary: 'Lets play a number game! Pick any number and add one more. Now take one away! Try this with your toys or snacks.' },
      ], questions: [
        { id: 'K-M-Q2-1', q: 'What comes after 14?', type: 'mc', options: ['13', '15', '16', '4'], answer: 1 },
        { id: 'K-M-Q2-2', q: 'Write the number that is one less than 9.', type: 'short', answer: '8' },
      ]},
      { name: 'Q3 — Sorting & Patterns', lessons: [
        { title: 'Sort by Color & Size', summary: 'Lets sort your toys! Put all the big red things together, then all the small blue things together. Can you find which group has more toys?' },
        { title: 'Make a Pattern', summary: 'Lets make a fun pattern together! Find some toys or blocks. Put them in a row like red, blue, red, blue. Can you keep going?' },
        { title: 'Position Words', summary: 'Lets play with position words! Put your teddy bear on top of your pillow, then under your blanket. Now put it next to you and give it a hug!' },
      ], questions: [
        { id: 'K-M-Q3-1', q: 'Continue the pattern: circle, square, circle, ___', type: 'mc', options: ['circle', 'square', 'triangle'], answer: 1 },
        { id: 'K-M-Q3-2', q: 'Which word means "on top of"?', type: 'mc', options: ['above', 'below', 'next to'], answer: 0 },
      ]},
      { name: 'Q4 — Easy Addition', lessons: [
        { title: 'Adding With Objects', summary: 'Lets add with toys! Put out 2 blocks, then add 1 more block. Count them all together - how many do you have now?' },
        { title: 'Plus One', summary: 'Lets play plus one! When you add one more to any number, you get the next number. Hold up three fingers, then add one more - now you have four!' },
        { title: 'Math All Around Us', summary: 'Lets find numbers everywhere! Can you see 2 shoes plus 1 sock? Count toys in your room and add them together - how many do you have?' },
      ], questions: [
        { id: 'K-M-Q4-1', q: 'If you have 2 blocks and get 1 more, how many now?', type: 'mc', options: ['2', '3', '4'], answer: 1 },
        { id: 'K-M-Q4-2', q: 'Show 1 + 1 = 2 with a drawing.', type: 'activity' },
      ]},
    ]},
    { name: 'Language Arts', units: [
      { name: 'Q1 — Letters & Sounds', lessons: [
        { title: 'Alphabet Song & Order', summary: 'Lets sing the ABC song together! Can you clap your hands for each letter? Now point to letters you see around our house - on books, signs, or toys!' },
        { title: 'Letter Sounds (A-M)', summary: 'Lets play with letter sounds! Say "A" like apple and "B" like ball. Can you find something that starts with "M" like mouse?' },
        { title: 'Letter Sounds (N-Z)', summary: 'Lets make letter sounds together! Say "nnn" like a buzzing bee, then "zzz" like a sleepy snake. Can you march around and make the "mmm" sound like a marching band?' },
      ], questions: [
        { id: 'K-L-Q1-1', q: 'Which letter makes the "buh" sound?', type: 'mc', options: ['A', 'B', 'C'], answer: 1 },
        { id: 'K-L-Q1-2', q: 'What is the first letter of the alphabet?', type: 'short', answer: 'A' },
      ]},
      { name: 'Q2 — Rhyming & Print', lessons: [
        { title: 'Find the Rhyme', summary: 'Lets find words that rhyme! Cat and hat sound the same at the end. Can you think of a word that rhymes with "dog"? Try "log" or "frog"!' },
        { title: 'Hold a Book', summary: 'Lets hold a book together! Show me how you hold your favorite book. Now wiggle the book and say "book, look, cook" - they all rhyme!' },
        { title: 'Sight Words (I, see, the)', summary: 'I see the cat! You see the dog! Lets find words that sound the same - cat and hat, see and bee! Point to something you see and make a rhyming word.' },
      ], questions: [
        { id: 'K-L-Q2-1', q: 'Which word rhymes with "hat"?', type: 'mc', options: ['cat', 'dog', 'sun'], answer: 0 },
        { id: 'K-L-Q2-2', q: 'We read words from ___ to right.', type: 'mc', options: ['bottom', 'left', 'back'], answer: 1 },
      ]},
      { name: 'Q3 — Name Writing', lessons: [
        { title: 'Write Your Name', summary: 'Lets write your name! Get a crayon and paper. Start with the first letter and go slow. You can trace over it with your finger first!' },
        { title: 'Trace & Copy', summary: 'Lets write your name! First, trace over the dotted letters with your finger. Now try writing your name on the line below!' },
        { title: 'Listening to Stories', summary: 'Lets listen to a story together! Sit close and use your ears. When you hear your name or a name like yours, clap your hands!' },
      ], questions: [
        { id: 'K-L-Q3-1', q: 'Which is a capital letter?', type: 'mc', options: ['a', 'A', 'b'], answer: 1 },
        { id: 'K-L-Q3-2', q: 'Tell one thing that happened in a story you heard.', type: 'short', answer: 'open' },
      ]},
      { name: 'Q4 — Early Writing', lessons: [
        { title: 'Draw & Label', summary: 'Lets draw a picture together! Draw your favorite toy and write the first letter of its name next to it. Can you tell me about your drawing?' },
        { title: 'Sentence Starters', summary: 'Lets start sentences together! I will say "I like" and you finish it. What do you like? Ice cream? Your dog? Tell me more sentences that start with "I like"!' },
        { title: 'Share a Story', summary: 'Lets tell a story together! You pick your favorite toy and Ill help you make up a fun story about it. Draw a picture of what happens next!' },
      ], questions: [
        { id: 'K-L-Q4-1', q: 'A sentence begins with a capital ___', type: 'mc', options: ['letter', 'period', 'number'], answer: 0 },
        { id: 'K-L-Q4-2', q: 'Finish: I like to ___ (write one word).', type: 'short', answer: 'open' },
      ]},
    ]},
    { name: 'Spelling & Word Origins', units: [
      { name: 'Q1 — First Words', lessons: [
        { title: 'Words I Know', summary: 'You know so many words already! Lets find things you can name. Point to your nose, then your toe, then something red!' },
        { title: 'CVC Words', summary: 'Lets make words with three letters! Say "cat" - c-a-t. Now you try making "bat" and "hat"! Can you find three things in your room that rhyme with "cat"?' },
        { title: 'Where Words Come From', summary: 'Words are all around us! When you say "mama" or "dog," youre using words. Lets walk around and name everything you see - chair, cup, toy!' },
      ], questions: [
        { id: 'K-SP-Q1-1', q: 'Spell the word: c-a-t. What is it?', type: 'mc', options: ['cat', 'cap', 'car'], answer: 0 },
        { id: 'K-SP-Q1-2', q: 'Write the first letter of your name.', type: 'short', answer: 'open' },
      ]},
      { name: 'Q2 — Sight Words', lessons: [
        { title: 'List 1', summary: 'Lets find sight words! Look at this word: "the." Can you point to "the" in your favorite book? Lets hunt for more sight words together!' },
        { title: 'List 2', summary: 'Lets find sight words around us! Look for the word "the" on books or signs. Can you point to "the" and say it out loud?' },
        { title: 'Word Stories', summary: 'Lets make stories with sight words! Pick three word cards from our pile. Can you tell me a silly story using all three words?' },
      ], questions: [
        { id: 'K-SP-Q2-1', q: 'Which is spelled correctly?', type: 'mc', options: ['teh', 'the', 'het'], answer: 1 },
        { id: 'K-SP-Q2-2', q: 'Write the word: "see".', type: 'short', answer: 'see' },
      ]},
      { name: 'Q3 — Word Families', lessons: [
        { title: '-at Family', summary: 'Lets play with words that end in "at"! Can you say cat, bat, and hat? Now clap your hands each time you hear the "at" sound!' },
        { title: '-og Family', summary: 'Lets play with -og words! Can you say dog, log, and frog? Now hop like a frog and bark like a dog!' },
        { title: 'Root Fun', summary: 'Lets play with word families! Words that sound the same at the end are friends. Say "cat" and "hat" - do you hear how they rhyme? Find three things that rhyme with "run" like "sun" and "fun"!' },
      ], questions: [
        { id: 'K-SP-Q3-1', q: 'Which word is in the -at family?', type: 'mc', options: ['bat', 'big', 'sun'], answer: 0 },
        { id: 'K-SP-Q3-2', q: 'Write a word that rhymes with "log".', type: 'short', answer: 'open' },
      ]},
      { name: 'Q4 — Review & Pride', lessons: [
        { title: 'My Spelling Book', summary: 'Look at all the letters you learned this year! You can write A, B, C and so many more. Lets make a special book with your favorite letters and draw pictures for each one.' },
        { title: 'Word Origins Recap', summary: 'We learned where words come from! Some words started in other countries and came to us. Lets play a word game - can you think of a food word that sounds different, like "pizza"?' },
        { title: 'Show & Tell', summary: 'You did so many amazing things this year! Pick your favorite toy or drawing to show me. Tell me why you love it and what makes it special to you.' },
      ], questions: [
        { id: 'K-SP-Q4-1', q: 'A word family shares the same ___ sound.', type: 'mc', options: ['ending', 'first', 'color'], answer: 0 },
        { id: 'K-SP-Q4-2', q: 'Write one word you learned this year.', type: 'short', answer: 'open' },
      ]},
    ]},
    { name: 'Science', units: [
      { name: 'Q1 — God Made the World', lessons: [
        { title: 'Day & Night', summary: 'God made the sun to shine during the day. When the sun goes down, it gets dark and we have night. Lets spin around like the Earth - now you make day and night happen!' },
        { title: 'The Seasons', summary: 'God made spring, summer, fall, and winter! Each season looks different and feels different. Lets go outside and see what season it is right now - is it hot, cold, or just right?' },
        { title: 'Weather Watch', summary: 'God made all the weather! Look outside your window. Can you see if its sunny, cloudy, or rainy? Draw a picture of what the weather looks like today!' },
      ], questions: [
        { id: 'K-SC-Q1-1', q: 'Which is NOT a season?', type: 'mc', options: ['spring', 'summer', 'Tuesday'], answer: 2 },
        { id: 'K-SC-Q1-2', q: 'The sun gives us ___', type: 'mc', options: ['light', 'rain', 'wind'], answer: 0 },
      ]},
      { name: 'Q2 — Plants & Animals', lessons: [
        { title: 'Parts of a Plant', summary: 'Plants have roots, stems, leaves, and flowers - just like you have arms and legs! Lets go outside and find a flower. Can you point to each part?' },
        { title: 'Living vs Nonliving', summary: 'Lets play a fun game! Look around and find something that grows and moves. Now find something that stays the same forever. Can you sort your toys into living and not living piles?' },
        { title: 'Farm Animals', summary: 'Farm animals live on farms with farmers. Cows say "moo," pigs say "oink," and chickens say "cluck cluck!" Lets make animal sounds together and guess which farm animal makes each noise.' },
      ], questions: [
        { id: 'K-SC-Q2-1', q: 'Which is a living thing?', type: 'mc', options: ['rock', 'dog', 'cup'], answer: 1 },
        { id: 'K-SC-Q2-2', q: 'A plant drinks water through its ___', type: 'mc', options: ['leaves', 'roots', 'flower'], answer: 1 },
      ]},
      { name: 'Q3 — My Body', lessons: [
        { title: 'Five Senses', summary: 'You have five senses! Your eyes see, ears hear, nose smells, tongue tastes, and skin feels. Lets go on a sense hunt - find something soft, something that smells good, and something red!' },
        { title: 'Healthy Habits', summary: 'Lets brush our teeth together! Show me how you brush up and down. Now lets wash our hands and make them sparkle clean!' },
        { title: 'Body Parts', summary: 'Lets name your body parts! Touch your head, then your toes. Can you wiggle your nose and clap your hands?' },
      ], questions: [
        { id: 'K-SC-Q3-1', q: 'Which sense do we use to smell a flower?', type: 'mc', options: ['sight', 'smell', 'touch'], answer: 1 },
        { id: 'K-SC-Q3-2', q: 'Name one way to stay healthy.', type: 'short', answer: 'open' },
      ]},
      { name: 'Q4 — Motion & Matter', lessons: [
        { title: 'Push & Pull', summary: 'You can push and pull things to make them move! Push your toy car across the floor, then pull it back to you. Try pushing and pulling different toys around your room.' },
        { title: 'Float or Sink', summary: 'Lets play with water! Some things float on top like a toy boat. Other things sink down like a rock. Fill a bowl with water and drop in different toys to see what happens!' },
        { title: 'Solids & Liquids', summary: 'Ice is hard like a rock. When ice melts, it becomes soft water you can pour. Lets put an ice cube in a cup and watch it change into water!' },
      ], questions: [
        { id: 'K-SC-Q4-1', q: 'To open a door you ___ it.', type: 'mc', options: ['push or pull', 'eat', 'sing'], answer: 0 },
        { id: 'K-SC-Q4-2', q: 'Water is a ___', type: 'mc', options: ['solid', 'liquid', 'gas'], answer: 1 },
      ]},
    ]},
    { name: 'History & Geography', units: [
      { name: 'Q1 — My Family', lessons: [
        { title: 'People in My Home', summary: 'Who lives in your home with you? Lets walk around and find each person! Draw a picture of everyone you see in your house today.' },
        { title: 'Past & Present', summary: 'Look at old pictures of your family! Point to baby you and big you now. Draw yourself as a baby and yourself today on paper.' },
        { title: 'Family Stories', summary: 'Every family has special stories! Ask someone to tell you a funny story about when you were little. Now draw a picture of your favorite family story!' },
      ], questions: [
        { id: 'K-H-Q1-1', q: 'Who helps take care of you at home?', type: 'short', answer: 'open' },
        { id: 'K-H-Q1-2', q: 'A story from long ago is called the ___', type: 'mc', options: ['past', 'future', 'present'], answer: 0 },
      ]},
      { name: 'Q2 — Our Community', lessons: [
        { title: 'Helpers Around Us', summary: 'Lets play helper! Who helps you every day? Your mom, dad, teacher, and doctor all help you. Can you draw a picture of your favorite helper?' },
        { title: 'Places in Town', summary: 'Lets take a walk around our town! Point to places you know - the store, the park, your school. Can you draw your favorite place to visit?' },
        { title: 'Being a Good Neighbor', summary: 'Good neighbors are kind and helpful. You can wave and say "Hi!" to people who live near you. Lets practice waving at everyone you see today!' },
      ], questions: [
        { id: 'K-H-Q2-1', q: 'Who puts out fires?', type: 'mc', options: ['firefighter', 'baker', 'teacher'], answer: 0 },
        { id: 'K-H-Q2-2', q: 'A good neighbor ___', type: 'mc', options: ['shares', 'hides', 'yells'], answer: 0 },
      ]},
      { name: 'Q3 — Maps & Globe', lessons: [
        { title: 'The Big Round World', summary: 'Our world is like a big, round ball! You can spin a globe to see all the places on Earth. Find a ball and spin it like our spinning world!' },
        { title: 'Map Symbols', summary: 'Maps use pictures to show us things! A little house means a real house. A tree picture means real trees. Lets draw your own map symbols for your room!' },
        { title: 'Where I Live', summary: 'Look around your room! Can you point to your bed, your toys, and the door? Lets draw a map of your room and put a big X where you sleep!' },
      ], questions: [
        { id: 'K-H-Q3-1', q: 'Earth is shaped like a ___', type: 'mc', options: ['box', 'ball', 'flat plate'], answer: 1 },
        { id: 'K-H-Q3-2', q: 'We live in the country called ___', type: 'short', answer: 'open' },
      ]},
      { name: 'Q4 — Holidays & Heroes', lessons: [
        { title: 'American Holidays', summary: 'America has special fun days called holidays! We eat turkey on Thanksgiving and watch fireworks on the Fourth of July. Draw your favorite holiday food and tell me why you like it!' },
        { title: 'Brave People', summary: 'Brave people help others when they feel scared. You are brave too! Lets march around the room like a brave hero and make strong superhero poses.' },
        { title: 'Thankfulness', summary: 'What makes you happy? Lets draw three things you love! Maybe your family, your pet, or your favorite toy. Show me your pictures and tell me why they make you smile.' },
      ], questions: [
        { id: 'K-H-Q4-1', q: 'On Thanksgiving we ___', type: 'mc', options: ['give thanks', 'trick-or-treat', 'sing carols'], answer: 0 },
        { id: 'K-H-Q4-2', q: 'Name one holiday we celebrate.', type: 'short', answer: 'open' },
      ]},
    ]},
    { name: 'Bible & Character', units: [
      { name: 'Q1 — God Made Me', lessons: [
        { title: 'I Am Special', summary: 'God made you special and wonderful! Look in the mirror and smile big. Can you make funny faces and see how amazing you are?' },
        { title: 'Creation Week', summary: 'God made everything in six days! He made the sun, moon, stars, animals, and you. Lets clap six times and say "Thank you, God" after each clap!' },
        { title: 'Thank You, God', summary: 'God made you special and wonderful! Lets thank God for all the good things He gives us. Look around and clap your hands for three things you see that make you happy!' },
      ], questions: [
        { id: 'K-B-Q1-1', q: 'Who made you?', type: 'mc', options: ['God', 'a robot', 'no one'], answer: 0 },
        { id: 'K-B-Q1-2', q: 'On what day did God rest?', type: 'mc', options: ['the 1st', 'the 7th', 'never'], answer: 1 },
      ]},
      { name: 'Q2 — Jesus Loves Me', lessons: [
        { title: 'Baby Jesus', summary: 'Baby Jesus was tiny and sweet, just like you were when you were born! God sent Jesus because He loves you so much. Lets rock your stuffed animal like Mary rocked baby Jesus to sleep.' },
        { title: 'Jesus the Helper', summary: 'Jesus helps people every day. He helps you too! Lets pretend to help someone - give your teddy bear a hug and say "I can help like Jesus!"' },
        { title: 'My Friend Jesus', summary: 'Jesus is your very best friend! He loves you so much and wants to play and talk with you every day. Lets give Jesus a big hug right now - squeeze yourself tight!' },
      ], questions: [
        { id: 'K-B-Q2-1', q: 'Where was baby Jesus born?', type: 'mc', options: ['a barn', 'a castle', 'a school'], answer: 0 },
        { id: 'K-B-Q2-2', q: 'Jesus is our ___', type: 'mc', options: ['friend', 'enemy', 'stranger'], answer: 0 },
      ]},
      { name: 'Q3 — Being Kind', lessons: [
        { title: 'Share Your Toys', summary: 'When you share your toys, you make friends happy! Sharing shows you care about others. Lets practice - give your teddy bear a hug, then let me hold it too!' },
        { title: 'Use Kind Words', summary: 'Kind words make people smile! Say "please" and "thank you" today. Lets practice saying nice things to your stuffed animals right now!' },
        { title: 'Obey Quickly', summary: 'When Mom or Dad asks you to do something, do it right away! That shows you love them. Lets practice! Ill ask you to touch your nose, clap your hands, then give me a hug - do each one super fast!' },
      ], questions: [
        { id: 'K-B-Q3-1', q: 'When Mom says "no", we should ___', type: 'mc', options: ['obey', 'yell', 'hit'], answer: 0 },
        { id: 'K-B-Q3-2', q: 'Kind words make others feel ___', type: 'mc', options: ['happy', 'sad', 'angry'], answer: 0 },
      ]},
      { name: 'Q4 — Thankful Hearts', lessons: [
        { title: 'Count Your Blessings', summary: 'Lets count all the good things we have! Look around your room and count your toys. Now count hugs from your family today!' },
        { title: 'Say Please & Thank You', summary: 'Lets practice saying magic words! When you want something, say "please." When someone helps you, say "thank you." Now ask me for a hug using your magic word!' },
        { title: 'Sing to God', summary: 'God loves when we sing to Him! Lets sing "Thank You, God" together. Now clap your hands while you sing your favorite song to God!' },
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
        { id: '1-L-Q3-2', q: 'Write one sentence about your favorite food.', type: 'short', answer: 'open' },
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
        { id: '1-SP-Q2-2', q: 'Write a word that rhymes with "boat".', type: 'short', answer: 'open' },
      ]},
      { name: 'Q3 — Blends & Digraphs', lessons: [
        { title: 'List 5: st-/bl-', summary: 'Lets play with sounds! Say "st" like in "stop" and "bl" like in "blue." Can you stomp your feet and blow like the wind?' },
        { title: 'List 6: sh-/ch-', summary: 'Lets make sh and ch sounds! Say "shh" like youre being quiet. Now say "ch" like a train - choo choo! Point to your mouth when you hear sh or ch sounds.' },
        { title: 'Origin: "ship"', summary: 'Lets say "ship" together! Can you hear the "sh" sound at the start? Find three things in your room that start with "sh" like ship, shoe, or shirt!' },
      ], questions: [
        { id: '1-SP-Q3-1', q: 'Which starts with "sh"?', type: 'mc', options: ['shop', 'stop', 'block'], answer: 0 },
        { id: '1-SP-Q3-2', q: 'Write a word that starts with "bl".', type: 'short', answer: 'open' },
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
        { id: '1-B-Q4-2', q: 'Name one way you can help at home.', type: 'short', answer: 'open' },
      ]},
    ]},
  ])

export const CURRICULUM_PART1: GradeCurriculum[] = [K, G1]
