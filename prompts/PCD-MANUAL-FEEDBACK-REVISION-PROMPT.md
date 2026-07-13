# Opus prompt: reconcile multi-source feedback into the PCD Operating Manual

Run this in Opus. You are revising the governing document for ParentCoachDesk based on feedback Jeff has gathered from several sources. Feedback is input to your judgment, not a set of commands. Your job is to weigh each piece against the facts and the constitution, decide what changes, and say plainly what you reject and why.

## Read first

1. `Outputs/parent-coach-desk/PCD-OPERATING-MANUAL.md`. This is the document under revision and the source of truth. Notion mirrors it.
2. `Outputs/Forge Command/FORGE-COMMAND-MASTER-PLAN.md`, the ten named rules, the section 10 failure modes, and the existence test in section 1.
3. `Outputs/parent-coach-desk/ORGANIC-SEARCH-AUDIT.md` for the distribution-is-the-constraint truth.
4. `About Me/About Me.txt` and `About Me/Anti AI Writing.txt` for voice.

## How Jeff gives you the feedback

Jeff pastes feedback below or points you to files. Each source is tagged. A source can be another model's review, a human advisor, Jeff's own margin notes, or a live system that contradicts the manual. Treat them as distinct voices, not one merged blob. If a piece of feedback is vague, name it as vague and say what you would need to act on it, do not guess a change into the document.

Paste feedback here, one block per source:

```
SOURCE: <name or role>
<their feedback, verbatim>
```

## The method

Work in four passes. Do not edit the manual until pass 4, and not before Jeff approves the plan.

### Pass 1: inventory

Break every source into discrete feedback items. For each item record: the source, the manual section it targets, and what it is actually asking for in one line. A single source can produce many items. Number them.

### Pass 2: adjudicate

Judge each item against this precedence order. Higher wins.

1. **Verified fact.** A claim in the manual that is factually wrong gets fixed no matter who did or did not flag it. Check numbers against the source files and, where it is a live-data claim, against the database. Do not accept a reviewer's number without verifying it, and do not let a reviewer replace a real number with an invented one.
2. **The constitution.** The ten rules, the section 10 failure modes, the existence test, the HUMAN GATE, and the working-set cap. A change that breaks one of these loses unless it is fixing a genuine error in the constitution's application.
3. **Jeff's direction.** His own notes and calls outrank outside reviewers.
4. **Reviewer recommendation**, weighted by how specific and evidence-backed it is. A concrete, sourced suggestion beats a vague opinion.

Give each item a verdict: Accept, Accept with modification, Reject, or Escalate to Jeff. Every Reject and every Escalate gets a one-line reason. Any item that touches an agent must still clear the existence test and the manual-three-times gate; say so.

### Pass 3: reconcile conflicts and write the memo

Where two sources disagree, state both positions, then pick one with a reason grounded in the precedence order, or escalate it. Do not average them into mush.

Produce a reconciliation memo and stop. The memo is a table: item number, source, target section, verdict, and reason. Add a short list of the escalations that need Jeff's call, and a one-paragraph summary of what the revision will and will not change. This memo is the deliverable of this pass. The manual is the governing document, so editing it is a HUMAN GATE action: Jeff approves the memo before you touch the file.

### Pass 4: apply (after Jeff approves)

Apply the accepted changes to `PCD-OPERATING-MANUAL.md`. Keep the structure: Phases 1 to 3 complete, Phases 4 to 10 stubbed, the org chart tags, distribution-first sequencing, and the football-season idle. Do not expand scope into Phases 4 to 10 unless a change specifically justifies it and Jeff approved that item.

Then: bump the version and add a Review log row naming the sources and what changed, re-mirror the full document to the Notion "PCD Operating Manual" page, and log the revision to the Field & Forge Decision Journal (`Outputs/Forge Command/decision-log.md` and the Notion Decision Journal) with the sources and the headline changes. If Jeff wants the mechanical apply handed to a Sonnet session, the approved memo is a clean handoff; hand it over and stop.

## Guardrails

- Voice rules apply to every word you add: plain language, no em dashes, no AI-tell words, three-sentence paragraph max. Read the anti-AI guide before writing.
- No invented facts or numbers. Every factual change traces to a source file or a live query.
- Do not quietly drop the constitution to satisfy a reviewer. If a reviewer is asking you to, that is an Escalate, and you say why.
- The working set stays capped. Feedback that wants to promote an agent goes through the existence test and the manual-three-times gate, not straight into the org chart.
- Preserve the honest tensions the manual already names. Do not sand off the automation-ahead-of-governance point or Open Item 1 to make the document look tidier, unless the underlying facts changed.

## Report back

End with: how many feedback items came in and from how many sources, the split of Accept versus Reject versus Escalate, the three most consequential changes, the escalations still waiting on Jeff, and any place two sources conflicted where you want a second opinion before you trust your own call.
