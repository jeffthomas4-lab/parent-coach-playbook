# Reads & Team Parent Index Restructure

**Date:** May 1, 2026  
**Goal:** Scale both indices from firehose single-page lists to topic-landing patterns with filterable archives. Target capacity: 1,000+ articles across topics.

---

## Files Changed

### New Pages
1. **`src/pages/reads/index.astro`** — Rewritten
   - Old: All 100 articles grouped by topic in collapsible sections on one page
   - New: Topic landing page with "Latest 6" section at top, 3×3 topic grid below
   - Each topic card shows: icon, label, blurb, post count, most recent article title
   - Cards link to `/reads/[topic]/`

2. **`src/pages/reads/[topic].astro`** — New file
   - Filterable archive for each of 9 topics
   - Filters: age (5 bands), sport (dropdown, top 8), format (note/essay toggle), search
   - Grid shows first 24 articles, paginated
   - Article cards show hero image (if present), title, dek, format, age, sport, date
   - JavaScript filter logic with `is:inline`, no TypeScript in filters

3. **`src/pages/team-parent/index.astro`** — Rewritten
   - Old: All resources grouped by TEAM_PARENT_CATEGORIES
   - New: Topic landing page with 2×3 grid of TEAM_PARENT_TOPICS
   - Each card shows topic, blurb, article count, most recent article
   - Maintains backward compat: old resources sections still render below (for migration period)
   - Can be removed once all team parent content is in the articles collection

4. **`src/pages/team-parent/[topic].astro`** — New file
   - Same pattern as `/reads/[topic]`: filterable archive for 6 team parent topics
   - Filters: age, sport, format, search
   - Shows articles where `phase: 'team-parent'` and `teamParentTopic: [topic]`
   - Includes breadcrumb back to `/team-parent/`

### Data & Schema
5. **`src/data/site.ts`** — Updated
   - Added `TEAM_PARENT_TOPICS` array with 6 topics:
     - logistics, communication, money, picture-day, conflict, tools
   - Exported `TeamParentTopicSlug` type
   - Existing TOPICS array (9 items) unchanged

6. **`src/content/config.ts`** — Updated
   - articles schema: added `teamParentTopic` field (optional enum, 6 values)
   - articles schema: added `'team-parent'` to phase enum
   - Existing topic field, format, sport, age fields unchanged
   - No breaking changes to existing articles

### Components
7. **`src/components/TopicIcon.astro`** — Updated
   - Added SVG icons for 6 team parent topics:
     - logistics (checklist with checkmarks)
     - communication (speech bubbles at angles)
     - money (dollar sign with coins)
     - picture-day (photo frame)
     - conflict (two bubbles, middle ground)
     - tools (wrench and clipboard)
   - Kept all 9 existing Reads topic icons unchanged

---

## Architecture Decisions

### Topic-Landing Pattern
- Landing pages (`/reads`, `/team-parent`) show:
  - "Latest X" section to drive engagement
  - 3×3 topic grid with counts and most recent title
  - No full article list, no accordions, no pagination at landing level
- Topic archive pages (`/reads/[topic]`, `/team-parent/[topic]`) show:
  - Header with icon, label, blurb, total count
  - Filter bar (age, sport, format, search)
  - Grid of 24 articles max per load
  - No pagination UI (can be added later if needed; currently shows first 24)

### Taxonomy Separation
- Reads articles use `topic` field (9 values) from TOPICS
- Team parent articles use both:
  - `phase: 'team-parent'` (to keep URLs working)
  - `teamParentTopic` field (6 values) for new archive pages
- Resources collection unchanged (still used on `/team-parent/` for now)

### Filter Logic
- All filters use `is:inline` script with plain ES5 JavaScript
- No TypeScript in filter code (per constraints)
- Filters work client-side: each article has data attributes for age, sport, format, title, dek
- Search matches against title and dek (lowercased on page load)
- "All" button starts selected; shows active state with bg-ink + text-paper

### Scaling Notes
- Current capacity: ~100 articles per topic is no problem
- At 1,000 articles: 100+ per topic is expected
- First 24 shown by default; easy to add "Load more" button or pagination links if needed
- Each topic page is statically generated at build time (Astro static paths)
- No database queries needed; all data from content collection

---

## Breaking Changes

**None.** Article URLs remain unchanged:
- Old: `/drive-home/the-90-second-rule/` → Still works
- New: Articles can now also appear at `/reads/game-day/` (topic landing)
- Team parent articles: new phase value `'team-parent'` added to enum (old phases still work)

---

## Migration Notes for Content

### Existing Reads Articles
- No action required. Articles with `topic` field already set will appear on both:
  - Old `/reads/` (if you revert back)
  - New `/reads/` and `/reads/[topic]/`

### Team Parent Content Strategy
**Phase 1 (current):**
- Resources stay in `src/content/resources/`
- Old `/team-parent/` shows both old resources sections AND new topic grid (side-by-side)
- New `/team-parent/[topic]/` pages only show articles (empty if no articles tagged with `teamParentTopic`)

**Phase 2 (future):**
- Tag existing team parent articles with `teamParentTopic` field
- Move important resources into articles collection with `phase: 'team-parent'` + `teamParentTopic`
- Remove old TEAM_PARENT_CATEGORIES sections from layout

### Adding a Team Parent Article
Template:
```yaml
---
title: "..."
dek: "..."
phase: "team-parent"
teamParentTopic: "logistics"  # or communication, money, picture-day, conflict, tools
sport: "multi-sport"
age: "all-ages"
format: "note"
publishedAt: 2026-05-01
---
```

---

## What Still Works

- Article individual pages: `/drive-home/[slug]/`, `/team-parent/[slug]/` (resource)
- Existing Reads topic field and landing page (old pattern)
- Search, coaching tips, what-to-buy, camps, homepage
- All existing article URLs preserve the phase system

---

## Testing Checklist

Before deploying, verify:
1. `/reads/` renders with latest 6 + 3×3 grid (no errors on empty topics)
2. `/reads/communication/` (or any topic) renders with filters working
3. Age filter hides/shows articles correctly
4. Sport dropdown filters (pick one, clear it)
5. Format toggle filters (note vs essay)
6. Search filters on title and dek (case-insensitive)
7. `/team-parent/` shows new topic grid + old resource sections
8. `/team-parent/logistics/` (etc) renders (likely empty until content tagged)
9. Build succeeds: `npm run build`
10. No console errors or TypeScript type issues

---

## Future Enhancements

- Add pagination UI to topic pages once articles exceed 24 per page
- Wire up "Load more" button if needed
- Add "Related articles" section to individual article pages
- SEO: add structured data for breadcrumbs, collections
- Analytics: track which topic cards are clicked most
- Personalization: remember last-selected filters per topic

---

## Questions for Jeff

- Should `/team-parent/[topic]/` pages wait for content to be tagged, or populate from resources?
- Want pagination UI now or wait until it's needed?
- Should hero images be required for article cards, or optional (current: optional)?
