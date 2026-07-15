# Plan: Astro stabilization

**Plan ID:** 003
**Author:** Codex
**Date:** 2026-07-15
**Status:** Completed

## Objective

Remove the duplicate SSR route and clear all current Astro type-check errors without changing the intended public camps URLs.

## Tier

Tier 2. This changes route source ownership and null handling but does not change data models, bindings, production state, or authorization.

## Business outcome

The application can pass Astro's validation gate, and state camp pages retain one unambiguous route implementation before Astro upgrades make the current collision a build failure.

## Current-state evidence

- Verified by tests on 2026-07-15: `npm run check` reports four errors and the `/camps/[slug]` versus `/camps/[state]/index` SSR collision.
- Verified in code on 2026-07-15: `src/pages/camps/[slug].astro` already dispatches two-letter state codes and contains the state landing presentation.
- Not verified: production behavior and deployed source revision.

## Scope

- Keep `src/pages/camps/[slug].astro` as the sole owner of single-segment camp and state URLs.
- Remove the redundant state route.
- Make content-body inspection safe when Astro content entries omit `body`.
- Run Astro check, TypeScript checks, tests, and a production build; inspect generated-file changes before committing.

## Non-goals

- No warning/hint cleanup beyond errors blocking the validation gate.
- No content, schema, dependency, Cloudflare binding, D1, deployment, or production changes.
- No redesign of camp URLs.

## Files likely affected

- `src/pages/camps/[state]/index.astro`
- `src/pages/coaching-tips/[slug].astro`
- `src/pages/pillar/[slug].astro`
- `src/pages/what-to-buy/[slug].astro`
- `src/layouts/ArticleLayout.astro`
- This plan and the related coordination handoff/review record if required by the protocol.

## Step-by-step implementation

1. Remove the redundant state route after confirming the slug route contains equivalent state dispatch and rendering.
2. Default optional content bodies to an empty string only at inspection sites.
3. Rerun Astro check and address any remaining blocking diagnostic with a minimal change.
4. Run TypeScript checks, Vitest, and the production build.
5. Inspect generated and source diffs, record evidence, and commit explicit paths only.

## Testing strategy

- `npm run check` must exit 0 and show no route collision.
- `npx tsc --noEmit -p tsconfig.verify.json` must exit 0.
- Worker-cron's existing type-check command must exit 0.
- `npm test` must pass.
- `npm run build` must exit 0; generated-file changes must be reviewed rather than blindly committed.

## Acceptance criteria

- Exactly one SSR route owns `/camps/<single-segment>/`.
- State-code requests remain handled by `src/pages/camps/[slug].astro`.
- Optional `body` fields cannot throw during string inspection.
- All validation commands above pass, or an external/tooling limitation is documented with evidence.
- No push, deployment, migration, or production operation occurs.

## Human approval gates

Jeff approved local implementation by directing Codex to start this pass. Any push, deployment, production access/change, migration, binding/secret change, or publishing remains separately gated.

## Open questions

None.

## Completion evidence

- `npm run check`: passed; 0 errors, 0 warnings, 350 non-blocking hints; no duplicate SSR route warning.
- `npx tsc --noEmit -p tsconfig.verify.json`: passed.
- `npx tsc --noEmit -p worker-cron/tsconfig.json`: passed.
- `npm test`: 27 files and 232 tests passed.
- `npm run build`: passed; 805 OG images unchanged and `public/link-manifest.json` regenerated with the current source inventory.
- No push, deployment, migration, binding/secret change, or production operation performed.
