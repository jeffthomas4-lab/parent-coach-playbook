# Sanity Studio (parent-coach-playbook-studio)

> **STATUS: Currently inactive.** This studio is scaffolded but the website does not query Sanity. All articles live as markdown files in `../src/content/articles/`.
>
> **Read `../SANITY.md` first** for a full plain explanation of why Sanity is set up but turned off, when you'd ever turn it on, and how to do that. Don't run any of the commands below until you have read that file and decided you actually want to activate Sanity.

The CMS scaffold that is *available* if we ever decide to migrate from markdown to a web-based admin.

## When you would activate this

See `../SANITY.md`. Short version: when a non-technical contributor joins, when content becomes image-heavy, or when you want to edit from a phone. Until then, leave this folder alone.

## How to activate (only if SANITY.md tells you to)

```bash
cd studio
npm install
npm run dev   # local studio at http://localhost:3333
npm run deploy   # hosted studio at parent-coach-playbook.sanity.studio
```

The Sanity cloud project ID is `oasnvt90` (already wired into `sanity.config.ts` and `../.env`).

## Schemas

- `article` — every issue
- `author` — bylines
- `gear` — affiliate picks
- `leadMagnet` — free downloads
- `page` — static pages (about, etc.)
- `newsletterIssue` — Kit archive mirror
- `siteSettings` — nav, footer, social

## Migrating from markdown to Sanity

Outlined in `../SANITY.md`, step 3. Roughly one hour of work.
