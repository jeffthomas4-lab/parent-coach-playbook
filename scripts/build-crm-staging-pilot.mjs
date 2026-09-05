import { createHash } from 'node:crypto';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ORGANIZATIONS = [
  { id: 'fixture-org-soccer', category: 'soccer' },
  { id: 'fixture-org-basketball', category: 'basketball' },
  { id: 'fixture-org-swim', category: 'swimming' },
];

const CONTACTS = [
  {
    id: 'crm-pilot-contact-email', organizationId: 'fixture-org-soccer',
    fullName: 'CRM Pilot Email Contact', role: 'director', email: 'crm-pilot-email@example.invalid',
    phone: null, isPublic: 1, doNotContact: 0, contactContext: 'professional',
    sourceUrl: 'https://example.invalid/crm-pilot/email', disposition: 'projected',
  },
  {
    id: 'crm-pilot-contact-phone', organizationId: 'fixture-org-basketball',
    fullName: 'CRM Pilot Phone Contact', role: 'registrar', email: null,
    phone: '+1-206-555-0199', isPublic: 1, doNotContact: 0, contactContext: 'professional',
    sourceUrl: 'https://example.invalid/crm-pilot/phone', disposition: 'projected',
  },
  {
    id: 'crm-pilot-contact-private', organizationId: 'fixture-org-swim',
    fullName: 'CRM Pilot Private Contact', role: 'admin', email: 'crm-pilot-private@example.invalid',
    phone: null, isPublic: 0, doNotContact: 0, contactContext: 'professional',
    sourceUrl: 'https://example.invalid/crm-pilot/private', disposition: 'rejected_private',
  },
  {
    id: 'crm-pilot-contact-suppressed', organizationId: 'fixture-org-soccer',
    fullName: 'CRM Pilot Suppressed Contact', role: 'marketing', email: 'crm-pilot-suppressed@example.invalid',
    phone: null, isPublic: 1, doNotContact: 1, contactContext: 'professional',
    sourceUrl: 'https://example.invalid/crm-pilot/suppressed', disposition: 'rejected_suppressed',
  },
  {
    id: 'crm-pilot-contact-minor', organizationId: 'fixture-org-basketball',
    fullName: 'CRM Pilot Minor Context', role: 'unknown', email: 'crm-pilot-minor@example.invalid',
    phone: null, isPublic: 1, doNotContact: 0, contactContext: 'minor',
    sourceUrl: 'https://example.invalid/crm-pilot/minor', disposition: 'rejected_nonprofessional_context',
  },
  {
    id: 'crm-pilot-contact-unknown', organizationId: 'fixture-org-swim',
    fullName: 'CRM Pilot Unknown Context', role: 'unknown', email: 'crm-pilot-unknown@example.invalid',
    phone: null, isPublic: 1, doNotContact: 0, contactContext: 'unknown',
    sourceUrl: 'https://example.invalid/crm-pilot/unknown', disposition: 'held_context_review',
  },
  {
    id: 'crm-pilot-contact-missing-source', organizationId: 'fixture-org-soccer',
    fullName: 'CRM Pilot Missing Source', role: 'director', email: 'crm-pilot-nosource@example.invalid',
    phone: null, isPublic: 1, doNotContact: 0, contactContext: 'professional',
    sourceUrl: null, disposition: 'rejected_missing_source',
  },
  {
    id: 'crm-pilot-contact-missing-channel', organizationId: 'fixture-org-basketball',
    fullName: 'CRM Pilot Missing Channel', role: 'admin', email: null,
    phone: null, isPublic: 1, doNotContact: 0, contactContext: 'professional',
    sourceUrl: 'https://example.invalid/crm-pilot/missing-channel', disposition: 'rejected_missing_channel',
  },
];

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function sqlValue(value) {
  if (value === null) return 'NULL';
  if (typeof value === 'number') return String(value);
  return `'${String(value).replaceAll("'", "''")}'`;
}

function header(boundaryMs) {
  return `-- Generated synthetic staging CRM pilot for boundary ${boundaryMs}.\n`
    + '-- Local artifact only: this file grants no authority for any remote action.\n';
}

function idList(rows) {
  return rows.map(({ id }) => sqlValue(id)).join(',');
}

function buildDirectoryMutation(boundaryMs, updatedAt) {
  const rows = ORGANIZATIONS.map(({ id, category }) => `UPDATE organizations
SET website_url=${sqlValue(`https://example.invalid/crm-pilot/${boundaryMs}/${category}`)},
    categories=${sqlValue(JSON.stringify([category]))},
    updated_at=${sqlValue(updatedAt)}
WHERE id=${sqlValue(id)} AND deleted_at IS NULL;`);
  return `${header(boundaryMs)}\n${rows.join('\n\n')}\n`;
}

function buildContactsMutation(boundaryMs, createdAt) {
  const values = CONTACTS.map((contact) => `(${[
    contact.id, contact.organizationId, contact.fullName, 'CRM Pilot', contact.role,
    contact.email, contact.phone, 0, contact.isPublic, contact.doNotContact,
    contact.doNotContact ? createdAt : null, contact.doNotContact ? 'manual' : null,
    'manual_verification', contact.sourceUrl, 'high', 'crm-staging-pilot', createdAt,
    'other', null, createdAt, createdAt, contact.contactContext,
  ].map(sqlValue).join(',')})`).join(',\n  ');
  return `${header(boundaryMs)}
WITH receipt_gate AS (
  SELECT COUNT(*) AS ready
  FROM crm_adapter_projection_receipts receipt
  JOIN crm_adapter_outbox event ON event.event_id=receipt.last_event_id
    AND event.subject_type=receipt.subject_type
    AND event.subject_id=receipt.subject_id
    AND event.authority_updated_at=receipt.authority_updated_at
  WHERE receipt.subject_type='organization'
    AND receipt.subject_id IN (${idList(ORGANIZATIONS)})
    AND event.event_type='organization.upserted.v1'
    AND event.producer_workspace_id='pcd-activity-radar'
    AND event.target_workspace_id='ws-sightsmash'
    AND event.authority_updated_at=${boundaryMs + 1_000}
    AND event.status='delivered'
  HAVING COUNT(*)=3
), pilot (
  id,organization_id,full_name,title,role,email,phone,is_primary,is_public,do_not_contact,
  do_not_contact_at,do_not_contact_reason,source,source_url,confidence,verified_by,verified_at,
  verification_method,content_hash,created_at,updated_at,contact_context
) AS (VALUES
  ${values}
)
INSERT INTO org_contacts (
  id,organization_id,full_name,title,role,email,phone,is_primary,is_public,do_not_contact,
  do_not_contact_at,do_not_contact_reason,source,source_url,confidence,verified_by,verified_at,
  verification_method,content_hash,created_at,updated_at,contact_context
)
SELECT pilot.* FROM pilot CROSS JOIN receipt_gate;
`;
}

function buildDirectoryPreflight(boundaryMs) {
  return `${header(boundaryMs)}
SELECT COUNT(*) AS exact_fixture_rows,
       SUM(CASE WHEN deleted_at IS NULL THEN 1 ELSE 0 END) AS live_fixture_rows,
       SUM(CASE WHEN crm_projection_revision=0 THEN 1 ELSE 0 END) AS unprojected_fixture_rows
FROM organizations WHERE id IN (${idList(ORGANIZATIONS)});
`;
}

function buildOpsPreflight(boundaryMs) {
  return `${header(boundaryMs)}
SELECT COUNT(*) AS existing_pilot_contact_rows
FROM org_contacts WHERE id IN (${idList(CONTACTS)});
`;
}

function buildDirectoryVerification(boundaryMs, updatedAt) {
  return `${header(boundaryMs)}
SELECT COUNT(*) AS exact_fixture_rows,
       SUM(CASE WHEN deleted_at IS NULL AND updated_at=${sqlValue(updatedAt)}
                     AND crm_projection_revision>0 THEN 1 ELSE 0 END) AS ready_projection_rows
FROM organizations WHERE id IN (${idList(ORGANIZATIONS)});
`;
}

function buildOpsVerification(boundaryMs) {
  return `${header(boundaryMs)}
SELECT disposition,COUNT(*) AS row_count FROM (
  SELECT CASE
    WHEN deleted_at IS NOT NULL THEN 'tombstoned_no_projection'
    WHEN do_not_contact=1 THEN 'rejected_suppressed'
    WHEN is_public<>1 THEN 'rejected_private'
    WHEN contact_context='unknown' THEN 'held_context_review'
    WHEN contact_context<>'professional' THEN 'rejected_nonprofessional_context'
    WHEN email IS NOT NULL OR phone IS NOT NULL THEN
      CASE WHEN source_url IS NULL THEN 'rejected_missing_source' ELSE 'projected' END
    ELSE 'rejected_missing_channel'
  END AS disposition
  FROM org_contacts WHERE id IN (${idList(CONTACTS)})
) GROUP BY disposition ORDER BY disposition;

SELECT event_type,status,COUNT(*) AS event_count
FROM crm_adapter_outbox WHERE subject_id IN (${idList([...ORGANIZATIONS, ...CONTACTS])})
GROUP BY event_type,status ORDER BY event_type,status;

SELECT COUNT(*) AS delivered_pilot_organizations
FROM crm_adapter_projection_receipts receipt
JOIN crm_adapter_outbox event ON event.event_id=receipt.last_event_id
WHERE receipt.subject_type='organization'
  AND receipt.subject_id IN (${idList(ORGANIZATIONS)})
  AND event.status='delivered';
`;
}

export function parsePilotBoundary(value) {
  if (typeof value !== 'string' || !/^\d+$/.test(value)) {
    throw new Error('crm_pilot_boundary_must_be_an_explicit_integer_ms');
  }
  const boundaryMs = Number(value);
  if (!Number.isSafeInteger(boundaryMs) || boundaryMs % 1_000 !== 0
      || boundaryMs <= 0 || Math.abs(Date.now() - boundaryMs) > 15 * 60 * 1_000) {
    throw new Error('crm_pilot_boundary_must_be_safe_and_second_aligned');
  }
  return boundaryMs;
}

export async function buildCrmStagingPilot({ boundaryMs: rawBoundaryMs, outputDir: rawOutputDir }) {
  const boundaryMs = parsePilotBoundary(String(rawBoundaryMs));
  if (typeof rawOutputDir !== 'string' || !rawOutputDir.trim()) {
    throw new Error('crm_pilot_output_directory_required');
  }
  const outputDir = resolve(rawOutputDir);
  const organizationUpdatedAt = new Date(boundaryMs + 1_000).toISOString();
  const contactCreatedAt = new Date(boundaryMs + 4_000).toISOString();
  const files = new Map([
    ['00-directory-preflight.sql', buildDirectoryPreflight(boundaryMs)],
    ['00-ops-preflight.sql', buildOpsPreflight(boundaryMs)],
    ['01-directory-organizations.sql', buildDirectoryMutation(boundaryMs, organizationUpdatedAt)],
    ['02-ops-contacts.sql', buildContactsMutation(boundaryMs, contactCreatedAt)],
    ['90-directory-verification.sql', buildDirectoryVerification(boundaryMs, organizationUpdatedAt)],
    ['91-ops-verification.sql', buildOpsVerification(boundaryMs)],
  ]);
  const dispositionCounts = Object.fromEntries(CONTACTS.map(({ disposition }) => [disposition, 0]));
  for (const { disposition } of CONTACTS) dispositionCounts[disposition] += 1;
  const artifacts = [...files].map(([file, contents]) => ({
    file, sha256: sha256(contents), bytes: Buffer.byteLength(contents),
  }));
  const manifest = {
    schemaVersion: 1,
    kind: 'pcd-crm-staging-synthetic-pilot',
    environment: 'staging',
    dataClassification: 'synthetic_nonproduction',
    remoteExecutionAuthorized: false,
    sourceNotBeforeMs: boundaryMs,
    sourceNotBeforeIso: new Date(boundaryMs).toISOString(),
    organizationUpdatedAt,
    contactCreatedAt,
    organizations: ORGANIZATIONS.map(({ id }) => ({ id, expectedEvent: 'organization.upserted.v1' })),
    contacts: CONTACTS.map(({ id, organizationId, disposition }) => ({ id, organizationId, disposition })),
    expected: {
      organizationEvents: 3,
      contactEvents: 2,
      contactDispositions: dispositionCounts,
    },
    order: [
      'Run both read-only preflights and confirm 3 live, unprojected organizations and 0 existing pilot contacts.',
      'Apply 01 only after a separately approved staging activation uses this exact sourceNotBeforeMs.',
      'Wait for all 3 organization events to be delivered and receipted; do not infer readiness from enqueue success.',
      'Apply 02 only after the organization receipt precondition passes.',
      'Run both read-only verification files and compare every count with this manifest.',
    ],
    hardStops: [
      'No file in this packet authorizes remote execution.',
      'Do not enable historical backfill for this pilot.',
      'Do not substitute production organizations or contacts.',
      'Do not proceed from organizations to contacts without receiver receipts for all 3 organizations.',
    ],
    artifacts,
  };

  let ownsOutputDirectory = false;
  try {
    await mkdir(outputDir);
    ownsOutputDirectory = true;
    for (const [file, contents] of files) {
      await writeFile(resolve(outputDir, file), contents, { encoding: 'utf8', flag: 'wx' });
    }
    await writeFile(resolve(outputDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, {
      encoding: 'utf8', flag: 'wx',
    });
  } catch (error) {
    if (ownsOutputDirectory) await rm(outputDir, { recursive: true, force: true });
    throw error;
  }
  return manifest;
}

export function parsePilotArguments(argv) {
  const values = {};
  for (let index = 0; index < argv.length; index += 1) {
    const flag = argv[index];
    if (flag !== '--boundary-ms' && flag !== '--output-dir') throw new Error(`unknown_argument:${flag}`);
    if (Object.hasOwn(values, flag)) throw new Error(`duplicate_argument:${flag}`);
    const value = argv[index + 1];
    if (!value || value.startsWith('--')) throw new Error(`missing_value:${flag}`);
    values[flag] = value;
    index += 1;
  }
  return values;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = parsePilotArguments(process.argv.slice(2));
  const manifest = await buildCrmStagingPilot({
    boundaryMs: args['--boundary-ms'],
    outputDir: args['--output-dir'],
  });
  process.stdout.write(`${JSON.stringify({
    outputDir: resolve(args['--output-dir']),
    sourceNotBeforeMs: manifest.sourceNotBeforeMs,
    artifacts: manifest.artifacts,
  }, null, 2)}\n`);
}
