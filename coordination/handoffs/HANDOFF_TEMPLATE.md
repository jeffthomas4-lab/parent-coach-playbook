# Handoff: [TASK NAME]

Copy this file to `handoffs/YYYY-MM-DD-slug.md`. Once written, a handoff is immutable. Corrections go in a new handoff that supersedes it, not in an edit.

A handoff is a baton, not an architecture document. Keep architecture in `plans/` and state in `CURRENT_STATE.md`.

---

**Date:**
**From:**
**To:**
**Task:**
**Tier:** 1 / 2 / 3
**Approved plan path:**
**Branch:**
**Commit or commit range:**

## Files changed

List paths. Group by surface if the change is wide.

## Validation

For each check: exact command, exit code, concise result, relevant error excerpts. Attach full sanitized logs only when materially useful.

Never paste secrets, credentials, tokens, environment contents, or unnecessarily large command output. Refer to secrets and bindings by variable name only.

| Command | Exit code | Result |
|---|---|---|
| `npm test` | | |
| `npm run check` | | |
| `npm run build` | | |

Error excerpts:

```
[relevant lines only, sanitized]
```

## Pre-existing failures

Failures present before this work started. Separate these from failures this work introduced. If a pre-existing failure was not verified as pre-existing, say so rather than assuming.

## Deviations from the plan

What was implemented differently than the approved plan said, and why.

## Plan defects discovered during implementation

Defects in the approved plan itself, not in the implementation of it. If implementation exposed that the plan was wrong, incomplete, or based on stale state, record it here. The reviewer must disposition each one.

If none, write "None found." Do not leave this blank.

## Risks and uncertainties

## Requested review focus

Where the reviewer should spend attention. Be specific.

## Deployment status

Deployed / not deployed / partially deployed. Name the environment. If not deployed, say what a deploy would require.

## Production data impact

None / describe. Any write to production data requires prior Jeff approval and a proven rollback path.

## Do not modify

Files or workstreams the recipient must leave alone, and why.

## Human approval required

Yes / no. If yes, name exactly what Jeff is being asked to approve.
