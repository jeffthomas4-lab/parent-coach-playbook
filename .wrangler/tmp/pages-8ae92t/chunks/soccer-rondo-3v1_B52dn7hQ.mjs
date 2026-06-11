globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Rondo is the best possession drill. Three attackers have to move, pass, and think under pressure from one defender. The defender learns to pressure. The attackers learn to escape pressure with quick passes.</p>\n<p><strong>What you need:</strong> 1 soccer ball, 4 kids, 4 cones marking a 15-foot diameter circle.</p>\n<p><strong>Setup:</strong> Three kids stand inside a circle. One defender in the middle. The circle is marked with cones.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Using Plant, Open, Strike, Follow, outside players pass the ball inside the circle.</li>\n<li>Defender presses the person with the ball.</li>\n<li>If the passer is touched or intercepted before the pass, roles swap.</li>\n<li>If the defenders completes 5 interceptions, they rotate out.</li>\n<li>Play 3-minute rounds.</li>\n</ol>\n<p><strong>What to watch:</strong> Are the attackers using one-touch passes or taking multiple touches? One-touch is faster and harder to defend.</p>\n<p><strong>If they’re struggling:</strong> Make the circle bigger (18 feet). Give attackers more space.</p>\n<p><strong>If they’ve got it:</strong> Shrink the circle to 12 feet. Less space, more pressure.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/soccer-ball-size4/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Size 4 soccer ball →</a> — right size for ages 8–12.</p>\n<p><a href=\"/go/soccer-cones-12pk/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Disc cones (50-pack) →</a> — flat cones for gates, grids, and boundary markers.</p>\n<p><a href=\"/what-to-buy/soccer/\">Full soccer gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Rondo 3v1","summary":"Three keep-away players maintain possession against one defender in a circle. 12 minutes. Ages 11-12.","sport":"soccer","ages":["11-12"],"fundamental":"passing","progression":"refine","focus":"fundamentals","layer":"situational","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Four players in a circle, three passing among themselves while one defender in the middle tries to intercept.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Cue framework lands well; circle rotation rules are clear."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/soccer-rondo-3v1.md";
				const url = undefined;
				function rawContent() {
					return "\nRondo is the best possession drill. Three attackers have to move, pass, and think under pressure from one defender. The defender learns to pressure. The attackers learn to escape pressure with quick passes.\n\n**What you need:** 1 soccer ball, 4 kids, 4 cones marking a 15-foot diameter circle.\n\n**Setup:** Three kids stand inside a circle. One defender in the middle. The circle is marked with cones.\n\n**How to run it:**\n\n1. Using Plant, Open, Strike, Follow, outside players pass the ball inside the circle.\n2. Defender presses the person with the ball.\n3. If the passer is touched or intercepted before the pass, roles swap.\n4. If the defenders completes 5 interceptions, they rotate out.\n5. Play 3-minute rounds.\n\n**What to watch:** Are the attackers using one-touch passes or taking multiple touches? One-touch is faster and harder to defend.\n\n**If they're struggling:** Make the circle bigger (18 feet). Give attackers more space.\n\n**If they've got it:** Shrink the circle to 12 feet. Less space, more pressure.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Size 4 soccer ball →](/go/soccer-ball-size4/) — right size for ages 8–12.\n\n[Disc cones (50-pack) →](/go/soccer-cones-12pk/) — flat cones for gates, grids, and boundary markers.\n\n[Full soccer gear guide →](/what-to-buy/soccer/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
