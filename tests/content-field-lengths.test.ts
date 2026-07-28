// Content frontmatter length guard.
//
// A single over-length frontmatter field hard-fails `astro build` with
// InvalidContentEntryDataError and takes the whole site build down. That has
// happened twice from agent-written drafts: news `summary` at 432/400
// (2026-07-28) and articles `seoDescription` at 190/180 (same day), plus an
// earlier trim on 2026-07-22.
//
// The schema already catches it. The problem is WHERE: at build time, after
// the manifest and 810 OG images have been generated, with an error that names
// a stack frame in astro internals. This runs in about a second and names the
// file and field.
//
// Wired into `npm run build` ahead of `astro build`, so the fast, readable
// failure happens first.

import { describe, it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';

describe('content frontmatter length guard', () => {
  it('finds no field over or under its schema limit', () => {
    expect(() =>
      execFileSync(process.execPath, ['scripts/check-content-field-lengths.mjs', '--check'], {
        cwd: new URL('..', import.meta.url),
        stdio: 'pipe',
      }),
    ).not.toThrow();
  });

  it('parses all three YAML scalar shapes, so it does not raise false positives', () => {
    // The first version of this checker read only the first line of a plain
    // multi-line scalar and reported 14 phantom `bluf` violations. Multi-line
    // plain scalars are the common shape for `bluf`, so a parser that
    // truncates them is worse than no checker: it sends someone editing 14
    // files that were never broken.
    const out = execFileSync(
      process.execPath,
      ['scripts/check-content-field-lengths.mjs'],
      { cwd: new URL('..', import.meta.url), encoding: 'utf8' },
    );
    expect(out).toMatch(/Scanned \d+ entries/);
    expect(out).toContain('BUILD-BREAKING: none');
  });

  it('actually parsed constraints rather than silently finding none', () => {
    const out = execFileSync(
      process.execPath,
      ['scripts/check-content-field-lengths.mjs'],
      { cwd: new URL('..', import.meta.url), encoding: 'utf8' },
    );
    const m = /across (\d+) schema-constrained collections/.exec(out);
    expect(m).not.toBeNull();
    expect(Number(m![1])).toBeGreaterThan(0);
  });
});
