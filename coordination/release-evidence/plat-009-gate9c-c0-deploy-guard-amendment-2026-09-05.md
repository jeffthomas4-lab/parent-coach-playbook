# PLAT-009 Gate 9C-C0 exact-candidate deploy guard amendment

Status: **LOCAL PASS / REMOTE INFRASTRUCTURE HOLD**
Recorded: 2026-09-05

## Candidate identity

- PCD exact-candidate deploy candidate: `2c7300ae5cc8b29abd02b07bd848ded64ee5a77f`
- Candidate tree: `6fcc7f36cf04e73c8cdd7a854d84cdf8ebfabaff`
- Direct predecessor PCD pilot evidence commit: `1de9f1cdfe86cf91cac7f107f61266929f802a0e`
- Central CRM receiver candidate remains: `d810612d5c8f55f97e7e04596cca2af4128049eb`
- Central CRM candidate tree remains: `0275934a98d9ee1caadc20b004568d774a0b3703`

This amendment supersedes `abd0bea53554a3c832fddd0fb101d00602662491` as the PCD code candidate for
the next Gate 9C-C0 infrastructure action. It changes only the local verified staging-deploy guard
and its regression tests. It does not change CRM propagation, migration, pilot, data-copy, flag, or
activation behavior.

## Exact-candidate release control

A confirmed staging deployment now requires `--expected-source-sha` with an exact lowercase
40-character Git SHA. The command rejects a missing, malformed, duplicate, or mismatched value.

Before the build, the CLI proves that HEAD equals the approved SHA and the working tree is clean.
At the mutating boundary it re-reads HEAD, checks post-build status, and requires
`dist/client/build-info.json` to stamp the same approved SHA. The only permitted post-build Git
differences are the tracked `public/link-manifest.json` and new lowercase-dash JPG files directly
under `public/og/`. All other tracked or untracked changes stop the deployment.

Disabled mode performs the complete release-state check immediately before Wrangler. Activation
mode performs it before opening its exclusive temporary config and again after the awaited
write/close, immediately before Wrangler. The full approved SHA is present in the Cloudflare
version message, which also distinguishes adapter/backfill-disabled deployment from pilot
activation.

The checks use bounded literal Git argument arrays and existing Node primitives. No dependency,
shell interpolation, provider call, or remote action was added.

## Red-first evidence

The following failures were observed before their retained repairs passed:

1. The first exact-SHA tests failed 2/17 because confirmed deploy parsed without a SHA and the
   deploy function did not reject a mismatched checkout.
2. The clean-checkout regression failed before `verifyCleanCheckout` existed.
3. Independent release-control review found that a direct importer could supply a forged
   `actualSourceSha`; retained tests now prove caller-supplied values cannot override the real Git
   HEAD.
4. Review of ignored build output found that a clean HEAD did not alone prove `dist/` came from
   that commit; the retained stale-build test now requires the build-info stamp to match.
5. Independent QA reproduced an activation-only timing change during the awaited temporary-config
   write. The new regression failed 1/21 with Wrangler reached on the changed HEAD, then passed
   after the full release-state check moved immediately before the activation deploy.

## Verification evidence

- Focused deploy-guard suite: **PASS, 21/21** after the final repair and simplicity deletion.
- TypeScript (`tsc --noEmit`): **PASS**.
- `git diff --check`: **PASS**.
- Exact-candidate non-deploying path: **PASS** from detached candidate
  `2c7300ae5cc8b29abd02b07bd848ded64ee5a77f`. The full application build stamped that exact SHA,
  verified the isolated staging manifest, and exited with `No deploy performed` because no
  confirmation flag was supplied. Its one tracked link manifest and seven untracked OG cards were
  restored or removed afterward.
- Earlier full unit run in this lane: **1293/1298 PASS**; the five failures are pre-existing stale
  release/access evidence expectations (expired packet, 59-versus-69 protected-route count, and
  stale Access CLI/evidence files), not failures in this deploy guard.
- Earlier full DNC/pilot serialized integration evidence remains **PASS, 131/131**.
- Independent QA: **CLEAN** after reproducing and repairing the activation timing defect.
- Independent Security: **CLEAN** on the current file after the direct-import and timing repairs.
- Independent Efficiency: **CLEAN**; repeated activation checks are necessary timing barriers.
- Independent Simplicity: two Low suggestions. Internal Git helpers were made private and duplicate
  malformed-HEAD validation was deleted. Forged `actualSourceSha` test inputs were retained because
  they are the regression proof for the original direct-import bypass.

Dependency decision: npm, PyPI, and GitHub were checked for maintained Git-client packages.
Existing Node built-ins plus the Git CLI use fewer dependencies and a smaller attack surface than
`simple-git`, `git-client`, `git-rev-sync`, or GitPython, so no dependency was added.

## PERFORMANCE REVIEW

- approximate algorithmic complexity: `O(s + m)`, where `s` is bounded Git status output and `m`
  is the small generated deployment manifest/build-info payload
- DB query count on primary path: 0
- external API calls: 0 before confirmation; exactly 1 Wrangler deploy invocation after every
  local gate passes
- queue jobs created: 0
- expected memory behavior: one environment copy, one manifest, short Git output, and a measured
  177-byte build-info document; all are command-scoped
- likely scaling bottleneck: the existing application build, followed by the single Wrangler
  deployment, not the SHA/status checks

Confirmed disabled mode uses two `rev-parse` calls, two bounded status calls, one build, one
manifest read, one build-info read, and one Wrangler invocation. Confirmed activation adds one
additional `rev-parse`, status, and build-info read across the awaited temporary-config write.

## Retained gate boundary

No remote database, Worker, Queue, provider, secret, resource, production system, or customer data
was changed. No staging backup/export, migration, copy, seed, activation boundary, flag enablement,
or send occurred.

The next remote action still requires a new exact Gate 9C-C0 approval naming this PCD candidate,
the unchanged CRM candidate, the exact migration hashes/aggregates, the staging resources, and the
new central evidence commit. Both producer flags must remain false and the action must stop before
copying data or selecting an activation boundary.
