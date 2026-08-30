# Affiliate Replacement Proposals — 2026-08-27

Manual run of Arnie (pcd-affiliate-replacement-sourcer) after the scheduled task stopped firing (see ops note at bottom). Worked all 7 open items in `reports/link-health/replacement-queue.json` (generated 2026-08-17 by Linda). All 7 slugs cleared governance/lifecycle (`legacy_offer_unclassified`, `nextAction: research_and_map_product`, none in `needReviewBeforeResearch`).

**PENDING JEFF REVIEW — nothing below is live. Approve by editing `resolution.status` to `"approved"` in the queue for the slugs you want staged, then Alfred picks them up.**

## Proposed swaps (5)

### 1. tennis-racquet-junior
- Old: `amazon.com/dp/B095RJ5FR8` (buy-used only, no new Buy Box)
- New: **HEAD Speed 25 Junior Tennis Racquet, Blue (SIOC), Pre-Strung, Ages 8-11** — ASIN `B095S1S2C7` — $25.50 — 4.8★ (1,121 ratings)
- Why it fits: same brand/model line as the site's existing card copy. In stock, confirmed live in browser.
- Card copy: **no change needed** — `guides/tennis.md` already says "HEAD Speed junior racquet."
- Diff:
  ```
  "tennis-racquet-junior": {
    "destination": "https://www.amazon.com/dp/B095S1S2C7?tag=parentcoachpl-20",
    "retailer": "Amazon",
    "campaign": "gear-tennis-racquet-junior"
  }
  ```

### 2. foam-roller-medium
- Old: `amazon.com/dp/B071P2MQ5D` (buy-used only) — **note:** this actually resolves to an Amazon Basics 24" *high-density* roller, not the 36" *medium-density* roller all three cards describe. That mismatch predates this swap.
- New: **ProsourceFit High Density Foam Roller, 36 inches** — ASIN `B00ED3GIV0` — $22.99 — 4.6★ (20,865 ratings)
- Why it fits: in stock, well above the rating bar, 36" length matches published copy. It is High Density, not Medium — the closest well-reviewed in-stock match; a true "medium density" 36" roller in this price range wasn't available (one candidate, Yes4All, is Currently Unavailable).
- Card copy: **NEEDS UPDATE** — 3 files (`guides/cross-country.md`, `guides/gymnastics.md`, `guides/stunt.md`) say "Foam roller — medium density" / "medium-density foam roller." Recommend changing "medium-density" to an accurate density claim for whichever roller ships.
- Diff:
  ```
  "foam-roller-medium": {
    "destination": "https://www.amazon.com/dp/B00ED3GIV0?tag=parentcoachpl-20",
    "retailer": "Amazon",
    "campaign": "gear-foam-roller-medium"
  }
  ```

### 3. football-cup-shorts-youth
- Old: `amazon.com/dp/B00181B9TQ` (no featured new offer)
- New: **Shock Doctor Compression Shorts with Cup Pocket — Youth (cup NOT included)** — ASIN `B00181B9W8` — $29.99 — 4.5★ (328 ratings)
- Why it fits: same brand, in stock, well above the rating bar. **Functional difference to flag:** the card says "Bio-Flex cup," implying the cup ships in the box. Every in-stock-checked "with Bio-Flex Cup" (cup-included) Shock Doctor listing is Currently Unavailable — this is pocket-only, cup sold separately.
- Card copy: **NEEDS UPDATE** — `guides/football.md` h3 says "Shock Doctor compression shorts with Bio-Flex cup." Recommend removing the cup-included claim or adding "cup sold separately."
- Diff:
  ```
  "football-cup-shorts-youth": {
    "destination": "https://www.amazon.com/dp/B00181B9W8?tag=parentcoachpl-20",
    "retailer": "Amazon",
    "campaign": "gear-football-cup-shorts"
  }
  ```

### 4. soccer-shin-guards-ankle-youth
- Old: `amazon.com/dp/B00R2VBASG` (currently unavailable, no buy box)
- New: **Shin Guards Soccer Youth Kids, 2-18 Yrs, with Ankle Sleeves Protection, Adjustable Strap** — ASIN `B0CX1S91GH` — $19.99 — 4.6★ (641 ratings)
- Why it fits: in stock (19 left), well above the rating bar, explicitly ankle-sleeve construction matching the queue's product intent.
- Card copy: no card exists for this slug (only inline prose links in `articles/best-kids-shin-guards.md` and `articles/the-13-year-olds-i-need-new-everything.md`) — no update needed.
- Diff:
  ```
  "soccer-shin-guards-ankle-youth": {
    "destination": "https://www.amazon.com/dp/B0CX1S91GH?tag=parentcoachpl-20",
    "retailer": "Amazon",
    "campaign": "gear-soccer-shin-guards-ankle"
  }
  ```

### 5. multi-sport-socks-crew — SAME PRODUCT, BACK IN STOCK
- Old/New: `amazon.com/dp/B086CCM86Z` — **Nike Unisex Everyday Cushioned Training Crew Socks (3-Pack)** — $15.00 — 4.7★ (7,164 ratings)
- This is the *same ASIN* Linda flagged as out of stock on 8/17. It's back — confirmed live in browser (Add to Cart + Buy Now both present). No product change, just re-confirming the existing link is healthy.
- Card copy: no change needed — `guides/basketball.md` already matches exactly.
- No diff needed; recommend just clearing this from the queue once Jeff acknowledges it's healthy again.

## Retire-recommended (1)

### hockey-helmet-youth
- Old: `amazon.com/dp/B09KWMQ9TH` (currently unavailable)
- No candidate met the bar. **Bauer Lil Sport Hockey Helmet Combo with Cage** (closest match to the existing card copy) is only sold as a Toddler-size variant with 5 ratings — fails the 100-rating floor. **Bauer RE-AKT 55** (4.6★, 236 ratings, in stock) and **CCM Tacks 70** (4.5★, in stock) combos that do meet the rating bar are Senior/adult sizing only — not a youth-appropriate substitute.
- Recommend: retire the slug, or hold for a future run once a true youth/junior HECC-certified combo with adequate reviews lists on Amazon. `guides/hockey.md`'s card will need new copy regardless once a decision is made either way.

## Left open — could not source (1)

### soccer-goalie-gloves-youth
- soccergarage.com timed out twice (180s each) this run — could not browse to source or validate a candidate.
- Separate structural note: this slug runs through a CJ (Commission Junction) tracking link, not Amazon. Even once a specific product is identified, Arnie has no CJ network dashboard access to mint a new tracking link — whoever picks this up next will need to generate the actual affiliate deep link through CJ directly, not just find a product URL.

## Ops note

This run happened manually because Arnie's scheduled task (`pcd-affiliate-replacement-sourcer`) had gone silent — `lastRunAt` was stuck at 2026-08-11 despite a weekly Tuesday cron, skipping the 8/18 and 8/25 windows. Same pattern hit five other PCD weekly tasks (Linda, Flo, ops-watch, weekly-lint-fix-queue, gsc-review). Toggled Arnie disabled/enabled to try to force re-registration; unconfirmed whether that fixes the underlying scheduler gap.
