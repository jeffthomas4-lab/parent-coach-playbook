import type { CustomerPrincipal } from './customer-authorization';

export interface CustomerFoundationPrincipal extends CustomerPrincipal {
  authenticationProvider: string;
}

export type CustomerFoundationGate =
  | { allowed: true; principal: CustomerFoundationPrincipal }
  | { allowed: false; status: 404 | 401; code: 'customer_foundation_disabled' | 'customer_authentication_required' };

/**
 * Deliberately accepts a server-populated local value only. This function never
 * reads request headers, cookies, query parameters, or provider role claims.
 * A selected provider middleware must verify those inputs before it assigns the
 * internal customer principal to Astro.locals.
 */
export function requireCustomerFoundation(input: {
  enabled: string | undefined;
  localPrincipal: unknown;
}): CustomerFoundationGate {
  if (input.enabled !== 'true') return { allowed: false, status: 404, code: 'customer_foundation_disabled' };
  const value = input.localPrincipal as Partial<CustomerFoundationPrincipal> | null;
  if (!value || typeof value !== 'object'
    || typeof value.customerUserId !== 'string' || !value.customerUserId.trim()
    || value.status !== 'active'
    || typeof value.authenticationProvider !== 'string' || !value.authenticationProvider.trim()
    || typeof value.authenticatedAt !== 'string' || !value.authenticatedAt.trim()) {
    return { allowed: false, status: 401, code: 'customer_authentication_required' };
  }
  return { allowed: true, principal: value as CustomerFoundationPrincipal };
}
