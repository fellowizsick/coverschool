import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

export default async function PrintTranscriptPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = createClient()

  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('*')
    .eq('id', id)
    .single()

  if (!enrollment) notFound()

  return (
    <html>
      <head>
        <style>{`
          @page { margin: 0.5in; size: letter; }
          body { font-family: 'Times New Roman', Georgia, serif; font-size: 12pt; color: #000; max-width: 7.5in; margin: 0 auto; padding: 0.5in; }
          .school-name { text-align: center; font-size: 20pt; font-weight: bold; letter-spacing: 1px; }
          .school-sub { text-align: center; font-size: 10pt; color: #555; margin-bottom: 4px; }
          .school-address { text-align: center; font-size: 10pt; color: #555; margin-bottom: 20px; }
          h1 { font-size: 16pt; text-align: center; border-bottom: 2px solid #000; padding-bottom: 6px; margin-bottom: 16px; letter-spacing: 2px; }
          .student-info { margin-bottom: 20px; }
          .info-row { display: grid; grid-template-columns: 1fr 2fr; margin: 3px 0; }
          .info-label { font-weight: bold; }
          table { width: 100%; border-collapse: collapse; margin: 16px 0; }
          th { background: #e5e7eb; padding: 8px; text-align: left; font-size: 11pt; border: 1px solid #999; }
          td { padding: 6px 8px; border: 1px solid #999; font-size: 11pt; }
          .gpa-box { text-align: center; margin: 16px 0; }
          .gpa-box span { display: inline-block; border: 2px solid #000; padding: 8px 24px; font-size: 14pt; font-weight: bold; }
          .footer { margin-top: 40px; font-size: 9pt; text-align: center; color: #666; border-top: 1px solid #ccc; padding-top: 10px; }
          .seal { text-align: center; font-size: 36px; margin: 12px 0; }
          .signature-line { margin-top: 30px; display: flex; justify-content: space-between; }
          .signature-line div { border-top: 1px solid #000; padding-top: 4px; font-size: 10pt; width: 40%; text-align: center; }
          button { display: block; margin: 20px auto; padding: 10px 30px; font-size: 14px; background: #059669; color: white; border: none; border-radius: 8px; cursor: pointer; }
          @media print { button { display: none; } }
          @media screen { body { background: #f5f5f5; } .page { background: white; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 0.5in; max-width: 7.5in; margin: 0 auto; } }
        `}</style>
      </head>
      <body>
        <button onclick="window.print()">🖨️ Print Transcript</button>
        <div class="page">
          <div class="school-name">Larose Christian Academy</div>
          <div class="school-sub">✦ An Alabama Church School ✦</div>
          <div class="school-address">Mobile, Alabama | larosechristianacademy@gmail.com | (251) 201-9991</div>

          <div class="seal">🎓</div>
          <h1>OFFICIAL STUDENT TRANSCRIPT</h1>

          <div class="student-info">
            <div class="info-row"><span class="info-label">Student Name:</span> <span>{enrollment.student_first_name} {enrollment.student_last_name}</span></div>
            <div class="info-row"><span class="info-label">Grade Level:</span> <span>{enrollment.student_grade}</span></div>
            <div class="info-row"><span class="info-label">Date of Birth:</span> <span>{enrollment.student_dob || '—'}</span></div>
            <div class="info-row"><span class="info-label">Enrollment Date:</span> <span>{new Date(enrollment.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
            <div class="info-row"><span class="info-label">Student ID:</span> <span>{enrollment.id.substring(0, 8).toUpperCase()}</span></div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Subject</th>
                <th>Status</th>
                <th>Credits</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Mathematics</td><td>In Progress</td><td>1.0</td></tr>
              <tr><td>Language Arts</td><td>In Progress</td><td>1.0</td></tr>
              <tr><td>Spelling & Word Origins</td><td>In Progress</td><td>0.5</td></tr>
              <tr><td>Science</td><td>In Progress</td><td>1.0</td></tr>
              <tr><td>History & Geography</td><td>In Progress</td><td>1.0</td></tr>
              <tr><td>Bible & Character</td><td>In Progress</td><td>0.5</td></tr>
              <tr style={{ fontWeight: 'bold' }}>
                <td>Total</td>
                <td></td>
                <td>5.0 Credits</td>
              </tr>
            </tbody>
          </table>

          <div style={{ fontStyle: 'italic', fontSize: '10pt', marginTop: '12px' }}>
            This transcript is issued by Larose Christian Academy, an Alabama church school
            operating under Alabama Code §16-28-1. Students are homeschooled under the
            oversight of the academy.
          </div>

          <div class="signature-line">
            <div>Administrator</div>
            <div>Date</div>
          </div>

          <div class="footer">
            Larose Christian Academy • Mobile, AL • larosechristianacademy@gmail.com • (251) 201-9991<br/>
            This is an official document. Issued upon request.
          </div>
        </div>
      </body>
    </html>
  )
}
