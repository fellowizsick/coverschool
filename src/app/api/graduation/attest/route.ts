import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/server'
import { isAuthorizedAdmin } from '@/lib/adminAccess'
import { getGraduationRequirements, getCreditLedger, computeGraduation, makeDiplomaNumber } from '@/lib/graduation'
import nodemailer from 'nodemailer'
import { SCHOOL_CONFIG } from '@/lib/constants'

// POST /api/graduation/attest  { enrollment_id, graduation_date? , format? }
// Admin ATTESTATION. Only allowed when the student has MET the requirements (fail-closed:
// never graduate someone who hasn't completed the criteria). Creates the diploma, syncs
// the student record, and emails the family a congratulatory link to print.
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAuthorizedAdmin(user.email)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }

  const admin = createAdminClient()
  const body = await request.json().catch(() => ({}))
  const enrollmentId = String(body.enrollment_id || '')
  if (!enrollmentId) return NextResponse.json({ ok: false, error: 'Missing enrollment_id.' }, { status: 400 })

  const { data: enroll } = await admin.from('enrollments').select('*').eq('id', enrollmentId).single()
  if (!enroll) return NextResponse.json({ ok: false, error: 'Enrollment not found.' }, { status: 404 })

  const [reqs, ledger] = await Promise.all([getGraduationRequirements(), getCreditLedger(enrollmentId)])
  const computed = computeGraduation(reqs, ledger)
  if (!computed.met) {
    return NextResponse.json({ ok: false, error: `Student has not met graduation requirements (${computed.earned}/${computed.totalRequired} credits). Cannot graduate.` }, { status: 400 })
  }

  const gradDate = body.graduation_date || new Date().toISOString().slice(0, 10)
  const format = body.format === 'digital_plus_paper' ? 'digital_plus_paper' : 'digital'

  // Count existing diplomas for the year to build a unique number.
  const { count } = await admin.from('diplomas').select('id', { count: 'exact', head: true })
  const seq = (count || 0) + 1
  const diploma_number = makeDiplomaNumber(new Date(gradDate).getFullYear(), seq)
  const studentName = `${enroll.student_first_name} ${enroll.student_last_name}`.trim()

  // 1. Mark enrolled student graduated.
  await admin.from('enrollments').update({
    graduation_status: 'graduated',
    graduation_date: gradDate,
    graduated_at: new Date().toISOString(),
  }).eq('id', enrollmentId)

  // 2. Sync the students table (if a student row exists for this enrollment).
  await admin.from('students').update({ status: 'graduated' }).eq('enrollment_id', enrollmentId)

  // 3. Create the permanent diploma record.
  const { data: diploma, error: dipErr } = await admin.from('diplomas').insert({
    enrollment_id: enrollmentId,
    student_name: studentName,
    graduation_date: gradDate,
    diploma_number,
    attested_by: user.email,
    attested_at: new Date().toISOString(),
    format,
  }).select('*').single()
  if (dipErr) {
    return NextResponse.json({ ok: false, error: 'Diploma insert failed: ' + dipErr.message }, { status: 500 })
  }

  // 4. Email the family a congratulatory note + printable link.
  let emailSent = false
  const familyEmail = String(enroll.email || '').trim()
  if (familyEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(familyEmail)) {
    emailSent = await sendDiplomaEmail(familyEmail, studentName, gradDate, format)
    await admin.from('diplomas').update({ email_sent_at: new Date().toISOString() }).eq('id', diploma.id)
  }

  return NextResponse.json({ ok: true, diploma, emailSent })
}

// Reuse the SMTP setup pattern from signup-error.
async function sendDiplomaEmail(to: string, studentName: string, gradDate: string, format: string) {
  try {
    const smtpHost = process.env.SMTP_HOST
    const smtpPort = process.env.SMTP_PORT
    const smtpUser = process.env.SMTP_USER
    const smtpPass = process.env.SMTP_PASS
    const fromEmail = process.env.SMTP_FROM || SCHOOL_CONFIG.email
    if (!smtpHost || !smtpUser || !smtpPass) return false
    const transporter = nodemailer.createTransport({
      host: smtpHost, port: parseInt(smtpPort || '587', 10), secure: false,
      auth: { user: smtpUser, pass: smtpPass },
    })
    await transporter.sendMail({
      from: `"${SCHOOL_CONFIG.name}" <${fromEmail}>`,
      to,
      subject: `🎓 Graduation Diploma — ${studentName}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#fff;border-radius:12px;border:1px solid #e5e7eb">
          <h2 style="color:#065f46;margin:0 0 12px">Congratulations, ${studentName}! 🎓</h2>
          <p style="color:#374151;font-size:15px;line-height:1.6">
            ${SCHOOL_CONFIG.name} is proud to award you your graduation diploma.
          </p>
          <p style="color:#374151;font-size:15px;line-height:1.6">
            <strong>Graduation date:</strong> ${gradDate}<br/>
            <strong>Diploma format:</strong> ${format === 'digital_plus_paper' ? 'Digital + Paper' : 'Digital'}
          </p>
          <p style="color:#374151;font-size:15px;line-height:1.6">
            Click below to view and print your diploma.
          </p>
          <p style="margin:24px 0"><a href="https://laroseca.org/print/diploma/${diploma.enrollment_id}" style="background:#059669;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;display:inline-block">View &amp; Print Diploma</a></p>
          <p style="color:#6b7280;font-size:13px;margin-top:24px">— The ${SCHOOL_CONFIG.name} team</p>
        </div>`,
    })
    return true
  } catch (e) {
    console.error('diploma email failed:', e)
    return false
  }
}
