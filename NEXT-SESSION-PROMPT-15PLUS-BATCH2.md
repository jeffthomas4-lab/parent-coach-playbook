# Pass-off prompt: 15+ content, Tier 1 batch 2

Paste everything below the line into a new conversation to continue this work.

---

Project: parentcoachdesk.com, an Astro 5 + Cloudflare Pages + D1 site. Folder: `Outputs/parent-coach-desk`. Read the project's `CLAUDE.md` norms first (Deployment norm, Backup norm, Website Build norm) — they're already in scope for this repo.

Read `SEO-RECOVERY-PROGRESS.md` in full first for session history. Read `strategy/15-PLUS-CONTENT-SCOPE.md` in full — it's the authoritative scoping doc for this task, current-state table included.

## Where things stand

A prior session identified that 13 of 26 sports on this site have zero articles tagged `age: 15-plus`, despite having solid content at younger age bands. Batch 1 (cross-country, lacrosse-girls, cheer, band, dance — 25 articles) is done and logged. The scope doc's table already reflects that.

## This session's job: Tier 1 batch 2

Write 5 new `age: 15-plus` articles each for **crew, martial-arts, stunt, and choir** (20 articles total). These are the remaining Tier 1 zero-article sports that don't require a whole-sport content rebuild first (unlike flag-football, football-7v7, and lacrosse-boys — see note below, do not touch those this session).

Use the exact same dispatch pattern as batch 1: one parallel `Agent` tool call per sport, each agent given:
- The 3 reference files to read first for tone/structure/frontmatter: `src/content/articles/varsity-basketball-tryouts-the-real-odds.md`, `src/content/articles/football-recruiting-what-parents-need-to-know.md`, plus one topically-relevant third file (for choir, use a band or theater 15+ piece; for martial-arts/crew/stunt, use whichever existing sport reference fits best).
- The relevant existing guide/pathway page for that sport/activity to read first, so facts stay consistent with what the site already states (`src/content/guides/{sport}.md`, `src/content/pathways/{sport}.md`).
- The 5-template structure from `15-PLUS-CONTENT-SCOPE.md` (recruiting/audition overview, varsity/placement "real odds," "didn't get recruited/placed," sport-specific structural quirk, recruiting-adjacent tool piece), using the arts variant for choir.
- Exact frontmatter schema (copy the shape from any batch-1 file, e.g. `src/content/articles/cross-country-recruiting-what-parents-need-to-know.md`), adjusting `sport`, `topic`, `phase` per file. Confirm the correct enum value for `sport` before writing (check `src/content/config.ts` SPORT_ENUM — note stunt and crew and martial-arts may have specific enum spellings, verify, don't assume).
- A research requirement: verify any specific factual claim (NCAA/NAIA rules, participation numbers, governing-body specifics — e.g. USA Wrestling/martial arts belt-to-college pipeline realities, US Rowing recruiting norms, STUNT program specifics already established in `guides/stunt.md`) via WebSearch rather than inventing a number. Phrase without invented precision if uncertain.
- The internal-linking requirement: one natural in-prose link to `/pathways/{sport}/` per article. No "Gear mentioned" footer unless a `/go/{slug}/` entry is confirmed to already exist in `src/data/affiliates.json` (grep it first) — if not certain, skip the footer.
- The full anti-AI voice rules (banned word list, no em dashes, 3-sentence paragraph max, no reframe patterns/fake wisdom triplets/empowerment closes) — copy these verbatim from any batch-1 agent dispatch, they're in the conversation history / `About Me/anti-ai-writing-guide`.
- An instruction to self-check the finished files against the banned-word list and frontmatter validity before reporting back, and to report back concisely (filenames, link confirmation, no dead affiliate links, under 200 words).

Note on crew and martial-arts and stunt specifically: each currently has exactly 1 article total on the whole site. Treat these as genuinely thin sports needing real research into how recruiting/placement actually works for each (e.g. US Rowing recruiting for crew, which is a real and fairly well-defined pipeline; martial-arts has close to no formal "college recruiting" pathway, so that agent may need to adapt template #1 into something like "how martial arts experience actually plays into a college application" rather than force a recruiting frame that doesn't exist for the sport — use judgment, don't fabricate a recruiting pipeline that isn't real).

## After writing

1. Verify: spot-check a couple of files per sport with the Read tool, confirm frontmatter validity and pathway links are present, confirm no invented affiliate links.
2. Update `strategy/15-PLUS-CONTENT-SCOPE.md`'s current-state table: mark crew, martial-arts, stunt, choir as 5/5 with "DONE" and today's date, same format as the batch-1 rows.
3. Log the batch in `SEO-RECOVERY-PROGRESS.md`, following the same format as the "15+ content gap: batch 1" section already there (file list per sport, what was verified via research, any voice-rule fixes made, confirmation on no dead affiliate links).
4. Update the TaskList: mark this batch's task completed, and create a new task for the next one (see below).
5. End the reply with the standard build → commit → deploy → push PowerShell block per the Deployment and Backup norms in `CLAUDE.md`, since new files are landing in the site's source tree. Use the parentcoachdesk.com / `parent-coach-playbook` project block.

## What's left after this batch (don't start yet, just know it's next)

- **flag-football, football-7v7, lacrosse-boys** need a whole-sport content scope first — these have zero or near-zero articles at *any* age, not just 15+. That's a separate scoping exercise before writing makes sense, not a simple 5-article top-up.
- **Tier 2**: the 13 sports with thin (1-3) 15+ coverage need top-up to 5 each, using whichever of the 5 templates each is missing (soccer, football, hockey each need 2 more; baseball, softball, basketball, volleyball need 3 more; swimming, track-field, tennis, golf, gymnastics, theater, ballet need 4 more).
- A known open item, unrelated to this task but surfaced twice now: a handful of legacy articles have mid-plain-word truncations (no markdown-link syntax, so the earlier grep pattern doesn't catch them). Two instances were found and fixed opportunistically. No exhaustive re-scan has been done for this specific pattern. Worth flagging if it resurfaces, not this session's job unless asked.
