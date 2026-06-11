globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The wall returns every pass the same speed and angle it came in. That forces the player to be accurate and teaches them to anticipate the return. No partner needed. The wall is always there.</p>\n<p><strong>What you need:</strong> 1 soccer ball. A wall or fence. 8 feet of space in front of it.</p>\n<p><strong>Setup:</strong> Kid stands 8 feet from a wall.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Kid passes the ball to the wall using Plant, Open, Strike, Follow.</li>\n<li>Ball comes back. Kid receives using See, Cushion, Settle, Move.</li>\n<li>Kid passes again immediately.</li>\n<li>Continuous for 30 seconds. Count the passes.</li>\n<li>Rest. Do 3 rounds and try to beat the count.</li>\n</ol>\n<p><strong>What to watch:</strong> How many clean passes before an error? Consistency matters more than power.</p>\n<p><strong>If they’re struggling:</strong> Move back to 10 feet. Slower pace.</p>\n<p><strong>If they’ve got it:</strong> Move up to 6 feet from the wall. Tighter angle, less time to react.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/soccer-ball-size4/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Size 4 soccer ball →</a> — right size for ages 8–12.</p>\n<p><a href=\"/what-to-buy/soccer/\">Full soccer gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Wall Passing Against a Wall","summary":"Pass the ball to a wall, trap the rebound, and pass again. 8 minutes. Ages 8-10, 11-12.","sport":"soccer","ages":["8-10","11-12"],"fundamental":"passing","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Player passing a ball to a wall 8 feet away, then receiving the rebound with a cushioned first touch.","editorial":{"qualityGrade":8,"originalityGrade":8,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Wall-as-partner framing is sharp; consistency-over-power coaching point lands."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/soccer-wall-passing-against-wall.md";
				const url = undefined;
				function rawContent() {
					return "\nThe wall returns every pass the same speed and angle it came in. That forces the player to be accurate and teaches them to anticipate the return. No partner needed. The wall is always there.\n\n**What you need:** 1 soccer ball. A wall or fence. 8 feet of space in front of it.\n\n**Setup:** Kid stands 8 feet from a wall.\n\n**How to run it:**\n\n1. Kid passes the ball to the wall using Plant, Open, Strike, Follow.\n2. Ball comes back. Kid receives using See, Cushion, Settle, Move.\n3. Kid passes again immediately.\n4. Continuous for 30 seconds. Count the passes.\n5. Rest. Do 3 rounds and try to beat the count.\n\n**What to watch:** How many clean passes before an error? Consistency matters more than power.\n\n**If they're struggling:** Move back to 10 feet. Slower pace.\n\n**If they've got it:** Move up to 6 feet from the wall. Tighter angle, less time to react.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Size 4 soccer ball →](/go/soccer-ball-size4/) — right size for ages 8–12.\n\n[Full soccer gear guide →](/what-to-buy/soccer/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
