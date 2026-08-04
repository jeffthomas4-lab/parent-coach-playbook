import { describe, expect, it } from 'vitest';
import { normalizeGeneratedWranglerManifest } from '../scripts/normalize-generated-wrangler.mjs';

describe('generated Wrangler manifest compatibility', () => {
  it('removes the unsupported legacy_env field without changing deployment identity', () => {
    const normalized = normalizeGeneratedWranglerManifest({
      name: 'parent-coach-desk-staging',
      legacy_env: true,
      vars: { PUBLIC_SITE_URL: 'https://example.test' },
    });

    expect(normalized).toEqual({
      name: 'parent-coach-desk-staging',
      vars: { PUBLIC_SITE_URL: 'https://example.test' },
    });
  });

  it('leaves current manifests unchanged', () => {
    const manifest = { name: 'parent-coach-desk' };
    expect(normalizeGeneratedWranglerManifest(manifest)).toEqual(manifest);
  });
});
