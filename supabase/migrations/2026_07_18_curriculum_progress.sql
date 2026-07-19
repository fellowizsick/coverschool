-- curriculum_progress: per-enrolled-child progress so a student resumes
-- exactly where they left off across devices/logins.
-- Keyed by enrollment_id (UUID, matches enrollments.id).

CREATE TABLE IF NOT EXISTS curriculum_progress (
  enrollment_id uuid PRIMARY KEY,
  completed_steps jsonb NOT NULL DEFAULT '[]',
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_curriculum_progress_updated
  ON curriculum_progress (updated_at);

-- The app reads/writes through /api/curriculum-progress which uses the
-- service_role key (bypasses RLS). Enable RLS + a restrictive policy so the
-- public anon key cannot read/modify progress directly from the browser.
ALTER TABLE curriculum_progress ENABLE ROW LEVEL SECURITY;

-- No anon policy = anon key is denied. Server (service_role) is unaffected.
