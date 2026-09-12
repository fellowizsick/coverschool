/**
 * Build a set of sample diplomas with different names, for Jonathan to compare side by side.
 *
 * Jonathan, 2026-09-12: "I want to see it so send them to me so I can verify that they look the
 * same and they look you know with different [names]."
 *
 * Uses the REAL builder with the real arguments (school name, city/state, signatories and emblem),
 * so these are byte-for-byte what a family receives — nothing about the layout is special-cased.
 * Numbers are marked SAMPLE so they can never be mistaken for real records.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'
import { buildDiplomaPdf } from '../src/lib/diploma-pdf'
import { SCHOOL_CONFIG } from '../src/lib/constants'

const OUT = join(process.env.LOCALAPPDATA || '.', 'Temp', 'diploma_samples')

// deliberately awkward variety: your own name (to compare against the approved one), a long name,
// a hyphen, an apostrophe, a middle name, and several dates.
const CASES: Array<[string, string]> = [
  ['Jonathan Brown', '2027-05-21'],
  ['Emily Rose Carter', '2026-09-12'],
  ['Marcus Daniel Whitfield', '2027-05-21'],
  ['Alexandria Catherine Montgomery-Wellington', '2026-12-31'],
  ['Mary-Jane O\u2019Neill', '2027-06-01'],
]

const slug = (s: string) => s.replace(/[^A-Za-z0-9 _-]/g, '').replace(/\s+/g, '_')

async function main() {
  mkdirSync(OUT, { recursive: true })

  let emblem: Uint8Array | null = null
  try {
    const p = join(process.cwd(), 'public', 'lca-logo-transparent.png')
    if (existsSync(p)) emblem = new Uint8Array(readFileSync(p))
  } catch { /* emblem is optional */ }

  const manifest: Array<{ file: string; name: string; date: string }> = []
  for (let i = 0; i < CASES.length; i++) {
    const [studentName, graduationDate] = CASES[i]
    const number = `LCA-SAMPLE-${String(i + 1).padStart(2, '0')}`
    const bytes = await buildDiplomaPdf(
      { studentName, graduationDate, diplomaNumber: number },
      SCHOOL_CONFIG.name,
      { city: 'Mobile', state: 'Alabama' },
      { president: SCHOOL_CONFIG.president, headmaster: SCHOOL_CONFIG.headmaster },
      emblem,
    )
    const file = join(OUT, `Diploma_${slug(studentName)}_${number}.pdf`)
    writeFileSync(file, bytes)
    manifest.push({ file, name: studentName, date: graduationDate })
    console.log(`  ${file}`)
  }
  writeFileSync(join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2))
  console.log(`  ${CASES.length} samples built into ${OUT}`)
}

main().catch((e) => { console.error('  FAILED:', e); process.exit(1) })
