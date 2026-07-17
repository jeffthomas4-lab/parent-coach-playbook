import { describe, expect, it } from 'vitest';
import inventory from '../automation/route-control-inventory.json';
import { execFileSync } from 'node:child_process';

describe('route control inventory', () => {
  it('is regenerated whenever source routes change', () => {
    expect(() => execFileSync(process.execPath, ['scripts/build-route-control-inventory.mjs', '--check'], {
      cwd: new URL('..', import.meta.url),
      stdio: 'pipe',
    })).not.toThrow();
  });

  it('contains no unclassified cache or authorization boundary', () => {
    expect(inventory.route_count).toBe(inventory.routes.length);
    expect(inventory.routes.length).toBeGreaterThan(100);
    for (const route of inventory.routes) {
      expect(route.cache_class, route.source).not.toBe('unclassified');
      expect(route.auth_boundary, route.source).not.toBe('unclassified');
    }
  });

  it('requires an explicit limiter review for every anonymous POST', () => {
    const missing = inventory.routes.filter((route) =>
      route.auth_boundary === 'public'
      && route.methods.includes('POST')
      && route.public_write_limiter === 'MISSING_REVIEW');
    expect(missing.map((route) => route.route)).toEqual([]);
  });

  it('never classifies protected routes as public HTML', () => {
    for (const route of inventory.routes.filter((entry) => entry.auth_boundary !== 'public')) {
      expect(route.cache_class, route.route).not.toBe('public_html');
    }
  });
});
