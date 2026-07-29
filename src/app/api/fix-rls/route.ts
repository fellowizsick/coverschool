import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function GET() {
  const results: string[] = []

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { cookies: { getAll() { return [] }, setAll() {} } }
    )

    // Try supabase.sql() if available (v2.1+)
    const sql = `
      DO $$ 
      DECLARE tbl text; 
      BEGIN
        FOR tbl IN SELECT tablename FROM pg_tables 
          WHERE schemaname = 'public' 
            AND tablename NOT IN ('_prisma_migrations','schema_migrations')
        LOOP
          EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', tbl);
        END LOOP;
      END $$;
    `

    // @ts-ignore - sql() might not be in types
    if (typeof (supabase as any).sql === 'function') {
      const { error } = await (supabase as any).sql(sql)
      if (error) results.push(`sql() error: ${error.message}`)
      else results.push('RLS enabled via sql()')
    } else {
      results.push('sql() not available')
    }

    // Fallback: try REST API with raw query
    const { data, error: rpcErr } = await supabase.rpc('exec_sql', { query_text: sql })
    if (rpcErr) results.push(`rpc error: ${rpcErr.message}`)
    else results.push('RLS enabled via rpc')

  } catch (err: any) {
    results.push(`Error: ${err.message}`)
  }

  return NextResponse.json({ results })
}
