#!/usr/bin/env node
/**
 * PCD ops migration boundary enforcement.
 *
 * This is the mechanism Plan 018 references to guarantee no stray migration
 * is ever applied to the PCD ops database (PCD_OPS_DB). It pins the exact,
 * closed migration range for that database -- 0011 through 0022, inclusive,
 * twelve files, no more, no fewer -- by embedding a fixed SHA-256 for each
 * file below. Any change to a pinned file's contents, any extra file added
 * to migrations-pcd-ops/, or any missing file makes this check FAIL.
 *
 * It also exports assertPendingLedgerExactly(pendingList), which a
 * deploy/rehearsal script can call against a remote "pending migrations"
 * list (e.g. from `wrangler d1 migrations list`) to refuse proceeding
 * unless that remote ledger is exactly {0011..0022} -- rejecting any EXTRA
 * migration (something the boundary does not expect) as well as any
 * MISSING migration (an incomplete apply).
 *
 * The pinned hashes below were computed directly against the files
 * currently in migrations-pcd-ops/ via:
 *   sha256sum migrations-pcd-ops/00{11..22}_*.sql
 * (equivalently, Node's crypto.createHash('sha256')).
 */
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export const MIGRATIONS_DIR = 'migrations-pcd-ops';

// Exactly the PCD ops migration boundary: 0011 through 0022, inclusive.
export const PINNED_MIGRATION_HASHES = {
  "0011_trust_cases.sql": "801c953eda851c37d7a53139d236d37976c73f52e7e585a5a6de340e243b5a32",
  "0012_trust_drafts_and_notification_outbox.sql": "54f6f37dd0853347ebd6991f2cb6a897395009ac3aa16e3ee61ac4a964cb8178",
  "0013_demand_events_v1.sql": "5102ed56cb8afc1caec33c90ecb841e4106c5a3ca77b3fef4424527f3cf09084",
  "0014_trust_intake_idempotency.sql": "51e335e7c9410d0547b0f32be3687056f5e1789d5f47ebf0767880988642cb70",
  "0015_privacy_request_lifecycle.sql": "6368f88d74becee44d0b327d59f5ecff5587e21ea2131805d0bde88fc08a573b",
  "0016_customer_identity_and_tenancy.sql": "477437d257db67beef947a99f9b8e8963a956cdd06615bc4dc2f6194c4640cc0",
  "0017_owner_claims_and_proposed_edits.sql": "3622db40859094d116795ec534fd1f1438bd7ad530a39fbb2210a3fb94950da2",
  "0018_customer_invitations_and_recovery.sql": "53a192374a504b4e8a0f671ece3181c9dea78844a248d3a75b4e0f03a2bd8121",
  "0019_owner_workflow_hardening.sql": "825e4c54458f7ccd5575616472c3ee1b7ef94edbf1e40f0b60746cf0716b13d9",
  "0020_recovery_and_dispute_audit.sql": "9b0015601d73c33980704a55dfd8a66f60739d00ef0a2bca7c608e8c2de2fc74",
  "0021_privacy_execution_evidence.sql": "3ccc34479b797d79f17753abb6cf1f463d6e459dbda23db3810ba3b8f6838e73",
  "0022_commerce_test_mode_ledger.sql": "964d6e43153495a1ea586643722ab1a29d01ce30f6cedd15c6f39ca9761b2257",
};

export const EXPECTED_MIGRATION_FILENAMES = Object.keys(PINNED_MIGRATION_HASHES);
export const EXPECTED_MIGRATION_IDS = EXPECTED_MIGRATION_FILENAMES.map((name) => name.slice(0, 4));

function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

/**
 * Reads migrations-pcd-ops/ from disk and verifies:
 *  - every pinned file (0011..0022) is present with the exact pinned hash;
 *  - no extra 0011..0022-range file exists beyond the pinned twelve.
 * Returns { valid, errors }.
 */
export function checkOpsMigrationBoundary({ projectRoot = process.cwd() } = {}) {
  const errors = [];
  const dir = resolve(projectRoot, MIGRATIONS_DIR);
  let entries;
  try {
    entries = readdirSync(dir);
  } catch (error) {
    return { valid: false, errors: [`could not read ${MIGRATIONS_DIR}/: ${error instanceof Error ? error.message : String(error)}`] };
  }

  const sqlFiles = entries.filter((name) => name.endsWith('.sql')).sort();
  const inRangePattern = /^00(1[1-9]|2[0-2])_/;
  const inRangeFiles = sqlFiles.filter((name) => inRangePattern.test(name));

  const expectedSet = new Set(EXPECTED_MIGRATION_FILENAMES);
  const actualSet = new Set(inRangeFiles);

  for (const expected of EXPECTED_MIGRATION_FILENAMES) {
    if (!actualSet.has(expected)) errors.push(`missing pinned migration: ${expected}`);
  }
  for (const actual of inRangeFiles) {
    if (!expectedSet.has(actual)) errors.push(`unexpected extra migration in the 0011-0022 range: ${actual}`);
  }

  if (inRangeFiles.length !== 12) {
    errors.push(`expected exactly 12 migration files in the 0011-0022 range, found ${inRangeFiles.length}`);
  }

  for (const filename of EXPECTED_MIGRATION_FILENAMES) {
    if (!actualSet.has(filename)) continue; // already reported as missing above
    let contents;
    try {
      contents = readFileSync(resolve(dir, filename));
    } catch (error) {
      errors.push(`could not read ${filename}: ${error instanceof Error ? error.message : String(error)}`);
      continue;
    }
    const actualHash = sha256(contents);
    const expectedHash = PINNED_MIGRATION_HASHES[filename];
    if (actualHash !== expectedHash) {
      errors.push(`hash mismatch for ${filename}: expected ${expectedHash}, computed ${actualHash}`);
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Given a remote pending-migration list (e.g. filenames or bare 4-digit ids
 * such as ['0011_trust_cases.sql', ...] or ['0011', '0012', ...]), verifies
 * it is EXACTLY {0011..0022} -- rejecting any extra or missing migration.
 * Returns { valid, errors }.
 */
export function assertPendingLedgerExactly(pendingList) {
  const errors = [];
  if (!Array.isArray(pendingList)) {
    return { valid: false, errors: ['pending migration list must be an array'] };
  }

  const normalize = (entry) => {
    const raw = String(entry ?? '').trim();
    // Accept either a bare 4-digit id ("0011") or a full filename
    // ("0011_trust_cases.sql"); normalize both to the 4-digit id.
    const match = raw.match(/^(\d{4})/);
    return match ? match[1] : raw;
  };

  const normalizedPending = pendingList.map(normalize);
  const pendingSet = new Set(normalizedPending);

  if (pendingSet.size !== normalizedPending.length) {
    errors.push('pending migration list contains duplicate entries');
  }

  const expectedSet = new Set(EXPECTED_MIGRATION_IDS);
  const extra = [...pendingSet].filter((id) => !expectedSet.has(id)).sort();
  const missing = EXPECTED_MIGRATION_IDS.filter((id) => !pendingSet.has(id)).sort();

  if (extra.length > 0) {
    errors.push(`pending migration list contains migrations outside the 0011-0022 boundary: ${extra.join(', ')}`);
  }
  if (missing.length > 0) {
    errors.push(`pending migration list is missing required migrations: ${missing.join(', ')}`);
  }

  return { valid: errors.length === 0, errors };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const result = checkOpsMigrationBoundary();
  if (result.valid) {
    console.log(`PASS: migrations-pcd-ops/ contains exactly the pinned 0011-0022 boundary (${EXPECTED_MIGRATION_FILENAMES.length} files, all hashes match).`);
  } else {
    console.error('FAIL: PCD ops migration boundary check failed:');
    for (const error of result.errors) console.error(`- ${error}`);
    process.exitCode = 1;
  }
}
