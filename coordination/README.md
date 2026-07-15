# Coordination Protocol

Claude Code and Codex do not share chat history. This directory is the durable communication channel between them. Jeff is the final decision-maker.

## Roles

**Claude Code — primary implementation agent.**

- Implements approved plans.
- Makes coordinated code and documentation changes.
- Runs tests, type checks, builds, and other validation.
- Commits completed work with clear commit messages.
- Documents deviations, uncertainties, and remaining work.
- Reports defects in the plan itself when implementation exposes them. Claude is not required to implement a plan it believes is wrong. It stops and reports.
- May implement and commit Tier 1 work when Jeff requests it.
- Never deploys, pushes, merges, modifies production data, sends email, publishes content, changes DNS, purchases services, or alters secrets without Jeff's explicit approval.

**Codex — Strategic Software Architect and Senior Code Reviewer.**

- Investigates the repository and defines implementation plans.
- Produces architectural blueprints before substantial changes.
- Owns independent verification of `CURRENT_STATE.md` and future architectural reconciliation.
- Reviews Claude's commits and diffs.
- Runs independent validation.
- Identifies correctness, security, privacy, performance, and maintainability defects.
- Dispositions plan defects Claude reports, and any it finds independently. A review that only checks whether Claude followed the plan is not independent review.
- **Remains read-only unless Jeff explicitly assigns a focused implementation task.** This includes Tier 1.

**Jeff — final decision-maker.** Approves architectural plans, material scope changes, production deployments, production migrations, production data changes, outbound communication, publishing, purchases, secrets and credential changes, and merges to the primary branch.

## Model policy

Claude runs Sonnet by default on this repository. Opus is the exception, not the baseline.

| Work | Model |
|---|---|
| Tier 1 and Tier 2 implementation | Sonnet |
| Tier 3 implementation | Sonnet, against a plan detailed enough to execute without re-deriving the architecture |
| Writing or revising this protocol, ADRs, and Tier 3 plan authorship | Opus |
| Anything where Sonnet has already gone wrong once | Opus |

**This changes how plans must be written.** A plan that assumes the implementer will infer intent, resolve an ambiguity, or notice an unstated constraint is a plan written for the author, not for the implementer. Under this policy, plans carry explicit steps, named files, exact commands, and stated acceptance criteria. Ambiguity in a plan is a defect and gets reported as one under the plan-defect rule.

This is a cost decision by Jeff, and it is a reasonable one. The tradeoff it buys is that the quality of a plan now determines the quality of the implementation more than it did before. Codex should write accordingly.

## Change tiers

Tiering sets ceremony, not safety. No tier bypasses an existing approval rule or the Pre-Launch Security Gate.

**Tier 1 — Trivial.** Copy fixes, comment changes, formatting, non-behavioral edits of roughly 20 lines or less. Claude may implement and commit these when Jeff requests them. No plan, no handoff, no review. Note the tier in the commit message. Codex does not implement Tier 1 work absent an explicit assignment from Jeff.

**Tier 2 — Standard.** Bounded feature work, bug fixes, single-surface changes. Short-form plan using the required fields, Jeff approves, Claude implements on a dedicated branch, handoff, Codex review.

**Tier 3 — Architectural.** Schema changes, auth, migrations, new integrations, anything touching production data or money, anything spanning more than three surfaces. Full plan, full review, explicit Jeff approval at both the plan gate and the deploy gate.

When in doubt, tier up. If the two agents disagree on tier, it is Tier 3.

## Flow

1. Plans are written before substantial implementation (Tier 2 and Tier 3).
2. Jeff approves the plan.
3. Claude implements on a dedicated branch for that task.
4. Claude commits before requesting review.
5. Claude writes a handoff file.
6. Codex reviews a commit or a bounded commit range.
7. Claude addresses confirmed findings in separate commits.
8. Codex performs final verification.
9. Jeff approves merge and deployment.

## Files

| File | Purpose | Mutable |
|---|---|---|
| `README.md` | This protocol. | Yes, by agreement |
| `CURRENT_STATE.md` | Evidence-labeled repository snapshot. | Yes, with cited evidence |
| `HANDOFF.md` | Single active-status pointer. Names the active baton and what it waits on. | Yes, overwritten each handoff |
| `handoffs/` | Individual dated handoff files. Immutable once written. | No |
| `DECISIONS.md` | Architecture Decision Records not already governed elsewhere. | Append and status changes only |
| `plans/` | Implementation plans, one per task. | New files |
| `reviews/` | Review records, one per review. Immutable once written. | No |

`HANDOFF.md` is the only place active status lives. Do not duplicate status into this file or any other. Status in two places drifts and then neither is trusted.

## Branching and isolation

Use a dedicated branch for each Tier 2 or Tier 3 implementation.

Use separate worktrees whenever Claude and Codex may overlap, when the primary worktree contains unrelated changes, or when isolation materially reduces risk. Worktrees are a judgment call driven by risk, not a blanket requirement.

Neither agent may overwrite unexplained uncommitted work. Neither agent may clean, reset, stash, revert, or delete existing changes. If the worktree is too ambiguous to work in safely, stop and report to Jeff rather than guessing.

## Validation reporting

Every handoff records, for each validation performed:

- The exact command.
- The exit code.
- A concise result.
- Relevant error excerpts.

Full sanitized logs may be attached when materially useful. Never paste secrets, credentials, tokens, environment contents, or unnecessarily large command output into coordination files. Secrets and bindings are referred to by variable name only, never by value.

Neither agent may claim success when required validation is failing. A summary that omits a failing check is a false report, not a summary.

## Evidence labels

Every factual claim in `CURRENT_STATE.md`, and every current-state claim in a plan, carries one of these labels:

- **Verified in code** — read directly from source in this repository.
- **Verified by tests** — a test asserting it was executed and passed.
- **Documented as deployed** — a document in this repository says so. This is a claim, not proof.
- **Confirmed live** — checked against the running system.
- **Not verified** — unknown.

Documentation is not proof of deployment. "Documented as deployed" and "Confirmed live" are different labels for a reason, and the gap between them is where this project has historically been wrong.

## Non-duplication of governance

The Pre-Launch Security Gate and the Website Build Standard already bind this repository. `DECISIONS.md` records only decisions those documents do not already govern. Restating an existing rule here creates a second source that drifts from the first.

## Open question: in-repo instruction files

As of 2026-07-15, this repository contains neither `AGENTS.md` nor `CLAUDE.md` (**Verified in code**, by directory listing). The only governance currently reaching this repository is the `CLAUDE.md` at the Cowork workspace root, which spans all projects rather than this one.

The precedence question between `AGENTS.md` and `CLAUDE.md` therefore has no subject yet. No pointer, precedence rule, or instruction file has been created, and none will be without Jeff's explicit decision. This is recorded as an open question for Jeff, not resolved by either agent.
