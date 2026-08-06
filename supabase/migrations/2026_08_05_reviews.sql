-- reviews: real reviews from enrolled families, shown in the homepage
-- testimonial rotation alongside the site's existing testimonials.
-- User directive 2026-08-05:
--   * families who signed up can leave a review
--   * new reviews auto-add to the rotation
--   * only good, respectful comments are published (moderation filter)
--   * no bad/inappropriate ones
--
-- Flow: parent submits via /api/reviews (server-gated to approved enrollments).
-- Server runs a respect/positivity filter. If it passes -> status='approved'
-- (appears in rotation immediately). If it trips the filter -> status='held'
-- (excluded from public rotation; admin can review later).
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  author_name text not null default 'LCA Family',
  quote text not null,
  role text not null default 'Homeschool Parent',
  rating integer not null default 5 check (rating between 1 and 5),
  -- which enrolled family wrote it (dedupe: one review per enrollment)
  enrollment_id uuid unique references public.enrollments(id) on delete cascade,
  email text,
  status text not null default 'approved' check (status in ('approved', 'held')),
  created_at timestamptz not null default now()
);

alter table public.reviews enable row level security;

-- Public: anyone can READ approved reviews (needed for homepage rotation)
create policy "reviews public read approved" on public.reviews
  for select using (status = 'approved');

-- No anonymous inserts; writes go through the service-role API route only.
create policy "reviews anon no insert" on public.reviews
  for insert with check (false);

create index if not exists reviews_approved_idx on public.reviews (status, created_at desc);
