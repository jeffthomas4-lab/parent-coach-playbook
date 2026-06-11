globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Possession soccer builds understanding of movement, positioning, and passing rhythm. This 7v7 forces players to think about how to keep the ball against pressure.</p>\n<p><strong>Equipment needed:</strong> One soccer ball, cones to mark a 50-by-40-yard field with a midline, 14 kids.</p>\n<p><strong>Setup:</strong> Divide kids into two teams of 7. Mark a 50-by-40-yard field with a midline.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>One team starts with the ball and tries to complete 10 consecutive passes.</li>\n<li>If they reach 10, they score a point and keep the ball.</li>\n<li>If the other team intercepts, that team goes for 10 passes.</li>\n<li>No goals needed. Only possession counts.</li>\n<li>Play for 30 minutes, tracking points.</li>\n</ol>\n<p><strong>What to look for:</strong> Movement off the ball and passing angles. Do players move to create options for the passer? Do they see passing lanes early?</p>\n<p><strong>Variation:</strong> For younger kids (13), reduce to 6 passes to score. For older kids (14), add a rule: passes in the opponent’s half count as 2 points instead of 1.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/soccer-ball-size5/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Size 5 soccer ball →</a> — regulation ball for ages 13 and up.</p>\n<p><a href=\"/go/soccer-cones-12pk/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Disc cones (50-pack) →</a> — flat cones for gates, grids, and boundary markers.</p>\n<p><a href=\"/what-to-buy/soccer/\">Full soccer gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Possession 7v7","summary":"7v7 scrimmage with the goal to keep possession for 10 passes. 30 minutes. Ages 13-14+.","sport":"soccer","ages":["13-14"],"focus":"scrimmage","layer":"skills","fundamental":"scrimmage","progression":"refine","illustrationBrief":"Seven v seven possession battle in constrained space","publishedAt":"2026-04-07T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Standard 7v7 possession scrimmage. Soccer vocab correct."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/soccer-possession-7v7-ages-13-14.md";
				const url = undefined;
				function rawContent() {
					return "\nPossession soccer builds understanding of movement, positioning, and passing rhythm. This 7v7 forces players to think about how to keep the ball against pressure.\n\n**Equipment needed:** One soccer ball, cones to mark a 50-by-40-yard field with a midline, 14 kids.\n\n**Setup:** Divide kids into two teams of 7. Mark a 50-by-40-yard field with a midline.\n\n**How to run it:**\n\n1. One team starts with the ball and tries to complete 10 consecutive passes.\n2. If they reach 10, they score a point and keep the ball.\n3. If the other team intercepts, that team goes for 10 passes.\n4. No goals needed. Only possession counts.\n5. Play for 30 minutes, tracking points.\n\n**What to look for:** Movement off the ball and passing angles. Do players move to create options for the passer? Do they see passing lanes early?\n\n**Variation:** For younger kids (13), reduce to 6 passes to score. For older kids (14), add a rule: passes in the opponent's half count as 2 points instead of 1.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Size 5 soccer ball →](/go/soccer-ball-size5/) — regulation ball for ages 13 and up.\n\n[Disc cones (50-pack) →](/go/soccer-cones-12pk/) — flat cones for gates, grids, and boundary markers.\n\n[Full soccer gear guide →](/what-to-buy/soccer/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
