/**
 * Generate the diploma PDF locally and prove it is a real 9x7 certificate.
 *
 * Verifies the page box from the PDF itself, then reports so the render can be looked at with
 * vision. This is the attachment Mom's "Send" button emails.
 */
import fs from 'fs'
import path from 'path'
import { buildDiplomaPdf, normalizeName, formatDiplomaDate } from '../src/lib/diploma-pdf'

const OUT = path.join(process.env.LOCALAPPDATA || '.', 'Temp', 'diploma_attachment.pdf')
const EMBLEM = path.join(process.cwd(), 'public', 'lca-logo-transparent.png')

async function main() {
  const emblem = fs.existsSync(EMBLEM) ? new Uint8Array(fs.readFileSync(EMBLEM)) : null
  console.log('  emblem embedded:', emblem ? `${emblem.length} bytes` : 'NO (skipped)')

  const bytes = await buildDiplomaPdf(
    { studentName: 'Jonathan Brown', graduationDate: '2027-05-21', diplomaNumber: 'LCA-2027-0001' },
    'Larose Christian Academy',
    { city: 'Mobile', state: 'Alabama' },
    { president: 'Anne Brown', headmaster: 'Jonathan Brown' },
    emblem
  )
  fs.writeFileSync(OUT, bytes)
  console.log('  wrote', OUT, bytes.length, 'bytes')

  // prove the page box from the PDF, not from our intent
  const raw = fs.readFileSync(OUT)
  const m = raw.toString('latin1').match(/MediaBox\s*\[([^\]]+)\]/)
  if (m) {
    const n = m[1].trim().split(/\s+/).map(Number)
    const w = (n[2] - n[0]) / 72
    const h = (n[3] - n[1]) / 72
    console.log(`  page: ${w.toFixed(2)} x ${h.toFixed(2)} in  ${Math.abs(w - 9) < 0.02 && Math.abs(h - 7) < 0.02 ? 'MATCH ✓' : 'WRONG ✗'}`)
  } else {
    console.log('  MediaBox not found ✗')
  }

  // name handling must match the web page
  const cases: [string, string][] = [
    ['Richard  Harrison ', 'Richard Harrison'],
    ['SUMMER GRAHAM', 'Summer Graham'],
    ['ellis graham', 'Ellis Graham'],
    ["mary-jane o'neill", "Mary-Jane O'Neill"],
  ]
  let pass = 0
  for (const [input, want] of cases) {
    const got = normalizeName(input)
    const ok = got === want
    if (ok) pass++
    console.log(`  name ${ok ? '✓' : '✗'}  ${JSON.stringify(input)} -> ${JSON.stringify(got)}`)
  }
  console.log(`  name tests: ${pass}/${cases.length}`)
  console.log('  date:', formatDiplomaDate('2027-05-21'), '|', formatDiplomaDate(null) || '(none)')

  // a long name must shrink, not overflow
  const long = 'Alexandria Catherine Montgomery-Wellington'
  const bytes2 = await buildDiplomaPdf(
    { studentName: long, graduationDate: '2028-06-02', diplomaNumber: 'LCA-2028-0002' },
    'Larose Christian Academy',
    { city: 'Mobile', state: 'Alabama' },
    { president: 'Anne Brown', headmaster: 'Jonathan Brown' },
    emblem
  )
  const OUT2 = path.join(process.env.LOCALAPPDATA || '.', 'Temp', 'diploma_attachment_long.pdf')
  fs.writeFileSync(OUT2, bytes2)
  console.log('  long-name PDF:', OUT2)
}

main().catch((e) => { console.error('FAILED:', e); process.exit(1) })
