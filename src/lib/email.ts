import nodemailer from 'nodemailer'
import { SCHOOL_CONFIG, CURRICULUM_BOOKS_URL } from './constants'

type SendEnrollmentEmailParams = {
  to: string
  parentName: string
  studentName: string
  grade: string
  referralCode?: string | null
}

type SendCancellationEmailParams = {
  to: string
  parentName: string
  studentName: string
}

type SendPasswordResetEmailParams = {
  to: string
  parentName: string
  link: string
}

export const transporter = () =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

export const fromEmail = () => process.env.SMTP_FROM || SCHOOL_CONFIG.email

export async function sendPasswordResetEmail({ to, parentName, link }: SendPasswordResetEmailParams) {
  const subject = `Reset your ${SCHOOL_CONFIG.name} parent portal password`

  const html = `
    <div style="font-family: Arial, Helvetica, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; color: #1f2937;">
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="font-size: 28px;">🏫</span>
        <h1 style="font-size: 20px; margin: 8px 0 0; color: #065f46;">${SCHOOL_CONFIG.name}</h1>
        <p style="color: #6b7280; font-size: 14px; margin: 4px 0 0;">Parent Portal — Password Reset</p>
      </div>

      <p style="font-size: 15px; line-height: 1.6;">Hi ${parentName},</p>
      <p style="font-size: 15px; line-height: 1.6;">
        We received a request to set or change the password for your parent portal account.
        Click the button below to continue:
      </p>

      <div style="text-align: center; margin: 28px 0;">
        <a href="${link}"
           style="display: inline-block; background: #059669; color: #ffffff; text-decoration: none;
                  padding: 14px 32px; border-radius: 8px; font-weight: bold; font-size: 15px;">
          Set My Password →
        </a>
      </div>

      <p style="font-size: 13px; color: #6b7280; line-height: 1.6;">
        If you didn't request this, you can safely ignore this email — your password won't change
        unless you click the link. This link expires in 1 hour.
      </p>

      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
      <p style="font-size: 12px; color: #9ca3af; text-align: center; margin: 0;">
        ${SCHOOL_CONFIG.name} · ${SCHOOL_CONFIG.city} · ${SCHOOL_CONFIG.email}
      </p>
    </div>
  `

  return transporter().sendMail({ from: fromEmail(), to, subject, html })
}
export async function sendEnrollmentEmail({
  to,
  parentName,
  studentName,
  grade,
  referralCode,
}: SendEnrollmentEmailParams) {
  const smtpHost = process.env.SMTP_HOST
  const smtpPort = process.env.SMTP_PORT
  const smtpUser = process.env.SMTP_USER
  const smtpPass = process.env.SMTP_PASS
  const fromEmail = process.env.SMTP_FROM || SCHOOL_CONFIG.email
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://laroseca.org'

  const subject = `Welcome to ${SCHOOL_CONFIG.name}, ${parentName}! 🎉`

  // 🎁 Referral block — included when the family has a code
  const referralBlock = referralCode
    ? `
        <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h2 style="color: #065f46; font-size: 18px; margin: 0 0 8px;">🎁 Share &amp; Earn — Free Tuition</h2>
          <p style="color: #065f46; font-size: 14px; margin: 0 0 12px;">
            You now have your very own referral code! When a new family enrolls using your link
            and pays, you get <strong>$45 off your tuition</strong> (one month free on monthly plans).
            Share it with friends, family, and fellow homeschoolers:
          </p>
          <div style="background: #ffffff; border: 1px dashed #34d399; border-radius: 8px; padding: 14px 16px; margin-bottom: 12px; text-align: center;">
            <span style="font-family: monospace; font-size: 20px; font-weight: bold; color: #047857; letter-spacing: 2px;">${referralCode}</span>
          </div>
          <a href="${siteUrl}/enroll?ref=${encodeURIComponent(referralCode)}"
             style="display: inline-block; background: #059669; color: #fff; text-decoration: none;
                    padding: 12px 24px; border-radius: 8px; font-weight: bold; font-size: 14px;">
            Share Your Referral Link →
          </a>
          <p style="color: #6b7280; font-size: 12px; margin: 12px 0 0;">
            You can also find this code anytime in your Parent Portal. Multiple referrals stack —
            refer 3 families, get 3 months free!
          </p>
        </div>`
    : ''


  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #065f46, #047857); padding: 32px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: #fff; margin: 0; font-size: 24px;">Welcome to the Family! 🎓</h1>
        <p style="color: #a7f3d0; margin: 8px 0 0; font-size: 16px;">${SCHOOL_CONFIG.name}</p>
      </div>

      <div style="background: #fff; padding: 32px; border: 1px solid #e5e7eb;">
        <p style="color: #374151; font-size: 16px;">Dear ${parentName},</p>
        <p style="color: #374151; font-size: 16px;">
          <strong>Welcome!</strong> We are truly honored that you have entrusted us with
          <strong>${studentName}</strong>'s education. This is a decision that comes from the heart,
          and we do not take it lightly.
        </p>
        <p style="color: #374151; font-size: 16px;">
          Your enrollment is confirmed and your tuition has been processed successfully.
          ${studentName} (Grade: ${grade}) is now officially part of the ${SCHOOL_CONFIG.name} family.
        </p>
        <p style="color: #374151; font-size: 16px;">
          We believe every child is a gift, and every family deserves the freedom to educate
          their children in a way that aligns with their values. We are here to support you
          every step of the way — handling the paperwork, keeping the records, and standing
          with you so you can focus on what matters most: your child's growth and learning.
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

        ${referralBlock}

        <h3 style="color: #065f46; font-size: 16px;">Next Steps</h3>
        <ol style="color: #374151; font-size: 14px; line-height: 1.8;">
          <li>Purchase your curriculum books from Christianbook.com using the link above</li>
          <li>Complete the Church Enrollment Form (required before starting)</li>
          <li>Log into your parent portal to track progress and view records</li>
          <li>Start homeschooling with confidence — we handle the paperwork!</li>
        </ol>

        <p style="color: #374151; font-size: 16px;">
          If you ever have any questions, concerns, or just need someone to talk to,
          please do not hesitate to reach out. We are here for you.
        </p>
        <p style="color: #374151; font-size: 16px;">
          May God bless you and your family on this beautiful journey.
        </p>

        <p style="color: #6b7280; font-size: 13px; margin-top: 24px; border-top: 1px solid #e5e7eb; padding-top: 16px;">
          With gratitude,<br/>
          <strong>The ${SCHOOL_CONFIG.name} Team</strong><br/>
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

  // Plain-text alternative — Gmail flags HTML-only mail as higher spam risk.
  const plainText = `Dear ${parentName},

Welcome to ${SCHOOL_CONFIG.name}! Your enrollment is confirmed and your tuition has been processed successfully. ${studentName} (Grade: ${grade}) is now officially part of the ${SCHOOL_CONFIG.name} family.

${referralCode
  ? `YOUR REFERRAL CODE: ${referralCode}

When another family enrolls using your link and pays, you get $45 off your tuition (one month free on monthly plans). Share link: ${siteUrl}/enroll?ref=${encodeURIComponent(referralCode)}

You can also find this code anytime in your Parent Portal. Multiple referrals stack - refer 3 families, get 3 months free!`
  : ''}

Your tuition covers administrative services, record-keeping, and legal oversight. Curriculum books are not included and must be purchased separately (we recommend ACE PACE curriculum sets from Christianbook.com).

NEXT STEPS:
1. Purchase your curriculum books
2. Complete the Church Enrollment Form (required before starting)
3. Log into your parent portal to track progress and view records
4. Start homeschooling with confidence - we handle the paperwork!

If you ever have any questions, reach out to ${SCHOOL_CONFIG.email}.

With gratitude,
The ${SCHOOL_CONFIG.name} Team
${SCHOOL_CONFIG.phone} | ${SCHOOL_CONFIG.address}`

  const mailOptions = {
    from: `"${SCHOOL_CONFIG.name}" <${fromEmail}>`,
    replyTo: SCHOOL_CONFIG.email,
    to,
    subject,
    html,
    text: plainText,
  }

  // Send with ONE retry — transient SMTP failures shouldn't cost a family their email.
  try {
    await transporter.sendMail(mailOptions)
    console.log(`✅ Enrollment email sent to ${to} for ${studentName}`)
    return { sent: true }
  } catch (error) {
    console.error('Failed to send enrollment email (attempt 1):', error)
    try {
      await transporter.sendMail(mailOptions)
      console.log(`✅ Enrollment email sent to ${to} (retry)`)
      return { sent: true, retried: true }
    } catch (retryError) {
      console.error('Failed to send enrollment email (attempt 2):', retryError)
      return { sent: false, reason: 'Email send failed' }
    }
  }
}

export async function sendCancellationEmail({
  to,
  parentName,
  studentName,
}: SendCancellationEmailParams) {
  const smtpHost = process.env.SMTP_HOST
  const smtpPort = process.env.SMTP_PORT
  const smtpUser = process.env.SMTP_USER
  const smtpPass = process.env.SMTP_PASS
  const fromEmail = process.env.SMTP_FROM || SCHOOL_CONFIG.email

  const subject = `Thank you for being part of ${SCHOOL_CONFIG.name}, ${parentName}`

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #1e40af, #3730a3); padding: 32px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: #fff; margin: 0; font-size: 24px;">Thank You 💙</h1>
        <p style="color: #c7d2fe; margin: 8px 0 0; font-size: 16px;">${SCHOOL_CONFIG.name}</p>
      </div>

      <div style="background: #fff; padding: 32px; border: 1px solid #e5e7eb;">
        <p style="color: #374151; font-size: 16px;">Dear ${parentName},</p>
        <p style="color: #374151; font-size: 16px;">
          This email is to confirm that <strong>${studentName}</strong>'s membership with
          ${SCHOOL_CONFIG.name} has been cancelled, and your card will not be charged again.
        </p>
        <p style="color: #374151; font-size: 16px;">
          We want to sincerely thank you for allowing us to be part of your family's
          homeschooling journey. It has been a privilege to serve you, and we pray that
          this season has been a blessing to your family.
        </p>
        <p style="color: #374151; font-size: 16px;">
          If your circumstances ever change and you would like to re-enroll,
          <strong>you are always welcome back</strong> with open arms. The door is never closed.
        </p>
        <p style="color: #374151; font-size: 16px;">
          We wish you and ${studentName} the very best on your continued journey.
          May God bless you richly and guide your steps.
        </p>

        <p style="color: #374151; font-size: 16px; margin-top: 24px;">
          With warm regards and gratitude,<br/>
          <strong>The ${SCHOOL_CONFIG.name} Team</strong><br/>
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

  if (!smtpHost || !smtpUser || !smtpPass) {
    console.log('SMTP not configured. Would have sent cancellation email to:', to)
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
    console.log('Cancellation email sent to', to, 'for', studentName)
    return { sent: true }
  } catch (error) {
    console.error('Failed to send cancellation email:', error)
    return { sent: false, reason: 'Email send failed' }
  }
}
