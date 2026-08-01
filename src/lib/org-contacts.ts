// The organization contact layer.
//
// Named humans attached to an organization: a camp director, a registrar, the
// person who actually answers. Before this existed, the estate could store a
// channel (organizations.email, programs.contact_email) but never a person, so
// a verification pass had nowhere to put the most valuable thing it found.
//
// Binding: PCD_OPS_DB, the operational D1 described in
// migrations-pcd-ops/README.md. Migration 0028_org_contacts.sql defines the
// table and is intentionally unapplied (design-only, per that README's
// production-safety convention). So every call here is best-effort, exactly
// like lib/events.ts: a missing binding or a missing/unmigrated table is
// caught, logged, and swallowed. Nothing in this file may throw and break a
// caller's real work just because 0028 has not landed in a given environment.
//
// TWO DATABASES. `organizationId` refers to `organizations.id` in the
// *activity-radar* D1 (binding DB). This table lives in PCD_OPS_DB. D1 has no
// cross-database joins, so callers fetch orgs from one and contacts from the
// other and join in the Worker. There is no foreign key and orphans are
// possible; see CONTACT-DATA-MAP.md.
//
// PII. Every row here is human-mapped personal data. It must never be copied
// into the activity-radar database, never written to a file in this repo (git
// history is permanent and would break the 30-day deletion SLA in DATA-MAP.md),
// and never logged. The log lines below deliberately carry ids and counts only.

import { log } from './log';

export interface OrgContactsEnv {
  PCD_OPS_DB?: D1Database;
}

export type OrgContactRole =
  | 'owner' | 'director' | 'registrar' | 'coach'
  | 'admin' | 'marketing' | 'billing' | 'media' | 'unknown';

export type OrgContactSource =
  | 'manual_verification' | 'website' | 'claim' | 'import'
  | 'inbound_email' | 'enrichment' | 'referral' | 'other';

export type OrgContactConfidence = 'high' | 'medium' | 'low';

export type VerificationMethod =
  | 'website' | 'phone_call' | 'email_reply' | 'claim' | 'in_person' | 'other';

export interface OrgContact {
  id: string;
  organization_id: string;
  program_id: string | null;
  full_name: string | null;
  title: string | null;
  role: OrgContactRole;
  email: string | null;
  phone: string | null;
  phone_ext: string | null;
  preferred_channel: string | null;
  is_primary: 0 | 1;
  is_public: 0 | 1;
  do_not_contact: 0 | 1;
  do_not_contact_at: string | null;
  do_not_contact_reason: string | null;
  source: OrgContactSource;
  source_url: string | null;
  confidence: OrgContactConfidence;
  verified_by: string | null;
  verified_at: string | null;
  verification_method: VerificationMethod | null;
  notes: string | null;
  // CRM-owned. Never written by this file. See CONTACT-DATA-MAP.md.
  crm_external_id: string | null;
  crm_synced_at: string | null;
  crm_updated_at: string | null;
  crm_status: string | null;
  crm_owner: string | null;
  crm_last_touch_at: string | null;
  content_hash: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface UpsertOrgContactInput {
  organizationId: string;
  programId?: string | null;
  fullName?: string | null;
  title?: string | null;
  role?: OrgContactRole;
  email?: string | null;
  phone?: string | null;
  phoneExt?: string | null;
  source?: OrgContactSource;
  sourceUrl?: string | null;
  confidence?: OrgContactConfidence;
  verifiedBy?: string | null;
  verificationMethod?: VerificationMethod | null;
  notes?: string | null;
  /**
   * @deprecated Ignored by upsertOrgContact as of 2026-07-31 — every insert
   * is hardcoded to is_public = 0 regardless of this value. Kept on the type
   * only so existing call sites do not need an edit. Publishing is a human
   * decision with no agent code path; build a separate admin-gated function
   * if a real "make public" action is ever needed.
   */
  isPublic?: 0 | 1;
  isPrimary?: 0 | 1;
}

export type OrgContactResult =
  | { ok: true; id: string; created: boolean }
  | { ok: false; reason: 'no-binding' | 'no-table' | 'invalid' | 'suppressed' | 'error' };

const ROLES: readonly OrgContactRole[] = [
  'owner', 'director', 'registrar', 'coach',
  'admin', 'marketing', 'billing', 'media', 'unknown',
];

const nowIso = (): string => new Date().toISOString();

/**
 * True when the failure is "0028 has not been applied here", which is an
 * expected state in every environment right now and must not be treated as an
 * error. Anything else is a real fault and gets logged as one.
 */
function isMissingTable(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err ?? '');
  return /no such table/i.test(msg) && /org_contacts/i.test(msg);
}

/**
 * Stable hash over the PCD-OWNED fields only. The crm_* columns are excluded on
 * purpose: a CRM write-back must not change this hash, or the next sync would
 * read it as a PCD-side edit and push it straight back out, and the two systems
 * would bounce the same row between them forever.
 */
export async function computeContentHash(c: {
  full_name?: string | null; title?: string | null; role?: string | null;
  email?: string | null; phone?: string | null; phone_ext?: string | null;
  organization_id?: string | null; program_id?: string | null;
}): Promise<string> {
  const canonical = [
    c.organization_id ?? '', c.program_id ?? '', c.full_name ?? '',
    c.title ?? '', c.role ?? '', c.email ?? '', c.phone ?? '', c.phone_ext ?? '',
  ].join(' ').toLowerCase();
  const bytes = new TextEncoder().encode(canonical);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

const normEmail = (v?: string | null): string | null => {
  const t = (v ?? '').trim().toLowerCase();
  return t && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t) ? t : null;
};

/** All live contacts for one organization. Returns [] when the layer isn't wired up. */
export async function listOrgContacts(
  env: OrgContactsEnv,
  organizationId: string,
): Promise<OrgContact[]> {
  if (!env?.PCD_OPS_DB) return [];
  try {
    const { results } = await env.PCD_OPS_DB
      .prepare(
        `SELECT * FROM org_contacts
          WHERE organization_id = ? AND deleted_at IS NULL
          ORDER BY is_primary DESC, full_name ASC`,
      )
      .bind(organizationId)
      .all<OrgContact>();
    return results ?? [];
  } catch (err) {
    if (!isMissingTable(err)) {
      log('error', { requestId: crypto.randomUUID(), route: 'lib/org-contacts', action: 'list_failed', organizationId, error: err });
    }
    return [];
  }
}

/** Live contacts for many organizations at once, grouped by org id. */
export async function listOrgContactsForOrgs(
  env: OrgContactsEnv,
  organizationIds: string[],
): Promise<Map<string, OrgContact[]>> {
  const out = new Map<string, OrgContact[]>();
  if (!env?.PCD_OPS_DB || organizationIds.length === 0) return out;
  try {
    const placeholders = organizationIds.map(() => '?').join(',');
    const { results } = await env.PCD_OPS_DB
      .prepare(
        `SELECT * FROM org_contacts
          WHERE organization_id IN (${placeholders}) AND deleted_at IS NULL
          ORDER BY is_primary DESC, full_name ASC`,
      )
      .bind(...organizationIds)
      .all<OrgContact>();
    for (const row of results ?? []) {
      const list = out.get(row.organization_id) ?? [];
      list.push(row);
      out.set(row.organization_id, list);
    }
  } catch (err) {
    if (!isMissingTable(err)) {
      log('error', { requestId: crypto.randomUUID(), route: 'lib/org-contacts', action: 'bulk_list_failed', count: organizationIds.length, error: err });
    }
  }
  return out;
}

/**
 * Insert a contact, or update the existing one with the same (organization_id,
 * email). Best-effort: never throws.
 *
 * Refuses to write when the matching row is marked do_not_contact — a
 * suppression must survive re-discovery by an agent that has no idea the person
 * opted out. That is the single most important rule in this file.
 */
export async function upsertOrgContact(
  env: OrgContactsEnv,
  input: UpsertOrgContactInput,
): Promise<OrgContactResult> {
  if (!env?.PCD_OPS_DB) return { ok: false, reason: 'no-binding' };

  const organizationId = (input.organizationId ?? '').trim();
  const fullName = (input.fullName ?? '').trim() || null;
  const email = normEmail(input.email);
  const phone = (input.phone ?? '').trim() || null;

  // Mirrors the table CHECK: a row with no name and no channel is noise.
  if (!organizationId) return { ok: false, reason: 'invalid' };
  if (!fullName && !email && !phone) return { ok: false, reason: 'invalid' };

  const role: OrgContactRole = ROLES.includes(input.role as OrgContactRole)
    ? (input.role as OrgContactRole)
    : 'unknown';
  const now = nowIso();

  try {
    let existing: Pick<OrgContact, 'id' | 'do_not_contact'> | null = null;
    if (email) {
      existing = await env.PCD_OPS_DB
        .prepare(
          `SELECT id, do_not_contact FROM org_contacts
            WHERE organization_id = ? AND email = ? AND deleted_at IS NULL`,
        )
        .bind(organizationId, email)
        .first<Pick<OrgContact, 'id' | 'do_not_contact'>>();
    }

    if (existing?.do_not_contact === 1) {
      return { ok: false, reason: 'suppressed' };
    }

    const contentHash = await computeContentHash({
      organization_id: organizationId,
      program_id: input.programId ?? null,
      full_name: fullName, title: input.title ?? null, role,
      email, phone, phone_ext: input.phoneExt ?? null,
    });

    if (existing) {
      // COALESCE so a thinner re-discovery never erases a richer earlier pass.
      await env.PCD_OPS_DB
        .prepare(
          `UPDATE org_contacts SET
             full_name           = COALESCE(?, full_name),
             title               = COALESCE(?, title),
             role                = CASE WHEN role = 'unknown' THEN ? ELSE role END,
             phone               = COALESCE(?, phone),
             phone_ext           = COALESCE(?, phone_ext),
             source_url          = COALESCE(?, source_url),
             confidence          = ?,
             verified_by         = COALESCE(?, verified_by),
             verified_at         = COALESCE(?, verified_at),
             verification_method = COALESCE(?, verification_method),
             notes               = COALESCE(?, notes),
             content_hash        = ?,
             updated_at          = ?
           WHERE id = ?`,
        )
        .bind(
          fullName, input.title ?? null, role, phone, input.phoneExt ?? null,
          input.sourceUrl ?? null, input.confidence ?? 'medium',
          input.verifiedBy ?? null, input.verifiedBy ? now : null,
          input.verificationMethod ?? null, input.notes ?? null,
          contentHash, now, existing.id,
        )
        .run();
      return { ok: true, id: existing.id, created: false };
    }

    const id = crypto.randomUUID();
    await env.PCD_OPS_DB
      .prepare(
        `INSERT INTO org_contacts (
           id, organization_id, program_id, full_name, title, role,
           email, phone, phone_ext, is_primary, is_public,
           source, source_url, confidence,
           verified_by, verified_at, verification_method, notes,
           content_hash, created_at, updated_at
         ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      )
      .bind(
        // is_public is hardcoded to 0 here, not read from input.isPublic. This
        // table is populated by daily agents reading an organization's own
        // public web pages (see CONTACT-DATA-MAP.md's Agents section); a
        // prompt-injection payload on a scraped page has no code path to flip
        // a contact public on write. Publishing is a human-only action and
        // must go through a separate, explicitly admin-gated function — see
        // this file header's PII rules and CONTACT-DATA-MAP.md, "Agents write
        // is_public = 0 always. Only a human flips it."
        id, organizationId, input.programId ?? null, fullName, input.title ?? null, role,
        email, phone, input.phoneExt ?? null, input.isPrimary ?? 0, 0,
        input.source ?? 'manual_verification', input.sourceUrl ?? null, input.confidence ?? 'medium',
        input.verifiedBy ?? null, input.verifiedBy ? now : null,
        input.verificationMethod ?? null, input.notes ?? null,
        contentHash, now, now,
      )
      .run();
    return { ok: true, id, created: true };
  } catch (err) {
    if (isMissingTable(err)) return { ok: false, reason: 'no-table' };
    log('error', { requestId: crypto.randomUUID(), route: 'lib/org-contacts', action: 'upsert_failed', organizationId, error: err });
    return { ok: false, reason: 'error' };
  }
}

/**
 * Soft delete. Never a hard DELETE: a removed row is invisible to a downstream
 * CRM sync, whereas a tombstone tells it to retract its own copy. Also frees the
 * (organization_id, email) and one-primary unique slots, which are scoped to
 * live rows.
 */
export async function softDeleteOrgContact(
  env: OrgContactsEnv,
  id: string,
): Promise<boolean> {
  if (!env?.PCD_OPS_DB) return false;
  try {
    const now = nowIso();
    await env.PCD_OPS_DB
      .prepare(`UPDATE org_contacts SET deleted_at = ?, updated_at = ? WHERE id = ? AND deleted_at IS NULL`)
      .bind(now, now, id)
      .run();
    return true;
  } catch (err) {
    if (!isMissingTable(err)) log('error', { requestId: crypto.randomUUID(), route: 'lib/org-contacts', action: 'soft_delete_failed', id, error: err });
    return false;
  }
}

/**
 * Mark a contact as never-contact. Authoritative and PCD-owned: the CRM must
 * honor it and never send. Set by unsubscribe, hard bounce, complaint, or a
 * privacy request (migrations-pcd-ops/0015_privacy_request_lifecycle.sql).
 * Also drops is_public, since a suppressed contact must not stay on a public page.
 */
export async function setDoNotContact(
  env: OrgContactsEnv,
  id: string,
  reason: 'unsubscribed' | 'hard_bounce' | 'complaint' | 'privacy_request' | 'manual' | 'other',
): Promise<boolean> {
  if (!env?.PCD_OPS_DB) return false;
  try {
    const now = nowIso();
    await env.PCD_OPS_DB
      .prepare(
        `UPDATE org_contacts
            SET do_not_contact = 1, do_not_contact_at = ?, do_not_contact_reason = ?,
                is_public = 0, updated_at = ?
          WHERE id = ?`,
      )
      .bind(now, reason, now, id)
      .run();
    return true;
  } catch (err) {
    if (!isMissingTable(err)) log('error', { requestId: crypto.randomUUID(), route: 'lib/org-contacts', action: 'suppression_failed', id, error: err });
    return false;
  }
}

/** Whether 0028 has actually been applied in this environment. */
export async function isContactLayerLive(env: OrgContactsEnv): Promise<boolean> {
  if (!env?.PCD_OPS_DB) return false;
  try {
    const row = await env.PCD_OPS_DB
      .prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name='org_contacts'`)
      .first<{ name: string }>();
    return !!row;
  } catch {
    return false;
  }
}
