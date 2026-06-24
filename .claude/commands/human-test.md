# /human-test

Walk a complete user flow as a real parent or camp operator — not as an engineer who knows the codebase.

**Usage:** `/human-test [persona]` (optional — defaults to all relevant personas)

Personas: Maria (rec-ball mom, mobile), Dave (travel baseball dad, laptop), Keisha (first-time parent), Camp Operator (desktop, submitting a listing), Jeff (admin).

## Steps

1. Identify which feature or flow to test (state it explicitly)
2. Delegate to `qa-human-tester` subagent:

   > Test [feature/flow] on parentcoachdesk.com as [persona]. Run: (1) Happy path — does the golden flow work start to finish? (2) Chaos path — wrong input, mobile viewport, slow connection, empty state. (3) Emotion check — does this feel like a site a parent would trust with decisions about their kid, or does it feel like a content farm? For affiliate flows: confirm /go/[slug]/ redirects to the correct product with ?tag=parentcoachpl-20 intact. For the camps form: confirm a non-technical operator can submit in under 5 minutes with no confusing error states. Output per test: PERSONA | PATH | RESULT (Pass/Fail/Friction) | FINDING | RECOMMENDATION.

3. Any Friction finding on a parent-facing flow goes to the session backlog
4. Any Fail on an affiliate redirect goes to billing-check immediately

**Output:** Test results table. Summary: pass count / friction count / fail count / recommended fixes.
