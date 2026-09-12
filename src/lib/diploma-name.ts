/**
 * Name handling for the diploma. A credential must never print a name wrong.
 *
 * Jonathan, 2026-09-11: "It needs to make sure names are all even on the diploma aswell cannot
 * be distorted or misspelled words or names"
 *
 * THREE REAL DEFECTS THIS FIXES
 *
 * 1. STRAY WHITESPACE. The enrollments table stores names with trailing spaces —
 *    "Richard " / "Harrison ". Concatenated naively that prints "Richard  Harrison " with a
 *    double space in the middle and a trailing space before the gold rule. That is a visible
 *    defect on a credential and it is already in the data today.
 *
 * 2. WRONG CASE. Names arrive anywhere from "SUMMER" to "summer". A diploma prints a person's
 *    name properly capitalised. Small particles (de, van, der, la) and hyphenated parts are
 *    respected — "mary-jane o'neill" must not become "Mary-Jane O'neill".
 *
 * 3. OVERFLOW. The certificate is a fixed 11 x 8.5 sheet and the name is the largest element on
 *    it. "Alexandria Catherine Montgomery" at the short-name size runs past the border, and a
 *    clipped or wrapped name is the single most obvious way a diploma looks fake. The size now
 *    steps down with the length of the name.
 */

/** Collapse whitespace, trim, and fix capitalisation. Safe to call on anything. */
export function normalizeName(raw: string | null | undefined): string {
  const cleaned = String(raw ?? '')
    .replace(/\s+/g, ' ')   // runs of spaces/tabs/newlines -> one space
    .replace(/\u00A0/g, ' ') // non-breaking spaces
    .trim()
  if (!cleaned) return ''

  return cleaned
    .split(' ')
    .map((word) =>
      word
        .split('-')
        .map((part) => part.split("'").map((piece) => capitalizePart(piece)).join("'"))
        .join('-'),
    )
    .join(' ')
}

function capitalizePart(part: string): string {
  if (!part) return part
  // Respect explicit internal capitals the family chose: McDonald, DeLaCruz, O'Brien.
  if (/[a-z]/.test(part) && /[A-Z]/.test(part.slice(1))) return part
  const lower = part.toLowerCase()
  // Keep the small particles lowercase when they are not the first word of a surname chunk.
  if (['de', 'del', 'der', 'van', 'von', 'la', 'le', 'di', 'da', 'st'].includes(lower)) {
    return lower
  }
  return lower.charAt(0).toUpperCase() + lower.slice(1)
}

/** "Summer Graham" — first + last, each normalised, joined by exactly one space. */
export function fullName(first?: string | null, last?: string | null): string {
  return [normalizeName(first), normalizeName(last)].filter(Boolean).join(' ')
}

/**
 * Font size for the name, stepped so a long name always fits the sheet evenly.
 * The base is the size the design was drawn at; each band steps it down.
 */
export function nameFontSize(name: string): number {
  const n = normalizeName(name).length
  if (n <= 18) return 58
  if (n <= 24) return 50
  if (n <= 30) return 43
  if (n <= 38) return 36
  if (n <= 48) return 30
  return 26
}

/** Longer names need slightly tighter tracking so they still read as one line. */
export function nameLetterSpacing(name: string): string {
  const n = normalizeName(name).length
  if (n <= 18) return '0.5px'
  if (n <= 30) return '0px'
  return '-0.5px'
}
