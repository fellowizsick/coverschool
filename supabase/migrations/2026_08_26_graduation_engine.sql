-- LCA Graduation Engine — schema (idempotent)
-- Run in Supabase SQL Editor. Matches supabase/migrations/*.sql convention.
-- Date: 2026-08-26. Owner: Anne. Built by Rinne at Jonathan's direction.

-- 1) graduation_requirements: the school's diploma requirements (config, editable)
create table if not exists public.graduation_requirements (
  id uuid primary key default gen_random_uuid(),
  subject text not null,
  required_credits numeric not null default 0,
  display_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2) student_credits: the per-student credit ledger
create table if not exists public.student_credits (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.enrollments(id) on delete cascade,
  subject text not null,
  course_name text not null,
  credits numeric not null default 0,
  source text not null default 'lca'
    check (source in ('lca','transfer','dual_credit','prior_learning','testing')),
  verification_status text not null default 'verified'
    check (verification_status in ('verified','pending','rejected')),
  earned_date date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists student_credits_enrollment_idx
  on public.student_credits (enrollment_id);

-- 3) enrollments: graduation status columns
alter table public.enrollments
  add column if not exists graduation_status text not null default 'in_progress';
alter table public.enrollments
  add column if not exists graduation_date date;
alter table public.enrollments
  add column if not exists graduated_at timestamptz;

do $$ begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'enrollments_graduation_status_check'
  ) then
    alter table public.enrollments
      add constraint enrollments_graduation_status_check
      check (graduation_status in ('in_progress','complete','graduated'));
  end if;
end $$;

-- 4) diplomas: issued diploma record + attestation
create table if not exists public.diplomas (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.enrollments(id) on delete cascade,
  student_name text not null,
  graduation_date date not null,
  diploma_number text not null,
  attested_by text,
  attested_at timestamptz,
  format text not null default 'digital'
    check (format in ('digital','digital_plus_paper')),
  email_sent_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists diplomas_enrollment_idx
  on public.diplomas (enrollment_id);

-- 5) RLS: admin routes use the service_role key (bypasses RLS). Enable RLS so
--    anon/parent clients can never touch these by default.
alter table public.graduation_requirements enable row level security;
alter table public.student_credits enable row level security;
alter table public.diplomas enable row level security;

-- 6) Seed default requirements (EDITABLE — Anne should set LCA's real plan).
--    Standard HS diploma credit plan (24 credits). Only if empty.
insert into public.graduation_requirements (subject, required_credits, display_order)
select t.subject, t.credits, t.ord
from (values
  ('English', 4.0, 1),
  ('Mathematics', 3.0, 2),
  ('Science', 3.0, 3),
  ('Social Studies', 3.0, 4),
  ('Foreign Language', 2.0, 5),
  ('Fine Arts', 1.0, 6),
  ('Health / Physical Education', 1.0, 7),
  ('Electives', 6.0, 8)
) as t(subject, credits, ord)
where not exists (select 1 from public.graduation_requirements);
