globalThis.process ??= {}; globalThis.process.env ??= {};
const REJECT_REASON_CODES = [
  { code: "duplicate", label: "Duplicate of an existing camp" },
  { code: "dead-url", label: "Dead URL (registration link broken)" },
  { code: "unverifiable-address", label: "Address can't be verified" },
  { code: "missing-required-field", label: "Missing a required field" },
  { code: "off-brand", label: "Off-brand (pure travel-club operator, etc.)" },
  { code: "past-date", label: "Dates already past" },
  { code: "aggregator-source", label: "Pulled from an aggregator, not the camp's own page" },
  { code: "low-confidence", label: "Too many fields inferred or unclear" },
  { code: "spam", label: "Spam" },
  { code: "other", label: "Other" }
];
const nowIso = () => (/* @__PURE__ */ new Date()).toISOString();
function extractDomain(url) {
  if (!url) return null;
  try {
    const u = new URL(url.trim());
    return u.hostname.replace(/^www\./, "").toLowerCase() || null;
  } catch {
    return null;
  }
}
const SHARED_PLATFORM_HOSTS = /* @__PURE__ */ new Set([
  "anc.apm.activecommunities.com",
  "apm.activecommunities.com",
  "activecommunities.com",
  "secure.rec1.com",
  "rec1.com",
  "app.jackrabbitclass.com",
  "register.communitypass.net",
  "register.skyhawks.com",
  "campwise.com",
  "gomotionapp.com",
  "teamsnap.com",
  "leagueapps.com",
  "reg.sportsengine.com",
  "sportsengine.com",
  "readysetregister.com"
]);
function extractOrgKey(url) {
  if (!url) return null;
  try {
    const u = new URL(url.trim());
    const host = u.hostname.replace(/^www\./, "").toLowerCase();
    if (!host) return null;
    if (SHARED_PLATFORM_HOSTS.has(host)) {
      const segs = u.pathname.split("/").filter(Boolean);
      const slug = (segs[0] ?? "").toLowerCase();
      return slug ? `${host}/${slug}` : host;
    }
    return host;
  } catch {
    return null;
  }
}
async function getSubmitter(db, email) {
  const row = await db.prepare("SELECT * FROM submitters WHERE email = ?").bind(email).first();
  return row ?? null;
}
async function upsertSubmitterOnSubmission(db, email, notes = null) {
  const now = nowIso();
  await db.prepare(
    `INSERT INTO submitters (email, trust_level, submission_count, approved_count, first_submitted_at, last_submitted_at, notes)
       VALUES (?, 'new', 1, 0, ?, ?, ?)
       ON CONFLICT(email) DO UPDATE SET
         submission_count = submission_count + 1,
         last_submitted_at = excluded.last_submitted_at`
  ).bind(email, now, now, notes).run();
  const updated = await getSubmitter(db, email);
  if (!updated) throw new Error(`Submitter upsert failed for ${email}`);
  return updated;
}
async function incrementSubmitterApproved(db, email) {
  await db.prepare("UPDATE submitters SET approved_count = approved_count + 1 WHERE email = ?").bind(email).run();
}
async function setSubmitterTrustLevel(db, email, trust) {
  await db.prepare("UPDATE submitters SET trust_level = ? WHERE email = ?").bind(trust, email).run();
}
async function insertCamp(db, camp, status = "pending", awaitingReview = false) {
  const sourceDomain = camp.source_domain ?? extractDomain(camp.website_url) ?? extractDomain(null);
  await db.prepare(
    `INSERT INTO camps (
         id, slug, name, sport, age_min, age_max, start_date, end_date,
         address, city, state, zip, latitude, longitude,
         description, price_text, day_or_overnight, skill_level, spots_status,
         contact_email, contact_phone, website_url, lunch_included, aftercare_available,
         status, submitted_by_email, submitted_at, reviewed_by, reviewed_at,
         program_type, registration_deadline, schedule_text,
         confidence, source_domain
       )
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    camp.id,
    camp.slug,
    camp.name,
    camp.sport,
    camp.age_min,
    camp.age_max,
    camp.start_date,
    camp.end_date,
    camp.address,
    camp.city,
    camp.state,
    camp.zip,
    camp.latitude,
    camp.longitude,
    camp.description,
    camp.price_text,
    camp.day_or_overnight,
    camp.skill_level,
    camp.spots_status,
    camp.contact_email,
    camp.contact_phone,
    camp.website_url,
    camp.lunch_included ? 1 : 0,
    camp.aftercare_available ? 1 : 0,
    status,
    camp.submitted_by_email,
    camp.submitted_at,
    status === "approved" ? "auto-approve (trusted submitter)" : null,
    status === "approved" ? camp.submitted_at : null,
    camp.program_type ?? "camp",
    camp.registration_deadline ?? null,
    camp.schedule_text ?? null,
    camp.confidence ?? "medium",
    sourceDomain
  ).run();
  if (awaitingReview) {
    await db.prepare("UPDATE camps SET awaiting_review = 1 WHERE id = ?").bind(camp.id).run();
  }
}
async function getCampById(db, id) {
  const row = await db.prepare("SELECT * FROM camps WHERE id = ?").bind(id).first();
  return row ?? null;
}
function todayDateISO() {
  return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
async function getCampBySlug(db, slug) {
  const row = await db.prepare("SELECT * FROM camps WHERE slug = ?").bind(slug).first();
  if (!row) return null;
  if (row.end_date && row.end_date < todayDateISO()) return null;
  return row;
}
async function listApprovedCamps(db) {
  const result = await db.prepare("SELECT * FROM camps WHERE status = ? AND end_date >= ? ORDER BY start_date ASC").bind("approved", todayDateISO()).all();
  return result.results ?? [];
}
async function listPendingCamps(db) {
  const result = await db.prepare(
    "SELECT * FROM camps WHERE status = 'pending' OR awaiting_review = 1 ORDER BY submitted_at ASC"
  ).all();
  return result.results ?? [];
}
async function listApprovedUnverifiedCamps(db) {
  const result = await db.prepare("SELECT * FROM camps WHERE status = 'approved' AND verified = 0 ORDER BY submitted_at DESC").all();
  return result.results ?? [];
}
async function listAllCampSlugsApproved(db) {
  const result = await db.prepare("SELECT slug FROM camps WHERE status = ? AND end_date >= ?").bind("approved", todayDateISO()).all();
  return (result.results ?? []).map((r) => r.slug);
}
function slugifyCity(s) {
  return (s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
async function listCampsByState(db, state) {
  const result = await db.prepare("SELECT * FROM camps WHERE status = ? AND state = ? AND end_date >= ? ORDER BY start_date ASC").bind("approved", state.toUpperCase(), todayDateISO()).all();
  return result.results ?? [];
}
async function listCampsByCity(db, state, citySlug) {
  const rows = await listCampsByState(db, state);
  const want = citySlug.toLowerCase();
  return rows.filter((c) => slugifyCity(c.city) === want);
}
async function listCampsByCitySport(db, state, citySlug, sport) {
  const result = await db.prepare("SELECT * FROM camps WHERE status = ? AND state = ? AND sport = ? AND end_date >= ? ORDER BY start_date ASC").bind("approved", state.toUpperCase(), sport, todayDateISO()).all();
  const rows = result.results ?? [];
  const want = citySlug.toLowerCase();
  return rows.filter((c) => slugifyCity(c.city) === want);
}
async function listStatesWithCounts(db) {
  const result = await db.prepare("SELECT state, COUNT(*) AS count FROM camps WHERE status = 'approved' AND end_date >= ? GROUP BY state ORDER BY count DESC").bind(todayDateISO()).all();
  return result.results ?? [];
}
async function listCitiesInState(db, state) {
  const result = await db.prepare("SELECT city, COUNT(*) AS count FROM camps WHERE status = 'approved' AND state = ? AND end_date >= ? GROUP BY city ORDER BY count DESC").bind(state.toUpperCase(), todayDateISO()).all();
  return result.results ?? [];
}
async function approveCamp(db, id, reviewer, notes = null) {
  const camp = await getCampById(db, id);
  if (!camp) return null;
  await db.prepare(
    `UPDATE camps SET status = 'approved', awaiting_review = 0, reviewed_by = ?, reviewed_at = ?, review_notes = ? WHERE id = ?`
  ).bind(reviewer, nowIso(), notes, id).run();
  if (!(camp.status === "approved" && camp.awaiting_review === 1)) {
    await incrementSubmitterApproved(db, camp.submitted_by_email);
  }
  return getCampById(db, id);
}
async function rejectCamp(db, id, reviewer, notes = null, reasonCode = null) {
  await db.prepare(
    `UPDATE camps SET status = 'rejected', awaiting_review = 0, reviewed_by = ?, reviewed_at = ?, review_notes = ?, reject_reason_code = ? WHERE id = ?`
  ).bind(reviewer, nowIso(), notes, reasonCode, id).run();
  return getCampById(db, id);
}
const EDITABLE_TEXT_COLUMNS = [
  "name",
  "slug",
  "sport",
  "start_date",
  "end_date",
  "address",
  "city",
  "state",
  "zip",
  "description",
  "price_text",
  "day_or_overnight",
  "skill_level",
  "spots_status",
  "contact_email",
  "contact_phone",
  "website_url",
  "program_type",
  "registration_deadline",
  "schedule_text"
];
const EDITABLE_INT_COLUMNS = ["age_min", "age_max"];
const EDITABLE_BOOL_COLUMNS = ["lunch_included", "aftercare_available"];
const EDITABLE_REAL_COLUMNS = ["latitude", "longitude"];
async function updateCamp(db, id, fields, editorEmail) {
  const sets = [];
  const values = [];
  const push = (col, value) => {
    sets.push(`${col} = ?`);
    values.push(value);
  };
  for (const col of EDITABLE_TEXT_COLUMNS) {
    if (col in fields) push(col, fields[col] ?? null);
  }
  for (const col of EDITABLE_INT_COLUMNS) {
    if (col in fields) push(col, fields[col] ?? null);
  }
  for (const col of EDITABLE_REAL_COLUMNS) {
    if (col in fields) push(col, fields[col] ?? null);
  }
  for (const col of EDITABLE_BOOL_COLUMNS) {
    if (col in fields) {
      const v = fields[col];
      push(col, v ? 1 : 0);
    }
  }
  if (sets.length === 0) return getCampById(db, id);
  sets.push("last_edited_at = ?");
  values.push(nowIso());
  sets.push("last_edited_by = ?");
  values.push(editorEmail);
  values.push(id);
  await db.prepare(`UPDATE camps SET ${sets.join(", ")} WHERE id = ?`).bind(...values).run();
  return getCampById(db, id);
}
function generateCampId() {
  return crypto.randomUUID();
}
function slugify(input) {
  return input.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}
async function uniqueSlug(db, base) {
  let slug = slugify(base);
  if (!slug) slug = "camp";
  const existing = await getCampBySlug(db, slug);
  if (!existing) return slug;
  for (let i = 0; i < 50; i += 1) {
    const candidate = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
    const conflict = await getCampBySlug(db, candidate);
    if (!conflict) return candidate;
  }
  return `${slug}-${crypto.randomUUID().slice(0, 8)}`;
}
async function insertClaim(db, claim) {
  await db.prepare(
    `INSERT INTO camp_claims (id, camp_id, claimant_email, claimant_name, organization, phone, notes, status, submitted_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?)`
  ).bind(
    claim.id,
    claim.camp_id,
    claim.claimant_email,
    claim.claimant_name,
    claim.organization,
    claim.phone,
    claim.notes,
    claim.submitted_at
  ).run();
}
async function listPendingClaims(db) {
  const result = await db.prepare("SELECT * FROM camp_claims WHERE status IN ('pending', 'verified') ORDER BY submitted_at ASC").all();
  return result.results ?? [];
}
async function getClaimById(db, id) {
  const row = await db.prepare("SELECT * FROM camp_claims WHERE id = ?").bind(id).first();
  return row ?? null;
}
async function updateClaimStatus(db, id, status, reviewer, notes = null) {
  await db.prepare(
    `UPDATE camp_claims SET status = ?, reviewed_by = ?, reviewed_at = ?, review_notes = ? WHERE id = ?`
  ).bind(status, reviewer, nowIso(), notes, id).run();
  return getClaimById(db, id);
}
async function markCampClaimed(db, campId, claimantEmail, paidUntilISO) {
  const oneYear = /* @__PURE__ */ new Date();
  oneYear.setFullYear(oneYear.getFullYear() + 1);
  const paidUntil = paidUntilISO ?? oneYear.toISOString().slice(0, 10);
  await db.prepare(
    `UPDATE camps SET is_claimed = 1, claimed_by_email = ?, claim_paid_until = ? WHERE id = ?`
  ).bind(claimantEmail, paidUntil, campId).run();
}
function generateClaimId() {
  return crypto.randomUUID();
}
async function listOtherCampsAtAddress(db, address, city, zip, excludeId) {
  const today = todayDateISO();
  const result = await db.prepare(
    `SELECT * FROM camps
         WHERE status = 'approved'
           AND end_date >= ?
           AND LOWER(TRIM(address)) = LOWER(TRIM(?))
           AND LOWER(TRIM(city)) = LOWER(TRIM(?))
           AND TRIM(zip) = TRIM(?)
           ${excludeId ? "AND id != ?" : ""}
         ORDER BY start_date ASC`
  ).bind(...excludeId ? [today, address, city, zip, excludeId] : [today, address, city, zip]).all();
  return result.results ?? [];
}
async function listCampsAtAddressForSubmit(db, address, city, zip) {
  const result = await db.prepare(
    `SELECT * FROM camps
         WHERE status IN ('approved', 'pending')
           AND LOWER(TRIM(address)) = LOWER(TRIM(?))
           AND LOWER(TRIM(city)) = LOWER(TRIM(?))
           AND TRIM(zip) = TRIM(?)
         ORDER BY name ASC`
  ).bind(address, city, zip).all();
  return result.results ?? [];
}
async function setVerified(db, id, verified) {
  await db.prepare("UPDATE camps SET verified = ? WHERE id = ?").bind(verified ? 1 : 0, id).run();
}
async function setHeroPhotoKey(db, id, key) {
  await db.prepare("UPDATE camps SET hero_photo_key = ? WHERE id = ?").bind(key, id).run();
}
const canonicalizeAddress = (address, city, state, zip) => `${address.trim().toLowerCase()}|${city.trim().toLowerCase()}|${state.trim().toUpperCase()}|${zip.trim()}`;
async function hashAddress(canonical) {
  const data = new TextEncoder().encode(canonical);
  const hashBuf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function getCachedGeocode(db, address, city, state, zip) {
  const canonical = canonicalizeAddress(address, city, state, zip);
  const hash = await hashAddress(canonical);
  const row = await db.prepare("SELECT latitude, longitude FROM geocoded_addresses WHERE address_hash = ?").bind(hash).first();
  if (!row) return null;
  return { lat: row.latitude, lon: row.longitude };
}
async function putCachedGeocode(db, address, city, state, zip, lat, lon) {
  const canonical = canonicalizeAddress(address, city, state, zip);
  const hash = await hashAddress(canonical);
  await db.prepare(
    `INSERT INTO geocoded_addresses (address_hash, address_canonical, latitude, longitude, cached_at)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(address_hash) DO UPDATE SET latitude = excluded.latitude, longitude = excluded.longitude, cached_at = excluded.cached_at`
  ).bind(hash, canonical, lat, lon, nowIso()).run();
}
async function geocodeCached(db, address, city, state, zip) {
  const cached = await getCachedGeocode(db, address, city, state, zip);
  if (cached) return cached;
  const fresh = await geocode(address, city, state, zip);
  if (fresh) {
    try {
      await putCachedGeocode(db, address, city, state, zip, fresh.lat, fresh.lon);
    } catch {
    }
  }
  return fresh;
}
async function shouldAutoApprove(db, email) {
  const submitter = await getSubmitter(db, email);
  if (!submitter) return false;
  return submitter.trust_level === "trusted";
}
function haversineMiles(lat1, lon1, lat2, lon2) {
  const toRad = (d) => d * Math.PI / 180;
  const R = 3958.8;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}
async function approvedCampsWithinRadius(db, lat, lon, radiusMiles) {
  const all = await listApprovedCamps(db);
  return all.filter((c) => typeof c.latitude === "number" && typeof c.longitude === "number").map((c) => ({
    camp: c,
    distance: haversineMiles(lat, lon, c.latitude, c.longitude)
  })).filter((x) => x.distance <= radiusMiles).sort((a, b) => a.distance - b.distance).map((x) => x.camp);
}
async function insertReview(db, review) {
  await db.prepare(
    `INSERT INTO camp_reviews (id, camp_id, reviewer_email, reviewer_display_name, rating, body, status, submitted_at)
       VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)`
  ).bind(
    review.id,
    review.camp_id,
    review.reviewer_email,
    review.reviewer_display_name,
    review.rating,
    review.body,
    review.submitted_at
  ).run();
}
async function listApprovedReviewsForCamp(db, campId) {
  const result = await db.prepare("SELECT * FROM camp_reviews WHERE camp_id = ? AND status = 'approved' ORDER BY submitted_at DESC").bind(campId).all();
  return result.results ?? [];
}
async function listPendingReviews(db) {
  const result = await db.prepare("SELECT * FROM camp_reviews WHERE status = 'pending' ORDER BY submitted_at ASC").all();
  return result.results ?? [];
}
async function getReviewById(db, id) {
  const row = await db.prepare("SELECT * FROM camp_reviews WHERE id = ?").bind(id).first();
  return row ?? null;
}
async function approveReview(db, id, reviewer, notes = null) {
  await db.prepare(
    `UPDATE camp_reviews SET status = 'approved', reviewed_by = ?, reviewed_at = ?, review_notes = ? WHERE id = ?`
  ).bind(reviewer, nowIso(), notes, id).run();
  return getReviewById(db, id);
}
async function rejectReview(db, id, reviewer, notes = null) {
  await db.prepare(
    `UPDATE camp_reviews SET status = 'rejected', reviewed_by = ?, reviewed_at = ?, review_notes = ? WHERE id = ?`
  ).bind(reviewer, nowIso(), notes, id).run();
  return getReviewById(db, id);
}
function generateReviewId() {
  return crypto.randomUUID();
}
async function geocode(address, city, state, zip) {
  const q = `${address}, ${city}, ${state} ${zip}`;
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", q);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");
  const res = await fetch(url.toString(), {
    headers: {
      "User-Agent": "parentcoachdesk.com camps directory (parentcoachplaybook@gmail.com)",
      "Accept-Language": "en"
    }
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (!data.length) return null;
  const [first] = data;
  const lat = Number.parseFloat(first.lat);
  const lon = Number.parseFloat(first.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  return { lat, lon };
}
function normalizeCampName(name) {
  const stopwords = /* @__PURE__ */ new Set([
    "camp",
    "camps",
    "the",
    "and",
    "&",
    "a",
    "an",
    "of",
    "at",
    "in",
    "summer",
    "youth",
    "kids",
    "club",
    "academy",
    "sports",
    "sport",
    "inc",
    "llc",
    "corp"
  ]);
  const tokens = name.toLowerCase().replace(/['"`]/g, "").replace(/[^a-z0-9\s]+/g, " ").split(/\s+/).filter((t) => t && !stopwords.has(t));
  return tokens.join(" ").trim();
}
async function findFuzzyCampMatches(db, candidate) {
  const result = await db.prepare(`SELECT * FROM camps WHERE status IN ('approved', 'pending', 'rejected')`).all();
  const all = result.results ?? [];
  const candidateNormName = normalizeCampName(candidate.name);
  const candidateCity = candidate.city.trim().toLowerCase();
  const candidateState = candidate.state.trim().toUpperCase();
  const candidateOrgKey = extractOrgKey(candidate.website_url ?? null);
  const candidateAddress = (candidate.address ?? "").trim().toLowerCase();
  const candidateZip = (candidate.zip ?? "").trim();
  const seen = /* @__PURE__ */ new Map();
  const set = (camp, reason) => {
    if (!seen.has(camp.id)) seen.set(camp.id, { camp, reason });
  };
  for (const c of all) {
    if (c.status === "rejected" && c.reject_reason_code === "dead-url" && candidate.website_url && c.website_url && c.website_url.trim().toLowerCase() === candidate.website_url.trim().toLowerCase()) {
      set(c, "previously-rejected-dead-url");
    }
  }
  for (const c of all) {
    if (c.status === "rejected") continue;
    const cCity = c.city.trim().toLowerCase();
    const cState = c.state.trim().toUpperCase();
    const cName = c.name.trim().toLowerCase();
    const cNormName = normalizeCampName(c.name);
    const cOrgKey = extractOrgKey(c.website_url);
    if (cName === candidate.name.trim().toLowerCase() && cCity === candidateCity && cState === candidateState) {
      set(c, "exact-name-city");
      continue;
    }
    if (cNormName && cNormName === candidateNormName && cCity === candidateCity && cState === candidateState) {
      set(c, "normalized-name-city");
      continue;
    }
    if (candidateOrgKey && cOrgKey && cOrgKey === candidateOrgKey) {
      set(c, "same-website");
      continue;
    }
    if (candidateAddress && candidateZip && c.address.trim().toLowerCase() === candidateAddress && cCity === candidateCity && c.zip.trim() === candidateZip) {
      set(c, "same-address");
      continue;
    }
  }
  return Array.from(seen.values());
}
async function updateUrlHealth(db, id, status, statusCode) {
  await db.prepare(
    `UPDATE camps SET url_health_status = ?, url_last_checked_at = ?, url_last_status_code = ? WHERE id = ?`
  ).bind(status, nowIso(), statusCode, id).run();
}
async function listCampsForUrlSweep(db, beforeIso, limit = 50) {
  const result = await db.prepare(
    `SELECT * FROM camps
         WHERE status = 'approved'
           AND website_url IS NOT NULL
           AND (url_last_checked_at IS NULL OR url_last_checked_at < ?)
         ORDER BY url_last_checked_at ASC NULLS FIRST
         LIMIT ?`
  ).bind(beforeIso, limit).all();
  return result.results ?? [];
}
async function listStaleCamps(db, beforeDate) {
  const result = await db.prepare(
    `SELECT * FROM camps WHERE status = 'approved' AND end_date < ? ORDER BY end_date ASC`
  ).bind(beforeDate).all();
  return result.results ?? [];
}
async function archiveStaleCamps(db, todayDate, reviewer) {
  const stale = await listStaleCamps(db, todayDate);
  for (const c of stale) {
    await rejectCamp(db, c.id, reviewer, "auto-archived past-date", "past-date");
  }
  return stale.length;
}
async function upsertDomainQuality(db, domain, outcome, confidence) {
  if (!domain) return;
  const now = nowIso();
  const submittedDelta = outcome === "submitted" ? 1 : 0;
  const approvedDelta = outcome === "approved" ? 1 : 0;
  const rejectedDelta = outcome === "rejected" ? 1 : 0;
  const highDelta = outcome === "submitted" && confidence === "high" ? 1 : 0;
  const lowDelta = outcome === "submitted" && confidence === "low" ? 1 : 0;
  await db.prepare(
    `INSERT INTO domain_quality
         (domain, submitted_count, approved_count, rejected_count, high_confidence_count, low_confidence_count, last_seen_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(domain) DO UPDATE SET
         submitted_count = submitted_count + ?,
         approved_count = approved_count + ?,
         rejected_count = rejected_count + ?,
         high_confidence_count = high_confidence_count + ?,
         low_confidence_count = low_confidence_count + ?,
         last_seen_at = excluded.last_seen_at`
  ).bind(
    domain,
    submittedDelta,
    approvedDelta,
    rejectedDelta,
    highDelta,
    lowDelta,
    now,
    submittedDelta,
    approvedDelta,
    rejectedDelta,
    highDelta,
    lowDelta
  ).run();
}
async function listDomainQuality(db) {
  const result = await db.prepare(`SELECT * FROM domain_quality ORDER BY submitted_count DESC, last_seen_at DESC`).all();
  return result.results ?? [];
}
async function getDomainQuality(db, domain) {
  const row = await db.prepare("SELECT * FROM domain_quality WHERE domain = ?").bind(domain).first();
  return row ?? null;
}

export { REJECT_REASON_CODES, approveCamp, approveReview, approvedCampsWithinRadius, archiveStaleCamps, extractDomain, extractOrgKey, findFuzzyCampMatches, generateCampId, generateClaimId, generateReviewId, geocode, geocodeCached, getCachedGeocode, getCampById, getCampBySlug, getClaimById, getDomainQuality, getReviewById, getSubmitter, haversineMiles, incrementSubmitterApproved, insertCamp, insertClaim, insertReview, listAllCampSlugsApproved, listApprovedCamps, listApprovedReviewsForCamp, listApprovedUnverifiedCamps, listCampsAtAddressForSubmit, listCampsByCity, listCampsByCitySport, listCampsByState, listCampsForUrlSweep, listCitiesInState, listDomainQuality, listOtherCampsAtAddress, listPendingCamps, listPendingClaims, listPendingReviews, listStaleCamps, listStatesWithCounts, markCampClaimed, normalizeCampName, putCachedGeocode, rejectCamp, rejectReview, setHeroPhotoKey, setSubmitterTrustLevel, setVerified, shouldAutoApprove, slugify, slugifyCity, todayDateISO, uniqueSlug, updateCamp, updateClaimStatus, updateUrlHealth, upsertDomainQuality, upsertSubmitterOnSubmission };
