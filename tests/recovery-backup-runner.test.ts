import { describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';

describe('recovery batch export runner', () => {
  it('requires an explicit source-read confirmation and cannot upload or restore', async () => {
    const script = await readFile(new URL('../scripts/backup-pcd-recovery-batch.ps1', import.meta.url), 'utf8');
    expect(script).toContain('[switch]$Confirm');
    expect(script).toContain('[switch]$PlanOnly');
    expect(script).toContain("if ($PlanOnly -or -not $Confirm)");
    expect(script).toContain("mode = 'plan_only'");
    expect(script).toContain('activity-radar');
    expect(script).toContain('forge-command');
    expect(script).toContain('parent-coach-desk-ops-production');
    expect(script).toContain('wrangler d1 export');
    expect(script).toContain('build-recovery-batch-manifest.mjs');
    expect(script).not.toMatch(/r2\s+object\s+put|aws\s+s3|b2\s+upload|d1\s+time-travel\s+restore/i);
  });
});
