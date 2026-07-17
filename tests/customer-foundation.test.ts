import { describe, expect, it } from 'vitest';
import { requireCustomerFoundation } from '../src/lib/customer-foundation';

describe('customer foundation route gate', () => {
  const principal = { customerUserId: 'user-1', status: 'active' as const, authenticatedAt: '2026-07-16T00:00:00Z', authenticationProvider: 'disposable' };

  it('is hidden unless the exact feature flag is enabled', () => {
    expect(requireCustomerFoundation({ enabled: undefined, localPrincipal: principal })).toEqual({ allowed: false, status: 404, code: 'customer_foundation_disabled' });
    expect(requireCustomerFoundation({ enabled: 'TRUE', localPrincipal: principal })).toEqual({ allowed: false, status: 404, code: 'customer_foundation_disabled' });
  });

  it('requires a server-verified active internal principal', () => {
    expect(requireCustomerFoundation({ enabled: 'true', localPrincipal: null })).toEqual({ allowed: false, status: 401, code: 'customer_authentication_required' });
    expect(requireCustomerFoundation({ enabled: 'true', localPrincipal: { ...principal, status: 'suspended' } })).toEqual({ allowed: false, status: 401, code: 'customer_authentication_required' });
    expect(requireCustomerFoundation({ enabled: 'true', localPrincipal: principal })).toEqual({ allowed: true, principal });
  });
});
