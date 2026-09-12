import { createAdminClient, createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { isAuthorizedAdmin } from '@/lib/adminAccess'
import { SCHOOL_CONFIG } from '@/lib/constants'
import { UnifrakturCook, EB_Garamond } from 'next/font/google'
import PrintButton from '@/components/PrintButton'
import Link from 'next/link'
import { normalizeName, fullName, nameFontSize } from '@/lib/diploma-name'

export const dynamic = 'force-dynamic'

/**
 * WALLET-SIZE DIPLOMA — 3.5 x 2 inches, the ISO/IEC 7810 ID-1 size.
 *
 * Jonathan, 2026-09-11: "another one they can print to go into there wallet"
 *
 * A graduate carries the full certificate folded in a drawer; this is the one that lives in a
 * wallet. Same guardrails as the full diploma: admin-only (the page uses the service-role client,
 * which bypasses RLS, so it must never be readable by the public), the name is normalised, and it
 * prints to the exact card size via the named `wallet` page box.
 */

// Same rounded blackletter as the full diploma, so the two credentials match.
const cook = UnifrakturCook({ subsets: ['latin'], weight: '700', variable: '--font-blackletter', display: 'swap' })
const garamond = EB_Garamond({ subsets: ['latin'], weight: ['400', '500', '600'], style: ['normal', 'italic'], variable: '--font-garamond', display: 'swap' })

export default async function WalletDiplomaPage({ params }: { params: Promise<{ enrollmentId: string }> }) {
  const { enrollmentId } = await params

  const auth = await createClient()
  const { data: { user } } = await auth.auth.getUser()
  if (!user || !isAuthorizedAdmin(user.email)) notFound()

  const admin = createAdminClient()
  const { data: diploma } = await admin.from('diplomas').select('*').eq('enrollment_id', enrollmentId).maybeSingle()
  if (!diploma) notFound()

  const { data: enroll } = await admin.from('enrollments').select('student_first_name, student_last_name, graduation_date').eq('id', enrollmentId).single()

  const name = normalizeName(diploma.student_name) || fullName(enroll?.student_first_name, enroll?.student_last_name)
  const rawDate = diploma.graduation_date || enroll?.graduation_date
  const gradDate = rawDate
    ? new Date(rawDate + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : ''

  const roman = 'var(--font-blackletter), Georgia, serif'
  const body = 'var(--font-garamond), Georgia, serif'

  return (
    <div className={`${cook.variable} ${garamond.variable} lca-wallet-doc`} style={{ minHeight: '100vh', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div
        id="walletcard"
        style={{
          width: '3.5in',
          height: '2in',
          background: '#fdfaf3',
          color: '#0f1c30',
          borderRadius: '10px',
          overflow: 'hidden',
          position: 'relative',
          padding: '9px 11px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 10px 26px rgba(0,0,0,.18)',
          border: '1.5px solid #c2a34e',
        }}
      >
        {/* engraved inner rule */}
        <div style={{ position: 'absolute', inset: '3px', border: '0.6px solid #d8c489', borderRadius: '7px', pointerEvents: 'none' }} />

        {/* school name across the top */}
        <div style={{ fontFamily: roman, fontSize: '7.2px', letterSpacing: '1.5px', color: '#8a6d24', textTransform: 'uppercase', textAlign: 'center', fontWeight: 600 }}>
          {SCHOOL_CONFIG.name}
        </div>

        {/* name — the largest element, auto-sized so a long name still fits the card */}
        <div style={{ fontFamily: body, fontSize: `${Math.min(20, nameFontSize(name) * 0.42)}px`, fontWeight: 500, textAlign: 'center', marginTop: '7px', lineHeight: 1.1, letterSpacing: '0.2px' }}>
          {name}
        </div>

        <div style={{ fontFamily: roman, fontSize: '6.4px', letterSpacing: '1.1px', textAlign: 'center', marginTop: '4px', color: '#334155', textTransform: 'uppercase' }}>
          High School Diploma
        </div>

        {/* seal + facts */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: 'auto' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/lca-logo.png" alt="" width={30} height={30} style={{ objectFit: 'contain' }} />
          <div style={{ fontFamily: body, fontSize: '6.6px', color: '#475569', lineHeight: 1.45 }}>
            <div>{gradDate}</div>
            <div>No. {diploma.diploma_number}</div>
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'right', fontFamily: body, fontSize: '6.2px', color: '#475569', lineHeight: 1.35 }}>
            <div style={{ borderTop: '0.7px solid #94a3b8', paddingTop: '2px', minWidth: '74px' }}>{SCHOOL_CONFIG.president}</div>
            <div style={{ color: '#8a6d24' }}>President</div>
          </div>
        </div>
      </div>

      {/* on-screen only controls */}
      <div className="no-print" style={{ position: 'fixed', bottom: '22px', right: '22px', display: 'flex', gap: '10px' }}>
        <Link href={`/print/diploma/${enrollmentId}`} style={{ background: '#475569', color: '#fff', padding: '11px 18px', borderRadius: '10px', fontFamily: 'system-ui, sans-serif', fontSize: '14px', fontWeight: 700, textDecoration: 'none' }}>
          Full size
        </Link>
        <PrintButton label="🖨️ Print wallet card" fontFamily="system-ui, sans-serif" />
      </div>
    </div>
  )
}
