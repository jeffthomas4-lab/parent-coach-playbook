# Scheduled-task run-log reconciliation

This inventory reconciles the ten Parent Coach Desk scheduled tasks recorded in
`PCD-OPERATING-MANUAL.md` section 3.2 with their version-controlled caller
contracts. It does not claim that the external scheduled-task copies have been
updated or that a run occurred. Runtime proof must be added only from the
scheduled-task system and the protected run registry.

Phase 0 does not graduate until every deployed task has a completed start,
finish, and controlled-failure receipt below. Agent-level spot checks are not
enough when one agent owns multiple cadences.

| Task ID | Recorded cadence | Owner | Version-controlled caller | Runtime secret source | Maintenance behavior | Start proof | Finish proof | Failure proof | Reconciliation state |
|---|---|---|---|---|---|---|---|---|---|
| `org-discovery-daily-worklist` | Daily 9:02 PM | Ranger | `automation/agents/ranger/SKILL.md` | protected scheduled-task store | stop live enrichment; report only | pending | pending | pending | source ready; deployed prompt and runtime secret unverified |
| `pcd-deletion-monitor` | Daily 7:04 AM | Vera | `agents/pcd-deletion-monitor/SKILL.md` via `automation/agents/vera/SKILL.md` | protected scheduled-task store | year-round proposal-only legal watch | pending | pending | pending | source ready; v1.3 deployment and runtime secret unverified |
| `pcd-link-health-monitor` | Mon 7:04 AM | Hal | `automation/agents/hal/SKILL.md` | protected scheduled-task store | report only | pending | pending | pending | source ready; deployed prompt and runtime secret unverified |
| `weekly-gsc-review` | Mon 8:08 AM | Nora | `automation/agents/nora/SKILL.md` | protected scheduled-task store | report only | pending | pending | pending | source ready; deployed prompt and runtime secret unverified |
| `pcd-rules-watcher` | Tue 7:08 AM | Ed | `automation/agents/ed/SKILL.md` | protected scheduled-task store | report only; no editorial writes | pending | pending | pending | source ready; deployed prompt and runtime secret unverified |
| `pcd-friday-letter-draft` | Wed 8:03 AM | Frida | `automation/agents/frida/SKILL.md` | protected scheduled-task store | hold; log no-draft result | pending | pending | pending | source ready; deployed prompt and runtime secret unverified |
| `pcd-camps-data-steward` | Thu 4:07 AM | Ranger | `automation/agents/ranger/SKILL.md` | protected scheduled-task store | report only; no staging writes | pending | pending | pending | source ready; deployed prompt and runtime secret unverified |
| `pcd-seasonal-content-scheduler` | Monthly, day 1 | Ed | `automation/agents/ed/SKILL.md` | protected scheduled-task store | hold; no plan or content writes | pending | pending | pending | source ready; deployed prompt and runtime secret unverified |
| `pcd-affiliate-reconciler` | Monthly, day 2 | Hal | `automation/agents/hal/SKILL.md` | protected scheduled-task store | report only | pending | pending | pending | source ready; deployed prompt and runtime secret unverified |
| `pcd-freshness-audit` | Quarterly, day 5 | Ed | `automation/agents/ed/SKILL.md` | protected scheduled-task store | report only | pending | pending | pending | source ready; deployed prompt and runtime secret unverified |

The two Barnabus portfolio tasks and `cowork-folder-weekly-scan` are deliberately
excluded: they may consume PCD information, but they are not PCD-owned callers.
The Cloudflare `activityradar-enrichment` cron is also excluded because it is a
Worker scheduler, not a scheduled-task prompt using this bearer contract.

## Proof procedure

1. Confirm the external task ID and cadence match the row without changing it.
2. Confirm its deployed prompt references the listed committed caller source.
   The committed side of this comparison is hashed: `npm run check:caller-hashes`
   recomputes the SHA-256 of every committed caller source in this table and
   matches it against `coordination/release-evidence/scheduled-task-caller-hashes.json`,
   so a caller source that drifts without updating this reconciliation fails
   instead of passing an eyeball check.
3. Confirm, by name only, that its protected runtime exposes
   `PCD_AGENT_RUNS_TOKEN`; never print or paste the value.
4. Run exactly one canary task. Its authenticated `HEAD /api/agent-runs`
   preflight must return 204. A 403 means missing/mismatched caller credential;
   a 503 means the Worker lacks its token or `FORGE_DB`.
5. Record the redacted run ID and observed timestamp for one start and matching
   finish receipt. Then exercise the caller's controlled fake/failure path and
   record the redacted failure receipt without causing a production mutation.
6. Only after the canary is clean, reconcile the remaining nine callers one at
   a time. Never copy one task's receipt into another row.

The token value is never written here or in a skill. Rotation updates the
scheduled-task secret store and Worker secret through protected inputs,
canaries one task, reconciles the remaining deployed tasks, and only then
revokes the old credential.
