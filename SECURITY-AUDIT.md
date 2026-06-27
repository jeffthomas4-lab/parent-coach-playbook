# Security Audit — parent-coach-desk (parentcoachdesk.com)

Date: 2026-06-25
Stack: Cloudflare Pages + Astro SSR (Cloudflare adapter), D1, R2.
Data home: D1 `activity-radar` (database_id 8cc3694a-26f8-4a56-b131-d5d3a68c49ef, shared with ActivityRadar) holds organizations, programs, camp_claims, camp_reviews, submitters, search_events, geocoded_addresses, domain_quality. R2 `activityradar-photos` holds org logos and program photos. No KV.

## Critical / High findings
None. This repo is in good shape. The admin surface is gated by Cloudflare Access + an email allowlist + a same-origin (CSRF) check, every D1 query is parameterized, and error responses are generic.

## Medium / Low findings (flagged, not changed)
- LOW — admin-auth.ts decodes the Cloudflare Access JWT without verifying its signature (it trusts that only CF Access can mint the `CF_Authorization` cookie for the domain). The code already flags this as a phase-2 hardening item: verify against the Access JWKS. Acceptable while the route sits behind an Access policy. Do not ship admin routes without the Access policy actually attached in the Cloudflare dashboard.
- LOW — `BULK_IMPORT_TOKEN` in `/api/camps/submit` is compared with plain `===` (not constant-time). It auto-approves listings, not money or PII, so impact is low. Fine to leave.

## 11-point gate
1. Privacy policy — PASS. `/disclosure/` is the "privacy and disclosure page" (linked from `/terms/`); states what data is collected and how the site is funded. Data lives in D1 `activity-radar` + R2 `activityradar-photos`.
2. No client-side DB access — PASS. All D1/R2 access is server-side (Astro SSR + API routes). Admin pages and `/api/admin/*` call `requireAdmin` (CF Access email vs `ADMIN_EMAILS` allowlist). Row-returning public routes scope by slug/id; no whole-table dump is exposed to the public.
3. Failure paths — PASS. Duplicate-email submitter handled via upsert; existing-claim and already-claimed states return clean 400/409; invalid JSON/missing fields return 400; tampered/expired admin cookie returns 401/403; honeypot short-circuits bot submits to 200.
4. Security headers — PASS (already present). `public/_headers` sets HSTS, X-Content-Type-Options nosniff, X-Frame-Options DENY, Referrer-Policy, Permissions-Policy, COOP, and a hashed Content-Security-Policy. Admin paths set `no-store` + noindex.
5. OWASP (injection/XSS/auth) — PASS. Every D1 statement uses `.prepare(...).bind(...)`. The one dynamic SQL builder (`updateCamp`) assembles only fixed, allowlisted column names — values stay bound. CSP + Astro auto-escaping cover XSS. Auth via CF Access + allowlist.
6. Server-side validation — PASS. `/api/camps/submit` and `/api/admin/camps/[id]/update` validate types, integer/date formats, enums, length bounds, age ranges, and email format server-side, independent of any client JS.
7. No leaks — PASS. No secrets in the frontend bundle; API responses return scoped fields; full errors go to `console.error` server logs only.
8. No API keys in frontend — PASS. No third-party API keys; Nominatim geocoding needs none. `BULK_IMPORT_TOKEN`/`CRON_KEY` are server-side env/secrets.
9. Rate limits on paid routes — N/A / WAIVED. No paid third-party API is called from a public route. Geocoding (free Nominatim) is cached in D1 and only runs on submit/admin-edit. Cron route is key-gated. If a paid API is ever added, add a limiter (flag).
10. Turnstile + CORS — PARTIAL. CORS: PASS — no route emits `Access-Control-Allow-Origin`, and admin/mutating POSTs enforce same-origin via `requireSameOrigin`. Turnstile: WAIVED — public forms rely on a honeypot today; adding a Turnstile widget needs site keys and is out of scope for this safe-fix pass. Recommend adding before launch.
11. Generic errors to user — PASS. Client sees `{ ok:false, error:'forbidden' }`-style generic messages; SQL/stack stays in server logs.

## Changes made this session
None. No code changes were needed in this repo.
