// POST /api/cron/camps-sweep
//
// Authenticated cron endpoint. Runs two quality jobs:
//   1. URL liveness sweep — re-checks up to N approved camps with a website,
//      starting with whichever was checked least recently (or never).
//   2. Stale-content archive — moves any approved camp whose end_date has
//      passed to 'rejected' with reason_code='past-date'.
//
// Auth: requires header `x-cron-key` matching the CRON_KEY env secret.
// The cron worker invokes this once a day. Manually triggerable via curl
// for ad-hoc sweeps.

import type { APIRoute } from 'astro';
import {
  listCampsForUrlSweep,
  updateUrlHealth,
  archiveStaleCamps,
  countApprovedFutureCamps,
} from '../../../lib/camps-db';
import { checkUrlHealth } from '../../../lib/url-health';
import { env as cfEnv } from 'cloudflare:workers';
import { deleteExpiredIdempotencyRecords } from '../../../lib/public-idempotency';
import { featureEnabled } from '../../../lib/feature-flags';
import { secretsMatch } from '../../../lib/secrets';
import { pcdMaintenanceModeActive } from '../../../lib/maintenance-mode';

export const prerender = false;

interface CronEnv {
  DB?: D1Database;
  CRON_KEY?: string;
  // Optional UptimeRobot heartbeat URL (Pillar 8 business-metric alert). When
  // set, this route pings it once a day only when approved_future_count is
  // healthy (> 0). A missed ping (site down, or the count fell to zero and
  // this route stopped pinging on purpose) fires the UptimeRobot alert with
  // no email plumbing on our end. Leave unset and the ping is skipped, no error.
  OPS_HEARTBEAT_URL?: string;
  IDEMPOTENCY_CLEANUP_ENABLED?: string;
  PCD_MAINTENANCE_MODE?: string;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });

export const POST: APIRoute = async ({ request }) => {
  const env = cfEnv as CronEnv | undefined;
  const headerKey = request.headers.get('x-cron-key') ?? '';
  if (!env?.CRON_KEY || !(await secretsMatch(headerKey, env.CRON_KEY))) {
    return json({ ok: false, error: 'forbidden' }, 403);
  }

  if (pcdMaintenanceModeActive(env.PCD_MAINTENANCE_MODE)) {
    return json({ ok: true, held: true, code: 'maintenance_mode', writes: 0 });
  }

  if (!env.DB) return json({ ok: false, error: 'database not available' }, 500);

  const today = new Date().toISOString().slice(0, 10);
  const oneWeekAgoIso = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  // 1. URL sweep — cap to 25 camps per run so the worker stays well under its
  //    sub-request budget and Nominatim-style external rate limits.
  let urlChecked = 0;
  let urlLive = 0;
  let urlDead = 0;
  let urlTimeout = 0;
  let urlRedirect = 0;
  const failures: string[] = [];
  try {
    const due = await listCampsForUrlSweep(env.DB, oneWeekAgoIso, 25);
    for (const c of due) {
      if (!c.website_url) continue;
      const result = await checkUrlHealth(c.website_url);
      await updateUrlHealth(env.DB, c.id, result.status, result.statusCode);
      urlChecked += 1;
      if (result.status === 'live') urlLive += 1;
      else if (result.status === 'dead') urlDead += 1;
      else if (result.status === 'timeout') urlTimeout += 1;
      else if (result.status === 'redirect') urlRedirect += 1;
    }
  } catch {
    failures.push('url_sweep_failed');
    console.error(JSON.stringify({ event: 'camps_sweep_stage_failed', code: 'url_sweep_failed' }));
  }

  // 2. Stale-archive — move past-date approved camps to rejected.
  let staleArchived = 0;
  let staleArchiveHasMore = false;
  try {
    const archive = await archiveStaleCamps(env.DB, today, 'cron', 25);
    staleArchived = archive.archived;
    staleArchiveHasMore = archive.hasMore;
    if (archive.hasMore) {
      console.warn(JSON.stringify({ event: 'camps_sweep_backlog', code: 'stale_archive_has_more', archived: archive.archived }));
    }
  } catch {
    failures.push('stale_archive_failed');
    console.error(JSON.stringify({ event: 'camps_sweep_stage_failed', code: 'stale_archive_failed' }));
  }

  // 3. Expired retry metadata cleanup. Default-off until migration 0015 and
  // its restore/release evidence are approved together. A configured cleanup
  // failure is a failed sweep stage; it never silently reports healthy.
  const idempotencyCleanupEnabled = featureEnabled(env.IDEMPOTENCY_CLEANUP_ENABLED);
  let idempotencyExpiredDeleted = 0;
  if (idempotencyCleanupEnabled) {
    try {
      idempotencyExpiredDeleted = await deleteExpiredIdempotencyRecords(env.DB, new Date().toISOString(), 100);
    } catch {
      failures.push('idempotency_cleanup_failed');
      console.error(JSON.stringify({ event: 'camps_sweep_stage_failed', code: 'idempotency_cleanup_failed' }));
    }
  }

  // 4. Blackout guard. If approved-and-future drops to 0, the camps sitemap
  // and /camps/ index go empty and GSC starts losing pages, silently, for as
  // long as nobody happens to look. This ran for two-plus weeks in June/July
  // 2026 before anyone caught it. Log loud so `npx wrangler tail` on
  // worker-cron (which hits this endpoint daily) shows it same-day.
  let approvedFutureCount: number | null = null;
  try {
    approvedFutureCount = await countApprovedFutureCamps(env.DB);
    if (approvedFutureCount === 0) {
      failures.push('directory_blackout');
      console.error(JSON.stringify({ event: 'camps_sweep_stage_failed', code: 'directory_blackout' }));
    } else if (failures.length === 0 && env.OPS_HEARTBEAT_URL) {
      // Business-metric alert (Pillar 8): ping the heartbeat monitor only when
      // the number is healthy. If this run fails, throws, or the count drops
      // to 0, the ping does not fire and the monitor's own missed-check alert
      // does the rest. Fire-and-forget: a heartbeat failure should never fail
      // the sweep itself.
      try {
        await fetch(env.OPS_HEARTBEAT_URL, { method: 'GET' });
      } catch {
        failures.push('heartbeat_failed');
        console.error(JSON.stringify({ event: 'camps_sweep_stage_failed', code: 'heartbeat_failed' }));
      }
    }
  } catch {
    failures.push('directory_probe_failed');
    console.error(JSON.stringify({ event: 'camps_sweep_stage_failed', code: 'directory_probe_failed' }));
  }

  return json({
    ok: failures.length === 0,
    ...(failures.length > 0 ? { code: 'partial_failure', failures } : {}),
    today,
    url_sweep: {
      checked: urlChecked,
      live: urlLive,
      dead: urlDead,
      timeout: urlTimeout,
      redirect: urlRedirect,
    },
    stale_archived: staleArchived,
    stale_archive_has_more: staleArchiveHasMore,
    idempotency_cleanup: {
      enabled: idempotencyCleanupEnabled,
      deleted: idempotencyExpiredDeleted,
      limit: 100,
    },
    approved_future_count: approvedFutureCount,
  }, failures.length === 0 ? 200 : 500);
};
