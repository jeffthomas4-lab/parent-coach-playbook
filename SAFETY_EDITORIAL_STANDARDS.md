# Safety pillar editorial standards

The operating manual for any piece in the safety pillar (head injury, heat injury, heart injury, psychological and emotional injury, physical safety, sexual safety). Different rules from the rest of the site. Apply these on every safety piece, every time, no exceptions.

For the strategic plan and the 47-piece backlog this manual governs, see `SMART_TEAMS_RESEARCH.md`.

---

## 1. The frame

Safety content is parent-facing translation of best practices that governing bodies, pediatric medical associations, and equipment standards bodies already publish. PCP is the parent-facing translator. PCP is not the medical authority.

This is the frame that holds the editorial register, the citation discipline, and the liability posture together. If a piece breaks frame (asserts something the cited authorities have not said, or gives advice as PCP's own clinical opinion), the whole pillar's credibility weakens.

---

## 2. Voice register

Different from Drive Home essays. Different from Decisions. Different from Scripts.

**Reportorial, not voicey.** State what the cited authority says. Translate to plain language. Show the parent what to do with the information. Do not wax. Do not editorialize beyond the practical action.

**Plain language, still PCP voice.** No jargon. No clinical-paper register. Same Anti AI Writing checklist as every other piece (no banned words, no em dashes, short paragraphs, no fake-wisdom triplets, no empowerment closes). The voice still sounds human. It just does not sound opinionated.

**Headlines can travel.** "What to do when your kid takes a chest hit" is a fine headline. The body underneath cites the AAP, NOCSAE, and USA Lacrosse and tells the parent what to do.

**Body structure.**
1. One-paragraph lede that names the situation and the action.
2. "What the [authority] says" section with inline citations.
3. "How parents apply this" section with practical action items.
4. "When to involve a doctor or trainer" section with explicit triggers.
5. Related PCP content cross-links.
6. Citations footer (full source list).

---

## 3. Required disclaimer block

Every medical or injury-related safety piece carries this block at the top of the article, before the lede. Render it as a callout component on the site (cream background, clear visual separation, not buried in fine print).

```
---

**Last reviewed:** [Month YYYY]  •  **Reviewed by:** Parent Coach Playbook Editorial[, [Reviewer Name, credentials]]

This article is for general parent education. It is not medical advice. If your child is experiencing symptoms, recovering from an injury, or facing a return-to-play decision, talk to a pediatrician, athletic trainer, or sports medicine physician before acting on anything you read here. The governing bodies cited in this article maintain official guidance that supersedes any summary written here.

---
```

The "Reviewed by" line includes the medical reviewer's name and credentials when the piece has been reviewed by a clinician (see §6 for which pieces require this). Pieces without medical review say "Parent Coach Playbook Editorial" only.

The "Last reviewed" date is updated every time the piece is touched, even for typo fixes, so the date is always honest.

---

## 4. Citation discipline

Every factual claim is cited inline.

**Format.** Hyperlink the source name in the prose, not a numbered footnote. Parents do not click footnotes.

Example:
> [USA Baseball's Pitch Smart guidelines](https://www.usabaseball.com/pitchsmart) cap a 12-year-old at 85 pitches per game and require four full days of rest after that count.

The link goes to the most current public guidance page. The parenthetical or attached phrase makes it clear which authority is talking.

**Authority hierarchy.** Source from the highest-authority tier available for the claim. Mix tiers within a piece is fine; just always cite the highest available.

| Tier | Source type | Examples |
|---|---|---|
| 1 | Sport governing body guidance | USA Baseball, US Lacrosse, USA Hockey, US Soccer, USA Swimming, USA Football, NFHS, NCAA |
| 2 | Equipment standards bodies | NOCSAE, HECC, ASTM, SEI |
| 3 | Pediatric medical associations | AAP, AMSSM, AOSSM, AAOS, ACSM |
| 4 | Government and regulatory | CDC, NIH, FDA |
| 5 | Peer-reviewed pediatric sports medicine literature | PubMed, primary studies |
| 6 | Reputable secondary reporting only when reporting on tier 1-5 | The Athletic, NYT, Stat News |
| Never | Random blogs, Reddit, social media without verification, manufacturer marketing |

**Direct quote rule.** If you are using the authority's exact wording, put it in quotes and cite. If you are paraphrasing, do not put quotes; still cite.

**Date the source.** When the cited guidance has a publication or last-updated date, name it inline. Example: "the AAP's 2024 Heat Illness in Children guidance" rather than just "the AAP." Saves the reader from having to verify whether you are citing current or stale guidance.

---

## 5. What we never do

These are non-negotiable. Any draft that breaks one of these rules gets rejected and rewritten.

1. **Never present PCP as the medical authority.** PCP does not know your child's history. PCP is not in the room. PCP is the translator of what other authorities have already said.
2. **Never recommend specific treatments or dosages.** Even for OTC pain relievers. The piece can say "the AAP recommends consulting a pediatrician about ibuprofen dosing for kids under 12." The piece does not say "give your kid 200mg of ibuprofen."
3. **Never assert prevention claims that the cited authority has not made.** If NOCSAE says a chest protector "reduces but does not eliminate" commotio cordis risk, PCP says exactly that. PCP does not say "wear this and your kid will be safe."
4. **Never use marketing language from manufacturers as if it were evidence.** A helmet brand's claim that its product "protects against concussion" is not evidence; cite the independent testing (Virginia Tech STAR ratings, NOCSAE certification status) instead.
5. **Never write hypothetical case studies as if they were real.** If you are using a scenario to illustrate, name it as a scenario.
6. **Never opine on whether your child should play a specific sport at a specific age.** Cite the AAP / governing-body guidance and let the parent decide.
7. **Never reference specific named children, even composite or fictionalized, without explicit permission and documentation.** Use scenario framing instead ("a 12-year-old pitcher who throws 80 pitches Saturday morning and 60 more Sunday afternoon") rather than "Jake, a 12-year-old pitcher."

---

## 6. When a piece needs medical review before publish

Every piece in these categories goes to a credentialed reviewer before it ships. Budget $50-100 per piece for a sports-medicine PT, ATC, or pediatric sports medicine physician to read and sign off.

| Category | Why review is required |
|---|---|
| Arm care and overuse (pieces 27-34 in the backlog) | Pieces prescribe physical activity (prehab routines, daily checks, return decisions). Mistakes hurt kids. |
| Heart injury (pieces 12-17) | High-stakes content. AED protocols, commotio cordis, cardiac screening recommendations. |
| Concussion deepening (pieces 1-7 in the backlog) | High-stakes and the science updates frequently. |
| Female athlete health and RED-S (pieces 19, 20) | Eating disorder triggers; clinical framework recently updated. |
| Return-to-play decisions (piece 37) | Return-to-play guidance is a clinical judgment. PCP's role is to translate the framework, not to make the call. |
| Any heat illness piece that prescribes hydration math | Hyponatremia risk is real on the over-hydration side. |

The reviewer's name and credentials appear in the "Reviewed by" line of the disclaimer block. Document the reviewer's CV in the project's `MEDICAL_REVIEWERS.md` registry (create on first use).

Pieces outside these categories may still be reviewed at the editor's discretion. Default to "yes if in doubt."

---

## 7. Refresh schedule

Tighter than the standard 18-month refresh in the business plan.

| Pillar | Maximum interval between reviews |
|---|---|
| Head injury | 12 months |
| Heart injury | 12 months |
| Heat injury | 12 months |
| Physical safety (arm care, joint, equipment) | 12 months |
| Psychological and emotional injury | 18 months |
| Sexual safety | 18 months |

**Triggered review** happens whenever a cited governing body publishes new guidance, regardless of the calendar. Subscribe to the email lists of every cited authority (CDC, AAP, NOCSAE, USA Baseball, US Lacrosse, USA Hockey, US Soccer, USA Swimming, NFHS) and route the alerts to a single Notion inbox so triggers do not get missed.

The "Last reviewed" date in the disclaimer block updates on every review, even when no content changes. The date is the discipline.

---

## 8. Schema markup

Every safety piece emits the following Schema.org JSON-LD in addition to standard Article schema.

- `MedicalWebPage` schema with `lastReviewed` populated from the disclaimer block date
- `MedicalAudience` of `audienceType: Patient` and `geographicArea: US`
- `medicalSpecialty` per piece (e.g., `MedicalSpecialty.Pediatrics` for kid-specific content; `MedicalSpecialty.Cardiology` for heart pieces)
- `reviewedBy` populated with the medical reviewer's `Person` schema where applicable
- `citation` populated with the full source list (helps Google understand the evidence base)

The site's `ArticleSchema.astro` component (per business plan §10.1) needs a "safety variant" added to support this. Six hours of dev work, one-time.

---

## 9. The pre-publish checklist

Print this. Tape it to the desk. Run every safety piece through it before publishing.

- [ ] Disclaimer block present at top, with current "Last reviewed" date
- [ ] Disclaimer block lists "Reviewed by" with medical reviewer name + credentials when applicable (per §6)
- [ ] Every factual claim has an inline hyperlinked citation to a tier-1 through tier-5 source
- [ ] No tier-6 or tier-"never" sources used
- [ ] No PCP-as-medical-authority phrasing
- [ ] No specific treatment / dosage recommendations
- [ ] No prevention claims beyond what the cited authority asserts
- [ ] No manufacturer marketing language used as evidence
- [ ] No real or composite children named
- [ ] Voice register is reportorial, not opinion essay (Drive Home / Decision / Script voice does not appear in the body)
- [ ] Anti AI Writing checklist passes (no banned words, no em dashes, short paragraphs, no AI tells)
- [ ] Cross-links to related PCP content in place (gear cards, decisions, scripts where relevant)
- [ ] Schema markup includes `MedicalWebPage` with `lastReviewed`
- [ ] Citations footer present with full source list
- [ ] Medical reviewer signed off in writing where required (per §6)

---

## 10. The legal posture

These standards exist because a parent will at some point follow PCP's safety content, a child will still get hurt or worse, and PCP will receive a complaint or a claim. The disclaimer block, the citation discipline, the medical review requirement, and the "we are translators not authorities" frame are the whole package that makes the position defensible.

Insurance (per business plan §12.4) is the financial backstop. The editorial standards in this document are the everyday discipline that prevents the claim from being meritorious in the first place.

Get the GL + E&O policy quoted and bound before the first cardiac piece ships in Q3 2026. Document the editorial standards process (this file) in the application materials. Insurers like to see written editorial discipline; it lowers the premium.

---

## 11. When to break the rules

Almost never. The reportorial register is the standard for safety pieces.

The one exception: a piece that is explicitly framed as personal experience or community story. Example: "A father writes about losing his son to cardiac arrest at a baseball game." That piece is voice-driven by definition. It should still carry the disclaimer block, still cite the safety guidance the family wishes they had known, and still route to the relevant safety pillar landing page. But the body is allowed to be voicey because the piece IS the voice.

Mark these pieces clearly in the editorial queue with `Type: Story` so the standards review knows which ruleset applies. Default everything else to reportorial register.
