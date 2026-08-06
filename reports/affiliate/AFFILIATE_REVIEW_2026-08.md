# Affiliate Revenue & Network Review — August 2026

Run by: pcd-affiliate-reconciler (automated, monthly on the 2nd — this run executed 2026-08-03)
Lane: revenue and network reconciliation only. Broken/dead/out-of-stock link fixes belong to pcd-link-health-monitor (Mondays) and pcd-affiliate-replacement-sourcer (Tuesdays) — see "Excluded from this review" at the bottom.

---

## 1. Network status

Source: `AFFILIATE_NETWORKS_TO_APPLY.md` (last updated 2026-06-11) and `reports/affiliate/NETWORK_FOLLOWUPS_2026-07-04.md`. No file in the repo shows a status change on any pending application since 7/4 — a targeted search of top-level docs and `reports/affiliate/*.md` for network names turned up nothing newer. Treat "pending" below as the last-confirmed state; if Jeff has heard back from any of these since, the file is stale and should be corrected by hand.

| Network / merchant | Status | Applied | Days pending (as of 8/3) |
|---|---|---|---|
| Amazon Associates | **LIVE** | — | tag `parentcoachpl-20`, 245 slugs in `affiliates.json` |
| CJ Affiliate (network account) | **LIVE** | — | website ID 101798499 |
| SoccerGarage (via CJ) | **LIVE** | — | 4 slugs live; deep linking still not enabled (email pending to Brian Yossef, affiliate@soccergarage.com) |
| Bookshop.org | **LIVE** | — | 10% commission, 48-hr cookie, Stripe Connect payout at $20 min |
| Dick's Sporting Goods (via CJ) | Pending | ~6/9 | **55 days** |
| GameChanger (via CJ) | Pending | ~6/9 | **55 days** |
| Columbia Sportswear (via CJ) | Pending | 6/10 | **54 days** |
| Easton Sports (via CJ) | Pending | 6/10 | **54 days** |
| Nike apparel (via CJ) | Pending | 6/10 | **54 days** |
| Impact Radius (network account) | Pending | 6/11 | **53 days** |
| Awin (network account) | Pending | 6/11 | **53 days** |
| FlexOffers (network account) | In review | 6/11 | **53 days** |
| TeamSnap (via FlexOffers) | Not yet applied | — | blocked on FlexOffers approval |
| Avantlink | Not yet applied | — | — |

**9 applications are pending more than 30 days** (all 5 CJ merchant applications plus Impact, Awin, and FlexOffers).

---

## 2. Follow-ups needed

A full set of follow-up drafts already exists in `reports/affiliate/NETWORK_FOLLOWUPS_2026-07-04.md`, generated exactly 30 days ago. That file's own header confirms **nothing was sent** — "these are drafts only... no messages have been submitted." So every application below is now overdue for a *second* nudge, not a first.

Rather than duplicate all nine drafts here, the recommendation is: reuse the 7/4 drafts as-is (they're still accurate — applicant name, site description, and dates are all unchanged), but swap the framing from "checking in" to "second follow-up" since roughly a month has passed with no reply to the first. One updated example below; the same edit applies to all nine in the 7/4 file.

> **Subject: Second follow-up — pending publisher application, Parent Coach Desk**
>
> Hi [Network] team,
>
> I wrote in on [original date] and again wanted to check in — it's now been about [55/54/53] days without a response. Parent Coach Desk (parentcoachdesk.com) is a youth-sports parenting site with 1,700+ pieces of content across 26 sports, including dedicated gear guides per sport aimed at parents actively shopping for gear. All affiliate links carry rel="sponsored" and the site follows FTC disclosure requirements throughout.
>
> If there's anything blocking the review on my end, I'm happy to provide it. Otherwise just a nudge to see where this stands. Thanks for your time.
>
> Jeff Thomas
> parentcoachdesk.com

**Nothing has been sent on Jeff's behalf.** Drafts only — send manually through each network's own contact/message system, same as noted in the 7/4 file.

---

## 3. Dashboard check — clicks/earnings

### Amazon Associates — checked live via Claude in Chrome (Jeff was logged in)

Calendar month of July 2026 (Jul 1–31), tag `parentcoachpl-20`, all tracking IDs:

| Metric | Value |
|---|---|
| Clicks | 619 |
| Ordered items | 1 |
| Conversion | 0.16% |
| Ordered revenue | $18.99 |
| Shipped items | 0 |
| Total earnings (July) | **$0.00** |

Trailing 30 days (Jul 4–Aug 2) for comparison: 627 clicks, 1 ordered item, $18.99 ordered revenue, $0.85 total earnings (the 1 order shipped in early August, outside the July window — that's the only difference between the two figures).

**Data limitation:** the "Group By: Linked Product" report returned "No data found" for both windows. The site sends 100% of Amazon traffic through a single tracking ID (`parentcoachpl-20`), so Amazon's own dashboard cannot break clicks or earnings down by slug/campaign — it only has one bucket. That means I can't produce a real top-10-earning-slugs list or a clicks-with-$0 list from Amazon's side this cycle; the numbers above are the whole site's Amazon performance, undifferentiated.

**Recommendation:** either (a) set up per-product or per-category Amazon sub-tracking IDs (Amazon supports up to 100 tracking IDs per account) so this report can actually rank slugs next month, or (b) pull the equivalent breakdown from Google Analytics/Plausible filtered on `utm_medium=affiliate` + `utm_campaign`, which does carry the per-slug `campaign` field already set in `affiliates.json`. Right now neither is wired into this automated run — Plausible/GA wasn't in scope for this task and wasn't checked.

### CJ Affiliate — not accessible this run

Chrome navigated to `members.cj.com/member/publisher/home` and landed on the CJ login screen — Jeff is not currently logged in, so no dashboard data could be pulled. Per standing rules I did not attempt to log in.

**Manual checklist for Jeff** (CJ dashboard → Publisher → Reports, filter to July 1–31 2026, website ID 101798499):
- [ ] SoccerGarage: clicks, orders, commission earned (4 live slugs: `soccer-goalie-gloves-youth`, `soccer-clearance-cleats`, `soccer-coupon-10-off-100`, `soccer-garage-shop`)
- [ ] Confirm no other CJ merchants have gone live/started paying out (the 5 pending applications above shouldn't be generating anything yet, but worth a glance)

---

## 4. Revenue swap candidates

This section is intentionally short this cycle — the data needed to do it properly isn't available yet (see limitation above). What I can say:

- **Top 10 earning slugs:** cannot be produced. Amazon's dashboard has no per-slug breakdown (single tracking ID), and CJ wasn't accessible. Whole-site Amazon earnings for July were $0.00 against 619 clicks, so even the site-wide picture is thin this month.
- **Clicks with $0 (swap candidates):** cannot be identified at the slug level for the same reason. If Plausible/GA UTM data is available outside this run, filtering `utm_medium=affiliate` by `utm_campaign` and cross-referencing against zero Amazon conversions would surface these — flagging for a future run or for Jeff to check directly.
- **Amazon items with a live CJ merchant carrying the same item at a better rate:** none identified. The only merchant that's actually live on CJ besides the network itself is SoccerGarage, and its 4 live slugs (goalie gloves, clearance cleats, coupon, shop link) don't duplicate any Amazon-listed product in `AFFILIATE_MASTER_LIST.md` — they're SoccerGarage-specific SKUs, not the same items sold both places. No revenue swap is actionable until Dick's, Columbia, Easton, Nike, or GameChanger actually clear CJ review — all five are still pending (see Section 1).

Bottom line: the highest-leverage thing this review turned up isn't a swap, it's a measurement gap. Until either sub-tracking IDs go into Amazon or analytics UTM data gets pulled into this pipeline, "top earner" and "$0-click" lists are guesses, not findings — so none are reported here.

---

## 5. Excluded from this review (owned by other lanes)

Per the lane split, broken/dead/out-of-stock links are not this report's job. The following slugs are mid-repair in `reports/affiliate/REPLACEMENTS_2026-07-28.md` and were left alone here even though they're technically "$0 earners" — they're link-health issues, not rate/revenue issues:

- `wrestling-headgear`
- `hockey-pads-starter`
- `basketball-shoes-youth`
- `gymnastics-slippers-youth`
- `lacrosse-shoulder-pads-youth`

`lifecycle.json`'s `healthIncidents` queue is currently empty (no additional open incidents beyond the above as of this run).

---

## Action items for Jeff

1. Send (or approve sending) the 9 second-follow-up emails — see Section 2. None have been sent by the agent.
2. Log into CJ so next month's run can pull real numbers — CJ was not accessible this run.
3. Decide on Amazon sub-tracking IDs vs. relying on GA/Plausible UTM data for per-slug attribution — right now neither is available to this pipeline, which is why Section 4 came back mostly empty.
4. No orders, payout settings, or applications were touched — this run only read dashboards and wrote this report.
