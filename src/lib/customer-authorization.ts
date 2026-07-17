export type CustomerStatus = 'active' | 'suspended' | 'deactivation_pending' | 'deactivated';
export type OrganizationStatus = 'pending' | 'active' | 'suspended' | 'closed';
export type MembershipStatus = 'invited' | 'active' | 'suspended' | 'revoked';
export type OrganizationRole = 'owner' | 'admin' | 'editor' | 'viewer';
export type OrganizationAction = 'view' | 'propose_edit' | 'manage_members' | 'manage_organization';

export interface CustomerPrincipal {
  customerUserId: string;
  status: CustomerStatus;
  authenticatedAt: string;
}

export interface OrganizationMembership {
  customerUserId: string;
  organizationId: string;
  organizationStatus: OrganizationStatus;
  membershipStatus: MembershipStatus;
  role: OrganizationRole;
}

const ACTION_ROLES: Record<OrganizationAction, ReadonlySet<OrganizationRole>> = {
  view: new Set(['owner', 'admin', 'editor', 'viewer']),
  propose_edit: new Set(['owner', 'admin', 'editor']),
  manage_members: new Set(['owner', 'admin']),
  manage_organization: new Set(['owner']),
};

export type AuthorizationDecision =
  | { allowed: true; role: OrganizationRole }
  | { allowed: false; reason: 'user_inactive' | 'tenant_inactive' | 'membership_missing' | 'membership_inactive' | 'role_denied' };

export function authorizeOrganizationAction(input: {
  principal: CustomerPrincipal;
  organizationId: string;
  action: OrganizationAction;
  memberships: readonly OrganizationMembership[];
}): AuthorizationDecision {
  if (input.principal.status !== 'active') return { allowed: false, reason: 'user_inactive' };

  const membership = input.memberships.find((candidate) =>
    candidate.customerUserId === input.principal.customerUserId
    && candidate.organizationId === input.organizationId
  );
  if (!membership) return { allowed: false, reason: 'membership_missing' };
  if (membership.organizationStatus !== 'active') return { allowed: false, reason: 'tenant_inactive' };
  if (membership.membershipStatus !== 'active') return { allowed: false, reason: 'membership_inactive' };
  if (!ACTION_ROLES[input.action].has(membership.role)) return { allowed: false, reason: 'role_denied' };
  return { allowed: true, role: membership.role };
}

export function validateMembershipChange(input: {
  actor: CustomerPrincipal;
  organizationId: string;
  actorMemberships: readonly OrganizationMembership[];
  targetCustomerUserId: string;
  targetRole: OrganizationRole;
  activeOwnerCount: number;
  operation: 'grant' | 'change_role' | 'revoke';
  currentTargetRole?: OrganizationRole;
}): 'authorized' | 'deny_self_escalation' | 'deny_last_owner' | 'denied' {
  const decision = authorizeOrganizationAction({
    principal: input.actor,
    organizationId: input.organizationId,
    action: 'manage_members',
    memberships: input.actorMemberships,
  });
  if (!decision.allowed) return 'denied';

  const selfChange = input.targetCustomerUserId === input.actor.customerUserId;
  if (selfChange && decision.role !== 'owner' && input.targetRole === 'owner') return 'deny_self_escalation';

  const removesOwner = input.currentTargetRole === 'owner'
    && (input.operation === 'revoke' || input.targetRole !== 'owner');
  if (removesOwner && input.activeOwnerCount <= 1) return 'deny_last_owner';
  return 'authorized';
}

export function providerClaimsGrantNoAccess(_claims: Readonly<Record<string, unknown>>): readonly OrganizationMembership[] {
  return [];
}
