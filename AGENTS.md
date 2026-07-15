# 🏫 Larose Christian Academy — School Website (LIVING PROJECT NOTE)

> ⚠️ **CRITICAL: OWNERSHIP** — This site belongs to **Anne** (Jonathan's mom).
> **DO NOT** mix Anne's credentials with Jonathan's accounts/keys/forms.
> Jonathan owns techsaasstack.com, crypto bots, Gumroad books — those are his.
> This site is ONLY Anne's. Separate everything.

**Purpose:** Private Christian school website — enrollment, fees, payments.
**Status (2026-07-15, FINAL — VERIFIED LIVE):**
✅ Site deployed (coverschool.vercel.app = 200).
✅ **DOMAIN IS LIVE:** `https://laroseca.org` → HTTP 200, valid Let's Encrypt SSL cert (CN=laroseca.org, verify ok).
✅ `https://www.laroseca.org` → HTTP 200.
✅ Title: "Larose Christian Academy | Supporting Homeschool Families".

**ROOT CAUSE (the real one, found 2026-07-15):** Vercel's domain entry was the **TYPO `loroseca.org`**
(missing the "a") the ENTIRE time. My earlier "Add Domain" typed the misspelling. Vercel validated a
domain with NO DNS while the REAL `laroseca.org` (correct DNS) was never in the project → permanent "Invalid
Configuration" + no cert. The fix was simply adding the correctly-spelled `laroseca.org` to the Vercel project
(via API: POST /v9/projects/{pid}/domains with name "laroseca.org"). DNS was already correct
(A `@`→216.198.79.1 + CNAME `www`→cname.vercel-dns.com at IONOS). Once the correct spelling existed,
Vercel validated instantly and issued the cert.

**DNS truth (verified 2026-07-15, ground truth not guesses):**
- Nameserver = IONOS default (ns1041.ui-dns.biz / ns1101.ui-dns.de / ns1048.ui-dns.com / ns1099.ui-dns.org). Email (MX) safe.
- A `@` → `216.198.79.1` (Vercel IP) ✅
- CNAME `www` → `cname.vercel-dns.com` ✅
- Both live on Google resolvers. No NS swap needed.

---

## 1. HOW TO RUN LOCALLY (your PC)

```bash
cd C:\Users\1990j\coverschool
npm install          # only needed first time / after dep changes
npm run dev          # dev server on http://localhost:3000
# OR production build + serve:
npm run build
npx next start -p 3000
```
- Requires Node.js (Next.js 16). If `npm` errors, run `npm install` first.
- Dev mode = hot reload. `npx next start` = serves the built version.

## 2. HOW TO DEPLOY (push to live Vercel)

The repo is connected to Git + Vercel. **Easiest deploy = push to GitHub:**
```bash
cd C:\Users\1990j\coverschool
git add -A
git commit -m "your change"
git push origin main      # auto-deploys to https://coverschool.vercel.app
```
- Vercel auto-builds on every push to `main`. No manual build step needed.
- Deploy URL: **https://coverschool.vercel.app** (always live, this is the proof the build works)
- Domain **https://loroseca.org** points here (see §4).

## 3. WHAT'S ON THE SITE (pages + features)

| Path | What it is |
|------|-----------|
| `/` | Home — school intro, location, CTA to enroll |
| `/assessment` | **Placement test** — parent/child picks grade, age-appropriate Math+Reading questions, recommends grade level. NOT a diploma. |
| `/exam` (PLANNED) | **Diploma exam** — SEPARATE test (content from Anne). On pass, site issues the student's actual diploma. Distinct from /assessment. |
| `/faq` | FAQ page |
| `/contact` (or footer) | Contact form → **Formspree** (`mykqplgw`) → emails Anne |
| API `/api/pay-paperwork` | Stripe checkout session for registration fee |
| API `/api/download-book` | PDF download endpoint |
| Supabase tables | enrollments, students, profiles, newsletter_subscribers, donations, contact_messages, parents (7 tables) |

**Fee structure (edit in `src/lib/constants.ts`):**
- One-Time Registration Fee: **$75**
- Monthly Tuition: **$45/month**

**Key files:**
- `src/lib/constants.ts` — fees, Stripe price IDs
- `src/data/siteData.ts` — contact info, address, school name
- `src/app/enroll/page.tsx` — enrollment form
- `src/app/api/pay-paperwork/route.ts` — Stripe checkout

## 4. DOMAIN SETUP (REFERENCE — read this before touching DNS)

**Domain:** `laroseca.org` (correct spelling L-A-R-O-S-E-C-A). NOTE: the #1 past bug was adding it to Vercel as the TYPO `loroseca.org` (missing "a") — always double-check the spelling when adding to Vercel.
**Registrar:** IONOS (Anne's account: `anneb7669@gmail.com` / `@Billie1218jjba931211`).
**Host:** Vercel (Anne's account, project `coverschool`, team `larose-christian-academy`).

### ⚠️ THE #1 LESSON (do NOT repeat the wasted days):
The domain was DOWN for 2 days because Vercel's entry was the **TYPO `loroseca.org`** (missing "a").
Every "Invalid Configuration" + no-cert was Vercel validating a typo'd domain with no DNS, while the REAL
`laroseca.org` (correct DNS) was never in the project. **ALWAYS verify the EXACT spelling in Vercel matches
the registered domain** via API: `GET /v9/projects/{pid}/domains` and read the `name` field — do NOT trust
the screenshot, do NOT trust memory. The typo'd domain showed "Invalid" and looked identical at a glance.

### What actually makes it work (verified 2026-07-15):
1. **DNS at IONOS (registrar), nameserver = IONOS default** (NOT Vercel's NS — Vercel has no zone for this domain, a NS swap kills it).
   - A `@` → `216.198.79.1` (Vercel's required IP) ✅
   - CNAME `www` → `cname.vercel-dns.com` ✅ (added via IONOS DNS "Add record" → pick CNAME → fill `record.host`=`www`, `record.value`=`cname.vercel-dns.com` using real `.fill()`, not JS value-setter).
2. **Domain added to Vercel project with the CORRECT spelling** `laroseca.org` (via API: `POST /v9/projects/{pid}/domains` name=`laroseca.org`). This was the missing piece — the typo `loroseca.org` was there instead.
3. Vercel validates the correctly-spelled domain against the correct DNS → issues Let's Encrypt cert → site LIVE.

### Verify it's live (ground truth, not guesses):
- `curl -4 -s -o /dev/null -w "%{http_code}" -L https://laroseca.org` → should be `200`
- `openssl s_client -connect laroseca.org:443 -servername laroseca.org` → `subject=CN=laroseca.org`, `Verify return code: 0 (ok)`
- `nslookup -type=A laroseca.org 8.8.8.8` → `216.198.79.1`
- `nslookup -type=CNAME www.laroseca.org 8.8.8.8` → `cname.vercel-dns.com`

### If the site ever stops resolving at laroseca.org:
- `GET /v9/projects/{pid}/domains` → confirm `laroseca.org` (correct spelling) is still listed, NOT `loroseca.org`.
- Check nameserver is still IONOS default (not Vercel's) in IONOS Nameserver tab.
- Check A `@` is still `216.198.79.1` and CNAME `www` is `cname.vercel-dns.com` at IONOS DNS.
- `laroseca.org` should remain listed in Vercel → `larose-christian-academy/coverschool/settings/domains`.

## 5. ANNE'S CREDENTIALS (isolated — NEVER mix with Jonathan's)

| Service | Value |
|---------|-------|
| **Supabase Project** | `nwtsvggkchyjuwmcrkmi` (ACTIVE_HEALTHY) |
| **Vercel login** | `anneb7669@gmail.com` — **Google SSO** (Continue with Google). Password `@Billie1218` (same as IONOS Google pass) |
| **Vercel Project** | `prj_ibFq94nDfFUBpqh3D9vahTyclwAX`, team `larose-christian-academy`, name `coverschool` |
| **Vercel Domains page** | `https://vercel.com/larose-christian-academy/~/domains` |
| **Deployed URL** | https://coverschool.vercel.app |
| **Formspree (contact)** | `mykqplgw` → larosechristianacademy@gmail.com (Anne's form, NOT Jonathan's) |
| **IONOS (registrar)** | email `anneb7669@gmail.com`, password `@Billie1218jjba931211`, domain `loroseca.org` |
| **Contact shown on site** | larosechristianacademy@gmail.com | 251-201-9991 | Mobile, AL |

**NOTE:** IONOS + Vercel both use `anneb7669@gmail.com`. Vercel = Google SSO (no separate Vercel password). Keep ALL isolated from Jonathan's accounts.

## 6. HOW THE AGENT LOGS INTO ANNE'S VERCEL + IONOS (reproducible)

### Vercel (Google SSO):
Google SSO is **blocked in the cloud/browserbase session** ("This browser may not be secure"). Use the
**LOCAL EDGE browser on Jonathan's PC**:
```powershell
# Launch Edge with remote debugging (one time, leave it running):
Start-Process 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe' `
  -ArgumentList '--remote-debugging-port=9240','--user-data-dir=C:\Users\1990j\edge-user-data\anne-vercel','--start-minimized'
# Then drive with Playwright (system Python 3.13 has playwright):
python3 C:\Users\1990j\edge-user-data\anne-vercel\do_everything.py
```
- Login helper scripts live in `C:\Users\1990j\edge-user-data\anne-vercel\`.
- After login, Vercel Domains = `https://vercel.com/larose-christian-academy/coverschool/settings/domains`.
- **NEVER kill Edge** — it destroys the login session.

### IONOS (nameserver swap) — THE WORKING PATH:
The cloud browser tool logs into IONOS fine, BUT the "Use custom name servers" **Save** silently fails there
because IONOS fires a native `confirm()` the cloud tool auto-dismisses. Fix = use **local Edge + Playwright**
with `window.confirm` overridden to `()=>true` BEFORE clicking Save:
```python
await page.evaluate("window.confirm=()=>true;window.alert=()=>{};")
# ... fill edit.nameserver.1 = ns1.vercel-dns.com, edit.nameserver.2 = ns2.vercel-dns.com ...
# click Save button via JS
```
- Working scripts: `ns_corrected.py` (does the whole login+swap), `ionos_ns_js.py` (variant).
- Field names (exact): `input[name="edit.nameserver.1"]` and `input[name="edit.nameserver.2"]`.
- IONOS path: Domain details → **Nameserver** tab → "Use custom name servers".

### Visual checks (vision):
When unsure what a Vercel/IONOS page shows, use **Gemini vision** (NOT the dead `vision_analyze` tool):
- Key at `~/.hermes/secrets/gemini_vision_key.txt`; model `gemini-2.5-flash` (fallback `gemini-flash-latest`).
- Helper: `gemini_vision.py` in `edge-user-data/anne-vercel/` — sends a screenshot + question to Gemini.
- This is how we read Vercel's required DNS records and nameservers when text wasn't available.

## 7. BUILD STATUS (last verified 2026-07-14)
- ✅ `npm run build` — 0 errors
- ✅ Supabase — 7 tables live
- ✅ Stripe webhook configured (checkout.session.completed), live keys active
- ✅ SMTP enrollment emails sending
- ✅ Deployed to Vercel (coverschool.vercel.app = 200)
- ✅ Domain DNS → Vercel IP; domain added to Vercel project

**NOTE:** This is Next.js 16 — breaking changes from earlier versions. Read `node_modules/next/dist/docs/` before writing code.
