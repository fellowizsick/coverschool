import nodemailer from 'nodemailer'
import { SCHOOL_CONFIG, CURRICULUM_BOOKS_URL } from './constants'

type SendEnrollmentEmailParams = {
  to: string
  parentName: string
  studentName: string
  grade: string
}

export async function sendEnrollmentEmail({
  to,
  parentName,
  studentName,
  grade,
}: SendEnrollmentEmailParams) {
  const smtpHost = process.env.SMTP_HOST
  const smtpPort = process.env.SMTP_PORT
  const smtpUser = process.env.SMTP_USER
  const smtpPass = process.env.SMTP_PASS
  const fromEmail = process.env.SMTP_FROM || SCHOOL_CONFIG.email

  const subject = `Welcome to ${SCHOOL_CONFIG.name} — Next Steps for ${studentName}`

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #065f46, #047857); padding: 32px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: #fff; margin: 0; font-size: 24px;">Welcome to ${SCHOOL_CONFIG.name}!</h1>
        <p style="color: #a7f3d0; margin: 8px 0 0; font-size: 16px;">Alabama Church School</p>
      </div>

      <div style="background: #fff; padding: 32px; border: 1px solid #e5e7eb;">
        <p style="color: #374151; font-size: 16px;">Dear ${parentName},</p>
        <p style="color: #374151; font-size: 16px;">
          Thank you for enrolling <strong>${studentName}</strong> (Grade: ${grade}) at
          ${SCHOOL_CONFIG.name}. Your enrollment is confirmed and your $45/month tuition
          has been processed successfully.
        </p>

        <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h2 style="color: #92400e; font-size: 18px; margin: 0 0 12px;">📚 Purchase Your Curriculum Books</h2>
          <p style="color: #78350f; font-size: 14px; margin: 0;">
            Your tuition covers administrative services, record-keeping, and legal oversight.
            <strong>Curriculum books are not included</strong> and must be purchased separately.
          </p>
          <p style="color: #78350f; font-size: 14px;">
            We recommend ACE PACE curriculum sets from Christianbook.com.
            Click the button below to find the correct grade-level set for ${studentName}.
          </p>
          <a href="${CURRICULUM_BOOKS_URL}" 
             style="display: inline-block; background: #d97706; color: #fff; text-decoration: none; 
                    padding: 12px 24px; border-radius: 8px; font-weight: bold; font-size: 14px; margin-top: 12px;">
            Shop Curriculum Books →
          </a>
        </div>

        <h3 style="color: #065f46; font-size: 16px;">Next Steps</h3>
        <ol style="color: #374151; font-size: 14px; line-height: 1.8;">
          <li>Purchase your curriculum books from Christianbook.com using the link above</li>
          <li>Log into your parent portal to track attendance and view records</li>
          <li>Start homeschooling with confidence — we handle the paperwork!</li>
        </ol>

        <p style="color: #6b7280; font-size: 13px; margin-top: 24px; border-top: 1px solid #e5e7eb; padding-top: 16px;">
          Have questions? Reply to this email or contact us at
          <a href="mailto:${SCHOOL_CONFIG.email}" style="color: #059669;">${SCHOOL_CONFIG.email}</a>
        </p>
      </div>

      <div style="background: #f9fafb; padding: 16px 32px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb; border-top: none;">
        <p style="color: #9ca3af; font-size: 11px; margin: 0; text-align: center;">
          ${SCHOOL_CONFIG.name} · ${SCHOOL_CONFIG.address} · ${SCHOOL_CONFIG.phone}<br/>
          Operating as a church school under Alabama law.
        </p>
      </div>
    </div>
  `

  // If SMTP is not configured, log the email instead of failing
  if (!smtpHost || !smtpUser || !smtpPass) {
    console.log('📧 SMTP not configured. Would have sent email to:', to)
    console.log('📧 Email subject:', subject)
    console.log('📧 Email preview:', html.substring(0, 500) + '...')
    return { sent: false, reason: 'SMTP not configured' }
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: Number(smtpPort) || 587,
    secure: Number(smtpPort) === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  })

  try {
    await transporter.sendMail({
      from: fromEmail,
      to,
      subject,
      html,
    })
    console.log(`✅ Enrollment email sent to ${to} for ${studentName}`)
    return { sent: true }
  } catch (error) {
    console.error('❌ Failed to send enrollment email:', error)
    return { sent: false, reason: 'Email send failed' }
  }
}
