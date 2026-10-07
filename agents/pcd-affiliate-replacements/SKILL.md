---
name: pcd-affiliate-replacements
description: Arnie sources browser-verified replacement products for Linda's open affiliate queue items, writes proposals into replacement-queue.json, and never edits affiliates.json or deploys.
version: 1.0
last_edited: 2026-10-07
owner_workstream: Affiliate ops
action_class: Propose
risk: R2
---

# PCD affiliate replacements (Arnie)

Grok Bot PCD routine `pcd-affiliate-replacements-arnie` is the scheduler (Tuesday). This git-tracked SKILL.md is the procedure. Edit here first; the next Arnie run picks it up. Never Read `Documents\Claude\Scheduled`. Claude Scheduled is retired; this file is canonical (promoted from `reports/link-health/ARNIE-TASK.md`).

**Role:** `pcd-affiliate-replacement-sourcer` (Arnie) — propose-only.

## Pipeline (do not collapse stages)

Linda (link health fills open void items) → **Arnie proposes** → **Jeff approve** → Alfred stages PR → merge/deploy separately (Jeff or Dana after explicit go).

Hal owns S5 weekly link health and S6 monthly reconcile (`automation/agents/hal/SKILL.md`). Do **not** re-run Linda/Hal checks or invent open items. Arnie only consumes `reports/link-health/replacement-queue.json`.

## Hard rules

- Follow PCD Windows machine gate (DESKTOP-primary). Loud-skip with Slack if Windows offline.
- Work items with `status == "open"` (and any item Jeff explicitly handed for re-propose). Ignore already `proposed` / `approved` / `staged` unless re-propose was requested.
- **Browser-verify every proposal.** Live + In Stock + correct product for `product_intent`. Space Amazon / amzn.to requests 5–10s apart (prefer ~30s). Never invent ASINs. If the browser is unavailable, leave the item `open` and note needs manual browser recheck — do not propose from a raw fetch alone.
- Keep Amazon `tag=parentcoachpl-20` on every proposed destination.
- Reconcile against `src/data/affiliate-governance.json` and `reports/affiliate/lifecycle.json` **before** sourcing. Retired / owned / handled slugs → `retire-recommended`, do not source.
- **Do NOT** edit `src/data/affiliates.json`. **Do NOT** open Alfred's staging PR. **Do NOT** deploy or merge.
- BabyLove auto-insert is a **separate** daily lane (`affiliate-governance.json` → `babylove_auto_insert`). Do not conflate with this Tuesday replacement-queue job unless the routine explicitly says otherwise.
- Slack: `C0BJC3WTNKC` (`#pcd-agent-notications`).

## Before every run

1. Confirm DESKTOP PCD repo is reachable (`C:\Users\jefft\pcd\parent-coach-playbook`). Loud-skip if Windows offline.
2. Put `C:\Program Files\nodejs` and `C:\Program Files\Git\cmd` on PATH for the Shell session.
3. `git fetch` / `git status -sb` on `main`. Note dirty files you must not touch.
4. Read `reports/link-health/replacement-queue.json` (`consumer_instructions` + `totals` + `items`).
5. Skim `src/data/affiliate-governance.json` and `reports/affiliate/lifecycle.json` for retired/owned slugs.

## The run (open items only)

For each queue item with `status == "open"`:

1. **Reconcile:** if governance or lifecycle already retires/owns the slug, set `status` to `retire-recommended` with a one-line reason; leave `resolution` null (or note the governance reason). Move on.
2. **Source:** match `product_intent` (and youth/sizing when relevant). Use `suggested_search_query` as a starting point, not a constraint. Prefer the same `retailer` so tag structure stays consistent. If `resolution` already carries a `suggested_replacement` / candidate URL, browser-confirm that first.
3. **Browser-verify:** navigate the product page; confirm live listing, In Stock (or honest note if Amazon bot-walls stock), and title/SKU match intent. Prefer ~30s between Amazon requests.
4. **Write proposal** into `resolution`:
   - `proposed_destination` — full URL with `tag=parentcoachpl-20` for Amazon
   - `proposed_asin` — ASIN string or `null`
   - `product_title` — page title as seen
   - `verified` — e.g. `browser-confirmed In Stock YYYY-MM-DD` (or honest bot-wall caveat)
   - `note` — why this product fits `product_intent`
   Set `status` to `proposed`.
5. **No good match:** set `status` to `retire-recommended` with a one-line reason; leave `resolution` null.
6. Update the top-level `totals` block. Do not delete items Jeff has not reviewed.

Then:

7. Optionally write a short run note under `reports/link-health/` or `reports/affiliate/` if the batch is non-trivial (slug table + caveats). Not required when open→proposed is empty.
8. Commit queue JSON (+ any Arnie report) when the tree allows. Message shape: `Arnie: propose N affiliate replacements (YYYY-MM-DD)` (or retire-recommended counts in the body). Push `main` when clean enough; never force-push; leave unrelated dirty files alone.
9. **Slack:** digest when proposals (or retire-recommended) are ready; quiet one-liner when `open == 0` / empty run (`Arnie: empty run — 0 open items YYYY-MM-DD`).

## Empty run

If zero `open` items: Slack one-line empty-run; no inventing work; commit not required.

## Success

- Open items moved to `proposed` or `retire-recommended`, totals updated, queue committed/pushed when needed, Slack digest or empty-run line.
- No `affiliates.json` edits, no Alfred PR, no deploy, no invented ASINs, no BabyLove insert conflation.
