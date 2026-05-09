# Editorial review

Every piece on the site carries its own editorial state in frontmatter. The `/admin/editorial` dashboard surfaces all of it on one page. This file is the operator manual.

---

## The fields

```yaml
editorial:
  qualityGrade: 8                    # 1-10, skeptical reader's "is this actually good"
  originalityGrade: 7                # is this Jeff's take or a rephrase of what's everywhere
  voiceGrade: 9                      # does it sound like Jeff
  flagInappropriateness: false       # culture-war, political bias, off-brand
  flagIpRisk: false                  # paraphrased w/o attribution, suspect product claims
  flagSensitiveTopic: true           # mental health, body image, injury, divorce - extra care
  citationCheckPassed: true          # sources cited where claims are made
  sportLanguageCheckPassed: true     # body uses the right vocabulary for the tagged sport (no touchdowns in baseball)
  affiliateDisclosurePresent: false  # FTC requires when affiliate links present
  claudeReviewedAt: 2026-05-03
  jeffReviewedAt: 2026-05-04
  status: jeff-approved              # draft | claude-reviewed | jeff-approved | published | needs-revision
  reviewerNotes: "Tightened hedging on the heat protocol claim; added NATA citation."
  factCheckGoodThrough: 2027-09-01   # for evergreen content with date-sensitive facts
```

All fields are optional. A piece with no `editorial` block defaults to `status: draft` in the dashboard view.

---

## The workflow

1. **Claude writes a piece.** Saves it to the right content directory.
2. **Claude self-reviews** as a skeptical reader and fills in the editorial frontmatter:
   - All three grades
   - Flags as needed
   - `citationCheckPassed: true` only if every claim has a source
   - `sportLanguageCheckPassed: true` only if every term in the body matches `sport-vocab/<sport>.md` for the tagged sport (drills and any sport-specific piece — open the cheat sheet, read the piece, confirm)
   - `affiliateDisclosurePresent: true` only if affiliate links are in the piece AND the disclosure block is present
   - `claudeReviewedAt: <today>`
   - `status: claude-reviewed`
   - `reviewerNotes`: anything Jeff should know before reading
3. **Jeff opens `/admin/editorial`** and filters to "Claude reviewed."
4. **Jeff reads the piece**, edits if needed, then either:
   - Sets `jeffReviewedAt: <today>` and `status: jeff-approved` — done
   - Sets `status: needs-revision` and adds `reviewerNotes` — Claude reworks it

---

## Grading rubric

**Quality (1-10).** How likely is a smart reader to think this is actually good?
- 1-3: bad. Generic, hedge-y, AI-flat.
- 4-6: fine. Useful but not memorable.
- 7-8: good. Specific, useful, has temperature.
- 9-10: great. The piece readers send to other parents.

**Originality (1-10).** Is this Jeff's take or a rephrase of what's already on the internet?
- 1-3: heavily derivative. Could have been written from Wikipedia.
- 4-6: standard guidance with light original framing.
- 7-8: contains real specifics, named examples, opinions you don't get elsewhere.
- 9-10: novel synthesis. The piece other parent sites would copy.

**Voice (1-10).** Does it sound like Jeff?
- 1-3: AI residue. Hedging. Banned words. No temperature.
- 4-6: mostly OK but a few "delve into" or "comprehensive" moments.
- 7-8: solid Jeff voice with the right specifics.
- 9-10: indistinguishable from Jeff writing it himself.

A piece that grades below 7 on any axis should not go to Jeff for review yet. Claude should rewrite first.

---

## Flag definitions

**flagInappropriateness.** True if the piece touches a divisive cultural, political, or religious topic that's outside the site's lane. Trans athlete inclusion (sport-specific governing-body policy is fine; cultural commentary isn't). Race in sports beyond what's directly relevant. Coach political views. Religious content in performance prep. When in doubt, flag and let Jeff decide.

**flagIpRisk.** True if the piece quotes substantial material from another source without proper attribution, makes specific product claims that could be wrong, names individual coaches or kids without permission, or paraphrases another publication's framework so closely that attribution should be considered.

**flagSensitiveTopic.** True if the piece covers mental health, eating disorders, body image, injury, divorce, family separation, or other topics where a parent in distress might be reading. Doesn't mean don't publish — means extra care in framing and resource links.

**citationCheckPassed.** True only if every empirical claim, statistic, governing-body rule, or medical assertion has a source linked in the piece (typically in the Sources section or inline).

**sportLanguageCheckPassed.** True only if every action verb, noun, position name, scoring term, field/court term, and equipment term in the body matches the vocabulary for the tagged sport. The reference is `sport-vocab/<sport>.md`. A baseball drill never says "touchdown," "goal," or "basket." A flag-football drill never says "tackle." A volleyball drill never says "shoot." A girls' lacrosse drill never describes body contact. Most common slip: a writer drifts into the vocabulary of a more-popular sport when describing a similar action ("the runner shot toward second" — wrong, it's "the runner sprinted toward second"). Read the piece once with the cheat sheet open and flag every term that doesn't belong. False is the right answer when in doubt — the cheat sheet exists so this is a quick check, not a judgment call.

**affiliateDisclosurePresent.** True if the piece contains affiliate links AND a disclosure statement appears in the piece. False if affiliate links exist but disclosure is missing (FTC violation).

---

## Using the dashboard

`/admin/editorial` shows every URL on the site with editorial state. Filter buttons:

- **All** — everything
- **Needs review** — draft + needs-revision
- **Claude reviewed** — Claude has done the pass, Jeff hasn't yet
- **Jeff approved** — done
- **Flagged** — anything with flagInappropriateness or flagIpRisk
- **Needs revision** — Jeff sent back to Claude

The columns are dense. Q/O/V are the three grades (Quality / Originality / Voice). Flags abbreviated: INAPPROP / IP / SENS / NOCITE / NOSPORT (sport-language check failed or not run).

Click any title to open the live URL. The editorial block lives in that file's frontmatter; edit there.

---

## Claude's review prompt

When Claude reviews a piece, the question to ask is:

> Is this piece something Jeff would put his name on, send to another parent, and stand behind in five years?

Read the piece skeptically. Look for:
- Hedging vocabulary (somewhat, perhaps, generally, often)
- Banned words from the anti-AI guide (delve, leverage, robust, transformative, etc.)
- Reframe patterns ("not just X but Y")
- Empowerment closes
- Summary closes
- Em dashes
- Three consecutive sentences within five words of each other
- Any claim that could embarrass us if challenged
- Any product mention that might be inaccurate or affiliate-driven without disclosure
- Any topic that veers into culture-war territory

Score honestly. A 7 is a fine piece. A 10 is rare. Below 6, rewrite.

---

## Known gaps

**Auto-derived fields not yet implemented:** sourceCount, updateCount, wordCount, readTime. Future work — would be computed at build time from content, not stored in frontmatter.

**Backfill of existing pieces:** the ~80 articles, body topics, pathways, calendars, and other content from before this session don't yet have editorial frontmatter. They show as `draft` in the dashboard until reviewed. Plan a backfill pass.

---

## Curation principle: home page and /start-here/

Standing rule: every time a new article ships, evaluate whether it earns a slot on the homepage or `/start-here/`. Most won't. The ones that do change the front-door experience and should.

**The two surfaces:**

- **Homepage** (`/index.astro`). The first impression. Lead with cornerstone pieces, the moment-based "what do you need right now" tiles, the active SEO-traffic articles, and the lead magnet. Heavy turnover happens here.
- **`/start-here/`**. The deep parents'-guide entry point. Curated lists organized as Cornerstone reads / New to this / Big decisions / Scripts / Common searches / The body. Each list is a hand-maintained slug array in the page file. When a new piece deserves cornerstone status, add the slug. When a piece falls out of relevance, remove it.

**The five questions to ask when a new article ships:**

1. **Is this the kind of piece a parent would Google?** (search-volume question — does it fit the "common searches" lane on /start-here/?)
2. **Is this a cornerstone, evergreen, deep piece?** (cornerstone slot)
3. **Does it answer one of the "big decisions" parents face?** (decisions hub + /start-here/ decisions list)
4. **Is it a moment-based scripted page?** (Scripts hub + /start-here/ scripts list)
5. **Is it a body/health topic parents Google at 11pm?** (Body hub + /start-here/ body list)

If yes to any: edit the relevant slug list in `/src/pages/start-here.astro` and the relevant featured-content block in `/src/pages/index.astro`. If yes to none: the piece is fine in its category section, doesn't need front-door treatment.

**Rotation rule:**

The homepage and /start-here/ should not become an ever-growing list. When a new piece earns a slot, an older piece may drop. Use editorial judgment. The point is to keep the front door curated and current, not exhaustive.

**Where the curated lists live in code:**

- `src/pages/start-here.astro` — `cornerstoneSlugs`, `newToThis`, `commonSearchSlugs`, `bodyTopicSlugs` arrays. Featured decisions and scripts pull from `featured: true` in their frontmatter.
- `src/pages/index.astro` — homepage situation tiles, featured pillar, latest-reads section.

**Apply this rule every time a new article ships. Especially new SEO-targeted pieces — they're the ones most likely to earn /start-here/ placement.**
