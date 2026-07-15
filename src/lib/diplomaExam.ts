/**
 * Larose Christian Academy — Adult Diploma Exam (HiSET/GED-style)
 * Structured subtests: math | reading | science | social_studies | life_skills
 * + required WRITING/ESSAY component (rubric-scored).
 * Per-subtest pass standard: must clear each subtest, not just overall average.
 */

export type DiplomaSubtest = 'math' | 'reading' | 'science' | 'social_studies' | 'life_skills'

export interface DiplomaQuestion {
  id: string
  subtest: DiplomaSubtest
  question: string
  options: string[]
  correctIndex: number
  kind: 'recall' | 'applied'
}

export const DIPLOMA_SUBTESTS: { key: DiplomaSubtest; label: string; weight: number }[] = [
  { key: 'math', label: '🔢 Mathematics', weight: 25 },
  { key: 'reading', label: '📖 Language Arts — Reading', weight: 20 },
  { key: 'science', label: '🔬 Science', weight: 20 },
  { key: 'social_studies', label: '🌎 Social Studies', weight: 20 },
  { key: 'life_skills', label: '💡 Life & Work Skills', weight: 15 },
]

export const DIPLOMA_PASS_PER_SUBTEST = 0.6 // must score >=60% on EACH subtest
export const DIPLOMA_ESSAY_MIN_WORDS = 200
export const DIPLOMA_ESSAY_PASS = 2 // rubric score >=2 (of 4) to pass writing

export const DIPLOMA_QUESTIONS: DiplomaQuestion[] = [
  { id: 'mat1', subtest: 'math', question: "A family's monthly income is $3,200. They spend $1,150 on rent, $480 on food, $210 on utilities, and $300 on transportation. How much is left for savings and other expenses?", options: ["$960", "$1,060", "$1,160", "$860"], correctIndex: 0, kind: 'applied' },
  { id: 'mat2', subtest: 'math', question: "A store marks a $120 jacket up by 35% for retail. During a sale it's discounted 20% off the retail price. What is the final sale price?", options: ["$129.60", "$134.40", "$120.00", "$110.40"], correctIndex: 0, kind: 'applied' },
  { id: 'mat3', subtest: 'math', question: "You invest $2,000 at 4% simple interest per year. How much interest do you earn after 3 years?", options: ["$80", "$240", "$120", "$320"], correctIndex: 1, kind: 'applied' },
  { id: 'mat4', subtest: 'math', question: "A recipe feeds 4 people using 1.5 cups of rice. How many cups are needed to feed 10 people?", options: ["3.25", "3.5", "3.75", "4.0"], correctIndex: 2, kind: 'applied' },
  { id: 'mat5', subtest: 'math', question: "The table shows units sold: Mon 12, Tue 18, Wed 15, Thu 20, Fri 25. What is the average (mean) units sold per day?", options: ["17", "18", "19", "20"], correctIndex: 1, kind: 'applied' },
  { id: 'mat6', subtest: 'math', question: "A rectangular garden is 14 ft by 9 ft. A 2-ft-wide path runs around it. What is the area of just the path?", options: ["68 sq ft", "72 sq ft", "76 sq ft", "80 sq ft"], correctIndex: 0, kind: 'applied' },
  { id: 'mat7', subtest: 'math', question: "Solve for x: 2(x - 3) = 4x + 6.", options: ["-6", "-3", "3", "6"], correctIndex: 0, kind: 'applied' },
  { id: 'mat8', subtest: 'math', question: "A phone plan costs $25/month plus $0.10 per text over 500. If you send 750 texts, what is the bill?", options: ["$50", "$75", "$25", "$100"], correctIndex: 0, kind: 'applied' },
  { id: 'mat9', subtest: 'math', question: "A survey of 200 adults: 45% exercise weekly, 30% sometimes, 25% never. How many exercise weekly?", options: ["45", "90", "60", "100"], correctIndex: 1, kind: 'applied' },
  { id: 'mat10', subtest: 'math', question: "A right triangle has legs 6 cm and 8 cm. What is the length of the hypotenuse?", options: ["10 cm", "12 cm", "14 cm", "9 cm"], correctIndex: 0, kind: 'applied' },
  { id: 'mat11', subtest: 'math', question: "You buy 3 items at $4.99, $12.50, and $7.25. Sales tax is 8%. What is the total rounded to the nearest cent?", options: ["$26.74", "$25.24", "$26.00", "$27.00"], correctIndex: 0, kind: 'applied' },
  { id: 'mat12', subtest: 'math', question: "A car depreciates 15% per year. If it's worth $18,000 now, what's it worth after one year?", options: ["$15,300", "$16,200", "$14,400", "$15,000"], correctIndex: 0, kind: 'applied' },
  { id: 'mat13', subtest: 'math', question: "A map scale is 1 inch = 20 miles. Two cities are 3.5 inches apart on the map. What's the real distance?", options: ["60 mi", "70 mi", "65 mi", "75 mi"], correctIndex: 1, kind: 'applied' },
  { id: 'mat14', subtest: 'math', question: "If 5 workers build a wall in 8 days, how long would 10 workers take (same rate)?", options: ["4 days", "16 days", "5 days", "3 days"], correctIndex: 0, kind: 'applied' },
  { id: 'mat15', subtest: 'math', question: "A student scored 82, 90, 76, and 88 on four tests. What score on the fifth test gives an average of 85?", options: ["89", "90", "84", "93"], correctIndex: 0, kind: 'applied' },
  { id: 'mat16', subtest: 'math', question: "Convert 3/8 to a decimal.", options: ["0.375", "0.38", "0.3", "0.425"], correctIndex: 0, kind: 'applied' },
  { id: 'mat17', subtest: 'math', question: "A 15% tip is left on a $46.80 meal. How much is the tip?", options: ["$7.02", "$6.50", "$7.50", "$5.00"], correctIndex: 0, kind: 'applied' },
  { id: 'mat18', subtest: 'math', question: "A tank holds 500 gallons and is 60% full. How many gallons are in it?", options: ["300", "350", "250", "400"], correctIndex: 0, kind: 'applied' },
  { id: 'mat19', subtest: 'math', question: "What is the probability of drawing a red card from a standard 52-card deck?", options: ["1/2", "1/4", "1/3", "2/3"], correctIndex: 0, kind: 'applied' },
  { id: 'mat20', subtest: 'math', question: "A loan of $1,500 has a $75 origination fee plus 6% annual interest for one year. Total repayment?", options: ["$1,665", "$1,590", "$1,650", "$1,710"], correctIndex: 0, kind: 'applied' },
  { id: 'mat21', subtest: 'math', question: "What is 7 squared?", options: ["49", "14", "21", "56"], correctIndex: 0, kind: 'applied' },
  { id: 'mat22', subtest: 'math', question: "Which of these is a prime number?", options: ["9", "15", "17", "21"], correctIndex: 2, kind: 'applied' },
  { id: 'rea23', subtest: 'reading', question: "PASSAGE: 'The old library had stood for a century, its brick face worn smooth by weather. Though the city promised repairs, the doors stayed locked, and children walked past every morning on their way to school, never once stepping inside.' \u2014 The author most likely implies the library is:", options: ["well-maintained and open", "neglected despite promises", "newly constructed", "a school building"], correctIndex: 1, kind: 'applied' },
  { id: 'rea24', subtest: 'reading', question: "PASSAGE (above): Why does the author mention children walking past?", options: ["to show the library is popular", "to highlight lost opportunity for the community", "to describe a route to school", "to criticize the children"], correctIndex: 1, kind: 'applied' },
  { id: 'rea25', subtest: 'reading', question: "PASSAGE: 'Maria saved every month, skipping dinners out and used clothes instead of new. After five years, she had enough for a small house down payment.' \u2014 Maria's actions best demonstrate:", options: ["impulse spending", "delayed gratification", "bad luck", "poor planning"], correctIndex: 1, kind: 'applied' },
  { id: 'rea26', subtest: 'reading', question: "PASSAGE: 'The committee recommended the bridge, citing lower long-term cost, but residents feared the construction noise.' \u2014 The central conflict is between:", options: ["cost and convenience", "safety and speed", "residents and the bridge builder only", "weather and budget"], correctIndex: 0, kind: 'applied' },
  { id: 'rea27', subtest: 'reading', question: "PASSAGE: 'He claimed he was late because of traffic, yet his coworker saw him at the cafe at that exact hour.' \u2014 This suggests the man's excuse is:", options: ["confirmed", "contradicted", "irrelevant", "unknown"], correctIndex: 1, kind: 'applied' },
  { id: 'rea28', subtest: 'reading', question: "PASSAGE: 'Unlike its noisy neighbor, the pond offered quiet, with only the occasional rustle of reeds.' \u2014 The word 'unlike' signals a:", options: ["comparison", "definition", "cause", "list"], correctIndex: 0, kind: 'applied' },
  { id: 'rea29', subtest: 'reading', question: "PASSAGE: 'The law took effect in 2020; consequently, registrations dropped by half.' \u2014 'Consequently' indicates:", options: ["a contrast", "a result", "a time", "an example"], correctIndex: 1, kind: 'applied' },
  { id: 'rea30', subtest: 'reading', question: "PASSAGE: 'Critics argue the policy helps the wealthy, while supporters say it creates jobs. The truth likely lies between.' \u2014 The author's tone is:", options: ["one-sided", "balanced/measured", "angry", "mocking"], correctIndex: 1, kind: 'applied' },
  { id: 'rea31', subtest: 'reading', question: "PASSAGE: 'Before the invention of the printing press, books were copied by hand, making them rare and costly.' \u2014 The main idea is:", options: ["printing was invented in 1500", "books were scarce before printing", "monks were lazy", "paper was expensive"], correctIndex: 1, kind: 'applied' },
  { id: 'rea32', subtest: 'reading', question: "PASSAGE: 'She read the contract twice, questioned the fine print, and refused to sign until her lawyer approved.' \u2014 This portrays her as:", options: ["careless", "cautious and responsible", "gullible", "indifferent"], correctIndex: 1, kind: 'applied' },
  { id: 'rea33', subtest: 'reading', question: "PASSAGE: 'The experiment failed three times, but the team adjusted the variables and succeeded on the fourth.' \u2014 The key lesson is:", options: ["quit after failure", "persistence and adjustment lead to success", "luck determines outcomes", "experiments are useless"], correctIndex: 1, kind: 'applied' },
  { id: 'rea34', subtest: 'reading', question: "PASSAGE: 'Rural counties lost population as factories closed, shrinking the tax base and school funding.' \u2014 Which is a likely downstream effect?", options: ["schools receive more money", "public services decline", "population rises", "taxes decrease automatically"], correctIndex: 1, kind: 'applied' },
  { id: 'sci35', subtest: 'science', question: "A graph shows CO2 rising from 315 ppm (1960) to 415 ppm (2020). The best conclusion is:", options: ["CO2 is decreasing", "CO2 increased over time", "CO2 stayed constant", "CO2 peaked in 1980"], correctIndex: 1, kind: 'applied' },
  { id: 'sci36', subtest: 'science', question: "An experiment tests a new fertilizer. Group A gets it, Group B gets none. Both get equal sun/water. Group B is the:", options: ["experimental group", "control group", "variable group", "biased group"], correctIndex: 1, kind: 'applied' },
  { id: 'sci37', subtest: 'science', question: "A patient's temperature is 39.5\u00b0C. In Fahrenheit (F = C\u00d79/5 + 32) this is about:", options: ["102.1\u00b0F", "103.1\u00b0F", "101.0\u00b0F", "104.3\u00b0F"], correctIndex: 1, kind: 'applied' },
  { id: 'sci38', subtest: 'science', question: "Two substances are mixed and the temperature drops. This suggests the reaction is:", options: ["exothermic (releases heat)", "endothermic (absorbs heat)", "neutral", "explosive"], correctIndex: 1, kind: 'applied' },
  { id: 'sci39', subtest: 'science', question: "A study finds people who sleep <5 hrs score lower on memory tests. This shows a:", options: ["causal proof sleep causes memory", "correlation between sleep and memory", "no relationship", "memory causes sleep"], correctIndex: 1, kind: 'applied' },
  { id: 'sci40', subtest: 'science', question: "Which is the most energy-efficient home choice?", options: ["single-pane windows", "LED bulbs and insulation", "leaving lights on", "electric heat with open windows"], correctIndex: 1, kind: 'applied' },
  { id: 'sci41', subtest: 'science', question: "A food label shows 12g sugar per serving, 8 servings per package. Total sugar if you eat the whole package?", options: ["48 g", "96 g", "20 g", "120 g"], correctIndex: 1, kind: 'applied' },
  { id: 'sci42', subtest: 'science', question: "Bacteria divide every 20 minutes. Starting with 1 cell, how many after 1 hour (3 divisions)?", options: ["3", "8", "6", "12"], correctIndex: 1, kind: 'applied' },
  { id: 'sci43', subtest: 'science', question: "A scale reads 0.5 N for a 50g mass (g\u224810 m/s\u00b2). The scale is likely measuring:", options: ["mass", "weight (force)", "volume", "density"], correctIndex: 1, kind: 'applied' },
  { id: 'sci44', subtest: 'science', question: "Which sequence is correct for the scientific method?", options: ["conclude, hypothesize, observe", "observe, hypothesize, test, conclude", "test, conclude, observe", "hypothesize, conclude, test"], correctIndex: 1, kind: 'applied' },
  { id: 'sci45', subtest: 'science', question: "A region's average temperature rose 2\u00b0C over 30 years; local glacier shrank. The link is:", options: ["coincidental only", "consistent with warming melting ice", "impossible", "caused by the glacier"], correctIndex: 1, kind: 'applied' },
  { id: 'sci46', subtest: 'science', question: "Vitamin D is mainly obtained by:", options: ["sunlight exposure", "drinking only water", "avoiding outdoors", "eating only meat"], correctIndex: 0, kind: 'applied' },
  { id: 'sci47', subtest: 'science', question: "A car's gas mileage is 30 mpg. For a 450-mile trip, gas needed is about:", options: ["15 gallons", "13 gallons", "20 gallons", "10 gallons"], correctIndex: 0, kind: 'applied' },
  { id: 'sci48', subtest: 'science', question: "Genetically, a child gets half their DNA from each:", options: ["parent", "grandparent only", "sibling", "doctor"], correctIndex: 0, kind: 'applied' },
  { id: 'sci49', subtest: 'science', question: "Which is a renewable resource?", options: ["coal", "wind", "natural gas", "oil"], correctIndex: 1, kind: 'applied' },
  { id: 'soc50', subtest: 'social_studies', question: "The U.S. Constitution divides government into three branches to:", options: ["speed up laws", "prevent any one branch from gaining too much power", "eliminate the President", "merge state governments"], correctIndex: 1, kind: 'applied' },
  { id: 'soc51', subtest: 'social_studies', question: "A bill becomes law after passing both houses of Congress and being signed by the:", options: ["Speaker", "President", "Chief Justice", "Governor only"], correctIndex: 1, kind: 'applied' },
  { id: 'soc52', subtest: 'social_studies', question: "The First Amendment protects all EXCEPT:", options: ["free speech", "freedom of religion", "right to a speedy trial", "freedom of the press"], correctIndex: 2, kind: 'applied' },
  { id: 'soc53', subtest: 'social_studies', question: "If the Supreme Court declares a law unconstitutional, the law is:", options: ["enforced anyway", "invalid/struck down", "sent to the states", "automatically amended"], correctIndex: 1, kind: 'applied' },
  { id: 'soc54', subtest: 'social_studies', question: "EXCERPT: 'We hold these truths to be self-evident, that all men are created equal...' \u2014 This is from the:", options: ["Constitution", "Declaration of Independence", "Bill of Rights", "Emancipation Proclamation"], correctIndex: 1, kind: 'applied' },
  { id: 'soc55', subtest: 'social_studies', question: "A citizen disagrees with a law but obeys it while petitioning to change it. This reflects:", options: ["anarchy", "civic responsibility within the law", "rebellion", "apathy"], correctIndex: 1, kind: 'applied' },
  { id: 'soc56', subtest: 'social_studies', question: "The Great Depression (1929) primarily caused:", options: ["massive unemployment and bank failures", "a boom in hiring", "war", "low inflation"], correctIndex: 0, kind: 'applied' },
  { id: 'soc57', subtest: 'social_studies', question: "Which is a responsibility of U.S. citizens (not a right)?", options: ["free speech", "paying taxes", "voting (a right)", "trial by jury"], correctIndex: 1, kind: 'applied' },
  { id: 'soc58', subtest: 'social_studies', question: "States have powers NOT given to the federal government (e.g. driver licenses). This is called:", options: ["federal supremacy only", "federalism / reserved powers", "monarchy", "tyranny"], correctIndex: 1, kind: 'applied' },
  { id: 'soc59', subtest: 'social_studies', question: "The 19th Amendment (1920) is significant because it:", options: ["ended slavery", "gave women the right to vote", "lowered the voting age", "established income tax"], correctIndex: 1, kind: 'applied' },
  { id: 'soc60', subtest: 'social_studies', question: "Inflation means over time the same money buys:", options: ["more goods", "fewer goods", "the same", "only foreign goods"], correctIndex: 1, kind: 'applied' },
  { id: 'soc61', subtest: 'social_studies', question: "A budget deficit occurs when a government's spending is:", options: ["less than revenue", "more than revenue", "equal to revenue", "zero"], correctIndex: 1, kind: 'applied' },
  { id: 'soc62', subtest: 'social_studies', question: "The electoral process where citizens choose representatives is called:", options: ["appointment", "elections", "inheritance", "annexation"], correctIndex: 1, kind: 'applied' },
  { id: 'soc63', subtest: 'social_studies', question: "Which document limits the power of the monarchy and influenced U.S. law?", options: ["Magna Carta", "Communist Manifesto", "Mein Kampf", "None"], correctIndex: 0, kind: 'applied' },
  { id: 'soc64', subtest: 'social_studies', question: "The census (every 10 years) is used to:", options: ["collect taxes directly", "apportion representation and allocate funds", "choose the President", "ban immigration"], correctIndex: 1, kind: 'applied' },
  { id: 'lif65', subtest: 'life_skills', question: "Your gross pay is $2,000/biweekly, taxes $380, insurance $120. Your net (take-home) pay is:", options: ["$2,000", "$1,620", "$1,500", "$1,380"], correctIndex: 1, kind: 'applied' },
  { id: 'lif66', subtest: 'life_skills', question: "You have $400 saved and a $600 emergency car repair. Best first step:", options: ["ignore it", "use savings + plan repayment if needed", "max out credit cards for fun", "quit job"], correctIndex: 0, kind: 'applied' },
  { id: 'lif67', subtest: 'life_skills', question: "A job offer letter says $45,000/year but you currently make $42,000. Before accepting you should also check:", options: ["only the title", "benefits, commute, job security, growth", "nothing", "the CEO's name only"], correctIndex: 1, kind: 'applied' },
  { id: 'lif68', subtest: 'life_skills', question: "A lease says 'first and last month + $500 deposit.' Moving in, you owe:", options: ["$500", "two months rent + $500", "one month rent", "nothing"], correctIndex: 1, kind: 'applied' },
  { id: 'lif69', subtest: 'life_skills', question: "To build credit responsibly you should:", options: ["miss payments", "pay balances on time and keep utilization low", "close oldest account", "never check your report"], correctIndex: 1, kind: 'applied' },
  { id: 'lif70', subtest: 'life_skills', question: "An email asks for your SSN and bank password urgently. This is likely:", options: ["legitimate", "a phishing scam", "required by law", "from your bank"], correctIndex: 1, kind: 'applied' },
  { id: 'lif71', subtest: 'life_skills', question: "You're in a workplace disagreement. The professional response is to:", options: ["yell", "address it calmly with facts and seek resolution", "quit immediately", "ignore forever"], correctIndex: 1, kind: 'applied' },
  { id: 'lif72', subtest: 'life_skills', question: "A 401(k) primarily helps with:", options: ["vacation", "retirement savings with tax advantages", "daily spending", "credit score"], correctIndex: 1, kind: 'applied' },
  { id: 'lif73', subtest: 'life_skills', question: "Comparing two loans: Loan A 5% APR, Loan B 12% APR. For the same amount, Loan A costs:", options: ["more interest", "less interest", "the same", "nothing"], correctIndex: 1, kind: 'applied' },
  { id: 'lif74', subtest: 'life_skills', question: "To reduce debt effectively you should:", options: ["pay only minimums forever", "pay more than minimum and avoid new debt", "borrow more", "ignore statements"], correctIndex: 1, kind: 'applied' },
  { id: 'lif75', subtest: 'life_skills', question: "A contract you don't understand should be:", options: ["signed immediately", "read carefully or reviewed by a professional", "ignored", "signed with fake info"], correctIndex: 0, kind: 'applied' },
  { id: 'lif76', subtest: 'life_skills', question: "Eating balanced meals, sleeping 7-9 hrs, and exercising is associated with:", options: ["poor health", "better health and focus", "no effect", "weight gain only"], correctIndex: 1, kind: 'applied' },
  { id: 'lif77', subtest: 'life_skills', question: "If a medical bill seems wrong, you should:", options: ["pay without question", "request an itemized bill and dispute errors", "ignore it", "file for bankruptcy immediately"], correctIndex: 1, kind: 'applied' },
  { id: 'lif78', subtest: 'life_skills', question: "Voting in local elections most directly affects:", options: ["foreign policy only", "your community (schools, roads, taxes)", "nothing", "the President's salary"], correctIndex: 1, kind: 'applied' },
  { id: 'lif79', subtest: 'life_skills', question: "Saving $50/month from age 25 to 65 at 5% grows to roughly:", options: ["$1,000", "tens of thousands (compound growth)", "$2,400", "$0"], correctIndex: 1, kind: 'applied' },
]

export const DIPLOMA_ESSAY_PROMPTS: string[] = [
  "Many adults return to school to earn a diploma after life interrupted their education. In a well-organized essay (at least 200 words), explain why completing a high school diploma matters for an adult today, and describe one challenge they might face and how to overcome it.",
  "Some communities argue that practical life skills (budgeting, job readiness, health) should be weighted as heavily as academic subjects in a diploma. Take a position and support it with reasons and examples in a well-organized essay of at least 200 words.",
  "Technology changes how we work, learn, and communicate. In a well-organized essay of at least 200 words, discuss both a benefit and a drawback of technology for adult learners, and state which you think outweighs the other.",
]

// Simple rubric scorer: length + structure + relevance heuristics.
export function scoreEssay(text: string): { score: number; words: number; passed: boolean } {
  const words = (text.trim().match(/\S+/g) || []).length
  let score = 0
  if (words >= 200) score++
  if (words >= 250) score++
  if (/\b(because|therefore|however|first|second|example|reason|conclude)\b/i.test(text)) score++
  if (text.split(/[.!?]/).filter((s) => s.trim().length > 25).length >= 4) score++
  return { score: Math.min(score, 4), words, passed: score >= DIPLOMA_ESSAY_PASS }
}
