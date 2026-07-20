#!/usr/bin/env node
/**
 * Independent attestation verifier for the deployment smoke receipt.
 *
 * The deploy workflow produces a sanitized smoke receipt and a SHA-256 of it
 * (`production-smoke.json` + `production-smoke.json.sha256`). On its own that
 * checksum is self-asserted by the same job that produced it. This verifier
 * accepts (or, in --require mode, demands) an INDEPENDENTLY issued attestation
 * of the same receipt+checksum pair: a GitHub Actions OIDC artifact attestation
 * (`actions/attest-build-provenance`), which is keyless and needs no new secret.
 *
 * The attestation's cryptographic signature is verified upstream by
 * `gh attestation verify` (which sets verificationResult.verified). This module
 * enforces the binding that matters for the deploy gate: the attestation's
 * subject digest must equal the actual SHA-256 of the receipt bytes, and, in
 * --require mode, an OIDC-verified attestation must be present.
 */
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';

const valueAfter = (argv, flag) => {
  const index = argv.indexOf(flag);
  return index >= 0 ? argv[index + 1] : undefined;
};

/** SHA-256 hex of the receipt bytes — the value `sha256sum production-smoke.json` records. */
export function receiptChecksum(receiptBytes) {
  return createHash('sha256').update(receiptBytes).digest('hex');
}

/** Pull [{ name, sha256 }] subjects out of an in-toto / DSSE-style attestation statement. */
export function attestationSubjects(attestation) {
  if (!attestation || typeof attestation !== 'object') return [];
  const statement = (attestation.statement && typeof attestation.statement === 'object') ? attestation.statement : attestation;
  const raw = statement.subject ?? attestation.subject ?? [];
  const list = Array.isArray(raw) ? raw : [raw];
  return list
    .filter((s) => s && typeof s === 'object')
    .map((s) => ({ name: s.name, sha256: (s.digest && s.digest.sha256) ? String(s.digest.sha256).toLowerCase() : undefined }));
}

function attestationVerified(attestation) {
  return attestation?.verificationResult?.verified === true || attestation?.verified === true;
}

/**
 * @param {object} params
 * @param {Buffer|Uint8Array} params.receiptBytes  the smoke receipt file contents.
 * @param {string} [params.receiptName]  expected attestation subject name.
 * @param {object|null} [params.attestation]  parsed attestation bundle (null when none supplied).
 * @param {boolean} [params.require]  when true, an OIDC-verified matching attestation must be present.
 * @returns {{ok:boolean, attested:boolean, digest:string, verified?:boolean, subjectMatched?:boolean, errors:string[], reason?:string}}
 */
export function verifySmokeAttestation({ receiptBytes, receiptName = 'production-smoke.json', attestation = null, require = false }) {
  const digest = receiptChecksum(receiptBytes);
  if (!attestation) {
    if (require) return { ok: false, attested: false, digest, errors: ['an independent attestation is required but none was supplied'] };
    return { ok: true, attested: false, digest, errors: [], reason: 'attestation_absent_accepted' };
  }

  const errors = [];
  const subjects = attestationSubjects(attestation);
  const digestMatch = subjects.some((s) => s.sha256 === digest);
  const nameAndDigestMatch = subjects.some((s) => s.sha256 === digest && (!s.name || s.name === receiptName));
  if (!digestMatch) errors.push(`attestation does not cover the receipt digest ${digest}`);
  else if (!nameAndDigestMatch) errors.push(`attestation subject name does not match ${receiptName}`);

  const verified = attestationVerified(attestation);
  if (require && !verified) errors.push('attestation is not marked OIDC-verified (verificationResult.verified !== true)');

  return { ok: errors.length === 0, attested: true, digest, verified, subjectMatched: nameAndDigestMatch, errors };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const argv = process.argv.slice(2);
  const receiptPath = valueAfter(argv, '--receipt');
  const attestationPath = valueAfter(argv, '--attestation');
  const receiptName = valueAfter(argv, '--name') ?? 'production-smoke.json';
  const require = argv.includes('--require');
  if (!receiptPath) throw new Error('usage: check-smoke-attestation.mjs --receipt <file> [--attestation <file>] [--name <subject>] [--require]');
  const receiptBytes = fs.readFileSync(receiptPath);
  const attestation = attestationPath ? JSON.parse(fs.readFileSync(attestationPath, 'utf8')) : null;
  const result = verifySmokeAttestation({ receiptBytes, receiptName, attestation, require });
  if (!result.ok) {
    console.error('Smoke attestation verification failed:');
    for (const error of result.errors) console.error(`- ${error}`);
    process.exitCode = 1;
  } else {
    console.log(result.attested ? `Smoke attestation verified for digest ${result.digest} (verified=${result.verified === true}).` : `No attestation supplied; accepted (digest ${result.digest}).`);
  }
}
