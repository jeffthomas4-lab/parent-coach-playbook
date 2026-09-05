# PLAT-009 Gate 9C-C DNC pilot amendment

Status: **LOCAL PASS / REMOTE INFRASTRUCTURE AND PILOT HOLD**
Recorded: 2026-09-05T14:20:46-07:00

## Candidate identity

- PCD DNC propagation and amended synthetic-pilot candidate:
  `abd0bea53554a3c832fddd0fb101d00602662491`
- Candidate tree: `f2678b64bad6424e1d2eebcd4b46dada6c583370`
- Direct predecessor evidence commit: `cca4ef062613f8979bb76e631e5588ac74a1f1f2`
- Central CRM DNC receiver candidate: `d810612d5c8f55f97e7e04596cca2af4128049eb`
- Central CRM candidate tree: `0275934a98d9ee1caadc20b004568d774a0b3703`
- Central CRM receiver evidence commit: `d61ec28750a5f8d8bf0be3f654a461963f22809a`

This amendment supersedes the six-artifact, ten-statement pilot description in
`plat-009-gate9c-c-overlay-preflight-2026-09-05.md` for any future Gate 9C-C action. It does not
rewrite or invalidate that historical preflight record.

## Amended pilot contract

The local packet generator now produces seven SHA-256-pinned SQL artifacts plus one manifest.
The packet has 13 bounded SQL statements: 9 reads and 4 mutating statements. Its fixed fictional
dataset remains three organizations and eight contacts.

The expected contact-event result is now:

- two `contact.observed.v1` events, one email and one phone;
- one raw-free `contact.deleted.v1` event for the deny-contact case; and
- five deferred, held, or rejected contact rows.

The DNC payload has exactly six allowed keys: `id`, `organizationId`, `workspaceId`,
`sourceVersion`, `authorityUpdatedAt`, and `suppressionState`. It contains no contact name, email,
phone, source URL, or other raw contact value. The verifier rejects missing or additional keys and
checks the required JSON types.

The ops verifier uses the exact subject type and subject ID branches supported by
`idx_crm_adapter_outbox_subject`; a retained query-plan assertion rejects a full outbox scan.

The phase-two receipt gate and delivery verifier require event and receiver receipt equality on
event ID, subject type, subject ID, authority time, content hash, and source sequence. They also
require the exact event type, producer, target workspace, activation boundary, delivered status,
non-null receiver receipt ID, 2xx receiver status, and non-null delivery time. A forged local
`status = 'delivered'` without receiver evidence inserts zero contacts and verifies as zero.

The new CRM-side verification artifact proves, against CRM-shaped shadow tables, exactly three
active organization projections, two active contact projections, one adapter-origin DNC
restriction, and zero contact points for the denied identity. Removing the restriction makes the
DNC verification fail.

## Red-first evidence

The following failures were observed before their retained repairs passed:

1. The old pilot expectation produced three eligible contacts instead of the amended two-observed,
   one-DNC result.
2. Running the native Miniflare suites in the default fork pool crashed a workerd child. The pilot
   is now classified with the serialized integration suites; the classification contract passed
   5/5.
3. The first raw-free verifier accepted a DNC payload missing required keys. The retained negative
   case now requires exactly the six-key contract.
4. The outbox verifier initially performed an unindexed scan. The retained `EXPLAIN QUERY PLAN`
   assertion now requires `idx_crm_adapter_outbox_subject` and rejects a full scan.
5. The first phase-two gate accepted a forged local delivered status without receiver evidence and
   inserted all eight contacts. The retained negative now inserts zero.
6. The first ops delivery verifier also reported three deliveries for those forged local statuses.
   The repaired verifier now reports zero without the matched receiver evidence.

## Verification evidence

- Focused amended pilot suite: **PASS, 3/3**.
- Full general integration segment: **PASS, 49/49**.
- Customer-lifecycle segment: **PASS, 8/8**.
- Full CRM adapter segment: **PASS, 74/74** in 237.72 seconds.
- Total final serialized integration evidence: **PASS, 131/131**.
- Test-engineering classification contract after pilot routing: **PASS, 5/5**.
- TypeScript (`tsc --noEmit`): **PASS**.
- `git diff --check`: **PASS** before the candidate commit.
- Independent QA: **CLEAN** after the forged-receipt delivery-verifier defect was reproduced and
  repaired.
- Independent Security: **CLEAN** after the exact-six-key DNC negative was retained.
- Independent Efficiency: **CLEAN** after the subject index and query-plan regression were added.
- Independent Simplicity: **CLEAN**; no additional abstraction or dependency was warranted.

Dependency decision: npm, PyPI, and GitHub were checked earlier in this lane for a maintained,
appropriately scoped event-sourcing package. No candidate fit the existing Cloudflare Worker,
D1, Zod, and adapter primitives without adding disproportionate weight, so no dependency was
added.

## PERFORMANCE REVIEW

- approximate algorithmic complexity: `O(3 + 8 + 7)`, fixed pilot cardinality with no source
  dataset scan
- DB query count on primary path: 13 fixed statements in the generated packet, comprising 9 reads
  and 4 mutating statements; the generator itself performs 0 database queries
- external API calls: 0 during generation and local verification
- queue jobs created: 0 by the generator; the three contact events are exercised through three
  bounded local dispatch claims in the retained test
- expected memory behavior: fixed tens of kilobytes for seven SQL strings, one manifest, and the
  synthetic fixtures
- likely scaling bottleneck: the later existing 10-event-per-minute staging receiver pump, not
  packet generation or verification

## Retained gate boundary

No remote database, Worker, Queue, provider, secret, resource, production system, or customer data
was changed. No staging row was copied or seeded. No activation boundary was selected, no producer
flag was enabled, and no export or send occurred.

Before a hosted pilot can run, a new exact staging infrastructure gate must authorize the pending
PCD migrations 0042-0043, CRM migration 0028, deployment of the exact PCD and CRM code candidates,
and the required backup and readback steps while both producer flags remain false. The later pilot
still requires its own fresh second-aligned boundary and artifact hashes. Full historical transfer
remains a subsequent gate and must refresh the production authority counts at its own action time.
