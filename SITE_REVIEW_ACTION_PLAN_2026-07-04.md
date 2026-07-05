# Parent Coach Desk — Full Review & Action Plan
**Date:** July 4, 2026 · **Sources:** repo audit (all planning docs, src/, .claude/), live site crawl, market research

---

## 1. What the site does well

**Content depth nobody else has.** ~1,700 pieces across 14 collections: 671 articles, 577 coaching tips, 177 body pages, 53 scripts, 37 gear guides, 28 calendars, 26 pathways. 26/26 sports have full infrastructure (guide + pathway + calendar) as of the June 10 coverage audit. No direct competitor (Project Play, NAYS, MOJO, I Love To Watch You Play, Youth Inc.) combines editorial + tools + gear + drills in one place.

**A real editorial identity.** The "three drives" frame, the Scripts/Decisions formats, and the money-honest voice are distinctive and hard to clone with AI slop. This matters more every month — AI Overviews now appear on ~58% of SERPs and punish generic informational content; voice and formats are the defensible layer.

**Tools competitors don't have.** Cost calculator, age pathways, season calendars, pendulum quiz, camps directory. Tool-intent traffic is the most AI-resistant traffic you have.

**Excellent technical foundation.** Astro 5 + Cloudflare Pages + D1; ~60s builds; 3 sitemaps; JSON-LD (Article/HowTo/FAQ) with author-reveal flip built in; consent-aware GA4 + Web Vitals; `/go/` affiliate redirect system with `rel="sponsored"` enforced globally via rehype.

**Compliance posture is ahead of most niche sites.** June audit closed all critical items (disclosure placement, Amazon link purity, rel attributes, privacy policy). Health content carries disclaimers + governing-body citations. COPPA clean.

**Scope already matches the ambition.** Performing arts (ballet, band, theater, choir, dance) are in the nav — the "go-to youth activity site" positioning is structurally started, not just aspirational.

---

## 2. Where it's lacking

The pattern is one sentence: **the product is 90% built and distribution is 10% built.**

1. **Zero external backlinks** — your own business plan calls this "the single biggest authority bottleneck." Nothing has moved on it.
2. ~~**No measurement.** GSC access has been broken since at least June 29 (jeffthomas4@gmail.com not an owner of the property). You are flying blind on the only channel in the plan (70% SEO by month 24).~~ **[Corrected 2026-07-05]** GSC access works — the jeffthomas owner profile sees all three properties (parentcoachdesk.com, coachjeffthomas.com, parentcoachplaybook.com). The real problem was data, not access: `sitemap-camps.xml` served empty for two-plus weeks because a June 14 migration reset 1,701 approved camps to pending. Fixed and verified same-day — see `SEO-RECOVERY-PROGRESS.md`.
3. **No social presence at all.** No Facebook, Pinterest, or Instagram — Pinterest is the highest-leverage untouched channel for this audience (packing lists, gear checklists, cost graphics are pin-native formats).
4. ~~**Email is a form, not a system.** Drip sequence still not wired despite KIT_DRIP_SETUP.md. Signup links go to `parent-coach-playbook.kit.com` — the dead brand name, on a third-party domain.~~ **[Corrected 2026-07-05]** Six-email drip copy finished and paste-ready in `kit-emails/WHAT-TO-SAY-WHEN-DRIP-FINAL.md`. Not wired live yet, that's still yours to do in the Kit dashboard. A real architecture gap was found first: the site's one Kit form has no way today to tag a subscriber by which page they signed up on, so the tag-triggered automation in `KIT_DRIP_SETUP.md` can't fire as designed until that's fixed. Full fix options and the exact domain-move steps (3 hardcoded references to the dead subdomain, file/line noted) are in `kit-emails/KIT-WIRING-CHECKLIST.md`.
5. ~~**Internal linking is half-done.** Drills are wired (542 of 577 tips link to gear guides) but only 55 of 713 articles do — your editorial pages, the ones most likely to rank and get shared, don't feed your money pages. No `/ages/[band]/` hubs.~~ **[Corrected 2026-07-05]** Done. The "55 of 713" baseline was stale (pre-dated the June 11 gear-box backfill, which had already brought it to 104). Every one of the 269 single-sport articles now links in-prose to its own sport's gear guide and/or pathway page (165 added this session, verified clean against the anti-AI writing guide). The 444 multi-sport/untagged articles are correctly out of scope, there's no single "money page" they'd point to. `/ages/[band]/` hubs are still not built, that's a separate, bigger project.
6. **Monetization is a single point of failure.** Only Amazon (3–4% rates) is truly live; 10 networks pending since mid-June with no follow-up cadence. Display ads: nothing. Camps claims ($79/yr): live but legally incomplete (no lawyer-reviewed terms, no DMCA agent, no minor-photo consent language).
7. ~~**Quality gaps visible on the live site.** Multiple gear cards ship with empty "Our take:" fields (confirmed on /what-to-buy/baseball/). Sport hub pages use generic SEO titles/descriptions. RSS covers articles only.~~ **[Corrected 2026-07-05]** Sport hub metadata was already bespoke for all 26 hubs — verified live, this claim was stale before this doc was even written. The "Our take" gap was real but isolated to one card (hockey's mouthguard, not baseball) — fixed. RSS was fixed: it already merged tips and guides in code but a shared item cap starved them out; now each type gets a reserved slice, plus dedicated `/rss-tips.xml` and `/rss-guides.xml` feeds.
8. **The 15+ age band is empty for 25 of 26 sports** — deliberate, but high-school parents are the highest spenders (BBCOR bats, recruiting, showcase fees) and the gap undercuts "go-to for youth activity."
9. **Anonymous author until November** gates E-E-A-T, backlink outreach, and podcast/PR — i.e., gates the entire authority strategy. **[Update 2026-07-05]** Still anonymous, the reveal itself wasn't flipped (out of scope for this session by design). But the prep is now done: `strategy/AUTHOR-REVEAL-CHECKLIST.md` has the full checklist reconciling what the existing `AUTHOR_REVEALED` code switch does and doesn't cover, bio copy at three lengths, and a 15-target outreach list, live-checked, ready to send the day you flip it.

---

## 3. Action plan — traffic & monetization

### Next 30 days (unblock + wire what's built)
| # | Action | Why |
|---|---|---|
| 1 | ~~**Fix GSC access** (add jeffthomas4@gmail.com as owner, or verify sc-domain property)~~ **Done — access was never broken.** Camps sitemap recovery + resubmit done 2026-07-05. | Blocks all SEO measurement; 5-minute fix |
| 2 | ~~**Wire the Kit drip sequence** (spec already written in KIT_DRIP_SETUP.md) and move signup to a branded form/domain instead of parent-coach-playbook.kit.com~~ **Copy done 2026-07-05.** Six emails ready in `kit-emails/`. Wiring itself (and a tagging-architecture gap that needs fixing first) is in `KIT-WIRING-CHECKLIST.md`, still yours to execute in Kit. | Email is the one channel you own; the old brand name leaks trust |
| 3 | ~~**Internal-linking sprint on articles:** tips are done (542/577); articles are at 55/713.~~ **Done 2026-07-05.** All 269 single-sport articles now link to their own gear guide/pathway page (165 added). Cross-linking guides ↔ pathways ↔ calendars per sport not done this pass, worth a follow-up session. | Feeds money pages; biggest on-site SEO win available |
| 4 | ~~**Fill every empty "Our take:" field** and hand-write seoTitle/seoDescription for the 26 sport hubs~~ **Done 2026-07-05.** Sport hub metadata was already live and bespoke. One real "Our take" gap found and fixed (hockey mouthguard). | Live quality gap; sport hubs are your best SERP entry points |
| 5 | **Follow up on all 10 pending affiliate networks**; activate Dick's/CJ links the day they approve; swap Amazon links where a higher-rate merchant carries the item | Amazon 3–4% vs 8–12% typical at CJ/Awin/Impact |
| 6 | ~~**Launch Pinterest** (business account, 10 boards by sport/season, pin the packing lists, cost pages, gear checklists — templates already approved June 10)~~ **Kit done 2026-07-05.** `strategy/PINTEREST-LAUNCH-KIT.md` has 10 boards, 30 pins, image specs, and a posting cadence, all destination URLs checked live. Creating the actual account and posting is still yours to do. | Pin-native content already exists; compounding, low-maintenance channel |
| 7 | **Ship the July 50-post plan on schedule** — World Cup pieces are time-boxed (Jul 4–19) | Timely content = first realistic earned-link window |
| 8 | ~~Expand RSS to coaching tips + guides~~ **Done 2026-07-05.** Per-type item caps plus dedicated `/rss-tips.xml` and `/rss-guides.xml` feeds. | Trivial; already flagged by growth agent |

### 60–90 days (authority + second revenue leg)
1. **Move the author reveal up from November.** Every week anonymous is a week of no backlink outreach, no podcasts, no HARO/Connectively quotes, no local-press "UPS head coach builds parent resource" story — which is a layup. The JSON-LD flip is already coded. This is the single highest-leverage strategic change available. **[Update 2026-07-05]** Full prep now sits in `strategy/AUTHOR-REVEAL-CHECKLIST.md`: what the code switch does and doesn't cover, the "two parents" vs. single-author fork that needs a decision first, bio copy, and a 15-target outreach list. The only thing left is picking the day.
2. **Backlink campaign** once revealed: governing bodies (you already cite them — ask for resource-page listings), youth-league resource pages, parenting publications, podcast circuit, local WA press.
3. **Build `/ages/[band]/` hubs** and run the 15+ wave (8 posts already scoped in the July plan; keep going — 25 sports need it).
4. **Camps Phase 2** (map + filters) and close the legal gaps: lawyer-reviewed terms page, DMCA registration ($6), minor-photo consent line in the upload flow. Don't scale the $79 claims until these are done.
5. **Facebook presence** — page + genuinely participate in 5–10 large youth-sports-parent groups (share tools, not links-spam; the cost calculator is the door-opener).
6. **Display ads decision:** hold until ~50k sessions/mo (Raptive/Mediavine thresholds; Journey accepts lower). Don't clutter the site for pennies before that.
7. **Ship one digital product** ($9–19): a script pack or "First Season Kit" per sport, assembled from existing content. Validates paid demand long before Year-3 private label; sells via email without violating Amazon's email-link ban.

### 6–12 months (the moat)
1. **ActivityRadar is the long-term differentiator.** 196k organizations of structured local data is something AI Overviews cannot synthesize and no competitor has. Pass the WA/OR website-resolution gate test, then power `/camps/` + programmatic local pages ("youth soccer programs near Tacoma") from it. Local + tools + voice is the trifecta that survives AI search.
2. **Optimize for AI citation, not just rankings:** keep governing-body citations dense, add llms.txt, keep FAQ/HowTo schema current — niche sites now win by being the source AI answers cite.
3. **Newsletter as product:** grow Friday Letter toward sponsorship-ready scale (youth-sports brands, camps, TeamSnap-type SaaS pay for placement); email re-share is your plan's 10% traffic leg.
4. **Revenue mix target by mid-2027:** affiliate (diversified beyond Amazon) 40% · camps/directory 20% · digital products 20% · display/newsletter sponsorship 20%.

---

## 4. Subagents to build (long-term site maintenance)

You already have 10 role-based agents in `.claude/agents/`. They're personas; what's missing are **scheduled pipeline agents with concrete inputs/outputs**. Build these (as Cowork scheduled tasks or Claude Code agents):

| Agent | Cadence | Job |
|---|---|---|
| **link-health-monitor** | Weekly | Crawl all `/go/` slugs → detect 404s, out-of-stock Amazon items, redirect drift; output swap list |
| **gsc-analytics-reporter** | Weekly | GSC + GA4 digest: top queries, position movers, indexing errors, Web Vitals regressions; flags pages one position off page 1 |
| **rules-watcher** | Weekly in-season | Monitor governing bodies (Little League, USA Baseball, NFHS, US Soccer, etc.) for rule/equipment changes → draft This Season posts + flag stale articles |
| **seasonal-content-scheduler** | Monthly | Which sports enter tryout/registration windows next 60 days → refresh + re-pin + newsletter queue for those pages |
| **internal-link-proposer** | On publish | Scan each new piece → propose 3–5 links to guides/hubs/related reads; PR-style diff for approval |
| **affiliate-revenue-reconciler** | Monthly | Pull earnings across Amazon/CJ/Awin/Impact → revenue per page, dead links earning $0, network application status chase list |
| **camps-data-steward** | Weekly | Dedupe/verify camp submissions against ActivityRadar; flag expired sessions; moderation queue summary |
| **friday-letter-drafter** | Weekly (Wed) | Draft the Friday Letter from the week's publishes + seasonal moment + one archive resurface; you edit, never auto-send |
| **pinterest-publisher** | 2–3×/week | Generate pins from new/refreshed content using approved templates; maintain seasonal boards |
| **content-freshness-auditor** | Quarterly | Re-verify prices, age/size rules, and dated claims in guides + body pages; produce update punch list |

Keep jarvis-orchestrator as the coordinator; retire or merge the persona agents that overlap (billing-finance → affiliate-revenue-reconciler; qa-human-tester → link-health-monitor + preflight command).

---

## 5. Sunset vs. add

**Sunset / fold:**
- **Sanity CMS studio** — unused, markdown-first flow won; delete to reduce surface area.
- **Adaptive as a standalone collection** — your own plan says "build or fold into body." 18 pieces isn't a pillar. Fold into body/Sideline File navigation *unless* you commit a real build wave (it's also a genuine differentiator — decide, don't drift).
- **Recruiting as an investment area (for now)** — keep the 29 pages, but don't expand until the 15+ band exists; recruiting content without a high-school audience has no feeder.
- **Illustration auto-generation scripts** — if not in the regular build path, archive.
- **News collection *as currently run*** — 16 items with irregular cadence reads stale. Either the rules-watcher agent gives it a real weekly cadence, or fold updates into sport hubs.

**Add (in priority order):**
1. **15+ / high-school band** — biggest content gap, highest-spend parents, prerequisite for recruiting to matter.
2. **Age-band hubs** (`/ages/5-7/` etc.) — parents think in ages first, sports second.
3. **Local layer from ActivityRadar** — programs/camps/leagues near me. This is what makes "go-to site for youth activity" literally true; nothing else on this list is as defensible.
4. **Digital products** — script packs, first-season kits, printable season planners.
5. **Wrestling + track/XC + girls-lacrosse article depth** — already scoped in July plan; finish it.
6. **Community layer (later, 2027)** — moderated Q&A or a "sideline stories" submission loop; UGC deepens the moat but only after the legal/terms foundation is done.

---

## 6. The one-paragraph verdict

The site is a genuinely strong product with near-zero distribution. Nothing in the codebase is the bottleneck — the bottleneck is that no one can find it and you can't currently measure who does. The July priorities in order: GSC access, email drip, internal links, affiliate network activation, Pinterest, and seriously consider moving the author reveal up — it unlocks every authority channel at once. Long term, articles get commoditized by AI search; the calculator, the calendars, the ActivityRadar local data, and your voice are what make this the go-to youth activity site. Invest accordingly.
