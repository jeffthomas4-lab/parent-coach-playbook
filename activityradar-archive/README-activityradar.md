# ActivityRadar

Structured search and discovery over the shared youth-activity database. The
org-centric rebuild of the camps directory. One database, two front doors:
ActivityRadar is the structured search door, parentcoachdesk.com/camps is the
editorial door reading the same data filtered to `program_type='camp'`.

See `00-ARCHITECTURE.md` for the full plan and the decisions behind the model.

## Stack

Astro (hybrid) + Cloudflare Pages + D1 + R2. Same stack as parent-coach-playbook,
so one deploy norm and a shared D1 both sites bind by `database_id`.

## Status: Phase 4 — Search UI (WS-1 complete)

Foundation (previous session) + public search surface (this session):
- Org-centric schema (`migrations/0001`–`0007`)
- Camps migration + IRS BMF backbone (196,252 orgs, 1,701 programs)
- Shared read layer (`src/lib/db.ts`): searchOrganizations, getOrganization, getProgram, searchPrograms, searchSuggest, logSearchEvent
- **Home search page** (`/`) with autocomplete via `/api/suggest`
- **Search results** (`/search`) with category / age / radius / price / availableNow filters; distance shown; honest empty state
- **Org profile** (`/org/[slug]`) with programs list + claim CTA + schema.org LocalBusiness
- **Program detail** (`/program/[slug]`) with registration CTA + schema.org Event
- **SEO landing pages** (`/[activitySlug]/[locationSlug]`) — 20 activity types × 15 Puget Sound cities; schema.org ItemList + BreadcrumbList
- **Demand logging** — every search writes a row to `search_events` (N1); click-throughs append to `clicked_org_ids` via `/api/log-click` (N2)
- **Design system** — Navy v2 tokens in `tailwind.config.mjs`, `src/styles/global.css`

Not built yet (next phases): parentcoachdesk.com re-point to shared DB (Phase 5), claim portal, org dashboard.

## Local dev

```powershell
npm install
npm run db:migrate:local
npm run dev
```

## Deploy

See `00-ARCHITECTURE.md` and the deploy block. First create the D1 (`activity-radar`),
paste its id into `wrangler.jsonc`, apply migrations, then deploy.
