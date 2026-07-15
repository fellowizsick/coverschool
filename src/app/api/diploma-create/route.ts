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
    const { studentName, email, isEnrolled, testFee } = await request.json()
    if (!studentName || !email) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }
    const { data, error } = await s
      .from('diploma_exams')
      .insert({
        student_name: studentName,
        parent_email: email,
        is_enrolled: !!isEnrolled,
        test_fee: testFee,
        status: 'created',
      })
      .select('id')
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ examId: data.id })
  } catch (e) {
    return NextResponse.json({ error: 'server error' }, { status: 500 })
  }
}
