import { describe, expect, it } from 'vitest';
import type { D1Database } from '@cloudflare/workers-types';
import { createDisposableIntelDatabase } from './helpers/disposable-intel-db';
import { RATIONALE_KEY_TO_FIELD, rescoreOrgs, scoreOpportunity, type OpportunityInput } from '../src/lib/intel/scoring';
import { syncCompetitorCatalog } from '../src/lib/intel/store';
import type { CompetitorDefinition } from '../src/lib/intel/fingerprints';

const BASE_INPUT: OpportunityInput = {
  orgId: 'org-1',
  competitorId: 'sportsgravy',
  competitorMigrationDifficulty: 'high',
  stackConfidence: 80,
  programCount: 18,
  ageSpanYears: 11,
  hasStreaming: true,
  websiteLastVerifiedDaysAgo: 90,
  brokenLinkCount: 3,
  categoriesDetected: 3,
  yearsOperating: 12,
};

const TEST_COMPETITOR: CompetitorDefinition = {
  id: 'sportsgravy',
  displayName: 'SportsGravy',
  canonicalDomain: 'sportsgravy.com',
  category: 'club_management',
  migrationDifficulty: 'high',
  patterns: [{ id: 'sportsgravy.test.pattern', type: 'html_text', category: 'club_management', match: { kind: 'substring', value: 'sportsgravy' }, weight: 80 }],
};

describe('scoreOpportunity', () => {
  it('is deterministic: the same input always produces the same output', () => {
    const first = scoreOpportunity(BASE_INPUT);
    const second = scoreOpportunity({ ...BASE_INPUT });
    expect(second).toEqual(first);
  });

  it('every rationale key maps to a numeric field on the score, per RATIONALE_KEY_TO_FIELD', () => {
    const score = scoreOpportunity(BASE_INPUT);
    const rationaleKeys = Object.keys(score.rationale);
    expect(rationaleKeys.sort()).toEqual(Object.keys(RATIONALE_KEY_TO_FIELD).sort());
    for (const key of rationaleKeys) {
      const field = RATIONALE_KEY_TO_FIELD[key]!;
      expect(typeof score[field]).toBe('number');
      expect(score.rationale[key]).toEqual(expect.any(String));
      expect(score.rationale[key]!.length).toBeGreaterThan(0);
    }
  });

  it('every score field is within 0-100 except revenueEstimateUsd', () => {
    const score = scoreOpportunity(BASE_INPUT);
    expect(score.migrationDifficulty).toBeGreaterThanOrEqual(0);
    expect(score.migrationDifficulty).toBeLessThanOrEqual(100);
    expect(score.orgSizeScore).toBeGreaterThanOrEqual(0);
    expect(score.orgSizeScore).toBeLessThanOrEqual(100);
    expect(score.techMaturity).toBeGreaterThanOrEqual(0);
    expect(score.techMaturity).toBeLessThanOrEqual(100);
    expect(score.switchLikelihood).toBeGreaterThanOrEqual(0);
    expect(score.switchLikelihood).toBeLessThanOrEqual(100);
    expect(score.priority).toBeGreaterThanOrEqual(0);
    expect(score.priority).toBeLessThanOrEqual(100);
    expect(score.revenueEstimateUsd).toBeGreaterThanOrEqual(0);
  });

  it('a bigger, more mature org scores a higher priority than a tiny unknown one', () => {
    const big = scoreOpportunity(BASE_INPUT);
    const tiny = scoreOpportunity({
      orgId: 'org-2',
      competitorId: null,
      competitorMigrationDifficulty: null,
      stackConfidence: 30,
      programCount: 1,
      ageSpanYears: null,
      hasStreaming: false,
      websiteLastVerifiedDaysAgo: null,
      brokenLinkCount: 0,
      categoriesDetected: 1,
      yearsOperating: null,
    });
    expect(big.priority).toBeGreaterThan(tiny.priority);
  });

  it('revenue estimate is a direct, documented multiple of program count', () => {
    const score = scoreOpportunity({ ...BASE_INPUT, programCount: 10 });
    expect(score.revenueEstimateUsd).toBe(35_000);
  });

  it('no competitor identified falls back to a neutral migration difficulty, not zero', () => {
    const score = scoreOpportunity({ ...BASE_INPUT, competitorId: null, competitorMigrationDifficulty: null });
    expect(score.migrationDifficulty).toBe(50);
  });

  it('rationale strings contain no em dashes', () => {
    const score = scoreOpportunity(BASE_INPUT);
    for (const line of Object.values(score.rationale)) {
      expect(line).not.toMatch(/—/);
    }
  });
});

describe('rescoreOrgs', () => {
  let db: D1Database;

  it('scores every org with an active stack row and writes org_opportunity_scores', async () => {
    ({ db } = await createDisposableIntelDatabase());
    await syncCompetitorCatalog(db, [TEST_COMPETITOR]);

    const now = '2026-01-01T00:00:00.000Z';
    await db
      .prepare(`INSERT INTO organizations (id, slug, name, website_url, record_status, years_operating, last_verified_at, created_at, updated_at) VALUES (?, ?, ?, ?, 'active', ?, ?, ?, ?)`)
      .bind('org-1', 'org-1', 'Org One', 'https://org-1.example.org/', 10, '2025-06-01T00:00:00.000Z', now, now)
      .run();
    await db
      .prepare(`INSERT INTO programs (id, organization_id, slug, name, record_status, age_min, age_max, created_at, updated_at) VALUES (?, ?, ?, ?, 'active', ?, ?, ?, ?)`)
      .bind('prog-1', 'org-1', 'prog-1', 'Program One', 8, 14, now, now)
      .run();
    await db
      .prepare(
        `INSERT INTO org_tech_stack (id, org_id, category, competitor_id, confidence, status, first_detected_at, last_confirmed_at, evidence_count)
         VALUES (?, ?, 'club_management', ?, 80, 'detected', ?, ?, 1)`,
      )
      .bind('stack-1', 'org-1', 'sportsgravy', now, now)
      .run();

    const scored = await rescoreOrgs(db, 10);
    expect(scored).toBe(1);

    const row = await db.prepare(`SELECT * FROM org_opportunity_scores WHERE org_id = ?`).bind('org-1').first<any>();
    expect(row).toBeTruthy();
    expect(row.priority).toBeGreaterThan(0);
    expect(JSON.parse(row.rationale)).toHaveProperty('orgSize');
  });

  it('does not score an org with no active stack row', async () => {
    ({ db } = await createDisposableIntelDatabase());
    const now = '2026-01-01T00:00:00.000Z';
    await db
      .prepare(`INSERT INTO organizations (id, slug, name, website_url, record_status, created_at, updated_at) VALUES (?, ?, ?, ?, 'active', ?, ?)`)
      .bind('org-2', 'org-2', 'Org Two', 'https://org-2.example.org/', now, now)
      .run();
    const scored = await rescoreOrgs(db, 10);
    expect(scored).toBe(0);
  });

  it('returns 0 for a non-positive limit', async () => {
    ({ db } = await createDisposableIntelDatabase());
    expect(await rescoreOrgs(db, 0)).toBe(0);
  });
});
