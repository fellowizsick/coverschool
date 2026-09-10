-- 2026-09-09: CASH ENROLLMENT (local-only, token-gated) + digital receipt.
-- Cash is NOT advertised on the public site. A family only gets a cash-enrollment
-- link when Mom generates one from her dashboard (a token row). The link skips the
-- card/checkout step, records the cash payment, and emails a receipt.

-- 1) enrollments: record HOW the payment was made + how much (for cash receipts).
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'card';
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS amount_paid_cents INTEGER;
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS cash_receipt_number TEXT;
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS cash_receipt_sent_at TIMESTAMPTZ;

-- Add 'cash' to the allowed payment_status values (Stripe rows stay 'paid'/'pending').
ALTER TABLE enrollments DROP CONSTRAINT IF EXISTS enrollments_payment_status_check;
ALTER TABLE enrollments ADD CONSTRAINT enrollments_payment_status_check
  CHECK (payment_status = ANY (ARRAY['pending','paid','refunded','cancelled','cash']));

-- 2) cash_enroll_tokens: Mom generates a token; only that token lets a family
--    enroll WITHOUT a card. Pre-authorizes the family info (amount, student count).
CREATE TABLE IF NOT EXISTS cash_enroll_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  token TEXT UNIQUE NOT NULL,               -- the unguessable token in the link
  email TEXT NOT NULL,                     -- the parent email (receipt goes here)
  amount_paid_cents INTEGER NOT NULL,      -- total cash collected
  student_count INTEGER NOT NULL DEFAULT 1,
  notes TEXT DEFAULT '',                   -- e.g. "3 students, Victoria Clark"
  created_by TEXT DEFAULT '',              -- admin email who generated it
  created_at TIMESTAMPTZ DEFAULT NOW(),
  used_at TIMESTAMPTZ,                     -- set once the family completes enrollment
  expires_at TIMESTAMPTZ                   -- optional TTL; NULL = never
);

ALTER TABLE cash_enroll_tokens ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_cash_tokens_token ON cash_enroll_tokens(token);
CREATE INDEX IF NOT EXISTS idx_cash_tokens_email ON cash_enroll_tokens(email);

-- Admins can read/insert tokens (service_role bypasses RLS anyway for the API).
CREATE POLICY "Admins can read all cash tokens" ON cash_enroll_tokens
  FOR SELECT USING (true);
