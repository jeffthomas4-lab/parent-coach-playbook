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

The columns are dense. Q/O/V are the three grades (Quality / Originality / Voice). Flags abbreviated: INAPPROP / IP / SENS / NOCITE.

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
