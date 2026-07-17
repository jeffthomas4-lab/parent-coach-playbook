export type CommerceOrderState = 'pending' | 'paid' | 'fulfillment_pending' | 'fulfilled' | 'cancelled' | 'refunded' | 'disputed';
export type CommerceEntitlementState = 'pending' | 'active' | 'suspended' | 'revoked' | 'expired';

const ORDER_TRANSITIONS: Record<CommerceOrderState, ReadonlySet<CommerceOrderState>> = {
  pending: new Set(['paid', 'cancelled']),
  paid: new Set(['fulfillment_pending', 'refunded', 'disputed']),
  fulfillment_pending: new Set(['fulfilled', 'refunded', 'disputed']),
  fulfilled: new Set(['refunded', 'disputed']),
  cancelled: new Set(), refunded: new Set(), disputed: new Set(['refunded']),
};

export function canTransitionOrder(from: CommerceOrderState, to: CommerceOrderState): boolean {
  return ORDER_TRANSITIONS[from].has(to);
}

export function mayGrantEntitlement(input: {
  orderState: CommerceOrderState;
  entitlementState: CommerceEntitlementState;
  actorType: 'customer' | 'staff' | 'provider' | 'system';
  providerPaymentVerified: boolean;
  productCode: string;
}): 'authorized' | 'payment_not_verified' | 'invalid_order_state' | 'invalid_entitlement_state' | 'customer_cannot_grant' | 'product_required' {
  if (!input.productCode.trim()) return 'product_required';
  if (input.actorType === 'customer') return 'customer_cannot_grant';
  if (!input.providerPaymentVerified) return 'payment_not_verified';
  if (!['paid', 'fulfillment_pending', 'fulfilled'].includes(input.orderState)) return 'invalid_order_state';
  if (input.entitlementState !== 'pending') return 'invalid_entitlement_state';
  return 'authorized';
}

export function commercialFactsMayAffectDirectory(input: {
  target: 'entitlement' | 'paid_disclosure' | 'organic_rank' | 'directory_verification' | 'editorial_judgment';
}): boolean {
  return input.target === 'entitlement' || input.target === 'paid_disclosure';
}
