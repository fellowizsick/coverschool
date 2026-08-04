-- 2026-08-03: Per-child removal support.
-- The original constraints were created before cancellation existed, which made
-- the Cancel Membership button AND per-child removal silently fail (500/400).
ALTER TABLE enrollments DROP CONSTRAINT IF EXISTS enrollments_payment_status_check;
ALTER TABLE enrollments ADD CONSTRAINT enrollments_payment_status_check
  CHECK (payment_status = ANY (ARRAY['pending','paid','refunded','cancelled']));
ALTER TABLE enrollments DROP CONSTRAINT IF EXISTS enrollments_status_check;
ALTER TABLE enrollments ADD CONSTRAINT enrollments_status_check
  CHECK (status = ANY (ARRAY['pending','approved','rejected','cancelled']));
ALTER TABLE students DROP CONSTRAINT IF EXISTS students_status_check;
ALTER TABLE students ADD CONSTRAINT students_status_check
  CHECK (status = ANY (ARRAY['active','withdrawn','graduated','inactive']));
