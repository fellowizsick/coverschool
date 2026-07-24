// @ts-nocheck
import { NextResponse, NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const supabase = createAdminClient()
    const { data: form, error } = await supabase
      .from('church_enrollment_forms')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 })
    }

    // Create PDF
    const doc = await PDFDocument.create()
    const font = await doc.embedFont(StandardFonts.Helvetica)
    const bold = await doc.embedFont(StandardFonts.HelveticaBold)
    const page = doc.addPage([612, 792]) // US Letter
    const { width, height } = page.getSize()
    let y = height - 40
    const leftMargin = 50
    const col2 = 300
    const fs = (size: number) => ({ size, font })

    function text(str: string, x: number, yPos: number, opts: any = {}) {
      const f = opts.bold ? bold : font
      const s = opts.size || 10
      page.drawText(str, { x, y: yPos - s, size: s, font: f, color: opts.color || rgb(0, 0, 0) })
    }

    function line(yPos: number, x1: number = leftMargin, x2: number = width - leftMargin) {
      page.drawLine({ start: { x: x1, y: yPos }, end: { x: x2, y: yPos }, thickness: 0.5, color: rgb(0.6, 0.6, 0.6) })
    }

    function section(title: string, borderColor: number[]) {
      const [r, g, b] = borderColor
      page.drawRectangle({
        x: leftMargin - 5, y: y - 25, width: width - 90, height: 25,
        borderColor: rgb(r, g, b), borderWidth: 1.5
      })
      text(title, leftMargin, y - 5, { bold: true, size: 12, color: rgb(r, g, b * 0.8) })
      y -= 35
    }

    function field(label: string, value: string, x: number, w: number = 200) {
      text(label, x, y, { size: 7, color: rgb(0.4, 0.4, 0.4) })
      text(value || '—', x, y + 12, { size: 10 })
      line(y + 22, x, x + w)
    }

    // === HEADER ===
    text('Church / Home School Enrollment Form', leftMargin, y, { bold: true, size: 16 })
    y -= 15
    text('Alabama Church School Model', leftMargin, y, { size: 10, color: rgb(0.4, 0.4, 0.4) })
    y -= 25

    // School Year + District
    field('School Year', form.school_year, leftMargin)
    field('Public School District', form.public_school_district || '', col2)
    y -= 30

    // === PART 1 ===
    page.drawRectangle({
      x: leftMargin - 8, y: y - 20, width: width - 84, height: y - 15,
      borderColor: rgb(0.2, 0.3, 0.7), borderWidth: 2
    })
    text('Part 1 — Parent or Guardian', leftMargin, y, { bold: true, size: 11, color: rgb(0.2, 0.2, 0.6) })
    y -= 30

    field("Student's Name", form.student_name, leftMargin)
    field('Date of Birth', form.student_dob, col2)
    field('Grade', form.grade, col2 + 150)
    y -= 30

    field("Parent or Guardian's Name", form.parent_name, leftMargin)
    y -= 25

    field('Home Phone', form.home_phone || '', leftMargin)
    field('Date', form.form_date || '', col2)
    y -= 30

    text('Address', leftMargin, y, { size: 7, color: rgb(0.4, 0.4, 0.4) })
    y += 12
    text(form.address || '—', leftMargin, y, { size: 10 })
    y -= 20
    field('City', form.city || '', leftMargin)
    field('State', form.state || '', col2)
    field('Zip', form.zip || '', col2 + 80)
    y -= 35

    // Signature
    page.drawLine({ start: { x: leftMargin, y }, end: { x: leftMargin + 200, y }, thickness: 1 })
    text('Signature of Parent or Guardian:', leftMargin, y - 12, { size: 8, color: rgb(0.3, 0.3, 0.3) })
    text(form.parent_signature || '', leftMargin + 10, y - 30, { size: 12 })
    text('Date: ' + (form.parent_signature_date || ''), leftMargin + 250, y - 12, { size: 8, color: rgb(0.3, 0.3, 0.3) })
    text(form.parent_signature_date || '', leftMargin + 260, y - 30, { size: 12 })

    y -= 60

    // === PART 2 ===
    if (y < 180) { // New page if needed
      doc.addPage([612, 792])
      y = height - 40
    }

    page.drawRectangle({
      x: leftMargin - 8, y: y - 20, width: width - 84, height: 75,
      borderColor: rgb(0.2, 0.5, 0.2), borderWidth: 2
    })
    text('Part 2 — Church School Administrator', leftMargin, y, { bold: true, size: 11, color: rgb(0.2, 0.5, 0.2) })
    y -= 25
    text('Church School Name:  Larose Christian Academy', leftMargin, y, { size: 10 })
    y -= 18
    text('School Phone:  251-201-9991', leftMargin, y, { size: 10 })
    y -= 18
    text('Address:  Mobile, AL', leftMargin, y, { size: 10 })
    y -= 25

    text('Signature of Administrator:  ________________________', leftMargin, y, { size: 10 })
    text('Date of Enrollment:  ' + (form.created_at?.split('T')[0] || form.form_date), leftMargin + 300, y, { size: 10 })

    y -= 60

    // === PART 3 ===
    if (y < 220) {
      doc.addPage([612, 792])
      y = height - 40
    }

    page.drawRectangle({
      x: leftMargin - 8, y: y - 20, width: width - 84, height: 130,
      borderColor: rgb(0.7, 0.5, 0.1), borderWidth: 2
    })
    text('Part 3 — Consent of Notification of Student Withdrawal', leftMargin, y, { bold: true, size: 11, color: rgb(0.6, 0.4, 0.1) })
    y -= 40

    // Consent text in a box
    const consentText = 'I hereby give prior consent to the Church School Administrator to notify the Public School Superintendent MCPSS Attendance Department P.O. Box 180069 Mobile Al 36618 should the above named Student cease attendance at said Church School.'
    // Word wrap
    const words = consentText.split(' ')
    let lineStr = ''
    let lineY = y
    for (const word of words) {
      const test = lineStr + word + ' '
      if (test.length * 4 > 500) {
        text(lineStr, leftMargin + 10, lineY, { size: 8 })
        lineStr = word + ' '
        lineY -= 12
      } else {
        lineStr = test
      }
    }
    if (lineStr) text(lineStr, leftMargin + 10, lineY, { size: 8 })
    y = lineY - 25

    page.drawLine({ start: { x: leftMargin, y }, end: { x: leftMargin + 200, y }, thickness: 1 })
    text('Signature of Parent or Guardian:', leftMargin, y - 12, { size: 8, color: rgb(0.3, 0.3, 0.3) })
    text(form.consent_signature || '', leftMargin + 10, y - 30, { size: 12 })
    text('Date: ' + (form.consent_date || ''), leftMargin + 250, y - 12, { size: 8, color: rgb(0.3, 0.3, 0.3) })

    y -= 50

    // Distribution footer
    if (y < 120) { doc.addPage([612, 792]); y = height - 40 }

    text('Distribution:', leftMargin, y, { bold: true, size: 9 })
    y -= 18
    text('📋 Original to: MCPSS — Attendance Dept, P.O. Box 180069, Mobile, AL 36618', leftMargin, y, { size: 8 })
    y -= 14
    text('📁 Copy 1 to: Church School Files — Larose Christian Academy', leftMargin, y, { size: 8 })
    y -= 14
    text('👪 Copy 2 to: Parents', leftMargin, y, { size: 8 })

    y -= 25
    text(`Form ID: ${form.id}  |  Submitted: ${new Date(form.created_at).toLocaleString()}`, leftMargin, y, { size: 6, color: rgb(0.6, 0.6, 0.6) })

    const pdfBytes = await doc.save()
    return new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="church-enrollment-${form.student_name?.replace(/\s+/g, '_') || 'form'}.pdf"`,
      },
    })
  } catch (err) {
    console.error('PDF generation error:', err)
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 })
  }
}
