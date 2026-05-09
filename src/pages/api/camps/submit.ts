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
  geocodeCached,
  generateCampId,
  uniqueSlug,
  upsertSubmitterOnSubmission,
  shouldAutoApprove,
  incrementSubmitterApproved,
  listCampsAtAddressForSubmit,
  upsertDomainQuality,
  updateUrlHealth,
  extractDomain,
  findFuzzyCampMatches,
  type ConfidenceLevel,
  type DayOrOvernight,
  type ProgramType,
  type SkillLevel,
  type SpotsStatus,
} from '../../../lib/camps-db';
import { checkUrlHealth } from '../../../lib/url-health';

export const prerender = false;

interface SubmitPayload {
  // honeypot
  website?: string;
  // duplicate-address ack ("yes, this is a different program at the same address")
  confirm_duplicate?: string;
  // bulk-import shared secret (matched against env.BULK_IMPORT_TOKEN). When
  // present and correct, the row is inserted as status='approved' with
  // awaiting_review=1 — public on the site immediately, still in admin queue.
  import_token?: string;
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
  // Phase 6 quality fields
  confidence?: string;
  source_domain?: string;
  // Program type + league-specific fields (migration 0005)
  program_type?: string;
  registration_deadline?: string;
  schedule_text?: string;
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
  try {
    return (await req.json()) as SubmitPayload;
  } catch {
    return {};
  }
}

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env as { DB: D1Database; BULK_IMPORT_TOKEN?: string } | undefined;
  if (!env?.DB) return fail('database not available', 500);

  const data = await readPayload(request);

  if (data.website && data.website.trim().length > 0) {
    return ok({ ok: true });
  }

  const missing = REQUIRED.filter((k) => !data[k] || String(data[k]).trim() === '');
  if (missing.length) {
    return fail(`missing required fields: ${missing.join(', ')}`);
  }

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
  const programType = ((data.program_type ?? 'camp').toLowerCase() as ProgramType);
  if (!['camp', 'league'].includes(programType)) {
    return fail('program_type must be "camp" or "league"');
  }
  if (data.registration_deadline && !isIsoDate(data.registration_deadline)) {
    return fail('registration_deadline must be YYYY-MM-DD');
  }

  if (data.description!.length < 30 || data.description!.length > 4000) {
    return fail('description must be between 30 and 4000 characters');
  }
  if (data.name!.length > 200) return fail('name too long');

  if (data.confirm_duplicate !== 'true' && data.confirm_duplicate !== 'on') {
    const existing = await listCampsAtAddressForSubmit(env.DB, data.address!, data.city!, data.zip!);
    if (existing.length > 0) {
      return ok({
        ok: false,
        warning: 'duplicate_address',
        existing: existing.map((c) => ({
          name: c.name,
          sport: c.sport,
          status: c.status,
          slug: c.slug,
        })),
        message: `We already have ${existing.length} ${existing.length === 1 ? 'camp' : 'camps'} at this address. If this is a separate program, resubmit with confirm_duplicate=true.`,
      });
    }
  }

  let lat: number | null = null;
  let lon: number | null = null;
  try {
    const g = await geocodeCached(env.DB, data.address!, data.city!, data.state!, data.zip!);
    if (g) {
      lat = g.lat;
      lon = g.lon;
    }
  } catch {
    // ignore
  }

  const id = generateCampId();
  const slug = await uniqueSlug(env.DB, data.name!);
  const submittedAt = new Date().toISOString();

  const submitterEmail = data.submitted_by_email!.toLowerCase();
  await upsertSubmitterOnSubmission(env.DB, submitterEmail);
  const trustedAutoApprove = await shouldAutoApprove(env.DB, submitterEmail);

  // Bulk-import auto-approve: when the caller presents the right shared secret,
  // the row goes live immediately AND is flagged for admin review. This is the
  // CSV import flow's "--auto-approve" path. Constant-time-ish compare; the
  // token isn't a password so plain equality is acceptable here.
  const bulkImportApprove =
    Boolean(env.BULK_IMPORT_TOKEN) &&
    typeof data.import_token === 'string' &&
    data.import_token.length > 0 &&
    data.import_token === env.BULK_IMPORT_TOKEN;

  const autoApprove = trustedAutoApprove || bulkImportApprove;

  const rawConfidence = (data.confidence ?? '').toLowerCase().trim();
  const confidence: ConfidenceLevel =
    rawConfidence === 'high' || rawConfidence === 'low' || rawConfidence === 'medium'
      ? (rawConfidence as ConfidenceLevel)
      : 'medium';

  const normalizedWebsite = data.website_url
    ? (/^https?:\/\//i.test(data.website_url.trim()) ? data.website_url.trim() : `https://${data.website_url.trim()}`)
    : null;
  const sourceDomain =
    (data.source_domain && data.source_domain.trim().toLowerCase()) ||
    extractDomain(normalizedWebsite);

  // Pre-flight URL gate: refuse submissions whose website_url has previously been
  // killed as dead, OR whose URL doesn't load right now. This prevents the LLM
  // import flow from re-introducing dead links we already triaged out, and stops
  // fabricated URLs from making it past the import boundary.
  if (normalizedWebsite) {
    const fuzzyHits = await findFuzzyCampMatches(env.DB, {
      name: data.name!,
      city: data.city!,
      state: data.state!.toUpperCase(),
      zip: data.zip!,
      address: data.address!,
      website_url: normalizedWebsite,
    });
    const previouslyKilled = fuzzyHits.find((m) => m.reason === 'previously-rejected-dead-url');
    if (previouslyKilled) {
      return fail(
        `URL was previously rejected as dead and is on the do-not-import list. ` +
        `If the operator has fixed it, update the existing rejected camp's URL ` +
        `instead of re-submitting. Existing slug: ${previouslyKilled.camp.slug}`,
        422,
      );
    }

    // Check the URL is actually reachable right now. If it's dead/timeout, refuse
    // the submit so the import flow can correct or skip it before it becomes a
    // queue problem we have to clean up later.
    let liveCheck;
    try {
      liveCheck = await checkUrlHealth(normalizedWebsite);
    } catch {
      liveCheck = { status: 'dead' as const, statusCode: null, finalUrl: null };
    }
    if (liveCheck.status === 'dead' || liveCheck.status === 'timeout') {
      return fail(
        `Website URL did not respond as live. Status: ${liveCheck.status}` +
        (liveCheck.statusCode ? ` (HTTP ${liveCheck.statusCode})` : '') +
        `. Verify you copied the URL from the actual page in your browser. ` +
        `Constructed URLs (e.g., guessing /camps/<sport>/<season>/) almost always ` +
        `404. Either fix the URL or use the operator's parent listing page.`,
        422,
      );
    }
  }

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
    website_url: normalizedWebsite,
    lunch_included: data.lunch_included === 'true' || data.lunch_included === 'on',
    aftercare_available: data.aftercare_available === 'true' || data.aftercare_available === 'on',
    submitted_by_email: submitterEmail,
    submitted_at: submittedAt,
    confidence,
    source_domain: sourceDomain,
    program_type: programType,
    registration_deadline: data.registration_deadline?.trim() ? data.registration_deadline.trim() : null,
    schedule_text: data.schedule_text?.trim() ? data.schedule_text.trim() : null,
  }, autoApprove ? 'approved' : 'pending', bulkImportApprove);

  if (autoApprove) {
    await incrementSubmitterApproved(env.DB, submitterEmail);
  }

  await upsertDomainQuality(env.DB, sourceDomain, 'submitted', confidence);
  if (autoApprove) {
    await upsertDomainQuality(env.DB, sourceDomain, 'approved');
  }

  if (normalizedWebsite) {
    try {
      const health = await checkUrlHealth(normalizedWebsite);
      await updateUrlHealth(env.DB, id, health.status, health.statusCode);
    } catch {
      // ignore
    }
  }

  return ok({
    ok: true,
    id,
    slug,
    status: autoApprove ? 'approved' : 'pending',
    awaiting_review: bulkImportApprove,
  });
};
