import { createAdminClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { SCHOOL_CONFIG } from '@/lib/constants'
import type { CSSProperties } from 'react'

export const dynamic = 'force-dynamic'

/**
 * Printable diploma.
 *
 * ⚠️ THIS IS A CREDENTIAL. It is only rendered for a student who has completed the school's
 * program. Do not add a path that issues one for payment alone. (Jonathan, 2026-09-11:
 * "not actually just selling the damn diploma they must test and school first".)
 *
 * STRUCTURE follows the template Jonathan designed and asked to be the basis for the school:
 *
 *     Mobile Alabama
 *     This Certifies That
 *     [student name]
 *     having satisfactorily completed the course of study in conformity with the standards and
 *     requirements set forth for High Schools in the State of Alabama and having complied with
 *     all requirements of this Institution is hereby awarded this
 *     High School Diploma
 *     In Testimony Whereof we have affixed our signatures.
 *     [date of award]        [president]      [headmaster]
 *
 * Set LARGE — a certificate, not a web page. Body 16px on a 1000px sheet reads as small print.
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

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0f172a,#1e1b4b,#312e81)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: serif }}>
      <div id="cert" style={{ width: '100%', maxWidth: '1000px', aspectRatio: '11/8.5', background: '#fdfaf3', color: ink, position: 'relative', borderRadius: '16px', overflow: 'hidden', padding: '52px 68px', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 60px rgba(0,0,0,.5)' }}>

        {/* double rule border */}
        <div style={{ border: '3px double #9a7b2e', borderRadius: '8px', position: 'absolute', inset: '16px' }} />
        <div style={{ border: '1px solid #c2a34e', borderRadius: '6px', position: 'absolute', inset: '24px' }} />

        {/* ── header: place, then the certifying line ── */}
        <div style={{ position: 'relative', textAlign: 'center', marginTop: '10px' }}>
          <div style={{ fontSize: '20px', letterSpacing: '8px', textTransform: 'uppercase', color: '#8a6d24', fontWeight: 600 }}>
            Mobile, Alabama
          </div>
          <div style={{ fontSize: '24px', letterSpacing: '2px', color: '#4a5568', marginTop: '16px' }}>
            This Certifies That
          </div>
        </div>

        {/* ── the name: the largest thing on the page ── */}
        <div style={{ position: 'relative', textAlign: 'center', margin: '18px 0 8px' }}>
          <div style={{ fontSize: '64px', fontWeight: 700, color: '#12263f', lineHeight: 1.15, letterSpacing: '1px' }}>
            {name}
          </div>
          <div style={{ width: '58%', height: '2px', background: 'linear-gradient(90deg,transparent,#c2a34e,transparent)', margin: '14px auto 0' }} />
        </div>

        {/* ── the formal paragraph ── */}
        <div style={{ position: 'relative', textAlign: 'center', fontSize: '21px', lineHeight: 1.85, color: '#2d3748', padding: '0 30px', margin: '14px 0 0' }}>
          having satisfactorily completed the course of study in conformity with the standards
          and requirements set forth for High Schools in the State of Alabama, and having
          complied with all requirements of this Institution, is hereby awarded this
        </div>

        {/* ── the award ── */}
        <div style={{ position: 'relative', textAlign: 'center', margin: '22px 0 0' }}>
          <div style={{ fontSize: '42px', fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase', color: '#8a6d24', fontFamily: serif }}>
            High School Diploma
          </div>
          <div style={{ fontSize: '19px', fontStyle: 'italic', color: '#5a6478', marginTop: '14px' }}>
            In Testimony Whereof we have affixed our signatures
          </div>
        </div>

        {/* ── the school seal. Real diplomas carry one, and it belongs in exactly this space —
             without it the middle reads as an awkward hole. mixBlendMode:multiply drops the
             logo's white background into the cream paper instead of showing a white box. ── */}
        <div style={{ position: 'relative', textAlign: 'center', marginTop: '6px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/lca-logo.png"
            alt=""
            width={205}
            height={205}
            style={{ mixBlendMode: 'multiply', opacity: 0.95 }}
          />
        </div>

        {/* ── signatures ──
             Each block needs real horizontal separation. Set flush, the three borderTop rules
             form one continuous line across the sheet, which is what makes a certificate look
             printed-at-home rather than issued. The gap is the fix. ── */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '0 26px', marginTop: 'auto', paddingBottom: '18px', gap: '52px' }}>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ fontSize: '18px', color: ink, paddingBottom: '7px', minHeight: '30px' }}>{gradDate}</div>
            <div style={{ borderTop: '1px solid #4a5568', paddingTop: '7px', fontSize: '16px', color: '#4a5568', letterSpacing: '1px' }}>
              Date of Award
            </div>
          </div>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ fontSize: '18px', color: ink, paddingBottom: '7px', minHeight: '30px' }}>{sigLeft}</div>
            <div style={{ borderTop: '1px solid #4a5568', paddingTop: '7px', fontSize: '16px', color: '#4a5568', letterSpacing: '1px' }}>
              President
            </div>
          </div>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ fontSize: '18px', color: ink, paddingBottom: '7px', minHeight: '30px' }}>{sigRight}</div>
            <div style={{ borderTop: '1px solid #4a5568', paddingTop: '7px', fontSize: '16px', color: '#4a5568', letterSpacing: '1px' }}>
              Headmaster
            </div>
          </div>
        </div>

        <div style={{ position: 'relative', textAlign: 'center', fontSize: '12px', color: '#9aa2b1', letterSpacing: '1.5px' }}>
          {SCHOOL_CONFIG.name} · Diploma {diploma.diploma_number}
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
