globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Good teams keep their shape. Even spacing between players, defenders and forwards in their correct positions. This drill teaches players to adjust their position based on the ball location without breaking formation.</p>\n<p><strong>What you need:</strong> 6 kids (one team), 1 ball, cones marking a half field.</p>\n<p><strong>Setup:</strong> Team is arranged in a basic formation: 2 defenders, 2 midfielders, 2 forwards. Ball starts with one attacker.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Team possesses the ball using Plant, Open, Strike, Follow.</li>\n<li>As they pass, the whole shape shifts toward the ball side.</li>\n<li>Defenders stay back. Forwards stay up. Midfielders connect.</li>\n<li>If the ball moves left, the shape compresses left.</li>\n<li>If the ball moves right, the shape shifts right.</li>\n<li>Play for 3 minutes of continuous movement.</li>\n</ol>\n<p><strong>What to watch:</strong> Do players stay in their lanes? Or bunch together around the ball?</p>\n<p><strong>If they’re struggling:</strong> Slow the pace. Let them walk through the shape changes first.</p>\n<p><strong>If they’ve got it:</strong> Add an attacking team. Real game pressure forces better shape discipline.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/soccer-ball-size4/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Size 4 soccer ball →</a> — right size for ages 8–12.</p>\n<p><a href=\"/go/soccer-cones-12pk/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Disc cones (50-pack) →</a> — flat cones for gates, grids, and boundary markers.</p>\n<p><a href=\"/what-to-buy/soccer/\">Full soccer gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Shape and Spacing","summary":"Team maintains an organized shape while moving with the ball. 12 minutes. Ages 11-12.","sport":"soccer","ages":["11-12"],"fundamental":"positioning","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Overhead view of a team maintaining a defensive or offensive shape, players evenly distributed across the field.","editorial":{"qualityGrade":7,"originalityGrade":7,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Could use one concrete spacing distance, but overall clean."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/soccer-shape-and-spacing.md";
				const url = undefined;
				function rawContent() {
					return "\nGood teams keep their shape. Even spacing between players, defenders and forwards in their correct positions. This drill teaches players to adjust their position based on the ball location without breaking formation.\n\n**What you need:** 6 kids (one team), 1 ball, cones marking a half field.\n\n**Setup:** Team is arranged in a basic formation: 2 defenders, 2 midfielders, 2 forwards. Ball starts with one attacker.\n\n**How to run it:**\n\n1. Team possesses the ball using Plant, Open, Strike, Follow.\n2. As they pass, the whole shape shifts toward the ball side.\n3. Defenders stay back. Forwards stay up. Midfielders connect.\n4. If the ball moves left, the shape compresses left.\n5. If the ball moves right, the shape shifts right.\n6. Play for 3 minutes of continuous movement.\n\n**What to watch:** Do players stay in their lanes? Or bunch together around the ball?\n\n**If they're struggling:** Slow the pace. Let them walk through the shape changes first.\n\n**If they've got it:** Add an attacking team. Real game pressure forces better shape discipline.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Size 4 soccer ball →](/go/soccer-ball-size4/) — right size for ages 8–12.\n\n[Disc cones (50-pack) →](/go/soccer-cones-12pk/) — flat cones for gates, grids, and boundary markers.\n\n[Full soccer gear guide →](/what-to-buy/soccer/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
