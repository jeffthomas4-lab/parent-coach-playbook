# Editorial style guide

The voice rules live in `About Me/About Me.txt` and `About Me/Anti AI Writing.txt`. This file is the site-specific rules on top of those.

Read both before writing.

---

## Headlines and titles

Two rules.

**Voice headline. Search title.** Each piece can have two titles.

The H1 is voice-strong. It uses italics, idiom, and feels like a magazine. _When she says "I hate this sport"._

The meta `<title>` is search-shaped. It uses the language a parent types into Google. _What to do when your kid says they hate their sport._

When the two are different, set both. The article frontmatter supports a `seoTitle` and `seoDescription` field that overrides the page title for SEO.

```yaml
title: "When she says \"*I hate this sport*\""
seoTitle: "What to do when your kid says they hate their sport"
seoDescription: "What it actually means when a kid says they hate their sport, what to ask, what not to do."
```

Use seoTitle when the H1 is voice-driven. Skip it when the H1 already reads search-friendly.

**Italics with markdown asterisks.** The H1 supports `*phrase*` to render as italic with rust accent color. Use sparingly. Not every title needs an italic. The italic should land on the surprising or emotional word, not a generic noun.

---

## Anchor text on internal links

The anchor text is what Google reads as the topic of the linked page.

Rule: anchor text should match search intent for the linked piece, not the title of the linked piece.

**Bad.** "See [the 90-second rule](/drive-home/the-90-second-rule/) for more."

**Good.** "See [what to say to your kid in the first 90 seconds after a game](/drive-home/the-90-second-rule/) for more."

**Bad.** "Read [Three drives, one relationship](/drive-home/three-drives-one-relationship/)."

**Good.** "Read more on [why the car ride home matters more than the game](/drive-home/three-drives-one-relationship/)."

When the title and the search query are the same, the title works as anchor text. When the title is voice-driven, write a query-shaped anchor.

Don't repeat the same anchor text across many pieces for the same destination. Vary it. Google penalizes anchor patterns that look manipulative.

---

## Internal linking density

Two rules.

Every long-form essay (700+ words) ends with a "Related" line that points to 1-3 specific pieces. The phrasing is conversational, not navigational. _The deeper version is..._ or _The related read is..._

Every script and decision has the structured `relatedScripts` and `relatedDecisions` arrays populated. When you write a new piece, add it to the related arrays of 2-4 existing pieces it connects to. The graph thickens automatically.

Don't add internal links inside the body of the article unless the link is genuinely useful at that moment. Link-stuffing is worse than under-linking.

---

## Formatting

Three-sentence paragraph max. Cut on sight.

No em dashes. Replace with periods, commas, or colons.

No banned words. The full list is in `Anti AI Writing.txt`. The most common offenders to ctrl-F before publishing: delve, leverage, robust, holistic, navigate, embark, journey, transformative, comprehensive, cornerstone, dynamic, straightforward.

H2s with `##`, H3s with `###`. No H1 in markdown body — the H1 is the title.

Blockquotes with `>` for the central pull quote. One per piece, max.

---

## Editorial voice

Peer to peer. Parent to parent.

Specifics over abstractions. Real numbers, real moments, real names where possible.

Conviction, not hedging. Cut sentences with two hedges.

One moment of dry humor or temperature per piece. If the writer's feeling isn't visible, the piece reads AI.

End on substance, not motivation. No empowerment closes.

---

## YAML frontmatter trap

In script and decision arrays, every list item that contains a parenthetical aside must keep the parenthetical INSIDE the closing quote.

**Wrong:**
```yaml
whatNotToSay:
  - "Don't be nervous." (Telling someone not to be nervous adds nerves.)
```

**Right:**
```yaml
whatNotToSay:
  - "Don't be nervous. (Telling someone not to be nervous adds nerves.)"
```

The wrong version breaks YAML with `bad indentation of a sequence entry`. This bug has appeared in three sessions. Don't make it four.

---

## Frontmatter

Every article has, minimum:

```yaml
title: "..."
dek: "..."           # the subhead
phase: "drive-there|game|drive-home|team-parent"
sport: "..."         # see SPORT_ENUM in src/content/config.ts
age: "5-7|8-10|11-12|13-14|15-plus|all-ages"
publishedAt: YYYY-MM-DD
draft: false
```

Optional but recommended:

```yaml
seoTitle: "..."           # query-shaped meta title
seoDescription: "..."     # query-shaped meta description
topic: "..."              # see TOPICS list
format: "essay|note"      # essay if 600+ words; note if shorter
hero: /illustrations/...  # WebP, 1200x630
heroAlt: "..."
```

Editorial review fields are optional but populated for flagship pieces.

---

## When to write what format

**Article (long-form essay).** 600-1200 words. Has a thesis, supports it, lands on a real point. For pieces that need depth: the parent-coach pillar, the hard situations, the cornerstone reads.

**Article (short note).** 250-500 words. Single observation, fast to read. For tactical pieces, weekly publishing rhythm fillers, and one-idea pieces.

**Script.** Structured frontmatter (`whatTheyAreFeeling`, `whatToSay`, `whatNotToSay`, `theRule`, `ifTheyBringItUp`, `saveBlockBullets`). Markdown body is empty or one paragraph max. Use for moment-specific scripts the parent reads in 30 seconds.

**Decision.** Structured frontmatter (`theQuestion`, `benefits`, `costs`, `signsItsAGoodFit`, `signsItsNot`, `howToHandleIt`, `theRule`). Use for the should-we questions parents ask themselves.

**Drill (coachingTips).** Practice-ready. Setup, cue, common mistake, variation. Structured fields for sport, age, fundamental.

---

## What not to write

Recruiting cornerstones. Recruiting is its own pillar at `/recruiting/`. It does not lead the homepage, the start-here page, or popular reads.

Daddyball as a content cluster. One honest essay, fine. Not a series.

Generic "best sports for X-year-olds" SEO content. Other sites have those. Our edge is voice and frameworks, not commodity content.

Anything the writer wouldn't say to a parent at the field on a Saturday morning.

---

## When the AI residue check fails

If a draft sounds AI, rewrite. Specifically:

- Three consecutive sentences within 5 words of each other? Rewrite one.
- Every paragraph follows the same 4-beat structure (setup, point, support, payoff)? Break the pattern.
- Can't tell how the writer feels about the topic? Add temperature.
- Voice fingerprint phrases not present? Check whether they should be.

If you have to fix the tone, it's not done.
