import { describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const read = (path: string) => readFile(new URL(path, root), 'utf8');

describe('disposable WorkOS AuthKit proof boundary', () => {
  it('is compile-time disabled unless the exact proof flag is true', async () => {
    const config = await read('astro.config.mjs');
    const productionBuild = await read('scripts/build-production.mjs');
    expect(config).toContain("process.env.PCD_OWNER_AUTH_PROOF_ENABLED === 'true'");
    expect(config).toContain('integrations: ownerAuthProofEnabled');
    expect(productionBuild).toContain("PCD_OWNER_AUTH_PROOF_ENABLED: 'false'");
  });

  it('uses isolated proof routes and never treats provider organization claims as PCD authorization', async () => {
    const config = await read('astro.config.mjs');
    const page = await read('src/pages/owner-proof/dashboard.astro');
    expect(config).toContain("protectedRoutes: ['/owner-proof/dashboard(.*)']");
    expect(config).not.toContain("protectedRoutes: ['/admin");
    expect(page).toContain("import.meta.env.PCD_OWNER_AUTH_PROOF_ENABLED !== 'true'");
    expect(page).toContain("status: 404");
    expect(page).toContain('No organization access is granted by this page.');
    expect(page).not.toMatch(/organizationId|organization_id|auth\.role|auth\.permissions/);
  });

  it('keeps the proof non-indexable and non-cacheable', async () => {
    const page = await read('src/pages/owner-proof/dashboard.astro');
    expect(page).toContain("'Cache-Control': 'private, no-store'");
    expect(page).toContain("'X-Robots-Tag': 'noindex, nofollow'");
    expect(page).toContain('<meta name="robots" content="noindex,nofollow" />');
  });

  it('records compile evidence without claiming provider selection or runtime proof', async () => {
    const receipt = JSON.parse(
      await read('coordination/release-evidence/workos-authkit-local-proof-2026-07-16.json'),
    );
    expect(receipt.decision).toBe('partial_compile_only');
    expect(receipt.provider_selected).toBe(false);
    expect(receipt.production_authority).toBe(false);
    expect(receipt.external_changes).toEqual([]);
    expect(receipt.not_verified).toContain('real credentials or network authentication');
    expect(receipt.not_verified).toContain('Worker runtime login and callback');
  });
});
