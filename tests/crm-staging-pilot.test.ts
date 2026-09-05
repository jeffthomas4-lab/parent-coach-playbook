import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { D1Database } from '@cloudflare/workers-types';
import {
  buildCrmStagingPilot,
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
  });

  it('rejects duplicate CLI flags instead of silently replacing an approved value', () => {
    expect(() => parsePilotArguments([
      '--boundary-ms', String(boundaryMs), '--boundary-ms', String(boundaryMs), '--output-dir', 'packet',
    ])).toThrow('duplicate_argument:--boundary-ms');
    expect(() => parsePilotArguments([
      '--boundary-ms', String(boundaryMs), '--output-dir', 'one', '--output-dir', 'two',
    ])).toThrow('duplicate_argument:--output-dir');
  });

  it('emits hash-pinned synthetic-only two-phase SQL and exercises every disposition', async () => {
    const root = await mkdtemp(join(tmpdir(), 'crm-staging-pilot-test-'));
    const outputDir = join(root, 'packet');
    try {
      const manifest = await buildCrmStagingPilot({ boundaryMs, outputDir });
      expect(manifest.remoteExecutionAuthorized).toBe(false);
      expect(manifest.organizations).toHaveLength(3);
      expect(manifest.contacts).toHaveLength(8);
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
      for (const artifact of manifest.artifacts) {
        const bytes = artifactContents.get(artifact.file)!;
        expect(createHash('sha256').update(bytes).digest('hex')).toBe(artifact.sha256);
      }
      const packageText = [...artifactContents.values()].join('\n');
      expect(packageText).not.toMatch(/wrangler|deploy|PCD_CRM_ADAPTER_ENABLED|PCD_CRM_BACKFILL_ENABLED/i);
      expect(packageText).not.toMatch(/@(?!example\.invalid)/i);

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
        const ownEvent = await opsResource.db.prepare(`SELECT event_id,source_sequence,payload_hash,authority_updated_at
          FROM crm_adapter_outbox WHERE subject_type='organization' AND subject_id=?`).bind(subjectId).first<{
            event_id: string; source_sequence: number; payload_hash: string; authority_updated_at: number;
          }>();
        await opsResource.db.prepare(`UPDATE crm_adapter_projection_receipts
          SET content_hash=?,last_event_id=?,last_sequence=?,authority_updated_at=?
          WHERE subject_type='organization' AND subject_id=?`).bind(
          ownEvent!.payload_hash, ownEvent!.event_id, ownEvent!.source_sequence,
          ownEvent!.authority_updated_at, subjectId,
        ).run();
      }
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
      expect(contactProjection).toMatchObject({ organizations: 0, contacts: 2, deferred: 6 });
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
});
