// Link-health worker. Runs daily on cron, validates a rolling subset of external links,
// writes results to the parent-coach-playbook D1 database, surfaces broken links via the
// /admin/link-health/ dashboard.
//
// Polite to external hosts: per-host throttling, real User-Agent, follows redirects,
// queries Wayback Machine for last-good archive, generates Google search query for the
// human to click when a replacement is needed.
//
// See LINKS.md at the project root for the operator manual.

export interface Env {
  DB: D1Database;
  MANIFEST_URL: string;
  LINKS_PER_RUN: string;
  ROTATION_DAYS: string;
  ADMIN_API_KEY?: string;
}

type ManifestEntry = { url: string; sources: string[] };
type Manifest = { generatedAt: string; count: number; links: ManifestEntry[] };

const USER_AGENT = 'Mozilla/5.0 (compatible; ParentCoachDeskLinkChecker/1.0; +https://parentcoachdesk.com/about/)';

// Hosts we throttle aggressively because they bot-detect.
const SLOW_HOSTS = new Set(['amazon.com', 'amzn.to', 'www.amazon.com', 'twitter.com', 'x.com', 'linkedin.com']);
const SLOW_HOST_DELAY_MS = 30_000;
const NORMAL_DELAY_MS = 1_000;

// --- D1 helpers ---

async function syncManifestToDb(env: Env, manifest: Manifest) {
  const now = new Date().toISOString();
  for (const entry of manifest.links) {
    await env.DB.prepare(
      `INSERT INTO link_health (url, source_files, first_seen)
       VALUES (?1, ?2, ?3)
       ON CONFLICT(url) DO UPDATE SET source_files = ?2`
    ).bind(entry.url, JSON.stringify(entry.sources), now).run();
  }
}

async function pickDueLinks(env: Env, n: number, rotationDays: number): Promise<string[]> {
  const cutoff = new Date(Date.now() - rotationDays * 24 * 60 * 60 * 1000).toISOString();
  // Priority order: broken first (re-confirm), then never-checked, then oldest-checked past cutoff.
  const result = await env.DB.prepare(
    `SELECT url FROM link_health
     WHERE is_broken = 1
        OR last_checked IS NULL
        OR last_checked < ?1
     ORDER BY is_broken DESC,
              last_checked IS NULL DESC,
              last_checked ASC
     LIMIT ?2`
  ).bind(cutoff, n).all();
  return (result.results as Array<{ url: string }>).map(r => r.url);
}

// --- Link check ---

async function checkLink(url: string): Promise<{
  statusCode: number | null;
  finalUrl: string;
  isBroken: boolean;
  isRedirect: boolean;
  redirectedOffHost: boolean;
  notes: string;
}> {
  const originalHost = (() => {
    try { return new URL(url).hostname; } catch { return ''; }
  })();

  let response: Response | null = null;
  let notes: string[] = [];

  // Try HEAD first; fall back to GET if HEAD is rejected.
  try {
    response = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      headers: { 'User-Agent': USER_AGENT, Accept: '*/*' },
    });
    if (response.status === 405 || response.status === 501) {
      // Server doesn't support HEAD; retry with GET.
      response = await fetch(url, {
        method: 'GET',
        redirect: 'follow',
        headers: { 'User-Agent': USER_AGENT, Accept: 'text/html,*/*' },
      });
      notes.push('HEAD not supported; checked via GET');
    }
  } catch (err) {
    notes.push(`fetch threw: ${(err as Error).message}`);
    return {
      statusCode: null,
      finalUrl: url,
      isBroken: true,
      isRedirect: false,
      redirectedOffHost: false,
      notes: notes.join(' | '),
    };
  }

  const statusCode = response.status;
  const finalUrl = response.url || url;
  const finalHost = (() => {
    try { return new URL(finalUrl).hostname; } catch { return ''; }
  })();

  const isRedirect = finalUrl !== url;
  const redirectedOffHost = isRedirect && originalHost !== finalHost;
  // 4xx = broken; 5xx = treat as transient (worker retries next cycle).
  const isBroken = statusCode >= 400 && statusCode < 500;

  if (redirectedOffHost) {
    notes.push(`redirected off-host: ${originalHost} → ${finalHost}`);
  }

  return { statusCode, finalUrl, isBroken, isRedirect, redirectedOffHost, notes: notes.join(' | ') };
}

// --- Wayback Machine lookup ---

async function lookupWayback(url: string): Promise<string | null> {
  try {
    const apiUrl = `https://archive.org/wayback/available?url=${encodeURIComponent(url)}`;
    const resp = await fetch(apiUrl, { headers: { 'User-Agent': USER_AGENT } });
    if (!resp.ok) return null;
    const data = await resp.json() as any;
    return data?.archived_snapshots?.closest?.url ?? null;
  } catch {
    return null;
  }
}

// --- Suggested search query (no API call; just a clickable link for the dashboard) ---

function buildSearchQuery(url: string): string {
  try {
    const u = new URL(url);
    const path = u.pathname.replace(/\//g, ' ').replace(/[-_]/g, ' ').trim();
    const query = `site:${u.hostname} ${path}`.trim();
    return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  } catch {
    return `https://www.google.com/search?q=${encodeURIComponent(url)}`;
  }
}

// --- Throttle ---

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function isSlowHost(url: string): boolean {
  try {
    const host = new URL(url).hostname;
    return [...SLOW_HOSTS].some(h => host === h || host.endsWith('.' + h));
  } catch {
    return false;
  }
}

// --- Main check loop ---

async function runChecks(env: Env): Promise<{ checked: number; broken: number; redirected: number }> {
  // 1. Pull manifest from the deployed site.
  const manifestRes = await fetch(env.MANIFEST_URL);
  if (!manifestRes.ok) {
    console.error(`Failed to fetch manifest at ${env.MANIFEST_URL}: ${manifestRes.status}`);
    return { checked: 0, broken: 0, redirected: 0 };
  }
  const manifest = await manifestRes.json() as Manifest;

  // 2. Sync manifest into D1 (upsert). New links get inserted; existing get source_files refreshed.
  await syncManifestToDb(env, manifest);

  // 3. Pick the next batch of due links.
  const n = parseInt(env.LINKS_PER_RUN || '50', 10);
  const rotationDays = parseInt(env.ROTATION_DAYS || '180', 10);
  const due = await pickDueLinks(env, n, rotationDays);

  let broken = 0, redirected = 0;

  // 4. Check each link, throttle per-host, store result.
  for (const url of due) {
    const result = await checkLink(url);

    let waybackSnapshot: string | null = null;
    let suggestedSearch: string | null = null;
    if (result.isBroken) {
      waybackSnapshot = await lookupWayback(url);
      suggestedSearch = buildSearchQuery(url);
      broken++;
    } else if (result.isRedirect) {
      redirected++;
    }

    const now = new Date().toISOString();
    await env.DB.prepare(
      `UPDATE link_health
       SET last_checked = ?1,
           last_status_code = ?2,
           final_url = ?3,
           is_broken = ?4,
           is_redirect = ?5,
           redirected_off_host = ?6,
           consecutive_failures = CASE WHEN ?4 = 1 THEN consecutive_failures + 1 ELSE 0 END,
           last_broken_at = CASE WHEN ?4 = 1 THEN ?1 ELSE last_broken_at END,
           last_ok_at = CASE WHEN ?4 = 0 THEN ?1 ELSE last_ok_at END,
           wayback_snapshot = ?7,
           suggested_search = ?8,
           notes = ?9
       WHERE url = ?10`
    ).bind(
      now,
      result.statusCode,
      result.finalUrl,
      result.isBroken ? 1 : 0,
      result.isRedirect ? 1 : 0,
      result.redirectedOffHost ? 1 : 0,
      waybackSnapshot,
      suggestedSearch,
      result.notes,
      url
    ).run();

    // Throttle. Slow hosts get the longer delay.
    await delay(isSlowHost(url) ? SLOW_HOST_DELAY_MS : NORMAL_DELAY_MS);
  }

  return { checked: due.length, broken, redirected };
}

// --- Worker entry points ---

export default {
  // Manual trigger for ad-hoc check. Open the worker URL with ?key=ADMIN_API_KEY.
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);
    const key = url.searchParams.get('key');
    if (!env.ADMIN_API_KEY || key !== env.ADMIN_API_KEY) {
      return new Response('Forbidden', { status: 403 });
    }
    const result = await runChecks(env);
    return new Response(JSON.stringify({ ok: true, ...result }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  },

  async scheduled(_event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil(runChecks(env).then(r => {
      console.log(`[link-checker] checked=${r.checked} broken=${r.broken} redirected=${r.redirected}`);
    }));
  },
};
