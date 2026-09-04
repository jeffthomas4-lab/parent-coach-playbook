import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { DatabaseSync, type StatementSync } from 'node:sqlite';
import type { D1Database } from '@cloudflare/workers-types';
import { splitSqlStatements } from '../tests/helpers/sql-split.ts';
import {
  dispatchPcdCrmOutbox,
  finalizePcdCrmBackfill,
  projectPcdCrmBackfill,
  reconcilePcdCrmBackfill,
  type CrmAdapterFetcher,
  type PcdCrmAdapterEnv,
} from '../src/lib/crm-adapter.ts';

const ORGANIZATIONS = 200_000;
const CONTACTS = 108;
const ELIGIBLE_CONTACTS = 16;
const REJECTED_CONTACTS = CONTACTS - ELIGIBLE_CONTACTS;
const EVENTS = ORGANIZATIONS + ELIGIBLE_CONTACTS;
const RESPONSE_LOSS_SEQUENCE = 100_001;
const PROJECTION_TICKS_PER_STAGE = 250;
const DELIVERY_TICKS_PER_STAGE = 1_000;
const RECONCILIATION_CALLS_PER_STAGE = 500;
const BOUNDARY = Date.parse('2026-09-02T00:00:00.000Z');
const SOURCE_AT = '2026-09-01 12:00:00';
const stateDirectory = process.argv[2];
if (!stateDirectory) throw new Error('state directory is required');

interface RunResult {
  meta: { changes: number; last_row_id: number | bigint };
}

function wrapD1(sqlite: DatabaseSync): D1Database {
  const prepared = new Map<string, StatementSync>();
  return {
    prepare(sql: string) {
      let bound: unknown[] = [];
      let native = prepared.get(sql);
      if (!native) {
        native = sqlite.prepare(sql);
        prepared.set(sql, native);
      }
      const statement = {
        bind(...params: unknown[]) {
          bound = params;
          return statement;
        },
        async first<T>(): Promise<T | null> {
          return (native.get(...(bound as never[])) ?? null) as T | null;
        },
        async all<T>(): Promise<{ results: T[] }> {
          return { results: native.all(...(bound as never[])) as T[] };
        },
        async run(): Promise<RunResult> {
          const result = native.run(...(bound as never[]));
          return { meta: { changes: Number(result.changes), last_row_id: result.lastInsertRowid } };
        },
      };
      return statement;
    },
    async batch(statements: Array<{ run: () => Promise<RunResult> }>) {
      sqlite.exec('BEGIN IMMEDIATE');
      try {
        const results: RunResult[] = [];
        for (const statement of statements) results.push(await statement.run());
        sqlite.exec('COMMIT');
        return results;
      } catch (error) {
        sqlite.exec('ROLLBACK');
        throw error;
      }
    },
  } as unknown as D1Database;
}

function openDatabase(path: string): DatabaseSync {
  const database = new DatabaseSync(path);
  // This is disposable synthetic evidence. D1 owns physical durability in hosted
  // environments; the harness keeps SQL transaction boundaries but skips a host
  // disk flush for every simulated minute tick so 200k logical deliveries finish.
  database.exec('PRAGMA journal_mode=WAL; PRAGMA synchronous=OFF; PRAGMA foreign_keys=ON; PRAGMA cache_size=-16000;');
  return database;
}

function applyOpsMigrations(database: DatabaseSync): void {
  const migrationDirectory = new URL('../migrations-pcd-ops/', import.meta.url);
  for (const name of readdirSync(migrationDirectory).filter((item) => item.endsWith('.sql')).sort()) {
    const sql = readFileSync(new URL(name, migrationDirectory), 'utf8');
    for (const statement of splitSqlStatements(sql)) database.exec(statement);
  }
}

function initialize(intel: DatabaseSync, ops: DatabaseSync, receiver: DatabaseSync): void {
  intel.exec(`CREATE TABLE organizations (
    id TEXT PRIMARY KEY, slug TEXT NOT NULL, name TEXT NOT NULL, organization_type TEXT,
    website_url TEXT, city TEXT, state TEXT, zip TEXT, categories TEXT, record_source TEXT NOT NULL,
    record_status TEXT NOT NULL, is_claimed INTEGER NOT NULL, confidence_score INTEGER,
    created_at TEXT NOT NULL, updated_at TEXT NOT NULL, content_hash TEXT, deleted_at TEXT
  );
  WITH RECURSIVE scale_rows(n) AS (
    VALUES(1) UNION ALL SELECT n+1 FROM scale_rows WHERE n<${ORGANIZATIONS}
  ) INSERT INTO organizations
    (id,slug,name,organization_type,website_url,city,state,zip,categories,record_source,record_status,is_claimed,
     confidence_score,created_at,updated_at,content_hash,deleted_at)
  SELECT printf('org-scale-%06d',n),printf('org-scale-%06d',n),printf('Scale Organization %d',n),
    'club_league',printf('https://org-scale-%06d.invalid',n),'Tacoma','WA','98401','["volleyball"]',
    'manual','active',0,90,'${SOURCE_AT}','${SOURCE_AT}',NULL,NULL FROM scale_rows;`);
  applyOpsMigrations(ops);
  const contact = ops.prepare(`INSERT INTO org_contacts
    (id,organization_id,full_name,title,role,email,is_primary,is_public,do_not_contact,source,source_url,
     confidence,verified_at,content_hash,deleted_at,created_at,updated_at,contact_context)
    VALUES (?,?,?,'Club Director','director',?,0,0,0,'website',?,'high',?,NULL,NULL,?,?,'professional')`);
  ops.exec('BEGIN IMMEDIATE');
  for (let index = 1; index <= CONTACTS; index += 1) {
    const id = `contact-scale-${String(index).padStart(3, '0')}`;
    const orgId = `org-scale-${String(index).padStart(6, '0')}`;
    contact.run(
      id,
      orgId,
      `Scale Director ${index}`,
      index <= ELIGIBLE_CONTACTS ? `${id}@scale.invalid` : null,
      `https://${orgId}.invalid/staff`,
      SOURCE_AT,
      SOURCE_AT,
      SOURCE_AT,
    );
  }
  ops.exec('COMMIT');
  receiver.exec(`CREATE TABLE receiver_events (
      event_id TEXT PRIMARY KEY, source_sequence INTEGER NOT NULL UNIQUE, event_type TEXT NOT NULL,
      payload_hash TEXT NOT NULL
    );
    CREATE TABLE scale_controls (key TEXT PRIMARY KEY, value INTEGER NOT NULL);`);
}

const encoder = new TextEncoder();
function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(',')}]`;
  if (value !== null && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>).sort(([left], [right]) => left.localeCompare(right));
    return `{${entries.map(([key, item]) => `${JSON.stringify(key)}:${stableJson(item)}`).join(',')}}`;
  }
  return JSON.stringify(value);
}
async function sha256(value: string): Promise<string> {
  const bytes = await crypto.subtle.digest('SHA-256', encoder.encode(value));
  return [...new Uint8Array(bytes)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function readControl(database: DatabaseSync, key: string): number {
  return Number((database.prepare('SELECT value FROM scale_controls WHERE key=?').get(key) as { value?: number } | undefined)?.value ?? 0);
}
function writeControl(database: DatabaseSync, key: string, value: number): void {
  database.prepare(`INSERT INTO scale_controls (key,value) VALUES (?,?)
    ON CONFLICT(key) DO UPDATE SET value=excluded.value`).run(key, value);
}

function receiverFetcher(receiver: DatabaseSync): CrmAdapterFetcher {
  const highWaterRead = receiver.prepare('SELECT COALESCE(MAX(source_sequence),0) value FROM receiver_events');
  const eventRead = receiver.prepare(`SELECT source_sequence,event_type,payload_hash FROM receiver_events WHERE event_id=?`);
  const eventInsert = receiver.prepare(`INSERT INTO receiver_events (event_id,source_sequence,event_type,payload_hash) VALUES (?,?,?,?)`);
  return {
    async fetch(input, init) {
      const body = JSON.parse(String(init?.body)) as Record<string, unknown>;
      if (String(input).endsWith('/reconcile')) {
        const manifest = body.events as Array<{ eventId: string; sequence: number; eventType: string; payloadHash: string }>;
        const missing: unknown[] = [];
        const mismatch: unknown[] = [];
        for (const item of manifest) {
          const stored = eventRead.get(item.eventId) as { source_sequence: number; event_type: string; payload_hash: string } | undefined;
          if (!stored) missing.push(item);
          else if (Number(stored.source_sequence) !== item.sequence || stored.event_type !== item.eventType
            || stored.payload_hash !== item.payloadHash) mismatch.push(item);
        }
        const highWater = Number((highWaterRead.get() as { value: number }).value);
        return Response.json({
          producer: 'parent-coach-desk',
          producerWorkspaceId: body.producerWorkspaceId,
          declaredHighWater: body.declaredHighWater,
          receiverHighWater: highWater,
          missing,
          duplicate: [],
          stale: [],
          unauthorized: [],
          mismatch,
        });
      }
      const eventId = String(body.eventId);
      const sequence = Number(body.sequence);
      const eventType = String(body.eventType);
      const payloadHash = await sha256(stableJson(body));
      const existing = eventRead.get(eventId) as { source_sequence: number; event_type: string; payload_hash: string } | undefined;
      if (existing) {
        assert.equal(Number(existing.source_sequence), sequence);
        assert.equal(existing.event_type, eventType);
        assert.equal(existing.payload_hash, payloadHash);
        if (sequence === RESPONSE_LOSS_SEQUENCE) writeControl(receiver, 'replayed_after_loss', 1);
        return Response.json({ accepted: true, receiptId: `receipt-${eventId}`, eventId, sequence, replay: true });
      }
      eventInsert.run(eventId, sequence, eventType, payloadHash);
      if (sequence === RESPONSE_LOSS_SEQUENCE && readControl(receiver, 'response_loss_simulated') === 0) {
        writeControl(receiver, 'response_loss_simulated', 1);
        throw new DOMException('simulated response loss', 'AbortError');
      }
      return Response.json({ accepted: true, receiptId: `receipt-${eventId}`, eventId, sequence, replay: false }, { status: 202 });
    },
  };
}

function output(value: Record<string, unknown>): void {
  process.stdout.write(`${JSON.stringify(value)}\n`);
}

const intelPath = join(stateDirectory, 'intel.sqlite');
const opsPath = join(stateDirectory, 'ops.sqlite');
const receiverPath = join(stateDirectory, 'receiver.sqlite');
const fresh = !existsSync(opsPath);
const intel = openDatabase(intelPath);
const ops = openDatabase(opsPath);
const receiver = openDatabase(receiverPath);
if (fresh) initialize(intel, ops, receiver);
const env: PcdCrmAdapterEnv = {
  DB: wrapD1(intel),
  PCD_OPS_DB: wrapD1(ops),
  PCD_CRM_ADAPTER_ENABLED: 'true',
  PCD_CRM_BACKFILL_ENABLED: 'true',
  PCD_CRM_ADAPTER_HMAC_SECRET: 'scale-test-pcd-adapter-secret',
  PCD_CRM_PRODUCER_WORKSPACE_ID: 'pcd-activity-radar',
  PCD_CRM_TARGET_WORKSPACE_ID: 'ws-sightsmash',
  PCD_CRM_SOURCE_ID: 'source-scale-test',
  PCD_CRM_SOURCE_NOT_BEFORE_MS: String(BOUNDARY),
};
const fetcher = receiverFetcher(receiver);

try {
  const run = ops.prepare(`SELECT status,reconciliation_complete FROM crm_adapter_backfill_runs`).get() as {
    status: string;
    reconciliation_complete: number;
  } | undefined;
  if (!run || run.status === 'running') {
    let organizations = 0;
    let contacts = 0;
    let rejected = 0;
    let complete = false;
    for (let tick = 0; tick < PROJECTION_TICKS_PER_STAGE; tick += 1) {
      const result = await projectPcdCrmBackfill(env, { limit: 50, now: BOUNDARY + Date.now() % 86_400_000 + tick });
      organizations += result.organizations;
      contacts += result.contacts;
      rejected += result.rejected;
      if (result.scanCompleted) { complete = true; break; }
    }
    const total = Number((ops.prepare(`SELECT COALESCE(SUM(rows_seen),0) value FROM crm_adapter_backfill_chunks`).get() as { value: number }).value);
    output({ event: 'pcd_crm_scale_projection_stage', complete: false, scanComplete: complete, sourceRowsProcessed: total, organizations, contacts, rejected });
  } else {
    const pending = Number((ops.prepare(`SELECT COUNT(*) value FROM crm_adapter_outbox WHERE status!='delivered'`).get() as { value: number }).value);
    if (pending > 0) {
      let delivered = 0;
      let retried = 0;
      let deliveryNow = readControl(receiver, 'delivery_now');
      if (!deliveryNow) {
        deliveryNow = Number((ops.prepare(`SELECT COALESCE(MAX(updated_at),0) value FROM crm_adapter_outbox`).get() as { value: number }).value) + 31_000;
      }
      for (let tick = 0; tick < DELIVERY_TICKS_PER_STAGE; tick += 1) {
        const result = await dispatchPcdCrmOutbox(env, { fetcher, limit: 10, now: deliveryNow });
        delivered += result.delivered;
        retried += result.retried;
        deliveryNow += 31_000;
        if (result.claimed === 0) break;
      }
      writeControl(receiver, 'delivery_now', deliveryNow);
      const remaining = Number((ops.prepare(`SELECT COUNT(*) value FROM crm_adapter_outbox WHERE status!='delivered'`).get() as { value: number }).value);
      output({ event: 'pcd_crm_scale_delivery_stage', complete: false, delivered, retried, remaining });
    } else {
      if (readControl(receiver, 'missing_receiver_recovered') === 0) {
        receiver.exec(`DELETE FROM receiver_events WHERE source_sequence=1;`);
        const missing = await reconcilePcdCrmBackfill(env, { fetcher, now: Date.now() });
        assert.equal(missing.missing, 1);
        assert.equal(Number((ops.prepare(`SELECT COUNT(*) value FROM crm_adapter_backfill_reconciliation_windows`).get() as { value: number }).value), 0);
        assert.equal((ops.prepare(`SELECT status FROM crm_adapter_outbox WHERE source_sequence=1`).get() as { status: string }).status, 'retry');
        const repaired = await dispatchPcdCrmOutbox(env, { fetcher, limit: 10, now: Date.now() + 1 });
        assert.equal(repaired.delivered, 1);
        assert.equal(Number((receiver.prepare(`SELECT COUNT(*) value FROM receiver_events WHERE source_sequence=1`).get() as { value: number }).value), 1);
        writeControl(receiver, 'missing_receiver_recovered', 1);
      }
      let reconciliationComplete = false;
      let calls = 0;
      for (; calls < RECONCILIATION_CALLS_PER_STAGE; calls += 1) {
        const result = await reconcilePcdCrmBackfill(env, { fetcher, now: Date.now() + calls + 1 });
        if (result.completed) { reconciliationComplete = true; calls += 1; break; }
      }
      if (!reconciliationComplete) {
        const windows = Number((ops.prepare(`SELECT COUNT(*) value FROM crm_adapter_backfill_reconciliation_windows`).get() as { value: number }).value);
        output({ event: 'pcd_crm_scale_reconciliation_stage', complete: false, calls, windows });
      } else {
        const final = await finalizePcdCrmBackfill(env, { now: Date.now() + calls + 2 });
        assert.deepEqual(final, { enabled: true, completed: true, pending: 0, dead: 0, reconciled: true });
        const expectedWindows = Math.ceil(EVENTS / 100) * 2;
        const accounting = ops.prepare(`SELECT
          (SELECT status FROM crm_adapter_backfill_runs) status,
          (SELECT expected_organization_rows FROM crm_adapter_backfill_runs) expected_organizations,
          (SELECT expected_contact_rows FROM crm_adapter_backfill_runs) expected_contacts,
          (SELECT COALESCE(SUM(rows_seen),0) FROM crm_adapter_backfill_chunks WHERE subject_type='organization') organization_rows,
          (SELECT COALESCE(SUM(rows_seen),0) FROM crm_adapter_backfill_chunks WHERE subject_type='contact') contact_rows,
          (SELECT COALESCE(SUM(rejected_count),0) FROM crm_adapter_backfill_chunks WHERE subject_type='contact') rejected_contacts,
          (SELECT COUNT(*) FROM crm_adapter_outbox) events,
          (SELECT COUNT(*) FROM crm_adapter_outbox WHERE status='delivered' AND receiver_receipt_id IS NOT NULL) delivered,
          (SELECT COUNT(*) FROM crm_adapter_backfill_reconciliation_windows) windows,
          (SELECT COUNT(*) FROM crm_adapter_backfill_reconciliation_windows
            WHERE missing_count+duplicate_count+stale_count+unauthorized_count+mismatch_count!=0) bad_windows`).get() as Record<string, number | string>;
        assert.deepEqual({ ...accounting }, {
          status: 'completed',
          expected_organizations: ORGANIZATIONS,
          expected_contacts: CONTACTS,
          organization_rows: ORGANIZATIONS,
          contact_rows: CONTACTS,
          rejected_contacts: REJECTED_CONTACTS,
          events: EVENTS,
          delivered: EVENTS,
          windows: expectedWindows,
          bad_windows: 0,
        });
        assert.equal(Number((receiver.prepare(`SELECT COUNT(*) value FROM receiver_events`).get() as { value: number }).value), EVENTS);
        assert.equal(readControl(receiver, 'response_loss_simulated'), 1);
        assert.equal(readControl(receiver, 'replayed_after_loss'), 1);
        assert.equal(readControl(receiver, 'missing_receiver_recovered'), 1);
        output({
          event: 'pcd_crm_scale_final',
          complete: true,
          organizations: ORGANIZATIONS,
          contacts: CONTACTS,
          eligibleContacts: ELIGIBLE_CONTACTS,
          rejectedContacts: REJECTED_CONTACTS,
          events: EVENTS,
          delivered: EVENTS,
          reconciliationWindows: expectedWindows,
          simulatedResponseLosses: 1,
          detectedAndRecoveredMissingEvents: 1,
        });
      }
    }
  }
} finally {
  intel.close();
  ops.close();
  receiver.close();
}
