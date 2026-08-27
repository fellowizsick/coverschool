import { createAdminClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { SCHOOL_CONFIG } from '@/lib/constants'

export const dynamic = 'force-dynamic'

// Printable graduation diploma. Accessed by the family via the link in their
// congratulation email. Renders a real, attested diploma record.
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
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0f172a,#1e1b4b,#312e81)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'Georgia, serif' }}>
      <div id="cert" style={{ width: '100%', maxWidth: '900px', aspectRatio: '11/8.5', background: '#fdf9f0', color: '#1e293b', position: 'relative', borderRadius: '18px', overflow: 'hidden', padding: '40px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 24px 60px rgba(0,0,0,.5)' }}>
        {/* double border */}
        <div style={{ border: '3px solid #b45309', borderRadius: '10px', position: 'absolute', inset: '18px' }} />
        <div style={{ border: '1.5px solid #d97706', borderRadius: '8px', position: 'absolute', inset: '26px' }} />

        <div style={{ position: 'relative', textAlign: 'center', marginTop: '10px' }}>
          <div style={{ fontSize: '15px', letterSpacing: '3px', textTransform: 'uppercase', color: '#7c3aed', fontWeight: 700 }}>✦ {SCHOOL_CONFIG.name} ✦</div>
          <div style={{ fontSize: '34px', fontWeight: 900, margin: '10px 0 4px', background: 'linear-gradient(90deg,#4f46e5,#0ea5e9)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>Graduation Diploma</div>
          <div style={{ fontSize: '13px', color: '#64748b' }}>of Completion of the School Program</div>
        </div>

        <div style={{ position: 'relative', textAlign: 'center', margin: '6px 0' }}>
          <div style={{ fontSize: '15px', color: '#334155', marginBottom: '4px' }}>This certifies that</div>
          <div style={{ fontSize: '44px', fontWeight: 900, color: '#1e3a5f', borderBottom: '3px solid #c4b5fd', display: 'inline-block', padding: '0 40px 8px', margin: '0 0 12px' }}>{name}</div>
          <div style={{ fontSize: '16px', color: '#475569', lineHeight: 1.7 }}>
            having satisfactorily completed the required course of study,<br/>
            is hereby awarded this Diploma by {SCHOOL_CONFIG.name}.
          </div>
        </div>

        <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '0 12px', marginBottom: '8px' }}>
          <div style={{ textAlign: 'center', fontSize: '13px', color: '#334155' }}>
            <div style={{ borderTop: '1.5px solid #475569', paddingTop: '6px', minWidth: '170px' }}>Date: {gradDate}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '78px', height: '78px', borderRadius: '50%', border: '4px dashed #d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
              <span style={{ fontSize: '30px' }}>🎓</span>
            </div>
          </div>
          <div style={{ textAlign: 'center', fontSize: '13px', color: '#334155' }}>
            <div style={{ borderTop: '1.5px solid #475569', paddingTop: '6px', minWidth: '170px' }}>Anne Brown, Administrator</div>
          </div>
        </div>

        <div style={{ position: 'relative', textAlign: 'center', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Diploma #{diploma.diploma_number}</div>
      </div>

      <button onClick={() => window.print()} style={{ position: 'fixed', bottom: '24px', right: '24px', background: '#059669', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '10px', fontSize: '15px', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 8px 24px rgba(0,0,0,.3)' }}>
        🖨️ Print Diploma
      </button>
    </div>
  )
}
