// Content frontmatter length guard.
//
// A single over-length frontmatter field hard-fails `astro build` with
// InvalidContentEntryDataError and takes the whole site build down. That has
// happened three times from agent-written drafts: news `summary` at 432/400 and
// articles `seoDescription` at 190/180 (both 2026-07-28), plus an earlier trim
// on 2026-07-22.
//
// The schema already catches it. The problem is WHERE: at build time, after the
// link manifest and 810 OG images have been generated, with an error that names
// a stack frame in astro internals. This names the file and field up front, and
// `npm run build` runs it ahead of `astro build`.
//
// NOTE ON SHAPE: this spawns the checker ONCE in beforeAll and asserts against
// the captured output. The first version spawned it separately in each test,
// which read 1,463 files three times over and blew vitest's 5s default timeout
// twice. A guard that makes the suite flaky is a guard people delete.

import { describe, it, expect, beforeAll } from 'vitest';
import { execFileSync } from 'node:child_process';

const CWD = new URL('..', import.meta.url);
const SCRIPT = 'scripts/check-content-field-lengths.mjs';

/** Generous: reading every content entry is I/O-bound and varies by machine. */
const SPAWN_TIMEOUT_MS = 60_000;

let output = '';
let exitCode = 0;

beforeAll(() => {
  try {
    output = execFileSync(process.execPath, [SCRIPT, '--check'], {
      cwd: CWD,
      encoding: 'utf8',
      timeout: SPAWN_TIMEOUT_MS,
    });
  } catch (error) {
    const e = error as { status?: number; stdout?: string; stderr?: string };
    exitCode = e.status ?? 1;
    output = `${e.stdout ?? ''}${e.stderr ?? ''}`;
  }
}, SPAWN_TIMEOUT_MS);

describe('content frontmatter length guard', () => {
  it('finds no field over or under its schema limit', () => {
    expect(output, 'checker produced no output').not.toBe('');
    expect(output).toContain('BUILD-BREAKING: none');
    expect(exitCode, `checker exited ${exitCode}:\n${output}`).toBe(0);
  });

  it('actually parsed constraints rather than silently finding none', () => {
    // A checker that parses zero constraints passes everything and protects
    // nothing. If content.config.ts changes shape, this is what notices.
    const m = /across (\d+) schema-constrained collections/.exec(output);
    expect(m, `could not read collection count from:\n${output}`).not.toBeNull();
    expect(Number(m![1])).toBeGreaterThan(0);
  });

  it('scanned a realistic number of entries', () => {
    const m = /Scanned (\d+) entries/.exec(output);
    expect(m).not.toBeNull();
    // Guards against a path change that silently scans an empty directory.
    expect(Number(m![1])).toBeGreaterThan(100);
  });

  it('keeps the near-cap list out of default output', () => {
    // 89 entries sit within 5% of their cap. Printing all of them on every
    // build buries the line that matters. --near opts in.
    expect(output).not.toMatch(/^\s+\d+\/\d+\s+\w+\//m);
    expect(output).toMatch(/Run with --near to list them|within \d+% of their cap/);
  });
});
