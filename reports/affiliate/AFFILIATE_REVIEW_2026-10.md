# Affiliate Revenue & Network Review — October 2026

**Summary:** No revenue numbers this cycle (dashboards not read; never invent $); 9 network apps still silent at 113–115 days; catalog 253 slugs; Friday Letters Amazon-clean; 16 pillar pages with `/go/` lack BuyingGuideDisclosure — 11 `needs_you` for December close. Maintenance mode: no Class B follow-up/swap drafts.

Run by: Hal / pcd-affiliate-reconciler (S6 monthly, day 2 — executed 2026-10-02 PT on DESKTOP).
Lane: revenue and network reconciliation only. Broken/dead/out-of-stock fixes belong to Linda (S5 Mon) and Arnie (Tue sourcer).
Governance: `src/data/affiliate-governance.json` respected — no `affiliates.json` edits, no deploy, no account actions, no fabricated revenue.
Agent-run log: skipped — `PCD_AGENT_RUNS_TOKEN` not available in runtime secrets this session.

---

## 1. Network status

Source: `AFFILIATE_NETWORKS_TO_APPLY.md` (still "Last updated 2026-06-11" — **no status change recorded in the repo since June**), cross-checked against September review and live `src/data/affiliates.json` (253 slugs: Amazon 234, SoccerGarage/CJ 4, Bookshop.org 13, Shutterfly 1, Square 1).

| Network / merchant | Status | Applied | Days pending (as of 10/2) |
|---|---|---|---|
| Amazon Associates | **LIVE** | — | tag `parentcoachpl-20` |
| CJ Affiliate (network account) | **LIVE** | — | website ID 101798499 |
| SoccerGarage (via CJ) | **LIVE** | — | 4 slugs; deep linking still not enabled |
| Bookshop.org | **LIVE** | — | 10% commission, 48-hr cookie |
| Dick's Sporting Goods (via CJ) | Pending | ~6/9 | **115 days** |
| GameChanger (via CJ) | Pending | ~6/9 | **115 days** |
| Columbia Sportswear (via CJ) | Pending | 6/10 | **114 days** |
| Easton Sports (via CJ) | Pending | 6/10 | **114 days** |
| Nike apparel (via CJ) | Pending | 6/10 | **114 days** |
| Impact Radius (network account) | Pending | 6/11 | **113 days** |
| Awin (network account) | Pending | 6/11 | **113 days** |
| FlexOffers (network account) | In review | 6/11 | **113 days** |
| TeamSnap (via FlexOffers) | Not yet applied | — | blocked on FlexOffers |
| Avantlink | Not yet applied | — | — |

**Straight talk (delta from September):** same 9 applications, now four consecutive monthly cycles with zero repo evidence of a reply, rejection, or status change (~12 weeks in Sept → ~16 weeks now). "Pending" is no longer a useful label for most of these — treat as dead-or-stalled applications that need a different channel in December, not another polite form message.

`AFFILIATE_PENDING_FROM_JEFF.md` remains fully resolved (last updated 2026-06-11); no new Jeff pick-holds.

---

## 2. Follow-ups (maintenance mode → December `needs_you`)

Per Hal skill / manual §3.4 (Aug–Nov): **no new Class B follow-up drafts this run.** Existing drafts in `NETWORK_FOLLOWUPS_2026-07-04.md` and the third-touch template in the September review still stand; there is still **no evidence any message was sent**.

Parked for **December close** (do not queue Slack Class B drafts now):

1. Escalate high-value apps off email: Dick's, Columbia, Nike, Impact (phone / LinkedIn affiliate manager).
2. Triage: GameChanger + TeamSnap are team-software, lower priority than gear merchants.
3. Confirm FlexOffers / Awin portal status in-dashboard before writing anything else.
4. SoccerGarage deep-link enable request to Brian Yossef (`affiliate@soccergarage.com`) — still open since June.

---

## 3. Dashboard check — clicks / earnings

**Not pulled this run.** No logged-in Amazon Associates or CJ Chrome session was used. Per SOURCE RULE: no estimates, no invented figures.

**Historical honesty (from prior reports on file):**
- August review (July 2026 Amazon, live Chrome): 619 clicks, 1 ordered item, $18.99 ordered revenue, **$0.00 July earnings**; trailing ~30d showed **$0.85** once that order shipped in early August.
- September review: dashboards inaccessible; no numbers recorded.
- **No month on file has recorded meaningful affiliate revenue.** Saying that plainly is the point of the metric.

**Manual checklist for Jeff** (`needs_you` — pull when convenient):

- [ ] Amazon Associates → Reports → **Sep 1–30 2026**, tag `parentcoachpl-20`: clicks, ordered items, ordered revenue, shipped items, **total earnings**
- [ ] CJ → Publisher → Reports → **Sep 1–30 2026**, website ID `101798499`: SoccerGarage clicks / orders / commission (slugs: `soccer-goalie-gloves-youth`, `soccer-clearance-cleats`, `soccer-coupon-10-off-100`, `soccer-garage-shop`)
- [ ] Confirm no other CJ merchants went live or started paying
- [ ] Bookshop.org affiliate dashboard → Sep 2026 clicks / earnings (13 live slugs)
- [ ] Optional: also pull **Aug 1–31** Amazon + CJ if September's checklist was never filled (still open from last cycle)

**Measurement gap (repeat, third+ cycle):** single Amazon tracking ID `parentcoachpl-20` still blocks per-slug ranking. Until (a) Amazon sub-tracking IDs or (b) GA/Plausible `utm_campaign` wiring into this report, Sections 4's top-10 and $0-click lists stay empty by design.

---

## 4. Revenue lists (honest empties + Dec park)

| List | October status |
|---|---|
| Top 10 earning slugs | **None reportable** — no Sep dashboard numbers; no per-slug Amazon attribution |
| Clicks + $0 (swap candidates) | **None reportable** — same measurement gap; parked as Dec `needs_you`, not active swap proposals |
| Amazon items a live CJ merchant carries at better rate | **None** — SoccerGarage remains the only live CJ merchant; its 4 slugs do not duplicate Amazon product destinations |

Highest-leverage move is still measurement + clearing stalled network apps, not link swaps.

---

## 5. Disclosure pass

**Friday Letters (Amazon rule):** scanned all drafts under `reports/friday-letters/` including `FRIDAY_LETTER_2026-10-02.md`. **Zero Amazon / Associates / `/go/` links in email bodies.** Clean. (One file mentions "amazon" only inside its own compliance note saying the scan was clean.)

**Site pages:**
- `/what-to-buy/[slug]/` guides: `BuyingGuideDisclosure` is injected above body — OK (body markdown without the sentence is fine).
- Articles / coaching-tips: layout injects disclosure when body contains `/go/` — OK per `COMPLIANCE_AUDIT_2026-06.md`.
- Site footer still carries Amazon Associate language — backstop only.
- **`needs_you` — pillar disclosure gap:** `src/pages/pillar/[slug].astro` does **not** render `BuyingGuideDisclosure`. **16** live pillar files contain `/go/` links and rely only on the footer:

  - ultimate-parent-guide-ballet, band, baseball, basketball, cheer, choir, dance, football, gymnastics, hockey, lacrosse, soccer, softball, swimming, volleyball, wrestling

  FTC / Associates expectation is clear disclosure **before** the first affiliate link. Footer-after is not enough. Fix is a one-line layout change (conditional on `/go/` in body), same pattern as ArticleLayout — owner edit, not Hal.

---

## 6. Excluded (other lanes)

Link health / replacements not owned here. Last noted mid-repair items from Sept (still not this report's job): tennis-racquet-junior, foam-roller-medium, football-cup-shorts-youth, soccer-shin-guards-ankle-youth, multi-sport-socks-crew, hockey-helmet-youth, soccer-goalie-gloves-youth. BabyLove insert continues under governance exception (`babylove-insert-log.json` active through 2026-09-30).

---

## 7. Action items / `needs_you` (11)

1. Pull Amazon Associates Sep 2026 totals (tag `parentcoachpl-20`).
2. Pull CJ Sep 2026 SoccerGarage totals (website ID 101798499).
3. Confirm no new CJ merchants live/paying.
4. Pull Bookshop.org Sep 2026 totals.
5. Fill Aug Amazon/CJ checklist if still blank from last cycle.
6. December: escalate Dick's / Columbia / Nike / Impact (113–115d silence) — stop stacking email clones.
7. December: triage drop/hold on GameChanger + TeamSnap chase priority.
8. December: check FlexOffers + Awin portal status in-dashboard.
9. Wire per-slug attribution (Amazon sub-IDs **or** GA/Plausible UTM into reconcile).
10. Add `BuyingGuideDisclosure` to `pillar/[slug].astro` when body has `/go/` (16 pages).
11. SoccerGarage deep-link enable (Brian Yossef) — still open.

**Not done this run (by design):** no orders, payout changes, applications, `affiliates.json` edits, deploys, or invented revenue.

---

## Catalog snapshot (2026-10-02)

| Retailer | Slug count |
|---|---|
| Amazon | 234 |
| Bookshop.org | 13 |
| SoccerGarage (CJ) | 4 |
| Shutterfly | 1 |
| Square | 1 |
| **Total** | **253** |
