# CRM Operational Readiness Gap Report

**Date:** 2026-09-16 (PT)  
**For:** Jeff Thomas  
**Author:** Grok Bot executor (read-only intent)  
**Status:** Partial — Windows machine evidence not reachable from this executor; gaps below combine the R15 dispatch brief with PCD box-side notes. Items marked **[UNVERIFIED vs branch evidence]** need parent re-run with `machineId=144864c6-daca-470e-8aa3-74cbb5f57453` Shell/Read (or CopyFromBox of the cited paths).

**Access note (this run):**  
- Shell/Read with `machineId` is not in this executor’s tool schema; passed `machineId` was ignored and commands stayed on the Linux box.  
- `ListMachines` / `CopyFromBox` / `CopyToBox` not available here.  
- `wrangler` / Cloudflare: not authenticated on the user machine (per brief); no live readback attempted.  
- No production deploy, D1 mutation, email send, or flag change performed.

**Intended evidence roots (unreachable this run):**  
1. PCD CRM branch: `C:\Users\jeffthomas\Desktop\Claude Cowork\Outputs\Field and Forge\parent-coach-desk` @ `codex/crm-p17b-r15-throughput` tip `ccdb77a1` — evidence under `coordination/release-evidence/plat-009-p17-b-r15-*`  
2. CRM receiver: `C:\Users\jeffthomas\Desktop\Claude Cowork\Outputs\Field and Forge\Field and Forge Ventures\organization-crm` (monorepo `jeffthomas4-lab/field-forge-ventures`; local main ~177 commits ahead of origin)

---

## Current state

| Area | State (2026-09-16 PT) | Source |
|------|------------------------|--------|
| Frozen org backfill | **Incomplete** — ~99,669 / 198,287 orgs delivered; ~98,618 pending at R15 snapshot | R15 production-execution brief |
| Historical contacts | **141 terminally rejected** — pending human source-evidence review | R15 brief |
| Contact-review legacy-hash repair | Commit `bb644ce` **exists in lineage but was NOT deployed by R15** | R15 brief |
| CRM product usability | **Owner-only conditional beta** for orgs that already arrived | R15 brief |
| PCD live content Worker | CRM **intentionally removed** from live content Worker on PCD `main` (`bc61480`); keep CRM off that deploy lane | Brief + PCD operating constraint |
| Mandatory rollback pins | PCD R13 `43244bc7-9300-4a9d-a9a6-e2da43aba6af`; CRM receiver `d969492c-5b4c-4811-895d-80706836b1d5` | R15 brief |
| CRM producer branch | Active: `codex/crm-p17b-r15-throughput` @ `ccdb77a1` (not `main`) | Brief |
| Cloudflare live readback | **Blocked** — wrangler not authenticated on machine | Brief |
| Exact open acceptance criteria from R15 + a3 drift-recovery docs | **[UNVERIFIED]** — `git show` / evidence files not readable this run | Access gap |
| Diff CRM paths vs PCD `main` | **[UNVERIFIED]** — file list not produced this run | Access gap |
| Branch `codex/crm-contact-review-legacy-hash` | **[UNVERIFIED]** — existence / file list / log summary not confirmed this run | Access gap |
| “Fully operational” product definition from `PLAT-009-PRODUCTION-BETA-READINESS` | **[UNVERIFIED]** — doc not read this run; working definition below is inferred from brief + typical PLAT-009 scope | Access gap |

### Working definition of “fully operational” (product terms)

Pending confirmation against `organization-crm` docs (`PLAT-009-PRODUCTION-BETA-READINESS` + latest evidence), “fully operational” for owner-conditional beta means all of:

1. **UI** — Owner can browse/search arrived orgs and contacts without silent failures; beta gates remain owner-only.  
2. **Adapter** — PCD → CRM receiver path healthy for new + resumed deliveries; no drift requiring a3-class recovery.  
3. **Backfill** — Frozen run completes (or an approved truncated scope) with reconciled counts vs 198,287.  
4. **Contact review** — Terminal rejects triaged; legacy-hash repair (`bb644ce` / contact-review branch) deployed only after Jeff approval; no contact email without approval.  
5. **DNC** — Do-not-contact enforcement verified on write/send paths before any outbound.  

---

## Open gaps (ordered by blocking “fully operational”)

1. **Frozen backfill incomplete (~50% pending)** — ~98,618 orgs still pending; CRM cannot be “full population” operational until resume/complete under approved runbook. **Blocks:** backfill completeness.  
2. **No live Cloudflare/wrangler readback** — cannot confirm receiver version, D1 health, or feature flags vs mandatory rollback pins without auth + Jeff-approved read-only checks. **Blocks:** production confidence / go-no-go.  
3. **Contact-review legacy-hash repair undeployed (`bb644ce`)** — R15 did not ship it; contact-review correctness for legacy hashes remains open. **Blocks:** contact review lane. **[Confirm branch `codex/crm-contact-review-legacy-hash` on machine.]**  
4. **141 terminal contact rejects awaiting human source-evidence review** — queue is human-gated; not clearable by automation alone. **Blocks:** contact completeness / review SLA.  
5. **Exact open acceptance criteria from R15 + a3 drift-recovery evidence not extracted** — cannot close or re-open AC without reading `coordination/release-evidence/plat-009-p17-b-r15-*` on CRM branch. **Blocks:** formal acceptance sign-off. **[UNVERIFIED]**  
6. **CRM still must stay off PCD live content Worker deploy lane** — `main` @ `bc61480` correctly CRM-stripped; any merge/deploy that reintroduces CRM into content Worker is a regression risk. **Blocks:** safe producer shipping.  
7. **CRM receiver local main ~177 commits ahead of origin** — publish/PR/sync strategy uncleared; increases drift risk vs deployed receiver `d969492c-…`. **Blocks:** durable receiver ops. **[UNVERIFIED detail]**  
8. **a3 drift-recovery posture uncleared from evidence** — whether adapter drift is closed or still an open AC is unknown without evidence read. **[UNVERIFIED]**  
9. **DNC + outbound email policy** — no production contact email without Jeff approval; DNC proof not verified this run. **Blocks:** any outbound.  
10. **Executor/tooling gap for local evidence** — this run could not `git show` / diff / branch-check on the Windows checkouts. **Blocks:** evidence-cited closure of items 5–8.**

---

## Recommended sequence (no unauthorized prod actions)

1. **Parent/agent with Windows `machineId`:** On PCD CRM branch tip `ccdb77a1`, `git show` / read `coordination/release-evidence/plat-009-p17-b-r15-*` (production-execution + a3 drift-recovery); list **exact open ACs**.  
2. **Same machine:** Read `organization-crm` `PLAT-009-PRODUCTION-BETA-READINESS` (+ latest evidence); replace the working “fully operational” definition above with doc-cited bullets (UI, adapter, backfill, contact review, DNC).  
3. **Same machine:** Diff `codex/crm-p17b-r15-throughput` vs PCD `main` for **CRM-related paths only**; archive file list into this report.  
4. **Same machine:** Check `codex/crm-contact-review-legacy-hash` (exists?, log summary, file list vs `bb644ce`).  
5. **Local-only (no prod):** Continue CRM UI/adapter/tests on branches; keep CRM out of PCD content Worker PRs to `main`.  
6. **Jeff approval gate:** Authenticate wrangler for **read-only** status (versions vs rollback pins, queue depths) — no deploy.  
7. **Jeff approval gate:** Resume frozen backfill to clear ~98,618 pending (or approve scoped partial).  
8. **Jeff approval gate:** Deploy contact-review legacy-hash repair only after review of `bb644ce` / contact-review branch.  
9. **Human:** Source-evidence review of 141 terminal rejects.  
10. **Jeff approval gate:** Any DNC verification that touches prod data; **never** send contact email without explicit Jeff approval.  
11. **Hold:** No PCD content Worker deploy that includes CRM; no D1 mutate; no production flag flips without Jeff.

---

## Exact approvals Jeff must give before each prod step

| Step | Approval required | Notes |
|------|-------------------|--------|
| Wrangler / Cloudflare login for live readback | Jeff | Read-only preferred first |
| Resume / continue frozen org delivery | Jeff | Affects prod CRM population |
| Deploy CRM receiver (any version ≠ current pin) | Jeff | Compare to rollback `d969492c-5b4c-4811-895d-80706836b1d5` |
| Deploy PCD CRM producer bits (non–content-Worker lane only) | Jeff | **Never** via live PCD content Worker lane |
| Deploy contact-review legacy-hash repair (`bb644ce` / contact-review branch) | Jeff | Explicitly skipped by R15 |
| D1 migrations or schema/data repairs | Jeff | Dispatch forbade D1 mutate without approval |
| Production feature-flag changes | Jeff | Dispatch forbade flag changes |
| Any contact / org email send | Jeff | Hard gate |
| Rollback to PCD R13 `43244bc7-9300-4a9d-a9a6-e2da43aba6af` or CRM `d969492c-…` | Jeff | Mandatory pins if abort |

---

## Local code work that can proceed without prod access

- Extract and paste open ACs from R15 + a3 evidence into this file (Windows git read-only).  
- Produce CRM-path-only diff file list: `codex/crm-p17b-r15-throughput` vs `main`.  
- Confirm/document `codex/crm-contact-review-legacy-hash` (log + files) without deploying.  
- Align `organization-crm` docs vs UI for owner-only beta (docs/tests only).  
- Keep CRM changes off PCD `main` content Worker; branch hygiene on `codex/crm-p17b-r15-throughput`.  
- Draft human review checklist for the 141 terminal rejects (no email).  
- Plan receiver sync for local main (~177 ahead of origin) as a PR narrative — no push/deploy without Jeff.  
- Unit/integration tests for adapter + contact-review hash repair on local branches.  
- Update this report once machine evidence is attached.

---

## Top 5 blockers (summary)

1. Frozen backfill ~98,618 orgs still pending (~50% of 198,287).  
2. No Cloudflare/wrangler live readback (unauthenticated) — cannot verify pins/health.  
3. Contact-review legacy-hash repair `bb644ce` not deployed by R15.  
4. 141 terminal contact rejects blocked on human source-evidence review.  
5. R15 / a3 open acceptance criteria not yet evidence-extracted (Windows paths unreachable this executor).

---

## Appendix — parent re-dispatch checklist

```text
machineId: 144864c6-daca-470e-8aa3-74cbb5f57453
READ-ONLY:
- git -C "<pcd>" fetch? NO if network write; use local only
- git -C "<pcd>" show ccdb77a1:<evidence paths>
- ls "<pcd>/coordination/release-evidence/plat-009-p17-b-r15-*"
- git -C "<pcd>" diff --name-only main...codex/crm-p17b-r15-throughput -- <crm paths>
- git -C "<pcd>" branch -a | findstr contact-review
- git -C "<pcd>" log --oneline codex/crm-contact-review-legacy-hash -15
- Read organization-crm PLAT-009-PRODUCTION-BETA-READINESS
WRITE:
- Refresh this markdown on Windows coordination path + CopyToBox /workspace
FORBIDDEN: deploy, D1 mutate, email, prod flags
```

**Report paths:**  
- Box: `/workspace/CRM-OPS-GAP-2026-09-16.md` (written this run)  
- Windows target (not written — no machine write): `C:\Users\jeffthomas\Desktop\Claude Cowork\Outputs\Field and Forge\parent-coach-desk\coordination\CRM-OPS-GAP-2026-09-16.md`

---

## Evidence addendum (parent, 2026-09-16 PT) — verified on Windows

### Open acceptance criteria (from R15 production execution)

Frozen run is **not complete** until all of:
1. All 198,287 organizations have terminal, exactly reconciled receiver receipts
2. pending / retry / leased / dead / exhausted counts are zero
3. Both reconciliation passes complete without findings
4. 141 historical contacts remain terminally rejected until human source-evidence review (no projection, consent inference, export, or send authorized by R15)
5. Contact-review legacy-hash repair `bb644ce35e8697b20212ee4d9d7d651fefd49654` was **not** deployed by R15

Mandatory rollback pins (producer first, then receiver): PCD R13 `43244bc7-9300-4a9d-a9a6-e2da43aba6af`; CRM receiver `d969492c-5b4c-4811-895d-80706836b1d5`.

R15 snapshot (2026-09-16 ~17:10 UTC): run `scanned`; 99,669 delivered orgs; 98,618 pending; zero bad event classes; CRM org count matched deliveries; people/contacts/consent = 0.

### a3 drift-recovery gate

Status on branch doc: **AWAITING EXACT OWNER APPROVAL** (pre-R15 recovery gate). Later R15 production-execution receipt records that R15 did promote; treat a3 as historical gate text, not current live status, until Cloudflare readback confirms active versions.

### CRM path diff vs PCD `main`

89 CRM-related paths differ on `codex/crm-p17b-r15-throughput` vs `main` (evidence, adapter doc, CRM migrations, scripts, `src/lib/crm-adapter.ts`, tests). Confirms CRM is correctly absent from content-Worker `main`.

### Contact-review branch

- Branch exists: `codex/crm-contact-review-legacy-hash` (checked out locally with `+`)
- Tip includes guard: `e1d68f75 Guard ordinary PCD production deploy against CRM producer disable`
- Repair commit `bb644ce3 Repair legacy contact review proof without bulk publication` touches:
  - `src/lib/contact-review.ts`
  - `src/pages/admin/contact-review.astro`
  - `tests/contact-review.test.ts`

### Fully operational (from PLAT-009-PRODUCTION-BETA-READINESS-2026-09-12)

Status: **LIVE INTERNAL SURFACE / CONDITIONAL OWNER BETA / DATA-COMPLETE BETA IN PROGRESS**

- Owner-only Access beta at `https://crm.fieldforgeventures.com/` is in scope now for arrived orgs
- Data-complete beta still HOLD until frozen import + contact dispositions + delivery drain + two reconciliations close
- Communication / send remains OUT OF SCOPE (does not block internal CRM beta)

### Next concrete step

Authenticate Cloudflare/wrangler for **read-only** live status of the frozen run and active Worker versions vs rollback pins. No deploy until Jeff explicitly approves resume.
