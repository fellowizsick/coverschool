-- signup_errors: capture failed signup attempts so we can (1) alert Jonathan
-- immediately and (2) email the family an apology + "try again later".
-- User directive 2026-08-05: if anyone tries to sign up and gets an error,
-- Jonathan needs to know immediately; catch their email from the form and
-- send them an apology email.
create table if not exists public.signup_errors (
  id uuid primary key default gen_random_uuid(),
  email text,
  parent_name text,
  student_name text,
  error_message text not null,
  stage text not null default 'enroll',           -- enroll | create-checkout | payment | unknown
  payload jsonb default '{}'::jsonb,
  apology_sent boolean not null default false,
  alert_sent boolean not null default false,
  resolved boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.signup_errors enable row level security;

-- No public read/write; only the service-role API route touches this.
create policy "signup_errors anon nothing" on public.signup_errors
  for select using (false);

create policy "signup_errors anon no insert" on public.signup_errors
  for insert with check (false);

create index if not exists signup_errors_created_idx on public.signup_errors (created_at desc);
