# Repository structure and ownership

**Status:** Canonical placement policy as of 2026-07-18  
**Scope:** Parent Coach Desk repository only

This file defines where new work belongs. It does not claim that every legacy
file has already moved. Historical paths remain stable until references and
automation contracts can be migrated in the same reviewed change.

## Authoritative entrypoints

| Question | Authority |
| --- | --- |
| What is currently verified? | `coordination/CURRENT_STATE.md` |
| What work is approved or designed? | `coordination/plans/` |
| What is waiting for another model or owner? | `coordination/HANDOFF.md` |
| How is production released or rolled back? | `DEPLOYMENT-RUNBOOK.md` |
| What actions require approval? | `automation/APPROVAL-MATRIX.md` and `coordination/LAUNCH-AUTHORIZATION-MATRIX.md` |
| What is the long-range architecture? | `PCD-AI-OS/` and Plan 019; these are design inputs, not runtime evidence |
| What is the business priority? | `Parent_Coach_Playbook_Business_Plan.docx` |

## Owned directories

### Product runtime

- `src/`: the application. Routes stay under `src/pages`, reusable UI under
  `src/components`, domain behavior under `src/lib`, shared product
  configuration under `src/data`, and editorial records under `src/content`.
- `public/`: shipped static files only. Generated manifests must have a named
  deterministic builder and validation contract.
- `tests/`: behavioral tests. API/runtime tests belong in `tests/api`; broad
  policy and source contracts stay at the test root.

### Data lineages

- `migrations-activity-radar/`: shared Activity Radar graph schema bound as
  `DB`. It is not interchangeable with the legacy camps schema.
- `migrations-pcd-ops/`: isolated operational, trust, identity, privacy, and
  commerce-test foundations bound as `PCD_OPS_DB`.
- `migrations/`: legacy Parent Coach Desk camps lineage. Keep for recovery and
  compatibility evidence; never run it against `DB` based on filename alone.
- `imports/`, `buildout/`, `backups/`: working data products. New generated
  outputs should be ignored unless intentionally reviewed fixtures or
  sanitized evidence.

### Operations and governance

- `automation/`: machine-consumed policies, task inventory, agent contracts,
  and reconciliation records.
- `coordination/plans/`: numbered implementation plans.
- `coordination/reviews/`: immutable review verdicts.
- `coordination/handoffs/`: immutable dated handoffs;
  `coordination/HANDOFF.md` is the only mutable active pointer.
- `coordination/release-evidence/`: sanitized, machine-checkable evidence.
- `reports/`: dated investigations and generated audits. Reports do not update
  current state by implication.
- `scripts/`: deterministic tools. A script that mutates remote state must fail
  closed, name its target, and preserve the applicable approval gate.

### Supporting systems

- `worker-cron/` and `worker-link-checker/`: independently deployed Workers.
- `studio/`: optional Sanity tooling, not the canonical editorial database.
- `PCD-AI-OS/`: architecture and curriculum documentation.
- `activityradar-archive/`, `wip-archive/`: retained historical material. Do
  not import these into active runtime paths or treat them as current truth.

## Root-file policy

The root currently contains many historical plans, audits, prompts, and
operator notes. New files follow these rules:

1. Only runtime configuration, primary operator entrypoints, and established
   root contracts belong at the root.
2. New plans go to `coordination/plans/`; reviews to `coordination/reviews/`;
   handoffs to `coordination/handoffs/`; generated analysis to `reports/`.
3. Business/editorial working documents go to a named folder such as
   `strategy/`, `docs/`, `kit-emails/`, or `affiliate-picks/`, not the root.
4. Do not move a referenced legacy file alone. Inventory inbound references,
   update them atomically, and add a compatibility pointer when operators are
   likely to use the old path.
5. Do not create parallel current-state, deployment, or approval authorities.

Every tracked root document, spreadsheet, CSV, and text artifact is classified
exactly once in `coordination/root-file-registry.json`. `npm run
check:root-organization` fails when a new root artifact bypasses this policy or
when a registry entry becomes stale. Classification is not an endorsement of
content freshness; it establishes ownership and the safe migration queue.

## Cleanup queue

These are organization tasks, not permission to delete:

1. Classify every tracked root Markdown file as current authority, historical
   record, business/editorial working document, or superseded artifact.
2. Migrate unreferenced historical reports into dated subfolders in one
   path-update commit per topic.
3. Add ignore coverage or deterministic retention rules for scratch outputs in
   `buildout/`, `.audit_tmp/`, and generated manifests.
4. Reconcile `DEPLOY.md` with the production runbook, retaining only resource
   bootstrap and historical instructions that remain valid.
5. Retire stale duplicated build plans only after all live references point to
   their successor and the history remains discoverable.

Bulk cleanup is complete only when tests, scripts, documentation links, and
operator commands prove the new paths. A smaller-looking tree is not itself
evidence of correct organization.
