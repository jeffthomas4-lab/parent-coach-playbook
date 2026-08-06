import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

describe('deployment authority', () => {
  it('retires the legacy guide without losing the canonical pointers', async () => {
    const legacy = await readFile('DEPLOY.md', 'utf8');
    expect(legacy).toContain('Historical deployment guide — retired');
    expect(legacy).toContain('DEPLOYMENT-RUNBOOK.md');
    expect(legacy).not.toMatch(/Remove-Item[^\n]*\.git|rm\s+-rf\s+\.git|wrangler\s+pages\s+deploy|Connect Cloudflare Pages to the repo/i);
  });

  // GitHub Actions was removed from every repo on 2026-08-05 after it burned the
  // monthly allotment in four days. deploy-workers.yml, ci.yml, babylove-normalize.yml
  // and the protected `production` environment are gone; production ships from a
  // local shell. These assertions replace the workflow contract that used to live
  // here, and they encode the failure that removal caused the same night: a plain
  // `npm run build` produces a manifest named parent-coach-desk-staging, and
  // wrangler will deploy the STAGING worker and report success.
  it('keeps GitHub Actions disabled so nothing silently re-enables CI deploys', async () => {
    await expect(readFile('.github/workflows/deploy-workers.yml', 'utf8')).rejects.toThrow();
    await expect(readFile('.github/workflows/ci.yml', 'utf8')).rejects.toThrow();
  });

  it('separates the staging build from the production build', async () => {
    const pkg = JSON.parse(await readFile('package.json', 'utf8'));
    const buildProduction = await readFile('scripts/build-production.mjs', 'utf8');

    // Plain `build` must never be the production path.
    expect(pkg.scripts.build).not.toContain('wrangler.production.jsonc');
    expect(pkg.scripts['build:production']).toBe('node scripts/build-production.mjs');

    // The production build is only "production" because of this env var.
    expect(buildProduction).toContain("WRANGLER_CONFIG_PATH: 'wrangler.production.jsonc'");
  });

  it('documents the local production deploy with a manifest-name assertion', async () => {
    const runbook = await readFile('DEPLOYMENT-RUNBOOK.md', 'utf8');

    expect(runbook).toContain('npm run build:production');
    expect(runbook).toContain('deploy --config dist/server/wrangler.json --keep-vars --dry-run');
    expect(runbook).toContain('build-static-asset-proof.mjs');
    expect(runbook).toContain('--target production --asset-proof');

    // The guard against deploying the staging worker by accident.
    expect(runbook).toContain('parent-coach-desk-staging');
    expect(runbook).toMatch(/must print `parent-coach-desk`/);

    // The retired Pages path must never come back: it reports success without
    // changing the live site (confirmed 2026-07-22).
    expect(runbook).not.toMatch(/wrangler\s+pages\s+deploy\s+\S+\s+--project-name/i);
  });

  it('requires the asset proof argument the smoke test cannot run without', async () => {
    const smoke = await readFile('scripts/smoke-worker-deployment.mjs', 'utf8');
    expect(smoke).toContain("valueAfter(argv, '--asset-proof')");
    expect(smoke).toMatch(/usage: smoke-worker-deployment\.mjs/);
  });

  it('declares production runtime secret names without values and keeps staging optional', async () => {
    const [production, staging] = await Promise.all([
      readFile('wrangler.production.jsonc', 'utf8'),
      readFile('wrangler.jsonc', 'utf8'),
    ]);
    const expected = [
      'AGENT_RUNS_TOKEN',
      'BABYLOVE_API_KEY',
      'BABYLOVE_WEBHOOK_TOKEN',
      'BULK_IMPORT_TOKEN',
      'CRON_KEY',
      'GITHUB_TOKEN',
    ];
    expect(production).toContain('"secrets"');
    for (const name of expected) expect(production).toContain(`"${name}"`);
    expect(staging).not.toContain('"secrets"');
    expect(production).not.toMatch(/(?:AGENT_RUNS_TOKEN|BABYLOVE_API_KEY|BABYLOVE_WEBHOOK_TOKEN|BULK_IMPORT_TOKEN|CRON_KEY|GITHUB_TOKEN)"\s*:\s*"/);
  });
});
