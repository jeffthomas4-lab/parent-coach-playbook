# Plan: publish idempotency across the UTC date boundary

**Plan ID:** 010
**Author:** Codex
**Date:** 2026-07-15
**Status:** Complete

## Objective

Make an already-published file (`draft: false`) an unconditional no-op so a repeated approval on a later UTC date cannot create a second GitHub commit or trigger another deployment.

## Tier

Tier 3 because the defect is in `src/lib/publish.ts`, an outbound publishing surface explicitly gated in `coordination/CURRENT_STATE.md`.

## Business outcome

Repeated Slack or admin publish actions remain idempotent across days, preventing duplicate commits and unintended deploy-hook calls.

## Current-state evidence

- **Verified by tests, 2026-07-15:** the full suite fails 2 tests after UTC midnight because both already-published fixtures carry `jeffReviewedAt: 2026-07-15` while `publishDraft()` computes `2026-07-16`.
- **Verified in code:** `flipDraftFrontmatter()` sees `draft: false` but continues into editorial stamping; a different current date sets `changed = true`, so `publishDraft()` performs a PUT and can fire the deploy hook.
- **Verified by isolated tests:** the same two failures reproduce when only `publish-lib.test.ts` and `admin-editorial-publish.test.ts` run, ruling out cross-file mock interference.

## Scope

Return `{ content, changed: false }` immediately when frontmatter explicitly contains `draft: false`, and strengthen unit/API tests with an already-published date deliberately older than the mocked/current date.

## Non-goals

- Do not alter authentication, Slack signatures, GitHub credentials, deploy-hook configuration, allowed collections, commit metadata, or draft publishing behavior.
- Do not invoke GitHub, a deploy hook, Slack, production, D1, or R2 during validation.
- Do not deploy until the complete Plan 009 validation suite is rerun and passes.

## Files likely affected

- `src/lib/publish.ts`
- `tests/api/publish-lib.test.ts`
- `tests/api/admin-editorial-publish.test.ts`
- Plan 009/010 coordination evidence

## Step-by-step implementation

1. Add an early no-op return for an explicit `draft: false` frontmatter value before editorial stamping.
2. Change both already-published fixtures to use a deliberately old review date so the tests prove cross-date idempotency.
3. Assert the fetch mock is called exactly once, proving no GitHub PUT or deploy-hook request occurs.
4. Run the two focused test files, then the full unit suite, TypeScript checks, Astro check, and full default-heap build.
5. Continue Plan 009 dry run and staging rehearsal only after all gates pass.

## Testing strategy

- Focused publish library and API tests.
- Full repository unit suite.
- Existing TypeScript and Astro validation from Plan 009.
- No live publish-path acceptance test because it would mutate GitHub and trigger outbound deployment.

## Acceptance criteria

- An explicit `draft: false` returns `changed: false` even when `jeffReviewedAt` is older than the current UTC date.
- `publishDraft()` and its API route return 409 for that input after exactly one read request.
- No GitHub PUT or deploy-hook request occurs.
- Full Plan 009 validation passes before staging deployment.

## Human approval gates

Jeff must approve this plan before `src/lib/publish.ts` changes. Production deployment remains separately gated after Plan 009.

## Dependencies

None.

## Architecture and data flow

The existing read-before-write flow remains. After reading content, explicit `draft: false` terminates locally with 409; draft content continues through the existing stamp, GitHub PUT, and best-effort deploy-hook flow.

## Data model or migration changes

None.

## Security and privacy requirements

Preserve the existing human approval, origin, Access/Slack authentication, path allowlist, and secret-handling boundaries.

## Failure modes

An incorrect early return could suppress a valid draft publish, so the existing happy-path tests must continue proving `draft: true` commits and fires the hook.

## Edge cases

- Explicit `draft: false` with missing or stale editorial metadata remains a no-op. Publishing idempotency takes precedence; metadata repair is a separate editorial operation.
- Files without a `draft` key retain current behavior and may receive the editorial stamp.
- CRLF and LF frontmatter remain covered by the existing parser expression.

## Observability

The API continues returning 409 `already published`; fetch-call assertions prove no downstream write or hook.

## Deployment plan

No independent deployment. Include the fix in the Plan 009 staging rehearsal after all local gates pass.

## Rollback plan

Roll back the focused source/test commit if draft publishing regresses. No data rollback is involved.

## Execution evidence

- Commit `13bfec6` returns immediately with `changed: false` for explicit `draft: false` content before editorial-date stamping.
- Both already-published fixtures use `jeffReviewedAt: 2020-01-01`, proving behavior across a date boundary rather than only within one UTC day.
- The library and API tests assert exactly one fetch, proving no GitHub PUT or deploy-hook request occurs.
- Focused publish tests passed 32/32; the full suite passed 232/232.
- The full Plan 009 release gate passed before staging deployment.
