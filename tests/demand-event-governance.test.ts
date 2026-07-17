import { describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';

describe('demand event governance', () => {
  it('defines an additive versioned table with bounded privacy dimensions and expiry', async () => {
    const sql = (await readFile(new URL('../migrations/0013_demand_events_v1.sql', import.meta.url), 'utf8')).toLowerCase();
    expect(sql).toContain('create table if not exists demand_events_v1');
    expect(sql).toContain('schema_version = 1');
    expect(sql).toContain("event_type in ('search', 'filter')");
    expect(sql).toContain('length(query) between 1 and 120');
    expect(sql).toContain('expires_at text not null');
    expect(sql).toContain('idx_demand_events_v1_expiry');
    for (const forbidden of ['ip_address', 'visitor_id', 'session_id', 'user_agent', 'referrer', 'email', 'phone', 'latitude', 'longitude']) {
      expect(sql).not.toMatch(new RegExp(`\\b${forbidden}\\b`));
    }
  });

  it('keeps telemetry disabled and omits a retention value from deploy configs', async () => {
    for (const file of ['../wrangler.jsonc', '../wrangler.production.jsonc']) {
      const config = await readFile(new URL(file, import.meta.url), 'utf8');
      expect(config).toMatch(/"DEMAND_TELEMETRY_ENABLED"\s*:\s*"false"/);
      expect(config).not.toContain('DEMAND_EVENT_RETENTION_DAYS');
    }
  });

  it('does not ship a retention mutation or remote migration command', async () => {
    const sql = (await readFile(new URL('../migrations/0013_demand_events_v1.sql', import.meta.url), 'utf8')).toLowerCase();
    expect(sql).not.toMatch(/\bdelete\s+from\b|\bdrop\s+table\b|wrangler\s+d1|--remote/);
  });
});
