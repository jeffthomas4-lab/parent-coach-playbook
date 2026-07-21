// POST /api/admin/data-quality/fix
//
// Admin-only endpoint backing the /admin/data-quality drill-down page. Each
// issue type on that page offers a narrow, whitelisted fix — never a raw
// field editor — so this route accepts a fixed action vocabulary instead of
// an arbitrary field patch. Every write goes through data-quality-db.ts,
// which uses bound parameters exclusively.

import type { APIRoute } from 'astro';
import { requireAdmin, requireSameOrigin } from '../../../../lib/admin-auth';
import {
  getProgramById,
  setAge,
  setDates,
  swapDates,
  setPrice,
  clearPrice,
  setRegistrationUrl,
  upgradeToHttps,
  setSourceDomain,
  deriveSourceDomain,
  stampVerified,
  unverify,
  rejectAsDuplicate,
} from '../../../../lib/data-quality-db';
import { env as cfEnv } from 'cloudflare:workers';

export const prerender = false;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });

const fail = (message: string, status = 400) => json({ ok: false, error: message }, status);

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const isIsoDate = (s: unknown): s is string => typeof s === 'string' && ISO_DATE.test(s);
const isHttpsUrl = (s: unknown): s is string => typeof s === 'string' && /^https:\/\/.+/i.test(s.trim());
const isFiniteNumber = (n: unknown): n is number => typeof n === 'number' && Number.isFinite(n);

const VALID_ACTIONS = new Set([
  'set_age',
  'set_dates',
  'swap_dates',
  'set_price',
  'clear_price',
  'set_registration_url',
  'upgrade_https',
  'set_source_domain',
  'derive_source_domain',
  'stamp_verified',
  'unverify',
  'reject_duplicate',
]);

interface FixPayload {
  id?: string;
  action?: string;
  fields?: Record<string, unknown>;
}

export const POST: APIRoute = async ({ request }) => {
  const env = cfEnv as { DB?: D1Database; ADMIN_EMAILS?: string } | undefined;
  if (!env?.DB) return fail('database not available', 500);

  const auth = await requireAdmin(request, env);
  if (auth instanceof Response) return auth;

  const originErr = requireSameOrigin(request);
  if (originErr) return originErr;

  let payload: FixPayload;
  try {
    payload = (await request.json()) as FixPayload;
  } catch {
    return fail('invalid json body');
  }

  const id = typeof payload.id === 'string' ? payload.id.trim() : '';
  const action = typeof payload.action === 'string' ? payload.action.trim() : '';
  const fields: Record<string, unknown> = payload.fields && typeof payload.fields === 'object' ? payload.fields : {};

  if (!id) return fail('id is required');
  if (!VALID_ACTIONS.has(action)) return fail('unknown action');

  const existing = await getProgramById(env.DB, id);
  if (!existing) return fail('program not found', 404);

  let changed: boolean;

  switch (action) {
    case 'set_age': {
      const ageMin = fields.age_min;
      const ageMax = fields.age_max;
      if (!isFiniteNumber(ageMin) || !isFiniteNumber(ageMax)) return fail('age_min and age_max must be numbers');
      if (ageMin < 0 || ageMin > 25 || ageMax < 0 || ageMax > 25 || ageMin > ageMax) {
        return fail('ages must be between 0 and 25, with age_min <= age_max');
      }
      changed = await setAge(env.DB, id, ageMin, ageMax, auth.email);
      break;
    }
    case 'set_dates': {
      const start = fields.session_start_date;
      const end = fields.session_end_date;
      if (!isIsoDate(start) || !isIsoDate(end)) return fail('dates must be YYYY-MM-DD');
      if (start > end) return fail('session_start_date must be on or before session_end_date');
      changed = await setDates(env.DB, id, start, end, auth.email);
      break;
    }
    case 'swap_dates': {
      changed = await swapDates(env.DB, id, auth.email);
      if (!changed) return fail('both session dates must be present to swap');
      break;
    }
    case 'set_price': {
      const price = fields.price;
      if (!isFiniteNumber(price) || price < 0) return fail('price must be a non-negative number');
      changed = await setPrice(env.DB, id, price, auth.email);
      break;
    }
    case 'clear_price': {
      changed = await clearPrice(env.DB, id, auth.email);
      break;
    }
    case 'set_registration_url': {
      const url = fields.registration_url;
      if (!isHttpsUrl(url)) return fail('registration_url must be an https:// URL');
      changed = await setRegistrationUrl(env.DB, id, url.trim(), auth.email);
      break;
    }
    case 'upgrade_https': {
      changed = await upgradeToHttps(env.DB, id, auth.email);
      if (!changed) return fail('registration_url is not an http:// URL to upgrade');
      break;
    }
    case 'set_source_domain': {
      const domain = fields.source_domain;
      if (typeof domain !== 'string' || !domain.trim()) return fail('source_domain is required');
      const cleaned = domain.trim().toLowerCase().replace(/^www\./, '');
      if (!/^[a-z0-9.-]+\.[a-z]{2,}$/.test(cleaned)) return fail('source_domain is not a valid domain');
      changed = await setSourceDomain(env.DB, id, cleaned, auth.email);
      break;
    }
    case 'derive_source_domain': {
      changed = await deriveSourceDomain(env.DB, id, auth.email);
      if (!changed) return fail('no registration_url to derive a domain from');
      break;
    }
    case 'stamp_verified': {
      changed = await stampVerified(env.DB, id, auth.email);
      break;
    }
    case 'unverify': {
      changed = await unverify(env.DB, id, auth.email);
      break;
    }
    case 'reject_duplicate': {
      const result = await rejectAsDuplicate(env.DB, id, auth.email);
      if (!result.camp) return fail('program not found', 404);
      changed = true;
      break;
    }
    default:
      return fail('unknown action');
  }

  return json({ ok: true, id, action, changed });
};
