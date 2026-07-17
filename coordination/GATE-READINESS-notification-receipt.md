# Gate readiness: notification_receipt

**Gate:** `notification_receipt` (see `coordination/LAUNCH-AUTHORIZATION-MATRIX.md` row 3 and `coordination/release-evidence/rc01.json` → `gates.notification_receipt`, currently `pending`).

**Verdict:** ready. `scripts/run-staging-notification-drill.mjs` and `scripts/notification-receipt.mjs` both parse cleanly (`node --check`) and `validateNotificationReceipt` runs correctly against the current pending template (`{errors: [], valid: true, received: false}`, confirmed 2026-07-17). No script edits needed. This gate is blocked purely on an external fact: the staging Slack webhook destination is not proven to reach the approved `#pcd-alerts` channel.

---

## Why this gate is open (read this first)

Three prior evidence files already establish the problem precisely, so the live step does not need to rediscover it:

- `coordination/release-evidence/notification-receipt-staging-2026-07-17.json`: a synthetic staging drill ran, Resend shows the email **delivered**, but `slack_observation.configured_channel_receipt` is `"not observed in #pcd-alerts"`.
- `coordination/release-evidence/notification-channel-receipt-check-2026-07-17.json`: a read-only inspection of `#pcd-alerts` found only a channel-join event — no drill alert ever posted there. Conclusion: `"The current webhook destination must be reconciled or rotated before this gate can pass."`
- `coordination/release-evidence/staging-notification-secret-preflight-2026-07-17.json`: the staging Worker (`parent-coach-desk-staging`) does have both secret **names** present (`RESEND_API_KEY`, `SLACK_WEBHOOK_URL`) — this only proves the secret slot exists, not that its value points at the right webhook.

So: Resend/email works. Slack does not, because `SLACK_WEBHOOK_URL` on staging is pointed at something other than a webhook that posts into `#pcd-alerts` (`C0BJT2194E4` per `automation/SLACK-STAGING.md`).

## Step 1 — Create a fresh staging-only Slack incoming webhook

1. In the Field & Forge Slack workspace, create a **new** Incoming Webhook scoped to `#pcd-alerts` only (do not reuse the old one — the whole point is to stop trusting an unproven destination).
2. Do not paste the webhook URL into chat, a commit, a release-evidence JSON, or anywhere in this repo. `notification-receipt.mjs`'s validator enforces `contains_secret_material !== false` as an error for exactly this reason — the evidence schema has no field for it, and none should be added.
3. Store it as the Cloudflare Worker secret `SLACK_WEBHOOK_URL` on the **staging** Worker (`parent-coach-desk-staging`) only. This is a `wrangler secret put` action against staging — out of scope for this session (no wrangler here), Jeff/Codex runs it directly.
4. Once set, say "staging Slack ready" per the matrix — that phrase is the recorded approval to proceed to Step 2.

## Step 2 — Run the one already-approved synthetic drill

```
npm run drill:staging-notification
```

This runs `node scripts/run-staging-notification-drill.mjs --confirm`, which:

- Refuses to run without `--confirm` (`confirmed=false` throws) — this is a deliberate guard against accidental live sends, keep it.
- Builds a synthetic camp submission (`sport: 'administrative test'`, description explicitly states "This is not a real camp or customer submission", dates in 2030) with a fresh `idempotency_key` prefixed `pcd-notification-drill-` (also enforced — a key without that prefix throws).
- POSTs it to the **fixed, hardcoded staging origin** `https://parent-coach-desk-staging.eepskalla.workers.dev/api/camps/submit` — never production. This is intentional per the file's own comment: it exercises the ordinary public-submission notification path rather than adding a dedicated send-email test endpoint.
- Throws unless the response is `ok` and `body.status === 'pending'`.
- Prints a JSON receipt: `schema_version, environment: 'staging', target_origin, event_class: 'synthetic_camp_submission_notification_drill', idempotency_key, submitted_at, camp_id, camp_slug, notification_expectation`.

Save that printed JSON — the `idempotency_key` and `camp_slug` are what tie the drill to the provider/channel receipts you look for next.

**Do not run this command in this session.** It performs a real POST to a live (staging) endpoint, which is out of scope here.

## Step 3 — Capture the three matching receipts for the same drill ID

All three must correspond to the **same** `idempotency_key`/drill run from Step 2:

1. **Resend provider delivery.** Check the Resend dashboard for a delivered event tied to this drill's timestamp/recipient. This is the same check that already passed once (`notification-receipt-staging-2026-07-17.json` shows `resend: delivered`) — confirm it holds for the fresh drill too.
2. **Visible `#pcd-alerts` channel receipt.** Read-only check of the channel (same method as `notification-channel-receipt-check-2026-07-17.json`) — this time it must show the actual drill alert post, not just a join event. This is the fact that was missing before and is the reason for Step 1.
3. **Jeff Thomas acknowledgement.** A human confirmation that he saw the post, tied to the same drill ID — `notification-receipt.mjs` hard-requires `approved_by === 'Jeff Thomas'` when `state: 'received'`, no other value passes.

## What each script emits and what gets checked

- `scripts/run-staging-notification-drill.mjs` emits the drill submission receipt (Step 2's JSON output) — this is the "did staging accept the synthetic submission" evidence, not the notification receipt itself.
- `scripts/notification-receipt.mjs` exports `validateNotificationReceipt(value)` only — there is no CLI wrapper (`check-notification-receipt.mjs` does not exist, and there is no `check:notification-receipt` npm script). It is invoked directly from `tests/failure-isolation-evidence.test.ts` and should be invoked ad hoc against the final filled-in receipt file, e.g.:
  ```
  node -e "import('./scripts/notification-receipt.mjs').then(({validateNotificationReceipt}) => console.log(JSON.stringify(validateNotificationReceipt(JSON.parse(require('fs').readFileSync('coordination/release-evidence/notification-receipt-pending.json','utf8'))))))"
  ```
- `validateNotificationReceipt` requires, when `state: 'received'`: `sent_at`, `received_at`, `recipient_role`, `provider_event_id`, `acknowledgement_reference` all present; `received_at` not before `sent_at`; `approved_by === 'Jeff Thomas'`. It always requires `contains_requester_content === false` and `contains_secret_material === false` regardless of state — the synthetic drill's payload already satisfies both (no real requester data, no secrets).

## How results replace the template

Overwrite `coordination/release-evidence/notification-receipt-pending.json` in place (path referenced by both `rc01.json`'s `notification_receipt` gate and `tests/failure-isolation-evidence.test.ts`):

- `state`: `"pending"` → `"received"`
- `sent_at`: drill submission time (Step 2)
- `received_at`: time the Slack post / email was confirmed visible (Step 3), must be ≥ `sent_at`
- `recipient_role`: the role that received it (e.g. `"first approved staging administrator"`, matching the phrasing already used in `notification-receipt-staging-2026-07-17.json`)
- `provider_event_id`: the Resend event ID
- `acknowledgement_reference`: something that ties to Jeff's actual acknowledgement (message link, timestamp, etc. — not a claim, a reference)
- `approved_by`: `"Jeff Thomas"` exactly
- Leave `channel_class`, `event_class`, `created_at`, `contains_requester_content: false`, `contains_secret_material: false` as-is; update `external_changes` to note the staging submission and email/Slack sends that occurred

## Absolute rule

Staging only. `run-staging-notification-drill.mjs`'s target origin is hardcoded to the staging Worker URL and cannot be pointed at production without editing the script — do not edit it to do so. No secret value (webhook URL, API key) goes in chat, git, or any release-evidence file at any point in this process.
