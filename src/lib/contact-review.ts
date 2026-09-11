import type { D1Database, D1PreparedStatement } from '@cloudflare/workers-types';
import {
  commitPcdContactMutation,
  type PcdContactProjectionInput,
  type PcdCrmAdapterEnv,
} from './crm-adapter';
import { computeContentHash, type OrgContact, type OrgContactContext } from './org-contacts';
import {
  computeRowHash,
  digestActorEmail,
  GENESIS_HASH,
  recordAdminReceipt,
  type AdminReceiptRow,
} from './admin-receipts';

export interface ContactReviewEnv extends PcdCrmAdapterEnv {
  DB?: D1Database;
}

export type ContactReviewDecision = 'approve_professional' | 'classify_private';
export type PrivateContactContext = 'family' | 'guardian' | 'minor' | 'roster';

interface DirectoryOrganization {
  id: string;
  name: string;
  city: string | null;
  state: string | null;
}

type ReviewContact = Pick<OrgContact,
  'id' | 'organization_id' | 'program_id' | 'full_name' | 'title' | 'role' |
  'email' | 'phone' | 'phone_ext' | 'is_public' | 'do_not_contact' |
  'contact_context' | 'source' | 'source_url' | 'confidence' | 'verified_at' |
  'content_hash' | 'deleted_at' | 'created_at' | 'updated_at'
>;

interface QueueContact extends ReviewContact {
  created_second: number;
}

export interface ContactReviewQueueRow extends QueueContact {
  organization: DirectoryOrganization | null;
  approvalEligible: boolean;
  approvalBlocks: string[];
}

export interface ContactReviewQueuePage {
  rows: ContactReviewQueueRow[];
  hasMore: boolean;
  nextCursor: string | null;
}

export interface ContactReviewInput {
  id: string;
  expectedUpdatedAt: string;
  expectedContentHash: string;
  decision: ContactReviewDecision;
  privateContext?: PrivateContactContext;
  actorEmail: string;
  environment: string;
  requestId: string;
}

export type ContactReviewResult =
  | {
      ok: true;
      id: string;
      decision: ContactReviewDecision;
      isPublic: boolean;
      contactContext: OrgContactContext;
    }
  | { ok: false; code: 'not_found' | 'state_changed' | 'not_eligible'; reason: string };

const PRIVATE_CONTEXTS = new Set<PrivateContactContext>(['family', 'guardian', 'minor', 'roster']);
const QUEUE_LIMIT_MAX = 50;
const CONTACT_REVIEW_COLUMNS = `id,organization_id,program_id,full_name,title,role,email,phone,phone_ext,
  is_public,do_not_contact,contact_context,source,source_url,confidence,verified_at,content_hash,
  deleted_at,created_at,updated_at`;

function isHttpUrl(value: string | null): boolean {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

export function contactApprovalBlocks(contact: Pick<OrgContact,
  'deleted_at' | 'do_not_contact' | 'contact_context' | 'source_url' | 'email' | 'phone' | 'content_hash'
>): string[] {
  const blocks: string[] = [];
  if (contact.deleted_at) blocks.push('deleted');
  if (contact.do_not_contact === 1) blocks.push('suppressed');
  if (PRIVATE_CONTEXTS.has(contact.contact_context as PrivateContactContext)) blocks.push('protected_context');
  if (!isHttpUrl(contact.source_url)) blocks.push('source_proof_required');
  if (!(contact.email?.trim() || contact.phone?.trim())) blocks.push('channel_required');
  if (!/^[0-9a-f]{64}$/i.test(contact.content_hash ?? '')) blocks.push('content_hash_required');
  return blocks;
}

interface QueueCursor {
  second: number;
  id: string;
}

function parseCursor(raw?: string | null): QueueCursor | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(atob(raw)) as Partial<QueueCursor>;
    if (!Number.isInteger(value.second) || Number(value.second) < 0) return null;
    if (typeof value.id !== 'string' || value.id.length < 1 || value.id.length > 200) return null;
    return { second: Number(value.second), id: value.id };
  } catch {
    return null;
  }
}

function makeCursor(row: QueueContact): string {
  return btoa(JSON.stringify({ second: Number(row.created_second), id: row.id } satisfies QueueCursor));
}

export async function listContactReviewQueue(
  env: ContactReviewEnv,
  options: { limit?: number; cursor?: string | null } = {},
): Promise<ContactReviewQueuePage> {
  if (!env.PCD_OPS_DB) throw new Error('pcd_ops_db_missing');
  const limit = Math.min(QUEUE_LIMIT_MAX, Math.max(1, Math.trunc(options.limit ?? 25)));
  const cursor = parseCursor(options.cursor);
  const cursorClause = cursor
    ? `AND (unixepoch(created_at) > ? OR (unixepoch(created_at) = ? AND id > ?))`
    : '';
  const bindings: unknown[] = cursor ? [cursor.second, cursor.second, cursor.id] : [];
  const result = await env.PCD_OPS_DB.prepare(
    `SELECT ${CONTACT_REVIEW_COLUMNS},unixepoch(created_at) AS created_second
       FROM org_contacts INDEXED BY idx_org_contacts_crm_backfill_created
      WHERE deleted_at IS NULL AND is_public=0 AND do_not_contact=0
        AND contact_context IN ('unknown','professional')
        ${cursorClause}
      ORDER BY unixepoch(created_at),id LIMIT ?`,
  ).bind(...bindings, limit + 1).all<QueueContact>();

  const fetched = result.results ?? [];
  const hasMore = fetched.length > limit;
  const contacts = fetched.slice(0, limit);
  const organizations = new Map<string, DirectoryOrganization>();
  const organizationIds = [...new Set(contacts.map((row) => row.organization_id))];
  if (env.DB && organizationIds.length) {
    const placeholders = organizationIds.map(() => '?').join(',');
    const directory = await env.DB.prepare(
      `SELECT id,name,city,state FROM organizations
        WHERE deleted_at IS NULL AND id IN (${placeholders})`,
    ).bind(...organizationIds).all<DirectoryOrganization>();
    for (const row of directory.results ?? []) organizations.set(row.id, row);
  }

  const rows = contacts.map((contact): ContactReviewQueueRow => {
    const approvalBlocks = contactApprovalBlocks(contact);
    const organization = organizations.get(contact.organization_id) ?? null;
    if (!organization) approvalBlocks.push('organization_not_live');
    return {
      ...contact,
      organization,
      approvalEligible: approvalBlocks.length === 0,
      approvalBlocks,
    };
  });
  return {
    rows,
    hasMore,
    nextCursor: hasMore && rows.length ? makeCursor(rows.at(-1)!) : null,
  };
}

async function receiptTip(db: D1Database): Promise<string> {
  const tip = await db.prepare(`SELECT row_hash FROM admin_action_receipts ORDER BY id DESC LIMIT 1`)
    .first<{ row_hash: string }>();
  return tip?.row_hash ?? GENESIS_HASH;
}

async function prepareSuccessReceipt(
  db: D1Database,
  input: ContactReviewInput,
  existing: ReviewContact,
  action: string,
  beforeSummary: string,
  afterSummary: string,
  createdAt: string,
): Promise<D1PreparedStatement> {
  const expectedPrevHash = await receiptTip(db);
  const actor = await digestActorEmail(input.actorEmail);
  const row: AdminReceiptRow = {
    schema_version: 1,
    environment: input.environment,
    actor_email_digest: actor.digest,
    actor_email_domain: actor.domain,
    action,
    resource_type: 'org_contact',
    resource_id: input.id,
    request_id: input.requestId,
    authorization_context: 'cloudflare-access-jwt:admin-allowlist',
    result: 'success',
    reason: null,
    before_summary: beforeSummary,
    after_summary: afterSummary,
    prev_hash: expectedPrevHash,
    created_at: createdAt,
  };
  const rowHash = await computeRowHash(row);

  // Both guards deliberately fail a schema CHECK rather than silently inserting
  // zero rows. D1 batch() is transactional, so a stale contact or receipt-chain
  // tip aborts the following contact UPDATE and any adapter outbox writes too.
  return db.prepare(
    `INSERT INTO admin_action_receipts
      (schema_version,environment,actor_email_digest,actor_email_domain,action,
       resource_type,resource_id,request_id,authorization_context,result,reason,
       before_summary,after_summary,prev_hash,row_hash,created_at)
     VALUES (1,
       CASE WHEN EXISTS (
         SELECT 1 FROM org_contacts
          WHERE id=? AND updated_at=? AND content_hash IS ? AND deleted_at IS ?
            AND is_public=? AND do_not_contact=? AND contact_context=?
            AND organization_id IS ? AND program_id IS ? AND full_name IS ?
            AND title IS ? AND role IS ? AND email IS ? AND phone IS ? AND phone_ext IS ?
            AND source_url IS ?
       ) THEN ? ELSE '' END,
       ?,?,?,?,?,?,?,'success',NULL,?,?,
       CASE WHEN COALESCE((SELECT row_hash FROM admin_action_receipts ORDER BY id DESC LIMIT 1),?)=?
            THEN ? ELSE '' END,
       ?,?)`,
  ).bind(
    input.id, input.expectedUpdatedAt, input.expectedContentHash, existing.deleted_at,
    existing.is_public, existing.do_not_contact, existing.contact_context,
    existing.organization_id, existing.program_id, existing.full_name,
    existing.title, existing.role, existing.email, existing.phone, existing.phone_ext,
    existing.source_url, row.environment,
    row.actor_email_digest, row.actor_email_domain, row.action, row.resource_type,
    row.resource_id, row.request_id, row.authorization_context,
    row.before_summary, row.after_summary,
    GENESIS_HASH, expectedPrevHash, expectedPrevHash, rowHash, row.created_at,
  );
}

async function recordBlocked(
  db: D1Database,
  input: ContactReviewInput,
  reason: string,
): Promise<void> {
  await recordAdminReceipt(db, {
    environment: input.environment,
    actorEmail: input.actorEmail,
    action: `contact.${input.decision}`,
    resourceType: 'org_contact',
    resourceId: input.id,
    requestId: input.requestId,
    authorizationContext: 'cloudflare-access-jwt:admin-allowlist',
    result: 'blocked',
    reason,
  });
}

export async function reviewOrgContact(
  env: ContactReviewEnv,
  input: ContactReviewInput,
): Promise<ContactReviewResult> {
  if (!env.PCD_OPS_DB) throw new Error('pcd_ops_db_missing');
  const db = env.PCD_OPS_DB;
  const existing = await db.prepare(`SELECT ${CONTACT_REVIEW_COLUMNS} FROM org_contacts WHERE id=?`)
    .bind(input.id).first<ReviewContact>();
  if (!existing) {
    await recordBlocked(db, input, 'contact_not_found');
    return { ok: false, code: 'not_found', reason: 'contact_not_found' };
  }
  if (existing.updated_at !== input.expectedUpdatedAt || existing.content_hash !== input.expectedContentHash) {
    await recordBlocked(db, input, 'contact_state_changed');
    return { ok: false, code: 'state_changed', reason: 'contact_state_changed' };
  }
  if (existing.deleted_at || existing.is_public === 1 || PRIVATE_CONTEXTS.has(existing.contact_context as PrivateContactContext)) {
    await recordBlocked(db, input, 'contact_not_reviewable');
    return { ok: false, code: 'not_eligible', reason: 'contact_not_reviewable' };
  }

  let nextContext: OrgContactContext;
  let nextPublic: 0 | 1;
  if (input.decision === 'approve_professional') {
    const currentContentHash = await computeContentHash({
      organization_id: existing.organization_id,
      program_id: existing.program_id,
      full_name: existing.full_name,
      title: existing.title,
      role: existing.role,
      email: existing.email,
      phone: existing.phone,
      phone_ext: existing.phone_ext,
      do_not_contact: existing.do_not_contact,
      contact_context: existing.contact_context,
    });
    if (currentContentHash !== existing.content_hash) {
      await recordBlocked(db, input, 'content_hash_mismatch');
      return { ok: false, code: 'not_eligible', reason: 'content_hash_mismatch' };
    }
    const blocks = contactApprovalBlocks(existing);
    if (blocks.length) {
      const reason = `approval_blocked:${blocks.join(',')}`;
      await recordBlocked(db, input, reason);
      return { ok: false, code: 'not_eligible', reason };
    }
    if (!env.DB) throw new Error('directory_db_missing');
    const organization = await env.DB.prepare(
      `SELECT id FROM organizations WHERE id=? AND deleted_at IS NULL`,
    ).bind(existing.organization_id).first<{ id: string }>();
    if (!organization) {
      await recordBlocked(db, input, 'organization_not_live');
      return { ok: false, code: 'not_eligible', reason: 'organization_not_live' };
    }
    nextContext = 'professional';
    nextPublic = 1;
  } else if (input.decision === 'classify_private' && input.privateContext && PRIVATE_CONTEXTS.has(input.privateContext)) {
    nextContext = input.privateContext;
    nextPublic = 0;
  } else {
    await recordBlocked(db, input, 'invalid_review_decision');
    return { ok: false, code: 'not_eligible', reason: 'invalid_review_decision' };
  }

  const nowIso = new Date().toISOString();
  const now = Date.parse(nowIso);
  const nextContentHash = await computeContentHash({
    organization_id: existing.organization_id,
    program_id: existing.program_id,
    full_name: existing.full_name,
    title: existing.title,
    role: existing.role,
    email: existing.email,
    phone: existing.phone,
    phone_ext: existing.phone_ext,
    do_not_contact: existing.do_not_contact,
    contact_context: nextContext,
  });
  const beforeSummary = `is_public=${existing.is_public} context=${existing.contact_context}`;
  const afterSummary = `is_public=${nextPublic} context=${nextContext}`;
  const action = `contact.${input.decision}`;
  const receiptStatement = await prepareSuccessReceipt(
    db, input, existing, action, beforeSummary, afterSummary, nowIso,
  );

  const approvalSets = input.decision === 'approve_professional'
    ? `,verified_by=?,verified_at=?,verification_method='website'`
    : '';
  const approvalBindings = input.decision === 'approve_professional' ? [input.actorEmail, nowIso] : [];
  const eligibilityGuard = input.decision === 'approve_professional'
    ? `AND do_not_contact=0 AND is_public=0 AND contact_context IN ('unknown','professional')
       AND source_url IS NOT NULL AND trim(source_url)<>''
       AND (coalesce(trim(email),'')<>'' OR coalesce(trim(phone),'')<>'')`
    : `AND do_not_contact=0 AND is_public=0 AND contact_context IN ('unknown','professional')`;
  const canonicalStatement = db.prepare(
    `UPDATE org_contacts
        SET is_public=?,contact_context=?,content_hash=?,updated_at=?${approvalSets}
      WHERE id=? AND updated_at=? AND content_hash IS ? AND deleted_at IS ?
        AND is_public=? AND do_not_contact=? AND contact_context=?
        AND source_url IS ? AND email IS ? AND phone IS ? ${eligibilityGuard}`,
  ).bind(
    nextPublic, nextContext, nextContentHash, nowIso, ...approvalBindings,
    input.id, input.expectedUpdatedAt, input.expectedContentHash, existing.deleted_at,
    existing.is_public, existing.do_not_contact, existing.contact_context,
    existing.source_url, existing.email, existing.phone,
  );
  const projected: PcdContactProjectionInput = {
    id: existing.id,
    organization_id: existing.organization_id,
    full_name: existing.full_name,
    title: existing.title,
    role: existing.role,
    email: existing.email,
    phone: existing.phone,
    is_public: nextPublic,
    do_not_contact: existing.do_not_contact,
    contact_context: nextContext,
    source_url: existing.source_url,
    confidence: existing.confidence,
    verified_at: input.decision === 'approve_professional' ? nowIso : existing.verified_at,
    content_hash: nextContentHash,
    deleted_at: existing.deleted_at,
    updated_at: nowIso,
  };

  await commitPcdContactMutation(env, canonicalStatement, projected, now, [receiptStatement]);
  return {
    ok: true,
    id: existing.id,
    decision: input.decision,
    isPublic: nextPublic === 1,
    contactContext: nextContext,
  };
}
