globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Peppering is partners passing back and forth. It builds rhythm and teaches young players to control the ball rather than just react.</p>\n<p><strong>Equipment needed:</strong> 4 balls, no net needed.</p>\n<p><strong>Setup:</strong> Two players stand about 15 feet apart, facing each other, in ready position.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>One partner tosses the ball gently to the other (chest height).</li>\n<li>Receiving player passes the ball back to the feeder.</li>\n<li>Feeder passes it again. The pattern is: toss, pass, pass, pass, and so on.</li>\n<li>Goal is to keep the pattern going for 10 consecutive passes. If the ball dies, start over.</li>\n<li>Do 5 sets of 10 passes per pair.</li>\n</ol>\n<p><strong>What to look for:</strong></p>\n<p>The toss starts the rhythm. If the toss is too high or too low, the pass will be off. The passes should be controllable and consistent. Each player should feel like they’re controlling the ball, not just hitting it back. If a player is reaching or off-balance, the rhythm is broken. Communication helps: players can call “Here” or count passes to stay in sync.</p>\n<p><strong>Variation:</strong> Add a set and pass. One player passes to the other, who sets it back (overhead pass), who passes it again. This introduces a second skill while maintaining the rhythm.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/volleyball-volley-lite/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Volley Lite training ball →</a> — lightweight ball for beginners learning to pass.</p>\n<p><a href=\"/go/volleyball-net/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Portable volleyball net →</a> — 32-ft set with adjustable steel poles.</p>\n<p><a href=\"/what-to-buy/volleyball/\">Full volleyball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Peppering with a Partner","summary":"Build consistency and rhythm in back-and-forth passing. 12 minutes.","sport":"volleyball","ages":["8-10"],"focus":"fundamentals","layer":"foundations","fundamental":"passing","progression":"intro","illustrationBrief":"Partner passing back and forth","publishedAt":"2026-03-25T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":7,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Standard pepper drill. Pattern description is clear."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/volleyball-peppering-with-partner-ages-8-10.md";
				const url = undefined;
				function rawContent() {
					return "\nPeppering is partners passing back and forth. It builds rhythm and teaches young players to control the ball rather than just react.\n\n**Equipment needed:** 4 balls, no net needed.\n\n**Setup:** Two players stand about 15 feet apart, facing each other, in ready position.\n\n**How to run it:**\n\n1. One partner tosses the ball gently to the other (chest height).\n2. Receiving player passes the ball back to the feeder.\n3. Feeder passes it again. The pattern is: toss, pass, pass, pass, and so on.\n4. Goal is to keep the pattern going for 10 consecutive passes. If the ball dies, start over.\n5. Do 5 sets of 10 passes per pair.\n\n**What to look for:**\n\nThe toss starts the rhythm. If the toss is too high or too low, the pass will be off. The passes should be controllable and consistent. Each player should feel like they're controlling the ball, not just hitting it back. If a player is reaching or off-balance, the rhythm is broken. Communication helps: players can call \"Here\" or count passes to stay in sync.\n\n**Variation:** Add a set and pass. One player passes to the other, who sets it back (overhead pass), who passes it again. This introduces a second skill while maintaining the rhythm.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Volley Lite training ball →](/go/volleyball-volley-lite/) — lightweight ball for beginners learning to pass.\n\n[Portable volleyball net →](/go/volleyball-net/) — 32-ft set with adjustable steel poles.\n\n[Full volleyball gear guide →](/what-to-buy/volleyball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
