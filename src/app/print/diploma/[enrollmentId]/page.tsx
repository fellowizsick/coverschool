import { createAdminClient, createClient } from '@/lib/supabase/server'
import { STANDARDS_LINES } from '@/lib/diploma-copy'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { isAuthorizedAdmin } from '@/lib/adminAccess'
import { SCHOOL_CONFIG } from '@/lib/constants'
import { EB_Garamond, Mrs_Saint_Delafield } from 'next/font/google'
import PrintButton from '@/components/PrintButton'
import { normalizeName, fullName, nameFontSize, nameLetterSpacing } from '@/lib/diploma-name'

export const dynamic = 'force-dynamic'

/**
 * The diploma. Laid out to match the reference Jonathan supplied on 2026-09-11 — his own 2014
 * Mobile Christian High School diploma — with our school's information in it.
 *
 * "The diploma needs to look identical to this but with our information"
 *
 * WHAT CHANGED FROM THE FIRST VERSION, and why each one matters:
 *
 * 1. TYPE. The first version set everything in Cinzel, a classical Roman face. The reference is
 *    blackletter (Old English / textura). That single difference is the loudest signal of a
 *    home-made certificate, because it is the first thing the eye compares against a real one.
 *    UnifrakturMaguntia is the standard free blackletter for diplomas — it is what Cloister Black
 *    (the classic diploma face) is usually standing in for.
 *
 * 2. THE SEAL. Mine sat low-left above the signature block. The reference puts the state seal
 *    dead centre on the third line, flanked by the city on the left and the state on the right:
 *
 *        Mobile        [ SEAL ]        Alabama
 *
 *    That row is a structural part of the design, not decoration, so it is reproduced exactly.
 *
 * 3. THE BORDER. A plain double rule with a gold frame at the trim, not the heavy ormolu
 *    banding of the first version.
 *
 * 4. "High School Diploma". The 2014 reference prints "Diploma" alone, but Jonathan asked for
 *    the full "High School Diploma" on 2026-09-11: "Where it shows diploma it needs to say
 *    high school diploma." His call overrides the reference.
 *
 * Everything that varies per student (name, date, number) still resolves at runtime from the
 * student's own record, and the name is still normalised: a credential must never print a name
 * with a double space or the wrong capitalisation.
 */

// ROUNDED Old English — chosen by eye from a side-by-side of eight candidates.
//
// History: UnifrakturMaguntia (angular Fraktur) -> Pirata One (still pointed) -> UnifrakturCook.
// Jonathan, 2026-09-11: "the letters aren't rounded at the top". UnifrakturCook has the heavy
// rounded bowls and rounded terminals his 2014 reference diploma has; the earlier two did not.
// Chosen by rendering all eight on one sheet rather than guessing a third time.

// Real signatures. The first version drew an SVG squiggle and it read as a child's scribble
// ("the signatures look like a child scribbled them"). Setting the actual names in a signature
// script is how a diploma actually looks, and it stays correct for any signatory.
const script = Mrs_Saint_Delafield({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-signature',
  display: 'swap',
})
const garamond = EB_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-garamond',
  display: 'swap',
})

export default async function DiplomaPage({ params }: { params: Promise<{ enrollmentId: string }> }) {
  const { enrollmentId } = await params

  const auth = await createClient()
  const { data: { user } } = await auth.auth.getUser()
  if (!user || !isAuthorizedAdmin(user.email)) notFound()

  const admin = createAdminClient()
  const { data: diploma } = await admin
    .from('diplomas')
    .select('*')
    .eq('enrollment_id', enrollmentId)
    .maybeSingle()

  const { data: enroll } = await admin
    .from('enrollments')
    .select('student_first_name, student_last_name, graduation_date')
    .eq('id', enrollmentId)
    .single()

  if (!diploma) notFound()

  const name = normalizeName(diploma.student_name) ||
    fullName(enroll?.student_first_name, enroll?.student_last_name)

  const rawDate = diploma.graduation_date || enroll?.graduation_date
  const gradDate = rawDate
    ? new Date(rawDate + 'T00:00:00').toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : ''

  // The emblem, raised and enlarged. Only the file's transparent padding is wasted, so a bigger
  // box means a visibly bigger mark: the artwork occupies 83.4% of the file's height. TOP is
  // negative because the extra size goes UPWARD, away from the words below.
  const EMBLEM_BOX_PX = 126        // was 110
  // The row is 110px tall (the image's old height) plus a 4px margin — the exact block height it had
  // before, so nothing below moves. It is centred on the words' own centre (221.3 design px). The file's artwork sits 49.32% down its box, so with a 126px box its centre within the
  // row is top + 62.14. -11px puts that centre at 215.2 design px — 5.1 above the words, the same
  // figure the PDF uses.
  const EMBLEM_TOP_PX = '-11px'

  const bl = '"LCA Old English", "Old English Text MT", "Cloister Black", Georgia, serif'
  const sig = 'var(--font-signature), "Segoe Script", cursive'
  const serif = 'var(--font-garamond), Georgia, serif'
  const inkColor = '#1a1a1a'
  const gold = '#b8952f'

  return (
    <div
      className={`${garamond.variable} ${script.variable} lca-print-doc`}
      style={{ minHeight: '100vh', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0px' }}
    >
      <div
        id="cert"
        style={{
          width: '864px',          /* 9in at 96dpi */
          height: '672px',         /* 7in at 96dpi */
          background: '#f4efe2',
          color: inkColor,
          position: 'relative',
          borderRadius: '0px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'none',
        }}
      >
        {/* The sheet itself has NO gold — the gold in the reference photo is the leather holder's
            corner tabs, which Jonathan pointed out 2026-09-11: "The gold corners are supposed to
            be white not gold it's in a holder". The certificate is cream paper with a plain thin
            double rule inset from the trim, exactly as in the reference. */}
        <div style={{ position: 'absolute', inset: '20px', border: '0.7px solid #6b6250', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: '24px', border: '0.4px solid #8a8272', pointerEvents: 'none' }} />

        {/* The interior is designed for an 11x8.5 sheet and scaled to fit the 9x7 sheet by an
              exact factor (864/1056). Scaling the whole box keeps every proportion identical to the
              approved layout — no font size is re-tuned by hand, so nothing can drift or clip. */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '1056px', height: '816px', transform: 'scale(0.8181818)', transformOrigin: 'top left', boxSizing: 'border-box', padding: '4px 22px 30px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexShrink: 0 }}>

          {/* ── SCHOOL NAME, ARCHED ──
              The reference curves the name across the top; a straight line was the single most
              visible difference ("Doesn't look like it"). SVG textPath on an arc is how a real
              diploma sets it, and it scales cleanly at any print size. */}
          <svg viewBox="0 0 3200 550" width="100%" height="154" preserveAspectRatio="xMidYMid meet" role="img" aria-label={SCHOOL_CONFIG.name} style={{ flexShrink: 0 }}>
            <defs>
              <path id="arch" d="M 20 491 Q 1600 211 3180 491" fill="none" />
            </defs>
            <text
              fontFamily="'LCA Old English', 'Old English Text MT', 'Cloister Black', serif"
              fontWeight="400"
              fontSize="250"
              fill="#111"
              letterSpacing="0"
            >
              <textPath
                href="#arch"
                startOffset="50%"
                textAnchor="middle"
                
              >
                {SCHOOL_CONFIG.name}
              </textPath>
            </text>
          </svg>

          {/* ── CITY — SEAL — STATE. The seal is centred on this line, as in the reference. ──
              The row's height is PINNED at the old value and the words keep their exact spacing, so
              the emblem can be made larger and lifted without moving the words by a single pixel —
              the logo is positioned out of flow and a 110px spacer holds the gap the image used to.
              Jonathan, 2026-09-12: "the logo needs to come up a little bit and make it a little bit
              bigger to fill that area just a little bit more ... the words do not need to move at
              all anymore, they're perfect with that." */}
          <div style={{ position: 'relative', height: '110px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '42px', marginTop: '4px', flexShrink: 0 }}>
            <div style={{ fontFamily: bl, fontWeight: 400, fontSize: '34px', color: '#1a1a1a' }}>Mobile</div>
            <div style={{ width: '110px', flexShrink: 0 }} aria-hidden />
            {/* our own seal, not the Alabama state seal — see the note in the project reference.
                mixBlendMode: multiply drops the PNG's white background into the cream paper, so it
                reads as printed on the sheet instead of pasted on. Without it there is a visible
                white box — the loudest tell that a seal was dropped onto a template. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/lca-logo-transparent.png"
              alt={`${SCHOOL_CONFIG.name} seal`}
              style={{
                position: 'absolute', left: '50%', transform: 'translateX(-50%)',
                top: EMBLEM_TOP_PX, width: EMBLEM_BOX_PX, height: EMBLEM_BOX_PX,
                objectFit: 'contain',
              }}
            />
            <div style={{ fontFamily: bl, fontWeight: 400, fontSize: '34px', color: '#1a1a1a' }}>Alabama</div>
          </div>

          {/* ── THIS CERTIFIES THAT ── */}
          <div style={{ fontFamily: bl, fontWeight: 400, fontSize: '24px', textAlign: 'center', marginTop: '2px', color: '#111' }}>
            This Certifies That
          </div>

          {/* ── THE NAME ──
              Held in a FIXED-HEIGHT box. The font steps down for a longer name, and because this
              column distributes space with space-between, that size change used to shove every
              other element up or down. Jonathan, 2026-09-12: "they don't need to be changing up all
              the time... only the name and the date changes... consistency is key with this."
              With the box fixed, the name's centre never moves and nothing downstream can shift.
              60.55px = the tallest name (58px * 0.90) at line-height 1.16, so the current look is
              unchanged. */}
          <div style={{ height: '60.55px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '8px', flexShrink: 0 }}>
            <div
              style={{
                fontFamily: bl, fontWeight: 400,
                fontSize: `${nameFontSize(name) * 0.90}px`,
                textAlign: 'center',
                lineHeight: 1.16,
                letterSpacing: nameLetterSpacing(name),
                color: '#111',
                width: '100%',
              }}
            >
              {name}
            </div>
          </div>

          {/* ── THE STANDARDS PARAGRAPH ── */}
          <div
            style={{
              fontFamily: bl, fontWeight: 400,
              fontSize: '22px',
              textAlign: 'center',
              textWrap: 'balance' as const,
              lineHeight: 0.98,
              marginTop: '2px',
              maxWidth: '1010px',
              alignSelf: 'center',
              color: '#1a1a1a',
            }}
          >
            {STANDARDS_LINES.map((line, i) => (
              <span key={i} style={{ display: 'block' }}>{line}</span>
            ))}
          </div>

          {/* ── DIPLOMA ── */}
          <div style={{ fontFamily: bl, fontWeight: 400, fontSize: '40px', textAlign: 'center', marginTop: '2px', color: '#111' }}>
            High School Diploma
          </div>

          {/* ── IN TESTIMONY WHEREOF ── */}
          <div style={{ fontFamily: bl, fontWeight: 400, fontSize: '23px', textAlign: 'center', marginTop: '4px', color: '#1a1a1a' }}>
            In Testimony Whereof we have affixed our signatures.
          </div>

          {/* ── DATE OF AWARD ── */}
          <div style={{ textAlign: 'center', marginTop: '4px' }}>
            {/* The date sits immediately ABOVE its rule, as in Jonathan's 2014 reference — the line
                reads as the underline for the date, not as a header above it. */}
            <div style={{ fontFamily: bl, fontWeight: 400, fontSize: '30px', color: '#111' }}>{gradDate}</div>
            <div style={{ borderTop: '1.4px solid #2b2b2b', width: '380px', margin: '6px auto 0' }} />
          </div>

          {/* ── SIGNATURES: President (left) and Headmaster (right) ── */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '2px', paddingTop: '0px', gap: '28px' }}>
            <div style={{ textAlign: 'center', flex: 1 }}>
              {/* the signature: the signatory's own name in a signature script. The first version
                  drew an SVG squiggle — "the signatures look like a child scribbled them". */}
              <div style={{ fontFamily: sig, fontSize: '50px', lineHeight: '1.0', color: '#12163a', height: '52px', textAlign: 'center' }}>
                {SCHOOL_CONFIG.president}
              </div>
              <div style={{ borderTop: '1.4px solid #2b2b2b', width: '300px', margin: '0 auto' }} />
              <div style={{ fontFamily: bl, fontWeight: 400, fontSize: '25px', marginTop: '2px' }}>{SCHOOL_CONFIG.president}</div>
              <div style={{ fontFamily: bl, fontWeight: 400, fontSize: '17px', color: '#333' }}>President</div>
            </div>

            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontFamily: sig, fontSize: '31px', lineHeight: '1.05', color: '#12163a', height: '38px', textAlign: 'center' }}>
                {SCHOOL_CONFIG.headmaster}
              </div>
              <div style={{ borderTop: '1.4px solid #2b2b2b', width: '300px', margin: '0 auto' }} />
              <div style={{ fontFamily: bl, fontWeight: 400, fontSize: '25px', marginTop: '2px' }}>{SCHOOL_CONFIG.headmaster}</div>
              <div style={{ fontFamily: bl, fontWeight: 400, fontSize: '17px', color: '#333' }}>Headmaster</div>
            </div>
          </div>

          {/* diploma number — in the normal flow, not absolutely positioned, so it can never be
              clipped off the bottom by the sheet's overflow:hidden. It traces the certificate to
              the school's record without intruding on the design. */}
          <div style={{ fontFamily: serif, fontSize: '13px', color: '#6b6b6b', letterSpacing: '0.6px', textAlign: 'center', marginTop: '6px' }}>
            No. {diploma.diploma_number}
          </div>
        </div>
      </div>

      <div className="no-print" style={{ position: 'fixed', bottom: '24px', right: '24px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <Link
          href={`/print/diploma/${enrollmentId}/wallet`}
          style={{ background: '#475569', color: '#fff', padding: '12px 20px', borderRadius: '10px', fontFamily: 'system-ui, sans-serif', fontSize: '14px', fontWeight: 700, textDecoration: 'none' }}
        >
          💳 Wallet card
        </Link>
        <PrintButton />
      </div>
    </div>
  )
}
