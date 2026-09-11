# Larose Christian Academy — Vercel Deployment (2026-09-09)

## CORRECT ACCOUNT
- **Account:** anneb7669@gmail.com (Mom/Anne — "anneb7669-8355"). This is the ONE that owns the live site.
- **Project:** `coverschool` → `prj_ibFq94nDfFUBpqh3D9vahTyclwAX` (the "Larose Christian Academy" project).
- **Domains verified:** `laroseca.org`, `www.laroseca.org`, `coverschool.vercel.app` — all `verified=True`.
- **NOT git-connected** → deploy via Vercel CLI (manual), not git push.

## DEPLOY CREDENTIAL
- Access token created 2026-09-09 via the logged-in Edge (anneb7669 session), scope=account.
- Stored at **`~/.vercel/token.txt`** (Vercel CLI reads it). Value NOT committed to any project file.
- CLI is linked: `vercel link --yes --project coverschool` → `larose-christian-academy/coverschool`.
- `vercel whoami` → `anneb7669-8355`.

## THE WRONG TOKEN (do NOT use for LCA)
- Old `~/.vercel/token.txt` = **mojoe90961@gmail.com** (Dad). It has a *different* `coverschool`
  (prj_QoDzCJ552rQJdcmHyrnWbvr0qSKJ) that only serves `coverschool-eta.vercel.app` — NOT laroseca.org.
  Dad's token returns `not_found` for the real project id. This is the "wrong email" to remove.

## HOW TO DEPLOY (from lca-site/)
```bash
cd lca-site
export VERCEL_TOKEN="$(cat ~/.vercel/token.txt)"   # Mom's token
npx vercel deploy --prod --yes
```
- Supabase + Stripe secrets live in the Vercel project env (pulled automatically at build).
- After deploy, verify: `curl -I https://laroseca.org` → 200.

## TROUBLESHOOTING
- Vercel automated/browser login (vercel login email flow) is blocked by anti-bot — do NOT waste time.
  Use the access-token path above. Token is revocable in `vercel.com/account/tokens`.

## SUPABASE (LCA DB) — how to run migrations (2026-09-09)
- **Supabase project ref:** `nwtsvggkchyjuwmcrkmi` → URL `https://nwtsvggkchyjuwmcrkmi.supabase.co` (region us-east-1)
- **Reliable auth = Supabase Management API Personal Access Token (PAT):**
  `sbp_***REDACTED-SEE-~/.hermes/secrets/lca_supabase_pat.txt***` (also in vault `LCA Website - Full Login & Recovery Guide.md`)
- The agent host CANNOT reach the DB directly (db.<ref> is IPv6-only, no route; PowerShell/pg pooler gives
  "tenant not found"). DO NOT waste time there. Use the Management API `/v1/projects/<ref>/database/query`.
- Run raw SQL via: `POST https://api.supabase.com/v1/projects/<ref>/database/query` with `Authorization: Bearer <PAT>`
  body `{"query":"<sql>"}`. Verify with `information_schema.tables` / `columns` queries.
- Migration file: `supabase/migrations/2026_09_09_cash_enrollment.sql` (cash_enroll_tokens table +
  enrollments columns payment_method/amount_paid_cents/cash_receipt_number/cash_receipt_sent_at +
  payment_status now allows 'cash'). APPLIED 2026-09-09.
- Optionally the `supabase link --project-ref <ref> --password "<sb_secret_KEY>"` may work for CLI db push,
  but the Management API query endpoint is the reliable path.

## CASH-ENROLLMENT FEATURE (2026-09-09, live + verified)
- Mom/Batman-only pages/APIs (gated by isAuthorizedAdmin; dashboard layout redirects students/parents out).
- `/api/admin-cash-token` POST (admin generates token+link) + `/list` GET (view tokens).
- `/enroll/cash?token=` public form (family fills info, NO card, no pricing shown).
- `/api/cash-enroll/validate` GET (checks token) + `/api/cash-enroll` POST (records cash enrollment,
  marks token used, emails receipt via `sendCashReceiptEmail` in email.ts).
- DB: cash_enroll_tokens table + enrollments.cash_* columns. Verified end-to-end (validate->enroll->rows
  cash/approved/$360/3 students->token used->receipt email to clarkvictoria624).
- Cash is LOCAL-ONLY: a family only gets a cash link when Mom generates it; never advertised on the public site.
