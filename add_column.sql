ALTER TABLE church_enrollment_forms ADD COLUMN IF NOT EXISTS parent_email TEXT;
ALTER TABLE church_enrollment_forms ADD COLUMN IF NOT EXISTS church_form_status TEXT DEFAULT 'submitted';
