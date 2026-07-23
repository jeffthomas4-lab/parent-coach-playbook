#!/usr/bin/env node
// scripts/sweep-proof.mjs
//
// Scheduled sweep, per 15-07 Social Proof Page Standard, "Collecting the
// proof: the inbox," method 3. This script WOULD query Google Places
// Details/Reviews and Yelp Fusion for the organization's public reviews and
// append any new ones to src/data/proof-inbox.json via the same `add` path
// scripts/proof.mjs uses, with capturedVia: "sweep" and status: "new".
//
// Gated on env. If the required keys or ids are not set, this prints what is
// needed and exits 0. That is not an error, it just means the sweep is not configured yet.
// Nothing ever gets hardcoded here: no key, no id, ever lives in this file.
//
// Required env to actually run:
//   GOOGLE_PLACES_API_KEY   Cloudflare Worker secret / local env var
//   GOOGLE_PLACE_ID         the org's Google Place ID
//   YELP_API_KEY            Cloudflare Worker secret / local env var
//   YELP_BUSINESS_ID        the org's Yelp business id (alias)
//
// TODO(jeff): set these once Parent Coach Desk has a claimed Google Business
// Profile and Yelp business page to sweep. Until then this script is a no-op
// scaffold. Run it any time, it just tells you what is missing.
//
// TODO: once keys exist, wire this into a Cloudflare cron trigger or a
// GitHub Actions scheduled workflow (same pattern as
// .github/workflows/camps-sweep-cron.yml) rather than running it by hand.

import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROOF_CLI = path.join(__dirname, 'proof.mjs');

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const GOOGLE_PLACE_ID = process.env.GOOGLE_PLACE_ID;
const YELP_API_KEY = process.env.YELP_API_KEY;
const YELP_BUSINESS_ID = process.env.YELP_BUSINESS_ID;

const googleReady = Boolean(GOOGLE_PLACES_API_KEY && GOOGLE_PLACE_ID);
const yelpReady = Boolean(YELP_API_KEY && YELP_BUSINESS_ID);

function addCandidate(candidate) {
  execFileSync(process.execPath, [PROOF_CLI, 'add', '--json', JSON.stringify(candidate)], {
    stdio: 'inherit',
  });
}

// TODO: Google Places Details request, `reviews` field.
// https://developers.google.com/maps/documentation/places/web-service/place-details
// Only the fields needed for the candidate schema. Never store the raw API
// response, never fabricate a field the response does not actually contain.
async function sweepGoogle() {
  const url = new URL('https://maps.googleapis.com/maps/api/place/details/json');
  url.searchParams.set('place_id', GOOGLE_PLACE_ID);
  url.searchParams.set('fields', 'reviews');
  url.searchParams.set('key', GOOGLE_PLACES_API_KEY);

  const res = await fetch(url);
  if (!res.ok) {
    console.error(`Google Places request failed: ${res.status} ${res.statusText}`);
    return 0;
  }
  const data = await res.json();
  const reviews = data?.result?.reviews ?? [];
  let added = 0;
  for (const review of reviews) {
    if (!review?.text || !review?.author_name) continue; // never fabricate a missing field
    addCandidate({
      quote: String(review.text).trim(),
      name: String(review.author_name).trim(),
      source: 'google',
      sourceUrl: review.author_url || undefined,
      product: 'site-wide', // TODO: no per-product signal from Google reviews; site-wide is the honest default
      capturedVia: 'sweep',
    });
    added += 1;
  }
  return added;
}

// TODO: Yelp Fusion Reviews request.
// https://docs.developer.yelp.com/reference/v3_business_reviews
async function sweepYelp() {
  const res = await fetch(`https://api.yelp.com/v3/businesses/${encodeURIComponent(YELP_BUSINESS_ID)}/reviews`, {
    headers: { Authorization: `Bearer ${YELP_API_KEY}` },
  });
  if (!res.ok) {
    console.error(`Yelp Fusion request failed: ${res.status} ${res.statusText}`);
    return 0;
  }
  const data = await res.json();
  const reviews = data?.reviews ?? [];
  let added = 0;
  for (const review of reviews) {
    if (!review?.text || !review?.user?.name) continue;
    addCandidate({
      quote: String(review.text).trim(),
      name: String(review.user.name).trim(),
      source: 'yelp',
      sourceUrl: review.url || undefined,
      product: 'site-wide',
      capturedVia: 'sweep',
    });
    added += 1;
  }
  return added;
}

async function main() {
  if (!googleReady && !yelpReady) {
    console.log('proof sweep: not configured yet. Nothing to do (exiting 0, this is expected).');
    console.log('  Google: set GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID to enable.');
    console.log('  Yelp:   set YELP_API_KEY and YELP_BUSINESS_ID to enable.');
    return;
  }

  let total = 0;
  if (googleReady) {
    console.log('Sweeping Google Places reviews...');
    total += await sweepGoogle();
  } else {
    console.log('Skipping Google sweep: GOOGLE_PLACES_API_KEY or GOOGLE_PLACE_ID not set.');
  }

  if (yelpReady) {
    console.log('Sweeping Yelp Fusion reviews...');
    total += await sweepYelp();
  } else {
    console.log('Skipping Yelp sweep: YELP_API_KEY or YELP_BUSINESS_ID not set.');
  }

  console.log(`Sweep done. ${total} new candidate(s) added to the pile (see: node scripts/proof.mjs list --status new).`);
}

main().catch((err) => {
  console.error('proof sweep failed:', err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
