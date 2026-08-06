import { describe, expect, it, beforeEach } from 'vitest';
import type { D1Database } from '@cloudflare/workers-types';
import { createDisposableIntelDatabase } from './helpers/disposable-intel-db';
import {
  approveRun,
  claimSweepTargets,
  createRun,
  getIntelSummary,
  getRun,
  listOpportunities,
  listReviewQueue,
  listRuns,
  listStack,
  markRunStatus,
  recordDetection,
  resolveReviewItem,
  syncCompetitorCatalog,
} from '../src/lib/intel/store';
import type { CompetitorDefinition, DetectionResult } from '../src/lib/intel/fingerprints';

const TEST_COMPETITOR: CompetitorDefinition = {
  id: 'sportsgravy',
  displayName: 'SportsGravy',
  canonicalDomain: 'sportsgravy.com',
  category: 'club_management',
  migrationDifficulty: 'high',
  patterns: [{ id: 'sportsgravy.test.pattern', type: 'html_text', category: 'club_management', match: { kind: 'substring', value: 'sportsgravy' }, weight: 80 }],
};

const OTHER_COMPETITOR: CompetitorDefinition = {
  id: 'teamsnap',
  displayName: 'TeamSnap',
  canonicalDomain: 'teamsnap.com',
  category: 'club_management',
  migrationDifficulty: 'medium',
  patterns: [{ id: 'teamsnap.test.pattern', type: 'html_text', category: 'club_management', match: { kind: 'substring', value: 'teamsnap' }, weight: 80 }],
};

async function insertOrg(db: D1Database, id: string, overrides: Partial<{ website_url: string | null; record_status: string; deleted_at: string | null }> = {}): Promise<void> {
  const now = '2026-01-01T00:00:00.000Z';
  await db
    .prepare(
      `INSERT INTO organizations (id, slug, name, website_url, record_status, deleted_at, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(id, id, `Org ${id}`, overrides.website_url ?? `https://${id}.example.org/`, overrides.record_status ?? 'active', overrides.deleted_at ?? null, now, now)
    .run();
}

function makeResult(overrides: Partial<DetectionResult> = {}): DetectionResult {
  return {
    competitorId: 'sportsgravy',
    category: 'club_management',
    confidence: 75,
    suppressedBy: [],
    signals: [
      {
        competitorId: 'sportsgravy',
        patternId: 'sportsgravy.test.pattern',
        type: 'html_text',
        category: 'club_management',
        weight: 80,
        matchedValue: 'sportsgravy',
        sourceUrl: 'https://org-1.example.org/',
      },
    ],
    ...overrides,
  };
}

describe('intel store', () => {
  let db: D1Database;

  beforeEach(async () => {
    const disposable = await createDisposableIntelDatabase();
    db = disposable.db;
    await syncCompetitorCatalog(db, [TEST_COMPETITOR, OTHER_COMPETITOR]);
  });

  describe('recordDetection', () => {
    it('at 75 confidence writes a stack row and a first_detected history row', async () => {
      await insertOrg(db, 'org-1');
      const recorded = await recordDetection(db, {
        runId: 'run-1',
        orgId: 'org-1',
        domain: 'org-1.example.org',
        sourceUrl: 'https://org-1.example.org/',
        results: [makeResult({ confidence: 75 })],
      });
      expect(recorded).toEqual({ signalsWritten: 1, stackChanges: 1, queuedForReview: 0 });

      const stack = await db.prepare(`SELECT * FROM org_tech_stack WHERE org_id = ?`).bind('org-1').first<any>();
      expect(stack).toBeTruthy();
      expect(stack.competitor_id).toBe('sportsgravy');
      expect(stack.confidence).toBe(75);
      expect(stack.status).toBe('detected');

      const history = await db.prepare(`SELECT * FROM org_tech_history WHERE org_id = ?`).bind('org-1').all<any>();
      expect(history.results).toHaveLength(1);
      expect(history.results![0].change_type).toBe('first_detected');
      expect(history.results![0].to_confidence).toBe(75);

      const queue = await db.prepare(`SELECT COUNT(*) AS n FROM intel_review_queue`).first<{ n: number }>();
      expect(queue!.n).toBe(0);
    });

    it('at 40 confidence writes a review queue row and no stack row', async () => {
      await insertOrg(db, 'org-2');
      const recorded = await recordDetection(db, {
        runId: 'run-2',
        orgId: 'org-2',
        domain: 'org-2.example.org',
        sourceUrl: 'https://org-2.example.org/',
        results: [makeResult({ confidence: 40 })],
      });
      expect(recorded.stackChanges).toBe(0);
      expect(recorded.queuedForReview).toBe(1);

      const stack = await db.prepare(`SELECT * FROM org_tech_stack WHERE org_id = ?`).bind('org-2').first();
      expect(stack).toBeNull();

      const queueRows = await listReviewQueue(db, {});
      expect(queueRows).toHaveLength(1);
      expect(queueRows[0]!.reason).toBe('low_confidence');
      expect(queueRows[0]!.confidence).toBe(40);
    });

    it('at 10 confidence writes signals only', async () => {
      await insertOrg(db, 'org-3');
      const recorded = await recordDetection(db, {
        runId: 'run-3',
        orgId: 'org-3',
        domain: 'org-3.example.org',
        sourceUrl: 'https://org-3.example.org/',
        results: [makeResult({ confidence: 10 })],
      });
      expect(recorded).toEqual({ signalsWritten: 1, stackChanges: 0, queuedForReview: 0 });

      const stack = await db.prepare(`SELECT * FROM org_tech_stack WHERE org_id = ?`).bind('org-3').first();
      expect(stack).toBeNull();
      const queue = await db.prepare(`SELECT COUNT(*) AS n FROM intel_review_queue`).first<{ n: number }>();
      expect(queue!.n).toBe(0);
      const signals = await db.prepare(`SELECT COUNT(*) AS n FROM org_tech_signals`).first<{ n: number }>();
      expect(signals!.n).toBe(1);
    });

    it('never overwrites a human-confirmed stack row with a later lower-confidence sweep', async () => {
      await insertOrg(db, 'org-4');
      await recordDetection(db, {
        runId: 'run-a',
        orgId: 'org-4',
        domain: 'org-4.example.org',
        sourceUrl: 'https://org-4.example.org/',
        results: [makeResult({ confidence: 90 })],
      });
      await db.prepare(`UPDATE org_tech_stack SET status = 'confirmed', reviewed_by = ?, reviewed_at = ? WHERE org_id = ?`).bind('jeff@parentcoachdesk.com', '2026-01-02T00:00:00.000Z', 'org-4').run();

      const before = await db.prepare(`SELECT * FROM org_tech_stack WHERE org_id = ?`).bind('org-4').first<any>();
      expect(before.status).toBe('confirmed');
      expect(before.confidence).toBe(90);

      const recorded = await recordDetection(db, {
        runId: 'run-b',
        orgId: 'org-4',
        domain: 'org-4.example.org',
        sourceUrl: 'https://org-4.example.org/',
        results: [makeResult({ confidence: 30 })],
      });
      // Below AUTO_ACCEPT_CONFIDENCE (60) with a null-org fallback never applies here since org exists;
      // 30 is in the review band, so this exercises the review path, not the stack path directly.
      expect(recorded.stackChanges).toBe(0);

      const after = await db.prepare(`SELECT * FROM org_tech_stack WHERE org_id = ?`).bind('org-4').first<any>();
      expect(after.status).toBe('confirmed');
      expect(after.confidence).toBe(90);
      expect(after.competitor_id).toBe('sportsgravy');
    });

    it('never downgrades a confirmed row even when a later sweep sees it at auto-accept confidence for a different competitor', async () => {
      await insertOrg(db, 'org-5');
      await recordDetection(db, {
        runId: 'run-a',
        orgId: 'org-5',
        domain: 'org-5.example.org',
        sourceUrl: 'https://org-5.example.org/',
        results: [makeResult({ confidence: 90 })],
      });
      await db.prepare(`UPDATE org_tech_stack SET status = 'confirmed' WHERE org_id = ?`).bind('org-5').run();

      const recorded = await recordDetection(db, {
        runId: 'run-b',
        orgId: 'org-5',
        domain: 'org-5.example.org',
        sourceUrl: 'https://org-5.example.org/',
        results: [makeResult({ confidence: 65, competitorId: 'teamsnap', signals: [{ competitorId: 'teamsnap', patternId: 'teamsnap.test.pattern', type: 'html_text', category: 'club_management', weight: 80, matchedValue: 'teamsnap', sourceUrl: 'https://org-5.example.org/' }] })],
      });
      expect(recorded.stackChanges).toBe(0);

      const after = await db.prepare(`SELECT * FROM org_tech_stack WHERE org_id = ?`).bind('org-5').first<any>();
      expect(after.status).toBe('confirmed');
      expect(after.competitor_id).toBe('sportsgravy');

      // The sweep's differing observation is still logged for the record.
      const history = await db.prepare(`SELECT * FROM org_tech_history WHERE org_id = ? ORDER BY id DESC LIMIT 1`).bind('org-5').first<any>();
      expect(history.change_type).toBe('switched');
      expect(history.to_competitor_id).toBe('teamsnap');
    });

    it('does not create duplicate pending review rows for the same org/competitor/category', async () => {
      await insertOrg(db, 'org-6');
      await recordDetection(db, {
        runId: 'run-a',
        orgId: 'org-6',
        domain: 'org-6.example.org',
        sourceUrl: 'https://org-6.example.org/',
        results: [makeResult({ confidence: 40 })],
      });
      const second = await recordDetection(db, {
        runId: 'run-b',
        orgId: 'org-6',
        domain: 'org-6.example.org',
        sourceUrl: 'https://org-6.example.org/',
        results: [makeResult({ confidence: 45 })],
      });
      expect(second.queuedForReview).toBe(0);

      const queue = await db.prepare(`SELECT COUNT(*) AS n FROM intel_review_queue WHERE status = 'pending'`).first<{ n: number }>();
      expect(queue!.n).toBe(1);
    });

    it('is idempotent: replaying the same run_id and domain writes nothing twice', async () => {
      await insertOrg(db, 'org-7');
      const input = {
        runId: 'run-replay',
        orgId: 'org-7',
        domain: 'org-7.example.org',
        sourceUrl: 'https://org-7.example.org/',
        results: [makeResult({ confidence: 75 })],
      };
      const first = await recordDetection(db, input);
      expect(first.signalsWritten).toBe(1);
      expect(first.stackChanges).toBe(1);

      const replay = await recordDetection(db, input);
      expect(replay).toEqual({ signalsWritten: 0, stackChanges: 0, queuedForReview: 0 });

      const signalCount = await db.prepare(`SELECT COUNT(*) AS n FROM org_tech_signals`).first<{ n: number }>();
      expect(signalCount!.n).toBe(1);
      const stack = await db.prepare(`SELECT evidence_count FROM org_tech_stack WHERE org_id = ?`).bind('org-7').first<any>();
      expect(stack.evidence_count).toBe(1);
    });

    it('routes a null-org detection to the review queue with reason org_unmatched, even at high confidence', async () => {
      const recorded = await recordDetection(db, {
        runId: 'run-unmatched',
        orgId: null,
        domain: 'unknown-org.example.org',
        sourceUrl: 'https://unknown-org.example.org/',
        results: [makeResult({ confidence: 95 })],
      });
      expect(recorded.stackChanges).toBe(0);
      expect(recorded.queuedForReview).toBe(1);
      const rows = await listReviewQueue(db, {});
      expect(rows[0]!.reason).toBe('org_unmatched');
      expect(rows[0]!.org_id).toBeNull();
    });
  });

  describe('claimSweepTargets', () => {
    it('prefers never-scanned domains, then the domain fetched longest ago, and excludes deleted/inactive/websiteless orgs', async () => {
      await insertOrg(db, 'org-active-1', { website_url: 'https://active-1.example.org/' });
      await insertOrg(db, 'org-active-2', { website_url: 'https://active-2.example.org/' });
      await insertOrg(db, 'org-inactive', { website_url: 'https://inactive.example.org/', record_status: 'inactive' });
      await insertOrg(db, 'org-no-site', { website_url: null });
      await insertOrg(db, 'org-deleted', { website_url: 'https://deleted.example.org/', deleted_at: '2026-01-01T00:00:00.000Z' });

      await db
        .prepare(`INSERT INTO intel_fetch_log (domain, path, last_fetched_at, robots_allowed) VALUES (?, ?, ?, 1)`)
        .bind('active-2.example.org', '/', '2026-01-01T00:00:00.000Z')
        .run();

      const targets = await claimSweepTargets(db, 10);
      const domains = targets.map((t) => t.domain);
      expect(domains).toContain('active-1.example.org');
      expect(domains).toContain('active-2.example.org');
      expect(domains).not.toContain('inactive.example.org');
      expect(domains).not.toContain('deleted.example.org');
      expect(domains.filter((d) => d === undefined)).toHaveLength(0);

      // Never-scanned (active-1) ranks ahead of the already-scanned active-2.
      expect(domains.indexOf('active-1.example.org')).toBeLessThan(domains.indexOf('active-2.example.org'));
    });

    it('returns an empty array for a non-positive limit', async () => {
      expect(await claimSweepTargets(db, 0)).toEqual([]);
    });
  });

  describe('runs', () => {
    it('approveRun only succeeds from status proposed', async () => {
      const run = await createRun(db, { runType: 'org_sweep' });
      expect(run.status).toBe('proposed');

      const approved = await approveRun(db, run.id, 'jeff@parentcoachdesk.com');
      expect(approved?.status).toBe('approved');
      expect(approved?.approved_by).toBe('jeff@parentcoachdesk.com');

      const second = await approveRun(db, run.id, 'someone-else@parentcoachdesk.com');
      expect(second).toBeNull();

      const stillApproved = await getRun(db, run.id);
      expect(stillApproved?.approved_by).toBe('jeff@parentcoachdesk.com');
    });

    it('markRunStatus patches only the provided fields', async () => {
      const run = await createRun(db, { runType: 'manual', targetsPlanned: 5 });
      await markRunStatus(db, run.id, 'running', { started_at: '2026-01-01T00:00:00.000Z' });
      const running = await getRun(db, run.id);
      expect(running?.status).toBe('running');
      expect(running?.started_at).toBe('2026-01-01T00:00:00.000Z');
      expect(running?.targets_planned).toBe(5);
    });

    it('listRuns filters by status', async () => {
      await createRun(db, { runType: 'org_sweep' });
      const run2 = await createRun(db, { runType: 'org_sweep' });
      await markRunStatus(db, run2.id, 'complete');
      const complete = await listRuns(db, { status: 'complete' });
      expect(complete.map((r) => r.id)).toEqual([run2.id]);
    });
  });

  describe('resolveReviewItem', () => {
    it('accepting promotes the row into org_tech_stack with status confirmed', async () => {
      await insertOrg(db, 'org-8');
      await recordDetection(db, {
        runId: 'run-1',
        orgId: 'org-8',
        domain: 'org-8.example.org',
        sourceUrl: 'https://org-8.example.org/',
        results: [makeResult({ confidence: 40 })],
      });
      const queue = await listReviewQueue(db, {});
      const ok = await resolveReviewItem(db, queue[0]!.id, { status: 'accepted', resolvedBy: 'jeff@parentcoachdesk.com' });
      expect(ok).toBe(true);

      const stack = await db.prepare(`SELECT * FROM org_tech_stack WHERE org_id = ?`).bind('org-8').first<any>();
      expect(stack.status).toBe('confirmed');
      expect(stack.competitor_id).toBe('sportsgravy');

      const resolved = await listReviewQueue(db, { status: 'accepted' });
      expect(resolved).toHaveLength(1);
    });

    it('rejecting leaves org_tech_stack untouched', async () => {
      await insertOrg(db, 'org-9');
      await recordDetection(db, {
        runId: 'run-1',
        orgId: 'org-9',
        domain: 'org-9.example.org',
        sourceUrl: 'https://org-9.example.org/',
        results: [makeResult({ confidence: 40 })],
      });
      const queue = await listReviewQueue(db, {});
      await resolveReviewItem(db, queue[0]!.id, { status: 'rejected', resolvedBy: 'jeff@parentcoachdesk.com' });
      const stack = await db.prepare(`SELECT * FROM org_tech_stack WHERE org_id = ?`).bind('org-9').first();
      expect(stack).toBeNull();
    });

    it('returns false for an already-resolved row', async () => {
      await insertOrg(db, 'org-10');
      await recordDetection(db, {
        runId: 'run-1',
        orgId: 'org-10',
        domain: 'org-10.example.org',
        sourceUrl: 'https://org-10.example.org/',
        results: [makeResult({ confidence: 40 })],
      });
      const queue = await listReviewQueue(db, {});
      await resolveReviewItem(db, queue[0]!.id, { status: 'accepted', resolvedBy: 'jeff@parentcoachdesk.com' });
      const again = await resolveReviewItem(db, queue[0]!.id, { status: 'rejected', resolvedBy: 'jeff@parentcoachdesk.com' });
      expect(again).toBe(false);
    });
  });

  describe('listStack / listOpportunities / getIntelSummary', () => {
    it('joins organization fields onto stack rows', async () => {
      await insertOrg(db, 'org-11');
      await recordDetection(db, {
        runId: 'run-1',
        orgId: 'org-11',
        domain: 'org-11.example.org',
        sourceUrl: 'https://org-11.example.org/',
        results: [makeResult({ confidence: 75 })],
      });
      const rows = await listStack(db, {});
      expect(rows).toHaveLength(1);
      expect(rows[0]!.org_name).toBe('Org org-11');
    });

    it('getIntelSummary reports pending review and orgs-with-stack counts', async () => {
      await insertOrg(db, 'org-12');
      await insertOrg(db, 'org-13');
      await recordDetection(db, { runId: 'r1', orgId: 'org-12', domain: 'org-12.example.org', sourceUrl: 'https://org-12.example.org/', results: [makeResult({ confidence: 75 })] });
      await recordDetection(db, { runId: 'r2', orgId: 'org-13', domain: 'org-13.example.org', sourceUrl: 'https://org-13.example.org/', results: [makeResult({ confidence: 40 })] });

      const summary = await getIntelSummary(db);
      expect(summary.orgsWithStack).toBe(1);
      expect(summary.pendingReview).toBe(1);
      expect(summary.byCompetitor).toEqual([{ competitor_id: 'sportsgravy', count: 1 }]);
    });

    it('listOpportunities filters by minPriority', async () => {
      await insertOrg(db, 'org-14');
      const now = '2026-01-01T00:00:00.000Z';
      await db
        .prepare(
          `INSERT INTO org_opportunity_scores (org_id, migration_difficulty, org_size_score, tech_maturity, switch_likelihood, revenue_estimate_usd, priority, rationale, scoring_version, scored_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .bind('org-14', 50, 60, 40, 70, 10000, 65, '{}', 1, now)
        .run();
      const high = await listOpportunities(db, { minPriority: 70 });
      expect(high).toHaveLength(0);
      const all = await listOpportunities(db, { minPriority: 0 });
      expect(all).toHaveLength(1);
      expect(all[0]!.org_name).toBe('Org org-14');
    });
  });
});
