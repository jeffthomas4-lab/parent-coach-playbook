# Next session prompt: port the 2026-07-15 automation session to main

**Run this on Windows, in a session that can run git, npm, and wrangler.** Use Sonnet. Paste everything below the line.

---

You are porting the 2026-07-15 six-lane PCD automation session from the migration branch onto `main`, then shipping it. Project root: `C:\Users\jeffthomas\Desktop\Claude Cowork\Outputs\parent-coach-desk`.

## Read first, in this order

1. `reports/BRANCH-PORT-PLAN-2026-07-15.md` — your brief. Carries the file classification, the two hand-patches with exact before/after text, and the PowerShell block.
2. `reports/VERIFICATION-2026-07-15.md` — the authority on what is true. It overrules the six lane reports wherever they disagree, and it names three places they were wrong.
3. `HANDOFF-2026-07-15.md` — what Jeff does by hand. Do not do these for him.
4. `C:\Users\jeffthomas\Desktop\Claude Cowork\CLAUDE.md` — the Deployment norm and Backup norm govern the commands.
5. `About Me\Deployments.md` — exact deploy commands. Do not invent flags or paths.
6. `About Me\Anti AI Writing.txt` — governs any prose you write.

## The situation

The session's work sits **uncommitted** on `migration/pages-to-workers-staging`, 8 commits ahead of `main`. Those 8 commits are in-flight Pages-to-Workers migration work (Astro 7, Tailwind v4, `cloudflare:workers` binding swaps) that Jeff has **not** signed off on and that must **not** reach `main`.

Production deploys from `origin/main`. `parent-coach-playbook-cron` fires the deploy hook daily at 13:00 UTC, so anything on `origin/main` goes live within a day with no deploy click.

**The clock:** 296 public camp pages (~19% of approved listings) are returning HTTP 500 right now on a null `session_end_date` crashing `fmtDate`. The fix is written and sitting on a branch that never deploys.

## Method note that will save you an hour

The previous session ran in a Linux sandbox whose mount served **stale, truncated** file content. It fooled `cat`, and it fooled `git status` and `git diff` too — three files with real edits read as unchanged. **Your Windows `git status --short` is the real source of truth.** Run it first. If it disagrees with the port plan's file list, believe your machine and say so.

## Your job

1. **Verify before you move anything.** Run `git status --short` on the migration branch. Reconcile against the port plan's classification table. The plan excludes line-ending churn in `buildout/`, `imports/`, `activityradar-archive/`, and a few CSVs as noise — confirm that holds on your machine, because a bad `git add -A` drags 128 files of nothing into the commit.

2. **Execute the block in `reports/BRANCH-PORT-PLAN-2026-07-15.md` Section 4.** Preserve everything on the migration branch first, then `git checkout` the deploy-safe file list onto `main`.

3. **Hand-patch the two files. Do not script this.** `src/pages/camps/[slug].astro` (the 500 fix) and `src/layouts/BaseLayout.astro` (the trailing-slash canonical fix) cannot be copied across: the branch versions already carry the migration's `cloudflare:workers` import, which `main`'s adapter cannot load. The fixes themselves have zero binding dependency. Exact before/after text is in the plan, Sections 1b and 1c.

4. **This is where the real risk lives.** The session's 233 passing tests and zero tsc errors were proven against the migration branch's Astro 7 / Tailwind v4 dependency state. That proof does not transfer. Your `npm run build`, `npm test`, and `npm run check` are the **first** real evidence these patches work on main. `npm run check` is Pillar 9's actual bar and could not run in the old sandbox at all. If any of the three fail, the three touched files are the likely cause; report and stop rather than patching around it.

5. **Then ship**, per the Backup norm: build → git add/commit → wrangler deploy → git push. Write your own commit message, one line, specific, peer-to-peer. `main` also has 3 unpushed commits — all legitimate, all should push. One of them (`3e125bc`) shipped two real articles under the literal placeholder message "ONE-LINE SUMMARY"; rewording it before the push is free and the plan has the command.

6. **Deploy `worker-cron` separately.** Own resource, own deploy, `npx wrangler deploy` from `worker-cron/`. It is not in `Deployments.md` yet. Add it, with the exact block, so the next session does not have to work it out.

7. **Verify the fix landed.** These four slugs must return 200 and read "Dates to be announced":
   - `/camps/pro-football-camp-colorado-spgs-co-5884-profootballcamp/`
   - `/camps/vancouver-lake-crew-vancouver-wa-5828-vancouver-lake-crew-camp/`
   - `/camps/camp-ten-trees-seattle-wa-3793-camp-ten-trees-is-a-nonprofit-...`
   - `/camps/olympia-youth-soccer-club-olympia-wa-4134-olympia-youth-soccer-...`

   A deploy you did not verify is a deploy you are guessing about.

8. **Update `STANDARD-AUDIT.md`** once the deploy is verified. Pillar 8 currently reads `fail` on open item #19 (the live 500) and stays `fail` until the fix is live, not until it is written. Only mark what you verified.

## Deferred on purpose. Do not port these.

The Access JWT verification (`access-jwt.ts` plus the async `admin-auth.ts`) and the new API routes (`agent-runs`, `slack/actions`, `editorial/publish`, the email wiring in `submit.ts`) are real, tested, and **unsafe to blind-port**. The async `requireAdmin` signature has ~22 call sites and landing it without updating all of them opens a silent auth hole. The routes hardcode `cloudflare:workers`. These need one dedicated main-branch session. If you find yourself porting them because it seems easy, stop.

## Hard rules

- **Hold the human gate.** Nothing autonomous sends, publishes, deletes, or spends. You are shipping code, not relaxing the gate.
- Do not touch the migration branch's 8 commits.
- Do not do Jeff's handoff items (inbox connection, key rotation, Cloudflare secrets). They are his, and `HANDOFF-2026-07-15.md` has them.
- Match `About Me\Deployments.md` exactly. No invented flags.
- Report what actually happened, including what failed. The previous session's most useful finding was a lane reporting a neighbor's file as broken when it was not.

## Deliver

Append a "Port executed" section to `reports/BRANCH-PORT-PLAN-2026-07-15.md`: what landed on main, the real build/test/check output, the four-slug verification result, and anything that did not go per plan.
