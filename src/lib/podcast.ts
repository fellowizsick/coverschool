// LCA Student Podcast System — shared server helpers.
// Gating: only logged-in families whose enrollment is status='approved' AND
// payment_status='paid' can submit. Videos stored PRIVATE; only admin sees pending.
import { createAdminClient } from '@/lib/supabase/server'
import { isAuthorizedAdmin } from '@/lib/adminAccess'
import nodemailer from 'nodemailer'
import { SCHOOL_CONFIG } from '@/lib/constants'

const BUCKET = 'podcast-videos'
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

export type Eligible =
  | { ok: true; enrollmentId: string; studentName: string; studentEmail: string }
  | { ok: false; reason: string }

/** A student may submit ONLY if their enrollment is approved AND paid. */
export async function getEligibleEnrollment(email: string): Promise<Eligible> {
  const admin = createAdminClient()
  const { data: enrolls } = await admin
    .from('enrollments')
    .select('id, student_first_name, student_last_name, email, status, payment_status, created_at')
    .eq('email', (email || '').toLowerCase().trim())
    .order('created_at', { ascending: false })
  const list = (enrolls || []) as any[]
  const paid = list.filter((e) => e.status === 'approved' && e.payment_status === 'paid')
  if (paid.length === 0) {
    return { ok: false, reason: 'Only paid, active students can submit. Please contact the school to complete enrollment/payment.' }
  }
  const e = paid[0]
  return {
    ok: true,
    enrollmentId: e.id,
    studentName: `${e.student_first_name} ${e.student_last_name}`.trim() || 'Student',
    studentEmail: e.email,
  }
}

/** Create a short-lived signed UPLOAD URL so the browser uploads straight to storage (no server body limit). */
export async function createSignedUploadUrl(path: string, expiresIn = 300): Promise<{ url: string; token: string; path: string } | null> {
  try {
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/upload/sign/${BUCKET}/${path}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${SERVICE_ROLE}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ expiresIn }),
    })
    const data = await res.json()
    if (!res.ok || data.error) return null
    // data.url is RELATIVE to the storage root (starts with /object/upload/sign/...) — need /storage/v1
    return { url: `${SUPABASE_URL}/storage/v1${data.url}`, token: data.token, path }
  } catch {
    return null
  }
}

/** Create a short-lived signed GET URL to view a video (admin review, or approved publish). */
export async function createSignedGetUrl(path: string, expiresIn = 60 * 60): Promise<string | null> {
  try {
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/sign/${BUCKET}/${path}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${SERVICE_ROLE}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ expiresIn }),
    })
    const data = await res.json()
    if (!res.ok || data.error) return null
    const su = String(data.signedURL || '')
    if (!su) return null
    if (su.startsWith('http')) return su
    // relative to storage root (e.g. /object/sign/...) — need /storage/v1
    return `${SUPABASE_URL}/storage/v1${su}`
  } catch {
    return null
  }
}

/** Notify Jonathan (Telegram) + Anne (email) that a new video is pending review. */
export async function notifyNewSubmission(sub: {
  id: string
  student_name: string
  title: string
  enrollment_id: string
}) {
  const chatId = process.env.TELEGRAM_ALERT_CHAT_ID || '8967355567'
  const botToken = process.env.TELEGRAM_BOT_TOKEN || ''
  const reviewUrl = `https://laroseca.org/dashboard/podcast?s=${sub.enrollment_id}`
  const text =
    `🎬 New podcast video submitted\n` +
    `Student: ${sub.student_name}\n` +
    `Title: ${sub.title || '(untitled)'}\n` +
    `Review: ${reviewUrl}`
  if (botToken) {
    try {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text }),
      })
    } catch {}
  }
  // Email Anne
  try {
    const smtpHost = process.env.SMTP_HOST; const smtpUser = process.env.SMTP_USER
    const smtpPass = process.env.SMTP_PASS
    if (smtpHost && smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost, port: parseInt(process.env.SMTP_PORT || '587', 10), secure: false,
        auth: { user: smtpUser, pass: smtpPass },
      })
      await transporter.sendMail({
        from: `"${SCHOOL_CONFIG.name}" <${process.env.SMTP_FROM || SCHOOL_CONFIG.email}>`,
        to: process.env.SMTP_USER, // Anne's school mailbox
        subject: `🎬 New podcast video — ${sub.student_name}`,
        html: `<p>A student submitted a new podcast video.</p><p><b>Student:</b> ${sub.student_name}<br/><b>Title:</b> ${sub.title || '(untitled)'}</p><p><a href="${reviewUrl}">Review it here</a></p>`,
      })
    }
  } catch {}
}
