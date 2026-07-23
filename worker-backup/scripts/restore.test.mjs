import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DatabaseSync } from 'node:sqlite';
import {
  PROD_DB_NAME,
  PROD_DB_ID,
  PRODUCTION_OVERRIDE_TOKEN,
  RestoreRefusedError,
  isProductionTarget,
  checkProductionGuard,
  splitSchemaStatements,
  parseCreateTable,
  topoSortTables,
  normalizeParamValue,
  buildInsertBatch,
  latestDateFromLog,
  resolveDatabaseId,
  restore,
} from './restore.mjs';

// ---------------------------------------------------------------------------
// A real (not mocked-out) SQLite engine standing in for the D1 HTTP API, so
// the parameterized-INSERT round trip is proven against genuine bound-
// parameter execution (StatementSync.run(...params)), not a string builder
// pretending to be one. Same {exec, run, count} shape createD1ApiClient
// exposes, so restore() cannot tell the difference.
// ---------------------------------------------------------------------------

function createSqliteFakeClient() {
  const db = new DatabaseSync(':memory:');
  return {
    db,
    async exec(sql) {
      db.exec(sql);
    },
    async run(sql, params = []) {
      db.prepare(sql).run(...params);
    },
    async count(table) {
      const row = db.prepare(`SELECT COUNT(*) AS c FROM "${table}"`).get();
      return Number(row.c);
    },
  };
}

function neverCalled(name) {
  return vi.fn(() => {
    throw new Error(`${name} should never be called here`);
  });
}

describe('isProductionTarget', () => {
  it('matches the production name case-insensitively', () => {
    expect(isProductionTarget({ targetName: 'activity-radar' })).toBe(true);
    expect(isProductionTarget({ targetName: 'Activity-Radar' })).toBe(true);
    expect(isProductionTarget({ targetName: 'pcd-restore-test' })).toBe(false);
  });

  it('matches the production database_id case-insensitively', () => {
    expect(isProductionTarget({ targetId: PROD_DB_ID })).toBe(true);
    expect(isProductionTarget({ targetId: PROD_DB_ID.toUpperCase() })).toBe(true);
    expect(isProductionTarget({ targetId: '11111111-1111-1111-1111-111111111111' })).toBe(false);
  });

  it('is false when neither name nor id is given', () => {
    expect(isProductionTarget({})).toBe(false);
  });
});

describe('checkProductionGuard', () => {
  it('never blocks a non-production target, with or without flags', () => {
    expect(checkProductionGuard({ targetName: 'pcd-restore-test', dryRun: false }).blocked).toBe(false);
    expect(checkProductionGuard({ targetName: 'pcd-restore-test', dryRun: true }).blocked).toBe(false);
  });

  it('blocks activity-radar by name with no override', () => {
    const result = checkProductionGuard({ targetName: PROD_DB_NAME, dryRun: false });
    expect(result.blocked).toBe(true);
  });

  it('blocks activity-radar by database_id with no override', () => {
    const result = checkProductionGuard({ targetId: PROD_DB_ID, dryRun: false });
    expect(result.blocked).toBe(true);
  });

  it('blocks when overwrite-production is set but the confirm token is wrong', () => {
    const result = checkProductionGuard({
      targetName: PROD_DB_NAME,
      overwriteProduction: true,
      confirmToken: 'nope',
      dryRun: false,
    });
    expect(result.blocked).toBe(true);
  });

  it('blocks when the confirm token is right but overwrite-production is not set', () => {
    const result = checkProductionGuard({
      targetName: PROD_DB_NAME,
      overwriteProduction: false,
      confirmToken: PRODUCTION_OVERRIDE_TOKEN,
      dryRun: false,
    });
    expect(result.blocked).toBe(true);
  });

  it('allows activity-radar only with overwrite-production AND the exact token AND no dry-run', () => {
    const result = checkProductionGuard({
      targetName: PROD_DB_NAME,
      overwriteProduction: true,
      confirmToken: PRODUCTION_OVERRIDE_TOKEN,
      dryRun: false,
    });
    expect(result.blocked).toBe(false);
    expect(result.productionOverride).toBe(true);
  });

  it('--dry-run disables the override entirely, even with correct flags', () => {
    const result = checkProductionGuard({
      targetName: PROD_DB_NAME,
      overwriteProduction: true,
      confirmToken: PRODUCTION_OVERRIDE_TOKEN,
      dryRun: true,
    });
    expect(result.blocked).toBe(true);
  });
});

describe('restore() production guard integration', () => {
  it('refuses activity-radar without ever calling resolveTarget, fetchObject, or the D1 client', async () => {
    const resolveTarget = neverCalled('resolveTarget');
    const fetchObject = neverCalled('fetchObject');
    const fetchLog = neverCalled('fetchLog');
    const d1Client = { exec: neverCalled('exec'), run: neverCalled('run'), count: neverCalled('count') };

    await expect(
      restore({ target: 'activity-radar', resolveTarget, fetchObject, fetchLog, d1Client }),
    ).rejects.toBeInstanceOf(RestoreRefusedError);

    expect(resolveTarget).not.toHaveBeenCalled();
    expect(fetchObject).not.toHaveBeenCalled();
    expect(d1Client.exec).not.toHaveBeenCalled();
    expect(d1Client.run).not.toHaveBeenCalled();
  });

  it('refuses a --dry-run against activity-radar even with overwrite-production and the correct token', async () => {
    const d1Client = { exec: neverCalled('exec'), run: neverCalled('run'), count: neverCalled('count') };
    await expect(
      restore({
        target: 'activity-radar',
        dryRun: true,
        overwriteProduction: true,
        confirmToken: PRODUCTION_OVERRIDE_TOKEN,
        resolveTarget: neverCalled('resolveTarget'),
        fetchObject: neverCalled('fetchObject'),
        fetchLog: neverCalled('fetchLog'),
        d1Client,
      }),
    ).rejects.toBeInstanceOf(RestoreRefusedError);
  });

  it('refuses when a non-obvious name resolves to the production database_id', async () => {
    const resolveTarget = vi.fn().mockResolvedValue({ name: 'some-alias', id: PROD_DB_ID });
    const fetchObject = neverCalled('fetchObject');
    const d1Client = { exec: neverCalled('exec'), run: neverCalled('run'), count: neverCalled('count') };

    await expect(
      restore({ target: 'some-alias', resolveTarget, fetchObject, fetchLog: neverCalled('fetchLog'), d1Client }),
    ).rejects.toBeInstanceOf(RestoreRefusedError);
    expect(fetchObject).not.toHaveBeenCalled();
  });

  it('proceeds for a non-production target', async () => {
    const client = createSqliteFakeClient();
    const resolveTarget = vi.fn().mockResolvedValue({ name: 'pcd-restore-test', id: 'test-db-id' });
    const fetchObject = vi.fn(async (key) => {
      if (key.endsWith('manifest.json')) {
        return JSON.stringify({
          date: '2026-07-19',
          database: 'activity-radar',
          verified: true,
          tables: [{ table: 't', dumped_rows: 1, counted_rows: 1, verified: true }],
        });
      }
      if (key.endsWith('schema.sql')) return 'CREATE TABLE "t" ("id" INTEGER PRIMARY KEY, "name" TEXT);';
      if (key.endsWith('t.json')) return JSON.stringify([{ id: 1, name: 'ok' }]);
      throw new Error(`unexpected key ${key}`);
    });

    const report = await restore({
      target: 'pcd-restore-test',
      date: '2026-07-19',
      resolveTarget,
      fetchObject,
      fetchLog: neverCalled('fetchLog'),
      d1Client: client,
    });
    expect(report.all_verified).toBe(true);
    expect(report.total_rows_restored).toBe(1);
  });
});

describe('splitSchemaStatements + parseCreateTable', () => {
  const schema = [
    'CREATE TABLE "organizations" ("id" INTEGER PRIMARY KEY, "name" TEXT NOT NULL);',
    'CREATE TABLE "programs" (\n  "id" INTEGER PRIMARY KEY,\n  "org_id" INTEGER NOT NULL,\n  "title" TEXT,\n  FOREIGN KEY ("org_id") REFERENCES "organizations" ("id")\n);',
  ].join('\n\n');

  it('splits on blank-line-separated statements and keeps trailing semicolons', () => {
    const statements = splitSchemaStatements(schema);
    expect(statements).toHaveLength(2);
    expect(statements[0]).toMatch(/^CREATE TABLE "organizations"/);
    expect(statements.every((s) => s.trim().endsWith(';'))).toBe(true);
  });

  it('parses table name, column order, and FK references', () => {
    const statements = splitSchemaStatements(schema);
    const organizations = parseCreateTable(statements[0]);
    expect(organizations.table).toBe('organizations');
    expect(organizations.columns).toEqual(['id', 'name']);
    expect(organizations.references).toEqual([]);

    const programs = parseCreateTable(statements[1]);
    expect(programs.table).toBe('programs');
    expect(programs.columns).toEqual(['id', 'org_id', 'title']);
    expect(programs.references).toEqual(['organizations']);
  });

  it('returns null for a non-CREATE-TABLE statement', () => {
    expect(parseCreateTable('CREATE INDEX idx_x ON t (a);')).toBeNull();
  });
});

describe('topoSortTables', () => {
  it('orders parents before children across a 3-table chain', () => {
    const defs = new Map([
      ['organizations', { table: 'organizations', columns: ['id'], references: [] }],
      ['programs', { table: 'programs', columns: ['id', 'org_id'], references: ['organizations'] }],
      ['camp_claims', { table: 'camp_claims', columns: ['id', 'program_id'], references: ['programs'] }],
    ]);
    const order = topoSortTables(defs);
    expect(order.indexOf('organizations')).toBeLessThan(order.indexOf('programs'));
    expect(order.indexOf('programs')).toBeLessThan(order.indexOf('camp_claims'));
  });

  it('does not infinite-loop on a self-reference or a cycle', () => {
    const defs = new Map([
      ['a', { table: 'a', columns: ['id'], references: ['b'] }],
      ['b', { table: 'b', columns: ['id'], references: ['a'] }],
    ]);
    const order = topoSortTables(defs);
    expect(order.sort()).toEqual(['a', 'b']);
  });
});

describe('normalizeParamValue + buildInsertBatch', () => {
  it('converts booleans to 0/1 and passes other types through', () => {
    expect(normalizeParamValue(true)).toBe(1);
    expect(normalizeParamValue(false)).toBe(0);
    expect(normalizeParamValue(null)).toBeNull();
    expect(normalizeParamValue(undefined)).toBeNull();
    expect(normalizeParamValue('x')).toBe('x');
    expect(normalizeParamValue(7)).toBe(7);
  });

  it('builds one parameterized multi-row INSERT with a flat params array', () => {
    const { sql, params } = buildInsertBatch('t', ['id', 'name'], [
      { id: 1, name: 'a' },
      { id: 2, name: 'b' },
    ]);
    expect(sql).toBe('INSERT INTO "t" ("id", "name") VALUES (?, ?), (?, ?)');
    expect(params).toEqual([1, 'a', 2, 'b']);
  });

  it('binds a missing column key as NULL rather than shifting positions', () => {
    const { params } = buildInsertBatch('t', ['id', 'name'], [{ id: 1 }]);
    expect(params).toEqual([1, null]);
  });
});

describe('latestDateFromLog', () => {
  it('picks the max date lexicographically (which is chronological for ISO dates)', () => {
    const log = [{ date: '2026-07-05' }, { date: '2026-07-19' }, { date: '2026-06-28' }];
    expect(latestDateFromLog(log)).toBe('2026-07-19');
  });

  it('throws on an empty log', () => {
    expect(() => latestDateFromLog([])).toThrow();
  });

  it('throws when there are no valid date entries', () => {
    expect(() => latestDateFromLog([{ date: 'not-a-date' }])).toThrow();
  });
});

describe('resolveDatabaseId', () => {
  it('treats a UUID-shaped target as the database_id directly, without calling wrangler', () => {
    const spawnFn = neverCalled('spawnFn');
    const result = resolveDatabaseId(PROD_DB_ID, { spawnFn });
    expect(result).toEqual({ name: null, id: PROD_DB_ID });
  });

  it('resolves a name via wrangler d1 info --json', () => {
    const spawnFn = vi.fn(() => ({ status: 0, stdout: JSON.stringify({ uuid: 'resolved-id-123' }), stderr: '' }));
    const result = resolveDatabaseId('pcd-restore-test', { spawnFn });
    expect(result).toEqual({ name: 'pcd-restore-test', id: 'resolved-id-123' });
    expect(spawnFn).toHaveBeenCalledWith(
      'npx',
      expect.arrayContaining(['wrangler', 'd1', 'info', 'pcd-restore-test', '--json']),
      expect.anything(),
    );
  });

  it('throws when wrangler exits non-zero', () => {
    const spawnFn = vi.fn(() => ({ status: 1, stdout: '', stderr: 'no such database' }));
    expect(() => resolveDatabaseId('nope', { spawnFn })).toThrow(/failed/);
  });
});

// ---------------------------------------------------------------------------
// The round-trip fixture: NULLs, apostrophes/quotes, unicode, and a
// numeric-vs-text column, restored through the real restore() pipeline
// (schema replay -> FK-respecting load order -> parameterized batch INSERT
// -> COUNT(*) verification) into a genuine SQLite engine via bound
// parameters. Proves the "never string-built SQL" property: none of these
// values would survive naive string concatenation without corrupting the
// statement or another row.
// ---------------------------------------------------------------------------

describe('restore() parameterized round trip', () => {
  const schemaSql = [
    'CREATE TABLE "organizations" (\n  "id" INTEGER PRIMARY KEY,\n  "name" TEXT NOT NULL,\n  "notes" TEXT,\n  "external_code" TEXT,\n  "member_count" INTEGER\n);',
  ].join('\n\n');

  const fixtureRows = [
    { id: 1, name: "O'Brien's Youth Club", notes: null, external_code: '007', member_count: 7 },
    { id: 2, name: 'Quote "test" org', notes: "line with 'single' and \"double\" quotes", external_code: '042', member_count: 42 },
    { id: 3, name: 'café ☕ 日本語 club — emoji 🏈', notes: 'unicode: naïve façade 中文', external_code: '7', member_count: 7 },
  ];

  function manifestFor(rows) {
    return {
      date: '2026-07-19',
      database: 'activity-radar',
      verified: true,
      tables: [{ table: 'organizations', dumped_rows: rows.length, counted_rows: rows.length, verified: true }],
    };
  }

  function fetchObjectFor(rows, manifest) {
    return vi.fn(async (key) => {
      if (key.endsWith('manifest.json')) return JSON.stringify(manifest);
      if (key.endsWith('schema.sql')) return schemaSql;
      if (key.endsWith('organizations.json')) return JSON.stringify(rows);
      throw new Error(`unexpected key ${key}`);
    });
  }

  it('round-trips NULL, quotes/apostrophes, unicode, and numeric-vs-text exactly', async () => {
    const client = createSqliteFakeClient();
    const report = await restore({
      target: 'pcd-restore-test',
      date: '2026-07-19',
      resolveTarget: vi.fn().mockResolvedValue({ name: 'pcd-restore-test', id: 'test-db-id' }),
      fetchObject: fetchObjectFor(fixtureRows, manifestFor(fixtureRows)),
      fetchLog: neverCalled('fetchLog'),
      d1Client: client,
    });

    expect(report.all_verified).toBe(true);
    expect(report.tables[0]).toMatchObject({ table: 'organizations', rows_restored: 3, target_count: 3, verified: true });

    const restored = client.db.prepare('SELECT * FROM "organizations" ORDER BY id').all();
    expect(restored).toHaveLength(3);
    expect(restored[0].notes).toBeNull();
    expect(restored[0].name).toBe("O'Brien's Youth Club");
    expect(restored[1].notes).toBe("line with 'single' and \"double\" quotes");
    expect(restored[2].name).toBe('café ☕ 日本語 club — emoji 🏈');
    expect(restored[2].notes).toBe('unicode: naïve façade 中文');
    // numeric-vs-text: external_code "7" (TEXT) must stay a string, member_count 7 (INTEGER) must stay a number.
    expect(restored[2].external_code).toBe('7');
    expect(typeof restored[2].external_code).toBe('string');
    expect(restored[2].member_count).toBe(7);
    expect(typeof restored[2].member_count).toBe('number');
    expect(restored[0].external_code).toBe('007');
  });

  it('refuses an unverified backup without --force', async () => {
    const manifest = { ...manifestFor(fixtureRows), verified: false };
    await expect(
      restore({
        target: 'pcd-restore-test',
        date: '2026-07-19',
        resolveTarget: vi.fn().mockResolvedValue({ name: 'pcd-restore-test', id: 'test-db-id' }),
        fetchObject: fetchObjectFor(fixtureRows, manifest),
        fetchLog: neverCalled('fetchLog'),
        d1Client: createSqliteFakeClient(),
      }),
    ).rejects.toBeInstanceOf(RestoreRefusedError);
  });

  it('restores an unverified backup with --force and logs a warning', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const manifest = { ...manifestFor(fixtureRows), verified: false };
    const report = await restore({
      target: 'pcd-restore-test',
      date: '2026-07-19',
      force: true,
      resolveTarget: vi.fn().mockResolvedValue({ name: 'pcd-restore-test', id: 'test-db-id' }),
      fetchObject: fetchObjectFor(fixtureRows, manifest),
      fetchLog: neverCalled('fetchLog'),
      d1Client: createSqliteFakeClient(),
    });
    expect(report.forced_unverified_backup).toBe(true);
    expect(warnSpy).toHaveBeenCalledWith(expect.stringMatching(/un-verified/));
    warnSpy.mockRestore();
  });

  it('reports a row-count mismatch and sets all_verified false', async () => {
    const client = createSqliteFakeClient();
    const realCount = client.count.bind(client);
    client.count = async (table) => (table === 'organizations' ? (await realCount(table)) + 1 : realCount(table));

    const report = await restore({
      target: 'pcd-restore-test',
      date: '2026-07-19',
      resolveTarget: vi.fn().mockResolvedValue({ name: 'pcd-restore-test', id: 'test-db-id' }),
      fetchObject: fetchObjectFor(fixtureRows, manifestFor(fixtureRows)),
      fetchLog: neverCalled('fetchLog'),
      d1Client: client,
    });

    expect(report.all_verified).toBe(false);
    expect(report.tables[0].verified).toBe(false);
  });
});
