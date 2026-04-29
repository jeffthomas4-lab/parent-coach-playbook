# The Parent-Coach Playbook

The drive home is the real game.

A faceless editorial brand for parents who coach their own kid in youth sports.
Built as a code-based, deployable Astro site. Imprint: Field & Forge Press.

This README is the operator's manual. If you're deploying for the first time,
go to `DEPLOY.md` and follow it top to bottom. Come back here when you need to
add content or change something.

---

## Stack

| Layer       | Tool                              |
| ----------- | --------------------------------- |
| Framework   | Astro 4 (static-first)            |
| Styling     | Tailwind CSS + tokens             |
| Hosting     | Cloudflare Pages                  |
| CMS         | Sanity (in `studio/`, optional)   |
| Newsletter  | Kit (formerly ConvertKit)         |
| Fonts       | Self-hosted via @fontsource       |
| Repo        | GitHub                            |

---

## Run it locally

```bash
npm install
npm run dev
```

Visit http://localhost:4321. Hot reload is on.

```bash
npm run build
npm run preview   # serves the production build
```

---

## Project layout

```
.
├── astro.config.mjs            # site config, integrations
├── tailwind.config.mjs         # brand tokens
├── src/
│   ├── components/             # Logo, NavBar, Footer, ArticleCard, etc.
│   ├── content/
│   │   ├── articles/           # markdown articles (the workhorse)
│   │   └── gear/               # markdown gear items
│   │   └── config.ts           # collection schemas (Zod)
│   ├── data/
│   │   ├── site.ts             # nav, pillars, sports, age bands
│   │   └── affiliates.json     # /go/[slug] redirect targets
│   ├── layouts/                # BaseLayout, ArticleLayout, PillarLayout
│   ├── pages/                  # routes
│   └── styles/global.css       # tokens + editorial type primitives
├── public/                     # robots.txt, favicon.svg, og-default.png
└── studio/                     # Sanity Studio (optional CMS, see studio/README.md)
```

---

## How to add a new article

1. Create a file at `src/content/articles/your-slug.md`
2. Use this frontmatter:

```yaml
---
title: "What you say in the *first 90 seconds* shapes the next week"
dek: "Optional subhead, one or two sentences."
author: "PCP Editors"          # or "Jeff Thomas" for cornerstone pieces
issue: 4                        # optional issue number
phase: "drive-home"             # drive-there | game | drive-home
sport: "baseball"               # see src/data/site.ts SPORTS
age: "8-10"                     # 5-7 | 8-10 | 11-12 | 13-14 | 15-plus | all-ages
seasonPhase: "mid"              # pre-season | early | mid | playoffs | off-season
publishedAt: 2026-04-15
featured: true                  # optional, surfaces on homepage
draft: false
---

Body in markdown. The first paragraph gets a drop cap automatically.

Wrap one phrase per headline in *single asterisks* to make it italic in rust.
That's the brand's only display italic rule. Don't sprinkle.
```

3. Save. The dev server picks it up immediately. Push the file and Cloudflare rebuilds.

The article is reachable at `/{phase}/{slug}/`.
Example: `/drive-home/the-90-second-rule/`.

---

## How to add a new affiliate link

1. Open `src/data/affiliates.json`
2. Add an entry:

```json
"my-product-slug": {
  "destination": "https://retailer.com/path-to-product?tag=youraffid",
  "retailer": "Amazon",
  "campaign": "gear-baseball-glove"
}
```

3. Use it in markdown or components as `/go/my-product-slug/`. UTMs are added automatically.

To attach the product to the gear hub, create a markdown file at
`src/content/gear/my-product-slug.md` with this frontmatter:

```yaml
---
name: "Easton Hammer 11-inch youth glove"
description: "..."
ourTake: "..."
retailer: "Amazon"
priceRange: "$30–45"
sport: "baseball"
age: "8-10"
affiliateSlug: "my-product-slug"   # matches affiliates.json key
featured: true
---
```

---

## How to add a new sport tag

Open `src/data/site.ts` and add to `SPORTS`. Then add the same value to the
`sport` enum in:

- `src/content/config.ts` (article + gear)
- `studio/schemas/article.ts` and `studio/schemas/gear.ts` (if using Sanity)

Cloudflare rebuild picks it up.

---

## How to update the nav

Open `src/data/site.ts`. Edit `NAV` (primary) and `UTILITY_NAV` (resources, about).
That's the single source of truth. Header and footer both read from it.

---

## How to wire Kit (newsletter)

1. Create an inline form in Kit. Pick the "Naked" template.
2. Look at the form URL. The numeric ID at the end is your form ID.
3. Set environment variables in Cloudflare Pages:
   - `PUBLIC_KIT_FORM_ID` — main subscribe form
   - `PUBLIC_KIT_LEAD_MAGNET_FORM_ID` — Drive Home Playbook form
4. Redeploy. The forms now POST to Kit.

Until you set them, the form falls back to a stub that `console.log`s the email
so the layout still works during review.

---

## How to switch from markdown to Sanity

The site ships ready to read content from either source. By default it reads
markdown from `src/content/articles/`. To migrate:

1. Set up Sanity Studio (see `studio/README.md`)
2. Run `npx sanity dataset import` with the converted JSON
3. Swap `getCollection('articles')` calls in `src/pages/` to read from
   `src/lib/sanityClient.ts` (helper file is stubbed and ready)

You can also keep both running — markdown for legacy issues, Sanity for new ones.

---

## Performance targets

- Lighthouse 95+ across all categories
- LCP under 1.5s
- All fonts self-hosted (no runtime font requests)
- Images optimized via Astro's built-in image pipeline

Run `npm run build` and check the `dist/` output before each ship.

---

## Brand voice (the only rule that matters)

The drive home is the real game. Italics in display = the conceptual hinge of the sentence. Use them once per headline. Sentence case for everything readable. UPPERCASE only for mono labels. No emoji, anywhere.

Banned words: see `ABOUT ME/Anti AI Writing.txt` in the project root for the full list.

---

## Status

- v0.1 — initial deploy. Three sample articles seeded. Lead magnet PDF needs to be replaced with the real file.
- Phase 2 — Stripe + Gumroad commerce, membership, search index upgrade.
