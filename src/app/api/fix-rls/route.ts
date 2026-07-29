import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const RLS_SQL = `
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

const CHECK_SQL = `
SELECT c.relname::text AS tablename, c.relrowsecurity AS rls_enabled
FROM pg_class c
JOIN pg_namespace n ON n.oid=c.relnamespace
WHERE n.nspname='public' AND c.relkind='r'
  AND c.relname NOT IN ('_prisma_migrations','schema_migrations')
ORDER BY c.relname;
`

export async function GET() {
  const results: string[] = []
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const projectRef = supabaseUrl.match(/https:\/\/(.+)\.supabase/)?.[1]
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!projectRef) return NextResponse.json({ error: 'No project ref' })
  if (!serviceKey) return NextResponse.json({ error: 'No service role key' })

  // Connect to the database using the service_role JWT as the password
  const pool = new Pool({
    host: `db.${projectRef}.supabase.co`,
    port: 5432,
    user: 'postgres',
    password: serviceKey,
    database: 'postgres',
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  })

  try {
    // Step 1: Check current state
    results.push(`Project: ${projectRef}`)
    results.push('--- Checking RLS state ---')
    const checkRes = await pool.query(CHECK_SQL)
    const rows = checkRes.rows
    const disabled = rows.filter((r: any) => !r.rls_enabled)
    results.push(`Tables: ${rows.length}, RLS on: ${rows.length - disabled.length}, RLS off: ${disabled.length}`)
    for (const r of rows) {
      results.push(`  ${(r as any).rls_enabled ? '✅' : '❌'} ${(r as any).tablename}`)
    }

    if (disabled.length === 0) {
      results.push('✅ All good already')
      await pool.end()
      return NextResponse.json({ results })
    }

    // Step 2: Enable RLS
    results.push('--- Enabling RLS ---')
    await pool.query(RLS_SQL)
    results.push('✅ RLS SQL ran')

    // Step 3: Verify
    const verifyRes = await pool.query(CHECK_SQL)
    const stillOff = verifyRes.rows.filter((r: any) => !r.rls_enabled)
    if (stillOff.length === 0) {
      results.push('✅ VERIFIED — all tables RLS enabled')
    } else {
      results.push(`⚠️ ${stillOff.length} still off: ${stillOff.map((r: any) => (r as any).tablename).join(', ')}`)
    }

  } catch (err: any) {
    results.push(`Error: ${err.message}`)
  } finally {
    await pool.end()
  }

  return NextResponse.json({ results })
}
