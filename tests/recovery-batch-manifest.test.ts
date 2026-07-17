import { createHash } from 'node:crypto';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { buildRecoveryBatchManifest, parseArtifactSpec } from '../scripts/build-recovery-batch-manifest.mjs';

describe('recovery batch manifest', () => {
  it('records only provider-neutral integrity metadata', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'pcd-recovery-manifest-'));
    const source = join(directory, 'input.sql');
    await writeFile(source, 'BEGIN;\nSELECT 1;\nCOMMIT;\n', 'utf8');
    const manifest = await buildRecoveryBatchManifest({
      batchId: '2026-07-17-test',
      artifactSpecs: [`d1_export:activity_radar=${source}`],
      now: () => new Date('2026-07-17T07:00:00.000Z'),
    });

    expect(manifest).toMatchObject({
      batch_id: '2026-07-17-test', artifact_count: 1, total_bytes: 25,
      safety_boundary: { provider_upload_attempted: false, source_paths_recorded: false, object_names_recorded: false },
    });
    expect(manifest.artifacts).toEqual([{
      id: 'activity_radar', type: 'd1_export', format: 'sql', bytes: 25,
      sha256: createHash('sha256').update('BEGIN;\nSELECT 1;\nCOMMIT;\n').digest('hex'),
    }]);
    expect(JSON.stringify(manifest)).not.toContain(directory);
    expect(JSON.stringify(manifest)).not.toContain('input.sql');
  });

  it('rejects malformed, duplicate, empty, and non-file artifacts', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'pcd-recovery-manifest-'));
    const empty = join(directory, 'empty.sql');
    await writeFile(empty, '', 'utf8');
    expect(() => parseArtifactSpec('activity_radar=path.sql')).toThrow('invalid artifact declaration');
    await expect(buildRecoveryBatchManifest({ batchId: 'bad id', artifactSpecs: ['d1_export:activity_radar=x'] })).rejects.toThrow('batch id');
    await expect(buildRecoveryBatchManifest({ batchId: '2026-07-17-test', artifactSpecs: [`d1_export:activity_radar=${empty}`] })).rejects.toThrow('is empty');
    await expect(buildRecoveryBatchManifest({ batchId: '2026-07-17-test', artifactSpecs: ['d1_export:activity_radar=x', 'd1_export:activity_radar=y'] })).rejects.toThrow('must be unique');
  });
});
