import json
recs=[]
def add(name,city,engine,url="",domain="",conf=0,reason="",social="",review=True):
    recs.append({"org_id":"","name":name,"city":city,"state":"WA","engine":engine,
                 "query":'"%s" %s WA'%(name,city),"website_url":url,"website_domain":domain,
                 "website_confidence":conf,"website_discovery_reason":reason,
                 "social_url":social,"needs_review":review})

# ACCEPTED
add("Friends Of Fidalgo Pool And Fitness Center","Anacortes","brave","https://fidalgopool.com","fidalgopool.com",85,"fidalgopool.com is the org's Fidalgo Pool & Fitness Center site; Friends-of-the-Pool pages, Anacortes shown",review=False)
add("Arlington Youth Cheerleading","Arlington","duckduckgo","https://www.ayceagles.org","ayceagles.org",80,"Owned site ayceagles.org (AYC Eagles) referenced on org's Facebook About","https://www.facebook.com/groups/108600072509386/",review=False)
add("Team Wilder Basketball","Auburn","bing","https://www.teamwilderbasketball.org","teamwilderbasketball.org",95,"Exact-match owned domain; site lists Auburn WA 98092",review=False)
add("Bainbridge Island Youth Soccer Club","Bainbridge Is","bing","https://bifc.net","bifc.net",75,"Rebranded to Bainbridge Island FC (BIFC), the island's youth/community soccer club",review=False)
add("West Sound Soccer Academy","Bainbridge Is","brave","https://westsoundsoccer.org","westsoundsoccer.org",95,"Exact-match owned domain, Bainbridge Island WA",review=False)
add("Bainbridge Island Pickleball Community","Bainbridge Island","bing","https://www.bainbridge-pickleball.org","bainbridge-pickleball.org",90,"Owned domain; Bainbridge Island Pickleball 501c3","https://www.facebook.com/groups/bipickleball",review=False)
add("Driftwood Players","Aberdeen","brave","https://aberdeendriftwood.com","aberdeendriftwood.com",90,"Owned site aberdeendriftwood.com, Driftwood Theater Aberdeen WA (distinct from Edmonds namesake)","https://www.facebook.com/aberdeendriftwood",review=False)
add("Everett Figure Skating Club","Arlington","bing","https://www.everettfsc.org","everettfsc.org",95,"Exact-match owned domain, Everett WA",review=False)
add("Adventure Soccer","Arlington","duckduckgo","https://adventuresoccer.org","adventuresoccer.org",90,"Owned site adventuresoccer.org, Arlington WA; runs free youth sports camps","https://www.facebook.com/adventuresoccer.org/",review=False)

# HELD / needs_review
add("Timberwolves Baseball Club","Aberdeen","duckduckgo","","",0,"Facebook page only, no owned site","https://www.facebook.com/people/Timberwolves-Baseball-Club/61566443236495/")
add("Anacortes Baseball Club","Anacortes","bing","","",0,"Only business directories / Perfect Game team page, no owned site")
add("Safari Golf Seattle Club","Auburn","brave","","",0,"No matching result; results were unrelated Auburn/Seattle golf courses")
add("Bainbridge Island Rowing Club","Bainbridge Is","duckduckgo","","",50,"Only directories + bicomnet hosted page; no clear owned domain")
add("Friends Of Gladstone Football","Battle Ground","duckduckgo","","",0,"Only nonprofit directories, no owned site")
add("Bellevue Youth Soccer Club","Bellevue","brave","","",50,"Rebranded to Bellevue United FC; owned site not surfaced in results")
add("Cascade Striders Track Club","Bellevue","duckduckgo","","",0,"Only directories + LinkedIn, no owned site")
add("Eastside Snowboard Asscociation","Bellevue","bing","","",0,"Only directories, no owned site")
add("Jeel Tennis","Bellevue","brave","","",0,"Only CauseIQ listing, no owned site")
add("Grays Harbor Banjo Band","Aberdeen","duckduckgo","","",0,"Facebook + directories only","https://www.facebook.com/Grays-Harbor-Banjo-Band-181243233396/")
add("Western Youth Sports Education","Aberdeen","duckduckgo","","",0,"Only directories, no owned site")
add("Skyline Elite Athletics Booster Club","Arlington","duckduckgo","","",0,"Facebook + fundraiser page only, no owned site","https://www.facebook.com/people/Skyline-Elite-Athletics-Booster-Club/61572841043828/")
add("Auburn Junior Lions","Auburn","bing","","",0,"Only Bizapedia/GuideStar, no owned site")

with open("out/results.jsonl","a",encoding="utf-8") as f:
    for r in recs:
        f.write(json.dumps(r)+"\n")
print("appended",len(recs),"records (9 accepted, %d held)"%(len(recs)-9))
