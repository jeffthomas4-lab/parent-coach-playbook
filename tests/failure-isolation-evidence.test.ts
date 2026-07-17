import { describe, expect, it } from 'vitest';
import evidence from '../coordination/release-evidence/integrated-failure-isolation-2026-07-16.json';
import pending from '../coordination/release-evidence/notification-receipt-pending.json';
import { validateFailureIsolationEvidence } from '../scripts/failure-isolation-evidence.mjs';
import { validateNotificationReceipt } from '../scripts/notification-receipt.mjs';

describe('failure isolation and notification receipt contracts', () => {
  it('accepts local isolation evidence without closing environment gates', () => {
    expect(validateFailureIsolationEvidence(evidence)).toEqual({ errors: [], valid: true });
  });

  it('keeps the notification receipt valid but explicitly unreceived', () => {
    expect(validateNotificationReceipt(pending)).toEqual({ errors: [], valid: true, received: false });
  });

  it('requires provider and human evidence before receipt can pass', () => {
    const claimed = { ...pending, state: 'received', sent_at: '2026-07-16T13:46:00Z', received_at: '2026-07-16T13:47:00Z' };
    expect(validateNotificationReceipt(claimed).errors).toEqual(expect.arrayContaining([
      'recipient_role is required when received', 'provider_event_id is required when received',
      'acknowledgement_reference is required when received', 'received drill requires Jeff Thomas approval',
    ]));
  });
});
