import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

describe('deployment authority', () => {
  it('retires the legacy guide without losing the canonical pointers', async () => {
    const legacy = await readFile('DEPLOY.md', 'utf8');
    expect(legacy).toContain('Historical deployment guide — retired');
    expect(legacy).toContain('DEPLOYMENT-RUNBOOK.md');
    expect(legacy).toContain('.github/workflows/deploy-workers.yml');
    expect(legacy).not.toMatch(/Remove-Item[^\n]*\.git|rm\s+-rf\s+\.git|wrangler\s+pages\s+deploy|Connect Cloudflare Pages to the repo/i);
  });

  it('keeps one generated-manifest, same-SHA, protected production workflow', async () => {
    const workflow = await readFile('.github/workflows/deploy-workers.yml', 'utf8');
    expect(workflow).toContain('group: parent-coach-desk-production');
    expect(workflow).toContain('cancel-in-progress: false');
    expect(workflow).toContain('DEPLOY_SHA: ${{ inputs.commit_sha || github.sha }}');
    expect(workflow).toContain('git merge-base --is-ancestor "$DEPLOY_SHA" origin/main');
    expect(workflow).toContain('name: production');
    expect(workflow).toContain('npm run check:access-evidence:production');
    expect(workflow).toContain('name: pcd-production-${{ env.DEPLOY_SHA }}');
    expect(workflow).toContain('test "$(cat production-dist.git-sha)" = "$DEPLOY_SHA"');
    expect(workflow).toContain('deploy --config dist/server/wrangler.json --keep-vars --dry-run');
    expect(workflow).toContain('--target production --report production-smoke.json');
    expect(workflow).toContain('pcd-production-smoke-${{ env.DEPLOY_SHA }}');
    expect(workflow).not.toMatch(/wrangler\s+pages|git\s+add\s+-A|checkout[^\n]*refs\/heads\/main/i);
  });

  it('declares production runtime secret names without values and keeps staging optional', async () => {
    const [production, staging] = await Promise.all([
      readFile('wrangler.production.jsonc', 'utf8'),
      readFile('wrangler.jsonc', 'utf8'),
    ]);
    const expected = ['AGENT_RUNS_TOKEN', 'BULK_IMPORT_TOKEN', 'CRON_KEY', 'GITHUB_TOKEN'];
    expect(production).toContain('"secrets"');
    for (const name of expected) expect(production).toContain(`"${name}"`);
    expect(staging).not.toContain('"secrets"');
    expect(production).not.toMatch(/(?:AGENT_RUNS_TOKEN|BULK_IMPORT_TOKEN|CRON_KEY|GITHUB_TOKEN)"\s*:\s*"/);
  });
});
