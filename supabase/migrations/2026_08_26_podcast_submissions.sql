-- LCA Student Podcast Video System — table (idempotent)
-- Run in Supabase SQL Editor. Date 2026-08-26. Owner: Anne. Built by Rinne.
create table if not exists public.podcast_submissions (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.enrollments(id) on delete cascade,
  student_name text not null,
  student_email text not null,
  title text not null default '',
  description text not null default '',
  video_path text not null,
  status text not null default 'pending'
    check (status in ('pending','approved','rejected')),
  consent_ack boolean not null default false,
  duration_seconds int,
  reviewed_by text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists podcast_submissions_status_idx
  on public.podcast_submissions (status, created_at desc);
create index if not exists podcast_submissions_enrollment_idx
  on public.podcast_submissions (enrollment_id);
alter table public.podcast_submissions enable row level security;
