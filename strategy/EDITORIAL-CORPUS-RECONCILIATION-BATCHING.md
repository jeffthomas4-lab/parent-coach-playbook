# Legacy corpus reconciliation: batching approach

`reports/editorial/lifecycle.json` labels all 1,852 existing content items `legacy` -- published, but not evidence-complete under the gates defined in `strategy/EDITORIAL-CONTENT-LIFECYCLE.md`. Reconciling an item means creating real `editorial_opportunities`/`editorial_sources`/`editorial_claims`/`editorial_relationships`/`editorial_approvals` rows (migration `0024`) that honestly reflect evidence actually gathered for that piece, or leaving it explicitly `legacy` if that evidence cannot be produced. This document is the batching plan, not the reconciliation itself -- no item's status changes as a result of this document.

## Why this cannot be automated

Marking existing content "approved" requires someone to actually check its factual claims against a real source, decide its monetization/disclosure status, and record their name against that judgment. An agent fabricating plausible-looking source URLs and claim text to fill the schema would produce exactly the failure mode `strategy/EDITORIAL-CONTENT-LIFECYCLE.md` exists to prevent: false confidence dressed as evidence. Every reconciliation record must trace to a source a human actually opened.

## Batch size and order

Small pilot first, per the kickoff instruction. Proposed order, smallest and highest-leverage collection first:

1. **Pilot: `pillar` (17 items).** The smallest collection, and each pillar page is a hub other content links to -- reconciling it first gives the `editorial_relationships` table real hub_child targets for every other collection's reconciliation. See the candidate list below.
2. **`guides` (37 items)** and **`decisions` (26 items)** next -- still small, still foundational.
3. **`coachingTips` (577 items)** and **`articles` (805 items)** last -- the bulk of the corpus, only after the pilot process (see below) has been run once and adjusted.

Collection sizes are read live from `reports/editorial/lifecycle.json`'s `collection_rollup`, not hand-copied, so this order stays correct as the corpus changes.

## Per-item reconciliation checklist (what "done" means for one item)

For each item, a human reviewer:

1. Creates an `editorial_opportunities` row via `POST /api/admin/editorial/opportunities` with `source: "correction"` or another honest source label if the reconciliation was itself prompted by a signal, or leaves the item `legacy` (does not force-create a row) if no real review has happened yet.
2. Records at least one real, `https://` source via `POST /api/admin/editorial/sources` for each load-bearing factual claim in the piece.
3. Records and validates each such claim via `POST /api/admin/editorial/claims` and its `:id/validate` action, citing the source(s) from step 2.
4. Maps at least one real internal relationship (its parent hub, a sibling guide, or both) via `POST /api/admin/editorial/relationships`.
5. Classifies monetization/disclosure via `POST /api/admin/editorial/approvals` (`action: "classify_monetization"`) -- `none` for pieces with no affiliate links, matching the existing `affiliate-bearing` flag already computed by `check:editorial-refresh`.
6. Gets Jeff's explicit approval via the same route's `action: "approve"`, which enforces every gate in `approvalGates()` before it will succeed.

Steps 1-5 can be delegated to a trusted staff reviewer; step 6 is Jeff-only by construction (the route always records the authenticated caller as `approved_by`, and only allowlisted emails can authenticate at all).

## Evidence artifact per batch

Each batch (starting with the 17-item pillar pilot) gets one dated evidence file under `coordination/release-evidence/` recording: which items were reviewed, by whom, on what date, and the resulting `editorial_opportunities.id` for each -- generated from the real D1 rows, not hand-typed, once `EDITORIAL_LIFECYCLE_ENABLED` is on and the routes are exercised. No such file exists yet; none is fabricated here.

## Read-only tooling built this session

`scripts/editorial-reconciliation-pilot-candidates.mjs` lists the current pillar-collection candidates by reading `src/content/pillar/` directly (`npm run report:reconciliation-pilot`). It performs no writes, creates no D1 rows, and marks no item reconciled -- it only proposes the pilot batch for Jeff to confirm before any human reviewer starts step 1 above.

## What remains before any real reconciliation happens

- `EDITORIAL_LIFECYCLE_ENABLED` must be turned on somewhere the routes are reachable (today: nowhere in production or staging -- see `wrangler.jsonc`/`wrangler.production.jsonc`).
- Migration `0024` must actually be applied to whichever database the reviewer's session targets (see Plan 020's staging-application approval gate).
- A reviewer (Jeff, or someone Jeff designates) must do the actual source-checking work in the per-item checklist above. This document does not shortcut that.
