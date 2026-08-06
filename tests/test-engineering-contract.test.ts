import { describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';
import { integrationOnlySource, integrationTests } from '../test-classification';

const root = new URL('../', import.meta.url);
const read = (path: string) => readFile(new URL(path, root), 'utf8');

describe('test engineering contract', () => {
  it('uses explicit non-empty integration classifications without duplicates', () => {
    expect(integrationTests.length).toBeGreaterThan(0);
    expect(new Set(integrationTests).size).toBe(integrationTests.length);
    expect(integrationOnlySource.length).toBeGreaterThan(0);
    expect(new Set(integrationOnlySource).size).toBe(integrationOnlySource.length);
  });

  it('enforces 60 percent independently across all four coverage axes', async () => {
    const config = await read('vitest.unit.config.ts');
    for (const axis of ['statements', 'branches', 'functions', 'lines']) {
      expect(config).toContain(`${axis}: 60`);
    }
    expect(config).toContain("reportsDirectory: 'coverage/unit'");
  });

  // ci.yml ran unit coverage on every push and integration on PRs and main merges.
  // It was deleted with the rest of GitHub Actions on 2026-08-05; the replacement
  // is a local pre-push run, per Outputs/_system/GITHUB-ACTIONS-REPLACEMENT.md
  // section 3d. The commands must therefore still exist and still be reachable
  // from one entry point, because there is no runner to fall back on.
  it('keeps unit coverage and integration runnable locally from ci:release', async () => {
    const pkg = JSON.parse(await read('package.json'));

    expect(pkg.scripts['test:unit:coverage']).toContain('vitest.unit.config.ts');
    expect(pkg.scripts['test:unit:coverage']).toContain('--coverage');
    expect(pkg.scripts['test:integration']).toContain('vitest.integration.config.ts');

    // ci:release is the single local gate now. It must still reach integration.
    expect(pkg.scripts['ci:release']).toContain('npm run test:integration');
    expect(pkg.scripts['ci:release']).toContain('npm run audit:gate');
  });

  it('runs disposable-D1 integration tests in one deterministic worker fork', async () => {
    const config = await read('vitest.integration.config.ts');
    expect(config).toContain("pool: 'forks'");
    expect(config).toContain('maxWorkers: 1');
    expect(config).toContain('fileParallelism: false');
  });

  it('defines the customer-launch deletion and DSR integration contract', async () => {
    const architecture = await read('coordination/TEST-ARCHITECTURE.md');
    for (const requirement of [
      'deactivation',
      'session/token revocation',
      'machine- and human-readable export',
      'dead-letter',
      'legal holds',
      'cross-tenant denial',
      'idempotency',
      'partial database/object/provider failure',
      'resumability',
      'processor propagation',
      'completion receipts',
      'immutable-backup age-out',
    ]) {
      expect(architecture.toLowerCase()).toContain(requirement.toLowerCase());
    }
  });
});
