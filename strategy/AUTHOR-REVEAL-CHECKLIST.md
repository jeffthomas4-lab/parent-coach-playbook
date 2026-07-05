# Author reveal checklist

Prep only. Nothing here is live. `AUTHOR_REVEALED` in `src/data/site.ts` is still `false` and stays that way until you flip it yourself.

## What already exists in the code

`src/data/site.ts` already has a reveal switch, built for exactly this. Comment on it, verbatim: *"Set AUTHOR_REVEALED = true on the November face-reveal date and every Article / HowTo / About schema starts emitting Person instead of Organization. No other code changes needed."* The `AUTHOR` object is already fully populated: name Jeff Thomas, job title Head Coach Football, works for University of Puget Sound, a one-paragraph description, and a `sameAs` array (currently empty) for external profile links.

So a November reveal date and a single-person identity (you) were already decided by whoever built this. This checklist assumes that decision stands. If it doesn't, the whole plan below changes, see the open question at the end.

## What the switch actually does, and doesn't

Flipping `AUTHOR_REVEALED` to `true` changes exactly two things, both invisible to a reader: the JSON-LD `author` field on every Article/HowTo schema switches from `Organization` to `Person`, and `/about/` starts emitting a `Person` schema block. That's a real SEO move (Google's E-E-A-T signals want a named author with real credentials behind health, safety, and advice content), but it's structured data only. No visitor sees a name change anywhere on the page.

**What the switch does NOT touch, and would need a separate, real content edit:**

- `SITE.byline` (`'the Parent Coach Desk'`) and `EDITORIAL.byline` (same string) are separate constants, hardcoded, used on every article card and feed byline sitewide. These render on the page. The switch doesn't touch them.
- `/about/` currently has a hand-written section titled "Who writes this" that says, verbatim: *"Every piece on the site is written and edited by the Parent Coach Desk. That is the brand. We do not put individual names on bylines... the Desk is two parents who write and edit everything here."* That prose is the opposite of a reveal and would need a full rewrite, not a toggle.
- `index.astro` has a line reading "Written by the {EDITORIAL.byline}" in the homepage hero. Same fix needed there.

**Real fork you need to resolve before writing the new About copy:** the current About page says "two parents." The `AUTHOR` object in the code only has one person populated (you). Either the "two parents" language was always aspirational/protective cover and it's really just you, or there's a second person (co-founder, spouse, colleague) who also needs a bio, a name, and a decision about whether they're revealed too. This isn't something I can resolve for you. Decide it before the new About copy gets written, because the bio below is written single-author and would need a rewrite if it's actually two names.

## The checklist, in order

1. **Decide the fork above.** One author or two. Everything downstream depends on this.
2. **Confirm the November date** is still the target, and pick the exact day (a specific game week, a book launch, an anniversary of the site, whatever anchors it).
3. **Flip `AUTHOR_REVEALED = true`** in `src/data/site.ts` on that date. One line, per the code comment.
4. **Rewrite the "Who writes this" section of `/about/`** (currently lines 46-56 of `src/pages/about.astro`) to name you, using the bio copy below or your own edit of it.
5. **Update `SITE.byline` and `EDITORIAL.byline`** from `'the Parent Coach Desk'` to whatever the post-reveal byline should read (options: your name directly, "Jeff Thomas for Parent Coach Desk," or keep the brand byline on articles and only reveal on `/about/`, your call on how gradual this is).
6. **Update the homepage hero line** in `index.astro` that reads "Written by the {EDITORIAL.byline}."
7. **Populate `AUTHOR.sameAs`** with real, live links (LinkedIn, the UPS athletics staff page, any podcast appearance) so the Person schema has verifiable external proof, not just a bare name. Empty array today.
8. **Decide what happens to the two-parents framing** in any other page that might reference the anonymous-editorial-team angle (check `/disclosure/` and any FAQ-style page for the same language before calling it done).
9. **Have the outreach pitch ready** (see the list below) so the reveal isn't just a quiet code change, it's a moment you can actually get coverage from.
10. **Log the day's actions** to whatever decision journal you keep. This is exactly the kind of significant decision the Field & Forge norm wants logged.

## Bio copy (single-author version, edit if the fork above lands on two people)

**Short (one line, for article bylines or a press pitch subject line):**
Jeff Thomas, head football coach at the University of Puget Sound, writes Parent Coach Desk.

**Medium (for the About page "Who writes this" section, or a podcast guest blurb):**

Every piece on this site is written and edited by Jeff Thomas, head football coach at the University of Puget Sound. Two decades inside the youth-to-college athletics pipeline, most of it on both sides of the fence: the parent in the stands and the coach making the roster decision.

The anonymous byline wasn't a stunt. It was a bet that the advice should stand on its own before it stood on a name. A parent doesn't need to know who wrote "what to say in the first 90 seconds" to use it Saturday afternoon. Now that the site has enough of a track record to make the name useful instead of distracting, it's time to put it on the door.

**Long (for a press pitch or a podcast pre-interview brief):**

Jeff Thomas is the head football coach at the University of Puget Sound, a Division III program in Tacoma, Washington. He served as interim athletic director through January 2025, which means the youth-sports advice on this site isn't just from the sideline, it's informed by the budget meetings, the enrollment math, and the institutional side of athletics most parent-facing writers never see.

He started Parent Coach Desk anonymously, under the byline "the Parent Coach Desk," because the goal was advice that worked on its own merit, not advice that traded on a title. The site now covers more than 700 reads across 26 sports and activities: what to say after a bad game, what to buy and what to skip, the honest math on recruiting odds, and the operational scaffolding of running a season. All of it grounded in what actually happens in a locker room and a car ride home, not what sounds good in a parenting book.

He's also the author of the forthcoming Power Of Series (a 12-book series on leadership, performance, and pressure drawn from coaching) and Chain Reaction (a coaching methodology book covering the Read & React system).

## 15-target outreach list

Real people and outlets, checked against current activity in 2026, not a generic media list. Verify each contact's current byline or host credit yourself before pitching, staff and hosting can change between this session and send day.

**Podcasts (youth sports parenting, currently active in 2026):**

1. Kirsten Jones, host of *Raising Athletes* (mindset coach, former Division I volleyball player). Angle: a D3 head coach who ran an anonymous parenting site, now revealing.
2. Gordon MacLelland, host of the *Parents in Sport Podcast*. Angle: the institutional-athletics-meets-parent-advice crossover.
3. Jeff Francoeur, Britt Lee, and Brad Williams, hosts of *Play Fearless*. Angle: the anonymous-to-named reveal as a story in itself, they lean toward candid, story-driven episodes.
4. Hernan Chousa, host of *The Youth Sports Parenting Tribe*. Angle: a coach's-eye view most guests on that show don't bring.
5. Jonathan Carone, host of *Healthy Sports Parents*. Angle: character-and-development framing lines up with the site's "three things youth sports is for" piece.
6. *Our Kids Play Hockey* podcast. Angle: hockey-specific content on the site (recruiting guide, levels explained, cost breakdown) is a natural guest-episode hook even though you don't coach hockey.

**Writers, researchers, and organizations:**

7. John O'Sullivan, founder of the Changing the Game Project, author of three bestselling youth-sports parenting books. Angle: closest existing figure to what Parent Coach Desk is trying to be, worth a direct outreach even if it's just a mutual-audience introduction rather than a formal pitch.
8. Tom Farrey, executive director of the Aspen Institute's Sports & Society Program and founder of Project Play. Angle: Project Play's 63X30 participation initiative and the site's youth-retention argument ("did they come back next year") are the same underlying thesis, worth a policy-adjacent pitch.
9. John Branch, The New York Times, has written award-recognized youth and high-school sports series ("The Lady Jaguars"). Angle: a sitting D3 head coach and former interim AD publishing under an anonymous byline is a real feature hook, not just a launch announcement.
10. Rob Rossi, Pittsburgh Tribune-Review, recognized for "Brain Waves," a series on concussions and high-school athletes. Angle: the site's concussion and safety content (football-concussion, first-aid-kit guide) if there's a health-and-safety angle worth pitching specifically to him.
11. Missy Isaacson, ESPNw. Angle: girls' and women's youth sports coverage, relevant given the site's ballet, dance, cheer, and girls' lacrosse content.

**Regional press (Tacoma/Seattle, your actual institutional home):**

12. The News Tribune (Tacoma), prep/high-school sports desk. Confirm the current beat reporter via the paper's masthead before pitching, staffing on this desk turns over. Angle: local coach, local story, easiest access point of anyone on this list.
13. The Seattle Times, high school sports section. Same caveat, confirm the current byline first. Angle: regional interest in a D3 coach's side project reaching a national parent audience.

**National parenting outlets:**

14. Fatherly (fatherly.com). Confirm the outlet is still actively staffed before pitching, it changed ownership structure in the past couple years and coverage has been inconsistent since. If active, angle is squarely in their format: dad-perspective, practical, sports-adjacent.
15. Motherly or a comparable national parenting outlet's youth-activities vertical. Identify the current sports/activities editor at whichever outlet you'd rather target, the fit is generic enough that either works, worth confirming which one has an active youth-sports beat right now before choosing.

**Sourcing note:** names and shows in items 1-11 were verified via live web search on 2026-07-05, not pulled from memory. Items 12-15 are outlet-level targets where the specific current byline needs your own confirmation before sending, staffing at regional papers and parenting sites turns over fast enough that I didn't want to hand you a name I couldn't verify was still there.
