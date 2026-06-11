globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Tennis is a rally game. Whoever can keep the ball in play longest wins. Rally to 10 is the simplest cooperative game: two players, count every shot, restart at zero on a miss. This builds consistency, the foundation of match play.</p>\n<p><strong>What you need:</strong> Tennis balls (green for 11-12), racquets, full court.</p>\n<p><strong>Setup:</strong> Two players on opposite baselines.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Player A starts the rally with an underhand feed (no serve).</li>\n<li>Players rally back and forth. Each successful shot counts toward a goal of 10.</li>\n<li>If anyone misses (ball out, in the net), restart at zero.</li>\n<li>Goal: rally of 10 in a row. Then 15. Then 20.</li>\n<li>Record the longest rally of the day.</li>\n</ol>\n<p><strong>What to watch:</strong> Are they trying to hit winners or just keep the ball in? Cooperative rally is about keeping the ball in. Don’t aim for power.</p>\n<p><strong>If they’re struggling:</strong> Smaller court (service boxes only). Bigger margin for error.</p>\n<p><strong>If they’ve got it:</strong> Add target zones. Each shot has to land in a specific zone (cross-court only, for example).</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/tennis-balls-orange/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Orange tennis balls (12-pack) →</a> — slower-bounce balls for learning groundstrokes.</p>\n<p><a href=\"/go/tennis-net/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Portable tennis net →</a> — Boulder foldable net, adjusts to regulation height.</p>\n<p><a href=\"/what-to-buy/tennis/\">Full tennis gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Rally to 10","summary":"Two players rally back and forth, count to 10 without missing. 15 minutes. Ages 11-12.","sport":"tennis","ages":["11-12"],"fundamental":"match-play","progression":"refine","focus":"fundamentals","layer":"situational","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Two players on opposite sides of the net rallying a green tennis ball back and forth, counting each shot they keep in play.","editorial":{"qualityGrade":7,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Cooperative rally; reads slightly basic but voice is clean."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/tennis-rally-to-10.md";
				const url = undefined;
				function rawContent() {
					return "\nTennis is a rally game. Whoever can keep the ball in play longest wins. Rally to 10 is the simplest cooperative game: two players, count every shot, restart at zero on a miss. This builds consistency, the foundation of match play.\n\n**What you need:** Tennis balls (green for 11-12), racquets, full court.\n\n**Setup:** Two players on opposite baselines.\n\n**How to run it:**\n\n1. Player A starts the rally with an underhand feed (no serve).\n2. Players rally back and forth. Each successful shot counts toward a goal of 10.\n3. If anyone misses (ball out, in the net), restart at zero.\n4. Goal: rally of 10 in a row. Then 15. Then 20.\n5. Record the longest rally of the day.\n\n**What to watch:** Are they trying to hit winners or just keep the ball in? Cooperative rally is about keeping the ball in. Don't aim for power.\n\n**If they're struggling:** Smaller court (service boxes only). Bigger margin for error.\n\n**If they've got it:** Add target zones. Each shot has to land in a specific zone (cross-court only, for example).\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Orange tennis balls (12-pack) →](/go/tennis-balls-orange/) — slower-bounce balls for learning groundstrokes.\n\n[Portable tennis net →](/go/tennis-net/) — Boulder foldable net, adjusts to regulation height.\n\n[Full tennis gear guide →](/what-to-buy/tennis/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
