import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import { validateBackupProvingLog } from '../scripts/check-backup-proving-log.mjs';

describe('backup proving clock', () => {
  it('proves the current local export clock on three distinct dates', async () => {
    const result = validateBackupProvingLog(await readFile('scripts/BACKUP-PROVING-LOG.md', 'utf8'));
    expect(result).toMatchObject({ valid: true, rowCount: 6, distinctCleanDates: ['2026-07-15', '2026-07-16', '2026-07-17'] });
  });

  it('rejects same-day repetition and non-positive evidence', () => {
    const header = '| # | Run (local) | Size MB | Attempts | Backups on disk |\n|---|---|---|---|---|\n';
    const sameDay = header + '| 1 | 2026-07-15 01:00:00 | 1 | 1 | 1 |\n| 2 | 2026-07-15 02:00:00 | 1 | 1 | 2 |\n| 3 | 2026-07-15 03:00:00 | 0 | 1 | 3 |\n';
    expect(validateBackupProvingLog(sameDay).errors).toEqual(expect.arrayContaining([
      'requires clean runs on 3 separate dates; found 1',
      'every proving row requires positive size, attempts, and retained backup count',
    ]));
  });
});
