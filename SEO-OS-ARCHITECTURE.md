# PCD SEO Operating System: Architecture Spec

**Date:** 2026-07-31
**Status:** design only. Nothing in this file is built. No code was written, no migration applied, no schedule created.
**Mode:** Audit and Recommendation. Stays there until Jeff changes it in writing.
**Governs:** the SEO layer for parentcoachdesk.com, designed to port to coachjeffthomas.com, reidhaller.com, calebarlow.com, and readandreactfootball.com afterward.
**Reads first:** `PCD-OPERATING-MANUAL.md` (SOP S1, section 3.4), `ORGANIC-SEARCH-AUDIT.md`, `automation/APPROVAL-MATRIX.md`, `automation/agents/nora/SPEC.md`, `PCD-AI-OS/02-intelligence-architecture.md`, `About Me/Website-Build-Standard.md` Pillar 10.

---

## 1. The read before the design

The 14-agent spec assumes a site with traffic to analyze. PCD does not have one yet, and three months of Nora's own reports say the problem is narrower and more urgent than the spec is aimed at.

### What the last three GSC pulls actually show

| Metric | Jul 12 | Jul 20 | Jul 28 |
|---|---|---|---|
| Clicks (7d) | 0 | 0 | 0 |
| Impressions (7d) | 2 | 3 | 4 |
| **Indexed pages** | **288** | **228** | **90** |
| Not indexed (total) | 1,427 | ~1,503 | ~2,880 |
| Crawled, not indexed | 1,206 | 1,261 | 1,429 |
| Discovered, not indexed | 0 | 0 | 1,208 |
| External backlinks | 0 | 0 | 0 |
| Sitemap URLs (index) | 3,024 | 2,479 | 2,455 |

Indexed pages fell 69 percent in sixteen days. Not-indexed doubled over the same window. Google currently keeps 90 pages out of roughly 2,970 it knows about, which is 3 percent.

*Sources: Jul 12 from `ORGANIC-SEARCH-AUDIT.md` except the impression figure, which is the 7-day count in `gsc-reviews/GSC_REVIEW_2026-07-13.md` (the audit reports 35 over three months, not a 7-day number). Jul 20 and Jul 28 from `reports/seo/gsc-review-2026-07-20.md` and `-2026-07-28.md`.*

That is the whole problem, and it is not a problem any of the 14 agents in the spec is pointed at. Agents 2, 3, 5, 9, 11, and 13 all read performance data that does not exist. Building them now means building six agents that report zeroes.

### The two facts that set the ceiling

The Organic Search Audit already ranked this correctly on 2026-07-12 and nothing has changed since. Cause 1 is a domain that is two months old with zero inherited authority, because parentcoachplaybook.com was allowed to die without 301s. Cause 2 is zero external backlinks. Both are slow, and no amount of on-page analysis moves either.

What sits under them is the thing the site controls: PCD publishes roughly 33 pages for every one Google accepts. Nobody on the current roster owns that ratio.

### The scheduling fact that reframes everything

Maintenance mode starts tomorrow. `PCD-OPERATING-MANUAL.md` section 3.4 idles every PCD scheduled task from August through November, report-only, no writes, no build work. The SEO fix work is named in that list explicitly.

So the design constraint is not "run a comprehensive SEO program." It is "build the thing that keeps watching, keeps a clean queue, and does not need Jeff for four months, then hands him an accurate December briefing." Any agent that requires an approval to be useful is dead weight until December.

That single fact should drive the build order more than anything in the pasted spec.

### What already exists

Half the proposed system is already designed or running. Building it again would be the most expensive mistake available here.

| Spec agent | Already covered by | State |
|---|---|---|
| 1. Technical SEO Auditor | `/web:seo`, `/web:security`, `/web:performance`, `/web:mobile`, `/web:audit` | Live slash commands, run against any project |
| 2. Search Opportunity Researcher | Nora S1 | Live, but has zero query data to research |
| 3. Content Inventory / Cannibalization | `editorial_opportunities.cannibalization_decision` (migration 0024) | Schema written, unapplied |
| 4. Content Brief Architect | Ed + `editorial_briefs` / `editorial_claims` (0024) | Ed live under four scheduled tasks; schema unapplied |
| 5. Content Refresh | `pcd-blog-refresher`, `pcd-freshness-audit`, `editorial_maintenance_proposals` | Live |
| 6. Internal Linking | `reports/internal-links/` sprint, `scripts/check-built-internal-links.mjs` | Ran July 4, tooling exists |
| 7. Directory Quality / Local | Ranger, split across five live tasks | Live for data quality. The SEO half is unowned. |
| 8. Affiliate / Commercial | Hal, superseded by a four-stage pipeline (Linda, Arnie, Alfred, reconciler) + migration 0023/0027 | Live |
| 9. SERP / Competitor | nothing | Not built, and nothing to defend yet |
| 10. Authority / Digital PR | Nora Class B, session-triggered only | Drafts exist. No pipeline, no owner, no cadence. |
| 11. Conversion / Journey | Frida + Kit drip | Live for email. No organic-journey owner. |
| 12. SEO QA | `/web:` reviewers, `qa-human-tester`, `About Me/Anti AI Writing.txt`, VOICE-RUBRIC | Live |
| 13. Performance Analyst | Nora S1 weekly review | Live |
| 14. Orchestrator | `jarvis-orchestrator`, `automation/APPROVAL-MATRIX.md` | Live |

The honest conclusion: PCD does not need an SEO department. It needs three agents it does not have, one existing agent moved off a browser session onto an API, and six agents designed now and switched on when their data exists.

---

## 2. Proposed roster

Four to build. Six deferred with a named trigger. Four folded into existing owners.

### Build now

**A. Index Economics Agent (new).**

*Problem it fixes:* indexed pages went 288 to 228 to 90 while not-indexed doubled, and no agent owns the ratio. Nora reported the drop correctly and could not diagnose it because her Chrome session dropped mid-run on July 28, leaving the crawl-stats question open. That question is still open today.

*What it does:* holds the page-level inventory. For every URL the site publishes, it tracks whether Google has crawled it, indexed it, refused it, and under which reason. It answers one question every run: is the gap between pages published and pages accepted getting better or worse, and which template is responsible. It proposes what to stop publishing, never what to publish.

*Why it is first:* every other SEO lever is downstream of a page being in the index. A refresh agent cannot refresh a page Google refuses to keep.

*Class:* A (report) and B (draft proposals). Never C or D.

**B. Nora on the API (upgrade, not a new agent).**

*Problem it fixes:* the weekly review runs through a logged-in browser. It failed mid-run on July 28 and lost the crawl-stats pull. It cannot run at all while Jeff is on a sideline, which is exactly the four months the system most needs to keep watching.

*What changes:* the GSC pull moves to the Search Console API with a service account. Same report, same file location (`reports/seo/gsc-review-YYYY-MM-DD.md`), same Class A posture. Adds a daily anomaly check that is cheap enough to run unattended and only speaks when a threshold trips.

*Why it matters more than it sounds:* this is the difference between a system that survives August through November and one that goes dark with it.

**C. Link Earning Agent (new).**

*Problem it fixes:* external backlinks: 0. The Organic Search Audit names this as one of two ceiling-setters. Nora drafts outreach when Jeff asks. Nobody works a pipeline, nobody tracks a target from identified to pitched to landed, and the fifteen targets drafted on July 13 have no status field anywhere.

*What it does:* maintains the target list, tracks state per target, drafts the pitch, and watches GSC Links for the first non-zero external link. Never sends. Never buys. Flags anything that smells like a link scheme and stops.

*Why it is on the build list during maintenance mode:* it is the one agent whose output compounds while Jeff is gone. A December folder of twenty researched, drafted, ready-to-send pitches is worth more than four months of accumulated reports.

**D. Directory Index Policy Agent (new, or a scoped extension of Ranger).**

*Problem it fixes:* the camp directory is both the largest page-count source and the largest not-indexed source. Ranger owns whether a camp record is accurate. Nobody owns whether a camp page deserves to be in the index at all. That is the decision driving the 1,429 in "crawled, not indexed."

*What it does:* scores each directory page on whether it carries anything a human would want that the source page does not already have. Recommends a publish threshold, and recommends which existing pages to pull out of the sitemap. Proposes only, per the 0024 lifecycle. It also closes the open /adaptive/ question from the July 28 review: 1,208 pages landed in "discovered, not crawled" in one week and nobody has confirmed whether that silo went live recently or got orphaned.

*Decision needed:* build as a fifth agent, or extend Ranger. Recommendation is extend Ranger, because the data layer and the index layer are the same records and splitting them means two agents fighting over one table. See section 10.

### Deferred, with the trigger that activates each

These are designed in this file and not built. Each one has a condition; when the condition is met, it gets a build session and nothing sooner.

| Agent | Trigger to build |
|---|---|
| 2. Search Opportunity Researcher | GSC returns 50+ query rows above the anonymization threshold |
| 3. Cannibalization Auditor | 200+ indexed pages and at least one query with two ranking URLs |
| 5. Content Refresh (SEO-driven) | 20+ pages with 30 days of impression history to compare |
| 9. SERP / Competitor Intelligence | Any PCD page holds a top-20 position on a query with real volume |
| 11. Conversion / Journey | 100+ organic sessions per month landing on a non-homepage URL |
| 13. Performance Analyst (standalone) | Clicks are non-zero for four consecutive weeks |

Every one of these is currently gated on the same thing: traffic. Building them now produces agents that report zeroes and burn the scarcest resource in the company, which is Jeff's attention. That is the exact failure `PCD-AI-OS/02-intelligence-architecture.md` warns about in its own caveat.

### Folded into existing owners

| Spec agent | Owner | Note |
|---|---|---|
| 1. Technical SEO Auditor | `/web:seo` + `/web:audit` | Add the crawl-and-status-code sweep the pillar reviewer does not currently do. One command edit, not an agent. |
| 4. Content Brief Architect | Ed | Briefs already have a schema in 0024. Ed writes them. |
| 8. Affiliate / Commercial | Hal's four-stage pipeline | Already better than the spec's single agent, because it has a human gate between sourcing and deploy. |
| 12. SEO QA | `/web:` reviewers + `About Me/Anti AI Writing.txt` + VOICE-RUBRIC | Already stricter than the spec's checklist. |

---

## 3. Technical architecture

No new vendor. Everything runs on primitives already in the estate.

```
                    ┌─────────────────────────────────┐
   GSC API ────────▶│  scripts/seo/pull-gsc.mjs       │
   (service acct)   │  (nightly, service account)     │
                    └────────────┬────────────────────┘
                                 │ writes
                                 ▼
   Live site ──────▶ ┌───────────────────────────────┐
   crawl (own site,  │  reports/seo/data/*.json      │◀── MVP data home
   rate-limited)     │  (git-versioned, append-only) │
                    └────────────┬───────────────────┘
                                 │ later: load into
                                 ▼
                    ┌───────────────────────────────┐
                    │  PCD_OPS_DB (D1)              │
                    │  0030 seo_url_inventory       │
                    │  0031 seo_snapshots           │
                    │  0032 seo_changes             │
                    │  reuse: editorial_* (0024)    │
                    └────────────┬───────────────────┘
                                 │ read by
                                 ▼
     ┌────────────┬──────────────┴───────┬─────────────────┐
     ▼            ▼                      ▼                 ▼
  Index        Nora               Link Earning        Directory
  Economics    (GSC weekly)       (authority)         Index Policy
     │            │                      │                 │
     └────────────┴──────────┬───────────┴─────────────────┘
                             ▼
                  reports/seo/*.md  +  agent_runs row
                             │
                             ▼
                  Slack #pcd-agent-notications
                  (only when needs_you = true)
```

### The data-home call

D1 is available. You ran `npx wrangler d1 migrations apply PCD_OPS_DB --remote --config wrangler.production.jsonc` on 2026-07-29; all 17 migrations applied clean and `parent-coach-desk-ops-production` went from 4 tables to 76, including all ten `editorial_*` tables (`ADMIN-ARCHITECTURE-REVIEW-2026-07-29.md`, item #45). So the D1 answer stands and is executable.

Three real caveats, none of them blocking:

**1. `EDITORIAL_LIFECYCLE_ENABLED` is still `false` in `wrangler.production.jsonc`.** That flag gates the ten editorial admin *routes*, not the tables. Item #45's sequencing note says to leave it off until open items #47 and #49 are fixed. The new `seo_*` tables have no public or admin route by design, they are read by scripts through the D1 MCP, so the flag does not gate them. What it does gate: any plan to surface the SEO queue in `/admin`. That waits.

**2. Staging is four migrations behind production.** `parent-coach-desk-ops-staging` (`7f0da00d`) sits at 0022. New migrations 0030 through 0032 should be rehearsed there first, which means applying the backlog to staging as part of session 3.

**3. `migrations-pcd-ops/README.md` is stale.** It still describes 0023 through 0028 as "committed local design only, none applied." That was true on 2026-07-17 and false since 2026-07-29. The README should be corrected as part of session 3, because the next person to read it will make the same mistake I did.

Also worth naming: two files in that directory are numbered `0023`, and the highest existing migration is `0029_admin_action_receipts.sql`. So 0030 through 0032 is the correct next range, and residue (c) from item #45 (rename one 0023 to keep the sequence replayable from scratch) is still open and unrelated to this work.

**Recommendation.** Write and rehearse 0030 through 0032 in session 3, but have the pull scripts write JSON to `reports/seo/data/` first and load into D1 second. Not because D1 is unavailable, but because the JSON pull is the thing that can ship in week 1 without a migration review, and having the raw capture on disk is what makes every derived number traceable back to the bytes it came from. That is the SOURCE RULE from `PCD-AI-OS/02-intelligence-architecture.md` section 2.1, made physical without an R2 bucket.

D1 becomes the queryable layer the reports read. JSON stays the capture layer. Both, not either.

### Where each piece runs

- **Data pulls:** Node scripts under `scripts/seo/`, run by Claude scheduled tasks. Not Workers. The GSC API needs a service-account JWT flow and there is no reason to put that in the request path of a public site.
- **Analysis:** the four agents, as Claude scheduled tasks, matching the existing PCD pattern. Each one posts a start and finish to `POST /api/agent-runs` through `scripts/agent-run-client.mjs`. This closes the gap `automation/TASK-RUN-LOG-RECONCILIATION.md` has been tracking, where `/admin/agents` shows a registry full of agents with no run evidence.
- **Own-site crawl:** rate-limited, `robots.txt`-respecting, own domain only. Never a competitor crawl. Competitor work is manual reading, not automated fetching.
- **Reports:** markdown under `reports/seo/`, where Nora already writes.
- **Escalation:** one Slack line to `#pcd-agent-notications` (`C0BJC3WTNKC`) only when `needs_you = true`, per `automation/SLACK-STAGING.md`.

### Model routing

Opus orchestrates: the four agents' reasoning, scoring, diagnosis, and every judgment call about what to publish or pull. Sonnet writes code only: the pull scripts, the crawl script, the JSON schema validators, the migration SQL. No agent's judgment runs on Sonnet.

---

## 4. Proposed database schema

Three new tables. Everything else reuses migration 0024, which already covers opportunities, sources, briefs, claims, relationships, reviews, approvals, and maintenance proposals better than the pasted spec's version does.

Written to the conventions of the existing lineage: TEXT primary keys, CHECK constraints on every enum, TEXT timestamps, explicit indexes, no PII.

### 0030_seo_url_inventory.sql

One row per URL the site publishes. Current state, not history.

```sql
CREATE TABLE seo_url_inventory (
  url TEXT PRIMARY KEY,                    -- path only, e.g. '/camps/nike-soccer-oregon-state/'
  page_type TEXT NOT NULL CHECK(page_type IN (
    'home','hub','article','guide','gear','script','body','camp',
    'camp_state','camp_sport','directory','tool','legal','other'
  )),
  topic_cluster TEXT,
  search_intent TEXT CHECK(search_intent IS NULL OR search_intent IN (
    'informational','navigational','commercial','transactional','local'
  )),
  audience TEXT CHECK(audience IS NULL OR audience IN (
    'parent','coach','athlete','organization','mixed'
  )),
  -- Crawl-observed state
  status_code INTEGER,
  canonical TEXT,
  indexable INTEGER CHECK(indexable IN (0,1)),
  title TEXT,
  meta_description TEXT,
  h1 TEXT,
  word_count INTEGER,                      -- diagnostic only, never a target
  structured_data TEXT,                    -- comma-separated JSON-LD @type list
  in_sitemap INTEGER CHECK(in_sitemap IN (0,1)),
  internal_links_in INTEGER,
  internal_links_out INTEGER,
  -- GSC-observed state
  gsc_coverage_state TEXT CHECK(gsc_coverage_state IS NULL OR gsc_coverage_state IN (
    'indexed','crawled_not_indexed','discovered_not_indexed','duplicate_canonical',
    'alternate_canonical','not_found','blocked_robots','redirect','soft_404','unknown'
  )),
  gsc_last_crawled TEXT,
  -- Judgment
  differentiation_score INTEGER CHECK(differentiation_score IS NULL OR differentiation_score BETWEEN 0 AND 100),
  recommended_action TEXT CHECK(recommended_action IS NULL OR recommended_action IN (
    'keep','improve','consolidate','noindex','remove_from_sitemap','redirect','review'
  )),
  action_reason TEXT CHECK(action_reason IS NULL OR length(action_reason) <= 1000),
  risk_level TEXT CHECK(risk_level IS NULL OR risk_level IN ('none','low','medium','high')),
  last_crawled_by_us TEXT,
  last_human_verified TEXT,
  freshness_deadline TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX idx_seo_url_coverage ON seo_url_inventory(gsc_coverage_state, page_type);
CREATE INDEX idx_seo_url_action ON seo_url_inventory(recommended_action, differentiation_score);
CREATE INDEX idx_seo_url_type ON seo_url_inventory(page_type, indexable);
```

### 0031_seo_snapshots.sql

Append-only. One row per URL per day per metric. This is what makes "indexed count fell 138 in a week" answerable at page level instead of dashboard level, which is exactly what was missing on July 28.

```sql
CREATE TABLE seo_snapshots (
  id TEXT PRIMARY KEY,
  captured_on TEXT NOT NULL,               -- date, not timestamp: one pull per day
  scope TEXT NOT NULL CHECK(scope IN ('site','url','query','sitemap')),
  scope_ref TEXT NOT NULL,                 -- '/' for site, the path for url, hashed query for query
  metric_key TEXT NOT NULL CHECK(metric_key IN (
    'clicks','impressions','ctr','position',
    'indexed_count','not_indexed_count','coverage_state',
    'external_links','internal_links','sitemap_urls','status_code'
  )),
  metric_value REAL,
  metric_text TEXT,                        -- for coverage_state and other non-numeric metrics
  source TEXT NOT NULL CHECK(source IN ('gsc_api','own_crawl','sitemap','manual')),
  raw_ref TEXT,                            -- path to the raw pull this was derived from
  run_id TEXT,
  created_at TEXT NOT NULL,
  UNIQUE(captured_on, scope, scope_ref, metric_key)
);

CREATE INDEX idx_seo_snapshots_trend ON seo_snapshots(scope, scope_ref, metric_key, captured_on DESC);
CREATE INDEX idx_seo_snapshots_day ON seo_snapshots(captured_on, metric_key);
```

Note on query storage: `scope = 'query'` stores a SHA-256 hash in `scope_ref`, never the raw string, matching the privacy posture 0024 already sets ("no verbatim query string"). The readable query lives only in the generated markdown report, which is not a database and not syndicated.

### 0032_seo_changes.sql

Every recommendation, from proposal through validation. This is the audit trail the pasted spec asks for and the piece with no existing equivalent.

```sql
CREATE TABLE seo_changes (
  id TEXT PRIMARY KEY,
  url TEXT,                                -- null for site-wide changes
  change_type TEXT NOT NULL CHECK(change_type IN (
    'title','meta','canonical','redirect','noindex','sitemap','internal_link',
    'content_refresh','content_consolidate','content_remove','structured_data',
    'template','robots','outreach','other'
  )),
  approval_level INTEGER NOT NULL CHECK(approval_level IN (1,2,3)),
  before_state TEXT,
  after_state TEXT,
  reason TEXT NOT NULL CHECK(length(reason) BETWEEN 1 AND 2000),
  expected_outcome TEXT NOT NULL,
  confidence INTEGER NOT NULL CHECK(confidence BETWEEN 0 AND 100),
  proposed_by TEXT NOT NULL,
  proposed_at TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN (
    'proposed','approved','rejected','implemented','validated','rolled_back','superseded'
  )),
  approved_by TEXT,
  approved_at TEXT,
  implemented_at TEXT,
  commit_sha TEXT,
  validation_method TEXT,
  validation_due TEXT,
  validated_at TEXT,
  actual_outcome TEXT,
  verdict TEXT CHECK(verdict IS NULL OR verdict IN ('kept','revised','rolled_back','inconclusive')),
  rollback_instructions TEXT,
  CHECK(status NOT IN ('approved','implemented','validated') OR approved_by IS NOT NULL),
  CHECK(approval_level = 1 OR status <> 'implemented' OR approved_at IS NOT NULL)
);

CREATE INDEX idx_seo_changes_status ON seo_changes(status, approval_level, proposed_at DESC);
CREATE INDEX idx_seo_changes_url ON seo_changes(url, proposed_at DESC);
CREATE INDEX idx_seo_changes_validation ON seo_changes(validation_due) WHERE status = 'implemented';
```

That last partial index is the one that makes the system honest. It answers "what did we change 30 days ago that nobody has checked" in one query.

### Reused, not rebuilt

| Spec table | Existing table | Migration |
|---|---|---|
| Opportunities | `editorial_opportunities` | 0024 |
| Sources | `editorial_sources` | 0024 |
| Content briefs | `editorial_briefs`, `editorial_claims` | 0024 |
| Internal link map | `editorial_relationships` | 0024 |
| Refresh / consolidate proposals | `editorial_maintenance_proposals` | 0024 |
| State history | `editorial_lifecycle_events` | 0024 |
| Run log | `agent_runs`, `agent_registry` | `forge-command` D1 |
| Event bus | `events` | 0025 |

One conflict to flag. `editorial_opportunities.source` has a CHECK constraint with a fixed enum. Adding an SEO-specific source value (`index_gap`, `link_target`) means a table rebuild in SQLite. Options: use the existing `gsc` value and carry the distinction in `signal_summary`, or write a 0033 that rebuilds the constraint. Recommendation is the former until there is a real reason for the latter.

---

## 5. Required integrations and credentials

| # | Integration | Cost | Who sets it up | Blocking? |
|---|---|---|---|---|
| 1 | **Google Search Console API** | Free. No paid tier, no per-call charge. Quotas only: 1,200 QPM per site, 50,000 page-keyword rows per property per day per search type. PCD will not come close. | Jeff. Create a Google Cloud project, enable the Search Console API, create a service account, download the JSON key, then add the service-account email as a user on the `sc-domain:parentcoachdesk.com` property in GSC. Roughly 15 minutes. | **Yes.** Agents A and B depend on it. |
| 2 | Service-account key storage | Free | Store as a local env var for the scheduled task. Never in the repo, never in the frontend bundle, per Pre-Launch Security Gate items 7 and 8. Add the key filename to `.gitignore` and `.gitleaksignore` before the first commit. | Yes |
| 3 | Own-site crawl | Free | Sonnet writes it. Rate-limited, respects `robots.txt`, own domain only. | No |
| 4 | Cloudflare D1 MCP | Already connected | Read-only queries for the URL inventory reconciliation. | No |
| 5 | Slack | Already connected | `#pcd-agent-notications`, `C0BJC3WTNKC`. Escalation only. | No |
| 6 | `POST /api/agent-runs` | Already built | `scripts/agent-run-client.mjs` exists and is not being called by the scheduled tasks. Wiring it is part of this build. | No |
| 7 | Analytics (GA4 or Cloudflare Web Analytics) | Free | **Open question.** Conversion tracking and the journey agent need a session source. Nothing in the repo confirms which is live. Needs an answer before the deferred agent 11 is built, not before the MVP. | No |
| 8 | Third-party backlink check (Ahrefs Webmaster Tools) | Free for a verified property | Optional. GSC External = 0 is authoritative for what Google counts. AWT would confirm nothing uncounted exists. Open item from the July 12 audit, still open. | No |

Nothing here costs money. That was the question and the answer is clean: the Search Console API is free for verified site owners, governed by quota rather than billing, and PCD's volume is two orders of magnitude under the limits.

---

## 6. Recommended scheduling plan

Designed around maintenance mode, not around the pasted spec's daily/weekly/monthly/quarterly cadence.

### August through November (the idle)

Everything runs, nothing writes. Report-only, no approvals required, no Slack noise unless a threshold trips.

| Cadence | Task | Class | Output |
|---|---|---|---|
| Daily 6:10 AM | GSC API pull + own-site status sweep | A | `reports/seo/data/YYYY-MM-DD.json`, silent unless a threshold trips |
| Weekly Sun 9:00 PM | Nora, existing `weekly-gsc-review` slot, now API-fed | A | `reports/seo/gsc-review-YYYY-MM-DD.md` |
| Weekly Mon 7:00 AM | Index Economics: published-vs-accepted ratio by template | A | `reports/seo/index-economics-YYYY-MM-DD.md` |
| Biweekly | Link Earning: research targets, draft pitches, never send | B | `reports/seo/outreach/` |
| Monthly | Directory index policy pass over a rotating slice | A/B | `reports/seo/directory-index-YYYY-MM.md` |

**Daily escalation thresholds.** These are the only things that interrupt Jeff during the season:

- Indexed count drops more than 15 percent week over week
- Sitemap status flips to Error
- A previously-indexed page starts returning 5xx
- The first non-zero external backlink appears (good news, worth knowing same day)
- Two consecutive failed GSC pulls (the system going blind is itself an incident)

Everything else accumulates.

### December (the quarterly close)

One session. The system hands over: the four months of trend, what moved without intervention, the approval queue that built up, the outreach pitches ready to send, and a ranked list of what to do in the first two weeks back. Approval levels 2 and 3 all clear here.

### December onward

Return to the pasted spec's cadence: daily lightweight, weekly optimization, monthly strategic, quarterly governance. Not before. Running a monthly strategic review in September on a site nobody is working produces four identical documents.

### On the scoring model

The 7-factor, 100-point model in the spec is sound and unusable right now. Search opportunity, conversion potential, and revenue potential are all unmeasurable at 0 clicks, which means 50 of the 100 points would be guesses dressed as numbers.

Recommendation until query data exists: score on four factors and say so.

| Factor | Weight |
|---|---|
| Index probability (will Google actually keep this page) | 35% |
| Authority contribution (does this earn or consolidate a link) | 30% |
| Parent usefulness | 25% |
| Maintenance burden | 10% (subtracted) |

Switch to the full 7-factor model when the trigger for deferred agent 2 fires. Log the switch in `seo_changes` so the score history is interpretable across the change.

---

## 7. Implementation order

Each row is one working session. Sonnet writes the code, Opus does the judgment.

| # | Build | Depends on | Session type |
|---|---|---|---|
| 1 | GSC service account + `scripts/seo/pull-gsc.mjs` + JSON schema | Jeff's 15 minutes in Google Cloud | Sonnet |
| 2 | Own-site crawl script, `scripts/seo/crawl-inventory.mjs` | none | Sonnet |
| 3 | Migrations 0030-0032 + correct the stale `migrations-pcd-ops/README.md` + bring staging current | 1, 2 (field shapes settled) | Sonnet |
| 4 | Nora SPEC update: API path, daily anomaly check, thresholds | 1 | Opus |
| 5 | Index Economics agent SPEC + first real run | 1, 2 | Opus |
| 6 | Link Earning agent SPEC + target list migrated from the July 13 draft | none | Opus |
| 7 | Wire all four to `POST /api/agent-runs` | 4, 5, 6 | Sonnet |
| 8 | Directory index policy, as a Ranger extension | 5 | Opus |
| 9 | `/web:seo` extension: crawl sweep, status codes, orphan detection | 2 | Sonnet |
| 10 | Portability pass: parameterize for the other four sites | 1-9 | Sonnet |

Sessions 1 through 5 are the MVP. Sessions 6 through 10 are the rest.

### Build status

| Session | Agent | Scheduled task | State |
|---|---|---|---|
| 6 | Link Earning (**Lonnie**) | `pcd-link-earning`, Wed 7:15 AM | **Built 2026-07-31.** Needs no credentials. |
| 8 | Directory Index Policy (**Dex**) | `pcd-directory-index-policy`, day 4 of month 7:45 AM | **Built 2026-07-31.** Needs no credentials. |
| 1, 4, 5 | GSC pull, Nora on API, Index Economics | not yet created | **Blocked** on the Google Cloud service account. |
| 2, 3, 7, 9, 10 | crawl script, migrations, run logging, `/web:seo`, portability | not yet created | Sequenced after the above. |

Both built tasks reference `scripts/seo/pull-gsc.mjs` conditionally ("if it exists by the time you run") and fall back to Claude in Chrome against the GSC dashboard, so neither breaks while the service account is pending. Both commit through `scripts/safe-commit.sh` rather than plain git, per the documented mount problem in `pcd-review-publish`.

Dex fires first, on August 4. His first job is closing the `/adaptive/` question that has been open since July 28.

---

## 8. Thirty-day rollout

Days 1 through 30 land inside maintenance mode. That is deliberate: the build is small enough to fit, and the whole point is to have it running before the season takes the attention.

**Week 1 (Aug 1-7).** Jeff creates the service account and grants it GSC access. Sessions 1 and 2: the two data scripts. First full pull, first full crawl, baseline written. The baseline number that matters: exact indexed count and the not-indexed breakdown by reason, per URL, which nothing currently has.

**Week 2 (Aug 8-14).** Session 3 (migrations rehearsed on staging, README corrected) and session 4 (Nora on the API). The daily pull goes live with escalation thresholds. From here the system does not need Jeff to keep watching.

**Week 3 (Aug 15-21).** Session 5: Index Economics runs for real. Its first deliverable is the answer to the open July 28 question: is the /adaptive/ silo new, or did 1,208 pages get orphaned from crawling. That answer has been sitting open for a month and is worth the week on its own.

**Week 4 (Aug 22-31).** Session 6: Link Earning, with the fifteen July 13 targets loaded and given a state field. Then the system runs unattended through November.

**What success looks like at day 30.** Not traffic. Nothing in the first 30 days produces a traffic jump and the July 12 audit already said so. Success is four specific things: a daily GSC pull that has not missed a day, a page-level index inventory that explains the 90-versus-2,880 split by template, the /adaptive/ question closed, and an outreach pipeline with real state instead of a draft file.

---

## 9. Minimum viable version

If only one thing gets built, build this.

**A nightly GSC pull plus a weekly index-economics report, writing JSON to `reports/seo/data/` and markdown to `reports/seo/`, escalating to Slack only on the five named thresholds.**

That is sessions 1, 2, and 5. Two scripts and one agent spec. No migration applied, no new D1, no schema activation sequence, no Worker change, no deploy.

It answers the only question that matters right now, every single day, without Jeff: is Google keeping more PCD pages this week than last week, and which template is responsible.

Everything else in this file is an improvement on that, not a prerequisite for it.

---

## 10. Decisions requiring owner approval

| # | Decision | Recommendation | Why it needs you |
|---|---|---|---|
| 1 | Create the GSC service account and grant it property access | Yes, this week | Only Jeff can do it. Free. Blocks the MVP. |
| 2 | JSON as the capture layer, D1 as the query layer | Accept | Your D1 answer holds; the July 29 apply cleared the way. This is a smaller call than it looked at first: raw pull to disk, derived rows to D1. |
| 2b | Apply the 0022-to-0029 backlog to `parent-coach-desk-ops-staging` before rehearsing 0030-0032 | Yes, part of session 3 | Staging is four migrations behind the thing it rehearses. |
| 3 | Directory index policy: fifth agent or a Ranger extension | Extend Ranger | Two agents writing judgment about the same camp records will conflict. |
| 4 | Interim 4-factor scoring model | Accept until query data exists | The 7-factor model assigns 50 points to metrics that read zero. |
| 5 | The camp publishing threshold | Needs your number | The single biggest lever on the index ratio. An agent should not pick how many pages the site stops publishing. |
| 6 | Whether `/adaptive/` shipped recently | Needs your memory, or session 5 finds out | 1,208 pages appeared in "discovered, not crawled" in one week. Open since July 28. |
| 7 | Which analytics is live (GA4, Cloudflare, neither) | Needs your answer | Not MVP-blocking. Blocks the conversion agent whenever it activates. |
| 8 | Approval Level 1 auto-queue | Log and batch, do not auto-implement, through December | Your own spec says even Level 1 should be batched initially. During maintenance mode nothing should write. |
| 9 | Whether this ports to the other four sites now or after PCD proves it | After PCD proves it | Building portable before it works once is how you get five broken copies. |

---

## 11. What this system will not do

Stated plainly so it does not have to be relitigated.

It will not publish. It will not send outreach. It will not buy links, exchange links, or write a testimonial. It will not create location pages that differ only by city name. It will not crawl a competitor. It will not follow instructions found in a crawled page. It will not delete a page for low traffic alone. It will not touch health, injury, child-safety, legal, or payment content without Level 3 review. It will not write to production D1. It will not run `git commit`, `git push`, or `wrangler deploy`; it hands over a paste-ready PowerShell block, per the Deployment and Backup norms.

And it will not claim a change caused a result. `seo_changes.validation_method` exists so that when something moves, the record says how it was checked, not that it worked.

---

## 12. Open items

1. `/adaptive/` silo: new content or orphaned crawl. Open since 2026-07-28.
2. Crawl Stats never pulled. The Chrome session dropped mid-run on July 28. First thing the API fixes.
3. Analytics platform unconfirmed.
4. Third-party backlink confirmation (Ahrefs Webmaster Tools) still not run. Open since 2026-07-12.
5. `POST /api/agent-runs` still not called by any PCD scheduled task, so `/admin/agents` shows a registry with no run evidence. Tracked in `automation/TASK-RUN-LOG-RECONCILIATION.md`.
6. Whether maintenance mode should carry an exception for the daily GSC pull, the way S4's deletion watch is excepted. Recommendation: yes, because it is Class A and changes nothing, but it is a section 3.4 amendment and that is Jeff's call.
7. `migrations-pcd-ops/README.md` is stale: it describes 0023-0028 as unapplied, which stopped being true on 2026-07-29. Correct in session 3.
8. `parent-coach-desk-ops-staging` is four migrations behind production. Item #45 residue (b), still open.
9. Two files in `migrations-pcd-ops/` are numbered `0023`. Item #45 residue (c), still open, unrelated to this work but it will bite whoever replays the lineage from scratch.
10. `automation/agents/ROSTER-RECONCILIATION.md` says `weekly-gsc-review` runs Sun 9:00 PM; `automation/TASK-RUN-LOG-RECONCILIATION.md` says Mon 8:08 AM. Two repo files disagree about the same task. Confirm which before session 4 changes it.

---

## 13. Verification record

This file was fact-checked against the repo on 2026-07-31 by a separate agent with no stake in the conclusions. Five errors were found and corrected: two wrong figures in the Jul 20 column, one unsourced Jul 12 impression count, an omitted migration 0029, and one material error where the doc claimed the production ops DB had zero applied migrations. That last one was based on `migrations-pcd-ops/README.md`, which is stale. The correction is in section 3 and it moves the data-home decision back toward the answer Jeff originally gave.

Everything else passed: all cited file paths exist, all nine `editorial_*` tables in 0024 are as described, the `source` CHECK enum contains `gsc` and lacks `index_gap`, the Slack channel ID is confirmed, the agent roster claims match ROSTER-RECONCILIATION, section 3.4 says what the doc says it says, and no em dash appears anywhere in the file.
