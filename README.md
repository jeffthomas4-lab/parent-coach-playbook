# The Parent-Coach Playbook

The drive home is the real game.

A trusted editorial and directory product for youth-sports parents and coaches.
Built as an Astro application deployed to Cloudflare Workers. Imprint: Field & Forge Press.

This README is the developer entrypoint. Use `DEPLOYMENT-RUNBOOK.md` for the
protected release path, `coordination/CURRENT_STATE.md` for evidence-backed
status, and `coordination/REPOSITORY-STRUCTURE.md` for ownership and placement.
`DEPLOY.md` is retained for historical and resource-specific setup notes; it is
not the production release authority.

---

## Stack

| Layer | Tool |
| --- | --- |
| Framework | Astro 7 with Cloudflare adapter |
| Runtime | Cloudflare Workers |
| Data | D1, R2, and KV bindings |
| Styling | Tailwind CSS + project tokens |
| Testing | Vitest unit and Miniflare/D1 integration suites |
| CMS | Markdown collections; Sanity Studio is optional |
| Newsletter | Kit hosted-provider boundary |
| Delivery | Protected GitHub Actions staging/production workflow |

---

## Run it locally

```bash
npm ci
npm run dev
```

Visit http://localhost:4321. Hot reload is on.

```bash
npm run check
npm run test:unit
npm run test:integration
npm run build:production
```

---

## Current layout

The complete placement and ownership rules live in
`coordination/REPOSITORY-STRUCTURE.md`. This is the working map, not a claim
that retained historical material is current authority.

```
.
├── src/                        # Worker-hosted Astro application
├── public/                     # shipped static assets
├── tests/                      # behavioral and policy contracts
├── migrations-activity-radar/ # shared camp graph (DB)
├── migrations-pcd-ops/        # isolated operations/trust data (PCD_OPS_DB)
├── automation/                 # machine-consumed policy and agent contracts
├── coordination/               # plans, evidence, reviews, and handoffs
├── scripts/                    # deterministic operator/build tooling
├── worker-cron/                # independently deployed scheduler Worker
├── worker-link-checker/        # independently deployed link-check Worker
└── studio/                     # inactive optional Sanity scaffold
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

3. Save. The dev server picks it up immediately. Release changes only through
   the protected workflow in `DEPLOYMENT-RUNBOOK.md`; a local save or Git push
   is not deployment authorization.

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

The local build picks it up. Production changes only through the protected
release workflow.

---

## How to update the nav

Open `src/data/site.ts`. Edit `NAV` (primary) and `UTILITY_NAV` (resources, about).
That's the single source of truth. Header and footer both read from it.

---

## Newsletter provider boundary

> Historical setup notes follow. The current authority is `KIT_SETUP.md`,
> `KIT_DRIP_SETUP.md`, and `kit-emails/KIT-WIRING-CHECKLIST.md`. Do not infer
> that sequences, tagging, suppression, sender authentication, or delivery are
> live from the presence of a hosted form. Provider changes and sends remain
> explicit approval gates.

The current UI links to a hosted Kit form; it does not collect or log email
addresses inside this application. Provider activation remains fail-closed
until `KIT_SETUP.md`, `KIT_DRIP_SETUP.md`,
`kit-emails/KIT-WIRING-CHECKLIST.md`, and the controlled lifecycle evidence
agree. Changes to forms, sender authentication, automations, suppression, or
delivery are external approval-gated actions.

---

## How to switch from markdown to Sanity

The site ships ready to read content from either source. By default it reads
markdown from `src/content/articles/`. To migrate:

1. Set up Sanity Studio (see `studio/README.md`)
2. Run `npx sanity dataset import` with the converted JSON
3. Swap `getCollection('articles')` calls in `src/pages/` to read from
   `src/lib/sanityClient.ts` (helper file is stubbed and ready)

Do not run both as competing current authorities. Markdown is canonical today;
activating Sanity requires a separately reviewed migration and cutover plan.

---

## Performance targets

- Lighthouse 95+ across all categories
- LCP under 1.5s
- All fonts self-hosted (no runtime font requests)
- Images optimized via Astro's built-in image pipeline

Run `npm run check`, the relevant test suites, and the protected artifact
validation before release. Follow `DEPLOYMENT-RUNBOOK.md`; never deploy an
unreviewed local working tree directly.

---

## Brand voice (the only rule that matters)

The drive home is the real game. Italics in display = the conceptual hinge of the sentence. Use them once per headline. Sentence case for everything readable. UPPERCASE only for mono labels. No emoji, anywhere.

Banned patterns and voice rules are maintained in `EDITORIAL_VOICE.md` and
`EDITORIAL_STANDARDS.md`.

---

## Status

Current status lives only in `coordination/CURRENT_STATE.md`; the active baton
lives in `coordination/HANDOFF.md`. The historical bullets below are retained
until the surrounding legacy authoring guide is migrated.

- v0.1 — initial deploy. Three sample articles seeded. Lead magnet PDF needs to be replaced with the real file.
- Phase 2 — Stripe + Gumroad commerce, membership, search index upgrade.
