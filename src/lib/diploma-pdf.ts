// Builds the actual diploma as a print-ready PDF, for attaching to the email Mom sends.
//
// WHY THIS EXISTS (2026-09-11): her "Send" button emailed a notice that SAID "This is your copy of
// the graduation diploma" while attaching nothing. A parent received no diploma. This generates the
// real certificate so the email carries it.
//
// LAYOUT DISCIPLINE — this is a SECOND renderer of the same certificate, and a second renderer can
// drift from the first. Everything here is expressed in the SAME design coordinates as the approved
// web page (`src/app/print/diploma/[enrollmentId]/page.tsx`, a 1056 x 816 box) and scaled by the
// same factor, so the two stay comparable. If you change one, change the other. The web page is the
// master; this follows it.
//
// The sheet is 9 x 7 inches = 648 x 504 pt. 1056 design px -> 648 pt, so 1 design px = 0.613636 pt.
//
// FONTS: Old English Text MT (the real diploma face, self-hosted) for everything blackletter, and
// pdf-lib's built-in Times for the body copy and signatures. No network fetch at send time — an
// email must never fail because a font CDN was slow.

import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib'
import { STANDARDS_LINES, STANDARDS_LINE_HEIGHT } from './diploma-copy'
import { normalizeName, nameFontSize, nameLetterSpacing } from './diploma-name'
import fontkit from '@pdf-lib/fontkit'
import fs from 'fs'
import path from 'path'

const SHEET_W_PT = 648            // 9in
const SHEET_H_PT = 504            // 7in
const DESIGN_W = 1056             // the web page's interior box
const DESIGN_H = 816
const K = SHEET_W_PT / DESIGN_W   // 0.613636 — design px -> pt

/** design px -> PDF pt, with the y axis flipped (design y grows down, PDF y grows up). */
const dx = (v: number) => v * K
const dy = (v: number) => SHEET_H_PT - v * K

const INK = rgb(0.067, 0.067, 0.067)
const BODY = rgb(0.102, 0.102, 0.102)
const RULE = rgb(0.169, 0.169, 0.169)

export type DiplomaPdfInput = {
  studentName: string
  graduationDate: string | null   // ISO yyyy-mm-dd
  diplomaNumber: string
}

/** The long-form date the certificate prints, e.g. "May 21, 2027". */
export function formatDiplomaDate(iso: string | null): string {
  if (!iso) return ''
  const d = new Date(iso + 'T00:00:00')
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

// Name handling lives in ONE place — ./diploma-name — so the screen and the PDF can never
// disagree about a name's text, size or tracking. A second copy here already drifted once.
export { normalizeName }

/**
 * Draw text along an arc. pdf-lib has no textPath, so characters are placed individually along the
 * same parabola the web page uses, each rotated to the tangent. This is what makes the PDF renderer
 * match the screen renderer instead of approximating it.
 */
function drawArchedText(
  page: any,
  text: string,
  font: any,
  size: number,
  cxDesign: number,
  apexDesignY: number,
  halfSpanDesign: number,
  riseDesign: number
) {
  const chars = Array.from(text)
  const widths = chars.map((c) => font.widthOfTextAtSize(c, size))
  const total = widths.reduce((a, b) => a + b, 0)

  // walk the string from left to right, placing each glyph on the parabola
  let travelled = -total / 2
  for (let i = 0; i < chars.length; i++) {
    const w = widths[i]
    const centre = travelled + w / 2
    travelled += w

    // t in [-1, 1] across the arc
    const t = halfSpanDesign === 0 ? 0 : centre / halfSpanDesign
    if (Math.abs(t) > 1.06) continue // never draw past the arc ends
    // parabola: y = apex + rise * t^2  (rise is positive downward in design space)
    const yDesign = apexDesignY + riseDesign * t * t
    const xDesign = cxDesign + centre
    // slope dy/dx for the rotation
    const slope = (2 * riseDesign * t) / halfSpanDesign
    const angle = -Math.atan(slope) * (180 / Math.PI)

    page.drawText(chars[i], {
      x: dx(xDesign) - w * K / 2,
      y: dy(yDesign),
      size: size * K,
      font,
      color: INK,
      rotate: degrees(angle),
    })
  }
}

/** Centre a single line of text horizontally in design space. */
function centredText(
  page: any,
  text: string,
  font: any,
  sizeDesign: number,
  yDesign: number,
  color = BODY,
  letterSpacing = 0
) {
  const size = sizeDesign * K
  const w = font.widthOfTextAtSize(text, size) + letterSpacing * Math.max(0, text.length - 1) * K
  const x = (SHEET_W_PT - w) / 2
  const y = dy(yDesign)
  if (letterSpacing === 0) {
    page.drawText(text, { x, y, size, font, color })
  } else {
    // letterSpacing is used by the web page on the graduate's name
    let cx = x
    for (const ch of Array.from(text)) {
      page.drawText(ch, { x: cx, y, size, font, color })
      cx += font.widthOfTextAtSize(ch, size) + letterSpacing * K
    }
  }
}

/**
 * Build the diploma PDF. Returns a Uint8Array suitable for a nodemailer attachment.
 * `emblemBytes` may be null — the emblem is skipped rather than failing the send.
 */
export async function buildDiplomaPdf(
  input: DiplomaPdfInput,
  schoolName: string,
  place: { city: string; state: string },
  signatories: { president: string; headmaster: string },
  emblemBytes: Uint8Array | null
): Promise<Uint8Array> {
  const doc = await PDFDocument.create()
  doc.registerFontkit(fontkit)

  const page = doc.addPage([SHEET_W_PT, SHEET_H_PT])
  const name = normalizeName(input.studentName)
  const gradDate = formatDiplomaDate(input.graduationDate)

  // ---- fonts -------------------------------------------------------------
  // MUST match what the web page renders, or the emailed certificate looks like a different
  // document from the one Mom previewed and approved. The web page uses:
  //   Old English Text MT  - all blackletter
  //   EB Garamond          - the standards paragraph and the flanking words
  //   Mrs Saint Delafield  - the signature script
  // A first version fell back to Times for the last two (they were not on disk), which is exactly
  // the "it changed the signatures and looks different" the user spotted.
  const fontDir = path.join(process.cwd(), 'public', 'fonts')
  const load = (file: string) => {
    try {
      const p = path.join(fontDir, file)
      return fs.existsSync(p) ? fs.readFileSync(p) : null
    } catch { return null }
  }

  const blBytes = load('OldEnglishTextMT.ttf')
  const scriptBytes = load('MrsSaintDelafield-Regular.ttf')
  const bodyBytes = load('EBGaramond[wght].ttf') || load('EBGaramond-Regular.ttf')

  const blackletter = blBytes
    ? await doc.embedFont(blBytes, { subset: true })
    : await doc.embedFont(StandardFonts.TimesRoman)
  const script = scriptBytes
    ? await doc.embedFont(scriptBytes, { subset: true })
    : await doc.embedFont(StandardFonts.TimesRomanItalic)
  const serif = bodyBytes
    ? await doc.embedFont(bodyBytes, { subset: false })
    : await doc.embedFont(StandardFonts.TimesRoman)
  const serifItalic = script   // the signature script, matching the web page

  // ---- paper + frame -----------------------------------------------------
  page.drawRectangle({ x: 0, y: 0, width: SHEET_W_PT, height: SHEET_H_PT, color: rgb(0.957, 0.937, 0.886) })
  // Height must be a POSITIVE length. Computing it as dy(top) - dy(bottom) inverted it — dy() flips
  // the axis, so the subtraction came out negative and the frame collapsed (visible only along the
  // bottom edge). Equal insets on all sides means height = the same span as the width.
  // Insets taken straight from the page: it sets inset 20px / 24px on an 864px-wide sheet, which is
  // 24.4 / 29.3 design px. Border widths likewise: 0.7px and 0.4px at 96dpi are 0.525pt and 0.3pt.
  page.drawRectangle({
    x: dx(24.4), y: dy(DESIGN_H - 24.4),
    width: dx(DESIGN_W - 48.8), height: dx(DESIGN_H - 48.8),
    borderColor: rgb(0.42, 0.384, 0.314), borderWidth: 0.525,
  })
  page.drawRectangle({
    x: dx(29.3), y: dy(DESIGN_H - 29.3),
    width: dx(DESIGN_W - 58.6), height: dx(DESIGN_H - 58.6),
    borderColor: rgb(0.541, 0.51, 0.447), borderWidth: 0.3,
  })

  // ---- school name, arched ----------------------------------------------
  // Matches the approved web geometry: viewBox 3200 wide, arc M 20 491 Q 1600 211 3180 491,
  // box 154 design px tall sitting at the top of the interior.
  {
    const boxTop = 4
    const scale = 154 / 550            // the web page's svg scale
    const apexY = (491 + 2 * 211 + 491) / 4   // 351
    const apexOnSheet = boxTop + apexY * scale // 48px into the box
    const riseOnSheet = (491 - apexY) * scale  // the arc's rise, ~39px
    const halfSpan = ((3200 - 40) / 2) * scale // ~434px each side
    drawArchedText(page, schoolName, blackletter, 250 * scale, DESIGN_W / 2, apexOnSheet, halfSpan, riseOnSheet)
  }

  // ---- Mobile — emblem — Alabama ----------------------------------------
  {
    const rowY = 210           // design px, baseline of the flanking words
    if (emblemBytes) {
      try {
        const png = await doc.embedPng(emblemBytes)
        const box = 110                                   // approved emblem size, design px
        const s = Math.min(dx(box) / png.width, dx(box) / png.height)
        const w = png.width * s
        const h = png.height * s
        page.drawImage(png, { x: (SHEET_W_PT - w) / 2, y: dy(rowY) - h / 2, width: w, height: h })
      } catch { /* emblem is decoration — never fail a diploma over it */ }
    }
    // The page sets these in BLACKLETTER at 34px with a 42px flex gap either side of a 110px
    // emblem — so each word's inner edge sits 55 + 42 = 97 design px off centre.
    const flankSize = 34
    const gapPt = dx(97)
    const wCity = blackletter.widthOfTextAtSize(place.city, flankSize * K)
    const wState = blackletter.widthOfTextAtSize(place.state, flankSize * K)
    page.drawText(place.city, { x: SHEET_W_PT / 2 - gapPt - wCity, y: dy(rowY), size: flankSize * K, font: blackletter, color: INK })
    page.drawText(place.state, { x: SHEET_W_PT / 2 + gapPt, y: dy(rowY), size: flankSize * K, font: blackletter, color: INK })
  }

  // ---- This Certifies That ----------------------------------------------
  centredText(page, 'This Certifies That', blackletter, 24, 268, INK)

  // ---- the graduate ------------------------------------------------------
  if (name) {
    // identical formula to the web page: nameFontSize(name) * 0.90, in design px
    const ls = parseFloat(nameLetterSpacing(name)) || 0
    centredText(page, name, blackletter, nameFontSize(name) * 0.90, 330, INK, ls)
  }

  // ---- the standards paragraph ------------------------------------------
  {
    // EXACTLY the lines the web page shows, from the shared module — never wrapped here.
    // Greedy wrapping with Times metrics produced 2 lines where the screen had 3.
    STANDARDS_LINES.forEach((l, i) =>
      centredText(page, l, serif, 22, 362 + i * STANDARDS_LINE_HEIGHT, BODY))
  }

  // ---- High School Diploma ----------------------------------------------
  centredText(page, 'High School Diploma', blackletter, 40, 492, INK)

  // ---- In Testimony Whereof ---------------------------------------------
  centredText(page, 'In Testimony Whereof we have affixed our signatures.', blackletter, 23, 528, BODY)

  // ---- rule + date -------------------------------------------------------
  {
    // The date first, then its rule BELOW it — the reference reads as an underlined date, not a
    // date under a heading. (Jonathan asked: "Is the line above the date supposed to be under it?")
    if (gradDate) centredText(page, gradDate, blackletter, 30, 580, INK)
    const y = dy(596)
    page.drawLine({ start: { x: SHEET_W_PT / 2 - dx(190), y }, end: { x: SHEET_W_PT / 2 + dx(190), y }, thickness: 1.4 * K, color: RULE })
  }

  // ---- signatures --------------------------------------------------------
  // TWO columns, centred on their own axes. The first version centred every piece on the SHEET,
  // which stacked both signatories on top of each other in the middle — caught by looking at the
  // rendered PDF, not by any status code.
  {
    const yTop = 660
    const leftCentre = 220      // design px — mirrors the web page's space-between columns
    const rightCentre = 836
    const colW = dx(300)        // the page's signature rules are 300px wide
    const cols = [
      // the page draws the president's script at 50px and the headmaster's at 31px — different sizes
      // so the two names read at the same visual weight. One shared size made them look wrong.
      { cx: leftCentre, who: signatories.president, title: 'President', sig: 50 },
      { cx: rightCentre, who: signatories.headmaster, title: 'Headmaster', sig: 31 },
    ]
    for (const c of cols) {
      const centrePt = dx(c.cx)
      const x0 = centrePt - colW / 2

      // script signature
      const sigSize = c.sig * K
      const sw = serifItalic.widthOfTextAtSize(c.who, sigSize)
      page.drawText(c.who, { x: centrePt - sw / 2, y: dy(yTop), size: sigSize, font: serifItalic, color: INK })

      // the rule beneath it
      page.drawLine({
        start: { x: x0, y: dy(700) }, end: { x: x0 + colW, y: dy(700) },
        thickness: 0.8 * K, color: RULE,
      })

      // printed name and title, each centred in THIS column
      const nameSize = 25 * K
      const nw = serif.widthOfTextAtSize(c.who, nameSize)
      page.drawText(c.who, { x: centrePt - nw / 2, y: dy(722), size: nameSize, font: serif, color: INK })

      const titleSize = 17 * K
      const tw = serif.widthOfTextAtSize(c.title, titleSize)
      page.drawText(c.title, { x: centrePt - tw / 2, y: dy(746), size: titleSize, font: serif, color: INK })
    }
  }

  // ---- certificate number ------------------------------------------------
  if (input.diplomaNumber) {
    centredText(page, `No. ${input.diplomaNumber}`, serif, 13, 784, BODY, 0.6)
  }

  return await doc.save()
}
