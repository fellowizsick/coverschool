-- Report card snapshot extraction (OCR data from uploaded report card images)
ALTER TABLE public.report_card_snapshots
  ADD COLUMN IF NOT EXISTS extraction_status text NOT NULL DEFAULT 'pending', -- pending | done | failed
  ADD COLUMN IF NOT EXISTS extracted_json jsonb;                             -- parsed subjects/grades/term/gpa
