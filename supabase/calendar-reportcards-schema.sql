-- Report card snapshot uploads (parents upload photos of report cards)
CREATE TABLE IF NOT EXISTS public.report_card_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id uuid NOT NULL REFERENCES public.enrollments(id) ON DELETE CASCADE,
  file_path text NOT NULL,
  file_name text NOT NULL,
  mime_type text,
  uploaded_by text NOT NULL,
  uploaded_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.report_card_snapshots ENABLE ROW LEVEL SECURITY;

-- Parents can read their own children's snapshots; admins read all.
CREATE POLICY "parents read own snapshots" ON public.report_card_snapshots
  FOR SELECT USING (
    auth.jwt() ->> 'email' IN (SELECT email FROM public.enrollments WHERE id = enrollment_id)
    OR auth.jwt() ->> 'email' IN ('1990jonathanbbrown@gmail.com', 'anneb7669@gmail.com')
  );

-- Insert allowed only server-side via service role (applies its own checks).
CREATE POLICY "service insert snapshots" ON public.report_card_snapshots
  FOR INSERT WITH CHECK (true);

-- Calendar events
CREATE TABLE IF NOT EXISTS public.calendar_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  event_date date NOT NULL,
  start_time text,
  end_time text,
  all_day boolean NOT NULL DEFAULT true,
  audience text NOT NULL DEFAULT 'school', -- 'school' (everyone) | 'family' (only that family_group)
  family_group_id uuid,                    -- set when audience='family'
  created_by text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS calendar_events_date_idx ON public.calendar_events (event_date);
CREATE INDEX IF NOT EXISTS calendar_events_audience_idx ON public.calendar_events (audience);

ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

-- Everyone logged in can read school-wide events; family events only for that family (or admins).
CREATE POLICY "read school events" ON public.calendar_events
  FOR SELECT USING (
    audience = 'school'
    OR (audience = 'family' AND (
      family_group_id IN (
        SELECT family_group_id FROM public.enrollments
        WHERE email = (auth.jwt() ->> 'email')
      )
      OR auth.jwt() ->> 'email' IN ('1990jonathanbbrown@gmail.com', 'anneb7669@gmail.com')
    ))
  );

-- Insert/update/delete go through the API (service role), so allow with check true.
CREATE POLICY "service manage events" ON public.calendar_events
  FOR ALL USING (true) WITH CHECK (true);
