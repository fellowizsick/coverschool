// LCA Student Podcast System — shared server helpers.
// Gating: only logged-in families whose enrollment is status='approved' AND
// payment_status='paid' can submit. Videos stored PRIVATE; only admin sees pending.
import { createAdminClient } from '@/lib/supabase/server'
import { isAuthorizedAdmin } from '@/lib/adminAccess'
import nodemailer from 'nodemailer'
import { SCHOOL_CONFIG } from '@/lib/constants'
import { readStudentCookie } from '@/lib/studentAuth'

const BUCKET = 'podcast-videos'
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

/** Media type is encoded in the storage path (schema-free, no DB column): a
 *  path segment '/a/' means audio, '/v/' means video. Default = video. */
export function mediaTypeFromPath(path: string): 'video' | 'audio' {
  return /\/a\//.test(path) ? 'audio' : 'video'
}

/** Build a storage path for a new submission, embedding the media type. */
export function buildMediaPath(enrollmentId: string, mediaType: 'video' | 'audio'): string {
  const seg = mediaType === 'audio' ? 'a' : 'v'
  const now = new Date()
  const date = now.toISOString().slice(0, 10)
  return `sub/${enrollmentId}/${date}/${seg}/${crypto.randomUUID()}.webm`
}

export type Eligible =
  | { ok: true; enrollmentId: string; studentName: string; studentEmail: string }
  | { ok: false; reason: string }

/** Delete a storage object (file) from the private bucket. */
export async function deleteStorageObject(path: string): Promise<boolean> {
  try {
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${path}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${SERVICE_ROLE}` },
    })
    return res.ok
  } catch {
    return false
  }
}

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

/** Look up a student by their PIN (school-issued access code). Returns the
 *  single approved+paid enrollment that matches. */
export async function getEligibleEnrollmentByPin(pin: string): Promise<Eligible> {
  const admin = createAdminClient()
  const { data: enrolls } = await admin
    .from('enrollments')
    .select('id, student_first_name, student_last_name, email, status, payment_status, created_at')
    .eq('student_pin', pin)
    .order('created_at', { ascending: false })
  const list = (enrolls || []) as any[]
  const paid = list.filter((e) => e.status === 'approved' && e.payment_status === 'paid')
  if (paid.length === 0) {
    return { ok: false, reason: 'That code did not match a paid, active student. Please contact the school.' }
  }
  const e = paid[0]
  return {
    ok: true,
    enrollmentId: e.id,
    studentName: `${e.student_first_name} ${e.student_last_name}`.trim() || 'Student',
    studentEmail: e.email,
  }
}

/** Resolve WHO is making the request — a student (via signed cookie) OR a
 *  logged-in family account. Returns the eligible enrollment either way, or a
 *  failure reason. This is the single gate used by every podcast route. */
export async function resolveSubmitter(request: Request): Promise<
  | { ok: true; eligible: Eligible; via: 'student' | 'family' }
  | { ok: false; reason: string; status: number }
> {
  // 1) Student cookie (school-issued PIN session)
  const student = readStudentCookie(request)
  if (student) {
    const eligible = await getEligibleEnrollmentById(student.enrollmentId)
    if (eligible.ok) return { ok: true, eligible, via: 'student' }
    return { ok: false, reason: eligible.reason, status: 403 }
  }

  // 2) Family/parent Supabase account
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !user.email) {
    return { ok: false, reason: 'Please log in with the family account.', status: 401 }
  }
  const eligible = await getEligibleEnrollment(user.email)
  if (!eligible.ok) return { ok: false, reason: eligible.reason, status: 403 }
  return { ok: true, eligible, via: 'family' }
}

/** Id-scoped eligibility — resolves the EXACT enrollment in the signed cookie,
 *  so a multi-child family never grabs the wrong student. */
export async function getEligibleEnrollmentById(id: string): Promise<Eligible> {
  const admin = createAdminClient()
  const { data: e } = await admin
    .from('enrollments')
    .select('id, student_first_name, student_last_name, email, status, payment_status')
    .eq('id', id)
    .single()
  if (!e) return { ok: false, reason: 'Enrollment not found.' }
  if (e.status !== 'approved' || e.payment_status !== 'paid') {
    return { ok: false, reason: 'Only paid, active students can submit. Please contact the school to complete enrollment/payment.' }
  }
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
    `🎬 New podcast submission\n` +
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
        subject: `🎬 New podcast submission — ${sub.student_name}`,
        html: `<p>A student submitted a new podcast video or audio.</p><p><b>Student:</b> ${sub.student_name}<br/><b>Title:</b> ${sub.title || '(untitled)'}</p><p><a href="${reviewUrl}">Review it here</a></p>`,
      })
    }
  } catch {}
}
