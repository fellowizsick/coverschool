// Admin-only: the exact PDF that the "Send" button emails, for previewing before it goes out.
//
// WHY: the emailed diploma is built server-side by a second renderer, and the only way to know what
// a family will actually receive is to look at that PDF. This also lets Mom check a certificate
// before sending it. Without it the send path could only be verified by emailing a real family.

import { NextResponse, NextRequest } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { isAuthorizedAdmin } from '@/lib/adminAccess'
import { SCHOOL_CONFIG } from '@/lib/constants'
import { buildDiplomaPdf } from '@/lib/diploma-pdf'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAuthorizedAdmin(user.email)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }

  const id = request.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ ok: false, error: 'id required' }, { status: 400 })

  const admin = createAdminClient()
  const { data: dip } = await admin.from('diplomas').select('*').eq('id', id).single()
  if (!dip) return NextResponse.json({ ok: false, error: 'not found' }, { status: 404 })

  let emblem: Uint8Array | null = null
  try {
    const p = path.join(process.cwd(), 'public', 'lca-logo-transparent.png')
    if (fs.existsSync(p)) emblem = new Uint8Array(fs.readFileSync(p))
  } catch { /* optional */ }

  const pdf = await buildDiplomaPdf(
    {
      studentName: dip.student_name || '',
      graduationDate: dip.graduation_date || null,
      diplomaNumber: dip.diploma_number || '',
    },
    SCHOOL_CONFIG.name,
    { city: 'Mobile', state: 'Alabama' },
    { president: SCHOOL_CONFIG.president, headmaster: SCHOOL_CONFIG.headmaster },
    emblem
  )

  const safe = String(dip.student_name || 'diploma').replace(/[^A-Za-z0-9 _-]/g, '').replace(/\s+/g, '_')
  return new NextResponse(Buffer.from(pdf), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="Diploma_${safe}.pdf"`,
      'Cache-Control': 'no-store',
    },
  })
}
