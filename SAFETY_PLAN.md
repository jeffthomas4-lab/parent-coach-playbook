# Safety section plan

The safety section lives inside the existing body collection. One URL space. Two lenses. Health is the existing pediatric medicine canon. Safety is everything around the kid: people, places, equipment, weather, conduct.

This file is the operator manual for shipping it. It governs the schema move, the launch slate, the MomsTeam discipline, and the deferred work.

---

## The shape

Body becomes "Body & Safety" with a top-level toggle. Two lenses inside one collection, one URL pattern (`/body/[slug]/`). Existing URLs do not break.

Health pieces stay tagged `subhub: 'health'`. Safety pieces tag `subhub: 'safety'`. Concussion and heat are load-bearing for both lenses, stay on `health`, and cross-link from the safety hub. We do not duplicate them.

Two existing pieces get reclassified to safety on day one: `safesport-basics-for-parents.md` and `coach-background-checks.md`. They were filed under `category: 'injury-prevention'`, which never fit. The migration is a frontmatter edit, not a content rewrite.

---

## Schema change

Two new fields on the body schema:

- `subhub: 'health' | 'safety'`. Default `'health'`. Set on every existing piece in the backfill pass.
- `format: 'topic' | 'protocol' | 'sport-briefing' | 'checklist'`. Default `'topic'`.

Three optional fields, populated only when the format calls for them:

- `protocolSteps: string[]` for `protocol` pages
- `checklistItems: string[]` for `checklist` pages
- `checklistPdf: string` for the printable

A second category field, parallel to the existing one:

```ts
const SAFETY_CATEGORY_ENUM = [
  'weather',                  // heat, lightning, wildfire smoke / AQI, cold, sun
  'coach-vetting',            // SafeSport, background checks, league questions
  'equipment-certification',  // NOCSAE helmets, bat stamps, mouthguards, used gear
  'travel-logistics',         // rooming, chaperones, transporting other kids
  'emergency-response',       // protocols, sideline kit, AED/CPR, missing kid
  'conduct',                  // bullying, hazing, sideline parents, refs, locker room
  'aquatic',                  // pool/lake/deck rules, shallow-water blackout
  'cyber',                    // team apps, photo policies, recruiting DMs
  'crisis-mental-health',     // deferred mini-launch; schema-ready, not slate-ready
] as const;
```

```ts
category:        z.enum([...existingHealthCategories]).optional(),
safetyCategory:  z.enum(SAFETY_CATEGORY_ENUM).optional(),
```

A Zod refinement enforces the pairing: `subhub: 'health'` requires `category`, `subhub: 'safety'` requires `safetyCategory`, except `format: 'sport-briefing'`, which is exempt. Sport briefings sit above the category dimension by design.

---

## Format definitions

`topic`. The long per-situation deep page. What body already does. Cited governing bodies, doctor questions, paragraphs. `concussion-protocol-basics.md` and `heat-and-hydration.md` are this format. 600 to 1500 words.

`protocol`. The moment-of-need page. 30 to 60 second read while it is happening. Numbered steps, no preamble. "Heatstroke right now." "Lightning at the field." 200 to 400 words plus the numbered protocol.

`sport-briefing`. One page per sport. Same template across sports. What is actually dangerous about youth football, baseball, soccer, etc. Risks ranked by frequency and severity, sourced to the NGB and the published epidemiology. Pilot in football first. Expand only if it reads well.

`checklist`. The print or screenshot artifact. Item list plus a downloadable PDF. League questions, sideline first-aid kit, hotel rooming standards. The piece that gets saved to a phone or stuck on a fridge.

The renderer picks layout from `format`. The hub indexes by `subhub` and lets readers filter by format chip.

---

## The MomsTeam discipline

MomsTeam is archived. We do not name it. We do not link it. We do not credit it. We do not position the site as a successor.

The discipline is sourcing, not topic avoidance. Every safety cornerstone is written from primary sources: CDC, NATA, Korey Stringer Institute, U.S. Center for SafeSport, NGB rule books, AAP, NOCSAE, NWS. Never paraphrased from secondary sources.

We keep an internal coverage inventory off the site, in a private doc. That doc lists their topic taxonomy and our cornerstone targets. The published site has no trace of it.

The originality grade in the editorial rubric is the gate. The review prompt picks up one new check: "If a MomsTeam reader landed here, would the structure feel familiar?" If yes, restructure before publishing. Below a 7 on originality means rewrite.

---

## The launch slate

Ten cornerstones across three weekly waves. Two migrations, seven new pieces, one per-sport pilot. One bench piece ships when slack opens.

### Wave 1: migrate and anchor

1. Migrate `safesport-basics-for-parents.md` to `subhub: 'safety'`, `safetyCategory: 'coach-vetting'`. Fresh review pass, no content rewrite.
2. Migrate `coach-background-checks.md` to `subhub: 'safety'`, `safetyCategory: 'coach-vetting'`. Same.
3. *Lightning at the field: the 30/30 rule*. `subhub: 'safety'`, `safetyCategory: 'weather'`, `format: 'protocol'`. NWS, NFHS, NCAA.
4. *Heatstroke right now: cool first, transport second*. `subhub: 'safety'`, `safetyCategory: 'weather'`, `format: 'protocol'`. NATA, Korey Stringer Institute, AAP. Repurposes the live-emergency portion of `heat-and-hydration.md` into a standalone moment-page.

### Wave 2: institutional and equipment

5. *12 questions to ask your league before signing the season form*. `safetyCategory: 'coach-vetting'`, `format: 'checklist'`. PDF download.
6. *Helmet, bat, and mouthguard certification: the stamps that matter*. `safetyCategory: 'equipment-certification'`, `format: 'topic'`. NOCSAE, USA Baseball, USA Softball, state mouthguard rules. Used-gear thresholds.
7. *Travel-team rooming and chaperones: what good policies look like*. `safetyCategory: 'travel-logistics'`, `format: 'topic'`. SafeSport guidance, model policies the major NGBs publish, the conversation with your team manager.
8. *Suspected concussion right now: same-day pull, written clearance*. `safetyCategory: 'emergency-response'`, `format: 'protocol'`. Moment-page companion to the existing concussion piece.

### Wave 3: social safety and the per-sport pilot

9. *Bullying and hazing in youth sports: what counts and what to escalate*. `safetyCategory: 'conduct'`, `format: 'topic'`, `flagSensitiveTopic: true`. Plain definitions, state-law thresholds, AD obligations, the SafeSport reporting line.
10. *What is actually dangerous about youth football*. `subhub: 'safety'`, `format: 'sport-briefing'`, no `safetyCategory`. Pilot for the per-sport template.

### Bench

*What goes in your sideline first-aid kit*. `safetyCategory: 'emergency-response'`, `format: 'checklist'`. Light lift, ships any time slack opens up.

---

## /start-here/ and homepage placement

Per the curation rule in `REVIEW.md`, every cornerstone above earns a slot evaluation when it ships.

The four `protocol` pages and the league-questions checklist are the obvious "what do you need right now" homepage tiles. The two migrations, the equipment-certification piece, the rooming piece, the bullying piece, and the football briefing belong on `/start-here/` under a new "Safety" list parallel to the existing "Body" list.

Mechanically: add a `safetySlugs` array to `start-here.astro` and a Safety tile cluster in `index.astro`. The Body list keeps its current contents.

---

## Order of operations

1. Schema PR. Add `subhub`, `format`, the three optional fields, and `safetyCategory` with the Zod refinement. About 30 minutes.
2. Backfill pass. Set `subhub: 'health'` on all 17 existing body pieces. 30 minutes.
3. Hub UX. Health / Safety toggle and format filter chips on the `/body/` index. About a half day.
4. Reclassify. Set `subhub: 'safety'` and the appropriate `safetyCategory` on the SafeSport and background-check pieces. Two file edits.
5. Build the internal MomsTeam coverage inventory off-site.
6. Wave 1 ships.
7. Wave 2 ships.
8. Wave 3 ships, including the football sport-briefing pilot.
9. Decision point. If the sport-briefing format reads well, plan the rollout to baseball, soccer, lacrosse-boys, lacrosse-girls, hockey, swimming, wrestling, cheer, and gymnastics. If it does not, fold sport-specific safety risks into the per-sport `rules` pages instead.

---

## Out of scope

**Gun safety on team sleepovers and host-family stays.** Pure parenting, not sports-specific enough. Not a safety topic for this site. Decision is final.

---

## Deferred: the mental-health crisis mini-launch

`safetyCategory: 'crisis-mental-health'` is wired into the schema but has no pieces in the launch ten. The existing `body/performance-anxiety.md` and `body/burnout-signs.md` cover on-the-spectrum stuff. Crisis response is a different shape and a higher-care editorial pass.

Plan a three-piece mini-launch after wave 3 lands. Sourcing shortlist: AAP for pediatric mental health framing, the National Alliance for Eating Disorders for ED warning signs in sport, and AFSP for ideation pieces. Every piece gets `flagSensitiveTopic: true` and a heavier editorial pass.

---

## When this plan changes

Update this file when the schema ships, when the cornerstones land, when the per-sport decision is made after wave 3, and when the crisis mini-launch begins planning. Treat it the way `REVIEW.md` is treated: living operator doc, dated edits at the bottom.

---

## Edit log

- 2026-05-10: initial plan committed.
