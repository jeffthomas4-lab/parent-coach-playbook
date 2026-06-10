# Site Review: parentcoachdesk.com

Date: 2026-06-10. Goal: level the site up and grow organic SEO, written for parents, particularly moms in youth activities. This review ran four parallel audits: live-site technical SEO, repo SEO infrastructure, prior strategy docs, and the mom-search keyword landscape. It builds on the May 5 strategic audit instead of repeating it.

---

## The verdict

The product is ahead of the distribution. The site has 289 live articles, 577 drills, 29 gear guides, working schema on articles, a real voice, and a cost calculator nobody competing in this space has. What it doesn't have: search visibility (live SERP checks found effectively zero), backlinks (still zero per the May audit), and one technical leak that undercuts everything else.

The May audit's biggest recommendation, content volume, is largely done. The bottleneck has moved. It's now distribution and a short list of technical fixes. Stop building inventory; start making Google and Pinterest see the inventory that exists.

---

## 1. The critical fix: parentcoachplaybook.com is a live duplicate

parentcoachplaybook.com does not redirect. It serves the entire site as a 200-status mirror, and every internal link on it points to itself, so crawlers can crawl the whole duplicate domain. Canonical tags point to parentcoachdesk.com, which is the only thing holding back full duplicate indexing, but canonicals are hints, not directives. Any link equity the old domain has earned is split, and crawl budget is being spent twice.

Fix: a Cloudflare Bulk Redirect (or host-rule worker) sending every parentcoachplaybook.com URL 301 to the same path on parentcoachdesk.com. One hour of work. Do this before anything else in this document.

---

## 2. Technical SEO fixes, in order

1. **301 the old domain.** Above. Everything else compounds on top of this.
2. **Gear guide titles and meta.** All 29 guides render "Gear File: soccer | Parent Coach Desk" because the template hardcodes the title (`src/pages/what-to-buy/[slug].astro`) and the guides schema has no seoTitle/seoDescription fields. These are the money pages and they carry zero search terms. Pattern: "Youth Soccer Gear List by Age: What to Buy (and Skip)". One template edit plus 29 frontmatter entries.
3. **Schema on the money pages.** Articles already ship Article + BreadcrumbList JSON-LD (good). Gear guides ship Organization only, despite ten product cards each. Add ItemList + BreadcrumbList to guides and wire the existing FAQPageSchema component wider. The cost calculator should declare WebApplication schema and a real title ("Youth Sports Cost Calculator: What a Year Actually Costs"); right now its title is "Cost calculator."
4. **Images on gear guides.** /what-to-buy/soccer/ renders zero img tags. No image search surface, no rich results, generic og-default.jpg on every share. One illustration per age band plus per-guide og images.
5. **Small leaks.** Two dead `href="#"` links on the cost calculator (point them at /pathways/ and /season-calendar/ as defaults). Add `article:modified_time` meta (dateModified already exists in schema). Move WebSite+SearchAction schema from /about/ to the homepage. Add `loading="lazy"` to hero illustrations. Add pagination to /reads/ topic archives before the post count makes the 24-item cap a crawl ceiling.

---

## 3. The mom audience: where the site stands

The positioning is already further along than the May audit's "reads male-authored for women" critique. The live homepage opens warm ("Hi. So glad you found us"), the snack rotation and team-parent content exists, and the multi-activity scope (dance, theater, band, choir, cheer alongside sports) is the single biggest differentiator. Live SERP research confirms it: nobody aggregates the whole sports-mom job across activities. Band and theater moms are almost completely unserved.

What the mom audience changes about SEO strategy: moms search for logistics and moments, not philosophy. The queries are "cheer competition packing list," "team mom duties checklist," "how much does competitive dance cost," "what to say when your kid wants to quit," searched at 10pm mid-season. The competitors ranking today are scattered single-author mom blogs and tool-company thin content. None of them has this site's depth. The lane is open.

---

## 4. Keyword clusters, ranked by opportunity

1. **Costs.** "How much does travel baseball cost," "competitive cheer cost per year," "cheapest sports for kids." No site owns cost content across sports, the numbers ranking today contradict each other, and the calculator is a linkable asset nobody else has. Build one pillar page ("What youth sports really cost in 2026") plus per-activity cost breakdowns that each end in the calculator.
2. **Decision moments.** "Kid wants to quit soccer should I let him," "child didn't make the team," "questions to ask before joining a travel team." Rankers (NPR, Scary Mommy, i9) stay at principle level. The scripts section already does what wins here: exact words, by age. Retitle and structure scripts to match these queries.
3. **Packing lists and checklists.** "Cheer competition packing list," "tournament weekend packing list," "sports mom bag." Low difficulty, printable-driven, Pinterest-heavy (Pinterest pins literally rank in Google for these). Each needs: checklist high on the page for the featured snippet, free printable for email capture, vertical pin image.
4. **Team-parent logistics.** "Team mom duties checklist," "snack schedule template." The competition is SignUpGenius thin content and a 2014 PDF. The snack-rotation post already exists; build the kit around it. Skip snack recipes; children's hospitals own that query.
5. **First-season guides per activity.** "First season of soccer, what nobody tells you." One hub per activity cross-linking gear guide + drills + costs + calendar. This is also the internal-linking spine the site needs.
6. **Gear long tail.** Head terms are retailer-locked (Nike, Dick's). Win the long tail: "first cleats for a 5-year-old, what actually matters." The fall-sport gear cards added June 10 monetize this cluster.
7. **Tournament weekend survival.** Hotels, food, budget. Weak field, ties into the cost cluster.
8. **Post-game emotional moments.** "What to say after a bad game." This plus the decision cluster is the Google Discover play: fresh, image-led, emotionally real.

SERP mechanics for all of the above: question-style H2s (People Also Ask shows on every cost and decision query), a tight list high on every checklist page (list snippets dominate), and the BLUF box pattern the editorial standards already call for.

---

## 5. Pinterest is not optional for this audience

Pinterest reaches roughly 40 percent of US parents, pins rank inside Google for the checklist queries, and the site currently has no presence. This contradicts the my-company "no new platforms" rule, so it's a decision, not a directive. But the honest read: for a mom audience, Pinterest is closer to SEO than to social. Pins are search-indexed assets, not a posting treadmill. The minimum version is one vertical pin image per checklist/printable page, batched monthly, no community management.

---

## 6. What was already diagnosed and is still open (from May 5)

Still open and still right: external backlinks (zero; the cost calculator is the outreach asset, templates are already written), sport landing pages (now partially exist at /sports/, finish them as the first-season hubs), camps monetization phase 2, and the reads-page pagination. The volume deficit and voice work flagged in May are done. The author reveal (November) needs the pre-staging listed in the May plan: Person schema flip is already wired in site.ts, pre-generate og images before flipping.

---

## 7. 90-day plan

**Weeks 1-2 (technical):** 301 the old domain. Guide titles + seoTitle/seoDescription fields. Guide schema (ItemList + BreadcrumbList + FAQ). Calculator title + schema + dead links. Lazy loading. Set up a weekly 30-minute GSC review habit; the site has no keyword tool, so GSC is the keyword tool.

**Weeks 3-6 (content, mom clusters):** Cost pillar + 6 per-activity cost pages (baseball, cheer, dance, soccer, hockey, band). 6 packing-list pages with printables and pin images. Retitle the existing scripts to match decision-moment queries. Each new page ends in the calculator or a printable; every printable feeds the Friday Letter.

**Weeks 7-10 (distribution):** Cost-calculator backlink outreach (the 10-week campaign already templated in the May docs; execute, track weekly). Pinterest account + pins for every checklist page. First-season hubs for the 6 fall activities, shipping before the August registration window.

**Weeks 11-13 (compound):** Run NEXT_AUDIT.md coverage matrix, fill the top 10 gaps it surfaces. GSC-driven retitles on anything ranking 8-20. Pre-stage the November author reveal.

**What to say no to:** new content collections, Instagram, recruiting expansion, snack recipes, fighting ilovetowatchyouplay.com on philosophy. The plan above is enough.

---

## Success metrics

By September 10 (90 days): old domain fully redirected, 29 guides retitled with schema, 12+ new mom-cluster pages live, 10+ referring domains from the calculator campaign, Pinterest live with 20+ pins, and the first GSC queries with impressions over 1,000. Traffic targets stay as the business plan set them (8-12K visitors by month 6); this plan is how the curve starts.
