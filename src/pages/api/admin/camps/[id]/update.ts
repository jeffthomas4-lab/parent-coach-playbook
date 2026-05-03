// POST /api/admin/camps/:id/update
//
// Admin-only edit endpoint. Accepts any subset of editable camp fields and
// writes the changes back to D1. Re-geocodes if any address component changed.
// Re-slugifies if the name changed (with uniqueness fallback).
//
// All fields are optional. Only provided fields are written. Validation matches
// the public /api/camps/submit endpoint where applicable.

import type { APIRoute } from 'astro';
import {
  getCampById,
  updateCamp,
  uniqueSlug,
  geocodeCached,
  type CampEditFields,
  type DayOrOvernight,
  type SkillLevel,
  type SpotsStatus,
} from '../../../../../lib/camps-db';
import { requireAdmin, requireSameOrigin } from '../../../../../lib/admin-auth';

export const prerender = false;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });

const fail = (message: string, status = 400) => json({ ok: false, error: message }, status);

const isInt = (s: string): boolean => /^[0-9]+$/.test(s);
const isIsoDate = (s: string): boolean => /^\d{4}-\d{2}-\d{2}$/.test(s);
const isEmail = (s: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
const isZip = (s: string): boolean => /^\d{5}(-\d{4})?$/.test(s);

const normalizeUrl = (s: string): string => {
  const t = s.trim();
  if (!t) return t;
  return /^https?:\/\//i.test(t) ? t : `https://${t}`;
};

interface UpdatePayload {
  name?: string;
  sport?: string;
  age_min?: string;
  age_max?: string;
  start_date?: string;
  end_date?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  description?: string;
  price_text?: string;
  day_or_overnight?: string;
  skill_level?: string;
  spots_status?: string;
  contact_email?: string;
  contact_phone?: string;
  website_url?: string;
  lunch_included?: string;
  aftercare_available?: string;
  // honor a redirect-after-save target so the form can land back on the camp page
  redirect?: string;
}

async function readPayload(req: Request): Promise<UpdatePayload> {
  const ct = (req.headers.get('content-type') ?? '').toLowerCase();
  if (ct.includes('application/json')) {
    return (await req.json()) as UpdatePayload;
  }
  if (ct.includes('application/x-www-form-urlencoded') || ct.includes('multipart/form-data')) {
    const fd = await req.formData();
    const out: Record<string, string> = {};
    for (const [k, v] of fd.entries()) {
      if (typeof v === 'string') out[k] = v;
    }
    return out as UpdatePayload;
  }
  try {
    return (await req.json()) as UpdatePayload;
  } catch {
    return {};
  }
}

export const POST: APIRoute = async ({ params, request, locals }) => {
  const env = (locals as any).runtime?.env as { DB: D1Database; ADMIN_EMAILS?: string } | undefined;
  if (!env?.DB) return fail('database not available', 500);

  const auth = requireAdmin(request, env);
  if (auth instanceof Response) return auth;

  const originErr = requireSameOrigin(request);
  if (originErr) return originErr;

  const id = params.id;
  if (!id) return fail('missing id');

  const existing = await getCampById(env.DB, id);
  if (!existing) return fail('camp not found', 404);

  const data = await readPayload(request);

  const has = (k: keyof UpdatePayload): boolean => k in data && typeof data[k] === 'string';

  const fields: CampEditFields = {};

  // Strings — only assign when present. Empty string means "clear" for nullable fields.
  if (has('name')) {
    const v = data.name!.trim();
    if (!v) return fail('name cannot be empty');
    if (v.length > 200) return fail('name too long');
    fields.name = v;
  }
  if (has('sport')) {
    const v = data.sport!.trim();
    if (!v) return fail('sport cannot be empty');
    fields.sport = v;
  }
  if (has('description')) {
    const v = data.description!.trim();
    if (v.length < 30 || v.length > 4000) return fail('description must be 30-4000 chars');
    fields.description = v;
  }
  if (has('address')) fields.address = data.address!.trim();
  if (has('city')) fields.city = data.city!.trim();
  if (has('state')) {
    const v = data.state!.trim().toUpperCase();
    if (v.length !== 2) return fail('state must be 2 letters');
    fields.state = v;
  }
  if (has('zip')) {
    const v = data.zip!.trim();
    if (!isZip(v)) return fail('zip must be 5 digits');
    fields.zip = v;
  }

  if (has('start_date')) {
    if (!isIsoDate(data.start_date!)) return fail('start_date must be YYYY-MM-DD');
    fields.start_date = data.start_date!;
  }
  if (has('end_date')) {
    if (!isIsoDate(data.end_date!)) return fail('end_date must be YYYY-MM-DD');
    fields.end_date = data.end_date!;
  }
  // After both possibly assigned, validate ordering.
  const finalStart = fields.start_date ?? existing.start_date;
  const finalEnd = fields.end_date ?? existing.end_date;
  if (finalStart > finalEnd) return fail('start_date must be on or before end_date');

  if (has('age_min') || has('age_max')) {
    const aMin = has('age_min')
      ? (isInt(data.age_min!) ? Number.parseInt(data.age_min!, 10) : NaN)
      : existing.age_min;
    const aMax = has('age_max')
      ? (isInt(data.age_max!) ? Number.parseInt(data.age_max!, 10) : NaN)
      : existing.age_max;
    if (!Number.isFinite(aMin) || !Number.isFinite(aMax)) return fail('ages must be integers');
    if (aMin < 3 || aMax > 22 || aMin > aMax) return fail('ages out of range or inverted');
    if (has('age_min')) fields.age_min = aMin;
    if (has('age_max')) fields.age_max = aMax;
  }

  if (has('day_or_overnight')) {
    const v = data.day_or_overnight!.trim().toLowerCase();
    if (v !== 'day' && v !== 'overnight') return fail('day_or_overnight invalid');
    fields.day_or_overnight = v as DayOrOvernight;
  }
  if (has('skill_level')) {
    const v = data.skill_level!.trim().toLowerCase();
    if (!['beginner', 'intermediate', 'advanced', 'all'].includes(v)) return fail('skill_level invalid');
    fields.skill_level = v as SkillLevel;
  }
  if (has('spots_status')) {
    const v = data.spots_status!.trim().toLowerCase();
    if (!['open', 'waitlist', 'full'].includes(v)) return fail('spots_status invalid');
    fields.spots_status = v as SpotsStatus;
  }

  // Nullable text fields. Empty string from a form means "clear it".
  if (has('price_text')) {
    const v = data.price_text!.trim();
    fields.price_text = v ? v : null;
  }
  if (has('contact_email')) {
    const v = data.contact_email!.trim();
    if (v && !isEmail(v)) return fail('contact_email is not a valid email');
    fields.contact_email = v ? v : null;
  }
  if (has('contact_phone')) {
    const v = data.contact_phone!.trim();
    fields.contact_phone = v ? v : null;
  }
  if (has('website_url')) {
    const v = data.website_url!.trim();
    fields.website_url = v ? normalizeUrl(v) : null;
  }

  if (has('lunch_included')) {
    fields.lunch_included = data.lunch_included === 'true' || data.lunch_included === 'on';
  }
  if (has('aftercare_available')) {
    fields.aftercare_available = data.aftercare_available === 'true' || data.aftercare_available === 'on';
  }

  // Slug regeneration if name changed.
  if (fields.name && fields.name !== existing.name) {
    fields.slug = await uniqueSlug(env.DB, fields.name);
  }

  // Re-geocode if any address component changed.
  const addrChanged = ['address', 'city', 'state', 'zip'].some((k) => k in fields);
  if (addrChanged) {
    const finalAddr = fields.address ?? existing.address;
    const finalCity = fields.city ?? existing.city;
    const finalState = fields.state ?? existing.state;
    const finalZip = fields.zip ?? existing.zip;
    try {
      const g = await geocodeCached(env.DB, finalAddr, finalCity, finalState, finalZip);
      if (g) {
        fields.latitude = g.lat;
        fields.longitude = g.lon;
      } else {
        fields.latitude = null;
        fields.longitude = null;
      }
    } catch {
      // ignore — admin can edit again to retry
    }
  }

  const updated = await updateCamp(env.DB, id, fields, auth.email);

  // If the form requested a redirect (browser submission), send them back.
  if (data.redirect) {
    return new Response(null, {
      status: 303,
      headers: { Location: data.redirect },
    });
  }

  return json({ ok: true, camp: updated });
};
