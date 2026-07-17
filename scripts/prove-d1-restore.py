#!/usr/bin/env python3
"""Restore a trusted D1 SQL export locally and emit aggregate proof.

This script has no Cloudflare client and cannot address a remote database.
It creates a new local SQLite file, verifies integrity and foreign keys, and
records table counts plus the source SHA-256 for an auditable restore exercise.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import sqlite3
from datetime import datetime, timezone
from pathlib import Path


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True, type=Path, help="D1 SQL export")
    parser.add_argument("--output", required=True, type=Path, help="new local SQLite database")
    parser.add_argument("--report", required=True, type=Path, help="JSON proof report")
    parser.add_argument("--table", action="append", default=[], help="table to count; repeatable")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    source = args.input.resolve()
    output = args.output.resolve()
    report = args.report.resolve()
    if not source.is_file() or source.suffix.lower() != ".sql":
        raise SystemExit("--input must be an existing .sql export")
    if output == source or report == source or output == report:
        raise SystemExit("input, output, and report paths must be distinct")
    if output.exists() or report.exists():
        raise SystemExit("refusing to overwrite an existing proof artifact")

    sql_bytes = source.read_bytes()
    sql = sql_bytes.decode("utf-8-sig")
    output.parent.mkdir(parents=True, exist_ok=True)
    report.parent.mkdir(parents=True, exist_ok=True)

    connection = sqlite3.connect(output)
    try:
        connection.execute("PRAGMA journal_mode=OFF")
        connection.execute("PRAGMA synchronous=OFF")
        connection.executescript("BEGIN IMMEDIATE;\n" + sql + "\nCOMMIT;")
        integrity = connection.execute("PRAGMA integrity_check").fetchone()[0]
        foreign_key_violations = connection.execute("PRAGMA foreign_key_check").fetchall()
        available = {
            row[0]
            for row in connection.execute(
                "SELECT name FROM sqlite_schema WHERE type='table' AND name NOT LIKE 'sqlite_%'"
            )
        }
        requested = args.table or sorted(available)
        unknown = sorted(set(requested) - available)
        if unknown:
            raise SystemExit(f"requested tables not present: {', '.join(unknown)}")
        counts = {
            table: connection.execute(
                'SELECT COUNT(*) FROM "' + table.replace('"', '""') + '"'
            ).fetchone()[0]
            for table in requested
        }
    finally:
        connection.close()

    proof = {
        "proved_at_utc": datetime.now(timezone.utc).isoformat(),
        "source_file": source.name,
        "source_bytes": len(sql_bytes),
        "source_sha256": hashlib.sha256(sql_bytes).hexdigest(),
        "restored_file": output.name,
        "integrity_check": integrity,
        "foreign_key_violation_count": len(foreign_key_violations),
        "table_counts": counts,
    }
    report.write_text(json.dumps(proof, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    print(json.dumps(proof, indent=2, sort_keys=True))
    if integrity != "ok" or foreign_key_violations:
        raise SystemExit("restore proof failed integrity checks")


if __name__ == "__main__":
    main()
