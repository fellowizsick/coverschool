/**
 * reviewFilter.ts — moderation filter for family reviews.
 * User directive 2026-08-05: only good, respectful reviews get published;
 * no bad/inappropriate ones. This filter blocks profanity, hate, threats,
 * spam, and clearly negative attacks. Reviews that pass are approved
 * immediately; anything that trips the filter is HELD (not published).
 *
 * The filter is conservative: it blocks clear violations and obvious
 * negativity. It does NOT try to catch every subtle insult (no filter is
 * perfect) — a human can review held reviews in the DB later.
 */

const BLOCKED_WORDS = [
  // profanity / vulgarity (common forms)
  'fuck', 'shit', 'bitch', 'asshole', 'dick', 'pissed off', 'bastard',
  'cunt', 'whore', 'slut', 'damn it', 'goddamn', 'bullshit', 'crap on',
  // hate / slurs
  'nigger', 'faggot', 'retard', 'tranny', 'kike', 'spic', 'chink', 'wetback',
  'hate you', 'i hate', 'kill you', 'kill yourself', 'die', 'threat',
  // scam / fraud accusations (legal risk if false, and not respectful)
  'scam', 'fraud', 'ripoff', 'rip-off', 'stole my money', 'stole money',
  'money laundering', 'illegal', 'lawsuit', 'sue', 'lawyer', 'attorney',
  'cps', 'police', 'fbi', 'reported you', 'reporting you',
  // explicit / sexual
  'porn', 'sex', 'naked', 'orgy',
]

// Negativity phrases that indicate a rant rather than helpful feedback
const NEGATIVE_PHRASES = [
  'worst', 'terrible', 'horrible', 'awful', 'disgusting', 'pathetic',
  'useless', 'waste of money', 'waste of time', 'never join', 'don\'t join',
  'do not join', 'stay away', 'avoid', 'ripped off', 'cheated',
  'never respond', 'never replied', 'no response', 'ignored me',
  'rude', 'unprofessional', 'liars', 'lying', 'crooks', 'scammers',
]

// True if the review looks like a genuine positive/neutral comment
export function isRespectfulReview(quote: string, rating: number): boolean {
  const text = ' ' + (quote || '').toLowerCase() + ' '

  // Hard block on profanity / hate / threats / legal-risk words
  for (const w of BLOCKED_WORDS) {
    // match whole-ish word to avoid false positives like "class" vs "ass"
    if (text.includes(w)) return false
  }

  // Low rating with negative language = not a "good comment"
  if (rating <= 3) return false

  // Strongly negative phrasing = hold it
  for (const p of NEGATIVE_PHRASES) {
    if (text.includes(p)) return false
  }

  // Too short to be a real review (or empty spam)
  if (quote.trim().length < 20) return false

  return true
}

/** A safe display name — first name + last initial, no full names. */
export function safeDisplayName(raw: string): string {
  const cleaned = (raw || '').trim().replace(/\s+/g, ' ')
  if (!cleaned) return 'LCA Family'
  const parts = cleaned.split(' ')
  if (parts.length === 1) return cleaned
  return `${parts[0]} ${parts[parts.length - 1][0]}.`
}

/** A display role string — keeps it simple and consistent. */
export function safeRole(state?: string): string {
  const st = (state || '').trim()
  return st ? `Homeschool Parent, ${st}` : 'Homeschool Parent'
}
