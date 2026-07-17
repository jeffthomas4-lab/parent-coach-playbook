#!/usr/bin/env node

import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const REQUIRED_ACK = 'disposable-non-production-workos-proof';

export function verifyWorkosProofEnvironment(env) {
  const failures = [];
  const requireValue = (key) => {
    const value = env[key];
    if (typeof value !== 'string' || value.length === 0) failures.push(`${key} is required`);
    return value ?? '';
  };

  if (env.PCD_WORKOS_PROOF_ACK !== REQUIRED_ACK) {
    failures.push(`PCD_WORKOS_PROOF_ACK must equal ${REQUIRED_ACK}`);
  }
  if (env.PCD_OWNER_AUTH_PROOF_ENABLED !== 'true') {
    failures.push('PCD_OWNER_AUTH_PROOF_ENABLED must equal true');
  }

  const clientId = requireValue('WORKOS_CLIENT_ID');
  const apiKey = requireValue('WORKOS_API_KEY');
  const redirect = requireValue('WORKOS_REDIRECT_URI');
  const cookiePassword = requireValue('WORKOS_COOKIE_PASSWORD');

  if (clientId && !clientId.startsWith('client_')) failures.push('WORKOS_CLIENT_ID must use WorkOS client_ format');
  if (apiKey && !apiKey.startsWith('sk_test_')) failures.push('WORKOS_API_KEY must be a test key (sk_test_)');
  if (cookiePassword && cookiePassword.length < 32) failures.push('WORKOS_COOKIE_PASSWORD must contain at least 32 characters');

  if (redirect) {
    try {
      const url = new URL(redirect);
      if (url.protocol !== 'http:') failures.push('WORKOS_REDIRECT_URI must use http for the local proof');
      if (!['localhost', '127.0.0.1'].includes(url.hostname)) failures.push('WORKOS_REDIRECT_URI must use localhost or 127.0.0.1');
      if (url.pathname !== '/owner-proof/callback') failures.push('WORKOS_REDIRECT_URI must end at /owner-proof/callback');
      if (url.username || url.password || url.search || url.hash) failures.push('WORKOS_REDIRECT_URI must not contain credentials, query, or fragment');
    } catch {
      failures.push('WORKOS_REDIRECT_URI must be a valid URL');
    }
  }

  if (String(env.WRANGLER_CONFIG_PATH ?? '').replaceAll('\\', '/').endsWith('/wrangler.production.jsonc')
    || env.WRANGLER_CONFIG_PATH === 'wrangler.production.jsonc') {
    failures.push('the disposable proof must not use wrangler.production.jsonc');
  }

  return failures;
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  const failures = verifyWorkosProofEnvironment(process.env);
  if (failures.length > 0) {
    console.error('Disposable WorkOS proof preflight failed (secret values are never printed):');
    for (const failure of failures) console.error(`- ${failure}`);
    process.exitCode = 1;
  } else {
    console.log('Disposable WorkOS proof preflight passed: explicit acknowledgement, test-key format, localhost callback, and cookie-secret length are valid. No network request was made.');
  }
}
