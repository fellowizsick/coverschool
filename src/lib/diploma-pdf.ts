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

  // ---------------------------------------------------------------------------------------------
  // POSITIONS ARE THE PAGE'S OWN CENTRES, MEASURED OFF THE LIVE CERTIFICATE.
  //
  // The first version of this file guessed these y values, and every one of them drifted: measured
  // against the live page the paragraph sat 54 design px too high, "This Certifies That" 41px, the
  // date 33px, and the Mobile row 24px - which is what Jonathan saw as "the emblem moved down a
  // little bit" ("I like where the emblems at where the one has my name on it"). Nothing here is
  // eyeballed any more.
  //
  // The page lays itself out with CSS flow, so its centre for each element was measured from the
  // rendered DOM and is written here as the TARGET. A text baseline sits below its visual centre by
  // a fixed fraction of the font size, and that fraction was measured per font family:
  //
  //     blackletter (Old English)   0.362 x size
  //     signature script (Mrs Saint Delafield)   0.143 x size
  //     serif (EB Garamond)         0.355 x size
  //
  // so the baseline to draw at is:  TARGET_CENTRE + FACTOR * size.
  // ---------------------------------------------------------------------------------------------
  const CENTRE = {
    emblemRow: 221.3,          // where the WORDS sit (Mobile / Alabama) — unchanged
    // The emblem's visible artwork is lifted above the words' line so it centres on them and fills
    // the gap above; the box is bigger so the mark itself reads larger.
    // Calibrated by measurement, not guesswork: told 212 the artwork's ink centred at 209.6, so
    // 217.6 lands it at 215.0 — 5.1 design px above the words' centre (220.1), which is the
    // subtle lift Jonathan asked for. The page's -11px produces the same 215.2.
    emblemArtwork: 217.6,
    certifiesThat: 300.6,
    name: 361.2,
    paragraph: 408.6,          // first line; the rest step by STANDARDS_LINE_HEIGHT
    highSchoolDiploma: 498.8,
    inTestimony: 554.4,
    date: 602.4,
    dateRule: 630.9,
    signatureRule: 690.2,
    printedName: 711.9,
    title: 743.4,
    number: 776.2,
  }
  const EMBLEM_BOX = 126        // design px — the page uses the same figure

  const F_BLACK = 0.362
  const F_SERIF = 0.355
  const F_SCRIPT = 0.143
  const at = (centre: number, size: number, factor: number) => centre + factor * size

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
    const flankSize = 34
    const rowY = at(CENTRE.emblemRow, flankSize, F_BLACK)   // words' baseline
    if (emblemBytes) {
      try {
        const png = await doc.embedPng(emblemBytes)
        // Bigger and lifted. The file is mostly transparent padding — the artwork is 83.4% of its
        // height — so enlarging the box enlarges the visible mark. The lift is measured from the
        // page: the artwork centres on the words' own centre, and the extra size goes UPWARD.
        const s = Math.min(dx(EMBLEM_BOX) / png.width, dx(EMBLEM_BOX) / png.height)
        const w = png.width * s
        const h = png.height * s
        page.drawImage(png, { x: (SHEET_W_PT - w) / 2, y: dy(CENTRE.emblemArtwork) - h / 2, width: w, height: h })
      } catch { /* emblem is decoration — never fail a diploma over it */ }
    }
    // The page sets these in BLACKLETTER at 34px with a 42px flex gap either side of a 110px
    // emblem — so each word's inner edge sits 55 + 42 = 97 design px off centre.
    const gapPt = dx(97)
    const wCity = blackletter.widthOfTextAtSize(place.city, flankSize * K)
    const wState = blackletter.widthOfTextAtSize(place.state, flankSize * K)
    page.drawText(place.city, { x: SHEET_W_PT / 2 - gapPt - wCity, y: dy(rowY), size: flankSize * K, font: blackletter, color: INK })
    page.drawText(place.state, { x: SHEET_W_PT / 2 + gapPt, y: dy(rowY), size: flankSize * K, font: blackletter, color: INK })
  }

  // ---- This Certifies That ----------------------------------------------
  centredText(page, 'This Certifies That', blackletter, 24, at(CENTRE.certifiesThat, 24, F_BLACK), INK)

  // ---- the graduate ------------------------------------------------------
  if (name) {
    // identical formula to the web page: nameFontSize(name) * 0.90, in design px
    const ls = parseFloat(nameLetterSpacing(name)) || 0
    const size = nameFontSize(name) * 0.90
    // the CENTRE is fixed, so a longer name grows downward and upward around the same line
    centredText(page, name, blackletter, size, at(CENTRE.name, size, F_BLACK), INK, ls)
  }

  // ---- the standards paragraph ------------------------------------------
  {
    // EXACTLY the lines the web page shows, from the shared module — never wrapped here.
    // Greedy wrapping with Times metrics produced 2 lines where the screen had 3.
    // BLACKLETTER, matching the page. This was drawn in serif while the page renders the same words
    // in Old English, so the block under the name was measurably a different shape (12-31 design px
    // narrower on every line). Jonathan spotted it: "the words underneath the name are a little
    // different". Verified by comparing rendered text widths on both sides.
    STANDARDS_LINES.forEach((l, i) =>
      centredText(page, l, blackletter, 22, at(CENTRE.paragraph, 22, F_BLACK) + i * STANDARDS_LINE_HEIGHT, BODY))
  }

  // ---- High School Diploma ----------------------------------------------
  centredText(page, 'High School Diploma', blackletter, 40, at(CENTRE.highSchoolDiploma, 40, F_BLACK), INK)

  // ---- In Testimony Whereof ---------------------------------------------
  centredText(page, 'In Testimony Whereof we have affixed our signatures.', blackletter, 23, at(CENTRE.inTestimony, 23, F_BLACK), BODY)

  // ---- rule + date -------------------------------------------------------
  {
    // The date first, then its rule BELOW it — the reference reads as an underlined date, not a
    // date under a heading. (Jonathan asked: "Is the line above the date supposed to be under it?")
    if (gradDate) centredText(page, gradDate, blackletter, 30, at(CENTRE.date, 30, F_BLACK), INK)
    const y = dy(CENTRE.dateRule)
    page.drawLine({ start: { x: SHEET_W_PT / 2 - dx(190), y }, end: { x: SHEET_W_PT / 2 + dx(190), y }, thickness: 1.4 * K, color: RULE })
  }

  // ---- signatures --------------------------------------------------------
  // TWO columns, centred on their own axes. The first version centred every piece on the SHEET,
  // which stacked both signatories on top of each other in the middle — caught by looking at the
  // rendered PDF, not by any status code.
  {
    const leftCentre = 220      // design px — mirrors the web page's space-between columns
    const rightCentre = 836
    const colW = dx(300)        // the page's signature rules are 300px wide
    const cols = [
      // the page draws the president's script at 50px and the headmaster's at 31px — different sizes
      // so the two names read at the same visual weight. One shared size made them look wrong.
      // measured: the page draws Mom's script centred at 664.2 and yours at 671.2 — they are NOT
      // on one line, because the two scripts are different sizes.
      { cx: leftCentre, who: signatories.president, title: 'President', sig: 50, centre: 664.2 },
      { cx: rightCentre, who: signatories.headmaster, title: 'Headmaster', sig: 31, centre: 671.2 },
    ]
    for (const c of cols) {
      const centrePt = dx(c.cx)
      const x0 = centrePt - colW / 2

      // script signature
      const sigSize = c.sig * K
      const sw = serifItalic.widthOfTextAtSize(c.who, sigSize)
      const sigY = at(c.centre, c.sig, F_SCRIPT)
      page.drawText(c.who, { x: centrePt - sw / 2, y: dy(sigY), size: sigSize, font: serifItalic, color: INK })

      // the rule beneath it
      page.drawLine({
        start: { x: x0, y: dy(CENTRE.signatureRule) }, end: { x: x0 + colW, y: dy(CENTRE.signatureRule) },
        thickness: 0.8 * K, color: RULE,
      })

      // printed name and title, each centred in THIS column
      const nameSize = 25 * K
      const nw = blackletter.widthOfTextAtSize(c.who, nameSize)
      // BLACKLETTER, like the page — serif here made the printed name measurably narrower
      // than the one Mom previewed (Anne Palmer 125.8 vs 137.4 design px).
      page.drawText(c.who, { x: centrePt - nw / 2, y: dy(at(CENTRE.printedName, 25, F_BLACK)), size: nameSize, font: blackletter, color: INK })

      const titleSize = 17 * K
      const tw = blackletter.widthOfTextAtSize(c.title, titleSize)
      // likewise the title — the page uses the blackletter face for 'President'/'Headmaster'
      page.drawText(c.title, { x: centrePt - tw / 2, y: dy(at(CENTRE.title, 17, F_BLACK)), size: titleSize, font: blackletter, color: INK })
    }
  }

  // ---- certificate number ------------------------------------------------
  if (input.diplomaNumber) {
    centredText(page, `No. ${input.diplomaNumber}`, serif, 13, at(CENTRE.number, 13, F_SERIF), BODY, 0.6)
  }

  return await doc.save()
}
