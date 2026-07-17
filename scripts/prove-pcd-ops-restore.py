#!/usr/bin/env python3
"""Restore a PCD operational D1 export into isolated SQLite and emit bounded proof."""

from __future__ import annotations

import argparse
import hashlib
import json
import sqlite3
from pathlib import Path

MIGRATIONS_DIR = Path(__file__).resolve().parent.parent / "migrations-pcd-ops"
EXPECTED_MIGRATIONS = sorted(path.name for path in MIGRATIONS_DIR.glob("*.sql"))
EXPECTED_TABLES = {
    "content_suppressions",
    "demand_events_v1",
    "notification_outbox",
    "trust_case_events",
    "trust_cases",
    "trust_response_delivery_attempts",
    "trust_response_draft_events",
    "trust_response_drafts",
}


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("export", type=Path)
    parser.add_argument("restored", type=Path)
    args = parser.parse_args()
    source = args.export.read_bytes()
    if args.restored.exists():
        raise SystemExit("refusing to overwrite an existing restore target")
    connection = sqlite3.connect(args.restored)
    try:
        connection.executescript(source.decode("utf-8"))
        integrity = connection.execute("PRAGMA integrity_check").fetchone()[0]
        foreign_key_rows = connection.execute("PRAGMA foreign_key_check").fetchall()
        tables = {row[0] for row in connection.execute("SELECT name FROM sqlite_master WHERE type='table'")}
        migrations = [row[0] for row in connection.execute("SELECT name FROM d1_migrations ORDER BY id")]
        counts = {
            table: connection.execute(f'SELECT COUNT(*) FROM "{table}"').fetchone()[0]
            for table in sorted(EXPECTED_TABLES)
        }
    finally:
        connection.close()
    proof = {
        "export_bytes": len(source),
        "export_sha256": hashlib.sha256(source).hexdigest(),
        "integrity_check": integrity,
        "foreign_key_violation_count": len(foreign_key_rows),
        "expected_tables_present": EXPECTED_TABLES.issubset(tables),
        "applied_migrations": migrations,
        "table_counts": counts,
    }
    print(json.dumps(proof, indent=2, sort_keys=True))
    return 0 if integrity == "ok" and not foreign_key_rows and EXPECTED_TABLES.issubset(tables) and migrations == EXPECTED_MIGRATIONS else 1


if __name__ == "__main__":
    raise SystemExit(main())
