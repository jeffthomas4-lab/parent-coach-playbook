import csv, sys, os, importlib.util, datetime, urllib.parse
here=os.path.dirname(os.path.abspath("daily_discovery.py"))
spec=importlib.util.spec_from_file_location("dd","daily_discovery.py")
dd=importlib.util.module_from_spec(spec); spec.loader.exec_module(dd)

rows=[]
with open("out/_pool_raw.tsv",encoding="utf-8") as f:
    for line in f:
        line=line.rstrip("\n")
        if not line.strip(): continue
        p=line.split("\t")
        oid,name,city=p[0],p[1],p[2] if len(p)>2 else ""
        rows.append({"org_id":oid,"name":name,"city":city,"state":"WA","tier":dd.tier_of(name)})

# write db-pool.csv
with open("out/db-pool.csv","w",encoding="utf-8",newline="") as f:
    w=csv.DictWriter(f,fieldnames=["id","name","city","state"]); w.writeheader()
    for r in rows: w.writerow({"id":r["org_id"],"name":r["name"],"city":r["city"],"state":r["state"]})

done=dd.load_done("out/results.jsonl")
undone=[r for r in rows if r["org_id"] not in done]
undone.sort(key=lambda o:(o["tier"],))
work=dd.cut_worklist(undone, 400)
today=datetime.date.today().isoformat()
out="out/worklist-WA-%s.csv"%today
cols=["seq","org_id","name","city","state","tier","engine","query","search_url"]
with open(out,"w",encoding="utf-8",newline="") as f:
    w=csv.DictWriter(f,fieldnames=cols); w.writeheader()
    for r in work: w.writerow(r)
bt={}
for r in work: bt[r["tier"]]=bt.get(r["tier"],0)+1
print("pool=%d done_skipped=%d undone=%d worklist=%d"%(len(rows),len(rows)-len(undone),len(undone),len(work)))
print("tiers:",dict(sorted(bt.items())))
print("out:",out)
