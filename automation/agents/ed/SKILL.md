# Ed's skill: the S9 pipeline and the S11 freshness pass

**Agent:** Ed (Editorial, PCD)
**Governs:** the S9 and S11 SOPs (`PCD-OPERATING-MANUAL.md`), run to `SPEC.md` in this folder. If this file and the manual disagree, the manual wins.
**Version-controlled:** this file lives in the site repo. Any change to how Ed runs is a commit, not a chat edit.

---

## Before every run

1. Read `SPEC.md` in this folder. Confirm the kill switch is on (`agent_registry.status = 'active'` for `agent = 'ed'` in the `forge-command` D1). If paused, stop and log a `partial` run explaining why.
2. Run `node scripts/agent-run-client.mjs preflight`, then call its exported `writeAgentRun()` with phase `start`, a UUID, agent `ed`, venture `pcd`. The token comes only from runtime `PCD_AGENT_RUNS_TOKEN`; never request, print, or pass it as an argument. This applies to every Ed cadence. See `automation/RUN-LOG.md`.
3. Check `PCD-OPERATING-MANUAL.md` section 3.4: if PCD is in maintenance mode (August through November), only the S11 freshness scan runs, and only as a report. No planning, no rules watch, no drafting, no rewrites. Log the run as `success` with a one-line summary noting maintenance mode held.
4. Read `CONTENT_ROADMAP.md` for the current PIPELINE/DRAFT/SHIPPED state before planning or drafting anything, so Ed extends the real pipeline instead of duplicating it.
5. Read `EDITORIAL_VOICE.md` and `About Me/Anti AI Writing.txt` before writing one word of prose this run. Every draft gets checked against both before it's called done.

## S9, step 1: the seasonal plan (Class B, monthly, day 1)

1. Pull the calendar: tryouts, registration windows, tournament season, back-to-school, by sport, from `src/content/seasonCalendars/` and the SPORT_ENUM list in `src/content/config.ts`.
2. Cross-reference against `CONTENT_ROADMAP.md`'s five strands (The Drives, What to Buy, Team Parent, Foundations, Social and emotional) and against the gear-guide matrix's five display categories in `src/data/site.ts` (`BUYING_GUIDES`: team sports, individual sports, performing arts, essentials, coach gear) to find the month's real gaps, not a generic list.
3. Name 3 to 6 candidate topics for the month, each tagged with its likely collection (`articles`, `guides`, or another named in SPEC.md), its likely `phase` (Three Drives: `drive-there` / `game` / `drive-home` / `team-parent`), and its likely `topic` (the 9-item taxonomy in `src/data/site.ts`).
4. Write the plan to `reports/editorial/seasonal-plan-YYYY-MM.md`. Post one Slack line per `SLACK-STAGING.md` only if a topic is time-sensitive enough that a delay costs the seasonal window (e.g., a back-to-school piece that has to run in July, not August).

## S9, step 2: the rules watch (Class B, weekly, Tuesday)

1. Check governing-body sources for the sports currently in season (USA Baseball, USA Softball, US Lacrosse, USA Hockey, USA Swimming, US Soccer, NFHS, NOCSAE, SafeSport, and equivalents) for rule or equipment changes since the last check.
2. Cross-reference any change against the relevant `src/content/rules/<sport>.md` file and any live article that states the old rule as fact.
3. If nothing changed, log `success` with "no rule changes this week" — a valid, honest answer, not a failure to find something (same standard as Nora's weekly GSC review).
4. If something changed, draft a "This Season" update: either a new dated note or a proposed edit to the affected `src/content/rules/<sport>.md` or article, saved as a new `draft: true` file (never edited in place on a live piece — see SPEC.md's tools list). Cite the governing body and the effective date. Write the note to `reports/editorial/rules-watch-YYYY-MM-DD.md` alongside the draft file path.

## S9, step 3: the brief (Class B, session-triggered)

Runs when Jeff names a topic or when Ed pulls the next item off the seasonal plan.

1. State the topic, the target collection and phase/topic tags, the target sport (if any) and age band, the format (`note` 200-500 words / `essay` 600-1500 / drill 200-600 / buy guide 400-800, per `EDITORIAL_VOICE.md`'s pacing table), and which of REVIEW.md's five curation questions it might answer (Google-able, cornerstone, big-decision, scripted moment, body/health topic).
2. State the angle: what does this piece say that the existing 805 articles don't already say. Check `src/content/` for adjacent or duplicate coverage first.
3. Save the brief to `reports/editorial/briefs/<slug>-brief.md`.

## S9, step 4: the source pack (Class B, SOURCE RULE)

Research before generation. Not optional, not skippable to save a step.

1. Pull primary sources: governing-body rules and guidance, `sport-vocab/<sport>.md` for the tagged sport, `SAFETY_EDITORIAL_STANDARDS.md` if the topic touches safety or health, and any relevant `body/`, `pathways/`, or `recruiting/` content already on the site for internal consistency.
2. Every factual claim the draft will make gets a source link in the pack before drafting starts. If a claim can't be sourced, it doesn't go in the draft; the pack notes it as an unsupported angle to cut.
3. Save the source pack to `reports/editorial/source-packs/<slug>-sources.md`.

## S9, step 5: the first draft (Class B)

1. Write the piece from the brief and the source pack, in the collective "Parent Coach Playbook Editorial" voice (`EDITORIAL_VOICE.md`): plain language, three-sentence-max paragraphs, no em dashes, first person plural, direct second person, real specifics over vague categories.
2. Fill the schema for the target collection exactly as `src/content/config.ts` defines it (required fields, the `phase` tag on every article, `category`/`activity`/`sortOrder`/`costSummary` on every guide entry). Set `draft: true`. Never `draft: false`.
3. Save as a new file in the correct `src/content/<collection>/` directory. This is the one place Ed's output lands inside the site source tree, following the practice REVIEW.md already establishes for how pieces get written and reviewed.
4. Cite sources inline or in a Sources section, matching what's on the site's existing pieces.
5. If affiliate links are used (gear guides especially), include the disclosure block, matching the pattern in `src/content/guides/parent-coach-gear.md` and similar existing guide entries.

## S9, step 6: QA (mandatory, before staging, not after)

1. Run REVIEW.md's self-review pass exactly as written: read the piece as a skeptical reader, ask "is this something Jeff would put his name on, send to another parent, and stand behind in five years."
2. Score `qualityGrade`, `originalityGrade`, `voiceGrade` (1-10 each, REVIEW.md's rubric). Anything below 7 on any axis gets rewritten before it's staged, not shipped at a low score and flagged for Jeff to fix — that's Ed's job, not Jeff's.
3. Run the anti-AI writing quick self-check (`About Me/Anti AI Writing.txt`, "Quick self-check before delivering"): banned words, hedging, reframe patterns, triplets, empowerment or summary closes, three same-length sentences in a row, throat-clearing opens, paragraphs over three sentences, any em dash, at least one voice marker present.
4. Set the flags honestly: `flagInappropriateness`, `flagIpRisk`, `flagSensitiveTopic` per REVIEW.md's definitions. `citationCheckPassed` true only if every claim is sourced. `sportLanguageCheckPassed` true only after reading the piece once against `sport-vocab/<sport>.md` with the cheat sheet open. `affiliateDisclosurePresent` true only if links and disclosure both exist.
5. RED WALL / FAMILY FIREWALL check: no player, recruit, or family name, quote, or identifying detail anywhere in the piece. A real family's story gets generalized to a pattern or cut.
6. Set `claudeReviewedAt: <today>`, `status: claude-reviewed`, and a one-line `reviewerNotes` telling Jeff anything he should know before reading (a close call on a flag, a source that was thin, a claim Ed is less than fully confident in).

## S9, step 7: the internal-link plan (part of the same draft, not a separate deliverable)

1. Name 2 to 4 existing pieces the new draft should link to: the relevant `pathways/`, `body/`, `rules/`, `recruiting/`, or `guides/` entry, and, where it fits, a camps-directory or gear-guide page (PCD's two live revenue and product surfaces).
2. Add the links inline in the draft's body, not as an unsolicited "related reading" bullet list unless the piece's existing pattern already uses one.
3. Note in the brief or the draft's `reviewerNotes` whether the new piece is a `/start-here/` or homepage candidate per REVIEW.md's five curation questions, so Jeff doesn't have to re-derive that call cold.

## S9, step 8: hand to Jeff

1. Post one Slack line per `SLACK-STAGING.md`: agent name, one line on what's ready, the link to the draft file (or the brief, if that's as far as the session went). Example: "Ed has a draft ready on [topic]. [path]"
2. Set `needs_you = true` in the run log with the file path and a one-line reason.
3. Ed never sets `status` past `claude-reviewed`. Jeff opens `/admin/editorial`, reads, and either approves (`jeffReviewedAt`, `status: jeff-approved`) or sends it back (`status: needs-revision`, his own `reviewerNotes`). If it comes back `needs-revision`, Ed's next run picks it up, reworks it, and re-runs the full QA pass in step 6 before re-staging.

## S11: the quarterly freshness audit (Class A report, Class B for any rewrite it spawns)

Runs January, April, July, October, day 5, or on manual call.

1. Scan the article base (`src/content/articles/`, `guides/`, `body/`, `pathways/`, `recruiting/`, `adaptive/`) for:
   - `factCheckGoodThrough` dates that have lapsed or lapse within the next quarter.
   - Dated seasonal references that no longer match the current calendar (a "this spring" reference sitting live in October).
   - Rule or equipment claims contradicted by anything the weekly rules watch has logged since the piece published.
   - Dead links: cross-check against `imports/DEAD-LINKS-LOG.md` first, then spot-check a sample of outbound links (governing-body sources, affiliate `/go/` links) on the highest-traffic pieces.
2. Rank refresh candidates by traffic potential and staleness, same framing as the Organic Search Audit's impact-vs-effort table Nora uses. A stale cornerstone piece outranks a stale piece nobody reads.
3. Write the audit to `reports/editorial/freshness-audit-YYYY-QN.md`: what was checked, what's stale, the ranked refresh queue, links to everything cited.
4. For the highest-priority 1 to 3 candidates, draft the actual rewrite following S9 steps 5 through 8 (draft, QA, internal-link check, hand to Jeff). Lower-priority candidates go in the queue as `needs_you` items for a future session, not drafted speculatively.
5. If a candidate is urgent (a safety or rule claim that's actively wrong, not just dated), flag it in the run log's `needs_you_items` with the word "urgent" and don't wait for Jeff's normal Slack-channel pickup rhythm to matter less than it should.

## Every run, no exceptions

- Close through `writeAgentRun()` with the same UUID, status, summary, redacted needs-you items, outputs, and real failure text. Both calls are idempotent. Two failures inside 24 hours pause Ed through CANARY.
- If the run created any file under `src/content/`, note in the summary that it is `draft: true` and unpublished, and that publishing requires Jeff's own `/admin/editorial` review plus the normal deploy block — Ed does not hand over a deploy block, because Ed never gets the content to a publishable state on its own.
- If the run surfaced a rule change, a dead link, or a stale claim that needs Jeff's judgment call rather than a rewrite, name it plainly in `needs_you_items`.

## Idempotency

The seasonal plan and rules watch are safe to re-run: each run reads the live calendar and live governing-body sources, so a second run in the same period either confirms "no change" or catches something the first run missed, never duplicates a finding. Briefs and source packs are freshly written per topic, not appended to a growing file. Drafting is not safe to blindly re-run on the same topic without checking `reports/editorial/briefs/` and `src/content/` first — Ed checks for an existing brief or draft with the same slug before starting a new one, and resumes or revises rather than creating a duplicate file. The freshness audit always reflects the live article base and live link targets, so running it twice in a quarter just produces two near-identical reports, harmless if wasteful.
