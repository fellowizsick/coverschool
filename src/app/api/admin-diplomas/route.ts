import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { isAuthorizedAdmin } from '@/lib/adminAccess'
import { SCHOOL_CONFIG } from '@/lib/constants'
import { mailFrom } from '@/lib/email'
import { normalizeName } from '@/lib/diploma-name'
import { buildDiplomaPdf } from '@/lib/diploma-pdf'
import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'

/**
 * Today in the school's own timezone. The server runs in UTC, so a plain new Date() would stamp
 * tomorrow's date for anything created after 7pm Central.
 */
function schoolToday(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Chicago', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date())
}


// Admin-only. Mom's Diplomas panel: list, create/edit, and re-send a diploma to any address.
//
// WHY SEND-TO-ANY-EMAIL EXISTS (Jonathan, 2026-09-11): "she needs to send it to them again or
// one or be able to easily make and edit her own in her dashboard". A graduate loses the email,
// changes address, or the family asks for another copy years later — the school must be able to
// reissue without touching the database by hand.
//
// The diploma PRINT page is admin-gated, so the email does NOT link to it. The school holds the
// signed original and sends the certificate itself.

async function requireAdminUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAuthorizedAdmin(user.email)) return null
  return user
}

/** GET — every diploma, newest first, with the student it belongs to. */
export async function GET() {
  const user = await requireAdminUser()
  if (!user) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })

  const admin = createAdminClient()
  const { data: diplomas, error } = await admin
    .from('diplomas')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(500)
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })

  const ids = (diplomas || []).map((d) => d.enrollment_id).filter(Boolean)
  let byId: Record<string, { student_first_name?: string; student_last_name?: string; student_grade?: string; email?: string }> = {}
  if (ids.length) {
    const { data: enrs } = await admin
      .from('enrollments')
      .select('id, student_first_name, student_last_name, student_grade, email')
      .in('id', ids)
    byId = Object.fromEntries((enrs || []).map((e) => [e.id, e]))
  }

  return NextResponse.json({
    ok: true,
    diplomas: (diplomas || []).map((d) => ({
      ...d,
      student_first_name: byId[d.enrollment_id]?.student_first_name || '',
      student_last_name: byId[d.enrollment_id]?.student_last_name || '',
      student_grade: byId[d.enrollment_id]?.student_grade || '',
      family_email: byId[d.enrollment_id]?.email || '',
    })),
  })
}

/**
 * POST — four jobs.
 *   { action: 'save', ... }        create or update a diploma record
 *   { action: 'send', id, to }     email the diploma notice to any address
 *   { action: 'delete', id }       remove a diploma she made by mistake or must revoke
 *   { action: 'nextnumber' }       suggest the next diploma number so she never invents one
 */
export async function POST(request: Request) {
  const user = await requireAdminUser()
  if (!user) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })

  const admin = createAdminClient()
  const body = await request.json().catch(() => ({}))
  const action = String(body.action || 'save')

  // ---- delete: full control means being able to undo. Revoking a diploma that was issued in
  // error is a real school-office job; without this she would have to call someone with DB access.
  if (action === 'delete') {
    const id = String(body.id || '')
    if (!id) return NextResponse.json({ ok: false, error: 'No diploma selected.' }, { status: 400 })
    const { error } = await admin.from('diplomas').delete().eq('id', id)
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true, deleted: id })
  }

  // ---- next number: LCA-<year>-<4 digits>, continuing from what already exists.
  if (action === 'nextnumber') {
    const year = new Date().getFullYear()
    const { data: rows } = await admin.from('diplomas').select('diploma_number')
    let max = 0
    for (const r of rows || []) {
      const m = String(r.diploma_number || '').match(/(\d+)\s*$/)
      if (m) max = Math.max(max, parseInt(m[1], 10))
    }
    return NextResponse.json({ ok: true, number: `LCA-${year}-${String(max + 1).padStart(4, '0')}` })
  }

  if (action === 'send') {
    const id = String(body.id || '')
    const to = String(body.to || '').trim()
    if (!id || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
      return NextResponse.json({ ok: false, error: 'A valid email address is required.' }, { status: 400 })
    }
    const { data: dip } = await admin.from('diplomas').select('*').eq('id', id).single()
    if (!dip) return NextResponse.json({ ok: false, error: 'Diploma not found.' }, { status: 404 })

    // ONE normalised name for the subject, the filename and the certificate. Using the raw
    // stored value put 'EMILY   rose CARTER' in a real subject line while the attached PDF
    // said 'Emily Rose Carter' — the same name two different ways in one email.
    const printName = normalizeName(dip.student_name)

    const host = process.env.SMTP_HOST
    const port = process.env.SMTP_PORT
    const smtpUser = process.env.SMTP_USER
    const smtpPass = process.env.SMTP_PASS
    if (!host || !smtpUser || !smtpPass) {
      return NextResponse.json({ ok: false, error: 'Email is not configured on the server.' }, { status: 500 })
    }

    const gradDate = dip.graduation_date
      ? new Date(dip.graduation_date + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      : ''

    try {
      const transporter = nodemailer.createTransport({
        host, port: parseInt(port || '587', 10), secure: false,
        auth: { user: smtpUser, pass: smtpPass },
      })

      // ATTACH THE ACTUAL DIPLOMA.
      // Before this, the email said "This is your copy of the graduation diploma" and attached
      // nothing — the family received no certificate. The PDF is built from the same record the
      // screen renders (name, date, number), so what is emailed matches what is previewed.
      let attachment: { filename: string; content: Buffer; contentType: string } | null = null
      try {
        let emblem: Uint8Array | null = null
        try {
          const emblemPath = path.join(process.cwd(), 'public', 'lca-logo-transparent.png')
          if (fs.existsSync(emblemPath)) emblem = new Uint8Array(fs.readFileSync(emblemPath))
        } catch { /* emblem is optional */ }

        const pdf = await buildDiplomaPdf(
          {
            studentName: printName || dip.student_name || '',
            graduationDate: dip.graduation_date || null,
            diplomaNumber: dip.diploma_number || '',
          },
          SCHOOL_CONFIG.name,
          { city: 'Mobile', state: 'Alabama' },
          { president: SCHOOL_CONFIG.president, headmaster: SCHOOL_CONFIG.headmaster },
          emblem
        )
        const safeName = (printName || 'diploma').replace(/[^A-Za-z0-9 _-]/g, '').replace(/\s+/g, '_')
        attachment = {
          filename: `Diploma_${safeName}_${dip.diploma_number || ''}.pdf`.replace(/__+/g, '_'),
          content: Buffer.from(pdf),
          contentType: 'application/pdf',
        }
      } catch (e) {
        // The notice must still go out even if PDF generation fails; without the attachment the
        // email says so plainly rather than claiming a diploma it did not carry.
        console.error('diploma PDF build failed:', e)
      }

      await transporter.sendMail({
        from: mailFrom(),
        to,
        subject: `🎓 Diploma — ${printName || dip.student_name}`,
        attachments: attachment ? [attachment] : [],
        html: `
          <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px">
            <h2 style="color:#0369a1;margin:0 0 12px">${SCHOOL_CONFIG.name}</h2>
            <p style="color:#374151;font-size:15px;line-height:1.6">
              ${attachment
                ? `Attached is the graduation diploma awarded to <strong>${printName}</strong>.`
                : `This is notice of the graduation diploma awarded to <strong>${printName}</strong>.`}
            </p>
            <p style="color:#374151;font-size:15px;line-height:1.6">
              <strong>Graduation date:</strong> ${gradDate}<br/>
              <strong>Diploma number:</strong> ${dip.diploma_number}
            </p>
            <p style="color:#374151;font-size:15px;line-height:1.6">
              The attached certificate prints at 9 by 7 inches, the standard diploma size — print it
              at 100% (do not "fit to page") to keep it true to size.
            </p>
            <p style="color:#374151;font-size:15px;line-height:1.6">
              ${SCHOOL_CONFIG.name} holds the signed original. If you need a certified copy or your
              official transcript, reply to this email or call ${SCHOOL_CONFIG.phone}.
            </p>
            <p style="color:#6b7280;font-size:13px;margin-top:24px">— The ${SCHOOL_CONFIG.name} office</p>
          </div>`,
      })
    } catch (e) {
      console.error('diploma send failed:', e)
      return NextResponse.json({ ok: false, error: 'The email could not be sent.' }, { status: 500 })
    }

    await admin.from('diplomas').update({ email_sent_at: new Date().toISOString() }).eq('id', id)
    return NextResponse.json({ ok: true, sentTo: to, attached: true })
  }

  // ---- save (create or update) ----
  const id = String(body.id || '')
  const enrollmentId = String(body.enrollment_id || '')
  const studentName = String(body.student_name || '').trim()
  // The award date is never blank: the column is NOT NULL, and a diploma without a date looks
  // unfinished. Fall back to today at the school if the office left it empty.
  const gradDate = String(body.graduation_date || '').trim() || schoolToday()
  const number = String(body.diploma_number || '').trim()
  const format = body.format === 'digital_plus_paper' ? 'digital_plus_paper' : 'digital'

  if (!studentName || !number) {
    return NextResponse.json({ ok: false, error: 'Student name and diploma number are required.' }, { status: 400 })
  }

  if (id) {
    const { error } = await admin
      .from('diplomas')
      .update({ student_name: studentName, graduation_date: gradDate, diploma_number: number, format })
      .eq('id', id)
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true, id })
  }

  if (!enrollmentId) {
    return NextResponse.json({ ok: false, error: 'Pick the student this diploma belongs to.' }, { status: 400 })
  }
  const { data, error } = await admin
    .from('diplomas')
    .insert({
      enrollment_id: enrollmentId,
      student_name: studentName,
      graduation_date: gradDate,
      diploma_number: number,
      attested_by: user.email || null,
      format,
    })
    .select('id')
    .single()
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, id: data.id })
}
