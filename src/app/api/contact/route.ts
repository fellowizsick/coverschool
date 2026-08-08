import { NextResponse } from 'next/server'
import { transporter, fromEmail } from '@/lib/email'
import { SCHOOL_CONFIG } from '@/lib/constants'

// Contact form → direct SMTP to the school's Gmail. NO Formspree, no middleman.
// (2026-08-08: Formspree form ID mykqplgw was owned by a different account —
// messages were silently lost. This route sends straight to the school inbox.)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, subject, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ ok: false, error: 'name, email, and message are required' }, { status: 400 })
    }
    if (typeof name !== 'string' || typeof email !== 'string' || typeof message !== 'string') {
      return NextResponse.json({ ok: false, error: 'invalid field types' }, { status: 400 })
    }
    if (name.length > 200 || email.length > 200 || message.length > 5000) {
      return NextResponse.json({ ok: false, error: 'fields too long' }, { status: 400 })
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    if (!emailOk) {
      return NextResponse.json({ ok: false, error: 'invalid email' }, { status: 400 })
    }

    const safeSubject = subject && typeof subject === 'string' ? subject.slice(0, 200) : 'Website contact message'
    const safeMessage = message.slice(0, 5000)

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #0d9488, #059669); padding: 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 22px;">📬 New Contact Message</h1>
        </div>
        <div style="padding: 24px;">
          <p style="margin: 0 0 16px; color: #374151; font-size: 14px;">
            Someone sent a message through the <strong>${SCHOOL_CONFIG.name}</strong> website.
          </p>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #374151;">
            <tr><td style="padding: 8px 12px; background: #f9fafb; font-weight: bold; width: 120px;">Name</td><td style="padding: 8px 12px;">${escapeHtml(name)}</td></tr>
            <tr><td style="padding: 8px 12px; background: #f9fafb; font-weight: bold;">Email</td><td style="padding: 8px 12px;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
            <tr><td style="padding: 8px 12px; background: #f9fafb; font-weight: bold;">Subject</td><td style="padding: 8px 12px;">${escapeHtml(safeSubject)}</td></tr>
          </table>
          <div style="margin-top: 16px; padding: 16px; background: #f9fafb; border-radius: 8px;">
            <p style="margin: 0 0 8px; font-weight: bold; color: #111827;">Message:</p>
            <p style="margin: 0; white-space: pre-wrap; color: #374151;">${escapeHtml(safeMessage)}</p>
          </div>
          <p style="margin-top: 24px; font-size: 12px; color: #9ca3af; text-align: center;">
            Sent from ${SCHOOL_CONFIG.name} website contact form.
          </p>
        </div>
      </div>
    `

    await transporter().sendMail({
      from: fromEmail(),
      to: SCHOOL_CONFIG.email,
      replyTo: email,
      subject: `📬 ${SCHOOL_CONFIG.name}: ${safeSubject}`,
      html,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('contact form send error:', err)
    return NextResponse.json({ ok: false, error: 'Failed to send message' }, { status: 500 })
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
