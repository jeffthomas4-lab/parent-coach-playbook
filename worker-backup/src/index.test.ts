import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  runBackup,
  listTables,
  dumpTable,
  pruneOldBackups,
  type Env,
} from './index';

// --- lightweight in-memory fakes -------------------------------------------
// Not a full SQL engine: these dispatch on the specific query shapes this
// Worker actually issues (see src/index.ts), which is enough to prove the
// pagination, verification, and R2 write logic without pulling in Miniflare.

type FakeRow = Record<string, unknown>;

function createFakeD1(tables: Record<string, FakeRow[]>, countOverride: Record<string, number> = {}) {
  function prepare(sql: string) {
    let boundArgs: unknown[] = [];
    const statement = {
      bind(...args: unknown[]) {
        boundArgs = args;
        return statement;
      },
      async all<T>() {
        if (sql.includes("sqlite_master WHERE type = 'table'")) {
          return { results: Object.keys(tables).map((name) => ({ name })) } as unknown as { results: T[] };
        }
        if (sql.includes('SELECT sql FROM sqlite_master')) {
          return {
            results: Object.keys(tables).map((name) => ({ sql: `CREATE TABLE ${name} (id INTEGER PRIMARY KEY)` })),
          } as unknown as { results: T[] };
        }
        const rowidMatch = sql.match(/FROM "([A-Za-z_][A-Za-z0-9_]*)" WHERE rowid/);
        if (rowidMatch) {
          const table = rowidMatch[1];
          const rows = tables[table] ?? [];
          const [lastRowId, limit] = boundArgs as [number, number];
          const page = rows
            .map((row, idx) => ({ __rowid: idx, ...row }))
            .filter((row) => row.__rowid > lastRowId)
            .slice(0, limit);
          return { results: page } as unknown as { results: T[] };
        }
        throw new Error(`fake D1 .all() unhandled SQL: ${sql}`);
      },
      async first<T>() {
        const countMatch = sql.match(/COUNT\(\*\) AS c FROM "([A-Za-z_][A-Za-z0-9_]*)"/);
        if (countMatch) {
          const table = countMatch[1];
          const count = countOverride[table] ?? tables[table]?.length ?? 0;
          return { c: count } as unknown as T;
        }
        throw new Error(`fake D1 .first() unhandled SQL: ${sql}`);
      },
      async run() {
        throw new Error('fake D1 .run() called — this Worker must never write to D1.');
      },
    };
    return statement;
  }
  return { prepare } as unknown as D1Database;
}

function createFakeR2() {
  const store = new Map<string, string>();
  const bucket = {
    async put(key: string, value: string) {
      store.set(key, typeof value === 'string' ? value : String(value));
    },
    async get(key: string) {
      if (!store.has(key)) return null;
      return { text: async () => store.get(key)! };
    },
    async delete(key: string) {
      store.delete(key);
    },
    async list({ prefix, delimiter }: { prefix?: string; delimiter?: string }) {
      const keys = [...store.keys()].filter((k) => !prefix || k.startsWith(prefix));
      if (delimiter) {
        const prefixes = new Set<string>();
        for (const key of keys) {
          const rest = key.slice((prefix ?? '').length);
          const idx = rest.indexOf(delimiter);
          if (idx >= 0) prefixes.add((prefix ?? '') + rest.slice(0, idx + 1));
        }
        return { objects: [], delimitedPrefixes: [...prefixes] };
      }
      return { objects: keys.map((key) => ({ key })), delimitedPrefixes: [] };
    },
  };
  return { bucket: bucket as unknown as R2Bucket, store };
}

const FIXED_NOW = () => new Date('2026-07-25T14:07:00.000Z');

describe('dumpTable pagination', () => {
  it('pages past 1000 rows and returns every row plus a matching count', async () => {
    const rows = Array.from({ length: 1500 }, (_, i) => ({ id: i, name: `org-${i}` }));
    const db = createFakeD1({ organizations: rows });
    const result = await dumpTable(db, 'organizations');
    expect(result.rows).toHaveLength(1500);
    expect(result.countedRows).toBe(1500);
    expect(result.rows[0]).toEqual({ id: 0, name: 'org-0' });
    expect(result.rows[1499]).toEqual({ id: 1499, name: 'org-1499' });
  });

  it('refuses an unsafe table name rather than interpolate it into SQL', async () => {
    const db = createFakeD1({});
    await expect(dumpTable(db, 'orgs"; DROP TABLE x; --')).rejects.toThrow(/unsafe table name/);
  });
});

describe('listTables', () => {
  it('excludes internal sqlite_% tables', async () => {
    const db = createFakeD1({ organizations: [], programs: [] });
    const tables = await listTables(db);
    expect(tables.sort()).toEqual(['organizations', 'programs']);
  });
});

describe('runBackup — happy path', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn(async () => new Response('ok', { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
  });
  afterEach(() => vi.unstubAllGlobals());

  it('writes schema, per-table JSON, manifest, and backup-log to R2, verified true, no alert', async () => {
    const tables = {
      organizations: [{ id: 1, name: 'Battle Ground Wrestling' }, { id: 2, name: 'Camas Rugby' }],
      programs: [{ id: 1, org_id: 1 }],
    };
    const db = createFakeD1(tables);
    const { bucket, store } = createFakeR2();
    const env: Env = { DB: db, BACKUPS: bucket, SLACK_WEBHOOK_URL: 'https://hooks.example/webhook' };

    const result = await runBackup(env, FIXED_NOW);

    expect(result.verified).toBe(true);
    expect(result.date).toBe('2026-07-25');
    expect(store.has('backups/2026-07-25/schema.sql')).toBe(true);
    expect(JSON.parse(store.get('backups/2026-07-25/organizations.json')!)).toHaveLength(2);
    expect(JSON.parse(store.get('backups/2026-07-25/programs.json')!)).toHaveLength(1);

    const manifest = JSON.parse(store.get('backups/2026-07-25/manifest.json')!);
    expect(manifest.verified).toBe(true);
    expect(manifest.total_rows).toBe(3);
    expect(manifest.tables).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ table: 'organizations', dumped_rows: 2, counted_rows: 2, verified: true }),
        expect.objectContaining({ table: 'programs', dumped_rows: 1, counted_rows: 1, verified: true }),
      ]),
    );

    const log = JSON.parse(store.get('backups/backup-log.json')!);
    expect(log).toHaveLength(1);
    expect(log[0]).toMatchObject({ date: '2026-07-25', verified: true, total_rows: 3 });

    // Success posts nothing to Slack — matches the existing agent convention
    // (proving-clock only, no noise on a clean run).
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('runBackup — verification failure', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn(async () => new Response('ok', { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
  });
  afterEach(() => vi.unstubAllGlobals());

  it('marks verified:false and hits the alert path when COUNT(*) disagrees with the dump', async () => {
    const tables = {
      organizations: [{ id: 1 }, { id: 2 }, { id: 3 }],
    };
    // Intentional miscount fixture: COUNT(*) claims 5 rows exist, but only 3
    // were ever returned by the paginated SELECT — the exact "a row went
    // missing mid-export" failure mode this check exists to catch.
    const db = createFakeD1(tables, { organizations: 5 });
    const { bucket, store } = createFakeR2();
    const env: Env = { DB: db, BACKUPS: bucket, SLACK_WEBHOOK_URL: 'https://hooks.example/webhook' };

    const result = await runBackup(env, FIXED_NOW);

    expect(result.verified).toBe(false);
    const manifest = JSON.parse(store.get('backups/2026-07-25/manifest.json')!);
    expect(manifest.verified).toBe(false);
    expect(manifest.tables[0]).toMatchObject({ table: 'organizations', dumped_rows: 3, counted_rows: 5, verified: false });

    const log = JSON.parse(store.get('backups/backup-log.json')!);
    expect(log[0].verified).toBe(false);

    // Alert path hit (mocked webhook), and the message names the table —
    // without ever needing to print a secret to prove it fired.
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [calledUrl, calledInit] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(calledUrl).toBe('https://hooks.example/webhook');
    const body = JSON.parse(calledInit.body as string);
    expect(body.text).toMatch(/organizations/);
    expect(body.text).toMatch(/FAILED verification/);
  });

  it('does not throw when the webhook itself is unreachable — a real backup problem should not be masked by an alert-delivery problem', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('network down'); }));
    const db = createFakeD1({ organizations: [{ id: 1 }] }, { organizations: 9 });
    const { bucket } = createFakeR2();
    const env: Env = { DB: db, BACKUPS: bucket, SLACK_WEBHOOK_URL: 'https://hooks.example/webhook' };

    const result = await runBackup(env, FIXED_NOW);
    expect(result.verified).toBe(false);
    vi.unstubAllGlobals();
  });
});

describe('pruneOldBackups', () => {
  it('keeps only the newest 8 dated prefixes and never deletes the newest', async () => {
    const { bucket, store } = createFakeR2();
    const dates = [
      '2026-06-01', '2026-06-08', '2026-06-15', '2026-06-22',
      '2026-06-29', '2026-07-06', '2026-07-13', '2026-07-20', '2026-07-25',
    ];
    for (const date of dates) {
      store.set(`backups/${date}/schema.sql`, 'x');
      store.set(`backups/${date}/manifest.json`, '{}');
    }
    store.set('backups/backup-log.json', '[]');

    const deleted = await pruneOldBackups(bucket, 8);

    expect(deleted).toEqual(['2026-06-01']);
    expect(store.has('backups/2026-06-01/schema.sql')).toBe(false);
    expect(store.has('backups/2026-07-25/schema.sql')).toBe(true);
    expect(store.has('backups/backup-log.json')).toBe(true);
  });
});
