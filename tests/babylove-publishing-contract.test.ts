import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');

describe('BabyLoveGrowth publishing contract', () => {
  it('exposes a useful llms.txt without private or administrative routes', () => {
    const llms = readFileSync(resolve(root, 'public/llms.txt'), 'utf8');
    expect(llms).toContain('# Parent Coach Desk');
    expect(llms).toContain('https://parentcoachdesk.com/reads/');
    expect(llms).toContain('https://parentcoachdesk.com/body/');
    expect(llms).not.toMatch(/\/admin\/|api\/|blog\.parentcoachdesk\.com/);
  });

  it('defines a receipt ledger with a provider-scoped idempotency key', () => {
    const migration = readFileSync(
      resolve(root, 'migrations-pcd-ops/0029_external_article_receipts.sql'),
      'utf8',
    );
    expect(migration).toMatch(/CREATE TABLE(?: IF NOT EXISTS)? external_article_receipts/i);
    expect(migration).toMatch(/UNIQUE\s*\(provider, provider_article_id, payload_sha256\)/i);
    expect(migration).toContain("'retryable_failure'");
    expect(migration).toContain("'quarantined'");
  });

  it('keeps the hosted subdomain out of Worker configuration', () => {
    const production = readFileSync(resolve(root, 'wrangler.production.jsonc'), 'utf8');
    const staging = readFileSync(resolve(root, 'wrangler.jsonc'), 'utf8');
    for (const config of [production, staging]) {
      expect(config).toContain('/api/integrations/babylovegrowth/articles');
      expect(config).not.toContain('blog.parentcoachdesk.com');
    }
  });

  it('normalizes governed evidence before deploying provider article commits', () => {
    const normalizer = readFileSync(
      resolve(root, '.github/workflows/babylove-normalize.yml'),
      'utf8',
    );
    const deploy = readFileSync(resolve(root, '.github/workflows/deploy-workers.yml'), 'utf8');

    expect(normalizer).toContain("startsWith(github.event.head_commit.message, 'Publish BabyLoveGrowth article ')");
    expect(normalizer).toContain('npm run report:editorial-refresh');
    expect(normalizer).toContain('reports/editorial/editorial-refresh-queue.json');
    expect(normalizer).toContain('secrets.BABYLOVE_PUBLISH_TOKEN');
    expect(normalizer).toContain('git push origin HEAD:main');
    expect(deploy).toContain("!startsWith(github.event.head_commit.message, 'Publish BabyLoveGrowth article ')");
  });
});
