# Rendered Mobile-Web Audit — 2026-07-16

## Scope

Read-only browser inspection of the current public production site. No form was filled or submitted, no consent choice was stored, and no administrative page or API mutation was invoked. Viewport overrides were reset after testing.

## Evidence state

- **Verified live:** rendered production DOM and visual viewport behavior.
- **Verified source:** current local source constraints and automated contracts.
- **Unverified candidate:** local candidate rendering could not be reached from the isolated in-app browser, so source differences are not treated as rendered proof.

## Results

| Journey/page | 320 CSS px | 390 CSS px | Result |
|---|---:|---:|---|
| Camp directory `/camps/` | document client width 305; scroll width 430 | document client width 375; scroll width 426 | **Fail: horizontal page scrolling** |
| Camp submission `/camps/submit/` | scroll width equals client width | not sampled | Pass for horizontal reflow only |
| Camp suggestion `/camps/suggest/` | scroll width equals client width | not sampled | Pass for horizontal reflow only |
| Trust/correction `/trust/` | scroll width equals client width | not sampled | Pass for horizontal reflow only; structured form remains feature-gated |
| Privacy/disclosure `/disclosure/` | scroll width equals client width | not sampled | Pass for horizontal reflow only |
| Accessibility `/accessibility/` | scroll width equals client width | not sampled | Pass for horizontal reflow only; deployed claim copy predates local correction |

## Camp-directory failure detail

The live directory filter controls exceed the mobile content width. At 320px, date controls extend to approximately 430px and the ZIP/radius/search row to approximately 420px. At 390px, the same groups extend to approximately 426px and 420px. The browser visibly displays a horizontal scrollbar. Leaflet tiles also extend outside their map viewport by design; they were distinguished from the page-level filter overflow.

Current local source contains newer `minmax(0,1fr)`, `min-w-0`, `max-w-full` and `flex-wrap` constraints that are absent from the live DOM classes observed during this audit. Those changes may address the issue, but the candidate must be rendered at all contract widths before the stop-ship finding can close.

## Additional observations

- The mobile navigation, heading and consent banner render legibly in the initial viewport.
- Several inline links and the menu control have visual boxes below 24px high. Text links can qualify for WCAG target-size exceptions, but the menu control and spacing need manual target-size review against WCAG 2.2 success criterion 2.5.8.
- The skip link is intentionally collapsed until focused and should not be counted as a small visible target.
- This audit did not establish keyboard operation, screen-reader output, 200% zoom, landscape behavior, virtual-keyboard behavior, reduced motion, Core Web Vitals or full journey completion.

## Gate status

Mobile release evidence remains **pending**. The live camp-directory horizontal-scroll failure is a customer-facing release blocker under `automation/mobile-web-contract.json`. Required next evidence is a clean candidate render at 320/360/390/430px, landscape and 200% zoom, followed by keyboard, touch, screen-reader sample and constrained-network checks.

## Fresh production-candidate evidence, 2026-07-16 11:39 Pacific

The stale local Wrangler processes from the earlier attempts were identified by exact command line and stopped without touching unrelated processes. `npm run check:production-manifest` then completed successfully: the production Astro build finished and the generated deployment manifest passed identity, binding, Access-variable, observability, safe-feature-default and WorkOS-proof exclusion checks.

The exact built Worker was served locally from `dist/server/wrangler.json`. The in-app browser reached `/camps/` and measured the following rendered candidate state:

| Viewport | Document client width | Document scroll width | Page overflow | Non-Leaflet offenders |
|---:|---:|---:|---:|---:|
| 320 | 305 | 305 | 0 | 0 |
| 360 | 345 | 345 | 0 | 0 |
| 390 | 375 | 375 | 0 | 0 |
| 430 | 415 | 415 | 0 | 0 |

At 320px, no visible `button`, `input`, `select`, or `textarea` measured below 24px in either dimension. The accessible DOM exposed the skip link, named mobile-menu control, one H1, main landmark, consent dialog with named choices, and footer privacy/removal paths.

**Evidence limitation:** the isolated local D1 contains no directory rows, so the page rendered its empty-state branch and did not render the date-range or ZIP/radius filters responsible for the live overflow. The results above prove the candidate empty-state route and global shell do not overflow; they do not close the populated-directory finding. No synthetic local D1 mutation was performed because the standing safety boundary prohibits D1 mutation without narrower approval. Populated-state rendering, landscape, zoom, keyboard traversal, screen reader, touch and constrained-network evidence remain pending.

## Local candidate execution attempts

Three bounded, non-deploying approaches were attempted and stopped cleanly:

1. Astro development server with telemetry disabled.
2. Astro development server with `HOME`, `USERPROFILE`, configuration and Wrangler log paths redirected to writable test storage.
3. Wrangler 4.110.0 local mode against `wrangler.production.jsonc`, first sandboxed and then with narrowly approved local execution outside the filesystem sandbox.

Astro exited before readiness; the sandboxed Worker build could not resolve the repository entry point across its filesystem boundary; and the approved local Worker process never exposed a responsive listener before termination. The in-app browser therefore continued to receive connection-refused behavior. These are test-environment limitations, not evidence that the candidate passes or fails. No remote binding, deployment, migration, form submission or production mutation occurred.
