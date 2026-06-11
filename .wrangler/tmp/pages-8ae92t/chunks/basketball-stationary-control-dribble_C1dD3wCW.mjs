globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>This is about rhythm and habit. The ball stays low. The knees stay bent. Eyes are anywhere but the ball. Do this drill every warm-up.</p>\n<p><strong>What you need:</strong> 8-foot basket. Youth ball. One per kid. Flat court.</p>\n<p><strong>Setup:</strong> Kids spread out 6 feet apart so nobody’s ball hits another kid’s feet.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Low, Push, Eyes, Both. Low stance, low ball. Push the ball down, don’t slap.</li>\n<li>Eyes up off the ball. Look at the wall, look at a picture, count your fingers. Anywhere but down.</li>\n<li>Use both hands. Right hand for 10 dribbles. Left hand for 10 dribbles.</li>\n<li>Then both hands alternating for 10 dribbles.</li>\n<li>Do 2 rounds. Take 30 seconds between rounds.</li>\n</ol>\n<p><strong>What to watch:</strong> Are they bouncing the ball below their waist? If the ball is rising above waist level, the push was too soft or the stance isn’t low enough. Make them go lower.</p>\n<p><strong>If they’re struggling:</strong> Shorten the time. Do 5 dribbles per hand instead of 10. Use a bigger ball so bounces are more forgiving.</p>\n<p><strong>If they’ve got it:</strong> Dribble while walking 5 steps forward, then 5 back. Keep the same low ball and low stance.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/basketball-ball-rubber/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth rubber basketball →</a> — durable rubber ball for outdoor and gym use.</p>\n<p><a href=\"/what-to-buy/basketball/\">Full basketball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Stationary Control Dribble","summary":"Dribble in place with low ball and bent knees. 6 minutes. Ages 5-7.","sport":"basketball","ages":["5-7"],"fundamental":"dribbling","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"A child dribbling a basketball while standing with knees bent, ball staying below waist level, eyes up.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean foundational dribble drill, voice strong throughout."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/basketball-stationary-control-dribble.md";
				const url = undefined;
				function rawContent() {
					return "\nThis is about rhythm and habit. The ball stays low. The knees stay bent. Eyes are anywhere but the ball. Do this drill every warm-up.\n\n**What you need:** 8-foot basket. Youth ball. One per kid. Flat court.\n\n**Setup:** Kids spread out 6 feet apart so nobody's ball hits another kid's feet.\n\n**How to run it:**\n\n1. Cue: Low, Push, Eyes, Both. Low stance, low ball. Push the ball down, don't slap.\n2. Eyes up off the ball. Look at the wall, look at a picture, count your fingers. Anywhere but down.\n3. Use both hands. Right hand for 10 dribbles. Left hand for 10 dribbles.\n4. Then both hands alternating for 10 dribbles.\n5. Do 2 rounds. Take 30 seconds between rounds.\n\n**What to watch:** Are they bouncing the ball below their waist? If the ball is rising above waist level, the push was too soft or the stance isn't low enough. Make them go lower.\n\n**If they're struggling:** Shorten the time. Do 5 dribbles per hand instead of 10. Use a bigger ball so bounces are more forgiving.\n\n**If they've got it:** Dribble while walking 5 steps forward, then 5 back. Keep the same low ball and low stance.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth rubber basketball →](/go/basketball-ball-rubber/) — durable rubber ball for outdoor and gym use.\n\n[Full basketball gear guide →](/what-to-buy/basketball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
