// POST /api/camps/submit
//
// Public submission endpoint. Accepts a JSON or form-encoded payload, validates,
// geocodes via Nominatim, inserts a `pending` row, returns success.
//
// Spam protection: a `website` honeypot field. Real users do not fill this.
// Bots do. Any non-empty website value short-circuits to 200 OK without storing.

import type { APIRoute } from 'astro';
import {
  insertCamp,
  geocode,
  generateCampId,
  uniqueSlug,
  upsertSubmitterOnSubmission,
  type DayOrOvernight,
  type SkillLevel,
  type SpotsStatus,
} from '../../../lib/camps-db';

export const prerender = false;

interface SubmitPayload {
  // honeypot
  website?: string;
  // public
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
  submitted_by_email?: string;
}

const REQUIRED: (keyof SubmitPayload)[] = [
  'name',
  'sport',
  'age_min',
  'age_max',
  'start_date',
  'end_date',
  'address',
  'city',
  'state',
  'zip',
  'description',
  'submitted_by_email',
];

const isInt = (s: string | undefined): boolean => !!s && /^[0-9]+$/.test(s);
const isIsoDate = (s: string | undefined): boolean => !!s && /^\d{4}-\d{2}-\d{2}$/.test(s);
const isEmail = (s: string | undefined): boolean => !!s && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

const ok = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });

const fail = (message: string, status = 400) =>
  ok({ ok: false, error: message }, status);

async function readPayload(req: Request): Promise<SubmitPayload> {
  const ct = (req.headers.get('content-type') ?? '').toLowerCase();
  if (ct.includes('application/json')) {
    return (await req.json()) as SubmitPayload;
  }
  if (ct.includes('application/x-www-form-urlencoded') || ct.includes('multipart/form-data')) {
    const fd = await req.formData();
    const out: Record<string, string> = {};
    for (const [k, v] of fd.entries()) {
      if (typeof v === 'string') out[k] = v;
    }
    return out as SubmitPayload;
  }
  // Fallback: try JSON, then empty.
  try {
    return (await req.json()) as SubmitPayload;
  } catch {
    return {};
  }
}

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env as { DB: D1Database } | undefined;
  if (!env?.DB) return fail('database not available', 500);

  const data = await readPayload(request);

  // Honeypot. Bots fill it, humans do not.
  if (data.website && data.website.trim().length > 0) {
    return ok({ ok: true });
  }

  // Required fields.
  const missing = REQUIRED.filter((k) => !data[k] || String(data[k]).trim() === '');
  if (missing.length) {
    return fail(`missing required fields: ${missing.join(', ')}`);
  }

  // Type / format validation.
  if (!isInt(data.age_min) || !isInt(data.age_max)) {
    return fail('age_min and age_max must be integers');
  }
  const ageMin = Number.parseInt(data.age_min!, 10);
  const ageMax = Number.parseInt(data.age_max!, 10);
  if (ageMin < 3 || ageMax > 22 || ageMin > ageMax) {
    return fail('ages out of range or inverted');
  }
  if (!isIsoDate(data.start_date) || !isIsoDate(data.end_date)) {
    return fail('start_date and end_date must be YYYY-MM-DD');
  }
  if (data.start_date! > data.end_date!) {
    return fail('start_date must be on or before end_date');
  }
  if (!isEmail(data.submitted_by_email)) {
    return fail('submitted_by_email must be a valid email');
  }
  if (data.contact_email && !isEmail(data.contact_email)) {
    return fail('contact_email is not a valid email');
  }

  const dayOrOvernight = ((data.day_or_overnight as DayOrOvernight) ?? 'day') as DayOrOvernight;
  if (!['day', 'overnight'].includes(dayOrOvernight)) {
    return fail('day_or_overnight must be "day" or "overnight"');
  }
  const skillLevel = ((data.skill_level as SkillLevel) ?? 'all') as SkillLevel;
  if (!['beginner', 'intermediate', 'advanced', 'all'].includes(skillLevel)) {
    return fail('skill_level invalid');
  }
  const spotsStatus = ((data.spots_status as SpotsStatus) ?? 'open') as SpotsStatus;
  if (!['open', 'waitlist', 'full'].includes(spotsStatus)) {
    return fail('spots_status invalid');
  }

  // Length sanity.
  if (data.description!.length < 30 || data.description!.length > 4000) {
    return fail('description must be between 30 and 4000 characters');
  }
  if (data.name!.length > 200) return fail('name too long');

  // Geocode (best-effort; phase 1 stores null if Nominatim fails).
  let lat: number | null = null;
  let lon: number | null = null;
  try {
    const g = await geocode(data.address!, data.city!, data.state!, data.zip!);
    if (g) {
      lat = g.lat;
      lon = g.lon;
    }
  } catch {
    // ignore — moderation can fix it later
  }

  const id = generateCampId();
  const slug = await uniqueSlug(env.DB, data.name!);
  const submittedAt = new Date().toISOString();

  await upsertSubmitterOnSubmission(env.DB, data.submitted_by_email!.toLowerCase());

  await insertCamp(env.DB, {
    id,
    slug,
    name: data.name!,
    sport: data.sport!,
    age_min: ageMin,
    age_max: ageMax,
    start_date: data.start_date!,
    end_date: data.end_date!,
    address: data.address!,
    city: data.city!,
    state: data.state!.toUpperCase(),
    zip: data.zip!,
    latitude: lat,
    longitude: lon,
    description: data.description!,
    price_text: data.price_text ?? null,
    day_or_overnight: dayOrOvernight,
    skill_level: skillLevel,
    spots_status: spotsStatus,
    contact_email: data.contact_email ?? null,
    contact_phone: data.contact_phone ?? null,
    website_url: data.website_url ?? null,
    lunch_included: data.lunch_included === 'true' || data.lunch_included === 'on',
    aftercare_available: data.aftercare_available === 'true' || data.aftercare_available === 'on',
    submitted_by_email: data.submitted_by_email!.toLowerCase(),
    submitted_at: submittedAt,
  });

  return ok({ ok: true, id, slug, status: 'pending' });
};
