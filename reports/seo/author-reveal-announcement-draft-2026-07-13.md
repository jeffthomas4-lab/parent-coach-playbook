# Author reveal: announcement copy (draft, do not send)

**Drafted by:** Nora, 2026-07-13, first job.
**Status:** Draft only. Nothing here goes out until Jeff decides the fork below and picks the reveal date.
**Source:** `strategy/AUTHOR-REVEAL-CHECKLIST.md`. This file turns that checklist's bio copy into ready-to-use announcement material. It doesn't replace the checklist, it drafts the next step in it (item 9: "have the outreach pitch ready").

---

## Open before anything ships

The checklist names one fork Nora can't close: the About page says "two parents," the code's `AUTHOR` object has one name in it. Everything below is written single-author, matching the code. If it's actually two people, this whole draft needs a rewrite before it goes anywhere. Decide that first.

Second open item: no reveal date is picked yet. "November" is the placeholder. Everything below uses `[REVEAL DATE]` as a stand-in.

---

## Newsletter announcement (Friday Letter, reveal week)

Subject line options:

1. The name behind the Desk
2. Why we've been anonymous, and why that changes
3. Six months in, time to say who wrote this

Body draft:

For six months, every piece on this site ran under one byline: the Parent Coach Desk. No name, no photo, no bio. That was the bet. The advice had to work on its own, before anyone knew who was behind it.

It's Jeff Thomas. Head football coach at the University of Puget Sound. Two decades on both sides of youth sports: the parent in the stands, and the coach who has to make the roster call anyway.

I served as interim athletic director through January 2025, so some of what's on this site comes from budget meetings and enrollment math, not just a sideline. That part doesn't usually make it into parenting advice.

Nothing about the site changes. Same voice, same three-drives framing, same refusal to pretend youth sports is simple. The byline just tells you who's been writing it.

If you want the long version, it's on the About page now.

## Homepage / social short version

Jeff Thomas, head football coach at the University of Puget Sound, writes Parent Coach Desk. Six months anonymous, out loud now.

## /about/ rewrite: "Who writes this" section

Replaces the current section (lines 46-56 of `src/pages/about.astro`, which reads "the Desk is two parents who write and edit everything here." Rewrite only if the fork above lands on single-author):

Every piece on this site is written and edited by Jeff Thomas, head football coach at the University of Puget Sound. Two decades inside the youth-to-college athletics pipeline, most of it on both sides of the fence: the parent in the stands and the coach making the roster decision.

The anonymous byline wasn't a stunt. It was a bet that the advice should stand on its own before it stood on a name. A parent doesn't need to know who wrote "what to say in the first 90 seconds" to use it Saturday afternoon.

The site has enough of a track record now to make the name useful instead of distracting. So it's on the door.

---

## Checklist items this draft does not touch

Flipping `AUTHOR_REVEALED` in `src/data/site.ts`, rewriting `SITE.byline` / `EDITORIAL.byline`, updating the homepage hero line, and populating `AUTHOR.sameAs` are all code and content edits, not draft copy. Those wait for a session where Jeff has picked the date and closed the one-or-two-authors fork. `/disclosure/` and any other page carrying the "anonymous editorial team" framing also need a check before reveal day, per checklist item 8. Not done here.
