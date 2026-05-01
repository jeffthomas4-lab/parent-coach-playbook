# Restructure plan

A single doc covering the 31-item rework. Sequenced into waves so we ship value fast and don't break the live site mid-flight. Decisions are proposed, not finalized: object to anything below and I'll adjust before touching code.

---

## The big calls (proposed)

These are the architecture-level decisions that, once made, cascade across many files. Object to any of them.

1. **Wordmark.** `Parent Coach Playbook` — three words, no hyphen, no "The." Used as the site title in `<head>`, in the nav logo, and as a small visible header strip on every page (currently it's only in the nav).
2. **Byline.** Every article and resource gets `Parent Coach Playbook Editorial` as the byline. No individual names anywhere on the public site. Avatar circles removed from cards (they're a personality signal we no longer want). The brand is the voice.
3. **Three drives.** Removed as a navigational pillar and as a homepage section. The conceptual framing (a season has conversations before, during, after) survives only inside articles where it earns its place. Existing URLs (`/drive-there/`, `/game/`, `/drive-home/`) stay live so we don't break inbound links and search rankings, but no nav points to them and no homepage block features them. The Drive Home Playbook PDF stays as a lead magnet because it's already named.
4. **About / Contributors.** `/contributors/` deleted. About rewritten to lead with editorial standards (how we research, how we cite, how we write) instead of who. Trust shifts from individual founders to editorial process.
5. **AI residue scrub.** Full pass against the banned words and patterns in `ABOUT ME/Anti AI Writing.txt` plus a sweep for "not this, but this" structures, fake-wisdom triplets, and empowerment closes. Every article, resource, guide, page.
6. **Voice doc.** `VOICES.md` retired. Replaced by `EDITORIAL_VOICE.md` — single voice, the rules from the anti-AI guide, the cadence and structure rules. `AI_WORKFLOW.md` updated to reference one voice.
7. **What to Buy expansion.** Add 12 new categories: flag football (split from tackle), martial arts, gymnastics, cheerleading, stunt and tumbling, swimming, cross country, golf, tennis, crew, ballet, track and field (with sub-pages for sprints, distance, hurdles, jumps, and throws/javelin).
8. **Coaching tips section.** New top-level area at `/coaching-tips/` with a drill library. Filterable by sport, age band, and focus (warm-up, fundamentals, situational, scrimmage). Replaces the current "coaching tips" subsection inside Team Parent.
9. **Newsletter page.** Rebuilt from plain text to a real archive layout: most recent issue at top, scannable list of past issues below, subscribe form on the right rail.

If you object to any of those nine, say which and I'll adjust before Wave 1 ships.

---

## Waves

### Wave 1 — Voice and identity (smallest engineering, biggest brand effect)

- Update the wordmark to `Parent Coach Playbook` everywhere (nav, footer, OG title, manifest, sitemap, package.json description)
- Add a small visible wordmark header strip above the nav on every page (or confirm the existing nav logo qualifies)
- Replace all bylines on articles with `Parent Coach Playbook Editorial`
- Strip Maren, Dan, Jeff names from: every article frontmatter, About, Contributors page (delete), homepage hero footnote, ArticleCard component, NewsletterSignup blurb, footer, AI workflow doc
- Remove avatar circles from `ArticleCard.astro` and the homepage Latest Reads list
- Replace the homepage "Pick a situation" eyebrow. Candidates: `What's happening this week`, `Pick what fits today`, `Where this lands for you`, `For the Saturday you're having`. I'll go with `Where you are right now` unless you pick a different one.
- Search-and-replace `manifesto` → `the long read` (or `the cornerstone`) throughout
- Full AI-residue scrub against `ABOUT ME/Anti AI Writing.txt`
- Retire `VOICES.md`, write `EDITORIAL_VOICE.md`, update `AI_WORKFLOW.md`
- Delete the `/contributors/` page and its sitemap entry
- Rewrite `/about/` with the editorial-standards framing

**Effort.** 4-6 hours. Touches almost everything but mechanically. Worth doing in a single push so the brand voice is consistent the moment we ship.

### Wave 2 — Structure changes

- Remove the three-drives homepage section
- Remove the three-drives nav dropdown
- Decide what fills the homepage slot the three-drives section vacates (proposal: a `Browse by topic` grid: communication, equipment, tryouts, game day, drive home, season management, the hard moments)
- Add `/coaching-tips/` as a new top-level section with index page and tag-based filtering
- Refactor `/team-parent/[category]/` to show multiple posts per category instead of one
- Update the primary `NAV` array in `src/data/site.ts` accordingly
- Update sitemap and footer

**Effort.** 6-8 hours.

### Wave 3 — New writing

Two new posts you flagged, plus the catch-up on category density.

- **`/the-real-job-of-youth-sports/`** — Youth sports isn't college prep. It's three things: have fun, learn the rules and the sport, and want to come back next year. T-ball doesn't have strikeouts for a reason.
- **`/the-missing-rec-layer/`** — America has good youth rec, then early specialization and travel ball pull the middle out, and there's no robust just-for-fun high school rec layer. It comes back in college intramurals and adult leagues. Why this gap exists, what families lose, what to look for if your kid is the just-for-fun type at 14.
- Two more posts per Team Parent category, each dated across the spectrum so the section feels alive
- Two more posts each in `/drive-there/` and `/game/` so the three sections balance Drive Home's five
- The "your kid is the best on the team" and "your kid is the worst on the team" cornerstones (long queued)

**Effort.** Open-ended. Two new posts I can draft this week. The category fill is a 90-day push.

### Wave 4 — What to Buy expansion

Add the 12 sport categories listed above. Each new guide gets:

- The sizing cross-link to a `/what-to-buy/[sport]/sizing/` short page (gloves, shoes, helmets, etc., the actual fit tests)
- Practical, specific advice ("if they're under 10, avoid white pants, you'll regret it")
- A used-gear note with three sources: Play It Again Sports, Facebook Marketplace, OfferUp, plus the insole rule for used cleats
- Best-practice rule citations linked to the National Organizations directory (drop weight for Little League, USABat for travel, NOCSAE for catcher's gear, etc.)
- Coach pitch starts at age 6 with explicit overlap-with-tee-ball language and a paragraph on age/talent/experience being mixed at this level being the point, not a problem

For Track and Field specifically: top-level page links to event-specific sub-pages (sprints, distance, hurdles, jumps, throws/javelin). Each sub-page is short and specific.

**Effort.** 8-12 hours for all 12 guides at the level of the existing baseball/soccer guides. Or 4-6 hours if we ship them as MVP guides (sizing, three top picks, citations) and expand over time.

### Wave 5 — Coaching tips and the cones diagram

- Build the `/coaching-tips/` library with the existing five entries migrated in
- Add filtering by sport, age band, focus
- Redo the cones diagram: show defensive positions (second baseman to the right of second base where they actually line up, shortstop in the slot, etc.), show 4-5 outfielders not 3 so every kid is on the field, two cone bins (infield and outfield) so you can rotate without micromanaging positions
- Cones diagram lives in `/coaching-tips/t-ball-cones/` (or whatever sport-agnostic name fits)

**Effort.** 4-6 hours.

### Wave 6 — Team Parent buildout and tech setup

- Add MaxPreps to the tech setup category (separate post, with the caveat that you're sending parents to MaxPreps' own docs)
- Replace the GameChanger walkthrough with a one-pager: "GameChanger is the standard. Their setup is good. Use it. Here's why parents like it." Link to gc.com/help.
- Add fundraising as a Team Parent category with three starter posts: the team-pizza-night model, the Snap Raise / GoFundMe reality, and the local-sponsor email script
- Each Team Parent category gets a real index that lists multiple posts dated across the year

**Effort.** 6-10 hours.

### Wave 7 — Polish

- Rebuild the newsletter page (real archive, not plain text)
- Update the National Organizations directory with the 12 new sports' governing bodies
- Remove the "Edited by Jeff Thomas" line. Amazon Associates does not require a real name on the site. The associate ID is what matters; the public-facing site can use the brand name.
- Add a Privacy and Disclosure page (legally needed for affiliate + email collection, separate from anti-AI)
- Add an internal "see also" block to every article (the easiest SEO lift you can make)

**Effort.** 4-6 hours.

---

## Your strategy questions, answered

### How does search work? Where do popular search terms come from?

The site's search is currently a placeholder unless we wired up Pagefind in an earlier session (let me confirm in code before I commit). Pagefind builds a static index at build time of every page's text and is the right tool for an Astro site at this size. It runs entirely in the browser, no backend.

Popular search terms aren't anywhere yet. To get them you need to instrument the search box to fire an event when a query is submitted. Three good options:

1. **Cloudflare Web Analytics with custom events.** Free, privacy-light, integrates cleanly. The analytics dashboard shows the top events. ~30 min to wire up.
2. **Plausible or Fathom.** $9-14/month, also privacy-light, friendlier UI for site search reports. Good if you already use it.
3. **Just read the URL.** If we make search use a `?q=` query param (which it should), Cloudflare logs every URL hit. Filter for `/search?q=` and you have the raw list.

Option 3 is free and works today. I'd ship that pattern and add option 1 in a few weeks if you want a dashboard.

### How else can you monetize the site?

Five plausible levers, ordered by what fits the brand without compromising trust.

1. **Digital products.** Highest-margin, no conflict-of-interest. The pre-game pocket card laminated. The season-planning spreadsheet. The parent-meeting agenda PDF as a paid premium with the email scripts included. $5-19 each. Bundle for $39. Once you have 5-10 products you have a real revenue line independent of Amazon.
2. **Amazon Associates affiliate.** Live. Compounds slowly with traffic. Don't change anything; let it grow.
3. **Sponsored newsletter slots.** Wait until the list is 1,000+ subscribers. Then a single sponsor per issue, full disclosure, no editorial control, $200-500/issue. The right sponsors are sports apparel, mouthguards, kids' nutrition, equipment.
4. **Paid camp listings.** Once the camps repo is alive and has traffic, camps pay $25-50 to be featured at the top of relevant searches. Honest disclosure ("featured" tag). Doesn't break the directory.
5. **A small membership** ($4-8/month). Premium PDFs, an audio version of the cornerstones, a private comments section, advance access to lead magnets. Don't do this until the email list is 5,000+ and you have monthly content rhythm.

Don't do: display ads (kills editorial feel), banner sponsorships from local sports orgs (conflict-of-interest with camps directory), affiliate marketing for anything you wouldn't recommend to a friend.

### What holes exist in the blog content right now?

Real audit needs me to inventory every published piece against a topic-by-age-band matrix. I'll produce that as `CONTENT_HOLES.md` in Wave 3 prep. Quick gut read of what's missing:

- Almost nothing for ages 5-7 specifically
- Nothing on travel ball politics from the inside
- Nothing on what to do when your kid quits mid-season
- Nothing on the parent-coach getting fired or asked not to coach again
- Nothing on the family-vs-team-time tradeoff (the season eating Saturdays for three months)
- Nothing on multi-sport siblings (the 6-year-old at the 13-year-old's tournament)
- Light coverage on injuries beyond concussion: how to handle a kid coming back from a sprain, when to push, when to wait

The roadmap I wrote in `CONTENT_ROADMAP.md` covers some of these but not all. I'll reconcile the two docs in Wave 3.

### Most efficient way to fill the Amazon picks?

Three-step pattern that's worked for similar sites:

1. **You bulk-collect URLs.** Open Amazon. For each guide, find 5-10 products you'd actually recommend. Copy each product's "Get Link" → Text from Amazon Associates SiteStripe. Paste them into a spreadsheet with columns: guide slug, position (1-5), product name, amzn.to link, your one-sentence note, age range. 30-45 minutes per guide if you're focused.
2. **I parse the spreadsheet.** Send it over and I'll generate the markdown for every gear-pick card across every guide in one pass. We push them all live together.
3. **Or: voice-to-product.** Walk Amazon and dictate notes. Send me a list of "guide name + product name + your one-line take." I do the link lookup, the markdown, the cross-linking. Slower for me, faster for you.

Option 1 is the one I'd recommend. The spreadsheet is reusable and you can update it without touching code.

### What are you missing?

A list, ordered by how much it matters.

- **A privacy and disclosure page.** Legally required for affiliate + email collection. We don't have one. This is the only item on this list that's actually risky.
- **A consistent FAQ.** "How is this site funded? Who writes it? How do I submit a camp? How do I unsubscribe? How do I correct a fact?" Trust signals.
- **An image strategy.** The site is almost entirely text. Photos lift dwell time and engagement. Three options: stock photography (Unsplash with good curation), commissioned illustration (a single illustrator across the brand for ~$500-1500 of starter art), or hand-drawn diagrams that match the editorial feel. I lean diagrams plus 5-10 commissioned illustrations.
- **Internal linking.** Every article should end with a "see also" block of 3 related pieces. Easiest SEO lift available.
- **A consistent submission/correction policy.** Once you take submissions (camps, soon) you need a published policy.
- **An editorial standards page.** This is the trust signal that replaces founder bylines. "How we research. How we cite. What we won't link to. How we handle corrections." Two screens of copy. Lives at `/about/editorial-standards/`.
- **A real about page rewrite.** With names off, the about page is currently dishonest. Wave 1 fixes this.
- **An RSS feed your readers can actually subscribe to.** I think we have one but should verify the format and link it from the footer.
- **Email cadence discipline.** You have a Kit account and a list. Are you actually sending? If not, the list is a sunk cost. A monthly "five things parents asked us this month" letter is the minimum.

---

## Recommended order

If I'm in your seat, here's how I'd sequence it.

**Tomorrow:** Wave 1. The voice and byline cleanup. Six hours, biggest brand effect. Site reads consistent the moment it ships.

**This weekend:** Wave 2. Structure. Three drives go, coaching tips arrives, homepage gets the new "browse by topic" or "what's happening" grid.

**Next week:** Wave 3 starts. The two new posts you flagged go up first. Then the per-category fill begins at two posts per week.

**The next two weeks:** Wave 4 (What to Buy expansion) and Wave 5 (coaching tips). Either I batch-write all 12 new buy guides at MVP depth, or you bulk-collect the Amazon URLs and we ship them deep.

**Ongoing:** Wave 6 (team parent buildout) and Wave 7 (polish) drip in as content allows.

---

## What I need from you to start

One yes/no on each:

- Wordmark is `Parent Coach Playbook` (no "The," no hyphen)?
- Byline is `Parent Coach Playbook Editorial` (or do you want shorter: `PCP Editorial`)?
- Avatars come off cards entirely? (Alternative: a single tiny PCP mark on every card.)
- Three-drives URLs preserved but unbranded (no nav, no homepage section, articles still live there)?
- Homepage "Pick a situation" → `Where you are right now`?
- Start with Wave 1 tomorrow, full push, all in one commit?

Reply with the answers and I start Wave 1.
