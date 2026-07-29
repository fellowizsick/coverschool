import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'


export default async function PrintReportCardPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = createClient()

  const [enrollment, progress] = await Promise.all([
    supabase.from('enrollments').select('*').eq('id', id).single(),
    Promise.resolve({ data: null, error: null }),
  ])

  if (!enrollment.data) notFound()
  const e = enrollment.data
  const grade = null
  const completedSteps = 0

  let totalSteps = 0
  if (grade) {
    grade.subjects.forEach((subj) => {
      subj.units.forEach((unit) => {
        unit.lessons.forEach((les) => {
          totalSteps++
          if (les.weekTest) totalSteps++
        })
        if (unit.unitTest) totalSteps++
      })
    })
  }
  const pct = 0

  // Generate grade letter based on progress
  const gradeLetter = pct >= 90 ? 'A' : pct >= 80 ? 'B' : pct >= 70 ? 'C' : pct >= 60 ? 'D' : 'In Progress'

  const subjectNames = grade ? grade.subjects.map(s => s.name) : []
  const subjectsCompleted = subjectNames.map((name, i) => {
    const subj = grade!.subjects[i]
    let subjCount = 0, subjTotal = 0
    subj.units.forEach(unit => {
      unit.lessons.forEach(les => {
        subjTotal++
        if (les.weekTest) subjTotal++
      })
      if (unit.unitTest) subjTotal++
    })
    // Approximate completion per subject
    subjCount = Math.round((completedSteps / totalSteps) * subjTotal)
    return { name, completed: Math.min(subjCount, subjTotal), total: subjTotal }
  })

  return (
    <html>
      <head>
        <style>{`
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
          .grade-box { font-size: 24pt; font-weight: bold; text-align: center; border: 2px solid #000; padding: 12px; width: 80px; margin: 0 auto; }
          .footer { margin-top: 30px; font-size: 9pt; text-align: center; color: #666; border-top: 1px solid #ccc; padding-top: 10px; }
          .signature-line { margin-top: 30px; display: flex; justify-content: space-between; }
          .signature-line div { border-top: 1px solid #000; padding-top: 4px; font-size: 10pt; width: 40%; text-align: center; }
          button { display: block; margin: 20px auto; padding: 10px 30px; font-size: 14px; background: #059669; color: white; border: none; border-radius: 8px; cursor: pointer; }
          @media print { button { display: none; } }
          @media screen { body { background: #f5f5f5; } .page { background: white; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 0.5in; max-width: 7.5in; margin: 0 auto; } }
        `}</style>
      </head>
      <body>
        <button onclick="window.print()">🖨️ Print Report Card</button>
        <div class="page">
          <div class="school-name">Larose Christian Academy</div>
          <div class="school-sub">✦ Alabama Church School • Mobile, AL ✦</div>

          <h1>📄 Student Report Card</h1>

          <div class="student-info">
            <div><span class="info-label">Student:</span> {e.student_first_name} {e.student_last_name}</div>
            <div><span class="info-label">Grade:</span> {e.student_grade}</div>
            <div><span class="info-label">School Year:</span> 2025–2026</div>
            <div><span class="info-label">Date:</span> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Subject</th>
                <th>Lessons Completed</th>
                <th>Total Lessons</th>
                <th>Progress</th>
              </tr>
            </thead>
            <tbody>
              {subjectsCompleted.map((s) => (
                <tr key={s.name}>
                  <td>{s.name}</td>
                  <td>{s.completed}</td>
                  <td>{s.total}</td>
                  <td>{s.total > 0 ? Math.round((s.completed / s.total) * 100) : 0}%</td>
                </tr>
              ))}
              <tr style={{ fontWeight: 'bold' }}>
                <td>Overall</td>
                <td>{completedSteps}</td>
                <td>{totalSteps}</td>
                <td>{pct}%</td>
              </tr>
            </tbody>
          </table>

          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <div style={{ fontSize: '10pt', marginBottom: '4px' }}>Overall Grade</div>
            <div class="grade-box">{gradeLetter}</div>
          </div>

          <div class="signature-line">
            <div>Administrator</div>
            <div>Date</div>
          </div>

          <div class="footer">
            Larose Christian Academy • Mobile, AL • larosechristianacademy@gmail.com • (251) 201-9991
          </div>
        </div>
      </body>
    </html>
  )
}
