# Affiliate Revenue & Network Review — September 2026

Run by: pcd-affiliate-reconciler (monthly, on the 2nd — this run executed 2026-09-02, after a failed automated attempt earlier the same day: the project-folder mount errored out with no user present to approve it, so the scheduled run produced nothing. Re-run manually once Jeff was in the session.)

Lane: revenue and network reconciliation only. Broken/dead/out-of-stock link fixes belong to pcd-link-health-monitor (Mondays) and pcd-affiliate-replacement-sourcer (Tuesdays) — see "Excluded from this review" at the bottom.

---

## 1. Network status

Source: `AFFILIATE_NETWORKS_TO_APPLY.md` (still shows "Last updated 2026-06-11" — unchanged since last cycle, meaning no new information has reached the repo about any of these nine applications since June).

| Network / merchant | Status | Applied | Days pending (as of 9/2) |
|---|---|---|---|
| Amazon Associates | **LIVE** | — | tag `parentcoachpl-20` |
| CJ Affiliate (network account) | **LIVE** | — | website ID 101798499 |
| SoccerGarage (via CJ) | **LIVE** | — | 4 slugs live; deep linking still not enabled (email still pending to Brian Yossef) |
| Bookshop.org | **LIVE** | — | 10% commission, 48-hr cookie |
| Dick's Sporting Goods (via CJ) | Pending | ~6/9 | **85 days** |
| GameChanger (via CJ) | Pending | ~6/9 | **85 days** |
| Columbia Sportswear (via CJ) | Pending | 6/10 | **84 days** |
| Easton Sports (via CJ) | Pending | 6/10 | **84 days** |
| Nike apparel (via CJ) | Pending | 6/10 | **84 days** |
| Impact Radius (network account) | Pending | 6/11 | **83 days** |
| Awin (network account) | Pending | 6/11 | **83 days** |
| FlexOffers (network account) | In review | 6/11 | **83 days** |
| TeamSnap (via FlexOffers) | Not yet applied | — | blocked on FlexOffers |
| Avantlink | Not yet applied | — | — |

**Straight talk:** these same 9 applications have now been "pending" for three consecutive monthly cycles (55–83 days in the August review, 83–85 days now). Nothing in the repo shows a single reply, rejection, or status change from any network in nearly three months. At this point "pending" is being used generously — five CJ merchant apps and two network-level apps (Impact, Awin) going 12 weeks with zero response is not normal review latency, it's very likely a dead application that needs a different approach, not a third polite nudge.

---

## 2. Follow-ups needed

Two rounds of drafts already exist and — per the August review's own finding — **neither round was actually sent.** `NETWORK_FOLLOWUPS_2026-07-04.md` produced the first-follow-up drafts; the August review recommended re-sending those as a "second follow-up." There is still no evidence in the repo that any message has gone out on any of the 9 applications.

Recommendation this cycle: stop drafting a fourth near-identical email. Two things instead:

1. **Escalate off email.** Three of these — Dick's, Columbia, Nike — are large enough brands to have an affiliate manager reachable by phone or LinkedIn, not just a CJ contact-advertiser form. A form message that's been ignored twice isn't going to work a third time the same way.
2. **Triage which ones are worth chasing at all.** GameChanger and TeamSnap don't sell gear — they're team-management software, lower priority than the 5 gear merchants. If bandwidth is limited, put the chase effort into Dick's, Columbia, Easton, Nike, and Impact (which gates Dick's and BSN both), and let GameChanger/TeamSnap ride.

One representative third-touch draft (same edit applies to all — swap network name/date):

> **Subject: Following up again — publisher application status, Parent Coach Desk**
>
> Hi [Network] team,
>
> I've now written in twice about this application (originally [original date], and again in early August) without a response — it's been about 12 weeks. Parent Coach Desk (parentcoachdesk.com) is a youth-sports parenting site with 1,700+ pieces of content across 26 sports, with per-sport gear guides aimed at parents actively shopping for gear. All affiliate links carry rel="sponsored" and the site follows FTC disclosure requirements.
>
> If the application was declined or needs something from me, I'd rather know that than keep waiting. Otherwise, one more nudge to see where this stands. Thanks.
>
> Jeff Thomas
> parentcoachdesk.com

**Nothing has been sent on Jeff's behalf** — draft only, per standing rule.

---

## 3. Dashboard check — clicks/earnings

**Not accessible this run.** Two browser paths were tried:

- The built-in browser pane: not logged in to Amazon (landed on the sign-in page).
- Claude in Chrome (the extension that reached Jeff's logged-in Amazon session last month): no tab group / no connected session available in this run.

CJ was not attempted separately since the same access gap applies.

**Manual checklist for Jeff** (pull these when convenient, doesn't need to be today):

- [ ] Amazon Associates dashboard → Reports → date range Aug 1–31 2026, tag `parentcoachpl-20`: clicks, ordered items, ordered revenue, total earnings
- [ ] CJ dashboard → Publisher → Reports, filter to Aug 1–31 2026, website ID 101798499: SoccerGarage clicks/orders/commission (4 live slugs: `soccer-goalie-gloves-youth`, `soccer-clearance-cleats`, `soccer-coupon-10-off-100`, `soccer-garage-shop`)
- [ ] Confirm no other CJ merchants have gone live/started paying out

**Unresolved from last cycle:** the August review flagged that Amazon's dashboard can't break earnings down by slug because the whole site runs through a single tracking ID, and recommended either (a) setting up Amazon sub-tracking IDs (up to 100 available) or (b) wiring Plausible/GA UTM data (already present as `campaign` in `affiliates.json`) into this pipeline. Neither has happened. This is now blocking a real "top 10 earning slugs" and "clicks-with-$0" analysis for the second month running — see Section 4.

---

## 4. Revenue swap candidates

Same measurement gap as August, now compounded by not even having this month's whole-site Amazon numbers (see Section 3). Until per-slug attribution exists, any "top earner" or "$0-click" list here would be a guess dressed up as a finding, so none are reported.

**Amazon items with a live CJ merchant carrying the same item at a better rate:** none. SoccerGarage is still the only merchant actually live on CJ besides the network account, and its 4 slugs don't duplicate any Amazon-listed product. No revenue swap is actionable until at least one of Dick's/Columbia/Easton/Nike/GameChanger clears CJ review — see Section 1 on why that's now in question.

**Bottom line, unchanged from last month and getting more urgent:** the highest-leverage move here isn't a swap, it's fixing the measurement gap. Recommend picking (a) or (b) from Section 3 in the next two weeks rather than letting a third review cycle pass with no per-slug data.

---

## 5. Excluded from this review (owned by other lanes)

Per the lane split, broken/dead/out-of-stock links are not this report's job. As of `reports/affiliate/REPLACEMENTS_2026-08-27.md` (the most recent replacement-sourcer output), the following slugs are mid-repair and were left alone here even though several are technically $0 earners:

- `tennis-racquet-junior` — proposed swap pending Jeff's approval
- `foam-roller-medium` — proposed swap pending approval, card copy also needs a density-claim fix
- `football-cup-shorts-youth` — proposed swap pending approval, card copy needs a "cup sold separately" fix
- `soccer-shin-guards-ankle-youth` — proposed swap pending approval
- `multi-sport-socks-crew` — same product, confirmed back in stock, just needs to be cleared from the queue
- `hockey-helmet-youth` — retire-recommended, no adequate youth-size replacement found
- `soccer-goalie-gloves-youth` — left open, SoccerGarage site timed out twice; also needs a real CJ deep link once a product is picked, not just a product URL

`lifecycle.json`'s `healthIncidents` queue is empty; the items above live in the separate link-health `replacement-queue.json`, not that queue.

**Also worth flagging, outside this report's lane but relevant:** the 8/27 replacement-sourcer report notes its own scheduled task went silent for two weekly cycles (missed 8/18 and 8/25) due to what looks like a scheduler registration gap, and that the same pattern hit five other PCD weekly tasks. This run of pcd-affiliate-reconciler itself failed its first (automated) attempt today for an unrelated reason — a folder-mount permission call that had nobody to answer it. Two independent automation failures in the same window is worth a look at the scheduler, not just a coincidence to shrug off.

---

## Action items for Jeff

1. Decide: keep drafting polite email nudges to the 9 pending networks, or escalate the higher-value ones (Dick's, Columbia, Nike, Impact) off email. 12 weeks of silence on 9 applications says the current approach isn't working.
2. Log into Amazon Associates and/or CJ in the session Claude in Chrome uses, so next month's run can actually pull numbers — two cycles now with no dashboard access.
3. Pick sub-tracking IDs or GA/Plausible UTM wiring for per-slug attribution — this has been recommended twice and not done; Section 4 stays empty until it is.
4. No orders, payout settings, or applications were touched — this run only read files, attempted (and logged) dashboard access, and wrote this report.
