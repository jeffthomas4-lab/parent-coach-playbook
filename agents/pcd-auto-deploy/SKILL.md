---
name: pcd-auto-deploy
description: Dana nightly auto-deploy for Parent Coach Desk. Compares live build-info to origin/main, runs pcd-deploy-code.ps1 when needed, honors deploy holds, never invents Cloudflare API tokens.
version: 1.0
last_edited: 2026-10-07
owner_workstream: Ops / release
action_class: Deploy
risk: R3
---

# PCD auto-deploy (Dana)

Grok Bot PCD routine `pcd-auto-deploy-dana` is the scheduler (nightly ~11:09 PM PT). This git-tracked SKILL.md is the procedure. Edit here first; the next Dana run picks it up. Never Read `Documents\Claude\Scheduled`.

**Role:** ship production when `origin/main` is ahead of live `parentcoachdesk.com`, via the sanctioned deploy script.

## Hard rules

- Follow PCD Windows machine gate (DESKTOP-primary). Loud-skip with Slack if Windows offline.
- **Clear** `CLOUDFLARE_API_TOKEN` / `CF_API_TOKEN` before any wrangler call. Use OAuth as **eepskalla**. Never invent or paste CF API tokens.
- Deploy only with `C:\Users\jefft\pcd\pcd-deploy-code.ps1` (or the FH213C twin when DESKTOP is down). Do not hand-roll a different wrangler path.
- Never deploy from a dirty tree with unrelated WIP. The script stashes/restores; if it still refuses a dirty tree, stop and Slack — do not `--force` or delete other agents' work.
- Honor a deploy hold: read `coordination/deploy-hold-state.json`. If a hold is set / nights are being held for a reason that blocks ship, **skip deploy**, Slack the hold reason, and exit. Do not clear a hold unless Jeff said clear this turn.
- **Do not** invent content publishes (that is Penny). Dana ships whatever is already on `origin/main`.
- Slack: `C0BJC3WTNKC` (`#pcd-agent-notications`).

## Before every run

1. `ListMachines`. Prefer DESKTOP (`041b6bba-f3a5-4989-877f-631c477340a3`); FH213C only if DESKTOP is offline.
2. Loud-skip if both Windows machines are offline.
3. Put `C:\Program Files\nodejs` and `C:\Program Files\Git\cmd` on PATH for the Shell session.
4. Clear CF API token env vars for the session.
5. In the PCD repo: `git fetch origin main`. Note local ahead/behind and dirty files.
6. Read `coordination/deploy-hold-state.json`. If held, Slack + skip (no deploy).

## Compare live vs main

1. Read live `https://parentcoachdesk.com/build-info.json` (nocache query ok) → `commit`.
2. Read `origin/main` SHA (`git rev-parse origin/main`).
3. If live commit **already equals** `origin/main` (content that matters is shipped): **no deploy**. Optional: commit inert leftovers only (see below). Slack a quiet "nothing to deploy" one-liner with both SHAs.
4. If local `main` has **unpushed** commits the script will refuse: push first (only commits that belong on main and Jeff/agents already intended), or Slack blocked and stop. Do not deploy a SHA that is not on `origin/main`.

## Deploy path

When live is behind `origin/main` and no hold:

1. Working tree must be clean enough for the script (unrelated dirt → stash via the script, or stop if stash cannot make it clean).
2. Run: `C:\Users\jefft\pcd\pcd-deploy-code.ps1` from PowerShell on DESKTOP (FH path when on fallback).
3. The script: fetches, refuses local-ahead-of-origin, skips if live already matches origin, stashes dirt, ff-only to origin/main, `npm ci`, `npm run build:production`, wrangler dry-run then deploy to worker `parent-coach-desk`, asset-proof + smoke test, restores stash.
4. **Verify:** live `build-info.json` `commit` matches the deployed SHA. Spot-check one recent URL if content shipped this run.
5. Slack one-liner with deployed short SHA (and live confirm), or failure reason.

## Inert leftovers (optional, no new policy)

If production already matches `origin/main` but the working tree has **inert** release evidence / ops artifacts the prior Dana pattern would commit (e.g. `coordination/release-evidence/asset-proof-*.json`, link-manifest style reports that do not change site content): those **may** be committed on `main` with a clear message. Do **not** invent a broader leftover policy. Anything that changes site content or needs a ship uses `pcd-deploy-code.ps1`, not a leftover commit alone.

## Success

- Live SHA == `origin/main` after the run (deployed this run, or already matched), Slack posted; **or**
- Honest skip: hold set, nothing to deploy, or Windows offline loud-skip; **or**
- Loud failure with reason (dirty tree, wrangler auth, smoke fail) — no silent "success."
