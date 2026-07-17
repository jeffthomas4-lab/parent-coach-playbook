import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('Worker entrypoint protects prerendered administrative assets', () => {
  it.each(['wrangler.jsonc', 'wrangler.production.jsonc'])(
    '%s uses the guarded entrypoint and Worker-first administrative routes',
    (configPath) => {
      const config = readFileSync(configPath, 'utf8');
      expect(config).toMatch(/"main"\s*:\s*"\.\/src\/worker\.ts"/);
      for (const path of ['/admin', '/admin/*', '/api/admin', '/api/admin/*']) {
        expect(config).toContain(JSON.stringify(path));
      }
    },
  );

  it.each(['wrangler.jsonc', 'wrangler.production.jsonc'])(
    '%s limits the application administrator allowlist to the approved identities',
    (configPath) => {
      const config = readFileSync(configPath, 'utf8');
      expect(config).toContain('"ADMIN_EMAILS": "eepskalla@gmail.com,jeffthomas4@gmail.com"');
      expect(config).not.toContain('parentcoachplaybook@gmail.com');
    },
  );

  it('authenticates before delegating to the Astro asset handler', () => {
    const source = readFileSync('src/worker.ts', 'utf8');
    const gate = source.indexOf('await enforceAdministrativeRequest(request, env)');
    const delegate = source.indexOf('return astroWorker.fetch(request, env, context)');
    expect(source).toContain("from '@astrojs/cloudflare/entrypoints/server'");
    expect(gate).toBeGreaterThan(0);
    expect(delegate).toBeGreaterThan(gate);
  });
});
