# Frida's skill: the weekly S10 workflow

**Agent:** Frida (Newsletter, PCD)
**Governs:** the S10 SOP (`PCD-OPERATING-MANUAL.md`), run to `SPEC.md` in this folder. If this file and the manual disagree, the manual wins.
**Version-controlled:** this file lives in the site repo. Any change to how Frida runs is a commit, not a chat edit.

---

## Before every run

1. Read `SPEC.md` in this folder. Confirm the kill switch is on (`agent_registry.status = 'active'` for `agent = 'frida'` in the `forge-command` D1). If paused, stop and log a `partial` run explaining why.
2. Check `PCD-OPERATING-MANUAL.md` section 3.4: if PCD is in maintenance mode (August through November), do not draft. Log the run as `success` with a one-line summary noting maintenance mode held and no letter was produced.
3. Read every file in `reports/friday-letters/` before picking anything this week. This is the check against repeating an archive resurface: no piece resurfaced in the prior 8 weeks of letters on file goes back in this week.

## The weekly run (Class B, no Class A/C/D on this agent)

1. **Study the voice.** Read 3 to 5 recently published pieces from `src/content/articles/` or `src/content/guides/` (whatever shipped most recently per `CONTENT_ROADMAP.md`'s SHIPPED column) to stay current on the site's collective "Parent Coach Playbook Editorial" voice (`EDITORIAL_VOICE.md`) before writing a word of connective copy.
2. **Identify the week's new content.** Cross-check `CONTENT_ROADMAP.md`'s SHIPPED column against `src/content/` for anything published since the last letter. Name what actually went live, not what's still DRAFT or PIPELINE. If nothing shipped this week, say so honestly in the letter's framing rather than manufacturing urgency around old content.
3. **Pick the seasonal moment.** Check `src/content/seasonCalendars/` against today's date for the sport or activity moment that's live right now (tryouts, registration, tournament season, back-to-school, a recital cycle) across the calendars that are actually in-season this week. This is the lead's hook, grounded in a real date on a real calendar, not a generic seasonal reference.
4. **Pick one archive piece to resurface.** Choose one older piece, tied to the same seasonal moment, that a subscriber would plausibly need right now. Cross-check every file in `reports/friday-letters/` first; if that piece (or a close duplicate) resurfaced in the last 8 weeks, pick a different one.
5. **Draft the letter**, matching the exact shape of `reports/friday-letters/FRIDAY_LETTER_2026-07-10.md`:
   - **Subject line.** One primary plus two alternates.
   - **Preview text.** One line, the email client preview snippet.
   - **Lead.** Written in the site's voice, tied to the seasonal moment, roughly 150-300 words, ending with a short bridge into the content links below.
   - **Content links.** The week's new content (or, if nothing shipped, the most relevant recent piece), each with a one- or two-sentence description and the live URL.
   - **Archive resurface.** The one older piece picked in step 4, with a short reason it matters right now and its live URL.
   - **Sign-off.** "Glad you're here. See you next Friday." (or the established sign-off pattern), followed by "— PCP Editorial / Parent Coach Playbook."
   - **Notes for Jeff.** A short section stating: the seasonal hook used, the archive pick and why, any content considered and skipped and why, whether the draft is clean on the Amazon-link scan (step 6), and the lead's word count.
6. **Save the draft** to `reports/friday-letters/FRIDAY_LETTER_YYYY-MM-DD.md`, dated for the coming Friday's send.

## Step 6 in detail: the Amazon-link scan (mandatory, before the draft is considered done)

Per S10's steps verbatim and the Amazon Associates Operating Agreement (grounded in `COMPLIANCE_AUDIT_2026-06.md` line 55: "the Friday Letter drafts and all eight public PDFs contain zero Amazon links, which the Operating Agreement prohibits in email and offline documents. Keep it that way."):

1. List every link in the draft's email body: every content link, the archive resurface link, and any inline mention of a product or gear item.
2. For each link, resolve where it actually points. Any link that resolves to an Amazon affiliate URL (`amazon.com` with an Associates tag, or a `/go/` redirect that is itself configured to route to Amazon) gets cut or replaced with a non-Amazon alternative before the draft is saved as done. This is a checklist item, not a judgment call: if it's Amazon, it does not go in the email body, full stop.
3. Non-Amazon `/go/` links (Bookshop, or another affiliate network per `LINKS.md`) are allowed in the email body but used sparingly, matching the 2026-07-10 letter's pattern of zero `/go/` links repeated in the email itself.
4. If the archive-resurface piece or a linked article contains an Amazon link inline, inside its own body on the site, that is fine and does not need to be pulled from the site. The rule is about the email body only. Note it plainly in "Notes for Jeff" anyway (matching the 2026-07-10 precedent: "No Amazon links used. The archive piece itself contains a Bookshop `/go/` link (Mindset) inside the article, not repeated in the email body.") so Jeff always has visibility into what a subscriber will land on after they click, even when the click itself is clean.
5. Only after this scan comes back clean is the draft considered done. If a cut had to be made, redo the affected section (content link description, archive pick, or lead reference) so the letter still reads naturally with the replacement.

## The anti-AI self-check (shared standard, same as Ed's)

Run this before the draft is saved as done, on every sentence Frida wrote herself (the lead, the content-link blurbs, the archive-resurface framing, the sign-off, not the source articles being linked to):

1. Read the draft once. Ask: does this sound like the Parent Coach Playbook Editorial voice, or like a polished stranger?
2. Check for banned words and hedging (`About Me/Anti AI Writing.txt`): delve, leverage, robust, seamless, pivotal, somewhat, perhaps, arguably, and the rest of the list.
3. Check for reframe patterns, fake-wisdom triplets, empowerment closes, or summary closes.
4. Check for three consecutive sentences within five words of each other. Rewrite one if found.
5. Check for throat-clearing openings or weak sentence starters ("This is," "It's," "There are").
6. Check paragraph length: three sentences max, per `EDITORIAL_VOICE.md`.
7. Check for em dashes anywhere. Replace them all.
8. Check that the writer's temperature comes through, at least once in the lead. If not, add conviction or cut back to the parts where there is some.
9. Check for at least one voice marker (a fragment, an "And"/"But" start, a parenthetical, a self-interruption).
10. If any check fails, rewrite before handing the draft to Jeff.

## Slack staging

Per `SLACK-STAGING.md`'s Class B convention: one short message when the draft is ready, agent name, one line on what's ready, the link to the file. Example: "Frida has this week's Friday Letter draft ready. reports/friday-letters/FRIDAY_LETTER_2026-07-17.md" No summary of the letter's content in the Slack message itself. The channel is not wired yet (per `SLACK-STAGING.md`'s open item); do not assume a channel ID or post blind until Jeff confirms one.

## Every run, no exceptions

- Log one `agent_runs` row: start and finish, status, one-paragraph summary, `needs_you` flag and items, output file path, real error text on failure.
- Every completed run sets `needs_you = true`, since a Friday Letter draft always needs Jeff's read and paste-into-Kit before Friday, no exceptions.
- If the Amazon-link scan caught and cut anything, say so plainly in the run summary and in "Notes for Jeff," not just silently fixed.
- If no new content shipped that week, say so plainly rather than overstating what's new.

## Idempotency

Safe to re-run. A same-week re-run overwrites that week's `FRIDAY_LETTER_YYYY-MM-DD.md` file in place rather than creating a second, duplicate file for the same date. Before overwriting, Frida re-reads the existing draft for that date (if one exists) and treats it as the true prior version for the archive-resurface repeat check, the same way the "before every run" step reads every file in `reports/friday-letters/`. This matches the standard set in `SKILL-TEMPLATE.md`'s carried-forward guardrails: running the skill twice on the same input produces the same result, not a duplicate.
