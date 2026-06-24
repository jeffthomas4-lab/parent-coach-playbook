# /launch-check

Full GO / NO-GO readiness score before launching a major new section. More thorough than /preflight.

**Usage:** `/launch-check [section]`

Section options: `camps`, `age-groups`, `rss`, `sport-seo`, `full`

## Steps

1. Delegate to `jarvis-orchestrator` subagent:

   > Run a launch readiness check for the [section] section of parentcoachdesk.com. Coordinate: (1) security-engineer — check for any unresolved Criticals, confirm affiliate redirect allowlist, confirm /api/camps/* rate limiting if camps section, (2) qa-human-tester — run happy path, chaos path, and emotion check for the relevant personas (Maria for content sections, Camp Operator for camps), (3) billing-finance — verify all new affiliate slugs have correct tags, FTC disclosures present, (4) data-quality — audit new content files for missing bluf, broken slugs, banned words, (5) product-manager — confirm this section advances the 2026 metrics and no Tier 1 tasks are being skipped. Synthesize findings into STATUS (GO / NO-GO / CONDITIONAL GO) + numbered blocker list.

2. Any blocker = NO-GO. Fix all blockers before running /preflight and deploying.
3. CONDITIONAL GO = list of conditions Jeff must approve before ship.

**Output:** STATUS + numbered blocker list + recommended next action. One sentence per finding.
