# Affiliate Replacement Proposals — 2026-07-21

Run by: pcd-affiliate-replacement-sourcer (Arnie), automated, report-only.
Source queue: `reports/link-health/replacement-queue.json` (generated 2026-07-20 by Linda, matches latest `LINK_HEALTH_2026-07-20.md` — not stale, no markdown fallback needed).

**Nothing in this report has been applied to `affiliates.json`. No deploy. Every swap below is PENDING JEFF REVIEW.**

## Governance/lifecycle check

Both open queue items were checked against `src/data/affiliate-governance.json` and `reports/affiliate/lifecycle.json`:

- Neither slug appears in `needReviewBeforeResearch`, `editorialApproval`, `revenueReconciliation`, or `healthIncidents`.
- Both slugs' lifecycle offer entries show `lifecycleState: "legacy_offer_unclassified"` / `nextAction: "research_and_map_product"` — unowned by any other stage, safe to source.
- Merchant is Amazon US (`amazon_us`) for both; governance requires `tag=parentcoachpl-20` preserved and flags `human_editorial_approval_required: true` — respected below, nothing published.

No slugs were skipped for governance/lifecycle ownership this run.

## Proposed swap 1 — PENDING JEFF REVIEW

**Slug:** `soccer-ball-size4`
**Current destination:** `https://www.amazon.com/dp/B001L3URAS?tag=parentcoachpl-20` (WILSON Traditional Soccer Ball, Size 4 — Currently unavailable, out of stock indefinitely)

**Recommended replacement:** ASIN `B007ZQWLZE` — Champion Sports Retro Soccer Ball, Size 4, Black/White — **$10.99**

Why this fits: classic black-and-white traditional design (same look as the original), official size and weight, and the listing itself states "ideal for players ages 8 to 12" — a direct match to the product intent. Amazon's Choice badge, 4.4 stars across 3,400 ratings, In Stock. Browser-confirmed live product page, In Stock, and correct product on 2026-07-21.

**Runner-up:** ASIN `B000067R1H` — Franklin Sports Competition 100 Soccer Ball, Size 4 — $21.99, 4.5 stars, 7,756 ratings, In Stock. Also browser-validated, but pricier than the primary pick for a single inflated ball.

**Diff to apply in `src/data/affiliates.json` (copy-paste ready, not yet applied):**

```json
  "soccer-ball-size4": {
-   "destination": "https://www.amazon.com/dp/B001L3URAS?tag=parentcoachpl-20",
+   "destination": "https://www.amazon.com/dp/B007ZQWLZE?tag=parentcoachpl-20",
    "retailer": "Amazon",
    "campaign": "gear-soccer-ball-size4"
  },
```

## Proposed swap 2 — PENDING JEFF REVIEW

**Slug:** `soccer-shin-guards-ankle-youth`
**Current destination:** `https://www.amazon.com/dp/B006IXH79A?tag=parentcoachpl-20` (Vizari Malaga Shin Guards — buy box lost, only third-party "See All Buying Options" with a high-price flag, no default Add to Cart)

**Recommended replacement:** ASIN `B00R2VBASG` — Vizari Soccer Shin Guards with Ankle Protection, Size Small, Blue/Maroon — **$9.29**

Why this fits: same Vizari brand family as the original Malaga listing (no name-recognition loss), and unlike the original this listing has explicit padded ankle protection built into the design — matching the queue's stated product intent ("ankle protection/sleeve") that the old ASIN lacked. Sizing is explicit for youth (kids 4-6, 6-8, 8-10, 10-12, 12-14 bands, plus adult), and the review base is deep: 4.6 stars across 1,003 ratings. Browser-confirmed live product page, In Stock, and correct product (ankle-padded shin guard, youth-sized) on 2026-07-21.

**Runner-up:** ASIN `B08V5JH6HC` — Vizari Matera Soccer Shin Guards with Ankle Protection, XX-Small — $9.36, 4.6 stars, but only 9 ratings and a smaller (XX-Small) size than ideal for general youth placements. Also browser-validated live + in stock + matching.

**Diff to apply in `src/data/affiliates.json` (copy-paste ready, not yet applied):**

```json
  "soccer-shin-guards-ankle-youth": {
-   "destination": "https://www.amazon.com/dp/B006IXH79A?tag=parentcoachpl-20",
+   "destination": "https://www.amazon.com/dp/B00R2VBASG?tag=parentcoachpl-20",
    "retailer": "Amazon",
    "campaign": "gear-soccer-shin-guards-ankle"
  },
```

## Retire-recommended

None. Both open items got a validated, browser-confirmed replacement.

## Skipped (governance/lifecycle owned)

None. Both open items were unowned and safe to source.

## Left open (awaiting browser validation)

None. Claude in Chrome was available this run; both items were fully validated.

---

Jeff: both diffs above are ready to paste into `src/data/affiliates.json` if you approve. No file has been changed and nothing has been deployed.
