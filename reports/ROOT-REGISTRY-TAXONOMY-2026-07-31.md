# Root file registry taxonomy fix — 2026-07-31

## What changed

Moved `STANDARD-AUDIT.md` and `SECURITY-AUDIT.md` from `historical_or_superseded` to `current_authority` in `coordination/root-file-registry.json`. Both are live per the Website-Build-Standard: `STANDARD-AUDIT.md` carries the pillar tracking and the Definition of Done, `SECURITY-AUDIT.md` carries Pillar 1's secrets inventory and rate-limit table.

Also moved `REVIEW.md` to `current_authority`. It calls itself "the operator manual" for the `/admin/editorial` dashboard, and I confirmed `src/pages/admin/editorial` still exists and the frontmatter fields it documents (`qualityGrade`, `status: jeff-approved`, etc.) match the live editorial workflow described elsewhere in the repo. It was sitting in `historical_or_superseded` under the same misfiling pattern as the two audit files.

This is a classification fix only. None of the three files' contents were touched.

## Category definitions written

Added a `_descriptions` metadata block to both registry JSON files (a sibling key, not a category — the checker now explicitly skips any top-level key starting with `_`, so the "every category is a flat array of filenames" shape holds).

**Root file registry** (`coordination/root-file-registry.json`):
- `current_authority` — governs the build today; a live standard, reviewer, or runbook depends on it being accurate now.
- `current_business_input` — feeds active business decisions, not the technical build.
- `active_work_queue` — names at least one task still pending.
- `historical_or_superseded` — a record of something already done or already replaced, not a live instruction.
- `generated_or_diagnostic_artifact` — machine output, not authored guidance.

**Directory registry** (`coordination/top-level-directory-registry.json`):
- `product_runtime` — ships to a real visitor.
- `independently_deployed_runtime` — has its own deploy target apart from the main site.
- `data_lineage_and_fixtures` — data that feeds the product, not code that runs it.
- `tests_and_quality_evidence` — exists to prove the product works, not to run it.
- `operations_governance_and_coordination` — runs the engineering process itself.
- `business_editorial_and_reports` — business or editorial output.
- `inactive_or_historical` — disconnected from the live build, kept for reference only.

## Audit of the rest

Checked every dated/report-style filename still in `historical_or_superseded` (14 files) against a git-log date and a content skim: `AUDIT_RESPONSE.md`, `EDITORIAL_AUDIT.md`, `RESTRUCTURE_PLAN.md` all confirmed genuinely superseded (`RESTRUCTURE_PLAN.md`'s proposals are already live — it proposed retiring `VOICES.md` for `EDITORIAL_VOICE.md`, and `EDITORIAL_VOICE.md` is the file now in `current_authority`). `DEPLOY.md` is explicitly self-described as a retired guide. `PAGES-TO-WORKERS-MIGRATION-BRIEF.md` and `CAMP_DISCOVERY_PIPELINE_REVIEW.md` are both dated, point-in-time, and consistent with the site already running on Workers. No other current-authority-in-disguise found among these.

Checked all 15 files now in `current_authority` against the Website-Build-Standard pillars; all plausible and none looked dead.

## Judgment calls for Jeff (not changed)

- `SANITY.md` — describes a currently-true but inactive status (Sanity CMS scaffolded, disconnected). Doesn't cleanly fit any of the five categories; left in `historical_or_superseded` since it parallels the `studio/` directory's placement in `inactive_or_historical`.
- `artifacts/` (directory) — holds JSON snapshots and sha256 hashes, which reads more like `tests_and_quality_evidence` than `business_editorial_and_reports` where it currently sits.
- `PCD-AI-OS/` (directory) — an internal operating-structure doc set; could arguably sit in `operations_governance_and_coordination` instead of `business_editorial_and_reports`.
- `proof-screenshots/` (directory) — screenshots proving a specific pilot worked; borderline between `data_lineage_and_fixtures` (current) and `tests_and_quality_evidence`.

## Checker proof

`node scripts/check-root-organization.mjs`

Before: exit 0, 95 artifacts, `current_authority: 12`, `historical_or_superseded: 30`.
After: exit 0, 95 artifacts, `current_authority: 15`, `historical_or_superseded: 27`. Directory registry counts unchanged (40 directories, same 7 category counts). Total artifact count and directory count did not move, confirming no file was lost or double-counted.
