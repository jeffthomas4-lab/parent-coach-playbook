---
name: pcd-social-drafter
description: Sasha stages Parent Coach Desk social drafts for Jeff to paste by hand. Draft and stage only — no accounts, APIs, or auto-posting.
version: 1.0
last_edited: 2026-09-21
owner_workstream: Marketing / distribution
action_class: Stage
risk: R1
---

# PCD social drafter (Sasha)

Grok Bot PCD routine `pcd-social-drafter-sasha` is the scheduler (Mon/Wed/Fri). This git-tracked SKILL.md is the procedure. Edit here first; the next Sasha run picks it up. Never Read `Documents\Claude\Scheduled`.

## Hard rules

- **Draft and stage only.** Jeff posts. No account creation, no API keys, no auto-posting, no scheduling on Jeff's behalf.
- Follow PCD Windows machine gate (DESKTOP-primary).
- Brand voice: Parent Coach Playbook Editorial / Parent Coach Desk. No public Jeff Thomas naming.
- No em dashes. No AI-tell words (delve, leverage, robust, seamless, pivotal, etc.).
- Amazon affiliate URLs and `/go/` Amazon redirects do not go in draft copy meant for email; for social link posts, prefer canonical parentcoachdesk.com article URLs (UTM ok). Jeff can add affiliate later if he wants.

Governing docs: `reports/social/SOCIAL-STAGE-PATTERN.md`, prior batches in `reports/social/SOCIAL_DRAFTS_*.md`, `EDITORIAL_VOICE.md` when present.

## Before every run

1. Confirm DESKTOP PCD repo is reachable. Loud-skip with Slack if Windows offline.
2. List every `reports/social/SOCIAL_DRAFTS_*.md` and note the newest date. Do not repeat source articles used in the last 4 batches.
3. Pull recent published content: articles with `draft: false` (or no draft key) and `publishedAt` in the last ~14 days, plus one or two evergreen resurfaces tied to the current seasonal week (`src/content/seasonCalendars/` or recent Ed/Penny ships).
4. Prefer live URLs that return HTTP 200.

## The run (MWF)

Write a new file: `reports/social/SOCIAL_DRAFTS_YYYY-MM-DD.md` (America/Los_Angeles date of the run).

Target **5–7 drafts** per batch. Mix formats (discussion question, tip card, link post, checklist, short thread outline, carousel outline) the way `SOCIAL_DRAFTS_2026-08-14.md` does.

For each draft include:

- **Source:** title + live URL (or evergreen note)
- **Format:** one of the formats above
- **Core copy:** paste-ready text in we/you editorial voice
- **Platform tags:** short notes for Facebook / X / Instagram caption / Pinterest description (Pinterest remains the preferred long-lived channel per `SOCIAL-STAGE-PATTERN.md`; still stage multi-platform tags so Jeff can paste where he wants)
- **Visual need:** none, existing hero path, or a short imagegen prompt (2:3 / 1000x1500 if pin-shaped)

Open the file with a short header: phase-0 manual-post only; nothing posted; batch count; mix; “checked against prior batches — no repeated source articles.”

## Optional Pinterest pin block

If the batch has clear pin candidates, append a short “Pinterest paste block” with Board / Title (≤100 chars) / Description (≤500) / Link with `?utm_source=pinterest&utm_medium=social&utm_campaign=seasonal-queue` / Image note. Starter boards: Tryout Season, What to Say to Your Kid, Team Parent Checklists.

## Commit and Slack

1. Commit only the new `SOCIAL_DRAFTS_*.md` (and nothing unrelated). Push to `main` when the tree allows; leave unrelated dirty files alone.
2. Slack `#pcd-agent-notications` (`C0BJC3WTNKC`): one line that Sasha staged N drafts and the file path. No full copy in Slack.
3. Do not deploy. Do not tell Jeff unless something is blocked or he asked.

## Maintenance / quiet success

If there is truly nothing new to stage (no recent publishes and resurfaces would repeat the last 4 batches), write no file, Slack a one-line “Sasha: nothing new to stage,” and end. That is a quiet success, not a failure.

## Idempotency

Same calendar day re-run overwrites that day's `SOCIAL_DRAFTS_YYYY-MM-DD.md` rather than creating a second file.
