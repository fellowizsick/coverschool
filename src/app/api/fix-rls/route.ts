import { NextResponse } from 'next/server'

// ONE-SHOT FIX: Enable RLS on all Supabase tables
// POST /api/fix-rls
// Deploy, call once, then DELETE THIS FILE.
// Uses SUPABASE_PAT env var set in Vercel.

const SQL_CHECK = `
SELECT c.relname::text AS tablename, c.relrowsecurity AS rls_enabled
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' AND c.relkind = 'r'
  AND c.relname NOT IN ('_prisma_migrations','schema_migrations')
ORDER BY c.relname;
`

const SQL_FIX = `
DO $$
DECLARE
    tbl text;
BEGIN
    FOR tbl IN
        SELECT tablename FROM pg_tables 
        WHERE schemaname = 'public' 
          AND tablename NOT IN ('_prisma_migrations', 'schema_migrations')
    LOOP
        EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', tbl);
    END LOOP;
END $$;
`

export async function POST() {
  const project = process.env.NEXT_PUBLIC_SUPABASE_URL?.match(/https:\/\/(.+)\.supabase/)?.[1]
  if (!project) return NextResponse.json({ error: 'No project ref found' })

  const pat = process.env.SUPABASE_PAT
  if (!pat) return NextResponse.json({ error: 'No SUPABASE_PAT env var set' })

  const apiUrl = `https://api.supabase.com/v1/projects/${project}/database/query`
  const headers = {
    'Authorization': `Bearer ${pat}`,
    'Content-Type': 'application/json',
  }
  
  try {
    // Step 1: Check current RLS status
    const checkRes = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query: SQL_CHECK }),
    })
    
    if (!checkRes.ok) {
      const errText = await checkRes.text()
      return NextResponse.json({ 
        error: 'Check failed', 
        status: checkRes.status, 
        detail: errText.slice(0, 500),
      })
    }
    
    const before = await checkRes.json()
    
    // Step 2: Fix RLS
    const fixRes = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query: SQL_FIX }),
    })
    
    // Step 3: Verify
    const verifyRes = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query: SQL_CHECK }),
    })
    const after = verifyRes.ok ? await verifyRes.json() : null
    
    return NextResponse.json({
      before,
      fix_status: fixRes.status,
      fix_detail: fixRes.ok ? 'OK' : (await fixRes.text()).slice(0, 300),
      after,
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || String(e) })
  }
}
