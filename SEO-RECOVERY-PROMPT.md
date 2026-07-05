# SEO Recovery Session Prompt

Paste everything below this line into a fresh session running in the Cowork workspace root.

---

Work in `Outputs/parent-coach-desk` (parentcoachdesk.com, Astro 5 + Cloudflare Pages + D1). CLAUDE.md norms apply: read the ABOUT ME files, apply the anti-AI writing guide to every word you write, no em dashes, end with the deploy + git block. This prompt is the full brief. Do not re-audit the site. The findings below were verified on July 5, 2026. Trust them, but re-verify any number before acting on it.

## State of play (verified July 5, 2026)

- GSC access works. jeffthomas owner profile sees all three properties: parentcoachdesk.com, coachjeffthomas.com, parentcoachplaybook.com.
- parentcoachdesk.com sitemap index: submitted June 11, status Success. Not the problem.
- `sitemap-camps.xml` serves an empty urlset (110 bytes). GSC shows "1 error", 0 discovered URLs.
- Root cause: the shared `activity-radar` D1 (id `8cc3694a-26f8-4a56-b131-d5d3a68c49ef`) has **0 approved camps**. 2,105 pending (1,245 with `session_end_date >= today`), 44 rejected. The live `/camps/` index lists nothing.
- Fallout: GSC discovered pages fell 3,261 → 1,873 (June 22 → July 4). Indexed fell 390 → 288. Camp pages were earning most of the site's early impressions.
- parentcoachplaybook.com does not resolve (NXDOMAIN). The June 10 change of address depends on live 301s. This one is mostly Jeff's to fix; your job is Task 2.
- Distribution gaps from `SITE_REVIEW_ACTION_PLAN_2026-07-04.md`: articles link to money pages in only 55 of 713 cases (tips are done, 542/577), 26 sport hubs carry generic seoTitle/seoDescription, gear cards ship empty "Our take:" fields, RSS covers articles only, Kit drip unwired, no Pinterest.

## Ground rules

1. Verify before you claim. A task is done when you have curled the live URL, counted the rows, or built cleanly. Never report done off intent.
2. Work in batches with a progress file. Anything touching hundreds of files gets a `SEO-RECOVERY-PROGRESS.md` at the project root so the next session resumes instead of restarting.
3. When blocked, log it in the progress file and move to the next task. Do not stall the session on one blocker.
4. Every word of site copy you write passes the anti-AI writing guide. No banned words, no reframes, no empty triplets. Specific over general.
5. Do not touch Kit, Pinterest, or any external account. Prep files only (Tasks 7 and 8).
6. Website Build norm applies: if a change touches a pillar (security, a11y, etc.), check it against `About Me/Website-Build-Standard.md` before shipping.

## Task 1. Camps blackout (do this first)

**Root cause.** Find what zeroed `pcd_status = 'approved'`. Check `migrations/`, `worker-cron/src`, and any ingest script in `scripts/` that writes `pcd_status`. The likely suspect is a re-ingest that overwrote approved rows back to pending. Write the cause in one paragraph in the progress file.

**Recovery.** Read `CAMPS_QUALITY_FRAMEWORK.md` and `CAMP_DISCOVERY_PIPELINE_REVIEW.md` first. If the framework's pass criteria map to fields already in D1 (complete dates, location, source URL, price, no rejected flags), bulk-approve pending camps that pass, restricted to `session_end_date >= date('now')`. Run in batches of 50: approve, curl a sample of the new `/camps/{slug}/` pages, continue. If the framework requires human judgment you cannot resolve from data, stop and instead write Jeff a ranked approval queue with a one-line recommendation per camp batch.

**Verify.** `curl https://parentcoachdesk.com/sitemap-camps.xml` counts more than 500 URLs, `/camps/` renders listings, five random camp pages show real data.

**Prevent.** The sitemap code swallows D1 failures silently (see the catch block in `src/pages/sitemap-camps.xml.ts`). Add a guard so an empty result is loud: a cron check in `worker-cron` that flags when approved-and-future count is 0, or at minimum a comment-documented log line. This outage ran two-plus weeks unnoticed. That cannot repeat.

**GSC.** After the deploy, resubmit `https://parentcoachdesk.com/sitemap.xml` in Search Console for parentcoachdesk.com and confirm sitemap-camps.xml re-reads without error. Use the Chrome tools; Jeff's profile has owner access.

## Task 2. Old domain (investigate, then hand off)

You cannot renew a domain. Determine what died: run `nslookup parentcoachplaybook.com`, check whether the zone still exists in the Cloudflare dashboard (ask Jeff to look if you cannot), and check registrar status via whois. Then give Jeff a numbered fix list: restore registration or re-add the zone, recreate the bulk redirect rule (301, all paths, path-preserving, to parentcoachdesk.com), re-serve robots.txt. After Jeff confirms, verify three old URLs 301 correctly and note in GSC that the change of address is still active. Redirects need to stay live into 2027.

## Task 3. Internal-linking sprint (articles to money pages)

Tips were wired by script; find how (`scripts/`, `link-manifest.json`) and reuse the convention rather than inventing one. Target: every live article carries 1 to 3 in-prose contextual links to its sport's gear guide, pathway, or season calendar. Natural anchor text inside existing sentences. No link boxes, no "Related:" stubs unless the site already has that component. Skip articles with no matching sport. Batches of 50, `npm run build` after each, log progress. Also cross-link guide ↔ pathway ↔ calendar per sport where missing.

## Task 4. Sport hub metadata (26 hubs)

Hand-write `seoTitle` (under 60 chars) and `seoDescription` (under 155 chars) for each sport hub. Each names the sport and the parent-coach angle. Vary the sentence structure across the 26; if three in a row share a template, rewrite. No banned words.

## Task 5. Empty "Our take" fields

Grep the gear-guide content for empty our-take fields, `/what-to-buy/baseball/` confirmed as one. Write each take in Jeff's voice: one or two sentences, a flat opinion tied to a specific product attribute, zero hedging. "Buy the 28-inch if your kid is under 60 pounds" beats anything general.

## Task 6. RSS expansion

Extend RSS to coaching tips and guides. Either widen `src/pages/rss.xml.ts` or add parallel feeds and link them in the head. Keep it prerendered so nothing new lands in the runtime worker.

## Task 7. Kit drip (prep only)

Read `KIT_DRIP_SETUP.md`. Deliver every drip email as final, paste-ready copy in `kit-emails/` (check what exists first) plus a checklist for Jeff of the exact clicks in Kit to wire the sequence and move signup off the parent-coach-playbook.kit.com subdomain. Do not log into Kit.

## Task 8. Pinterest launch kit (prep only)

Write `strategy/PINTEREST-LAUNCH-KIT.md`: 10 board names mapped to sports and seasons, 30 pin titles and descriptions drawn from the existing packing-list PDFs, cost pages, and gear checklists, plus image specs (1000x1500). Jeff creates the account.

## Task 9. Author reveal prep (no live changes)

The JSON-LD author flip is already coded. Write `strategy/AUTHOR-REVEAL-CHECKLIST.md`: where the flip lives, draft about-page bio copy in Jeff's voice, and an outreach shortlist of 15 targets (governing bodies the site already cites, WA local press, youth-sports podcasts) with the one-line angle for each. The reveal date is Jeff's call. Flip nothing.

## Close-out

Update `SITE_REVIEW_ACTION_PLAN_2026-07-04.md` item statuses and correct its stale claim that GSC access is broken. Run the QA that fits what shipped. End the reply with the standard build → commit → deploy → push PowerShell block for parentcoachdesk.com, one line commit message stating what actually changed.

Order: 1, then 3, 4, 5, 6 in any order, then 2, 7, 8, 9 as the session allows. Task 1 recovers rankings that already existed. Everything else builds new ground.
