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

async function insertContact(db: D1Database, input: {
  id: string;
  organizationId: string;
  updatedAt: string;
  createdAt?: string;
  deletedAt?: string | null;
  contactContext?: 'professional' | 'family' | 'guardian' | 'minor' | 'roster' | 'unknown';
}) {
  await db.prepare(`INSERT INTO org_contacts
    (id,organization_id,full_name,title,role,email,is_primary,is_public,do_not_contact,source,source_url,
     confidence,verified_at,content_hash,deleted_at,created_at,updated_at,contact_context)
    VALUES (?,?,?,'Club Director','director',?,0,0,0,'website',?,'high',?,NULL,?,?,?,?)`).bind(
    input.id,
    input.organizationId,
    'Taylor Director',
    `${input.id}@test.example`,
    `https://${input.organizationId}.example/staff`,
    input.updatedAt,
    input.deletedAt ?? null,
    input.createdAt ?? input.updatedAt,
    input.updatedAt,
    input.contactContext ?? 'professional',
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
      .toMatchObject({ checked: true, missing: 0 });
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
      contactContext: 'professional',
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
      WHERE producer_workspace_id=? AND status IN ('pending','retry','leased','dead')
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

  it('uses bounded chronological cursor indexes for normal source projection', async () => {
    const { ops, intel } = await databases();
    const organizationEqualPlan = await intel.prepare(`EXPLAIN QUERY PLAN SELECT id
      FROM organizations INDEXED BY idx_organizations_crm_projection_cursor
      WHERE julianday(updated_at)=julianday(?) AND id>?
      ORDER BY id LIMIT ?`)
      .bind('2026-09-01T12:00:00.000Z', '', 50).all<{ detail: string }>();
    const organizationLaterPlan = await intel.prepare(`EXPLAIN QUERY PLAN SELECT id
      FROM organizations INDEXED BY idx_organizations_crm_projection_cursor
      WHERE julianday(updated_at)>julianday(?)
      ORDER BY julianday(updated_at),id LIMIT ?`)
      .bind('2026-09-01T12:00:00.000Z', 50).all<{ detail: string }>();
    const contactEqualPlan = await ops.prepare(`EXPLAIN QUERY PLAN SELECT id
      FROM org_contacts INDEXED BY idx_org_contacts_crm_projection_cursor
      WHERE julianday(updated_at)=julianday(?) AND id>?
      ORDER BY id LIMIT ?`)
      .bind('2026-09-01T12:00:00.000Z', '', 50).all<{ detail: string }>();
    const contactLaterPlan = await ops.prepare(`EXPLAIN QUERY PLAN SELECT id
      FROM org_contacts INDEXED BY idx_org_contacts_crm_projection_cursor
      WHERE julianday(updated_at)>julianday(?)
      ORDER BY julianday(updated_at),id LIMIT ?`)
      .bind('2026-09-01T12:00:00.000Z', 50).all<{ detail: string }>();

    for (const detail of [organizationEqualPlan, organizationLaterPlan, contactEqualPlan, contactLaterPlan]
      .map((plan) => plan.results.map((row) => row.detail).join('\n'))) {
      expect(detail).toMatch(/SEARCH .* USING (?:COVERING )?INDEX/);
      expect(detail).not.toContain('USE TEMP B-TREE FOR ORDER BY');
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
    const result = await upsertOrgContact(adapterEnv, {
      organizationId: 'org-suppression', fullName: 'Morgan Director', role: 'director',
      email: 'morgan@org-suppression.example', source: 'website',
      sourceUrl: 'https://org-suppression.example/staff', contactContext: 'professional',
    });
    expect(result.ok).toBe(true);
    expect(await setDoNotContact(adapterEnv, result.ok ? result.id : '', 'unsubscribed')).toBe(true);
    const events = await ops.prepare(`SELECT event_id,payload_json FROM crm_adapter_outbox
      WHERE subject_id=? ORDER BY source_sequence`).bind(result.ok ? result.id : '').all<{
        event_id: string; payload_json: string;
      }>();
    expect(events.results).toHaveLength(2);
    expect(events.results[0]?.event_id).not.toBe(events.results[1]?.event_id);
    expect(JSON.parse(events.results[1]!.payload_json).payload.doNotContact).toBe(true);
  });

  it('retracts a previously projected contact when it is reclassified as minor', async () => {
    const { ops, intel } = await databases();
    const adapterEnv = env(ops, intel);
    const result = await upsertOrgContact(adapterEnv, {
      organizationId: 'org-context-retraction', fullName: 'Morgan Director', role: 'director',
      email: 'morgan@org-context-retraction.example', source: 'website',
      sourceUrl: 'https://org-context-retraction.example/staff', contactContext: 'professional',
    });
    expect(result.ok).toBe(true);
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
    expect(stored.results.map((row) => row.event_type)).toEqual(['contact.deleted.v1']);
    expect(JSON.stringify(stored.results)).not.toContain('private.person@org-unsent-retraction.example');

    const received: string[] = [];
    const fetcher: CrmAdapterFetcher = { fetch: vi.fn(async (_input, init) => {
      const body = String(init?.body);
      received.push(body);
      const event = JSON.parse(body);
      return Response.json({ accepted: true, receiptId: `receipt-${event.eventId}`, eventId: event.eventId, sequence: event.sequence, replay: false });
    }) };
    await expect(dispatchPcdCrmOutbox(adapterEnv, { fetcher, now: Date.now(), limit: 10 }))
      .resolves.toMatchObject({ delivered: 1 });
    expect(received.join('\n')).not.toContain('private.person@org-unsent-retraction.example');
  });

  it('allows a suppressed contact to be safety-downgraded without changing its PII', async () => {
    const { ops, intel } = await databases();
    const adapterEnv = env(ops, intel);
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
    expect(queued.results.at(-1)?.event_type).toBe('contact.deleted.v1');
    expect(queued.results.at(-1)?.payload_json).not.toContain('original@org-suppressed-minor.example');
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
    expect(result).toMatchObject({ contacts: 1, rejected: 5, scanCompleted: true });
    expect(await ops.prepare(`SELECT subject_id,event_type FROM crm_adapter_outbox WHERE subject_type='contact'`).all())
      .toMatchObject({ results: [{ subject_id: 'contact-context-tombstone', event_type: 'contact.deleted.v1' }] });
    const chunk = await ops.prepare(`SELECT eligible_count,rejected_count FROM crm_adapter_backfill_chunks
      WHERE subject_type='contact'`).first();
    expect(chunk).toEqual({ eligible_count: 1, rejected_count: 5 });
  });

  it('namespaces event identity by producer and target workspace during retargeted backfills', async () => {
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
    await projectPcdCrmBackfill(secondEnv, { now: cutoff + 2, limit: 10 });
    const events = await ops.prepare(`SELECT event_id,backfill_run_id FROM crm_adapter_outbox
      WHERE subject_id='org-retarget' ORDER BY source_sequence`).all();
    expect(events.results).toHaveLength(2);
    expect(events.results[0]?.event_id).not.toBe(events.results[1]?.event_id);
    expect(events.results[0]?.backfill_run_id).not.toBe(events.results[1]?.backfill_run_id);
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

  it('retries rate limits and blocks every later sequence behind a dead head', async () => {
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

  it('reports reconciliation findings as not clean', async () => {
    const { ops, intel } = await databases();
    const at = '2026-09-01T12:00:00.000Z';
    await insertOrganization(intel, { id: 'org-reconcile-duplicate', updatedAt: at });
    const adapterEnv = env(ops, intel);
    await projectPcdCrmEvents(adapterEnv, { now: Date.parse(at) + 1 });
    const fetcher: CrmAdapterFetcher = { fetch: vi.fn(async (_input, init) => {
      const body = JSON.parse(String(init?.body));
      const duplicate = body.events[0];
      return Response.json({
        producer: 'parent-coach-desk', producerWorkspaceId: body.producerWorkspaceId,
        declaredHighWater: body.declaredHighWater, receiverHighWater: body.declaredHighWater,
        missing: [], duplicate: [duplicate], stale: [], unauthorized: [], mismatch: [],
      });
    }) };
    expect(await reconcilePcdCrmOutbox(adapterEnv, { fetcher, now: Date.parse(at) + 2 })).toEqual({
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
