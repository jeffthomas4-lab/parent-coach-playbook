import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import type { D1Database } from '@cloudflare/workers-types';
import { createDisposableOpsDatabase } from './helpers/disposable-ops-db';
import { createDisposableIntelDatabase } from './helpers/disposable-intel-db';
import {
  dispatchPcdCrmOutbox,
  finalizePcdCrmBackfill,
  projectPcdCrmBackfill,
  projectPcdCrmEvents,
  reconcilePcdCrmBackfill,
  reconcilePcdCrmOutbox,
  type CrmAdapterFetcher,
  type PcdCrmAdapterEnv,
} from '../src/lib/crm-adapter';
import { softDeleteOrgContact, upsertOrgContact } from '../src/lib/org-contacts';

let opsResource: Awaited<ReturnType<typeof createDisposableOpsDatabase>>;
let intelResource: Awaited<ReturnType<typeof createDisposableIntelDatabase>>;

beforeAll(async () => {
  opsResource = await createDisposableOpsDatabase(`crm-adapter-${crypto.randomUUID()}`);
  intelResource = await createDisposableIntelDatabase();
});

beforeEach(async () => {
  await opsResource.db.batch([
    opsResource.db.prepare('DELETE FROM crm_adapter_reconciliation_receipts'),
    opsResource.db.prepare('DELETE FROM crm_adapter_projection_receipts'),
    opsResource.db.prepare('DELETE FROM crm_adapter_outbox'),
    opsResource.db.prepare('DELETE FROM crm_adapter_backfill_reconciliation_windows'),
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
  await opsResource.mf.dispose();
  intelResource.sqlite.close();
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

async function insertContact(db: D1Database, input: { id: string; organizationId: string; updatedAt: string; createdAt?: string; deletedAt?: string | null }) {
  await db.prepare(`INSERT INTO org_contacts
    (id,organization_id,full_name,title,role,email,is_primary,is_public,do_not_contact,source,source_url,
     confidence,verified_at,content_hash,deleted_at,created_at,updated_at)
    VALUES (?,?,?,'Club Director','director',?,1,0,0,'website',?,'high',?,NULL,?,?,?)`).bind(
    input.id,
    input.organizationId,
    'Taylor Director',
    `${input.id}@test.example`,
    `https://${input.organizationId}.example/staff`,
    input.updatedAt,
    input.deletedAt ?? null,
    input.createdAt ?? input.updatedAt,
    input.updatedAt,
  ).run();
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
    expect(tombstone.contacts).toBe(1);
    expect(await ops.prepare(`SELECT event_type FROM crm_adapter_outbox WHERE subject_id='contact-authority-1'
      ORDER BY source_sequence DESC LIMIT 1`).first()).toEqual({ event_type: 'contact.deleted.v1' });
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
    const chunks = await ops.prepare(`SELECT subject_type,rows_seen,eligible_count,rejected_count,length(disposition_hash) hash_length
      FROM crm_adapter_backfill_chunks ORDER BY subject_type,chunk_ordinal`).all();
    expect(chunks.results).toEqual([
      { subject_type: 'contact', rows_seen: 1, eligible_count: 1, rejected_count: 0, hash_length: 64 },
      { subject_type: 'organization', rows_seen: 2, eligible_count: 2, rejected_count: 0, hash_length: 64 },
      { subject_type: 'organization', rows_seen: 1, eligible_count: 1, rejected_count: 0, hash_length: 64 },
    ]);
  });

  it('accounts for rejected historical contacts without copying their raw values into receipts', async () => {
    const { ops, intel } = await databases();
    const oldAt = '2026-09-01T12:00:00.000Z';
    await insertOrganization(intel, { id: 'org-contact-disposition', updatedAt: oldAt });
    await ops.prepare(`INSERT INTO org_contacts
      (id,organization_id,full_name,title,role,email,is_primary,is_public,do_not_contact,source,source_url,
       confidence,verified_at,content_hash,deleted_at,created_at,updated_at)
      VALUES ('contact-no-source','org-contact-disposition','Private Example','Director','director',
        'private-value@test.example',0,0,0,'website',NULL,'medium',NULL,NULL,NULL,?,?)`).bind(oldAt, oldAt).run();
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
  });

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
    await expect(finalizePcdCrmBackfill(adapterEnv, { now: cutoff + 2 }))
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
    expect(await ops.prepare(`SELECT contact_cursor_at,contact_cursor_id FROM crm_adapter_controls`).first()).toEqual({
      contact_cursor_at: '', contact_cursor_id: '',
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

  it('commits same-D1 contact writes and their outbox event in one batch', async () => {
    const { ops, intel } = await databases();
    const adapterEnv = env(ops, intel);
    const result = await upsertOrgContact(adapterEnv, {
      organizationId: 'org-atomic',
      fullName: 'Casey Director',
      title: 'Director',
      role: 'director',
      email: 'casey@org-atomic.example',
      source: 'website',
      sourceUrl: 'https://org-atomic.example/staff',
      confidence: 'high',
      verifiedBy: 'operator',
      verificationMethod: 'website',
    });
    expect(result.ok).toBe(true);
    expect((await ops.prepare(`SELECT COUNT(*) count FROM org_contacts WHERE organization_id='org-atomic'`)
      .first<{ count: number }>())?.count).toBe(1);
    expect((await ops.prepare(`SELECT COUNT(*) count FROM crm_adapter_outbox WHERE subject_id=?`)
      .bind(result.ok ? result.id : '').first<{ count: number }>())?.count).toBe(1);
    expect(await softDeleteOrgContact(adapterEnv, result.ok ? result.id : '')).toBe(true);
    expect(await ops.prepare(`SELECT event_type FROM crm_adapter_outbox WHERE subject_id=?
      ORDER BY source_sequence DESC LIMIT 1`).bind(result.ok ? result.id : '').first())
      .toEqual({ event_type: 'contact.deleted.v1' });
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
        return Response.json({ accepted: true, receiptId: `receipt-${body.eventId}`, eventId: body.eventId });
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
    expect(reconciliation).toEqual({ enabled: true, checked: true, missing: 0, mismatch: 0 });
    expect((await ops.prepare(`SELECT COUNT(*) count FROM crm_adapter_reconciliation_receipts`)
      .first<{ count: number }>())?.count).toBe(1);
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
        return Response.json({ accepted: true, receiptId: `receipt-${body.eventId}`, eventId: body.eventId });
      }),
    };

    await expect(dispatchPcdCrmOutbox(adapterEnv, {
      fetcher,
      now: Date.parse(at) + 2,
      limit: 10,
    })).resolves.toMatchObject({ claimed: 10, delivered: 10, retried: 0, dead: 0 });
    expect(maxInFlight).toBe(1);
  });

  it('classifies missing receiver, 4xx, 5xx and timeout paths with an eight-attempt ceiling', async () => {
    const { ops, intel } = await databases();
    const at = '2026-09-01T12:00:00.000Z';
    for (const id of ['missing', 'client', 'server', 'timeout']) await insertOrganization(intel, { id: `org-${id}`, updatedAt: at });
    const adapterEnv = env(ops, intel);
    await projectPcdCrmEvents(adapterEnv, { now: Date.parse(at) + 1, limit: 10 });

    const missing = await dispatchPcdCrmOutbox(adapterEnv, { now: Date.parse(at) + 2, limit: 1 });
    expect(missing).toMatchObject({ claimed: 1, retried: 1 });

    const fetcher: CrmAdapterFetcher = {
      fetch: vi.fn(async (_input, init) => {
        const eventId = JSON.parse(String(init?.body)).eventId as string;
        if (eventId.includes('client')) return Response.json({ error: 'invalid' }, { status: 422 });
        if (eventId.includes('timeout')) throw new DOMException('timed out', 'AbortError');
        return Response.json({ error: 'unavailable' }, { status: 503 });
      }),
    };
    const classified = await dispatchPcdCrmOutbox(adapterEnv, {
      fetcher,
      now: Date.parse(at) + 35_000,
      limit: 10,
    });
    expect(classified.dead).toBeGreaterThanOrEqual(1);
    expect(classified.retried).toBeGreaterThanOrEqual(2);
    expect((await ops.prepare(`SELECT COUNT(*) count FROM crm_adapter_outbox WHERE status='dead' AND receiver_status=422`)
      .first<{ count: number }>())?.count).toBe(1);
    expect((await ops.prepare(`SELECT COUNT(*) count FROM crm_adapter_outbox WHERE last_error_code IN ('receiver_503','receiver_timeout','receiver_unavailable')`)
      .first<{ count: number }>())?.count).toBeGreaterThanOrEqual(3);

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
});
