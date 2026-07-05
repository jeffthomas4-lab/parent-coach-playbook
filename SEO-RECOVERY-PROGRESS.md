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

**Not yet checked:** `kit-emails/`, `templates/`, `docs/`, `strategy/`, `worker-cron/`, `worker-link-checker/` — ran out of session before reaching these. Next session should grep those five directories for the same three strings before calling Task 2 closed.

## Task 3: Internal-linking sprint — pending

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

## Task 7: Kit drip prep — pending

## Task 8: Pinterest launch kit — pending

## Task 9: Author reveal prep — pending

## Close-out — partial

Updated `SITE_REVIEW_ACTION_PLAN_2026-07-04.md`: struck through and corrected the GSC-broken claim, the sport-hub-metadata claim, the empty-take claim, and marked the RSS action item done. Items 2 (Kit), 3 (linking sprint), and everything in "60-90 days" are untouched and still accurate as open items.

QA: this session touched code (sitemap guard, cron alert, RSS) and content (hockey.md, affiliates.json) on parentcoachdesk.com, not SightSmash, so the SightSmash QA norm doesn't apply. No formal QA harness exists for this project; verification was live curl + GSC screenshots throughout, documented per task above.

**Next session should start with:** Task 3 (linking sprint — find the tips-wiring script/convention first), then Task 2's remaining scope (kit-emails/, templates/, docs/, strategy/, worker-cron/, worker-link-checker/ still ungrepped, plus Jeff's answer on the contact email), then 7, 8, 9.
