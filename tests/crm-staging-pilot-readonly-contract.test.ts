import { afterEach, describe, expect, it } from 'vitest';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { buildCrmStagingPilot } from '../scripts/build-crm-staging-pilot.mjs';

const generatedRoots: string[] = [];

afterEach(async () => {
  await Promise.all(generatedRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

describe('CRM staging packet read-only transport contract', () => {
  it('prohibits the remote D1 import endpoint and requires zero-change query metadata', async () => {
    const root = await mkdtemp(join(tmpdir(), 'crm-staging-readonly-contract-'));
    generatedRoots.push(root);
    const boundaryMs = Math.floor(Date.now() / 1_000) * 1_000;
    const manifest = await buildCrmStagingPilot({ boundaryMs, outputDir: join(root, 'packet') });

    expect(manifest.readOnlyD1Transport).toEqual({
      requiredFlag: '--command',
      prohibitedFlags: ['--file'],
      requiredMeta: {
        success: true,
        changes: 0,
        rows_written: 0,
        changed_db: false,
      },
    });
    expect(manifest.hardStops).toContain(
      'Execute every remote read-only D1 preflight via --command; --file uses the import endpoint and is prohibited.',
    );
  });
});
