import re

with open(r'C:\Users\1990j\coverschool\src\lib\curriculum.ts') as f:
    content = f.read()

# Find the broken line
broken = "{ id: 'K-SP-W8-1', q: 'Which words al"
# Find where the 1st grade section begins
g1_start = content.find("// ====================== 1ST GRADE ======================")

# The Kindergarten spelling Q3 section ends mid-way. I need to:
# 1. Complete the W8 weekTest
# 2. Add remaining Spelling Q3 lesson (Q3-W9), Q4
# 3. Add Science, History, Bible 

# Replace from the broken line up to 1ST GRADE with completed sections
old_tail = content[content.find(broken):g1_start]

new_tail = """          { id: 'K-SP-W8-1', q: 'Which words all end with \"og\"?', type: 'mc', options: ['dog, log, frog', 'bat, cat, hat', 'big, pig, fig'], answer: 0 },
          { id: 'K-SP-W8-2', q: 'What do dog, log, and frog have at the end?', type: 'mc', options: ['og', 'at', 'ig'], answer: 0 },
          { id: 'K-SP-W8-3', q: 'Which word belongs in the \"og\" family?', type: 'mc', options: ['frog', 'cat', 'sun'], answer: 0 },
          { id: 'K-SP-W8-4', q: 'Say the \"og\" words: dog, log, __', type: 'mc', options: ['frog', 'hat', 'big'], answer: 0 },
        ] },
        { title: 'Fun with Family Words', summary: "Let's say word families together! Bat, cat, hat! Dog, log, frog! Can you say them fast?", weekTest: [
          { id: 'K-SP-W9-1', q: 'Which word belongs to the -at family?', type: 'mc', options: ['bat', 'dog', 'sun'], answer: 0 },
          { id: 'K-SP-W9-2', q: 'Which word belongs to the -og family?', type: 'mc', options: ['frog', 'hat', 'big'], answer: 0 },
          { id: 'K-SP-W9-3', q: 'Does "cat" belong to the -at or -og family?', type: 'mc', options: ['at', 'og', 'neither'], answer: 0 },
          { id: 'K-SP-W9-4', q: 'Does "log" belong to the -at or -og family?', type: 'mc', options: ['at', 'og', 'neither'], answer: 1 },
        ] },
      ], questions: [
        { id: 'K-SP-Q3-1', q: 'Which word belongs to the -at family?', type: 'mc', options: ['bat', 'dog', 'sun'], answer: 0 },
        { id: 'K-SP-Q3-2', q: 'Which word belongs to the -og family?', type: 'mc', options: ['frog', 'hat', 'big'], answer: 0 },
      ]},
      { name: 'Q4 - Review', lessons: [
        { title: 'Words I Know', summary: "Look at all the words we learned! Can you point to 'the'? Can you find 'I'? You know so many words!" },
        { title: 'Letters I Know', summary: 'We learned A, B, C, M, S! Can you point to the letter A? What sound does B make?' },
        { title: "Let's Read Together", summary: "Let's look at a book together! Point to a word you know. Great job!" },
      ], questions: [
        { id: 'K-SP-Q4-1', q: 'Point to the word "the". Which one is "the"?', type: 'mc', options: ['the', 'cat', 'dog'], answer: 0 },
        { id: 'K-SP-Q4-2', q: 'Which letter makes the "buh" sound?', type: 'mc', options: ['B', 'A', 'C'], answer: 0 },
      ]},
    ]},
    { name: 'Science', units: [
      { name: "Q1 - God's World", lessons: [
        { title: 'Day and Night', summary: 'God made the sun for daytime and the moon for nighttime. When the sun is out, it is day!' },
        { title: 'The Sun and Moon', summary: 'The sun is bright and hot. The moon shines at night. Can you point up to where the sun is?' },
        { title: 'Weather', summary: 'Today is sunny! Sometimes it rains. Sometimes it is cloudy. What is the weather today?' },
      ], questions: [
        { id: 'K-SC-Q1-1', q: 'When the sun is out, it is ___', type: 'mc', options: ['daytime', 'nighttime', 'bedtime'], answer: 0 },
        { id: 'K-SC-Q1-2', q: 'The sun gives us ___.', type: 'mc', options: ['light', 'rain', 'snow'], answer: 0 },
      ]},
      { name: 'Q2 - Animals', lessons: [
        { title: 'Farm Animals', summary: 'A cow says moo! A pig says oink! A chicken says cluck! Can you make the sounds?' },
        { title: 'Pets', summary: 'A dog is a pet. A cat is a pet. A fish is a pet. Do you have a pet?' },
        { title: 'Animal Babies', summary: 'A baby dog is a puppy. A baby cat is a kitten. A baby cow is a calf!' },
      ], questions: [
        { id: 'K-SC-Q2-1', q: 'Which animal says "moo"?', type: 'mc', options: ['cow', 'dog', 'chicken'], answer: 0 },
        { id: 'K-SC-Q2-2', q: 'Which animal is a pet?', type: 'mc', options: ['dog', 'lion', 'bear'], answer: 0 },
      ]},
      { name: 'Q3 - My Body', lessons: [
        { title: 'My Body Parts', summary: 'You have eyes to see, ears to hear, and hands to touch! Can you point to your nose?' },
        { title: 'My Five Senses', summary: 'We see with our eyes. We hear with our ears. We smell with our nose!' },
        { title: 'Staying Healthy', summary: 'We wash our hands. We brush our teeth. We eat good food to stay strong!' },
      ], questions: [
        { id: 'K-SC-Q3-1', q: 'We see with our ___', type: 'mc', options: ['eyes', 'ears', 'nose'], answer: 0 },
        { id: 'K-SC-Q3-2', q: 'We hear with our ___', type: 'mc', options: ['eyes', 'ears', 'nose'], answer: 1 },
      ]},
      { name: 'Q4 - Seasons', lessons: [
        { title: 'Four Seasons', summary: 'God made four seasons! Spring, summer, fall, winter. Each one is special!' },
        { title: 'Summer and Winter', summary: 'Summer is hot! We wear shorts. Winter is cold! We wear coats.' },
        { title: 'Spring and Fall', summary: 'Spring has flowers! Fall has colorful leaves! Which season do you like?' },
      ], questions: [
        { id: 'K-SC-Q4-1', q: 'In summer the weather is ___', type: 'mc', options: ['hot', 'cold', 'snowy'], answer: 0 },
        { id: 'K-SC-Q4-2', q: 'In winter the weather is ___', type: 'mc', options: ['hot', 'cold', 'rainy'], answer: 1 },
      ]},
    ]},
    { name: 'History & Geography', units: [
      { name: 'Q1 - My Family', lessons: [
        { title: 'People in My Family', summary: 'Every family is special! You have a mom and dad. You might have siblings. Who is in your family?' },
        { title: 'My Home', summary: 'You live in a home! Your home has a kitchen, bedroom, and living room.' },
        { title: 'Taking Care of Each Other', summary: 'Families take care of each other! Mom and Dad help you. You can help by picking up your toys!' },
      ], questions: [
        { id: 'K-H-Q1-1', q: 'Who takes care of you at home?', type: 'mc', options: ['Mom and Dad', 'A stranger', 'No one'], answer: 0 },
        { id: 'K-H-Q1-2', q: 'You live in a ___', type: 'mc', options: ['home', 'store', 'school'], answer: 0 },
      ]},
      { name: 'Q2 - Community Helpers', lessons: [
        { title: 'Firefighters', summary: 'Firefighters put out fires and keep us safe! They wear special gear.' },
        { title: 'Doctors and Teachers', summary: 'A doctor helps you when you are sick. A teacher helps you learn new things!' },
        { title: 'Helpers in Our Town', summary: 'So many people help us! The mailman brings letters. The farmer grows our food.' },
      ], questions: [
        { id: 'K-H-Q2-1', q: 'Who puts out fires?', type: 'mc', options: ['firefighter', 'teacher', 'baker'], answer: 0 },
        { id: 'K-H-Q2-2', q: 'Who helps you when you are sick?', type: 'mc', options: ['doctor', 'firefighter', 'mailman'], answer: 0 },
      ]},
      { name: 'Q3 - Our World', lessons: [
        { title: 'Earth Is Round', summary: 'Our Earth is round like a ball! We live on Earth.' },
        { title: 'Maps Show Places', summary: 'A map shows where places are! This is a picture of our town on the map.' },
        { title: 'Where Do We Live?', summary: 'We live in a town! Our town has houses, stores, and schools.' },
      ], questions: [
        { id: 'K-H-Q3-1', q: 'Earth is shaped like a ___', type: 'mc', options: ['ball', 'box', 'plate'], answer: 0 },
        { id: 'K-H-Q3-2', q: 'A map shows ___', type: 'mc', options: ['places', 'food', 'toys'], answer: 0 },
      ]},
      { name: 'Q4 - Holidays', lessons: [
        { title: 'Christmas', summary: 'Christmas is when we celebrate Jesus birthday! We give gifts and spend time with family.' },
        { title: 'Thanksgiving', summary: 'On Thanksgiving we say thank you for all we have! We eat turkey with our family.' },
        { title: 'My Birthday', summary: 'Your birthday is special! It is the day you were born. We celebrate with cake and family!' },
      ], questions: [
        { id: 'K-H-Q4-1', q: 'At Christmas we celebrate ___ birthday', type: 'mc', options: ["Jesus'", 'yours', 'no ones'], answer: 0 },
        { id: 'K-H-Q4-2', q: 'On Thanksgiving we say ___', type: 'mc', options: ['thank you', 'happy birthday', 'goodnight'], answer: 0 },
      ]},
    ]},
    { name: 'Bible & Character', units: [
      { name: 'Q1 - God Made Me', lessons: [
        { title: 'I Am Special', summary: 'God made you and you are special! Look in the mirror and smile! God loves you!' },
        { title: 'God Made the World', summary: 'God made the sun, moon, stars, trees, and animals! He made everything beautiful!' },
        { title: 'Thank You God', summary: "Let's say thank you to God! Thank you for my family, my home, and my toys!" },
      ], questions: [
        { id: 'K-B-Q1-1', q: 'Who made you?', type: 'mc', options: ['God', 'a robot', 'no one'], answer: 0 },
        { id: 'K-B-Q1-2', q: 'Who made the sun and stars?', type: 'mc', options: ['God', 'a man', 'a bird'], answer: 0 },
      ]},
      { name: 'Q2 - Jesus Loves Me', lessons: [
        { title: 'Baby Jesus', summary: 'Baby Jesus was born in a stable. Mary and Joseph loved him. God sent Jesus because He loves us!' },
        { title: 'Jesus Is My Friend', summary: 'Jesus loves you and is your friend! You can talk to Jesus anytime.' },
        { title: 'Jesus Helps Us', summary: 'Jesus helps us when we are sad or scared. He gives us peace and love!' },
      ], questions: [
        { id: 'K-B-Q2-1', q: 'Jesus loves ___', type: 'mc', options: ['you', 'no one', 'only grown-ups'], answer: 0 },
        { id: 'K-B-Q2-2', q: 'Jesus is our ___', type: 'mc', options: ['friend', 'enemy', 'stranger'], answer: 0 },
      ]},
      { name: 'Q3 - Being Kind', lessons: [
        { title: 'Share with Others', summary: 'Sharing makes everyone happy! Can you share your toy with a friend?' },
        { title: 'Use Kind Words', summary: 'Please and thank you are kind words! Can you say please?' },
        { title: 'Be a Good Friend', summary: 'A good friend shares, is kind, and helps others! You are a good friend!' },
      ], questions: [
        { id: 'K-B-Q3-1', q: 'When someone gives you something, say ___', type: 'mc', options: ['thank you', 'no', 'go away'], answer: 0 },
        { id: 'K-B-Q3-2', q: 'A good friend is ___', type: 'mc', options: ['kind', 'mean', 'loud'], answer: 0 },
      ]},
      { name: 'Q4 - Thankful Hearts', lessons: [
        { title: 'Thank You for Food', summary: "Before we eat, we thank God! Thank you God for this food!" },
        { title: 'Thank You for Family', summary: 'God gave you your family! Your mom, dad, and siblings love you!' },
        { title: "I Am Thankful", summary: "What are you thankful for? Your toys? Your home? Your pet? Let's thank God!" },
      ], questions: [
        { id: 'K-B-Q4-1', q: 'Before we eat, we thank ___', type: 'mc', options: ['God', 'the food', 'the table'], answer: 0 },
        { id: 'K-B-Q4-2', q: 'We say "thank you" for our ___', type: 'mc', options: ['family', 'garbage', 'nothing'], answer: 0 },
      ]},
    ]},
  ])

"""

content = content.replace(old_tail, new_tail)

with open(r'C:\Users\1990j\coverschool\src\lib\curriculum.ts', 'w') as f:
    f.write(content)

print(f"Fixed! File size: {len(content)} chars")
print(f"Short type count: {content.count(\"type: 'short'\") - content.count(\"type: 'short',\")}")
print(f"Activity type count: {content.count(\"type: 'activity'\")}")
print(f"Kindergarten block ends with: ...{content[content.rfind('])')-20:content.rfind('])')+3]}")
