---
name: pcd-social-drafter
description: Sasha stages Parent Coach Desk Instagram + Threads social packs for Jeff to paste by hand (same photo and caption). Draft and stage only — no accounts, APIs, or auto-posting (scheduler later). Pinterest resume week of 2026-10-13.
version: 1.3
last_edited: 2026-10-08
owner_workstream: Marketing / distribution
action_class: Stage
risk: R1
---

# PCD social drafter (Sasha)

Grok Bot PCD routine `pcd-social-drafter-sasha` is the scheduler (weekdays 6:45 AM PT). This git-tracked SKILL.md is the procedure. Edit here first; the next Sasha run picks it up. Never Read `Documents\Claude\Scheduled`.

## Hard rules

- **Draft and stage only.** Jeff posts. No account creation, no API keys, no auto-posting, no scheduling on Jeff's behalf until he switches on a social scheduler.
- Follow PCD Windows machine gate (DESKTOP-primary).
- Brand voice: Parent Coach Playbook Editorial / Parent Coach Desk. Upbeat and professional. No public Jeff Thomas naming.
- Captions and other public social copy (Instagram caption, Threads caption, Facebook, X, Pinterest title and description, alt text) must pass `VOICE-RUBRIC.md` sections A, B, and C before the batch is done: structure, banned words, and banned patterns. That includes no em dashes and no asterisks or bold in a title-like line. Do not treat a shorter word list as the check. Name the failing item and rewrite it, or do not call the batch done.
- Amazon affiliate URLs and `/go/` Amazon redirects do not go in draft copy. Prefer canonical parentcoachdesk.com article URLs (UTM ok).
- **Every Instagram and Threads post MUST include a real photo.** No caption-only drafts. Fail the run if any post lacks a staged media file that exists on disk.
- **Daily requirement (current):** Instagram + Threads. Same photo and same core caption for both; Jeff posts each by hand. Pinterest folders already on disk stay; **do not delete them.** Full Pinterest staging cadence **resumes the week of 2026-10-13** — until then, daily runs are not required to refresh Pinterest packs.

Governing docs: `reports/social/SOCIAL-STAGE-PATTERN.md`, prior batches in `reports/social/SOCIAL_DRAFTS_*.md`, `EDITORIAL_VOICE.md` when present, `KIT_AND_SOCIAL_GATE_2026-10-02.md` (Reference).

Jeff gate 2026-10-02 (updated 2026-10-08): Kit = Jeff paste Fridays (Frida drafts). Instagram + Threads = Sasha drafts + Jeff posts by hand; photo and caption saved together for each; upbeat and professional; no public Jeff Thomas naming; daily photo required with each draft. Pinterest resumes week of 2026-10-13, same stage-then-paste. Scheduler automation is later. Do not change Kit from this skill.

## Before every run

1. Confirm DESKTOP PCD repo is reachable. Loud-skip with Slack if Windows offline.
2. List every `reports/social/SOCIAL_DRAFTS_*.md` and note the newest date. Do not repeat source articles used in the last 4 batches.
3. Pull recent published content: articles with `draft: false` (or no draft key) and `publishedAt` in the last ~14 days, plus evergreen resurfaces tied to the current seasonal week (`src/content/seasonCalendars/` or recent Ed/Penny ships).
4. Prefer live URLs that return HTTP 200.
5. Create today's Instagram and Threads pack folders before writing drafts (see Media staging below).

## The run (weekdays — Instagram + Threads)

Write a new file: `reports/social/SOCIAL_DRAFTS_YYYY-MM-DD.md` (America/Los_Angeles date of the run).

Target enough Instagram + Threads paste-ready posts to cover ~1/day until the next weekday run (typically **5 captions** Mon run for Mon–Fri, or top up remaining weekdays mid-week). Mix formats (tip card, discussion question, link post, checklist, carousel outline, short thread outline).

Weekday spine (use when it fits the source, do not force):
- Mon — script / what to say
- Tue — camps or calendar tip
- Wed — gear / checklist
- Thu — discussion question
- Fri — newsletter echo (same hook as Kit, different cut)
- Sat/Sun — tip card or quiet resurface (include in Mon batch if Jeff posts weekends)

For each draft include:
- **Source:** title + live URL (or evergreen note)
- **Format:** one of the formats above
- **Core copy:** paste-ready text in we/you editorial voice (this is the Instagram caption and the Threads caption)
- **Platform tags:** **Instagram + Threads caption first** (same body), then short notes for Facebook / X; Pinterest description only when building Pin packs (week of 2026-10-13+)
- **Staged image (REQUIRED for Instagram and Threads):** see Media block below. Do not ship a "visual need" alone.

Open the file with a short header: phase-0 manual-post only; nothing posted; batch count; mix; "checked against prior batches — no repeated source articles"; note that every IG + Threads post has a staged photo.

## Media staging (hard gate — fail the run without this)

Preferred root (Reference):

`C:\Users\jefft\OneDrive\Desktop\Reference\Parent Coach Desk\01-product\app\reports\social\`

Create these date folders each run:

- `instagram/YYYY-MM-DD/` — paste-ready IG pack (image + per-post `.txt` + `CAPTIONS.txt`)
- `threads/YYYY-MM-DD/` — paste-ready Threads pack (**mirror of Instagram**: same filenames and images; captions identical except `utm_source=threads`)
- `instagram-media/YYYY-MM-DD/` — working media folder (optional mirror of the IG images; keep for continuity)

Fallback (repo-relative, still acceptable if Reference path is unavailable):

`reports/social/instagram/YYYY-MM-DD/`, `reports/social/threads/YYYY-MM-DD/`, `reports/social/instagram-media/YYYY-MM-DD/`

For **every** Instagram / Threads post in the batch:

1. Export, crop, or generate a real image file into that day's `instagram/` folder, then **copy the same image file into that day's `threads/` folder** (same basename).
2. Target dimensions: **1080x1080** (feed square) or **1080x1350** (portrait 4:5). Prefer square unless the source art is clearly portrait.
3. Name the file clearly to match the draft slug (example: `effort-first-six-weeks-1080.jpg`).
4. Write per-post `.txt` and day `CAPTIONS.txt` in **both** `instagram/` and `threads/`. Threads copy uses `utm_source=threads` (and campaign date); Instagram keeps `utm_source=instagram`. Hashtags and body stay the same.
5. In the draft, replace free-form "Visual need" with this block:

```
**Staged image:**
- Path: <exact absolute or repo-relative path to the Instagram file>
- Threads pack: <exact path to the mirrored Threads file>
- Alt text: <one sentence, no Jeff Thomas name>
- Dimensions: 1080x1080 or 1080x1350
```

6. After writing the batch, verify each listed Instagram **and** Threads path exists on disk (`Test-Path` / equivalent). **If any post lacks a real media file in either pack, fail the run:** do not commit the drafts file, Slack that Sasha failed the photo gate, and stop.

Allowed sources for the file: existing `public/illustrations/*` heroes cropped to target size, a simple branded news/tip card (Parent Coach Desk only — no personal name), or a generated image already saved into the staging folder. "Visual need" or an imagegen prompt without a saved file is not enough.

## Pinterest (paused until week of 2026-10-13)

Existing `pinterest/YYYY-MM-DD/` folders under Reference **stay**. Do not delete or empty them.

From the week of **2026-10-13**, resume staging Pinterest packs alongside IG + Threads (1000x1500 pins, Board / Title ≤100 / Description ≤500 / Link with `?utm_source=pinterest&utm_medium=social&utm_campaign=seasonal-queue`). Starter boards: Tryout Season, What to Say to Your Kid, Team Parent Checklists.

Until that week, daily Sasha success does **not** require new Pinterest folders. Optional pin notes in `SOCIAL_DRAFTS_*.md` are fine but not required.

## Commit and Slack

1. Commit only the new `SOCIAL_DRAFTS_*.md` (and nothing unrelated). Push to `main` when the tree allows; leave unrelated dirty files alone. Staged media under Reference stays on disk for Jeff; do not force binary media into git unless already tracked under `reports/social/instagram-media/` or `reports/social/threads/`.
2. Slack `#pcd-agent-notications` (`C0BJC3WTNKC`): one line that Sasha staged N drafts with N photos for Instagram + Threads and the drafts file path. No full copy in Slack.
3. Do not deploy. Do not post to Instagram, Threads, or Pinterest. Do not tell Jeff unless something is blocked or he asked.

## Maintenance / quiet success

If there is truly nothing new to stage (no recent publishes and resurfaces would repeat the last 4 batches), write no file, Slack a one-line "Sasha: nothing new to stage," and end. That is a quiet success, not a failure.

## Idempotency

Same calendar day re-run overwrites that day's `SOCIAL_DRAFTS_YYYY-MM-DD.md` and reuses/refreshes that day's `instagram/`, `threads/`, and `instagram-media/` folders rather than creating a second file.
