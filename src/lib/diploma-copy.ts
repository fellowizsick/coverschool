/**
 * The fixed wording on the diploma, in ONE place.
 *
 * Why this file exists: the standards paragraph used to be free text that each renderer wrapped for
 * itself. The web page let the browser wrap it (3 lines, text-wrap: balance); the emailed PDF
 * wrapped it greedily with Times metrics (2 lines). Same words, different shape — so the block
 * under the name looked different and sat differently in the email than on screen.
 * Jonathan, 2026-09-12: "Why did the words underneath the name change? Their text changed and they
 * changed their position... only the name should change and only the date should change."
 *
 * The lines below are THE layout. Both renderers draw exactly these, so they cannot drift apart.
 */
export const STANDARDS_LINES = [
  'having satisfactorily completed the course of study in conformity with the standards',
  'and requirements set forth for High Schools in the State of Alabama and',
  'having complied with all requirements of this Institution is hereby awarded this',
] as const

/** The paragraph's line-height on screen. The PDF steps its baselines by the same amount. */
export const STANDARDS_LINE_HEIGHT = 22 * 0.98   // fontSize 22px * lineHeight 0.98
