import { createAdminClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { SCHOOL_CONFIG } from '@/lib/constants'
import type { CSSProperties } from 'react'

export const dynamic = 'force-dynamic'

/**
 * Printable graduation diploma.
 *
 * TYPOGRAPHY PASS (2026-09-11). Jonathan sent a photo of his OWN 2014 high-school diploma as
 * the reference and said: "I also want to make this better if we can like the words bigger
 * more like a real diploma".
 *
 * The old version was laid out like a web page: 13-16px body text on a 900px-wide certificate,
 * which reads as small print rather than a certificate. Real diplomas are set LARGE, with the
 * recipient's name dominating and generous spacing everywhere. Every size below has been
 * scaled up roughly 40-60%, and the letter-spacing on the formal lines widened to match.
 *
 * The layout, colours and wording are deliberately unchanged — only the scale.
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

  const name = diploma.student_name || `${enroll?.student_first_name || ''} ${enroll?.student_last_name || ''}`.trim()
  const gradDate = new Date((diploma.graduation_date || enroll?.graduation_date || Date.now()) + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0f172a,#1e1b4b,#312e81)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'Georgia, "Times New Roman", serif' }}>
      <div id="cert" style={{ width: '100%', maxWidth: '1000px', aspectRatio: '11/8.5', background: '#fdf9f0', color: '#1e293b', position: 'relative', borderRadius: '18px', overflow: 'hidden', padding: '44px 62px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 24px 60px rgba(0,0,0,.5)' }}>
        {/* double border */}
        <div style={{ border: '3px solid #b45309', borderRadius: '10px', position: 'absolute', inset: '18px' }} />
        <div style={{ border: '1.5px solid #d97706', borderRadius: '8px', position: 'absolute', inset: '26px' }} />

        <div style={{ position: 'relative', textAlign: 'center', marginTop: '6px' }}>
          <div style={{ fontSize: '21px', letterSpacing: '5px', textTransform: 'uppercase', color: '#7c3aed', fontWeight: 700 }}>✦ {SCHOOL_CONFIG.name} ✦</div>
          <div style={{ fontSize: '46px', fontWeight: 900, margin: '12px 0 6px', letterSpacing: '1px', background: 'linear-gradient(90deg,#4f46e5,#0ea5e9)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>Graduation Diploma</div>
          <div style={{ fontSize: '18px', color: '#64748b', letterSpacing: '1px' }}>of Completion of the School Program</div>
        </div>

        <div style={{ position: 'relative', textAlign: 'center', margin: '4px 0' }}>
          <div style={{ fontSize: '22px', color: '#334155', marginBottom: '10px', letterSpacing: '2px' }}>This certifies that</div>
          <div style={{ fontSize: '62px', fontWeight: 900, color: '#1e3a5f', borderBottom: '3px solid #c4b5fd', display: 'inline-block', padding: '0 48px 10px', margin: '0 0 18px', lineHeight: 1.1 }}>{name}</div>
          <div style={{ fontSize: '22px', color: '#475569', lineHeight: 1.75 }}>
            having satisfactorily completed the required course of study,<br/>
            is hereby awarded this Diploma by {SCHOOL_CONFIG.name}.
          </div>
        </div>

        <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '0 18px', marginBottom: '4px' }}>
          <div style={{ textAlign: 'center', fontSize: '18px', color: '#334155' }}>
            <div style={{ borderTop: '1.5px solid #475569', paddingTop: '8px', minWidth: '210px' }}>Date: {gradDate}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '92px', height: '92px', borderRadius: '50%', border: '4px dashed #d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
              <span style={{ fontSize: '36px' }}>🎓</span>
            </div>
          </div>
          <div style={{ textAlign: 'center', fontSize: '18px', color: '#334155' }}>
            <div style={{ borderTop: '1.5px solid #475569', paddingTop: '8px', minWidth: '210px' }}>Anne Brown, Administrator</div>
          </div>
        </div>

        <div style={{ position: 'relative', textAlign: 'center', fontSize: '13px', color: '#94a3b8', letterSpacing: '1px' }}>Diploma #{diploma.diploma_number}</div>
      </div>

      <button onClick={() => window.print()} style={{ position: 'fixed', bottom: '24px', right: '24px', background: '#059669', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '10px', fontSize: '15px', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 8px 24px rgba(0,0,0,.3)' } as CSSProperties}>
        🖨️ Print Diploma
      </button>
    </div>
  )
}
