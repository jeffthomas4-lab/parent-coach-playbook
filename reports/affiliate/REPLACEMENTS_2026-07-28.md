# Affiliate Replacement Report — 2026-07-28

Run by: pcd-affiliate-replacement-sourcer (Arnie)
Source queue: reports/link-health/replacement-queue.json (generated_at 2026-07-27, from LINK_HEALTH_2026-07-27.md — fresh, no fallback needed)

This run picks up where an earlier attempt today left off blocked on Claude in Chrome being unavailable. Chrome came back for this run and 4 of the 5 open items got full two-tier browser validation and a proposed replacement. The 5th (lacrosse shoulder pads) has a strong lead but Chrome went unresponsive again before it could be confirmed, so it stays open per the no-unconfirmed-ASIN guardrail.

Governance/lifecycle check: all 5 open items are unowned and clear to source — none sit in `needReviewBeforeResearch`, `editorialApproval`, `revenueReconciliation`, or `healthIncidents` in `reports/affiliate/lifecycle.json`; all 5 offer records show `lifecycleState: legacy_offer_unclassified` / `nextAction: research_and_map_product`, which does not block sourcing.

## Proposed replacements — PENDING JEFF REVIEW (4)

### wrestling-headgear
- Old: `https://www.amazon.com/dp/B003BSRB3U?tag=parentcoachpl-20` (dead, Page Not Found)
- New: **Cliff Keen Youth Signature Headgear (YE58), Black** — ASIN `B07GZX6Y6S`, $32.99, 4.3★ (220 ratings)
- Why: same brand as the existing on-page card, correct category, clears the rating bar. Only 2 left in stock at check time, worth a heads-up. The runner-up lead from a prior session (Cliff Keen Tornado Headgear, B0DCWVPVBP) is now itself a dead ASIN, so there's no backup in hand if this one sells out.
- Named card: `src/content/guides/wrestling.md` names "Cliff Keen youth wrestling headgear" — brand already matches, **no copy update needed**.

### hockey-pads-starter
- Old: `https://www.amazon.com/dp/B0CQTM2SBD?tag=parentcoachpl-20` (resolves to an unrelated, also-unavailable grip-tape accessory)
- New: **Winnwell Youth Cleansport NXT Hockey Pad and Bag Starter Kit** — ASIN `B07KFV9MFL`, $219.99, 4.4★ (172 ratings)
- Why: full 6-piece kit (shoulder/elbow/shin pads, gloves, pants, bag) matching the starter-kit intent, in stock, clears the bar comfortably. The PowerTek 6-Piece Starter Set (B01M08BM2D) was checked first and rejected — unavailable and only 3.2★/8 ratings.
- Price flag: $219.99 is a full boxed kit with bag, not a small accessory — no apples-to-apples price history exists on the old (already broken) listing, but worth noting this is a real spend, not an impulse buy.
- Named card: **NOTE — on-page card at `src/content/guides/hockey.md` names "Bauer Prodigy youth hockey starter kit."** The proposed replacement is Winnwell, a different brand. **Copy update needed** if this swap ships. No bundled Bauer Prodigy starter kit exists for sale on Amazon at all right now — Bauer only sells individual pad pieces there.

### basketball-shoes-youth
- Old: `https://www.amazon.com/dp/B0F14NVK54?tag=parentcoachpl-20` (Nike Giannis Immortality 4 — correct product, but out of stock indefinitely)
- New: **Nike Unisex Kids' Team Hustle D 12 Basketball Shoes** — ASIN `B0F14PHJCY`, $67.00, 4.6★ (835 ratings), Big Kid sizes available
- Why: Nike's dedicated kids basketball shoe line, in stock, clears the bar comfortably. Two other candidates were rejected: the Team Hustle D 12 Blue Void colorway (B0G2ZJR5WQ) had 0 reviews and 1 left in stock; Nike Air Force 1 LE Big Kid (B08XB5HKT9) is in stock and 4.4★ but only 40 ratings — fails the 100-rating floor.
- Named card: none of the three placements (`basketball.md`, `ultimate-parent-guide-basketball.md`, `youth-basketball-equipment-guide.md`) name a specific brand or model — copy is brand-agnostic ("Youth basketball shoes," "any major brand works"). **No copy update needed.**

### gymnastics-slippers-youth
- Old: `https://www.amazon.com/dp/B0GC3TTFQN?tag=parentcoachpl-20` (Sooneeya cheer shoes — in stock but wrong product entirely)
- New: **Capezio Daisy (205C) Ballet Shoe — Child** — ASIN `B0DQYG586R`, $20.00, 4.5★ (5,185 ratings), "Overall Pick," 100+ bought in the past month
- Why: same brand as all three on-page cards, in stock, clears the bar with room to spare. A much better match than the cheer-shoe mismatch it's replacing.
- **Construction caveat (read before approving):** the on-page copy on all three placements specifically describes a *split-sole canvas* slipper with *pre-sewn elastic* — a lighter, more flexible shoe. The Daisy 205C is a **full-sole leather** shoe with a drawstring + elastic. Same brand, different construction than what the copy promises. Two options: (a) approve this swap and update the copy's construction details, or (b) ask for a split-sole canvas Capezio alternative — I spotted "Capezio Hanami Ballet Athletic Shoe" (~4.5★/986 ratings) as a lead but did not get to browser-validate it this run.
- Named card: `src/content/guides/gymnastics.md` ("Capezio youth gymnastics slippers"), `src/content/guides/ballet.md` and `src/content/guides/dance.md` (both "Capezio youth ballet slippers") — brand matches all three, but construction detail in the copy will need a look regardless.

## Left open — awaiting browser validation (1)

### lacrosse-shoulder-pads-youth
- Old: `https://www.amazon.com/dp/B0DFWMZJRS?tag=parentcoachpl-20` (generic elbow sleeves — wrong product)
- Status: still `open`, no ASIN proposed.
- What happened: both Maverik candidates carried over from a prior session were checked and rejected — Maverik Charger/Windy City-style pad (B01M3126TY, now redirects to B0CSVVGQG6) and Maverik MX Lacrosse Shoulder Pads 2025 (B0CSW846Q2) are both live, ~$85, but each has **0 customer reviews** and only 1 unit in stock — fails the rating floor outright. A promising lead turned up next: **STX Lacrosse Stallion 75 Shoulder Pad**, showing as "#1 Top Rated" / "Overall Pick" for youth lacrosse shoulder pads, 4.6★ (276 ratings), $54.99 — but Claude in Chrome went unresponsive (timed out, then stopped answering entirely) before its ASIN could be captured or any of the four required checks (live page, in stock, product match, rating readout) could be completed.
- Per the standing guardrail, no ASIN gets proposed without a live browser confirmation, so this stays open rather than guessing.
- **Next run should check the STX Stallion 75 lead first** — it looks strong on paper (well-known youth lacrosse brand, best-seller badge, solid rating count) but needs the actual product-page check.
- Named card: `src/content/guides/lacrosse-boys.md` names "Maverik Windy City youth shoulder pads" specifically. If STX ends up being the pick, the copy needs a full brand rewrite, not just a model-name tweak.

## Retire-recommended
None this run.

## Skipped for governance/lifecycle ownership
None — all 5 items are unowned and were clear to work.

## Ready-to-apply diff (for the 4 proposed swaps only — do NOT apply until Jeff approves)

```diff
--- a/src/data/affiliates.json
+++ b/src/data/affiliates.json
@@ wrestling-headgear @@
-  "destination": "https://www.amazon.com/dp/B003BSRB3U?tag=parentcoachpl-20"
+  "destination": "https://www.amazon.com/dp/B07GZX6Y6S?tag=parentcoachpl-20"
@@ hockey-pads-starter @@
-  "destination": "https://www.amazon.com/dp/B0CQTM2SBD?tag=parentcoachpl-20"
+  "destination": "https://www.amazon.com/dp/B07KFV9MFL?tag=parentcoachpl-20"
@@ basketball-shoes-youth @@
-  "destination": "https://www.amazon.com/dp/B0F14NVK54?tag=parentcoachpl-20"
+  "destination": "https://www.amazon.com/dp/B0F14PHJCY?tag=parentcoachpl-20"
@@ gymnastics-slippers-youth @@
-  "destination": "https://www.amazon.com/dp/B0GC3TTFQN?tag=parentcoachpl-20"
+  "destination": "https://www.amazon.com/dp/B0DQYG586R?tag=parentcoachpl-20"
```

All four swaps are **PENDING JEFF REVIEW**. Nothing has been written to `affiliates.json`; the diff above is for Jeff to copy in by hand once approved. `reports/link-health/replacement-queue.json` has been updated with these proposals and the still-open lacrosse item as the handoff ledger, per the standing process.

## Next steps for Jeff
1. Review and, if approved, apply the 4 diffs above to `affiliates.json`.
2. Decide on the gymnastics-slippers-youth construction question (accept the leather Daisy 205C + copy edit, or hold for a split-sole canvas alternative).
3. Update the hockey-pads-starter and lacrosse-boys.md (if applicable) card copy to match whichever brand actually ships.
4. Next Arnie run: check the STX Lacrosse Stallion 75 Shoulder Pad lead first for the still-open lacrosse-shoulder-pads-youth slug.
