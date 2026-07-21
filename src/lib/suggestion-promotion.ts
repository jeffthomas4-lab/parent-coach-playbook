// Turns an org_suggestions row (migrations/0009_org_suggestions.sql) into a
// minimal draft `programs` row, so "Create draft camp" on /admin/suggestions/
// actually produces something instead of just relabeling the queue row.
//
// Creates a matching `organizations` row unless one already exists with the
// same name (case-insensitive exact match) — reuse that org instead of
// duplicating it. The resulting program lands as pcd_status='pending' with a
// stub description; the admin finishes it on /admin/camps/{id} the same way
// they finish any other pending row.

import type { D1Database } from '@cloudflare/workers-types';
import { generateCampId, uniqueSlug, extractDomain, type OrgSuggestion } from './camps-db';

export interface PromoteResult {
  programId: string;
  organizationId: string;
  organizationCreated: boolean;
}

async function findOrganizationIdByName(db: D1Database, name: string): Promise<string | null> {
  const row = await db
    .prepare('SELECT id FROM organizations WHERE LOWER(name) = LOWER(?) LIMIT 1')
    .bind(name)
    .first<{ id: string }>();
  return row?.id ?? null;
}

/** Best-effort slug for activity_category from the suggestion's free-text activity_type. Falls back to 'other' (a valid, already-used category) rather than inventing an unrecognized one. */
function slugifyCategory(activityType: string | null): string {
  if (!activityType) return 'other';
  const slug = activityType.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return slug || 'other';
}

export async function promoteOrgSuggestionToProgram(
  db: D1Database,
  suggestion: OrgSuggestion,
): Promise<PromoteResult> {
  const now = new Date().toISOString();
  const programId = generateCampId();
  const programSlug = await uniqueSlug(db, suggestion.org_name);

  const existingOrgId = await findOrganizationIdByName(db, suggestion.org_name);
  const organizationCreated = !existingOrgId;
  const organizationId = existingOrgId ?? generateCampId();

  const statements = [];

  if (organizationCreated) {
    const orgDescription = suggestion.notes?.trim() ? suggestion.notes.trim().slice(0, 500) : null;
    statements.push(
      db
        .prepare(
          `INSERT INTO organizations (
             id, slug, name, organization_type,
             website_url, city, state,
             description,
             record_source, record_status, is_claimed,
             confidence_score,
             created_at, updated_at
           ) VALUES (?, ?, ?, 'other', ?, ?, ?, ?, 'org-suggestion', 'unverified', 0, 20, ?, ?)`,
        )
        .bind(
          organizationId,
          `org-${organizationId}`,
          suggestion.org_name,
          suggestion.org_website,
          suggestion.org_city,
          suggestion.org_state,
          orgDescription,
          now,
          now,
        ),
    );
  }

  const programDescription = suggestion.notes?.trim()
    ? suggestion.notes.trim().slice(0, 300)
    : `Draft created from an admin-reviewed organization suggestion (${suggestion.id}). Needs full program detail before publishing.`;

  statements.push(
    db
      .prepare(
        `INSERT INTO programs (
           id, organization_id, slug, name,
           program_type, activity_category,
           description,
           record_source, record_status,
           confidence_score, source_domain,
           pcd_status, pcd_confidence,
           submitted_by_email, submitted_at,
           awaiting_review,
           created_at, updated_at
         ) VALUES (
           ?, ?, ?, ?,
           'camp', ?,
           ?,
           'org-suggestion', 'unverified',
           20, ?,
           'pending', 'low',
           ?, ?,
           0,
           ?, ?
         )`,
      )
      .bind(
        programId,
        organizationId,
        programSlug,
        suggestion.org_name,
        slugifyCategory(suggestion.activity_type),
        programDescription,
        extractDomain(suggestion.org_website),
        suggestion.submitter_email ?? 'admin-promoted@parentcoachdesk.com',
        now,
        now,
        now,
      ),
  );

  await db.batch(statements);
  return { programId, organizationId, organizationCreated };
}
