import { describe, expect, it } from 'vitest';
import {
  authorizeOrganizationAction,
  providerClaimsGrantNoAccess,
  validateMembershipChange,
  type CustomerPrincipal,
  type OrganizationMembership,
} from '../src/lib/customer-authorization';

const principal: CustomerPrincipal = { customerUserId: 'user-1', status: 'active', authenticatedAt: '2026-07-16T00:00:00Z' };
const membership = (overrides: Partial<OrganizationMembership> = {}): OrganizationMembership => ({
  customerUserId: 'user-1', organizationId: 'org-1', organizationStatus: 'active',
  membershipStatus: 'active', role: 'owner', ...overrides,
});

describe('customer organization authorization', () => {
  it('derives access from the exact active PCD membership', () => {
    expect(authorizeOrganizationAction({ principal, organizationId: 'org-1', action: 'manage_organization', memberships: [membership()] }))
      .toEqual({ allowed: true, role: 'owner' });
    expect(authorizeOrganizationAction({ principal, organizationId: 'org-2', action: 'view', memberships: [membership()] }))
      .toEqual({ allowed: false, reason: 'membership_missing' });
  });

  it('fails closed for inactive users, tenants, memberships, and insufficient roles', () => {
    expect(authorizeOrganizationAction({ principal: { ...principal, status: 'suspended' }, organizationId: 'org-1', action: 'view', memberships: [membership()] }).allowed).toBe(false);
    expect(authorizeOrganizationAction({ principal, organizationId: 'org-1', action: 'view', memberships: [membership({ organizationStatus: 'suspended' })] }).allowed).toBe(false);
    expect(authorizeOrganizationAction({ principal, organizationId: 'org-1', action: 'view', memberships: [membership({ membershipStatus: 'revoked' })] }).allowed).toBe(false);
    expect(authorizeOrganizationAction({ principal, organizationId: 'org-1', action: 'manage_members', memberships: [membership({ role: 'editor' })] })).toEqual({ allowed: false, reason: 'role_denied' });
  });

  it('does not convert provider claims into tenant grants', () => {
    expect(providerClaimsGrantNoAccess({ organization_id: 'org-1', role: 'owner', permissions: ['*'] })).toEqual([]);
  });

  it('blocks admin self-escalation and removal of the final owner', () => {
    expect(validateMembershipChange({ actor: principal, organizationId: 'org-1', actorMemberships: [membership({ role: 'admin' })], targetCustomerUserId: 'user-1', targetRole: 'owner', activeOwnerCount: 1, operation: 'change_role', currentTargetRole: 'admin' })).toBe('deny_self_escalation');
    expect(validateMembershipChange({ actor: principal, organizationId: 'org-1', actorMemberships: [membership()], targetCustomerUserId: 'user-1', targetRole: 'viewer', activeOwnerCount: 1, operation: 'change_role', currentTargetRole: 'owner' })).toBe('deny_last_owner');
  });
});
