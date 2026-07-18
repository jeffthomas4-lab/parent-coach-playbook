#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

export function validateNewsletterProviderProof(value) {
  const errors = [];
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return { valid: false, verified: false, errors: ['proof must be an object'] };
  }
  if (value.schema_version !== 1) errors.push('schema_version must be 1');
  if (!['pending', 'verified'].includes(value.state)) errors.push('state must be pending or verified');
  try {
    const form = new URL(value.form_url);
    if (form.protocol !== 'https:' || form.hostname !== 'parent-coach-playbook.kit.com') errors.push('form_url must be the approved HTTPS Kit host');
  } catch {
    errors.push('form_url must be a valid URL');
  }
  if (value.contains_subscriber_data !== false) errors.push('proof must not contain subscriber data');
  if (value.contains_secret_material !== false) errors.push('proof must not contain secret material');
  if (!Array.isArray(value.external_changes)) errors.push('external_changes must be an array');

  const verified = value.state === 'verified';
  if (verified) {
    for (const field of ['observed_at', 'test_run_id', 'provider_receipt_reference', 'approved_by']) {
      if (typeof value[field] !== 'string' || !value[field].trim()) errors.push(`${field} is required when verified`);
    }
    for (const field of ['consent_notice_observed', 'confirmation_verified', 'welcome_delivery_verified', 'unsubscribe_verified', 'suppression_verified', 'failure_handling_verified', 'redirect_verified']) {
      if (value[field] !== true) errors.push(`${field} must be true when verified`);
    }
    if (value.approved_by !== 'Jeff Thomas') errors.push('verified proof requires Jeff Thomas approval');
  }
  return { valid: errors.length === 0, verified: verified && errors.length === 0, errors };
}

if (fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const file = process.argv[2];
  if (!file) {
    console.error('usage: node scripts/newsletter-provider-proof.mjs <proof.json> [--require-verified]');
    process.exit(2);
  }
  const proof = JSON.parse(await readFile(file, 'utf8'));
  const result = validateNewsletterProviderProof(proof);
  if (!result.valid || (process.argv.includes('--require-verified') && !result.verified)) {
    console.error(result.errors.length ? result.errors.join('\n') : 'newsletter provider proof remains pending');
    process.exit(1);
  }
  console.log(result.verified ? 'Newsletter provider proof verified.' : 'Newsletter provider proof structure valid; live proof remains pending.');
}
