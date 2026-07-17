import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');
const [production, staging, disclosure, terms, layout, headers, submit, suggest, trust, camps] = await Promise.all([
  read('wrangler.production.jsonc'), read('wrangler.jsonc'),
  read('src/pages/disclosure.astro'), read('src/pages/terms.astro'),
  read('src/layouts/BaseLayout.astro'), read('public/_headers'),
  read('src/pages/camps/submit.astro'), read('src/pages/camps/suggest.astro'),
  read('src/pages/trust.astro'), read('src/pages/camps/index.astro'),
]);

const failures = [];
const requireText = (text, pattern, message) => { if (!pattern.test(text)) failures.push(message); };
const rejectText = (text, pattern, message) => { if (pattern.test(text)) failures.push(message); };

for (const [name, config] of [['production', production], ['staging', staging]]) {
  for (const flag of ['CAMP_CLAIMS_ENABLED', 'CAMP_REVIEWS_ENABLED', 'TRUST_INTAKE_ENABLED', 'DEMAND_TELEMETRY_ENABLED']) {
    requireText(config, new RegExp(`"${flag}"\\s*:\\s*"false"`), `${name}: ${flag} must remain default-off`);
  }
}

requireText(disclosure, /claiming and public reviews are not currently open/i, 'privacy notice must describe claims/reviews as closed');
rejectText(disclosure, /Camp operators can claim their own listing/i, 'privacy notice still promises live claiming');
requireText(disclosure, /Nominatim service/i, 'privacy notice must disclose the ZIP geocoding recipient');
requireText(disclosure, /osmfoundation\.org\/wiki\/Privacy_Policy/i, 'privacy notice must link the geocoding provider privacy policy');
requireText(disclosure, /future marketing sends (are suppressed|must be suppressed before delivery is activated)/i, 'newsletter notice must distinguish suppression from deletion');

requireText(terms, /search-demand logging is currently disabled/i, 'terms must describe demand telemetry as disabled');
requireText(terms, /do not store a raw IP address, referrer, browser or user-agent/i, 'terms must match minimized search-event fields');
rejectText(terms, /we log your search query.*browser type and referring page/is, 'terms still promise legacy search fields');

rejectText(layout, /\.catch\(\(\) =>\s*\{\s*loadGAScript\(/s, 'analytics must fail closed when regional lookup fails');
requireText(headers, /Permissions-Policy:.*geolocation=\(\)/i, 'static policy must keep browser geolocation disabled');
rejectText(camps, /navigator\.geolocation|getCurrentPosition\s*\(/i, 'camp directory must not attempt precise browser geolocation');

for (const [name, form] of [['camp submit', submit], ['camp suggest', suggest], ['trust request', trust]]) {
  requireText(form, /href="\/disclosure\/"/, `${name}: collection notice must link privacy disclosure`);
}

const nominatimCalls = camps.match(/nominatim\.openstreetmap\.org\/search/g) ?? [];
if (nominatimCalls.length !== 1) failures.push(`ZIP lookup must have exactly one user-triggered Nominatim request; found ${nominatimCalls.length}`);

if (failures.length) {
  console.error(`Public policy contract failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Public policy contract passed: disabled features, collection notices, minimized telemetry, no precise geolocation, analytics geo fail-closed, and bounded ZIP lookup are aligned.');
