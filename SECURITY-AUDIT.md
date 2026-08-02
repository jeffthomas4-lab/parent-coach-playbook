# Security Audit — parent-coach-desk (parentcoachdesk.com)

> **Current-state authority (2026-07-31):** This file was rewritten in full this pass. Prior dated sections below (2026-06-27 through 2026-07-22) are kept as history under "Session log" at the bottom; the sections above that are the current state as of 2026-07-31 and supersede any earlier claim they touch.

Date: 2026-07-31 (Pillar 1 full re-run, `audit/full-standard-2026-07-30` branch)
Current stack: Cloudflare Worker `parent-coach-desk` (production) + `parent-coach-desk-staging` (staging), Astro 7 SSR (Cloudflare adapter), D1 (`activity-radar` / `DB`, `parent-coach-desk-ops-production` / `PCD_OPS_DB`, `forge-command` / `FORGE_DB`), R2 (`activityradar-photos`), KV (`SESSION`, `CONTENT_OVERLAY`), 6 Cloudflare rate-limit bindings. The retained Pages project (`parent-coach-playbook`) is historical, not the production origin — see open item #17-carryover below on its still-live anonymous admin surface.
Data home: see `DATA-MAP.md` and `CONTACT-DATA-MAP.md` for the full picture. Summary: `activity-radar` D1 holds the directory graph (organizations, programs, camp_claims, camp_reviews, submitters, search_events, org_claims, org_suggestions) and syndicates to SightSmash. `PCD_OPS_DB` is the PII/operational home (customer identity, trust cases, `org_contacts`) and never syndicates. R2 `activityradar-photos` holds org logos/program photos.

## 1. Secrets inventory

Every secret this site depends on, where it lives, and its last-rotated date. A blank or "unknown" rotation date is itself an open finding per this pillar's rotation rule (once a year minimum, immediately on any leak).

| Secret | Where it lives | Last rotated | Status |
|---|---|---|---|
| `RESEND_API_KEY` | Cloudflare Worker secret (`parent-coach-desk` production) | **2026-07-18**, confirmed — old leaked "PCD" key deleted in Resend, new key created, secret re-set, confirmed by Jeff | OK, within a year |
| `CRON_KEY` | Cloudflare Worker secret + GitHub Actions repo secret (break-glass `workflow_dispatch` only; native `worker-cron` Cron Trigger is the live scheduler now) | Rotated 2026-07-17/18 (fresh value generated, set commands handed to Jeff) | OK if Jeff ran the `gh secret set` command — **needs Jeff to confirm** the GitHub Actions copy matches the Worker copy, since no session can read either value back |
| `BULK_IMPORT_TOKEN` | Cloudflare Worker/Pages secret | Unknown — never confirmed set or rotated | **OPEN, MEDIUM.** No route auto-approves on this token anymore (2026-07-16 fix removed every auto-approve path), so the blast radius if leaked is low, but the rotation date is still unknown. Jeff should confirm it is still needed at all; if not, delete it rather than rotate it. |
| `ADMIN_EMAILS` | Plaintext var in `wrangler.production.jsonc` (allowlist, not a credential) | N/A | Correctly a var, not a secret. No action needed. |
| `ACCESS_TEAM_DOMAIN` / `ACCESS_AUD` | Plaintext vars in `wrangler.production.jsonc` (Access application audience, not a bearer credential) | N/A | Correctly vars. Gitleaks flagged these in the 2026-07-22 dry run as a pattern match; confirmed not a secret and allowlisted in `.gitleaksignore`. |
| `SLACK_SIGNING_SECRET` | Cloudflare Worker secret | **Unknown — never logged.** | **OPEN, MEDIUM.** Verifies inbound Slack interactivity signatures (`src/lib/slack.ts`). Needs Jeff to confirm it is set and log a rotation date. |
| `SLACK_WEBHOOK_URL` | Cloudflare Worker secret | **Unknown — never logged.** | **OPEN, LOW.** Outbound-only (posts to the PCD Slack channel); a leak lets someone post to the channel, not read or write app data. Still needs a rotation date on record. |
| `SLACK_APPROVER_IDS` | Plaintext var (allowlist of Slack user IDs, not a credential) | N/A | Correctly a var. |
| `GITHUB_TOKEN` | Cloudflare Worker secret | **Unknown — never logged.** | **OPEN, HIGH-IMPACT IF LEAKED.** Has `contents:write` on `jeffthomas4-lab/parent-coach-playbook` — a leak of this token is a repo-write compromise, not just an app compromise. No rotation date on record anywhere in this repo's history. Jeff should confirm it is a fine-grained PAT scoped to only this repo/contents, not a classic PAT with broader scope, and set a rotation date. |
| `TURNSTILE_SECRET_KEY` | Not yet set anywhere (`wrangler.jsonc`/`wrangler.production.jsonc` carry no reference beyond the placeholder site key) | N/A — not configured | Every route that calls `enforcePublicTurnstile` fails closed (503) with no secret configured, so this is a functionality gap, not a live exposure. See Turnstile section below. |
| `PUBLISH_COMMITTER_EMAIL` | Plaintext var/default (`parentcoachplaybook@gmail.com`), not a secret | N/A | Correctly not a secret. |
| `SENTRY_DSN` / `PUBLIC_SENTRY_DSN` | Coded, not yet set as live secrets — Sentry ships dark | N/A — not configured | Not a leak surface today; DSNs are not bearer credentials in the way an API key is, but they should still be tracked once set. |
| Live OpenAI API key (Cowork-root scripts, **outside this repo**) | Was hardcoded plaintext in `gen_hero_image.py` and in `About Me/openai-config.md` | Per `About Me/openai-config.md`'s own text: **rotated 2026-07-30** | See "Open item #17" below — this session verified the files, not the OpenAI dashboard. |

**What this session could not do:** confirm live secret *values* or exact rotation dates for `SLACK_SIGNING_SECRET`, `SLACK_WEBHOOK_URL`, `GITHUB_TOKEN`, or `BULK_IMPORT_TOKEN` — no session has a dashboard or `wrangler secret list` value-reading path, by design (the gate explicitly forbids printing secret values). What's missing is a **rotation date on record**, not the value. Recommend Jeff add a rotation date to this table for each of the four the next time he touches them in the dashboard, even a one-line "confirmed set, no rotation needed yet, dated 2026-07-31."

## 2. Full-history secret scan

**This session ran a manual sweep, not gitleaks.** `which gitleaks` found nothing; `npx gitleaks` resolves to an unrelated, unmaintained npm package (`gitleaks@1.0.0` by a different author, a custom-rules tool, not the Go-based scanner this gate means) and was not used. Attempts to install or run the real gitleaks binary were not possible in this sandbox.

What ran instead, 2026-07-31:
1. **Current working tree**, ripgrep pattern sweep for the same shapes `scripts/scan-secrets.mjs` checks (OpenAI, Anthropic, GitHub, Slack, AWS, Stripe, Google, Notion, Resend key formats, PEM private keys) across the full repo. Two hits, both confirmed false positives on inspection (prose text and a database-name string, neither containing an actual key-shaped value).
2. **Full git history via `git log --all -p` / `-S`**: attempted three ways (the repo's own `node scripts/scan-secrets.mjs --history`, direct `git log -p`, and `git log -S<pattern>` per high-value pattern) and every attempt timed out in this sandbox before completing — the same FUSE-mount I/O latency documented in this repo's own Pillar 9 notes (`STANDARD-AUDIT.md`, 2026-07-20 tsc entry) affects `git log -p` over this repo's 669-commit history the same way. **A full-history scan did not complete this session.**
3. `git log --all` is additionally blocked in this checkout by dozens of broken/stale-renamed refs (`refs/heads/*.lock.stale_cleanup`) left behind by prior interrupted git operations across parallel agent sessions — git prints "ignoring broken ref" and proceeds, so this doesn't block anything, but it's `.git` debris worth a cleanup pass sometime (not touched this session — out of this pass's scope and risky to touch while other agents are active on this branch).

**What stands in for a completed scan today:**
- The real gitleaks CLI *was* run against full history on **2026-07-22** (logged in `.gitleaksignore` and the prior version of this file) — 6 matches, all confirmed false positives (2 test fixtures, allowlisted; 2 Cloudflare Access AUD values, confirmed non-credential and allowlisted). That is 9 days stale as of this pass, not zero, but it is a real completed run on record.
- `scripts/scan-secrets.mjs --history` (the repo's own gitleaks-equivalent, same detector patterns as the manual sweep above) runs on **every push and PR** in `.github/workflows/ci.yml` with `fetch-depth: 0`, so full history gets re-scanned continuously in CI even when a local session can't run it.
- **A real bug in that scanner was found and fixed this session** — see Finding 1 below. It affects the scanner's blind spot, not a leak.

**Recommendation logged, not yet done:** Jeff should run `gitleaks git .` (or `npx gitleaks@latest git .` from a working directory with npm's real package, not the sandboxed FUSE mount) from his own machine at least once to close this out as a genuinely current full-history pass, since this sandbox cannot complete one.

## 3. Findings this session

### Finding 1 — MEDIUM (fixed): a null byte silently exempted a PII-handling file from every secret scan

`src/lib/org-contacts.ts` (the shared data-access layer for the `org_contacts` PII table) and `scripts/proof.mjs` (the CLI for the testimonial-proof pipeline) both contained a literal **NUL byte (`\x00`)** inside a template-literal/array-join field separator, where the surrounding code and every rendered view of the file clearly intended a plain space character (`.join(' ')`, `` `${a} ${b}` ``). Six occurrences total across the two files (1 in org-contacts.ts, 5 in proof.mjs).

This is not a cosmetic issue. `scripts/scan-secrets.mjs`'s own current-tree scanner explicitly skips any file containing a null byte (`if (bytes.length > 5MB || bytes.includes(0)) continue;`), and most text tools (grep, ripgrep, `file`) register a file with an embedded NUL as binary and either skip it or refuse to search it by default. That means **`org-contacts.ts` — a file whose entire purpose is handling named-human PII — has been invisible to every text-based secret scan run against this repo**, including this session's own manual sweep on the first pass (it showed up as "binary file matches" until investigated).

Fixed: both null bytes replaced with the evidently-intended space character. Confirmed clean (`file` now reports both as UTF-8 text, `node --check` passes on `proof.mjs`, a standalone `tsc` pass on `org-contacts.ts` shows no new errors). A repo-wide sweep of all 918 tracked `.ts`/`.tsx`/`.mjs`/`.astro`/`.sql`/`.json`/`.py` files found no other source file with the same problem. Two data files (`activityradar-archive/camps_export.json`, `imports/.cache/missing-geo.json`) also contain null bytes, but those are legitimately UTF-16-encoded data exports (BOM `\xff\xfe` present), not corrupted source — left untouched, though a `.cache/` directory being git-tracked at all is a minor Pillar 7 hygiene item worth a look separately.

**Root cause not determined.** Same corruption pattern (a delimiter character replaced by NUL, always where a hash/dedupe key is being built from concatenated fields) in two unrelated files is enough of a pattern to flag, not enough evidence to say what produced it — possibly an artifact of an earlier automated edit or of this environment's FUSE-mounted filesystem. Worth a `check:secrets`-adjacent lint (`bytes.includes(0)` on every tracked text file, fail instead of silently skip) added to CI so a repeat doesn't go unnoticed again; not built this session, flagged as a follow-up.

### Finding 2 — LOW (fixed): `org_contacts.is_public` was agent-writable in practice, human-only in comments

`src/lib/org-contacts.ts`'s `upsertOrgContact()` is the sole write path for `org_contacts`, called by daily agents (`pcd-evergreen-daily`) that read an organization's own `/contact`, `/about`, `/staff` pages and write named contacts. The function's own doc comment said "an agent must never pass 1" for `isPublic`, and `CONTACT-DATA-MAP.md` states the same rule — but the code only enforced it as a *convention*: `input.isPublic ?? 0` on insert would have honored `isPublic: 1` if any caller (including a compromised or miswired agent) ever passed it. This is exactly the "AI as attack surface" pattern this pillar's addition calls out: an agent with write access, reading unscrubbed external content (a scraped organization webpage), with no code-level barrier between what that content produces and what gets published.

In this repo's current state the risk is theoretical, not live — `org_contacts`' migration is unapplied, nothing reads external page content into a field that reaches `isPublic` today, and every discovery agent's own contract (per `CONTACT-DATA-MAP.md`) writes `is_public=0`. Still, "the comment says never" is not a control. **Fixed:** `upsertOrgContact()` now hardcodes `is_public = 0` on every insert regardless of what `input.isPublic` carries; the field is marked `@deprecated` on the type with a comment pointing at why. Publishing a contact now has no code path at all except a human-gated function that does not yet exist and should be built deliberately (with its own admin-auth check) if this ever becomes a real feature, not inherited from this insert path.

### Finding 3 — carried forward, HIGH, not fixable this session: burned OpenAI key (open item #17)

Verified this session, both locations:
- `gen_hero_image.py` no longer exists anywhere in the Cowork working tree (confirmed via a repo-wide search) — the file that carried the hardcoded key is gone, not just sanitized.
- `About Me/openai-config.md` (outside this repo, at the Cowork root) now carries **no plaintext key**. Its text states the key "lived here in plaintext from an unknown date until 2026-07-30 and was rotated on 2026-07-30," and instructs scripts to read `OPENAI_API_KEY` from the environment instead.

**What this session verified vs. what it could not:** the file *says* the key was rotated 2026-07-30. This session read that claim; it has no access to the OpenAI dashboard and cannot independently confirm the old key is actually revoked and a new one is live. If that rotation genuinely happened on 2026-07-30 as documented, this item is closed and should move to RESOLVED with that date. **If Jeff has not personally confirmed the OpenAI dashboard shows the old key revoked, this item stays open — a documented rotation is not the same thing as a completed one.** Say so plainly, per this session's brief: only Jeff can close this for real, by checking the OpenAI dashboard.

### Finding 4 — carried forward from 2026-07-16, not re-verified this session

The retained Cloudflare Pages project (`parent-coach-playbook`) was found on 2026-07-16 to anonymously serve 11 historical admin pages on its `pages.dev` hostname. This session did not re-probe it live (out of scope for a source-code pass and this session had no instruction to hit that hostname). Flagged as still-open until someone re-verifies or the Pages project is decommissioned. See `coordination/release-evidence/cloudflare-runtime-readonly-2026-07-16.json` for the original evidence.

## 4. AI as attack surface

This repo runs agents with write access under `automation/agents/` (ed, frida, hal, nora, ranger, sunny, vera) and `agents/pcd-deletion-monitor/`. The specific pattern this pillar's addition asks about — an AI reading unscrubbed external content with write access — is real here in one place: **the `org_contacts` discovery agents** (`pcd-evergreen-daily`, `org-discovery-daily-worklist`) read an organization's own public web pages and write structured fields (name, title, email, phone) to D1.

Mitigations already in place, confirmed by reading the code and `CONTACT-DATA-MAP.md`:
- Every write goes through `upsertOrgContact()`, which validates email format, requires at least a name/email/phone, and refuses to write to a row marked `do_not_contact` (so a re-discovery can't resurrect a suppressed contact).
- `verified` and `is_public` are documented as human-only fields. `is_public` is now (this session, Finding 2) enforced in code, not just convention.
- Scope is explicitly bounded in the agent contract: "any minor; parent volunteers or families from rosters, signup sheets, or PDFs; anything behind a login or member directory; anything from a third-party aggregator or scraped-email site" is named out of scope for every agent.
- PII is never staged to a file in this repo (would break the 30-day deletion SLA against permanent git history) — it goes to D1 or is discarded.

**Package supply chain (slopsquatting check).** Every dependency in `package.json` was checked against the real npm registry: `@astrojs/*`, `@fontsource/*`, `@sentry/astro`, `@sentry/cloudflare`, `@tailwindcss/vite`, `astro`, `leaflet`, `leaflet.markercluster`, `tailwindcss`, `web-vitals`, `@cloudflare/workers-types`, `@types/*`, `vitest`, `wrangler`, `linkinator`, `typescript` are all well-known, actively maintained packages. The two less-common ones — `@workos-inc/node` and `@workos/authkit-astro` — were individually checked (`npm view`) and both resolve to real, currently-maintained WorkOS packages (10.9.0 and 0.2.1 latest respectively; this repo pins 10.7.0 and 0.2.0, both real prior versions, not typosquats). No slopsquatting risk found.

## 5. Webhooks

Two real inbound signature-verified endpoints in this repo:

- **`POST /api/slack/actions`** (Slack interactivity). `src/lib/slack.ts`'s `verifySlackSignature()` checks the Slack v0 HMAC-SHA256 signature over the raw body with a timing-safe comparison, plus a 5-minute replay window on the timestamp. The downstream action (`publishDraft()`) is independently idempotent: `flipDraftFrontmatter()` returns `changed: false` (mapped to HTTP 409) when the target file is already published, so a double-clicked button or a Slack retry after a slow response is a no-op, not a double-publish. Verified live: this session did not send a live forged-signature request (would need the real secret to construct a valid negative test meaningfully), but the code path is fail-closed by construction (missing secret → `ok:false` → 403) and was read line by line.
- **`POST /api/trust/request`** and the design-only `identity-provider-receiver.ts` generic webhook receiver both implement duplicate-delivery survival via an `Idempotency-Key` + request-fingerprint pattern: a replay with the same key and same content returns the prior result, a replay with the same key and different content returns 409, never a silent double-write.

No payment or billing webhooks exist on this site (no Stripe, no checkout). The GitHub Contents API write in `publishDraft()` is outbound, not an inbound webhook, and uses optimistic concurrency (`sha` match) so a concurrent edit is refused with 409 rather than clobbered.

## 6. D1 scoping (no row-level security)

Checked `org_contacts` specifically, per this pillar's explicit ask. Every read and write goes through `src/lib/org-contacts.ts`'s exported functions (`listOrgContacts`, `listOrgContactsForOrgs`, `upsertOrgContact`, `softDeleteOrgContact`, `setDoNotContact`) — grepped `org_contacts` across `src/` and found exactly two files reference the table name: the access layer itself and one comment in `camps-db.ts` pointing at it. **No route hand-writes a WHERE clause against this table.** All queries bind `organization_id`/`id` as parameters (`.prepare(...).bind(...)`), never string-built. Soft-delete only (`deleted_at`), never a hard `DELETE`, matching the CRM-sync design note in the migration file.

The `activity-radar` D1's public-facing tables (camps/programs) were spot-checked the same way in the 2026-07-05/07-14 passes (row-returning public routes scope by slug/id, no whole-table dump) and nothing in this session's file review contradicts that.

## 7. Brute force / WAF

**Not verified this session — needs Jeff, dashboard-only.** This site has no app-level username/password login form (admin auth is entirely Cloudflare Access, email-OTP; there is no live customer/owner login flow — see Session lifecycle below), so the classic "rate-limit the login POST" pattern doesn't map directly here. What the WAF-layer rule should protect instead: the Cloudflare Access login flow itself (`fieldforge.cloudflareaccess.com`) and `/admin/*` / `/api/admin/*` at the edge, before a credential-stuffing or Access-session-guessing bot reaches the Worker at all. Live-verified this session (via `curl`) that both `/admin/` and `/api/admin/camps/queue` correctly 302 to the Access login for an unauthenticated request — the app-side gate works — but a Cloudflare-dashboard rate-limiting rule in front of that path was not checked (no dashboard access from this session, and the task brief said not to touch dashboards). **Jeff: add a Cloudflare rate-limiting rule on `/admin/*` and `/api/admin/*` in the dashboard (Security > WAF > Rate limiting rules; there's a one-click "protect your login" preset) — this is a real gap, not just an unverified one, since nothing in the repo suggests this rule exists today.**

## 8. Rate-limit table

Six Cloudflare rate-limit bindings are wired in `wrangler.production.jsonc`, each behind `enforcePublicWriteRateLimit()` (`src/lib/public-rate-limit.ts`), which **fails closed with a 503** if a binding is missing at runtime (proven by `tests/rate-limit-contract.test.ts`) and returns **429 with `Retry-After: 60`** on trip, with the actor key SHA-256 hashed so no email/IP is ever persisted in the limiter key or leaked in the response (also proven by test).

| Route | Binding | Limit | Window | Key | On trip |
|---|---|---|---|---|---|
| `POST /api/camps/submit` | `PUBLIC_SUBMISSION_RATE_LIMITER` | 10 | 60s | route + hashed claimed email, else hashed edge IP | 429, `Retry-After: 60`, no-store |
| `POST /api/camps/suggest` | `PUBLIC_SUBMISSION_RATE_LIMITER` | 10 | 60s | route + hashed claimed email, else hashed edge IP | 429, `Retry-After: 60`, no-store |
| `POST /api/proof-submit` | `PUBLIC_SUBMISSION_RATE_LIMITER` (shared, not dedicated — see route's own TODO comment) | 10 | 60s | route + hashed edge IP | 429, `Retry-After: 60`, no-store |
| `POST /api/trust/request` | `TRUST_RATE_LIMITER` | 5 | 60s | route + hashed requester email, else hashed edge IP | 429, `Retry-After: 60`, no-store |
| `POST /api/camps/:slug/reviews/submit` | `COMMUNITY_RATE_LIMITER` | 5 | 60s | route + hashed reviewer email, else hashed edge IP | 429, `Retry-After: 60`, no-store |
| `POST /api/camps/:slug/claim` | `OWNER_RATE_LIMITER` | 5 | 60s | route + hashed claimant email, else hashed edge IP | 429, `Retry-After: 60`, no-store |
| `POST /api/search-event` | `DEMAND_RATE_LIMITER` | 30 | 60s | route + hashed edge IP (no raw IP retained) | 429, `Retry-After: 60`, no-store |
| `GET /api/camps/nearest`, `GET /api/camps/search-priority` | `PUBLIC_READ_RATE_LIMITER` | 120 | 60s | route + hashed edge IP | 429, `Retry-After: 60`, no-store |
| Admin mutation routes (`/api/admin/**`) | None — gated by Cloudflare Access + `ADMIN_EMAILS` allowlist + same-origin check instead | N/A | N/A | Access session | 401/403, not rate-limited (matches this standard's Auth tier intent via a different mechanism: only allowlisted humans can even attempt a request) |
| No paid third-party API on a public route today | N/A | N/A | N/A | N/A | Paid tier is currently empty; if a paid API (OpenAI, a geocoder needing a key) is ever added to a public route, it needs its own limiter before launch, per this pillar |

**Feature-flag state as of 2026-07-31**, per `wrangler.production.jsonc`'s `vars`: `CAMP_CLAIMS_ENABLED`, `CAMP_REVIEWS_ENABLED`, `TRUST_INTAKE_ENABLED`, `DEMAND_TELEMETRY_ENABLED`, and `PROOF_SUBMIT_ENABLED` are all `"false"` today. The routes above are wired and tested, but several are not live traffic yet — the rate limiter still fires the moment each flag flips `true`, since the limiter check runs ahead of the flag check on at least the routes reviewed. **Tests exist and prove the trip** at the shared-helper level (`tests/api/public-rate-limit.test.ts`, `tests/rate-limit-contract.test.ts`): fail-closed 503 on missing binding, 429 + `Retry-After` on exhaustion, actor hashing verified to not leak PII. This satisfies "every limit needs a test that proves it trips" at the mechanism level; per-route integration tests exist for the routes covered in the Pillar 9 testing pass.

## 9. Spend caps

No paid third-party API is called from a public route today (Nominatim geocoding is free/keyless). Per Pillar 8's cost line: a Cloudflare Budget alert (~$15-20 threshold) exists on the account. If a metered dependency is ever added, it needs its own cap in the vendor dashboard before it ships, not after — this is a human/dashboard step, unchanged from prior passes.

## 10. Session lifecycle

**This site has no live app-level session-issuing auth today.** Confirmed by code review:
- Admin auth is 100% Cloudflare Access (email-OTP, JWT signature-verified against Access's JWKS as of the 2026-07-15 hardening). Session lifetime for that flow is an **Access application setting in the Cloudflare Zero Trust dashboard**, not something this repo's code sets — `Jeff should confirm the Access application's session duration is set intentionally (a coach's-desk admin panel should probably be hours, not the dashboard default) rather than left at whatever Access defaults to.` This is a dashboard check this session cannot perform.
- The `SESSION` KV binding is declared in `wrangler.production.jsonc` but **not referenced anywhere in `src/`** — it's provisioned ahead of a feature that doesn't exist yet.
- A customer/owner authentication layer exists in source (`customer-authorization.ts`, `customer-foundation.ts`, `customer-challenges.ts`, `owner-store.ts`, etc.) but is entirely gated behind `PCD_CUSTOMER_FOUNDATION_ENABLED`, which is `"false"` in production, and `requireCustomerFoundation()` returns 404 when the flag is off. No route wires it live except `src/pages/owner/index.astro`, and the gate function itself never reads request headers/cookies directly — it only trusts a value a (currently nonexistent) provider middleware would populate. There is no live session to fix or break here.

**What this means for the standard's session-lifecycle asks (lifetime set on purpose, concurrent-session cap and visibility, instant revocation on password change):** none of the three apply today because there is no live session issuance to apply them to. This is not a waiver of the requirement — it's a statement that the requirement's trigger condition (a real session) doesn't exist yet. **The moment `PCD_CUSTOMER_FOUNDATION_ENABLED` flips to `true` and a real provider is wired in, this section needs a real re-run**, not a copy-paste of this note. Flagged as a build-time gate for whoever ships that feature, not an open finding against the site as it exists today.

## 11. The 11-point gate

1. **Privacy policy and known data home — PASS.** `/disclosure/` names what's collected and where it lives; matches `DATA-MAP.md`.
2. **No client-side D1/KV/R2 access, routes scope to caller — PASS.** All D1/R2 access is server-side. `org_contacts` specifically re-verified this session (see §6). Admin routes require `requireAdmin()`.
3. **Auth failure path — PASS, with a caveat.** No app-level password login exists to test "wrong password x5" or "reset for a nonexistent email" against — those specific scenarios don't apply to a Cloudflare-Access-only admin surface. What was live-verified this session: unauthenticated `/admin/` and `/api/admin/camps/queue` both correctly 302 to Access login (not a silent pass-through); a cross-origin POST to a public write route was rejected 403 (CSRF/same-origin check fires); the Slack signature check fails closed with no secret configured. Tampered/expired admin cookie handling (Access JWT signature + exp verification) was read in source, not live-forged this session.
4. **Security headers — PASS, verified against the live response.** `curl -I https://parentcoachdesk.com/` this session confirmed, live: `strict-transport-security: max-age=63072000; includeSubDomains; preload`, `x-content-type-options: nosniff`, `x-frame-options: DENY`, `referrer-policy: strict-origin-when-cross-origin`, `permissions-policy: camera=(), microphone=(), geolocation=(), interest-cohort=()`, `cross-origin-opener-policy: same-origin`, and a full hashed `content-security-policy` including `frame-ancestors 'none'` — all matching `src/lib/security-headers.ts` exactly. Not just read from source this time; read from the wire.
5. **OWASP (injection/XSS/auth) — PASS.** Every D1 statement reviewed this session uses `.prepare(...).bind(...)`. `org-contacts.ts` re-verified clean. CSP + Astro auto-escaping cover XSS; two moderate CVEs in `astro`/`@astrojs/rss` (XSS/XML-injection classes) were open and are fixed this session — see §12.
6. **Server-side validation — PASS.** `/api/trust/request`, `/api/proof-submit`, `/api/camps/submit` all validate independent of client JS (field length caps, format checks, enum checks) — re-read this session, unchanged from prior passes.
7. **No leaks (bundle / over-return / console) — PASS.** No secret in the frontend bundle. `org_contacts` PII is never logged (log lines carry ids/counts only, confirmed by reading every `console.error` call in `org-contacts.ts`). Errors are generic to the caller.
8. **No API keys in frontend — PASS.** Confirmed again this session; no third-party key referenced from client-side code anywhere in `src/`.
9. **Rate limits on paid endpoints — N/A, correctly waived.** No paid third-party API on a public route today. See §8 for the full non-paid rate-limit table, which goes beyond this item's minimum bar.
10. **Turnstile + CORS — PARTIAL, unchanged.** CORS: PASS — no route emits `Access-Control-Allow-Origin`; live-verified this session with a forged cross-origin POST, which was rejected 403. Turnstile: still not live — `TURNSTILE_SECRET_KEY` is unset, so every gated route fails closed (503) rather than silently accepting unverified traffic, which is the safe failure mode, but Turnstile itself isn't protecting the live public forms yet (they rely on same-origin + honeypot + rate limit). Recommend Jeff set the Turnstile keys before any of the currently-flagged-off write routes go live.
11. **Generic errors to user — PASS.** Re-confirmed this session across every route reviewed.

## 12. Changes made this session (2026-07-31)

1. **Fixed** `src/lib/org-contacts.ts` — removed a literal NUL byte from `computeContentHash()`'s join delimiter (was silently exempting this PII-access file from every text-based secret scan, including the repo's own `scripts/scan-secrets.mjs`). Replaced with the evidently-intended space character.
2. **Fixed** `scripts/proof.mjs` — same NUL-byte pattern, 5 occurrences across `generateCandidateId()` and `dedupeKey()`. Replaced with spaces.
3. **Fixed** `src/lib/org-contacts.ts` — `upsertOrgContact()` now hardcodes `is_public = 0` on every insert instead of trusting `input.isPublic`, closing the gap between the documented "an agent must never pass 1" rule and what the code actually enforced. `isPublic` marked `@deprecated` on the type with an explanation.
4. **Fixed** `package.json` / `package-lock.json` — `astro` bumped `^7.0.9` → `^7.1.6` and `@astrojs/rss` bumped `^4.0.18` → `^4.0.19` via `npm audit fix`, resolving open item #38 (two moderate CVEs: XML injection via unescaped RSS feed fields, reflected XSS via unescaped View Transition properties). `npm audit` now reports 0 vulnerabilities. **Not build-verified this session** — `astro build` and `vitest` both fail in this sandbox (bus error, a pre-existing sandbox limitation documented in this repo's own Pillar 9/13c notes, not caused by this change). Both are semver-compatible bumps within the already-declared `^` range for `@astrojs/rss`; `astro`'s bump is a minor-version move (7.0→7.1) also within its declared range. **Jeff: run `npm install && npm run build && npm test` before merging** to confirm nothing broke, per the standard's build-first rule.
5. **Verified, not changed:** live security headers (§4), live Access-gate behavior on `/admin/` and `/api/admin/camps/queue` (§3), live CORS rejection on a forged cross-origin POST (§10 gate item), `org_contacts` D1 scoping (§6), webhook signature/idempotency design (§5), package supply chain for slopsquatting (§4 AI section), secrets inventory current state (§1), and the two Cowork-root files behind open item #17 (§3 Finding 3).
6. **Not fixable from this session, needs Jeff:** OpenAI dashboard rotation confirmation (Finding 3), Cloudflare WAF rate-limiting rule on `/admin/*`+`/api/admin/*` (§7), rotation dates for `SLACK_SIGNING_SECRET`/`SLACK_WEBHOOK_URL`/`GITHUB_TOKEN`/`BULK_IMPORT_TOKEN` (§1), Access application session-duration setting (§10), a real gitleaks run from a non-sandboxed machine (§2), and re-verification of the retained Pages project's anonymous admin exposure (Finding 4).

---

## Session log (history, superseded by the sections above where they overlap)

### 2026-07-22 — repo hygiene + secret-scan baseline (Packet C)
`.gitignore` extended with `.dev.vars`/`*.pem`/`*.key`/session-file patterns. `check:secrets` CI step confirmed wired into `ci.yml`. A full-history dry run with the real `gitleaks` CLI found 6 historical matches, all confirmed false positives (2 test fixtures, allowlisted; 2 Cloudflare Access `ACCESS_AUD` values at 2 commit positions each, confirmed non-credential and allowlisted in `.gitleaksignore`).

### 2026-07-15 — Security & Revenue lane
Hardcoded live OpenAI key in `gen_hero_image.py` (Cowork root) sanitized to read from environment. Same key found in plaintext at `About Me/openai-config.md`, not edited that session (outside its file lane). Full-tree secrets sweep + manual `git log --all -p` pass found no other real hardcoded secret. `/go/` affiliate redirect verified end to end live for Amazon, CJ/SoccerGarage, Bookshop.org — correct tag/tracking on all three.

### 2026-07-16 — Worker cutover + Pages anonymous-admin finding
Production moved to Worker `parent-coach-desk`. `SESSION` KV bound, Access JWT signatures verified in application code, bulk-import credential compared via a fixed-size hash path, public-write rate limiting configured. A repository-native scanner (`scripts/scan-secrets.mjs`) checks credential-specific patterns without printing matched values, wired into CI with `fetch-depth: 0`. Separately: the retained Pages deployment was found anonymously serving 11 historical admin pages on its `pages.dev` hostname — not remediated, not re-checked since (see Finding 4 above).

### 2026-07-14 — CRON_KEY confirmed, test coverage, npm audit
`CRON_KEY` confirmed as a live Cloudflare Pages secret (value not printed). GitHub Actions repo secret of the same name found unset. `npm audit`: critical `vitest`/`uuid`/`gaxios`/`@astrojs/tailwind` chains fixed. 3-test-minimum suite (happy/failure/auth) written for all 14 previously-untested API routes — 107/107 tests passing at that time. `npm run check`: 215 → 0 type errors.

### 2026-07-05 — secrets inventory added, Pillar 1 tightened
Secrets inventory table added per that day's tightened standard. `CRON_KEY` found referenced in code but never confirmed as a configured secret. No Critical/High findings; 11-point gate held.

### 2026-06-27 — baseline
No code changes needed. Admin surface gated by Cloudflare Access + email allowlist + same-origin check; every D1 query parameterized; error responses generic.
