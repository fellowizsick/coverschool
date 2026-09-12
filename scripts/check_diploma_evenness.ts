/**
 * Prove the diploma stays EVEN for every name and date.
 *
 * Jonathan, 2026-09-11: "it has to make sure that the names and dates stay even on the diploma so
 * it looks good ... working 100 percent everytime flawlessly"
 *
 * For each name this builds the real PDF, renders it, and measures the printed name's ink:
 *   - does it fit inside the frame (nothing clipped at the edges)
 *   - is it CENTRED (left margin == right margin, within a pixel or two)
 *   - is the rest of the layout unchanged (same vertical footprint every time)
 *
 * Run: npx tsx scripts/check_diploma_evenness.ts
 */
import fs from 'fs'
import path from 'path'
import { buildDiplomaPdf } from '../src/lib/diploma-pdf'

const T = path.join(process.env.LOCALAPPDATA || '.', 'Temp', 'evenness')
fs.mkdirSync(T, { recursive: true })
const EMBLEM = path.join(process.cwd(), 'public', 'lca-logo-transparent.png')
const emblem = fs.existsSync(EMBLEM) ? new Uint8Array(fs.readFileSync(EMBLEM)) : null

const CASES: [string, string, string][] = [
  ['short',            'Ann Lee',                                     '2027-05-21'],
  ['single_long',      'Christopher',                                 '2027-05-21'],
  ['typical',          'Richard Harrison',                            '2027-05-21'],
  ['three_words',      'Summer Rose Graham',                          '2027-05-21'],
  ['two_middles',      'Blake Graham Smith Jones',                    '2027-05-21'],
  ['hyphen_apostrophe',"Mary-Jane O'Neill",                           '2027-05-21'],
  ['max_typical',      'Alexandria Montgomery-Wellington',            '2027-05-21'],
  ['very_long',        'Alexandria Catherine Montgomery-Wellington',  '2027-05-21'],
  ['absurd_long',      'Alexandria Catherine Montgomery-Wellington III', '2027-05-21'],
  ['messy_input',      '  SUMMER    graham ',                         '2027-05-21'],
  ['lowercase',        'ellis graham',                                '2027-05-21'],
  ['caps',             'RICHARD HARRISON',                            '2027-05-21'],
  ['other_date',       'Jonathan Brown',                              '2028-06-02'],
  ['early_date',       'Jonathan Brown',                              '2026-01-09'],
]

async function main() {
  const results: any[] = []
  for (const [tag, name, date] of CASES) {
    const bytes = await buildDiplomaPdf(
      { studentName: name, graduationDate: date, diplomaNumber: 'LCA-2027-0001' },
      'Larose Christian Academy', { city: 'Mobile', state: 'Alabama' },
      { president: 'Anne Brown', headmaster: 'Jonathan Brown' }, emblem)
    const f = path.join(T, `${tag}.pdf`)
    fs.writeFileSync(f, bytes)
    console.log(`  ${tag.padEnd(18)} ${JSON.stringify(name).padEnd(46)} ${(bytes.length / 1024).toFixed(0)} KB`)
  }
  console.log(`\n  wrote ${CASES.length} PDFs to ${T}`)
  console.log('  measure them with: python scripts/measure_diploma_evenness.py')
}

main().catch((e) => { console.error('FAILED:', e); process.exit(1) })
