#!/usr/bin/env node
/**
 * Create a privacy-safe, provider-neutral manifest for one immutable recovery
 * batch. It performs no export, upload, credential lookup, or remote action.
 *
 * The manifest deliberately records only a stable artifact identifier, class,
 * byte count, and SHA-256. It never records source paths, R2 object names,
 * database rows, or credentials. The output remains under ignored backups/.
 */
import { createHash } from 'node:crypto';
import { lstat, mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const ARTIFACT_TYPES = new Map([
  ['d1_export', 'sql'],
  ['r2_inventory', 'ndjson'],
  ['r2_payload_manifest', 'ndjson'],
  ['recovery_document', 'text'],
]);

const BATCH_ID = /^[A-Za-z0-9][A-Za-z0-9._-]{2,127}$/;
const ARTIFACT_ID = /^[a-z][a-z0-9_-]{1,80}$/;

function fail(message) {
  throw new Error(message);
}

export function parseArtifactSpec(value) {
  const separator = value.indexOf('=');
  if (separator < 1 || separator === value.length - 1) {
    fail('artifact must use type:id=path syntax');
  }
  const [type, id, ...extra] = value.slice(0, separator).split(':');
  if (extra.length || !ARTIFACT_TYPES.has(type) || !ARTIFACT_ID.test(id ?? '')) {
    fail(`invalid artifact declaration: ${value.slice(0, separator)}`);
  }
  return { type, id, path: value.slice(separator + 1) };
}

async function fingerprintArtifact(spec) {
  const source = resolve(spec.path);
  const stat = await lstat(source).catch(() => null);
  if (!stat?.isFile() || stat.isSymbolicLink()) {
    fail(`artifact ${spec.type}:${spec.id} must name a regular file`);
  }
  const contents = await readFile(source);
  if (contents.byteLength === 0) fail(`artifact ${spec.type}:${spec.id} is empty`);
  return {
    id: spec.id,
    type: spec.type,
    format: ARTIFACT_TYPES.get(spec.type),
    bytes: contents.byteLength,
    sha256: createHash('sha256').update(contents).digest('hex'),
  };
}

export async function buildRecoveryBatchManifest({ batchId, artifactSpecs, now = () => new Date() }) {
  if (!BATCH_ID.test(batchId ?? '')) fail('batch id must be 3-128 safe filename characters');
  if (!Array.isArray(artifactSpecs) || artifactSpecs.length === 0) fail('at least one artifact is required');
  const parsed = artifactSpecs.map(parseArtifactSpec);
  const keys = parsed.map(({ type, id }) => `${type}:${id}`);
  if (new Set(keys).size !== keys.length) fail('artifact type/id values must be unique within a batch');

  const artifacts = await Promise.all(parsed.map(fingerprintArtifact));
  artifacts.sort((a, b) => `${a.type}:${a.id}`.localeCompare(`${b.type}:${b.id}`));
  return {
    schema_version: 1,
    batch_id: batchId,
    created_at: now().toISOString(),
    artifact_count: artifacts.length,
    total_bytes: artifacts.reduce((total, artifact) => total + artifact.bytes, 0),
    artifacts,
    safety_boundary: {
      provider_upload_attempted: false,
      credentials_read: false,
      source_paths_recorded: false,
      object_names_recorded: false,
    },
  };
}

export async function writeRecoveryBatchManifest({ batchId, artifactSpecs, repoRoot = process.cwd(), now }) {
  const manifest = await buildRecoveryBatchManifest({ batchId, artifactSpecs, now });
  const backupRoot = resolve(repoRoot, 'backups');
  const output = resolve(backupRoot, 'recovery', batchId, 'manifest.json');
  if (!output.startsWith(`${backupRoot}\\`) && !output.startsWith(`${backupRoot}/`)) {
    fail('recovery manifest output escaped the ignored backups directory');
  }
  await mkdir(resolve(output, '..'), { recursive: true });
  await writeFile(output, `${JSON.stringify(manifest, null, 2)}\n`, { encoding: 'utf8', flag: 'wx' });
  return { manifest, output };
}

function parseCli(args) {
  let batchId;
  const artifactSpecs = [];
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--batch-id') batchId = args[++index];
    else if (arg === '--artifact') artifactSpecs.push(args[++index] ?? '');
    else if (arg === '--help' || arg === '-h') return { help: true };
    else fail(`unknown argument: ${arg}`);
  }
  return { batchId, artifactSpecs };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const options = parseCli(process.argv.slice(2));
    if (options.help) {
      console.log('usage: node scripts/build-recovery-batch-manifest.mjs --batch-id <id> --artifact <type:id=path> [--artifact ...]');
      console.log('types: d1_export, r2_inventory, r2_payload_manifest, recovery_document');
      process.exit(0);
    }
    const { manifest, output } = await writeRecoveryBatchManifest(options);
    console.log(JSON.stringify({ batch_id: manifest.batch_id, artifact_count: manifest.artifact_count, total_bytes: manifest.total_bytes, manifest: output }, null, 2));
  } catch (error) {
    console.error(`Recovery manifest was not created: ${error instanceof Error ? error.message : 'unknown error'}`);
    process.exitCode = 1;
  }
}
