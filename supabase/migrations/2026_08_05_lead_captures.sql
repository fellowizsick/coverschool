-- lead_captures: email capture from the state law-guide pages.
-- User directive 2026-08-05: add email capture to /homeschool-law pages so we
-- can follow up with parents who read the guides (conversion, not just traffic).
-- One row per email+state submission. Source tells us which page/placement.
create table if not exists public.lead_captures (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  state_code text not null,
  source text not null default 'homeschool-law',
  created_at timestamptz not null default now(),
  unique (email, state_code, source)
);

-- The LCA site queries this from a server-side API route with the service role
-- key, so no RLS policy is strictly required for reading. But keep it locked by
-- default: only service role (bypasses RLS) can touch it.
alter table public.lead_captures enable row level security;

-- Nobody should be able to read these rows through the anon key.
create policy "lead_captures anon nothing" on public.lead_captures
  for select using (false);

create policy "lead_captures anon no insert" on public.lead_captures
  for insert with check (false);

create index if not exists lead_captures_created_idx on public.lead_captures (created_at desc);
