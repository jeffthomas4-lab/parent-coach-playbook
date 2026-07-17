const EMAIL = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/giu;
const URL_PATTERN = /\b(?:https?:\/\/|www\.)\S+/giu;
const PHONE = /(?<!\d)(?:\+?1[\s.-]?)?(?:\(?\d{3}\)?[\s.-]?)\d{3}[\s.-]?\d{4}(?!\d)/g;
const CONTROL = /[\u0000-\u001f\u007f-\u009f]/g;

export const MAX_DEMAND_EVENT_BYTES = 4096;
export const DEMAND_EVENT_SCHEMA_VERSION = 1;
export const MAX_DEMAND_RETENTION_DAYS = 90;

export type DemandResultBand = 'zero' | 'one_to_five' | 'six_to_twenty' | 'twenty_one_plus' | 'unknown';
export type DemandBotClass = 'human_likely' | 'bot_likely' | 'unknown';

export function demandResultBand(value: unknown): DemandResultBand {
  if (typeof value !== 'number' || !Number.isFinite(value)) return 'unknown';
  const count = Math.min(10_000, Math.max(0, Math.floor(value)));
  if (count === 0) return 'zero';
  if (count <= 5) return 'one_to_five';
  if (count <= 20) return 'six_to_twenty';
  return 'twenty_one_plus';
}

export function demandRetentionDays(value: string | undefined): number | null {
  if (!value || !/^\d{1,3}$/.test(value.trim())) return null;
  const days = Number(value.trim());
  return Number.isInteger(days) && days >= 1 && days <= MAX_DEMAND_RETENTION_DAYS ? days : null;
}

export function classifyDemandActor(request: Request): DemandBotClass {
  const userAgent = request.headers.get('user-agent') ?? '';
  if (/bot|crawler|spider|slurp|headless|lighthouse|preview/i.test(userAgent)) return 'bot_likely';
  const fetchSite = request.headers.get('sec-fetch-site');
  return userAgent && (fetchSite === 'same-origin' || fetchSite === 'same-site')
    ? 'human_likely'
    : 'unknown';
}

export function demandExpiry(createdAt: string, retentionDays: number): string {
  const createdMs = Date.parse(createdAt);
  if (!Number.isFinite(createdMs) || !Number.isInteger(retentionDays) || retentionDays < 1 || retentionDays > MAX_DEMAND_RETENTION_DAYS) {
    throw new Error('invalid demand retention');
  }
  return new Date(createdMs + retentionDays * 86_400_000).toISOString();
}

export function sanitizeDemandQuery(value: unknown): { query: string; redacted: boolean } | null {
  if (typeof value !== 'string') return null;

  let redacted = false;
  let query = value.normalize('NFKC').replace(CONTROL, ' ');
  const replace = (pattern: RegExp, token: string) => {
    query = query.replace(pattern, () => {
      redacted = true;
      return token;
    });
  };
  replace(EMAIL, '[email]');
  replace(URL_PATTERN, '[url]');
  replace(PHONE, '[phone]');
  query = query.replace(/\s+/g, ' ').trim().toLowerCase().slice(0, 120);

  return query ? { query, redacted } : null;
}

export function boundedDimension(value: unknown, maxLength: number): string | null {
  if (typeof value !== 'string') return null;
  const normalized = value.normalize('NFKC').replace(CONTROL, '').trim().toLowerCase();
  if (!normalized || normalized.length > maxLength) return null;
  return /^[\p{L}\p{N} /&+.'()-]+$/u.test(normalized) ? normalized : null;
}

export function isSameOriginRequest(request: Request): boolean {
  const origin = request.headers.get('origin');
  return !origin || origin === new URL(request.url).origin;
}

export async function readBoundedJson(
  request: Request,
  maxBytes = MAX_DEMAND_EVENT_BYTES,
): Promise<unknown> {
  const declaredLength = Number(request.headers.get('content-length'));
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
    throw new RangeError('payload too large');
  }

  if (!request.body) return {};
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    length += value.byteLength;
    if (length > maxBytes) {
      await reader.cancel();
      throw new RangeError('payload too large');
    }
    chunks.push(value);
  }

  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return JSON.parse(new TextDecoder().decode(bytes));
}
