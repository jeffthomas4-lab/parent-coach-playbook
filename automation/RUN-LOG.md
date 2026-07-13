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

## What this session did not do

No rows were written to either table. Session 0 builds the substrate only. The first row in `agent_registry` and the first row in `agent_runs` land when Nora's build session (Session 1) actually runs.
