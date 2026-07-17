import { randomUUID } from 'node:crypto';
import { pathToFileURL } from 'node:url';

// This is intentionally a fixed, non-production target. It exercises the
// ordinary public-submission notification path with synthetic data, rather
// than adding a reusable send-email endpoint to the customer application.
export const STAGING_ORIGIN = 'https://parent-coach-desk-staging.eepskalla.workers.dev';

function drillSuffix(now) {
  return now.toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
}

export async function runStagingNotificationDrill({
  confirmed = false,
  fetchImpl = fetch,
  now = () => new Date(),
  idempotencyKey = `pcd-notification-drill-${randomUUID()}`,
} = {}) {
  if (!confirmed) {
    throw new Error('Refusing to send a notification drill without confirmed=true.');
  }
  if (!idempotencyKey.startsWith('pcd-notification-drill-')) {
    throw new Error('Notification-drill idempotency key must use the pcd-notification-drill- prefix.');
  }

  const suffix = drillSuffix(now());
  const payload = {
    name: `PCD notification drill ${suffix}`,
    sport: 'administrative test',
    age_min: '8',
    age_max: '12',
    start_date: '2030-08-01',
    end_date: '2030-08-02',
    address: '1 Staging Drill Way',
    city: 'Tacoma',
    state: 'WA',
    zip: '98402',
    description: 'Synthetic staging notification drill. This is not a real camp or customer submission.',
    submitted_by_email: 'notification-drill@invalid.test',
    idempotency_key: idempotencyKey,
  };

  const response = await fetchImpl(`${STAGING_ORIGIN}/api/camps/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey,
      'User-Agent': 'pcd-staging-notification-drill/1',
    },
    body: JSON.stringify(payload),
  });
  const body = await response.json().catch(() => null);
  if (!response.ok || !body?.ok || body.status !== 'pending') {
    throw new Error(`Notification drill failed with HTTP ${response.status}.`);
  }

  return {
    schema_version: 1,
    environment: 'staging',
    target_origin: STAGING_ORIGIN,
    event_class: 'synthetic_camp_submission_notification_drill',
    idempotency_key: idempotencyKey,
    submitted_at: now().toISOString(),
    camp_id: body.id,
    camp_slug: body.slug,
    notification_expectation: 'one privacy-safe Slack routing post and one internal email to the first approved admin address',
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const confirmed = process.argv.includes('--confirm');
  const result = await runStagingNotificationDrill({ confirmed });
  console.log(JSON.stringify(result, null, 2));
}
