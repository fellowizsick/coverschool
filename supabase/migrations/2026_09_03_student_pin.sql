-- 2026-09-03: Student podcast access-code login.
-- Adds a nullable 4-digit PIN per enrollment so a STUDENT (child) can log in
-- on their own to record/submit a podcast — WITHOUT needing the family account
-- and WITHOUT creating per-student auth users.
-- PINs are generated/issued by the school (admin) and are optional; the
-- parent/family account flow is completely unchanged.
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS student_pin TEXT;
