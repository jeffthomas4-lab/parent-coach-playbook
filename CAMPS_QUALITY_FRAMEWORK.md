# Camps quality framework

Operator manual for the camps repository quality layer. Three things stack:

1. Better submission. Smaller batches, mandatory confidence, an aggregator skip-list, and an optional pre-submit dedup probe.
2. Better moderation. Confidence and URL-health badges on every queue row, a fuzzy-duplicate warning, and a reject reason code so we can learn what is failing.
3. Automated post-validation. A daily worker re-checks live URLs and auto-archives camps whose end_date has passed.

## What lives where

Database (`migrations/0006_camp_quality_framework.sql`):

- `camps.confidence` — `high` / `medium` / `low`. Defaults to `medium`.
- `camps.source_domain` — bare hostname (no `www.`) the listing came from. Inferred from `website_url` if not provided.
- `camps.reject_reason_code` — set when an admin rejects. Enum of 10 values.
- `camps.url_health_status` — `unchecked` / `live` / `dead` / `timeout` / `redirect`.
- `camps.url_last_checked_at`, `camps.url_last_status_code` — sweep cache.
- `domain_quality` table — per-source counters: `submitted`, `approved`, `rejected`, `high_confidence`, `low_confidence`, `last_seen_at`.

Code (`src/lib/`):

- `camps-db.ts` — types (`ConfidenceLevel`, `RejectReasonCode`, `UrlHealthStatus`, `DomainQuality`), `findFuzzyCampMatches`, `updateUrlHealth`, `archiveStaleCamps`, `upsertDomainQuality`, `listDomainQuality`, `extractDomain`, `normalizeCampName`.
- `url-health.ts` — `checkUrlHealth(url)` — HEAD-then-GET with 6s timeout.

Endpoints (`src/pages/api/`):

- `POST /api/camps/check` — pre-submit fuzzy dedup probe. Returns matches and domain stats.
- `POST /api/camps/submit` — now writes `confidence` and `source_domain`, fires URL health check, bumps domain_quality.
- `POST /api/admin/camps/:id/reject` — accepts `reason_code`, bumps domain_quality `rejected`.
- `POST /api/admin/camps/:id/approve` — bumps domain_quality `approved`.
- `POST /api/cron/camps-sweep` — runs URL re-sweep + stale archive. Authenticated by `x-cron-key` header.

Admin UI (`src/pages/admin/`):

- `/admin/camps/queue` — shows confidence, source_domain, URL health badges and a fuzzy-duplicate warning per pending row. Reject button reveals a reason-code dropdown.
- `/admin/source-quality` — domain dashboard sorted by submission volume. Approval rate is the headline metric.

Cron worker (`worker-cron/src/index.ts`):

- Same daily 13:00 UTC trigger.
- Job 1: fires the Pages deploy hook (publishes any queued posts).
- Job 2: POSTs `/api/cron/camps-sweep` with `x-cron-key`. Uses secrets `CRON_KEY` and `SWEEP_URL`.

Import flow (`imports/claude-in-chrome-prompt.md`):

- Smaller batch (15-20 camps).
- Aggregator skip-list reinforced.
- Confidence column added to the CSV (now 24 columns).
- Optional `/api/camps/check` pre-submit probe.

## Day-to-day

### When a camp is submitted

1. `/api/camps/submit` validates the payload as before.
2. Inserts the camp with `confidence` (default `medium`) and `source_domain` (default = host of `website_url`).
3. Calls `checkUrlHealth(website_url)` and writes the result back to the row.
4. Calls `upsertDomainQuality(domain, 'submitted', confidence)`.
5. If the submitter is `trusted`, also bumps `'approved'` immediately.

### When you moderate the queue

1. Open `/admin/camps/queue`. Each pending row shows:
   - confidence badge (rust = low)
   - source domain
   - URL health (rust = dead/timeout)
   - any fuzzy duplicate warnings (matched by exact name + city, normalized name + city, same website host, or same address + city + zip)
2. Approve, approve+verify, or click Reject to reveal the reason picker. Pick one of: `duplicate`, `dead-url`, `unverifiable-address`, `missing-required-field`, `off-brand`, `past-date`, `aggregator-source`, `low-confidence`, `spam`, `other`. Optional notes.
3. The decision bumps the corresponding `domain_quality` counter.

### When you want to see the sources

`/admin/source-quality`. Sorted by submission volume, then ascending approval rate so the worst high-volume domains float to the top. Approval rate under 40% is colored rust — that domain is probably an aggregator or has stopped maintaining its listings. Add it to the import prompt's skip-list.

## The cron sweep

Daily at 13:00 UTC the worker fires `/api/cron/camps-sweep` with the `x-cron-key` header. The endpoint:

- Re-checks up to 25 approved camps' website URLs (oldest-checked first). Updates `url_health_status`.
- Auto-archives any approved camp where `end_date < today` (moves to `rejected` with `reason_code = 'past-date'`, reviewer = `cron`).

Caps:

- 25 URL checks per pass keeps the worker well under its sub-request budget. The full pool refills every week-ish.
- Stale archive is unbounded but cheap (one UPDATE per row).

## Configuring the cron secrets

Run from the worker directory once when first wiring up:

```powershell
cd "$HOME\Desktop\Claude Cowork\Outputs\parent-coach-playbook\worker-cron"
npm run secret:cron     # set CRON_KEY (any long random string)
npm run secret:sweep    # paste the full URL: https://parentcoachplaybook.com/api/cron/camps-sweep
npm run deploy
```

Then mirror the same `CRON_KEY` value as a Pages env var:

- Cloudflare dashboard → Pages → parent-coach-playbook → Settings → Environment variables.
- Add `CRON_KEY` (Production), value matches what you set in the worker.

If `CRON_KEY` or `SWEEP_URL` is missing on the worker side, the worker still fires the deploy hook and just logs `camps sweep skipped`. Nothing else breaks.

## Reading the data

A few SQL queries that are useful when triaging:

```sql
-- Worst-performing high-volume domains
SELECT domain, submitted_count, approved_count, rejected_count,
       ROUND(1.0 * approved_count / NULLIF(approved_count + rejected_count, 0), 2) AS approval_rate
FROM domain_quality
WHERE submitted_count >= 5
ORDER BY approval_rate ASC, submitted_count DESC;

-- Top reject reasons
SELECT reject_reason_code, COUNT(*) AS n
FROM camps
WHERE status = 'rejected' AND reject_reason_code IS NOT NULL
GROUP BY reject_reason_code
ORDER BY n DESC;

-- Approved camps with dead URLs (cleanup candidates)
SELECT id, name, source_domain, url_health_status, url_last_status_code
FROM camps
WHERE status = 'approved' AND url_health_status IN ('dead', 'timeout')
ORDER BY url_last_checked_at DESC;
```

Run those via:

```powershell
cd "$HOME\Desktop\Claude Cowork\Outputs\parent-coach-playbook"
npx wrangler d1 execute parent-coach-playbook --command "<SQL>" --remote
```

## What "good" looks like at the end of a quarter

- `domain_quality.approval_rate` median is above 70%.
- `confidence = 'low'` rows are under 15% of submitted volume.
- `url_health_status = 'dead'` is under 5% of approved camps at any moment.
- `reject_reason_code = 'duplicate'` is the largest reject bucket (catching dupes is the job).
- `aggregator-source` is small and steady — a sign the import skip-list is working.

If `dead-url` or `aggregator-source` start climbing, the import prompt needs to tighten up. The dashboard is the source of truth for that judgment.
