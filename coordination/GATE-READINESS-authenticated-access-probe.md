# Gate readiness: authenticated_access_probes

**Gate:** `authenticated_access_probes` (see `coordination/LAUNCH-AUTHORIZATION-MATRIX.md` row 2 and `coordination/release-evidence/rc01.json` → `gates.authenticated_access_probes`, currently `pending`).

**Verdict:** ready. `scripts/access-evidence.mjs` and `scripts/check-access-evidence.mjs` parse and execute cleanly against the current templates (`node scripts/check-access-evidence.mjs coordination/release-evidence/access-policy-export-pending.json coordination/release-evidence/authenticated-access-probes-pending.json` → exit 0, `policy=complete, authenticated_probes=pending`). No script edits needed. The only missing piece is the live, human-driven probe data.

---

## What already exists

- **Policy side — done.** `coordination/release-evidence/access-policy-export-pending.json` is `state: "exported"` and passes `validateAccessPolicyEvidence`. It records the Cloudflare Access application (`Parent Coach Desk Production Admin`, domain `parentcoachdesk.com`, paths `/admin*` and `/api/admin*`) with one bounded allow policy covering exactly `jeffthomas4@gmail.com` and `eepskalla@gmail.com`. Nothing to do here.
- **Route contract — done.** `automation/protected-route-contract.json` lists 37 routes under `/admin*` and `/api/admin*`, each classified `access-only`, `app-auth`, or `mutation`. `scripts/access-evidence.mjs` reads this file at import time and derives `PROTECTED_ROUTE_COUNT = 37` directly from it — this is a live count, not a hardcoded number, so the runbook and the code cannot drift out of sync.
- **Anonymous baseline — done.** `scripts/probe-anonymous-admin.mjs` already ran against production and staging (`coordination/release-evidence/anonymous-access-2026-07-16.json`, `staging-anonymous-access-2026-07-17.json`): all 37 routes returned `protected: true` — every unauthenticated GET was redirected (301/302/303/307/308) to `fieldforge.cloudflareaccess.com` before reaching origin. This proves the *unauthenticated* case. It does **not** prove the *authenticated-but-not-allowlisted* (denied) case or the *authenticated-and-allowlisted* (allowed) case — those require a real Access session, which cannot be scripted here (no credentials, no live probing allowed in this environment).
- **Probe evidence — pending.** `coordination/release-evidence/authenticated-access-probes-pending.json` is the template that the live results replace in place (same filename, same path — the file is overwritten with real data, `state` moves from `pending` to `complete`).

## What the gate still needs

Two live browser sessions against `https://parentcoachdesk.com`, one per identity class, GET/HEAD only, no form submission, no mutation call — even on routes classified `control: "mutation"` in the contract. Loading a mutation-route *page* (e.g. `/admin/camps/queue.astro`) is a GET and is fine; clicking any approve/reject/verify/publish button on that page, or calling any `/api/admin/...` mutation endpoint directly, is not.

### Step 1 — Allowed identity pass

1. Jeff signs into Cloudflare Access in the in-app browser using `eepskalla@gmail.com` or `jeffthomas4@gmail.com` (either allowlisted identity).
2. For each of the 37 routes in `automation/protected-route-contract.json`, load the corresponding URL with a plain GET (page navigation). Use `scripts/probe-anonymous-admin.mjs`'s `routeSourceToPath()` logic as the source-to-path mapping (same function, same rules: strip `src/pages`, strip `.astro`/`.ts`/`.md`, `/index` → `/`, `[param]` → `probe-param`) so the authenticated path list matches the anonymous baseline exactly.
3. Record per route: `path`, `edge_authorized: true`, `mutation_invoked: false`, plus enough of the observed status/redirect chain to justify the classification (status class, whether the app-auth check inside the route itself also passed for `app-auth`/`mutation` routes, not just the edge).
4. Confirm none of the 37 loads triggered a mutation — no button clicks, no `Idempotency-Key` requests, no POST/PUT/PATCH/DELETE.

### Step 2 — Denied identity pass

1. Sign in (or attempt to sign in) with an identity that is **not** on the Access allowlist — any Google/email identity other than the two allowed addresses. If Access itself blocks the sign-in attempt before a session exists, that is itself a valid "denied" observation for every route (the identity never reaches an authorized session, so it never reaches origin).
2. For each of the same 37 routes, confirm the edge stops the request before origin — Access should either refuse the sign-in outright or, if a session exists, return the same class of redirect the anonymous probe already observed (redirect to `fieldforge.cloudflareaccess.com`), never a 200 from the app.
3. Record per route: `path`, `edge_blocked: true`, `origin_reached: false`.

## What `scripts/access-evidence.mjs` consumes and produces

`validateAuthenticatedAccessEvidence(value)` is the function that judges the probe file. It requires, when `state: "complete"`:

- `contract_route_count` === 37 (read live from `automation/protected-route-contract.json`, so if the contract ever grows or shrinks this number moves with it — recount before filling the evidence file).
- `observed_at`, `allowed_identity_class`, `denied_identity_class`, `evidence_hash` — non-empty strings. `allowed_identity_class` and `denied_identity_class` are class labels, not raw emails (e.g. `"configured_admin"` / `"authenticated_non_admin"`, matching the vocabulary already used in `tests/access-evidence.test.ts`) — do not put the actual email addresses in this file.
- `allowed_results`: array of exactly 37 items, every item `edge_authorized: true` and `mutation_invoked: false`.
- `denied_results`: array of exactly 37 items, every item `edge_blocked: true` and `origin_reached: false`.
- `tokens_retained: false`, `cookies_retained: false` at the top level — never record session cookies or Access JWTs in this file.

`evidence_hash`: compute a SHA-256 over the redacted `allowed_results`/`denied_results` arrays (e.g. `sha256(JSON.stringify({allowed_results, denied_results}))`) so the evidence file is independently checkable without re-running the probe. No script currently computes this automatically — hash it by hand with `node -e "console.log(require('crypto').createHash('sha256').update(JSON.stringify(payload)).digest('hex'))"` once the two result arrays are final.

## How results replace the template

Overwrite `coordination/release-evidence/authenticated-access-probes-pending.json` in place (same path — `rc01.json` and `check:access-evidence` both reference this exact filename, so do not rename it):

- `state`: `"pending"` → `"complete"`
- `observed_at`: ISO timestamp of the probe session
- `allowed_identity_class` / `denied_identity_class`: filled in (see above, class labels not raw emails)
- `allowed_results` / `denied_results`: the 37-item arrays from Steps 1–2
- `evidence_hash`: the computed hash
- Leave `tokens_retained: false`, `cookies_retained: false`, `probe_rules`, and `external_changes: []` as they are

## What `check-access-evidence.mjs` asserts

```
node scripts/check-access-evidence.mjs coordination/release-evidence/access-policy-export-pending.json coordination/release-evidence/authenticated-access-probes-pending.json
```

Runs both validators (`validateAccessPolicyEvidence` on the first file, `validateAuthenticatedAccessEvidence` on the second) and exits non-zero printing every error, prefixed `policy:` or `probe:`, if either fails. On success it prints `Access evidence structure passed; policy=complete, authenticated_probes=complete.` — that exact line, with both halves reading `complete`, is the signal the gate is ready to move from `pending` to `pass` in `rc01.json`. This command is local JSON structure validation only; it does not touch the network and is safe to run at any time, including now (it currently prints `authenticated_probes=pending`, confirmed 2026-07-17).

## Absolute rule

GET/HEAD only, for the entire exercise, on both identity passes. Never submit a form. Never call `/api/admin/...` with anything but a page-load GET. The allowed pass proves the identity reaches app authorization, not that it can act — do not act.
