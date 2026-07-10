#!/usr/bin/env python3
"""
sample_orgs.py

Step 1 of the website-resolution hit-rate gate.
Spec: ActivityRadar/buildout/WEBSITE-RESOLUTION-HIT-RATE-TEST-2026-06-15.md

Pulls the stratified 2,000-org WA/OR sample the gate runs on. Reads the IRS EO
BMF directly (the same source ingest_irs_bmf.py loaded into the shared D1), so
every sampled org carries the SAME deterministic org_id that is already in the
`organizations` table. That id is what the scorecard writes back against later.

It does NOT touch any database and makes no network calls. BMF in, sample CSV out.

Why read the BMF and not the D1 export:
  - The BMF is the only source that still carries NTEE_CD, which we need to
    stratify by code group (N / O / arts-A). The loaded org stubs dropped it.
  - org_id is reproduced with the exact key scheme from ingest_irs_bmf.py
    (det_id("org","nck", norm(name), norm(city), norm(state))), so it matches D1.

USAGE (run from the ActivityRadar repo root on the Windows dev machine):
  python buildout/hit-rate-test/sample_orgs.py buildout/bmf/*.csv ^
      --config buildout/hit-rate-test/config.json ^
      --out buildout/hit-rate-test/out/sample.csv

  # See the strata breakdown without writing:
  python buildout/hit-rate-test/sample_orgs.py buildout/bmf/*.csv --dry-run

Output columns:
  org_id, name, city, state, zip, ein, ntee_cd, ntee_group, name_commonness, query
"""

import argparse
import csv
import glob
import json
import os
import random
import re
import sys
import uuid

# --- id scheme copied verbatim from scripts/ingest_irs_bmf.py so ids match D1 ---
NS = uuid.uuid5(uuid.NAMESPACE_DNS, "activityradar.fieldforge")
ARTS_KEEP_PREFIXES = ("A25", "A6E", "A62", "A63", "A65", "A68", "A6B", "A6C")


def det_id(prefix, *parts):
    return f"{prefix}-{uuid.uuid5(NS, '|'.join(str(p or '') for p in parts).lower())}"


def norm(s):
    return re.sub(r"\s+", " ", (s or "").strip().lower())


def title_case(s):
    if not s:
        return s
    out = []
    for w in s.split():
        if w.upper() in ("YMCA", "YWCA", "JCC", "USA", "US", "AAU", "FC", "SC", "II", "III", "4-H"):
            out.append(w.upper())
        else:
            out.append(w.capitalize())
    return " ".join(out)


def get(row_lc, *names):
    for n in names:
        if n in row_lc and row_lc[n] not in (None, ""):
            return row_lc[n]
    return None


def ntee_kept(ntee):
    c = (ntee or "").strip().upper()
    if not c:
        return False
    if c[0] in ("N", "O"):
        return True
    return c.startswith(ARTS_KEEP_PREFIXES)


def ntee_group(ntee):
    """The three strata the gate samples across."""
    c = (ntee or "").strip().upper()
    if not c:
        return None
    if c[0] == "N":
        return "N"   # recreation / sports / athletics
    if c[0] == "O":
        return "O"   # youth development
    if c[0] == "A":
        return "A"   # arts-education subset
    return None


# Generic tokens that, on their own, do not make a name findable. Used only to
# decide distinctive-vs-generic for the commonness stratum, never for the id.
GENERIC_TOKENS = {
    "club", "association", "assn", "league", "youth", "sports", "sport", "soccer",
    "baseball", "softball", "basketball", "football", "tennis", "swimming", "swim",
    "recreation", "rec", "parks", "park", "community", "center", "centre", "foundation",
    "inc", "incorporated", "organization", "org", "of", "the", "and", "for", "boys",
    "girls", "ymca", "ywca", "athletic", "athletics", "junior", "jr", "kids", "children",
    "childrens", "team", "academy", "society", "council", "usa", "us", "national",
    "american", "america", "booster", "boosters", "little", "pop", "warner",
}


def name_commonness(display_name):
    """generic = high collision risk: 0 or 1 distinguishing token (e.g. "Boys &
    Girls Club", "Tacoma Soccer Club" where one word does all the work).
    distinctive = 2+ non-generic tokens, much harder to confuse with a sibling."""
    toks = re.findall(r"[a-z0-9']+", (display_name or "").lower())
    distinctive = [t for t in toks if t not in GENERIC_TOKENS and len(t) > 1]
    return "distinctive" if len(distinctive) >= 2 else "generic"


def load_config(path):
    if path and os.path.exists(path):
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    return {}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("inputs", nargs="+", help="BMF CSV files or globs (e.g. buildout/bmf/*.csv)")
    ap.add_argument("--config", default=os.path.join(os.path.dirname(__file__), "config.json"))
    ap.add_argument("--out", default=os.path.join(os.path.dirname(__file__), "out", "sample.csv"))
    ap.add_argument("--dry-run", action="store_true", help="print strata, write nothing")
    args = ap.parse_args()

    cfg = load_config(args.config)
    s = cfg.get("sample", {})
    size = int(s.get("size", 2000))
    states = set(x.upper() for x in s.get("states", ["WA", "OR"]))
    seed = int(s.get("random_seed", 615))
    query_format = cfg.get("search", {}).get("query_format", '"{name}" {city} {state}')
    random.seed(seed)

    files = []
    for pat in args.inputs:
        files.extend(glob.glob(pat))
    if not files:
        print("No input files matched. Point at buildout/bmf/*.csv", file=sys.stderr)
        sys.exit(1)

    # Build the eligible pool: kept NTEE, in-scope state, deduped by org_id.
    pool = {}
    rows_read = 0
    for path in files:
        with open(path, encoding="utf-8-sig", newline="") as f:
            for row in csv.DictReader(f):
                rows_read += 1
                rl = {k.lower().strip(): (v.strip() if isinstance(v, str) else v) for k, v in row.items()}
                ntee = get(rl, "ntee_cd", "ntee")
                if not ntee_kept(ntee):
                    continue
                state = (get(rl, "state") or "").upper()[:2]
                if state not in states:
                    continue
                name = get(rl, "name")
                city = get(rl, "city")
                if not name or not state:
                    continue
                oid = det_id("org", "nck", norm(name), norm(city), norm(state))
                if oid in pool:
                    continue
                disp = title_case(name)
                pool[oid] = {
                    "org_id": oid,
                    "name": disp,
                    "city": title_case(city) or "",
                    "state": state,
                    "zip": ((get(rl, "zip") or "")[:5].zfill(5) if get(rl, "zip") else ""),
                    "ein": get(rl, "ein") or "",
                    "ntee_cd": ntee.strip().upper(),
                    "ntee_group": ntee_group(ntee),
                    "name_commonness": name_commonness(disp),
                }

    eligible = [r for r in pool.values() if r["ntee_group"]]
    if not eligible:
        print("No eligible orgs found. Check the BMF files and state filter.", file=sys.stderr)
        sys.exit(1)

    # Proportional stratification by NTEE group, random within each stratum.
    by_group = {}
    for r in eligible:
        by_group.setdefault(r["ntee_group"], []).append(r)
    total = len(eligible)
    target = min(size, total)

    # Largest-remainder allocation so the strata sum to exactly `target`.
    raw = {g: len(rows) / total * target for g, rows in by_group.items()}
    alloc = {g: int(v) for g, v in raw.items()}
    remainder = target - sum(alloc.values())
    for g, _ in sorted(raw.items(), key=lambda kv: kv[1] - int(kv[1]), reverse=True)[:remainder]:
        alloc[g] += 1

    sample = []
    for g, rows in by_group.items():
        n = min(alloc.get(g, 0), len(rows))
        sample.extend(random.sample(rows, n))
    random.shuffle(sample)

    # Strata report.
    def mix(rows, key):
        out = {}
        for r in rows:
            out[r[key]] = out.get(r[key], 0) + 1
        return dict(sorted(out.items()))

    report = {
        "bmf_rows_read": rows_read,
        "eligible_pool": total,
        "states": sorted(states),
        "sample_size": len(sample),
        "by_ntee_group": mix(sample, "ntee_group"),
        "by_name_commonness": mix(sample, "name_commonness"),
        "pool_by_ntee_group": mix(eligible, "ntee_group"),
    }
    print(json.dumps(report, indent=2), file=sys.stderr)

    if args.dry_run:
        return

    for r in sample:
        r["query"] = query_format.format(name=r["name"], city=r["city"], state=r["state"]).strip()

    os.makedirs(os.path.dirname(os.path.abspath(args.out)), exist_ok=True)
    cols = ["org_id", "name", "city", "state", "zip", "ein", "ntee_cd", "ntee_group", "name_commonness", "query"]
    with open(args.out, "w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=cols)
        w.writeheader()
        for r in sample:
            w.writerow({c: r.get(c, "") for c in cols})
    print(f"Wrote {len(sample)} rows -> {args.out}", file=sys.stderr)


if __name__ == "__main__":
    main()
