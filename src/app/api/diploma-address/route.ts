// @ts-nocheck
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const s = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
)

export async function POST(request: Request) {
  try {
    const { examId, line1, city, state, zip } = await request.json()
    if (!examId) return NextResponse.json({ error: 'Missing examId' }, { status: 400 })
    const { error } = await s
      .from('diploma_exams')
      .update({
        mailing_address: line1,
        mailing_city: city,
        mailing_state: state,
        mailing_zip: zip,
        paper_ordered: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', examId)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: 'server error' }, { status: 500 })
  }
}
