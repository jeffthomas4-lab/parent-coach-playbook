import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import type { D1Database } from '@cloudflare/workers-types';
import { createDisposableIntelDatabase } from './helpers/disposable-intel-db';
import { runApprovedRun, runOrgSweep } from '../src/lib/intel/pipeline';
import { approveRun, createRun } from '../src/lib/intel/store';

const ENV_BASE = {
  INTEL_SWEEP_ENABLED: 'true',
  INTEL_USER_AGENT: 'ParentCoachDeskIntelBot/1.0',
  INTEL_OPERATOR_CONTACT: 'https://parentcoachdesk.com/about/',
};

async function insertOrg(db: D1Database, id: string, url: string): Promise<void> {
  const now = '2026-01-01T00:00:00.000Z';
  await db
    .prepare(`INSERT INTO organizations (id, slug, name, website_url, record_status, created_at, updated_at) VALUES (?, ?, ?, ?, 'active', ?, ?)`)
    .bind(id, id, `Org ${id}`, url, now, now)
    .run();
}

function htmlResponse(body: string): Response {
  return new Response(body, { status: 200, headers: { 'content-type': 'text/html' } });
}

describe('runOrgSweep', () => {
  let db: D1Database;
  const originalFetch = global.fetch;

  beforeEach(async () => {
    ({ db } = await createDisposableIntelDatabase());
    vi.restoreAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('returns null when INTEL_SWEEP_ENABLED is unset, and touches nothing', async () => {
    const fetchMock = vi.fn();
    global.fetch = fetchMock as unknown as typeof fetch;
    const result = await runOrgSweep({ DB: db, INTEL_USER_AGENT: 'bot', INTEL_OPERATOR_CONTACT: 'https://example.com/' });
    expect(result).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
    const runs = await db.prepare(`SELECT COUNT(*) AS n FROM intel_runs`).first<{ n: number }>();
    expect(runs!.n).toBe(0);
  });

  it('returns null when INTEL_SWEEP_ENABLED is any value other than the string "true"', async () => {
    const result = await runOrgSweep({ DB: db, ...ENV_BASE, INTEL_SWEEP_ENABLED: 'yes' });
    expect(result).toBeNull();
  });

  it('returns null and creates no run when the crawl policy is incomplete', async () => {
    const result = await runOrgSweep({ DB: db, INTEL_SWEEP_ENABLED: 'true' });
    expect(result).toBeNull();
    const runs = await db.prepare(`SELECT COUNT(*) AS n FROM intel_runs`).first<{ n: number }>();
    expect(runs!.n).toBe(0);
  });

  it('crawls claimed org targets, records detections, and marks the run complete', async () => {
    await insertOrg(db, 'org-1', 'https://prospect-a.example.org/');
    await insertOrg(db, 'org-2', 'https://prospect-b.example.org/');

    const fetchMock = vi.fn().mockImplementation(async (url: string) => {
      if (url.includes('robots.txt')) return new Response('', { status: 404 });
      if (url.includes('prospect-a')) return htmlResponse('<html><a href="https://app.sportsgravy.com/portal">Register</a></html>');
      return htmlResponse('<html>nothing interesting here</html>');
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    const result = await runOrgSweep({ DB: db, ...ENV_BASE }, { limit: 10 });
    expect(result).not.toBeNull();
    expect(result!.planned).toBe(2);
    expect(result!.fetched).toBe(2);
    expect(result!.errors).toBe(0);

    const run = await db.prepare(`SELECT * FROM intel_runs WHERE id = ?`).bind(result!.runId).first<any>();
    expect(run.status).toBe('complete');
    expect(run.targets_fetched).toBe(2);

    const competitors = await db.prepare(`SELECT COUNT(*) AS n FROM competitors`).first<{ n: number }>();
    expect(competitors!.n).toBeGreaterThan(0);
  });

  it('never fetches a competitor-owned domain even if it were somehow claimed as a target', async () => {
    await insertOrg(db, 'org-comp', 'https://sportsgravy.com/');
    const fetchMock = vi.fn().mockImplementation(async (url: string) => {
      if (url.includes('robots.txt')) return new Response('', { status: 404 });
      throw new Error(`should never fetch competitor content: ${url}`);
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    const result = await runOrgSweep({ DB: db, ...ENV_BASE }, { limit: 10 });
    expect(result!.fetched).toBe(0);
    expect(result!.skipped).toBe(1);
  });

  it('counts a per-target failure without failing the whole run', async () => {
    await insertOrg(db, 'org-good', 'https://good.example.org/');
    await insertOrg(db, 'org-bad', 'https://bad.example.org/');

    const fetchMock = vi.fn().mockImplementation(async (url: string) => {
      if (url.includes('robots.txt')) return new Response('', { status: 404 });
      if (url.includes('bad.example.org')) throw new Error('boom');
      return htmlResponse('<html>fine</html>');
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    const result = await runOrgSweep({ DB: db, ...ENV_BASE }, { limit: 10 });
    // fetchPublicPage itself never throws (network errors become
    // skippedReason: 'error'), so the per-target catch in the pipeline is a
    // defense-in-depth backstop; either way the run completes and both
    // targets are accounted for.
    expect(result!.fetched + result!.skipped + result!.errors).toBe(2);
    const run = await db.prepare(`SELECT status FROM intel_runs WHERE id = ?`).bind(result!.runId).first<any>();
    expect(run.status).toBe('complete');
  });
});

describe('runApprovedRun', () => {
  let db: D1Database;
  const originalFetch = global.fetch;

  beforeEach(async () => {
    ({ db } = await createDisposableIntelDatabase());
    vi.restoreAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('returns null for a run that is not approved', async () => {
    const run = await createRun(db, { runType: 'manual' });
    const result = await runApprovedRun({ DB: db, ...ENV_BASE }, run.id);
    expect(result).toBeNull();
  });

  it('returns null for an unknown run id', async () => {
    const result = await runApprovedRun({ DB: db, ...ENV_BASE }, 'does-not-exist');
    expect(result).toBeNull();
  });

  it('runs an approved run and marks it complete', async () => {
    await insertOrg(db, 'org-1', 'https://prospect-c.example.org/');
    const fetchMock = vi.fn().mockImplementation(async (url: string) => {
      if (url.includes('robots.txt')) return new Response('', { status: 404 });
      return htmlResponse('<html>ok</html>');
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    const run = await createRun(db, { runType: 'manual' });
    await approveRun(db, run.id, 'jeff@parentcoachdesk.com');

    const result = await runApprovedRun({ DB: db, ...ENV_BASE }, run.id);
    expect(result).not.toBeNull();
    const after = await db.prepare(`SELECT status FROM intel_runs WHERE id = ?`).bind(run.id).first<any>();
    expect(after.status).toBe('complete');
  });
});
