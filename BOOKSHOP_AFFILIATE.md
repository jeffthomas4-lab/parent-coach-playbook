# Bookshop.org Affiliate Reference

Status: LIVE (approved 2026-06-11)
Affiliate contact: ellington.mckenzie@bookshop.org

---

## Account details

Affiliate ID: **125074**

Commission: 10% on books, also earns on gift card sales.
Cookie window: 48 hours from click. Encourage readers to bookmark your storefront for repeat purchases.
Payout: Commissions appear in Pending tab. Transfer to Payable ~14 days after sale. Minimum $20 to collect via Stripe Connect.

---

## Link formats

| Type | Format |
|---|---|
| Storefront | `https://bookshop.org/shop/ParentCoachDesk` |
| Individual book | `https://bookshop.org/a/[YourID]/[ISBN13]` |
| Gift card | `https://bookshop.org/a/[YourID]/gift_cards` |
| Book list | `https://bookshop.org/lists/[ListName]` |

WARNING: Changing your storefront URL or list names breaks all existing links. Don't rename once links are live on the site.

---

## How to generate a link for a specific book

1. Log into Bookshop.org
2. Search for the book
3. On the product page, scroll down to "Your Affiliate Link" — copy it
4. Add to `affiliates.json` under a slug like `book-[short-title]`

---

## Embeddable widgets (available for site use)

Five widget types available on any book or list page under "Embeddable Affiliate Widgets":

1. Book Button Widget — simple "Buy On Bookshop" button
2. Search Widget — lets visitors search Bookshop directly, credits you for sales
3. Book Widget — cover, price, storefront name, "Buy This Book" button
4. Featured Book Widget — large cover with prominent buy button
5. List Widget — scrollable curated list (found under Affiliate Profile & Lists > My Book Lists)

To embed: copy the widget code from the product page, paste into the site.

---

## How to run a commission report

1. Log in, click User icon (top right), select Affiliate Dashboard
2. Toggle to Reports tab, click Create Report
3. Set date range (filter by Date Sold or Date Shipped), click Create Report
4. Report emails to the address on your affiliate account

---

## Integration with parentcoachdesk.com

Book links go through the `/go/` redirect system like any other affiliate link. Add to `affiliates.json`:

```json
"book-[short-title]": {
  "destination": "https://bookshop.org/a/[YourID]/[ISBN13]",
  "retailer": "Bookshop.org",
  "campaign": "books-[category]"
}
```

Current placement: the `photo-book-service` slug points to Shutterfly (no affiliate tag yet).

13 book slugs now live in `affiliates.json`:

| Slug | Title | Category |
|---|---|---|
| `book-changing-the-game` | Changing the Game — O'Sullivan | Sports parenting |
| `book-whose-game-is-it-anyway` | Whose Game Is It, Anyway? — Ginsburg et al. | Sports parenting |
| `book-beyond-winning` | Beyond Winning — Payne | Sports parenting |
| `book-positive-coaching` | Positive Coaching — Thompson | Sports parenting |
| `book-mindset` | Mindset — Dweck | Mental performance |
| `book-grit` | Grit — Duckworth | Mental performance |
| `book-mind-gym` | Mind Gym — Mack | Mental performance |
| `book-champions-mind` | The Champion's Mind — Afremow | Mental performance |
| `book-talent-code` | The Talent Code — Coyle | Talent development |
| `book-range` | Range — Epstein | Talent development |
| `book-peak` | Peak — Ericsson | Talent development |
| `book-inner-game-of-tennis` | The Inner Game of Tennis — Gallwey | Coaching |
| `book-little-book-of-talent` | The Little Book of Talent — Coyle | Coaching |

All route through `/go/[slug]/` like gear links. Not yet placed in any content — add when book recommendations appear in articles or a dedicated books page is built.

---

## Next steps

1. Confirm your affiliate ID number from the profile page and add it above
2. Set your storefront URL (`bookshop.org/shop/[UniqueName]`) — do not change it after links go live
3. Add book picks to `affiliates.json` as recommendations appear in content
4. Consider a curated list (e.g. "Books for Sports Parents") linked from the site
