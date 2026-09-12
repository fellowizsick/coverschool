/**
 * Render the SAME diploma for several names and dates, so they can be compared pixel by pixel.
 *
 * Jonathan, 2026-09-12: "they don't need to be changing up all the time because our diplomas have
 * to look consistent ... only the name and the date changes ... consistency is key with this."
 *
 * Writes one PDF per case into temp. check_diploma_consistency.py then blanks the name and date
 * bands and proves nothing else differs.
 *
 * The arguments mirror the real call in src/app/api/admin-diplomas/route.ts exactly — including
 * the emblem — so this renders what a family would actually receive.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'
import { buildDiplomaPdf } from '../src/lib/diploma-pdf'
import { SCHOOL_CONFIG } from '../src/lib/constants'

const OUT = join(process.env.LOCALAPPDATA || '.', 'Temp', 'consistency')

const CASES: Array<[string, string]> = [
  ['Jonathan Brown', '2027-05-21'],
  ['Maria Elena Rodriguez', '2026-09-12'],
  ['Ann Lee', '2028-01-05'],
  ['Alexandria Catherine Montgomery-Wellington', '2026-12-31'],
  ['Mary-Jane O\u2019Neill', '2027-06-01'],
  ['Blake  Graham', '2027-05-21'],
]

async function main() {
  mkdirSync(OUT, { recursive: true })

  let emblem: Uint8Array | null = null
  try {
    const p = join(process.cwd(), 'public', 'lca-logo-transparent.png')
    if (existsSync(p)) emblem = new Uint8Array(readFileSync(p))
  } catch { /* emblem is optional */ }
  console.log(`  emblem: ${emblem ? emblem.length + ' bytes' : 'MISSING'}`)

  for (let i = 0; i < CASES.length; i++) {
    const [studentName, graduationDate] = CASES[i]
    const bytes = await buildDiplomaPdf(
      { studentName, graduationDate, diplomaNumber: 'LCA-2027-0001' },
      SCHOOL_CONFIG.name,
      { city: 'Mobile', state: 'Alabama' },
      { president: SCHOOL_CONFIG.president, headmaster: SCHOOL_CONFIG.headmaster },
      emblem,
    )
    const p = join(OUT, `case_${String(i).padStart(2, '0')}.pdf`)
    writeFileSync(p, bytes)
    console.log(`  wrote ${p}  ("${studentName}"  ${graduationDate})`)
  }
  console.log(`  ${CASES.length} cases rendered into ${OUT}`)
}

main().catch((e) => { console.error('  FAILED:', e); process.exit(1) })
