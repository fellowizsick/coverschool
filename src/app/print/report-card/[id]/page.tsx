import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { getTransferGrades, groupBySchool, computeGpa, formatGpa } from '@/lib/transfer-grades'
import { getGradebook, summarizeGradebook, computeGradebookGpa, getAttendance, summarizeAttendance, getAttendanceTarget } from '@/lib/academic'

export default async function PrintReportCardPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: enrollment, error: enrollError } = await supabase
    .from('enrollments')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (enrollError || !enrollment) notFound()
  const e = enrollment

  // 👨‍🎓 Previous school records (transferred grades) — per student
  const transferGrades = await getTransferGrades(id)
  const schoolGroups = groupBySchool(transferGrades)
  const gpa = computeGpa(transferGrades)
  const hasTransfer = transferGrades.length > 0

  // 🏫 LCA coursework (gradebook) + attendance
  const gbRows = await getGradebook(id)
  const gbSummaries = summarizeGradebook(gbRows)
  const gbGpa = computeGradebookGpa(gbSummaries)
  const attRows = await getAttendance(id)
  const att = summarizeAttendance(attRows)
  const target = getAttendanceTarget(e.state || 'AL')

  return (
    <div className="lca-print-page">
        <style>{`

          /* Standalone print page: cover the site nav/footer while this page is mounted. */
          .lca-print-page { position: fixed; inset: 0; overflow: auto; z-index: 50; background: #f5f5f5; padding: 24px 16px 60px; }
          body > header, body > footer { display: none !important; }
          @media print { .lca-print-page { position: static; inset: auto; padding: 0; overflow: visible; background: #fff; } }
          @page { margin: 0.5in; size: letter; }
          body { font-family: 'Times New Roman', Georgia, serif; font-size: 12pt; color: #000; max-width: 7.5in; margin: 0 auto; padding: 0.5in; }
          .school-name { text-align: center; font-size: 20pt; font-weight: bold; }
          .school-sub { text-align: center; font-size: 10pt; color: #555; margin-bottom: 20px; }
          h1 { font-size: 16pt; text-align: center; border-bottom: 2px solid #000; padding-bottom: 6px; margin-bottom: 16px; }
          .student-info { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; margin-bottom: 16px; }
          .info-label { font-weight: bold; }
          table { width: 100%; border-collapse: collapse; margin: 12px 0; }
          th { background: #e5e7eb; padding: 6px 8px; text-align: left; font-size: 11pt; border: 1px solid #999; }
          td { padding: 5px 8px; border: 1px solid #999; font-size: 11pt; }
          .section-title { font-size: 13pt; font-weight: bold; margin: 18px 0 8px; border-bottom: 1px solid #999; padding-bottom: 4px; }
          .school-heading { font-weight: bold; margin: 12px 0 2px; font-size: 11pt; }
          .gpa-note { text-align: center; font-size: 11pt; margin-top: 8px; }
          .empty-note { font-style: italic; color: #555; margin: 8px 0; font-size: 11pt; }
          .attendance-line { margin: 8px 0; font-size: 11pt; }
          .footer { margin-top: 30px; font-size: 9pt; text-align: center; color: #666; border-top: 1px solid #ccc; padding-top: 10px; }
          .signature-line { margin-top: 30px; display: flex; justify-content: space-between; }
          .signature-line div { border-top: 1px solid #000; padding-top: 4px; font-size: 10pt; width: 40%; text-align: center; }
          button { display: block; margin: 20px auto; padding: 10px 30px; font-size: 14px; background: #059669; color: white; border: none; border-radius: 8px; cursor: pointer; }
          @media print { button { display: none; } }
          @media screen { body { background: #f5f5f5; } .page { background: white; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 0.5in; max-width: 7.5in; margin: 0 auto; } }
          tr, .school-block { break-inside: avoid; }
        `}</style>
        <button onclick="window.print()">🖨️ Print Report Card</button>
        <div className="page">
          <div className="school-name">Larose Christian Academy</div>
          <div className="school-sub">✦ Alabama Church School • Mobile, AL ✦</div>

          <h1>📄 Student Report Card</h1>

          <div className="student-info">
            <div><span className="info-label">Student:</span> {e.student_first_name} {e.student_last_name}</div>
            <div><span className="info-label">Grade:</span> {e.student_grade}</div>
            <div><span className="info-label">School Year:</span> {att.schoolYear}</div>
            <div><span className="info-label">Date:</span> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
          </div>

          {/* 🏫 Attendance — real logged days */}
          <div className="section-title">Attendance</div>
          <div className="attendance-line">
            <strong>{att.days}</strong> school day{att.days === 1 ? '' : 's'} logged · <strong>{att.hours}</strong> hours
            {target ? <span> · State target: {target.label}</span> : null}
          </div>

          {/* 🏫 LCA Gradebook — real coursework grades */}
          <div className="section-title">Current Coursework — Larose Christian Academy</div>
          {gbSummaries.length > 0 ? (
            <>
              <table>
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Assignments</th>
                    <th>Average</th>
                    <th>Letter</th>
                  </tr>
                </thead>
                <tbody>
                  {gbSummaries.map((s) => (
                    <tr key={s.subject}>
                      <td>{s.subject}</td>
                      <td>{s.entries.length}</td>
                      <td>{s.average !== null ? `${s.average}%` : '—'}</td>
                      <td>{s.letter}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {gbGpa !== null && (
                <div className="gpa-note">
                  LCA Coursework GPA: <strong>{formatGpa(gbGpa)}</strong>
                </div>
              )}
            </>
          ) : (
            <p className="empty-note">
              No coursework grades entered yet. Parents can add grades in the Student Records portal.
            </p>
          )}

          {hasTransfer ? (
            <>
              {/* 📚 Previous School Records — transferred from other schools */}
              <div className="section-title">Previous School Records</div>
              {schoolGroups.map((group) => (
                <div key={group.school} className="school-block">
                  <div className="school-heading">{group.school}</div>
                  <table>
                    <thead>
                      <tr>
                        <th>Subject</th>
                        <th>Grade Earned</th>
                        <th>School Year</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.rows.map((g, i) => (
                        <tr key={g.id || i}>
                          <td>{g.subject_name}</td>
                          <td>{g.grade_earned}</td>
                          <td>{g.year_completed || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}

              {gpa !== null && (
                <div className="gpa-note">
                  Cumulative GPA (all records): <strong>{formatGpa(gpa)}</strong>
                </div>
              )}
            </>
          ) : null}

          <div className="signature-line">
            <div>Administrator</div>
            <div>Date</div>
          </div>

          <div className="footer">
            Larose Christian Academy • Mobile, AL • larosechristianacademy@gmail.com • (251) 201-9991
          </div>
        </div>
    </div>
  )
}
