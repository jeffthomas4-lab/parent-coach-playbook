#!/usr/bin/env python3
"""
import_results.py - individual-search lane. results.jsonl -> live organizations.

This is the FALLBACK lane. Organizations covered by a current approved directory
snapshot are worked by buildout/donny/ (the directory-batch lane) instead. This
script handles priority organizations no approved directory reaches.

============================================================================
IDENTITY RESOLUTION (rewritten 2026-08-08 -- read this before changing it)
============================================================================

The previous version recomputed every org id from name + city + state and
explicitly discarded the id carried through from the pool:

    # Recompute the authoritative org_id from name+city+state; ignore the
    # agent-supplied org_id (it may be a hallucinated UUID over long runs).

That was half right, and the half that was wrong silently dropped writes.

Measured against the live database on 2026-08-08 across all 3,091 rows in
out/results.jsonl, 37 rows had an org_id that disagreed with the recomputed id:

  * 35 of 37 -- the agent had corrupted the UUID (some are not even valid hex,
    e.g. ...db05-7b4f3e2a1h5d contains an 'h'). Recomputing rescued these.
  * 2 of 37 -- the agent-supplied id was CORRECT and live, and recomputing
    produced an id that does not exist in the table. Both were caused by the
    agent writing a tidier city than the database holds:
        "Mountlake Terrace" vs the stored "Mountlake"
        "Bainbridge Island" vs the stored "Bainbridge Is"
    For those two the UPDATE matched zero rows and the camp_scan_queue INSERT
    was skipped by its EXISTS guard. No error, no log line, no row.

So neither pure strategy is safe. Recomputing identity from mutable fields
breaks whenever a name or city string moves, and it cannot work at all for
organizations that were not created through the IRS deterministic-id path.

The rule now: CARRY the canonical live id and VERIFY it exists. Never
regenerate identity from mutable fields as the primary key, and never write
against an id that has not been confirmed present in the table.

Resolution order, first hit wins:
  1. The worklist CSV for this run. It came straight out of D1 and is the
     authoritative id for the row. Joined on normalized name+city+state, so a
     model mistyping a UUID cannot affect it.
  2. The org_id on the results line, IF it is present in --live-ids.
  3. The recomputed name+city+state id, IF it is present in --live-ids. Logged
     as a repair, not treated as normal.
  4. Nothing. The row is HELD for review. It is never written against a
     guessed id.

--live-ids is required for steps 2-4. Without it the script refuses to emit SQL
rather than fall back to guessing, because guessing is what caused the bug.

USAGE:
  python buildout/hit-rate-test/import_results.py \
    --results   buildout/hit-rate-test/out/results.jsonl \
    --worklist  buildout/hit-rate-test/out/worklist-WA-2026-08-08.csv \
    --live-ids  buildout/hit-rate-test/out/live-org-ids.txt

Produce live-org-ids.txt from the D1 MCP:
  SELECT id FROM organizations WHERE deleted_at IS NULL;
"""

import argparse
import csv
import datetime
import json
import os
import re
import sys
import uuid

NOW = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

# Legacy deterministic scheme, same as scripts/ingest_irs_bmf.py. Retained ONLY
# as resolution step 3 (a repair path for a corrupted UUID), never as the
# primary key. See the header.
_NS = uuid.uuid5(uuid.NAMESPACE_DNS, "activityradar.fieldforge")


def _norm(s):
    return re.sub(r"\s+", " ", (s or "").strip().lower())


def legacy_org_id(name, city, state):
    if not name or not state:
        return None
    return "org-%s" % uuid.uuid5(_NS, "nck|%s|%s|%s" % (_norm(name), _norm(city), _norm(state)))


def nck(name, city, state):
    """Join key for the worklist lookup. Not an identity."""
    return "%s|%s|%s" % (_norm(name), _norm(city), _norm(state))


def sql_str(v):
    if v is None or v == "":
        return "NULL"
    return "'" + str(v).replace("'", "''") + "'"


def load_worklist(paths):
    """name+city+state -> authoritative org id, straight from the D1-derived CSV."""
    by_key = {}
    for path in paths or []:
        if not os.path.exists(path):
            print("warn: worklist not found, skipping: %s" % path, file=sys.stderr)
            continue
        with open(path, encoding="utf-8-sig", newline="") as f:
            for row in csv.DictReader(f):
                rl = {k.lower().strip(): (v.strip() if isinstance(v, str) else v)
                      for k, v in row.items()}
                oid = rl.get("org_id") or rl.get("id")
                if oid and rl.get("name"):
                    by_key[nck(rl.get("name"), rl.get("city"), rl.get("state"))] = oid
    return by_key


def load_live_ids(path):
    if not path:
        return None
    if not os.path.exists(path):
        raise SystemExit("--live-ids file not found: %s" % path)
    ids = set()
    with open(path, encoding="utf-8") as f:
        head = f.read(1)
        f.seek(0)
        if head == "[":                      # JSON array or MCP result dump
            data = json.load(f)
            if isinstance(data, list):
                for item in data:
                    if isinstance(item, str):
                        ids.add(item.strip())
                    elif isinstance(item, dict) and item.get("id"):
                        ids.add(str(item["id"]).strip())
        else:                                # plain newline list
            for line in f:
                v = line.strip().strip('",')
                if v.startswith("org-"):
                    ids.add(v)
    if not ids:
        raise SystemExit("--live-ids parsed to zero ids: %s" % path)
    return ids


def resolve_org_id(r, worklist, live_ids):
    """Return (org_id, method, note). org_id is None when the row must be held."""
    key = nck(r.get("name"), r.get("city"), r.get("state"))

    wl = worklist.get(key)
    if wl and (live_ids is None or wl in live_ids):
        return wl, "worklist", ""

    supplied = (r.get("org_id") or "").strip()
    if supplied and live_ids is not None and supplied in live_ids:
        return supplied, "carried", ""

    legacy = legacy_org_id(r.get("name"), r.get("city"), r.get("state"))
    if legacy and live_ids is not None and legacy in live_ids:
        note = ""
        if supplied and supplied != legacy:
            note = "repaired corrupted org_id %s -> %s" % (supplied, legacy)
        return legacy, "recomputed_repair", note

    if live_ids is None:
        return None, "unverified", "no --live-ids supplied; refusing to guess an id"
    return None, "unresolved", (
        "neither carried id (%s) nor recomputed id (%s) exists in organizations"
        % (supplied or "none", legacy or "none"))


def main():
    ap = argparse.ArgumentParser()
    here = os.path.dirname(__file__)
    ap.add_argument("--results", default=os.path.join(here, "out", "results.jsonl"))
    ap.add_argument("--worklist", action="append", default=[],
                    help="Worklist CSV from daily_discovery.py. Repeatable. Authoritative ids.")
    ap.add_argument("--live-ids", default="",
                    help="File of live organizations.id values. REQUIRED to emit SQL.")
    ap.add_argument("--out-sql", default="")
    ap.add_argument("--review", default="")
    ap.add_argument("--min-confidence", type=int, default=75)
    ap.add_argument("--allow-unverified", action="store_true",
                    help="Emit SQL without --live-ids. Reintroduces the 2026-08 silent-drop bug. Don't.")
    args = ap.parse_args()

    if not os.path.exists(args.results):
        raise SystemExit("No results at %s. Run a discovery session first." % args.results)

    live_ids = load_live_ids(args.live_ids) if args.live_ids else None
    if live_ids is None and not args.allow_unverified:
        raise SystemExit(
            "refusing to emit SQL without --live-ids.\n"
            "  Dump them first:  SELECT id FROM organizations WHERE deleted_at IS NULL;\n"
            "  Writing against an unverified id is what silently dropped rows before 2026-08-08.\n"
            "  Override with --allow-unverified only if you have read the header of this file."
        )

    worklist = load_worklist(args.worklist)
    today = datetime.date.today().isoformat()
    out_sql = args.out_sql or os.path.join(here, "out", "import-%s.sql" % today)
    review = args.review or os.path.join(here, "out", "review-%s.csv" % today)
    os.makedirs(os.path.dirname(os.path.abspath(out_sql)), exist_ok=True)

    accepted, held = [], []
    seen = set()
    stats = {"worklist": 0, "carried": 0, "recomputed_repair": 0,
             "unresolved": 0, "unverified": 0}
    total = 0

    with open(args.results, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            r = json.loads(line)
            total += 1

            oid, method, note = resolve_org_id(r, worklist, live_ids)
            stats[method] = stats.get(method, 0) + 1
            r["resolution_method"] = method
            r["resolution_note"] = note

            if not oid:
                r["hold_reason"] = note or "id could not be resolved"
                held.append(r)
                continue
            if oid in seen:
                continue
            seen.add(oid)
            r["org_id"] = oid

            url = (r.get("website_url") or "").strip()
            conf = int(r.get("website_confidence") or 0)
            flagged = bool(r.get("needs_review"))
            if url and conf >= args.min_confidence and not flagged:
                accepted.append(r)
            else:
                r["hold_reason"] = "confidence %d / flagged=%s / url=%s" % (
                    conf, flagged, bool(url))
                held.append(r)

    lines = [
        "-- import-%s.sql  (generated by import_results.py)" % today,
        "-- Individual-search lane. Idempotent: every write is fill-blank-only.",
        "-- Identity: carried from the worklist/live id set, never regenerated blind.",
        "-- id resolution: %s" % ", ".join("%s=%d" % kv for kv in sorted(stats.items()) if kv[1]),
        "",
    ]
    for r in accepted:
        oid = r["org_id"]
        url = r["website_url"].strip()
        lines.append(
            "UPDATE organizations SET website_url=%s, last_verified_at=%s, updated_at=%s "
            "WHERE id=%s AND (website_url IS NULL OR website_url='') "
            "AND (is_claimed IS NULL OR is_claimed=0);"
            % (sql_str(url), sql_str(NOW), sql_str(NOW), sql_str(oid)))

        # STEP 5b folded in. These three fields were captured from 2026-07-30
        # onward and sat unused because this script never read them.
        email = (r.get("org_email") or "").strip()
        if email:
            lines.append(
                "UPDATE organizations SET email=%s, updated_at=%s WHERE id=%s "
                "AND (email IS NULL OR email='') AND (is_claimed IS NULL OR is_claimed=0);"
                % (sql_str(email), sql_str(NOW), sql_str(oid)))
        phone = (r.get("org_phone") or "").strip()
        if phone:
            lines.append(
                "UPDATE organizations SET phone=%s, updated_at=%s WHERE id=%s "
                "AND (phone IS NULL OR phone='') AND (is_claimed IS NULL OR is_claimed=0);"
                % (sql_str(phone), sql_str(NOW), sql_str(oid)))

        lines.append(
            "INSERT OR IGNORE INTO camp_scan_queue (id, org_id, website_url, status, created_at) "
            "SELECT %s, %s, %s, 'pending', %s "
            "WHERE EXISTS (SELECT 1 FROM organizations WHERE id=%s);"
            % (sql_str("csq-" + oid), sql_str(oid), sql_str(url), sql_str(NOW), sql_str(oid)))
    lines.append("")

    with open(out_sql, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))

    if held:
        with open(review, "w", encoding="utf-8", newline="") as f:
            cols = ["org_id", "name", "city", "state", "engine", "website_url",
                    "social_url", "website_confidence", "needs_review",
                    "website_discovery_reason", "resolution_method",
                    "resolution_note", "hold_reason"]
            w = csv.DictWriter(f, fieldnames=cols, extrasaction="ignore")
            w.writeheader()
            for r in held:
                w.writerow({c: r.get(c, "") for c in cols})

    n_contact = sum(1 for r in accepted if (r.get("org_email") or r.get("org_phone")))
    print("read=%d  resolved=%d  accepted=%d  held=%d" % (total, len(seen), len(accepted), len(held)))
    print("id resolution: " + ", ".join("%s=%d" % kv for kv in sorted(stats.items())))
    if stats.get("recomputed_repair"):
        print("  note: %d row(s) had a corrupted org_id repaired via recompute"
              % stats["recomputed_repair"])
    if stats.get("unresolved"):
        print("  WARNING: %d row(s) held because no id resolved. Previously these were"
              % stats["unresolved"])
        print("           written against a nonexistent id and silently matched 0 rows.")
    print("accepted rows carrying a contact channel: %d" % n_contact)
    print("sql    -> %s" % out_sql)
    if held:
        print("review -> %s" % review)


if __name__ == "__main__":
    main()
