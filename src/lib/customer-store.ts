import type { D1Database, D1Result } from '@cloudflare/workers-types';
import type { OrganizationRole } from './customer-authorization';

function changes(result: D1Result<unknown> | undefined): number {
  return Number(result?.meta?.changes ?? 0);
}

export async function acceptCustomerInvitation(db: D1Database, input: {
  invitationId: string;
  tokenSha256: string;
  authenticatedCustomerUserId: string;
  authenticatedEmailNormalized: string;
  membershipId: string;
  acceptedAt: string;
}): Promise<'accepted' | 'not_eligible'> {
  const membership = db.prepare(
    `INSERT INTO organization_memberships
       (id, organization_id, customer_user_id, role, status,
        granted_by_customer_user_id, granted_at, version)
     SELECT ?1, organization_id, ?2, proposed_role, 'active',
            invited_by_customer_user_id, ?3, 1
       FROM customer_invitations
      WHERE id = ?4 AND token_sha256 = ?5 AND status = 'pending'
        AND expires_at > ?3 AND invited_email_normalized = ?6`,
  ).bind(input.membershipId, input.authenticatedCustomerUserId, input.acceptedAt,
    input.invitationId, input.tokenSha256, input.authenticatedEmailNormalized);

  const consume = db.prepare(
    `UPDATE customer_invitations
        SET status = 'accepted', accepted_at = ?1,
            accepted_by_customer_user_id = ?2
      WHERE id = ?3 AND token_sha256 = ?4 AND status = 'pending'
        AND expires_at > ?1 AND invited_email_normalized = ?5`,
  ).bind(input.acceptedAt, input.authenticatedCustomerUserId, input.invitationId,
    input.tokenSha256, input.authenticatedEmailNormalized);

  const [membershipResult, invitationResult] = await db.batch([membership, consume]);
  if (changes(membershipResult) === 1 && changes(invitationResult) === 1) return 'accepted';
  if (changes(membershipResult) === 0 && changes(invitationResult) === 0) return 'not_eligible';
  throw new Error('invitation acceptance invariant violated');
}

export async function recordIdentityProviderEvent(db: D1Database, input: {
  id: string;
  providerCode: string;
  providerEventId: string;
  eventType: string;
  payloadSha256: string;
  signatureVerifiedAt: string;
  receivedAt: string;
}): Promise<'created' | 'replay' | 'payload_conflict'> {
  const existing = await db.prepare(
    `SELECT payload_sha256 FROM identity_provider_events
      WHERE provider_code = ?1 AND provider_event_id = ?2`,
  ).bind(input.providerCode, input.providerEventId).first<{ payload_sha256: string }>();
  if (existing) return existing.payload_sha256 === input.payloadSha256 ? 'replay' : 'payload_conflict';

  try {
    const result = await db.prepare(
      `INSERT INTO identity_provider_events
         (id, provider_code, provider_event_id, event_type, payload_sha256,
          signature_verified_at, received_at, processing_status, attempts)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, 'pending', 0)`,
    ).bind(input.id, input.providerCode, input.providerEventId, input.eventType,
      input.payloadSha256, input.signatureVerifiedAt, input.receivedAt).run();
    if (changes(result) === 1) return 'created';
  } catch {
    const raced = await db.prepare(
      `SELECT payload_sha256 FROM identity_provider_events
        WHERE provider_code = ?1 AND provider_event_id = ?2`,
    ).bind(input.providerCode, input.providerEventId).first<{ payload_sha256: string }>();
    if (raced) return raced.payload_sha256 === input.payloadSha256 ? 'replay' : 'payload_conflict';
    throw new Error('identity provider event persistence failed');
  }
  throw new Error('identity provider event insert changed no rows');
}

export async function listAuthorizedOrganizations(db: D1Database, customerUserId: string): Promise<Array<{
  organizationId: string;
  displayName: string;
  role: OrganizationRole;
}>> {
  const result = await db.prepare(
    `SELECT o.id AS organizationId, o.display_name AS displayName, m.role
       FROM organization_memberships m
       JOIN customer_organizations o ON o.id = m.organization_id
       JOIN customer_users u ON u.id = m.customer_user_id
      WHERE m.customer_user_id = ?1 AND m.status = 'active'
        AND o.status = 'active' AND u.status = 'active'
      ORDER BY o.display_name, o.id`,
  ).bind(customerUserId).all<{ organizationId: string; displayName: string; role: OrganizationRole }>();
  return result.results ?? [];
}
