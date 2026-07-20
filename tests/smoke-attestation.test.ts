import { Buffer } from 'node:buffer';
import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import {
  attestationSubjects,
  receiptChecksum,
  verifySmokeAttestation,
} from '../scripts/smoke-attestation.mjs';

const receiptBytes = Buffer.from(JSON.stringify({ schema_version: 2, target: 'production', passed: true }));
const digest = createHash('sha256').update(receiptBytes).digest('hex');

// A GitHub Actions OIDC artifact attestation, shaped like `gh attestation verify --format json`.
const makeAttestation = (sha256: string, { name = 'production-smoke.json', verified = true } = {}) => ({
  verificationResult: { verified },
  statement: {
    _type: 'https://in-toto.io/Statement/v1',
    subject: [{ name, digest: { sha256 } }],
    predicateType: 'https://slsa.dev/provenance/v1',
  },
});

describe('smoke receipt attestation verifier', () => {
  it('computes the same checksum sha256sum records for the receipt', () => {
    expect(receiptChecksum(receiptBytes)).toBe(digest);
  });

  it('extracts subject name and digest from a DSSE/in-toto attestation', () => {
    expect(attestationSubjects(makeAttestation(digest))).toEqual([{ name: 'production-smoke.json', sha256: digest }]);
  });

  it('accepts an absent attestation when not required', () => {
    const result = verifySmokeAttestation({ receiptBytes, attestation: null, require: false });
    expect(result).toMatchObject({ ok: true, attested: false, digest, reason: 'attestation_absent_accepted' });
  });

  it('rejects an absent attestation when required', () => {
    const result = verifySmokeAttestation({ receiptBytes, attestation: null, require: true });
    expect(result.ok).toBe(false);
    expect(result.errors.join(' ')).toMatch(/required but none was supplied/);
  });

  it('verifies an OIDC-verified attestation that binds the exact receipt digest', () => {
    const result = verifySmokeAttestation({ receiptBytes, attestation: makeAttestation(digest), require: true });
    expect(result).toMatchObject({ ok: true, attested: true, digest, verified: true, subjectMatched: true });
  });

  it('rejects an attestation whose subject digest does not match the receipt', () => {
    const result = verifySmokeAttestation({ receiptBytes, attestation: makeAttestation('0'.repeat(64)), require: true });
    expect(result.ok).toBe(false);
    expect(result.errors.join(' ')).toMatch(/does not cover the receipt digest/);
  });

  it('rejects a matching but unverified attestation in require mode', () => {
    const result = verifySmokeAttestation({ receiptBytes, attestation: makeAttestation(digest, { verified: false }), require: true });
    expect(result.ok).toBe(false);
    expect(result.errors.join(' ')).toMatch(/not marked OIDC-verified/);
  });

  it('rejects a digest match under the wrong subject name', () => {
    const result = verifySmokeAttestation({ receiptBytes, attestation: makeAttestation(digest, { name: 'staging-smoke.json' }), require: true });
    expect(result.ok).toBe(false);
    expect(result.errors.join(' ')).toMatch(/subject name does not match/);
  });
});
