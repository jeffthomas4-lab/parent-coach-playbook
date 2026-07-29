# Friday Letter No. 3 — send 2026-07-31

**Status:** DRAFT. Review, edit, paste into Kit. Never sent from here.
**Written:** 2026-07-29 (Wednesday cycle, on schedule). Revises the 2026-07-22 draft of this same issue.
**Why revised:** Three strong, on-topic pieces published to the site on 2026-07-28 (`coach-certifications-you-actually-need`, `your-temper-as-the-parent-coach`, `the-hardest-player-to-coach-is-me`), all `draft: false` and live, after the prior draft of this letter was written. Step 1 of the process is "identify this week's new/updated content" — these are genuinely this week's content, fresher and more specific than the 6/13-reviewed piece the last draft linked, so this pass swaps them in. The seasonal lead and archive pick from the 7/22 draft still hold up against the calendar and are kept.

---

## Subject line

**Primary:** The quiet week has two things on the list

**Alt 1:** One week out: the paperwork and the temper check

**Alt 2:** Before pads go on, two things worth five minutes

---

## Preview text

The certifications that are actually required (fewer than you'd guess), and the reset one coach built so a bad call doesn't become a bad memory for his own kid.

---

## Lead

Right now is the quiet week. Staff meetings start rolling out over the next several days, first practices aren't far behind, and school is two or three weeks out depending on where you live. This is the week to get two boring things handled before the calendar gets loud: the paperwork, and yourself.

The paperwork first. If you're coaching this fall, or handing your kid off to someone who is, five names get thrown around as "certifications": SafeSport, Heads Up Football, USA Baseball, NOCSAE, HECC. Only one of those is actually required by federal law, and it's probably not the one you'd guess.

The other thing worth handling now, while it's quiet, is your own temper. Not your kid's coach's temper. Yours, if you're the one running practice. One coach wrote about the night he yelled at a twelve-year-old umpire with his own son on deck, and the thirty feet he now walks before he says anything to a player after a mistake. Worth five minutes even if you've never lost it on a sideline. Especially if you have.

One read on the certifications, one on the temper, and one from the archive on the week itself.

---

## Content links

**1. The Certifications You Actually Need Before You Coach**
SafeSport is federal law if your league answers to a national governing body. NOCSAE and HECC certify helmets, not people, and almost nobody tells you that part.
https://parentcoachdesk.com/team-parent/coach-certifications-you-actually-need/

**2. The Hardest Player to Coach Is *Me***
One coach's honest account of the night he lost it on a twelve-year-old umpire, and the rule he built afterward so it wouldn't happen again.
https://parentcoachdesk.com/drive-home/the-hardest-player-to-coach-is-me/

---

## Archive resurface

**August First: The Pre-Season Week**
Tryouts and camp are days away for some of you. The week to get the kid right without overdoing any of it: taper, not push.
https://parentcoachdesk.com/drive-there/august-first-the-pre-season-week/

---

## Sign-off

Glad you're here. See you next Friday.

— The Parent Coach Desk

---

## Notes for Jeff

- **Sequencing:** confirmed `FRIDAY_LETTER_2026-07-24.md` (No. 2) is still sitting as DRAFT from last week's overflow run. This run continues to target No. 3 for 7-31 rather than duplicate that work, same call the 7-22 draft made.
- **Seasonal hook, re-verified against your calendar:** "First Staff Meetin[g]" is 8-03, "NWC Football Pre-Season Meeting" is 8-05. Both land the week right after this letter sends, so "quiet week before it gets loud" still holds exactly.
- **Content swap, the actual change this run made:** dropped "Pre-Season Meeting With the New Coach" (last editorially reviewed 6-13) and the heat-protocol news item in favor of two pieces published 7-28: `coach-certifications-you-actually-need` (note, live) and `the-hardest-player-to-coach-is-me` (essay, live, cleared by you on 7-28 per its reviewer notes after a sensitive-topic hold). Both are fresher, both are `draft: false`, and the certifications piece in particular is a better logistics fit for the week two staff meetings land in.
- **Considered and skipped:** `your-temper-as-the-parent-coach` (7-28, live) covers close to the same ground as `the-hardest-player-to-coach-is-me` and reads as the more clinical companion piece rather than a second distinct read; picked the stronger, more specific essay of the two rather than run both. `why-safesport-training-is-non-negotiable` and `laundry-stripping-sports-gear` (both 7-28) are still `draft: true`, not live, not linked.
- **Amazon scan: clean.** Zero Amazon links in the body or in either source article. Both content links and the archive link are parentcoachdesk.com pages.
- **Link verification:** not fetched live (fetch restrictions on this domain from this environment). Verified against the repo instead: `coach-certifications-you-actually-need` has `phase: team-parent`, routed by `src/pages/team-parent/[slug].astro`, which filters on `isLive(data)` (true here since `draft: false`); `the-hardest-player-to-coach-is-me` has `phase: drive-home`, routed by `src/pages/drive-home/[slug].astro` on the same filter; both pass. Neither article has a custom `slug:` in frontmatter, so the filename is the route segment for both. Archive link unchanged from the prior draft and was already verified. Worth a quick click before you send, same caveat as prior issues.
- Lead word count: 219.
