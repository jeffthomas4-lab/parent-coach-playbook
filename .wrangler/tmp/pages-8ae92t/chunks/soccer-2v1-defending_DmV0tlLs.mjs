globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Outnumbered defense teaches positioning and communication. One defender can’t mark both attackers. They have to pick one to pressure and hope for an interception or poor pass.</p>\n<p><strong>What you need:</strong> 1 soccer ball, 2 attackers, 1 defender, a goal, 25 feet of space.</p>\n<p><strong>Setup:</strong> Attackers start 25 feet from goal with the ball. Defender starts 10 feet from goal.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Attackers pass and move, trying to find space for a shot using Plant, Open, Strike, Follow.</li>\n<li>Defender uses Drop, Show, Stay, Win to pressure one attacker.</li>\n<li>The other attacker becomes an open passing option.</li>\n<li>Defender has to read the pass and intercept or let the attacker shoot.</li>\n<li>4 attempts. If defenders get a clean sheet, they win. If attackers score, they win.</li>\n</ol>\n<p><strong>What to watch:</strong> Does the defender pressure or drop deep? Both are valid strategies depending on the situation.</p>\n<p><strong>If they’re struggling:</strong> Make the goal bigger. Give the defenders an easier task.</p>\n<p><strong>If they’ve got it:</strong> Add a second defender so it becomes 2v2. Now defenders can help each other.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/soccer-ball-size4/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Size 4 soccer ball →</a> — right size for ages 8–12.</p>\n<p><a href=\"/what-to-buy/soccer/\">Full soccer gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"2v1 Defending","summary":"One defender stops two attackers from scoring. 10 minutes. Ages 11-12.","sport":"soccer","ages":["11-12"],"fundamental":"defending","progression":"refine","focus":"fundamentals","layer":"situational","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"One defender positioning themselves between two attackers and the goal, reading passing lanes.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/soccer-2v1-defending.md";
				const url = undefined;
				function rawContent() {
					return "\nOutnumbered defense teaches positioning and communication. One defender can't mark both attackers. They have to pick one to pressure and hope for an interception or poor pass.\n\n**What you need:** 1 soccer ball, 2 attackers, 1 defender, a goal, 25 feet of space.\n\n**Setup:** Attackers start 25 feet from goal with the ball. Defender starts 10 feet from goal.\n\n**How to run it:**\n\n1. Attackers pass and move, trying to find space for a shot using Plant, Open, Strike, Follow.\n2. Defender uses Drop, Show, Stay, Win to pressure one attacker.\n3. The other attacker becomes an open passing option.\n4. Defender has to read the pass and intercept or let the attacker shoot.\n5. 4 attempts. If defenders get a clean sheet, they win. If attackers score, they win.\n\n**What to watch:** Does the defender pressure or drop deep? Both are valid strategies depending on the situation.\n\n**If they're struggling:** Make the goal bigger. Give the defenders an easier task.\n\n**If they've got it:** Add a second defender so it becomes 2v2. Now defenders can help each other.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Size 4 soccer ball →](/go/soccer-ball-size4/) — right size for ages 8–12.\n\n[Full soccer gear guide →](/what-to-buy/soccer/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
