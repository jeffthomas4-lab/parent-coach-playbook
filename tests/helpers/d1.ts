// Minimal D1 test double. Records every prepare()/bind() call so a test can
// assert that a statement used bound parameters instead of string-built SQL,
// and returns canned results per query.

export interface D1Call {
  sql: string;
  params: unknown[];
}

export interface FakeD1 {
  db: any;
  calls: D1Call[];
  /** Queue a result for the next .first() call. */
  queueFirst: (value: unknown) => void;
  /** Queue a result for the next .run() call. */
  queueRun: (value: unknown) => void;
}

export function makeFakeD1(opts: { throwOn?: RegExp } = {}): FakeD1 {
  const calls: D1Call[] = [];
  const firstQueue: unknown[] = [];
  const runQueue: unknown[] = [];

  const db = {
    prepare(sql: string) {
      const stmt = {
        _params: [] as unknown[],
        bind(...params: unknown[]) {
          stmt._params = params;
          return stmt;
        },
        async run() {
          calls.push({ sql, params: stmt._params });
          if (opts.throwOn?.test(sql)) throw new Error('d1 exploded');
          return runQueue.shift() ?? { meta: { changes: 1 } };
        },
        async first<T>() {
          calls.push({ sql, params: stmt._params });
          if (opts.throwOn?.test(sql)) throw new Error('d1 exploded');
          return (firstQueue.shift() ?? null) as T;
        },
        async all() {
          calls.push({ sql, params: stmt._params });
          return { results: [] };
        },
      };
      return stmt;
    },
  };

  return {
    db,
    calls,
    queueFirst: (v) => firstQueue.push(v),
    queueRun: (v) => runQueue.push(v),
  };
}
