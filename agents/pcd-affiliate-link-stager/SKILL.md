---
name: pcd-affiliate-link-stager
description: Alfred stages Rita-approved (or Jeff-after-Rex) affiliate replacements into affiliates.json and product cards, opens a PR, and never merges or deploys unless Jeff said go this turn.
version: 1.1
last_edited: 2026-10-07
owner_workstream: Affiliate ops
action_class: Stage
risk: R2
---

# PCD affiliate link stager (Alfred)

Grok Bot PCD routine `pcd-affiliate-link-stager-alfred` is the scheduler (weekdays ~7:46 AM PT). This git-tracked SKILL.md is the procedure. Edit here first; the next Alfred run picks it up. Never Read `Documents\Claude\Scheduled`.

## Pipeline (do not collapse stages)

Linda (link health) -> Arnie (propose) -> **Rita auto-approve / escalate** -> **Alfred stages PR** (`approved` only) -> merge/deploy separately (Jeff or Dana after explicit go).

Jeff is not on the happy path. Rita escalations surface on **Rex** (`agents/pcd-edge-case-desk/SKILL.md`); Jeff decides those, then Alfred stages once `status == "approved"`.

Alfred works **only** items with `status == "approved"` (set by Rita auto-approve, or by Jeff after a Rex escalation). Never invent ASINs. Never change unrelated slugs. Honor `src/data/affiliate-governance.json` and `reports/affiliate/lifecycle.json`. Do not process `proposed` or Rita-escalated items.

## Hard rules

- Follow PCD Windows machine gate (DESKTOP-primary). Loud-skip with Slack if Windows offline.
- Read `reports/link-health/replacement-queue.json`. Process only `status == "approved"` (not `open`, `proposed`, or already `staged`).
- Keep Amazon `tag=parentcoachpl-20` on every destination Alfred writes.
- Open a PR on branch `alfred/affiliate-swaps-YYYY-MM-DD`. **Do NOT merge** and **do NOT wrangler-deploy** unless Jeff explicitly said go this turn.
- Empty run (0 approved): Slack one-line empty-run; no PR; no commit required.
- Slack: `C0BJC3WTNKC` (`#pcd-agent-notications`).

## Before every run

1. Confirm DESKTOP PCD repo is reachable. Loud-skip if Windows offline.
2. Put Node and Git on PATH for the Shell session.
3. `git fetch` / `git status -sb` on `main`. Start a clean branch from up-to-date `main`.
4. Read `src/data/affiliate-governance.json` and skim `reports/affiliate/lifecycle.json` so retired/owned slugs are not re-staged.

## The run (approved items only)

For each queue item with `status == "approved"`:

1. **affiliates.json:** update that slug's destination to `resolution.proposed_destination` (keep `tag=parentcoachpl-20`). Do not rename the slug. Do not invent a new ASIN beyond what Arnie/Rita/Jeff already put in `resolution`.
2. **Named product cards:** if guides/articles still describe the old product by brand/name, update those cards to match the new product (see PR #80 / `DEPLOYED_2026-09-17.md` pattern: football, volleyball, boosters-gear, wrestling, etc.). Touch only cards that still describe the old product for that slug.
3. **Queue status:** set `status` to `staged`, and set `resolution.staged_at` (America/Los_Angeles date) and `resolution.staged_by` (e.g. `alfred-pcd-YYYY-MM-DD`). Update the `totals` block.
4. **Staging report:** write `reports/affiliate/DEPLOYED_YYYY-MM-DD.md` as a **staging** report (table of slug -> new ASIN / notes, caveats, content cards updated). Do not claim live deploy unless Jeff already merged and deployed.

Then:

5. Commit on `alfred/affiliate-swaps-YYYY-MM-DD` with a message like `Alfred: stage N affiliate link swaps (YYYY-MM-DD)`.
6. Push the branch and open a PR (title/body mirroring PR #80: summary, caveats, test plan for `/go/<slug>/` after merge+deploy). Link the staging report.
7. Stop. Merge and production deploy are **out of scope** unless Jeff said go this turn.

## Empty run

If zero `approved` items: post one Slack line (`Alfred: empty run — 0 approved items YYYY-MM-DD`) and exit. No PR.

## Success

- N approved items staged, queue marked `staged`, PR open, Slack one-liner with PR link — or empty-run Slack only.
- No merge, no wrangler, no invented ASINs, no unrelated slug edits.
