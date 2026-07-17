#!/usr/bin/env node
/**
 * Upload one immutable recovery batch to an independent, provider-neutral
 * S3-compatible offsite bucket (AWS S3 or Backblaze B2) with Object Lock
 * retention. Implements Plan 016 step 7 (first batch upload) and the
 * repeatable upload half of the three-proving-run cycle.
 *
 * This script performs NO action by default. It always builds and prints a
 * dry-run plan (objects, sizes, hashes, retention). It only touches the
 * network when invoked with --confirm, and only ever calls PutObject
 * (multipart, streamed) plus a streamed read-back GetObject and a HeadObject
 * retention check -- it never deletes, never shortens retention, and never
 * lists or touches any object outside this batch.
 *
 * It reads the exact manifest shape emitted by build-recovery-batch-manifest.mjs:
 *   { schema_version, batch_id, created_at, artifact_count, total_bytes,
 *     artifacts: [{ id, type, format, bytes, sha256 }], safety_boundary }
 *
 * That manifest deliberately omits source file paths (see RECOVERY-BATCH.md),
 * so this script locates each artifact's bytes on disk by convention:
 *   <sources-dir>/<id>.<extension-for-type>
 * matching the layout backup-pcd-recovery-batch.ps1 already writes to
 * backups/recovery/<batch-id>/sources/. Pass --sources-dir to override.
 *
 * Credentials, endpoint, bucket, retention, and Object Lock mode come ONLY
 * from environment variables (never from CLI flags, never logged). See the
 * "Environment variable contract" block below and
 * scripts/OFFSITE-RECOVERY-RUNBOOK.md for the full contract and both
 * provider setups (AWS S3 recovery account, Backblaze B2).
 *
 * ---------------------------------------------------------------------------
 * Create-only protection and versioning:
 *
 * Every run gets a unique key prefix derived from the batch id, the trusted
 * manifest's SHA-256, and a single run timestamp captured once in main() (see
 * deriveRunPrefix -- it takes the timestamp as an explicit parameter, it never
 * calls Date.now()/new Date() internally, which is also what makes it
 * testable). On top of that, every PutObject additionally sets
 * `IfNoneMatch: '*'` so S3 itself refuses to complete the write if an object
 * already exists at that exact key -- belt and suspenders against ever
 * silently overwriting an existing object version.
 *
 * After every successful upload this script reads back the object's
 * `VersionId` and immediately calls HeadObject with that VersionId to assert
 * the actual ObjectLockMode/ObjectLockRetainUntilDate match what was
 * requested (see verifyObjectLockRetention/compareRetention). Every object's
 * key + VersionId + retention + hash outcome is written to a JSON "run
 * receipt" file (see --receipt-out) that offsite-backup-retrieve-verify.mjs
 * requires as its source of truth for exactly which object versions to
 * fetch back.
 *
 * ---------------------------------------------------------------------------
 * Environment variable contract (backup-writer identity -- PutObject only;
 * must NOT be able to delete objects or shorten/remove retention):
 *
 *   OFFSITE_BACKUP_BUCKET              required. Destination bucket name.
 *   OFFSITE_BACKUP_REGION              required. e.g. "us-east-1" (AWS) or
 *                                       the B2 region encoded in its endpoint,
 *                                       e.g. "us-west-004".
 *   OFFSITE_BACKUP_ACCESS_KEY_ID       required. Backup-writer access key.
 *   OFFSITE_BACKUP_SECRET_ACCESS_KEY   required. Backup-writer secret key.
 *   OFFSITE_BACKUP_SESSION_TOKEN       optional. AWS STS temporary session token.
 *   OFFSITE_BACKUP_ENDPOINT            optional. Leave unset for real AWS S3.
 *                                       Set for Backblaze B2, e.g.
 *                                       "https://s3.us-west-004.backblazeb2.com".
 *   OFFSITE_BACKUP_FORCE_PATH_STYLE    optional. "true" or "false" (default
 *                                       "false"). Set "true" for most
 *                                       B2-compatible endpoints.
 *   OFFSITE_BACKUP_PREFIX              optional. Key prefix under the bucket
 *                                       root, e.g. "pcd-recovery". Default "".
 *   OFFSITE_BACKUP_RETENTION_DAYS      optional. Integer days. Default 90
 *                                       (Plan 016 daily retention default).
 *   OFFSITE_BACKUP_OBJECT_LOCK_MODE    optional. "COMPLIANCE" or "GOVERNANCE".
 *                                       Default "COMPLIANCE" (Plan 016
 *                                       recommendation -- prevents even the
 *                                       bucket owner from shortening retention).
 *
 * Never echo the values of *_ACCESS_KEY_ID, *_SECRET_ACCESS_KEY, or
 * *_SESSION_TOKEN. This script never logs them and never includes them in
 * the JSON plan/result it prints.
 * ---------------------------------------------------------------------------
 */
import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { dirname, join, resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';

export const ARTIFACT_EXTENSIONS = {
  d1_export: '.sql',
  r2_inventory: '.ndjson',
  r2_payload_manifest: '.ndjson',
  recovery_document: '.txt',
};

function fail(message) {
  console.error(`offsite-backup-upload: ${message}`);
  process.exitCode = 1;
}

function parseCli(argv) {
  const options = { confirm: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--manifest') options.manifestPath = argv[++i];
    else if (arg === '--sources-dir') options.sourcesDir = argv[++i];
    else if (arg === '--receipt-out') options.receiptOutPath = argv[++i];
    else if (arg === '--confirm') options.confirm = true;
    else if (arg === '--help' || arg === '-h') options.help = true;
    else throw new Error(`unknown argument: ${arg}`);
  }
  return options;
}

function printHelp() {
  console.log(
    'usage: node scripts/offsite-backup-upload.mjs --manifest <path/to/manifest.json> [--sources-dir <dir>] ' +
      '[--receipt-out <path>] [--confirm]\n\n' +
      'Dry-run by default: prints the upload plan (objects, sizes, hashes, retention) and touches nothing.\n' +
      'Pass --confirm to perform the actual streamed upload, Object Lock verification, and read-back hash\n' +
      'verification. Every uploaded object uses a unique per-run key and IfNoneMatch create-only protection,\n' +
      'and the run writes a JSON receipt (key + VersionId per object) required by\n' +
      'offsite-backup-retrieve-verify.mjs.\n' +
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
 * Derives a unique per-run key prefix from the batch id, the trusted
 * manifest's SHA-256, and a timestamp that MUST be passed in by the caller
 * (main() captures `new Date()` once and threads it through) -- this
 * function itself never reaches for the clock, which is what makes it
 * deterministic and testable.
 */
export function deriveRunPrefix({ batchId, manifestSha256, timestamp }) {
  if (typeof batchId !== 'string' || batchId.length === 0) {
    throw new Error('deriveRunPrefix requires batchId');
  }
  if (typeof manifestSha256 !== 'string' || manifestSha256.length < 12) {
    throw new Error('deriveRunPrefix requires manifestSha256');
  }
  if (!timestamp) {
    throw new Error('deriveRunPrefix requires an explicit timestamp (pass it in; it never reads the clock itself)');
  }
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    throw new Error('deriveRunPrefix received an invalid timestamp');
  }
  const stamp = date.toISOString().replace(/[:]/g, '').replace(/\.\d+Z$/, 'Z');
  return `${batchId}-${manifestSha256.slice(0, 12)}-${stamp}`;
}

export function objectKeyFor(envPrefix, runPrefix, artifact) {
  const extension = ARTIFACT_EXTENSIONS[artifact.type];
  if (!extension) throw new Error(`unknown artifact type: ${artifact.type}`);
  validateArtifactId(artifact.id);
  if (typeof runPrefix !== 'string' || runPrefix.length === 0) {
    throw new Error('objectKeyFor requires a non-empty runPrefix (see deriveRunPrefix)');
  }
  const parts = [envPrefix, runPrefix, `${artifact.type}-${artifact.id}${extension}`].filter((part) => part && part.length > 0);
  return parts.join('/');
}

export function manifestKeyFor(envPrefix, runPrefix) {
  if (typeof runPrefix !== 'string' || runPrefix.length === 0) {
    throw new Error('manifestKeyFor requires a non-empty runPrefix');
  }
  return [envPrefix, runPrefix, 'manifest.json'].filter((part) => part && part.length > 0).join('/');
}

/** True when an S3 error is the conditional-write rejection from IfNoneMatch: '*'. */
export function isCreateOnlyConflict(error) {
  const status = error?.$metadata?.httpStatusCode;
  const code = error?.Code || error?.code;
  const name = error?.name;
  return status === 412 || name === 'PreconditionFailed' || code === 'PreconditionFailed';
}

export function compareRetention(expected, actual) {
  const errors = [];
  if (!actual || actual.mode !== expected.mode) {
    errors.push(`ObjectLockMode mismatch: expected ${expected.mode}, got ${actual?.mode ?? 'null'}`);
  }
  const expectedMs = expected.retainUntil instanceof Date ? expected.retainUntil.getTime() : new Date(expected.retainUntil).getTime();
  const actualMs = actual?.retainUntil ? new Date(actual.retainUntil).getTime() : NaN;
  if (Number.isNaN(actualMs) || Math.abs(actualMs - expectedMs) > 60_000) {
    errors.push(
      `ObjectLockRetainUntilDate mismatch: expected ${new Date(expectedMs).toISOString()}, got ${actual?.retainUntil ?? 'null'}`,
    );
  }
  return { ok: errors.length === 0, errors };
}

export function verifyHash(expectedSha256, actualSha256) {
  return typeof expectedSha256 === 'string' && expectedSha256.length === 64 && expectedSha256 === actualSha256;
}

// ---------------------------------------------------------------------------
// Filesystem helpers (impure, but no network).
// ---------------------------------------------------------------------------

async function loadManifest(manifestPath) {
  if (!manifestPath) throw new Error('--manifest <path> is required');
  const raw = await readFile(resolve(manifestPath), 'utf8').catch((error) => {
    throw new Error(`could not read manifest at ${manifestPath}: ${error.message}`);
  });
  const manifest = parseManifestJson(raw);
  return { manifest, raw, manifestSha256: computeManifestSha256(raw) };
}

async function sha256OfFile(path) {
  return new Promise((resolvePromise, rejectPromise) => {
    const hash = createHash('sha256');
    const stream = createReadStream(path);
    stream.on('data', (chunk) => hash.update(chunk));
    stream.on('end', () => resolvePromise(hash.digest('hex')));
    stream.on('error', rejectPromise);
  });
}

async function locateArtifactFile(sourcesDir, artifact) {
  validateArtifactId(artifact.id);
  const extension = ARTIFACT_EXTENSIONS[artifact.type];
  if (!extension) throw new Error(`unknown artifact type: ${artifact.type}`);
  const resolvedSourcesDir = resolve(sourcesDir);
  const candidate = join(resolvedSourcesDir, `${artifact.id}${extension}`);
  if (candidate !== resolvedSourcesDir && !candidate.startsWith(resolvedSourcesDir + sep)) {
    throw new Error(`refusing to read outside sources dir for artifact ${artifact.type}:${artifact.id}`);
  }
  const info = await stat(candidate).catch(() => null);
  if (info?.isFile()) return candidate;
  // Fall back to a case where the exporter used a different but unambiguous
  // extension for the same artifact id (e.g. a .txt recovery_document).
  const entries = await readdir(resolvedSourcesDir).catch(() => []);
  const matches = entries.filter((name) => name === artifact.id || name.startsWith(`${artifact.id}.`));
  if (matches.length === 1) return join(resolvedSourcesDir, matches[0]);
  if (matches.length > 1) {
    throw new Error(`ambiguous local file for artifact ${artifact.type}:${artifact.id} in ${sourcesDir}: ${matches.join(', ')}`);
  }
  throw new Error(`no local file found for artifact ${artifact.type}:${artifact.id} in ${sourcesDir} (expected ${artifact.id}${extension})`);
}

function requireEnv(names) {
  const missing = names.filter((name) => !process.env[name]);
  if (missing.length) throw new Error(`missing required environment variable(s): ${missing.join(', ')}`);
  return Object.fromEntries(names.map((name) => [name, process.env[name]]));
}

// ---------------------------------------------------------------------------
// AWS SDK loading (dynamic + guarded so this module -- and every pure
// function above -- imports cleanly with neither @aws-sdk/client-s3 nor
// @aws-sdk/lib-storage installed; tests never need the real SDK).
// ---------------------------------------------------------------------------

async function loadUploadSdk() {
  try {
    const [clientS3, libStorage] = await Promise.all([import('@aws-sdk/client-s3'), import('@aws-sdk/lib-storage')]);
    return {
      S3Client: clientS3.S3Client,
      GetObjectCommand: clientS3.GetObjectCommand,
      HeadObjectCommand: clientS3.HeadObjectCommand,
      Upload: libStorage.Upload,
    };
  } catch (error) {
    throw new Error(
      '@aws-sdk/client-s3 and @aws-sdk/lib-storage are not installed in this project. ' +
        'Run: npm install @aws-sdk/client-s3 @aws-sdk/lib-storage ' +
        `(underlying error: ${error instanceof Error ? error.message : 'unknown'})`,
    );
  }
}

function buildS3Client(sdk, env) {
  const forcePathStyle = (process.env.OFFSITE_BACKUP_FORCE_PATH_STYLE ?? 'false').toLowerCase() === 'true';
  return new sdk.S3Client({
    region: env.OFFSITE_BACKUP_REGION,
    endpoint: process.env.OFFSITE_BACKUP_ENDPOINT || undefined,
    forcePathStyle,
    credentials: {
      accessKeyId: env.OFFSITE_BACKUP_ACCESS_KEY_ID,
      secretAccessKey: env.OFFSITE_BACKUP_SECRET_ACCESS_KEY,
      sessionToken: process.env.OFFSITE_BACKUP_SESSION_TOKEN || undefined,
    },
  });
}

// ---------------------------------------------------------------------------
// Orchestration steps -- all dependency-injected (sdk/client passed in) so
// tests can supply fakes without the real AWS SDK.
// ---------------------------------------------------------------------------

/**
 * Streams `localPath` up with @aws-sdk/lib-storage's Upload (multipart-aware,
 * never buffers the whole file into memory) and IfNoneMatch: '*' so S3 itself
 * refuses the write if the key already exists. Never overwrites.
 */
export async function uploadArtifactCreateOnly({
  sdk,
  client,
  bucket,
  key,
  localPath,
  contentType = 'application/octet-stream',
  objectLockMode,
  retainUntil,
  createReadStreamFn = createReadStream,
}) {
  const upload = new sdk.Upload({
    client,
    params: {
      Bucket: bucket,
      Key: key,
      Body: createReadStreamFn(localPath),
      IfNoneMatch: '*',
      ObjectLockMode: objectLockMode,
      ObjectLockRetainUntilDate: retainUntil,
      ContentType: contentType,
    },
  });
  try {
    const result = await upload.done();
    return { key, created: true, conflict: false, versionId: result?.VersionId ?? null, error: null };
  } catch (error) {
    if (isCreateOnlyConflict(error)) {
      return {
        key,
        created: false,
        conflict: true,
        versionId: null,
        error: 'refused: an object already exists at this key (create-only / IfNoneMatch protection)',
      };
    }
    throw error;
  }
}

/** Streams the GetObject body straight into a hash without buffering it. */
async function hashReadableStream(readable) {
  const hash = createHash('sha256');
  for await (const chunk of readable) hash.update(chunk);
  return hash.digest('hex');
}

export async function verifyUploadReadBack({ sdk, client, bucket, key, versionId, expectedSha256 }) {
  const response = await client.send(new sdk.GetObjectCommand({ Bucket: bucket, Key: key, VersionId: versionId }));
  const actualSha256 = await hashReadableStream(response.Body);
  return { sha256_actual: actualSha256, verified: verifyHash(expectedSha256, actualSha256) };
}

/**
 * Calls HeadObject with the exact VersionId returned from the upload and
 * asserts the *actual* ObjectLockMode/ObjectLockRetainUntilDate on the object
 * match what was requested. Fails loudly (throws) on any mismatch -- this is
 * never allowed to silently report success.
 */
export async function verifyObjectLockRetention({ sdk, client, bucket, key, versionId, expectedMode, expectedRetainUntil }) {
  const head = await client.send(new sdk.HeadObjectCommand({ Bucket: bucket, Key: key, VersionId: versionId }));
  const actual = { mode: head.ObjectLockMode ?? null, retainUntil: head.ObjectLockRetainUntilDate ?? null };
  const comparison = compareRetention({ mode: expectedMode, retainUntil: expectedRetainUntil }, actual);
  if (!comparison.ok) {
    throw new Error(`Object Lock verification failed for ${key}: ${comparison.errors.join('; ')}`);
  }
  return { ok: true, actual };
}

async function main() {
  const options = parseCli(process.argv.slice(2));
  if (options.help) return printHelp();

  const { manifest, raw: manifestRaw, manifestSha256 } = await loadManifest(options.manifestPath);
  const sourcesDir = resolve(options.sourcesDir ?? join(dirname(resolve(options.manifestPath)), 'sources'));
  const prefix = process.env.OFFSITE_BACKUP_PREFIX ?? '';
  const retentionDays = Number.parseInt(process.env.OFFSITE_BACKUP_RETENTION_DAYS ?? '90', 10);
  if (!Number.isInteger(retentionDays) || retentionDays < 1) {
    throw new Error('OFFSITE_BACKUP_RETENTION_DAYS must be a positive integer when set');
  }
  const objectLockMode = (process.env.OFFSITE_BACKUP_OBJECT_LOCK_MODE ?? 'COMPLIANCE').toUpperCase();
  if (!['COMPLIANCE', 'GOVERNANCE'].includes(objectLockMode)) {
    throw new Error('OFFSITE_BACKUP_OBJECT_LOCK_MODE must be COMPLIANCE or GOVERNANCE');
  }
  const runTimestamp = new Date();
  const retainUntil = new Date(runTimestamp.getTime() + retentionDays * 24 * 60 * 60 * 1000);
  const runPrefix = deriveRunPrefix({ batchId: manifest.batch_id, manifestSha256, timestamp: runTimestamp });

  const plan = [];
  for (const artifact of manifest.artifacts) {
    const localPath = await locateArtifactFile(sourcesDir, artifact);
    const actualSha256 = await sha256OfFile(localPath);
    const info = await stat(localPath);
    if (actualSha256 !== artifact.sha256) {
      throw new Error(
        `local file for artifact ${artifact.type}:${artifact.id} does not match the manifest SHA-256 ` +
          `(manifest ${artifact.sha256}, local file ${actualSha256}). Refusing to upload a batch that does not match its manifest.`,
      );
    }
    if (info.size !== artifact.bytes) {
      throw new Error(`local file for artifact ${artifact.type}:${artifact.id} is ${info.size} bytes, manifest says ${artifact.bytes}`);
    }
    plan.push({
      id: artifact.id,
      type: artifact.type,
      local_path: localPath,
      key: objectKeyFor(prefix, runPrefix, artifact),
      bytes: artifact.bytes,
      sha256: artifact.sha256,
    });
  }
  const manifestKey = manifestKeyFor(prefix, runPrefix);

  const dryRunResult = {
    dry_run: !options.confirm,
    batch_id: manifest.batch_id,
    run_prefix: runPrefix,
    bucket: process.env.OFFSITE_BACKUP_BUCKET ?? '(OFFSITE_BACKUP_BUCKET not set)',
    endpoint: process.env.OFFSITE_BACKUP_ENDPOINT || '(default AWS S3 endpoint)',
    prefix,
    retention_days: retentionDays,
    retention_mode: objectLockMode,
    retain_until: retainUntil.toISOString(),
    object_count: plan.length + 1,
    total_bytes: plan.reduce((sum, item) => sum + item.bytes, 0),
    objects: [...plan.map(({ local_path, ...rest }) => rest), { id: 'manifest', type: 'manifest', key: manifestKey, bytes: manifestRaw.length, sha256: manifestSha256 }],
  };

  if (!options.confirm) {
    console.log(JSON.stringify(dryRunResult, null, 2));
    console.error('\nDry run only. No network call was made. Re-run with --confirm to upload.');
    return;
  }

  const env = requireEnv(['OFFSITE_BACKUP_BUCKET', 'OFFSITE_BACKUP_REGION', 'OFFSITE_BACKUP_ACCESS_KEY_ID', 'OFFSITE_BACKUP_SECRET_ACCESS_KEY']);
  const sdk = await loadUploadSdk();
  const client = buildS3Client(sdk, env);

  const results = [];
  let allVerified = true;

  async function uploadOne(id, type, key, localPath, expectedSha256) {
    const putResult = await uploadArtifactCreateOnly({
      sdk,
      client,
      bucket: env.OFFSITE_BACKUP_BUCKET,
      key,
      localPath,
      objectLockMode,
      retainUntil,
    });
    const item = {
      id,
      type,
      key,
      sha256_expected: expectedSha256,
      created: putResult.created,
      conflict: putResult.conflict,
      version_id: putResult.versionId,
      error: putResult.error,
      retention: null,
      readback: null,
    };
    if (!putResult.created) {
      allVerified = false;
      return item;
    }
    try {
      const retention = await verifyObjectLockRetention({
        sdk,
        client,
        bucket: env.OFFSITE_BACKUP_BUCKET,
        key,
        versionId: putResult.versionId,
        expectedMode: objectLockMode,
        expectedRetainUntil: retainUntil,
      });
      item.retention = { verified: retention.ok, actual: retention.actual };
    } catch (error) {
      item.retention = { verified: false, error: error instanceof Error ? error.message : String(error) };
      allVerified = false;
    }
    const readback = await verifyUploadReadBack({
      sdk,
      client,
      bucket: env.OFFSITE_BACKUP_BUCKET,
      key,
      versionId: putResult.versionId,
      expectedSha256,
    });
    item.readback = readback;
    if (!readback.verified) allVerified = false;
    return item;
  }

  for (const item of plan) {
    results.push(await uploadOne(item.id, item.type, item.key, item.local_path, item.sha256));
  }
  const manifestLocalPath = resolve(options.manifestPath);
  results.push(await uploadOne('manifest', 'manifest', manifestKey, manifestLocalPath, manifestSha256));

  const receipt = {
    schema_version: 1,
    batch_id: manifest.batch_id,
    run_prefix: runPrefix,
    created_at: runTimestamp.toISOString(),
    bucket: env.OFFSITE_BACKUP_BUCKET,
    prefix,
    retention_days: retentionDays,
    retention_mode: objectLockMode,
    retain_until: retainUntil.toISOString(),
    manifest_sha256: manifestSha256,
    all_verified: allVerified,
    objects: results.map((item) => ({
      id: item.id,
      type: item.type,
      key: item.key,
      version_id: item.version_id,
      created: item.created,
      sha256: item.sha256_expected,
    })),
  };
  const receiptOutPath = resolve(options.receiptOutPath ?? join(dirname(resolve(options.manifestPath)), `receipt-${runPrefix}.json`));
  await writeFile(receiptOutPath, `${JSON.stringify(receipt, null, 2)}\n`, 'utf8');

  const finalResult = {
    dry_run: false,
    batch_id: manifest.batch_id,
    run_prefix: runPrefix,
    bucket: env.OFFSITE_BACKUP_BUCKET,
    prefix,
    retention_days: retentionDays,
    retention_mode: objectLockMode,
    retain_until: retainUntil.toISOString(),
    object_count: results.length,
    all_verified: allVerified,
    receipt_path: receiptOutPath,
    results,
  };
  console.log(JSON.stringify(finalResult, null, 2));
  if (!allVerified) {
    fail('one or more uploaded objects failed create-only, Object Lock retention, or read-back hash verification -- see receipt for details');
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    fail(error instanceof Error ? error.message : String(error));
  });
}
