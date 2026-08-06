import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import nodemailer from 'nodemailer'
import { SCHOOL_CONFIG } from '@/lib/constants'

const RATE_WINDOW_MS = 60 * 60 * 1000
const RATE_LIMIT = 20
const rateBuckets = new Map<string, number[]>()

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const hits = (rateBuckets.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS)
  if (hits.length >= RATE_LIMIT) {
    rateBuckets.set(ip, hits)
    return true
  }
  hits.push(now)
  rateBuckets.set(ip, hits)
  return false
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Send an honest apology email to the family so they know we caught it and
// will fix it. Only sent when we have a real-looking email.
async function sendApologyEmail(to: string, parentName: string, siteUrl: string) {
  try {
    const smtpHost = process.env.SMTP_HOST
    const smtpPort = process.env.SMTP_PORT
    const smtpUser = process.env.SMTP_USER
    const smtpPass = process.env.SMTP_PASS
    const fromEmail = process.env.SMTP_FROM || SCHOOL_CONFIG.email
    if (!smtpHost || !smtpUser || !smtpPass) return false

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort || '587', 10),
      secure: false,
      auth: { user: smtpUser, pass: smtpPass },
    })

    const name = parentName?.trim() || 'friend'
    await transporter.sendMail({
      from: `"${SCHOOL_CONFIG.name}" <${fromEmail}>`,
      to,
      subject: `We hit a snag — please try again, ${name.split(' ')[0]}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; background: #ffffff; border-radius: 12px; border: 1px solid #e5e7eb;">
          <h2 style="color: #065f46; margin: 0 0 12px;">We're sorry about that 🙏</h2>
          <p style="color: #374151; font-size: 15px; line-height: 1.6;">
            Hi ${name.split(' ')[0]},<br/><br/>
            It looks like something went wrong while you were trying to enroll — you may have seen an
            error on the page. That's on us, and our team has already been notified so we can fix it.
          </p>
          <p style="color: #374151; font-size: 15px; line-height: 1.6;">
            Please try again in a little while. If the problem happens again, reply to this email and
            we'll take care of you personally.
          </p>
          <p style="color: #6b7280; font-size: 13px; margin-top: 24px;">
            — The ${SCHOOL_CONFIG.name} team<br/>
            <a href="${siteUrl}" style="color: #059669;">${siteUrl}</a>
          </p>
        </div>`,
    })
    return true
  } catch (e) {
    console.error('apology email failed:', e)
    return false
  }
}

// Send Jonathan an immediate Telegram alert. Reads the bot token from env.
async function sendTelegramAlert(text: string) {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_ALERT_CHAT_ID || process.env.TELEGRAM_CHAT_ID
    if (!token || !chatId) return false
    const url = `https://api.telegram.org/bot${token}/sendMessage`
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    })
    return res.ok
  } catch (e) {
    console.error('telegram alert failed:', e)
    return false
  }
}

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    if (rateLimited(ip)) {
      return NextResponse.json({ ok: true }, { status: 200 }) // silent, don't add noise
    }

    const body = await request.json()
    const email = String(body?.email || '').trim().toLowerCase()
    const parentName = String(body?.parentName || '').trim().slice(0, 100)
    const studentName = String(body?.studentName || '').trim().slice(0, 100)
    const errorMessage = String(body?.error || 'Unknown error').slice(0, 500)
    const stage = String(body?.stage || 'enroll').slice(0, 40)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://laroseca.org'

    // 1. Persist the failure
    const supabase = await createAdminClient()
    const { data, error: dbError } = await supabase
      .from('signup_errors')
      .insert({
        email: EMAIL_RE.test(email) ? email : null,
        parent_name: parentName || null,
        student_name: studentName || null,
        error_message: errorMessage,
        stage,
        payload: body?.payload || {},
      })
      .select('id')
      .single()

    if (dbError) {
      console.error('signup_errors insert failed:', dbError.message)
    }

    // 2. Apology email to the family (if we have their email)
    let apologySent = false
    if (EMAIL_RE.test(email)) {
      apologySent = await sendApologyEmail(email, parentName, siteUrl)
      if (data?.id) {
        await supabase.from('signup_errors').update({ apology_sent: true }).eq('id', data.id)
      }
    }

    // 3. Immediate alert to Jonathan (Telegram)
    const when = new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })
    const alertText =
      `⚠️ LCA SIGNUP ERROR (${stage})\n` +
      `When: ${when}\n` +
      `Email: ${email || 'not provided'}\n` +
      `Parent: ${parentName || '?'}\n` +
      `Student: ${studentName || '?'}\n` +
      `Error: ${errorMessage}\n` +
      `Apology sent: ${apologySent ? 'yes' : 'no'}\n` +
      `Fix it: signup_errors table / enroll API logs.`
    const alertSent = await sendTelegramAlert(alertText)
    if (data?.id) {
      await supabase.from('signup_errors').update({ alert_sent: true }).eq('id', data.id)
    }

    return NextResponse.json({ ok: true, apologySent, alertSent })
  } catch (e) {
    console.error('signup-error endpoint error:', e)
    return NextResponse.json({ ok: true }, { status: 200 }) // never make the user's error worse
  }
}
