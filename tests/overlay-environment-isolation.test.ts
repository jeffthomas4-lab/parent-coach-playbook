// Inline editor: environment isolation (Pillar 13 item 2).
//
// "Automated validation fails closed when a lower ring equals a production
// data-bearing resource." The overlay KV namespace is data-bearing: it holds
// live production copy. Staging must never point at it.
//
// This test is the automated validation. It reads the two wrangler configs as
// the release gate does, so a copy-paste of the production id into the staging
// config fails CI rather than shipping.

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve(__dirname, '..');

/** Strip // and /* *\/ comments so JSON.parse can read a .jsonc file. */
function readJsonc(relPath: string): any {
  const raw = readFileSync(resolve(ROOT, relPath), 'utf8');
  const stripped = raw
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1');
  return JSON.parse(stripped);
}

function kvId(config: any, binding: string): string | undefined {
  return (config.kv_namespaces ?? []).find((n: any) => n.binding === binding)?.id;
}

describe('overlay KV: environment isolation', () => {
  const staging = readJsonc('wrangler.jsonc');
  const production = readJsonc('wrangler.production.jsonc');

  it('binds CONTENT_OVERLAY in both rings', () => {
    expect(kvId(staging, 'CONTENT_OVERLAY'), 'staging CONTENT_OVERLAY binding missing').toBeTruthy();
    expect(kvId(production, 'CONTENT_OVERLAY'), 'production CONTENT_OVERLAY binding missing').toBeTruthy();
  });

  it('FAILS CLOSED if staging and production share a namespace id', () => {
    const s = kvId(staging, 'CONTENT_OVERLAY');
    const p = kvId(production, 'CONTENT_OVERLAY');
    expect(
      s,
      'staging CONTENT_OVERLAY points at the PRODUCTION namespace. Lower rings must not share a data-bearing resource with production (Pillar 13 item 2).',
    ).not.toBe(p);
  });

  it('keeps the SESSION namespaces distinct too', () => {
    expect(kvId(staging, 'SESSION')).not.toBe(kvId(production, 'SESSION'));
  });

  it('names its environment so receipts can record which ring wrote them', () => {
    expect(staging.vars?.ENVIRONMENT).toBe('staging');
    expect(production.vars?.ENVIRONMENT).toBe('production');
  });

  it('ships the kill switch as an explicit var, not an implicit default', () => {
    expect(production.vars?.CONTENT_OVERLAY_ENABLED).toBeDefined();
  });

  it('points the two rings at different D1 ops databases', () => {
    const dbOf = (c: any, b: string) =>
      (c.d1_databases ?? []).find((d: any) => d.binding === b)?.database_id;
    expect(dbOf(staging, 'PCD_OPS_DB')).not.toBe(dbOf(production, 'PCD_OPS_DB'));
  });
});
