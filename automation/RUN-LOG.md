# PCD Run Log: agent_runs and agent_registry

**Status:** foundation document, Session 0. Confirms the two tables now exist in the `forge-command` D1 database and closes the substrate half of Open Item 3 in the Master Plan.

---

## What exists now

Two tables live in the `forge-command` D1 database, id `747cf988-a557-48bd-9d03-bea09e184f94`:

`agent_runs` was created fresh in this session with `CREATE TABLE IF NOT EXISTS`, matching Master Plan section 8 exactly:

```sql
agent_runs (
  run_id TEXT PRIMARY KEY,
  agent TEXT NOT NULL,
  venture TEXT NOT NULL,
  started_at TEXT NOT NULL,
  finished_at TEXT,
  status TEXT NOT NULL CHECK (status IN ('success','partial','failed')),
  summary TEXT,
  needs_you INTEGER NOT NULL DEFAULT 0,
  needs_you_items TEXT,
  outputs TEXT,
  error TEXT
)
```

`agent_registry` already existed in the database before this session touched it. The `CREATE TABLE IF NOT EXISTS` call was a no-op against it. Its live schema carries every column Master Plan section 8 requires, with two small differences from what section 8 implies: `agent` is the single-column primary key (not a composite of agent plus venture), and `purpose` is `NOT NULL`. Confirmed by direct query against `sqlite_master`.

```sql
agent_registry (
  agent TEXT PRIMARY KEY,
  venture TEXT NOT NULL,
  purpose TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active','paused')),
  owner_email_alias TEXT,
  skill_location TEXT,
  last_run_at TEXT,
  success_metric TEXT
)
```

Both were verified with a follow-up query against `sqlite_master` after creation. Both tables exist and are reachable.

## The rule

Agents that do not log do not exist. Every agent run, scheduled or manual, writes one record to `agent_runs`: a start entry when the run begins, and a finish entry marked success, partial, or failed when it ends. No silent runs. No run that only appears if someone remembers to check.

A run that surfaces something Jeff needs to see sets `needs_you` true and fills `needs_you_items` with the specifics: what it is, how urgent, and a link. A run that fails logs the real error in `error`, not a generic message.

## Registry rows

Every agent gets exactly one row in `agent_registry`, added when that agent's build session finishes. The row carries its purpose, its active or paused status, its owning email alias if it has one, where its skill file lives, when it last ran, and its success metric. This is the row Barnabus and the eventual dashboard read from.

## How an agent actually writes a row (added 2026-07-15)

The tables existed but no PCD rows were landing in them (Open Item 3). The reason was not a bug in the table. The PCD scheduled tasks are Claude tasks. They have no D1 binding and there was no endpoint to write through, so nothing was ever wired to `agent_runs` and nothing wrote to it.

The wire is `POST /api/agent-runs` on the parentcoachdesk.com Worker. Source: `src/pages/api/agent-runs.ts` and `src/lib/agent-runs.ts`.

**Auth.** `Authorization: Bearer <AGENT_RUNS_TOKEN>`. A shared secret, not a person. The route only writes the run log: it publishes nothing, sends nothing to anyone outside the system, and spends nothing, so a machine caller with the token is the whole gate.

**Two calls per run.** A start when the run begins, a finish when it ends:

```
POST /api/agent-runs
{ "phase": "start", "run_id": "<uuid>", "agent": "ed", "venture": "parent-coach-desk" }

POST /api/agent-runs
{ "phase": "finish", "run_id": "<uuid>", "agent": "ed", "venture": "parent-coach-desk",
  "status": "success",
  "summary": "Drafted 3 posts.",
  "needs_you": true,
  "needs_you_items": [{ "what": "3 drafts staged", "urgency": "low", "link": "..." }],
  "outputs": { "drafts": 3 } }
```

Both are idempotent on `run_id`. A task that retries the same id updates its row instead of doubling it. A finish with no matching start still writes one complete row, so a task that only reports at the end is logged rather than lost.

**What the route does on top of the write.**

- `status: failed` posts the real error to Slack. A failure that only exists in a Cloudflare log is a silent failure.
- `needs_you: true` posts to Slack whatever the status. This is the Class A "unless it surfaces something" case from SLACK-STAGING.md.
- A finish always stamps `agent_registry.last_run_at`.
- **CANARY.** Two failures for the same agent inside 24 hours sets `agent_registry.status = 'paused'` and says so in the Slack alert. Threshold and window match Forge Command's orchestrator. An agent that fails twice stops rather than keeps failing.

**The CANARY exemption list (added 2026-07-15).** `applyCanary()` in `src/lib/agent-runs.ts` carries a `CANARY_EXEMPT_AGENTS` set. An agent in it trips the threshold, gets alerted, and never gets paused. Today that is Vera and only Vera, under both `pcd-deletion-monitor` (her live registry key) and `vera` (the key after her deferred rename).

The reasoning, because the next person to read `applyCanary()` will want to tidy the special case away. CANARY assumes a stopped agent is safer than a broken one, and that holds for every agent whose failure costs a missed post or a stale row. It inverts for Vera, who is the only watch on a legal 30-day deletion SLA, because pausing her leaves the risk in place and removes the alarm on it.

That is the 2026-07-14 incident exactly. It was also already armed rather than theoretical: her daily 7:04 AM schedule means consecutive account-guard failures always land just under 24 hours apart, and two of them were sitting in `agent_runs` when the exemption went in.

An exemption removes the pause and nothing else. The run still logs `failed` with the real error, still posts to Slack, and still sets `needs_you = 1`; `finishRun()` forces `needs_you` on a failed run of an exempt agent even if the caller omitted it. The Slack line names the exemption and says the agent is still scheduled, so an exempt trip reads louder than a normal one rather than quieter.

**The bar for adding a name to that set is high.** An agent belongs there only when its failure is itself the alarm on a legal or safety obligation and nothing else is watching. "It keeps tripping" is the reason CANARY exists, so it is never the reason to grant an exemption.

Every addition changes this file and the agent's own spec in the same commit as the code. An exemption nobody can find is how the list grows to four names that nobody can defend.

**Which tasks still owe a wire.** Friday Letter, seasonal, and freshness have no logging and no Slack contract at all today. The endpoint is built; those tasks' skill files have to start calling it. That work is the agent-roster lane's, not the Worker's.

**Needed before this can write anything:** the `FORGE_DB` binding on the Worker (the `forge-command` database, `747cf988-a557-48bd-9d03-bea09e184f94`) and the `AGENT_RUNS_TOKEN` secret. Without the binding the route returns 500 and logs it; without the token it refuses every request with 503. It fails loud in both directions, on purpose.

## What this session did not do

No rows were written to either table. Session 0 builds the substrate only. The first row in `agent_registry` and the first row in `agent_runs` land when Nora's build session (Session 1) actually runs.
