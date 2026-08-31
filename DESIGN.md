---
version: 1.0
name: larose-christian-academy-design
description: The Larose Christian Academy brand system — a warm, trustworthy Christian school look built on emerald green + amber gold, serif display headings, and soft light surfaces. Locked 2026-08-30 after the color-consistency pass.
---

# Larose Christian Academy — DESIGN.md

## Brand in one line
A private Christian cover-school for homeschool families: **trustworthy, warm, modern-classical**. Emerald is the faith/hope green, amber is the friendly gold accent, Playfair serif gives the school authority, soft light surfaces keep it approachable (not sterile).

## Colors (LOCKED — one palette, no drift)

### Core brand
| Token | Value | Use |
|-------|-------|-----|
| `brand-green-950` | `#022c22` (emerald-950) | Page backgrounds, hero bottom, footer base |
| `brand-green-900` | `#064e3b` (emerald-900) | Hero gradients (from), dark sections |
| `brand-green-800` | `#065f46` (emerald-800) | Hero gradients (via), dark panels |
| `brand-green-700` | `#047857` (emerald-700) | Primary CTA buttons (from), links |
| `brand-green-600` | `#059669` (emerald-600) | Primary CTA buttons (to), accents, selection |
| `brand-green-500` | `#10b981` (emerald-500) | Icons, focus rings, divider highlights |
| `brand-green-50` | `#ecfdf5` (emerald-50) | Badge/card tints, soft section fills |
### Amber accent (the ONLY second color)
| Token | Value | Use |
|-------|-------|-----|
| `brand-gold-500` | `#f59e0b` (amber-500) | Gold CTA buttons, accent icons, gradient stops |
| `brand-gold-400` | `#fbbf24` (amber-400) | Gradient mid-stops, highlights |
| `brand-gold-300` | `#fcd34d` (amber-300) | Soft gradient ends, light dividers |
| `brand-gold-50` | `#fffbeb` (amber-50) | Warm card tints, testimonial fills |
### Neutral / text
| Token | Value | Use |
|-------|-------|-----|
| `ink` | `#111827` (gray-900) | Headings on light |
| `body` | `#374151` (gray-700) | Body copy |
| `body-muted` | `#6b7280` (gray-500) | Secondary / captions |
| `canvas` | `#ffffff` | Default background |
| `canvas-soft` | `#f9fafb` (gray-50) | Section alternates |

### BANNED in this brand (removed 2026-08-30)
- **Pink, purple, violet, fuchsia, indigo, sky/cyan, rose, blue** as decorative accents.
  They were the AI-slop tell: the brand is emerald + amber. Do not reintroduce.
- Exception (semantic only): **red/rose** stays for destructive/delete actions
  (e.g. trash icon, delete badge in the calendar) and error states.

## Typography
- **Display / headings:** Playfair Display (`.font-heading`), Georgia serif fallback.
- **Body / UI:** Inter (system sans fallback).
- Headline default rhythm: `text-3xl sm:text-4xl font-bold tracking-tight font-heading`.
- Hero headline: `text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight font-heading`.
- Word-level highlight: use `gradient-text-rainbow` ONLY for the hero word
  "Confidence" (the look Jonathan and Anne chose — keep it). Do not spread
  rainbow text elsewhere.

## Gradients (the sanctioned three)
1. `gradient-text` — `linear-gradient(to right, #047857, #059669, #d97706)` (emerald→emerald→amber).
2. `gradient-text-rainbow` — hero "Confidence" word only (kept by user preference).
3. `divider-rainbow` — now **emerald→amber** (`#059669, #10b981, #f59e0b, #10b981, #059669`), not rainbow.
4. Hero section backgrounds: `from-emerald-950 via-emerald-900 to-gray-950` (home) or
   `from-emerald-900 via-emerald-700 to-teal-800` (inner pages). **No pink/purple/sky hero gradients.**
5. Blur glow blobs in heroes/footers: emerald + amber only (`bg-emerald-500/10`, `bg-amber-500/10`).

## Buttons
| Variant | Style |
|---------|-------|
| `primary` | `from-emerald-700 to-emerald-600 text-white`, emerald shadow |
| `gold` | `from-amber-500 via-amber-400 to-yellow-400 text-amber-950`, amber shadow |
| `fun` | `from-emerald-600 via-teal-500 to-amber-400 text-white`, animated gradient, emerald shadow |
| `pink/purple/sky` | Renamed in spirit — now emerald/teal family (kept names for API compat) |
| `outline` | `border-emerald-200 bg-white/80 text-emerald-800` |
| `ghost` | gray → emerald on hover |

## Radius & elevation
- Buttons/pills: `rounded-xl` (buttons), `rounded-full` (badges/pills).
- Cards: `rounded-2xl`.
- Shadows are emerald-tinted (`shadow-emerald-900/10`), never pure black,
  never pink/purple-tinted.

## Cards (`Card fun=` palette)
- `green` (emerald), `amber` (gold) — the only two used on marketing pages.
- `blue/pink/purple/rose/sky` styles remain in the component for kid-facing
  learning pages (AdventureMap, Flashcards, Certificates) — intentionally
  colorful for children. **Do not use them on marketing pages.**

## Layout rules
- Full-viewport wrappers use `min-h-[100dvh]` (never `min-h-screen`).
- Hero mockup frames are fluid: fixed px widths MUST carry `max-w-full`.
- Marketing page accent badges: **max 1-2 per page**, emerald or amber tint.
  The hero 🙌 badge (hero only) is the brand's signature touch — keep it.
- Eyebrow restraint: not every section gets a pill badge. Vary section rhythm.

## Content notes
- Stats ("500+ families", "10+ years") are aspirational per Jonathan — do not edit.
- State-law pages: statute-verified claims only; HSLDA + state DOE cross-check.

## Do / Don't
**Do:** emerald everywhere as primary; amber as the single warm accent; Playfair for
headings; soft white/emerald-50 surfaces; emerald-tinted shadows; ONE accent badge
pattern per section.
**Don't:** pink/purple/sky/cyan/indigo decorations anywhere on marketing pages;
rainbow gradients except the hero "Confidence" word; purple-tinted shadows;
`min-h-screen`; fixed-width hero mockups without `max-w-full`.