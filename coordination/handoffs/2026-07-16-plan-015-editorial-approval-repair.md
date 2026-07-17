# Handoff: Plan 015 editorial approval repository-target repair

**Date:** 2026-07-16
**From:** Codex
**To:** Claude Code
**Task:** Implement approved Plan 015, then prepare the reviewed commit for the separately approved production deployment.
**Tier:** 2
**Approved plan path:** `coordination/plans/015-editorial-approval-repository-target-repair.md`
**Branch:** `main`
**Commit or commit range:** Create one focused repair commit; do not include unrelated worktree changes.

## Files changed

No source files changed in this planning handoff. Expected implementation surface:

- `src/pages/api/admin/editorial/approve.ts`
- `src/lib/publish.ts`, only if a narrow, side-effect-free shared configuration refactor is needed
- `tests/api/admin-editorial-approve.test.ts`
- A small configuration module/test only if direct reuse from `publish.ts` is not safe

## Required implementation

1. Make the editorial approval route use the same canonical GitHub repository, branch, and collection allowlist as the publish path. The verified canonical repository is `jeffthomas4-lab/parent-coach-playbook`, branch `main`.
2. Preserve `requireAdmin`, `requireSameOrigin`, collection allowlisting, traversal protection, SHA-based optimistic concurrency, and the human-click flow.
3. Do not return raw GitHub provider response bodies to browsers. Use stable, bounded error codes/messages and log only operation plus HTTP status; never log token, request body, or file content.
4. Add route-level assertions for both GitHub Contents URLs: canonical repository for GET and PUT, and `ref=main` for GET.
5. Add a provider-rejection test proving provider response text is not exposed.
6. Do not create/rotate `GITHUB_TOKEN`, change Cloudflare secrets or Access/DNS, create GitHub content commits through the live route, or alter editorial content.

## Validation

Run these after implementation and record exact results in a new immutable handoff. Do not silently lower coverage or exclude the route.

| Command | Exit code | Result |
|---|---:|---|
| Focused `admin-editorial-approve` unit test | pending | Must include the new canonical-target and bounded-provider-error assertions. |
| `npm.cmd run test:unit` | pending | Full unit suite. |
| `npm.cmd run test:coverage` | pending | Existing coverage thresholds remain satisfied. |
| `npm.cmd run test:integration` | pending | Full integration suite. |
| `npm.cmd run check` | pending | Astro check. |
| `npm.cmd run check:production-manifest` | pending | Production manifest. |
| `npm.cmd run check:secrets` | pending | Secret scan. |

Error excerpts:

```
None yet; implementation has not started.
```

## Pre-existing failures

None identified in the last recorded local verification. Preserve unrelated untracked `buildout/hit-rate-test/out/` artifacts and the modified `buildout/hit-rate-test/out/results.jsonl`; they belong to another workstream.

## Deviations from the plan

None. If direct import from `src/lib/publish.ts` has request-time side effects, follow Plan 015 and extract a small pure shared configuration module instead.

## Plan defects discovered during implementation

None found before implementation. Record any discovered defect in the next handoff; do not edit this handoff.

## Risks and uncertainties

- The exact deployed browser error is not yet captured. The verified repository-target mismatch is a likely cause, but the deployed `GITHUB_TOKEN` may also be missing or under-scoped.
- If the repaired production route reports repository/token authorization failure, stop. Creating/replacing a least-privilege GitHub Contents credential requires a new explicit Jeff approval.

## Requested review focus

Verify repository/branch canonicalization, URL assertions, no provider-body leakage, unchanged authorization/origin checks, and that the commit contains no unrelated artifacts.

## Deployment status

Not deployed. Jeff approved production deployment on 2026-07-16 only for the exact reviewed repair commit after every validation item passes. Deployment must not include migrations, secret changes, or a live approval write test.

## Production data impact

None. Deployment alone must not write D1, R2, or GitHub editorial content. A later live approval verification would create a GitHub content commit and requires its own designated-article approval.

## Do not modify

- `buildout/hit-rate-test/out/` and `buildout/hit-rate-test/out/results.jsonl`: unrelated user worktree artifacts.
- Any D1/R2, Cloudflare Access/DNS, Resend/Slack, Stripe, or GitHub credential configuration: outside this approved source repair.

## Human approval required

No additional approval is needed for source implementation or deployment of the reviewed repair commit. New approval is required only for GitHub credential changes or a live approval test that writes an editorial-content commit.
