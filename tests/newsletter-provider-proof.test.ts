import { describe, expect, it } from 'vitest';
import pending from '../coordination/release-evidence/newsletter-provider-proof-pending.json';
import { validateNewsletterProviderProof } from '../scripts/newsletter-provider-proof.mjs';

describe('newsletter provider proof contract', () => {
  it('accepts the redacted pending receipt without treating it as verified', () => {
    expect(validateNewsletterProviderProof(pending)).toEqual({ valid: true, verified: false, errors: [] });
  });

  it('requires end-to-end consent, confirmation, delivery, unsubscribe, suppression, failure, and redirect evidence', () => {
    const verified = {
      ...pending,
      state: 'verified', observed_at: '2026-07-18T09:00:00Z', test_run_id: 'kit-proof-redacted-1',
      provider_receipt_reference: 'kit-receipt-redacted-1', approved_by: 'Jeff Thomas',
      consent_notice_observed: true, confirmation_verified: true, welcome_delivery_verified: true,
      unsubscribe_verified: true, suppression_verified: true, failure_handling_verified: true, redirect_verified: true,
    };
    expect(validateNewsletterProviderProof(verified).verified).toBe(true);
    expect(validateNewsletterProviderProof({ ...verified, suppression_verified: false }).verified).toBe(false);
  });

  it('rejects unsafe hosts and evidence containing subscriber or secret material', () => {
    const result = validateNewsletterProviderProof({ ...pending, form_url: 'http://example.com', contains_subscriber_data: true, contains_secret_material: true });
    expect(result.valid).toBe(false);
    expect(result.errors.join(' ')).toMatch(/approved HTTPS Kit host|subscriber data|secret material/);
  });
});
