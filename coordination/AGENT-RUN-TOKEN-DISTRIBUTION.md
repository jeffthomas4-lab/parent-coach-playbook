# Agent run token distribution

This is the caller-side contract for `POST /api/agent-runs`. It does not contain
the shared bearer value and must never be edited to include it.

## Store and identity

The scheduled-task platform's encrypted secret store is the caller source of
truth. The value is exposed at run time only as `PCD_AGENT_RUNS_TOKEN` to the
dedicated Parent Coach Desk scheduled-task identity. Prompts and committed
skills name the environment variable and `scripts/agent-run-client.mjs`; they
never contain, request, echo, interpolate, or pass the value as a command-line
argument. The production Worker stores the matching value as the dashboard-
managed `AGENT_RUNS_TOKEN` secret.

## Redacted preflight

Each caller runs `node scripts/agent-run-client.mjs preflight` before its first
write. The command sends a non-mutating `HEAD` request and reports only:

- `204`: credential and binding are ready;
- `403`: credential missing from the request or rejected;
- `503`: Worker secret or run-log binding is unavailable;
- any other status: unexpected response, stop.

The command never prints the token or response headers. A failed preflight
stops the agent before work starts; it does not retry writes blind.

## Rotation

Jeff owns rotation. Create the replacement in a password manager or approved
secret generator, then update the caller secret store and Worker secret through
their interactive secret interfaces without shell history or transcript
capture. Run the redacted preflight from one canary caller. Only after 204:

1. run one start/finish canary with a non-customer run identifier;
2. confirm exactly one completed row in protected run history;
3. move remaining callers to the secret reference;
4. revoke the prior value;
5. record date, owner, affected secret names, and redacted outcome—not values.

A failed canary restores the prior caller secret reference while the Worker
value is reconciled. Never paste either value into Git, chat, evidence, or a
skill file.

## Rollout

Nora is the one-agent canary. The remaining roster is wired only after Nora has
one clean start and finish row. Each agent uses a stable machine identifier and
a unique idempotent run ID. Skill deployment and scheduled-task secret changes
remain external approval-gated actions.
