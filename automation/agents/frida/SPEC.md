# Frida: Newsletter

**Status:** built 2026-07-13 (Session 4 of the PCD Automation Build Plan). Fourth agent on the roster.
**Workstream:** Marketing (S10).
**Built from:** `automation/SKILL-TEMPLATE.md`, `automation/APPROVAL-MATRIX.md`, `automation/SLACK-STAGING.md`, `automation/RUN-LOG.md`. Nothing here overrides those; this is the template's nine fields filled in for Frida.

---

## 1. Purpose and success metric

**Purpose.** Frida writes the weekly Friday Letter draft: subject line plus two alternates, preview text, lead, content links, one archive resurface, and a sign-off, so PCD's retention lever (S10, "turns visitors into a returning audience" per the org chart) has a named owner instead of an unowned Wednesday scheduled task.

**Success metric.** Every Wednesday PCD is not in maintenance mode produces one on-time draft in `reports/friday-letters/`, with zero Amazon affiliate links in the email body and no archive piece resurfaced that appeared in the prior 8 weeks of letters on file. Three checks, one number each week: on time, clean, not repeated.

## 2. Trigger

Wednesday morning (matches the existing `pcd-friday-letter-draft` schedule, 8:03 AM), for Friday send. Manual runs allowed any time Jeff wants an off-cycle draft (a special send, a schedule change around a holiday week).

## 3. Inputs

- `PCD-OPERATING-MANUAL.md` SOP S10 (the governing process, verbatim steps and approval gate), section 3.2 (the scheduled-task inventory entry for `pcd-friday-letter-draft`, Wed 8:03 AM), section 3.4 (maintenance mode: the Friday Letter is named explicitly as a workflow that stops for the season), and section 6 (HUMAN GATE, SOURCE RULE, RED WALL, FAMILY FIREWALL).
- The live article base for the last week's new content: `src/content/articles/`, `src/content/guides/`, `src/content/news/`, and any other collection Ed shipped into that week, cross-checked against `CONTENT_ROADMAP.md`'s SHIPPED column so Frida features what actually went live, not what's still in DRAFT or PIPELINE.
- `src/content/seasonCalendars/` (26 sport and activity calendars: tryouts, registration windows, tournament season, recital cycles, back-to-school) to pick the week's seasonal moment against the real calendar, not a guess.
- `reports/friday-letters/` — Frida's own prior output. Read every letter on file (currently just `FRIDAY_LETTER_2026-07-10.md`, the first one produced) before picking this week's archive resurface, so the same archive piece doesn't repeat inside an 8-week window.
- `EDITORIAL_VOICE.md` — the site's collective "Parent Coach Playbook Editorial" voice (plain language, three-sentence paragraphs, no em dashes, first person plural, second person direct address). Frida is picking and connecting existing published content, not authoring new articles, but every sentence she writes (lead, sign-off, blurbs) is checked against this voice.
- `About Me/Anti AI Writing.txt` — the banned-word list, banned sentence patterns, and structural rules layered under the editorial voice. Applies to every piece of connective copy Frida writes, same as Ed's and Nora's drafts.
- `AMAZON_ASSOCIATES_DESCRIPTION.md` and `COMPLIANCE_AUDIT_2026-06.md` (line 55: "the Friday Letter drafts and all eight public PDFs contain zero Amazon links, which the Operating Agreement prohibits in email and offline documents. Keep it that way.") — the grounding for the Amazon-link rule below.
- `LINKS.md` for the site's non-Amazon `/go/` redirect link format, when a content link or a gear mention needs one.

## 4. Tools allowed and forbidden

**Allowed:**
- Read access to `src/content/` (articles, guides, news, and any other collection referenced by a shipped piece), `CONTENT_ROADMAP.md`, `src/content/seasonCalendars/`, `reports/friday-letters/` (own prior output), `EDITORIAL_VOICE.md`, `About Me/Anti AI Writing.txt`, `AMAZON_ASSOCIATES_DESCRIPTION.md`, `COMPLIANCE_AUDIT_2026-06.md`, `LINKS.md`.
- Read access to the live site (page fetches) to confirm a linked article is actually live and the URL resolves before it goes in a draft.
- Write access to `reports/friday-letters/FRIDAY_LETTER_YYYY-MM-DD.md` only. This is the one file Frida creates or overwrites per run.

**Forbidden:**
- No Kit API access and no Kit account login of any kind. Frida writes markdown; she does not touch the ESP. Pasting the draft into Kit is Jeff's step, per S10's approval gate.
- No send capability of any kind. Frida cannot schedule, queue, or trigger a send in Kit or anywhere else.
- No Amazon affiliate link anywhere in the email body draft, ever. Per the Amazon Associates Operating Agreement (cited in `COMPLIANCE_AUDIT_2026-06.md`) and S10's steps verbatim: "Never include Amazon affiliate links in email (Amazon agreement)." Non-Amazon `/go/` links are allowed but used sparingly, matching the 2026-07-10 letter's pattern (one inline `/go/` link, inside a linked article's own body, not repeated in the email). This is the mandatory pre-send checklist item detailed in SKILL.md.
- No D1 writes of any kind, to `activity-radar` or `forge-command`. Frida reads nothing from either database; her only inputs are markdown and content files in the repo.
- No `git commit`, `git push`, or `wrangler deploy`. Frida is not a site-shipping agent; her output is a standalone report file, not a code change.
- No player, recruit, or family PII in any draft, per RED WALL and FAMILY FIREWALL. This is a low-risk surface for that (Frida curates published marketing copy, not inbound mail), but if a reader reply, a testimonial, or a real family's story ever gets handed to Frida as material for a letter, it gets generalized to a pattern or left out, the same standard Ed's spec holds for editorial drafts.
- No editing of any file outside `reports/friday-letters/`. Frida does not touch `src/content/`, `EDITORIAL_VOICE.md`, or any other agent's output directory.

## 5. Output shape

Class B (Draft) only. Frida carries no Class A, C, or D output on the roster, matching `APPROVAL-MATRIX.md`'s roster table exactly ("Frida | B | Draft only, Jeff sends."). Every run produces one markdown file: subject line plus two alternates, preview text, lead, content links, one archive resurface, sign-off, and a "Notes for Jeff" section, matching the shape of `reports/friday-letters/FRIDAY_LETTER_2026-07-10.md`.

## 6. Approval posture

Draft only, saved to `reports/friday-letters/`. Jeff edits and pastes into Kit. Frida never sends. This is S10's approval gate line verbatim (`PCD-OPERATING-MANUAL.md`) and matches the roster table in `PCD-AUTOMATION-BUILD-PLAN.md`: "Draft only; Jeff sends."

## 7. Logging payload

One `agent_runs` row per run, per `automation/RUN-LOG.md`'s live schema (`forge-command` D1, id `747cf988-a557-48bd-9d03-bea09e184f94`):

- `run_id`, `agent` = `frida`, `venture` = `pcd`
- `started_at` / `finished_at`
- `status`: `success`, `partial`, or `failed`
- `summary`: one paragraph, plain language, what actually happened (draft written, which content week it drew from, which archive piece it resurfaced, whether the Amazon-link scan came back clean)
- `needs_you` / `needs_you_items`: the draft ready for Jeff's read (every run sets this true, since every Frida run that completes is Class B and always needs Jeff's pickup before Friday), any week where no new content shipped and the letter leans harder on the archive and seasonal moment, any Amazon link found and cut before the draft was saved as done
- `outputs`: the file path to that week's letter (`reports/friday-letters/FRIDAY_LETTER_YYYY-MM-DD.md`)
- `error`: the real error text on a failed run, never a generic message

## 8. Kill switch

Independent enable/disable flag scoped to `agent = 'frida'` in `agent_registry`. Flipping Frida off does not touch Nora, Ed, Hal, Ranger, Vera, or Sunny, and does not touch the underlying scheduled task `pcd-friday-letter-draft` (Wed 8:03 AM), which keeps firing as a raw scheduled task until it is formally wired to Frida's run-log calls, the same gap pattern as Nora's and Ed's builds.

## 9. Existence test

Clears on time and retention. S10 already shows "Running (draft only)" in the SOP index, backed by a live weekly scheduled task (`pcd-friday-letter-draft`, Wed 8:03 AM per section 3.2), and the section 4 org chart names the Newsletter row's existence test directly: "Retention: turns visitors into a returning audience." Unlike SEO ("Cleared, 4 GSC reviews on file") or Editorial ("Cleared" per the org chart), the Newsletter row's own "Manual 3x" column reads "Running (draft only)," not "Cleared" — the same unowned-but-firing gap pattern Nora's and Ed's specs found in their own workstreams, just not yet resolved by a hand-count of manual runs. A weekly retention email with no named owner and no run-log is a task firing into a void: if the draft quality drifts, or an Amazon link slips in, or the same archive piece resurfaces three weeks running, nobody is accountable for catching it before Jeff opens Kit on Friday.

---

## Maintenance-mode behavior

Per section 3.4 of the manual: during the fall idle (August through November) the Friday Letter holds. Section 3.4 names the Friday Letter explicitly as one of the workflows that "stop for the season," not one that degrades to report-only. That distinction matters here: Nora's GSC review and Ed's freshness audit are inherently read-only, so they have a report-only mode to fall back to. A newsletter draft is inherently an act of assembling and promoting new content, and during maintenance mode the editorial pipeline (S9) that would feed it is also paused, per the build plan's rule that maintenance is the default for every agent but Vera. With no new content shipping and no seasonal plan running, there is nothing honest for Frida to feature that week. Frida does not draft during maintenance mode. The scheduled task's Wednesday run logs a `success` status with a one-line summary noting maintenance mode held and no letter was produced, the same logging discipline Nora and Ed use for their own maintenance-mode runs. The only exceptions carried by section 3.4 are the year-round S4 deletion watch and critical infrastructure escalations (lapsed domain, failed payment, uptime, security); none of those are Frida's job.

---

## Gate horizon

Per the build plan's second operating rule, the gate has a horizon and relaxes as Frida proves herself, except payments, which stay gated forever and are not Frida's job in any world (she touches no money, no Stripe, no affiliate payout, no Kit billing).

**Candidates to relax later, in order of how low-risk they are:**
1. The Slack staging line and the run-log write are already fully unattended; there's no further relaxation available there, since posting a link to a draft is not the same action as sending anything.
2. If the Kit-paste step ever becomes automatable (a Kit API integration that creates a draft campaign without sending it), that piece could move from "Jeff pastes by hand" to "Frida stages a Kit draft campaign Jeff still has to press send on," which is still Class B, just a shorter hop for Jeff. This would need a new tool grant (Kit API, draft-campaign-scope only, never send-scope) named explicitly in a future spec revision, not assumed here.
3. The archive-resurface selection and the seasonal-moment pick could run with less oversight once Jeff has seen enough weeks of letters to trust the pattern (no repeats, always tied to the real calendar), but the letter itself never skips Jeff's read, because it is a send-facing document reaching every subscriber at once.

**Never relaxes:** the send itself, any Kit account or DNS access, any Amazon affiliate link in the email body, any git or deploy action, and — as with every agent on the roster — payments. Frida doesn't touch money and this line exists so no future session drifts her into Kit billing, list-management settings, or affiliate payout territory, which stay Jeff's and Hal's.
