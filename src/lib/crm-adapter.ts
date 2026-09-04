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

function requireConfig(env: PcdCrmAdapterEnv): {
  producerWorkspaceId: string;
  targetWorkspaceId: string;
  sourceId: string;
  sourceNotBeforeMs: number;
} | null {
  const producerWorkspaceId = env.PCD_CRM_PRODUCER_WORKSPACE_ID?.trim() ?? '';
  const targetWorkspaceId = env.PCD_CRM_TARGET_WORKSPACE_ID?.trim() ?? '';
  const sourceId = env.PCD_CRM_SOURCE_ID?.trim() ?? '';
  const sourceNotBeforeRaw = env.PCD_CRM_SOURCE_NOT_BEFORE_MS?.trim() ?? '';
  const sourceNotBeforeMs = Number(sourceNotBeforeRaw);
  if (!producerWorkspaceId || !targetWorkspaceId || !sourceId
    || !/^\d+$/.test(sourceNotBeforeRaw) || !Number.isSafeInteger(sourceNotBeforeMs) || sourceNotBeforeMs <= 0) return null;
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
    statements.push(
      db.prepare(`INSERT INTO crm_adapter_outbox
        (id,producer_workspace_id,event_id,source_sequence,event_type,subject_type,subject_id,authority_updated_at,payload_json,payload_hash,idempotency_key,status,attempt_count,next_attempt_at,created_at,updated_at)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,'pending',0,?,?,?)`).bind(
        `pcd-outbox:${draft.eventId}`, producerWorkspaceId, draft.eventId, sequence, draft.eventType,
        draft.subjectType, draft.subjectId, draft.authorityUpdatedAt, payloadJson, payloadHash, draft.eventId,
        now, now, now,
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

  const organizations = await env.DB.prepare(`SELECT id,name,organization_type,website_url,city,state,zip,categories,
    record_status,is_claimed,content_hash,deleted_at,updated_at FROM organizations
    WHERE updated_at>? OR (updated_at=? AND id>?) ORDER BY updated_at,id LIMIT ?`)
    .bind(organizationCursor.at, organizationCursor.at, organizationCursor.id, limit)
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

  const contacts = await env.PCD_OPS_DB.prepare(`SELECT id,organization_id,full_name,title,role,email,phone,do_not_contact,
    source_url,confidence,verified_at,content_hash,deleted_at,updated_at FROM org_contacts
    WHERE updated_at>? OR (updated_at=? AND id>?) ORDER BY updated_at,id LIMIT ?`)
    .bind(contactCursor.at, contactCursor.at, contactCursor.id, limit)
    .all<PcdContactProjectionInput>();
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

export async function runPcdCrmAdapter(env: PcdCrmAdapterEnv): Promise<void> {
  if (env.PCD_CRM_ADAPTER_ENABLED !== 'true') return;
  const projection = await projectPcdCrmEvents(env);
  const delivery = await dispatchPcdCrmOutbox(env);
  const reconciliation = await reconcilePcdCrmOutbox(env);
  console.log(JSON.stringify({
    event: 'pcd_crm_adapter_tick',
    projectedOrganizations: projection.organizations,
    projectedContacts: projection.contacts,
    deferredContacts: projection.deferred,
    delivered: delivery.delivered,
    retried: delivery.retried,
    dead: delivery.dead,
    reconciled: reconciliation.checked,
    missing: reconciliation.missing,
    mismatch: reconciliation.mismatch,
  }));
}
