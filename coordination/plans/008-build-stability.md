# Plan: build stability

**Plan ID:** 008  
**Author:** Codex  
**Date:** 2026-07-15  
**Status:** Complete

## Objective

Make the full Astro build complete reliably without a caller-supplied 8 GB `NODE_OPTIONS` workaround, while preserving generated output and Cloudflare runtime behavior.

## Tier

Tier 2. This is a bounded build-configuration stabilization with no data, binding, secret, schema, authentication, or production change.

## Business outcome

Local and CI builds have a repeatable supported configuration, reducing the risk that a production-ready change cannot be built or deployed from a clean environment.

## Current-state evidence

- **Verified in code, 2026-07-15:** branch `migration/pages-to-workers-staging` is clean at commit `8d0e4d8`; `package.json` runs manifest generation, optional OG generation, then `astro build`; CI invokes that same script on Node 20.
- **Verified in code:** Astro 7.0.9 and `@astrojs/cloudflare` 14.1.3 default static output to the Cloudflare adapter's workerd prerender environment. No build concurrency override exists, so Astro's supported default of one page applies.
- **Verified from generated output:** the current build contains 4,060 HTML files; 1,816 are protected admin preview pages. Content collections contain 1,852 Markdown entries, including 805 articles and 577 coaching tips.
- **Verified in code:** the application does not use `astro:assets`; OG images are generated before Astro starts and existing image-service configuration compiles build assets without a Cloudflare Images runtime binding.
- **Verified by prior build evidence:** two default-memory builds exited during prerendering, while the same source completed with `--max-old-space-size=8192` and produced roughly 9,232 assets.
- **Confirmed live, 2026-07-15:** staging version `88711555-7f3b-4123-bec6-098075f2a095` is active; production was not deployed.

## Scope

Test the adapter's supported Node prerender environment, validate output and memory stability with no caller-supplied heap flag, retain it only if the full build succeeds, and update CI/build documentation and coordination evidence as required.

## Non-goals

- Do not remove or convert admin previews to SSR.
- Do not redesign content loading or page taxonomy without evidence that the adapter setting is insufficient.
- Do not change build concurrency, D1/R2/KV data, bindings, secrets, Access, cron, production, bot controls, or DMARC.
- Do not deploy staging unless generated output or runtime behavior changes materially and read-only verification adds value.

## Files likely affected

- `astro.config.mjs`
- `coordination/CURRENT_STATE.md`
- `coordination/plans/008-build-stability.md`
- `coordination/reviews/2026-07-15-build-stability.md`
- `coordination/HANDOFF.md` and one immutable handoff record

## Step-by-step implementation

1. Record route, collection, generated-output, package-script, adapter, and CI evidence.
2. Set `prerenderEnvironment: 'node'` in the Cloudflare adapter. This changes only build-time rendering of static pages; on-demand routes remain workerd-rendered.
3. Run `npm run check` and a full `npm run build` with `NODE_OPTIONS` absent. Capture exit code, elapsed time, generated file counts, and Git changes.
4. If the build still exhausts memory, revert the adapter experiment and use a repository-owned cross-platform Node launcher with an explicit bounded heap only after measuring the smallest reliable ceiling. Do not add a shell-specific environment assignment.
5. Compare generated output shape and inspect any tracked generated churn. Revert timestamp-only `public/link-manifest.json` churn.
6. Update coordination evidence, independently review the bounded diff, commit locally, and confirm a clean worktree.

## Testing strategy

- `npm run check`
- `npm run build` from a process with no inherited `NODE_OPTIONS`
- Generated HTML/admin-preview counts and server/client output inspection
- `git diff --check` and bounded diff review
- No live data acceptance test is needed because prerender environment does not affect SSR runtime behavior or bindings.

## Acceptance criteria

- `npm run check` exits 0.
- A full `npm run build` exits 0 without the caller setting `NODE_OPTIONS`.
- Generated route/output counts remain consistent with the baseline; no preview or public content route is intentionally removed.
- No source-generated timestamp-only churn is committed.
- No production deployment or shared-data mutation occurs.
- The completed work is committed locally and the worktree is clean.

## Human approval gates

Jeff already approved implementation and optional staging deployment for this task. Production deployment, push, binding/secret changes, and shared-data mutation remain prohibited without new explicit approval.

## Open questions

None. The experiment has a defined fallback and rollback.

## Execution evidence

- `npm.cmd run check` with `NODE_OPTIONS` removed: exit 0; 0 errors, 0 warnings, 349 hints.
- First `npm.cmd run build` with `NODE_OPTIONS` removed: exit 0 in 95.4 seconds; Astro route generation completed in 54.95 seconds and the server build completed in 1m28s.
- Repeat `npm.cmd run build` with `NODE_OPTIONS` removed: exit 0 in 68.3 seconds; Astro route generation completed in 42.74 seconds and the server build completed in 59.95 seconds.
- Generated output retained 4,060 HTML files and 1,816 admin preview HTML files. No route family was removed.
- `public/link-manifest.json` changed only in `generatedAt`; that timestamp-only churn was reverted.
- No staging or production deployment occurred. Staging was unnecessary because the option affects only the build-time environment; on-demand routes still run in workerd and prerendered pages remain static assets.
