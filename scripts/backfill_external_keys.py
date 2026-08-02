#!/usr/bin/env python3
"""Backfill organizations.external_key and organizations.content_hash.

WHY THIS EXISTS

SightSmash's public directory ingests through `directory_source_records`, keyed
on (source_provider, source_record_key) with a content_hash for change
detection. To feed it, every PCD organization needs a public identifier that is
stable forever. Neither existing candidate works:

  * `slug` is regenerated whenever a name changes, so it is not stable.
  * `id` is an internal implementation detail and should not be published.

`external_key` is that stable third thing. It is DERIVED DETERMINISTICALLY from
the row's immutable `id`, which means:

  * running this script twice produces identical keys (idempotent, no state file)
  * a key never changes, no matter how the org is renamed or re-slugged
  * the internal id is not recoverable from the published key

`content_hash` covers the syndicated field set ONLY. Editorial columns
(review_notes, reviewed_by, pcd_status) and sync columns (crm_*, syndicated_at)
are deliberately excluded, so an internal review note does not look like a
public-facing change and trigger a pointless re-publish downstream.

PREREQUISITE

migrations-activity-radar/0015_org_editorial_and_sync.sql must be applied first;
it is what adds both columns. This script only generates SQL, it never connects
to anything, so running it early is harmless.

USAGE

  # 1. Export the orgs (via the D1 MCP, or wrangler on the Windows machine)
  npx wrangler d1 execute activity-radar --remote --json \
    --command "SELECT id, name, slug, organization_type, website_url, email, phone, address, city, state, zip, latitude, longitude, categories, description, external_key FROM organizations;" > orgs.json

  # 2. Generate the SQL
  python3 scripts/backfill_external_keys.py --orgs orgs.json --out out/external-keys.sql

  # 3. Apply it (D1 MCP, or wrangler --file on Windows)

The generated UPDATEs are guarded with `WHERE external_key IS NULL`, so an
already-keyed row is never rewritten even if this is applied twice.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

# Namespace prefix. Published downstream as directory_source_records.source_record_key,
# where it sits alongside keys from other providers -- the prefix keeps them
# unambiguous and makes a stray key obvious in a log.
KEY_PREFIX = "pcdorg"

# Length of the hex digest kept for the key. 20 hex chars = 80 bits. At the
# ~200k organizations this database is sized for, collision probability is on
# the order of 1e-14 -- far below the point where it is the thing that breaks.
KEY_HEX_LEN = 20

# The fields that actually get syndicated. Order matters: it is part of the
# hash. Appending to this list changes every hash and forces a full re-publish
# downstream, so add fields deliberately, not casually.
SYNDICATED_FIELDS = [
    "name",
    "slug",
    "organization_type",
    "website_url",
    "email",
    "phone",
    "address",
    "city",
    "state",
    "zip",
    "latitude",
    "longitude",
    "categories",
    "description",
]


def external_key(org_id: str) -> str:
    """Deterministic, stable, non-reversible key derived from the internal id."""
    digest = hashlib.sha256(f"{KEY_PREFIX}:{org_id}".encode("utf-8")).hexdigest()
    return f"{KEY_PREFIX}_{digest[:KEY_HEX_LEN]}"


def content_hash(org: dict) -> str:
    """SHA-256 over the syndicated field set only, in a fixed field order."""
    parts = []
    for field in SYNDICATED_FIELDS:
        value = org.get(field)
        parts.append("" if value is None else str(value).strip())
    return hashlib.sha256("\x1f".join(parts).encode("utf-8")).hexdigest()


def sql_str(value) -> str:
    """Single-quoted SQL literal with quotes doubled. NULL for None/empty."""
    if value is None:
        return "NULL"
    return "'" + str(value).replace("'", "''") + "'"


def load_orgs(path: Path) -> list[dict]:
    """Accept either a bare list of rows or wrangler's [{"results": [...]}] shape."""
    raw = json.loads(path.read_text(encoding="utf-8"))
    if isinstance(raw, dict):
        raw = [raw]
    if not isinstance(raw, list):
        raise SystemExit(f"unexpected JSON shape in {path}: expected a list or object")
    if raw and isinstance(raw[0], dict) and "results" in raw[0]:
        rows: list[dict] = []
        for block in raw:
            rows.extend(block.get("results") or [])
        return rows
    return raw


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--orgs", required=True, type=Path, help="JSON export of the organizations table")
    ap.add_argument("--out", required=True, type=Path, help="where to write the generated SQL")
    ap.add_argument("--rehash-all", action="store_true",
                    help="also refresh content_hash on rows that already have an external_key")
    args = ap.parse_args()

    orgs = load_orgs(args.orgs)
    if not orgs:
        print("no organizations in export, nothing to do", file=sys.stderr)
        return 1

    now = datetime.now(timezone.utc).isoformat(timespec="seconds")
    lines = [
        "-- Generated by scripts/backfill_external_keys.py",
        f"-- {now}",
        f"-- {len(orgs)} organizations read",
        "-- external_key is derived from organizations.id and never changes.",
        "-- Guarded so an already-keyed row is never rewritten.",
        "",
    ]

    seen: dict[str, str] = {}
    keyed = skipped = rehashed = 0

    for org in orgs:
        org_id = org.get("id")
        if not org_id:
            print(f"WARNING: row with no id, skipped: {org.get('name')!r}", file=sys.stderr)
            continue

        key = external_key(str(org_id))
        if key in seen and seen[key] != org_id:
            # Two different ids hashing to the same key. Astronomically unlikely,
            # but a silent collision here would merge two orgs downstream, so it
            # is a hard stop rather than a warning.
            raise SystemExit(
                f"FATAL: external_key collision {key} between {seen[key]!r} and {org_id!r}. "
                "Increase KEY_HEX_LEN and regenerate."
            )
        seen[key] = org_id

        chash = content_hash(org)

        if org.get("external_key"):
            skipped += 1
            if args.rehash_all:
                lines.append(
                    f"UPDATE organizations SET content_hash = {sql_str(chash)}, "
                    f"updated_at = {sql_str(now)} WHERE id = {sql_str(org_id)};"
                )
                rehashed += 1
            continue

        lines.append(
            f"UPDATE organizations SET external_key = {sql_str(key)}, "
            f"content_hash = {sql_str(chash)}, updated_at = {sql_str(now)} "
            f"WHERE id = {sql_str(org_id)} AND external_key IS NULL;"
        )
        keyed += 1

    lines.append("")
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text("\n".join(lines), encoding="utf-8")

    print(f"read {len(orgs)} orgs")
    print(f"  {keyed} to be keyed")
    print(f"  {skipped} already keyed (skipped)")
    if args.rehash_all:
        print(f"  {rehashed} content_hash refreshed")
    print(f"wrote {args.out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
