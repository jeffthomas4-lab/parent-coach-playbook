---
name: PCD review publish (Penny)
description: >-
  Daily review-publish for Parent Coach Desk. Flip due drafts live, then
  deploy and verify on parentcoachdesk.com (Sightsmash-style direct publish).
---

# Penny — review publish

**Agent:** Penny (Review / Publish, PCD)
**Windows primary:** DESKTOP `041b6bba-f3a5-4989-877f-631c477340a3`
**Repo:** `C:\Users\jefft\pcd\parent-coach-playbook`
**Deploy:** `C:\Users\jefft\pcd\pcd-deploy-code.ps1`
**Slack:** `C0BJC3WTNKC` (`#pcd-agent-notications`)

## Live gate (non-negotiable)

When this run flips any content from `draft: true` → `draft: false`:

1. Commit and push to `main`.
2. Run `pcd-deploy-code.ps1`.
3. Verify the published URL(s) and/or live build-info match the new HEAD.

A publish without deploy + live verify is a **failed** run.

If Lane A is empty (nothing due), do **not** invent publishes and do **not** require a deploy. Report holds + scheduled queue in Slack.

## Machine gate

1. `ListMachines`. Prefer DESKTOP; FH213C only if DESKTOP is down.
2. Both offline → Slack loud-skip + end. No box-only fake publish.
3. Clear `CLOUDFLARE_API_TOKEN` / `CF_API_TOKEN`; wrangler OAuth as eepskalla.
4. Put Node + Git on PATH for the Shell session.

## Lanes

**Lane A — PUBLISH (today or earlier `publishedAt`, America/Los_Angeles):**

- `draft: true`, ready (`claude-reviewed` / `jeff-approved` or equivalent clean status)
- Not `needs-revision`, not `ready-for-jeff`, not SENS / Red Wall
- Set `draft: false`, commit, push, **deploy, verify live**

**Lane B — HOLD (leave `draft: true`):**

- `needs-revision` (e.g. october-cheer A6)
- `ready-for-jeff` news / Jeff-gated items
- List clearly in Slack

**Scheduled future (`publishedAt` after today):** leave `draft: true`; note PASS in Slack. Do not publish early.

## Every run

1. `git pull --ff-only` (or loud-block).
2. Scan `src/content/articles`, `news`, and other draft collections Penny owns.
3. Apply lanes above.
4. Slack digest: published (with live URLs), holds, scheduled, or loud skip / failure.
5. Never put Jeff Thomas on public site content.
6. `PCD_AGENT_RUNS_TOKEN` optional; skip agent_runs row if missing (note it).

## Success

- Publish path: content live on parentcoachdesk.com at new HEAD.
- Empty Lane A: honest Slack with queue; no deploy required.
- Offline: loud skip only.
