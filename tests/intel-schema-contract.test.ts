import { describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';
import { STACK_CATEGORIES, SIGNAL_TYPES } from '../src/lib/intel/types';

const TABLES: Record<string, string[]> = {
  competitors: [
    'id', 'display_name', 'canonical_domain', 'category', 'status',
    'migration_difficulty', 'notes', 'created_at', 'updated_at',
  ],
  org_tech_signals: [
    'id', 'run_id', 'org_id', 'domain', 'competitor_id', 'signal_type',
    'pattern_id', 'matched_value', 'weight', 'source_url', 'observed_at',
  ],
  org_tech_stack: [
    'id', 'org_id', 'category', 'competitor_id', 'confidence', 'status',
    'first_detected_at', 'last_confirmed_at', 'evidence_count', 'reviewed_by',
    'reviewed_at', 'review_notes',
  ],
  org_tech_history: [
    'id', 'org_id', 'category', 'from_competitor_id', 'to_competitor_id',
    'change_type', 'from_confidence', 'to_confidence', 'run_id', 'detected_at',
  ],
  intel_runs: [
    'id', 'run_type', 'status', 'requested_by', 'approved_by', 'approved_at',
    'started_at', 'finished_at', 'targets_planned', 'targets_fetched',
    'targets_skipped', 'signals_found', 'error_code', 'notes', 'created_at',
  ],
  intel_review_queue: [
    'id', 'org_id', 'domain', 'competitor_id', 'category', 'confidence',
    'reason', 'evidence_json', 'status', 'run_id', 'resolved_by',
    'resolved_at', 'resolution_notes', 'created_at',
  ],
  org_opportunity_scores: [
    'org_id', 'migration_difficulty', 'org_size_score', 'tech_maturity',
    'switch_likelihood', 'revenue_estimate_usd', 'priority', 'rationale',
    'scoring_version', 'scored_at',
  ],
  intel_fetch_log: [
    'domain', 'path', 'last_fetched_at', 'status_code', 'etag',
    'last_modified', 'content_hash', 'robots_allowed', 'robots_checked_at',
  ],
};

async function readMigration(): Promise<string> {
  return readFile(new URL('../migrations-activity-radar/0016_competitor_intelligence.sql', import.meta.url), 'utf8');
}

/** Pulls the body of a single `CREATE TABLE IF NOT EXISTS <name> ( ... );` statement. */
function extractTableBody(sql: string, table: string): string {
  const pattern = new RegExp(
    `CREATE TABLE IF NOT EXISTS ${table}\\s*\\(([\\s\\S]*?)\\n\\);`,
    'i',
  );
  const match = sql.match(pattern);
  if (!match) throw new Error(`CREATE TABLE IF NOT EXISTS ${table} not found`);
  return match[1];
}

describe('competitor intelligence schema contract', () => {
  it('defines every required table', async () => {
    const sql = await readMigration();
    for (const table of Object.keys(TABLES)) {
      expect(sql).toMatch(new RegExp(`CREATE TABLE IF NOT EXISTS ${table}\\b`, 'i'));
    }
  });

  it('defines every required column on each table', async () => {
    const sql = await readMigration();
    for (const [table, columns] of Object.entries(TABLES)) {
      const body = extractTableBody(sql, table);
      for (const column of columns) {
        expect(body, `${table}.${column}`).toMatch(new RegExp(`\\b${column}\\b`));
      }
    }
  });

  it('contains no destructive statements', async () => {
    const sql = await readMigration();
    expect(sql).not.toMatch(/DROP\s+/i);
    expect(sql).not.toMatch(/DELETE\s+FROM/i);
    expect(sql).not.toMatch(/ALTER\s+TABLE\s+\w+\s+DROP/i);
  });

  it('uses IF NOT EXISTS on every CREATE TABLE and CREATE INDEX', async () => {
    const sql = await readMigration();
    const createTableLines = sql.match(/CREATE TABLE(?!\s+IF NOT EXISTS)\s+\S+/gi) ?? [];
    expect(createTableLines).toEqual([]);

    const createIndexLines = sql.match(/CREATE INDEX(?!\s+IF NOT EXISTS)\s+\S+/gi) ?? [];
    expect(createIndexLines).toEqual([]);
  });

  it('keeps STACK_CATEGORIES non-empty and unique', () => {
    expect(STACK_CATEGORIES.length).toBeGreaterThan(0);
    expect(new Set(STACK_CATEGORIES).size).toBe(STACK_CATEGORIES.length);
  });

  it('keeps SIGNAL_TYPES non-empty and unique', () => {
    expect(SIGNAL_TYPES.length).toBeGreaterThan(0);
    expect(new Set(SIGNAL_TYPES).size).toBe(SIGNAL_TYPES.length);
  });
});
