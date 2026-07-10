# Link Health Report — 2026-07-08

**Summary: 65 affiliate links checked, 167 internal links spot-checked, 0 issues found.**

## Scope

- Affiliate redirects: 65 of 245 total slugs (indices 0–64 in `src/data/affiliates.json`, first batch of the monthly rotation — see `STATE.md`). All 65 are Amazon links.
- Internal links: 10 randomly sampled live pages (drawn from the 1,873 URLs in `sitemap-content.xml`), 167 unique internal links extracted and checked across them.

## Affiliate redirect checks

For each slug, fetched `https://parentcoachdesk.com/go/[slug]/`, confirmed the meta-refresh target matches `affiliates.json`, then followed the destination to its final resolved page.

- **0 of 65** `/go/[slug]/` redirect pages returned a non-200 status or a mismatched destination.
- **0 of 65** destinations resolved to a 404, an out-of-stock/unavailable listing, or a generic search/category page.
- Retailer breakdown: 65 Amazon, 0 other.

### Note on false positives (methodology caveat)

The first automated pass (plain HTTP requests, no browser) flagged 6 links as "currently unavailable": `baseball-bases-rubber`, `baseball-catchers-mitt-32in`, `lacrosse-ball`, `multi-sport-cleats-youth`, `multi-sport-socks-crew`, `hockey-helmet-youth`. Investigating one showed Amazon was serving a bot-detection/CAPTCHA interstitial rather than the real product page (no "currently unavailable" text on the actual page — that phrase apparently only showed up in this bot-blocked variant on some requests, not consistently). All 6 were then manually re-verified with a real browser session: **all 6 are in stock and resolve correctly.** No action needed on any of them.

This is a known limitation of curl/requests-based checking against Amazon — expect occasional false "unavailable" flags from bot detection, not real product removals. Worth keeping in mind for future runs; a full browser check (Claude in Chrome) is the more reliable signal when something looks flagged.

## Internal link spot-check

Sampled pages:
- `/team-parent/the-end-of-season-carpool-conversation/`
- `/scripts/when-your-kid-is-in-a-starting-lineup-for-the-first-time/`
- `/drive-there/youth-lacrosse-cost-breakdown/`
- `/body/tick-prevention-lyme-disease/`
- `/body/nil-privacy-hs-athletes/`
- `/coaching-tips/baseball-glove-flip-flexibility/`
- `/body/team-manager-parent-conduct/`
- `/sports/hockey/`
- `/recruiting/tennis-recruiting-guide/`
- `/body/nosebleed-and-eye-injury/`

All 10 pages loaded (200). Across them, 167 unique internal links were extracted and status-checked. 16 came back 404, but all 16 are Cloudflare email-obfuscation links (`/cdn-cgi/l/email-protection#...`) — these only resolve via Cloudflare's client-side JS decoder and always 404 under a plain HTTP request. This is expected behavior, not a real broken link, since a real browser renders them correctly.

**No genuinely broken internal links found.**

## Suggested replacements / slug swaps

None needed this run — no broken or degraded links identified.

## Rotation status

This is the first run with tracking in place. Indices 0–64 of 245 slugs checked. Next run should cover indices 65–129 (see `STATE.md`). At 65/week, the full list cycles roughly every 4 weeks.
