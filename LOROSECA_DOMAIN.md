# LOROSECA.ORG — Domain Connection: CURRENT STATE & EXACT STEPS

> Living note. Updated 2026-07-15. Verified via read-only `nslookup` + `curl`.

## WHAT IS DONE (verified)
- IONOS nameservers RESET to IONOS default:
  `ns1101.ui-dns.de`, `ns1048.ui-dns.com`, `ns1041.ui-dns.biz`, `ns1099.ui-dns.org`
- Root A record `@` = `216.198.79.1` (Vercel IP) — resolves publicly ✓
- Live site `https://coverschool.vercel.app` = HTTP 200 ✓

## WHAT IS BROKEN (the only remaining blocker)
- `https://laroseca.org` = HTTP 000 (connection fails — Vercel edge has no domain mapping)
- `www.laroseca.org` = no record (missing)

**Root cause:** Vercel's project `prj_ibFq94nDfFUBpqh3D9vahTyclwAX` does NOT have `laroseca.org`
added as a domain. Vercel only serves a domain if it's registered to the project. DNS is correct;
Vercel just doesn't know to answer for this Host.

## THE ONE REMAINING STEP (requires Anne's Vercel login — user's Edge, NOT Browserbase)
Browserbase Google SSO is blocked ("This browser or app may not be secure"). Use the USER'S
live Edge on port 9240 (or their PC) where Anne's session is trusted.

1. Open `https://vercel.com/dashboard` in Anne's logged-in Edge (anneb7669@gmail.com, Google SSO).
2. Project: **Larose Christian Academy** (`prj_ibFq94nDfFUBpqh3D9vahTyclwAX`).
3. **Settings → Domains → Add** `laroseca.org`.
4. Vercel will show it expects:
   - A `@` → `216.198.79.1`  (ALREADY SET at IONOS — leave it)
   - It auto-provisions SSL once the domain is attached.
5. Add `www.laroseca.org` as well (CNAME `www` → `cname.vercel-dns.com`, OR set as a redirect
   to apex in Vercel's domain settings).
6. Wait for Vercel to show "Valid" (DNS already points right, so this is near-instant after attach).
7. Verify: `curl -I https://laroseca.org` → HTTP 200 + valid cert.

## DO NOT REPEAT (lessons from the failed loop)
- IONOS "domain forwarding/parking" URL guess (`/domain-forwarding/laroseca.org`) = 404. Wrong path.
- The A-record revert earlier was IONOS "Default Site" managed service, NOT "forwarding". Resetting
  NS to IONOS default + setting A fixed it. Do NOT re-edit IONOS DNS — it is correct now.
- Do NOT launch a NEW Edge context (collides with running Edge, exitCode 21). Use
  `connect_over_cdp("http://localhost:9240")` to the already-running Edge.
- Vision: NEVER use `vision_analyze` (dead gemma model). Use `vision_read.py` (Gemini key) or
  inline Gemini calls in scripts. Vision works.

## How to run the site (for reference)
- Local: `cd /c/Users/1990j/coverschool && npm run dev` → http://localhost:3000
- Deploy: `vercel deploy --prod` OR push to `main` → auto-deploy from project above.
- Env vars (Vercel project settings): Supabase URL/key, Stripe live keys, SMTP, Formspree.
- DB: Supabase (7 tables). Stripe: $45/mo tuition, $75 reg. SMTP: enrollment emails.
  Formspree: contact form → Anne's inbox.
