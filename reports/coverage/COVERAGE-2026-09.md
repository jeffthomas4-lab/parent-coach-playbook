# PCD Coverage Report, September 2026

Prepared by Cal. Force-run on 2026-09-17 (Jeff P3 monthly). Compared against the August 2026 baseline in `reports/coverage/COVERAGE-2026-08.md`. Prose-first; tables for matrices.

## Method note on this run

Ran on the Linux box mirror at `/workspace/pcd-repo` (no Windows `machineId` on this executor). Content inventory, editorial pipeline, freshness, season matrices, and crew health come from the content tree plus git log on that checkout. The checkout is `main` behind `origin/main` by 7 commits and already carries unrelated staged work, so this report is written to disk for the parent to copy onto Windows and commit; no commit or push from this session.

**Camps / D1 gap.** `wrangler` is not usable on the box (Node 20 vs wrangler needing Node >=22; no Wrangler OAuth / API token). Cloudflare D1 MCP is not in this session's tool list. Full `pcd_status` / pending / expired-live counts therefore cannot be refreshed from D1. Substitutes used: last successful camps review (`reports/camps/CAMPS_REVIEW_2026-09-03.md`), the blocked 09-10 review, today's public probes (`/api/camps/lite`, `/camps/`, `sitemap-camps.xml`), and today's sweep/blackout diagnosis notes. `agent_runs` is likewise unreachable; crew health uses git subjects and report files only.

## 1. Content inventory

1,928 files across 14 collections in `src/content/` (was 1,865 in August; **+63**).

| Collection | Aug 2026 | Sep 2026 | Delta |
|---|---:|---:|---:|
| articles | 815 | 872 | +57 |
| coachingTips | 577 | 577 | 0 |
| body | 177 | 177 | 0 |
| scripts | 53 | 53 | 0 |
| recruiting | 29 | 29 | 0 |
| guides | 37 | 37 | 0 |
| pathways | 26 | 26 | 0 |
| decisions | 26 | 26 | 0 |
| seasonCalendars | 28 | 28 | 0 |
| news | 22 | 28 | +6 |
| rules | 22 | 22 | 0 |
| resources | 18 | 18 | 0 |
| adaptive | 18 | 18 | 0 |
| pillar | 17 | 17 | 0 |

Growth this month is almost entirely articles (+57) and news (+6). Coaching tips and the rest of the corpus are flat versus August.

**Posts by sport against `SPORT_ENUM` in `src/content.config.ts`.** The enum currently lists **34** values (August brief said 33; this checkout includes `lacrosse-boys` / `lacrosse-girls` alongside `lacrosse`). Counts include both singular `sport:` and `sportTags:` across all collections.

| Sport | Tagged files |
|---|---:|
| baseball | 178 |
| soccer | 152 |
| basketball | 112 |
| football | 96 |
| softball | 91 |
| volleyball | 69 |
| lacrosse-girls | 65 |
| hockey | 64 |
| lacrosse-boys | 59 |
| swimming | 48 |
| track-field | 44 |
| cross-country | 32 |
| tennis | 30 |
| flag-football | 28 |
| cheer | 26 |
| gymnastics | 24 |
| band | 22 |
| golf | 20 |
| dance | 20 |
| theater | 19 |
| crew | 18 |
| choir | 18 |
| ballet | 18 |
| martial-arts | 17 |
| stunt | 17 |
| lacrosse | 15 |
| football-7v7 | 11 |
| wrestling | 10 |
| field-hockey | 2 |
| rugby | 0 |
| pickleball | 0 |
| multi-sport | 690 |
| multi-activity | 0 |
| performing-arts | 0 |

Thinnest five real sports (excluding catch-alls): **rugby (0), pickleball (0), field-hockey (2), wrestling (10), football-7v7 (11)**. Same thinnest pair as August; field-hockey still near-empty. Catch-alls `multi-activity` and `performing-arts` remain at zero while `multi-sport` absorbs 690 tags.

**Season coverage.** Fall is in season now; winter tryout/registration windows open inside the next two months (Sep 17 to Nov 17).

Fall matrix:

| Sport | Season file | Sport-tagged files | Tryout content | Registration content | Equipment content |
|---|---|---:|---:|---:|---:|
| Cross country | hs-cross-country-fall | 32 | 4 | 0 | 17 |
| Football | hs-football-fall-pnw | 96 | 4 | 7 | 80 |
| Soccer | hs-soccer-fall | 152 | 9 | 10 | 123 |
| Marching band | hs-marching-band-fall | 22 | 2 | 1 | 12 |
| Flag football (rec) | rec-flag-football-fall | 28 | 1 | 1 | 27 |

Winter-approaching matrix:

| Sport | Season file | Sport-tagged files | Tryout content | Registration content | Equipment content |
|---|---|---:|---:|---:|---:|
| Basketball | hs-basketball-winter-boys | 112 | 11 | 7 | 94 |
| Hockey | youth-travel-hockey-winter | 64 | 10 | 5 | 55 |
| Swimming | year-round-club-swimming | 48 | 3 | 5 | 31 |
| Wrestling | (none) | 10 | 0 | 1 | 8 |

Gaps to name: **cross country still has zero registration articles** (same gap as August). Flag football registration moved from 0 to 1 (thin but no longer empty). Wrestling has no season calendar file and almost no tryout/registration copy ahead of winter. Football tryout coverage is still thin relative to corpus size (4 tryout-tagged pieces against 96 football files).

## 2. Editorial pipeline

`editorial.status` distribution across 1,761 files that carry the field (was 1,695 in August):

| Status | Aug 2026 | Sep 2026 | Delta |
|---|---:|---:|---:|
| claude-reviewed | 1,616 | 1,626 | +10 |
| published | 51 | 109 | +58 |
| ready-for-jeff | 20 | 20 | 0 |
| jeff-approved | 2 | 4 | +2 |
| needs-revision | 5 | 1 | -4 |
| draft | 1 | 1 | 0 |

Published roughly doubled month over month (+58), which is the clearest pipeline win since the August baseline. The Jeff queue is unchanged at **20** `ready-for-jeff` items:

- articles: `anxious-athlete-how-coaches-can-help`, `when-to-call-a-sport-psychologist`, `dance-when-she-is-bigger-than-other-girls`
- body: `pole-vault-helmet-debate`, `tiktok-privacy-settings`, `team-manager-parent-conduct`, `banned-substances-hs-college`, `pollen-allergic-conjunctivitis`, `drowning-rescue-and-monitoring`, `mental-health-crisis-conversation`, `off-season-conditioning-safety`, `youth-cross-country-safety-briefing`, `water-polo-specific-safety`
- recruiting: hockey, lacrosse, basketball, baseball, volleyball, soccer, softball

Separately, boolean `draft: true` is set on **4** files (was 8). All four were touched on 2026-09-16 (filesystem mtime); none are stale past 14 days. Three of those four also sit in `ready-for-jeff` (anxious-athlete, sport-psychologist, dance body-image), consistent with recent Jeff risk review / unpublish commits on 2026-09-16.

## 3. Freshness

109 published posts (was 51). **108 of 109 (99%)** have an `updatedAt` / `claudeReviewedAt` / `publishedAt` / `date` within the last 90 days (was 94%). The one older published post: `articles/first-overnight-camp-packing-list.md` (newest stamp 2026-05-07).

57 of 109 published posts carry a `factCheckGoodThrough` date. **None are currently expired** (same as August). 52 published posts still lack a fact-check horizon.

Trend vs August baseline: freshness rate up (94% → 99%), expired fact-checks still 0, published corpus more than doubled.

## 4. Camps directory

**D1 not queried this run** (see method note). Last successful D1 snapshot is 2026-09-03:

- `pcd_status`: 1,972 approved / 119 pending / 857 rejected (total 2,948)
- Approved-but-expired (`session_end_date` in the past): **1,295** (65.7% of approved)
- Pending queue recommendations from 09-03 still open as of the blocked 09-10 review: approve ~76, hold 40 ussportscamps dups, reject 3 Camp STAR
- Named-contact bright spot on 09-03: missing-both-channels defect 98.6% → 85.2% after +37 contacts
- 2026-09-10 weekly review: **BLOCKED** (D1 MCP absent); no WoW comparison that week
- 2026-09-17 P1 triage apply on this box: **NOT APPLIED** (no Windows machine routing, no wrangler OAuth)

**Public directory probes today (2026-09-17 afternoon PT):**

| Probe | Result |
|---|---|
| `GET /api/camps/lite?limit=500` | 200; **118** camps |
| `GET /camps/` SSR | **115 camps listed** (leagues hidden by default) |
| `GET /sitemap-camps.xml` | 200; **118** `<loc>` |

State mix on the live lite payload (top): MN 32, WA 27, WI 15, OR 12, ID 7, MT 6. Sport/category mix led by volleyball (52), soccer (21), camp_sports (13), baseball (11).

Morning blackout diagnosis on this same day had reported ~20 live approved-future listings and a failed daily sweep (`result_code=sweep_failed`). Afternoon public counts are materially higher (~115–118). Treat that as: (a) possible recovery or filter difference since morning, and (b) still **not** a substitute for D1 `pcd_status` / expired-live / pending. Full directory health remains a D1 gap until wrangler OAuth runs on Windows machineId `144864c6-daca-470e-8aa3-74cbb5f57453`.

Category month-over-month from D1 is still unavailable without a remote query.

## 5. Crew health trend

Only **15 commits** on this checkout since 2026-08-17 (idle-window month; August baseline had 384 in 31 days). Named-agent signal from commit subjects and report files:

| Agent | Lane | Last seen | Count this window | Read |
|---|---|---|---:|---|
| Ed | Drafting | 2026-09-16 | 1+ (draft commit + queue) | Active, low volume |
| Penny | Editorial gate | 2026-09-16 | 2 (publish + schedule) | Active |
| Flo | Freshness refresh | no Aug/Sep commit hit | 0 | Quiet; last dedicated freshness audit is Q3 file on disk |
| Sasha | Social drafts | last report 2026-08-07 | 0 this window | Silent >2 weeks |
| Discovery | Org site discovery | no recent commit | 0 | Silent |
| rules-watch | Rules monitoring | report `RULES_2026-09-01.md` | 1 report file | Weekly-ish; due again mid-Sep |
| Lonnie | Outreach / GSC | 2026-09-16 | 2 | Active |
| Dana | Hold-state / deploy gate | 2026-09-16 | 1 | Active |
| Cal | Coverage | 2026-09-17 (this report) | 1 | Force-run monthly |

Idle-period design (report-only Aug–Nov per `PCD-AI-OS/08-roadmaps.md`) explains the commit cliff versus August. Editorial lane (Ed/Penny) is still alive. **Sasha and Discovery look silent** past the two-week watch threshold. Flo has no freshness commit in this window. Backup still has no `Backup:` commit prefix; mechanism remains cron/export rather than a committing agent, and Phase 0 proving clock was already blocked on D1 export limits in August.

`agent_runs` still unreachable (same D1 gap), so daily run counts cannot be verified directly.

## 6. Flags

- **Jeff approval bottleneck unchanged:** 20 `ready-for-jeff` (flat vs August). Three sensitive pieces also carry `draft: true` after 2026-09-16 risk review.
- **Thin sports unchanged:** rugby, pickleball, field-hockey still empty or near-empty.
- **Cross country registration gap** still open (0 registration articles while season is live).
- **Wrestling winter prep gap:** no season calendar; tryout content 0.
- **Camps D1 monitoring broken for two straight weekly reviews** (09-10 blocked; 09-17 force coverage also blocked on wrangler). Last known pending 119 and expired-live 1,295 are two weeks stale. Public directory shows ~115–118 live today, but pending triage and expired bulk-unpublish recommendations from 09-03 are unconfirmed as applied.
- **Camps sweep:** morning 2026-09-17 diagnosis recorded `sweep_failed` on the daily cron; root cause (CRON_KEY mismatch vs site-stage 500) still needs Jeff CLI confirmation on Windows.
- **Silent agents:** Sasha (social) and Discovery past two weeks; Flo freshness quiet this window.
- **Git commit of this report:** not done here. Box repo is behind origin by 7 and already has unrelated staged affiliate/content changes. Parent should `CopyFromBox` this file onto Windows and commit alone.

Success criteria for this force-run: report written on box, Slack summary drafted/posted, bottlenecks and silent agents named, D1/camps gap explicit. No push, no deploy.

## Parent / Windows follow-ups

If parent needs D1 numbers refreshed on machineId `144864c6-daca-470e-8aa3-74cbb5f57453`:

```powershell
cd "C:\Users\jeffthomas\Desktop\Claude Cowork\Outputs\Field and Forge\parent-coach-desk"
# after wrangler whoami shows authenticated:
npx wrangler d1 execute activity-radar --remote --command "SELECT pcd_status, COUNT(*) AS n FROM programs GROUP BY pcd_status"
npx wrangler d1 execute activity-radar --remote --command "SELECT COUNT(*) AS expired_live FROM programs WHERE pcd_status='approved' AND session_end_date < date('now')"
```

Copy this report into the Windows tree:

```powershell
# parent CopyFromBox -> then:
New-Item -ItemType Directory -Force -Path "reports\coverage" | Out-Null
# place COVERAGE-2026-09.md at reports\coverage\COVERAGE-2026-09.md
git add reports/coverage/COVERAGE-2026-09.md
git commit -m "Cal: monthly coverage report 2026-09 (P3 force-run)"
# do not push unless Jeff asks
```

## Camps directory update (post P1, same day)

After this report draft, Jeff-approved P1 triage stamped evergreen window 2026-09-16 to 2027-08-31 on 98 pending rows, approved them, rejected 3 Camp STAR, and held 40 ussportscamps dup-org rows. Live directory (approved + session_end_date >= today) moved **20 to 118**. Sitemap-camps locs = 118. Pending left = 40. Reviewed_by `pcd-p1-evergreen-2026-09-17`.
