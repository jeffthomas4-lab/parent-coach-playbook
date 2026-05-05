# Parent Coach Playbook: full website audit (live)

**Date:** 2026-05-05
**Method:** Live network access enabled. Real Chrome 147 mobile Lighthouse on four URLs (homepage, /cost-calculator/, /what-to-buy/baseball/, /drive-home/the-90-second-rule/). TTFB measured from eight global nodes via check-host.net (CH, ES, FR, IN x2, KZ, RO, SG). Cloudflare cache and brotli verified by direct curl on HTML, CSS, woff2, and og-default.png. External link manifest (190 unique links) checked twice: once with HEAD and once with full GET + Chrome User-Agent. Codebase read at `Outputs/parent-coach-playbook/`.
**Compare-and-update.** Most May 4 estimates were either tighter or looser than reality; grades shift accordingly.

---

## If you do nothing else: kill the spam-redirect external links today

Two outbound resource links on the site currently dump the visitor onto a survey/captcha spam page. `aaubasketball.org` 302s to `survey-smiles.com`. `smsmf.org/smsf-programs/pep-program` 301s to `isoupdate.com`. Both used to be real youth-sports resources. Both domains have changed hands and now point at content farms. A parent who clicks one of these is being delivered, by Parent Coach Playbook, to a scam page. That is the single biggest credibility leak on the site right now and a 15-minute fix.

The second-biggest leak is the 195-link manifest itself: 58 of 190 testable URLs resolve to a real 4xx or DNS failure under a real browser User-Agent (NCAA's entire pre-2022 link set, half a dozen TeamUSA federation sites, CDC HeadsUp's old paths, NFHS, USTA, USAGym women's program). Those are honest-broken, not bot-blocked. The 195 manifest is the audit instrument; the worker-link-checker is in the repo. Wire the worker to a weekly cron and a Slack/email digest, then triage the broken-link list once. After that, broken-link rot stays under 5%.

---

## Grades

### 1. Token usage / page weight: **B+** (was C-)

Wire weight per page on the four tested URLs is 186-207KB total: 9-12KB HTML (brotli), 22KB CSS (brotli), 140-162KB in 7-9 latin-only woff2 files, 11KB Cloudflare Insights beacon, sub-1KB favicon SVG. **Previously estimated, now verified:** the 1.45MB font scare from May 4 was the on-disk worst case; browsers using @fontsource only pull the latin subset via unicode-range, so real wire fonts are ~150KB. The 104MB illustrations directory does not ship on these pages because the homepage and read pages reference zero `<img>` tags. The waste is concentrated in two places that do still ship: `og-default.png` is still 2.26MB unchanged on the wire (Cloudflare Polish is not enabled on this zone, so no auto-WebP), and the homepage HTML still inlines `font-weight: 500` 138 times when a Tailwind class would do.

**Top 3 issues:**
1. og-default.png is 2.26MB (UNCHANGED). Polish is off at the edge. Either compress the file in repo or enable Polish (Lossy + WebP) in the Cloudflare dashboard. Saves ~2MB on every social-share preview fetch.
2. Homepage inlines `font-weight: 500` 138 times. Other pages 8-11. Replace with `font-medium` once. Cuts ~6KB off the homepage HTML.
3. ChatGPT-default filenames (5 files in `public/illustrations/extras/`) and alt2/alt3 variants (11 files) still in the repo. Doesn't ship to users, leaks AI-build signal to anyone who opens the repo.

**Strengths to keep:**
- @fontsource latin subsetting via unicode-range is doing its job. ~150KB on the wire.
- Brotli on HTML and CSS works (5.7x ratio on the homepage).

### 2. Speed: **A-** (was C+, previously estimated, now verified)

Lighthouse mobile (real Chrome 147, simulated throttling, headless): home 0.98 / cost-calculator 0.94 / what-to-buy/baseball 1.00 / drive-home/the-90-second-rule 0.96. LCP: 1.0-1.7s. TBT: 0ms. INP-equivalent (TTI): 1.1-1.8s. Origin response: 50-90ms from the lighthouse perspective, 88ms (Switzerland), 92ms (Spain), 130-190ms (Pacific NW), 175ms (France/Romania), 500ms (Kazakhstan), 700-790ms (India and Singapore). The grade is A- not A because **every HTML response carries `cf-cache-status: DYNAMIC` and `cache-control: public, max-age=0, must-revalidate`** (origin Cloudflare Pages bypasses the regular CDN cache for HTML). Static `.css` and `.woff2` show REVALIDATED/MISS/HIT as expected. CLS is the second drag: cost-calculator scores 0.154 and drive-home scores 0.119, both above the 0.1 threshold; home (0.08) and baseball (0.043) are fine.

**Top 3 issues:**
1. HTML is not edge-cached. cf-cache-status: DYNAMIC on every page. Add a `_headers` file pushing HTML to `cache-control: public, max-age=300, s-maxage=86400, stale-while-revalidate=86400`. Cuts Asia/India TTFB from ~750ms to ~80ms on cache hits.
2. CLS culprit on cost-calculator is the CTA button row reflowing after font swap (`.mt-6.flex.flex-wrap.gap-3`). Add `font-display: optional` on Fraunces/Mulish (or preload + size-adjust the fallback) so the swap doesn't reflow.
3. CLS culprit on /drive-home/the-90-second-rule/ is the `.article-body` block (font swap on long body copy). Same fix.

**Strengths to keep:**
- Total page weight 186-207KB on every test URL. TBT 0ms. No client framework runtime.
- 50-90ms TTFB across Europe and the US East Coast on warm cache. The architecture is right.

### 3. Market differentiation: **B-** (unchanged)

Cost calculator with editable line items prefilled to medians, season calendar by sport-and-level, and 244 articles + 533 drills + 17 body + 29 buying guides + 20 rules + 10 scripts + 10 calendars. None of the named competitors carry that combination. The brand positioning is now locked ("Every parent is a coach. Some on the field. Most in the car. All at the dinner table after.") but the locked sentence has not shipped to the homepage. Live hero is still "The relationship is the real game." plus "A warm, honest place for parents in the middle of it. Youth sports, dance, theater, whatever your kid is into this season." That is poetry plus a vibe, not the agreed positioning. The differentiation work is queued, not landed.

**Top 3 issues:**
1. The locked positioning sentence is not on the homepage. Hero still says "The relationship is the real game." The single 15-minute change with the highest brand return is editing `src/pages/index.astro` line 36-41 to ship the locked sentence above the H1 (or as the H1).
2. The `manifesto` page exists in source but is not deployed. Source links in `src/pages/index.astro` point at `/manifesto/` and the previous git commit moved it to `/why-we-exist/`; both URLs return 404 live. The "manifesto" CTA on the source homepage is broken pending the next deploy.
3. The three-drives frame finally has a homepage section (and a dedicated "Drive Home" feature link). Restored from May 4. But the locked positioning needs to come above it for the frame to read as POV rather than table of contents.

**Strengths to keep:**
- Cost calculator and season calendar still nobody else's. Real moat.
- Editorial frontmatter system (quality / originality / voice grades, citation flags, Claude-then-Jeff review status). Best-in-class for a one-person operation.

### 4. Branding: **C+** (was C)

Type and palette unchanged and still good. The hero copy improved at the seam: "Youth sports, dance, theater — whatever your kid is into this season" became "Youth sports, dance, theater, whatever your kid is into this season" (em dash gone, comma in). The page-title format `Parent Coach Playbook — Sideline notes for parents in the middle of it.` still ships an em dash on every page (browser tab, OG share, search snippet). Homepage HTML still contains 14 em dashes. /cost-calculator/ HTML contains 112 em dashes (almost all from cited source labels: "Aspen Institute Project Play — State of Play 2025", "Sports & Fitness Industry Association — 2024 Topline Report", etc.). Half the brand-voice fix has shipped. The other half lives in `src/data/site.ts` and `BaseLayout.astro` plus the cost-calculator's source-label data file.

**Top 3 issues:**
1. Title format still uses an em dash. `BaseLayout.astro` template variable `${title} — ${SITE.name}` ships on 908+ pages.
2. `src/data/site.ts` still uses em dashes in nav labels: Football — Flag, Lacrosse — Boys, etc.
3. Cost-calculator source labels carry em dashes. 112 instances on one page, almost all in citation strings.

**Strengths to keep:**
- Color palette and type system remain better than 90% of parenting sites.
- /disclosure/ reads like a real publication: Amazon Associates disclosure, "nothing on this site is sponsored" line, Cloudflare-Web-Analytics-only privacy posture, no Google Analytics.

### 5. Content: **B** (unchanged)

The body copy in tested articles still reads peer-to-peer with real numbers and flat opinions. "Leverage" hits in articles dropped from 4 to 1 (one remaining instance: `/articles/are-youth-sports-worth-it.md`). The site still ships 533 drills, 244 articles, full sport calendars and recruiting pages. **Adaptive section is still 4 files, Decisions is still 5 files** (UNCHANGED). The "ADHD, autism, sensory, Unified Sports, adaptive leagues" promise in the nav blurb is still oversold by the 4 underlying pieces. The ChatGPT-Image filenames (5) and alt2/alt3 variants (11) still sit in the repo's illustrations folder.

**Top 3 issues:**
1. Adaptive (4) and Decisions (5) sections still under-promise on the nav blurb. Either expand or demote.
2. ChatGPT and alt-variant filenames still in repo: 16 files total. Doesn't ship, leaks signal.
3. Some published article URLs are stale or broken. Example: `are-youth-sports-worth-it.md` exists in `src/content/articles/` but `/reads/are-youth-sports-worth-it/` returns 404 live. The reads URL structure has drifted; sitemap and internal links need an audit pass.

**Strengths to keep:**
- Editorial pipeline (`REVIEW.md`, per-piece editorial frontmatter, voice grading) is the real moat.
- Voice in the markdown body itself is clean. Banned-word sweep is mostly holding.

### 6. Editorial voice: **B** (was B+)

Markdown content is clean and "leverage" is now down to 1 hit. The /disclosure/ page is voice-clean. The grade dropped from B+ because the homepage hero still has not shipped the locked positioning sentence (Anti-AI rule 4: be specific; "the relationship is the real game" is not specific) and because em dashes still appear at the title-tag layer of every page. Voice integrity, per About-Me rule 1, is binary. The voice is winning the article body and losing the page chrome.

**Top 3 issues:**
1. Locked positioning sentence not shipped. The single most public sentence of the brand is still poetry, not positioning.
2. Title-tag em dash present on every page. Centralized fix in `BaseLayout.astro`.
3. The faceless byline is now strategy, not gap. That makes the credibility burden shift to /methodology/, /about/, and individual-article source discipline. Right now `/about/methodology/`, `/about/sources/`, `/about/corrections/`, `/methodology/`, `/sources/`, `/corrections/`, and `/editorial/` all 404. Only `/disclosure/` and `/about/` exist.

**Strengths to keep:**
- /about/ has a strong "why we don't put names on bylines" paragraph already written. That is the credibility move; it just needs companion pages.
- Body copy reads peer-to-peer with real numbers (the 90-second rule, the cost-calc input grid, the rec-plus baseball middle layer). Voice in the words is winning.

### 7. Aesthetics: **B-** (unchanged)

Still magazine-quality type and palette. Density is the same problem. Homepage still ships 9-10 sections. TopicIcon SVG row is still 9 hand-drawn icons. No real photo strategy, still all AI-generated illustrations of variable consistency, no human faces. The mobile experience is acceptable; the desktop homepage is denser than `theatlantic.com`.

**Top 3 issues:**
1. Homepage still nine sections. The May 4 "cut to six" recommendation didn't land.
2. TopicIcon row of 9 SVGs still consumes major above-fold real estate. Cut to 4 or move below the fold.
3. AI-illustration consistency is variable. Either pick one style and reshoot the inconsistent pieces, or commission a freelance illustrator for the 20 most-trafficked reads and use AI for the rest in a clearly subordinate position.

**Strengths to keep:**
- Section-divider and `bg-paper-warm` alternation rhythm.
- Fraunces italic accent + warm-editorial palette. Owned look.

### 8. Product / UX: **C** (was C+)

Two problems push the grade down. First: 58 of 190 external links are real-broken under a real browser User-Agent (16 of those are 403s from publication paywalls that probably work in browsers, so triage gets you to ~42 real-broken). Two of those 58 redirect to spam (`aaubasketball.org` → `survey-smiles.com`, `smsmf.org` → `isoupdate.com`). Second: nav still 8 items with 3 dropdowns (UNCHANGED), and the homepage still has 80 internal links above the fold. The strengths from May 4 still apply: Kit integration, /admin/ tooling, /search/ exists, link-checker worker is in the repo. None of those advanced.

**Top 3 issues:**
1. Two outbound links currently funnel parents to spam pages. Single-line fix, biggest credibility return on the site.
2. 58 of 190 external links broken under real browser. ~42 of those are real-404. Wire `worker-link-checker/` to weekly cron and triage once.
3. 80 internal links on the homepage above the fold; 8 nav items with 3 dropdowns; search still hidden in upper-right utility nav. Cognitive load on first paint is high.

**Strengths to keep:**
- /admin/ tooling for camps, claims, link-health, editorial review. Real publication infrastructure.
- /disclosure/ is published and reads cleanly. Cloudflare-Web-Analytics-only posture (no Google Analytics) is a real privacy stance.

---

## Status of May 4 flagged items

| Item | May 4 finding | May 5 status |
|---|---|---|
| Em dashes (HTML output) | 2,188 across 908 pages | PARTIAL. Homepage hero comma fix shipped, but title tag, site.ts labels, BaseLayout still have them. Homepage HTML 14, cost-calc HTML 112. |
| og-default.png | 2.26MB | UNCHANGED. Live wire still 2.26MB. Polish not enabled at edge. |
| Font payload (1.45MB) | Estimated | PREVIOUSLY ESTIMATED, NOW VERIFIED. Real wire is ~150KB latin-only via @fontsource unicode-range. Was a worst-case-on-disk number, not an on-the-wire problem. Still room to drop unused weights. |
| Illustrations 104MB | On-disk | UNCHANGED on disk. VERIFIED on the wire: zero illustrations load on the four tested pages. Problem ships only on pages that use illustrations. |
| ChatGPT-default filenames | In repo | UNCHANGED. 5 ChatGPT-named, 11 alt2/alt3 still in `public/illustrations/extras/`. |
| Image dimensions / CLS | Estimated | PARTIALLY VERIFIED. CLS is real on cost-calc (0.154) and drive-home (0.119), but the cause is font swap, not missing image dimensions. Two raw `<img>` tags without width/height remain in `src/pages/admin/camps/[id].astro` and `src/pages/camps/index.astro`. |
| Inline `font-weight: 500` x138 | Homepage | UNCHANGED. Live homepage still 138 instances. Other pages 8-11. |
| Nav 8 items + 3 dropdowns | Header | UNCHANGED. |
| Hero positioning sentence shipped | Strategic update | NOT SHIPPED. Live H1 still "The relationship is the real game." Locked sentence not present anywhere in `src/pages/index.astro`. |

---

## Prioritized fix list

Ranked impact-per-effort. Top item first.

**1. Fix the two spam-redirect external links.** Find `aaubasketball.org` and `smsmf.org/smsf-programs/pep-program` in the markdown content and resource pages. Replace with current upstream (e.g., `aausports.org/basketball`) or remove. (HIGH / 15 min)

**2. Ship the locked positioning sentence on the homepage.** Edit `src/pages/index.astro` lines 36-41. Use the locked sentence as the H1 or as the eyebrow above the H1: "Every parent is a coach. Some on the field. Most in the car. All at the dinner table after." Keep "Hi. So glad you found us." or move it below. Test on a stranger before merging. (HIGH / 15 min plus one user test)

**3. Strip em dashes from `BaseLayout.astro` title format and `src/data/site.ts` labels.** Replace with periods, commas, or colons. Rebuild. Kills the title-tag em dash on every page and the nav-label em dashes (`Football — Flag` becomes `Football: Flag`, `Lacrosse — Boys` becomes `Lacrosse: Boys`, etc.). (HIGH / 30 min)

**4. Compress og-default.png from 2.26MB to under 250KB.** Either: (a) replace with a 1200x630 JPEG ≤ 250KB in repo, or (b) enable Cloudflare Polish (Lossy + WebP) in the dashboard. Polish handles it without a code change. (HIGH / 5 min)

**5. Wire `worker-link-checker/` to weekly cron and triage the 58 broken external links once.** Replace dead URLs with current upstream where one exists; remove where it doesn't. The infrastructure is already in the repo. (HIGH / 2-3 hr one-time, then 30 min/week ongoing) 

**6. Add `_headers` to `public/` to push HTML to `s-maxage=86400, stale-while-revalidate=86400`.** Right now Cloudflare Pages serves HTML with `must-revalidate, max-age=0` and cf-cache-status: DYNAMIC. A short edge cache cuts Asia/India TTFB from ~750ms to ~80ms on cache hits and is invisible to readers because new deploys purge the edge. (HIGH / 15 min)

**7. Fix CLS on /cost-calculator/ and /drive-home/the-90-second-rule/.** Add `font-display: optional` on the @fontsource imports (or preload Fraunces 700 + add `size-adjust` to the system fallback). Both pages currently fail Core Web Vitals on CLS. (HIGH / 30 min)

**8. Replace inline `font-weight: 500` with `font-medium` Tailwind class in `src/pages/index.astro`.** 138 instances. Cuts ~6KB off the homepage HTML and removes the inline-style smell. (MED / 30-45 min)

**9. Tighten editorial methodology and sources discipline so the faceless byline carries weight.** Build out three pages: `/about/methodology/` (how reads get researched, who reviews, what gets cited, the editorial-frontmatter system explained for readers, last-reviewed dates), `/about/sources/` (the 190-link manifest as a public reference list), `/about/corrections/` (a running log). The /about/ page already says "we don't put individual names on bylines" and gives the reason; these companion pages turn that into a working masthead. (HIGH / half day to a full day)

**10. Add "Last reviewed: YYYY-MM-DD" to every read.** The Drive-Home and Baseball pages I read have no last-reviewed date in the visible metadata. Faceless byline + visible review dates is the credibility play. The editorial frontmatter already grades the piece; surface that to the reader. (MED / 1-2 hr template change)

**11. Cut homepage to 6 sections.** Hero with locked positioning, the three drives, four-tile entry grid (not nine), one big featured read, latest feed strip, lead magnet, footer. Ten sections compete with each other. (MED-HIGH / half day)

**12. Cut nav from 8 items to 5-6.** Fold "Scripts" into Reads. Move "Camps" inside Tools. Collapse "Team Parent" into a Reads filter. Move search from utility nav into the main bar. (MED / 1-2 hr code, plus a strategic call)

**13. Either expand Adaptive (4 pieces) and Decisions (5 pieces) to 15+ each, or demote them out of primary nav.** Same as May 4. Promising what you cannot deliver in nav is a credibility leak. (MED / content work)

**14. Convert `public/illustrations/` PNGs to WebP and delete the alt2/alt3/ChatGPT-named variants.** 16 files in `extras/` to remove. Single batch script (`cwebp -q 80`). The illustrations don't ship on read pages today, but they will on the long-form reads and the buying guides; do this before those pages land. (MED / 1 hr)

**15. Build a 5-email drip after the lead-magnet download.** Anchored on the three-drives frame: drive there, game, drive home, the parent on the team you cannot stand, the long view. Send every 3 days. Same recommendation as May 4; still not shipped. (MED / 1-2 days)

---

## Notes for the next pass

- The first-paint experience on the homepage is fast (LCP 1.1s mobile) and visually warm. The remaining work is editorial: ship the positioning sentence, kill the em dashes at the seams, build the methodology/sources/corrections pages, and unbreak the outbound links. The performance picture turned out to be much stronger than the May 4 dist-only read suggested. The brand picture turned out to be exactly as flagged.
- Cloudflare Pages is serving HTML with cf-cache-status: DYNAMIC. That's a one-line `_headers` fix. If you're already on a paid Cloudflare plan, also enable Polish (Lossy + WebP) and Mirage at the zone level; both are free perf wins on top of what the build already does.
- The 195-link manifest plus the worker-link-checker is real publication infrastructure. Wire it to a Cron Trigger and an email-on-degradation report; the manifest will pay for itself the first time a federation rebrands a URL pattern (CDC HeadsUp → Heads Up, KSI UConn → koreystringer.institute, NCAA's entire 2014-era /sports/yyyy/mm/dd/ pattern, etc., which already happened).
