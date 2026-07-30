# Admin panel architecture review and workflow verification — 2026-07-29

Scope: all 61 protected routes under `/admin*` and `/api/admin*`. Method: source and test reading, plus **read-only `SELECT` queries against the three production D1 databases** via the Cloudflare MCP. No writes, no DDL, no migrations. One defect fixed (§4).

**What I could not do:** I cannot log in through Cloudflare Access, so I clicked nothing. Every "does it work" statement below is source-and-test reasoning, except where a live D1 query is cited — those are facts. I could not execute Vitest (the sandbox esbuild binary crashes), so no test in this report is claimed to pass. Tests are cited only for existence and for what they assert. §5 lists what a human with an Access login has to close.

---

> **UPDATE, same day, after this report was written.** Jeff ran `npx wrangler d1 migrations apply PCD_OPS_DB --remote --config wrangler.production.jsonc`. All 17 migrations applied clean. Verified by read-only query: `parent-coach-desk-ops-production` went from 4 tables to **76**, and all 20 tables the admin surface needs are present (`trust_cases`, `trust_case_events`, `trust_response_drafts`, `trust_response_draft_events`, `trust_response_delivery_attempts`, `content_suppressions`, `notification_outbox`, `demand_events_v1`, `events`, and the 10 `editorial_*` tables). The duplicate `0023` pair applied in filename order with no collision — `0023_affiliate_clicks.sql` uses `CREATE TABLE IF NOT EXISTS` and no-opped against the pre-existing table.
>
> **Item #45 is resolved.** Three residues survive it and are tracked separately — see the "Post-migration residue" section below. The Headline paragraph immediately following is preserved as written for the record.

## Headline

Auth is the strongest part of this system and needs no work. The problem is elsewhere: **roughly a third of the admin panel is pointed at database tables that do not exist in production.** A read-only query against `parent-coach-desk-ops-production` (`b38d5f37-54df-4e0f-9706-023edc12c7fe`) returns exactly four tables — `_cf_KV`, `affiliate_clicks`, `d1_migrations`, `sqlite_sequence` — and **`d1_migrations` is empty**. Not one of the 17 files in `migrations-pcd-ops/` has ever been applied. Every page and API that reads or writes `PCD_OPS_DB` other than `affiliate_clicks` is dead in production today.

The second problem is that the admin panel has no memory. There is no audit receipt of any kind for any admin action — no receipts table, no ops-DB row, no success log. `src/lib/events.ts` is a complete, working event writer with **zero callers** (`grep -rln "lib/events'" src/` returns nothing).

The third is concurrency. Seven human review queues, no claim or lock on any of them, and most approve/reject writes are blind `UPDATE ... WHERE id = ?` with no status precondition. The single lease mechanism in the codebase (`notification_outbox.lease_owner`, `migrations/0012:58`) is for machine delivery, never for humans.

---

## 1. Admin surface map

61 routes. `scripts/check-protected-routes.mjs` passes (I ran it — it is pure Node file reading, no build). Contract classes: 18 `app-auth` pages, 40 `mutation` routes, 3 `access-only`.

### Pages (22 `.astro` + 1 `.md`)

| Route | Purpose | Auth verified | Mutating | Live in prod |
|---|---|---|---|---|
| `/admin/` | 13 workspace tiles + affiliate inventory reconciliation from committed JSON | Y (`index.astro` requireAdmin) | N | Y |
| `/admin/operations` | 8-component ops status, links to each fix page | Y | N | Partial — `PCD_OPS_DB`/`FORGE_DB` components degrade |
| `/admin/camps/` | Approved-camp browse/search | Y | N | Y |
| `/admin/camps/[id]` | Single camp detail + edit + photo form | Y | Y | Y |
| `/admin/camps/queue` | The real moderation queue: edit, approve, approve+verify, reject, request-info | Y | Y (via fetch) | Y |
| `/admin/camps/spot-check` | Sampling QA: verify/reject in page | Y | Y (self-POST) | Y |
| `/admin/claims/` | Camp ownership claim queue | Y | N (posts to API) | Y, flag-gated |
| `/admin/reviews/` | Camp review moderation queue | Y | N (posts to API) | Y, flag-gated |
| `/admin/suggestions/` | Org suggestion queue + promote | Y | N (posts to API) | Y |
| `/admin/data-quality` | 11 issue lists + inline fixes + duplicate groups | Y | N (posts to API) | Y |
| `/admin/source-quality` | Per-domain approval stats, skip-list, bulk reject | Y | N (posts to API) | Y |
| `/admin/link-health/` | Up to 500 unresolved tracked URLs + 3 actions | Y | N (posts to API) | Y |
| `/admin/agents` | `agent_registry` + last 20 `agent_runs`, pause/resume/ack | Y | N (posts to API) | Y (see §2.6) |
| `/admin/affiliates` | Click analytics, 5 queries | Y | N | Y |
| `/admin/relationships` | Renders `automation/trusted-relationships-v1.json` | Y | N | Y (but see below) |
| `/admin/retention` | Retention aging report, 7 policies | Y | N | **No — all 7 rows render "Not installed"** |
| `/admin/search-signals` | Top 20 demand queries + send-to-editorial | Y | Y (posts to editorial API) | **No — `search_events` absent from ops DB** |
| `/admin/trust/` | Open trust cases + draft/update forms | Y | Y (posts to API) | **No — `trust_cases` absent** |
| `/admin/trust/drafts` | Protected response draft approval | Y | Y | **No** |
| `/admin/trust/deliveries` | Ambiguous delivery reconciliation | Y | Y | **No** |
| `/admin/editorial/` | Editorial lifecycle board | **N — `access-only`, prerendered** | Y (posts to 3 APIs) | Y (GitHub-backed portion) |
| `/admin/preview/[collection]/[slug]` | Draft content preview | N — `access-only` | N | Y |
| `/admin/image-needs` | Static markdown checklist | N — `access-only` | N | Y |

### APIs (37 + 2 dead mirrors)

All 37 verify independently. Grouped for brevity; every one calls `await requireAdmin(...)`, acts on the returned `Response`, and (for mutations) calls `requireSameOrigin`.

- **Camps (6):** `approve`, `reject`, `verify`, `request-info`, `photo`, `update` — all live.
- **Camps mirrors (2):** `/admin/api/camps/[id]/reject.ts`, `/admin/api/camps/[id]/verify.ts` — near-verbatim duplicates at a second URL. **Zero callers in `src/`.** Delete candidates.
- **Editorial, GitHub-backed (3):** `set-status`, `approve`, `publish` — live.
- **Editorial, D1-backed (10):** `approvals/update`, `briefs/create`, `claims/create`, `claims/[id]/validate`, `maintenance/update`, `opportunities/create`, `opportunities/[id]/update`, `relationships/create`, `reviews/create`, `sources/create` — **dark twice over**: `EDITORIAL_LIFECYCLE_ENABLED: "false"` in both `wrangler.jsonc:116` and `wrangler.production.jsonc:96`, *and* their tables do not exist.
- **Trust (5):** `[id]/update`, `[id]/draft`, `[id]/suppression`, `[id]/drafts/[draftId]/approve`, `[id]/deliveries/[attemptId]/reconcile` — **tables absent in prod.**
- **Link-health (3):** `recheck`, `resolve`, `suggest-replacement` — live.
- **Moderation (6):** `data-quality/fix`, `source-quality/skip`, `source-quality/reject-domain`, `suggestions/[id]/promote`, `suggestions/[id]/update`, `claims/[id]/update` — live.
- **Reviews (2):** `[id]/approve`, `[id]/reject` — live, flag-gated.
- **Agents (1):** `agents/[id]/update` — live in prod, **500s on staging** (`FORGE_DB` is bound in `wrangler.production.jsonc:30-31` but absent from `wrangler.jsonc`).

**Dead or dark: ~23 of 61 routes** (2 mirrors + 10 editorial D1 + 5 trust + 3 trust pages + retention + search-signals + relationships-as-a-page).

---

## 2. Architecture findings

### 2.1 — Is 61 routes the right shape? No. About a third is dead weight.

Three distinct kinds of dead:

1. **Duplicated.** `src/pages/admin/api/camps/[id]/{reject,verify}.ts` duplicate `src/pages/api/admin/camps/[id]/{reject,verify}.ts`. They diverge: the mirror `reject.ts:83-86` always returns a 303 to `/admin/camps/spot-check` with no `isForm` branch, so a JSON caller gets a redirect; the canonical one returns JSON unless the content-type says form (`src/pages/api/admin/camps/[id]/reject.ts:83-93`). No page in `src/` calls either mirror. The verify mirror has zero callers and zero tests. Two live URLs doing the same mutation with different response contracts is a maintenance hazard, not a feature.

2. **Shipped ahead of its schema.** The 10 editorial-D1 routes and 5 trust routes are code-complete, well-guarded, and well-tested at the unit level — against tables that were never created. This is the single largest source of "the admin panel doesn't do anything" in the whole review.

3. **A `cat` with Tailwind on it.** `src/pages/admin/relationships.astro` is 36 lines rendering a committed JSON file (`automation/trusted-relationships-v1.json`, imported at `:6`). No D1, no action, and its own copy at `:24` tells you the fix is to edit the JSON in the repo. `src/pages/admin/index.astro:119-162` renders a *committed* `reports/affiliate/inventory.json` on the landing page while `/admin/affiliates` renders *live* click data on the page that tile links to — two unaware affiliate views, one of them on the page you cannot avoid loading.

Genuine near-duplicates that should be one parameterized view: `claims/index.astro`, `reviews/index.astro`, and `suggestions/index.astro` are the same page three times — a status-filtered list, one row per item, one or two POST buttons per row, no filtering, no pagination, no claim. `claims/index.astro:23-28` and `reviews/index.astro:23-28` each issue **one `getCampById` per queue item inside a `for` loop in frontmatter** — unbounded N+1 on page render.

### 2.2 — Is the auth model sound and uniform? Yes. This is the best part of the system.

There is **no page-gated-but-API-open hole.** Three independent layers:

1. **Worker-level gate.** `src/worker.ts:22` calls `enforceAdministrativeRequest(request, env)` *before* delegating to Astro. `src/lib/admin-runtime-gate.ts:16-18` applies `requireAdmin` to every path matching `/admin`, `/admin/*`, `/api/admin`, `/api/admin/*`. This catches everything, including the prerendered pages.
2. **Static-asset bypass closed.** `wrangler.production.jsonc:20` and `wrangler.jsonc:24` both set `"run_worker_first": ["/admin", "/admin/*", "/api/admin", "/api/admin/*", ...]`, so prerendered admin HTML in `dist/` cannot be fetched around the Worker.
3. **Per-route gate.** I checked all 58 non-`access-only` routes programmatically for the pattern `const x = await requireAdmin(...)` followed by `if (x instanceof Response) return x`. **All 58 match.** The one flag my scan raised (`spot-check.astro`) is a real divergence but not a hole — see below.

`requireAdmin` (`src/lib/admin-auth.ts:116-147`) fails closed three ways: unset `ACCESS_TEAM_DOMAIN`/`ACCESS_AUD` → 503 (`:120-125`), empty `ADMIN_EMAILS` → 503 (`:126-131`), and the email is read **only** from a signature-verified JWT payload (`:87-95`), so a spoofed `Cf-Access-Authenticated-User-Email` header gets nowhere. `requireSameOrigin` compares full `.origin` including scheme and port (`:180-200`), not just host.

Three residual notes, all Low:

- **`admin/editorial/index.astro` bakes draft state into a static asset.** It is `prerender = true` (`:8`) and materializes every piece's `editorial` frontmatter — including unpublished drafts — into `dist/`. Defense rests entirely on the two edge/config facts above, not on page code. Delete the `run_worker_first` array and the page leaks silently, with no code change and no test failure covering that specific bypass. `tests/api/protected-route-contract.test.ts:6` only asserts `prerender = true` for the `access-only` class; it never asserts the `run_worker_first` coupling. **Recommend: add that assertion.**
- **`spot-check.astro:28-30` does not return the `requireSameOrigin` Response.** It sets a banner and falls through to render. Functionally still a block (no write happens), but the response is 200 HTML where every API route returns 403. Inconsistent, not exploitable.
- **Auth ordering is inverted in ~22 routes.** The `if (!env?.DB) return 503/500` binding check runs *before* `requireAdmin`, so an unauthenticated caller gets "database not available" instead of 401. Examples: `link-health/recheck.ts:31` vs `:33`, `data-quality/fix.ts:66` vs `:68`, `trust/[id]/update.ts:11-12`, `briefs/create.ts:13-15`. Unreachable in production because the Worker gate fires first, but it is the wrong order in the route.

### 2.3 — Is there a consistent mutation pattern? No. The rigor stops at the public surface, and it is inconsistent within admin.

**There is no admin audit trail at all.** No receipts table, no ops-DB action row, no success logging. Repo-wide grep for `admin_action`, `audit_log`, `action_receipts`, `content_overlay_receipts` returns nothing in this repo. The only "audit" is columns stamped on the mutated row itself (`reviewed_by`, `last_edited_by`), which are overwritten by the next writer and cannot reconstruct a sequence. `src/lib/events.ts` is a complete writer with zero callers, and `migrations-pcd-ops/0025_events.sql` creates its table — unapplied.

Compare the public surface, which is genuinely rigorous. `POST /api/trust/request` (`src/pages/api/trust/request.ts`) validates an `Idempotency-Key` header (`:52-53`), computes a SHA-256 request fingerprint (`:74`), returns the original id on replay (`:81`), 409s on key-reuse-with-different-payload (`:79`), and closes the race at the DB with `ON CONFLICT(intake_key) DO NOTHING` (`src/lib/trust-cases.ts:96`). **No admin route has any equivalent.** `src/lib/public-idempotency.ts:44` is public-route only.

Concurrency protection is a patchwork:

| Pattern | Where |
|---|---|
| **Correct — conditional UPDATE + `meta.changes` check** | `rejectCamp` (`camps-db.ts:918,922`), `reject-domain` (`domain-skip-list.ts:93-100`), trust draft approve (`trust-cases.ts:230-231,253` — strongest in the repo: id + case_id + status + expiry + content_hash all in the WHERE), trust update (`:604,622`), delivery reconcile (`:532-534,559`), all 5 editorial opportunity state transitions |
| **Batch used, `meta.changes` never checked** | `recordReview` (`editorial-records.ts:422`), `proposeMaintenance` (`:620`) |
| **Blind `WHERE id = ?`, no precondition** | camp verify (`camps-db.ts:1307`), camp request-info (`:730`), camp update (`:997`, `:1021`), photo (`:1329`), claim update (`:1143`), review approve (`:1493`), review reject (`:1508`), suggestion update (`:1224`), data-quality `runUpdate` (`data-quality-db.ts:189`), link-health resolve/suggest (`link-health.ts:148,162`) |

Half-applied write risk, concrete:

- **`suggestion promote` — worst case.** `suggestion-promotion.ts:121` batches the org + program INSERTs atomically, but the status flip to `imported` is a **separate call outside the batch** (`promote.ts:43` → `camps-db.ts:1224`). Batch commits, status update throws → orphaned draft program + org, suggestion still `pending`, and the next promote creates a *second* pair.
- **`camp update`** — two separate `.run()` calls, `UPDATE programs` (`camps-db.ts:996-999`) then `UPDATE organizations` (`:1019-1025`), no batch. Failure between them leaves a new name and slug on `programs` with a stale address on `organizations`. Note `approveCamp` batches exactly this pair (`:863`), so the codebase knows how.
- **`camp photo`** — R2 `PHOTOS.put` (`photo.ts:58`) then D1 `setHeroPhotoKey` (`:62`), no compensating delete. D1 failure orphans the object; replacing a photo always orphans the old one (key is `hero-${Date.now()}`, `:56`).
- **`camp approve`** — the `programs`/`organizations` pair is correctly batched, but `incrementSubmitterApproved` (`camps-db.ts:885`) and `upsertDomainQuality` (`approve.ts:79`) fire outside it.

### 2.4 — Are the queues actually queues? No. They are seven sorted lists.

| Queue | "Next item" | Claim/lock | Collision |
|---|---|---|---|
| camps queue | `pcd_status='pending' OR awaiting_review=1`, `ORDER BY submitted_at ASC` (`camps-db.ts:699-708`) | None | Yes |
| camps spot-check | Sampling query, same table | None | Yes |
| claims | `status IN ('pending','verified') ORDER BY submitted_at ASC` (`:1124`) | None | Yes — blind UPDATE, silent overwrite |
| reviews | `status='pending' ORDER BY submitted_at ASC` (`:1475`) | None | Yes — approve and reject can race, last wins, no signal |
| suggestions | status-filtered list | None | Yes — TOCTOU produces duplicate camps |
| link-health | Up to 500 unresolved, filter bar | None | Yes — last `resolved_by` wins |
| data-quality | 11 predicate-based issue lists, mostly uncapped | None | Yes |
| source-quality | Per-domain aggregate | N/A | Handled correctly by the `pcd_status='pending'` precondition |
| editorial | GitHub `sha` precondition | GitHub sha acts as an optimistic lock | Collision → 409 from GitHub, but **mapped to 502** |

The only lease in the codebase is `notification_outbox.lease_owner` (`migrations/0012_trust_drafts_and_notification_outbox.sql:55-58`) for machine delivery. No human queue has one. At single-admin scale this is fine; the moment a second person moderates, silent lost updates start and there is no audit trail to detect them.

Two queue-UI aggravators: `queue.astro` never disables a control while a request is in flight (no `disabled`/`inFlight` guard anywhere in `:501-628`), and `reviews/index.astro:84,87` uses plain `<form method="POST">`, so browser back-and-resubmit re-approves without complaint.

### 2.5 — Is D1 access shaped correctly? Yes on the security axis, sloppy on the scoping axis.

- **No client-side DB access.** Confirmed. No binding is exposed to the browser; every read and write is in Worker-rendered frontmatter or a Worker route, auth-checked first.
- **Bound parameters everywhere.** No user input is ever string-interpolated into SQL anywhere in the admin surface. Three files interpolate, all from hard-coded constants: `camps-db.ts:997,1021` (column names from the literal `pushProg`/`pushOrg` list), `data-quality-db.ts:75-77` (`LIMIT ${limit}` and `${whereClause}` from the literal list at `:136-149`), `retention-audit.ts:44-47` (`${policy.table}`, `${policy.dateColumn}`, `${policy.personalDataPredicate}` from the frozen array at `:21-29`), and `trust-cases.ts:526,532` (statuses from a module constant). Not injectable today; all four are the shape a careless future edit turns into an injection.
- **Row scoping — this is admin, so whole-table reads are legitimate, but several are uncapped:** `domain-skip-list.ts:44` (no WHERE, no LIMIT), `camps-db.ts:1872` (`listDomainQuality`, no WHERE, no LIMIT), `data-quality-db.ts:74-80` (10 of 11 issue lists have no LIMIT; the file's own comment at `:61-64` notes ~1450 rows behind one metric and caps only that one), `data-quality-db.ts:89-107` (`getDuplicateGroups` — a CTE over every approved program plus a self-join, the heaviest query on any admin page), and the three queue lists at `camps-db.ts:1124,1209,1475`.

### 2.6 — Live-data corrections to what the source alone suggests

Two things I could only settle by querying production:

- **`retention.astro` is worse than "wrong DB for six of seven rows."** It passes `PCD_OPS_DB` (`retention.astro:11`) to `runRetentionAudit`, whose `sqlite_master` probe (`retention-audit.ts:34`) will find **none** of the seven policy tables — `trust_cases` is not there either. Six live in the main `DB` (`activity-radar`, confirmed: `org_suggestions`, `camp_claims`, `camp_reviews`, `programs`, `submitters`, `search_events` are all present there), and `trust_cases` exists nowhere. The privacy-operations page renders "Not installed" for all seven and reports nothing about the personal data it exists to age. `tests/api/retention-audit.test.ts:38` cannot catch this because it feeds a hand-built fake DB with every table present.
- **`agents.astro` is live and working — the committed reconciliation docs understate it.** `automation/TASK-RUN-LOG-RECONCILIATION.md` marks every PCD task `pending` for run proof, and `tests/task-run-log-reconciliation.test.ts:26` is named "does not manufacture runtime execution evidence." But production `forge-command` has **21 `agent_runs` rows with `venture='pcd'`, latest `2026-07-29T07:04:42-07:00`**. Agent run logging is wired and firing. Minor bug found in passing: `agents.astro:44` filters `venture = 'pcd'` exactly, so the 2 rows tagged `'PCD'`, 1 tagged `'parent-coach-desk'`, and 1 tagged `'pcd, press'` are invisible to the page.

---

## 3. Workflow verification table

No test in this report is claimed to pass — Vitest cannot run in this sandbox. "VERIFIED IN SOURCE" means the full path is traced, auth is confirmed, the failure path is handled, **and** a test exists that I read covering it.

| Workflow | State | Evidence |
|---|---|---|
| camp reject | **VERIFIED IN SOURCE** | `api/admin/camps/[id]/reject.ts:18`; conditional UPDATE `WHERE id=? AND pcd_status != 'rejected'` (`camps-db.ts:918`), `transitioned` from `meta.changes` (`:922`). `tests/api/admin-camps-reject.test.ts` (7 cases incl. replay `:87`, race-shaped `:103`) + `tests/api/camps-db-reject-atomicity.test.ts:31,52,66` |
| camp verify | **VERIFIED IN SOURCE** | `verify.ts:18`; `campVerificationBlock` (`camps-db.ts:1285-1296`). `tests/api/admin-camps-verify.test.ts` (5 cases) + `tests/camp-verification-governance.test.ts:11,19`. Caveat: blind UPDATE at `camps-db.ts:1307`; no test drives the 409 through the route |
| camp request-info | **VERIFIED IN SOURCE** | `request-info.ts:25`; 9 cases in `tests/api/admin-camps-request-info.test.ts`. Caveat: blind overwrite (`camps-db.ts:730`) can pull a resolved camp back into the queue |
| camp approve | **BROKEN** | `approve.ts:55-57` reads prior state, `:78-80` gates the side effect on it. On replay `before.status='approved'` but `awaiting_review` is already 0, so `wasAlreadyApproved` is **false** and `upsertDomainQuality` + `incrementSubmitterApproved` fire again. The UPDATE at `camps-db.ts:868` has no `pcd_status` precondition, so `changes=1` both times. Double-counts domain trust and submitter approvals |
| camp "Approve + verified" (queue) | **BROKEN → FIXED** | `queue.astro:536` fired `POST /verify` *before* `POST /approve` (`:574`). Queue lists pending camps only (`camps-db.ts:699-708`); `campVerificationBlock` returns `not_approved` for anything not already approved (`:1287`). Verify always 409'd, response never read, camp left approved-but-unverified, admin saw "Approved". Fixed — see §4 |
| camp photo upload | **BROKEN** (low) | (a) `admin/camps/[id].astro:363` posts a non-JS multipart form to a JSON-only endpoint — success navigates the admin to a raw JSON blob. (b) `photo.ts:58-62` R2-then-D1 with no compensating delete; every replacement orphans an object |
| camp update | **UNPROVEN** | Best validation in the repo (`update.ts:118-210`), 11 test cases. But `camps-db.ts:996-999` and `:1019-1025` are two un-batched UPDATEs and no test exercises a failure between them. Blind `WHERE id=?`, no version column |
| spot-check submit | **UNPROVEN** | `spot-check.astro:27`. Zero tests invoke the POST handler; `tests/admin-spot-check-legacy-row.test.ts` covers render only. Divergence: `:45` skips the `upsertDomainQuality(...,'rejected')` both API reject routes perform, so domain trust depends on which screen you rejected from. No POST-redirect-GET — refresh re-submits |
| editorial set-status | **VERIFIED IN SOURCE** | `set-status.ts:91`; server re-reads current status from GitHub and checks the transition (`:189,203,215-219`), sha precondition on the PUT (`:245`). 16 cases in `tests/api/admin-editorial-set-status.test.ts` |
| editorial publish | **VERIFIED IN SOURCE** | `publish.ts:30` → `src/lib/publish.ts`; `already published` 409 (`:236`) + sha. 10 cases + `tests/api/publish-lib.test.ts` |
| editorial approve | **BROKEN** | `approve.ts:145` uses an ad-hoc slug check (`slug.includes('..') || slug.includes('/')`) instead of `isSafeSlug` (`src/lib/publish.ts:84`) used by its two siblings. A slug containing `?` or `#` is accepted and interpolated **unencoded** into `https://api.github.com/repos/${REPO}/contents/${path}?ref=${BRANCH}` at `:159` — the injected `?` terminates the path and the caller controls the query on an authenticated GitHub call. Admin-only, so Low severity, but real. Separately, `:79-86` has **no current-status precondition**, so a `published` piece can be silently reverted to `jeff-approved` |
| editorial brief/claim/opportunity/relationship/source create + claim validate + approvals update | **VERIFIED IN SOURCE** (code) — **dark in prod** | All correctly guarded with `db.batch` + `changes` checks (`editorial-records.ts:75-82,237,310-313,327-334,445-451,559`). Feature-flagged off (`wrangler.production.jsonc:96`) *and* `PCD_OPS_DB` has no editorial tables |
| editorial review create | **UNPROVEN** | `editorial-records.ts:422` — the `db.batch` result is never checked for `changes`, unlike every sibling. A lost status update on `pass` is silently swallowed |
| editorial maintenance propose | **UNPROVEN** | `editorial-records.ts:620` — same unchecked batch. (`decide` at `:638,651` is correct) |
| trust draft approve | **VERIFIED IN SOURCE** (code) — **dark in prod** | Strongest concurrency guard in the repo: `WHERE id=? AND case_id=? AND status='draft' AND expires_at > ? AND content_hash = ?` (`trust-cases.ts:230-231`) + `changes!==1` → 409 (`:253`). Payload hash recomputed and compared (`:224-225`) |
| trust update / draft create / delivery reconcile | **VERIFIED IN SOURCE** (code) — **dark in prod** | `trust-cases.ts:604,622` / `:175-196` / `:532-534,559`. Errors mapped from a hard-coded allowlist — cleanest error handling in the codebase |
| trust suppression | **UNPROVEN** | `trust-cases.ts:634-654` — dedupe is a read-then-return with no unique index enforced in code. Two concurrent posts insert two `proposed` rows |
| link-health recheck | **VERIFIED IN SOURCE** (with a leak) | `recheck.ts:29`, 8 cases. `link-health.ts:76` pushes `` `fetch threw: ${err.message}` `` into `notes`, persists it (`:126`), and `recheck.ts:56-58` returns the whole row including `notes`. Raw upstream error text in the response body — gate item 11. Also: `link-health.ts:138` computes `meta.changes` and `recheck.ts:55` discards it |
| link-health resolve | **VERIFIED IN SOURCE** | `resolve.ts:22`, `meta.changes` checked and acted on (`link-health.ts:150` → `:45-46` 409), 8 cases. Caveat: no `resolved_at IS NULL` precondition, so a second admin silently overwrites attribution |
| link-health suggest-replacement | **VERIFIED IN SOURCE** | `suggest-replacement.ts:35`, 6 cases. Caveat: the only link-health write that records no admin identity |
| data-quality fix | **VERIFIED IN SOURCE** (one honesty bug) | `fix.ts:64`, 12-action closed vocabulary, strong per-action typing. 7 cases — but none covers `reject_duplicate`, `swap_dates`, `upgrade_https`, or `derive_source_domain`. Honesty bug: `:159-164` ignores `result.transitioned` and hardcodes `changed: true`, so an already-rejected program reports success and the UI removes the row (`data-quality.astro:290-295`) |
| source-quality skip | **VERIFIED IN SOURCE** | `skip.ts:40`, upsert/delete so genuinely idempotent, 7 cases + `tests/api/domain-skip-list.test.ts:54,67` |
| source-quality reject-domain | **VERIFIED IN SOURCE** | `reject-domain.ts:48`; the cleanest guarded bulk update in the repo — `WHERE source_domain=? AND pcd_status='pending'` (`domain-skip-list.ts:93-96`), count returned. 6 cases + `domain-skip-list.test.ts:76,98` |
| suggestion promote | **BROKEN** | `promote.ts:38` reads `status !== 'imported'`, `:43` writes it — TOCTOU. The batch at `suggestion-promotion.ts:121` commits org + program; the status flip is outside it. Two concurrent promotes create two draft camps (and possibly two orgs — `findOrganizationIdByName:20-26` and `uniqueSlug:41` are equally racy). No `WHERE ... AND status != 'imported'` anywhere. No `reviewed_by`; `submitted_by_email` falls back to the literal `'admin-promoted@parentcoachdesk.com'` (`:114`) |
| suggestion update | **VERIFIED IN SOURCE** | `update.ts:17`, 5 cases. Caveat: no reviewer recorded at all — `org_suggestions` has no reviewer columns |
| claim update | **VERIFIED IN SOURCE** | `claims/[id]/update.ts:20`, flag-gated, 6 cases incl. a commerce-boundary case at `:58`. Caveat: blind UPDATE (`camps-db.ts:1143`) |
| review approve / reject | **VERIFIED IN SOURCE** | `reviews/[id]/{approve,reject}.ts:18`, 4 cases each. Caveats: blind UPDATE with no `WHERE status='pending'` (`camps-db.ts:1493`, `:1508`) so an already-rejected review can be silently approved; `camps-db` is `vi.mock`ed at `:6-8` so the SQL is never exercised; plain form POST means back-and-resubmit re-approves |
| agent run update (pause/resume/ack) | **UNPROVEN** | `agents/[id]/update.ts:28`. Best `meta.changes` handling in the set (`:55,58` → 404). **No test file exists** — `tests/api/` has no `admin-agents-update.test.ts`. Also 500s on staging (`FORGE_DB` unbound in `wrangler.jsonc`) |
| `POST /api/agent-runs` (machine) | **VERIFIED IN SOURCE** | `agent-runs.ts:85`. Best-validated route in the codebase: 64 KiB bounded body → 413 (`:102-106`), `SAFE_ID` regex (`:118-120`), explicit `typeof` checks against type confusion (`:141-149`), `ON CONFLICT` idempotency on `run_id` (`agent-runs.ts:117,140-147`), generic error body (`:193-197`). 30+ cases in `tests/api/agent-runs.test.ts` incl. `:365` "a D1 error returns a generic message, not the database error" |
| retention / privacy execution | **VERIFIED IN SOURCE — and there is no execution path** | `retention-audit.ts:33-48` issues only `SELECT`. No DELETE, UPDATE, DROP, purge helper, scheduled job, or API route anywhere in the retention path. Every policy is `proposal-only` or `counsel-required` (`:21-29`). `tests/api/retention-audit.test.ts:28` asserts read-only-by-construction. This is exactly what it claims to be — but it currently renders "Not installed" for all seven rows (§2.6) |

### Failure-path checks the standard requires

| Check | Result |
|---|---|
| Wrong password five times | N/A — no password auth. Cloudflare Access owns credential handling; the app never sees one |
| Reset for a nonexistent record | Covered — every route 404s on a missing id, and the tests assert it (approve `:83`, verify `:59`, reject `:121`, request-info `:92`, photo `:105`, claims `:78`, reviews `:56`, suggestions `:72`, link-health `:119`) |
| Double-clicked verification link | **Gap.** Camp verify is naturally idempotent; camp approve is not (double-counts); suggestion promote is not (duplicate camps); trust draft create is not (duplicate drafts); review approve/reject re-fires on browser back. No admin route accepts an `Idempotency-Key`, and `queue.astro` does not disable in-flight controls |
| Expired / tampered admin cookie | Covered by construction — `verifyAccessJwt` checks RS256 signature, `iss`, `aud`, `exp` against the team's published keys (`admin-auth.ts:81-95`); `tests/api/access-jwt.test.ts` and `tests/api/admin-auth.test.ts` cover it; `tests/anonymous-admin-probe.test.ts:11-12` asserts every contract route 302s to `fieldforge.cloudflareaccess.com` |
| Duplicate submit | See "double-clicked" above |
| Error messages do not leak | **Two violations.** (1) `link-health.ts:76` → `recheck.ts:56-58` returns raw upstream `err.message`. (2) All 10 editorial-D1 routes do `json({ ok:false, error: error.message }, 409)` on an untyped `instanceof Error` catch (`briefs/create.ts:38`, `reviews/create.ts:38`, `opportunities/[id]/update.ts:70`, etc.) — safe today because the messages are authored in `editorial-records.ts`, but any future D1 driver error reaches the body verbatim. Neither honors the bounded pattern the repo already uses at `approve.ts:162-171`, `set-status.ts:161-171`, `publish.ts:221-228`. Everything else is clean: fixed literals or enum codes, no SQL, no stack traces |
| Unguarded body parsing | 10 editorial-D1 routes call `await request.json()` with no try/catch (`approvals/update.ts:22`, `briefs/create.ts:21`, `claims/create.ts:20`, `claims/[id]/validate.ts:21`, `maintenance/update.ts:22`, `opportunities/create.ts:21`, `opportunities/[id]/update.ts:26`, `relationships/create.ts:21`, `reviews/create.ts:20`, `sources/create.ts:22`) → unhandled rejection → framework-default 500. Contrast `set-status.ts:107-111` and every trust route, which catch it |

---

## 4. Defects, severity, and what I changed

| # | Defect | Severity | Fixed |
|---|---|---|---|
| D1 | `PCD_OPS_DB` production has **zero migrations applied**; trust (8 routes), search-signals, retention, and the editorial lifecycle tables do not exist | **HIGH** (Pillar 8) | No — requires migrations, explicitly out of scope |
| D2 | queue "Approve + verified" fired verify before approve, always 409'd, camp left unverified with a success message | **HIGH** | **Yes** |
| D3 | suggestion promote: TOCTOU + status flip outside the batch → duplicate draft camps / orphaned program+org | **HIGH** | No — needs a conditional UPDATE inside the batch |
| D4 | camp approve replay double-counts `domain_quality.approved_count` and `submitters.approved_count` | MEDIUM | No — needs a `pcd_status` precondition in `camps-db.ts:868`, a shared-lib change I cannot test here |
| D5 | 11 admin writes are blind `UPDATE ... WHERE id = ?` with no status precondition; a second admin silently overwrites a decision with no audit trail to detect it | MEDIUM | No |
| D6 | No admin audit receipts anywhere; `src/lib/events.ts` has zero callers | MEDIUM | No |
| D7 | 10 editorial-D1 routes echo `error.message` and parse JSON unguarded | MEDIUM | No |
| D8 | `link-health.ts:76` persists and returns raw upstream `fetch threw:` text | MEDIUM | No |
| D9 | editorial `approve.ts:145` weak slug check → unencoded `?`/`#` into the GitHub API URL at `:159`; and no status precondition, so `published` can regress to `jeff-approved` | MEDIUM | No |
| D10 | `retention.astro:11` queries `PCD_OPS_DB` for tables that live in `DB` (subsumed by D1) | LOW | No |
| D11 | Two dead duplicate mirror routes at `/admin/api/camps/[id]/{reject,verify}` with divergent response contracts and zero callers | LOW | No |
| D12 | `data-quality/fix.ts:159-164` hardcodes `changed: true` for `reject_duplicate`; UI removes a row that did not change | LOW | No |
| D13 | Camp photo: non-JS form posts to a JSON-only endpoint; R2 orphans on every replace | LOW | No |
| D14 | `agents.astro:44` filters `venture = 'pcd'` exactly, hiding 4 rows tagged `PCD` / `parent-coach-desk` / `pcd, press` | LOW | No |
| D15 | GitHub sha-409 (concurrent edit) mapped to 502 upstream-failure in all three editorial routes (`approve.ts:260`, `set-status.ts:260`, `publish.ts:260`) | LOW | No |
| D16 | spot-check reject skips `upsertDomainQuality` (`spot-check.astro:45`), so domain trust depends on which screen you rejected from | LOW | No |
| D17 | Env-binding check runs before `requireAdmin` in ~22 routes → 500 instead of 401 (unreachable behind the Worker gate) | LOW | No |
| D18 | `editorial/index.astro` bakes draft state into a static asset; the `access-only` contract test never asserts the `run_worker_first` coupling that protects it | LOW | No |
| D19 | `spot-check.astro:28-30` does not return the `requireSameOrigin` Response — 200 HTML where every API returns 403 | LOW | No |

### The one change: D2

**File:** `src/pages/admin/camps/queue.astro`, two edits in the client-side click handler.

Before, `approve-verified` fired `POST /verify` at `:536` and then set `endpoint` to `/approve`, which ran at `:574`. The queue only lists pending camps (`camps-db.ts:699-708`) and `campVerificationBlock` returns `not_approved` for anything whose status is not already `approved` (`camps-db.ts:1287`). So the verify call returned 409 on every single click. Its response was never read. The camp got approved and stayed unverified, and the admin saw "Approved".

After: the verify call moved to inside the `if (data.ok)` branch, so it runs only after the approve succeeds, and its response is now checked. Success shows "Approved + verified". Failure shows `Approved, but NOT verified: <error>` and leaves the row in place instead of fading it out.

**Blast radius:** one file, client-side JavaScript only. No server route, no SQL, no auth path, no shared lib, no visual design. `tests/commerce-boundary.test.ts:11` loads this file but only asserts the absence of commerce strings; no test asserts the fetch ordering. `automation/protected-route-contract.json` classifies the file as `mutation` and the checker asserts only that the source mentions `requireAdmin` and `requireSameOrigin` — both untouched. I could not run the suite, so this needs the CI green check before merge.

---

## 5. Needs a human with an Access login

Log in and work down this list. Each item names what to click and what correct looks like.

**Confirm the fix (D2)**

1. `/admin/camps/queue` → pick a pending camp → **Approve + verified**. Correct: status text reads "Approved + verified" and the row fades out. Then open `/admin/camps/[that id]` and confirm the camp shows as verified with a `last_verified_at` timestamp. Before this fix it would have been approved and unverified.
2. Same page, pick a pending camp with an **http-only** source URL → **Approve + verified**. Correct: "Approved, but NOT verified: source_not_https", and the row stays visible.

**Confirm the dead subsystem (D1) — five minutes, settles the biggest item**

3. `/admin/trust/` → correct-as-shipped renders "Trust-case table unavailable or query failed." Confirm that is what you see. Same for `/admin/trust/drafts` and `/admin/trust/deliveries`.
4. `/admin/retention` → confirm all seven rows read "Not installed" with em-dashes for every count.
5. `/admin/search-signals` → confirm the "table not ready" state rather than query data.
6. `/admin/operations` → note which components report degraded. That page is the fastest read on how much of the ops DB is missing.

**Duplicate-submit behavior (the standard's explicit requirement)**

7. `/admin/camps/queue` → **double-click Approve fast** on one camp. Then check that camp's `source_domain` in `/admin/source-quality` — if the approved count jumped by 2, D4 is confirmed live.
8. `/admin/suggestions/` → open the same suggestion in two tabs, click **Promote** in both. Correct behavior would be one camp created and a 409 on the second. Expected today: two draft camps. Check `/admin/camps/` for a duplicate.
9. `/admin/reviews/` → approve a review, hit browser **Back**, resubmit the form. Confirm whether it re-approves silently.
10. `/admin/camps/[id]` → submit the **photo upload form** with JavaScript doing nothing. Confirm whether you land on a raw JSON page (D13).

**Error leakage (gate item 11)**

11. `/admin/link-health/` → **Recheck** a URL whose host does not resolve (a dead domain in the list). Read the note rendered on the row. If it says `fetch threw: <raw runtime message>`, D8 is confirmed live.

**Untested route (D-agents)**

12. `/admin/agents` → **Pause**, then **Resume**, then **Acknowledge** a run. Confirm each reflects in the table on reload. This route has no test file at all, so this click is the only coverage it has.
13. Same page → confirm whether the run list looks short. Production has 21 rows tagged `pcd` plus 4 tagged other spellings that the page filter hides (D14).

**Concurrency spot-check (optional, needs two browsers)**

14. Open `/admin/claims/` in two Access sessions, set the same claim to `verified` in one and `rejected` in the other. Correct behavior would be a 409 on the second. Expected today: last write wins, silently, with no record that the first decision existed.

---

## 6. Architecture recommendation

**Do not rebuild.** The auth model is better than most production systems I read, the validation on the newer routes is genuinely strong, and the test suite is real. The problems are a schema that never shipped, a missing audit layer, and a queue abstraction that was never written. All three are additive.

In priority order:

**A. Apply `migrations-pcd-ops/` to production, or delete the code that depends on it. (~1 day either way, and it is a decision, not a task.)**
Seventeen migration files, zero applied. You are carrying 20 routes, 5 pages, and their tests for a subsystem that cannot run. Two honest options: apply the migrations and bring trust/privacy/demand online, or move that code to `wip-archive/` and shrink the admin surface to what exists. What you should not do is leave it as-is, because `STANDARD-AUDIT.md` and the roadmap both read as though trust intake is operational. Note the ordering hazard: `0023` is duplicated (`0023_affiliate_clicks.sql` and `0023_affiliate_recommendation_lifecycle.sql`), and `affiliate_clicks` already exists in production despite `d1_migrations` being empty — so the table was created out-of-band and a naive `wrangler d1 migrations apply` may collide. Resolve that before running anything.

**B. One shared admin mutation helper. (~2 days.)**
Not a rewrite — a wrapper the mutating routes call instead of hand-rolling the same five steps. It would do: guarded body parse, the conditional-UPDATE-plus-`meta.changes` check that six routes already do correctly, a bounded error mapper (the pattern already exists at `approve.ts:162-171`), and an audit row via the `events.ts` writer that is already written and has zero callers. This single change closes D5, D6, D7, D8, and most of D4 at once, and it makes the correct pattern the path of least resistance for the next route. The precedent to copy is `trust-cases.ts:230-231` — the strongest guard in the repo.

**C. Collapse the three list-with-buttons pages into one parameterized queue view. (~2 days.)**
`claims/index.astro`, `reviews/index.astro`, and `suggestions/index.astro` are the same page three times, and two of them have an unbounded N+1 in frontmatter. One `/admin/queue/[kind]` route with a per-kind config (query, columns, actions) would delete two pages, fix the N+1 once, and give you one place to add the claim mechanism in D. I would **not** fold in `camps/queue`, `data-quality`, `link-health`, or `source-quality` — those four have genuinely different interaction models (inline editing, per-issue fix widgets, per-domain aggregates) and forcing them into a shared shell would cost more than it saves.

**D. A claim column, not a lock service. (~half a day, after B.)**
`claimed_by` + `claimed_at` on the four human queue tables, set on open, cleared on action, ignored after 15 minutes. That is enough for a two-person team and it costs one column and one `WHERE` clause. Do not build a lease service; `notification_outbox` already shows what that costs and it is only justified there because a machine retries.

**E. Delete the dead. (~1 hour.)**
The two mirror camp routes (D11), `relationships.astro`, and either the landing-page affiliate block or `/admin/affiliates` — not both.

### What I would not change, and why

- **The auth model.** Three independent layers, fails closed three ways, verified signature not header trust, `run_worker_first` closing the static-asset bypass, and a contract script that catches an unclassified route at CI. The only thing I would add is one assertion coupling `access-only` to `run_worker_first` (D18). Leave the rest alone.
- **The GitHub-backed editorial routes.** `set-status` and `publish` re-read server state, use the sha as an optimistic lock, and have 26 test cases between them. They are correct. Fix `approve` to match them (D9); do not move any of the three to D1 to "unify the data layer" — git is the right store for content state and the sha is a free optimistic lock.
- **`retention.astro`'s read-only design.** It refuses to delete anything and says so in three places. That is the right posture for privacy execution. Point it at the correct database; do not add an execute button.
- **The Astro-page-renders-its-own-data pattern.** It is unfashionable and it is right here: server-rendered frontmatter behind a Worker gate means no client-side DB access and no separate read API to secure. Moving these to a client-fetch SPA would add attack surface and buy nothing.

---

## 6a. Fix pass — what shipped, 2026-07-29 (after the report body was written)

Jeff authorized fixing all outstanding defects in one pass. **None of this is test-verified** — Vitest cannot execute in the audit sandbox. Every claim below is source reasoning plus a read of the covering tests. CI is the gate.

**Fixed**

| Was | Now | Files |
|---|---|---|
| Approve+verify fired verify before approve, always 409'd | Verify runs after a successful approve, result checked, distinct "Approved, but NOT verified" state | `admin/camps/queue.astro` |
| Camp approve replay double-counted domain trust + submitter credit | `pcd_status != 'approved'` precondition in the batch; side effects gated on the UPDATE's own `meta.changes`, not a prior read | `lib/camps-db.ts`, `api/admin/camps/[id]/approve.ts` |
| Review approve/reject, claim update, suggestion update were blind UPDATEs | All four carry a status precondition and report `transitioned`; routes 409 instead of silently overwriting another admin's decision | `lib/camps-db.ts`, `reviews/[id]/{approve,reject}.ts`, `claims/[id]/update.ts`, `suggestions/[id]/update.ts` |
| Suggestion promote: TOCTOU, two clicks made two camps | Claim-first — the guarded status flip is now the atomic claim before any insert; loser gets 409 | `suggestions/[id]/promote.ts` |
| `reject_duplicate` reported `changed: true` unconditionally | Reports the real value; already-rejected returns 409 so the UI stops removing an unchanged row | `data-quality/fix.ts` |
| `fetch threw: <raw runtime message>` persisted to D1 and returned in the body | Four bounded enum strings classified by error name/code; real error to `console.error` | `lib/link-health.ts`, `link-health/recheck.ts` |
| 10 editorial routes: unguarded `request.json()` + raw `error.message` echoed | Guarded parse → 400 fixed literal; per-route allowlist of known domain messages, everything else collapses to a logged slug | 10 files under `api/admin/editorial/` |
| Editorial approve: ad-hoc slug check, unencoded into the GitHub URL; no status precondition | `isSafeSlug` + `encodeURIComponent`; refuses re-approving a `published` piece | `editorial/approve.ts` |
| `recordReview` / `proposeMaintenance` batches never checked `meta.changes` | Checked, throw 'changed concurrently' like every sibling | `lib/editorial-records.ts` |
| GitHub sha-409 reported as 502 upstream outage | Maps to 409 `content_changed_concurrently` | `editorial/approve.ts`, `set-status.ts` |
| `/admin/retention` audited 6 tables in the wrong database | Per-policy `binding`; `runRetentionAudit` takes both DBs and routes each policy. Still SELECT-only | `lib/retention-audit.ts`, `admin/retention.astro` |
| `/admin/agents` hid rows tagged `PCD`, `parent-coach-desk`, `pcd, press` | Normalized bound predicate matching all spellings; `err.message` no longer rendered to the DOM | `admin/agents.astro` |
| Spot-check reject skipped `upsertDomainQuality`; same-origin failure returned 200 HTML; refresh re-submitted | Domain-quality parity with the API route, real 403 returned, POST-redirect-GET added | `admin/camps/spot-check.astro` |
| Photo upload dumped the admin on raw JSON; R2 orphans on every replace | 303 back to the camp page on form post; compensating R2 delete on D1 failure; previous hero deleted on replace, prefix-guarded | `camps/[id]/photo.ts`, `admin/camps/[id].astro` |
| Two dead duplicate mirror routes with a divergent contract | Deleted, contract entries removed, `check-protected-routes` passes at 59 routes | `admin/api/camps/[id]/{reject,verify}.ts` |

**Deliberately not fixed, with reasons**

- **`src/lib/publish.ts` sha-409 → 409.** `tests/api/publish-lib.test.ts:182-191` explicitly asserts `code: 502` for a rejected commit. Changing the code without changing that assertion breaks CI; changing the assertion is a behavior decision, not a defect fix. So `publish` still reports a concurrent edit as 502 while `approve` and `set-status` now report 409. **Needs your call.**
- **Auth ordering (binding check before `requireAdmin`, ~22 routes).** Reordering looks obviously right, but several tests assert a 500 "database not available" *without* supplying valid auth — e.g. `admin-camps-request-info.test.ts:49`. Reordering turns those into 401s and breaks them. The ordering is unreachable in production anyway because the Worker gate fires first. Left alone on purpose.
- **True single-transaction promote.** `suggestion-promotion.test.ts:53,70` assert exact batch lengths of 2 and 1, and `admin-suggestions-promote.test.ts:68` asserts exact call arity, so the status flip cannot move inside `db.batch` without editing those tests. Claim-first closes the duplicate-camp bug within that constraint. Residual: if the insert batch throws after the claim, the suggestion is marked `imported` with no draft behind it and cannot be re-promoted. Logged, not silent. A `releaseOrgSuggestionClaim` helper would close it.
- **The admin audit trail (`events.ts`, zero callers).** Architecture work, not a broken button. Its table now exists in production, so it is cheaper than it was.

**Blocks CI until someone acts**

1. **`tests/anonymous-admin-probe.test.ts` will fail.** It asserts `route_count === protectedRoutes.routes.length` against `coordination/release-evidence/anonymous-access-2026-07-18.json`, which records 61 routes including the two deleted mirrors. The contract is now 59. That file is live probe evidence — it must be regenerated by re-running `scripts/probe-anonymous-admin.mjs`, not hand-edited. I did not touch it; release evidence was out of scope by instruction.
2. **`tests/operational-db-separation.test.ts` passes but encodes a now-false invariant** — "retention state routes only through `PCD_OPS_DB`". Six of seven audited tables live in the shared `DB`. The page still never names `.DB` itself, so the regex passes, but the guard no longer means what it says. Decide whether `retention.astro` comes off `operationalFiles` with a read-only exemption note.

---

## 6b. Post-migration residue

The migration closed the schema gap. Three things it did **not** close, all verified by read-only query after the apply:

**R1 — `/admin/retention` is still broken, and now for a clearer reason.** Only 1 of its 7 policy tables (`trust_cases`) exists in `PCD_OPS_DB`. The other six — `search_events`, `org_suggestions`, `camp_claims`, `camp_reviews`, `programs`, `submitters` — live in the main `DB` (`activity-radar`), confirmed present there. `src/pages/admin/retention.astro:11` passes only `PCD_OPS_DB`, so six rows still render "Not installed". Before the migration this looked like a symptom of the missing schema; it is not. It is an independent wiring bug: `runRetentionAudit` (`src/lib/retention-audit.ts:33`) takes a single `D1Database` but its policy list (`:21-29`) spans two. Fix is to give each policy a binding and pass both databases. `tests/api/retention-audit.test.ts:38` cannot catch it because it feeds one fake DB with every table present.

**R2 — the 10 editorial-D1 routes are still dark.** `EDITORIAL_LIFECYCLE_ENABLED: "false"` in `wrangler.production.jsonc:96` and `wrangler.jsonc:116`. Their tables now exist, so flipping the flag is the only remaining step — but do it after the fixes in #49 (unguarded `request.json()` and `error.message` echo) and #47 (the two unchecked `db.batch` results at `editorial-records.ts:422` and `:620`), not before. Turning on ten routes that leak driver messages and swallow lost updates is worse than leaving them off.

**R3 — staging is now four migrations behind production.** `parent-coach-desk-ops-staging` (`7f0da00d`) sits at `0022`, applied 2026-07-16. It has no `affiliate_clicks`, no `editorial_*`, no `events`, no `proof_inbox`. Production is ahead of the surface that is supposed to rehearse it, which inverts the point of having a staging DB. Run the same command against `wrangler.jsonc` to bring it level.

Also still worth doing before the next apply: **rename one of the two `0023` files to `0027`.** It worked this time by luck of alphabetical ordering and an `IF NOT EXISTS`. Two migrations sharing a number is not a replayable sequence, and the next person to rebuild this database from scratch has no guarantee of the same order.

One thing the migration made cheaper: the `events` table now exists in production, so wiring `src/lib/events.ts` (item #48, currently zero callers) no longer needs a schema change. That is the lowest-effort high-value item left on the list.

---

## 7. Draft `STANDARD-AUDIT.md` open items (#45–#50)

Numbered 45–50 per Jeff's instruction, leaving 39–44 for the concurrent UI pass. Paste into the Open items table.

| 45 | MEDIUM | 8 — Operations | **2026-07-29. Ops-DB schema gap found and closed the same day; three residues remain.** Found: `parent-coach-desk-ops-production` (`b38d5f37-54df-4e0f-9706-023edc12c7fe`) had 4 tables and an **empty** `d1_migrations` — none of the 17 files in `migrations-pcd-ops/` had ever run, so the whole trust subsystem, search-signals, retention, and the editorial-lifecycle routes were querying tables that did not exist. The pages degrade to an error banner rather than 500ing, which is why it went unnoticed. Closed the same day via `npx wrangler d1 migrations apply PCD_OPS_DB --remote --config wrangler.production.jsonc`; all 17 applied clean, verified at 76 tables with all 20 admin-required tables present. **Residues, all still open:** (a) **`/admin/retention` is still wrong, independently of the schema.** Only `trust_cases` of its 7 policy tables lives in `PCD_OPS_DB`; `search_events`, `org_suggestions`, `camp_claims`, `camp_reviews`, `programs`, and `submitters` are all in the main `DB` (`activity-radar`). `src/pages/admin/retention.astro:11` passes one binding, but `RETENTION_AUDIT_POLICIES` (`src/lib/retention-audit.ts:21-29`) spans two, so six rows still render "Not installed". Fix is a per-policy binding and both databases passed in; `tests/api/retention-audit.test.ts:38` cannot catch it because it feeds one fake DB with every table present. (b) **Staging is now four migrations behind production** — `parent-coach-desk-ops-staging` (`7f0da00d`) sits at `0022` from 2026-07-16, missing `affiliate_clicks`, `editorial_*`, `events`, `proof_inbox`. The rehearsal surface is behind the thing it rehearses; apply the same command against `wrangler.jsonc`. (c) **`migrations-pcd-ops/` still contains two files numbered `0023`.** The apply succeeded only because filename ordering happened to be benign and `0023_affiliate_clicks.sql` uses `CREATE TABLE IF NOT EXISTS`. Rename one to `0027` so the sequence is replayable from scratch. Sequencing note: the 10 editorial-D1 routes now have their tables but remain flag-gated off (`wrangler.production.jsonc:96`) — leave the flag off until items #47 and #49 are fixed, since turning on ten routes that echo driver messages and swallow lost updates is worse than leaving them dark. |
| 46 | HIGH | 7 — Code norms | **2026-07-29. `suggestion promote` is non-atomic and racy; two clicks can create two camps.** `src/pages/api/admin/suggestions/[id]/promote.ts:38` reads `status !== 'imported'` and `:43` writes it — a read-then-decide with no conditional `WHERE`. The org and program INSERTs are correctly batched at `src/lib/suggestion-promotion.ts:121`, but the status flip sits **outside** that batch, so a throw between them leaves an orphaned draft program + organization with the suggestion still `pending`, and the next promote creates a second pair. `findOrganizationIdByName` (`:20-26`) and `uniqueSlug` (`:41`) are equally racy. No `reviewed_by` is recorded anywhere; `submitted_by_email` falls back to the literal `'admin-promoted@parentcoachdesk.com'` (`:114`). Fix is to move the status flip into the batch as `UPDATE org_suggestions SET status='imported' WHERE id=? AND status!='imported'` and check `meta.changes`, which is the pattern `rejectCamp` already uses at `src/lib/camps-db.ts:918,922`. Sequential double-click is caught by the 409; simultaneous is not, and the UI masks it by navigating away (`src/pages/admin/suggestions/index.astro:102,115`). |
| 47 | MEDIUM | 7 — Code norms | **2026-07-29. Eleven admin writes are blind `UPDATE ... WHERE id = ?` with no status precondition, so a second admin silently overwrites a decision and nothing records that the first one happened.** Affected: camp verify (`camps-db.ts:1307`), request-info (`:730`), camp update (`:997` and `:1021`, which are also two un-batched statements), photo (`:1329`), claim update (`:1143`), review approve (`:1493`), review reject (`:1508`), suggestion update (`:1224`), data-quality `runUpdate` (`data-quality-db.ts:189`), link-health resolve and suggest-replacement (`link-health.ts:148,162`). Concrete consequence: an already-rejected camp review can be silently approved, and `src/pages/admin/reviews/index.astro:84,87` uses a plain form POST so browser back-and-resubmit re-fires it. Related and separate: **camp approve double-counts on replay** — `src/pages/api/admin/camps/[id]/approve.ts:55-57` reads prior state and `:78-80` gates the side effect on `wasAlreadyApproved`, but on the second approve `awaiting_review` is already 0, so the flag is false and `upsertDomainQuality` + `incrementSubmitterApproved` both fire again; the UPDATE at `camps-db.ts:868` guards only the session dates, not `pcd_status`, so `changes` is 1 both times. Six routes in this repo already do this correctly (`camps-db.ts:918`, `domain-skip-list.ts:93-100`, `trust-cases.ts:230-231`); the fix is to make that the default rather than the exception. `src/pages/admin/camps/queue.astro` also never disables a control while a request is in flight, which turns every non-idempotent endpoint into a double-click hazard. No admin route accepts an `Idempotency-Key`, unlike the public `POST /api/trust/request` (`src/pages/api/trust/request.ts:52-53,74-81`). |
| 48 | MEDIUM | 1 — Security / 8 — Operations | **2026-07-29. The admin panel has no audit trail of any kind, and the event writer built for it has zero callers.** No receipts table, no ops-DB action row, no success logging for any of the 37 admin mutations. Repo-wide grep for `admin_action`, `audit_log`, `action_receipts`, and `content_overlay_receipts` returns nothing in this repo — the hash-chained receipts referenced in earlier planning notes do not exist here. The only trace of an admin decision is columns stamped on the mutated row (`reviewed_by`, `last_edited_by`, `resolved_by`), which the next writer overwrites and which cannot reconstruct a sequence. Three writes record no identity at all: `link-health suggest-replacement` (`src/lib/link-health.ts:161-163`), `suggestion update` (`org_suggestions` has no reviewer columns, `camps-db.ts:1164-1175`), and `agent run acknowledge` (`src/pages/api/admin/agents/[id]/update.ts:57`). `src/lib/events.ts` is a complete, working event writer with **no importers anywhere in `src/`**, and its table (`migrations-pcd-ops/0025_events.sql`) is unapplied per item #45. Combined with #47, a lost update is currently both possible and undetectable. Cheapest path: wire `events.ts` into a shared admin mutation helper so every route gets an audit row for free. |
| 49 | MEDIUM | 1 — Security | **2026-07-29. Two admin error paths leak raw upstream text, against gate item 11, and ten routes parse request bodies unguarded.** (a) `src/lib/link-health.ts:76` pushes `` `fetch threw: ${(err as Error).message}` `` into the row's `notes`, persists it (`:126`), and `src/pages/api/admin/link-health/recheck.ts:56-58` returns the whole row — so raw runtime/upstream error text reaches the response body and the dashboard (`src/pages/admin/link-health/index.astro:132`). No test asserts anything about `notes`. (b) All ten editorial-D1 routes end their catch with `json({ ok:false, error: error.message }, 409)` on an untyped `instanceof Error` — e.g. `briefs/create.ts:38`, `reviews/create.ts:38`, `opportunities/[id]/update.ts:70`. Safe today because the messages are authored in `editorial-records.ts`, but any future D1 driver error reaches the body verbatim. Neither honors the bounded pattern this repo already uses at `src/pages/api/admin/editorial/approve.ts:162-171`, `set-status.ts:161-171`, and `src/lib/publish.ts:221-228`. (c) The same ten routes call `await request.json()` with no try/catch (`approvals/update.ts:22`, `briefs/create.ts:21`, `claims/create.ts:20`, `claims/[id]/validate.ts:21`, `maintenance/update.ts:22`, `opportunities/create.ts:21`, `opportunities/[id]/update.ts:26`, `relationships/create.ts:21`, `reviews/create.ts:20`, `sources/create.ts:22`), so a malformed body produces an unhandled rejection and a framework-default 500 — contrast `set-status.ts:107-111` and every trust route, which catch it. Also in this class: `src/pages/api/admin/editorial/approve.ts:145` uses an ad-hoc slug check instead of the `isSafeSlug` its two siblings use, so a slug containing `?` or `#` is interpolated **unencoded** into the GitHub API URL at `:159`, and `:79-86` has no status precondition so a `published` piece can be silently reverted to `jeff-approved`. |
| 50 | MEDIUM | 7 — Code norms | **2026-07-29. About 23 of the 61 admin routes are dead, dark, or duplicated, including two live duplicate mutation URLs with divergent response contracts.** `src/pages/admin/api/camps/[id]/reject.ts` and `verify.ts` are near-verbatim copies of the canonical `/api/admin/camps/[id]/` pair, differing in their response contract — the mirror `reject.ts:83-86` always 303s to `/admin/camps/spot-check` with no `isForm` branch, so a JSON caller gets a redirect. **Neither has a caller anywhere in `src/`**, and the verify mirror has no test. Also effectively dead: `src/pages/admin/relationships.astro` (36 lines rendering the committed `automation/trusted-relationships-v1.json`, no D1, no action, its own copy at `:24` telling you to edit the JSON instead), and the affiliate block at `src/pages/admin/index.astro:119-162`, which renders a *committed* `reports/affiliate/inventory.json` on the landing page while `/admin/affiliates` renders *live* click data on the page that tile links to. Separately, `claims/index.astro`, `reviews/index.astro`, and `suggestions/index.astro` are the same page three times — status-filtered list, one row per item, one or two POST buttons, no filtering, no pagination, no claim mechanism — and `claims/index.astro:23-28` and `reviews/index.astro:23-28` each issue one `getCampById` per queue item inside a `for` loop in frontmatter (unbounded N+1 on render). Proposal, not started: collapse those three into one `/admin/queue/[kind]` parameterized view with a per-kind config, which fixes the N+1 once and gives a single place to add a `claimed_by`/`claimed_at` column. `camps/queue`, `data-quality`, `link-health`, and `source-quality` should stay separate — their interaction models genuinely differ. Smaller items in the same class: `data-quality/fix.ts:159-164` hardcodes `changed: true` for `reject_duplicate` so the UI removes an unchanged row; `src/pages/admin/agents.astro:44` filters `venture = 'pcd'` exactly, hiding the 4 production rows tagged `PCD` / `parent-coach-desk` / `pcd, press`; `src/pages/admin/camps/spot-check.astro:45` skips the `upsertDomainQuality(...,'rejected')` both API reject routes perform, so domain trust scoring depends on which screen the admin rejected from; and GitHub sha-409 conflicts are mapped to 502 in all three editorial routes, making a concurrent-edit collision read as an upstream outage. |

### Session note to append

**Session note 2026-07-29 (admin architecture review).** Full read-only architecture and workflow audit of all 61 admin routes; report at `ADMIN-ARCHITECTURE-REVIEW-2026-07-29.md`. Auth model verified sound across three independent layers and left untouched. One defect fixed: `src/pages/admin/camps/queue.astro` fired `POST /verify` before `POST /approve` on the "Approve + verified" action, which always 409'd (`campVerificationBlock` refuses any camp not already approved, `src/lib/camps-db.ts:1287`), silently leaving camps approved-but-unverified while showing "Approved". The verify call now runs after a successful approve and its response is checked. Client-side JS only, one file. Not verified by test run — the sandbox cannot execute Vitest — so CI green is required before merge. Six new open items filed, #45–#50.
