import { describe, expect, it, vi } from 'vitest';
import { GET as healthGet, HEAD as healthHead } from '../../src/pages/api/health';
import { GET as readyGet } from '../../src/pages/api/ready';
import { makeContext, readJson } from '../helpers/context';

const request = (path: string) => new Request(`https://parentcoachdesk.com${path}`);

describe('public health endpoints', () => {
  it('reports process liveness without requiring any binding', async () => {
    const response = await healthGet(makeContext({ request: request('/api/health'), env: {} }));
    expect(response.status).toBe(200);
    expect(await readJson(response)).toEqual({ ok: true, service: 'parent-coach-desk', check: 'liveness' });
    expect(response.headers.get('Cache-Control')).toBe('no-store');
  });

  it('supports a bodyless liveness HEAD probe', async () => {
    const response = await healthHead(makeContext({ request: request('/api/health'), env: {} }));
    expect(response.status).toBe(200);
    expect(await response.text()).toBe('');
  });

  it('fails readiness closed when D1 is not bound', async () => {
    const response = await readyGet(makeContext({ request: request('/api/ready'), env: {} }));
    expect(response.status).toBe(503);
    expect(await readJson(response)).toMatchObject({ ok: false, code: 'db_binding_missing' });
  });

  it('fails readiness without leaking a D1 exception', async () => {
    const db = { prepare: vi.fn(() => ({ first: vi.fn().mockRejectedValue(new Error('secret internal detail')) })) };
    const response = await readyGet(makeContext({ request: request('/api/ready'), env: { DB: db } }));
    expect(response.status).toBe(503);
    expect(JSON.stringify(await readJson(response))).not.toContain('secret internal detail');
  });

  it('reports readiness only after the D1 probe succeeds', async () => {
    const db = { prepare: vi.fn(() => ({ first: vi.fn().mockResolvedValue({ ok: 1 }) })) };
    const response = await readyGet(makeContext({ request: request('/api/ready'), env: { DB: db } }));
    expect(response.status).toBe(200);
    expect(await readJson(response)).toEqual({ ok: true, service: 'parent-coach-desk', check: 'readiness' });
    expect(db.prepare).toHaveBeenCalledWith('SELECT 1 AS ok');
  });
});
