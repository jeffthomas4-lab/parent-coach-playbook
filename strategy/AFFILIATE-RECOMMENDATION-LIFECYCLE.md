# Parent Coach Desk affiliate recommendation lifecycle

**Status:** canonical local design and implementation contract  
**Version:** 1.0  
**Owner:** Jeff Thomas  
**Operating principle:** trust is the product; revenue is an outcome

## 1. Outcome

This vertical slice converts buying intent into explainable, maintained product
recommendations and provider-neutral affiliate revenue. The primary asset is a
recommendation with evidence, audience fit, weaknesses, alternatives, and human
editorial approval. A merchant link is an offer attached after that asset
exists.

The system is designed for reuse across Field & Forge ventures. Parent Coach
Desk supplies the youth-sports taxonomy, camps, organizations, buying guides,
editorial voice, and equipment intelligence. Forge OS supplies lifecycle,
approvals, evidence, incidents, revenue statements, evaluation, and audit.

## 2. Binding rules

- AI may discover, research, normalize, compare, score, and draft. It may not
  approve or publish a recommendation.
- Affiliate compensation cannot improve a recommendation, trust score, organic
  rank, or Parent Coach Approved status.
- Every public product link uses an internal `/go/{offer-slug}/` route.
- Every merchant host and tracking behavior is centrally governed.
- Amazon and network special links are preserved as supplied. No unapproved
  query mutation, cloaking, price scraping, or unsupported price/availability
  claim is allowed.
- Unknown product, account, terms, revenue, or performance facts remain unknown.
- Product maintenance produces incidents and proposals; it does not silently
  rewrite or retire live editorial work.
- Revenue is imported from provider statements and reconciled in aggregate.
  No person, child, household, precise location, raw search, or cross-site user
  journey is an attribution dimension.
- Applications, tax forms, credentials, provider relationships, messages,
  purchases, and account changes are owner-only external actions.

## 3. Permanent lifecycle

The lifecycle is:

1. `need_discovered`
2. `intent_qualified`
3. `researching`
4. `candidate`
5. `evaluating`
6. `editorial_review`
7. `approved`
8. `integrated`
9. `published`
10. `monitoring`
11. `maintenance_due`
12. `update_proposed`
13. `retired`

Legal transitions are encoded in `src/lib/affiliate-lifecycle.ts`. The system
cannot jump from a need to publication. Reconsidering a retired product returns
it to research; it never restores a past approval automatically.

Every transition writes an append-only event with entity, prior state, next
state, reason, actor, time, idempotency key, and evidence reference.

## 4. Entity model

### Buying intent

A normalized need drawn from minimized demand aggregates, GSC, reader-question
summaries, camp or organization equipment lists, affiliate patterns, parent
interviews, support themes, and seasonal evidence. It stores a category,
sport/activity, age band, season, urgency, aggregate count, confidence, and
evidence summary—not personal identity or raw correspondence.

### Product

A merchant-neutral thing with canonical name, brand, model, version, category,
age scope, attributes, identifiers, replacement relationship, lifecycle, and
source history. An ASIN is an identifier, not the product's primary key.

### Product source

Evidence from a manufacturer, manual, certification body, recall authority,
merchant, documented editorial test, summarized parent feedback, or another
reviewed source. Each record has scope, URL, quality, verification time,
optional expiry, and optional content hash.

### Merchant and program

A provider relationship with governed hosts, tracking mode, account state,
terms evidence, commission terms when verified, owner approval, and review
history. The codebase never stores credentials, tax forms, bank details, or
provider dashboard exports containing sensitive account data.

### Offer

A country-specific merchant destination attached to a product. It has an
internal slug, merchant, destination, campaign, availability, status, and
human approval. The existing 245 destination records remain the live redirect
authority until explicitly migrated; they are not automatically promoted into
products or recommendations.

### Recommendation

An editorial judgment connecting a product to a qualified intent and audience.
It records role, reasoning, strengths, weaknesses, wrong-for guidance,
confidence, trust score, approval, publication, and next review. A score cannot
create approval.

### Guide placement

A recommendation and optional offer placed in a public guide. Publication
requires editorial approval and disclosure verification. A placement can pause
without deleting the recommendation or product history.

### Equipment requirement

A source-backed item requirement for a sport, activity, organization, or camp.
It records required/recommended/optional/provided/prohibited state and validity.
A separate approved link connects the requirement to a recommendation. This is
the Equipment Intelligence bridge; it stores no family profile.

## 5. Merchant architecture and acquisition

`src/data/affiliate-governance.json` is the current merchant control plane. It
recognizes Amazon, Bookshop.org, SoccerGarage/CJ, Shutterfly, and Square hosts
already present in the redirect inventory. Only Amazon is represented as active
from existing Special Link evidence; other destination relationships remain
honestly unverified until Jeff supplies account evidence.

The acquisition workflow is:

1. Hal identifies a candidate program and records public-source research.
2. The system creates an application draft: fit, covered categories, terms,
   prohibited practices, expected maintenance, and missing information.
3. Jeff decides whether to apply. The system never applies, accepts terms,
   submits tax/bank data, or receives credentials.
4. After Jeff supplies non-secret approval evidence, the program moves to
   approved and its terms receive a dated evidence record.
5. A test offer is staged, reviewed for destination and tracking correctness,
   and verified without artificial clicks.
6. Only then may reviewed recommendations use that merchant.
7. Terms are reviewed monthly and after provider notice. Material change opens
   an incident and a human decision.

Application priority is based on reader-category coverage, trusted product
availability, commission economics, conversion evidence, program stability,
support burden, terms risk, and merchant reputation. Commission is never part
of recommendation scoring.

## 6. Buying-intent discovery and queue

The Buying Guide Queue accepts only normalized, evidence-backed intent. Queue
fields are intent key, source types, aggregate signal count, seasonality,
urgency, coverage gap, source confidence, expected parent value, rough effort,
maintenance cost, commercial opportunity, risk, owner, and next review.

Priority is a decision aid:

`parent value + evidence confidence + coverage gap + urgency + strategic fit − effort − maintenance − risk`

Revenue opportunity is displayed separately. It cannot overwhelm parent value
or evidence confidence. High-revenue low-trust ideas do not enter research.

## 7. Research and evaluation

Research captures manufacturer facts, identifiers, variants, manuals,
certifications, recalls, warranty, release/version, merchant availability, and
documented first-hand tests. Ratings and reviews are contextual signals, not
proof of quality. Price and rating observations require an approved API,
provider statement, link-health process, or manual evidence and an observation
date.

Editorial evaluation answers:

- Who is this for?
- What problem does it solve?
- What is the evidence?
- Why this product rather than two real alternatives?
- What are its weaknesses?
- Who should skip it?
- When should a parent skip the category entirely?
- What is unknown?
- What would change the recommendation?

The recommendation roles are best overall, best value, budget, premium,
beginner, travel, alternative, avoid, and category skip. Not every guide needs
every role.

## 8. Scoring and recommendation engine

The trust score is deterministic and explainable. It weights evidence
freshness, source count and quality, complete reasoning, human editorial review,
known availability, and unresolved correction burden. It never uses commission,
revenue, click-through rate, retailer preference, or payment.

The current publication floor is 60 plus all hard gates:

- at least one evidence-grade source;
- valid human editorial review;
- reasoning, strengths, weaknesses, and wrong-for guidance;
- a known available or limited offer;
- no incompatible lifecycle state.

This score is a review aid. Human approval remains mandatory. Parent Coach
Approved has a separate higher first-hand-use standard and is never inferred
from this score.

Recommendation ranking first filters by audience and hard requirements, then
compares trust, fit, evidence, availability, and price band where a compliant
observation exists. Commercial metrics may help choose among equally trusted
merchant offers for the same approved product, but never among products.

## 9. Buying-guide generation and publication

The system may draft an outline, comparison structure, recommendation blocks,
FAQ, how-to-choose guidance, mistakes, maintenance, related pages, structured
data proposal, newsletter excerpt, and social draft. Each generated statement
must resolve to product evidence or be clearly editorial opinion.

Publication gates are source review, claim and safety review, voice review,
comparison completeness, disclosure before the first affiliate link,
`rel="sponsored nofollow noopener"`, internal `/go/` routes, image rights,
schema truthfulness, accessibility, and explicit editorial approval.

Product schema, AggregateRating, Review, price, availability, or offer schema is
emitted only when the page and evidence meet the applicable semantic and policy
requirements. The presence of an affiliate destination is not enough.

## 10. Link integration and routing

`src/lib/affiliate-routing.ts` maps every destination host to a merchant rule.
Unknown hosts fail. HTTPS is mandatory. Amazon and CJ-style Special Links are
preserved byte-for-byte after URL normalization; other approved merchants
receive only first-party source, medium, and campaign tags.

Content uses `/go/{slug}/`, never a merchant URL. The redirect inventory remains
release-gated for valid hosts, Amazon tags, source coverage, and destination
integrity. Click intent records only the governed offer slug and transport hint.

## 11. Product health and maintenance

Health checks cover links, identifiers, availability, terms, recalls,
replacements, and recommendation freshness. Outcomes are pass, warning, fail,
or unknown. A check schedules the next check and can open an incident.

Maintenance cadence:

- daily: critical recall or broken high-value destination intake when a lawful
  source exists;
- weekly: broken links, redirect changes, availability failures, unresolved
  critical/high incidents;
- monthly: merchant terms, program status, revenue statements, top guide and
  offer health, unclassified legacy destinations;
- quarterly: every published recommendation, guide disclosure sample, stale
  evidence, replacements, correction patterns, merchant concentration;
- seasonally: review relevant sport/camp categories before demand peaks;
- annually: full program, disclosure, tax/account ownership, data retention,
  compliance, and process retirement review.

Incidents cover broken links, tracking failure, unavailability,
discontinuation, recalls, terms changes, unsupported claims, stale evidence,
revenue mismatch, disclosure failure, and corrections. Critical safety or
recall evidence may immediately pause an offer and stage an editorial response;
it cannot silently rewrite the recommendation.

## 12. Revenue intelligence

Provider statements are the financial authority. Each import stores statement
period, merchant, currency, gross, returns, adjustments, net, evidence
reference, content hash, import time, and reconciliation approval. Lines may be
attributed to offer, product, guide, campaign, or channel with exact,
provider-aggregate, estimated, or unattributed quality.

Allowed analysis includes clicks, orders, returned orders, conversion where
the provider supports it, net revenue, revenue per qualified guide session,
merchant/category concentration, and trend. It does not include city, person,
email, child, household, precise location, raw search, or cross-site journey.

The system uses revenue to learn which trusted recommendations create useful
outcomes and which merchant relationships are durable. It does not use revenue
to overwrite editorial judgment.

## 13. Trust and freshness presentation

Reader-visible trust should be legible, not a mysterious numeric badge. A guide
may show last editorial review, evidence recency, availability checked date,
comparison scope, correction path, and disclosure. If a numeric trust score is
ever displayed, its components and limitations must be visible and user-tested.

The protected dashboard shows score components, missing evidence, due reviews,
incidents, merchant concentration, revenue reconciliation quality, and
unclassified legacy inventory. It never exposes destination URLs, credentials,
tax data, account identifiers, personal reader data, or raw provider exports.

## 14. Search and parent experience

Search facets are sport, activity, age, price band, skill, season, brand,
merchant, budget, indoor/outdoor, travel, camp equipment, and accessibility or
adaptive need only when supported by product evidence.

Save, compare, wish lists, packing lists, price alerts, availability alerts,
sharing, and family equipment tracking are future customer features. They
require identity, consent, retention, deletion, notification, security,
customer-support, and product evidence gates. The current slice creates no
family profile and sends no alerts.

## 15. Equipment Intelligence

Equipment requirements connect real camp and organization evidence to approved
recommendations. One requirement can power packing checklists and many camp
pages without duplicating recommendation logic. Requirement status distinguishes
required, recommended, optional, provided, and prohibited.

The first safe implementation is anonymous and source-backed: show a camp's
documented equipment requirement and link to a reviewed category guide. The
system does not infer what a child owns, registration state, or start-date
reminder eligibility until a separately approved customer lifecycle exists.

## 16. Queue and dashboard architecture

Protected queues:

1. buying intents awaiting qualification;
2. products awaiting research or evaluation;
3. recommendations awaiting editorial review;
4. offers awaiting merchant and tracking approval;
5. guide placements awaiting disclosure/publication approval;
6. health incidents by severity and due date;
7. revenue statements awaiting reconciliation;
8. equipment requirements awaiting source and recommendation review;
9. legacy destinations awaiting product classification.

The executive dashboard reports counts and aging, not optimistic completion.
Silent queues and overdue critical incidents fail operational health.

## 17. API contracts

All mutation APIs are protected by Cloudflare Access, administrator allowlist,
same-origin enforcement, bounded JSON bodies, schema validation, idempotency,
prepared D1 statements, audit events, and feature flags default-off.

Planned protected endpoints:

- `GET /api/admin/affiliate/overview` — aggregate lifecycle and queue health;
- `POST /api/admin/affiliate/intents` — create a reviewed normalized intent;
- `POST /api/admin/affiliate/products` — create a research product;
- `POST /api/admin/affiliate/recommendations/{id}/transition` — legal state
  transition with reason and evidence;
- `POST /api/admin/affiliate/offers/{id}/transition` — approve/pause/retire an
  offer without editing content;
- `POST /api/admin/affiliate/incidents/{id}/resolve` — record resolution;
- `POST /api/admin/affiliate/revenue/import` — ingest a prevalidated,
  non-sensitive statement artifact;
- `GET /api/admin/affiliate/export` — aggregate operational export.

No public mutation endpoint is part of this slice. No API calls a merchant,
applies to a network, publishes content, or changes a credential.

## 18. Security, compliance, and cost

Use the D1 binding rather than Cloudflare REST from Workers. Prepare and bind all
SQL. Await required work; use `ctx.waitUntil()` only for bounded post-response
tasks. Emit structured, non-sensitive logs. Never store request-scoped state in
module globals.

Security controls include Access plus allowlist, least privilege, same-origin,
idempotency, immutable evidence hashes, append-only lifecycle events, explicit
retention, backup/recovery rehearsal, feature flags, and sanitized errors.

Compliance includes conspicuous FTC disclosure, Amazon required language,
Special Link preservation, merchant terms review, no prohibited price claims,
no click fraud or artificial traffic, image and trademark rights, corrections,
and tax/account actions by Jeff and qualified professionals.

Cost is controlled through static public redirects, build-time inventory
checks, batched maintenance, aggregate provider statement imports, indexed D1
queries, and no per-click D1 write. Product observations are snapshots, not an
unbounded scrape history; retention and downsampling are set before activation.

## 19. Forge OS versus Parent Coach Desk

Reusable Forge OS components:

- entity lifecycle and transition policy;
- evidence records and confidence semantics;
- merchant/program/offer architecture;
- approval classes and append-only audit events;
- health checks, incidents, queues, aging, and SLAs;
- provider-statement revenue reconciliation;
- score explanation and evaluation;
- feature flags, idempotency, retention, backup, and export patterns.

Parent Coach Desk-specific components:

- sports, activity, age, season, camp, and organization taxonomy;
- editorial voice and safety standards;
- Parent Coach Approved methodology;
- buying-guide layouts and `/go/` redirect inventory;
- camp equipment requirements and packing context;
- parent-facing discovery and disclosure language.

Extraction happens only after the PCD workflow proves useful. No speculative
cross-venture service is created in this slice.

## 20. Implementation and activation status

Implemented locally:

- centralized merchant and routing governance;
- permanent lifecycle and transition map;
- explainable trust scoring and hard publication gates;
- privacy-safe revenue dimensions;
- D1 schema for the complete lifecycle;
- deterministic registry snapshot classifying all 245 legacy offers;
- disposable SQLite rehearsal proving all 19 lifecycle tables can be created;
- current release-gated redirect and disclosure infrastructure;
- protected aggregate destination desk, protected lifecycle dashboard, and minimized click intent.

Pending local build:

- D1 store functions after the migration activation sequence is approved;
- protected mutation APIs and feature flags;
- statement import and reconciliation tooling;
- equipment-requirement ingestion and guide integration.

External or owner-gated:

- applying to or changing affiliate accounts;
- accepting terms, providing tax/payment details, or storing credentials;
- merchant API access;
- importing real provider revenue statements;
- production migration or feature activation;
- product claims, approval, publication, or retirement;
- outreach, direct partnerships, and customer features.
