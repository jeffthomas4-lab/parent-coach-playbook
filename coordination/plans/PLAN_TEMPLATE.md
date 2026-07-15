# Plan: [TITLE]

Copy to `plans/NNN-slug.md`. Number sequentially.

Fields marked **[required]** apply to every Tier 2 and Tier 3 plan. Fields marked **[Tier 3]** are required only for architectural work and may be omitted below that tier.

A template that forces twenty fields onto a small change produces prose written to satisfy the form. Omit what does not apply. Do not pad.

---

**Plan ID:**
**Author:**
**Date:**
**Status:** Draft / Awaiting Jeff / Approved / Superseded / Rejected

## Objective **[required]**

One or two sentences. What this changes.

## Tier **[required]**

1 / 2 / 3, and why. If the two agents disagree on tier, it is Tier 3.

## Business outcome **[required]**

What is true for parents, or for Jeff, after this ships that is not true now. If the honest answer is "nothing yet, this is groundwork," say that.

## Current-state evidence **[required]**

Cite `CURRENT_STATE.md` and its verified date. Label every claim: Verified in code, Verified by tests, Documented as deployed, Confirmed live, Not verified.

Re-verify before writing this section if any of the following happened since that date: a deployment, a migration, a major merge, a binding change, or a material change in worktree state. Fourteen days is the maximum age, not a guarantee of freshness.

Do not assert production state from local documentation. See D-003.

## Scope **[required]**

## Non-goals **[required]**

What this explicitly does not do. This is the field that keeps a Tier 2 change from becoming a Tier 3 change halfway through.

## Files likely affected **[required]**

## Step-by-step implementation **[required]**

Ordered. Each step small enough to commit on its own.

## Testing strategy **[required]**

Which existing tests cover this. Which new tests are needed. What cannot be tested and why.

## Acceptance criteria **[required]**

Checkable conditions. "Works correctly" is not a criterion. A command with an expected exit code is.

## Human approval gates **[required]**

Every point where Jeff must approve before the next step. Deployment, migration against production, production data change, outbound communication, publishing, purchase, secret change, and merge to primary always qualify.

## Open questions **[required]**

If none, write "None." Do not leave blank.

---

## Dependencies **[Tier 3]**

## Architecture and data flow **[Tier 3]**

## Data model or migration changes **[Tier 3]**

Note the existing duplicate `0009` prefix in `migrations/` before adding a migration. Do not add a colliding number.

## Security and privacy requirements **[Tier 3]**

Cite the Pre-Launch Security Gate items in scope. Do not restate them.

## Failure modes **[Tier 3]**

What breaks, what the user sees, what the logs get.

## Edge cases **[Tier 3]**

## Observability **[Tier 3]**

How anyone knows this is working, or has stopped working, without being told.

## Deployment plan **[Tier 3]**

Environment, order, and who runs it. Neither agent deploys.

## Rollback plan **[Tier 3]**

How this is undone after it ships. If the change writes to D1 autonomously, D-001 requires a demonstrated restore, not a scripted one.

If there is no rollback path, say so plainly. A plan with no rollback is not automatically rejected, but it is Jeff's decision to accept, not the author's to bury.
