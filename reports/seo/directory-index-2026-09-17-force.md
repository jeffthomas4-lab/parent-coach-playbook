# Directory index policy — 2026-09-17 force-run addendum (Dex)

**Agent:** Dex (`pcd-directory-index-policy`)
**Type:** Jeff-ordered P3 force-run addendum to `directory-index-2026-09.md` (2026-09-05 recovery pass).
**Prior GSC file:** `gsc-review-2026-09-13.md` (indexed still 57; camps collapse flagged).

## What changed since Sep 5

| Signal | Sep 5 Dex | Sep 13 GSC | Sep 17 (this run) |
|---|---|---|---|
| `sitemap-camps.xml` locs | 21 | 37 discovered (GSC) | **118** (live fetch) |
| Live approved+future (D1) | ~21 | ~17 (GSC narrative) | **118** |
| Pending | ~137 | — | **40** (ussportscamps dup-org holds) |
| Camps sweep | broken (no past-date rejects) | still dry | **CRON_KEY rotated; manual smoke 200** |

Root cause of the Sep collapse was confirmed earlier today: `CRON_KEY` mismatch between `parent-coach-desk` and `parent-coach-playbook-cron` (auth-fail pattern since ~2026-07-19). Key rotated on both workers; daily sweep expected green from next 6:00 AM PT.

P1 triage (Jeff-approved) stamped evergreen window `2026-09-16`→`2027-08-31` on Ranger's 98 approvables, rejected 3 Camp STAR, held 40 ussportscamps dups. `reviewed_by=pcd-p1-evergreen-2026-09-17`. That is a **data refill**, not a differentiation win. Do not treat 118 as proof the publish threshold improved.

## Index ratio

Still **no fresh GSC pull** from Dex this session. `scripts/seo/pull-gsc.mjs` still missing. Sep 13 GSC review remains the last indexed count (**57**). Recommendation unchanged: stand up Field & Forge GSC access (service account) so Dex/Nora are not blind.

Publishing volume (own-site, today):
- `sitemap-camps.xml`: **118** locs
- Content sitemap not re-counted this addendum (see Cal `COVERAGE-2026-09.md` for corpus +63)

## Differentiation / threshold

Sep 5 scored the entire live population (n=21, median 30). Population is now 118. **Do not extrapolate the Sep 5 median.** Next Dex cycle should resume the 40–60 rotating slice on the post-P1 set and re-propose the publish threshold with evidence.

Standing caution from Sep 5 still applies: fixing the sweep / approving evergreen without an eligibility check can refill the directory with thin scraped pages. P1 used Ranger triage + a season stamp; quality scoring is still owed.

## /adaptive/ silo

No new work this addendum. Carry forward Sep 5 / prior answer; do not re-ask until GSC template attribution is available again.

## Recommendations for Jeff

1. Merge/deploy affiliate PR #80 separately; camps P1 is already live via D1 (no deploy needed).
2. Next Dex full cycle: score 40–60 of the new 118; propose threshold with that sample.
3. Unblock GSC (service account or Field & Forge browser identity). Highest Dex dependency.
4. Watch empty-state hub 404s from Sep 13 GSC — after refill, re-check `/camps/pa/` and `/camps/mn/` specifically.

## Slack posture

Material movement (camps 21→118 + sweep root cause fixed) — post one line with this addendum.

<run-summary>Force-run addendum: camps live 21→118 after P1+CRON_KEY fix; GSC still blind (57 indexed as of Sep 13); re-score owed next cycle; no sitemap/robots writes.</run-summary>