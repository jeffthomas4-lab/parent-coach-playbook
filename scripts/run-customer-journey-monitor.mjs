import { writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const DEFAULT_BASE_URL = 'https://parentcoachdesk.com';
const MAX_BODY_BYTES = 5_000_000;

const checks = [
  { id: 'home', path: '/', contentType: 'text/html', markers: ['Parent Coach Desk', '<main'] },
  { id: 'directory', path: '/camps/', contentType: 'text/html', markers: ['Camps &amp; Leagues', '<main'] },
  { id: 'privacy', path: '/disclosure/', contentType: 'text/html', markers: ['privacy', '<main'] },
  { id: 'terms', path: '/terms/', contentType: 'text/html', markers: ['Terms', '<main'] },
  { id: 'health', path: '/api/health', contentType: 'application/json', jsonOk: true },
  { id: 'readiness', path: '/api/ready', contentType: 'application/json', jsonOk: true },
];

const codeFor = (error) => {
  if (error?.name === 'AbortError') return 'timeout';
  return 'request_failed';
};

const readBounded = async (response) => {
  if (!response.body) return '';
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let size = 0;
  let text = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_BODY_BYTES) {
      await reader.cancel();
      throw new Error('response_too_large');
    }
    text += decoder.decode(value, { stream: true });
  }
  return text + decoder.decode();
};

export async function runCustomerJourneyMonitor({
  baseUrl = DEFAULT_BASE_URL,
  fetchImpl = fetch,
  timeoutMs = 10_000,
  now = () => new Date(),
} = {}) {
  const origin = new URL(baseUrl);
  if (origin.protocol !== 'https:' && origin.hostname !== 'localhost' && origin.hostname !== '127.0.0.1') {
    throw new Error('Monitor target must use HTTPS except for local development.');
  }

  const results = [];
  for (const check of checks) {
    const started = Date.now();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetchImpl(new URL(check.path, origin), {
        method: 'GET',
        redirect: 'error',
        signal: controller.signal,
        headers: { accept: check.contentType },
      });
      const declaredLength = Number(response.headers.get('content-length') ?? 0);
      if (declaredLength > MAX_BODY_BYTES) throw new Error('response_too_large');
      const body = await readBounded(response);
      const contentType = response.headers.get('content-type') ?? '';
      let code = 'ok';
      if (!response.ok) code = `http_${response.status}`;
      else if (!contentType.toLowerCase().includes(check.contentType)) code = 'unexpected_content_type';
      else if (check.markers?.some((marker) => !body.includes(marker))) code = 'required_marker_missing';
      else if (check.jsonOk) {
        try {
          if (JSON.parse(body)?.ok !== true) code = 'json_not_ready';
        } catch {
          code = 'invalid_json';
        }
      }
      results.push({ id: check.id, ok: code === 'ok', code, status: response.status, duration_ms: Date.now() - started });
    } catch (error) {
      results.push({ id: check.id, ok: false, code: error?.message === 'response_too_large' ? 'response_too_large' : codeFor(error), status: null, duration_ms: Date.now() - started });
    } finally {
      clearTimeout(timer);
    }
  }

  return {
    schema_version: 1,
    monitor: 'pcd-public-customer-journey',
    target_origin: origin.origin,
    observed_at: now().toISOString(),
    ok: results.every((item) => item.ok),
    results,
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const report = await runCustomerJourneyMonitor({ baseUrl: process.env.PCD_MONITOR_BASE_URL || DEFAULT_BASE_URL });
  const output = `${JSON.stringify(report, null, 2)}\n`;
  if (process.env.PCD_MONITOR_REPORT) await writeFile(process.env.PCD_MONITOR_REPORT, output, 'utf8');
  console.log(output.trim());
  if (!report.ok) process.exitCode = 1;
}
