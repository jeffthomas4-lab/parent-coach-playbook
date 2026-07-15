# Branch Port Plan — 2026-07-15

Scope: what from `migration/pages-to-workers-staging`'s uncommitted six-lane session lands on `main` tonight, what stays on the branch, and what gets skipped as noise. Read-only analysis. No git, build, or deploy command was executed to produce this. Jeff runs everything below.

---

## 0. A method finding that changes how to read this whole document

`git status --short` and `git diff` were run from this sandbox and are **not fully trustworthy** for files this session touched. Proof: `src/layouts/BaseLayout.astro`, `worker-cron/src/index.ts`, and `src/pages/camps/[slug].astro` all read as **identical to `HEAD`/`main`** under `git diff` and are absent from `git status --short` — yet the Read tool (which reads the real file, per the verification report's own method note) shows all three carrying real, session-dated edits, and two independent lane reports (SEO, Infra) confirm editing two of them by name.

The mechanism: this sandbox's bash mount serves a stale snapshot for files edited mid-session. Git computes diffs by hashing the working-tree file it can see, so when the mount is stale, **git itself gets the wrong answer, not just `cat`/`grep`.** This is worse than the verification report's own finding (it named `worker-cron` and three test files; it did not catch `BaseLayout.astro` or `camps/[slug].astro`).

**Consequence:** the file inventory below is cross-checked against the six lane reports' own "files touched" claims plus targeted Read-tool spot checks, not a single trusted `git status`. It is best-effort, not exhaustive — some doc-only edits the lanes mention in prose (`STANDARD-AUDIT.md`, `SECURITY-AUDIT.md`, `PCD-OPERATING-MANUAL.md`, `KIT_SETUP.md`) don't appear in this sandbox's `git status --short` at all, for the same reason.

**This does not carry over to Jeff's real machine.** The staleness is a sandbox artifact. When Jeff runs `git status --short` on Windows before the commit step, he will get the true, complete answer — that command is the actual source of truth, not this report's file list. **Run it first and eyeball it against the "files touched" sections of the six lane reports before trusting the block below to `git add -A` everything.**

---

## 1. File classification

### 1a. DEPLOY-SAFE — ported tonight, verbatim or by small patch

| File | Why safe |
|---|---|
| `src/lib/camps-db.ts` | One clean addition (`countRecentSubmissionsByEmail`), confirmed by direct diff against `main`: single hunk, no binding code, `main`'s base is untouched by any migration commit. |
| `src/lib/email.ts` (new) | Pure module — takes `env` as a parameter, no `cloudflare:workers` import. Ships in STAGE mode by default (nothing sends without `EMAIL_MODE=send`). |
| `src/lib/publish.ts` (new) | Pure module, same shape. |
| `src/lib/slack.ts` (new) | Pure module, same shape. |
| `tests/api/email.test.ts`, `tests/api/publish-lib.test.ts`, `tests/api/slack-lib.test.ts` (new) | Each imports directly from its `src/lib/*` file, not from a route. No `cloudflare:workers` dependency. |
| `tests/helpers/slack-sign.ts` (new) | Helper for the slack-lib test above. |
| `tsconfig.verify.json` (new) | Standalone tsc config excluding `worker-cron`/`activityradar-archive`. Inert until someone runs it. |
| `worker-cron/src/index.ts`, `worker-cron/wrangler.toml`, `worker-cron/package.json`, `worker-cron/README.md` | Standalone Cloudflare Worker, zero Astro/adapter dependency, deploys separately (`npx wrangler deploy` from `worker-cron/`). Infra lane's failure-policy rewrite (throw instead of swallow on missing `CRON_KEY`/`SWEEP_URL`). Confirmed via Read tool — git shows this as unchanged, which is the exact stale-mount trap the verification report warned about for this file by name. |
| `automation/APPROVAL-MATRIX.md`, `automation/RUN-LOG.md`, `automation/agents/{hal,ranger,vera,sunny}/{SPEC,SKILL}.md`, `automation/agents/nora/tools/redirect-fixer.mjs` | Docs and one human-gated, no-op-by-default Node script. No site-code risk. |
| `PCD-OPERATING-MANUAL.md`, `STANDARD-AUDIT.md`, `SECURITY-AUDIT.md`, `BACKUP.md`, `KIT_SETUP.md`, `KIT_DRIP_SETUP.md`, `kit-emails/*.md`, `reports/**`, `PCD-AUTOMATION-AUDIT-2026-07-14.md`, `scripts/backup-activity-radar.ps1`, `scripts/BACKUP-PROVING-LOG.md` | Docs, reports, one PowerShell script. Always safe per the Deployment norm. Several of these did not show as modified in this sandbox's `git status` (see §0) — verify the full doc list against the lane reports before the commit step. |
| `public/og-camps/*.jpg` (37 files) | New static images, zero API cost, unused by any page until the camps-page OG wiring lands (see §1b). Harmless to ship early. |

**Excluded from the doc-safe bucket on purpose:** `PAGES-TO-WORKERS-MIGRATION-BRIEF.md` stays branch-only — it documents the migration itself and `main` already has an earlier snapshot of it from commit `3bb1b3c`. `PCD-AI-OS/` and `coordination/` (new, untracked directories, 6 and 8 files) are **not attributed to any of the six lane reports or the verification pass** — nothing explains what wrote them. Preserve them on the migration branch (`git add -A` will pick them up), but do not port them to `main` without confirming with Jeff what they are.

### 1b. PRIORITY PASSENGER — the 500 fix, patched not copied

`src/pages/camps/[slug].astro` does **not** apply cleanly to `main` as a file. Confirmed: the current branch copy imports `env` from `cloudflare:workers` (the Workers binding style, committed to the migration branch in `a208e96` on 2026-07-14 — before tonight's session), while `main`'s copy still reads `(Astro.locals as any).runtime?.env` (the Pages binding style). A blind `git checkout` of this file onto `main` would ship an import (`cloudflare:workers`) that `main`'s Astro 5 / `@astrojs/cloudflare` v12 adapter does not provide — a hard build break, not a soft one.

The null-safety fix itself is small and has zero binding dependency. It is a straight text replacement, verified against both files directly:

**`main`'s current text** (`src/pages/camps/[slug].astro`, the block right after the `MONTHS_LONG` array):

```ts
const fmtDate = (s: string) => {
  const [y, m, d] = s.split('-').map(Number);
  return `${MONTHS_LONG[m - 1]} ${d}, ${y}`;
};

const fmtRange = (start: string, end: string) => `${fmtDate(start)} – ${fmtDate(end)}`;
```

**Replace with** (verified working on the migration branch, verification pass 2026-07-15):

```ts
// Null-safe. 296 approved programs carry a null session_start_date or
// session_end_date (verified in activity-radar D1, 2026-07-15), and the
// expired-camp redirect above only fires on a non-null end_date, so those rows
// fall through to render here. Calling .split() on a null threw a TypeError in
// SSR frontmatter and returned a live HTTP 500 on every one of them.
const fmtDate = (s: string | null | undefined): string | null => {
  if (!s) return null;
  const [y, m, d] = s.split('-').map(Number);
  if (!y || !m || !d || !MONTHS_LONG[m - 1]) return null;
  return `${MONTHS_LONG[m - 1]} ${d}, ${y}`;
};

// Degrade in stages rather than crash: both dates, one date, or an honest
// placeholder. Never invent a date we do not have.
const fmtRange = (start: string | null | undefined, end: string | null | undefined): string => {
  const a = fmtDate(start);
  const b = fmtDate(end);
  if (a && b) return `${a} – ${b}`;
  if (a) return `Starts ${a}`;
  if (b) return `Through ${b}`;
  return 'Dates to be announced';
};
```

This is the whole fix. It does not require touching the two call sites in the render body (`fmtRange(camp.start_date, camp.end_date)`) — they already call the function with the same arguments and now degrade instead of throwing.

**Deliberately not ported alongside it:** the Event/BreadcrumbList JSON-LD, the `CAMP_SPORTS`-based OG image swap, and the explicit slug-built canonical that the SEO lane added to this same file. All three are real and tested, but they are layered onto the migration-coupled binding version of the file (they reference `cfEnv`, `CAMP_SPORTS` imported alongside the binding-era import line, and `campOgImage`), so porting them means the same hand-translation problem, just for more surface area. They stay on the branch for a dedicated follow-up. `camps/index.astro`'s ItemList/BreadcrumbList JSON-LD is the same story — that file is migration-coupled too — and stays branch-only tonight.

### 1c. SEO PASSENGER — the canonical fix, patched not copied

`src/layouts/BaseLayout.astro` is the second file `git diff` falsely reports as unchanged (see §0). Confirmed via Read tool it carries the SEO lane's trailing-slash canonical fix, and confirmed this file has **zero** binding dependency — safe to patch directly.

**`main`'s current text:**

```ts
const pageTitle = title ? `${title} | ${SITE.name}` : `${SITE.name}: ${SITE.tagline}`;
const canonicalUrl = canonical ?? new URL(Astro.url.pathname, SITE.url).toString();
const ogImageUrl = new URL(ogImage, SITE.url).toString();
```

**Replace with:**

```ts
const pageTitle = title ? `${title} | ${SITE.name}` : `${SITE.name}: ${SITE.tagline}`;
const rawCanonical = canonical ?? new URL(Astro.url.pathname, SITE.url).toString();
// Force one canonical form site-wide: trailing slash, matching how every
// internal link on the site is written (ArticleLayout, camp pages, nav,
// footer). Prerendered routes already normalize Astro.url.pathname to the
// trailing-slash form at build/route-match time, so this was a no-op there.
// SSR routes (prerender = false: camps/*, camps/index, camps/[state]/*)
// mirror the literal incoming request path, so the same URL crawled with
// and without a trailing slash was self-referencing two different
// canonicals -- confirmed live 2026-07-15 on /camps/[slug] (both forms
// return 200 with distinct canonical tags). This is the trailing-slash
// canonical inconsistency named in the 2026-07-12 Organic Search Audit.
// Skip file-type routes (sitemap.xml, .jpg, etc.) -- none of them render
// through BaseLayout today, but the guard costs nothing.
const canonicalUrl = /\.[a-z0-9]+$/i.test(rawCanonical) || rawCanonical.endsWith('/')
  ? rawCanonical
  : `${rawCanonical}/`;
const ogImageUrl = new URL(ogImage, SITE.url).toString();
```

This one is genuinely systemic (every prerendered page already normalized correctly; this only changes behavior on SSR routes, which today means the camps pages) — worth landing even without the JSON-LD work.

### 1d. DEFERRED — real, tested, but unsafe to blind-port tonight

| Feature | Files | Why deferred |
|---|---|---|
| Access JWT signature verification | `src/lib/access-jwt.ts` (new), `src/lib/admin-auth.ts` (async upgrade), `tests/api/access-jwt.test.ts`, `tests/api/admin-auth.test.ts`, `tests/helpers/access-token.ts` | `requireAdmin()` goes from sync to async. Landing the new `admin-auth.ts` without updating every caller to `await` it produces `auth instanceof Response` → `false` and `auth.email` → `undefined` on a raw `Promise` object — a silent admin-auth hole, not a build error. The ~22 real callers (12 API routes, 10 admin `.astro` pages) are today migration-diverged on this branch (`cloudflare:workers` binding), so they can't be blind-copied either. This needs a dedicated small session directly against `main`'s own files, not a paste-block edit across 22 files at 6am. |
| `POST /api/agent-runs` (the run-log wire) | `src/pages/api/agent-runs.ts` (route only — `src/lib/agent-runs.ts` is portable and listed in §1a) | Route imports `cloudflare:workers` directly. One-line-pattern swap needed (`import { env as cfEnv } from 'cloudflare:workers'` → destructure `locals` and read `(locals as any).runtime?.env`), same translation every migration-committed file already got — mechanical, but a hand job, not a checkout. |
| `tests/api/agent-runs.test.ts`, `tests/helpers/d1.ts` | — | Test imports the route file above directly; deferred with it. |
| Approve-to-publish Slack loop | `src/pages/api/slack/actions.ts`, `src/pages/api/admin/editorial/publish.ts` (routes only — `slack.ts`/`publish.ts` libs are in §1a) | Same `cloudflare:workers` translation needed. |
| `tests/api/slack-actions.test.ts`, `tests/api/admin-editorial-publish.test.ts` | — | Deferred with the routes above. |
| Submission confirmation email wiring | `src/pages/api/camps/submit.ts` | Existing file, already migration-coupled (binding swap committed 2026-07-14, before this session). This session's email-integration diff is ~50 lines layered on top of that. `email.ts` itself ports tonight (§1a); the wiring into `submit.ts` waits for the same dedicated main-branch pass as the JWT and Slack routes. |
| Camp-page JSON-LD / OG image / canonical | `src/pages/camps/[slug].astro` (beyond the fmtDate patch), `src/pages/camps/index.astro` | See §1b. |

**Recommendation:** batch everything in this table into one short, focused main-branch session once tonight's port ships and holds. It is mechanical (the binding swap pattern is proven and repeated 38 times already on the migration branch) but it is exactly the kind of "many files, one wrong keystroke breaks auth or a build" work that deserves its own session with its own test run, not a rider on tonight's block.

### 1e. MIGRATION-COUPLED — stays on the branch, not evaluated for port

`package.json` / `package-lock.json` (Astro 7, Tailwind v4, `@cloudflare/workers-types` v5 — already committed across the 8 migration commits), `wrangler.jsonc` (explicitly staging-only per its own header), `tailwind.config.mjs`, `astro.config.mjs`, `src/styles/global.css`, `src/content.config.ts` (Content Layer API), the 51-file `.slug`→`.id` rename and the 38-file bindings swap (both already committed), `vitest.config.ts` + `tests/mocks/cloudflare-workers.ts` + `tests/helpers/context.ts` (the migration's test harness), every admin `.astro`/`api/admin/**`/`api/camps/**` file whose only role in tonight's diff is the binding swap.

### 1f. NOISE — excluded from the port entirely

Confirmed by sampling: every file below shows a 1:1 removed/added line count with no semantic change (`git diff --stat` on `workers-activity-radar/yelp-worker.ts` — 285 removed, 285 added, zero net) — the signature of CRLF/LF line-ending churn, not session work. None of the six lane reports claims to have touched any of these.

- `buildout/hit-rate-test/out/**` (worklists, review CSVs, `results.jsonl`, archived imports)
- `imports/.vol-submit/part-*.csv` (27 files), `imports/CAMP-SEARCH-LOG.md`, `imports/misses-volleyball-2026-05-09.csv`, `imports/out/camps-import-2026-05-03.sql`
- `PRODUCT_REFERENCES.csv`, `body-link-audit.csv`
- `activityradar-archive/**` (retired product, archived on purpose)
- `migrations-activity-radar/0009_enrichment_queue.sql`, `0010_enrichment_org_fields.sql` (already-applied migrations)
- `workers-activity-radar/wrangler.toml`, `yelp-worker.ts`, `yelp-wrangler.toml` (separate, already-deployed pipeline workers, untouched by any of the six lanes)
- `public/link-manifest.json` (build-generated by `npm run build:manifest` — regenerates itself on the next build regardless)
- `tests/probe.txt` (literal contents: `probe-1784123970` — a sandbox scratch file, not real content, safe to delete)

**Handling:** these still get swept into `git add -A` on the migration branch (excluding them risks a partial, error-prone add at 6am), but none of them appear in the main-branch port's `git checkout` path list.

---

## 2. The three unpushed `main` commits

`main` is 3 commits ahead of `origin/main`, 0 behind. All three predate tonight's session (2026-07-14, Jeff's own machine) and are legitimate:

| Commit | What it is | Push? |
|---|---|---|
| `1faf8f6` | "Clear the STANDARD-AUDIT deploy block" — confirmed `CRON_KEY` live, wrote the 3-test minimum for 14 previously-untested API routes (107/107 passing), fixed the critical vitest CVE, burned `astro check` from 215 errors to 0, fixed a real bug (`PILLARS` lookup missing `team-parent` broke the homepage). | Yes. |
| `3bb1b3c` | Pure documentation — records the Astro 5→7 upgrade attempt, the Cloudflare Pages-support-dropped blocker, and writes `PAGES-TO-WORKERS-MIGRATION-BRIEF.md`. Two files, zero code. | Yes. |
| `3e125bc` | Two new content articles (NFHS track/field throwing warmup, soccer age-cutoff shift), a `CONTENT_ROADMAP.md` update, and a rules-watch report. Real, legitimate content work. | Yes — but see below. |

**Finding worth naming on its own:** `3e125bc`'s commit message is the literal placeholder text **"ONE-LINE SUMMARY"** — the exact banned string from the Backup norm's template, left unedited. The content itself is fine; the message is not. Since it hasn't pushed yet, this is a free fix — amend it before it goes to `origin/main` and becomes permanent history. The block below includes an optional, clearly-marked amend step.

All three should push. None of them touch anything migration-coupled.

---

## 3. Why checkout-by-path, not cherry-pick

The six-lane session's work is uncommitted and interleaved across lanes in one working tree — there is no per-feature commit boundary to cherry-pick. `git cherry-pick` operates on whole commits; the first commit this plan makes on the migration branch will bundle everything (deploy-safe, deferred, and migration-coupled) into one snapshot, so cherry-picking it would drag the Astro 7 binding style along with everything else in the same commit. Explicit `git checkout <branch> -- <path>` calls, one per deploy-safe file, plus two hand-patches for the two files that can't be checked out as-is (§1b, §1c), is the version of this that fails loudly (a missing or wrong path errors immediately) instead of silently (a cherry-pick conflict resolved wrong, or a whole-commit pick that ships a broken import). That is the "hardest to get wrong at 6am" property this plan is optimizing for.

---

## 4. The PowerShell block

Two hand-patch steps (§1b, §1c) have to happen with an editor between the migration-branch commit and the `main`-branch checkout — they are not mechanical enough to trust to an inline PowerShell text replace against live source. The block below stops right before them and resumes after, with the exact instruction in between.

```powershell
# ============================================================
# STEP 1 — Preserve everything on the migration branch, as-is.
# Confirm the branch and the file count before committing.
# ============================================================
cd "$HOME\Desktop\Claude Cowork\Outputs\parent-coach-desk"
git branch --show-current
git status --short
# ^ Compare this list against reports/VERIFICATION-2026-07-15.md and the six
#   reports/*-LANE-2026-07-15.md files. This machine's git status is the real
#   one — trust it over anything this plan couldn't see (Section 0).

git add -A
git commit -m "Six-lane PCD automation session 2026-07-15: run-log wire, transactional email, approve-to-publish, Access JWT verification, camp 500 fix, OG images, redirect fixer, Kit welcome sequence + Friday Letter, Hal/Ranger/Vera/Sunny roster, worker-cron failure policy, backup clock start"

# ============================================================
# STEP 2 — Switch to main and pull over the deploy-safe files.
# ============================================================
git checkout main
git status --short
# ^ Should be clean except for the 3 unpushed commits already in main's history.

git checkout migration/pages-to-workers-staging -- `
  src/lib/camps-db.ts `
  src/lib/email.ts `
  src/lib/publish.ts `
  src/lib/slack.ts `
  tests/api/email.test.ts `
  tests/api/publish-lib.test.ts `
  tests/api/slack-lib.test.ts `
  tests/helpers/slack-sign.ts `
  tsconfig.verify.json `
  worker-cron/src/index.ts `
  worker-cron/wrangler.toml `
  worker-cron/package.json `
  worker-cron/README.md `
  automation/APPROVAL-MATRIX.md `
  automation/RUN-LOG.md `
  automation/agents/hal/SPEC.md automation/agents/hal/SKILL.md `
  automation/agents/ranger/SPEC.md automation/agents/ranger/SKILL.md `
  automation/agents/vera/SPEC.md automation/agents/vera/SKILL.md `
  automation/agents/sunny/SPEC.md automation/agents/sunny/SKILL.md `
  automation/agents/nora/tools/redirect-fixer.mjs `
  PCD-OPERATING-MANUAL.md `
  STANDARD-AUDIT.md `
  SECURITY-AUDIT.md `
  BACKUP.md `
  scripts/backup-activity-radar.ps1 `
  PCD-AUTOMATION-AUDIT-2026-07-14.md

git status --short
# ^ Confirm every path above actually changed something. A path that shows no
#   change either matches main already or needs its own check before moving on.

# reports/, kit-emails/, public/og-camps/ are new directories — copy wholesale:
git checkout migration/pages-to-workers-staging -- reports/ kit-emails/ public/og-camps/

# ============================================================
# STEP 3 — STOP. Hand-patch two files here. Do not script this part.
# ============================================================
# Open src/pages/camps/[slug].astro and src/layouts/BaseLayout.astro and apply
# the exact before/after text in Section 1b and Section 1c of
# reports/BRANCH-PORT-PLAN-2026-07-15.md. Save both files, then continue.

# ============================================================
# STEP 4 — Verify, build, test, commit, deploy, push.
# ============================================================
npm run build
npm test
git add -A
git commit -m "Port deploy-safe work from the migration branch: camp 500 fix, canonical trailing-slash fix, transactional email lib, Slack/publish libs, worker-cron failure policy, roster docs"
npx wrangler pages deploy dist --project-name parent-coach-playbook --branch main
git push

# ============================================================
# STEP 5 — Push the 3 pre-existing unpushed main commits (see Section 2).
# Already included by "git push" above since they're on main's history —
# this step only matters if you want to fix the placeholder message first.
# OPTIONAL, run BEFORE step 4's push if you want it:
#   git rebase -i origin/main   # reword 3e125bc from "ONE-LINE SUMMARY" to
#                                 something real, e.g.:
#                                 "Add NFHS throwing-warmup and soccer age-cutoff
#                                  articles, update content roadmap"
# ============================================================

# ============================================================
# STEP 6 — Deploy worker-cron separately (own resource, own deploy).
# Not documented in About Me/Deployments.md today — flagged, not invented.
# Confirm the command with Jeff before running if this is the first time
# deploying worker-cron from this session.
# ============================================================
cd worker-cron
npm install
npx wrangler deploy
cd ..
```

---

## 5. Post-port verification — what to re-run on Windows before trusting this

Everything the verification pass proved (`222`→`233` tests, `0` `tsc` errors) was measured against the migration branch's dependency state: Astro 7, Tailwind v4, the `cloudflare:workers` mocks in `vitest.config.ts`. None of that proof transfers to `main`'s Astro 5 / Tailwind v3 world. After Step 4's `npm run build`/`npm test` pass locally, still do these by hand:

1. **`npm run check`** — the actual Pillar 9 bar. It could not run in this sandbox (`Cannot find module '@astrojs/compiler-binding-linux-x64-gnu'`, a Linux-native-binding gap). Run it on Windows. A failure here would look like new TypeScript errors specifically in the two hand-patched files or in `camps-db.ts`'s new function — if it's clean anywhere else, the port didn't touch it.
2. **Visually load the four confirmed-500 slugs** after deploy:
   - `/camps/pro-football-camp-colorado-spgs-co-5884-profootballcamp/`
   - `/camps/vancouver-lake-crew-vancouver-wa-5828-vancouver-lake-crew-camp/`
   - `/camps/camp-ten-trees-seattle-wa-3793-camp-ten-trees-is-a-nonprofit-.../`
   - `/camps/olympia-youth-soccer-club-olympia-wa-4134-olympia-youth-soccer-.../`
   All four should now return 200 and read "Dates to be announced" instead of 500ing. This is the one user-facing thing this port changes.
3. **Spot-check a normal, dated camp page** (one with real `start_date`/`end_date`) still renders the date range correctly — the null-safety patch changed the function signature, and a regression there would be silent (a dated camp showing "Dates to be announced" instead of its real dates) rather than loud.
4. **View source on any SSR camp page**, confirm `<link rel="canonical">` ends in a trailing slash. Confirm a prerendered article page's canonical is unchanged (should already have ended in a slash; the patch is a no-op there).
5. **`npm run build`'s manifest step** will regenerate `public/link-manifest.json` from scratch — confirm the build doesn't fail on it (it's excluded from the port on purpose, see §1f).

A failure in (1) that isn't in one of the touched files means something else on `main` broke independent of this port — worth knowing before blaming tonight's work.

---

## 6. The risk that cannot be retired

The verification pass's `222`/`233` passing tests and its "zero `tsc` errors" claim are real, but they were proven against the migration branch's `package.json` — Astro 7, `@cloudflare/workers-types` v5, the `cloudflare:workers` test mock. The instant any of tonight's ported files land in `main`'s Astro 5 / Tailwind v3 tree, that proof no longer applies to them. The two hand-patched files (`camps/[slug].astro`, `BaseLayout.astro`) and the one clean addition (`camps-db.ts`) have never been typechecked, built, or test-run against `main`'s actual dependency graph — not in this sandbox (which cannot run `astro check` at all) and not anywhere else, because they didn't exist in this exact form until this plan wrote them out. `npm run build` and `npm test` in Step 4 are the first real proof either patch works, and `npm run check` on Windows (§5.1) is the first real proof against the actual Pillar 9 bar. Nothing between here and Jeff's own keyboard has verified these two patches. Treat the build and test output in Step 4 as the actual gate, not this document.
