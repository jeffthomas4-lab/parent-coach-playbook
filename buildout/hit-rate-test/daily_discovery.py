#!/usr/bin/env python3
"""
daily_discovery.py - one-command morning driver for the browser discovery pass.

Four-tier priority, Washington-outward within each tier:
  T1: sport name in org name (Soccer Club, Lacrosse, Wrestling, etc.)
  T2: athletic/activity name but no explicit sport (Athletic Association, Youth Sports)
  T3: no sport keyword, some community signal
  T4: clearly non-sport (Pumpkin Growers, National Park Fund, etc.)

Sort key: (tier, state_rollout_index). T1-WA first, then T1-OR, ..., T2-WA, etc.

USAGE:
  python buildout/hit-rate-test/daily_discovery.py buildout/bmf/*.csv --limit 400
"""

import argparse
import csv
import datetime
import glob
import json
import os
import re
import sys
import urllib.parse
import uuid

ROLLOUT = ["WA", "OR", "ID", "AK", "MT", "NV", "CA", "UT", "WY", "AZ", "CO", "NM"]

ENGINES = {
    "duckduckgo": (250, "https://html.duckduckgo.com/html/?q={q}"),
    "bing":       (250, "https://www.bing.com/search?q={q}"),
    "brave":      (200, "https://search.brave.com/search?q={q}"),
    "mojeek":     (200, "https://www.mojeek.com/search?q={q}"),
    "ecosia":     (150, "https://www.ecosia.org/search?q={q}"),
    "startpage":  (150, "https://www.startpage.com/sp/search?query={q}"),
}
DAILY_TOTAL = sum(c for c, _ in ENGINES.values())

SPORT_KEYWORDS = {
    "soccer","football","basketball","baseball","softball","lacrosse",
    "hockey","volleyball","tennis","golf","swimming","swim","wrestling",
    "gymnastics","cheerleading","cheer","dance","martial arts","karate",
    "judo","taekwondo","boxing","rowing","sailing","skiing","ski",
    "snowboard","skateboard","cycling","running","triathlon","archery",
    "fencing","bowling","pickleball","track","cross country","rugby",
    "cricket","handball","badminton","squash","racquetball","polo",
    "rodeo","equestrian","horse","shooting","rifle","pistol","climbing",
    "paddling","kayak","canoe","crew","curling","weightlifting",
    "powerlifting","crossfit","fitness","yoga","diving","surf","skate",
    "bmx","motocross","frisbee","disc","lax","hoops","gridiron",
    "speedway","racing","snowmobile","fishing","hunting","trap","skeet",
    "little league","pee wee","t-ball","tball","water polo","netball",
}

ACTIVITY_KEYWORDS = {
    "athletic","athletics","recreation","recreational","sports","sport",
    "youth","junior","league","booster","activity","activities",
    "games","game","field","court","arena","gymnasium","gym",
    "outdoors","outdoor","adventure","arts","theater","theatre",
    "music","band","choir","chorus","orchestra","performing","performance",
    "4-h","4h","ffa","scouts","scouting","camp","camps",
    "association","community","foundation","club","team","players",
}

NON_SPORT_KEYWORDS = {
    "pumpkin","garden","gardening","quilting","knitting","sewing",
    "stamp","coin","collector","antique","model","train",
    "ham radio","amateur radio","astronomy","bird","nature",
    "conservation","environmental","park","forest","wildlife",
    "historical","history","heritage","cultural","culture",
    "genealogy","library","literacy","reading","book",
    "food bank","food pantry","hunger","homeless","housing",
    "medical","health","hospital","clinic","dental",
    "church","faith","ministry","mission","prayer",
    "animal","rescue","shelter","humane",
}


# Tier 0: orgs that run camps on managed municipal / registration platforms
# (ActiveNet, CivicRec, Daxko, etc.). Highest website + program yield, so they go
# to the very front of the queue ahead of single-sport clubs.
MUNICIPAL_KEYWORDS = {
    "ymca", "ywca", "boys & girls", "boys and girls", "boys girls",
    "parks", "park district", "recreation", "rec center", "metro parks",
    "county parks", "community center", "community centre", "camp", "camps",
}


def tier_of(name):
    n = re.sub(r"\s+", " ", (name or "").strip().lower())
    for kw in MUNICIPAL_KEYWORDS:
        if re.search(r"\b" + re.escape(kw) + r"\b", n):
            return 0
    for kw in SPORT_KEYWORDS:
        if re.search(r"\b" + re.escape(kw) + r"\b", n):
            return 1
    for kw in ACTIVITY_KEYWORDS:
        if re.search(r"\b" + re.escape(kw) + r"\b", n):
            return 2
    for kw in NON_SPORT_KEYWORDS:
        if re.search(r"\b" + re.escape(kw) + r"\b", n):
            return 4
    return 3


NS = uuid.uuid5(uuid.NAMESPACE_DNS, "activityradar.fieldforge")
ARTS_KEEP_PREFIXES = ("A25", "A6E", "A62", "A63", "A65", "A68", "A6B", "A6C")


def det_id(prefix, *parts):
    return "%s-%s" % (prefix, uuid.uuid5(NS, "|".join(str(p or "") for p in parts).lower()))


def norm(s):
    return re.sub(r"\s+", " ", (s or "").strip().lower())


def title_case(s):
    if not s:
        return s
    keep = {"YMCA","YWCA","JCC","USA","US","AAU","FC","SC","II","III","4-H"}
    return " ".join(w.upper() if w.upper() in keep else w.capitalize() for w in s.split())


def get(rl, *names):
    for n in names:
        if n in rl and rl[n] not in (None, ""):
            return rl[n]
    return None


def ntee_kept(ntee):
    c = (ntee or "").strip().upper()
    if not c:
        return False
    return c[0] in ("N", "O") or c.startswith(ARTS_KEEP_PREFIXES)


def build_query(name, city, state):
    return '"%s" %s %s' % (name, city or "", state or "")


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


def build_pool(files, states_wanted):
    wanted = set(states_wanted)
    pool = {}
    seen = set()
    for path in files:
        with open(path, encoding="utf-8-sig", newline="") as f:
            for row in csv.DictReader(f):
                rl = {k.lower().strip(): (v.strip() if isinstance(v, str) else v)
                      for k, v in row.items()}
                ntee = get(rl, "ntee_cd", "ntee")
                if not ntee_kept(ntee):
                    continue
                state = (get(rl, "state") or "").upper()[:2]
                if state not in wanted:
                    continue
                name = get(rl, "name")
                city = get(rl, "city")
                if not name:
                    continue
                oid = det_id("org", "nck", norm(name), norm(city), norm(state))
                if oid in seen:
                    continue
                seen.add(oid)
                disp = title_case(name)
                pool.setdefault(state, []).append({
                    "org_id": oid, "name": disp,
                    "city": title_case(city) or "", "state": state,
                    "tier": tier_of(disp),
                })
    return pool


def cut_worklist(orgs, limit):
    scale = min(1.0, limit / DAILY_TOTAL) if DAILY_TOTAL else 1.0
    remaining = {e: max(1, int(round(c * scale))) for e, (c, _) in ENGINES.items()}
    order = list(ENGINES.keys())
    work, ei = [], 0
    target = min(limit, len(orgs))
    for r in orgs:
        if len(work) >= target:
            break
        tries = 0
        while remaining[order[ei % len(order)]] <= 0 and tries < len(order):
            ei += 1
            tries += 1
        if tries >= len(order):
            break
        engine = order[ei % len(order)]
        ei += 1
        remaining[engine] -= 1
        q = build_query(r["name"], r["city"], r["state"])
        _, tmpl = ENGINES[engine]
        work.append({
            "seq": len(work) + 1,
            "org_id": r["org_id"], "name": r["name"],
            "city": r["city"], "state": r["state"], "tier": r["tier"],
            "engine": engine, "query": q,
            "search_url": tmpl.format(q=urllib.parse.quote_plus(q)),
        })
    return work


def main():
    ap = argparse.ArgumentParser()
    here = os.path.dirname(__file__)
    ap.add_argument("inputs", nargs="+", help="BMF CSV files (buildout/bmf/*.csv)")
    ap.add_argument("--done", default=os.path.join(here, "out", "results.jsonl"))
    ap.add_argument("--out-dir", default=os.path.join(here, "out"))
    ap.add_argument("--limit", type=int, default=DAILY_TOTAL)
    ap.add_argument("--rollout", default=",".join(ROLLOUT))
    args = ap.parse_args()

    rollout = [s.strip().upper() for s in args.rollout.split(",") if s.strip()]
    files = []
    for pat in args.inputs:
        files.extend(glob.glob(pat))
    if not files:
        raise SystemExit("No BMF files matched.")

    pool = build_pool(files, rollout)
    done = load_done(args.done)

    state_order = {s: i for i, s in enumerate(rollout)}
    all_undone = []
    for st in rollout:
        for o in pool.get(st, []):
            if o["org_id"] not in done:
                all_undone.append(o)
    all_undone.sort(key=lambda o: (o["tier"], state_order.get(o["state"], 999)))

    if not all_undone:
        print("All states fully resolved.")
        return

    work = cut_worklist(all_undone, args.limit)
    lead = work[0] if work else all_undone[0]
    active = lead["state"]

    today = datetime.date.today().isoformat()
    out = os.path.join(args.out_dir, "worklist-%s-%s.csv" % (active, today))
    os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
    cols = ["seq","org_id","name","city","state","tier","engine","query","search_url"]
    with open(out, "w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=cols)
        w.writeheader()
        for r in work:
            w.writerow(r)

    by_engine = {}
    for r in work:
        by_engine[r["engine"]] = by_engine.get(r["engine"], 0) + 1
    by_tier = {0:0, 1:0, 2:0, 3:0, 4:0}
    for r in work:
        by_tier[r["tier"]] = by_tier.get(r["tier"], 0) + 1

    total_rem = len(all_undone)
    days_left = (total_rem - len(work) + args.limit - 1) // max(args.limit, 1)
    t1_wa = sum(1 for o in all_undone if o["tier"] == 1 and o["state"] == "WA")
    t1_all = sum(1 for o in all_undone if o["tier"] == 1)

    print("ACTIVE: T%d-%s   (lead: %s)" % (lead["tier"], active, lead["name"]))
    print("today's worklist: %d orgs -> %s" % (len(work), out))
    print("tier breakdown: T1=%d  T2=%d  T3=%d  T4=%d" % (
        by_tier[1], by_tier[2], by_tier[3], by_tier[4]))
    print("engines: " + ", ".join("%s=%d" % (e, by_engine.get(e, 0)) for e in ENGINES))
    print("T1 remaining: %d total  (%d in WA)" % (t1_all, t1_wa))
    print("All remaining after today: %d  (~%d more day(s) at %d/day)" % (
        total_rem - len(work), days_left, args.limit))


if __name__ == "__main__":
    main()
