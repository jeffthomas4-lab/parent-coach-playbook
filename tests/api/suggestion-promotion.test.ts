// Direct unit coverage for promoteOrgSuggestionToProgram(): the org_suggestions
// -> programs draft-creation path behind "Create draft camp" on
// /admin/suggestions/. Fake-D1 pattern mirrors camps-db-atomicity.test.ts —
// bind() returns an object carrying its own sql/args so the array actually
// passed to db.batch() can be inspected directly.

import { describe, expect, it, vi } from 'vitest';
import { promoteOrgSuggestionToProgram } from '../../src/lib/suggestion-promotion';
import type { OrgSuggestion } from '../../src/lib/camps-db';

function fakeDb(opts: { orgLookupResult: { id: string } | null }) {
  const batch = vi.fn().mockResolvedValue([]);
  const database = {
    prepare(sql: string) {
      return {
        bind(...args: unknown[]) {
          return {
            sql,
            args,
            first: vi.fn().mockResolvedValue(
              sql.includes('FROM organizations WHERE LOWER(name)') ? opts.orgLookupResult : null,
            ),
          };
        },
      };
    },
    batch,
  } as unknown as D1Database;
  return { database, batch };
}

const suggestion: OrgSuggestion = {
  id: 'sugg_1',
  org_name: 'Tacoma Youth Soccer',
  org_website: 'https://tacomayouthsoccer.example.com',
  org_city: 'Tacoma',
  org_state: 'WA',
  activity_type: 'soccer',
  submitter_email: 'parent@example.com',
  notes: 'Runs a fall rec league, no website listing found yet.',
  status: 'pending',
  submitted_at: '2026-07-01T00:00:00.000Z',
};

describe('promoteOrgSuggestionToProgram', () => {
  it('creates both an organization and a program when no name match exists', async () => {
    const { database, batch } = fakeDb({ orgLookupResult: null });
    const result = await promoteOrgSuggestionToProgram(database, suggestion);

    expect(result.organizationCreated).toBe(true);
    expect(batch).toHaveBeenCalledOnce();
    const statements = batch.mock.calls[0][0] as Array<{ sql: string; args: unknown[] }>;
    expect(statements).toHaveLength(2);
    expect(statements[0].sql).toContain('INSERT INTO organizations');
    expect(statements[0].args).toContain('Tacoma Youth Soccer');
    expect(statements[1].sql).toContain('INSERT INTO programs');
    expect(statements[1].sql).toContain("'pending'");
    expect(statements[1].args).toContain(result.programId);
    expect(statements[1].args).toContain(result.organizationId);
    expect(statements[1].args).toContain('Tacoma Youth Soccer');
  });

  it('reuses an existing organization matched by name instead of creating a duplicate', async () => {
    const { database, batch } = fakeDb({ orgLookupResult: { id: 'org_existing_1' } });
    const result = await promoteOrgSuggestionToProgram(database, suggestion);

    expect(result.organizationCreated).toBe(false);
    expect(result.organizationId).toBe('org_existing_1');
    const statements = batch.mock.calls[0][0] as Array<{ sql: string; args: unknown[] }>;
    // Only the program insert — no duplicate organization row.
    expect(statements).toHaveLength(1);
    expect(statements[0].sql).toContain('INSERT INTO programs');
    expect(statements[0].args).toContain('org_existing_1');
  });

  it('falls back to a stub description and a placeholder submitter email when the suggestion carries neither', async () => {
    const bareSuggestion: OrgSuggestion = { ...suggestion, notes: null, submitter_email: null };
    const { database, batch } = fakeDb({ orgLookupResult: null });
    await promoteOrgSuggestionToProgram(database, bareSuggestion);
    const statements = batch.mock.calls[0][0] as Array<{ sql: string; args: unknown[] }>;
    const programArgs = statements[1].args;
    expect(programArgs.some((a) => typeof a === 'string' && a.includes('sugg_1'))).toBe(true);
    expect(programArgs).toContain('admin-promoted@parentcoachdesk.com');
  });
});
