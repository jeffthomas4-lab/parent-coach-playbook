import { describe, expect, it, vi } from 'vitest';
import { insertCamp, type NewCampInput } from '../../src/lib/camps-db';

describe('camp database writes', () => {
  it('batches the organization and program inserts without running either independently', async () => {
    const run = vi.fn();
    const statements: Array<{ sql: string; values: unknown[]; run: typeof run }> = [];
    const batch = vi.fn().mockResolvedValue([]);
    const database = {
      prepare(sql: string) {
        return {
          bind(...values: unknown[]) {
            const statement = { sql, values, run };
            statements.push(statement);
            return statement;
          },
        };
      },
      batch,
    } as unknown as D1Database;
    const camp: NewCampInput = {
      id: 'camp-1',
      slug: 'safe-camp',
      name: 'Safe Camp',
      sport: 'soccer',
      age_min: 8,
      age_max: 12,
      start_date: '2026-08-01',
      end_date: '2026-08-05',
      address: '1 Main St',
      city: 'Seattle',
      state: 'WA',
      zip: '98101',
      latitude: null,
      longitude: null,
      description: 'A bounded test camp.',
      price_text: '$100',
      day_or_overnight: 'day',
      skill_level: 'all',
      spots_status: 'open',
      contact_email: null,
      contact_phone: null,
      website_url: 'https://example.com/register',
      lunch_included: false,
      aftercare_available: false,
      submitted_by_email: 'operator@example.com',
      submitted_at: '2026-07-16T00:00:00.000Z',
    };

    await insertCamp(database, camp);

    expect(statements).toHaveLength(2);
    expect(batch).toHaveBeenCalledOnce();
    expect(batch).toHaveBeenCalledWith(statements);
    expect(run).not.toHaveBeenCalled();
    expect(statements[0].sql).toContain('INSERT INTO organizations');
    expect(statements[1].sql).toContain('INSERT INTO programs');
  });
});
