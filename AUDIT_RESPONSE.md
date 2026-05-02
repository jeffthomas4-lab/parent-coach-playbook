# Audit response

Sixteen items, triaged. Fixed in code where the answer was clear. Plans below for the ones that need decisions or larger work.

---

## 1. Quick fixes shipped this turn

**About page.** Removed the AI-sounding "How we write" section. Page still has Voice, Sourcing, Funding sections.

**Drills page.** Killed the salesman line. New subhead: *A free library for parent-coaches. Filter by sport, age, or focus. Each entry is short, age-appropriate, and written to be useful at a normal weeknight practice.*

**Drill filter buttons.** Rewrote the inline script to plain JS, wrapped in DOMContentLoaded with `is:inline` directive. The previous version used TypeScript syntax in an inline tag which could fail Astro's hoisting in some edge cases. The new version is defensive: ES5, no types, handles late DOM, and walks up nested click targets (in case Tailwind ever wraps button text).

---

## 2. What to Buy doesn't tell first-time visitors what it is

**Issue.** Landing page assumes you already know it's gear-by-sport-by-age. A new mom hits it cold and bounces.

**Fix to ship.** Rewrite the /what-to-buy hero. Specific copy:

> Eyebrow: For first-time sports parents
> H1: *What to buy* — gear lists by sport and age
> Dek: Cleats, gloves, sticks, sized right. End-of-season sales math. What you can buy used. What you should not. Pick a sport below.

Then a clear two-column grid: sports on the left (alphabetical with photo), arts/activities on the right. Each card shows the sport, the age range covered, and a price floor. *Baseball, ages 5-14, $80 to start.*

Below the grid, a third section: "Already have the cleats?" — see item #14 below for what goes there.

---

## 3. Reads section won't scale to hundreds of posts

**Issue.** Right now /reads renders every article inside its topic block, all on one page. At 200+ posts, that's a 30-second initial paint, no deep filtering, no search, no pagination. By 500 posts, the page is unusable.

**Fix.** Split into a topic landing pattern.

- `/reads` becomes a topic landing page. Nine topics (eight + summer-camps). Each topic is a card with the icon, blurb, post count, and three featured pieces. No firehose feed.
- `/reads/[topic]/` is the topic archive page. Filterable by age, sport, format. Paginated. 24 per page. Search bar.
- `/reads/search/` is a global search across all reads.
- Featured row at the top of `/reads` shows the 6 newest pieces across all topics.

This pattern scales to 1,000+ posts cleanly. We can ship it with the existing tags. The filter UX matches what we built for /coaching-tips.

**Decision needed:** Do you want me to ship this restructure now, or hold until we have ~150 posts? My read: ship now, before we publish another wave. Migration is one engineer-day.

---

## 4. Mom-audience design didn't fully land

**Issue.** Font swap to Mulish, rose accent, pull-quote class, and topic icons shipped. But the overall feel still reads as a man writing for moms.

**Diagnosis.** What's still male-coded:

- The hero typography on most pages is still Fraunces in heavy weight, which reads stern. Mulish in headers would soften it without losing editorial weight.
- Sentence structure across the existing 79 articles is declarative and short. That's the Jeff voice. It also reads more masculine than the audience needs. Not a problem to fix everywhere, but the homepage and Start Here in particular should have a softer, more conversational opening.
- Color use. The rose token is in the system but rarely used. Most pages still lean ink-on-paper with rust accents. Add rose as a section divider color on Reads, Start Here, and the homepage second-fold.
- Imagery. Still zero photographs. SVG icons are in. Until illustrations come back from the prompt sheet, the site looks austere. The illustration package is the biggest single lever.

**Fix to ship.**
- Move display headers on /, /start-here, /reads to a Mulish 700 weight. Keep Fraunces for the article body H1 only.
- Add rose section dividers to / and /start-here.
- Soften the homepage opening lede. Right now it's a hard pitch. Replace with a 2-sentence welcome that names the reader.
- Process the 28 illustration prompts and drop hero images into the homepage and topic landings as soon as they come back.

**Decision needed:** Do you want me to do the Mulish/rose pass now, or hold until illustrations are back? The two together produce a bigger shift than either alone. My read: do the typography pass now, drop illustrations when ready.

---

## 5. Start Here themes need work and bigger type

**Issue.** Current Start Here themes are: night before tryouts, tournament prep, the drive home, what to buy, the team chat. Listed at small body size with no visual weight.

**Diagnosis.** The themes are okay but feel like an editor's choice rather than the reader's actual entry points. The reader doesn't think "I am in the tournament prep phase." She thinks "my kid had a bad game" or "I have to figure out what camp to pick."

**Proposed themes.** Reader-state, not topic.

1. *My kid had a hard day at practice.* → drive-home pieces curated.
2. *Tryouts are this week.* → night-before, evaluation, after-the-cut.
3. *I'm new to this sport.* → what-to-buy, first-week, the-coach intro.
4. *We're picking a summer camp.* → the camp evaluation pieces, vetting for safety.
5. *Travel ball is on the table.* → the recruiter, the cost, the readiness signs.
6. *Game day stuff.* → 30 minutes before, postgame 90 seconds, the cheer rules.

Each theme is a card with bigger type, an icon, and 3-5 curated reads. Card hero size at minimum 24px display. Card body 18px.

**Decision needed:** Do these six themes work? Or do you want different framings?

---

## 6. Make all the templates we promise

**Issue.** Site references "the practice plan template" and "the carpool spreadsheet" and similar. Most are not built yet.

**Inventory of promised templates.**

- The practice plan template (referenced in /resources/practice-plan-template/)
- The carpool spreadsheet
- The season calendar map
- The fair lineup spreadsheet
- The team-parent first email script
- The hard-parent email script
- The end-of-season coach thank-you (tiny, but link it)
- The shot list for picture day
- The snack signup
- The travel packing list

Some exist. Some don't. I will audit, build what's missing, and put a downloadable file behind each promise. Most are PDFs or Google Docs templates we ship as `/resources/[name]/` with a copy-as-link button.

**Decision needed:** Do you want these as Google Docs (so users can copy-and-edit in their own Drive), as PDF downloads, or both? My recommendation: both. PDF for the print-it-out crowd, Doc for the modify-it crowd.

---

## 7. Kit free tier email sequence

**Issue.** We have Kit set up but no email sequence. The playbook PDF should be the lead magnet for the first email.

**Proposed sequence.** Six emails over four weeks. Friendly, not salesy.

- **Day 0** (instant). Welcome + the Drive Home Playbook PDF attached. Plus a one-line note that the next email lands in two days with one specific scenario.
- **Day 2.** "What to say after a bad game" — a curated read from the site, plus one new sentence not on the site.
- **Day 7.** Practice plan template (the promised template from item #6) + a 200-word note on how to use it.
- **Day 14.** "Three things I didn't know in my first season" — story-shaped, not a listicle.
- **Day 21.** Camp-finder check-in. Pre-filtered link to /camps for their state.
- **Day 28.** Invitation to reply. *Tell us what your hardest moment has been. We read every reply.* This is the engagement-builder for retention.

After day 28, the reader joins the regular weekly newsletter cadence.

**Decision needed:** Confirm the sequence and I'll build it in Kit. Each email gets a draft you approve before sending.

---

## 8. Drills fundamentals layer + scaling to 1,000+

**Issue.** Drills are flat. By 1,000 drills, the index is unmanageable. Kid coming up the ladder can't find a sequence.

**Proposed structure.**

Three layers per sport.

- **Foundations.** What every kid playing this sport for the first time needs. Stance. Catch. Throw. Run. 6-10 drills per sport, age-tagged 5-7 mostly.
- **Skills.** The actual sport. Grouped by skill area. Hitting, fielding, throwing, base-running, etc. For baseball, that's roughly 40 drills across the four areas. For lacrosse, similar, etc.
- **Situational and team.** Game-shaped drills. Scrimmages, rotations, set plays, scenarios.

The drills index page surfaces these three layers per sport. The user picks sport first, then layer, then age and focus filters narrow further.

URL structure stays clean:
- `/coaching-tips` — landing
- `/coaching-tips/[sport]` — sport landing with three layers
- `/coaching-tips/[sport]/[layer]` — layer with filters
- `/coaching-tips/[slug]` — individual drill

**Decision needed:** Confirm the three-layer structure. Then I tag the existing 100 drills into the layers and build the new index pages.

---

## 9. Team-parent section: same scaling problem as Reads

**Issue.** Same as #3. Will be unmanageable at 100+ posts.

**Fix.** Mirror the Reads restructure. Topic-based subsections within team-parent. Logistics, communication, money, conflict, picture-day, end-of-season. Each becomes a sub-archive with filters and search.

I'll do this in the same engineering pass as #3.

---

## 10. Editorial standards + controversy audit

**Issue.** No formal editorial standard exists. Articles need a controversy review.

**Editorial standard, draft.** I'll ship this as `/EDITORIAL_STANDARDS.md` in the repo and as `/about/editorial` on the site.

The four rules:

1. **No gendered defaults.** Don't default to "he" for the kid or "she" for the team mom. Mix or use names.
2. **No regional or class assumptions.** Don't assume the reader lives in suburbia, has two cars, or has $400 to spend on cleats. Acknowledge the spread.
3. **No moral verdicts on parenting choices.** Travel vs rec. Public vs private school. Stay-at-home vs working. We describe trade-offs, we don't grade choices.
4. **No identity-based jokes or stereotypes.** Even gentle ones. Includes ethnicity, religion, body type, neurodivergence, family structure.

Plus the existing tone rules: no banned words, no fake-wisdom triplets, no reframe patterns, no em dashes.

**Controversy audit, top 10 to flag.** I haven't read all 100+ existing articles in detail this turn. I'll need a focused subagent pass. Based on title and topic alone, here are the ones that warrant a careful read first:

1. `the-real-job-of-youth-sports.md` — manifesto-style, philosophical claims about what sports is for
2. `coaching-your-own-kid-in-front-of-the-team.md` — gendered default risk, family dynamic
3. `talking-about-the-coach-they-dont-like.md` — risks endorsing parent gossip
4. `the-15-plus-kid-who-is-bored.md` — risks dismissing real disengagement
5. `your-kid-is-being-mean-to-a-teammate.md` — discipline framing, tone-sensitive
6. `talking-to-a-parent-coaching-from-the-stands.md` — confrontation framing
7. `15-plus-walking-away.md` — quitting narrative
8. `on-not-making-varsity.md` — disappointment narrative
9. `when-a-parent-emails-about-playing-time.md` — coach-vs-parent conflict
10. `the-team-mom-you-dont-want-to-be.md` (mine, just shipped) — uses gendered term, archetypes could read as critical of women

**I'll spawn a subagent next turn to read these ten in detail and flag specific lines that violate the editorial standard.**

---

## 11. Camp moderation flow needs a frontend

**Issue.** Right now approving a camp takes multiple terminal commands. It runs through wrangler D1 against a remote database. You want a UI.

**Proposed.** Build `/admin/camps/queue` as a single page, gated by Cloudflare Access (already set up).

What the page does:
- Lists all pending camp submissions with full details rendered.
- One-click approve, reject, or mark verified.
- Inline edit of the camp data before approval.
- Photo upload directly from the page.
- Same UI for review moderation (the camp reviews queue from phase 2).
- Same UI for claim listing requests.

This is roughly two days of engineering work. The data model already exists. We need a clean Astro page that hits the existing admin API endpoints.

**Decision needed:** Confirm and I'll build it. I'll also add the same UI for reviews and claims so all three queues live in one /admin/* page.

---

## 12. Already-have-gear segment

**Issue.** Site is built around new sport parents. Returning sport parents have already bought the cleats. They need different things.

**Diagnosis of what they're in market for.**

- **Recovery and treatment.** Foam rollers, ice packs, kinesio tape, compression socks, ankle braces. Things that come up in middle-school sports as bodies grow.
- **Hydration and fuel.** Reusable bottles, electrolyte mixes, real-food snacks, post-game shake supplies.
- **Spectator gear.** Stadium chairs, sideline blankets, cooler tote, sunscreen kit, bug spray, hand warmers, rain ponchos. (Item #15 directly.)
- **Travel logistics.** Hotel-room kit, packing cubes, portable laundry kit, travel power strip.
- **Replacement consumables.** Socks, athletic tape, mouthguards, batting gloves, grip tape — things that wear out every season.
- **Photography and memory.** Phone tripod, action cam, jersey shadow boxes for the end-of-season.
- **Coach gifts and team gear.** End-of-season coach gift, team mom thank-you ideas.

Build a section called `/what-to-buy/season-essentials/` (or rename if you want) covering these categories. Each is a guide with affiliate links.

**Decision needed:** What's the right URL/label? Options: "Season essentials," "What's in our bag," "The sideline kit," "Beyond the cleats." I lean "Season essentials" or "The sideline kit."

---

## 13. Venue gear (chairs, blankets, fans, coolers)

**Issue.** Real on-the-ground gear we see at every field. No coverage on site.

**Build out.** Specific guide at `/what-to-buy/sideline-kit/` covering:

- Stadium chairs. Three picks: budget, mid, premium.
- Sideline blanket. One pick, with the why.
- Cooler. Two picks: hard for tournaments, soft for single games.
- Battery-powered fan. For hot games. One pick.
- Hand warmers and rain ponchos. The cold-weather kit.
- Sunscreen, bug spray, the kit-bag essentials.
- A folding wagon for hauling everything from the parking lot.

Each item gets an affiliate link via /go/.

I'll write the guide next turn after you confirm item #12's framing.

---

## 14. Affiliate marketing for all visitor product types

**Issue.** Right now /go/ exists with one link. We need a real affiliate strategy.

**Audit of revenue-generating product types our visitors buy:**

1. **Sport-specific gear.** Cleats, gloves, bats, sticks, helmets. Already covered in /what-to-buy/[sport]/. Need affiliate links populated. (The AFFILIATE_FILL spreadsheet exists.)
2. **Sideline and venue gear.** Item #13.
3. **Recovery and body care.** Foam rollers, kinesio tape, etc.
4. **Hydration and nutrition.** Bottles, electrolytes.
5. **Travel logistics.** Coolers, packing cubes, portable laundry.
6. **Books and parenting resources.** Bob Rotella's books on performance psych, the Steve Magness titles, etc.
7. **Memory products.** Shadow boxes, jersey frames, photo books from the season.
8. **Camp and clinic registrations.** Some camp directories have affiliate programs (very small but real).

**Affiliate programs to investigate.**
- Amazon Associates (the default; we have it).
- Dick's Sporting Goods. Direct affiliate.
- BSN Sports. Has affiliate.
- Eastbay (now part of Foot Locker family). Affiliate available.
- Soccer.com, BaseballMonkey, HockeyMonkey, Lacrosse Unlimited. Sport-specific stores with their own affiliate programs.
- ShareASale and Impact for the longer tail (camps, books, niche products).
- Bookshop.org for books, supports independent bookstores, has affiliate.

**Plan.** Set up Amazon Associates as the primary across all categories. Add Dick's, BSN, and the sport-specific ones for higher commissions on big-ticket items. Bookshop.org for any book recommendations. ShareASale for any tail products.

The /go/ infrastructure already does UTM tagging. We just need to add the additional networks' tracking IDs and route by destination.

**Decision needed:** Do you have existing affiliate accounts with any of these? If yes, I'll wire them in. If not, I can set up the application paths. Most take 1-3 weeks to approve.

---

## 15. Wave-writing: status and what to do

**Issue.** I was writing 124 posts and you stopped me to deal with this list.

**Status.** Wave 1 (21 posts) shipped to disk. Mid-wave on the rest. Roughly 80 posts total written so far. ~45 still to write across equipment, rules-of-play, performing-arts, plus the new nutrition/sleep/recovery batch and the field-maintenance batch you just requested.

**Recommendation.** Do not write the remaining ~45 posts until items #3 (Reads scaling), #4 (mom design pass), #10 (editorial standards), and #11 (camp admin UI) are decided and partially shipped. Otherwise we're publishing into a structure we're about to change.

**The exception.** If items #3, #4, #10, #11 are confirmed in this conversation, I can keep writing in the same turn we ship them.

---

## What I need from you

Decisions to unblock the rest:

1. Reads scaling — ship now or hold? (My recommendation: ship now.)
2. Mom design pass — typography now, illustrations later, or wait for both? (My recommendation: typography now.)
3. Start Here themes — confirm the six reader-state themes or send replacements.
4. Templates — Google Docs, PDFs, or both? (My recommendation: both.)
5. Kit email sequence — confirm the six-email plan and I draft email 1 next turn.
6. Drills three-layer structure — confirm.
7. Team-parent restructure — ship in the same pass as Reads? (My recommendation: yes.)
8. Camp admin UI — confirm and I build.
9. Already-have-gear section name — Season essentials, Sideline kit, or other?
10. Existing affiliate accounts — which networks do you already have, if any?
11. Editorial controversy audit — should I spawn a subagent to read the 10 articles in detail?
12. Wave-writing — pause until items above ship, or keep writing in parallel?

Send back yes/no on each (or a counter) and I work the queue.
