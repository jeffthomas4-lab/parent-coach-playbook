# Link health - 2026-10-12 (Linda weekly, catch-up)

Recommendations only. No `affiliates.json` edits. Previous report: LINK_HEALTH_2026-09-21 (the 09-28 and 10-05 weekly runs did not produce reports).

## Scope
- 65 slugs, oldest `last_checked` first (2 never checked), out of 253 in `affiliates.json`.
- Method: headless Chrome on the box through `https://parentcoachdesk.com/go/<slug>/`, following the redirect to the retailer page; 12 s spacing on Amazon. Every flag re-verified in a second browser pass.
- Retailers: Amazon 61, SoccerGarage 4.
- /go/ redirects: 65/65 resolved with HTTP 200, no 404s, no captcha walls. Amazon tag `parentcoachpl-20` present on every Amazon destination checked.

## Confirmed: replace (Arnie/Rita queue)
| slug | ASIN | finding |
|---|---|---|
| nike-youth-charge-shin-guards | B07HVCX4YC | "Currently unavailable. We don't know when or if this item will be back in stock." No cart. Confirmed twice. Note: Jeff cleared this slug on 2026-09-26. |
| soccer-shin-guards-ankle-youth | B00R2VBASG | Vizari ankle shin guards: "Currently unavailable", no cart. Confirmed twice. |

## Watch (re-check next run, no action yet)
| slug | ASIN | finding |
|---|---|---|
| soccer-shin-guards-youth | B0C2GTB7PB | Default variant unavailable; "See All Buying Options" still offered (third-party). |
| kinesio-tape-precut | B002CJ62N6 | Default variant unavailable; buying options offered. |
| hard-cooler-55qt | B08TYGMCJ8 | No buy box; buying options only ($74.99). |
| volleyball-knee-pads-youth | B00P9OJF9E | "Temporarily out of stock" (Amazon expects restock). |

## False positive cleared
- basketball-shoes-youth (B0F14PHJCY): first pass found no cart button; re-check shows "Only 1 left in stock". OK.

## Internal link spot-check
10 random pages from sitemap.xml (2,091 URLs, camps excluded): 719 internal links, 141 unique targets, **0 broken** (all 200).

Pages: coaching-tips/lacrosse-girls-1v1-take-away-check, team-parent/the-carpool-spreadsheet-that-saves-marriages, drive-home/talking-about-the-coach-they-dont-like, coaching-tips/volleyball-serve-receive-triangle-ages-11-12, game/when-another-parent-says-something-racist, sports/football, coaching-tips/lacrosse-girls-walk-and-cradle, what-to-buy/parent-coach-gear, body/missing-kid-at-tournament, team-parent/volunteer-army-getting-parents-to-help.

## Next
Arnie proposes replacements for the 2 confirmed slugs; Rita reviews. STATE.md updated for all 65 slugs.
