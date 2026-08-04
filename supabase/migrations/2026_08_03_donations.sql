-- 2026-08-03: Donations + registration fee in first payment.
-- New donations table for the /donate page (any amount, same Stripe account).
CREATE TABLE IF NOT EXISTS donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  amount_cents integer NOT NULL,
  email text,
  name text,
  message text,
  stripe_session_id text,
  stripe_payment_intent text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);
