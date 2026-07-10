#!/usr/bin/env python3
"""
discovery_batch.py - cut one day's browser-search worklist.

No API. This prepares the list that Claude-for-Chrome works through by hand:
up to ~1,250 orgs per day, spread across 10 search engines by a fixed per-engine
cap, with a ready-to-open search URL for each. It is the "scheduled task" half of
the discovery pass. The searching itself happens in the browser.

It reads the org queue (sample.csv from sample_orgs.py, or any CSV with
org_id,name,city,state), skips orgs already resolved in results.jsonl, assigns the
next undone orgs to engines until each engine's daily cap is full, and writes today's
worklist CSV. Resumable: run it each day and it advances through the queue.

Per-engine daily caps (sum 1,250). Google is kept low because it is the most
aggressive about automated-query detection.

USAGE (PowerShell, from the ActivityRadar repo root):
  python buildout/hit-rate-test/discovery_batch.py `
    --queue buildout/hit-rate-test/out/sample.csv `
    --done  buildout/hit-rate-test/out/results.jsonl `
    --out   buildout/hit-rate-test/out/worklist-2026-06-24.csv

Then open the worklist and resolve each row in Chrome per DISCOVERY-PROMPT.md,
appending one JSON line per org to results.jsonl.
"""

import argparse
import csv
import datetime
import json
import os
import urllib.parse

# engine -> (daily_cap, search_url_template). {q} is the url-encoded query.
ENGINES = {
    "google":     (100, "https://www.google.com/search?q={q}"),
    "bing":       (150, "https://www.bing.com/search?q={q}"),
    "brave":      (150, "https://search.brave.com/search?q={q}"),
    "duckduckgo": (150, "https://duckduckgo.com/?q={q}"),
    "yahoo":      (125, "https://search.yahoo.com/search?p={q}"),
    "ecosia":     (125, "https://www.ecosia.org/search?q={q}"),
    "startpage":  (100, "https://www.startpage.com/sp/search?query={q}"),
    "qwant":      (100, "https://www.qwant.com/?q={q}"),
    "mojeek":     (125, "https://www.mojeek.com/search?q={q}"),
    "swisscows":  (125, "https://swisscows.com/en/web?query={q}"),
}
DAILY_TOTAL = sum(cap for cap, _ in ENGINES.values())  # 1250


def build_query(name, city, state):
    return '"%s" %s %s' % (name, city or "", state or "")


def build_url(engine, query):
    cap, tmpl = ENGINES[engine]
    return tmpl.format(q=urllib.parse.quote_plus(query))


def load_done(path):
    done = set()
    if path and os.path.exists(path):
        with open(path, encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                try:
                    done.add(json.loads(line)["org_id"])
                except Exception:
                    pass
    return done


def main():
    ap = argparse.ArgumentParser()
    here = os.path.dirname(__file__)
    ap.add_argument("--queue", default=os.path.join(here, "out", "sample.csv"))
    ap.add_argument("--done", default=os.path.join(here, "out", "results.jsonl"))
    ap.add_argument("--out", default="")
    ap.add_argument("--limit", type=int, default=DAILY_TOTAL,
                    help="max orgs today (default 1250)")
    args = ap.parse_args()

    if not os.path.exists(args.queue):
        raise SystemExit("Queue not found: %s. Run sample_orgs.py first." % args.queue)

    with open(args.queue, encoding="utf-8", newline="") as f:
        rows = list(csv.DictReader(f))

    done = load_done(args.done)
    undone = [r for r in rows if r.get("org_id") not in done]

    # Per-engine remaining capacity, scaled if --limit is below the full 1,250.
    scale = min(1.0, args.limit / DAILY_TOTAL) if DAILY_TOTAL else 1.0
    remaining = {e: max(1, int(round(cap * scale))) for e, (cap, _) in ENGINES.items()}
    order = list(ENGINES.keys())

    worklist = []
    ei = 0
    target = min(args.limit, len(undone))
    for r in undone:
        if len(worklist) >= target:
            break
        # find next engine with capacity, round-robin
        tries = 0
        while remaining[order[ei % len(order)]] <= 0 and tries < len(order):
            ei += 1
            tries += 1
        if tries >= len(order):
            break  # all engines full
        engine = order[ei % len(order)]
        ei += 1
        remaining[engine] -= 1
        q = build_query(r.get("name", ""), r.get("city", ""), r.get("state", ""))
        worklist.append({
            "seq": len(worklist) + 1,
            "org_id": r.get("org_id", ""),
            "name": r.get("name", ""),
            "city": r.get("city", ""),
            "state": r.get("state", ""),
            "ntee_group": r.get("ntee_group", ""),
            "engine": engine,
            "query": q,
            "search_url": build_url(engine, q),
        })

    out = args.out or os.path.join(here, "out",
            "worklist-%s.csv" % datetime.date.today().isoformat())
    os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
    cols = ["seq", "org_id", "name", "city", "state", "ntee_group", "engine", "query", "search_url"]
    with open(out, "w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=cols)
        w.writeheader()
        for row in worklist:
            w.writerow(row)

    by_engine = {}
    for row in worklist:
        by_engine[row["engine"]] = by_engine.get(row["engine"], 0) + 1
    print("queue=%d  done=%d  remaining=%d" % (len(rows), len(done), len(undone)))
    print("today=%d  ->  %s" % (len(worklist), out))
    print("by engine: " + ", ".join("%s=%d" % (e, by_engine.get(e, 0)) for e in order))
    if len(undone) > len(worklist):
        days_left = (len(undone) - len(worklist) + args.limit - 1) // max(args.limit, 1)
        print("at this pace, ~%d more day(s) to clear the queue." % days_left)


if __name__ == "__main__":
    main()
