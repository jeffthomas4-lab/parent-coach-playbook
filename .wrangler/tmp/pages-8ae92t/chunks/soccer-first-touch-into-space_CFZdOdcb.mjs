globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The best first touch moves the ball away from pressure and into space. It’s not a stop. It’s a directional cushion that sets up the next move.</p>\n<p><strong>What you need:</strong> 1 soccer ball, 2 kids, 4 cones marking a 12x12 grid.</p>\n<p><strong>Setup:</strong> Receiver inside the grid. Passer outside. Space behind the receiver is “open.” Space in front is “pressure.”</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Passer passes the ball into the grid using Plant, Open, Strike, Follow.</li>\n<li>Receiver must use their first touch to cushion the ball backward into the open space.</li>\n<li>See, Cushion, Settle, Move: watch it come, soft touch to absorb, settle it behind them, move with it.</li>\n<li>Receiver collects the ball in space and keeps it there.</li>\n<li>Do 6 receives, then switch.</li>\n</ol>\n<p><strong>What to watch:</strong> Does the first touch move the ball away from pressure? That’s the goal.</p>\n<p><strong>If they’re struggling:</strong> Increase grid size to 15x15. More space.</p>\n<p><strong>If they’ve got it:</strong> Add a live defender inside the grid who pressures the receiver. The first touch now has to be perfect.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/soccer-ball-size4/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Size 4 soccer ball →</a> — right size for ages 8–12.</p>\n<p><a href=\"/go/soccer-cones-12pk/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Disc cones (50-pack) →</a> — flat cones for gates, grids, and boundary markers.</p>\n<p><a href=\"/what-to-buy/soccer/\">Full soccer gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"First Touch Into Space","summary":"Receive a pass and use the first touch to move into open space. 10 minutes. Ages 11-12.","sport":"soccer","ages":["11-12"],"fundamental":"receiving","progression":"refine","focus":"fundamentals","layer":"situational","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Player receiving a pass and stepping forward to cushion the ball into open space ahead of them.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/soccer-first-touch-into-space.md";
				const url = undefined;
				function rawContent() {
					return "\nThe best first touch moves the ball away from pressure and into space. It's not a stop. It's a directional cushion that sets up the next move.\n\n**What you need:** 1 soccer ball, 2 kids, 4 cones marking a 12x12 grid.\n\n**Setup:** Receiver inside the grid. Passer outside. Space behind the receiver is \"open.\" Space in front is \"pressure.\"\n\n**How to run it:**\n\n1. Passer passes the ball into the grid using Plant, Open, Strike, Follow.\n2. Receiver must use their first touch to cushion the ball backward into the open space.\n3. See, Cushion, Settle, Move: watch it come, soft touch to absorb, settle it behind them, move with it.\n4. Receiver collects the ball in space and keeps it there.\n5. Do 6 receives, then switch.\n\n**What to watch:** Does the first touch move the ball away from pressure? That's the goal.\n\n**If they're struggling:** Increase grid size to 15x15. More space.\n\n**If they've got it:** Add a live defender inside the grid who pressures the receiver. The first touch now has to be perfect.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Size 4 soccer ball →](/go/soccer-ball-size4/) — right size for ages 8–12.\n\n[Disc cones (50-pack) →](/go/soccer-cones-12pk/) — flat cones for gates, grids, and boundary markers.\n\n[Full soccer gear guide →](/what-to-buy/soccer/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
