-- attendance: daily school-day log per student. One row per student per day
-- (unique enrollment_id + date). Parents log days (and optionally hours) in the
-- parent portal; the school keeps the record as legal proof of instruction.
-- User directive 2026-08-05: build real attendance + gradebook tracking.
create table if not exists public.attendance (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.enrollments(id) on delete cascade,
  date date not null,
  hours numeric(4,1) not null default 0 check (hours >= 0 and hours <= 24),
  note text,
  created_by uuid,
  created_at timestamptz not null default now(),
  unique (enrollment_id, date)
);

-- gradebook_entries: per-student, per-subject assignment grades.
-- Parent adds assignments (e.g. "Ch 4 Test 92%") through the year; the school
-- computes per-subject averages and the transcript/report-card GPA.
create table if not exists public.gradebook_entries (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.enrollments(id) on delete cascade,
  subject_name text not null,
  assignment_name text not null,
  grade numeric(5,1) not null check (grade >= 0 and grade <= 100),
  date date not null default current_date,
  notes text,
  created_by uuid,
  created_at timestamptz not null default now()
);

-- RLS: rows belong to the enrollment's family. Public/anon can't touch anything;
-- the server reads via the family's session email or admin client.
alter table public.attendance enable row level security;
alter table public.gradebook_entries enable row level security;

create policy "attendance anon nothing" on public.attendance
  for select using (false);
create policy "attendance anon no write" on public.attendance
  for all using (false) with check (false);

create policy "gradebook anon nothing" on public.gradebook_entries
  for select using (false);
create policy "gradebook anon no write" on public.gradebook_entries
  for all using (false) with check (false);

create index if not exists attendance_enrollment_idx on public.attendance (enrollment_id, date desc);
create index if not exists gradebook_enrollment_idx on public.gradebook_entries (enrollment_id, subject_name, date desc);
