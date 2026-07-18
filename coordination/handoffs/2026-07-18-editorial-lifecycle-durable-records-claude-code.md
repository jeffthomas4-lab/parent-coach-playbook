# Editorial lifecycle durable records handoff

**From:** Claude Code (Windows host)
**To:** Jeff / Codex
**Task:** Items 1-6 of the Cowork kickoff prompt (`coordination/handoffs/2026-07-18-editorial-lifecycle-cowork-blocker-and-claude-code-kickoff.md`), following the Codex handoff (`coordination/handoffs/2026-07-18-editorial-lifecycle-claude-jeff.md`).
**Tier:** 3 (new migration, new admin write surface).
**Branch:** `main`.
**Baseline:** `192a173` (stated in kickoff). Jeff committed `bd74592` (the Cowork-blocker handoff doc, 43 lines, docs-only) mid-session; not authored by this session, non-conflicting.
**Commit:** `2553a60cec202bed9c540fdb6f5df7b74969cf4d`.
**Status:** Local design, code, and rehearsal complete. Nothing deployed, migrated remotely, or flag-enabled.

## Sanity check (before any change)

`git status` at the start of the session showed only 2 untracked files (both legitimate handoff/runbook docs, no truncated/no-newline corruption pattern). Confirmed clean; proceeded.

## What was built

1. **Opportunity-intake layer** (`src/lib/editorial-opportunity-intake.ts`): a write-time PII/URL/phone redaction gate (`sanitizeOpportunitySignal`) every signal must pass before storage, a provider-neutral `OpportunitySignalAdapter` interface, and two adapters wired to real, already-in-repo, privacy-safe data: `demandOpportunityAdapter` (reuses the existing `demand_events_v1` aggregate) and `correctionOpportunityAdapter` (reuses `src/data/corrections.ts`). The remaining seven sources named in `editorial-governance.json`'s `opportunity_sources` (gsc, camp_gap, affiliate_gap, seasonal, newsletter, support, competitor, emerging_trend) throw a descriptive `NotImplementedAdapterError` naming the missing dependency, rather than fabricating signals.
2. **Durable records** (`migrations-pcd-ops/0024_editorial_opportunity_lifecycle.sql`, `src/lib/editorial-records.ts`): 10 tables -- opportunities, an append-only lifecycle-event log, a reusable evidence-source registry, briefs, claims, claim-source links, relationships, editorial/SEO reviews, approvals (with monetization/disclosure classification), and maintenance proposals. Every transition in `editorial-records.ts` goes through the existing `canTransition`/`approvalGates` state machine in `src/lib/editorial-lifecycle.ts` rather than reimplementing it, and every write is a `db.batch` with an optimistic-concurrency guard plus an append-only event row, matching the `trust-cases.ts` pattern already in the repo.
3. **Migration plan + rehearsal evidence** (item 3): `coordination/plans/020-editorial-opportunity-lifecycle-migration.md` and `coordination/release-evidence/editorial-lifecycle-migration-rehearsal-2026-07-18.json`. The rehearsal is local-only (isolated Miniflare D1): all 14 files in `migrations-pcd-ops/` apply cleanly together, `PRAGMA foreign_key_check` is clean, and the full lifecycle walkthrough -- including the insufficient-evidence stop, the missing-evidence approval rejection, and the propose-but-never-execute-retirement path -- is proven by `tests/editorial-records-migration.test.ts`. The deferred production trust migration packet was not touched. No production migration was run or requested.
4. **Authenticated admin workflows** (item 4): 8 route files under `src/pages/api/admin/editorial/{opportunities,sources,briefs,claims,reviews,relationships,approvals,maintenance}/`, each behind Cloudflare Access (`requireAdmin`), same-origin (`requireSameOrigin`), and a new default-off flag `EDITORIAL_LIFECYCLE_ENABLED` (added to both `wrangler.jsonc` and `wrangler.production.jsonc` at `"false"`, and to the production-manifest safe-default release gate in `scripts/check-deployment-manifest.mjs`). No auto-publish, auto-delete, or auto-redirect anywhere in this surface; the approvals route always signs with the authenticated caller's identity, never a client-supplied one.
5. **Tests** (item 5): `tests/editorial-opportunity-intake.test.ts` (10 tests, sanitizer + adapters), `tests/editorial-records-migration.test.ts` (9 tests, disposable-D1 full lifecycle), 9 `tests/api/admin-editorial-*.test.ts` files (62 tests, auth/origin/flag/validation boundaries), `tests/editorial-lifecycle-migration-rehearsal.test.ts` (3 tests).
6. **Corpus reconciliation batching** (item 6): `strategy/EDITORIAL-CORPUS-RECONCILIATION-BATCHING.md` (design doc, batch order, per-item checklist) and `scripts/editorial-reconciliation-pilot-candidates.mjs` (read-only report proposing the 17-item `pillar` collection as the pilot batch -- creates no D1 row, marks no item reconciled). No corpus item's status was changed.

## Bugs found and fixed during this session (by the tests, not asserted without proof)

- `countOpportunityEvidence` double-counted a source that was both directly attached to a brief and linked to one of that brief's claims (fixed with `UNION` instead of the original additive `SELECT COUNT(*) + COUNT(*) + COUNT(*)`).
- `logEvent` was accidentally declared `async` while being pushed directly into `db.batch([...])` arrays, which would have handed D1 a `Promise<D1PreparedStatement>` instead of the statement itself (fixed by removing `async`; it never awaited anything).
- `EditorialState` (the shared, reusable state-machine type in `editorial-lifecycle.ts`) does not include `'insufficient_evidence'` in its exported union, even though `canTransition`'s own transition map treats it as a real reachable state via an internal cast. Introduced a local `OpportunityStatus = EditorialState | 'insufficient_evidence'` type in `editorial-records.ts` rather than editing the shared file. Flagged as an open question in Plan 020 for whether the shared type should widen instead.
- Relative import paths were wrong by one directory level on the first pass for every route one level deeper than `editorial/` itself (`sources/`, `briefs/`, `claims/`, `reviews/`, `relationships/`, `approvals/`, `maintenance/`); caught immediately by running the tests, fixed.

## Validation run (exact commands, exit codes)

| Command | Exit | Result |
|---|---|---|
| `npm.cmd run report:editorial-lifecycle` | 0 | Wrote `reports/editorial/lifecycle.json` (1852 items) |
| `npm.cmd run check:editorial-lifecycle` | 0 | No drift |
| `npx vitest run tests/editorial-lifecycle.test.ts --run` | 0 | 4/4 (baseline, unchanged) |
| `npx vitest run --config vitest.integration.config.ts tests/editorial-records-migration.test.ts` | 0 | 9/9 |
| `npx vitest run --config vitest.unit.config.ts tests/editorial-opportunity-intake.test.ts tests/api/admin-editorial-*.test.ts` | 0 | 77/77 (across 13 files) |
| `npm.cmd run check:production-manifest` | 0 | Full production build + manifest verified (`EDITORIAL_LIFECYCLE_ENABLED` confirmed `"false"`) |
| `npm.cmd run check:protected-routes` | 0 | 48 routes (was 38; +10 new, all classified `mutation`) |
| `npm.cmd run check:editorial-lifecycle-migration-rehearsal` | 0 | Rehearsal receipt valid, non-authorizing |
| `npm.cmd run test:unit` (full repo suite) | 1 | **834/837 passing.** 3 pre-existing/live-evidence failures, not caused by this session's logic -- see Blockers below. |
| `npm.cmd run test:integration` (full repo suite, re-run twice to rule out flake) | 0 | 53/53 passing |
| `npm.cmd run check` (astro check, full repo) | 0 | 0 errors, 0 warnings, 356 hints (matches the documented baseline exactly) |

## Remaining blockers (not fixed, not masked)

1. **Three test failures require a live production decision, not a code fix:**
   - `tests/anonymous-admin-probe.test.ts`: the last live anonymous Access probe (`route_count: 38`) is now stale against the current 48-route protected surface, because this session added 10 real new protected admin routes. A fresh anonymous probe against production is a live external HTTP action this session did not perform without approval.
   - `tests/access-evidence.test.ts` and `tests/access-evidence-cli.test.ts`: `coordination/release-evidence/authenticated-access-probes-pending.json` already had `"state": "complete"` at the stated baseline commit `192a173` (verified via `git show 192a173:...`, confirmed **before** any change in this session) -- i.e. these two failures pre-exist this session and are not caused by it. They are now also affected by the same route-count change described above.
   - None of these three were "fixed" by editing evidence files or loosening assertions; that would misrepresent live Access state. They need either a fresh live probe (Jeff/Codex-gated) or a decision on the pre-existing `authenticated-access-probes-pending.json` naming/state inconsistency.
2. **Staging application of migration `0024`** is unapplied and needs Jeff's approval (Plan 020, step 7).
3. **Seven opportunity-intake adapters** (gsc, camp_gap, affiliate_gap, seasonal, newsletter, support, competitor, emerging_trend) have no data source yet; each needs its own connection or provider credentials and explicit approval before being built.
4. **Corpus reconciliation** has not started on any real item; it needs a human reviewer to do the actual source-checking work described in `strategy/EDITORIAL-CORPUS-RECONCILIATION-BATCHING.md`.
5. **`EDITORIAL_LIFECYCLE_ENABLED`** is `false` everywhere; the new admin routes are unreachable in any environment until Jeff flips it.

## What this session did not do

No deployment, no staging or production migration, no feature flag flipped, no external provider called, no publish/delete/redirect action, no affiliate change, no live production request (read or write), and no corpus item's status changed.
