// @ts-nocheck
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/** DEBUG ONLY — reproduces dashboard queries to find the crash. */
export async function GET() {
  const out: Record<string, unknown> = {}
  try {
    const supabase = await createClient()
    const { data: { user }, error: userErr } = await supabase.auth.getUser()
    out.user = { email: user?.email, id: user?.id, userErr: userErr?.message || null }

    const { data: profile, error: profErr } = await supabase
      .from('profiles').select('role').eq('id', user?.id).single()
    out.profile = { role: profile?.role, profErr: profErr?.message || null }

    const { data: enrollments, error: enrErr } = await supabase
      .from('enrollments').select('*').order('created_at', { ascending: false })
    out.enrollments = { count: enrollments?.length ?? 0, enrErr: enrErr?.message || null }

    const { data: churchForms, error: cfErr } = await supabase
      .from('church_enrollment_forms').select('*').order('created_at', { ascending: false })
    out.churchForms = { count: churchForms?.length ?? 0, cfErr: cfErr?.message || null }

    out.ok = true
  } catch (e) {
    out.ok = false
    out.exception = String(e)
    out.exceptionType = (e as Error)?.name
    out.stack = (e as Error)?.stack?.slice(0, 500)
  }
  return NextResponse.json(out)
}
