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
} from '../../../lib/camps-db';
import { checkUrlHealth } from '../../../lib/url-health';

export const prerender = false;

interface CronEnv {
  DB?: D1Database;
  CRON_KEY?: string;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env as CronEnv | undefined;
  if (!env?.DB) return json({ ok: false, error: 'database not available' }, 500);

  const headerKey = request.headers.get('x-cron-key') ?? '';
  if (!env.CRON_KEY || headerKey !== env.CRON_KEY) {
    return json({ ok: false, error: 'forbidden' }, 403);
  }

  const today = new Date().toISOString().slice(0, 10);
  const oneWeekAgoIso = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  // 1. URL sweep — cap to 25 camps per run so the worker stays well under its
  //    sub-request budget and Nominatim-style external rate limits.
  let urlChecked = 0;
  let urlLive = 0;
  let urlDead = 0;
  let urlTimeout = 0;
  let urlRedirect = 0;
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
  } catch (e) {
    console.error('[cron] url sweep failed', e);
  }

  // 2. Stale-archive — move past-date approved camps to rejected.
  let staleArchived = 0;
  try {
    staleArchived = await archiveStaleCamps(env.DB, today, 'cron');
  } catch (e) {
    console.error('[cron] stale archive failed', e);
  }

  return json({
    ok: true,
    today,
    url_sweep: {
      checked: urlChecked,
      live: urlLive,
      dead: urlDead,
      timeout: urlTimeout,
      redirect: urlRedirect,
    },
    stale_archived: staleArchived,
  });
};
