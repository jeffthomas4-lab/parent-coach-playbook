import { describe, expect, it } from 'vitest';
import type { D1Database, D1PreparedStatement } from '@cloudflare/workers-types';
import { createOwnerClaim, createProposedEdit, decideOwnerClaim, submitOwnerClaim, transitionProposedEditByCustomer, transitionProposedEditByStaff } from '../src/lib/owner-store';

function dbWithChanges(values: number[], sql: string[]): D1Database {
  const prepared = (query: string) => {
    sql.push(query);
    const value = { bind: () => value };
    return value as unknown as D1PreparedStatement;
  };
  return { prepare: prepared, batch: async () => values.map((changes) => ({ success: true, meta: { changes } })) } as unknown as D1Database;
}

describe('owner D1 store', () => {
  it('couples claim creation/submission to active internal authorization and audit events', async () => {
    const sql: string[] = [];
    const db = dbWithChanges([1, 1], sql);
    await expect(createOwnerClaim(db, { claimId: 'claim-1', eventId: 'event-1', customerUserId: 'user-1', customerOrganizationId: 'org-1', directoryOrganizationRef: 'directory-org-1', occurredAt: '2026-07-16T00:00:00Z', idempotencyKey: 'create-1' })).resolves.toBe('created');
    expect(sql.join('\n')).toContain("m.status = 'active'");
    expect(sql.join('\n')).toContain("u.status = 'active'");
    expect(sql.join('\n')).toContain("o.status = 'active'");
    await expect(submitOwnerClaim(db, { claimId: 'claim-1', eventId: 'event-2', customerUserId: 'user-1', occurredAt: '2026-07-16T01:00:00Z', idempotencyKey: 'submit-1', expectedFromStatus: 'draft' })).resolves.toBe('created');
  });

  it('denies coherently when authorization or verified ownership is absent', async () => {
    const sql: string[] = [];
    await expect(createOwnerClaim(dbWithChanges([0, 0], sql), { claimId: 'claim-1', eventId: 'event-1', customerUserId: 'user-x', customerOrganizationId: 'org-1', directoryOrganizationRef: 'directory-org-1', occurredAt: '2026-07-16T00:00:00Z', idempotencyKey: 'create-1' })).resolves.toBe('denied');
  });

  it('requires a valid bounded patch and verified claim for proposed edits', async () => {
    const base = { proposedEditId: 'edit-1', eventId: 'event-1', customerUserId: 'user-1', customerOrganizationId: 'org-1', directoryOrganizationRef: 'directory-org-1', baseRecordSha256: 'a'.repeat(64), proposedPatchSha256: 'b'.repeat(64), occurredAt: '2026-07-16T00:00:00Z', idempotencyKey: 'edit-1', allowedFields: new Set(['display_name']), immutableFields: new Set(['paid_status']) };
    await expect(createProposedEdit(dbWithChanges([1, 1], []), { ...base, proposedPatch: { display_name: 'Updated camp' } })).resolves.toBe('created');
    await expect(createProposedEdit(dbWithChanges([1, 1], []), { ...base, proposedPatch: { paid_status: 'active' } })).resolves.toBe('invalid_patch');
  });

  it('couples staff claim and edit decisions to immutable events', async () => {
    await expect(decideOwnerClaim(dbWithChanges([1, 1], []), { claimId: 'claim-1', eventId: 'event-1', verifiedStaffRef: 'staff:1', expectedFromStatus: 'under_review', decision: 'verified', reasonCode: 'domain_control', occurredAt: '2026-07-16T00:00:00Z', idempotencyKey: 'decision-1' })).resolves.toBe('created');
    await expect(decideOwnerClaim(dbWithChanges([1, 1], []), { claimId: 'claim-1', eventId: 'event-1', verifiedStaffRef: '', expectedFromStatus: 'under_review', decision: 'verified', reasonCode: 'domain_control', occurredAt: '2026-07-16T00:00:00Z', idempotencyKey: 'decision-1' })).resolves.toBe('denied');
    await expect(transitionProposedEditByStaff(dbWithChanges([1, 1], []), { proposedEditId: 'edit-1', eventId: 'event-2', verifiedStaffRef: 'staff:1', expectedFromStatus: 'under_review', nextStatus: 'approved', reasonCode: 'supported', occurredAt: '2026-07-16T00:00:00Z', idempotencyKey: 'edit-decision-1' })).resolves.toBe('created');
    await expect(transitionProposedEditByCustomer(dbWithChanges([0, 0], []), { proposedEditId: 'edit-1', eventId: 'event-2', customerUserId: 'user-1', expectedFromStatus: 'submitted', nextStatus: 'withdrawn', reasonCode: 'withdraw', occurredAt: '2026-07-16T00:00:00Z', idempotencyKey: 'edit-withdraw-1' })).resolves.toBe('denied');
  });

  it('rejects invalid state transitions before any owner workflow write', async () => {
    const sql: string[] = [];
    await expect(decideOwnerClaim(dbWithChanges([1, 1], sql), {
      claimId: 'claim-1', eventId: 'event-invalid-claim', verifiedStaffRef: 'staff:1',
      expectedFromStatus: 'under_review', decision: 'suspended', reasonCode: 'invalid_path',
      occurredAt: '2026-07-16T00:00:00Z', idempotencyKey: 'invalid-claim-transition',
    })).resolves.toBe('denied');
    await expect(transitionProposedEditByStaff(dbWithChanges([1, 1], sql), {
      proposedEditId: 'edit-1', eventId: 'event-invalid-edit', verifiedStaffRef: 'staff:1',
      expectedFromStatus: 'submitted', nextStatus: 'approved', reasonCode: 'invalid_path',
      occurredAt: '2026-07-16T00:00:00Z', idempotencyKey: 'invalid-edit-transition',
    })).resolves.toBe('denied');
    expect(sql).toEqual([]);
  });
});
