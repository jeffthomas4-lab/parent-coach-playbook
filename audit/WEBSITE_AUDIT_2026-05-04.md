# Parent Coach Playbook: full website audit

**Date:** 2026-05-04
**Method:** Codebase read at `Outputs/parent-coach-playbook/`. Built `dist/` (955 HTML pages, 153MB total) read as the deployed bundle, since the live host is blocked by the egress allowlist in this environment. Add `parentcoachplaybook.com` to Settings → Capabilities to let the next pass hit production for real TTFB and Cloudflare cache verification.
**Author scope:** Honest, no flattery. The value here is in the criticism.

---

## If you do nothing else: pick a positioning sentence, and put a face on the editorial

Right now the homepage hero says "The relationship is the real game." That is poetry. It is not positioning. A new visitor in five seconds does not learn who you are, who this is for, or why this beats the next youth-sports site Google sends them to. The brand name says "Parent Coach." The nav says "Drills, Team Parent, Tools." The tagline says "parents in the middle of it." Three different audiences, three different promises.

The fix is two sentences and one decision. Decision: are you the site for the parent who coaches their own kid, or the site for any parent of a kid in organized activities? Pick one. Then write a hero that names the audience and the value in one line. "The Parent Coach Playbook is for parents who coach their own kid. Practice plans, drills, the script for the drive home, and the things nobody tells you." Or whichever flavor matches the call. Pair that with a real human byline (you, or you plus one named editor) on the about page and below the flagship reads. Faceless editorial is defensible on a research site like Project Play. On a peer-to-peer parent site, a face is the moat.

---

## Grades

### 1. Token usage / page weight: **C-**

Self-hosted fonts ship 1.45MB on first load (latin, latin-ext, vietnamese, cyrillic, greek subsets all bundled by `@fontsource` defaults) on an English-only US site. The `og-default.png` social-share image is 2.26MB. The `public/illustrations/` directory is 104MB of un-optimized PNGs, multiple in the 2-3MB range, including ChatGPT-default filenames like `ChatGPT Image May 1, 2026, 06_50_13 AM.png`. The HTML itself has 138 inline `font-weight: 500` repetitions per homepage where a Tailwind class would do.

**Top 3 issues:**
1. Font payload is 1.45MB across 54 woff2 files. Site is English-only. Configure `@fontsource` (or move to subset Fraunces / Mulish woff2) to ship latin only. Saves roughly 1.1MB on first load.
2. `og-default.png` is 2.26MB at 1731x909, 8-bit RGB PNG. Should be 100-200KB JPEG or WebP at 1200x630 (the actual standard).
3. `public/illustrations/` is 104MB. Convert to AVIF or WebP, drop the alt2 / alt3 / extras variants from the repo, rename anything still carrying `ChatGPT Image…` filenames.

**Strengths to keep:**
- One CSS bundle, ~13KB total JS across small `hoisted.*.js` files. Astro is doing its job.
- Gzipped homepage is 9.4KB, gzipped CSS is 22KB. The wire payload is fine on text. The waste is in fonts and images.

### 2. Speed: **C+** (estimated, dist-only)

Static Astro on Cloudflare Pages with one CSS, baked-in JSON-LD, and skip-to-content. TTFB will be excellent (cannot verify without live access, flag as caveat). LCP risk: the homepage hero is large display type plus a cream background, no above-the-fold image, so LCP should be the H1 paint, which is fast. CLS risk: illustrations on read pages do not appear to carry width/height attributes, and the homepage age-filter bar mounts client-side.

**Top 3 issues:**
1. CLS exposure on every read page that uses an illustration without explicit width/height. Astro's `<Image>` component or even raw width/height attrs on `<img>` would eliminate this.
2. The age-filter bar on the homepage hydrates client-side and hides feed cards by `data-age-tag` after first paint. That is a mild layout shift signal.
3. The 70KB cost-calculator HTML inlines all profile data for every sport into the page, then ships an additional script. Acceptable but worth checking whether splitting profile data behind a fetch keeps initial parse cheaper.

**Strengths to keep:**
- Static HTML on Cloudflare with brotli/gzip will give a sub-200ms TTFB worldwide. That is 95% of the speed battle won architecturally.
- No client-side framework runtime. No React, no hydration tax. Astro picks the right tool for editorial.

### 3. Market differentiation: **B-**

The cost calculator with editable line items pre-filled to national medians is genuinely distinct. Project Play has the data but no calculator. AAP HealthyChildren has clinical content but no parent-voice. Mojo has video drills. PCA has training programs. Changing the Game has John O'Sullivan's name and stage. PCP has voice and depth, but a faceless byline plus broad-everything coverage means the moat against any well-funded SEO site is mostly the voice quality, which is invisible from the homepage. The "drive there / game / drive home" frame is a real angle but it has been pushed below the fold in the current homepage.

**Top 3 issues:**
1. Faceless editorial. "Parent Coach Playbook Editorial" is the byline on every piece. That is a defensible choice for a research site. For a peer-to-peer parent site competing against named brands (O'Sullivan, PCA), it is a moat hole. A real founder name plus a credentials line ("D3 head coach, former interim AD") is your unfair advantage.
2. The site covers everything. Sports, theater, band, dance, ballet, choir. That is useful breadth but it dilutes the "Parent Coach" name and makes the site feel grab-bag. Either narrow to coach-of-own-kid sports, or rename to a broader brand and accept the trade.
3. The "three drives" frame (your distinctive POV) lives in /about/ and inside the article phase taxonomy but is not the front door. It used to be the homepage organizing principle and got demoted to one section.

**Strengths to keep:**
- The cost calculator and the season calendar by sport-and-level. Neither competitor has this.
- 533 drills across sports is a real library. Mojo has more video, but PCP has the better written-coach-instruction format.

### 4. Branding: **C**

Visual identity is coherent: Fraunces italic display + Mulish body + JetBrains Mono labels, palette of warm ink, terracotta, sage, cream, dusty rose, honey. That set of choices reads as "warm editorial," and that is consistent with the voice. But the brand promise is split three ways and the homepage 5-second test fails. A new visitor cannot tell what this site does. Worse: the title tag itself, the OG meta, and the nav labels all carry em dashes ("Parent Coach Playbook — Sideline notes," "Football — Flag," "Lacrosse — Boys"). Em dashes are explicitly banned in your About Me voice rules. The brand is shipping a voice-rule violation in the page title of every URL.

**Top 3 issues:**
1. 2,188 em dashes across 908 of 955 HTML pages. Most come from `src/data/site.ts` data labels, the `BaseLayout.astro` title format string, and a few hard-coded copy lines in `src/pages/index.astro`. Centralized fix.
2. Brand stands for: nothing in 10 words that a stranger can repeat. "Sideline notes for parents in the middle of it" is a vibe, not a promise. Compare: Project Play = "Sport for All, Play for Life." That is positioning.
3. Logo is wordmark-only with no symbol. Fine for now, but it gives social shares and favicon nothing to lean on visually.

**Strengths to keep:**
- The color palette and type system are good. Better than 90% of parenting sites that lean blue-and-orange-stock-photo.
- The disclosure, corrections, and funding transparency on /about/ reads like a real publication, not a flip site.

### 5. Content: **B**

Real depth in the volume tier: 244 articles, 533 drills, 17 body, 29 buying guides, 20 rules, 10 scripts, 10 season calendars. The articles I sampled (`are-youth-sports-worth-it`, `end-of-season-banquet-toolkit`, the pitcher arm-circle drill) are written for a real parent, not for SEO. The frontmatter editorial system (quality / originality / voice grades, citation flags, Claude-then-Jeff review status) is best-in-class for a one-person operation and a real strength to keep.

**Top 3 issues:**
1. Adaptive athletes section ships 4 markdown files. The nav blurb promises "ADHD, autism, sensory, Unified Sports, adaptive leagues." Four pieces cannot keep that promise. Either build to 15+ before keeping it in primary nav, or demote to a sub-page of /resources/.
2. Decisions section ships 5 markdown files. Same gap. Fold into Reads or expand.
3. Illustration filenames in the repo include `ChatGPT Image May 1, 2026, 06_50_13 AM.png` and several `-alt2`, `-alt3` variants. They do not ship to users, but they sit in the repo and reveal the AI-generated source. If anyone ever opens the repo (open source, GitHub mirror, contractor handoff), the brand takes a hit.

**Strengths to keep:**
- The editorial review pipeline in `REVIEW.md` and the per-piece `editorial:` frontmatter block. Nobody else at this scale runs that. It is your quality moat.
- Voice in the actual markdown is clean. Zero hits on "delve," "worth noting," "at the end of the day," "not only X but also Y" across 916 markdown files.

### 6. Editorial voice: **B+**

The markdown content reads like a real coach writing to real parents. Specific numbers ($3,000 costume, $2,000 hotel, "10 reps each arm"), opinions stated flat ("the answer is almost always no"), short paragraphs, peer-to-peer tone. The work that ships in the article body is cleaner than 95% of the parent-content market. The grade is held back by template-layer violations: 2,188 em dashes in HTML output, 117 markdown files with em dashes, plus the hero in `src/pages/index.astro` itself contains "Youth sports, dance, theater — whatever your kid is into this season." Voice integrity is a binary in your About Me file. Either it ships or it does not. Right now it ships in the words but breaks at the seams.

**Top 3 issues:**
1. Em dashes throughout the template and data layer. `site.ts` labels (Football — Flag, Lacrosse — Boys), `BaseLayout.astro` title format (`${title} — ${SITE.name}`), homepage hero copy. Centralized 30-minute fix.
2. The cost-calculator and methodology pages cite sources with em dashes in the labels (e.g., "Aspen Institute Project Play — State of Play 2025"). That is the same template-layer problem.
3. "Leverage" appears 4 times in articles (mostly inside compound phrases like "highest-leverage life skills"). Not a crime, but the voice rule says cut on sight. Two minutes of grep.

**Strengths to keep:**
- The editorial frontmatter grading system catches voice drift before publish. Built-in defense.
- "Hi. So glad you found us." in the homepage eyebrow. That is voice. Keep this and more like it.

### 7. Aesthetics: **B-**

Type and color are good. Layout density is the problem. The homepage carries nine sections (hero, three drives, moments, topics, what's-new, lead-magnet, footer plus dropdown nav with three panels). The topic-icon row is 9 hand-drawn SVGs. The nav has 8 items plus utility nav. That is too many things asking for the visitor's attention before they have figured out where they are. Mobile is okay but the topic-icon section stacks four-wide-then-two-wide and the nav collapses to a long Menu list. Closer to a $20/year indie editorial site than a $5 ad-farm. The bar is "$50/year subscription brand" and the work to clear it is reduction, not addition.

**Top 3 issues:**
1. Homepage has too many sections. Cut to: hero + positioning sentence, four anchor tiles (not nine), one big featured read, latest feed, lead magnet. Today's version is denser than The Atlantic homepage.
2. Topic-icon SVGs are charming but they consume real visual weight. Consider keeping four and dropping the rest, or moving below the fold under a less prominent header.
3. No real photo strategy. AI-generated illustrations of variable consistency (some pieces have alt2 / alt3 versions, some have none), no human faces, no on-the-field photos. That is the signal that says "AI-built" to a reader who notices.

**Strengths to keep:**
- The warm-editorial palette and the Fraunces italic accent. Owned look.
- `border-b border-bone` section dividers and `bg-paper-warm` alternation. Quiet, magazine-quality structural rhythm.

### 8. Product / UX: **C+**

Newsletter is wired through Kit with a lead-magnet form on top of the regular subscribe. PDF download lives at `/the-drive-home-playbook.pdf`. The /search/ page exists. Internal linking via Related Articles is decent. But the funnel from new-visitor to returning-reader is weak: download the PDF, get one short read a week, nothing else. No drip series. No content track ("here are the next five reads if this one helped"). The eight-item nav with three dropdowns over-indexes on browse and under-indexes on lead-with-best-content.

**Top 3 issues:**
1. Eight nav items plus three dropdowns plus utility nav (newsletter, about, search) plus a mobile menu list. Cut to 5-6: Reads, Drills, What to Buy, Tools, Newsletter. "Scripts" overlaps "Reads," "Camps" can sit inside Tools, "Team Parent" can collapse into Reads under a topic filter.
2. No drip onboarding after the lead-magnet download. A 4-7 email series anchored on the three-drives frame is what converts a downloader into a regular reader.
3. Search is hidden in the upper-right text link. Heavy users find it; new visitors do not. Consider a search bar in the nav or in the homepage hero.

**Strengths to keep:**
- Kit integration with a single email address dropping the user into both newsletter and lead-magnet flow. Good.
- The /admin/ tooling for camps, claims, link-health, editorial review. The site has real publication infrastructure.

---

## Prioritized fix list

Ranked impact-per-effort. The first five are an afternoon. Items 6-10 are a week. Items 11-15 are strategic.

**1. Strip em dashes from `src/data/site.ts`, `src/layouts/BaseLayout.astro`, and `src/pages/index.astro`.** Replace with periods, commas, or colons. Rebuild. 2,188 violations gone in one deploy. (HIGH / 30 min)

**2. Compress `og-default.png` from 2.26MB to under 250KB.** WebP or JPEG at 1200x630. Drop into `/public/og-default.webp` and `/public/og-default.jpg` for Twitter back-compat. (HIGH / 5 min)

**3. Subset the fonts to latin only.** Configure `@fontsource` or move to direct woff2 imports for Fraunces and Mulish. Cuts 1.1MB+ from first load. (HIGH / 30-60 min)

**4. Add a one-sentence positioning line to the homepage hero.** Above the H1: who this is for and what they get. Test the 5-second test on someone who has never seen the site. (HIGH / 15 min plus one user test)

**5. Add explicit `width` and `height` attrs (or use `<Image>`) on every illustration.** Eliminates CLS on read pages. (MED-HIGH / 1-2 hr)

**6. Convert `/public/illustrations/` PNGs to WebP.** Single batch script (`cwebp -q 80`). Cuts 90MB. Delete the `extras/`, `alt2`, `alt3` files at the same time. (HIGH / 1 hr)

**7. Replace inline `font-weight: 500` with `font-medium` Tailwind class** across components. 138 instances on the homepage alone. Cuts roughly 10% off HTML weight. (MED / 1-2 hr)

**8. Cut the homepage to six sections.** Hero with positioning, four-tile entry grid (the situations that send parents to the site), one big featured read, latest feed, lead magnet, footer. The current nine sections compete with each other. (MED-HIGH / half day)

**9. Cut nav from 8 to 5-6 items.** Fold "Scripts" into Reads, "Camps" into Tools, "Team Parent" into Reads-under-filter. Aggressive simplification. (MED / 1-2 hr code, plus a strategic call)

**10. Build a 5-email drip series** that runs after the lead-magnet download. Anchored on the three-drives frame: drive there, game, drive home, the parent on the team you cannot stand, the long view. Send every 3 days. (MED / 1-2 days)

**11. Pick a fingerprint persona.** Either expose Jeff (head coach + former interim AD) as the named author with a face on /about/, or hire one named senior editor and put their face there. Faceless editorial is the moat-thinness problem. (HIGH impact / strategic call, 1-2 hr execution once decided)

**12. Decide what the brand actually covers.** Coach-of-own-kid sports only, or every-parent-of-every-organized-activity? The current spread (sports + theater + band + dance + ballet + choir) makes "Parent Coach Playbook" mean less. Either narrow content scope or accept the broader name. (HIGH impact / strategic)

**13. Either expand the Adaptive section to 15+ pieces or demote it from primary nav.** Same call on Decisions (currently 5 pieces). Promising what you cannot deliver in nav is a credibility leak. (MED / content work)

**14. Restore the three-drives frame as the homepage organizing principle**, since it is your most distinctive POV. Right now it sits as one section among nine. Make it the spine. (MED / half day)

**15. Add a search bar to the nav** (not just a link to /search/). Returning readers who know what they want will use it; new visitors will see the depth. (LOW / 1-2 hr)

---

## Notes for the next pass

- Allowlist `parentcoachplaybook.com` in Cowork Settings → Capabilities so the next audit can hit production directly. That gets us real TTFB, real Cloudflare cache headers, real Lighthouse, and any image-polish transforms Cloudflare applies that the dist bundle does not show.
- The site has a documented `EDITORIAL_AUDIT.md` and `100_POSTS_PLAN.md` already in the repo. Worth re-reading those alongside this audit to deduplicate.
- The `link-manifest.json` covers 195 external links. A weekly link-checker run (the `worker-link-checker/` Worker is already there) will catch dead-link rot before parents do.
