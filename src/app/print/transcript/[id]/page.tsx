import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { getTransferGrades, groupByYear, computeGpa, formatGpa, letterToPoints } from '@/lib/transfer-grades'

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

  // 👨‍🎓 Previous school records (transferred grades) — per student
  const transferGrades = await getTransferGrades(id)
  const yearGroups = groupByYear(transferGrades)
  const gpa = computeGpa(transferGrades)
  const hasTransfer = transferGrades.length > 0

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
          .section-title { font-size: 13pt; font-weight: bold; margin: 20px 0 8px; border-bottom: 1px solid #999; padding-bottom: 4px; }
          .school-heading { font-weight: bold; margin: 14px 0 4px; font-size: 11.5pt; }
          .school-year { color: #444; font-size: 10pt; }
          table { width: 100%; border-collapse: collapse; margin: 8px 0 16px; }
          th { background: #e5e7eb; padding: 8px; text-align: left; font-size: 11pt; border: 1px solid #999; }
          td { padding: 6px 8px; border: 1px solid #999; font-size: 11pt; }
          .gpa-box { text-align: center; margin: 16px 0; }
          .gpa-box span { display: inline-block; border: 2px solid #000; padding: 8px 24px; font-size: 14pt; font-weight: bold; }
          .empty-note { font-style: italic; color: #555; margin: 10px 0 16px; font-size: 11pt; }
          .footer { margin-top: 40px; font-size: 9pt; text-align: center; color: #666; border-top: 1px solid #ccc; padding-top: 10px; }
          .seal { text-align: center; font-size: 36px; margin: 12px 0; }
          .signature-line { margin-top: 30px; display: flex; justify-content: space-between; }
          .signature-line div { border-top: 1px solid #000; padding-top: 4px; font-size: 10pt; width: 40%; text-align: center; }
          button { display: block; margin: 20px auto; padding: 10px 30px; font-size: 14px; background: #059669; color: white; border: none; border-radius: 8px; cursor: pointer; }
          @media print { button { display: none; } }
          @media screen { body { background: #f5f5f5; } .page { background: white; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 0.5in; max-width: 7.5in; margin: 0 auto; } }
          tr { break-inside: avoid; }
          .school-block { break-inside: avoid; }
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

          {hasTransfer ? (
            <>
              {/* 📚 Transfer Credits — grouped by academic year (newest first) */}
              <div class="section-title">Transfer Credits — Previous Schools</div>
              {yearGroups.map((group) => (
                <div key={group.year} class="school-block">
                  <div class="school-heading">
                    {group.year}{group.school && group.school !== 'Previous School' ? ` — ${group.school}` : ''}
                  </div>
                  <table>
                    <thead>
                      <tr>
                        <th>Subject</th>
                        <th>Grade Earned</th>
                        <th>Grade Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.rows.map((g, i) => {
                        const points = letterToPoints(g.grade_earned)
                        return (
                          <tr key={g.id || i}>
                            <td>{g.subject_name}</td>
                            <td>{g.grade_earned}</td>
                            <td>{points !== null ? points.toFixed(1) : '—'}</td>
                          </tr>
                        )
                      })}
                      {group.gpa !== null && (
                        <tr style={{ fontWeight: 'bold' }}>
                          <td>Year GPA</td>
                          <td></td>
                          <td>{formatGpa(group.gpa)}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              ))}

              {gpa !== null && (
                <div class="gpa-box">
                  <span>Cumulative GPA: {formatGpa(gpa)}</span>
                </div>
              )}
              <div style={{ fontSize: '9pt', color: '#555', textAlign: 'center', marginTop: '6px' }}>
                GPA Scale: A=4.0, B=3.0, C=2.0, D=1.0, F=0.0
              </div>
            </>
          ) : (
            <>
              {/* Current enrollment section (no transferred grades yet) */}
              <div class="section-title">Current Enrollment</div>
              <p class="empty-note">
                No previous school records have been added yet. Courses are currently in progress.
              </p>
            </>
          )}

          <div style={{ fontStyle: 'italic', fontSize: '10pt', marginTop: '12px' }}>
            This transcript is issued by Larose Christian Academy, an Alabama church school
            operating under Alabama Code §16-28-1. Students are homeschooled under the
            oversight of the academy. Previous school records are self-reported by the
            parent/guardian and verified by the academy upon request.
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
