globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Stations teach kids that every shot is different. Distance changes. Angle changes. They learn to adjust. Dead-ball shooting is boring. Stations add variety and challenge.</p>\n<p><strong>What you need:</strong> 1 soccer ball per child. A goal or net. 3 cones marking shooting spots.</p>\n<p><strong>Setup:</strong> Mark 3 spots around the goal. Spot 1 is 12 feet directly in front. Spot 2 is 15 feet at a 45-degree angle. Spot 3 is 10 feet from the side.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Child shoots from Spot 1. Using Plant, Lock, Strike, Finish. 3 shots.</li>\n<li>Move to Spot 2. Different distance and angle. 3 shots.</li>\n<li>Move to Spot 3. Tight angle from the side. 3 shots.</li>\n<li>Rotate back to Spot 1 and repeat.</li>\n<li>2 full rotations (18 shots total).</li>\n</ol>\n<p><strong>What to watch:</strong> Do they adjust their plant foot and ankle lock for each angle? Or use the same motion every time?</p>\n<p><strong>If they’re struggling:</strong> Reduce shots per station to 2. Make the spots easier (more straight on).</p>\n<p><strong>If they’ve got it:</strong> Add a defender at one station who pressures after the shot is released.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/soccer-ball-size4/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Size 4 soccer ball →</a> — right size for ages 8–12.</p>\n<p><a href=\"/go/soccer-cones-12pk/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Disc cones (50-pack) →</a> — flat cones for gates, grids, and boundary markers.</p>\n<p><a href=\"/what-to-buy/soccer/\">Full soccer gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Shooting Stations","summary":"Rotate through 3 shooting spots at different angles and distances. 12 minutes. Ages 8-10.","sport":"soccer","ages":["8-10"],"fundamental":"shooting","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Overhead view of 3 spots around a goal at different distances and angles, players rotating through each.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Three-station rotation is concrete; angle adjustments well-flagged."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/soccer-shooting-stations.md";
				const url = undefined;
				function rawContent() {
					return "\nStations teach kids that every shot is different. Distance changes. Angle changes. They learn to adjust. Dead-ball shooting is boring. Stations add variety and challenge.\n\n**What you need:** 1 soccer ball per child. A goal or net. 3 cones marking shooting spots.\n\n**Setup:** Mark 3 spots around the goal. Spot 1 is 12 feet directly in front. Spot 2 is 15 feet at a 45-degree angle. Spot 3 is 10 feet from the side.\n\n**How to run it:**\n\n1. Child shoots from Spot 1. Using Plant, Lock, Strike, Finish. 3 shots.\n2. Move to Spot 2. Different distance and angle. 3 shots.\n3. Move to Spot 3. Tight angle from the side. 3 shots.\n4. Rotate back to Spot 1 and repeat.\n5. 2 full rotations (18 shots total).\n\n**What to watch:** Do they adjust their plant foot and ankle lock for each angle? Or use the same motion every time?\n\n**If they're struggling:** Reduce shots per station to 2. Make the spots easier (more straight on).\n\n**If they've got it:** Add a defender at one station who pressures after the shot is released.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Size 4 soccer ball →](/go/soccer-ball-size4/) — right size for ages 8–12.\n\n[Disc cones (50-pack) →](/go/soccer-cones-12pk/) — flat cones for gates, grids, and boundary markers.\n\n[Full soccer gear guide →](/what-to-buy/soccer/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
