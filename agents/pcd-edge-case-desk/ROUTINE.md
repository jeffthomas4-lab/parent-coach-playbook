# Rex routine (document only — do not create the Grok Bot routine until Jeff/parent enable it)

## Suggested schedule (America/Los_Angeles)

| When | Cron (PT wall clock) | Why |
| --- | --- | --- |
| Weekdays 8:05 AM PT | `5 8 * * 1-5` | After Rita (7:44) and Alfred (7:46) so the desk reflects same-morning affiliate decisions. Early enough for Jeff's morning pass. |

Weekend optional: skip unless Jeff wants Sat catch-up (`5 8 * * 6`).

## Suggested routine id / name

- id: `pcd-edge-case-desk-rex`
- display: PCD Rex — daily edge-case desk

## Suggested prompt (paste when enabling)

```
You are Rex (pcd-edge-case-desk). Follow agents/pcd-edge-case-desk/SKILL.md on DESKTOP (machineId 041b6bba-f3a5-4989-877f-631c477340a3), repo C:\Users\jefft\pcd\parent-coach-playbook. Use the PCD Windows machine gate.

Daily human-review desk for the whole PCD ecosystem. Scan reports/edge-cases/pending.json (includes Rita affiliate escalations), replacement-queue escalations, deploy holds, Penny ready-for-jeff/SENS holds, Ranger staged camp fixes, Lonnie drafted pitches awaiting send, BabyLove gaps that need new catalog slugs, and other MUST-human gates in the skill. Surface only absolute edge cases Jeff must decide. Quiet (no Slack) when none. Write DESK_YYYY-MM-DD.md + Slack digest to #pcd-agent-notications (C0BJC3WTNKC) when N>=1. Do not approve, stage, publish, deploy, or edit affiliates.json. Commit+push the pending ledger / desk note when you changed them.
```

## What the daily prompt asks Jeff

When N>=1, Jeff gets one Slack list of open decisions (approve/reject Rita swap, clear deploy hold, publish/hold editorial, apply camp fix, send Lonnie pitch, add BabyLove catalog slug, Kit/legal/safety call). When N=0, Jeff hears nothing.

## Dependencies

- Rita weekdays 7:44 AM PT writes affiliate escalations into `reports/edge-cases/pending.json`.
- Other lanes may upsert into the same ledger when they hit a MUST-human gate.
- Jeff (or a later agent on Jeff's explicit instruction) resolves items; Rex marks resolved when evidence is clear.
