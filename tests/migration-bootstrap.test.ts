import { describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';

describe('fresh D1 migration bootstrap contract', () => {
  it('defines every legacy camps column referenced by later index migrations', async () => {
    const init = await readFile(new URL('../migrations/0001_init_camps.sql', import.meta.url), 'utf8');
    const required = [
      'last_edited_at', 'last_edited_by', 'program_type', 'registration_deadline',
      'schedule_text', 'confidence', 'source_domain', 'reject_reason_code',
      'url_health_status', 'url_last_checked_at', 'url_last_status_code',
      'awaiting_review', 'featured', 'featured_order', 'featured_until',
    ];
    for (const column of required) expect(init).toMatch(new RegExp(`\\b${column}\\b`, 'i'));
  });

  it('keeps the repair scoped to never-initialized databases', async () => {
    const init = await readFile(new URL('../migrations/0001_init_camps.sql', import.meta.url), 'utf8');
    expect(init).toContain('databases where 0001 has never');
    expect(init).not.toMatch(/DROP\s+TABLE|DELETE\s+FROM|UPDATE\s+camps/i);
  });

  it('keeps production application subject to a separate approval', async () => {
    const files = await Promise.all([
      readFile(new URL('../migrations/0011_trust_cases.sql', import.meta.url), 'utf8'),
      readFile(new URL('../migrations/0014_trust_intake_idempotency.sql', import.meta.url), 'utf8'),
    ]);
    expect(files.join('\n')).toMatch(/explicit approval|separate production approval/i);
  });
});
