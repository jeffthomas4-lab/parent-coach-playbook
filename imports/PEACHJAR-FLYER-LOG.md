# Peachjar Flyer Log

Tracks every Peachjar flyer we've seen so we don't re-process them. Different from `CAMP-SEARCH-LOG.md` because Peachjar requires a login (Jeff's son's school account), the unit of work is one flyer at a time, and the data quality varies (most flyers are PDFs/images that need visual extraction).

**Last updated:** 2026-05-03 (after Run 1)

---

## How to use this file

1. **Before a Peachjar run:** Read the `Seen Flyers` table. Build the SKIP_LIST = every URL already in the table. Don't process those flyers again.
2. **During the run:** For each flyer on the school's Peachjar page, check if its URL is in SKIP_LIST. If yes, skip. If no, classify it (camp / league / skip).
3. **What to import:** Only flyers classified as `camp` or `league`. Everything else is logged but not imported.
4. **After the run:** Append every flyer you saw (imported, skipped, anything) to the `Seen Flyers` table. Append a summary row to `Run History`.

---

## School configuration

Set this to the Peachjar URL for your son's school. Chrome navigates here.

**School name:** (fill in if you want it on the page)
**School Peachjar URL:** https://my.peachjar.com/jar?audienceId=61436&tab=school&districtId=2591&audienceType=school

If the URL changes year-to-year, update it here once and never again.

---

## Active filter rules

Only import flyers that match `program_type` = `camp` or `league`. Skip:

- Flyers with `end_date` before today (past-date)
- One-time events (open houses, fundraisers, family fun nights, school dances)
- School announcements (PTA news, school news, parent surveys)
- Classes / lessons (music, art, tutoring) — for now. Revisit later.
- Anything we can't extract a real start_date from

A flyer counts as a `league` if it describes a recurring season (multiple practices/games over weeks). It counts as a `camp` if it's a time-bounded session (1 day to 2 weeks). When in doubt, default to `camp`.

---

## Seen Flyers

One row per flyer URL we've encountered. Don't delete rows; we use them as the dedupe key.

Classification enum:
- `camp` — imported as a camp
- `league` — imported as a league
- `event` — one-time event, skipped
- `class` — class/lesson, skipped (revisit later)
- `announcement` — school news / PTA / non-program, skipped
- `expired` — past end_date, skipped
- `incomplete` — not enough info to import, skipped (revisit if reposted)
- `duplicate` — same program already in the database from another source

| Flyer URL | Title | Posted | End date | Classification | Imported | Notes |
|---|---|---|---|---|---|---|
| https://my.peachjar.com/district/3158/flyer/3033176?audienceId=61436 | Gig Harbor Day Camp | 2026-04-02 | 2026-08-28 | camp | Y | Outdoors for All adaptive day camp ages 8-16 |
| https://my.peachjar.com/district/3158/flyer/3039984?audienceId=61436 | Basketball Leagues | 2026-04-29 | 2026-08-15 | league | Y | Tacoma School Recreation League K-5 |
| https://my.peachjar.com/district/3158/flyer/3048174?audienceId=61436 | Spring Classes at Tacoma Little Theatre | | 2026-06-13 | class | N | ongoing classes |
| https://my.peachjar.com/district/3158/flyer/3047327?audienceId=61436 | Plant Sale | | 2026-05-09 | event | N | one-time sale |
| https://my.peachjar.com/district/3158/flyer/3044767?audienceId=61436 | May Events at Tacoma Public Library | | 2026-05-31 | event | N | library events |
| https://my.peachjar.com/district/3158/flyer/3046111?audienceId=61436 | Remakery Events - May 2026 | | 2026-05-31 | event | N | sewing events |
| https://my.peachjar.com/district/3158/flyer/3045884?audienceId=61436 | FREE CAPOEIRA CAMP | 2026-04-24 | 2026-08-07 | camp | Y | free 5-day camp Aug 3-7 |
| https://my.peachjar.com/district/3158/flyer/3046881?audienceId=61436 | FABLAB Education Summer Camps 2026 | | 2026-08-21 | camp | Y | STEM camps July 6 - Aug 21 |
| https://my.peachjar.com/district/3158/flyer/3010831?audienceId=61436 | Afterschool Creative Reuse | | | class | N | ongoing class |
| https://my.peachjar.com/district/3158/flyer/3041022?audienceId=61436 | Lions Youth Football Registration | | | incomplete | N | registration opens 4/1/26 but no season dates |
| https://my.peachjar.com/district/3158/flyer/3039584?audienceId=61436 | Home Run for Tacoma Students | | | incomplete | N | not opened, baseball thumbnail |
| https://my.peachjar.com/district/3158/flyer/3024519?audienceId=61436 | Sahale Outdoors Nature Camp | | 2026-08-31 | camp | Y | weekly nature camps June-August |
| https://my.peachjar.com/district/3158/flyer/3040624?audienceId=61436 | SHS Cheer Summer Kids Camp | 2026-04-15 | 2026-07-30 | camp | Y | cheer camp July 27-30 |
| https://my.peachjar.com/district/3158/flyer/3039565?audienceId=61436 | Instrument Exploration Summer Camps (school) | | | class | N | music classes - skip per filter rules |
| https://my.peachjar.com/district/3158/flyer/3024045?audienceId=61436 | Puyallup Tribe Sustainability Food | | | announcement | N | sustainability info |
| https://my.peachjar.com/district/3158/flyer/3026268?audienceId=61436 | Girl Scout Troop Information-Tacoma | | | event | N | info nights past dates |
| https://my.peachjar.com/district/3158/flyer/3030890?audienceId=61436 | Martial Arts Summer Camp (Quantum) | 2026-03-30 | 2026-07-17 | camp | Y | Quantum martial arts camps July 6-17 |
| https://my.peachjar.com/district/3158/flyer/3031155?audienceId=61436 | Community Information Night | | | event | N | one-time event |
| https://my.peachjar.com/district/3158/flyer/3021916?audienceId=61436 | SHS Cheer Summer Kids Camp (older) | | | duplicate | N | older posting of 3040624 |
| https://my.peachjar.com/district/3158/flyer/3038008?audienceId=61436 | Summer Music Camps 2026 (TYSA) | | | class | N | music camps - revisit |
| https://my.peachjar.com/district/3158/flyer/3033538?audienceId=61436 | Summer Camp for Children Ages 3 to 7 (Greentrike) | | | incomplete | N | start July 6 but no end date on flyer |
| https://my.peachjar.com/district/3158/flyer/3020545?audienceId=61436 | Host Families Needed For High School Exchange | | | announcement | N | host family request |
| https://my.peachjar.com/district/3158/flyer/3044537?audienceId=61436 | Puyallup Public Library Events - May 2026 | | 2026-05-31 | event | N | library events |
| https://my.peachjar.com/district/3158/flyer/3033172?audienceId=61436 | Adaptive Bike Rentals at PenMet Park | | | announcement | N | bike rental info |
| https://my.peachjar.com/district/3158/flyer/3045155?audienceId=61436 | Animal Adventures with Seattle Humane | | 2026-08-20 | camp | Y | summer camps June 29 - Aug 20 |
| https://my.peachjar.com/district/3158/flyer/3033900?audienceId=61436 | STORM WATER | | | announcement | N | environmental info |
| https://my.peachjar.com/district/3158/flyer/3046003?audienceId=61436 | YMCA Day Camp - Find your summer adventure! | 2026-04-24 | | incomplete | N | directory page, no specific dates |
| https://my.peachjar.com/district/3158/flyer/3031341?audienceId=61436 | Free Tutoring | | | class | N | tutoring program |
| https://my.peachjar.com/district/3158/flyer/3049263?audienceId=61436 | TAEKWONDO EXPERIENCE DAY | | 2026-05-16 | event | N | one-day intro |
| https://my.peachjar.com/district/3158/flyer/3043538?audienceId=61436 | Skybrary Summer Reading Program | | | announcement | N | reading program |
| https://my.peachjar.com/district/3158/flyer/3044780?audienceId=61436 | Build skills that last lifetime Join Kumon! | | | class | N | tutoring |
| https://my.peachjar.com/district/3158/flyer/3034035?audienceId=61436 | 1-On-1 Tutoring Services | | | class | N | tutoring |
| https://my.peachjar.com/district/3158/flyer/3045207?audienceId=61436 | Special Needs Respite Night | | 2026-05-08 | event | N | one-time event May 8 |
| https://my.peachjar.com/district/3158/flyer/3045581?audienceId=61436 | KP Community Health Care for Kids | | | announcement | N | health care info |
| https://my.peachjar.com/district/3158/flyer/3041769?audienceId=61436 | You're Invited to Sleeping Beauty's Wedding! | | 2026-05-03 | event | N | ballet performance |
| https://my.peachjar.com/district/3158/flyer/3041710?audienceId=61436 | Summer Stage: Outdoor Drama Camps | 2026-04-17 | | incomplete | N | dates not specific on flyer |
| https://my.peachjar.com/district/3158/flyer/3043587?audienceId=61436 | Free LGBTQ+ Youth Group | | | class | N | ongoing youth group |
| https://my.peachjar.com/district/3158/flyer/3032446?audienceId=61436 | SUMMER MUSIC CAMP - FREE TUITION OPTION | | | class | N | music camp - skip per filter rules |
| https://my.peachjar.com/district/3158/flyer/3036718?audienceId=61436 | Pickleball Summer Camp | | | incomplete | N | LetsPlaySeattle directory, no specific dates |
| https://my.peachjar.com/district/3158/flyer/3032497?audienceId=61436 | University Of Washington Airport Air | | | event | N | aviation event |
| https://my.peachjar.com/district/3158/flyer/3046185?audienceId=61436 | 5th Annual Seattle Alliance Sports Sampling | | 2026-08-07 | camp | Y | free multi-sport Aug 3-7 |
| https://my.peachjar.com/district/3158/flyer/3042999?audienceId=61436 | CAMP XTREME! | | | event | N | one-time event w/ bounce houses |
| https://my.peachjar.com/district/3158/flyer/3042650?audienceId=61436 | Fall Soccer Registration Open - UPSC | 2026-04-20 | | incomplete | N | fall season dates not on flyer |
| https://my.peachjar.com/district/3158/flyer/3040446?audienceId=61436 | Rainier Beach Walk the Block Party | | | event | N | one-time event |
| https://my.peachjar.com/district/3158/flyer/3044731?audienceId=61436 | Northwest Boychoir Summer Camp | | | class | N | choir/music - skip per filter rules |
| https://my.peachjar.com/district/3158/flyer/3042670?audienceId=61436 | Free Programs at the Burien Library | | | event | N | library programs |
| https://my.peachjar.com/district/3158/flyer/3042060?audienceId=61436 | Fill Summer Gaps - $30 off/week at Galileo | | | announcement | N | discount promo |
| https://my.peachjar.com/district/3158/flyer/3046187?audienceId=61436 | Snow White The Ballet | | 2026-05-16 | event | N | performance |
| https://my.peachjar.com/district/3158/flyer/3038509?audienceId=61436 | City of Enumclaw Parks and Summer Sports Camp | | 2026-08-12 | camp | Y | imported the volleyball session |
| https://my.peachjar.com/district/3158/flyer/3046152?audienceId=61436 | Blackhills FC Tryouts | 2026-04-24 | | incomplete | N | tryouts only, no season dates |
| https://my.peachjar.com/district/3158/flyer/3026547?audienceId=61436 | Girl Scout Information & Try-A-Troop Events | | | event | N | info events |
| https://my.peachjar.com/district/3158/flyer/3038453?audienceId=61436 | Issaquah History Museums: Trailblazers | | | announcement | N | museum info |
| https://my.peachjar.com/district/3158/flyer/3039931?audienceId=61436 | Teddy Bear Clinic | | | event | N | one-time event |
| https://my.peachjar.com/district/3158/flyer/3041162?audienceId=61436 | Summer Camps at Washington Fencing Academy | | | incomplete | N | dates not visible on flyer |
| https://my.peachjar.com/district/3158/flyer/3007050?audienceId=61436 | Camp Invention at Marvista Elementary School! | | 2026-07-10 | camp | Y | STEM camp July 6-10 |
| https://my.peachjar.com/district/3158/flyer/3042804?audienceId=61436 | Backyard Sports Camp & Summer Lacrosse | | | incomplete | N | June-August stated but no specific dates |
| https://my.peachjar.com/district/3158/flyer/3043155?audienceId=61436 | Movie Night by Bethel #61 - Job's Daughters | | | event | N | one-time event |
| https://my.peachjar.com/district/3158/flyer/3041453?audienceId=61436 | Teen Improv Workshop | | | class | N | workshop class |
| https://my.peachjar.com/district/3158/flyer/3040174?audienceId=61436 | Ins and Outs of Boosters Webinar | | | event | N | one-time webinar |
| https://my.peachjar.com/district/3158/flyer/3039964?audienceId=61436 | Swim Lessons | | | class | N | ongoing lessons |
| https://my.peachjar.com/district/3158/flyer/3039645?audienceId=61436 | Hug in a Jar: Climate-Friendly Food Mixes | | | event | N | one-time event |
| https://my.peachjar.com/district/3158/flyer/3041358?audienceId=61436 | Summer Camp (Safety Town) | | | incomplete | N | not opened, Police Safety Town |
| https://my.peachjar.com/district/3158/flyer/3040447?audienceId=61436 | Free Day Camps for Kids with T1 Diabetes | | | incomplete | N | not opened |
| https://my.peachjar.com/district/3158/flyer/3038492?audienceId=61436 | Girls Rock Math Summer Camp | | | incomplete | N | not opened |
| https://my.peachjar.com/district/3158/flyer/3036903?audienceId=61436 | Boost Reading & Math - Save 10% on Tutoring | | | class | N | tutoring discount |
| https://my.peachjar.com/district/3158/flyer/3040347?audienceId=61436 | Lions Youth Football Registration (community 2nd) | | | duplicate | N | another posting of 3041022 |
| https://my.peachjar.com/district/3158/flyer/3035123?audienceId=61436 | Summer Art Camps at MUSEO | 2026-04-07 | | incomplete | N | dates not on flyer |
| https://my.peachjar.com/district/3158/flyer/3040705?audienceId=61436 | FMESC Club Tryouts - DATES UPDATES | 2026-04-15 | | incomplete | N | tryouts only |
| https://my.peachjar.com/district/3158/flyer/3039573?audienceId=61436 | Earth Day Celebration | | 2026-04-25 | expired | N | past date Apr 25 |
| https://my.peachjar.com/district/3158/flyer/3030894?audienceId=61436 | Martial Arts Summer Camp (Quantum community) | | | duplicate | N | duplicate of 3030890 |
| https://my.peachjar.com/district/3158/flyer/3015110?audienceId=61436 | YMCA Summer Day Camp | | | duplicate | N | similar to 3046003 |
| https://my.peachjar.com/district/3158/flyer/3033099?audienceId=61436 | FREE Python Classes for Kids - April | | 2026-04-30 | expired | N | April class ended |
| https://my.peachjar.com/district/3158/flyer/3030816?audienceId=61436 | Read with a Daffodil Princess | | 2026-04-11 | expired | N | past event |
| https://my.peachjar.com/district/3158/flyer/3031628?audienceId=61436 | Instrument Exploration Summer Camps (community) | | | class | N | music classes |
| https://my.peachjar.com/district/3158/flyer/3027599?audienceId=61436 | Tracyton Recreational Fall Soccer | 2026-03-24 | | incomplete | N | fall season dates not on flyer |
| https://my.peachjar.com/district/3158/flyer/3032909?audienceId=61436 | Kids' Fishing Derby | | | event | N | one-time event |
| https://my.peachjar.com/district/3158/flyer/3031303?audienceId=61436 | Arena Sports Unlimited Play Package | | | announcement | N | play package promo |
| https://my.peachjar.com/district/3158/flyer/3029449?audienceId=61436 | Pacific Ballroom Dance Summer Camps! | | | incomplete | N | not opened, dance camps |
| https://my.peachjar.com/district/3158/flyer/3030869?audienceId=61436 | Robotics AI Programming 3D Design Camps | | | incomplete | N | not opened |
| https://my.peachjar.com/district/3158/flyer/3028390?audienceId=61436 | Reading Buddies | | | class | N | ongoing program |
| https://my.peachjar.com/district/3158/flyer/3033870?audienceId=61436 | Refugees Northwest Foster Care - Info Session | | | event | N | info session |
| https://my.peachjar.com/district/3158/flyer/3031777?audienceId=61436 | Summer Sessions at Camp Arnold | 2026-03-31 | 2026-07-31 | camp | Y | overnight sessions July 6-31 |

---

## Run History

| Date | Flyers seen | New | Imported (camps) | Imported (leagues) | Skipped | Notes |
|---|---|---|---|---|---|---|
| 2026-05-03 | 80 | 80 | 9 | 1 | 70 | First run on empty SKIP_LIST. Strong camp imports include Gig Harbor Day Camp, FABLAB STEM, Sahale Outdoors, SHS Cheer, Quantum Martial Arts, Capoeira, Animal Adventures Seattle Humane, Camp Invention, Seattle Alliance Sports Sampling, Salvation Army Camp Arnold, Enumclaw Volleyball; one league import for Tacoma Parks Basketball Leagues. Many flyers were tryouts-only (FMESC, Blackhills FC, UPSC, Tracyton) or directory-style listings (YMCA, MUSEO, Pickleball, Backyard Sports) without explicit start/end dates and were logged as incomplete. Music/choir/instrument camps logged as class per filter rules pending revisit. |
