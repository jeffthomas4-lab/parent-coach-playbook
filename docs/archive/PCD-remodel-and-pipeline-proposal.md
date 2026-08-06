# Parent Coach Desk — front page, footer, and daily post engine

Prepared 2026-07-22. Two parts. Part 1 is already done (the daily post engine). Part 2 is proposed and waiting on your go before I touch any live site file.

---

## Part 1 — Why the front page went quiet, and what I already changed

### The root cause

Nothing on the front page was broken. The homepage already auto-updates its "Latest / Right off the desk" rail from the newest published articles. The problem was upstream: no new articles were getting published.

Your content crew was set to a weekly rhythm. Ed (the writer) only ran Mondays, and his first run had not even happened yet (it was scheduled for 7/28). Only three drafts were sitting in the pipeline. Penny (the reviewer-publisher) ran on weekdays, but she can only publish what Ed has drafted. Writer runs once a week, drafts thin, nothing new to publish, front page looks frozen. That was the whole story.

The one manual spot on the page is the "Pinned at the Desk" band, which reads from a hardcoded list of three slugs you update by hand when the Friday Letter ships. That is covered in Part 2.

### What I changed (live now)

I extended the existing crew instead of building duplicate agents, which is what you picked. Two scheduled tasks changed:

**Ed (`pcd-editorial-writer`) is now daily at 6:19 AM.** Every morning he drafts exactly one piece and auto-pulls the next item from the queue. The logic: if a date-pegged item in `editorial-queue.md` is due within three days, he writes that. If nothing is due, he pulls the next evergreen topic from `CONTENT_ROADMAP.md`, dates it to publish today, and marks it consumed so it never gets written twice. Mondays he also refills the seasonal and event lanes six to eight weeks deep. He still never publishes. Everything lands as `draft: true`.

**Penny (`pcd-review-publish`) is now daily at 9:08 PM, seven days a week.** She was weekday-only, which left a weekend gap. Same strict logic as before: scores each draft against `VOICE-RUBRIC.md`, publishes up to three that pass, holds future-dated ones as scheduled, sends failures back to revision, routes anything sensitive to you.

So the engine is: Ed writes each morning from the queue, Penny reviews and publishes each night. One piece in, one piece reviewed and shipped, every day. Flo still runs Tuesdays to refresh stale posts.

### On the "three separate tasks" idea

You floated one task to write, one to review, one to post. I kept it to two because Penny already does review and publish as one strict, auditable step, and splitting her would mean rewiring a working publish-and-deploy loop and adding a new in-between state. Reusing her is lower risk and every decision still shows up in Slack for you to audit.

If you do want the third stage as a hard gate (Penny reviews and approves but only a separate poster is allowed to push live), I can split it. The upside is that only one small agent can ever deploy. The downside is another moving part. Say the word and I will build the poster.

### One thing to watch for a week

The seasonal queue items are written to publish two to six weeks ahead on purpose, so Penny will correctly hold those as "scheduled" rather than publish them the day they are drafted. The evergreen lane is what keeps the front page fresh day to day, since those are dated to publish now. If the evergreen backlog in `CONTENT_ROADMAP.md` runs thin, daily freshness slows down. Worth a glance at the Slack summaries this week to confirm Ed is finding enough evergreen topics. If not, I will widen where he pulls from.

---

## Part 2 — Front page and footer remodel (proposed, not yet applied)

You said the footer has too many options and the front page is too much text. Agreed on both. Here is a concrete before-and-after. None of this is live yet.

### Footer: from ~29 links to a tight set plus a legal strip

Right now the footer is four columns and roughly twenty-nine links. The heaviest column has thirteen, and a lot of it is legal and meta that repeats itself: "Privacy and disclosure," "Privacy choices," "Terms," "Accessibility," "Sources," "Corrections," and "Corrections & removal requests" are all competing in the same stack. "Sources" and both "Corrections" links overlap. "Reviews" and "Search" duplicate the top nav.

Proposed structure, three columns and a slim legal line:

**Column 1 — brand.** Logo, tagline, one line of pitch, and a single Friday Letter signup. No change except it becomes the only newsletter ask in the footer.

**Column 2 — Explore (cap at 6).** Start here, By sport, Reads, Camps & leagues, Cost calculator, Season calendar. The rest (Parent-coach, Drills, What to buy, Team parent, Age pathways, Recruiting, Rules, Governing bodies, Adaptive) live in the main nav and inside the sport hubs already, so they do not need a second home in the footer.

**Column 3 — The Desk (cap at 5).** About, Newsletter, Reviews, Search, and the contact email.

**Bottom bar — legal, inline.** One small line: Privacy & disclosure · Privacy choices · Terms · Accessibility · Corrections & removals · RSS. This is where all the compliance links go, as quiet inline text rather than a full column. It sits next to the copyright and affiliate disclosure you already have there.

That drops the footer from a wall of links to about eleven primary links plus a one-line legal strip, and it kills the duplicates. "Sources" folds into the About page, and the two corrections links collapse into one pointing at `/trust/`.

### Front page: fewer sections, less prose, more to click

The homepage is ten stacked sections, and nearly every one follows the same pattern: an italic eyebrow, a big headline, a subhead, and then a supporting paragraph or two before you reach anything clickable. That is the "too much text" feeling. On top of that, three different sections are all doing the same job of surfacing content (the Latest rail, This Season, and Pinned), and there are three separate newsletter asks (hero button, LeadMagnetCTA, and the NewsletterSignup block).

Proposed cuts, in order down the page:

**Hero.** Keep the headline and the two primary buttons (Start here, Browse by sport). Cut the second paragraph. Move the "Get the Friday Letter" button out of the hero, since the newsletter gets its own block lower. Keep the Latest rail on the right. This alone lightens the top of the page a lot.

**Collapse the three content surfaces into two.** Keep the hero Latest rail (auto). Turn "Pinned at the Desk" into a single auto-populated "Fresh this week" band that always shows the newest published pieces (see the auto-surface change below), and keep "This Season" for news. Drop the redundancy so a visitor is not looking at three near-identical card grids.

**Trim the intro paragraphs.** By Sport, Three Drives, and the Tools grid each open with a two or three sentence intro on top of card descriptions that already explain themselves. Cut each intro to a single short line. The cards carry the meaning.

**Move something interactive up.** Interactive beats prose for keeping people on the page. Pull one of your tools higher, the Pendulum "Where is your family right now?" check-in or the Cost calculator, so there is something to do near the top rather than only things to read.

**One newsletter ask, not three.** Keep a single strong newsletter block at the bottom. Remove the hero newsletter button (done above) and consolidate LeadMagnetCTA and NewsletterSignup into one.

That takes the page from ten sections to about six or seven, cuts the repeated content grids, and removes roughly half the body copy without losing any real entry point.

### Homepage auto-surface (small code change)

This is the piece that makes "new post shows up on the front page automatically" true without you editing a slug list.

In `src/pages/index.astro`, the Pinned band reads from a hardcoded array:

```js
const PINNED_SLUGS: string[] = [
  'how-to-evaluate-a-summer-camp',
  'when-your-kid-doesnt-want-to-go-to-camp',
  'three-teams-in-one-summer',
];
const pinnedFinal = pinned.length === 3 ? pinned : all.slice(0, 3);
```

The `all` array is already every live article sorted newest-first, so the newest content is right there. The change is to make the band default to the newest published pieces and treat the manual list as an optional override:

```js
// Optional manual override. Leave empty to auto-surface the newest published pieces.
const PINNED_SLUGS: string[] = [];
const manual = PINNED_SLUGS
  .map(s => all.find(a => a.id === s))
  .filter(Boolean) as typeof all;
// Fall back to the freshest content whenever the override is not a full set of 3.
const pinnedFinal = manual.length === 3 ? manual : all.slice(0, 3);
```

Same idea if we go with a wider "Fresh this week" band: `all.slice(0, 6)`. Either way, once Ed and Penny publish a new piece, it appears on the front page on its own. The Latest rail already behaves this way, so this brings Pinned in line and removes the last manual step.

---

## What I need from you

1. Green light the footer trim as described, or tell me which links you want kept that I moved.
2. Green light the front-page cuts, or tell me which sections are sacred.
3. Decide on the third "poster" agent: leave Penny as review-and-publish, or split out a separate poster gate.

On your go for 1 and 2, I will make the edits to `Footer.astro` and `index.astro`, run the build, and hand you the deploy block. Nothing ships to parentcoachdesk.com until you say so.
