# PCD Approval Matrix: Class A / B / C / D

**Status:** foundation document, Session 0. Reused as-is from PCD-SESSION-TWO-INPUT-from-reviews-2026-07-13.md item 1. Not reinvented here.

**Governs:** every agent in the PCD roster. Every agent spec names which class its normal output lands in, and that class decides what Jeff has to touch before anything moves.

---

## The four classes

**Class A: Analyze.** Read-only. Nothing changes as a result of the run. No approval needed, because there's nothing to approve. Nora's weekly GSC review runs this way today.

**Class B: Draft.** The agent produces a document a human reads and may act on. Nothing ships, sends, or publishes without Jeff picking it up and acting himself. Ed's articles and Frida's newsletter draft both live here.

**Class C: Stage.** A prepared change set sits in a review queue, fully formed, ready to commit with one approval. This sits between Draft and Act: the work is done, not just proposed. Vera's deletion-request fix and Ranger's bulk camp data-quality fixes fit here better than a flat Draft, because the change is already built and only needs a yes.

**Class D: Act.** The agent writes without a per-run approval, inside a fixed confidence threshold. Today this is one exception: Ranger's camp discovery enrichment writes (S7), gated at 75 percent confidence. Class D is Jeff only to authorize, and only inside the named threshold. No agent gets Class D by default.

---

## Tied to the HUMAN GATE

The HUMAN GATE (Master Plan rule 6) already splits work into unattended and gated. This matrix is a refinement of that line, not a new rule:

- Sends, purchases, deletions, publications, and anything touching money or a person outside the system require explicit approval. That's Class B, C, and D all routing through Jeff before anything live happens, except where D's threshold has already been set by Jeff in advance.
- Class A is the only class that runs with zero human touch, because it changes nothing.
- Class D never means unattended and unreviewed forever. It means the review happened once, at threshold-setting time, not on every run.

---

## Class D is Jeff only

No agent gets Class D status without Jeff naming the confidence threshold and the exact write scope in writing, in that agent's spec. Ranger (S7) is the only agent on the roster carrying Class D today, and even there the deletes stay gated at Class C.

---

## How this maps to the roster

| Agent | Normal class | Notes |
|---|---|---|
| Nora | A / B | GSC review is A. Outreach drafts are B. |
| Ed | B | Drafts only, Jeff publishes. |
| Frida | B | Draft only, Jeff sends. |
| Hal | A / B | Reports only, Jeff applies and pays. |
| Ranger | C / D | Enrichment writes under threshold are D. Deletes and bulk fixes are C. |
| Vera | B / C | Monitors and drafts the fix as C; Jeff deletes. |
| Sunny | B | Drafts only, a human sends. |

This table is a summary, not a substitute for each agent's own spec. Each agent's build session confirms and details its own class assignment.
