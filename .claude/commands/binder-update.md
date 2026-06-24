# /backlog-update

Update SITE_IMPROVEMENTS.md and BACKLOG.md after a session that completed tasks or surfaced new ones.

**Usage:** `/backlog-update`

## Steps

1. Review what was built or changed this session
2. Delegate to `product-manager` subagent:

   > Update the parentcoachdesk.com backlog after this session. Read SITE_IMPROVEMENTS.md and BACKLOG.md. For each task completed this session: mark it done with today's date and a one-line summary of what changed. For any new issues surfaced this session (by security-check, content-audit, billing-check, or human-test): add them to the correct tier in SITE_IMPROVEMENTS.md with [Claude] or [Jeff] or [Jeff + Claude] owner. Rerank any items whose priority changed based on session findings. Output: list of status changes (task name → Done [date]), list of new items added (task name, tier, owner).

3. Confirm the two 2026 success metrics are still on track — if anything surfaced this session threatens them, flag it

**Output:** Status change list. New items list. Any flag on 2026 metrics.
