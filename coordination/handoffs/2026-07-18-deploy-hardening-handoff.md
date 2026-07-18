# Handoff — deploy hardening pass (2026-07-18)

Built from `e808801`, rebased onto `0ccd55f` ("Build governed affiliate recommendation
lifecycle"), which became the new `main` during the build. Delivered as a three-commit
series on branch `claude-build-slices`, plus this documentation commit.

## What landed

1. `557e62b2` — Q5 post-deploy auto-remediation. On a failed post-deploy smoke, the
   workflow rolls production traffic back to the recorded good version id, or halts and
   emits a loud alert when no valid rollback target exists or the rollback itself fails.
   Staging halts and alerts. New: `scripts/deploy-remediation.mjs`,
   `tests/deploy-remediation.test.ts`; edited `.github/workflows/deploy-workers.yml`.
2. `ca0e9e00` — Q3 S4 deletion opt-out freeze exemption. `deletion_opt_out_proposal` is a
   code-enforced exempt write class in `src/lib/maintenance-mode.ts`; the operator override
   cannot suppress it. The camps-sweep cron guard routes through the same function with no
   behavior change. Enforcement finding documented in `PCD-AI-OS/00-FOUNDATIONS.md`.
3. `c5331463` — Q1/Q2 additive verifiers. `scripts/smoke-attestation.mjs` (OIDC artifact
   attestation of the smoke receipt+checksum, no new secret) and `scripts/caller-hashes.mjs`
   with `coordination/release-evidence/scheduled-task-caller-hashes.json` (SHA-256 per
   committed scheduled-task caller, added to `ci:release`).

Q-warmup (the stale `wrangler pages dev` doc string) was already fixed in `e808801`;
no change was needed.

## Evidence

- Full Vitest suite: 167 files / 843 tests pass (base `0ccd55f` alone was 165 / 819).
- `astro check`: 0 errors, 0 warnings, 356 hints.
- Production build: compiles clean; run to completion on identical slice code at `e808801` (the OG-image python step falls back to committed cards, by design). Run `npm run build` on the landing machine to confirm before the gated deploy.
- `check:caller-hashes`, `check:affiliate-lifecycle`, `check:agent-token-rollout`,
  `check:workflow-pins`, `check:rollback-target`: pass.
- `check:root-organization`: 85 artifacts, 36 directories.

## Claim boundaries

- Local code and tests only. No deploy, rollback rehearsal, migration, credential, or
  provider action was taken.
- The Q5 rollback decision logic is tested against a mocked Wrangler CLI. The exact live
  `wrangler versions deploy` invocation and the staging rollback drill remain owner-gated.
- Q1 delivers the verifier and tests. Wiring the live attestation issuance
  (`actions/attest-build-provenance` + `gh attestation verify`) and turning on `--require`
  in the workflow is a gated deploy-infra step, not done here.
- Do-not-touch boundaries were respected: no changes under `migrations/` or
  `migrations-activity-radar/`, no `wrangler*.jsonc` binding edits, no edits to
  `src/lib/publish.ts|email.ts|slack.ts`, no `.env` values, no MedConfRadar.

## Next (owner-gated)

Everything downstream stays in `coordination/JEFF-ACTION-PACKAGE-2026-07-18.md`: staging
deploy, the rollback rehearsal that exercises `deploy-remediation.mjs` for real, Access
probes, production deploy, scheduled-task reconciliation, offsite backup, newsletter
provider, migration. Do not deploy, migrate, touch credentials or providers, post, or
contact anyone without explicit per-action approval.
