globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Zone defense means players defend an area, not a person. This teaches kids to stay in their lane and not follow the ball around aimlessly. Discipline and positioning first.</p>\n<p><strong>What you need:</strong> 4-6 kids, 1 ball, cones marking 4 zones in a 30x20 field.</p>\n<p><strong>Setup:</strong> Field is divided into 4 equal zones. One defender in each zone. Attackers pass the ball around.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Attackers pass the ball using Plant, Open, Strike, Follow.</li>\n<li>Defenders stay inside their zone using Drop, Show, Stay, Win.</li>\n<li>Ball moves. Defender moves within their zone to stay between the ball and goal.</li>\n<li>If the ball leaves the zone, that defender relaxes and helps cover the new zone from behind.</li>\n<li>Play for 2 minutes.</li>\n</ol>\n<p><strong>What to watch:</strong> Do defenders stay in their zone? Or chase the ball across the field?</p>\n<p><strong>If they’re struggling:</strong> Make the zones bigger. Less ground to cover.</p>\n<p><strong>If they’ve got it:</strong> Make the zones smaller. Tighter space demands better positioning.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/soccer-ball-size4/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Size 4 soccer ball →</a> — right size for ages 8–12.</p>\n<p><a href=\"/go/soccer-cones-12pk/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Disc cones (50-pack) →</a> — flat cones for gates, grids, and boundary markers.</p>\n<p><a href=\"/what-to-buy/soccer/\">Full soccer gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Stay in Your Zone","summary":"Player defends a specific zone and doesn't leave it. 10 minutes. Ages 8-10.","sport":"soccer","ages":["8-10"],"fundamental":"positioning","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Field divided into zones with defender in one zone, staying in position as the ball moves.","editorial":{"qualityGrade":7,"originalityGrade":7,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Zone-defense intro; could note that pure zone is rare in 8-10 game play."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/soccer-stay-in-your-zone.md";
				const url = undefined;
				function rawContent() {
					return "\nZone defense means players defend an area, not a person. This teaches kids to stay in their lane and not follow the ball around aimlessly. Discipline and positioning first.\n\n**What you need:** 4-6 kids, 1 ball, cones marking 4 zones in a 30x20 field.\n\n**Setup:** Field is divided into 4 equal zones. One defender in each zone. Attackers pass the ball around.\n\n**How to run it:**\n\n1. Attackers pass the ball using Plant, Open, Strike, Follow.\n2. Defenders stay inside their zone using Drop, Show, Stay, Win.\n3. Ball moves. Defender moves within their zone to stay between the ball and goal.\n4. If the ball leaves the zone, that defender relaxes and helps cover the new zone from behind.\n5. Play for 2 minutes.\n\n**What to watch:** Do defenders stay in their zone? Or chase the ball across the field?\n\n**If they're struggling:** Make the zones bigger. Less ground to cover.\n\n**If they've got it:** Make the zones smaller. Tighter space demands better positioning.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Size 4 soccer ball →](/go/soccer-ball-size4/) — right size for ages 8–12.\n\n[Disc cones (50-pack) →](/go/soccer-cones-12pk/) — flat cones for gates, grids, and boundary markers.\n\n[Full soccer gear guide →](/what-to-buy/soccer/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
