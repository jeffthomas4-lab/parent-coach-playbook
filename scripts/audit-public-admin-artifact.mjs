import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';

const PATHS = [
  '/admin/camps/', '/admin/camps/queue', '/admin/camps/spot-check', '/admin/claims/',
  '/admin/editorial/', '/admin/image-needs', '/admin/link-health/', '/admin/reviews/',
  '/admin/search-signals', '/admin/source-quality', '/admin/suggestions/',
];
const MAX_BYTES = 2_000_000;

const count = (text, pattern) => [...text.matchAll(pattern)].length;

async function readBounded(response) {
  if (!response.body) return { body: '', truncated: false };
  const reader = response.body.getReader();
  const chunks = [];
  let bytes = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    bytes += value.byteLength;
    if (bytes > MAX_BYTES) {
      await reader.cancel();
      return { body: '', truncated: true };
    }
    chunks.push(value);
  }
  return { body: new TextDecoder().decode(Buffer.concat(chunks)), truncated: false };
}

export async function auditPublicAdminArtifact({ baseUrl, fetchImpl = fetch } = {}) {
  if (!baseUrl || new URL(baseUrl).protocol !== 'https:') throw new Error('HTTPS baseUrl is required.');
  const results = [];
  for (const path of PATHS) {
    const response = await fetchImpl(new URL(path, baseUrl), { method: 'GET', redirect: 'error' });
    const { body, truncated } = await readBounded(response);
    if (truncated) {
      results.push({ path, status: response.status, bytes: `>${MAX_BYTES}`, truncated: true });
      continue;
    }
    const title = body.match(/<title[^>]*>([^<]{0,200})<\/title>/i)?.[1]?.trim() ?? null;
    const formTargets = [...body.matchAll(/<form[^>]+action=["']([^"']{0,300})["']/gi)]
      .map((match) => match[1])
      .filter((value, index, values) => values.indexOf(value) === index);
    results.push({
      path,
      status: response.status,
      bytes: Buffer.byteLength(body),
      sha256: createHash('sha256').update(body).digest('hex'),
      title,
      email_pattern_count: count(body, /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi),
      phone_pattern_count: count(body, /(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}/g),
      token_field_count: count(body, /(?:token|secret|api[_-]?key|authorization)/gi),
      form_targets: formTargets,
    });
  }
  return {
    schema_version: 1,
    audit: 'pcd-public-admin-artifact',
    target_origin: new URL(baseUrl).origin,
    observed_at: new Date().toISOString(),
    note: 'Counts only; matched values are intentionally not retained.',
    results,
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const report = await auditPublicAdminArtifact({ baseUrl: process.env.PCD_ARTIFACT_BASE_URL });
  console.log(JSON.stringify(report, null, 2));
}
