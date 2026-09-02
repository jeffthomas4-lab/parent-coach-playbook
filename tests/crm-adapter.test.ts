import { afterEach, describe, expect, it, vi } from 'vitest';
import type { D1Database } from '@cloudflare/workers-types';
import { createDisposableOpsDatabase } from './helpers/disposable-ops-db';
import { createDisposableIntelDatabase } from './helpers/disposable-intel-db';
import {
  dispatchPcdCrmOutbox,
  projectPcdCrmEvents,
  reconcilePcdCrmOutbox,
  type CrmAdapterFetcher,
  type PcdCrmAdapterEnv,
} from '../src/lib/crm-adapter';
import { softDeleteOrgContact, upsertOrgContact } from '../src/lib/org-contacts';

const resources: Array<() => Promise<void> | void> = [];

afterEach(async () => {
  vi.restoreAllMocks();
  while (resources.length) await resources.pop()?.();
});

async function databases() {
  const ops = await createDisposableOpsDatabase(`crm-adapter-${crypto.randomUUID()}`);
  const intel = await createDisposableIntelDatabase();
  resources.push(() => ops.mf.dispose(), () => intel.sqlite.close());
  return { ops: ops.db, intel: intel.db };
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
    ...extra,
  };
}

async function insertOrganization(db: D1Database, input: { id: string; updatedAt: string; name?: string; deletedAt?: string | null }) {
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
    input.updatedAt,
    input.updatedAt,
    null,
    input.deletedAt ?? null,
  ).run();
}

async function insertContact(db: D1Database, input: { id: string; organizationId: string; updatedAt: string; deletedAt?: string | null }) {
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
    input.updatedAt,
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
