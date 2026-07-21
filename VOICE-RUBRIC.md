# Voice rubric: publish gate for Parent Coach Desk

This is the test a review agent runs on a draft before it goes live. Every line item is pass/fail. No score, no vibes, no "close enough."

A draft is PUBLISHABLE only when every section below passes. One fail anywhere sends it back with the specific line item named.

Source law: `ABOUT ME/About Me.txt` and `ABOUT ME/Anti AI Writing.txt`. This rubric translates those rules into checks a reviewer can run against text alone.

---

## Section A: Structure

Run these against the body text only (not frontmatter, checked separately in Section F).

1. **Paragraph length.** No paragraph exceeds 3 sentences. Test: split on blank lines, count sentences per block. One paragraph over 3 sentences fails the section.

2. **No em dashes.** Zero instances of `—` or a double hyphen used as a dash, anywhere in the file, including the dek, seoDescription, and any frontmatter string field. Test: search the raw file for the character.

3. **Opens inside the problem.** By the end of sentence two, the piece has stated a concrete fact, scene, or question. Test: sentence one and two contain no throat-clearing windup ("As a parent, you know...", "Let's talk about...", "In today's youth sports world...", "It's important to note..."). Fail if either sentence is a general statement instead of a specific one.

4. **No summary close.** The last paragraph does not restate what the piece already said. Test: last paragraph fails if it opens with "So what does this mean," "The takeaway is," or restates the thesis in different words.

5. **No empowerment close.** The last sentence does not tell the reader how to feel or send them off inspired. Test: fail on any variant of "the future is yours," "you've got this," "now go make it happen," "trust the process." A close on a fact, a rule, or a next action passes.

6. **Sentence rhythm.** No three consecutive sentences fall within five words of each other in length. Test: count words per sentence, check every rolling window of three.

7. **No unsolicited bullets in prose sections.** Essay- and note-format articles and body/topic pages carry their argument in prose. Test: fail if a numbered or bulleted list appears where the collection schema didn't call for one. Gear lists, rule lists, and script arrays are exempt: those are the collection's actual data.

8. **At least one specific.** A real number, a named rule or governing body, a real price or price range, or a named age band. Test: fail if the piece contains zero digits, zero named organizations, and zero named ages across the whole body.

9. **At least one voice marker.** A sentence fragment used on purpose, a sentence starting with "And" or "But," a parenthetical aside, or a flat opinion stated without a hedge word. Test: fail if none of the four appear anywhere in the body.

**Section A passes only if all nine items pass.**

---

## Section B: Banned words

Copied from `ABOUT ME/Anti AI Writing.txt`. Zero tolerance. A single instance anywhere in title, dek, seoDescription, bluf, or body fails the section. Exception: a word appearing inside a proper noun (an organization's actual name) or a direct quote from a source does not count.

**Confirmed core list:** delve, tapestry, leverage, robust, seamless, pivotal

**AI-tell verbs:** navigate, embark, unlock, unveil, foster, cultivate, elevate, empower, transform, showcase, underscore, emphasize, facilitate, utilize, harness, spearhead, champion, amplify, streamline, curate, craft (as a verb), usher

**AI-tell adjectives:** comprehensive, nuanced, multifaceted, intricate, sophisticated, holistic, dynamic, vibrant, compelling, meaningful, impactful, transformative, game-changing, groundbreaking, cutting-edge, ever-evolving, ever-changing, rapidly-evolving, fast-paced, bespoke, curated, myriad, profound, essential, crucial, vital

**AI-tell nouns:** realm, landscape, journey, ecosystem, synergy, paradigm, framework (when vague), wealth (of knowledge/experience), plethora, testament, cornerstone, bedrock, linchpin

**AI-tell transitions and filler:** moreover, furthermore, additionally, consequently, notably, importantly, indeed, ultimately, essentially

**Hedging vocabulary:** somewhat, fairly, quite, rather, perhaps, arguably, relatively, generally, typically, often, sometimes, can be, may be, tend to, could. Test: fail if any single sentence carries two or more hedge words. A piece with more than three total hedge words across the whole body also fails, even spread out.

**AI-tell phrases:** delve into, dive deep, deep dive, at the end of the day, it's worth noting, it's important to note, it's worth mentioning, when it comes to, in the realm of, at the heart of, at its core, the crux of, testament to, speaks volumes, in today's world, in an ever-changing landscape, paint a picture, a true testament, a world where, whether you're X or Y, not only X but also Y, straightforward

**Test:** search the file (title through body) for every term above, whole-word, case-insensitive. Zero matches required. One match fails the section.

---

## Section C: Banned patterns

Each pattern below is judged the same way: one clean instance fails the section. Each comes with an invented violation, built to illustrate the pattern, and the corrected version.

**1. Reframe pattern.** "This isn't just X, it's Y."

Violation: "The playing-time conversation isn't just a talk with the coach, it's a test of whether your family can handle disappointment."
Fix: "The playing-time conversation is a talk with the coach. Handle it directly and your kid learns something real about disappointment."

**2. Fake wisdom triplet.** Three parallel abstract items dressed up to sound deep.

Violation: "Good team parents show up with patience, with perspective, with grace."
Fix: "Good team parents show up on time and keep quiet during the game."

**3. Empowerment close.** An ending that tells the reader how to feel instead of ending on substance.

Violation: "Your kid's season is what you make of it. Go make it count."
Fix: "Next week's practice starts at 5:30. Get there ten minutes early."

**4. Throat-clearing opening.** "Let me explain." "Here's the thing." "To put it another way." Test: fail if either of the first two sentences is a signpost instead of a fact.

**5. Weak sentence starters.** "This is," "It's," "There are," "There is" opening a sentence. Test: fail if more than one appears per 300 words of body text, or if either opens the first paragraph.

**6. Summary close.** Covered in Section A, item 4. Also fails here if it restates the thesis using "in summary" or "the takeaway."

**7. Concession structure.** "While X, it's also true that Y." Test: fail on any sentence built on this exact shape.

**Section C passes only if none of the seven patterns appear.**

---

## Section D: Positive exemplars

Three passages from published, claude-reviewed-or-higher PCD content. Each is what "pass" looks like.

**1. Opens inside the problem, no windup.**
> "Science fair project is due Wednesday. Your kid has a soccer tournament Saturday. The project isn't done. The tournament has been on the calendar since August."
> Source: `src/content/articles/the-science-fair-question.md`

Passes Section A item 3. Two sentences in and the reader is already in the collision, not being told one is coming.

**2. Specific, short, no hedge stacking.**
> "The premise is simple: significant bleeding can kill a person in 5 to 10 minutes, faster than emergency medical services (EMS) can arrive at most fields. A trained bystander buys the time that matters."
> Source: `src/content/body/stop-the-bleed-basics.md`

Passes Section A item 8 (a real number) and Section B (zero banned words, zero hedge stacking).

**3. Ends on substance, not motivation.**
> "One bat that fits him today beats three bats that are wrong."
> Source: `src/content/articles/13-14-bat-drop.md`

Passes Section A item 5. The close is a fact about bats, not an instruction to feel a certain way.

---

## Section E: Publish gate, beyond voice

A piece can pass Sections A through D and still not be ready to ship. Check these against the frontmatter and body together.

1. **Every checkable fact has a current source.** Any number, rule, price, or claim that could go stale (a rule change, a price, a governing-body standard) traces to a named source in the piece or in `governingBodies`. If the collection has `citationCheckPassed`, it is `true`. If the fact is date-sensitive, `factCheckGoodThrough` is set and is not already past.

2. **No open editorial flags.** `flagInappropriateness`, `flagIpRisk`, and `flagSensitiveTopic` are all `false`. If any is `true`, there is a matching entry in `flagResolutions` with `flag`, `reason`, `date`, and `admin` all filled in. An unresolved `true` flag fails this section outright.

3. **Affiliate disclosure present when required.** If the body contains any `/go/` link or otherwise links to a purchasable product, `affiliateDisclosurePresent` is `true` and the disclosure sentence ("Some links on this page are affiliate links...") appears in the visible body text, not just the frontmatter flag.

4. **Frontmatter is schema-complete.** Every field required (non-optional) by that collection's schema in `src/content.config.ts` is present and valid. Test: run the piece through the Astro content collection build (or the schema by hand) and confirm zero validation errors.

5. **Dek under 15 words.** Where the collection has a `dek` (articles) or `lede` (guides), it is under 15 words. Test: word count the field directly.

6. **Sport-language check, where tagged.** If the piece carries a `sport` or `sportTags` value, `sportLanguageCheckPassed` is `true`, meaning every action verb and noun in the body matches that sport's actual vocabulary (see `sport-vocab/<sport>.md`), not a generic or borrowed term from another sport.

**Section E passes only if all six items pass.**

---

## Scoring

Four sections: A (Structure), B (Banned words), C (Banned patterns), D (Positive-exemplar calibration is reference only, not scored), E (Publish gate).

Each of A, B, C, E returns PASS or FAIL. No partial credit inside a section: one failing item fails the whole section.

**PUBLISHABLE = A pass AND B pass AND C pass AND E pass.**

Any single FAIL means the piece goes back with the exact item that failed, named specifically, so the fix is targeted instead of a full rewrite.
