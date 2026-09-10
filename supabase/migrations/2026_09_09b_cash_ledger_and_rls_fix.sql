-- 2026-09-09 (b): SECURITY FIX + CASH LEDGER
--
-- 🚨 FIX 1 — cash_enroll_tokens leaked to the public.
-- The original policy was `FOR SELECT USING (true)` granted to role {public}, which
-- meant ANY visitor holding the site's public anon key (it ships in the client bundle)
-- could GET /rest/v1/cash_enroll_tokens and read EVERY token. A token IS a free-enrollment
-- link, so this was a free-tuition hole. Verified live before the fix (2 rows readable).
-- All token access happens server-side through the service_role client, so the permissive
-- policy is removed entirely → RLS default-deny for anon/authenticated.
DROP POLICY IF EXISTS "Admins can read all cash tokens" ON cash_enroll_tokens;

-- 🚨 FIX 2 — calendar_events was granted ALL to role {public} with USING (true):
-- anyone could read/modify/delete the school calendar. Access is server-only
-- (src/app/api/calendar-events/route.ts uses the admin client), so scope it to service_role.
DROP POLICY IF EXISTS "service manage events" ON calendar_events;
DROP POLICY IF EXISTS "calendar_events_service_role_all" ON calendar_events;
CREATE POLICY "calendar_events_service_role_all" ON calendar_events
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 📒 CASH LEDGER — a permanent record of EVERY cash payment received, however it was
-- entered (Mom typing it in, or a family completing a token link). This is the school's
-- book of record for cash. RLS locked down with NO public policies at all: only the
-- server (service_role) can read it, and it is surfaced exclusively in the admin panel.
CREATE TABLE IF NOT EXISTS cash_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  receipt_number TEXT,
  parent_first_name TEXT DEFAULT '',
  parent_last_name TEXT DEFAULT '',
  email TEXT NOT NULL,
  phone TEXT DEFAULT '',
  amount_cents INTEGER NOT NULL DEFAULT 0,
  student_count INTEGER NOT NULL DEFAULT 0,
  students JSONB DEFAULT '[]'::jsonb,        -- [{ name, grade }]
  method TEXT NOT NULL DEFAULT 'direct',     -- 'direct' (Mom typed) | 'link' (family self-served)
  family_group_id UUID,
  enrollment_ids JSONB DEFAULT '[]'::jsonb,
  token_id UUID,
  notes TEXT DEFAULT '',
  entered_by TEXT DEFAULT '',                -- admin email, or 'family (link)'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 🔒 NO policies on purpose: anon and authenticated get zero access.
ALTER TABLE cash_payments ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_cash_payments_created ON cash_payments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cash_payments_email ON cash_payments(email);
CREATE UNIQUE INDEX IF NOT EXISTS idx_cash_payments_receipt
  ON cash_payments(receipt_number) WHERE receipt_number IS NOT NULL;
