# Scheduled-task run-log reconciliation

Phase 0 does not graduate until every deployed task has a completed row below.
Agent-level spot checks are insufficient when one agent has multiple cadences.

| Task ID | Agent | Schedule | Skill path | Runtime secret source | Maintenance behavior | Start proof | Finish proof | Failure proof | State |
|---|---|---|---|---|---|---|---|---|---|
| pending-inventory | pending | pending | pending | protected scheduled-task store | report-only Aug-Nov unless named exception | pending | pending | pending | reconcile live inventory |

Each caller first sends an authenticated `HEAD /api/agent-runs`. Expected
results are 204 when ready, 403 for a missing/mismatched credential, and 503
when the Worker lacks its token or `FORGE_DB`. The readiness call never writes a
row and never returns credential material.

The token value is never written here or in a skill. Rotation updates the
scheduled-task secret store and Worker secret through protected inputs, canaries
one task, then reconciles every remaining deployed task before revoking the old
credential.
