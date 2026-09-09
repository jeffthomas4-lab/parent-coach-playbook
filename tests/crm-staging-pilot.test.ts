import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { D1Database } from '@cloudflare/workers-types';
import {
  buildCrmStagingPilot,
  parseOrganizationReceiptBoundary,
  parsePilotArguments,
  parsePilotBoundary,
} from '../scripts/build-crm-staging-pilot.mjs';
import { projectPcdCrmEvents, dispatchPcdCrmOutbox } from '../src/lib/crm-adapter';
import { createDisposableIntelDatabase } from './helpers/disposable-intel-db';
import { createDisposableOpsDatabase, splitSqlStatements } from './helpers/disposable-ops-db';

const boundaryMs = Math.floor(Date.now() / 1_000) * 1_000;
let intelResource: Awaited<ReturnType<typeof createDisposableIntelDatabase>>;
let opsResource: Awaited<ReturnType<typeof createDisposableOpsDatabase>>;

beforeAll(async () => {
  intelResource = await createDisposableIntelDatabase();
  opsResource = await createDisposableOpsDatabase(`crm-staging-pilot-${crypto.randomUUID()}`);
}, 30_000);

afterAll(async () => {
  intelResource?.sqlite.close();
  await opsResource?.mf.dispose();
});

async function runSql(db: D1Database, sql: string) {
  for (const statement of splitSqlStatements(sql)) await db.prepare(statement).run();
}

async function seedFixtureOrganizations(db: D1Database) {
  for (const [id, slug, name] of [
    ['fixture-org-soccer', 'fixture-soccer-club', 'PCD Fixture Soccer Club'],
    ['fixture-org-basketball', 'fixture-basketball-club', 'PCD Fixture Basketball Club'],
    ['fixture-org-swim', 'fixture-swim-club', 'PCD Fixture Swim Club'],
  ]) {
    await db.prepare(`INSERT INTO organizations
      (id,slug,name,organization_type,website_url,record_source,record_status,is_claimed,
       confidence_score,created_at,updated_at)
      VALUES (?,?,?,'other',?,'manual','active',0,100,?,?)`).bind(
      id, slug, name, `https://example.invalid/${slug}`,
      '2026-07-16T00:00:00.000Z', '2026-07-16T00:00:00.000Z',
    ).run();
  }
  await db.prepare('UPDATE organizations SET crm_projection_revision=0').run();
  await db.prepare('UPDATE crm_organization_projection_revisions SET next_revision=1 WHERE singleton=1').run();
}

describe('CRM staging synthetic pilot package', () => {
  it('fails closed without an exact second-aligned activation boundary', () => {
    for (const value of [undefined, '', 'not-a-number', '0', '1001', String(Number.MAX_SAFE_INTEGER + 1)]) {
      expect(() => parsePilotBoundary(value)).toThrow(/boundary/i);
    }
    expect(parsePilotBoundary(String(boundaryMs))).toBe(boundaryMs);
    expect(parseOrganizationReceiptBoundary(String(boundaryMs - 1_000), boundaryMs))
      .toBe(boundaryMs - 1_000);
    for (const value of ['', 'not-a-number', '0', String(boundaryMs), String(boundaryMs + 1_000)]) {
      expect(() => parseOrganizationReceiptBoundary(value, boundaryMs)).toThrow(/boundary/i);
    }
  });

  it('rejects duplicate CLI flags instead of silently replacing an approved value', () => {
    expect(() => parsePilotArguments([
      '--boundary-ms', String(boundaryMs), '--boundary-ms', String(boundaryMs), '--output-dir', 'packet',
    ])).toThrow('duplicate_argument:--boundary-ms');
    expect(() => parsePilotArguments([
      '--boundary-ms', String(boundaryMs), '--output-dir', 'one', '--output-dir', 'two',
    ])).toThrow('duplicate_argument:--output-dir');
  });

  it('emits a phase-two-only packet when three organization receipts already exist', async () => {
    const phaseOneBoundaryMs = boundaryMs - 60_000;
    const root = await mkdtemp(join(tmpdir(), 'crm-staging-pilot-resume-test-'));
    const outputDir = join(root, 'packet');
    try {
      const manifest = await buildCrmStagingPilot({
        boundaryMs,
        organizationReceiptBoundaryMs: phaseOneBoundaryMs,
        outputDir,
      });
      expect(manifest.mode).toBe('phase_two_resume');
      expect(manifest.organizationReceiptBoundaryMs).toBe(phaseOneBoundaryMs);
      expect(manifest.artifacts.map(({ file }) => file)).toEqual([
        '00-ops-preflight.sql',
        '02-ops-contacts.sql',
        '03-ops-replay.sql',
        '91-ops-verification.sql',
        '92-crm-verification.sql',
      ]);
      const contactsSql = await readFile(join(outputDir, '02-ops-contacts.sql'), 'utf8');
      expect(contactsSql).toContain(`event.authority_updated_at=${phaseOneBoundaryMs + 1_000}`);
      expect(contactsSql).toContain("json_extract(event.payload_json,'$.payload.sourceVersion')=receipt.content_hash");
      expect(() => parsePilotArguments([
        '--boundary-ms', String(boundaryMs),
        '--organization-receipt-boundary-ms', String(phaseOneBoundaryMs),
        '--output-dir', outputDir,
      ])).not.toThrow();
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it('emits hash-pinned synthetic-only phased SQL and exercises every disposition plus replay', async () => {
    const root = await mkdtemp(join(tmpdir(), 'crm-staging-pilot-test-'));
    const outputDir = join(root, 'packet');
    try {
      const manifest = await buildCrmStagingPilot({ boundaryMs, outputDir });
      expect(manifest.remoteExecutionAuthorized).toBe(false);
      expect(manifest.artifacts).toHaveLength(8);
      expect(manifest.organizations).toHaveLength(3);
      expect(manifest.contacts).toHaveLength(8);
      expect(manifest.expected).toMatchObject({
        contactEvents: 3,
        contactObservedEvents: 2,
        contactSuppressionEvents: 1,
        replayedContactEvents: 3,
        crm: {
          activeOrganizationProjections: 3,
          activeContactProjections: 2,
          dncRestrictions: 1,
          suppressedContactPoints: 0,
        },
      });
      expect(manifest.expected.contactDispositions).toEqual({
        projected: 2,
        rejected_private: 1,
        rejected_suppressed: 1,
        rejected_nonprofessional_context: 1,
        held_context_review: 1,
        rejected_missing_source: 1,
        rejected_missing_channel: 1,
      });

      const artifactContents = new Map(await Promise.all(manifest.artifacts.map(async ({ file }) => (
        [file, await readFile(join(outputDir, file))] as const
      ))));
      expect([...artifactContents.keys()]).toContain('03-ops-replay.sql');
      const opsVerification = splitSqlStatements(String(artifactContents.get('91-ops-verification.sql')));
      for (const artifact of manifest.artifacts) {
        const bytes = artifactContents.get(artifact.file)!;
        expect(createHash('sha256').update(bytes).digest('hex')).toBe(artifact.sha256);
      }
      const packageText = [...artifactContents.values()].join('\n');
      expect(packageText).not.toMatch(/wrangler|deploy|PCD_CRM_ADAPTER_ENABLED|PCD_CRM_BACKFILL_ENABLED/i);
      expect(packageText).not.toMatch(/@(?!example\.invalid)/i);
      expect(String(artifactContents.get('92-crm-verification.sql'))).toContain('adapter_contact_suppressions');

      await seedFixtureOrganizations(intelResource.db);
      const directorySql = String(artifactContents.get('01-directory-organizations.sql'));
      await runSql(intelResource.db, directorySql);
      const orgProjection = await projectPcdCrmEvents({
        DB: intelResource.db,
        PCD_OPS_DB: opsResource.db,
        PCD_CRM_ADAPTER_ENABLED: 'true',
        PCD_CRM_ADAPTER_HMAC_SECRET: 'pilot-test-secret',
        PCD_CRM_PRODUCER_WORKSPACE_ID: 'pcd-activity-radar',
        PCD_CRM_TARGET_WORKSPACE_ID: 'ws-sightsmash',
        PCD_CRM_SOURCE_ID: 'source-test',
        PCD_CRM_SOURCE_NOT_BEFORE_MS: String(boundaryMs),
      }, { now: boundaryMs + 2_000, limit: 50 });
      expect(orgProjection).toMatchObject({ organizations: 3, contacts: 0, deferred: 0 });

      const contactsSql = String(artifactContents.get('02-ops-contacts.sql'));
      await runSql(opsResource.db, contactsSql);
      expect(await opsResource.db.prepare(`SELECT COUNT(*) AS count FROM org_contacts
        WHERE id LIKE 'crm-pilot-contact-%'`).first()).toEqual({ count: 0 });

      const unrelated = await opsResource.db.prepare(`SELECT event_id,source_sequence,payload_hash
        FROM crm_adapter_outbox WHERE subject_id='fixture-org-soccer'`).first<{
          event_id: string; source_sequence: number; payload_hash: string;
        }>();
      await opsResource.db.prepare(`UPDATE crm_adapter_outbox SET status='delivered'
        WHERE event_id=?`).bind(unrelated!.event_id).run();
      for (const subjectId of ['fixture-org-soccer', 'fixture-org-basketball', 'fixture-org-swim']) {
        await opsResource.db.prepare(`UPDATE crm_adapter_projection_receipts
          SET content_hash=?,last_event_id=?,last_sequence=?,authority_updated_at=?,projected_at=?
          WHERE subject_type='organization' AND subject_id=?`).bind(
          unrelated!.payload_hash, unrelated!.event_id, unrelated!.source_sequence,
          boundaryMs + 1_000, boundaryMs + 2_000, subjectId,
        ).run();
      }
      await runSql(opsResource.db, contactsSql);
      expect(await opsResource.db.prepare(`SELECT COUNT(*) AS count FROM org_contacts
        WHERE id LIKE 'crm-pilot-contact-%'`).first()).toEqual({ count: 0 });
      for (const subjectId of ['fixture-org-soccer', 'fixture-org-basketball', 'fixture-org-swim']) {
        const ownEvent = await opsResource.db.prepare(`SELECT event_id,source_sequence,payload_hash,
            json_extract(payload_json,'$.payload.sourceVersion') AS source_version,authority_updated_at
          FROM crm_adapter_outbox WHERE subject_type='organization' AND subject_id=?`).bind(subjectId).first<{
            event_id: string; source_sequence: number; payload_hash: string; source_version: string;
            authority_updated_at: number;
          }>();
        expect(ownEvent!.payload_hash).not.toBe(ownEvent!.source_version);
        await opsResource.db.prepare(`UPDATE crm_adapter_projection_receipts
          SET content_hash=?,last_event_id=?,last_sequence=?,authority_updated_at=?
          WHERE subject_type='organization' AND subject_id=?`).bind(
          ownEvent!.source_version, ownEvent!.event_id, ownEvent!.source_sequence,
          ownEvent!.authority_updated_at, subjectId,
        ).run();
      }
      await opsResource.db.prepare("UPDATE crm_adapter_outbox SET status='delivered' WHERE subject_type='organization'").run();
      await runSql(opsResource.db, contactsSql);
      expect(await opsResource.db.prepare(`SELECT COUNT(*) AS count FROM org_contacts
        WHERE id LIKE 'crm-pilot-contact-%'`).first()).toEqual({ count: 0 });
      const deliveredOrganizationsQuery = opsVerification.find((sql) => sql.includes('delivered_pilot_organizations'))!;
      expect(await opsResource.db.prepare(deliveredOrganizationsQuery).first())
        .toEqual({ delivered_pilot_organizations: 0 });
      await opsResource.db.prepare("UPDATE crm_adapter_outbox SET status='pending' WHERE subject_type='organization'").run();

      await dispatchPcdCrmOutbox({
        DB: intelResource.db,
        PCD_OPS_DB: opsResource.db,
        PCD_CRM_ADAPTER_ENABLED: 'true',
        PCD_CRM_ADAPTER_HMAC_SECRET: 'pilot-test-secret',
        PCD_CRM_PRODUCER_WORKSPACE_ID: 'pcd-activity-radar',
        PCD_CRM_TARGET_WORKSPACE_ID: 'ws-sightsmash',
        PCD_CRM_SOURCE_ID: 'source-test',
        PCD_CRM_SOURCE_NOT_BEFORE_MS: String(boundaryMs),
      }, {
        now: boundaryMs + 3_000,
        fetcher: { fetch: async (_input, init) => {
          const body = JSON.parse(String(init?.body));
          return Response.json({
            accepted: true,
            receiptId: `pilot-${body.eventId}`,
            eventId: body.eventId,
            sequence: body.sequence,
            replay: false,
          });
        } },
      });

      await runSql(opsResource.db, contactsSql);
      const contactProjection = await projectPcdCrmEvents({
        DB: intelResource.db,
        PCD_OPS_DB: opsResource.db,
        PCD_CRM_ADAPTER_ENABLED: 'true',
        PCD_CRM_ADAPTER_HMAC_SECRET: 'pilot-test-secret',
        PCD_CRM_PRODUCER_WORKSPACE_ID: 'pcd-activity-radar',
        PCD_CRM_TARGET_WORKSPACE_ID: 'ws-sightsmash',
        PCD_CRM_SOURCE_ID: 'source-test',
        PCD_CRM_SOURCE_NOT_BEFORE_MS: String(boundaryMs),
      }, { now: boundaryMs + 5_000, limit: 50 });
      expect(contactProjection).toMatchObject({ organizations: 0, contacts: 3, deferred: 5 });
      const deliveredContacts: Record<string, unknown>[] = [];
      let deliveredCount = 0;
      for (let attempt = 0; attempt < 3; attempt += 1) {
        const contactDispatch = await dispatchPcdCrmOutbox({
          DB: intelResource.db,
          PCD_OPS_DB: opsResource.db,
          PCD_CRM_ADAPTER_ENABLED: 'true',
          PCD_CRM_ADAPTER_HMAC_SECRET: 'pilot-test-secret',
          PCD_CRM_PRODUCER_WORKSPACE_ID: 'pcd-activity-radar',
          PCD_CRM_TARGET_WORKSPACE_ID: 'ws-sightsmash',
          PCD_CRM_SOURCE_ID: 'source-test',
          PCD_CRM_SOURCE_NOT_BEFORE_MS: String(boundaryMs),
        }, {
          now: boundaryMs + 6_000 + attempt,
          fetcher: { fetch: async (_input, init) => {
            const body = JSON.parse(String(init?.body));
            deliveredContacts.push(body);
            return Response.json({
              accepted: true,
              receiptId: `pilot-contact-${body.eventId}`,
              eventId: body.eventId,
              sequence: body.sequence,
              replay: false,
            });
          } },
        });
        expect(contactDispatch).toMatchObject({ retried: 0, dead: 0 });
        deliveredCount += contactDispatch.delivered;
      }
      expect(deliveredCount).toBe(3);
      const replaySql = String(artifactContents.get('03-ops-replay.sql'));
      const deliveredBeforeReplay = await opsResource.db.prepare(`SELECT subject_id,event_id,idempotency_key,
          receiver_receipt_id,attempt_count,send_attempt_count
        FROM crm_adapter_outbox
        WHERE subject_type='contact' AND status='delivered'
        ORDER BY subject_id`).all<{
          subject_id: string; event_id: string; idempotency_key: string; receiver_receipt_id: string;
          attempt_count: number; send_attempt_count: number;
        }>();
      expect(deliveredBeforeReplay.results).toHaveLength(3);

      await opsResource.db.prepare(`UPDATE crm_adapter_outbox SET status='dead'
        WHERE subject_type='contact' AND subject_id='crm-pilot-contact-phone'`).run();
      await runSql(opsResource.db, replaySql);
      expect(await opsResource.db.prepare(`SELECT COUNT(*) count FROM crm_adapter_outbox
        WHERE subject_type='contact' AND status='retry'`).first()).toEqual({ count: 0 });
      await opsResource.db.prepare(`UPDATE crm_adapter_outbox SET status='delivered'
        WHERE subject_type='contact' AND subject_id='crm-pilot-contact-phone'`).run();

      await runSql(opsResource.db, replaySql);
      expect(await opsResource.db.prepare(`SELECT COUNT(*) count FROM crm_adapter_outbox
        WHERE subject_type='contact' AND status='retry'
          AND receiver_receipt_id IS NULL AND delivered_at IS NULL
          AND last_error_code='pilot_idempotency_replay'`).first()).toEqual({ count: 3 });
      const replayedReceipts: string[] = [];
      let replayDelivered = 0;
      for (let attempt = 0; attempt < 3; attempt += 1) {
        const replayDispatch = await dispatchPcdCrmOutbox({
          DB: intelResource.db,
          PCD_OPS_DB: opsResource.db,
          PCD_CRM_ADAPTER_ENABLED: 'true',
          PCD_CRM_ADAPTER_HMAC_SECRET: 'pilot-test-secret',
          PCD_CRM_PRODUCER_WORKSPACE_ID: 'pcd-activity-radar',
          PCD_CRM_TARGET_WORKSPACE_ID: 'ws-sightsmash',
          PCD_CRM_SOURCE_ID: 'source-test',
          PCD_CRM_SOURCE_NOT_BEFORE_MS: String(boundaryMs),
        }, {
          now: boundaryMs + 8_000 + attempt,
          fetcher: { fetch: async (_input, init) => {
            const body = JSON.parse(String(init?.body));
            const original = deliveredBeforeReplay.results.find(({ event_id }) => event_id === body.eventId)!;
            expect(body.idempotencyKey).toBeUndefined();
            replayedReceipts.push(original.receiver_receipt_id);
            return Response.json({
              accepted: true,
              receiptId: original.receiver_receipt_id,
              eventId: body.eventId,
              sequence: body.sequence,
              replay: true,
            });
          } },
        });
        expect(replayDispatch).toMatchObject({ retried: 0, dead: 0 });
        replayDelivered += replayDispatch.delivered;
      }
      expect(replayDelivered).toBe(3);
      expect(replayedReceipts.sort()).toEqual(
        deliveredBeforeReplay.results.map(({ receiver_receipt_id }) => receiver_receipt_id).sort(),
      );
      const deliveredAfterReplay = await opsResource.db.prepare(`SELECT subject_id,event_id,idempotency_key,
          receiver_receipt_id,attempt_count,send_attempt_count
        FROM crm_adapter_outbox
        WHERE subject_type='contact' AND status='delivered'
        ORDER BY subject_id`).all<typeof deliveredBeforeReplay.results[number]>();
      expect(deliveredAfterReplay.results.map(({ subject_id, event_id, idempotency_key, receiver_receipt_id }) => ({
        subject_id, event_id, idempotency_key, receiver_receipt_id,
      }))).toEqual(deliveredBeforeReplay.results.map(({
        subject_id, event_id, idempotency_key, receiver_receipt_id,
      }) => ({ subject_id, event_id, idempotency_key, receiver_receipt_id })));
      expect(deliveredAfterReplay.results.every((row) => row.attempt_count === 2 && row.send_attempt_count === 2)).toBe(true);
      const dnc = await opsResource.db.prepare(`SELECT event_type,payload_json FROM crm_adapter_outbox
        WHERE subject_type='contact' AND subject_id='crm-pilot-contact-suppressed'`).first<{
          event_type: string; payload_json: string;
        }>();
      expect(dnc?.event_type).toBe('contact.deleted.v1');
      expect(JSON.parse(dnc?.payload_json ?? '{}').payload).toMatchObject({
        id: 'crm-pilot-contact-suppressed', suppressionState: 'do_not_contact',
      });
      expect(Object.keys(JSON.parse(dnc?.payload_json ?? '{}').payload).sort()).toEqual([
        'authorityUpdatedAt', 'id', 'organizationId', 'sourceVersion', 'suppressionState', 'workspaceId',
      ]);
      expect(dnc?.payload_json).not.toContain('crm-pilot-suppressed@example.invalid');
      expect(await opsResource.db.prepare(`SELECT COUNT(*) count FROM org_contacts
        WHERE id LIKE 'crm-pilot-contact-%' AND (
          name_identity IS NULL OR (email IS NOT NULL AND email_identity IS NULL)
          OR (phone IS NOT NULL AND phone_identity IS NULL)
        )`).first()).toEqual({ count: 0 });

      const deliveredDnc = deliveredContacts.find((event) => event.eventType === 'contact.deleted.v1') as {
        payload?: Record<string, unknown>;
      } | undefined;
      expect(deliveredDnc?.payload).toEqual(JSON.parse(dnc?.payload_json ?? '{}').payload);

      const eventCountsQuery = opsVerification.find((sql) => sql.includes('event_type,status,COUNT(*)'))!;
      const eventPlan = await opsResource.db.prepare(`EXPLAIN QUERY PLAN ${eventCountsQuery}`)
        .all<{ detail: string }>();
      const eventPlanText = eventPlan.results.map(({ detail }) => detail).join('\n');
      expect(eventPlanText).toContain('idx_crm_adapter_outbox_subject');
      expect(eventPlanText).not.toContain('SCAN crm_adapter_outbox');
      const rawFreeDncQuery = opsVerification.find((sql) => sql.includes('raw_free_dnc_events'))!;
      expect(await opsResource.db.prepare(rawFreeDncQuery).first()).toEqual({ raw_free_dnc_events: 1 });
      const validDncPayload = dnc!.payload_json;
      await opsResource.db.prepare(`UPDATE crm_adapter_outbox SET payload_json=?
        WHERE subject_type='contact' AND subject_id='crm-pilot-contact-suppressed'`)
        .bind(JSON.stringify({ payload: { suppressionState: 'do_not_contact' } })).run();
      expect(await opsResource.db.prepare(rawFreeDncQuery).first()).toEqual({ raw_free_dnc_events: 0 });
      await opsResource.db.prepare(`UPDATE crm_adapter_outbox SET payload_json=?
        WHERE subject_type='contact' AND subject_id='crm-pilot-contact-suppressed'`)
        .bind(validDncPayload).run();

      await runSql(opsResource.db, `
        CREATE TABLE workspace_organizations (
          workspace_id TEXT, organization_id TEXT, status TEXT, visibility_basis TEXT
        );
        CREATE TABLE workspace_contacts (
          workspace_id TEXT, contact_point_id TEXT, status TEXT, visibility_basis TEXT
        );
        CREATE TABLE adapter_contact_suppressions (
          producer TEXT, producer_workspace_id TEXT, source_contact_id TEXT,
          target_workspace_id TEXT, restriction_type TEXT
        );
        CREATE TABLE contact_points (id TEXT);
        INSERT INTO workspace_organizations VALUES
          ('ws-sightsmash','fixture-org-soccer','active','pcd_adapter'),
          ('ws-sightsmash','fixture-org-basketball','active','pcd_adapter'),
          ('ws-sightsmash','fixture-org-swim','active','pcd_adapter');
        INSERT INTO workspace_contacts VALUES
          ('ws-sightsmash','contact_crm-pilot-contact-email','active','pcd_public_professional_observation'),
          ('ws-sightsmash','contact_crm-pilot-contact-phone','active','pcd_public_professional_observation');
        INSERT INTO adapter_contact_suppressions VALUES
          ('parent-coach-desk','pcd-activity-radar','crm-pilot-contact-suppressed',
            'ws-sightsmash','do_not_contact');
      `);
      const crmVerification = splitSqlStatements(String(artifactContents.get('92-crm-verification.sql')));
      expect(crmVerification).toHaveLength(1);
      const expectedCrmReadback = {
        active_organization_projections: 3,
        active_contact_projections: 2,
        dnc_restrictions: 1,
        suppressed_contact_points: 0,
      };
      expect(await opsResource.db.prepare(crmVerification[0]!).first()).toEqual(expectedCrmReadback);
      await opsResource.db.prepare('DELETE FROM adapter_contact_suppressions').run();
      expect(await opsResource.db.prepare(crmVerification[0]!).first()).toEqual({
        ...expectedCrmReadback, dnc_restrictions: 0,
      });
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
});
