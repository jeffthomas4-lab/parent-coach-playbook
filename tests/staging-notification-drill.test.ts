import { describe, expect, it, vi } from 'vitest';
import { runStagingNotificationDrill, STAGING_ORIGIN } from '../scripts/run-staging-notification-drill.mjs';

describe('staging notification drill', () => {
  it('requires an explicit confirmation before making a request', async () => {
    const fetchImpl = vi.fn();
    await expect(runStagingNotificationDrill({ fetchImpl })).rejects.toThrow('confirmed=true');
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('can target only the fixed staging Worker with a synthetic non-customer payload', async () => {
    const fetchImpl = vi.fn<typeof fetch>(async () => new Response(JSON.stringify({
      ok: true, id: 'camp_drill', slug: 'pcd-notification-drill', status: 'pending',
    }), { status: 200 }));
    const now = () => new Date('2030-01-02T03:04:05.000Z');

    const result = await runStagingNotificationDrill({
      confirmed: true,
      fetchImpl,
      now,
      idempotencyKey: 'pcd-notification-drill-test-1234',
    });

    expect(fetchImpl).toHaveBeenCalledOnce();
    const [url, init] = fetchImpl.mock.calls[0] ?? [];
    expect(url).toBe(`${STAGING_ORIGIN}/api/camps/submit`);
    if (!init || !init.headers || typeof init.body !== 'string') throw new Error('expected JSON request init');
    expect(new Headers(init.headers).get('Idempotency-Key')).toBe('pcd-notification-drill-test-1234');
    const payload = JSON.parse(init.body);
    expect(payload.submitted_by_email).toBe('notification-drill@invalid.test');
    expect(payload.description).toContain('Synthetic staging notification drill');
    expect(payload.address).toBe('1 Staging Drill Way 20300102030405');
    expect(payload.website_url).toBeUndefined();
    expect(result).toMatchObject({ environment: 'staging', camp_id: 'camp_drill' });
  });

  it('refuses an idempotency key that is not isolated to notification drills', async () => {
    await expect(runStagingNotificationDrill({
      confirmed: true,
      idempotencyKey: 'ordinary-submission-key',
    })).rejects.toThrow('pcd-notification-drill- prefix');
  });
});
