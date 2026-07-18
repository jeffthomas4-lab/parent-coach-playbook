// Null-safe presentation helpers for camp rows rendered on admin SSR pages.
//
// Why this exists: parentcoachdesk.com now reads the shared activity-radar D1
// (see src/lib/camps-db.ts). Legacy directory rows migrated into that schema
// can carry NULL in session_start_date / session_end_date / description /
// address / submitted_at. The exported `Camp` interface types several of those
// as non-null `string`, but the database does NOT enforce that for legacy
// rows, so a value the type system believes is a string can be null at
// runtime. Calling .split() or .length on such a value throws during SSR and
// 500s the whole route before it can render (this was the /admin/camps/
// spot-check defect).
//
// Every formatter here treats its input as possibly null/undefined and NEVER
// calls .split or .length on a nullable value. Callers interpolate the
// returned strings directly, so the template stays free of fragile access.

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export type NullableString = string | null | undefined;

// Parse a YYYY-MM-DD string into calendar parts, or null if it is missing or
// not a well-formed date. Guards every step so a null/blank/garbage value can
// never reach `.split(...)` unguarded or produce NaN month indexes.
function parseYmd(value: NullableString): { y: number; m: number; d: number } | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const segments = trimmed.split('-');
  if (segments.length < 3) return null;
  const [y, m, d] = segments.map((segment) => Number(segment));
  if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) return null;
  if (m < 1 || m > 12) return null;
  if (d < 1 || d > 31) return null;
  return { y, m, d };
}

// "Jul 5–Jul 12, 2026" when both endpoints parse. Degrades to a single date
// when only one is present, and to a stable placeholder when neither is.
// Mirrors the year-from-end formatting the page used before hardening.
export function formatCampDateRange(start: NullableString, end: NullableString): string {
  const s = parseYmd(start);
  const e = parseYmd(end);
  if (s && e) return `${MONTHS[s.m - 1]} ${s.d}–${MONTHS[e.m - 1]} ${e.d}, ${e.y}`;
  if (s) return `${MONTHS[s.m - 1]} ${s.d}, ${s.y}`;
  if (e) return `${MONTHS[e.m - 1]} ${e.d}, ${e.y}`;
  return 'Dates TBD';
}

// "Jul 5, 2026, 3:30 PM" for an importable timestamp; "unknown" for a null,
// blank, or unparseable value (Date parsing that yields Invalid Date).
export function formatImportedAt(value: NullableString): string {
  if (typeof value !== 'string' || !value.trim()) return 'unknown';
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return 'unknown';
  return dt.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

// "Address, City, ST ZIP" with any missing part dropped, and a stable
// placeholder when every part is absent. Never assumes a field is present.
export function formatCampLocation(parts: {
  address?: NullableString;
  city?: NullableString;
  state?: NullableString;
  zip?: NullableString;
}): string {
  const clean = (v: NullableString) => (typeof v === 'string' ? v.trim() : '');
  const stateZip = [clean(parts.state), clean(parts.zip)].filter(Boolean).join(' ');
  const line = [clean(parts.address), clean(parts.city), stateZip].filter(Boolean).join(', ');
  return line || 'Location unavailable';
}

// Clamp a description to `max` characters with an ellipsis. Safe on null:
// returns { text: '', empty: true } so the caller can render an italic
// fallback instead of an empty gap. Never calls .length on a nullable value.
export function formatCampDescription(
  value: NullableString,
  max = 320,
): { text: string; empty: boolean } {
  const desc = typeof value === 'string' ? value : '';
  if (!desc.trim()) return { text: '', empty: true };
  return { text: desc.length > max ? `${desc.slice(0, max)}…` : desc, empty: false };
}
