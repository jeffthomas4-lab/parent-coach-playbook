# parentcoachdesk.com — Next Session Handoff Prompt

Copy and paste this entire block to start the next conversation.

---

## Paste this at the start of the next session:

You are working on parentcoachdesk.com, an Astro static site (hybrid output, Cloudflare Pages adapter) for parents in youth sports, dance, theater, and performing arts. Jeff Thomas owns it. He is head football coach at University of Puget Sound (D3, Tacoma, WA).

Before doing any work, read ABOUT ME/ files: About Me.txt, Anti AI Writing.txt, Deployments.md, My Company.txt. They govern voice, banned words, deploy commands, and priorities.

---

## Site repo

`C:\Users\jeffthomas\Desktop\Claude Cowork\Outputs\parent-coach-playbook`

**All file reads/edits use Windows paths and the Read/Edit/Glob/Grep tools. Do NOT use bash for reading repo files — the bash sandbox serves stale copies.**

**Deploy:** Windows PowerShell only, no bash chaining.

```powershell
cd "$HOME\Desktop\Claude Cowork\Outputs\parent-coach-playbook"
npm run build
git add -A
git commit -m "ONE-LINE SUMMARY"
npx wrangler pages deploy dist --project-name parent-coach-playbook --branch main
git push
```

---

## Architecture

- **Framework:** Astro with hybrid output (SSR for camps section, static for everything else)
- **Adapter:** Cloudflare Pages
- **Database:** Cloudflare D1, binding name `DB`, database name `parent-coach-playbook`
- **Content:** Astro content collections in `src/content/`
- **Routing:** `src/pages/`
- **Data:** `src/data/` — affiliates.json, site.ts (SPORTS array, CAMP_SPORTS, BUYING_GUIDES, etc.)
- **Affiliate tag:** `parentcoachpl-20` (Amazon). NO UTM params on Amazon or CJ links (Operating Agreement).
- **CJ Affiliate:** publisher 101798499, advertiser 2061630, domain tkqlhce.com. NO UTMs on CJ click URLs.

---

## Content collections

`src/content/config.ts` defines all collections:

- `articles` — main editorial content. Fields: title, dek, topic, sport, age, phase (drive-there/game/drive-home/team-parent), publishedAt, featured, draft
- `coachingTips` — 577 tips. Fields: title, summary, sport, age (string OR ages array), fundamental, publishedAt
- `guides` — gear buying guides. Fields: activity, category (sport/activity/essentials/coach-gear), lede, costSummary, publishedAt
- `scripts` — car ride scripts. Fields: title, moment, whatToSay, whatNotToSay, theRule, sportTags, ageBands
- `decisions` — big decisions framework. Fields: title, theQuestion, benefits, costs, howToHandleIt, theRule
- `body` — pediatric health + safety. Fields: title, subhub (health/safety), category/safetyCategory
- `seasonCalendars` — per-sport season calendars. Fields: sport, level, months array
- `pathways` — age-development timelines. Fields: sport, bands array by age
- `recruiting` — HS-to-college content
- `adaptive` — adaptive/neurodivergent athletes
- `rules` — rules at-a-glance per sport
- `resources` — team parent tools
- `news` — NEW. "This Season" short updates. Fields: headline, summary, category (rule-change/equipment/registration/season-dates/safety/general), sport (optional), sourceUrl, sourceLabel, publishedAt

All collections use `isLive(data)` from `src/lib/publishFilter.ts` to filter `draft: false` and published content.

---

## Affiliate system

`src/data/affiliates.json` — 135 slugs. Format:
```json
"slug-name": {
  "destination": "https://www.amazon.com/dp/ASIN?tag=parentcoachpl-20",
  "retailer": "Amazon",
  "campaign": "gear-slug-name"
}
```

`src/pages/go/[slug].astro` — generates static redirect pages from affiliates.json at build time.

**ASIN reuse is the primary bug type.** Amazon reassigns ASINs. Always verify with `amzn.to` short links before trusting them.

**Gear cards never display fixed prices** (Amazon Operating Agreement).

---

## What was completed in the last two sessions

### Session 1 (affiliate audit)
- Fixed 9 broken/wrong-product affiliate slugs in affiliates.json
- Updated AFFILIATE_MASTER_LIST.md with correct product names and URLs

### Session 2 (site improvements — all complete)
1. **542 coaching tips** — added affiliate gear links and gear guide links to every tip with a sport. Updated `affiliateDisclosurePresent: true` in frontmatter. Script pattern: sport → primary slug, keyword regex → secondary slug. Disclosure section appended at end of each file.
2. **RSS feed** (`src/pages/rss.xml.ts`) — expanded from articles-only to articles + coachingTips + guides, merged and sorted by publishedAt.
3. **Sport landing page SEO** (`src/data/site.ts`) — added `seoTitle` and `seoDescription` to all 26 SPORTS array entries. `src/pages/sports/[slug].astro` updated to use them.
4. **372 articles** — added affiliate gear links to all sport-tagged articles. 48 updated, 256 essays skipped (no sport tag), 56 performing arts skipped. Header: "Gear mentioned in this article."
5. **Age hub pages** (`src/pages/ages/index.astro` and `src/pages/ages/[group].astro`) — five routes: 5-7, 8-10, 11-12, 13-14, 15-plus. Pulls from articles/coachingTips/scripts/decisions filtered by age. Custom seoTitle/seoDescription per group.
6. **Sport filter on coaching tips index** (`src/pages/coaching-tips/index.astro`) — 13 sport filter buttons with client-side JS, data-sport-tag attributes. Lacrosse uses substring match.
7. **Lacrosse-girls guide** (`src/content/guides/lacrosse-girls.md`) — expanded from ~102 to ~250 lines. Age-tiered gear sections, gear cards.
8. **Hockey guide** (`src/content/guides/hockey.md`) — expanded from ~168 to ~290 lines. Gear cards, HECC certification explainer, flex/length table.
9. **PINNED_SLUGS on homepage** — set to: the-summer-break-conversation, summer-specialization-pressure, summer-training-for-an-eight-year-old.
10. **"This Season" news section** — new `news` collection in config.ts. 4 seed items in `src/content/news/`. Pages at `/news/` and `/news/[slug]/`. Homepage section added between Pinned section and Three Drives section.

---

## Camps section — needs one command to go live

The full camps infrastructure is built (SSR, D1 database, submit form, admin review queue, state/city/sport URL structure, geolocation, map, filters, claim workflow). **73 verified PNW camps exist in the SQL file but have NOT been imported to the remote D1 database yet.** This is why the site shows "No camps in the directory yet."

**To seed the camps, run:**

```powershell
cd "$HOME\Desktop\Claude Cowork\Outputs\parent-coach-playbook"
npx wrangler d1 execute parent-coach-playbook --file=./imports/out/camps-2026-summer.sql --remote
```

That imports 73 camps (Tacoma/Lakewood area: UPS Logger camps, PLU camps, Metro Parks Tacoma, Skyhawks, YMCA, UK International Soccer). After running it, deploy and check `/camps/` on the live site.

A second import file exists at `imports/out/camps-import-2026-05-03.sql` — check whether it overlaps or extends camps-2026-summer.sql before running both.

---

## Key files

| File | Purpose |
|---|---|
| `src/data/affiliates.json` | All 135 affiliate redirect slugs |
| `src/data/site.ts` | SPORTS array (26 entries), CAMP_SPORTS, BUYING_GUIDES, PILLARS, EDITORIAL |
| `src/pages/go/[slug].astro` | Static redirect pages for /go/ links |
| `src/pages/camps/index.astro` | Camps directory (SSR, D1) |
| `src/lib/camps-db.ts` | All D1 query helpers for camps |
| `src/pages/rss.xml.ts` | RSS feed (articles + tips + guides) |
| `src/pages/ages/[group].astro` | Age hub pages (5-7, 8-10, 11-12, 13-14, 15-plus) |
| `src/pages/sports/[slug].astro` | Sport hub pages (26 sports) |
| `src/pages/coaching-tips/index.astro` | Tips index with sport filter |
| `src/pages/news/index.astro` | This Season news list |
| `src/pages/news/[slug].astro` | Individual news item page |
| `src/content/news/` | 4 seed news items |
| `src/content/guides/` | All buying guides |
| `SITE_IMPROVEMENTS.md` | Full improvement task list with status |
| `AFFILIATE_MASTER_LIST.md` | Master record of all affiliate picks |
| `imports/out/camps-2026-summer.sql` | 73 PNW camps ready to import to D1 |
| `migrations/` | D1 schema migrations (0001 through 0008) |

---

## Remaining work (from SITE_IMPROVEMENTS.md)

**Execute immediately (no Jeff input needed):**
- Expand remaining thin gear guides: wrestling, golf, gymnastics, cross-country, pickleball, stunt, crew, martial-arts — same depth pass done on lacrosse-girls and hockey
- Add more news items to `src/content/news/` as relevant events occur (rule changes, registration windows, equipment recalls)

**Needs Jeff input or external action:**
- Camps section: run the D1 import command above, then verify live
- Homepage PINNED_SLUGS: update weekly when Friday Letter ships
- Quarterly affiliate re-audit: next due September 2026 — re-check all amzn.to short links and top 20 gear cards
- Link health admin page: `/admin/link-health/` — run post-deploy to verify affiliate fixes

**Bigger strategic items:**
- Pillar pages (Ultimate Parent Guides by sport) — high SEO leverage, one guide per sport, 3,000+ words each
- Parent-coach gear guide — clipboard, stopwatch, pennies, coach bag — affiliate slugs already in affiliates.json
- Membership / digital product (paid expanded "What to Say When" field guide, $9-19)
- Camp directory monetization (featured listings, $99-$499/year for camp operators)

---

## Voice and writing rules (abbreviated)

From Anti AI Writing.txt:
- No em dashes. Ever.
- Banned words: delve, tapestry, leverage, robust, seamless, pivotal, transformative, holistic, navigate, foster, testament, vibrant, multifaceted, nuanced, groundbreaking, innovative, journey (80+ total)
- Banned patterns: reframe patterns ("It's not about X, it's about Y"), fake wisdom triplets, empowerment closes ("you've got this")
- Max 3 sentences per paragraph
- No unsolicited bullets when prose works
- Parent-to-parent voice. Peer talking to peer.

---

## Anti-AI writing guide (full banned list)

See `About Me/Anti AI Writing.txt` for the complete 80+ word banned list and banned sentence patterns. Read it before writing any content for the site.

---

*Generated 2026-06-11. Update SITE_IMPROVEMENTS.md when tasks complete.*
