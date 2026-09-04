import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const stageScript = join(scriptDirectory, 'run-crm-backfill-scale-stage.ts');
const stateDirectory = mkdtempSync(join(tmpdir(), 'pcd-crm-scale-'));
const startedAt = Date.now();
let completed = false;

try {
  for (let stage = 1; stage <= 64; stage += 1) {
    const child = spawnSync(process.execPath, ['--experimental-strip-types', stageScript, stateDirectory], {
      cwd: join(scriptDirectory, '..'),
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024,
      windowsHide: true,
    });
    if (child.stdout) process.stdout.write(child.stdout);
    if (child.stderr) process.stderr.write(child.stderr);
    if (child.status !== 0) throw new Error(`CRM scale stage ${stage} failed with exit ${child.status ?? 'unknown'}`);
    const record = child.stdout.trim().split(/\r?\n/).at(-1);
    const result = record ? JSON.parse(record) : null;
    if (result?.complete === true) {
      completed = true;
      process.stdout.write(`${JSON.stringify({
        event: 'pcd_crm_scale_gate_completed',
        stages: stage,
        durationMs: Date.now() - startedAt,
        ...result,
      })}\n`);
      break;
    }
  }
  if (!completed) throw new Error('CRM scale gate exceeded its 64-stage ceiling');
} finally {
  const expectedPrefix = join(tmpdir(), 'pcd-crm-scale-');
  if (stateDirectory.startsWith(expectedPrefix)) rmSync(stateDirectory, { recursive: true, force: true });
}
