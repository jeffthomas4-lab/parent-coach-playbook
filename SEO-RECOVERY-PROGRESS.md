# SEO Recovery Progress

Session started 2026-07-05. Working folder: `Outputs/parent-coach-desk`. Update this file after every batch so a fresh session can resume without re-deriving what's already known.

## Task 1: Camps blackout — DONE

**Root cause.** The 2026-06-14 migration that pointed parentcoachdesk.com's camps at the shared `activity-radar` D1 (`8cc3694a-26f8-4a56-b131-d5d3a68c49ef`) ran through ActivityRadar's own `scripts/migrate_camps.py`, which generated `seed/0005_seed_from_camps.sql`. That seed file's `INSERT INTO programs (...)` column list never includes `pcd_status` (or `reviewed_by`, `reviewed_at`, `submitted_by_email`). The column was added in the same window by `migrations/0013_pcd_editorial_fields.sql` as `pcd_status TEXT NOT NULL DEFAULT 'pending'`. Every row the seed inserted — including the 1,701 camps that were already human-approved in the old `parent-coach-playbook` D1 — landed on that default. Nothing overwrote an existing approval after the fact; the approval was simply never carried into the INSERT in the first place. `parent-coach-desk/scripts/migrate-camps-to-activity-radar.mjs` (the script sitting in this repo, which does map status correctly) was never the one actually run — its output uses a different `id` format than what's live (`c.id` directly vs. the live `prog-{uuid5}` + `legacy_camp_id` pattern from `migrate_camps.py`).

**Recovery.** Rather than re-deriving approval from `CAMPS_QUALITY_FRAMEWORK.md` heuristics, I recovered the real prior decision: parsed the original `scripts/old-camps-export.json` (a wrangler SQL dump of the pre-migration `parent-coach-playbook` D1) for the 1,701 rows with `status='approved'`, then joined those legacy IDs against `programs.legacy_camp_id` in the live D1 and restored `pcd_status='approved'`, `record_status='active'`, `awaiting_review=0`, plus a `reviewed_by`/`reviewed_at`/`review_notes` audit trail, scoped to `session_end_date >= date('now')` per the brief. Ran in 7 batches of ~250 IDs.

- Batch results: 171, 152, 151, 144, 163, 148, 130 = **1,059 camps restored to approved**.
- 642 of the 1,701 were legitimately past their `session_end_date` and correctly left alone.
- The 44 originally-rejected camps and ~1,046 genuinely-pending camps were untouched.

**Verify (live, curled 2026-07-05).**
- `curl https://parentcoachdesk.com/sitemap-camps.xml` → 1,059 `<url>` entries (was 0).
- `/camps/` renders `camp-card` listings.
- 5 random camp pages (Nike Volleyball at Embry-Riddle, Greentrike Summer Camp, Camp Create Week 3, Breakthrough Basketball Auburn, Nike Soccer at Oregon State) all return HTTP 200 with real titles.
- No redeploy was needed — `/camps` and the sitemap read D1 at request time (SSR), so the D1 fix went live immediately.

**Prevent.** Fixed the silent-failure pattern:
- `src/pages/sitemap-camps.xml.ts` — now `console.error`s on D1 failure and on a 0-result urlset, instead of swallowing both silently.
- `src/lib/camps-db.ts` — added `countApprovedFutureCamps()`.
- `src/pages/api/cron/camps-sweep.ts` — added a third job that calls `countApprovedFutureCamps` and logs `CAMPS ALERT` if it's 0. `worker-cron` already hits this endpoint daily, so the alert surfaces in `npx wrangler tail` on the existing cron without any new secret or deploy target.

**GSC.** Resubmitted `https://parentcoachdesk.com/sitemap.xml` (index) in Search Console for parentcoachdesk.com — Status: Success, last read 2026-07-05. Also directly submitted `https://parentcoachdesk.com/sitemap-camps.xml` so it didn't have to wait for Google's own re-crawl schedule: now shows Status: Success, 1,059 discovered URLs (was "1 error", 0 discovered, last read Jul 4). `sitemap-content.xml` was already healthy at 1,873 pages throughout — the outage was isolated to camps.

**Follow-up item, not part of this brief:** source names/descriptions for the `ussportscamps.com`-scraped rows have mis-encoded en dashes (`ΓÇô` instead of `–`), a Windows-1252/UTF-8 mismatch from the original scrape. Cosmetic, shows up in page titles, worth a cleanup pass but not a blocker here.

**Build verification note:** the sandbox this session runs in couldn't complete a full `npm run build` (disk space and native-binary issues unrelated to the code — rollup and esbuild native binaries are broken in this container, and the mounted project folder blocks cache-file deletes). The 3 edited files were reviewed by hand for syntax correctness. The `npm run build` in the deploy block below is the real gate — run it before trusting this session's code changes.

## Task 2: Purge old brand — investigated, one blocker

Grepped `src/`, `public/` for `parentcoachplaybook`, `parent-coach-playbook`, `Parent Coach Playbook` (case-insensitive). Found two categories:

**Already clean.** No leftover "Parent Coach Playbook" brand-name text or `parentcoachplaybook.com` URLs anywhere in `src/`. Whoever built this site already scrubbed the visible brand name and domain.

**One real find, needs your call, not mine.** All 15 remaining hits in `src/` (plus 1 in `public/ai.txt`) are the exact same string: the contact email `parentcoachplaybook@gmail.com`, printed on `why-we-exist.astro`, `governing-bodies.astro`, `news/[slug].astro`, `search.astro`, `cost-calculator/methodology.astro`, `camps/submit.astro`, `camps/suggest.astro`, `camps/[slug].astro`, `recruiting/index.astro`, `resources/national-organizations.astro`, `what-to-buy/[slug]/sizing.astro`, plus the fallback allow-list in `src/lib/admin-auth.ts` and the scraper user-agent string in `src/lib/camps-db.ts`. It's set once in `src/data/site.ts` (`SITE.email`) and most pages read that constant — a few hardcode it directly instead.

Did not change it. Reasoning: this is a Gmail inbox, not an `@parentcoachplaybook.com` address — it has no technical dependency on the dead domain and almost certainly still receives mail. Swapping every "email us" link sitewide to a different address I can't verify is live would be worse than leaving it: real visitor emails would go to an unmonitored inbox instead of a working one. This needs your answer, not my guess:

- If `parentcoachplaybook@gmail.com` still gets checked, leave it. Nothing to do.
- If you want a `@parentcoachdesk.com` address instead, tell me what it is (or that it exists) and I'll swap all 15+ references and the `admin-auth.ts` allow-list in one pass next session.

**Deliberately not touched, per the brief:** `public/link-manifest.json` line 437 references `https://parent-coach-playbook.kit.com/4b28f916b5` — the Kit signup form. That's Task 7's job (the checklist tells you the exact clicks to move it off that subdomain). `link-manifest.json` itself is auto-generated by `npm run build`, not hand-edited — once the real Kit form URL changes, a rebuild picks it up automatically.

**Also deliberately not touched:** Cloudflare project name (`parent-coach-playbook`) and D1 database name in deploy commands and `wrangler.jsonc` — CLAUDE.md says these stay. Historical audit and planning docs (`BACKFILL_REPORT`, `AUDIT_RESPONSE`, etc.) — they record what happened and don't get rewritten.

**Remaining directories checked (session 2 continuation).** `templates/` — clean, no hits. `docs/ltad-framework.md` and `strategy/MONETIZATION-AND-MARKETING.md` reference "Parent Coach Playbook" by name, but both are internal planning docs, never deployed, never seen by a reader/crawler/subscriber — out of scope per the brief's own test ("anything a reader, crawler, or subscriber can see"). Left untouched. `kit-emails/` is not empty — it has `KIT_SEQUENCE_DRAFTS.md` (a `mcp__workspace__bash` `ls` on this folder showed it as empty; the Glob tool showed the real file — another instance of the sandbox shell's stale-read problem flagged above). Covered under Task 7 below.

**Two real functional bugs found and fixed, not just branding:**
- `worker-link-checker/wrangler.toml`: `MANIFEST_URL` pointed at `https://parentcoachplaybook.com/link-manifest.json` — a dead domain. This worker runs daily and would have been silently failing to fetch its own manifest. Fixed to `https://parentcoachdesk.com/link-manifest.json`. **Needs a redeploy of this worker to take effect** — `[vars]` changes in `wrangler.toml` don't apply until the next `wrangler deploy` for this specific worker (separate from the main site deploy block below).
- `worker-link-checker/src/index.ts`: the `USER_AGENT` string this worker sends to every external site it checks advertised `+https://parentcoachplaybook.com/about/` — a dead URL other site owners would hit if they looked up who was crawling them. Fixed to `ParentCoachDeskLinkChecker/1.0; +https://parentcoachdesk.com/about/`.
- `worker-cron/README.md`: the documented `cd` path still said `Outputs\parent-coach-playbook\worker-cron` — the folder was renamed to `parent-coach-desk` in June per `Deployments.md`. That command would fail if anyone followed the README literally. Fixed the path.

**Left alone on purpose:** worker names in both workers' `wrangler.toml` (`parent-coach-playbook-cron`, `parent-coach-playbook-link-checker`) and the D1 `database_name` — these are Cloudflare-side identifiers CLAUDE.md says stay, and renaming them means redeploying under a new worker name, out of scope here.

**Task 2 status: done**, except the one open question above (contact email) and the Kit form move (Task 7, next).

## Task 3: Internal-linking sprint — DONE

**Reconciled the baseline first.** The brief's "55 of 713 articles link to money pages" is stale. Machine count at session start: 269 of 713 articles carry a single-sport tag (444 are `multi-sport` or untagged and correctly skipped per the brief), and 104 of those 269 already linked to their own sport's `/what-to-buy/{sport}/` or `/pathways/{sport}/` page. The gap between 55 and 104 is the 2026-06-11 Backfill effort (`BACKFILL_REPORT_2026-06-11.md`), which added a "Gear mentioned in this article" footer box (with a pathway link) to 48 articles after the 55-count was taken. That left **165 real candidates**: single-sport articles with zero link to their own sport's guide or pathway page.

**How the tips convention was ruled out.** Read `src/content/coachingTips/hockey-1v1-stick-protect.md` — coaching tips use a templated "**Gear for this drill** (affiliate)" box at the end, direct `/go/` product links plus one guide link. That's explicitly the link-box pattern the brief says not to reuse for articles. Articles needed real in-prose weaving instead, matching the one clean existing example found in `basketball-levels-rec-school-club-aau.md`: *"The [pathway by age](/pathways/basketball/) maps what good looks like at each stop..."*

**Execution.** Dispatched 5 parallel agents, one per sport group (soccer+football 38 / volleyball+basketball+theater 33 / baseball+band+choir 25 / ballet+gymnastics+swimming+cross-country 25 / the remaining 13 sports 44 = 165 total), each given the exact `/what-to-buy/{slug}/` and `/pathways/{slug}/` targets, the anti-AI writing guide banned-word list in full, and the "weave one sentence into existing prose, no footer boxes" instruction. Two slug traps flagged explicitly and handled correctly: the `sport: lacrosse` tag means boys' lacrosse but the real slug is `lacrosse-boys` (not `lacrosse`), and `wrestling` has a gear guide but no pathway page, so those articles only got the one link.

**Result: 165/165 edited, 0 skipped.** Verified: `grep` across all 713 articles for banned words/em dashes co-occurring with a `what-to-buy`/`pathways` link line turned up zero real violations (one false-positive hit on "elevated" as a substring of the banned verb "elevate," not an actual violation). Frontmatter untouched everywhere; confirmed by spot-reading files from each agent's batch.

**Follow-up flagged, not fixed (out of scope for this task):** a handful of articles have pre-existing truncated or garbled closing sentences, unrelated to this session's edits — `after-a-soccer-game-what-to-say.md` (ends mid-sentence: "...They are managed"), roughly 7 more in the soccer set per the agent's spot-check, `gymnastics-meet-doesnt-land-routine.md`, `competitive-gymnastics-is-it-the-right-fit.md`, and `cross-country-vs-track-which-is-better.md` (garbled final sentence). Same family of bug as the `hockey.md` truncation fixed in Task 5. Worth a dedicated cleanup pass next session — a full grep for articles whose last line has no closing punctuation would find the rest.

**Not build-verified locally** — same sandbox constraint as Tasks 1 and 6 (rollup/esbuild native binaries broken in this container). All 165 edits are markdown content only, no schema or component changes, so build risk is low, but `npm run build` in the deploy block is the real gate.

**Post-hoc verification caught the sandbox's stale-bash-read bug again, at scale.** A bash-run Python script checking link coverage after all 5 agents finished reported 99 of 269 articles "still missing" a link, seemingly contradicting the agents' 165/165 completion reports. Cross-checked a sample via the Grep tool (authoritative) and found the links were actually present in every case checked, bash was serving a cached pre-edit view. Confirmed at scale: a broad Grep-tool search (not bash) for `/what-to-buy/|/pathways/` across all 713 articles returned exactly 310 files, precisely 145 (the pre-session baseline) plus 165 (this session's edits). Exact arithmetic match, no discrepancy. The 165 edits are real and correctly counted; trust the Grep-tool number, not the bash number, if anyone re-checks this in a future session.

## Task 4: Sport hub metadata — ALREADY DONE, stale claim

The 26 sport hubs are `/sports/{slug}/`, driven by the `SPORTS` array in `src/data/site.ts` (confirmed 26 entries: baseball, softball, soccer, basketball, flag-football, football-7v7, football, hockey, lacrosse-boys, lacrosse-girls, volleyball, swimming, track-field, cross-country, tennis, golf, crew, martial-arts, gymnastics, cheer, stunt, theater, band, choir, dance, ballet). Every one already carries a hand-written, unique `seoTitle` and `seoDescription` — no shared template, no banned words, all under the 60/155-char guidance.

Verified live via curl on `/sports/baseball/`, `/sports/ballet/`, `/sports/stunt/`, `/sports/choir/`, `/sports/band/` — each `<title>` and `<meta name="description">` matches its bespoke copy in `site.ts`, not the generic fallback the page template would use if the fields were empty. The `SITE_REVIEW_ACTION_PLAN_2026-07-04.md` claim that these are generic is stale — this must have shipped in a session after that doc was written. No action needed. Flagging for the close-out correction pass.

## Task 5: Empty "Our take" fields — DONE

Important environment note first: this sandbox's shell (`mcp__workspace__bash`) reads a stale/cached view of some files on the mounted project folder — confirmed when a Node script run via bash saw a truncated `baseball.md` (42,651 bytes) that didn't match the real file the Read tool sees (45,108 bytes, matches git HEAD). git itself is also segfaulting in this sandbox on `status`/`diff`. None of this affects the real files on Jeff's machine — Read/Edit/Grep go through the actual file, and that's what I used for all findings below. Do not trust bare `grep`/`node`/`git` output from this sandbox's bash tool against this repo without cross-checking through Read or Grep.

Redid the audit properly: counted `<h3>` product cards against `Our take:` occurrences per file across all 37 guides using the Grep tool. 33 files use the card format (the other 4 — `first-aid-kit.md`, `sideline-kit.md`, `season-essentials.md`, plus one more — use a different layout with no per-item take field, not in scope). Totals: 194 cards, 193 "Our take" lines. Exactly one gap, in `hockey.md`: the Shock Doctor Youth Mouthguard card. The file was actually truncated mid-tag — missing the take line, the CTA link, and the closing tags for that card. Confirmed live: `/what-to-buy/hockey/` only rendered 3 of the 4 cards before the fix.

`/what-to-buy/baseball/` — the card the brief specifically called out — was already fully populated on the real file; that was a stale claim (or an artifact of the same sandbox read issue, on my first bash-based pass, before I caught it).

Fix: wrote the take ("Get the strap version, not the loose kind. A $10 mouthguard sitting in a locker room three towns away does nothing for your kid's teeth."), the CTA, and closed the HTML properly. For the affiliate link, reused the existing verified `mouthguard-boil-bite` Amazon ASIN (`B00I1BDKPC`) under a new `hockey-mouthguard` slug in `src/data/affiliates.json` — the same product is already aliased as `rugby-mouthguard` and `multi-sport-mouthguard-youth`, so this follows the site's existing convention instead of inventing a new product or link.

**Flagging, not fixing:** `hockey.md` only covers ages 5–9 gear. Every other multi-age guide on the site (baseball, football, etc.) runs through the full age range. Worth a look — either hockey was intentionally scoped short, or the 10+ age bands never got written. Didn't expand it here since that's new content requiring real product research, not a field-fill.

## Task 6: RSS expansion — DONE

Found that `src/pages/rss.xml.ts` already merged articles, coaching tips, and gear guides in code — but a single global `MAX_ITEMS = 100` sorted purely by date meant the 713 articles alone filled every slot. Confirmed live: `curl https://parentcoachdesk.com/rss.xml | grep -o "<category>[^<]*</category>" | sort | uniq -c` returned 100 `<category>Read</category>` and nothing else. Tips (577 items) and guides (37 items) never appeared despite the code already accounting for them.

Fix: gave each content type its own reserved slice before merging (60 articles / 25 tips / 15 guides), so the combined feed always carries a mix. Also added two dedicated feeds so volume never starves low-count types again: `src/pages/rss-tips.xml.ts` (up to 150 tips) and `src/pages/rss-guides.xml.ts` (up to 100 guides). Both `prerender = true`, same pattern as the existing feed, so nothing new lands in the runtime worker. Linked both in `<head>` in `BaseLayout.astro` next to the existing `/rss.xml` alternate link. Left the footer's single RSS link as-is (points to the combined feed, which now actually includes tips and guides) rather than cluttering it with three links — head `<link rel="alternate">` tags are what feed readers actually use for discovery.

Not build-verified locally (see build verification note under Task 1 — sandbox constraints). Visual review of all three files confirms they follow the exact working pattern of the original `rss.xml.ts`.

## Task 7: Kit drip prep — DONE

Delivered two files in `kit-emails/`: `WHAT-TO-SAY-WHEN-DRIP-FINAL.md` (six paste-ready emails, grounded in the real linked articles, not generic) and `KIT-WIRING-CHECKLIST.md` (the setup + domain-move steps). No Kit account or live site file touched, per the ground rules.

**Real gap found and flagged, not papered over.** `KIT_SETUP.md` (existing) documents the site's actual live subscribe mechanism: one Kit form, ID `9388648`, the same hosted URL used everywhere sitewide with no per-page distinction, redirecting to `/welcome/`, and an explicit note that the free Kit plan doesn't support Sequences or Automations. `KIT_DRIP_SETUP.md` (existing) specs a tag-triggered automation on `drive-home-playbook-downloaded`, which assumes a paid plan and a way to tag subscribers differently by which page they signed up on. Neither is confirmed true today. The checklist tells Jeff to verify both before wiring anything, and gives two options (a dedicated second form/landing page for the lead magnet, or Kit's tag-based redirect if the plan supports it) to close the gap.

**Domain move, precisely scoped.** Found the old `parent-coach-playbook.kit.com` URL hardcoded in exactly 3 places: `NewsletterSignup.astro` line 30 (the shared constant driving most subscribe buttons sitewide), and two more hardcoded literals in `index.astro` line 134 and `newsletter.astro` lines 51/79 that don't go through the shared component. None edited this session (the new URL doesn't exist yet), but the checklist gives exact file/line targets plus a recommendation to collapse the two duplicate literals into the shared constant once the move happens, so future domain changes are a one-line edit.

**Flagged, not resolved:** `kit-emails/KIT_SEQUENCE_DRAFTS.md` is a separate, older 6-email general welcome sequence, still branded "Parent Coach Playbook" throughout (old sender name, old domain). Different sequence than the What to Say When drip this task covers. Left untouched, Jeff's call whether to retire or rebrand it.

## Task 8: Pinterest launch kit — DONE

Delivered `strategy/PINTEREST-LAUNCH-KIT.md`: 10 boards, 3 pins each (30 total), image specs, posting cadence, pre-launch checklist. Prep only, no Pinterest account touched.

Every one of the 30 destination URLs was checked against the real content and phase field in `src/content/articles/`, `src/content/decisions/`, `src/content/recruiting/`, `src/content/pathways/`, `src/content/guides/`, and `src/content/seasonCalendars/` before being used, not assumed from title text. Caught and fixed several phase-prefix mistakes in a self-review pass (e.g. cost-breakdown and sideline-behavior articles needed `/drive-there/` or `/game/` prefixes, not flat URLs; one leftover `.md` extension on a decisions link).

Image specs pulled from `src/styles/pcd-tokens.mjs` (the real brand palette and fonts, not invented): Cream Paper `#FAF6EE`, Warm Ink `#2D2520`, Terracotta `#C5713D`, Fraunces/Mulish. Flagged which existing `public/illustrations/` assets are close enough to reuse as crop sources, and noted they're landscape, not Pinterest's native 2:3 ratio.

## Task 9: Author reveal prep — DONE

Delivered `strategy/AUTHOR-REVEAL-CHECKLIST.md`. `AUTHOR_REVEALED` in `src/data/site.ts` left at `false`, untouched.

**Real find: the code already half-built this.** `src/data/site.ts` already has an `AUTHOR_REVEALED` switch with a comment describing a planned "November face-reveal date," a fully populated `AUTHOR` object naming Jeff Thomas, and two functions (`authorEntity()`, `personSchema()`) that already gate Article/HowTo/About JSON-LD on that switch. This wasn't something to invent, it was something to find, verify, and build the checklist around.

**Real gap flagged.** The switch only changes structured data (invisible to readers). The visible reveal requires separate, manual edits the switch does not perform: `SITE.byline`/`EDITORIAL.byline` (hardcoded `'the Parent Coach Desk'`, rendered on every card/feed), the `/about/` page's hand-written "Who writes this" section (currently states "we do not put individual names on bylines" and "the Desk is two parents"), and a homepage hero line. Checklist gives exact file/line targets for all of them.

**Real fork surfaced, not resolved for you.** The current About page says "two parents." The `AUTHOR` object only has one person (you) populated, with an empty `sameAs` array. Flagged as a decision only you can make before the new About copy gets written, not guessed at.

**Bio copy:** short/medium/long versions delivered, grounded only in facts already in `AUTHOR` and `About Me/About Me.txt` (D3 head coach, UPS, interim AD through Jan 2025, Power Of Series, Chain Reaction). Nothing invented.

**15-target outreach list:** live-searched on 2026-07-05, not pulled from memory. 11 verified named people/shows (Raising Athletes, Parents in Sport Podcast, Play Fearless, Youth Sports Parenting Tribe, Healthy Sports Parents, Our Kids Play Hockey, John O'Sullivan/Changing the Game Project, Tom Farrey/Aspen Institute Project Play, John Branch/NYT, Rob Rossi/Pittsburgh Trib, Missy Isaacson/ESPNw), plus 4 outlet-level targets (News Tribune, Seattle Times, Fatherly, a national parenting outlet) flagged explicitly as needing your own byline confirmation since regional/parenting-media staffing turns over too fast to trust a name from search without a second check.

## Close-out — DONE

All 9 tasks closed this session (1 and 4 carried over already done from the mid-session checkpoint; 2, 3, 5, 6, 7, 8, 9 completed in this continuation).

Updated `SITE_REVIEW_ACTION_PLAN_2026-07-04.md` fully: corrected the GSC-broken claim, sport-hub-metadata claim, empty-take claim, RSS item (all from the earlier checkpoint), plus this session's additions: the Kit drip item (copy done, wiring still Jeff's), the internal-linking item (marked done, real numbers), the Pinterest item (kit done, launch still Jeff's), and both author-reveal mentions (prep done, decision to flip still Jeff's).

**Found and flagged, not fixed:** `BACKFILL_REPORT_2026-06-11.md` flagged `/go/frame-8x10/` as missing an `affiliates.json` entry. It's not missing, an entry exists (`frame-8x10`, ASIN `B0B1CNJL7N`), but it doesn't match the ASIN in `affiliate-picks/ESSENTIALS_PICKS.md`'s actual research (`B0DC611TMD`, the Vittanly 8x10 frame 4-pack, $16.99, 4.7 stars). Someone added a placeholder or a different-but-valid ASIN after the backfill report was written, and it was never reconciled against the sourced pick. Didn't touch it, this needs Jeff or a future session to verify which ASIN is actually still live and correctly priced on Amazon before swapping, not a guess from a sandbox with no live Amazon access.

QA: this session touched code (sitemap guard, cron alert, RSS, 2 worker files) and a large volume of content (165 articles, hockey.md, affiliates.json) on parentcoachdesk.com, not SightSmash, so the SightSmash QA norm doesn't apply. No formal QA harness exists for this project. Verification this session: live curl + GSC screenshots (Task 1), Grep-tool link-syntax validation across all 165 edits (zero broken markdown links), Grep-tool banned-word sweep (zero real violations), and the Grep-vs-bash arithmetic cross-check above (310 = 145 + 165 exact).

**Genuinely open for next session, in priority order:**
1. Kit tagging-architecture gap (`kit-emails/KIT-WIRING-CHECKLIST.md` step 0) needs Jeff's plan-tier confirmation before the drip can wire.
2. The contact-email decision from Task 2 (keep `parentcoachplaybook@gmail.com` or swap it, 15+ references waiting).
3. Author-reveal fork: one person or two, before the About page rewrite happens.
4. `frame-8x10` ASIN reconciliation above.
5. A handful of pre-existing truncated/garbled article endings surfaced during Task 3 (listed in that section above), same family of bug as the `hockey.md` fix, worth a dedicated grep-and-fix pass.
6. Guide↔pathway↔calendar cross-linking (mentioned in the original brief for Task 3, not done this session, only article→money-page linking was in scope for the 165).
