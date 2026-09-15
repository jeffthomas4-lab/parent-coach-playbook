import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import type { D1Database } from '@cloudflare/workers-types';
import { createDisposableOpsDatabase } from './helpers/disposable-ops-db';
import { createDisposableIntelDatabase } from './helpers/disposable-intel-db';
import {
  dispatchPcdCrmBackfillBatch,
  dispatchPcdCrmOutbox,
  finalizePcdCrmBackfill,
  projectPcdCrmBackfill,
  projectPcdCrmEvents,
  reconcilePcdCrmBackfill,
  reconcilePcdCrmOutbox,
  runPcdCrmAdapter,
  type CrmAdapterFetcher,
  type PcdCrmAdapterEnv,
} from '../src/lib/crm-adapter';
import { setDoNotContact, softDeleteOrgContact, upsertOrgContact } from '../src/lib/org-contacts';

let opsResource: Awaited<ReturnType<typeof createDisposableOpsDatabase>>;
let intelResource: Awaited<ReturnType<typeof createDisposableIntelDatabase>>;

beforeAll(async () => {
  opsResource = await createDisposableOpsDatabase(`crm-adapter-${crypto.randomUUID()}`);
  intelResource = await createDisposableIntelDatabase();
}, 30_000);

beforeEach(async () => {
  await opsResource.db.batch([
    opsResource.db.prepare('DELETE FROM crm_adapter_reconciliation_receipts'),
    opsResource.db.prepare('DELETE FROM crm_adapter_projection_receipts'),
    opsResource.db.prepare('DELETE FROM crm_adapter_outbox'),
    opsResource.db.prepare('DELETE FROM crm_adapter_backfill_reconciliation_windows'),
    opsResource.db.prepare('DELETE FROM crm_adapter_backfill_subjects'),
    opsResource.db.prepare('DELETE FROM crm_adapter_backfill_chunks'),
    opsResource.db.prepare('DELETE FROM crm_adapter_backfill_runs'),
    opsResource.db.prepare('DELETE FROM crm_adapter_controls'),
    opsResource.db.prepare('DELETE FROM org_contacts'),
  ]);
  await intelResource.db.prepare('DELETE FROM organizations').run();
});

afterEach(async () => {
  vi.restoreAllMocks();
});

afterAll(async () => {
  await opsResource?.mf.dispose();
  intelResource?.sqlite.close();
});

async function databases() {
  return { ops: opsResource.db, intel: intelResource.db };
}

function env(ops: D1Database, intel: D1Database, extra: Partial<PcdCrmAdapterEnv> = {}): PcdCrmAdapterEnv {
  return {
    DB: intel,
    PCD_OPS_DB: ops,
    PCD_CRM_ADAPTER_ENABLED: 'true',
    PCD_CRM_ADAPTER_HMAC_SECRET: 'test-pcd-adapter-secret',
    PCD_CRM_PRODUCER_WORKSPACE_ID: 'pcd-activity-radar',
    PCD_CRM_TARGET_WORKSPACE_ID: 'ws-sightsmash',
    PCD_CRM_SOURCE_ID: 'source-test',
    PCD_CRM_SOURCE_NOT_BEFORE_MS: '1000',
    PCD_CRM_BACKFILL_MANIFEST_SHA256: 'a'.repeat(64),
    PCD_CRM_DIRECTORY_DATABASE_ID: '11111111-1111-4111-8111-111111111111',
    PCD_CRM_OPS_DATABASE_ID: '22222222-2222-4222-8222-222222222222',
    PCD_CRM_TARGET_DATABASE_ID: '33333333-3333-4333-8333-333333333333',
    PCD_CRM_DIRECTORY_BOOKMARK: '00000001-00000000-00000000-11111111111111111111111111111111',
    PCD_CRM_OPS_BOOKMARK: '00000002-00000000-00000000-22222222222222222222222222222222',
    PCD_CRM_SOURCE_POLICY_VERSION: 'pcd-public-professional-v1',
    ...extra,
  };
}

function successfulReconciliationFetcher(): CrmAdapterFetcher {
  return {
    fetch: vi.fn(async (_input, init) => {
      const body = JSON.parse(String(init?.body));
      return Response.json({
        producer: 'parent-coach-desk',
        producerWorkspaceId: body.producerWorkspaceId,
        declaredHighWater: body.declaredHighWater,
        receiverHighWater: body.declaredHighWater,
        missing: [], duplicate: [], stale: [], unauthorized: [], mismatch: [],
      });
    }),
  };
}

async function insertOrganization(db: D1Database, input: { id: string; updatedAt: string; createdAt?: string; name?: string; deletedAt?: string | null }) {
  await db.prepare(`INSERT INTO organizations
    (id,slug,name,organization_type,website_url,city,state,zip,categories,record_source,record_status,is_claimed,
     confidence_score,created_at,updated_at,content_hash,deleted_at)
    VALUES (?,?,?,?,?,?,?,?,?,'manual','active',0,90,?,?,?,?)`).bind(
    input.id,
    input.id,
    input.name ?? `Organization ${input.id}`,
    'club_league',
    `https://${input.id}.example`,
    'Tacoma',
    'WA',
    '98401',
    '["volleyball"]',
    input.createdAt ?? input.updatedAt,
    input.updatedAt,
    null,
    input.deletedAt ?? null,
  ).run();
}

async function insertOrganizationSeries(
  db: D1Database,
  input: { prefix: string; count: number; updatedAt: string },
): Promise<void> {
  await db.prepare(`WITH RECURSIVE sequence(value) AS (
      SELECT 0 UNION ALL SELECT value+1 FROM sequence WHERE value+1<?
    )
    INSERT INTO organizations
      (id,slug,name,organization_type,website_url,city,state,zip,categories,record_source,record_status,is_claimed,
       confidence_score,created_at,updated_at,content_hash,deleted_at)
    SELECT ?||printf('%03d',value),?||printf('%03d',value),'Organization '||?||printf('%03d',value),
      'club_league','https://example.test','Tacoma','WA','98401','["volleyball"]','manual','active',0,90,?,?,NULL,NULL
    FROM sequence`).bind(
    input.count,
    input.prefix,
    input.prefix,
    input.prefix,
    input.updatedAt,
    input.updatedAt,
  ).run();
}

async function insertContact(db: D1Database, input: {
  id: string;
  organizationId: string;
  updatedAt: string;
  createdAt?: string;
  deletedAt?: string | null;
  isPublic?: boolean;
  doNotContact?: boolean;
  contactContext?: 'professional' | 'family' | 'guardian' | 'minor' | 'roster' | 'unknown';
}) {
  await db.prepare(`INSERT INTO org_contacts
    (id,organization_id,full_name,title,role,email,is_primary,is_public,do_not_contact,source,source_url,
     confidence,verified_at,content_hash,deleted_at,created_at,updated_at,contact_context)
    VALUES (?,?,?,'Club Director','director',?,0,?,?,'website',?,'high',?,NULL,?,?,?,?)`).bind(
    input.id,
    input.organizationId,
    'Taylor Director',
    `${input.id}@test.example`,
    input.isPublic === false ? 0 : 1,
    input.doNotContact === true ? 1 : 0,
    `https://${input.organizationId}.example/staff`,
    input.updatedAt,
    input.deletedAt ?? null,
    input.createdAt ?? input.updatedAt,
    input.updatedAt,
    input.contactContext ?? 'professional',
  ).run();
}

async function readyOrganizationProjection(
  ops: D1Database,
  intel: D1Database,
  adapterEnv: PcdCrmAdapterEnv,
  organizationId: string,
): Promise<void> {
  const at = new Date(Date.now() - 1_000).toISOString();
  await insertOrganization(intel, { id: organizationId, updatedAt: at });
  await projectPcdCrmEvents(adapterEnv, { now: Date.now(), limit: 50 });
  await ops.prepare(`UPDATE crm_adapter_outbox SET status='delivered',receiver_receipt_id='ready-organization',
    receiver_status=202,delivered_at=?,updated_at=? WHERE subject_type='organization' AND subject_id=?`)
    .bind(Date.now(), Date.now(), organizationId).run();
}

async function publishContactForTest(
  ops: D1Database,
  adapterEnv: PcdCrmAdapterEnv,
  id: string,
  updatedAt = new Date().toISOString(),
): Promise<void> {
  await ops.prepare(`UPDATE org_contacts SET is_public=1,updated_at=? WHERE id=?`).bind(updatedAt, id).run();
  await projectPcdCrmEvents(adapterEnv, { now: Date.parse(updatedAt) + 1, limit: 50 });
}

describe('PCD CRM adapter producer', () => {
  it('is disabled without an explicit local feature flag', async () => {
    expect(await projectPcdCrmEvents({})).toEqual({
      enabled: false,
      organizations: 0,
      contacts: 0,
      replayed: 0,
      deferred: 0,
    });
    expect(await dispatchPcdCrmOutbox({})).toEqual({
      enabled: false,
      claimed: 0,
      delivered: 0,
      retried: 0,
      dead: 0,
    });
  });

  it('projects canonical organization IDs and private professional contacts without inferred identity', async () => {
    const { ops, intel } = await databases();
    const at = '2026-09-01T12:00:00.000Z';
    await insertOrganization(intel, { id: 'org-authority-1', updatedAt: at });
    await insertContact(ops, { id: 'contact-authority-1', organizationId: 'org-authority-1', updatedAt: at });
    const first = await projectPcdCrmEvents(env(ops, intel), { now: Date.parse(at) + 1 });
    expect(first).toMatchObject({ enabled: true, organizations: 1, contacts: 1, replayed: 0, deferred: 0 });
    const rows = await ops.prepare(`SELECT source_sequence,event_type,subject_id,payload_json,status
      FROM crm_adapter_outbox ORDER BY source_sequence`).all<{
      source_sequence: number;
      event_type: string;
      subject_id: string;
      payload_json: string;
      status: string;
    }>();
    expect(rows.results).toHaveLength(2);
    expect(rows.results.map((row) => row.source_sequence)).toEqual([1, 2]);
    const organization = JSON.parse(rows.results[0].payload_json);
    expect(organization.payload).toMatchObject({
      id: 'org-authority-1',
      workspaceId: 'ws-sightsmash',
      displayName: 'Organization org-authority-1',
    });
    expect(organization.payload).not.toHaveProperty('email');
    const contact = JSON.parse(rows.results[1].payload_json);
    expect(contact.payload).toMatchObject({
      id: 'contact-authority-1',
      organizationId: 'org-authority-1',
      workspaceId: 'ws-sightsmash',
      professionalContext: true,
    });
    expect(contact.payload).not.toHaveProperty('notes');
    expect((await projectPcdCrmEvents(env(ops, intel), { now: Date.parse(at) + 2 })).organizations).toBe(0);

    const deletedAt = '2026-09-01T13:00:00.000Z';
    await ops.prepare(`UPDATE org_contacts SET deleted_at=?,updated_at=? WHERE id='contact-authority-1'`)
      .bind(deletedAt, deletedAt).run();
    const tombstone = await projectPcdCrmEvents(env(ops, intel), { now: Date.parse(deletedAt) + 1 });
    expect(await ops.prepare(`SELECT event_type,status,target_workspace_id,send_attempt_count FROM crm_adapter_outbox WHERE subject_id='contact-authority-1'
      ORDER BY source_sequence DESC LIMIT 1`).first()).toBeNull();
    expect(tombstone.contacts).toBe(0);
  });

  it('does not backfill source rows older than the explicit activation watermark', async () => {
    const { ops, intel } = await databases();
    const oldAt = '2026-09-01T12:00:00.000Z';
    const newAt = '2026-09-03T12:00:00.000Z';
    await insertOrganization(intel, { id: 'org-before-activation', updatedAt: oldAt });
    await insertContact(ops, { id: 'contact-before-activation', organizationId: 'org-before-activation', updatedAt: oldAt });
    await insertOrganization(intel, { id: 'org-after-activation', updatedAt: newAt });
    await insertContact(ops, { id: 'contact-after-activation', organizationId: 'org-after-activation', updatedAt: newAt });

    const result = await projectPcdCrmEvents(env(ops, intel, {
      PCD_CRM_SOURCE_NOT_BEFORE_MS: String(Date.parse('2026-09-02T00:00:00.000Z')),
    }), { now: Date.parse(newAt) + 1 });

    expect(result).toMatchObject({ organizations: 1, contacts: 1 });
    const subjects = await ops.prepare(`SELECT subject_id FROM crm_adapter_outbox ORDER BY source_sequence`)
      .all<{ subject_id: string }>();
    expect(subjects.results.map((row) => row.subject_id)).toEqual([
      'org-after-activation',
      'contact-after-activation',
    ]);
  });

  it('does not skip concurrent organization or contact inserts that share the cursor timestamp and sort before its id', async () => {
    const { ops, intel } = await databases();
    const at = '2026-09-03T12:00:00.123Z';
    const adapterEnv = env(ops, intel, {
      PCD_CRM_SOURCE_NOT_BEFORE_MS: String(Date.parse('2026-09-03T00:00:00.000Z')),
    });
    await insertOrganization(intel, { id: 'org-live-b', updatedAt: at });
    await insertContact(ops, { id: 'contact-live-b', organizationId: 'org-live-b', updatedAt: at });
    await expect(projectPcdCrmEvents(adapterEnv, { limit: 1, now: Date.parse(at) + 1 }))
      .resolves.toMatchObject({ organizations: 1, contacts: 1 });

    await insertOrganization(intel, { id: 'org-live-a', updatedAt: at });
    await insertContact(ops, { id: 'contact-live-a', organizationId: 'org-live-a', updatedAt: at });
    await expect(projectPcdCrmEvents(adapterEnv, { limit: 1, now: Date.parse(at) + 2 }))
      .resolves.toMatchObject({ organizations: 1, contacts: 1 });

    const subjects = await ops.prepare(`SELECT subject_id FROM crm_adapter_outbox ORDER BY source_sequence`)
      .all<{ subject_id: string }>();
    expect(subjects.results.map((row) => row.subject_id)).toEqual([
      'org-live-b', 'contact-live-b', 'org-live-a', 'contact-live-a',
    ]);
  });

  it('never queues a live contact before its canonical organization has been projected', async () => {
    const { ops, intel } = await databases();
    const at = '2026-09-03T12:00:00.000Z';
    const adapterEnv = env(ops, intel, {
      PCD_CRM_SOURCE_NOT_BEFORE_MS: String(Date.parse('2026-09-03T00:00:00.000Z')),
    });
    await insertContact(ops, { id: 'contact-org-race', organizationId: 'org-race', updatedAt: at });
    await expect(projectPcdCrmEvents(adapterEnv, { now: Date.parse(at) + 1 }))
      .resolves.toMatchObject({ organizations: 0, contacts: 0, deferred: 1 });
    expect((await ops.prepare(`SELECT COUNT(*) count FROM crm_adapter_outbox`).first<{ count: number }>())?.count).toBe(0);

    await insertOrganization(intel, { id: 'org-race', updatedAt: at });
    await expect(projectPcdCrmEvents(adapterEnv, { now: Date.parse(at) + 2 }))
      .resolves.toMatchObject({ organizations: 1, contacts: 1 });
    expect((await ops.prepare(`SELECT event_type FROM crm_adapter_outbox ORDER BY source_sequence`).all()).results)
      .toEqual([{ event_type: 'organization.upserted.v1' }, { event_type: 'contact.observed.v1' }]);
  });

  it('advances across bounded pre-activation revisions instead of rescanning them forever', async () => {
    const { ops, intel } = await databases();
    const cutoff = Date.parse('2026-09-03T00:00:00.000Z');
    for (const id of ['old-a', 'old-b', 'old-c']) {
      await insertOrganization(intel, { id, updatedAt: '2026-09-01T12:00:00.000Z' });
    }
    await insertOrganization(intel, { id: 'live-after-old', updatedAt: '2026-09-03T12:00:00.000Z' });
    const adapterEnv = env(ops, intel, { PCD_CRM_SOURCE_NOT_BEFORE_MS: String(cutoff) });
    await expect(projectPcdCrmEvents(adapterEnv, { limit: 2, now: cutoff + 1 }))
      .resolves.toMatchObject({ organizations: 0 });
    expect((await ops.prepare(`SELECT organization_revision_cursor FROM crm_adapter_controls`)
      .first<{ organization_revision_cursor: number }>())?.organization_revision_cursor).toBeGreaterThan(0);
    await expect(projectPcdCrmEvents(adapterEnv, { limit: 2, now: cutoff + 2 }))
      .resolves.toMatchObject({ organizations: 1 });
  });

  it('fails closed when enabled without a valid activation watermark', async () => {
    const { ops, intel } = await databases();
    await expect(projectPcdCrmEvents(env(ops, intel, { PCD_CRM_SOURCE_NOT_BEFORE_MS: '' })))
      .rejects.toThrow('pcd_crm_adapter_configuration_missing');
  });

  it('keeps historical projection behind a separate explicit backfill flag', async () => {
    const { ops, intel } = await databases();
    const oldAt = '2026-09-01T12:00:00.000Z';
    await insertOrganization(intel, { id: 'org-historical-disabled', updatedAt: oldAt });
    const result = await projectPcdCrmBackfill(env(ops, intel, {
      PCD_CRM_SOURCE_NOT_BEFORE_MS: String(Date.parse('2026-09-02T00:00:00.000Z')),
    }));
    expect(result).toEqual({
      enabled: false,
      organizations: 0,
      contacts: 0,
      replayed: 0,
      rejected: 0,
      scanCompleted: false,
      completed: false,
      busy: false,
    });
    expect((await ops.prepare(`SELECT COUNT(*) count FROM crm_adapter_backfill_runs`).first<{ count: number }>())?.count).toBe(0);
  });

  it('fails closed before creating a historical run without its sealed approval manifest', async () => {
    const { ops, intel } = await databases();
    await expect(projectPcdCrmBackfill(env(ops, intel, {
      PCD_CRM_BACKFILL_ENABLED: 'true',
      PCD_CRM_BACKFILL_MANIFEST_SHA256: '',
    }))).rejects.toThrow('pcd_crm_backfill_approval_configuration_missing');
    expect((await ops.prepare(`SELECT COUNT(*) count FROM crm_adapter_backfill_runs`)
      .first<{ count: number }>())?.count).toBe(0);
  });

  it.each([
    ['manifest digest', { PCD_CRM_BACKFILL_MANIFEST_SHA256: 'A'.repeat(64) }],
    ['directory database identity', { PCD_CRM_DIRECTORY_DATABASE_ID: 'not-a-database-id' }],
    ['ops bookmark', { PCD_CRM_OPS_BOOKMARK: 'not-a-bookmark' }],
    ['policy version', { PCD_CRM_SOURCE_POLICY_VERSION: 'policy version with spaces' }],
  ])('rejects malformed historical approval %s before creating a run', async (_label, override) => {
    const { ops, intel } = await databases();
    await expect(projectPcdCrmBackfill(env(ops, intel, {
      PCD_CRM_BACKFILL_ENABLED: 'true',
      ...override,
    }))).rejects.toThrow('pcd_crm_backfill_approval_configuration_missing');
    expect((await ops.prepare(`SELECT COUNT(*) count FROM crm_adapter_backfill_runs`)
      .first<{ count: number }>())?.count).toBe(0);
  });

  it('refuses to resume an existing historical run under a different approved manifest', async () => {
    const { ops, intel } = await databases();
    const cutoff = Date.parse('2026-09-02T00:00:00.000Z');
    await insertOrganization(intel, {
      id: 'org-manifest-bound',
      updatedAt: '2026-09-01T12:00:00.000Z',
    });
    const adapterEnv = env(ops, intel, {
      PCD_CRM_BACKFILL_ENABLED: 'true',
      PCD_CRM_SOURCE_NOT_BEFORE_MS: String(cutoff),
    });
    await expect(projectPcdCrmBackfill(adapterEnv, { now: cutoff + 1 })).resolves.toMatchObject({ enabled: true });
    await expect(projectPcdCrmBackfill({
      ...adapterEnv,
      PCD_CRM_BACKFILL_MANIFEST_SHA256: 'b'.repeat(64),
    }, { now: cutoff + 2 })).rejects.toThrow('pcd_crm_backfill_boundary_conflict');
  });

  it('backfills only pre-activation rows with durable bounded receipts and resumes to completion', async () => {
    const { ops, intel } = await databases();
    const oldAt = '2026-09-01T12:00:00.000Z';
    const newAt = '2026-09-03T12:00:00.000Z';
    for (const id of ['org-historical-a', 'org-historical-b', 'org-historical-c']) {
      await insertOrganization(intel, { id, updatedAt: oldAt });
    }
    await insertOrganization(intel, { id: 'org-live-only', updatedAt: newAt });
    await insertContact(ops, { id: 'contact-historical', organizationId: 'org-historical-a', updatedAt: oldAt });

    const adapterEnv = env(ops, intel, {
      PCD_CRM_BACKFILL_ENABLED: 'true',
      PCD_CRM_SOURCE_NOT_BEFORE_MS: String(Date.parse('2026-09-02T00:00:00.000Z')),
    });
    const first = await projectPcdCrmBackfill(adapterEnv, { limit: 2, now: Date.parse(newAt) + 1 });
    expect(first).toMatchObject({ enabled: true, organizations: 2, contacts: 0, completed: false, busy: false });
    const second = await projectPcdCrmBackfill(adapterEnv, { limit: 2, now: Date.parse(newAt) + 2 });
    expect(second).toMatchObject({ enabled: true, organizations: 1, contacts: 1, scanCompleted: true, completed: false, busy: false });
    const replay = await projectPcdCrmBackfill(adapterEnv, { limit: 2, now: Date.parse(newAt) + 3 });
    expect(replay).toMatchObject({ enabled: true, organizations: 0, contacts: 0, scanCompleted: true, completed: false, busy: false });

    const subjects = await ops.prepare(`SELECT subject_id FROM crm_adapter_outbox ORDER BY subject_id`).all<{ subject_id: string }>();
    expect(subjects.results.map((row) => row.subject_id)).toEqual([
      'contact-historical',
      'org-historical-a',
      'org-historical-b',
      'org-historical-c',
    ]);
    const run = await ops.prepare(`SELECT status,organization_cursor_id,contact_cursor_id,organization_complete,contact_complete
      FROM crm_adapter_backfill_runs`).first();
    expect(run).toEqual({
      status: 'scanned',
      organization_cursor_id: 'org-historical-c',
      contact_cursor_id: 'contact-historical',
      organization_complete: 1,
      contact_complete: 1,
    });
    expect(await ops.prepare(`SELECT approval_manifest_sha256,directory_database_id,ops_database_id,
      target_database_id,directory_bookmark,ops_bookmark,source_policy_version
      FROM crm_adapter_backfill_runs`).first()).toEqual({
      approval_manifest_sha256: 'a'.repeat(64),
      directory_database_id: '11111111-1111-4111-8111-111111111111',
      ops_database_id: '22222222-2222-4222-8222-222222222222',
      target_database_id: '33333333-3333-4333-8333-333333333333',
      directory_bookmark: '00000001-00000000-00000000-11111111111111111111111111111111',
      ops_bookmark: '00000002-00000000-00000000-22222222222222222222222222222222',
      source_policy_version: 'pcd-public-professional-v1',
    });
    const chunks = await ops.prepare(`SELECT subject_type,rows_seen,eligible_count,rejected_count,length(disposition_hash) hash_length
      FROM crm_adapter_backfill_chunks ORDER BY subject_type,chunk_ordinal`).all();
    expect(chunks.results).toEqual([
      { subject_type: 'contact', rows_seen: 1, eligible_count: 1, rejected_count: 0, hash_length: 64 },
      { subject_type: 'organization', rows_seen: 2, eligible_count: 2, rejected_count: 0, hash_length: 64 },
      { subject_type: 'organization', rows_seen: 1, eligible_count: 1, rejected_count: 0, hash_length: 64 },
    ]);
  });

  it('scans the safe 50-row historical page by default', async () => {
    const { ops, intel } = await databases();
    const oldAt = '2026-09-01T12:00:00.000Z';
    await insertOrganizationSeries(intel, { prefix: 'org-default-page-', count: 51, updatedAt: oldAt });
    const adapterEnv = env(ops, intel, {
      PCD_CRM_BACKFILL_ENABLED: 'true',
      PCD_CRM_SOURCE_NOT_BEFORE_MS: String(Date.parse('2026-09-02T00:00:00.000Z')),
    });

    await expect(projectPcdCrmBackfill(adapterEnv, { now: Date.parse(oldAt) + 86_400_001 }))
      .resolves.toMatchObject({ organizations: 50, scanCompleted: false, busy: false });
  });

  it('accounts for rejected historical contacts without copying their raw values into receipts', async () => {
    const { ops, intel } = await databases();
    const oldAt = '2026-09-01T12:00:00.000Z';
    await insertOrganization(intel, { id: 'org-contact-disposition', updatedAt: oldAt });
    await ops.prepare(`INSERT INTO org_contacts
      (id,organization_id,full_name,title,role,email,is_primary,is_public,do_not_contact,source,source_url,
       confidence,verified_at,content_hash,deleted_at,created_at,updated_at,contact_context)
      VALUES ('contact-no-source','org-contact-disposition','Private Example','Director','director',
        'private-value@test.example',0,0,0,'website',NULL,'medium',NULL,NULL,NULL,?,?,'professional')`).bind(oldAt, oldAt).run();
    const result = await projectPcdCrmBackfill(env(ops, intel, {
      PCD_CRM_BACKFILL_ENABLED: 'true',
      PCD_CRM_SOURCE_NOT_BEFORE_MS: String(Date.parse('2026-09-02T00:00:00.000Z')),
    }), { now: Date.parse(oldAt) + 1 });
    expect(result).toMatchObject({ contacts: 0, rejected: 1, scanCompleted: true, completed: false });
    expect((await ops.prepare(`SELECT COUNT(*) count FROM crm_adapter_outbox WHERE subject_id='contact-no-source'`).first<{ count: number }>())?.count).toBe(0);
    const receipt = await ops.prepare(`SELECT eligible_count,rejected_count,disposition_hash FROM crm_adapter_backfill_chunks
      WHERE subject_type='contact'`).first<{ eligible_count: number; rejected_count: number; disposition_hash: string }>();
    expect(receipt).toMatchObject({ eligible_count: 0, rejected_count: 1 });
    expect(JSON.stringify(receipt)).not.toContain('private-value@test.example');
  });

  it('preserves a historical do-not-contact restriction without copying its channel', async () => {
    const { ops, intel } = await databases();
    const oldAt = '2026-09-01T12:00:00.000Z';
    await insertOrganization(intel, { id: 'org-suppressed-contact', updatedAt: oldAt });
    await insertContact(ops, {
      id: 'contact-suppressed-historical',
      organizationId: 'org-suppressed-contact',
      updatedAt: oldAt,
      doNotContact: true,
    });
    const result = await projectPcdCrmBackfill(env(ops, intel, {
      PCD_CRM_BACKFILL_ENABLED: 'true',
      PCD_CRM_SOURCE_NOT_BEFORE_MS: String(Date.parse('2026-09-02T00:00:00.000Z')),
    }), { now: Date.parse(oldAt) + 1 });
    expect(result).toMatchObject({ contacts: 1, rejected: 0, scanCompleted: true, completed: false });
    const event = await ops.prepare(`SELECT event_type,payload_json FROM crm_adapter_outbox
      WHERE subject_id='contact-suppressed-historical'`).first<{ event_type: string; payload_json: string }>();
    expect(event?.event_type).toBe('contact.deleted.v1');
    const payload = JSON.parse(event?.payload_json ?? '{}').payload;
    expect(payload).toMatchObject({
      id: 'contact-suppressed-historical',
      suppressionState: 'do_not_contact',
    });
    expect(payload.sourceVersion).toMatch(/^(?:revision|authority):\d+$/);
    expect(payload.sourceVersion).not.toMatch(/^[a-f0-9]{64}$/);
    expect(event?.payload_json).not.toContain('contact-suppressed-historical@test.example');
    expect(await ops.prepare(`SELECT eligible_count,rejected_count FROM crm_adapter_backfill_chunks
      WHERE subject_type='contact'`).first()).toEqual({ eligible_count: 1, rejected_count: 0 });
  });

  it('terminally dispositions a historical soft-deleted contact without resurrecting its channel', async () => {
    const { ops, intel } = await databases();
    const oldAt = '2026-09-01T12:00:00.000Z';
    await insertOrganization(intel, { id: 'org-deleted-contact', updatedAt: oldAt });
    await insertContact(ops, {
      id: 'contact-deleted-historical',
      organizationId: 'org-deleted-contact',
      updatedAt: oldAt,
      deletedAt: oldAt,
    });
    const result = await projectPcdCrmBackfill(env(ops, intel, {
      PCD_CRM_BACKFILL_ENABLED: 'true',
      PCD_CRM_SOURCE_NOT_BEFORE_MS: String(Date.parse('2026-09-02T00:00:00.000Z')),
    }), { now: Date.parse(oldAt) + 1 });
    expect(result).toMatchObject({ contacts: 0, rejected: 1, scanCompleted: true, completed: false });
    expect(await ops.prepare(`SELECT 1 FROM crm_adapter_outbox
      WHERE subject_id='contact-deleted-historical'`).first()).toBeNull();
    const chunks = await ops.prepare(`SELECT eligible_count,rejected_count FROM crm_adapter_backfill_chunks
      WHERE subject_type='contact'`).all();
    expect(chunks.results).toEqual([{ eligible_count: 0, rejected_count: 1 }]);
    expect(JSON.stringify(chunks.results)).not.toContain('contact-deleted-historical@test.example');
  });

  it('terminally dispositions a historical private contact without copying its channel', async () => {
    const { ops, intel } = await databases();
    const oldAt = '2026-09-01T12:00:00.000Z';
    await insertOrganization(intel, { id: 'org-private-contact', updatedAt: oldAt });
    await insertContact(ops, {
      id: 'contact-private-historical',
      organizationId: 'org-private-contact',
      updatedAt: oldAt,
      isPublic: false,
    });
    const result = await projectPcdCrmBackfill(env(ops, intel, {
      PCD_CRM_BACKFILL_ENABLED: 'true',
      PCD_CRM_SOURCE_NOT_BEFORE_MS: String(Date.parse('2026-09-02T00:00:00.000Z')),
    }), { now: Date.parse(oldAt) + 1 });
    expect(result).toMatchObject({ contacts: 0, rejected: 1, scanCompleted: true, completed: false });
    expect(await ops.prepare(`SELECT 1 FROM crm_adapter_outbox
      WHERE subject_id='contact-private-historical'`).first()).toBeNull();
    const chunks = await ops.prepare(`SELECT eligible_count,rejected_count,disposition_hash FROM crm_adapter_backfill_chunks
      WHERE subject_type='contact'`).all();
    expect(chunks.results).toMatchObject([{ eligible_count: 0, rejected_count: 1 }]);
    expect(JSON.stringify(chunks.results)).not.toContain('contact-private-historical@test.example');
  });

  it('retracts a public professional contact when the authority marks it private', async () => {
    const { ops, intel } = await databases();
    const firstAt = '2026-09-03T12:00:00.000Z';
    const privateAt = '2026-09-03T12:01:00.000Z';
    await insertOrganization(intel, { id: 'org-public-to-private', updatedAt: firstAt });
    await insertContact(ops, {
      id: 'contact-public-to-private', organizationId: 'org-public-to-private', updatedAt: firstAt,
    });
    const adapterEnv = env(ops, intel, {
      PCD_CRM_SOURCE_NOT_BEFORE_MS: String(Date.parse('2026-09-03T00:00:00.000Z')),
    });
    await expect(projectPcdCrmEvents(adapterEnv, { now: Date.parse(firstAt) + 1, limit: 10 }))
      .resolves.toMatchObject({ contacts: 1 });
    await ops.prepare(`UPDATE crm_adapter_outbox SET status='delivered',receiver_receipt_id='public-before-private',
      receiver_status=202,delivered_at=?,send_attempt_count=1 WHERE subject_id='contact-public-to-private'`)
      .bind(Date.parse(firstAt) + 2).run();

    await ops.prepare(`UPDATE org_contacts SET is_public=0,updated_at=? WHERE id='contact-public-to-private'`)
      .bind(privateAt).run();
    await expect(projectPcdCrmEvents(adapterEnv, { now: Date.parse(privateAt) + 1, limit: 10 }))
      .resolves.toMatchObject({ contacts: 1 });
    expect(await ops.prepare(`SELECT event_type FROM crm_adapter_outbox
      WHERE subject_id='contact-public-to-private' ORDER BY source_sequence`).all()).toMatchObject({ results: [
      { event_type: 'contact.observed.v1' },
      { event_type: 'contact.deleted.v1' },
    ] });
  });

  it('keeps historical accounting when an unattempted observation is removed by a safety mutation', async () => {
    const { ops, intel } = await databases();
    const oldAt = '2026-09-01T12:00:00.000Z';
    const cutoff = Date.parse('2026-09-02T00:00:00.000Z');
    await insertOrganization(intel, { id: 'org-backfill-retraction', updatedAt: oldAt });
    await insertContact(ops, {
      id: 'contact-backfill-retraction', organizationId: 'org-backfill-retraction', updatedAt: oldAt,
    });
    const adapterEnv = env(ops, intel, {
      PCD_CRM_BACKFILL_ENABLED: 'true', PCD_CRM_SOURCE_NOT_BEFORE_MS: String(cutoff),
    });
    await expect(projectPcdCrmBackfill(adapterEnv, { now: cutoff + 1 }))
      .resolves.toMatchObject({ scanCompleted: true, contacts: 1 });
    const before = await ops.prepare(`SELECT backfill_run_id FROM crm_adapter_outbox
      WHERE subject_id='contact-backfill-retraction'`).first<{ backfill_run_id: string }>();
    expect(before?.backfill_run_id).toEqual(expect.any(String));

    await expect(upsertOrgContact(adapterEnv, {
      organizationId: 'org-backfill-retraction', fullName: 'Taylor Director', role: 'director',
      email: 'contact-backfill-retraction@test.example', source: 'website',
      sourceUrl: 'https://org-backfill-retraction.example/staff', contactContext: 'minor',
    })).resolves.toMatchObject({ ok: true, created: false });
    expect(await ops.prepare(`SELECT event_type FROM crm_adapter_outbox
      WHERE subject_id='contact-backfill-retraction'`).first()).toBeNull();
    expect(await ops.prepare(`SELECT run_id FROM crm_adapter_backfill_subjects
      WHERE subject_type='contact' AND subject_id='contact-backfill-retraction'`).first())
      .toEqual({ run_id: before?.backfill_run_id });
    await expect(finalizePcdCrmBackfill(adapterEnv, { now: cutoff + 2 }))
      .resolves.toMatchObject({ completed: false, pending: 1 });
  });

  it('does not call a scan complete until every event is delivered and reconciled', async () => {
    const { ops, intel } = await databases();
    const oldAt = '2026-09-01T12:00:00.000Z';
    const now = Date.parse('2026-09-03T12:00:00.000Z');
    await insertOrganization(intel, { id: 'org-finalize-backfill', updatedAt: oldAt });
    const adapterEnv = env(ops, intel, {
      PCD_CRM_BACKFILL_ENABLED: 'true',
      PCD_CRM_SOURCE_NOT_BEFORE_MS: String(Date.parse('2026-09-02T00:00:00.000Z')),
    });
    expect(await projectPcdCrmBackfill(adapterEnv, { now })).toMatchObject({ scanCompleted: true, completed: false });
    expect(await finalizePcdCrmBackfill(adapterEnv, { now: now + 1 })).toMatchObject({ completed: false, pending: 1, reconciled: false });

    await ops.prepare(`UPDATE crm_adapter_outbox SET status='delivered',receiver_receipt_id='receipt-final',delivered_at=?,updated_at=?`).bind(now + 2, now + 2).run();
    expect(await finalizePcdCrmBackfill(adapterEnv, { now: now + 3 })).toMatchObject({ completed: false, pending: 0, reconciled: false });
    const fetcher = successfulReconciliationFetcher();
    expect(await reconcilePcdCrmBackfill(adapterEnv, { fetcher, now: now + 4 }))
      .toMatchObject({ checked: true, pass: 1, window: 1, passCompleted: false });
    expect(await finalizePcdCrmBackfill(adapterEnv, { now: now + 5 })).toMatchObject({ completed: false, reconciled: false });
    expect(await reconcilePcdCrmBackfill(adapterEnv, { fetcher, now: now + 6 }))
      .toMatchObject({ checked: false, pass: 1, passCompleted: true, completed: false });
    expect(await reconcilePcdCrmBackfill(adapterEnv, { fetcher, now: now + 7 }))
      .toMatchObject({ checked: true, pass: 2, window: 1, passCompleted: false });
    expect(await reconcilePcdCrmBackfill(adapterEnv, { fetcher, now: now + 8 }))
      .toMatchObject({ checked: false, pass: 2, passCompleted: true, completed: true });
    expect(await finalizePcdCrmBackfill(adapterEnv, { now: now + 9 })).toEqual({
      enabled: true, completed: true, pending: 0, dead: 0, reconciled: true,
    });
    expect(await ops.prepare(`SELECT status,completed_at FROM crm_adapter_backfill_runs`).first()).toEqual({ status: 'completed', completed_at: now + 9 });
  });

  it('does not let two tail-only reconciliation samples complete a multi-event backfill', async () => {
    const { ops, intel } = await databases();
    const oldAt = '2026-09-01T12:00:00.000Z';
    const now = Date.parse('2026-09-03T12:00:00.000Z');
    for (const id of ['org-full-recon-a', 'org-full-recon-b', 'org-full-recon-c']) {
      await insertOrganization(intel, { id, updatedAt: oldAt });
    }
    const adapterEnv = env(ops, intel, {
      PCD_CRM_BACKFILL_ENABLED: 'true',
      PCD_CRM_SOURCE_NOT_BEFORE_MS: String(Date.parse('2026-09-02T00:00:00.000Z')),
    });
    expect(await projectPcdCrmBackfill(adapterEnv, { now })).toMatchObject({ scanCompleted: true });
    await ops.prepare(`UPDATE crm_adapter_outbox SET status='delivered',receiver_receipt_id='tail-only',
      delivered_at=?,updated_at=?`).bind(now + 1, now + 1).run();
    const highWater = (await ops.prepare('SELECT MAX(source_sequence) high_water FROM crm_adapter_outbox')
      .first<{ high_water: number }>())!.high_water;
    for (const [id, checkedAt] of [['tail-only-1', now + 2], ['tail-only-2', now + 3]] as const) {
      await ops.prepare(`INSERT INTO crm_adapter_reconciliation_receipts
        (id,producer_workspace_id,declared_high_water,receiver_high_water,manifest_count,missing_count,duplicate_count,
         stale_count,unauthorized_count,mismatch_count,result_hash,checked_at)
        VALUES (?,'pcd-activity-radar',?,?,1,0,0,0,0,0,?,?)`)
        .bind(id, highWater, highWater, 'd'.repeat(64), checkedAt).run();
    }

    expect(await finalizePcdCrmBackfill(adapterEnv, { now: now + 4 }))
      .toMatchObject({ completed: false, reconciled: false });
    expect(await ops.prepare('SELECT status FROM crm_adapter_backfill_runs').first()).toEqual({ status: 'scanned' });
  });

  it('covers every run-linked event in two identical bounded reconciliation passes', async () => {
    const { ops, intel } = await databases();
    const cutoff = Date.parse('2026-09-02T00:00:00.000Z');
    const now = Date.parse('2026-09-03T12:00:00.000Z');
    intelResource.sqlite.exec(`WITH RECURSIVE sequence(value) AS (
        SELECT 1 UNION ALL SELECT value+1 FROM sequence WHERE value<101
      )
      INSERT INTO organizations
        (id,slug,name,organization_type,website_url,city,state,zip,categories,record_source,record_status,is_claimed,
         confidence_score,created_at,updated_at,content_hash,deleted_at)
      SELECT printf('org-recon-%03d',value),printf('org-recon-%03d',value),printf('Organization %03d',value),
        'club_league',printf('https://org-recon-%03d.example',value),'Tacoma','WA','98401','["volleyball"]',
        'manual','active',0,90,'2026-09-01T12:00:00.000Z','2026-09-01T12:00:00.000Z',NULL,NULL
      FROM sequence`);
    const adapterEnv = env(ops, intel, {
      PCD_CRM_BACKFILL_ENABLED: 'true',
      PCD_CRM_SOURCE_NOT_BEFORE_MS: String(cutoff),
    });
    let scanCompleted = false;
    for (let tick = 0; tick < 6 && !scanCompleted; tick += 1) {
      scanCompleted = (await projectPcdCrmBackfill(adapterEnv, { limit: 25, now: now + tick })).scanCompleted;
    }
    expect(scanCompleted).toBe(true);
    await ops.prepare(`UPDATE crm_adapter_outbox SET status='delivered',receiver_receipt_id='full-window',
      delivered_at=?,updated_at=?`).bind(now + 10, now + 10).run();

    const fetcher = successfulReconciliationFetcher();
    for (let tick = 0; tick < 6; tick += 1) {
      await reconcilePcdCrmBackfill(adapterEnv, { fetcher, now: now + 20 + tick });
    }
    const coverage = await ops.prepare(`SELECT pass_number,COUNT(*) windows,SUM(manifest_count) events
      FROM crm_adapter_backfill_reconciliation_windows GROUP BY pass_number ORDER BY pass_number`).all();
    expect(coverage.results).toEqual([
      { pass_number: 1, windows: 2, events: 101 },
      { pass_number: 2, windows: 2, events: 101 },
    ]);
    expect(await finalizePcdCrmBackfill(adapterEnv, { now: now + 30 }))
      .toMatchObject({ completed: true, reconciled: true });
  }, 30_000);

  it('uses five bounded reconciliation windows on the dedicated backfill tick', async () => {
    const { ops, intel } = await databases();
    const cutoff = Date.parse('2026-09-02T00:00:00.000Z');
    const now = Date.parse('2026-09-03T12:00:00.000Z');
    const fetcher = successfulReconciliationFetcher();
    const adapterEnv = env(ops, intel, {
      CRM_ADAPTER: fetcher,
      PCD_CRM_BACKFILL_ENABLED: 'true',
      PCD_CRM_SOURCE_NOT_BEFORE_MS: String(cutoff),
    });
    expect(await projectPcdCrmBackfill(adapterEnv, { now })).toMatchObject({ scanCompleted: true });
    const run = await ops.prepare('SELECT id FROM crm_adapter_backfill_runs').first<{ id: string }>();
    await ops.prepare(`WITH RECURSIVE sequence(value) AS (
        SELECT 1 UNION ALL SELECT value+1 FROM sequence WHERE value<251
      )
      INSERT INTO crm_adapter_outbox
        (id,producer_workspace_id,event_id,source_sequence,event_type,subject_type,subject_id,authority_updated_at,
         payload_json,payload_hash,idempotency_key,status,attempt_count,next_attempt_at,receiver_receipt_id,receiver_status,
         delivered_at,created_at,updated_at,target_workspace_id,send_attempt_count,backfill_run_id)
      SELECT printf('batch-row-%03d',value),'pcd-activity-radar',printf('batch-event-%03d',value),value,
        'organization.upserted.v1','organization',printf('batch-org-%03d',value),?,'{}',?,
        printf('batch-key-%03d',value),'delivered',1,0,printf('batch-receipt-%03d',value),202,?,?,?,
        'ws-sightsmash',1,?
      FROM sequence`).bind(now, 'a'.repeat(64), now, now, now, run!.id).run();
    vi.spyOn(console, 'log').mockImplementation(() => undefined);

    await runPcdCrmAdapter(adapterEnv, { backfillOnly: true });

    expect(fetcher.fetch).toHaveBeenCalledTimes(5);
    expect(await ops.prepare(`SELECT reconciliation_pass,reconciliation_cursor_sequence,
      reconciliation_window_ordinal,reconciliation_complete FROM crm_adapter_backfill_runs`).first())
      .toEqual({
        reconciliation_pass: 2,
        reconciliation_cursor_sequence: 200,
        reconciliation_window_ordinal: 2,
        reconciliation_complete: 0,
      });
  }, 10_000);

  it('defers accelerated reconciliation until a dedicated backfill tick sends no events', async () => {
    const { ops, intel } = await databases();
    const cutoff = Date.parse('2026-09-02T00:00:00.000Z');
    const now = Date.parse('2026-09-03T12:00:00.000Z');
    await insertOrganization(intel, {
      id: 'org-recon-after-delivery',
      updatedAt: '2026-09-01T12:00:00.000Z',
    });
    const fetcher: CrmAdapterFetcher = {
      fetch: vi.fn(async (_input, init) => {
        const event = JSON.parse(String(init?.body));
        return Response.json({
          accepted: true,
          receiptId: `receipt-${event.eventId}`,
          eventId: event.eventId,
          sequence: event.sequence,
          replay: false,
        });
      }),
    };
    const adapterEnv = env(ops, intel, {
      CRM_ADAPTER: fetcher,
      PCD_CRM_BACKFILL_ENABLED: 'true',
      PCD_CRM_SOURCE_NOT_BEFORE_MS: String(cutoff),
    });
    expect(await projectPcdCrmBackfill(adapterEnv, { now })).toMatchObject({ scanCompleted: true });
    vi.spyOn(console, 'log').mockImplementation(() => undefined);

    await runPcdCrmAdapter(adapterEnv, { backfillOnly: true });

    expect(fetcher.fetch).toHaveBeenCalledTimes(1);
    expect(await ops.prepare(`SELECT reconciliation_cursor_sequence,reconciliation_window_ordinal,
      reconciliation_complete FROM crm_adapter_backfill_runs`).first()).toEqual({
        reconciliation_cursor_sequence: 0,
        reconciliation_window_ordinal: 0,
        reconciliation_complete: 0,
      });
  }, 10_000);

  it('delivers only run-linked organization upserts in one bounded signed receiver batch', async () => {
    const { ops, intel } = await databases();
    const cutoff = Date.parse('2026-09-02T00:00:00.000Z');
    const dispatchAt = Date.parse('2026-09-03T12:00:00.000Z');
    intelResource.sqlite.exec(`WITH RECURSIVE sequence(value) AS (
        SELECT 1 UNION ALL SELECT value+1 FROM sequence WHERE value<26
      )
      INSERT INTO organizations
        (id,slug,name,organization_type,website_url,city,state,zip,categories,record_source,record_status,is_claimed,
         confidence_score,created_at,updated_at,content_hash,deleted_at)
      SELECT printf('org-bulk-%03d',value),printf('org-bulk-%03d',value),printf('Bulk Organization %03d',value),
        'club_league',printf('https://org-bulk-%03d.example',value),'Tacoma','WA','98401','["volleyball"]',
        'manual','active',0,90,'2026-09-01T12:00:00.000Z','2026-09-01T12:00:00.000Z',NULL,NULL
      FROM sequence`);
    let capturedPath = '';
    let capturedCount = 0;
    const fetcher: CrmAdapterFetcher = {
      fetch: vi.fn(async (input, init) => {
        capturedPath = String(input);
        const body = JSON.parse(String(init?.body)) as {
          events: Array<{ idempotencyKey: string; event: { eventId: string; sequence: number } }>;
        };
        capturedCount = body.events.length;
        return Response.json({
          accepted: true,
          receipts: body.events.map(({ event }) => ({
            accepted: true,
            eventId: event.eventId,
            receiptId: `bulk-receipt-${event.sequence}`,
            replay: false,
            sequence: event.sequence,
          })),
          replay: false,
        }, { status: 202 });
      }),
    };
    const adapterEnv = env(ops, intel, {
      CRM_ADAPTER: fetcher,
      PCD_CRM_BACKFILL_ENABLED: 'true',
      PCD_CRM_SOURCE_NOT_BEFORE_MS: String(cutoff),
    });
    expect(await projectPcdCrmBackfill(adapterEnv, { now: dispatchAt })).toMatchObject({
      organizations: 26, scanCompleted: true,
    });

    const delivery = await dispatchPcdCrmBackfillBatch(adapterEnv, { now: dispatchAt + 1 });
    expect(await ops.prepare(`SELECT status,last_error_code,receiver_status FROM crm_adapter_outbox
      ORDER BY source_sequence LIMIT 1`).first()).toEqual({
      status: 'delivered', last_error_code: null, receiver_status: 202,
    });
    expect(delivery).toEqual({
      enabled: true, claimed: 26, delivered: 26, retried: 0, dead: 0,
    });
    expect(fetcher.fetch).toHaveBeenCalledTimes(1);
    expect(capturedPath.endsWith('/events/batch')).toBe(true);
    expect(capturedCount).toBe(26);
    expect(await ops.prepare(`SELECT status,COUNT(*) count,MIN(send_attempt_count) min_sends,MAX(send_attempt_count) max_sends
      FROM crm_adapter_outbox GROUP BY status`).first()).toEqual({
      status: 'delivered', count: 26, min_sends: 1, max_sends: 1,
    });
  }, 10_000);

  it('uses the bulk lease protocol on an ordinary scheduled run while a backfill is active', async () => {
    const { ops, intel } = await databases();
    const cutoff = Date.parse('2026-09-02T00:00:00.000Z');
    const dispatchAt = Date.parse('2026-09-03T12:00:00.000Z');
    await insertOrganization(intel, { id: 'org-overlapping-crons', updatedAt: '2026-09-01T12:00:00.000Z' });
    let capturedPath = '';
    const fetcher: CrmAdapterFetcher = { fetch: vi.fn(async (input, init) => {
      capturedPath = String(input);
      const body = JSON.parse(String(init?.body)) as {
        events: Array<{ event: { eventId: string; sequence: number } }>;
      };
      return Response.json({
        accepted: true,
        receipts: body.events.map(({ event }) => ({
          accepted: true, eventId: event.eventId, receiptId: `overlap-${event.sequence}`,
          replay: false, sequence: event.sequence,
        })),
        replay: false,
      }, { status: 202 });
    }) };
    const adapterEnv = env(ops, intel, {
      CRM_ADAPTER: fetcher,
      PCD_CRM_BACKFILL_ENABLED: 'true',
      PCD_CRM_SOURCE_NOT_BEFORE_MS: String(cutoff),
    });
    expect(await projectPcdCrmBackfill(adapterEnv, { now: dispatchAt })).toMatchObject({ scanCompleted: true });
    vi.spyOn(console, 'log').mockImplementation(() => undefined);

    await runPcdCrmAdapter(adapterEnv);

    expect(capturedPath.endsWith('/events/batch')).toBe(true);
    expect(await ops.prepare(`SELECT status,receiver_receipt_id FROM crm_adapter_outbox`).first())
      .toEqual({ status: 'delivered', receiver_receipt_id: 'overlap-1' });
  }, 10_000);

  it('releases a partial batch lease without sending a later source prefix', async () => {
    const { ops, intel } = await databases();
    const cutoff = Date.parse('2026-09-02T00:00:00.000Z');
    const dispatchAt = Date.parse('2026-09-03T12:00:00.000Z');
    await insertOrganization(intel, { id: 'org-partial-claim-a', updatedAt: '2026-09-01T12:00:00.000Z' });
    await insertOrganization(intel, { id: 'org-partial-claim-b', updatedAt: '2026-09-01T12:00:00.000Z' });
    const originalPrepare = ops.prepare.bind(ops);
    const partialClaimOps = new Proxy(ops, {
      get(target, property) {
        if (property !== 'prepare') {
          const value = Reflect.get(target, property);
          return typeof value === 'function' ? value.bind(target) : value;
        }
        return (query: string) => {
          const prepared = originalPrepare(query);
          if (!query.includes("SET status='leased',lease_id=?")) return prepared;
          return new Proxy(prepared, {
            get(statement, statementProperty) {
              if (statementProperty !== 'bind') {
                const value = Reflect.get(statement, statementProperty);
                return typeof value === 'function' ? value.bind(statement) : value;
              }
              return (...values: unknown[]) => {
                const bound = statement.bind(...values);
                return new Proxy(bound, {
                  get(boundStatement, boundProperty) {
                    if (boundProperty !== 'all') {
                      const value = Reflect.get(boundStatement, boundProperty);
                      return typeof value === 'function' ? value.bind(boundStatement) : value;
                    }
                    return async () => {
                      const result = await boundStatement.all();
                      return { ...result, results: result.results.slice(1) };
                    };
                  },
                });
              };
            },
          });
        };
      },
    }) as D1Database;
    const fetcher: CrmAdapterFetcher = { fetch: vi.fn() };
    const adapterEnv = env(partialClaimOps, intel, {
      CRM_ADAPTER: fetcher,
      PCD_CRM_BACKFILL_ENABLED: 'true',
      PCD_CRM_SOURCE_NOT_BEFORE_MS: String(cutoff),
    });
    expect(await projectPcdCrmBackfill(adapterEnv, { now: dispatchAt })).toMatchObject({ scanCompleted: true });

    expect(await dispatchPcdCrmBackfillBatch(adapterEnv, { now: dispatchAt + 1 })).toEqual({
      enabled: true, claimed: 0, delivered: 0, retried: 0, dead: 0,
    });
    expect(fetcher.fetch).not.toHaveBeenCalled();
    expect((await ops.prepare(`SELECT status,lease_id FROM crm_adapter_outbox ORDER BY source_sequence`).all()).results)
      .toEqual([{ status: 'pending', lease_id: null }, { status: 'pending', lease_id: null }]);
  }, 10_000);

  it('dead-letters the exact malformed stored event without discarding its valid prefix', async () => {
    const { ops, intel } = await databases();
    const cutoff = Date.parse('2026-09-02T00:00:00.000Z');
    const dispatchAt = Date.parse('2026-09-03T12:00:00.000Z');
    await insertOrganization(intel, { id: 'org-stored-valid-prefix', updatedAt: '2026-09-01T12:00:00.000Z' });
    await insertOrganization(intel, { id: 'org-stored-malformed-later', updatedAt: '2026-09-01T12:00:00.000Z' });
    const fetcher: CrmAdapterFetcher = { fetch: vi.fn() };
    const adapterEnv = env(ops, intel, {
      CRM_ADAPTER: fetcher,
      PCD_CRM_BACKFILL_ENABLED: 'true',
      PCD_CRM_SOURCE_NOT_BEFORE_MS: String(cutoff),
    });
    expect(await projectPcdCrmBackfill(adapterEnv, { now: dispatchAt })).toMatchObject({ scanCompleted: true });
    await ops.prepare(`UPDATE crm_adapter_outbox SET payload_json='[]'
      WHERE source_sequence=(SELECT MAX(source_sequence) FROM crm_adapter_outbox)`).run();

    expect(await dispatchPcdCrmBackfillBatch(adapterEnv, { now: dispatchAt + 1 })).toEqual({
      enabled: true, claimed: 2, delivered: 0, retried: 0, dead: 1,
    });
    expect(fetcher.fetch).not.toHaveBeenCalled();
    expect((await ops.prepare(`SELECT status,last_error_code FROM crm_adapter_outbox
      ORDER BY source_sequence`).all()).results).toEqual([
      { status: 'pending', last_error_code: null },
      { status: 'dead', last_error_code: 'producer_invalid_payload' },
    ]);
  }, 10_000);

  it('does not count a partial batch acknowledgement or batch ordinary outbox rows', async () => {
    const { ops, intel } = await databases();
    const cutoff = Date.parse('2026-09-02T00:00:00.000Z');
    const dispatchAt = Date.parse('2026-09-03T12:00:00.000Z');
    intelResource.sqlite.exec(`WITH RECURSIVE sequence(value) AS (
        SELECT 1 UNION ALL SELECT value+1 FROM sequence WHERE value<2
      )
      INSERT INTO organizations
        (id,slug,name,organization_type,website_url,city,state,zip,categories,record_source,record_status,is_claimed,
         confidence_score,created_at,updated_at,content_hash,deleted_at)
      SELECT printf('org-partial-%03d',value),printf('org-partial-%03d',value),printf('Partial Organization %03d',value),
        'club_league',printf('https://org-partial-%03d.example',value),'Tacoma','WA','98401','["volleyball"]',
        'manual','active',0,90,'2026-09-01T12:00:00.000Z','2026-09-01T12:00:00.000Z',NULL,NULL
      FROM sequence`);
    const partialFetcher: CrmAdapterFetcher = {
      fetch: vi.fn(async (_input, init) => {
        const body = JSON.parse(String(init?.body)) as {
          events: Array<{ event: { eventId: string; sequence: number } }>;
        };
        const first = body.events[0]!.event;
        return Response.json({
          accepted: true,
          receipts: [{
            accepted: true, eventId: first.eventId, receiptId: 'partial-receipt', replay: false, sequence: first.sequence,
          }],
          replay: false,
        }, { status: 422 });
      }),
    };
    const adapterEnv = env(ops, intel, {
      CRM_ADAPTER: partialFetcher,
      PCD_CRM_BACKFILL_ENABLED: 'true',
      PCD_CRM_SOURCE_NOT_BEFORE_MS: String(cutoff),
    });
    expect(await projectPcdCrmBackfill(adapterEnv, { now: dispatchAt })).toMatchObject({ scanCompleted: true });
    expect(await dispatchPcdCrmBackfillBatch(adapterEnv, { now: dispatchAt + 1 })).toEqual({
      enabled: true, claimed: 2, delivered: 0, retried: 1, dead: 0,
    });
    expect((await ops.prepare(`SELECT status,last_error_code,receiver_receipt_id FROM crm_adapter_outbox
      ORDER BY source_sequence`).all()).results).toEqual([
      { status: 'retry', last_error_code: 'receiver_422', receiver_receipt_id: null },
      { status: 'pending', last_error_code: null, receiver_receipt_id: null },
    ]);

    await ops.prepare(`UPDATE crm_adapter_outbox SET status='pending',next_attempt_at=0`).run();
    const attributedFailureFetcher: CrmAdapterFetcher = { fetch: vi.fn(async (_input, init) => {
      const body = JSON.parse(String(init?.body)) as { events: Array<{ event: { eventId: string } }> };
      return new Response(JSON.stringify({ error: 'invalid_adapter_batch' }), {
        status: 422,
        headers: {
          'content-type': 'application/json',
          'x-ff-failed-event-id': body.events[1]!.event.eventId,
        },
      });
    }) };
    expect(await dispatchPcdCrmBackfillBatch(adapterEnv, {
      fetcher: attributedFailureFetcher,
      now: dispatchAt + 31_001,
    })).toEqual({ enabled: true, claimed: 2, delivered: 0, retried: 0, dead: 1 });
    expect((await ops.prepare(`SELECT status,last_error_code FROM crm_adapter_outbox
      ORDER BY source_sequence`).all()).results).toEqual([
      { status: 'pending', last_error_code: 'receiver_422' },
      { status: 'dead', last_error_code: 'receiver_422' },
    ]);

    await ops.prepare(`UPDATE crm_adapter_outbox SET status='pending',next_attempt_at=0,backfill_run_id=NULL`).run();
    const ordinaryFetcher: CrmAdapterFetcher = { fetch: vi.fn(async () => new Response(null, { status: 500 })) };
    expect(await dispatchPcdCrmBackfillBatch(adapterEnv, { fetcher: ordinaryFetcher, now: dispatchAt + 31_001 }))
      .toEqual({ enabled: true, claimed: 0, delivered: 0, retried: 0, dead: 0 });
    expect(ordinaryFetcher.fetch).not.toHaveBeenCalled();
  }, 10_000);

  it('restarts both reconciliation passes when a run-linked safety event arrives between them', async () => {
    const { ops, intel } = await databases();
    const cutoff = Date.parse('2026-09-02T00:00:00.000Z');
    const now = Date.parse('2026-09-03T12:00:00.000Z');
    await insertOrganization(intel, { id: 'org-reconcile-restart', updatedAt: '2026-09-01T12:00:00.000Z' });
    await insertContact(ops, {
      id: 'contact-reconcile-restart', organizationId: 'org-reconcile-restart', updatedAt: '2026-09-01T12:00:00.000Z',
    });
    const adapterEnv = env(ops, intel, {
      PCD_CRM_BACKFILL_ENABLED: 'true', PCD_CRM_SOURCE_NOT_BEFORE_MS: String(cutoff),
    });
    await projectPcdCrmBackfill(adapterEnv, { now });
    await ops.prepare(`UPDATE crm_adapter_outbox SET status='delivered',receiver_receipt_id='restart',
      delivered_at=?,updated_at=?`).bind(now + 1, now + 1).run();
    await reconcilePcdCrmBackfill(adapterEnv, { fetcher: successfulReconciliationFetcher(), now: now + 2 });
    await reconcilePcdCrmBackfill(adapterEnv, { fetcher: successfulReconciliationFetcher(), now: now + 3 });
    expect(await ops.prepare(`SELECT reconciliation_pass,reconciliation_cursor_sequence FROM crm_adapter_backfill_runs`).first())
      .toEqual({ reconciliation_pass: 2, reconciliation_cursor_sequence: 0 });

    await expect(upsertOrgContact(adapterEnv, {
      organizationId: 'org-reconcile-restart', fullName: 'Taylor Director', role: 'director',
      email: 'contact-reconcile-restart@test.example', source: 'website',
      sourceUrl: 'https://org-reconcile-restart.example/staff', contactContext: 'minor',
    })).resolves.toMatchObject({ ok: true, created: false });
    expect(await ops.prepare(`SELECT reconciliation_pass,reconciliation_cursor_sequence,reconciliation_window_ordinal,
      reconciliation_complete FROM crm_adapter_backfill_runs`).first()).toEqual({
      reconciliation_pass: 1, reconciliation_cursor_sequence: 0, reconciliation_window_ordinal: 0,
      reconciliation_complete: 0,
    });
    expect((await ops.prepare(`SELECT COUNT(*) count FROM crm_adapter_backfill_reconciliation_windows`)
      .first<{ count: number }>())?.count).toBe(0);
  });

  it('retains failed window evidence without advancing reconciliation coverage', async () => {
    const { ops, intel } = await databases();
    const cutoff = Date.parse('2026-09-02T00:00:00.000Z');
    const now = Date.parse('2026-09-03T12:00:00.000Z');
    await insertOrganization(intel, { id: 'org-recon-missing', updatedAt: '2026-09-01T12:00:00.000Z' });
    const adapterEnv = env(ops, intel, {
      PCD_CRM_BACKFILL_ENABLED: 'true',
      PCD_CRM_SOURCE_NOT_BEFORE_MS: String(cutoff),
    });
    await projectPcdCrmBackfill(adapterEnv, { now });
    await ops.prepare(`UPDATE crm_adapter_outbox SET status='delivered',receiver_receipt_id='missing-window',
      delivered_at=?,updated_at=?`).bind(now + 1, now + 1).run();
    const failed: CrmAdapterFetcher = {
      fetch: vi.fn(async (_input, init) => {
        const body = JSON.parse(String(init?.body));
        return Response.json({
          producer: 'parent-coach-desk', producerWorkspaceId: body.producerWorkspaceId,
          declaredHighWater: body.declaredHighWater, receiverHighWater: body.declaredHighWater,
          missing: [body.events[0]], duplicate: [], stale: [], unauthorized: [], mismatch: [],
        });
      }),
    };
    expect(await reconcilePcdCrmBackfill(adapterEnv, { fetcher: failed, now: now + 2 }))
      .toMatchObject({ checked: true, pass: 1, window: 1, missing: 1 });
    expect(await ops.prepare(`SELECT reconciliation_cursor_sequence,reconciliation_window_ordinal
      FROM crm_adapter_backfill_runs`).first()).toEqual({
      reconciliation_cursor_sequence: 0,
      reconciliation_window_ordinal: 0,
    });
    expect((await ops.prepare('SELECT COUNT(*) count FROM crm_adapter_backfill_reconciliation_windows')
      .first<{ count: number }>())?.count).toBe(0);
    expect((await ops.prepare('SELECT missing_count FROM crm_adapter_reconciliation_receipts').first())?.missing_count).toBe(1);
    expect(await ops.prepare(`SELECT status,last_error_code,receiver_receipt_id FROM crm_adapter_outbox`).first()).toEqual({
      status: 'retry', last_error_code: 'receiver_missing_reconcile', receiver_receipt_id: null,
    });
    const deliveryFetcher: CrmAdapterFetcher = {
      fetch: vi.fn(async (_input, init) => {
        const body = JSON.parse(String(init?.body));
        return Response.json({ accepted: true, receiptId: `recovered-${body.eventId}`, eventId: body.eventId, sequence: body.sequence, replay: false });
      }),
    };
    expect(await dispatchPcdCrmOutbox(adapterEnv, { fetcher: deliveryFetcher, now: now + 3 }))
      .toMatchObject({ claimed: 1, delivered: 1 });
    expect(await reconcilePcdCrmBackfill(adapterEnv, { fetcher: successfulReconciliationFetcher(), now: now + 4 }))
      .toMatchObject({ checked: false });
    expect(await reconcilePcdCrmBackfill(adapterEnv, { fetcher: successfulReconciliationFetcher(), now: now + 30_003 }))
      .toMatchObject({ checked: true, missing: 0 });
  });

  it('halts a repeatedly failing historical reconciliation window after eight backed-off attempts', async () => {
    const { ops, intel } = await databases();
    const cutoff = Date.parse('2026-09-02T00:00:00.000Z');
    const startedAt = Date.parse('2026-09-03T12:00:00.000Z');
    await insertOrganization(intel, { id: 'org-recon-halt', updatedAt: '2026-09-01T12:00:00.000Z' });
    const adapterEnv = env(ops, intel, {
      PCD_CRM_BACKFILL_ENABLED: 'true', PCD_CRM_SOURCE_NOT_BEFORE_MS: String(cutoff),
    });
    await projectPcdCrmBackfill(adapterEnv, { now: startedAt });
    await ops.prepare(`UPDATE crm_adapter_outbox SET status='delivered',receiver_receipt_id='recon-halt',
      delivered_at=?,updated_at=?`).bind(startedAt + 1, startedAt + 1).run();
    const failed: CrmAdapterFetcher = { fetch: vi.fn(async (_input, init) => {
      const body = JSON.parse(String(init?.body));
      return Response.json({
        producer: 'parent-coach-desk', producerWorkspaceId: body.producerWorkspaceId,
        declaredHighWater: body.declaredHighWater, receiverHighWater: body.declaredHighWater,
        missing: [], duplicate: [], stale: [], unauthorized: [], mismatch: [body.events[0]],
      });
    }) };
    let now = startedAt + 2;
    for (let attempt = 1; attempt <= 8; attempt += 1) {
      await expect(reconcilePcdCrmBackfill(adapterEnv, { fetcher: failed, now }))
        .resolves.toMatchObject({ checked: true, mismatch: 1 });
      const state = await ops.prepare(`SELECT reconciliation_failure_count,reconciliation_next_attempt_at,
        reconciliation_halted FROM crm_adapter_backfill_runs`).first<{
          reconciliation_failure_count: number; reconciliation_next_attempt_at: number; reconciliation_halted: number;
        }>();
      expect(state?.reconciliation_failure_count).toBe(attempt);
      expect(state?.reconciliation_halted).toBe(attempt === 8 ? 1 : 0);
      now = Number(state?.reconciliation_next_attempt_at ?? now) + 1;
    }
    await expect(reconcilePcdCrmBackfill(adapterEnv, { fetcher: failed, now }))
      .rejects.toThrow('pcd_crm_backfill_reconciliation_halted');
    expect((await ops.prepare(`SELECT COUNT(*) count FROM crm_adapter_reconciliation_receipts`)
      .first<{ count: number }>())?.count).toBe(8);
  }, 10_000);

  it('refuses a changed historical boundary and skips a concurrently leased run', async () => {
    const { ops, intel } = await databases();
    const oldAt = '2026-09-01T12:00:00.000Z';
    const cutoff = Date.parse('2026-09-02T00:00:00.000Z');
    await insertOrganization(intel, { id: 'org-lease-a', updatedAt: oldAt });
    await insertOrganization(intel, { id: 'org-lease-b', updatedAt: oldAt });
    const adapterEnv = env(ops, intel, { PCD_CRM_BACKFILL_ENABLED: 'true', PCD_CRM_SOURCE_NOT_BEFORE_MS: String(cutoff) });
    expect(await projectPcdCrmBackfill(adapterEnv, { limit: 1, now: cutoff + 1 })).toMatchObject({ scanCompleted: false, busy: false });
    await ops.prepare(`UPDATE crm_adapter_backfill_runs SET lease_id='other-worker',lease_expires_at=?`).bind(cutoff + 60_000).run();
    expect(await projectPcdCrmBackfill(adapterEnv, { limit: 1, now: cutoff + 2 })).toMatchObject({ busy: true });
    await expect(projectPcdCrmBackfill({ ...adapterEnv, PCD_CRM_SOURCE_NOT_BEFORE_MS: String(cutoff + 1000) }, { now: cutoff + 3 }))
      .rejects.toThrow('pcd_crm_backfill_boundary_conflict');
  });

  it('fails completion when the frozen source inventory changes during the scan', async () => {
    const { ops, intel } = await databases();
    const oldAt = '2026-09-01T12:00:00.000Z';
    const cutoff = Date.parse('2026-09-02T00:00:00.000Z');
    const adapterEnv = env(ops, intel, { PCD_CRM_BACKFILL_ENABLED: 'true', PCD_CRM_SOURCE_NOT_BEFORE_MS: String(cutoff) });
    await insertOrganization(intel, { id: 'org-inventory-first', updatedAt: oldAt });
    expect(await projectPcdCrmBackfill(adapterEnv, { now: cutoff + 1 })).toMatchObject({ scanCompleted: true });

    await insertOrganization(intel, { id: 'org-inventory-late', updatedAt: oldAt });
    expect(await finalizePcdCrmBackfill(adapterEnv, { now: cutoff + 2 }))
      .toMatchObject({ completed: false, pending: 1, reconciled: false });
    await ops.prepare(`UPDATE crm_adapter_outbox SET status='delivered',receiver_receipt_id='receipt-inventory',
      delivered_at=?,updated_at=?`).bind(cutoff + 3, cutoff + 3).run();
    const fetcher = successfulReconciliationFetcher();
    for (let tick = 0; tick < 4; tick += 1) {
      await reconcilePcdCrmBackfill(adapterEnv, { fetcher, now: cutoff + 4 + tick });
    }
    await expect(finalizePcdCrmBackfill(adapterEnv, { now: cutoff + 8 }))
      .rejects.toThrow('pcd_crm_backfill_source_inventory_changed');
  });

  it('keeps pre-boundary rows in the frozen inventory when they are updated during the drain', async () => {
    const { ops, intel } = await databases();
    const createdAt = '2026-09-01T12:00:00.000Z';
    const updatedAt = '2026-09-03T12:00:00.000Z';
    const cutoff = Date.parse('2026-09-02T00:00:00.000Z');
    const scanNow = Date.parse(updatedAt) + 1;
    await insertOrganization(intel, { id: 'org-updated-during-drain', createdAt, updatedAt });
    await insertContact(ops, { id: 'contact-updated-during-drain', organizationId: 'org-updated-during-drain', createdAt, updatedAt });

    const result = await projectPcdCrmBackfill(env(ops, intel, {
      PCD_CRM_BACKFILL_ENABLED: 'true',
      PCD_CRM_SOURCE_NOT_BEFORE_MS: String(cutoff),
    }), { now: scanNow });
    expect(result).toMatchObject({ organizations: 1, contacts: 1, scanCompleted: true });
    await ops.prepare(`UPDATE crm_adapter_outbox SET status='delivered',receiver_receipt_id='receipt-moving',
      delivered_at=?,updated_at=?`).bind(scanNow + 1, scanNow + 1).run();
    const movingEnv = env(ops, intel, {
      PCD_CRM_BACKFILL_ENABLED: 'true',
      PCD_CRM_SOURCE_NOT_BEFORE_MS: String(cutoff),
    });
    const fetcher = successfulReconciliationFetcher();
    for (let tick = 0; tick < 4; tick += 1) {
      await reconcilePcdCrmBackfill(movingEnv, { fetcher, now: scanNow + 2 + tick });
    }
    await expect(finalizePcdCrmBackfill(env(ops, intel, {
      PCD_CRM_BACKFILL_ENABLED: 'true',
      PCD_CRM_SOURCE_NOT_BEFORE_MS: String(cutoff),
    }), { now: scanNow + 6 })).resolves.toMatchObject({ completed: true, reconciled: true });
  });

  it('applies the snapshot boundary by time instead of timestamp text format', async () => {
    const { ops, intel } = await databases();
    const cutoff = Date.parse('2026-09-02T00:00:00.000Z');
    const afterCutoffInSqliteFormat = '2026-09-02 12:00:00';
    await insertOrganization(intel, { id: 'org-after-cutoff-space', updatedAt: afterCutoffInSqliteFormat });
    await insertContact(ops, { id: 'contact-after-cutoff-space', organizationId: 'org-after-cutoff-space', updatedAt: afterCutoffInSqliteFormat });

    const result = await projectPcdCrmBackfill(env(ops, intel, {
      PCD_CRM_BACKFILL_ENABLED: 'true',
      PCD_CRM_SOURCE_NOT_BEFORE_MS: String(cutoff),
    }), { now: cutoff + 1 });
    expect(result).toMatchObject({ organizations: 0, contacts: 0, scanCompleted: true });
    expect((await ops.prepare('SELECT COUNT(*) count FROM crm_adapter_outbox').first<{ count: number }>())?.count).toBe(0);
  });

  it('projects live rows in both timestamp formats without skipping either cursor stream', async () => {
    const { ops, intel } = await databases();
    const cutoff = Date.parse('2026-09-02T00:00:00.000Z');
    for (const [suffix, updatedAt] of [
      ['iso', '2026-09-02T12:00:00.500Z'],
      ['space', '2026-09-02 12:00:01'],
    ] as const) {
      await insertOrganization(intel, { id: `org-live-${suffix}`, updatedAt });
      await insertContact(ops, { id: `contact-live-${suffix}`, organizationId: `org-live-${suffix}`, updatedAt });
    }
    const result = await projectPcdCrmEvents(env(ops, intel, {
      PCD_CRM_SOURCE_NOT_BEFORE_MS: String(cutoff),
    }), { now: cutoff + 2 });
    expect(result).toMatchObject({ organizations: 2, contacts: 2 });
    expect((await ops.prepare('SELECT COUNT(*) count FROM crm_adapter_outbox').first<{ count: number }>())?.count).toBe(4);
  });

  it('does not advance live contacts until every historical organization is queued', async () => {
    const { ops, intel } = await databases();
    const oldAt = '2026-09-01T12:00:00.000Z';
    const cutoff = Date.parse('2026-09-02T00:00:00.000Z');
    const liveAt = '2026-09-03T12:00:00.000Z';
    await insertOrganization(intel, { id: 'org-order-a', updatedAt: oldAt });
    await insertOrganization(intel, { id: 'org-order-b', updatedAt: oldAt });
    await insertContact(ops, { id: 'contact-live-before-org', organizationId: 'org-order-b', updatedAt: liveAt });
    const adapterEnv = env(ops, intel, { PCD_CRM_BACKFILL_ENABLED: 'true', PCD_CRM_SOURCE_NOT_BEFORE_MS: String(cutoff) });
    await projectPcdCrmBackfill(adapterEnv, { limit: 1, now: cutoff + 1 });
    expect(await projectPcdCrmEvents(adapterEnv, { limit: 10, now: cutoff + 2 })).toMatchObject({ contacts: 0 });
    expect(await ops.prepare(`SELECT contact_revision_cursor FROM crm_adapter_controls`).first()).toEqual({
      contact_revision_cursor: 0,
    });
    await projectPcdCrmBackfill(adapterEnv, { limit: 10, now: cutoff + 3 });
    expect(await projectPcdCrmEvents(adapterEnv, { limit: 10, now: cutoff + 4 })).toMatchObject({ contacts: 1 });
    const ordered = await ops.prepare(`SELECT subject_type,subject_id FROM crm_adapter_outbox ORDER BY source_sequence`).all();
    expect(ordered.results).toEqual([
      { subject_type: 'organization', subject_id: 'org-order-a' },
      { subject_type: 'organization', subject_id: 'org-order-b' },
      { subject_type: 'contact', subject_id: 'contact-live-before-org' },
    ]);
  });

  it('keeps extractor contact writes private until a human publication revision', async () => {
    const { ops, intel } = await databases();
    const adapterEnv = env(ops, intel);
    await readyOrganizationProjection(ops, intel, adapterEnv, 'org-atomic');
    const result = await upsertOrgContact(adapterEnv, {
      organizationId: 'org-atomic',
      fullName: 'Casey Director',
      title: 'Director',
      role: 'director',
      email: 'casey@org-atomic.example',
      source: 'website',
      sourceUrl: 'https://org-atomic.example/staff',
      confidence: 'high',
      contactContext: 'professional',
      verifiedBy: 'operator',
      verificationMethod: 'website',
    });
    expect(result.ok).toBe(true);
    expect((await ops.prepare(`SELECT COUNT(*) count FROM org_contacts WHERE organization_id='org-atomic'`)
      .first<{ count: number }>())?.count).toBe(1);
    expect((await ops.prepare(`SELECT COUNT(*) count FROM crm_adapter_outbox WHERE subject_id=?`)
      .bind(result.ok ? result.id : '').first<{ count: number }>())?.count).toBe(0);
    await publishContactForTest(ops, adapterEnv, result.ok ? result.id : '');
    expect((await ops.prepare(`SELECT COUNT(*) count FROM crm_adapter_outbox WHERE subject_id=?`)
      .bind(result.ok ? result.id : '').first<{ count: number }>())?.count).toBe(1);
    expect(await softDeleteOrgContact(adapterEnv, result.ok ? result.id : '')).toBe(true);
    expect(await ops.prepare(`SELECT event_type FROM crm_adapter_outbox WHERE subject_id=?
      ORDER BY source_sequence DESC LIMIT 1`).bind(result.ok ? result.id : '').first())
      .toBeNull();
  });

  it('delivers through the service binding, replays safely and records reconciliation', async () => {
    const { ops, intel } = await databases();
    await insertOrganization(intel, { id: 'org-delivery', updatedAt: '2026-09-01T12:00:00.000Z' });
    const adapterEnv = env(ops, intel);
    await projectPcdCrmEvents(adapterEnv, { now: Date.parse('2026-09-01T12:00:01.000Z') });
    const fetcher: CrmAdapterFetcher = {
      fetch: vi.fn(async (_input, init) => {
        const body = JSON.parse(String(init?.body));
        if (String(_input).endsWith('/reconcile')) {
          return Response.json({
            producer: 'parent-coach-desk',
            producerWorkspaceId: body.producerWorkspaceId,
            declaredHighWater: body.declaredHighWater,
            receiverHighWater: body.declaredHighWater,
            missing: [],
            duplicate: [],
            stale: [],
            unauthorized: [],
            mismatch: [],
          });
        }
        expect(init?.headers).toMatchObject({
          'x-ff-producer': 'parent-coach-desk',
          'x-ff-producer-workspace': 'pcd-activity-radar',
          'x-ff-service-scope': 'crm.adapters.pcd.events.v2',
        });
        return Response.json({ accepted: true, receiptId: `receipt-${body.eventId}`, eventId: body.eventId, sequence: body.sequence, replay: false });
      }),
    };
    const delivered = await dispatchPcdCrmOutbox(adapterEnv, {
      fetcher,
      now: Date.parse('2026-09-01T12:00:02.000Z'),
    });
    expect(delivered).toMatchObject({ claimed: 1, delivered: 1, retried: 0, dead: 0 });
    expect(await ops.prepare(`SELECT status,receiver_status FROM crm_adapter_outbox`).first())
      .toEqual({ status: 'delivered', receiver_status: 200 });
    expect((await dispatchPcdCrmOutbox(adapterEnv, {
      fetcher,
      now: Date.parse('2026-09-01T12:00:03.000Z'),
    })).claimed).toBe(0);
    const reconciliation = await reconcilePcdCrmOutbox(adapterEnv, {
      fetcher,
      now: Date.parse('2026-09-01T12:00:04.000Z'),
    });
    expect(reconciliation).toEqual({
      enabled: true, checked: true, clean: true, missing: 0, duplicate: 0, stale: 0, unauthorized: 0, mismatch: 0,
    });
    expect((await ops.prepare(`SELECT COUNT(*) count FROM crm_adapter_reconciliation_receipts`)
      .first<{ count: number }>())?.count).toBe(1);
  });

  it('never reports queued backfill events as missing during ordinary reconciliation', async () => {
    const { ops, intel } = await databases();
    const at = '2026-09-01T12:00:00.000Z';
    await insertOrganizationSeries(intel, { prefix: 'org-reconcile-status-', count: 2, updatedAt: at });
    const adapterEnv = env(ops, intel, { PCD_CRM_BACKFILL_ENABLED: 'true' });
    await projectPcdCrmEvents(adapterEnv, { now: Date.parse(at) + 1, limit: 10 });
    await ops.prepare(`UPDATE crm_adapter_outbox SET status='delivered',receiver_receipt_id='receipt-delivered',
      receiver_status=202,delivered_at=?,updated_at=? WHERE subject_id='org-reconcile-status-000'`)
      .bind(Date.parse(at) + 2, Date.parse(at) + 2).run();

    let reconciledEvents: Array<{eventId:string;sequence:number}>=[];
    const fetcher: CrmAdapterFetcher={fetch:vi.fn(async(_input,init)=>{
      const body=JSON.parse(String(init?.body));
      reconciledEvents=body.events;
      return Response.json({
        producer:'parent-coach-desk',producerWorkspaceId:body.producerWorkspaceId,
        declaredHighWater:body.declaredHighWater,receiverHighWater:body.declaredHighWater,
        missing:[],duplicate:[],stale:[],unauthorized:[],mismatch:[],
      });
    })};

    await expect(reconcilePcdCrmOutbox(adapterEnv,{fetcher,now:Date.parse(at)+3})).resolves.toMatchObject({
      checked:true,clean:true,missing:0,
    });
    expect(reconciledEvents).toHaveLength(1);
    expect(reconciledEvents[0]?.eventId).toContain('org-reconcile-status-000');
  });

  it.each([
    ['by default', undefined],
    ['when an oversized limit is requested', 1_000],
  ])('delivers the approved 25-event service-binding batch %s', async (_case, requestedLimit) => {
    const { ops, intel } = await databases();
    const at = '2026-09-01T12:00:00.000Z';
    await insertOrganizationSeries(intel, { prefix: 'org-bounded-dispatch-', count: 26, updatedAt: at });
    const adapterEnv = env(ops, intel);
    await projectPcdCrmEvents(adapterEnv, { now: Date.parse(at) + 1, limit: 50 });
    const fetcher: CrmAdapterFetcher = { fetch: vi.fn(async (_input, init) => {
      const body = JSON.parse(String(init?.body));
      return Response.json({
        accepted: true,
        receiptId: `receipt-${body.eventId}`,
        eventId: body.eventId,
        sequence: body.sequence,
        replay: false,
      });
    }) };
    await expect(dispatchPcdCrmOutbox(adapterEnv, {
      fetcher,
      now: Date.parse(at) + 2,
      ...(requestedLimit === undefined ? {} : { limit: requestedLimit }),
    }))
      .resolves.toMatchObject({ claimed: 25, delivered: 25, retried: 0, dead: 0 });
    expect(fetcher.fetch).toHaveBeenCalledTimes(25);
    expect((await ops.prepare(`SELECT COUNT(*) count FROM crm_adapter_outbox WHERE status='pending'`)
      .first<{ count: number }>())?.count).toBe(1);
  });

  it('rejects a delivery acknowledgement with foreign or unexpected scope fields', async () => {
    const { ops, intel } = await databases();
    const at = '2026-09-01T12:00:00.000Z';
    await insertOrganization(intel, { id: 'org-forged-ack', updatedAt: at });
    const adapterEnv = env(ops, intel);
    await projectPcdCrmEvents(adapterEnv, { now: Date.parse(at) + 1 });
    const fetcher: CrmAdapterFetcher = { fetch: vi.fn(async (_input, init) => {
      const body = JSON.parse(String(init?.body));
      return Response.json({
        accepted: true,
        receiptId: `receipt-${body.eventId}`,
        eventId: body.eventId,
        sequence: body.sequence,
        replay: false,
        producerWorkspaceId: 'foreign-workspace',
      });
    }) };

    expect(await dispatchPcdCrmOutbox(adapterEnv, { fetcher, now: Date.parse(at) + 2 }))
      .toMatchObject({ delivered: 0, retried: 1 });
    expect(await ops.prepare(`SELECT status,receiver_receipt_id FROM crm_adapter_outbox`).first())
      .toEqual({ status: 'retry', receiver_receipt_id: null });
  });

  it('rejects reconciliation identity and high-water claims outside the sent manifest', async () => {
    const { ops, intel } = await databases();
    const at = '2026-09-01T12:00:00.000Z';
    await insertOrganization(intel, { id: 'org-forged-reconcile', updatedAt: at });
    const adapterEnv = env(ops, intel);
    await projectPcdCrmEvents(adapterEnv, { now: Date.parse(at) + 1 });
    const fetcher: CrmAdapterFetcher = { fetch: vi.fn(async (_input, init) => {
      const body = JSON.parse(String(init?.body));
      return Response.json({
        producer: 'parent-coach-desk',
        producerWorkspaceId: 'foreign-workspace',
        declaredHighWater: body.declaredHighWater,
        receiverHighWater: body.declaredHighWater + 100,
        missing: [], duplicate: [], stale: [], unauthorized: [], mismatch: [],
      });
    }) };

    expect(await reconcilePcdCrmOutbox(adapterEnv, { fetcher, now: Date.parse(at) + 2 }))
      .toEqual({
        enabled: true, checked: false, clean: false, missing: 0, duplicate: 0, stale: 0, unauthorized: 0, mismatch: 0,
      });
    expect((await ops.prepare(`SELECT COUNT(*) count FROM crm_adapter_reconciliation_receipts`)
      .first<{ count: number }>())?.count).toBe(0);
  });

  it('serializes the bounded delivery batch so receiver audit writes cannot contend', async () => {
    const { ops, intel } = await databases();
    const at = '2026-09-01T12:00:00.000Z';
    for (let index = 1; index <= 10; index += 1) {
      await insertOrganization(intel, { id: `org-serialized-${index}`, updatedAt: at });
    }
    const adapterEnv = env(ops, intel);
    await projectPcdCrmEvents(adapterEnv, { now: Date.parse(at) + 1, limit: 10 });
    let inFlight = 0;
    let maxInFlight = 0;
    const fetcher: CrmAdapterFetcher = {
      fetch: vi.fn(async (_input, init) => {
        inFlight += 1;
        maxInFlight = Math.max(maxInFlight, inFlight);
        await new Promise((resolve) => setTimeout(resolve, 1));
        inFlight -= 1;
        const body = JSON.parse(String(init?.body));
        return Response.json({ accepted: true, receiptId: `receipt-${body.eventId}`, eventId: body.eventId, sequence: body.sequence, replay: false });
      }),
    };

    await expect(dispatchPcdCrmOutbox(adapterEnv, {
      fetcher,
      now: Date.parse(at) + 2,
      limit: 10,
    })).resolves.toMatchObject({ claimed: 10, delivered: 10, retried: 0, dead: 0 });
    expect(maxInFlight).toBe(1);
  });

  it('replays an event after an ambiguous response without exhausting its retry budget', async () => {
    const { ops, intel } = await databases();
    const at = '2026-09-01T12:00:00.000Z';
    await insertOrganization(intel, { id: 'org-ambiguous-response', updatedAt: at });
    const adapterEnv = env(ops, intel);
    await projectPcdCrmEvents(adapterEnv, { now: Date.parse(at) + 1 });

    let acceptedEventId = '';
    let loseFirstResponse = true;
    const fetcher: CrmAdapterFetcher = {
      fetch: vi.fn(async (_input, init) => {
        const body = JSON.parse(String(init?.body)) as { eventId: string; sequence: number };
        if (loseFirstResponse) {
          loseFirstResponse = false;
          acceptedEventId = body.eventId;
          throw new DOMException('response lost after receiver commit', 'AbortError');
        }
        expect(body.eventId).toBe(acceptedEventId);
        return Response.json({ accepted: true, receiptId: `receipt-${body.eventId}`, eventId: body.eventId, sequence: body.sequence, replay: false });
      }),
    };

    const first = await dispatchPcdCrmOutbox(adapterEnv, {
      fetcher,
      now: Date.parse(at) + 2,
      limit: 1,
    });
    expect(first).toMatchObject({ claimed: 1, delivered: 0, retried: 1, dead: 0 });
    const replay = await dispatchPcdCrmOutbox(adapterEnv, {
      fetcher,
      now: Date.parse(at) + 30_003,
      limit: 1,
    });
    expect(replay).toMatchObject({ claimed: 1, delivered: 1, retried: 0, dead: 0 });
    expect(await ops.prepare(`SELECT status,attempt_count,receiver_receipt_id,last_error_code
      FROM crm_adapter_outbox`).first()).toEqual({
      status: 'delivered',
      attempt_count: 2,
      receiver_receipt_id: `receipt-${acceptedEventId}`,
      last_error_code: null,
    });
  });

  it('claims the oldest due rows through the partial source-sequence index', async () => {
    const { ops } = await databases();
    const plan = await ops.prepare(`EXPLAIN QUERY PLAN SELECT id FROM crm_adapter_outbox
      INDEXED BY idx_crm_adapter_outbox_claim_sequence
      WHERE producer_workspace_id=? AND cancelled_at IS NULL AND status IN ('pending','retry','leased','dead')
      ORDER BY source_sequence LIMIT ?`).bind('pcd-activity-radar', 10).all<{ detail: string }>();
    const detail = plan.results.map((row) => row.detail).join('\n');
    expect(detail).toContain('SEARCH crm_adapter_outbox USING INDEX idx_crm_adapter_outbox_claim_sequence');
    expect(detail).not.toContain('USE TEMP B-TREE FOR ORDER BY');
  });

  it('uses the bounded backfill index for delivered reconciliation windows', async () => {
    const { ops } = await databases();
    const plan = await ops.prepare(`EXPLAIN QUERY PLAN SELECT event_id,source_sequence,event_type,payload_hash
      FROM crm_adapter_outbox WHERE backfill_run_id=? AND status='delivered' AND source_sequence>?
      ORDER BY source_sequence LIMIT 100`).bind('run', 0).all<{ detail: string }>();
    const detail = plan.results.map((row) => row.detail).join('\n');
    expect(detail).toContain('SEARCH crm_adapter_outbox USING INDEX idx_crm_adapter_outbox_backfill');
    expect(detail).not.toContain('USE TEMP B-TREE FOR ORDER BY');
  });

  it('uses bounded monotonic revision indexes for normal source projection', async () => {
    const { ops, intel } = await databases();
    const organizationPlan = await intel.prepare(`EXPLAIN QUERY PLAN SELECT id
      FROM organizations INDEXED BY idx_organizations_crm_projection_revision
      WHERE crm_projection_revision>0 AND crm_projection_revision>?
      ORDER BY crm_projection_revision LIMIT ?`)
      .bind(0, 50).all<{ detail: string }>();
    const contactPlan = await ops.prepare(`EXPLAIN QUERY PLAN SELECT id
      FROM org_contacts INDEXED BY idx_org_contacts_crm_projection_revision
      WHERE crm_projection_revision>0 AND crm_projection_revision>?
      ORDER BY crm_projection_revision LIMIT ?`)
      .bind(0, 50).all<{ detail: string }>();

    for (const detail of [organizationPlan, contactPlan]
      .map((plan) => plan.results.map((row) => row.detail).join('\n'))) {
      expect(detail).toMatch(/SEARCH .* USING (?:COVERING )?INDEX/);
      expect(detail).not.toContain('USE TEMP B-TREE FOR ORDER BY');
    }
  });

  it('uses creation-time keyset indexes for bounded historical projection', async () => {
    const { ops, intel } = await databases();
    const organizationSameSecondPlan = await intel.prepare(`EXPLAIN QUERY PLAN SELECT id
      FROM organizations INDEXED BY idx_organizations_crm_backfill_created
      WHERE unixepoch(created_at)=? AND id>? AND unixepoch(created_at)<?
      ORDER BY id LIMIT ?`)
      .bind(-1, '', 2_000_000_000, 50).all<{ detail: string }>();
    const organizationLaterPlan = await intel.prepare(`EXPLAIN QUERY PLAN SELECT id
      FROM organizations INDEXED BY idx_organizations_crm_backfill_created
      WHERE unixepoch(created_at)>? AND unixepoch(created_at)<?
      ORDER BY unixepoch(created_at),id LIMIT ?`)
      .bind(-1, 2_000_000_000, 50).all<{ detail: string }>();
    const contactSameSecondPlan = await ops.prepare(`EXPLAIN QUERY PLAN SELECT id
      FROM org_contacts INDEXED BY idx_org_contacts_crm_backfill_created
      WHERE unixepoch(created_at)=? AND id>? AND unixepoch(created_at)<?
      ORDER BY id LIMIT ?`)
      .bind(-1, '', 2_000_000_000, 50).all<{ detail: string }>();
    const contactLaterPlan = await ops.prepare(`EXPLAIN QUERY PLAN SELECT id
      FROM org_contacts INDEXED BY idx_org_contacts_crm_backfill_created
      WHERE unixepoch(created_at)>? AND unixepoch(created_at)<?
      ORDER BY unixepoch(created_at),id LIMIT ?`)
      .bind(-1, 2_000_000_000, 50).all<{ detail: string }>();

    for (const detail of [organizationSameSecondPlan, organizationLaterPlan, contactSameSecondPlan, contactLaterPlan]
      .map((plan) => plan.results.map((row) => row.detail).join('\n'))) {
      expect(detail).toMatch(/SEARCH .* USING (?:COVERING )?INDEX/);
      expect(detail).not.toContain('MULTI-INDEX OR');
      expect(detail).not.toContain('USE TEMP B-TREE FOR ORDER BY');
    }
  });

  it('uses bounded indexes for safety delivery, prior targets, and active backfill lookup', async () => {
    const { ops } = await databases();
    const safetyPlan = await ops.prepare(`EXPLAIN QUERY PLAN SELECT id,source_sequence
      FROM crm_adapter_outbox INDEXED BY idx_crm_adapter_outbox_safety_sequence
      WHERE producer_workspace_id=? AND cancelled_at IS NULL AND event_type='contact.deleted.v1'
        AND status IN ('pending','retry','leased')
      ORDER BY source_sequence LIMIT ?`).bind('pcd-activity-radar', 10).all<{ detail: string }>();
    const targetPlan = await ops.prepare(`EXPLAIN QUERY PLAN SELECT target_workspace_id
      FROM crm_adapter_outbox INDEXED BY idx_crm_adapter_outbox_contact_targets
      WHERE producer_workspace_id=? AND subject_type='contact' AND event_type='contact.observed.v1'
        AND subject_id=? AND target_workspace_id>? AND (status='delivered' OR send_attempt_count>0)
      GROUP BY target_workspace_id ORDER BY target_workspace_id LIMIT ?`)
      .bind('pcd-activity-radar', 'contact-one', '', 10).all<{ detail: string }>();
    const backfillPlan = await ops.prepare(`EXPLAIN QUERY PLAN SELECT subject.run_id
      FROM crm_adapter_backfill_subjects subject
      JOIN crm_adapter_backfill_runs run ON run.id=subject.run_id AND run.status!='completed'
      WHERE subject.subject_type='contact' AND subject.subject_id=? LIMIT 1`)
      .bind('contact-one').all<{ detail: string }>();
    const retractionPlan = await ops.prepare(`EXPLAIN QUERY PLAN SELECT id
      FROM crm_contact_retraction_runs INDEXED BY idx_crm_contact_retraction_pending
      WHERE producer_workspace_id=? AND status='pending' ORDER BY created_at,id LIMIT 1`)
      .bind('pcd-activity-radar').all<{ detail: string }>();

    for (const detail of [safetyPlan, targetPlan, backfillPlan, retractionPlan]
      .map((plan) => plan.results.map((row) => row.detail).join('\n'))) {
      expect(detail).toMatch(/USING (?:COVERING )?INDEX/);
      expect(detail).not.toContain('SCAN crm_adapter_outbox');
      expect(detail).not.toContain('USE TEMP B-TREE');
    }
  });

  it('does not skip a same-record update later in the same second', async () => {
    const { ops, intel } = await databases();
    const firstAt = '2026-09-01T12:00:00.100Z';
    const secondAt = '2026-09-01T12:00:00.900Z';
    await insertOrganization(intel, { id: 'org-same-millisecond', updatedAt: firstAt, name: 'Before' });
    await insertContact(ops, { id: 'contact-same-millisecond', organizationId: 'org-same-millisecond', updatedAt: firstAt });
    const adapterEnv = env(ops, intel);
    expect(await projectPcdCrmEvents(adapterEnv, { now: Date.parse(firstAt) + 1, limit: 10 }))
      .toMatchObject({ organizations: 1, contacts: 1 });

    await intel.prepare(`UPDATE organizations SET name='After',updated_at=? WHERE id='org-same-millisecond'`)
      .bind(secondAt).run();
    await ops.prepare(`UPDATE org_contacts SET title='Executive Director',updated_at=? WHERE id='contact-same-millisecond'`)
      .bind(secondAt).run();

    expect(await projectPcdCrmEvents(adapterEnv, { now: Date.parse(secondAt) + 1, limit: 10 }))
      .toMatchObject({ organizations: 1, contacts: 1 });
    expect((await ops.prepare(`SELECT COUNT(*) count FROM crm_adapter_outbox`).first<{ count: number }>())?.count).toBe(4);
  });

  it('emits every canonical organization revision even with a stale stored hash and an A-B-A value cycle', async () => {
    const { ops, intel } = await databases();
    const adapterEnv = env(ops, intel);
    await insertOrganization(intel, { id: 'org-revision-identity', updatedAt: '2026-09-01T12:00:00.100Z', name: 'Before' });
    await intel.prepare(`UPDATE organizations SET content_hash=? WHERE id='org-revision-identity'`).bind('a'.repeat(64)).run();
    await projectPcdCrmEvents(adapterEnv, { now: Date.parse('2026-09-01T12:00:00.100Z') + 1 });
    await intel.prepare(`UPDATE organizations SET name='After',updated_at='2026-09-01T12:00:00.200Z'
      WHERE id='org-revision-identity'`).run();
    await projectPcdCrmEvents(adapterEnv, { now: Date.parse('2026-09-01T12:00:00.200Z') + 1 });
    await intel.prepare(`UPDATE organizations SET name='Before',updated_at='2026-09-01T12:00:00.300Z'
      WHERE id='org-revision-identity'`).run();
    await projectPcdCrmEvents(adapterEnv, { now: Date.parse('2026-09-01T12:00:00.300Z') + 1 });
    const events = await ops.prepare(`SELECT event_id,payload_json FROM crm_adapter_outbox
      WHERE subject_id='org-revision-identity' ORDER BY source_sequence`).all<{ event_id: string; payload_json: string }>();
    expect(events.results.map((row) => JSON.parse(row.payload_json).payload.displayName)).toEqual(['Before', 'After', 'Before']);
    expect(new Set(events.results.map((row) => row.event_id)).size).toBe(3);
  });

  it('does not let a later event overtake an older event in backoff', async () => {
    const { ops, intel } = await databases();
    const at = Date.parse('2026-09-01T12:00:00.000Z');
    await insertOrganization(intel, { id: 'org-order-first', updatedAt: new Date(at).toISOString() });
    await insertOrganization(intel, { id: 'org-order-second', updatedAt: new Date(at).toISOString() });
    const adapterEnv = env(ops, intel);
    await projectPcdCrmEvents(adapterEnv, { now: at + 1, limit: 10 });
    await ops.prepare(`UPDATE crm_adapter_outbox SET status='retry',next_attempt_at=? WHERE source_sequence=1`)
      .bind(at + 60_000).run();
    const deliveredSequences: number[] = [];
    const fetcher: CrmAdapterFetcher = { fetch: vi.fn(async (_input, init) => {
      const body = JSON.parse(String(init?.body));
      deliveredSequences.push(body.sequence);
      return Response.json({ accepted: true, receiptId: `ordered-${body.eventId}`, eventId: body.eventId, sequence: body.sequence, replay: false });
    }) };
    expect(await dispatchPcdCrmOutbox(adapterEnv, { fetcher, now: at + 2 })).toMatchObject({ claimed: 0 });
    expect(await dispatchPcdCrmOutbox(adapterEnv, { fetcher, now: at + 60_001 })).toMatchObject({ delivered: 2 });
    expect(deliveredSequences).toEqual([1, 2]);
  });

  it('releases the remainder of a claimed batch when its first delivery must retry', async () => {
    const { ops, intel } = await databases();
    const at = Date.parse('2026-09-01T12:00:00.000Z');
    await insertOrganization(intel, { id: 'org-claimed-first', updatedAt: new Date(at).toISOString() });
    await insertOrganization(intel, { id: 'org-claimed-second', updatedAt: new Date(at).toISOString() });
    const adapterEnv = env(ops, intel);
    await projectPcdCrmEvents(adapterEnv, { now: at + 1, limit: 10 });
    const fetcher: CrmAdapterFetcher = { fetch: vi.fn(async () => Response.json({ error: 'retry' }, { status: 503 })) };

    expect(await dispatchPcdCrmOutbox(adapterEnv, { fetcher, now: at + 2, limit: 10 }))
      .toMatchObject({ claimed: 2, delivered: 0, retried: 1, dead: 0 });
    expect(await ops.prepare(`SELECT status,attempt_count FROM crm_adapter_outbox ORDER BY source_sequence`).all())
      .toMatchObject({ results: [
        { status: 'retry', attempt_count: 1 },
        { status: 'pending', attempt_count: 0 },
      ] });
    expect(fetcher.fetch).toHaveBeenCalledTimes(1);
  });

  it('never claims another producer workspace outbox row', async () => {
    const { ops, intel } = await databases();
    const at = Date.parse('2026-09-01T12:00:00.000Z');
    await insertOrganization(intel, { id: 'org-foreign-producer', updatedAt: new Date(at).toISOString() });
    const adapterEnv = env(ops, intel);
    await projectPcdCrmEvents(adapterEnv, { now: at + 1 });
    await ops.prepare(`UPDATE crm_adapter_outbox SET producer_workspace_id='foreign-workspace'`).run();
    const fetcher: CrmAdapterFetcher = { fetch: vi.fn(async () => Response.json({ accepted: true })) };
    expect(await dispatchPcdCrmOutbox(adapterEnv, { fetcher, now: at + 2 })).toMatchObject({ claimed: 0 });
    expect(fetcher.fetch).not.toHaveBeenCalled();
  });

  it('emits a distinct suppression event when a professional contact opts out', async () => {
    const { ops, intel } = await databases();
    const adapterEnv = env(ops, intel);
    await readyOrganizationProjection(ops, intel, adapterEnv, 'org-suppression');
    const result = await upsertOrgContact(adapterEnv, {
      organizationId: 'org-suppression', fullName: 'Morgan Director', role: 'director',
      email: 'morgan@org-suppression.example', source: 'website',
      sourceUrl: 'https://org-suppression.example/staff', contactContext: 'professional',
    });
    expect(result.ok).toBe(true);
    await publishContactForTest(ops, adapterEnv, result.ok ? result.id : '');
    const deliveredFetcher: CrmAdapterFetcher = { fetch: vi.fn(async (_input, init) => {
      const body = JSON.parse(String(init?.body));
      return Response.json({ accepted: true, receiptId: `receipt-${body.eventId}`, eventId: body.eventId, sequence: body.sequence, replay: false });
    }) };
    await expect(dispatchPcdCrmOutbox(adapterEnv, { fetcher: deliveredFetcher, now: Date.now(), limit: 1 }))
      .resolves.toMatchObject({ delivered: 1 });
    expect(await setDoNotContact(adapterEnv, result.ok ? result.id : '', 'unsubscribed')).toBe(true);
    const events = await ops.prepare(`SELECT event_id,event_type,payload_json FROM crm_adapter_outbox
      WHERE subject_id=? ORDER BY source_sequence`).bind(result.ok ? result.id : '').all<{
        event_id: string; event_type: string; payload_json: string;
      }>();
    expect(events.results).toHaveLength(2);
    expect(events.results[0]?.event_id).not.toBe(events.results[1]?.event_id);
    expect(events.results[1]?.event_type).toBe('contact.deleted.v1');
    expect(events.results[1]?.payload_json).not.toContain('morgan@org-suppression.example');
  });

  it('removes unsent observed PII when a professional contact is suppressed before dispatch', async () => {
    const { ops, intel } = await databases();
    const adapterEnv = env(ops, intel);
    await readyOrganizationProjection(ops, intel, adapterEnv, 'org-unsent-suppression');
    const result = await upsertOrgContact(adapterEnv, {
      organizationId: 'org-unsent-suppression', fullName: 'Private Contact', role: 'director',
      email: 'private@org-unsent-suppression.example', source: 'website',
      sourceUrl: 'https://org-unsent-suppression.example/staff', contactContext: 'professional',
    });
    expect(result.ok).toBe(true);
    expect(await setDoNotContact(adapterEnv, result.ok ? result.id : '', 'unsubscribed')).toBe(true);
    const rows = await ops.prepare(`SELECT event_type,payload_json FROM crm_adapter_outbox WHERE subject_id=?`)
      .bind(result.ok ? result.id : '').all<{ event_type: string; payload_json: string }>();
    expect(rows.results.map((row) => row.event_type)).toEqual(['contact.deleted.v1']);
    expect(JSON.parse(rows.results[0]?.payload_json ?? '{}').payload).toMatchObject({
      id: result.ok ? result.id : '',
      suppressionState: 'do_not_contact',
    });
    expect(JSON.stringify(rows.results)).not.toContain('private@org-unsent-suppression.example');
  });

  it('does not mint an unsuppressed identity when a phone-only DNC contact is rediscovered', async () => {
    const { ops, intel } = await databases();
    const adapterEnv = env(ops, intel);
    const first = await upsertOrgContact(adapterEnv, {
      organizationId: 'org-phone-dnc', fullName: 'Phone Contact', role: 'director',
      phone: '+1 (555) 555-0199', source: 'website', sourceUrl: 'https://org-phone-dnc.example/staff',
      contactContext: 'professional',
    });
    expect(first.ok).toBe(true);
    expect(await setDoNotContact(adapterEnv, first.ok ? first.id : '', 'unsubscribed')).toBe(true);
    await expect(upsertOrgContact(adapterEnv, {
      organizationId: 'org-phone-dnc', fullName: 'Rediscovered Contact', role: 'coach',
      phone: '+1 (555) 555-0199', source: 'website', sourceUrl: 'https://org-phone-dnc.example/new',
      contactContext: 'professional',
    })).resolves.toEqual({ ok: false, reason: 'suppressed' });
    expect(await ops.prepare(`SELECT COUNT(*) count FROM org_contacts
      WHERE organization_id='org-phone-dnc'`).first()).toEqual({ count: 1 });
  });

  it('does not mint an unsuppressed identity when a deleted DNC email is rediscovered', async () => {
    const { ops, intel } = await databases();
    const adapterEnv = env(ops, intel);
    const first = await upsertOrgContact(adapterEnv, {
      organizationId: 'org-deleted-dnc', fullName: 'Deleted Contact', role: 'director',
      email: 'deleted@org-deleted-dnc.example', source: 'website',
      sourceUrl: 'https://org-deleted-dnc.example/staff', contactContext: 'professional',
    });
    expect(first.ok).toBe(true);
    expect(await setDoNotContact(adapterEnv, first.ok ? first.id : '', 'privacy_request')).toBe(true);
    expect(await softDeleteOrgContact(adapterEnv, first.ok ? first.id : '')).toBe(true);
    await expect(upsertOrgContact(adapterEnv, {
      organizationId: 'org-deleted-dnc', fullName: 'Rediscovered Contact', role: 'coach',
      email: 'deleted@org-deleted-dnc.example', source: 'website',
      sourceUrl: 'https://org-deleted-dnc.example/new', contactContext: 'professional',
    })).resolves.toEqual({ ok: false, reason: 'suppressed' });
    expect(await ops.prepare(`SELECT COUNT(*) count FROM org_contacts
      WHERE organization_id='org-deleted-dnc'`).first()).toEqual({ count: 1 });
  });

  it('does not mint an unsuppressed identity when the same named DNC contact is found on another channel', async () => {
    const { ops, intel } = await databases();
    const adapterEnv = env(ops, intel);
    const first = await upsertOrgContact(adapterEnv, {
      organizationId: 'org-cross-channel-dnc', fullName: 'Cross Channel Contact', role: 'director',
      email: 'cross-channel@org.example', source: 'website', sourceUrl: 'https://org.example/staff',
      contactContext: 'professional',
    });
    expect(first.ok).toBe(true);
    expect(await setDoNotContact(adapterEnv, first.ok ? first.id : '', 'privacy_request')).toBe(true);
    await expect(upsertOrgContact(adapterEnv, {
      organizationId: 'org-cross-channel-dnc', fullName: '  CROSS   CHANNEL CONTACT ', role: 'director',
      phone: '+1 555 555 0107', source: 'website', sourceUrl: 'https://org.example/directory',
      contactContext: 'professional',
    })).resolves.toEqual({ ok: false, reason: 'suppressed' });
    expect(await ops.prepare(`SELECT COUNT(*) count FROM org_contacts
      WHERE organization_id='org-cross-channel-dnc'`).first()).toEqual({ count: 1 });
  });

  it('reports a missing contact instead of falsely succeeding a do-not-contact mutation', async () => {
    const { ops, intel } = await databases();
    await expect(setDoNotContact(env(ops, intel), 'contact-does-not-exist', 'privacy_request')).resolves.toBe(false);
    expect(await ops.prepare(`SELECT COUNT(*) count FROM crm_adapter_outbox
      WHERE subject_id='contact-does-not-exist'`).first()).toEqual({ count: 0 });
  });

  it('retracts a previously projected contact when it is reclassified as minor', async () => {
    const { ops, intel } = await databases();
    const adapterEnv = env(ops, intel);
    await readyOrganizationProjection(ops, intel, adapterEnv, 'org-context-retraction');
    const result = await upsertOrgContact(adapterEnv, {
      organizationId: 'org-context-retraction', fullName: 'Morgan Director', role: 'director',
      email: 'morgan@org-context-retraction.example', source: 'website',
      sourceUrl: 'https://org-context-retraction.example/staff', contactContext: 'professional',
    });
    expect(result.ok).toBe(true);
    await publishContactForTest(ops, adapterEnv, result.ok ? result.id : '');
    const deliveredFetcher: CrmAdapterFetcher = { fetch: vi.fn(async (_input, init) => {
      const body = JSON.parse(String(init?.body));
      return Response.json({ accepted: true, receiptId: `receipt-${body.eventId}`, eventId: body.eventId, sequence: body.sequence, replay: false });
    }) };
    await expect(dispatchPcdCrmOutbox(adapterEnv, { fetcher: deliveredFetcher, now: Date.now(), limit: 1 }))
      .resolves.toMatchObject({ delivered: 1 });
    await expect(upsertOrgContact(adapterEnv, {
      organizationId: 'org-context-retraction', fullName: 'Morgan Director', role: 'director',
      email: 'morgan@org-context-retraction.example', source: 'website',
      sourceUrl: 'https://org-context-retraction.example/staff', contactContext: 'minor',
    })).resolves.toMatchObject({ ok: true, created: false });

    const events = await ops.prepare(`SELECT event_type,payload_json FROM crm_adapter_outbox
      WHERE subject_id=? ORDER BY source_sequence`).bind(result.ok ? result.id : '').all<{
        event_type: string; payload_json: string;
      }>();
    expect(events.results.map((row) => row.event_type)).toEqual(['contact.observed.v1', 'contact.deleted.v1']);
    expect(events.results[1]?.payload_json).not.toContain('morgan@org-context-retraction.example');
  });

  it('removes unsent observed PII when a contact is reclassified before dispatch', async () => {
    const { ops, intel } = await databases();
    const adapterEnv = env(ops, intel);
    await readyOrganizationProjection(ops, intel, adapterEnv, 'org-unsent-retraction');
    const result = await upsertOrgContact(adapterEnv, {
      organizationId: 'org-unsent-retraction', fullName: 'Private Person', role: 'director',
      email: 'private.person@org-unsent-retraction.example', source: 'website',
      sourceUrl: 'https://org-unsent-retraction.example/staff', contactContext: 'professional',
    });
    expect(result.ok).toBe(true);
    await expect(upsertOrgContact(adapterEnv, {
      organizationId: 'org-unsent-retraction', fullName: 'Private Person', role: 'director',
      email: 'private.person@org-unsent-retraction.example', source: 'website',
      sourceUrl: 'https://org-unsent-retraction.example/staff', contactContext: 'minor',
    })).resolves.toMatchObject({ ok: true, created: false });

    const stored = await ops.prepare(`SELECT event_type,payload_json FROM crm_adapter_outbox
      WHERE subject_id=? ORDER BY source_sequence`).bind(result.ok ? result.id : '').all<{
        event_type: string; payload_json: string;
      }>();
    expect(stored.results.map((row) => row.event_type)).toEqual([]);
    expect(JSON.stringify(stored.results)).not.toContain('private.person@org-unsent-retraction.example');

    const received: string[] = [];
    const fetcher: CrmAdapterFetcher = { fetch: vi.fn(async (_input, init) => {
      const body = String(init?.body);
      received.push(body);
      const event = JSON.parse(body);
      return Response.json({ accepted: true, receiptId: `receipt-${event.eventId}`, eventId: event.eventId, sequence: event.sequence, replay: false });
    }) };
    await expect(dispatchPcdCrmOutbox(adapterEnv, { fetcher, now: Date.now(), limit: 10 }))
      .resolves.toMatchObject({ delivered: 0 });
    expect(received.join('\n')).not.toContain('private.person@org-unsent-retraction.example');
  });

  it('allows a suppressed contact to be safety-downgraded without changing its PII', async () => {
    const { ops, intel } = await databases();
    const adapterEnv = env(ops, intel);
    await readyOrganizationProjection(ops, intel, adapterEnv, 'org-suppressed-minor');
    const result = await upsertOrgContact(adapterEnv, {
      organizationId: 'org-suppressed-minor', fullName: 'Original Name', role: 'director',
      email: 'original@org-suppressed-minor.example', source: 'website',
      sourceUrl: 'https://org-suppressed-minor.example/staff', contactContext: 'professional',
    });
    expect(result.ok).toBe(true);
    expect(await setDoNotContact(adapterEnv, result.ok ? result.id : '', 'unsubscribed')).toBe(true);

    await expect(upsertOrgContact(adapterEnv, {
      organizationId: 'org-suppressed-minor', fullName: 'Replacement Name', role: 'coach',
      email: 'original@org-suppressed-minor.example', phone: '+15555550199', source: 'website',
      sourceUrl: 'https://attacker.example/roster', contactContext: 'minor',
    })).resolves.toMatchObject({ ok: true, created: false });
    expect(await ops.prepare(`SELECT full_name,role,email,phone,source_url,do_not_contact,contact_context
      FROM org_contacts WHERE id=?`).bind(result.ok ? result.id : '').first()).toEqual({
      full_name: 'Original Name', role: 'director', email: 'original@org-suppressed-minor.example', phone: null,
      source_url: 'https://org-suppressed-minor.example/staff', do_not_contact: 1, contact_context: 'minor',
    });
    const queued = await ops.prepare(`SELECT event_type,payload_json FROM crm_adapter_outbox WHERE subject_id=?
      ORDER BY source_sequence`).bind(result.ok ? result.id : '').all<{ event_type: string; payload_json: string }>();
    expect(queued.results).toHaveLength(1);
    expect(queued.results[0]?.event_type).toBe('contact.deleted.v1');
    expect(JSON.parse(queued.results[0]?.payload_json ?? '{}').payload.suppressionState).toBe('do_not_contact');
    expect(JSON.stringify(queued.results)).not.toContain('original@org-suppressed-minor.example');
    expect(JSON.stringify(queued.results)).not.toContain('Replacement Name');
  });

  it.each([
    ['reclassification', async (adapterEnv: PcdCrmAdapterEnv, id: string) => {
      const result = await upsertOrgContact(adapterEnv, {
        organizationId: 'org-leased-safety', fullName: 'Leased Contact', role: 'director',
        email: 'leased@org-leased-safety.example', source: 'website',
        sourceUrl: 'https://org-leased-safety.example/staff', contactContext: 'minor',
      });
      expect(result).toMatchObject({ ok: true, id, created: false });
      expect(await adapterEnv.PCD_OPS_DB?.prepare(`SELECT contact_context FROM org_contacts WHERE id=?`)
        .bind(id).first()).toEqual({ contact_context: 'minor' });
    }],
    ['suppression', async (adapterEnv: PcdCrmAdapterEnv, id: string) => {
      await expect(setDoNotContact(adapterEnv, id, 'privacy_request')).resolves.toBe(true);
      expect(await adapterEnv.PCD_OPS_DB?.prepare(`SELECT do_not_contact FROM org_contacts WHERE id=?`)
        .bind(id).first()).toEqual({ do_not_contact: 1 });
    }],
    ['soft deletion', async (adapterEnv: PcdCrmAdapterEnv, id: string) => {
      await expect(softDeleteOrgContact(adapterEnv, id)).resolves.toBe(true);
      expect(await adapterEnv.PCD_OPS_DB?.prepare(`SELECT deleted_at FROM org_contacts WHERE id=?`)
        .bind(id).first()).toMatchObject({ deleted_at: expect.any(String) });
    }],
  ])('commits a canonical safety %s while its observed event is leased and durably sequences a retraction', async (_label, applySafetyMutation) => {
    const { ops, intel } = await databases();
    const adapterEnv = env(ops, intel);
    await readyOrganizationProjection(ops, intel, adapterEnv, 'org-leased-safety');
    const result = await upsertOrgContact(adapterEnv, {
      organizationId: 'org-leased-safety', fullName: 'Leased Contact', role: 'director',
      email: 'leased@org-leased-safety.example', source: 'website',
      sourceUrl: 'https://org-leased-safety.example/staff', contactContext: 'professional',
    });
    expect(result.ok).toBe(true);
    await publishContactForTest(ops, adapterEnv, result.ok ? result.id : '');
    let release!: () => void;
    const held = new Promise<void>((resolve) => { release = resolve; });
    let started!: () => void;
    const requestStarted = new Promise<void>((resolve) => { started = resolve; });
    const fetcher: CrmAdapterFetcher = { fetch: vi.fn(async (_input, init) => {
      started();
      await held;
      const body = JSON.parse(String(init?.body));
      return Response.json({ accepted: true, receiptId: `receipt-${body.eventId}`, eventId: body.eventId, sequence: body.sequence, replay: false });
    }) };
    const delivery = dispatchPcdCrmOutbox(adapterEnv, { fetcher, now: Date.now(), limit: 1 });
    await requestStarted;
    const id = result.ok ? result.id : '';
    await applySafetyMutation(adapterEnv, id);
    expect(await ops.prepare(`SELECT event_type,status,payload_json FROM crm_adapter_outbox WHERE subject_id=?
      ORDER BY source_sequence`).bind(id).all()).toMatchObject({ results: [
        { event_type: 'contact.observed.v1', status: 'leased' },
        { event_type: 'contact.deleted.v1', status: 'pending', payload_json: expect.not.stringContaining('leased@org-leased-safety.example') },
      ] });
    release();
    await expect(delivery).resolves.toMatchObject({ claimed: 1, delivered: 1 });
    expect(await ops.prepare(`SELECT status,receiver_receipt_id FROM crm_adapter_outbox
      WHERE event_type='contact.observed.v1' AND subject_id=?`).bind(id).first())
      .toMatchObject({ status: 'delivered', receiver_receipt_id: expect.any(String) });
    await expect(dispatchPcdCrmOutbox(adapterEnv, { fetcher, now: Date.now(), limit: 1 }))
      .resolves.toMatchObject({ claimed: 1, delivered: 1 });
    expect(await ops.prepare(`SELECT event_type,status,payload_json FROM crm_adapter_outbox ORDER BY source_sequence DESC LIMIT 1`).first())
      .toMatchObject({ event_type: 'contact.deleted.v1', status: 'delivered', payload_json: expect.not.stringContaining('leased@org-leased-safety.example') });
  });

  it('cancels a claimed contact that has not started sending before committing its safety mutation', async () => {
    const { ops, intel } = await databases();
    const adapterEnv = env(ops, intel);
    await readyOrganizationProjection(ops, intel, adapterEnv, 'org-claimed-cancel');
    const first = await upsertOrgContact(adapterEnv, {
      organizationId: 'org-claimed-cancel', fullName: 'First Contact', role: 'director',
      email: 'first@org-claimed-cancel.example', source: 'website',
      sourceUrl: 'https://org-claimed-cancel.example/staff', contactContext: 'professional',
    });
    const second = await upsertOrgContact(adapterEnv, {
      organizationId: 'org-claimed-cancel', fullName: 'Second Contact', role: 'director',
      email: 'second@org-claimed-cancel.example', source: 'website',
      sourceUrl: 'https://org-claimed-cancel.example/staff', contactContext: 'professional',
    });
    expect(first.ok && second.ok).toBe(true);
    await publishContactForTest(ops, adapterEnv, first.ok ? first.id : '');
    await publishContactForTest(ops, adapterEnv, second.ok ? second.id : '');
    let release!: () => void;
    const held = new Promise<void>((resolve) => { release = resolve; });
    let firstStarted!: () => void;
    const started = new Promise<void>((resolve) => { firstStarted = resolve; });
    const received: string[] = [];
    const fetcher: CrmAdapterFetcher = { fetch: vi.fn(async (_input, init) => {
      const body = String(init?.body);
      received.push(body);
      if (received.length === 1) {
        firstStarted();
        await held;
      }
      const event = JSON.parse(body);
      return Response.json({ accepted: true, receiptId: `receipt-${event.eventId}`, eventId: event.eventId, sequence: event.sequence, replay: false });
    }) };
    const delivery = dispatchPcdCrmOutbox(adapterEnv, { fetcher, now: Date.now(), limit: 2 });
    await started;
    await expect(upsertOrgContact(adapterEnv, {
      organizationId: 'org-claimed-cancel', fullName: 'Second Contact', role: 'director',
      email: 'second@org-claimed-cancel.example', source: 'website',
      sourceUrl: 'https://org-claimed-cancel.example/staff', contactContext: 'minor',
    })).resolves.toMatchObject({ ok: true, created: false });
    release();
    await expect(delivery).resolves.toMatchObject({ claimed: 2, delivered: 1 });
    expect(received).toHaveLength(1);
    expect(received.join('\n')).not.toContain('second@org-claimed-cancel.example');
    expect(await ops.prepare(`SELECT COUNT(*) count FROM crm_adapter_outbox WHERE subject_id=?`)
      .bind(second.ok ? second.id : '').first()).toEqual({ count: 0 });
  });

  it('retracts every historical target through bounded durable pages', async () => {
    const { ops, intel } = await databases();
    const at = Date.parse('2026-09-03T12:00:00.000Z');
    await insertContact(ops, { id: 'contact-many-targets', organizationId: 'org-many-targets', updatedAt: new Date(at).toISOString() });
    const statements = Array.from({ length: 25 }, (_, index) => ops.prepare(`INSERT INTO crm_adapter_outbox
      (id,producer_workspace_id,event_id,source_sequence,event_type,subject_type,subject_id,authority_updated_at,
        payload_json,payload_hash,idempotency_key,status,attempt_count,next_attempt_at,receiver_receipt_id,receiver_status,
        delivered_at,created_at,updated_at,target_workspace_id,send_attempt_count)
      VALUES (?,?,?,?,?,'contact','contact-many-targets',?,'{}',?,?, 'delivered',1,0,?,202,?,?,?, ?,1)`)
      .bind(
        `many-target-row-${index}`, 'pcd-activity-radar', `many-target-event-${index}`, index + 1,
        'contact.observed.v1', at, 'a'.repeat(64), `many-target-key-${index}`, `receipt-${index}`,
        at, at, at, `workspace-${String(index).padStart(2, '0')}`,
      ));
    statements.push(ops.prepare(`INSERT INTO crm_adapter_controls
      (producer_workspace_id,next_sequence,updated_at) VALUES ('pcd-activity-radar',26,?)`).bind(at));
    await ops.batch(statements);
    const adapterEnv = env(ops, intel);
    await expect(setDoNotContact(adapterEnv, 'contact-many-targets', 'privacy_request')).resolves.toBe(true);
    expect(await ops.prepare(`SELECT do_not_contact FROM org_contacts WHERE id='contact-many-targets'`).first())
      .toEqual({ do_not_contact: 1 });
    expect(await ops.prepare(`SELECT COUNT(*) count FROM crm_adapter_outbox
      WHERE subject_id='contact-many-targets' AND event_type='contact.deleted.v1'`).first()).toEqual({ count: 10 });
    expect(await ops.prepare(`SELECT status FROM crm_contact_retraction_runs WHERE subject_id='contact-many-targets'`).first())
      .toEqual({ status: 'pending' });
    const fetcher: CrmAdapterFetcher = { fetch: vi.fn(async (_input, init) => {
      const body = JSON.parse(String(init?.body));
      return Response.json({ accepted: true, receiptId: `receipt-${body.eventId}`, eventId: body.eventId, sequence: body.sequence, replay: false });
    }) };
    const dispatchAt = Date.now() + 1_000;
    await dispatchPcdCrmOutbox(adapterEnv, { fetcher, now: dispatchAt, limit: 10 });
    await dispatchPcdCrmOutbox(adapterEnv, { fetcher, now: dispatchAt + 1, limit: 10 });
    await dispatchPcdCrmOutbox(adapterEnv, { fetcher, now: dispatchAt + 2, limit: 10 });
    const targets = await ops.prepare(`SELECT target_workspace_id FROM crm_adapter_outbox
      WHERE subject_id='contact-many-targets' AND event_type='contact.deleted.v1'
      ORDER BY target_workspace_id`).all<{ target_workspace_id: string }>();
    expect(targets.results.map((row) => row.target_workspace_id))
      .toEqual([
        ...Array.from({ length: 25 }, (_, index) => `workspace-${String(index).padStart(2, '0')}`),
        'ws-sightsmash',
      ]);
    expect(await ops.prepare(`SELECT status FROM crm_contact_retraction_runs WHERE subject_id='contact-many-targets'`).first())
      .toEqual({ status: 'completed' });
  });

  it('retains ambiguous observation evidence while queuing its safety tombstone', async () => {
    const { ops, intel } = await databases();
    const adapterEnv = env(ops, intel, { PCD_CRM_TARGET_WORKSPACE_ID: 'workspace-one' });
    await readyOrganizationProjection(ops, intel, adapterEnv, 'org-ambiguous-safety');
    const contact = await upsertOrgContact(adapterEnv, {
      organizationId: 'org-ambiguous-safety', fullName: 'Ambiguous Contact', role: 'director',
      email: 'ambiguous@org.example', source: 'website', sourceUrl: 'https://org.example/staff',
      contactContext: 'professional',
    });
    expect(contact.ok).toBe(true);
    await publishContactForTest(ops, adapterEnv, contact.ok ? contact.id : '');
    await ops.prepare(`UPDATE crm_adapter_outbox SET status='retry',attempt_count=1,send_attempt_count=1,
      last_error_code='receiver_timeout' WHERE subject_id=?`).bind(contact.ok ? contact.id : '').run();
    await expect(setDoNotContact(
      { ...adapterEnv, PCD_CRM_TARGET_WORKSPACE_ID: 'workspace-two' }, contact.ok ? contact.id : '', 'privacy_request',
    )).resolves.toBe(true);
    const rows = await ops.prepare(`SELECT event_type,status,cancelled_at,target_workspace_id FROM crm_adapter_outbox
      WHERE subject_id=? ORDER BY source_sequence`).bind(contact.ok ? contact.id : '').all();
    expect(rows.results).toMatchObject([
      { event_type: 'contact.observed.v1', status: 'retry', cancelled_at: expect.any(Number), target_workspace_id: 'workspace-one' },
      { event_type: 'contact.deleted.v1', status: 'pending', cancelled_at: null, target_workspace_id: 'workspace-one' },
      { event_type: 'contact.deleted.v1', status: 'pending', cancelled_at: null, target_workspace_id: 'workspace-two' },
    ]);
  });

  it('holds unknown and rejects family, guardian, minor, and roster contacts while preserving tombstones', async () => {
    const { ops, intel } = await databases();
    const oldAt = '2026-09-01T12:00:00.000Z';
    const cutoff = Date.parse('2026-09-02T00:00:00.000Z');
    await insertOrganization(intel, { id: 'org-context-boundary', updatedAt: oldAt });
    for (const contactContext of ['unknown', 'family', 'guardian', 'minor', 'roster'] as const) {
      await insertContact(ops, {
        id: `contact-${contactContext}`, organizationId: 'org-context-boundary', updatedAt: oldAt, contactContext,
      });
    }
    await insertContact(ops, {
      id: 'contact-context-tombstone', organizationId: 'org-context-boundary', updatedAt: oldAt,
      deletedAt: oldAt, contactContext: 'minor',
    });
    const result = await projectPcdCrmBackfill(env(ops, intel, {
      PCD_CRM_BACKFILL_ENABLED: 'true', PCD_CRM_SOURCE_NOT_BEFORE_MS: String(cutoff),
    }), { now: cutoff + 1, limit: 10 });
    expect(result).toMatchObject({ contacts: 0, rejected: 6, scanCompleted: true });
    expect(await ops.prepare(`SELECT subject_id,event_type FROM crm_adapter_outbox WHERE subject_type='contact'`).all())
      .toMatchObject({ results: [] });
    const chunk = await ops.prepare(`SELECT eligible_count,rejected_count FROM crm_adapter_backfill_chunks
      WHERE subject_type='contact'`).first();
    expect(chunk).toEqual({ eligible_count: 0, rejected_count: 6 });
  });

  it('refuses to reuse a sealed historical manifest for a different target workspace', async () => {
    const { ops, intel } = await databases();
    const oldAt = '2026-09-01T12:00:00.000Z';
    const cutoff = Date.parse('2026-09-02T00:00:00.000Z');
    await insertOrganization(intel, { id: 'org-retarget', updatedAt: oldAt });
    const firstEnv = env(ops, intel, {
      PCD_CRM_BACKFILL_ENABLED: 'true', PCD_CRM_SOURCE_NOT_BEFORE_MS: String(cutoff),
      PCD_CRM_TARGET_WORKSPACE_ID: 'workspace-one',
    });
    const secondEnv = { ...firstEnv, PCD_CRM_TARGET_WORKSPACE_ID: 'workspace-two' };
    await projectPcdCrmBackfill(firstEnv, { now: cutoff + 1, limit: 10 });
    await expect(projectPcdCrmBackfill(secondEnv, { now: cutoff + 2, limit: 10 }))
      .rejects.toThrow('pcd_crm_backfill_boundary_conflict');
    const events = await ops.prepare(`SELECT event_id,backfill_run_id FROM crm_adapter_outbox
      WHERE subject_id='org-retarget' ORDER BY source_sequence`).all();
    expect(events.results).toHaveLength(1);
    expect((await ops.prepare(`SELECT COUNT(*) count FROM crm_adapter_backfill_runs`)
      .first<{ count: number }>())?.count).toBe(1);
  });

  it('does not rescan source inventory after a backfill is already completed', async () => {
    const { ops, intel } = await databases();
    const oldAt = '2026-09-01T12:00:00.000Z';
    const cutoff = Date.parse('2026-09-02T00:00:00.000Z');
    await insertOrganization(intel, { id: 'org-completed-no-rescan', updatedAt: oldAt });
    const adapterEnv = env(ops, intel, {
      PCD_CRM_BACKFILL_ENABLED: 'true', PCD_CRM_SOURCE_NOT_BEFORE_MS: String(cutoff),
    });
    await projectPcdCrmBackfill(adapterEnv, { now: cutoff + 1, limit: 10 });
    await ops.prepare(`UPDATE crm_adapter_backfill_runs SET status='completed',reconciliation_complete=1`).run();
    const noSourceReads = new Proxy(intel, {
      get(_target, property) {
        if (property === 'prepare') throw new Error('source_inventory_should_not_be_read');
        return Reflect.get(intel, property);
      },
    });
    await expect(finalizePcdCrmBackfill({ ...adapterEnv, DB: noSourceReads }, { now: cutoff + 2 }))
      .resolves.toEqual({ enabled: true, completed: true, pending: 0, dead: 0, reconciled: true });
  });

  it('classifies missing receiver, 4xx, 5xx and timeout paths with an eight-attempt ceiling', async () => {
    const { ops, intel } = await databases();
    const at = '2026-09-01T12:00:00.000Z';
    for (const id of ['missing', 'client', 'server', 'timeout']) await insertOrganization(intel, { id: `org-${id}`, updatedAt: at });
    const adapterEnv = env(ops, intel);
    await projectPcdCrmEvents(adapterEnv, { now: Date.parse(at) + 1, limit: 10 });

    const missing = await dispatchPcdCrmOutbox(adapterEnv, { now: Date.parse(at) + 2, limit: 1 });
    expect(missing).toMatchObject({ claimed: 1, retried: 1 });
    expect(await ops.prepare(`SELECT last_error_code FROM crm_adapter_outbox WHERE source_sequence=1`).first())
      .toEqual({ last_error_code: 'receiver_unavailable' });

    const attempts = new Map<number, number>();
    const fetcher: CrmAdapterFetcher = {
      fetch: vi.fn(async (_input, init) => {
        const body = JSON.parse(String(init?.body)) as { eventId: string; sequence: number };
        const attempt = (attempts.get(body.sequence) ?? 0) + 1;
        attempts.set(body.sequence, attempt);
        if (body.sequence === 1) return Response.json({ error: 'invalid' }, { status: 422 });
        if (body.sequence === 2 && attempt === 1) return Response.json({ error: 'unavailable' }, { status: 503 });
        if (body.sequence === 3 && attempt === 1) return Response.json({ error: 'unavailable' }, { status: 503 });
        if (body.sequence === 4) throw new DOMException('timed out', 'AbortError');
        return Response.json({
          accepted: true, receiptId: `receipt-${body.eventId}`, eventId: body.eventId,
          sequence: body.sequence, replay: attempt > 1,
        });
      }),
    };
    const clientFailure = await dispatchPcdCrmOutbox(adapterEnv, {
      fetcher,
      now: Date.parse(at) + 35_000,
      limit: 10,
    });
    expect(clientFailure).toMatchObject({ dead: 1, retried: 0 });
    expect((await ops.prepare(`SELECT COUNT(*) count FROM crm_adapter_outbox WHERE status='dead' AND receiver_status=422`)
      .first<{ count: number }>())?.count).toBe(1);
    expect(await dispatchPcdCrmOutbox(adapterEnv, { fetcher, now: Date.parse(at) + 35_001, limit: 10 }))
      .toMatchObject({ claimed: 0, delivered: 0, retried: 0 });
    await ops.prepare(`UPDATE crm_adapter_outbox SET status='delivered',receiver_receipt_id='operator-recovered',
      delivered_at=?,updated_at=? WHERE source_sequence=1 AND status='dead'`)
      .bind(Date.parse(at) + 35_001, Date.parse(at) + 35_001).run();

    expect(await dispatchPcdCrmOutbox(adapterEnv, { fetcher, now: Date.parse(at) + 35_002, limit: 10 }))
      .toMatchObject({ delivered: 0, retried: 1 });
    expect(await dispatchPcdCrmOutbox(adapterEnv, { fetcher, now: Date.parse(at) + 65_002, limit: 10 }))
      .toMatchObject({ delivered: 1, retried: 1 });
    expect(await dispatchPcdCrmOutbox(adapterEnv, { fetcher, now: Date.parse(at) + 95_003, limit: 10 }))
      .toMatchObject({ delivered: 1, retried: 1 });
    expect(await ops.prepare(`SELECT last_error_code FROM crm_adapter_outbox WHERE source_sequence=4`).first())
      .toEqual({ last_error_code: 'receiver_timeout' });

    await ops.prepare(`UPDATE crm_adapter_outbox SET status='retry',attempt_count=7,next_attempt_at=0 WHERE status='retry'`).run();
    const ceiling = await dispatchPcdCrmOutbox(adapterEnv, {
      fetcher: { fetch: async () => Response.json({ error: 'unavailable' }, { status: 503 }) },
      now: Date.parse(at) + 70_000,
      limit: 10,
    });
    expect(ceiling.dead).toBeGreaterThanOrEqual(1);
    expect((await ops.prepare(`SELECT COUNT(*) count FROM crm_adapter_outbox WHERE attempt_count>8`)
      .first<{ count: number }>())?.count).toBe(0);
  });

  it('retries rate limits and blocks ordinary later sequences behind a dead head', async () => {
    const { ops, intel } = await databases();
    const at = Date.parse('2026-09-01T12:00:00.000Z');
    await insertOrganization(intel, { id: 'org-head-first', updatedAt: new Date(at).toISOString() });
    await insertOrganization(intel, { id: 'org-head-second', updatedAt: new Date(at).toISOString() });
    const adapterEnv = env(ops, intel);
    await projectPcdCrmEvents(adapterEnv, { now: at + 1, limit: 10 });
    const rateLimited: CrmAdapterFetcher = { fetch: vi.fn(async () => Response.json({ error: 'slow down' }, { status: 429 })) };
    expect(await dispatchPcdCrmOutbox(adapterEnv, { fetcher: rateLimited, now: at + 2, limit: 10 }))
      .toMatchObject({ retried: 1, dead: 0 });
    expect(await ops.prepare(`SELECT status FROM crm_adapter_outbox WHERE source_sequence=1`).first())
      .toEqual({ status: 'retry' });

    await ops.prepare(`UPDATE crm_adapter_outbox SET status='dead',attempt_count=1,next_attempt_at=0
      WHERE source_sequence=1`).run();
    const shouldNotSend: CrmAdapterFetcher = { fetch: vi.fn(async () => Response.json({ accepted: true })) };
    expect(await dispatchPcdCrmOutbox(adapterEnv, { fetcher: shouldNotSend, now: at + 60_000, limit: 10 }))
      .toMatchObject({ claimed: 0, delivered: 0 });
    expect(shouldNotSend.fetch).not.toHaveBeenCalled();
  });

  it('lets a canonical safety tombstone bypass an unrelated dead ordinary head', async () => {
    const { ops, intel } = await databases();
    const at = '2026-09-01T12:00:00.000Z';
    await insertOrganization(intel, { id: 'org-safety-bypass', updatedAt: at });
    const adapterEnv = env(ops, intel);
    const contact = await upsertOrgContact(adapterEnv, {
      organizationId: 'org-safety-bypass', fullName: 'Safety Contact', role: 'director',
      email: 'safety@org-safety-bypass.example', source: 'website',
      sourceUrl: 'https://org-safety-bypass.example/staff', contactContext: 'professional',
    });
    expect(contact.ok).toBe(true);
    await publishContactForTest(ops, adapterEnv, contact.ok ? contact.id : '');
    await ops.prepare(`UPDATE crm_adapter_outbox SET status='dead',attempt_count=1,send_attempt_count=1
      WHERE event_type='contact.observed.v1'`).run();
    expect(await setDoNotContact(adapterEnv, contact.ok ? contact.id : '', 'privacy_request')).toBe(true);
    const fetcher: CrmAdapterFetcher = { fetch: vi.fn(async (_input, init) => {
      const body = JSON.parse(String(init?.body));
      return Response.json({ accepted: true, receiptId: `safe-${body.eventId}`, eventId: body.eventId, sequence: body.sequence, replay: false });
    }) };
    await expect(dispatchPcdCrmOutbox(adapterEnv, { fetcher, now: Date.now(), limit: 10 }))
      .resolves.toMatchObject({ delivered: 1 });
    expect(await ops.prepare(`SELECT status FROM crm_adapter_outbox WHERE event_type='contact.deleted.v1'`).first())
      .toEqual({ status: 'delivered' });
  });

  it('retracts a contact from the workspace that received it even after the configured target changes', async () => {
    const { ops, intel } = await databases();
    await insertOrganization(intel, { id: 'org-retarget-contact', updatedAt: '2026-09-01T12:00:00.000Z' });
    const firstEnv = env(ops, intel, { PCD_CRM_TARGET_WORKSPACE_ID: 'workspace-one' });
    const contact = await upsertOrgContact(firstEnv, {
      organizationId: 'org-retarget-contact', fullName: 'Retarget Contact', role: 'director',
      email: 'retarget@org.example', source: 'website', sourceUrl: 'https://org.example/staff',
      contactContext: 'professional',
    });
    expect(contact.ok).toBe(true);
    await publishContactForTest(ops, firstEnv, contact.ok ? contact.id : '');
    await ops.prepare(`UPDATE crm_adapter_outbox SET status='delivered',receiver_receipt_id='workspace-one',delivered_at=1`).run();
    const secondEnv = { ...firstEnv, PCD_CRM_TARGET_WORKSPACE_ID: 'workspace-two' };
    const retargetedContact = await upsertOrgContact(secondEnv, {
      organizationId: 'org-retarget-contact', fullName: 'Retarget Contact', role: 'director',
      email: 'retarget-updated@org.example', source: 'website', sourceUrl: 'https://org.example/staff',
      contactContext: 'professional',
    });
    expect(retargetedContact).toMatchObject({ ok: true });
    await publishContactForTest(ops, secondEnv, retargetedContact.ok ? retargetedContact.id : '');
    const newTarget = await ops.prepare(`SELECT event_type FROM crm_adapter_outbox
      WHERE target_workspace_id='workspace-two' ORDER BY source_sequence`).all<{ event_type: string }>();
    expect(newTarget.results.map((row) => row.event_type))
      .toEqual(['organization.upserted.v1', 'contact.observed.v1', 'contact.observed.v1']);
    expect(await setDoNotContact(secondEnv, contact.ok ? contact.id : '', 'privacy_request')).toBe(true);
    const tombstone = await ops.prepare(`SELECT payload_json,target_workspace_id FROM crm_adapter_outbox
      WHERE event_type='contact.deleted.v1'`).first<{ payload_json: string; target_workspace_id: string }>();
    expect(tombstone?.target_workspace_id).toBe('workspace-one');
    expect(JSON.parse(tombstone?.payload_json ?? '{}').payload.workspaceId).toBe('workspace-one');
  });

  it('does not tombstone an unattempted old target while preserving suppression in the current target', async () => {
    const { ops, intel } = await databases();
    const at = '2026-09-03T12:00:00.000Z';
    await insertOrganization(intel, { id: 'org-retarget-unsent', updatedAt: at });
    await insertContact(ops, { id: 'contact-retarget-unsent', organizationId: 'org-retarget-unsent', updatedAt: at });
    const originalEnv = env(ops, intel, { PCD_CRM_TARGET_WORKSPACE_ID: 'workspace-one' });
    expect(await projectPcdCrmEvents(originalEnv, { now: Date.parse(at) + 1, limit: 10 }))
      .toMatchObject({ organizations: 1, contacts: 1 });

    const retargetedEnv = env(ops, intel, { PCD_CRM_TARGET_WORKSPACE_ID: 'workspace-two' });
    await expect(setDoNotContact(retargetedEnv, 'contact-retarget-unsent', 'privacy_request')).resolves.toBe(true);
    expect(await ops.prepare(`SELECT event_type,target_workspace_id FROM crm_adapter_outbox
      WHERE subject_id='contact-retarget-unsent'`).all()).toMatchObject({ results: [
      { event_type: 'contact.deleted.v1', target_workspace_id: 'workspace-two' },
    ] });
  });

  it('reports reconciliation findings as not clean', async () => {
    const { ops, intel } = await databases();
    const at = '2026-09-01T12:00:00.000Z';
    await insertOrganization(intel, { id: 'org-reconcile-duplicate', updatedAt: at });
    const adapterEnv = env(ops, intel);
    await projectPcdCrmEvents(adapterEnv, { now: Date.parse(at) + 1 });
    await ops.prepare(`UPDATE crm_adapter_outbox SET status='delivered',receiver_receipt_id='receipt-duplicate',
      receiver_status=202,delivered_at=?,updated_at=?`)
      .bind(Date.parse(at) + 2, Date.parse(at) + 2).run();
    const fetcher: CrmAdapterFetcher = { fetch: vi.fn(async (_input, init) => {
      const body = JSON.parse(String(init?.body));
      const duplicate = body.events[0];
      return Response.json({
        producer: 'parent-coach-desk', producerWorkspaceId: body.producerWorkspaceId,
        declaredHighWater: body.declaredHighWater, receiverHighWater: body.declaredHighWater,
        missing: [], duplicate: [duplicate], stale: [], unauthorized: [], mismatch: [],
      });
    }) };
    expect(await reconcilePcdCrmOutbox(adapterEnv, { fetcher, now: Date.parse(at) + 3 })).toEqual({
      enabled: true, checked: true, clean: false, missing: 0, duplicate: 1, stale: 0, unauthorized: 0, mismatch: 0,
    });
  });

  it('times out while reading a response body that never closes', async () => {
    vi.useFakeTimers();
    try {
      const { ops, intel } = await databases();
      const at = Date.parse('2026-09-01T12:00:00.000Z');
      await insertOrganization(intel, { id: 'org-stalled-body', updatedAt: new Date(at).toISOString() });
      const adapterEnv = env(ops, intel);
      await projectPcdCrmEvents(adapterEnv, { now: at + 1 });
      let markFetchStarted!: () => void;
      const fetchStarted = new Promise<void>((resolve) => { markFetchStarted = resolve; });
      const fetcher: CrmAdapterFetcher = { fetch: vi.fn(async () => {
        markFetchStarted();
        return new Response(new ReadableStream({ start() {} }));
      }) };
      const delivery = dispatchPcdCrmOutbox(adapterEnv, { fetcher, now: at + 2, limit: 1 });
      await fetchStarted;
      await vi.advanceTimersByTimeAsync(5_001);
      await expect(delivery).resolves.toMatchObject({ delivered: 0, retried: 1, dead: 0 });
      expect(await ops.prepare(`SELECT status,last_error_code FROM crm_adapter_outbox`).first())
        .toEqual({ status: 'retry', last_error_code: 'receiver_timeout' });
    } finally {
      vi.useRealTimers();
    }
  });
});
