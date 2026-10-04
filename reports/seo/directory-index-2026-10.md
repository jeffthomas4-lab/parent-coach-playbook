# Directory index policy, 2026-10

**Agent:** Dex (`pcd-directory-index-policy`)
**Run date:** 2026-10-04 (~7:45 AM PT scheduled fire; this report written the same morning).
**Prior Dex:** `reports/seo/directory-index-2026-09.md` (2026-09-05) + addendum `reports/seo/directory-index-2026-09-17-force.md`.
**GSC source:** Nora `reports/seo/gsc-review-2026-09-21.md` (and `reports/seo/data/gsc-2026-09-21.json`). No independent GSC pull this run.
**Raw scoring:** `reports/seo/data/2026-10-04-dex-camp-slice-scoring.json` (n=54, full public-eligible population).
**Supporting reads:** `reports/seo/data/2026-10-04-dex-public-camps-d1.json`, `reports/seo/data/2026-10-04-dex-crosslist.json`, `reports/seo/data/2026-10-04-sitemap-camps-urls.txt`.

---

## 1. The ratio — indexed held at 57; live camps inventory fell again (118 → 54)

**Indexed / not-indexed (Nora, 2026-09-21 — last confirmed GSC):**

| Metric | Nora 2026-09-21 |
|---|---|
| Indexed | **57** (held second straight week after 90 → 61 → 57) |
| Not indexed | **~3.03K** |
| Crawled - currently not indexed | 1,511 |
| Discovered - currently not indexed | 1,308 |
| Not found (404) | 121 |
| Alternate canonical | 36 |
| Blocked by robots.txt | 31 |
| Page with redirect | 8 |
| Soft 404 | 1 |
| Duplicate, Google chose canonical | 15 |

No newer Nora file exists after Sep 21. `scripts/seo/pull-gsc.mjs` is still **missing**. `PCD_AGENT_RUNS_TOKEN` is still absent from the DESKTOP Shell env, so agent-run start/finish could not be logged. Same GSC-blind posture as Sep 5 / Sep 17.

**GSC camps sitemap lag (Nora):** GSC still showed `sitemap-camps.xml` Success with **37 discovered**, last read **Aug 28**, while live was already 118 on Sep 17–21. That re-read ask is still open; this run's live count has moved again (below).

**Live publishing volume (own-site fetch, 2026-10-04):**

| | Sep 5 Dex | Sep 17 force | Nora Sep 21 (live note) | **Oct 4 (this run)** |
|---|---|---|---|---|
| `sitemap-content.xml` locs | 2,042 | (not re-counted) | ~2,072 | **2,083** |
| `sitemap-camps.xml` locs | 21 | **118** | 118 | **54** |
| `sitemap.xml` (index) | — | — | 2 children | **2** children |
| Approx total published | ~2,063 | ~2,190+ | ~2,190 | **~2,137** |

Content is flat-to-up (+41 vs Sep 5). Camps are the story: **118 → 54 in 17 days**. That is not a quality win and not a broken sweep repeat of Sep 5. Section 2 is the mechanism.

---

## 2. Why camps are 54 — evergreen filter, not another archive collapse

`listAllCampSlugsApproved` (`src/lib/camps-db.ts`) no longer publishes every `pcd_status='approved' AND session_end_date >= today` row. `PUBLIC_APPROVED_DATE_SQL` also hides listings whose start is already past **and** whose window looks like a placeholder: span ≥ 300 days, or the exact Sep 16 → Aug 31 stamp used in the 2026-09-17 P1 evergreen pass.

D1 read-only against `activity-radar` (wrangler OAuth `eepskalla`, `--remote`, SELECT only):

| Signal | Count |
|---|---|
| `pcd_status=approved` | 1,620 |
| `pcd_status=rejected` | 1,350 |
| `pcd_status=pending` | **0** |
| `awaiting_review=1` (all approved) | 23 |
| Approved, `session_end_date` future | **117** |
| …of which evergreen/placeholder-hidden | **63** |
| …of which **public-eligible** (matches live sitemap) | **54** |
| `reviewed_by=pcd-p1-evergreen-2026-09-17` still approved+future | 98 |
| …of those public-eligible | 35 |
| `reject_reason_code=past-date` | **450** (was **0** on Sep 5) |
| `reject_reason_code=not-youth-activity` | 6 |
| Approved, past `session_end_date` | 847 |
| Approved, null `session_end_date` | 656 |

**Read of the numbers:**

1. The Sep 17 CRON_KEY / sweep fix **did** land: 450 `past-date` rejects exist now. Sep 5's "sweep never wrote a single past-date reject" is closed.
2. The Sep 17 P1 evergreen refill (98 stamped `2026-09-16`→`2027-08-31`) is largely **invisible to Google and to parents** wherever `PUBLIC_APPROVED_DATE_SQL` treats those windows as placeholders. Live inventory is 54, not 118. Do not treat either number as evidence that differentiation improved.
3. Pending queue is empty (0). That is new vs Sep 5's ~137 / Sep 17's ~40 ussportscamps holds. `awaiting_review` still flags 23 already-approved rows.

**Cohort inside the live 54 URLs** (from sitemap + D1): EVG volleyball-heavy set **35**, Nike non-adult **7**, Nike adult tennis **5**, i9 **3**, Camp Fire **1**, other **3**.

---

## 3. Attribution by template — still mostly content crawl-budget, not camps

Without a fresh Page Indexing sample (no `pull-gsc.mjs`, no new Nora file), attribution is from **sitemap composition + prior GSC reason buckets + D1**, not from new GSC URL examples.

**Published URL mix (live, Oct 4):**

- Content sitemap **2,083** locs. Top silos by path prefix: `coaching-tips` 578, `drive-there` 377, `team-parent` 223, `drive-home` 209, `body` 178, `what-to-buy` 112, `game` 96, `scripts` 54, …, **`adaptive` 19**, other hubs smaller.
- Camps sitemap **54** locs (~2.5% of ~2,137 published URLs).

**What that means for Nora's ~3.03K not-indexed:**

- The bulk of not-indexed volume **cannot** be camp listings. Camps are tens of URLs; not-indexed is thousands. Carry forward August/Sep: the May/June `coaching-tips` / `drive-home` / `drive-there` batch still dominates crawl-budget pressure (`Crawled-not-indexed` 1,511 + `Discovered-not-indexed` 1,308).
- Camps can still contribute to **stale discovered** counts (Nora: GSC camps sitemap stuck at 37 discovered) and to 404/redirect reason noise on expired slugs, but they are not the template generating the majority of refusals.
- **Honest limit:** I cannot name a fresh per-URL GSC example set this month. Template attribution for the 1,511 / 1,308 buckets remains the prior August alphabetical-sample caveat until service-account GSC access exists.

---

## 4. `/adaptive/` — carried answer, still closed

Standing first job remains closed. Carry-forward from Aug / Sep 5 / Sep 17:

- The Jul 28 "1,208 Discovered-not-indexed" sample was **not** the `/adaptive/` silo (19 URLs total then and now). Sampling artifact from GSC's alphabetical examples.
- De-orphan fix from Aug (`36263e83`, Reads nav + footer) is still live.

**Oct 4 spot-checks:** `/adaptive/` 200; three article URLs (`adhd-and-youth-sports`, `unified-sports-explained`, `special-olympics-guide-for-parents`) 200; content sitemap still lists **19** `/adaptive/` locs; `READS_NAV` still includes "Adaptive athletes." No new evidence to reopen the question. Fresh GSC template attribution would be needed before spending more cycles here.

---

## 5. Differentiation scoring — full public population (n=54)

Charter asks for a 40–60 rotating slice. Live public population is **54**, so this run scored **all** of them (same exception pattern as Sep 5 when the population was 21). Rubric unchanged from Sep 5 / Aug 3.

| | Aug 3 (n=50) | Sep 5 (n=21) | **Oct 4 (n=54)** |
|---|---|---|---|
| Median | 40 | 30 | **20** |
| Mean | 41.1 | 23.3 | **23.2** |
| Range | 0–80 | 0–40 | **−10–50** |
| Raw category token in UI | 27/50 (54%) | 19/21 (90%) | **18/54 (33%)** |
| Real equipment/gear block | 13/50 (26%) | 1/21 (5%) | **35/54 (65%)** |
| Cross-listing at address | 31/50 (62%) | 0/21 (0%) | **23/54 (43%)** |
| Thin About (&lt;40 words) | — | high | **36/54 (67%)** |
| Verification stamp (`verified=1`) | present on many | present on many | **0/54** |
| Adult-only disqualifier live | — | 6 | **5** |

**Score histogram:** −10:1, −5:3, 10:8, 20:18, 30:13, 40:10, 50:1.

**Read carefully:** median **20** is worse than Sep 5's 30, but the populations are not comparable. Sep 5 was a collapsed Nike/i9-heavy set of 21. Oct 4 is dominated by thin EVG volleyball club rows (many empty About blocks, ages often missing) that the P1 evergreen pass made approved and that the placeholder filter only partially hid. Gear-block rate looks "better" only because many EVG rows carry `activity_category=volleyball`, which matches a buying guide — that is template affinity, not richer camp copy.

**Verification stamp regression:** every public-eligible row has `verified=0` in D1 today; live pages show no Verified pill. Sep 5's Nike set was earning the +10. That stamp layer is gone from the live set.

**Adult-only still live (eligibility, not score):** five Nike Adult Tennis URLs remain in the public sitemap with ages 18–22 style bands. Four other adult-tennis rows are already `rejected` / `not-youth-activity` (progress since Sep 5). Several additional adult-tennis rows are still `approved` with **past** `session_end_date` (should be sweep fodder; not in sitemap, but still mis-labeled approved).

**Fragment / broken titles still live:**

- Pacific Arts Association — title literally **"The camp"** (score −5).
- Puget Sound Guitar Workshop — title **"All 2026 PSGW Summer Camp Weeks Are Full"** (score −5).

**Best page in set:** Pro Football Camp (Colorado Springs) at **50** — complete record, real About, real equipment block, no raw category token. Still the ceiling-setter; nothing reaches Aug's 80s.

---

## 6. Keep / improve / pull — recommendations only

### Pull from sitemap (eligibility or irreparable thinness) — 9

**Remove regardless of score (5):** the five live Nike Adult Tennis listings. Same `not-youth-activity` hard disqualifier as Sep 5. Partial Ranger cleanup already rejected four others; finish the live set.

**Fix or pull (4):**

- Pacific Arts — fragment title "The camp".
- PSGW — sold-out status title with no next-season path.
- i9 Sports Kent flag football — score −10 (raw `Other` category + thin About); either enrich or demote.
- Youth Capoeira Classes — score −5 (no ages, empty/thin About, no gear).

### Keep as-is (genuinely differentiated enough for now) — 8

Pages at ≥40 that are not adult-only: Pro Football Camp (50); two EVG girls volleyball programs with cross-lists (40); both i9 Puyallup leagues (40); three Nike Indoor Soccer / HUB Sports Rancho Solano variants (40). Still carry template debt (see improve), but they clear a commercial floor.

### Improve (template + data) — 37

Most of the EVG volleyball set and remaining Nike youth soccer/volleyball rows. Specific fixes (unchanged from August where still unshipped, plus new):

1. **Suppress raw category tokens in UI and meta** (`Camp_sports`, `Baseball_softball`, bare `Other`). `sportLabel()` still does not split underscores; meta description still interpolates `sportPretty` raw.
2. **Restore an honest verification stamp** or stop implying one — currently 0/54 verified.
3. **About floor:** 67% of live pages are under 40 words (many empty). EVG club rows need a real program paragraph or should not stay public.
4. **Ages required** for public eligibility — 24/54 missing.
5. **Evergreen / placeholder policy:** decide whether P1-stamped windows should stay approved-but-hidden (current), get real session dates, or leave approved only when a real window exists. Right now 63 approved+future rows are intentionally de-indexed from the sitemap — a silent quality/date compromise, not a Dex action.

---

## 7. Proposed publish differentiation threshold

Evidence from this sample (n=54 public-eligible):

- Median **20**, mean **23.2**, max **50**.
- Adult-only pages score 20–40 and would **clear** any differentiation-only threshold — eligibility must stay a separate gate.
- Only **1** page clears 45; **11** clear 40 (including 3 adult-only).

**Proposal for Jeff (unchanged structure, updated evidence):**

| Track | Proposed floor | Rationale |
|---|---|---|
| Commercial / branded (Nike, i9, paid club) | **≥40** differentiation, **after** hard disqualifiers | Aligns with the small keep set this month; 40 is the first band where cross-list or gear + complete record show up together without adult contamination if eligibility is enforced first |
| Community / nonprofit / volunteer | no differentiation floor; eligibility + non-fragment title only | Pro Football Camp is the proof case; Camp Fire-style thin nonprofit still needs a usable About, but a high commercial bar would erase them |

Sep's commercial ≥45 idea would keep **only one** page in this population (Pro Football at 50). That is too aggressive for a 54-page directory still recovering from evergreen hiding — **≥40** is the evidence-backed commercial floor this month. Jeff sets the number.

**Order of operations (still):** (1) finish adult-only / fragment-title eligibility rejects, (2) decide evergreen-hidden policy, (3) set the differentiation number, (4) only then grow the public set. Do not stamp another evergreen batch into approved without real dates.

---

## 8. Open items

**Still open**

- GSC service account / Field & Forge identity (`SEO-OS-ARCHITECTURE.md` decision #1). `pull-gsc.mjs` still missing. Nora Sep 21 is 13 days stale for this run.
- GSC re-read of `sitemap-camps.xml` (Nora needs-you from Sep 21). Even more important now that live is 54, not 118 or 37.
- `PCD_AGENT_RUNS_TOKEN` still absent — cannot log Dex start/finish to `/api/agent-runs`.
- Crawl Stats never pulled (Nora thread since July).

**Changed since Sep**

- Camps sweep **producing** `past-date` rejects (450). Good.
- Live camps **118 → 54** via placeholder filter, not via another total sweep failure.
- Adult-only: 4 rejected, **5 still public**.
- Verification stamps absent on the entire public set.

### For Jeff

1. **Decision: publish threshold.** Propose commercial ≥40 (was ≥45 in Aug/Sep); community uncapped. Your number.
2. **Decision: evergreen-hidden 63.** Leave hidden, assign real dates, or reject. Dex will not write D1.
3. **Action for Ranger/admin (not Dex):** reject the five live adult tennis URLs on `not-youth-activity`; fix or pull "The camp" and "weeks are full."
4. **Unblock GSC** (service account). Highest shared Dex/Nora dependency — now past two monthly Dex cycles blind except for Nora's Sep 21 file.

---

## Run notes

- Machine: DESKTOP only. No camps D1 writes. No sitemap/robots/canonical/noindex edits. No push, no deploy, no site source changes.
- Agent-run logging: **skipped** — `PCD_AGENT_RUNS_TOKEN` missing (same as Nora Sep 21 / prior Dex).
- Slack posture: camps inventory drop 118→54 is material movement; adult-only still live needs Jeff/Ranger decision. Quiet one-liner also provided for parent to choose.
