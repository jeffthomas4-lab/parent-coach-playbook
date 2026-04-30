# Affiliate links workflow

How to add Amazon (or any retailer) affiliate links to The Parent-Coach Playbook.

## Your Amazon Associates tag

`parentcoachpl-20`

Every Amazon URL you add must include `?tag=parentcoachpl-20` (or `&tag=parentcoachpl-20` if the URL already has parameters). Without the tag, you make zero on the click.

## How the system works

You don't paste raw Amazon URLs into articles. Instead:

1. Add a short slug + the real destination URL to `src/data/affiliates.json`
2. Use `/go/[slug]/` anywhere in the site — articles, gear cards, navigation
3. When a reader clicks `/go/[slug]/`, the site redirects them to the real destination URL with UTM parameters auto-attached so you can track which post drove the click

This pattern is better than raw links for four reasons:

- **One file to update.** If a product goes out of stock and you want to swap to a different one, change the destination in `affiliates.json`. Every link on the site updates.
- **Tracking baked in.** Every outbound click carries `utm_source=parentcoachplaybook`, `utm_medium=affiliate`, `utm_campaign=[campaign-name]` automatically.
- **Robots.txt friendly.** `/go/` is blocked from search indexing already, so you don't pollute your SEO with affiliate redirects.
- **Retailer-agnostic.** If you ever switch from Amazon to Walmart for a particular product, change the destination, the same `/go/[slug]/` link works.

## Adding a new Amazon affiliate link

Three steps. Takes 90 seconds per product.

### 1. Get the clean product URL

On any Amazon product page, the URL looks like:

```
https://www.amazon.com/Rawlings-Sure-Catch-Baseball-Glove/dp/B07DVK1Q5N/ref=...
```

Strip everything after the `dp/PRODUCT_ID` segment. Keep just:

```
https://www.amazon.com/dp/B07DVK1Q5N
```

Append your tag:

```
https://www.amazon.com/dp/B07DVK1Q5N?tag=parentcoachpl-20
```

### 2. Add an entry to `src/data/affiliates.json`

Open the file. Add a new key with a short kebab-case slug. Match this format:

```json
{
  "rawlings-glove-9-inch": {
    "destination": "https://www.amazon.com/dp/B07DVK1Q5N?tag=parentcoachpl-20",
    "retailer": "Amazon",
    "campaign": "gear-baseball-glove"
  },
  "easton-mako-bat-2026": {
    "destination": "https://www.amazon.com/dp/B0XXXXXX?tag=parentcoachpl-20",
    "retailer": "Amazon",
    "campaign": "gear-baseball-bat"
  }
}
```

The `campaign` field shows up in the UTM and helps you see which products drive the most revenue in Amazon Associates and Google Analytics.

### 3. Use it in a post or component

In a markdown article body:

```markdown
We use the [Rawlings Sure Catch 9-inch glove](/go/rawlings-glove-9-inch/) for the
younger kids. Two seasons of use across two of our kids. Still in rotation.
```

In a gear card (in `src/content/gear/[slug].md` frontmatter):

```yaml
affiliateSlug: "rawlings-glove-9-inch"
```

The Astro build picks up the new entry on next deploy. Cloudflare auto-builds when you push.

## Adding non-Amazon affiliate links

The system isn't Amazon-specific. Same three steps. For example, if you join Dick's Sporting Goods affiliate program:

```json
{
  "dicks-cleats-youth": {
    "destination": "https://www.dickssportinggoods.com/p/12345?affiliate_id=YOURID",
    "retailer": "Dick's Sporting Goods",
    "campaign": "gear-soccer-cleats"
  }
}
```

The redirect handler doesn't care what retailer it's hitting. It just forwards with UTMs.

## The FTC affiliate disclosure (legal requirement)

Amazon Associates and the FTC both require you to disclose that you earn from affiliate links. The disclosure has to be **clear and conspicuous** — not buried in tiny text in the footer.

We've got two layers of disclosure:

1. **Site-wide footer disclosure.** Every page footer says "Some links pay us when you buy. We only recommend things we use." The user is reminded on every page.
2. **Gear hub disclosure.** The `/gear/` page has a more prominent disclosure at the top: "Affiliate links pay the bills here. Every pick is something a real parent-coach in our network has used for at least a season. No paid placements."

You don't need to add a disclosure to every individual article unless that article specifically promotes a product. The site-wide footer covers most cases.

If you write an article that's primarily about a single product (a review or a recommendation), include this line near the top of the post:

```markdown
*This post contains affiliate links. We make a small amount when you buy through them. We only recommend products we use ourselves.*
```

Italicized, in voice, no big yellow disclaimer banner.

## Tracking what's working

Two ways:

1. **Amazon Associates dashboard.** Log in at affiliate-program.amazon.com. Click "Reports → Tracking IDs" to see clicks and earnings by tag (you only have one: `parentcoachpl-20`). Click "Bounties" or "Earnings" for product-level breakdown.
2. **Google Analytics or Plausible UTM filter.** Filter traffic by `utm_medium=affiliate` to see which posts and which products drove the most outbound clicks.

The most useful insight is which *post* drove the most affiliate revenue. Check this monthly. Write more like the winners.

## Slug naming conventions

Pick slugs that are:

- Kebab-case
- Specific (include brand + product type + size or year)
- Stable (don't put "2026" in the slug if you'll keep recommending it in 2027)

Good: `rawlings-sure-catch-9-inch`, `easton-hammer-youth-bat`, `nike-mercurial-cleats-youth-3`

Bad: `glove`, `the-glove-i-like`, `glove-2026`

The slug is the URL the user sees in `/go/[slug]/`. It should look intentional.

## Common mistakes to avoid

1. **Forgetting the tag.** A URL without `?tag=parentcoachpl-20` makes zero. Always add it.
2. **Using a personal Amazon link instead of the Associates link.** If you logged into Amazon and copied the URL from your browser, it carries your personal account, not your affiliate tag. Always start with the product's bare URL and add the tag.
3. **Putting raw Amazon links in markdown.** Defeats the tracking and updating advantages of `/go/`. Always use the slug.
4. **Recommending stuff you haven't used.** Bad voice for the brand. Bad behavior for affiliate programs. Bad for trust. Don't.

## Quarterly review

Once a quarter, do a 20-minute pass:

1. Click every `/go/[slug]/` to make sure the destinations still resolve (Amazon URLs sometimes 404 when products discontinue)
2. Check the Amazon Associates dashboard for top earners
3. Replace any dead links
4. Add new entries for products you've been quietly recommending in posts but haven't formalized

That's the whole system.
