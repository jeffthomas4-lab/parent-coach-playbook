# Pillar 8 (Operations & Reliability) and Pillar 9 (Testing & CI) — 2026-07-31

Full re-run against parentcoachdesk.com on branch `audit/full-standard-2026-07-30`. Anchors: PILLAR-8-2026-07-31, PILLAR-9-2026-07-31.

## Structured logging — built and rolled out

`src/lib/log.ts` is new: `log(severity, fields)` emits one JSON object (timestamp, severity, requestId, action, route, userId, plus caller fields) to the matching console sink, and `createRequestLogger(request, {route, userId})` binds a request's correlation id once so a route's calls are one-liners. The request id is Cloudflare's own `cf-ray` header when present (falls back to a generated UUID for local/test calls), so the same id already appears in `wrangler tail` and the Cloudflare dashboard — a support ticket is one grep, not a guess.

Rolled out to every `console.error`/`console.warn`/`console.log` call in `src/pages/api/**` (all ~37 route files, not just the ~19 the prior audit flagged) and `src/pages/sitemap-camps.xml.ts`. Also rolled into the shared libraries with the highest call volume: `admin-auth.ts`, `access-jwt.ts`, `admin-receipts.ts`, `email.ts`, `events.ts`, `link-health.ts`, `org-contacts.ts`, `publish.ts`, `slack.ts`, `turnstile.ts`. Where a `Request` was in scope, the logger carries the real request id; where it was not (background key-fetch caches, fire-and-forget email/Slack sends with no request threaded through), it logs a generated id with a comment noting the limitation, honestly, rather than pretending it correlates.

Not converted: `console.*` inside `.astro` files (client-side/SSR page scripts) — out of scope per this session's brief (another agent owns `.astro`).

`tests/log.test.ts` covers the logger itself: cf-ray vs generated id, severity routing to the right console method, Error flattening, non-Error thrown values, and `createRequestLogger` binding. Could not execute (`npx vitest run` bus-errors in this sandbox on every file, a pre-existing, previously documented sandbox limit) — written and read carefully, not claimed green.

**Open:** `sendEmail`/`sendSubmissionConfirmation`/`sendAdminAlert` and the GitHub-commit paths in `publish.ts`/`approve.ts`/`set-status.ts` still generate a fresh id per call rather than receiving the original request's id, because threading it through every call site is a larger signature change than this session's verified-nothing-builds scope should risk blind. Next session: add an optional `requestId` parameter to `sendEmail`/`postToSlack`/`publishDraft` and pass the caller's `logger.requestId` through, so a submission's confirmation email and admin alert share the same id as the route that triggered them.

## Automated destructive action — verified the 2026-07-30 fix holds

Read `scripts/deploy-remediation.mjs` in full. The auto-rollback that reverted a day of shipped work on 2026-07-30 (STANDARD-AUDIT item 56) is gone: `remediateAfterSmoke` never calls `wrangler rollback` or `wrangler versions deploy` itself. On a smoke failure it resolves the version immediately preceding this deploy live from `wrangler versions list --json` (`precedingVersionFrom`, excludes the just-deployed id by exact match), prints the exact paste-ready rollback command, and exits non-zero so a human decides. `tests/deploy-remediation.test.ts` (13 assertions per the STANDARD-AUDIT note) covers this. Confirmed this reads correctly against source; could not re-run the suite live (bus-error).

## Rollback target — resolved at failure time, stale gate retired

`scripts/deploy-remediation.mjs` already resolves the rollback target live (item 56, prior session). What was still open (item 57) was `check:rollback-target` in `package.json`'s `ci:release` chain and in `.github/workflows/ci.yml`, which validated a checked-in receipt (`coordination/release-evidence/worker-rollback-target-2026-07-29.json`) that nothing downstream reads anymore and that expires 2026-08-05 — a scheduled outage on its own five-day clock.

**Fixed this session:**
- Removed the `check:rollback-target` npm script from `package.json` and the corresponding `npm run check:rollback-target` step from `ci:release` and from `.github/workflows/ci.yml`.
- `scripts/check-worker-rollback-target.mjs` gets a header comment explaining the retirement and pointing at `check:production-manifest` (`scripts/check-deployment-manifest.mjs`) as the check that still does live, exact-match binding verification on every push — the receipt's one piece of remaining value (binding parity) was already duplicated there, against the real built manifest instead of a snapshot that ages. The script and its data files (`worker-rollback-target-*.json`) are left in the tree for manual, non-gating use, not deleted.

## Caching — read live off the deployed site, 2026-07-31

curl against `https://parentcoachdesk.com` (not `wrangler.production.jsonc`, not `public/_headers` alone) for all four asset classes:

| Class | Live `cache-control` | `cf-cache-status` | Verdict |
|---|---|---|---|
| Hashed bundle `/_astro/BaseLayout.CNaIGIGl.css` and a `.js` sibling | `public, max-age=31536000, immutable` | HIT | pass |
| Image `/illustrations/sports-family-sideline.webp` | `public, max-age=31536000, immutable` | HIT | pass |
| HTML `/` | `public, max-age=300, s-maxage=86400, stale-while-revalidate=86400` | HIT | pass |
| API JSON `/api/health`, `/api/camps/nearest` | `no-store` | n/a | pass |
| Admin (Access-gated) `/admin/` (302) | `private, max-age=0, no-store, no-cache, must-revalidate` | n/a | pass |

The `/illustrations/*` gap the 2026-07-30 pass found (a 134KB LCP image revalidating on every load) is fixed and confirmed live, not just in `public/_headers`. All four classes pass. `public/_headers` source matches the live response exactly.

**Cache the reads underneath (open item #23): still open.** `grep -r "caches.default\|CacheStorage\|KVNamespace" src/pages/api src/lib` finds nothing — no D1 read in this app goes through the Cache API or KV. Not fixed this session: adding a cache layer with a real invalidation story is a design decision (what TTL, what busts it on a camp approve/reject) that deserves its own pass, not a blind wrap under a sandbox that cannot build-verify the result. Stays LOW per the existing note; traffic is still thin per the Pillar 10 history.

## AI in production

`grep -rl "gateway.ai.cloudflare\|OPENAI_API_KEY\|ANTHROPIC_API_KEY" src/lib src/pages/api` returns nothing. This Worker's live runtime makes no LLM calls; the named agents (Ed, Penny, Ranger, etc.) run as Claude Code sessions/scheduled tasks against the repo and its D1 databases via `POST /api/agent-runs`, not as in-Worker Workers AI/OpenAI/Anthropic calls. Cloudflare AI Gateway routing, the 70%/90% spend-cap pattern, and prompt caching are Pillar 8 asks for a Worker that calls a model directly — this Worker does not, so that row is not-applicable as written today, not failing. The agents' own spend sits under Anthropic's account-level workspace limits, outside this repo's reach.

## Queues for slow inline work — open, not fixed

`camps/submit.ts` awaits `sendSubmissionConfirmation` and `sendAdminAlert` (Resend, with a Slack staging fallback) inline before returning the response; `publish.ts`/`approve.ts`/`set-status.ts` await two sequential GitHub Contents API calls inline. All are already wrapped in try/catch so a mail or GitHub hiccup degrades rather than 500s, and each carries its own timeout. None of this is behind `wrangler.toml` Queues, `max_retries`, or a `dead_letter_queue`. The account has been on Workers Paid since 2026-07-18 (per the cost line), so Queues (an extra $5/mo already effectively covered) is available. **Not wired this session:** this needs a queue binding in `wrangler.production.jsonc`, a consumer Worker, an idempotency key per job, and a live-preview verification pass that this sandbox cannot build to prove — logged as an open High rather than shipped unverified.

## Backups and recovery

`INCIDENT-RUNBOOK.md`'s recovery point/time section is already written (D1 point-in-time restore ~30 days, Worker rollback under 2 minutes, D1 restore budget 30 minutes). The restore itself has still never been run. This session tried `npx wrangler d1 list` to check whether the sandbox could reach the Cloudflare API at all before attempting a real `d1 time-travel restore` into a scratch database — it returned nothing in 20 seconds, no credentials/network path available here. Logged in `INCIDENT-RUNBOOK.md`'s restore-test table honestly as not run, with the exact command for Jeff to run from a real machine.

## Load test — not run, same reason

`autocannon` at 10/100/1,000 concurrent needs a live preview URL and outbound network access this sandbox does not have. Open item #8 stays open.

## Cost line and CONTINUITY.md

`STANDARD-AUDIT.md`'s header cost line is current on the big items (Workers Paid, D1/R2 shared with ActivityRadar, Kit free tier, no paid third-party API from the live site, a $15-20 Cloudflare Budget alert) but still says Sentry is "mid-setup... DSN pending" as of 2026-07-17, while the Pillar 8 row two lines below it says the DSN was set 2026-07-18. Minor doc drift, not a Critical — flagged, not fixed (a copy edit outside this session's file lane risk). `Outputs/_system/CONTINUITY.md` was created 2026-07-05 with its next review due 2027-01-05; today is 2026-07-31, so it is not yet stale.

## Astro bump verification (^7.0.9 → ^7.1.6, @astrojs/rss → ^4.0.19)

Checked whether the bump another agent made this session (via `npm audit fix`, closing two moderate CVEs) is safe given Astro 6 removed the legacy content-collections format. `src/content.config.ts` already exists and already uses the Content Layer API (`defineCollection` + `glob` loader from `astro/loaders`), not the old `src/content/config.ts` + `type: 'content'` shape — confirmed by reading the file directly. This matches the repo's own history (Card M2 of the Pages-to-Workers migration already did the `entry.slug` → `entry.id` rename across 51 files). **The bump is safe; not reverted.** Could not run `astro build`/`npm run check` to prove it end to end in this sandbox — Jeff should run `npm install && npm run build && npm run check` before merging, per the existing item 38 note.

## CI gate (Pillar 9)

`.github/workflows/ci.yml`'s `build-and-test` job already ran `npm ci`, `npm audit --audit-level=high`, and a battery of repo-specific checks (`check:secrets`, `check:protected-routes`, `check:production-manifest`, etc.), build, and test — but the "gitleaks scan" step was `npm run check:secrets`, a hand-rolled regex scanner (`scripts/scan-secrets.mjs`), not the real gitleaks binary the standard names. **Fixed:** added a real `gitleaks/gitleaks-action@v3` step (pinned to commit `e0c47f4f8be36e29cdc102c57e68cb5cbf0e8d1e`, satisfies `check:workflow-pins`'s full-SHA requirement) alongside the existing `check:secrets` step, not replacing it — the repo-native scanner catches PCD-specific patterns the generic gitleaks ruleset would not, so both run. Not verified by an actual CI run (no way to trigger GitHub Actions from this sandbox); the action reference and pin format were checked by hand against gitleaks-action's public release page.

## Dependency hygiene

Lockfile (`package-lock.json`) is committed. `npm ci` (not `npm install`) is used in every CI step. `.github/dependabot.yml` exists and is configured (npm weekly, github-actions monthly).

## Test inventory spot-check (Pillar 9)

70 files under `tests/api/` against 51 files under `src/pages/api/`. Every editorial route this session touched already has a matching test file (`admin-editorial-approve.test.ts`, `admin-editorial-set-status.test.ts`, `admin-editorial-approvals-update.test.ts`, `admin-editorial-maintenance-update.test.ts`, `admin-editorial-relationships-create.test.ts`, `admin-editorial-briefs-create.test.ts`, `admin-editorial-claims.test.ts`, `admin-editorial-sources-create.test.ts`, `admin-editorial-reviews-create.test.ts`, `admin-editorial-opportunities-update.test.ts`), so the logging rollout on those files is a change inside code that already has coverage, not a newly-untested surface. Did not have time this session to run a full happy/failure/auth inventory across all 51 routes against all 70 test files by hand; that full pass is still owed and is a separate, mechanical piece of work from what this session covered.
