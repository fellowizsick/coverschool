import { createAdminClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { SCHOOL_CONFIG } from '@/lib/constants'
import type { CSSProperties } from 'react'

export const dynamic = 'force-dynamic'

/**
 * Printable diploma — the credential issued on COMPLETION of the program.
 *
 * ⚠️ Do not add a path that issues one for payment alone. (Jonathan, 2026-09-11: "not actually
 * just selling the damn diploma they must test and school first".) Issuing happens only through
 * /api/graduation/attest, which checks the credit ledger first.
 *
 * STRUCTURE follows the template Jonathan designed and asked to be the basis for the school:
 *
 *     Mobile Alabama
 *     This Certifies That
 *     [student name]
 *     having satisfactorily completed the course of study in conformity with the standards and
 *     requirements set forth for High Schools in the State of Alabama ...
 *     High School Diploma
 *     In Testimony Whereof we have affixed our signatures.
 *     [date of award]        [president]      [headmaster]
 *
 * AUTHENTICITY PASS (2026-09-11). Three things were making it read as homemade:
 *   1. The school name appeared only as 12px grey footer text. A real diploma ANNOUNCES the
 *      school at the top; without it the page could belong to anyone.
 *   2. The body paragraph was centered and left to wrap wherever it landed, so the last line
 *      was a stub. Real diplomas balance those lines.
 *   3. The seal floated in a dead band. It now sits low, anchored near the signatures.
 */
export default async function DiplomaPrintPage({
  params,
}: {
  params: Promise<{ enrollmentId: string }>
}) {
  const { enrollmentId } = await params
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

  // Both signatories come from config — the two names Jonathan authorized. `attested_by` on the
  // diplomas table remains the AUDIT record of which admin issued it; it is not the printed name.
  const sigLeft = SCHOOL_CONFIG.president
  const sigRight = SCHOOL_CONFIG.headmaster

  const serif = 'Georgia, "Times New Roman", serif'
  const ink = '#1c2437'
  const gold = '#8a6d24'

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0f172a,#1e1b4b,#312e81)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: serif }}>
      <div id="cert" style={{ width: '100%', maxWidth: '1000px', aspectRatio: '11/8.5', background: '#fdfaf3', color: ink, position: 'relative', borderRadius: '16px', overflow: 'hidden', padding: '44px 72px 34px', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 60px rgba(0,0,0,.5)' }}>

        {/* double rule border */}
        <div style={{ border: '3px double #9a7b2e', borderRadius: '8px', position: 'absolute', inset: '16px' }} />
        <div style={{ border: '1px solid #c2a34e', borderRadius: '6px', position: 'absolute', inset: '24px' }} />

        {/* ── header: THE SCHOOL NAMED FIRST, then the place ── */}
        <div style={{ position: 'relative', textAlign: 'center', marginTop: '4px' }}>
          <div style={{ fontSize: '27px', letterSpacing: '3px', textTransform: 'uppercase', color: ink, fontWeight: 700 }}>
            {SCHOOL_CONFIG.name}
          </div>
          <div style={{ fontSize: '15px', letterSpacing: '6px', textTransform: 'uppercase', color: gold, marginTop: '9px', fontWeight: 600 }}>
            Mobile, Alabama
          </div>
          <div style={{ width: '34%', height: '2px', background: 'linear-gradient(90deg,transparent,#c2a34e,transparent)', margin: '14px auto 0' }} />
        </div>

        <div style={{ position: 'relative', textAlign: 'center', marginTop: '18px' }}>
          <div style={{ fontSize: '21px', letterSpacing: '3px', color: '#4a5568' }}>This Certifies That</div>
        </div>

        {/* ── the name: the largest thing on the page ── */}
        <div style={{ position: 'relative', textAlign: 'center', margin: '12px 0 0' }}>
          <div style={{ fontSize: '60px', fontWeight: 700, color: '#12263f', lineHeight: 1.15, letterSpacing: '1px' }}>
            {name}
          </div>
        </div>

        {/* ── the formal paragraph. maxWidth so the lines break EVENLY instead of leaving a
             one-word stub on the last line, which is what a browser's default wrap produces. ── */}
        <div style={{ position: 'relative', textAlign: 'center', fontSize: '20px', lineHeight: 1.8, color: '#2d3748', margin: '20px auto 0', maxWidth: '760px' }}>
          having satisfactorily completed the course of study in conformity with the
          standards and requirements set forth for High Schools in the State of Alabama,
          and having complied with all requirements of this Institution, is hereby awarded this
        </div>

        {/* ── the award ── */}
        <div style={{ position: 'relative', textAlign: 'center', margin: '24px 0 0' }}>
          <div style={{ fontSize: '40px', fontWeight: 700, letterSpacing: '5px', textTransform: 'uppercase', color: gold }}>
            High School Diploma
          </div>
          <div style={{ fontSize: '18px', fontStyle: 'italic', color: '#5a6478', marginTop: '12px' }}>
            In Testimony Whereof we have affixed our signatures
          </div>
        </div>

        {/* ── seal, anchored low near the signatures rather than floating mid-page. The white
             background of the PNG is dropped into the cream paper by multiply. ── */}
        <div style={{ position: 'relative', textAlign: 'center', marginTop: 'auto', paddingTop: '10px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/lca-logo.png" alt="" width={150} height={150} style={{ mixBlendMode: 'multiply', opacity: 0.96 }} />
        </div>

        {/* ── signatures. Real horizontal gaps — set flush, the three rules read as one line. ── */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '0 22px', marginTop: '14px', paddingBottom: '6px', gap: '48px' }}>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ fontSize: '17px', color: ink, paddingBottom: '6px', minHeight: '28px' }}>{gradDate}</div>
            <div style={{ borderTop: '1px solid #4a5568', paddingTop: '6px', fontSize: '15px', color: '#4a5568', letterSpacing: '1px' }}>
              Date of Award
            </div>
          </div>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ fontSize: '17px', color: ink, paddingBottom: '6px', minHeight: '28px' }}>{sigLeft}</div>
            <div style={{ borderTop: '1px solid #4a5568', paddingTop: '6px', fontSize: '15px', color: '#4a5568', letterSpacing: '1px' }}>
              President
            </div>
          </div>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ fontSize: '17px', color: ink, paddingBottom: '6px', minHeight: '28px' }}>{sigRight}</div>
            <div style={{ borderTop: '1px solid #4a5568', paddingTop: '6px', fontSize: '15px', color: '#4a5568', letterSpacing: '1px' }}>
              Headmaster
            </div>
          </div>
        </div>

        <div style={{ position: 'relative', textAlign: 'center', fontSize: '11px', color: '#a8afbc', letterSpacing: '1.5px', marginTop: '4px' }}>
          Diploma No. {diploma.diploma_number}
        </div>
      </div>

      <button
        onClick={() => window.print()}
        style={{ position: 'fixed', bottom: '24px', right: '24px', background: '#059669', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '10px', fontSize: '15px', cursor: 'pointer', fontFamily: serif, boxShadow: '0 8px 24px rgba(0,0,0,.3)' } as CSSProperties}
      >
        🖨️ Print Diploma
      </button>
    </div>
  )
}
