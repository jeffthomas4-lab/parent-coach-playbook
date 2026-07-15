# Parent Coach Desk — Full Automation Audit
**Date:** July 14, 2026
**Sources:** Live site crawl, Cloudflare account (Workers/D1/KV/R2), local project docs (`Outputs/parent-coach-desk`), all 11 PCD scheduled tasks, imagegen skill. Verified directly against D1 where findings conflicted.

---

## Executive summary

PCD is roughly **70% automated on analysis and drafting, ~10% automated on shipping**. Eleven Claude scheduled tasks plus three Cloudflare Workers cover almost every operational lane — but nearly all of them stop at "draft and report; Jeff ships it." The deliberate HUMAN GATE is the design, not a bug, yet the audit found five places where the gate has become a leak: an apparently **dormant Cloudflare cron** (camp URL checks frozen since May 9), a **disabled compliance monitor** with a legal 30-day SLA, a **never-sent newsletter** promised site-wide, a **stale revenue section** (Gear Files on an old build), and **zero social distribution**. The binding constraint per your own operating manual — distribution, not product — is exactly where automation is thinnest.

### Automation scorecard

| Area | Automated | Manual | Grade |
|---|---|---|---|
| Content drafting (blog/news) | Rules watcher drafts, seasonal planner, freshness audit | Publish/deploy | B+ |
| Camps data pipeline | Org discovery (daily, live D1 writes), enrichment + Yelp workers, weekly steward QA | Admin approve/reject, submissions handling | B |
| SEO | Weekly GSC review + report | Every fix applied by hand; 0 organic clicks, indexing stalled | C |
| Affiliate ops | Weekly link health, monthly reconciliation | Link swaps, network apps, Gear Files redeploy | B- |
| Email | Friday Letter drafted weekly | Sending — **zero issues ever sent** | D |
| Social | Seasonal task builds a "social queue" | Everything — no accounts exist | F |
| Infra (Workers/D1/KV/R2) | Site cron (deploy hook + camps sweep) — **appears dormant** | Deploys, backups, secrets | C |
| Testing / monitoring | Heartbeat ping in sweep code | No tests, no uptime alerting, console-only errors | D |
| Image generation | imagegen skill on demand | Triggering it; no per-article OG images | C+ |
| Analytics | GSC weekly | GA4 mentioned in footer but not wired into any workflow | C- |
| Compliance (S4 deletion SLA) | pcd-deletion-monitor built | **Disabled** — nothing watching the inbox | F (while off) |

---

## Area findings

### 1. Content & blog pipeline
**Current state:** ~805 articles live, posting near-daily (4 posts on Jul 6 alone), Astro v5.18.2 static site, timely event-pegged content. `/news/` shows a bulk seed on Jun 11 then steady flow.
**Automated:** `pcd-rules-watcher` (Tue) drafts sourced "This Season" posts as `draft: true`; `pcd-seasonal-content-scheduler` (monthly) plans refreshes; `pcd-freshness-audit` (quarterly) produces risk-ranked correction lists; editorial approve route in the Worker writes markdown to GitHub.
**Manual:** All publishing. Drafts accumulate; nothing flips `draft: false`, builds, or deploys. Freshness corrections applied by hand.
**Build:** an approve-to-publish path — one Slack-approval action that flips the draft, commits, and fires the deploy hook.

### 2. SEO & distribution
**Current state:** Strong on-page hygiene (canonicals, unique metas, OG/Twitter cards, AI-crawler-friendly robots.txt). But **zero organic clicks two weeks running, ~288 indexed vs 1,206 crawled-not-indexed, rising 404s**. OG image is generic `og-default.jpg` on nearly every page. Schema.org/JSON-LD unverified. Trailing-slash canonical inconsistency.
**Automated:** `weekly-gsc-review` (Nora, Mon) — read-only report naming one highest-impact fix.
**Manual:** Every fix. Nothing closes the loop on 404s, redirects, or indexing submissions.
**Build:** per-article OG image generation (imagegen skill is sitting right there), JSON-LD verification/emission, a 404→redirect fixer that stages redirect rules for approval.

### 3. Email newsletter
**Current state:** Kit (ConvertKit) free tier, one form, lead magnet promised, `/newsletter/` page says **"We haven't sent an issue yet."** No automated sequences — not even a welcome email delivering the promised 28-page guide.
**Automated:** `pcd-friday-letter-draft` (Wed) writes a full draft with subject lines. Amazon-links-in-email ban correctly enforced.
**Manual:** Jeff pastes into Kit and sends — which has never happened.
**Build:** (a) Kit welcome automation delivering the lead magnet — subscribers are currently getting nothing they were promised; (b) send the backlog'd first issue; (c) longer term, Kit API send-with-approval.

### 4. Social
**Current state:** No accounts, no links anywhere on the site. The seasonal scheduler dutifully produces a social queue nothing consumes.
**Build:** decide the one channel worth owning (the manual's distribution thesis suggests this is P1, not P3), then a draft-and-stage posting task mirroring the Friday Letter pattern.

### 5. Camps directory & data pipeline
**Current state:** ~200 PNW listings live with 2026 dates. **Live engine is `activity-radar` D1** (verified: 198,287 orgs, 3,287 with websites, 2,411 programs, org writes through 2026-07-14, scan queue active through 2026-07-13). `activityradar-enrichment` (hourly) and `activityradar-yelp` (daily) workers redeployed 2026-07-13. `org-discovery-daily-worklist` is the one task that **writes production data autonomously** (≥75 confidence gate) — and it works.
**Manual:** Admin approve/reject/verify in the admin UI; submissions get no confirmation emails; reviews/claims/featured tables empty; placeholder data ("ages 0–99," missing coordinates).
**Concerns found:**
- The **legacy `parent-coach-playbook` D1** (all activity frozen at 2026-05-09) still exists and the production Worker's `DB` binding points at it per the bundled code. This is your unresolved Open Item 6 (D1 identity conflict) made concrete — confirm which DB the live site actually reads and retire the other.
- `parent-coach-playbook-cron`'s camps sweep **silently skips if `CRON_KEY`/`SWEEP_URL` are unset**, and URL-health timestamps in the legacy DB froze May 9. Either the cron is dead or it's sweeping a dead database.
- No backup automation: `backup-activity-radar.ps1` exists but the manual-3x proving clock never started (Open Item 10).
**Build:** resolve D1 identity, revive/repoint the sweep, transactional email for submitters, backup on a schedule.

### 6. Affiliate ops (the revenue engine)
**Current state:** 135 live picks across Amazon, CJ, SoccerGarage, Bookshop; 8 network applications pending; clean `/go/` cloaking with compliant disclosures. **No revenue recorded anywhere yet** (projections only).
**Automated:** `pcd-link-health-monitor` (Mon, ~monthly full rotation, two-tier browser verification — the only thing checking affiliate destinations); `pcd-affiliate-reconciler` (monthly).
**Manual:** Link swaps, network applications, follow-up emails (drafted, never sent).
**Biggest finding:** `/what-to-buy/` — the money section — is on a **stale Astro v4.16.19 build** with outdated nav/footer ("Updated Feb 2026") while the rest of the site runs v5.18.2. The revenue pages missed the redeploy.
**Build:** rebuild/redeploy Gear Files immediately; verify a `/go/` link actually lands on Amazon with the tag intact (couldn't be confirmed in this audit); stage link swaps as approvals instead of report-only.

### 7. Infrastructure
**Current state:** Three PCD Workers — `parent-coach-playbook` (Astro SSR, ~20 API routes, Cloudflare Access admin, R2 photos, actively deployed), `parent-coach-playbook-cron` (deploy hook + sweep), `parent-coach-desk-staging` (created 2026-07-14 — migration in flight?). No hardcoded secrets in Workers. Good try/catch discipline.
**Gaps:** admin cookie path decodes the Access JWT **without verifying its signature** (flagged in-code as phase-2 debt); alerting is console-only; no email integration anywhere in the Workers; sweep alert message references tables that don't exist (copy-paste drift from ActivityRadar); no tests in the bundle.
**Local security finding:** `gen_hero_image.py` in the Cowork root has a **hardcoded live OpenAI API key on line 4**. Rotate it and use the imagegen skill path.

### 8. Testing & monitoring
Effectively none. No test suite, no uptime monitor confirmed (heartbeat URL may or may not be configured), no deploy verification, and several scheduled tasks (Friday Letter, seasonal, freshness) have no logging or Slack contract at all — a silent failure there is invisible. Only 3 of 10 enabled tasks demonstrably ran this week; the rest are inferred healthy. Open Item 3 (no PCD rows in `agent_runs`) means the run log you built isn't being written to.

### 9. Compliance
`pcd-deletion-monitor` is **disabled**. Its own SKILL.md: "The 30-day SLA does not pause for football season. This is the one PCD agent maintenance mode never idles." While off, deletion/opt-out requests burn SLA days silently. The Apply Handoff doc says this was to be built and running in July — it's built, it's just off. Also outstanding: Open Item 7 (no ToU/UGC/refund terms — correctly blocking the $79/yr listing launch).

### 10. Documentation drift (quick hits)
The operating manual's task inventory still lists the deleted `pcd-gsc-analytics-report`; the venture file and manual disagree on which agents are active; KIT_SETUP.md and imagegen's default save path still point at the dead `parent-coach-playbook` name; venture file still lists `parentcoachplaybook@gmail.com` as deletion contact post-purge.

---

## Prioritized build roadmap

**P0 — This week (leaks, not features)**
1. **Re-enable `pcd-deletion-monitor`.** Legal SLA is unwatched. If it auto-paused (CANARY), find out why first.
2. **Fix the Cloudflare cron.** Verify the trigger + `CRON_KEY`/`SWEEP_URL`/`DEPLOY_HOOK_URL` secrets; repoint the sweep at `activity-radar`. URL health has been frozen since May 9.
3. **Rotate the hardcoded OpenAI key** in `gen_hero_image.py`; delete or sanitize the file.
4. **Redeploy `/what-to-buy/`** on the current build, and manually verify one `/go/` link lands on Amazon with your associate tag.

**P1 — This month (before Aug–Nov maintenance mode)**
5. **Send Friday Letter #1** and build the Kit welcome automation that delivers the promised lead magnet. The list is live and receiving nothing.
6. **Resolve the D1 identity conflict** (Open Item 6): confirm what the live site reads, migrate, retire the stale DB.
7. **Approve-to-publish pipeline:** Slack approval → flip draft → commit → deploy hook. Unblocks rules-watcher drafts and freshness fixes at near-zero marginal effort.
8. **Wire `agent_runs` logging + failure alerting into all PCD tasks** (Open Item 3). You can't trust maintenance mode without knowing when tasks silently die.
9. **Start the D1 backup clock** (Open Item 10) — schedule `backup-activity-radar.ps1` or a Worker-side export.

**P2 — Next quarter**
10. Per-article OG images via the imagegen skill (feeds the AI-citation SEO strategy).
11. Transactional email in the Worker (submission confirmations, admin alerts) — currently zero email code exists.
12. One social channel, draft-and-stage pattern, consuming the seasonal task's existing social queue.
13. 404/redirect fixer staging GSC fixes as approvals; verify JSON-LD emission.
14. Verify the Access JWT signature on the admin cookie path (documented phase-2 debt).

**P3 — When distribution works**
15. Camp reviews/claims/featured-listing features (tables exist, all empty) — gated on Open Item 7 legal terms.
16. Kit API automated sending; affiliate link auto-swap with approval; uptime/synthetic monitoring; test suite for the Worker API routes.

**Deliberately not recommended:** removing the HUMAN GATE on payments, deletions, or outbound email — your reconciliation memo already litigated this correctly.
