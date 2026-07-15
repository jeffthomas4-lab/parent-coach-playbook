# Worker Platform Lane — 2026-07-15

**Scope:** audit items P1.7 (approve-to-publish), P1.8 / Open Item 3 (`agent_runs` logging and failure alerting), P2.11 (transactional email), P2.14 (verify the Access JWT signature), plus tests for every route touched.

**Governed by:** `PCD-AUTOMATION-AUDIT-2026-07-14.md`, `About Me/Website-Build-Standard.md`, the Pre-Launch Security Gate, and the constitution's HUMAN GATE and CANARY rules.

**Result:** four builds landed. 222 tests pass across 27 files, 95 of them new. Nothing in this lane publishes, sends, or spends without a human action, and the report names every switch that would change that.

---

## 1. Approve-to-publish (P1.7)

**The problem.** `pcd-rules-watcher` drafts posts as `draft: true`. Nothing flipped them. Drafts piled up and the site never saw them.

**What was there already.** `POST /api/admin/editorial/approve` writes markdown to GitHub. It sets `editorial.status` to `jeff-approved`. It does not touch `draft:` and it does not deploy. That route was extended, not replaced: its frontmatter logic was the model for the new one and it still owns the editorial sign-off.

**What was built.**

- `src/lib/publish.ts` — `flipDraftFrontmatter()` flips `draft: true` to `draft: false` and stamps the editorial block; `publishDraft()` reads the file, flips it, commits to `main` with the read sha for optimistic concurrency, and fires the deploy hook; `buildApprovalBlocks()` builds the Slack message with the button.
- `src/pages/api/admin/editorial/publish.ts` — the admin-UI publish. Cloudflare Access identity, admin allowlist, same-origin.
- `src/pages/api/slack/actions.ts` — the Slack interactivity endpoint. Where the click lands.

**The loop.** Ed posts a draft notice to Slack with a Publish button → Jeff clicks → `/api/slack/actions` verifies it → `publishDraft()` flips, commits, deploys → the outcome posts back to the thread.

**Why approve and publish stayed two routes.** Signing off on a draft and putting it in front of parents are different decisions. They take different clicks.

**Four things must all hold before anything publishes through Slack:** a valid Slack v0 signature over the raw body; a timestamp inside the 5-minute replay window; a clicker whose Slack user ID is on `SLACK_APPROVER_IDS`; a well-formed collection and slug on an allowlist. A signature only proves Slack sent it — anyone in the channel can press a button, so the approver allowlist is what makes it Jeff's click and not the room's.

**Approval posture:** Class C. The change set is fully built and one yes ships it. There is no unattended caller of `publishDraft()` and no env var that skips the click.

**Notes.** A double-clicked button is a 409, not a second commit. `editorial` stamps use only fields that exist in `src/content.config.ts` — invented keys get stripped by the zod schema at build and the audit trail with them. Slack's 3-second ack is handled with `waitUntil` where the runtime offers it, falling back to inline work.

---

## 2. agent_runs logging and failure alerting (P1.8 / Open Item 3)

**Why nothing was writing.** Not a bug in the table. `agent_runs` and `agent_registry` are fine in the `forge-command` D1. The PCD scheduled tasks are Claude tasks: no D1 binding, no endpoint to write through. Nothing was ever wired to the table, so nothing wrote to it. Session 0 built the substrate and said so plainly ("No rows were written to either table"). The wire was the missing half.

**What was built.**

- `src/lib/agent-runs.ts` — `startRun`, `finishRun` (both idempotent on `run_id`), `touchRegistry`, `countRecentFailures`, `pauseAgent`, `applyCanary`, `alertRun`.
- `src/pages/api/agent-runs.ts` — `POST /api/agent-runs`, bearer-token auth with a constant-time compare, full server-side validation, bound D1 parameters everywhere.
- `src/lib/slack.ts` — `postToSlack` and `verifySlackSignature`.

**The contract** is documented in `automation/RUN-LOG.md`: `{phase:"start"|"finish", run_id, agent, venture, status, summary, needs_you, needs_you_items, outputs, error}`.

**Failure alerting.** A `failed` finish posts the real error to Slack. A `needs_you` run posts whatever its status. A successful run posts nothing. A Slack outage never fails the D1 write — the row is committed before the alert is attempted.

**CANARY.** Two failures for one agent inside 24 hours sets `agent_registry.status = 'paused'` and says so in the alert. Threshold and window match Forge Command's orchestrator (`CANARY_THRESHOLD = 2`, `ERR_WINDOW_MS = 24h`).

**Approval posture:** Class A. It changes no live content, sends nothing to a person, spends nothing.

**Still owed, and not this lane's to pay:** Friday Letter, seasonal, and freshness have no logging and no Slack contract at all. The endpoint is built and documented; those skill files have to start calling it. That is the agent-roster lane.

---

## 3. Transactional email (P2.11)

**Starting point:** zero email code existed anywhere in PCD. A parent submitted a camp and heard nothing back, ever.

**What was built.**

- `src/lib/email.ts` — `sendEmail()` (the primitive), `sendSubmissionConfirmation()`, `sendAdminAlert()`. Provider is Resend over one HTTPS call: no SDK, no new dependency in the Worker bundle, the key is a Worker secret and this module is only ever imported server-side.
- `src/pages/api/camps/submit.ts` — wired to both paths. The row is written first; nothing in the mail block can throw a good submission into an error for the parent.
- `src/lib/camps-db.ts` — `countRecentSubmissionsByEmail()`, for the rate limit.

**The gate.** Both paths ship in **stage** mode. The message is fully rendered, posted to Slack with the recipient masked, and not sent. Nothing reaches an inbox.

**The flip, exactly.**

| Flag | Default | Set to `send` and | Requires |
|---|---|---|---|
| `EMAIL_MODE` | `stage` | parent- and operator-facing mail goes out on its own | `RESEND_API_KEY`, `EMAIL_FROM` |
| `EMAIL_ADMIN_MODE` | `stage` | admin alerts to an `ADMIN_EMAILS` address go out on its own | same |

They are independent. Admin alerts can go live while parent-facing mail stays staged, which is the order they should go live in. Neither flip is this lane's to make. If a mode says `send` but the provider is not configured, it stages instead of failing.

**Guards.** An `internal` message may only address an allowlisted admin address, or it is suppressed. Confirmations are capped at 5 per submitter per hour, since the submit endpoint is public and outbound mail costs money and sending reputation (Gate item 9). Bulk imports get no confirmation. Provider error text is logged, never returned.

**Approval posture:** Class B today (Jeff reads the staged message in Slack and sends it himself), Class C on the flip.

---

## 4. Access JWT signature verification (P2.14)

**The hole.** `admin-auth.ts` decoded the `CF_Authorization` cookie's JWT and trusted its `email` claim without checking who signed it. The in-code comment leaned on browser cookie-domain scoping. That argument covers a browser; it does not cover anything that can reach the Worker directly and set a header or a cookie value. Anything that could put a JWT-shaped string in front of the Worker could name itself an admin.

**The fix.**

- `src/lib/access-jwt.ts` — `verifyAccessJwt()`: fetches the Access team's published keys, verifies the RS256 signature, then checks alg, kid, iss, aud, nbf, exp. Pins `alg` to RS256 (accepting the token's own claim is how alg-confusion and `alg:none` work). Keys cached in module scope for an hour. Fails closed: unreachable keys, unknown kid, or anything off is a refusal, with the reason going to the log and never to the response.
- `src/lib/admin-auth.ts` — `requireAdmin` is now **async** and has two modes.

| Mode | Trigger | Behavior |
|---|---|---|
| VERIFIED | `ACCESS_TEAM_DOMAIN` and `ACCESS_AUD` both set | Email is read only from a signature-verified JWT. A spoofed `Cf-Access-Authenticated-User-Email` header gets nothing. |
| LEGACY | either unset | The old unverified behavior, with a warning logged on every request. |

**Why LEGACY still exists.** So an unconfigured deploy does not lock the admin out on the way to setting the two vars. It is not a design, it is a ramp. **Setting the two vars is the P0 item in the handoff below.** Once production has run verified for a week, delete the branch.

**Blast radius.** `requireAdmin` went async, so all 22 call sites now `await` it: 12 API routes and 10 admin `.astro` pages. Astro frontmatter supports top-level await, so the pages needed nothing but the keyword. The allowlist is enforced identically in both modes.

---

## 5. Tests

`npx vitest run` — **222 passed, 27 files, 0 failures.** 95 tests are new.

| File | Tests | Covers |
|---|---|---|
| `tests/api/access-jwt.test.ts` | 15 | Forged signature, `alg:none`, edited payload, unknown kid, expired, not-yet-valid, wrong aud, wrong iss, no email claim, unreachable certs, cache, domain normalization |
| `tests/api/admin-auth.test.ts` | 21 | Both modes. Spoofed header refused under VERIFIED; valid signature for a non-allowlisted email still 403 |
| `tests/api/publish-lib.test.ts` | 22 | Frontmatter flip, body untouched, already-published no-op, traversal slugs, sha concurrency, no deploy hook on a failed commit, no GitHub error text leaked |
| `tests/api/agent-runs.test.ts` | 17 | Token auth, bound parameters, start/finish, idempotency, first failure alerts, CANARY pause on the second, Slack outage does not fail the write, no D1 error text leaked |
| `tests/api/email.test.ts` | 17 | **The gate** (nothing sends with the flags unset), the flip, independent switches, allowlist suppression, masked recipient, no provider key leaked |
| `tests/api/slack-lib.test.ts` | 11 | Tampered body, wrong secret, replay window, missing headers, version pinning |
| `tests/api/slack-actions.test.ts` | 13 | Eight refusal cases against one happy path |
| `tests/api/admin-editorial-publish.test.ts` | 9 | Auth, allowlist, cross-origin, happy path, 409, 404, unconfigured token |

The crypto tests sign real tokens with a real key pair (`tests/helpers/access-token.ts`). A signature test that mocks the signature check proves nothing.

**Typecheck:** `npx tsc --noEmit` reports **zero errors in this lane**. The one error in the tree is `worker-cron/src/index.ts(48,12)` — another lane's file, another lane's call.

---

## 6. Approval posture, all together

| Path | Class | Gate |
|---|---|---|
| `POST /api/agent-runs` | A | Machine token. Changes no live content, sends nothing, spends nothing |
| `POST /api/admin/editorial/approve` | C | Access-authenticated click. Sign-off only — does not publish |
| `POST /api/admin/editorial/publish` | C | Access-authenticated click |
| `POST /api/slack/actions` | C | Signature-verified Slack click from an ID on `SLACK_APPROVER_IDS` |
| Submitter confirmation | B → C | Staged to Slack. `EMAIL_MODE=send` flips it |
| Admin alert | B → C | Staged to Slack. `EMAIL_ADMIN_MODE=send` flips it |

Nothing here removes a button. No env var publishes without a click.

---

## HANDOFF

### Needs Jeff — P0

1. **Set `ACCESS_TEAM_DOMAIN` and `ACCESS_AUD`.** Until both are set, admin auth runs the old unverified path. This is the actual close on the auth hole; the code is only the means.
   - `ACCESS_TEAM_DOMAIN`: the Access team domain, e.g. `jeffthomas.cloudflareaccess.com`. Zero Trust → Settings → Custom Pages, or the team name in the dashboard URL.
   - `ACCESS_AUD`: Zero Trust → Access → Applications → the parentcoachdesk app → Overview → **Application Audience (AUD) Tag**.
   - Both are non-secret; they belong in `wrangler.jsonc` `vars`. **Reported, not edited — that file is another lane's.**
   - Verify after deploy: `npx wrangler tail` on an admin page load should show no `[admin-auth] ... not set` warning.

2. **Binding request for the wrangler lane: `FORGE_DB`** → database `forge-command`, id `747cf988-a557-48bd-9d03-bea09e184f94`. Without it `/api/agent-runs` returns 500 and Open Item 3 stays open.

### Secrets to set (`npx wrangler secret put <NAME>`)

| Secret | For | Without it |
|---|---|---|
| `AGENT_RUNS_TOKEN` | the scheduled tasks' auth to the run log | route refuses everything with 503 |
| `SLACK_WEBHOOK_URL` | all staging and alerting | messages are logged and dropped |
| `SLACK_SIGNING_SECRET` | verifying the button click | `/api/slack/actions` refuses everything |
| `SLACK_APPROVER_IDS` | who may press Publish (comma-separated Slack user IDs) | nothing publishes from Slack |
| `DEPLOY_HOOK_URL` | firing the build after a publish | commit lands, no build starts (reported, not silent) |
| `GITHUB_TOKEN` | already required by the approve route | publish returns 500 |
| `RESEND_API_KEY`, `EMAIL_FROM` | only if email is ever flipped to `send` | mail stages instead |

`SLACK_APPROVER_IDS` is not a secret in the cryptographic sense; it is a secret in the "do not put the list of who can publish in a public repo" sense.

### Slack app config

1. Create or reuse a Slack app for the PCD workspace.
2. **Incoming Webhooks** → on → add to the PCD channel → that URL is `SLACK_WEBHOOK_URL`.
3. **Interactivity & Shortcuts** → on → Request URL `https://parentcoachdesk.com/api/slack/actions`.
4. **Basic Information** → Signing Secret → that is `SLACK_SIGNING_SECRET`.
5. Jeff's Slack member ID (profile → More → Copy member ID) → `SLACK_APPROVER_IDS`.
6. `automation/SLACK-STAGING.md` still carries the open item "the actual channel is not wired yet. Confirm the exact PCD Slack channel with Jeff." That is step 2 and it is still open.

### Notes for the orchestrator

- **Do not skip the `FORGE_DB` binding.** Every other piece of the run log is built and tested; the binding is the last inch.
- `requireAdmin` is async now. Any lane adding an admin route must `await` it.
- The sandbox's `node_modules` was missing the Linux rolldown binding, so `@rolldown/binding-linux-x64-gnu@1.1.5` was unpacked into `node_modules/@rolldown/` to run vitest. It is platform-scoped and untracked; it does not affect the Windows build. Ignore it or delete it.
- A concurrent lane's `worker-cron/src/index.ts` has a syntax error at line 48 as of this writing. Not this lane's, but it will fail a typecheck at ship time if it is still there.
