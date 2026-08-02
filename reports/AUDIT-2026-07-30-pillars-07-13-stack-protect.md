# Pillar 7 (Tech Stack and Code Norms) + Pillar 13 (Protect-the-App Controls) audit

parent-coach-desk (parentcoachdesk.com), 2026-07-30, branch `audit/full-standard-2026-07-30`.

## Status

**Pillar 7: pass, with fixes.** The row in `STANDARD-AUDIT.md` was stale — it still described the retired Cloudflare Pages topology. Production is now the Worker `parent-coach-desk`, shipped only through GitHub Actions plus the protected `production` Environment approval. Staging is a genuinely isolated Worker. Cron is fully native. Turnstile and rate limiting are real and server-side. The anti-vibe findings below are real but mostly Low-to-Medium and out of this session's file lane.

**Pillar 13, row 1 (Unhappy Paths): fail.** Several silent catch blocks fixed this session. No preview-level fault injection harness exists yet for admin write paths.

**Pillar 13, row 2 (Environment Isolation): pass.** The likely-real-finding this session was told to check hard — shared D1 between staging and production — does not hold up. Staging and production bind fully distinct D1/R2/KV, confirmed by reading both wrangler configs and then live-verifying every database id against the Cloudflare account. The missing piece (a checked-in names-only manifest) is now `ENVIRONMENT-MANIFEST.md`.

**Pillar 13, row 3 (Sensitive-Action Receipts): fail, real receipts landed this session.** The prior audit's claim of a working `content_overlay_receipts` system was false — nothing by that name exists anywhere in this repo, confirmed by source search and a live query against production. A real receipts table, library, and test suite were built this session and wired into 7 of 37 admin mutation routes. The row stays `fail` because 30 routes are still uncovered.

## What was fixed (file paths)

1. **Silent-failure catch blocks**, admin and public API routes — added structured `console.error` logging so a parse or geocode failure is visible instead of vanishing:
   - `src/pages/api/admin/camps/[id]/approve.ts`
   - `src/pages/api/admin/camps/[id]/reject.ts`
   - `src/pages/api/admin/camps/[id]/verify.ts`
   - `src/pages/api/admin/camps/[id]/update.ts` (two sites: body parse, geocode)
   - `src/pages/api/camps/check.ts`
   - `src/pages/api/camps/submit.ts` (three sites: body parse, geocode, URL health check)
   - `src/pages/api/camps/suggest.ts`
   - Checked and left alone (correct validation pattern, not a silent failure): `src/pages/api/admin/link-health/recheck.ts` and `suggest-replacement.ts`'s `isHttpUrl()` catch blocks.

2. **Tamper-resistant sensitive-action receipts**, built from nothing:
   - `migrations-pcd-ops/0029_admin_action_receipts.sql` — append-only (BEFORE UPDATE/DELETE triggers that abort), hash-chained (`prev_hash`/`row_hash`), redacted (actor identity as a SHA-256 digest plus bare domain, never a raw email; reason/before/after bounded to 200 chars), unapplied to any live database by this session (migration only, per this repo's own production-safety convention for `migrations-pcd-ops/`).
   - `src/lib/admin-receipts.ts` — `recordAdminReceipt`, `verifyReceiptChain`, `digestActorEmail`, `computeRowHash`, `withAdminReceipt`. The last one refuses to report success to an API caller if the receipt write fails, even though the mutation already succeeded.
   - Wired into: `src/pages/api/admin/camps/[id]/approve.ts`, `reject.ts`, `verify.ts`, `photo.ts`, `update.ts`, `src/pages/api/admin/reviews/[id]/approve.ts`, `reject.ts`.
   - `tests/admin-receipts.test.ts` — runs the real migration DDL against Node's built-in `node:sqlite`, proving UPDATE/DELETE rejection, modified-row detection, deleted-row detection, reordered-row detection, no-raw-email storage, bounded-field truncation, and the receipt-failure-does-not-report-success contract.
   - Updated the 7 existing route test files (`tests/api/admin-camps-{approve,reject,verify,update,photo}.test.ts`, `tests/api/admin-reviews-{approve,reject}.test.ts`) with a mock of `admin-receipts` so their existing happy-path assertions still hold — receipt persistence itself is tested separately in `tests/admin-receipts.test.ts`, not re-mocked at the route level.

3. **Environment manifest**: `ENVIRONMENT-MANIFEST.md` (new, repo root) — names-only, no secrets, every database id cross-checked live against the Cloudflare account this session. Supersedes the stale `coordination/PRODUCTION_STAGING_MATRIX.md` (left in place as a historical record).

4. **STANDARD-AUDIT.md**: rewrote the Pillar 7 row, added three new Pillar 13 rows (13a/13b/13c), and added open items #61-#65 superseding the stale #21/#25/#26 claims and naming the two real gaps left open (receipts coverage, a scratch file that needs deleting).

## What is still open

1. **HIGH — Receipts cover 7 of 37 admin mutation routes.** `claims/[id]/update`, all of `editorial/*`, `suggestions/[id]/update`, `source-quality/*`, `agents/*`, `link-health/*`, and `data-quality/*` still mutate with no receipt. Extend `withAdminReceipt` to the rest of the admin surface.
2. **HIGH — No concurrency guard on most admin writes.** Per `ADMIN-ARCHITECTURE-REVIEW-2026-07-29.md`, most approve/reject routes outside camps/reviews are blind `UPDATE ... WHERE id = ?` with no status precondition — two admins racing the same row can silently double-act. Not touched this session (out of the receipts/manifest scope, but adjacent and worth its own pass).
3. **MEDIUM — No preview-level fault injection for admin writes.** Unit-level proof exists (the receipt-failure test); a live-preview test that interrupts a real request mid-flight does not yet exist.
4. **MEDIUM — Over-fetch / no pagination.** `src/pages/camps/index.astro` and `camps/[state]/[city]/index.astro` pull the full result set with no `LIMIT`. This is a `.astro` file — out of this session's lane by explicit instruction; reported for the UI/structure lane to pick up.
5. **LOW — N+1-shaped loops**, capped at 20-100 rows/run: `src/pages/api/cron/camps-sweep.ts`, `archiveStaleCamps` in `camps-db.ts`, and the enrichment worker. Would need a `db.batch()` rewrite.
6. **LOW — Naming drift.** Live schema's primary table is `programs`; app code, `camp_claims`, `camp_reviews`, and `camp_scan_queue` still say "camp." `sessions` is a real, distinct concept in the schema with no app-layer representation.
7. **LOW — Cleanup.** `tsconfig.receipts.json` at the repo root is scratch from this session's tsc check. Could not be deleted from this sandbox (`rm` returned `EPERM`); content overwritten with an inert marker. Delete before merging.
8. **Verification gap, both directions.** `npx vitest run` bus-errors in this sandbox on every test file, not just the new one — a pre-existing, previously documented limitation (see the Pillar 9 detail section of `STANDARD-AUDIT.md`), not something this session's changes caused. `tests/admin-receipts.test.ts` was validated by running its exact SQL/trigger logic directly via `node -e` against `node:sqlite` (confirmed UPDATE/DELETE both correctly rejected) rather than through vitest. `npx tsc --noEmit` could only be run against a narrow scratch config, because `node_modules/astro` is not actually installed in this sandbox; the real errors it caught (a `Record<string, unknown>` vs the real `Camp` type mismatch) were found and fixed, but a full project-config typecheck has not run this session.

## Human actions for Jeff

1. Run `npm run check` and `npx vitest run tests/admin-receipts.test.ts` (plus the 7 updated route test files) on your machine — this sandbox cannot run either.
2. Apply `migrations-pcd-ops/0029_admin_action_receipts.sql` to staging first, rehearse, then production, following the same exact-target review process the rest of `migrations-pcd-ops/` uses (see that folder's `README.md`). It is not applied anywhere yet.
3. Delete `tsconfig.receipts.json` at the repo root before merging — this sandbox could not remove it.
4. Decide whether to extend receipt coverage to the remaining 30 admin routes in the next session, or accept the current 7-route coverage as a phased rollout.
5. Review `ENVIRONMENT-MANIFEST.md` and keep it current the next time a wrangler config's bindings change.
