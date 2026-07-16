# Review: build stability

**Date:** 2026-07-15
**Reviewer:** Codex
**Plan:** 008
**Verdict:** Approved

## Independent assessment

The implementation is intentionally smaller than a content-loading redesign. Route evidence shows a genuinely large static build: 4,060 HTML pages, of which 1,816 are protected admin previews. The adapter had been using the Astro 6+ default workerd prerender bridge, while Astro already used its memory-conservative page concurrency default of one and the application had no `astro:assets` call sites. Switching only build-time prerendering to Node directly addresses the migration-era runtime change without removing previews, changing public URLs, or increasing a process heap by shell convention.

The adapter option is supported by `@astrojs/cloudflare` 14.1.3. It does not change execution of on-demand routes, which remain on workerd. The comment and plan explicitly preserve that boundary.

## Evidence

| Validation | Result |
|---|---|
| `npm.cmd run check` with `NODE_OPTIONS` absent | Exit 0; 0 errors, 0 warnings, 349 hints |
| First full `npm.cmd run build` with `NODE_OPTIONS` absent | Exit 0; 95.4 seconds |
| Repeat full `npm.cmd run build` with `NODE_OPTIONS` absent | Exit 0; 68.3 seconds |
| Generated HTML | 4,060 files |
| Admin preview HTML | 1,816 files |
| Generated tracked churn | Manifest timestamp only; reverted |

## Risk disposition

- Admin preview expansion is a major contributor to build scale, but removing it or moving it to SSR would either remove an approved workflow or expand the runtime bundle. Neither is justified by this stabilization task.
- Repeated `getCollection()` calls add CPU/allocation work, especially in article layouts, but two default-heap builds now pass. Refactoring those calls would be a broader performance optimization without evidence it is needed for stability.
- Image processing is not the cause: OG generation occurs before Astro, `astro:assets` is unused, and route generation was the failing phase.
- Staging deployment is not useful for this build-time-only option. Static route counts are unchanged and runtime routes are unaffected.

## Approval boundary

Approved for local commit. No push or production deployment. No shared D1/R2 access or mutation occurred.
