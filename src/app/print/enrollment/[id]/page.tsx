import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

export default async function PrintEnrollmentPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('*')
    .eq('id', id)
    .single()

  if (!enrollment) notFound()

  return (
    <div className="lca-print-page">
        <style>{`

          /* Standalone print page: cover the site nav/footer while this page is mounted. */
          .lca-print-page { position: fixed; inset: 0; overflow: auto; z-index: 50; background: #f5f5f5; padding: 24px 16px 60px; }
          body > header, body > footer { display: none !important; }
          @media print { .lca-print-page { position: static; inset: auto; padding: 0; overflow: visible; background: #fff; } }
          @page { margin: 0.75in; size: letter; }
          body { font-family: 'Times New Roman', Georgia, serif; font-size: 12pt; line-height: 1.5; color: #000; max-width: 7in; margin: 0 auto; padding: 0.5in; }
          h1 { font-size: 18pt; text-align: center; border-bottom: 2px solid #000; padding-bottom: 8px; margin-bottom: 20px; }
          h2 { font-size: 14pt; border-bottom: 1px solid #999; padding-bottom: 4px; margin-top: 20px; }
          .school-name { text-align: center; font-size: 22pt; font-weight: bold; margin-bottom: 4px; }
          .school-sub { text-align: center; font-size: 10pt; color: #555; margin-bottom: 20px; }
          .field { margin: 6px 0; }
          .label { font-weight: bold; display: inline-block; width: 180px; }
          .value { display: inline; }
          .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
          .section { margin-top: 16px; }
          .signature-line { margin-top: 40px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
          .signature-line div { border-top: 1px solid #000; padding-top: 4px; font-size: 10pt; }
          .footer { margin-top: 30px; font-size: 9pt; text-align: center; color: #666; border-top: 1px solid #ccc; padding-top: 10px; }
          @media screen { body { background: #f5f5f5; } .page { background: white; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 0.5in; } }
          button { display: block; margin: 20px auto; padding: 10px 30px; font-size: 14px; background: #059669; color: white; border: none; border-radius: 8px; cursor: pointer; }
          button:hover { background: #047857; }
          @media print { button { display: none; } .no-print { display: none; } }
        `}</style>
        <button className="no-print" onclick="window.print()">🖨️ Print This Form</button>
        <div className="page">
          <div className="school-name">Larose Christian Academy</div>
          <div className="school-sub">✦ Alabama Church School • Covering Homeschool Families Since 2024 ✦</div>

          <h1>Student Enrollment Form</h1>

          <div className="section">
            <h2>Parent / Guardian Information</h2>
            <div className="grid-2">
              <div className="field"><span className="label">First Name:</span> <span className="value">{enrollment.parent_first_name}</span></div>
              <div className="field"><span className="label">Last Name:</span> <span className="value">{enrollment.parent_last_name}</span></div>
            </div>
            <div className="field"><span className="label">Email:</span> <span className="value">{enrollment.email}</span></div>
            <div className="field"><span className="label">Phone:</span> <span className="value">{enrollment.phone}</span></div>
            <div className="field"><span className="label">Address:</span> <span className="value">{enrollment.address_line1}{enrollment.address_line2 ? `, ${enrollment.address_line2}` : ''}</span></div>
            <div className="grid-2">
              <div className="field"><span className="label">City:</span> <span className="value">{enrollment.city}</span></div>
              <div className="field"><span className="label">State/ZIP:</span> <span className="value">{enrollment.state} {enrollment.zip}</span></div>
            </div>
          </div>

          <div className="section">
            <h2>Student Information</h2>
            <div className="grid-2">
              <div className="field"><span className="label">First Name:</span> <span className="value">{enrollment.student_first_name}</span></div>
              <div className="field"><span className="label">Last Name:</span> <span className="value">{enrollment.student_last_name}</span></div>
            </div>
            <div className="grid-2">
              <div className="field"><span className="label">Grade Level:</span> <span className="value">{enrollment.student_grade}</span></div>
              <div className="field"><span className="label">Date of Birth:</span> <span className="value">{enrollment.student_dob}</span></div>
            </div>
            <div className="field"><span className="label">Previous School:</span> <span className="value">{enrollment.previous_school || 'N/A'}</span></div>
            {enrollment.notes && <div className="field"><span className="label">Notes:</span> <span className="value">{enrollment.notes}</span></div>}
          </div>

          <div className="section">
            <h2>Enrollment Status</h2>
            <div className="grid-2">
              <div className="field"><span className="label">Status:</span> <span className="value" style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>{enrollment.status}</span></div>
              <div className="field"><span className="label">Payment:</span> <span className="value" style={{ textTransform: 'capitalize' }}>{enrollment.payment_status}</span></div>
            </div>
            <div className="field"><span className="label">Enrolled Date:</span> <span className="value">{new Date(enrollment.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
          </div>

          <div className="signature-line">
            <div>Parent/Guardian Signature</div>
            <div>Date</div>
          </div>
          <div className="signature-line">
            <div>School Administrator Signature</div>
            <div>Date</div>
          </div>

          <div className="footer">
            Larose Christian Academy • Mobile, AL • larosechristianacademy@gmail.com • (251) 295-7688<br/>
            This is an official enrollment record. Keep for your records.
          </div>
        </div>
        {/* ⚠️ There used to be a second print button here with style="margin-top:10px;" — a
            STRING style prop. React requires an object, so it threw and the whole route returned
            HTTP 500 (while still streaming partial HTML, which made it look merely "blank").
            The one button at the top of this page is enough. */}
        <script dangerouslySetInnerHTML={{ __html: 'if (window.location.search.includes("print")) setTimeout(() => window.print(), 500);' }} />
    </div>
  )
}
