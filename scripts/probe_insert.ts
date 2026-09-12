/** Direct probe: can the service key insert into enrollments right now? */
import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const svc = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY!
console.log('key prefix:', svc.slice(0, 10) + '...')

const db = createClient(url, svc, { auth: { persistSession: false } })

const email = `probe_${Date.now()}@example.invalid`

async function main() {
  const { data, error } = await db.from('enrollments').insert({
    student_first_name: 'Probe', student_last_name: 'Test', student_dob: '2008-01-01',
    student_grade: '12th Grade', parent_first_name: 'ZZPROBE', parent_last_name: 'Test',
    email, phone: '0000000000', address_line1: '1 Test St', city: 'Mobile', state: 'AL', zip: '36601',
    graduation_status: 'complete', status: 'approved', payment_status: 'paid',
  }).select('id').single()

  if (error) {
    console.log('INSERT FAILED:', error.message)
    console.log('code:', error.code, '| details:', error.details)
  } else {
    console.log('INSERT OK, id =', data.id)
    await db.from('enrollments').delete().eq('id', data.id)
    console.log('cleaned up')
  }
}

main().catch((e) => { console.error('probe error:', e); process.exit(1) })
