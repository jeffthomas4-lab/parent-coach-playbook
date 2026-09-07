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

function normalizedContactIdentities(contact) {
  return {
    email: contact.email?.trim().toLowerCase() ?? null,
    phone: contact.phone?.replace(/\D/g, '') || null,
    name: contact.fullName.trim().toLowerCase().replace(/\s+/g, ' '),
  };
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
  const values = CONTACTS.map((contact) => {
    const identity = normalizedContactIdentities(contact);
    return `(${[
      contact.id, contact.organizationId, contact.fullName, 'CRM Pilot', contact.role,
      contact.email, contact.phone, identity.email, identity.phone, identity.name,
      0, contact.isPublic, contact.doNotContact,
      contact.doNotContact ? createdAt : null, contact.doNotContact ? 'manual' : null,
      'manual_verification', contact.sourceUrl, 'high', 'crm-staging-pilot', createdAt,
      'other', null, createdAt, createdAt, contact.contactContext,
    ].map(sqlValue).join(',')})`;
  }).join(',\n  ');
  return `${header(boundaryMs)}
WITH receipt_gate AS (
  SELECT COUNT(*)
  FROM crm_adapter_projection_receipts receipt
  JOIN crm_adapter_outbox event ON event.event_id=receipt.last_event_id
    AND event.subject_type=receipt.subject_type
    AND event.subject_id=receipt.subject_id
    AND event.authority_updated_at=receipt.authority_updated_at
    AND event.payload_hash=receipt.content_hash
    AND event.source_sequence=receipt.last_sequence
  WHERE receipt.subject_type='organization'
    AND receipt.subject_id IN (${idList(ORGANIZATIONS)})
    AND event.event_type='organization.upserted.v1'
    AND event.producer_workspace_id='pcd-activity-radar'
    AND event.target_workspace_id='ws-sightsmash'
    AND event.authority_updated_at=${boundaryMs + 1_000}
    AND event.status='delivered'
    AND event.receiver_receipt_id IS NOT NULL
    AND event.receiver_status BETWEEN 200 AND 299
    AND event.delivered_at IS NOT NULL
  HAVING COUNT(*)=3
), pilot (
  id,organization_id,full_name,title,role,email,phone,email_identity,phone_identity,name_identity,
  is_primary,is_public,do_not_contact,
  do_not_contact_at,do_not_contact_reason,source,source_url,confidence,verified_by,verified_at,
  verification_method,content_hash,created_at,updated_at,contact_context
) AS (VALUES
  ${values}
)
INSERT INTO org_contacts (
  id,organization_id,full_name,title,role,email,phone,email_identity,phone_identity,name_identity,
  is_primary,is_public,do_not_contact,
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

function buildOpsReplay(boundaryMs) {
  return `${header(boundaryMs)}
WITH replay_gate AS (
  SELECT COUNT(*) AS replayable_events
  FROM crm_adapter_outbox
  WHERE producer_workspace_id='pcd-activity-radar'
    AND target_workspace_id='ws-sightsmash'
    AND subject_type='contact'
    AND authority_updated_at=${boundaryMs + 4_000}
    AND (
      (event_type='contact.observed.v1'
        AND subject_id IN ('crm-pilot-contact-email','crm-pilot-contact-phone'))
      OR (event_type='contact.deleted.v1'
        AND subject_id='crm-pilot-contact-suppressed')
    )
    AND status='delivered'
    AND attempt_count=1
    AND send_attempt_count=1
    AND receiver_receipt_id IS NOT NULL
    AND receiver_status BETWEEN 200 AND 299
    AND delivered_at IS NOT NULL
    AND last_error_code IS NULL
    AND lease_id IS NULL
    AND lease_expires_at IS NULL
    AND cancelled_at IS NULL
  HAVING COUNT(*)=3
    AND COUNT(DISTINCT subject_id)=3
    AND COUNT(DISTINCT event_id)=3
    AND COUNT(DISTINCT idempotency_key)=3
    AND COUNT(DISTINCT receiver_receipt_id)=3
)
UPDATE crm_adapter_outbox
SET status='retry',
    next_attempt_at=0,
    receiver_receipt_id=NULL,
    receiver_status=NULL,
    last_error_code='pilot_idempotency_replay',
    delivered_at=NULL,
    lease_id=NULL,
    lease_expires_at=NULL,
    updated_at=${boundaryMs + 8_000}
WHERE producer_workspace_id='pcd-activity-radar'
  AND target_workspace_id='ws-sightsmash'
  AND subject_type='contact'
  AND authority_updated_at=${boundaryMs + 4_000}
  AND (
    (event_type='contact.observed.v1'
      AND subject_id IN ('crm-pilot-contact-email','crm-pilot-contact-phone'))
    OR (event_type='contact.deleted.v1'
      AND subject_id='crm-pilot-contact-suppressed')
  )
  AND EXISTS (SELECT 1 FROM replay_gate);
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
FROM crm_adapter_outbox WHERE
  (subject_type='organization' AND subject_id IN (${idList(ORGANIZATIONS)}))
  OR (subject_type='contact' AND subject_id IN (${idList(CONTACTS)}))
GROUP BY event_type,status ORDER BY event_type,status;

SELECT COUNT(*) AS delivered_pilot_organizations
FROM crm_adapter_projection_receipts receipt
JOIN crm_adapter_outbox event ON event.event_id=receipt.last_event_id
  AND event.subject_type=receipt.subject_type
  AND event.subject_id=receipt.subject_id
  AND event.authority_updated_at=receipt.authority_updated_at
  AND event.payload_hash=receipt.content_hash
  AND event.source_sequence=receipt.last_sequence
WHERE receipt.subject_type='organization'
  AND receipt.subject_id IN (${idList(ORGANIZATIONS)})
  AND event.event_type='organization.upserted.v1'
  AND event.producer_workspace_id='pcd-activity-radar'
  AND event.target_workspace_id='ws-sightsmash'
  AND event.authority_updated_at=${boundaryMs + 1_000}
  AND event.status='delivered'
  AND event.receiver_receipt_id IS NOT NULL
  AND event.receiver_status BETWEEN 200 AND 299
  AND event.delivered_at IS NOT NULL;

SELECT COUNT(*) AS raw_free_dnc_events
FROM crm_adapter_outbox
WHERE subject_type='contact' AND subject_id='crm-pilot-contact-suppressed'
  AND event_type='contact.deleted.v1'
  AND json_extract(payload_json,'$.payload.suppressionState')='do_not_contact'
  AND json_type(payload_json,'$.payload.value') IS NULL
  AND json_type(payload_json,'$.payload.email') IS NULL
  AND json_type(payload_json,'$.payload.phone') IS NULL
  AND json_type(payload_json,'$.payload.id')='text'
  AND json_type(payload_json,'$.payload.organizationId')='text'
  AND json_type(payload_json,'$.payload.workspaceId')='text'
  AND json_type(payload_json,'$.payload.sourceVersion')='text'
  AND json_type(payload_json,'$.payload.authorityUpdatedAt')='integer'
  AND (SELECT COUNT(*) FROM json_each(json_extract(payload_json,'$.payload')))=6
  AND NOT EXISTS (
    SELECT 1 FROM json_each(json_extract(payload_json,'$.payload'))
    WHERE key NOT IN ('id','organizationId','workspaceId','sourceVersion',
      'authorityUpdatedAt','suppressionState')
  );

SELECT COUNT(*) AS incomplete_contact_identities
FROM org_contacts
WHERE id IN (${idList(CONTACTS)}) AND (
  name_identity IS NULL
  OR (email IS NOT NULL AND email_identity IS NULL)
  OR (phone IS NOT NULL AND phone_identity IS NULL)
);
`;
}

function buildCrmVerification(boundaryMs) {
  return `${header(boundaryMs)}
SELECT
  (SELECT COUNT(*) FROM workspace_organizations
    WHERE workspace_id='ws-sightsmash' AND organization_id IN (${idList(ORGANIZATIONS)})
      AND status='active' AND visibility_basis='pcd_adapter') AS active_organization_projections,
  (SELECT COUNT(*) FROM workspace_contacts
    WHERE workspace_id='ws-sightsmash'
      AND contact_point_id IN ('contact_crm-pilot-contact-email','contact_crm-pilot-contact-phone')
      AND status='active' AND visibility_basis='pcd_public_professional_observation') AS active_contact_projections,
  (SELECT COUNT(*) FROM adapter_contact_suppressions
    WHERE producer='parent-coach-desk' AND producer_workspace_id='pcd-activity-radar'
      AND source_contact_id='crm-pilot-contact-suppressed'
      AND target_workspace_id='ws-sightsmash' AND restriction_type='do_not_contact') AS dnc_restrictions,
  (SELECT COUNT(*) FROM contact_points
    WHERE id='contact_crm-pilot-contact-suppressed') AS suppressed_contact_points;
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
  const files = [
    ['00-directory-preflight.sql', buildDirectoryPreflight(boundaryMs)],
    ['00-ops-preflight.sql', buildOpsPreflight(boundaryMs)],
    ['01-directory-organizations.sql', buildDirectoryMutation(boundaryMs, organizationUpdatedAt)],
    ['02-ops-contacts.sql', buildContactsMutation(boundaryMs, contactCreatedAt)],
    ['03-ops-replay.sql', buildOpsReplay(boundaryMs)],
    ['90-directory-verification.sql', buildDirectoryVerification(boundaryMs, organizationUpdatedAt)],
    ['91-ops-verification.sql', buildOpsVerification(boundaryMs)],
    ['92-crm-verification.sql', buildCrmVerification(boundaryMs)],
  ];
  const dispositionCounts = Object.fromEntries(CONTACTS.map(({ disposition }) => [disposition, 0]));
  for (const { disposition } of CONTACTS) dispositionCounts[disposition] += 1;
  const artifacts = files.map(([file, contents]) => ({
    file, sha256: sha256(contents), bytes: Buffer.byteLength(contents),
  }));
  const manifest = {
    schemaVersion: 1,
    kind: 'pcd-crm-staging-synthetic-pilot',
    environment: 'staging',
    dataClassification: 'synthetic_nonproduction',
    remoteExecutionAuthorized: false,
    readOnlyD1Transport: {
      requiredFlag: '--command',
      prohibitedFlags: ['--file'],
      requiredMeta: {
        success: true,
        changes: 0,
        rows_written: 0,
        changed_db: false,
      },
    },
    sourceNotBeforeMs: boundaryMs,
    sourceNotBeforeIso: new Date(boundaryMs).toISOString(),
    organizationUpdatedAt,
    contactCreatedAt,
    organizations: ORGANIZATIONS.map(({ id }) => ({ id, expectedEvent: 'organization.upserted.v1' })),
    contacts: CONTACTS.map(({ id, organizationId, disposition }) => ({ id, organizationId, disposition })),
    expected: {
      organizationEvents: 3,
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
      contactDispositions: dispositionCounts,
    },
    order: [
      'Run both read-only preflights and confirm 3 live, unprojected organizations and 0 existing pilot contacts.',
      'Apply 01 only after a separately approved staging activation uses this exact sourceNotBeforeMs.',
      'Wait for all 3 organization events to be delivered and receipted; do not infer readiness from enqueue success.',
      'Apply 02 only after the organization receipt precondition passes.',
      'Apply 03 exactly once only after recording the first three contact receipt IDs; require exactly three changed rows.',
      'Wait for the same three event IDs and idempotency keys to return the same receipt IDs through receiver replay.',
      'Run all three read-only verification files and compare every count with this manifest.',
    ],
    hardStops: [
      'No file in this packet authorizes remote execution.',
      'Execute every remote read-only D1 preflight via --command; --file uses the import endpoint and is prohibited.',
      'Do not enable historical backfill for this pilot.',
      'Do not substitute production organizations or contacts.',
      'Do not proceed from organizations to contacts without receiver receipts for all 3 organizations.',
      'Do not apply the replay phase unless all 3 contact events have exactly one successful send and distinct receipts.',
      'Stop if the raw-free DNC event or the CRM source-contact restriction is absent.',
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
