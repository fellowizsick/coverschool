with open(r'C:\Users\1990j\coverschool\src\lib\curriculum.ts') as f:
    content = f.read()

# Find the broken line and the 1st grade section
broken = "      { id: 'K-HG"
g1_marker = "// ====================== 1ST GRADE"

idx = content.find(broken)
g1_idx = content.find(g1_marker)

# Replace the broken tail with the complete closing sections
new_tail = """      { id: 'K-HG-U1-1', q: 'Who lives at your house with you?', type: 'mc', options: ['Your family', 'Strangers', 'Animals'], answer: 0 },
      { id: 'K-HG-U1-2', q: 'Homes keep us...', type: 'mc', options: ['safe and warm', 'cold and wet', 'scared'], answer: 0 },
    ]},
    { name: 'Q2 - Community Helpers', lessons: [
      { title: 'Firefighters Help Us', summary: 'Firefighters put out fires and help keep us safe!' },
      { title: 'Doctors Make Us Well', summary: 'A doctor helps you when you feel sick. They give you medicine.' },
      { title: 'Teachers Help Us Learn', summary: 'A teacher helps you learn new things every day!' },
    ], questions: [
      { id: 'K-HG-Q2-1', q: 'Who puts out fires?', type: 'mc', options: ['Firefighter', 'Doctor', 'Teacher'], answer: 0 },
      { id: 'K-HG-Q2-2', q: 'Who helps you when you feel sick?', type: 'mc', options: ['Firefighter', 'Doctor', 'Teacher'], answer: 1 },
    ]},
    { name: 'Q3 - My World', lessons: [
      { title: 'Earth Is Round', summary: 'Our Earth is round like a ball! We live on Earth.' },
      { title: 'Maps Show Places', summary: 'A map is a picture that shows where things are.' },
      { title: 'Where I Live', summary: 'I live in a house in a town. My town has stores and schools.' },
    ], questions: [
      { id: 'K-HG-Q3-1', q: 'Earth is shaped like a...', type: 'mc', options: ['ball', 'box', 'flat plate'], answer: 0 },
      { id: 'K-HG-Q3-2', q: 'A map shows...', type: 'mc', options: ['where places are', 'what to eat', 'how to count'], answer: 0 },
    ]},
    { name: 'Q4 - Holidays', lessons: [
      { title: 'Christmas', summary: 'Christmas is Jesus birthday. We give gifts and love our family.' },
      { title: 'Thanksgiving', summary: 'On Thanksgiving we say thank you for all the good things we have!' },
      { title: 'My Birthday', summary: 'Your birthday is the day you were born. We celebrate with cake!' },
    ], questions: [
      { id: 'K-HG-Q4-1', q: 'Christmas celebrates the birthday of...', type: 'mc', options: ['Jesus', 'a teacher', 'a firefighter'], answer: 0 },
      { id: 'K-HG-Q4-2', q: 'On Thanksgiving we say...', type: 'mc', options: ['thank you', 'happy birthday', 'goodnight'], answer: 0 },
    ]},
  ]},
  { name: 'Bible & Character', units: [
    { name: 'Q1 - God Made Me', lessons: [
      { title: 'I Am Special', summary: 'God made you and you are very special! God loves you!' },
      { title: 'God Made the World', summary: 'God made the sun, the moon, the stars, and all the animals!' },
      { title: 'Thank You God', summary: 'We can say thank you to God for our family and our home.' },
    ], questions: [
      { id: 'K-B-Q1-1', q: 'Who made you?', type: 'mc', options: ['God', 'a robot', 'no one'], answer: 0 },
      { id: 'K-B-Q1-2', q: 'Who made the world?', type: 'mc', options: ['God', 'a man', 'an animal'], answer: 0 },
    ]},
    { name: 'Q2 - Jesus Loves Me', lessons: [
      { title: 'Baby Jesus', summary: 'Baby Jesus was born. God sent Jesus because He loves us!' },
      { title: 'Jesus Is My Friend', summary: 'Jesus loves you and is your best friend! You can talk to Him anytime.' },
      { title: 'Jesus Helps Us', summary: 'Jesus helps us when we are sad or scared. He gives us peace.' },
    ], questions: [
      { id: 'K-B-Q2-1', q: 'Jesus loves...', type: 'mc', options: ['you', 'no one', 'only grown-ups'], answer: 0 },
      { id: 'K-B-Q2-2', q: 'Jesus is our...', type: 'mc', options: ['friend', 'enemy', 'stranger'], answer: 0 },
    ]},
    { name: 'Q3 - Being Kind', lessons: [
      { title: 'Share with Others', summary: 'Sharing makes everyone happy! Can you share your toy?' },
      { title: 'Use Kind Words', summary: 'Please and thank you are kind words. Say them every day!' },
      { title: 'Be a Good Friend', summary: 'A good friend is kind, shares, and helps others.' },
    ], questions: [
      { id: 'K-B-Q3-1', q: 'When someone gives you something, say...', type: 'mc', options: ['thank you', 'no', 'go away'], answer: 0 },
      { id: 'K-B-Q3-2', q: 'A good friend is...', type: 'mc', options: ['kind', 'mean', 'loud'], answer: 0 },
    ]},
    { name: 'Q4 - Thankful Hearts', lessons: [
      { title: 'Thank You for Food', summary: 'Before we eat, we can thank God for our food.' },
      { title: 'Thank You for Family', summary: 'God gave you your family. They love you very much!' },
      { title: 'I Am Thankful', summary: 'What are you thankful for? Let us thank God for all our blessings!' },
    ], questions: [
      { id: 'K-B-Q4-1', q: 'Before we eat, we thank...', type: 'mc', options: ['God', 'the food', 'the table'], answer: 0 },
      { id: 'K-B-Q4-2', q: 'We say thank you for our...', type: 'mc', options: ['family', 'toys only', 'nothing'], answer: 0 },
    ]},
  ]},
])

"""

content = content[:idx] + new_tail + content[g1_idx:]

with open(r'C:\Users\1990j\coverschool\src\lib\curriculum.ts', 'w') as f:
    f.write(content)

import re
short = len(re.findall(r"type: 'short'", content))
activity = len(re.findall(r"type: 'activity'", content))
print(f"Fixed! Short: {short}, Activity: {activity}")
