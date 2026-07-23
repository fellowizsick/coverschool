// @ts-nocheck
// ONE-SHOT MIGRATION: Add ssn_last_four column to enrollments table
// RUN ONCE, then DELETE this file
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = createAdminClient()
    
    // Check if column exists by trying to select it
    const { data, error } = await supabase
      .from('enrollments')
      .select('ssn_last_four')
      .limit(1)
    
    if (!error) {
      return NextResponse.json({ message: '✅ MIGRATED - ssn_last_four column exists' })
    }
    
    return NextResponse.json({ 
      error: 'Column not found', 
      details: error?.message,
      hint: 'Run ALTER TABLE via Supabase dashboard SQL editor: ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS ssn_last_four varchar(4);'
    }, { status: 500 })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
