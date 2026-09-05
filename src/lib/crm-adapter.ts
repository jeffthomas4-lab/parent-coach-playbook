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
  crm_projection_revision?: number;
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
  contact_context: 'professional' | 'family' | 'guardian' | 'minor' | 'roster' | 'unknown';
  source_url: string | null;
  confidence: string;
  verified_at: string | null;
  content_hash: string | null;
  deleted_at: string | null;
  updated_at: string;
  crm_projection_revision?: number;
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
  targetWorkspaceId: string;
  authorityUpdatedAt: number;
  contentHash: string;
  occurredAt: number;
  payload: Record<string, unknown>;
}

interface ReconciliationEvent {
  eventId: string;
  sequence: number;
  eventType: string;
  payloadHash: string;
}

const RECONCILIATION_RESULT_ARRAYS = ['missing', 'duplicate', 'stale', 'unauthorized', 'mismatch'] as const;

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

interface OutboxHeadRow extends OutboxRow {
  status: 'pending' | 'retry' | 'leased' | 'dead';
  next_attempt_at: number;
  lease_expires_at: number | null;
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
  reconciliation_pass: number;
  reconciliation_cursor_sequence: number;
  reconciliation_window_ordinal: number;
  reconciliation_complete: number;
  reconciliation_failure_count: number;
  reconciliation_next_attempt_at: number;
  reconciliation_halted: number;
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

interface BackfillReconciliationResult {
  enabled: boolean;
  checked: boolean;
  pass: number;
  window: number;
  passCompleted: boolean;
  completed: boolean;
  pending: number;
  missing: number;
  mismatch: number;
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

async function importHmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
}

async function hmacHex(key: CryptoKey, value: string): Promise<string> {
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

async function stableEventId(
  prefix: string,
  namespace: string,
  subjectId: string,
  contentHash: string,
  authorityUpdatedAt: number,
): Promise<string> {
  const raw = `pcd:${namespace}:${prefix}:${subjectId}:${authorityUpdatedAt}:${contentHash}`;
  return raw.length <= 180 ? raw : `pcd:${prefix}:${await sha256(raw)}`;
}

async function eventNamespace(producerWorkspaceId: string, targetWorkspaceId: string): Promise<string> {
  return (await sha256(`${producerWorkspaceId}:${targetWorkspaceId}`)).slice(0, 16);
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

async function organizationDraft(
  row: OrganizationRow,
  namespace: string,
  targetWorkspaceId: string,
): Promise<EventDraft> {
  const authorityUpdatedAt = timestamp(row.updated_at);
  const contentHash = await sha256(stableJson({
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
    eventId: await stableEventId(
      deleted ? 'organization-deleted' : 'organization-upserted', namespace, row.id, contentHash, authorityUpdatedAt,
    ),
    eventType: deleted ? 'organization.deleted.v1' : 'organization.upserted.v1',
    subjectType: 'organization',
    subjectId: row.id,
    targetWorkspaceId,
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
  namespace: string,
  targetWorkspaceId: string,
  sourceId: string,
  previouslyObserved = false,
): Promise<EventDraft | null> {
  const authorityUpdatedAt = timestamp(row.updated_at);
  // Legacy stored hashes predate the suppression and context fields. Derive
  // the projection hash from every field that affects CRM safety.
  const contentHash = await sha256(stableJson({
    id: row.id,
    organizationId: row.organization_id,
    fullName: row.full_name,
    title: row.title,
    role: row.role,
    email: row.email,
    phone: row.phone,
    doNotContact: Number(row.do_not_contact) === 1,
    contactContext: row.contact_context,
    sourceUrl: row.source_url,
    confidence: row.confidence,
    verifiedAt: row.verified_at,
    deletedAt: row.deleted_at,
  }));
  const restricted = Number(row.do_not_contact) === 1 || row.contact_context !== 'professional';
  if (row.deleted_at || (restricted && previouslyObserved)) {
    return {
      eventId: await stableEventId('contact-deleted', namespace, row.id, contentHash, authorityUpdatedAt),
      eventType: 'contact.deleted.v1',
      subjectType: 'contact',
      subjectId: row.id,
      targetWorkspaceId,
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
  if (restricted) return null;
  const type = row.email ? 'email' : row.phone ? 'phone' : null;
  const value = row.email ?? row.phone;
  if (!type || !value || !row.source_url) return null;
  return {
    eventId: await stableEventId('contact-observed', namespace, row.id, contentHash, authorityUpdatedAt),
    eventType: 'contact.observed.v1',
    subjectType: 'contact',
    subjectId: row.id,
    targetWorkspaceId,
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

async function previouslyObservedContactIds(
  db: D1Database,
  producerWorkspaceId: string,
  targetWorkspaceId: string,
  rows: PcdContactProjectionInput[],
): Promise<Set<string>> {
  const ids = [...new Set(rows
    .filter((row) => !row.deleted_at && (Number(row.do_not_contact) === 1 || row.contact_context !== 'professional'))
    .map((row) => row.id))];
  if (!ids.length) return new Set();
  const placeholders = ids.map(() => '?').join(',');
  const observed = await db.prepare(`SELECT DISTINCT subject_id FROM crm_adapter_outbox
    WHERE subject_type='contact' AND event_type='contact.observed.v1'
      AND producer_workspace_id=? AND target_workspace_id=? AND subject_id IN (${placeholders})`)
    .bind(producerWorkspaceId, targetWorkspaceId, ...ids).all<{ subject_id: string }>();
  return new Set(observed.results.map((row) => row.subject_id));
}

async function previouslyObservedContactTargets(
  db: D1Database,
  producerWorkspaceId: string,
  subjectId: string,
): Promise<string[]> {
  const targets = await db.prepare(`SELECT target_workspace_id FROM crm_adapter_outbox
    INDEXED BY idx_crm_adapter_outbox_contact_targets
    WHERE producer_workspace_id=? AND subject_type='contact' AND event_type='contact.observed.v1'
      AND subject_id=? AND target_workspace_id IS NOT NULL
    GROUP BY target_workspace_id ORDER BY target_workspace_id LIMIT 9`)
    .bind(producerWorkspaceId, subjectId).all<{ target_workspace_id: string }>();
  if (targets.results.length > 8) throw new Error('pcd_crm_contact_target_history_limit');
  return targets.results.map((row) => row.target_workspace_id);
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
  cursor?: { kind: 'organization' | 'contact'; revision: number },
  canonicalStatements: D1PreparedStatement[] = [],
  backfillRunId?: string,
): Promise<{ projected: number; replayed: number; highWater: number }> {
  await ensureControl(db, producerWorkspaceId, now);
  const existingIds = new Set<string>();
  if (drafts.length) {
    const placeholders = drafts.map(() => '?').join(',');
    const existing = await db.prepare(`SELECT event_id FROM crm_adapter_outbox
      WHERE producer_workspace_id=? AND event_id IN (${placeholders})`)
      .bind(producerWorkspaceId, ...drafts.map((draft) => draft.eventId)).all<{ event_id: string }>();
    for (const row of existing.results) existingIds.add(row.event_id);
  }
  const pending = drafts.filter((draft) => !existingIds.has(draft.eventId));
  const control = await db.prepare(`SELECT next_sequence FROM crm_adapter_controls WHERE producer_workspace_id=?`)
    .bind(producerWorkspaceId).first<{ next_sequence: number }>();
  if (!control) throw new Error('crm_adapter_control_missing');
  const start = Number(control.next_sequence);
  const statements: D1PreparedStatement[] = [];
  for (const draft of drafts.filter((item) => item.eventType === 'contact.deleted.v1')) {
    statements.push(
      db.prepare(`DELETE FROM crm_adapter_projection_receipts
        WHERE subject_type='contact' AND subject_id=? AND last_event_id IN (
          SELECT event_id FROM crm_adapter_outbox
          WHERE producer_workspace_id=? AND subject_type='contact' AND subject_id=?
            AND event_type='contact.observed.v1' AND status IN ('pending','retry')
        )`).bind(draft.subjectId, producerWorkspaceId, draft.subjectId),
      db.prepare(`DELETE FROM crm_adapter_outbox
        WHERE producer_workspace_id=? AND subject_type='contact' AND subject_id=?
          AND event_type='contact.observed.v1' AND status IN ('pending','retry')`)
        .bind(producerWorkspaceId, draft.subjectId),
    );
  }
  statements.push(...canonicalStatements);
  if (backfillRunId) {
    for (const draft of drafts) {
      statements.push(db.prepare(`INSERT OR IGNORE INTO crm_adapter_backfill_subjects
        (run_id,subject_type,subject_id) VALUES (?,?,?)`).bind(backfillRunId, draft.subjectType, draft.subjectId));
    }
    if (pending.length) {
      statements.push(
        db.prepare(`DELETE FROM crm_adapter_backfill_reconciliation_windows WHERE run_id=?`).bind(backfillRunId),
        db.prepare(`UPDATE crm_adapter_backfill_runs SET reconciliation_pass=1,reconciliation_cursor_sequence=0,
          reconciliation_window_ordinal=0,reconciliation_complete=0,reconciliation_failure_count=0,
          reconciliation_next_attempt_at=0,reconciliation_halted=0,lease_id=NULL,lease_expires_at=NULL,updated_at=?
          WHERE id=? AND status='scanned'`).bind(now, backfillRunId),
      );
    }
  }
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
    const draftBackfillRunId = backfillRunId;
    const backfillColumn = draftBackfillRunId ? ',backfill_run_id' : '';
    const backfillPlaceholder = draftBackfillRunId ? ',?' : '';
    statements.push(
      db.prepare(`INSERT INTO crm_adapter_outbox
        (id,producer_workspace_id,event_id,source_sequence,event_type,subject_type,subject_id,authority_updated_at,payload_json,payload_hash,idempotency_key,status,attempt_count,next_attempt_at,created_at,updated_at,target_workspace_id${backfillColumn})
        VALUES (?,?,?,?,?,?,?,?,?,?,?,'pending',0,?,?,?,?${backfillPlaceholder})`).bind(
        `pcd-outbox:${draft.eventId}`, producerWorkspaceId, draft.eventId, sequence, draft.eventType,
        draft.subjectType, draft.subjectId, draft.authorityUpdatedAt, payloadJson, payloadHash, draft.eventId,
        now, now, now, draft.targetWorkspaceId, ...(draftBackfillRunId ? [draftBackfillRunId] : []),
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
      WHERE producer_workspace_id=? AND backfill_run_id IS NULL AND event_id IN (${placeholders})`)
      .bind(backfillRunId, producerWorkspaceId, ...existingIds));
  }
  if (cursor) {
    const column = cursor.kind === 'organization'
      ? 'organization_revision_cursor=?'
      : 'contact_revision_cursor=?';
    statements.push(db.prepare(`UPDATE crm_adapter_controls SET ${column},updated_at=? WHERE producer_workspace_id=?`)
      .bind(cursor.revision, now, producerWorkspaceId));
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
  const restricted = !!row.deleted_at || Number(row.do_not_contact) === 1 || row.contact_context !== 'professional';
  const priorTargets = restricted
    ? await previouslyObservedContactTargets(env.PCD_OPS_DB, config.producerWorkspaceId, row.id)
    : [];
  const targetWorkspaceIds = priorTargets.length ? priorTargets : [config.targetWorkspaceId];
  const drafts = Number.isFinite(rowUpdatedAt) && rowUpdatedAt >= config.sourceNotBeforeMs
    ? (await Promise.all(targetWorkspaceIds.map(async (targetWorkspaceId) => contactDraft(
        row,
        await eventNamespace(config.producerWorkspaceId, targetWorkspaceId),
        targetWorkspaceId,
        config.sourceId,
        priorTargets.includes(targetWorkspaceId),
      )))).filter((draft): draft is EventDraft => draft !== null)
    : [];
  const activeBackfill = await env.PCD_OPS_DB.prepare(`SELECT subject.run_id FROM crm_adapter_backfill_subjects subject
    JOIN crm_adapter_backfill_runs run ON run.id=subject.run_id AND run.status!='completed'
    WHERE subject.subject_type='contact' AND subject.subject_id=? LIMIT 1`)
    .bind(row.id).first<{ run_id: string }>();
  await enqueueDrafts(
    env.PCD_OPS_DB,
    config.producerWorkspaceId,
    drafts,
    now,
    undefined,
    [canonicalStatement],
    activeBackfill?.run_id,
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
  const control = await env.PCD_OPS_DB.prepare(`SELECT organization_revision_cursor,contact_revision_cursor
    FROM crm_adapter_controls WHERE producer_workspace_id=?`).bind(config.producerWorkspaceId)
    .first<{ organization_revision_cursor: number; contact_revision_cursor: number }>();
  if (!control) throw new Error('pcd_crm_adapter_control_missing');
  const namespace = await eventNamespace(config.producerWorkspaceId, config.targetWorkspaceId);

  const organizationPage = (await env.DB.prepare(`SELECT id,name,organization_type,website_url,city,state,zip,categories,
    record_status,is_claimed,content_hash,deleted_at,updated_at,crm_projection_revision
    FROM organizations INDEXED BY idx_organizations_crm_projection_revision
    WHERE crm_projection_revision>0 AND crm_projection_revision>?
    ORDER BY crm_projection_revision LIMIT ?`)
    .bind(control.organization_revision_cursor, limit)
    .all<OrganizationRow>()).results;
  const organizationRows = organizationPage.filter((row) => Date.parse(row.updated_at) >= config.sourceNotBeforeMs);
  const organizationDrafts = await Promise.all(organizationRows.map((row) => (
    organizationDraft(row, namespace, config.targetWorkspaceId)
  )));
  const lastOrganization = organizationPage.at(-1);
  const orgResult = await enqueueDrafts(
    env.PCD_OPS_DB,
    config.producerWorkspaceId,
    organizationDrafts,
    now,
    lastOrganization ? { kind: 'organization', revision: Number(lastOrganization.crm_projection_revision) } : undefined,
  );

  let contactPage: PcdContactProjectionInput[] = [];
  let canProjectContacts = true;
  if (env.PCD_CRM_BACKFILL_ENABLED === 'true') {
    const historicalOrganizations = await env.PCD_OPS_DB.prepare(`SELECT organization_complete
      FROM crm_adapter_backfill_runs WHERE producer_workspace_id=? AND target_workspace_id=?`)
      .bind(config.producerWorkspaceId, config.targetWorkspaceId).first<{ organization_complete: number }>();
    canProjectContacts = historicalOrganizations?.organization_complete === 1;
  }
  if (canProjectContacts) {
    contactPage = (await env.PCD_OPS_DB.prepare(`SELECT id,organization_id,full_name,title,role,email,phone,do_not_contact,contact_context,
      source_url,confidence,verified_at,content_hash,deleted_at,updated_at,crm_projection_revision
      FROM org_contacts INDEXED BY idx_org_contacts_crm_projection_revision
      WHERE crm_projection_revision>0 AND crm_projection_revision>?
      ORDER BY crm_projection_revision LIMIT ?`)
      .bind(control.contact_revision_cursor, limit).all<PcdContactProjectionInput>()).results;
  }
  const eligibleContactRows = contactPage.filter((row) => Date.parse(row.updated_at) >= config.sourceNotBeforeMs);
  const organizationIds = [...new Set(eligibleContactRows.map((row) => row.organization_id))];
  const readyOrganizationIds = new Set<string>();
  if (organizationIds.length) {
    const placeholders = organizationIds.map(() => '?').join(',');
    const receipts = await env.PCD_OPS_DB.prepare(`SELECT subject_id FROM crm_adapter_projection_receipts
      WHERE subject_type='organization' AND subject_id IN (${placeholders})`).bind(...organizationIds)
      .all<{ subject_id: string }>();
    for (const receipt of receipts.results) readyOrganizationIds.add(receipt.subject_id);
  }
  const blockedAt = contactPage.findIndex((row) => (
    Date.parse(row.updated_at) >= config.sourceNotBeforeMs && !readyOrganizationIds.has(row.organization_id)
  ));
  const examinedContactRows = blockedAt < 0 ? contactPage : contactPage.slice(0, blockedAt);
  const contactRows = examinedContactRows.filter((row) => Date.parse(row.updated_at) >= config.sourceNotBeforeMs);
  const previouslyObserved = await previouslyObservedContactIds(
    env.PCD_OPS_DB,
    config.producerWorkspaceId,
    config.targetWorkspaceId,
    contactRows,
  );
  const contactCandidates = await Promise.all(
    contactRows.map((row) => contactDraft(
      row, namespace, config.targetWorkspaceId, config.sourceId,
      previouslyObserved.has(row.id),
    )),
  );
  const contactDrafts = contactCandidates.filter((draft): draft is EventDraft => draft !== null);
  const lastContact = examinedContactRows.at(-1);
  const contactResult = await enqueueDrafts(
    env.PCD_OPS_DB,
    config.producerWorkspaceId,
    contactDrafts,
    now,
    lastContact ? { kind: 'contact', revision: Number(lastContact.crm_projection_revision) } : undefined,
  );
  return {
    enabled: true,
    organizations: orgResult.projected,
    contacts: contactResult.projected,
    replayed: orgResult.replayed + contactResult.replayed,
    deferred: contactCandidates.length - contactDrafts.length + contactPage.length - examinedContactRows.length,
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
    status,organization_cursor_id,contact_cursor_id,organization_complete,contact_complete,lease_id,lease_expires_at,
    reconciliation_pass,reconciliation_cursor_sequence,reconciliation_window_ordinal,reconciliation_complete,
    reconciliation_failure_count,reconciliation_next_attempt_at,reconciliation_halted
    FROM crm_adapter_backfill_runs
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
      status,organization_cursor_id,contact_cursor_id,organization_complete,contact_complete,lease_id,lease_expires_at,
      reconciliation_pass,reconciliation_cursor_sequence,reconciliation_window_ordinal,reconciliation_complete,
      reconciliation_failure_count,reconciliation_next_attempt_at,reconciliation_halted
      FROM crm_adapter_backfill_runs
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
  const namespace = await eventNamespace(config.producerWorkspaceId, config.targetWorkspaceId);
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
        const drafts = await Promise.all(rows.results.map((row) => (
          organizationDraft(row, namespace, config.targetWorkspaceId)
        )));
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
      const rows = await env.PCD_OPS_DB.prepare(`SELECT id,organization_id,full_name,title,role,email,phone,do_not_contact,contact_context,
        source_url,confidence,verified_at,content_hash,deleted_at,updated_at FROM org_contacts
        WHERE id>? AND unixepoch(created_at)<? ORDER BY id LIMIT ?`)
        .bind(run.contact_cursor_id, snapshotBeforeSecond, limit).all<PcdContactProjectionInput>();
      if (!rows.results.length) {
        await markBackfillSubjectComplete(env.PCD_OPS_DB, run.id, 'contact', leaseId, now);
      } else {
        const previouslyObserved = await previouslyObservedContactIds(
          env.PCD_OPS_DB,
          config.producerWorkspaceId,
          config.targetWorkspaceId,
          rows.results,
        );
        const classified = await Promise.all(rows.results.map(async (row) => {
          const draft = await contactDraft(
            row, namespace, config.targetWorkspaceId, config.sourceId,
            previouslyObserved.has(row.id),
          );
          const disposition = draft
            ? draft.eventType === 'contact.deleted.v1' ? 'tombstoned' : 'projected'
            : Number(row.do_not_contact) === 1 ? 'rejected_suppressed'
              : row.contact_context === 'unknown' ? 'held_context_review'
              : row.contact_context !== 'professional' ? 'rejected_nonprofessional_context'
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
  let run = await ensureBackfillRun(env, config, now);
  if (run.status === 'completed') return { enabled: true, completed: true, pending: 0, dead: 0, reconciled: true };
  if (run.status !== 'scanned') return { enabled: true, completed: false, pending: 0, dead: 0, reconciled: false };
  if (run.reconciliation_complete !== 1) {
    const state = await env.PCD_OPS_DB.prepare(`SELECT
      EXISTS(SELECT 1 FROM crm_adapter_outbox WHERE backfill_run_id=? AND status='dead' LIMIT 1) dead,
      EXISTS(SELECT 1 FROM crm_adapter_outbox WHERE backfill_run_id=? AND status!='delivered' LIMIT 1) pending`)
      .bind(run.id, run.id).first<{ pending: number; dead: number }>();
    const dead = Number(state?.dead ?? 0);
    const pending = Number(state?.pending ?? 0);
    if (dead) throw new Error('pcd_crm_backfill_dead_letters_present');
    return { enabled: true, completed: false, pending, dead, reconciled: false };
  }
  run = await ensureBackfillRun(env, config, now, true);

  const accounting = await env.PCD_OPS_DB.prepare(`SELECT
      COALESCE((SELECT SUM(eligible_count) FROM crm_adapter_backfill_chunks WHERE run_id=?),0) eligible,
      COALESCE((SELECT SUM(rows_seen) FROM crm_adapter_backfill_chunks WHERE run_id=? AND subject_type='organization'),0) organization_seen,
      COALESCE((SELECT SUM(rows_seen) FROM crm_adapter_backfill_chunks WHERE run_id=? AND subject_type='contact'),0) contact_seen,
      COALESCE((SELECT COUNT(*) FROM crm_adapter_backfill_subjects WHERE run_id=?),0) subject_total,
      COUNT(*) outbox_total,
      SUM(CASE WHEN status='delivered' AND receiver_receipt_id IS NOT NULL THEN 1 ELSE 0 END) delivered,
      SUM(CASE WHEN status='dead' THEN 1 ELSE 0 END) dead,
      SUM(CASE WHEN status!='delivered' THEN 1 ELSE 0 END) pending,
      COALESCE(MIN(source_sequence),0) low_water,
      COALESCE(MAX(source_sequence),0) high_water
    FROM crm_adapter_outbox WHERE backfill_run_id=?`).bind(run.id, run.id, run.id, run.id, run.id)
    .first<{ eligible: number; organization_seen: number; contact_seen: number; subject_total: number; outbox_total: number; delivered: number; dead: number; pending: number; low_water: number; high_water: number }>();
  const eligible = Number(accounting?.eligible ?? 0);
  const organizationSeen = Number(accounting?.organization_seen ?? 0);
  const contactSeen = Number(accounting?.contact_seen ?? 0);
  const subjectTotal = Number(accounting?.subject_total ?? 0);
  const outboxTotal = Number(accounting?.outbox_total ?? 0);
  const delivered = Number(accounting?.delivered ?? 0);
  const dead = Number(accounting?.dead ?? 0);
  const pending = Number(accounting?.pending ?? 0);
  const lowWater = Number(accounting?.low_water ?? 0);
  const highWater = Number(accounting?.high_water ?? 0);
  if (organizationSeen !== Number(run.expected_organization_rows) || contactSeen !== Number(run.expected_contact_rows)) {
    throw new Error('pcd_crm_backfill_source_accounting_mismatch');
  }
  if (eligible !== subjectTotal) throw new Error('pcd_crm_backfill_event_accounting_mismatch');
  if (dead > 0) throw new Error('pcd_crm_backfill_dead_letters_present');
  if (pending > 0 || delivered !== outboxTotal) return { enabled: true, completed: false, pending, dead, reconciled: false };

  const coverage = await env.PCD_OPS_DB.prepare(`SELECT
      COALESCE(SUM(CASE WHEN pass_number=1 THEN manifest_count ELSE 0 END),0) pass_one_count,
      COALESCE(SUM(CASE WHEN pass_number=2 THEN manifest_count ELSE 0 END),0) pass_two_count,
      COALESCE(SUM(CASE WHEN pass_number=1 THEN 1 ELSE 0 END),0) pass_one_windows,
      COALESCE(SUM(CASE WHEN pass_number=2 THEN 1 ELSE 0 END),0) pass_two_windows,
      COALESCE(MIN(CASE WHEN pass_number=1 THEN first_sequence END),0) pass_one_low,
      COALESCE(MIN(CASE WHEN pass_number=2 THEN first_sequence END),0) pass_two_low,
      COALESCE(MAX(CASE WHEN pass_number=1 THEN last_sequence END),0) pass_one_high,
      COALESCE(MAX(CASE WHEN pass_number=2 THEN last_sequence END),0) pass_two_high,
      COALESCE(SUM(missing_count+duplicate_count+stale_count+unauthorized_count+mismatch_count),0) errors,
      COALESCE(SUM(CASE WHEN receiver_high_water<last_sequence THEN 1 ELSE 0 END),0) receiver_behind
    FROM crm_adapter_backfill_reconciliation_windows WHERE run_id=?`).bind(run.id)
    .first<Record<string, number>>();
  const pairMismatch = await env.PCD_OPS_DB.prepare(`SELECT COUNT(*) mismatch FROM (
      SELECT one.window_ordinal FROM crm_adapter_backfill_reconciliation_windows one
      LEFT JOIN crm_adapter_backfill_reconciliation_windows two
        ON two.run_id=one.run_id AND two.pass_number=2 AND two.window_ordinal=one.window_ordinal
      WHERE one.run_id=? AND one.pass_number=1 AND (
        two.window_ordinal IS NULL OR two.first_sequence!=one.first_sequence OR two.last_sequence!=one.last_sequence
        OR two.manifest_count!=one.manifest_count OR two.manifest_hash!=one.manifest_hash)
      UNION ALL
      SELECT two.window_ordinal FROM crm_adapter_backfill_reconciliation_windows two
      LEFT JOIN crm_adapter_backfill_reconciliation_windows one
        ON one.run_id=two.run_id AND one.pass_number=1 AND one.window_ordinal=two.window_ordinal
      WHERE two.run_id=? AND two.pass_number=2 AND one.window_ordinal IS NULL
    )`).bind(run.id, run.id).first<{ mismatch: number }>();
  const passOneCount = Number(coverage?.pass_one_count ?? 0);
  const passTwoCount = Number(coverage?.pass_two_count ?? 0);
  const passOneWindows = Number(coverage?.pass_one_windows ?? 0);
  const passTwoWindows = Number(coverage?.pass_two_windows ?? 0);
  const expectedWindows = Math.ceil(outboxTotal / 100);
  const reconciled = passOneCount === outboxTotal
    && passTwoCount === outboxTotal
    && passOneWindows === expectedWindows
    && passTwoWindows === expectedWindows
    && Number(coverage?.errors ?? 0) === 0
    && Number(coverage?.receiver_behind ?? 0) === 0
    && Number(pairMismatch?.mismatch ?? 0) === 0
    && (outboxTotal === 0 || (
      Number(coverage?.pass_one_low ?? 0) === lowWater
      && Number(coverage?.pass_two_low ?? 0) === lowWater
      && Number(coverage?.pass_one_high ?? 0) === highWater
      && Number(coverage?.pass_two_high ?? 0) === highWater
    ));
  if (!reconciled) return { enabled: true, completed: false, pending: 0, dead: 0, reconciled: false };

  const update = await env.PCD_OPS_DB.prepare(`UPDATE crm_adapter_backfill_runs SET status='completed',completed_at=?,updated_at=?
    WHERE id=? AND status='scanned'`).bind(now, now, run.id).run();
  if (Number(update.meta.changes ?? 0) !== 1) throw new Error('pcd_crm_backfill_finalize_conflict');
  return { enabled: true, completed: true, pending: 0, dead: 0, reconciled: true };
}

async function readBoundedJson(response: Response, signal?: AbortSignal): Promise<Record<string, unknown> | null> {
  if (!response.body) return null;
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  let rejectAborted: ((reason?: unknown) => void) | undefined;
  const aborted = new Promise<never>((_resolve, reject) => { rejectAborted = reject; });
  const onAbort = () => rejectAborted?.(new DOMException('Response body timed out', 'AbortError'));
  signal?.addEventListener('abort', onAbort, { once: true });
  try {
    if (signal?.aborted) onAbort();
    while (true) {
      const next = await Promise.race([reader.read(), aborted]);
      if (next.done) break;
      total += next.value.byteLength;
      if (total > MAX_RESPONSE_BYTES) {
        await reader.cancel();
        return null;
      }
      chunks.push(next.value);
    }
  } finally {
    signal?.removeEventListener('abort', onAbort);
    if (signal?.aborted) await reader.cancel().catch(() => undefined);
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

function isValidDeliveryAcknowledgement(result: Record<string, unknown> | null, row: OutboxRow): boolean {
  if (!result) return false;
  const keys = Object.keys(result).sort();
  const expectedKeys = ['accepted', 'eventId', 'receiptId', 'replay', 'sequence'];
  return keys.length === expectedKeys.length
    && keys.every((key, index) => key === expectedKeys[index])
    && result.accepted === true
    && result.eventId === row.event_id
    && result.sequence === Number(row.source_sequence)
    && typeof result.receiptId === 'string'
    && result.receiptId.length > 0
    && result.receiptId.length <= 180
    && typeof result.replay === 'boolean';
}

function isValidReconciliationResult(
  response: Response,
  result: Record<string, unknown> | null,
  producerWorkspaceId: string,
  declaredHighWater: number,
  events: ReconciliationEvent[],
): result is Record<string, unknown> {
  if (response.status !== 200 || !result) return false;
  const expectedById = new Map(events.map((event) => [event.eventId, event]));
  const isExactFinding = (item: unknown): boolean => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) return false;
    const eventId = (item as Record<string, unknown>).eventId;
    return typeof eventId === 'string'
      && expectedById.has(eventId)
      && stableJson(item) === stableJson(expectedById.get(eventId));
  };
  return result.producer === PRODUCER
    && result.producerWorkspaceId === producerWorkspaceId
    && result.declaredHighWater === declaredHighWater
    && typeof result.receiverHighWater === 'number'
    && Number.isSafeInteger(result.receiverHighWater)
    && result.receiverHighWater >= 0
    && result.receiverHighWater <= declaredHighWater
    && RECONCILIATION_RESULT_ARRAYS.every((key) => {
      if (!Array.isArray(result[key]) || (result[key] as unknown[]).length > 100) return false;
      const findings = result[key] as unknown[];
      return findings.every(isExactFinding)
        && new Set(findings.map((item) => (item as Record<string, unknown>).eventId)).size === findings.length;
    });
}

async function signedFetchJson(
  fetcher: CrmAdapterFetcher,
  key: CryptoKey,
  producerWorkspaceId: string,
  scope: string,
  idempotencyKey: string,
  path: string,
  body: string,
): Promise<{ response: Response; result: Record<string, unknown> | null }> {
  const timestampHeader = String(Date.now());
  const signature = await hmacHex(
    key,
    `v2.${timestampHeader}.${PRODUCER}.${producerWorkspaceId}.${scope}.${idempotencyKey}.${body}`,
  );
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5_000);
  try {
    const response = await fetcher.fetch(`https://crm.internal/api/internal/adapters/${path}`, {
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
    return { response, result: await readBoundedJson(response, controller.signal) };
  } finally {
    clearTimeout(timeout);
  }
}

function disabledBackfillReconciliation(): BackfillReconciliationResult {
  return {
    enabled: false,
    checked: false,
    pass: 0,
    window: 0,
    passCompleted: false,
    completed: false,
    pending: 0,
    missing: 0,
    mismatch: 0,
  };
}

function reconciliationRetryAt(now: number, failureCount: number): number {
  return now + Math.min(3_600_000, 30_000 * (2 ** Math.max(0, failureCount - 1)));
}

async function recordBackfillReconciliationFailure(
  db: D1Database,
  run: BackfillRunRow,
  leaseId: string,
  now: number,
): Promise<void> {
  const failureCount = Math.min(MAX_ATTEMPTS, Number(run.reconciliation_failure_count) + 1);
  const halted = failureCount >= MAX_ATTEMPTS ? 1 : 0;
  const result = await db.prepare(`UPDATE crm_adapter_backfill_runs
    SET reconciliation_failure_count=?,reconciliation_next_attempt_at=?,reconciliation_halted=?,
      lease_id=NULL,lease_expires_at=NULL,updated_at=? WHERE id=? AND lease_id=?`)
    .bind(failureCount, halted ? 0 : reconciliationRetryAt(now, failureCount), halted, now, run.id, leaseId).run();
  if (Number(result.meta.changes ?? 0) !== 1) throw new Error('pcd_crm_backfill_lease_lost');
}

export async function reconcilePcdCrmBackfill(
  env: PcdCrmAdapterEnv,
  options: { now?: number; fetcher?: CrmAdapterFetcher } = {},
): Promise<BackfillReconciliationResult> {
  if (env.PCD_CRM_ADAPTER_ENABLED !== 'true' || env.PCD_CRM_BACKFILL_ENABLED !== 'true') {
    return disabledBackfillReconciliation();
  }
  const config = requireConfig(env);
  const secret = env.PCD_CRM_ADAPTER_HMAC_SECRET?.trim() ?? '';
  const fetcher = options.fetcher ?? env.CRM_ADAPTER;
  if (!config || !secret || !fetcher || !env.PCD_OPS_DB) {
    throw new Error('pcd_crm_adapter_configuration_missing');
  }
  const db = env.PCD_OPS_DB;
  const now = options.now ?? Date.now();
  const run = await ensureBackfillRun(env, config, now);
  const pass = Number(run.reconciliation_pass);
  const window = Number(run.reconciliation_window_ordinal) + 1;
  if (run.status === 'running') {
    return { ...disabledBackfillReconciliation(), enabled: true, pass, window };
  }
  if (run.status === 'completed' || run.reconciliation_complete === 1) {
    return {
      ...disabledBackfillReconciliation(), enabled: true, pass: 2,
      window: Number(run.reconciliation_window_ordinal), completed: true,
    };
  }
  if (run.reconciliation_halted === 1) throw new Error('pcd_crm_backfill_reconciliation_halted');
  if (Number(run.reconciliation_next_attempt_at) > now) {
    return { ...disabledBackfillReconciliation(), enabled: true, pass, window };
  }

  const accounting = await db.prepare(`SELECT
      EXISTS(SELECT 1 FROM crm_adapter_outbox WHERE backfill_run_id=? AND status='dead' LIMIT 1) dead,
      EXISTS(SELECT 1 FROM crm_adapter_outbox WHERE backfill_run_id=? AND status!='delivered' LIMIT 1) pending`)
    .bind(run.id, run.id).first<{ pending: number; dead: number }>();
  const pending = Number(accounting?.pending ?? 0);
  const dead = Number(accounting?.dead ?? 0);
  if (dead > 0) throw new Error('pcd_crm_backfill_dead_letters_present');
  if (pending > 0) {
    return { ...disabledBackfillReconciliation(), enabled: true, pass, window, pending };
  }

  const leaseId = `pcd-crm-backfill-reconcile:${crypto.randomUUID()}`;
  const lease = await db.prepare(`UPDATE crm_adapter_backfill_runs SET lease_id=?,lease_expires_at=?,updated_at=?
    WHERE id=? AND status='scanned' AND reconciliation_complete=0
      AND (lease_expires_at IS NULL OR lease_expires_at<?)`)
    .bind(leaseId, now + 60_000, now, run.id, now).run();
  if (Number(lease.meta.changes ?? 0) !== 1) {
    return { ...disabledBackfillReconciliation(), enabled: true, pass, window };
  }

  let leaseReleased = false;
  try {
    const rows = await db.prepare(`SELECT event_id,source_sequence,event_type,payload_hash
      FROM crm_adapter_outbox WHERE backfill_run_id=? AND status='delivered' AND source_sequence>?
      ORDER BY source_sequence LIMIT 100`).bind(run.id, run.reconciliation_cursor_sequence)
      .all<{ event_id: string; source_sequence: number; event_type: string; payload_hash: string }>();
    if (!rows.results.length) {
      const update = pass === 1
        ? db.prepare(`UPDATE crm_adapter_backfill_runs SET reconciliation_pass=2,reconciliation_cursor_sequence=0,
            reconciliation_window_ordinal=0,reconciliation_failure_count=0,reconciliation_next_attempt_at=0,
            reconciliation_halted=0,lease_id=NULL,lease_expires_at=NULL,updated_at=?
          WHERE id=? AND lease_id=? AND reconciliation_pass=1 AND reconciliation_complete=0`).bind(now, run.id, leaseId)
        : db.prepare(`UPDATE crm_adapter_backfill_runs SET reconciliation_complete=1,lease_id=NULL,
            lease_expires_at=NULL,reconciliation_failure_count=0,reconciliation_next_attempt_at=0,
            reconciliation_halted=0,updated_at=?
          WHERE id=? AND lease_id=? AND reconciliation_pass=2 AND reconciliation_complete=0`).bind(now, run.id, leaseId);
      const updated = await update.run();
      if (Number(updated.meta.changes ?? 0) !== 1) throw new Error('pcd_crm_backfill_lease_lost');
      leaseReleased = true;
      return {
        ...disabledBackfillReconciliation(), enabled: true, pass, window: window - 1,
        passCompleted: true, completed: pass === 2,
      };
    }

    const highWaterRow = await db.prepare(`SELECT COALESCE(MAX(source_sequence),0) high_water
      FROM crm_adapter_outbox WHERE producer_workspace_id=?`).bind(config.producerWorkspaceId)
      .first<{ high_water: number }>();
    const declaredHighWater = Number(highWaterRow?.high_water ?? 0);
    const events = rows.results.map((row) => ({
      eventId: row.event_id,
      sequence: Number(row.source_sequence),
      eventType: row.event_type,
      payloadHash: row.payload_hash,
    }));
    const manifest = {
      contractVersion: CONTRACT_VERSION,
      producerWorkspaceId: config.producerWorkspaceId,
      declaredHighWater,
      events,
    };
    const body = JSON.stringify(manifest);
    const hmacKey = await importHmacKey(secret);
    const { response, result } = await signedFetchJson(
      fetcher,
      hmacKey,
      config.producerWorkspaceId,
      RECONCILE_SCOPE,
      `pcd-backfill-reconcile-${run.id}-${pass}-${window}`,
      'reconcile',
      body,
    );
    const validResult = isValidReconciliationResult(
      response,
      result,
      config.producerWorkspaceId,
      declaredHighWater,
      events,
    );
    if (!validResult || !result) {
      await recordBackfillReconciliationFailure(db, run, leaseId, now);
      leaseReleased = true;
      return { ...disabledBackfillReconciliation(), enabled: true, pass, window };
    }

    const count = (key: typeof RECONCILIATION_RESULT_ARRAYS[number]) => (result[key] as unknown[]).length;
    const missing = count('missing');
    const duplicate = count('duplicate');
    const stale = count('stale');
    const unauthorized = count('unauthorized');
    const mismatch = count('mismatch');
    const resultHash = await sha256(stableJson(result));
    const receiptId = `pcd-crm-recon:${crypto.randomUUID()}`;
    const statements: D1PreparedStatement[] = [
      db.prepare(`INSERT INTO crm_adapter_reconciliation_receipts
        (id,producer_workspace_id,declared_high_water,receiver_high_water,manifest_count,missing_count,
         duplicate_count,stale_count,unauthorized_count,mismatch_count,result_hash,checked_at)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`).bind(
        receiptId, config.producerWorkspaceId, declaredHighWater, Number(result.receiverHighWater), events.length,
        missing, duplicate, stale, unauthorized, mismatch, resultHash, now,
      ),
    ];
    let requeueIndex = -1;
    if (missing + duplicate + stale + unauthorized + mismatch === 0) {
      const firstSequence = events[0]!.sequence;
      const lastSequence = events.at(-1)!.sequence;
      statements.push(
        db.prepare(`INSERT INTO crm_adapter_backfill_reconciliation_windows
          (run_id,pass_number,window_ordinal,after_sequence,first_sequence,last_sequence,manifest_count,
           declared_high_water,receiver_high_water,missing_count,duplicate_count,stale_count,unauthorized_count,
           mismatch_count,manifest_hash,result_hash,checked_at)
          VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).bind(
          run.id, pass, window, run.reconciliation_cursor_sequence, firstSequence, lastSequence, events.length,
          declaredHighWater, Number(result.receiverHighWater), 0, 0, 0, 0, 0,
          await sha256(stableJson(events)), resultHash, now,
        ),
        db.prepare(`UPDATE crm_adapter_backfill_runs SET reconciliation_cursor_sequence=?,
            reconciliation_window_ordinal=?,reconciliation_failure_count=0,reconciliation_next_attempt_at=0,
            reconciliation_halted=0,lease_id=NULL,lease_expires_at=NULL,updated_at=?
          WHERE id=? AND lease_id=? AND reconciliation_pass=? AND reconciliation_cursor_sequence=?
            AND reconciliation_window_ordinal=? AND reconciliation_complete=0`).bind(
          lastSequence, window, now, run.id, leaseId, pass,
          run.reconciliation_cursor_sequence, run.reconciliation_window_ordinal,
        ),
      );
    } else {
      if (missing > 0) {
        const missingIds = (result.missing as Array<{ eventId: string }>).map((item) => item.eventId);
        const placeholders = missingIds.map(() => '?').join(',');
        requeueIndex = statements.length;
        statements.push(db.prepare(`UPDATE crm_adapter_outbox SET status='retry',attempt_count=MIN(attempt_count,?),
          next_attempt_at=?,receiver_receipt_id=NULL,receiver_status=NULL,delivered_at=NULL,
          last_error_code='receiver_missing_reconcile',lease_id=NULL,lease_expires_at=NULL,updated_at=?
          WHERE producer_workspace_id=? AND backfill_run_id=? AND status='delivered'
            AND event_id IN (${placeholders})`).bind(
          MAX_ATTEMPTS - 1, now, now, config.producerWorkspaceId, run.id, ...missingIds,
        ));
      }
      const failureCount = Math.min(MAX_ATTEMPTS, Number(run.reconciliation_failure_count) + 1);
      const halted = failureCount >= MAX_ATTEMPTS ? 1 : 0;
      statements.push(db.prepare(`UPDATE crm_adapter_backfill_runs
        SET reconciliation_failure_count=?,reconciliation_next_attempt_at=?,reconciliation_halted=?,
          lease_id=NULL,lease_expires_at=NULL,updated_at=? WHERE id=? AND lease_id=?`)
        .bind(failureCount, halted ? 0 : reconciliationRetryAt(now, failureCount), halted, now, run.id, leaseId));
    }
    const results = await db.batch(statements);
    if (requeueIndex >= 0 && Number(results[requeueIndex]?.meta.changes ?? 0) !== missing) {
      throw new Error('pcd_crm_backfill_missing_requeue_conflict');
    }
    if (Number(results.at(-1)?.meta.changes ?? 0) !== 1) throw new Error('pcd_crm_backfill_lease_lost');
    leaseReleased = true;
    return {
      enabled: true,
      checked: true,
      pass,
      window,
      passCompleted: false,
      completed: false,
      pending: 0,
      missing,
      mismatch: mismatch + duplicate + stale + unauthorized,
    };
  } finally {
    if (!leaseReleased) {
      await db.prepare(`UPDATE crm_adapter_backfill_runs SET lease_id=NULL,lease_expires_at=NULL,updated_at=?
        WHERE id=? AND lease_id=?`).bind(now, run.id, leaseId).run();
    }
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
  const safetyHead = await env.PCD_OPS_DB.prepare(`SELECT id,event_id,source_sequence,event_type,payload_json,payload_hash,
      idempotency_key,attempt_count,status,next_attempt_at,lease_expires_at
    FROM crm_adapter_outbox INDEXED BY idx_crm_adapter_outbox_safety_sequence
    WHERE producer_workspace_id=? AND event_type='contact.deleted.v1' AND status IN ('pending','retry','leased')
    ORDER BY source_sequence LIMIT ?`).bind(config.producerWorkspaceId, limit).all<OutboxHeadRow>();
  const duePrefix: OutboxHeadRow[] = [];
  for (const row of safetyHead.results) {
    const due = row.status === 'leased'
      ? row.lease_expires_at !== null && Number(row.lease_expires_at) <= now
      : Number(row.next_attempt_at) <= now;
    if (!due) break;
    duePrefix.push(row);
  }
  if (!duePrefix.length) {
    const head = await env.PCD_OPS_DB.prepare(`SELECT id,event_id,source_sequence,event_type,payload_json,payload_hash,
        idempotency_key,attempt_count,status,next_attempt_at,lease_expires_at
      FROM crm_adapter_outbox INDEXED BY idx_crm_adapter_outbox_claim_sequence
      WHERE producer_workspace_id=? AND status IN ('pending','retry','leased','dead')
      ORDER BY source_sequence LIMIT ?`).bind(config.producerWorkspaceId, limit).all<OutboxHeadRow>();
    for (const row of head.results) {
      if (row.status === 'dead') break;
      const due = row.status === 'leased'
        ? row.lease_expires_at !== null && Number(row.lease_expires_at) <= now
        : Number(row.next_attempt_at) <= now;
      if (!due) break;
      duePrefix.push(row);
    }
  }
  if (!duePrefix.length) return { enabled: true, claimed: 0, delivered: 0, retried: 0, dead: 0 };
  const placeholders = duePrefix.map(() => '?').join(',');
  const claimed = await env.PCD_OPS_DB.prepare(`UPDATE crm_adapter_outbox
    SET status='leased',lease_id=?,lease_expires_at=?,updated_at=?
    WHERE producer_workspace_id=? AND id IN (${placeholders}) AND attempt_count<?
      AND ((status IN ('pending','retry') AND next_attempt_at<=?) OR (status='leased' AND lease_expires_at<=?))
    RETURNING id,event_id,source_sequence,event_type,payload_json,payload_hash,idempotency_key,attempt_count`)
    .bind(
      leaseId, now + 60_000, now, config.producerWorkspaceId, ...duePrefix.map((row) => row.id),
      MAX_ATTEMPTS, now, now,
    ).all<OutboxRow>();
  claimed.results.sort((left, right) => Number(left.source_sequence) - Number(right.source_sequence));
  if (!claimed.results.length) return { enabled: true, claimed: 0, delivered: 0, retried: 0, dead: 0 };

  const outcomes: Array<{
    row: OutboxRow;
    kind: 'delivered' | 'retry' | 'dead' | 'blocked';
    status: number;
    code: string | null;
    receiptId: string | null;
  }> = [];
  const hmacKey = fetcher ? await importHmacKey(secret) : null;
  let blocked = false;
  for (const row of claimed.results) {
    if (blocked) {
      outcomes.push({ row, kind: 'blocked', status: 0, code: null, receiptId: null });
      continue;
    }
    if (!fetcher) {
      outcomes.push({ row, kind: 'retry', status: 0, code: 'receiver_unavailable', receiptId: null });
      blocked = true;
      continue;
    }
    try {
      const { response, result: responseBody } = await signedFetchJson(
        fetcher, hmacKey!, config.producerWorkspaceId, EVENT_SCOPE, row.idempotency_key, 'events', row.payload_json,
      );
      const accepted = isValidDeliveryAcknowledgement(responseBody, row);
      const receiptId = accepted && responseBody ? responseBody.receiptId as string : null;
      if ((response.status === 200 || response.status === 202) && accepted) {
        outcomes.push({ row, kind: 'delivered', status: response.status, code: null, receiptId });
        continue;
      }
      if (response.status >= 400 && response.status < 500 && ![408, 425, 429].includes(response.status)) {
        outcomes.push({ row, kind: 'dead', status: response.status, code: `receiver_${response.status}`, receiptId: null });
        blocked = true;
        continue;
      }
      outcomes.push({ row, kind: 'retry', status: response.status, code: response.status ? `receiver_${response.status}` : 'receiver_invalid_response', receiptId: null });
      blocked = true;
    } catch (error) {
      outcomes.push({
        row,
        kind: 'retry',
        status: 0,
        code: error instanceof DOMException && error.name === 'AbortError' ? 'receiver_timeout' : 'receiver_unavailable',
        receiptId: null,
      });
      blocked = true;
    }
  }

  const updates: D1PreparedStatement[] = [];
  let delivered = 0;
  let retried = 0;
  let dead = 0;
  for (const outcome of outcomes) {
    if (outcome.kind === 'blocked') {
      updates.push(env.PCD_OPS_DB.prepare(`UPDATE crm_adapter_outbox SET status='pending',lease_id=NULL,
        lease_expires_at=NULL,updated_at=? WHERE id=? AND lease_id=?`)
        .bind(now, outcome.row.id, leaseId));
      continue;
    }
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
): Promise<{ enabled: boolean; checked: boolean; clean: boolean; missing: number; duplicate: number; stale: number; unauthorized: number; mismatch: number }> {
  const empty = { checked: false, clean: false, missing: 0, duplicate: 0, stale: 0, unauthorized: 0, mismatch: 0 };
  if (env.PCD_CRM_ADAPTER_ENABLED !== 'true') return { enabled: false, ...empty };
  const config = requireConfig(env);
  const secret = env.PCD_CRM_ADAPTER_HMAC_SECRET?.trim() ?? '';
  const fetcher = options.fetcher ?? env.CRM_ADAPTER;
  if (!config || !secret || !fetcher || !env.PCD_OPS_DB) return { enabled: true, ...empty };
  const rows = await env.PCD_OPS_DB.prepare(`SELECT event_id,source_sequence,event_type,payload_hash
    FROM crm_adapter_outbox WHERE producer_workspace_id=? ORDER BY source_sequence DESC LIMIT 100`)
    .bind(config.producerWorkspaceId)
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
  const hmacKey = await importHmacKey(secret);
  const { response, result } = await signedFetchJson(
    fetcher,
    hmacKey,
    config.producerWorkspaceId,
    RECONCILE_SCOPE,
    `pcd-reconcile-${highWater}`,
    'reconcile',
    body,
  );
  if (!isValidReconciliationResult(response, result, config.producerWorkspaceId, highWater, manifest.events)) {
    return { enabled: true, ...empty };
  }
  const count = (key: typeof RECONCILIATION_RESULT_ARRAYS[number]) => (result[key] as unknown[]).length;
  const checkedAt = options.now ?? Date.now();
  const id = `pcd-crm-recon:${crypto.randomUUID()}`;
  const receiverHighWater = Number(result.receiverHighWater);
  await env.PCD_OPS_DB.prepare(`INSERT INTO crm_adapter_reconciliation_receipts
    (id,producer_workspace_id,declared_high_water,receiver_high_water,manifest_count,missing_count,duplicate_count,stale_count,unauthorized_count,mismatch_count,result_hash,checked_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`).bind(
    id, config.producerWorkspaceId, highWater, receiverHighWater, rows.results.length,
    count('missing'), count('duplicate'), count('stale'), count('unauthorized'), count('mismatch'),
    await sha256(stableJson(result)), checkedAt,
  ).run();
  const findings = {
    missing: count('missing'),
    duplicate: count('duplicate'),
    stale: count('stale'),
    unauthorized: count('unauthorized'),
    mismatch: count('mismatch'),
  };
  return {
    enabled: true,
    checked: true,
    clean: Object.values(findings).every((value) => value === 0),
    ...findings,
  };
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
    ? { checked: false, clean: false, missing: 0, duplicate: 0, stale: 0, unauthorized: 0, mismatch: 0 }
    : await reconcilePcdCrmOutbox(env);
  const backfillReconciliation = await reconcilePcdCrmBackfill(env);
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
    reconciled: reconciliation.checked && reconciliation.clean,
    missing: reconciliation.missing,
    duplicate: reconciliation.duplicate,
    stale: reconciliation.stale,
    unauthorized: reconciliation.unauthorized,
    mismatch: reconciliation.mismatch,
    backfillReconciliationChecked: backfillReconciliation.checked,
    backfillReconciliationPass: backfillReconciliation.pass,
    backfillReconciliationWindow: backfillReconciliation.window,
    backfillReconciliationPassCompleted: backfillReconciliation.passCompleted,
    backfillReconciliationCompleted: backfillReconciliation.completed,
    backfillReconciliationPending: backfillReconciliation.pending,
    backfillReconciliationMissing: backfillReconciliation.missing,
    backfillReconciliationMismatch: backfillReconciliation.mismatch,
  }));
}
