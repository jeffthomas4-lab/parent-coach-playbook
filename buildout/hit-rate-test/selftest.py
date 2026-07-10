#!/usr/bin/env python3
"""
selftest.py — no-network verification of the scorer.

Feeds synthetic search results through score_org and asserts each lands in the
expected bucket. Run this after any change to the scoring rules:
  python buildout/hit-rate-test/selftest.py
"""
import json
import os
import sys

HERE = os.path.dirname(__file__)
sys.path.insert(0, HERE)
import score  # noqa: E402

with open(os.path.join(HERE, "config.json"), encoding="utf-8") as f:
    SC = json.load(f)["scoring"]

CASES = [
    # (label, record, expected_bucket)
    ("exact own-site + city", {
        "name": "Metro Parks Tacoma", "city": "Tacoma", "state": "WA",
        "organic": [{"domain": "metroparkstacoma.org", "title": "Metro Parks Tacoma | Parks & Recreation",
                     "snippet": "Serving Tacoma, WA with parks and youth programs.", "link": "https://metroparkstacoma.org"}],
        "maps_website": ""}, "resolved_correct"),

    ("own-site strong name, no city -> review", {
        "name": "Hanover Soccer Club", "city": "Vancouver", "state": "WA",
        "organic": [{"domain": "hanoversoccerclub.org", "title": "Hanover Soccer Club",
                     "snippet": "Youth soccer for all ages.", "link": "https://hanoversoccerclub.org"}],
        "maps_website": ""}, "review"),

    ("national parent, wrong geo -> wrong_match", {
        "name": "Boys & Girls Club", "city": "Olympia", "state": "WA",
        "organic": [{"domain": "bgca.org", "title": "Boys & Girls Clubs of America",
                     "snippet": "National headquarters in Atlanta, GA.", "link": "https://bgca.org"}],
        "maps_website": ""}, "wrong_match"),

    ("facebook only -> social_only", {
        "name": "Lakewood Little League", "city": "Lakewood", "state": "WA",
        "organic": [{"domain": "facebook.com", "title": "Lakewood Little League - Home | Facebook",
                     "snippet": "Lakewood, WA youth baseball.", "link": "https://facebook.com/lakewoodll"}],
        "maps_website": ""}, "social_only"),

    ("registration platform -> social_only", {
        "name": "Eastside Volleyball Club", "city": "Bellevue", "state": "WA",
        "organic": [{"domain": "sportsengine.com", "title": "Eastside Volleyball Club - SportsEngine",
                     "snippet": "Register for Bellevue volleyball.", "link": "https://eastsidevbc.sportsengine.com"}],
        "maps_website": ""}, "social_only"),

    ("yelp directory -> no_result (not an own site)", {
        "name": "Tacoma Gymnastics Center", "city": "Tacoma", "state": "WA",
        "organic": [{"domain": "yelp.com", "title": "Tacoma Gymnastics Center - Yelp",
                     "snippet": "Reviews and photos.", "link": "https://yelp.com/biz/tacoma-gymnastics"}],
        "maps_website": ""}, "no_result"),

    ("nothing relevant -> no_result", {
        "name": "Riverside Youth Rowing Association", "city": "Spokane", "state": "WA",
        "organic": [{"domain": "amazon.com", "title": "Rowing machines and gear",
                     "snippet": "Shop fitness equipment.", "link": "https://amazon.com"}],
        "maps_website": ""}, "no_result"),

    ("maps website fills geo -> resolved_correct", {
        "name": "Cascade Climbers Club", "city": "Everett", "state": "WA",
        "organic": [{"domain": "cascadeclimbers.com", "title": "Cascade Climbers Club",
                     "snippet": "", "link": "https://cascadeclimbers.com"}],
        "maps_website": "https://cascadeclimbers.com"}, "resolved_correct"),
]

failures = 0
for label, rec, expected in CASES:
    cls, nscore, geo, best = score.score_org(rec, SC)
    ok = cls == expected
    if not ok:
        failures += 1
    print(f"[{'PASS' if ok else 'FAIL'}] {label}: got={cls} (name={nscore}, geo={int(bool(geo))}) expected={expected}")

print()
if failures:
    print(f"{failures} FAILED. Adjust rules in config.json or score.py.")
    sys.exit(1)
print(f"All {len(CASES)} scorer cases passed.")
