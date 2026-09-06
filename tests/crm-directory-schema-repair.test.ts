import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';
import { describe, expect, it } from 'vitest';

const directoryMigration = (name: string) => readFileSync(
  new URL(`../migrations-activity-radar/${name}`, import.meta.url),
  'utf8',
);

const migration0015Columns = [
  'pcd_status', 'verified', 'reviewed_by', 'reviewed_at', 'review_notes',
  'reject_reason_code', 'verification_method', 'last_edited_at', 'last_edited_by',
  'pcd_confidence', 'public_contact_label', 'external_key', 'content_hash',
  'syndication_status', 'syndicated_at', 'crm_external_id', 'crm_synced_at', 'deleted_at',
];

const migration0015Indexes = [
  'idx_org_pcd_status', 'idx_org_verified', 'idx_org_reviewed_at', 'idx_org_external_key',
  'idx_org_crm_id', 'idx_org_syndication', 'idx_org_deleted_at',
];

const migration0015Name = '0015_org_editorial_and_sync.sql';
const migration0015Sha256 = '8bee241dabe4e5369f2f417b775f0d74f92a28c3a15733781274ea600a97d182';
const migration0015Aggregate = '721b8dec77d8800b72430d64ea769c2dcf233369d7e7deea6446a9a11493759c';

function stagingFixture(): DatabaseSync {
  const db = new DatabaseSync(':memory:');
  db.exec(`CREATE TABLE organizations (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL,
    name TEXT NOT NULL,
    aliases TEXT,
    organization_type TEXT NOT NULL DEFAULT 'other',
    website_url TEXT,
    email TEXT,
    phone TEXT,
    social_urls TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    zip TEXT,
    latitude REAL,
    longitude REAL,
    categories TEXT,
    age_min INTEGER,
    age_max INTEGER,
    program_types TEXT,
    description TEXT,
    logo_url TEXT,
    years_operating INTEGER,
    record_source TEXT NOT NULL DEFAULT 'scraped',
    record_status TEXT NOT NULL DEFAULT 'active',
    is_claimed INTEGER NOT NULL DEFAULT 0,
    claimed_by_email TEXT,
    confidence_score INTEGER NOT NULL DEFAULT 0,
    legacy_source_domain TEXT,
    created_at TEXT NOT NULL,
    last_verified_at TEXT,
    updated_at TEXT NOT NULL,
    ein TEXT,
    source_dataset TEXT,
    last_enriched_at TEXT,
    enrichment_confidence REAL NOT NULL DEFAULT 0,
    yelp_id TEXT,
    yelp_rating REAL,
    yelp_review_count INTEGER,
    price_tier TEXT,
    camp_detected INTEGER NOT NULL DEFAULT 0,
    camp_url TEXT,
    claim_paid_until TEXT,
    logo_key TEXT,
    gallery_keys TEXT,
    discovery_state TEXT
  );

  WITH RECURSIVE fixture(n) AS (
    VALUES(1) UNION ALL SELECT n+1 FROM fixture WHERE n<10
  ) INSERT INTO organizations (
    id, slug, name, organization_type, record_source, record_status, is_claimed,
    confidence_score, created_at, updated_at, enrichment_confidence, camp_detected
  ) SELECT
    printf('fixture-%02d', n), printf('fixture-%02d', n), printf('Fixture %02d', n),
    'club_league', 'manual', 'active', 0, 90, '2026-07-01T00:00:00.000Z',
    '2026-07-01T00:00:00.000Z', 0, 0
  FROM fixture;
  `);

  for (const name of [
    '0017_crm_projection_cursor.sql',
    '0018_crm_projection_revisions.sql',
    '0019_crm_backfill_created_cursor.sql',
  ]) {
    db.exec(directoryMigration(name));
  }
  return db;
}

describe('Gate 9C-C0 staging directory schema repair', () => {
  it('pins the exact migration bytes and canonical one-file aggregate', () => {
    const bytes = readFileSync(new URL(`../migrations-activity-radar/${migration0015Name}`, import.meta.url));
    const sha256 = createHash('sha256').update(bytes).digest('hex');
    const aggregate = createHash('sha256')
      .update(JSON.stringify([{ name: migration0015Name, sha256 }]))
      .digest('hex');

    expect(sha256).toBe(migration0015Sha256);
    expect(aggregate).toBe(migration0015Aggregate);
  });

  it('rehearses canonical migration 0015 after the already-applied CRM cursor migrations', () => {
    const db = stagingFixture();
    const before = db.prepare(`SELECT id,slug,name,organization_type,record_source,record_status,
      is_claimed,confidence_score,created_at,updated_at,crm_projection_revision
      FROM organizations ORDER BY id`).all();
    const preColumns = new Set(db.prepare(`SELECT name FROM pragma_table_info('organizations')`)
      .all().map(({ name }) => String(name)));
    const preIndexes = new Set(db.prepare(`SELECT name FROM sqlite_schema
      WHERE type='index' AND tbl_name='organizations'`).all().map(({ name }) => String(name)));

    expect(migration0015Columns.filter((name) => preColumns.has(name))).toEqual([]);
    expect(migration0015Indexes.filter((name) => preIndexes.has(name))).toEqual([]);

    db.exec(directoryMigration('0015_org_editorial_and_sync.sql'));

    const postColumns = new Set(db.prepare(`SELECT name FROM pragma_table_info('organizations')`)
      .all().map(({ name }) => String(name)));
    const postIndexes = new Set(db.prepare(`SELECT name FROM sqlite_schema
      WHERE type='index' AND tbl_name='organizations'`).all().map(({ name }) => String(name)));
    expect(migration0015Columns.every((name) => postColumns.has(name))).toBe(true);
    expect(migration0015Indexes.every((name) => postIndexes.has(name))).toBe(true);
    expect(db.prepare(`SELECT id,slug,name,organization_type,record_source,record_status,
      is_claimed,confidence_score,created_at,updated_at,crm_projection_revision
      FROM organizations ORDER BY id`).all()).toEqual(before);
    expect(db.prepare(`SELECT COUNT(*) AS rows,
      SUM(pcd_status='pending') AS pending_rows,
      SUM(verified=0) AS unverified_rows,
      SUM(pcd_confidence='medium') AS medium_rows,
      SUM(syndication_status='private') AS private_rows,
      SUM(external_key IS NULL AND content_hash IS NULL AND crm_external_id IS NULL
        AND deleted_at IS NULL) AS unlinked_rows
      FROM organizations`).get()).toEqual({
      rows: 10,
      pending_rows: 10,
      unverified_rows: 10,
      medium_rows: 10,
      private_rows: 10,
      unlinked_rows: 10,
    });
    expect(db.prepare('PRAGMA integrity_check').get()).toEqual({ integrity_check: 'ok' });
  });

  it('makes the pre-existing tombstone trigger functional without projecting the historical rows', () => {
    const db = stagingFixture();
    db.exec(directoryMigration('0015_org_editorial_and_sync.sql'));

    expect(db.prepare(`SELECT next_revision FROM crm_organization_projection_revisions
      WHERE singleton=1`).get()).toEqual({ next_revision: 1 });
    expect(db.prepare(`SELECT SUM(crm_projection_revision) AS revision_sum
      FROM organizations`).get()).toEqual({ revision_sum: 0 });

    db.prepare(`UPDATE organizations SET deleted_at=? WHERE id=?`)
      .run('2026-09-05T00:00:00.000Z', 'fixture-01');

    expect(db.prepare(`SELECT crm_projection_revision,deleted_at FROM organizations
      WHERE id='fixture-01'`).get()).toEqual({
      crm_projection_revision: 1,
      deleted_at: '2026-09-05T00:00:00.000Z',
    });
    expect(db.prepare(`SELECT next_revision FROM crm_organization_projection_revisions
      WHERE singleton=1`).get()).toEqual({ next_revision: 2 });
  });

  it('proves why the remote executor must abort instead of replaying a partial migration', () => {
    const db = stagingFixture();
    db.exec(directoryMigration('0015_org_editorial_and_sync.sql'));

    expect(() => db.exec(directoryMigration('0015_org_editorial_and_sync.sql')))
      .toThrow(/duplicate column name: pcd_status/i);
  });
});
