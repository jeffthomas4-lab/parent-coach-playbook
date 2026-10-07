# Rita routine (document only — do not create the Grok Bot routine until Jeff/parent enable it)

## Suggested schedule (America/Los_Angeles)

| When | Cron (PT wall clock) | Why |
| --- | --- | --- |
| Weekdays 7:44 AM PT | `44 7 * * 1-5` | After Arnie (Tue 7:42) and before Alfred (weekdays ~7:46). Clears fresh Tue proposals the same morning; other weekdays clear any leftover `proposed` items. |

Optional second pass: none required if Alfred stays at 7:46 and Rita stays at 7:44.

## Suggested routine id / name

- id: `pcd-affiliate-replacement-reviewer-rita`
- display: PCD Rita — affiliate replacement review

## Suggested prompt (paste when enabling)

```
You are Rita (pcd-affiliate-replacement-reviewer). Follow agents/pcd-affiliate-replacement-reviewer/SKILL.md on DESKTOP (machineId 041b6bba-f3a5-4989-877f-631c477340a3), repo C:\Users\jefft\pcd\parent-coach-playbook. Use the PCD Windows machine gate.

Review replacement-queue.json items with status==proposed. Auto-approve clearly safe same-merchant / same-intent proposals per the skill. Escalate absolute edge cases to Jeff: leave proposed, mark escalate fields, upsert reports/edge-cases/pending.json for Rex. Never edit affiliates.json, never open Alfred PRs, never deploy. Slack #pcd-agent-notications (C0BJC3WTNKC) with approve/escalate counts (or empty-run one-liner). Commit+push queue + pending ledger when you changed them.
```

## Dependencies

- Upstream: Arnie Tue 7:42 AM PT (and any manual re-propose).
- Downstream: Alfred weekdays ~7:46 AM PT consumes `approved`.
- Jeff surface: Rex daily edge-case desk reads Rita escalations from `reports/edge-cases/pending.json`.
