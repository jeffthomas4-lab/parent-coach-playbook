# Security & Revenue Lane — 2026-07-15

Scope: PCD-AUTOMATION-AUDIT-2026-07-14.md items P0.3 (hardcoded key), P0.4 (stale Gear Files build, /go/ verification), and the related P1 affiliate-ops open item. Project root: `parent-coach-desk`. This session held the human gate: no networks applied to, no money spent, no follow-up emails sent, no git/build/deploy commands run.

---

## 1. Hardcoded live OpenAI key

**Found:** `gen_hero_image.py` at the Cowork root (outside this repo) had a live OpenAI API key hardcoded on line 4. The same key was also sitting in plaintext at `About Me/openai-config.md` line 3 — that file is the documented "supported path" for the imagegen skill, and it turns out it also just stores the key as plain text, not through any secrets manager.

**Fixed:** `gen_hero_image.py` now reads `OPENAI_API_KEY` from the environment and exits with a clear message if it isn't set, instead of carrying a literal key. This is a sanitize, not a delete — the script still works if Jeff exports the key locally, but the imagegen skill is the supported path going forward and this script should be treated as deprecated.

**Not fixed (outside this session's lane):** `About Me/openai-config.md` still has the live key in plaintext. It wasn't edited because it sits outside this session's file lane. It needs the same treatment once Jeff has a new key.

**Key status: burned.** Both copies of this key have been sitting in plaintext files on disk. Jeff needs to rotate it in the OpenAI dashboard before either the imagegen skill or any script depending on it is trustworthy again. See HANDOFF.

---

## 2. Wider secrets sweep

Full-tree pattern sweep across the whole Cowork working directory (OpenAI, Anthropic, AWS, GitHub, Slack, and Stripe key shapes) plus a manual `git log --all -p` pass over this repo's complete history (no gitleaks binary was available in this session's shell, same gap as the 2026-07-05 and 2026-07-14 audit passes) turned up nothing else real.

Specifics:

- `.env` is gitignored and confirmed never tracked. `git ls-files` shows only the placeholder `.env.example`, which carries no real values, just documented empty variable names.
- Every non-`PUBLIC_`-prefixed secret this repo uses (`OPENAI_API_KEY`, `SANITY_API_TOKEN`, `CRON_KEY`, `BULK_IMPORT_TOKEN`) is referenced only from server-side API routes or SSR frontmatter, never from a client-side `<script>` block or anything that ships to the browser.
- No `console.log` or `console.error` call anywhere in `src/` or `worker-cron/` prints a key or token value. The cron worker logs presence/absence and response status only, never the secret itself.
- Every other regex hit across the tree was a false positive on inspection: unrelated projects' test fixtures asserting a secret-scanner works correctly, an AWS SDK test vector inside a `.pnpm-store` cache file, and a Slack setup doc's placeholder token format (`xoxb-...`).

Gitleaks itself is still not run as a real tool — this session's manual grep is a partial substitute, not a replacement. Recommend Jeff install `gitleaks` and run `gitleaks git .` from the repo root at least once to close this properly.

---

## 3. `/what-to-buy/` stale build — diagnosed, not fixed

**Confirmed live, with hard evidence:**

- `/what-to-buy/` and its guide pages serve `<meta name="generator" content="Astro v4.16.19">`. The homepage serves `v5.18.2`.
- This is not a Cloudflare edge-cache artifact. A live `fetch()` run in-browser against both URLs returned `cf-cache-status: DYNAMIC` on both — Cloudflare isn't caching either page, every request hits the origin deployment directly. Whatever is stale, it's stale at the origin, not at the edge.
- The shared `NavBar` component — the same component, importing the same `BUYING_GUIDES` array, present on every page of the site — renders a shorter, older guide list on `/what-to-buy/`'s own copy of itself (missing Rugby, Pickleball, Wrestling, and the entire "For coaches" section) than it does on the homepage. One Astro build compiles one copy of a shared component. Two different renders of the same component prove `/what-to-buy/`'s HTML was baked by a genuinely older build than the homepage's HTML. This isn't a content or template bug — it's two build vintages coexisting in what should be one deployment.

**Ruled out on the code side:**

- No exclusion in `astro.config.mjs` for this route.
- No static file in `public/` shadows `/what-to-buy/`.
- No `_headers` or `_redirects` rule singles this path out.
- The source is current on `main`: `src/data/site.ts` and `src/content/guides/` both carry the current guide list, confirmed by the fact that the homepage — built from the same source, same commit — renders it correctly.

**One concrete lead, not yet tried:** `astro.config.mjs`'s `vite.cacheDir` is pinned to a fixed path, `/tmp/pcd-vite-verify-cache`, added 2026-07-10 in the ActivityRadar merge commit, instead of Vite's default `node_modules/.vite`. If the Cloudflare Pages build environment persists `/tmp` across builds, a stale Vite transform cache sitting at that fixed path is a plausible mechanism for one build to silently reuse old compiled output for some routes while freshly rebuilding others. Worth trying: repoint or remove that `cacheDir` override, force a clean build, and see if `/what-to-buy/` finally comes back current.

**Why this session didn't fix it:** the working tree was checked out on `migration/pages-to-workers-staging`, not `main` — a large, unrelated, unmerged Pages-to-Workers migration branch (see `PAGES-TO-WORKERS-MIGRATION-BRIEF.md`). This session's rules forbid git checkout, `npm run build`, and deploy. A real fix needs someone on `main` with a working build and deploy access to try the `cacheDir` change, run a clean build, and reverify the generator tag flips to `v5.18.2` with the full guide list before shipping. That's a job for the orchestrator or whoever owns the next `main`-branch session.

**Also worth checking in the Cloudflare dashboard directly** (no tool access to this from here): Pages → `parent-coach-playbook` → Deployments — confirm the deployment marked "Production" is actually the latest one, and pull its build log looking for any warning around the `guides` collection or `what-to-buy`.

---

## 4. `/go/` affiliate redirect — verified end to end, no P0

Followed one live `/go/` link per network in a real Chrome session (not a synthetic HTTP check):

| Network | Link tested | Landed on | Tag/tracking present |
|---|---|---|---|
| Amazon | `/go/baseball-bat-28in/` | `amazon.com/dp/B0D6QPSW3X?tag=parentcoachpl-20` — correct product (Victus Vibe Pencil bat) | `tag=parentcoachpl-20` in the URL bar, correct |
| CJ / SoccerGarage | `/go/soccer-goalie-gloves-youth/` | `soccergarage.com/goalkeeping.html?cjevent=…` | `cjevent` tracking param present and correct |
| Bookshop.org | `/go/book-changing-the-game/` | Correct book's Bookshop page | `affiliate=125074` (matches the account ID in `src/data/affiliates.json`) plus `utm_source=parentcoachdesk&utm_medium=affiliate&utm_campaign=books-sports-parenting` |

Note on network count: the task asked for four networks (Amazon, CJ, SoccerGarage, Bookshop). SoccerGarage is the only CJ-network merchant configured anywhere in this repo — `tkqlhce.com` is CJ's own click-tracking domain, and it's used exclusively for SoccerGarage links. One test covers both labels; there is no separate standalone CJ merchant to test.

The SoccerGarage link landing on a category page rather than one specific glove product matches a known, already-logged limitation (`AFFILIATE_MASTER_LIST.md` notes SoccerGarage doesn't support deep linking to a shop page yet). That's not a broken link — the tracking parameter that carries commission credit is present and correct, which is the part that matters for revenue.

**Verdict, stated plainly: the revenue mechanism works end to end for all three live networks tested. No missing tag, no wrong tag, no P0 finding on `/go/`.** This independently corroborates what `pcd-link-health-monitor`'s 2026-07-13 report already claimed, this time via direct live-browser verification rather than reading the automation's own output.

---

## Files changed this session

- `gen_hero_image.py` (Cowork root) — sanitized, no longer carries a literal key.
- `SECURITY-AUDIT.md` — new 2026-07-15 section with full findings.
- `STANDARD-AUDIT.md` — Pillar 1 row updated, two new open items (#17 key rotation, #18 `/what-to-buy/` stale build).

No files changed under `src/pages/api/`, `automation/agents/`, `kit-emails/`, `worker-cron/`, or `wrangler.jsonc` — those stay other lanes' territory, reported here only where relevant.

---

## HANDOFF — needs Jeff

1. **Rotate the OpenAI key.** Go to platform.openai.com/api-keys, revoke the key that was hardcoded in `gen_hero_image.py` and `About Me/openai-config.md`, generate a new one. Update `About Me/openai-config.md` with the new key (that file is outside this session's lane, so it wasn't touched). If `gen_hero_image.py` is still needed, export the new key as `OPENAI_API_KEY` in your shell before running it; otherwise use the imagegen skill, which is the supported path.
2. **`/what-to-buy/` needs a `main`-branch session with build and deploy access.** Try repointing/removing `vite.cacheDir` in `astro.config.mjs`, run a clean `npm run build`, deploy, and reverify the generator tag on `/what-to-buy/` flips to `v5.18.2` with the current guide list (Rugby, Pickleball, Wrestling, "For coaches" section all present). If that doesn't fix it, check the Cloudflare Pages dashboard: Pages → `parent-coach-playbook` → Deployments, confirm Production points at the latest deployment, and check that deployment's build log for anything unusual.
3. **Gitleaks still isn't installed anywhere this work has run.** A one-time `gitleaks git .` from the repo root would close out the last open piece of Pillar 1's secrets-inventory bar for real, instead of relying on manual pattern sweeps each session.
4. **`foam-roller-medium` is delisted on Amazon** (surfaced by the 2026-07-13 link-health report, not new this session, flagging again since it's revenue-adjacent) — a verified in-stock replacement ASIN is already sitting in that report, waiting on your review.
