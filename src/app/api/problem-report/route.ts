import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { SCHOOL_CONFIG } from '@/lib/constants'
import { isAuthorizedAdmin } from '@/lib/adminAccess'

export const runtime = 'nodejs'

const MAX_FILES = 4
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB each
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

/**
 * POST /api/problem-report
 * Paying-student-only support window. Sends the parent's problem
 * description + screenshots to the school email via SMTP.
 *
 * Gate: caller must be signed in AND have an approved (paying) enrollment
 * under their email, OR be an authorized admin (Anne/Jonathan).
 */
export async function POST(request: Request) {
  try {
    // 1) Auth — must be signed in
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user?.email) {
      return NextResponse.json({ error: 'Please sign in first.' }, { status: 401 })
    }

    // 2) Parse the multipart form
    let form: FormData
    try {
      form = await request.formData()
    } catch {
      return NextResponse.json({ error: 'Could not read the form.' }, { status: 400 })
    }

    const description = String(form.get('description') || '').trim()
    const studentName = String(form.get('studentName') || '').trim()
    const files = form
      .getAll('screenshots')
      .filter((f): f is File => f instanceof File && f.size > 0)

    if (!description) {
      return NextResponse.json(
        { error: 'Please describe the problem you ran into.' },
        { status: 400 }
      )
    }
    if (description.length > 4000) {
      return NextResponse.json(
        { error: 'Description is too long (4,000 character max).' },
        { status: 400 }
      )
    }
    if (files.length === 0) {
      return NextResponse.json(
        { error: 'Please attach at least one screenshot so we can see the issue.' },
        { status: 400 }
      )
    }
    if (files.length > MAX_FILES) {
      return NextResponse.json(
        { error: `You can attach up to ${MAX_FILES} screenshots.` },
        { status: 400 }
      )
    }
    for (const f of files) {
      if (!ALLOWED_TYPES.includes(f.type)) {
        return NextResponse.json(
          { error: `"${f.name}" is not a supported image type (JPG, PNG, WebP, or GIF).` },
          { status: 400 }
        )
      }
      if (f.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `"${f.name}" is too large (max 5MB per screenshot).` },
          { status: 400 }
        )
      }
    }

    // 3) Paying-student gate: approved enrollment under this email, OR admin
    const isAdmin = isAuthorizedAdmin(user.email)
    if (!isAdmin) {
      const admin = createAdminClient()
      const { data: enrollments, error } = await admin
        .from('enrollments')
        .select('id, status')
        .eq('email', user.email.toLowerCase())

      if (error) {
        console.error('Problem report gate error:', error)
        return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
      }

      const approved = (enrollments || []).some((e) => e.status === 'approved')
      if (!approved) {
        return NextResponse.json(
          { error: 'The Problem Center is available to enrolled students only.' },
          { status: 403 }
        )
      }
    }

    // 4) Build attachments (sanitize filenames)
    const attachments = await Promise.all(
      files.map(async (f) => ({
        filename: f.name.replace(/[^\w.\-]/g, '_').slice(0, 60),
        content: Buffer.from(await f.arrayBuffer()),
        contentType: f.type,
      }))
    )

    // 5) Send the email to the school
    const smtpHost = process.env.SMTP_HOST
    const smtpPort = process.env.SMTP_PORT
    const smtpUser = process.env.SMTP_USER
    const smtpPass = process.env.SMTP_PASS
    const fromEmail = process.env.SMTP_FROM || SCHOOL_CONFIG.email

    if (!smtpHost || !smtpUser || !smtpPass) {
      console.error('Problem report: SMTP not configured')
      return NextResponse.json({ error: 'Email service not configured.' }, { status: 500 })
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: Number(smtpPort) || 587,
      secure: Number(smtpPort) === 465,
      auth: { user: smtpUser, pass: smtpPass },
    })

    const reportedAt = new Date().toLocaleString('en-US', {
      timeZone: 'America/Chicago',
      dateStyle: 'medium',
      timeStyle: 'short',
    })

    const subject = `🛠️ Problem Report${studentName ? ` — ${studentName}` : ''}`
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #065f46, #047857); padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: #fff; margin: 0; font-size: 20px;">🛠️ Problem Center Report</h1>
        </div>
        <div style="background: #fff; padding: 24px; border: 1px solid #e5e7eb;">
          <p style="color: #374151; font-size: 14px; margin: 0 0 16px;">
            A student family reported a problem with the website. Details below.
          </p>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 6px 0; color: #6b7280; width: 140px;">Reported by</td>
              <td style="padding: 6px 0; color: #111827; font-weight: 600;">${escapeHtml(user.email)}</td>
            </tr>
            ${studentName ? `<tr><td style="padding: 6px 0; color: #6b7280;">Student</td><td style="padding: 6px 0; color: #111827; font-weight: 600;">${escapeHtml(studentName)}</td></tr>` : ''}
            <tr>
              <td style="padding: 6px 0; color: #6b7280;">Date/time</td>
              <td style="padding: 6px 0; color: #111827;">${escapeHtml(reportedAt)}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6b7280;">Screenshots</td>
              <td style="padding: 6px 0; color: #111827;">${attachments.length} attached</td>
            </tr>
          </table>
          <h3 style="color: #065f46; font-size: 15px; margin: 20px 0 8px;">What went wrong</h3>
          <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 14px; color: #374151; font-size: 14px; white-space: pre-wrap;">${escapeHtml(description)}</div>
        </div>
        <div style="background: #f9fafb; padding: 14px 24px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb; border-top: none;">
          <p style="color: #9ca3af; font-size: 11px; margin: 0; text-align: center;">
            ${SCHOOL_CONFIG.name} · Problem Center · Reply to ${escapeHtml(user.email)} directly from your email client.
          </p>
        </div>
      </div>
    `
    const text = `Problem Center Report
Reported by: ${user.email}${studentName ? `\nStudent: ${studentName}` : ''}
Date/time: ${reportedAt}
Screenshots: ${attachments.length} attached

What went wrong:
${description}`

    try {
      await transporter.sendMail({
        from: `"${SCHOOL_CONFIG.name} Problem Center" <${fromEmail}>`,
        replyTo: user.email,
        to: SCHOOL_CONFIG.email,
        subject,
        html,
        text,
        attachments,
      })
    } catch (err) {
      console.error('Problem report send failed:', err)
      return NextResponse.json(
        { error: 'Your report could not be sent. Please try again or email us directly.' },
        { status: 502 }
      )
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Problem report error:', err)
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
