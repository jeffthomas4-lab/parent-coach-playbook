# Security Audit — ActivityRadar (activityradar.com)

Last updated: 2026-06-27 (full 15-reviewer pass).
Stack: Cloudflare Pages + Astro SSR, D1 `activity-radar`, R2 `activityradar-photos`. No KV.

## 11-point gate

1. **Privacy policy and data home** — FIXED (2026-06-27). `/privacy` page added. `DATA-MAP.md` complete. Policy matches the map: org_claims, org_suggestions, search_events, Cloudflare Web Analytics.

2. **No client-side DB access** — PASS. All D1/R2 access is server-side (SSR Pages Functions + `/api/*` routes). No binding is browser-accessible. No whole-table dump route.

3. **Failure paths** — PASS. Invalid JSON → 400; missing fields → 400; org-not-found → 404; already-claimed → 409; duplicate pending claim → 409; missing event on log-click → 400/404; admin bad token → 401.

4. **Security headers** — PASS. `public/_headers` sets HSTS (2yr preload), X-Content-Type-Options nosniff, X-Frame-Options DENY, Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy, COOP same-origin, CSP with no external font/style CDN (fonts self-hosted via @fontsource). Admin paths: no-store, noindex. Added 2026-06-25, CSP updated 2026-06-27 to remove Google Fonts domains.

5. **OWASP** — PASS. All D1 statements use `.prepare(...).bind(...)`. LIKE queries bind `%q%` as a parameter. Astro auto-escapes template output. New CSP in `_headers`. Token-in-URL for admin noted below.

6. **Server-side validation** — PASS. `/api/claim` and `/api/suggest-org` validate required fields server-side. Emails trimmed/lowercased. Field-length tightening flagged for scale.

7. **No leaked data** — PASS. No secrets in frontend bundle. Errors return generic codes; full errors go to `console.error` only.

8. **No API keys in frontend** — PASS. No paid API is called by any public page route.

9. **Rate limits on paid routes** — PASS (by architecture). No paid API is called by public routes.

10. **Turnstile + CORS** — FIXED (2026-06-27). Turnstile widget added to `/claim` and `/suggest` forms (invisible mode). Server-side verification added to `/api/claim` and `/api/suggest-org` (conditional on `TURNSTILE_SECRET_KEY` being set — skips in dev, enforces in prod). CORS locked to `https://activityradar.com` on all API routes. **Action required: provision `TURNSTILE_SITE_KEY` (in HTML) and `TURNSTILE_SECRET_KEY` (wrangler pages secret) before launch.** Site key placeholder is `0x4AAAAAAA_TURNSTILE_SITE_KEY` in claim.astro and suggest.astro.

11. **Generic errors** — PASS. Users see error codes; SQL/stack stays in server logs.

## Open items (not blocking launch if acted on promptly)

- **MEDIUM** — `admin/gaps.astro` authorizes via `?token=` query param. Token travels in URL, can leak via history/logs/Referer. Recommend moving to Cloudflare Access (Zero Trust email allow) before significant traffic. Auth redesign deferred.
- **ACTION REQUIRED** — Replace `0x4AAAAAAA_TURNSTILE_SITE_KEY` in claim.astro and suggest.astro with the real Cloudflare Turnstile site key. Set `TURNSTILE_SECRET_KEY` as a Pages secret. Without these, Turnstile loads but does not verify (server check skips if no secret).
- **ACTION REQUIRED** — Replace `REPLACE_WITH_BEACON_TOKEN` in Base.astro with the Cloudflare Web Analytics beacon token from the dashboard.

## Session history

| Date | Change |
|------|--------|
| 2026-06-25 | Added `public/_headers` — security headers baseline |
| 2026-06-27 | Removed Google Fonts CDN; self-hosted JetBrains Mono via @fontsource. CORS locked on all API routes. Turnstile widget + server verification added to /claim and /suggest. CSP updated to remove fonts.googleapis.com. |
