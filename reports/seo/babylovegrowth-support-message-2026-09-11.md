# Message for BabyLoveGrowth support (chat icon, bottom right of dashboard)

Site: https://parentcoachdesk.com (API + Webhook integration)

Hi. Our webhook integration was returning 200 with {ok: true} and no link field, so every article we published got stored on your side under the fallback URL https://blog.parentcoachdesk.com/blog/<slug>. We don't serve content on that subdomain. As a result 10 of our 12 "Backlinks given" rows (Aug 4 through Sep 11) show "Not online yet" and our credit balance is at -15, even though every article is live and every partner link is in the page as a normal dofollow link.

We've fixed the webhook to return success: true and link for every article going forward. Two things I need from you:

1. Please re-sync the stored live URL for our existing articles from our sitemap (https://parentcoachdesk.com/sitemap-content.xml) and re-run placement verification on them. The correct URLs are:

   - tee-ball-drills → https://parentcoachdesk.com/team-parent/tee-ball-drills/ (couchanddumbells.com)
   - coach-pitch-drills → https://parentcoachdesk.com/game/coach-pitch-drills/ (i-trx.com)
   - flag-football-drills → https://parentcoachdesk.com/game/flag-football-drills/ (flexleagueplus.com)
   - youth-sports-safety → https://parentcoachdesk.com/game/youth-sports-safety/ (rnkapparel.com)
   - tryout-results-email-youth → https://parentcoachdesk.com/drive-there/tryout-results-email-youth/ (pitchtrainingbaseball.com)
   - dealing-with-sports-parents → https://parentcoachdesk.com/game/dealing-with-sports-parents/ (pitchtrainingbaseball.com)
   - goalkeeper-drills-youth → https://parentcoachdesk.com/game/goalkeeper-drills-youth/ (fracture-club.com)
   - baseball-throwing-drill → https://parentcoachdesk.com/game/baseball-throwing-drill/ (nextgencards.shop)
   - post-game-snacks-kids → https://parentcoachdesk.com/team-parent/post-game-snacks-kids/ (drinksolidviibe.com)
   - parent-coach-ethics → https://parentcoachdesk.com/game/parent-coach-ethics/ (depthchartiq.ai)
   - best-kids-shin-guards → https://parentcoachdesk.com/game/best-kids-shin-guards/ (bugawaygear.com)
   - post-game-talk → https://parentcoachdesk.com/drive-home/post-game-talk/ (worldamateurgolftour.com)

2. Can you confirm what your verifier fetches: the stored article URL, or the sitemap? And whether it follows 301s? blog.parentcoachdesk.com currently 301s to the canonical page, so if it follows redirects these should already verify.

Thanks.

