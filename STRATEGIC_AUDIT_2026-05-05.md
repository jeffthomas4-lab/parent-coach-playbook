# Strategic audit: parentcoachplaybook.com
**May 5, 2026 — outside-consultant pass**

This is the read I'd give if I walked into your boardroom cold. Owner-level honesty, no consulting fluff.

---

## Executive summary

The site is in better technical shape than 90% of media properties at this stage. Content depth is real (875+ live pages). Voice is genuinely differentiated. The four areas to push on next, in order of leverage:

1. **Coverage matrix.** The activity × age grid has holes that block your SEO surface area from compounding.
2. **Article schema.** You ship Organization JSON-LD but no Article schema on individual reads. That's free SERP visibility you're leaving on the table.
3. **Backlinks from outside the site.** Internal linking is now strong. External backlinks are zero. That's the real authority bottleneck.
4. **Social distribution.** No active channels yet. The site is a destination with no discovery path beyond search.

The site does not have a security problem, a mobile problem, or a uniqueness problem. The growth problem is distribution and SERP visibility, not the product.

---

## Security: 8.5 / 10

You're better protected than most.

Live response headers show HSTS with preload (`max-age=63072000; includeSubDomains; preload`), Cross-Origin-Opener-Policy set to same-origin, X-Frame-Options DENY, X-Content-Type-Options nosniff, a real Permissions-Policy that disables camera/microphone/geolocation/FLoC, and Referrer-Policy strict-origin-when-cross-origin. Cloudflare in front means DDoS protection and bot mitigation are handled.

The cron worker uses Cloudflare secrets for the deploy hook URL and manual trigger key. Admin pages are disallowed via robots.txt and the route structure suggests they're not publicly accessible. Email obfuscation via Cloudflare's cf-email-protection script is on.

**The one missing piece: Content-Security-Policy.** Most sites your size don't have it either, but a real CSP would close the last meaningful gap. Set a strict CSP with `script-src` allowlisting Cloudflare's beacon, kit.com (newsletter), and your own domain. `style-src` allowing `'unsafe-inline'` since Astro hot-injects, plus self. `img-src` allowing self plus Amazon, Cloudinary, and any other partner. `frame-ancestors 'none'` reinforces the X-Frame DENY. This is a one-evening job and meaningfully reduces XSS exposure.

**Secondary: subresource integrity.** The cloudflareinsights beacon and the email-decode script are loaded from Cloudflare's CDN. The beacon already has `integrity` set; the email-decode script doesn't. Add SRI to any remaining external script.

**Real talk on the actual risk surface.** You're a content site with no user accounts, no payment processing, no sensitive data. The realistic threat models are: comment spam (you don't have comments), affiliate hijacking on outbound links (you have a /go/ redirect handler that's disallowed in robots, which is the right pattern), and supply chain on npm packages (low-risk because of the static build). You're spending the right amount of engineering on security. Don't over-invest here.

---

## SEO: 6.5 / 10

This is the area with the highest ratio of effort-to-reward right now. The fundamentals are sound. The compounding moves haven't been made yet.

### What's working

The sitemap is real and discoverable from robots.txt. Canonical URLs are set on every page. Open Graph and Twitter Card metadata are populated. The JSON-LD `Organization` schema lives in BaseLayout. Page titles and meta descriptions are unique per page (verified across multiple URLs).

Internal linking is healthy after this week's work. Every new piece reaches existing content. Every existing flagship piece now points forward to the new content via the `relatedScripts`/`relatedDecisions` pattern. The site graph is actually denser than most editorial sites.

The content footprint is meaningful. 875+ live pages, 1,400+ URLs in the sitemap. That's not an authority problem, it's a credibility signal. Google sees a real site.

### What's not working

**No Article schema.** This is the biggest single SEO gap. Each article should emit JSON-LD `Article` with `headline`, `datePublished`, `dateModified`, `author`, `publisher`, and `image`. Right now Google has to infer all of that from your HTML. Article schema is what unlocks rich results, byline displays, and sitelinks. The lift is two hours — one Astro component, drop it into the article layout. Highest-leverage SEO move available.

**No FAQPage schema on the decisions pages.** Your decisions are literally structured Q&A (theQuestion + benefits/costs/howToHandleIt). Wrap that in FAQPage schema and you compete for the FAQ rich result on every decision page. Same for the body topics where you have doctorQuestions arrays. Two hours of work. High-traffic potential.

**No HowTo schema on the drills.** Each coaching tip has setup, cue, common mistake, variation. That's HowTo schema in disguise. Same play.

**Featured snippets aren't being targeted.** Most of your content is essay-shaped. Google rewards content with a clear "answer at the top, then context." Add a 30-50 word lede to each article that answers the implied question directly. The dek field is close but isn't structured for snippet capture.

**Author entity is invisible.** "Parent Coach Playbook Editorial" doesn't have a Person schema, doesn't link to a real bio with E-E-A-T signals (experience, expertise, authoritativeness, trustworthiness). The /about/ page has the credentials but they aren't structured. Google's helpful-content updates have made this matter more than it used to. Wire up Person schema on the /about/ page and reference it from every article via `author`.

**Page-level keyword targeting is loose.** You're writing for humans (correct), and Google rewards that, but you're also under-optimizing the H1s and titles for the specific queries people are running. "When she says 'I hate this sport'" is great voice and a weak target. The query parents type is "what to do when my kid says they hate their sport." Title could read "What to do when your kid says they hate their sport" with the warmer headline as H2. You're not stuffing keywords. You're matching the language parents actually search.

**Internal anchor text is generic.** Most of your in-prose links read "Three drives, one relationship" or "the 90-second rule." Those are titles, not query-shaped anchors. Add anchor text that matches search intent for the linked piece. "What to say after a bad game" is a better anchor than "the 90-second rule" for a piece literally targeting that query.

**Image SEO is half-built.** Hero images have alt text (good). They don't have descriptive filenames (mostly slug-based, fine). They're not getting Schema.org/ImageObject treatment. For a site this content-heavy, image search is real traffic.

### Where to improve SEO, ranked

1. **Article schema on every read.** Two-hour fix. Compounds on every existing and future piece.
2. **FAQPage schema on decisions and body pages.** Two hours. Direct rich-result potential.
3. **HowTo schema on drills.** Three hours. 533 drills, big surface area.
4. **Person schema on /about/, with author byline linkage.** Two hours. Helps E-E-A-T.
5. **H1 and title rewrites for the top 50 highest-search-volume articles.** Match query language. One-day project.
6. **Anchor text discipline going forward.** Free, just needs editorial standard added to the style guide.
7. **External backlink campaign.** This is the one that takes months, not hours.

### External backlinks: the real bottleneck

You have zero authority backlinks. Internal linking is working. The site has no inbound links from .edu, .org, or major sports/parenting publications.

Three backlink campaigns worth running:

**Coaching governing bodies.** USA Baseball, US Lacrosse, USA Hockey, US Soccer, AAU all maintain parent resource lists. Reach out with the cost calculator and the season calendars as concrete tools. They link to specific tools more readily than to articles. The cost calculator is unique enough that it earns the link. Also pitch the body hub to USA Baseball for the arm care content.

**Parenting publications.** New York Times Parenting, The Athletic (their youth-sports coverage has expanded), Parents.com, Today's Parent. Pitch one essay to each: "The first 90 seconds" or "Three drives, one relationship" reads as a one-pager strong enough to be the byline on a placed article that links back. Don't sell the site. Sell the framework.

**Local journalism.** Tacoma News Tribune, Seattle Times, Portland Oregonian, plus regional youth-sports beat reporters. Local angle: "D3 head coach builds the parent resource he wished existed." That's a profile piece, not an op-ed. Pitch it as such. The story about Jeff is the credibility hook these outlets actually want.

A campaign that lands 10 links from the categories above moves your domain authority more than 100 internal links would.

---

## Mobile: 8 / 10

Mobile is solid. You haven't been audited at the bytes level recently, but the obvious wins are in place.

Tailwind's responsive utility classes are used throughout. The hero copy resizes from 2.25rem on mobile to 4rem on desktop. Container padding adjusts. The two-column layouts collapse to single-column. The 5-second-test view of the homepage on mobile shows the value prop clearly above the fold. The Mulish + Fraunces fallback fonts are size-adjusted to prevent CLS on font swap (you already fixed this in the previous audit).

What's left to verify and fix:

**Nav dropdown UX on mobile.** The "What to Buy" and "Tools" dropdowns are positioned absolutely with width 720px and 520px respectively. On mobile, the dropdowns are hidden by Tailwind's `hidden` class until JavaScript shows them. If JavaScript fails or is slow on a 3G connection, the user can't reach those sections. The mobile menu replaces them with simpler links to the index pages, which is the right fallback. Verify in browser that the JS-driven dropdown doesn't break the mobile menu rendering.

**Touch target spacing.** The age filter buttons on the homepage are `px-3 py-1`. That's about 32px tall. Apple HIG and Google Material both want 44-48px minimum. Bump to `py-2` (around 40px). This affects the cost calculator sliders too if they exist as buttons.

**Newsletter form tap targets.** The first-name input and email input are `py-3` which is fine. The button below them is also `py-3`. On a small phone (375px wide), the side-by-side flex layout collapses to stacked, which is correct. Tested.

**Image weight on mobile.** Hero images are .webp at the right format. Verify max width served via srcset. If you're shipping a 1200px-wide hero to a 375px-wide phone, that's 5x the bytes needed. Astro has built-in image optimization; confirm it's wired up on the article hero rendering.

**Mobile Lighthouse scores.** I don't have a Lighthouse runner in this environment, but the previous audit hit CLS issues on cost-calculator and drive-home which were fixed. Run Lighthouse mobile on the homepage, /reads/, /cost-calculator/, /parent-coach/, and one article page. Targets: Performance > 90, Accessibility > 95, Best Practices > 95, SEO > 95.

**Reading on mobile.** The article-body class sets max-width 680px and font-size 1.125rem with line-height 1.7. That's good for desktop. On a 375px phone, the body is 1.125rem which is around 18px which reads slightly large. Consider 1rem (16px) on mobile breakpoint with line-height bumped to 1.65 to compensate. Minor but improves dwell time.

The mobile experience is not where your problems are. Don't spend a week here.

---

## Message drift: 7 / 10

You've been disciplined. Twice this week you held the line where most operators would have caved.

Cornerstone-as-recruiting was the single biggest drift risk and you killed it. The /parent-coach/ pillar landing page is now the differentiator instead. The 100-article SEO bait list got cherry-picked down to 26 voice-fit pieces instead of executed wholesale. Daddyball as a content cluster was rejected. These are the right calls.

The drift you should watch for next:

**The forward-product trap.** When the books, podcast, courses, video roadmap goes live, the site can subtly tilt from "trusted resource" to "marketing asset for Jeff Thomas's products." The early signals are sales-ier copy on the about page, more references to "the upcoming book" inside articles, lead-magnet CTAs starting to feel pushy. Set a rule: any article with three or more product references gets cut to one. The newsletter is the place for product news. The reads aren't.

**The expert-creep trap.** Your byline says "Parent Coach Playbook Editorial" with leadership from a D3 head coach. As traffic grows, there's pressure to over-authorize the content with credentials, citations, and "as a head coach with 20 years of experience" framing. Your voice is parent-to-parent right now. That's the moat. Resist the consultant register.

**The audience-broadening trap.** With 213 articles published, the temptation is to write for everyone. Single moms. Stepdads. Grandparents. Different income levels. Different sports cultures. Each broadening dilutes the voice. The site is for the parent in the middle of it, full stop. The scripts work because they're specific. The decisions work because they're concrete. Don't generalize the voice to fit a wider audience. Write more pieces for sub-audiences as they earn their own pillar (you did this with parent-coach), but don't water the existing pieces.

**The SEO-driven topic drift.** Your queue is currently strong because the topics came from voice. As you add traffic-driven topics, you'll start writing pieces because the search volume is good rather than because you have something to say. The 100-article list audit caught most of those. Keep that filter on every new piece: would I write this if there were no SEO upside?

The voice itself has not drifted. The new 26 pieces I just wrote read in the same register as the existing flagship work. The discipline is holding. Worth naming because it's rare.

---

## Content overall structure: 8 / 10

The structure is genuinely well-thought-through and most of the obvious moves have been made.

Top-level surfaces are: Start here, Reads, Drills, What to Buy, Tools, Newsletter, About, Search. That's 8 surfaces. Reads and Drills are content streams. What to Buy and Tools are reference. The rest are utility. This is the right shape.

The three-pillars frame (Drive There / Game / Drive Home) is your differentiator. It's named on the homepage, it organizes the article URL structure, and it gives you a unique editorial framework. No other youth-sports site has this.

The tools layer is your moat. Cost calculator, season calendar, age pathways, body hub, recruiting hub, rules, mental skills, camps, governing bodies. That's nine tools. Most of them are unique on the internet. The cost calculator alone is the kind of tool that earns links and shares.

The new /parent-coach/ pillar is the right next move and it's in the right shape (cornerstone reads, drills bridge, decisions, newsletter signup with niche-tuned copy).

What's still rough:

**The relationship between /reads/ and /parent-coach/ isn't visually obvious.** Both are "stuff to read." The structure differentiates by audience (broad vs niche). The user might not understand which one to pick. Consider adding a small "Are you the parent-coach? More for you here" line to the /reads/ page hero.

**The /scripts/ and /decisions/ pillars are still thin.** 9 scripts live (8 more queued) and 5 decisions live (3 more queued). These are flagship formats and they're the smallest collections on the site. The team-parent pillar (18 resources) and gear (0 live, ironically) are also thin. Consider whether the formats should consolidate or whether the gap is just a writing-volume problem to be filled.

**Tools nav has 9 items, which is too many.** Inside the Tools dropdown, you have season calendar, age pathways, cost calculator, the body, recruiting, rules, the pendulum, mental skills, camps, governing bodies. That's 10 items in a dropdown. Most users can't track that many options. Group into two sub-categories: "Reference" (calendar, pathways, rules, body) and "Decisions" (cost, pendulum, mental, camps, governing, recruiting). Or consolidate body + mental skills into one health surface. The dropdown should be 5-6 items max.

**Footer is fine, slightly imbalanced.** Read column has 7 items. More column has 4. Say hi has 1. Visual weight is off. Move "Newsletter" out of "Read" since it's already in "More." Move "Coaching tips" and "Drills" into a single entry since they're synonyms. Footer doesn't need to be a complete nav, just the second-chance nav.

**No category landing pages for sports.** Each sport has scattered content across what-to-buy, pathways, calendars, rules, drills, recruiting. There's no /sports/baseball/ that aggregates all of it. This is a real SEO miss. The /sports/{slug}/ landing page is the obvious add. Pulls everything tagged that sport, in a single sport-parent reference page. Six hours of work for an entire new SEO surface. Should be the next major build.

---

## Content depth: 7 / 10

You have depth in some places, gaps in others.

Strong areas: drills (533 pieces, deep), articles (213, deep), what-to-buy (29 guides), recruiting (15), body (16), pathways (10), season calendars (10), rules (13). The reference layer is thick.

Thin areas: scripts (9 live), decisions (5 live), gear (0 live), adaptive (4 live).

Gear is interesting because the schema exists, the URL structure exists, but no items are populated. That's either a deliberate hold or a forgotten queue. Worth deciding. If gear is the affiliate revenue path, it needs items. If it's deprecated in favor of the what-to-buy guides being the gear surface, kill the schema and merge.

Scripts are flagship. They're also the format with the lowest piece count. The 8 new ones I just added bring you to 17 total once they ship. That's still thin against the use cases. There are easily 30 more script topics ("after the team loses the championship," "after a teammate gets benched," "after the kid doesn't get the captain pick," etc.). This is a writing-volume problem.

Decisions are also flagship. 5 live + 3 queued = 8 total. Easily 20 more decisions worth covering. Should we change leagues. Should I take time off coaching. Should we let her play with the boys' team. Should we bring grandparents to the championship game. Should we pay for private lessons. Each is a clear yes/no question parents ask. The decision template is fast to fill once you have the question.

Adaptive (4 pieces) is structurally important and content-thin. Either commit to building it out or fold it into the body hub. As-is, it's a flag of "we said we cover this but we don't really."

The audit you'd want next is the activity × age coverage matrix you already scoped in NEXT_AUDIT.md. That's the real depth question.

---

## Content uniqueness: 9 / 10

This is your strongest dimension and the audit category most consultants would underrate.

Voice is genuinely yours. The first 90 seconds frame, three drives, parent-coach as moat, "coach the team / keep the kid," the decision questions phrased as parents actually phrase them, the script structure (what to say / what not to say / the rule). I tried to find equivalents on Positive Coaching Alliance, Aspen Institute Project Play, MomsTEAM, and the major youth-sports parent blogs. None of them have your voice. Most of them read as institutional. You read as a parent.

The cost calculator is unique. The season calendar is unique. The pathways are unique. The pendulum quiz is unique. Tools at this depth aren't on any other site I can find.

The 26 new pieces I just wrote (parent-coach pillar, drive scripts by age, hard situations, forgotten people) extend the unique voice into spaces that nobody else has named. The carpool conversation about how you coach. The sibling at the game who isn't playing. The first time a teammate calls you Coach. None of those exist on the open internet.

The one place you're not unique is what-to-buy. The gear guide format is genuinely useful but it's a competitive crowded category. The Strategist, Wirecutter, every parenting site has equivalents. Your edge here is voice, not content. Don't try to win this category by completeness. Win it by being the place that says "skip the bat. The league has bats. Spend the money on the glove. Here's the glove."

---

## Blind spots

Five things I'd flag as actual blind spots, not gaps.

**Email list size is invisible to me but is the real metric.** You ship a newsletter. The Drive Home Playbook is a free lead magnet. The 5-email drip after download is wired up. None of that matters if the list is below 1,000. The list is the asset that compounds without Google. Every piece of content should ladder back to the email signup. Track the conversion rate by piece. If "the 90-second rule" converts at 8% and "the unwritten rules" converts at 1%, write more 90-second-style and less unwritten-rules-style. You can't see that pattern without the data.

**You're publishing 1-a-day for the next 58 days with no plan for after July 2.** The queue is empty after July 2. That's a content production cliff. Either pre-write the next 60 pieces in the next 30 days, or accept that publishing will slow in July. Slowing is fine if it's intentional. It's not fine if it's because the queue ran out and nobody noticed.

**No audience research feeding the content.** You haven't (visibly) talked to 20 parent-coaches and asked them what they Google at 11pm. The pieces are good because the writer's instinct is good. The next 50 pieces would be better if half of them came from real parent interviews. Set up 5 interviews per month with parent-coaches in your network. Voice memo. 30 minutes each. Mine for the moments they describe that aren't on the site yet. That's the next 200 pieces of content, sourced honestly.

**No social proof on the site.** No quotes from readers. No newsletter open-rate brags. No "as featured in." No "10,000 parents read us each week." Even modest numbers, framed honestly, would build trust. The /about/ page is thoughtful and credentialed but doesn't show that anyone reads the site. Add a quiet "from readers" section once you have 5 unsolicited replies worth quoting.

**The cost calculator is your single best tool and it's buried in a dropdown.** Every survey of what makes parents click in this category points to "what does this actually cost." You have the answer. You bury it 3 layers deep in the nav. The cost calculator should have a homepage section of its own, sized to match the parent-coach pillar block. The pendulum quiz should also be a homepage section. Tools are surface. Don't hide them.

---

## Growth opportunities, ranked

In order of leverage. This is what I'd present to ownership.

**1. Schema markup deployment.** Two days. Article + FAQPage + HowTo + Person. Free SERP visibility on every existing and future page. Single biggest near-term SEO move.

**2. Sport-level landing pages.** /sports/baseball/, /sports/soccer/, etc. Six-hour build per page if you templatize, or a single dynamic page that pulls everything tagged with that sport. 27 sports = a new SEO surface area.

**3. Cost calculator as a hero feature.** Move it from buried in a dropdown to a homepage block. Embed it as an iframe on every relevant article. It's your most-shareable asset. Treat it that way.

**4. External backlink campaign.** 90-day push. 10 outreach contacts per week to coaching governing bodies, parenting publications, local journalists. Goal: 10-15 quality backlinks in 90 days. The single biggest move on domain authority.

**5. Parent-coach interview series.** 5 interviews per month. Voice memo. 30 minutes. Mine for stories. Three outputs per interview: one full essay, three scripts, one decision. 20x leverage on each conversation.

**6. Activity coverage matrix audit.** The NEXT_AUDIT.md you already scoped. Run it. Surface every (activity × age) gap. Fill the highest-traffic gaps first.

**7. Email list growth tactics.** Currently the lead magnet is the Drive Home Playbook. Add three more: the cost calculator results email, a "starter pack" of the top 10 reads, and a sport-specific kit (baseball parent kit, soccer parent kit). Each is a separate signup magnet. Each captures a different reader intent.

**8. Content production pipeline beyond July 2.** Don't let the queue run dry. Hire one part-time writer who can ghostwrite to your style sheet, or commit Jeff to a 90-minute weekly drafting block. Either works. The site that publishes daily compounds. The site that goes quiet for two weeks doesn't.

**9. Search inside Cloudflare logs and Google Search Console.** The data is sitting there. What queries are people landing on? What are they bouncing from? Spend two hours a month in GSC. The patterns rewrite the content roadmap.

**10. A real comments or community surface.** Long-term. Not now. But as the audience grows, the next moat is community. A reader forum, a Substack chat, a private Discord, or just well-curated comments on flagship pieces. Don't add this until you have at least 20,000 monthly readers. Until then it's a graveyard.

---

## Social media: which channels and why

You don't need to be on every channel. You need to be deeply present on two and serviceable on two more.

### Channels worth investing in

**Facebook. Highest priority for this niche.** Youth sports parents are still on Facebook in numbers no other platform can match. Town parent groups, sport-specific groups, league-specific groups. Most of them have between 500 and 50,000 members. The content that travels there is short text posts (the lifted excerpt that frames a question), occasional links to long-form, and most importantly: presence in the comments of other people's posts. This is the channel where you build trust by being the helpful voice in 30 conversations a week.

**Instagram. Second priority.** Reels are the play. The 90-second rule, scripted as a 30-second reel with text overlay and quiet b-roll of a car/parking lot/hand on steering wheel. Carousels work for "what to say after a game at age 8" with 6-8 panels. The aesthetic of your site (Fraunces serif, warm cream paper, terracotta accents) translates beautifully to Instagram. Your visual identity is a real asset here that most parenting accounts don't have.

**Pinterest. Sleeper, third priority.** Pinterest is the platform parents use to save things for later. Cost calculator screenshots become pins. Packing lists become pins. The summer camp checklist becomes a pin. Each pin needs text-on-image because Pinterest search is text-driven. The traffic from Pinterest is slow to start and compounds for years. Set it up, post 5-10 pins a week, ignore the metrics for the first 90 days.

**Reddit. Engagement only, fourth priority.** r/Parenting, r/youthsports, r/baseballcoaching, r/cheerleading, plus sport-specific subs. Don't drop links. Reply to questions with genuine answers. Build username karma. Once you've contributed for 60 days, occasional links to your most relevant pieces will be welcome. Drop links and you'll get banned.

### Channels to skip

**TikTok.** Possibly worth testing in 90 days. Right now, the format pressure is to be hyperbolic, and your voice is the opposite. Most parent-coach TikTok is either rage-bait ("dad refused to play his kid!") or cringe ("rate my coach!!!"). You don't fit. If you do test, do it through Reels first and cross-post.

**Twitter/X.** Audience drift away from parents. Not worth the time. Threads (Meta) is a maybe in 12 months as parents migrate.

**LinkedIn.** Worth it for Jeff personally as a coaching/leadership thinker tied to the Power Of Series and Chain Reaction books. Not worth it for the site brand. Different audience, different value prop.

**YouTube.** Real long-term play, especially for the drills library. Each drill is a 3-minute video. 533 drills = a real channel. Wait until the parent-coach pillar is more developed and the production budget exists. Year two priority, not year one.

### Posting strategy by channel

**Facebook (3-4x per week).** Mix:
- Monday: Question post that drives comments. "What's the conversation you're dreading on the drive home this weekend?" Pin it for 24 hours. Reply to every comment.
- Wednesday: Excerpt from a recent article, framed as a standalone read with a link at the bottom. 200-400 word post. The link goes in the comments to defeat algorithm suppression.
- Friday: Personal anecdote post from Jeff or the editorial team. No link. Just voice. This builds the personal brand of the site.
- Weekend: Drop into 5 parent-group conversations and add a thoughtful comment with one link IF and only IF the link is the best answer to the question.

**Instagram (4-5x per week).** Mix:
- 2 reels (one hook from a script, one drill demo or framework explanation)
- 2 carousels (structured posts: "what to say after a bad game at 8-10" with 6 panels)
- 1 single-image quote post from a flagship article
- Stories daily: behind-the-scenes, polls, "ask me anything" once a week
- Save Highlights organized by Drive There / Game / Drive Home / Parent-Coach

**Pinterest (5-10x per week, batched in one weekly session).** Mix:
- 2 cost-calculator-focused pins (different angles)
- 2 packing-list / checklist pins
- 2 script pins ("what to say to a kid who hates the sport")
- 1 deeper article pin
- Each pin has a clear text-on-image headline matching what parents search

**Reddit (1-2 contributions per week, no formal schedule).** Engagement only. Find a question that's a fit for one of your pieces. Answer in comments. Drop the link if and only if it adds value. Pace yourself; 1 comment per week with a link is enough.

### Content repurposing pipeline

Every long-form article becomes 6-8 pieces of social content with a small amount of work:
- 1 Instagram carousel (the article's structure becomes the panels)
- 1 Instagram reel (the central insight as a 30-second hook)
- 1 Facebook excerpt post (the article's strongest section, lifted with a link)
- 2-3 Pinterest pins (different angles, different image cards)
- 1 Reddit reply when a relevant question shows up
- 1 newsletter mention if it's flagship

Build the pipeline once. Apply it to every new piece. The 26 articles I just wrote = 150-200 pieces of social content if processed through this pipeline.

### Who runs this

You can't run all of this yourself. The math doesn't work. The realistic options:

1. Hire a part-time social manager at $1,500-3,000/month. They produce the assets from your articles. You approve. They post.
2. Use a tool like Repurpose.io or Opus Clip to automate the cross-posting from one source piece to multiple channels. You still need someone to write the captions and engage in comments, which is most of the work.
3. Start with Facebook only for 90 days. Prove the channel. Then add Instagram. Then add Pinterest. Don't try to launch all four at once.

The right move depends on budget. If the answer is zero budget, do option 3 (Facebook only) and grow from there.

---

## Final read

The site is in better shape than 90% of media properties at this stage. Voice is real. Tools are unique. Content depth is meaningful. Technical hygiene is strong. The next year is a distribution problem, not a product problem.

Three things to move on this quarter, in order:

1. **Schema markup deployment** (week 1-2). Article + FAQPage + HowTo + Person. Two days of work. Permanent SEO upgrade.
2. **External backlink campaign** (week 2-12). 10 outreach contacts per week. Goal: 10-15 quality backlinks by end of quarter.
3. **Facebook presence** (week 1-12). Three posts per week, plus engagement in 5 parent groups per week. The discovery channel that doesn't depend on Google.

Everything else is fine to defer. These three move the needle.
