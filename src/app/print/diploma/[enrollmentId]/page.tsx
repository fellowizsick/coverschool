import { createAdminClient, createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { isAuthorizedAdmin } from '@/lib/adminAccess'
import { SCHOOL_CONFIG } from '@/lib/constants'
import { Cinzel, EB_Garamond } from 'next/font/google'
import type { CSSProperties } from 'react'

export const dynamic = 'force-dynamic'

/**
 * Typography for a credential, not a web page.
 *
 * Cinzel  — Trajan-derived capitals. This is THE face of engraved certificates: monuments,
 *           diplomas, degree scrolls. Used for the school name and the award itself.
 * EB Garamond — a Garamond revival, the classic body face of printed diplomas and university
 *           charters for 500 years.
 *
 * The previous version was set in Georgia. Georgia is a SCREEN font, designed for low-res
 * monitors in 1993 — which is what made the letterforms read as web rather than engraved.
 * (Jonathan, 2026-09-11: "the letters Don't match up with the real diploma".)
 */
const cinzel = Cinzel({ subsets: ['latin'], weight: ['400', '600', '700'], variable: '--font-cinzel', display: 'swap' })
const garamond = EB_Garamond({ subsets: ['latin'], weight: ['400', '500', '600'], style: ['normal', 'italic'], variable: '--font-garamond', display: 'swap' })

/**
 * Printable diploma — issued on COMPLETION of the program.
 *
 * ⚠️ Do not add a path that issues one for payment alone. (Jonathan, 2026-09-11: "not actually
 * just selling the damn diploma they must test and school first".) Issuing happens only through
 * /api/graduation/attest, which checks the credit ledger first.
 */
export default async function DiplomaPrintPage({
  params,
}: {
  params: Promise<{ enrollmentId: string }>
}) {
  const { enrollmentId } = await params

  // ── ACCESS CONTROL ──────────────────────────────────────────────────────────
  // This page uses the service-role client, which bypasses RLS, so it MUST gate itself.
  // It did not. Any person holding the link could view and print a real diploma carrying a
  // real student's name and diploma number — and the link is emailed to families, so it
  // forward easily. A credential anyone can print is not a credential.
  // Jonathan, 2026-09-11: "People cant see that diploma can they?"
  //
  // Admin-only for now. A family-facing token link is the next step; until that exists,
  // families get their diploma from the school rather than by URL.
  const auth = await createClient()
  const { data: { user } } = await auth.auth.getUser()
  if (!user || !isAuthorizedAdmin(user.email)) notFound()

  const admin = createAdminClient()

  const { data: diploma } = await admin
    .from('diplomas')
    .select('*')
    .eq('enrollment_id', enrollmentId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (!diploma) notFound()

  const { data: enroll } = await admin
    .from('enrollments')
    .select('student_first_name, student_last_name, student_grade, graduation_date')
    .eq('id', enrollmentId)
    .single()

  const name =
    diploma.student_name ||
    `${enroll?.student_first_name || ''} ${enroll?.student_last_name || ''}`.trim()
  const rawDate = diploma.graduation_date || enroll?.graduation_date
  const gradDate = rawDate
    ? new Date(rawDate + 'T00:00:00').toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : ''

  // Both signatories from config — the names Jonathan authorized. `attested_by` on the diplomas
  // table stays the AUDIT record of which admin issued it; it is not the printed name.
  const sigLeft = SCHOOL_CONFIG.president
  const sigRight = SCHOOL_CONFIG.headmaster

  const roman = 'var(--font-cinzel), "Trajan Pro", Georgia, serif'
  const body = 'var(--font-garamond), Garamond, "Times New Roman", serif'
  const ink = '#1a2233'
  const gold = '#8a6d24'

  return (
    <div className={`${cinzel.variable} ${garamond.variable}`} style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0f172a,#1e1b4b,#312e81)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div id="cert" style={{ width: '100%', maxWidth: '1000px', aspectRatio: '11/8.5', background: '#fdfaf3', color: ink, position: 'relative', borderRadius: '14px', overflow: 'hidden', padding: '46px 74px 32px', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 60px rgba(0,0,0,.5)' }}>

        {/* the plate: engraved borders, thin rules outside thick — the reverse of a web card */}
        <div style={{ border: '1px solid #b99b4e', position: 'absolute', inset: '14px' }} />
        <div style={{ border: '4px double #9a7b2e', position: 'absolute', inset: '22px' }} />

        {/* ── header. The school is NAMED FIRST — a diploma announces its issuer. ── */}
        <div style={{ position: 'relative', textAlign: 'center', marginTop: '2px' }}>
          <div style={{ fontFamily: roman, fontSize: '30px', letterSpacing: '4px', textTransform: 'uppercase', color: ink, fontWeight: 600, lineHeight: 1.2 }}>
            {SCHOOL_CONFIG.name}
          </div>
          <div style={{ fontFamily: body, fontSize: '14px', letterSpacing: '7px', textTransform: 'uppercase', color: gold, marginTop: '11px', fontWeight: 500 }}>
            Mobile &middot; Alabama
          </div>
          <div style={{ width: '30%', height: '1px', background: '#c2a34e', margin: '15px auto 0' }} />
        </div>

        <div style={{ position: 'relative', textAlign: 'center', marginTop: '20px' }}>
          <div style={{ fontFamily: body, fontSize: '19px', letterSpacing: '6px', textTransform: 'uppercase', color: '#4a5568' }}>
            This Certifies That
          </div>
        </div>

        {/* ── the name. Garamond at size, not a script — scripts are where home-made
             certificates betray themselves. ── */}
        <div style={{ position: 'relative', textAlign: 'center', margin: '14px 0 0' }}>
          <div style={{ fontFamily: body, fontSize: '58px', fontWeight: 500, color: '#0f1c30', lineHeight: 1.14, letterSpacing: '0.5px' }}>
            {name}
          </div>
        </div>

        {/* ── the formal recital. 760px so the lines break EVENLY. ── */}
        <div style={{ position: 'relative', textAlign: 'center', fontFamily: body, fontSize: '19px', lineHeight: 1.85, color: '#333c4d', margin: '22px auto 0', maxWidth: '750px' }}>
          having satisfactorily completed the course of study in conformity with the
          standards and requirements set forth for High Schools in the State of Alabama,
          and having complied with all requirements of this Institution, is hereby awarded this
        </div>

        {/* ── the award, in engraved capitals ── */}
        <div style={{ position: 'relative', textAlign: 'center', margin: '26px 0 0' }}>
          <div style={{ fontFamily: roman, fontSize: '38px', fontWeight: 600, letterSpacing: '7px', textTransform: 'uppercase', color: gold, lineHeight: 1.2 }}>
            High School Diploma
          </div>
          <div style={{ fontFamily: body, fontSize: '17px', fontStyle: 'italic', color: '#5a6478', marginTop: '13px' }}>
            In Testimony Whereof we have affixed our signatures
          </div>
        </div>

        {/* ── seal, anchored low near the signatures ── */}
        <div style={{ position: 'relative', textAlign: 'center', marginTop: 'auto', paddingTop: '8px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/lca-logo.png" alt="" width={146} height={146} style={{ mixBlendMode: 'multiply', opacity: 0.96 }} />
        </div>

        {/* ── signatures. Real gaps between the rules. ── */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '0 20px', marginTop: '12px', paddingBottom: '4px', gap: '46px' }}>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ fontFamily: body, fontSize: '16px', color: ink, paddingBottom: '6px', minHeight: '27px' }}>{gradDate}</div>
            <div style={{ borderTop: '1px solid #5a6478', paddingTop: '6px', fontFamily: body, fontSize: '13px', letterSpacing: '3px', textTransform: 'uppercase', color: '#5a6478' }}>
              Date of Award
            </div>
          </div>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ fontFamily: body, fontSize: '16px', color: ink, paddingBottom: '6px', minHeight: '27px' }}>{sigLeft}</div>
            <div style={{ borderTop: '1px solid #5a6478', paddingTop: '6px', fontFamily: body, fontSize: '13px', letterSpacing: '3px', textTransform: 'uppercase', color: '#5a6478' }}>
              President
            </div>
          </div>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ fontFamily: body, fontSize: '16px', color: ink, paddingBottom: '6px', minHeight: '27px' }}>{sigRight}</div>
            <div style={{ borderTop: '1px solid #5a6478', paddingTop: '6px', fontFamily: body, fontSize: '13px', letterSpacing: '3px', textTransform: 'uppercase', color: '#5a6478' }}>
              Headmaster
            </div>
          </div>
        </div>

        <div style={{ position: 'relative', textAlign: 'center', fontFamily: body, fontSize: '11px', color: '#a8afbc', letterSpacing: '2px', marginTop: '5px' }}>
          Diploma No. {diploma.diploma_number}
        </div>
      </div>

      <button
        onClick={() => window.print()}
        style={{ position: 'fixed', bottom: '24px', right: '24px', background: '#059669', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '10px', fontSize: '15px', cursor: 'pointer', fontFamily: body, boxShadow: '0 8px 24px rgba(0,0,0,.3)' } as CSSProperties}
      >
        🖨️ Print Diploma
      </button>
    </div>
  )
}
