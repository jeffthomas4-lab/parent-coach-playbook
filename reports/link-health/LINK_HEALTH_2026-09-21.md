# Link Health Report — 2026-09-21

**65 checked (+4 high-priority rechecks sampled), 9 confirmed issues, 1 false positive dismissed, 15 unconfirmed.**

Batch: 6 never-checked slugs missing from STATE.md, all 47 remaining `2026-08-10` slugs, plus a 12-slug traffic-weighted fill from the `2026-08-17` pool ranked by `placementCount` in `reports/affiliate/lifecycle.json` (top: resistance-bands-set 22, swim-goggles-youth 18, multi-sport-mouthguard-youth 13, …). Maintenance mode (Aug–Nov): read-only detect only — no swap proposals staged, no follow-up emails. Confirmed broken links logged as `needs_you` for Jeff/December.

Browser method: Chromium via puppeteer-core against production `/go/<slug>/` with ~10–15s spacing. Every flag was re-checked in a second browser pass that read `#availability` / buy-box signals. DESKTOP (machineId `041b6bba-…`) started a Windows Chrome pass (61/69 before the agent connection dropped); box Chrome completed the full 69 and the reverify pass. Agent-run client skipped (`PCD_AGENT_RUNS_TOKEN` missing).

## Confirmed broken / degraded links

| Slug | What's wrong | Notes | Brief suggested replacement |
|---|---|---|---|
| `band-practice-pad` | Currently unavailable (carry-over since 07-19/08-10) | AAGUT 12" practice pad ASIN still dead | In-stock Evans/Remo 12" practice pad ASIN |
| `band-valve-oil` | Currently unavailable (carry-over) | Al Cass Fast Valve 2 oz | Any live Al Cass / Hetman valve oil ASIN |
| `dance-jazz-shoes-youth` | Currently unavailable (carry-over) | Capezio E-Series Jazz Slip On | Live Capezio jazz slip-on youth size ASIN |
| `dance-tap-shoes-youth` | Currently unavailable (carry-over) | Capezio Jr.Tyette N625C | Live Capezio/Bloch youth tap shoe ASIN |
| `football-helmet-youth` | Currently unavailable (carry-over) | Riddell Victor Youth Helmet | Live Riddell youth helmet ASIN (Victor or current model) |
| `lacrosse-arm-pads-youth` | Currently unavailable (carry-over) | Maverik Charger Arm Pad XS | Live Maverik/STX youth arm pad ASIN |
| `volleyball-backpack` | Currently unavailable (repeat; symptom changed) | Now correct Mizuno Lightning Volleyball Backpack (09-14 mismatch fixed) but OOS | Live Mizuno/Under Armour volleyball backpack ASIN |
| `book-positive-coaching` | Bookshop.org 404 (carry-over) | ISBN 9780982131701 not in catalog | Amazon/Bookshop alternate ISBN or drop link |
| `book-talent-code` | Bookshop.org 404 (carry-over) | Daniel Coyle listing 404 | Working Bookshop/Amazon edition URL |

All nine are `needs_you` for December close (maintenance mode — do not stage Arnie swap docs this run).

## False positives dismissed

- `baseball-l-screen-pitching-net` — first pass regex-flagged unavailable; reverify found a live product page with Add to cart (PowerNet 7x7). Dismissed.

## Unconfirmed — needs manual browser recheck

15 slugs landed on Amazon **search results** in the box Chrome session instead of a `/dp/` product page. Several of the same slugs (`ace-bandage-3inch-set`, `foam-roller-basics-24`, `foam-roller-triggerpoint-13`, …) resolved to product pages on the earlier DESKTOP Windows Chrome pass before that session dropped, so this looks like intermittent Amazon soft-fail / headless detection rather than proven dead ASINs. **Not reported as confirmed.**

Slugs: `ace-bandage-3inch-set`, `blackout-curtains-nicetown`, `foam-roller-basics-24`, `foam-roller-triggerpoint-13`, `ice-pack-arctic-flex-gel`, `martial-arts-sparring-gear-youth`, `percussion-massager-renpho-r3`, `resistance-bands-loop-fit-simplify`, `script-binder-1inch`, `tennis-balls-standard`, `tennis-shoes-court-youth`, `theater-monologue-book`, `theraband-flat-band-light-medium`, `theragun-relief`, `white-noise-lectrofan-classic`.

## Resolved since last check (09-14 high-priority rechecks)

- `hockey-skates-youth` — **resolved**. Now Lake Placid Summit Adjustable Youth Ice Skates with Add to cart (was Bauer X "Currently unavailable").
- `football-neck-roll` — **resolved**. Now Gear Pro-Tec Youth Z-Cool Neck Roll (was ski mask/balaclava mismatch).
- `portable-pa-speaker` — **resolved**. Now Pyle PSBT125A 1200W portable PA with Add to cart (was $544 used-only / no new offer).
- `volleyball-backpack` — **mismatch resolved, stock not**. Correct volleyball backpack title now, but Currently unavailable (listed above as confirmed OOS).

Also in this batch: `football-shoulder-pads-youth` (OOS on 08-10) re-checked clean.

## Internal link spot-check

10 pages sampled from `sitemap-content.xml` (2072 URLs). All 10 returned 200 with correct titles; 40 unique internal links checked per page (email-protection links ignored); **0 broken**.

Sample: `/what-to-buy/cheer/sizing/`, college XC recruiting drive-there, USA Baseball Pitch Smart news, lacrosse/baseball coaching tips, youth soccer levels, Thespian packing list, choir/rugby sizing, school-basketball-tryouts-vs-AAU.

## What changed since 2026-09-14

- Cleared the remaining 08-10 pool and folded in 6 brand-new never-checked slugs (3 shin-guard ASINs from recent Arnie catalog work + 3 baseball gear).
- Three of four 09-14 high-priority opens self-resolved or were remapped to correct products; only `volleyball-backpack` remains open (now as OOS on the correct product).
- Confirmed set is almost entirely long-running carry-overs still waiting on Arnie/December — same pattern STATE.md has been warning about since August.
- `worker-link-checker` deploy status still unverified; hard 404s kept in scope.

## Process notes

- `PCD_AGENT_RUNS_TOKEN` absent → agent-run preflight/writeAgentRun skipped.
- No edits to `affiliates.json`. No git commit/push. No deploy. `replacement-queue.json` left to Arnie (detect-only).
- Affiliates.json count now **251** (was 245 in STATE header).
