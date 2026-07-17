import { describe, expect, it } from 'vitest';
import { canTransitionOrder, commercialFactsMayAffectDirectory, mayGrantEntitlement } from '../src/lib/commerce-lifecycle';

describe('test-mode commerce lifecycle', () => {
  it('requires payment verification and non-customer authority before entitlement', () => {
    expect(mayGrantEntitlement({ orderState: 'paid', entitlementState: 'pending', actorType: 'provider', providerPaymentVerified: true, productCode: 'featured' })).toBe('authorized');
    expect(mayGrantEntitlement({ orderState: 'paid', entitlementState: 'pending', actorType: 'customer', providerPaymentVerified: true, productCode: 'featured' })).toBe('customer_cannot_grant');
    expect(mayGrantEntitlement({ orderState: 'pending', entitlementState: 'pending', actorType: 'system', providerPaymentVerified: false, productCode: 'featured' })).toBe('payment_not_verified');
  });

  it('allows only forward commercial order progression', () => {
    expect(canTransitionOrder('pending', 'paid')).toBe(true);
    expect(canTransitionOrder('paid', 'fulfilled')).toBe(false);
    expect(canTransitionOrder('fulfilled', 'paid')).toBe(false);
  });

  it('never makes payment a directory-truth or organic-ranking input', () => {
    expect(commercialFactsMayAffectDirectory({ target: 'entitlement' })).toBe(true);
    expect(commercialFactsMayAffectDirectory({ target: 'paid_disclosure' })).toBe(true);
    expect(commercialFactsMayAffectDirectory({ target: 'organic_rank' })).toBe(false);
    expect(commercialFactsMayAffectDirectory({ target: 'directory_verification' })).toBe(false);
    expect(commercialFactsMayAffectDirectory({ target: 'editorial_judgment' })).toBe(false);
  });
});
