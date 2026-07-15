# Review: [TITLE]

Copy to `reviews/YYYY-MM-DD-slug.md`. Immutable once written. A changed conclusion goes in a new review that supersedes this one.

---

**Reviewer:**
**Date:**
**Reviewed plan:**
**Reviewed handoff:**
**Branch:**
**Commit range:**

## Executive result

Two or three sentences. Lead with the disposition, not the reasoning.

## Plan assessment

Was the approved plan correct?

Disposition every plan defect the implementer reported in the handoff, and any found independently. For each: confirmed, rejected, or partially confirmed, with reasoning.

A review that only asks whether the implementer followed the plan is not independent review. The plan's author and this reviewer may be the same party, which is exactly why this section is mandatory and cannot be answered with "plan was followed."

If the plan was wrong and the implementation followed it faithfully, the disposition is Changes Requested against the plan, not against the implementation.

## Blocking findings

Must be fixed before merge. Each with file, line, and why it blocks.

## Important findings

Should be fixed. Not blocking.

## Non-blocking improvements

## Security and privacy assessment

Cite the Pre-Launch Security Gate items in scope and the result for each. Do not restate the rules.

Specific to this repository: admin routes fail closed, D1 and R2 unreachable from the browser, D1 calls use bound parameters, no secrets in the bundle or in logs, responses return no more fields than the page needs, rate limits on any route hitting a paid API, error messages that do not leak.

## Migration and data assessment

Migrations added, ordering, collisions, reversibility. Applied state is **Not verified** from this repository and must not be assumed. See D-003.

If the change writes to D1 autonomously, confirm D-001 is satisfied by a demonstrated restore, not a scripted one.

## Tests and validation performed

Exact command, exit code, concise result, relevant error excerpts. Attach full sanitized logs only when materially useful.

Never paste secrets, credentials, tokens, environment contents, or unnecessarily large command output. Bindings and variables by name only.

| Command | Exit code | Result |
|---|---|---|
| | | |

Distinguish failures this work introduced from failures that were already there. If that distinction was not established, say so rather than assuming.

## Unverified assumptions

What this review took on faith. Be specific. This section being empty means the review verified everything, which is rarely true.

## Final disposition

**Approved** / **Changes Requested** / **Rejected**

Approved means the reviewer would ship it. It does not authorize a deploy. Only Jeff does that.
