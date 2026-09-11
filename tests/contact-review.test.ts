import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import {
  listContactReviewQueue,
  reviewOrgContact,
  type ContactReviewEnv,
} from '../src/lib/contact-review';
import { computeContentHash } from '../src/lib/org-contacts';
import { createDisposableIntelDatabase } from './helpers/disposable-intel-db';
import { createDisposableOpsDatabase } from './helpers/disposable-ops-db';

const ADMIN = 'jeffthomas@pugetsound.edu';
const NOW = '2026-09-10T12:00:00.000Z';

function directoryDb(rows: Array<Record<string, unknown>>, calls: { count: number }): D1Database {
  return {
    prepare() {
      calls.count += 1;
      const chain = {
        bind() { return chain; },
        async all() { return { results: rows }; },
      };
      return chain as unknown as D1PreparedStatement;
    },
  } as unknown as D1Database;
}

describe('CRM contact review', () => {
  let mf: Awaited<ReturnType<typeof createDisposableOpsDatabase>>['mf'];
  let ops: D1Database;
  let intel: Awaited<ReturnType<typeof createDisposableIntelDatabase>>;
  let directory: D1Database;
  let env: ContactReviewEnv;

  beforeAll(async () => {
    ({ mf, db: ops } = await createDisposableOpsDatabase(`contact-review-${crypto.randomUUID()}`));
    intel = await createDisposableIntelDatabase();
    directory = intel.db;
    env = { DB: directory, PCD_OPS_DB: ops, PCD_CRM_ADAPTER_ENABLED: 'false' };
  }, 120_000);

  beforeEach(async () => {
    await ops.prepare(`DELETE FROM org_contacts`).run();
    await directory.prepare(`DELETE FROM organizations`).run();
    await directory.prepare(`INSERT INTO organizations
      (id,slug,name,record_status,created_at,updated_at)
      VALUES ('org-1','org-1','Organization one','active',?,?)`).bind(NOW, NOW).run();
  });

  afterAll(async () => {
    await mf.dispose();
    intel.sqlite.close();
  });

  async function insertContact(overrides: Record<string, unknown> = {}) {
    const row = {
      id: 'contact-1',
      organization_id: 'org-1',
      full_name: 'Public Staff Member',
      title: 'Registrar',
      role: 'registrar',
      email: 'registrar@example.org',
      phone: null,
      is_public: 0,
      do_not_contact: 0,
      contact_context: 'unknown',
      source: 'website',
      source_url: 'https://example.org/staff',
      confidence: 'high',
      content_hash: 'a'.repeat(64),
      deleted_at: null,
      created_at: NOW,
      updated_at: NOW,
      ...overrides,
    };
    if (!Object.hasOwn(overrides, 'content_hash')) {
      row.content_hash = await computeContentHash(row);
    }
    await ops.prepare(`INSERT INTO org_contacts
      (id,organization_id,full_name,title,role,email,phone,is_public,do_not_contact,
       contact_context,source,source_url,confidence,content_hash,deleted_at,created_at,updated_at)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).bind(
      row.id, row.organization_id, row.full_name, row.title, row.role, row.email, row.phone,
      row.is_public, row.do_not_contact, row.contact_context, row.source, row.source_url,
      row.confidence, row.content_hash, row.deleted_at, row.created_at, row.updated_at,
    ).run();
    return row;
  }

  it('approves one version-pinned public professional contact and writes a redacted receipt atomically', async () => {
    const row = await insertContact();
    const result = await reviewOrgContact(env, {
      id: row.id as string,
      expectedUpdatedAt: row.updated_at as string,
      expectedContentHash: row.content_hash as string,
      decision: 'approve_professional',
      actorEmail: ADMIN,
      environment: 'test',
      requestId: 'req-approve-1',
    });

    expect(result).toMatchObject({ ok: true, decision: 'approve_professional' });
    expect(await ops.prepare(`SELECT is_public,contact_context,verified_by,verification_method
      FROM org_contacts WHERE id=?`).bind(row.id).first()).toEqual({
      is_public: 1,
      contact_context: 'professional',
      verified_by: ADMIN,
      verification_method: 'website',
    });
    const receipt = await ops.prepare(`SELECT action,result,before_summary,after_summary,actor_email_digest
      FROM admin_action_receipts WHERE resource_id=?`).bind(row.id).first<Record<string, unknown>>();
    expect(receipt).toMatchObject({
      action: 'contact.approve_professional',
      result: 'success',
      before_summary: 'is_public=0 context=unknown',
      after_summary: 'is_public=1 context=professional',
    });
    expect(String(receipt?.actor_email_digest)).toMatch(/^[0-9a-f]{64}$/);
    expect(JSON.stringify(receipt)).not.toContain(ADMIN);
    expect(JSON.stringify(receipt)).not.toContain('registrar@example.org');
  });

  it.each([
    ['suppressed', { do_not_contact: 1 }],
    ['deleted', { deleted_at: NOW }],
    ['missing_source', { source_url: null }],
    ['invalid_source', { source_url: 'javascript:alert(1)' }],
    ['missing_channel', { email: null, phone: null }],
    ['minor', { contact_context: 'minor' }],
    ['guardian', { contact_context: 'guardian' }],
    ['family', { contact_context: 'family' }],
    ['roster', { contact_context: 'roster' }],
  ])('never approves an ineligible %s row', async (reason, overrides) => {
    const row = await insertContact(overrides);
    const result = await reviewOrgContact(env, {
      id: row.id as string,
      expectedUpdatedAt: row.updated_at as string,
      expectedContentHash: row.content_hash as string,
      decision: 'approve_professional',
      actorEmail: ADMIN,
      environment: 'test',
      requestId: `req-${reason}`,
    });
    expect(result).toMatchObject({ ok: false, code: 'not_eligible' });
    expect(await ops.prepare(`SELECT is_public FROM org_contacts WHERE id=?`).bind(row.id).first()).toEqual({ is_public: 0 });
  });

  it('classifies a protected contact as private without exposing it to CRM', async () => {
    const row = await insertContact();
    const result = await reviewOrgContact(env, {
      id: row.id as string,
      expectedUpdatedAt: row.updated_at as string,
      expectedContentHash: row.content_hash as string,
      decision: 'classify_private',
      privateContext: 'guardian',
      actorEmail: ADMIN,
      environment: 'test',
      requestId: 'req-private-1',
    });
    expect(result).toMatchObject({ ok: true, decision: 'classify_private' });
    expect(await ops.prepare(`SELECT is_public,contact_context FROM org_contacts WHERE id=?`).bind(row.id).first()).toEqual({
      is_public: 0,
      contact_context: 'guardian',
    });
  });

  it('rejects a stale review without mutating the contact or writing a success receipt', async () => {
    const row = await insertContact();
    await ops.prepare(`UPDATE org_contacts SET title='Changed elsewhere',updated_at=? WHERE id=?`)
      .bind('2026-09-10T12:01:00.000Z', row.id).run();
    const result = await reviewOrgContact(env, {
      id: row.id as string,
      expectedUpdatedAt: row.updated_at as string,
      expectedContentHash: row.content_hash as string,
      decision: 'approve_professional',
      actorEmail: ADMIN,
      environment: 'test',
      requestId: 'req-stale-1',
    });
    expect(result).toMatchObject({ ok: false, code: 'state_changed' });
    expect(await ops.prepare(`SELECT is_public FROM org_contacts WHERE id=?`).bind(row.id).first()).toEqual({ is_public: 0 });
    expect(await ops.prepare(`SELECT COUNT(*) AS n FROM admin_action_receipts WHERE result='success' AND request_id=?`)
      .bind('req-stale-1').first()).toEqual({ n: 0 });
  });

  it('rolls back the contact mutation if the receipt insert cannot commit', async () => {
    const row = await insertContact();
    await ops.prepare(`CREATE TRIGGER fail_contact_review_receipt
      BEFORE INSERT ON admin_action_receipts
      WHEN NEW.action='contact.approve_professional'
      BEGIN SELECT RAISE(ABORT,'forced receipt failure'); END`).run();
    try {
      await expect(reviewOrgContact(env, {
        id: row.id as string,
        expectedUpdatedAt: row.updated_at as string,
        expectedContentHash: row.content_hash as string,
        decision: 'approve_professional',
        actorEmail: ADMIN,
        environment: 'test',
        requestId: 'req-receipt-fail',
      })).rejects.toThrow();
    } finally {
      await ops.prepare(`DROP TRIGGER fail_contact_review_receipt`).run();
    }
    expect(await ops.prepare(`SELECT is_public,contact_context FROM org_contacts WHERE id=?`).bind(row.id).first()).toEqual({
      is_public: 0,
      contact_context: 'unknown',
    });
  });

  it.each([
    ['missing', async () => directory.prepare(`DELETE FROM organizations WHERE id='org-1'`).run()],
    ['deleted', async () => directory.prepare(`UPDATE organizations SET deleted_at=? WHERE id='org-1'`).bind(NOW).run()],
  ])('never approves a contact whose organization is %s', async (_state, arrange) => {
    const row = await insertContact();
    await arrange();
    const result = await reviewOrgContact(env, {
      id: row.id as string,
      expectedUpdatedAt: row.updated_at as string,
      expectedContentHash: row.content_hash as string,
      decision: 'approve_professional',
      actorEmail: ADMIN,
      environment: 'test',
      requestId: `req-organization-${_state}`,
    });
    expect(result).toMatchObject({ ok: false, code: 'not_eligible', reason: 'organization_not_live' });
    expect(await ops.prepare(`SELECT is_public FROM org_contacts WHERE id=?`).bind(row.id).first()).toEqual({ is_public: 0 });
  });

  it('never approves a contact whose stored hash does not match its current authority fields', async () => {
    const row = await insertContact({ content_hash: 'a'.repeat(64) });
    const result = await reviewOrgContact(env, {
      id: row.id as string,
      expectedUpdatedAt: row.updated_at as string,
      expectedContentHash: row.content_hash as string,
      decision: 'approve_professional',
      actorEmail: ADMIN,
      environment: 'test',
      requestId: 'req-corrupt-content-hash',
    });
    expect(result).toMatchObject({ ok: false, code: 'not_eligible', reason: 'content_hash_mismatch' });
    expect(await ops.prepare(`SELECT is_public FROM org_contacts WHERE id=?`).bind(row.id).first()).toEqual({ is_public: 0 });
  });

  it('marks an orphaned queue row ineligible before the admin can submit approval', async () => {
    await insertContact();
    await directory.prepare(`DELETE FROM organizations WHERE id='org-1'`).run();
    const page = await listContactReviewQueue(env);
    expect(page.rows).toHaveLength(1);
    expect(page.rows[0]).toMatchObject({
      organization: null,
      approvalEligible: false,
      approvalBlocks: expect.arrayContaining(['organization_not_live']),
    });
  });

  it('allows a safety downgrade to repair a corrupt stored hash', async () => {
    const row = await insertContact({ content_hash: 'a'.repeat(64) });
    const result = await reviewOrgContact(env, {
      id: row.id as string,
      expectedUpdatedAt: row.updated_at as string,
      expectedContentHash: row.content_hash as string,
      decision: 'classify_private',
      privateContext: 'minor',
      actorEmail: ADMIN,
      environment: 'test',
      requestId: 'req-corrupt-hash-safety-downgrade',
    });
    expect(result).toMatchObject({ ok: true, decision: 'classify_private', contactContext: 'minor' });
    const updated = await ops.prepare(`SELECT is_public,contact_context,content_hash FROM org_contacts WHERE id=?`)
      .bind(row.id).first<{ is_public: number; contact_context: string; content_hash: string }>();
    expect(updated).toMatchObject({ is_public: 0, contact_context: 'minor' });
    expect(updated?.content_hash).toBe(await computeContentHash({ ...row, contact_context: 'minor' }));
  });

  it('commits the receipt, publication revision, organization event, and contact event atomically when the adapter is enabled', async () => {
    const row = await insertContact();
    const result = await reviewOrgContact({
      ...env,
      PCD_CRM_ADAPTER_ENABLED: 'true',
      PCD_CRM_ADAPTER_HMAC_SECRET: 'test-pcd-adapter-secret',
      PCD_CRM_PRODUCER_WORKSPACE_ID: 'pcd-activity-radar',
      PCD_CRM_TARGET_WORKSPACE_ID: 'ws-sightsmash',
      PCD_CRM_SOURCE_ID: 'source-test',
      PCD_CRM_SOURCE_NOT_BEFORE_MS: '1000',
    }, {
      id: row.id as string,
      expectedUpdatedAt: row.updated_at as string,
      expectedContentHash: row.content_hash as string,
      decision: 'approve_professional',
      actorEmail: ADMIN,
      environment: 'test',
      requestId: 'req-enabled-adapter',
    });
    expect(result).toMatchObject({ ok: true, decision: 'approve_professional' });
    const approved = await ops.prepare(`SELECT is_public,contact_context,crm_projection_revision
      FROM org_contacts WHERE id=?`).bind(row.id).first<{
        is_public: number; contact_context: string; crm_projection_revision: number;
      }>();
    expect(approved).toMatchObject({
      is_public: 1,
      contact_context: 'professional',
    });
    expect(approved?.crm_projection_revision).toBeGreaterThan(0);
    expect(await ops.prepare(`SELECT COUNT(*) AS n FROM admin_action_receipts
      WHERE request_id='req-enabled-adapter' AND result='success'`).first()).toEqual({ n: 1 });
    expect(await ops.prepare(`SELECT COUNT(*) AS n FROM crm_adapter_outbox
      WHERE subject_id IN ('org-1','contact-1')`).first()).toEqual({ n: 2 });
  });

  it('lists a bounded keyset page and resolves organizations in one batched directory query', async () => {
    for (let i = 0; i < 4; i += 1) {
      await insertContact({
        id: `contact-${i}`,
        organization_id: `org-${i}`,
        email: `person-${i}@example.org`,
        content_hash: String(i).repeat(64),
        created_at: `2026-09-10T12:00:0${i}.000Z`,
        updated_at: `2026-09-10T12:00:0${i}.000Z`,
      });
    }
    const calls = { count: 0 };
    const db = directoryDb([
      { id: 'org-0', name: 'Org zero', website_url: 'https://zero.example', city: 'Tacoma', state: 'WA' },
      { id: 'org-1', name: 'Org one', website_url: 'https://one.example', city: 'Seattle', state: 'WA' },
    ], calls);
    const first = await listContactReviewQueue({ ...env, DB: db }, { limit: 2 });
    expect(first.rows).toHaveLength(2);
    expect(first.hasMore).toBe(true);
    expect(first.nextCursor).toBeTruthy();
    expect(calls.count).toBe(1);
    const second = await listContactReviewQueue({ ...env, DB: db }, { limit: 2, cursor: first.nextCursor });
    expect(second.rows.map((row) => row.id)).not.toEqual(first.rows.map((row) => row.id));
    expect(calls.count).toBe(2);
  });
});
