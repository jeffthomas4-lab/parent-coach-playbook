import { createHash } from 'node:crypto';
import { mkdtemp, readFile, readFile as readFileAsync } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Readable } from 'node:stream';
import { describe, expect, it } from 'vitest';

import {
  ARTIFACT_EXTENSIONS,
  compareRetention,
  deriveRunPrefix,
  isCreateOnlyConflict,
  manifestKeyFor,
  objectKeyFor,
  parseManifestJson as parseUploadManifestJson,
  uploadArtifactCreateOnly,
  validateArtifactId as validateUploadArtifactId,
  validateManifest as validateUploadManifest,
  verifyHash as verifyUploadHash,
  verifyObjectLockRetention,
  verifyUploadReadBack,
} from '../scripts/offsite-backup-upload.mjs';

import {
  downloadAndHash,
  parseManifestJson as parseRetrieveManifestJson,
  resolvePythonCommand,
  validateArtifactId as validateRetrieveArtifactId,
  validateManifest as validateRetrieveManifest,
  validateReceiptMatchesManifest,
  verifyArtifactResult,
  verifyHash as verifyRetrieveHash,
} from '../scripts/offsite-backup-retrieve-verify.mjs';

const VALID_SHA256 = 'a'.repeat(64);

function validManifest(overrides = {}) {
  return {
    schema_version: 1,
    batch_id: '2026-07-17-test',
    created_at: '2026-07-17T00:00:00.000Z',
    artifact_count: 1,
    total_bytes: 25,
    artifacts: [{ id: 'activity_radar', type: 'd1_export', format: 'sql', bytes: 25, sha256: VALID_SHA256 }],
    safety_boundary: { provider_upload_attempted: false, source_paths_recorded: false, object_names_recorded: false },
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// 1. Manifest / path validation -- rejects bad, missing, and traversal paths.
// Both scripts carry their own copy of this validation, so exercise both.
// ---------------------------------------------------------------------------
describe('manifest and artifact-path validation', () => {
  for (const [label, validateManifest, validateArtifactId, parseManifestJson] of [
    ['upload script', validateUploadManifest, validateUploadArtifactId, parseUploadManifestJson],
    ['retrieve-verify script', validateRetrieveManifest, validateRetrieveArtifactId, parseRetrieveManifestJson],
  ] as const) {
    describe(label, () => {
      it('rejects a manifest missing batch_id', () => {
        const manifest = validManifest({ batch_id: undefined });
        expect(() => validateManifest(manifest)).toThrow(/batch_id/);
      });

      it('rejects a manifest with no artifacts', () => {
        expect(() => validateManifest(validManifest({ artifacts: [] }))).toThrow(/artifacts/);
      });

      it('rejects the wrong schema_version', () => {
        expect(() => validateManifest(validManifest({ schema_version: 2 }))).toThrow(/schema_version/);
      });

      it('rejects an artifact with an invalid sha256', () => {
        const manifest = validManifest({ artifacts: [{ id: 'x', type: 'd1_export', bytes: 1, sha256: 'not-a-hash' }] });
        expect(() => validateManifest(manifest)).toThrow(/sha256/);
      });

      it('rejects a batch_id that attempts path traversal', () => {
        expect(() => validateManifest(validManifest({ batch_id: '../../etc' }))).toThrow(/traversal/);
      });

      it('rejects an artifact id that attempts path traversal', () => {
        expect(() => validateArtifactId('../../etc/passwd')).toThrow(/traversal/);
        expect(() => validateArtifactId('..')).toThrow(/traversal/);
        expect(() => validateArtifactId('a/b')).toThrow(/traversal/);
        expect(() => validateArtifactId('')).toThrow();
      });

      it('accepts a well-formed manifest and rejects malformed JSON', () => {
        expect(() => validateManifest(validManifest())).not.toThrow();
        expect(() => parseManifestJson('{not json')).toThrow(/not valid JSON/);
      });
    });
  }
});

// ---------------------------------------------------------------------------
// 2. Duplicate-key / create-only behavior -- refuses to overwrite and records
// the conflict rather than crashing or silently succeeding.
// ---------------------------------------------------------------------------
describe('create-only upload protection', () => {
  function fakeSdk({ conflict }: { conflict: boolean }) {
    const capturedParams: any[] = [];
    class FakeUpload {
      params: any;
      constructor({ params }: { params: any }) {
        capturedParams.push(params);
        this.params = params;
      }
      async done() {
        if (conflict) {
          const error: any = new Error('At least one of the pre-conditions you specified did not hold');
          error.name = 'PreconditionFailed';
          error.$metadata = { httpStatusCode: 412 };
          throw error;
        }
        return { VersionId: 'v-123', ETag: '"abc"' };
      }
    }
    return { sdk: { Upload: FakeUpload }, client: {}, capturedParams };
  }

  it('sets IfNoneMatch: "*" and captures the VersionId on a fresh key', async () => {
    const { sdk, client, capturedParams } = fakeSdk({ conflict: false });
    const result = await uploadArtifactCreateOnly({
      sdk,
      client,
      bucket: 'bucket',
      key: 'prefix/run/x.sql',
      localPath: '/dev/null',
      objectLockMode: 'COMPLIANCE',
      retainUntil: new Date('2026-10-15T00:00:00.000Z'),
      createReadStreamFn: () => 'fake-stream' as any,
    });
    expect(result).toEqual({ key: 'prefix/run/x.sql', created: true, conflict: false, versionId: 'v-123', error: null });
    expect(capturedParams[0].IfNoneMatch).toBe('*');
    expect(capturedParams[0].ObjectLockMode).toBe('COMPLIANCE');
  });

  it('refuses and records the conflict instead of overwriting an existing key', async () => {
    const { sdk, client } = fakeSdk({ conflict: true });
    const result = await uploadArtifactCreateOnly({
      sdk,
      client,
      bucket: 'bucket',
      key: 'prefix/run/x.sql',
      localPath: '/dev/null',
      objectLockMode: 'COMPLIANCE',
      retainUntil: new Date('2026-10-15T00:00:00.000Z'),
      createReadStreamFn: () => 'fake-stream' as any,
    });
    expect(result.created).toBe(false);
    expect(result.conflict).toBe(true);
    expect(result.versionId).toBeNull();
    expect(result.error).toMatch(/already exists/);
  });

  it('classifies a 412 PreconditionFailed as a create-only conflict and other errors are not swallowed', () => {
    expect(isCreateOnlyConflict({ name: 'PreconditionFailed', $metadata: { httpStatusCode: 412 } })).toBe(true);
    expect(isCreateOnlyConflict({ name: 'AccessDenied', $metadata: { httpStatusCode: 403 } })).toBe(false);
  });

  it('derives a deterministic, unique-per-run key prefix from explicit inputs rather than reading the clock itself', () => {
    const timestamp = new Date('2026-07-17T12:00:00.000Z');
    const a = deriveRunPrefix({ batchId: 'batch-1', manifestSha256: VALID_SHA256, timestamp });
    const b = deriveRunPrefix({ batchId: 'batch-1', manifestSha256: VALID_SHA256, timestamp });
    expect(a).toBe(b);
    expect(() => deriveRunPrefix({ batchId: 'batch-1', manifestSha256: VALID_SHA256 })).toThrow(/timestamp/);

    const artifact = { id: 'x', type: 'd1_export' as const };
    const keyRunA = objectKeyFor('prefix', a, artifact);
    const keyRunB = objectKeyFor('prefix', deriveRunPrefix({ batchId: 'batch-1', manifestSha256: VALID_SHA256, timestamp: new Date('2026-07-18T00:00:00.000Z') }), artifact);
    expect(keyRunA).not.toBe(keyRunB);
    expect(manifestKeyFor('prefix', a)).toContain(a);
  });

  it('the upload CLI never carries an inline Date.now()/new Date() call inside key derivation', async () => {
    const source = await readFile(new URL('../scripts/offsite-backup-upload.mjs', import.meta.url), 'utf8');
    // deriveRunPrefix itself must not read the clock -- only main() may, once, and thread it through.
    const fnBody = source.slice(source.indexOf('export function deriveRunPrefix'), source.indexOf('export function objectKeyFor'));
    expect(fnBody).not.toMatch(/Date\.now\(\)|new Date\(\)/);
  });
});

// ---------------------------------------------------------------------------
// 3. Object Lock retention verification -- mismatches must fail loudly.
// ---------------------------------------------------------------------------
describe('Object Lock retention verification', () => {
  it('passes when the actual HeadObject retention matches what was requested', () => {
    const retainUntil = new Date('2026-10-15T00:00:00.000Z');
    const comparison = compareRetention({ mode: 'COMPLIANCE', retainUntil }, { mode: 'COMPLIANCE', retainUntil: retainUntil.toISOString() });
    expect(comparison.ok).toBe(true);
    expect(comparison.errors).toEqual([]);
  });

  it('fails when the actual ObjectLockMode differs from what was requested', () => {
    const retainUntil = new Date('2026-10-15T00:00:00.000Z');
    const comparison = compareRetention({ mode: 'COMPLIANCE', retainUntil }, { mode: 'GOVERNANCE', retainUntil: retainUntil.toISOString() });
    expect(comparison.ok).toBe(false);
    expect(comparison.errors.join(' ')).toMatch(/ObjectLockMode mismatch/);
  });

  it('fails when the actual retain-until date is shorter than requested', () => {
    const requested = new Date('2026-10-15T00:00:00.000Z');
    const actualShorter = new Date('2026-08-01T00:00:00.000Z');
    const comparison = compareRetention({ mode: 'COMPLIANCE', retainUntil: requested }, { mode: 'COMPLIANCE', retainUntil: actualShorter.toISOString() });
    expect(comparison.ok).toBe(false);
    expect(comparison.errors.join(' ')).toMatch(/ObjectLockRetainUntilDate mismatch/);
  });

  it('verifyObjectLockRetention throws loudly (does not just return a falsy value) on a mismatch', async () => {
    const retainUntil = new Date('2026-10-15T00:00:00.000Z');
    class FakeHeadObjectCommand {
      input: any;
      constructor(input: any) {
        this.input = input;
      }
    }
    const client = {
      async send(_command: FakeHeadObjectCommand) {
        return { ObjectLockMode: 'GOVERNANCE', ObjectLockRetainUntilDate: retainUntil };
      },
    };
    await expect(
      verifyObjectLockRetention({
        sdk: { HeadObjectCommand: FakeHeadObjectCommand },
        client,
        bucket: 'bucket',
        key: 'k',
        versionId: 'v1',
        expectedMode: 'COMPLIANCE',
        expectedRetainUntil: retainUntil,
      }),
    ).rejects.toThrow(/Object Lock verification failed/);
  });

  it('verifyObjectLockRetention resolves ok:true when Head reports matching retention', async () => {
    const retainUntil = new Date('2026-10-15T00:00:00.000Z');
    class FakeHeadObjectCommand {
      constructor(public input: any) {}
    }
    const client = {
      async send() {
        return { ObjectLockMode: 'COMPLIANCE', ObjectLockRetainUntilDate: retainUntil };
      },
    };
    const result = await verifyObjectLockRetention({
      sdk: { HeadObjectCommand: FakeHeadObjectCommand },
      client,
      bucket: 'bucket',
      key: 'k',
      versionId: 'v1',
      expectedMode: 'COMPLIANCE',
      expectedRetainUntil: retainUntil,
    });
    expect(result.ok).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 4. Retrieval hash verification -- a mismatched SHA-256 must fail, and
// bodies must be streamed/hashed incrementally, never buffered whole.
// ---------------------------------------------------------------------------
describe('retrieval hash verification', () => {
  it('verifyHash rejects a mismatched SHA-256', () => {
    expect(verifyRetrieveHash(VALID_SHA256, VALID_SHA256)).toBe(true);
    expect(verifyRetrieveHash(VALID_SHA256, 'b'.repeat(64))).toBe(false);
    expect(verifyUploadHash(VALID_SHA256, VALID_SHA256)).toBe(true);
    expect(verifyUploadHash(VALID_SHA256, 'b'.repeat(64))).toBe(false);
  });

  it('downloadAndHash streams the body incrementally and its hash matches a real SHA-256 of the bytes', async () => {
    const content = 'the quick brown fox jumps over the lazy dog';
    const expectedSha256 = createHash('sha256').update(content).digest('hex');
    class FakeGetObjectCommand {
      constructor(public input: any) {}
    }
    const client = {
      async send() {
        return { Body: Readable.from([Buffer.from(content)]) };
      },
    };
    const dir = await mkdtemp(join(tmpdir(), 'pcd-offsite-test-'));
    const destPath = join(dir, 'out.sql');
    const actualSha256 = await downloadAndHash({
      sdk: { GetObjectCommand: FakeGetObjectCommand },
      client,
      bucket: 'bucket',
      key: 'k',
      versionId: 'v1',
      destPath,
    });
    expect(actualSha256).toBe(expectedSha256);
    const written = await readFileAsync(destPath, 'utf8');
    expect(written).toBe(content);
  });

  it('a downloaded object whose bytes do not match the manifest SHA-256 is flagged, not silently accepted', async () => {
    class FakeGetObjectCommand {
      constructor(public input: any) {}
    }
    const client = {
      async send() {
        return { Body: Readable.from([Buffer.from('corrupted bytes')]) };
      },
    };
    const dir = await mkdtemp(join(tmpdir(), 'pcd-offsite-test-'));
    const destPath = join(dir, 'out.sql');
    const actualSha256 = await downloadAndHash({
      sdk: { GetObjectCommand: FakeGetObjectCommand },
      client,
      bucket: 'bucket',
      key: 'k',
      versionId: 'v1',
      destPath,
    });
    const hashVerified = verifyRetrieveHash(VALID_SHA256, actualSha256);
    expect(hashVerified).toBe(false);
    // And the mandatory-restore gate must therefore also refuse to say verified.
    expect(verifyArtifactResult({ type: 'd1_export', hashVerified, restore: null })).toBe(false);
  });

  it('verifyUploadReadBack (post-PutObject read-back) also streams and detects a mismatch', async () => {
    class FakeGetObjectCommand {
      constructor(public input: any) {}
    }
    const client = {
      async send() {
        return { Body: Readable.from([Buffer.from('hello')]) };
      },
    };
    const result = await verifyUploadReadBack({
      sdk: { GetObjectCommand: FakeGetObjectCommand },
      client,
      bucket: 'bucket',
      key: 'k',
      versionId: 'v1',
      expectedSha256: VALID_SHA256,
    });
    expect(result.verified).toBe(false);
    expect(result.sha256_actual).toBe(createHash('sha256').update('hello').digest('hex'));
  });
});

// ---------------------------------------------------------------------------
// 5. Mandatory restore -- there is no code path that reports a d1_export
// artifact verified without the SQLite restore + integrity/FK check running,
// and --skip-restore no longer exists anywhere in the script.
// ---------------------------------------------------------------------------
describe('mandatory restore for d1_export artifacts', () => {
  it('never verifies a d1_export artifact when no restore was attempted', () => {
    expect(verifyArtifactResult({ type: 'd1_export', hashVerified: true, restore: null })).toBe(false);
    expect(verifyArtifactResult({ type: 'd1_export', hashVerified: true, restore: undefined })).toBe(false);
  });

  it('verifies a d1_export only when restore succeeded with a clean integrity and zero FK violations', () => {
    expect(
      verifyArtifactResult({
        type: 'd1_export',
        hashVerified: true,
        restore: { ok: true, integrity_check: 'ok', foreign_key_violation_count: 0 },
      }),
    ).toBe(true);
  });

  it('fails when restore ran but integrity_check did not come back clean or FK violations were found', () => {
    expect(
      verifyArtifactResult({
        type: 'd1_export',
        hashVerified: true,
        restore: { ok: true, integrity_check: 'corruption found', foreign_key_violation_count: 0 },
      }),
    ).toBe(false);
    expect(
      verifyArtifactResult({
        type: 'd1_export',
        hashVerified: true,
        restore: { ok: true, integrity_check: 'ok', foreign_key_violation_count: 3 },
      }),
    ).toBe(false);
    expect(
      verifyArtifactResult({
        type: 'd1_export',
        hashVerified: true,
        restore: { ok: false, exit_code: 1 },
      }),
    ).toBe(false);
  });

  it('non-d1 artifacts do not require a restore result', () => {
    expect(verifyArtifactResult({ type: 'r2_inventory', hashVerified: true, restore: null })).toBe(true);
  });

  it('a receipt that recorded an artifact as not created (create-only conflict) is refused by retrieval, never trusted', () => {
    const manifest = validManifest();
    const receipt = {
      schema_version: 1,
      batch_id: manifest.batch_id,
      run_prefix: 'run-1',
      objects: [
        { id: 'activity_radar', type: 'd1_export', key: 'p/run-1/d1_export-activity_radar.sql', version_id: null, created: false, sha256: VALID_SHA256 },
        { id: 'manifest', type: 'manifest', key: 'p/run-1/manifest.json', version_id: 'v-m', created: true },
      ],
    };
    expect(() => validateReceiptMatchesManifest(manifest, receipt)).toThrow(/not successfully created/);
  });

  it('the retrieve-verify script source no longer contains a --skip-restore option anywhere', async () => {
    const source = await readFile(new URL('../scripts/offsite-backup-retrieve-verify.mjs', import.meta.url), 'utf8');
    expect(source).not.toContain('skip-restore');
    expect(source).not.toContain('skipRestore');
    expect(source).not.toContain('SECRET_ENV_NAMES');
  });

  it('the upload script source no longer references the unused SECRET_ENV_NAMES constant', async () => {
    const source = await readFile(new URL('../scripts/offsite-backup-upload.mjs', import.meta.url), 'utf8');
    expect(source).not.toContain('SECRET_ENV_NAMES');
  });

  it('both scripts still default to a dry run and only touch the network with --confirm', async () => {
    const uploadSource = await readFile(new URL('../scripts/offsite-backup-upload.mjs', import.meta.url), 'utf8');
    const retrieveSource = await readFile(new URL('../scripts/offsite-backup-retrieve-verify.mjs', import.meta.url), 'utf8');
    expect(uploadSource).toContain("{ confirm: false }");
    expect(uploadSource).toContain('if (!options.confirm)');
    expect(uploadSource).toContain('Dry run only. No network call was made.');
    expect(retrieveSource).toContain("{ confirm: false }");
    expect(retrieveSource).toContain('if (!options.confirm)');
    expect(retrieveSource).toContain('Dry run only. No network call was made.');
  });
});

// ---------------------------------------------------------------------------
// Windows compatibility: no hardcoded python3/`/tmp`; the interpreter and
// scratch directory are both resolved rather than assumed.
// ---------------------------------------------------------------------------
describe('cross-platform (Windows-safe) retrieval', () => {
  it('resolvePythonCommand honors the PYTHON environment variable override without probing anything', () => {
    const spawnFn = () => {
      throw new Error('should not probe when PYTHON is set');
    };
    expect(resolvePythonCommand({ env: { PYTHON: 'C:\\Python312\\python.exe' }, spawnFn: spawnFn as any })).toBe('C:\\Python312\\python.exe');
  });

  it('resolvePythonCommand falls back from python3 to python based on probe success', () => {
    const calls: string[] = [];
    const spawnFn = (cmd: string) => {
      calls.push(cmd);
      if (cmd === 'python3') return { status: 1, error: null } as any;
      return { status: 0, error: null } as any;
    };
    expect(resolvePythonCommand({ env: {}, spawnFn: spawnFn as any })).toBe('python');
    expect(calls).toEqual(['python3', 'python']);
  });

  it('resolvePythonCommand throws a clear error when neither python3 nor python is found', () => {
    const spawnFn = () => ({ status: 1, error: new Error('not found') }) as any;
    expect(() => resolvePythonCommand({ env: {}, spawnFn: spawnFn as any })).toThrow(/could not find a Python interpreter/);
  });

  it('the retrieve-verify script uses os.tmpdir() rather than a hardcoded /tmp path', async () => {
    const source = await readFile(new URL('../scripts/offsite-backup-retrieve-verify.mjs', import.meta.url), 'utf8');
    expect(source).toContain('tmpdir()');
    expect(source).not.toMatch(/mkdtemp\(\s*['"]\/tmp/);
    expect(source).not.toMatch(/spawnSync\(\s*['"]python3['"]/);
  });
});
