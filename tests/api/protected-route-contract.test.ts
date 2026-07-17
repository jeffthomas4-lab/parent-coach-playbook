import { describe, expect, it } from 'vitest';
import { verifyProtectedRouteSource } from '../../scripts/check-protected-routes.mjs';

describe('protected route source contract', () => {
  it('accepts static Access-only, authenticated read, and same-origin mutation routes', () => {
    expect(verifyProtectedRouteSource('export const prerender = true;', 'access-only')).toEqual([]);
    expect(verifyProtectedRouteSource('---\ntitle: Internal\n---', 'access-only', 'route.md')).toEqual([]);
    expect(verifyProtectedRouteSource('await requireAdmin(request, env);', 'app-auth')).toEqual([]);
    expect(verifyProtectedRouteSource(
      'await requireAdmin(request, env); requireSameOrigin(request);',
      'mutation',
    )).toEqual([]);
  });

  it('rejects an unprotected mutation and a dynamic Access-only route', () => {
    expect(verifyProtectedRouteSource('export const prerender = false;', 'mutation')).toEqual([
      'mutation route must call requireAdmin',
      'mutation route must call requireSameOrigin',
    ]);
    expect(verifyProtectedRouteSource('export const prerender = false;', 'access-only')).toEqual([
      'Access-only route must be statically rendered Markdown or declare prerender=true',
    ]);
  });
});
