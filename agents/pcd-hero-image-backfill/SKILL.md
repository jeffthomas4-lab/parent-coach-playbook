---
name: pcd-hero-image-backfill
description: Iggy nightly hero-image backfill for Parent Coach Desk articles and guides. Library reuse first, variants via Pillow, generate only with OPENAI_API_KEY; never invent heroes and never deploy.
version: 1.0
last_edited: 2026-10-07
owner_workstream: Editorial / media
action_class: Stage
risk: R1
---

# PCD hero image backfill (Iggy)

Grok Bot PCD routine `pcd-hero-image-backfill-iggy` is the scheduler (nightly). This git-tracked SKILL.md is the procedure. Edit here first; the next Iggy run picks it up. Never Read `Documents\Claude\Scheduled`.

## Hard rules

- Follow PCD Windows machine gate (DESKTOP-primary). Loud-skip with Slack if Windows offline.
- Prefer **library reuse** from `public/illustrations/*.webp` (match sport/scene; set `heroAlt`). Do not invent a hero filename that is not on disk.
- Generation is allowed **only** when `OPENAI_API_KEY` is set in the shell. Prefer the imagegen skill / supported OpenAI image path. Do **not** use deprecated hardcoded `scripts/gen_hero_image.py` (key was burned; script is obsolete).
- If the key is unset and the library cannot cover a gap: log a backlog item and Slack one line — do **not** invent heroes or fake frontmatter paths.
- Commit message shape: `Backfill N hero image fix(es) (Iggy nightly)` (singular when N=1). Push to `main` when the tree allows. Leave unrelated dirty files alone.
- **Do NOT deploy.** Dana / nightly / Jeff handles site deploys.
- Quiet success when backlog is 0 and no fixes were needed (no Slack required).
- Slack channel for loud outcomes: `C0BJC3WTNKC` (`#pcd-agent-notications`).

## Scope

Nightly hero backfill for markdown under `src/content/` (articles, guides, and other published collections that render a hero). Scan for:

1. Missing `hero` frontmatter on pieces that should show a hero
2. `hero` path whose file is missing under `public/`
3. Corrupt / unreadable image files
4. Missing responsive variants (`-480.webp` / `-960.webp`) for a source illustration

## Before every run

1. Confirm DESKTOP PCD repo is reachable (`C:\Users\jefft\pcd\parent-coach-playbook`). Loud-skip if Windows offline.
2. Put `C:\Program Files\nodejs` and `C:\Program Files\Git\cmd` on PATH for the Shell session.
3. `git status -sb` on `main`. Note dirty files you must not touch.
4. Confirm Pillow is available for variant builds (`python -c "from PIL import Image"`). Install with `pip install Pillow` only if missing and the environment allows it.

## The run

1. **Scan** `src/content/**/*.md` frontmatter for `hero` / `heroAlt`. Cross-check each `hero` path against `public/` (paths are usually `/illustrations/<name>.webp`).
2. **Library match:** for missing heroes, pick an existing illustration that matches sport/scene (filename + content cues: volleyball gym, football helmets, kitchen phone, empty field, etc.). Set:
   - `hero: "/illustrations/<existing>.webp"`
   - `heroAlt: "<one plain sentence, no Jeff Thomas name, no brand logos>"`
3. **Variants:** for any source illustration that lacks `-480` / `-960` siblings, run:
   ```
   python scripts/build-illustration-variants.py
   ```
   Or pass specific filenames. Commit the new variant files with the frontmatter fixes when they are part of this run's fix set.
4. **Generate (optional):** only if `OPENAI_API_KEY` is set and library reuse cannot cover a needed scene. Write a new `.webp` under `public/illustrations/`, then build variants, then set frontmatter. Prefer imagegen over `gen_hero_image.py`.
5. **Backlog:** if generation is blocked and library has no fit, append a short note (slug + needed scene) to today's run summary / Slack — do not invent a path.
6. **Commit + push:** stage only Iggy files (content frontmatter + new/changed illustrations/variants). Message: `Backfill N hero image fix(es) (Iggy nightly)`. Push `main` when clean enough; never force-push; never amend unrelated work.
7. **Do not** run wrangler or `pcd-deploy-code.ps1`.

## Success

- Backlog 0 and no fixes → quiet success.
- N fixes committed and pushed (or staged if push blocked by unrelated dirty tree — say so loudly).
- One Slack line only when there are fixes, a backlog that needs Jeff, or a loud skip.
