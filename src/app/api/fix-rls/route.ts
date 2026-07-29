import { NextResponse } from 'next/server'

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

  // Extract project ref from Supabase URL
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const projectRef = supabaseUrl.match(/https:\/\/(.+)\.supabase/)?.[1]
  const pat = process.env.SUPABASE_PAT

  if (!projectRef) {
    return NextResponse.json({ error: 'Could not extract project ref from SUPABASE_URL' })
  }
  if (!pat) {
    return NextResponse.json({ error: 'SUPABASE_PAT not set — need an sbp_ token from Supabase Account → Access Tokens' })
  }

  const apiUrl = `https://api.supabase.com/v1/projects/${projectRef}/database/query`

  try {
    // Step 1: Check current RLS state
    results.push(`Project ref: ${projectRef}`)
    results.push('--- Checking current RLS state ---')

    const checkRes = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${pat}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: CHECK_SQL }),
    })

    const checkData = await checkRes.json()
    if (!checkRes.ok) {
      results.push(`Check failed: ${JSON.stringify(checkData)}`)
      return NextResponse.json({ results, status: 'check_failed' })
    }

    // Parse and report which tables need fixing
    const tables: Array<{ tablename: string; rls_enabled: boolean }> = checkData
    const disabled = tables.filter(t => !t.rls_enabled)
    results.push(`Tables found: ${tables.length}`)
    results.push(`RLS already on: ${tables.filter(t => t.rls_enabled).length}`)
    results.push(`RLS disabled: ${disabled.length}`)
    for (const t of disabled) {
      results.push(`  ❌ ${t.tablename} — RLS OFF`)
    }

    if (disabled.length === 0) {
      results.push('✅ All tables already have RLS enabled. Nothing to do.')
      return NextResponse.json({ results, status: 'already_ok' })
    }

    // Step 2: Enable RLS on all tables
    results.push('--- Enabling RLS on all tables ---')

    const fixRes = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${pat}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: RLS_SQL }),
    })

    const fixData = await fixRes.json()
    if (!fixRes.ok) {
      results.push(`Fix failed: ${JSON.stringify(fixData)}`)
      return NextResponse.json({ results, status: 'fix_failed' })
    }

    results.push('✅ RLS enabled on all tables')

    // Step 3: Verify
    results.push('--- Verifying ---')
    const verifyRes = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${pat}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: CHECK_SQL }),
    })

    const verifyData = await verifyRes.json()
    if (verifyRes.ok) {
      const stillOff = verifyData.filter((t: any) => !t.rls_enabled)
      if (stillOff.length === 0) {
        results.push('✅ VERIFIED — all tables have RLS enabled')
      } else {
        results.push(`⚠️ ${stillOff.length} tables still disabled: ${stillOff.map((t: any) => t.tablename).join(', ')}`)
      }
    }

  } catch (err: any) {
    results.push(`Error: ${err.message}`)
  }

  return NextResponse.json({ results })
}
