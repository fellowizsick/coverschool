// LCA Student Podcast — student access-code login helpers.
//
// Students (children) have NO Supabase auth account. Instead the school issues
// each student a short PIN. On success we issue a signed, HTTP-only cookie
// (HMAC-SHA256) that the podcast API routes accept in place of a family login.
// The approved+paid gate is ALWAYS re-checked server-side on every request, so
// a cookie can't outlive an enrollment's eligibility. Parent/family accounts
// are untouched.
import { createHmac, timingSafeEqual } from 'crypto'

export const STUDENT_COOKIE = 'lca_student'
const COOKIE_TTL_S = 60 * 60 * 8 // 8h

function secret(): string {
  // Dedicated secret if set; otherwise derive from the service-role key (never
  // exposed to the client). A per-deploy fallback keeps cookies working across
  // restarts but means you should set STUDENT_SESSION_SECRET for production.
  return process.env.STUDENT_SESSION_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || 'lca-student-dev-fallback'
}

function b64url(s: string): string {
  return Buffer.from(s).toString('base64url')
}
function fromB64url(s: string): string {
  return Buffer.from(s, 'base64url').toString()
}

export function signStudentSession(payload: { enrollmentId: string; studentName: string; email: string }): string {
  const body = { ...payload, exp: Date.now() + COOKIE_TTL_S * 1000 }
  const data = b64url(JSON.stringify(body))
  const sig = createHmac('sha256', secret()).update(data).digest('base64url')
  return `${data}.${sig}`
}

export function verifyStudentSession(
  token: string | undefined | null
): { enrollmentId: string; studentName: string; email: string } | null {
  if (!token) return null
  const [data, sig] = token.split('.')
  if (!data || !sig) return null
  const expected = createHmac('sha256', secret()).update(data).digest('base64url')
  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null
  try {
    const payload = JSON.parse(fromB64url(data))
    if (typeof payload.exp !== 'number' || payload.exp < Date.now()) return null
    if (!payload.enrollmentId || !payload.studentName) return null
    return {
      enrollmentId: String(payload.enrollmentId),
      studentName: String(payload.studentName),
      email: String(payload.email || ''),
    }
  } catch {
    return null
  }
}

/** Read + verify the student cookie from a server Request (API route). */
export function readStudentCookie(request: Request): { enrollmentId: string; studentName: string; email: string } | null {
  const cookieHeader = request.headers.get('cookie') || ''
  const entry = cookieHeader
    .split(';')
    .map((s) => s.trim())
    .find((s) => s.startsWith(STUDENT_COOKIE + '='))
  if (!entry) return null
  const token = decodeURIComponent(entry.slice(STUDENT_COOKIE.length + 1))
  return verifyStudentSession(token)
}

/** Build the Set-Cookie header value for issuing a fresh student session. */
export function studentCookieHeader(token: string): string {
  return `${STUDENT_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${COOKIE_TTL_S}`
}

export function clearStudentCookieHeader(): string {
  return `${STUDENT_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`
}

/** Generate a 4-digit PIN (1000-9999). Uniqueness is enforced at issue time. */
export function generatePin(): string {
  return String(Math.floor(1000 + Math.random() * 9000))
}
