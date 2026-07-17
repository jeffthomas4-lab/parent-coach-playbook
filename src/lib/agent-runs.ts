// agent_runs logging, failure alerting, and the CANARY auto-pause.
//
// Open Item 3 said the run log had no PCD rows in it. It wasn't a bug in the
// table — the table is fine. The tables live in the `forge-command` D1
// database, and the PCD scheduled tasks are Claude tasks with no D1 binding and
// no HTTP endpoint to write through. Nothing was ever wired to the table, so
// nothing wrote to it. This file plus /api/agent-runs is that wire.
//
// The rule from automation/RUN-LOG.md: agents that do not log do not exist.
// Every run writes a start row and a finish row. A failure stores bounded detail
// in protected D1, alerts Slack without that detail, and — on a second failure inside 24 hours —
// pauses the agent per the CANARY rule in the constitution. One exception, with
// its reasoning at CANARY_EXEMPT_AGENTS below: the privacy-request deadline
// watch never gets paused, because its failure is the alarm.
//
// Binding: FORGE_DB, the `forge-command` D1 database
// (747cf988-a557-48bd-9d03-bea09e184f94). Every statement below uses bound
// parameters.

import { postToSlack, type SlackEnv } from './slack';

export interface AgentRunsEnv extends SlackEnv {
  FORGE_DB?: D1Database;
  /** Shared secret the scheduled tasks present on the ingest route. */
  AGENT_RUNS_TOKEN?: string;
}

export type RunStatus = 'success' | 'partial' | 'failed';

export interface StartRunInput {
  run_id: string;
  agent: string;
  venture: string;
  started_at?: string;
}

export interface FinishRunInput {
  run_id: string;
  agent: string;
  venture: string;
  status: RunStatus;
  summary?: string | null;
  needs_you?: boolean;
  needs_you_items?: unknown;
  outputs?: unknown;
  error?: string | null;
  finished_at?: string;
}

/** Errors within this window count toward the CANARY threshold. */
const CANARY_WINDOW_MS = 24 * 60 * 60 * 1000;
/** Failures inside the window that trip the auto-pause. Matches Forge Command's orchestrator. */
const CANARY_THRESHOLD = 2;

/**
 * Agents CANARY may never pause. Do not "clean this up." Read this first.
 *
 * CANARY stops an agent that is failing repeatedly, on the theory that a stopped
 * agent is safer than a broken one. That theory inverts for a compliance watch.
 * Vera is the only thing watching the configured privacy-request response target.
 * The actual statutory deadline and exceptions are request-specific and require
 * counsel-approved policy; the monitor reads the authoritative request deadline. Pausing her
 * does not stop the risk, it stops the alarm. Her failure is the alarm.
 *
 * That is not hypothetical. On 2026-07-14 her account guard tripped, the task
 * was switched off, and the SLA went unwatched with nobody told. Auto-pause
 * would rebuild that same incident with better tooling. As of 2026-07-15
 * `agent_runs` already holds two `pcd-deletion-monitor` failures 23h59m34s
 * apart: she runs daily at a fixed time, so consecutive failures will always
 * land just under the 24h window. This is her steady state until the portfolio
 * inbox is connected, not an edge case.
 *
 * An exempt agent loses the pause and nothing else. It still logs `failed`,
 * still alerts Slack with a protected-history pointer, and still sets `needs_you`. Escalation
 * replaces the pause; it does not go quiet.
 *
 * Both keys are Vera. `pcd-deletion-monitor` is her live registry key today;
 * `vera` is the key after the deferred rename. Both sit here so the rename
 * cannot silently un-exempt her.
 */
const CANARY_EXEMPT_AGENTS: ReadonlySet<string> = new Set(['pcd-deletion-monitor', 'vera']);

/** True if CANARY must never pause this agent. Match is case-insensitive on the registry key. */
export function isCanaryExempt(agent: string): boolean {
  return CANARY_EXEMPT_AGENTS.has(agent.trim().toLowerCase());
}

const MAX_SUMMARY_LEN = 2000;
const MAX_ERROR_LEN = 2000;
const MAX_JSON_LEN = 20000;

function clamp(value: string | null | undefined, max: number): string | null {
  if (value === null || value === undefined) return null;
  const s = String(value);
  return s.length > max ? `${s.slice(0, max - 3)}...` : s;
}

function asJson(value: unknown, max: number): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value === 'string') return clamp(value, max);
  try {
    return clamp(JSON.stringify(value), max);
  } catch {
    return null;
  }
}

/**
 * Write the start row. Idempotent on run_id: a retried start does not create a
 * second row, so a task that crashes and reruns with the same id is safe.
 */
export async function startRun(db: D1Database, input: StartRunInput): Promise<void> {
  await db
    .prepare(
      `INSERT INTO agent_runs (run_id, agent, venture, started_at, status, needs_you)
       VALUES (?, ?, ?, ?, 'partial', 0)
       ON CONFLICT(run_id) DO NOTHING`,
    )
    .bind(input.run_id, input.agent, input.venture, input.started_at ?? new Date().toISOString())
    .run();
}

/**
 * Write the finish row. Upserts on run_id so a finish with no matching start
 * (a task that only reports at the end) still lands one complete row instead of
 * silently doing nothing.
 */
export async function finishRun(db: D1Database, input: FinishRunInput): Promise<void> {
  const finishedAt = input.finished_at ?? new Date().toISOString();
  // A CANARY-exempt agent gets escalation in place of the pause, so a failed run
  // of one always needs a human even if the caller forgot to say so. This is the
  // exact hole in the 2026-07-14 incident: the run logged `failed` with
  // needs_you at its default of 0, and the SLA went unwatched in silence.
  const needsYou = input.needs_you || (input.status === 'failed' && isCanaryExempt(input.agent));
  await db
    .prepare(
      `INSERT INTO agent_runs
         (run_id, agent, venture, started_at, finished_at, status, summary, needs_you, needs_you_items, outputs, error)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(run_id) DO UPDATE SET
         finished_at = excluded.finished_at,
         status = excluded.status,
         summary = excluded.summary,
         needs_you = excluded.needs_you,
         needs_you_items = excluded.needs_you_items,
         outputs = excluded.outputs,
         error = excluded.error`,
    )
    .bind(
      input.run_id,
      input.agent,
      input.venture,
      finishedAt,
      finishedAt,
      input.status,
      clamp(input.summary, MAX_SUMMARY_LEN),
      needsYou ? 1 : 0,
      asJson(input.needs_you_items, MAX_JSON_LEN),
      asJson(input.outputs, MAX_JSON_LEN),
      clamp(input.error, MAX_ERROR_LEN),
    )
    .run();
}

/** Stamp agent_registry.last_run_at. A missing registry row is not an error here. */
export async function touchRegistry(db: D1Database, agent: string, at: string): Promise<void> {
  await db
    .prepare(`UPDATE agent_registry SET last_run_at = ? WHERE agent = ?`)
    .bind(at, agent)
    .run();
}

/** Count this agent's failed runs inside the CANARY window. */
export async function countRecentFailures(db: D1Database, agent: string): Promise<number> {
  const since = new Date(Date.now() - CANARY_WINDOW_MS).toISOString();
  const row = await db
    .prepare(
      `SELECT COUNT(*) AS n FROM agent_runs
        WHERE agent = ? AND status = 'failed' AND COALESCE(finished_at, started_at) >= ?`,
    )
    .bind(agent, since)
    .first<{ n: number }>();
  return row?.n ?? 0;
}

/** Flip the agent to paused. Returns true if a registry row actually changed. */
export async function pauseAgent(db: D1Database, agent: string): Promise<boolean> {
  const res = await db
    .prepare(`UPDATE agent_registry SET status = 'paused' WHERE agent = ? AND status != 'paused'`)
    .bind(agent)
    .run();
  return (res.meta?.changes ?? 0) > 0;
}

export interface CanaryResult {
  failures24h: number;
  tripped: boolean;
  paused: boolean;
  /** The threshold was met but this agent is on the exemption list, so no pause was attempted. */
  exempt: boolean;
}

/**
 * The CANARY rule: two failures inside 24 hours pauses the agent and says so
 * out loud. A silent failure is the thing the whole run log exists to prevent,
 * so a repeat failure stops the agent rather than letting it keep failing.
 *
 * Exception: an agent in CANARY_EXEMPT_AGENTS trips but never pauses. See the
 * comment on that set. It is a compliance watch, and pausing the watch is worse
 * than the failure it is reporting.
 */
export async function applyCanary(db: D1Database, agent: string): Promise<CanaryResult> {
  const exempt = isCanaryExempt(agent);
  const failures24h = await countRecentFailures(db, agent);
  if (failures24h < CANARY_THRESHOLD) return { failures24h, tripped: false, paused: false, exempt };
  // Exempt agents never reach pauseAgent(). No UPDATE is issued at all, so a bug
  // in the pause path cannot reach them either.
  if (exempt) return { failures24h, tripped: true, paused: false, exempt: true };
  const paused = await pauseAgent(db, agent);
  return { failures24h, tripped: true, paused, exempt: false };
}

/**
 * Alert on a run that needs a human. Two shapes:
 *  - failed: something broke, here's the error, here's whether CANARY paused it
 *  - needs_you: the run worked and surfaced something for Jeff
 *
 * Best-effort. A Slack failure is logged and swallowed; the run row is already
 * written by the time this is called, so the record survives either way.
 */
export async function alertRun(
  env: AgentRunsEnv | undefined,
  input: FinishRunInput,
  canary?: CanaryResult,
): Promise<void> {
  const lines: string[] = [];
  if (input.status === 'failed') {
    lines.push(`:rotating_light: *${input.agent}* run failed (${input.venture}).`);
    if (input.error) lines.push('Error detail recorded in the protected run history.');
    if (canary?.tripped) {
      if (canary.exempt) {
        // Louder, not quieter. An exempt agent is exempt because its failure is
        // the alarm on a legal SLA, so the repeat failure gets escalated rather
        // than swallowed by a pause.
        lines.push(
          `CANARY: ${canary.failures24h} failures in 24h — *${input.agent}* is exempt from auto-pause and is still scheduled. It is failing repeatedly and nobody else is watching this. Fix it or switch it off by hand.`,
        );
      } else {
        lines.push(
          canary.paused
            ? `CANARY: ${canary.failures24h} failures in 24h — agent set to *paused* in agent_registry. Registry-aware runs should stop; independently scheduled raw tasks must be disabled separately.`
            : `CANARY: ${canary.failures24h} failures in 24h — agent already paused.`,
        );
      }
    }
  } else if (input.needs_you) {
    lines.push(`*${input.agent}* has something for you (${input.venture}).`);
    if (input.summary) lines.push(clamp(input.summary, 400)!);
    const items = asJson(input.needs_you_items, 800);
    if (items) lines.push(items);
  } else {
    return;
  }
  lines.push(`run_id: \`${input.run_id}\``);
  await postToSlack(env, { text: lines.join('\n') });
}
