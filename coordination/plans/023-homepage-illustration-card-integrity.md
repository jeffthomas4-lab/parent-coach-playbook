# Plan: Restore Homepage Illustration Card Integrity

---

**Plan ID:** 023  
**Author:** Codex, Strategic Software Architect and Senior Code Reviewer  
**Date:** 2026-08-04  
**Status:** Ready for Claude implementation after clean-worktree selection  
**Priority:** Public UI hotfix

## Objective

Restore the Parent Coach Desk homepage sport cards so each image, AI-origin label, sport name, and guide CTA render as one coherent card at every breakpoint. Remove the invalid nested-link contract that caused Chrome to split linked illustration cards into separate grid cells, without weakening the site's AI-transparency metadata or adjacent visible-label requirement.

## Confirmed root cause

This is not an image-load failure and not a CSS grid gap.

- Live production inspection on 2026-08-04 shows the sports grid contains three direct grid items per sport: an empty card link, a separate illustration wrapper, and a separate text wrapper. The eight intended cards therefore become 24 auto-placed grid items.
- On the visible desktop page, Baseball's empty card occupies the first column, its illustration occupies the second, and its title/CTA occupy the third. The same parser recovery repeats for every sport.
- Production commit `ef7cd3bf` (`feat: disclose AI-assisted editorial content`) changed `src/components/Illo.astro` to emit `AI-generated illustration. <a href="/ai-transparency/">Details</a>` after each image.
- `src/pages/index.astro` already places `Illo` inside outer card anchors for the sport grid, the Three Drives cards, and the featured long-read card.
- HTML does not permit an anchor inside another anchor. Chrome closes the outer card anchor before the inner transparency anchor, then reparents the remaining media and copy as siblings. Astro's source can look balanced while the browser's parsed DOM is broken.
- The AI content register requires an adjacent visible label plus data attributes. It does not require every individual illustration label to contain its own link. A sitewide `How AI is used` link already exists in `AIContentNotice.astro`, with a permanent footer link as a second route.

## Safe baseline and authority

- Current local checkout: branch `main`, SHA `02f78b70ea9f604e3e82da3f1e89ad7278b63a35`.
- Current remote authority observed: `origin/main` at `991da3bf`.
- Local `main` is ahead 15 and behind 13 and contains unrelated modified, deleted, and untracked work.
- Do not reset, clean, stage, overwrite, or absorb the existing dirty work.
- Implement from a clean worktree based on the reviewed current release authority, normally fresh `origin/main`, unless Jeff explicitly selects a different candidate. Record the starting SHA in the handoff.
- Do not touch any MedConfRadar confidential surface.

## Scope

### Primary files

- `src/components/Illo.astro`
- `src/pages/index.astro`
- `scripts/check-ai-transparency.mjs`
- `tests/illustration-card-integrity.test.ts` or the repository's nearest existing public-UI contract test location

### Required call-site audit

Audit every `Illo` use, not only the reported Baseball tile. As of the inspected release branch, the component is used in:

- homepage backgrounds, sport cards, Three Drives cards, and featured long read;
- article and pillar heroes;
- body, camps, cost-calculator, newsletter, parent-coach, pathways, team-parent, and youth-sports-pendulum pages;
- newsletter and lead-magnet components.

The hotfix must specifically close both failure classes introduced by the shared component:

1. invalid nested interaction when `Illo` is rendered inside an outer anchor;
2. disclosure labels participating in normal flow or being clipped when the image is absolutely positioned or inside a fixed-aspect `overflow-hidden` media frame.

## Non-goals

- redesigning the homepage or changing its four-column/two-column responsive pattern;
- removing AI-origin metadata, the adjacent visible label, the sitewide notice, or the transparency page;
- changing illustration assets, sport ordering, copy, routes, or analytics;
- deploying, merging, pushing, or mutating provider state without Jeff's release approval;
- folding unrelated dirty-worktree changes into the hotfix.

## Architectural decision

`Illo.astro` must become a non-interactive media primitive.

1. Keep the responsive `img`, intrinsic dimensions, loading behavior, `aria-describedby`, `data-ai-origin`, and `data-ai-disclosure-id` contract.
2. Keep an adjacent visible `AI-generated illustration.` label.
3. Remove the per-instance anchor from `Illo.astro`. A reusable media primitive must never silently add an interactive descendant because callers legitimately place it inside linked cards.
4. Add a narrowly named disclosure-positioning API, such as `disclosureClass`, so callers can position the non-interactive label without changing the image's existing `class` API.
5. Default disclosure rendering should remain visible and in normal flow for standalone figures.
6. Linked card media frames should use a positioned wrapper and an overlay disclosure class with a readable solid or sufficiently opaque background. The label remains visible but cannot create a second focus target or split the card anchor.
7. Absolutely positioned background illustrations should use an explicit positioned disclosure treatment so their labels do not add unintended section height or disappear behind the content wash.
8. Retain the sitewide `How AI is used` link and footer link as the interactive paths to `/ai-transparency/`. Do not create a stretched-link/pointer-events workaround around nested anchors.

This keeps semantics simple: one card, one destination, one keyboard focus stop, one non-interactive origin label.

## Step-by-step implementation

### Phase 0 - reproduce and protect the baseline

1. Create or select a clean worktree at the reviewed release SHA; capture `git status --short --branch` and `git rev-parse HEAD`.
2. Reproduce the current build locally before editing if the release commit builds in the selected worktree.
3. Record the broken DOM contract: the homepage sport grid has 24 direct children for eight sports, empty sport anchors exist, and the Baseball image/title do not share the Baseball card anchor.
4. Confirm the same invalid nesting affects the Three Drives and featured long-read linked illustration cards.

### Phase 1 - make the shared component safe

5. Update `Illo.astro` so it emits no anchor or other interactive element.
6. Preserve the generated disclosure ID and the image's `aria-describedby` relationship.
7. Preserve `data-ai-origin="ai_generated"` and `data-ai-disclosure-id="pcd-illustration-2026-08-03"` unchanged unless a separately approved transparency migration says otherwise.
8. Render the adjacent label as plain text and allow a caller-supplied disclosure class in addition to the component's base typography/contrast classes.
9. Ensure the disclosure class input cannot replace the baseline accessible label or remove required data attributes.

### Phase 2 - repair homepage card composition

10. In the sport-card map, keep one outer anchor per sport and one card wrapper per grid cell.
11. Add `relative` positioning to the fixed-aspect media frame and apply the component's overlay disclosure treatment inside that frame. Keep the media frame clipped; keep the caption visibly overlaid rather than laid out beyond the fixed aspect box.
12. Verify the image, label, sport heading, and Guide CTA remain descendants of the same sport anchor.
13. Apply the same linked-card treatment to the Three Drives cards.
14. Apply the same treatment to the featured long-read card, preserving its desktop image/text order and mobile stacking.
15. Review hover and focus styles after removing the nested Details link. The outer link must retain a visible keyboard focus state; do not rely only on hover color.

### Phase 3 - audit non-card illustration contexts

16. For each absolutely positioned homepage/tool/newsletter background illustration, explicitly position the non-interactive disclosure label so it neither contributes normal-flow height nor hides behind the wash layer.
17. For standalone figures and article heroes, keep the adjacent label visible below the image unless an existing accessible overlay treatment is clearer.
18. Check that long alt text plus `aria-describedby` remains understandable and that each rendered disclosure ID is unique on its page.
19. Do not suppress labels merely to make screenshots cleaner; the register promises adjacent visible labels.

### Phase 4 - regression protection

20. Strengthen `scripts/check-ai-transparency.mjs` so it verifies:
    - the illustration data attributes remain present;
    - the adjacent `AI-generated illustration.` label remains present;
    - `Illo.astro` does not emit an anchor;
    - the sitewide and footer transparency links remain present.
21. Add a focused test for the homepage source/component contract. At minimum, it must fail if `Illo` becomes interactive again or if the sport-card media/copy moves outside the sport card.
22. Add a rendered-DOM assertion against the built homepage. Do not rely solely on matching Astro source text, because the original defect was created by browser HTML parser recovery. Assert:
    - exactly eight sport card anchors under the sports grid;
    - exactly eight direct card grid items, not 24;
    - no empty sport anchors;
    - no nested anchors anywhere in the affected cards;
    - each card contains one image, one origin label, one `h3`, and the Guide CTA;
    - the Baseball image and Baseball heading resolve to the same `/sports/baseball/` card.
23. Add equivalent rendered checks for the three Three Drives cards and the featured long-read card.

## Verification matrix

### Automated

- `npm.cmd run check:ai-transparency` if the checker is exposed as a package script; otherwise run `node scripts/check-ai-transparency.mjs` and add the missing package script if consistent with repository conventions.
- focused illustration/card test;
- `npm.cmd run test:unit` or the smallest suite containing the new test;
- `npm.cmd run check`;
- `npm.cmd run build`;
- `git diff --check`.

Do not report the hotfix as locally verified if Astro check/build is skipped or fails.

### Browser and accessibility

Verify a fresh local production build, not only dev-mode source.

- Desktop at the reported 1920 x 1080 class of viewport: four cards per row; Baseball is the first card; its picture is on top of its own white card; name and CTA are directly below it.
- Mobile at 390 x 844: two cards per row; each image/caption/title/CTA stays together; no horizontal overflow.
- Keyboard: one focus stop per linked card, visible focus indicator, Enter follows the correct sport URL.
- Screen reader/DOM: image alt remains intact; the image points to a unique adjacent origin label; the card has one unambiguous destination.
- Visual: disclosure overlay has readable contrast and does not obscure the image's primary subject or the card title.
- Regression surfaces: Three Drives, featured long read, hero backgrounds, an article hero, newsletter, cost calculator, and one pillar page.

## Acceptance criteria

- The production-shaped homepage sports grid renders eight coherent cards with no blank cells.
- Baseball's image is inside and above the Baseball title in the leftmost first card at desktop width.
- No `Illo` rendering can introduce a nested anchor.
- Every illustration retains required AI-origin attributes and an adjacent visible origin label.
- The global `/ai-transparency/` routes remain visible and keyboard accessible.
- Desktop and mobile layout, hover, focus, image loading, and responsive `srcset` behavior pass.
- Tests prove the browser-parsed DOM, not only the authored Astro tree.
- The hotfix commit contains no unrelated user changes.

## Release and recovery

1. Produce one narrow hotfix commit from the clean release worktree.
2. Record the commit SHA and automated/browser evidence in the handoff.
3. Jeff retains approval for merge, push, and production deployment.
4. After an approved deploy, verify `https://parentcoachdesk.com/` with redirects followed, a fresh browser load, and the same DOM/layout assertions. A successful local build is not production acceptance.
5. If production fails any acceptance check, roll back the hotfix deployment to the last known-good release and preserve the failed HTML/screenshot evidence for diagnosis.

## Claude handoff summary

Start at the current release authority in a clean worktree. The bug is invalid nested anchors introduced by the per-image Details link in `Illo.astro`, not grid CSS. Make `Illo` non-interactive, keep the adjacent visible origin label, explicitly position that label for clipped/absolute media, repair all linked homepage illustration cards, and validate the browser-parsed DOM at desktop and mobile widths before requesting release approval.
