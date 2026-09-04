import type { D1Database, D1PreparedStatement } from '@cloudflare/workers-types';

const PRODUCER = 'parent-coach-desk';
const CONTRACT_VERSION = 2;
const EVENT_SCOPE = 'crm.adapters.pcd.events.v2';
const RECONCILE_SCOPE = 'crm.adapters.pcd.reconcile.v2';
const MAX_ATTEMPTS = 8;
const MAX_RESPONSE_BYTES = 4096;

export interface CrmAdapterFetcher {
  fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
}

export interface PcdCrmAdapterEnv {
  DB?: D1Database;
  PCD_OPS_DB?: D1Database;
  CRM_ADAPTER?: CrmAdapterFetcher;
  PCD_CRM_ADAPTER_ENABLED?: string;
  PCD_CRM_BACKFILL_ENABLED?: string;
  PCD_CRM_ADAPTER_HMAC_SECRET?: string;
  PCD_CRM_PRODUCER_WORKSPACE_ID?: string;
  PCD_CRM_TARGET_WORKSPACE_ID?: string;
  PCD_CRM_SOURCE_ID?: string;
  PCD_CRM_SOURCE_NOT_BEFORE_MS?: string;
}

interface OrganizationRow {
  id: string;
  name: string;
  organization_type: string | null;
  website_url: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  categories: string | null;
  record_status: string;
  is_claimed: number;
  content_hash: string | null;
  deleted_at: string | null;
  updated_at: string;
}

export interface PcdContactProjectionInput {
  id: string;
  organization_id: string;
  full_name: string | null;
  title: string | null;
  role: string;
  email: string | null;
  phone: string | null;
  do_not_contact: number;
  source_url: string | null;
  confidence: string;
  verified_at: string | null;
  content_hash: string | null;
  deleted_at: string | null;
  updated_at: string;
}

type PcdEventType =
  | 'organization.upserted.v1'
  | 'organization.deleted.v1'
  | 'contact.observed.v1'
  | 'contact.deleted.v1';

interface EventDraft {
  eventId: string;
  eventType: PcdEventType;
  subjectType: 'organization' | 'contact';
  subjectId: string;
  authorityUpdatedAt: number;
  contentHash: string;
  occurredAt: number;
  payload: Record<string, unknown>;
}

interface OutboxRow {
  id: string;
  event_id: string;
  source_sequence: number;
  event_type: string;
  payload_json: string;
  payload_hash: string;
  idempotency_key: string;
  attempt_count: number;
}

interface BackfillRunRow {
  id: string;
  snapshot_before_ms: number;
  expected_organization_rows: number;
  expected_contact_rows: number;
  status: 'running' | 'scanned' | 'completed';
  organization_cursor_id: string;
  contact_cursor_id: string;
  organization_complete: number;
  contact_complete: number;
  lease_id: string | null;
  lease_expires_at: number | null;
}

interface BackfillResult {
  enabled: boolean;
  organizations: number;
  contacts: number;
  replayed: number;
  rejected: number;
  scanCompleted: boolean;
  completed: boolean;
  busy: boolean;
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

async function hmacHex(secret: string, value: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const bytes = await crypto.subtle.sign('HMAC', key, encoder.encode(value));
  return [...new Uint8Array(bytes)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function parseJsonArray(value: string | null): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string').slice(0, 25) : [];
  } catch {
    return [];
  }
}

function timestamp(value: string | null | undefined): number {
  const parsed = Date.parse(value ?? '');
  return Number.isFinite(parsed) && parsed > 0 ? parsed : Date.now();
}

async function stableEventId(prefix: string, subjectId: string, contentHash: string): Promise<string> {
  const raw = `pcd:${prefix}:${subjectId}:${contentHash.slice(0, 32)}`;
  return raw.length <= 180 ? raw : `pcd:${prefix}:${await sha256(raw)}`;
}

interface PcdAdapterConfig {
  producerWorkspaceId: string;
  targetWorkspaceId: string;
  sourceId: string;
  sourceNotBeforeMs: number;
}

function requireConfig(env: PcdCrmAdapterEnv): PcdAdapterConfig | null {
  const producerWorkspaceId = env.PCD_CRM_PRODUCER_WORKSPACE_ID?.trim() ?? '';
  const targetWorkspaceId = env.PCD_CRM_TARGET_WORKSPACE_ID?.trim() ?? '';
  const sourceId = env.PCD_CRM_SOURCE_ID?.trim() ?? '';
  const sourceNotBeforeRaw = env.PCD_CRM_SOURCE_NOT_BEFORE_MS?.trim() ?? '';
  const sourceNotBeforeMs = Number(sourceNotBeforeRaw);
  if (!producerWorkspaceId || !targetWorkspaceId || !sourceId
    || !/^\d+$/.test(sourceNotBeforeRaw) || !Number.isSafeInteger(sourceNotBeforeMs)
    || sourceNotBeforeMs <= 0 || sourceNotBeforeMs % 1000 !== 0) return null;
  return { producerWorkspaceId, targetWorkspaceId, sourceId, sourceNotBeforeMs };
}

function cursorAtOrAfterActivation(cursorAt: string, cursorId: string, sourceNotBeforeMs: number): { at: string; id: string } {
  const sourceNotBefore = new Date(sourceNotBeforeMs).toISOString();
  const parsedCursor = Date.parse(cursorAt);
  return Number.isFinite(parsedCursor) && parsedCursor >= sourceNotBeforeMs
    ? { at: cursorAt, id: cursorId }
    : { at: sourceNotBefore, id: '' };
}

async function organizationDraft(row: OrganizationRow, targetWorkspaceId: string): Promise<EventDraft> {
  const authorityUpdatedAt = timestamp(row.updated_at);
  const contentHash = row.content_hash || await sha256(stableJson({
    id: row.id,
    name: row.name,
    organizationType: row.organization_type,
    websiteUrl: row.website_url,
    city: row.city,
    state: row.state,
    postalCode: row.zip,
    categories: parseJsonArray(row.categories),
    recordStatus: row.record_status,
    claimed: Number(row.is_claimed) === 1,
    deletedAt: row.deleted_at,
  }));
  const deleted = !!row.deleted_at;
  return {
    eventId: await stableEventId(deleted ? 'organization-deleted' : 'organization-upserted', row.id, contentHash),
    eventType: deleted ? 'organization.deleted.v1' : 'organization.upserted.v1',
    subjectType: 'organization',
    subjectId: row.id,
    authorityUpdatedAt,
    contentHash,
    occurredAt: authorityUpdatedAt,
    payload: deleted ? {
      id: row.id,
      workspaceId: targetWorkspaceId,
      sourceVersion: contentHash,
      authorityUpdatedAt,
    } : {
      id: row.id,
      workspaceId: targetWorkspaceId,
      displayName: row.name,
      organizationType: row.organization_type ?? undefined,
      websiteUrl: row.website_url ?? undefined,
      city: row.city ?? undefined,
      state: row.state ?? undefined,
      postalCode: row.zip ?? undefined,
      country: 'US',
      categories: parseJsonArray(row.categories),
      recordStatus: row.record_status === 'inactive' ? 'inactive' : row.record_status === 'unverified' ? 'candidate' : 'active',
      claimedState: Number(row.is_claimed) === 1 ? 'claimed' : 'unclaimed',
      sourceVersion: contentHash,
      authorityUpdatedAt,
    },
  };
}

async function contactDraft(
  row: PcdContactProjectionInput,
  targetWorkspaceId: string,
  sourceId: string,
): Promise<EventDraft | null> {
  const authorityUpdatedAt = timestamp(row.updated_at);
  const contentHash = row.content_hash || await sha256(stableJson({
    id: row.id,
    organizationId: row.organization_id,
    fullName: row.full_name,
    title: row.title,
    role: row.role,
    email: row.email,
    phone: row.phone,
    doNotContact: Number(row.do_not_contact) === 1,
    sourceUrl: row.source_url,
    confidence: row.confidence,
    verifiedAt: row.verified_at,
    deletedAt: row.deleted_at,
  }));
  if (row.deleted_at) {
    return {
      eventId: await stableEventId('contact-deleted', row.id, contentHash),
      eventType: 'contact.deleted.v1',
      subjectType: 'contact',
      subjectId: row.id,
      authorityUpdatedAt,
      contentHash,
      occurredAt: authorityUpdatedAt,
      payload: {
        id: row.id,
        organizationId: row.organization_id,
        workspaceId: targetWorkspaceId,
        sourceVersion: contentHash,
        authorityUpdatedAt,
      },
    };
  }
  const type = row.email ? 'email' : row.phone ? 'phone' : null;
  const value = row.email ?? row.phone;
  if (!type || !value || !row.source_url) return null;
  return {
    eventId: await stableEventId('contact-observed', row.id, contentHash),
    eventType: 'contact.observed.v1',
    subjectType: 'contact',
    subjectId: row.id,
    authorityUpdatedAt,
    contentHash,
    occurredAt: authorityUpdatedAt,
    payload: {
      id: row.id,
      personDisplayName: row.full_name ?? undefined,
      roleTitle: row.title ?? undefined,
      roleType: row.role,
      organizationId: row.organization_id,
      workspaceId: targetWorkspaceId,
      sourceId,
      sourceUrl: row.source_url,
      type,
      value,
      label: row.title ?? row.role,
      professionalContext: true,
      verificationState: row.verified_at ? 'verified' : 'observed',
      confidence: row.confidence === 'high' ? 90 : row.confidence === 'low' ? 40 : 70,
      observedAt: timestamp(row.verified_at ?? row.updated_at),
      doNotContact: Number(row.do_not_contact) === 1,
      sourceVersion: contentHash,
      authorityUpdatedAt,
    },
  };
}

async function ensureControl(db: D1Database, producerWorkspaceId: string, now: number): Promise<void> {
  await db.prepare(`INSERT OR IGNORE INTO crm_adapter_controls (producer_workspace_id,next_sequence,updated_at) VALUES (?,1,?)`)
    .bind(producerWorkspaceId, now).run();
}

async function enqueueDrafts(
  db: D1Database,
  producerWorkspaceId: string,
  drafts: EventDraft[],
  now: number,
  cursor?: { kind: 'organization' | 'contact'; at: string; id: string },
  canonicalStatements: D1PreparedStatement[] = [],
  backfillRunId?: string,
): Promise<{ projected: number; replayed: number; highWater: number }> {
  await ensureControl(db, producerWorkspaceId, now);
  const existingIds = new Set<string>();
  if (drafts.length) {
    const placeholders = drafts.map(() => '?').join(',');
    const existing = await db.prepare(`SELECT event_id FROM crm_adapter_outbox WHERE event_id IN (${placeholders})`)
      .bind(...drafts.map((draft) => draft.eventId)).all<{ event_id: string }>();
    for (const row of existing.results) existingIds.add(row.event_id);
  }
  const pending = drafts.filter((draft) => !existingIds.has(draft.eventId));
  const control = await db.prepare(`SELECT next_sequence FROM crm_adapter_controls WHERE producer_workspace_id=?`)
    .bind(producerWorkspaceId).first<{ next_sequence: number }>();
  if (!control) throw new Error('crm_adapter_control_missing');
  const start = Number(control.next_sequence);
  const statements: D1PreparedStatement[] = [...canonicalStatements];
  for (const [index, draft] of pending.entries()) {
    const sequence = start + index;
    const envelope = {
      contractVersion: CONTRACT_VERSION,
      producerWorkspaceId,
      eventType: draft.eventType,
      eventId: draft.eventId,
      sequence,
      occurredAt: draft.occurredAt,
      payload: draft.payload,
    };
    const payloadJson = JSON.stringify(envelope);
    const payloadHash = await sha256(stableJson(envelope));
    const backfillColumn = backfillRunId ? ',backfill_run_id' : '';
    const backfillPlaceholder = backfillRunId ? ',?' : '';
    statements.push(
      db.prepare(`INSERT INTO crm_adapter_outbox
        (id,producer_workspace_id,event_id,source_sequence,event_type,subject_type,subject_id,authority_updated_at,payload_json,payload_hash,idempotency_key,status,attempt_count,next_attempt_at,created_at,updated_at${backfillColumn})
        VALUES (?,?,?,?,?,?,?,?,?,?,?,'pending',0,?,?,?${backfillPlaceholder})`).bind(
        `pcd-outbox:${draft.eventId}`, producerWorkspaceId, draft.eventId, sequence, draft.eventType,
        draft.subjectType, draft.subjectId, draft.authorityUpdatedAt, payloadJson, payloadHash, draft.eventId,
        now, now, now, ...(backfillRunId ? [backfillRunId] : []),
      ),
      db.prepare(`INSERT INTO crm_adapter_projection_receipts
        (subject_type,subject_id,content_hash,last_event_id,last_sequence,authority_updated_at,projected_at)
        VALUES (?,?,?,?,?,?,?)
        ON CONFLICT(subject_type,subject_id) DO UPDATE SET content_hash=excluded.content_hash,
          last_event_id=excluded.last_event_id,last_sequence=excluded.last_sequence,
          authority_updated_at=excluded.authority_updated_at,projected_at=excluded.projected_at
        WHERE excluded.authority_updated_at>=crm_adapter_projection_receipts.authority_updated_at`).bind(
        draft.subjectType, draft.subjectId, draft.contentHash, draft.eventId, sequence, draft.authorityUpdatedAt, now,
      ),
    );
  }
  if (pending.length) {
    statements.push(db.prepare(`UPDATE crm_adapter_controls SET next_sequence=?,updated_at=?
      WHERE producer_workspace_id=? AND next_sequence=?`).bind(start + pending.length, now, producerWorkspaceId, start));
  }
  if (backfillRunId && existingIds.size) {
    const placeholders = [...existingIds].map(() => '?').join(',');
    statements.push(db.prepare(`UPDATE crm_adapter_outbox SET backfill_run_id=?
      WHERE backfill_run_id IS NULL AND event_id IN (${placeholders})`)
      .bind(backfillRunId, ...existingIds));
  }
  if (cursor) {
    const column = cursor.kind === 'organization'
      ? 'organization_cursor_at=?,organization_cursor_id=?'
      : 'contact_cursor_at=?,contact_cursor_id=?';
    statements.push(db.prepare(`UPDATE crm_adapter_controls SET ${column},updated_at=? WHERE producer_workspace_id=?`)
      .bind(cursor.at, cursor.id, now, producerWorkspaceId));
  }
  if (statements.length) await db.batch(statements);
  return { projected: pending.length, replayed: drafts.length - pending.length, highWater: start + pending.length - 1 };
}

export async function commitPcdContactMutation(
  env: PcdCrmAdapterEnv,
  canonicalStatement: D1PreparedStatement,
  row: PcdContactProjectionInput,
  now: number,
): Promise<void> {
  if (!env.PCD_OPS_DB) throw new Error('pcd_ops_db_missing');
  if (env.PCD_CRM_ADAPTER_ENABLED !== 'true') {
    await canonicalStatement.run();
    return;
  }
  const config = requireConfig(env);
  if (!config) throw new Error('pcd_crm_adapter_configuration_missing');
  const rowUpdatedAt = Date.parse(row.updated_at);
  const draft = Number.isFinite(rowUpdatedAt) && rowUpdatedAt >= config.sourceNotBeforeMs
    ? await contactDraft(row, config.targetWorkspaceId, config.sourceId)
    : null;
  await enqueueDrafts(
    env.PCD_OPS_DB,
    config.producerWorkspaceId,
    draft ? [draft] : [],
    now,
    undefined,
    [canonicalStatement],
  );
}

export async function projectPcdCrmEvents(
  env: PcdCrmAdapterEnv,
  options: { limit?: number; now?: number } = {},
): Promise<{ enabled: boolean; organizations: number; contacts: number; replayed: number; deferred: number }> {
  if (env.PCD_CRM_ADAPTER_ENABLED !== 'true') return { enabled: false, organizations: 0, contacts: 0, replayed: 0, deferred: 0 };
  const config = requireConfig(env);
  if (!config || !env.DB || !env.PCD_OPS_DB) throw new Error('pcd_crm_adapter_configuration_missing');
  const now = options.now ?? Date.now();
  const limit = Math.max(1, Math.min(50, Math.trunc(options.limit ?? 25)));
  await ensureControl(env.PCD_OPS_DB, config.producerWorkspaceId, now);
  const control = await env.PCD_OPS_DB.prepare(`SELECT organization_cursor_at,organization_cursor_id,contact_cursor_at,contact_cursor_id
    FROM crm_adapter_controls WHERE producer_workspace_id=?`).bind(config.producerWorkspaceId)
    .first<{ organization_cursor_at: string; organization_cursor_id: string; contact_cursor_at: string; contact_cursor_id: string }>();
  if (!control) throw new Error('pcd_crm_adapter_control_missing');
  const organizationCursor = cursorAtOrAfterActivation(
    control.organization_cursor_at,
    control.organization_cursor_id,
    config.sourceNotBeforeMs,
  );
  const contactCursor = cursorAtOrAfterActivation(
    control.contact_cursor_at,
    control.contact_cursor_id,
    config.sourceNotBeforeMs,
  );

  const organizationCursorSecond = Math.trunc(timestamp(organizationCursor.at) / 1000);
  const contactCursorSecond = Math.trunc(timestamp(contactCursor.at) / 1000);
  const organizations = await env.DB.prepare(`SELECT id,name,organization_type,website_url,city,state,zip,categories,
    record_status,is_claimed,content_hash,deleted_at,updated_at FROM organizations
    WHERE unixepoch(updated_at)>? OR (unixepoch(updated_at)=? AND id>?)
    ORDER BY unixepoch(updated_at),id LIMIT ?`)
    .bind(organizationCursorSecond, organizationCursorSecond, organizationCursor.id, limit)
    .all<OrganizationRow>();
  const organizationDrafts = await Promise.all(organizations.results.map((row) => organizationDraft(row, config.targetWorkspaceId)));
  const lastOrganization = organizations.results.at(-1);
  const orgResult = await enqueueDrafts(
    env.PCD_OPS_DB,
    config.producerWorkspaceId,
    organizationDrafts,
    now,
    lastOrganization ? { kind: 'organization', at: lastOrganization.updated_at, id: lastOrganization.id } : undefined,
  );

  let contacts = { results: [] as PcdContactProjectionInput[] };
  if (env.PCD_CRM_BACKFILL_ENABLED === 'true') {
    const historicalOrganizations = await env.PCD_OPS_DB.prepare(`SELECT organization_complete
      FROM crm_adapter_backfill_runs WHERE producer_workspace_id=? AND target_workspace_id=?`)
      .bind(config.producerWorkspaceId, config.targetWorkspaceId).first<{ organization_complete: number }>();
    if (historicalOrganizations?.organization_complete === 1) {
      contacts = await env.PCD_OPS_DB.prepare(`SELECT id,organization_id,full_name,title,role,email,phone,do_not_contact,
        source_url,confidence,verified_at,content_hash,deleted_at,updated_at FROM org_contacts
        WHERE unixepoch(updated_at)>? OR (unixepoch(updated_at)=? AND id>?)
        ORDER BY unixepoch(updated_at),id LIMIT ?`)
        .bind(contactCursorSecond, contactCursorSecond, contactCursor.id, limit).all<PcdContactProjectionInput>();
    }
  } else {
    contacts = await env.PCD_OPS_DB.prepare(`SELECT id,organization_id,full_name,title,role,email,phone,do_not_contact,
      source_url,confidence,verified_at,content_hash,deleted_at,updated_at FROM org_contacts
      WHERE unixepoch(updated_at)>? OR (unixepoch(updated_at)=? AND id>?)
      ORDER BY unixepoch(updated_at),id LIMIT ?`)
      .bind(contactCursorSecond, contactCursorSecond, contactCursor.id, limit).all<PcdContactProjectionInput>();
  }
  const contactCandidates = await Promise.all(
    contacts.results.map((row) => contactDraft(row, config.targetWorkspaceId, config.sourceId)),
  );
  const contactDrafts = contactCandidates.filter((draft): draft is EventDraft => draft !== null);
  const lastContact = contacts.results.at(-1);
  const contactResult = await enqueueDrafts(
    env.PCD_OPS_DB,
    config.producerWorkspaceId,
    contactDrafts,
    now,
    lastContact ? { kind: 'contact', at: lastContact.updated_at, id: lastContact.id } : undefined,
  );
  return {
    enabled: true,
    organizations: orgResult.projected,
    contacts: contactResult.projected,
    replayed: orgResult.replayed + contactResult.replayed,
    deferred: contactCandidates.length - contactDrafts.length,
  };
}

function disabledBackfill(): BackfillResult {
  return { enabled: false, organizations: 0, contacts: 0, replayed: 0, rejected: 0, scanCompleted: false, completed: false, busy: false };
}

async function ensureBackfillRun(
  env: PcdCrmAdapterEnv,
  config: PcdAdapterConfig,
  now: number,
  verifyInventory = false,
): Promise<BackfillRunRow> {
  if (!env.DB || !env.PCD_OPS_DB) throw new Error('pcd_crm_adapter_configuration_missing');
  const db = env.PCD_OPS_DB;
  const runId = `pcd-backfill:${await sha256(`${config.producerWorkspaceId}:${config.targetWorkspaceId}:${config.sourceNotBeforeMs}`)}`;
  let run = await db.prepare(`SELECT id,snapshot_before_ms,expected_organization_rows,expected_contact_rows,
    status,organization_cursor_id,contact_cursor_id,
    organization_complete,contact_complete,lease_id,lease_expires_at FROM crm_adapter_backfill_runs
    WHERE producer_workspace_id=? AND target_workspace_id=?`).bind(config.producerWorkspaceId, config.targetWorkspaceId)
    .first<BackfillRunRow>();
  if (!run) {
    const snapshotBeforeSecond = config.sourceNotBeforeMs / 1000;
    const [organizations, contacts] = await Promise.all([
      env.DB.prepare(`SELECT SUM(CASE WHEN unixepoch(created_at)<? THEN 1 ELSE 0 END) count,
        SUM(CASE WHEN unixepoch(created_at) IS NULL OR unixepoch(updated_at) IS NULL THEN 1 ELSE 0 END) invalid
        FROM organizations`)
        .bind(snapshotBeforeSecond).first<{ count: number; invalid: number }>(),
      db.prepare(`SELECT SUM(CASE WHEN unixepoch(created_at)<? THEN 1 ELSE 0 END) count,
        SUM(CASE WHEN unixepoch(created_at) IS NULL OR unixepoch(updated_at) IS NULL THEN 1 ELSE 0 END) invalid
        FROM org_contacts`)
        .bind(snapshotBeforeSecond).first<{ count: number; invalid: number }>(),
    ]);
    if (Number(organizations?.invalid ?? 0) > 0 || Number(contacts?.invalid ?? 0) > 0) {
      throw new Error('pcd_crm_backfill_source_timestamp_invalid');
    }
    await db.prepare(`INSERT OR IGNORE INTO crm_adapter_backfill_runs
      (id,producer_workspace_id,target_workspace_id,snapshot_before_ms,expected_organization_rows,
       expected_contact_rows,status,started_at,updated_at)
      VALUES (?,?,?,?,?,?,'running',?,?)`).bind(
      runId, config.producerWorkspaceId, config.targetWorkspaceId, config.sourceNotBeforeMs,
      Number(organizations?.count ?? 0), Number(contacts?.count ?? 0), now, now,
    ).run();
    run = await db.prepare(`SELECT id,snapshot_before_ms,expected_organization_rows,expected_contact_rows,
      status,organization_cursor_id,contact_cursor_id,
      organization_complete,contact_complete,lease_id,lease_expires_at FROM crm_adapter_backfill_runs
      WHERE producer_workspace_id=? AND target_workspace_id=?`).bind(config.producerWorkspaceId, config.targetWorkspaceId)
      .first<BackfillRunRow>();
  }
  if (!run || Number(run.snapshot_before_ms) !== config.sourceNotBeforeMs || run.id !== runId) {
    throw new Error('pcd_crm_backfill_boundary_conflict');
  }
  if (verifyInventory) {
    const snapshotBeforeSecond = config.sourceNotBeforeMs / 1000;
    const [organizations, contacts] = await Promise.all([
      env.DB.prepare(`SELECT SUM(CASE WHEN unixepoch(created_at)<? THEN 1 ELSE 0 END) count,
        SUM(CASE WHEN unixepoch(created_at) IS NULL OR unixepoch(updated_at) IS NULL THEN 1 ELSE 0 END) invalid
        FROM organizations`)
        .bind(snapshotBeforeSecond).first<{ count: number; invalid: number }>(),
      db.prepare(`SELECT SUM(CASE WHEN unixepoch(created_at)<? THEN 1 ELSE 0 END) count,
        SUM(CASE WHEN unixepoch(created_at) IS NULL OR unixepoch(updated_at) IS NULL THEN 1 ELSE 0 END) invalid
        FROM org_contacts`)
        .bind(snapshotBeforeSecond).first<{ count: number; invalid: number }>(),
    ]);
    if (Number(organizations?.invalid ?? 0) > 0 || Number(contacts?.invalid ?? 0) > 0) {
      throw new Error('pcd_crm_backfill_source_timestamp_invalid');
    }
    if (Number(organizations?.count ?? 0) !== Number(run.expected_organization_rows)
      || Number(contacts?.count ?? 0) !== Number(run.expected_contact_rows)) {
      throw new Error('pcd_crm_backfill_source_inventory_changed');
    }
  }
  return run;
}

async function recordBackfillChunk(
  db: D1Database,
  run: BackfillRunRow,
  subjectType: 'organization' | 'contact',
  afterCursorId: string,
  lastCursorId: string,
  rowsSeen: number,
  eligibleCount: number,
  newEventCount: number,
  replayedEventCount: number,
  rejectedCount: number,
  dispositionHash: string,
  complete: boolean,
  leaseId: string,
  now: number,
): Promise<void> {
  const ordinalRow = await db.prepare(`SELECT COALESCE(MAX(chunk_ordinal),0)+1 ordinal
    FROM crm_adapter_backfill_chunks WHERE run_id=? AND subject_type=?`).bind(run.id, subjectType)
    .first<{ ordinal: number }>();
  const ordinal = Number(ordinalRow?.ordinal ?? 1);
  const cursorColumn = subjectType === 'organization' ? 'organization_cursor_id' : 'contact_cursor_id';
  const completeColumn = subjectType === 'organization' ? 'organization_complete' : 'contact_complete';
  const results = await db.batch([
    db.prepare(`INSERT INTO crm_adapter_backfill_chunks
      (id,run_id,subject_type,chunk_ordinal,after_cursor_id,last_cursor_id,rows_seen,eligible_count,new_event_count,
       replayed_event_count,rejected_count,disposition_hash,created_at)
      SELECT ?,?,?,?,?,?,?,?,?,?,?,?,?
      WHERE EXISTS (SELECT 1 FROM crm_adapter_backfill_runs
        WHERE id=? AND lease_id=? AND lease_expires_at>=?)`).bind(
      `${run.id}:${subjectType}:${ordinal}`, run.id, subjectType, ordinal, afterCursorId, lastCursorId, rowsSeen,
      eligibleCount, newEventCount, replayedEventCount, rejectedCount, dispositionHash, now,
      run.id, leaseId, now,
    ),
    db.prepare(`UPDATE crm_adapter_backfill_runs SET ${cursorColumn}=?,${completeColumn}=?,updated_at=?
      WHERE id=? AND lease_id=? AND lease_expires_at>=?`).bind(lastCursorId, complete ? 1 : 0, now, run.id, leaseId, now),
  ]);
  if (Number(results[0]?.meta.changes ?? 0) !== 1 || Number(results[1]?.meta.changes ?? 0) !== 1) {
    throw new Error('pcd_crm_backfill_lease_lost');
  }
}

async function markBackfillSubjectComplete(
  db: D1Database,
  runId: string,
  subjectType: 'organization' | 'contact',
  leaseId: string,
  now: number,
): Promise<void> {
  const completeColumn = subjectType === 'organization' ? 'organization_complete' : 'contact_complete';
  const result = await db.prepare(`UPDATE crm_adapter_backfill_runs SET ${completeColumn}=1,updated_at=?
    WHERE id=? AND lease_id=? AND lease_expires_at>=?`).bind(now, runId, leaseId, now).run();
  if (Number(result.meta.changes ?? 0) !== 1) throw new Error('pcd_crm_backfill_lease_lost');
}

export async function projectPcdCrmBackfill(
  env: PcdCrmAdapterEnv,
  options: { limit?: number; now?: number } = {},
): Promise<BackfillResult> {
  if (env.PCD_CRM_ADAPTER_ENABLED !== 'true' || env.PCD_CRM_BACKFILL_ENABLED !== 'true') return disabledBackfill();
  const config = requireConfig(env);
  if (!config || !env.DB || !env.PCD_OPS_DB) throw new Error('pcd_crm_adapter_configuration_missing');
  const now = options.now ?? Date.now();
  const limit = Math.max(1, Math.min(50, Math.trunc(options.limit ?? 25)));
  const run = await ensureBackfillRun(env, config, now);
  if (run.status !== 'running') {
    return { ...disabledBackfill(), enabled: true, scanCompleted: true, completed: run.status === 'completed' };
  }

  const leaseId = crypto.randomUUID();
  const lease = await env.PCD_OPS_DB.prepare(`UPDATE crm_adapter_backfill_runs SET lease_id=?,lease_expires_at=?,updated_at=?
    WHERE id=? AND status='running' AND (lease_expires_at IS NULL OR lease_expires_at<?)`)
    .bind(leaseId, now + 60_000, now, run.id, now).run();
  if (Number(lease.meta.changes ?? 0) !== 1) {
    return { ...disabledBackfill(), enabled: true, busy: true };
  }

  let organizations = 0;
  let contacts = 0;
  let replayed = 0;
  let rejected = 0;
  let organizationComplete = run.organization_complete === 1;
  const snapshotBeforeSecond = config.sourceNotBeforeMs / 1000;
  try {
    if (!run.organization_complete) {
      const rows = await env.DB.prepare(`SELECT id,name,organization_type,website_url,city,state,zip,categories,
        record_status,is_claimed,content_hash,deleted_at,updated_at FROM organizations
        WHERE id>? AND unixepoch(created_at)<? ORDER BY id LIMIT ?`)
        .bind(run.organization_cursor_id, snapshotBeforeSecond, limit).all<OrganizationRow>();
      if (!rows.results.length) {
        await markBackfillSubjectComplete(env.PCD_OPS_DB, run.id, 'organization', leaseId, now);
        organizationComplete = true;
      } else {
        const drafts = await Promise.all(rows.results.map((row) => organizationDraft(row, config.targetWorkspaceId)));
        const outbox = await enqueueDrafts(env.PCD_OPS_DB, config.producerWorkspaceId, drafts, now, undefined, [], run.id);
        const dispositions = drafts.map((draft) => ({ id: draft.subjectId, disposition: draft.eventType.endsWith('deleted.v1') ? 'tombstoned' : 'projected', contentHash: draft.contentHash }));
        const last = rows.results.at(-1)!;
        await recordBackfillChunk(
          env.PCD_OPS_DB, run, 'organization', run.organization_cursor_id, last.id, rows.results.length,
          drafts.length, outbox.projected, outbox.replayed, 0, await sha256(stableJson(dispositions)),
          rows.results.length < limit, leaseId, now,
        );
        organizations = drafts.length;
        replayed += outbox.replayed;
        organizationComplete = rows.results.length < limit;
      }
    }

    if (organizationComplete && !run.contact_complete) {
      const rows = await env.PCD_OPS_DB.prepare(`SELECT id,organization_id,full_name,title,role,email,phone,do_not_contact,
        source_url,confidence,verified_at,content_hash,deleted_at,updated_at FROM org_contacts
        WHERE id>? AND unixepoch(created_at)<? ORDER BY id LIMIT ?`)
        .bind(run.contact_cursor_id, snapshotBeforeSecond, limit).all<PcdContactProjectionInput>();
      if (!rows.results.length) {
        await markBackfillSubjectComplete(env.PCD_OPS_DB, run.id, 'contact', leaseId, now);
      } else {
        const classified = await Promise.all(rows.results.map(async (row) => {
          const draft = await contactDraft(row, config.targetWorkspaceId, config.sourceId);
          const disposition = draft
            ? draft.eventType === 'contact.deleted.v1' ? 'tombstoned' : 'projected'
            : row.email || row.phone ? 'rejected_missing_source' : 'rejected_missing_channel';
          return { row, draft, disposition };
        }));
        const drafts = classified.flatMap((item) => item.draft ? [item.draft] : []);
        const outbox = await enqueueDrafts(env.PCD_OPS_DB, config.producerWorkspaceId, drafts, now, undefined, [], run.id);
        const dispositions = await Promise.all(classified.map(async ({ row, draft, disposition }) => ({
          id: row.id,
          disposition,
          contentHash: draft?.contentHash ?? row.content_hash ?? await sha256(stableJson({ id: row.id, organizationId: row.organization_id, updatedAt: row.updated_at, disposition })),
        })));
        const last = rows.results.at(-1)!;
        const rejectedCount = classified.length - drafts.length;
        await recordBackfillChunk(
          env.PCD_OPS_DB, run, 'contact', run.contact_cursor_id, last.id, rows.results.length,
          drafts.length, outbox.projected, outbox.replayed, rejectedCount, await sha256(stableJson(dispositions)),
          rows.results.length < limit, leaseId, now,
        );
        contacts = drafts.length;
        replayed += outbox.replayed;
        rejected = rejectedCount;
      }
    }

    const completion = await env.PCD_OPS_DB.prepare(`SELECT organization_complete,contact_complete
      FROM crm_adapter_backfill_runs WHERE id=?`).bind(run.id)
      .first<{ organization_complete: number; contact_complete: number }>();
    const completed = completion?.organization_complete === 1 && completion.contact_complete === 1;
    const release = await env.PCD_OPS_DB.prepare(`UPDATE crm_adapter_backfill_runs SET status=?,lease_id=NULL,lease_expires_at=NULL,
      scanned_at=CASE WHEN ?=1 THEN COALESCE(scanned_at,?) ELSE scanned_at END,updated_at=? WHERE id=? AND lease_id=?`)
      .bind(completed ? 'scanned' : 'running', completed ? 1 : 0, now, now, run.id, leaseId).run();
    if (Number(release.meta.changes ?? 0) !== 1) throw new Error('pcd_crm_backfill_lease_lost');
    return { enabled: true, organizations, contacts, replayed, rejected, scanCompleted: completed, completed: false, busy: false };
  } catch (error) {
    await env.PCD_OPS_DB.prepare(`UPDATE crm_adapter_backfill_runs SET lease_id=NULL,lease_expires_at=NULL,updated_at=?
      WHERE id=? AND lease_id=?`).bind(now, run.id, leaseId).run();
    throw error;
  }
}

export async function finalizePcdCrmBackfill(
  env: PcdCrmAdapterEnv,
  options: { now?: number } = {},
): Promise<{ enabled: boolean; completed: boolean; pending: number; dead: number; reconciled: boolean }> {
  if (env.PCD_CRM_ADAPTER_ENABLED !== 'true' || env.PCD_CRM_BACKFILL_ENABLED !== 'true') {
    return { enabled: false, completed: false, pending: 0, dead: 0, reconciled: false };
  }
  const config = requireConfig(env);
  if (!config || !env.PCD_OPS_DB) throw new Error('pcd_crm_adapter_configuration_missing');
  const now = options.now ?? Date.now();
  const run = await ensureBackfillRun(env, config, now, true);
  if (run.status === 'completed') return { enabled: true, completed: true, pending: 0, dead: 0, reconciled: true };
  if (run.status !== 'scanned') return { enabled: true, completed: false, pending: 0, dead: 0, reconciled: false };

  const accounting = await env.PCD_OPS_DB.prepare(`SELECT
      COALESCE((SELECT SUM(eligible_count) FROM crm_adapter_backfill_chunks WHERE run_id=?),0) eligible,
      COALESCE((SELECT SUM(rows_seen) FROM crm_adapter_backfill_chunks WHERE run_id=? AND subject_type='organization'),0) organization_seen,
      COALESCE((SELECT SUM(rows_seen) FROM crm_adapter_backfill_chunks WHERE run_id=? AND subject_type='contact'),0) contact_seen,
      COUNT(*) outbox_total,
      SUM(CASE WHEN status='delivered' AND receiver_receipt_id IS NOT NULL THEN 1 ELSE 0 END) delivered,
      SUM(CASE WHEN status='dead' THEN 1 ELSE 0 END) dead,
      SUM(CASE WHEN status!='delivered' THEN 1 ELSE 0 END) pending,
      COALESCE(MAX(source_sequence),0) high_water
    FROM crm_adapter_outbox WHERE backfill_run_id=?`).bind(run.id, run.id, run.id, run.id)
    .first<{ eligible: number; organization_seen: number; contact_seen: number; outbox_total: number; delivered: number; dead: number; pending: number; high_water: number }>();
  const eligible = Number(accounting?.eligible ?? 0);
  const organizationSeen = Number(accounting?.organization_seen ?? 0);
  const contactSeen = Number(accounting?.contact_seen ?? 0);
  const outboxTotal = Number(accounting?.outbox_total ?? 0);
  const delivered = Number(accounting?.delivered ?? 0);
  const dead = Number(accounting?.dead ?? 0);
  const pending = Number(accounting?.pending ?? 0);
  const highWater = Number(accounting?.high_water ?? 0);
  if (organizationSeen !== Number(run.expected_organization_rows) || contactSeen !== Number(run.expected_contact_rows)) {
    throw new Error('pcd_crm_backfill_source_accounting_mismatch');
  }
  if (eligible !== outboxTotal) throw new Error('pcd_crm_backfill_event_accounting_mismatch');
  if (dead > 0) throw new Error('pcd_crm_backfill_dead_letters_present');
  if (pending > 0 || delivered !== eligible) return { enabled: true, completed: false, pending, dead, reconciled: false };

  const reconciliations = await env.PCD_OPS_DB.prepare(`SELECT declared_high_water,receiver_high_water,missing_count,
    duplicate_count,stale_count,unauthorized_count,mismatch_count FROM crm_adapter_reconciliation_receipts
    WHERE producer_workspace_id=? AND checked_at>=COALESCE((SELECT scanned_at FROM crm_adapter_backfill_runs WHERE id=?),0)
    ORDER BY checked_at DESC LIMIT 2`).bind(config.producerWorkspaceId, run.id)
    .all<{ declared_high_water: number; receiver_high_water: number; missing_count: number; duplicate_count: number; stale_count: number; unauthorized_count: number; mismatch_count: number }>();
  const reconciled = reconciliations.results.length === 2
    && reconciliations.results.every((reconciliation) => (
      Number(reconciliation.declared_high_water) >= highWater
      && Number(reconciliation.receiver_high_water) >= highWater
      && Number(reconciliation.missing_count) === 0
      && Number(reconciliation.duplicate_count) === 0
      && Number(reconciliation.stale_count) === 0
      && Number(reconciliation.unauthorized_count) === 0
      && Number(reconciliation.mismatch_count) === 0
    ))
    && Number(reconciliations.results[0]!.declared_high_water) === Number(reconciliations.results[1]!.declared_high_water)
    && Number(reconciliations.results[0]!.receiver_high_water) === Number(reconciliations.results[1]!.receiver_high_water);
  if (!reconciled) return { enabled: true, completed: false, pending: 0, dead: 0, reconciled: false };

  const update = await env.PCD_OPS_DB.prepare(`UPDATE crm_adapter_backfill_runs SET status='completed',completed_at=?,updated_at=?
    WHERE id=? AND status='scanned'`).bind(now, now, run.id).run();
  if (Number(update.meta.changes ?? 0) !== 1) throw new Error('pcd_crm_backfill_finalize_conflict');
  return { enabled: true, completed: true, pending: 0, dead: 0, reconciled: true };
}

async function readBoundedJson(response: Response): Promise<Record<string, unknown> | null> {
  if (!response.body) return null;
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const next = await reader.read();
      if (next.done) break;
      total += next.value.byteLength;
      if (total > MAX_RESPONSE_BYTES) {
        await reader.cancel();
        return null;
      }
      chunks.push(next.value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  try {
    const parsed = JSON.parse(new TextDecoder().decode(bytes)) as unknown;
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed as Record<string, unknown> : null;
  } catch {
    return null;
  }
}

async function signedFetch(
  fetcher: CrmAdapterFetcher,
  secret: string,
  producerWorkspaceId: string,
  scope: string,
  idempotencyKey: string,
  path: string,
  body: string,
): Promise<Response> {
  const timestampHeader = String(Date.now());
  const signature = await hmacHex(
    secret,
    `v2.${timestampHeader}.${PRODUCER}.${producerWorkspaceId}.${scope}.${idempotencyKey}.${body}`,
  );
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5_000);
  try {
    return await fetcher.fetch(`https://crm.internal/api/internal/adapters/${path}`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-ff-producer': PRODUCER,
        'x-ff-producer-workspace': producerWorkspaceId,
        'x-ff-service-scope': scope,
        'x-ff-timestamp': timestampHeader,
        'x-ff-idempotency-key': idempotencyKey,
        'x-ff-signature': signature,
      },
      body,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

export async function dispatchPcdCrmOutbox(
  env: PcdCrmAdapterEnv,
  options: { limit?: number; now?: number; fetcher?: CrmAdapterFetcher } = {},
): Promise<{ enabled: boolean; claimed: number; delivered: number; retried: number; dead: number }> {
  if (env.PCD_CRM_ADAPTER_ENABLED !== 'true') return { enabled: false, claimed: 0, delivered: 0, retried: 0, dead: 0 };
  const config = requireConfig(env);
  const secret = env.PCD_CRM_ADAPTER_HMAC_SECRET?.trim() ?? '';
  const fetcher = options.fetcher ?? env.CRM_ADAPTER;
  if (!config || !secret || !env.PCD_OPS_DB) throw new Error('pcd_crm_adapter_configuration_missing');
  const now = options.now ?? Date.now();
  const limit = Math.max(1, Math.min(10, Math.trunc(options.limit ?? 10)));
  const leaseId = `pcd-crm-lease:${crypto.randomUUID()}`;
  const claimed = await env.PCD_OPS_DB.prepare(`UPDATE crm_adapter_outbox SET status='leased',lease_id=?,lease_expires_at=?,updated_at=?
    WHERE id IN (
      SELECT id FROM crm_adapter_outbox
      WHERE ((status IN ('pending','retry') AND next_attempt_at<=?) OR (status='leased' AND lease_expires_at<=?))
        AND attempt_count<?
      ORDER BY source_sequence LIMIT ?
    ) RETURNING id,event_id,source_sequence,event_type,payload_json,payload_hash,idempotency_key,attempt_count`)
    .bind(leaseId, now + 60_000, now, now, now, MAX_ATTEMPTS, limit).all<OutboxRow>();
  if (!claimed.results.length) return { enabled: true, claimed: 0, delivered: 0, retried: 0, dead: 0 };

  const outcomes = await Promise.all(claimed.results.map(async (row) => {
    if (!fetcher) return { row, kind: 'retry' as const, status: 0, code: 'receiver_unavailable', receiptId: null as string | null };
    try {
      const response = await signedFetch(fetcher, secret, config.producerWorkspaceId, EVENT_SCOPE, row.idempotency_key, 'events', row.payload_json);
      const responseBody = await readBoundedJson(response);
      const receiptId = typeof responseBody?.receiptId === 'string' ? responseBody.receiptId.slice(0, 180) : null;
      const accepted = responseBody?.accepted === true && responseBody?.eventId === row.event_id && receiptId;
      if ((response.status === 200 || response.status === 202) && accepted) {
        return { row, kind: 'delivered' as const, status: response.status, code: null, receiptId };
      }
      if (response.status >= 400 && response.status < 500) {
        return { row, kind: 'dead' as const, status: response.status, code: `receiver_${response.status}`, receiptId: null };
      }
      return { row, kind: 'retry' as const, status: response.status, code: response.status ? `receiver_${response.status}` : 'receiver_invalid_response', receiptId: null };
    } catch (error) {
      return {
        row,
        kind: 'retry' as const,
        status: 0,
        code: error instanceof DOMException && error.name === 'AbortError' ? 'receiver_timeout' : 'receiver_unavailable',
        receiptId: null,
      };
    }
  }));

  const updates: D1PreparedStatement[] = [];
  let delivered = 0;
  let retried = 0;
  let dead = 0;
  for (const outcome of outcomes) {
    const attempts = outcome.row.attempt_count + 1;
    if (outcome.kind === 'delivered') {
      delivered += 1;
      updates.push(env.PCD_OPS_DB.prepare(`UPDATE crm_adapter_outbox SET status='delivered',attempt_count=?,
        receiver_receipt_id=?,receiver_status=?,last_error_code=NULL,delivered_at=?,lease_id=NULL,lease_expires_at=NULL,updated_at=?
        WHERE id=? AND lease_id=?`).bind(attempts, outcome.receiptId, outcome.status, now, now, outcome.row.id, leaseId));
    } else if (outcome.kind === 'dead' || attempts >= MAX_ATTEMPTS) {
      dead += 1;
      updates.push(env.PCD_OPS_DB.prepare(`UPDATE crm_adapter_outbox SET status='dead',attempt_count=?,
        receiver_status=?,last_error_code=?,lease_id=NULL,lease_expires_at=NULL,updated_at=?
        WHERE id=? AND lease_id=?`).bind(attempts, outcome.status || null, outcome.code, now, outcome.row.id, leaseId));
    } else {
      retried += 1;
      const nextAttemptAt = now + Math.min(3_600_000, 30_000 * (2 ** Math.max(0, attempts - 1)));
      updates.push(env.PCD_OPS_DB.prepare(`UPDATE crm_adapter_outbox SET status='retry',attempt_count=?,
        next_attempt_at=?,receiver_status=?,last_error_code=?,lease_id=NULL,lease_expires_at=NULL,updated_at=?
        WHERE id=? AND lease_id=?`).bind(attempts, nextAttemptAt, outcome.status || null, outcome.code, now, outcome.row.id, leaseId));
    }
  }
  await env.PCD_OPS_DB.batch(updates);
  return { enabled: true, claimed: claimed.results.length, delivered, retried, dead };
}

export async function reconcilePcdCrmOutbox(
  env: PcdCrmAdapterEnv,
  options: { now?: number; fetcher?: CrmAdapterFetcher } = {},
): Promise<{ enabled: boolean; checked: boolean; missing: number; mismatch: number }> {
  if (env.PCD_CRM_ADAPTER_ENABLED !== 'true') return { enabled: false, checked: false, missing: 0, mismatch: 0 };
  const config = requireConfig(env);
  const secret = env.PCD_CRM_ADAPTER_HMAC_SECRET?.trim() ?? '';
  const fetcher = options.fetcher ?? env.CRM_ADAPTER;
  if (!config || !secret || !fetcher || !env.PCD_OPS_DB) return { enabled: true, checked: false, missing: 0, mismatch: 0 };
  const rows = await env.PCD_OPS_DB.prepare(`SELECT event_id,source_sequence,event_type,payload_hash
    FROM crm_adapter_outbox ORDER BY source_sequence DESC LIMIT 100`)
    .all<{ event_id: string; source_sequence: number; event_type: string; payload_hash: string }>();
  const highWater = rows.results.reduce((highest, row) => Math.max(highest, Number(row.source_sequence)), 0);
  const manifest = {
    contractVersion: CONTRACT_VERSION,
    producerWorkspaceId: config.producerWorkspaceId,
    declaredHighWater: highWater,
    events: rows.results.map((row) => ({
      eventId: row.event_id,
      sequence: Number(row.source_sequence),
      eventType: row.event_type,
      payloadHash: row.payload_hash,
    })),
  };
  const body = JSON.stringify(manifest);
  const response = await signedFetch(
    fetcher,
    secret,
    config.producerWorkspaceId,
    RECONCILE_SCOPE,
    `pcd-reconcile-${highWater}`,
    'reconcile',
    body,
  );
  const result = await readBoundedJson(response);
  if (response.status !== 200 || !result) return { enabled: true, checked: false, missing: 0, mismatch: 0 };
  const count = (key: string) => Array.isArray(result[key]) ? Math.min(100, (result[key] as unknown[]).length) : 0;
  const checkedAt = options.now ?? Date.now();
  const id = `pcd-crm-recon:${crypto.randomUUID()}`;
  const receiverHighWater = typeof result.receiverHighWater === 'number' ? Math.max(0, Math.trunc(result.receiverHighWater)) : 0;
  await env.PCD_OPS_DB.prepare(`INSERT INTO crm_adapter_reconciliation_receipts
    (id,producer_workspace_id,declared_high_water,receiver_high_water,manifest_count,missing_count,duplicate_count,stale_count,unauthorized_count,mismatch_count,result_hash,checked_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`).bind(
    id, config.producerWorkspaceId, highWater, receiverHighWater, rows.results.length,
    count('missing'), count('duplicate'), count('stale'), count('unauthorized'), count('mismatch'),
    await sha256(stableJson(result)), checkedAt,
  ).run();
  return { enabled: true, checked: true, missing: count('missing'), mismatch: count('mismatch') };
}

export async function runPcdCrmAdapter(
  env: PcdCrmAdapterEnv,
  options: { backfillOnly?: boolean } = {},
): Promise<void> {
  if (env.PCD_CRM_ADAPTER_ENABLED !== 'true') return;
  const backfill = await projectPcdCrmBackfill(env);
  const projection = options.backfillOnly
    ? { organizations: 0, contacts: 0, deferred: 0 }
    : await projectPcdCrmEvents(env);
  const delivery = await dispatchPcdCrmOutbox(env);
  const reconciliation = options.backfillOnly
    ? { checked: false, missing: 0, mismatch: 0 }
    : await reconcilePcdCrmOutbox(env);
  const backfillFinal = options.backfillOnly
    ? { completed: false }
    : await finalizePcdCrmBackfill(env);
  console.log(JSON.stringify({
    event: 'pcd_crm_adapter_tick',
    projectedOrganizations: projection.organizations,
    projectedContacts: projection.contacts,
    deferredContacts: projection.deferred,
    backfillOrganizations: backfill.organizations,
    backfillContacts: backfill.contacts,
    backfillRejected: backfill.rejected,
    backfillScanCompleted: backfill.scanCompleted,
    backfillCompleted: backfillFinal.completed,
    backfillBusy: backfill.busy,
    backfillOnly: options.backfillOnly === true,
    delivered: delivery.delivered,
    retried: delivery.retried,
    dead: delivery.dead,
    reconciled: reconciliation.checked,
    missing: reconciliation.missing,
    mismatch: reconciliation.mismatch,
  }));
}
