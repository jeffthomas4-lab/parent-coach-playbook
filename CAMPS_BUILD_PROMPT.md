# Camps repo build prompt

Paste this into a fresh chat. Self-contained — the new session does not need to read this conversation's history.

---

## The prompt

I'm building phase 1 of a camps repository for The Parent-Coach Playbook (parentcoachplaybook.com). The site lives at `C:\Users\jeffthomas\Desktop\Claude Cowork\OUTPUTS\parent-coach-playbook\` and is already deployed to Cloudflare via GitHub.

**Before you do anything, read these files in order. They are required context.**

1. `CLAUDE.md` (in the project root and in `ABOUT ME/`) — voice and formatting rules I follow
2. `ABOUT ME/Anti AI Writing.txt` — banned words and patterns
3. `VOICES.md` — the three contributor voices
4. `AI_WORKFLOW.md` — how AI-assisted content works here
5. `CAMPS_PROPOSAL.md` — the original architecture proposal
6. `CONTENT_ROADMAP.md` — the full content pipeline
7. `astro.config.mjs`, `package.json`, `wrangler.jsonc` (if it exists) — current build config
8. `src/data/site.ts` — site config, NAV, contributors
9. `src/components/NavBar.astro` and `src/components/Footer.astro` — layout chrome
10. Pick one existing page like `src/pages/team-parent/index.astro` to understand the brand styling

Read every one of those before writing code. Do not skip.

## The decision (locked, do not relitigate)

Full custom build on **Cloudflare D1** (SQLite at the edge). No Airtable, no third-party database. Everything stays inside the existing Cloudflare account: D1 for data, Workers for API, Astro for the public site, Cloudflare Access for admin auth.

Why custom: minimum upkeep at the infrastructure level (Cloudflare manages the DB), no vendor lock, free at expected scale, scales to thousands of camps without rearchitecting.

## Scope

**Geographic:** National from day one, with the Pacific Northwest as the editorial focus. Make this honest on the public landing — *"We're starting in the Pacific Northwest where we can verify camps personally. National listings welcome but light coverage outside PNW for now."*

**Moderation:** Manual approval on every submission for v1. The schema must support a future "trusted submitters auto-approve, new submitters queue" upgrade. Build the data model with `submitters.trust_level` ('new' | 'trusted' | 'banned') so the upgrade is a logic change, not a migration.

## Phase 1 deliverables (this build)

This is the only phase you build now. Do not start phase 2.

1. **`wrangler.jsonc`** at project root with D1 binding configuration
2. **`migrations/0001_init_camps.sql`** — full schema (see fields below)
3. **`src/lib/camps-db.ts`** — D1 query helpers (one file, clean separation)
4. **`src/pages/api/camps/submit.ts`** — POST endpoint (server-side via Astro's cloudflare adapter). Validates input, geocodes via Nominatim (free, OpenStreetMap), inserts a pending row, returns success
5. **`src/pages/api/admin/camps/[id]/approve.ts`** and `.../reject.ts` — admin actions (POST). Protected by checking the Cloudflare Access JWT in the request headers
6. **`src/pages/camps/index.astro`** — public landing. Lists approved camps as cards. Honest "we're starting in PNW" disclosure block. Subscribe-form CTA at the bottom. SSR (`export const prerender = false`)
7. **`src/pages/camps/submit.astro`** — submission form, custom-styled to match the brand. Honeypot field for spam (a hidden `website` input that real users don't fill). All ~22 fields from the schema below
8. **`src/pages/camps/[slug].astro`** — individual camp detail page. SSR
9. **`src/pages/admin/camps/index.astro`** — moderation queue. Shows pending submissions in chronological order. Each row has approve/reject buttons that POST to the admin endpoints
10. **`src/pages/admin/camps/[id].astro`** — full review page for a single submission with approve/reject/notes
11. **Update `src/data/site.ts`** — add `Camps` to the primary `NAV` array, between `Team Parent` and `Newsletter`
12. **Update `src/pages/sitemap.xml.ts`** — add `/camps/` to staticUrls, fetch approved camp slugs from D1 at build time and add detail URLs
13. **Update `DEPLOY.md`** — append a "Camps database setup" section with the wrangler commands the user runs once on their machine
14. **Update `CAMPS_PROPOSAL.md`** — change phase 1 status from PIPELINE to SHIPPED with what's live
15. **A `migrations/README.md`** — explains how to run migrations in dev and production

Phase 2 (map, filtering, geocoding cache, admin queue refinements) and phase 3 (zip-code radius search, photos, reviews) are out of scope for this build.

## D1 schema (verbatim)

```sql
CREATE TABLE submitters (
  email TEXT PRIMARY KEY,
  trust_level TEXT NOT NULL DEFAULT 'new', -- 'new' | 'trusted' | 'banned'
  submission_count INTEGER NOT NULL DEFAULT 0,
  approved_count INTEGER NOT NULL DEFAULT 0,
  first_submitted_at TEXT NOT NULL,
  last_submitted_at TEXT NOT NULL,
  notes TEXT
);

CREATE TABLE camps (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  sport TEXT NOT NULL,
  age_min INTEGER NOT NULL,
  age_max INTEGER NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,

  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip TEXT NOT NULL,
  latitude REAL,
  longitude REAL,

  description TEXT NOT NULL,
  price_text TEXT,
  day_or_overnight TEXT NOT NULL DEFAULT 'day',
  skill_level TEXT NOT NULL DEFAULT 'all',
  spots_status TEXT NOT NULL DEFAULT 'open',
  contact_email TEXT,
  contact_phone TEXT,
  website_url TEXT,
  lunch_included INTEGER NOT NULL DEFAULT 0,
  aftercare_available INTEGER NOT NULL DEFAULT 0,

  status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'approved' | 'rejected'
  submitted_by_email TEXT NOT NULL,
  submitted_at TEXT NOT NULL,
  reviewed_by TEXT,
  reviewed_at TEXT,
  review_notes TEXT,

  FOREIGN KEY (submitted_by_email) REFERENCES submitters(email)
);

CREATE INDEX idx_camps_status ON camps(status);
CREATE INDEX idx_camps_state ON camps(state);
CREATE INDEX idx_camps_sport ON camps(sport);
CREATE INDEX idx_camps_dates ON camps(start_date, end_date);
```

## Brand voice constraints

The public-facing copy on `/camps/` and `/camps/submit/` must follow the site's voice rules.

- Cream paper background (`#FAF6EE`), warm ink text (`#2D2520`), terracotta accent (`#C5713D`)
- Italic Fraunces in display, lowercase mid-section labels in italic terracotta (use `.t-section`, `.t-cta` classes from `src/styles/global.css`)
- No em dashes anywhere. Period or colon only.
- No banned words (full list in `ABOUT ME/Anti AI Writing.txt`)
- One italic phrase per H1 — wrap it in `<em class="text-rust">word</em>`
- Match the layout patterns from existing pages like `/team-parent/`

The submission form should feel like part of the brand, not a generic admin form.

## What NOT to do

- Do not add Airtable, Mapbox, Google Maps, or any third-party SaaS. We're building custom on Cloudflare specifically.
- Do not add the map view, geocoding cache, photo uploads, reviews, or zip-code radius search. Those are phases 2 and 3.
- Do not write more content guides, articles, or resources. The camps build is purely engineering.
- Do not change the brand colors, fonts, or wordmark.
- Do not modify any existing article, guide, or resource markdown files.
- Do not deploy. Push to GitHub only after I review the code locally.

## What to verify before you finish

- `npm run build` completes cleanly with no errors
- The build output includes `/camps/`, `/camps/submit/`, `/admin/camps/`, and the API routes
- The schema in the migration file matches the schema spec above exactly
- No em dashes in any new copy
- No banned words in any new copy

## What to hand back to me

When you're done, give me:

1. A summary of every file you created or modified
2. The exact PowerShell commands I run on my Windows machine to provision the D1 database (the `npx wrangler d1 create` flow), apply the migration, and confirm the binding works
3. The exact PowerShell commands to set up Cloudflare Access on the `/admin/` routes
4. A test plan: how I verify the submit flow works end-to-end after deploy
5. The git commit message and push commands

## A note on judgment calls

If you find an issue with the schema or architecture as you build, surface it before working around it. I would rather pause and adjust the spec than ship a workaround. But don't ask permission for routine implementation choices (file naming, helper functions, error message wording) — make the call and move.

If something is genuinely ambiguous in the existing codebase, read more files until it isn't. Don't guess at the brand styling — copy from `/team-parent/index.astro` and adapt.

The work I want is the technical phase 1 build, in voice, ready for me to push.

---

End of prompt.
