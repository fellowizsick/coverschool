-- Referral program schema for Larose Christian Academy
-- Adds referral_code / referred_by_code to enrollments, plus referral_credits ledger.

-- 1. Referral code columns on enrollments
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS referral_code text;
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS referred_by_code text;

-- Unique index so lookups by code are fast + safe
CREATE UNIQUE INDEX IF NOT EXISTS enrollments_referral_code_key ON enrollments (referral_code) WHERE referral_code IS NOT NULL;

-- 2. Referral credits ledger
CREATE TABLE IF NOT EXISTS referral_credits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_enrollment_id uuid REFERENCES enrollments(id) ON DELETE CASCADE,
  referred_enrollment_id uuid REFERENCES enrollments(id) ON DELETE CASCADE,
  referrer_email text NOT NULL,
  amount numeric NOT NULL DEFAULT 45,
  status text NOT NULL DEFAULT 'awarded',      -- awarded | applied
  stripe_coupon_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  applied_at timestamptz
);

-- Only one credit per referred enrollment (idempotency guard for webhook retries)
CREATE UNIQUE INDEX IF NOT EXISTS referral_credits_referred_key ON referral_credits (referred_enrollment_id);

-- 3. RLS: parents can read credits awarded to their own email
ALTER TABLE referral_credits ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own referral credits" ON referral_credits;
CREATE POLICY "Users can view own referral credits"
  ON referral_credits
  FOR SELECT
  USING (referrer_email = (SELECT email FROM auth.users WHERE id = auth.uid()));
