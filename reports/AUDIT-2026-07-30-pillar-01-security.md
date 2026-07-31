# Pillar 1 (Security) audit — parent-coach-desk

Run 2026-07-31, branch `audit/full-standard-2026-07-30`. Scope: the 11-item Pre-Launch Security Gate plus this pillar's secrets-inventory, rotation-schedule, AI-attack-surface, webhook, D1-scoping, WAF, rate-limit-table, spend-cap, and session-lifecycle additions. Full detail lives in the rewritten `SECURITY-AUDIT.md`; this file is the session record.

## Status

**Pass, with one open High carried forward and several open Mediums logged.** No new Critical or High finding was introduced or found this session. The one open High (#17, the burned OpenAI key) is not fixable from any session — it needs Jeff's confirmation in the OpenAI dashboard.

## Fixed this session

1. `src/lib/org-contacts.ts` — removed a literal NUL byte from a hash-join delimiter that was silently exempting this PII-handling file from every text-based secret scan (the repo's own `scripts/scan-secrets.mjs` explicitly skips any file containing a null byte). Replaced with the intended space character.
2. `scripts/proof.mjs` — same corruption pattern, 5 occurrences in `generateCandidateId()` and `dedupeKey()`. Replaced with spaces.
3. `src/lib/org-contacts.ts` — `upsertOrgContact()` now hardcodes `is_public = 0` on every insert instead of trusting caller input, closing a gap between a documented "an agent must never publish a contact" rule and what the code actually enforced. The `org_contacts` table is written by daily agents that read organizations' own public web pages — exactly the "AI reads unscrubbed external content with write access" pattern this pillar's addition asks about.
4. `package.json` / `package-lock.json` — `astro` `^7.0.9`→`^7.1.6`, `@astrojs/rss` `^4.0.18`→`^4.0.19` via `npm audit fix`. Closes open item #38 (two moderate CVEs: XML injection via unescaped RSS feed fields, reflected XSS via unescaped View Transition properties). `npm audit` now reports 0 vulnerabilities. **Not build-verified** — `astro build` and `vitest` both bus-error in this sandbox (a pre-existing, previously documented limitation, not caused by this change). Jeff should run `npm install && npm run build && npm test` before merging.

## Verified live, not previously confirmed against the wire

- Security headers (`curl -I https://parentcoachdesk.com/`): HSTS, `nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`, and the full hashed CSP all present and matching source exactly.
- `/admin/` and `/api/admin/camps/queue` both 302 to Cloudflare Access login for an unauthenticated request — the app-side gate is live, not just coded.
- A forged cross-origin `POST /api/camps/submit` (`Origin: https://evil.example.com`) returned 403 — same-origin/CSRF check fires live.
- `gen_hero_image.py` (Cowork root, outside this repo) no longer exists anywhere in the working tree.
- `About Me/openai-config.md` (outside this repo) carries no plaintext key today; its text states the key was rotated 2026-07-30.

## Open, by severity

- **HIGH — #17 carryover.** The OpenAI key rotation is documented as done (2026-07-30) but this session cannot verify the OpenAI dashboard itself shows the old key revoked. Stays open until Jeff confirms it directly — a documented rotation is not a verified one.
- **MEDIUM.** `SLACK_SIGNING_SECRET`, `SLACK_WEBHOOK_URL`, `GITHUB_TOKEN` (has `contents:write` on the editorial repo — a leak here is a repo-write compromise), and `BULK_IMPORT_TOKEN` all have no rotation date on record. Needs Jeff to confirm each is set and log a date.
- **MEDIUM.** No Cloudflare WAF rate-limiting rule confirmed on `/admin/*` / `/api/admin/*`. App-level Access gating works; nothing in the repo indicates an edge-layer rule exists in front of it. This pillar requires brute force to die at the WAF, not only in app code.
- **MEDIUM.** A full-history gitleaks-equivalent scan did not complete this session — every attempt (the repo's own `scripts/scan-secrets.mjs --history`, direct `git log -p`, `git log -S<pattern>`) timed out against this sandbox's FUSE-mounted git history. The last real gitleaks run on record is 2026-07-22 (clean, two allowlisted non-credential AUD values). CI runs the repo-native equivalent on every push with full history, so this is a staleness gap, not a blind spot in production.
- **LOW.** Turnstile keys are unset; every gated public write route fails closed (503) rather than accepting unverified traffic, which is safe, but Turnstile isn't actually protecting the live forms yet.
- **LOW.** `.git` in this checkout carries dozens of stale-renamed lock/ref files (`*.lock.stale_cleanup`) from prior interrupted operations across parallel sessions. Not touched this session (out of scope, risky while other agents are active on this branch) — worth a dedicated cleanup pass sometime.
- **LOW.** Two tracked data/cache files (`activityradar-archive/camps_export.json`, `imports/.cache/missing-geo.json`) are UTF-16-encoded, not corrupted — legitimate, but a `.cache/` directory being git-tracked at all is a minor hygiene item for whoever owns Pillar 7/9.
- **Informational.** This site has no live app-level session-issuing auth today (admin is Access-only; the customer/owner auth layer is fully feature-flagged off). The standard's session-lifecycle asks (lifetime set on purpose, concurrent-session visibility, kill-on-password-change) have no live trigger to apply to yet. Flagged as a build-time gate for whoever ships that feature next, not a finding against the site as it stands.

## Human actions for Jeff

1. Confirm in the OpenAI dashboard that the old key is revoked and the new one is live — this closes #17 for real.
2. Add a Cloudflare WAF rate-limiting rule on `/admin/*` and `/api/admin/*` (Security > WAF > Rate limiting rules — there's a one-click preset for this).
3. Confirm/rotate and date-log `SLACK_SIGNING_SECRET`, `SLACK_WEBHOOK_URL`, `GITHUB_TOKEN`, `BULK_IMPORT_TOKEN` in `SECURITY-AUDIT.md`.
4. Set the Turnstile site/secret key pair before any currently-flagged-off public write route goes live.
5. Confirm the Cloudflare Access application's session duration is set on purpose (not left at the dashboard default).
6. Run `npm install && npm run build && npm test` locally to verify the `astro`/`@astrojs/rss` bump before merging — this sandbox cannot run either.
7. Run a real `gitleaks git .` from a non-sandboxed machine to get a fresh full-history pass on record (last real one: 2026-07-22).
