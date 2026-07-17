#!/usr/bin/env node
/**
 * Retrieve one immutable recovery batch from the independent offsite bucket
 * using the read-only recovery-verifier identity, verify every object's
 * SHA-256 against the trusted local manifest, and restore each D1 SQL
 * export into an isolated, disposable local SQLite database -- implementing
 * Plan 016 steps 7-8 (retrieval proof and local recovery rehearsal).
 *
 * This script performs NO network action by default. It always prints a
 * dry-run retrieval plan first. It only downloads when invoked with
 * --confirm, and it only ever calls GetObject (never PutObject, never
 * DeleteObject) -- consistent with the recovery-verifier identity being
 * read-only per Plan 016.
 *
 * Because offsite-backup-upload.mjs writes every object under a unique
 * per-run key prefix (see its deriveRunPrefix), this script does not
 * re-derive keys from the manifest alone. It requires --receipt, the JSON
 * run receipt written by that upload run, which records the exact key and
 * VersionId for every object. Every artifact in the receipt is cross-checked
 * against the trusted local manifest's sha256/bytes before anything is
 * downloaded (see validateReceiptMatchesManifest) and every GetObject is
 * pinned to the receipt's VersionId, so this can never fetch the wrong
 * version even if the bucket has since been written to again.
 *
 * D1 export restore reuses the existing, already-reviewed restore-and-prove
 * logic in scripts/prove-d1-restore.py rather than re-implementing SQL
 * execution and PRAGMA integrity/foreign-key checks in JavaScript. Each
 * restore target is a brand-new SQLite file under the OS temp directory
 * (os.tmpdir(), not a hardcoded /tmp -- this script must also work on
 * Windows) on this VM (never under the mounted repo, which blocks deletion)
 * so the operator can safely remove the whole working directory afterward.
 *
 * Restore is MANDATORY for every d1_export artifact on a --confirm run:
 * there is no flag to skip it and no code path that can report
 * `all_verified: true` for a d1_export artifact without the SQLite restore
 * and PRAGMA integrity_check / foreign_key_check actually having run (see
 * verifyArtifactResult).
 *
 * ---------------------------------------------------------------------------
 * Environment variable contract (recovery-verifier identity -- read-only:
 * GetObject/ListObject only, no write, no delete, no retention change):
 *
 *   OFFSITE_RECOVERY_BUCKET              required. Source bucket name.
 *   OFFSITE_RECOVERY_REGION              required. e.g. "us-east-1" (AWS) or
 *                                         the B2 region encoded in its endpoint.
 *   OFFSITE_RECOVERY_ACCESS_KEY_ID       required. Recovery-verifier access key.
 *   OFFSITE_RECOVERY_SECRET_ACCESS_KEY   required. Recovery-verifier secret key.
 *   OFFSITE_RECOVERY_SESSION_TOKEN       optional. AWS STS temporary session token.
 *   OFFSITE_RECOVERY_ENDPOINT            optional. Leave unset for real AWS S3.
 *                                         Set for Backblaze B2, e.g.
 *                                         "https://s3.us-west-004.backblazeb2.com".
 *   OFFSITE_RECOVERY_FORCE_PATH_STYLE    optional. "true" or "false" (default
 *                                         "false").
 *   PYTHON                               optional. Path/name of the Python
 *                                         interpreter used for the restore
 *                                         proof. Defaults to trying "python3"
 *                                         then "python" on PATH (Windows
 *                                         commonly only has "python").
 *
 * This identity is intentionally distinct from the backup-writer identity in
 * offsite-backup-upload.mjs -- never reuse backup-writer credentials here.
 * Never echo the values of *_ACCESS_KEY_ID, *_SECRET_ACCESS_KEY, or
 * *_SESSION_TOKEN. This script never logs them.
 * ---------------------------------------------------------------------------
 */
import { createHash } from 'node:crypto';
import { createWriteStream, readFileSync } from 'node:fs';
import { mkdir, mkdtemp, readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const ARTIFACT_EXTENSIONS = {
  d1_export: '.sql',
  r2_inventory: '.ndjson',
  r2_payload_manifest: '.ndjson',
  recovery_document: '.txt',
};

function fail(message) {
  console.error(`offsite-backup-retrieve-verify: ${message}`);
  process.exitCode = 1;
}

function parseCli(argv) {
  const options = { confirm: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--manifest') options.manifestPath = argv[++i];
    else if (arg === '--receipt') options.receiptPath = argv[++i];
    else if (arg === '--confirm') options.confirm = true;
    else if (arg === '--help' || arg === '-h') options.help = true;
    else throw new Error(`unknown argument: ${arg}`);
  }
  return options;
}

function printHelp() {
  console.log(
    'usage: node scripts/offsite-backup-retrieve-verify.mjs --manifest <path/to/trusted/manifest.json> ' +
      '--receipt <path/to/receipt-from-upload.json> [--confirm]\n\n' +
      'Dry-run by default: prints the retrieval plan (objects, expected hashes) and touches nothing.\n' +
      'Pass --confirm to actually download and verify. Every downloaded object is fetched by the exact\n' +
      'key + VersionId recorded in --receipt. Downloaded D1 exports are ALWAYS restored into an isolated\n' +
      "SQLite database under the OS temp directory and checked with PRAGMA integrity_check /\n" +
      'foreign_key_check -- restore cannot be skipped; there is no flag for that.\n' +
      'See scripts/OFFSITE-RECOVERY-RUNBOOK.md for the full environment variable contract.',
  );
}

// ---------------------------------------------------------------------------
// Pure / injectable functions (exported for tests -- no network, no real AWS
// SDK required to exercise any of this).
// ---------------------------------------------------------------------------

export function validateArtifactId(id) {
  if (typeof id !== 'string' || id.length === 0) {
    throw new Error('artifact id must be a non-empty string');
  }
  if (id.includes('/') || id.includes('\\') || id.includes('..') || id.startsWith('.')) {
    throw new Error(`unsafe artifact id (possible path traversal): ${id}`);
  }
  return id;
}

export function validateManifest(manifest) {
  if (!manifest || typeof manifest !== 'object') {
    throw new Error('manifest must be a JSON object');
  }
  if (manifest.schema_version !== 1) {
    throw new Error('manifest schema_version must be 1');
  }
  if (typeof manifest.batch_id !== 'string' || manifest.batch_id.length === 0) {
    throw new Error('manifest is missing batch_id');
  }
  if (manifest.batch_id.includes('/') || manifest.batch_id.includes('\\') || manifest.batch_id.includes('..')) {
    throw new Error(`unsafe batch_id (possible path traversal): ${manifest.batch_id}`);
  }
  if (!Array.isArray(manifest.artifacts) || manifest.artifacts.length === 0) {
    throw new Error('manifest is missing batch_id or artifacts');
  }
  for (const artifact of manifest.artifacts) {
    validateArtifactId(artifact?.id);
    if (!ARTIFACT_EXTENSIONS[artifact?.type]) {
      throw new Error(`unknown artifact type: ${artifact?.type}`);
    }
    if (!Number.isInteger(artifact.bytes) || artifact.bytes < 0) {
      throw new Error(`artifact ${artifact.type}:${artifact.id} has an invalid bytes value`);
    }
    if (typeof artifact.sha256 !== 'string' || !/^[a-f0-9]{64}$/.test(artifact.sha256)) {
      throw new Error(`artifact ${artifact.type}:${artifact.id} has an invalid sha256 value`);
    }
  }
  return manifest;
}

export function parseManifestJson(raw) {
  let manifest;
  try {
    manifest = JSON.parse(raw);
  } catch (error) {
    throw new Error(`manifest is not valid JSON: ${error instanceof Error ? error.message : String(error)}`);
  }
  return validateManifest(manifest);
}

export function computeManifestSha256(raw) {
  return createHash('sha256').update(raw).digest('hex');
}

/**
 * Cross-checks a run receipt (written by offsite-backup-upload.mjs) against
 * the trusted local manifest and returns the download plan (key + VersionId
 * per artifact). Throws on any mismatch, missing entry, missing VersionId,
 * or an object the receipt itself recorded as not successfully created --
 * this is the "manifest/path validation" gate before any network call.
 */
export function validateReceiptMatchesManifest(manifest, receipt) {
  if (!receipt || typeof receipt !== 'object') throw new Error('receipt must be a JSON object');
  if (receipt.schema_version !== 1) throw new Error('receipt schema_version must be 1');
  if (receipt.batch_id !== manifest.batch_id) {
    throw new Error(`receipt batch_id (${receipt.batch_id}) does not match manifest batch_id (${manifest.batch_id})`);
  }
  if (typeof receipt.run_prefix !== 'string' || receipt.run_prefix.length === 0) {
    throw new Error('receipt is missing run_prefix');
  }
  if (!Array.isArray(receipt.objects)) throw new Error('receipt is missing objects');

  const byArtifactKey = new Map(receipt.objects.filter((o) => o.type !== 'manifest').map((o) => [`${o.type}:${o.id}`, o]));
  const plan = [];
  for (const artifact of manifest.artifacts) {
    validateArtifactId(artifact.id);
    const entry = byArtifactKey.get(`${artifact.type}:${artifact.id}`);
    if (!entry) throw new Error(`receipt has no record for artifact ${artifact.type}:${artifact.id}`);
    if (entry.sha256 !== artifact.sha256) {
      throw new Error(`receipt sha256 for ${artifact.type}:${artifact.id} does not match the trusted manifest`);
    }
    if (!entry.created || !entry.version_id) {
      throw new Error(`receipt records artifact ${artifact.type}:${artifact.id} as not successfully created; refusing to trust it for retrieval`);
    }
    const extension = ARTIFACT_EXTENSIONS[artifact.type];
    if (!entry.key || !entry.key.endsWith(`${artifact.type}-${artifact.id}${extension}`)) {
      throw new Error(`receipt key for ${artifact.type}:${artifact.id} does not match the expected naming convention`);
    }
    plan.push({
      id: artifact.id,
      type: artifact.type,
      key: entry.key,
      version_id: entry.version_id,
      bytes_expected: artifact.bytes,
      sha256_expected: artifact.sha256,
    });
  }
  const manifestEntry = receipt.objects.find((o) => o.type === 'manifest');
  if (!manifestEntry || !manifestEntry.created || !manifestEntry.version_id) {
    throw new Error('receipt does not record a successfully created manifest object');
  }
  return { plan, manifestKey: manifestEntry.key, manifestVersionId: manifestEntry.version_id };
}

export function verifyHash(expectedSha256, actualSha256) {
  return typeof expectedSha256 === 'string' && expectedSha256.length === 64 && expectedSha256 === actualSha256;
}

/**
 * Whether a given artifact's outcome is genuinely verified. For d1_export
 * artifacts there is NO path to `true` unless `restore` is present and its
 * integrity/foreign-key checks actually passed -- restore can never be
 * skipped or implied.
 */
export function verifyArtifactResult({ type, hashVerified, restore }) {
  if (!hashVerified) return false;
  if (type === 'd1_export') {
    if (!restore) return false;
    return Boolean(restore.ok && restore.integrity_check === 'ok' && restore.foreign_key_violation_count === 0);
  }
  return true;
}

/** Resolves the python interpreter: PYTHON env var, else python3, else python. Testable via injected spawnFn. */
export function resolvePythonCommand({ env = process.env, spawnFn = spawnSync } = {}) {
  if (env.PYTHON) return env.PYTHON;
  for (const candidate of ['python3', 'python']) {
    let probe;
    try {
      probe = spawnFn(candidate, ['--version'], { encoding: 'utf8' });
    } catch {
      probe = null;
    }
    if (probe && !probe.error && probe.status === 0) return candidate;
  }
  throw new Error('could not find a Python interpreter (tried python3, python); set the PYTHON environment variable to override');
}

// ---------------------------------------------------------------------------
// Filesystem / process helpers (impure, but no network).
// ---------------------------------------------------------------------------

async function loadManifest(manifestPath) {
  if (!manifestPath) throw new Error('--manifest <path to the trusted local manifest.json> is required');
  const raw = await readFile(resolve(manifestPath), 'utf8');
  const manifest = parseManifestJson(raw);
  return { manifest, raw, manifestSha256: computeManifestSha256(raw) };
}

async function loadReceipt(receiptPath) {
  if (!receiptPath) throw new Error('--receipt <path to the run receipt written by offsite-backup-upload.mjs --confirm> is required');
  const raw = await readFile(resolve(receiptPath), 'utf8').catch((error) => {
    throw new Error(`could not read receipt at ${receiptPath}: ${error.message}`);
  });
  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new Error(`receipt is not valid JSON: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function requireEnv(names) {
  const missing = names.filter((name) => !process.env[name]);
  if (missing.length) throw new Error(`missing required environment variable(s): ${missing.join(', ')}`);
  return Object.fromEntries(names.map((name) => [name, process.env[name]]));
}

async function loadRetrieveSdk() {
  try {
    return await import('@aws-sdk/client-s3');
  } catch (error) {
    throw new Error(
      '@aws-sdk/client-s3 is not installed in this project. Run: npm install @aws-sdk/client-s3 ' +
        `(underlying error: ${error instanceof Error ? error.message : 'unknown'})`,
    );
  }
}

function buildS3Client(sdk, env) {
  const forcePathStyle = (process.env.OFFSITE_RECOVERY_FORCE_PATH_STYLE ?? 'false').toLowerCase() === 'true';
  return new sdk.S3Client({
    region: env.OFFSITE_RECOVERY_REGION,
    endpoint: process.env.OFFSITE_RECOVERY_ENDPOINT || undefined,
    forcePathStyle,
    credentials: {
      accessKeyId: env.OFFSITE_RECOVERY_ACCESS_KEY_ID,
      secretAccessKey: env.OFFSITE_RECOVERY_SECRET_ACCESS_KEY,
      sessionToken: process.env.OFFSITE_RECOVERY_SESSION_TOKEN || undefined,
    },
  });
}

/** Streams the download to disk AND hashes it incrementally from the same chunks -- never reads the whole export back into memory a second time. */
export async function downloadAndHash({ sdk, client, bucket, key, versionId, destPath, createWriteStreamFn = createWriteStream }) {
  const response = await client.send(new sdk.GetObjectCommand({ Bucket: bucket, Key: key, VersionId: versionId }));
  const hash = createHash('sha256');
  const writeStream = createWriteStreamFn(destPath);
  for await (const chunk of response.Body) {
    hash.update(chunk);
    if (!writeStream.write(chunk)) {
      await new Promise((resolveDrain) => writeStream.once('drain', resolveDrain));
    }
  }
  await new Promise((resolveEnd, rejectEnd) => writeStream.end((error) => (error ? rejectEnd(error) : resolveEnd())));
  return hash.digest('hex');
}

function restoreD1Export(sqlPath, workDir, artifactId, pythonCmd) {
  const dbPath = join(workDir, `${artifactId}.restored.sqlite`);
  const reportPath = join(workDir, `${artifactId}.restore-report.json`);
  const proverScript = resolve(__dirname, 'prove-d1-restore.py');
  const proc = spawnSync(pythonCmd, [proverScript, '--input', sqlPath, '--output', dbPath, '--report', reportPath], {
    encoding: 'utf8',
  });
  const restore = {
    db_path: dbPath,
    report_path: reportPath,
    python_command: pythonCmd,
    exit_code: proc.status,
    ok: proc.status === 0,
  };
  if (proc.status !== 0) {
    restore.stderr = (proc.stderr ?? '').slice(0, 4000);
    return restore;
  }
  try {
    const report = JSON.parse(readFileSync(reportPath, 'utf8'));
    restore.integrity_check = report.integrity_check;
    restore.foreign_key_violation_count = report.foreign_key_violation_count;
    restore.table_counts = report.table_counts;
  } catch (error) {
    restore.report_parse_error = error instanceof Error ? error.message : String(error);
    restore.ok = false;
  }
  return restore;
}

async function main() {
  const options = parseCli(process.argv.slice(2));
  if (options.help) return printHelp();

  const { manifest, manifestSha256: trustedManifestSha256 } = await loadManifest(options.manifestPath);
  const receipt = await loadReceipt(options.receiptPath);
  const { plan, manifestKey, manifestVersionId } = validateReceiptMatchesManifest(manifest, receipt);

  if (!options.confirm) {
    console.log(
      JSON.stringify(
        {
          dry_run: true,
          batch_id: manifest.batch_id,
          run_prefix: receipt.run_prefix,
          bucket: process.env.OFFSITE_RECOVERY_BUCKET ?? '(OFFSITE_RECOVERY_BUCKET not set)',
          endpoint: process.env.OFFSITE_RECOVERY_ENDPOINT || '(default AWS S3 endpoint)',
          object_count: plan.length + 1,
          objects: [...plan, { id: 'manifest', type: 'manifest', key: manifestKey, version_id: manifestVersionId, bytes_expected: null, sha256_expected: trustedManifestSha256 }],
          restore_planned: true,
          restore_mandatory: true,
        },
        null,
        2,
      ),
    );
    console.error('\nDry run only. No network call was made. Re-run with --confirm to download and verify.');
    return;
  }

  const env = requireEnv([
    'OFFSITE_RECOVERY_BUCKET',
    'OFFSITE_RECOVERY_REGION',
    'OFFSITE_RECOVERY_ACCESS_KEY_ID',
    'OFFSITE_RECOVERY_SECRET_ACCESS_KEY',
  ]);
  const sdk = await loadRetrieveSdk();
  const client = buildS3Client(sdk, env);
  const pythonCmd = resolvePythonCommand();

  const workDir = await mkdtemp(join(tmpdir(), 'pcd-offsite-verify-'));
  await mkdir(workDir, { recursive: true });

  const results = [];
  let allVerified = true;

  for (const item of plan) {
    const destPath = join(workDir, `${item.type}-${item.id}${ARTIFACT_EXTENSIONS[item.type]}`);
    let downloadError = null;
    let sha256Actual = null;
    try {
      sha256Actual = await downloadAndHash({ sdk, client, bucket: env.OFFSITE_RECOVERY_BUCKET, key: item.key, versionId: item.version_id, destPath });
    } catch (error) {
      downloadError = error instanceof Error ? error.message : String(error);
    }
    const hashVerified = !downloadError && verifyHash(item.sha256_expected, sha256Actual);

    let restore = null;
    if (!downloadError && hashVerified && item.type === 'd1_export') {
      restore = restoreD1Export(destPath, workDir, item.id, pythonCmd);
    }
    const verified = verifyArtifactResult({ type: item.type, hashVerified, restore });
    if (!verified) allVerified = false;

    results.push({
      id: item.id,
      type: item.type,
      key: item.key,
      version_id: item.version_id,
      local_path: downloadError ? null : destPath,
      sha256_expected: item.sha256_expected,
      sha256_actual: sha256Actual,
      hash_verified: hashVerified,
      download_error: downloadError,
      restore,
      verified,
    });
  }

  const manifestDestPath = join(workDir, 'manifest.json');
  let manifestDownloadError = null;
  let manifestSha256Actual = null;
  try {
    manifestSha256Actual = await downloadAndHash({
      sdk,
      client,
      bucket: env.OFFSITE_RECOVERY_BUCKET,
      key: manifestKey,
      versionId: manifestVersionId,
      destPath: manifestDestPath,
    });
  } catch (error) {
    manifestDownloadError = error instanceof Error ? error.message : String(error);
  }
  const manifestVerified = !manifestDownloadError && verifyHash(trustedManifestSha256, manifestSha256Actual);
  if (!manifestVerified) allVerified = false;

  const finalResult = {
    dry_run: false,
    batch_id: manifest.batch_id,
    run_prefix: receipt.run_prefix,
    bucket: env.OFFSITE_RECOVERY_BUCKET,
    work_dir: workDir,
    manifest_verified: manifestVerified,
    manifest_download_error: manifestDownloadError,
    all_verified: allVerified,
    results,
  };
  console.log(JSON.stringify(finalResult, null, 2));
  console.error(
    `\nTemporary downloads and restored SQLite databases are under ${workDir} on this machine's OS temp directory. ` +
      'That path is not on the mounted repo, so it is safe to remove when you are done reviewing it.',
  );
  if (!allVerified) {
    fail('one or more objects failed hash verification or restore integrity checks');
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    fail(error instanceof Error ? error.message : String(error));
  });
}
