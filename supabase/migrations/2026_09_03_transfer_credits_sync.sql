-- 2026-09-03: Auto-pull parents' transfer grades into the graduation credit ledger.
-- Adds a link column so each auto-created student_credit tracks which transfer_grades
-- row it came from. This makes the sync IDEMPOTENT (no duplicates on re-save) and lets
-- the school verify/edit a credit without it being overwritten on the next sync.
ALTER TABLE public.student_credits
  ADD COLUMN IF NOT EXISTS transfer_grade_id uuid REFERENCES public.transfer_grades(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS student_credits_transfer_grade_idx
  ON public.student_credits (transfer_grade_id);
