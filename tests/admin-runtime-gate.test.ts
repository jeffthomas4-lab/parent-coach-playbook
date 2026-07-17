import { describe, expect, it, vi } from 'vitest';
import {
  enforceAdministrativeRequest,
  isAdministrativePath,
} from '../src/lib/admin-runtime-gate';

describe('administrative runtime gate', () => {
  it.each(['/admin', '/admin/', '/admin/preview/a/b', '/api/admin', '/api/admin/publish'])(
    'classifies %s as administrative',
    (path) => expect(isAdministrativePath(path)).toBe(true),
  );

  it.each(['/administrator', '/api/administration', '/camps/', '/api/health'])(
    'does not overmatch %s',
    (path) => expect(isAdministrativePath(path)).toBe(false),
  );

  it('fails closed before serving a non-local administrative request', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const response = await enforceAdministrativeRequest(new Request('https://preview.example/admin/preview/a/b'), {});
    expect(response?.status).toBe(503);
    error.mockRestore();
  });

  it('allows public and explicit local development requests to continue', async () => {
    expect(await enforceAdministrativeRequest(new Request('https://preview.example/camps/'), {})).toBeNull();
    expect(await enforceAdministrativeRequest(new Request('http://localhost/admin/'), {})).toBeNull();
    expect(await enforceAdministrativeRequest(new Request('http://127.0.0.1/api/admin/test'), {})).toBeNull();
  });
});
