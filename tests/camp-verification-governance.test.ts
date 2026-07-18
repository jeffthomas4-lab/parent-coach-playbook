import { describe, expect, it, vi } from 'vitest';
import { campVerificationBlock, setVerified, type Camp } from '../src/lib/camps-db';

const camp = (overrides: Partial<Camp> = {}) => ({
  id: 'camp-1', status: 'approved', source_domain: 'example.com',
  registration_url: 'https://example.com/camp', website_url: 'https://example.com',
  ...overrides,
} as Camp);

describe('camp verification governance', () => {
  it('requires an approved listing and an HTTPS source before verification', () => {
    expect(campVerificationBlock(null)).toBe('not_found');
    expect(campVerificationBlock(camp({ status: 'pending' }))).toBe('not_approved');
    expect(campVerificationBlock(camp({ source_domain: null }))).toBe('source_missing');
    expect(campVerificationBlock(camp({ registration_url: 'http://example.com', website_url: null }))).toBe('source_not_https');
    expect(campVerificationBlock(camp())).toBeNull();
  });

  it('records the verification timestamp atomically with the badge', async () => {
    const first = vi.fn().mockResolvedValue(camp());
    const run = vi.fn().mockResolvedValue({ success: true });
    const bind = vi.fn().mockReturnValue({ run });
    const prepare = vi.fn((sql: string) => sql.includes('SELECT') ? { bind: vi.fn().mockReturnValue({ first }) } : { bind });
    const db = { prepare } as unknown as D1Database;

    await setVerified(db, 'camp-1', true);
    const update = prepare.mock.calls.map(([sql]) => sql).find((sql) => sql.includes('UPDATE programs'))!;
    expect(update).toContain('last_verified_at');
    expect(bind.mock.calls[0][0]).toBe(1);
    expect(bind.mock.calls[0][2]).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });
});
