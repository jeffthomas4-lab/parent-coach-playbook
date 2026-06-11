# parentcoachdesk.com — Improvement Task List

Updated: 2026-06-11

Organized by impact-to-effort. The items Claude can execute autonomously are marked **[Claude]**. Items that need Jeff's judgment or external data are marked **[Jeff]** or **[Jeff + Claude]**.

---

## Tier 1 — High revenue impact, executable now

### 1. Add gear guide links from coaching tips [Claude]

Zero of the 577 coaching tips currently link to the gear guides at `/what-to-buy/`. Every soccer drill tip that references shin guards should link to `/what-to-buy/soccer/`. Every baseball tip that mentions a bat should link to `/what-to-buy/baseball/`. This is the biggest gap between the content library and affiliate revenue. A systematic pass through the coaching tips, sport by sport, adding a single `/go/` or `/what-to-buy/` link per tip where one naturally belongs. No new content required. Estimated: 6-8 sessions, one sport at a time.

### 2. Quarterly affiliate link re-audit [Claude]

We just found and fixed 9 broken or wrong-product slugs manually. Amazon reassigns ASINs. Products go out of stock. This should run on a schedule: every 90 days, spot-check all 37 remaining `amzn.to` short links in affiliates.json and verify the top 20 gear-card products (highest placement count) against live Amazon pages. Set a reminder now and do the next audit in September 2026.

### 3. Homepage weekly curation — fill PINNED_SLUGS [Jeff]

The "Pinned at the Desk" section on the homepage defaults to the 3 newest articles because `PINNED_SLUGS` is an empty array. The section exists and looks good, but it never reflects editorial judgment. Once a week, before or after the Friday Letter ships, pick 3 slugs that match what readers are dealing with that week (school starts, tryout season, whatever). Takes 3 minutes. The section was built for this.

---

## Tier 2 — SEO and traffic growth

### 4. Camps section launch [Jeff + Claude]

The full camps infrastructure exists: submit form, admin review queue, state/city/sport URL structure, photo upload, claim workflow, quality framework docs. There are zero actual camp listings. This is a major missed opportunity — parents search "soccer camps [city]" constantly and the site is positioned perfectly to capture that traffic. Two paths forward: (a) manually seed 20-30 high-quality camps in key markets to populate the section and prove the model, or (b) reach out to camp operators in the CJ network or directly. Claude can write the outreach email templates and seed the initial data if Jeff provides a starting list.

### 5. RSS expansion [Claude]

The RSS feed at `/rss.xml` pulls only from the `articles` collection. The coaching tips (577 pieces) and gear guides are not in the feed. Subscribers using Feedly or any RSS reader see one-third of the content being produced. Expand the feed to include coaching tips and guides, sorted by publishedAt across all three collections. Low effort, zero visible site change.

### 6. Sport landing page SEO pass [Claude]

The sport landing pages at `/sports/[slug]` use generic auto-generated titles like "Soccer, for the parent in it." These pages aggregate every article, tip, guide, calendar, pathway, and rule for a sport into one hub — they are exactly what Google wants for head-term queries like "soccer parent guide" or "baseball youth sports parent." Each sport page should have a hand-written `seoTitle` and `seoDescription` in the SPORTS array in `src/data/site.ts` rather than the generic fallback. Claude can write these for all 20+ sports in one session.

### 7. Internal linking: articles to gear guides [Claude]

Similar to item 1, but for the 372 articles. Articles about tournament weekends should link to the sideline kit guide. Articles about 8-10 baseball should link to the baseball gear guide. A pass through the article collection sport by sport, adding natural in-text links to the relevant `/what-to-buy/[sport]/` page. Separate from the coaching tips pass because the context and link placement differ.

---

## Tier 3 — New content sections

### 8. "This Season" news section [Jeff + Claude]

There is no dated news or updates section. The homepage shows newest articles but they are essays and gear pieces, not news. A lightweight "This Season" section — 2-3 items per week, each 2-4 sentences, covering youth sports news that affects parents (rule changes, equipment recalls, registration windows, season start dates by region) — would give Google a reason to recrawl daily and give readers a reason to bookmark the site. Infrastructure would be a new `news` collection with a simple list page. The editorial commitment is the constraint. Worth doing only if Jeff can sustain 2-3 items a week.

### 9. "Age-group guide" hub pages [Claude]

The site tags content by age (5-7, 8-10, 11-12, 13-14, 15+) but there are no dedicated landing pages for each age group. A parent of a 10-year-old can't find "everything for parents of 10-year-olds" in one place. Pages at `/ages/8-10/` that aggregate every article, tip, decision tool, script, and gear guide tagged for that age group would capture high-intent search traffic ("youth sports 10 year old parent") and would function as the age-aware entry point the site currently lacks. Claude can build the page template and populate it from existing frontmatter.

### 10. Gear guide expansion: lacrosse girls, hockey [Claude]

The `lacrosse-girls.md` and `hockey.md` guides exist but are thin relative to baseball, soccer, and football. Girls lacrosse in particular is fast-growing and gear rules differ significantly from boys lacrosse. Expanding both guides to match the depth of the baseball guide (age-tiered gear picks, gear cards with affiliate links, sizing notes) would improve affiliate yield from those sports.

---

## Tier 4 — Low-effort, do when a session allows

### 11. Expand RSS to include guides and tips [Claude]

Covered in item 5 but broken out: 20-minute code change to `/src/pages/rss.xml.ts`.

### 12. Coaching tips: add sport-specific drill search/filter [Claude]

The coaching tips index at `/coaching-tips/` lists all 577 tips. There is no filter by sport. Parents browsing for soccer drills see every sport interleaved. Adding a client-side sport filter (same pattern as the age filter already on the homepage feed) would make the coaching tips section dramatically more useful. The data is all in frontmatter. Estimated: one session.

### 13. Link health admin page review [Jeff]

`/admin/link-health/` exists. It likely surfaces the same broken links we fixed manually this session. Once deployed, run the admin page against the live site and verify the 9 fixes resolved cleanly. Then set a quarterly reminder to open that page.

### 14. Image needs audit [Jeff + Claude]

`/src/pages/admin/image-needs.md` exists as a placeholder. The site uses illustrations loaded from `/public/illustrations/`. Some guide pages or article pages may be referencing images that don't exist or using alt text that's too generic. A pass through the admin image-needs page (once it's wired up) would identify gaps.

---

## What to do next session

If time is short: tackle item 5 (RSS expansion, 20 minutes) and one sport's coaching tip internal links (item 1, starting with soccer or baseball). Both are high ROI and fully executable without Jeff's input.

If time allows: item 6 (sport landing page SEO copy) is a single writing session and has outsized SEO value given how well-structured those aggregation pages already are.
