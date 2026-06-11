globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>A volley is a shot hit before the ball bounces. Short, punching motion. No big swing. The racquet meets the ball in front of the body and pushes it back. Most beginners try to swing big and miss. The right volley is a punch.</p>\n<p><strong>What you need:</strong> Tennis balls, racquet, tennis court.</p>\n<p><strong>Setup:</strong> Player at the net. Coach across the net feeding short balls.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Player stands 3 feet from the net, racquet held in front, head ready.</li>\n<li>Coach feeds a soft ball to the volley height (chest level).</li>\n<li>Player punches the volley with a small forward motion. Almost no backswing.</li>\n<li>Ball clears back over the net.</li>\n<li>Do 8 volleys. Mix forehand volleys and backhand volleys.</li>\n</ol>\n<p><strong>What to watch:</strong> Backswing. A long backswing is wrong. The racquet barely goes back. Punch through.</p>\n<p><strong>If they’re struggling:</strong> Slower feeds. Bigger ball.</p>\n<p><strong>If they’ve got it:</strong> Add a partner who feeds and the player volleys back continuously.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/tennis-balls-orange/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Orange tennis balls (12-pack) →</a> — slower-bounce balls for learning groundstrokes.</p>\n<p><a href=\"/go/tennis-net/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Portable tennis net →</a> — Boulder foldable net, adjusts to regulation height.</p>\n<p><a href=\"/what-to-buy/tennis/\">Full tennis gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Volley at the Net","summary":"Hit short volleys from the net without backswing. 10 minutes. Ages 8-10 and 11-12.","sport":"tennis","ages":["8-10","11-12"],"fundamental":"volley","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Player at the net with the racquet held in front of the body, punching a short volley back over the net with a small forward motion.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Net volley with punch-not-swing distinction."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/tennis-volley-at-net.md";
				const url = undefined;
				function rawContent() {
					return "\nA volley is a shot hit before the ball bounces. Short, punching motion. No big swing. The racquet meets the ball in front of the body and pushes it back. Most beginners try to swing big and miss. The right volley is a punch.\n\n**What you need:** Tennis balls, racquet, tennis court.\n\n**Setup:** Player at the net. Coach across the net feeding short balls.\n\n**How to run it:**\n\n1. Player stands 3 feet from the net, racquet held in front, head ready.\n2. Coach feeds a soft ball to the volley height (chest level).\n3. Player punches the volley with a small forward motion. Almost no backswing.\n4. Ball clears back over the net.\n5. Do 8 volleys. Mix forehand volleys and backhand volleys.\n\n**What to watch:** Backswing. A long backswing is wrong. The racquet barely goes back. Punch through.\n\n**If they're struggling:** Slower feeds. Bigger ball.\n\n**If they've got it:** Add a partner who feeds and the player volleys back continuously.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Orange tennis balls (12-pack) →](/go/tennis-balls-orange/) — slower-bounce balls for learning groundstrokes.\n\n[Portable tennis net →](/go/tennis-net/) — Boulder foldable net, adjusts to regulation height.\n\n[Full tennis gear guide →](/what-to-buy/tennis/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
