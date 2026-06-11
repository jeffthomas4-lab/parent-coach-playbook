globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>A rondo is the best passing drill. Five players pass around one defender who’s trying to intercept. It teaches first touch, spacing, and decision-making under pressure.</p>\n<p><strong>Equipment needed:</strong> One soccer ball, cones to mark a 15-by-15-yard square, 6 kids.</p>\n<p><strong>Setup:</strong> Five kids stand at points around a square. One kid is in the middle as the defender.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>The five attackers pass the ball around the middle defender, trying not to get intercepted.</li>\n<li>They count consecutive passes out loud.</li>\n<li>When the defender intercepts or the attackers lose the ball, they swap: defender comes out, whichever attacker lost it goes in.</li>\n<li>Play for 20 minutes total, rotating through all kids.</li>\n</ol>\n<p><strong>What to look for:</strong> First-touch quality and movement. If the first touch is bad, the next pass will be bad. Also watch how attackers move to create passing angles for their teammates.</p>\n<p><strong>Variation:</strong> For younger kids (11), make the square bigger (20 by 20 yards) so there’s more space. For older kids (12), add a second defender to create more pressure.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/soccer-ball-size4/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Size 4 soccer ball →</a> — right size for ages 8–12.</p>\n<p><a href=\"/go/soccer-cones-12pk/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Disc cones (50-pack) →</a> — flat cones for gates, grids, and boundary markers.</p>\n<p><a href=\"/what-to-buy/soccer/\">Full soccer gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Rondo","summary":"Keep-away game with five attackers and one defender. 20 minutes. Ages 11-12.","sport":"soccer","ages":["11-12"],"focus":"situational","layer":"skills","fundamental":"passing","progression":"build","illustrationBrief":"Circle passing drill with pressure from center","publishedAt":"2026-03-04T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Solid rondo write-up; first-touch coaching point sharp."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/soccer-rondo-ages-11-12.md";
				const url = undefined;
				function rawContent() {
					return "\nA rondo is the best passing drill. Five players pass around one defender who's trying to intercept. It teaches first touch, spacing, and decision-making under pressure.\n\n**Equipment needed:** One soccer ball, cones to mark a 15-by-15-yard square, 6 kids.\n\n**Setup:** Five kids stand at points around a square. One kid is in the middle as the defender.\n\n**How to run it:**\n\n1. The five attackers pass the ball around the middle defender, trying not to get intercepted.\n2. They count consecutive passes out loud.\n3. When the defender intercepts or the attackers lose the ball, they swap: defender comes out, whichever attacker lost it goes in.\n4. Play for 20 minutes total, rotating through all kids.\n\n**What to look for:** First-touch quality and movement. If the first touch is bad, the next pass will be bad. Also watch how attackers move to create passing angles for their teammates.\n\n**Variation:** For younger kids (11), make the square bigger (20 by 20 yards) so there's more space. For older kids (12), add a second defender to create more pressure.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Size 4 soccer ball →](/go/soccer-ball-size4/) — right size for ages 8–12.\n\n[Disc cones (50-pack) →](/go/soccer-cones-12pk/) — flat cones for gates, grids, and boundary markers.\n\n[Full soccer gear guide →](/what-to-buy/soccer/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
