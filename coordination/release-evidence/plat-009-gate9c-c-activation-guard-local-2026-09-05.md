# PLAT-009 Gate 9C-C activation guard local evidence

Date: 2026-09-05
Status: **PASS — local guard repair only; remote activation remains HOLD**

## Candidate identity

- PCD implementation candidate: `e9072eb577cf2cc3065290425517826168088f4e`
- Candidate tree: `85da17710934901346370714fea8928fc88dd9fb`
- Parent evidence commit: `65f65e31f631fc64366a1c903c081aa1a2c558c5`
- Gate 9C-B deployed PCD source candidate: `e0dc5f8932a8246eddaaad3622aae67ba8b370c1`

## Scope delivered

The verified staging deploy guard now has two distinct fail-closed modes:

1. disabled/default mode requires `PCD_CRM_ADAPTER_ENABLED=false`,
   `PCD_CRM_BACKFILL_ENABLED=false`, and no
   `PCD_CRM_SOURCE_NOT_BEFORE_MS`;
2. pilot-activation mode requires `PCD_CRM_ADAPTER_ENABLED=true`, backfill false, an exact
   positive second-aligned Unix-millisecond boundary, and the distinct
   `--confirm-crm-activation` confirmation.

Both modes require the exact reviewed staging Worker name, origin, D1 database names and IDs,
R2 bucket, KV namespace, CRM service binding with no named entrypoint or extra routing fields,
CRM identifiers, and required secret declaration. Duplicate, unknown, malformed, and conflicting
CLI arguments reject before the build or deploy path.

No dependency was added. npm, PyPI, GitHub, and Cloudflare documentation were searched for a
maintained D1/backfill deployment helper; the repository-specific policy is smaller and safer as
native JavaScript composed with the existing Wrangler build/deploy path.

## Retained red-first evidence

- Initial activation cases: **2 failed / 6 total** against the prior guard because it rejected all
  adapter activation and did not model the boundary contract.
- Resource-identity and CLI-smuggling cases: **2 failed / 8 total** before exact identities and
  strict argument parsing were added.
- Named service-entrypoint case: **1 failed / 8 total** before exact service-binding shape
  validation was added.
- Every reproduced defect remains in `tests/staging-deploy-guard.test.ts`.

## Final local verification

- `vitest run tests/staging-deploy-guard.test.ts`: **PASS, 8/8**.
- `vitest run --config vitest.integration.config.ts tests/crm-adapter.test.ts`:
  **PASS, 63/63**.
- `git diff --check`: **PASS** before the candidate commit.
- Existing generated disabled staging manifest validated against the candidate: **0 errors**;
  adapter false, backfill false, boundary absent, exact CRM staging service binding.
- Full verified disabled-mode build/dry run: **PASS**; it stopped before deploy and printed the
  exact-confirmation instruction.

Independent passes:

- QA: **CLEAN** after replaying positive controls, unexpected service routing fields, and CLI
  ambiguity cases as exported-function black boxes.
- Security: **CLEAN** after replaying both generic-confirmation argument orders, empty boundary,
  and unexpected service-entrypoint cases as black boxes.
- Efficiency: **CLEAN** after malformed boundaries were moved ahead of the build path.
- Simplicity: no unnecessary dependency or layer; redundant resource-name scans and duplicate
  boundary validation were deleted without changing the accepted manifest set.

## PERFORMANCE REVIEW

- approximate algorithmic complexity: `O(a + f + d + r + s + k)` over CLI arguments, feature
  flags, and manifest binding arrays; all are configuration-bounded
- DB query count on primary path: `0`
- external API calls: `0` for parsing, validation, build, and unconfirmed dry run; the separately
  gated confirmed path invokes the existing Wrangler deploy operation and was not exercised
- queue jobs created: `0`
- expected memory behavior: `O(m)` for the generated manifest, bounded by the Worker
  configuration size
- likely scaling bottleneck: the application build, observed at roughly two minutes; guard
  validation itself completed within the 218 ms focused test process

## Gate boundary retained

This evidence does **not** choose or set `PCD_CRM_SOURCE_NOT_BEFORE_MS`, enable either producer
flag, copy historical organizations or contacts, deploy this candidate, change production, export
data, send messages, or change secrets/providers. Gate 9C-C staging activation and the later full
historical transfer remain separate exact-candidate approvals with fresh preactivation evidence.
