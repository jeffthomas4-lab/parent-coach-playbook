import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

// Guards the whole server-rendered /admin surface against a specific
// fail-closed regression: calling requireAdmin(Astro.request) WITHOUT the
// Cloudflare runtime env. With no env, accessVerificationConfigured() sees
// `undefined`, refuses authentication, and every request to that page 503s —
// a page that can never let an authorized admin in. operations.astro and
// retention.astro both shipped with exactly this bug; this test makes its
// return impossible and pins named coverage for those two pages.

const root = path.resolve(import.meta.dirname, '..');
const adminDir = path.join(root, 'src/pages/admin');
const rel = (f: string) => path.relative(root, f).replaceAll('\\', '/');

function astroFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? astroFiles(full) : entry.name.endsWith('.astro') ? [full] : [];
  });
}

// Server-rendered admin pages that gate on requireAdmin(Astro.request, ...).
const ssrAdminPages = astroFiles(adminDir).filter((file) => {
  const src = fs.readFileSync(file, 'utf8');
  return /export const prerender = false/.test(src) && /requireAdmin\(\s*Astro\.request/.test(src);
});

describe('admin SSR pages pass the runtime env to requireAdmin', () => {
  it('discovers the SSR admin pages that gate on requireAdmin', () => {
    expect(ssrAdminPages.length).toBeGreaterThan(10);
  });

  it('never calls requireAdmin(Astro.request) without the runtime env (would 503 forever)', () => {
    const offenders = ssrAdminPages
      .filter((file) => /requireAdmin\(\s*Astro\.request\s*\)/.test(fs.readFileSync(file, 'utf8')))
      .map(rel)
      .sort();
    expect(offenders).toEqual([]);
  });

  it.each([
    'src/pages/admin/operations.astro',
    'src/pages/admin/retention.astro',
  ])('passes a runtime env to requireAdmin in %s', (relative) => {
    const src = fs.readFileSync(path.join(root, relative), 'utf8');
    expect(/requireAdmin\(\s*Astro\.request\s*,\s*env\b/.test(src)).toBe(true);
    // env must be resolved before the auth call, or it is undefined at call time.
    expect(src.indexOf('const env =')).toBeLessThan(src.indexOf('requireAdmin('));
  });
});
