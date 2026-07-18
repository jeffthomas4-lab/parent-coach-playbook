# Active Handoff

This file is a pointer, not a document. It names the active baton and what it is waiting on. It is overwritten at each handoff. The handoff itself lives in `handoffs/` and is immutable once written.

This is the only place active status lives. Do not duplicate it elsewhere.

---

**Active handoff:** `handoffs/2026-07-18-editorial-lifecycle-durable-records-claude-code.md`
**From:** Claude Code
**To:** Jeff / Codex
**Task:** Editorial lifecycle durable records (opportunity/source/claim/brief/relationship/review/approval), Plan 020.
**Tier:** 3
**Branch:** `main`
**Commit:** `2553a60cec202bed9c540fdb6f5df7b74969cf4d`
**Status:** Local design, code, tests, and rehearsal complete. Nothing deployed, migrated remotely, or flag-enabled.
**Human approval required:** Yes -- see the handoff's "Remaining blockers" section (staging application of migration `0024`, a live Access re-probe now that protected routes went from 38 to 48, and the pre-existing `authenticated-access-probes-pending.json` naming/state inconsistency documented as pre-existing, not caused by this session).

**Blocking Jeff's attention:**

1. Approve (or decline) applying migration `0024` to the isolated staging PCD operational database.
2. Decide whether/when to run a fresh live anonymous + authenticated Access probe against production now that the protected-route count is 48.
3. `tests/access-evidence-cli.test.ts` and `tests/access-evidence.test.ts` have a failure that predates this session (confirmed against baseline commit `192a173` before this session made any change) -- `authenticated-access-probes-pending.json` is named "pending" but already contains `"state": "complete"`. Worth a look independent of this handoff.

**Superseded pointer (2026-07-17):** the previous active handoff (`handoffs/2026-07-17-plan-015-editorial-approval-repair-deployed.md`) named one still-open item -- a live editorial-approval test-article click Jeff had not yet performed. This overwrite does not mean that item is resolved; if it is still open, it needs separate tracking now that this file points elsewhere.

**Next step:** Review the editorial-lifecycle handoff, decide on the migration-0024 staging application and the Access re-probe, and confirm whether the Plan 015 test-article approval above is still outstanding.
