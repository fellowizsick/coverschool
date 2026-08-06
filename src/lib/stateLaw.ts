// State homeschool law reference — used by /homeschool-law pages.
// Content researched 2026-08-03 from official state sources.
// NOTE: This is informational, not legal advice. Families should verify current
// law with their state's education department before relying on it.

export interface StateLaw {
  code: string
  name: string
  flag: string
  compulsoryAges: string
  notification: string
  coverSchoolRole: string
  curriculum: string
  attendance: string
  records: string
  testing: string
  teacherQuals: string
  summary: string
  sources: { label: string; url: string }[]
}

export const STATE_LAWS: StateLaw[] = [
  {
    code: 'AL',
    name: 'Alabama',
    flag: '🌴',
    compulsoryAges: 'Ages 6 to 17',
    notification: 'Parents enroll in a church school; the church school files a notice of enrollment/attendance with the Alabama State Department of Education. No parent-level registration with the district.',
    coverSchoolRole:
      'Under Alabama Code §16-28-1, a church school covers the family legally. Larose Christian Academy files the required notice and maintains enrollment records for the state.',
    curriculum: 'No state-mandated curriculum for church school students.',
    attendance: 'Church schools set their own calendar; instruction is expected during the school year.',
    records: 'The church school maintains enrollment and attendance records.',
    testing: 'No state testing required for church school students.',
    teacherQuals: 'No state requirements — parents direct the education.',
    summary:
      'Alabama\u2019s church school model is the cleanest legal path: enroll with a church school, and the school handles state filings. Parents choose curriculum and teach.',
    sources: [
      { label: 'Alabama Code §16-28-1 (church school definition)', url: 'https://law.justia.com/codes/alabama/title-16/chapter-28/section-16-28-1/' },
      { label: 'Alabama Code §16-28-7 (church school enrollment & reporting)', url: 'https://law.justia.com/codes/alabama/title-16/chapter-28/section-16-28-7/' },
      { label: 'HSLDA — Alabama Homeschool Law', url: 'https://hslda.org/legal/alabama' },
    ],
  },
  {
    code: 'FL',
    name: 'Florida',
    flag: '🌞',
    compulsoryAges: 'Ages 6 to 16',
    notification: 'If homeschooling independently (home education option), parents file a Notice of Intent with the county school superintendent within 30 days of starting. Families enrolled in a private cover school do not file their own notice.',
    coverSchoolRole:
      'Florida recognizes umbrella/cover schools as a separate legal route (private school option). Families may enroll in a private/parochial school that covers them instead of filing their own Notice of Intent.',
    curriculum: 'No state-prescribed curriculum; instruction must be regular.',
    attendance: '180 days of instruction per year.',
    records: 'Parents keep a portfolio of educational activities, samples, and assessments.',
    testing: 'Independent home education: annual evaluation (portfolio review by a certified teacher or standardized test). Cover-school families are not subject to this requirement.',
    teacherQuals: 'No teacher certification required for home education.',
    summary:
      'Florida offers two paths: file your own Notice of Intent with the district (independent home education), or enroll in a private cover school and let the school handle the legal standing. LCA families use the cover-school route.',
    sources: [
      { label: 'Florida Statute §1002.41 (home education)', url: 'http://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=1000-1099/1002/Sections/1002.41.html' },
      { label: 'Florida DOE — Home Education', url: 'https://www.fldoe.org/schools/family-community/home-edu.stml' },
      { label: 'HSLDA — Florida Homeschool Law', url: 'https://hslda.org/legal/florida' },
    ],
  },
  {
    code: 'GA',
    name: 'Georgia',
    flag: '🍑',
    compulsoryAges: 'Ages 6 to 16',
    notification:
      'Parents must file a Declaration of Intent to homeschool with the Georgia Department of Education within 30 days of establishing the program (and by Sept 1 each year thereafter).',
    coverSchoolRole:
      'Georgia recognizes cover schools. Families may enroll in a private/parochial school (which serves as cover) and are then under that school\u2019s umbrella rather than filing independently.',
    curriculum: 'Instruction must include reading, language arts, math, social studies, and science.',
    attendance: '180 days per year, at least 4.5 hours per day.',
    records: 'Parents maintain attendance records and a portfolio of student work.',
    testing:
      'Nationally normed standardized test every 3 years starting in grade 3 (results kept at home, not submitted to the district).',
    teacherQuals: 'Parent must have a high school diploma or GED (or be supervised by a certified teacher for the first year).',
    summary:
      'Georgia requires a Declaration of Intent when filing independently — but cover schools provide the legal umbrella, and LCA handles the administrative side so families can focus on teaching.',
    sources: [
      { label: 'Georgia Code §20-2-690 (home study programs)', url: 'https://law.justia.com/codes/georgia/2022/title-20/chapter-2/article-16/part-1/section-20-2-690/' },
      { label: 'Georgia DOE — Home School', url: 'https://gadoe.org/parent-family-resources/home-school/' },
      { label: 'HSLDA — Georgia Homeschool Law', url: 'https://hslda.org/legal/georgia' },
    ],
  },
  {
    code: 'IN',
    name: 'Indiana',
    flag: '🏁',
    compulsoryAges: 'Ages 7 to 18',
    notification: 'No state notification or registration required. Homeschools operate as non-accredited private schools.',
    coverSchoolRole:
      'Indiana has no state oversight of non-accredited private schools, so cover schools provide structure and records without state filing. LCA provides the official school-of-record role.',
    curriculum: 'No state-mandated curriculum.',
    attendance:
      'Parents must provide instruction equivalent to that given in public schools (IC 20-33-2-28). No specific day count is mandated for homeschools, but keeping an attendance log is best practice for records and transcripts.',
    records: 'No state-required records, but keeping attendance/grades is best practice for transcripts.',
    testing: 'No state testing required.',
    teacherQuals: 'No teacher certification required.',
    summary:
      'Indiana is a true no-notification state — no LOI, registration, or filing required. Families homeschool freely; LCA adds official school-of-record status, report cards, and transcripts — useful for college and transfers.',
    sources: [
      { label: 'Indiana Code §20-33-2-28 (equivalent instruction)', url: 'https://law.justia.com/codes/indiana/title-20/article-33/chapter-2/section-20-33-2-28/' },
      { label: 'Indiana Code §20-33-2 (compulsory attendance)', url: 'https://law.justia.com/codes/indiana/title-20/article-33/chapter-2/' },
      { label: 'IAHE — Indiana Association of Home Educators', url: 'https://iahe.net/' },
      { label: 'HSLDA — Indiana Homeschool Law', url: 'https://hslda.org/legal/indiana' },
    ],
  },
  {
    code: 'MS',
    name: 'Mississippi',
    flag: '🌺',
    compulsoryAges: 'Ages 6 to 17',
    notification:
      'Parents file an annual certificate of enrollment with the local school attendance officer by August 15 each year (or when starting midyear).',
    coverSchoolRole:
      'Mississippi recognizes legitimate home instruction programs. Cover schools provide the legal standing and record-keeping; the certificate of enrollment filing is the parent\u2019s step.',
    curriculum: 'No state-mandated curriculum for home instruction programs.',
    attendance:
      'No minimum day-count for home instruction programs (the 180-day public school requirement does not apply to nonpublic schools including homeschools).',
    records:
      'Parents submit the certificate of enrollment to the attendance officer annually; attendance and scholastic records are submitted to the attendance officer as required by the local district.',
    testing: 'No state testing requirement for homeschool students.',
    teacherQuals: 'No teacher certification required.',
    summary:
      'Mississippi is simple: file the certificate of enrollment, keep records, and teach. LCA covers the school-of-record side and issues official documents.',
    sources: [
      { label: 'Mississippi Code §37-13-91 (home instruction)', url: 'https://hslda.org/post/how-to-comply-with-mississippis-homeschool-law' },
      { label: 'Mississippi DOE — Certificate of Enrollment', url: 'https://mdek12.org/wp-content/uploads/sites/12/2026/03/Certificate-of-Enrollment-COE-02.26.2026.pdf' },
      { label: 'HSLDA — Mississippi Homeschool Law', url: 'https://hslda.org/legal/mississippi' },
    ],
  },
  {
    code: 'MO',
    name: 'Missouri',
    flag: '🌽',
    compulsoryAges: 'Ages 7 to 17',
    notification: 'No state registration or notification required.',
    coverSchoolRole:
      'Missouri treats homeschools as private schools with light regulation. Cover schools provide official records and transcripts without state filing.',
    curriculum: 'Instruction must include reading, language arts, math, social studies, and science.',
    attendance:
      'At least 1,000 hours of instruction per school term (600 of those hours in the core subjects, 400 at the regular homeschool location).',
    records:
      'For children under 16, maintain (not submit) a plan book/diary of subjects, academic evaluations, and other credible evidence of instruction. Keep at least two years of records on hand.',
    testing:
      'Maintain academic evaluations as part of homeschool records (regular tests or annual standardized tests). No test results are submitted to the state.',
    teacherQuals: 'No teacher certification required.',
    summary:
      'Missouri keeps it light: no registration, no notification. Children must receive 1,000 hours of instruction per term covering core subjects. LCA provides the school-of-record role so families have official report cards and transcripts when needed.',
    sources: [
      { label: 'Missouri Revised Statutes §167.031 (compulsory attendance)', url: 'https://revisor.mo.gov/main/OneSection.aspx?section=167.031' },
      { label: 'HSLDA — How to Comply with Missouri Homeschool Law', url: 'https://hslda.org/post/how-to-comply-with-missouris-homeschool-law' },
      { label: 'HSLDA — Missouri Homeschool Law', url: 'https://hslda.org/legal/missouri' },
    ],
  },
  {
    code: 'OK',
    name: 'Oklahoma',
    flag: '🌾',
    compulsoryAges: 'Ages 5 to 18',
    notification: 'No state notification or registration. Homeschools operate as private schools.',
    coverSchoolRole:
      'Oklahoma has no state oversight of private schools. Cover schools provide official school-of-record services, report cards, and transcripts.',
    curriculum: 'No state-mandated curriculum for private school students.',
    attendance: '180 days of instruction per year.',
    records: 'No state-required records, but keeping attendance/grades is best practice.',
    testing: 'No state testing required.',
    teacherQuals: 'No teacher certification required.',
    summary:
      'Oklahoma is wide open — no registration, no testing. LCA adds the official school record families need for college and transfers.',
    sources: [
      { label: 'Oklahoma Statutes Title 70 §10-105 (private schools)', url: 'https://law.justia.com/codes/oklahoma/title-70/section-70-10-105/' },
      { label: 'Oklahoma State Department of Education — Home School', url: 'https://sde.ok.gov/home-school' },
      { label: 'HSLDA — Oklahoma Homeschool Law', url: 'https://hslda.org/legal/oklahoma' },
    ],
  },
  {
    code: 'SC',
    name: 'South Carolina',
    flag: '🌴',
    compulsoryAges: 'Ages 5 to 17',
    notification:
      'Three legal homeschool pathways: (1) independent homeschool approved by the district, (2) membership in a homeschool association (SCAIHS), or (3) membership in a 50+ member accountability association. Separately, a child may attend a church-related private school (which satisfies compulsory attendance under §59-65-10(A)) without any state registration.',
    coverSchoolRole:
      'Families may enroll in a church-related private school and the school maintains the records — this is the route LCA provides. It is a private school path under §59-65-10(A), distinct from the three home-school options that require district filing or association membership.',
    curriculum:
      'Homeschool options: reading, writing, math, science, and social studies (plus composition/literature grades 7-12). Church school route: the school sets its own curriculum.',
    attendance:
      'Homeschool options: at least 180 days per year, at least 4.5 hours per day (excluding lunch/recess). Church school route: the school sets its own calendar.',
    records:
      'Homeschool options: parent keeps attendance, academic progress records, and semiannual progress reports. Church school route: the school maintains enrollment and scholastic records.',
    testing:
      'Homeschool options: annual statewide testing and Basic Skills Assessment (options 1-2). Church school route: no state testing requirement.',
    teacherQuals:
      'Homeschool options: the parent-teacher must hold a high school diploma or GED (options 1-2; option 3 per association standards). Church school route: no parent qualification requirement — the school directs instruction.',
    summary:
      'South Carolina offers three regulated homeschool options (district, SCAIHS, or 50+ member association), all with diploma and 180-day requirements. The church school route LCA provides is a private school path under §59-65-10(A): the school is the operator of record, parents are not subject to the homeschool statutes, and there is no district filing or state testing.',
    sources: [
      { label: 'South Carolina Code §59-65-10 (compulsory attendance / private & church schools)', url: 'https://www.scstatehouse.gov/code/t59c065.php' },
      { label: 'South Carolina Code §59-65-40/45/47 (homeschool options)', url: 'https://www.scstatehouse.gov/code/t59c065.php' },
      { label: 'HSLDA — South Carolina Homeschool Law', url: 'https://hslda.org/legal/south-carolina' },
    ],
  },
  {
    code: 'TX',
    name: 'Texas',
    flag: '⭐',
    compulsoryAges: 'Ages 6 to 19',
    notification: 'No state notification, registration, or oversight. Homeschools operate as private schools (Leeper v. Arlington ISD, 1987).',
    coverSchoolRole:
      'Texas treats homeschools as private schools with no state regulation. Cover schools provide official school-of-record status and transcripts.',
    curriculum: 'Instruction must be bona fide and include reading, spelling, grammar, math, and good citizenship.',
    attendance: 'No statutory days requirement; instruction must be regular and bona fide.',
    records: 'No state-required records, but transcripts matter for college.',
    testing: 'No state testing required.',
    teacherQuals: 'No teacher certification required.',
    summary:
      'Texas is one of the freest states for homeschoolers — no registration, no testing. LCA provides the official school record families need for the college application trail.',
    sources: [
      { label: 'Texas Education Code §25.086 (exemptions)', url: 'https://statutes.capitol.texas.gov/Docs/ED/htm/ED.25.htm' },
      { label: 'HSLDA — How to Comply with Texas Homeschool Law', url: 'https://hslda.org/post/how-to-comply-with-texas-homeschool-law' },
      { label: 'HSLDA — Texas Homeschool Law', url: 'https://hslda.org/legal/texas' },
    ],
  },
]

export function getStateLaw(code: string): StateLaw | undefined {
  return STATE_LAWS.find((s) => s.code === code.toUpperCase())
}

/**
 * Build a real withdrawal checklist for a state from its law data.
 * Used by the LeadCapture box on /homeschool-law/[state]. Content is derived
 * from the actual researched fields above — informational, not legal advice.
 */
export function buildWithdrawalChecklist(
  law: StateLaw
): { title: string; items: string[] }[] {
  return [
    {
      title: '1. Know the law before you pull anyone out',
      items: [
        `In ${law.name}, compulsory attendance covers ${law.compulsoryAges}.`,
        'Make sure your legal coverage is in place BEFORE the child stops attending public school — that way no day becomes "unexcused."',
      ],
    },
    {
      title: '2. Choose your legal path',
      items: [
        `Notification/registration: ${law.notification}`,
        `Cover school role: ${law.coverSchoolRole}`,
      ],
    },
    {
      title: '3. Handle the school-side paperwork',
      items: [
        'Send a written, dated withdrawal notice to the current school (keep a copy for your records).',
        'If your path requires it, get the enrollment notice / certificate filed with the district or state.',
      ],
    },
    {
      title: '4. Set up your records from day one',
      items: [
        `Attendance: ${law.attendance}`,
        `Records: ${law.records}`,
        `Testing: ${law.testing}`,
        `Teacher requirements: ${law.teacherQuals}`,
      ],
    },
    {
      title: '5. Keep proof for later',
      items: [
        'Keep attendance logs, coursework samples, and grades — colleges and schools will want them.',
        'For high schoolers, start the transcript trail now so it is college-ready.',
      ],
    },
  ]
}

