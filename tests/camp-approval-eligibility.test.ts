import { describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';
import { campApprovalBlock } from '../src/lib/camps-db';

describe('camp approval eligibility', () => {
  const today = '2026-07-16';

  it('allows a current or future session including one ending today', () => {
    expect(campApprovalBlock({ start_date: '2026-07-01', end_date: '2026-07-16' } as any, today)).toBeNull();
    expect(campApprovalBlock({ start_date: '2026-08-01', end_date: '2026-08-05' } as any, today)).toBeNull();
  });

  it('blocks missing, malformed, reversed and ended dates', () => {
    expect(campApprovalBlock({ start_date: '', end_date: '2026-08-05' } as any, today)).toBe('dates_missing');
    expect(campApprovalBlock({ start_date: '07/01/2026', end_date: '2026-08-05' } as any, today)).toBe('dates_invalid');
    expect(campApprovalBlock({ start_date: '2026-02-30', end_date: '2026-08-05' } as any, today)).toBe('dates_invalid');
    expect(campApprovalBlock({ start_date: '2026-08-05', end_date: '2026-08-01' } as any, today)).toBe('dates_reversed');
    expect(campApprovalBlock({ start_date: '2026-07-01', end_date: '2026-07-15' } as any, today)).toBe('session_ended');
  });

  it('keeps the guarded program and organization transitions in one D1 batch', async () => {
    const source = await readFile('src/lib/camps-db.ts', 'utf8');
    const approval = source.slice(source.indexOf('export async function approveCamp'), source.indexOf('export async function rejectCamp'));
    expect(approval).toContain('await db.batch([');
    expect(approval).toContain('session_start_date = ? AND session_end_date = ?');
    expect(approval).toContain("throw new CampApprovalBlockedError('approval_state_changed')");
    expect(approval).not.toContain('.run()');
  });
});
