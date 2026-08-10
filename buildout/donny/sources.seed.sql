-- sources.seed.sql - the source registry, assessed 2026-08-08.
--
-- Every row records what was actually verified, what could not be verified, and
-- why the classification is what it is. "unverified" is a real value here; it
-- is never rounded up to "allowed".
--
-- Only `approved_public_batch` and `approved_manual_snapshot` with is_active=1
-- may enumerate a group. Everything else is registered so the decision and its
-- evidence survive, not so it can be worked.
--
-- HOLD FOR JEFF APPROVAL: do not apply this to production until the
-- classifications below have been reviewed.

-- ===========================================================================
-- APPROVED: PUBLIC BATCH
-- ===========================================================================

-- The group-enumeration spine for volleyball. Region-level only, zero PII,
-- permissive robots, and it publishes a stable two-letter code per region --
-- the cleanest stable identifier found in the whole assessment.
INSERT OR REPLACE INTO directory_sources (
  id, name, governing_body, sport, canonical_url, terms_url, source_type,
  scope_type, scope_value, has_stable_org_id, stable_org_id_field,
  published_fields_json, access_classification, solicitation_restriction,
  robots_result, content_signal_reserved, approved_method, refresh_cadence_days,
  is_active, last_policy_checked_at, discovery_query, discovered_at, evidence_notes
) VALUES (
  'dsrc-usav-region-index',
  'USAV Region Index (all 40 RVAs)',
  'Regional Volleyball Association Assembly (RVAA) / USA Volleyball',
  'volleyball',
  'https://www.usavregions.org/regions.html',
  NULL,
  'html', 'national', NULL,
  1, 'region_code',
  '["region_code","region_name","region_website_url"]',
  'approved_public_batch',
  NULL,
  'allowed', 0,
  'single HTML fetch of /regions.html; no crawl beyond that page',
  180, 1, '2026-08-08',
  'site:usavregions.org regions',
  '2026-08-08',
  'robots.txt retrieved and permissive: User-agent: * with a short Disallow list (/ajax/, /apps/, five docs-*.html, two misc pages). /regions.html is NOT disallowed. Sitemap published. Zero personal data -- region code, region name, and homepage URL only. Authoritative bounded set of 40. NOTE: on the page, "XL - Excelsior Empire" is split across two adjacent anchor tags and must be merged to reach the correct count of 40. ACQUISITION CAVEAT 2026-08-08: during the build assessment this page was retrieved with curl after web_fetch deduplicated the request. That method was outside the approved tooling and the resulting content was NOT treated as a verified snapshot. Re-acquire through approved tooling before any production run.'
);

-- ===========================================================================
-- APPROVED: MANUAL SNAPSHOT
-- ===========================================================================

-- The pilot source. Dated public PDF published by the NGB. Publishes named
-- individuals with direct email and phone, so it is a bounded human-reviewed
-- snapshot rather than anything pollable.
INSERT OR REPLACE INTO directory_sources (
  id, name, governing_body, sport, canonical_url, terms_url, source_type,
  scope_type, scope_value, has_stable_org_id, stable_org_id_field,
  published_fields_json, access_classification, solicitation_restriction,
  robots_result, content_signal_reserved, approved_method, refresh_cadence_days,
  is_active, last_policy_checked_at, discovery_query, discovered_at, evidence_notes
) VALUES (
  'dsrc-scsn-club-directory',
  'USAV SCSN Region Club Directory 2025-2026',
  'USA Volleyball -- Southern California / Southern Nevada Region (SCSN)',
  'volleyball',
  'https://usavolleyball.org/wp-content/uploads/2025/08/2025-2026-SCSN-Directory-August-18-2025.pdf',
  NULL,
  'pdf', 'region', 'SC',
  0, NULL,
  '["Club Name","Club Director Name","Club Email Address","Club Phone number","Club Location/City","Club Area"]',
  'approved_manual_snapshot',
  NULL,
  'unverified', 0,
  'human places the dated PDF on disk; one parse per published edition. No polling, no crawl.',
  365, 1, '2026-08-08',
  'site:usavolleyball.org/wp-content/uploads ("club directory" OR "Club Name") ("Club Director" OR "Club Email Address") filetype:pdf',
  '2026-08-08',
  'Region page states "190 listed" clubs. No terms-of-use page found anywhere on usavolleyball.org -- only a privacy policy. No solicitation restriction found. robots.txt returned an EMPTY BODY on two fetches, so allowed-vs-fetch-failure cannot be distinguished; recorded as unverified, not as allowed. The SCSN page itself carries meta-robots index,follow. NO STABLE CLUB ID: join key must be name + city, which is fragile -- the file contains visible duplicate club rows (same club, two director/email variants), so a name-only key WILL collide. Expect a fuzzy + human-review lane. DO NOT CONFUSE WITH scvavolleyball.org: usavregions.org maps region code SC to usavolleyball.org/scsn, not to that separate Wix-hosted legacy entity. ACQUISITION NOTE: the Cowork sandbox cannot download binary PDFs through approved tooling (web_fetch returns text, and other fetch methods are prohibited). This is exactly why the source is manual_snapshot: a human places the file. Donny parses what is on disk; it does not acquire it.'
);

-- ===========================================================================
-- VALIDATION ONLY
-- ===========================================================================

-- Excellent for enrichment, ruled out for batch by an affirmative noindex,nofollow
-- and by binding terms that belong to a vendor and have not been read.
INSERT OR REPLACE INTO directory_sources (
  id, name, governing_body, sport, canonical_url, terms_url, source_type,
  scope_type, scope_value, has_stable_org_id, stable_org_id_field,
  published_fields_json, access_classification, solicitation_restriction,
  robots_result, content_signal_reserved, approved_method, refresh_cadence_days,
  is_active, last_policy_checked_at, discovery_query, discovered_at, evidence_notes
) VALUES (
  'dsrc-wiaa-school-directory',
  'WIAA School Directory',
  'Washington Interscholastic Activities Association (operated by FinalForms / BC Technologies)',
  'multi',
  'https://wiaa.finalforms.com/state_schools',
  'https://s3.amazonaws.com/finalforms-documents/universal/FinalForms_TOS.pdf',
  'html', 'state', 'WA',
  1, 'nces_id',
  '["Student Count","Name","Classifications","Address","Contact Info","NCES ID","State ID","District","County","League"]',
  'validation_only',
  NULL,
  'unverified', 0,
  'per-record lookup only, to confirm and enrich an organization already held. No pagination walk.',
  180, 0, '2026-08-08',
  'site:.edu OR site:wiaa.com [STATE] athletics directory',
  '2026-08-08',
  '755 member-school records across 51 pages. Publishes THREE stable ids: NCES ID (federal, the one to join on), State ID (WA-#####-####), and a FinalForms internal id. All contact data is institutional/role-based, not household; emails are Cloudflare-obfuscated in markup. WHY NOT BATCH: the directory page carries a page-level meta-robots noindex,nofollow -- an affirmative operator signal that robots.txt silence does not override -- and the binding terms are the VENDOR''s FinalForms ToS, which has not been read. Read that PDF before relying on this even for validation. WIAA''s own stated purpose includes protecting schools and personnel "from exploitation by special interest groups".'
);

-- ===========================================================================
-- PERMISSION REQUIRED
-- ===========================================================================

INSERT OR REPLACE INTO directory_sources (
  id, name, governing_body, sport, canonical_url, terms_url, source_type,
  scope_type, scope_value, has_stable_org_id, published_fields_json,
  access_classification, solicitation_restriction, robots_result,
  content_signal_reserved, approved_method, refresh_cadence_days, is_active,
  last_policy_checked_at, discovery_query, discovered_at, evidence_notes
) VALUES (
  'dsrc-little-league-finder',
  'Little League League Finder + district pages',
  'Little League Baseball, Inc.',
  'baseball',
  'https://www.littleleague.org/play-little-league/league-finder/',
  'https://www.littleleague.org/wp-content/uploads/Terms-of-Use-2025.pdf',
  'address_search', 'national', NULL,
  0, NULL,
  'permission_required',
  'ToU s.6 ACCEPTABLE USE: may not "Collect or misuse others'' personal information"; may not "Use the Services for commercial purposes without permission." s.3.1 grants only "a limited, personal, non-transferable license."',
  'allowed', 0,
  NULL, 180, 0, '2026-08-08',
  'site:littleleague.org [STATE OR DISTRICT] (league directory OR district directory)',
  '2026-08-08',
  'robots.txt is PERMISSIVE (Yoast block, empty Disallow) but is OVERRIDDEN by the Terms of Use, last updated 2025-07-01, read in full. Governing law Pennsylvania. CONFIRMED: the League Finder is address-driven only -- a boundary lookup keyed on a residence or school address. No browse-all, no list view, no state or district filter, no export. maps.littleleague.org/robots.txt returned an empty body. CONFIRMED: no national or per-state district index exists on littleleague.org. What exists is independently operated district sites on unrelated domains (in WA: littleleaguewad1.org, dist6wa.org, llwadistrict8.org, littleleaguewashd9.org), each with its OWN separate terms and robots -- none assessed, each needs its own registry row before any use.'
);

INSERT OR REPLACE INTO directory_sources (
  id, name, governing_body, sport, canonical_url, source_type, scope_type,
  scope_value, has_stable_org_id, access_classification, robots_result,
  content_signal_reserved, refresh_cadence_days, is_active,
  last_policy_checked_at, discovery_query, discovered_at, evidence_notes
) VALUES (
  'dsrc-wa-youth-soccer',
  'Washington Youth Soccer Associations directory',
  'Washington Youth Soccer / US Youth Soccer',
  'soccer',
  'https://washingtonyouthsoccer.org/associations/',
  'unknown', 'state', 'WA',
  0, 'permission_required', 'unverified', 0,
  180, 0, '2026-08-08',
  'site:usyouthsoccer.org OR site:washingtonyouthsoccer.org (club directory OR member clubs)',
  '2026-08-08',
  'WEAKEST EVIDENCE IN THE REGISTRY. Three independent fetches (root robots.txt and /associations/) all returned empty bodies; nothing on the domain could be read. The reported structure -- 7 districts, 37 member associations, 180+ clubs, which would enumerate cleanly -- is SEARCH-SNIPPET HEARSAY and is not verified. Absence of a readable prohibition is not permission. Needs a direct request to WYS.'
);

-- Puget Sound and Evergreen: the two Washington volleyball regions. Both are the
-- natural WA-first pilot and both are currently unreachable.
INSERT OR REPLACE INTO directory_sources (
  id, name, governing_body, sport, canonical_url, source_type, scope_type,
  scope_value, has_stable_org_id, access_classification, robots_result,
  content_signal_reserved, refresh_cadence_days, is_active,
  last_policy_checked_at, discovery_query, discovered_at, evidence_notes
) VALUES (
  'dsrc-psrvb-club-list',
  'USAV Puget Sound Region club list',
  'USA Volleyball -- Puget Sound Region (PSRVB)',
  'volleyball',
  'https://www.psrvb.org/clublist',
  'html', 'region', 'PS',
  0, 'permission_required', 'disallowed', 1,
  180, 0, '2026-08-08',
  'site:usavolleyball.org "Find a Club" OR "club directory" [REGION]',
  '2026-08-08',
  'BLOCKED IN PRACTICE. robots.txt explicitly names our agent class: "User-agent: ClaudeBot / Disallow: /" (Cloudflare managed block, also covering GPTBot, CCBot, Google-Extended, Bytespider and others), plus "Content-Signal: search=yes, ai-train=no, use=reference" -- an express reservation of rights. Page fetch returned an empty body, consistent with enforcement. Nothing about the page, its fields, or its terms could be verified. Renaming our User-Agent to get past this would be a bypass and is out of bounds. REMEDIATION: PSRVB publishes a region office email publicly. A written permission request is the only legitimate route, and it is worth making -- this is the primary source for a Washington-first volleyball pilot. Classified permission_required rather than blocked because the obstacle is an access control with a legitimate route around it, not a prohibition on the use.'
);

INSERT OR REPLACE INTO directory_sources (
  id, name, governing_body, sport, canonical_url, source_type, scope_type,
  scope_value, has_stable_org_id, access_classification, robots_result,
  content_signal_reserved, refresh_cadence_days, is_active,
  last_policy_checked_at, discovery_query, discovered_at, evidence_notes
) VALUES (
  'dsrc-erva-club-directory',
  'USAV Evergreen Region club directory',
  'USA Volleyball -- Evergreen Region (ERVA)',
  'volleyball',
  'https://www.evergreenregion.org/clubs',
  'html', 'region', 'EV',
  0, 'permission_required', 'disallowed', 1,
  180, 0, '2026-08-08',
  'site:usavolleyball.org "Find a Club" OR "club directory" [REGION]',
  '2026-08-08',
  'Identical Cloudflare ClaudeBot Disallow and Content-Signal reservation to PSRVB. Region office in Spokane Valley, WA; covers EASTERN Washington. Note the brief treated "Puget Sound / Evergreen" as one region -- they are two, PS is western WA and EV is eastern WA, and a Washington pilot needs both. Search snippets indicate the directory lists only clubs that submitted Club Activation forms and that PRIOR-SEASON listings remain visible, so any future pull is season-ambiguous and needs a season field. Unverified -- page not readable. Same remediation: written permission to the region office.'
);

-- ===========================================================================
-- BLOCKED
-- ===========================================================================

-- Four independent grounds. Also hard-coded in policy.py::HARD_DENY_DOMAINS so
-- that a bad edit to this table cannot re-enable it.
INSERT OR REPLACE INTO directory_sources (
  id, name, governing_body, sport, canonical_url, terms_url, source_type,
  scope_type, scope_value, has_stable_org_id, access_classification,
  solicitation_restriction, robots_result, content_signal_reserved,
  refresh_cadence_days, is_active, last_policy_checked_at, discovered_at,
  evidence_notes
) VALUES (
  'dsrc-aau-club-finder',
  'AAU Club Finder / Club Locator',
  'Amateur Athletic Union of the United States, Inc.',
  'multi',
  'https://www.aausports.org/club-finder/',
  'https://www.aausports.org/terms-of-use/',
  'address_search', 'national', NULL,
  0, 'blocked',
  'VERBATIM, from the click-through gate inside the Club Finder: "I agree that this club locator tool is not to be used for solicitation of any kind nor to advertise events not licensed by the AAU. Any violation or misuse of our club locator will result in action being taken against your membership."',
  'disallowed', 1,
  3650, 0, '2026-08-08', '2026-08-08',
  'HIGHEST SEVERITY. Blocked on four independent grounds: (1) the explicit anti-solicitation covenant quoted above, naming the exact downstream use, with a membership-revocation penalty; (2) site-wide "User-agent: ClaudeBot / Disallow: /"; (3) ToU: "You may not obtain or attempt to obtain any materials or information through any means not intentionally made available or provided for through the AAU Sports Web Sites"; (4) ToU: may not "Harvest or otherwise collect information about others, including e-mail addresses, without their consent." Additionally the tool is contact-gated -- AAU membership is required to contact clubs, and results render as a contact form rather than a data display. DO NOT FETCH, QUERY, ENUMERATE, OR REVISIT. Enforced in code: policy.py HARD_DENY_DOMAINS covers aausports.org and application.aausports.org, and policy.gate_batch_lane() denies on the domain before it ever reads this row.'
);

-- ===========================================================================
-- Cross-cutting note, recorded once so it is not rediscovered every quarter
-- ===========================================================================
--
-- psrvb.org, evergreenregion.org, and aausports.org serve a BYTE-IDENTICAL
-- Cloudflare-managed robots.txt blocking ClaudeBot, GPTBot, CCBot,
-- Google-Extended, Bytespider, Amazonbot, Applebot-Extended, meta-externalagent,
-- and CloudflareBrowserRenderingCrawler, with
-- "Content-Signal: search=yes, ai-train=no, use=reference".
--
-- This is Cloudflare's DEFAULT managed AI-crawler block, not a bespoke decision
-- by each organization. Two consequences:
--
--   1. Assume block-by-default for the long tail of Cloudflare-fronted region
--      and club sites, not allow-by-default. Most of the youth-sports web sits
--      behind Cloudflare.
--   2. Content-Signal ai-train=no / use=reference is an express reservation of
--      rights. Building a persistent internal directory for later outreach is
--      not a "reference" use, even where Allow: / applies to a generic crawler.
--      policy.py treats content_signal_reserved=1 as permission_required.
--
-- The practical upshot: the batch lane will be gated by PERMISSION more often
-- than by technology. Budget for permission requests, not for crawling.
