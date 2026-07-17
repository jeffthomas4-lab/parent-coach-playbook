import { readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const ACCESS_REDIRECTS = new Set([301, 302, 303, 307, 308]);

export const routeSourceToPath = (source) => {
  let path = source
    .replace(/^src\/pages/, '')
    .replace(/\.(astro|ts|md)$/, '')
    .replace(/\/index$/, '/')
    .replace(/\[([^\]]+)\]/g, 'probe-$1');
  if (path.startsWith('/admin/api/')) path = path.replace('/admin/api/', '/admin/api/');
  return path;
};

/**
 * @param {{
 *   baseUrl?: string,
 *   fetchImpl?: typeof fetch,
 *   contractPath?: string,
 *   contract?: { routes: Array<{ source: string }> },
 *   timeoutMs?: number,
 *   now?: () => Date
 * }} options
 */
export async function probeAnonymousAdmin({
  baseUrl = 'https://parentcoachdesk.com',
  fetchImpl = fetch,
  contractPath = 'automation/protected-route-contract.json',
  contract: providedContract,
  timeoutMs = 10_000,
  now = () => new Date(),
} = {}) {
  const origin = new URL(baseUrl);
  if (origin.protocol !== 'https:') throw new Error('Anonymous Access probes require HTTPS.');
  const contract = providedContract ?? JSON.parse(await readFile(contractPath, 'utf8'));
  const paths = [...new Set(contract.routes.map(({ source }) => routeSourceToPath(source)))].sort();
  const results = [];

  for (const path of paths) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetchImpl(new URL(path, origin), {
        method: 'GET',
        redirect: 'manual',
        signal: controller.signal,
        headers: { accept: 'text/html,application/json' },
      });
      const location = response.headers.get('location');
      let redirectOrigin = null;
      try { redirectOrigin = location ? new URL(location, origin).origin : null; } catch { /* redact malformed location */ }
      const protectedByAccess = ACCESS_REDIRECTS.has(response.status)
        && redirectOrigin === 'https://fieldforge.cloudflareaccess.com';
      results.push({ path, protected: protectedByAccess, status: response.status, redirect_origin: redirectOrigin });
    } catch (error) {
      results.push({ path, protected: false, status: null, error: error?.name === 'AbortError' ? 'timeout' : 'request_failed' });
    } finally {
      clearTimeout(timer);
    }
  }

  return {
    schema_version: 1,
    probe: 'pcd-anonymous-admin-access',
    target_origin: origin.origin,
    observed_at: now().toISOString(),
    ok: results.every((result) => result.protected),
    route_count: results.length,
    results,
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const report = await probeAnonymousAdmin({ baseUrl: process.env.PCD_ACCESS_PROBE_BASE_URL || 'https://parentcoachdesk.com' });
  const output = `${JSON.stringify(report, null, 2)}\n`;
  if (process.env.PCD_ACCESS_PROBE_REPORT) await writeFile(process.env.PCD_ACCESS_PROBE_REPORT, output, 'utf8');
  console.log(output.trim());
  if (!report.ok) process.exitCode = 1;
}
