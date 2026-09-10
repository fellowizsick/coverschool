-- 2026-09-10: paid / not-paid tracking on enrollments
--
-- Jonathan: "They all need to have like paid and not paid next to them and like green and red…
-- we need to be able to click it… so if somebody does pay cash, we can just approve them right
-- there."
--
-- Two audit columns so every status flip is traceable — this changes MONEY state, so we record
-- who did it and when. Nothing else about the table changes; RLS is untouched.

ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS payment_status_updated_at TIMESTAMPTZ;
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS payment_status_updated_by TEXT DEFAULT '';

-- fast lookup for the roster's paid/unpaid grouping
CREATE INDEX IF NOT EXISTS idx_enrollments_payment_status ON enrollments(payment_status);
