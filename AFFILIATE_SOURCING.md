# Affiliate sourcing — what we get from where

Updated 2026-06-10, the day SoccerGarage.com (CJ Affiliate) went live alongside Amazon Associates.

## The decision rules

**Rule 1: Amazon is the default.** Prime trust converts better than any niche retailer, and most gear-card purchases are commodity items under $40 (balls, cones, socks, tape, bottles, shin guards). A 3% commission that converts beats a 7% one that doesn't.

**Rule 2: A specialty retailer takes a slot only when the specialty is the point.** Fit-critical and selection-critical purchases: cleat walls with real size runs, junior-cut keeper gloves, NFHS match balls. The card should say why the specialty shop wins, in plain words a parent can check.

**Rule 3: Never send a parent to a thin shelf.** Before any retailer gets a slot, count page-one products in the exact category we'd link. Under ten current products from real brands, no link. This rule killed SoccerGarage's other-sports pages (see audit below).

**Rule 4: One retailer per card.** No "also available at" stacking. Pick the winner for that slot and stand behind it.

**Rule 5: Coupon and clearance links earn a slot only on $100+ purchase moments.** A 10%-off-$100 coupon is real money on a teenager's cleat restock and noise on a $12 sock purchase.

**Rule 6: Disclosure follows the retailer.** Amazon cards carry the Associates statement. Every non-Amazon card carries the inline "Partner link" note pointing at /disclosure/. The guide-top disclosure line names every retailer linked on that page.

**Rule 7: Tracked-network links ship as provided.** No UTMs on Amazon links (Operating Agreement) and none on CJ click URLs (the redirector ignores foreign params). Per-slot tracking rides Amazon's ASIN-level reporting and CJ's `?sid=` parameter, which carries our campaign name.

## Current assignments

| Retailer | Program | Gets | Why |
|---|---|---|---|
| Amazon | Associates, tag parentcoachpl-20 | Everything not listed below | Conversion, returns, Prime |
| SoccerGarage.com | CJ, advertiser 2061630, 7% base | Soccer: junior GK gloves, clearance cleats, 10%-off-$100 coupon, generic shop link | Soccer-specialty depth: 33 pages of youth cleats, 16-product junior glove wall |

SoccerGarage slugs in affiliates.json: `soccer-goalie-gloves-youth`, `soccer-clearance-cleats`, `soccer-coupon-10-off-100`, `soccer-garage-shop`. All four destinations verified live with cjevent tracking on 2026-06-10. CJ website ID 101798499 (Parent Coach Desk).

## SoccerGarage other-sports audit (2026-06-10)

They market baseball, basketball, field hockey, rugby, softball, and volleyball. We checked every store. Page-one product counts in the key equipment category: softball gloves 3, baseball gloves 9 (all Champion brand), basketball balls 0 and no shoes at all, volleyball 3, field hockey 4, rugby a handful plus goal posts. These are team-uniform programs with token equipment, not shops.

Verdict: SoccerGarage carries soccer for us and nothing else. The comparison numbers from their own soccer side: youth cleats 16 per page across 33 pages, shin guards 16, junior keeper gloves 16.

## The deep-linking ceiling, and the fix

SoccerGarage has not enabled publisher deep linking in CJ (the Deep Linking Only filter returns zero links). We are limited to their preset destinations: homepage, soccer-clearance.html, goalkeeping.html, and two coupon links. The category links we actually want (youth cleat wall, indoor shoes, NFHS match balls) need deep linking enabled on their side.

The ask is one email to the affiliate manager (affiliate@soccergarage.com, Brian Yossef per the welcome email). Draft lives at the bottom of this doc. When deep linking turns on, the next wave is: `soccer-cleats-youth` to /footwear-youth-soccer-shoes.html with a new card in the 8–10 section, indoor shoes to /footwear-indoor-soccer-shoes.html in the 13–14 section, and `soccer-ball-size5-match` moves from Amazon to /NFHS-Soccer-Balls.html.

## Future programs worth a look (not joined, not promised)

One specialty partner per gear-heavy sport, held to Rule 3 before anything ships: baseball/softball (a true diamond-sports retailer), hockey (skate and stick fitting is the parent pain point), lacrosse. No program gets added just because it exists; the card has to beat Amazon for the parent first.

## Email draft: deep linking request

Subject: Deep linking request — Parent Coach Desk (CJ PID 101798499)

Hi Brian,

We just joined your CJ program (Parent Coach Desk, parentcoachdesk.com, PID 101798499). We publish youth-sports buying guides for parents and we're sending our soccer gear traffic your way: keeper gloves, clearance cleats, and the 10%-off coupon are already live.

Could you enable deep linking for publishers in CJ? We want to land parents directly on your category pages (youth cleats, indoor shoes, NFHS match balls) instead of the homepage. Deep links convert better for both of us; parents shopping a specific wall bounce less than parents dropped at the front door.

Happy to share the live placements. Thanks,

Jeff Thomas
parentcoachdesk.com
