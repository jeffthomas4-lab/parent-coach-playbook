import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const evidence = JSON.parse(fs.readFileSync(
  path.resolve(import.meta.dirname, '../coordination/release-evidence/local-directory-idempotency-rehearsal-2026-07-16.json'),
  'utf8',
));

describe('local directory idempotency rehearsal evidence', () => {
  it('is explicitly local and non-production', () => {
    expect(evidence.environment).toBe('disposable_local_d1');
    expect(evidence.remote_access).toBe(false);
    expect(evidence.production_mutation).toBe(false);
  });

  it('covers the complete migration chain, constraint, and bounded cleanup', () => {
    expect(evidence.migration_result).toMatchObject({ last: '0015_public_write_idempotency.sql', all_applied: true, foreign_key_check_rows: 0 });
    expect(evidence.constraint_result.duplicate_compound_key).toBe('rejected');
    expect(evidence.cleanup_result).toMatchObject({ batch_limit: 1, deleted: 1, future_record_preserved: true });
  });

  it('does not overstate concurrency, staging, mobile, scheduling, or production proof', () => {
    expect(evidence.not_proved).toEqual(expect.arrayContaining([
      'simultaneous Worker requests against isolated staging D1',
      'rendered mobile retry journey',
      'production readiness',
    ]));
  });
});
