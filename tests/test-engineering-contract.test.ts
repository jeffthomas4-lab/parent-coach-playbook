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

  it('runs unit coverage on every push and integration on PRs or main merges', async () => {
    const workflow = await read('.github/workflows/ci.yml');
    expect(workflow).toContain("branches: ['**']");
    expect(workflow).toContain('npm run test:unit:coverage');
    expect(workflow).toContain("github.event_name == 'pull_request' || github.ref == 'refs/heads/main'");
    expect(workflow).toContain('npm run test:integration');
  });

  it('runs disposable-D1 integration tests in one deterministic worker thread', async () => {
    const config = await read('vitest.integration.config.ts');
    expect(config).toContain("pool: 'threads'");
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
