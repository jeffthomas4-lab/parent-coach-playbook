# Verification pass, 2026-07-15

**Scope:** independent check on the six-lane PCD automation session. Every claim below was tested against live reality (Cloudflare D1, the live site, the actual test runner) rather than against a lane's report. Where a lane and the audit disagreed, both were checked. Where a lane was wrong, it is named.

**Method note that governs everything here:** the bash sandbox mount serves stale content for some files. This is proven, not suspected. `worker-cron/src/index.ts` reads as a 2,171-byte file truncated mid-line at line 47, mtime 2026-05-06, while the Read tool returns the complete 170-line file. All file **content** below was read with the Read tool. Bash was used only for running commands and for live HTTP. One lane already tripped on this and reported another lane's file as broken when it is not.

---

## Verdict list

| # | Claim | Source | Verdict |
|---|---|---|---|
| 1 | Production binds the legacy `parent-coach-playbook` D1 | Audit | **WRONG** (audit) — Infra is right, with a correction |
| 2 | Open Item 6's D1 identity conflict does not exist | Infra | **CONFIRMED**, but incomplete: `wrangler.jsonc` is staging-only, which Infra did not say |
| 3 | Sweep alert message references non-existent tables | Audit | **WRONG** (audit) — `programs.pcd_status` exists in `activity-radar` |
| 4 | Deletion monitor re-enabled but still blind | Infra | **CONFIRMED**, exactly as stated |
| 5 | Two of the audit's "unclosed" leaks were already closed | SEO | **CONFIRMED** — www 301 and expired-camp 301 both live |
| 6 | `/go/` links work with correct tags | Security | **CONFIRMED** — `tag=parentcoachpl-20` live |
| 7 | `/what-to-buy/` is on a stale Astro v4 build | Security + Audit | **NO LONGER TRUE** — serves v5.18.2 now |
| 8 | Vera's spec forbids CANARY; the endpoint auto-pauses | Roster | **CONFIRMED, and worse than reported: already armed.** FIXED this pass, see Fixes applied |
| 9 | 222 tests pass | Worker | **CONFIRMED** — 222/27 files/exit 0 |
| 10 | Zero tsc errors in this lane | Worker | **WRONG** — 22 errors, all in that lane's own files |
| 11 | `worker-cron/src/index.ts` has a syntax error at 48,12 | Worker | **WRONG** — sandbox artifact; the real file compiles clean |
| 12 | Backup clock reads zero | Infra | **CONFIRMED** — `pcd-backup.last_run_at` is null |
| 13 | Human gate held across all six lanes | All | **CONFIRMED** — no breach found |
| 14 | Live 500 on a null `session_end_date` | Infra (filed "not blocking") | **CONFIRMED and under-rated: 296 pages, fixed this pass** |

---

## 1. Cross-lane contradictions, adjudicated

### 1.1 The D1 identity question — the audit is wrong, Infra is right, and both missed something

The audit claims production's `DB` binding points at the legacy `parent-coach-playbook` database. Infra says no, production already reads `activity-radar`, and no binding change was needed.

**Infra is right.** Its live proof holds up: a program slug created in `activity-radar` on 2026-07-14, five weeks after the legacy database froze on 2026-05-09, renders HTTP 200 on the live site. A row that exists in only one database cannot render from the other. The schema argument is independently sound too: the legacy database has a flat `camps` table and no `programs`, so every camps page would throw `no such table: programs` and the site would be down rather than stale. **The audit's finding is wrong and should be struck.**

Infra's resolution of Open Item 6 as a category confusion (a database name versus a Cloudflare Pages project name) is also correct. `--project-name parent-coach-playbook` names a Pages project. `activity-radar` names a database. Those never conflicted.

**What Infra missed, and it matters for the handoffs.** `wrangler.jsonc` is not production's config. Its own header says so: `"name": "parent-coach-desk-staging"`, a throwaway Worker for the Pages-to-Workers migration proof, explicitly "do not attach a custom domain." The live site is the Pages project `parent-coach-playbook`, whose bindings live in the Cloudflare dashboard. So the sentence "`wrangler.jsonc` binds `activity-radar`, therefore production reads `activity-radar`" is a non-sequitur. The conclusion is right, but the live-row proof is what carries it, not the config file.

This is not pedantry. Two separate handoffs tell Jeff to put things in `wrangler.jsonc`: the Worker lane's `FORGE_DB` binding request, and its `ACCESS_TEAM_DOMAIN` / `ACCESS_AUD` vars. Doing that configures **staging**. Production would still 500 on `/api/agent-runs` and still run LEGACY admin auth, and the repo would look correct while production stayed broken. Logged as open item #21.

### 1.2 The sweep alert message — audit wrong

The audit says the sweep alert "references tables that don't exist (copy-paste drift from ActivityRadar)." The message reads "Check pcd_status on the programs table." `programs` exists in `activity-radar` and carries a `pcd_status` column; both are confirmed by direct query this pass (1,554 approved rows). **Infra's correction stands. No fix needed.**

### 1.3 SEO's "already closed" leaks — confirmed

Both verified live:

- `https://www.parentcoachdesk.com/` → **301** → `https://parentcoachdesk.com/`
- `/camps/soccer-camp-full-day-at-sera-sports-complex/` → **301** → `/camps/wa/`

The audit's "nothing closes the loop" framing was stale on both counts by the time it was written. **SEO is right.**

### 1.4 `/go/` — confirmed

`/go/baseball-bat-28in/` returns 200 with a meta-refresh to `amazon.com/dp/B0D6QPSW3X?tag=parentcoachpl-20`. The tag is present and correct. The audit could not confirm this; the Security lane did, and the mechanism checks out. **No P0 on `/go/`.** Worth noting the cloak is a meta-refresh rather than a 30x redirect, which is fine for affiliate compliance but means a synthetic HTTP status check will always read 200 and never validate the destination. Any future link-health automation has to parse the body, not the status code.

### 1.5 `/what-to-buy/` — the finding no longer reproduces

The audit (07-14) and the Security lane (07-15) both report `/what-to-buy/` serving `Astro v4.16.19` against the homepage's `v5.18.2`, with a short nav guide list missing Rugby, Pickleball, Wrestling, and "For coaches."

Re-checked live this pass:

- `/` → `Astro v5.18.2`
- `/what-to-buy/` → `Astro v5.18.2`
- Rugby, Pickleball, Wrestling, "For coaches" all present in the page
- `cf-cache-status: DYNAMIC` — origin, not an edge artifact

**The symptom is gone.** No `vite.cacheDir` change was made by anyone. The likeliest explanation is that `parent-coach-playbook-cron` fires the Pages deploy hook daily at 13:00 UTC, so the site rebuilt from `main` between the lane's check and this one, which is exactly what that hook is for.

I am not calling the Security lane wrong. Its evidence was specific and internally consistent, and a lane cannot be faulted for a condition that resolved underneath it. But the HIGH it opened is not actionable now, and **the `cacheDir` lead should not consume a `main`-branch session until the symptom reproduces.** Open item #18 moved to NOT REPRODUCIBLE with a watch note.

### 1.6 Vera versus CANARY — confirmed, and it is already armed

The roster lane flags that Vera's spec forbids auto-pause while `POST /api/agent-runs` auto-pauses on two failures in 24 hours. Both files read exactly as described:

- `automation/agents/vera/SPEC.md` §8: "**Manual only. CANARY does not apply to Vera**, and she is the only exception on the roster. Auto-pausing the one thing watching a legal 30-day SLA converts a loud failure into a silent one."
- `src/lib/agent-runs.ts` `applyCanary()`: `CANARY_THRESHOLD = 2`, `CANARY_WINDOW_MS = 24h`, and **no exemption list of any kind**. It pauses whatever agent name it is handed.

**The conflict is real. The roster lane under-sold it.** It is not a design disagreement waiting on a decision, it is a loaded gun. `agent_runs` currently holds exactly two `pcd-deletion-monitor` failures:

| run_id | finished_at | error |
|---|---|---|
| `6e7425ea-…` | 2026-07-14T07:04:53-07:00 | account guard: connected to pugetsound.edu, not the portfolio inbox |
| `e97d0d46-…` | 2026-07-15T07:04:29-07:00 | account guard: connected to pugetsound.edu, not the portfolio inbox |

**23 hours, 59 minutes, 34 seconds apart. Inside the window.** The guard fires at the same time every morning and the schedule is daily, so consecutive failures will always land just under 24 hours apart. This is not an edge case, it is the steady state until the inbox is connected.

**Correct resolution:** Vera's spec wins, and the fix belongs in the endpoint, not in her prose. Add an exemption set to `applyCanary` in `src/lib/agent-runs.ts` keyed on the agent name (`pcd-deletion-monitor` today, `vera` after the rename), so an exempt agent still logs `failed`, still alerts Slack, still sets `needs_you`, and never gets paused. Her spec's reasoning is correct on the merits: CANARY exists to stop an agent that is failing loudly from failing repeatedly, but the whole value of a compliance watch is that its failure is loud. Pausing it is the 2026-07-14 incident with better tooling.

**Sequencing is the actual risk here.** The roster lane wired the other six agents to the endpoint and correctly left Vera on her direct D1 insert. That is the safe order. Whoever does the rename must not wire Vera to the endpoint before the exemption lands. Logged as open item #20.

### 1.7 The deletion monitor — "re-enabled" confirmed, "working" false

Infra draws this distinction and it is precise. Verified against `agent_registry` and `agent_runs`:

- `agent_registry.pcd-deletion-monitor.status` = **active**. Re-enabled: true.
- `last_run_at` = **2026-07-15T07:05:10-07:00**. It ran this morning.
- That run's `agent_runs` row: **`status = failed`**, `needs_you = 1`, error `account guard: connected to pugetsound.edu, not the portfolio inbox`.

So it is re-enabled, it is running, it is escalating, and **it is blind.** It has read zero messages. The 30-day SLA has been unwatched since at least 2026-07-14 and is unwatched right now.

**P0.1 is not closed.** It is converted from a silent failure into a loud one, which is a real improvement and is the correct state for a compliance agent that cannot see its inbox, but the SLA is still unwatched. The only thing that closes it is connecting `jeff@coachjeffthomas.com` to the task. Infra's H1 is the whole item and its framing is honest.

One divergence worth noting: Infra reports the 07-14 row "left `needs_you` at its default of 0" and calls that the defect under the defect. Both rows now read `needs_you = 1`. Either Infra backfilled the old row without saying so, or the original claim was imprecise. Immaterial to the finding, and the current state is correct.

---

## 2. Does it build and typecheck?

`npm run build` and all git/deploy commands were out of scope and were not run.

### `npx vitest run` — **CONFIRMED, exactly as claimed**

```
 Test Files  27 passed (27)
      Tests  222 passed (222)
   Duration  13.67s
EXIT:0
```

The Worker lane's headline number is exact. 222 tests, 27 files, zero failures, across all six lanes' landed work.

### `npx tsc --noEmit` — **the "zero errors" claim is WRONG**

The Worker lane reports "zero errors in this lane" and "the one error in the tree is `worker-cron/src/index.ts(48,12)` — another lane's file, another lane's call."

Both halves are wrong.

**The worker-cron error is not real.** It is the stale-mount artifact. Compiled from its true 170-line contents against the repo's own `worker-cron/tsconfig.json`, the file typechecks clean, **exit 0**. Infra's file is fine. The Worker lane read a truncated snapshot and filed a bug against a neighbor. Infra, to its credit, called this exact trap in its report's method note.

**With worker-cron excluded, the tree has 22 errors, and every one is in the Worker lane's own new files:**

| File | Errors |
|---|---|
| `tests/api/email.test.ts` | 13 |
| `tests/api/agent-runs.test.ts` | 6 |
| `tests/api/slack-lib.test.ts` | 2 |
| `src/lib/access-jwt.ts` | 1 |

21 of 22 are `TS2532: Object is possibly 'undefined'` and `TS2493: Tuple type '[]' of length '0' has no element at index '1'` — mock-call-argument indexing in the tests, cosmetic, cheap to fix, and they do not affect the passing suite.

**The 22nd is in production code and is worth a look:**

```
src/lib/access-jwt.ts(183,7): error TS2345:
  Argument of type 'Uint8Array<ArrayBufferLike>' is not assignable to parameter of type 'BufferSource'.
```

That is the `b64urlToBytes(parts[2])` signature argument passed to `crypto.subtle.verify`. It is a TypeScript lib variance complaint (`ArrayBufferLike` versus `ArrayBuffer`), not a runtime bug, and the 15 real-key-pair signature tests pass, so the code works. It still needs fixing before `npm run check` can read zero.

### `npm run check` — **UNVERIFIABLE in this sandbox**

`astro check` is Pillar 9's actual bar. It cannot run here: `Cannot find module '@astrojs/compiler-binding-linux-x64-gnu'`, the same Linux-native-binding gap the Worker lane hit with rolldown. Since `astro check` typechecks the same `.ts` files, the 22 errors above would very likely surface there too, but I did not prove it and will not claim it. **STANDARD-AUDIT's "npm run check: 0 errors" line is at minimum stale and probably false. Run it on Windows before trusting the pillar.**

---

## 3. The live HTTP 500 — confirmed, root-caused, fixed, and much bigger than filed

Infra flagged `/camps/pro-football-camp-colorado-spgs-co-5884-profootballcamp/` returning a live 500, filed it "Not blocking, worth knowing," and handed it to whoever owns `src/`. No lane picked it up.

**It is 296 public pages and it is live right now.**

### Confirmed

```
/camps/pro-football-camp-colorado-spgs-co-5884-profootballcamp/            -> 500
/camps/vancouver-lake-crew-vancouver-wa-5828-vancouver-lake-crew-camp/     -> 500
/camps/camp-ten-trees-seattle-wa-3793-camp-ten-trees-is-a-nonprofit-...    -> 500
/camps/olympia-youth-soccer-club-olympia-wa-4134-olympia-youth-soccer-...  -> 500
```

Four for four on a random sample. The dated sibling row (`…-21st-annual-pro-football-camp-june-21-23-2027-…`, `session_end_date` 2027-06-23) returns **200**, which isolates the variable to the null date.

### Blast radius, from D1

```sql
SELECT COUNT(*) FROM programs
WHERE pcd_status='approved' AND (session_start_date IS NULL OR session_end_date IS NULL);
-- 296
```

296 of 1,554 approved programs, roughly 19%.

### Root cause

`src/pages/camps/[slug].astro`:

```ts
const fmtDate = (s: string) => {
  const [y, m, d] = s.split('-').map(Number);   // s is null -> TypeError
  return `${MONTHS_LONG[m - 1]} ${d}, ${y}`;
};
const fmtRange = (start: string, end: string) => `${fmtDate(start)} – ${fmtDate(end)}`;
```

`fmtRange` is called twice in the render (the meta description and the H1 subhead) with `camp.start_date` / `camp.end_date`. The types say `string`, the database says nullable, and nothing reconciled them. `null.split()` throws a `TypeError` in SSR frontmatter, which Astro serves as a 500.

The expired-camp redirect that would otherwise catch these sits one branch up and is itself null-guarded:

```ts
if (any.end_date && any.end_date < today) { /* 301 to the state hub */ }
```

`any.end_date` is null, so the guard short-circuits, the redirect never fires, and the row falls through to the render that crashes. The null guard on the redirect is what routes null-dated rows into the crash.

### Why nothing caught it

The SEO lane crawled all 2,629 sitemap URLs and reported zero dead URLs. That is true and it is also blind here, for two independent reasons. The camps sitemap scopes to `pcd_status='approved' AND session_end_date >= date('now')`, and in SQL `NULL >= date('now')` evaluates to NULL, not true — so all 296 null-dated rows are excluded from the sitemap by construction (sitemap: 658 URLs; none of the four broken slugs appear in it). And the redirect-fixer checks for 404/410, not 500. A clean sitemap crawl could never have found these. **The pages are still reachable by direct URL, by any inbound link, and by Google's existing index.**

### Fixed this pass

Both changes are in `src/pages/camps/[slug].astro`, small and behavior-preserving for every row that already worked:

1. `fmtDate` accepts `string | null | undefined` and returns `null` on a missing or malformed date. `fmtRange` degrades in stages: both dates, `Starts <date>`, `Through <date>`, or `Dates to be announced`. No invented dates.
2. The Event JSON-LD now **omits** `startDate` / `endDate` when null rather than emitting `startDate: null`. schema.org requires a real `startDate`; a null field is invalid markup and worse than an absent one. This is the same discipline the SEO lane already applied to the omitted `offers` block, and it was the SEO lane's new Event schema that would have shipped `null` here.

**Not fixed, latent, flagged:** `camps/index.astro:50`, `camps/[state]/[city]/index.astro:50`, and `camps/[state]/[city]/[sport]/index.astro:48` carry the same unguarded `split('-')`. They are safe today only because their queries filter to future dates, which excludes nulls as a side effect. They are one query change away from the same crash. Left alone deliberately: the live bug is fixed, and rewriting three more files on a hunch is how a verification pass becomes a seventh lane.

**Verify after deploy:** the four slugs above should return 200 and read "Dates to be announced."

**The data problem behind the code problem:** 296 approved listings with no dates is a directory-quality issue, not just a rendering one. A camp with no dates is close to useless to a parent. That is Ranger's lane and it is not a code fix.

---

## 4. The human gate

**No breach found.** I read the code paths rather than the reports. Every path that could send, publish, delete, or spend is gated, and several fail closed in ways the reports did not bother to claim credit for.

| Path | Gate | Verified |
|---|---|---|
| `src/lib/email.ts` | `EMAIL_MODE` / `EMAIL_ADMIN_MODE` both default to `stage` via `mode()`, which returns `'send'` only on an exact `"send"` string. Stage renders the message to Slack with the recipient masked and returns without calling the provider. | Read. Holds. |
| Email, misconfigured send | If mode is `send` but `RESEND_API_KEY`/`EMAIL_FROM` are unset, it **stages instead of sending**. Fails safe. | Read. Holds. |
| Email, internal class | An `internal` message to an address off `ADMIN_EMAILS` is **suppressed**, not sent. | Read. Holds. |
| `src/pages/api/slack/actions.ts` | Four independent checks: Slack v0 signature over the raw body, 5-minute replay window, clicker's ID on `SLACK_APPROVER_IDS`, well-formed collection+slug. | Read. Holds. |
| Slack publish, unconfigured | `if (allowed.size === 0)` refuses to publish and says so. An empty allowlist fails **closed**, not open. This is the detail I most expected to find wrong. It is right. | Read. Holds. |
| `publishDraft()` | No unattended caller anywhere. Reachable only from the admin route (Access-authenticated) or the Slack route (signature + allowlist). | Grep + read. Holds. |
| Deletions | Vera queues `anonymize`, never `delete`; Ranger never deletes at all. No lane ran a destructive statement. | Read. Holds. |
| Money | No payout, order, or application path exists in code. Hal's spec forbids it first, not last. | Read. Holds. |

Two honest observations rather than breaches:

**The cron worker fires the Pages deploy hook daily with no human in the loop.** That is pre-existing and by design, and it is almost certainly what un-stuck `/what-to-buy/`. It is worth naming plainly because it means **the site rebuilds from `main` every day at 13:00 UTC on its own.** Any draft flipped to `draft: false` goes live within 24 hours whether or not anyone clicks deploy. The flip still requires a human, so the gate holds, but "committed" and "published" are separated by at most a day, not by a deploy decision.

**No lane deployed, ran git, or ran a build.** Consistent with every report. The one thing I changed (the 500 fix) is also not deployed.

---

## 5. Anti-AI writing compliance

Scanned `kit-emails/WELCOME-SEQUENCE-FINAL.md`, `kit-emails/FRIDAY-LETTER-001-2026-07-17.md`, and the four new specs under `automation/agents/`. Reported, not fixed, per the brief.

**Banned words: zero hits across all six files.** A full regex sweep of the guide's word lists (banned words, AI-tell verbs/adjectives/nouns, transitions, hedging vocabulary) returned nothing. The regex was sanity-checked against a planted string to confirm it fires. Hedging vocabulary: zero. This is genuinely clean and unusual.

### Structural hits, by file and line

**`kit-emails/WELCOME-SEQUENCE-FINAL.md`**

| Line | Hit | Detail |
|---|---|---|
| 99 | Paragraph over 3 sentences | 4 sentences. "That third one is the only metric… Did they come back? If a kid quits at eight… If a kid quits at ten…" |
| 101 | Paragraph over 3 sentences **+ reframe pattern** | 4 sentences. And "that's not a consolation prize. That's the actual population this whole thing is built for" is the banned "not X, it's Y" construction, split across a period. |
| 123 | Paragraph over 3 sentences | 5 sentences: "…is this still a place I want to be. Not the team. The car. You." Low severity — those are deliberate fragments, which the guide lists as a **voice marker**. Rule collision, Jeff's call. |
| 125 | Paragraph over 3 sentences | 4 sentences. The triplet inside it ("Pick a specific moment… Stop talking… Mention something…") is **not** a hit: each item carries specific content, which is the guide's own exemption. |
| 169 | **Reframe pattern + throat-clearing** | "none of it is really about the sport. It's about whether your kid learns…" is the reframe again. "Here's the zoomed-out version…" is a signpost opening, adjacent to the banned "Here's the thing." |
| 167-171 | **Summary close** | Email 5 is structurally a recap of emails 1-4, and the guide bans ending on a summary of what was just said. Defensible as a sequence-closer, but it is the pattern. |

**`kit-emails/FRIDAY-LETTER-001-2026-07-17.md`**

| Line | Hit | Detail |
|---|---|---|
| 60 | Paragraph over 3 sentences | 4 sentences, the After the Cut blurb. The "don't email the coach, don't switch leagues, don't buy anything" triplet is **not** a hit — each item is concrete. |

The Friday Letter is otherwise clean and carries real voice markers: fragments ("Friday Letter No. 1."), a "But"/"And" start (line 37, "And quietly, behind the soccer noise"), flat opinions, dry bite ("Enjoy it while it lasts."), specific dates and numbers. Temperature is legible. It reads like a person.

### Em dashes

The guide says never. Every instance is structural rather than prose, which is a judgment call the writers appear to have made deliberately:

- `WELCOME-SEQUENCE-FINAL.md`: 12. Six are `## Email N — Day N` headings; six are the `— The Parent Coach Desk` sign-off.
- `FRIDAY-LETTER-001-2026-07-17.md`: 2. One heading, one sign-off.
- `hal/SPEC.md` 7, `ranger/SPEC.md` 5, `vera/SPEC.md` 2, `sunny/SPEC.md` 2 — all 16 in the same construct, a bulleted `` `file/path` — description `` reference line.

**Zero em dashes appear inside a prose sentence in any of the six files.** The specs consistently use colons where an em dash would have been easy. If Jeff reads the rule literally, the sign-off dash is the only one worth arguing about, and it appears 7 times.

---

## 6. STANDARD-AUDIT.md

It was **not** honest or current when this pass started. Corrected, and only where verified:

| Change | Reason |
|---|---|
| Pillar 1 `fixed` → **fail** | The Security lane opened HIGHs #17 and #18 and correctly logged them, then left this row `fixed` and left "No open Critical or High items" checked. The file contradicted itself in two places. |
| Pillar 8 `fixed` → **fail** | New open item #19: a live 500 on 296 public pages. Stays `fail` until the fix deploys, because the 500 is live now. |
| Pillar 9 `fixed` → **fail** | 22 real tsc errors against a claimed zero. Recorded the confirmed 222/222 test pass alongside it, and that `npm run check` is unverifiable in this sandbox. |
| Open item #2 (JWT) INFO → **MEDIUM** | The Worker lane built real JWKS verification, but it only runs when `ACCESS_TEAM_DOMAIN` and `ACCESS_AUD` are both set, and neither is set anywhere. Production still runs the unverified LEGACY path. Raised because a LEGACY fallback that looks fixed in the repo is easier to forget than an open gap. |
| Open item #18 HIGH → **NOT REPRODUCIBLE** | `/what-to-buy/` serves v5.18.2 with the full guide list. Symptom gone. Watch note left rather than a blind close. |
| **New #19 (HIGH)** | The 500. Root cause, blast radius, why the sitemap crawl was blind, the fix, and the three latent call sites. |
| **New #20 (HIGH)** | Vera/CANARY, with the two-failure timestamps proving it is armed. |
| **New #21 (MEDIUM)** | `wrangler.jsonc` is staging-only; two handoffs point at it for production settings. |
| Definition-of-done and the closing "block is clear" paragraph | Both rewritten. Three Highs are open. The 2026-07-14 all-clear is kept as history and labeled as such. |

**Nothing was marked fixed that I did not verify.** #19's fix is written but sits at "fixed in source, not deployed," and the pillar stays `fail` until it ships.

---

## Fixes applied, 2026-07-15 (follow-up pass)

### 1.6 is closed in code. Vera cannot be auto-paused.

The defect this section found is fixed. `applyCanary()` in `src/lib/agent-runs.ts` now carries a `CANARY_EXEMPT_AGENTS` set holding `pcd-deletion-monitor` and `vera`. An exempt agent never reaches `pauseAgent()`, so no `UPDATE agent_registry SET status = 'paused'` is issued for her at all.

Both names are in the set on purpose. `pcd-deletion-monitor` is her live registry key and `vera` is the key after the deferred rename, so the rename cannot silently un-exempt her. The reasoning is written at the exemption itself, at length, because the next reader will be tempted to tidy away a special case they do not understand.

**What she keeps.** A failed run still logs `status = 'failed'` with the real error, still posts to Slack, and still sets `needs_you = 1`. One addition beyond the brief: `finishRun()` now forces `needs_you` on a failed run of an exempt agent even when the caller omits it. That is the exact hole the 2026-07-14 row fell through, and an exemption that trades a pause for an escalation has to guarantee the escalation.

**The Slack line got louder.** An exempt trip now reads "N failures in 24h, agent is exempt from auto-pause and is still scheduled, fix it or switch it off by hand," rather than the pause text. An exemption that reported like a clean run would be the silent failure wearing a different hat.

### Tests

`tests/api/agent-runs.test.ts` went from 15 tests to 28. The new block, `CANARY exemption (Vera)`, runs against the real `applyCanary` and the real route with a fake D1, and mocks nothing that it claims to verify.

Proven, for both `pcd-deletion-monitor` and `vera`: two failures in the window return `paused: false`, and no pause statement is issued for any agent; the run still logs `failed` with the real guard error and still alerts Slack with it; the row still sets `needs_you = 1` from a payload that omits it. The controls: a non-exempt agent handed the identical two failures is still paused, a non-exempt agent does not get `needs_you` invented for it, and `isCanaryExempt` matches the two keys and rejects `vera-test` and `pcd-deletion-monitor-v2`.

**Mutation-checked.** With the exemption set emptied, 8 of the new tests fail and the non-exempt controls stay green. The tests are bound to the behavior rather than to the shape of the code.

### `npx tsc --noEmit`

The six errors in `tests/api/agent-runs.test.ts` are gone. Root cause: `vi.fn(async () => new Response('ok'))` infers a zero-parameter mock, so `slack.mock.calls[0][1].body` indexes an empty tuple, which is what TS2532 and TS2493 were both complaining about. Fixed with a typed fetch double and a `slackText()` helper that throws on a missing call instead of returning `undefined`, so a test that expects a Slack post fails loudly rather than reading a property off nothing.

Run against `tsconfig.verify.json` (the tree minus `worker-cron`, per this report's own method note):

```
$ npx tsc -p tsconfig.verify.json --noEmit
EXIT:0
```

**All 22 errors are gone.** Six were mine and are fixed here; the other 16 belong to the concurrent lane and were fixed by it during this pass, including the `src/lib/access-jwt.ts` TS2345. Earlier runs this pass reported parse errors in `tests/api/email.test.ts` and `tests/api/slack-lib.test.ts`, which were truncated mount snapshots rather than real errors, and both cleared on their own.

This is the first honest zero on this tree. `npm run check` is still the actual Pillar 9 bar and still cannot run here.

### `npx vitest run`

```
 ✓ tests/api/agent-runs.test.ts (28 tests) 67ms
 Test Files  27 passed (27)
      Tests  233 passed (233)
   Duration  22.20s
EXIT:0
```

**233, not 222.** This pass added 13 tests to `tests/api/agent-runs.test.ts`, taking it from 15 to 28. The rest of the tree went from 207 to 205, a net two fewer, which is the concurrent lane's arithmetic and not this one's.

Getting that number honestly took four runs, and three of them reported failures that were not real. First 15 suites failed to load on a truncated `src/lib/access-jwt.ts`, then two on `tests/api/email.test.ts` and `tests/api/slack-lib.test.ts`, each clearing on its own as the mount caught up.

Zero tests failed in any of those runs. The files could not be parsed, which is a different thing and reads identically in the summary line. Re-run it on Windows anyway, since this sandbox gave three wrong answers to the same question before it gave the right one.

**The mount artifact is worse than this report described, and it moves.** It does not only affect `worker-cron`. Any file edited during the session gets served truncated at its pre-edit byte length, so a lane can watch a neighbor's file break and heal as the mount catches up.

`src/lib/access-jwt.ts`, `tests/api/email.test.ts`, and `tests/api/slack-lib.test.ts` were all broken in the sandbox during this pass, and all three resolved on their own inside roughly 20 minutes. Nobody fixed them; the mount caught up.

Two workarounds hold. Write the file through bash (`cat fresh > target`) to refresh the mount's view of it, and never trust a bash read of a file the session has touched. Editor tools read the real disk, so a Read tool check is the tiebreaker every time.

### Docs

`automation/agents/vera/SPEC.md` §8 now records the exemption as built rather than requested, names both keys, and states the rename is still deferred and was not done here. Delta 2 in that file's delta list is marked closed, with a note that delta 1 (wiring her to the endpoint) is now safe to do.

`automation/RUN-LOG.md` documents the exemption list next to the CANARY rule it modifies, with the reasoning and a high bar for adding a name: an agent belongs there only when its failure is itself the alarm on a legal or safety obligation and nothing else is watching. Noise is not a reason.

**Not touched, deliberately:** `agents/pcd-deletion-monitor/SKILL.md` (another lane's file, and the rename stays deferred), `tests/api/email.test.ts`, `tests/api/slack-lib.test.ts`, `src/lib/access-jwt.ts`. No git, no build, no deploy. Nothing added here sends, publishes, deletes, or spends; the change removes an automatic action and adds none.

---

## What Jeff must know before shipping

1. **296 camp pages are returning HTTP 500 right now.** Fixed in source, not deployed. This is the one thing in this session that a parent could hit today.
2. ~~**Do not wire Vera to `/api/agent-runs` before adding a CANARY exemption.**~~ **Done. The exemption is in `applyCanary()` and covers both `pcd-deletion-monitor` and `vera`.** The two failures 23h59m apart can no longer pause her; they alert and set `needs_you` instead. Wiring her to the endpoint is now safe, and the rename is still deferred on purpose.
3. **P0.1 is not closed.** The deletion monitor is re-enabled, running, and blind. It has read zero messages. Connecting `jeff@coachjeffthomas.com` is the only thing that closes it.
4. **The Worker lane's "zero tsc errors" is wrong: there are 22.** Six of them (`tests/api/agent-runs.test.ts`) are fixed, and the `access-jwt.ts` one was fixed by its own lane. Run `npm run check` and `npx vitest run` on Windows before trusting Pillar 9 — neither the full suite nor `astro check` can be trusted from the sandbox while the mount is truncating in-flight files.
5. **`wrangler.jsonc` is staging.** Putting `FORGE_DB`, `ACCESS_TEAM_DOMAIN`, or `ACCESS_AUD` there configures nothing in production.
6. **`/what-to-buy/` fixed itself.** Do not spend a session on the `cacheDir` lead. The daily deploy hook almost certainly rebuilt it.
7. **The OpenAI key is still burned.** Sanitized in one file, still plaintext in `About Me/openai-config.md`. Only a rotation closes it.
8. **The site auto-deploys daily at 13:00 UTC.** Anything committed to `main` is live within a day, with no deploy click.
