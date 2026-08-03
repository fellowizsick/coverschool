-- Multi-child enrollment: group sibling enrollment rows under one family submission.
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS family_group_id uuid;
CREATE INDEX IF NOT EXISTS idx_enrollments_family_group ON enrollments(family_group_id);
