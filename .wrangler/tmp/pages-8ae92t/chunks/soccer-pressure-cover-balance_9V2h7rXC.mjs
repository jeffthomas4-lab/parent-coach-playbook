globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Defensive shape means one defender pressures the ball, one defender covers the most dangerous pass, and one defender balances to the opposite side. This teaches positional defense.</p>\n<p><strong>What you need:</strong> 3 defenders, 3 attackers, 1 ball, a field marked with cones.</p>\n<p><strong>Setup:</strong> Attackers and defenders spread across a 30x20 field. Defenders start in a line shape.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>One defender presses the ball carrier (Pressure).</li>\n<li>One defender covers the pass option closest to goal (Cover).</li>\n<li>One defender balances to the opposite side, ready to cover other passes (Balance).</li>\n<li>Attackers pass the ball around. Defenders adjust their shape with each pass.</li>\n<li>Play for 2 minutes. Count defensive touches. If defenders intercept, that’s a win.</li>\n</ol>\n<p><strong>What to watch:</strong> Do the defenders move as a unit? Or do they stand still and watch?</p>\n<p><strong>If they’re struggling:</strong> Only 2 attackers instead of 3. Less passing options.</p>\n<p><strong>If they’ve got it:</strong> Add a fourth attacker. Defenders have to work harder to maintain shape.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/soccer-ball-size4/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Size 4 soccer ball →</a> — right size for ages 8–12.</p>\n<p><a href=\"/go/soccer-cones-12pk/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Disc cones (50-pack) →</a> — flat cones for gates, grids, and boundary markers.</p>\n<p><a href=\"/what-to-buy/soccer/\">Full soccer gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Pressure Cover Balance","summary":"Three defenders work together to pressure, cover, and balance. 12 minutes. Ages 8-10.","sport":"soccer","ages":["8-10"],"fundamental":"defending","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"One defender pressuring the ball, one defending the first passing option, one covering deep space.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Classic defensive-shape concept made concrete. Soccer vocab correct."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/soccer-pressure-cover-balance.md";
				const url = undefined;
				function rawContent() {
					return "\nDefensive shape means one defender pressures the ball, one defender covers the most dangerous pass, and one defender balances to the opposite side. This teaches positional defense.\n\n**What you need:** 3 defenders, 3 attackers, 1 ball, a field marked with cones.\n\n**Setup:** Attackers and defenders spread across a 30x20 field. Defenders start in a line shape.\n\n**How to run it:**\n\n1. One defender presses the ball carrier (Pressure).\n2. One defender covers the pass option closest to goal (Cover).\n3. One defender balances to the opposite side, ready to cover other passes (Balance).\n4. Attackers pass the ball around. Defenders adjust their shape with each pass.\n5. Play for 2 minutes. Count defensive touches. If defenders intercept, that's a win.\n\n**What to watch:** Do the defenders move as a unit? Or do they stand still and watch?\n\n**If they're struggling:** Only 2 attackers instead of 3. Less passing options.\n\n**If they've got it:** Add a fourth attacker. Defenders have to work harder to maintain shape.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Size 4 soccer ball →](/go/soccer-ball-size4/) — right size for ages 8–12.\n\n[Disc cones (50-pack) →](/go/soccer-cones-12pk/) — flat cones for gates, grids, and boundary markers.\n\n[Full soccer gear guide →](/what-to-buy/soccer/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
