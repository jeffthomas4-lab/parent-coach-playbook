<!-- Prepared by Claude (orchestrator) via Sonnet subagent, 2026-07-18.
     Read-only analysis of the intact staged repo. NOT committed (cloud shell truncates device reads/writes; commit is a Windows-host step). -->

# Parent Coach Desk — consolidated owner action package (2026-07-18)

**Purpose:** collapse every remaining externally-gated item into the fewest possible owner touches, so Jeff's involvement is one batched pass, not eleven interruptions.

**Headline (from the completion audit):** *"The bounded local overnight build is complete and verified. The entire 24-month business plan is not complete... Those items cannot honestly be converted into code-complete claims."* Everything below is **owner/external-gated** or **runtime-pending**, not unbuilt local features.

**Freshness caveat:** `rc01.json` carries a `superseded_note` — it describes the prior Plan 015 candidate and must be re-cut with a fresh full-suite run once the current worktree (161 files / 809 tests) is committed. The 11 pass / 1 n/a / 7 pending tally is correct for every owner-gated row; the packet itself needs a refresh pass.

---

## 1. One-sitting checklist for Jeff

None of these require pasting a secret value into chat or any repo file. Every credential action happens in GitHub's / Cloudflare's / Slack's / AWS's own secret UI — Claude only ever needs a **name, scope, or confirmation phrase**, never a value.

### Group A — release-pipeline prerequisites (do these first, one pass)

- [ ] **Confirm/create the GitHub protected `production` Environment** — restrict to `main`, enable required reviewers, disable admin bypass. Runbook says the workflow "fails closed" without it. *No secret in chat.*
- [ ] **Set `DEPLOY_GATE_CONFIGURED=true`** on `production` — only after the branch restriction + reviewer policy are actually verified. It's the literal marker the workflow checks. *Plain variable, not a secret.*
- [ ] **Create + place the replacement least-privilege Cloudflare production token** — scope `Workers Scripts:Edit` only, one account, no DNS/Pages/D1-data/R2-object/Access/account-admin. Store as `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` in the `production` Environment, never repo-wide. Tell Claude only the name+scope; paste the value into GitHub.
- [ ] **Create a separate staging-only Cloudflare token** (same scoping) in the `staging` Environment. Dual-target deploy needs both credentialed.
- [ ] **Revoke the burned/duplicated `OPENAI_API_KEY`** in the OpenAI dashboard (named debt: "burned and unrotated"). Dashboard action; no value needed in chat.

### Group B — evidence-producing approvals (each a distinct session)

- [ ] **Do the authenticated Access probe yourself** — sign in via Cloudflare Access as an allowed identity (`eepskalla@gmail.com` / `jeffthomas4@gmail.com`), GET/HEAD every route in `protected-route-contract.json`, repeat as a denied identity, then say "Access probe ready." This is the one gate no agent can substitute (requires your login). Cookies/tokens are never retained.
- [ ] **Create a fresh staging-only Slack Incoming Webhook** for `#pcd-alerts`; store as the `SLACK_WEBHOOK_URL` staging secret via `wrangler secret put` (run directly, not via chat), then say "staging Slack ready." Current webhook doesn't reach `#pcd-alerts`.
- [ ] **Pick the offsite backup provider + approve retention** — recommended: separate AWS recovery account, S3 Versioning + Object Lock (Compliance), 90 daily + 12 monthly. Create account/bucket/IAM role. Local export/restore is proven; no independent offsite copy exists yet.
- [ ] **Approve a controlled Kit newsletter test** with a dedicated non-customer address; later acknowledge the redacted receipt. No provider secret or PII enters chat/Git.
- [ ] **Name an accessibility reviewer (or self-perform)** using `mobile-web-contract.json` — screen reader, 200% zoom, safe-area/keyboard, constrained network, error/retry. Automated attempts were blocked by sandboxed-browser egress.
- [ ] **Obtain counsel/policy-owner disposition** on the 19-risk worksheet (`COUNSEL-DISPOSITION-2026-07-17-DRAFT.md`), accepting/closing each risk — includes the 07-17 deployment-scope incident.
- [ ] **After Groups A/B close, approve the exact Plan 018 production migration** (ops D1 `b38d5f37-…`, migrations `0011`–`0022`, one synthetic proof). Matrix sequences this **last**.
- [ ] **Click "Approve" on the production GitHub Environment job** once Codex has reviewed the staging diff/evidence — the literal HUMAN GATE.

No insurance-specific sign-off surfaced in the staged docs beyond the general counsel/risk disposition.

---

## 2. Gate ledger (from `rc01.json`)

| Gate | State | Evidence still required | Producer | Depends on |
|---|---|---|---|---|
| `source_commit` | pass | — | — | — |
| `production_manifest` | pass | — | — | — |
| `tests_and_build` | pass | re-cut owed after worktree commit (`superseded_note`) | Claude, post-commit | worktree commit |
| `secret_scan` | pass | — | — | — |
| `access_policy` | pass | — | — | — |
| `anonymous_access_probes` | pass | — | — | — |
| `authenticated_access_probes` | **pending** | allowed + denied GET/HEAD over all 38 routes, evidence hash, no retained cookies | **Jeff** (login) → Claude assembles | Access attached (done) |
| `database_backup` | **pending** | independent offsite upload/retrieval/restore, 3 separate days, all DBs + R2 | **Jeff** (provider) → Claude | Jeff picks provider |
| `database_restore` | pass | — | — | — |
| `r2_recovery` | n/a | owner-accepted empty-scope | Jeff (given) | — |
| `rollback_target` | pass | — | — | — |
| `rollback_rehearsal` | pass | staging-only; production drill still owed (§6.7) | — | — |
| `customer_journeys` | **pending** | screen reader, touch, zoom, safe-area, constrained-network, full journeys | **Jeff**/reviewer | — |
| `notification_receipt` | **pending** | fresh webhook → drill → Resend + `#pcd-alerts` + Jeff ack | Jeff → Claude → Jeff | webhook |
| `failure_isolation` | **pending** | staging rehearsal of 5 scenarios + human alert receipt | Claude + Jeff | notification_receipt step 1 |
| `open_risk_decision` | **pending** | written counsel disposition of 19 risks incl. 07-17 incident | Counsel/Jeff | — |
| `deploy_approval` | pass | covers deployed Plan 015; a new deploy needs fresh approval | — | — |
| `migration_approval` | **pending** | Plan 018 scope approval + apply + synthetic proof | Jeff → Claude | backup + notification + failure_isolation + counsel |
| `post_deploy_observation` | pass | covers last deploy; new deploy needs fresh observation | — | — |

**Tally: 11 pass / 1 not_applicable / 7 pending.**

---

## 3. Remaining-work dependency map (11 items)

| # | Item | Class | Blocked by |
|---|---|---|---|
| 1 | GitHub `production` Env + reviewer + replacement Cloudflare token | CREDENTIAL | Jeff only |
| 2 | Same-SHA staging deploy + rollback rehearsal | STAGING | Item 1 |
| 3 | Access evidence (allowed/denied identities) | CREDENTIAL (Jeff login) | Access attached; sequenced after 2 |
| 4 | Present staging evidence + diff to Codex | LOCAL/REVERSIBLE | Item 2 receipts |
| 5 | Deploy built production SHA, observe, verify secrets | PRODUCTION | 1,2,3,4 + explicit approval |
| 6 | Reconcile 10 scheduled-task copies (Nora canary first) | CREDENTIAL + EXTERNAL-COMM | token to external store; live access |
| 7 | Independent immutable offsite backup proof | CREDENTIAL + ELAPSED-TIME | Jeff picks provider |
| 8 | Newsletter provider consent→suppression journey | PROVIDER | Jeff approves test + address |
| 9 | Production SEO/indexing baseline → first cluster | PRODUCTION then LOCAL | Item 5 + elapsed index time |
| 10 | Rehearse next camps migration in staging | STAGING | working shell/CI; after backup model proven |
| 11 | Prepare (not post) social drafts + relationship candidates | LOCAL/REVERSIBLE | nothing — only *posting* is gated |

### Safe execution order

1. **Jeff** — GitHub Env + Cloudflare tokens (Group A) → unlocks 2, 3, 5.
2. Claude/Codex — secure agent-run token canary (Nora), redacted evidence.
3. Claude/Codex — deploy the already-reviewed cron revision; observe the next natural schedule only.
4. Claude/Codex — same-SHA staging deploy + health set + rollback drill.
5. **Jeff** — authenticated Access probe (allowed then denied).
6. Claude — assemble evidence → Codex independent review.
7. **Jeff** — review findings, approve the production job.
8. Claude/Codex — deploy built production artifact; record version/SHA/rollback/secret evidence.
9. **Jeff** — staging Slack webhook; Claude/Codex run the drill + capture receipts + Jeff ack.
10. **Jeff** — approve failure-isolation rehearsal; Claude/Codex run 5 scenarios on staging.
11. **Jeff** — pick offsite backup account; Claude/Codex run upload→retrieve→restore across 3 days.
12. **Jeff/counsel** — close the 19-risk disposition.
13. **Jeff** — accessibility/customer-journey pass.
14. **Jeff** — approve Kit test with a dedicated address; Claude/Codex execute + record.
15. **Jeff** — approve Plan 018 migration (after 9–12); Claude/Codex apply + synthetic proof.
16. Reconcile the remaining nine scheduled-task callers one at a time.
17. Post-deploy — production SEO baseline, then propose (not mass-generate) the first cluster.
18. Rehearse the next camps migration in staging (parallel once staging deploys reliably).
19. Continue preparing (never posting) social drafts + relationship candidates — ongoing, no gate.

---

## 4. Buildable-local scrub

**Verdict: little substantive pure-local work remains — but the review pass surfaced real hardening slices.** The overnight build closed ~50 vertical slices. Remaining pure-local, owner-approval-free candidates:

1. **`src/pages/admin/search-signals.astro:69`** — stale `wrangler pages dev` doc string → replace with the Worker-local dev command. Single-line, zero runtime effect.
2. **`.env` duplicated `OPENAI_API_KEY`** — collapse the duplicate/stray line (local hygiene). Revocation half is dashboard-gated. `.env` isn't committed.
3. **`About Me/Deployments.md`** (workspace root, outside the tracked repo) — build plan says it still shows `wrangler pages deploy`; not staged, so unverified.
4. **(From the review pass — the higher-value ones):** auto-rollback/alert on smoke failure (Q5); explicit S4 deletion carve-out from the seasonal freeze + tests (Q3); additive receipt-attestation + per-caller hash verifiers (Q1/Q2). All are code+test slices needing no owner approval.

**Policy-gated (NOT approval-free despite being "local"):** the duplicate `0009` migration-prefix ambiguity — `CURRENT_STATE.md` "Do not change without a separate approved plan" forbids touching `migrations/` without sign-off.

Every one of these still needs a working shell to edit, run affected checks, and commit — none is "done" until validation runs.

---

## 5. What Claude can do the moment a reliable shell exists, vs. what still waits

**Immediately, no approval:** fix `search-signals.astro:69`; build the Q3/Q5/Q1/Q2 hardening slices with tests; re-run the full suite to refresh the evidence baseline and clear the `superseded_note`; re-verify open questions (worktree provenance, `0009` status, `FORGE_DB` binding) against the current checkout; keep drafting (never posting) social + relationship material.

**Still waits on Jeff/provider/time even with a perfect shell:** any staging/production deploy (tokens/Env don't exist yet); authenticated Access probes (Jeff's login); offsite backup proof (external account + 3 calendar days); notification receipt + failure-isolation (real webhook + Jeff ack); newsletter journey (Jeff approval + test address); counsel/accessibility (human judgment); Plan 018 migration; any posting/outreach/credential rotation; production SEO baseline (needs the deploy + elapsed crawl time).
