# Affiliate picks pending from Jeff

Picks Jeff sent that did not match the amzn.to redirect target, or where the redirect URL had no product slug to verify against. Removed from the May 2 batch. Resolve and re-add.

Last updated: 2026-05-02

---

## Wrong product at the link

The amzn.to short link redirects to a product that does not match the label Jeff gave.

| Pick | Link Jeff gave | Where it actually points |
|---|---|---|
| Basketball indoor dribbling ball | https://amzn.to/4uso7cs | BLITZBALL Starter Pack (B01H51MVFS) — same ASIN as the baseball Blitzball pick |
| Sunglasses (modest price) | https://amzn.to/4cM9DOt | Franklin Sports Master Baseball Gloves (B013LPRKQ2) |
| Socks (HS) | https://amzn.to/4tTh7FE | Raigoo Soccer Socks (B07RJZZ9XX) — soccer-branded, may still be the right product |
| Batting gloves 12+ | https://amzn.to/4cVc0id | Rawlings SOCL-BLK Baseball Socks (B06XD2XW91) — looks like a swap with the socks pick |

Action: send a corrected `amzn.to` link for each, or paste the brand/model name and I'll find a matching link.

---

## Redirect has no product slug

The amzn.to short link redirects to `/dp/{ASIN}` with no slug, so I can't pull brand/model from the URL. Amazon product pages are blocked from this environment, so I cannot read the page itself.

| Pick | Link Jeff gave | ASIN |
|---|---|---|
| Multi-sport cleats (also softball/football) | https://amzn.to/42NphDe | B0DRC1HJN8 |
| Base layer long sleeve | https://amzn.to/3Pcwmdz | B0D9FD8N75 |

Action: paste the brand and model name, or send a slugged link (anything that includes the product title in the URL).

---

## Notes

- The original list had two Blitzball entries (basketball dribbling ball and "Blitz ball bat & 3 balls") that resolved to the same ASIN B01H51MVFS. Jeff confirmed: keep one (the bat & balls set, listed under Practice and at-home training).
- amzn.to itself works from this environment. The `amazon.com` page beyond the redirect is blocked, so descriptions are written from the URL slug + search keywords visible in the redirect target. That's fine when the slug names the product. Not fine when the slug is just an ASIN.
