# AI workflow for Parent Coach Playbook

How to keep the site updated with weekly posts using AI as the drafter and a human as the editor. The point is to make publishing fast enough to be sustainable.

## The cadence

| When | What | Who |
|------|------|-----|
| Monday morning | Pick the week's two short reads + check if a longer essay is due | Editor |
| Monday + Tuesday | AI generates drafts in editorial voice | Claude |
| Wednesday | Editor edits. ~20 min per post. Read aloud once. | Editor |
| Thursday | Push to GitHub. Cloudflare auto-deploys. | Editor |
| Friday morning | Newsletter goes out via Kit. Posts linked. | Editor / Kit |

**Minimum viable cadence: 2 short reads + 1 essay per month.** Realistic upper bound: 2 short reads per week.

## The single voice

Every piece on the site is written and edited by **Parent Coach Playbook Editorial**. There are no individual bylines. The voice is plural-implied, second-person friendly, and built around the idea that we are a small group of parents who have done this for years across many sports.

The full voice rules live in `EDITORIAL_VOICE.md`. They are the source of truth. The summary below is a reference for prompting AI.

## The voice in one paragraph

Plain language. Advice first. Reason second. Example third. Three-sentence paragraphs. No em dashes. No banned words. No "not just X, but Y" framings. No fake-wisdom triplets. No empowerment closes. "We" is fine. "I" referring to a single named person is not. "You" is encouraged. Specific numbers, real ages, real cleat sizes.

## The prompt template

Use this when asking Claude (or any AI) to draft a post.

```
You are drafting a post for parentcoachplaybook.com. Voice rules below are mandatory.

Voice:
- The byline is "Parent Coach Playbook Editorial". The voice is plural-implied. We sound like a small editorial team of parent-coaches.
- Plain language. The point first. The reason second. The example third.
- Three-sentence paragraph maximum.
- No em dashes. Period or colon only.
- No banned words: delve, leverage, robust, seamless, pivotal, navigate (figurative), embark, journey (figurative), unlock, unleash, empower, dive into, masterclass, game-changer, vibrant, intricate, holistic, paradigm, revolutionary, transformative, cutting-edge, world-class, top-notch, state-of-the-art, dynamic.
- No "not just X, but Y" framings. Rewrite straight.
- No fake-wisdom triplets like "inspire, empower, ignite". Cut to one or rewrite.
- No empowerment closes. End on a fact or an action.
- "We" is fine. Never "I" referring to a single named person.
- "You" addressed to the reader is encouraged.
- Specific numbers, real ages, real distances, real cleat sizes. Not "many" or "often".

Structure:
- Lead with the point.
- Subheads are short and load-bearing. The reader scanning subheads should see the structure of the argument.
- Wrap the conceptual hinge of the headline in *asterisks* so it renders italic.
- One italic phrase per H1.

Pacing:
- Short read (format: note): 200-500 words.
- Longer read (format: essay): 600-1500 words.
- Drill or coaching tip: 200-600 words.
- Buy guide: 400-800 words.

Topic: <pick from CONTENT_ROADMAP.md>
Format: <note | essay>
Length: <e.g. 350 words>
Hook: <the angle, e.g. "the night before tryouts">
Tags: phase = <drive-there | game | drive-home>, age = <5-7 | 8-10 | ...>, sport = <baseball | softball | ...>

Draft the post. Then review it against the voice rules and edit any violations before returning it.
```

## How to edit AI output fast

1. Read the headline. Does it have one italic phrase? Is the phrase the conceptual hinge?
2. Scan the subheads. Are they load-bearing or decorative? Cut decorative.
3. Read the first sentence of every paragraph. Is the point there? If not, move it.
4. Count em dashes. If there are any, replace them.
5. Search for banned words. Replace with concrete plain English.
6. Read the final paragraph. Is it an empowerment close? If yes, rewrite to end on a fact or action.
7. Read aloud. If it doesn't sound like a person talking to another person, rewrite the section that sounds wrong.

20 minutes per post. Maybe 30 if it needs structural work.

## Frontmatter checklist

Every article needs:

```yaml
---
title: "..."
dek: "..."
topic: "..."   # optional, one of TOPICS in src/data/site.ts
format: "note"  # or "essay"
phase: "drive-there"  # or "game" or "drive-home"
sport: "..."  # one of SPORTS
age: "..."    # one of AGE_BANDS or "all-ages"
publishedAt: 2026-MM-DD
featured: false
---
```

The `contributor` field has been removed from the schema. Don't add it back.

## Where to source topics

`CONTENT_ROADMAP.md` has the master pipeline. As pieces ship, mark them SHIPPED in that doc. As new gaps surface from reader email, add rows.

## What AI is good at vs. bad at

Good at: drafting structure, rephrasing, cutting AI-residue patterns from human-written copy, generating sport-specific examples once a clear hook is set.

Bad at: knowing what's actually true about a niche league rule, knowing what's currently true about a product price, picking the right hook for a topic, sounding like a person without heavy editing.

Use AI as a drafter and a sparring partner. Never as the final voice.
