#!/usr/bin/env python3
"""
ingest_irs_bmf.py

Builds the national organization backbone for ActivityRadar from the IRS
Exempt Organizations Business Master File (EO BMF). Free, national, monthly.

It does NOT touch any live database. It reads one or more BMF CSV files, filters
to youth-activity nonprofits by NTEE code, maps each to our organization_type and
activity_category, and writes a seed .sql file of organization STUBS (name,
address, category, EIN, no programs). Programs come in a later discovery pass.

WORKFLOW (run from the Windows dev machine):
  1. Download the BMF files you want. Per-state:
       https://www.irs.gov/pub/irs-soi/eo_wa.csv   (eo_<state>.csv)
     Or national in four regions: eo1.csv eo2.csv eo3.csv eo4.csv
       https://www.irs.gov/pub/irs-soi/eo1.csv  ... eo4.csv
     Put them in a folder, e.g. buildout\bmf\.
  2. Run this script (dry-run first to see counts by category):
       python scripts/ingest_irs_bmf.py buildout/bmf/*.csv --dry-run
       python scripts/ingest_irs_bmf.py buildout/bmf/*.csv --out seed/0006_seed_orgs_irs.sql
  3. Apply the seed to the shared D1 (execute --file, never migrations apply):
       npx wrangler d1 execute activity-radar --remote --file=./seed/0006_seed_orgs_irs.sql

DEDUP
  Org id is deterministic on name+city+state (same scheme as the camps migration's
  name-key branch), and inserts use INSERT OR IGNORE. So an IRS org that matches an
  existing name-keyed org is skipped, not duplicated. EIN is stored for later merge
  passes against domain-keyed orgs.

GEOCODING
  The BMF has no lat/lng. Pass --zip-centroids <csv with columns zip,lat,lng> to
  fill coordinates from ZIP centroids; otherwise lat/lng are left NULL and geocoded
  in a later pass. Geolocation is only 10 of 100 quality points, so deferring is fine.
"""

import argparse
import csv
import glob
import json
import os
import re
import sys
import uuid

NS = uuid.uuid5(uuid.NAMESPACE_DNS, "activityradar.fieldforge")
from datetime import datetime, timezone
NOW = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

# ---------------------------------------------------------------------------
# NTEE filter + crosswalk
# ---------------------------------------------------------------------------
# Keep: all N (Recreation/Sports/Athletics), all O (Youth Development), and the
# arts-EDUCATION subset of A (dance, music, theater, arts ed, performing-arts schools).
ARTS_KEEP_PREFIXES = ("A25", "A6E", "A62", "A63", "A65", "A68", "A6B", "A6C")


def ntee_kept(ntee):
    if not ntee:
        return False
    c = ntee.strip().upper()
    if not c:
        return False
    if c[0] in ("N", "O"):
        return True
    return c.startswith(ARTS_KEEP_PREFIXES)


def ntee_to_category(ntee):
    """Map an NTEE code to our activity_category controlled vocabulary."""
    c = (ntee or "").strip().upper()
    sports = {
        "N62": "basketball", "N63": "baseball_softball", "N64": "soccer",
        "N65": "football", "N66": "tennis", "N67": "swimming",
    }
    for pre, cat in sports.items():
        if c.startswith(pre):
            return cat
    if c.startswith(("N20", "N50")):   # camps
        return "camp_sports"
    if c.startswith(("A62", "A63")):
        return "dance"
    if c.startswith("A65"):
        return "theater"
    if c.startswith(("A68", "A6B", "A6C")):
        return "music"
    if c.startswith("A25"):
        return "arts_crafts"
    if c.startswith("A6E"):
        return "theater"
    if c.startswith("N"):
        return "other"        # generic sports/recreation
    if c.startswith("O"):
        return "other"        # youth development, no single sport
    return "other"


def ntee_to_org_type(ntee):
    c = (ntee or "").strip().upper()
    if c.startswith(("O20", "O21", "O22", "O23")):   # Boys/Girls Clubs
        return "ymca_community_center"
    if c.startswith("A"):
        return "private_studio"                       # studios/schools (per OS category)
    if c.startswith(("N", "O")):
        return "club_league"
    return "other"


# ---------------------------------------------------------------------------
# helpers
# ---------------------------------------------------------------------------
def det_id(prefix, *parts):
    return f"{prefix}-{uuid.uuid5(NS, '|'.join(str(p or '') for p in parts).lower())}"


def norm(s):
    return re.sub(r"\s+", " ", (s or "").strip().lower())


def slugify(text, fallback):
    s = re.sub(r"[^a-z0-9]+", "-", norm(text)).strip("-")
    return s or fallback


def title_case(s):
    # BMF names are ALL CAPS. Title-case for display, keep short tokens uppercase.
    if not s:
        return s
    out = []
    for w in s.split():
        if w.upper() in ("YMCA", "YWCA", "JCC", "USA", "US", "AAU", "FC", "SC", "II", "III", "4-H"):
            out.append(w.upper())
        else:
            out.append(w.capitalize())
    return " ".join(out)


def sql_str(v):
    if v is None or v == "":
        return "NULL"
    if isinstance(v, (int, float)):
        return str(v)
    return "'" + str(v).replace("'", "''") + "'"


def load_zip_centroids(path):
    cents = {}
    with open(path, encoding="utf-8-sig") as f:
        for row in csv.DictReader(f):
            low = {k.lower().strip(): v for k, v in row.items()}
            z = (low.get("zip") or low.get("zipcode") or low.get("zcta") or "").strip()[:5]
            lat = low.get("lat") or low.get("latitude")
            lng = low.get("lng") or low.get("lon") or low.get("longitude")
            if z and lat and lng:
                try:
                    cents[z.zfill(5)] = (float(lat), float(lng))
                except ValueError:
                    pass
    return cents


def get(row_lc, *names):
    for n in names:
        if n in row_lc and row_lc[n] not in (None, ""):
            return row_lc[n]
    return None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("inputs", nargs="+", help="BMF CSV files or globs")
    ap.add_argument("--out", default="seed/0006_seed_orgs_irs.sql")
    ap.add_argument("--zip-centroids", help="CSV with zip,lat,lng for geocoding")
    ap.add_argument("--dry-run", action="store_true", help="print stats, write no file")
    args = ap.parse_args()

    files = []
    for pat in args.inputs:
        files.extend(glob.glob(pat))
    if not files:
        print("No input files matched.", file=sys.stderr)
        sys.exit(1)

    cents = load_zip_centroids(args.zip_centroids) if args.zip_centroids else {}

    orgs = {}            # id -> org dict (dedup within input by name+city+state)
    seen_rows = 0
    kept = 0
    cat_counts = {}
    geocoded = 0

    for path in files:
        with open(path, encoding="utf-8-sig", newline="") as f:
            for row in csv.DictReader(f):
                seen_rows += 1
                rl = {k.lower().strip(): (v.strip() if isinstance(v, str) else v) for k, v in row.items()}
                ntee = get(rl, "ntee_cd", "ntee")
                if not ntee_kept(ntee):
                    continue
                name = get(rl, "name")
                city = get(rl, "city")
                state = get(rl, "state")
                if not name or not state:
                    continue
                key_id = det_id("org", "nck", norm(name), norm(city), norm(state))
                if key_id in orgs:
                    continue
                ein = get(rl, "ein")
                zip5 = (get(rl, "zip") or "")[:5].zfill(5) if get(rl, "zip") else None
                lat = lng = None
                if zip5 and zip5 in cents:
                    lat, lng = cents[zip5]
                    geocoded += 1
                cat = ntee_to_category(ntee)
                otype = ntee_to_org_type(ntee)
                disp = title_case(name)
                orgs[key_id] = {
                    "id": key_id,
                    "slug": slugify(f"{name}-{city}-{state}", key_id) + (f"-{ein[-4:]}" if ein else ""),
                    "name": disp,
                    "organization_type": otype,
                    "address": title_case(get(rl, "street")),
                    "city": title_case(city),
                    "state": (state or "").upper()[:2],
                    "zip": zip5,
                    "latitude": lat,
                    "longitude": lng,
                    "categories": json.dumps([cat]),
                    "ein": ein,
                    "ntee": ntee.strip().upper(),
                }
                kept += 1
                cat_counts[cat] = cat_counts.get(cat, 0) + 1

    stats = {
        "rows_read": seen_rows,
        "kept_orgs": len(orgs),
        "geocoded": geocoded,
        "by_category": dict(sorted(cat_counts.items(), key=lambda x: -x[1])),
    }
    print(json.dumps(stats, indent=2), file=sys.stderr)
    if args.dry_run:
        return

    lines = [
        "-- 0006_seed_orgs_irs.sql",
        "-- Generated by scripts/ingest_irs_bmf.py. National org backbone from IRS EO BMF.",
        f"-- Generated at {NOW}. Orgs: {len(orgs)}.",
        "-- INSERT OR IGNORE: an org matching an existing name+city+state row is skipped.",
        "",
    ]
    for o in orgs.values():
        lines.append(
            "INSERT OR IGNORE INTO organizations (id,slug,name,organization_type,address,city,state,zip,"
            "latitude,longitude,categories,record_source,record_status,is_claimed,confidence_score,"
            "ein,source_dataset,created_at,last_verified_at,updated_at) VALUES ("
            + ",".join([
                sql_str(o["id"]), sql_str(o["slug"]), sql_str(o["name"]), sql_str(o["organization_type"]),
                sql_str(o["address"]), sql_str(o["city"]), sql_str(o["state"]), sql_str(o["zip"]),
                sql_str(o["latitude"]), sql_str(o["longitude"]), sql_str(o["categories"]),
                sql_str("import"), sql_str("unverified"), sql_str(0), sql_str(10),
                sql_str(o["ein"]), sql_str("irs_eo_bmf"),
                sql_str(NOW), sql_str(NOW), sql_str(NOW),
            ]) + ");"
        )
    lines.append("")

    out_dir = os.path.dirname(args.out)
    if out_dir:
        os.makedirs(out_dir, exist_ok=True)
    with open(args.out, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    print(f"Wrote {args.out} ({len(orgs)} orgs)", file=sys.stderr)


if __name__ == "__main__":
    main()
