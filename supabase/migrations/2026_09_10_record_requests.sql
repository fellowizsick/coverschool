-- 2026-09-10: STUDENT RECORDS REQUESTS
--
-- Records move BOTH WAYS and every request is tied to the right child:
--   direction = 'incoming'  → a parent / school / district asks US for records
--   direction = 'outgoing'  → we ask a previous school for a transferring-in student's records
--
-- 🔒 NO PUBLIC POLICIES ON PURPOSE. Same posture as cash_payments: submissions arrive
-- through a server-side API route using the service_role key, and the data is surfaced
-- EXCLUSIVELY in Jonathan's + Mom's admin dashboard (src/lib/adminAccess.ts).
-- Anon and authenticated roles get zero access — do not add a `USING (true)` policy here.
-- (A permissive policy on a table like this would expose children's names, DOBs and
-- record requests to anyone holding the public anon key. That exact mistake leaked
-- cash_enroll_tokens on 2026-09-09.)

CREATE TABLE IF NOT EXISTS record_requests (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- ── which direction the records move ──────────────────────────────────────
  direction           TEXT NOT NULL DEFAULT 'incoming',   -- 'incoming' | 'outgoing'
  status              TEXT NOT NULL DEFAULT 'new',         -- new | in_progress | sent | received | completed | denied

  -- ── the child this request belongs to (the whole point) ───────────────────
  enrollment_id       UUID REFERENCES enrollments(id) ON DELETE SET NULL,
  linked_at           TIMESTAMPTZ,                          -- when it was matched to a child
  linked_by           TEXT DEFAULT '',                      -- admin email, or 'auto'

  -- student exactly as submitted — kept for the record AND used to match
  student_first_name  TEXT DEFAULT '',
  student_last_name   TEXT DEFAULT '',
  student_dob         DATE,
  student_grade       TEXT DEFAULT '',

  -- ── who is asking ─────────────────────────────────────────────────────────
  requester_type      TEXT DEFAULT 'parent',   -- 'parent' | 'school' | 'district' | 'other'
  requester_name      TEXT DEFAULT '',
  requester_email     TEXT DEFAULT '',
  requester_phone     TEXT DEFAULT '',
  requester_org       TEXT DEFAULT '',         -- school / district name
  requester_address   TEXT DEFAULT '',

  -- ── what they want ────────────────────────────────────────────────────────
  records_requested   JSONB DEFAULT '[]'::jsonb,   -- ['academic_transcript','report_cards','immunization','attendance','diploma']
  other_records       TEXT DEFAULT '',
  delivery_method     TEXT DEFAULT 'email',        -- 'email' | 'mail' | 'fax' | 'pickup'
  delivery_detail     TEXT DEFAULT '',
  reason              TEXT DEFAULT '',

  -- ── authorization (release signature) ─────────────────────────────────────
  authorization_name  TEXT DEFAULT '',
  authorized_at       TIMESTAMPTZ,

  -- ── workflow ──────────────────────────────────────────────────────────────
  notes               TEXT DEFAULT '',             -- what the requester typed
  staff_notes         TEXT DEFAULT '',             -- Mom's internal notes
  fulfilled_at        TIMESTAMPTZ,
  fulfilled_by        TEXT DEFAULT '',

  -- ── documents sent / received (file refs, never card or payment data) ─────
  attachments         JSONB DEFAULT '[]'::jsonb,   -- [{ name, url, kind, added_at }]

  -- ── generated link, when the school SENDS the form out ────────────────────
  token               TEXT UNIQUE,
  token_expires_at    TIMESTAMPTZ,
  used_at             TIMESTAMPTZ,
  sent_to             TEXT DEFAULT '',             -- who the link was emailed to

  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 🔒 No policies on purpose: anon + authenticated get zero access.
ALTER TABLE record_requests ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_record_requests_created    ON record_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_record_requests_status     ON record_requests(status);
CREATE INDEX IF NOT EXISTS idx_record_requests_direction  ON record_requests(direction);
CREATE INDEX IF NOT EXISTS idx_record_requests_enrollment ON record_requests(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_record_requests_dob        ON record_requests(student_last_name, student_dob);
CREATE UNIQUE INDEX IF NOT EXISTS idx_record_requests_token ON record_requests(token) WHERE token IS NOT NULL;
